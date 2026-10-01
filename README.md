# Ying-Fan Lin Astro Research Website

Authoritative Astro source for https://aar246860.github.io/yflin_web/.
GitHub Pages builds `main` using `.github/workflows/deploy-pages.yml`.

## Local development

Requires Node.js >=22.12 and FFmpeg (used by the research-video gate).
On Windows, use `npm.cmd` in place of `npm` if needed.

```sh
npm ci
npm run content:sync
npm run test:publications
npm run typecheck
npm run typecheck:publications
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Preview: http://127.0.0.1:4321/yflin_web/
Keep the production `site` and `/yflin_web` base configured in `astro.config.mjs`.

## Publication sources and review

- `src/data/publications.source.json`: authoritative bibliography, keyed by normalized DOI
- `scripts/publication_metadata.json`: separately curated stable IDs, themes, student flags, and explicit review decisions, also keyed by DOI
- `src/data/publications.generated.json`: deterministic generated output; never edit directly
- `src/data/members.generated.json`: retained member data; publication synchronization does not alter it
- `src/data/publicationPresentation.ts`, `publicationFeatures.ts`, and `publicationFilms.generated.json`: reviewed summaries and media, maintained independently of bibliography

`npm run content:sync` is offline. It compiles only reviewed source records; it does not scrape a sibling legacy website or rebuild IDs from array positions. All 41 legacy IDs are retained. New IDs are assigned once in the curated overlay and do not change when articles are inserted, reordered, or corrected.

The catalogue includes six bibliographically verified additions as of 2026-10-01 (47 records). Their source URLs and dates are recorded beside the data. Dates keep explicit day/month/year precision and distinguish online publication from issue dates. Unknown online dates remain `null`; Crossref creation/deposit timestamps are not publication dates. Legacy year/month values remain unchanged, with their original unspecified date meaning documented.

## Daily discovery is review-only

```sh
npm run publication:discover
npm run content:report
```

The existing daily research ingest workflow runs at 20:37 UTC. It queries public Crossref metadata for exact ORCID `0000-0002-4853-3944`, paginates all results, and uploads candidate and health reports under `reports/publications/`. It requires no API key. Missing ORCID metadata can cause omissions, so a manual bibliography reconciliation remains useful. The cumulative review queue uses Actions cache for continuity; cache eviction can lose that queue, so it is not archival storage. Download reports you need to retain; workflow artifacts expire after 30 days.

Discovery never changes the published catalogue, curated summaries, student flags, or media. Ambiguous identities, preprints, and metadata changes stay in review. Failed, empty, rate-limited, or incomplete responses are reported and cannot delete existing catalogue entries or prior valid candidate state.

To approve a new record:

1. Verify the DOI, authorship, formal publication status, publisher record, and date precision
2. Add or correct the DOI-keyed bibliography in `publications.source.json`
3. Add a unique stable ID and reviewed classifications in `publication_metadata.json`; set `review.status` to `approved` only after checking its evidence
4. Run the tests, publication gate, typecheck, and complete build; inspect the archive and preserved old links
5. Obtain authorization before pushing/merging/deploying the reviewed change

A bibliographic addition does not require a video or a research summary. Add those only when independently prepared and reviewed. The importer refuses accidental removal or ID changes relative to existing generated records; intentional corrections that remove or replace a record need a separately reviewed migration.

## Content and checks

- `src/content/concepts/`: core research concepts
- `src/content/field-notes/`: public-facing notes
- `src/content/projects/`: evidence-anchored project summaries
- `npm run publication:gate`: reviewed source consistency, identity, unique DOI/ID, formal record status, date and provenance checks
- `npm run video:gate`: the existing 39 film packages, independent of bibliography coverage
- `npm run evidence:gate` and `npm run lint:prose`: evidence and prose checks
- `npm run build`: full prebuild gates, Astro and Pagefind search

## Publishing

Daily discovery and weekly previews produce review artifacts only. Separately, the existing Pages workflow **does deploy when an authorized change reaches `main`**, or when manually dispatched. Do not confuse a report artifact with a live update. Do not commit `dist/` or manually overwrite the legacy generated root files. See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).
