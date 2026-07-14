You are acting as a strict external language auditor for a public academic website, not as a factual source.

Context:
This is Dr. Ying-Fan Lin's groundwater hydraulics group website. The audience is hydrologists, groundwater modelers, well-hydraulics researchers, engineering consultants, and potential collaborators. The site should read like a credible research-group website, closer to Stanford ML Group style: sparse, direct, research-first, and not like AI-generated marketing copy.

Task:
Audit the following public copy for AI residue, software/product jargon, inflated wording, unnatural English, and terms that groundwater/well-hydraulics readers would not naturally use. Preserve scientific meaning. Do not invent facts. Give only actionable findings.

Preferred terminology:
- analytical model, aquifer-test interpretation, drawdown, recovery, hydraulic gradient, flux, leakage, delayed yield, model-form uncertainty, transformation uncertainty, parameter interpretation, engineering decision variable.

Avoid unless technically necessary:
- workflow, pipeline, module, package, gate, validator, endpoint, fallback, x-ray, robust, scalable, AI-readable, agent, prompt, loop, intelligence.

Output format:
## Overall Verdict
## Must Fix
Table: location | phrase | why it reads poorly | replacement
## Recommended Edits
Table: location | phrase | replacement
## Terms to Standardize
## Recheck Checklist

Website copy sample:

[Home hero]
Lin Groundwater Hydraulics Group
We develop analytical, numerical, and data-supported methods for groundwater decisions.
The group is directed by Ying-Fan Lin and focuses on aquifer-test interpretation, Lagging Theory, transformation uncertainty, and subsurface energy systems influenced by groundwater flow.

[Home project intro]
We study how measured drawdown, recovery, hydraulic gradients, and thermal response become interpreted parameters and design limits. The common question is when the model used for interpretation changes the decision.
Current lines of work connect analytical well hydraulics, non-instantaneous response, and uncertainty propagation for groundwater and subsurface-energy problems.

[Transformation Uncertainty project]
Drawdown is measured; hydraulic parameters are interpreted through a model.
Different analytical models can translate the same field response into different hydraulic parameters and decision limits.
Audit model-form choices, compare parameter transformations, and propagate the difference to engineering decision variables.
Model-conditioned uncertainty ranges for pumping limits, recovery time, thermal margins, and risk buffers.

[Tools page]
Make Lagging Theory and transformation uncertainty testable.
The list below separates public teaching demos, selected research code, archival analytical code, and collaboration routes. Some working repositories remain private while manuscripts, data permissions, or release notes are still unsettled.
Repository metadata and README scope statements were checked on 2026-06-20. Entries are included only when their assumptions and limits can be stated plainly.
An interactive constant-rate pumping-test example comparing a classical response and a lag-aware response.
A qualitative screening tool for deciding whether lag-aware aquifer-test interpretation should be checked before decision transfer.
MIT-licensed Python research tool for transformation-uncertainty intervals in thermal response test interpretation.
Applied collaboration route, not open-source software or a guarantee of safety.

[Decision Lab]
Test whether lag-aware aquifer-test interpretation matters before it enters a decision.
The Decision Lab turns Lagging Darcy Law and transformation uncertainty into screening tests. The first tool is qualitative by design: it flags when evidence should be checked, not what a site-specific design value should be.
This screening tool asks whether a conventional pumping-test interpretation is likely sufficient, or whether a lag-aware interpretation should be checked before the result is used in a decision.
Next tools should expose model-to-decision consequences.
These are planned as public screening and teaching tools, not substitutes for calibrated field analysis.
Translate model-choice sensitivity into qualitative exposure for allowable pumping and recovery criteria.
Screen when groundwater flow and thermal response uncertainty may move a design margin.
Show how models that fit the same observation window can imply different decisions.
