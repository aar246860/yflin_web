# Rethinking Aquifer Characterization: Insights from Lagging Models

## Metadata

- Title: Rethinking Aquifer Characterization: Insights from Lagging Models
- Source artifact: paper.pdf
- Audience: groundwater researchers, practitioners, and technically curious collaborators
- Story mode: method
- Target duration: 120 seconds
- Rendering target: 1080p
- Visual-direction artifact: visual_direction.toml

## Research Extraction

- Core research question: Are two fitted lag parameters justified by penalized model comparison, and what bounded diagnostics can their ordering and time scale provide for aquifer characterization?
- Physical or scientific system: Pumping and observation wells in confined, unconfined, fractured, weathered, and heterogeneous aquifers across India, the United States, and Taiwan.
- Input data: Time-drawdown observations at individual wells and multiwell fields, with spatial estimation demonstrated for eastern Massachusetts and Rapid City.
- Main method: Fit a shifted two-lag flow law, compare lagging and Darcy models with AIC and BIC, interpolate fitted parameters with copulas, derive a lag ratio and characteristic time, and inspect their spatial and cross-site relations.
- Reference or benchmark: Conventional Darcy-continuity interpretation through transmissivity and storage, plus the Darcy characteristic time.
- Uncertainty or error treatment: Copula conditional cumulative distributions yield 5th-to-95th percentile widths; these are not posterior distributions.
- Main conclusion: The examined cases favor the lagging model under relative information criteria and support diagnostic lag-ratio and time-scale views, while the paper contains mixed characteristic-time directions and retains field characterization as indispensable.

## Narrative Spine

- Throughline: Follow one pumping disturbance from conventional transmissivity and storage interpretation into two lag clocks, then test whether those clocks earn their complexity and what they can diagnose without becoming unique mechanisms.
- Audience starting point: A capable non-specialist understands that pumping creates drawdown and that Darcy-based pumping tests are commonly interpreted through transmissivity and storage.
- Stakes: Forcing a temporally mixed response into an instantaneous relation can shift fitted aquifer properties and the interpreted time to near-steady conditions, but adding lags without a penalty or evidence boundary can create false certainty.
- Resolution: Penalized comparisons, conditional spatial fields, and normalized time plots turn the two lags into bounded diagnostics that complement rather than replace direct field characterization.
- Background scope: 4 premises needed to move from a pumping well to the model-selection and interpretation questions.
- Method scope: 15 operations needed to derive the lag law, diagnostics, fitting comparison, spatial fields, time comparisons, and conditional implications.

## Background Ledger

| ID | Audience gap or premise | Visible evidence | Why it is needed now | Source or claim boundary | Source locator |
| --- | --- | --- | --- | --- | --- |
| B01 | Darcy's law combined with continuity underpins the conventional interpretation of pumping tests through transmissivity and storage coefficient. | A pumping well sends radial flux through an aquifer while a continuity balance separates ease of transmission from stored-water release. | The familiar pumping-test object gives the audience a physical baseline before any lag parameter appears. | This establishes the conventional interpretation and does not claim that Darcy models fail universally. | PDF page 1, Introduction, opening paragraph |
| B02 | In complex media the paper allows groundwater flux and hydraulic-gradient response to occur at different times in either order. | Two response pulses share one pumping origin but peak at different times, with neither pulse assigned a universal lead. | The temporal mismatch creates the concrete scientific puzzle that the shifted law must represent. | The paper says the classical approximation is usually unproblematic and reserves lagging behavior for consequential complex settings. | PDF pages 1-2, Introduction and Section 2.1, Equation (2) |
| B03 | The scientific question is whether two added lag parameters are justified after penalizing model complexity rather than by fit improvement alone. | One observed drawdown trace attracts a two-parameter Darcy curve and a four-parameter lagging curve while two penalty weights resist the extra flexibility. | The extra clocks need an explicit model-comparison test before they can be interpreted. | AIC and BIC express relative preference among compared models and do not establish physical truth. | PDF page 2, Introduction, two critical questions paragraph |
| B04 | Lag ratio and characteristic time are diagnostic summaries whose interpreted associations do not identify a unique mechanism or replace detailed field characterization. | A ratio gauge and a clock project onto an aquifer map while several possible pore and fracture geometries remain translucent behind them. | The interpretation boundary must be visible before the diagnostic quantities are derived. | The paper calls the model complementary and retains geophysics, tracer tests, and other field investigations as necessary. | PDF pages 2 and 9, Section 2.2 and Section 4 limitations paragraph |

## Method Decomposition Ledger

| ID | Visible input state | One operation | Visible output state | Validity basis | Source locator |
| --- | --- | --- | --- | --- | --- |
| M01 | Groundwater flux and hydraulic-gradient traces sharing one pumping-time origin | Form shifted lag law | A constitutive relation with flux lag tau_q and gradient lag tau_s | Equation (2) retains the paper's linear flux-gradient relation while evaluating the two responses at shifted times. | PDF page 2, Section 2.1, Equation (2) |
| M02 | The two lag markers tau_q and tau_s on one time axis | Compare lag markers | Three regimes tau_q greater than tau_s tau_q equal to tau_s and tau_q less than tau_s | Section 2.1 explicitly discusses both orderings and the simultaneous Darcy case. | PDF page 2, Section 2.1, lag ordering paragraph and Figure 1 |
| M03 | The ordered lag pair tau_q and tau_s | Compute lagging ratio | Dimensionless ratio theta equal to tau_s divided by tau_q | Equation (3) defines theta from the two lag parameters. | PDF page 2, Section 2.2, Equation (3) |
| M04 | The theta gauge with its threshold at one | Classify threshold association | Three paper-associated diagnostic regions around theta equal to one | The paragraph after Equation (3) associates values below and above one with inertial and microstructural effects while the film preserves this as interpretation rather than proof. | PDF page 2, Section 2.2, paragraph after Equation (3) |
| M05 | Lag times with storage coefficient transmissivity and radial well distance | Derive characteristic time | Characteristic time t_c as defined by the paper | Equation (4) supplies the dimensional balance and the resulting lag-adjusted time expression. | PDF page 2, Section 2.2, Equation (4) |
| M06 | The lag-adjusted characteristic time and the Darcy diffusion time | Normalize characteristic time | Ratio t_c divided by t_c_Darcy equal to tau_q divided by tau_s | The paragraph after Equation (4) defines the Darcy limit and Equation (4) yields the normalized relation. | PDF page 2, Section 2.2, paragraph after Equation (4) |
| M07 | Observed time-drawdown points and a lagging-model curve at one analyzed well | Fit observed drawdown | Best-fit S T tau_q and tau_s with visible residual lengths | Section 2.3 defines least squares with the trust region reflective algorithm and states that well estimates average the radius of influence. | PDF pages 2-3, Section 2.3, Equation (5) |
| M08 | Residual-based likelihoods for the two-parameter Darcy model and four-parameter lagging model | Calculate information criteria | Paired AIC and BIC scores carrying different complexity penalties | Section 3.1 defines both criteria and states that lower values balance goodness of fit against complexity. | PDF page 3, Section 3.1, AIC and BIC definitions |
| M09 | Site-specific AIC and BIC pairs for the compared models | Compare criteria across sites | Cross-site relative preference direction for the examined cases | Sections 3.1 through 3.4 and Section 3.7 report lower criteria for the lagging model across the examined cases. | PDF pages 3-5 and 9, Sections 3.1-3.4 and 3.7 |
| M10 | Fitted well-scale parameter estimates at irregular observation locations | Interpolate parameter fields | Copula-based conditional spatial parameter fields between wells | Section 2.3 selects copula interpolation for non-Gaussian dependence and spatial anomalies and Section 3.4 applies it. | PDF pages 3 and 5, Section 2.3 and Section 3.4, Figure 7 |
| M11 | One copula conditional cumulative distribution at each map grid point | Compute percentile width | Fifth-to-ninety-fifth percentile width for a 90 percent conditional interval | Section 3.4 defines the bounds from the conditional cumulative distribution and subtracts the fifth percentile from the ninety-fifth. | PDF page 5, Section 3.4, Figure 8 percentile-width paragraph |
| M12 | Interpolated tau_q and tau_s fields with observation-well support | Map spatial lagging ratio | An interpolated theta field partitioned by the threshold at one | Sections 3.4 and 3.5 transform the two lag fields by tau_s divided by tau_q and present the resulting maps. | PDF pages 5-7, Sections 3.4-3.5, Figures 9 and 13 |
| M13 | Calculated t_c and t_c_Darcy values across analyzed wells | Plot linear time comparison | Linear-scale relation near the one-to-one line with reported R squared of 0.83 | Section 3.6 describes Figure 14a as close to one-to-one with the fitted line shifted upward and reports R squared of 0.83. | PDF pages 7 and 9, Section 3.6, Figure 14(a) |
| M14 | The same characteristic-time pairs shown on logarithmic axes | Plot logarithmic time comparison | Log-scale relation closer to one-to-one with reported R squared of 0.96 | Section 3.6 states that log transformation reduces extreme-value influence and reports R squared of 0.96 in Figure 14b. | PDF page 9, Section 3.6, Figure 14(b) |
| M15 | Theta regimes and characteristic-time comparisons with their visible claim boundaries | Map conditional implications | Conditional monitoring pumping and recovery implications without a universal time-direction claim | Section 3.7 phrases operational consequences as potential strategies tied to interpreted regimes while the paper's characteristic-time statements remain internally mixed. | PDF page 9, Section 3.7, practical implications paragraphs |

## Symbol Glossary

| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| `\mathbf{q}` | Scene 5 | Teal flux trace and radial arrows | Specific discharge vector | L T^-1 | Flux arrows contract into the symbol |
| `t` | Scene 5 | Shared pumping-time axis | Elapsed pumping-test time | T | Axis tick becomes the argument |
| `\tau_q` | Scene 5 | Bracket from pumping origin to the flux marker | Flux lag parameter | T | Teal timing bracket becomes the subscripted symbol |
| `\mathbf{K}` | Scene 5 | Proportionality bridge between gradient and flux | Hydraulic conductivity tensor used by the paper | L T^-1 | Bridge stroke becomes the coefficient |
| `\nabla s` | Scene 5 | Brick hydraulic-gradient trace | Drawdown gradient | dimensionless | Gradient arrows align into the operator and drawdown symbol |
| `\tau_s` | Scene 5 | Bracket from pumping origin to the gradient marker | Hydraulic-gradient lag parameter | T | Brick timing bracket becomes the subscripted symbol |
| `\theta` | Scene 7 | Ratio gauge centered on one | Lagging ratio tau_s divided by tau_q | dimensionless | Two lag brackets stack into a fraction and collapse into the gauge |
| `t_c` | Scene 9 | Lag-adjusted radial response clock | Characteristic time defined by Equation (4) | T | Radial influence geometry closes into a clock face |
| `r` | Scene 9 | Radius from pumping well to observation point | Radial distance from pumping well | L | Radial line receives a brace and symbol |
| `S` | Scene 9 | Stored-water wedge in the aquifer | Storage coefficient | dimensionless | Filled storage wedge becomes the numerator factor |
| `T\;(\mathrm{transmissivity})` | Scene 9 | Radial transmission path | Transmissivity denoted by uppercase T in the paper | L^2 T^-1 | Flow path becomes the denominator factor |
| `t_{c,\mathrm{Darcy}}` | Scene 10 | Reference clock without lag adjustment | Darcy diffusion characteristic time | T | Reference aquifer clock receives the Darcy subscript |
| `\Theta\;(\mathrm{parameter\ set})` | Scene 11 | Four connected parameter handles | Parameter set containing S T tau_q and tau_s | mixed | Four handles close into a brace and capital symbol |
| `J` | Scene 11 | Counted observed drawdown points | Total number of observations | dimensionless | Point counter becomes the summation limit |
| `s_{\mathrm{obs}}^{(j)}` | Scene 11 | One observed drawdown point | Observed drawdown at observation j | L | Point marker becomes the observed term |
| `s(\Theta,t_j)` | Scene 11 | Corresponding fitted curve point | Model-predicted drawdown at time t_j | L | Curve point becomes the predicted term |
| `k` | Scene 12 | Parameter-count weight | Number of fitted model parameters | dimensionless | Two and four parameter handles become the penalty term |
| `L` | Scene 12 | Relative likelihood marker | Model likelihood in the information criteria | relative scale | Fit evidence contracts into the likelihood term |
| `\mathrm{AIC}` | Scene 12 | First penalized balance beam | Akaike information criterion | dimensionless | Fit and penalty weights balance into the criterion |
| `\mathrm{BIC}` | Scene 12 | Second penalized balance beam | Bayesian information criterion | dimensionless | Stronger parameter weight balances into the criterion |
| `Q_p` | Scene 15 | Quantile marker on a conditional cumulative curve | Parameter quantile at cumulative probability p | same as mapped parameter | Cumulative curve emits percentile markers |
| `w_{90}` | Scene 15 | Bracket between fifth and ninety-fifth percentiles | Width of the paper's 90 percent conditional interval | same as mapped parameter | Two percentile markers join into one width bracket |
| `R^2` | Scene 17 | Compact goodness-of-fit tag beside the comparison line | Coefficient of determination reported for Figure 14 | dimensionless | Spread around the fitted line contracts into the tag |

## Scene Table

### Scene 1: The familiar pumping test

- Source-derived rules: H01, H02, H03, H04, H06, H17, H19, H20, H21
- Narrative beat: hook
- Background beat: B01
- Background premise: Darcy's law combined with continuity underpins the conventional interpretation of pumping tests through transmissivity and storage coefficient.
- Method step: none
- Storyboard trigger: A pumping well begins drawing water and the audience needs a familiar physical object before any formal lag is introduced.
- Viewer question: What do we normally infer from the spreading drawdown around a pumping well?
- Visual object: A pumping-well aquifer cross-section with radial flux arrows a drawdown cone and two full-word interpretation labels for transmissivity and storage.
- Visual antecedent: The unpumped aquifer block and a single well exist before the pumping arrow appears.
- Transformation from previous scene: The opening aquifer surface deforms continuously into the drawdown cone as radial flow paths appear.
- Motion purpose: Pumping reveals because one physical disturbance visibly separates transmission through the aquifer from release out of storage.
- Motion class: trace
- Focal object: The drawdown cone centered on the pumping well.
- Salience plan: The aquifer boundary and radial arrows remain secondary while the cone and well use primary and focus strokes.
- Theme tokens: title 44 px body 30 px annotation 24 px focal teal secondary muted focus stroke 6 frame margin 0.45.
- Downsample legibility: The well cone radial arrows and the words transmissivity and storage remain readable at 640 by 360.
- Step detail: Show the intact aquifer; start pumping; trace radial flow; lower the water-level profile; attach transmission and storage meanings to separate visible parts.
- Why this step is valid: This is valid because the Introduction states that Darcy's law combined with continuity yields the groundwater-flow equation and introduces transmissivity and storage coefficient.
- Transition bridge: From the conventional cone the radial arrows rise into two response traces for the next timing question.
- What the viewer learns: Conventional pumping-test interpretation turns observed drawdown into transmissivity and storage.
- Minimal on-screen text: Pumping • transmission • storage
- Narration draft: A pumping test begins with a familiar picture. Darcy's law and continuity turn the spreading drawdown into estimates of transmissivity and storage.
- Formula: none
- Evidence locator: PDF page 1, Introduction, opening paragraph
- Frame zones: upper title band center aquifer geometry lower caption band and side interpretation labels.
- Keep-clear pairs: title versus well; transmission label versus radial arrows; storage label versus drawdown cone; caption versus aquifer boundary.
- Transition-frame audit: Inspect entry with the intact aquifer midpoint with growing radial flow and settled with the complete cone and both interpretation labels.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, aquifer, well, cone, flow_paths, labels], labels=[heading, caption, labels], blockers=[aquifer, well, cone, flow_paths], frame_items=[heading, caption, aquifer, well, cone, flow_paths, labels])
- QA risks: The first frame must stay object-led and the two interpretation labels must not read as a bullet list.

### Scene 2: One disturbance two timings

- Source-derived rules: H03, H04, H06, H12, H13, H17, H19, H20, H21
- Narrative beat: context
- Background beat: B02
- Background premise: In complex media the paper allows groundwater flux and hydraulic-gradient response to occur at different times in either order.
- Method step: none
- Storyboard trigger: The conventional cone cannot show whether flux and gradient respond at the same moment.
- Viewer question: Can one pumping event produce non-simultaneous flux and gradient responses?
- Visual object: The pumping well persists below two color-and-shape-coded response pulses whose peaks separate in time and can exchange lead order.
- Visual antecedent: The pumping well and radial arrows from Scene 1 remain visible before the response traces rise above them.
- Transformation from previous scene: Radial flow arrows bend upward into the flux pulse while the cone slope becomes the hydraulic-gradient pulse.
- Motion purpose: The separating peaks make a hidden temporal mismatch visible because the two traces retain one common pumping origin.
- Motion class: same-object-transform
- Focal object: The measurable separation between the two pulse peaks.
- Salience plan: The aquifer and well dim to secondary while the teal solid pulse and brick dashed pulse carry the highest contrast.
- Theme tokens: title 44 px body 30 px annotation 24 px focal teal warning brick secondary muted focus stroke 6.
- Downsample legibility: Both pulse shapes peak markers and the shared origin remain distinct at 640 by 360 without relying on color alone.
- Step detail: Preserve the pumping origin; lift flux into a solid pulse; lift gradient into a dashed pulse; separate their peaks; briefly reverse the ordering; settle with no universal lead arrow.
- Why this step is valid: This is valid because the paper says complex media can show non-simultaneous response and that the relative delay can occur in either direction.
- Transition bridge: From the separated peaks two empty parameter sockets appear beside the conventional fit in the model-complexity question.
- What the viewer learns: Lagging theory represents relative timing and does not require one response to lead universally.
- Minimal on-screen text: Same disturbance • different response times
- Narration draft: In complex media the paper allows flux and hydraulic gradient to respond at different times. Either one may lead; the ordering is not universal.
- Formula: none
- Evidence locator: PDF pages 1-2, Introduction and Section 2.1, Equation (2)
- Frame zones: upper pulse lane center shared time axis lower aquifer context and bottom caption band.
- Keep-clear pairs: pulse labels versus traces; peak markers versus time axis; caption versus aquifer; title versus pulse lane.
- Transition-frame audit: Inspect entry with coincident traces midpoint with separating peaks and settled with both order possibilities visible but no causal label.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, aquifer, well, time_axis, flux_trace, gradient_trace, labels], labels=[heading, caption, labels], blockers=[aquifer, well, time_axis, flux_trace, gradient_trace], frame_items=[heading, caption, aquifer, well, time_axis, flux_trace, gradient_trace, labels])
- QA risks: Temporary pulse overlap must remain intentional and peak labels must not imply measured site data.

### Scene 3: Do two more parameters earn their place?

- Source-derived rules: H02, H03, H04, H06, H12, H17, H19, H20, H21
- Narrative beat: tension
- Background beat: B03
- Background premise: The scientific question is whether two added lag parameters are justified after penalizing model complexity rather than by fit improvement alone.
- Method step: none
- Storyboard trigger: The separated pulses suggest two lags but extra flexibility can improve a curve even when the added structure is unjustified.
- Viewer question: Does the improved lagging curve outweigh the penalty for two additional parameters?
- Visual object: One observed drawdown curve pulls two model strings while visible penalty weights resist the four-parameter lagging string.
- Visual antecedent: The two pulse peaks from Scene 2 remain as empty lag handles before either model curve is judged.
- Transformation from previous scene: Pulse peaks contract into two extra parameter handles attached only to the lagging-model curve.
- Motion purpose: Competing fit pull and penalty weight compare because the viewer sees improvement and complexity on the same physical balance.
- Motion class: same-object-transform
- Focal object: The balance between lagging-model fit pull and its two added-parameter weights.
- Salience plan: Observed drawdown stays ink black the compared curves use primary strokes and the penalty weights alone use warning brick.
- Theme tokens: title 44 px body 30 px annotation 24 px foreground ink focal teal warning brick focus stroke 6.
- Downsample legibility: The two curves four versus two handles and penalty direction remain readable at 640 by 360.
- Step detail: Restore one observed curve; attach the Darcy model with two handles; attach the lagging model with four handles; improve its fit; lower two penalty weights; hold the unresolved balance.
- Why this step is valid: This is valid because the Introduction explicitly raises over-parameterization and names Akaike and Bayesian information criteria as indicators.
- Transition bridge: From the unresolved balance the two lag handles move toward a ratio gauge and response clock whose interpretation still needs a boundary.
- What the viewer learns: Better fit must be judged against added complexity before the lags are treated as useful.
- Minimal on-screen text: Better fit ≠ automatic justification
- Narration draft: Two extra parameters can always bend a model more. The paper therefore asks whether the fit gain survives explicit penalties for complexity.
- Formula: none
- Evidence locator: PDF page 2, Introduction, two critical questions paragraph
- Frame zones: upper title band center drawdown balance lower model labels and bottom caption band.
- Keep-clear pairs: model labels versus curves; penalty weights versus observations; caption versus balance beam; title versus parameter handles.
- Transition-frame audit: Inspect entry with the observed curve midpoint with both model pulls and settled with the added-parameter penalty visibly unresolved.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, observed_curve, darcy_curve, lag_curve, handles, penalty_weights, labels], labels=[heading, caption, labels], blockers=[observed_curve, darcy_curve, lag_curve, handles, penalty_weights], frame_items=[heading, caption, observed_curve, darcy_curve, lag_curve, handles, penalty_weights, labels])
- QA risks: The balance must communicate relative model comparison rather than a physical law or absolute truth test.

### Scene 4: Diagnostics are not mechanisms

- Source-derived rules: H03, H04, H06, H12, H13, H17, H19, H20, H21
- Narrative beat: context
- Background beat: B04
- Background premise: Lag ratio and characteristic time are diagnostic summaries whose interpreted associations do not identify a unique mechanism or replace detailed field characterization.
- Method step: none
- Storyboard trigger: Passing a complexity test would still leave the two fitted lags without a safe interpretation boundary.
- Viewer question: What may lag ratios and response times diagnose without claiming a unique cause?
- Visual object: A ratio gauge and response clock cast translucent projections across several possible fracture and pore geometries inside one aquifer field.
- Visual antecedent: The two lag handles from Scene 3 remain visible before they become diagnostic projections.
- Transformation from previous scene: The two handles join into a gauge and clock while multiple subsurface geometries remain unresolved behind them.
- Motion purpose: One diagnostic projection crossing several geometries shows because the same summary can be consistent with more than one mechanism.
- Motion class: same-object-transform
- Focal object: The single diagnostic projection shared by multiple translucent subsurface geometries.
- Salience plan: Gauge and clock use focal teal and ochre while candidate mechanisms stay thin muted outlines and field tools retain secondary contrast.
- Theme tokens: title 44 px body 30 px annotation 24 px focal teal uncertainty ochre secondary muted primary stroke 4.
- Downsample legibility: The shared projection candidate geometries and complementary-tool boundary remain readable at 640 by 360.
- Step detail: Join the lag handles; form a ratio gauge; form a clock; project both over several pore and fracture sketches; reveal geophysics and tracer paths beside the same field.
- Why this step is valid: This is valid because Section 2.2 frames the quantities as interpretive tools and Section 4 calls the model complementary to detailed field investigations.
- Transition bridge: From the bounded diagnostics the two lag handles separate again and enter the shifted constitutive law.
- What the viewer learns: The derived quantities can organize interpretation but cannot uniquely identify subsurface mechanism.
- Minimal on-screen text: Diagnostic • not mechanism-identifying
- Narration draft: A lag ratio and a characteristic time can organize what the fit suggests. They do not identify one unique pore-scale cause, and they do not replace field characterization.
- Formula: none
- Uncertainty shape: A translucent cloud of distinct pore and fracture geometries remains behind the same diagnostic projection.
- Evidence locator: PDF pages 2 and 9, Section 2.2 and Section 4 limitations paragraph
- Frame zones: upper title band center aquifer diagnostic projection side field-tool paths and lower caption band.
- Keep-clear pairs: gauge label versus candidate geometries; clock versus field tools; title versus aquifer; caption versus projection boundary.
- Transition-frame audit: Inspect entry with two handles midpoint with gauge and clock and settled with multiple mechanisms plus complementary field tools.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, aquifer, gauge, clock, mechanisms, field_tools, labels], labels=[heading, caption, labels], blockers=[aquifer, gauge, clock, mechanisms, field_tools], frame_items=[heading, caption, aquifer, gauge, clock, mechanisms, field_tools, labels])
- QA risks: Candidate mechanisms must remain deliberately non-unique and field tools must not become a checklist slide.

### Scene 5: Shift the constitutive relation

- Source-derived rules: H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M01
- Storyboard trigger: The diagnostic boundary is set and the timing mismatch now needs one explicit constitutive relation.
- Viewer question: How are the two visible response times inserted into the Darcy relation?
- Visual object: Flux and gradient traces on one time axis with two origin-to-peak brackets that compress into the shifted lag law.
- Visual antecedent: The two response traces and their time brackets appear earlier in this scene before formula.
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: The ratio gauge opens back into its two lag brackets and candidate mechanisms fade behind the shared time axis.
- Motion purpose: Brackets become formula arguments because the viewer first sees exactly which response each lag shifts.
- Motion class: same-object-transform
- Focal object: The paired lag brackets transforming into shifted time arguments.
- Salience plan: The active brackets and corresponding formula terms retain teal and brick while the unshifted Darcy bridge recedes to muted ink.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal warning brick formula lane 1.25 focus stroke 6.
- Downsample legibility: Both lag brackets and all shifted formula terms remain readable at 640 by 360.
- Step detail: Draw one time axis; place the flux trace; place the gradient trace; bracket each lag from the common origin; map each bracket into its matching time argument; join the terms with the conductivity bridge.
- Why this step is valid: This is valid because Equation (2) evaluates flux at t plus tau_q and the gradient at t plus tau_s while retaining a linear relation.
- Transition bridge: From the shifted law the two time arguments detach and line up as three possible orderings.
- Evidence locator: PDF page 2, Section 2.1, Equation (2)
- Input state: Groundwater flux and hydraulic-gradient traces sharing one pumping-time origin
- Operation: Form shifted lag law
- Output state: A constitutive relation with flux lag tau_q and gradient lag tau_s
- Validity basis: Equation (2) retains the paper's linear flux-gradient relation while evaluating the two responses at shifted times.
- What the viewer learns: The lagging law shifts when flux and gradient are evaluated rather than replacing their linear relation.
- Minimal on-screen text: Two clocks • one linear relation
- Narration draft: The paper keeps the linear flux-gradient relation but evaluates its two sides at shifted times. Each visible bracket becomes one lag parameter.
- Formula: `\mathbf{q}(t+\tau_q)=\mathbf{K}\nabla s(t+\tau_s)`
- Symbol handoff: Teal flux arrows become `\mathbf{q}` and `\tau_q`; brick gradient arrows become `\nabla s` and `\tau_s`; the proportionality bridge becomes `\mathbf{K}`.
- Formula split plan: Keep `\mathbf{q}` `t+\tau_q` the equality bridge `\mathbf{K}` `\nabla s` and `t+\tau_s` as transformable parts.
- Formula derivation steps: Establish the common time origin; bracket the flux peak; bracket the gradient peak; move each bracket beside its visible trace; contract traces into matching formula terms; retain the conductivity bridge.
- Frame zones: upper title band center timing geometry top formula lane and lower caption band.
- Keep-clear pairs: lag labels versus traces; formula terms versus time axis; caption versus brackets; title versus formula lane.
- Transition-frame audit: Inspect entry with separated traces midpoint with moving brackets and settled with the complete shifted law below intact geometry.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, time_axis, flux_trace, gradient_trace, lag_brackets, formula], labels=[heading, caption, lag_labels, formula], blockers=[time_axis, flux_trace, gradient_trace, lag_brackets], frame_items=[heading, caption, time_axis, flux_trace, gradient_trace, lag_brackets, formula])
- QA risks: Formula must arrive after the brackets and corresponding colors must remain stable through the handoff.

### Scene 6: Order the lags

- Source-derived rules: H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M02
- Storyboard trigger: The shifted law contains two clocks whose relative order changes the paper's interpreted regime.
- Viewer question: What three timing relations can the two lag markers occupy?
- Visual object: One horizontal time axis where the flux and gradient markers exchange positions and meet at equality.
- Visual antecedent: The two lag brackets persist from Scene 5 before the three inequalities appear.
- Antecedent timing: prior Scene 5
- Transformation from previous scene: The two shifted time arguments lift out of the law and return to movable markers on the shared time axis.
- Motion purpose: Marker exchange makes the three exhaustive orderings visible because each formula state preserves the same two clocks.
- Motion class: same-object-transform
- Focal object: The two lag markers crossing and meeting on one time axis.
- Salience plan: The current ordering uses focus strokes while the other two positions remain faint ghosts for continuity.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal warning brick secondary muted focus stroke 6.
- Downsample legibility: Marker identities and greater equal less relations remain readable at 640 by 360 without color alone.
- Step detail: Start with the flux marker to the right; move both to equality; continue until the gradient marker is to the right; preserve the shared origin and label each settled ordering.
- Why this step is valid: This is valid because Section 2.1 explicitly describes tau_q greater than tau_s tau_q equal to tau_s and tau_q less than tau_s.
- Transition bridge: From the three orderings the two marker distances stack vertically into a dimensionless fraction.
- Evidence locator: PDF page 2, Section 2.1, lag ordering paragraph and Figure 1
- Input state: The two lag markers tau_q and tau_s on one time axis
- Operation: Compare lag markers
- Output state: Three regimes tau_q greater than tau_s tau_q equal to tau_s and tau_q less than tau_s
- Validity basis: Section 2.1 explicitly discusses both orderings and the simultaneous Darcy case.
- What the viewer learns: The lag pair has three possible relative orderings and equality recovers simultaneous response.
- Minimal on-screen text: flow first • together • gradient first
- Narration draft: The two clocks can be ordered in three ways. Flux can lead, both can coincide, or the gradient can lead.
- Formula: `\tau_q>\tau_s` then `\tau_q=\tau_s` then `\tau_q<\tau_s`
- Symbol handoff: The teal and brick marker distances become the corresponding lag symbols while their left-to-right positions become inequality signs.
- Formula split plan: Keep `\tau_q` the relation sign and `\tau_s` as three matched transformable parts.
- Formula derivation steps: Preserve marker identity; compare horizontal positions; introduce the matching relation sign; transform only the sign as the markers cross; hold each regime.
- Frame zones: upper title band center time-axis lane lower three-regime lane and bottom caption band.
- Keep-clear pairs: lag labels versus marker lines; relation signs versus regime words; caption versus time axis; title versus arrows.
- Transition-frame audit: Inspect entry with the first ordering midpoint at equality and settled with the final ordering plus all three regime traces.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, time_axis, q_marker, s_marker, regime_formula, regime_labels], labels=[heading, caption, regime_formula, regime_labels], blockers=[time_axis, q_marker, s_marker], frame_items=[heading, caption, time_axis, q_marker, s_marker, regime_formula, regime_labels])
- QA risks: Crossing markers must not scramble labels and no ordering may be labeled as a proven mechanism.

### Scene 7: Collapse two clocks into theta

- Source-derived rules: H04, H05, H07, H08, H10, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M03
- Storyboard trigger: Three orderings are easier to compare across wells when expressed by one dimensionless quantity.
- Viewer question: How can the relative lag order be carried by one diagnostic number?
- Visual object: The two lag distances stack into a fraction and collapse onto a ratio gauge centered at one.
- Visual antecedent: The two measured lag distances persist from Scene 6 before the ratio is written.
- Antecedent timing: prior Scene 6
- Transformation from previous scene: The gradient lag marker rises above the flux lag marker and their distances become numerator and denominator.
- Motion purpose: Stacking the same two distances defines theta because the gauge position now preserves their relative order in one object.
- Motion class: same-object-transform
- Focal object: The theta marker landing on a ratio gauge centered at one.
- Salience plan: The fraction and active gauge marker use ochre focus while the source lag markers remain color-coded but secondary.
- Theme tokens: title 44 px math 38 px annotation 24 px accent ochre focal teal warning brick focus stroke 6.
- Downsample legibility: The numerator denominator theta symbol and threshold tick remain readable at 640 by 360.
- Step detail: Copy the gradient lag distance upward; copy the flux lag distance downward; align both as a fraction; name the ratio theta; slide the resulting marker onto a gauge with one at center.
- Why this step is valid: This is valid because Equation (3) defines theta as tau_s divided by tau_q.
- Transition bridge: From the theta gauge the marker sweeps across values below equal to and above one for the paper's bounded associations.
- Evidence locator: PDF page 2, Section 2.2, Equation (3)
- Input state: The ordered lag pair tau_q and tau_s
- Operation: Compute lagging ratio
- Output state: Dimensionless ratio theta equal to tau_s divided by tau_q
- Validity basis: Equation (3) defines theta from the two lag parameters.
- What the viewer learns: Theta is a dimensionless encoding of lag order rather than a new independent measurement.
- Minimal on-screen text: relative lag in one number
- Narration draft: The paper stacks the gradient lag over the flux lag. Their ratio, theta, carries the ordering in one dimensionless number.
- Formula: `\theta=\frac{\tau_s}{\tau_q}`
- Symbol handoff: The brick gradient-lag bracket becomes the numerator the teal flux-lag bracket becomes the denominator and their joined gauge marker becomes `\theta`.
- Formula split plan: Keep `\theta` the equality sign `\tau_s` the fraction bar and `\tau_q` as independently transformable parts.
- Formula derivation steps: Preserve both lag distances; align their origins; stack gradient over flux; introduce the fraction bar; attach theta; move the ratio result to the threshold gauge.
- Frame zones: upper title band left source lag brackets center formula lane right ratio gauge and lower caption band.
- Keep-clear pairs: lag brackets versus fraction terms; theta marker versus gauge ticks; caption versus formula; title versus source geometry.
- Transition-frame audit: Inspect entry with two lag distances midpoint with the assembling fraction and settled with the theta marker on its gauge.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, lag_brackets, theta_formula, gauge, gauge_marker, labels], labels=[heading, caption, theta_formula, labels], blockers=[lag_brackets, gauge, gauge_marker], frame_items=[heading, caption, lag_brackets, theta_formula, gauge, gauge_marker, labels])
- QA risks: The ratio direction must remain tau_s over tau_q and the gauge must not imply mechanism identification.

### Scene 8: What the paper associates with one

- Source-derived rules: H03, H04, H05, H07, H08, H12, H13, H15, H16, H17, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M04
- Storyboard trigger: Theta has been defined but its threshold must be interpreted with bounded language.
- Viewer question: What associations does the paper place on either side of theta equal to one?
- Visual object: A theta marker sweeps across a three-part gauge while the paper-associated inertia and microstructure silhouettes appear as translucent possibilities.
- Visual antecedent: The theta gauge and its central threshold persist from Scene 7 before regime labels enter.
- Antecedent timing: prior Scene 7
- Transformation from previous scene: The single theta marker widens into three settled threshold regions while candidate process silhouettes fade in behind the gauge.
- Motion purpose: Threshold sweep compares because it reveals the paper's stated associations while translucent silhouettes keep them from reading as causal proof.
- Motion class: reveal
- Focal object: The theta marker crossing the central one threshold.
- Salience plan: The marker and threshold remain highest contrast; process silhouettes stay muted and a persistent qualifier uses secondary text.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal warning brick secondary muted focus stroke 6.
- Downsample legibility: Theta inequalities process labels and the phrase the paper associates remain readable at 640 by 360.
- Step detail: Hold the one threshold; move theta below one; reveal the inertia association; return to one; move above one; reveal the microstructure association; retain the interpretation qualifier.
- Why this step is valid: This is valid because the paragraph after Equation (3) associates theta below one with inertial effects and theta above one with microstructural interactions.
- Transition bridge: From the ratio gauge the central threshold bends into a radial distance and the two lag components feed a characteristic-time clock.
- Evidence locator: PDF page 2, Section 2.2, paragraph after Equation (3)
- Input state: The theta gauge with its threshold at one
- Operation: Classify threshold association
- Output state: Three paper-associated diagnostic regions around theta equal to one
- Validity basis: The paragraph after Equation (3) associates values below and above one with inertial and microstructural effects while the film preserves this as interpretation rather than proof.
- What the viewer learns: The paper associates theta regimes with process families but the ratio does not prove a unique cause.
- Minimal on-screen text: The paper associates… • not causal proof
- Narration draft: The paper associates theta below one with inertia and theta above one with microstructural interaction. These are interpreted associations, not causal proof.
- Formula: `\theta<1` then `\theta=1` then `\theta>1`
- Symbol handoff: The gauge marker position becomes each inequality while the central tick supplies the comparison value one.
- Formula split plan: Keep `\theta` the comparison sign and `1` as matched parts so only the sign changes across regimes.
- Formula derivation steps: Preserve the gauge; align the marker with each region; copy its horizontal relation into a sign; hold the associated silhouette; return the marker through one before the opposite side.
- Frame zones: upper title band center gauge lane lower association silhouettes and bottom qualifier band.
- Keep-clear pairs: theta formulas versus gauge ticks; process labels versus silhouettes; qualifier versus caption; title versus gauge.
- Transition-frame audit: Inspect entry below one midpoint at one and settled above one with the qualifier still visible.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, gauge, theta_marker, regime_formula, silhouettes, labels, qualifier], labels=[heading, caption, regime_formula, labels, qualifier], blockers=[gauge, theta_marker, silhouettes], frame_items=[heading, caption, gauge, theta_marker, regime_formula, silhouettes, labels, qualifier])
- QA risks: Association wording must remain exactly bounded and silhouette motion must not look like a causal chain.

### Scene 9: Build the characteristic-time clock

- Source-derived rules: H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M05
- Storyboard trigger: Relative ordering alone does not express the time scale of a pumping response.
- Viewer question: How does the paper combine lag terms with storage transmission and distance into characteristic time?
- Visual object: A pumping well radius storage wedge transmission path and two lag gears close into one response clock.
- Visual antecedent: The radial geometry storage wedge transmission path and lag gears appear earlier in this scene before formula.
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: The theta gauge stretches into a radial line while its numerator and denominator separate into two lag gears.
- Motion purpose: Physical pieces close into a clock because each term's role is visible before the dimensional balance is summarized.
- Motion class: same-object-transform
- Focal object: The response clock assembled from radial aquifer geometry and two lag gears.
- Salience plan: The active clock rim uses ochre focus while aquifer context remains pale and individual factors briefly brighten only during handoff.
- Theme tokens: title 44 px math 38 px annotation 24 px accent ochre focal teal secondary muted focus stroke 6.
- Downsample legibility: The radial brace storage wedge transmission path lag gears and final time expression remain readable at 640 by 360.
- Step detail: Draw the pumping well; extend radius r; fill a storage wedge S; trace a transmission path T; mesh the two lag gears; close these parts into a clock; assemble Equation (4) term by term.
- Why this step is valid: This is valid because Equation (4) defines t_c through a dimensional balance involving S T r tau_q and tau_s.
- Transition bridge: From the assembled clock a second reference clock appears with the two lag gears locked together.
- Evidence locator: PDF page 2, Section 2.2, Equation (4)
- Input state: Lag times with storage coefficient transmissivity and radial well distance
- Operation: Derive characteristic time
- Output state: Characteristic time t_c as defined by the paper
- Validity basis: Equation (4) supplies the dimensional balance and the resulting lag-adjusted time expression.
- What the viewer learns: The characteristic time scales the familiar Darcy diffusion time by the relative lag order.
- Minimal on-screen text: geometry + aquifer properties + lag order
- Narration draft: A second diagnostic combines radial distance, storage, transmissivity, and the two lag clocks. The pieces close into the paper's characteristic time.
- Formula: `\left(\frac{t_c}{\tau_s}\right)r^2\sim\frac{t_c^2}{S\tau_q/T}\Rightarrow t_c\approx\left(\frac{Sr^2}{T}\right)\frac{\tau_q}{\tau_s}`
- Symbol handoff: The radial brace becomes `r`; the storage wedge becomes `S`; the transmission path becomes `T`; the lag gears become `\tau_q` and `\tau_s`; the closed clock becomes `t_c`.
- Formula split plan: Separate the left dimensional balance the right squared-time term the implication arrow the Darcy-scale factor and the lag-ratio factor.
- Formula derivation steps: Map the clock period to t_c; attach the gradient lag to the left clock ratio; attach radius squared; build the storage-lag over transmissivity scale; isolate t_c; preserve the Darcy factor and lag factor separately.
- Frame zones: upper title band left radial aquifer geometry right response clock lower split formula lane and bottom caption band.
- Keep-clear pairs: radius label versus well; storage label versus aquifer fill; formula terms versus clock; caption versus formula lane.
- Transition-frame audit: Inspect entry with radial geometry midpoint with meshing lag gears and settled with the clock plus fully split Equation (4).
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, aquifer, well, radius, storage_wedge, transmission_path, lag_gears, clock, formula], labels=[heading, caption, factor_labels, formula], blockers=[aquifer, well, radius, storage_wedge, transmission_path, lag_gears, clock], frame_items=[heading, caption, aquifer, well, radius, storage_wedge, transmission_path, lag_gears, clock, formula])
- QA risks: The wide equation must remain split and the clock must not imply a universally monotonic direction.

### Scene 10: Normalize against Darcy time

- Source-derived rules: H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M06
- Storyboard trigger: The characteristic time needs a reference scale before cross-well comparison.
- Viewer question: What remains after the lag-adjusted clock is divided by the Darcy clock?
- Visual object: Two clocks share the same S r squared over T face while the lag gear ratio survives as their normalized quotient.
- Visual antecedent: The assembled lag-adjusted clock from Scene 9 exists before the Darcy reference clock and normalized formula enter.
- Antecedent timing: prior Scene 9
- Transformation from previous scene: The Scene 9 clock duplicates; one copy locks its lag gears at equality and becomes the Darcy reference.
- Motion purpose: Dividing matching clock faces reveals because shared geometry and aquifer-property factors cancel visibly while the lag ratio remains.
- Motion class: same-object-transform
- Focal object: The surviving one-over-theta gear ratio between the two clocks.
- Salience plan: Shared clock faces dim after cancellation while the surviving tau_q over tau_s ratio and equality bridge use focus contrast.
- Theme tokens: title 44 px math 38 px annotation 24 px accent ochre focal teal secondary muted focus stroke 6.
- Downsample legibility: Both clock identities cancellation strokes and the normalized relation remain readable at 640 by 360.
- Step detail: Duplicate the clock; set equal lags on the reference; label the Darcy time; align shared S r squared over T faces; divide the clocks; cancel common factors; retain tau_q over tau_s and one over theta.
- Why this step is valid: This is valid because the paper states that equal lags reduce t_c to S r squared over T and Equation (4) supplies the remaining lag factor.
- Transition bridge: From the normalized clocks the adjustable lag gears become four fitting handles attached to observed drawdown.
- Evidence locator: PDF page 2, Section 2.2, paragraph after Equation (4)
- Input state: The lag-adjusted characteristic time and the Darcy diffusion time
- Operation: Normalize characteristic time
- Output state: Ratio t_c divided by t_c_Darcy equal to tau_q divided by tau_s
- Validity basis: The paragraph after Equation (4) defines the Darcy limit and Equation (4) yields the normalized relation.
- What the viewer learns: At the definition level the normalized characteristic time equals tau_q over tau_s or one over theta.
- Minimal on-screen text: same aquifer scale • remaining lag ratio
- Narration draft: Divide by the Darcy time and the shared aquifer scale cancels. Equation (4) leaves tau q over tau s, or one over theta. Later text in the paper points in mixed directions, so this is not a universal arrow.
- Formula: `t_{c,\mathrm{Darcy}}=\frac{Sr^2}{T}` and `\frac{t_c}{t_{c,\mathrm{Darcy}}}=\frac{\tau_q}{\tau_s}=\frac{1}{\theta}`
- Symbol handoff: The locked reference clock becomes `t_{c,\mathrm{Darcy}}`; matched face geometry becomes `Sr^2/T`; the surviving gear ratio becomes the normalized quotient.
- Formula split plan: Keep the Darcy definition the clock quotient the lag quotient and one-over-theta as separate matched groups.
- Formula derivation steps: Define the equal-lag reference; align common faces; divide lag-adjusted by Darcy clocks; cancel S r squared over T; retain tau_q over tau_s; substitute the reciprocal of theta.
- Frame zones: upper title band left lag-adjusted clock right Darcy clock center cancellation lane lower formula lane and bottom caption band.
- Keep-clear pairs: clock labels versus rims; cancellation strokes versus formula terms; caption versus formula lane; title versus clocks.
- Transition-frame audit: Inspect entry with one clock midpoint with duplicated aligned clocks and settled with the normalized quotient plus mixed-direction warning.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, lag_clock, darcy_clock, shared_face, cancellation, formula, qualifier], labels=[heading, caption, formula, qualifier], blockers=[lag_clock, darcy_clock, shared_face, cancellation], frame_items=[heading, caption, lag_clock, darcy_clock, shared_face, cancellation, formula, qualifier])
- QA risks: The reciprocal direction must be correct and the qualifier must prevent a universal monotonic interpretation.

### Scene 11: Fit the four handles

- Source-derived rules: H03, H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M07
- Storyboard trigger: The lag and aquifer quantities must be estimated from observed drawdown before any comparison or map exists.
- Viewer question: How are S T tau_q and tau_s fitted to one observed time-drawdown series?
- Visual object: Observed drawdown points pull a model curve through four bounded handles while residual-length segments shrink under a trust-region boundary.
- Visual antecedent: The four factors from the normalized clocks appear as adjustable handles earlier in this scene before the objective formula.
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: The two clock faces unfold into S T tau_q and tau_s handles beside a time-drawdown axis.
- Motion purpose: Shrinking residual segments shows because least squares becomes a visible distance-minimization rather than a black-box optimizer.
- Motion class: same-object-transform
- Focal object: The set of residual-length segments shrinking between observed points and the fitted curve.
- Salience plan: Observations remain ink the active fitted curve uses focal teal residuals use warning brick and the trust boundary stays thin muted.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal warning brick secondary muted focus stroke 6.
- Downsample legibility: Observed markers fitted curve four handles residual segments and trust boundary remain readable at 640 by 360.
- Step detail: Place observed points; draw an initial curve; expose four parameter handles; draw vertical residual lengths; confine the step within a trust region; update the curve; shrink the summed squared lengths; hold the best-fit state.
- Why this step is valid: This is valid because Section 2.3 defines least squares with the trust region reflective algorithm and states that fitted well values average the radius of influence.
- Transition bridge: From the minimized residual geometry two model likelihood markers move onto separate complexity-penalty balances.
- Evidence locator: PDF pages 2-3, Section 2.3, Equation (5)
- Input state: Observed time-drawdown points and a lagging-model curve at one analyzed well
- Operation: Fit observed drawdown
- Output state: Best-fit S T tau_q and tau_s with visible residual lengths
- Validity basis: Section 2.3 defines least squares with the trust region reflective algorithm and states that well estimates average the radius of influence.
- What the viewer learns: The paper estimates four parameters by bounded least squares and each well estimate is a support-volume average rather than a point property.
- Minimal on-screen text: least squares • trust-region reflective
- Narration draft: Each drawdown series pulls on four handles. Trust-region-reflective least squares shrinks the residual lengths, but the resulting well estimate averages its radius of influence.
- Formula: `\min_{\Theta}\sum_{j=1}^{J}\left(s_{\mathrm{obs}}^{(j)}-s(\Theta,t_j)\right)^2` with `\Theta=\{S,T,\tau_q,\tau_s\}`
- Symbol handoff: Observed points become `s_{\mathrm{obs}}^{(j)}` fitted curve points become `s(\Theta,t_j)` residual lengths become the differences and four handles become `\Theta`.
- Formula split plan: Keep the minimization target the summation the observed term the predicted term and the squared residual as transformable groups.
- Formula derivation steps: Pair each observation with its curve point; draw each residual; translate residual lengths into differences; square the lengths; aggregate across J points; attach the four-handle parameter set; show constrained updates inside the trust boundary.
- Uncertainty shape: Residual-distance segments form a visible spread between observed points and the fitted curve.
- Frame zones: upper title band center time-drawdown plot right parameter-handle lane lower objective formula lane and bottom caption band.
- Keep-clear pairs: parameter labels versus curve; residual segments versus observation labels; objective formula versus x axis; caption versus trust boundary.
- Transition-frame audit: Inspect entry with observed points midpoint with long residuals and settled with the best-fit curve short residuals and support-volume boundary.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, axes, observations, model_curve, residuals, handles, trust_boundary, formula, support_ring], labels=[heading, caption, handle_labels, formula], blockers=[axes, observations, model_curve, residuals, handles, trust_boundary, support_ring], frame_items=[heading, caption, axes, observations, model_curve, residuals, handles, trust_boundary, formula, support_ring])
- QA risks: The support ring must stay inside the aquifer object and residual motion must not imply posterior sampling.

### Scene 12: Penalize the extra flexibility

- Source-derived rules: H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M08
- Storyboard trigger: A best-fit curve is insufficient because the lagging model uses two additional parameters.
- Viewer question: How do AIC and BIC turn fit evidence and parameter count into relative scores?
- Visual object: Two physical balance beams receive a likelihood weight and a parameter-count weight with BIC visibly penalizing complexity more strongly.
- Visual antecedent: The fitted residual bundle from Scene 11 contracts into a relative likelihood marker before criterion formulas appear.
- Antecedent timing: prior Scene 11
- Transformation from previous scene: Residual lengths merge into one likelihood weight while the two versus four parameter handles become complexity weights.
- Motion purpose: Balancing fit and complexity compares because the viewer sees why lower scores favor neither fit alone nor simplicity alone.
- Motion class: same-object-transform
- Focal object: The paired AIC and BIC balance beams carrying the same fit and different complexity weights.
- Salience plan: The active balance uses focal teal likelihood and brick penalty weights while labels remain compact and the observed curve recedes.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal warning brick foreground ink focus stroke 6.
- Downsample legibility: AIC BIC likelihood parameter count and lower-direction arrow remain readable at 640 by 360.
- Step detail: Compress residuals into likelihood; count the model handles; place both on the AIC beam; duplicate them on the BIC beam; enlarge the BIC complexity lever; settle both scores on a lower-is-preferred axis.
- Why this step is valid: This is valid because Section 3.1 defines AIC and BIC from likelihood and parameter count and states that BIC applies a stronger penalty for added parameters.
- Transition bridge: From the two balance beams score markers repeat down a cross-site spine for the examined pumping tests.
- Evidence locator: PDF page 3, Section 3.1, AIC and BIC definitions
- Input state: Residual-based likelihoods for the two-parameter Darcy model and four-parameter lagging model
- Operation: Calculate information criteria
- Output state: Paired AIC and BIC scores carrying different complexity penalties
- Validity basis: Section 3.1 defines both criteria and states that lower values balance goodness of fit against complexity.
- What the viewer learns: AIC and BIC compare relative model support while charging for the lagging model's extra parameters.
- Minimal on-screen text: lower = preferred among compared models
- Narration draft: AIC and BIC convert fit and parameter count into relative scores. BIC presses harder on extra parameters; neither criterion is physical truth.
- Formula: `\mathrm{AIC}=2k-2\ln L` and `\mathrm{BIC}=k\ln J-2\ln L`
- Symbol handoff: The handle count becomes `k` the fitted residual bundle becomes `L` the observation count becomes `J` and each balance receives its named criterion.
- Formula split plan: Separate criterion name complexity term subtraction sign and likelihood term for each beam.
- Formula derivation steps: Count parameters; compress fit evidence into likelihood; build the AIC penalty term; build the stronger BIC penalty term; subtract the same likelihood contribution; align both on a lower-score axis.
- Uncertainty shape: Score-distance marks preserve the visible separation between compared candidates without turning either criterion into physical certainty.
- Frame zones: upper title band center twin balance geometry lower split formula lane right preference arrow and bottom caption band.
- Keep-clear pairs: criterion labels versus beams; formula terms versus weights; preference arrow versus scores; caption versus formula lane.
- Transition-frame audit: Inspect entry with fit and count weights midpoint with balancing beams and settled with both formulas plus the relative-preference boundary.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, aic_beam, bic_beam, likelihood_weight, penalty_weights, formulas, preference_arrow, labels], labels=[heading, caption, formulas, labels], blockers=[aic_beam, bic_beam, likelihood_weight, penalty_weights, preference_arrow], frame_items=[heading, caption, aic_beam, bic_beam, likelihood_weight, penalty_weights, formulas, preference_arrow, labels])
- QA risks: The lower direction must remain relative to compared models and BIC cannot be portrayed as a truth detector.

### Scene 13: Repeat the comparison across sites

- Source-derived rules: H03, H04, H07, H08, H12, H13, H17, H20, H21
- Narrative beat: evidence
- Background beat: none
- Method step: M09
- Storyboard trigger: One site's criterion result cannot answer the paper's cross-case over-parameterization question.
- Viewer question: Does the relative preference direction recur across the examined pumping-test sites?
- Visual object: A continuous geographic spine links India Spearfish Dongju and Massachusetts while paired criterion markers consistently point toward the lagging model.
- Visual antecedent: The AIC and BIC score markers from Scene 12 persist before they repeat along the site spine.
- Transformation from previous scene: Each balance beam contracts into a paired marker and the marker travels from site to site along one continuous line.
- Motion purpose: Repetition across one spine shows because the criterion direction becomes a cross-case pattern rather than a single-site anecdote.
- Motion class: trace
- Focal object: The repeated lower-criterion direction carried by paired markers along the site spine.
- Salience plan: The active site marker uses focus contrast while prior sites dim but remain visible to show accumulation.
- Theme tokens: title 44 px body 30 px annotation 24 px focal teal warning brick secondary muted focus stroke 6.
- Downsample legibility: All four site names paired markers and the relative-preference qualifier remain readable at 640 by 360.
- Step detail: Draw the site spine; move the criterion pair to India; preserve its direction; continue to Spearfish; continue to Dongju; continue across Massachusetts wells; retain one relative-preference qualifier.
- Why this step is valid: This is valid because the Results and Section 3.7 report lower AIC and BIC for the lagging model across the examined cases.
- Transition bridge: From the Massachusetts site marker individual observation wells spread into a plan-view field for spatial interpolation.
- Evidence locator: PDF pages 3-5 and 9, Sections 3.1-3.4 and 3.7
- Input state: Site-specific AIC and BIC pairs for the compared models
- Operation: Compare criteria across sites
- Output state: Cross-site relative preference direction for the examined cases
- Validity basis: Sections 3.1 through 3.4 and Section 3.7 report lower criteria for the lagging model across the examined cases.
- What the viewer learns: Across the paper's examined cases the penalized criteria relatively favor the lagging model despite two extra parameters.
- Minimal on-screen text: examined cases • lower AIC and BIC
- Narration draft: The same relative preference appears across the examined cases. That supports the extra lags among these compared models, but it is not a universal physical verdict.
- Formula: none
- Frame zones: upper title band center geographic site spine lower criterion-marker lane and bottom qualifier band.
- Keep-clear pairs: site labels versus spine; criterion markers versus site nodes; qualifier versus route; title versus site names.
- Transition-frame audit: Inspect entry at the first site midpoint after the second comparison and settled with all examined-site directions accumulated.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, site_spine, site_nodes, criterion_pairs, site_labels, qualifier], labels=[heading, caption, site_labels, qualifier], blockers=[site_spine, site_nodes, criterion_pairs], frame_items=[heading, caption, site_spine, site_nodes, criterion_pairs, site_labels, qualifier])
- QA risks: The geographic spine must not imply a statistical meta-analysis or sites beyond those examined by the paper.

### Scene 14: Interpolate between support volumes

- Source-derived rules: H03, H04, H07, H08, H12, H13, H17, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M10
- Storyboard trigger: Multiwell fitted parameters exist only at irregular well supports but the paper seeks spatial patterns between them.
- Viewer question: How are irregular well estimates extended into a continuous spatial field?
- Visual object: Well-centered support rings emit conditional copula ribbons that fill a bounded plan-view domain without turning interpolated cells into observations.
- Visual antecedent: The Massachusetts site node from Scene 13 expands into irregular observation-well locations before any field fill appears.
- Transformation from previous scene: The final site node opens into a plan-view well field and each criterion marker becomes a fitted parameter marker at a well.
- Motion purpose: Conditional ribbons fill gaps because the viewer can distinguish measured well supports from interpolated space throughout the operation.
- Motion class: reveal
- Focal object: The continuous copula-based conditional field growing between fixed well-support rings.
- Salience plan: Well points remain ink and support rings ochre while the interpolated field uses low-opacity teal and never exceeds well-marker contrast.
- Theme tokens: title 44 px body 30 px annotation 24 px focal teal uncertainty ochre secondary muted primary stroke 4.
- Downsample legibility: Well points support rings conditional ribbons domain boundary and interpolated qualifier remain readable at 640 by 360.
- Step detail: Expand the site node; place irregular wells; draw support-volume rings; attach fitted parameter markers; reveal copula dependence ribbons; fill the bounded domain; retain a visible distinction between wells and interpolated cells.
- Why this step is valid: This is valid because Section 2.3 selects copula interpolation for non-Gaussian dependencies and spatial anomalies and Section 3.4 applies it to the multiwell data.
- Transition bridge: From one interpolated grid cell its conditional ribbon rises into a cumulative distribution for percentile-width extraction.
- Evidence locator: PDF pages 3 and 5, Section 2.3 and Section 3.4, Figure 7
- Input state: Fitted well-scale parameter estimates at irregular observation locations
- Operation: Interpolate parameter fields
- Output state: Copula-based conditional spatial parameter fields between wells
- Validity basis: Section 2.3 selects copula interpolation for non-Gaussian dependence and spatial anomalies and Section 3.4 applies it.
- What the viewer learns: The spatial fields are copula interpolations between support-volume averages and are not direct observations.
- Minimal on-screen text: wells observed • field interpolated
- Narration draft: At irregular wells the fitted values summarize support volumes. Copula interpolation extends them between wells; the resulting field is conditional and interpolated, not observed.
- Formula: none
- Uncertainty shape: Distance-decay bands surround the fixed well supports while the lower-contrast conditional field fills only the bounded domain.
- Frame zones: upper title band center plan-view field side well-support labels and lower evidence-boundary band.
- Keep-clear pairs: well labels versus support rings; qualifier versus field boundary; title versus field; conditional ribbons versus well points.
- Transition-frame audit: Inspect entry with wells only midpoint with growing ribbons and settled with a complete field plus persistent observation boundary.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, domain, wells, support_rings, parameter_marks, ribbons, field_fill, qualifier], labels=[heading, caption, well_labels, qualifier], blockers=[domain, wells, support_rings, parameter_marks, ribbons, field_fill], frame_items=[heading, caption, domain, wells, support_rings, parameter_marks, ribbons, field_fill, qualifier]) with assert_inside(domain, [support_rings], min_gap=0.08)
- QA risks: Support rings must remain inside the mapped domain and field fill must stay visibly lower confidence than well supports.

### Scene 15: Measure conditional width

- Source-derived rules: H03, H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M11
- Storyboard trigger: A copula field should expose the width of its conditional distributions rather than show only a central surface.
- Viewer question: How does the paper construct its 90 percent interval width at each grid point?
- Visual object: One copula conditional cumulative curve emits fifth and ninety-fifth percentile markers whose separation becomes a map-width band.
- Visual antecedent: A selected interpolated grid cell from Scene 14 rises into its conditional cumulative curve before percentile notation appears.
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: One field cell enlarges and its vertical conditional ribbon unfolds into a cumulative distribution axis.
- Motion purpose: Percentile markers create a visible width because the reported interval is shown as a property of the copula conditional distribution.
- Motion class: same-object-transform
- Focal object: The bracket spanning the fifth-to-ninety-fifth percentile interval.
- Salience plan: The conditional curve remains secondary while the two percentile markers and width bracket use ochre focus and distinct end shapes.
- Theme tokens: title 44 px math 38 px annotation 24 px uncertainty ochre focal teal secondary muted focus stroke 6.
- Downsample legibility: Conditional curve percentile labels width bracket and non-posterior qualifier remain readable at 640 by 360.
- Step detail: Lift one grid cell; draw its conditional cumulative curve; place the fifth-percentile marker; place the ninety-fifth-percentile marker; connect them with a width bracket; return the bracket to its map cell.
- Why this step is valid: This is valid because Section 3.4 explicitly defines the conditional cumulative bounds and their difference as the 90 percent confidence-interval width.
- Transition bridge: From the width bracket the selected cell returns to the map and the paired tau fields combine into a theta field.
- Evidence locator: PDF page 5, Section 3.4, Figure 8 percentile-width paragraph
- Input state: One copula conditional cumulative distribution at each map grid point
- Operation: Compute percentile width
- Output state: Fifth-to-ninety-fifth percentile width for a 90 percent conditional interval
- Validity basis: Section 3.4 defines the bounds from the conditional cumulative distribution and subtracts the fifth percentile from the ninety-fifth.
- What the viewer learns: The paper's 90 percent intervals are widths of copula conditional distributions and are not posterior distributions.
- Minimal on-screen text: copula conditional • 5th to 95th
- Narration draft: At each grid cell the paper reads the fifth and ninety-fifth percentiles from a copula conditional distribution. Their separation is a 90 percent width, not a posterior interval.
- Formula: `w_{90}=Q_{0.95}-Q_{0.05}`
- Symbol handoff: The two percentile markers become `Q_{0.05}` and `Q_{0.95}` while their visible bracket becomes `w_{90}`.
- Formula split plan: Keep the width symbol the equality sign upper quantile subtraction sign and lower quantile as separate parts.
- Formula derivation steps: Draw the conditional cumulative curve; locate cumulative probabilities 0.05 and 0.95; project each to the parameter axis; span their separation; contract that span into the width formula.
- Uncertainty shape: A copula conditional cumulative distribution with two quantile markers and one explicit percentile-width band.
- Frame zones: upper title band left conditional cumulative plot right percentile bracket lower formula lane and bottom qualifier band.
- Keep-clear pairs: percentile labels versus curve; width bracket versus axis; formula versus plot; qualifier versus caption.
- Transition-frame audit: Inspect entry with the selected field cell midpoint with the two quantile markers and settled with the width formula plus non-posterior qualifier.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, cdf_axes, conditional_curve, quantile_markers, width_bracket, formula, qualifier], labels=[heading, caption, quantile_labels, formula, qualifier], blockers=[cdf_axes, conditional_curve, quantile_markers, width_bracket], frame_items=[heading, caption, cdf_axes, conditional_curve, quantile_markers, width_bracket, formula, qualifier])
- QA risks: The word posterior cannot appear except in the explicit negated boundary and percentile labels must not overlap the curve.

### Scene 16: Map theta without turning it into mechanism

- Source-derived rules: H03, H04, H05, H07, H08, H10, H12, H13, H15, H16, H17, H18, H20, H21
- Narrative beat: revelation
- Background beat: none
- Method step: M12
- Storyboard trigger: Separate tau_q and tau_s fields become interpretable only when their relative ordering is visible spatially.
- Viewer question: Where does the interpolated field fall below or above theta equal to one?
- Visual object: Two translucent lag fields divide cell by cell and reveal one continuous theta-equals-one contour through the well field.
- Visual antecedent: The interpolated tau_q and tau_s fields from Scene 14 exist before the ratio and threshold contour appear.
- Antecedent timing: prior Scene 14
- Transformation from previous scene: The percentile-width bracket returns to its cell while the two lag surfaces align vertically and divide across the domain.
- Motion purpose: A single threshold contour appears because the scattered relative lag order becomes spatially legible without hiding well supports or interpolation status.
- Motion class: same-object-transform
- Focal object: The theta-equals-one contour separating below-one and above-one diagnostic regions.
- Salience plan: The threshold contour uses ochre focus; region fills stay pale; wells remain ink; support rings and width halos remain secondary.
- Theme tokens: title 44 px math 38 px annotation 24 px uncertainty ochre focal teal warning brick focus stroke 6.
- Downsample legibility: Theta formula threshold contour well points support rings and interpolated-field qualifier remain readable at 640 by 360.
- Step detail: Align the two lag fields; divide corresponding cells; replace the fields with theta shading; trace the one contour; restore wells and support rings; attach the interpreted-association boundary.
- Why this step is valid: This is valid because Sections 3.4 and 3.5 explicitly transform the lag fields by tau_s divided by tau_q and present theta maps in Figures 9 and 13.
- Transition bridge: From the theta contour well markers lift out of the map and become points on the characteristic-time comparison plane.
- Evidence locator: PDF pages 5-7, Sections 3.4-3.5, Figures 9 and 13
- Input state: Interpolated tau_q and tau_s fields with observation-well support
- Operation: Map spatial lagging ratio
- Output state: An interpolated theta field partitioned by the threshold at one
- Validity basis: Sections 3.4 and 3.5 transform the two lag fields by tau_s divided by tau_q and present the resulting maps.
- Aha object: The source-backed theta-equals-one contour turns two separate lag surfaces into one visible spatial relation.
- What the viewer learns: Theta maps relative lag order between wells but remain interpolated diagnostics rather than observed mechanism maps.
- Minimal on-screen text: interpolated theta • association only
- Narration draft: Divide the two interpolated lag fields and a theta-equals-one contour appears. It organizes relative lag order; it does not observe a mechanism directly.
- Formula: `\theta(x,y)=\frac{\tau_s(x,y)}{\tau_q(x,y)}`
- Symbol handoff: Corresponding colored cells from the two lag fields stack into numerator and denominator while the threshold contour receives the theta label.
- Formula split plan: Keep theta with spatial arguments the equality sign tau_s field the fraction bar and tau_q field as transformable parts.
- Formula derivation steps: Preserve well supports; align field cells; divide tau_s by tau_q; color the ratio; locate values equal to one; trace their connected contour; retain conditional-width halos.
- Uncertainty shape: Conditional percentile-width halos remain around well-supported regions while the interpolated theta field fills the domain.
- Frame zones: upper title band center full-field map side theta labels lower evidence-boundary band and small formula lane.
- Keep-clear pairs: theta labels versus contour; well labels versus support rings; formula versus map boundary; qualifier versus field fill.
- Transition-frame audit: Inspect entry with two lag fields midpoint during cellwise division and settled with the theta contour wells halos and interpolation qualifier.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, domain, q_field, s_field, theta_field, threshold_contour, wells, support_rings, halos, formula, qualifier], labels=[heading, caption, formula, region_labels, qualifier], blockers=[domain, q_field, s_field, theta_field, threshold_contour, wells, support_rings, halos], frame_items=[heading, caption, domain, q_field, s_field, theta_field, threshold_contour, wells, support_rings, halos, formula, qualifier]) with assert_inside(domain, [support_rings, halos], min_gap=0.08)
- QA risks: The field must remain labeled interpolated and support-volume rings plus conditional halos must stay inside the domain.

### Scene 17: Compare characteristic times on linear axes

- Source-derived rules: H03, H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M13
- Storyboard trigger: The definition-level normalization must be compared with the paper's reported cross-well characteristic times.
- Viewer question: How does the paper describe t_c relative to Darcy time on the original scale?
- Visual object: Schematic non-digitized well points gather around a one-to-one line while the paper-reported fitted relation sits slightly above it.
- Visual antecedent: Well markers from the theta field enter a blank comparison plane earlier in this scene before the reported R squared tag appears.
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: Well points lift from the plan-view field and preserve their identities as schematic markers on the time-comparison axes.
- Motion purpose: Aligning points against one-to-one compares because the reported direction becomes visible without pretending to digitize the paper's data.
- Motion class: camera-bridge
- Focal object: The separation between the one-to-one line and the slightly upward-shifted reported fitted relation.
- Salience plan: The one-to-one line stays muted dashed; the reported fitted relation uses focus teal; schematic points use small ink markers.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal secondary muted foreground ink focus stroke 6.
- Downsample legibility: Both comparison lines schematic qualifier and R squared tag remain readable at 640 by 360.
- Step detail: Clear the map view; preserve well markers; establish linear axes; draw the one-to-one line; place schematic non-digitized points; trace the reported upward-shifted relation; reveal the reported R squared value.
- Why this step is valid: This is valid because Section 3.6 describes Figure 14a as close to one-to-one with the fitted line slightly upward and reports R squared of 0.83.
- Transition bridge: From the linear plane both axes compress logarithmically while point identity and the one-to-one reference persist.
- Evidence locator: PDF pages 7 and 9, Section 3.6, Figure 14(a)
- Input state: Calculated t_c and t_c_Darcy values across analyzed wells
- Operation: Plot linear time comparison
- Output state: Linear-scale relation near the one-to-one line with reported R squared of 0.83
- Validity basis: Section 3.6 describes Figure 14a as close to one-to-one with the fitted line shifted upward and reports R squared of 0.83.
- What the viewer learns: On linear axes the paper reports a strong relation with t_c tending slightly above the Darcy comparison.
- Minimal on-screen text: schematic relation • not digitized data
- Narration draft: On linear axes the paper reports points near one-to-one, with the fitted relation slightly above and R squared 0.83. The film does not reconstruct unreported point values.
- Formula: `R^2=0.83`
- Symbol handoff: Visible spread around the fitted relation contracts into the paper-reported coefficient-of-determination tag.
- Formula split plan: Keep `R^2` the equality sign and `0.83` as separate parts beside rather than over the data geometry.
- Formula derivation steps: Establish the one-to-one reference; place schematic well identities; trace the reported fitted direction; show residual spread as distance; contract that reported relation into the R squared tag.
- Uncertainty shape: Distances from schematic points to the reported fitted relation remain visible as spread without claiming reconstructed values.
- Frame zones: upper title band center comparison axes right reported-statistic margin and lower schematic qualifier band.
- Keep-clear pairs: axis labels versus points; line labels versus fitted relation; R squared tag versus data; qualifier versus x axis.
- Transition-frame audit: Inspect entry with preserved well points midpoint with the one-to-one and fitted lines and settled with the reported R squared plus schematic qualifier.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, axes, unity_line, fitted_line, schematic_points, residual_distances, statistic, qualifier], labels=[heading, caption, axis_labels, line_labels, statistic, qualifier], blockers=[axes, unity_line, fitted_line, schematic_points, residual_distances], frame_items=[heading, caption, axes, unity_line, fitted_line, schematic_points, residual_distances, statistic, qualifier])
- QA risks: Point locations must stay explicitly schematic and the linear relation cannot be converted into a universal time-direction claim.

### Scene 18: Re-express the same pairs on log axes

- Source-derived rules: H03, H04, H05, H07, H08, H12, H13, H15, H16, H17, H18, H20, H21
- Narrative beat: evidence
- Background beat: none
- Method step: M14
- Storyboard trigger: Extreme values dominate the original-scale comparison and the paper re-expresses the same pairs logarithmically.
- Viewer question: What changes when the same characteristic-time relation is viewed on logarithmic axes?
- Visual object: The same schematic point identities re-space along log axes and tighten around the one-to-one relation while two opposing paper statements remain visibly unresolved.
- Visual antecedent: The linear comparison plane and persistent well markers from Scene 17 exist before the logarithmic transformation and new statistic appear.
- Antecedent timing: prior Scene 17
- Transformation from previous scene: Axis ticks compress toward logarithmic spacing and the same point markers move to guarded target positions without changing identity.
- Motion purpose: Re-spacing the same markers shows because the stronger proportional relation becomes visible while the paper's mixed directional language stays explicit.
- Motion class: same-object-transform
- Focal object: The tightened log-scale relation around the one-to-one line.
- Salience plan: The log relation uses focus teal; the two opposing direction arrows use equal low-saturation warning styles so neither becomes a universal conclusion.
- Theme tokens: title 44 px math 38 px annotation 24 px focal teal warning brick uncertainty ochre focus stroke 6.
- Downsample legibility: Log axis labels one-to-one relation R squared tag and both mixed-direction callouts remain readable at 640 by 360.
- Step detail: Preserve point identity; construct guarded log-axis targets; transform the axes; move points to schematic log positions; tighten the relation; reveal R squared 0.96; place the paper's overestimate and underestimate directions as opposing callouts.
- Why this step is valid: This is valid because Section 3.6 says log transformation reduces extreme-value influence and reports R squared of 0.96 while adjacent text gives internally mixed characteristic-time directions.
- Transition bridge: From the unresolved direction callouts theta regions open into two conditional operational timelines rather than one universal prescription.
- Evidence locator: PDF page 9, Section 3.6, Figure 14(b)
- Input state: The same characteristic-time pairs shown on logarithmic axes
- Operation: Plot logarithmic time comparison
- Output state: Log-scale relation closer to one-to-one with reported R squared of 0.96
- Validity basis: Section 3.6 states that log transformation reduces extreme-value influence and reports R squared of 0.96 in Figure 14b.
- What the viewer learns: Log scaling strengthens the reported proportional relation but does not resolve the paper's conflicting characteristic-time direction statements.
- Minimal on-screen text: stronger proportional relation • mixed direction
- Narration draft: On log axes the reported relation tightens and R squared rises to 0.96. Yet the paper also states characteristic-time directions both ways. We keep that ambiguity visible.
- Formula: `R^2=0.96`
- Symbol handoff: The tightened visible spread becomes the reported `R^2` tag while the persistent one-to-one line anchors the same variable identities.
- Formula split plan: Keep `R^2` the equality sign and `0.96` as separate parts in the statistic margin.
- Formula derivation steps: Preserve all point identities; re-space axes logarithmically; retain the one-to-one line; compare spread; reveal the reported statistic; add equal-status opposing direction callouts without resolving them.
- Uncertainty shape: A tightened schematic point cloud and two opposing direction arrows make the unresolved interpretation visible as shape.
- Frame zones: upper title band center log comparison axes right statistic margin left and lower mixed-direction callouts.
- Keep-clear pairs: log labels versus points; statistic versus line labels; direction callouts versus axes; caption versus x axis.
- Transition-frame audit: Inspect entry on linear axes midpoint during guarded log re-spacing and settled with the tightened relation statistic and both opposing callouts.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, log_axes, unity_line, fitted_line, schematic_points, statistic, direction_callouts, qualifier], labels=[heading, caption, axis_labels, line_labels, statistic, direction_callouts, qualifier], blockers=[log_axes, unity_line, fitted_line, schematic_points], frame_items=[heading, caption, log_axes, unity_line, fitted_line, schematic_points, statistic, direction_callouts, qualifier])
- QA risks: The same points must remain traceable through the view change and neither direction callout may visually dominate.

### Scene 19: Keep management implications conditional

- Source-derived rules: H03, H04, H05, H07, H08, H12, H13, H15, H16, H17, H20, H21
- Narrative beat: evidence
- Background beat: none
- Method step: M15
- Storyboard trigger: Diagnostic regimes matter operationally only if their limits and the paper's mixed time direction remain attached.
- Viewer question: What operational implications does the paper suggest without turning them into universal prescriptions?
- Visual object: Two branching pumping-and-recovery timelines grow from theta regions while a central field-check gate and bidirectional time arrow remain mandatory.
- Visual antecedent: The theta regions from Scene 16 and opposing time arrows from Scene 18 appear earlier in this scene before inequalities are attached.
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: The opposing characteristic-time arrows bend into two conditional timelines and the theta contour becomes their branch point.
- Motion purpose: Branching through a field-check gate shows because operational choices remain conditional on site evidence instead of following theta automatically.
- Motion class: same-object-transform
- Focal object: The central field-check gate through which both conditional operational timelines must pass.
- Salience plan: The field-check gate uses focus ochre; theta branches use teal and brick; all pumping and recovery arrows remain secondary until the gate opens.
- Theme tokens: title 44 px math 38 px annotation 24 px uncertainty ochre focal teal warning brick focus stroke 6.
- Downsample legibility: Both theta regimes field-check gate pumping and recovery labels and conditional qualifier remain readable at 640 by 360.
- Step detail: Restore the theta branch; attach below-one and above-one regions; draw candidate pumping and recovery timelines; route both through a field-check gate; retain a bidirectional characteristic-time arrow; settle on conditional monitoring choices.
- Why this step is valid: This is valid because Section 3.7 phrases cautious or flexible operations as potential implications tied to interpreted regimes while the paper's characteristic-time direction remains inconsistent.
- Transition bridge: From the two conditional timelines every abstract branch folds back into the original pumping well and observation field.
- Evidence locator: PDF page 9, Section 3.7, practical implications paragraphs
- Input state: Theta regimes and characteristic-time comparisons with their visible claim boundaries
- Operation: Map conditional implications
- Output state: Conditional monitoring pumping and recovery implications without a universal time-direction claim
- Validity basis: Section 3.7 phrases operational consequences as potential strategies tied to interpreted regimes while the paper's characteristic-time statements remain internally mixed.
- What the viewer learns: Management implications are conditional extrapolations that require field evidence and cannot inherit a universal time arrow from theta.
- Minimal on-screen text: if supported here… • verify in the field
- Narration draft: The paper suggests different pumping, monitoring, and recovery strategies across interpreted regimes. These are conditional extrapolations. Site evidence and the unresolved time direction must stay attached.
- Formula: `\theta<1` and `\theta>1`
- Symbol handoff: The two spatial theta regions become branch labels while the central one contour becomes the field-check gate.
- Formula split plan: Keep theta comparison signs and threshold one as separate matched parts above their respective timelines.
- Formula derivation steps: Restore the theta contour; select each side; copy its relation to a branch label; draw candidate timelines; insert the field-check gate; retain the bidirectional time arrow; prevent either branch from becoming automatic.
- Uncertainty shape: The bidirectional time arrow and gated branch widths preserve unresolved direction and conditional scope as visible spread.
- Frame zones: upper title band left and right conditional timelines center field-check gate lower bidirectional time arrow and bottom qualifier band.
- Keep-clear pairs: theta labels versus branch arrows; gate label versus timelines; time arrow versus qualifier; caption versus recovery markers.
- Transition-frame audit: Inspect entry with the theta branch midpoint with growing candidate timelines and settled with both paths gated by field verification.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, theta_branch, left_timeline, right_timeline, field_gate, time_arrow, labels, qualifier], labels=[heading, caption, labels, qualifier], blockers=[theta_branch, left_timeline, right_timeline, field_gate, time_arrow], frame_items=[heading, caption, theta_branch, left_timeline, right_timeline, field_gate, time_arrow, labels, qualifier])
- QA risks: Branches must remain conditional and the field-check gate cannot read as a decorative icon.

### Scene 20: Return to the pumping field

- Source-derived rules: H01, H03, H04, H06, H08, H12, H13, H17, H19, H21
- Narrative beat: return
- Background beat: none
- Method step: none
- Storyboard trigger: Every diagnostic and model comparison must return to the physical pumping test with its evidence boundaries intact.
- Viewer question: What should remain visible when these lag diagnostics are carried back to an aquifer field?
- Visual object: The original pumping-well aquifer and observation field reappear with a relative-preference balance a bounded diagnostic contour conditional-width halos and unresolved bidirectional time arrows.
- Visual antecedent: The gated operational timelines from Scene 19 retain the pumping and recovery rhythm before folding into the field.
- Transformation from previous scene: Both timelines curve back into radial drawdown paths while the field-check gate becomes the observation-well network.
- Motion purpose: Returning every abstraction to the well field resolves because the final frame shows what the method adds and what it cannot replace.
- Motion class: camera-bridge
- Focal object: The pumping well and observation field carrying all four evidence boundaries.
- Salience plan: The physical well field regains highest contrast; diagnostic contour penalties halos and time arrows remain compact secondary annotations.
- Theme tokens: title 44 px body 30 px annotation 24 px focal teal uncertainty ochre warning brick focus stroke 6.
- Downsample legibility: The pumping well observation wells and four boundary phrases remain readable at 640 by 360.
- Step detail: Restore the pumping well; restore observation wells; trace drawdown; overlay the relative-preference balance; overlay the interpolated diagnostic contour; retain conditional-width halos; retain opposing time arrows; end with the field-characterization path still open.
- Why this step is valid: This is valid because the concluding remarks report the paper's three main findings while explicitly calling the lagging model complementary to detailed field investigations.
- Transition bridge: From the conditional timelines the story returns to the original scientific object and holds on its bounded interpretation.
- What the viewer learns: The two lags can earn relative model support and provide bounded diagnostics but they do not deliver physical truth unique mechanism direct observations or a replacement for field work.
- Minimal on-screen text: compare • diagnose • verify in the field
- Narration draft: Back at the wells, the extra lags may earn relative support and reveal bounded diagnostics. The fields are interpolated, the intervals are copula conditional, the time direction is mixed, and field characterization remains essential.
- Formula: none
- Uncertainty shape: Conditional-width halos around the observation supports remain visible beside the interpolated contour.
- Evidence locator: PDF page 9, Section 4, concluding findings and limitations paragraph
- Frame zones: upper title band center pumping field side boundary annotations and lower final claim band.
- Keep-clear pairs: boundary phrases versus wells; contour label versus field line; halos versus observation labels; final claim versus drawdown paths.
- Transition-frame audit: Inspect entry with returning timelines midpoint with the reconstructed field and settled with all boundaries legible around the physical aquifer object.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, final_claim, aquifer, pumping_well, observation_wells, drawdown_paths, criterion_balance, theta_contour, halos, time_arrows, boundary_labels], labels=[heading, final_claim, boundary_labels], blockers=[aquifer, pumping_well, observation_wells, drawdown_paths, criterion_balance, theta_contour, halos, time_arrows], frame_items=[heading, final_claim, aquifer, pumping_well, observation_wells, drawdown_paths, criterion_balance, theta_contour, halos, time_arrows, boundary_labels]) with assert_inside(aquifer, [halos], min_gap=0.08)
- QA risks: Final annotations must not become a checklist slide and the field object must remain visually dominant.
