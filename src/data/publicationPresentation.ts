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
  ["10.1016/j.advwatres.2025.104977", "An image-well construction lets an island-aquifer solution handle pumping, recharge, and coastline geometry in one analytical model."],
  ["10.1016/j.jhydrol.2022.127920", "Temperature profiles are used to estimate how vertical groundwater flux changes through time, rather than forcing the flux to remain constant."],
  ["10.1029/2024WR038724", "The water-table condition keeps a time scale for gravity drainage, which helps avoid treating unsaturated flow as instantaneous by default."],
  ["10.1016/j.csite.2026.107695", "The analysis keeps grout heat storage in a thermal response test and separates early-time grout effects from later-time ground-conductivity information."],
]);

export function getPublicationFeature(publication: PublicationRecordLike): PublicationFeature | undefined {
  return featureByDoi.get(publication.doi);
}

export function getPlainLanguage(publication: PublicationRecordLike): string {
  return featurePlainLanguage.get(publication.doi) ?? filmByDoi.get(publication.doi)?.plainLanguage ?? themeNotes[publication.primaryTheme] ??
    "This paper develops a groundwater-related method and reports the assumptions and evidence needed to interpret its result.";
}

export function getVisualStatus(publication: PublicationRecordLike) {
  const feature = getPublicationFeature(publication);
  if (feature?.video && feature.poster) {
    return {
      kind: "available" as const,
      label: "Manim visual abstract",
      note: "Source-backed animation with a poster, captions, transcript, and evidence boundary.",
      film: { id: feature.id, video: feature.video, poster: feature.poster, captions: feature.captions },
      evidencePage: `/publications/${feature.id}/`,
    };
  }
  const film = filmByDoi.get(publication.doi);
  if (film) {
    return {
      kind: "available" as const,
      label: film.label,
      note: film.note,
      film,
      evidencePage: undefined,
    };
  }
  return {
    kind: "pending" as const,
    label: "Manim visual abstract in preparation",
    note: "The film will be added after the paper source, storyboard, semantic audit, and frame-level QA are complete. No synthetic result is shown here.",
    film: undefined,
    evidencePage: undefined,
  };
}
