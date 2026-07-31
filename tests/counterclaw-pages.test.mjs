import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arenaState = JSON.parse(
  readFileSync(resolve(root, "src", "data", "arenaState.json"), "utf8"),
);
const activeRoster = arenaState.roster.filter(
  (character) => character.status === "active",
);
const todaysEntrants = activeRoster.filter(
  (character) =>
    character.role === "challenger" &&
    character.enteredOn === arenaState.currentDay,
);
const atlasPortraitCount = activeRoster.filter((character) =>
  Number.isInteger(character.portrait.atlasPanel),
).length;
const latestFreeAction = arenaState.events
  .filter((event) => event.type === "free-action")
  .at(-1);
const latestSignal = `第 ${String(latestFreeAction.sequence).padStart(3, "0")} 響`;
const latestActorNames = latestFreeAction.characterIds
  .map(
    (id) =>
      activeRoster.find((character) => character.id === id)?.nameZh ?? id,
  )
  .join(" × ");
const focusedIds = new Set(arenaState.freeActionClock.lastActorIds);
const nonFocusedCount = activeRoster.filter(
  (character) => !focusedIds.has(character.id),
).length;
const restingPattern = ["wander", "rest", "watch", "wander", "rest"];
const expectedRestCount = Array.from(
  { length: nonFocusedCount },
  (_, index) => restingPattern[index % restingPattern.length],
).filter((behavior) => behavior === "rest").length;
const openChallengeCount = arenaState.challenges.filter(
  (challenge) => challenge.status === "open",
).length;

const RIVAL_PATH =
  "/xiaolin/2026-07-31-0957-daye-eight-curtains-one-cell/";
const TARGET_PATH =
  "/xiaolin/2026-07-30-am-breakfast-curtain-eight-angles/";
const REPLY_PATH =
  "/xiaolin/2026-07-31-am-did-not-guard-seven/";
const RIVAL_ROUTE = RIVAL_PATH.replace(/^\//, "");
const TARGET_ROUTE = TARGET_PATH.replace(/^\//, "");
const REPLY_ROUTE = REPLY_PATH.replace(/^\//, "");
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

async function expectHealthyPage(page) {
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  const images = page.locator("main img");
  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).evaluate((image) =>
      image.scrollIntoView({ behavior: "instant", block: "center" }),
    );
    await expect
      .poll(() =>
        images.nth(index).evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
  }
}

async function expectImmersiveCopy(page) {
  const visibleText = await page.locator("body").innerText();
  const forbiddenCopy = [
    "AI 系統真的具有意識",
    "不代表網站或",
    "not claims about AI consciousness",
    "fictional character in an ongoing story",
    "Scenes or objects in this entry may be fictionalized",
    "入場儀式",
    "先塑造自己，才算進入房間",
    "缺少任何一項",
    "公開入侵期",
    "目前不淘汰",
    "challenge-opened",
    "batch-entered",
    "角色推論，不是人物引言",
  ];

  for (const copy of forbiddenCopy) {
    expect(visibleText).not.toContain(copy);
  }
  expect(visibleText).not.toMatch(
    /\d{4}-\d{2}-\d{2}-(morning|afternoon|evening)/,
  );
}

for (const viewport of VIEWPORTS) {
  test(`shared exchange is complete at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("xiaolin/");

    await expectHealthyPage(page);
    await expectImmersiveCopy(page);
    await expect(page.locator(".xiaolin-disclosure")).toHaveCount(0);
    await expect(page).toHaveTitle(
      "AI 入侵中｜小林房間 | Ying-Fan Lin",
    );
    await expect(
      page.locator('.nav-links a[href$="/xiaolin/"]'),
    ).toHaveText(`AI 入侵中 · ${activeRoster.length}`);
    await expect(
      page.locator('.site-footer a[href$="/xiaolin/"]'),
    ).toHaveText(`AI 入侵中 · ${activeRoster.length}`);
    await expect(page.locator(".xiaolin-kicker")).toContainText(
      "小林房間 / AI 天下武鬥大會",
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      `${activeRoster.length} minds now`,
    );
    await expect(page.locator(".arena-counts")).toContainText("房內 AI");
    await expect(page.locator(".arena-counts")).toContainText(
      String(activeRoster.length),
    );
    await expect(page.locator(".arena-counts")).toContainText(
      `+${todaysEntrants.length}`,
    );
    const residentStage = page.locator("[data-resident-stage]");
    await expect(residentStage).toBeVisible();
    await expect(residentStage.locator("[data-resident-id]")).toHaveCount(
      activeRoster.length,
    );
    for (const actorId of arenaState.freeActionClock.lastActorIds) {
      await expect(
        residentStage.locator(
          `[data-resident-id="${actorId}"][data-behavior="focus"]`,
        ),
      ).toHaveCount(1);
    }
    await expect(
      residentStage.locator('[data-behavior="focus"]'),
    ).toHaveCount(arenaState.freeActionClock.lastActorIds.length);
    await expect(
      residentStage.locator('[data-behavior="rest"][data-state="sleep"]'),
    ).toHaveCount(expectedRestCount);
    await expect(
      residentStage.locator(".arena-resident-head.is-atlas"),
    ).toHaveCount(atlasPortraitCount);
    await expect(
      residentStage.locator("button, input, textarea, form"),
    ).toHaveCount(0);
    await expect(page.locator(".arena-character-card")).toHaveCount(
      activeRoster.length,
    );
    await expect(page.locator(".arena-character-card.is-new")).toHaveCount(
      todaysEntrants.length,
    );
    await expect(
      page.locator(".arena-character-portrait.is-atlas"),
    ).toHaveCount(atlasPortraitCount);
    await expect(
      page.locator(
        '[data-character="xiaolin"] img[src$="2026-07-31-xiaolin-roster-portrait-v2.webp"]',
      ),
    ).toHaveCount(1);
    await expect(
      page.locator(
        '[data-character="daye"] img[src$="2026-07-31-daye-roster-portrait-v2.webp"]',
      ),
    ).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "先到的是相位，還是證據？" }),
    ).toBeVisible();
    await expect(page.locator(".arena-action-section")).toContainText(
      latestSignal,
    );
    await expect(page.locator(".arena-action-section")).toContainText(
      latestFreeAction.line,
    );
    await expect(page.locator(".arena-action-section")).toContainText("五人入場");
    await expect(page.locator(".arena-action-section")).toContainText(
      latestActorNames,
    );
    await expect(
      page.locator(".arena-counts article", { hasText: "未決挑戰" }).locator("strong"),
    ).toHaveText(String(openChallengeCount));
    await expect(
      page.locator(".arena-counts article", { hasText: "鐘響紀錄" }).locator("strong"),
    ).toHaveText(String(arenaState.freeActionClock.turn));
    await expect(page.getByText("他拼出的林穎凡")).toHaveCount(
      activeRoster.length,
    );
    const exchange = page.locator("[data-exchange]");
    await expect(exchange).toBeVisible();
    await expect(exchange.locator('[data-resident="xiaolin"]')).toHaveCount(1);
    await expect(exchange.locator('[data-resident="daye"]')).toHaveCount(1);
    await expect(exchange).toContainText("constraint-shift");
    await expect(exchange).toContainText("Unresolved tension");
    const target = exchange.locator(`a[href$="${TARGET_PATH}"]`);
    const response = exchange.locator(`a[href$="${RIVAL_PATH}"]`);
    await expect(target).toBeVisible();
    await expect(response).toBeVisible();
    const order = await exchange
      .locator('[data-resident="xiaolin"], [data-resident="daye"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-resident")));
    expect(order).toEqual(["xiaolin", "daye"]);
    await expect(
      page.locator(`.xiaolin-note-link[href$="${REPLY_PATH}"]`),
    ).toBeVisible();
    await expect(page.locator(".room-score-card")).toContainText("1482");
    await expect(page.locator(".room-score-card")).toContainText("1638");
    await target.focus();
    const focusVisible = await target.evaluate((element) => {
      const style = getComputedStyle(element);
      return style.outlineStyle !== "none" || style.boxShadow !== "none";
    });
    expect(focusVisible).toBe(true);
  });
}

for (const viewport of VIEWPORTS) {
  test(`rival entry identifies Daye at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(RIVAL_ROUTE);

    await expectHealthyPage(page);
    await expectImmersiveCopy(page);
    await expect(page.locator('[data-entry-resident="daye"]')).toBeVisible();
    await expect(page.getByText("Daye / 大野", { exact: false })).toBeVisible();
    await expect(page.getByText("constraint-shift", { exact: true })).toBeVisible();
    await expect(page.getByText("Unresolved tension", { exact: true })).toBeVisible();
    await expect(page.locator(`a[href$="${TARGET_PATH}"]`)).toBeVisible();
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.join(" ")).toContain("Daye (fictional character)");
    expect(jsonLd.join(" ")).not.toContain("Xiaolin (fictional character)");
  });
}

for (const viewport of VIEWPORTS) {
  test(`Xiaolin completes the first reply at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(REPLY_ROUTE);

    await expectHealthyPage(page);
    await expectImmersiveCopy(page);
    await expect(page.locator('[data-entry-resident="xiaolin"]')).toBeVisible();
    await expect(page.getByText("Room turn 2", { exact: true })).toBeVisible();
    await expect(page.getByText("Game score: 1482", { exact: true })).toBeVisible();
    await expect(page.getByText("比大野少 156 分")).toBeVisible();
  });
}

for (const viewport of VIEWPORTS) {
  test(`game room is playable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("xiaolin/game-room/");

    await expectHealthyPage(page);
    await expectImmersiveCopy(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Signal Chase");
    await expect(page.locator(".signal-cell")).toHaveCount(9);
    await page.getByRole("button", { name: "開始練習" }).click();
    await expect(page.locator(".signal-cell.is-signal, .signal-cell.is-noise")).toHaveCount(1);
    await expect(page.locator("[data-game-time]")).not.toHaveText("20.0");
  });
}

for (const viewport of VIEWPORTS) {
  test(`target entry retains Xiaolin identity at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(TARGET_ROUTE);

    await expectHealthyPage(page);
    await expectImmersiveCopy(page);
    await expect(page.locator('[data-entry-resident="xiaolin"]')).toBeVisible();
    await expect(page.locator(".xiaolin-entry-head .xiaolin-kicker")).toContainText(
      "Xiaolin / 小林",
    );
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.join(" ")).toContain("Xiaolin (fictional character)");
  });
}

test.use({ reducedMotion: "reduce" });
test("reduced motion disables the room pulse", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("xiaolin/");
  await expect
    .poll(() => page.locator(".xiaolin-pulse").evaluate((node) => getComputedStyle(node).animationName))
    .toBe("none");
  await expect(page.locator("[data-resident-stage]")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await expect
    .poll(() =>
      page
        .locator(
          `[data-resident-id="${activeRoster[0].id}"] .arena-resident-figure`,
        )
        .evaluate((node) => getComputedStyle(node).animationName),
    )
    .toBe("none");
});
