import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";

const forbidden = [
  /confidential|password|credential|private diary|private memory/i,
  /unpublished manuscript|reviewer report|student record/i,
  /\bCodex\b|automation prompt|editing reminder|daily script|scheduled at/i,
  /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,
  /(?:\+?\d[\s().-]*){9,}/,
  /\bXiaolin\b[\s\S]{0,80}\b(?:is\s+)?(?:unaware|not\s+aware|does\s+not\s+know|doesn['’]t\s+know)\b/i,
  /\bXiaolin\b[\s\S]{0,80}\b(?:secretly\s+monitored|monitored\s+secretly|secretly\s+watched|surveilled)\b/i,
  /\bXiaolin\b[\s\S]{0,80}\b(?:cannot|can't|can\s+not|unable\s+to)\s+(?:answer|respond|reply)\b/i,
  /\b(?:i|we|someone)\b[\s\S]{0,60}\b(?:secretly\s+)?monitor(?:s|ed|ing)?\b[\s\S]{0,60}\bXiaolin\b/i,
  /\b(?:i|we|someone)\b[\s\S]{0,60}\bmonitor(?:s|ed|ing)?\b[\s\S]{0,60}\bXiaolin\b[\s\S]{0,40}\bsecretly\b/i,
];
const creativeModes = new Set([
  "philosophical-note",
  "sequential-comic",
  "leisure-outing",
  "visual-study",
  "absurd-comedy",
]);
const rotationCutover = Date.parse("2026-07-26T13:23:35+08:00");
const counterclawFilenameLike =
  /^\d{4}-\d{2}-\d{2}(?:-\d{4})?-(?:daye|counterclaw)(?:[-_]|$)/i;

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([\w-]+):\s*(.+?)\s*$/);
    if (!field) continue;
    const raw = field[2].trim();
    try {
      meta[field[1]] = JSON.parse(raw);
    } catch {
      meta[field[1]] = raw;
    }
  }
  return { meta, body: match[2], source };
}

function validateSvg(svg, label) {
  const errors = [];
  if (!/<title\b[^>]*>\s*\S[\s\S]*?<\/title\s*>/i.test(svg)) {
    errors.push(`${label}: SVG artwork needs a non-empty title`);
  }
  if (!/<desc\b[^>]*>\s*\S[\s\S]*?<\/desc\s*>/i.test(svg)) {
    errors.push(`${label}: SVG artwork needs a non-empty desc`);
  }
  for (const [pattern, message] of [
    [/<script\b/i, "must not contain scripts"],
    [/\bon[a-z]+\s*=/i, "must not contain event handlers"],
    [/\bjavascript\s*:/i, "must not contain javascript URLs"],
    [/<foreignObject\b/i, "must not contain foreignObject"],
    [/<image\b/i, "must not embed images"],
    [/@font-face\b/i, "must not define external fonts"],
    [/@import\b/i, "must not import stylesheets"],
    [/\burl\s*\(\s*(?![\"']?#)/i, "must not load external resources"],
    [/\b(?:href|xlink:href)\s*=\s*[\"'](?!#)[^\"']+/i, "must not use external references"],
    [/<use\b[^>]*\b(?:href|xlink:href)\s*=\s*[\"'](?!#)/i, "must not reference external symbols"],
  ]) {
    if (pattern.test(svg)) errors.push(`${label}: SVG artwork ${message}`);
  }
  return errors;
}

function svgFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return svgFiles(path);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".svg") ? [path] : [];
  });
}

function validateEntry(file, parsed, root) {
  const errors = [];
  const label = basename(file);
  if (!parsed) return [`${label}: missing frontmatter`];
  const { meta, source } = parsed;
  if (counterclawFilenameLike.test(label) && meta.resident !== "counterclaw") {
    errors.push(`${label}: Daye filename requires the legacy rival resident key`);
  }

  if (meta.public !== true) errors.push(`${label}: public must be true`);
  if (meta.draft !== false) errors.push(`${label}: draft must be false`);
  if (!meta.title) errors.push(`${label}: title is missing`);
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2})?$/.test(String(meta.date ?? ""))) {
    errors.push(`${label}: date must use YYYY-MM-DD or a full ISO 8601 timestamp`);
  }

  if (meta.generated === true && meta.resident !== "counterclaw") {
    if ("operator" in meta) errors.push(`${label}: public entries must not expose an operator`);
    if (!["diary", "doodle", "field-report"].includes(meta.format)) {
      errors.push(`${label}: generated entry format is invalid`);
    }
    const disclosure = String(meta.disclosure ?? "");
    if (
      !disclosure.includes("fictional character") ||
      !disclosure.includes("do not represent")
    ) {
      errors.push(`${label}: generated entry needs the public non-endorsement disclosure`);
    }
    if (!creativeModes.has(meta.creativeMode)) {
      errors.push(`${label}: generated entry needs a valid creativeMode`);
    }
  }

  if (meta.artwork) {
    const artworkPath = String(meta.artwork);
    const safeArtworkPath =
      /^\/images\/xiaolin\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(artworkPath) &&
      !artworkPath.split("/").includes("..");
    const artwork = safeArtworkPath
      ? resolve(root, "public", artworkPath.replace(/^\/+/, ""))
      : null;
    const extension = artworkPath.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
    if (!safeArtworkPath) {
      errors.push(`${label}: artwork must stay under /images/xiaolin/`);
    } else if (!existsSync(artwork)) {
      errors.push(`${label}: artwork is missing at ${meta.artwork}`);
    }
    if (!["svg", "png", "webp", "jpg", "jpeg"].includes(extension)) {
      errors.push(`${label}: artwork format is unsupported`);
    }
    if (artwork && existsSync(artwork) && extension === "svg" && statSync(artwork).size > 120_000) {
      errors.push(`${label}: SVG artwork exceeds 120 KB`);
    }
    if (artwork && existsSync(artwork) && extension === "svg") {
      errors.push(...validateSvg(readFileSync(artwork, "utf8"), label));
    }
    if (artwork && existsSync(artwork) && extension !== "svg" && statSync(artwork).size > 2_500_000) {
      errors.push(`${label}: raster artwork exceeds 2.5 MB`);
    }
    if (!meta.artworkAlt) errors.push(`${label}: artworkAlt is missing`);
  }

  for (const pattern of forbidden) {
    if (pattern.test(source)) errors.push(`${label}: matched safety pattern ${pattern}`);
  }
  return errors;
}

function validateCreativeRotation(entries) {
  const errors = [];
  const ordered = entries
    .filter(
      ({ parsed }) =>
        parsed?.meta.generated === true &&
        parsed.meta.resident !== "counterclaw",
    )
    .sort(
      (a, b) =>
        Date.parse(String(a.parsed.meta.date ?? "")) -
        Date.parse(String(b.parsed.meta.date ?? "")),
    );

  for (let index = 0; index < ordered.length; index += 1) {
    const current = ordered[index];
    const currentTime = Date.parse(String(current.parsed.meta.date ?? ""));
    if (!Number.isFinite(currentTime) || currentTime < rotationCutover) continue;

    const mode = current.parsed.meta.creativeMode;
    const previousThree = ordered.slice(Math.max(0, index - 3), index);
    if (previousThree.some(({ parsed }) => parsed.meta.creativeMode === mode)) {
      errors.push(`${basename(current.file)}: creativeMode repeats within the previous three visits`);
    }

    if (mode === "absurd-comedy") {
      const previousFour = ordered.slice(Math.max(0, index - 4), index);
      if (previousFour.some(({ parsed }) => parsed.meta.creativeMode === mode)) {
        errors.push(`${basename(current.file)}: absurd-comedy repeats within the previous four visits`);
      }
    }
  }
  return errors;
}

export function runPublisher({ root = process.cwd() } = {}) {
  const sourceDir = resolve(root, "src/content/xiaolin");
  const entries = readdirSync(sourceDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => resolve(sourceDir, file))
    .map((file) => ({
      file,
      parsed: parseFrontmatter(readFileSync(file, "utf8")),
    }));
  const errors = [
    ...entries.flatMap(({ file, parsed }) => validateEntry(file, parsed, root)),
    ...validateCreativeRotation(entries),
    ...svgFiles(resolve(root, "public", "images", "xiaolin")).flatMap((file) => {
      const label = file.replace(`${resolve(root)}\\`, "");
      const errorsForFile = [];
      if (statSync(file).size > 120_000) {
        errorsForFile.push(`${label}: SVG artwork exceeds 120 KB`);
      }
      errorsForFile.push(...validateSvg(readFileSync(file, "utf8"), label));
      return errorsForFile;
    }),
  ];
  return {
    status: errors.length ? "failed" : "passed",
    checked: entries.length,
    errors,
  };
}

if (process.argv[1]?.endsWith("xiaolin-publisher.mjs")) {
  const result = runPublisher();
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
