export type PublicationFeature = {
  readonly id: string;
  readonly title: string;
  readonly authors: readonly string[];
  readonly year: number;
  readonly venue: string;
  readonly doi: string;
  readonly citation: string;
  readonly questionHeading: string;
  readonly researchQuestion: string;
  readonly systemHeading: string;
  readonly physicalSystem: string;
  readonly methodHeading: string;
  readonly methodSummary: string;
  readonly resultHeading: string;
  readonly result: string;
  readonly evidence: string;
  readonly interpretationBoundary: string;
  readonly relation?: "lagging-darcy";
  readonly video: string;
  readonly poster: string;
};

export const publicationFeatures = [
  {
    id: "lin-yeh-2017",
    title: "A Lagging Model for Describing Drawdown Induced by a Constant-Rate Pumping in a Leaky Confined Aquifer",
    authors: ["Ying-Fan Lin", "Hund-Der Yeh"], year: 2017, venue: "Water Resources Research",
    doi: "10.1002/2017WR021115",
    citation: "Lin, Y.-F., & Yeh, H.-D. (2017). Water Resources Research, 53, 8500-8511.",
    questionHeading: "What changes when flux and gradient need not respond at the same instant?",
    researchQuestion: "Can a pumping-test model represent a delayed relation between radial water flux and the drawdown gradient while retaining finite-well effects?",
    systemHeading: "A finite pumping well in a leaky confined aquifer",
    physicalSystem: "A leaky confined aquifer pumped at a constant rate through a finite-radius well, with wellbore storage and skin included at the pumping well.",
    methodHeading: "Separate response times in the radial constitutive relation",
    methodSummary: "The formulation assigns one macroscopic response time to radial flux and another to the drawdown gradient, then embeds that relation in a finite-well pumping-test solution.",
    resultHeading: "Early-time agreement improved in the field comparison",
    result: "For the Rapid City field case, the lagging formulation improved the early-time fit across five observation wells relative to the Classical Darcy response used for comparison.",
    evidence: "The field comparison uses drawdown observations from five monitoring wells in Rapid City. It supports improved early-time agreement for this test and model configuration; it does not establish one lag pair for all aquifers.",
    interpretationBoundary: "Estimated lags are conditioned on the test data, boundary assumptions, leakage representation, finite well radius, wellbore storage, skin, and the selected model. They are fitted model parameters, not universal material constants.",
    relation: "lagging-darcy",
    video: "/videos/publications/lin-yeh-2017/lin-yeh-2017-visual-abstract.mp4",
    poster: "/videos/publications/lin-yeh-2017/lin-yeh-2017-visual-abstract_poster.png",
  },
  {
    id: "lin-et-al-2025-island",
    title: "Image-Well Solution for Island Aquifers with Pumping, Recharge, and Complex Coastlines",
    authors: ["Ying-Fan Lin", "Barret L. Kurylyk", "Adrian D. Werner", "Chih-Yu Liu", "Cristina Solorzano-Rivas", "Jun-Hong Lin"],
    year: 2025, venue: "Advances in Water Resources", doi: "10.1016/j.advwatres.2025.104977",
    citation: "Lin, Y.-F., et al. (2025). Advances in Water Resources, 201, 104977.",
    questionHeading: "Can analytical speed be retained when an island has wells, recharge, and a complex coastline?",
    researchQuestion: "The study asks how freshwater-lens head and interface depth can be evaluated without reducing every island to a simple symmetric boundary.",
    systemHeading: "A freshwater lens under multiple environmental and pumping stresses",
    physicalSystem: "An unconfined island aquifer with a freshwater-saltwater interface, spatial recharge, pumping or injection wells, and a coastline represented through image-well constructions.",
    methodHeading: "Analytical superposition coupled to image wells",
    methodSummary: "A new analytical freshwater-lens solution is combined with image wells so repeated pumping and recharge scenarios can account for coastline geometry without a full numerical model for each trial.",
    resultHeading: "Head and interface depth become fast constraints for scenario testing",
    result: "Convergence tests and comparisons with an established solution support the formulation, and an island example based loosely on Kinmen demonstrates multi-well pumping optimization subject to an interface-depth limit.",
    evidence: "The paper uses analytical and numerical checks plus an illustrative optimization example. No observational field data were used in the published study.",
    interpretationBoundary: "The solution is conditioned on its sharp-interface, aquifer-property, boundary, and superposition assumptions. The demonstration is not a site-specific safe-yield estimate for Kinmen.",
    video: "/videos/publications/lin-et-al-2025-island/island-image-well.mp4",
    poster: "/videos/publications/lin-et-al-2025-island/island-image-well_poster.png",
  },
  {
    id: "lin-et-al-2022-transient-flux",
    title: "Analytical Solution for Estimating Transient Vertical Groundwater Flux from Temperature-Depth Profiles",
    authors: ["Ying-Fan Lin", "Chia-Hao Chang", "Jui-Pin Tsai"],
    year: 2022, venue: "Journal of Hydrology", doi: "10.1016/j.jhydrol.2022.127920",
    citation: "Lin, Y.-F., Chang, C.-H., & Tsai, J.-P. (2022). Journal of Hydrology, 610, 127920.",
    questionHeading: "What is missed when vertical groundwater flux is forced to remain constant?",
    researchQuestion: "The paper examines whether repeated temperature-depth profiles can recover a changing vertical groundwater flux rather than one time-invariant value.",
    systemHeading: "Heat transport through a vertically flowing subsurface",
    physicalSystem: "A one-dimensional subsurface heat-transfer problem driven by time-varying surface temperature and vertical groundwater flow, observed through temperature-depth profiles.",
    methodHeading: "Transient analytical heat transfer used inside an inverse problem",
    methodSummary: "The analytical solution predicts temperature through depth and time, allowing candidate flux histories to be evaluated efficiently against observed profiles.",
    resultHeading: "The inverse target becomes a flux history",
    result: "The analytical solution agrees closely with a finite-element reference, the numerical experiment recovers the prescribed transient flux, and the field estimate is reported to be close to measured flux.",
    evidence: "Support comes from numerical verification, a synthetic inversion experiment, sensitivity analysis, and a field application. The website animation is conceptual rather than a digitization of the field record.",
    interpretationBoundary: "Flux estimates remain conditioned on the heat-transfer model, thermal properties, boundary temperature history, profile sampling, and inversion setup.",
    video: "/videos/publications/lin-et-al-2022-transient-flux/transient-vertical-flux.mp4",
    poster: "/videos/publications/lin-et-al-2022-transient-flux/transient-vertical-flux_poster.png",
  },
  {
    id: "lin-lin-2025-water-table",
    title: "Improving Water Table Kinematic Conditions With Unsaturated Flow Insights",
    authors: ["Jun-Hong Lin", "Ying-Fan Lin"], year: 2025, venue: "Water Resources Research",
    doi: "10.1029/2024WR038724",
    citation: "Lin, J.-H., & Lin, Y.-F. (2025). Water Resources Research, 61, e2024WR038724.",
    questionHeading: "Can a water-table condition retain unsaturated-flow physics without another fitting parameter?",
    researchQuestion: "The study addresses the specific-yield underestimation that can arise when analytical pumping-test models assume instantaneous gravity drainage.",
    systemHeading: "A pumped unconfined aquifer coupled to the unsaturated zone",
    physicalSystem: "A partially penetrating pumping well in an unconfined aquifer, with saturated flow below the water table and moisture storage and flow above it.",
    methodHeading: "Reduce coupled flow to a physically informed water-table condition",
    methodSummary: "A thin-unsaturated-zone reduction retains a gravity-drainage time term and a radial-Laplacian term. When the radial contribution is negligible, the condition returns to the classical kinematic form.",
    resultHeading: "More reliable specific-yield estimates without an extra empirical parameter",
    result: "Application to pumping tests at the Boise Hydrogeophysical Research Site supports improved drawdown agreement and addresses specific-yield underestimation while retaining analytical tractability.",
    evidence: "The paper derives the condition from coupled equations, examines limiting behavior, and evaluates it against a published field pumping-test series.",
    interpretationBoundary: "The reduction assumes an unsaturated zone that is thin relative to aquifer thickness and the stated hydraulic-property models. Its field result is site and model conditioned.",
    video: "/videos/publications/lin-lin-2025-water-table/water-table-kinematic.mp4",
    poster: "/videos/publications/lin-lin-2025-water-table/water-table-kinematic_poster.png",
  },
] as const satisfies readonly PublicationFeature[];
