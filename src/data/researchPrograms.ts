export type ResearchProgram = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  evidence: string;
  link: string;
  tone: "water" | "lag" | "uncertainty" | "thermal";
};

export const researchPrograms: ResearchProgram[] = [
  {
    id: "analytical-well-hydraulics",
    number: "01",
    title: "Analytical well hydraulics",
    shortTitle: "Well hydraulics",
    description:
      "Exact and semi-analytical solutions for pumping, boundaries, islands, streams, faults, and near-well effects.",
    evidence:
      "A publication record spanning radial pumping solutions, boundary effects, island aquifers, and wellbore conditions.",
    link: "/projects/",
    tone: "water",
  },
  {
    id: "lagging-theory",
    number: "02",
    title: "Lagging Theory and groundwater memory",
    shortTitle: "Lagging Theory",
    description:
      "We test when flux and hydraulic-gradient responses evolve on different time scales, and when that distinction matters for aquifer interpretation.",
    evidence:
      "Lin and Yeh (2017) introduced a lagging formulation for drawdown in a leaky confined aquifer; later work extends the question to periodic signals and related systems.",
    link: "/concepts/lagging-theory/",
    tone: "lag",
  },
  {
    id: "transformation-uncertainty",
    number: "03",
    title: "Transformation uncertainty in inverse interpretation",
    shortTitle: "Transformation uncertainty",
    description:
      "A measured drawdown or thermal response is not the parameter itself. We examine how analytical-model choice changes the inferred parameter and the decision built on it.",
    evidence:
      "The current line is a developing framework and a set of bounded demonstrations, not a claim that one model is universally correct.",
    link: "/concepts/transformation-uncertainty/",
    tone: "uncertainty",
  },
  {
    id: "subsurface-energy",
    number: "04",
    title: "Groundwater-informed subsurface energy",
    shortTitle: "Subsurface energy",
    description:
      "Thermal response tests, aquifer heat transport, borehole storage, and shallow geothermal design examined with groundwater context included.",
    evidence:
      "Recent work includes Wang et al. (2026), Case Studies in Thermal Engineering, DOI 10.1016/j.csite.2026.107695, together with analytical heat-transport studies. Site-specific design remains conditioned on groundwater, lithology, and test data.",
    link: "/concepts/subsurface-energy-intelligence/",
    tone: "thermal",
  },
];
