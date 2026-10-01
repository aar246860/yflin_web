---
title: "Lagging Theory"
subtitle: "A way to test when groundwater flux and gradient stop moving together."
metaDescription: "Lagging Theory tests flux-gradient asynchrony in groundwater pumping, recovery, periodic head, and thermal-response interpretation."
lang: "en"
translationKey: "concept-lagging-theory"
date: 2026-06-12
updated: 2026-10-01
concept: "Lagging theory"
tags: ["Lin and Yeh 2017", "generalized Darcy law", "flux-gradient lag"]
evidenceLevel: "diagnostic"
sourceProjects: ["Lagging Theory manuscripts", "thermal-response extension", "Lagging Darcy review draft"]
relatedPublications:
  - "A Lagging Model for Describing Drawdown Induced by a Constant-Rate Pumping in a Leaky Confined Aquifer"
  - "Analysis of Unconfined Flow Induced by Constant Rate Pumping Based on the Lagging Theory"
  - "Well Hydraulics in Wedge-Shaped Aquifer: Unsteady Darcian Flow Model Revisited by Lagging Theory"
  - "Analysis of Groundwater Time Series with Limited Pumping Information in Unconfined Aquifer: Response Function Based on Lagging Theory"
  - "Simplified Theoretical Analyses of Lagging Darcy Flow and Land Subsidence"
  - "Lagging Theory for Periodic Hydraulic Head Signals in Aquifers"
audience: ["well hydraulics researchers", "reviewers", "method developers"]
collaborationRelevance: "Use when a team sees timing or amplitude mismatch and needs to know whether it improves prediction beyond curve fit."
summaryZh: "延遲理論不是把反應曲線簡單平移，而是檢驗通量、梯度、水頭、邊界或自由水面是否存在非同步反應，並追問這種非同步是否改變工程判斷。"
draft: false
order: 1
researchQuestion: "When does flux-gradient asynchrony explain something that extra parameters alone cannot?"
decisionUse: "Check whether asynchronous-response parameters improve prediction and decision variables after complexity, identifiability, and validation checks."
---

<span id="the-core-mechanism" aria-hidden="true"></span>

## Model Idea

Lagging Theory revisits one groundwater-flow assumption. Classical Darcy's law relates water flux to the hydraulic gradient at the same instant at the continuum scale. Flux means water moving through the aquifer; the gradient describes the spatial change in head or drawdown that drives that flow. [Lin and Yeh (2017)](https://doi.org/10.1002/2017WR021115) allowed flux and drawdown gradient to adjust on different macroscopic response times in a constant-rate pumping model.

In this context, "lag" can change the shape of a response, rather than simply shift a curve along the time axis. The two lag parameters summarize a delayed relation at the model's observation scale. They do not identify a unique microscopic cause.

The two lag times in the 2017 formulation have distinct roles, using the same notation as the demonstration below:

- flux-response lag, τ<sub>q</sub>, belongs to the water-flux side of the relation;
- drawdown-gradient lag, τ<sub>s</sub>, belongs to the drawdown-gradient side.

For the initial conditions used in this demo, equal lags cancel in the transfer relation; setting both to zero gives the classical Darcy limit directly. Try the [Classical Darcy preset in the pumping demo](#lagging-pumping-demo), then separate the lags to see how the early response changes. This is a teaching calculation, not a calibrated field test; it omits wellbore storage and finite well radius.

## Published Cases

- **Constant-rate pumping, 2017.** [Lin, Y.-C., and Yeh, H.-D., Water Resources Research](https://doi.org/10.1002/2017WR021115) formulated lagging flow in a leaky confined aquifer and compared its solution with a fractured-aquifer pumping record from South Dakota. The reported fit was particularly good at early pumping time, and fitted lag behavior varied with observation distance. The [NYCU publication record](https://scholar.nycu.edu.tw/en/publications/a-lagging-model-for-describing-drawdown-induced-by-a-constant-rat/) provides the abstract and published citation.
- **Periodic hydraulic head, 2026.** [Lin and Kurylyk, Journal of Hydrology](https://doi.org/10.1016/j.jhydrol.2026.134913) examined why diffusivity inferred from amplitude damping can disagree with diffusivity inferred from phase lag. Their two-lag formulation reconciled these signatures in reanalyses of existing Tuolumne Meadows and Meghna River records. See the [publisher record](https://www.sciencedirect.com/science/article/pii/S0022169426000107) for the study and its assumptions.

These comparisons support the model's ability to describe the reported responses under the stated assumptions. Improved calibration fit alone does not establish prediction at a new well, frequency, or site, nor prove which physical mechanism caused a fitted lag. Flow-path adjustment, domain exchange, drainage, leakage, storage, and unresolved heterogeneity remain possible interpretations to distinguish with additional evidence. The [minimum tests below](#minimum-tests) describe validation goals, rather than results established for every application.

## Concise Definition

Lagging Theory tests whether asynchronous hydraulic response changes interpretation. Boundary movement and thermal response are explored as extensions; each requires its own model assumptions and validation.

The testable claim is narrow. If asynchronous response matters, a lagging formulation should improve residual structure, parameter transfer, held-out prediction, and at least one engineering decision variable after complexity and identifiability checks.

## Extensions

Subsequent work applies the same test to different response settings:

- in unconfined aquifers, lag times enter the free-surface condition and represent capillary-fringe release and capillary-suction drainage;
- in [periodic head signals](https://doi.org/10.1016/j.jhydrol.2026.134913), flux lag and head lag separate amplitude damping from phase offset, addressing phase-amplitude diffusivity mismatch;
- in engineering interpretation, the lagging equation becomes one candidate analytical model for transforming measured response into inferred properties and decision variables.

Lagging Theory complements Darcy, Theis, Neuman, delayed-yield, leakage, and dual-porosity models by testing one specific possibility: the hydraulic response may contain flux-gradient asynchrony.

## Minimum Tests

A lagging model should pass more than calibration fit:

1. Residual structure improves in a meaningful way.
2. Complexity penalties do not erase the gain.
3. Parameters are identifiable enough for the intended decision.
4. Synthetic known-truth coverage is acceptable.
5. Field prediction improves on held-out time, recovery, or wells.
6. The difference propagates to an engineering decision variable.

For pumping-test applications, see [When Does a Pumping Test Need Lagging Darcy Law?](../../field-notes/when-does-a-pumping-test-need-lagging-darcy-law/).

## Relation to Other Non-Equilibrium Models

Mathematical overlap with dual-porosity, delayed-yield, and other non-equilibrium models is informative. It provides a compact way to test whether flow-path adjustment, inter-domain exchange, capillary drainage, hydro-mechanical coupling, or field-scale delayed response affects the interpretation.

## Discuss a Research Question

For an academic discussion, use the [research collaboration route](../../collaborate/#academic-research). A useful starting point is a specific question about transfer across frequencies or sites, comparison with a dual-domain model, or reanalysis of pumping and recovery records. Describe the forcing, the observed mismatch, the competing explanations, and what would count as a successful test. Contact [Ying-Fan Lin at yflin1110@cycu.edu.tw](mailto:yflin1110@cycu.edu.tw?subject=Lagging%20Theory%20research%20discussion).
