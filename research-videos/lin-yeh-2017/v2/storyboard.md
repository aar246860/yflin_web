# Lin and Yeh (2017): When a Pumping Test Keeps Two Clocks

## Metadata

- Title: When a pumping test keeps two clocks
- Source artifact: `research-videos/source-text/2017-09-39.txt`, extracted from Lin and Yeh (2017), Water Resources Research, DOI 10.1002/2017WR021115
- Audience: groundwater researchers, practitioners, and technically curious collaborators
- Story mode: `method`
- Target duration: 110 seconds
- Rendering target: `1080p`
- Visual-direction artifact: `visual_direction.toml`

## Research Extraction

- Core research question: Can a pumping-test response be interpreted when radial water flux and the drawdown gradient do not develop at the same macroscopic time?
- Physical or scientific system: Constant-rate pumping from a finite-radius well in a leaky confined fractured aquifer.
- Input data: Seven-day RC-5 pumping test with drawdown observed at LC, SP-2, BHPL, CL-2, and CHLN-2.
- Main method: Generalized radial Darcy relation with separate flux and drawdown-gradient lags, coupled to mass conservation and solved in transformed space.
- Reference or benchmark: Classical Darcy behavior, Greene (1993), and the no-lag Case 1 fit reported in Table 2.
- Uncertainty or error treatment: Standard error of estimate, mean error, five model-conditioned lag pairs, and the site-specific distance relation.
- Main conclusion: The lagging formulation lowered model-conditioned fit error at four wells and matched the fifth at reported precision, especially improving the early-time fit, while the fitted lags remained test- and location-conditioned diagnostics.

## Narrative Spine

- Throughline: A pumping test can keep two macroscopic response clocks, and the useful evidence is the change those clocks make to the observed drawdown fit.
- Audience starting point: Pumping creates drawdown that is recorded at observation wells and interpreted with an analytical model.
- Stakes: If flux and the drawdown gradient are forced to be simultaneous, early-time data may be absorbed into biased model parameters or residual error.
- Resolution: Separate response times become a visible constitutive relation, a solvable aquifer model, and a field-test comparison with an explicit claim boundary.
- Background scope: 3 premises needed to establish the pumping-test measurement, the Classical Darcy timing assumption, and the fractured-aquifer motivation.
- Method scope: 6 operations needed to construct the lagging relation, derive the flow model, obtain the solution, estimate parameters, compare fit error, and examine distance-conditioned lags.

## Background Ledger

| ID | Audience gap or premise | Visible evidence | Why it is needed now | Source or claim boundary | Source locator |
| --- | --- | --- | --- | --- | --- |
| `B01` | A constant-rate pumping test records temporal drawdown at observation wells to infer aquifer hydraulic properties. | RC-5 pumping well, five observation wells, and five growing drawdown traces. | The viewer needs the measured object before any timing assumption is introduced. | This is the paper's description of a CRP test and its field application. | Introduction, page 8500, paragraph beginning “The constant-rate pumping (CRP) test” |
| `B02` | The classical radial Darcy relation treats water flux and the drawdown gradient as simultaneous. | A flux arrow and gradient tangent locked to one clock. | The research tension is invisible until the shared-clock assumption is shown. | The paper critiques the instantaneous implication for some real-world problems; it does not reject Classical Darcy behavior universally. | Section 2, page 8502, Equation (1) and the paragraph immediately following it |
| `B03` | Noninterconnected pores or fractures can require extra time to establish the drawdown-gradient field. | A main fracture channel exchanging pressure with a dead-end branch. | The second response clock needs a physical motivation before it becomes a parameter. | The paper presents structural interaction as a proposed interpretation of the gradient lag. | Section 2, page 8502, paragraph following Equation (2) |

## Method Decomposition Ledger

| ID | Visible input state | One operation | Visible output state | Validity basis | Source locator |
| --- | --- | --- | --- | --- | --- |
| `M01` | Radial flux and drawdown gradient at one observation radius | assign response times | Generalized radial Darcy relation with flux lag and gradient lag | Equation (2) defines separate phase lags for water flux and drawdown gradient | Section 2, page 8502, Equation (2) |
| `M02` | Generalized radial Darcy relation plus radial mass conservation | apply constitutive substitution | Lagging groundwater equation | Equations (3) through (5) show the Taylor approximation and substitution | Section 2.1, pages 8502–8503, Equations (3)–(5) |
| `M03` | Dimensionless lagging boundary-value problem | transform the boundary-value problem | Laplace-domain radial drawdown solution | Section 2.2 applies the Laplace transform and boundary conditions to obtain Equation (23) | Section 2.2, pages 8503–8504, Equations (16)–(23) |
| `M04` | RC-5 drawdown observations at five wells | estimate five parameters by nonlinear least squares | Case 2 parameter sets plus error statistics | The paper couples the present solution with Levenberg-Marquardt estimation | Section 3.3, page 8507, paragraph preceding Table 2 |
| `M05` | Case 1 and Case 2 standard errors of estimate | compare standard errors | Lower Case 2 standard error at four wells plus equal reported error at CHLN-2 | Table 2 reports smaller Case 2 SEE at four wells plus equal 0.009 m SEE at CHLN-2 | Section 3.3, Table 2, page 8508 |
| `M06` | Case 2 lag estimates plus well distances excluding BHPL | fit distance trends | Positive distance-conditioned lag trends | Figure 5 reports regression lines after excluding the oppositely located BHPL well | Section 3.3, Figure 5 and its discussion, page 8509 |

## Symbol Glossary

| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| `q_r` | Scene 2 | Radial water-flux arrow | Radial water flux at radius `r` and time `t` | L/T | The arrow receives the `q_r` label after it appears. |
| `s` | Scene 2 | Drawdown profile and tangent | Drawdown relative to initial hydraulic head | L | The profile receives the `s` label before its tangent is highlighted. |
| `K` | Scene 2 | Confined aquifer block | Hydraulic conductivity | L/T | The aquifer color is inherited by the conductivity term. |
| `r` | Scene 2 | Radius from RC-5 to an observation location | Radial distance from the pumping well | L | A radius brace becomes the `r` argument. |
| `t` | Scene 2 | Shared clock | Pumping time | T | The clock face becomes the `t` argument. |
| `\tau_q` | Scene 4 | Flux clock offset | Phase lag assigned to radial water flux | T | The teal clock offset contracts into the flux argument. |
| `\tau_s` | Scene 4 | Gradient clock offset | Phase lag assigned to the drawdown gradient | T | The red clock offset contracts into the gradient argument. |

## Scene Table

### Scene 1: Five traces begin at one pumping well

- Source-derived rules: `H01`, `H02`, `H06`, `H09`, `H17`, `H19`, `H20`.
- Narrative beat: `hook`.
- Background beat: `B01`.
- Background premise: A constant-rate pumping test records temporal drawdown at observation wells to infer aquifer hydraulic properties.
- Method step: `none`.
- Storyboard trigger: The viewer must see the real field measurement before being asked to reconsider its constitutive model.
- Viewer question: Why do five wells observing the same pumping event produce five different time histories?
- Visual object: RC-5 at the center of a distance axis with LC, SP-2, BHPL, CL-2, and CHLN-2 rising into five drawdown traces.
- Visual antecedent: The first visible object is the RC-5 pumping well.
- Transformation from previous scene: The pumping well grows into a radial field and the observation points rise from their reported distances.
- Motion purpose: This motion shows the interpretation problem as one pumping event with multiple observed histories.
- Motion class: `trace`.
- Focal object: Five measured-response traces growing from the RC-5 event.
- Salience plan: RC-5 remains warning-colored while the distance baseline and aquifer context recede to secondary contrast.
- Theme tokens: title 44 px, body 30 px, focal teal, warning red, secondary 2 px, focus 6 px, frame margin 0.45.
- Downsample legibility: RC-5, the five well names, and the 208–3566 m range remain readable at phone width.
- Step detail: Reveal RC-5; extend the distance baseline; place the five wells in reported order; trace one response from each well.
- Why this step is valid: This is valid because the paper reports a seven-day RC-5 test with five named observation wells from 208 m to 3566 m.
- Transition bridge: The five response traces collapse onto one representative radius for the Classical Darcy timing assumption.
- Evidence locator: Section 3.3, page 8507, field-test paragraph.
- What the viewer learns: The paper addresses a multi-distance field test rather than one selected synthetic curve.
- Minimal on-screen text: “RC-5 • 7 days • 5 observation wells”.
- Narration draft: One pumping well disturbed the Madison aquifer for about seven days. Five observation wells recorded how that disturbance arrived across more than three kilometres.
- Formula: none.
- Frame zones: Title band at top; distance geometry in middle; one-line evidence caption at bottom.
- Keep-clear pairs: Well labels versus distance markers; response traces versus title band; evidence caption versus baseline.
- Transition-frame audit: Inspect the empty RC-5 entry, the midpoint with three wells, and the settled five-trace field.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[field, labels, title], labels=[labels, title], blockers=[field], frame_items=[field, labels, title])`.
- QA risks: Dense well names at phone scale; five traces must remain distinguishable by marker and line style as well as color.

### Scene 2: Classical Darcy behavior uses one clock

- Source-derived rules: `H03`, `H04`, `H05`, `H15`, `H16`, `H17`, `H20`.
- Narrative beat: `context`.
- Background beat: `B02`.
- Background premise: The classical radial Darcy relation treats water flux and the drawdown gradient as simultaneous.
- Method step: `none`.
- Storyboard trigger: The representative response cannot become a timing puzzle until the shared-clock relation is explicit.
- Viewer question: What does the classical constitutive relation assume about the timing of flux and gradient?
- Visual object: A radial flux arrow and drawdown-gradient tangent connected to one clock before becoming the split Classical Darcy formula.
- Visual antecedent: The representative observation radius retained from Scene 1.
- Antecedent timing: earlier in this scene before formula.
- Transformation from previous scene: Five response traces merge into one profile while their distance baseline becomes the radius brace.
- Motion purpose: Locking the arrow and tangent to one clock reveals simultaneity as an assumption rather than a visual default.
- Motion class: `same-object-transform`.
- Focal object: Flux arrow and gradient tangent connected to the same clock.
- Salience plan: The aquifer remains faint; the clock, arrow, and tangent carry primary or focus strokes.
- Theme tokens: math 38 px, annotation 24 px, foreground, focal, warning, secondary, focus 6 px, formula lane 1.25.
- Downsample legibility: The two formula sides and the single clock remain readable without zooming.
- Step detail: Retain one radius; reveal the flux arrow; reveal the gradient tangent; connect both to one clock; hand the visible objects into the formula terms.
- Why this step is valid: This is valid because Equation (1) states the radial Darcy relation at the same `r` and `t` for both quantities.
- Transition bridge: The single clock separates into two clocks while the arrow and tangent stay fixed.
- Evidence locator: Section 2, page 8502, Equation (1).
- What the viewer learns: Simultaneity is built into the classical radial relation used by the paper as its reference case.
- Minimal on-screen text: “one constitutive clock”.
- Narration draft: In the classical radial relation, flux and the drawdown gradient are evaluated at the same place and the same time. The model therefore keeps one constitutive clock.
- Formula: `MathTex(r"q_r(r,t)")`, `MathTex(r"=")`, and `MathTex(r"-K\,\partial s(r,t)/\partial r")`.
- Symbol handoff: The flux arrow becomes `q_r`; the radius brace becomes `r`; the shared clock becomes `t`; the aquifer becomes `K`; the profile tangent becomes `\partial s/\partial r`.
- Formula split plan: Keep flux response, equality, conductivity, and gradient response as separate transformable terms.
- Formula derivation steps: Identify the flux arrow; attach its radius and time; identify the gradient tangent; attach its radius and time; connect both through conductivity.
- Frame zones: Geometry in middle; formula lane at bottom; compact title at top.
- Keep-clear pairs: Formula versus aquifer geometry; clock label versus tangent; radius brace versus flux label.
- Transition-frame audit: Inspect the geometry-only entry, clock-link midpoint, and settled split formula.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[geometry, formula, labels], labels=[formula, labels], blockers=[geometry], frame_items=[geometry, formula, labels])`.
- QA risks: Formula must not arrive before its visual objects; gradient label must not cross the tangent.

### Scene 3: A dead-end branch needs time to equilibrate

- Source-derived rules: `H03`, `H04`, `H07`, `H08`, `H12`, `H13`, `H17`, `H20`.
- Narrative beat: `tension`.
- Background beat: `B03`.
- Background premise: Noninterconnected pores or fractures can require extra time to establish the drawdown-gradient field.
- Method step: `none`.
- Storyboard trigger: The second clock needs a physical object that can store and release pressure before it becomes notation.
- Viewer question: What kind of aquifer structure can separate the development of flux from the development of a gradient field?
- Visual object: A fast main fracture channel connected to a dead-end branch whose pressure halo shrinks toward equilibrium.
- Visual antecedent: The shared clock and radial flow arrow from Scene 2.
- Transformation from previous scene: The radial arrow lengthens into the main fracture channel while the clock remains as timing context.
- Motion purpose: Slower exchange with the dead-end branch makes structural interaction visible as a separate timescale.
- Motion class: `trace`.
- Focal object: Pressure halo inside the dead-end branch.
- Salience plan: The main channel dims after fast through-flow is established; the branch halo becomes the only focus-color object.
- Theme tokens: body 30 px, annotation 24 px, focal, secondary, primary 4 px, focus 6 px, minimum gap 0.10.
- Downsample legibility: Main channel, branch, and shrinking halo remain separable without explanatory prose.
- Step detail: Extend the main channel; move a flux marker through it; reveal the dead-end branch; shrink the branch pressure halo toward the channel state.
- Why this step is valid: This is valid because the paper associates the gradient lag with structural interaction involving noninterconnected pores or fractures.
- Transition bridge: From the shared clock, the fast channel retains the flux clock while the branch halo receives the gradient clock.
- Evidence locator: Section 2, page 8502, paragraph following Equation (2).
- What the viewer learns: The lag parameter is introduced as a macroscopic diagnostic of a possible structural timescale, not as an arbitrary signal shift.
- Minimal on-screen text: “fast pathway” and “structural interaction”.
- Narration draft: A connected fracture can carry flow quickly while a dead-end branch takes longer to exchange pressure. The paper uses that structural interaction to motivate a separate gradient-response time.
- Formula: none.
- Frame zones: Fracture geometry across center; two short labels in side margins; no formula lane.
- Keep-clear pairs: Branch label versus pressure halo; pathway label versus moving marker; all labels versus fracture boundaries.
- Transition-frame audit: Inspect the empty branch entry, expanding pressure midpoint, and settled equilibrated branch.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[fracture, halo, labels], labels=[labels], blockers=[fracture, halo], frame_items=[fracture, halo, labels])` plus `assert_inside(branch, [halo])`.
- QA risks: Do not imply that one mechanism was uniquely proven by the field fit.

### Scene 4: Give flux and gradient separate response times

- Source-derived rules: `H05`, `H08`, `H12`, `H13`, `H15`, `H16`, `H17`, `H20`.
- Narrative beat: `mechanism`.
- Background beat: `none`.
- Method step: `M01`.
- Storyboard trigger: The visible fast channel and slower branch now require a constitutive relation that can keep two clocks.
- Viewer question: How does the model encode flux-gradient asynchrony without replacing the spatial groundwater relation?
- Visual object: The flux and gradient clocks move into separate time arguments of the generalized radial Darcy relation.
- Visual antecedent: The flux clock attached to the main channel and the gradient clock attached to the branch halo.
- Antecedent timing: prior Scene 3.
- Transformation from previous scene: The two clocks leave the fracture geometry and align above their corresponding response objects.
- Motion purpose: Moving each clock into one formula term makes the two response times visually accountable.
- Motion class: `same-object-transform`.
- Focal object: The two clock-to-symbol handoffs as an explicit comparison pair.
- Salience plan: Fracture geometry fades to secondary; only the two clocks and their matched formula terms retain focus contrast.
- Theme tokens: math 38 px, annotation 24 px, focal, warning, secondary, focus 6 px, formula lane 1.25.
- Downsample legibility: `\tau_q` and `\tau_s` remain distinct and attached to the correct sides of the relation.
- Step detail: Separate the clocks; attach the flux clock to `q_r`; attach the gradient clock to `s`; reveal conductivity; close the relation with the radial derivative.
- Why this step is valid: This is valid because Equation (2) defines separate phase lags for the two macroscopic response quantities.
- Transition bridge: The complete constitutive relation becomes the input beside the mass-balance control volume.
- Evidence locator: Section 2, page 8502, Equation (2).
- Input state: Radial flux and drawdown gradient at one observation radius.
- Operation: assign response times.
- Output state: Generalized radial Darcy relation with flux lag and gradient lag.
- Validity basis: Equation (2) defines separate phase lags for water flux and drawdown gradient.
- What the viewer learns: Lagging Theory preserves the radial flux-gradient relation while allowing its two sides to occur at different macroscopic times.
- Minimal on-screen text: “two response clocks”.
- Narration draft: The generalized relation does not delay one finished signal. It assigns one response time to radial flux and another to the drawdown gradient.
- Formula: `MathTex(r"q_r(r,t+\tau_q)")`, `MathTex(r"=")`, and `MathTex(r"-K\,\partial s(r,t+\tau_s)/\partial r")`.
- Symbol handoff: The teal clock becomes `\tau_q` in the flux argument; the red clock becomes `\tau_s` in the gradient argument.
- Formula split plan: Keep the flux term, equality, conductivity, derivative, and gradient time argument as independently colored parts.
- Formula derivation steps: Start from the visible flux object; add its clock offset; start from the visible gradient object; add its clock offset; connect the two through the existing conductivity relation.
- Frame zones: Clock objects at top; response geometry in middle; formula lane at bottom.
- Keep-clear pairs: Clock labels versus formula; formula versus retained fracture geometry; flux label versus gradient label.
- Transition-frame audit: Inspect the two-clock entry, symbol-handoff midpoint, and settled generalized relation.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[clocks, geometry, formula], labels=[clocks, formula], blockers=[geometry], frame_items=[clocks, geometry, formula])`.
- QA risks: Never swap the colors or positions of `\tau_q` and `\tau_s`.

### Scene 5: Conservation turns the relation into an aquifer equation

- Source-derived rules: `H04`, `H07`, `H08`, `H12`, `H13`, `H17`, `H20`.
- Narrative beat: `mechanism`.
- Background beat: `none`.
- Method step: `M02`.
- Storyboard trigger: A constitutive relation alone cannot predict drawdown until it is coupled to conservation.
- Viewer question: What does the two-clock relation change in the aquifer-scale evolution equation?
- Visual object: A radial control volume whose incoming and outgoing fluxes deform into a wave-like drawdown pulse after substitution.
- Visual antecedent: The generalized radial Darcy relation from Scene 4.
- Transformation from previous scene: The flux term moves to the control-volume faces while the gradient term becomes the internal drawdown profile.
- Motion purpose: The control-volume balance shows why the constitutive timing choice changes the governing equation rather than merely shifting a plotted curve.
- Motion class: `same-object-transform`.
- Focal object: Drawdown pulse emerging from the balanced radial control volume.
- Salience plan: Formula terms dim after entering the control volume; the evolving pulse takes focus contrast.
- Theme tokens: body 30 px, annotation 24 px, focal, warning, secondary, primary 4 px, focus 6 px, minimum gap 0.10.
- Downsample legibility: Inflow, outflow, storage, and the resulting pulse remain visually distinct.
- Step detail: Build the radial control volume; place flux on both faces; reveal storage inside; insert the first-order constitutive relation; release the resulting pulse.
- Why this step is valid: This is valid because Equations (3) through (5) substitute the first-order generalized Darcy relation into radial mass conservation.
- Transition bridge: The time-domain pulse becomes a set of radial modes for transformed-space solution.
- Evidence locator: Section 2.1, pages 8502–8503, Equations (3)–(5).
- Input state: Generalized radial Darcy relation plus radial mass conservation.
- Operation: apply constitutive substitution.
- Output state: Lagging groundwater equation.
- Validity basis: Equations (3) through (5) show the Taylor approximation and substitution.
- What the viewer learns: The lagging terms alter the governing dynamics through conservation; they are not a post-processing delay applied to drawdown.
- Minimal on-screen text: “constitutive relation + conservation”.
- Narration draft: Substituting the first-order relation into radial mass conservation changes the aquifer equation itself. The paper describes the resulting form as wave-like rather than purely diffusive.
- Formula: none.
- Frame zones: Control volume in center; short input labels on left; result label in bottom caption band.
- Keep-clear pairs: Flux labels versus control-volume faces; result label versus pulse; storage label versus internal profile.
- Transition-frame audit: Inspect the unbalanced entry, substitution midpoint, and settled pulse.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[control_volume, pulse, labels], labels=[labels], blockers=[control_volume, pulse], frame_items=[control_volume, pulse, labels])`.
- QA risks: Avoid implying an observed propagating wave; “wave-like” refers to the mathematical equation stated in the paper.

### Scene 6: Transform the boundary-value problem into a radial solution

- Source-derived rules: `H04`, `H08`, `H12`, `H13`, `H14`, `H17`, `H20`.
- Narrative beat: `mechanism`.
- Background beat: `none`.
- Method step: `M03`.
- Storyboard trigger: The governing equation must become a computable drawdown response before it can meet field data.
- Viewer question: How does the paper obtain a usable radial drawdown solution?
- Visual object: The time-domain pulse passes through a Laplace transform, enters a modified-Bessel radial form, and settles as the Equation (23) Laplace-domain drawdown profile.
- Visual antecedent: The lagging drawdown pulse from Scene 5.
- Transformation from previous scene: The time-domain pulse moves through the transform operator while the well and far-field boundaries remain fixed.
- Motion purpose: The transform reveals how the same boundary-value problem becomes an algebraic radial equation with a modified-Bessel solution.
- Motion class: `same-object-transform`.
- Focal object: The modified-Bessel radial profile satisfying the transformed boundaries.
- Salience plan: Boundary markers remain secondary; the transform operator and resulting radial profile alternate as the only focal objects.
- Theme tokens: body 30 px, annotation 24 px, focal, secondary, grid 1 px, focus 6 px, frame margin 0.45.
- Downsample legibility: Pumping-well boundary, far-field boundary, Laplace operator, and resulting radial profile remain distinguishable.
- Step detail: Retain the well boundary; reveal the far-field boundary; pass the time-domain pulse through the Laplace operator; reveal the modified-Bessel radial form; settle the Equation (23) profile.
- Why this step is valid: This is valid because Section 2.2 applies the Laplace transform and the stated boundary conditions to obtain the Laplace-domain solution in Equation (23).
- Transition bridge: The Laplace-domain profile becomes the model response evaluated at each observation well.
- Evidence locator: Section 2.2, pages 8503–8504, Equations (16)–(23).
- Input state: Dimensionless lagging boundary-value problem.
- Operation: transform the boundary-value problem.
- Output state: Laplace-domain radial drawdown solution.
- Validity basis: Section 2.2 applies the Laplace transform and boundary conditions to obtain Equation (23).
- What the viewer learns: The proposed relation is embedded in a transformed modified-Bessel boundary-value solution, not left as an uncomputed constitutive idea.
- Minimal on-screen text: “Laplace transform → modified-Bessel solution”.
- Narration draft: The paper transforms the dimensionless boundary-value problem, applies the transformed well and far-field conditions, and obtains a modified-Bessel expression for drawdown in the Laplace domain.
- Formula: none.
- Frame zones: Radial geometry across center; boundary labels in side margins; transform operator in the upper lane; method caption at bottom.
- Keep-clear pairs: Transform label versus radial profile; boundary labels versus well markers; caption versus geometry.
- Transition-frame audit: Inspect the time-domain pulse entry, transform-operator midpoint, and Laplace-domain radial-profile settled state.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[boundaries, profile, transform_label, labels], labels=[transform_label, labels], blockers=[boundaries, profile], frame_items=[boundaries, profile, transform_label, labels], intentional_overlaps=[(profile, boundaries)])`.
- QA risks: Do not depict a discrete modal truncation or imply numerical inversion that is not declared in the cited derivation.

### Scene 7: Fit the five observation wells

- Source-derived rules: `H03`, `H04`, `H07`, `H08`, `H12`, `H17`, `H20`.
- Narrative beat: `evidence`.
- Background beat: `none`.
- Method step: `M04`.
- Storyboard trigger: A solved model has scientific value only after its parameters are confronted with observed drawdown.
- Viewer question: How were hydraulic and lag parameters linked to the RC-5 observations?
- Visual object: Five measured point sets pull one shared model family toward five well-specific fitted curves.
- Visual antecedent: The recombined drawdown profile from Scene 6.
- Transformation from previous scene: The one profile replicates by observation distance and settles against five measured point sets.
- Motion purpose: This motion shows how shrinking residual pull-lines correspond to nonlinear least-squares parameter updates.
- Motion class: `same-object-transform`.
- Focal object: Residual pull-lines shrinking between measured points and fitted curves.
- Salience plan: Four inactive wells dim while the active well's residuals take warning contrast; all five fitted curves return together at settlement.
- Theme tokens: body 30 px, annotation 24 px, foreground, focal, warning, secondary, grid 1 px, focus 6 px.
- Downsample legibility: Measured points and fitted lines remain distinct by markers and line style, not color alone.
- Step detail: Replicate the profile at five distances; reveal measured points; draw residual pull-lines; shorten the pull-lines under parameter updates; retain the five fitted outputs.
- Why this step is valid: This is valid because Section 3.3 states that the present solution was coupled with the Levenberg-Marquardt algorithm for field parameter estimation.
- Transition bridge: Each fitted curve contracts into its reported standard error of estimate.
- Evidence locator: Section 3.3, page 8507, paragraph preceding Table 2.
- Input state: RC-5 drawdown observations at five wells.
- Operation: estimate five parameters by nonlinear least squares.
- Output state: Case 2 parameter sets plus error statistics.
- Validity basis: The paper couples the present solution with Levenberg-Marquardt estimation.
- What the viewer learns: The field comparison estimates hydraulic and lag parameters jointly under the selected analytical model.
- Minimal on-screen text: “five wells • nonlinear least squares”.
- Narration draft: For each observation well, the paper estimated transmissivity, storativity, aquitard conductivity, and the two lag times by nonlinear least squares.
- Formula: none.
- Uncertainty shape: Residual pull-lines and the final standard-error widths attached to each well.
- Frame zones: Five aligned mini-axes across the center; well names in the upper margin; short method caption in the lower band.
- Keep-clear pairs: Well names versus axes; residual lines versus point markers; caption versus mini-axes; intentional fitted-line versus measured-point proximity.
- Transition-frame audit: Inspect the measured-only entry, residual-update midpoint, and five fitted settled state.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[axes, observations, fits, residuals, labels], labels=[labels], blockers=[axes, observations, fits, residuals], frame_items=[axes, observations, fits, residuals, labels], intentional_overlaps=[(observations, fits), (residuals, observations), (residuals, fits)])`.
- QA risks: The animation must not imply a Bayesian posterior; the paper reports deterministic nonlinear least-squares estimates.

### Scene 8: The reported fit error falls at four wells

- Source-derived rules: `H03`, `H04`, `H07`, `H10`, `H17`, `H19`, `H20`.
- Narrative beat: `revelation`.
- Background beat: `none`.
- Method step: `M05`.
- Storyboard trigger: The five fitted curves need a quantitative comparison that is not carried by visual smoothness alone.
- Viewer question: Did adding the two lag parameters reduce the reported model-conditioned fit error consistently?
- Visual object: Five paired SEE bars change from Case 1 to Case 2 using the scalar values in Table 2.
- Visual antecedent: The five standard-error widths produced in Scene 7.
- Transformation from previous scene: Each fitted curve contracts into a horizontal SEE bar at the same well position.
- Motion purpose: Pairwise bar-length changes make the direction and magnitude of the reported scalar fit statistic immediately visible.
- Motion class: `same-object-transform`.
- Focal object: Five Case 1 versus Case 2 SEE bar pairs.
- Salience plan: One well pair is highlighted at a time; completed pairs recede but remain readable for the final comparison.
- Theme tokens: body 30 px, annotation 24 px, focal, secondary, uncertainty, primary 4 px, focus 6 px, minimum gap 0.10.
- Downsample legibility: All five well labels and both bar styles remain distinguishable at phone width.
- Step detail: Preserve the five well positions; draw the Case 1 bars; replace each with its Case 2 bar; align all pairs for comparison.
- Why this step is valid: This is valid because Table 2 reports Case 1 versus Case 2 SEE values of 0.299 versus 0.153, 0.114 versus 0.103, 0.041 versus 0.037, 0.011 versus 0.008, and 0.009 versus 0.009 m after rounding.
- Transition bridge: From the changed SEE bars, two fitted lag estimates become point markers for the distance plot.
- Evidence locator: Section 3.3, Table 2, page 8508.
- Input state: Case 1 and Case 2 standard errors of estimate.
- Operation: compare standard errors.
- Output state: Lower Case 2 standard error at four wells plus equal reported error at CHLN-2.
- Validity basis: Table 2 reports smaller Case 2 SEE at four wells plus equal 0.009 m SEE at CHLN-2.
- Aha object: Four paired SEE bars shorten while the CHLN-2 pair remains equal at the reported precision.
- What the viewer learns: The field evidence is a repeated reduction in model-conditioned fit error, not merely a smoother-looking example curve.
- Minimal on-screen text: “SEE, metres • Case 1 → Case 2”.
- Narration draft: Table 2 provides the quantitative comparison. Under the reported precision, Case 2 lowers the standard error at four wells and matches the fifth while improving the early-time fit shown in Figure 4.
- Formula: none.
- Uncertainty shape: Paired scalar bar widths encode the reported standard error of estimate as a goodness-of-fit statistic.
- Frame zones: Well names at left; aligned bar plot in center; source note at bottom.
- Keep-clear pairs: Numeric labels versus bar endpoints; well names versus axis; source note versus bar plot.
- Transition-frame audit: Inspect the Case 1 entry, paired-bar midpoint, and all-well settled comparison.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[bars, labels, axis], labels=[labels], blockers=[bars, axis], frame_items=[bars, labels, axis], intentional_overlaps=[(bars, axis)])`.
- QA risks: CHLN-2 rounds to 0.009 m in both cases; do not falsely show a visible reduction there.

### Scene 9: The fitted clocks remain site conditioned

- Source-derived rules: `H03`, `H04`, `H07`, `H08`, `H12`, `H17`, `H20`, `H21`.
- Narrative beat: `evidence`.
- Background beat: `none`.
- Method step: `M06`.
- Storyboard trigger: Better fit does not make the lag estimates universal material constants.
- Viewer question: How did the reported lag estimates vary across the observation network?
- Visual object: Flux-lag and gradient-lag markers plotted against the four aligned-well distances used in Figure 5, with BHPL shown separately outside the regression set.
- Visual antecedent: The two lag markers released from each SEE pair in Scene 8.
- Transformation from previous scene: The interval endpoints split into two marker shapes and move onto the distance axis.
- Motion purpose: Separating BHPL before tracing the reported trend makes the site-geometry condition visible.
- Motion class: `same-object-transform`.
- Focal object: The two distance-conditioned trend lines with BHPL visibly excluded.
- Salience plan: Individual points remain secondary after the trend lines appear; the BHPL exclusion marker uses warning contrast without dominating the regression set.
- Theme tokens: body 30 px, annotation 24 px, focal, warning, uncertainty, secondary, grid 1 px, focus 6 px.
- Downsample legibility: Two marker shapes, the BHPL exclusion, and the distance axis remain distinguishable without a dense legend.
- Step detail: Place four aligned-well distances; place the two lag markers per well; move BHPL to an excluded side position; trace the two reported regression trends.
- Why this step is valid: This is valid because Figure 5 excludes BHPL due to its opposite-side location and reports increasing phase-lag trends with distance for the remaining wells.
- Transition bridge: The two trend lines curve back into the two clocks beside the original RC-5 pumping-test geometry.
- Evidence locator: Section 3.3, Figure 5 and discussion, page 8509.
- Input state: Case 2 lag estimates plus well distances excluding BHPL.
- Operation: fit distance trends.
- Output state: Positive distance-conditioned lag trends.
- Validity basis: Figure 5 reports regression lines after excluding the oppositely located BHPL well.
- What the viewer learns: The fitted lags vary with observation scale and site geometry, so they remain model- and test-conditioned diagnostics.
- Minimal on-screen text: “distance-conditioned • BHPL excluded”.
- Narration draft: The fitted clocks did not collapse to one site constant. The paper reported distance trends after excluding BHPL, which lies on the opposite side of the pumping well, and noted the heterogeneous geometry behind the scatter.
- Formula: none.
- Uncertainty shape: Discrete lag-pair markers, two trend lines, and an explicitly excluded point rather than a smooth probability density.
- Frame zones: Distance plot in center; compact marker labels in top margin; claim boundary at bottom.
- Keep-clear pairs: Marker labels versus trend lines; BHPL note versus plot; bottom claim boundary versus axis.
- Transition-frame audit: Inspect the point-only entry, BHPL-exclusion midpoint, and trend-line settled frame.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[axes, points, trends, labels], labels=[labels], blockers=[axes, points, trends], frame_items=[axes, points, trends, labels], intentional_overlaps=[(points, trends), (axes, trends)])`.
- QA risks: Do not imply monotonic observations or a transferable variogram from four regression points.

### Scene 10: Return both clocks to the pumping test

- Source-derived rules: `H01`, `H03`, `H06`, `H08`, `H12`, `H13`, `H17`, `H19`, `H21`.
- Narrative beat: `return`.
- Background beat: `none`.
- Method step: `none`.
- Storyboard trigger: The mathematical and field evidence must return to the original scientific object with its limitation visible.
- Viewer question: What should a groundwater analyst carry forward from the 2017 study?
- Visual object: The two response clocks return beside RC-5 and the five observation wells; the early-time window is highlighted on one measured trace while the other wells remain in context.
- Visual antecedent: The two distance-conditioned trend lines from Scene 9.
- Transformation from previous scene: Each trend line curls into one response clock; the distance axis becomes the RC-5 well network.
- Motion purpose: Returning the fitted clocks to the field network shows the conclusion on the original pumping-test object.
- Motion class: `same-object-transform`.
- Focal object: Early-time window on the field response with both clocks attached to the pumping-test geometry.
- Salience plan: Four background wells and late-time traces recede; the early-time band, representative response, and two clocks remain focal.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, focal, warning, uncertainty, secondary, focus 6 px, caption band 1.0.
- Downsample legibility: “diagnostic, not universal” and the two clock roles remain readable on a phone.
- Step detail: Rebuild RC-5; restore the five wells; attach both clocks to one representative response; highlight early time; reveal the claim boundary.
- Why this step is valid: This is valid because the paper reports improved early-time fit and variable lag estimates across five observation wells.
- Transition bridge: The final field frame returns the opening five-trace puzzle to the groundwater domain as a bounded conclusion.
- Evidence locator: Section 4, concluding remarks, findings 3–4, pages 8509–8510.
- What the viewer learns: Lagging Theory is a testable extension for transient interpretation, while its fitted lags remain conditioned on model, test design, distance, and site structure.
- Minimal on-screen text: “early-time evidence” and “diagnostic, not universal”.
- Narration draft: The 2017 result is therefore not a universal lag constant. It is a field-tested way to ask whether flux and the drawdown gradient need separate macroscopic response times in a particular pumping test.
- Formula: none.
- Uncertainty shape: Early-time band plus the bounded spread of five fitted lag pairs retained beside the network.
- Frame zones: Field geometry in center; two clocks in upper corners; conclusion in bottom caption band.
- Keep-clear pairs: Clock labels versus well labels; early-time band versus conclusion; lag spread versus observation-well markers.
- Transition-frame audit: Inspect the trend-line entry, network-return midpoint, and settled claim-boundary frame.
- Layout guard: `assert_scene_layout(scene=self, pending_items=[network, clocks, band, labels], labels=[clocks, labels], blockers=[network, band], frame_items=[network, clocks, band, labels], intentional_overlaps=[(network, band)])`.
- QA risks: The final wording must preserve the model-conditioned and site-conditioned boundary.
