import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "scripts/daily_pulse.mjs",
  "package.json",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`Missing required daily pulse file: ${file}`);
  }
}

if (fs.existsSync(path.join(root, "scripts/daily_pulse.mjs"))) {
  const script = read("scripts/daily_pulse.mjs");
  for (const snippet of [
    "LIVE_SITE_URL",
    "EXPECTED_GA_MEASUREMENT_ID",
    "G-0JHBH3R12D",
    "gtag/js?id=",
    "astro:page-load",
    "assetUrl",
    "\"/sitemap.xml\"",
    "\"/robots.txt\"",
    "\"/llms.txt\"",
    "\"/llms-full.txt\"",
    "sitemap.xml",
    "robots.txt",
    "llms.txt",
    "llms-full.txt",
    "latest-daily-pulse.json",
    "reports/visibility/daily",
  ]) {
    if (!script.includes(snippet)) {
      fail(`Daily pulse script is missing required behavior: ${snippet}`);
    }
  }
}

if (fs.existsSync(path.join(root, "package.json"))) {
  const workflow = read("package.json");
  for (const snippet of [
    "\"visibility:pulse\"",
    "\"visibility:pulse:gate\"",
  ]) {
    if (!workflow.includes(snippet)) {
      fail(`Package scripts are missing required behavior: ${snippet}`);
    }
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Daily pulse gate passed.");
