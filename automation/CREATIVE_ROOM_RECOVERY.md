# Creative-room lock recovery

Xiaolin and Counterclaw use one atomically acquired lock shared by Codex
automations under the same local operating-system account. This installation
runs both workflows under the `CYCU` account. A failed or interrupted run
leaves that lock in place so another automation cannot overwrite unfinished
work. Recovery is deliberate; lock age alone is never proof that a run is
stale.

## 1. Confirm that no run is live

In the Codex app, confirm that neither the Xiaolin nor Counterclaw automation
is currently running. Also confirm that no terminal is still building,
committing, pushing, or polling a Pages deployment for this repository. Do not
continue while either workflow may still be active.

Read the lock record:

```powershell
node scripts/creative-room-lock.mjs status
```

The record identifies the workflow, run id, repository path, start time,
latest heartbeat, phase, and any failure or pending commit. Use the exact
repository path and run id from that output.

During acquisition or heartbeat, a short-lived sibling guard named
`creative-room.guard` prevents orphan recovery from racing the owner record.
If that guard is present, wait for the active operation to finish. If the
computer crashed while the guard was held, first repeat the no-live-run checks
above, then use the guarded recovery command below with `--force-guard true`.

## 2. Resolve the repository state

Open the recorded repository and inspect it without discarding anything:

```powershell
git branch --show-current
git remote get-url origin
git status --short
git fetch origin main
git rev-list --left-right --count origin/main...main
```

Require branch `main` and the expected `aar246860/yflin_web` origin.

- If the worktree is clean and `main` equals `origin/main`, there is no pending
  tracked publication to recover.
- If local `main` is ahead, verify that the pending commit contains only the
  files allowed by the owning workflow. Re-run that workflow's complete
  validators, build, and browser checks. Push only after confirming that
  `origin/main` has not advanced, then wait for and verify the exact Pages
  deployment before releasing the lock.
- If allowlisted work is uncommitted, finish and verify that same interrupted
  publication before committing it. Do not start a new creative cycle in the
  dirty worktree.
- If the worktree contains any unexpected path, the branches have diverged,
  or the origin is wrong, preserve everything and request a deliberate human
  decision. Never reset, clean, force-push, or remove the lock.

After a recovered publication is public, the next scheduled activation still
performs its own full creative cycle. Recovery never substitutes for the next
required substantive action.

## 3. Release only the resolved owner

Once there is no live task and the repository is safe and resolved, release
the lock with the exact recorded run id:

```powershell
node scripts/creative-room-lock.mjs release --run-id "<recorded-run-id>"
```

If the lock directory exists but its owner record is unreadable, first complete
steps 1 and 2. Only then use the guarded orphan command:

```powershell
node scripts/creative-room-lock.mjs release-orphan --confirmation no-live-run-and-repo-safe
```

For a confirmed stale transition guard, include the explicit force flag:

```powershell
node scripts/creative-room-lock.mjs release-orphan --confirmation no-live-run-and-repo-safe --force-guard true
```

Never delete the lock directory directly.
