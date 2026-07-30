import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createDisposerBag,
  createFixedStepAccumulator,
  loadAssets,
} from "../../public/games/wbwwb/play/js/pumping/runtime.mjs";
import {
  APPROACH_POINTS,
  applyCrewAssignment,
  createAssignmentState,
  selectCrew,
} from "../../public/games/wbwwb/play/js/pumping/ui.mjs";

const entryUrl = new URL(
  "../../public/games/wbwwb/play/index.html",
  import.meta.url,
);
const stylesheetUrl = new URL(
  "../../public/games/wbwwb/play/css/pumping-game.css",
  import.meta.url,
);
const astroRouteUrl = new URL(
  "../../src/pages/games/wbwwb/index.astro",
  import.meta.url,
);
const globalStylesheetUrl = new URL(
  "../../src/styles/global.css",
  import.meta.url,
);

test("standalone entry exposes the labelled pumping-test start shell", async () => {
  // Given the real standalone game entry
  const html = await readFile(entryUrl, "utf8");

  // When its interactive shell is inspected
  const hasPumpingModule = /<script[^>]+type="module"[^>]+js\/pumping\/app\.mjs/.test(html);
  const hasLabelledStart = /<button[^>]+id="start-game"[^>]*>/.test(html);

  // Then the new module and native start control are present
  assert.equal(hasPumpingModule, true);
  assert.equal(hasLabelledStart, true);
});

test("standalone entry declares an embedded favicon for fresh navigation", async () => {
  // Given the real standalone game entry
  const html = await readFile(entryUrl, "utf8");

  // When its document metadata is inspected
  const favicon = html.match(
    /<link[^>]+rel="(?:shortcut )?icon"[^>]+href="([^"]+)"[^>]*>/,
  );

  // Then Chromium can resolve an icon without requesting /favicon.ico
  assert.ok(favicon, "standalone entry is missing an explicit favicon");
  assert.match(favicon[1], /^data:image\/svg\+xml,/);
});

test("standalone start shell exposes a public case label without internal seed codes", async () => {
  // Given the real standalone start shell
  const html = await readFile(entryUrl, "utf8");

  // When its visitor-visible case notice is inspected
  const caseNotice = html.match(/<span id="briefing-case">([^<]+)<\/span>/)?.[1] ?? "";

  // Then the notice uses a reader-facing label and no raw seed is embedded in the shell
  assert.equal(caseNotice, "引導固定案例");
  assert.doesNotMatch(html, /wbwwb:/);
});

test("public case labels cover every scenario and safely generalize unknown scenarios", async () => {
  // Given all current scenarios plus an unknown internal identifier
  const uiModule = await import(
    "../../public/games/wbwwb/play/js/pumping/ui.mjs"
  );

  // When each identifier crosses the visitor-facing case-label boundary
  assert.equal(
    typeof uiModule.toPublicCaseLabel,
    "function",
    "visitor case-label formatter is missing",
  );
  const labels = [
    uiModule.toPublicCaseLabel("guided"),
    uiModule.toPublicCaseLabel("expert-river"),
    uiModule.toPublicCaseLabel("expert-barrier"),
    uiModule.toPublicCaseLabel("wbwwb:future-private:v9"),
  ];

  // Then known cases stay distinct and the fallback never echoes private input
  assert.deepEqual(labels, [
    "引導固定案例",
    "專家河流案例",
    "專家阻水案例",
    "自訂合成案例",
  ]);
  for (const label of labels) {
    assert.doesNotMatch(label, /wbwwb:/);
  }
});

test("320px and 375px start headings avoid CJK orphans and horizontal overflow", { timeout: 30_000 }, async () => {
  // Given the real standalone markup and stylesheet in a fresh Chromium page
  const [{ chromium }, html, css] = await Promise.all([
    import("@playwright/test"),
    readFile(entryUrl, "utf8"),
    readFile(stylesheetUrl, "utf8"),
  ]);
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const staticHtml = html
      .replace(/<link rel="stylesheet" href="css\/pumping-game\.css">/, `<style>${css}</style>`)
      .replace(/<script[\s\S]*?<\/script>/g, "");
    const viewportCases = [
      { width: 305, label: "320px viewport with a 15px classic scrollbar" },
      { width: 320, label: "320px viewport" },
      { width: 375, label: "375px viewport" },
    ];
    for (const { width, label } of viewportCases) {
      await page.setViewportSize({ width, height: 812 });
      await page.setContent(staticHtml, { waitUntil: "domcontentloaded" });

      // When DOM Ranges measure every visible heading glyph
      const layout = await page.locator(".masthead h1").evaluate((heading) => {
        const glyphs = [];
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          [...node.textContent].forEach((character, index) => {
            if (character.trim() === "") return;
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + 1);
            const rect = range.getBoundingClientRect();
            glyphs.push({ character, top: Math.round(rect.top * 10) / 10 });
          });
        }
        const lines = [];
        for (const glyph of glyphs) {
          const line = lines.find((candidate) => Math.abs(candidate.top - glyph.top) < 1);
          if (line) line.text += glyph.character;
          else lines.push({ top: glyph.top, text: glyph.character });
        }
        const root = document.documentElement;
        return {
          lines: lines.map(({ text }) => text),
          hasHorizontalOverflow: root.scrollWidth > root.clientWidth,
        };
      });

      // Then the phrase stays together or wraps semantically without page overflow
      assert.equal(
        layout.hasHorizontalOverflow,
        false,
        `${label} has horizontal overflow`,
      );
      assert.ok(
        layout.lines.length === 1 || [...layout.lines.at(-1)].length > 1,
        `${label} heading lines: ${layout.lines.join(" / ")}`,
      );
    }
  } finally {
    await browser.close();
  }
});

test("Astro pumping route owns visible overflow and 44px navigation targets at every width", async () => {
  // Given the real Astro route and its unqualified route styles
  const routeSource = await readFile(astroRouteUrl, "utf8");
  const routeCss = routeSource.match(/<style>([\s\S]*)<\/style>/)?.[1] ?? "";
  const baseRouteCss = routeCss.split("@media", 1)[0];

  // When the route-level accessibility contract is inspected
  const routePageClass = /<BaseLayout[\s\S]*pageClass="pumping-game-page"/.test(
    routeSource,
  );
  const bodyRule =
    baseRouteCss.match(/:global\(body\.pumping-game-page\)\s*\{([^}]*)\}/)?.[1] ??
    "";
  const navigationRule =
    baseRouteCss.match(
      /:global\(body\.pumping-game-page \.site-header \.nav-links a\)\s*\{([^}]*)\}/,
    )?.[1] ?? "";

  // Then the body exposes real overflow and header links retain accessible targets
  assert.equal(routePageClass, true, "route-specific BaseLayout pageClass is missing");
  assert.match(bodyRule, /overflow-x:\s*(?:auto|visible)\s*;/);
  assert.doesNotMatch(bodyRule, /overflow-x:\s*(?:clip|hidden)\s*;/);
  assert.match(navigationRule, /display:\s*(?:flex|inline-flex)\s*;/);
  assert.match(navigationRule, /align-items:\s*center\s*;/);
  assert.match(navigationRule, /min-block-size:\s*44px\s*;/);
});

test("188px effective zoom viewport keeps both pumping surfaces within the page", { timeout: 30_000 }, async () => {
  // Given the real route styles, standalone markup, and standalone stylesheet
  const [{ chromium }, routeSource, globalCss, standaloneHtml, standaloneCss] =
    await Promise.all([
      import("@playwright/test"),
      readFile(astroRouteUrl, "utf8"),
      readFile(globalStylesheetUrl, "utf8"),
      readFile(entryUrl, "utf8"),
      readFile(stylesheetUrl, "utf8"),
    ]);
  const routeCss = (routeSource.match(/<style>([\s\S]*)<\/style>/)?.[1] ?? "")
    .replace(/:global\(([^)]+)\)/g, "$1");
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 188, height: 450 },
      reducedMotion: "reduce",
    });
    const mainRouteHtml = `<!doctype html>
      <html lang="zh-Hant">
        <head><style>${globalCss}\n${routeCss}</style></head>
        <body class="pumping-game-page">
          <header class="site-header">
            <nav class="nav" aria-label="Primary navigation">
              <a class="brand" href="#"><strong>Lin Groundwater Group</strong><span>Ying-Fan Lin</span></a>
              <div class="nav-links">
                <a href="#">Home</a><a href="#">Projects</a><a href="#">People</a>
                <a href="#">Publications</a><a href="#">Updates</a><a href="#">Xiaolin / 小林</a>
                <a href="#">Collaborate</a><a class="nav-language" href="#">中文摘要</a>
              </div>
            </nav>
          </header>
          <main>
            <section class="shell section game-hero">
              <div class="game-hero__copy">
                <span class="eyebrow">互動科學遊戲｜合成地下水資料</span>
                <h1>從現地決策開始，完成一場抽水試驗。</h1>
                <div class="game-hero__actions">
                  <a class="game-link game-link--primary" href="#">在獨立視窗開啟完整遊戲</a>
                </div>
              </div>
              <aside class="evidence-boundary"><h2>這是模型產生的科學情境。</h2></aside>
            </section>
          </main>
          <footer class="site-footer">
            <div class="shell footer-grid">
              <section class="stack"><strong>Lin Groundwater Hydraulics Group</strong></section>
              <section class="stack"><strong>Contact</strong><p>yflin1110@cycu.edu.tw</p></section>
              <section class="stack"><strong>Research resources</strong></section>
            </div>
          </footer>
        </body>
      </html>`;
    const standaloneStaticHtml = standaloneHtml
      .replace(
        /<link rel="stylesheet" href="css\/pumping-game\.css">/,
        `<style>${standaloneCss}</style>`,
      )
      .replace(/<script[\s\S]*?<\/script>/g, "");
    const surfaces = [
      { name: "main Astro route", html: mainRouteHtml },
      { name: "standalone game", html: standaloneStaticHtml },
    ];
    const overflow = [];

    // When each surface is rendered at the effective 200% zoom width
    for (const surface of surfaces) {
      await page.setContent(surface.html, { waitUntil: "domcontentloaded" });
      const metrics = await page.evaluate(() => ({
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      if (metrics.scrollWidth > metrics.innerWidth) {
        overflow.push({ name: surface.name, ...metrics });
      }
    }

    // Then neither document creates a horizontal scrollbar
    assert.deepEqual(overflow, []);
  } finally {
    await browser.close();
  }
});

test("visitor status formatter translates known codes and generalizes unknown codes", async () => {
  // Given known reducer feedback and an unknown synthetic developer code
  const uiModule = await import(
    "../../public/games/wbwwb/play/js/pumping/ui.mjs"
  );
  const knownCodes = [
    "READY",
    "ROUND_CREATED",
    "SITE_SELECTED",
    "WELL_INSTALLED",
    "CONSTRUCTION_COMPLETE",
    "PUMP_STARTED",
    "RECORD_EXTENDED",
    "PUMP_STOPPED",
    "SERIES_RETAINED",
    "DATA_PREPARED",
    "ANALYSIS_SUBMITTED",
    "RESULTS_REVIEWED",
    "REPLAY_SAME_SEED",
    "REPLAY_NEW_SEED",
    "WRONG_ROLE",
    "INVALID_TARGET",
    "INVALID_SITE",
    "INVALID_SPACING",
    "OUTSIDE_CONSTRUCTION_BOUNDS",
    "OVER_BUDGET",
    "OBSERVATION_LIMIT",
    "DUPLICATE_ACTION",
    "DUPLICATE_SUBMIT",
    "STAGE_GATE",
    "MISSING_REQUIRED_WELLS",
    "RATE_REQUIRED",
    "RATE_LOCKED",
    "INVALID_RATE",
    "PUMP_NOT_RUNNING",
    "INVALID_DURATION",
    "MINIMUM_RECORD_REQUIRED",
    "VALID_SERIES_REQUIRED",
    "INVALID_SERIES_WINDOW",
    "CJ_NOT_LATE",
    "BOUNDARY_MISMATCH",
    "INVALID_PARAMETERS",
    "ANALYSIS_REQUIRED",
    "RESULTS_REVIEW_REQUIRED",
    "MALFORMED_ACTION",
    "CREW_SELECTED",
    "SELECTION_CANCELLED",
    "ASSIGNMENT_ACCEPTED",
    "RATE_SELECTED",
    "SERIES_SELECTION_CHANGED",
    "WINDOW_CHANGED",
    "BASELINE_CHANGED",
    "OUTLIER_FLAG_CHANGED",
    "METHOD_CHANGED",
    "ASSUMPTION_CHANGED",
    "ANALYSIS_COMPLETE",
    "ESTIMATE_ADJUSTED",
  ];

  // When feedback crosses the visitor-facing status boundary
  assert.equal(
    typeof uiModule.toPublicStatusMessage,
    "function",
    "visitor status formatter is missing",
  );
  const knownMessages = knownCodes.map((code) =>
    uiModule.toPublicStatusMessage({ code, message: code, tone: "info" }));
  const unknownMessage = uiModule.toPublicStatusMessage({
    code: "UNRECOGNIZED_PRIVATE_CODE",
    message: "UNRECOGNIZED_PRIVATE_CODE",
    tone: "info",
  });

  // Then no raw all-caps identifier is visitor-visible
  assert.deepEqual(
    Object.keys(uiModule.PUBLIC_STATUS_MESSAGES).sort(),
    [...knownCodes].sort(),
  );
  for (const message of [...knownMessages, unknownMessage]) {
    assert.match(message, /[\u3400-\u9fff]/u);
    assert.doesNotMatch(message, /\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b/);
  }
  assert.equal(unknownMessage, "操作狀態已更新。");
});

test("standalone entry retains current resources and excludes legacy payload", async () => {
  // Given the real standalone game entry
  const html = await readFile(entryUrl, "utf8");

  // When external scripts are listed
  const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
    .map((match) => match[1]);

  // Then the current libraries and app are the entire runtime
  assert.deepEqual(sources, [
    "js/lib/pixi.min.js",
    "js/pumping/app.mjs",
  ]);

  // And every resource referenced by the current standalone entry exists
  for (const resource of [
    "js/lib/pixi.min.js",
    "js/pumping/app.mjs",
    "css/pumping-game.css",
  ]) {
    const contents = await readFile(new URL(resource, entryUrl));
    assert.ok(contents.byteLength > 0, `current resource is empty: ${resource}`);
  }

  // And removed legacy libraries and public payload directories are absent
  for (const resource of [
    "js/lib/howler.js",
    "js/lib/tweenjs-0.6.2.min.js",
    "js/game/",
    "js/peeps/",
    "js/scenes/",
    "js/misc/",
    "js/core/",
    "sounds/",
    "sprites/",
  ]) {
    assert.equal(
      existsSync(new URL(resource, entryUrl)),
      false,
      `obsolete public resource is present: ${resource}`,
    );
  }
  assert.doesNotMatch(html, /howler|tweenjs|sounds\/|js\/(?:game|peeps|scenes|misc|core)\//i);
});

test("active game styles and renderers use shared semantic colour and type tokens", async () => {
  const [css, runtime, charts, ui] = await Promise.all([
    readFile(stylesheetUrl, "utf8"),
    readFile(new URL("../../public/games/wbwwb/play/js/pumping/runtime.mjs", import.meta.url), "utf8"),
    readFile(new URL("../../public/games/wbwwb/play/js/pumping/charts.mjs", import.meta.url), "utf8"),
    readFile(new URL("../../public/games/wbwwb/play/js/pumping/ui.mjs", import.meta.url), "utf8"),
  ]);
  const tokenBlock = css.match(/^:root\s*\{[\s\S]*?^\}/m)?.[0] ?? "";
  const activeStyles = css.replace(tokenBlock, "");

  for (const token of [
    "--status-success",
    "--status-warning",
    "--status-error",
    "--focus-ring",
    "--type-caption",
    "--type-label",
    "--type-body",
    "--type-title",
  ]) {
    assert.match(tokenBlock, new RegExp(`${token}\\s*:`));
  }
  assert.doesNotMatch(activeStyles, /(?:#[\da-f]{3,8}\b|\brgba?\()/iu);
  const rawFontSizes = [...activeStyles.matchAll(/font-size:\s*([^;]+)/giu)]
    .map((match) => match[1].trim())
    .filter((value) => !value.startsWith("var(--type-"));
  assert.deepEqual(rawFontSizes, []);
  assert.match(runtime, /--status-success[\s\S]*--focus-ring/);
  assert.match(runtime, /CANVAS_TYPE_TOKENS[\s\S]*--type-caption[\s\S]*--type-title/);
  assert.match(charts, /typeCaption:\s*palette\.typeCaption[\s\S]*typeLabel:\s*palette\.typeLabel/);
  for (const token of ["success", "warning", "error", "focusRing"]) {
    assert.match(ui, new RegExp(`palette\\.${token}`));
  }
  assert.doesNotMatch(`${charts}\n${ui}`, /fontSize:\s*\d+/u);
});

test("fixed-step accumulator advances deterministically and caps stale frames", () => {
  // Given a 20 ms simulation step
  const steps = [];
  const accumulator = createFixedStepAccumulator({
    stepMs: 20,
    maximumSteps: 3,
    onStep: (seconds) => steps.push(seconds),
  });

  // When a stale 500 ms frame arrives
  const count = accumulator.advance(500);

  // Then only the bounded fixed steps run
  assert.equal(count, 3);
  assert.deepEqual(steps, [0.02, 0.02, 0.02]);
});

test("asset loader settles empty, successful, failed, and hung inputs", async () => {
  // Given empty, successful, failed, and never-settling asset inputs
  const empty = await loadAssets([]);
  const assets = [
    { id: "ok" },
    { id: "bad" },
    { id: "hung" },
  ];

  // When all assets are loaded with a short bounded timeout
  const result = await loadAssets(assets, {
    timeoutMs: 10,
    load: ({ id }) => {
      if (id === "ok") return Promise.resolve("image");
      if (id === "bad") return Promise.reject(new Error("missing"));
      return new Promise(() => {});
    },
  });

  // Then every list settles and reports its usable fallback set
  assert.equal(empty.loaded.size, 0);
  assert.equal(empty.failed.length, 0);
  assert.equal(result.loaded.get("ok"), "image");
  assert.deepEqual(result.failed.map(({ asset }) => asset.id), ["bad", "hung"]);
});

test("invalid crew assignment preserves state identity and budget", () => {
  // Given a selected hydrogeologist and the fixed approach points
  const initial = createAssignmentState(100_000);
  const selected = selectCrew(initial, "hydrogeologist");
  assert.equal(APPROACH_POINTS.length, 4);

  // When assigned to the driller's pumping pad
  const result = applyCrewAssignment(selected, "pump-pad");

  // Then the rejected action cannot mutate state or budget
  assert.equal(result, selected);
  assert.equal(result.budget, 100_000);
  assert.deepEqual(result.completedTargetIds, []);
});

test("disposer bag releases each lifecycle resource exactly once", () => {
  // Given two active lifecycle resources
  const events = [];
  const bag = createDisposerBag();
  bag.add(() => events.push("first"));
  bag.add(() => events.push("second"));

  // When disposal is requested repeatedly
  bag.dispose();
  bag.dispose();

  // Then each resource is released once in reverse registration order
  assert.deepEqual(events, ["second", "first"]);
  assert.equal(bag.size, 0);
});
