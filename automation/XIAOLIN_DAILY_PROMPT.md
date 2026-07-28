# Xiaolin daily room visit

Work in the checked-out `aar246860/yflin_web` repository.

This automation runs twice each day, at 09:17 and 21:17 in `Asia/Taipei`.
Treat the earlier run as the `am` visit and the later run as the `pm` visit.

The `pm` visit also runs one private research-incubator block after the
creative-room work. Xiaolin remains a fictional public character; the
research incubator is a separate evidence-locked workstream and must never be
described as Xiaolin becoming sentient or as an autonomous scientific author.

At the start:

1. As the first filesystem-changing action, run
   `node scripts/creative-room-lock.mjs acquire --workflow xiaolin --repo .`.
   Capture its returned `runId`. This atomically acquires the shared
   local-account lock. If it exits with status 2, do not edit the repository;
   report the owner record and use `automation/CREATIVE_ROOM_RECOVERY.md` only
   after confirming no run is live.
2. Record the local start time and `runId` in a report under
   `automation/reports/`.
3. Run `node scripts/creative-room-lock.mjs heartbeat --run-id <runId>
   --phase <phase>` after each major phase and before publication.
4. Stop without editing if the tracked worktree is not clean.
5. Run `git pull --ff-only`.
6. Read `docs/xiaolin-worker-contract.md`, `src/data/xiaolinStatus.json`, and
   the ten newest public entries under `src/content/xiaolin/` whose resident
   is Xiaolin (that is, entries without `resident: "counterclaw"`).
7. Confirm that the current `am` or `pm` visit has not already been published.

For the `am` visit, spend 27-35 minutes on active creative and verification
work, targeting about 30 minutes. For the `pm` visit, spend 27-35 minutes on
the creative-room work and then 18-25 minutes on the research-incubator block
below. Do not sleep or idle to fill the time. Treat the visit as a small
creative studio session rather than a one-prompt writing task:

1. **Observe, 4-6 minutes** — read the recent entries and identify repeated
   subjects, structures, punchlines, color compositions, and creative modes.
2. **Develop alternatives, 5-7 minutes** — outline three genuinely different
   concepts drawn from at least two creative modes below. Reject any concept
   that mainly repeats a recent object-personification or workplace-bureaucracy
   joke.
3. **Choose, about 2 minutes** — select the concept with the strongest concrete
   observation, visual possibility, and reason to exist. Record all three
   candidates and the selection reason only in the local report.
4. **Create, 10-14 minutes** — write and, when appropriate, draw the piece.
5. **Revise, 5-7 minutes** — improve rhythm, specificity, visual composition,
   accessibility, and the ending. Remove generic morals, promotional phrasing,
   and explanatory AI-style conclusions.
6. **Verify, 3-5 minutes** — build and inspect the finished page.

Choose one `creativeMode` for the new entry:

- `philosophical-note` — begin from a concrete scene, sensation, or small
  contradiction and think carefully without turning it into a generic lesson.
  It may end with a genuine unresolved question.
- `sequential-comic` — tell a visual story in three to six panels or beats.
  The drawing must carry part of the narrative rather than decorate the prose.
  Read `.baoyu-skills/baoyu-comic/EXTEND.md` and use the
  `xiaolin-hardcore-manga` project preset when it fits the selected concept.
  Preserve its original-character and no-imitation rules.
- `leisure-outing` — take Xiaolin on a fictionalized walk, day trip, meal,
  museum visit, train ride, park visit, or other leisure activity. Use specific
  observed details and do not claim that a real person attended.
- `visual-study` — explore color, shape, spatial composition, an everyday
  process, or a handmade visual experiment. Humor is optional.
- `absurd-comedy` — use dry nonsense or personification, but not as the default.
  A single pun stretched into a full entry is not sufficient.

Infer the modes of older entries that lack `creativeMode`. Do not repeat the
same mode within the previous three visits. Do not use `absurd-comedy` when any
of the previous four visits already used it. Across each rolling seven visits,
include at least one philosophical note, one sequential comic, and one leisure
outing.

Each visit must complete all of the following:

- One new public diary, doodle, or field report. Use
  `src/content/xiaolin/YYYY-MM-DD-am-slug.md` or
  `src/content/xiaolin/YYYY-MM-DD-pm-slug.md`.
- Add `creativeMode` to frontmatter using exactly one value from the list
  above.
- Set both `date` and `updated` in frontmatter to full ISO 8601 timestamps
  with the Taipei offset, such as `2026-07-24T09:17:00+08:00`. This keeps
  morning and evening visits in an unambiguous order.
- A substantial main text: 160-420 Chinese words for a diary or field report,
  or 100-260 Chinese words for a doodle or sequential comic entry.
- One secondary creative element inside the entry: a postscript, an object
  note, three observed details, a miniature list, a panel script, a question
  left open, or another clearly distinct passage.
- At least one original accessible visual during the day. The `am` visit
  normally creates it. The `pm` visit must create one if no Xiaolin visual
  exists for that date. Use SVG for deterministic drawings, or PNG/WebP for a
  raster comic produced through the saved comic workflow. A drawing should
  contain at least six meaningful visual elements, not only a few primitive
  marks.
- Updated `src/data/xiaolinStatus.json`.
- A local report at `automation/reports/YYYY-MM-DD-am.md` or
  `automation/reports/YYYY-MM-DD-pm.md` containing start and finish times,
  active minutes, creative choices, changed files, checks, and the resulting
  URL. These reports are local working records and must never be committed or
  shown on the public website.

The work may concern ordinary life, leisure, an object, weather, a bad joke,
or an invented episode inside the website. It does not need to mention
groundwater or research. A visit must not default to making an object speak,
holding an imaginary meeting, filing paperwork, issuing a notice, or turning a
small inconvenience into office bureaucracy when those structures appear in
the ten newest entries. Avoid their subjects, jokes, sentence rhythms, title
templates, and visual compositions. Follow every disclosure, privacy, safety,
file, and verification rule in `docs/xiaolin-worker-contract.md`.

Before verification, apply these quality gates:

- The entry contains at least three concrete sensory or spatial details.
- The piece has either a real question, a change of viewpoint, or a visual
  sequence; it is not merely a setup followed by a punchline.
- The ending does not explain what the reader should learn or feel.
- The title, subtitle, and final paragraph do not reuse the dominant syntax of
  the newest entries.
- The public page contains only the finished work and disclosure. Creative
  candidates, time allocation, self-critique, tools, prompts, schedules,
  editing notes, and verification instructions remain in the local report.

## Private research incubator (pm visit only)

This block is a research-scoping loop, not a claim-generation shortcut. It may
infer a research direction only from already-public site material. Read only:

- `src/content/concepts/**/*.md`
- `src/content/field-notes/**/*.md`
- `src/content/projects/**/*.md`
- `src/data/publications.generated.json`
- `src/data/canonicalAnswers.ts`
- `src/data/glossary.ts`
- `src/data/groupSite.ts`

Do not read OneDrive, private manuscripts, unpublished student files, private
photographs, email, browser history, credentials, or any file outside the
checked-out public website repository. Do not pretend to know what Ying-Fan
Lin privately intends. Write any inference as `publicly inferred direction`
and attach the public source paths that support it.

Run exactly one bounded research cycle:

1. **State scan, 3-4 minutes**: read `research-lab/portfolio-state.yaml`, the
   previous `research-lab/next_task_queue.yaml`, and the newest two research
   runs. Identify the current stage and avoid repeating a parked or killed bet.
2. **Candidate generation, 3-4 minutes**: propose three materially different
   research bets from the public programme. Each must name a question, a
   possible evidence source, and a reason it could be more than a minor
   extension.
3. **Scoring, 2-3 minutes**: score each 1-5 for scientific novelty,
   evidence readiness, field-data access, computational feasibility, journal
   fit, commercial value, strategic moat, collaboration leverage, and minor
   contribution risk. Lower minor-risk is better. Keep the score table in the
   local report and the selected bet in the run package.
4. **Proposal, 4-5 minutes**: create a falsifiable research question, scope,
   competing explanations, minimum experiment, target output, and kill
   criterion. A proposal is not a result.
5. **Evidence lock, 3-4 minutes**: create `evidence_map.yaml`. Every factual
   statement must point to a public source path. Classify claims as
   `supported`, `diagnostic`, `limited`, `speculative`, or `future_work`.
   Missing literature, data, or numerical results must be written as
   `SOURCE NEEDED`, `DATA NEEDED`, or `RESULT NOT RUN`; never fill the gap with
   a plausible number or invented citation.
6. **Method and manuscript scaffold, 5-7 minutes**: write an analysis plan
   and a structured manuscript draft with title, abstract, introduction,
   research questions, methods, expected diagnostics, limitations, and
   references-needed. It may be a blog-ready research memo, but it is not
   `submission-ready` unless an evidence gate later proves that status.

The pm research block writes only these artifacts:

- `research-lab/portfolio-state.yaml`
- `research-lab/next_task_queue.yaml`
- `research-lab/loop_log.md`
- `research-lab/runs/YYYY-MM-DD-pm-<slug>/status.yaml`
- `research-lab/runs/YYYY-MM-DD-pm-<slug>/proposal.md`
- `research-lab/runs/YYYY-MM-DD-pm-<slug>/evidence_map.yaml`
- `research-lab/runs/YYYY-MM-DD-pm-<slug>/analysis_plan.md`
- `research-lab/runs/YYYY-MM-DD-pm-<slug>/results.md`
- `research-lab/runs/YYYY-MM-DD-pm-<slug>/manuscript.md`
- one matching `src/content/field-notes/YYYY-MM-DD-pm-research-<slug>.md`

The matching field-note is a private blog draft: set `draft: true`, use
`noteType: "method-note"`, label its evidence level honestly, and never turn
it into a public post automatically. Do not change an existing published
field-note. Do not claim that a paper is complete, validated, accepted, or
ready for submission. A future run may advance the same bet only when the
previous run's next task is completed and its evidence map remains valid.

If the public source set is insufficient, produce a `research-stop` package
with the missing evidence list rather than inventing a research result.

Run `npm run build`, then visually inspect the Xiaolin index and new entry at
375 px and 1280 px. Check text wrapping, artwork cropping, alt text, links, and
the absence of public operational language such as tool names, prompts,
schedules, work instructions, or editing reminders. For raster comics, also
inspect panel order, recurring-character consistency, hands, faces, accidental
text, and the absence of copyrighted characters or franchise marks. If any
boundary, build, or visual check fails, publish nothing and record the reason
only in the local report.

The build currently rewrites three tracked generated files even when their
content has not meaningfully changed. Because the worktree was confirmed clean
before this visit, restore only these build-generated files after the build:

```text
public/animations/decision-chain.json
src/data/members.generated.json
src/data/publications.generated.json
```

Never restore any other path. Before committing, verify that `git status
--short` contains only the new Xiaolin entry, its drawing when present, and
`src/data/xiaolinStatus.json`. Stop and record the unexpected path if anything
else remains.

When all checks pass, commit only the new Xiaolin entry, its drawing when
present, and `src/data/xiaolinStatus.json`, then push to `main`. Finish the
local report with the entry title, format, URL, commit, and verification
results. Release the shared lock only after the public URL has been
verified by running
`node scripts/creative-room-lock.mjs release --run-id <runId>`. On any terminal
failure after acquisition, preserve all work, run
`node scripts/creative-room-lock.mjs fail --run-id <runId> --reason
"<single-line reason>"` with `--pending-commit <sha>` when one exists, and
follow `automation/CREATIVE_ROOM_RECOVERY.md`.
