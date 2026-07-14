# Transient vertical flux visual abstract

## Symbol Glossary
| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| `T(z,t)` | Scene 1 | colored depth profiles | subsurface temperature | temperature | profiles move through time |
| `q(t)` | Scene 2 | teal time-series curve | vertical groundwater flux | L/T | profile family becomes a curve |

## Scene Table

## Scene 1: Repeated profiles retain a changing flow signal
- Source-derived rules: `H01`, `H02`, `H05`.
- Storyboard trigger: start from a sediment column and temperature observations.
- Viewer question: can changing vertical flux be recovered from temperature with depth?
- Visual object: depth column, sensors, flux arrows, and successive temperature profiles.
- Visual antecedent: measurements appear before the inverse result.
- Transformation from previous scene: successive profiles occupy the same depth axis.
- Motion purpose: profile movement reveals the forcing changes because the curves do not remain coincident.
- Step detail: reveal column, sensors, flow, axes, then three profiles.
- Why this step is valid: this is valid because the paper models transient heat transfer and uses temperature-depth profiles.
- Transition bridge: the profile family becomes the input to the flux inversion.
- What the viewer learns: a profile sequence contains temporal information.
- Minimal on-screen text: temperature and depth.
- Formula: none.
- QA risks: do not label conceptual curves as field data.

## Scene 2: The inverse target is a time series
- Source-derived rules: `H06`, `H08`, `H09`.
- Storyboard trigger: contrast a fixed-flux assumption with a changing inferred flux.
- Viewer question: what is lost when vertical flux is forced to be constant?
- Visual object: constant line and transient flux curve on a time axis.
- Visual antecedent: profile family from Scene 1.
- Transformation from previous scene: profiles collapse into a time-varying flux trace.
- Motion purpose: curve separation makes the assumption error visible because the inferred target changes with time.
- Step detail: draw constant baseline, then reveal transient curve and endpoint labels.
- Why this step is valid: this is valid because the paper reports synthetic recovery and field agreement for transient flux.
- Transition bridge: move from the profile family to the inferred physical quantity.
- What the viewer learns: the method estimates `q(t)`, not one constant value.
- Minimal on-screen text: transient flux.
- Formula: none.
- Uncertainty shape: uncertainty appears as a residual band, interval width, and visible error distribution.
- QA risks: avoid numerical performance claims not shown in the paper.

## Scene 3: Surface temperature enters as a transient boundary
- Source-derived rules: `H02`, `H03`.
- Storyboard trigger: preserve the sediment column and animate its upper boundary.
- Viewer question: what drives the thermal signal from above?
- Visual object: soil column, surface-temperature curve, and depth axis.
- Visual antecedent: the original column remains from the previous scene.
- Transformation from previous scene: the top sensor moves into a boundary curve.
- Motion purpose: the boundary oscillates because surface temperature changes with time.
- Step detail: highlight the top boundary, draw its history, and send the signal downward.
- Why this step is valid: this is valid because the analytical model permits transient surface temperature.
- Transition bridge: move from the boundary signal to depth-dependent profiles.
- What the viewer learns: the thermal boundary is not reduced to one constant.
- Minimal on-screen text: surface temperature.
- Formula: none.
- QA risks: do not imply a specific measured forcing.

## Scene 4: Heat conduction and advection reshape the profile
- Source-derived rules: `H03`, `H05`.
- Storyboard trigger: retain the descending signal while flux arrows appear.
- Viewer question: which processes shape temperature with depth?
- Visual object: column geometry, diffusion band, advection arrows, and temperature curve.
- Visual antecedent: the boundary signal remains from the previous scene.
- Transformation from previous scene: the signal moves downward and broadens.
- Motion purpose: broadening shows conduction while translation reveals advection.
- Step detail: diffuse the signal, move it with flux, and draw the resulting profile.
- Why this step is valid: this is valid because the paper solves the heat-transfer equation with vertical flux.
- Transition bridge: move from process geometry to repeated observations.
- What the viewer learns: profile shape contains information about groundwater movement.
- Minimal on-screen text: conduction and advection.
- Formula: none.
- QA risks: keep thermal dispersion visually secondary.

## Scene 5: A profile sequence becomes the inverse input
- Source-derived rules: `H02`, `H06`.
- Storyboard trigger: align several observation times on one depth axis.
- Viewer question: what does the inverse method actually read?
- Visual object: curve family, depth axis, and sampling points.
- Visual antecedent: the first modeled curve remains from the previous scene.
- Transformation from previous scene: the curve reuses the axis and grows into a family.
- Motion purpose: added curves show the temporal information available to inversion.
- Step detail: retain one curve, add later curves, and mark common depths.
- Why this step is valid: this is valid because the method uses temperature-depth profiles through time.
- Transition bridge: move from observed curves to candidate flux histories.
- What the viewer learns: inversion uses a sequence, not one isolated profile.
- Minimal on-screen text: repeated profiles.
- Formula: none.
- QA risks: label the curves as conceptual unless digitized.

## Scene 6: Candidate flux histories are tested against temperature
- Source-derived rules: `H06`, `H07`.
- Storyboard trigger: keep the observed profile family and introduce candidate histories.
- Viewer question: which time-varying flux reproduces the profiles?
- Visual object: temperature curves, flux candidates, residual band, and error distribution.
- Visual antecedent: observed curves remain from the previous scene.
- Transformation from previous scene: each candidate moves through the forward model to a predicted curve.
- Motion purpose: residual width changes because prediction error compares candidates.
- Step detail: draw candidates, propagate each, and retain the lowest residual band.
- Why this step is valid: this is valid because the paper formulates an inverse problem around its analytical solution.
- Transition bridge: move from candidate distribution to recovered flux.
- What the viewer learns: the analytical model supports repeated inverse evaluation.
- Minimal on-screen text: inverse comparison.
- Formula: none.
- Uncertainty shape: uncertainty is a candidate distribution, residual band, and interval width.
- QA risks: avoid portraying one candidate as exact before validation.

## Scene 7: Numerical and field checks bound the claim
- Source-derived rules: `H08`, `H09`.
- Storyboard trigger: compare the recovered curve with independent references.
- Viewer question: where was the method checked?
- Visual object: finite-element curve, recovered curve, field point cloud, and error band.
- Visual antecedent: recovered flux remains from the previous scene.
- Transformation from previous scene: the selected curve overlays reference curves and points.
- Motion purpose: overlays compare the method with numerical and field evidence.
- Step detail: add numerical reference, then field points, then shade residual width.
- Why this step is valid: this is valid because the paper reports both numerical verification and a field application.
- Transition bridge: move from the evidence band back to the sediment column.
- What the viewer learns: the claim is supported by specified checks, not universal calibration.
- Minimal on-screen text: numerical and field checks.
- Formula: none.
- Uncertainty shape: uncertainty appears as an error band, point-cloud spread, and interval width.
- QA risks: do not invent numerical error values.

## Scene 8: Return the recovered history to the physical column
- Source-derived rules: `H09`, `H10`.
- Storyboard trigger: return the transient curve to the original scientific object.
- Viewer question: what physical quantity has been learned?
- Visual object: original sediment column, temperature profile, and recovered flux curve.
- Visual antecedent: evidence-bounded flux from the previous scene.
- Transformation from previous scene: the flux curve shrinks and moves back beside the column.
- Motion purpose: the curve returns because it describes groundwater moving through the original field object.
- Step detail: restore column, attach `q(t)`, and preserve the evidence interval.
- Why this step is valid: this is valid because transient vertical groundwater flux is the inverse target.
- Transition bridge: return from inference to the original aquifer column.
- What the viewer learns: repeated temperature profiles can estimate a time-varying flux history.
- Minimal on-screen text: transient vertical flux.
- Formula: none.
- Uncertainty shape: retain a shaded confidence band, interval width, and residual distribution cue.
- QA risks: state that the animation is conceptual.
