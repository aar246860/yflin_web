import fs from "node:fs";
import path from "node:path";

/** Canonical comparison key; keep original DOI spelling in curated copy. */
export function normalizeDoi(input) {
  if (typeof input !== "string") return "";
  let doi = input.trim().replace(/^doi:\s*/i, "").replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
  try { doi = decodeURIComponent(doi); } catch { return ""; }
  doi = doi.trim().toLowerCase();
  return /^10\.\d{4,9}\/\S+$/.test(doi) && !/[?#]/.test(doi) ? doi : "";
}

export function validDate(date) {
  if (date === null) return true;
  if (!date || !["year", "month", "day"].includes(date.precision)) return false;
  const patterns = { year: /^\d{4}$/, month: /^\d{4}-\d{2}$/, day: /^\d{4}-\d{2}-\d{2}$/ };
  if (!patterns[date.precision].test(date.value) || !date.source || !/^https:\/\//.test(date.sourceUrl ?? "")) return false;
  const [year, month = 1, day = 1] = date.value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return year >= 1600 && parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

export function validatePublications(records) {
  const errors = [];
  const dois = new Set();
  const ids = new Set();
  if (!Array.isArray(records) || !records.length) return ["Catalogue must contain at least one reviewed publication"];
  for (const record of records) {
    const id = record.id ?? "unknown";
    if (!record.id || !/^[a-z0-9-]+$/.test(record.id) || !record.title?.en || !record.authors || !record.venue) errors.push(`${id}: missing or invalid identity fields`);
    if (ids.has(id)) errors.push(`${id}: duplicate stable ID`);
    ids.add(id);
    const key = normalizeDoi(record.doi);
    if (!key) errors.push(`${id}: missing or invalid DOI`);
    if (dois.has(key)) errors.push(`${id}: duplicate DOI ${key}`);
    dois.add(key);
    if (normalizeDoi(record.publicRecord) !== key) errors.push(`${id}: public record does not match DOI`);
    if (!["published", "accepted"].includes(record.status)) errors.push(`${id}: disallowed status ${record.status}`);
    if (record.publicationType !== "journal-article") errors.push(`${id}: only reviewed formal journal articles belong in this catalogue`);
    if (record.status === "published" && record.version !== "version-of-record") errors.push(`${id}: published article needs version-of-record evidence`);
    if (!record.primaryTheme || !Array.isArray(record.secondaryTags) || !Array.isArray(record.concepts)) errors.push(`${id}: missing research classification`);
    if (!record.evidenceBoundary || !record.provenance?.source || !/^https:\/\//.test(record.provenance?.url ?? "")) errors.push(`${id}: missing evidence boundary or provenance`);
    if (!record.dates || !validDate(record.dates.online) || !validDate(record.dates.issue)) errors.push(`${id}: dates require explicit precision, provenance, or null`);
    if (!Number.isInteger(record.year) || (record.month !== undefined && (!Number.isInteger(record.month) || record.month < 1 || record.month > 12))) errors.push(`${id}: invalid legacy sorting date`);
    for (const [field, value] of Object.entries(record)) {
      if (typeof value === "string" && value.trim() === "#") errors.push(`${id}: placeholder in ${field}`);
    }
  }
  return errors;
}

export function compilePublications(source, metadata, previous = []) {
  if (source?.schemaVersion !== 1 || !source.records || Array.isArray(source.records)) throw new Error("Unsupported publication source schema");
  const records = Object.entries(source.records).map(([key, bibliography]) => {
    if (normalizeDoi(key) !== key || normalizeDoi(bibliography.doi) !== key) throw new Error(`Source key/DOI mismatch: ${key}`);
    const curated = metadata[key];
    if (!curated?.id || curated.review?.status !== "approved") throw new Error(`Unreviewed publication: ${key}`);
    const allowed = new Set(["id", "primaryTheme", "secondaryTags", "studentContribution", "concepts", "featureVideo", "evidenceBoundary", "review"]);
    for (const field of Object.keys(curated)) if (!allowed.has(field)) throw new Error(`Unsupported curated field ${key}: ${field}`);
    const { review: _review, ...presentation } = curated;
    return {
      ...bibliography,
      ...presentation,
      publicRecord: `https://doi.org/${bibliography.doi}`,
      evidenceBoundary: curated.evidenceBoundary ?? "Public bibliographic record; interpretation details remain conditioned on the cited publication.",
    };
  });
  const errors = validatePublications(records);
  for (const key of Object.keys(metadata)) if (!source.records[key]) errors.push(`Curated DOI missing from authoritative source: ${key}`);
  const byDoi = new Map(records.map((record) => [normalizeDoi(record.doi), record]));
  for (const old of previous) {
    const next = byDoi.get(normalizeDoi(old.doi));
    if (!next) errors.push(`Refusing to remove existing publication ${old.id}`);
    else if (next.id !== old.id) errors.push(`Refusing stable ID change ${old.id} -> ${next.id}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return records.sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0) || a.id.localeCompare(b.id, "en"));
}

export function writeJsonAtomic(file, data) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, content, "utf8");
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  return true;
}
