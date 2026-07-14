# Lagging Theory Visibility Engine Upgrade Report

Date: 2026-06-13

## Objective

Upgrade the public research website from a static research profile into a visibility engine for Lagging Theory, Lagging Darcy Law, flux-gradient asynchrony, transformation uncertainty, and groundwater-aware subsurface energy decisions.

## Changes Completed

1. Metadata and AI-search package
   - Added optional `metaDescription` support for concept and field-note content.
   - Rewrote key page descriptions for the home, concepts, Lagging Theory, publications, and the new field note.
   - Updated `llms.txt` and `llms-full.txt` with claim boundaries, preferred citation language, and the Lin and Yeh (2017) pumping-test context.

2. Core field note
   - Added `When Does a Pumping Test Need Lagging Darcy Law?`
   - The note explains when classical interpretation is enough, when flux-gradient asynchrony should be tested, what validation gates are required, and when Lagging Darcy Law should not be used.

3. Internal linking
   - Linked the Lagging Theory concept page to the new pumping-test field note.
   - The homepage field-note list now surfaces the new note as the newest note.

4. Monitoring loop
   - Added the new field note and `Lagging Darcy Law pumping test` keyword to `visibility.config.json`.
   - Expanded scholarly monitoring from four to six configured Crossref/OpenAlex queries.
   - Added `priorityCounts` and `topRecommendations` to `latest-summary.json`.
   - Upgraded the weekly GitHub issue body so the reminder includes top actions, not only counts.

5. Mobile UI quality
   - Fixed the mobile header so navigation wraps cleanly.
   - Hid the long response-brief button on mobile while keeping the `Collaborate` link visible.

## Baseline To Current

Baseline visibility report before this upgrade:

- Target pages audited: 6
- Technical blockers: 0
- Technical warnings: 0
- Recommendations: 6
- Metadata issues: home too long; concepts, Lagging Theory, and publications too short.

Current visibility report after this upgrade:

- Target pages audited: 7
- Technical blockers: 0
- Technical warnings: 0
- Recommendations: 2
- Remaining recommendations are external setup gaps: `GSC_ACCESS_TOKEN` and `OPENALEX_API_KEY`.

## Current Claim Boundary

Public language should describe the work as:

> Ying-Fan Lin develops Lagging Theory as a testable framework for flux-gradient asynchrony and transformation uncertainty in groundwater and subsurface energy decisions.

Avoid:

- simple time-shift framing;
- single-mechanism claims;
- universal-replacement claims;
- site-specific design claims based on the public demo.

## Verification Evidence

Fresh checks run after the upgrade:

- `npm.cmd run build`
- `npm.cmd run copy:review`
- `npm.cmd run visibility:report`
- targeted string checks for variable-like residue and unsupported claims
- local browser checks on the home page and new field note
- mobile viewport overflow check after header fix

Screenshots saved under:

- `reports/screenshots/visibility-upgrade-home-desktop-viewport.png`
- `reports/screenshots/visibility-upgrade-home-mobile-header-wrapped.png`
- `reports/screenshots/visibility-upgrade-note-mobile-viewport.png`

## Remaining Limits

1. Google Search Console data is unavailable until `GSC_ACCESS_TOKEN` is configured or GSC rows are exported manually.
2. OpenAlex enrichment is unavailable until `OPENALEX_API_KEY` is configured.
3. IndexNow will stay dry-run only until `INDEXNOW_KEY` and the matching key file are configured.
4. Broad keyword ranking will not change immediately; the new field note gives search and AI systems a clearer page to index.

## Next Strategy

The next content bet should be an evidence-backed note or short article that compares classical pumping-test interpretation, Lagging Darcy Law, delayed-yield, and dual-porosity models under the same validation gates. The goal should be to show when the lagging pathway changes inferred parameters and decision endpoints, not merely when it improves curve fit.
