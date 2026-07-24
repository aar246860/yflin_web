import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const publicationId = "2025-10-6";
const packageDir = path.join("research-videos", "rethinking-aquifer-2025", "v2");
const evidenceDir = path.join(packageDir, "qa-evidence");
const manifestPath = path.join(evidenceDir, `${publicationId}_visual_qa.json`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const failures = [];

function digest(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function requireFile(file, expectedHash, label) {
  if (!fs.existsSync(file)) {
    failures.push(`${label}: missing ${file}`);
    return;
  }
  const actualHash = digest(file);
  if (actualHash !== expectedHash) {
    failures.push(`${label}: SHA-256 mismatch (${actualHash})`);
  }
}

function requireSameFile(left, right, label) {
  if (!fs.existsSync(left) || !fs.existsSync(right)) {
    failures.push(`${label}: missing ${!fs.existsSync(left) ? left : right}`);
    return;
  }
  if (digest(left) !== digest(right)) {
    failures.push(`${label}: deployed and reviewed files differ`);
  }
}

function run(command, args, label) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    failures.push(`${label}: ${result.error?.message ?? result.stderr.trim() ?? `exit ${result.status}`}`);
    return null;
  }
  return result.stdout;
}

function manifestArtifact(file) {
  return path.resolve(evidenceDir, file);
}

const videoPath = manifestArtifact(manifest.video_file);
const artifacts = [
  [videoPath, manifest.video_sha256, "video"],
  [path.join(evidenceDir, manifest.scene_source_file), manifest.scene_source_sha256, "scene source"],
  [path.join(evidenceDir, manifest.storyboard_file), manifest.storyboard_sha256, "storyboard"],
  [path.join(packageDir, manifest.source_artifact_file), manifest.source_artifact_sha256, "source digest"],
  [path.join(evidenceDir, manifest.semantic_audit_file), manifest.semantic_audit_sha256, "semantic audit"],
  [path.join(evidenceDir, manifest.contact_sheet_file), manifest.contact_sheet_sha256, "contact sheet"],
  [path.join(evidenceDir, manifest.html_file), manifest.html_sha256, "HTML player"],
  [path.join(evidenceDir, manifest.metadata_file), manifest.metadata_sha256, "metadata"],
  [path.join(evidenceDir, manifest.qa_notes_file), manifest.qa_notes_sha256, "QA notes"],
  [path.join(evidenceDir, manifest.browser_qa_file), manifest.browser_qa_sha256, "browser QA"],
  [path.join(evidenceDir, manifest.caption_audit_file), manifest.caption_audit_sha256, "caption audit"],
  [path.join(evidenceDir, manifest.desktop_screenshot_file), manifest.desktop_screenshot_sha256, "desktop screenshot"],
  [path.join(evidenceDir, manifest.mobile_screenshot_file), manifest.mobile_screenshot_sha256, "mobile screenshot"],
];

for (const [file, expectedHash, label] of artifacts) {
  requireFile(file, expectedHash, label);
}

const publicMediaDir = path.join("public", "videos", "publications", publicationId);
const publicVideoPath = path.join(publicMediaDir, `${publicationId}.mp4`);
requireFile(publicVideoPath, manifest.video_sha256, "deployed video");
requireSameFile(path.join(evidenceDir, `${publicationId}_poster.png`), path.join(publicMediaDir, `${publicationId}_poster.png`), "deployed poster");
requireSameFile(path.join(evidenceDir, `${publicationId}_en.vtt`), path.join(publicMediaDir, `${publicationId}_en.vtt`), "deployed captions");

const canonicalScene = path.join(packageDir, "rethinking_aquifer_2025_v2.py");
if (digest(canonicalScene) !== manifest.scene_source_sha256) {
  failures.push(`canonical scene source differs from ${manifest.scene_source_file}`);
}

for (const helper of manifest.helper_artifacts ?? []) {
  const packagedHelper = manifestArtifact(helper.file);
  const canonicalHelper = path.join(packageDir, helper.file);
  requireFile(packagedHelper, helper.sha256, `packaged helper ${helper.file}`);
  requireFile(canonicalHelper, helper.sha256, `canonical helper ${helper.file}`);
}
if (!Array.isArray(manifest.helper_artifacts) || manifest.helper_artifacts.length !== 2) {
  failures.push("helper provenance must bind the layout and geometry modules");
}

const probeOutput = run(
  "ffprobe",
  ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration", "-of", "json", videoPath],
  "ffprobe",
);
if (probeOutput) {
  const probe = JSON.parse(probeOutput);
  const stream = probe.streams?.[0] ?? {};
  const duration = Number(probe.format?.duration);
  if (stream.codec_name !== "h264" || stream.width !== 1920 || stream.height !== 1080 || stream.pix_fmt !== "yuv420p") {
    failures.push(`video encoding: expected H.264 1920x1080 yuv420p, received ${stream.codec_name} ${stream.width}x${stream.height} ${stream.pix_fmt}`);
  }
  if (stream.r_frame_rate !== "30/1" || Number(stream.nb_frames) !== 3600 || Math.abs(duration - 120) > 0.01) {
    failures.push(`video timing: expected 30 fps, 3600 frames, and 120 seconds; received ${stream.r_frame_rate}, ${stream.nb_frames}, ${duration}`);
  }
}

if (manifest.fps !== 30 || manifest.frame_count !== 3600) {
  failures.push(`video timing: expected 30 fps and 3600 frames, received ${manifest.fps} fps and ${manifest.frame_count} frames`);
}

if (!Array.isArray(manifest.scenes) || manifest.scenes.length !== 20) {
  failures.push(`scene coverage: expected 20 scenes, received ${manifest.scenes?.length ?? "invalid"}`);
} else {
  let expectedStart = 0;
  const indices = new Set();
  const hashes = new Set();
  const decodedHashes = new Map();
  for (const [offset, scene] of manifest.scenes.entries()) {
    if (scene.scene !== offset + 1 || scene.scene_start_frame !== expectedStart || scene.scene_end_frame <= scene.scene_start_frame) {
      failures.push(`Scene ${offset + 1}: invalid scene number or non-contiguous frame range`);
    }
    expectedStart = scene.scene_end_frame;
    for (const state of ["entry", "midpoint", "settled"]) {
      const file = path.join(evidenceDir, scene[`${state}_frame`]);
      const index = scene[`${state}_frame_index`];
      const expectedHash = scene[`${state}_frame_sha256`];
      const decodedHash = scene[`${state}_decoded_rgb_sha256`];
      requireFile(file, expectedHash, `Scene ${scene.scene} ${state}`);
      if (!Number.isInteger(index) || index < scene.scene_start_frame || index >= scene.scene_end_frame) {
        failures.push(`Scene ${scene.scene} ${state}: frame index is outside its scene range`);
      }
      if (indices.has(index)) failures.push(`Scene ${scene.scene} ${state}: duplicate frame index ${index}`);
      if (hashes.has(expectedHash)) failures.push(`Scene ${scene.scene} ${state}: duplicate reviewed frame hash`);
      indices.add(index);
      hashes.add(expectedHash);
      decodedHashes.set(index, decodedHash);
    }
    if (scene.visual_semantic_match !== "pass" || scene.entry !== "pass: overlap-free and within-frame" || scene.midpoint !== "pass: overlap-free and within-frame" || scene.settled !== "pass: overlap-free and within-frame") {
      failures.push(`Scene ${scene.scene}: visual review verdict is incomplete`);
    }
  }
  if (expectedStart !== manifest.frame_count) failures.push(`scene coverage ends at frame ${expectedStart}, expected ${manifest.frame_count}`);

  const ffmpegComma = "\\,";
  const frameFilter = [...decodedHashes.keys()].map((index) => `eq(n${ffmpegComma}${index})`).join("+");
  const frameHashOutput = run(
    "ffmpeg",
    ["-v", "error", "-i", videoPath, "-vf", `select=${frameFilter}`, "-vsync", "0", "-pix_fmt", "rgb24", "-f", "framehash", "-hash", "sha256", "-"],
    "decoded frame verification",
  );
  if (frameHashOutput) {
    const observed = new Map();
    for (const line of frameHashOutput.split(/\r?\n/)) {
      if (!/^\d+,/.test(line)) continue;
      const fields = line.split(",").map((field) => field.trim());
      observed.set(Number(fields[2]), fields.at(-1));
    }
    for (const [index, expectedHash] of decodedHashes) {
      if (!expectedHash || observed.get(index) !== expectedHash) {
        failures.push(`decoded frame ${index}: expected ${expectedHash ?? "missing manifest hash"}, received ${observed.get(index) ?? "missing frame"}`);
      }
    }
  }
}

const semanticAudit = JSON.parse(fs.readFileSync(path.join(evidenceDir, manifest.semantic_audit_file), "utf8"));
if (semanticAudit.decision !== "pass" || semanticAudit.source_artifact_sha256 !== manifest.source_artifact_sha256 || semanticAudit.storyboard_sha256 !== manifest.storyboard_sha256) {
  failures.push("semantic audit is not pass or is not bound to the committed source digest and storyboard");
}
if (semanticAudit.background_items?.length !== 4 || semanticAudit.method_items?.length !== 15 || semanticAudit.scene_items?.length !== 20) {
  failures.push("semantic audit coverage must contain 4 premises, 15 operations, and 20 scenes");
}

const sourceDigest = fs.readFileSync(path.join(packageDir, manifest.source_artifact_file), "utf8");
if (!sourceDigest.includes("Publisher PDF SHA-256:") || sourceDigest.includes("All rights reserved")) {
  failures.push("source digest must retain PDF provenance without embedding publisher boilerplate or article full text");
}

const publicationSpec = JSON.parse(fs.readFileSync(path.join("research-videos", "specs", `${publicationId}.json`), "utf8"));
const ratioMethod = publicationSpec.methods?.find((method) => method.id === "M02");
const ratioSymbol = publicationSpec.symbols?.find((symbol) => symbol.latex.includes("theta"));
if (!ratioMethod?.validity.includes("theta as tau_s divided by tau_q") || ratioMethod.minimalText !== "theta = tau_s / tau_q" || ratioSymbol?.latex !== "\\theta=\\tau_s/\\tau_q") {
  failures.push("publication spec must preserve Equation (3): theta = tau_s / tau_q");
}

const captionsPath = path.join(publicMediaDir, `${publicationId}_en.vtt`);
const captions = fs.readFileSync(captionsPath, "utf8");
const cues = captions.match(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g) ?? [];
if (cues.length !== 20 || !cues[0]?.startsWith("00:00:00.000") || !cues.at(-1)?.endsWith("00:02:00.000")) {
  failures.push("captions must contain 20 cues covering the complete 120-second film");
}

const playerHtml = fs.readFileSync(path.join(evidenceDir, manifest.html_file), "utf8");
if (!playerHtml.includes(manifest.video_file.replaceAll("\\", "/")) || /<track\b[^>]*\bdefault\b/i.test(playerHtml)) {
  failures.push("standalone player must resolve the tracked MP4 and keep captions available without covering in-frame text by default");
}

const scopedCaptionDefault = `default={visual.film.id !== "${publicationId}"}`;
for (const template of ["src/pages/index.astro", "src/pages/publications/index.astro"]) {
  if (!fs.readFileSync(template, "utf8").includes(scopedCaptionDefault)) {
    failures.push(`${template} must disable default captions only for ${publicationId}`);
  }
}
const featureTemplate = fs.readFileSync("src/pages/publications/[id].astro", "utf8");
if (!/<track\b[^>]*\bdefault\s*\/>/.test(featureTemplate)) {
  failures.push("representative publication films must retain their existing default-caption behavior");
}

if (failures.length) {
  console.error(`Rethinking Aquifer video evidence gate failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`Rethinking Aquifer media gate passed: ${videoPath}; 20 scenes; 60 MP4-decoded RGB frame hashes; source, helper, caption, and package provenance verified`);
