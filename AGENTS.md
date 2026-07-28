# AGENTS Guide for `yflin_web`

Scope: this folder and all child folders.

## 1) Project Role

- This repository is the authoritative Astro source for
  `https://aar246860.github.io/yflin_web/`.
- GitHub Pages production is built from branch `main`.
- `.github/workflows/deploy-pages.yml` builds the source and deploys the
  generated `dist/` artifact.

## 2) Source of Truth

- Edit Astro source under `src/`, public source assets under `public/`, and
  build or publication scripts under `scripts/`.
- Do not manually edit legacy generated HTML, CSS, or search files at the
  repository root unless the user explicitly asks for an emergency hotfix.
- `dist/` is generated locally and must not be committed.

## 3) Required Deployment Details

- GitHub Pages deploys from the `main` branch workflow.
- Astro must build with:
  - `site: https://aar246860.github.io`
  - `base: /yflin_web`
- Keep `.nojekyll` in the root so GitHub Pages serves `_astro/`.
- Keep `google0b5a64cc3a32bc0f.html` for Google Search Console verification.
- Keep old-path redirect files under `blog/` and `pages/` unless intentionally
  changing legacy URL behavior.

## 4) Safe Editing Rules

- Avoid destructive Git operations.
- Preserve unrelated user changes and stage explicit paths only.
- Never use `git add .` for a release from a previously dirty worktree.
- Before deleting generated files, verify the resolved absolute path is inside
  this repository.
- Do not delete `.git`, this `AGENTS.md`, or deployment notes unless explicitly
  requested.
- Save text files as UTF-8.

## 5) Local Preview

- Run `npm.cmd run build`.
- Run `npm.cmd run preview -- --host 127.0.0.1`.
- Open `http://127.0.0.1:4321/yflin_web/`.

## 6) Quick Validation Checklist

- `npm.cmd run build` succeeds.
- `npm.cmd run typecheck` succeeds when the script is present.
- `index.html` links to `/yflin_web/_astro/...`, not `/_astro/...`.
- Internal links use `/yflin_web/...`.
- `sitemap.xml` and `robots.txt` reference
  `https://aar246860.github.io/yflin_web/`.
- Local preview loads the home page, `/xiaolin/`, and
  `concepts/lagging-theory/`.
