import { defineConfig } from "@playwright/test";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

export default defineConfig({
  testDir: "./tests",
  testMatch: "counterclaw-pages.test.mjs",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4321/yflin_web/",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `${npmCommand} run preview -- --host 127.0.0.1`,
    url: "http://127.0.0.1:4321/yflin_web/",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
