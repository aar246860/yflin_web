export type GroupLink = {
  label: string;
  href: string;
};

export type GroupProject = {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  method: string;
  output: string;
  people: string[];
  links: GroupLink[];
  accent: "teal" | "blue" | "gold" | "brick";
};

export type TrainingModule = {
  title: string;
  audience: string;
  outcome: string;
  format: string;
  link: string;
};

export type ActivityPhoto = {
  src: string;
  alt: string;
  label: string;
};

export const groupProjects: GroupProject[] = [
  {
    id: "lagging-theory",
    title: "Lagging Theory and Flux-Gradient Asynchrony",
    tagline: "When drawdown, recovery, or hydraulic gradients evolve out of phase.",
    problem:
      "Classical aquifer-test interpretation often assumes the flux-gradient relation is instantaneous at the scale of analysis.",
    method:
      "Develop lag-aware analytical models and compare them with classical well-hydraulic interpretations.",
    output:
      "Criteria for deciding when a lag-aware analytical model should be tested before parameter transfer.",
    people: ["Ying-Fan Lin", "Barret L. Kurylyk", "student project lines"],
    links: [
      { label: "Concept", href: "/concepts/lagging-theory/" },
      { label: "Decision demo", href: "/decision-lab/" },
    ],
    accent: "teal",
  },
  {
    id: "transformation-uncertainty",
    title: "Transformation Uncertainty in Aquifer-Test Interpretation",
    tagline: "Drawdown is observed; hydraulic parameters are estimated with an interpretation model.",
    problem:
      "Different analytical models can translate the same field response into different hydraulic parameters and decision limits.",
    method:
      "Assess model-form uncertainty, compare parameter transformations, and propagate differences to engineering decision variables.",
    output:
      "Model-conditioned uncertainty ranges for pumping limits, recovery time, thermal margins, and risk buffers.",
    people: ["Ying-Fan Lin"],
    links: [
      { label: "Concept", href: "/concepts/transformation-uncertainty/" },
      { label: "Open tools", href: "/tools/" },
    ],
    accent: "gold",
  },
  {
    id: "groundwater-memory",
    title: "Groundwater Memory and Delayed Response",
    tagline: "Past forcing can remain visible in present hydraulic signals.",
    problem:
      "Pumping, recharge, boundary movement, and aquitard exchange can leave timing structure that is lost in static parameter summaries.",
    method:
      "Use response timing, recovery behavior, and analytical-model residuals to separate measured records from interpreted parameters.",
    output:
      "A practical basis for examining memory effects before they enter model error without being identified.",
    people: ["Ying-Fan Lin", "student exploratory projects"],
    links: [{ label: "Concept", href: "/concepts/groundwater-memory/" }],
    accent: "blue",
  },
  {
    id: "thermal-response-energy",
    title: "Groundwater-Informed Thermal Response and Subsurface Energy",
    tagline: "Thermal response tests require groundwater context before scale-up.",
    problem:
      "TRT interpretation, shallow geothermal design, and underground thermal batteries can be distorted by groundwater movement and lithologic uncertainty.",
    method:
      "Connect analytical heat transport, TRT interpretation, groundwater flux, and transformation uncertainty.",
    output:
      "Decision-ready checks for thermal conductivity, recovery time, and scale-up risk in groundwater-influenced settings.",
    people: ["Hsiang-Wen Wang", "Ying-Fan Lin", "external collaborators"],
    links: [
      { label: "Concept", href: "/concepts/subsurface-energy-intelligence/" },
      { label: "Collaborate", href: "/collaborate/" },
    ],
    accent: "brick",
  },
  {
    id: "open-tools",
    title: "Open Tools and Decision Lab",
    tagline: "Public tools for examining assumptions before confidential analysis begins.",
    problem:
      "Collaborators often need to see why an interpretation choice matters before sharing full project data.",
    method:
      "Publish bounded teaching demonstrations, model-assumption checks, and documentation that states each tool's scope.",
    output:
      "A safer entry point for technical briefs, student training, and research collaboration.",
    people: ["Ying-Fan Lin", "student training line"],
    links: [
      { label: "Tools", href: "/tools/" },
      { label: "Decision Lab", href: "/decision-lab/" },
    ],
    accent: "blue",
  },
];

export const trainingModules: TrainingModule[] = [
  {
    title: "Aquifer-Test Interpretation Bootcamp",
    audience: "New students and collaborators",
    outcome: "Read drawdown and recovery records as model-conditioned evidence rather than fitted curves alone.",
    format: "Short lessons, worked examples, and interpretation checks",
    link: "/concepts/lagging-theory/",
  },
  {
    title: "Transformation-Uncertainty Practice",
    audience: "Students working on pumping tests, TRT, or decision propagation",
    outcome: "Separate measured response, analytical-model choice, inferred parameters, and decision variables.",
    format: "Decision checklist and reproducible mini-cases",
    link: "/concepts/transformation-uncertainty/",
  },
  {
    title: "Research Writing and Evidence Discipline",
    audience: "Students preparing manuscripts, posters, and technical briefs",
    outcome: "Write claims that can be traced to equations, data, figures, or clearly bounded demonstrations.",
    format: "Manuscript drafting, figure checks, and source tracing",
    link: "/field-notes/",
  },
  {
    title: "AI-Supported Research Practice",
    audience: "Students learning AI-assisted research and academic writing",
    outcome: "Use AI tools to examine drafts while keeping confidential material, unsupported claims, and unchecked figures out of manuscripts.",
    format: "Draft checks, repository hygiene, and handoff notes",
    link: "/tools/",
  },
];

export const activityPhotos: ActivityPhoto[] = [
  {
    src: "/media/team-life/jpgu-2026/jpgu-2026-team-selfie.jpg",
    alt: "Groundwater research team selfie outside the JpGU 2026 venue.",
    label: "Conference team",
  },
  {
    src: "/media/team-life/jpgu-2026/jpgu-2026-poster-presentation.jpg",
    alt: "Poster discussion at JpGU 2026.",
    label: "Poster exchange",
  },
  {
    src: "/media/team-life/jpgu-2026/jpgu-2026-poster-group.jpg",
    alt: "Research poster group at JpGU 2026.",
    label: "Student presentations",
  },
  {
    src: "/media/team-life/jpgu-2026/jpgu-2026-team-dinner.jpg",
    alt: "Research team dinner during the JpGU 2026 trip.",
    label: "Working dinner",
  },
];

export const studentPublicationIds = ["2026-01-2"];
