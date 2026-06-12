# AGENTS Guide for `yflin_web`

Scope: this folder and all child folders.

## 1) Project Role
- This repository is the GitHub Pages deployment target for `https://aar246860.github.io/yflin_web/`.
- The site is served as pure static files from the repository root on branch `main`.
- The current production site is generated from the Astro source project:
  - `C:\Users\YFLin\OneDrive - 中原大學\中原林穎凡資料夾\0web_page_Codex\yflin_web_astro`

## 2) Source of Truth
- Do not manually edit generated HTML/CSS/search files here unless the user explicitly asks for an emergency hotfix.
- Normal content, layout, style, and route changes should be made in `yflin_web_astro`, then rebuilt and copied here.
- Generated assets include `_astro/`, `pagefind/`, `about/`, `collaborate/`, `concepts/`, `field-notes/`, `publications/`, `search/`, `team/`, `index.html`, `rss.xml`, and `sitemap.xml`.

## 3) Required Deployment Details
- GitHub Pages source is `main` branch, repository root.
- Astro must build with:
  - `site: https://aar246860.github.io`
  - `base: /yflin_web`
- Keep `.nojekyll` in the root so GitHub Pages serves `_astro/`.
- Keep `google0b5a64cc3a32bc0f.html` for Google Search Console verification.
- Keep old-path redirect files under `blog/` and `pages/` unless intentionally changing legacy URL behavior.

## 4) Safe Editing Rules
- Avoid destructive git operations.
- Before deleting generated files for a deploy, verify the resolved absolute path is inside this repo.
- Do not delete `.git`, this `AGENTS.md`, or deployment notes unless explicitly requested.
- Save text files as UTF-8.

## 5) Local Preview
- To preview the deployed root with the project-page base path, run a static server from the parent folder:
  - `cd "C:\Users\YFLin\OneDrive - 中原大學\中原林穎凡資料夾\0web_page_Codex"`
  - `python -m http.server 5500`
  - open `http://127.0.0.1:5500/yflin_web/`

## 6) Quick Validation Checklist
- `npm.cmd run build` succeeds in `yflin_web_astro`.
- `index.html` links to `/yflin_web/_astro/...`, not `/_astro/...`.
- Internal links use `/yflin_web/...`.
- `sitemap.xml` and `robots.txt` reference `https://aar246860.github.io/yflin_web/`.
- Local preview loads the home page and `concepts/lagging-theory/`.
