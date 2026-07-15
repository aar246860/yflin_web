import fs from "node:fs";
import path from "node:path";

import { semanticFormulaExpression, semanticVisualExpression } from "./research_video_semantic_visuals.mjs";

const ROOT = process.cwd();
const VIDEO_ROOT = path.join(ROOT, "research-videos");
const INDEX = JSON.parse(fs.readFileSync(path.join(VIDEO_ROOT, "source-index.json"), "utf8"));
const SPEC_ROOT = path.join(VIDEO_ROOT, "specs");
const PAPER_ROOT = path.join(VIDEO_ROOT, "papers");
const SCENE_SECONDS = 8;

const normalizeDisplayUnits = (value) => String(value)
  .normalize("NFKC")
  .replace(/\bm(?:\^?3|³)(?=\b|\/)/gi, "m³");

const pyString = (value) => JSON.stringify(normalizeDisplayUnits(value));
const labelWords = (value, wordLimit, characterLimit = 70) => {
  const words = normalizeDisplayUnits(value)
    .replaceAll("_", " ")
    .replace(/[=^\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, wordLimit);
  while (words.length > 1 && words.join(" ").length > characterLimit) words.pop();
  return words;
};
const shortLabel = (value, limit = 9) => labelWords(value, limit).join(" ");
const wrappedLabel = (value, wordLimit = 12, lineWidth = 36) => {
  const normalizedWords = normalizeDisplayUnits(value).replaceAll("_", " ").replace(/[=^\\]/g, " ").replace(/\s+/g, " ").trim().split(" ");
  const words = labelWords(value, wordLimit, 66);
  const truncated = words.length < normalizedWords.length;
  const lines = [];
  for (const word of words) {
    const candidate = lines.length ? `${lines.at(-1)} ${word}` : word;
    if (lines.length && candidate.length > lineWidth && lines.length < 2) lines.push(word);
    else if (lines.length) lines[lines.length - 1] = candidate;
    else lines.push(word);
  }
  if (truncated && lines.length) lines[lines.length - 1] = `${lines.at(-1)}...`;
  return lines.slice(0, 2).join("\n");
};
const wrappedDetail = (value) => {
  const normalized = String(value).replaceAll("_", " ").replace(/\s+/g, " ").trim();
  const chunks = normalized.split(/\s*(?:,|;|\band\b|\bwith\b|\bbeside\b|\bmirrored by\b|\bcarrying\b|\blinked to\b)\s*/i);
  const terms = chunks.map((chunk, index) => chunk.replace(/^(?:a|an|the)\s+/i, "").split(" ").slice(0, index === 0 ? 3 : 2).join(" ")).filter(Boolean);
  if (terms.length === 1) return terms[0].split(" ").slice(0, 7).join(" ");
  const compact = terms.length > 3 ? [terms[0], terms[1], terms.slice(2, 4).join(" | ")] : terms;
  const output = compact.join("\n");
  return output.length <= 68 ? output : `${output.slice(0, 65).replace(/\s+\S*$/, "")}...`;
};
const timestamp = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}.000`;
};
function methodCode(scene, number, paperId) {
  const role = scene.id?.toLowerCase() ?? "return";
  const title = shortLabel(scene.minimalText);
  const caption = wrappedLabel(scene.claim ?? scene.premise ?? scene.output ?? "Source-bounded result");
  const visualObject = scene.visualObject ?? scene.claim ?? scene.output ?? scene.premise;
  const semanticDescription = [`[paper:${paperId}]`, visualObject, scene.stepDetail, scene.visibleEvidence, scene.motionPurpose].filter(Boolean).join(". ");
  const semanticContext = { visualObject: semanticDescription, sceneNumber: number, sceneId: scene.id ?? "return" };
  const detail = wrappedDetail(visualObject);
  const formulas = [0, 1, 2].map((phase) => semanticFormulaExpression(semanticContext, phase));
  const hasFormula = Boolean(formulas[0]);
  const formulaAssignment = (name, phase) => hasFormula ? `\n        ${name}_formula = ${formulas[phase]}` : "";
  const formulaItem = (name) => hasFormula ? `, ${name}_formula` : "";
  const initialLabels = `[item for item in [title_label, caption_label, detail_label, entry_field${hasFormula ? ", entry_formula" : ""}] if item is not entry_field]`;
  const transitionLabels = `[item for item in [title_label, caption_label, detail_label, entry_field, mid_field${hasFormula ? ", entry_formula, mid_formula" : ""}] if item is not entry_field and item is not mid_field${hasFormula ? " and item is not entry_formula and item is not mid_formula" : ""}]`;
  const settledLabels = `[item for item in [title_label, caption_label, detail_label, entry_field, settled_field${hasFormula ? ", mid_formula, settled_formula" : ""}] if item is not entry_field and item is not settled_field${hasFormula ? " and item is not mid_formula and item is not settled_formula" : ""}]`;
  return `
    def scene_${String(number).padStart(2, "0")}_${role}(self):
        self.clear()
        title_label = Text(${pyString(title)}, font_size=34, color=INK).to_edge(UP)
        if title_label.width > 12.4:
            title_label.scale_to_fit_width(12.4)
        caption_label = Text(${pyString(caption)}, font_size=21, color=INK).to_edge(DOWN)
        if caption_label.width > 11.8:
            caption_label.scale_to_fit_width(11.8)
        detail_label = Text(${pyString(detail)}, font_size=17, color=INK).move_to([4.35, ${hasFormula ? "-0.45" : "0.15"}, 0])
        if detail_label.width > 3.3:
            detail_label.scale_to_fit_width(3.3)
        if detail_label.height > ${hasFormula ? "2.5" : "3.8"}:
            detail_label.scale_to_fit_height(${hasFormula ? "2.5" : "3.8"})
        entry_field = ${semanticVisualExpression(semanticContext, 0)}${formulaAssignment("entry", 0)}
        assert_scene_layout(scene=self, pending_items=[title_label, caption_label, detail_label, entry_field${formulaItem("entry")}], labels=${initialLabels}, blockers=[entry_field], frame_items=[title_label, caption_label, detail_label, entry_field${formulaItem("entry")}], intentional_overlaps=[(entry_field, entry_field)])
        self.play(FadeIn(title_label), FadeIn(caption_label), FadeIn(detail_label), Create(entry_field),${hasFormula ? " FadeIn(entry_formula)," : ""} run_time=1.25)
        self.wait(0.8)
        mid_field = ${semanticVisualExpression(semanticContext, 1)}${formulaAssignment("mid", 1)}
        assert_scene_layout(scene=self, pending_items=[mid_field${formulaItem("mid")}], labels=${transitionLabels}, blockers=[entry_field, mid_field], frame_items=[title_label, caption_label, detail_label, entry_field, mid_field${hasFormula ? ", entry_formula, mid_formula" : ""}], intentional_overlaps=[(entry_field, entry_field), (mid_field, mid_field), (entry_field, mid_field)${hasFormula ? ", (entry_formula, mid_formula)" : ""}])
        self.play(Transform(entry_field, mid_field),${hasFormula ? " FadeOut(entry_formula), FadeIn(mid_formula)," : ""} run_time=2.2)
        self.wait(0.8)
        settled_field = ${semanticVisualExpression(semanticContext, 2)}${formulaAssignment("settled", 2)}
        assert_scene_layout(scene=self, pending_items=[settled_field${formulaItem("settled")}], labels=${settledLabels}, blockers=[entry_field, settled_field], frame_items=[title_label, caption_label, detail_label, entry_field, settled_field${hasFormula ? ", mid_formula, settled_formula" : ""}], intentional_overlaps=[(entry_field, entry_field), (settled_field, settled_field), (entry_field, settled_field)${hasFormula ? ", (mid_formula, settled_formula)" : ""}])
        self.play(Transform(entry_field, settled_field),${hasFormula ? " FadeOut(mid_formula), FadeIn(settled_formula)," : ""} run_time=2.2)
        self.wait(1.1)
`;
}

function sourceCode(spec) {
  const scenes = [...spec.background, ...spec.methods, { ...spec.return, id: undefined }];
  const calls = [
    `        self.camera.background_color = "#FFFFFF"`,
    ...scenes.map((scene, index) => `        self.scene_${String(index + 1).padStart(2, "0")}_${scene.id?.toLowerCase() ?? "return"}()`),
  ].join("\n");
  const methods = scenes.map((scene, index) => methodCode(scene, index + 1, spec.id)).join("\n");
  const optionalImports = ["DashedLine", "Ellipse"].filter((name) => methods.includes(`${name}(`));
  const optionalImportText = optionalImports.length ? `${optionalImports.join(", ")}, ` : "";
  return `from manim import Arc, Arrow, Axes, Circle, Create, Dot, DOWN, FadeIn, FadeOut, ${optionalImportText}Line, MathTex, Polygon, Rectangle, Scene, Text, Transform, UP, VGroup

from assets.research_manim_layout import assert_scene_layout

INK = \"#102A35\"\n\n\nclass ResearchVisualAbstract(Scene):\n    def construct(self):\n${calls}\n${methods}`;
}

function transcript(spec) {
  const scenes = [...spec.background, ...spec.methods, spec.return];
  const lines = [`# ${spec.title}`, "", `DOI: ${spec.doi}`, ""];
  scenes.forEach((scene, index) => {
    const statement = scene.claim ?? scene.premise ?? scene.output;
    lines.push(`## Scene ${index + 1}`, "", statement, "", `Source: ${scene.locator}`, "");
  });
  return `${lines.join("\n")}\n`;
}

function captions(spec) {
  const scenes = [...spec.background, ...spec.methods, spec.return];
  const cues = ["WEBVTT", ""];
  scenes.forEach((scene, index) => {
    const statement = shortLabel(scene.claim ?? scene.premise ?? scene.output, 18);
    cues.push(String(index + 1), `${timestamp(index * SCENE_SECONDS)} --> ${timestamp((index + 1) * SCENE_SECONDS - 1)}`, statement, "");
  });
  return `${cues.join("\n")}\n`;
}

const pending = INDEX.pendingRecords;
if (pending.length !== 39) throw new Error(`Expected 39 pending papers, found ${pending.length}`);
for (const record of pending) {
  const specFile = path.join(SPEC_ROOT, `${record.id}.json`);
  if (!fs.existsSync(specFile)) throw new Error(`Missing validated input spec: ${specFile}`);
  const spec = JSON.parse(fs.readFileSync(specFile, "utf8"));
  const paperDir = path.join(PAPER_ROOT, record.id);
  fs.mkdirSync(paperDir, { recursive: true });
  fs.writeFileSync(path.join(paperDir, `${record.id}_scene.py`), sourceCode(spec), "utf8");
  fs.writeFileSync(path.join(paperDir, `${record.id}_transcript.md`), transcript(spec), "utf8");
  fs.writeFileSync(path.join(paperDir, `${record.id}_en.vtt`), captions(spec), "utf8");
}
console.log(`Generated 39 Manim scene sources, transcripts, and caption tracks.`);
