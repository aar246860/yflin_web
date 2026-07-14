# SEO and AI Search Audit, 2026-06-12

## Current Strengths

- The site is static, fast, and crawlable from GitHub Pages.
- `astro.config.mjs` defines `site: https://aar246860.github.io` and `base: /yflin_web`, which is required for project-page deployment.
- `sitemap.xml`, `robots.txt`, and `rss.xml` already exist.
- The public message is now focused on Lagging Theory, flux-gradient asynchrony, non-instantaneous hydraulic response, transformation uncertainty, and subsurface energy decisions.
- Pagefind produces a local search index.

## Main Gaps Before This Work

- Pages had no canonical URL.
- Pages had no Open Graph or Twitter card metadata.
- Pages had no JSON-LD structured data.
- `robots.txt` allowed all crawlers but did not make AI-search crawler intent explicit.
- There was no `llms.txt` or compact AI-readable research map.
- The home page did not have standalone answer blocks that an AI system could safely extract.
- The Lagging Theory page explained the idea but did not provide a concise machine-readable definition section.
- The deployment workflow had no optional IndexNow submission script.

## Implementation Direction

- Add shared metadata in the layout, not page-by-page copy-paste.
- Add route-specific schema only where it changes page meaning.
- Keep `llms.txt` concise and link-rich; keep `llms-full.txt` more complete but still bounded.
- Add one field note that directly targets the most likely misunderstanding: treating lagging theory as simple signal delay.
- Use IndexNow as an optional submission workflow because it requires a key and search-engine setup outside the repository.

