# Claim-To-Publication Map: Lagging Theory-First Website

Date: 2026-06-12

Status: review draft. Verify all metadata before public launch.

## Claim Boundary

The site should make claims at three levels:

Published
: Supported by publication inventory and suitable for public copy after metadata check.

Diagnostic
: Plausible synthesis or framework-level interpretation, but should be worded as a testable diagnostic rather than a universal physical law.

Emerging
: Supported by internal projects or current manuscripts; suitable for field notes or collaboration language, but not as final public proof.

## Public Claims

### Claim 1

Groundwater response can arrive late.

Level: Published.

Supporting publication lineage:
- 2017, Water Resources Research, "A Lagging Model for Describing Drawdown Induced by a Constant-Rate Pumping in a Leaky Confined Aquifer"
- 2019, Water Resources Research, "Analysis of Unconfined Flow Induced by Constant Rate Pumping Based on the Lagging Theory"
- 2024, Water Resources Research, "Analysis of Groundwater Time Series with Limited Pumping Information in Unconfined Aquifer: Response Function Based on Lagging Theory"
- 2026, Journal of Hydrology, "Lagging Theory for Periodic Hydraulic Head Signals in Aquifers"

Safe wording:

> Groundwater response can arrive late.

Avoid:

> All delayed groundwater responses are caused by Lagging Theory.

Technical boundary:

> In the strict 2017 formulation, the delay is introduced through phase lags between water flux and drawdown gradient in a generalized Darcy-law model.

### Claim 2

That delay may be the signal.

Level: Diagnostic.

Supporting evidence:
- Lagging Theory publication lineage.
- Field-note concept pages on groundwater memory and delayed response.
- Internal delayed-response projects: TU_Lag, Lag_TRT, Lagging_Darcy_WRR_20260607.

Safe wording:

> Delay may contain recoverable information about flux-gradient adjustment, structural interaction, noninterconnected pores or fractures, capillary drainage, or field-scale pathway equilibration.

Avoid:

> Delay is always physically meaningful.

### Claim 3

Lagging Theory is a testable pathway, not a universal replacement for classical models.

Level: Diagnostic, but conservative and defensible.

Supporting evidence:
- Existing concept page already states that Lagging Theory should not be sold as a single superior substitute for Darcy-based aquifer-test interpretation.
- Publication lineage positions it as a response model and diagnostic extension.

Safe wording:

> Lagging Theory provides a disciplined diagnostic pathway for testing flux-gradient, free-surface, or phase-amplitude delays in field data.

Avoid:

> Lagging Theory replaces Theis, Neuman, delayed yield, leakage, or dual-porosity models.

### Claim 4

Drawdown is measured; transmissivity is interpreted.

Level: Emerging for public homepage, stronger for field notes.

Supporting evidence:
- TU_Lag internal evidence ledger.
- Concept page: Transformation Uncertainty.
- Related publication inventory includes "Rethinking Aquifer Characterization: Insights from Lagging Models" (2025, Journal of Hydrology).

Safe wording:

> Drawdown, recovery, and temperature are measured. Aquifer and thermal properties are interpreted through model pathways.

Avoid:

> Conventional transmissivity estimates are wrong.

### Claim 5

Thermal response tests need groundwater-aware delay diagnostics.

Level: Published plus emerging.

Supporting publication lineage:
- 2026, Case Studies in Thermal Engineering, "Analytical Modeling of Grout Heat Storage Effects in Thermal Response Tests: Toward Faster and More Reliable Parameter Estimation"
- 2025, Water Resources Research, "On Radial Heat Transport in Porous Aquifers with Nonlinear Velocity-dependent Thermal Dispersion"
- 2024, Heat Transfer, "Application of the Image-Well Method for Transient Borehole Thermal Energy Storage Systems with Complex Boundaries"
- 2023, Groundwater, "Effects of Soil Type and Thermal Boundary on Predicting Temperature Profiles and Groundwater Fluxes"

Safe wording:

> TRT and shallow geothermal interpretation can be biased when groundwater movement, grout heat storage, or delayed thermal response is treated as a nuisance.

Avoid:

> Current TRT practice is unreliable.

Technical boundary:

> Thermal response should be presented as an application surface and analogy, not as the original core of Lagging Theory.

### Claim 6

The framework supports engineering decisions.

Level: Emerging for transformation uncertainty; published for specific modeling components.

Supporting evidence:
- TU_Lag decision-propagation objective.
- Publications across well hydraulics, stream depletion, groundwater time series, and TRT.

Safe wording:

> The purpose is to test whether interpretation pathways change decision endpoints such as pumping limits, recovery time, design margins, or uncertainty buffers.

Avoid:

> The framework guarantees better decisions.

## Publication Inventory Used

Extracted from `src/data/publications.generated.json`:

- 2017 | Water Resources Research | A Lagging Model for Describing Drawdown Induced by a Constant-Rate Pumping in a Leaky Confined Aquifer
- 2019 | Water Resources Research | Analysis of Unconfined Flow Induced by Constant Rate Pumping Based on the Lagging Theory
- 2022 | Journal of Hydrology | Well Hydraulics in Wedge-Shaped Aquifer: Unsteady Darcian Flow Model Revisited by Lagging Theory
- 2024 | Water Resources Research | Analysis of Groundwater Time Series with Limited Pumping Information in Unconfined Aquifer: Response Function Based on Lagging Theory
- 2025 | Advances in Water Resources | Simplified Theoretical Analyses of Lagging Darcy Flow and Land Subsidence in a Groundwater Pumping System of Three Horizontal Layers: An Elastic Thin Plate Approach
- 2025 | Journal of Hydrology | Rethinking Aquifer Characterization: Insights from Lagging Models
- 2025 | Journal of Hydrology | Integrating Stream Storage and Lagging Effects in Analytical Models for Stream Depletion Prediction
- 2026 | Journal of Hydrology | Lagging Theory for Periodic Hydraulic Head Signals in Aquifers
- 2026 | Case Studies in Thermal Engineering | Analytical Modeling of Grout Heat Storage Effects in Thermal Response Tests: Toward Faster and More Reliable Parameter Estimation

## Launch Rule

Before publishing, each homepage claim should be checked against this map:

1. Is the claim published, diagnostic, or emerging?
2. Does the sentence imply universality?
3. Does the sentence attack existing models unnecessarily?
4. Does the sentence explain a decision consequence?
5. Can the visitor trace the claim to at least one publication or project page?
