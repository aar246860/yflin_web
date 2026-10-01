# Astro Deployment Checklist

## Before authorizing publication

1. Review the diff in `src/`, `scripts/`, and any changed workflow or public asset
2. For publications, verify the DOI-keyed source and curated review decision; retain all existing IDs
3. Run `npm ci`, `npm run test:publications`, `npm run typecheck`, `npm run typecheck:publications`, and `npm run build` with Node.js >=22.12 and FFmpeg available
4. Preview at `http://127.0.0.1:4321/yflin_web/`; check the publication count, DOI links, date labels, video coverage, and older anchored references
5. Obtain explicit permission for the intended push/merge/deployment; a candidate report is not approval to publish

## Production route

- Source: `main` in `aar246860/yflin_web`
- Workflow: `.github/workflows/deploy-pages.yml`
- Build configuration: `site: https://aar246860.github.io`, `base: /yflin_web`
- Deployment artifact: the workflow-generated `dist/`, uploaded by `actions/upload-pages-artifact`
- A push to `main` triggers production deployment; manual `workflow_dispatch` also deploys
- Daily ingest only discovers review candidates and uploads reports; it does not push, open PRs, or deploy

Do not upload the legacy root HTML/CSS/JS as the current site. Do not commit `dist/`. Keep `.nojekyll`, `google0b5a64cc3a32bc0f.html`, and the old-path redirects in `blog/` and `pages/`.

## After an authorized deployment

1. Confirm the intended SHA is on `main` and its Pages workflow completed successfully
2. Open `https://aar246860.github.io/yflin_web/` and `/yflin_web/publications/`
3. Verify `/yflin_web/_astro/` assets, internal links, sitemap and robots URLs
4. Check `/yflin_web/xiaolin/`, `/yflin_web/xiaolin/game-room/`, and `/yflin_web/concepts/lagging-theory/`
5. Confirm existing publication anchors, featured notes and videos still resolve; new bibliography must remain visible without media
