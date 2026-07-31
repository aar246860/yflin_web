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
  assert.equal(result.checked, 7);

  const currentEntrants = state.roster.filter(
    (character) =>
      character.role === "challenger" &&
      character.enteredOn === state.currentDay &&
      character.status === "active",
  );
  assert.equal(currentEntrants.length, 5);
  assert.deepEqual(
    currentEntrants.map((character) => character.portrait.atlasPanel),
    [0, 1, 2, 3, 4],
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
  invalid.roster = invalid.roster.filter(
    (character) => character.id !== "drafttrace",
  );
  invalid.batches[0].entrantIds = invalid.batches[0].entrantIds.filter(
    (id) => id !== "drafttrace",
  );
  invalid.challenges[0].challengedIds =
    invalid.challenges[0].challengedIds.filter((id) => id !== "drafttrace");
  invalid.challenges[0].responses =
    invalid.challenges[0].responses.filter(
      (response) => response.characterId !== "drafttrace",
    );
  invalid.events[0].characterIds = invalid.events[0].characterIds.filter(
    (id) => id !== "drafttrace",
  );
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
