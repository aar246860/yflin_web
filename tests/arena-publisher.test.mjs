import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  runArenaPublisher,
  validateArenaState,
} from "../scripts/arena-publisher.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const state = JSON.parse(
  readFileSync(resolve(root, "src", "data", "arenaState.json"), "utf8"),
);
const copyState = () => structuredClone(state);

test("the checked-in arena state has five complete new challengers", () => {
  const result = runArenaPublisher(root);
  assert.equal(result.status, "passed");
  assert.equal(result.checked, state.roster.length);

  const currentEntrants = state.roster.filter(
    (character) =>
      character.role === "challenger" &&
      character.enteredOn === state.currentDay &&
      character.status === "active",
  );
  assert.equal(currentEntrants.length, state.dailyMinimum);
  assert.deepEqual(
    currentEntrants.map((character) => character.portrait.atlasPanel),
    Array.from({ length: state.dailyMinimum }, (_, index) => index),
  );
});

test("the shared free-action clock is persistent and matches its latest event", () => {
  const result = runArenaPublisher(root);
  assert.equal(result.status, "passed");
  const freeActionEvents = state.events.filter(
    (event) => event.type === "free-action",
  );
  const latest = freeActionEvents.at(-1);

  assert.equal(state.freeActionClock.turn, freeActionEvents.length);
  assert.equal(state.freeActionClock.lastActionId, latest.id);
  assert.equal(state.freeActionClock.lastActionOn, latest.date);
  assert.deepEqual(state.freeActionClock.lastActorIds, latest.characterIds);
  assert.equal(
    state.freeActionClock.completedSlots.length,
    freeActionEvents.length,
  );
  assert.equal(latest.type, "free-action");
  assert.match(latest.id, /^free-action-\d{3}$/);
  assert.equal(latest.sequence, freeActionEvents.length);
});

test("a duplicated free-action slot is rejected", () => {
  const invalid = copyState();
  invalid.freeActionClock.completedSlots.push(
    invalid.freeActionClock.completedSlots[0],
  );
  const errors = validateArenaState(invalid, { root });
  assert.ok(
    errors.some((error) => error.includes("unique Taipei slots")),
  );
});

test("duplicate character ids are rejected", () => {
  const invalid = copyState();
  invalid.roster[1].id = invalid.roster[0].id;
  const errors = validateArenaState(invalid, { root });
  assert.ok(errors.includes("roster ids must be unique"));
});

test("an incomplete daily batch cannot inflate the public count", () => {
  const invalid = copyState();
  const removedEntrant = invalid.roster.find(
    (character) =>
      character.role === "challenger" &&
      character.enteredOn === invalid.currentDay &&
      character.status === "active",
  );
  assert.ok(removedEntrant, "the fixture must contain a current-day entrant");

  invalid.roster = invalid.roster.filter(
    (character) => character.id !== removedEntrant.id,
  );
  const currentBatch = invalid.batches.find(
    (batch) => batch.date === invalid.currentDay,
  );
  assert.ok(currentBatch, "the fixture must contain a current-day batch");
  currentBatch.entrantIds = currentBatch.entrantIds.filter(
    (id) => id !== removedEntrant.id,
  );
  for (const challenge of invalid.challenges) {
    challenge.challengedIds = challenge.challengedIds.filter(
      (id) => id !== removedEntrant.id,
    );
    challenge.responses = challenge.responses.filter(
      (response) => response.characterId !== removedEntrant.id,
    );
  }
  for (const event of invalid.events) {
    event.characterIds = event.characterIds.filter(
      (id) => id !== removedEntrant.id,
    );
  }
  const errors = validateArenaState(invalid, { root });
  assert.ok(
    errors.some((error) =>
      error.includes("current day must contain at least 5 complete active challengers"),
    ),
  );
});

test("an unknown challenge participant is rejected", () => {
  const invalid = copyState();
  invalid.challenges[0].challengedIds.push("ghost-entry");
  const errors = validateArenaState(invalid, { root });
  assert.ok(
    errors.some((error) =>
      error.includes("challengedIds contains unknown character ghost-entry"),
    ),
  );
});

test("character inference must remain source-bound", () => {
  const invalid = copyState();
  invalid.roster[2].inference.status = "fact";
  invalid.roster[2].inference.basisHref = "javascript:alert(1)";
  const errors = validateArenaState(invalid, { root });
  assert.ok(
    errors.some((error) =>
      error.includes("inference.status must be in-story-inference"),
    ),
  );
  assert.ok(
    errors.some((error) =>
      error.includes("inference.basisHref must be a safe internal or HTTPS link"),
    ),
  );
});

test("a character cannot enter without a public evidence fragment", () => {
  const invalid = copyState();
  invalid.roster[4].evidence.fact = "";
  const errors = validateArenaState(invalid, { root });
  assert.ok(
    errors.some((error) =>
      error.includes("evidence.fact is missing or too short"),
    ),
  );
});
