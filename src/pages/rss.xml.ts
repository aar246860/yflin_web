import { getCollection } from "astro:content";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET({ site }) {
  const siteBase = site?.toString().replace(/\/$/, "") ?? "https://aar246860.github.io";
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const base = `${siteBase}${basePath}`;
  const notes = (await getCollection("field-notes", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 20);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ying-Fan Lin Field Notes</title>
    <link>${base}/field-notes/</link>
    <description>Delayed hydraulic response, transformation uncertainty, and groundwater-influenced subsurface energy interpretation.</description>
${notes.map((entry) => `    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${base}/field-notes/${entry.id}/</link>
      <guid>${base}/field-notes/${entry.id}/</guid>
      <pubDate>${entry.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(entry.data.subtitle)}</description>
    </item>`).join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
