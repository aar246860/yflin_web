You are reviewing the public-facing English copy of Dr. Ying-Fan Lin's groundwater hydraulics website.

Task: Identify wording that sounds AI-generated, like internal design notes, software/agent jargon, inflated marketing, or terminology that groundwater/well-hydraulics readers would find unnatural. Preserve the scientific meaning. Do not rewrite everything. Return only actionable findings.

Audience: hydrologists, groundwater modelers, well-hydraulics researchers, and engineering collaborators.

House style to preserve:
- Prefer precise groundwater terms: analytical model, pumping test, hydraulic gradient, flux, drawdown, recovery, leakage, delayed yield, model uncertainty, parameter interpretation, decision reliability.
- Avoid generic AI/product wording unless technically necessary: workflow, pipeline, gate, fallback, package, prompt, loop, AI-readable, robust, scalable, intelligence, x-ray, module.
- Avoid overclaiming. Use measured academic language.
- Keep tone similar to Stanford ML Group style: direct, sparse, credible, research-first.

Deliver your review in four sections:
1. MUST FIX: exact original phrase, why it is a problem, replacement.
2. RECOMMENDED: exact original phrase, replacement.
3. TERMS TO STANDARDIZE: terms that should be replaced across the site.
4. PASS/NO-PASS: whether the copy is acceptable after the must-fix items are addressed.

Website copy sample follows.

## src/pages/index.astro
- #group
- /#person
- #defined-term
- /concepts/
- stanford-project-card stanford-project-card--
- /concepts//
- /field-notes//
- astro:content
- ../layouts/BaseLayout.astro
- ../data/members.generated.json
- ../data/publications.generated.json
- ../data/groupSite
- /concepts/lagging-theory/
- lagging-theory
- Lagging Theory
- M7 18c3.3-7.6 6.6-7.6 10 0M4 10h16M4 14h16M5 18h14
- transformation-uncertainty
- Transformation Uncertainty
- M4 7h7v7H4zM13 10h7v7h-7zM11 10l2 2M11 14l2-2
- groundwater-memory
- Groundwater Memory
- M5 8c2.5-3 5-3 7.5 0S17.5 11 20 8M5 13c2.5-3 5-3 7.5 0s5 3 7.5 0M5 18c2.5-3 5-3 7.5 0s5 3 7.5 0
- thermal-response-energy
- Subsurface Energy

## src/data/groupSite.ts
- lagging-theory
- Lagging Theory and Flux-Gradient Asynchrony
- When drawdown, recovery, or hydraulic gradients do not respond instantaneously.
- Classical aquifer-test interpretation often assumes the flux-gradient relation is instantaneous at the scale of analysis.
- Develop analytical lag-aware models and compare them against classical well-hydraulic interpretations.
- Diagnostic criteria for deciding when a lag-aware analytical model should be tested before parameter transfer.
- Ying-Fan Lin
- Barret L. Kurylyk
- student project lines
- /concepts/lagging-theory/
- Decision demo
- /decision-lab/
- transformation-uncertainty
- Transformation Uncertainty in Aquifer-Test Interpretation
- Different analytical models can translate the same field response into different hydraulic parameters and decision limits.
- Audit model-form choices, compare parameter transformations, and propagate the difference to engineering endpoints.
- Model-conditioned uncertainty ranges for pumping limits, recovery time, thermal margins, and risk buffers.
- transformation-uncertainty manuscript
- /concepts/transformation-uncertainty/
- groundwater-memory
- Groundwater Memory and Delayed Response
- Past forcing can remain visible in present hydraulic signals.
- Pumping, recharge, boundary movement, and aquitard exchange can leave timing structure that is lost in static parameter summaries.
- Use response timing, recovery behavior, and analytical-model residuals to separate measured records from interpreted parameters.

## src/pages/concepts/index.astro
- astro:content
- ../../layouts/BaseLayout.astro
- ../../components/ConceptCard.astro
- Core Concepts
- Concept map for Lagging Theory, flux-gradient asynchrony, transformation uncertainty, and subsurface energy decisions influenced by groundwater flow.
- shell section
- section-head

## src/content/concepts/lagging-theory.md
- Lagging Theory begins with one change to the usual groundwater-flow assumption. Classical Darcy's law treats water flux and hydraulic gradient as simultaneous at the continuum scale. Lin and Yeh (2017) allowed water flux and drawdown gradient to move out of phase in a constant-rate pumping-test formulation.
- The word "lag" does not mean that every case is a simple time shift. In field systems, out-of-step behavior may come from tortuous flow paths, inertial effects, hydro-mechanical coupling, fracture-matrix or pore-domain exchange, capillary drainage, leakage, boundary storage, or unresolved heterogeneity.
- The two lag times in the 2017 formulation have different diagnostic meanings:
- - flux lag reflects fast transient adjustment, including inertial effects in high-permeability paths;
- - gradient or head-development lag reflects structural interaction, including noninterconnected pores, noninterconnected fractures, or non-equilibrium exchange between communicating domains.
- If the two lags are equal, the lagging effect disappears in the 2017 formulation. If flux lag and head or gradient lag differ, the response can depart from classical diffusion in a way that has physical content.
- Lagging Theory tests whether flux, hydraulic gradient, drawdown, boundary movement, or thermal response move asynchronously. It is not a generic time-shift model. The same observed lag can come from tortuous flow paths, inter-domain exchange, delayed drainage, fracture-matrix communication, aquitard leakage, hydro-mechanical coupling, inertial effects, or unresolved heterogeneity.
- The testable claim is narrow. If asynchronous response matters, a lagging formulation should improve residual structure, parameter transfer, held-out prediction, and at least one engineering decision variable after complexity and identifiability checks.
- The later research line keeps the same discipline but changes the response surface:
- - in unconfined aquifers, lag times enter the free-surface condition and represent capillary-fringe release and capillary-suction drainage;
- - in periodic head signals, flux lag and head lag separate amplitude damping from phase offset, addressing phase-amplitude diffusivity mismatch;
- - in engineering interpretation, the lagging equation becomes one candidate analytical model for transforming measured response into inferred properties and decision variables.
- Lagging Theory should not be presented as a superior substitute for Darcy, Theis, Neuman, delayed-yield, leakage, or dual-porosity models. Its value comes from testing a specific possibility: the hydraulic response may contain flux-gradient asynchrony.
- A lagging model should pass more than calibration fit:
- 1. Residual structure improves in a meaningful way.
- 2. Complexity penalties do not erase the gain.
- 3. Parameters are identifiable enough for the intended decision.
- 4. Synthetic known-truth coverage is acceptable.
- 5. Field prediction improves on held-out time, recovery, or wells.
- 6. The difference propagates to an engineering decision variable.
- For pumping-test applications, see When Does a Pumping Test Need Lagging Darcy Law?.
- If a lagging equation resembles dual-porosity, delayed-yield, or other non-equilibrium models, that overlap is useful rather than embarrassing. It gives a compact way to test whether flow-path adjustment, inter-domain exchange, capillary drainage, hydro-mechanical coupling, or field-scale delayed response affects the interpretation.

## src/content/concepts/transformation-uncertainty.md
- Classical groundwater studies often treat aquifer-test parameters as inputs to later uncertainty analysis. This work moves the review one step earlier.
- The measured object is the drawdown or recovery response. Transmissivity and storage are interpreted with an aquifer-test model: Theis, leaky aquifer, lagging Darcy, dual-porosity, a numerical inverse model, or another response model. Each analytical model carries its own bias, dispersion, identifiability limits, and support scale.
- Drawdown, recovery, and temperature are measured. Aquifer and thermal properties are inferred through analytical or numerical interpretation models. Transformation uncertainty follows the full chain from measured record to apparent parameter to engineering decision variable.
- Data methods are useful only when they remain attached to the physical interpretation problem. Here, they can support record organization, candidate-model comparison, sensitivity checks, diagnostic review, and evidence organization when the results are checked against analytical-model behavior. They do not replace analytical-model checks, identifiability analysis, held-out prediction, or decision-level uncertainty propagation.
- The current transformation-uncertainty manuscript supports cautious wording:
- - pumping-test transmissivity and storage are inferred parameters produced by an interpretation model;
- - the study reviews front-end drawdown-to-parameter transformation uncertainty;
- - a 10,000-scenario numerical benchmark provides conditional transformation model factors for four aquifer-test interpretation models;
- - field cases provide diagnostics, not proof of true aquifer parameters.
- The website should not claim that mature groundwater uncertainty methods are absent, nor should it imply that one analytical model replaces established hydrogeology.
- Engineering decisions inherit interpretation choices. A fitted parameter can look precise while still carrying transformation error from model form, time window, boundary simplification, and field support.
- The collaboration value is concrete: identify where interpretation uncertainty changes allowable pumping, response time, recovery planning, or design threshold.

## src/content/concepts/groundwater-memory.md
- Delayed hydraulic response is not a loose metaphor here. It means that today's hydraulic-head, drawdown, recovery, or temperature record may still carry past gradients, boundary forcing, drainage, or domain exchange because flux, head, free-surface movement, or boundary response did not adjust instantly.
- Mechanisms can include asynchronous Darcy flux, capillary-fringe drainage, delayed yield, fracture-matrix exchange, aquitard leakage, wellbore or boundary storage, hydro-mechanical coupling, and effective averaging over heterogeneous flow paths.
- The point is not to rename every non-equilibrium model. The point is to make non-instantaneous response checkable across models and applications.
- The question is not whether memory sounds attractive. The question is whether the present field record contains recoverable information about a specific lagging mechanism or analytical representation.
- Lagging Theory represents delayed hydraulic response by placing causal asynchrony inside the flux-gradient relation or related free-surface and periodic-response formulations. Its value depends on comparison with conventional alternatives, not on claiming a single physical explanation.
- The next step is to connect delayed-response signatures to decision consequences:
- - how quickly drawdown propagates to a control point;
- - how long recovery should take after pumping stops;
- - whether phase and amplitude imply inconsistent diffusivities under a classical model;
- - whether thermal response tests under- or over-estimate effective formation properties;
- - whether field time series contain site-scale storage release that changes management timing.

## src/content/concepts/subsurface-energy-intelligence.md
- Why This Is Not Just Thermal Engineering
- Thermal response tests and shallow geothermal systems are often treated as heat-transfer problems. In real aquifers, groundwater flow, heterogeneity, boundary conditions, grout heat storage, and field support can change the inferred parameters.
- TRT and shallow geothermal designs can be biased when groundwater movement, grout heat storage, phase-amplitude mismatch, or non-instantaneous thermal-hydraulic response is treated as a nuisance. The goal is to turn groundwater-aware interpretation into design margins that teams can defend.
- That makes groundwater-influenced subsurface energy a natural application for the same aquifer-test interpretation logic:
- The strongest external collaboration is not a generic geothermal study. It is a field pilot where the decision depends on whether thermal or hydraulic parameters are reliable enough for design.
- - industrial water-energy planning;
- - shallow geothermal pilots in groundwater-active settings;
- - TRT datasets where early-time and late-time behavior imply different properties;
- - field sites where boundary effects, groundwater flow, or delayed-response effects may change inferred properties.

## src/pages/tools/index.astro
- #collection
- /#person
- #tool-list
- ../../layouts/BaseLayout.astro
- @/components/starwind/badge
- @/components/starwind/button
- ../../data/openTools
- ../../lib/seo
- Public demonstrator
- SoftwareApplication
- Collaboration route
- SoftwareSourceCode
- research package
- CollectionPage
- Open Tools and Reproducible Methods
- A curated showcase of Ying-Fan Lin
- Groundwater model-assumption and decision audit
- ScientificApplication
- Open Tools and Reproducible Examples
- Open demos, selected research code, archival analytical code, and collaboration routes for Lagging Darcy Law and transformation uncertainty.
- shell section tools-hero
- tools-hero__copy
- /decision-lab/
- noopener noreferrer

## src/data/openTools.ts
- Public demonstrator
- Research code
- Archival code
- Collaboration route
- teaching demo
- research package
- archival artifact
- service route
- normalized-ldl-response
- Normalized LDL response animation
- A browser-computed normalized response that shows how tau_h greater than tau_q can create an S-like delayed transition.
- Explains why Lagging Darcy Law is not just a visual delay and why response shape can change before parameter transfer.
- Use as a first explanation for collaborators, students, reviewers, or technical teams that need a concrete LDL calculation.
- Implemented in the public website component TransformationUncertaintyDemo.astro and labeled as a Lin-Yeh special case.
- /concepts/transformation-uncertainty/#normalized-ldl-demo
- Concept page
- /concepts/transformation-uncertainty/
- Lagging Darcy Law
- normalized response
- teaching calculation
- lagging-pumping-test-demo
- Lagging pumping-test diagnostic demo
- An interactive constant-rate pumping-test module comparing a classical response and a lag-aware response.
- Shows when separated flux and gradient response lags can create early-time residual structure and timing shifts.

## src/pages/training/index.astro
- ../../layouts/BaseLayout.astro
- @/components/starwind/button
- ../../data/groupSite
- Training modules for students and collaborators in aquifer-test interpretation, transformation uncertainty, research writing, and careful use of AI tools.
- shell section group-page-hero
- shell section training-list
- Training modules
- training-entry

## src/pages/collaborate/index.astro
- ../../layouts/BaseLayout.astro
- @/components/starwind/button
- ../../components/research/CollaborationModeCard.astro
- ../../components/research/ConferencePresence.astro
- ../../components/research/ResearchHero.astro
- Collaborate on Aquifer-Test and Thermal-Response Interpretation
- Collaboration routes for aquifer-test residuals, TRT interpretation, transformation uncertainty, and subsurface energy decisions.
- Collaboration modes
- Bring the aquifer-test record that the conventional interpretation cannot explain.
- A useful collaboration starts with one stubborn pattern: delayed recovery, flux-gradient asynchrony, phase-amplitude mismatch, TRT disagreement, or residual structure that may change a design or management decision.
- Send three things.
- What was the forcing history? Which flux, head, drawdown, recovery, temperature, boundary, or deformation record moved out of step? Which decision changes if the response is interpreted with a different analytical model?
- Email a technical brief
- /services/groundwater-decision-reliability-audit/
- Request a model-assumption audit
- /publications/
- Check publication map
- forcing history
- measured drawdown/recovery
- decision variable
- aquifer-test interpretation
- drawdown/recovery
- TRT uncertainty
- hydro-mechanical coupling

## src/pages/about/index.astro
- ../../layouts/BaseLayout.astro
- ../../components/ResearchLineage.astro
- About Ying-Fan Lin
- Ying-Fan Lin studies groundwater records whose timing differs from conventional aquifer-test or thermal-response models.
- shell section

## src/pages/team/index.astro
- ../../layouts/BaseLayout.astro
- @/components/starwind/button
- ../../data/members.generated.json
- ../../data/publications.generated.json
- ../../data/groupSite
- People and student activity in the Lin Groundwater Hydraulics Group directed by Ying-Fan Lin.
- shell section group-page-hero
- shell section
- section-head section-head--editorial
- /collaborate/
- person-card person-card--large
- person-card__avatar
- activity-strip activity-strip--large
- publication-list

## src/pages/llms.txt.ts
- - [Home]() - overview of the research program and collaboration direction.
- - [Lagging Theory]() - primary definition and diagnostic gates.
- - [Glossary]() - technical definitions for Lagging Darcy Law, hydrologic memory, model equivalence, and decision non-equivalence.
- - [Decision Lab]() - public screening tools for testing when lag-aware aquifer-test interpretation should be considered.
- - [Open Tools]() - selected public demonstrators, research code, archival analytical code, and collaboration routes with stated scope.
- - [Lagging pumping-test demo]() - calculation-backed teaching module for constant-rate pumping response with separated flux and gradient lags.
- - [When Does a Pumping Test Need Lagging Darcy Law?]() - validation gates for deciding when lagging interpretation is necessary.
- - [Delayed Hydraulic Response]() - response persistence and non-instantaneous recovery.
- - [Transformation Uncertainty]() - model-to-parameter and model-to-decision uncertainty.
- - [Groundwater Model-Assumption and Decision Audit]() - service route for data/model assumption audit and decision-variable mapping.
- - [Collaborate]() - collaboration entry point for groundwater and subsurface energy teams.
- - Evidence: Scope:
- astro:content
- ../data/glossary
- ../data/canonicalAnswers
- ../data/openTools
- # Ying-Fan Lin - Lagging Theory
- ## Core Definition
- Lagging Theory tests whether water flux, hydraulic gradient, drawdown, boundary movement, deformation, or thermal response evolve asynchronously enough to change interpretation or engineering decisions. Lag is a diagnostic trace of flux-gradient asynchrony, not a generic signal-processing time shift or curve-delay device.
- Lin and Yeh (2017) developed the constant-rate pumping-test formulation for a leaky confined aquifer by allowing water flux and drawdown gradient to adjust out of phase. Public summaries should not present the theory as a universal replacement for Theis, Neuman, delayed-yield, dual-porosity, leakage, or numerical groundwater models.
- ## Key Pages
- /concepts/lagging-theory/
- /decision-lab/
- /#lagging-pumping-demo
- /field-notes/when-does-a-pumping-test-need-lagging-darcy-law/
- /concepts/groundwater-memory/
- /concepts/transformation-uncertainty/
- /services/groundwater-decision-reliability-audit/
- /collaborate/
- ## Canonical Glossary Definitions

## src/pages/llms-full.txt.ts
- - Site:
- - Sitemap:
- - RSS:
- - Compact LLM map:
- - Glossary:
- - Decision Lab:
- - Open Tools:
- - Groundwater Model-Assumption and Decision Audit:
- URL:
- Tier:
- Maturity:
- Summary:
- Problem:
- Use when:
- Scope:
- Evidence:
- Primary link:
- Short answer:
- Answer:
- Evidence page:
- Citation hint:
- /glossary/#
- Definition:
- Why it matters:
- When it matters:
- Common misunderstanding:
- Proof status:
- /concepts//
- Research question:
- Decision use:
