# Water-table kinematic visual abstract

## Symbol Glossary
| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| `s` | Scene 1 | depressed water table | drawdown | L | surface becomes boundary condition |
| `S_y` | Scene 2 | drainage arrows | specific yield | dimensionless | arrows become inferred storage |

## Scene Table

## Scene 1: Drainage above a moving water table has dynamics
- Source-derived rules: `H01`, `H02`, `H06`.
- Storyboard trigger: begin with saturated and unsaturated zones around a pumping well.
- Viewer question: what does instantaneous gravity drainage omit?
- Visual object: unconfined aquifer geometry, saturated and unsaturated zones, water-table surface, pumping well, and drainage arrows.
- Visual antecedent: physical layers exist before the reduced condition.
- Transformation from previous scene: the flat table deforms toward the pumping well.
- Motion purpose: delayed drainage moves because it reveals the process omitted by an instantaneous condition.
- Step detail: reveal zones, start pumping, deform table, then add radial unsaturated flow.
- Why this step is valid: this is valid because the paper derives its condition from coupled saturated-unsaturated flow.
- Transition bridge: move from the physical arrows to terms in the reduced condition.
- What the viewer learns: drainage has time and radial structure.
- Minimal on-screen text: instantaneous drainage?
- Formula: none.
- QA risks: keep arrows within the unsaturated zone.

## Scene 2: Reduction retains two physical contributions
- Source-derived rules: `H03`, `H04`, `H08`, `H09`.
- Storyboard trigger: name the visible drainage and radial contributions.
- Viewer question: can the physics be retained without another empirical fitting parameter?
- Visual object: drainage term, radial-Laplacian term, and Boise evidence statement.
- Visual antecedent: drainage and radial arrows from Scene 1.
- Transformation from previous scene: arrows contract into two formula terms.
- Motion purpose: term formation reveals how the geometry becomes mathematics.
- Step detail: introduce each term from its arrow family, then show the field conclusion.
- Why this step is valid: this is valid because these are the two components highlighted in the published reduction.
- Transition bridge: return the condition to the pumping-test system.
- What the viewer learns: the model improves specific-yield interpretation without an extra empirical parameter.
- Minimal on-screen text: Boise pumping tests.
- Formula: `MathTex(r"\text{drainage term}+\text{radial Laplacian}")`.
- Formula derivation steps: drainage arrows become the time term; radial arrows become the surface-Laplacian term.
- Symbol handoff: physical arrows retain their colors as the terms appear.
- Formula split plan: reveal the two terms separately before joining them.
- Uncertainty shape: uncertainty appears as a residual band, bounded interval, and visible width around the field claim.
- QA risks: do not imply exact replication of all field curves.

## Scene 3: Pumping bends the water-table surface
- Source-derived rules: `H02`, `H05`.
- Storyboard trigger: keep both zones visible while pumping starts.
- Viewer question: where does the moving boundary enter the problem?
- Visual object: aquifer cross-section, pumping well, and curved water-table surface.
- Visual antecedent: the original flat water table remains from the previous scene.
- Transformation from previous scene: the surface moves downward near the well.
- Motion purpose: curvature grows because radial drawdown develops around pumping.
- Step detail: pulse the well, move the surface, and highlight its radial curvature.
- Why this step is valid: this is valid because the paper considers pumping in an unconfined aquifer.
- Transition bridge: move from water-table curvature to unsaturated flow above it.
- What the viewer learns: the boundary itself has radial structure.
- Minimal on-screen text: moving water table.
- Formula: none.
- QA risks: preserve the saturated-unsaturated interface.

## Scene 4: Unsaturated storage releases water through time
- Source-derived rules: `H03`, `H06`.
- Storyboard trigger: add drainage arrows above the deformed surface.
- Viewer question: why can specific yield be underestimated?
- Visual object: unsaturated soil, moisture-storage points, drainage arrows, and time interval.
- Visual antecedent: the curved water table remains from the previous scene.
- Transformation from previous scene: moisture points move downward toward the surface.
- Motion purpose: staggered arrows show because release is not instantaneous.
- Step detail: reveal stored moisture, stagger release, and collect it at the water table.
- Why this step is valid: this is valid because the derivation retains unsaturated-zone storage dynamics.
- Transition bridge: move from delayed release to the drainage term.
- What the viewer learns: gravity drainage contributes a time-dependent boundary response.
- Minimal on-screen text: gravity drainage.
- Formula: none.
- QA risks: avoid implying discrete droplets in the mathematical model.

## Scene 5: Radial unsaturated flow survives the reduction
- Source-derived rules: `H02`, `H04`.
- Storyboard trigger: preserve the moisture field while radial arrows appear.
- Viewer question: what is lost if only vertical drainage is retained?
- Visual object: water-table surface, radial arrows, and surface curvature map.
- Visual antecedent: drainage field remains from the previous scene.
- Transformation from previous scene: vertical arrows turn toward the pumping well.
- Motion purpose: arrows turn because the radial Laplacian represents lateral structure.
- Step detail: dim vertical drainage, reveal radial motion, and trace surface curvature.
- Why this step is valid: this is valid because the new condition includes a radial-Laplacian term.
- Transition bridge: move from radial geometry to the second formula term.
- What the viewer learns: unsaturated dynamics are not purely one-dimensional.
- Minimal on-screen text: radial contribution.
- Formula: none.
- QA risks: keep arrows above the water table.

## Scene 6: The thin-zone limit becomes a boundary condition
- Source-derived rules: `H03`, `H07`.
- Storyboard trigger: compress the visible unsaturated layer without deleting its effects.
- Viewer question: how is coupled flow made analytically tractable?
- Visual object: aquifer cross-section, shrinking unsaturated layer, drainage term, and radial term.
- Visual antecedent: both flow contributions remain from the previous scene.
- Transformation from previous scene: the layer shrinks and its arrows move into two terms.
- Motion purpose: compression shows because the reduction preserves integrated effects at the boundary.
- Step detail: shrink thickness, retain storage, retain radial curvature, and join the terms.
- Why this step is valid: this is valid because the derivation takes a thin unsaturated-zone limit.
- Transition bridge: move from reduced terms to limiting behavior.
- What the viewer learns: tractability comes from reduction, not an empirical delay parameter.
- Minimal on-screen text: reduced boundary condition.
- Formula: `MathTex(r"\text{drainage term}+\text{radial Laplacian}")`.
- Formula derivation steps: drainage arrows become the first term and radial arrows become the second term.
- Symbol handoff: arrows move directly into their corresponding terms.
- Formula split plan: reveal each term separately, then join them.
- QA risks: do not claim validity for every unsaturated-zone thickness.

## Scene 7: Boise data test the inferred storage
- Source-derived rules: `H08`, `H09`.
- Storyboard trigger: carry the reduced condition into a field pumping-test curve.
- Viewer question: does the added physics change estimated specific yield?
- Visual object: field point cloud, model curves, residual band, and specific-yield interval.
- Visual antecedent: the reduced condition remains from the previous scene.
- Transformation from previous scene: formula terms move into the field curve.
- Motion purpose: overlays compare because field evidence distinguishes the interpretations.
- Step detail: draw observations, overlay models, and show the bounded estimate interval.
- Why this step is valid: this is valid because the paper applies the model to Boise pumping tests.
- Transition bridge: move from the evidence interval back to the aquifer.
- What the viewer learns: the condition addresses specific-yield underestimation without another empirical parameter.
- Minimal on-screen text: Boise field test.
- Formula: none.
- Uncertainty shape: uncertainty is a point-cloud distribution, residual band, and interval width.
- QA risks: do not invent site-specific parameter values.

## Scene 8: Return the inferred storage to the unconfined aquifer
- Source-derived rules: `H09`, `H10`.
- Storyboard trigger: return the bounded result to the original scientific object.
- Viewer question: what is the final, limited claim?
- Visual object: original unconfined aquifer, water-table surface, drainage arrows, and bounded storage interval.
- Visual antecedent: field evidence interval from the previous scene.
- Transformation from previous scene: the interval moves back beside the original aquifer.
- Motion purpose: the result returns because specific yield belongs to the interpreted field system.
- Step detail: restore zones, restore flow arrows, and attach the bounded result.
- Why this step is valid: this is valid because the paper links the boundary condition to aquifer characterization.
- Transition bridge: return from field interpretation to the original aquifer geometry.
- What the viewer learns: the new condition retains unsaturated-flow insight while remaining analytically usable.
- Minimal on-screen text: physically informed specific yield.
- Formula: none.
- Uncertainty shape: retain an interval, residual band, and visible width around the estimate.
- QA risks: keep the conclusion model and site conditioned.
