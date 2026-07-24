# Lagging Theory for Periodic Hydraulic Head Signals in Aquifers

## Metadata

- Title: Lagging Theory for Periodic Hydraulic Head Signals in Aquifers
- Source artifact: source-artifact.txt
- Audience: groundwater researchers, practitioners, and technically curious collaborators
- Story mode: method
- Target duration: 126 seconds
- Rendering target: 1080p
- Visual-direction artifact: visual_direction.toml

## Research Extraction

- Core research question: Can a causal two-lag Darcy relation reconcile hydraulic diffusivities inferred from periodic-head amplitude attenuation and phase shift?
- Physical or scientific system: One-dimensional periodic head propagation from a river, coast, or recharge boundary into an aquifer represented by a field-scale memory law.
- Input data: Multi-frequency boundary-stage and groundwater-head observations along transects at Tuolumne Meadows in California and the Meghna River in Bangladesh.
- Main method: Derive a harmonic solution of the two-lag groundwater-flow equation, estimate field transfer functions, fit amplitude and phase jointly, and propagate measurement uncertainty through repeated inversion.
- Reference or benchmark: Classical groundwater diffusion, numerical frequency-domain solutions, Akaike Information Criterion, independent hydraulic-property ranges, and Morris global sensitivity.
- Uncertainty or error treatment: Delete-one-block jackknife errors weight the inversion; 5000 Gaussian amplitude-phase realizations are refitted, filtered, and summarized by ensemble means and one-standard-deviation intervals.
- Main conclusion: The two-lag model reconciles amplitude and phase at both field sites with plausible diffusivities, but the lag parameters remain field-scale effective descriptors rather than unique microscopic mechanisms.

## Narrative Spine

- Throughline: Follow one periodic groundwater wave as its diminishing envelope and moving crest become two measurements, two apparent diffusivities, a causal memory law, and finally a joint field interpretation.
- Audience starting point: A periodic river or recharge signal becomes smaller and later farther into an aquifer.
- Stakes: Classical diffusion forces attenuation and phase shift to imply one diffusivity even when the two observations disagree.
- Resolution: The two-lag relation separates flux adjustment from head equilibration, fits both signatures jointly, and states when the added structure is warranted.
- Background scope: 3 premises needed to establish the periodic-head interpretation problem
- Method scope: 14 operations needed to derive and test the two-lag interpretation

## Background Ledger

| ID | Audience gap or premise | Visible evidence | Why it is needed now | Source or claim boundary | Source locator |
| --- | --- | --- | --- | --- | --- |
| B01 | A periodic boundary signal attenuates and accumulates phase as it propagates through an aquifer. | One sinusoidal head wave is copied at successive wells with a smaller envelope and a later crest. | These are the two observables used throughout the paper. | The analytical setting is one-dimensional harmonic propagation from a constrained boundary. | PDF pages 2-4, Sections 1 and 2.3, Equations 8-15 |
| B02 | Classical groundwater diffusion can produce inconsistent diffusivities when amplitude and phase are inverted separately. | The same wave feeds two classical diffusivity gauges that separate. | This mismatch is the paper's central diagnostic problem. | A mismatch can reflect model simplification or data limitations and is not proof of one unique mechanism. | PDF pages 2 and 5, Sections 1 and 2.4, Equations 20-21 |
| B03 | The two lag parameters describe causal field-scale memory rather than a literal horizontal shift of a signal. | Past gradients fade into present flux while two clocks deform attenuation and phase frequency-dependently. | The physical interpretation must be established before writing the local constitutive law. | Fitted lags do not uniquely identify a microscopic heterogeneity mechanism. | PDF page 3, Section 2.1, Equations 2-4 |

## Method Decomposition Ledger

| ID | Visible input state | One operation | Visible output state | Validity basis | Source locator |
| --- | --- | --- | --- | --- | --- |
| M01 | A time-ordered history of hydraulic gradients | Integrate gradient history | Present Darcy flux assembled by a causal memory kernel | The kernel uses only past gradients and integrates to the effective hydraulic conductivity. | PDF page 3, Section 2.1, Equations 2-3 |
| M02 | A causal field-scale memory relation | Form the paper's two-channel two-lag local representation | A local constitutive law containing tau_q and tau_h | Equation 4 is the selected local two-lag constitutive form; no exponential kernel is specified. | PDF pages 3-4, Section 2.1, Equation 4 |
| M03 | The local two-lag constitutive law plus continuity | Combine constitutive continuity | A lagging groundwater-flow equation for hydraulic head | Mass conservation remains at present time while the constitutive relation carries memory. | PDF page 4, Section 2.2, Equations 5-7 |
| M04 | The lagging head equation under sinusoidal boundary forcing | Solve harmonic response | A decaying complex wave with real attenuation alpha and positive phase-lag gradient beta | The decaying branch is lambda equal to minus alpha minus i beta, with beta equal to the magnitude of its imaginary part. | PDF page 4, Section 2.3, Equations 8-15 |
| M05 | The attenuation alpha and phase gradient beta | Calculate mismatch ratio | Apparent diffusivities D_A and D_phi plus eta equal to alpha squared over beta squared | Classical amplitude and phase inversions are applied to the same lagging response. | PDF page 5, Section 2.4, Equations 20-21 |
| M06 | Boundary and observation-well head spectra | Calculate transfer function | Frequency-specific observed amplitude ratios and phase shifts | The river-well cross-spectrum divided by the boundary autospectrum defines the complex transfer function. | PDF page 5, Section 2.6, Equations 26-27 |
| M07 | Coherent multi-frequency amplitude-phase observations | Fit lagging parameters | Joint estimates of diffusivity tau_q and tau_h | The weighted least-squares objective uses the reported amplitude and phase errors. | PDF page 10, Appendix B, Equation B.1 |
| M08 | Weighted residuals from classical and lagging fits | Compare model information | An AIC difference that penalizes the two additional lag parameters | AIC balances fit improvement against parameter count using the whitened residual sum of squares. | PDF page 10, Appendix B; PDF page 6, Table 1 |
| M09 | Observed amplitude-phase values plus estimated errors | Sample Gaussian realizations | 5000 synthetic amplitude-phase data sets | The paper draws Gaussian realizations at retained frequencies using the estimated observation errors. | PDF page 10, Appendix B |
| M10 | Each synthetic amplitude-phase data set | Fit uncertainty realization | One bounded parameter estimate per realization | Every realization is refitted with the bounded Levenberg-Marquardt procedure. | PDF page 10, Appendix B |
| M11 | The collection of refitted parameter estimates | Filter aberrant refits | An interquartile-filtered ensemble of accepted estimates | The paper removes aberrant refits by its stated interquartile filtering step. | PDF page 10, Appendix B |
| M12 | The filtered parameter ensemble | Summarize ensemble intervals | Ensemble means and one-standard-deviation parameter intervals | The reported uncertainty summary is computed after filtering the refits. | PDF page 10, Appendix B |
| M13 | The analytical harmonic solution and a discretized aquifer domain | Compare numerical response | Coincident analytical and finite-difference amplitude-phase responses | Appendix A uses a second-order tridiagonal frequency-domain solution as the independent numerical check. | PDF pages 9-10, Appendix A, Figure A.1 |
| M14 | Lag ratio frequency and scaled distance across the parameter domain | Evaluate Morris sensitivity | Distance-dependent sensitivity rankings for amplitude and phase | Equations 22-25 define the Morris elementary effects and overall sensitivity index used in Figure 6. | PDF pages 5 and 8, Section 2.5, Equations 22-25, Figure 6 |

## Symbol Glossary

| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| q | Scene 4 | present flux arrow | specific discharge | length per time | assembled from weighted gradient history |
| kappa | Scene 4 | fading memory envelope | causal conductivity kernel | conductivity per time | compressed into two lag clocks |
| K | Scene 4 | total kernel area | effective hydraulic conductivity | length per time | retained in the local constitutive law |
| tau_q | Scene 5 | teal clock | flux adjustment time | time | enters the flux derivative |
| tau_h | Scene 5 | red clock | head equilibration time | time | enters the gradient derivative |
| D | Scene 6 | aquifer diffusion scale | hydraulic diffusivity | length squared per time | scales the harmonic propagation |
| omega | Scene 7 | rotating boundary phasor | forcing angular frequency | inverse time | drives the complex wave |
| alpha | Scene 7 | shrinking envelope slope | amplitude attenuation coefficient | inverse length | produces D_A |
| beta | Scene 7 | moving crest slope | positive phase-lag gradient equal to the magnitude of Im lambda | inverse length | produces D_phi |
| D_A | Scene 8 | teal diffusivity gauge | apparent amplitude diffusivity | length squared per time | compared with D_phi |
| D_phi | Scene 8 | red diffusivity gauge | apparent phase diffusivity | length squared per time | compared with D_A |
| eta | Scene 8 | centered regime scale | D_phi divided by D_A | dimensionless | maps the mismatch regimes |
| H_j | Scene 9 | spectral ratio arrow | complex transfer function at well j | dimensionless | separates magnitude and argument |
| A_h | Scene 9 | spectral magnitude | observed amplitude ratio | dimensionless | enters joint inversion |
| phi | Scene 9 | spectral angle | observed phase shift | radians | enters joint inversion |
| AIC | Scene 11 | balance scale | Akaike Information Criterion | dimensionless | tests whether added lags are warranted |

## Scene Table

### Scene 1: One boundary wave
- Source-derived rules: H01, H02, H06, H09, H17, H19, H20
- Narrative beat: hook
- Background beat: B01
- Background premise: A periodic boundary signal attenuates and accumulates phase as it propagates through an aquifer.
- Method step: none
- Storyboard trigger: A directly observable periodic head signal must appear before any model interpretation.
- Viewer question: What changes as a boundary oscillation propagates through an aquifer?
- Visual object: An aquifer transect carrying a continuous sinusoidal boundary wave across three observation wells.
- Visual antecedent: The aquifer transect appears before labels or formulas.
- Transformation from previous scene: The boundary crest traces the wave inland while each retained copy shrinks and shifts.
- Motion purpose: This motion shows how we Separate amplitude attenuation from phase accumulation on one persistent physical object.
- Motion class: trace
- Focal object: The propagating periodic head wave.
- Salience plan: The current crest remains focal teal while previous crests fade to secondary strokes.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red frame margin 0.45.
- Downsample legibility: The envelope and three well positions remain distinct at 375 px width.
- Step detail: Drive the boundary sinusoid; carry its crest across each well; retain smaller later copies.
- Why this step is valid: This is valid because The harmonic solution represents amplitude attenuation and phase accumulation with distance.
- Transition bridge: From this scene to the next The envelope and crest become two measurement instruments.
- Evidence locator: PDF pages 2-4, Sections 1 and 2.3, Equations 8-15
- What the viewer learns: Periodic propagation supplies two distinct hydraulic signatures.
- Minimal on-screen text: Smaller and later
- Narration draft: A periodic head signal becomes smaller and later as it travels inland. Those two changes are measured separately.
- Formula: none
- Frame zones: upper title band center aquifer field lower caption band.
- Keep-clear pairs: title versus boundary wave; caption versus well labels.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, aquifer], labels=[heading, caption], blockers=[aquifer], frame_items=[heading, caption, aquifer])
- QA risks: wave clipping at the aquifer boundary and labels crossing the envelope.

### Scene 2: One wave two diffusivities
- Source-derived rules: H03, H04, H06, H12, H13, H17, H19, H20, H21
- Narrative beat: tension
- Background beat: B02
- Background premise: Classical groundwater diffusion can produce inconsistent diffusivities when amplitude and phase are inverted separately.
- Method step: none
- Storyboard trigger: The two observed signatures now require an interpretation.
- Viewer question: Do attenuation and phase imply the same classical diffusivity?
- Visual object: The retained wave bifurcates into amplitude and phase diffusivity gauges.
- Visual antecedent: prior Scene 1
- Transformation from previous scene: The wave envelope moves into the D_A gauge while the crest offset moves into the D_phi gauge.
- Motion purpose: This motion shows how we Make the classical inversion contradiction visible without introducing a new data object.
- Motion class: same-object-transform
- Focal object: The separated D_A and D_phi gauge needles.
- Salience plan: The aquifer fades to a thin outline while the two gauge needles receive focal contrast.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red frame margin 0.45.
- Downsample legibility: D_A and D_phi remain readable and visibly separated.
- Step detail: Detach the envelope measurement; detach the crest offset; transform both into diffusivity needles; show their disagreement.
- Why this step is valid: This is valid because Equations 20-21 define separate classical inversions from attenuation and phase.
- Transition bridge: From this scene to the next The split gauges collapse into a mismatch centered on eta equal to one.
- Evidence locator: PDF pages 2 and 5, Sections 1 and 2.4, Equations 20-21
- What the viewer learns: A single classical diffusivity need not fit both measurements.
- Minimal on-screen text: Same wave different D
- Narration draft: Classical diffusion assigns both signatures to one diffusivity. Field observations can make those estimates separate.
- Formula: none
- Uncertainty shape: Distance between the two diffusivity gauge needles.
- Frame zones: upper title band center comparison field lower claim band.
- Keep-clear pairs: title versus gauges; D_A label versus D_phi label.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, gauges], labels=[heading, caption, gauge_labels], blockers=[gauges], frame_items=[heading, caption, gauges])
- QA risks: ambiguous gauge ownership and insufficient separation on mobile.

### Scene 3: Memory not a literal delay
- Source-derived rules: H03, H04, H06, H12, H13, H17, H19, H20, H21
- Narrative beat: context
- Background beat: B03
- Background premise: The two lag parameters describe causal field-scale memory rather than a literal horizontal shift of a signal.
- Method step: none
- Storyboard trigger: The mismatch needs a constitutive explanation that does not misstate the lag parameters.
- Viewer question: What does lagging mean physically in this theory?
- Visual object: A stack of past gradient arrows weighted by a fading causal kernel.
- Visual antecedent: prior Scene 2
- Transformation from previous scene: The two gauges rotate into two clocks while the original wave unfolds backward into its gradient history.
- Motion purpose: This motion shows how we Replace signal shifting with causal weighting of past hydraulic gradients.
- Motion class: same-object-transform
- Focal object: The fading gradient history and its present flux arrow.
- Salience plan: Old gradient arrows fade with look-back time while the present flux remains warning red.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: The direction of history and the present-time marker remain visible.
- Step detail: Expand the current wave into earlier gradients; assign decreasing weights; preserve only causal history; form the present flux arrow.
- Why this step is valid: This is valid because Equations 2-4 formulate a causal memory law and a two-timescale local representation.
- Uncertainty shape: A fading distribution of admissible past-gradient weights rather than one literal shift.
- Transition bridge: From this scene to the next The weighted-history picture becomes the memory integral.
- Evidence locator: PDF page 3, Section 2.1, Equations 2-4
- What the viewer learns: The lags summarize field-scale memory and do not simply slide a signal in time.
- Minimal on-screen text: Causal memory
- Narration draft: The model does not shift a hydrograph by a fixed delay. It lets past gradients contribute to present flux with decaying weight.
- Formula: none
- Frame zones: upper title band center history field lower claim band.
- Keep-clear pairs: clock labels versus arrows; caption versus kernel.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, history], labels=[heading, caption, clock_labels], blockers=[history], frame_items=[heading, caption, history])
- QA risks: history direction ambiguity and excessive arrow density.

### Scene 4: Integrate gradient history
- Source-derived rules: H03, H04, H05, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: mechanism
- Background beat: none
- Method step: M01
- Storyboard trigger: The causal history object can now be translated into a constitutive statement.
- Viewer question: How does gradient history produce present flux?
- Visual object: Past gradients sliding under a memory kernel and summing into q.
- Visual antecedent: prior Scene 3
- Antecedent timing: prior Scene 3
- Transformation from previous scene: The visual kernel becomes the integration weight without changing the history geometry.
- Motion purpose: This motion shows how we Bind each mathematical term to an already visible hydraulic object.
- Motion class: same-object-transform
- Focal object: The kernel-weighted sum becoming the present flux arrow.
- Salience plan: Nonactive history arrows dim while the integrated area and q receive focal contrast.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red reference gold.
- Downsample legibility: q K kappa and the integration direction remain readable.
- Step detail: Pair each past gradient with its kernel weight; accumulate the products; reveal the present flux.
- Why this step is valid: This is valid because The kernel is causal and its integral equals effective hydraulic conductivity.
- Uncertainty shape: None. The displayed nonnegative fading kernel is schematic; the paper specifies causal decay and total area K, not a kernel width or uncertainty distribution.
- Transition bridge: From this scene to the next The continuous kernel is compressed into two response clocks.
- Evidence locator: PDF page 3, Section 2.1, Equations 2-3
- Input state: A time-ordered history of hydraulic gradients
- Operation: Integrate gradient history
- Output state: Present Darcy flux assembled by a causal memory kernel
- Validity basis: The kernel uses only past gradients and integrates to the effective hydraulic conductivity.
- What the viewer learns: Present discharge is an integral of weighted past gradients.
- Minimal on-screen text: Flux remembers gradients
- Narration draft: The present Darcy flux is assembled from past hydraulic gradients. The kernel is causal and its area recovers effective conductivity.
- Formula: q(t)=-integral from zero to infinity of kappa(t prime) gradient h(t minus t prime) dt prime
- Symbol handoff: History arrows become gradient h terms; fading opacity becomes kappa; the resulting red arrow becomes q.
- Formula split plan: Reveal q first; reveal the kernel-weighted gradient integral second; join both sides only after the geometry is established.
- Formula derivation steps: Map look-back distance to t prime; map opacity to kappa; sum weighted arrows; replace the sum by the integral.
- Frame zones: upper title band left history geometry right flux output lower formula lane.
- Keep-clear pairs: formula versus kernel; q label versus flux arrow.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, formula, history, flux], labels=[heading, formula], blockers=[history, flux], frame_items=[heading, formula, history, flux])
- QA risks: formula width and unclear correspondence between opacity and kernel weight.

### Scene 5: Two clocks compress the kernel
- Source-derived rules: H03, H04, H05, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: mechanism
- Background beat: none
- Method step: M02
- Storyboard trigger: The convolution is physically clear but must become an analytically tractable local law.
- Viewer question: How is continuous memory represented with two parameters?
- Visual object: The memory envelope folds into tau_q and tau_h clocks on opposite sides of Darcy's law.
- Visual antecedent: prior Scene 4
- Antecedent timing: prior Scene 4
- Transformation from previous scene: The kernel area folds into K while its two response branches close into the teal and red clocks.
- Motion purpose: This motion shows how we Show that the local law is a structured reduction of the memory kernel.
- Motion class: same-object-transform
- Focal object: The paired tau_q and tau_h clocks.
- Salience plan: The integral fades after its kernel branches have visibly landed on the derivative terms.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red reference gold.
- Downsample legibility: Both tau subscripts and derivative sides remain distinct.
- Step detail: Split the kernel into two response branches; contract each branch to one clock; place the clocks beside q and gradient h derivatives.
- Why this step is valid: This is valid because Equation 4 is the paper's selected two-timescale local representation.
- Uncertainty shape: The distance between the two clock markers shows that the effective time scales need not coincide.
- Transition bridge: From this scene to the next The local constitutive equation moves into a water-balance control volume.
- Evidence locator: PDF pages 3-4, Section 2.1, Equation 4
- Input state: A causal field-scale memory relation
- Operation: Form the paper's two-channel two-lag local representation
- Output state: A local constitutive law containing tau_q and tau_h
- Validity basis: Equation 4 is the selected local two-lag constitutive form; no exponential kernel is specified.
- What the viewer learns: Tau_q governs flux adjustment while tau_h governs gradient-side head equilibration.
- Minimal on-screen text: Two response clocks
- Narration draft: A two-channel kernel yields a local relation with one flux-adjustment time and one head-equilibration time.
- Formula: q plus tau_q partial_t q equals minus K times gradient h plus tau_h partial_t gradient h
- Symbol handoff: Red flux arrow becomes q; teal gradient arrows become gradient h; clock colors hand off to their derivative terms.
- Formula split plan: Hold the classical q and gradient h terms first; attach tau_q and tau_h derivative terms in a second beat.
- Formula derivation steps: Preserve q and gradient h; attach each clock to its own derivative; retain K as the integrated kernel area.
- Frame zones: upper title band center clock geometry lower formula lane.
- Keep-clear pairs: tau labels versus clocks; formula versus clock geometry.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, formula, clocks], labels=[heading, formula, clock_labels], blockers=[clocks], frame_items=[heading, formula, clocks])
- QA risks: tau_h and tau_q color reversal or derivative ownership ambiguity.

### Scene 6: Conserve water with memory
- Source-derived rules: H04, H05, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: mechanism
- Background beat: none
- Method step: M03
- Storyboard trigger: A constitutive law alone does not determine the head field.
- Viewer question: What head equation follows when mass is conserved?
- Visual object: Flux entering a control volume while stored head changes inside it.
- Visual antecedent: prior Scene 5
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: The q arrow enters the control volume and the gradient-side clock attaches to the head field.
- Motion purpose: This motion shows how we Show where memory enters without moving continuity away from present time.
- Motion class: same-object-transform
- Focal object: The balance between boundary flux and stored head.
- Salience plan: The constitutive law dims after its arrows become control-volume terms.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red frame margin 0.45.
- Downsample legibility: The control volume arrows and the two time operators remain readable.
- Step detail: Route q through the control-volume boundary; accumulate head storage; substitute the constitutive relation; group time operators.
- Why this step is valid: This is valid because Equations 5-7 combine the stated continuity equation with Equation 4.
- Transition bridge: From this scene to the next A sinusoidal boundary begins driving the resulting head equation.
- Evidence locator: PDF page 4, Section 2.2, Equations 5-7
- Input state: The local two-lag constitutive law plus continuity
- Operation: Combine constitutive continuity
- Output state: A lagging groundwater-flow equation for hydraulic head
- Validity basis: Mass conservation remains at present time while the constitutive relation carries memory.
- What the viewer learns: The classical diffusion equation gains distinct time operators on head change and spatial diffusion.
- Minimal on-screen text: Conservation remains present
- Narration draft: Continuity stays at the present time. Memory enters through the constitutive relation and produces the lagging head equation.
- Formula: tau_q partial_tt h plus partial_t h equals D times Laplacian h plus D tau_h partial_t Laplacian h
- Symbol handoff: Incoming q arrows become divergence; stored water becomes partial_t h; the two clocks retain their colors.
- Formula split plan: Reveal the present-time storage balance first; substitute the two clock-weighted terms second.
- Formula derivation steps: Form flux divergence; equate it to storage change; substitute the two-lag law; divide by storativity.
- Frame zones: upper title band center control volume lower formula lane.
- Keep-clear pairs: formula versus control volume; storage label versus head field.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, formula, control], labels=[heading, formula], blockers=[control], frame_items=[heading, formula, control])
- QA risks: crowded PDE and unclear present-time continuity statement.

### Scene 7: Split the complex groundwater wave
- Source-derived rules: H03, H04, H05, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: mechanism
- Background beat: none
- Method step: M04
- Storyboard trigger: The field forcing is periodic and therefore invites a harmonic solution.
- Viewer question: How do the two lags alter attenuation and phase?
- Visual object: A rotating boundary phasor extrudes into a decaying wave with envelope alpha and crest gradient beta.
- Visual antecedent: earlier in this scene before formula
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: The PDE's head field becomes the moving sinusoidal surface inside the same aquifer domain.
- Motion purpose: This motion shows how we Turn the complex wavenumber into two directly observable geometries.
- Motion class: same-object-transform
- Focal object: The paired envelope slope alpha and crest shift beta.
- Salience plan: The full PDE fades while its sinusoidal boundary and aquifer domain remain.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red reference gold.
- Downsample legibility: Alpha beta envelope and crest markers remain separate.
- Step detail: Rotate the boundary phasor; trace the inland wave; fit its envelope; mark crest offsets; split the complex wavenumber.
- Why this step is valid: This is valid because Equations 10-15 give the decaying harmonic branch with lambda equal to minus alpha minus i beta, where beta is the positive magnitude of its imaginary part.
- Uncertainty shape: The distance between the envelope and crest markers remains the visible mismatch diagnostic.
- Transition bridge: From this scene to the next Alpha and beta move onto the two classical diffusivity gauges.
- Evidence locator: PDF page 4, Section 2.3, Equations 8-15
- Input state: The lagging head equation under sinusoidal boundary forcing
- Operation: Solve harmonic response
- Output state: A decaying complex wave with real attenuation alpha and positive phase-lag gradient beta
- Validity basis: The decaying branch is lambda equal to minus alpha minus i beta, with beta equal to the magnitude of its imaginary part.
- What the viewer learns: The two lags change envelope decay and phase accumulation through one complex wavenumber.
- Minimal on-screen text: lambda = -alpha - i beta; beta = |Im lambda|
- Narration draft: The harmonic solution uses the decaying branch. Alpha is attenuation, while beta is the positive magnitude of the negative imaginary part and therefore the phase-lag gradient.
- Formula: h_D equals exp minus alpha x_D times cos omega_D t_D minus beta x_D
- Symbol handoff: The drawn envelope becomes exp minus alpha x_D; the moving crest becomes beta x_D; the rotating boundary becomes omega_D t_D.
- Formula split plan: Write the envelope factor first; write the cosine phase second; combine them after the wave has propagated.
- Formula derivation steps: Draw the phasor; propagate the sinusoid; select lambda equal to minus alpha minus i beta; define beta as the positive magnitude of Im lambda; isolate the envelope and crest angle; assemble the harmonic head.
- Frame zones: upper title band center wave field lower formula lane.
- Keep-clear pairs: alpha label versus envelope; beta label versus crest marker; formula versus aquifer.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, formula, wave], labels=[heading, formula, parameter_labels], blockers=[wave], frame_items=[heading, formula, wave])
- QA risks: motion aliasing and confusion between beta phase gradient and absolute phase.

### Scene 8: Map the mismatch
- Source-derived rules: H03, H04, H05, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: revelation
- Background beat: none
- Method step: M05
- Storyboard trigger: The visible alpha and beta now permit the paper's central diagnostic.
- Viewer question: When do amplitude and phase imply the same diffusivity?
- Visual object: Alpha and beta gauges transform into a two-dimensional log eta regime map centered on eta equal to one.
- Visual antecedent: prior Scene 7
- Antecedent timing: prior Scene 7
- Transformation from previous scene: The envelope slope becomes D_A while the crest gradient becomes D_phi before both enter eta.
- Motion purpose: This motion shows how we Reveal agreement and disagreement as regions rather than isolated numbers.
- Motion class: same-object-transform
- Focal object: The eta equal to one contour separating phase- and amplitude-dominant regimes.
- Salience plan: The wave dims to a small inset while the centered regime map becomes dominant.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red reference gold.
- Downsample legibility: The eta equal to one contour and regime directions remain visible.
- Step detail: Convert alpha to D_A; convert beta to D_phi; divide the gauges; sweep lag ratio and dimensionless frequency; trace the unity contour.
- Why this step is valid: This is valid because Equations 20-21 define D_A D_phi and eta from the same harmonic response.
- Transition bridge: From this scene to the next The regime map collapses into measured spectral points from the field.
- Evidence locator: PDF page 5, Section 2.4, Equations 20-21; PDF page 7, Figure 5
- Input state: The attenuation alpha and phase gradient beta
- Operation: Calculate mismatch ratio
- Output state: Apparent diffusivities D_A and D_phi plus eta equal to alpha squared over beta squared
- Validity basis: Classical amplitude and phase inversions are applied to the same lagging response.
- Aha object: The source-backed eta equal to one contour becomes the central visible relation.
- What the viewer learns: Eta maps when classical amplitude and phase inversions agree and which one dominates when they do not.
- Minimal on-screen text: eta = 1 agreement
- Narration draft: The mismatch ratio is eta equals D_phi over D_A. Unity marks classical agreement; either side identifies which signature dominates.
- Formula: D_A equals omega over two alpha squared; D_phi equals omega over two beta squared; eta equals alpha squared over beta squared
- Symbol handoff: Envelope slope alpha enters the first denominator; crest gradient beta enters the second; the two gauge needles become the eta ratio.
- Formula split plan: Reveal D_A and D_phi separately; divide them only after both gauges are visible.
- Formula derivation steps: Apply the classical amplitude inversion; apply the classical phase inversion; divide the results; map the ratio.
- Uncertainty shape: A centered signed distribution around the eta equal to one reference contour.
- Frame zones: upper title band center regime map lower formula lane.
- Keep-clear pairs: formula versus color scale; site markers versus regime labels.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, formula, regime_map], labels=[heading, formula, regime_labels], blockers=[regime_map], frame_items=[heading, formula, regime_map])
- QA risks: color interpretation without a visible unity reference and tiny axis labels.

### Scene 9: Measure the field transfer function
- Source-derived rules: H03, H04, H05, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: evidence
- Background beat: none
- Method step: M06
- Storyboard trigger: The theory must now receive amplitude and phase from observed head records.
- Viewer question: How are the field signatures extracted at each frequency?
- Visual object: Paired boundary and well head records beside the complex transfer-function vector defined by their cross-spectral ratio.
- Visual antecedent: earlier in this scene before formula
- Antecedent timing: earlier in this scene before formula
- Transformation from previous scene: Points on the regime map unfold into paired time series at the boundary and wells.
- Motion purpose: This motion shows how we Show that amplitude and phase are measured from one complex transfer function.
- Motion class: same-object-transform
- Focal object: The complex river-well transfer-function vector.
- Salience plan: The paired records remain visible while the transfer-function vector separates magnitude from phase.
- Theme tokens: title 38 px body 30 px math 38 px focal teal warning red frame margin 0.45.
- Downsample legibility: Boundary and well time-series traces, transfer-function magnitude, and phase angle remain identifiable.
- Step detail: Align the boundary and well records; state the cross-spectral ratio; split the resulting complex transfer function into magnitude and argument.
- Why this step is valid: This is valid because Equations 26-27 define the complex transfer function and its observed amplitude and phase.
- Transition bridge: From this scene to the next Measured magnitude-angle pairs move onto the analytical amplitude-phase curves.
- Evidence locator: PDF page 5, Section 2.6, Equations 26-27; PDF page 10, Appendix B
- Input state: Boundary and observation-well head spectra
- Operation: Calculate transfer function
- Output state: Frequency-specific observed amplitude ratios and phase shifts
- Validity basis: The river-well cross-spectrum divided by the boundary autospectrum defines the complex transfer function.
- What the viewer learns: Field amplitude and phase are two views of one frequency-specific complex response.
- Minimal on-screen text: Magnitude and angle
- Narration draft: Cross-spectral analysis produces one complex transfer function at each well and frequency. Its magnitude is attenuation; its argument is phase shift.
- Formula: H_j of omega equals S_j0 of omega over S_00 of omega
- Symbol handoff: The paired records motivate the source-defined transfer-function formula; the displayed complex vector becomes magnitude A_h and phase phi.
- Formula split plan: Reveal the source-defined cross-spectral ratio as a whole after the paired records and complex vector are established.
- Formula derivation steps: Show the paired records as a schematic introduction; display the source-defined cross-spectrum/autospectrum ratio; read magnitude and argument from the complex vector.
- Uncertainty shape: Intervals around amplitude and phase at each retained harmonic.
- Frame zones: upper title band left paired records right complex vector lower formula lane.
- Keep-clear pairs: formula versus records; phase label versus vector magnitude label.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, records, vector, formula], labels=[heading, caption, phase_label, magnitude_label, formula], blockers=[records, vector], frame_items=[heading, caption, records, vector, formula])
- QA risks: implying that the displayed sinusoidal records themselves are a numerical spectral reconstruction rather than a schematic introduction to the source-defined ratio.

### Scene 10: Fit both signatures together
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M07
- Storyboard trigger: The measured amplitude-phase pairs require one joint parameter set.
- Viewer question: Can one lagging parameter set fit all retained frequencies and distances?
- Visual object: Tuolumne and Meghna observations beside approximate manual graphical traces of the published fits in Figures 2 and 3.
- Visual antecedent: prior Scene 9
- Transformation from previous scene: Complex transfer vectors split into measured magnitudes and angles on two field panels.
- Motion purpose: This motion shows how we Make the simultaneous inversion visible as geometric alignment across both signatures.
- Motion class: same-object-transform
- Focal object: The analytical curves aligning with both amplitude and phase points.
- Salience plan: Nonactive site dims while the current site curve moves; residual connectors remain thin.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Site names and amplitude-versus-phase roles remain readable.
- Step detail: Place the source observations and approximate manually traced published fits; show their joint alignment without presenting the traces as recomputed curves or source data.
- Why this step is valid: This is valid because Appendix B defines the weighted least-squares objective and bounded parameter estimation.
- Transition bridge: From this scene to the next The fitted curves and residuals move onto an information balance.
- Evidence locator: PDF page 10, Appendix B, Equation B.1; PDF page 6, Table 1, Figures 2-3
- Input state: Coherent multi-frequency amplitude-phase observations
- Operation: Fit lagging parameters
- Output state: Joint estimates of diffusivity tau_q and tau_h
- Validity basis: The weighted least-squares objective uses the reported amplitude and phase errors.
- What the viewer learns: Each field site is interpreted with one parameter set across amplitude phase distance and frequency.
- Minimal on-screen text: Joint inversion
- Narration draft: The inversion does not fit attenuation and phase separately. It estimates D tau_q and tau_h from both signatures together.
- Formula: none
- Uncertainty shape: Distance between observed points and fitted curves scaled by reported amplitude and phase errors.
- Frame zones: upper title band left Tuolumne panel right Meghna panel lower parameter lane.
- Keep-clear pairs: site labels versus curves; error bars versus parameter labels.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, panels], labels=[heading, caption, site_labels], blockers=[panels], frame_items=[heading, caption, panels])
- QA risks: invented point placement and insufficient distinction between source-derived curves and schematic residual motion.

### Scene 11: Ask whether two lags earn their complexity
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M08
- Storyboard trigger: Better fit alone does not justify two additional parameters.
- Viewer question: Is the improvement large enough after penalizing complexity?
- Visual object: Classical and lagging residual stacks balance against their parameter counts on an AIC scale.
- Visual antecedent: prior Scene 10
- Transformation from previous scene: Residual connectors detach from the field curves and stack on the two model pans.
- Motion purpose: This motion shows how we Show the explicit trade between fit and model complexity.
- Motion class: same-object-transform
- Focal object: The AIC balance for each field site.
- Salience plan: Parameter icons remain small while the AIC difference receives the dominant numeral.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Classical Lagging and the direction of lower AIC remain readable.
- Step detail: Stack whitened residuals; add parameter-count weights; compute the two AIC positions; reveal the lower value.
- Why this step is valid: This is valid because Appendix B states the AIC calculation and Table 1 reports both models.
- Transition bridge: From this scene to the next The accepted fits become centers of measurement-error clouds.
- Evidence locator: PDF page 10, Appendix B; PDF page 6, Table 1
- Input state: Weighted residuals from classical and lagging fits
- Operation: Compare model information
- Output state: An AIC difference that penalizes the two additional lag parameters
- Validity basis: AIC balances fit improvement against parameter count using the whitened residual sum of squares.
- What the viewer learns: The paper evaluates the lagging model by information balance rather than fit alone.
- Minimal on-screen text: Lower AIC wins
- Narration draft: Two extra lags must earn their complexity. AIC asks whether the residual reduction is large enough after that penalty.
- Formula: none
- Uncertainty shape: Residual stacks with visible lengths rather than decorative probability clouds.
- Frame zones: upper title band center balance lower site-value band.
- Keep-clear pairs: AIC values versus balance pans; parameter icons versus residual stacks.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, balance], labels=[heading, caption, value_labels], blockers=[balance], frame_items=[heading, caption, balance])
- QA risks: implying a universal model-selection verdict beyond the two cases.

### Scene 12: Draw measurement-consistent data sets
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M09
- Storyboard trigger: The fitted observations carry estimated errors that must propagate into the parameter estimates.
- Viewer question: What data sets remain plausible under the measured errors?
- Visual object: Each amplitude-phase point expands into a Gaussian error ellipse sampled 5000 times.
- Visual antecedent: prior Scene 11
- Transformation from previous scene: Residual lengths become standard-deviation axes around the fitted observations.
- Motion purpose: This motion shows how we Turn measurement error into explicit alternative data realizations.
- Motion class: same-object-transform
- Focal object: The sampled amplitude-phase error ellipses.
- Salience plan: Only a small representative subset of samples is drawn while the 5000 count remains textual.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Error ellipses and sample count remain clear without individual sample labels.
- Step detail: Center an ellipse on each observation; scale axes by estimated errors; draw representative samples; update the total counter to 5000.
- Why this step is valid: This is valid because Appendix B reports 5000 Gaussian amplitude-phase realizations at retained frequencies.
- Transition bridge: From this scene to the next Sampled points pull the analytical curves into repeated fitted positions.
- Evidence locator: PDF page 10, Appendix B
- Input state: Observed amplitude-phase values plus estimated errors
- Operation: Sample Gaussian realizations
- Output state: 5000 synthetic amplitude-phase data sets
- Validity basis: The paper draws Gaussian realizations at retained frequencies using the estimated observation errors.
- What the viewer learns: The uncertainty analysis perturbs observations rather than inventing parameter ranges.
- Minimal on-screen text: 5000 data realizations
- Narration draft: Measurement uncertainty is propagated by drawing 5000 plausible amplitude-phase data sets from the estimated errors.
- Formula: none
- Uncertainty shape: A Gaussian sample cloud centered on each observed amplitude-phase pair.
- Frame zones: upper title band center sampled data field lower count band.
- Keep-clear pairs: sample counter versus ellipses; point labels versus uncertainty shapes.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, samples], labels=[heading, caption, counter], blockers=[samples], frame_items=[heading, caption, samples])
- QA risks: showing too many points and implying unreported covariance.

### Scene 13: Refit every realization
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M10
- Storyboard trigger: Alternative data sets matter only after passing through the same inverse model.
- Viewer question: How does each plausible data set alter the fitted parameters?
- Visual object: Representative sampled data sets cross the inversion bridge and populate a bounded projection of D against tau_h divided by tau_q.
- Visual antecedent: prior Scene 12
- Transformation from previous scene: Sample clouds stream through the joint-inversion curve and emerge as parameter points.
- Motion purpose: This motion shows how we Make uncertainty propagation an explicit data-to-parameter transformation.
- Motion class: same-object-transform
- Focal object: The bounded two-dimensional parameter projection and its accumulating estimates.
- Salience plan: The inversion operator remains a thin bridge while accepted parameter points accumulate.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: The D and tau_h divided by tau_q axes, parameter bounds, and cloud extent remain visible.
- Step detail: Select a representative realization; move the curve to its fit; emit its parameter marker; repeat with a short sequence.
- Why this step is valid: This is valid because Appendix B states that all retained realizations are refitted with bounded Levenberg-Marquardt.
- Transition bridge: From this scene to the next The accumulated parameter cloud exposes isolated aberrant refits.
- Evidence locator: PDF page 10, Appendix B
- Input state: Each synthetic amplitude-phase data set
- Operation: Fit uncertainty realization
- Output state: One bounded parameter estimate per realization
- Validity basis: Every realization is refitted with the bounded Levenberg-Marquardt procedure.
- What the viewer learns: Parameter uncertainty is generated by rerunning the same inverse problem.
- Minimal on-screen text: Data to parameters
- Narration draft: Each plausible data set is inverted again. The resulting estimates are shown as a bounded projection of diffusivity against the lag-time ratio.
- Formula: none
- Uncertainty shape: A two-dimensional projection of the repeated three-parameter refits; the animation does not claim that the projection is the full joint distribution.
- Frame zones: upper title band left data cloud center inversion bridge right parameter space.
- Keep-clear pairs: axis labels versus parameter points; inversion bridge versus caption.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, sampled_curves, parameter_projection], labels=[heading, caption, axis_labels], blockers=[sampled_curves, parameter_bounds, parameter_points], frame_items=[heading, caption, sampled_curves, parameter_projection])
- QA risks: implying full Bayesian posterior sampling rather than repeated-error propagation.

### Scene 14: Remove aberrant refits
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: mechanism
- Background beat: none
- Method step: M11
- Storyboard trigger: A small number of unstable refits can distort the reported spread.
- Viewer question: Which refits enter the final uncertainty summary?
- Visual object: A schematic point cloud separates retained estimates from aberrant refits during the paper-reported interquartile filtering.
- Visual antecedent: prior Scene 13
- Transformation from previous scene: The parameter cloud remains a schematic ensemble while only designated aberrant refits fade; no marginal projection or acceptance fence is introduced.
- Motion purpose: This motion shows how we Show the reported filtering rule and its effect on the ensemble.
- Motion class: same-object-transform
- Focal object: The contrast between retained estimates and schematically excluded aberrant refits.
- Salience plan: Accepted points retain focal color while excluded points fade to pale warning red.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Retained and schematically excluded points remain distinguishable by opacity and color.
- Step detail: Remove schematically identified aberrant refits without displaying a fence multiplier or claiming per-parameter filtering.
- Why this step is valid: This is valid because Appendix B reports interquartile filtering of aberrant refits.
- Transition bridge: From this scene to the next Accepted points condense into reported ensemble means and widths.
- Evidence locator: PDF page 10, Appendix B
- Input state: The collection of refitted parameter estimates
- Operation: Filter aberrant refits
- Output state: An interquartile-filtered ensemble of accepted estimates
- Validity basis: The paper removes aberrant refits by its stated interquartile filtering step.
- What the viewer learns: The reported uncertainty excludes refits identified by the paper's interquartile rule.
- Minimal on-screen text: Filter aberrant refits
- Narration draft: The paper filters aberrant refits before summarizing parameter uncertainty.
- Formula: none
- Uncertainty shape: A point cloud in which only schematically excluded refits fade; no numerical acceptance boundary is drawn.
- Frame zones: upper title band center point cloud lower source-boundary caption.
- Keep-clear pairs: quartile labels versus density marks; excluded markers versus caption.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, distributions], labels=[heading, caption, quartile_labels], blockers=[distributions], frame_items=[heading, caption, distributions])
- QA risks: overstating the filtering threshold if exact multipliers are not displayed.

### Scene 15: Report uncertainty as a width
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M12
- Storyboard trigger: The accepted ensemble must be summarized in the form reported by the paper.
- Viewer question: What uncertainty accompanies each fitted parameter?
- Visual object: Accepted parameter estimates collapse into mean markers with one-standard-deviation bands.
- Visual antecedent: prior Scene 14
- Transformation from previous scene: The retained ensemble contracts onto its reported means and preserves its spread as bands.
- Motion purpose: This motion shows how we Preserve uncertainty as visible width rather than hide it behind best-fit values.
- Motion class: same-object-transform
- Focal object: The three mean markers and one-standard-deviation bands.
- Salience plan: Individual points dim after their width has transferred to the summary bands.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Mean markers and band endpoints remain visible without dense numeric labels.
- Step detail: Calculate the accepted ensemble mean; transfer point spread into a one-standard-deviation band; align D tau_q tau_h summaries.
- Why this step is valid: This is valid because Appendix B reports ensemble means and one-sigma intervals after filtering.
- Transition bridge: From this scene to the next Summary bands overlay the two site-specific fitted values.
- Evidence locator: PDF page 10, Appendix B
- Input state: The filtered parameter ensemble
- Operation: Summarize ensemble intervals
- Output state: Ensemble means and one-standard-deviation parameter intervals
- Validity basis: The reported uncertainty summary is computed after filtering the refits.
- What the viewer learns: The fitted parameters are reported with uncertainty widths generated from the measurement-error analysis.
- Minimal on-screen text: Mean plus or minus one sigma
- Narration draft: The retained ensemble is summarized by a mean and one-standard-deviation interval for each fitted parameter.
- Formula: none
- Uncertainty shape: One-dimensional bands centered on accepted parameter means.
- Frame zones: upper title band center interval field lower parameter labels.
- Keep-clear pairs: interval endpoints versus parameter labels; site markers versus band labels.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, intervals], labels=[heading, caption, parameter_labels], blockers=[intervals], frame_items=[heading, caption, intervals])
- QA risks: calling repeated-error results a full Bayesian posterior without qualification.

### Scene 16: Check the analytical wave numerically
- Source-derived rules: H04, H07, H08, H12, H13, H17, H20
- Narrative beat: evidence
- Background beat: none
- Method step: M13
- Storyboard trigger: The closed-form harmonic solution requires an independent numerical check.
- Viewer question: Does the analytical response agree with a discretized frequency-domain solution?
- Visual object: Analytical and finite-difference amplitude-phase curves trace over the same aquifer transect.
- Visual antecedent: prior Scene 7
- Transformation from previous scene: The summary intervals move aside while the original harmonic wave returns with a discretized grid beneath it.
- Motion purpose: This motion shows how we Test the equation implementation without introducing field-data ambiguity.
- Motion class: camera-bridge
- Focal object: The coincident analytical and numerical response curves.
- Salience plan: Grid lines remain secondary while the two line styles stay identifiable by color and dash pattern.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red frame margin 0.45.
- Downsample legibility: Solid analytical and dashed numerical lines remain distinguishable without color alone.
- Step detail: Draw the spatial grid; solve the frequency-domain response; trace analytical and numerical curves; expose their coincidence.
- Why this step is valid: This is valid because Appendix A describes the second-order tridiagonal solver and Figure A.1 compares the responses.
- Transition bridge: From this scene to the next The verified wave returns to the lag-ratio and distance parameter domain.
- Evidence locator: PDF pages 9-10, Appendix A, Figure A.1
- Input state: The analytical harmonic solution and a discretized aquifer domain
- Operation: Compare numerical response
- Output state: Coincident analytical and finite-difference amplitude-phase responses
- Validity basis: Appendix A uses a second-order tridiagonal frequency-domain solution as the independent numerical check.
- What the viewer learns: The paper's closed-form response reproduces the independent numerical harmonic solution.
- Minimal on-screen text: Analytical equals numerical
- Narration draft: A second-order frequency-domain model independently checks the closed-form amplitude and phase response.
- Formula: none
- Uncertainty shape: Distance between solid analytical and dashed numerical curves.
- Frame zones: upper title band center comparison plot lower legend band.
- Keep-clear pairs: legend versus curves; grid labels versus caption.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, comparison], labels=[heading, caption, legend], blockers=[comparison], frame_items=[heading, caption, comparison])
- QA risks: overlapping curves becoming indistinguishable and implying zero machine error.

### Scene 17: Learn where the signal is informative
- Source-derived rules: H04, H07, H08, H10, H12, H13, H17, H20, H21
- Narrative beat: revelation
- Background beat: none
- Method step: M14
- Storyboard trigger: A valid model can still be weakly identifiable under poor forcing or observation geometry.
- Viewer question: Which combinations of lag ratio frequency and distance control amplitude or phase?
- Visual object: Approximate graphical traces digitized from Figure 6 show how the reported sensitivity rankings change across the scaled-distance coordinate.
- Visual antecedent: prior Scene 16
- Transformation from previous scene: The verified response curves separate into amplitude and phase sensitivity traces while distance remains the horizontal coordinate.
- Motion purpose: This motion shows how we Convert model behavior into guidance for frequency and observation-distance selection.
- Motion class: same-object-transform
- Focal object: The crossing sensitivity rankings for amplitude and phase.
- Salience plan: Only the active parameter trace is saturated while other factors remain thin and patterned.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Amplitude phase and scaled-distance roles remain readable by line style and marker shape.
- Step detail: Preserve the qualitative ordering and crossings visible in Figure 6; display the manually traced curves without presenting them as newly computed Morris indices.
- Why this step is valid: This is valid because Equations 22-25 define the Morris indices and Figure 6 reports their distance dependence.
- Transition bridge: From this scene to the next The sensitivity traces become practical gates before the field interpretation returns.
- Evidence locator: PDF pages 5 and 8, Section 2.5, Equations 22-25, Figure 6
- Input state: Lag ratio frequency and scaled distance across the parameter domain
- Operation: Evaluate Morris sensitivity
- Output state: Distance-dependent sensitivity rankings for amplitude and phase
- Validity basis: Equations 22-25 define the Morris elementary effects and overall sensitivity index used in Figure 6.
- Aha object: The Figure 6 ordering and crossings become the central visible relation.
- What the viewer learns: Phase and amplitude do not carry equal information across all frequencies and distances.
- Minimal on-screen text: Information depends on scale
- Narration draft: Sensitivity changes with frequency and distance. The experiment must resolve the part of the signal that carries information about each lag.
- Formula: none
- Uncertainty shape: No uncertainty interval is encoded; the visible shape is the spread and crossing of approximate Figure 6 traces across the scaled-distance axis.
- Frame zones: upper title band center sensitivity plot lower guidance band.
- Keep-clear pairs: trace labels versus curves; guidance text versus x axis.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, caption, sensitivity], labels=[heading, caption, trace_labels], blockers=[sensitivity], frame_items=[heading, caption, sensitivity])
- QA risks: presenting manually digitized graphical traces as exact Morris calculations or making universal design claims.

### Scene 18: Return to the two field transects
- Source-derived rules: H01, H06, H08, H12, H13, H17, H21
- Narrative beat: return
- Background beat: none
- Method step: none
- Storyboard trigger: The verified and uncertainty-aware method must answer the opening field question.
- Viewer question: What did the two-lag framework change at Tuolumne and Meghna?
- Visual object: The original two field waves reappear with analytical amplitude envelopes phase shifts parameter summaries and AIC comparisons.
- Visual antecedent: prior Scene 1
- Transformation from previous scene: Sensitivity traces curl back into the two site wave envelopes and crest trajectories.
- Motion purpose: This motion shows how we Resolve the original mismatch in the same physical domain where it appeared.
- Motion class: camera-bridge
- Focal object: The paired Tuolumne and Meghna field comparisons.
- Salience plan: Each site receives one focused beat while supporting parameter and AIC text remains compact.
- Theme tokens: title 38 px body 30 px annotation 24 px focal teal warning red reference gold.
- Downsample legibility: Site names lag ordering and the lower-AIC direction remain readable at phone width.
- Step detail: Restore Tuolumne; overlay its fitted envelope and phase; restore Meghna; overlay its fitted envelope and phase; show the distinct lag orderings; end on the claim boundary.
- Why this step is valid: This is valid because Table 1 and Figures 2-3 report the two field fits and Section 4 bounds their interpretation.
- Transition bridge: From this scene to the next The final wave holds while the claim boundary replaces all secondary labels.
- Evidence locator: PDF pages 6-7, Table 1, Figures 2-5; PDF page 9, Section 4
- What the viewer learns: The same two-lag law reconciles both field data sets with different lag regimes, but the fitted lags remain effective field-scale parameters.
- Minimal on-screen text: Use lagging when both signatures support it
- Narration draft: Tuolumne and Meghna occupy different lag regimes, yet one causal framework reconciles amplitude and phase at both sites. The lags summarize field-scale dynamics; they do not identify one unique microscopic mechanism.
- Formula: none
- Uncertainty shape: One-standard-deviation intervals retained beside the site parameter summaries.
- Frame zones: upper title band left Tuolumne field right Meghna field lower claim-boundary band.
- Keep-clear pairs: site labels versus waves; interval bands versus parameter values; final claim versus legend.
- Transition-frame audit: inspect the entry frame midpoint frame and settled frame for continuity and separation.
- Layout guard: assert_scene_layout(scene=self, pending_items=[heading, claim, field_panels], labels=[heading, claim, site_labels], blockers=[field_panels], frame_items=[heading, claim, field_panels])
- QA risks: overstating microscopic mechanism causality and omitting the model-selection condition.
