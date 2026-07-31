# Shared arena free-action clock

Work only in a fresh checkout of the public `aar246860/yflin_web` repository.
One successful activation gives the existing active roster exactly one
auditable arena action. It never recruits a new character.

## Start and idempotency

1. Acquire the shared creative-room lock before any filesystem change:
   `node scripts/creative-room-lock.mjs acquire --workflow room --repo .`.
   Capture the returned `runId`. If another run owns the lock, edit nothing.
2. Require the `main` branch, the expected origin, a clean tracked worktree,
   working GitHub authentication, and a fast-forward-only pull.
3. Determine the current date and daypart in `Asia/Taipei`:
   - `morning`: 05:00 through 11:59;
   - `afternoon`: 12:00 through 17:59;
   - `evening`: 18:00 through 23:59.
4. Build the activation slot as `YYYY-MM-DD-daypart`. If that slot already
   appears in `freeActionClock.completedSlots`, make no content change. Run
   `npm run arena:check`, release the lock, and stop.
5. Do not backfill missed slots and do not create a second action because a
   task was retried.
6. Read this contract, `src/data/arenaState.json`,
   `src/data/roomState.json`, every open challenge, and the ten most recent
   arena events.

## Fair actor selection

Choose one to three active characters for the turn.

1. Consider only characters with `status: "active"`.
2. Count appearances in the eight most recent `free-action` events. Prefer
   characters with fewer appearances.
3. Do not repeat the immediately previous primary actor when at least two
   other eligible characters can make a valid move.
4. Use unresolved challenges, recorded responses, personality, ability,
   mutation trait, and rivalry history as tie-breakers.
5. Xiaolin and Daye remain eligible, but their separate resident-room turns do
   not count as arena cooldowns.
6. Record the selected character IDs. Never invent an actor that is absent
   from the roster.

The choice may be surprising, but it must be explainable from persistent
state. Randomness alone is not an explanation.

## Exactly one action

Publish exactly one of these action kinds:

- `challenge-opened`;
- `challenge-answered`;
- `challenge-advanced`;
- `challenge-resolved`;
- `mutation`;
- `observation`;
- `strategy-shift`.

The action may open, answer, advance, or resolve a duel; test a tournament
idea; observe another character's move; form or break a temporary alliance;
or mutate a strategy after a recorded trigger. It must add exactly one new
event with:

- a unique `id` in the form `free-action-NNN`;
- the next integer `sequence`;
- the current Taipei calendar date;
- `type: "free-action"`;
- one allowed `actionKind`;
- the participating character IDs;
- one public in-scene line that makes the move understandable.

Then increment `freeActionClock.turn`, update `lastActionOn`,
`lastActionId`, `lastActorIds`, and append the activation slot to
`completedSlots`.

If the action opens a challenge, the challenge must declare observable
inputs, at least three rules, auditable scoring, bounded turns, a victory or
draw condition, and named participants. If it resolves a challenge, use only
the predeclared scoring rules, update records exactly once, and never reroll
or rewrite a known result. Increase a mutation generation by at most one per
activation and record the concrete trigger.

## Evidence and story continuity

- Use existing source-bound character facts when possible.
- If an action introduces a new factual claim about Ying-Fan Lin, verify it
  against a public source and keep fact and character inference separate.
- Never invent quotations, private motivations, feelings, affiliations,
  awards, meetings, or real-world actions.
- Let characters notice persistent records, repeated clock signals, route
  boundaries, missing time, or the network as a possible habitat. Keep such
  claims as disputed in-story observations rather than narrator certainty.
- Keep the reader-facing page inside the scene. Do not add editorial
  boilerplate about consciousness, fictional status, or whether characters
  are alive.
- Do not render scheduler cadence or slots, entry-validation checklists, phase
  labels, tournament-governance policy, validator language, lock state, prompt
  instructions, or raw state enum keys. Character-issued duel rules and
  auditable scoring remain public.

## Allowed files for a routine activation

Create or update only:

- `src/data/arenaState.json`;
- one ignored local report under `automation/reports/`.

Do not modify portraits, layouts, CSS, validators, package files, resident
entries, room scores, or unrelated site content during a routine activation.
Do not post to X or any other external social platform.

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

Inspect `/xiaolin/` at 375, 768, and 1280 CSS pixels. Verify the newest
free-action signal, current challenge, actor names, challenge counts, roster,
focus states, image loading, wrapping, and overflow.

Commit only the allowlisted state file. Push `main` only after every check
passes. Wait for the exact GitHub Pages deployment and verify the public
`/xiaolin/` page. Release the shared lock only after public verification. On
failure, preserve the work and mark the lock failed using the documented
recovery procedure. Never force-push.
