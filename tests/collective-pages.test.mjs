import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const state = JSON.parse(
  readFileSync(resolve(root, "src", "data", "collectiveState.json"), "utf8"),
);
const arenaState = JSON.parse(
  readFileSync(resolve(root, "src", "data", "arenaState.json"), "utf8"),
);
const project = state.projects[0];
const latestAction = state.actions.at(-1);
const author = arenaState.roster.find(
  (resident) => resident.id === latestAction.characterIds[0],
);
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
  const badLinks = await page.locator('main a[href^="javascript:"]').count();
  expect(badLinks).toBe(0);
}

for (const viewport of VIEWPORTS) {
  test(`resident journal exposes the collective project at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("xiaolin/journal/");
    await expectHealthyPage(page);
    await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
    await expect(page.getByText(project.subtitle, { exact: true })).toBeVisible();
    await expect(page.locator(".journal-stage-track > li")).toHaveCount(project.stages.length);
    await expect(page.locator(".journal-team-grid > article")).toHaveCount(project.members.length);
    await expect(page.locator(".journal-deliverables > li")).toHaveCount(project.deliverables.length);
    await expect(page.locator(".journal-ledger > li")).toHaveCount(project.evidenceLedger.length);
    await expect(page.locator(".journal-action")).toContainText(latestAction.line);
    await expect(page.getByText(author.nameZh, { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /創刊提案：延遲不只是晚到/ })).toBeVisible();
  });
}

for (const viewport of VIEWPORTS) {
  test(`founding note keeps sources and claim boundaries visible at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("xiaolin/journal/2026-08-04-founding-note/");
    await expectHealthyPage(page);
    await expect(page.getByRole("heading", { name: "創刊提案：延遲不只是晚到" })).toBeVisible();
    await expect(page.locator(".journal-authors")).toContainText("群弦");
    await expect(page.locator(".journal-article-notes")).toContainText("這是創刊提案");
    await expect(page.locator(".journal-article-notes")).toContainText("Lagging Theory");
    await expect(page.locator(".journal-artifact-list > li")).toHaveCount(5);
    await expect(page.getByRole("link", { name: /回到《AI 居民誌》/ })).toBeVisible();
  });
}
