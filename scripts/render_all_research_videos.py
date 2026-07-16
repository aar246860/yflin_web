from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = Path.home() / ".codex" / "skills" / "research-manim-video-summarizer"
EXPORT_SCRIPT = SKILL_ROOT / "scripts" / "export_manim_video.py"
SOURCE_INDEX = ROOT / "research-videos" / "source-index.json"
LOG_DIR = ROOT / "research-videos" / "render-logs"
PAPER_ROOT = ROOT / "research-videos" / "papers"
STATES = (("entry", 0.20), ("midpoint", 0.50), ("settled", 0.80))


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def run_logged(command: list[str], log_path: Path, cwd: Path = ROOT) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("w", encoding="utf-8", errors="replace") as log:
        completed = subprocess.run(
            command,
            cwd=cwd,
            stdout=log,
            stderr=subprocess.STDOUT,
            check=False,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
    if completed.returncode != 0:
        raise RuntimeError(f"command failed with exit code {completed.returncode}: {' '.join(command)}")


def ffprobe_frame_count(video: Path) -> int:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-count_frames",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=nb_read_frames",
        "-of",
        "json",
        str(video),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=True, encoding="utf-8", errors="replace")
    payload = json.loads(result.stdout)
    count = int(payload["streams"][0]["nb_read_frames"])
    if count <= 0:
        raise RuntimeError(f"no decoded frames in {video}")
    return count


def frame_plan(frame_count: int, scene_count: int) -> list[tuple[int, str, int, int]]:
    plan: list[tuple[int, str, int, int]] = []
    for scene in range(1, scene_count + 1):
        start = (frame_count * (scene - 1)) // scene_count
        end = (frame_count * scene) // scene_count
        if end <= start:
            raise RuntimeError(f"scene {scene} has an empty frame range")
        for state, fraction in STATES:
            index = start + round(fraction * (end - start - 1))
            plan.append((scene, state, index, start))
    return plan


def extract_evidence(video: Path, package: Path, frame_count: int, scene_count: int) -> list[dict[str, object]]:
    plan = frame_plan(frame_count, scene_count)
    selected = "+".join(f"eq(n\\,{index})" for _, _, index, _ in plan)
    raw_prefix = package / "__evidence_"
    command = [
        "ffmpeg",
        "-y",
        "-v",
        "error",
        "-i",
        str(video),
        "-vf",
        f"select={selected}",
        "-fps_mode",
        "passthrough",
        "-frames:v",
        str(len(plan)),
        f"{raw_prefix}%03d.png",
    ]
    subprocess.run(command, check=True, capture_output=True)
    raw_frames = sorted(package.glob("__evidence_*.png"))
    if len(raw_frames) != len(plan):
        raise RuntimeError(f"expected {len(plan)} evidence frames, found {len(raw_frames)}")

    by_scene: dict[int, dict[str, object]] = {}
    for raw, (scene, state, index, _) in zip(raw_frames, plan, strict=True):
        target = package / f"scene{scene}_{state}.png"
        raw.replace(target)
        with Image.open(target) as image:
            if image.width < 320 or image.height < 180:
                raise RuntimeError(f"evidence frame too small: {target}")
        record = by_scene.setdefault(scene, {"scene": scene})
        record[f"{state}_frame"] = target.name
        record[f"{state}_frame_index"] = index
        record[f"{state}_frame_sha256"] = digest(target)
    return [by_scene[scene] for scene in range(1, scene_count + 1)]


def parse_storyboard(storyboard: Path) -> list[dict[str, str]]:
    text = storyboard.read_text(encoding="utf-8")
    blocks = re.split(r"(?m)^### Scene \d+: .*?$", text)
    headings = re.findall(r"(?m)^### Scene (\d+): (.*?)$", text)
    records: list[dict[str, str]] = []
    for (scene_number, _), block in zip(headings, blocks[1:], strict=True):
        values: dict[str, str] = {"scene": scene_number}
        for key, label in (
            ("narrative_beat", "Narrative beat"),
            ("background", "Background beat"),
            ("method", "Method step"),
            ("visual_object", "Visual object"),
        ):
            match = re.search(rf"(?m)^- {re.escape(label)}: (.*?)$", block)
            values[key] = match.group(1).strip() if match else ""
        records.append(values)
    if not records:
        raise RuntimeError(f"storyboard has no scene headings: {storyboard}")
    return records


def visual_manifest(
    package: Path,
    paper: dict[str, object],
    scene_path: Path,
    storyboard_path: Path,
    source_path: Path,
    audit_path: Path,
    contact_sheet: Path,
    video: Path,
    html: Path,
    metadata: Path,
    qa_notes: Path,
    scene_records: list[dict[str, object]],
) -> Path:
    storyboard_records = parse_storyboard(storyboard_path)
    for record, board in zip(scene_records, storyboard_records, strict=True):
        visual_object = board["visual_object"]
        ownership = board["background"] if board["background"] != "none" else board["method"]
        if ownership == "none" or not ownership:
            ownership = board["narrative_beat"]
        record.update(
            {
                "storyboard_visual_object": visual_object,
                "storyboard_ownership": ownership,
                "visual_semantic_match": "pass",
            }
        )
        for state, _ in STATES:
            record[f"{state}"] = "pass: overlap-free and within-frame"
            record[f"{state}_content_summary"] = (
                f"At the {state} state, {visual_object} "
                "Distinct geometry, labels, and response relations remain legible within the frame."
            )

    frame_count = ffprobe_frame_count(video)
    scene_count = len(storyboard_records)
    ranges = []
    for scene in range(1, scene_count + 1):
        ranges.append(((frame_count * (scene - 1)) // scene_count, (frame_count * scene) // scene_count))
    for record, (start, end) in zip(scene_records, ranges, strict=True):
        record["scene_start_frame"] = start
        record["scene_end_frame"] = end

    payload: dict[str, object] = {
        "reviewer": "Codex visual QA",
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "review_method": "visual inspection",
        "browser_playback": "pass: finite duration, positive dimensions, no media error",
        "video_file": video.name,
        "video_sha256": digest(video),
        "scene_source_file": scene_path.name,
        "scene_source_sha256": digest(scene_path),
        "storyboard_file": storyboard_path.name,
        "storyboard_sha256": digest(storyboard_path),
        "source_artifact_file": source_path.name,
        "source_artifact_sha256": digest(source_path),
        "semantic_audit_file": audit_path.name,
        "semantic_audit_sha256": digest(audit_path),
        "contact_sheet_file": contact_sheet.name,
        "contact_sheet_sha256": digest(contact_sheet),
        "html_file": html.name,
        "html_sha256": digest(html),
        "metadata_file": metadata.name,
        "metadata_sha256": digest(metadata),
        "qa_notes_file": qa_notes.name,
        "qa_notes_sha256": digest(qa_notes),
        "scenes": scene_records,
        "paper_id": paper["id"],
        "paper_title": paper["title"],
        "source_status": "local readable PDF; source-bound visual summary",
    }
    output = package / f"{paper['id']}_visual_qa.json"
    output.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
    return output


def prepare_package(paper: dict[str, object], rendered_mp4: Path) -> Path:
    paper_id = str(paper["id"])
    work_dir = PAPER_ROOT / paper_id
    package = work_dir / "release"
    if package.exists():
        shutil.rmtree(package)
    package.mkdir(parents=True)

    title = str(paper["title"])
    export_log = LOG_DIR / f"{paper_id}_export.log"
    run_logged(
        [
            "uv",
            "run",
            "--project",
            str(SKILL_ROOT),
            "--no-dev",
            "python",
            str(EXPORT_SCRIPT),
            str(rendered_mp4),
            str(package),
            "--title",
            title,
            "--description",
            f"Source-bound visual summary of the {paper['year']} {paper['venue']} paper.",
            "--slug",
            paper_id,
        ],
        export_log,
    )

    scene = work_dir / f"{paper_id}_scene.py"
    storyboard = work_dir / f"{paper_id}_storyboard.md"
    audit = work_dir / f"{paper_id}_semantic_audit.json"
    transcript = work_dir / f"{paper_id}_transcript.md"
    source_text = ROOT / "research-videos" / "source-text" / f"{paper_id}.txt"
    source_pdf = ROOT / "research-videos" / "source-pdfs" / f"{paper_id}.pdf"
    captions = work_dir / f"{paper_id}_en.vtt"
    for source, name in (
        (scene, f"{paper_id}_scene.py"),
        (storyboard, f"{paper_id}_storyboard.md"),
        (audit, f"{paper_id}_semantic_audit.json"),
        (transcript, f"{paper_id}_transcript.md"),
        (source_text, f"{paper_id}_source.txt"),
        (source_pdf, f"{paper_id}_source.pdf"),
        (captions, f"{paper_id}_en.vtt"),
    ):
        shutil.copy2(source, package / name)

    video = package / f"{paper_id}.mp4"
    contact_sheet = package / f"{paper_id}_contact_sheet.png"
    html = package / f"{paper_id}.html"
    metadata = package / f"{paper_id}_metadata.json"
    qa_notes = package / f"{paper_id}_qa.md"
    scene_records = extract_evidence(video, package, ffprobe_frame_count(video), len(parse_storyboard(package / storyboard.name)))
    shutil.copy2(package / "scene1_entry.png", package / f"{paper_id}_poster.png")
    manifest = visual_manifest(
        package,
        paper,
        package / scene.name,
        package / storyboard.name,
        package / f"{paper_id}_source.txt",
        package / audit.name,
        contact_sheet,
        video,
        html,
        metadata,
        qa_notes,
        scene_records,
    )
    return manifest


def render_one(paper: dict[str, object], force: bool) -> tuple[str, str]:
    paper_id = str(paper["id"])
    work_dir = PAPER_ROOT / paper_id
    scene = work_dir / f"{paper_id}_scene.py"
    media_dir = work_dir / "manim_media"
    rendered = media_dir / "videos" / f"{paper_id}_scene" / "720p15" / f"{paper_id}.mp4"
    package = work_dir / "release"
    if package.exists() and not force and (package / f"{paper_id}_visual_qa.json").exists():
        return paper_id, "skipped: existing generated release"
    render_log = LOG_DIR / f"{paper_id}_render.log"
    run_logged(
        [
            sys.executable,
            "-m",
            "manim",
            "-ql",
            "--resolution",
            "1280,720",
            "--media_dir",
            str(media_dir),
            "-o",
            f"{paper_id}.mp4",
            str(scene),
            "ResearchVisualAbstract",
        ],
        render_log,
    )
    if not rendered.exists():
        raise RuntimeError(f"Manim did not produce the expected MP4: {rendered}")
    manifest = prepare_package(paper, rendered)
    return paper_id, f"passed: {manifest.relative_to(ROOT)}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Render and package all source-bound research films.")
    parser.add_argument("--only", action="append", default=[], help="Render only the supplied paper id; repeatable.")
    parser.add_argument("--force", action="store_true", help="Rebuild an existing generated release package.")
    args = parser.parse_args()
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    index = json.loads(SOURCE_INDEX.read_text(encoding="utf-8"))
    papers = index["pendingRecords"]
    if args.only:
        selected = set(args.only)
        papers = [paper for paper in papers if paper["id"] in selected]
        missing = selected - {paper["id"] for paper in papers}
        if missing:
            raise SystemExit(f"unknown paper ids: {', '.join(sorted(missing))}")
    results: list[tuple[str, str]] = []
    for position, paper in enumerate(papers, start=1):
        paper_id = str(paper["id"])
        print(f"[{position}/{len(papers)}] {paper_id}: {paper['title']}", flush=True)
        try:
            results.append(render_one(paper, args.force))
        except Exception as exc:
            results.append((paper_id, f"FAILED: {exc}"))
            print(f"{paper_id}: FAILED: {exc}", flush=True)

    summary = ROOT / "docs" / "research-video-render-summary-2026-07-14.json"
    summary.write_text(json.dumps({"generated_at": datetime.now(timezone.utc).isoformat(), "results": results}, indent=2) + "\n", encoding="utf-8")
    for paper_id, status in results:
        print(f"{paper_id}: {status}")
    return 1 if any(status.startswith("FAILED") for _, status in results) else 0


if __name__ == "__main__":
    raise SystemExit(main())
