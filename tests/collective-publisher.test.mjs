import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  runCollectivePublisher,
  validateCollectiveState,
} from "../scripts/collective-publisher.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const state = JSON.parse(
  readFileSync(resolve(root, "src", "data", "collectiveState.json"), "utf8"),
);
const arenaState = JSON.parse(
  readFileSync(resolve(root, "src", "data", "arenaState.json"), "utf8"),
);
const copyState = () => structuredClone(state);

test("the checked-in collective project and open journal are valid", () => {
  const result = runCollectivePublisher(root);
  assert.equal(result.status, "passed");
  assert.equal(result.actions, state.actions.length);
  assert.equal(result.projects, state.projects.length);
  assert.equal(result.publishedEntries, state.journal.publishedEntryIds.length);
});

test("one Taipei date cannot publish two collective actions", () => {
  const invalid = copyState();
  const duplicate = structuredClone(invalid.actions[0]);
  duplicate.id = "collective-action-002";
  duplicate.sequence = 2;
  invalid.actions.push(duplicate);
  invalid.creativeClock.turn = 2;
  invalid.creativeClock.lastActionId = duplicate.id;
  invalid.creativeClock.completedDates.push(duplicate.date);
  const errors = validateCollectiveState(invalid, { root, arenaState });
  assert.ok(errors.includes("collective actions must use unique Taipei dates"));
});

test("a collective role cannot be assigned to an unknown resident", () => {
  const invalid = copyState();
  invalid.projects[0].members[0].characterId = "ghost-editor";
  const errors = validateCollectiveState(invalid, { root, arenaState });
  assert.ok(
    errors.some((error) => error.includes("inactive or unknown character ghost-editor")),
  );
});

test("a later editorial stage cannot complete ahead of an earlier stage", () => {
  const invalid = copyState();
  invalid.projects[0].stages[3].status = "completed";
  const errors = validateCollectiveState(invalid, { root, arenaState });
  assert.ok(
    errors.some((error) => error.includes("cannot complete a later stage")),
  );
});

test("published multimedia requires a public artifact link", () => {
  const invalid = copyState();
  invalid.projects[0].deliverables.find((item) => item.type === "video").status = "published";
  const errors = validateCollectiveState(invalid, { root, arenaState });
  assert.ok(errors.some((error) => error.includes("video needs a safe href")));
});

test("source records remain public facts with safe links", () => {
  const invalid = copyState();
  invalid.projects[0].evidenceLedger[0].kind = "character-inference";
  invalid.projects[0].evidenceLedger[0].href = "javascript:alert(1)";
  const errors = validateCollectiveState(invalid, { root, arenaState });
  assert.ok(errors.some((error) => error.includes("href must be safe")));
  assert.ok(errors.some((error) => error.includes("kind must be public-fact")));
});
