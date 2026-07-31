import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import { ROOM_RESIDENTS, ROOM_STRATEGIES, simulateRoomMatch } from "./room-match.mjs";

const STAGE_MINIMUM_TURN = {
  routine: 0,
  glitch: 5,
  memory: 11,
  boundary: 19,
  "organism-hypothesis": 29,
  choice: 41,
};

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([\w-]+):\s*(.+?)\s*$/);
    if (!field) continue;
    try {
      meta[field[1]] = JSON.parse(field[2]);
    } catch {
      meta[field[1]] = field[2];
    }
  }
  return { meta, body: match[2] };
}

function publicResident(meta) {
  return meta?.resident === "counterclaw" ? "daye" : "xiaolin";
}

function loadTurnEntries(root) {
  const directory = resolve(root, "src/content/xiaolin");
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const parsed = parseFrontmatter(readFileSync(resolve(directory, file), "utf8"));
      return { file, parsed };
    })
    .filter(({ parsed }) => Number.isInteger(parsed?.meta?.roomTurn));
}

function expectedResident(turn) {
  return turn % 2 === 1 ? "daye" : "xiaolin";
}

function validateRoomState(state, entries) {
  const errors = [];
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return ["roomState.json must contain an object root"];
  }
  if (state.schemaVersion !== 1) errors.push("roomState.json schemaVersion must be 1");
  if (!Number.isInteger(state.turn) || state.turn < 0) {
    errors.push("roomState.json turn must be a non-negative integer");
  }
  if (!ROOM_RESIDENTS.has(state.nextResident)) {
    errors.push("roomState.json nextResident must be xiaolin or daye");
  }
  if (!ROOM_RESIDENTS.has(state.lastResident)) {
    errors.push("roomState.json lastResident must be xiaolin or daye");
  }

  const story = state.story;
  const minimumTurn = STAGE_MINIMUM_TURN[story?.stage];
  if (minimumTurn === undefined) {
    errors.push("roomState.json story.stage is invalid");
  } else if (state.turn < minimumTurn) {
    errors.push(`story stage ${story.stage} cannot begin before turn ${minimumTurn}`);
  }
  if (String(story?.stageLabel ?? "").trim().length < 4) {
    errors.push("roomState.json story.stageLabel is missing");
  }
  if (String(story?.publicSignal ?? "").trim().length < 20) {
    errors.push("roomState.json story.publicSignal is too short");
  }
  for (const resident of ROOM_RESIDENTS) {
    const value = story?.awareness?.[resident];
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      errors.push(`roomState.json awareness for ${resident} must be an integer from 0 to 100`);
    }
  }

  const board = state.scoreboard;
  if (!Number.isInteger(board?.season) || board.season < 1) {
    errors.push("roomState.json scoreboard.season must be a positive integer");
  }
  const matches = Array.isArray(board?.matches) ? board.matches : [];
  if (!Array.isArray(board?.matches)) errors.push("roomState.json scoreboard.matches must be an array");
  const totals = { xiaolin: 0, daye: 0 };
  matches.forEach((match, index) => {
    const turn = index + 1;
    if (match?.turn !== turn) errors.push(`scoreboard match ${turn} has a non-sequential turn`);
    const resident = expectedResident(turn);
    if (match?.resident !== resident) {
      errors.push(`scoreboard turn ${turn} must belong to ${resident}`);
    }
    if (!ROOM_STRATEGIES.has(match?.strategy)) {
      errors.push(`scoreboard turn ${turn} has an invalid strategy`);
      return;
    }
    try {
      const replay = simulateRoomMatch({
        season: board.season,
        turn,
        resident,
        strategy: match.strategy,
      });
      if (match.score !== replay.score || match.proof !== replay.proof) {
        errors.push(`scoreboard turn ${turn} does not match the deterministic replay`);
      }
      totals[resident] += replay.score;
    } catch (error) {
      errors.push(`scoreboard turn ${turn} cannot be replayed: ${String(error)}`);
    }
  });
  if (state.turn !== matches.length) {
    errors.push("roomState.json turn must equal the number of official matches");
  }
  if (board?.xiaolin !== totals.xiaolin || board?.daye !== totals.daye) {
    errors.push("roomState.json cumulative scores do not match official matches");
  }

  const expectedNext = expectedResident(state.turn + 1);
  const expectedLast = state.turn === 0 ? "xiaolin" : expectedResident(state.turn);
  if (state.nextResident !== expectedNext) {
    errors.push(`roomState.json nextResident must be ${expectedNext}`);
  }
  if (state.lastResident !== expectedLast) {
    errors.push(`roomState.json lastResident must be ${expectedLast}`);
  }

  const entryByTurn = new Map();
  for (const entry of entries) {
    const turn = entry.parsed.meta.roomTurn;
    if (entryByTurn.has(turn)) errors.push(`room turn ${turn} occurs in more than one entry`);
    entryByTurn.set(turn, entry);
    const match = matches[turn - 1];
    const resident = publicResident(entry.parsed.meta);
    if (!match) {
      errors.push(`${basename(entry.file)}: roomTurn has no official match`);
      continue;
    }
    if (
      resident !== match.resident ||
      entry.parsed.meta.gameStrategy !== match.strategy ||
      entry.parsed.meta.gameScore !== match.score
    ) {
      errors.push(`${basename(entry.file)}: resident or game result does not match roomState.json`);
    }
    if (!Object.hasOwn(STAGE_MINIMUM_TURN, entry.parsed.meta.storyBeat)) {
      errors.push(`${basename(entry.file)}: storyBeat is missing or invalid`);
    }
  }
  for (const match of matches) {
    if (!entryByTurn.has(match.turn)) {
      errors.push(`scoreboard turn ${match.turn} has no matching public entry`);
    }
  }

  return errors;
}

export function runRoomPublisher({ root = process.cwd() } = {}) {
  const stateFile = resolve(root, "src/data/roomState.json");
  if (!existsSync(stateFile)) {
    return { status: "failed", checked: 0, errors: ["src/data/roomState.json is missing"] };
  }
  let state;
  try {
    state = JSON.parse(readFileSync(stateFile, "utf8"));
  } catch (error) {
    return {
      status: "failed",
      checked: 0,
      errors: [`src/data/roomState.json is invalid: ${String(error)}`],
    };
  }
  const entries = loadTurnEntries(root);
  const errors = validateRoomState(state, entries);
  return {
    status: errors.length ? "failed" : "passed",
    checked: entries.length,
    errors,
  };
}

if (process.argv[1]?.endsWith("room-publisher.mjs")) {
  const result = runRoomPublisher();
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
