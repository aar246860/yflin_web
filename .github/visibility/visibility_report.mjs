import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const configPath = process.env.VISIBILITY_CONFIG_PATH
  ? path.resolve(root, process.env.VISIBILITY_CONFIG_PATH)
  : path.join(root, "visibility.config.json");
const distDir = process.env.VISIBILITY_DIST_DIR
  ? path.resolve(root, process.env.VISIBILITY_DIST_DIR)
  : path.join(root, "dist");
const reportDir = path.join(root, "reports", "visibility");
const today = new Date().toISOString().slice(0, 10);
const reportPath = path.join(reportDir, `${today}-lagging-theory-visibility-report.md`);
const latestReportPath = path.join(reportDir, "latest-lagging-theory-visibility-report.md");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function normalizePath(pagePath) {
  if (pagePath === "/") return "/";
  return `/${pagePath.replace(/^\/+|\/+$/g, "")}/`;
}

function absoluteUrl(config, pagePath) {
  const baseUrl = stripTrailingSlash(config.site.baseUrl);
  if (pagePath === "/") return `${baseUrl}/`;
  return `${baseUrl}${normalizePath(pagePath)}`;
}

function htmlPathFor(pagePath) {
  if (pagePath === "/") return path.join(distDir, "index.html");
  const clean = pagePath.replace(/^\/+|\/+$/g, "");
  return path.join(distDir, clean, "index.html");
}

function compactWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? compactWhitespace(match[1]) : "";
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  return match ? compactWhitespace(match[1]) : "";
}

function hasCanonical(html) {
  return /<link\s+rel=["']canonical["']/i.test(html);
}

function hasJsonLd(html) {
  return /<script\s+type=["']application\/ld\+json["']/i.test(html);
}

function parseSitemapUrls(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 220)}`);
  }
  return response.json();
}

function auditGeneratedSite(config) {
  const blockers = [];
  const warnings = [];
  const pageAudits = [];

  if (!fs.existsSync(distDir)) {
    blockers.push("`dist/` does not exist. Run `npm.cmd run build` before the full visibility report.");
    return {
      blockers,
      warnings,
      pageAudits,
      sitemapUrls: [],
      robotsFound: false,
      llmsFound: false,
      llmsFullFound: false,
      llmsReadiness: []
    };
  }

  const sitemap = readIfExists(path.join(distDir, "sitemap.xml"));
  const robots = readIfExists(path.join(distDir, "robots.txt"));
  const llms = readIfExists(path.join(distDir, "llms.txt"));
  const llmsFull = readIfExists(path.join(distDir, "llms-full.txt"));
  const sitemapUrls = parseSitemapUrls(sitemap);

  if (!sitemap) blockers.push("Missing `dist/sitemap.xml`.");
  if (!robots) warnings.push("Missing `dist/robots.txt`.");
  if (!llms) warnings.push("Missing `dist/llms.txt`, which weakens AI-search readiness.");
  if (!llmsFull) warnings.push("Missing `dist/llms-full.txt`, which weakens AI-search context.");

  for (const target of config.targetPages) {
    const expectedUrl = absoluteUrl(config, target.path);
    const htmlPath = htmlPathFor(target.path);
    const html = readIfExists(htmlPath);
    const audit = {
      path: normalizePath(target.path),
      expectedUrl,
      exists: Boolean(html),
      title: "",
      description: "",
      descriptionLength: 0,
      hasCanonical: false,
      hasJsonLd: false,
      inSitemap: sitemapUrls.includes(expectedUrl)
    };

    if (!html) {
      blockers.push(`Target page is missing in dist: \`${target.path}\`.`);
      pageAudits.push(audit);
      continue;
    }

    audit.title = extractTitle(html);
    audit.description = extractMetaDescription(html);
    audit.descriptionLength = audit.description.length;
    audit.hasCanonical = hasCanonical(html);
    audit.hasJsonLd = hasJsonLd(html);

    if (!audit.title) warnings.push(`Missing title on \`${target.path}\`.`);
    if (!audit.description) warnings.push(`Missing meta description on \`${target.path}\`.`);
    if (!audit.hasCanonical) warnings.push(`Missing canonical link on \`${target.path}\`.`);
    if (!audit.hasJsonLd) warnings.push(`Missing JSON-LD on \`${target.path}\`.`);
    if (sitemap && !audit.inSitemap) warnings.push(`Target page not found in sitemap: \`${expectedUrl}\`.`);

    pageAudits.push(audit);
  }

  const llmsText = `${llms ?? ""}\n${llmsFull ?? ""}`.toLowerCase();
  const llmsReadiness = [
    {
      phrase: "lagging theory",
      present: llmsText.includes("lagging theory")
    },
    {
      phrase: "flux-gradient asynchrony",
      present: llmsText.includes("flux-gradient asynchrony")
    },
    {
      phrase: "not a generic signal-processing time shift",
      present: llmsText.includes("not a generic signal-processing time shift")
    },
    {
      phrase: "transformation uncertainty",
      present: llmsText.includes("transformation uncertainty")
    }
  ];

  return {
    blockers,
    warnings,
    pageAudits,
    sitemapUrls,
    robotsFound: Boolean(robots),
    llmsFound: Boolean(llms),
    llmsFullFound: Boolean(llmsFull),
    llmsReadiness
  };
}

async function queryGoogleSearchConsole(config) {
  const token = process.env.GSC_ACCESS_TOKEN;
  if (dryRun) return { status: "skipped", reason: "Dry run skips Google Search Console." };
  if (!token) return { status: "skipped", reason: "Set `GSC_ACCESS_TOKEN` to include Google Search Console rows." };

  const endDate = dateDaysAgo(2);
  const startDate = dateDaysAgo(29);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.site.gscSiteUrl)}/searchAnalytics/query`;
  const body = {
    startDate,
    endDate,
    dimensions: ["query", "page"],
    rowLimit: 25000
  };

  try {
    const json = await fetchJson(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return {
      status: "ok",
      startDate,
      endDate,
      rows: json.rows ?? []
    };
  } catch (error) {
    return { status: "error", reason: error.message };
  }
}

async function queryCrossref(config) {
  if (dryRun) return { status: "skipped", reason: "Dry run skips Crossref network queries.", results: [] };

  const mailto = process.env.CROSSREF_MAILTO;
  const results = [];
  const errors = [];

  for (const item of config.scholarlyQueries.slice(0, 4)) {
    const params = new URLSearchParams({
      "query.bibliographic": item.query,
      rows: "3"
    });
    if (mailto) params.set("mailto", mailto);

    try {
      const json = await fetchJson(`https://api.crossref.org/works?${params.toString()}`);
      const works = json.message?.items ?? [];
      results.push({
        label: item.label,
        query: item.query,
        works: works.map((work) => ({
          title: Array.isArray(work.title) ? work.title[0] : "",
          doi: work.DOI ?? "",
          container: Array.isArray(work["container-title"]) ? work["container-title"][0] : "",
          citedBy: work["is-referenced-by-count"] ?? 0
        }))
      });
    } catch (error) {
      errors.push(`${item.label}: ${error.message}`);
    }
  }

  return { status: errors.length ? "partial" : "ok", results, errors };
}

async function queryOpenAlex(config) {
  const apiKey = process.env.OPENALEX_API_KEY;
  if (dryRun) return { status: "skipped", reason: "Dry run skips OpenAlex network queries.", results: [] };
  if (!apiKey) return { status: "skipped", reason: "Set `OPENALEX_API_KEY` to include OpenAlex results.", results: [] };

  const mailto = process.env.OPENALEX_MAILTO;
  const results = [];
  const errors = [];

  for (const item of config.scholarlyQueries.slice(0, 4)) {
    const params = new URLSearchParams({
      search: item.query,
      "per-page": "3",
      api_key: apiKey
    });
    if (mailto) params.set("mailto", mailto);

    try {
      const json = await fetchJson(`https://api.openalex.org/works?${params.toString()}`);
      const works = json.results ?? [];
      results.push({
        label: item.label,
        query: item.query,
        works: works.map((work) => ({
          title: work.title ?? work.display_name ?? "",
          doi: work.doi ?? "",
          year: work.publication_year ?? "",
          citedBy: work.cited_by_count ?? 0,
          url: work.id ?? ""
        }))
      });
    } catch (error) {
      errors.push(`${item.label}: ${error.message}`);
    }
  }

  return { status: errors.length ? "partial" : "ok", results, errors };
}

function aggregateGscRows(rows) {
  const byQuery = new Map();
  const byPage = new Map();

  for (const row of rows ?? []) {
    const [query = "", page = ""] = row.keys ?? [];
    const clicks = row.clicks ?? 0;
    const impressions = row.impressions ?? 0;
    const ctr = row.ctr ?? 0;
    const position = row.position ?? 0;

    if (!byQuery.has(query)) {
      byQuery.set(query, { query, clicks: 0, impressions: 0, weightedPosition: 0, pages: new Set() });
    }
    const queryEntry = byQuery.get(query);
    queryEntry.clicks += clicks;
    queryEntry.impressions += impressions;
    queryEntry.weightedPosition += position * impressions;
    queryEntry.pages.add(page);

    if (!byPage.has(page)) {
      byPage.set(page, { page, clicks: 0, impressions: 0, weightedPosition: 0, queries: new Set() });
    }
    const pageEntry = byPage.get(page);
    pageEntry.clicks += clicks;
    pageEntry.impressions += impressions;
    pageEntry.weightedPosition += position * impressions;
    pageEntry.queries.add(query);
  }

  const finalize = (entry) => ({
    ...entry,
    ctr: entry.impressions ? entry.clicks / entry.impressions : 0,
    position: entry.impressions ? entry.weightedPosition / entry.impressions : 0,
    pages: entry.pages ? [...entry.pages] : undefined,
    queries: entry.queries ? [...entry.queries] : undefined
  });

  return {
    queries: [...byQuery.values()].map(finalize).sort((a, b) => b.impressions - a.impressions),
    pages: [...byPage.values()].map(finalize).sort((a, b) => b.impressions - a.impressions)
  };
}

function keywordMatched(row, keywords) {
  const query = row.query.toLowerCase();
  return keywords.some((keyword) => query.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(query));
}

function buildRecommendations(config, audit, gsc, crossref, openAlex) {
  const recs = [];
  const thresholds = config.strategyThresholds;

  const add = (priority, area, evidence, action, mode = "human-review") => {
    recs.push({ priority, area, evidence, action, mode });
  };

  for (const blocker of audit.blockers) {
    add("P0", "technical-seo", blocker, "Fix this before interpreting exposure data.", "safe-automation");
  }

  for (const warning of audit.warnings) {
    add("P1", "technical-seo", warning, "Patch the generated page or source metadata, then rebuild.", "safe-automation");
  }

  for (const page of audit.pageAudits) {
    if (!page.exists) continue;
    if (page.descriptionLength > 0 && page.descriptionLength < thresholds.minimumMetaDescriptionCharacters) {
      add(
        "P2",
        "metadata",
        `${page.path} meta description is ${page.descriptionLength} characters.`,
        "Expand the description with the page's decision value and canonical keyword.",
        "safe-automation"
      );
    }
    if (page.descriptionLength > thresholds.maximumMetaDescriptionCharacters) {
      add(
        "P2",
        "metadata",
        `${page.path} meta description is ${page.descriptionLength} characters.`,
        "Compress the description so search snippets do not truncate the core claim.",
        "safe-automation"
      );
    }
  }

  for (const item of audit.llmsReadiness) {
    if (!item.present) {
      add(
        "P1",
        "ai-search-readiness",
        `LLM context is missing phrase: ${item.phrase}.`,
        "Add a concise canonical definition to `llms.txt` or `llms-full.txt`.",
        "safe-automation"
      );
    }
  }

  if (gsc.status !== "ok") {
    add(
      "P1",
      "measurement-setup",
      gsc.reason ?? "Google Search Console rows are unavailable.",
      "Set up `GSC_ACCESS_TOKEN` for the scheduled workflow or export GSC rows manually before strategy review.",
      "human-review"
    );
  } else {
    const aggregated = aggregateGscRows(gsc.rows);
    const tracked = aggregated.queries.filter((row) => keywordMatched(row, config.keywords));
    const candidates = tracked.length ? tracked : aggregated.queries.slice(0, 8);

    for (const row of candidates.slice(0, 8)) {
      if (row.impressions >= thresholds.usefulImpressions && row.ctr < thresholds.lowCtr) {
        add(
          "P1",
          "search-snippet",
          `"${row.query}" has ${row.impressions} impressions, ${(row.ctr * 100).toFixed(1)}% CTR, average position ${row.position.toFixed(1)}.`,
          "Rewrite the title/meta opening for the matching page and make the first paragraph answer this query directly.",
          "human-review"
        );
      } else if (row.impressions >= thresholds.usefulImpressions && row.position > thresholds.weakAveragePosition) {
        add(
          "P2",
          "content-expansion",
          `"${row.query}" has impressions but weak average position ${row.position.toFixed(1)}.`,
          "Create a focused field note answering this query and internally link it to the Lagging Theory page.",
          "human-review"
        );
      }
    }

    const collaboratePage = aggregated.pages.find((page) => page.page?.includes("/collaborate/"));
    if (!collaboratePage || collaboratePage.clicks < 3) {
      add(
        "P2",
        "collaboration-conversion",
        "The collaborate page has too little GSC evidence for conversion assessment.",
        "Use Clarity or Cloudflare Web Analytics to inspect whether high-value readers reach the response brief.",
        "human-review"
      );
    }
  }

  if (crossref.status === "ok" || crossref.status === "partial") {
    const sparseQueries = crossref.results.filter((result) => result.works.length === 0);
    for (const result of sparseQueries) {
      add(
        "P2",
        "scholarly-discoverability",
        `Crossref returned no close works for "${result.query}".`,
        "Publish or cross-link a citation-ready field note using this exact phrase, without overstating novelty.",
        "human-review"
      );
    }
  } else {
    add("P3", "scholarly-discoverability", crossref.reason ?? "Crossref skipped.", "Run the full report when network access is available.", "safe-automation");
  }

  if (openAlex.status !== "ok") {
    add(
      "P3",
      "scholarly-discoverability",
      openAlex.reason ?? "OpenAlex enrichment is unavailable.",
      "Set `OPENALEX_API_KEY` if OpenAlex trend monitoring is needed.",
      "human-review"
    );
  }

  if (!recs.some((rec) => rec.priority === "P0" || rec.priority === "P1")) {
    add(
      "P2",
      "next-content-bet",
      "No critical technical blocker found.",
      "Prioritize one short field note that contrasts flux-gradient asynchrony with generic delay, then link it from the Lagging Theory concept page.",
      "human-review"
    );
  }

  return recs.sort((a, b) => a.priority.localeCompare(b.priority));
}

function markdownTable(headers, rows) {
  if (!rows.length) return "_No rows._";
  const escapeCell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`)
  ].join("\n");
}

function summarizeScholarlyResults(source) {
  if (!source.results?.length) return "_No scholarly rows collected._";
  return source.results.flatMap((result) => {
    if (!result.works.length) return [`### ${result.label}`, "", `Query: \`${result.query}\``, "", "_No close works returned._", ""];
    return [
      `### ${result.label}`,
      "",
      `Query: \`${result.query}\``,
      "",
      markdownTable(
        ["Title", "DOI/URL", "Venue/Year", "Cited by"],
        result.works.map((work) => [
          work.title,
          work.doi || work.url || "",
          work.container || work.year || "",
          work.citedBy ?? ""
        ])
      ),
      ""
    ];
  }).join("\n");
}

function buildReport(config, audit, gsc, crossref, openAlex, recommendations) {
  const gscSummary = gsc.status === "ok"
    ? `${gsc.rows.length} rows from ${gsc.startDate} to ${gsc.endDate}.`
    : `Unavailable: ${gsc.reason}`;

  const gscRows = gsc.status === "ok"
    ? aggregateGscRows(gsc.rows).queries.slice(0, 12).map((row) => [
        row.query,
        row.impressions,
        row.clicks,
        `${(row.ctr * 100).toFixed(1)}%`,
        row.position.toFixed(1)
      ])
    : [];

  return [
    "# Lagging Theory Visibility Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Mode: ${dryRun ? "dry-run" : "full"}`,
    "",
    "## 1. Exposure Summary",
    "",
    `- Site: ${config.site.baseUrl}`,
    `- Target keywords: ${config.keywords.length}`,
    `- Target pages audited: ${audit.pageAudits.length}`,
    `- Technical blockers: ${audit.blockers.length}`,
    `- Technical warnings: ${audit.warnings.length}`,
    `- Google Search Console: ${gscSummary}`,
    `- Crossref: ${crossref.status}`,
    `- OpenAlex: ${openAlex.status}`,
    "",
    "## 2. Technical SEO And AI-Search Readiness",
    "",
    markdownTable(
      ["Page", "Exists", "In sitemap", "Meta chars", "Canonical", "JSON-LD", "Primary role"],
      audit.pageAudits.map((page) => {
        const target = config.targetPages.find((item) => normalizePath(item.path) === page.path);
        return [
          page.path,
          page.exists ? "yes" : "no",
          page.inSitemap ? "yes" : "no",
          page.descriptionLength,
          page.hasCanonical ? "yes" : "no",
          page.hasJsonLd ? "yes" : "no",
          target?.role ?? ""
        ];
      })
    ),
    "",
    "### LLM Context Checks",
    "",
    markdownTable(
      ["Phrase", "Present"],
      audit.llmsReadiness.map((item) => [item.phrase, item.present ? "yes" : "no"])
    ),
    "",
    "## 3. Search Console Signals",
    "",
    gsc.status === "ok"
      ? markdownTable(["Query", "Impressions", "Clicks", "CTR", "Avg position"], gscRows)
      : `_${gsc.reason}_`,
    "",
    "## 4. Scholarly Visibility Signals",
    "",
    "### Crossref",
    "",
    summarizeScholarlyResults(crossref),
    "",
    "### OpenAlex",
    "",
    summarizeScholarlyResults(openAlex),
    "",
    "## 5. Strategy Recommendations",
    "",
    markdownTable(
      ["Priority", "Area", "Evidence", "Action", "Mode"],
      recommendations.map((rec) => [rec.priority, rec.area, rec.evidence, rec.action, rec.mode])
    ),
    "",
    "## 6. Safe Next Actions",
    "",
    "- Safe to automate: metadata diagnostics, sitemap/robots/llms checks, IndexNow payload preparation, weekly report generation.",
    "- Requires Ying-Fan Lin review: theory positioning, new claims, collaboration copy, external posts, and field-note publication.",
    "- Recommended next review cadence: inspect this report weekly; make public-facing changes only after reading the evidence column.",
    "",
    "## 7. Setup Gaps",
    "",
    [
      process.env.GSC_ACCESS_TOKEN ? "- GSC_ACCESS_TOKEN: configured" : "- GSC_ACCESS_TOKEN: missing",
      process.env.OPENALEX_API_KEY ? "- OPENALEX_API_KEY: configured" : "- OPENALEX_API_KEY: missing",
      process.env.CROSSREF_MAILTO ? "- CROSSREF_MAILTO: configured" : "- CROSSREF_MAILTO: optional but missing",
      process.env.INDEXNOW_KEY ? "- INDEXNOW_KEY: configured" : "- INDEXNOW_KEY: missing"
    ].join("\n"),
    ""
  ].join("\n");
}

if (!fs.existsSync(configPath)) {
  console.error("Missing visibility.config.json.");
  process.exit(1);
}

const config = readJson(configPath);
const audit = auditGeneratedSite(config);
const gsc = await queryGoogleSearchConsole(config);
const crossref = await queryCrossref(config);
const openAlex = await queryOpenAlex(config);
const recommendations = buildRecommendations(config, audit, gsc, crossref, openAlex);
const report = buildReport(config, audit, gsc, crossref, openAlex, recommendations);

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");
fs.writeFileSync(latestReportPath, report, "utf8");

console.log(`Visibility report written: ${reportPath}`);
console.log(`Recommendations: ${recommendations.length}`);
