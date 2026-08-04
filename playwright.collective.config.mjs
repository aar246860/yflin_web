import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.config.mjs";

export default defineConfig({
  ...baseConfig,
  testMatch: "collective-pages.test.mjs",
});
