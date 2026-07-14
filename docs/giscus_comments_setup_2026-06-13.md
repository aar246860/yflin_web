# Giscus Comments Setup

Date: 2026-06-13

## Public Comment Policy

Comments are enabled for field notes only. The intended use is public technical discussion, reading questions, and interpretation notes. Collaboration details, unpublished data, and project-sensitive material should still go through the response brief or email.

## GitHub Repository

- Repository: `aar246860/yflin_web`
- Repository ID: `R_kgDOOREF5Q`
- Visibility: public
- Discussions: enabled on 2026-06-13

## Giscus Category

- Category: `General`
- Category ID: `DIC_kwDOOREF5c4C_Eto`
- Category URL: `https://github.com/aar246860/yflin_web/discussions/categories/general`

## Site Integration

- Component: `src/components/GiscusComments.astro`
- Mounted in: `src/pages/field-notes/[slug].astro`
- Mapping: `pathname`
- Strict matching: enabled
- Reactions: enabled
- Input position: top
- Theme: light
- Language: English

## Required External Setup

Giscus requires the GitHub Discussions repository to be public and accessible to the Giscus GitHub App. The app was installed on 2026-06-13 with access limited to `aar246860/yflin_web`.

If the embedded comment box later reports that Giscus is not installed, review the app installation for this repository:

```text
https://github.com/apps/giscus
```

No site rebuild is needed after app permission repair when the repository ID and category ID remain unchanged.

The component also includes fallback copy that links to the public discussion category if the embedded frame cannot load.

## Reason For Choosing Giscus

Giscus stores comments in GitHub Discussions, avoids a separate database, and keeps public discussion close to the repository that deploys the website. This fits a research website better than an ad-supported comment system.
