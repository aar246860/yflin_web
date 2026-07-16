import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SKILL_ROOT = "C:/Users/YFLin/.codex/skills/research-manim-video-summarizer";
const VIDEO_ROOT = path.join(ROOT, "research-videos");
const PAPER_ROOT = path.join(VIDEO_ROOT, "papers");
const PUBLIC_ROOT = path.join(ROOT, "public", "videos", "publications");
const OUTPUT = path.join(ROOT, "src", "data", "publicationFilms.generated.json");
const INDEX = JSON.parse(fs.readFileSync(path.join(VIDEO_ROOT, "source-index.json"), "utf8"));

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, PYTHONPATH: SKILL_ROOT },
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed\n${result.stderr || result.stdout}`);
  return result.stdout;
};
const requirePassingReport = (output, label) => {
  if (/Result:\s*REVISE/i.test(output)) throw new Error(`${label} did not pass\n${output}`);
  return output;
};
const requireFile = (file) => {
  if (!fs.existsSync(file) || fs.statSync(file).size < 1) throw new Error(`Missing publication artifact: ${file}`);
};

const films = [];
for (const record of INDEX.pendingRecords) {
  const paperDir = path.join(PAPER_ROOT, record.id);
  const release = path.join(paperDir, "release");
  const spec = JSON.parse(fs.readFileSync(path.join(paperDir, `${record.id}_validated_spec.json`), "utf8"));
  const scene = path.join(release, `${record.id}_scene.py`);
  const storyboard = path.join(release, `${record.id}_storyboard.md`);
  const audit = path.join(release, `${record.id}_semantic_audit.json`);
  const qa = path.join(release, `${record.id}_visual_qa.json`);
  const contact = path.join(release, `${record.id}_contact_sheet.png`);
  const video = path.join(release, `${record.id}.mp4`);
  const poster = path.join(release, `${record.id}_poster.png`);
  const captions = path.join(release, `${record.id}_en.vtt`);
  const source = path.join(release, `${record.id}_source.txt`);
  for (const file of [scene, storyboard, audit, qa, contact, video, poster, captions, source]) requireFile(file);
  requirePassingReport(
    run("uv", ["run", path.join(SKILL_ROOT, "scripts", "check_manim_layout.py"), scene, "--contact-sheet", contact, "--qa-manifest", qa, "--storyboard", storyboard, "--source-artifact", source, "--semantic-audit", audit]),
    `${record.id} publication check`,
  );

  const destination = path.join(PUBLIC_ROOT, record.id);
  fs.rmSync(destination, { force: true, recursive: true });
  fs.mkdirSync(destination, { recursive: true });
  for (const file of [video, poster, captions]) fs.copyFileSync(file, path.join(destination, path.basename(file)));
  films.push({
    id: record.id,
    doi: record.doi,
    label: "Manim visual abstract",
    note: "Source-backed animation with captions and frame-level visual review.",
    plainLanguage: spec.return.claim,
    video: `/videos/publications/${record.id}/${record.id}.mp4`,
    poster: `/videos/publications/${record.id}/${record.id}_poster.png`,
    captions: `/videos/publications/${record.id}/${record.id}_en.vtt`,
  });
}

if (films.length !== 39 || new Set(films.map((film) => film.doi)).size !== 39) {
  throw new Error(`Expected 39 unique publication films; received ${films.length}`);
}
fs.writeFileSync(OUTPUT, `${JSON.stringify(films, null, 2)}\n`, "utf8");
console.log(`Published ${films.length} independently reviewed films to the website tree.`);
