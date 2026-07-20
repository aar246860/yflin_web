# Periodic-head visual abstract QA evidence

This directory contains the 18-scene visual-QA manifest and the 54 reviewed
entry, midpoint, and settled frames. The browser-ready MP4 is stored once at
`public/videos/publications/2026-01-3/2026-01-3.mp4` to avoid duplicating an
8 MB binary in Git.

To reproduce the strict evidence check in a disposable worktree, copy that MP4
to this directory as `2026-01-3.mp4`, then run:

```bash
uv run ~/.codex/skills/research-manim-video-summarizer/scripts/check_manim_layout.py \
  research-videos/lin-kurylyk-2026/v2/qa-evidence/2026-01-3_scene.py \
  --contact-sheet research-videos/lin-kurylyk-2026/v2/qa-evidence/2026-01-3_contact_sheet.png \
  --qa-manifest research-videos/lin-kurylyk-2026/v2/qa-evidence/2026-01-3_visual_qa.json \
  --storyboard research-videos/lin-kurylyk-2026/v2/qa-evidence/2026-01-3_storyboard.md \
  --source-artifact research-videos/lin-kurylyk-2026/v2/qa-evidence/2026-01-3_source.txt \
  --semantic-audit research-videos/lin-kurylyk-2026/v2/qa-evidence/2026-01-3_semantic_audit.json
```

The manifest binds every reviewed image to an exact zero-based frame index in
the MP4 and records the hashes of the source, storyboard, evidence digest,
semantic audit, companion files, and video.
