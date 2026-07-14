# Starwind Research Brand Redesign Spec

## Goal

Upgrade the Lagging Theory website from a hand-written static research page into a package-based, design-system-driven Astro research brand site for high-value collaborations.

## Approved Direction

Use Starwind UI as the primary Astro-native UI layer and Fulldev UI blocks as structural references. Keep the site static, SEO-friendly, and GitHub Pages deployable.

## Package Requirements

- Add Tailwind CSS v4 through the documented Astro/Vite path.
- Initialize Starwind UI with the documented CLI.
- Use source-owned Starwind UI components for common UI primitives instead of one-off raw HTML patterns.
- Do not add React solely for shadcn/ui unless a later interactive feature requires it.
- Do not use premium-only blocks or assets.

## Design Requirements

- Maintain the current Lagging Theory and flux-gradient asynchrony positioning.
- Present Ying-Fan Lin as a method owner and collaboration partner, not as a generic lab page.
- Target high-value research and industry partners interested in groundwater, shallow geothermal, TRT, industrial water-energy planning, and uncertainty-aware decisions.
- Keep the tone quiet, technical, and high-trust.
- Avoid generic SaaS hero patterns, decorative orbs, heavy gradients, student recruiting language, and unsupported claims.

## Page Scope

Phase 1 must upgrade:

- Home page
- Collaborate page
- Shared header, footer, card, badge, button, section, and CTA primitives

Phase 1 should preserve:

- Concepts pages
- Field-note pages
- Publications page
- Search and SEO routes
- Existing video assets
- GitHub Pages base path `/yflin_web`

## Visual System

- Base: warm paper, dark ink, restrained borders.
- Accent: teal for research signal, brick for risk/decision, muted gold for diagnostic signal, field blue for subsurface context.
- Layout: wider editorial sections, denser but readable cards, stronger information hierarchy.
- UI primitives: Starwind buttons, cards, badges, separators, tables/tabs where suitable.
- Custom wrappers: research-specific components composed from Starwind primitives.

## Success Criteria

- The project builds with `npm.cmd run build`.
- Home and collaborate pages visibly use the new package-backed design system.
- The pages remain responsive at desktop and mobile widths.
- No horizontal overflow appears in the redesigned sections.
- Deploy output keeps correct `/yflin_web` asset and route paths.
- GitHub Pages live site serves the new design.

