// allow: SIZE_OK — the requested durable browser matrix must remain in one dedicated file.
import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "/yflin_web";
const ORIGIN = "http://127.0.0.1:4438";
const MAIN_ROUTE = `${BASE}/games/wbwwb/`;
const STANDALONE_ROUTE = `${BASE}/games/wbwwb/play/`;
const STAGES = [
  "site-survey",
  "construction",
  "pumping",
  "data-preparation",
  "analysis",
  "results",
];
const CREW = {
  hydro: "hydrogeologist",
  driller: "driller",
  instrument: "instrumentation-technician",
  operator: "pump-operator-analyst",
};
const FIX_EVIDENCE = ".omo/evidence/task-8-pumping-test-game/fix-2";
const F1_EVIDENCE = ".omo/evidence/final-f1-fix";
const BOUNDARY_METHOD_EVIDENCE = ".omo/evidence/final-boundary-method-scoring-fix";
const FINAL_A11Y_EVIDENCE = ".omo/evidence/final-design-system-a11y-fix";
const FINAL_CJK_EVIDENCE = ".omo/evidence/final-cjk-layout-integration";
const FINAL_CJK_GEOMETRY_EVIDENCE = ".omo/evidence/final-cjk-geometry-fix";
const FINAL_THREE_EVIDENCE = ".omo/evidence/final-three-visual-fixes";
const FINAL_NARROW_V10_EVIDENCE = ".omo/evidence/final-narrow-fix-v10";
const FINAL_TOKEN_HUD_EVIDENCE = ".omo/evidence/final-token-hud-fix";
const TOKEN_HUD_PHASE = process.env.PUMPING_VISUAL_PHASE === "baseline"
  ? "baseline"
  : "final";
const CLOSE_OBSERVATION_TARGET = "近距觀測井候選點";
const PRIVATE_COPY = /wbwwb:|\b[A-Z][A-Z0-9]+(?:_[A-Z0-9]+)+\b/;

mkdirSync(F1_EVIDENCE, { recursive: true });
mkdirSync(BOUNDARY_METHOD_EVIDENCE, { recursive: true });
mkdirSync(FINAL_A11Y_EVIDENCE, { recursive: true });
mkdirSync(FINAL_CJK_EVIDENCE, { recursive: true });
mkdirSync(FINAL_CJK_GEOMETRY_EVIDENCE, { recursive: true });
mkdirSync(FINAL_THREE_EVIDENCE, { recursive: true });
mkdirSync(FINAL_NARROW_V10_EVIDENCE, { recursive: true });
mkdirSync(FINAL_TOKEN_HUD_EVIDENCE, { recursive: true });

function relativeLuminance([red, green, blue]) {
  const linear = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function monitorPage(page, allowedFailedRequest = () => false) {
  const health = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    badResponses: [],
    expectedCancellations: [],
  };
  page.on("console", (message) => {
    if (message.type() === "error") health.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => health.pageErrors.push(String(error)));
  page.on("requestfailed", (request) => {
    const failure = {
      url: request.url(),
      error: request.failure()?.errorText ?? "unknown",
    };
    if (allowedFailedRequest(request)) health.expectedCancellations.push(failure);
    else health.failedRequests.push(failure);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      health.badResponses.push({ url: response.url(), status: response.status() });
    }
  });
  return health;
}

function expectHealthy(health) {
  expect(health.consoleErrors).toEqual([]);
  expect(health.pageErrors).toEqual([]);
  expect(health.failedRequests).toEqual([]);
  expect(health.badResponses).toEqual([]);
}

async function activate(locator, mode) {
  if (mode === "keyboard") {
    await locator.focus();
    const type = await locator.getAttribute("type");
    await locator.press(type === "radio" || type === "checkbox" ? "Space" : "Enter");
    return;
  }
  if (mode === "touch") {
    await locator.tap();
    return;
  }
  await locator.click();
}

async function waitStage(page, stage) {
  await expect(page.locator("#game-panel")).toHaveAttribute("data-stage", stage);
  await expect(page.locator("#stage-step")).toContainText(
    String(STAGES.indexOf(stage) + 1),
  );
  expect(await page.locator("body").innerText()).not.toMatch(PRIVATE_COPY);
}

async function chooseCrew(page, crew, mode) {
  await activate(page.locator(`[data-crew-id="${CREW[crew]}"]`), mode);
}

async function chooseTarget(page, text, mode) {
  await activate(
    page.locator("button.target-button").filter({ hasText: text }).first(),
    mode,
  );
}

async function chooseLabel(page, text, mode) {
  const input = page.locator("label").filter({ hasText: text }).first().locator("input");
  await activate(input, mode);
}

async function startRound(page, options) {
  await page.goto(options.query
    ? `${ORIGIN}${STANDALONE_ROUTE}?${options.query}`
    : `${ORIGIN}${STANDALONE_ROUTE}`);
  if (options.scenario !== "guided") {
    await activate(
      page.locator(`input[name="mode"][value="${options.scenario}"]`),
      options.mode,
    );
  }
  await activate(page.locator("#start-game"), options.mode);
  await waitStage(page, "site-survey");
}

async function visibleRoundState(page) {
  return {
    budget: await page.locator("#hud-budget").innerText(),
    stage: await page.locator("#game-panel").getAttribute("data-stage"),
  };
}

async function expectRejectedWithoutRoundChange(page, before, message) {
  await expect(page.locator("#status-region")).toContainText(message);
  await expect(page.locator("#hud-budget")).toHaveText(before.budget);
  await expect(page.locator("#game-panel")).toHaveAttribute("data-stage", before.stage);
}

async function visibleResultScore(page) {
  const totalText = await page.locator(".result-headline strong").innerText();
  const modelText = await page.locator(".score-list li")
    .filter({ hasText: "模型判斷" })
    .locator("strong")
    .innerText();
  return {
    total: Number(totalText.split("／")[0]),
    modelJudgment: Number(modelText.split("／")[0]),
  };
}

async function expectClearConstructionLabels(page) {
  const visualAudit = await page.evaluate(() => window.__pumpingTest.snapshot.visualAudit);
  expect(visualAudit?.stage).toBe("construction");
  expect(visualAudit.labels).toHaveLength(5);
  expect(visualAudit.targets).toHaveLength(5);

  const overlaps = (first, second) => (
    first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y
  );
  for (const label of visualAudit.labels) {
    expect(label.width).toBeGreaterThan(80);
    expect(label.height).toBeGreaterThan(20);
    for (const target of visualAudit.targets) {
      expect(overlaps(label, target)).toBe(false);
    }
    for (const crew of visualAudit.activeCrew) {
      expect(overlaps(label, crew)).toBe(false);
    }
  }
  for (let index = 0; index < visualAudit.labels.length; index += 1) {
    for (let other = index + 1; other < visualAudit.labels.length; other += 1) {
      expect(overlaps(visualAudit.labels[index], visualAudit.labels[other])).toBe(false);
    }
  }
}

async function expectReadableHudAtDoubleZoom(page) {
  await page.setViewportSize({ width: 720, height: 812 });
  const geometry = await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
    const hud = document.querySelector(".hud");
    const root = document.documentElement;
    const rows = [...hud.children].map((row) => ({
      width: row.clientWidth,
      scrollWidth: row.scrollWidth,
      labelWidth: row.querySelector("dt")?.getBoundingClientRect().width ?? 0,
      valueWidth: row.querySelector("dd")?.getBoundingClientRect().width ?? 0,
    }));
    const overflowing = [...document.querySelectorAll("body *")].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        selector: element.id ? `#${element.id}` : element.className,
        text: element.textContent.trim().replace(/\s+/g, " ").slice(0, 100),
        right: rect.right,
      };
    }).filter((element) => element.right > root.clientWidth + 1);
    return {
      columns: getComputedStyle(hud).gridTemplateColumns.split(" ").length,
      overflow: root.scrollWidth > root.clientWidth,
      rows,
      overflowing,
    };
  });
  writeFileSync(`${FINAL_CJK_EVIDENCE}/hud-zoom-200.json`, `${JSON.stringify(geometry, null, 2)}\n`, "utf8");
  expect(geometry.columns).toBe(1);
  expect(geometry.overflow).toBe(false);
  for (const row of geometry.rows) {
    expect(row.width).toBeGreaterThan(180);
    expect(row.scrollWidth).toBeLessThanOrEqual(row.width);
    expect(row.labelWidth).toBeGreaterThan(20);
    expect(row.valueWidth).toBeGreaterThan(20);
  }
}

async function expectProtectedCjkGeometry(page, name, requiredTokens = []) {
  const geometry = await page.evaluate(() => {
    const root = document.documentElement;
    const cjk = /[\u3400-\u9fff]/u;
    const measureToken = (token, trimText = false) => {
      const range = document.createRange();
      range.selectNodeContents(token);
      const rects = [...range.getClientRects()].map((rect) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }));
      const control = token.closest("button, label");
      const controlRect = control?.getBoundingClientRect();
      return {
        text: trimText ? token.textContent.trim() : token.textContent,
        rects,
        contained: !controlRect || rects.every((rect) =>
          rect.x >= controlRect.x - 1
          && rect.x + rect.width <= controlRect.right + 1),
      };
    };
    const protectedTokens = [...document.querySelectorAll(".cjk-token")]
      .map((token) => measureToken(token));
    const methodTokens = [...document.querySelectorAll(".nonbreaking-token")]
      .map((token) => measureToken(token, true));
    const strictCjkLineSelector =
      ".crew-name, .crew-state-label, .target-copy, .compact-choice-copy";
    const labels = [...document.querySelectorAll(
      [
        strictCjkLineSelector,
        ".eyebrow",
        "#game-heading",
        "#stage-instruction",
        "#crew-heading",
        ".crew-state-live",
        ".field-note p",
      ].join(", "),
    )].map((label) => {
      const text = label.textContent;
      const lines = new Map();
      const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        for (let offset = 0; offset < node.textContent.length; offset += 1) {
          const character = node.textContent[offset];
          if (/\s/u.test(character)) continue;
          const range = document.createRange();
          range.setStart(node, offset);
          range.setEnd(node, offset + 1);
          const rect = range.getBoundingClientRect();
          const key = Math.round(rect.y);
          const line = lines.get(key) ?? { text: "", cjkCount: 0, meaningfulCount: 0 };
          line.text += character;
          if (cjk.test(character)) line.cjkCount += 1;
          if (/[\p{L}\p{N}]/u.test(character)) line.meaningfulCount += 1;
          lines.set(key, line);
        }
        node = walker.nextNode();
      }
      const measuredLines = [...lines.values()];
      return {
        text,
        cjkPerLine: measuredLines.map((line) => line.cjkCount),
        orphanLines: measuredLines
          .filter((line) => line.cjkCount === 1 && line.meaningfulCount === 1)
          .map((line) => line.text),
        strictCjkLines: label.matches(strictCjkLineSelector),
      };
    });
    const overflowing = [...document.querySelectorAll("body *")].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        selector: element.id ? `#${element.id}` : element.className,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        right: rect.right,
      };
    }).filter((element) => element.right > root.clientWidth + 1);
    return {
      overflow: root.scrollWidth > root.clientWidth,
      protectedTokens,
      methodTokens,
      labels,
      overflowing,
    };
  });
  writeFileSync(`${FINAL_CJK_EVIDENCE}/${name}.json`, `${JSON.stringify(geometry, null, 2)}\n`, "utf8");
  expect(geometry.overflow).toBe(false);
  expect(geometry.protectedTokens.length).toBeGreaterThan(0);
  const tokenTexts = [...geometry.protectedTokens, ...geometry.methodTokens]
    .map((token) => token.text);
  for (const token of requiredTokens) expect(tokenTexts).toContain(token);
  for (const token of geometry.protectedTokens) {
    expect(token.text).toMatch(/[\u3400-\u9fff]/u);
    expect(token.rects).toHaveLength(1);
    expect(token.rects[0].width).toBeGreaterThan(0);
    expect(token.rects[0].height).toBeGreaterThan(0);
    expect(
      token.contained,
      `${name}: protected token "${token.text}" stays inside its control`,
    ).toBe(true);
  }
  for (const token of geometry.methodTokens) {
    expect(token.rects).toHaveLength(1);
    expect(token.rects[0].width).toBeGreaterThan(0);
    expect(
      token.contained,
      `${name}: method token "${token.text}" stays inside its control`,
    ).toBe(true);
  }
  for (const label of geometry.labels) {
    if (label.strictCjkLines) expect(label.cjkPerLine).not.toContain(1);
    expect(
      label.orphanLines,
      `${name}: "${label.text}" has no one-glyph CJK line`,
    ).toEqual([]);
  }
}

async function expectNoCjkGeometryFailures(page, name, selectors) {
  const geometry = await page.evaluate((labelSelectors) => {
    const root = document.documentElement;
    const cjk = /[\u3400-\u9fff]/u;
    const orphan = /^[\u3400-\u9fff，。；：、．！？」）】》〉]$/u;
    const containers = [...document.querySelectorAll(
      "#game-panel, #stage-controls, #target-controls, #crew-controls, .game-credit",
    )].filter((element) => element.clientWidth > 0).map((element) => ({
      selector: element.id ? `#${element.id}` : element.className,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    const tokens = [...document.querySelectorAll(".cjk-token, .game-credit__term")]
      .filter((token) => token.getClientRects().length > 0)
      .map((token) => {
        const range = document.createRange();
        range.selectNodeContents(token);
        return {
          text: token.textContent.trim(),
          rects: [...range.getClientRects()].map((rect) => ({
            width: rect.width,
            height: rect.height,
          })),
        };
      });
    const labels = [...document.querySelectorAll(labelSelectors.join(", "))]
      .filter((label) => label.getClientRects().length > 0)
      .map((label) => {
        const lines = new Map();
        const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          for (let offset = 0; offset < node.textContent.length; offset += 1) {
            const character = node.textContent[offset];
            if (/\s/u.test(character)) continue;
            const range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
            const rect = range.getBoundingClientRect();
            const key = Math.round(rect.y * 2) / 2;
            lines.set(key, `${lines.get(key) ?? ""}${character}`);
          }
        }
        const measured = [...lines.values()];
        return {
          text: label.textContent.trim(),
          lastLine: measured.at(-1) ?? "",
          terminalOrphan: orphan.test(measured.at(-1) ?? ""),
          cjkLines: measured.filter((line) => cjk.test(line)),
        };
      });
    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      containers,
      tokens,
      labels,
    };
  }, selectors);
  writeFileSync(
    `${FINAL_CJK_GEOMETRY_EVIDENCE}/${name}.json`,
    `${JSON.stringify(geometry, null, 2)}\n`,
    "utf8",
  );
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
  for (const container of geometry.containers) {
    expect(container.scrollWidth, `${name}: ${container.selector}`).toBeLessThanOrEqual(
      container.clientWidth,
    );
  }
  expect(geometry.tokens.length, `${name}: semantic CJK terms`).toBeGreaterThan(0);
  for (const token of geometry.tokens) {
    expect(token.rects, `${name}: ${token.text}`).toHaveLength(1);
  }
  for (const label of geometry.labels) {
    expect(label.terminalOrphan, `${name}: ${label.text} / ${label.lastLine}`).toBe(false);
  }
}

async function expectIndivisibleTermGeometry(
  page,
  name,
  terms,
  evidenceRoot = FINAL_THREE_EVIDENCE,
) {
  const geometry = await page.evaluate((requiredTerms) => requiredTerms.map((text) => {
    const token = [...document.querySelectorAll(".cjk-term")]
      .find((element) => element.textContent.trim() === text);
    const container = token?.closest("legend, .check-row");
    const range = document.createRange();
    if (token) range.selectNodeContents(token);
    return {
      text,
      found: Boolean(token),
      rects: token ? [...range.getClientRects()].map((rect) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      })) : [],
      container: container ? {
        clientWidth: container.clientWidth,
        scrollWidth: container.scrollWidth,
      } : null,
    };
  }), terms);
  writeFileSync(
    `${evidenceRoot}/${name}.json`,
    `${JSON.stringify(geometry, null, 2)}\n`,
    "utf8",
  );
  for (const term of geometry) {
    expect(term.found, `${name}: ${term.text} is an explicit semantic term`).toBe(true);
    expect(term.rects, `${name}: ${term.text} stays on one line`).toHaveLength(1);
    expect(term.container, `${name}: ${term.text} has a containing row`).not.toBeNull();
    expect(
      term.container.scrollWidth,
      `${name}: ${term.text} row does not overflow`,
    ).toBeLessThanOrEqual(term.container.clientWidth);
  }
}

async function expectResultScoreGeometry(page, name, requirePositiveGap) {
  const geometry = await page.evaluate(() => window.__pumpingTest.snapshot.visualAudit.resultScore);
  writeFileSync(
    `${FINAL_THREE_EVIDENCE}/${name}.json`,
    `${JSON.stringify(geometry, null, 2)}\n`,
    "utf8",
  );
  expect(geometry?.total).toBeTruthy();
  for (const key of ["K", "Ss"]) {
    const label = geometry.parts[key];
    expect(label, `${name}: ${key} label bounds`).toBeTruthy();
    const gap = label.y - (geometry.total.y + geometry.total.height);
    const overlaps = geometry.total.x < label.x + label.width
      && geometry.total.x + geometry.total.width > label.x
      && geometry.total.y < label.y + label.height
      && geometry.total.y + geometry.total.height > label.y;
    expect(overlaps, `${name}: total and ${key} labels do not overlap`).toBe(false);
    if (requirePositiveGap) expect(gap, `${name}: total has vertical space before ${key}`).toBeGreaterThan(0);
  }
}

async function expectNarrowControlsReadable(
  page,
  name,
  evidenceRoot = FINAL_NARROW_V10_EVIDENCE,
) {
  const geometry = await page.evaluate(() => {
    const root = document.documentElement;
    const cjk = /[\u3400-\u9fff]/u;
    const visible = (element) => element.getClientRects().length > 0;
    const lineText = (element) => {
      const lines = new Map();
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let offset = 0; offset < node.textContent.length; offset += 1) {
          const character = node.textContent[offset];
          if (/\s/u.test(character)) continue;
          const range = document.createRange();
          range.setStart(node, offset);
          range.setEnd(node, offset + 1);
          const rect = range.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const key = Math.round(rect.y * 2) / 2;
          lines.set(key, `${lines.get(key) ?? ""}${character}`);
        }
      }
      return [...lines.values()];
    };
    const labels = [...document.querySelectorAll([
      "#hud-mode",
      ".mode-card strong",
      "#stage-controls button",
      "#stage-controls label",
      "#stage-controls .fit-metrics div",
      "#stage-controls .result-table td",
      "#target-controls button",
      "#crew-controls button",
    ].join(", "))].filter(visible).map((element) => {
      const lines = lineText(element);
      return {
        text: element.textContent.trim().replace(/\s+/gu, " "),
        lines,
        singleCjkLines: lines.filter((line) => line.length === 1 && cjk.test(line)),
      };
    });
    const controls = [...document.querySelectorAll([
      "#stage-controls button",
      "#stage-controls label",
      "#stage-controls input:not([type='radio']):not([type='checkbox'])",
      "#target-controls button",
      "#crew-controls button",
    ].join(", "))].filter(visible).map((element) => ({
      text: element.textContent.trim().replace(/\s+/gu, " "),
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    const pumpingToken = [...document.querySelectorAll(".target-copy .cjk-token")]
      .find((element) => element.textContent === "啟動抽水與記錄器");
    const pumpingButton = pumpingToken?.closest("button");
    const pumpingTokenRect = pumpingToken?.getBoundingClientRect();
    const pumpingButtonRect = pumpingButton?.getBoundingClientRect();
    const table = document.querySelector(".result-table");
    const tableHead = table?.querySelector("thead");
    const tableCells = table ? [...table.querySelectorAll("td")].map((cell) => ({
      display: getComputedStyle(cell).display,
      label: getComputedStyle(cell, "::before").content,
      clientWidth: cell.clientWidth,
      scrollWidth: cell.scrollWidth,
    })) : [];
    const resultTotal = document.querySelector(".result-headline strong");
    const resultTotalRange = document.createRange();
    if (resultTotal) resultTotalRange.selectNodeContents(resultTotal);
    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      labels,
      controls,
      pumpingTarget: pumpingTokenRect && pumpingButtonRect ? {
        tokenLeft: pumpingTokenRect.left,
        tokenRight: pumpingTokenRect.right,
        buttonLeft: pumpingButtonRect.left,
        buttonRight: pumpingButtonRect.right,
      } : null,
      resultTable: table ? {
        headDisplay: getComputedStyle(tableHead).display,
        cells: tableCells,
      } : null,
      resultTotal: resultTotal ? {
        clientWidth: resultTotal.clientWidth,
        scrollWidth: resultTotal.scrollWidth,
        rects: [...resultTotalRange.getClientRects()].map((rect) => ({
          width: rect.width,
          height: rect.height,
        })),
      } : null,
    };
  });
  writeFileSync(
    `${evidenceRoot}/${name}.json`,
    `${JSON.stringify(geometry, null, 2)}\n`,
    "utf8",
  );
  expect(geometry.scrollWidth, `${name}: page has no horizontal overflow`).toBeLessThanOrEqual(
    geometry.clientWidth,
  );
  for (const label of geometry.labels) {
    expect(
      label.singleCjkLines,
      `${name}: "${label.text}" has no one-character vertical fragment`,
    ).toEqual([]);
  }
  for (const control of geometry.controls) {
    expect(
      control.scrollWidth,
      `${name}: "${control.text}" stays inside its control`,
    ).toBeLessThanOrEqual(control.clientWidth);
  }
  if (geometry.pumpingTarget) {
    expect(
      geometry.pumpingTarget.tokenLeft - geometry.pumpingTarget.buttonLeft,
      `${name}: pumping label has visible left inset`,
    ).toBeGreaterThanOrEqual(
      8,
    );
    expect(
      geometry.pumpingTarget.buttonRight - geometry.pumpingTarget.tokenRight,
      `${name}: pumping label has visible right inset`,
    ).toBeGreaterThanOrEqual(
      8,
    );
  }
  if (geometry.resultTable) {
    expect(geometry.resultTable.headDisplay).toBe("none");
    for (const cell of geometry.resultTable.cells) {
      expect(cell.display).toBe("grid");
      expect(cell.label).not.toBe("none");
      expect(cell.scrollWidth).toBeLessThanOrEqual(cell.clientWidth);
    }
  }
  if (geometry.resultTotal) {
    expect(geometry.resultTotal.rects, `${name}: total score stays on one line`).toHaveLength(1);
    expect(geometry.resultTotal.scrollWidth).toBeLessThanOrEqual(
      geometry.resultTotal.clientWidth,
    );
  }
}

async function expectHudModeReadable(page, scenario, width = 188) {
  const geometry = await page.locator("#hud-mode").evaluate((mode) => {
    const lines = new Map();
    const walker = document.createTreeWalker(mode, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (let offset = 0; offset < node.textContent.length; offset += 1) {
        const character = node.textContent[offset];
        if (/\s/u.test(character)) continue;
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset + 1);
        const rect = range.getBoundingClientRect();
        const key = Math.round(rect.y * 2) / 2;
        lines.set(key, `${lines.get(key) ?? ""}${character}`);
      }
    }
    const rect = mode.getBoundingClientRect();
    const containerRect = mode.parentElement.getBoundingClientRect();
    return {
      text: mode.textContent.trim(),
      lines: [...lines.values()],
      clientWidth: mode.clientWidth,
      scrollWidth: mode.scrollWidth,
      left: rect.left,
      right: rect.right,
      containerLeft: containerRect.left,
      containerRight: containerRect.right,
      pageClientWidth: document.documentElement.clientWidth,
      pageScrollWidth: document.documentElement.scrollWidth,
    };
  });
  writeFileSync(
    `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-hud-${scenario}-${width}.json`,
    `${JSON.stringify(geometry, null, 2)}\n`,
    "utf8",
  );
  expect(geometry.pageScrollWidth).toBeLessThanOrEqual(geometry.pageClientWidth);
  expect(geometry.scrollWidth, `${scenario}: HUD value stays inside its own box`).toBeLessThanOrEqual(
    geometry.clientWidth,
  );
  expect(geometry.left).toBeGreaterThanOrEqual(geometry.containerLeft);
  expect(geometry.right).toBeLessThanOrEqual(geometry.containerRight);
  expect(
    geometry.lines.at(-1),
    `${scenario}: HUD mode has no one-character terminal line`,
  ).not.toMatch(/^[\u3400-\u9fff]$/u);
}

test("protected CJK control tokens remain whole across desktop, mobile, and effective 200% width", async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const health = monitorPage(page);
  try {
    await startRound(page, { scenario: "guided", mode: "mouse" });
    await expectProtectedCjkGeometry(page, "desktop-stage-01");
    await page.screenshot({
      path: `${FINAL_CJK_EVIDENCE}/desktop-stage-01.png`,
      fullPage: true,
    });
    await chooseCrew(page, "hydro", "mouse");
    await chooseTarget(page, "候選地 A", "mouse");
    await waitStage(page, "construction");
    await expectProtectedCjkGeometry(page, "desktop-stage-02");
    await page.screenshot({
      path: `${FINAL_CJK_EVIDENCE}/desktop-stage-02.png`,
      fullPage: true,
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await startRound(page, { scenario: "guided", mode: "mouse" });
    await expectProtectedCjkGeometry(page, "mobile-375-stage-01");
    await page.screenshot({
      path: `${FINAL_CJK_EVIDENCE}/mobile-375-stage-01.png`,
      fullPage: true,
    });

    await page.setViewportSize({ width: 188, height: 812 });
    await startRound(page, { scenario: "guided", mode: "mouse" });
    await expectProtectedCjkGeometry(page, "zoom-200-stage-01");
    await page.screenshot({
      path: `${FINAL_CJK_EVIDENCE}/zoom-200-stage-01.png`,
      fullPage: true,
    });
    await completeRound(page, {
      scenario: "guided",
      mode: "mouse",
      stopAtAnalysis: true,
    });
    await chooseLabel(page, "Cooper–Jacob 晚期直線", "mouse");
    await expectProtectedCjkGeometry(page, "zoom-200-stage-05", [
      "Cooper–Jacob",
      "晚期直線",
    ]);
    await page.screenshot({
      path: `${FINAL_CJK_EVIDENCE}/zoom-200-stage-05.png`,
      fullPage: true,
    });
    expectHealthy(health);
  } finally {
    await context.close();
  }
});

test("188px semantic terms and result-canvas score labels retain their separate lines", async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: { width: 188, height: 812 } });
  const page = await context.newPage();
  const health = monitorPage(page);
  try {
    for (const scenario of ["guided", "expert-river", "expert-barrier"]) {
      await startRound(page, { scenario, mode: "mouse" });
      await completeRound(page, {
        scenario,
        mode: "mouse",
        stopAtAnalysis: true,
        onDataPreparation: scenario === "guided" ? null : async () => {
          await expectIndivisibleTermGeometry(page, `188-${scenario}-data-preparation`, [
            "套用基線修正",
          ]);
          await page.screenshot({
            path: `${FINAL_THREE_EVIDENCE}/188-${scenario}-data-preparation.png`,
            fullPage: true,
          });
        },
      });
      await expectIndivisibleTermGeometry(page, `188-${scenario}-analysis`, [
        "含水層邊界假設",
      ]);
      await page.screenshot({
        path: `${FINAL_THREE_EVIDENCE}/188-${scenario}-analysis.png`,
        fullPage: true,
      });
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await startRound(page, { scenario: "guided", mode: "mouse" });
    await completeRound(page, { scenario: "guided", mode: "mouse" });
    await expectResultScoreGeometry(page, "result-score-desktop-1280", true);
    await page.screenshot({
      path: `${FINAL_THREE_EVIDENCE}/result-score-desktop-1280.png`,
      fullPage: true,
    });
    for (const [width, name] of [[375, "375"], [188, "188"]]) {
      await page.setViewportSize({ width, height: 812 });
      await expectResultScoreGeometry(page, `result-score-${name}`, false);
      await page.screenshot({
        path: `${FINAL_THREE_EVIDENCE}/result-score-${name}.png`,
        fullPage: true,
      });
    }
    expectHealthy(health);
  } finally {
    await context.close();
  }
});

test("188px classic-scrollbar viewport keeps every HUD mode phrase readable", async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: { width: 188, height: 812 } });
  const page = await context.newPage();
  const health = monitorPage(page);
  try {
    for (const scenario of ["guided", "expert-river", "expert-barrier"]) {
      await startRound(page, { scenario, mode: "mouse" });
      await page.addStyleTag({
        content: "html { overflow-y: scroll; scrollbar-gutter: stable; }",
      });
      await expectHudModeReadable(page, scenario);
      await page.screenshot({
        path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-hud-${scenario}-188.png`,
        fullPage: true,
      });
      if (scenario === "expert-barrier") {
        await page.screenshot({
          path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-standalone-barrier-stage1-188.png`,
          fullPage: true,
        });
      }
    }
    for (const [width, height] of [[375, 850], [1280, 900]]) {
      await page.setViewportSize({ width, height });
      await startRound(page, { scenario: "expert-barrier", mode: "mouse" });
      await expectHudModeReadable(page, "expert-barrier", width);
      await page.screenshot({
        path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-standalone-barrier-stage1-${width}.png`,
        fullPage: true,
      });
    }
    expectHealthy(health);
  } finally {
    await context.close();
  }
});

test("188px game controls reflow into readable rows and result cards", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 188, height: 812 } });
  const page = await context.newPage();
  const health = monitorPage(page);
  try {
    await page.goto(`${ORIGIN}${STANDALONE_ROUTE}`, { waitUntil: "networkidle" });
    await expectNarrowControlsReadable(page, "188-opening", FINAL_TOKEN_HUD_EVIDENCE);
    await page.screenshot({
      path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-standalone-opening-188.png`,
      fullPage: true,
    });

    await startRound(page, { scenario: "expert-barrier", mode: "mouse" });
    await completeRound(page, {
      scenario: "expert-barrier",
      mode: "mouse",
      onStage: async (stage) => {
        await expectNarrowControlsReadable(
          page,
          `188-${stage}`,
          FINAL_TOKEN_HUD_EVIDENCE,
        );
        if (stage === "pumping") {
          await expect(
            page.locator(".target-copy .cjk-token")
              .filter({ hasText: "啟動抽水與記錄器" }),
          ).toHaveCount(1);
        }
        if (stage === "data-preparation") {
    await expectIndivisibleTermGeometry(page, "v10-188-data-preparation", [
      "套用基線修正",
    ], FINAL_NARROW_V10_EVIDENCE);
        }
        if (stage === "analysis") {
    await expectIndivisibleTermGeometry(page, "v10-188-analysis", [
      "含水層邊界假設",
    ], FINAL_NARROW_V10_EVIDENCE);
          const runAnalysis = page.locator("#run-analysis");
          await runAnalysis.focus();
          await page.keyboard.press("Tab");
          await page.keyboard.press("Shift+Tab");
          const focus = await runAnalysis.evaluate((button) => {
            const style = getComputedStyle(button);
            return {
              focusVisible: button.matches(":focus-visible"),
              outlineColor: style.outlineColor,
              outlineStyle: style.outlineStyle,
              outlineWidth: style.outlineWidth,
            };
          });
          writeFileSync(
            `${FINAL_NARROW_V10_EVIDENCE}/focus-visible-188.json`,
            `${JSON.stringify(focus, null, 2)}\n`,
            "utf8",
          );
          expect(focus.focusVisible).toBe(true);
          expect(focus.outlineStyle).toBe("solid");
          expect(Number.parseFloat(focus.outlineWidth)).toBeGreaterThanOrEqual(3);
        }
        await page.screenshot({
        path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-standalone-${stage}-188.png`,
          fullPage: true,
        });
      },
    });

    for (const [width, height] of [[375, 850], [1280, 900]]) {
      await page.setViewportSize({ width, height });
      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        tableHeadDisplay: getComputedStyle(
          document.querySelector(".result-table thead"),
        ).display,
      }));
      writeFileSync(
        `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-results-${width}.json`,
        `${JSON.stringify(layout, null, 2)}\n`,
        "utf8",
      );
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
      expect(layout.tableHeadDisplay).toBe("table-header-group");
      await page.screenshot({
        path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-standalone-results-${width}.png`,
        fullPage: true,
      });
    }

    for (const [width, height] of [[188, 812], [375, 850], [1280, 900]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${ORIGIN}${MAIN_ROUTE}`, { waitUntil: "networkidle" });
      const mainRoute = await page.evaluate(() => {
        const root = document.documentElement;
        const nav = document.querySelector(".site-header .nav");
        const brand = document.querySelector(".site-header .brand");
        const links = [...document.querySelectorAll(".site-header .nav-links a")];
        const brandRect = brand.getBoundingClientRect();
        return {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          navDisplay: getComputedStyle(nav).display,
          brandBottom: brandRect.bottom,
          firstLinkTop: links[0].getBoundingClientRect().top,
          linkWidths: links.map((link) => ({
            clientWidth: link.clientWidth,
            scrollWidth: link.scrollWidth,
          })),
        };
      });
      writeFileSync(
        `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-main-route-${width}.json`,
        `${JSON.stringify(mainRoute, null, 2)}\n`,
        "utf8",
      );
      expect(mainRoute.scrollWidth).toBeLessThanOrEqual(mainRoute.clientWidth);
      if (width === 188) {
        expect(mainRoute.firstLinkTop).toBeGreaterThanOrEqual(mainRoute.brandBottom);
        for (const link of mainRoute.linkWidths) {
          expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth);
        }
      }
      await page.screenshot({
        path: `${FINAL_TOKEN_HUD_EVIDENCE}/${TOKEN_HUD_PHASE}-main-route-${width}.png`,
        fullPage: true,
      });
    }
    expectHealthy(health);
  } finally {
    await context.close();
  }
});

test("CJK layout stays whole through every previously blocked game state", async ({
  browser,
}) => {
  const labels = [
    ".target-copy",
    ".compact-choice-copy",
    ".check-row",
    ".range-grid label",
    ".parameter-grid label",
    ".result-table caption",
    ".scientific-explanation",
    ".crew-reaction",
  ];
  const touch = await browser.newContext({
    viewport: { width: 375, height: 850 },
    hasTouch: true,
    isMobile: true,
  });
  const narrow = await browser.newContext({ viewport: { width: 188, height: 812 } });
  const reduced = await browser.newContext({
    viewport: { width: 375, height: 850 },
    reducedMotion: "reduce",
  });
  const outer = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  try {
    const touchPage = await touch.newPage();
    await startRound(touchPage, { scenario: "guided", mode: "touch" });
    await chooseCrew(touchPage, "hydro", "touch");
    await chooseTarget(touchPage, "候選地 A", "touch");
    await waitStage(touchPage, "construction");
    await expectNoCjkGeometryFailures(touchPage, "mobile-375-guided-touch-stage-02-construction", labels);
    await touchPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/mobile-375-guided-touch-stage-02-construction.png`,
      fullPage: true,
    });

    const narrowPage = await narrow.newPage();
    await startRound(narrowPage, { scenario: "guided", mode: "mouse" });
    await chooseCrew(narrowPage, "hydro", "mouse");
    await chooseTarget(narrowPage, "候選地 A", "mouse");
    await waitStage(narrowPage, "construction");
    await expectNoCjkGeometryFailures(narrowPage, "zoom-200-guided-stage-02-construction", labels);
    await narrowPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/zoom-200-guided-stage-02-construction.png`,
      fullPage: true,
    });
    await chooseCrew(narrowPage, "driller", "mouse");
    await chooseTarget(narrowPage, "抽水井 P-1", "mouse");
    await chooseCrew(narrowPage, "instrument", "mouse");
    await chooseTarget(narrowPage, "觀測井 O-1", "mouse");
    await activate(narrowPage.locator("#advance-construction"), "mouse");
    await waitStage(narrowPage, "pumping");
    await chooseLabel(narrowPage, "600 m³／day", "mouse");
    await chooseCrew(narrowPage, "operator", "mouse");
    await chooseTarget(narrowPage, "啟動抽水", "mouse");
    await expect.poll(async () => Number(
      (await narrowPage.locator(".record-progress").getAttribute("aria-valuenow")) ?? 0,
    )).toBeGreaterThanOrEqual(20);
    await activate(narrowPage.locator("#stop-pumping"), "mouse");
    await waitStage(narrowPage, "data-preparation");
    await expectNoCjkGeometryFailures(narrowPage, "zoom-200-guided-stage-04-data-preparation", labels);
    await narrowPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/zoom-200-guided-stage-04-data-preparation.png`,
      fullPage: true,
    });
    await activate(narrowPage.locator('#stage-controls input[type="checkbox"]').first(), "mouse");
    await activate(narrowPage.locator("#confirm-data"), "mouse");
    await waitStage(narrowPage, "analysis");
    await expectNoCjkGeometryFailures(narrowPage, "zoom-200-guided-stage-05-analysis", labels);
    await narrowPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/zoom-200-guided-stage-05-analysis.png`,
      fullPage: true,
    });
    await activate(narrowPage.locator("#run-analysis"), "mouse");
    await expectNoCjkGeometryFailures(narrowPage, "zoom-200-guided-analysis-fit", labels);
    await narrowPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/zoom-200-guided-analysis-fit.png`,
      fullPage: true,
    });
    const estimateK = await narrowPage.locator("#estimate-k").inputValue();
    const estimateSs = await narrowPage.locator("#estimate-ss").inputValue();
    await narrowPage.locator("#estimate-k").fill(estimateK);
    await narrowPage.locator("#estimate-ss").fill(estimateSs);
    await activate(narrowPage.locator("#confirm-estimate"), "mouse");
    await activate(narrowPage.locator("#submit-analysis"), "mouse");
    await waitStage(narrowPage, "results");
    await expectNoCjkGeometryFailures(narrowPage, "zoom-200-guided-stage-06-results", labels);
    await narrowPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/zoom-200-guided-stage-06-results.png`,
      fullPage: true,
    });

    const reducedPage = await reduced.newPage();
    await startRound(reducedPage, { scenario: "guided", mode: "mouse" });
    await chooseCrew(reducedPage, "hydro", "mouse");
    await chooseTarget(reducedPage, "候選地 A", "mouse");
    await waitStage(reducedPage, "construction");
    await expectNoCjkGeometryFailures(reducedPage, "reduced-motion-stage-02-complete", labels);
    await reducedPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/reduced-motion-stage-02-complete.png`,
      fullPage: true,
    });

    const outerPage = await outer.newPage();
    await outerPage.goto(`${ORIGIN}${MAIN_ROUTE}`, { waitUntil: "networkidle" });
    await outerPage.locator(".game-credit").scrollIntoViewIfNeeded();
    await expectNoCjkGeometryFailures(outerPage, "desktop-game-main-credit", [
      ".game-credit h2",
      ".game-credit__copy p",
    ]);
    await outerPage.screenshot({
      path: `${FINAL_CJK_GEOMETRY_EVIDENCE}/desktop-game-main-credit.png`,
      fullPage: true,
    });
  } finally {
    await Promise.all([touch.close(), narrow.close(), reduced.close(), outer.close()]);
  }
});

async function completeRound(page, options) {
  const {
    boundary = "correct",
    method = "theis",
    mode,
    scenario,
    rejectionChecks = false,
    stopAtAnalysis = false,
    onDataPreparation = null,
    onStage = null,
  } = options;
  if (rejectionChecks) {
    const unassigned = await visibleRoundState(page);
    await chooseTarget(page, "候選地 A", mode);
    await expectRejectedWithoutRoundChange(page, unassigned, "不同專長");
    await chooseCrew(page, "driller", mode);
    await chooseTarget(page, "候選地 A", mode);
    await expectRejectedWithoutRoundChange(page, unassigned, "不同專長");
    await waitStage(page, "site-survey");
  }
  await chooseCrew(page, "hydro", mode);
  await chooseTarget(page, "候選地 A", mode);
  await waitStage(page, "construction");
  if (onStage) await onStage("construction");
  if (rejectionChecks) {
    await expect(page.locator("#stage-controls")).toContainText("井距至少 20 m");
    const emptyConstruction = await visibleRoundState(page);
    await activate(page.locator("#advance-construction"), mode);
    await expectRejectedWithoutRoundChange(
      page,
      emptyConstruction,
      "至少一口觀測井",
    );
    await waitStage(page, "construction");
  }
  await chooseCrew(page, "driller", mode);
  await chooseTarget(page, "抽水井 P-1", mode);
  if (rejectionChecks) {
    const pumpOnly = await visibleRoundState(page);
    await chooseCrew(page, "driller", mode);
    await chooseTarget(page, CLOSE_OBSERVATION_TARGET, mode);
    await expectRejectedWithoutRoundChange(page, pumpOnly, "不同專長");
    await activate(page.locator("#advance-construction"), mode);
    await expectRejectedWithoutRoundChange(page, pumpOnly, "至少一口觀測井");
  }
  await chooseCrew(page, "instrument", mode);
  if (scenario === "guided") {
    const beforeCloseAttempt = await visibleRoundState(page);
    const closeTarget = page.locator("button.target-button")
      .filter({ hasText: CLOSE_OBSERVATION_TARGET })
      .first();
    await activate(closeTarget, rejectionChecks ? "keyboard" : mode);
    await expectRejectedWithoutRoundChange(
      page,
      beforeCloseAttempt,
      "井距不符合最低間距",
    );
    await expect(page.locator("#status-region")).toHaveAttribute("data-tone", "error");
    await expect(page.locator("#stage-controls")).toContainText("觀測井 0／3");
    await expect(closeTarget).toBeEnabled();
    if (rejectionChecks) {
      await page.screenshot({
        path: `${FIX_EVIDENCE}/close-spacing-rejected.png`,
        fullPage: true,
      });
      await activate(closeTarget, "mouse");
      await expectRejectedWithoutRoundChange(
        page,
        beforeCloseAttempt,
        "井距不符合最低間距",
      );
    }
  }
  await chooseTarget(page, "觀測井 O-1", mode);
  if (rejectionChecks) {
    await expect(page.locator("#stage-controls")).toContainText("觀測井 1／3");
    await expect(page.locator("#status-region")).toContainText("現地工作已完成");
    await page.screenshot({
      path: `${FIX_EVIDENCE}/valid-well-continuation.png`,
      fullPage: true,
    });
  }
  await activate(page.locator("#advance-construction"), mode);
  await waitStage(page, "pumping");
  if (onStage) await onStage("pumping");
  await chooseLabel(page, scenario === "guided" ? "600 m³／day" : "700 m³／day", mode);
  await chooseCrew(page, "operator", mode);
  await chooseTarget(page, "啟動抽水", mode);
  if (rejectionChecks) {
    await expect(page.locator("#stop-pumping")).toBeDisabled();
  }
  const minimum = scenario === "guided" ? 20 : 30;
  await expect.poll(async () => Number(
    (await page.locator(".record-progress").getAttribute("aria-valuenow")) ?? 0,
  )).toBeGreaterThanOrEqual(minimum);
  await activate(page.locator("#stop-pumping"), mode);
  await waitStage(page, "data-preparation");
  if (onStage) await onStage("data-preparation");
  if (onDataPreparation) await onDataPreparation();
  if (rejectionChecks) {
    await activate(page.locator("#confirm-data"), mode);
    await expect(page.locator("#status-region")).toContainText("至少保留");
  }
  const checks = page.locator('#stage-controls input[type="checkbox"]');
  await activate(checks.first(), mode);
  if (rejectionChecks) {
    await page.locator("#window-start").focus();
    await page.keyboard.press("End");
    await page.locator("#window-end").focus();
    await page.keyboard.press("Home");
    await activate(page.locator("#confirm-data"), mode);
    await expect(page.locator("#status-region")).toContainText("時間窗");
    await page.locator("#window-start").focus();
    await page.keyboard.press("Home");
    await page.locator("#window-end").focus();
    await page.keyboard.press("End");
  }
  if (scenario !== "guided") {
    await activate(checks.nth(1), mode);
    await activate(checks.nth(2), mode);
  }
  if (method === "cooper-jacob") {
    await page.locator("#window-start").evaluate((input) => {
      input.value = "27";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect(page.locator("#window-start")).toHaveValue("27");
  }
  await activate(page.locator("#confirm-data"), mode);
  await waitStage(page, "analysis");
  if (onStage) await onStage("analysis");
  if (stopAtAnalysis) return null;
  if (rejectionChecks) {
    await chooseLabel(page, "Cooper–Jacob 晚期直線", mode);
    await activate(page.locator("#run-analysis"), mode);
    await expect(page.locator("#status-region")).toContainText("晚期");
    await waitStage(page, "analysis");
    await chooseLabel(page, "Theis 全曲線擬合", mode);
  }
  if (scenario !== "guided") {
    await expect(page.locator(".science-warning")).toContainText("邊界假設警示");
    const correctBoundary = scenario === "expert-river"
      ? "河流定水頭邊界"
      : "阻水無流量邊界";
    if (boundary === "plain") {
      await chooseLabel(page, correctBoundary, mode);
      await expect(page.locator(".science-warning")).toHaveCount(0);
      await chooseLabel(page, "一般／無限含水層", mode);
      await expect(page.locator("#status-region")).toContainText("模型判斷分數會降低");
      await expect(page.locator(".science-warning")).toContainText("模型判斷分數會降低");
    } else {
      await chooseLabel(page, correctBoundary, mode);
    }
  }
  if (method === "cooper-jacob") {
    await chooseLabel(page, "Cooper–Jacob 晚期直線", mode);
  }
  await activate(page.locator("#run-analysis"), mode);
  await expect(page.locator(".fit-metrics")).toContainText("RMSE");
  const k = await page.locator("#estimate-k").inputValue();
  const ss = await page.locator("#estimate-ss").inputValue();
  if (rejectionChecks) {
    await page.locator("#estimate-k").fill("0");
    await activate(page.locator("#confirm-estimate"), mode);
    await expect(page.locator("#status-region")).toContainText("K 與 Ss");
    await waitStage(page, "analysis");
  }
  await page.locator("#estimate-k").fill(k);
  await page.locator("#estimate-ss").fill(ss);
  await activate(page.locator("#confirm-estimate"), mode);
  await activate(page.locator("#submit-analysis"), mode);
  await waitStage(page, "results");
  if (onStage) await onStage("results");
  const results = await page.locator("#stage-controls").innerText();
  for (const label of [
    "導水係數 K",
    "比儲水係數 Ss",
    "模型判斷",
    "資料充分性",
    "預算管理",
  ]) {
    expect(results).toContain(label);
  }
  expect(results).not.toMatch(/NaN|Infinity/);
  expect(await page.locator("body").innerText()).not.toMatch(PRIVATE_COPY);
  return visibleResultScore(page);
}

async function replay(page, options) {
  await activate(page.locator("#review-results"), options.mode);
  await activate(
    page.locator(options.seedMode === "same" ? "#replay-same" : "#replay-new"),
    options.mode,
  );
  await waitStage(page, "site-survey");
  await expect(page.locator("#status-region")).toContainText("先選擇一位工作人員");
}

test("deployed routes, base paths, regression pages, and screenshot widths are healthy", async ({
  page,
}, testInfo) => {
  const health = monitorPage(page, (request) =>
    request.resourceType() === "media"
    && request.failure()?.errorText === "net::ERR_ABORTED"
    && request.url().startsWith(`${ORIGIN}${BASE}/videos/`));
  for (const route of [
    `${BASE}/`,
    `${BASE}/xiaolin/`,
    `${BASE}/concepts/lagging-theory/`,
    MAIN_ROUTE,
  ]) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    const internalLinks = await page.locator("a").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")).filter((href) => href?.startsWith("/")));
    expect(internalLinks.every((href) => href.startsWith(`${BASE}/`))).toBe(true);
  }
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    `${STANDALONE_ROUTE}`,
  );
  const astroResources = await page.evaluate(() =>
    performance.getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => url.includes("/_astro/")));
  expect(astroResources.length).toBeGreaterThan(0);
  expect(astroResources.every((url) => url.includes(`${BASE}/_astro/`))).toBe(true);

  for (const [surface, route] of [
    ["main", MAIN_ROUTE],
    ["standalone", STANDALONE_ROUTE],
  ]) {
    for (const width of [375, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      const geometry = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
      await page.screenshot({
        path: testInfo.outputPath(`${surface}-${width}.png`),
        fullPage: true,
      });
    }
  }
  expectHealthy(health);
});

test("crew assignment exposes idle, walking, task, complete, and error states", async ({
  page,
}) => {
  const health = monitorPage(page);
  await startRound(page, { scenario: "guided", mode: "mouse" });
  const hydro = page.locator('[data-crew-id="hydrogeologist"]');
  const driller = page.locator('[data-crew-id="driller"]');

  await chooseCrew(page, "hydro", "mouse");
  await expect(hydro).toHaveAttribute("data-visual-state", "idle");
  await expect(hydro.locator(".crew-state-label")).toContainText("已選取");
  await page.screenshot({ path: `${F1_EVIDENCE}/crew-start-idle.png`, fullPage: true });

  const beforeError = await visibleRoundState(page);
  await chooseCrew(page, "driller", "mouse");
  await chooseTarget(page, "候選地 A", "mouse");
  await expect(driller).toHaveAttribute("data-visual-state", "error");
  await expect(driller.locator(".crew-state-label")).toContainText("未完成");
  await expectRejectedWithoutRoundChange(page, beforeError, "不同專長");
  await page.screenshot({ path: `${F1_EVIDENCE}/crew-error.png`, fullPage: true });
  await expect(driller).toHaveAttribute("data-visual-state", "idle");

  await chooseCrew(page, "hydro", "mouse");
  await chooseTarget(page, "候選地 A", "mouse");
  await expect(hydro).toHaveAttribute("data-visual-state", "walking");
  await page.screenshot({ path: `${F1_EVIDENCE}/crew-walking.png`, fullPage: true });
  await expect(hydro).toHaveAttribute("data-visual-state", "task");
  await expect(hydro.locator(".crew-state-label")).toContainText("作業中");
  await page.screenshot({ path: `${F1_EVIDENCE}/crew-task.png`, fullPage: true });
  await expect(hydro).toHaveAttribute("data-visual-state", "complete");
  await expect(hydro.locator(".crew-state-label")).toContainText("已完成");
  await page.screenshot({ path: `${F1_EVIDENCE}/crew-complete.png`, fullPage: true });
  await expect(hydro).toHaveAttribute("data-visual-state", "idle");
  await waitStage(page, "construction");
  await expectClearConstructionLabels(page);

  await chooseCrew(page, "driller", "mouse");
  await chooseTarget(page, "抽水井 P-1", "mouse");
  await expect(driller).toHaveAttribute("data-visual-state", "walking");
  await expectClearConstructionLabels(page);
  await expect(driller).toHaveAttribute("data-visual-state", "task");
  await expectClearConstructionLabels(page);
  await expect(driller).toHaveAttribute("data-visual-state", "complete");
  await expectClearConstructionLabels(page);
  await expectReadableHudAtDoubleZoom(page);
  expectHealthy(health);
});

test("guided mouse round covers rejection gates and three deterministic replays", async ({
  page,
}, testInfo) => {
  const health = monitorPage(page);
  await startRound(page, { scenario: "guided", mode: "mouse" });
  await completeRound(page, {
    scenario: "guided",
    mode: "mouse",
    rejectionChecks: true,
  });
  await page.screenshot({
    path: testInfo.outputPath("guided-mouse-results.png"),
    fullPage: true,
  });
  for (const seedMode of ["same", "new", "same"]) {
    await replay(page, { mode: "mouse", seedMode });
    await completeRound(page, { scenario: "guided", mode: "mouse" });
  }
  expectHealthy(health);
});

test("expert river plain-Theis choice shows warning and loses model score", async ({
  page,
}, testInfo) => {
  const health = monitorPage(page);
  await startRound(page, { scenario: "expert-river", mode: "mouse" });
  const correct = await completeRound(page, {
    scenario: "expert-river",
    mode: "mouse",
  });
  await page.screenshot({
    path: testInfo.outputPath("expert-river-correct-results.png"),
    fullPage: true,
  });
  await replay(page, { mode: "mouse", seedMode: "same" });
  const wrong = await completeRound(page, {
    boundary: "plain",
    scenario: "expert-river",
    mode: "mouse",
  });
  expect(wrong.modelJudgment).toBeLessThan(correct.modelJudgment);
  expect(wrong.total).toBeLessThan(correct.total);
  await page.screenshot({
    path: `${FIX_EVIDENCE}/wrong-boundary-results.png`,
    fullPage: true,
  });
  expectHealthy(health);
});

test("expert barrier completes through its real boundary workflow", async ({
  page,
}, testInfo) => {
  const health = monitorPage(page);
  await startRound(page, { scenario: "expert-barrier", mode: "mouse" });
  await completeRound(page, { scenario: "expert-barrier", mode: "mouse" });
  await page.screenshot({
    path: testInfo.outputPath("expert-barrier-results.png"),
    fullPage: true,
  });
  expectHealthy(health);
});

test("expert barrier gives Cooper-Jacob partial credit and boundary-aware Theis full credit", async ({
  page,
}) => {
  const health = monitorPage(page);
  await startRound(page, { scenario: "expert-barrier", mode: "mouse" });
  const cooperJacob = await completeRound(page, {
    method: "cooper-jacob",
    scenario: "expert-barrier",
    mode: "mouse",
  });
  expect(cooperJacob.modelJudgment).toBe(8);
  await expect(page.locator(".model-compatibility")).toContainText(
    "Cooper–Jacob 可估計晚期的有效參數",
  );
  await expect(page.locator(".model-compatibility")).toContainText(
    "未擬合河流／阻水邊界的鏡像井效應",
  );
  await page.screenshot({
    path: `${BOUNDARY_METHOD_EVIDENCE}/e2e-expert-barrier-cooper-jacob-partial.png`,
    fullPage: true,
  });
  await replay(page, { mode: "mouse", seedMode: "same" });
  const boundaryAwareTheis = await completeRound(page, {
    method: "theis",
    scenario: "expert-barrier",
    mode: "mouse",
  });
  expect(boundaryAwareTheis.modelJudgment).toBe(15);
  await expect(page.locator(".model-compatibility")).toHaveCount(0);
  await page.screenshot({
    path: `${BOUNDARY_METHOD_EVIDENCE}/e2e-expert-barrier-theis-full.png`,
    fullPage: true,
  });
  expectHealthy(health);
});

test("guided keyboard-only round reaches finite results", async ({ page }) => {
  const health = monitorPage(page);
  await startRound(page, { scenario: "guided", mode: "keyboard" });
  await completeRound(page, { scenario: "guided", mode: "keyboard" });
  expectHealthy(health);
});

test("375px touch round reaches finite results without overflow", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 850 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const health = monitorPage(page);
  try {
    await startRound(page, { scenario: "guided", mode: "touch" });
    await completeRound(page, { scenario: "guided", mode: "touch" });
    const geometry = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width);
    await page.screenshot({
      path: testInfo.outputPath("touch-375-results.png"),
      fullPage: true,
    });
    expectHealthy(health);
  } finally {
    await context.close();
  }
});

test("reduced motion, missing asset, and renderer fallbacks stay usable", async ({
  browser,
}) => {
  const reduced = await browser.newPage({
    reducedMotion: "reduce",
    viewport: { width: 375, height: 850 },
  });
  const reducedHealth = monitorPage(reduced);
  await startRound(reduced, {
    scenario: "guided",
    mode: "mouse",
    query: "reducedMotion=1",
  });
  await expect(reduced.locator("#game-panel")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  const reducedBudget = await visibleRoundState(reduced);
  await chooseCrew(reduced, "driller", "mouse");
  await chooseTarget(reduced, "候選地 A", "mouse");
  await expect(reduced.locator('[data-crew-id="driller"]')).toHaveAttribute(
    "data-visual-state",
    "error",
  );
  await expectRejectedWithoutRoundChange(reduced, reducedBudget, "不同專長");
  await expect(reduced.locator('[data-crew-id="driller"]')).toHaveAttribute(
    "data-visual-state",
    "idle",
  );
  await chooseCrew(reduced, "hydro", "mouse");
  await chooseTarget(reduced, "候選地 A", "mouse");
  const reducedHydro = reduced.locator('[data-crew-id="hydrogeologist"]');
  await expect(reducedHydro).toHaveAttribute("data-visual-state", "task");
  await expect(reducedHydro).not.toHaveAttribute("data-visual-state", "walking");
  await expect(reducedHydro).toHaveAttribute("data-visual-state", "complete");
  await expect(reducedHydro).toHaveAttribute("data-visual-state", "idle");
  expectHealthy(reducedHealth);
  await reduced.close();

  const missing = await browser.newPage();
  await missing.route("**/assets/pumping/missing.png", (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: "not-a-valid-png",
    }));
  const missingHealth = monitorPage(missing);
  await startRound(missing, {
    scenario: "guided",
    mode: "mouse",
    query: "missingAsset=1",
  });
  await expect(missing.locator("#status-region")).toContainText("DOM 控制仍可操作");
  await expect(missing.locator('[data-crew-id="hydrogeologist"]')).toBeEnabled();
  expectHealthy(missingHealth);
  await missing.close();

  const context = await browser.newContext();
  await context.route("**/js/lib/pixi.min.js", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.PIXI = null;",
    }));
  const fallback = await context.newPage();
  const fallbackHealth = monitorPage(fallback);
  try {
    await startRound(fallback, { scenario: "guided", mode: "mouse" });
    await expect(fallback.locator("#canvas-fallback")).toBeVisible();
    await expect(fallback.locator('[data-crew-id="hydrogeologist"]')).toBeEnabled();
    expectHealthy(fallbackHealth);
  } finally {
    await context.close();
  }
});

test("semantic game tokens meet focus, contrast, touch, and non-overlap requirements", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const health = monitorPage(page);
  try {
    await page.goto(`${ORIGIN}${STANDALONE_ROUTE}`, { waitUntil: "networkidle" });
    const normalMobile = await page.evaluate(() => {
      const skip = document.querySelector(".skip-link");
      const styles = getComputedStyle(skip);
      return {
        clipPath: styles.clipPath,
        focused: document.activeElement === skip,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    expect(normalMobile.clipPath).not.toBe("none");
    expect(normalMobile.focused).toBe(false);
    expect(normalMobile.scrollWidth).toBeLessThanOrEqual(normalMobile.clientWidth);
    await page.screenshot({
      path: `${FINAL_A11Y_EVIDENCE}/normal-mobile-375.png`,
      fullPage: true,
    });

    await page.locator(".skip-link").focus();
    const focus = await page.evaluate(() => {
      const skip = document.querySelector(".skip-link");
      const shell = document.querySelector(".page-shell");
      const skipRect = skip.getBoundingClientRect();
      const shellRect = shell.getBoundingClientRect();
      const styles = getComputedStyle(skip);
      return {
        clipPath: styles.clipPath,
        outlineColor: styles.outlineColor,
        outlineStyle: styles.outlineStyle,
        outlineWidth: Number.parseFloat(styles.outlineWidth),
        skipBottom: skipRect.bottom,
        shellTop: shellRect.top,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    expect(focus.clipPath).toBe("none");
    expect(focus.outlineStyle).toBe("solid");
    expect(focus.outlineWidth).toBeGreaterThanOrEqual(3);
    expect(focus.shellTop).toBeGreaterThanOrEqual(focus.skipBottom);
    expect(focus.scrollWidth).toBeLessThanOrEqual(focus.clientWidth);
    await page.screenshot({
      path: `${FINAL_A11Y_EVIDENCE}/focus-skip-link-mobile-375.png`,
      fullPage: true,
    });

    await page.goto(`${ORIGIN}${STANDALONE_ROUTE}`, { waitUntil: "networkidle" });
    await page.setViewportSize({ width: 188, height: 812 });
    const zoom = await page.evaluate(() => {
      const root = document.documentElement;
      return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth };
    });
    expect(zoom.scrollWidth).toBeLessThanOrEqual(zoom.clientWidth);
    await page.screenshot({
      path: `${FINAL_A11Y_EVIDENCE}/normal-zoom-200.png`,
      fullPage: true,
    });
    await page.locator(".skip-link").focus();
    const zoomFocus = await page.evaluate(() => {
      const skipRect = document.querySelector(".skip-link").getBoundingClientRect();
      const shellRect = document.querySelector(".page-shell").getBoundingClientRect();
      return {
        skipBottom: skipRect.bottom,
        shellTop: shellRect.top,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    expect(zoomFocus.shellTop).toBeGreaterThanOrEqual(zoomFocus.skipBottom);
    expect(zoomFocus.scrollWidth).toBeLessThanOrEqual(zoomFocus.clientWidth);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${ORIGIN}${STANDALONE_ROUTE}`, { waitUntil: "networkidle" });
    const targets = await page.evaluate(() => [...document.querySelectorAll(
      "button, .skip-link, .mode-card span",
    )].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        name: element.textContent.trim().replace(/\s+/g, " ").slice(0, 80),
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10,
      };
    }).filter((target) => target.width > 0 && target.height > 0));
    const undersizedTargets = targets.filter((target) => target.width < 44 || target.height < 44);
    expect(undersizedTargets).toEqual([]);

    await startRound(page, { scenario: "guided", mode: "mouse" });
    await chooseCrew(page, "driller", "mouse");
    await chooseTarget(page, "候選地 A", "mouse");
    await expect(page.locator("#status-region")).toHaveAttribute("data-tone", "error");
    const contrast = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const toRgb = (value) => {
        const normalized = value.trim();
        if (normalized.startsWith("#")) {
          const hex = normalized.slice(1);
          return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
        }
        return normalized.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
      };
      const status = getComputedStyle(document.querySelector("#status-region"));
      return {
        bodyText: [toRgb(root.getPropertyValue("--ink-soft")), toRgb(root.getPropertyValue("--paper"))],
        errorText: [toRgb(status.color), toRgb(status.backgroundColor)],
        warningText: [
          toRgb(root.getPropertyValue("--status-warning-foreground")),
          toRgb(root.getPropertyValue("--status-warning-surface")),
        ],
        focusRing: [toRgb(root.getPropertyValue("--focus-ring")), toRgb(root.getPropertyValue("--paper-bright"))],
      };
    });
    const ratios = Object.fromEntries(Object.entries(contrast).map(([name, pair]) => [
      name,
      Math.round(contrastRatio(pair[0], pair[1]) * 100) / 100,
    ]));
    expect(ratios.bodyText).toBeGreaterThanOrEqual(4.5);
    expect(ratios.errorText).toBeGreaterThanOrEqual(4.5);
    expect(ratios.warningText).toBeGreaterThanOrEqual(4.5);
    expect(ratios.focusRing).toBeGreaterThanOrEqual(3);
    writeFileSync(`${FINAL_A11Y_EVIDENCE}/measurements.json`, `${JSON.stringify({
      normalMobile,
      focus,
      zoom,
      zoomFocus,
      ratios,
      targets,
      undersizedTargets,
      exceptions: [],
    }, null, 2)}\n`, "utf8");
    expectHealthy(health);
  } finally {
    await context.close();
  }
});
