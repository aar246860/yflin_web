import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const SKILL_ROOT = "C:/Users/YFLin/.codex/skills/research-manim-video-summarizer";
const VIDEO_ROOT = path.join(ROOT, "research-videos");
const PAPER_ROOT = path.join(VIDEO_ROOT, "papers");
const INDEX = JSON.parse(fs.readFileSync(path.join(VIDEO_ROOT, "source-index.json"), "utf8"));
const FILTER = new Set(process.argv.slice(2).filter((value) => !value.startsWith("--")));

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? ROOT,
    encoding: "utf8",
    env: { ...process.env, PYTHONPATH: [ROOT, SKILL_ROOT].join(path.delimiter), ...options.env },
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || "");
    const diagnosticTail = detail.split(/\r?\n/).slice(-70).join("\n");
    throw new Error(`${command} ${args.join(" ")} failed\n${diagnosticTail}`);
  }
  return result.stdout;
};
const requirePassingReport = (output, label) => {
  if (/Result:\s*REVISE/i.test(output)) throw new Error(`${label} did not pass\n${output}`);
  return output;
};
const enableMutedBrowserPlayback = (htmlFile) => {
  const html = fs.readFileSync(htmlFile, "utf8");
  const marker = '<video id="research-video" controls preload="metadata" playsinline>';
  if (!html.includes(marker)) throw new Error(`Missing research-video element in ${htmlFile}`);
  fs.writeFileSync(htmlFile, html.replace(marker, marker.replace("playsinline", "playsinline muted")), "utf8");
};
const sha256 = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const posix = (value) => value.replaceAll(path.sep, "/");
const findFile = (root, suffix) => {
  const pending = [root];
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entry.name);
      if (entry.isDirectory()) pending.push(candidate);
      else if (entry.name.endsWith(suffix)) return candidate;
    }
  }
  throw new Error(`Could not find ${suffix} under ${root}`);
};
const frameCount = (video) => {
  const payload = JSON.parse(run("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames,width,height", "-of", "json", video]));
  const stream = payload.streams?.[0];
  const count = Number.parseInt(stream?.nb_read_frames, 10);
  if (!Number.isInteger(count) || count < 1 || stream.width !== 1280 || stream.height !== 720) throw new Error(`Invalid 720p frame metadata for ${video}`);
  return count;
};
const sceneItems = (spec) => [...spec.background, ...spec.methods, { ...spec.return, id: "return" }];
const ownership = (item) => item.id.toLowerCase();

function extractEvidence(video, releaseDir, spec) {
  const scenes = sceneItems(spec);
  const total = frameCount(video);
  const records = scenes.map((item, index) => {
    const start = Math.floor((index * total) / scenes.length);
    const end = Math.floor(((index + 1) * total) / scenes.length);
    const span = end - start;
    return {
      item,
      scene: index + 1,
      start,
      end,
      indices: [0.2, 0.52, 0.84].map((fraction) => start + Math.min(span - 1, Math.max(0, Math.floor(span * fraction)))),
    };
  });
  const indices = records.flatMap((record) => record.indices);
  if (new Set(indices).size !== indices.length) throw new Error(`Frame evidence indices collide for ${spec.id}`);
  const frameDir = path.join(releaseDir, "visual_qa_frames");
  fs.rmSync(frameDir, { force: true, recursive: true, maxRetries: 10, retryDelay: 200 });
  fs.mkdirSync(frameDir, { recursive: true });
  const selector = indices.map((index) => `eq(n\\,${index})`).join("+");
  run("ffmpeg", ["-y", "-v", "error", "-i", video, "-vf", `select=${selector}`, "-fps_mode", "passthrough", path.join(frameDir, "frame_%03d.png")]);
  const frames = fs.readdirSync(frameDir).filter((name) => name.endsWith(".png")).sort();
  if (frames.length !== indices.length) throw new Error(`Expected ${indices.length} evidence frames for ${spec.id}; received ${frames.length}`);
  const contactSheet = path.join(releaseDir, `${spec.id}_contact_sheet.png`);
  run("ffmpeg", ["-y", "-v", "error", "-framerate", "1", "-i", path.join(frameDir, "frame_%03d.png"), "-vf", `scale=320:180,tile=3x${scenes.length}`, "-frames:v", "1", contactSheet]);

  let cursor = 0;
  const sceneRecords = records.map((record) => {
    const names = frames.slice(cursor, cursor + 3);
    cursor += 3;
    const [entry, midpoint, settled] = names.map((name) => posix(path.join("visual_qa_frames", name)));
    const [entryIndex, midpointIndex, settledIndex] = record.indices;
    const visualObject = record.item.visualObject;
    return {
      scene: record.scene,
      scene_start_frame: record.start,
      scene_end_frame: record.end,
      storyboard_visual_object: visualObject,
      storyboard_ownership: ownership(record.item),
      visual_semantic_match: "pending independent visual review",
      entry: "pending independent visual review",
      entry_frame: entry,
      entry_frame_index: entryIndex,
      entry_frame_sha256: sha256(path.join(releaseDir, entry)),
      entry_content_summary: "pending independent visual review",
      midpoint: "pending independent visual review",
      midpoint_frame: midpoint,
      midpoint_frame_index: midpointIndex,
      midpoint_frame_sha256: sha256(path.join(releaseDir, midpoint)),
      midpoint_content_summary: "pending independent visual review",
      settled: "pending independent visual review",
      settled_frame: settled,
      settled_frame_index: settledIndex,
      settled_frame_sha256: sha256(path.join(releaseDir, settled)),
      settled_content_summary: "pending independent visual review",
    };
  });
  return { contactSheet, sceneRecords };
}

function qaDraft({ spec, paperDir, releaseDir, video, contactSheet, sceneRecords, source }) {
  const sceneSource = path.join(paperDir, `${spec.id}_scene.py`);
  const storyboard = path.join(paperDir, `${spec.id}_storyboard.md`);
  const semanticAudit = path.join(paperDir, `${spec.id}_semantic_audit.json`);
  const html = path.join(releaseDir, `${spec.id}.html`);
  const metadata = path.join(releaseDir, `${spec.id}_metadata.json`);
  const qaNotes = path.join(releaseDir, `${spec.id}_qa.md`);
  return {
    reviewer: "pending independent rendered-frame reviewer",
    reviewed_at: null,
    review_method: "pending independent visual review",
    browser_playback: "pending browser playback review",
    video_file: path.basename(video), video_sha256: sha256(video),
    scene_source_file: path.basename(sceneSource), scene_source_sha256: sha256(sceneSource),
    storyboard_file: path.basename(storyboard), storyboard_sha256: sha256(storyboard),
    source_artifact_file: path.basename(source), source_artifact_sha256: sha256(source),
    semantic_audit_file: path.basename(semanticAudit), semantic_audit_sha256: sha256(semanticAudit),
    contact_sheet_file: path.basename(contactSheet), contact_sheet_sha256: sha256(contactSheet),
    html_file: path.basename(html), html_sha256: sha256(html),
    metadata_file: path.basename(metadata), metadata_sha256: sha256(metadata),
    qa_notes_file: path.basename(qaNotes), qa_notes_sha256: sha256(qaNotes),
    scenes: sceneRecords,
  };
}

function render(record) {
  const paperDir = path.join(PAPER_ROOT, record.id);
  const spec = JSON.parse(fs.readFileSync(path.join(paperDir, `${record.id}_validated_spec.json`), "utf8"));
  const source = path.join(ROOT, spec.auditSourceArtifact);
  const storyboard = path.join(paperDir, `${record.id}_storyboard.md`);
  const semanticAudit = path.join(paperDir, `${record.id}_semantic_audit.json`);
  const sceneSource = path.join(paperDir, `${record.id}_scene.py`);
  for (const artifact of [source, storyboard, semanticAudit, sceneSource]) if (!fs.existsSync(artifact)) throw new Error(`Missing pre-render artifact: ${artifact}`);
  run("uv", ["run", path.join(SKILL_ROOT, "scripts", "check_storyboard_contract.py"), storyboard, "--strict", "--source-artifact", source, "--semantic-audit", semanticAudit, "--json"]);
  requirePassingReport(
    run("uv", ["run", path.join(SKILL_ROOT, "scripts", "check_manim_layout.py"), sceneSource]),
    `${record.id} Manim layout check`,
  );

  const cache = path.join(os.tmpdir(), "yflin-manim-render", record.id);
  fs.rmSync(cache, { force: true, recursive: true, maxRetries: 10, retryDelay: 200 });
  fs.mkdirSync(cache, { recursive: true });
  run("uv", ["run", "--python", "3.11", "--with", "manim", "manim", "-qm", "--disable_caching", "--media_dir", cache, "--output_file", record.id, sceneSource, "ResearchVisualAbstract"], { cwd: paperDir });
  const rawVideo = findFile(cache, `${record.id}.mp4`);
  const releaseDir = path.join(paperDir, "release");
  fs.mkdirSync(releaseDir, { recursive: true });
  for (const staleQa of [`${record.id}_visual_qa.json`, `${record.id}_visual_qa.final.json`]) {
    fs.rmSync(path.join(releaseDir, staleQa), { force: true, maxRetries: 10, retryDelay: 200 });
  }
  run("uv", ["run", path.join(SKILL_ROOT, "scripts", "export_manim_video.py"), rawVideo, releaseDir, "--title", spec.title, "--description", spec.narrative.throughline, "--slug", record.id]);
  enableMutedBrowserPlayback(path.join(releaseDir, `${record.id}.html`));
  const video = path.join(releaseDir, `${record.id}.mp4`);
  run("uv", ["run", path.join(ROOT, "scripts", "check_research_video_motion.py"), video]);
  const poster = path.join(releaseDir, `${record.id}_poster.png`);
  run("ffmpeg", ["-y", "-v", "error", "-ss", "2.0", "-i", video, "-frames:v", "1", poster]);
  for (const name of [`${record.id}_scene.py`, `${record.id}_storyboard.md`, `${record.id}_semantic_audit.json`, `${record.id}_transcript.md`, `${record.id}_en.vtt`]) {
    fs.copyFileSync(path.join(paperDir, name), path.join(releaseDir, name));
  }
  fs.copyFileSync(source, path.join(releaseDir, path.basename(source)));
  const { contactSheet, sceneRecords } = extractEvidence(video, releaseDir, spec);
  const draft = qaDraft({ spec, paperDir, releaseDir, video, contactSheet, sceneRecords, source });
  fs.writeFileSync(path.join(releaseDir, `${record.id}_visual_qa.draft.json`), `${JSON.stringify(draft, null, 2)}\n`, "utf8");
  fs.rmSync(cache, { force: true, recursive: true, maxRetries: 10, retryDelay: 200 });
  console.log(`Rendered ${record.id}: ${sceneRecords.length} scenes, ${frameCount(video)} frames.`);
}

const records = INDEX.pendingRecords.filter((record) => FILTER.size === 0 || FILTER.has(record.id));
if (records.length === 0) throw new Error("No pending publication IDs matched the requested render set");
for (const record of records) render(record);
console.log(`Prepared ${records.length} release packages for independent visual review.`);
