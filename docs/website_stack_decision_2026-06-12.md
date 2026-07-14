# Website Stack Decision

Date: 2026-06-12

## Recommendation

Use Astro as the static-site generator, Astro content collections for concepts and notes, Pagefind for static search, and GitHub Actions for scheduled validation reports. Keep the first prototype mostly custom CSS rather than React-heavy component libraries.

## Decisions

- Astro: selected because it is a content-driven static framework and supports Markdown/content collections.
- Tailwind CSS v4: not used in the first prototype. The design system is small enough that custom CSS is clearer and avoids utility-class noise.
- shadcn/ui: not used directly. Its agent-friendly component distribution model is useful, but the current site does not need React primitives.
- Pagefind: selected for static search after build.
- Vale/LanguageTool concept: represented by `.vale.ini`, Vale rules, and a local Node prose gate. LanguageTool can be added later for grammar checks.
- Decap CMS: not included in the first prototype. It is useful for non-technical editors, but this workflow is agent-generated and Git-reviewed.
- GitHub Actions: selected for report-only scheduled workflows and pre-publish validation.

## Sources Checked

- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro GitHub Pages deployment: https://docs.astro.build/en/guides/deploy/github/
- shadcn/ui docs: https://ui.shadcn.com/docs
- Tailwind CSS v4: https://tailwindcss.com/blog/tailwindcss-v4
- Pagefind: https://pagefind.app/
- Vale: https://vale.sh/docs
- GitHub Actions schedule: https://docs.github.com/actions/using-workflows/events-that-trigger-workflows
