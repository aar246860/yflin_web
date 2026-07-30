import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import {
  dirname,
  extname,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playRoot = resolve(root, "public/games/wbwwb/play");
const moduleRoot = resolve(playRoot, "js/pumping");
const entryPath = resolve(playRoot, "index.html");
const assetRoot = resolve(playRoot, "assets/pumping");
const failures = [];
const checked = [];
const expectedModules = new Set([
  "analysis.mjs",
  "app.mjs",
  "charts.mjs",
  "gameplay.mjs",
  "physics.mjs",
  "random.mjs",
  "runtime.mjs",
  "scenarios.mjs",
  "scoring.mjs",
  "state.mjs",
  "ui.mjs",
]);
const expectedAssetFiles = new Set([
  "crew/driller.png",
  "crew/hydrogeologist.png",
  "crew/instrumentation-technician.png",
  "crew/pump-operator-analyst.png",
  "props/aquifer-reveal-results.png",
  "props/drilling-wells.png",
  "props/fitting-assumption-controls.png",
  "props/notebook-data-window.png",
  "props/pump-logger-generator.png",
  "props/survey.png",
  "stages/aquifer-reveal.png",
  "stages/drawdown-monitoring.png",
  "stages/drilling-setup.png",
  "stages/interpretation.png",
  "stages/pumping-setup.png",
  "stages/site-survey.png",
]);
const requiredCanvasTokens = [
  "--canvas-background",
  "--paper",
  "--paper-bright",
  "--mineral",
  "--ink",
  "--ink-soft",
  "--teal",
  "--status-success",
  "--status-warning",
  "--status-error",
  "--focus-ring",
  "--line",
  "--font-sans",
  "--type-caption",
  "--type-label",
  "--type-body",
  "--type-title",
];

function requireFile(path, label) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    failures.push(`${label} is missing: ${relative(root, path)}`);
    return false;
  }
  if (statSync(path).size === 0) {
    failures.push(`${label} is empty: ${relative(root, path)}`);
    return false;
  }
  return true;
}

function runNode(args, label) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) {
    failures.push(
      `${label} failed:\n${(result.stderr || result.stdout).trim()}`,
    );
    return false;
  }
  checked.push(label);
  return true;
}

function moduleSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.add(match[1]);
  }
  return [...specifiers];
}

function resolveModuleImport(importer, specifier) {
  if (specifier.startsWith("node:")) return null;
  if (!specifier.startsWith(".")) {
    failures.push(
      `${relative(root, importer)} has a browser-unresolved bare import: ${specifier}`,
    );
    return null;
  }
  const resolved = resolve(dirname(importer), specifier);
  if (extname(resolved) !== ".mjs") {
    failures.push(
      `${relative(root, importer)} imports a non-module production file: ${specifier}`,
    );
    return null;
  }
  if (!requireFile(resolved, `import from ${relative(root, importer)}`)) {
    return null;
  }
  return resolved;
}

function validateModules() {
  const modules = readdirSync(moduleRoot)
    .filter((name) => name.endsWith(".mjs"))
    .sort();
  const actual = new Set(modules);
  for (const name of expectedModules) {
    if (!actual.has(name)) failures.push(`missing pumping module: ${name}`);
  }
  for (const name of actual) {
    if (!expectedModules.has(name)) failures.push(`unexpected pumping module: ${name}`);
  }

  const graph = new Map();
  for (const name of modules) {
    const path = resolve(moduleRoot, name);
    if (!requireFile(path, "production pumping module")) continue;
    runNode(["--check", path], `syntax ${relative(root, path)}`);
    const imports = moduleSpecifiers(readFileSync(path, "utf8"))
      .map((specifier) => resolveModuleImport(path, specifier))
      .filter(Boolean);
    graph.set(path, imports);
  }

  const reachable = new Set();
  const pending = [resolve(moduleRoot, "app.mjs")];
  while (pending.length > 0) {
    const path = pending.pop();
    if (reachable.has(path)) continue;
    reachable.add(path);
    pending.push(...(graph.get(path) ?? []));
  }
  for (const name of modules) {
    const path = resolve(moduleRoot, name);
    if (!reachable.has(path)) failures.push(`module is not reachable from app.mjs: ${name}`);
  }
  return modules;
}

function validateEntry() {
  if (!requireFile(entryPath, "standalone entry")) return [];
  const html = readFileSync(entryPath, "utf8");
  const scripts = [...html.matchAll(/<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g)]
    .map((match) => ({
      attributes: `${match[1]} ${match[3]}`,
      src: match[2],
    }));
  const expected = [
    "js/lib/pixi.min.js",
    "js/pumping/app.mjs",
  ];
  if (JSON.stringify(scripts.map(({ src }) => src)) !== JSON.stringify(expected)) {
    failures.push(`standalone script contract changed: ${scripts.map(({ src }) => src).join(", ")}`);
  }
  const app = scripts.find(({ src }) => src === "js/pumping/app.mjs");
  if (!app || !/\btype="module"/.test(app.attributes)) {
    failures.push("standalone app.mjs script must use type=\"module\"");
  }
  if (!/<link rel="stylesheet" href="css\/pumping-game\.css">/.test(html)) {
    failures.push("standalone pumping stylesheet contract is missing");
  }
  for (const { src } of scripts) requireFile(resolve(playRoot, src), "standalone script");
  requireFile(resolve(playRoot, "css/pumping-game.css"), "standalone stylesheet");
  checked.push("standalone entry contract");
  return scripts.map(({ src }) => src);
}

function validateAssets() {
  const assets = ["crew", "props", "stages"]
    .flatMap((folder) => readdirSync(resolve(assetRoot, folder))
      .map((name) => `${folder}/${name}`))
    .sort();
  if (JSON.stringify(assets) !== JSON.stringify([...expectedAssetFiles].sort())) {
    failures.push(`production asset contract changed: ${assets.join(", ")}`);
  }
  for (const relativePath of expectedAssetFiles) {
    requireFile(resolve(assetRoot, relativePath), "production game asset");
  }
  checked.push("production asset contract");
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function validateDist(modules, scripts) {
  const distRoot = resolve(root, "dist/games/wbwwb");
  const builtMain = resolve(distRoot, "index.html");
  const builtPlay = resolve(distRoot, "play");
  const builtEntry = resolve(builtPlay, "index.html");
  if (!requireFile(builtMain, "built Astro game route")) return;
  if (!requireFile(builtEntry, "built standalone entry")) return;
  const main = readFileSync(builtMain, "utf8");
  const standalone = readFileSync(builtEntry, "utf8");
  if (!/\/yflin_web\/_astro\//.test(main)) {
    failures.push("built game route does not use the deployed _astro base");
  }
  if (!/src="\/yflin_web\/games\/wbwwb\/play\/"/.test(main)) {
    failures.push("built game iframe does not use the deployed base");
  }
  if (!/js\/pumping\/app\.mjs/.test(standalone)) {
    failures.push("built standalone entry is missing app.mjs");
  }
  const routeSource = resolve(root, "src/pages/games/wbwwb/index.astro");
  if (statSync(builtMain).mtimeMs < statSync(routeSource).mtimeMs) {
    failures.push("dist game route is older than its Astro source; run npm.cmd run build");
  }

  const publicFiles = [
    "index.html",
    "css/pumping-game.css",
    ...modules.map((name) => `js/pumping/${name}`),
    ...scripts,
    ...[...expectedAssetFiles].map((path) => `assets/pumping/${path}`),
  ];
  for (const relativePath of new Set(publicFiles)) {
    const source = resolve(playRoot, relativePath);
    const built = resolve(builtPlay, relativePath);
    if (!requireFile(built, "built game file")) continue;
    if (sha256(source) !== sha256(built)) {
      failures.push(`stale dist game file: ${relativePath}`);
    }
  }
  checked.push("current dist game contract");
}

function validateCanvasTokens() {
  const stylesheetPath = resolve(playRoot, "css/pumping-game.css");
  const chartPath = resolve(moduleRoot, "charts.mjs");
  const runtimePath = resolve(moduleRoot, "runtime.mjs");
  const uiPath = resolve(moduleRoot, "ui.mjs");
  if (!requireFile(stylesheetPath, "canvas token stylesheet")
    || !requireFile(chartPath, "active chart renderer")
    || !requireFile(runtimePath, "shared canvas token reader")
    || !requireFile(uiPath, "active scene renderer")) return;

  const stylesheet = readFileSync(stylesheetPath, "utf8");
  const chart = readFileSync(chartPath, "utf8");
  const runtime = readFileSync(runtimePath, "utf8");
  const ui = readFileSync(uiPath, "utf8");
  const tokenBlock = stylesheet.match(/^:root\s*\{[\s\S]*?^\}/m)?.[0] ?? "";
  const activeStyles = stylesheet.replace(tokenBlock, "");
  for (const token of requiredCanvasTokens) {
    const escapedToken = token.replaceAll("-", "\\-");
    if (!new RegExp(`${escapedToken}\\s*:`).test(stylesheet)) {
      failures.push(`canvas token is missing from pumping-game.css: ${token}`);
    }
  }

  const checks = [
    ["active chart renderer imports shared canvas palette", /import\s*\{[^}]*readCanvasPalette[^}]*\}\s*from\s*["']\.\/runtime\.mjs["']/s],
    ["active chart renderer reads shared palette at render time", /const\s+theme\s*=\s*readChartTheme\(\)/],
    ["chart background consumes a project token", /theme\.background/],
    ["chart grid consumes a project token", /theme\.grid/],
    ["chart text consumes a project token", /theme\.text/],
    ["chart series consume project tokens", /theme\.series/],
    ["chart accent consumes a project token", /theme\.accent/],
    ["chart typography consumes the project font token", /fontFamily:\s*theme\.fontFamily/],
  ];
  for (const [label, pattern] of checks) {
    if (!pattern.test(chart)) failures.push(`${label}: charts.mjs`);
  }
  if (/\b(?:COLORS|CHART_COLORS)\b/.test(chart)) {
    failures.push("active chart renderer declares a duplicate chart palette: charts.mjs");
  }
  if (/\bArial\b/.test(chart)) {
    failures.push("active chart renderer hardcodes Arial: charts.mjs");
  }
  if (/(?:#[\da-f]{3,8}\b|0x[\da-f]+\b|\brgba?\()/iu.test(activeStyles)) {
    failures.push("active stylesheet contains a color literal outside the shared token block");
  }
  const rawFontSizes = [...activeStyles.matchAll(/font-size:\s*([^;]+)/giu)]
    .map((match) => match[1].trim())
    .filter((value) => !value.startsWith("var(--type-"));
  if (rawFontSizes.length > 0) {
    failures.push("active stylesheet contains a font size outside the named type scale");
  }
  for (const [label, source] of [
    ["active chart renderer", chart],
    ["active scene renderer", ui],
  ]) {
    if (/(?:#[\da-f]{3,8}\b|0x[\da-f]+\b)/iu.test(source)) {
      failures.push(`${label} contains a hardcoded canvas color`);
    }
    if (/fontSize:\s*\d+/u.test(source)) {
      failures.push(`${label} contains a hardcoded canvas font size`);
    }
  }
  for (const [label, pattern, source] of [
    ["runtime reads semantic status and focus tokens", /--status-success[\s\S]*--status-warning[\s\S]*--status-error[\s\S]*--focus-ring/, runtime],
    ["runtime reads named canvas type tokens", /CANVAS_TYPE_TOKENS[\s\S]*--type-caption[\s\S]*--type-title/, runtime],
    ["scene renderer consumes semantic success token", /palette\.success/, ui],
    ["scene renderer consumes semantic warning token", /palette\.warning/, ui],
    ["scene renderer consumes semantic error token", /palette\.error/, ui],
    ["scene renderer consumes semantic focus token", /palette\.focusRing/, ui],
    ["chart renderer consumes named type tokens", /typeCaption:\s*palette\.typeCaption[\s\S]*typeLabel:\s*palette\.typeLabel/, chart],
  ]) {
    if (!pattern.test(source)) failures.push(`${label}: token contract missing`);
  }
  checked.push("shared canvas token and active chart renderer contract");
}

const modules = validateModules();
const scripts = validateEntry();
validateAssets();
validateCanvasTokens();
if (process.argv.includes("--dist")) validateDist(modules, scripts);

const result = {
  status: failures.length === 0 ? "passed" : "failed",
  modules: modules.length,
  checked,
  failures,
};
console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
