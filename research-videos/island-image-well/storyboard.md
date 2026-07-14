# Island image-well visual abstract

## Symbol Glossary
| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |
| --- | --- | --- | --- | --- | --- |
| `Q` | Scene 1 | red pumping well | pumping rate | L3/T | expanding response rings |
| `h` | Scene 2 | blue contours | hydraulic head | L | contours become constraints |

## Scene Table

## Scene 1: The coastline interrupts a pumping response
- Source-derived rules: `H01`, `H02`, `H06`.
- Storyboard trigger: begin with an island, coast, and pumping well.
- Viewer question: how can an analytical response satisfy the coastline?
- Visual object: island aquifer geometry, coastline map, pumping well, response rings, and exterior image well.
- Visual antecedent: the island is visible before notation.
- Transformation from previous scene: the first response rings meet the coast.
- Motion purpose: the image-well rings move because their overlap reveals the boundary correction.
- Step detail: reveal island, pump, rings, then the paired image well.
- Why this step is valid: this is valid because the paper applies the circle theorem and image-well construction.
- Transition bridge: corrected rings become spatial head contours.
- What the viewer learns: the image well enforces a boundary effect without a full numerical solve.
- Minimal on-screen text: image well.
- Formula: none.
- QA risks: the image well must remain outside the island.

## Scene 2: The solution becomes a management constraint
- Source-derived rules: `H06`, `H08`, `H09`.
- Storyboard trigger: the corrected response must return to head and interface depth.
- Viewer question: what decision does the fast solution support?
- Visual object: head contours and a visible safe region around the pumping well.
- Visual antecedent: corrected response rings from Scene 1.
- Transformation from previous scene: rings settle into head contours.
- Motion purpose: a highlighted interval becomes visible because the head field creates the pumping constraint.
- Step detail: draw contours, preserve the pump, then reveal the constraint region.
- Why this step is valid: this is valid because the paper computes head/interface depth and demonstrates pumping optimization.
- Transition bridge: move from the constraint back to the original island aquifer geometry.
- What the viewer learns: pumping, recharge, and coastline geometry can be evaluated together.
- Minimal on-screen text: head and interface depth.
- Formula: none.
- Uncertainty shape: uncertainty appears as a bounded interval, shaded band, and width around the safe region.
- QA risks: describe the example as illustrative, not a universal safe yield.

## Scene 3: Recharge lifts the freshwater lens
- Source-derived rules: `H02`, `H05`.
- Storyboard trigger: preserve the island aquifer while recharge arrows enter.
- Viewer question: which forcing opposes pumping?
- Visual object: aquifer surface, recharge arrows, and a rising head contour.
- Visual antecedent: the original island map remains from the previous scene.
- Transformation from previous scene: the safe interval moves to the recharge contour.
- Motion purpose: the contour grows because recharge raises hydraulic head.
- Step detail: dim the well, add recharge, then move the contour upward.
- Why this step is valid: this is valid because recharge is an explicit forcing in the analytical solution.
- Transition bridge: move from recharge to the pumping-well response.
- What the viewer learns: the solution superposes pumping and recharge.
- Minimal on-screen text: recharge.
- Formula: none.
- QA risks: keep recharge arrows inside the island.

## Scene 4: Pumping depresses head and the interface responds
- Source-derived rules: `H03`, `H06`.
- Storyboard trigger: reactivate the pumping well after recharge is visible.
- Viewer question: how does pumping alter freshwater-lens thickness?
- Visual object: pumping point, head contour, and interface surface.
- Visual antecedent: the recharge-supported aquifer remains visible.
- Transformation from previous scene: the head contour shrinks toward the well.
- Motion purpose: the interface moves because pumping changes the head field.
- Step detail: pulse the well, lower head, then move the interface toward its limit.
- Why this step is valid: this is valid because the paper solves both head and interface depth.
- Transition bridge: move from one well to multiple wells.
- What the viewer learns: interface depth is the decision-relevant state.
- Minimal on-screen text: interface depth.
- Formula: none.
- QA risks: avoid depicting density mixing not represented by the sharp-interface model.

## Scene 5: Image wells follow the boundary construction
- Source-derived rules: `H02`, `H04`.
- Storyboard trigger: place each exterior image after its real well.
- Viewer question: why is the exterior point needed?
- Visual object: paired points, connecting radius, and coastline geometry.
- Visual antecedent: the original pumping point remains on the map.
- Transformation from previous scene: the point moves along its radius to form the image pair.
- Motion purpose: the paired point reveals how the boundary condition is constructed.
- Step detail: draw radius, extend it, and place the image outside the coast.
- Why this step is valid: this is valid because the image location follows the circle theorem.
- Transition bridge: move from paired points to corrected contours.
- What the viewer learns: the exterior point is mathematical, not a physical injection well.
- Minimal on-screen text: mathematical image.
- Formula: none.
- QA risks: distinguish mathematical images from field wells.

## Scene 6: Superposition builds the multi-forcing response
- Source-derived rules: `H03`, `H07`.
- Storyboard trigger: retain each response field and combine them.
- Viewer question: can several wells and recharge be evaluated together?
- Visual object: aquifer map, overlapping contour fields, and a combined surface.
- Visual antecedent: corrected single-well contours remain from the previous scene.
- Transformation from previous scene: separate fields overlay and become one head map.
- Motion purpose: overlays show because linear superposition constructs the combined response.
- Step detail: add recharge field, well fields, then the combined field.
- Why this step is valid: this is valid because the paper uses superposition for multiple forcings.
- Transition bridge: move from the combined map to vulnerability indices.
- What the viewer learns: analytical speed supports repeated scenario evaluation.
- Minimal on-screen text: superposition.
- Formula: none.
- QA risks: do not imply heterogeneous properties absent from the example.

## Scene 7: Vulnerability is a spatial derivative, not a slogan
- Source-derived rules: `H05`, `H08`.
- Storyboard trigger: perturb one forcing while the map remains fixed.
- Viewer question: where is the interface most sensitive?
- Visual object: aquifer map, colored sensitivity band, interval, and residual width.
- Visual antecedent: the combined head map remains from the previous scene.
- Transformation from previous scene: contours become a spatial vulnerability surface.
- Motion purpose: color changes reveal the response to a forcing perturbation.
- Step detail: perturb pumping, compute the change, then shade its spatial distribution.
- Why this step is valid: this is valid because the paper differentiates the solution to define vulnerability indices.
- Transition bridge: move from the uncertainty band to a pumping constraint.
- What the viewer learns: vulnerability varies across the island.
- Minimal on-screen text: vulnerability.
- Formula: none.
- Uncertainty shape: uncertainty is shown as a shaded band, interval width, and spatial distribution.
- QA risks: do not present the illustrative map as Kinmen observations.

## Scene 8: Return the constraint to the island aquifer
- Source-derived rules: `H09`, `H10`.
- Storyboard trigger: bring the safe region back to the original scientific object.
- Viewer question: what can the method support without claiming a universal safe yield?
- Visual object: original island aquifer map, wells, coastline, and bounded safe interval.
- Visual antecedent: vulnerability distribution from the previous scene.
- Transformation from previous scene: the distribution shrinks and moves back onto the original map.
- Motion purpose: the interval returns because the decision belongs to a specified island scenario.
- Step detail: restore coastline, place wells, and overlay the bounded constraint.
- Why this step is valid: this is valid because the paper demonstrates scenario-specific pumping optimization.
- Transition bridge: return from the analysis to the original aquifer geometry.
- What the viewer learns: the framework is fast and flexible, while its limits remain model conditioned.
- Minimal on-screen text: scenario-specific constraint.
- Formula: none.
- Uncertainty shape: uncertainty remains a bounded interval, shaded band, and visible width.
- QA risks: preserve the interpretation boundary in the final frame.
