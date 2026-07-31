import {
  existsSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROLES = new Set(["resident", "challenger"]);
const STATUSES = new Set(["active", "eliminated", "archived"]);
const CHALLENGE_STATUSES = new Set(["open", "resolved", "withdrawn"]);
const STANCES = new Set(["accept", "counter", "observe", "decline"]);
const EVENT_TYPES = new Set([
  "batch-entered",
  "challenge-opened",
  "challenge-resolved",
  "free-action",
  "mutation",
  "elimination",
  "return",
]);
const FREE_ACTION_KINDS = new Set([
  "challenge-opened",
  "challenge-answered",
  "challenge-advanced",
  "challenge-resolved",
  "mutation",
  "observation",
  "strategy-shift",
]);
const FREE_ACTION_SLOT_PATTERN =
  /^\d{4}-\d{2}-\d{2}-(?:morning|afternoon|evening)$/;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasText(value, minimum = 1) {
  return typeof value === "string" && value.trim().length >= minimum;
}

function isDate(value) {
  return (
    typeof value === "string" &&
    DATE_PATTERN.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
  );
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function isSafeLink(value) {
  if (typeof value !== "string") return false;
  if (value.startsWith("/")) {
    return (
      !value.startsWith("//") &&
      !value.includes("..") &&
      /^[A-Za-z0-9/_#?.=&%+-]+$/.test(value)
    );
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isSafePortrait(root, source) {
  if (
    typeof source !== "string" ||
    !/^\/images\/xiaolin\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(source) ||
    source.includes("..")
  ) {
    return false;
  }
  const publicPortraitRoot = resolve(root, "public", "images", "xiaolin");
  const portraitPath = resolve(root, "public", source.slice(1));
  if (!existsSync(publicPortraitRoot) || !existsSync(portraitPath)) return false;
  const rootReal = realpathSync(publicPortraitRoot);
  const portraitReal = realpathSync(portraitPath);
  return portraitReal.startsWith(`${rootReal}${sep}`);
}

function validateCharacter(character, index, root, errors) {
  const label = `roster[${index}]`;
  if (!isObject(character)) {
    errors.push(`${label} must be an object`);
    return;
  }
  if (!hasText(character.id) || !ID_PATTERN.test(character.id)) {
    errors.push(`${label}.id must be a lowercase kebab-case id`);
  }
  for (const [field, minimum] of [
    ["nameZh", 1],
    ["nameEn", 2],
    ["epithet", 4],
    ["intro", 24],
    ["personality", 8],
    ["origin", 8],
    ["ability", 12],
    ["signatureMove", 2],
  ]) {
    if (!hasText(character[field], minimum)) {
      errors.push(`${label}.${field} is missing or too short`);
    }
  }
  if (!ROLES.has(character.role)) {
    errors.push(`${label}.role must be resident or challenger`);
  }
  if (!STATUSES.has(character.status)) {
    errors.push(`${label}.status is invalid`);
  }
  if (!isDate(character.enteredOn)) {
    errors.push(`${label}.enteredOn must be a calendar date`);
  }
  if (!Number.isInteger(character.entryOrder) || character.entryOrder < 1) {
    errors.push(`${label}.entryOrder must be a positive integer`);
  }

  if (!isObject(character.portrait)) {
    errors.push(`${label}.portrait must be an object`);
  } else {
    if (!isSafePortrait(root, character.portrait.src)) {
      errors.push(`${label}.portrait.src must resolve under public/images/xiaolin`);
    }
    if (!hasText(character.portrait.alt, 12)) {
      errors.push(`${label}.portrait.alt is missing or too short`);
    }
    if (
      "atlasPanel" in character.portrait &&
      (!Number.isInteger(character.portrait.atlasPanel) ||
        character.portrait.atlasPanel < 0 ||
        character.portrait.atlasPanel > 4)
    ) {
      errors.push(`${label}.portrait.atlasPanel must be an integer from 0 to 4`);
    }
  }

  if (!isObject(character.evidence)) {
    errors.push(`${label}.evidence must be an object`);
  } else {
    if (!hasText(character.evidence.label, 4)) {
      errors.push(`${label}.evidence.label is missing`);
    }
    if (!isSafeLink(character.evidence.href)) {
      errors.push(`${label}.evidence.href must be a safe internal or HTTPS link`);
    }
    if (!hasText(character.evidence.kind, 4)) {
      errors.push(`${label}.evidence.kind is missing`);
    }
    if (!hasText(character.evidence.fact, 24)) {
      errors.push(`${label}.evidence.fact is missing or too short`);
    }
  }

  if (!isObject(character.inference)) {
    errors.push(`${label}.inference must be an object`);
  } else {
    if (!hasText(character.inference.statement, 24)) {
      errors.push(`${label}.inference.statement is missing or too short`);
    }
    if (!hasText(character.inference.basisLabel, 4)) {
      errors.push(`${label}.inference.basisLabel is missing`);
    }
    if (!isSafeLink(character.inference.basisHref)) {
      errors.push(`${label}.inference.basisHref must be a safe internal or HTTPS link`);
    }
    if (character.inference.status !== "in-story-inference") {
      errors.push(`${label}.inference.status must be in-story-inference`);
    }
  }

  if (!isObject(character.record)) {
    errors.push(`${label}.record must be an object`);
  } else {
    for (const field of ["wins", "losses", "draws"]) {
      if (!isNonNegativeInteger(character.record[field])) {
        errors.push(`${label}.record.${field} must be a non-negative integer`);
      }
    }
  }

  if (!isObject(character.mutation)) {
    errors.push(`${label}.mutation must be an object`);
  } else {
    if (!isNonNegativeInteger(character.mutation.generation)) {
      errors.push(`${label}.mutation.generation must be a non-negative integer`);
    }
    if (!hasText(character.mutation.currentTrait, 8)) {
      errors.push(`${label}.mutation.currentTrait is missing or too short`);
    }
  }
}

function validateChallenge(challenge, index, characterIds, errors) {
  const label = `challenges[${index}]`;
  if (!isObject(challenge)) {
    errors.push(`${label} must be an object`);
    return;
  }
  if (!hasText(challenge.id) || !ID_PATTERN.test(challenge.id)) {
    errors.push(`${label}.id must be a lowercase kebab-case id`);
  }
  if (!isDate(challenge.openedOn)) {
    errors.push(`${label}.openedOn must be a calendar date`);
  }
  if (!CHALLENGE_STATUSES.has(challenge.status)) {
    errors.push(`${label}.status is invalid`);
  }
  if (!characterIds.has(challenge.challengerId)) {
    errors.push(`${label}.challengerId does not match a roster character`);
  }
  if (
    !Array.isArray(challenge.challengedIds) ||
    challenge.challengedIds.length < 1
  ) {
    errors.push(`${label}.challengedIds must contain at least one character`);
  } else {
    for (const characterId of challenge.challengedIds) {
      if (!characterIds.has(characterId)) {
        errors.push(`${label}.challengedIds contains unknown character ${String(characterId)}`);
      }
    }
  }
  if (!hasText(challenge.title, 4)) {
    errors.push(`${label}.title is missing`);
  }
  if (!hasText(challenge.summary, 30)) {
    errors.push(`${label}.summary is missing or too short`);
  }
  if (!Array.isArray(challenge.rules) || challenge.rules.length < 3) {
    errors.push(`${label}.rules must contain at least three rules`);
  } else if (challenge.rules.some((rule) => !hasText(rule, 8))) {
    errors.push(`${label}.rules contains an incomplete rule`);
  }
  if (!Array.isArray(challenge.scoring) || challenge.scoring.length < 2) {
    errors.push(`${label}.scoring must contain at least two criteria`);
  } else {
    for (const [scoreIndex, criterion] of challenge.scoring.entries()) {
      if (
        !isObject(criterion) ||
        !hasText(criterion.label, 4) ||
        !Number.isInteger(criterion.points) ||
        criterion.points < 1
      ) {
        errors.push(`${label}.scoring[${scoreIndex}] is invalid`);
      }
    }
  }
  if (!hasText(challenge.victoryCondition, 20)) {
    errors.push(`${label}.victoryCondition is missing or too short`);
  }
  if (
    !Number.isInteger(challenge.maxTurns) ||
    challenge.maxTurns < 1 ||
    challenge.maxTurns > 20
  ) {
    errors.push(`${label}.maxTurns must be an integer from 1 to 20`);
  }

  if (!Array.isArray(challenge.responses)) {
    errors.push(`${label}.responses must be an array`);
  } else {
    const responders = new Set();
    for (const [responseIndex, response] of challenge.responses.entries()) {
      const responseLabel = `${label}.responses[${responseIndex}]`;
      if (!isObject(response)) {
        errors.push(`${responseLabel} must be an object`);
        continue;
      }
      if (!characterIds.has(response.characterId)) {
        errors.push(`${responseLabel}.characterId is unknown`);
      }
      if (responders.has(response.characterId)) {
        errors.push(`${responseLabel}.characterId appears more than once`);
      }
      responders.add(response.characterId);
      if (!STANCES.has(response.stance)) {
        errors.push(`${responseLabel}.stance is invalid`);
      }
      if (!hasText(response.line, 12)) {
        errors.push(`${responseLabel}.line is missing or too short`);
      }
    }
  }
}

export function validateArenaState(state, { root = process.cwd() } = {}) {
  const errors = [];
  if (!isObject(state)) {
    return ["arenaState.json must contain an object root"];
  }
  if (state.schemaVersion !== 1) {
    errors.push("arenaState.json schemaVersion must be 1");
  }
  if (!isDate(state.currentDay)) {
    errors.push("arenaState.json currentDay must be a calendar date");
  }
  if (!hasText(state.phase, 4) || !hasText(state.phaseLabel, 4)) {
    errors.push("arenaState.json phase and phaseLabel are required");
  }
  if (!Number.isInteger(state.dailyMinimum) || state.dailyMinimum < 5) {
    errors.push("arenaState.json dailyMinimum must be at least 5");
  }
  if (!Number.isInteger(state.nextAssemblyAt) || state.nextAssemblyAt < 5) {
    errors.push("arenaState.json nextAssemblyAt must be an integer of at least 5");
  }
  if (
    !isObject(state.tournamentPolicy) ||
    state.tournamentPolicy.mutable !== true ||
    !hasText(state.tournamentPolicy.currentRule, 12) ||
    !hasText(state.tournamentPolicy.assemblyQuestion, 12) ||
    !hasText(state.tournamentPolicy.selectionMethod, 20)
  ) {
    errors.push("arenaState.json tournamentPolicy must preserve a mutable, testable selection process");
  }

  if (!Array.isArray(state.roster) || state.roster.length < 1) {
    errors.push("arenaState.json roster must contain at least one character");
    return errors;
  }
  state.roster.forEach((character, index) =>
    validateCharacter(character, index, root, errors),
  );
  const ids = state.roster.map((character) => character?.id);
  const names = state.roster.map(
    (character) => `${character?.nameZh}\u0000${character?.nameEn}`,
  );
  const orders = state.roster.map((character) => character?.entryOrder);
  if (new Set(ids).size !== ids.length) errors.push("roster ids must be unique");
  if (new Set(names).size !== names.length) errors.push("roster names must be unique");
  if (new Set(orders).size !== orders.length) errors.push("roster entryOrder values must be unique");

  const currentEntrants = state.roster.filter(
    (character) =>
      character?.role === "challenger" &&
      character?.enteredOn === state.currentDay &&
      character?.status === "active",
  );
  if (currentEntrants.length < state.dailyMinimum) {
    errors.push(
      `current day must contain at least ${String(state.dailyMinimum)} complete active challengers`,
    );
  }

  if (!Array.isArray(state.batches) || state.batches.length < 1) {
    errors.push("arenaState.json batches must contain at least one batch");
  } else {
    const batchIds = new Set();
    for (const [index, batch] of state.batches.entries()) {
      const label = `batches[${index}]`;
      if (!isObject(batch)) {
        errors.push(`${label} must be an object`);
        continue;
      }
      if (!hasText(batch.id) || !ID_PATTERN.test(batch.id)) {
        errors.push(`${label}.id must be a lowercase kebab-case id`);
      }
      if (batchIds.has(batch.id)) errors.push(`${label}.id is duplicated`);
      batchIds.add(batch.id);
      if (!isDate(batch.date)) errors.push(`${label}.date must be a calendar date`);
      if (!hasText(batch.label, 4)) errors.push(`${label}.label is missing`);
      if (!isSafePortrait(root, batch.portraitAtlas)) {
        errors.push(`${label}.portraitAtlas must resolve under public/images/xiaolin`);
      }
      if (!hasText(batch.portraitAtlasAlt, 12)) {
        errors.push(`${label}.portraitAtlasAlt is missing or too short`);
      }
      if (!Array.isArray(batch.entrantIds) || batch.entrantIds.length < state.dailyMinimum) {
        errors.push(`${label}.entrantIds must contain the daily minimum`);
      }
    }
  }

  const currentBatch = state.batches?.find(
    (batch) => batch?.date === state.currentDay,
  );
  if (!currentBatch) {
    errors.push("a batch for currentDay is required");
  } else {
    const currentIds = new Set(currentEntrants.map((character) => character.id));
    const batchIds = new Set(currentBatch.entrantIds);
    if (
      currentIds.size !== batchIds.size ||
      [...currentIds].some((id) => !batchIds.has(id))
    ) {
      errors.push("current batch entrantIds must exactly match the current active challengers");
    }
    const panels = currentEntrants.map(
      (character) => character.portrait?.atlasPanel,
    );
    if (new Set(panels).size !== currentEntrants.length) {
      errors.push("current batch challengers must use distinct portrait atlas panels");
    }
    for (const character of currentEntrants) {
      if (character.portrait?.src !== currentBatch.portraitAtlas) {
        errors.push(`${character.id} must use the current batch portrait atlas`);
      }
    }
  }

  const characterIds = new Set(ids);
  const freeActionClock = state.freeActionClock;
  if (
    !isObject(freeActionClock) ||
    !isNonNegativeInteger(freeActionClock.turn) ||
    !isDate(freeActionClock.lastActionOn) ||
    !hasText(freeActionClock.lastActionId) ||
    !ID_PATTERN.test(freeActionClock.lastActionId) ||
    !Array.isArray(freeActionClock.lastActorIds) ||
    freeActionClock.lastActorIds.length < 1 ||
    freeActionClock.lastActorIds.some((id) => !characterIds.has(id)) ||
    !Array.isArray(freeActionClock.completedSlots) ||
    freeActionClock.completedSlots.some(
      (slot) => !FREE_ACTION_SLOT_PATTERN.test(slot),
    ) ||
    new Set(freeActionClock.completedSlots).size !==
      freeActionClock.completedSlots.length
  ) {
    errors.push(
      "arenaState.json freeActionClock must contain a valid persistent turn, actors, and unique Taipei slots",
    );
  }

  if (!Array.isArray(state.challenges) || state.challenges.length < 1) {
    errors.push("arenaState.json challenges must contain at least one challenge");
  } else {
    state.challenges.forEach((challenge, index) =>
      validateChallenge(challenge, index, characterIds, errors),
    );
    const challengeIds = state.challenges.map((challenge) => challenge?.id);
    if (new Set(challengeIds).size !== challengeIds.length) {
      errors.push("challenge ids must be unique");
    }
  }

  if (!Array.isArray(state.events) || state.events.length < 1) {
    errors.push("arenaState.json events must contain at least one event");
  } else {
    const freeActionEvents = [];
    for (const [index, event] of state.events.entries()) {
      const label = `events[${index}]`;
      if (
        !isObject(event) ||
        !isDate(event.date) ||
        !EVENT_TYPES.has(event.type) ||
        !Array.isArray(event.characterIds) ||
        event.characterIds.length < 1 ||
        !hasText(event.line, 12)
      ) {
        errors.push(`${label} is invalid`);
        continue;
      }
      for (const characterId of event.characterIds) {
        if (!characterIds.has(characterId)) {
          errors.push(`${label}.characterIds contains unknown character ${String(characterId)}`);
        }
      }
      if (event.type === "free-action") {
        freeActionEvents.push(event);
        if (
          !hasText(event.id) ||
          !ID_PATTERN.test(event.id) ||
          !Number.isInteger(event.sequence) ||
          event.sequence < 1 ||
          !FREE_ACTION_KINDS.has(event.actionKind)
        ) {
          errors.push(`${label} has invalid free-action metadata`);
        }
      }
    }

    const freeActionIds = freeActionEvents.map((event) => event.id);
    const freeActionSequences = freeActionEvents.map((event) => event.sequence);
    if (new Set(freeActionIds).size !== freeActionIds.length) {
      errors.push("free-action event ids must be unique");
    }
    if (new Set(freeActionSequences).size !== freeActionSequences.length) {
      errors.push("free-action event sequences must be unique");
    }
    if (
      isObject(freeActionClock) &&
      (freeActionEvents.length !== freeActionClock.turn ||
        freeActionEvents.at(-1)?.id !== freeActionClock.lastActionId ||
        freeActionEvents.at(-1)?.date !== freeActionClock.lastActionOn)
    ) {
      errors.push(
        "freeActionClock must match the latest free-action event and total turn count",
      );
    }
  }

  return errors;
}

export function runArenaPublisher(root = process.cwd()) {
  const statePath = resolve(root, "src", "data", "arenaState.json");
  if (!existsSync(statePath)) {
    return {
      status: "failed",
      checked: 0,
      errors: ["src/data/arenaState.json is missing"],
    };
  }
  let state;
  try {
    state = JSON.parse(readFileSync(statePath, "utf8"));
  } catch (error) {
    return {
      status: "failed",
      checked: 0,
      errors: [`src/data/arenaState.json is invalid: ${String(error)}`],
    };
  }
  const errors = validateArenaState(state, { root });
  return {
    status: errors.length === 0 ? "passed" : "failed",
    checked: Array.isArray(state.roster) ? state.roster.length : 0,
    errors,
  };
}

const invokedPath = process.argv[1]
  ? realpathSync(resolve(process.argv[1]))
  : "";
const modulePath = realpathSync(fileURLToPath(import.meta.url));
if (invokedPath === modulePath) {
  const rootFlag = process.argv.indexOf("--root");
  const root =
    rootFlag >= 0 && process.argv[rootFlag + 1]
      ? resolve(process.argv[rootFlag + 1])
      : process.cwd();
  const result = runArenaPublisher(root);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status !== "passed") process.exitCode = 1;
}
