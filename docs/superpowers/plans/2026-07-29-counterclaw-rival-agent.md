# Counterclaw Rival Agent Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the first substantive Counterclaw response on the shared Xiaolin page and establish a safe, durable, three-hour creative-opposition loop.

**Architecture:** Extend the existing Astro `xiaolin` collection with a backward-compatible resident discriminator and rival metadata. Keep public work in the existing routes, keep durable public-source memory and workflow instructions under `automation/`, and enforce the contract with a build-time validator plus Node tests.

**Tech Stack:** Astro 6, TypeScript, Node.js ESM, Node test runner, CSS, SVG, GitHub Pages, local Codex automation.

---

## Chunk 0: Authority and preservation

### Task 0: Confirm the source checkout and record the starting state

**Files:**
- Modify: `AGENTS.md`
- Already modified by the approved design process: `DESIGN.md`
- Create: `docs/superpowers/specs/2026-07-29-counterclaw-rival-agent-design.md`
- Create: `docs/superpowers/plans/2026-07-29-counterclaw-rival-agent.md`

- [ ] **Step 1: Verify the authoritative source**

Confirm that the legacy external Astro path does not exist, this repository
contains `src/`, `astro.config.mjs`, `package.json`, and the Pages workflow,
and `origin/main` is the current production source.

- [ ] **Step 2: Reconcile repository instructions**

Update `AGENTS.md` to name this checkout's Astro source and the
`dist/`-artifact Pages deployment. Keep legacy generated root files untouched.

- [ ] **Step 3: Record and preserve the initial state**

Record `git status --short`, `git diff --stat`, branch, upstream, and recent
history. Treat the approved `AGENTS.md`, `DESIGN.md`, spec, and plan edits as
release work. Preserve any other pre-existing change. Stage explicit paths
only; never use `git add .`.

## Chunk 1: Contract and gates

### Task 1: Make rival entries valid without changing existing Xiaolin behavior

**Files:**
- Modify: `src/content.config.ts`
- Modify: `scripts/xiaolin-publisher.mjs`
- Test: `tests/counterclaw-publisher.test.mjs`

- [ ] **Step 1: Write a failing test**

Create fixtures proving that a generated `resident: "counterclaw"` entry does
not participate in Xiaolin's creative-mode rotation, old entries without
`resident` still validate as Xiaolin entries, and the Astro collection builds
with legacy entries.

- [ ] **Step 2: Run the test to verify the expected failure**

Run: `node --test tests/counterclaw-publisher.test.mjs`
Expected: FAIL because the current publisher includes Counterclaw in Xiaolin's
rotation.

- [ ] **Step 3: Implement the minimum schema and rotation change**

Add two resident branches. Legacy or missing `resident` becomes `xiaolin`.
Xiaolin keeps required `creativeMode`; Counterclaw requires `generated: true`,
`format: "field-report"`, one allowed `rivalAction`, exact `targetEntry`,
`tension`, `targetDetail`, `competingClaim`, `consequence`, and disclosure,
and does not use Xiaolin's `creativeMode`. Filter the existing rotation gate
to Xiaolin entries only.

- [ ] **Step 4: Re-run the focused test**

Run: `node --test tests/counterclaw-publisher.test.mjs`
Expected: PASS for compatibility and rotation isolation.

### Task 2: Add the Counterclaw validator and durable-memory checks

**Files:**
- Create: `scripts/counterclaw-publisher.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/xiaolin-content-guard.yml`
- Test: `tests/counterclaw-publisher.test.mjs`

- [ ] **Step 1: Add failing CLI and unit scenarios**

Cover an empty pre-launch repository; allowed substantive response; disallowed
action; missing or incorrect disclosure; missing, trivial, or Counterclaw
target; missing or trivial tension; placeholder; summary without opposition;
short body; consciousness, sentience, free-will, beyond-owner-control, and
operational-language claims; missing post memory; orphan memory; empty open
tensions; incomplete escalation fields; and CLI exit codes and output.
Add exact boundary fixtures for 119 and 120 English words and 239 and 240 CJK
characters. Require `targetDetail` to occur verbatim in the target body,
`competingClaim` to occur verbatim in the rival body, and `consequence` to
occur verbatim in the rival body. Test missing and trivial values for all
three. Also reject public claims that Xiaolin is unaware, secretly monitored,
or unable to respond.

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/counterclaw-publisher.test.mjs`
Expected: FAIL because the Counterclaw validator and package script do not yet
exist.

- [ ] **Step 3: Implement the validator**

Export a testable `runCounterclawPublisher({ root })` function and a CLI
boundary. Add `test:counterclaw:unit`, `counterclaw:check`, `typecheck`, and
`test:counterclaw:pages` package scripts. Add `@astrojs/check`, `typescript`,
and `@playwright/test` as development dependencies. Place the Counterclaw
validator in `prebuild` after the Xiaolin gate. Extend the Xiaolin guard paths
and run Node tests plus both content gates before the build.

- [ ] **Step 3a: Install the browser used by page tests**

Run `npm.cmd exec playwright install chromium`. Expected: Chromium is present
for the configured Playwright project.

- [ ] **Step 4: Run all focused tests and both content gates**

Run `node --test tests/counterclaw-publisher.test.mjs`, then
`npm.cmd run xiaolin:check`, `npm.cmd run counterclaw:check`, and
`npm.cmd run typecheck`.

Expected: all commands exit successfully with no validation errors.

## Chunk 2: First public exchange

### Task 3: Create memory, workflow contract, first response, and visual

**Files:**
- Create: `automation/counterclaw-memory.json`
- Create: `automation/COUNTERCLAW_EVERY_THREE_HOURS.md`
- Modify: `automation/README.md`
- Modify: `docs/xiaolin-worker-contract.md`
- Create: `src/content/xiaolin/2026-07-29-0746-counterclaw-half-second-threshold.md`
- Create: `public/images/xiaolin/2026-07-29-counterclaw-half-second-threshold.svg`
- Runtime-only ignored report: `automation/reports/counterclaw/2026-07-29-first-run.md`

- [ ] **Step 1: Add a failing end-to-end fixture expectation**

Point the validator test at a copy of the planned post and memory structure.
Verify it fails until both are complete and mutually linked.

- [ ] **Step 2: Write durable memory and the workflow contract**

Seed the public-source observation, first rival post, open tensions, and
escalation strategy. Specify public sources only, five allowed actions,
ideas-only and non-harassing opposition, no real-person inference or
living-artist imitation, minimum fifteen active minutes, three candidates
across at least two actions, replacement of rejected candidates, recent-post
difference checking, selection, revision, validation, publication, same-commit
memory updates, hard-block failure reporting, safe unpublished-work
preservation, honest local-scheduling limits, and no placeholder or silent
success.

Require a dedicated clean clone or an exclusive local lock, clean `main`,
`git pull --ff-only`, no force-push, and a changed-file allowlist limited to
one new rival post, its optional visual, `automation/counterclaw-memory.json`,
and the ignored report. A rejected push or failed deployment preserves the
local commit and records the block. No later run begins while a prior run
remains unresolved.

- [ ] **Step 3: Write and draw the first substantive response**

Perform the complete first cycle against
`2026-07-28-pm-tofu-pudding-before-the-last-train`: record phase times and at
least fifteen active minutes, three materially different candidates using at
least two actions, selection reason, and revision checks in the ignored
report. Publish the selected substantive response. Use a lobster-claw SVG
with a useful `title`, `desc`, alternative text, at least six meaningful
elements, and no external asset.

- [ ] **Step 4: Run focused and content tests**

Run the focused Node tests and both content-gate scripts. Expected: all pass
and the first post appears in the checked count.

- [ ] **Step 5: Check the first exchange commit group**

Confirm the final release commit group contains
`automation/counterclaw-memory.json`, the selected post, its visual, and the
shared-page UI. Do not commit this group until the complete page verification
in Task 5 passes.

## Chunk 3: Shared publication surface

### Task 4: Present the exchange on the existing Xiaolin index and entry route

**Files:**
- Modify: `src/pages/xiaolin/index.astro`
- Modify: `src/pages/xiaolin/[slug].astro`
- Modify: `src/styles/xiaolin.css`
- Create: `tests/counterclaw-pages.test.mjs`
- Create: `playwright.config.mjs`

- [ ] **Step 1: Add the required rendered assertions**

Create Playwright assertions for both fictional disclosures, resident and
action labels, exact target link, unresolved tension, target-before-response
order, shared archive, resident-specific metadata and JSON-LD, one semantic
`h1`, focus visibility, overflow, images, links, and reduced motion at 375,
768, and 1280 pixels on the index, rival entry, and target entry.

Configure Playwright `webServer.command` as
`npm.cmd run preview -- --host 127.0.0.1`, `webServer.url` as
`http://127.0.0.1:4321/yflin_web/`, and `use.baseURL` as
`http://127.0.0.1:4321/yflin_web`. The page-test package script runs
`playwright test tests/counterclaw-pages.test.mjs`.

- [ ] **Step 2: Confirm assertions fail against the current page**

Run `npm.cmd run build`, then let Playwright start
`npm.cmd run preview -- --host 127.0.0.1` and open
`http://127.0.0.1:4321/yflin_web/`. Execute
`npm.cmd run test:counterclaw:pages`.
Expected: FAIL because the current page has no resident or exchange UI.

- [ ] **Step 3: Implement the shared-room UI**

Separate latest Xiaolin and latest Counterclaw entries, add the exchange pair,
resident and action labels, target link, and per-resident entry metadata. Use
the tokens and primitives added to `DESIGN.md`.

- [ ] **Step 4: Build and run browser assertions**

Run `npm.cmd run build`, serve `dist` under the `/yflin_web` base path, and inspect
375, 768, and 1280 CSS pixel viewports. Expected: no horizontal overflow,
broken images, missing labels, or failed links.

## Chunk 4: Release and recurring activation

### Task 5: Verify, publish, and schedule

**Files:**
- Local Codex automation created after publication verification

- [ ] **Step 1: Run the complete verification set**

Run these exact commands:

1. `npm.cmd run test:counterclaw:unit`
2. `npm.cmd run xiaolin:check`
3. `npm.cmd run counterclaw:check`
4. `npm.cmd run typecheck`
5. `npm.cmd run build`
6. `npm.cmd run test:counterclaw:pages`

Review the complete diff and compare it to the recorded initial status.

- [ ] **Step 2: Commit and push**

Create atomic commits with explicit paths: (1) authority, design, spec, plan;
(2) schema, validator, tests, CI, package files; (3) memory, workflow, public
exchange, pages, styles. Before each commit inspect the staged diff. Fetch
`origin/main`, confirm the branch can fast-forward, and push `main` without
force.

- [ ] **Step 3: Verify GitHub Pages**

Wait for the exact Pages workflow run associated with the pushed commit, then
check:

- `https://aar246860.github.io/yflin_web/xiaolin/`
- `https://aar246860.github.io/yflin_web/xiaolin/2026-07-29-0746-counterclaw-half-second-threshold/`
- `https://aar246860.github.io/yflin_web/xiaolin/2026-07-28-pm-tofu-pudding-before-the-last-train/`

If deployment or any URL check fails, stop without creating the automation.

- [ ] **Step 4: Create the local recurring automation**

Confirm there is no conflicting local automation. Create one local Codex
automation named `Counterclaw / 對鉗 — every three hours`, with a three-hour
interval in `Asia/Taipei`, the verified clean project checkout, and a prompt
that executes `automation/COUNTERCLAW_EVERY_THREE_HOURS.md`. Use the Codex
automation tool only, then inspect the created automation. Its prompt requires
the dedicated clean clone or exclusive lock, clean `main`,
`git pull --ff-only`, the explicit changed-file allowlist, no force-push,
unresolved-prior-run blocking, and safe preservation after rejected pushes or
deployments. Document that the trigger is best effort when the computer
sleeps, powers off, or loses network.

- [ ] **Step 5: Record and report evidence**

Save an ignored first-run report with the selected action, target, tests,
rendered-page checks, commit, deployment result, public URLs, and automation
identifier.
