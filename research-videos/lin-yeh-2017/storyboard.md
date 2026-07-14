# Lin and Yeh 2017: A Pumping Test with Hydraulic Memory

## Metadata

- Title: A pumping test with hydraulic memory
- Source artifact: Lin and Yeh (2017), Water Resources Research, DOI 10.1002/2017WR021115
- Audience: groundwater researchers, practitioners, and prospective collaborators
- Story mode: `method`
- Target duration: 75 seconds

## Symbol Glossary

| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| `q_r` | Scene 3 | moving radial flux arrows | radial water flux | L/T | label appears after arrows move |
| `s` | Scene 3 | drawdown profile | drawdown | L | label appears after cone forms |
| `K` | Scene 3 | aquifer layer | hydraulic conductivity | L/T | formula term inherits aquifer color |
| `τ_q` | Scene 3 | flux clock | water-flux lag | T | clock contracts into MathTex |
| `τ_s` | Scene 3 | gradient clock | drawdown-gradient lag | T | clock contracts into MathTex |

## Scene Table

### Scene 1: Pumping starts before the aquifer response is simple

- Source-derived rules: `H01`, `H06`.
- Storyboard trigger: begin with the physical pumping-test geometry before notation.
- Viewer question: what is being disturbed when RC-5 begins pumping?
- Visual object: a pumping well, leaky confined aquifer, aquitard, and an observation well.
- Visual antecedent: the aquifer cross-section is the first object.
- Transformation from previous scene: first object appears as the physical anchor.
- Motion purpose: water particles move toward the pumping well while leakage crosses the aquitard.
- Step detail: draw the layered section, lower the well water level, then start radial and vertical arrows.
- Why this step is valid: because the paper models a finite-radius pumping well in a leaky confined aquifer.
- Transition bridge: the moving water becomes the radial flux object used in Scene 2.
- What the viewer learns: the research starts from a specific pumping-test system, not from an abstract delay signal.
- Minimal on-screen text: “constant-rate pumping”
- Formula: none.
- QA risks: keep the observation-well label outside the cone of depression.

### Scene 2: Flux and gradient do not have to move in step

- Source-derived rules: `H02`, `H03`, `H05`.
- Storyboard trigger: the moving water and evolving drawdown profile need separate clocks.
- Viewer question: can flux and the drawdown gradient develop on different macroscopic timescales?
- Visual object: radial flux arrows and a drawdown-gradient tangent, each attached to a clock.
- Visual antecedent: moving arrows and drawdown profile from Scene 1.
- Transformation from previous scene: preserve the aquifer while splitting the response into two colored lanes.
- Motion purpose: the clocks separate because the two response measures are allowed different lags.
- Step detail: retain the well geometry, highlight flux arrows, reveal the gradient tangent, then offset the two clocks.
- Why this step is valid: because Lin and Yeh assign `τ_q` to flux and `τ_s` to the drawdown gradient.
- Transition bridge: from the two visible clocks to the time-shifted terms in Scene 3.
- What the viewer learns: the theory represents flux-gradient asynchrony, not a single shifted signal.
- Minimal on-screen text: “two response clocks”
- Formula: none.
- QA risks: put clock labels in separate upper corners.

### Scene 3: The generalized radial law names the visible objects

- Source-derived rules: `H02`, `H03`.
- Storyboard trigger: notation appears only after flux, gradient, and both clocks are visible.
- Viewer question: how are the two clocks encoded mathematically?
- Visual object: flux arrows, gradient tangent, and the generalized radial law in a reserved formula lane.
- Visual antecedent: the two clocks and their response objects.
- Transformation from previous scene: clock labels contract into the lag arguments of the equation.
- Motion purpose: each formula term inherits the color of its physical object.
- Step detail: move `τ_q` beside `q_r`, move `τ_s` beside `s`, then reveal conductivity and the radial derivative.
- Why this step is valid: because the displayed equation is the constitutive relation stated in the paper.
- Transition bridge: from the complete relation to limiting cases while the two lag symbols remain fixed.
- What the viewer learns: `q_r(r,t+τ_q) = -K ∂s(r,t+τ_s)/∂r` connects two separately timed macroscopic responses.
- Minimal on-screen text: “Lagging Darcy relation”
- Formula: split `MathTex(r"q_r(r,t+\tau_q)")`, `MathTex(r"=")`, and `MathTex(r"-K\,\partial s(r,t+\tau_s)/\partial r")`.
- Symbol handoff: flux and gradient clock labels move directly into their equation arguments.
- Formula split plan: animate the left response, equality, and right response as separate terms.
- Formula derivation steps: identify flux, identify gradient, attach each lag, then connect them through conductivity.
- QA risks: reserve the top formula lane and keep it clear of well labels.

### Scene 4: Limiting cases provide an internal check

- Source-derived rules: `H04`.
- Storyboard trigger: the equation must recover familiar behavior under explicit limits.
- Viewer question: when does the new relation return to Classical Darcy behavior?
- Visual object: two lag clocks merge, then both contract to zero while two response curves coincide.
- Visual antecedent: equation terms and two lag clocks from Scene 3.
- Transformation from previous scene: the lag symbols leave the equation and return to their clocks.
- Motion purpose: merging clocks makes equal-lag cancellation visible; shrinking both clocks shows the zero-lag limit.
- Step detail: first set `τ_q = τ_s`, overlap the curves, then set `τ_q = τ_s = 0` and label the Classical Darcy limit.
- Why this step is valid: because equal lags cancel in the transfer relation, and both-zero is the direct Classical Darcy limit.
- Transition bridge: from coincident clocks to separated clocks, which creates the early-time diagnostic window in Scene 5.
- What the viewer learns: equal-lag cancellation and the both-zero limit are distinct statements.
- Minimal on-screen text: “equal lags cancel” and “Classical Darcy limit”
- Formula: `MathTex(r"\tau_q=\tau_s")`, followed by `MathTex(r"\tau_q=\tau_s=0")` after the clocks are visible.
- Symbol handoff: the clock labels become the two limiting-case expressions.
- Formula split plan: keep the two checks as separate expressions.
- Formula derivation steps: merge clocks, show equal-lag expression, shrink clocks, show both-zero expression.
- QA risks: never label every equal-lag case as zero lag.

### Scene 5: Separated lags alter the early-time response

- Source-derived rules: `H05`, `H08`.
- Storyboard trigger: the clocks separate again to reveal where the model changes the response.
- Viewer question: where should an aquifer test contain evidence for the lag terms?
- Visual object: Classical Darcy and lagging-model curves on the same log-time axis with an early-time band.
- Visual antecedent: coincident response curves from Scene 4.
- Transformation from previous scene: one coincident curve separates only inside the early-time band.
- Motion purpose: curve separation localizes the diagnostic effect instead of implying a universal offset.
- Step detail: grow both curves together, shade early time, then separate the lagging response within that window.
- Why this step is valid: because the published field comparison reports its clearest improvement during early pumping time.
- Transition bridge: the early-time band expands into the Rapid City observation network in Scene 6.
- What the viewer learns: the field signature is a time-window-dependent change in response shape.
- Minimal on-screen text: “early-time diagnostic window”
- Formula: none.
- Uncertainty shape: a translucent early-time diagnostic band and a residual ribbon between curves.
- QA risks: label curves outside the plotted data region.

### Scene 6: Rapid City supplies a multi-distance field test

- Source-derived rules: `H06`, `H07`, `H08`.
- Storyboard trigger: the model claim needs a real field geometry after the mechanism is visible.
- Viewer question: was the response tested beyond one synthetic curve?
- Visual object: RC-5 at the center with five observation wells distributed from 208 to 3566 m, plus paired fit strips.
- Visual antecedent: the log-time axis and early-time band from Scene 5.
- Transformation from previous scene: the five time-axis marks rise into five observation wells.
- Motion purpose: increasing well distance makes the network scale visible; paired strips show the reported early-time fit improvement.
- Step detail: reveal RC-5, place LC through CHLN-2 by distance, then show compact classical-versus-lagging fit strips.
- Why this step is valid: because the paper evaluates a seven-day RC-5 test at five named observation wells.
- Transition bridge: the five fitted lag pairs fall into a spread in Scene 7.
- What the viewer learns: the published evidence is a real, multi-distance pumping-test network.
- Minimal on-screen text: “Rapid City, South Dakota” and “5 observation wells”
- Formula: none.
- Uncertainty shape: a range bracket from 208 to 3566 m and five lag-pair markers.
- QA risks: abbreviate well names but keep the distance ordering correct.

### Scene 7: Lag estimates form a visible spread

- Source-derived rules: `H08`, `H09`.
- Storyboard trigger: variation among wells must become a qualification, not be hidden.
- Viewer question: do the fitted lag pairs collapse to one site constant?
- Visual object: five lag-pair markers form a bounded spread.
- Visual antecedent: five observation wells and their fitted lag pairs.
- Transformation from previous scene: markers move from individual wells onto a common lag-pair axis.
- Motion purpose: visible spread prevents the lag estimates from being mistaken for universal material constants.
- Step detail: collect five markers, align them on a common axis, and bracket their spread.
- Why this step is valid: because fitted lag times vary across observation wells in the paper.
- Transition bridge: from the bounded spread to its interpretation boundary in Scene 8.
- What the viewer learns: the fitted lag pairs vary across the observation network.
- Minimal on-screen text: “five fitted lag pairs”
- Formula: none.
- Uncertainty shape: five-point lag spread with a bounded interval.
- QA risks: do not render a smooth probability density from five fitted pairs.

### Scene 8: Return the qualification to the pumping test

- Source-derived rules: `H09`, `H10`.
- Storyboard trigger: the visible spread needs a scientifically bounded conclusion.
- Viewer question: what does the 2017 result change, and what remains site specific?
- Visual object: the bounded lag-pair interval moves back beside the original pumping-well and aquifer geometry.
- Visual antecedent: bounded lag-pair spread and the original aquifer cross-section.
- Transformation from previous scene: the bracketed spread shrinks into a diagnostic annotation and moves back to the pumping-test geometry.
- Motion purpose: returning the interval to the field object shows that lag estimates belong to a test and model context.
- Step detail: compress the five markers into a bracket, move the bracket beside the well network, then restore the flux and gradient clocks.
- Why this step is valid: because fitted lag times vary among observation wells and the paper compares mathematical forms without claiming one universal material constant.
- Transition bridge: from the abstract lag-pair spread back to the original scientific object.
- What the viewer learns: Lagging Theory broadens transient aquifer-test interpretation, while fitted lag values remain diagnostic and test-conditioned.
- Minimal on-screen text: “diagnostic, not universal”
- Formula: none.
- Uncertainty shape: bounded five-point interval beside the pumping-test geometry.
- QA risks: keep the qualification legible without covering the pumping well or observation well.
