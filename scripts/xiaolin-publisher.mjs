import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";

const forbidden = [
  /confidential|password|credential|private diary|private memory/i,
  /unpublished manuscript|reviewer report|student record/i,
  /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,
  /(?:\+?\d[\s().-]*){9,}/,
];

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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(meta.date ?? ""))) {
    errors.push(`${label}: date must use YYYY-MM-DD`);
  }

  if (meta.generated === true) {
    if (meta.operator !== "Codex") errors.push(`${label}: generated entry operator must be Codex`);
    if (!["diary", "doodle", "field-report"].includes(meta.format)) {
      errors.push(`${label}: generated entry format is invalid`);
    }
    if (!String(meta.disclosure ?? "").includes("did not direct or pre-approve")) {
      errors.push(`${label}: generated entry needs the public non-endorsement disclosure`);
    }
  }

  if (meta.artwork) {
    const artwork = resolve(root, "public", String(meta.artwork).replace(/^\/+/, ""));
    if (!existsSync(artwork)) errors.push(`${label}: artwork is missing at ${meta.artwork}`);
    if (existsSync(artwork) && statSync(artwork).size > 120_000) {
      errors.push(`${label}: artwork exceeds 120 KB`);
    }
    if (!meta.artworkAlt) errors.push(`${label}: artworkAlt is missing`);
  }

  for (const pattern of forbidden) {
    if (pattern.test(source)) errors.push(`${label}: matched safety pattern ${pattern}`);
  }
  return errors;
}

export function runPublisher({ root = process.cwd() } = {}) {
  const sourceDir = resolve(root, "src/content/xiaolin");
  const files = readdirSync(sourceDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => resolve(sourceDir, file));
  const errors = files.flatMap((file) =>
    validateEntry(file, parseFrontmatter(readFileSync(file, "utf8")), root),
  );
  return {
    status: errors.length ? "failed" : "passed",
    checked: files.length,
    errors,
  };
}

if (process.argv[1]?.endsWith("xiaolin-publisher.mjs")) {
  const result = runPublisher();
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
