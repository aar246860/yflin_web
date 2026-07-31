import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { runPublisher } from "../scripts/xiaolin-publisher.mjs";

const DISCLOSURE =
  "Xiaolin is a fictional character. His pages do not represent Dr. Ying-Fan Lin's views.";
const COUNTERCLAW_DISCLOSURE =
  "Daye is a fictional character in an ongoing story. His pages are created within defined editorial rules and do not represent Dr. Ying-Fan Lin's views.";

function makeRoot() {
  const root = mkdtempSync(join(tmpdir(), "counterclaw-test-"));
  mkdirSync(join(root, "src", "content", "xiaolin"), { recursive: true });
  return root;
}

function writeEntry(root, filename, fields, body = "A complete test entry.") {
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  writeFileSync(
    join(root, "src", "content", "xiaolin", filename),
    `---\n${frontmatter}\n---\n\n${body}\n`,
    "utf8",
  );
}

function baseEntry(overrides = {}) {
  return {
    title: "Fixture",
    date: "2026-07-26T09:00:00+08:00",
    public: true,
    draft: false,
    generated: true,
    format: "field-report",
    creativeMode: "philosophical-note",
    disclosure: DISCLOSURE,
    ...overrides,
  };
}

function writeArtwork(root, filename, source) {
  const artworkDir = join(root, "public", "images", "xiaolin");
  mkdirSync(artworkDir, { recursive: true });
  writeFileSync(join(artworkDir, filename), source, "utf8");
}

test("given a Counterclaw entry, when Xiaolin rotation is checked, then the rival mode is ignored", () => {
  const root = makeRoot();
  try {
    writeEntry(root, "01-xiaolin.md", baseEntry());
    writeEntry(
      root,
      "02-counterclaw.md",
      baseEntry({
        title: "Rival",
        date: "2026-07-27T09:00:00+08:00",
        resident: "counterclaw",
        creativeMode: "visual-study",
      }),
    );
    writeEntry(
      root,
      "03-xiaolin.md",
      baseEntry({
        date: "2026-07-28T09:00:00+08:00",
        creativeMode: "visual-study",
      }),
    );

    const result = runPublisher({ root });

    assert.equal(result.status, "passed");
    assert.deepEqual(result.errors, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given a legacy entry without resident, when it is checked, then it remains valid", () => {
  const root = makeRoot();
  try {
    writeEntry(root, "legacy.md", baseEntry());

    const result = runPublisher({ root });

    assert.equal(result.status, "passed");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given a Counterclaw entry without Xiaolin creative metadata, when it is checked, then the rival validator owns it", () => {
  const root = makeRoot();
  try {
    const entry = baseEntry({
      resident: "counterclaw",
      disclosure: COUNTERCLAW_DISCLOSURE,
    });
    delete entry.creativeMode;
    writeEntry(root, "counterclaw.md", entry);

    const result = runPublisher({ root });

    assert.equal(result.status, "passed");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given no rival posts, when the Counterclaw CLI runs, then the pre-launch state passes", () => {
  const root = makeRoot();
  try {
    const result = spawnSync(
      process.execPath,
      ["scripts/counterclaw-publisher.mjs", "--root", root],
      { cwd: join(import.meta.dirname, ".."), encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /"status": "passed"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given no rival posts but orphaned durable memory, when the Counterclaw CLI runs, then it fails", () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, "automation"), { recursive: true });
    writeFileSync(
      join(root, "automation", "counterclaw-memory.json"),
      JSON.stringify({
        schemaVersion: 1,
        xiaolinObservations: [],
        rivalPosts: [
          {
            entryId: "2026-07-29-0900-counterclaw-orphan",
            targetEntry: "target",
            action: "counter-reading",
          },
        ],
        unresolvedTensions: [{ id: "threshold", status: "open" }],
        escalationStrategy: {
          currentLevel: 1,
          lastDecision: "Challenge the threshold.",
          nextMove: "Reverse the scale.",
        },
      }),
      "utf8",
    );

    const result = spawnSync(
      process.execPath,
      ["scripts/counterclaw-publisher.mjs", "--root", root],
      { cwd: join(import.meta.dirname, ".."), encoding: "utf8" },
    );

    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stdout, /memory record has no rival post/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given a Counterclaw filename assigned to Xiaolin, when Xiaolin content is checked, then it fails", () => {
  const root = makeRoot();
  try {
    writeEntry(
      root,
      "2026-07-29-0900-counterclaw-misclassified.md",
      baseEntry({ resident: "xiaolin" }),
    );

    const result = runPublisher({ root });

    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /Daye filename requires the legacy rival resident key/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given Xiaolin prose that exposes operational instructions, when content is checked, then it fails", () => {
  const root = makeRoot();
  try {
    writeEntry(root, "unsafe-claim.md", baseEntry(), "The automation prompt scheduled at nine is visible.");
    const result = runPublisher({ root });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /automation prompt|scheduled at/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("given SVG artwork, when Xiaolin content is checked, then accessibility and embedded-resource rules are enforced", () => {
  const validSvg =
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Useful title</title><desc>Useful description</desc><rect width="10" height="10"/></svg>';
  const invalidSvgs = [
    '<svg xmlns="http://www.w3.org/2000/svg"><desc>Description</desc></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Title</title></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Title</title><desc>Description</desc><script>alert(1)</script></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Title</title><desc>Description</desc><image href="https://example.com/a.png"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Title</title><desc>Description</desc><style>@font-face{src:url(https://example.com/a.woff2)}</style></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Title</title><desc>Description</desc><filter><feImage href="https://example.com/a.png"/></filter></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Title</title><desc>Description</desc><style>@import "https://example.com/a.css";</style></svg>',
  ];

  const validRoot = makeRoot();
  try {
    writeArtwork(validRoot, "valid.svg", validSvg);
    writeEntry(
      validRoot,
      "valid.md",
      baseEntry({
        artwork: "/images/xiaolin/valid.svg",
        artworkAlt: "A useful visual description.",
      }),
    );
    assert.equal(runPublisher({ root: validRoot }).status, "passed");
  } finally {
    rmSync(validRoot, { recursive: true, force: true });
  }

  for (const [index, svg] of invalidSvgs.entries()) {
    const root = makeRoot();
    try {
      writeArtwork(root, `invalid-${index}.svg`, svg);
      writeEntry(
        root,
        "invalid.md",
        baseEntry({
          artwork: `/images/xiaolin/invalid-${index}.svg`,
          artworkAlt: "A useful visual description.",
        }),
      );
      assert.equal(runPublisher({ root }).status, "failed", `invalid SVG case ${index}`);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  const escapingRoot = makeRoot();
  try {
    writeEntry(
      escapingRoot,
      "escaping.md",
      baseEntry({
        artwork: "/images/xiaolin/../../outside.svg",
        artworkAlt: "A useful visual description.",
      }),
    );
    assert.equal(runPublisher({ root: escapingRoot }).status, "failed");
  } finally {
    rmSync(escapingRoot, { recursive: true, force: true });
  }

  const unreferencedRoot = makeRoot();
  try {
    writeArtwork(unreferencedRoot, "unreferenced.svg", invalidSvgs[2]);
    writeEntry(unreferencedRoot, "plain.md", baseEntry());
    const result = runPublisher({ root: unreferencedRoot });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /unreferenced\.svg:.*scripts/);
  } finally {
    rmSync(unreferencedRoot, { recursive: true, force: true });
  }
});
