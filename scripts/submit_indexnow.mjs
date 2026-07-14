import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const dryRun = process.argv.includes("--dry-run");
const key = process.env.INDEXNOW_KEY;
const host = process.env.INDEXNOW_HOST ?? "aar246860.github.io";
const keyLocation =
  process.env.INDEXNOW_KEY_LOCATION ?? (key ? `https://${host}/yflin_web/${key}.txt` : "");
const sitemapPath =
  process.env.INDEXNOW_SITEMAP_PATH ??
  join(process.cwd(), process.env.VISIBILITY_DIST_DIR ?? "dist", "sitemap.xml");

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

if (!existsSync(sitemapPath)) {
  console.error("dist/sitemap.xml was not found. Run npm.cmd run build first.");
  process.exit(1);
}

const sitemap = await readFile(sitemapPath, "utf8");
const urlList = extractUrls(sitemap);
const payload = {
  host,
  key,
  keyLocation,
  urlList,
};

if (dryRun || !key) {
  console.log(JSON.stringify({ ...payload, key: key ? "[configured]" : "[missing]" }, null, 2));
  if (!key) {
    console.log("Set INDEXNOW_KEY and publish the matching key file before submitting.");
  }
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const text = await response.text();
  console.error(`IndexNow submission failed: ${response.status} ${response.statusText}`);
  console.error(text);
  process.exit(1);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow.`);
