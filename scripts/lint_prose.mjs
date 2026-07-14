import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const targets = ["src/content", "src/pages", "src/components"];
const forbidden = [
  /\bTODO\b/i,
  /\brevised version\b/i,
  /\bas an AI\b/i,
  /\bQ:\s/i,
  /\bA:\s/i,
  /\bgroundbreaking\b/i,
  /\brevolutionary\b/i,
  /\bgame-changing\b/i,
  /\bworld-leading\b/i,
  /\bguarantees?\b/i,
  /地下水界的台積電/,
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (/\.(astro|md|mdx|ts|js)$/.test(entry.name)) return [full];
    return [];
  });
}

const issues = [];
for (const target of targets) {
  for (const file of walk(path.join(root, target))) {
    const text = fs.readFileSync(file, "utf8");
    forbidden.forEach((pattern) => {
      if (pattern.test(text)) {
        issues.push({ file: path.relative(root, file), pattern: pattern.toString() });
      }
    });
  }
}

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
const report = [
  "# Prose Lint Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  issues.length ? "## Issues" : "No prose residue or hype-pattern issues found.",
  ...issues.map((issue) => `- ${issue.file}: ${issue.pattern}`),
  "",
].join("\n");
fs.writeFileSync(path.join(root, "reports", `prose_lint_report_${today}.md`), report, "utf8");

if (issues.length) {
  console.error(report);
  process.exit(1);
}

console.log("Prose lint passed.");
