import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publications = JSON.parse(fs.readFileSync(path.join(root, "src/data/publications.generated.json"), "utf8"));
const conceptCounts = publications.reduce((acc, pub) => {
  for (const concept of pub.concepts ?? []) acc[concept] = (acc[concept] ?? 0) + 1;
  return acc;
}, {});
const now = new Date().toISOString();
const report = [
  "# Research Website Content Report", "", `Generated: ${now}`, "",
  `- Reviewed publications: ${publications.length}`,
  `- Concept clusters: ${Object.keys(conceptCounts).length}`, "",
  "## Cluster Counts", ...Object.entries(conceptCounts).map(([key, count]) => `- ${key}: ${count}`), "",
  "## Operating Rule",
  "Crossref discovery writes review candidates only. Approving source data, checking the site, and explicitly authorizing publication are separate steps.",
  "No API failure or missing video removes a reviewed bibliographic record.", "",
].join("\n");
const dir = path.join(root, "reports/publications");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, `content-${now.slice(0, 10)}.md`), report, "utf8");
fs.writeFileSync(path.join(dir, "content-latest.md"), report, "utf8");
console.log(report);
