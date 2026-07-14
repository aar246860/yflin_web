# H Draft Publication Brief

Date: 2026-06-12

Status: local review only. Do not deploy until the photo approval gate is explicit.

## Objective

Add a warmer but still semi-public conference presence block to the personal research website. The block should support high-value collaboration trust, not student recruitment or a private travel album.

## Recommended Placement

Page: `Collaborate`

Placement: after the four collaboration mode cards and before the final contact action.

Reader signal: this research program is developed through real conference exchange, poster discussion, student presentations, and cross-site scientific conversation.

## Proposed Heading Copy

Eyebrow: `Conference presence`

Heading:

`The work is built in conversation.`

Body:

`Research on asynchronous groundwater response grows through poster exchange, student presentations, and cross-site discussion. These photos document working context and openness to collaboration, not a student-recruiting gallery.`

Tags:

- `JpGU 2026`
- `poster exchange`
- `team presence`

## Photo Set

Main block candidates:

- `J041` - student poster presentation. Strong professional context.
- `J090` - conference identity / team presence. Warm but still formal.
- `J039` - team presence in front of poster. Good human signal.
- `J075` - poster discussion. Strong collaboration signal.

Lower strip candidates:

- `J012` - conference identity / team presence.
- `J029` - conference identity / team presence.
- `J049` - student poster presentation.
- `J037` - group/selfie team presence. Warm, but more social-media-like.
- `J061` - individual student poster portrait. Warm, but more portrait-like than collaboration-like.

## Conservative Recommendation

Use `SI` if the site should feel more like a high-value collaboration profile:

- Keep: `J012`, `J029`, `J039`, `J041`, `J049`, `J075`, `J090`
- Remove from public site: `J037`, `J061`

Reason:

- `J037` is friendly but has a selfie feeling.
- `J061` is a strong student portrait, but it can shift the page toward a student gallery.
- The remaining set still preserves warmth through people, poster discussion, and JpGU context.

## Approval Gate

Before copying images into `public/` or deploying, obtain one explicit terminal approval:

`Y: approved to publish the H set`

or:

`SI: publish H set without J037 and J061`

If approval is ambiguous, stop and ask again.

## Implementation Notes After Approval

Use compressed, metadata-stripped review copies from:

`reports/photo-review-2026-06-12/human-draft-public-ready/`

Do not use original OneDrive photos directly.

Target public asset path:

`public/media/conference/jpgu-2026/`

Suggested component:

`src/components/research/ConferencePresence.astro`

Suggested page insertion:

`src/pages/collaborate/index.astro`

Verification:

- `npm.cmd run build`
- local preview of `/yflin_web/collaborate/`
- desktop and mobile visual check
- confirm no unapproved photo IDs appear in `dist/`
- deploy only after final approval
