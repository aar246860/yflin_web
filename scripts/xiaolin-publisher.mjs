import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";

const forbidden = [
  /confidential|password|credential|private diary|private memory/i,
  /unpublished manuscript|reviewer report|student record/i,
  /\bCodex\b|automation prompt|editing reminder|daily script|scheduled at/i,
  /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,
  /(?:\+?\d[\s().-]*){9,}/,
];
const creativeModes = new Set([
  "philosophical-note",
  "sequential-comic",
  "leisure-outing",
  "visual-study",
  "absurd-comedy",
]);
const rotationCutover = Date.parse("2026-07-26T13:23:35+08:00");

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

function validateEntry(file, parsed, root) {
  const errors = [];
  const label = basename(file);
  if (!parsed) return [`${label}: missing frontmatter`];
  const { meta, source } = parsed;

  if (meta.public !== true) errors.push(`${label}: public must be true`);
  if (meta.draft !== false) errors.push(`${label}: draft must be false`);
  if (!meta.title) errors.push(`${label}: title is missing`);
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2})?$/.test(String(meta.date ?? ""))) {
    errors.push(`${label}: date must use YYYY-MM-DD or a full ISO 8601 timestamp`);
  }

  if (meta.generated === true) {
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
    const artwork = resolve(root, "public", String(meta.artwork).replace(/^\/+/, ""));
    const extension = String(meta.artwork).toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
    if (!existsSync(artwork)) errors.push(`${label}: artwork is missing at ${meta.artwork}`);
    if (!["svg", "png", "webp", "jpg", "jpeg"].includes(extension)) {
      errors.push(`${label}: artwork format is unsupported`);
    }
    if (existsSync(artwork) && extension === "svg" && statSync(artwork).size > 120_000) {
      errors.push(`${label}: SVG artwork exceeds 120 KB`);
    }
    if (existsSync(artwork) && extension !== "svg" && statSync(artwork).size > 2_500_000) {
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
    .filter(({ parsed }) => parsed?.meta.generated === true)
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
