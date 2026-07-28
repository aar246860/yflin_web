# Research incubator

This directory is the private, evidence-locked research workstream attached to
the evening Xiaolin room visit. It is not a claim that Xiaolin is sentient and
it is not a substitute for the researcher or coauthors.

The incubator can move a public research direction through these stages:

`public-signal -> candidate-bet -> proposal -> evidence-lock -> analysis-plan -> result -> manuscript-draft -> human-review`

Only public website material may be used for the first two stages. A proposal
must not be written as a result. A result must have a reproducible analysis
artifact and an evidence map. A manuscript draft must keep unsupported claims,
missing data, missing literature, and unrun analyses visible.

## Package layout

- `portfolio-state.yaml`: current bets and their stages.
- `next_task_queue.yaml`: three to seven bounded next actions.
- `loop_log.md`: decisions, stage changes, and kill criteria.
- `runs/<date>-pm-<slug>/`: one evidence-locked research cycle.
- `src/content/field-notes/*-research-*.md`: matching private blog draft with
  `draft: true`; it is not rendered as a public field note.

## Research quality rules

- Use `supported`, `diagnostic`, `limited`, `speculative`, or `future_work` for
  claim status.
- Use `SOURCE NEEDED`, `DATA NEEDED`, and `RESULT NOT RUN` instead of guessing.
- Do not invent citations, numerical results, field validation, or author intent.
- Do not call a package `submission-ready` until a later evidence gate passes.
- A kill criterion is required for every active bet.
