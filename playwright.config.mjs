import { existsSync, mkdirSync, renameSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium as playwrightChromium, defineConfig } from "@playwright/test";
import { inflate } from "@sparticuz/chromium";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const runtimeRoot = join(tmpdir(), "yflin-web-playwright");
process.env.XDG_CACHE_HOME ??= join(runtimeRoot, "cache");
process.env.XDG_CONFIG_HOME ??= join(runtimeRoot, "config");
process.env.ASTRO_TELEMETRY_DISABLED ??= "1";
mkdirSync(process.env.XDG_CACHE_HOME, { recursive: true });
mkdirSync(process.env.XDG_CONFIG_HOME, { recursive: true });

async function resolveChromiumExecutablePath() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  if (existsSync(playwrightChromium.executablePath())) {
    return undefined;
  }

  const temporaryBinary = join(tmpdir(), "chromium");
  if (existsSync(temporaryBinary) && statSync(temporaryBinary).size === 0) {
    renameSync(
      temporaryBinary,
      join(tmpdir(), `chromium-incomplete-${process.pid}`),
    );
  }

  const packageEntry = fileURLToPath(import.meta.resolve("@sparticuz/chromium"));
  const packageBin = resolve(dirname(packageEntry), "..", "bin");
  const [executablePath] = await Promise.all([
    inflate(join(packageBin, "chromium.br")),
    inflate(join(packageBin, "swiftshader.tar.br")),
  ]);
  return executablePath;
}

const chromiumExecutablePath = await resolveChromiumExecutablePath();

export default defineConfig({
  testDir: "./tests",
  testMatch: "counterclaw-pages.test.mjs",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4321/yflin_web/",
    launchOptions: chromiumExecutablePath
      ? {
          executablePath: chromiumExecutablePath,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-webgl",
          ],
        }
      : undefined,
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
