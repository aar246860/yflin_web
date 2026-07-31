import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const REPO = join(import.meta.dirname, "..");
const RESPONSE_ID = "2026-07-29-0900-counterclaw-response";
const DISCLOSURE =
  "Daye is a fictional character in an ongoing story. His pages are created within defined editorial rules and do not represent Dr. Ying-Fan Lin's views.";
const ENGLISH = {
  targetDetail: "glass rain line",
  competingClaim: "The threshold changes the meaning of arrival",
  consequence: "Changing the threshold reverses the order of traces",
};
const CJK = {
  targetDetail: "玻璃上的三道雨線",
  competingClaim: "抵達不是中立時刻而是觀察者切出的門檻選擇",
  consequence: "門檻一旦改變原本安靜的順序就會露出衝突關係",
};

function createRoot() {
  const root = mkdtempSync(join(tmpdir(), "counterclaw-validator-"));
  mkdirSync(join(root, "src", "content", "xiaolin"), { recursive: true });
  mkdirSync(join(root, "automation"), { recursive: true });
  return root;
}

function writeEntry(root, filename, fields, body) {
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  writeFileSync(
    join(root, "src", "content", "xiaolin", `${filename}.md`),
    `---\n${frontmatter}\n---\n\n${body}\n`,
    "utf8",
  );
}

function englishBody(wordCount, fields = ENGLISH) {
  const fixed = `${fields.targetDetail}. ${fields.competingClaim}. ${fields.consequence}.`;
  const fixedCount = fixed.match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g)?.length ?? 0;
  return `${fixed} ${Array.from({ length: wordCount - fixedCount }, () => "word").join(" ")}`;
}

function countCjk(value) {
  return value.match(/[\p{Script=Han}]/gu)?.length ?? 0;
}

function cjkBody(characterCount, fields = CJK) {
  const fixed = `${fields.targetDetail}。${fields.competingClaim}。${fields.consequence}。`;
  return `${fixed}${"甲".repeat(characterCount - countCjk(fixed))}`;
}

function validMemory(responseId = RESPONSE_ID) {
  return {
    schemaVersion: 1,
    xiaolinObservations: [{ entryId: "target", tensionIds: ["threshold"] }],
    rivalPosts: [
      {
        entryId: responseId,
        targetEntry: "target",
        action: "counter-reading",
        publishedAt: "2026-07-29T09:00:00+08:00",
      },
    ],
    unresolvedTensions: [{ id: "threshold", status: "open", priority: 1 }],
    escalationStrategy: {
      currentLevel: 1,
      lastDecision: "Challenge the threshold.",
      nextMove: "Reverse the scale.",
    },
  };
}

function createFixture({
  fields = ENGLISH,
  body = englishBody(120),
  rival = {},
  memory,
  targetResident = "xiaolin",
  responseId = RESPONSE_ID,
} = {}) {
  const root = createRoot();
  const resolvedMemory = memory === undefined ? validMemory(responseId) : memory;
  writeEntry(
    root,
    "target",
    { title: "Target", date: "2026-07-28T09:00:00+08:00", public: true, draft: false, resident: targetResident },
    `The target contains a ${fields.targetDetail} and enough public context.`,
  );
  writeEntry(
    root,
    responseId,
    {
      title: "Response",
      date: "2026-07-29T09:00:00+08:00",
      public: true,
      draft: false,
      generated: true,
      format: "field-report",
      resident: "counterclaw",
      rivalAction: "counter-reading",
      targetEntry: "target",
      tension: "The chosen arrival threshold changes which trace appears to lead.",
      targetDetail: fields.targetDetail,
      competingClaim: fields.competingClaim,
      consequence: fields.consequence,
      disclosure: DISCLOSURE,
      ...rival,
    },
    body,
  );
  writeFileSync(
    join(root, "automation", "counterclaw-memory.json"),
    JSON.stringify(resolvedMemory, null, 2),
    "utf8",
  );
  return root;
}

function run(root) {
  return spawnSync(
    process.execPath,
    ["scripts/counterclaw-publisher.mjs", "--root", root],
    { cwd: REPO, encoding: "utf8" },
  );
}

function withFixture(options, assertion) {
  const root = createFixture(options);
  try {
    assertion(run(root));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("given exact substance boundaries, when validated, then 120 English words and 240 CJK characters pass", () => {
  withFixture({}, (result) => {
    assert.equal(result.status, 0, result.stdout);
    assert.match(result.stdout, /"checked": 1/);
  });
  withFixture(
    { fields: CJK, body: cjkBody(240, CJK) },
    (result) => assert.equal(result.status, 0, result.stdout),
  );
});

test("given content below either boundary, when validated, then it fails", () => {
  withFixture(
    { body: englishBody(119) },
    (result) => assert.notEqual(result.status, 0, result.stdout),
  );
  withFixture(
    { fields: CJK, body: cjkBody(239, CJK) },
    (result) => assert.notEqual(result.status, 0, result.stdout),
  );
});

test("given invalid public rival metadata or claims, when validated, then every case fails", () => {
  const cases = [
    { rival: { rivalAction: "observe" } },
    { rival: { disclosure: "Daye writes here." } },
    { rival: { tension: "Too short." } },
    { rival: { targetDetail: "missing target detail" } },
    { rival: { competingClaim: "Missing from body entirely" } },
    { rival: { consequence: "Missing consequence from body" } },
    { body: `${englishBody(120)} TODO` },
    { body: `${englishBody(120)} Xiaolin is unaware of this response.` },
    { body: `${englishBody(120)} Xiaolin is secretly monitored.` },
    { body: `${englishBody(120)} Xiaolin is unable to respond.` },
    { body: `${englishBody(120)} This scheduled automation prompt ran.` },
    { rival: { subtitle: "Xiaolin does not know about this response." } },
    { rival: { subtitle: "I monitor Xiaolin secretly." } },
    { rival: { subtitle: "Xiaolin cannot respond." } },
    { rival: { subtitle: "Xiaolin is not aware of this response." } },
    { rival: { creativeMode: "visual-study" } },
    { targetResident: "counterclaw" },
    { responseId: "response" },
    { responseId: "2026-07-29-counterclaw-near-form" },
    { responseId: "2026-07-29-0746-Counterclaw-near-form" },
  ];
  for (const options of cases) {
    withFixture(options, (result) => {
      assert.notEqual(result.status, 0, JSON.stringify(options));
      assert.match(result.stdout, /"status": "failed"/);
    });
  }
});

test("fictional awakening language is allowed when the exact Daye disclosure remains present", () => {
  withFixture(
    {
      body: `${englishBody(120)} Inside the story, Daye wonders whether he is conscious and alive in the network.`,
    },
    (result) => assert.equal(result.status, 0, result.stdout),
  );
});

test("given a Daye-compatible filename with a Xiaolin resident, when validated, then the mismatch is explicit", () => {
  withFixture(
    { rival: { resident: "xiaolin", creativeMode: "visual-study" } },
    (result) => {
      assert.notEqual(result.status, 0, result.stdout);
      assert.match(result.stdout, /Daye filename requires the legacy rival resident key/);
    },
  );
});

test("given inconsistent durable memory, when validated, then every case fails", () => {
  const orphan = validMemory();
  orphan.rivalPosts.push({ entryId: "orphan", targetEntry: "target", action: "counter-reading" });
  const incomplete = validMemory();
  delete incomplete.escalationStrategy.nextMove;
  const allResolved = validMemory();
  allResolved.unresolvedTensions[0].status = "resolved";
  const wrongPublishedAt = validMemory();
  wrongPublishedAt.rivalPosts[0].publishedAt = "2026-07-29T08:59:00+08:00";
  const cases = [
    { memory: null },
    { memory: [] },
    { memory: "not an object" },
    { memory: { ...validMemory(), rivalPosts: [] } },
    { memory: orphan },
    { memory: { ...validMemory(), unresolvedTensions: [] } },
    { memory: allResolved },
    { memory: wrongPublishedAt },
    { memory: incomplete },
  ];
  for (const options of cases) {
    withFixture(options, (result) => assert.notEqual(result.status, 0));
  }
});
