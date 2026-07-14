# Ying-Fan Lin Astro Research Website

This is the Astro prototype for a personal research intelligence website centered on groundwater memory, transformation uncertainty, lagging theory, and subsurface energy intelligence.

The previous static website remains unchanged in the sibling `yflin_web` folder.

## Commands

```powershell
npm.cmd install
npm.cmd run content:sync
npm.cmd run evidence:gate
npm.cmd run lint:prose
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4321
```

Local preview:

```text
http://127.0.0.1:4321/
```

## Content Model

- `src/content/concepts/`: core research concepts
- `src/content/field-notes/`: short public-facing concept notes
- `src/content/projects/`: evidence-anchored project summaries
- `src/data/publications.generated.json`: generated from `../yflin_web/js/modules/data.js`

Run `npm.cmd run content:sync` after updating the old publication data source.

## Gates

- `scripts/evidence_gate.mjs`: checks source projects, related publications, and risky overclaim patterns
- `scripts/lint_prose.mjs`: checks AI residue, hype wording, and unwanted positioning
- Pagefind search is generated during `npm.cmd run build`

## Publishing

Do not publish directly from automation. The GitHub Actions workflows build reports and validation artifacts only.

Before public deployment, set the real site URL:

```powershell
$env:SITE_URL='https://your-real-domain.example'
npm.cmd run build
```
