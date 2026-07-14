# Ying-Fan Lin Research Website Design System

## 1. Atmosphere & Identity

The homepage follows an academic research-group directory model inspired by the Stanford Machine Learning Group reference: plain fixed navigation, a compact research-group hero, project icon grid, people/activity grid, training modules, publications, and direct contact. The intent is a credible laboratory/group presence, not a personal marketing landing page.

The rest of the site may keep the scientific earth-tech notebook tone for concept explainers and tools. The homepage should stay closer to an academic directory: white or wax-paper page, restrained gray bands, teal scientific accents, circular people avatars, simple text hierarchy, and almost no shadow.

### 2026 Graphic Design Filter

The current homepage style is not trend-chasing. It applies 2026 graphic-design signals only where they strengthen a research identity:

- **Structured editorial clarity**: Canva's 2026 trend report points to serif type, cleaner layouts, straightforward branding, and toned-down visual noise. For this site, that means serif display headings, restrained copy blocks, and fewer decorative UI patterns.
- **Human texture without mess**: Adobe's 2026 Creative Trends emphasize sensory depth, texture, authenticity, and human connection. For this site, that becomes subtle paper warmth, real team photos, and tactile scientific colors rather than glossy SaaS gradients.
- **Water/earth color relevance**: WGSN/Coloro identify Transformative Teal as a 2026 color signal balancing change and stability. For this site, teal is the primary research identity color because it also matches groundwater and subsurface-energy themes.
- **Bold type as storytelling, not spectacle**: Figma's 2026 trend summary notes bold typography and stronger first impressions. For this site, hero and section titles can be larger and more editorial, but body text remains calm and readable.

## 2. Color

### Palette

| Role | Token | Light | Usage |
|---|---|---:|---|
| Page/base | `--page` | `#f8f7f1` | Main background |
| Group/page | `--group-page` | `#ffffff` | Stanford-style group homepage |
| Group/primary | `--group-red` | `#006b6d` | Legacy token name; 2026 Transformative-Teal-inspired homepage hero and project icons |
| Group/primary-dark | `--group-red-dark` | `#00494d` | Header hover and strong homepage links |
| Group/gray | `--group-gray` | `#f2f0e9` | People and contact bands |
| Group/text | `--group-text` | `#263033` | Stanford-style primary text |
| Group/muted | `--group-muted` | `#4f5b5e` | Stanford-style body copy |
| Group/soft | `--group-soft` | `#657174` | Captions and low-emphasis text |
| Group/border | `--group-border` | `#c8d2ce` | Stanford-style dividers and light borders |
| Group/wax | `--group-wax` | `#fbf5e9` | 2026 wax-paper warmth for subtle bands and hero patterning |
| Group/glow | `--group-glow` | `#9fcf5a` | Sparing high-energy accent for data/motion states, never body text |
| Page/depth | `--page-depth` | `#eeeae0` | Page gradient and section depth |
| Surface/default | `--surface` | `#fffefa` | Cards, video panels, content surfaces |
| Surface/strong | `--surface-strong` | `#ffffff` | Highest-contrast panels |
| Surface/muted | `--surface-muted` | `#e9e4da` | Secondary bands and muted blocks |
| Text/primary | `--text` | `#171717` | Headings and primary labels |
| Text/secondary | `--text-soft` | `#34302a` | Strong body copy |
| Text/muted | `--text-muted` | `#5b594f` | Body copy and captions |
| Border/default | `--rule` | `#d5cab7` | Dividers, cards, chart grid |
| Border/strong | `--rule-strong` | `#b8aa91` | Emphasized borders |
| Signal/measured | `--signal-measured` | `#00776d` | Observed response, primary research signal |
| Signal/model | `--signal-model` | `#24527a` | Analytical model, blue curve |
| Signal/risk | `--risk-boundary` | `#aa3727` | Risk, model mismatch, decision boundary |
| Signal/uncertainty | `--uncertainty-band` | `#8a5b10` | Uncertainty band and caution |
| Signal/energy | `--energy-flow` | `#3566b8` | Subsurface energy and thermal flow |

### Rules

- Use teal for measured/diagnostic signals, blue for model pathways, gold for uncertainty, and brick red for risk or decision boundary.
- Avoid one-hue pages; every major figure or explainer should include at least two semantic signal colors.
- Raw colors belong here or in generated media source files; Astro pages should prefer existing CSS variables.
- Homepage Stanford-style sections use `--group-page`, `--group-red`, `--group-red-dark`, `--group-gray`, and `--group-wax`; do not add warm cards, black CTA buttons, or paper shadows to that surface.
- Use teal as the primary identity. The old `--group-red` name remains only as a compatibility alias in CSS.
- Saturated 2026 color is allowed only as one clear signal color at a time. Avoid dopamine palettes, neon gradients, and high-chroma backgrounds that make the site feel lifestyle- or student-oriented.
- Homepage text colors must pass WCAG 2.2 AA contrast for normal body text: target at least 4.5:1 for normal text and 3:1 only for genuinely large text.
- Avoid pale gray text below 16px. Captions may be smaller than body text only when contrast remains comfortably above AA and line height is at least 1.4.
- Avoid purple-blue AI gradients, oversized rounded cards, and feature-grid filler. If a card does not frame evidence, remove the card.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Usage |
|---|---:|---:|---:|---|
| Display | `clamp(3rem, 6vw, 4.8rem)` | 760 | 1.02 | Hero headlines |
| H1 | `3.65rem` | 760 | 1.02 | Main page titles |
| H2 | `2.45rem` | 700 | 1.08 | Section titles |
| H3 | `1.05rem` | 700 | 1.35 | Cards and compact modules |
| Lead | `1.125rem` | 400 | 1.75 | Hero support copy |
| Body | `1rem` | 400 | 1.75 | Default body text |
| Small | `0.875rem` | 500 | 1.5 | Meta and captions |
| Eyebrow | `0.75rem` | 700 | 1.3 | Uppercase research labels |

### Font Stack

- Homepage academic-group surface: system sans for body text, with serif display headings for 2026 editorial weight.
- Serif/display: Merriweather, Georgia, serif, used for homepage hero and section titles where the page needs publishing authority.
- Primary/body: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
- Mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace.

### Rules

- Homepage headings follow a 2026 editorial-academic rule: serif display for hero and section titles, system sans for navigation, body copy, captions, and people labels. H1 in the hero is about 48-56px desktop; section titles are about 36-42px.
- Homepage readability follows W3C/WCAG reading constraints: body copy starts at 16px, line height is at least 1.5, prose line length is capped near 80 Latin characters, and text must survive 200% browser zoom without clipping or horizontal scrolling.
- Navigation and compact action links should not drop below 12px. Use reduced letter spacing rather than ultra-small uppercase text when preserving an academic directory style.
- Headings must fit their containers without negative letter spacing.
- Scientific variables should be written in readable text when the target audience is non-specialist.
- Avoid internal process language and AI drafting meta-text in public pages.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
|---|---:|---|
| `--space-2` | 8px | Inline gaps |
| `--space-3` | 12px | Compact labels |
| `--space-4` | 16px | Standard groups |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Card groups |
| `--space-10` | 40px | Section internals |
| `--space-12` | 48px | Major groups |
| `--space-16` | 64px | Section rhythm |
| `--space-20` | 80px | Hero rhythm |

### Grid

- Max content width: 1170px on the Stanford-style homepage, matching the reference container grammar.
- Max content width elsewhere: 1180px.
- Primary layout: responsive shell plus 2- or 3-column grids.
- Breakpoints follow existing Astro CSS behavior: single column on narrow screens, dense grids on desktop.

## 5. Components

### Site Header

- **Structure**: brand link, navigation links, no button CTA in the main nav on the homepage-style surface.
- **States**: active link uses `aria-current`; links inherit text color and use small uppercase hover/active treatments.
- **Accessibility**: navigation landmark and explicit current page.

### Stanford-Style Project Grid

- **Structure**: icon, short project title, one-line project purpose, compact link.
- **Grid**: four columns on desktop, two on tablet, one on mobile.
- **Surface**: no card border or shadow; each project reads like an academic group project tile.
- **Icon**: inline SVG stroke icon in group red. No emoji.

### Stanford-Style People Grid

- **Structure**: circular avatar or initials, name, role.
- **Grid**: compact repeated people cells in a gray band.
- **Activity photos**: rectangular photos below the people grid, used as evidence of group activity rather than decorative hero material.

### Research Card

- **Structure**: `article.card` or Starwind `Card` with eyebrow, heading, body, optional action.
- **Spacing**: 24px padding, 8px radius, 1px rule border.
- **States**: links and CTAs use existing Button component.

### Editorial Evidence Row

- **Structure**: short label, research claim, and one plain-language consequence.
- **Surface**: no card unless the row needs grouping; use rule lines and generous whitespace first.
- **Usage**: homepage definitions, research trajectory, and proof points that should feel curated rather than generated.

### Explainer Video Panel

- **Structure**: poster/video surface, metadata, transcript, and stated scope.
- **Spacing**: 24-40px internal rhythm.
- **Accessibility**: video has controls, poster, transcript, and explicit description.
- **Motion**: the video carries the motion; page-level animation is restrained.

### Scientific Math

- **Structure**: native MathML for equations and symbols, with an accessible prose label.
- **Notation**: use discipline-native subscripts such as \(\tau_q\), \(\tau_s\), and \(Q_{\mathrm{allow}}\); visible underscore notation is prohibited.
- **Language**: `Classical Darcy response` names the baseline response. `Equal-lag cancellation` and `Classical Darcy limit` are distinct states.

### Federated Research Network

- **Structure**: group name, institution, confirmed shared topic, external site, and ownership note.
- **Membership**: only confirmed public entries render. Network membership never implies employment, supervision, or ownership of another group's results.
- **Surface**: editorial rows with rules and compact external-link affordances; do not use marketing cards.

### Publication Feature

- **Structure**: citation, research question, physical system, mathematical relation, result, evidence boundary, video, and related work.
- **Video**: explicit aspect ratio and dimensions, user controls, poster, transcript/scope text, and browser-playable H.264 output.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | 120-180ms | ease-out | Button and link feedback |
| Standard | 240-360ms | cubic-bezier(0.22, 1, 0.36, 1) | Astro view transitions |
| Explainer | frame-based | Remotion timing | Scientific short-video narratives |

Rules:

- Motion must serve interpretation: curve drawing, model overlay, decision propagation, or state change.
- Respect `prefers-reduced-motion` in web UI. Videos remain user-controlled.

## 7. Depth & Surface

### Strategy

Mixed: warm tonal shifts plus subtle borders and limited soft shadows.

| Level | Value | Usage |
|---|---|---|
| Subtle | `0 18px 48px rgb(var(--shadow-rgb) / 0.08)` | Video panels and figure cards |
| Default | `var(--shadow)` | Primary content modules |
| Border | `1px solid var(--rule)` | Cards, panels, dividers |

Surfaces should read as paper, field notebook, and scientific figure board rather than glossy SaaS glass.
