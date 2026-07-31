import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimeRoot = join(tmpdir(), "yflin-web-astro");
const env = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: process.env.ASTRO_TELEMETRY_DISABLED ?? "1",
  XDG_CACHE_HOME: process.env.XDG_CACHE_HOME ?? join(runtimeRoot, "cache"),
  XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME ?? join(runtimeRoot, "config"),
};

mkdirSync(env.XDG_CACHE_HOME, { recursive: true });
mkdirSync(env.XDG_CONFIG_HOME, { recursive: true });

const child = spawn(
  process.execPath,
  [resolve(root, "node_modules", "astro", "bin", "astro.mjs"), ...process.argv.slice(2)],
  { cwd: root, env, stdio: "inherit" },
);

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
