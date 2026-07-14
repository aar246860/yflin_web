import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pubsPath = path.join(root, "src", "data", "publications.generated.json");
const publications = fs.existsSync(pubsPath) ? JSON.parse(fs.readFileSync(pubsPath, "utf8")) : [];
const conceptCounts = publications.reduce((acc, pub) => {
  for (const concept of pub.concepts ?? []) acc[concept] = (acc[concept] ?? 0) + 1;
  return acc;
}, {});

const report = [
  "# Research Website Content Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `- Publications imported: ${publications.length}`,
  `- Concept clusters: ${Object.keys(conceptCounts).length}`,
  "",
  "## Cluster Counts",
  ...Object.entries(conceptCounts).map(([key, count]) => `- ${key}: ${count}`),
  "",
  "## Operating Rule",
  "Draft generation can be automated, but publication should remain human-confirmed until evidence and prose gates pass.",
  "",
].join("\n");

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports", "content_report_2026-06-12.md"), report, "utf8");
console.log(report);
