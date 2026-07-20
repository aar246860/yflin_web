import { publicationFeatures, type PublicationFeature } from "./publicationFeatures";
import publicationFilms from "./publicationFilms.generated.json";

export type PublicationRecordLike = {
  readonly id: string;
  readonly title: { readonly en: string; readonly "zh-TW"?: string };
  readonly authors: string;
  readonly year: number;
  readonly venue: string;
  readonly doi: string;
  readonly primaryTheme: string;
  readonly secondaryTags: readonly string[];
  readonly status: string;
  readonly publicRecord?: string;
  readonly evidenceBoundary?: string;
  readonly studentContribution?: boolean;
};

const featureByDoi = new Map<string, PublicationFeature>(publicationFeatures.map((feature) => [feature.doi, feature]));
type PublicationFilm = {
  readonly id: string;
  readonly doi: string;
  readonly label: string;
  readonly note: string;
  readonly plainLanguage: string;
  readonly video: string;
  readonly poster: string;
  readonly captions?: string;
};
const filmByDoi = new Map<string, PublicationFilm>((publicationFilms as PublicationFilm[]).map((film) => [film.doi, film]));

const themeNotes: Record<string, string> = {
  "analytical-well-hydraulics":
    "This paper develops or tests an analytical description of groundwater flow, wells, boundaries, or aquifer structure so that a specific hydraulic question can be evaluated without hiding the governing assumptions.",
  "lagging-theory":
    "This paper asks whether the hydraulic response can evolve on more than one time scale, and what that means for interpreting a measured groundwater signal.",
  "transformation-uncertainty":
    "This paper examines how observations become model-derived quantities, and where the interpretation can change when the analytical or statistical model changes.",
  "subsurface-energy":
    "This paper treats the subsurface as a coupled thermal and hydraulic system, asking how groundwater movement, storage, or boundary conditions affect energy interpretation.",
  "data-ai":
    "This paper studies how complex environmental data can be converted into an interpretable estimate, attribution, or decision without removing the evidence boundary.",
};

const featurePlainLanguage = new Map<string, string>([
  ["10.1002/2017WR021115", "A pumping-test model is used to examine whether radial flux and drawdown gradient need to respond at the same instant."],
  ["10.1016/j.advwatres.2025.104977", "This analytical solution uses image wells to represent pumping, recharge, and coastline geometry in island aquifers."],
  ["10.1016/j.jhydrol.2022.127920", "Temperature profiles provide time-varying estimates of vertical groundwater flux instead of imposing a constant-flux condition."],
  ["10.1029/2024WR038724", "The water-table condition keeps a time scale for gravity drainage, which helps avoid treating unsaturated flow as instantaneous by default."],
  ["10.1016/j.csite.2026.107695", "The analysis keeps grout heat storage in a thermal response test and separates early-time grout effects from later-time ground-conductivity information."],
]);

const filmPlainLanguageById = new Map<string, string>([
  ["2026-02-1", "The method maps which places and forecast times most influence a tropical-cyclone intensity prediction, helping researchers judge whether the model relies on physically sensible signals."],
  ["2026-01-3", "Two groundwater processes can respond at different rates. Accounting for both reconciles the observed amplitude attenuation and phase shift of periodic head signals at the two field sites."],
  ["2026-01-4", "A simplified fault interface reproduces the full two-dimensional drawdown closely for most tested conditions when the fault is not too wide, making it useful for rapid analysis."],
  ["2025-12-5", "Pumping-induced pressure changes at the two sites are predicted to bend the overlying formation by less than routine geodetic instruments can detect."],
  ["2025-10-6", "At the tested sites, allowing groundwater flux and hydraulic gradient to adjust at different rates improved the pumping-test interpretation and changed the inferred response times."],
  ["2025-08-7", "A stream does not supply a pumping well instantly or indefinitely. Including finite stream storage and delayed exchange improves the field interpretation, especially for smaller streams and certain time periods."],
  ["2025-07-8", "Representing the real coastline in the calculation allows fast estimates of groundwater head and freshwater-saltwater interface position under multiple pumping and recharge scenarios."],
  ["2025-07-9", "In two field tests, allowing thermal dispersion to increase with groundwater velocity gave a more realistic account of heat movement than a constant-dispersion model."],
  ["2025-06-10", "A compact fault model represents both resistance through the fault core and rapid flow along fractured damage zones."],
  ["2025-05-11", "Using drawdown from several observation wells, the method recovered a nearby hydraulic boundary together with aquifer transmissivity and storage; three wells performed about as well as four."],
  ["2025-05-12", "Accounting for short well screens and low-permeability layer boundaries produced more plausible aquifer properties at the field site than assuming fully penetrating wells."],
  ["2025-03-13", "A physically defined water-table boundary improved estimates of specific yield and followed the coupled saturated-unsaturated response without adding empirical fitting terms."],
  ["2025-02-14", "This technical reply shows that the published transport solution gives the wrong long-time concentration and identifies the equations that require correction."],
  ["2025-02-15", "A physics-informed neural network reconstructed the tested wave fields accurately from incomplete and noisy data after its spatial and temporal scales were optimized."],
  ["2024-09-16", "For a highly permeable well skin, head remains continuous but flux can change across the interface; the usual low-permeability skin condition is therefore not valid."],
  ["2024-09-17", "A simplified interface captures the main drawdown behavior of a fully resolved high-permeability zone around a well while requiring less computation."],
  ["2024-07-18", "For the tested borehole thermal energy storage systems, image wells matched finite-element temperatures at much lower computational cost and revealed how boundaries alter heat storage."],
  ["2024-06-19", "A lagging-response model inferred plausible unconfined-aquifer properties from groundwater levels even when detailed pumping rates and well locations were unavailable."],
  ["2024-06-20", "Because a stream stores only a finite amount of water, its stage changes during pumping and its support to the well weakens with time."],
  ["2024-05-21", "A fast analytical calculation estimates freshwater-lens shape and pumping vulnerability for multiple wells and changing recharge."],
  ["2024-02-22", "Including both near-well skin and rate-dependent well loss reproduces the sharp peaks in the field data that simpler well models miss."],
  ["2024-02-23", "Hourly groundwater levels were used to reconstruct regional pumping of 1.71-2.05 billion cubic metres per year, with patterns consistent with agricultural demand and land subsidence."],
  ["2023-09-24", "In the dual-porosity model, stronger exchange shifts more of the response into fractures and less into the rock matrix near the coast."],
  ["2023-07-25", "A standard pumping-test model can estimate aquifer storage from observation-well drawdown even when the individual pumping wells are unknown."],
  ["2023-05-26", "A signal-decomposition method recovered where pumping occurred and how pumping rates changed from dense groundwater-level records in the synthetic test."],
  ["2023-04-27", "A two-time-scale transport equation reproduced the two-stage breakthrough behavior observed in both laboratory columns."],
  ["2023-01-28", "Soil type and the lower thermal boundary increasingly affect temperature profiles over time; ignoring the lower boundary can bias groundwater-flux estimates."],
  ["2022-12-29", "For three rainfall patterns, the analytical model reproduced measured infiltration rates and matched the numerical temperature profiles."],
  ["2022-12-30", "When flux responds more slowly than hydraulic gradient, pumping can produce wave-like drawdown and temporary recharge overshoot; when storage responds more slowly, the behavior resembles delayed drainage or dual porosity."],
  ["2022-07-31", "Time-varying vertical groundwater flux can be estimated from temperature profiles by first fitting the profiles and then tracking how the fitted flux changes with time."],
  ["2022-03-32", "For the tested wells, the combined model best explained the data; at LA-87B, non-Darcy well loss mattered more than formation damage."],
  ["2021-07-33", "A generalized model let the data determine the relative influence of two limiting behaviors and fit both pumping records better than fixing either limit in advance."],
  ["2020-07-34", "The analytical transport solution matched the laboratory concentration data and estimated transport parameters without requiring the extra batch tests used by the comparison method."],
  ["2020-03-35", "A delayed stream boundary approximates an explicitly modelled streambed efficiently, although the difference depends on pumping time, well distance, and streambed properties."],
  ["2020-02-36", "Applying the fitted well-loss criterion indicates that both test wells were inadequately designed or developed."],
  ["2019-08-37", "During the tested injection period, the coupled heat-transfer model reproduced the measured temperature distribution at an aquifer thermal energy storage site."],
  ["2019-04-38", "Allowing groundwater flux and hydraulic gradient to lag by different amounts fitted drawdown at three sites and produced specific-yield estimates consistent with laboratory ranges."],
  ["2017-06-40", "An analytical constant-head model that includes unsaturated drainage and leakage from a lower layer agreed with numerical simulations and field observations under the tested conditions."],
  ["2016-07-41", "In a finite two-zone aquifer, the outer boundary has little effect early in a pumping test but controls late-time drawdown and well flow."],
]);

const availableVisualCopy = {
  label: "Visual explanation",
  note: "A short animation of the paper's question, method, and main result. Captions included.",
} as const;

export function getPublicationFeature(publication: PublicationRecordLike): PublicationFeature | undefined {
  return featureByDoi.get(publication.doi);
}

export function getPlainLanguage(publication: PublicationRecordLike): string {
  const film = filmByDoi.get(publication.doi);
  return featurePlainLanguage.get(publication.doi) ?? (film ? filmPlainLanguageById.get(film.id) ?? film.plainLanguage : undefined) ?? themeNotes[publication.primaryTheme] ??
    "This paper develops a groundwater-related method and reports the assumptions and evidence needed to interpret its result.";
}

export function getVisualStatus(publication: PublicationRecordLike) {
  const feature = getPublicationFeature(publication);
  if (feature?.video && feature.poster) {
    return {
      kind: "available" as const,
      label: availableVisualCopy.label,
      note: availableVisualCopy.note,
      film: { id: feature.id, video: feature.video, poster: feature.poster, captions: feature.captions },
      evidencePage: `/publications/${feature.id}/`,
    };
  }
  const film = filmByDoi.get(publication.doi);
  if (film) {
    return {
      kind: "available" as const,
      label: availableVisualCopy.label,
      note: availableVisualCopy.note,
      film,
      evidencePage: undefined,
    };
  }
  return {
    kind: "pending" as const,
    label: "Visual explanation in preparation",
    note: "The paper remains available through its DOI record; the animation will be added when complete.",
    film: undefined,
    evidencePage: undefined,
  };
}
