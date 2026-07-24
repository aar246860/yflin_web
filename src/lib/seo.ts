export type JsonLdNode = Record<string, unknown>;

export const siteName = "Ying-Fan Lin - Lagging Theory";
export const authorName = "Ying-Fan Lin";
export const defaultOrigin = "https://aar246860.github.io";
export const defaultBasePath = "/yflin_web";

export const researchKeywords = [
  "Lagging Theory",
  "flux-gradient asynchrony",
  "non-instantaneous hydraulic response",
  "phase-amplitude mismatch",
  "delayed hydraulic response",
  "transformation uncertainty",
  "well hydraulics",
  "groundwater-influenced subsurface energy",
  "thermal response tests",
];

export const authorityLinks = [
  "https://scholar.google.com/citations?user=PW0RFf0AAAAJ&hl=en&oi=ao",
  "https://github.com/aar246860",
  "https://www.researchgate.net/profile/Ying-Fan-Lin",
];

export function cleanBasePath(basePath = import.meta.env.BASE_URL ?? defaultBasePath) {
  const trimmed = basePath.trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function cleanOrigin(site?: URL | string | null) {
  const value = site ? site.toString() : defaultOrigin;
  return value.replace(/\/$/, "");
}

export function routePath(pathname = "/") {
  const basePath = cleanBasePath();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (basePath && path.startsWith(`${basePath}/`)) {
    return path.slice(basePath.length);
  }
  if (basePath && path === basePath) {
    return "/";
  }
  return path;
}

export function siteRoot(site?: URL | string | null, basePath = import.meta.env.BASE_URL) {
  return `${cleanOrigin(site)}${cleanBasePath(basePath)}`;
}

export function absoluteUrl(
  pathname = "/",
  site?: URL | string | null,
  basePath = import.meta.env.BASE_URL,
) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteRoot(site, basePath)}${path}`;
}

export function toJsonLdGraph(nodes: JsonLdNode | JsonLdNode[] | undefined) {
  if (!nodes) {
    return [];
  }
  return Array.isArray(nodes) ? nodes : [nodes];
}

export function serializeJsonLd(value: JsonLdNode) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function personNode(rootUrl: string): JsonLdNode {
  return {
    "@type": "Person",
    "@id": `${rootUrl}/#person`,
    name: authorName,
    url: `${rootUrl}/`,
    jobTitle: "Groundwater and subsurface-energy researcher",
    knowsAbout: researchKeywords,
    sameAs: authorityLinks,
  };
}

export function websiteNode(rootUrl: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${rootUrl}/#website`,
    name: siteName,
    url: `${rootUrl}/`,
    inLanguage: "en",
    author: { "@id": `${rootUrl}/#person` },
    about: researchKeywords,
  };
}

export function webPageNode(
  rootUrl: string,
  canonicalUrl: string,
  pageTitle: string,
  description: string,
  inLanguage: "en" | "zh-Hant" = "en",
): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle,
    description,
    isPartOf: { "@id": `${rootUrl}/#website` },
    author: { "@id": `${rootUrl}/#person` },
    inLanguage,
  };
}
