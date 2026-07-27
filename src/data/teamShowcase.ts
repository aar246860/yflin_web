export type TeamPublicationHighlight = {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  authors: string;
  venue: string;
  volume: string;
  doi: string;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  plainLanguage: string;
  teamContributors: string[];
};

export const teamPublicationHighlights: TeamPublicationHighlight[] = [
  {
    id: "chen-et-al-2026-non-integer-trt",
    date: "2026-03-02",
    dateLabel: "March 2026",
    title: "Non-Integer Dimension Modeling and Sensitivity Diagnostics for Thermal Response Tests",
    authors:
      "Hao-Chu Chen, Ting-Hsuan Chang, Yueh-Chie Lee, Li-Chen Cheng, Hsiang-Wen Wang, Jui-Pin Tsai, and Ying-Fan Lin",
    venue: "Applied Thermal Engineering",
    volume: "292, 130490",
    doi: "10.1016/j.applthermaleng.2026.130490",
    cover: "/media/team-publications/non-integer-trt-cover.jpg",
    coverWidth: 900,
    coverHeight: 1200,
    plainLanguage:
      "This study uses a non-integer dimensional description and sensitivity diagnostics to examine how thermal-response-test behavior changes with geometry and parameter interactions.",
    teamContributors: ["Li-Chen Cheng", "Hsiang-Wen Wang"],
  },
  {
    id: "wang-et-al-2026-grout-storage",
    date: "2026-01-10",
    dateLabel: "January 2026",
    title:
      "Analytical Modeling of Grout Heat Storage Effects in Thermal Response Tests: Toward Faster and More Reliable Parameter Estimation",
    authors:
      "Hsiang-Wen Wang, Ying-Fan Lin, Chia-Hao Chang, Bo-Tsen Wang, Hikari Fujii, Yu-Feng Forrest Lin, Kuo-Hsin Yang, and Jui-Pin Tsai",
    venue: "Case Studies in Thermal Engineering",
    volume: "78, 107695",
    doi: "10.1016/j.csite.2026.107695",
    cover: "/media/team-publications/grout-heat-storage-cover.jpg",
    coverWidth: 900,
    coverHeight: 1229,
    plainLanguage:
      "The analytical model retains heat stored in borehole grout, helping distinguish early-time grout effects from the later ground response used for thermal-property estimation.",
    teamContributors: ["Hsiang-Wen Wang"],
  },
  {
    id: "lin-cheng-2026-slug-memory",
    date: "2026-06-12",
    dateLabel: "June 2026",
    title: "Diagnosing Apparent Hydraulic Memory in Pressurized Slug Tests With a Lagging Theory Framework",
    authors: "Ying-Fan Lin and Li-Chen Cheng",
    venue: "Advances in Water Resources",
    volume: "215, 105381",
    doi: "10.1016/j.advwatres.2026.105381",
    cover: "/media/team-publications/slug-memory-cover.jpg",
    coverWidth: 900,
    coverHeight: 1200,
    plainLanguage:
      "The study separates apparent delayed recovery from a unique aquifer constant and uses Bayesian diagnostics to examine how pressure, scale, and model assumptions affect interpretation.",
    teamContributors: ["Li-Chen Cheng"],
  },
];
