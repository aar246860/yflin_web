import fs from "node:fs";
import { compilePublications, validatePublications } from "./lib/publications.mjs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const records = read("src/data/publications.generated.json");
const expected = compilePublications(read("src/data/publications.source.json"), read("scripts/publication_metadata.json"), records);
const errors = validatePublications(records);
if (JSON.stringify(expected) !== JSON.stringify(records)) errors.push("Generated catalogue differs from reviewed source; run npm run content:sync");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Publication gate passed: ${records.length} unique reviewed public records`);
