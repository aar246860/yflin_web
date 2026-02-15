# AGENTS Guide for `yflin_web`

This file defines project-level instructions for AI agents editing this website.
Scope: this folder and all child folders.

## 1) Project Type
- Pure static website (GitHub Pages style), no backend runtime.
- Main entry: `index.html`
- Multi-page content under `pages/`

## 2) Content Source of Truth (Important)
- UI text is primarily controlled by `js/translations_2026.js`.
- Keep i18n structure:
  - `window.siteTranslations2026["zh-TW"]`
  - `window.siteTranslations2026.en`
- Do **not** rename existing i18n keys unless all `data-i18n` references are updated.
- HTML inline text is fallback only; runtime text is replaced by i18n.

## 3) Where to Edit What
- Home and shared labels: `js/translations_2026.js`
- Publications data: `js/modules/data.js` (`publicationsData`)
- Team/Alumni data: `js/modules/data.js` (`currentMembers`, `alumniMembers`)
- Blog list page: `pages/blog/index.html`
- Blog post content: `pages/blog/posts/*.html`
- Legacy redirect only (do not put real content): `blog/index.html`

## 4) Encoding and Chinese Text Safety
- Always save files as UTF-8.
- Never run transformations that may convert Chinese into `?`.
- If terminal display is garbled, verify file content in editor/browser before assuming corruption.

## 5) Legacy and Redirects
- `_legacy/` is archive content; do not edit unless explicitly requested.
- Keep existing redirect behavior working (e.g., old `blog/` path to `pages/blog/`).

## 6) UI/Structure Constraints
- Preserve current Bento/Grid layout classes unless user asks for structural redesign.
- Prefer content updates over class/DOM rewrites.
- Keep mobile apply button and navigation behavior intact.

## 7) Safe Editing Rules
- For copy updates: change text values, not JS logic.
- For data updates: update data objects only, keep field schema unchanged.
- Avoid destructive git operations.

## 8) Local Preview
- From project root:
  - `py -m http.server 5500`
  - open `http://localhost:5500/index.html`

## 9) Quick Validation Checklist
- i18n key coverage: every `data-i18n` key exists in both `zh-TW` and `en`.
- Chinese rendering check: no accidental `?` replacement in important text.
- Verify modified pages in browser after changes.
