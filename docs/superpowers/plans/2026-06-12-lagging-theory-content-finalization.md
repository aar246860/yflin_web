# Lagging Theory Content Finalization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved English-only, Lagging Theory-first content direction into the Astro prototype.

**Architecture:** Keep the existing Astro structure. Update only page copy, concept ordering, concept card rendering, and the shared collaboration CTA. Do not change routing, layout architecture, dependencies, or deployment settings.

**Tech Stack:** Astro, Markdown content collections, existing Node scripts.

---

## File Structure

- Modify `src/pages/index.astro`: homepage SEO, hero, thesis panel, section headings.
- Modify `src/pages/collaborate/index.astro`: collaboration positioning and modes.
- Modify `src/pages/about/index.astro`: English-only about copy.
- Modify `src/components/CollaborationCTA.astro`: remove public Chinese copy and align CTA with delayed-response brief.
- Modify `src/components/ConceptCard.astro`: remove visible `summaryZh` from public English cards.
- Modify `src/components/ResearchLineage.astro`: align lineage language with delayed-response framing.
- Modify `src/pages/concepts/index.astro`: English-only Lagging Theory-first concept system copy.
- Modify `src/content/concepts/*.md`: reorder concepts and update subtitles/summaries.
- Verify with `npm.cmd run build`, `npm.cmd run evidence:check`, and `npm.cmd run prose:lint`.

## Task 1: Apply Approved Website Copy

- [ ] Patch homepage, collaboration page, about page, shared CTA, concept card, and lineage component.
- [ ] Patch concept frontmatter order and public English descriptions.
- [ ] Avoid visible Chinese on public English pages.
- [ ] Keep claim boundaries conservative: Lagging Theory as diagnostic pathway, not universal replacement.

## Task 2: Verify

- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run evidence:check`.
- [ ] Run `npm.cmd run prose:lint`.
- [ ] Search for visible `class="zh"` remnants in page/component templates.
- [ ] Report changed files and verification results.

