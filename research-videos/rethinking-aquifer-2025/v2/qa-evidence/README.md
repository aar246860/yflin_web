# Rethinking Aquifer Characterization visual-summary QA

This directory contains the 20-scene visual-QA manifest, the 60 reviewed
entry, midpoint, and settled frames, and an adjacent copy of the reviewed MP4.
The adjacent copy keeps the evidence package self-contained for the strict
Manim checker. The browser uses the matching copy at
`public/videos/publications/2025-10-6/2025-10-6.mp4`; the repository verifier
requires both files to have the same SHA-256 hash.

The publisher PDF is not committed. Scientific traceability for repository QA
uses the copyright-safe, hash-bound excerpt digest at `../source-artifact.txt`.
The digest records the publisher PDF SHA-256, and the semantic audit identifies
the PDF page and section for every cited passage.

Run the repository-native evidence gate from the repository root:

```bash
npm run video:verify:2025-10-6
```

For authoring-time validation with the separately installed Manim skill, run
its strict layout checker directly against this self-contained evidence
package. The repository-native command above remains the stable release gate.

The manifest binds every reviewed image to an exact zero-based frame index in
the MP4 and records hashes for the source record, storyboard, semantic audit,
browser review, companion files, and video.
