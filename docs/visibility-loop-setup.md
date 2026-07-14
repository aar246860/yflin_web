# Lagging Theory Free Visibility Loop

This setup keeps the exposure loop free. It produces weekly evidence for whether Lagging Theory is becoming more visible, then converts the evidence into safe next actions.

## What Runs Automatically

- Technical SEO audit for generated pages in `dist/`.
- `sitemap.xml`, `robots.txt`, `llms.txt`, canonical, meta description, and JSON-LD checks.
- Keyword and target-page strategy review from `visibility.config.json`.
- Crossref public metadata searches.
- OpenAlex searches when `OPENALEX_API_KEY` is available.
- Google Search Console search analytics when `GSC_ACCESS_TOKEN` is available.
- IndexNow dry-run every week, with real submission only when `INDEXNOW_KEY` is available.
- A weekly Markdown report in `reports/visibility/`.

## Free External Sources

- GitHub Actions scheduled workflows: https://docs.github.com/actions/using-workflows/events-that-trigger-workflows
- Google Search Console API: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- IndexNow: https://www.indexnow.org/documentation
- Microsoft Clarity: https://learn.microsoft.com/en-us/clarity/
- Cloudflare Web Analytics: https://developers.cloudflare.com/web-analytics/
- Crossref REST API: https://www.crossref.org/documentation/retrieve-metadata/rest-api/
- OpenAlex API: https://developers.openalex.org/

## Manual Setup Checklist

1. Verify the GitHub Pages URL in Google Search Console.
   - Current target: `https://aar246860.github.io/yflin_web/`
   - The deploy repo already keeps `google0b5a64cc3a32bc0f.html`.
   - Optional meta verification can be enabled with `PUBLIC_GOOGLE_SITE_VERIFICATION`.

2. Create a temporary Google Search Console access token when you want API data.
   - Store it only as `GSC_ACCESS_TOKEN` in the local shell or GitHub Actions secret.
   - Do not commit OAuth refresh tokens or service account files.

3. Create a free OpenAlex API key.
   - Store it as `OPENALEX_API_KEY`.
   - Optional: set `OPENALEX_MAILTO` to a contact email for responsible API use.

4. Set a Crossref contact email if you want polite API identification.
   - Store it as `CROSSREF_MAILTO`.

5. Enable IndexNow only after the key file is published.
   - Store the value as `INDEXNOW_KEY`.
   - Keep `INDEXNOW_HOST=aar246860.github.io`.
   - The script can dry-run safely without the key.

6. Optional behavioral analytics.
   - Use Google Analytics 4 with `PUBLIC_GA_MEASUREMENT_ID` when you want standard traffic and acquisition reports.
   - Use Microsoft Clarity with `PUBLIC_CLARITY_PROJECT_ID` when you want free heatmaps/session recordings.
   - Use Cloudflare Web Analytics with `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` when you want lightweight, cookie-free page analytics.
   - Keep real IDs in `.env` locally or GitHub Actions secrets; do not hard-code them into components.

7. Optional Bing Webmaster Tools.
   - Use `PUBLIC_BING_SITE_VERIFICATION` for the `msvalidate.01` meta tag.
   - IndexNow can still dry-run without a key; real submission requires `INDEXNOW_KEY` plus a matching published key file.

## Analytics Environment Variables

The site outputs analytics scripts only when the corresponding environment variable exists at build time:

```powershell
$env:PUBLIC_GA_MEASUREMENT_ID='G-XXXXXXXXXX'
$env:PUBLIC_CLARITY_PROJECT_ID='your-clarity-id'
$env:PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN='your-cloudflare-token'
npm.cmd run build
```

For a no-token production build, the generated pages contain no behavioral analytics script. Google Search Console can still verify the deployed HTML file and the weekly visibility report can still audit technical SEO, `llms.txt`, sitemap, and public scholarly search signals.

## Strategy Rules

The report classifies actions into two groups.

Safe automation:
- Metadata diagnostics.
- Internal-link recommendations.
- AI-search readiness checks.
- IndexNow payload preparation.
- Weekly Markdown report generation.

Human review required:
- New theoretical claims.
- Collaboration positioning.
- External posts.
- Field-note publication.
- Any claim about another researcher, institution, or competitor.

## How To Run Locally

```powershell
npm.cmd run build
npm.cmd run visibility:report
```

Dry-run without network enrichment:

```powershell
npm.cmd run visibility:report:dry-run
```

## Report Location

Reports are written to:

```text
reports/visibility/YYYY-MM-DD-lagging-theory-visibility-report.md
```

The report is meant to answer four questions:

1. Are the canonical Lagging Theory pages technically visible?
2. Which keywords or pages should receive the next field note?
3. Which AI-search files need clearer definitions?
4. Which recommendations are safe to patch automatically, and which need Ying-Fan Lin's review?
