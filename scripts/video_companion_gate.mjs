import fs from "node:fs";
import path from "node:path";

const filmsPath = path.join("src", "data", "publicationFilms.generated.json");
const films = JSON.parse(fs.readFileSync(filmsPath, "utf8"));
const missing = [];

if (films.length !== 39 || new Set(films.map((film) => film.doi)).size !== 39) {
  missing.push(`${filmsPath}: expected 39 unique publication films, received ${films.length}`);
}

for (const film of films) {
  const releaseDir = path.join("research-videos", "papers", film.id, "release");
  const sourceText = path.join("research-videos", "source-text", `${film.id}.txt`);
  const requiredFiles = [
    `${film.id}_scene.py`,
    `${film.id}_storyboard.md`,
    `${film.id}_transcript.md`,
    `${film.id}_en.vtt`,
    `${film.id}_semantic_audit.json`,
    `${film.id}_visual_qa.json`,
    `${film.id}_contact_sheet.png`,
    `${film.id}.mp4`,
    `${film.id}_poster.png`,
  ];

  if (!fs.existsSync(sourceText)) missing.push(sourceText);
  for (const file of requiredFiles) {
    const target = path.join(releaseDir, file);
    if (!fs.existsSync(target)) missing.push(target);
  }

  for (const publicArtifact of [film.video, film.poster, film.captions]) {
    const target = path.join("public", publicArtifact.replace(/^\//, ""));
    if (!fs.existsSync(target)) missing.push(target);
  }
}

if (missing.length) {
  console.error(`Missing research film companion artifacts:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log(`Video companion gate passed: ${films.length} films have source, storyboard, transcript, MP4, poster, captions, and QA evidence`);
