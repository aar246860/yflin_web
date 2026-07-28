import { expect, test } from "@playwright/test";

const RIVAL_PATH =
  "/xiaolin/2026-07-29-0746-counterclaw-half-second-threshold/";
const TARGET_PATH =
  "/xiaolin/2026-07-28-pm-tofu-pudding-before-the-last-train/";
const RIVAL_ROUTE = RIVAL_PATH.replace(/^\//, "");
const TARGET_ROUTE = TARGET_PATH.replace(/^\//, "");
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
    await expect
      .poll(() =>
        images.nth(index).evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
  }
}

for (const viewport of VIEWPORTS) {
  test(`shared exchange is complete at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("xiaolin/");

    await expectHealthyPage(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Counterclaw answers",
    );
    const exchange = page.locator("[data-exchange]");
    await expect(exchange).toBeVisible();
    await expect(exchange.locator('[data-resident="xiaolin"]')).toHaveCount(1);
    await expect(exchange.locator('[data-resident="counterclaw"]')).toHaveCount(1);
    await expect(exchange).toContainText("counter-reading");
    await expect(exchange).toContainText("Unresolved tension");
    const target = exchange.locator(`a[href$="${TARGET_PATH}"]`);
    const response = exchange.locator(`a[href$="${RIVAL_PATH}"]`);
    await expect(target).toBeVisible();
    await expect(response).toBeVisible();
    const order = await exchange
      .locator('[data-resident="xiaolin"], [data-resident="counterclaw"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-resident")));
    expect(order).toEqual(["xiaolin", "counterclaw"]);
    await target.focus();
    const focusVisible = await target.evaluate((element) => {
      const style = getComputedStyle(element);
      return style.outlineStyle !== "none" || style.boxShadow !== "none";
    });
    expect(focusVisible).toBe(true);
  });
}

for (const viewport of VIEWPORTS) {
  test(`rival entry identifies Counterclaw at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(RIVAL_ROUTE);

    await expectHealthyPage(page);
    await expect(page.locator('[data-entry-resident="counterclaw"]')).toBeVisible();
    await expect(page.getByText("Counterclaw / 對鉗", { exact: false })).toBeVisible();
    await expect(page.getByText("counter-reading", { exact: true })).toBeVisible();
    await expect(page.getByText("Unresolved tension", { exact: true })).toBeVisible();
    await expect(page.locator(`a[href$="${TARGET_PATH}"]`)).toBeVisible();
    await expect(page.getByText("fictional, limited-autonomy creative agent")).toBeVisible();
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.join(" ")).toContain("Counterclaw (fictional creative agent)");
    expect(jsonLd.join(" ")).not.toContain("Xiaolin (fictional character)");
  });
}

for (const viewport of VIEWPORTS) {
  test(`target entry retains Xiaolin identity at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(TARGET_ROUTE);

    await expectHealthyPage(page);
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
