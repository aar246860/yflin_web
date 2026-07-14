import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const trackingHead = fs.readFileSync(path.join(root, "src/components/TrackingHead.astro"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const requiredSnippets = [
  {
    label: "GA4 disables automatic initial page view so Astro route tracking controls page_view events",
    snippet: "send_page_view: false",
  },
  {
    label: "GA4 listens to Astro client-side route completion",
    snippet: "astro:page-load",
  },
  {
    label: "GA4 sends the current path for each routed page view",
    snippet: "page_path: window.location.pathname + window.location.search",
  },
  {
    label: "GA4 route listener is guarded against duplicate bindings",
    snippet: "__yflinAnalyticsBound",
  },
  {
    label: "production analytics environment example exists",
    file: ".env.production.example",
  },
];

const failures = [];

for (const check of requiredSnippets) {
  if (check.snippet && !trackingHead.includes(check.snippet)) {
    failures.push(`${check.label}: missing \`${check.snippet}\``);
  }
  if (check.file && !fs.existsSync(path.join(root, check.file))) {
    failures.push(`${check.label}: missing \`${check.file}\``);
  }
}

if (!packageJson.scripts?.["tracking:gate"]) {
  failures.push("package.json is missing `tracking:gate` script.");
}

if (failures.length) {
  console.error("Tracking gate failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Tracking gate passed.");
