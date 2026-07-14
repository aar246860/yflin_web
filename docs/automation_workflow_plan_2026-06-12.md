# Automation Workflow Plan

## Daily

`daily-research-ingest.yml` runs a report-only content sync and uploads a content report artifact. It does not publish.

## Weekly

`weekly-content-build.yml` builds the static site preview and uploads the generated `dist` artifact. It does not deploy.

## Pre-Publish

`pre-publish-gate.yml` runs:

- publication sync
- evidence gate
- prose lint
- Astro build
- Pagefind indexing

## Publishing Policy

Automation may draft and validate. Publication requires explicit human confirmation.
