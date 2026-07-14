# Lagging Pumping-Test Demo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add and deploy a calculation-backed Lin and Yeh (2017) pumping-test interaction to the public Astro website.

**Architecture:** Create one focused Astro component with native SVG and client-side JavaScript. Keep the numerical method inside the component and clearly label it as a teaching model. Mount it on the home page and Lagging Theory concept page.

**Tech Stack:** Astro 6, existing Starwind/Tailwind CSS tokens, native SVG, browser JavaScript, Gaver-Stehfest numerical Laplace inversion.

---

### Task 1: Add Interactive Component

**Files:**
- Create: `src/components/research/LaggingPumpingTestDemo.astro`

- [ ] Add HTML structure for controls, presets, chart, readouts, and calculation note.
- [ ] Add client-side numerical routines for Bessel K0 approximation, Stehfest coefficients, Laplace drawdown, and curve rendering.
- [ ] Ensure equal flux and gradient lags collapse to the classical response.

### Task 2: Mount Component

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/concepts/[slug].astro`

- [ ] Replace the purely conceptual decision sketch on the home page with the new pumping-test demo.
- [ ] Add the same demo after the Lagging Theory concept article only.

### Task 3: Style and AI Summary

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/llms-full.txt.ts`

- [ ] Add responsive CSS for desktop and mobile without text overlap.
- [ ] Add AI-readable mention of the pumping-test calculator and its claim boundary.

### Task 4: Verify and Deploy

**Commands:**
- `npm.cmd run copy:review`
- `npm.cmd run build`
- `rg -n "Q_allow|t_recovery|P_failure|full reproduction|guarantees better" dist`
- Deploy `dist` to the GitHub Pages repo, commit, push, wait for Pages, and live-verify.
