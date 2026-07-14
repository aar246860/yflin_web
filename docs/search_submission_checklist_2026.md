# Search Submission Checklist

## After Each Major Website Update

1. Build the Astro site with `npm.cmd run build`.
2. Deploy generated files to the GitHub Pages repository.
3. Verify the live sitemap:
   - `https://aar246860.github.io/yflin_web/sitemap.xml`
4. Verify AI-readable files:
   - `https://aar246860.github.io/yflin_web/llms.txt`
   - `https://aar246860.github.io/yflin_web/llms-full.txt`
5. Open Google Search Console and submit or inspect:
   - home page
   - Lagging Theory concept page
   - newest field note
   - sitemap
6. Open Bing Webmaster Tools and submit:
   - sitemap
   - newest changed URLs
7. If IndexNow is configured, run:
   - `npm.cmd run indexnow:dry-run`
   - PowerShell: `$env:INDEXNOW_KEY="d467bc57ac0d42aca1064cca3880f286"; npm.cmd run indexnow`
   - Key file: `https://aar246860.github.io/yflin_web/d467bc57ac0d42aca1064cca3880f286.txt`
8. Check that public profiles point to the same canonical site:
   - ORCID
   - Google Scholar profile
   - ResearchGate
   - GitHub profile or repository README
   - university profile
   - seminar pages and association pages

## Monthly GEO Review

- Search Google and Bing for exact terms: "Lagging Theory groundwater", "flux-gradient asynchrony", "non-instantaneous hydraulic response groundwater".
- Ask ChatGPT Search, Perplexity, and Gemini about Lagging Theory in groundwater and record whether the site is cited.
- Add one field note only if it answers a real query, objection, or collaboration need.
- Avoid producing thin keyword pages.
