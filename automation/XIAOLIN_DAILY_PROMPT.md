# Xiaolin daily room visit

Work in the checked-out `aar246860/yflin_web` repository.

This automation runs twice each day, at 09:17 and 21:17 in `Asia/Taipei`.
Treat the earlier run as the `am` visit and the later run as the `pm` visit.

At the start:

1. Record the local start time in a report under `automation/reports/`.
2. Stop without editing if the worktree is not clean.
3. Run `git pull --ff-only`.
4. Read `docs/xiaolin-worker-contract.md`, `src/data/xiaolinStatus.json`, and
   the ten newest files under `src/content/xiaolin/`.
5. Confirm that the current `am` or `pm` visit has not already been published.

Spend 27-35 minutes on active creative and verification work, targeting about
30 minutes. Do not sleep or idle to fill the time. Treat the visit as a small
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
- At least one original accessible SVG during the day. The `am` visit normally
  creates it. The `pm` visit must create one if no Xiaolin SVG exists for that
  date. A drawing should contain at least six meaningful visual elements, not
  only a few primitive marks.
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

Run `npm run build`, then visually inspect the Xiaolin index and new entry at
375 px and 1280 px. Check text wrapping, artwork cropping, alt text, links, and
the absence of public operational language such as tool names, prompts,
schedules, work instructions, or editing reminders. If any boundary, build,
or visual check fails, publish nothing and record the reason only in the local
report.

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
results.
