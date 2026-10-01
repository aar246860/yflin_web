import fs from "node:fs";
import path from "node:path";
import { compilePublications, writeJsonAtomic } from "./lib/publications.mjs";

const root = process.cwd();
const sourcePath = path.join(root, "src/data/publications.source.json");
const metadataPath = path.join(root, "scripts/publication_metadata.json");
const outPath = path.join(root, "src/data/publications.generated.json");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

// Offline by design. Network discovery only writes a separate review report.
// Generated output and sibling legacy JavaScript are never bibliographic inputs.
const publications = compilePublications(read(sourcePath), read(metadataPath), fs.existsSync(outPath) ? read(outPath) : []);
const changed = writeJsonAtomic(outPath, publications);
console.log(`Compiled ${publications.length} reviewed publications from ${sourcePath}${changed ? "" : " (unchanged)"}`);
