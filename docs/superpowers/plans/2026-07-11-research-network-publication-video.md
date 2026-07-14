# Research Network, Publication Pages, and Manim Video Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize groundwater terminology and math notation, add federated network and publication-detail routes, and publish a verified Manim visual abstract for Lin and Yeh (2017).

**Architecture:** Astro remains the static source of truth. Typed data modules drive the network and curated publication pages; native MathML handles website notation; Manim Community generates the authored paper video and export package.

**Tech Stack:** Astro 6, TypeScript, native MathML, Manim Community, FFmpeg, Pagefind, GitHub Pages.

---

## Chunk 1: Language and Math Contract

### Task 1: Replace ambiguous public lag labels

**Files:**
- Modify: `src/components/research/TransformationUncertaintyDemo.astro`
- Modify: `src/components/research/LaggingPumpingTestDemo.astro`
- Modify: `src/data/openTools.ts`
- Modify: `DESIGN.md`

- [ ] Replace visible `zero lag`, `no lag`, and `Darcy-like` labels with `Classical Darcy response` or `Classical Darcy limit`.
- [ ] Distinguish equal-lag cancellation from the zero-lag classical limit.
- [ ] Preserve internal keys where changing them would add no user-facing value.
- [ ] Run `npm run lint:prose` and `npm run build`.

### Task 2: Add semantic math rendering

**Files:**
- Create: `src/components/InlineMath.astro`
- Modify: copy-bearing components that expose `tau_*`, `Q_*`, `t_*`, or `P_*`.

- [ ] Implement a small native-MathML component with accessible text.
- [ ] Replace visible underscore notation with MathML or full physical names.
- [ ] Verify 375, 768, and 1280 px layouts.

## Chunk 2: Network and Publication Routes

### Task 3: Add the opt-in research network registry and page

**Files:**
- Create: `src/data/researchNetwork.ts`
- Create: `src/pages/network/index.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `DESIGN.md`

- [ ] Define a typed partner registry with confirmation state and external-site ownership.
- [ ] Render the federation explanation and confirmed partners only.
- [ ] Add navigation without implying team membership or shared ownership.
- [ ] Add Organization/ItemList JSON-LD only for confirmed public entries.

### Task 4: Add curated publication details

**Files:**
- Create: `src/data/publicationFeatures.ts`
- Create: `src/pages/publications/[id].astro`
- Modify: `src/pages/publications/index.astro`

- [ ] Define the Lin and Yeh (2017) curated record from the paper.
- [ ] Render metadata, question, system, equations, findings, evidence boundary, and citation.
- [ ] Link the publication index to detail pages only when a curated record exists.

## Chunk 3: Manim Visual Abstract

### Task 5: Write and validate the strict storyboard

**Files:**
- Create: `research-videos/lin-yeh-2017/storyboard.md`
- Create: `research-videos/lin-yeh-2017/source-notes.md`

- [ ] Extract equations, symbols, sensitivity results, field case, and limits from the 2017 PDF.
- [ ] Write scene-level Hxx rules, triggers, visual antecedents, derivation steps, uncertainty shapes, and bridges.
- [ ] Run the strict storyboard checker and revise until passing.

### Task 6: Implement, render, and export Manim

**Files:**
- Create: `research-videos/lin-yeh-2017/animation/paper_summary_scene.py`
- Create: `research-videos/lin-yeh-2017/animation/mobjects.py`
- Generate: `research-videos/lin-yeh-2017/output/**`
- Copy public assets to: `public/videos/publications/lin-yeh-2017/**`

- [ ] Generate aquifer, well, flux, gradient, curves, field wells, and uncertainty geometry programmatically.
- [ ] Use `MathTex` and overlap guards for all formula/data scenes.
- [ ] Run layout-risk checks, render review quality, export browser package, and inspect the contact sheet.
- [ ] Verify browser video metadata and playback.

## Chunk 4: Integration and Deployment

### Task 7: Integrate, test, and deploy

**Files:**
- Modify generated `dist/**`
- Modify deployment repo `yflin_web/**`

- [ ] Run prose, evidence, build, and search-index gates.
- [ ] Test network, publication detail, video playback, and interactive concept pages at mobile/tablet/desktop widths.
- [ ] Sync `dist` into the GitHub Pages repo while preserving `.git`, `.nojekyll`, verification files, and redirects.
- [ ] Commit, push `main`, and verify the public URLs.

