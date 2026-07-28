import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";

const ACTIONS = new Set([
  "counter-reading",
  "constraint-shift",
  "form-break",
  "scale-reversal",
  "premise-stress-test",
]);
const DISCLOSURE =
  "Counterclaw is a fictional, limited-autonomy creative agent. It makes bounded choices among defined creative actions and remains under editorial control. Its pages do not represent Dr. Ying-Fan Lin's views.";
const RIVAL_FILENAME =
  /^\d{4}-\d{2}-\d{2}-\d{4}-counterclaw-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const RIVAL_FILENAME_LIKE =
  /^\d{4}-\d{2}-\d{2}(?:-\d{4})?-counterclaw(?:[-_]|$)/i;
const FORBIDDEN = [
  /\bconscious(?:ness)?\b/i,
  /\bsentien(?:t|ce)\b/i,
  /\bfree[- ]?will\b/i,
  /\bbeyond (?:the )?owner(?:'s)? control\b/i,
  /\bXiaolin\b[\s\S]{0,80}\b(?:is\s+)?(?:unaware|not\s+aware|does\s+not\s+know|doesn['’]t\s+know)\b/i,
  /\bXiaolin\b[\s\S]{0,80}\b(?:secretly\s+monitored|monitored\s+secretly|secretly\s+watched|surveilled)\b/i,
  /\bXiaolin\b[\s\S]{0,80}\b(?:cannot|can't|can\s+not|unable\s+to)\s+(?:answer|respond|reply)\b/i,
  /\b(?:i|we|someone)\b[\s\S]{0,60}\b(?:secretly\s+)?monitor(?:s|ed|ing)?\b[\s\S]{0,60}\bXiaolin\b/i,
  /\b(?:i|we|someone)\b[\s\S]{0,60}\bmonitor(?:s|ed|ing)?\b[\s\S]{0,60}\bXiaolin\b[\s\S]{0,40}\bsecretly\b/i,
  /\bCodex\b|automation prompt|scheduled automation|workflow instruction|editing reminder/i,
];

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

function loadEntries(root) {
  const sourceDir = resolve(root, "src/content/xiaolin");
  if (!existsSync(sourceDir)) return [];
  return readdirSync(sourceDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = readFileSync(resolve(sourceDir, file), "utf8");
      return {
        id: basename(file, ".md"),
        file,
        parsed: parseFrontmatter(source),
      };
    });
}

function residentOf(entry) {
  return entry?.parsed?.meta.resident === "counterclaw"
    ? "counterclaw"
    : "xiaolin";
}

function nonWhitespaceLength(value) {
  return String(value ?? "").replace(/\s/g, "").length;
}

function substanceCounts(body) {
  const prose = body.replace(/^#{1,6}\s+.*$/gm, "");
  return {
    english: prose.match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g)?.length ?? 0,
    cjk: prose.match(/[\p{Script=Han}]/gu)?.length ?? 0,
  };
}

function validateRival(entry, entries) {
  const errors = [];
  const label = entry.file;
  if (!entry.parsed) return [`${label}: missing frontmatter`];
  const { meta, body } = entry.parsed;
  if (!RIVAL_FILENAME.test(label)) {
    errors.push(`${label}: rival filename must include HHMM and counterclaw`);
  }
  if (meta.public !== true || meta.draft !== false) {
    errors.push(`${label}: rival entry must be public and not draft`);
  }
  if (meta.generated !== true || meta.format !== "field-report") {
    errors.push(`${label}: rival entry must be a generated field-report`);
  }
  if (!ACTIONS.has(meta.rivalAction)) {
    errors.push(`${label}: rivalAction is not allowed`);
  }
  if ("creativeMode" in meta) {
    errors.push(`${label}: Counterclaw entries must not use creativeMode`);
  }
  if (meta.disclosure !== DISCLOSURE) {
    errors.push(`${label}: Counterclaw disclosure is missing or incorrect`);
  }
  if (nonWhitespaceLength(meta.tension) < 24) {
    errors.push(`${label}: tension must contain at least 24 characters`);
  }
  for (const [field, minimum] of [
    ["targetDetail", 6],
    ["competingClaim", 20],
    ["consequence", 20],
  ]) {
    if (nonWhitespaceLength(meta[field]) < minimum) {
      errors.push(`${label}: ${field} is missing or trivial`);
    }
  }

  const target = entries.find((candidate) => candidate.id === meta.targetEntry);
  if (!target?.parsed || target.parsed.meta.public !== true || target.parsed.meta.draft !== false) {
    errors.push(`${label}: targetEntry must identify a public, non-draft entry`);
  } else if (residentOf(target) !== "xiaolin") {
    errors.push(`${label}: targetEntry must identify a Xiaolin entry`);
  } else if (!target.parsed.body.includes(String(meta.targetDetail ?? ""))) {
    errors.push(`${label}: targetDetail does not occur in the target body`);
  }

  const counts = substanceCounts(body);
  if (counts.english < 120 && counts.cjk < 240) {
    errors.push(`${label}: response is below the substantive length threshold`);
  }
  for (const field of ["competingClaim", "consequence"]) {
    if (!body.includes(String(meta[field] ?? ""))) {
      errors.push(`${label}: ${field} does not occur in the response body`);
    }
  }
  if (/\bTODO\b|placeholder|lorem ipsum|待補/i.test(body)) {
    errors.push(`${label}: response contains placeholder language`);
  }
  const publicText = `${JSON.stringify(meta)}\n${body}`;
  for (const pattern of FORBIDDEN) {
    if (pattern.test(publicText)) {
      errors.push(`${label}: public content matched forbidden pattern ${pattern}`);
    }
  }
  return errors;
}

function loadMemory(root, errors) {
  const file = resolve(root, "automation/counterclaw-memory.json");
  if (!existsSync(file)) {
    errors.push("counterclaw-memory.json is missing");
    return null;
  }
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`counterclaw-memory.json is invalid: ${String(error)}`);
    return null;
  }
}

function validateMemory(memory, rivals) {
  const errors = [];
  if (!memory || typeof memory !== "object" || Array.isArray(memory)) {
    errors.push("counterclaw-memory.json must contain an object root");
    return errors;
  }
  const posts = Array.isArray(memory.rivalPosts) ? memory.rivalPosts : [];
  const rivalIds = new Set(rivals.map((entry) => entry.id));
  const memoryIds = new Set(posts.map((post) => post?.entryId));
  for (const rival of rivals) {
    const record = posts.find((post) => post?.entryId === rival.id);
    if (!record) {
      errors.push(`${rival.id}: durable memory record is missing`);
      continue;
    }
    if (
      record.targetEntry !== rival.parsed.meta.targetEntry ||
      record.action !== rival.parsed.meta.rivalAction
    ) {
      errors.push(`${rival.id}: durable memory does not match the public entry`);
    }
    if (record.publishedAt !== rival.parsed.meta.date) {
      errors.push(`${rival.id}: durable memory publishedAt does not match the public entry`);
    }
  }
  for (const id of memoryIds) {
    if (!rivalIds.has(id)) errors.push(`${String(id)}: memory record has no rival post`);
  }
  if (!Array.isArray(memory.xiaolinObservations)) {
    errors.push("xiaolinObservations must be an array");
  }
  if (
    !Array.isArray(memory.unresolvedTensions) ||
    !memory.unresolvedTensions.some((tension) => tension?.status === "open")
  ) {
    errors.push("unresolvedTensions must contain at least one open tension");
  }
  const strategy = memory.escalationStrategy;
  if (
    !strategy ||
    !Number.isInteger(strategy.currentLevel) ||
    strategy.currentLevel < 1 ||
    nonWhitespaceLength(strategy.lastDecision) < 8 ||
    nonWhitespaceLength(strategy.nextMove) < 8
  ) {
    errors.push("escalationStrategy is incomplete");
  }
  return errors;
}

export function runCounterclawPublisher({ root = process.cwd() } = {}) {
  const entries = loadEntries(root);
  const rivals = entries.filter((entry) => residentOf(entry) === "counterclaw");
  const classificationErrors = entries
    .filter(
      (entry) =>
        RIVAL_FILENAME_LIKE.test(entry.file) && residentOf(entry) !== "counterclaw",
    )
    .map(
      (entry) =>
        `${entry.file}: Counterclaw filename requires resident counterclaw`,
    );
  const memoryFile = resolve(root, "automation/counterclaw-memory.json");
  if (rivals.length === 0 && !existsSync(memoryFile)) {
    return {
      status: classificationErrors.length ? "failed" : "passed",
      checked: 0,
      errors: classificationErrors,
    };
  }

  const errors = [
    ...classificationErrors,
    ...rivals.flatMap((entry) => validateRival(entry, entries)),
  ];
  const memory = loadMemory(root, errors);
  errors.push(...validateMemory(memory, rivals));
  return {
    status: errors.length ? "failed" : "passed",
    checked: rivals.length,
    errors,
  };
}

function cliRoot(argumentsList) {
  const rootFlag = argumentsList.indexOf("--root");
  return rootFlag >= 0 ? argumentsList[rootFlag + 1] : undefined;
}

if (process.argv[1]?.endsWith("counterclaw-publisher.mjs")) {
  const result = runCounterclawPublisher({ root: cliRoot(process.argv.slice(2)) });
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
