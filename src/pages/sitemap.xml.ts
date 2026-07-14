import { getCollection } from "astro:content";
import { publicationFeatures } from "../data/publicationFeatures";

const staticPages = [
  "/",
  "/concepts/",
  "/glossary/",
  "/decision-lab/",
  "/tools/",
  "/field-notes/",
  "/publications/",
  "/network/",
  "/collaborate/",
  "/services/groundwater-decision-reliability-audit/",
  "/about/",
  "/team/",
  "/search/",
  "/llms.txt",
  "/llms-full.txt",
];

export async function GET({ site }) {
  const siteBase = site?.toString().replace(/\/$/, "") ?? "https://aar246860.github.io";
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const base = `${siteBase}${basePath}`;
  const concepts = await getCollection("concepts", ({ data }) => !data.draft);
  const notes = await getCollection("field-notes", ({ data }) => !data.draft);
  const urls = [
    ...staticPages,
    ...concepts.map((entry) => `/concepts/${entry.id}/`),
    ...notes.map((entry) => `/field-notes/${entry.id}/`),
    ...publicationFeatures.map((entry) => `/publications/${entry.id}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${base}${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
