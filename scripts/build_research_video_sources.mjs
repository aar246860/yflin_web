import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const PAPERS_DIR = process.argv[2] ?? process.env.PUBLICATION_PAPERS_DIR;
if (!PAPERS_DIR) {
  throw new Error("Pass the publication-paper directory as the first argument or set PUBLICATION_PAPERS_DIR.");
}
const PUBLICATIONS_FILE = path.join(ROOT, "src", "data", "publications.generated.json");
const SOURCE_ROOT = path.join(ROOT, "research-videos");
const PDF_ROOT = path.join(SOURCE_ROOT, "source-pdfs");
const TEXT_ROOT = path.join(SOURCE_ROOT, "source-text");
const LOCAL_INDEX_FILE = path.join(SOURCE_ROOT, "source-index.json");
const PUBLIC_MANIFEST_FILE = path.join(SOURCE_ROOT, "source-manifest.json");
const SCAN_ROOT = path.join(os.tmpdir(), "yflin-research-video-sources");
const COMPLETED_DOIS = new Set([
  "10.1002/2017wr021115",
  "10.1016/j.csite.2026.107695",
]);

class SourceIndexError extends Error {
  constructor(message) {
    super(message);
    this.name = "SourceIndexError";
  }
}

const sha256 = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const normalizeDoi = (value) => value
  .normalize("NFKC")
  .toLowerCase()
  .replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "")
  .replace(/\s+/g, "")
  .replace(/[‐‑‒–—−]/g, "-")
  .replace(/[).,;:]+$/g, "");
const toPosix = (file) => path.relative(ROOT, file).replaceAll(path.sep, "/");

const extractPdfText = (file, firstPagesOnly) => {
  const pageArgs = firstPagesOnly ? ["-f", "1", "-l", "5"] : [];
  return execFileSync(
    "pdftotext",
    [...pageArgs, "-layout", "-enc", "UTF-8", file, "-"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, windowsHide: true },
  );
};

const pageCount = (file) => {
  const output = execFileSync("pdfinfo", [file], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  });
  const match = output.match(/^Pages:\s+(\d+)$/m);
  if (!match) throw new SourceIndexError(`Could not read page count from ${file}`);
  return Number.parseInt(match[1], 10);
};

const findSource = (publication, candidates) => {
  const wanted = normalizeDoi(publication.doi);
  const exact = candidates.filter((candidate) => candidate.dois.has(wanted));
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) {
    throw new SourceIndexError(`DOI ${publication.doi} matched multiple PDFs: ${exact.map((item) => item.name).join(", ")}`);
  }
  return null;
};

const publicationRecords = JSON.parse(fs.readFileSync(PUBLICATIONS_FILE, "utf8"));
fs.rmSync(SCAN_ROOT, { force: true, recursive: true });
fs.mkdirSync(SCAN_ROOT, { recursive: true });
process.once("exit", () => fs.rmSync(SCAN_ROOT, { force: true, recursive: true }));
const pdfNames = fs.readdirSync(PAPERS_DIR)
  .filter((name) => name.toLowerCase().endsWith(".pdf"))
  .sort((left, right) => left.localeCompare(right, "en"));
const candidates = pdfNames.map((name, index) => {
  const file = path.join(PAPERS_DIR, name);
  const stagedFile = path.join(SCAN_ROOT, `paper-${index.toString().padStart(3, "0")}.pdf`);
  fs.copyFileSync(file, stagedFile);
  const text = extractPdfText(stagedFile, true);
  const dois = new Set(
    [...text.matchAll(/10\.\d{4,9}\/[\w.()/:;-]+/gi)].map((match) => normalizeDoi(match[0])),
  );
  return { name, file, stagedFile, dois };
});

await Promise.all([
  fsPromises.mkdir(PDF_ROOT, { recursive: true }),
  fsPromises.mkdir(TEXT_ROOT, { recursive: true }),
]);

const records = [];
const matchedSourceNames = new Set();
for (const publication of publicationRecords) {
  const source = findSource(publication, candidates);
  if (!source) {
    records.push({
      id: publication.id,
      doi: publication.doi,
      title: publication.title.en,
      year: publication.year,
      venue: publication.venue,
      status: "missing-source",
    });
    continue;
  }

  matchedSourceNames.add(source.name);
  const pdfTarget = path.join(PDF_ROOT, `${publication.id}.pdf`);
  const textTarget = path.join(TEXT_ROOT, `${publication.id}.txt`);
  await fsPromises.copyFile(source.file, pdfTarget);
  await fsPromises.writeFile(textTarget, extractPdfText(source.stagedFile, false), "utf8");
  records.push({
    id: publication.id,
    doi: publication.doi,
    title: publication.title.en,
    year: publication.year,
    venue: publication.venue,
    theme: publication.primaryTheme,
    tags: publication.secondaryTags,
    status: COMPLETED_DOIS.has(normalizeDoi(publication.doi)) ? "complete" : "pending",
    sourceFileName: source.name,
    sourcePdf: toPosix(pdfTarget),
    sourceText: toPosix(textTarget),
    sourceSha256: sha256(pdfTarget),
    pages: pageCount(source.stagedFile),
  });
}

const missing = records.filter((record) => record.status === "missing-source");
if (missing.length > 0) {
  throw new SourceIndexError(`Missing ${missing.length} publication sources: ${missing.map((record) => record.doi).join(", ")}`);
}

const pendingRecords = records.filter((record) => record.status === "pending");
const completeRecords = records.filter((record) => record.status === "complete");
const unmatchedLocalPdfs = pdfNames.filter((name) => !matchedSourceNames.has(name));
const generatedAt = new Date().toISOString();
const localIndex = {
  generatedAt,
  sourceDirectory: PAPERS_DIR,
  counts: {
    publications: records.length,
    pending: pendingRecords.length,
    complete: completeRecords.length,
    unmatchedLocalPdfs: unmatchedLocalPdfs.length,
  },
  records,
  pendingRecords,
  completeRecords,
  unmatchedLocalPdfs,
};
const publicManifest = {
  generatedAt,
  counts: localIndex.counts,
  records: records.map(({ sourcePdf: _sourcePdf, sourceText: _sourceText, ...record }) => record),
};

await Promise.all([
  fsPromises.writeFile(LOCAL_INDEX_FILE, `${JSON.stringify(localIndex, null, 2)}\n`, "utf8"),
  fsPromises.writeFile(PUBLIC_MANIFEST_FILE, `${JSON.stringify(publicManifest, null, 2)}\n`, "utf8"),
]);
fs.rmSync(SCAN_ROOT, { force: true, recursive: true });
console.log(`Indexed ${records.length} publications: ${pendingRecords.length} pending, ${completeRecords.length} complete.`);
