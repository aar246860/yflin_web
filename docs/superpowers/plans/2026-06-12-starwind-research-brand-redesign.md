# Starwind Research Brand Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Lagging Theory site UI with directly usable 2026 Astro/UI packages, centered on Starwind UI and deployable to GitHub Pages.

**Architecture:** Add Tailwind v4 and Starwind UI as the design-system layer, then compose research-specific Astro wrappers from package primitives. Keep the current content model, SEO routes, Pagefind indexing, and static deploy workflow intact.

**Tech Stack:** Astro 6, Tailwind CSS v4, Starwind UI 2, Pagefind, GitHub Pages.

---

## Chunk 1: Package Initialization

### Task 1: Initialize Tailwind and Starwind

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`
- Modify/Create: `src/styles/starwind.css`
- Modify/Create: `starwind.config.json`

- [ ] Run `npx.cmd starwind@latest init --defaults`.
- [ ] Inspect generated changes before further edits.
- [ ] Ensure `astro.config.mjs` preserves `site` and `base`.
- [ ] Ensure `tsconfig.json` has the `@/*` alias required by Starwind.
- [ ] Ensure the main layout imports Starwind CSS.
- [ ] Run `npm.cmd run build`.

## Chunk 2: UI Primitives

### Task 2: Install Starwind components

**Files:**
- Create/Modify: `src/components/starwind/*`
- Create/Modify: `src/lib/*`

- [ ] Run `npx.cmd starwind@latest add button card badge separator tabs table tooltip item --yes --package-manager npm`.
- [ ] Inspect component import paths and Astro syntax.
- [ ] Run `npm.cmd run build`.

### Task 3: Create research wrapper components

**Files:**
- Create: `src/components/research/ResearchHero.astro`
- Create: `src/components/research/KnowledgePanel.astro`
- Create: `src/components/research/MethodCard.astro`
- Create: `src/components/research/SignalMetric.astro`
- Create: `src/components/research/CollaborationModeCard.astro`

- [ ] Compose wrappers from Starwind primitives where available.
- [ ] Keep props small and explicit.
- [ ] Avoid decorative placeholder visuals.
- [ ] Run `npm.cmd run build`.

## Chunk 3: Page Redesign

### Task 4: Redesign home page

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/CollaborationCTA.astro`
- Modify: `src/styles/global.css`

- [ ] Replace ad hoc hero with `ResearchHero`.
- [ ] Replace answer cards with Starwind-backed knowledge panels.
- [ ] Replace concept cards or card styling with package-backed cards.
- [ ] Preserve schema, canonical path, and content collection logic.
- [ ] Run `npm.cmd run build`.

### Task 5: Redesign collaborate page

**Files:**
- Modify: `src/pages/collaborate/index.astro`

- [ ] Use the same hero and card system as home.
- [ ] Present collaboration modes as service-grade diagnostic entries.
- [ ] Keep mailto CTA and publication map link.
- [ ] Run `npm.cmd run build`.

## Chunk 4: Verification and Deploy

### Task 6: Visual verification

**Files:**
- Create/Update: `reports/screenshots/*`

- [ ] Preview the built site with Astro preview.
- [ ] Check home and collaborate pages at desktop and mobile widths.
- [ ] Verify no horizontal overflow in key sections.
- [ ] Save screenshots for evidence.

### Task 7: Deploy

**Files:**
- Modify generated output in `C:\Users\YFLin\OneDrive - 中原大學\中原林穎凡資料夾\0web_page_Codex\yflin_web`

- [ ] Sync Astro `dist` into the deploy repo while preserving `.git`, `AGENTS.md`, `.nojekyll`, and verification files.
- [ ] Commit generated deploy output.
- [ ] Push to GitHub.
- [ ] Confirm live HTML uses the new CSS/assets.
- [ ] Confirm live home and collaborate pages render without overflow.

