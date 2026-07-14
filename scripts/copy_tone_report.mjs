import fs from "node:fs";
import path from "node:path";
import writeGood from "write-good";

const root = process.cwd();
const targetDirs = ["src/content", "src/pages", "src/components", "src/data"];
const today = new Date().toISOString().slice(0, 10);
const reportPath = path.join(root, "reports", `copy_tone_report_${today}.md`);

const aiTonePatterns = [
  { pattern: /\bunlocks?\b/i, reason: "Sounds like generic startup or AI marketing copy. Prefer a concrete verb." },
  { pattern: /\bleverage[sd]?\b/i, reason: "Often reads like consultant prose. Use 'use' or name the actual action." },
  { pattern: /\bseamless(?:ly)?\b/i, reason: "Vague product-language claim unless the mechanism is shown." },
  { pattern: /\brobust\b/i, reason: "Common AI filler. Say what condition the claim survives." },
  { pattern: /\bholistic\b/i, reason: "Vague unless a specific integration is described." },
  { pattern: /\bcomprehensive\b/i, reason: "Broad promise. Name the actual scope." },
  { pattern: /\btransformative\b/i, reason: "High-claim adjective. Use only with evidence." },
  { pattern: /\bworld-leading\b/i, reason: "Ranking claim that needs external support." },
  { pattern: /\bgame-changing\b/i, reason: "Hype phrase. Replace with a specific technical consequence." },
  { pattern: /\bcutting-edge\b/i, reason: "Generic novelty claim. Name the method or evidence." },
  { pattern: /\bstate-of-the-art\b/i, reason: "Benchmark claim that needs a comparison." },
  { pattern: /\bserves as\b/i, reason: "Stiff academic filler. Use 'is' or an active verb." },
  { pattern: /\bplays? a (?:critical|key|central) role\b/i, reason: "Formulaic phrasing. State the mechanism directly." },
  { pattern: /\bdesigned to\b/i, reason: "Often weaker than saying what the object does." },
  { pattern: /\bin order to\b/i, reason: "Usually wordy. Use 'to'." },
  { pattern: /\bit is important to note\b/i, reason: "AI-like throat clearing. Put the point directly." },
  { pattern: /\bin this context\b/i, reason: "Often removable setup phrase." },
  { pattern: /\bthe fact that\b/i, reason: "Wordy phrase. Usually reducible." },
];

const watchedTerms = ["framework", "decision", "response", "uncertainty", "asynchrony", "diagnostic"];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (/\.(astro|md|mdx|ts)$/.test(entry.name)) return [full];
    return [];
  });
}

function stripCodeLikeBlocks(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function extractQuotedCopy(text) {
  const matches = [];
  const quoted = /(["'`])([^"'`]{35,}?)\1/gms;
  for (const match of text.matchAll(quoted)) {
    const value = cleanText(match[2]);
    if (isLikelyCopy(value)) matches.push(value);
  }
  return matches;
}

function extractVisibleText(text) {
  return cleanText(
    stripCodeLikeBlocks(text)
      .replace(/^---[\s\S]*?---/m, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\{[^{}]*\}/g, " "),
  );
}

function extractFrontmatterCopy(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return [];
  const allowedKeys = new Set([
    "title",
    "subtitle",
    "description",
    "researchQuestion",
    "decisionUse",
    "collaborationRelevance",
  ]);
  const blocks = [];
  for (const line of match[1].split(/\r?\n/)) {
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.+)$/);
    if (!keyMatch || !allowedKeys.has(keyMatch[1])) continue;
    const value = keyMatch[2].replace(/^["']|["']$/g, "");
    const cleaned = cleanText(value);
    if (isLikelyCopy(cleaned)) blocks.push(cleaned);
  }
  return blocks;
}

function extractMarkdownBody(text) {
  return cleanText(stripCodeLikeBlocks(text).replace(/^---\r?\n[\s\S]*?\r?\n---/, " "));
}

function extractCopyBlocks(file, text) {
  if (/\.(md|mdx)$/.test(file)) {
    return [...extractFrontmatterCopy(text), extractMarkdownBody(text)].filter(isLikelyCopy);
  }
  return [...extractQuotedCopy(text), extractVisibleText(text)].filter(isLikelyCopy);
}

function cleanText(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*(?:##+|\-|\d+\.)\s*/g, ". ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyCopy(text) {
  if (text.length < 35) return false;
  if (/^(?:https?:|\/|\.|@|node:|astro:)/.test(text)) return false;
  if (/[{}[\]=<>]/.test(text)) return false;
  if (/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/.test(text)) return false;
  const alphaWords = text.match(/[A-Za-z][A-Za-z'-]{2,}/g) ?? [];
  if (alphaWords.length < 5) return false;
  const alphaShare = (text.match(/[A-Za-z\s.,;:'"?!()/-]/g) ?? []).length / Math.max(text.length, 1);
  if (alphaShare < 0.72) return false;
  const words = text.split(/\s+/).length;
  return words >= 5;
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 8);
}

function wordCount(text) {
  return (text.match(/[A-Za-z0-9_'-]+/g) ?? []).length;
}

function excerpt(text, max = 180) {
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

const fileReports = [];
for (const dir of targetDirs) {
  for (const file of walk(path.join(root, dir))) {
    const relative = path.relative(root, file);
    const raw = fs.readFileSync(file, "utf8");
    const textBlocks = extractCopyBlocks(file, raw)
      .map((text) => text.trim())
      .filter(isLikelyCopy);
    const combined = textBlocks.join("\n\n");
    if (!combined) continue;

    const writeGoodSuggestions = writeGood(combined, { passive: true })
      .slice(0, 12)
      .map((item) => ({
        reason: item.reason,
        index: item.index,
      }));

    const patternHits = [];
    for (const { pattern, reason } of aiTonePatterns) {
      if (pattern.test(combined)) {
        const match = combined.match(pattern);
        patternHits.push({ phrase: match?.[0] ?? pattern.toString(), reason });
      }
    }

    const longSentences = splitSentences(combined)
      .map((sentence) => ({ sentence, words: wordCount(sentence) }))
      .filter((item) => item.words > 34)
      .slice(0, 8);

    const termCounts = watchedTerms
      .map((term) => ({
        term,
        count: (combined.match(new RegExp(`\\b${term}\\b`, "gi")) ?? []).length,
      }))
      .filter((item) => item.count >= 10);

    if (writeGoodSuggestions.length || patternHits.length || longSentences.length || termCounts.length) {
      fileReports.push({ relative, writeGoodSuggestions, patternHits, longSentences, termCounts });
    }
  }
}

const lines = [
  "# Copy Tone Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Purpose: identify stiff, generic, or AI-like English in the public research website before publication.",
  "",
  "Sources used by the workflow:",
  "- write-good: passive voice, weasel words, wordiness, cliches.",
  "- Local Ying-Fan Lin research-brand rules: hype words, consultant verbs, throat-clearing phrases, and overlong sentences.",
  "",
];

if (!fileReports.length) {
  lines.push("No copy-tone issues found by the current rules.", "");
} else {
  lines.push(`Files with suggestions: ${fileReports.length}`, "");
  for (const report of fileReports) {
    lines.push(`## ${report.relative}`, "");
    if (report.patternHits.length) {
      lines.push("### AI-like or stiff phrases");
      for (const hit of report.patternHits) {
        lines.push(`- \`${hit.phrase}\`: ${hit.reason}`);
      }
      lines.push("");
    }
    if (report.longSentences.length) {
      lines.push("### Long sentences");
      for (const item of report.longSentences) {
        lines.push(`- ${item.words} words: ${excerpt(item.sentence)}`);
      }
      lines.push("");
    }
    if (report.writeGoodSuggestions.length) {
      lines.push("### write-good suggestions");
      for (const suggestion of report.writeGoodSuggestions) {
        lines.push(`- ${suggestion.reason}`);
      }
      lines.push("");
    }
    if (report.termCounts.length) {
      lines.push("### Repeated terms to watch");
      for (const item of report.termCounts) {
        lines.push(`- \`${item.term}\`: ${item.count} uses`);
      }
      lines.push("");
    }
  }
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Copy tone report written to ${path.relative(root, reportPath)}`);
console.log(`Files with suggestions: ${fileReports.length}`);
