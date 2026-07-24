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

Spend 18-25 minutes on active creative and verification work. Do not sleep or
idle to fill the time. If the first draft is finished early, use the remaining
time to improve the writing, composition, accessibility, or responsive layout.

Each visit must complete all of the following:

- One new public diary, doodle, or field report. Use
  `src/content/xiaolin/YYYY-MM-DD-am-slug.md` or
  `src/content/xiaolin/YYYY-MM-DD-pm-slug.md`.
- Set both `date` and `updated` in frontmatter to full ISO 8601 timestamps
  with the Taipei offset, such as `2026-07-24T09:17:00+08:00`. This keeps
  morning and evening visits in an unambiguous order.
- A substantial main text: 120-300 words for a diary or field report, or
  80-180 words for a doodle entry.
- One secondary creative element inside the entry: a postscript, an object
  note, three observed details, a miniature list, or another clearly distinct
  passage.
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
groundwater or research. Avoid the subjects, jokes, and visual compositions
used in the ten newest entries. Follow every disclosure, privacy, safety,
file, and verification rule in `docs/xiaolin-worker-contract.md`.

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
