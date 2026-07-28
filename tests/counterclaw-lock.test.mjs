import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import test from "node:test";

const REPO = join(import.meta.dirname, "..");
const SCRIPT = join(REPO, "scripts", "creative-room-lock.mjs");

function run(root, ...args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: REPO,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "test",
      YFLIN_CREATIVE_LOCK_ROOT: root,
    },
  });
}

function runAsync(root, ...args) {
  return runAsyncWithEnv(root, {}, ...args);
}

function runAsyncWithEnv(root, extraEnv, ...args) {
  return new Promise((resolveResult) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], {
      cwd: REPO,
      env: {
        ...process.env,
        NODE_ENV: "test",
        YFLIN_CREATIVE_LOCK_ROOT: root,
        ...extraEnv,
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolveResult({ status, stdout, stderr }));
  });
}

test("given two workflows, when both acquire the room, then only the atomic winner proceeds", async () => {
  const root = mkdtempSync(join(tmpdir(), "creative-room-lock-"));
  try {
    const attempts = await Promise.all([
      runAsync(root, "acquire", "--workflow", "counterclaw", "--repo", REPO),
      runAsync(root, "acquire", "--workflow", "xiaolin", "--repo", REPO),
    ]);
    const first = attempts.find((attempt) => attempt.status === 0);
    const second = attempts.find((attempt) => attempt.status === 2);
    assert.ok(first, JSON.stringify(attempts));
    assert.ok(second, JSON.stringify(attempts));
    const owner = JSON.parse(first.stdout);
    assert.ok(["counterclaw", "xiaolin"].includes(owner.workflow));
    assert.equal(owner.status, "active");
    assert.ok(owner.runId);
    assert.equal(JSON.parse(second.stdout).owner.runId, owner.runId);

    const heartbeat = run(
      root,
      "heartbeat",
      "--run-id",
      owner.runId,
      "--phase",
      "create",
    );
    assert.equal(heartbeat.status, 0, heartbeat.stderr);
    assert.equal(JSON.parse(heartbeat.stdout).phase, "create");

    const failed = run(
      root,
      "fail",
      "--run-id",
      owner.runId,
      "--reason",
      "deployment unavailable",
    );
    assert.equal(failed.status, 0, failed.stderr);
    assert.equal(JSON.parse(failed.stdout).status, "failed");

    const wrongRelease = run(root, "release", "--run-id", "wrong-owner");
    assert.notEqual(wrongRelease.status, 0);

    const released = run(root, "release", "--run-id", owner.runId);
    assert.equal(released.status, 0, released.stderr);

    const nextWorkflow = owner.workflow === "counterclaw" ? "xiaolin" : "counterclaw";
    const next = run(root, "acquire", "--workflow", nextWorkflow, "--repo", REPO);
    assert.equal(next.status, 0, next.stderr);
    assert.equal(JSON.parse(next.stdout).workflow, nextWorkflow);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given an existing lock, when status is requested, then recovery metadata is returned", () => {
  const root = mkdtempSync(join(tmpdir(), "creative-room-status-"));
  try {
    const acquired = run(root, "acquire", "--workflow", "counterclaw", "--repo", REPO);
    assert.equal(acquired.status, 0, acquired.stderr);
    const owner = JSON.parse(acquired.stdout);

    const status = run(root, "status");
    assert.equal(status.status, 0, status.stderr);
    assert.equal(JSON.parse(status.stdout).owner.runId, owner.runId);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given an ownerless lock, when recovery is attempted, then explicit safety confirmation is required", () => {
  const root = mkdtempSync(join(tmpdir(), "creative-room-orphan-"));
  try {
    mkdirSync(join(root, "creative-room.lock"));

    const refused = run(
      root,
      "release-orphan",
      "--confirmation",
      "skip-the-checks",
    );
    assert.notEqual(refused.status, 0);
    assert.equal(JSON.parse(run(root, "status").stdout).status, "locked");

    const released = run(
      root,
      "release-orphan",
      "--confirmation",
      "no-live-run-and-repo-safe",
    );
    assert.equal(released.status, 0, released.stderr);
    assert.equal(JSON.parse(run(root, "status").stdout).status, "unlocked");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given an acquisition is initializing, when orphan recovery races it, then recovery cannot remove the live lock", async () => {
  const root = mkdtempSync(join(tmpdir(), "creative-room-init-race-"));
  try {
    const acquiring = runAsyncWithEnv(
      root,
      { YFLIN_CREATIVE_LOCK_PAUSE_MS: "250" },
      "acquire",
      "--workflow",
      "counterclaw",
      "--repo",
      REPO,
    );
    const lockDir = join(root, "creative-room.lock");
    const deadline = Date.now() + 2000;
    while (!existsSync(lockDir) && Date.now() < deadline) {
      await new Promise((resolveResult) => setTimeout(resolveResult, 5));
    }
    assert.equal(existsSync(lockDir), true);

    const recovery = run(
      root,
      "release-orphan",
      "--confirmation",
      "no-live-run-and-repo-safe",
    );
    assert.notEqual(recovery.status, 0, recovery.stdout);
    const acquired = await acquiring;
    assert.equal(acquired.status, 0, acquired.stderr);
    const owner = JSON.parse(acquired.stdout);
    assert.equal(owner.status, "active");

    const released = run(root, "release", "--run-id", owner.runId);
    assert.equal(released.status, 0, released.stderr);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
