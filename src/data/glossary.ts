export type GlossaryEntry = {
  slug: string;
  term: string;
  shortDefinition: string;
  whyItMatters: string;
  whenItMatters: string;
  commonMisunderstanding: string;
  proofStatus: "published concept" | "diagnostic use" | "research agenda" | "application framing";
  relatedPages: Array<{ label: string; href: string }>;
};

export const glossaryEntries: GlossaryEntry[] = [
  {
    slug: "lagging-darcy-law",
    term: "Lagging Darcy Law",
    shortDefinition:
      "Lagging Darcy Law is a generalized Darcy-law formulation in which groundwater flux and hydraulic-gradient response can adjust over different macroscopic time scales.",
    whyItMatters:
      "It provides a test for whether a fitted pumping-test curve contains out-of-step hydraulic behavior that affects inferred parameters or decisions.",
    whenItMatters:
      "It matters when early drawdown, recovery, boundary response, or residual structure changes after the assumed instantaneous flux-gradient relation is relaxed.",
    commonMisunderstanding:
      "It is not a simple time shift or a universal replacement for Theis, Neuman, leakage, delayed-yield, dual-porosity, or numerical models.",
    proofStatus: "published concept",
    relatedPages: [
      { label: "Lagging Theory", href: "/concepts/lagging-theory/" },
      { label: "Pumping-test necessity note", href: "/field-notes/when-does-a-pumping-test-need-lagging-darcy-law/" },
      { label: "Decision Lab", href: "/decision-lab/" },
    ],
  },
  {
    slug: "hydrologic-memory",
    term: "hydrologic memory",
    shortDefinition:
      "Hydrologic memory is the persistence of past forcing, boundary movement, storage exchange, or flow-path history in present groundwater response.",
    whyItMatters:
      "A present head, flux, recovery, or temperature record can retain information from previous stress periods, so a snapshot interpretation may misstate system readiness.",
    whenItMatters:
      "It matters when recovery is slow, cyclic hydraulic-head records retain phase structure, or a management decision depends on how quickly a system forgets previous pumping or recharge.",
    commonMisunderstanding:
      "Hydrologic memory is not a single mechanism. It may come from aquitard drainage, heterogeneous flow paths, domain exchange, capillary effects, or coupled deformation.",
    proofStatus: "diagnostic use",
    relatedPages: [
      { label: "Delayed hydraulic response", href: "/concepts/groundwater-memory/" },
      { label: "Why delayed response matters", href: "/field-notes/why-groundwater-memory-matters/" },
    ],
  },
  {
    slug: "flux-gradient-asynchrony",
    term: "flux-gradient asynchrony",
    shortDefinition:
      "Flux-gradient asynchrony means groundwater flux and the hydraulic gradient used to drive it do not evolve in perfect step at the interpretation scale.",
    whyItMatters:
      "It provides a mechanism-level diagnostic for residuals that additional parameters can obscure without resolving their relevance to an engineering decision.",
    whenItMatters:
      "It matters when a curve can be fitted, yet amplitude, phase, early-time response, or recovery timing remains inconsistent with the assumed hydraulic response mechanism.",
    commonMisunderstanding:
      "It tests whether instantaneous Darcy response is adequate for a specific data window and decision. It does not imply that Darcy's law is always inadequate.",
    proofStatus: "published concept",
    relatedPages: [
      { label: "Lagging Theory", href: "/concepts/lagging-theory/" },
      { label: "Flux-gradient note", href: "/field-notes/flux-gradient-asynchrony-is-not-simple-delay/" },
    ],
  },
  {
    slug: "transformation-uncertainty",
    term: "transformation uncertainty",
    shortDefinition:
      "Transformation uncertainty is the uncertainty introduced when measured responses are transformed through an aquifer-test or heat-transfer model into hydraulic parameters, design thresholds, or engineering decisions.",
    whyItMatters:
      "Two interpretation models can fit the same drawdown or recovery data yet transfer different values into pumping limits, recovery times, or safety margins.",
    whenItMatters:
      "It matters when the decision depends on parameters inferred through simplified analytical, numerical, or empirical models rather than directly measured quantities.",
    commonMisunderstanding:
      "It is broader than parameter confidence intervals because it includes analytical-model choice and model-to-decision propagation.",
    proofStatus: "diagnostic use",
    relatedPages: [
      { label: "Transformation Uncertainty", href: "/concepts/transformation-uncertainty/" },
      { label: "Model to decision note", href: "/field-notes/from-pumping-tests-to-decision-uncertainty/" },
    ],
  },
  {
    slug: "model-equivalence",
    term: "model equivalence",
    shortDefinition:
      "Model equivalence occurs when different hydrogeologic models or mechanisms produce practically similar observable responses over the available data window.",
    whyItMatters:
      "It defines a knowledge boundary for a pumping test: a good fit may not identify the mechanism that caused the response.",
    whenItMatters:
      "It matters when delayed yield, leakage, dual-domain exchange, skin, delayed response, or boundary movement can explain similar drawdown curves.",
    commonMisunderstanding:
      "Similar fit does not establish the same physical interpretation. The same residual score can support different parameter meanings and future decisions.",
    proofStatus: "research agenda",
    relatedPages: [
      { label: "Decision Lab", href: "/decision-lab/" },
      { label: "Drawdown is measured", href: "/field-notes/drawdown-is-measured-transmissivity-is-interpreted/" },
    ],
  },
  {
    slug: "decision-non-equivalence",
    term: "decision non-equivalence",
    shortDefinition:
      "Decision non-equivalence occurs when models that fit observations similarly imply different pumping limits, recovery times, thermal design margins, or failure probabilities.",
    whyItMatters:
      "It focuses attention on consequences: whether the interpretation changes a decision variable.",
    whenItMatters:
      "It matters when a project must set an operating limit, accept a recovery criterion, size a thermal system, or defend a design risk threshold.",
    commonMisunderstanding:
      "A model difference matters when a defensible decision variable changes by a material amount.",
    proofStatus: "research agenda",
    relatedPages: [
      { label: "Decision Lab", href: "/decision-lab/" },
      { label: "Groundwater Model-Assumption and Decision Audit", href: "/services/groundwater-decision-reliability-audit/" },
    ],
  },
  {
    slug: "groundwater-model-assumption-decision-audit",
    term: "groundwater decision reliability",
    shortDefinition:
      "A groundwater model-assumption and decision audit asks whether the data, interpretation model, uncertainty propagation, and decision rule are strong enough to support a groundwater action.",
    whyItMatters:
      "It connects research outputs to choices such as allowable pumping, remediation boundaries, drought reserves, recovery time, or subsurface-energy design.",
    whenItMatters:
      "It matters when the cost of a wrong interpretation is high, the site data are sparse, or the model is being used beyond the conditions where it was tested.",
    commonMisunderstanding:
      "It reviews evidence, assumptions, and decision sensitivity; it does not replace engineering judgment.",
    proofStatus: "application framing",
    relatedPages: [
      { label: "Decision Lab", href: "/decision-lab/" },
      { label: "Groundwater Model-Assumption and Decision Audit", href: "/services/groundwater-decision-reliability-audit/" },
    ],
  },
  {
    slug: "lag-aware-pumping-test-interpretation",
    term: "memory-aware pumping-test interpretation",
    shortDefinition:
      "Lag-aware pumping-test interpretation checks whether drawdown and recovery data retain non-instantaneous response structure that changes inferred parameters or decisions.",
    whyItMatters:
      "It examines whether the response history contains model-choice information beyond a single best-fit transmissivity.",
    whenItMatters:
      "It matters when early-time response, recovery mismatch, or boundary effects control the decision more than the late-time fit alone.",
    commonMisunderstanding:
      "It does not require a more complex model in every case. The first step is to test whether lagging-response evidence survives validation and decision propagation.",
    proofStatus: "diagnostic use",
    relatedPages: [
      { label: "Pumping-test necessity note", href: "/field-notes/when-does-a-pumping-test-need-lagging-darcy-law/" },
      { label: "Decision Lab", href: "/decision-lab/" },
    ],
  },
  {
    slug: "groundwater-influenced-shallow-geothermal-assessment",
    term: "shallow-geothermal groundwater intelligence",
    shortDefinition:
      "A groundwater-influenced shallow-geothermal assessment uses local groundwater flow, thermal response, and uncertainty evidence to judge whether a shallow geothermal or TRT design is transferable.",
    whyItMatters:
      "Thermal design margins can change when groundwater flow, heat transport, and interpretation uncertainty are included in the decision analysis.",
    whenItMatters:
      "It matters for thermal response tests, industrial heat planning, semiconductor water-energy projects, and scale-up decisions where local groundwater conditions matter.",
    commonMisunderstanding:
      "It is a screening frame for cases in which groundwater dynamics affect thermal interpretation or design margins. It does not imply that every TRT requires Lagging Darcy Law.",
    proofStatus: "application framing",
    relatedPages: [
      { label: "Groundwater-influenced energy", href: "/concepts/subsurface-energy-intelligence/" },
      { label: "Shallow geothermal note", href: "/field-notes/shallow-geothermal-needs-groundwater-intelligence/" },
    ],
  },
];
