import { getCollection } from "astro:content";
import { publicationFeatures } from "../data/publicationFeatures";

const staticPages = [
  "/",
  "/projects/",
  "/concepts/",
  "/glossary/",
  "/decision-lab/",
  "/explainers/",
  "/tools/",
  "/training/",
  "/field-notes/",
  "/papers-re-reviewed/",
  "/publications/",
  "/network/",
  "/collaborate/",
  "/services/groundwater-decision-reliability-audit/",
  "/about/",
  "/team/",
  "/zh/",
  "/games/wbwwb/",
  "/xiaolin/",
  "/xiaolin/game-room/",
  "/xiaolin/journal/",
];

type SitemapEntry = {
  path: string;
  updated?: Date;
};

const xmlEscape = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function GET({ site }) {
  const siteBase = site?.toString().replace(/\/$/, "") ?? "https://aar246860.github.io";
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const base = `${siteBase}${basePath}`;
  const concepts = await getCollection("concepts", ({ data }) => !data.draft);
  const notes = await getCollection("field-notes", ({ data }) => !data.draft);
  const xiaolinEntries = await getCollection(
    "xiaolin",
    ({ data }) => data.public && !data.draft,
  );
  const journalEntries = await getCollection(
    "resident-journal",
    ({ data }) => data.public && !data.draft,
  );
  const entries: SitemapEntry[] = [
    ...staticPages.map((path) => ({ path })),
    ...concepts.map((entry) => ({ path: `/concepts/${entry.id}/`, updated: entry.data.updated })),
    ...notes.map((entry) => ({ path: `/field-notes/${entry.id}/`, updated: entry.data.updated })),
    ...publicationFeatures.map((entry) => ({ path: `/publications/${entry.id}/` })),
    ...xiaolinEntries.map((entry) => ({ path: `/xiaolin/${entry.id}/`, updated: entry.data.updated })),
    ...journalEntries.map((entry) => ({
      path: `/xiaolin/journal/${entry.id}/`,
      updated: entry.data.updated,
    })),
  ];
  const uniqueEntries = [...new Map(entries.map((entry) => [entry.path, entry])).values()].sort(
    (a, b) => a.path.localeCompare(b.path),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueEntries
  .map(({ path, updated }) => {
    const lastModified = updated
      ? `<lastmod>${updated.toISOString().slice(0, 10)}</lastmod>`
      : "";
    return `  <url><loc>${xmlEscape(`${base}${path}`)}</loc>${lastModified}</url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
