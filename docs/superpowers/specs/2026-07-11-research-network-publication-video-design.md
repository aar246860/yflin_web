# Research Network, Publication Pages, and Manim Video Design

## Objective

Extend the existing groundwater research website without changing its academic-group identity. The release will standardize discipline-native terminology and mathematical notation, introduce a federated research-network page, add reusable publication-detail pages, and publish the first geometry-first Manim visual abstract for Lin and Yeh (2017).

## Scientific Language Contract

- Public labels use **Classical Darcy response** or **Classical Darcy limit**, not `no lag`, `zero lag`, or `Darcy-like`.
- The 2017 paper's symbols are authoritative: \(\tau_q\) is the water-flux lag and \(\tau_s\) is the drawdown-gradient lag.
- \(\tau_q=\tau_s\) is described as equal-lag cancellation in the 2017 formulation; \(\tau_q=\tau_s=0\) is the classical Darcy limit.
- Public prose uses full physical quantities where a symbol is unnecessary. Mathematical symbols use semantic HTML/MathML, never visible underscore notation.
- Teaching implementations state their simplifications and do not claim to reproduce every term in the finite-radius, wellbore-storage solution.

## Information Architecture

### Research Network

`/network/` is an opt-in federation, not an expanded team roster. Each external group owns its own site and research claims. The first release explains the federation and exposes a typed registry with no unconfirmed partner entries. A partner can be added only with a public URL, a jointly relevant topic, and an explicit confirmation state.

### Representative Publications

`/publications/[id]/` renders metadata from the existing publication registry and optional curated detail records. The first curated record is Lin and Yeh (2017). It includes the scientific question, physical system, governing relation, evidence boundary, citation, and browser-ready visual abstract. Other publications continue to use the existing publication index until a curated record is added.

## Visual and Interaction Design

- Follow the existing `DESIGN.md`: editorial academic typography, white/wax-paper surfaces, teal measured signal, blue model signal, gold uncertainty, and brick-red decision boundary.
- Mathematical expressions use native MathML with accessible text fallback. No new client-side math dependency is required.
- Manim supplies authored linear explanation. SVG/browser calculations remain responsible for responsive and interactive model exploration.
- Publication video panels use the existing video-panel grammar: explicit dimensions, controls, poster, transcript/scope text, and reduced page-level motion.

## Lin and Yeh (2017) Visual Abstract

The video begins with a pumping well and a drawdown cone, not a formula. Flux arrows and the drawdown-gradient profile separate in time; the two visible delays become \(\tau_q\) and \(\tau_s\). The generalized radial Darcy relation appears only after those objects exist. The narrative then compares structural-interaction and inertial regimes, shows equal-lag cancellation, overlays the five-well South Dakota field setting, and returns to the pumping-test object with the paper's evidence boundary.

The animation may state only findings supported by the paper:

- the model was developed for constant-rate pumping in a leaky confined aquifer;
- the governing form is mathematically comparable to a dual-porosity model under mapped parameters;
- lag effects are most visible over time windows associated with the lag values;
- the lagging solution improved field-data fit, especially at early pumping time, for the reported case;
- fitted lag times varied with observation distance in the reported data, but are not presented as universal material constants.

## Verification

- Strict storyboard contract and Manim layout-risk checks pass.
- Video exports as H.264, `yuv420p`, `faststart`, with contact sheet, metadata, HTML player, and QA notes.
- Browser playback reports finite duration, positive dimensions, and no media error.
- Astro build, prose lint, evidence gate, search index, responsive visual QA, and public metadata checks pass.
- Deployment preserves GitHub Pages base path `/yflin_web` and existing verification/redirect files.

