# Conference Presence Photo Deploy Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved semi-public JpGU 2026 conference presence photo block to the Astro research website and deploy it to GitHub Pages.

**Architecture:** Use the Astro source project as the only content source. Copy only compressed, metadata-stripped review images into `public/media/conference/jpgu-2026/`, render them through a focused `ConferencePresence.astro` component, then rebuild and sync `dist/` into the GitHub Pages deployment repo.

**Tech Stack:** Astro, Starwind/Tailwind-style utility components, static assets, GitHub Pages.

---

### Task 1: Integrate Approved SI Photo Set

**Files:**
- Create: `public/media/conference/jpgu-2026/*.jpg`
- Create: `src/components/research/ConferencePresence.astro`
- Modify: `src/pages/collaborate/index.astro`
- Modify: `src/styles/global.css`

- [ ] Copy approved SI images from `reports/photo-review-2026-06-12/human-draft-public-ready/` into `public/media/conference/jpgu-2026/`.
- [ ] Create `ConferencePresence.astro` with a main 2x2 visual grid and a lower strip.
- [ ] Insert the component after the collaboration modes section.
- [ ] Add responsive CSS so images do not overlap text and mobile layout becomes single-column.

### Task 2: Build and Preview

**Files:**
- Read: `package.json`
- Generated: `dist/`

- [ ] Run `npm.cmd run build`.
- [ ] Start or reuse an Astro preview server.
- [ ] Verify `/yflin_web/collaborate/` visually on desktop and mobile.
- [ ] Confirm unapproved IDs `J037` and `J061` are absent from `public/` and `dist/`.

### Task 3: Deploy

**Files:**
- Modify generated files in deployment repo `yflin_web/`
- Preserve: `.git`, `.nojekyll`, `AGENTS.md`, `google0b5a64cc3a32bc0f.html`, `blog/`, `pages/`

- [ ] Safely sync generated `dist/` contents to the deployment repo.
- [ ] Run a local static preview from the parent folder if needed.
- [ ] Commit deployment changes.
- [ ] Push to `main`.
- [ ] Verify the public `https://aar246860.github.io/yflin_web/collaborate/` page.
