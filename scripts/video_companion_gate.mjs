import fs from "node:fs";

const required = [
  {
    sourceDir: "research-videos/lin-yeh-2017/release-strict",
    transcriptDir: "research-videos/lin-yeh-2017",
    storyboard: "lin-yeh-2017_storyboard.md",
    transcript: "transcript.md",
    artifacts: [
      "public/videos/publications/lin-yeh-2017/lin-yeh-2017.mp4",
      "public/videos/publications/lin-yeh-2017/lin-yeh-2017_poster.png",
      "public/videos/publications/lin-yeh-2017/lin-yeh-2017_en.vtt",
    ],
  },
  {
    sourceDir: "research-videos/grout-heat-storage/release-strict",
    transcriptDir: "research-videos/grout-heat-storage",
    storyboard: "grout-heat-storage_storyboard.md",
    transcript: "transcript.md",
    artifacts: [
      "public/videos/publications/wang-et-al-2026-grout/grout-heat-storage.mp4",
      "public/videos/publications/wang-et-al-2026-grout/grout-heat-storage_poster.png",
      "public/videos/publications/wang-et-al-2026-grout/grout-heat-storage_en.vtt",
    ],
  },
];
const missing = [];
for (const film of required) {
  if (!fs.existsSync(`${film.sourceDir}/${film.storyboard}`)) missing.push(`${film.sourceDir}/${film.storyboard}`);
  if (!fs.existsSync(`${film.transcriptDir}/${film.transcript}`)) missing.push(`${film.transcriptDir}/${film.transcript}`);
  for (const artifact of film.artifacts) if (!fs.existsSync(artifact)) missing.push(artifact);
}
if (missing.length) {
  console.error(`Missing research film companion artifacts:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`Video companion gate passed: ${required.length} films have source, transcript, MP4, poster, and captions`);
