# Research Visibility OS Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `yflin_web` into an AI-citable, interaction-driven, collaboration-oriented research visibility system.

**Architecture:** Keep the Astro static-site architecture. Add small data-driven routes for glossary, decision lab, and service pages; keep canonical definitions in `src/data/glossary.ts`; verify requirements with a source/output gate script; generate distribution packs from local markdown/content collections without external APIs.

**Tech Stack:** Astro 6, TypeScript-flavored Astro files, vanilla browser JavaScript for the interactive checker, Node ESM scripts, existing Starwind/Tailwind/global CSS, GitHub Pages deployment.

---

## Chunk 1: Gate And Canonical Data

- [ ] Add `scripts/research_visibility_os_gate.mjs`.
- [ ] Add npm script `research-visibility-os:gate`.
- [ ] Run the gate and confirm it fails because the new visibility OS artifacts are missing.
- [ ] Add `src/data/glossary.ts` with canonical definitions, related links, common misunderstandings, and proof status.

## Chunk 2: AI-Citable Routes

- [ ] Add `/glossary/` page using `src/data/glossary.ts`.
- [ ] Add JSON-LD `DefinedTermSet` and `DefinedTerm` graph nodes.
- [ ] Integrate `/glossary/` into sitemap, footer, and LLM maps.

## Chunk 3: Decision Lab

- [ ] Add `src/components/research/LDLNecessityChecker.astro`.
- [ ] Add `/decision-lab/` page with the flagship checker and future tool roadmap.
- [ ] Keep thresholds qualitative and transparent; include screening-tool disclaimer and collaboration CTA.

## Chunk 4: Commercial Collaboration Funnel

- [ ] Add `/services/groundwater-decision-reliability-audit/`.
- [ ] Include audience, problem, deliverables, engagement levels, careful budget language, and CTA.
- [ ] Link service route from Collaborate, Decision Lab, footer, sitemap, and LLM maps.

## Chunk 5: Distribution Engine

- [ ] Add `scripts/generate_distribution_pack.mjs`.
- [ ] Add npm scripts `distribution:pack` and `distribution:pack:all`.
- [ ] Generate markdown packs with LinkedIn, short posts, short-video scripts, newsletter summary, image-card prompt, and AI-search canonical answer.

## Chunk 6: Authority And Verification

- [ ] Add Google Scholar and GitHub `sameAs` to Person JSON-LD.
- [ ] Run `npm.cmd run research-visibility-os:gate`.
- [ ] Run `npm.cmd run distribution:pack:all`.
- [ ] Run `npm.cmd run build` and `npm.cmd run copy:review`.
- [ ] Browser-verify `/glossary/`, `/decision-lab/`, and `/services/groundwater-decision-reliability-audit/` on desktop and mobile.
- [ ] Sync `dist` to deploy repo, commit, push, watch Pages, and verify live URLs.
