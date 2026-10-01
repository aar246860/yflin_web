# Lagging Theory newcomer route: evidence and scope

Review baseline: `78bdc53177db8dd8965f78379d135ce0a6af8fd3` (public `main`, checked 2026-10-01 UTC).

This change fixes the Open Tools and LLM-map pumping-demo links, organizes the existing concept page into three reading paths, connects two published cases to their records, and adds an academic discussion route to the existing collaboration page. It does not change the publication catalogue, author identities, model equations, demo calculations, or deployment workflow.

## Sources behind the edited explanation

| Statement | Evidence | Boundary |
| --- | --- | --- |
| The 2017 model assigns separate response lags to flux and drawdown gradient in constant-rate pumping in a leaky confined aquifer. | [Published paper, DOI 10.1002/2017WR021115](https://doi.org/10.1002/2017WR021115); [NYCU publication abstract and citation](https://scholar.nycu.edu.tw/en/publications/a-lagging-model-for-describing-drawdown-induced-by-a-constant-rat/), accessed 2026-10-01; existing `research-videos/lin-yeh-2017/source-notes.md`, H02-H03. | Model description, not a claim of uniquely identified physical causes. |
| Equal lags cancel in the transfer relation for the initial conditions used by the demo; zero lags give the classical Darcy limit. | Existing 2017 source notes H04; unchanged `LaggingPumpingTestDemo.astro` technical note and lag operator. | Uses the existing demonstration's τ_q and τ_s notation, with the initial-condition qualification requested in parent review. No general differential-operator cancellation, new equation, or sign convention asserted. |
| A South Dakota fractured-aquifer record was fitted, with good early-time agreement and distance-dependent lag behavior. | NYCU abstract; existing 2017 source notes H06-H09. | A published field comparison, not external prediction validation or evidence of universal constants. |
| The 2026 paper addresses phase/amplitude diffusivity mismatch and analyzes Tuolumne and Meghna records. | [Publisher record](https://www.sciencedirect.com/science/article/pii/S0022169426000107), [DOI 10.1016/j.jhydrol.2026.134913](https://doi.org/10.1016/j.jhydrol.2026.134913); existing public `research-videos/lin-kurylyk-2026/v2/source-artifact.txt`, B01-B03, M05, M07, result boundaries, with publisher-PDF provenance hash. Publisher highlights were discoverable on 2026-10-01; direct browsing returned 403. | Concise description based on the repository's reviewed source digest; no new numerical results, field acquisition claim, or held-out validation claim. |
| Better calibration alone does not prove a microscopic mechanism or transfer to another site/frequency. | Existing 2017 H09-H10; 2026 digest result boundaries; concept page's existing Minimum Tests. | Editorial interpretation boundary and proposed validation goals, explicitly distinguished from published achievements. |
| Academic inquiries use yflin1110@cycu.edu.tw. | Existing `src/pages/collaborate/index.astro` and `src/components/CollaborationCTA.astro`. | Reuses the existing public contact; discussion topics promise no datasets, funding, results, or response time. |

The new 2017 citation preserves the published `Lin, Y.-C.` author string. Existing representative-page attribution differs; resolving that identity requires separate review. This change neither rewrites nor asserts an identity mapping.

## Review boundaries

- Publication source, generated catalogue, curated DOI/ID overlay, homepage, and deployment settings remain outside this change.
- The scientific demo remains a simplified teaching calculation without wellbore storage or finite well radius.
- Cross-frequency/site transfer, dual-domain identifiability, and pumping/recovery reanalysis are discussion topics, not announced projects or available datasets.
- Parent reviewed the English scope and authorized the normal draft PR, CI, merge, and Pages deployment using existing credentials. Final release verification is retained in task artifacts.
- Parent review changed the heading to Model Idea, preserved the old `the-core-mechanism` fragment, qualified equal-lag cancellation by the demo's initial conditions, and described boundary/thermal directions as explored extensions.

## Local verification

- Completed every command in `.github/workflows/pre-publish-gate.yml`: locked install, content sync, 27 publication tests, publication typecheck, evidence/prose gates, and the complete build (including video provenance verification and Pagefind).
- Standard `npm run typecheck` and an additional scoped check covering the modified entry pages, tools data, and LLM endpoints passed. The scoped check exposed pre-existing implicit-any parameters in the collaboration helper and endpoint contexts; explicit `string` and `APIContext` annotations fix those in the edited files.
- Built HTML crawl: 74 documents, 1,346 internal link occurrences, 50 unique targets, no missing routes or static fragments. Redirect pages are accepted; external links and dynamically generated links are outside the static crawl.
- Browser QA with installed Chrome at 1440×1000 and 390×844: home, concept, collaboration, tools, publications, Xiaolin, and game room all loaded; no horizontal overflow or JavaScript page errors. Tools navigation reached the real demo fragment. The demo returned 0.0% mismatch for equal lags and restored 38.6% for its unchanged separated-lag preset. Both generated LLM maps contain the corrected absolute demo URL.
- The archive still renders 47 records. DOI source/overlay, catalogue, homepage, original model component, legacy generated root files, and deployment configuration are unchanged.

Review screenshots, browser JSON, static-link JSON, the full build log, and a standalone diff are retained in the task workspace outside the tracked site source. No tests or dependencies were added to the repository.

One initial build overlapped Astro's typecheck and hit a shared `.astro` temporary-file rename race. Sequential execution passed. An initial browser click assertion ran before client navigation completed; waiting for the destination URL passed. Neither required changing application behavior.
