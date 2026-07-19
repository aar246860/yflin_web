# Lin Groundwater Hydraulics Group: Design Contract

## 0. Research Log

- **Reference structure**: reviewed the public EARTHE Lab / EARTH Lab pattern of a clear mission, people, research areas, engagement, and outputs. The site borrows the sequence of ideas, not its code, copy, branding, or imagery.
- **Design practice**: reviewed `Owl-Listener/designer-skills` (accessed 2026-07-14). The implementation uses its research-to-IA, hierarchy, typography, colour, responsive, motion, and visual-critique prompts; it does not install the full external suite into the public website.
- **Accessibility**: reviewed `AccessLint/skills` (accessed 2026-07-14). The implementation keeps native headings, links, captions, keyboard focus, reduced-motion rules, and a separate live-DOM audit step. AccessLint remains an audit dependency, not a visual template.
- **Animation**: reviewed the local `research-manim-video-summarizer` contract. Public films are pre-rendered, source-bounded, user-initiated, captioned where available, and paired with an evidence boundary.
- **Publication-film update (2026-07-16)**: the homepage no longer carries a four-film grid. Every public publication appears once in a left-text/right-film archive row, and all 41 public records now have a paper-specific visual explanation.
- **Decision**: the homepage uses one editorial narrative rather than a dashboard: team presence → research evidence → people and practice → four research lines → outputs → collaboration. Visual abstracts belong to the publication archive, where their paper, film, transcript, and evidence boundary can be inspected together.

**Audit note (2026-07-14):** Playwright checks passed for the six primary routes, including one `h1`, a `main` landmark, image alternative text, text links, language metadata, responsive overflow, and video playback. `@accesslint/cli@0.10.0` could not complete its live scan because its CDP bridge returned `Unexpected token 'v', "var Access"... is not valid JSON`; this is recorded as a tooling blocker, not an accessibility pass.

## Purpose

This site is the public research front door for international collaborators, groundwater practitioners, students, and research readers. It should answer four questions in a short visit:

1. What does the group study?
2. What evidence supports the research direction?
3. Who is doing the work, and how is the group active?
4. How can a technically serious collaboration begin?

The visual reference is the clarity of a strong university research group site, including the information density and direct navigation of Stanford-style lab directories. The site is not a code or copy replica of Stanford, EARTHE, or another group.

## Homepage narrative

The homepage follows this order:

1. **Team presence**: a real conference image and one sentence that states the research domain.
2. **Research evidence**: publication count, trajectory, and an explicit evidence boundary.
3. **People and practice**: public team roles and activity photographs.
4. **Four research lines**: analytical well hydraulics; Lagging Theory and groundwater memory; transformation uncertainty; groundwater-informed subsurface energy.
5. **Selected outputs and collaboration**: a searchable publication path and a specific invitation to bring a technical question.

The home page has one `h1`. Section headings use `h2`, and item headings use `h3`. Navigation remains short:

`Home / Projects / People / Publications / Updates / Collaborate`

Training, Network, Open Tools, Glossary, Explain­ers, and About remain available through the footer and relevant contextual links.

## Visual system

- **Base**: paper white and pale mineral green, with deep ink for headings.
- **Primary signal**: groundwater teal for links and measured hydraulic content.
- **Semantic accents**: brick for lagging or caution, ochre for uncertainty, and muted thermal red for energy.
- **Typography**: a readable system sans for body text and navigation; the existing serif display face is reserved for major research statements and publication titles.
- **Measure**: body text stays near 65–75 characters per line; paragraph line-height remains at least 1.6.
- **Geometry**: square or lightly rounded controls, full-width bands, editorial rows, and image-led figures. Avoid nested cards and repeated dashboard tiles.
- **Publication-film labels**: use reader-facing labels such as `Visual explanation`, `In preparation`, and `Based on the published study`. Keep QA and production terminology out of public copy. Do not imply field validation where none exists.

## Media rules

- Team photographs are real project or conference images with specific alt text and captions.
- The homepage hero is one full-bleed team photograph with the research statement set directly over the image. It is not a split text/media layout and the copy is not enclosed in a card.
- The hero's pumping-test trace is explicitly labelled as conceptual. It may explain the sequence from pumping to measured drawdown and interpretation, but it must not imply that a schematic curve is field data.
- Hero motion uses GSAP only to reveal existing content and draw the conceptual trace. The static HTML/SVG is complete without JavaScript, and `prefers-reduced-motion` leaves every element visible in its final state.
- The hero image is eager; the activity mosaic and publication-film posters are lazy-loaded.
- Video never autoplays. Its poster uses a dedicated play control; after activation, the native controls provide seeking, captions, volume, and full-screen playback. The no-JavaScript fallback retains native controls.
- Manim output may be used only when the source paper or bounded concept ledger supports the storyboard. Public pages expose the finished visual and its evidence boundary, not private manuscript drafts.
- No publication page may describe a conceptual curve as a field observation.

## Content and evidence rules

- A publication claim must point to a DOI, public bibliographic record, or the publication feature data.
- A developing framework is labelled as a concept or demonstration.
- Do not publish unpublished manuscript files, reviewer material, internal notes, private student records, or unsupported rankings.
- The publication archive is the source of truth for the public list. Each record should appear once; themes are tags, not duplicate copies.
- English is the primary site language. `/zh/` provides a Traditional Chinese summary of the research direction and collaboration entry point.

## Implementation and accessibility

- Astro remains static-first. Do not add a client-side framework for the homepage unless the interaction cannot be expressed with native HTML/CSS.
- Use real links, headings, lists, captions, and video controls before adding JavaScript.
- Keep entrance motion between 0.5 and 1.4 seconds, animate transforms and opacity rather than layout properties, and avoid continuous decorative loops.
- The publication-film player is a reusable progressive-enhancement primitive: poster and native controls are the baseline, while JavaScript replaces the resting controls with one keyboard-operable play button and restores native controls after activation.
- Keyboard focus must be visible. Text and controls must meet WCAG 2.2 AA contrast. Reduced-motion users receive no transform or autoplay effects.
- Use the selected information-architecture, hierarchy, type, colour, motion, and critique guidance from `Owl-Listener/designer-skills` as design review prompts, not as a reason to copy a template.
- Use `@accesslint/cli` or equivalent local audit tooling for accessibility checks. Do not install the entire AccessLint skill repository into the public website.

## Maintenance boundaries

- Preserve existing concept, publication detail, field-note, tool, training, and service routes unless a redirect is explicitly documented.
- Keep `base: /yflin_web` and the GA4/Search Console/visibility assets intact.
- Exclude `.codex-review`, `.omo/evidence`, `.superpowers`, `media-qa`, `test-results`, `reports`, environment files, and local preview artifacts from any public source repository.
- Every visual redesign must pass `npm.cmd run build`, the evidence gate, prose lint, Lighthouse, and browser QA at 375, 768, 1280, and 1440 CSS pixels.
