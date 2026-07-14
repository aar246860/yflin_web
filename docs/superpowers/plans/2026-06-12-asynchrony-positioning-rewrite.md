# Asynchrony Positioning Rewrite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite and redeploy the public research website so Lagging Theory is framed around flux-gradient asynchrony and non-instantaneous hydraulic response rather than generic delay.

**Architecture:** The Astro source project remains the source of truth. Public copy is changed in page templates, reusable components, and content collection markdown; production output is rebuilt and copied into the GitHub Pages repository.

**Tech Stack:** Astro, Markdown content collections, Pagefind, GitHub Pages static hosting.

---

### Task 1: Rewrite Public Copy

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/CollaborationCTA.astro`
- Modify: `src/components/ResearchLineage.astro`
- Modify: `src/pages/about/index.astro`
- Modify: `src/pages/concepts/index.astro`
- Modify: `src/pages/field-notes/index.astro`
- Modify: `src/pages/collaborate/index.astro`
- Modify: `src/pages/publications/index.astro`
- Modify: `src/content/concepts/*.md`
- Modify: `src/content/field-notes/*.md`

- [ ] Replace public-facing generic "delay" language with "flux-gradient asynchrony", "non-instantaneous hydraulic response", "out-of-phase response", "pathway adjustment", "inter-domain exchange", "capillary drainage", and "hydro-mechanical coupling" where scientifically appropriate.
- [ ] Keep "lag" where it refers to Lagging Theory terms, but define it as a diagnostic manifestation of asynchronous constitutive, boundary, or pathway response rather than a simple signal delay.
- [ ] Remove or reduce "arrive late" hero language.
- [ ] Keep collaboration calls actionable for high-value partners.

### Task 2: Build And Inspect

- [ ] Run `npm.cmd run build` in `yflin_web_astro`.
- [ ] Search `dist` for broken base paths and outdated hero phrases.
- [ ] Locally preview `http://127.0.0.1:5500/yflin_web/` after copying to deploy repo.

### Task 3: Deploy

- [ ] Copy `dist` into `yflin_web`, preserving `.git`, `AGENTS.md`, and deployment notes.
- [ ] Commit with a concise deployment message.
- [ ] Push to `origin/main`.
- [ ] Verify the live GitHub Pages home page and Lagging Theory page contain the new asynchrony framing.
