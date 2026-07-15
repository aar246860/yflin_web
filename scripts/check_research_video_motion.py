# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=10.4.0", "typer>=0.12.5"]
# ///
"""Reject research videos that behave like static slide sequences."""

from __future__ import annotations

import json
import subprocess
import tempfile
from dataclasses import asdict, dataclass
from pathlib import Path

import typer
from PIL import Image, ImageChops, ImageStat

SAMPLE_RATE = 4
CHANGE_THRESHOLD = 0.1
MAX_STATIC_RUN_SECONDS = 8.0
MIN_CHANGED_PAIR_RATIO = 0.30


@dataclass(frozen=True, slots=True)
class MotionReport:
    """Measured motion evidence for one rendered MP4."""

    video: str
    duration_seconds: float
    sample_count: int
    changed_pair_ratio: float
    max_static_run_seconds: float
    passed: bool


def probe_duration(video: Path) -> float:
    """Read the finite duration from ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(video)],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    duration = float(result.stdout.strip())
    if duration <= 0:
        raise typer.BadParameter("video duration must be positive")
    return duration


def extract_samples(video: Path, directory: Path) -> list[Path]:
    """Decode small, evenly spaced frames for a deterministic motion check."""
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(video),
            "-vf",
            f"fps={SAMPLE_RATE},scale=160:90:force_original_aspect_ratio=decrease,pad=160:90:(ow-iw)/2:(oh-ih)/2",
            str(directory / "sample_%05d.png"),
        ],
        check=True,
    )
    samples = sorted(directory.glob("sample_*.png"))
    if len(samples) < 8:
        raise typer.BadParameter("video needs at least eight decoded samples")
    return samples


def changed(first: Path, second: Path) -> bool:
    """Return whether adjacent frames contain substantive pixel movement."""
    with Image.open(first).convert("RGB") as left, Image.open(second).convert("RGB") as right:
        difference = ImageChops.difference(left, right)
        mean_delta = sum(ImageStat.Stat(difference).mean) / 3
    return mean_delta >= CHANGE_THRESHOLD


def measure(video: Path) -> MotionReport:
    """Measure changed-pair ratio and longest static run."""
    duration = probe_duration(video)
    with tempfile.TemporaryDirectory(prefix="yflin-motion-") as temporary:
        samples = extract_samples(video, Path(temporary))
        changed_pairs = [changed(left, right) for left, right in zip(samples[:-1], samples[1:], strict=True)]
    longest_static = 0
    current_static = 0
    for pair_changed in changed_pairs:
        current_static = 0 if pair_changed else current_static + 1
        longest_static = max(longest_static, current_static)
    static_seconds = longest_static / SAMPLE_RATE
    ratio = sum(changed_pairs) / len(changed_pairs)
    return MotionReport(
        video=str(video),
        duration_seconds=round(duration, 3),
        sample_count=len(samples),
        changed_pair_ratio=round(ratio, 4),
        max_static_run_seconds=round(static_seconds, 3),
        passed=ratio >= MIN_CHANGED_PAIR_RATIO and static_seconds <= MAX_STATIC_RUN_SECONDS,
    )


def main(video: Path = typer.Argument(..., exists=True, readable=True, file_okay=True, dir_okay=False)) -> None:
    """Check that a research video contains continuous visual motion."""
    report = measure(video)
    typer.echo(json.dumps(asdict(report), ensure_ascii=True, indent=2))
    if not report.passed:
        raise typer.Exit(code=1)


if __name__ == "__main__":
    typer.run(main)
