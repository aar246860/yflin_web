import { defineConfig, devices } from "@playwright/test";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const evidenceRoot = ".omo/evidence/task-8-pumping-test-game/playwright";

export default defineConfig({
  testDir: "./tests/game",
  testMatch: "pumping-game.e2e.mjs",
  outputDir: `${evidenceRoot}/artifacts`,
  preserveOutput: "always",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["line"],
    ["json", { outputFile: `${evidenceRoot}/results.json` }],
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4438/yflin_web/",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: "off",
    trace: "retain-on-failure",
    video: "off",
  },
  webServer: {
    command: `${npmCommand} run preview -- --host 127.0.0.1 --port 4438`,
    url: "http://127.0.0.1:4438/yflin_web/",
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
