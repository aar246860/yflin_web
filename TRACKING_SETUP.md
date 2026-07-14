# Traffic Tracking Setup

The site already includes conditional tracking hooks in `src/components/TrackingHead.astro`.
Tracking scripts are only emitted when build-time public environment variables are set.

## Recommended Free Stack

1. Google Search Console
   - Purpose: search impressions, queries, indexed pages, click-through rate.
   - Existing HTML-file verification is kept at `public/google0b5a64cc3a32bc0f.html`.

2. Google Analytics 4
   - Purpose: page views, referral sources, traffic geography, engagement.
   - Set `PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.

3. Microsoft Clarity
   - Purpose: heatmaps and session recordings.
   - Set `PUBLIC_CLARITY_PROJECT_ID=...`.

## Local Activation

Copy the production example file:

```powershell
Copy-Item .env.production.example .env.production
```

Fill at least:

```text
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id
```

Then rebuild and deploy:

```powershell
npm.cmd run tracking:gate
npm.cmd run build
```

## Astro ClientRouter Note

The site uses Astro `ClientRouter`. GA4 automatic page views are disabled and replaced
with an `astro:page-load` listener so client-side route changes are counted as page views.

## Verification

After building with real IDs, check `dist/index.html` for:

```text
googletagmanager.com/gtag/js?id=G-
clarity.ms/tag/
astro:page-load
```

After deployment, GA4 Realtime should show a visit when opening:

```text
https://aar246860.github.io/yflin_web/
```
