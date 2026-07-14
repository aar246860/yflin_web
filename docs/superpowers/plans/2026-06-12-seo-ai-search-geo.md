# SEO and AI Search GEO Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a 2026 SEO, AI-search, and GEO exposure layer for the Ying-Fan Lin / Lagging Theory Astro website.

**Architecture:** Keep the Astro website as the source of truth and add three small layers: reusable metadata helpers, AI-readable routes, and content blocks written for citation and answer extraction. Generated static files are copied into the GitHub Pages deployment repository after verification.

**Tech Stack:** Astro 6, static GitHub Pages, JSON-LD, robots.txt, sitemap.xml, RSS, Pagefind, optional IndexNow script.

---

### Task 1: Research and Audit

**Files:**
- Create: `docs/seo_ai_search_sources/README.md`
- Create: `docs/seo_ai_search_audit_2026.md`
- Create: `docs/seo_ai_search_strategy_2026.md`
- Create: `docs/search_submission_checklist_2026.md`

- [x] **Step 1: Collect current official sources**

Use Google Search Central, OpenAI crawler docs, Perplexity crawler docs, Bing IndexNow, structured-data docs, the llms.txt proposal, and recent GEO papers.

- [x] **Step 2: Audit current site**

Check title/description, canonical links, Open Graph, Twitter cards, JSON-LD, sitemap, robots, RSS, route stability, and AI-readable summaries.

- [ ] **Step 3: Save the strategy docs**

Document what gets implemented now and what remains as a manual exposure workflow.

### Task 2: Metadata and Structured Data

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/concepts/[slug].astro`
- Modify: `src/pages/field-notes/[slug].astro`

- [ ] **Step 1: Add SEO helper**

Create a helper for base-path-safe canonical URLs, site root URLs, JSON-LD serialization, and shared metadata constants.

- [ ] **Step 2: Upgrade BaseLayout**

Add canonical URL, robots meta, Open Graph, Twitter card, author metadata, and default JSON-LD graph nodes for Person, WebSite, and WebPage.

- [ ] **Step 3: Add route-specific schemas**

Home uses ProfilePage and DefinedTerm nodes. Concept pages use DefinedTerm plus Article nodes. Field notes use Article nodes.

### Task 3: AI-Readable Content

**Files:**
- Create: `src/pages/llms.txt.ts`
- Create: `src/pages/llms-full.txt.ts`
- Create: `src/content/field-notes/flux-gradient-asynchrony-is-not-simple-delay.md`
- Modify: `src/content/concepts/lagging-theory.md`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/sitemap.xml.ts`
- Modify: `src/pages/rss.xml.ts`

- [ ] **Step 1: Add answer blocks**

Add concise, standalone question-answer blocks on the home page for Lagging Theory, flux-gradient asynchrony, simple-delay distinction, engineering use, and transformation uncertainty.

- [ ] **Step 2: Add llms files**

Expose `llms.txt` and `llms-full.txt` as plain-text routes with absolute links and concise definitions.

- [ ] **Step 3: Add concept note**

Add a field note focused on why flux-gradient asynchrony is not merely simple delay.

- [ ] **Step 4: Add new routes to sitemap and RSS**

Ensure search engines and feed readers can discover the new field note and llms routes.

### Task 4: Crawlers and Indexing Workflow

**Files:**
- Modify: `public/robots.txt`
- Create: `scripts/submit_indexnow.mjs`
- Modify: `package.json`

- [ ] **Step 1: Update robots.txt**

Allow general crawlers plus OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, Perplexity-User, and CCBot. Keep sitemap and add an llms.txt comment.

- [ ] **Step 2: Add optional IndexNow submission script**

Provide a dry-run-safe script that submits sitemap URLs when `INDEXNOW_KEY` is configured.

- [ ] **Step 3: Add npm script**

Expose `npm run indexnow:dry-run` for future use.

### Task 5: Verification and Deploy

**Files:**
- Generated: `dist/**`
- Deploy target: `..\yflin_web\**`

- [ ] **Step 1: Build**

Run `npm.cmd run build` and confirm evidence gate, prose lint, Astro build, and Pagefind pass.

- [ ] **Step 2: Inspect generated files**

Confirm canonical URLs, JSON-LD, robots, sitemap, `llms.txt`, and `llms-full.txt` are generated under `/yflin_web/`.

- [ ] **Step 3: Sync deploy repo**

Copy `dist` to `yflin_web`, preserving `.git`, `AGENTS.md`, `.nojekyll`, Google verification, and deployment notes.

- [ ] **Step 4: Commit and push**

Commit to the GitHub Pages repo and push `main`.

- [ ] **Step 5: Live verification**

Verify the live home page, Lagging Theory page, robots, sitemap, llms routes, CSS asset, and old redirects.
