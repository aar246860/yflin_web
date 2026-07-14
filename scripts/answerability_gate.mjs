import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/data/canonicalAnswers.ts",
  "src/pages/llms-full.txt.ts",
  "src/pages/llms.txt.ts",
  "src/pages/index.astro",
];

const requiredQuestions = [
  "What is Lagging Darcy Law?",
  "How is flux-gradient asynchrony different from simple delay?",
  "When does a pumping test need Lagging Darcy Law?",
  "Who is Ying-Fan Lin in groundwater research?",
  "What is groundwater decision reliability audit?",
  "How does transformation uncertainty relate to pumping-test interpretation?",
];

const requiredPhrases = [
  "Canonical Answer Blocks",
  "Lagging Darcy Law is a generalized Darcy-law formulation",
  "not a simple signal delay",
  "Use Lagging Darcy Law when asynchronous response changes",
  "Ying-Fan Lin studies groundwater response",
  "Groundwater Decision Reliability Audit is a technical review",
  "Pumping tests measure drawdown and recovery",
  "model-to-parameter",
  "model-to-decision",
  "do not claim that Lagging Darcy Law is always required",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`Missing required answerability file: ${file}`);
  }
}

const sources = requiredFiles
  .filter((file) => fs.existsSync(path.join(root, file)))
  .map((file) => ({ file, text: read(file) }));

const sourceCorpus = sources.map(({ text }) => text).join("\n");

for (const question of requiredQuestions) {
  if (!sourceCorpus.includes(question)) {
    fail(`Missing canonical answer question in source: ${question}`);
  }
}

for (const phrase of requiredPhrases) {
  if (!sourceCorpus.includes(phrase)) {
    fail(`Missing answerability phrase in source: ${phrase}`);
  }
}

if (fs.existsSync(path.join(root, "dist"))) {
  const distFiles = ["dist/llms-full.txt", "dist/llms.txt", "dist/index.html"];
  for (const file of distFiles) {
    if (!fs.existsSync(path.join(root, file))) {
      fail(`Missing answerability dist output: ${file}`);
    }
  }
  const distCorpus = distFiles
    .filter((file) => fs.existsSync(path.join(root, file)))
    .map(read)
    .join("\n");
  for (const question of requiredQuestions) {
    if (!distCorpus.includes(question)) {
      fail(`Missing canonical answer question in dist: ${question}`);
    }
  }
  for (const phrase of requiredPhrases) {
    if (!distCorpus.includes(phrase)) {
      fail(`Missing answerability phrase in dist: ${phrase}`);
    }
  }
  const compactMap = read("dist/llms.txt");
  for (const question of requiredQuestions) {
    if (!compactMap.includes(question)) {
      fail(`Missing canonical answer question in compact LLM map: ${question}`);
    }
  }
  for (const phrase of [
    "Canonical Answer Blocks",
    "do not claim that Lagging Darcy Law is always required",
  ]) {
    if (!compactMap.includes(phrase)) {
      fail(`Missing answerability boundary in compact LLM map: ${phrase}`);
    }
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Answerability gate passed.");
