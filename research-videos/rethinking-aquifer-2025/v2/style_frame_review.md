# Style-frame review

- Reviewer: Codex visual-direction pass
- Reviewed at: 2026-07-21T06:22:00+08:00
- Review method: visual inspection at 1920x1080 and 640x360 downsample
- Design system: `visual_direction.toml`

## Context

- Source scene: planned Scene 2 / B02
- File: `style-frames/context.png`
- SHA-256: `62381546e5f572ac238b1235f31d78d93dd14e0591e50dd92a2b96497cbf8c8f`
- Focal object: offset groundwater-flux and hydraulic-gradient pulses above the pumping-well cross-section
- Secondary objects: aquifer block, drawdown cone, and well remain lower contrast than the offset traces
- Typography tokens: title 44 px, body 30 px, annotation 24 px, Arial; no body paragraph
- Color roles: paper background, ink well, teal flux, brick gradient, ochre lag interval
- Stroke and spacing tokens: focus 6, primary 4, secondary 2; frame margin 0.45 and caption band 1.0
- Projected-display legibility: pass; pulse identity and pumping object read from the back of a room
- Phone-downsample legibility: pass at 640x360; labels, pulse separation, and the well remain readable
- Known risk: the two pulses must retain distinct vertical lanes during motion

## Method

- Source scene: planned Scene 7 / M03
- File: `style-frames/method.png`
- SHA-256: `cfb0f810b988bf24091b087b4300155ac200983b2d5283c37955a8a2283f5c48`
- Focal object: lag timeline collapsing into `theta = tau_s / tau_q`
- Secondary objects: time ticks and origin are muted; regime labels support the ratio without becoming three cards
- Typography tokens: title 44 px, math 38 px, annotation 24 px, Arial and Latin Modern Math
- Color roles: teal flux lag, brick gradient lag, ochre threshold, muted timing axis
- Stroke and spacing tokens: focus 6, primary 4, grid 1; formula lane 1.25 and minimum gap 0.10
- Projected-display legibility: pass; lag ordering and threshold are distinguishable without color alone
- Phone-downsample legibility: pass at 640x360; the ratio and all three regime marks remain readable
- Known risk: the formula may enter only after both lag brackets are visibly established

## Result

- Source scene: planned Scene 16 / M12
- File: `style-frames/result.png`
- SHA-256: `a3814e0831b77f7f332b7eab2047c6aa603a45f5325d0ee6245d1e398fe6976b`
- Focal object: one continuous theta-threshold contour through a bounded well field
- Secondary objects: support-volume rings and field boundary use secondary strokes; well points stay compact
- Typography tokens: title 44 px, math 38 px, annotation 24 px, Arial and Latin Modern Math
- Color roles: teal and brick diagnostic sides, ochre conditional-width contour and rings, muted field boundary
- Stroke and spacing tokens: focus 6, primary 4, secondary 2; frame margin 0.45 and caption band 1.0
- Projected-display legibility: pass; the threshold contour dominates and well locations are visible
- Phone-downsample legibility: pass at 640x360; theta labels, contour, rings, and boundary note remain readable
- Known risk: final animation must label the field as interpolated and keep support rings inside the mapped domain

All three frames pass focal hierarchy, scientific-object dominance, projected-display readability, phone-downsample readability, system consistency, and transition-space review. They use no cards, dashboard grid, glow, gradients, particles, or decorative motion.
