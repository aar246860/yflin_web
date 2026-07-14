export type ToolTier =
  | "Public demonstrator"
  | "Research code"
  | "Archival code"
  | "Collaboration route";

export type ToolMaturity =
  | "teaching demo"
  | "research release"
  | "prototype"
  | "archival artifact"
  | "service route";

export type ToolLink = {
  label: string;
  href: string;
  kind: "demo" | "github" | "paper" | "service" | "docs";
  external?: boolean;
};

export type OpenTool = {
  id: string;
  title: string;
  tier: ToolTier;
  maturity: ToolMaturity;
  summary: string;
  problem: string;
  useWhen: string;
  claimBoundary: string;
  evidence: string;
  language?: string;
  license?: string;
  links: ToolLink[];
  tags: string[];
};

export const tierFilters = [
  "All",
  "Public demonstrator",
  "Research code",
  "Archival code",
  "Collaboration route",
] as const;

// Public-facing selection only.
// Intentionally held back from the website until their release boundary is clearer:
// TRUST-K, 3D Lagging Darcy research release, PyLaggingPump, WRRlag,
// and WellTestAI agent skill template.
export const openTools: OpenTool[] = [
  {
    id: "normalized-ldl-response",
    title: "Normalized LDL response animation",
    tier: "Public demonstrator",
    maturity: "teaching demo",
    summary:
      "A browser-computed normalized response showing how the drawdown-gradient lag (τ_s) exceeding the flux lag (τ_q) can produce an S-like transition.",
    problem:
      "Shows why Lagging Darcy Law differs from a visual time shift and how response shape can change before parameter transfer.",
    useWhen:
      "Use as a first explanation for collaborators, students, reviewers, or technical teams that need a concrete LDL calculation.",
    claimBoundary:
      "Simplified line-source teaching implementation without wellbore storage or skin; it is not calibrated for field analysis.",
    evidence:
      "The public demonstration uses a normalized Lin-Yeh special case.",
    links: [
      {
        label: "Open demo",
        href: "/concepts/transformation-uncertainty/#normalized-ldl-demo",
        kind: "demo",
      },
      {
        label: "Concept page",
        href: "/concepts/transformation-uncertainty/",
        kind: "docs",
      },
    ],
    tags: ["Lagging Darcy Law", "normalized response", "teaching calculation"],
  },
  {
    id: "lagging-pumping-test-demo",
    title: "Lagging pumping-test diagnostic demo",
    tier: "Public demonstrator",
    maturity: "teaching demo",
    summary:
      "An interactive constant-rate pumping-test example comparing a Classical Darcy response and a lag-aware response.",
    problem:
      "Shows when separated flux and gradient response lags can create early-time residual structure and timing shifts.",
    useWhen:
      "Use before a technical discussion about whether a pumping test needs lag-aware interpretation.",
    claimBoundary:
      "Calculation-backed teaching model that omits wellbore storage and finite well radius. Site-specific analysis is required before design use.",
    evidence:
      "The demonstration is available from the home page and the Lagging Theory page.",
    links: [
      { label: "Open demo", href: "/#lagging-pumping-demo", kind: "demo" },
      {
        label: "Validation note",
        href: "/field-notes/when-does-a-pumping-test-need-lagging-darcy-law/",
        kind: "docs",
      },
    ],
    tags: ["pumping test", "early residual", "model-form check"],
  },
  {
    id: "ldl-necessity-checker",
    title: "Lagging Darcy Law Necessity Checker",
    tier: "Public demonstrator",
    maturity: "teaching demo",
    summary:
      "A qualitative screening tool for deciding whether lag-aware aquifer-test interpretation should be evaluated before informing engineering decisions.",
    problem:
      "Turns pumping duration, observation window, recovery duration, lag or drainage scale, boundary response, residual-structure severity, and decision type into a screening result.",
    useWhen:
      "Use when a team needs a quick decision about whether conventional interpretation is enough for a first screen.",
    claimBoundary:
      "Qualitative screening only; it does not perform quantitative aquifer-test inversion or site-specific engineering calculation.",
    evidence:
      "Available on the Decision Lab page.",
    links: [
      { label: "Open checker", href: "/decision-lab/#ldl-necessity-checker", kind: "demo" },
      { label: "Decision Lab", href: "/decision-lab/", kind: "docs" },
    ],
    tags: ["screening", "decision variable", "lag-aware interpretation"],
  },
  {
    id: "trust-tc",
    title: "TRUST-TC",
    tier: "Research code",
    maturity: "research release",
    summary:
      "MIT-licensed Python research tool for transformation-uncertainty intervals in thermal response test interpretation.",
    problem:
      "Converts apparent TRT estimates into uncertainty intervals, reliability classes, and geothermal design reference factors.",
    useWhen:
      "Use when TRT interpretation needs explicit transformation uncertainty before shallow-geothermal design transfer.",
    claimBoundary:
      "The public repository contains software, documentation, tests, a calibration table, and small examples. It does not include raw field data.",
    evidence:
      "Repository documentation is current as of 2026-06-20.",
    language: "Python",
    license: "MIT",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/aar246860/trust-tc",
        kind: "github",
        external: true,
      },
      {
        label: "Energy concept",
        href: "/concepts/subsurface-energy-intelligence/",
        kind: "docs",
      },
    ],
    tags: ["TRT", "thermal conductivity", "transformation uncertainty"],
  },
  {
    id: "mathematica-sdr",
    title: "Mathematica stream-depletion code",
    tier: "Archival code",
    maturity: "archival artifact",
    summary:
      "Mathematica notebook for evaluating drawdown values in a new stream-depletion solution.",
    problem:
      "Keeps an analytical well-hydraulics computation visible for readers who need to inspect older solution code.",
    useWhen:
      "Use for archival Mathematica evaluation of the linked stream-depletion solution.",
    claimBoundary:
      "Archival notebook; it is not maintained as an open-source release.",
    evidence:
      "Repository documentation is current as of 2026-06-20.",
    language: "Mathematica",
    license: "No license asserted in GitHub metadata",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/aar246860/Mathematica-Code-SDR",
        kind: "github",
        external: true,
      },
    ],
    tags: ["stream depletion", "Mathematica", "analytical solution"],
  },
  {
    id: "approximate-ana-flow",
    title: "ApproximateAnaFlow",
    tier: "Archival code",
    maturity: "archival artifact",
    summary:
      "Python scripts for approximate Zech solutions under constant-rate and constant-head pumping in confined aquifers.",
    problem:
      "Provides earlier analytical-flow calculation scripts for confined-aquifer pumping cases.",
    useWhen:
      "Use for inspecting earlier approximate analytical-flow implementations.",
    claimBoundary:
      "Standalone scripts; they are not a maintained Python release or validated design calculator.",
    evidence:
      "Repository documentation is current as of 2026-06-20.",
    language: "Python",
    license: "No license asserted in GitHub metadata",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/aar246860/ApproximateAnaFlow",
        kind: "github",
        external: true,
      },
    ],
    tags: ["confined aquifer", "Zech solution", "Python scripts"],
  },
  {
    id: "decision-reliability-audit",
    title: "Groundwater Model-Assumption and Decision Audit",
    tier: "Collaboration route",
    maturity: "service route",
    summary:
      "A structured review of whether data, aquifer-test interpretation models, uncertainty propagation, and decision variables support a groundwater action.",
    problem:
      "Connects analysis tools to project decisions while preserving the confidentiality of project datasets and the stated scope of public demonstrations.",
    useWhen:
      "Use when a consultant, industrial team, or agency needs a bounded pilot before a larger groundwater or subsurface-energy study.",
    claimBoundary:
      "Applied collaboration route; it is not open-source software and does not replace engineering judgment.",
    evidence:
      "Published service route on this website.",
    links: [
      {
        label: "Open route",
        href: "/services/groundwater-decision-reliability-audit/",
        kind: "service",
      },
      { label: "Collaborate", href: "/collaborate/", kind: "service" },
    ],
    tags: ["model assumptions", "audit", "pilot analysis"],
  },
];
