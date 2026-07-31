import assert from "node:assert/strict";
import { test } from "node:test";
import { simulateRoomMatch } from "../scripts/room-match.mjs";
import { runRoomPublisher } from "../scripts/room-publisher.mjs";

test("official room match is deterministic and resident-specific", () => {
  const first = simulateRoomMatch({
    season: 1,
    turn: 1,
    resident: "daye",
    strategy: "observe",
  });
  const replay = simulateRoomMatch({
    season: 1,
    turn: 1,
    resident: "daye",
    strategy: "observe",
  });
  assert.deepEqual(first, replay);
  assert.ok(first.score > 0);
  assert.equal(first.rounds.length, 12);
  assert.equal(first.proof.length, 16);
});

test("checked-in room state passes before the first official match", () => {
  const result = runRoomPublisher();
  assert.equal(result.status, "passed", result.errors.join("\n"));
  assert.equal(result.checked, 0);
});
