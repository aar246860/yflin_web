# Current Copy Audit: Lagging Theory-First Redesign

Date: 2026-06-12

Scope: current Astro prototype in `yflin_web_astro`.

## Main Diagnosis

The current site is structurally solid but strategically out of order. It currently presents "groundwater memory" and "transformation uncertainty" as the dominant homepage frame. That is coherent for an internal research architecture, but weaker for public positioning because new visitors may not yet understand why transformation uncertainty matters.

The stronger first public hook is:

> Groundwater response can arrive late. That delay may be the signal.

Lagging Theory should become the first concept. Groundwater Memory, Transformation Uncertainty, and Subsurface Energy Intelligence should become extensions of that initial idea.

## Current Problems

### 1. The homepage starts too far downstream

Current headline:

> Groundwater remembers. Engineering decisions inherit that memory.

This is elegant, but abstract. It assumes the visitor already accepts "memory" as the problem. For a high-value collaborator, the more immediate category entry point is a measurable failure mode: delayed response, phase lag, slow recovery, or TRT mismatch.

Recommended change:

> Groundwater response can arrive late. That delay may be the signal.

### 2. Transformation uncertainty appears before the model story is established

Current operating thesis:

> Drawdown is measured; transmissivity is interpreted.

This is strong, but it should be the second layer, not the first. The public sequence should be:

1. delayed response exists;
2. lagging theory gives a disciplined representation;
3. different representation pathways create transformation uncertainty;
4. decision endpoints change.

### 3. Visible Chinese helper text should be removed from the public English site

The homepage and collaboration page contain visible `p.zh` blocks. In shell output, those blocks display as mojibake-like text. Even if browser rendering is sometimes acceptable, the English-only public version should remove them.

Recommended change:
- Remove visible Chinese public copy in the English version.
- Keep bilingual drafting in private documents or a separate future zh-TW route.

### 4. The collaboration page asks for uncertainty too broadly

Current collaboration logic:

> What is the decision? What observations exist? What uncertainty currently blocks action?

This is useful but generic. The first version should ask for delayed-response problems:

> What forcing was applied? What response arrived late or remained unexplained? Which decision depends on interpreting that delay correctly?

### 5. Concept order should be changed

Current order:

1. Transformation Uncertainty
2. Groundwater Memory
3. Lagging Theory
4. Subsurface Energy Intelligence

Recommended order:

1. Lagging Theory
2. Groundwater Memory
3. Transformation Uncertainty
4. Subsurface Energy Intelligence

## What Should Stay

- The restrained technical tone.
- The "field signal -> parameter -> decision" logic.
- The evidence-gated publication structure.
- The collaboration CTA concept.
- The concept-card architecture.

## What Should Change First

1. Homepage hero and operating thesis.
2. Concept order and concept summaries.
3. Collaboration page framing.
4. Field-note titles and summaries.
5. Claim boundaries in prose lint/evidence rules.

