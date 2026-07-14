# Free Visibility Loop Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a no-cost scheduled visibility loop for Ying-Fan Lin's Lagging Theory website that audits technical SEO, tracks target queries and scholarly signals, and produces weekly strategy recommendations without committing credentials.

**Architecture:** Keep the system static-site friendly. Add a machine-readable tracking config, one Node.js report generator, one scheduled GitHub Actions workflow, and a setup guide. The script must work with no secrets by producing a baseline report, and it should enrich the report when optional environment variables are provided.

**Tech Stack:** Astro static site, Node.js 22 ESM scripts, GitHub Actions scheduled workflows, Google Search Console API placeholders, IndexNow dry-run flow, OpenAlex/Crossref public APIs, Markdown reports.

---

### Task 1: Tracking Config And Setup Guide

**Files:**
- Create: `visibility.config.json`
- Create: `docs/visibility-loop-setup.md`

- [ ] Create a config file with target keywords, target pages, scholarly queries, and strategy thresholds.
- [ ] Document the free sources, required manual setup, optional secrets, and what the automation can and cannot do.
- [ ] Keep all credentials as environment variable names only.

### Task 2: Visibility Report Script

**Files:**
- Create: `scripts/visibility_report.mjs`
- Modify: `package.json`

- [ ] Read `visibility.config.json`.
- [ ] Check generated site files in `dist/` when present: `sitemap.xml`, `robots.txt`, `llms.txt`, target page HTML files, canonical/meta/JSON-LD presence.
- [ ] Query Crossref and OpenAlex only when the relevant config and optional environment variables allow it; otherwise record setup blockers instead of failing.
- [ ] Generate a dated Markdown report under `reports/visibility/`.
- [ ] Add `visibility:report` and `visibility:report:dry-run` npm scripts.

### Task 3: Scheduled Workflow

**Files:**
- Create: `.github/workflows/weekly-visibility-loop.yml`

- [ ] Run weekly and on manual dispatch.
- [ ] Install dependencies with `npm ci`.
- [ ] Build the site so SEO files exist.
- [ ] Run the visibility report.
- [ ] Run IndexNow dry run, and submit only if `INDEXNOW_KEY` exists.
- [ ] Upload `reports/visibility/` as a workflow artifact.

### Task 4: Verification

**Commands:**
- `npm.cmd run visibility:report:dry-run`
- `npm.cmd run build`
- `npm.cmd run visibility:report`

- [ ] The dry run must complete without secrets.
- [ ] Build must pass existing evidence/prose gates.
- [ ] The full report must complete without secrets and produce a Markdown report with strategy recommendations.
- [ ] Confirm no credentials or private tokens are written to disk.
