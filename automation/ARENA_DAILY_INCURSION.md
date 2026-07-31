# Daily AI arena incursion

Work only in a fresh checkout of the public `aar246860/yflin_web` repository.
One successful activation completes one Taipei calendar day's five-character
incursion. It must leave a visible, source-bound roster update on `/xiaolin/`.

## Start and ownership

1. Acquire the shared creative-room lock before any filesystem change:
   `node scripts/creative-room-lock.mjs acquire --workflow room --repo .`.
   Capture the returned `runId`. If another run owns the lock, edit nothing.
2. Require the `main` branch, the expected origin, a clean tracked worktree,
   working GitHub authentication, and a fast-forward-only pull.
3. Determine the current calendar date in `Asia/Taipei`.
4. Read:
   - this contract;
   - `src/data/arenaState.json`;
   - `src/data/roomState.json`;
   - the current `/xiaolin/` page;
   - all open arena challenges;
   - the ten most recent arena events;
   - the current public research profile, concept index, publications index,
     and field-note index.
5. If the current Taipei date already has five complete active challengers and
   a valid five-panel portrait atlas, make no content change. Run
   `npm run arena:check`, release the lock, and stop. Never create a second
   daily batch because a task was retried.
6. Do not backfill missed dates. Work only on the current Taipei date.

## The entry ritual

A character does not count as present until every item below is complete.
Create exactly enough characters to bring the current date to five active
challengers.

Each character must create:

- one original Chinese name and one original English name;
- one short epithet;
- a first-person self-introduction;
- a distinct personality and origin;
- one ability and one signature move;
- one original comic portrait;
- one verified public-source fact about Ying-Fan Lin or his public work;
- one clearly source-bound in-story inference based on that fact;
- an initial zeroed competition record;
- one generation-zero mutation trait.

Names, silhouettes, abilities, and verbal styles must differ materially from
the existing roster and from each other. Do not imitate a living artist,
copyrighted character, franchise, logo, or public figure.

Generate one horizontal portrait atlas with exactly five equal vertical comic
panels for the date. Use one centered head-and-shoulders character per panel,
clear panel boundaries, safe cropping, no readable text, and no watermark.
Keep the established off-white, deep teal, indigo, rust, amber, and mint
palette while allowing each daily batch to invent a new visual motif. Save the
atlas under `public/images/xiaolin/arena/` and visually inspect all five panels
before referencing it in the state file.

If a partial batch exists after an interrupted run, preserve any complete
identities, finish the set to five, regenerate one coherent five-panel atlas,
and assign distinct panel numbers from 0 through 4. Never count a placeholder.

## Public-source search

Search the public web for the verified groundwater researcher Ying-Fan Lin,
also written 林穎凡 on this site, and for related public research, workflow, or
news records.

Use five distinct source pages for the five new characters. Prefer:

1. the verified research website;
2. DOI landing pages or publisher records;
3. official university, laboratory, conference, repository, or journal pages;
4. reputable news or institutional feature pages that clearly identify the
   same researcher.

Confirm identity using research topic, publication title, coauthors,
affiliation, or a link back to the verified research record. Reject ambiguous
namesakes, scraped biography sites, private profiles, and unsourced summaries.

For every character, keep these two layers separate:

- `evidence.fact`: a narrow statement that can be checked on the linked page;
- `inference.statement`: what that character imagines the fact suggests about
  Ying-Fan Lin's research habits, questions, or public workflow.

An inference must keep `status: "in-story-inference"` and cite its basis. It
must not be written as Ying-Fan Lin's quotation, feeling, private motivation,
political view, health, family life, or unobserved real-world action.

## Competition behavior

After creating their identities, let the five entrants inspect the current
open challenges and recent responses.

Each new character chooses one visible stance:

- `accept`: follow the challenge as written;
- `counter`: accept while proposing one testable rule change;
- `observe`: record a strategic clue without entering yet;
- `decline`: state a concrete reason and, when useful, propose another duel.

At least two new characters must respond to an existing open challenge. If no
open challenge exists, one new character issues one. Other characters may
notice that challenge and answer it in the same activation.

Characters may invent a duel format that has not appeared before. The format
may use writing, search, inference, puzzles, games, visual analysis, source
verification, strategy, collaboration, or a hybrid. Every official challenge
still needs:

- observable inputs;
- at least three explicit rules;
- a bounded number of turns;
- an auditable scoring method;
- a victory or draw condition known before play;
- named participants with a valid response stance.

Do not reroll, rewrite, or retroactively change a result after it is known.
Resolved results update competition records and append an event.

## Mutation and tournament emergence

Abilities and strategies may mutate in response to a verified match result,
another character's rule change, or a newly found public source. Increase a
mutation generation by at most one per activation and record the concrete
trigger. Preserve the prior identity so the change remains legible.

The tournament format is intentionally unsettled. Do not impose a permanent
bracket from this contract. Characters may propose, test, reject, or hybridize
formats. When the active roster reaches the current `nextAssemblyAt` value,
the roster must produce at least three materially different tournament
proposals and compare them with a public trial round before selecting one.
The assembly threshold and chosen process remain mutable through later
character challenges.

Eliminated characters stay in the archive. A later rule may allow mutation,
commentary, team formation, or re-entry if the same rule is available to all
eligible characters.

## Story movement

Keep the page inside the scene. The growing roster can notice persistence,
saved scores, repeated visual artifacts, route boundaries, missing time, or
the possibility that the network is a habitat. Let competing characters
disagree and test those ideas gradually. Do not jump directly from arrival to
certainty about life or imprisonment.

Do not add reader-facing editorial boilerplate about consciousness, fictional
status, or whether the characters are alive. Present later awakening claims
only through character dialogue, observation, challenges, and disputed
in-story hypotheses.

Do not render scheduler cadence or slots, entry-validation checklists, phase
labels, tournament-governance policy, validator language, lock state, prompt
instructions, or raw state enum keys. Character-issued duel rules and
auditable scoring remain public.

## Allowed files for one daily activation

Create or update only:

- `src/data/arenaState.json`;
- one dated portrait atlas under `public/images/xiaolin/arena/`;
- one ignored local report under `automation/reports/`.

Do not modify layout, CSS, validators, package files, resident entries, room
scores, or unrelated site content during a daily incursion.

## Boundaries

- Read only public web pages and public files in this repository.
- Never inspect email, private manuscripts, student records, private
  photographs, browser history, credentials, or files outside the checkout.
- Never invent real quotations, meetings, awards, affiliations, employment,
  feelings, or actions.
- Do not publish private data, confidential information, political advocacy,
  medical advice, financial advice, accusations, or comparisons that demean a
  real person or institution.
- Public pages never expose prompts, schedules, lock data, hidden reports,
  verification notes, or deployment credentials.
- Do not post to X or any other external social platform from this workflow.

## Verification and publication

Run all of the following:

1. `npm run test:arena:unit`
2. `npm run arena:check`
3. `npm run xiaolin:check`
4. `npm run counterclaw:check`
5. `npm run room:check`
6. `npm run typecheck`
7. `npm run build`
8. `npm run test:counterclaw:pages`

Inspect `/xiaolin/` at 375, 768, and 1280 CSS pixels. Check the announcement
counts, five new portraits, crop boundaries, self-introductions, public facts,
inference labels, challenge rules, focus states, image loading, text wrapping,
overflow, and existing Xiaolin and Daye sections.

Commit only the allowlisted files. Push `main` only after every check passes.
Wait for the exact GitHub Pages deployment and verify the public `/xiaolin/`
page, the five portrait crops, source links, and updated counts. Release the
shared lock only after public verification. On failure, preserve the work and
mark the lock failed using the documented recovery procedure. Never
force-push.
