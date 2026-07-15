import fs from "node:fs";
import path from "node:path";

const filmsPath = path.join("src", "data", "publicationFilms.generated.json");
const films = JSON.parse(fs.readFileSync(filmsPath, "utf8"));
const missing = [];

if (films.length !== 39 || new Set(films.map((film) => film.doi)).size !== 39) {
  missing.push(`${filmsPath}: expected 39 unique publication films, received ${films.length}`);
}

for (const film of films) {
  for (const publicArtifact of [film.video, film.poster, film.captions]) {
    const target = path.join("public", publicArtifact.replace(/^\//, ""));
    if (!fs.existsSync(target)) missing.push(target);
  }

  const releaseDir = path.join("research-videos", "papers", film.id, "release");
  const sourceText = path.join("research-videos", "source-text", `${film.id}.txt`);
  if (fs.existsSync(releaseDir) || fs.existsSync(sourceText)) {
    const localArtifacts = [
      sourceText,
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
    for (const file of localArtifacts) {
      const target = file === sourceText ? file : path.join(releaseDir, file);
      if (!fs.existsSync(target)) missing.push(target);
    }
  }
}

if (missing.length) {
  console.error(`Missing research film companion artifacts:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log(`Video companion gate passed: ${films.length} public films have MP4, poster, and captions; local QA packages validated when present`);