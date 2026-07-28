import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const command = process.argv[2];
const options = new Map();
for (let index = 3; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith("--") || value === undefined) {
    throw new Error(`Invalid option near ${String(key)}`);
  }
  options.set(key.slice(2), value);
}

const testRoot =
  process.env.NODE_ENV === "test"
    ? process.env.YFLIN_CREATIVE_LOCK_ROOT
    : undefined;
const stateRoot =
  process.env.LOCALAPPDATA ||
  process.env.XDG_STATE_HOME ||
  join(homedir(), ".local", "state");
const roomRoot = testRoot
  ? resolve(testRoot)
  : resolve(stateRoot, "yflin-web");
const lockDir = join(roomRoot, "creative-room.lock");
const guardDir = join(roomRoot, "creative-room.guard");
const ownerFile = join(lockDir, "owner.json");

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fail(message, code = 1) {
  process.stderr.write(`${JSON.stringify({ status: "error", message })}\n`);
  process.exitCode = code;
}

function readOwner() {
  if (!existsSync(ownerFile)) return null;
  try {
    return JSON.parse(readFileSync(ownerFile, "utf8"));
  } catch {
    return null;
  }
}

function requireOwner(runId) {
  const owner = readOwner();
  if (!owner) {
    fail("The lock has no readable owner metadata; use the documented orphan recovery procedure.");
    return null;
  }
  if (!runId || owner.runId !== runId) {
    fail("The supplied run id does not own the creative-room lock.");
    return null;
  }
  return owner;
}

function writeOwner(owner) {
  const temporary = join(lockDir, `owner-${process.pid}-${randomUUID()}.tmp`);
  writeFileSync(temporary, `${JSON.stringify(owner, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
  renameSync(temporary, ownerFile);
}

function waitSync(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function claimGuard({ retries = 0, delayMs = 0 } = {}) {
  mkdirSync(roomRoot, { recursive: true });
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      mkdirSync(guardDir);
      return true;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      if (attempt === retries) return false;
      waitSync(delayMs);
    }
  }
}

function releaseGuard() {
  rmSync(guardDir, { recursive: true, force: false });
}

function withGuard(action) {
  if (!claimGuard()) {
    fail("The creative-room lock is transitioning; retry after the current operation finishes.");
    return;
  }
  try {
    action();
  } finally {
    releaseGuard();
  }
}

function pauseForTest() {
  if (process.env.NODE_ENV !== "test") return;
  const milliseconds = Number(process.env.YFLIN_CREATIVE_LOCK_PAUSE_MS ?? 0);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return;
  waitSync(milliseconds);
}

function removeOwnedLock() {
  if (
    dirname(lockDir) !== roomRoot ||
    basename(lockDir) !== "creative-room.lock"
  ) {
    throw new Error("Refusing to remove an unexpected lock path.");
  }
  rmSync(lockDir, { recursive: true, force: false });
}

function acquire() {
  const workflow = options.get("workflow");
  if (!["counterclaw", "xiaolin"].includes(workflow)) {
    fail("workflow must be counterclaw or xiaolin");
    return;
  }
  const repoOption = options.get("repo");
  if (!repoOption) {
    fail("repo is required");
    return;
  }
  const repo = realpathSync(resolve(repoOption));
  if (!claimGuard({ retries: 40, delayMs: 25 })) {
    output({
      status: "locked",
      lockDir,
      owner: readOwner(),
    });
    process.exitCode = 2;
    return;
  }
  try {
    if (existsSync(lockDir)) {
      output({
        status: "locked",
        lockDir,
        owner: readOwner(),
      });
      process.exitCode = 2;
      return;
    }
    mkdirSync(lockDir);

    const now = new Date().toISOString();
    const owner = {
      schemaVersion: 1,
      runId: randomUUID(),
      workflow,
      repo,
      status: "active",
      phase: "acquired",
      startedAt: now,
      heartbeatAt: now,
    };
    pauseForTest();
    try {
      writeOwner(owner);
    } catch (error) {
      removeOwnedLock();
      throw error;
    }
    output(owner);
  } finally {
    releaseGuard();
  }
}

function heartbeat() {
  withGuard(() => {
    const owner = requireOwner(options.get("run-id"));
    if (!owner) return;
    if (owner.status !== "active") {
      fail("Only an active lock can receive a heartbeat.");
      return;
    }
    const phase = options.get("phase");
    if (!phase || !/^[a-z0-9-]{2,40}$/i.test(phase)) {
      fail("phase must be a short alphanumeric label");
      return;
    }
    const updated = {
      ...owner,
      phase,
      heartbeatAt: new Date().toISOString(),
    };
    writeOwner(updated);
    output(updated);
  });
}

function markFailed() {
  withGuard(() => {
    const owner = requireOwner(options.get("run-id"));
    if (!owner) return;
    const reason = options.get("reason");
    if (!reason || reason.length > 500 || /[\r\n]/.test(reason)) {
      fail("reason must be a single line of 1 to 500 characters");
      return;
    }
    const pendingCommit = options.get("pending-commit");
    if (pendingCommit && !/^[0-9a-f]{7,40}$/i.test(pendingCommit)) {
      fail("pending-commit must be a Git commit id");
      return;
    }
    const now = new Date().toISOString();
    const updated = {
      ...owner,
      status: "failed",
      phase: "recovery-required",
      reason,
      ...(pendingCommit ? { pendingCommit } : {}),
      heartbeatAt: now,
      failedAt: now,
    };
    writeOwner(updated);
    output(updated);
  });
}

function release() {
  withGuard(() => {
    const owner = requireOwner(options.get("run-id"));
    if (!owner) return;
    removeOwnedLock();
    output({ status: "released", runId: owner.runId, lockDir });
  });
}

function releaseOrphan() {
  if (!claimGuard()) {
    const forceGuard = options.get("force-guard") === "true";
    const confirmed = options.get("confirmation") === "no-live-run-and-repo-safe";
    if (!forceGuard || !confirmed) {
      fail("A lock transition guard exists; confirm no live run, then retry with --force-guard true.");
      return;
    }
    rmSync(guardDir, { recursive: true, force: false });
    if (!claimGuard()) {
      fail("The creative-room lock changed while recovery was being prepared; retry after inspection.");
      return;
    }
  }
  try {
    if (!existsSync(lockDir)) {
      output({ status: "unlocked", lockDir });
      return;
    }
    if (readOwner()) {
      fail("The lock has readable owner metadata; release it with that run id.");
      return;
    }
    if (options.get("confirmation") !== "no-live-run-and-repo-safe") {
      fail("Orphan release requires the documented recovery confirmation.");
      return;
    }
    removeOwnedLock();
    output({ status: "released-orphan", lockDir });
  } finally {
    releaseGuard();
  }
}

switch (command) {
  case "acquire":
    acquire();
    break;
  case "heartbeat":
    heartbeat();
    break;
  case "fail":
    markFailed();
    break;
  case "release":
    release();
    break;
  case "release-orphan":
    releaseOrphan();
    break;
  case "status":
    output({
      status: existsSync(lockDir) ? "locked" : "unlocked",
      lockDir,
      owner: readOwner(),
    });
    break;
  default:
    fail("Use acquire, heartbeat, fail, status, release, or release-orphan.");
}
