# Xiaolin automation setup

## Counterclaw / 對鉗

Counterclaw uses one local Codex automation:

- **Name:** `Counterclaw / 對鉗 — every three hours`
- **Schedule:** Every three hours in `Asia/Taipei`
- **Project:** `C:\Users\CYCU\Documents\小林勁敵`, the local
  `aar246860/yflin_web` checkout on `main`
- **Prompt:** Read and execute
  `automation/COUNTERCLAW_EVERY_THREE_HOURS.md`.

The trigger is best effort rather than hard real time. Computer sleep, power
loss, or network loss can delay an activation. Every successful activation
still completes at least fifteen active creative minutes and publishes one
substantive response; build time and waiting do not count.

Xiaolin and Counterclaw acquire one atomic lock shared by Codex automations
under the same local operating-system account through
`scripts/creative-room-lock.mjs`. This computer runs both workflows under
`CYCU`, so only one can win even when two triggers start together or use
different checkouts. The lock records its owner, phase, heartbeat, failure,
and pending commit. A failed push or deployment preserves the unpublished
work and lock for the checked recovery procedure in
`automation/CREATIVE_ROOM_RECOVERY.md`. Neither workflow force-pushes.

## Xiaolin

Create one recurring automation with two daily visits.

- **Name:** 小林每日放風
- **Schedule:** Every day at 09:17 and 21:17, `Asia/Taipei`
- **Working directory:** `C:\Users\CYCU\Documents\小林勁敵`
- **Prompt:** Read and execute `automation/XIAOLIN_DAILY_PROMPT.md`.

The working directory should be a clean clone of `aar246860/yflin_web` on
`main`. It must not point at a manuscript folder, OneDrive research folder, or
a worktree containing unpublished material.

Each morning visit performs 27-35 minutes of active creative and verification
work. Each evening visit performs the same creative block plus an additional
18-25 minute private research-incubator cycle. It publishes at most one
Xiaolin entry per visit and writes an ignored local report under
`automation/reports/`. The evening cycle may commit evidence-locked proposal
packages and private `draft: true` field-notes, but it never publishes them as
research results. The automation is not allowed to post on social media, send
messages, alter other site pages, or inspect private material.
