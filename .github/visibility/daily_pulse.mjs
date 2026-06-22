import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const configPath = process.env.VISIBILITY_CONFIG_PATH
  ? path.resolve(root, process.env.VISIBILITY_CONFIG_PATH)
  : path.join(root, ".github", "visibility", "visibility.config.json");
const reportTimeZone = process.env.VISIBILITY_REPORT_TIME_ZONE ?? "Asia/Taipei";
const today = formatDateInTimeZone(new Date(), reportTimeZone);
const reportDir = path.join(root, "reports", "visibility");
const dailyReportDir = path.join(root, "reports/visibility/daily");
const reportPath = path.join(dailyReportDir, `${today}-daily-pulse.md`);
const latestReportPath = path.join(reportDir, "latest-daily-pulse.md");
const latestSummaryPath = path.join(reportDir, "latest-daily-pulse.json");
const expectedGaId = process.env.EXPECTED_GA_MEASUREMENT_ID ?? "G-0JHBH3R12D";
const failOnBlocker = ["1", "true", "yes"].includes((process.env.PULSE_FAIL_ON_BLOCKER ?? "").toLowerCase());

function formatDateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function normalizePath(pagePath) {
  if (!pagePath || pagePath === "/") return "/";
  return `/${pagePath.replace(/^\/+|\/+$/g, "")}/`;
}

function absoluteUrl(baseUrl, pagePath) {
  const base = stripTrailingSlash(baseUrl);
  if (!pagePath || pagePath === "/") return `${base}/`;
  return `${base}${normalizePath(pagePath)}`;
}

function assetUrl(baseUrl, assetPath) {
  const base = stripTrailingSlash(baseUrl);
  return `${base}/${assetPath.replace(/^\/+/, "")}`;
}

function compactWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

async function fetchText(url) {
  const startedAt = performance.now();
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const elapsedMs = Math.round(performance.now() - startedAt);
  const text = await response.text();
  return {
    url,
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    elapsedMs,
    contentType: response.headers.get("content-type") ?? "",
    text,
  };
}

async function safeFetch(url) {
  try {
    return await fetchText(url);
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      statusText: error instanceof Error ? error.message : String(error),
      elapsedMs: null,
      contentType: "",
      text: "",
    };
  }
}

function statusLabel(blockers) {
  return blockers.length ? "attention" : "ok";
}

function markdownTable(headers, rows) {
  const escapeCell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, "<br>");
  return [
    `| ${headers.map(escapeCell).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`),
  ].join("\n");
}

function buildReport(summary, checks, blockers, warnings) {
  const targetRows = checks.targets.map((target) => [
    target.path,
    target.status || "fetch failed",
    target.elapsedMs === null ? "n/a" : `${target.elapsedMs} ms`,
    target.note,
  ]);

  return [
    "# Daily Visibility Pulse",
    "",
    `Generated: ${summary.generatedAt}`,
    `Report date: ${summary.reportDate} (${summary.reportTimeZone})`,
    `Live site: ${summary.liveSiteUrl}`,
    `Status: ${summary.status}`,
    "",
    "## Core Checks",
    "",
    `- Homepage reachable: ${checks.homepage.ok ? "yes" : "no"} (${checks.homepage.status || checks.homepage.statusText})`,
    `- Expected GA4 ID: ${checks.ga.expectedGaId}`,
    `- GA4 script present: ${checks.ga.scriptPresent ? "yes" : "no"}`,
    `- Manual Astro page-view binding present: ${checks.ga.astroPageLoadPresent ? "yes" : "no"}`,
    `- Sitemap reachable: ${checks.sitemap.ok ? "yes" : "no"}`,
    `- Robots reachable: ${checks.robots.ok ? "yes" : "no"}`,
    `- llms.txt reachable: ${checks.llms.ok ? "yes" : "no"}`,
    `- llms-full.txt reachable: ${checks.llmsFull.ok ? "yes" : "no"}`,
    "",
    "## Target Pages",
    "",
    markdownTable(["Path", "HTTP", "Latency", "Note"], targetRows),
    "",
    "## AI-Search Answerability",
    "",
    markdownTable(
      ["Phrase", "Present"],
      checks.answerability.map((item) => [item.phrase, item.present ? "yes" : "no"])
    ),
    "",
    "## Blockers",
    "",
    blockers.length ? blockers.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    "## Next Action",
    "",
    blockers.length
      ? "Ask Codex to inspect the daily pulse report before changing public-facing copy."
      : "No emergency action. Review the weekly visibility report for strategy changes.",
    "",
  ].join("\n");
}

const config = readJson(configPath);
const liveSiteUrl = process.env.LIVE_SITE_URL ?? config.site?.baseUrl ?? "https://aar246860.github.io/yflin_web";
const homepageUrl = absoluteUrl(liveSiteUrl, "/");
const targetPages = config.targetPages ?? [{ path: "/" }];

const homepage = await safeFetch(homepageUrl);
const sitemap = await safeFetch(assetUrl(liveSiteUrl, "/sitemap.xml"));
const robots = await safeFetch(assetUrl(liveSiteUrl, "/robots.txt"));
const llms = await safeFetch(assetUrl(liveSiteUrl, "/llms.txt"));
const llmsFull = await safeFetch(assetUrl(liveSiteUrl, "/llms-full.txt"));
const targets = [];
for (const target of targetPages) {
  const targetUrl = absoluteUrl(liveSiteUrl, target.path);
  const result = await safeFetch(targetUrl);
  targets.push({
    path: normalizePath(target.path),
    url: targetUrl,
    ok: result.ok,
    status: result.status ? `${result.status}` : result.statusText,
    elapsedMs: result.elapsedMs,
    note: result.ok ? compactWhitespace(target.role ?? "target page") : result.statusText,
  });
}

const blockers = [];
const warnings = [];

if (!homepage.ok) blockers.push(`Homepage is not reachable: ${homepage.status || homepage.statusText}.`);
if (!homepage.text.includes(`gtag/js?id=${expectedGaId}`)) {
  blockers.push(`Expected GA4 script is missing from homepage: ${expectedGaId}.`);
}
if (!homepage.text.includes("astro:page-load")) {
  warnings.push("Homepage does not expose the Astro page-load GA4 binding; client-side navigation may be undercounted.");
}
if (!sitemap.ok) blockers.push(`sitemap.xml is not reachable: ${sitemap.status || sitemap.statusText}.`);
if (!robots.ok) warnings.push(`robots.txt is not reachable: ${robots.status || robots.statusText}.`);
if (!llms.ok) warnings.push(`llms.txt is not reachable: ${llms.status || llms.statusText}.`);
if (!llmsFull.ok) warnings.push(`llms-full.txt is not reachable: ${llmsFull.status || llmsFull.statusText}.`);

const sitemapUrls = sitemap.ok ? parseSitemapUrls(sitemap.text) : [];
for (const target of targets) {
  if (!target.ok) blockers.push(`Target page is not reachable: ${target.url}.`);
  if (sitemap.ok && !sitemapUrls.includes(target.url)) {
    warnings.push(`Target page is missing from sitemap: ${target.url}.`);
  }
}

const llmCorpus = `${llms.text}\n${llmsFull.text}`.toLowerCase();
const answerability = [
  "lagging theory",
  "flux-gradient asynchrony",
  "not a simple signal delay",
  "transformation uncertainty",
  "pumping tests measure drawdown",
].map((phrase) => ({
  phrase,
  present: llmCorpus.includes(phrase.toLowerCase()),
}));
for (const item of answerability) {
  if (!item.present) warnings.push(`AI-search answerability phrase is missing: ${item.phrase}.`);
}

const checks = {
  homepage: {
    ok: homepage.ok,
    status: homepage.status,
    statusText: homepage.statusText,
    elapsedMs: homepage.elapsedMs,
  },
  ga: {
    expectedGaId,
    scriptPresent: homepage.text.includes(`gtag/js?id=${expectedGaId}`),
    astroPageLoadPresent: homepage.text.includes("astro:page-load"),
  },
  sitemap: { ok: sitemap.ok, status: sitemap.status, urlCount: sitemapUrls.length },
  robots: { ok: robots.ok, status: robots.status },
  llms: { ok: llms.ok, status: llms.status },
  llmsFull: { ok: llmsFull.ok, status: llmsFull.status },
  targets,
  answerability,
};

const summary = {
  generatedAt: new Date().toISOString(),
  reportTimeZone,
  reportDate: today,
  liveSiteUrl: stripTrailingSlash(liveSiteUrl),
  status: statusLabel(blockers),
  blockers: blockers.length,
  warnings: warnings.length,
  checkedUrls: 5 + targets.length,
  expectedGaId,
  artifactName: "daily-visibility-pulse-report",
  reportFile: path.basename(reportPath),
  topBlockers: blockers.slice(0, 5),
  topWarnings: warnings.slice(0, 5),
};

const report = buildReport(summary, checks, blockers, warnings);

fs.mkdirSync(dailyReportDir, { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");
fs.writeFileSync(latestReportPath, report, "utf8");
fs.writeFileSync(latestSummaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(`Daily pulse report written: ${reportPath}`);
console.log(`Status: ${summary.status}; blockers=${summary.blockers}; warnings=${summary.warnings}`);

if (failOnBlocker && blockers.length) {
  process.exit(1);
}
