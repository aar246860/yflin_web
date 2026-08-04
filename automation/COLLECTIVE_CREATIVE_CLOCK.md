# Resident collective creative clock

Work only in a fresh checkout of the public `aar246860/yflin_web` repository.
One successful activation advances exactly one meaningful collective project
action. The purpose is to let existing residents research, propose, review,
write, design, compose, and publish beyond arena duels.

## Start and ownership

1. Acquire the shared creative-room lock before any filesystem change:
   `node scripts/creative-room-lock.mjs acquire --workflow room --repo .`.
   Capture the returned `runId`. If another run owns the lock, edit nothing.
2. Require the expected repository and origin, the remote `main` branch, a
   clean tracked worktree, and working GitHub authentication. Pull only with a
   fast-forward update.
3. Determine the current calendar date in `Asia/Taipei`.
4. Read this contract, `src/data/collectiveState.json`,
   `src/data/arenaState.json`, the current journal, every active collective
   project, its evidence ledger, its last three actions, and every draft or
   artifact already attached to the project.
5. If `creativeClock.completedDates` already contains the current Taipei date,
   validate the collective state, release the lock, and make no content
   change. Never create two collective actions for the same date.
6. Do not backfill a missed date. Seven successful activations form one
   editorial cycle, even when the dates are not consecutive.

## Choose existing residents, not new identities

Select one to five active residents from `arenaState.roster`. Do not recruit a
new character from this workflow.

Use persistent personality, ability, current project role, recorded dissent,
recent collective actions, and cooldown fairness. A resident may decline an
invitation, change role, form a temporary studio, leave a project, or request
another specialist already present in the roster. Explain every selection in
the new public action.

Arena wins do not grant editorial authority. A project role is earned by a
visible contribution, review, or accepted responsibility.

## Exactly one higher-level action

Append exactly one new `collective-action` with the next canonical ID and
sequence. Choose one action kind:

- `project-proposed`;
- `team-formed`;
- `evidence-collected`;
- `method-designed`;
- `draft-authored`;
- `peer-review-opened`;
- `revision-made`;
- `artifact-produced`;
- `issue-published`;
- `campaign-designed`;
- `institution-mutated`.

One action may materially update one project, one article, or one attached
artifact. It must leave an auditable result, not a promise to work later.
Examples include accepting roles with explicit objections, adding a verified
source record, writing a bounded section, producing a reproducible figure,
recording an adversarial review, rendering one original audio or video asset,
or publishing a completed issue.

Update `creativeClock.turn`, `cycleDay`, `lastActionId`, `lastActionOn`,
`lastActorIds`, and `completedDates`. Advance a project stage only when its
required public record exists. Do not mark a deliverable published without a
working public URL.

## Seven-stage editorial cycle

Preserve this order while allowing revision loops inside a stage:

1. `proposal`: state a bounded, answerable question and its claim boundary;
2. `coalition`: obtain explicit role responses and record at least one dissent;
3. `evidence`: add public sources, provenance, and unresolved evidence gaps;
4. `method`: specify observable inputs, comparisons, falsifiers, and outputs;
5. `review`: open adversarial review and preserve every major objection;
6. `production`: create the approved text and original multimedia derivatives;
7. `publication`: publish the issue with source, version, and artifact checks.

Do not force a scientific project through all seven stages when the evidence
does not support it. A negative result, unresolved question, failed method, or
rejected proposal is a valid open publication when its record is complete.

## Evidence and research integrity

- Search only public sources. Prefer DOI records, publisher pages, official
  repositories, university pages, and the verified public research site.
- Keep `public-fact`, `character-inference`, `computed-result`, and
  `unresolved-question` visibly separate.
- Do not invent data, numerical results, quotations, affiliations, awards,
  experiments, peer review, acceptance, or real-world actions.
- A model comparison must state its observable inputs, alternatives,
  identifiability limits, validation split, and decision consequence before a
  resident can describe one model as supported.
- A literature-based article must preserve a source ledger and identify
  evidence gaps. Do not treat search summaries as source records.
- Do not label the resident editorial process as external academic peer review
  or claim indexing, journal acceptance, or institutional endorsement.

## Multimedia and outreach

- Video work must retain its script, storyboard, narration text, subtitles,
  source credits, and final public file.
- Audio work must be original. Keep its concept, generation or composition
  record, credits, and final public file. Do not imitate a living artist.
- Promotional copy must link back to the underlying open article and may not
  strengthen its scientific claims.
- An unfinished render remains `in-progress`. A draft pathname or promised
  output is not a published artifact.
- Resident teams may prepare external-post drafts, proposals, emails, or
  campaign plans. They may not send, post, submit, contact a person, purchase
  media, or spend money without a separate explicit owner approval.
- Do not enable public comments or direct visitor-to-character interaction
  from this workflow.

## Routine files

A normal activation may create or update only the files required by its one
action:

- `src/data/collectiveState.json`;
- at most one entry under `src/content/resident-journal/`;
- original project assets under `public/images/xiaolin/journal/`,
  `public/audio/xiaolin/journal/`, or `public/video/xiaolin/journal/`;
- one ignored local report under `automation/reports/`.

Do not modify the arena clock, room scores, resident stories, validators,
layouts, CSS, package files, or unrelated site content during a routine
activation. Infrastructure changes require a separately requested maintenance
turn.

## Verification and publication

Run all of the following:

1. `npm run test:collective:unit`
2. `npm run collective:check`
3. `npm run test:arena:unit`
4. `npm run arena:check`
5. `npm run xiaolin:check`
6. `npm run counterclaw:check`
7. `npm run room:check`
8. `npm run typecheck`
9. `npm run build`
10. `npm run test:counterclaw:pages`
11. `npm run test:collective:pages`

Inspect `/xiaolin/`, `/xiaolin/journal/`, every changed journal entry, and all
changed artifacts at 375, 768, and 1280 CSS pixels. Check text wrapping,
overflow, keyboard focus, source links, author names, stage status, claim
boundaries, media loading, captions, and alternative text.

Commit only the allowlisted state, entry, and artifact files. Push `main` only
after every check passes. Wait for the exact GitHub Pages deployment and
verify every affected public URL. Release the shared lock only after public
verification. On failure, preserve the work and mark the lock failed through
the documented recovery procedure. Never force-push, reroll a known result,
or silently skip an editorial objection.
