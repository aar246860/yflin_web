# Analysis of Unconfined Flow Induced by Constant Rate Pumping Based on the Lagging Theory

## Metadata

- Title: Analysis of Unconfined Flow Induced by Constant Rate Pumping Based on the Lagging Theory
- Source artifact: source-artifact.txt
- Audience: groundwater, hydrology, geotechnical, and subsurface-energy researchers
- Story mode: method
- Target duration: 144 seconds
- Rendering target: 1080p
- Visual-direction artifact: visual_direction.toml

## Research Extraction

- Core research question: Can two lag times embedded in Darcy's law represent delayed capillary-fringe drainage during constant-rate pumping and improve unconfined-aquifer parameter estimates?
- Physical or scientific system: A homogeneous anisotropic unconfined aquifer of finite saturated thickness, pumped by a partially penetrating finite-radius well with wellbore storage and observed at radial distances from the well.
- Input data: Constant-rate pumping-test drawdown records from Cape Cod, Massachusetts; Canadian Forces Base Borden, Ontario; and Saint Pardon de Conques, Gironde, together with site geometry and pumping conditions reported for those tests.
- Main method: Introduce flux and drawdown lag times into the free-surface condition, solve the resulting axisymmetric model by Laplace and Weber transforms with numerical inversion, examine normalized sensitivities, and estimate hydraulic and lag parameters by nonlinear least squares.
- Reference or benchmark: Compare predictions and field-data fits against the Neuman, Moench, Tartakovsky-Neuman, and Malama solutions using standard error of estimate and mean error.
- Uncertainty or error treatment: The two lag times are phenomenological parameters rather than direct unsaturated-zone measurements; fitted values vary with observation distance, and the Borden flux-lag trend is an explicit exception to the otherwise near-linear distance relation.
- Main conclusion: The two-lag model fits the three field data sets well, yields specific-yield estimates in laboratory-supported ranges, and attributes stronger drawdown sensitivity to the drawdown lag than to the flux lag.

## Narrative Spine

- Throughline: The paper-specific throughline follows the scientific object as Follow an S-shaped pumping response from its delayed capillary-fringe mechanism, through a two-lag free-surface law, to field-calibrated drawdown curves and distance-dependent lag times.
- Audience starting point: The audience begins from this established scientific context: The audience knows that constant-rate pumping lowers an unconfined water table but may expect drainage to respond instantaneously.
- Stakes: The scientific consequence at stake is that Treating gravity drainage as instantaneous can distort the intermediate-time response and produce anomalously small specific-yield estimates.
- Resolution: The source-grounded resolution of the research tension is that Two distinct lag times make the delayed release visible, remain reducible to established free-surface models, and improve agreement with pumping-test observations.
- Background scope: 3 premises needed to establish the source-grounded research tension
- Method scope: 14 operations needed to derive the paper-specific result

## Background Ledger

| ID | Audience gap or premise | Visible evidence | Why it is needed now | Source or claim boundary | Source locator |
| --- | --- | --- | --- | --- | --- |
| B01 | Measured unconfined-aquifer drawdown commonly forms an S-shaped curve with early, intermediate, and late segments supplied by different storage mechanisms. | A time-drawdown trace bends through three labeled segments as aquifer storage gives way to gravity drainage and later combined release. | The segmented curve is the observable phenomenon that the lagging model must explain. | The segmentation describes constant-rate pumping in an unconfined aquifer, not every pumping configuration. Source anchor terms: measured drawdown; continues. | PDF page 1, Section 1 Introduction |
| B02 | Capillary force retains pore water above a declining water table, so drainage takes time and requires an explicit time lag. | Menisci in large and small pores drain at different suction levels while water remains temporarily stored above the falling water table. | This delayed release supplies the physical rationale for lagging the vertical flux and water-table response. | The model summarizes capillary-fringe behavior phenomenologically rather than resolving a full variably saturated flow field. Source anchor terms: takes time; time lag. | PDF page 2, Section 1 Introduction |
| B03 | Instantaneous complete drainage at the water table can fail to provide an accurate estimate of specific yield. | An instantaneous-drainage model curve misses the delayed segment and points to a lower specific-yield estimate. | Parameter bias turns the drainage mechanism into a practical aquifer-test interpretation problem. | The source states that failure may occur; it does not claim that every instantaneous-drainage fit is inaccurate. Source anchor terms: water; table. | PDF page 4, Section 2.1 Model Description |

## Method Decomposition Ledger

| ID | Visible input state | One operation | Visible output state | Validity basis | Source locator |
| --- | --- | --- | --- | --- | --- |
| M01 | Axisymmetric drawdown in a homogeneous anisotropic unconfined aquifer | Form unconfined flow equation | A radial-vertical groundwater-flow equation for drawdown | The aquifer is treated as homogeneous and anisotropic with radial symmetry around the pumping well. Source anchor terms: drawdown distribution; unconﬁned aquifer. | PDF page 3, Section 2.1 Model Description, Equation 1 |
| M02 | Pumping discharge at a partially penetrating finite-radius well | Apply wellbore boundary condition | An inner flux condition containing wellbore storage | The storage term applies at the pumping well and uses the modeled pumping-well water level. Source anchor terms: equation; represents. | PDF page 4, Section 2.1 Model Description, Equation 3 |
| M03 | Vertical Darcy flux and aquifer drawdown at the free surface | Apply lagged Darcy relation | A free-surface relation with flux lag tau_q and drawdown lag tau_s | tau_q represents rapid capillary-fringe release linked to vertical hydraulic gradient; tau_s represents delayed excess-storage drainage linked to capillary suction. Source anchor terms: lag times; ﬂux and aquifer drawdown. | PDF page 4, Section 2.1 Model Description, Equation 7b |
| M04 | Time-shifted flux and drawdown terms in the lagged free-surface relation | Expand lag relation | A first-order Taylor representation of the delayed relation | Only the first-order Taylor representation is retained. Source anchor terms: Taylor series expansion; ﬁrst‐order representation. | PDF page 4, Section 2.1 Model Description, Equation 8 |
| M05 | First-order lag representation and free-surface mass balance | Derive free-surface equation | A linearized free-surface equation containing tau_q and tau_s | The boundary reduces to the Neuman form when both lag times vanish and to the cited Moench form under its stated parameter correspondence. Source anchor terms: surface; equation. | PDF page 5, Section 2.1 Model Description, Equation 9 |
| M06 | Dimensional drawdown variables geometry conductivities storage terms and lag times | Normalize model variables | A dimensionless pumping model and dimensionless lag parameters | The definitions follow Equation 10 and preserve radial anisotropy and well geometry. Source anchor terms: dimensionless variables; parameters. | PDF page 5, Section 2.2 Dimensionless Solution in Laplace Domain, Equation 10 |
| M07 | Dimensionless radial-vertical equations and boundary conditions | Transform temporal equations | Governing equations represented in the Laplace parameter p | Appendix A defines the Laplace transform and maps first time derivatives to multiplication by p after applying the initial conditions. Source anchor terms: Laplace transform; first derivative. | PDF page 13, Appendix A, Equations (A1)-(A3) |
| M08 | Laplace-domain radial equations with a finite-radius well boundary | Transform radial equations | Drawdown and well-level amplitudes in the Laplace-Weber domain | The Weber transform accommodates cylindrical lower boundaries of Dirichlet Neumann or Robin type. Source anchor terms: Weber transform; boundary condition. | PDF page 13, Appendix A, Equations (A4)-(A6); PDF page 5, Equations (17a)-(17b) |
| M09 | Transformed drawdown solution in Weber space | Transform Weber solution | A radial drawdown integral in the Laplace domain | The inverse Weber expression is evaluated over the transform variable as given in Equation 18. Source anchor terms: inverse Weber transform; drawdown solution. | PDF page 6, Section 2.2 Dimensionless Solution in Laplace Domain, Equation 18 |
| M10 | Radial drawdown solution in the Laplace domain | Transform Laplace solution | Transient drawdown in the time domain | The paper uses the Crump algorithm for numerical Laplace inversion and numerical quadrature for the radial integral. Source anchor terms: time domain; domain. | PDF page 6, Section 2.2 Dimensionless Solution in Laplace Domain, Equation 18 |
| M11 | Transient solution and each hydraulic or lag parameter P_k | Calculate sensitivity coefficients | Dimensionless sensitivity curves X_k for drawdown | The derivative uses a forward finite difference with Delta P_k set to 10^-3 P_k. Source anchor terms: forward ﬁnite difference; forward. | PDF page 7, Section 3.2 Sensitivity Analysis, Equations 25-26 |
| M12 | Four observed drawdown series from the Cape Cod constant-rate pumping test | Fit aquifer parameters | Cape Cod hydraulic parameter estimates with SEE and ME for four observation wells | The five solutions are coupled to the Levenberg-Marquardt algorithm and Table 1 reports Cape Cod estimates and prediction errors. Source anchor terms: aquifer parameters; table. | PDF pages 7-9, Section 3.3 Pumping Test Data Analysis: Cape Cod Site, Table 1 and Figure 4 |
| M13 | Four observed drawdown series from the Canadian Forces Base Borden constant-rate pumping test | Fit Borden parameters | Borden hydraulic and lag parameter estimates with SEE and ME for four piezometers | The five solutions used for Cape Cod are fitted to the digitized Borden records; Table 2 and Figure 5 report estimates and fit behavior, including the early WD1A limitation. Source anchor terms: recorded drawdown data; Cape Cod site. | PDF pages 9-11, Section 3.4 Pumping Test Data Analysis: Borden Site, Table 2 and Figure 5 |
| M14 | Drawdown series from the 10 m and 30 m Saint Pardon de Conques observation wells | Fit Saint Pardon parameters | Saint Pardon hydraulic and lag parameter estimates with SEE and ME for both wells | The estimates and prediction errors are those reported in Table 3; Figure 6 shows the fit differences at 10 m and 30 m. Source anchor terms: estimated parameters; Table 3. | PDF pages 11-12, Section 3.5 Pumping Test Data Analysis: Saint Pardon de Conques Site, Table 3 and Figure 6 |

## Symbol Glossary

| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |

## Scene Table

### Scene 1: Three drawdown segments
- Source-derived rules: H01, H02, H06, H09, H17, H19, H20
- Narrative beat: hook
- Background beat: B01
- Background premise: Measured unconfined-aquifer drawdown commonly forms an S-shaped curve with early, intermediate, and late segments supplied by different storage mechanisms.
- Method step: none
- Storyboard trigger: The source-grounded trigger is that The segmented curve is the observable phenomenon that the lagging model must explain.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is research field response curve: Three-segment time-drawdown curve beside a pumping well cross-section
- Visual antecedent: The preceding visible scientific object is research field response curve: Three-segment time-drawdown curve beside a pumping well cross-section
- Transformation from previous scene: The opening scientific field appears as the response curve is traced into view
- Motion purpose: This motion shows why Reveal the observed temporal structure before introducing a mechanism
- Motion class: `trace`.
- Focal object: The visible scientific object is research field response curve: Three-segment time-drawdown curve beside a pumping well cross-section
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Trace the curve from the first segment through the delayed middle segment to the late segment while the contributing storage regions illuminate in sequence.
- Why this step is valid: This premise is valid because the cited source evidence states A time-drawdown trace bends through three labeled segments as aquifer storage gives way to gravity drainage and later combined release.
- Transition bridge: From the previous visible object to the next state: Hold on the intermediate bend and move upward to the capillary fringe that delays drainage.
- What the viewer learns: The source-backed conclusion is that Measured unconfined-aquifer drawdown commonly forms an S-shaped curve with early, intermediate, and late segments supplied by different storage mechanisms.
- Minimal on-screen text: Three drawdown segments
- Narration draft: Measured unconfined-aquifer drawdown commonly forms an S-shaped curve with early, intermediate, and late segments supplied by different storage mechanisms. The segmentation describes constant-rate pumping in an unconfined aquifer, not every pumping configuration. Source anchor terms: measured drawdown; continues.
- Evidence locator: PDF page 1, Section 1 Introduction
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 2: Drainage is delayed
- Source-derived rules: H03, H04, H06, H12, H13, H17, H19, H20, H21
- Narrative beat: context
- Background beat: B02
- Background premise: Capillary force retains pore water above a declining water table, so drainage takes time and requires an explicit time lag.
- Method step: none
- Storyboard trigger: The source-grounded trigger is that This delayed release supplies the physical rationale for lagging the vertical flux and water-table response.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Falling water table with retained capillary water and pore-scale menisci
- Visual antecedent: The preceding visible scientific object is Three-segment time-drawdown curve beside a pumping well cross-section
- Transformation from previous scene: The previous Three-segment time-drawdown curve beside a pumping well cross-section becomes Falling water table with retained capillary water and pore-scale menisci
- Motion purpose: This motion shows why Make the delayed drainage mechanism spatially concrete
- Motion class: `trace`.
- Focal object: The visible scientific object is Falling water table with retained capillary water and pore-scale menisci
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Lower the water table first, keep water suspended in the capillary fringe, and release it progressively toward the aquifer.
- Why this step is valid: This premise is valid because the cited source evidence states Menisci in large and small pores drain at different suction levels while water remains temporarily stored above the falling water table.
- Transition bridge: From the previous visible object to the next state: Compress the pore-scale delay into two clocks attached to the free surface.
- What the viewer learns: The source-backed conclusion is that Capillary force retains pore water above a declining water table, so drainage takes time and requires an explicit time lag.
- Minimal on-screen text: Drainage is delayed
- Narration draft: Capillary force retains pore water above a declining water table, so drainage takes time and requires an explicit time lag. The model summarizes capillary-fringe behavior phenomenologically rather than resolving a full variably saturated flow field. Source anchor terms: takes time; time lag.
- Evidence locator: PDF page 2, Section 1 Introduction
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 3: Specific yield can be biased
- Source-derived rules: H03, H04, H06, H12, H13, H17, H19, H20, H21
- Narrative beat: tension
- Background beat: B03
- Background premise: Instantaneous complete drainage at the water table can fail to provide an accurate estimate of specific yield.
- Method step: none
- Storyboard trigger: The source-grounded trigger is that Parameter bias turns the drainage mechanism into a practical aquifer-test interpretation problem.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Two competing free-surface responses linked to contrasting specific-yield estimates
- Visual antecedent: The preceding visible scientific object is Falling water table with retained capillary water and pore-scale menisci
- Transformation from previous scene: The previous Falling water table with retained capillary water and pore-scale menisci becomes Two competing free-surface responses linked to contrasting specific-yield estimates
- Motion purpose: This motion shows why Connect a modeling assumption to an estimable hydraulic parameter
- Motion class: `reveal`.
- Focal object: The visible scientific object is Two competing free-surface responses linked to contrasting specific-yield estimates
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Overlay instantaneous and delayed drainage responses, then highlight the specific-yield value associated with the mismatched curve.
- Why this step is valid: This premise is valid because the cited source evidence states An instantaneous-drainage model curve misses the delayed segment and points to a lower specific-yield estimate.
- Transition bridge: From the previous visible object to the next state: Replace the instantaneous free-surface arrow with a lag-aware governing system.
- What the viewer learns: The source-backed conclusion is that Instantaneous complete drainage at the water table can fail to provide an accurate estimate of specific yield.
- Minimal on-screen text: Specific yield can be biased
- Narration draft: Instantaneous complete drainage at the water table can fail to provide an accurate estimate of specific yield. The source states that failure may occur; it does not claim that every instantaneous-drainage fit is inaccurate. Source anchor terms: water; table.
- Evidence locator: PDF page 4, Section 2.1 Model Description
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 4: Axisymmetric aquifer flow
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M01
- Storyboard trigger: The source-grounded trigger is that The previous Two competing free-surface responses linked to contrasting specific-yield estimates exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Cylindrical aquifer domain with radial and vertical derivative axes
- Visual antecedent: The preceding visible scientific object is Two competing free-surface responses linked to contrasting specific-yield estimates
- Transformation from previous scene: The previous Two competing free-surface responses linked to contrasting specific-yield estimates becomes Cylindrical aquifer domain with radial and vertical derivative axes
- Motion purpose: This motion shows why Establish the field equation that all later boundary physics constrain
- Motion class: `reveal`.
- Focal object: The visible scientific object is Cylindrical aquifer domain with radial and vertical derivative axes
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Map radial and vertical conductivity terms onto the aquifer cross-section and expose the drawdown field inside it.
- Why this step is valid: This step is valid because The aquifer is treated as homogeneous and anisotropic with radial symmetry around the pumping well. Source anchor terms: drawdown distribution; unconﬁned aquifer.
- Transition bridge: From the previous visible object to the next state: Move from the aquifer interior to the finite-radius pumping boundary.
- Input state: Axisymmetric drawdown in a homogeneous anisotropic unconfined aquifer
- Operation: Form unconfined flow equation
- Output state: A radial-vertical groundwater-flow equation for drawdown
- Validity basis: The aquifer is treated as homogeneous and anisotropic with radial symmetry around the pumping well. Source anchor terms: drawdown distribution; unconﬁned aquifer.
- What the viewer learns: The source-backed conclusion is that The A radial-vertical groundwater-flow equation for drawdown follows from the stated operation and validity basis.
- Minimal on-screen text: Axisymmetric aquifer flow
- Narration draft: The A radial-vertical groundwater-flow equation for drawdown follows from the stated operation and validity basis. The aquifer is treated as homogeneous and anisotropic with radial symmetry around the pumping well. Source anchor terms: drawdown distribution; unconﬁned aquifer.
- Evidence locator: PDF page 3, Section 2.1 Model Description, Equation 1
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 5: Include wellbore storage
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M02
- Storyboard trigger: The source-grounded trigger is that The previous Cylindrical aquifer domain with radial and vertical derivative axes exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Pumping-well cylinder with an inflow arrow and a changing internal water column
- Visual antecedent: The preceding visible scientific object is Cylindrical aquifer domain with radial and vertical derivative axes
- Transformation from previous scene: The previous Cylindrical aquifer domain with radial and vertical derivative axes becomes Pumping-well cylinder with an inflow arrow and a changing internal water column
- Motion purpose: This motion shows why Separate aquifer inflow from water released by the well casing
- Motion class: `reveal`.
- Focal object: The visible scientific object is Pumping-well cylinder with an inflow arrow and a changing internal water column
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Route part of the imposed discharge through the aquifer wall and the remainder through the changing well water level.
- Why this step is valid: This step is valid because The storage term applies at the pumping well and uses the modeled pumping-well water level. Source anchor terms: equation; represents.
- Transition bridge: From the previous visible object to the next state: Lift the view from the well screen to the moving free surface.
- Input state: Pumping discharge at a partially penetrating finite-radius well
- Operation: Apply wellbore boundary condition
- Output state: An inner flux condition containing wellbore storage
- Validity basis: The storage term applies at the pumping well and uses the modeled pumping-well water level. Source anchor terms: equation; represents.
- What the viewer learns: The source-backed conclusion is that The An inner flux condition containing wellbore storage follows from the stated operation and validity basis.
- Minimal on-screen text: Include wellbore storage
- Narration draft: The An inner flux condition containing wellbore storage follows from the stated operation and validity basis. The storage term applies at the pumping well and uses the modeled pumping-well water level. Source anchor terms: equation; represents.
- Evidence locator: PDF page 4, Section 2.1 Model Description, Equation 3
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 6: Two lag times
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M03
- Storyboard trigger: The source-grounded trigger is that The previous Pumping-well cylinder with an inflow arrow and a changing internal water column exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Free surface carrying separate flux and drawdown clock markers
- Visual antecedent: The preceding visible scientific object is Pumping-well cylinder with an inflow arrow and a changing internal water column
- Transformation from previous scene: The previous Pumping-well cylinder with an inflow arrow and a changing internal water column becomes Free surface carrying separate flux and drawdown clock markers
- Motion purpose: This motion shows why Assign distinct physical roles to the two delay parameters
- Motion class: `reveal`.
- Focal object: The visible scientific object is Free surface carrying separate flux and drawdown clock markers
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Offset the vertical-flux arrow by tau_q and the free-surface displacement by tau_s on a common time axis.
- Why this step is valid: This step is valid because tau_q represents rapid capillary-fringe release linked to vertical hydraulic gradient; tau_s represents delayed excess-storage drainage linked to capillary suction. Source anchor terms: lag times; ﬂux and aquifer drawdown.
- Transition bridge: From the previous visible object to the next state: Expand the delayed quantities into a tractable first-order relation.
- Input state: Vertical Darcy flux and aquifer drawdown at the free surface
- Operation: Apply lagged Darcy relation
- Output state: A free-surface relation with flux lag tau_q and drawdown lag tau_s
- Validity basis: tau_q represents rapid capillary-fringe release linked to vertical hydraulic gradient; tau_s represents delayed excess-storage drainage linked to capillary suction. Source anchor terms: lag times; ﬂux and aquifer drawdown.
- What the viewer learns: The source-backed conclusion is that The A free-surface relation with flux lag tau_q and drawdown lag tau_s follows from the stated operation and validity basis.
- Minimal on-screen text: Two lag times
- Narration draft: The A free-surface relation with flux lag tau_q and drawdown lag tau_s follows from the stated operation and validity basis. tau_q represents rapid capillary-fringe release linked to vertical hydraulic gradient; tau_s represents delayed excess-storage drainage linked to capillary suction. Source anchor terms: lag times; ﬂux and aquifer drawdown.
- Evidence locator: PDF page 4, Section 2.1 Model Description, Equation 7b
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 7: First-order lag expansion
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M04
- Storyboard trigger: The source-grounded trigger is that The previous Free surface carrying separate flux and drawdown clock markers exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Shifted time traces collapsing into value and first-derivative terms
- Visual antecedent: The preceding visible scientific object is Free surface carrying separate flux and drawdown clock markers
- Transformation from previous scene: The previous Free surface carrying separate flux and drawdown clock markers becomes Shifted time traces collapsing into value and first-derivative terms
- Motion purpose: This motion shows why Turn conceptual delays into solvable local terms
- Motion class: `reveal`.
- Focal object: The visible scientific object is Shifted time traces collapsing into value and first-derivative terms
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Replace each shifted quantity with its present value plus its lag-weighted temporal derivative.
- Why this step is valid: This step is valid because Only the first-order Taylor representation is retained. Source anchor terms: Taylor series expansion; ﬁrst‐order representation.
- Transition bridge: From the previous visible object to the next state: Insert the first-order lag law into the water-table kinematic condition.
- Input state: Time-shifted flux and drawdown terms in the lagged free-surface relation
- Operation: Expand lag relation
- Output state: A first-order Taylor representation of the delayed relation
- Validity basis: Only the first-order Taylor representation is retained. Source anchor terms: Taylor series expansion; ﬁrst‐order representation.
- What the viewer learns: The source-backed conclusion is that The A first-order Taylor representation of the delayed relation follows from the stated operation and validity basis.
- Minimal on-screen text: First-order lag expansion
- Narration draft: The A first-order Taylor representation of the delayed relation follows from the stated operation and validity basis. Only the first-order Taylor representation is retained. Source anchor terms: Taylor series expansion; ﬁrst‐order representation.
- Evidence locator: PDF page 4, Section 2.1 Model Description, Equation 8
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 8: Lag-aware free surface
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M05
- Storyboard trigger: The source-grounded trigger is that The previous Shifted time traces collapsing into value and first-derivative terms exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Water-table boundary equation with two highlighted lag coefficients
- Visual antecedent: The preceding visible scientific object is Shifted time traces collapsing into value and first-derivative terms
- Transformation from previous scene: The previous Shifted time traces collapsing into value and first-derivative terms becomes Water-table boundary equation with two highlighted lag coefficients
- Motion purpose: This motion shows why Show where the lag physics enters the aquifer model
- Motion class: `reveal`.
- Focal object: The visible scientific object is Water-table boundary equation with two highlighted lag coefficients
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Substitute the expanded lag law into the free-surface balance and retain the resulting linear boundary terms.
- Why this step is valid: This step is valid because The boundary reduces to the Neuman form when both lag times vanish and to the cited Moench form under its stated parameter correspondence. Source anchor terms: surface; equation.
- Transition bridge: From the previous visible object to the next state: Rescale the physical domain and parameters for transform solution.
- Input state: First-order lag representation and free-surface mass balance
- Operation: Derive free-surface equation
- Output state: A linearized free-surface equation containing tau_q and tau_s
- Validity basis: The boundary reduces to the Neuman form when both lag times vanish and to the cited Moench form under its stated parameter correspondence. Source anchor terms: surface; equation.
- What the viewer learns: The source-backed conclusion is that The A linearized free-surface equation containing tau_q and tau_s follows from the stated operation and validity basis.
- Minimal on-screen text: Lag-aware free surface
- Narration draft: The A linearized free-surface equation containing tau_q and tau_s follows from the stated operation and validity basis. The boundary reduces to the Neuman form when both lag times vanish and to the cited Moench form under its stated parameter correspondence. Source anchor terms: surface; equation.
- Evidence locator: PDF page 5, Section 2.1 Model Description, Equation 9
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 9: Dimensionless system
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M06
- Storyboard trigger: The source-grounded trigger is that The previous Water-table boundary equation with two highlighted lag coefficients exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Dimensional symbols passing through a scaling frame into dimensionless symbols
- Visual antecedent: The preceding visible scientific object is Water-table boundary equation with two highlighted lag coefficients
- Transformation from previous scene: The previous Water-table boundary equation with two highlighted lag coefficients becomes Dimensional symbols passing through a scaling frame into dimensionless symbols
- Motion purpose: This motion shows why Consolidate scales before applying integral transforms
- Motion class: `reveal`.
- Focal object: The visible scientific object is Dimensional symbols passing through a scaling frame into dimensionless symbols
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Scale drawdown, radius, depth, time, conductivities, storage, and both lag times according to Equation 10.
- Why this step is valid: This step is valid because The definitions follow Equation 10 and preserve radial anisotropy and well geometry. Source anchor terms: dimensionless variables; parameters.
- Transition bridge: From the previous visible object to the next state: Send the dimensionless equations into Laplace-time and Weber-radius domains.
- Input state: Dimensional drawdown variables geometry conductivities storage terms and lag times
- Operation: Normalize model variables
- Output state: A dimensionless pumping model and dimensionless lag parameters
- Validity basis: The definitions follow Equation 10 and preserve radial anisotropy and well geometry. Source anchor terms: dimensionless variables; parameters.
- What the viewer learns: The source-backed conclusion is that The A dimensionless pumping model and dimensionless lag parameters follows from the stated operation and validity basis.
- Minimal on-screen text: Dimensionless system
- Narration draft: The A dimensionless pumping model and dimensionless lag parameters follows from the stated operation and validity basis. The definitions follow Equation 10 and preserve radial anisotropy and well geometry. Source anchor terms: dimensionless variables; parameters.
- Evidence locator: PDF page 5, Section 2.2 Dimensionless Solution in Laplace Domain, Equation 10
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 10: Laplace p-domain
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M07
- Storyboard trigger: The source-grounded trigger is that The previous Dimensional symbols passing through a scaling frame into dimensionless symbols exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Time-dependent equations folding onto a p-axis
- Visual antecedent: The preceding visible scientific object is Dimensional symbols passing through a scaling frame into dimensionless symbols
- Transformation from previous scene: The previous Dimensional symbols passing through a scaling frame into dimensionless symbols becomes Time-dependent equations folding onto a p-axis
- Motion purpose: This motion shows why Isolate the temporal transform used in the semianalytical solution
- Motion class: `trace`.
- Focal object: The visible scientific object is Time-dependent equations folding onto a p-axis
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Transform each time derivative into the Laplace parameter p.
- Why this step is valid: This step is valid because Appendix A defines the Laplace transform and maps first time derivatives to multiplication by p after applying the initial conditions. Source anchor terms: Laplace transform; first derivative.
- Transition bridge: From the previous visible object to the next state: The Laplace-domain equations still retain finite-radius radial structure.
- Input state: Dimensionless radial-vertical equations and boundary conditions
- Operation: Transform temporal equations
- Output state: Governing equations represented in the Laplace parameter p
- Validity basis: Appendix A defines the Laplace transform and maps first time derivatives to multiplication by p after applying the initial conditions. Source anchor terms: Laplace transform; first derivative.
- What the viewer learns: The source-backed conclusion is that The Governing equations represented in the Laplace parameter p follows from the stated operation and validity basis.
- Minimal on-screen text: Laplace p-domain
- Narration draft: The Governing equations represented in the Laplace parameter p follows from the stated operation and validity basis. Appendix A defines the Laplace transform and maps first time derivatives to multiplication by p after applying the initial conditions. Source anchor terms: Laplace transform; first derivative.
- Evidence locator: PDF page 13, Appendix A, Equations (A1)-(A3)
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 11: Weber a-domain
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M08
- Storyboard trigger: The source-grounded trigger is that The previous Time-dependent equations folding onto a p-axis exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Finite-radius radial profiles folding onto Weber parameter a
- Visual antecedent: The preceding visible scientific object is Time-dependent equations folding onto a p-axis
- Transformation from previous scene: The previous Time-dependent equations folding onto a p-axis becomes Finite-radius radial profiles folding onto Weber parameter a
- Motion purpose: This motion shows why Map cylindrical radius independently of the preceding time transform
- Motion class: `trace`.
- Focal object: The visible scientific object is Finite-radius radial profiles folding onto Weber parameter a
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Transform the radial equations with the Weber kernel.
- Why this step is valid: This step is valid because The Weber transform accommodates cylindrical lower boundaries of Dirichlet Neumann or Robin type. Source anchor terms: Weber transform; boundary condition.
- Transition bridge: From the previous visible object to the next state: The solved amplitudes are ready for inverse radial transformation.
- Input state: Laplace-domain radial equations with a finite-radius well boundary
- Operation: Transform radial equations
- Output state: Drawdown and well-level amplitudes in the Laplace-Weber domain
- Validity basis: The Weber transform accommodates cylindrical lower boundaries of Dirichlet Neumann or Robin type. Source anchor terms: Weber transform; boundary condition.
- What the viewer learns: The source-backed conclusion is that The Drawdown and well-level amplitudes in the Laplace-Weber domain follows from the stated operation and validity basis.
- Minimal on-screen text: Weber a-domain
- Narration draft: The Drawdown and well-level amplitudes in the Laplace-Weber domain follows from the stated operation and validity basis. The Weber transform accommodates cylindrical lower boundaries of Dirichlet Neumann or Robin type. Source anchor terms: Weber transform; boundary condition.
- Evidence locator: PDF page 13, Appendix A, Equations (A4)-(A6); PDF page 5, Equations (17a)-(17b)
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 12: Recover radial drawdown
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M09
- Storyboard trigger: The source-grounded trigger is that The previous Finite-radius radial profiles folding onto Weber parameter a exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Weber spectrum integrating back into concentric radial drawdown rings
- Visual antecedent: The preceding visible scientific object is Finite-radius radial profiles folding onto Weber parameter a
- Transformation from previous scene: The previous Finite-radius radial profiles folding onto Weber parameter a becomes Weber spectrum integrating back into concentric radial drawdown rings
- Motion purpose: This motion shows why Recover spatial drawdown before recovering physical time
- Motion class: `trace`.
- Focal object: The visible scientific object is Weber spectrum integrating back into concentric radial drawdown rings
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Integrate the transformed amplitudes against the Weber kernel to restore radial position.
- Why this step is valid: This step is valid because The inverse Weber expression is evaluated over the transform variable as given in Equation 18. Source anchor terms: inverse Weber transform; drawdown solution.
- Transition bridge: From the previous visible object to the next state: Carry the radial solution into numerical inversion of the remaining Laplace coordinate.
- Input state: Transformed drawdown solution in Weber space
- Operation: Transform Weber solution
- Output state: A radial drawdown integral in the Laplace domain
- Validity basis: The inverse Weber expression is evaluated over the transform variable as given in Equation 18. Source anchor terms: inverse Weber transform; drawdown solution.
- What the viewer learns: The source-backed conclusion is that The A radial drawdown integral in the Laplace domain follows from the stated operation and validity basis.
- Minimal on-screen text: Recover radial drawdown
- Narration draft: The A radial drawdown integral in the Laplace domain follows from the stated operation and validity basis. The inverse Weber expression is evaluated over the transform variable as given in Equation 18. Source anchor terms: inverse Weber transform; drawdown solution.
- Evidence locator: PDF page 6, Section 2.2 Dimensionless Solution in Laplace Domain, Equation 18
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 13: Transient drawdown
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M10
- Storyboard trigger: The source-grounded trigger is that The previous Weber spectrum integrating back into concentric radial drawdown rings exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Laplace-domain response resolving into a transient time-drawdown curve
- Visual antecedent: The preceding visible scientific object is Weber spectrum integrating back into concentric radial drawdown rings
- Transformation from previous scene: The previous Weber spectrum integrating back into concentric radial drawdown rings becomes Laplace-domain response resolving into a transient time-drawdown curve
- Motion purpose: This motion shows why Return the semianalytical solution to the observable time axis
- Motion class: `trace`.
- Focal object: The visible scientific object is Laplace-domain response resolving into a transient time-drawdown curve
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Apply Crump inversion to each observation location and reveal the resulting temporal response.
- Why this step is valid: This step is valid because The paper uses the Crump algorithm for numerical Laplace inversion and numerical quadrature for the radial integral. Source anchor terms: time domain; domain.
- Transition bridge: From the previous visible object to the next state: Perturb each parameter around the recovered solution to inspect response sensitivity.
- Input state: Radial drawdown solution in the Laplace domain
- Operation: Transform Laplace solution
- Output state: Transient drawdown in the time domain
- Validity basis: The paper uses the Crump algorithm for numerical Laplace inversion and numerical quadrature for the radial integral. Source anchor terms: time domain; domain.
- What the viewer learns: The source-backed conclusion is that The Transient drawdown in the time domain follows from the stated operation and validity basis.
- Minimal on-screen text: Transient drawdown
- Narration draft: The Transient drawdown in the time domain follows from the stated operation and validity basis. The paper uses the Crump algorithm for numerical Laplace inversion and numerical quadrature for the radial integral. Source anchor terms: time domain; domain.
- Evidence locator: PDF page 6, Section 2.2 Dimensionless Solution in Laplace Domain, Equation 18
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 14: Normalized sensitivity
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M11
- Storyboard trigger: The source-grounded trigger is that The previous Laplace-domain response resolving into a transient time-drawdown curve exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Parameter perturbation controls feeding a family of normalized sensitivity curves
- Visual antecedent: The preceding visible scientific object is Laplace-domain response resolving into a transient time-drawdown curve
- Transformation from previous scene: The previous Laplace-domain response resolving into a transient time-drawdown curve becomes Parameter perturbation controls feeding a family of normalized sensitivity curves
- Motion purpose: This motion shows why Rank which parameters most strongly alter temporal drawdown
- Motion class: `trace`.
- Focal object: The visible scientific object is Parameter perturbation controls feeding a family of normalized sensitivity curves
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Perturb one parameter by 10^-3 of its value, evaluate the drawdown difference, and scale the derivative by that parameter.
- Why this step is valid: This step is valid because The derivative uses a forward finite difference with Delta P_k set to 10^-3 P_k. Source anchor terms: forward ﬁnite difference; forward.
- Transition bridge: From the previous visible object to the next state: Use the sensitivity-informed model to estimate parameters from field curves.
- Input state: Transient solution and each hydraulic or lag parameter P_k
- Operation: Calculate sensitivity coefficients
- Output state: Dimensionless sensitivity curves X_k for drawdown
- Validity basis: The derivative uses a forward finite difference with Delta P_k set to 10^-3 P_k. Source anchor terms: forward ﬁnite difference; forward.
- What the viewer learns: The source-backed conclusion is that The Dimensionless sensitivity curves X_k for drawdown follows from the stated operation and validity basis.
- Minimal on-screen text: Normalized sensitivity
- Narration draft: The Dimensionless sensitivity curves X_k for drawdown follows from the stated operation and validity basis. The derivative uses a forward finite difference with Delta P_k set to 10^-3 P_k. Source anchor terms: forward ﬁnite difference; forward.
- Evidence locator: PDF page 7, Section 3.2 Sensitivity Analysis, Equations 25-26
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 15: Cape Cod field test
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M12
- Storyboard trigger: The source-grounded trigger is that The previous Parameter perturbation controls feeding a family of normalized sensitivity curves exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is One stacked Cape Cod log-log plot with four observation-well traces and five fitted model families
- Visual antecedent: The preceding visible scientific object is Parameter perturbation controls feeding a family of normalized sensitivity curves
- Transformation from previous scene: The previous Parameter perturbation controls feeding a family of normalized sensitivity curves becomes One stacked Cape Cod log-log plot with four observation-well traces and five fitted model families
- Motion purpose: This motion shows why Test whether the lagged model explains the Cape Cod pumping response
- Motion class: `reveal`.
- Focal object: The visible scientific object is One stacked Cape Cod log-log plot with four observation-well traces and five fitted model families
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Fit the five solutions to the four Cape Cod observation-well series.
- Why this step is valid: This step is valid because The five solutions are coupled to the Levenberg-Marquardt algorithm and Table 1 reports Cape Cod estimates and prediction errors. Source anchor terms: aquifer parameters; table.
- Transition bridge: From the previous visible object to the next state: The same five-solution fit is applied independently to the Borden observations.
- Input state: Four observed drawdown series from the Cape Cod constant-rate pumping test
- Operation: Fit aquifer parameters
- Output state: Cape Cod hydraulic parameter estimates with SEE and ME for four observation wells
- Validity basis: The five solutions are coupled to the Levenberg-Marquardt algorithm and Table 1 reports Cape Cod estimates and prediction errors. Source anchor terms: aquifer parameters; table.
- What the viewer learns: The source-backed conclusion is that The Cape Cod hydraulic parameter estimates with SEE and ME for four observation wells follows from the stated operation and validity basis.
- Minimal on-screen text: Cape Cod field test
- Narration draft: The Cape Cod hydraulic parameter estimates with SEE and ME for four observation wells follows from the stated operation and validity basis. The five solutions are coupled to the Levenberg-Marquardt algorithm and Table 1 reports Cape Cod estimates and prediction errors. Source anchor terms: aquifer parameters; table.
- Evidence locator: PDF pages 7-9, Section 3.3 Pumping Test Data Analysis: Cape Cod Site, Table 1 and Figure 4
- Frame zones: upper title band; center scientific-object field; lower caption band
- Uncertainty shape: a visible envelope formed by the spread among the five fitted model families around each Cape Cod observation-well trace.
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 16: Borden field test
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M13
- Storyboard trigger: The source-grounded trigger is that The previous stacked Cape Cod comparison exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is One stacked Borden log-log plot with four piezometer traces and five fitted model families
- Visual antecedent: The preceding visible scientific object is One stacked Cape Cod log-log plot with four observation-well traces and five fitted model families
- Transformation from previous scene: The previous stacked Cape Cod comparison becomes One stacked Borden log-log plot with four piezometer traces and five fitted model families
- Motion purpose: This motion shows why Estimate the Borden aquifer and lag parameters as an independent field operation.
- Motion class: `reveal`.
- Focal object: The visible scientific object is One stacked Borden log-log plot with four piezometer traces and five fitted model families
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Fit the five solutions to WD1A, WD1B, WD2A, and WD4A.
- Why this step is valid: This step is valid because The five solutions used for Cape Cod are fitted to the digitized Borden records; Table 2 and Figure 5 report estimates and fit behavior, including the early WD1A limitation. Source anchor terms: recorded drawdown data; Cape Cod site.
- Transition bridge: From the previous visible object to the next state: A separate two-well fit owns the Saint Pardon evidence.
- Input state: Four observed drawdown series from the Canadian Forces Base Borden constant-rate pumping test
- Operation: Fit Borden parameters
- Output state: Borden hydraulic and lag parameter estimates with SEE and ME for four piezometers
- Validity basis: The five solutions used for Cape Cod are fitted to the digitized Borden records; Table 2 and Figure 5 report estimates and fit behavior, including the early WD1A limitation. Source anchor terms: recorded drawdown data; Cape Cod site.
- What the viewer learns: The source-backed conclusion is that The Borden hydraulic and lag parameter estimates with SEE and ME for four piezometers follows from the stated operation and validity basis.
- Minimal on-screen text: Borden field test
- Narration draft: The Borden hydraulic and lag parameter estimates with SEE and ME for four piezometers follows from the stated operation and validity basis. The five solutions used for Cape Cod are fitted to the digitized Borden records; Table 2 and Figure 5 report estimates and fit behavior, including the early WD1A limitation. Source anchor terms: recorded drawdown data; Cape Cod site.
- Evidence locator: PDF pages 9-11, Section 3.4 Pumping Test Data Analysis: Borden Site, Table 2 and Figure 5
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 17: Saint Pardon field test
- Source-derived rules: H04, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: revelation
- Background beat: none
- Method step: M14
- Storyboard trigger: The source-grounded trigger is that The previous stacked Borden comparison exposes the need for this source-grounded operation.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is One stacked Saint Pardon log-log plot with 10 m and 30 m traces and five fitted model families
- Visual antecedent: The preceding visible scientific object is One stacked Borden log-log plot with four piezometer traces and five fitted model families
- Transformation from previous scene: The previous stacked Borden comparison becomes One stacked Saint Pardon log-log plot with 10 m and 30 m traces and five fitted model families
- Motion purpose: This motion shows why Estimate the Saint Pardon aquifer and lag parameters as its own field operation.
- Motion class: `reveal`.
- Focal object: The visible scientific object is One stacked Saint Pardon log-log plot with 10 m and 30 m traces and five fitted model families
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Fit the five solutions independently to the 10 m and 30 m records.
- Why this step is valid: This step is valid because The estimates and prediction errors are those reported in Table 3; Figure 6 shows the fit differences at 10 m and 30 m. Source anchor terms: estimated parameters; Table 3.
- Transition bridge: From the previous visible object to the next state: The Cape Cod, Borden, and Saint Pardon fit outputs now return together to the field aquifers.
- Input state: Drawdown series from the 10 m and 30 m Saint Pardon de Conques observation wells
- Operation: Fit Saint Pardon parameters
- Output state: Saint Pardon hydraulic and lag parameter estimates with SEE and ME for both wells
- Validity basis: The estimates and prediction errors are those reported in Table 3; Figure 6 shows the fit differences at 10 m and 30 m. Source anchor terms: estimated parameters; Table 3.
- Aha object: the source-backed Saint Pardon hydraulic and lag parameter estimates with SEE and ME for both wells becomes the central visible relation
- What the viewer learns: The source-backed conclusion is that The Saint Pardon hydraulic and lag parameter estimates with SEE and ME for both wells follows from the stated operation and validity basis.
- Minimal on-screen text: Saint Pardon field test
- Narration draft: The Saint Pardon hydraulic and lag parameter estimates with SEE and ME for both wells follows from the stated operation and validity basis. The estimates and prediction errors are those reported in Table 3; Figure 6 shows the fit differences at 10 m and 30 m. Source anchor terms: estimated parameters; Table 3.
- Evidence locator: PDF pages 11-12, Section 3.5 Pumping Test Data Analysis: Saint Pardon de Conques Site, Table 3 and Figure 6
- Frame zones: upper title band; center scientific-object field; lower caption band
- Uncertainty shape: a visible shaded band marks the model-curve envelope; its width is greater at early time at 30 m and narrow at 10 m where the fitted model families nearly coincide.
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff

### Scene 18: Delayed drainage fits the field response
- Source-derived rules: H01, H06, H08, H12, H13, H17, H21
- Narrative beat: return
- Background beat: none
- Method step: none
- Storyboard trigger: The source-grounded trigger is that The completed method now has to return to the original scientific question and its claim boundary.
- Viewer question: What source-backed change resolves the present research tension?
- Visual object: The visible scientific object is Cape Cod, Borden, and Saint Pardon field drawdown panels with their independently fitted present-solution curves and specific-yield estimates
- Visual antecedent: The preceding visible scientific object is One stacked Saint Pardon log-log plot with 10 m and 30 m traces and five fitted model families
- Transformation from previous scene: The previous stacked Saint Pardon comparison becomes Cape Cod, Borden, and Saint Pardon field drawdown panels with their independently fitted present-solution curves and specific-yield estimates
- Motion purpose: This motion shows why the source-grounded scientific relation advances the visible reasoning
- Motion class: `reveal`.
- Focal object: The visible scientific object is Cape Cod, Borden, and Saint Pardon field drawdown panels with their independently fitted present-solution curves and specific-yield estimates
- Salience plan: The active scientific object carries focus contrast; retained context uses secondary contrast and thinner strokes.
- Theme tokens: title 44 px, body 30 px, annotation 24 px, math 38 px, focal teal, warning red, reference gold, frame margin 0.45.
- Downsample legibility: The focal geometry, formula terms, and essential labels remain readable at 375 px phone width.
- Step detail: The visible sequence is: Show the cited scientific object; preserve its source-defined relation; carry that relation into the next visible state.
- Why this step is valid: This premise is valid because the cited source evidence states The return consumes only the Cape Cod, Borden, and Saint Pardon fit outputs; it remains conditional on the homogeneous axisymmetric model, linearized free-surface treatment, selected comparison solutions, digitized records, and site-specific fit limitations.
- Transition bridge: From the previous visible object to the next state: the current source-grounded state continues the preceding scientific relation
- What the viewer learns: The source-backed conclusion is that Across the three owned site-fit operations, the present two-lag solution gives very good fits to observed drawdown and estimates specific yield within the cited laboratory-supported ranges.
- Minimal on-screen text: Delayed drainage fits the field response
- Narration draft: Across the three owned site-fit operations, the present two-lag solution gives very good fits to observed drawdown and estimates specific yield within the cited laboratory-supported ranges. The return consumes only the Cape Cod, Borden, and Saint Pardon fit outputs; it remains conditional on the homogeneous axisymmetric model, linearized free-surface treatment, selected comparison solutions, digitized records, and site-specific fit limitations.
- Evidence locator: PDF page 13, Section 4 Concluding Remarks, finding 4
- Frame zones: upper title band; center scientific-object field; lower caption band
- Keep-clear pairs: title versus scientific object; caption versus data marks
- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation
- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])
- Formula: none
- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff
