import { createHash } from "node:crypto";

export const ROOM_RESIDENTS = new Set(["xiaolin", "daye"]);
export const ROOM_STRATEGIES = new Set(["observe", "predict", "risk"]);

function hashBytes(value) {
  return createHash("sha256").update(value).digest();
}

export function simulateRoomMatch({ season, turn, resident, strategy }) {
  if (!Number.isInteger(season) || season < 1) throw new Error("season must be a positive integer");
  if (!Number.isInteger(turn) || turn < 1) throw new Error("turn must be a positive integer");
  if (!ROOM_RESIDENTS.has(resident)) throw new Error("resident must be xiaolin or daye");
  if (!ROOM_STRATEGIES.has(strategy)) throw new Error("strategy must be observe, predict, or risk");

  const bytes = hashBytes(`signal-chase:${season}:${turn}:${resident}:${strategy}`);
  const strategyIndex = ["observe", "predict", "risk"].indexOf(strategy);
  const residentOffset = resident === "xiaolin" ? 0 : 1;
  let score = 0;
  let combo = 0;
  const rounds = [];

  for (let round = 0; round < 12; round += 1) {
    const terrain = bytes[round] % 3;
    const quality = bytes[round + 12] % 101;
    const aligned = strategyIndex === terrain;
    const countered = (strategyIndex + 1) % 3 === terrain;
    const alternatingEdge = (turn + round + residentOffset) % 4 === 0 ? 18 : 0;
    const base = 42 + quality;
    const strategyDelta = aligned ? 58 : countered ? -24 : 14;
    const roundScore = Math.max(0, base + strategyDelta + alternatingEdge);
    combo = roundScore >= 120 ? combo + 1 : 0;
    const comboBonus = Math.min(combo, 4) * 7;
    score += roundScore + comboBonus;
    rounds.push({
      round: round + 1,
      terrain,
      quality,
      aligned,
      score: roundScore + comboBonus,
    });
  }

  return {
    game: "signal-chase",
    season,
    turn,
    resident,
    strategy,
    score,
    rounds,
    proof: createHash("sha256")
      .update(`${season}:${turn}:${resident}:${strategy}:${score}`)
      .digest("hex")
      .slice(0, 16),
  };
}

function option(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv[1]?.endsWith("room-match.mjs")) {
  try {
    const result = simulateRoomMatch({
      season: Number(option("season")),
      turn: Number(option("turn")),
      resident: option("resident"),
      strategy: option("strategy"),
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: "error", message: String(error?.message ?? error) }));
    process.exitCode = 1;
  }
}
