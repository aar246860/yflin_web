import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const contentRoot = path.join(root, "src", "content");
const riskyClaims = [
  /\bproves? the true\b/i,
  /\buniversally superior\b/i,
  /\buniversal replacement\b/i,
  /\bgroundwater uncertainty has been ignored\b/i,
  /\bexisting .* obsolete\b/i,
  /\bNobel\b/i,
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? "";
}

const issues = [];
for (const file of walk(contentRoot)) {
  const text = fs.readFileSync(file, "utf8");
  const fm = frontmatter(text);
  const rel = path.relative(root, file);

  if (!/sourceProjects:\s*(\[[^\]]+\]|\n\s+-\s+)/.test(fm)) {
    issues.push(`${rel}: missing sourceProjects list`);
  }
  if (!/relatedPublications:\s*(\[[^\]]+\]|\n\s+-\s+)/.test(fm) && !rel.includes(`${path.sep}projects${path.sep}`)) {
    issues.push(`${rel}: missing relatedPublications list`);
  }
  riskyClaims.forEach((pattern) => {
    if (pattern.test(text)) issues.push(`${rel}: risky claim pattern ${pattern}`);
  });
}

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
const report = [
  "# Evidence Gate Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  issues.length ? "## Issues" : "No evidence-gate issues found.",
  ...issues.map((issue) => `- ${issue}`),
  "",
].join("\n");
fs.writeFileSync(path.join(root, "reports", `evidence_gate_report_${today}.md`), report, "utf8");

if (issues.length) {
  console.error(report);
  process.exit(1);
}

console.log("Evidence gate passed.");
