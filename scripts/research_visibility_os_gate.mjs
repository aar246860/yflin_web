import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/data/glossary.ts",
  "src/components/research/LDLNecessityChecker.astro",
  "src/pages/glossary/index.astro",
  "src/pages/decision-lab/index.astro",
  "src/pages/services/groundwater-decision-reliability-audit/index.astro",
  "scripts/generate_distribution_pack.mjs",
];

const requiredPackageScripts = [
  "research-visibility-os:gate",
  "distribution:pack",
  "distribution:pack:all",
];

const requiredRouteMentions = [
  { file: "src/pages/sitemap.xml.ts", values: ["/glossary/", "/decision-lab/", "/services/groundwater-decision-reliability-audit/"] },
  { file: "src/pages/llms.txt.ts", values: ["Glossary", "Decision Lab", "Groundwater Decision Reliability Audit"] },
  { file: "src/pages/llms-full.txt.ts", values: ["Glossary", "Decision Lab", "Groundwater Decision Reliability Audit"] },
  { file: "src/lib/seo.ts", values: ["sameAs", "scholar.google.com/citations?user=PW0RFf0AAAAJ", "github.com/aar246860"] },
];

const requiredGlossaryTerms = [
  "Lagging Darcy Law",
  "hydrologic memory",
  "flux-gradient asynchrony",
  "transformation uncertainty",
  "model equivalence",
  "decision non-equivalence",
  "groundwater decision reliability",
  "memory-aware pumping-test interpretation",
  "shallow-geothermal groundwater intelligence",
];

const bannedMarketingClaims = [
  "world-leading",
  "guaranteed",
  "first ever",
  "revolutionary breakthrough",
];

const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : "";
}

function assertFileExists(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`Missing required file: ${relativePath}`);
  }
}

for (const file of requiredFiles) {
  assertFileExists(file);
}

const packageJson = JSON.parse(read("package.json") || "{}");
for (const script of requiredPackageScripts) {
  if (!packageJson.scripts?.[script]) {
    failures.push(`Missing package script: ${script}`);
  }
}

for (const check of requiredRouteMentions) {
  const content = read(check.file);
  if (!content) {
    failures.push(`Missing route integration file: ${check.file}`);
    continue;
  }
  for (const value of check.values) {
    if (!content.includes(value)) {
      failures.push(`${check.file} does not mention ${value}`);
    }
  }
}

const glossarySource = read("src/data/glossary.ts");
for (const term of requiredGlossaryTerms) {
  if (!glossarySource.includes(term)) {
    failures.push(`Glossary source missing term: ${term}`);
  }
}

const decisionLabSource = read("src/components/research/LDLNecessityChecker.astro");
for (const phrase of [
  "pumping duration",
  "observation window",
  "recovery duration",
  "memory time scale",
  "decision type",
  "screening tool",
]) {
  if (!decisionLabSource.toLowerCase().includes(phrase)) {
    failures.push(`Decision Lab checker missing phrase: ${phrase}`);
  }
}

const servicePage = read("src/pages/services/groundwater-decision-reliability-audit/index.astro");
for (const phrase of [
  "engineering consultants",
  "semiconductor",
  "diagnostic audit",
  "pilot analysis",
  "decision-variable map",
]) {
  if (!servicePage.toLowerCase().includes(phrase)) {
    failures.push(`Service page missing phrase: ${phrase}`);
  }
}

const sourceFilesToScan = [
  "src/pages/glossary/index.astro",
  "src/pages/decision-lab/index.astro",
  "src/pages/services/groundwater-decision-reliability-audit/index.astro",
  "src/data/glossary.ts",
];

for (const file of sourceFilesToScan) {
  const content = read(file).toLowerCase();
  for (const claim of bannedMarketingClaims) {
    if (content.includes(claim)) {
      failures.push(`Unsupported marketing claim found in ${file}: ${claim}`);
    }
  }
}

if (fs.existsSync(path.join(root, "dist"))) {
  for (const output of [
    "dist/glossary/index.html",
    "dist/decision-lab/index.html",
    "dist/services/groundwater-decision-reliability-audit/index.html",
    "dist/llms.txt",
    "dist/llms-full.txt",
    "dist/sitemap.xml",
  ]) {
    assertFileExists(output);
  }
}

if (failures.length) {
  console.error("Research Visibility OS gate failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Research Visibility OS gate passed.");
