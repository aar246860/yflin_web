import fs from "node:fs";

const path = "src/data/publications.generated.json";
const allowedStatuses = new Set(["published", "accepted"]);
const records = JSON.parse(fs.readFileSync(path, "utf8"));
const errors = [];
const seenDoi = new Map();

for (const record of records) {
  if (!record.id || !record.title?.en || !record.authors || !record.venue) errors.push(`${record.id ?? "unknown"}: missing identity fields`);
  if (!allowedStatuses.has(record.status)) errors.push(`${record.id}: disallowed status ${record.status}`);
  if (!record.doi || record.doi.includes("#")) errors.push(`${record.id}: missing DOI`);
  if (!record.publicRecord || record.publicRecord.includes("#")) errors.push(`${record.id}: missing public record URL`);
  if (!record.primaryTheme || !Array.isArray(record.secondaryTags)) errors.push(`${record.id}: missing research classification`);
  if (!record.evidenceBoundary) errors.push(`${record.id}: missing evidence boundary`);
  if (record.doi) {
    const key = record.doi.toLowerCase();
    if (seenDoi.has(key)) errors.push(`${record.id}: duplicate DOI also used by ${seenDoi.get(key)}`);
    seenDoi.set(key, record.id);
  }
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && value.trim() === "#") errors.push(`${record.id}: placeholder in ${key}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Publication gate passed: ${records.length} unique public records`);
