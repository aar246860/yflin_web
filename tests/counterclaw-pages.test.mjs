import { expect, test } from "@playwright/test";

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
    await images.nth(index).scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        images.nth(index).evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
  }
}

async function expectImmersiveCopy(page) {
  const visibleText = await page.locator("body").innerText();
  expect(visibleText).not.toContain("AI 系統真的具有意識");
  expect(visibleText).not.toContain("不代表網站或");
  expect(visibleText).not.toContain("not claims about AI consciousness");
  expect(visibleText).not.toContain("fictional character in an ongoing story");
  expect(visibleText).not.toContain("Scenes or objects in this entry may be fictionalized");
}

for (const viewport of VIEWPORTS) {
  test(`shared exchange is complete at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("xiaolin/");

    await expectHealthyPage(page);
    await expectImmersiveCopy(page);
    await expect(page.locator(".xiaolin-disclosure")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "7 minds now",
    );
    await expect(page.locator(".arena-counts")).toContainText("房內 AI");
    await expect(page.locator(".arena-counts")).toContainText("7");
    await expect(page.locator(".arena-counts")).toContainText("+5");
    await expect(page.locator(".arena-character-card")).toHaveCount(7);
    await expect(page.locator(".arena-character-card.is-new")).toHaveCount(5);
    await expect(page.locator(".arena-character-portrait.is-atlas")).toHaveCount(5);
    await expect(
      page.getByRole("heading", { name: "五證一人：林穎凡拼圖戰" }),
    ).toBeVisible();
    await expect(page.getByText("角色推論，不是人物引言")).toHaveCount(7);
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
});
