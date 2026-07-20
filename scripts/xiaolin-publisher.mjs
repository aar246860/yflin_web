import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const forbidden = /diary\.txt|memory[\\/]|private|confidential|unpublished|student|collaborator|password|email|phone|審查中|未發表|保密|學生|合作者|聯絡方式/i;

function parseFrontmatter(source) {
  if (!source.startsWith("---")) return null;
  const end = source.indexOf("\n---", 3);
  if (end < 0) return null;
  const meta = {};
  for (const line of source.slice(3, end).split(/\r?\n/)) {
    const match = line.match(/^([\w-]+):\s*["']?(.*?)["']?$/);
    if (match) meta[match[1]] = match[2].trim();
  }
  return { meta, source };
}

function validate(file, parsed) {
  const errors = [];
  if (!parsed) errors.push("missing frontmatter");
  if (parsed && parsed.meta.public !== "true") errors.push("public must be true");
  if (parsed && parsed.meta.autoPublish !== "true") errors.push("autoPublish must be true");
  if (parsed && !parsed.meta.title) errors.push("title is missing");
  if (parsed && !/^\d{4}-\d{2}-\d{2}$/.test(parsed.meta.date ?? "")) errors.push("date must use YYYY-MM-DD");
  if (forbidden.test(`${file}\n${parsed?.source ?? ""}`)) errors.push("safety marker found");
  return errors;
}

export function runPublisher({ root = process.cwd(), promote = false } = {}) {
  if (process.env.XIAOLIN_PUBLISH_ENABLED === "false") return { status: "disabled" };
  const sourceDir = resolve(root, "src/content/xiaolin");
  const candidates = readdirSync(sourceDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const path = join(sourceDir, file);
      const parsed = parseFrontmatter(readFileSync(path, "utf8"));
      return { file: path, parsed };
    })
    .filter(({ parsed }) => parsed?.meta.draft === "true")
    .sort((a, b) => (b.parsed.meta.date ?? "").localeCompare(a.parsed.meta.date ?? ""));

  const candidate = candidates[0];
  if (!candidate) return { status: "idle", reason: "no auto-publish draft" };
  const errors = validate(candidate.file, candidate.parsed);
  if (errors.length) return { status: "draft", file: candidate.file, errors };
  if (!promote) return { status: "ready", file: candidate.file };

  const promoted = candidate.parsed.source
    .replace(/^draft:\s*true\s*$/m, "draft: false")
    .replace(/^autoPublish:\s*true\s*$/m, "autoPublish: false");
  writeFileSync(candidate.file, promoted, "utf8");
  return { status: "promoted", file: candidate.file };
}

if (process.argv[1]?.endsWith("xiaolin-publisher.mjs")) {
  const result = runPublisher({ promote: process.argv.includes("--promote") });
  console.log(JSON.stringify(result));
}
