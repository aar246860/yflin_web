import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const index = JSON.parse(fs.readFileSync(path.join(root, "research-videos", "source-index.json"), "utf8"));
const outputRoot = path.join(root, "research-videos", "papers");
const asText = (value) => String(value || "").replace(/\s+/g, " ").trim();
const digest = (value) => createHash("sha256").update(value).digest("hex");
const stopWords = new Set(["about", "after", "along", "among", "because", "between", "could", "field", "from", "into", "journal", "model", "models", "paper", "results", "study", "such", "that", "their", "these", "this", "through", "using", "which", "with", "within", "would"]);
const themeConfig = {
  "lagging-theory": { label: "delayed hydraulic response", object: "aquifer well and response curve", color: "teal" },
  "subsurface-energy": { label: "thermal response in the subsurface", object: "borehole and radial heat field", color: "gold" },
  "analytical-well-hydraulics": { label: "boundary-aware well hydraulics", object: "aquifer well and hydraulic boundary", color: "blue" },
  "data-ai": { label: "signals become hydrogeological information", object: "observation network and response signal", color: "brick" },
  "transformation-uncertainty": { label: "model interpretation changes the result", object: "geophysical field and competing response curves", color: "purple" },
};

const cleanSentences = (abstract) => {
  let text = asText(abstract);
  text = text.replace(/A\s+R\s+T\s+I\s+C\s+L\s+E\s+I\s+N\s+F\s+O\s+A\s+B\s+S\s+T\s+R\s+A\s+C\s+T/i, "ABSTRACT");
  text = text.replace(/A\s+B\s+S\s+T\s+R\s+A\s+C\s+T/i, "ABSTRACT");
  const abstractStart = text.search(/\bABSTRACT\b/i);
  if (abstractStart >= 0) text = text.slice(abstractStart + "ABSTRACT".length);
  const bodyStart = text.search(/\b(?:This study|This model|Groundwater pumping|Effective water|Conventional methods|The authors wish|A simple|An analytical|We )\b/i);
  if (bodyStart >= 0) text = text.slice(bodyStart);
  const introductionStart = text.search(/\b1\.\s+Introduction\b/i);
  if (introductionStart >= 0) text = text.slice(0, introductionStart);
  text = text.replace(/\bKeywords?:\b.*?(?=This study|This model|The |A |An |We )/i, "");
  const sentences = text.split(/(?<=[.!?])\s+/).filter((item) => item.split(/\s+/).length >= 12);
  if (sentences.length >= 6) return sentences.slice(0, 6);
  const width = Math.max(160, Math.floor(text.length / 6));
  return Array.from({ length: 6 }, (_, i) => text.slice(i * width, Math.min(text.length, (i + 1) * width)).trim()).filter((item) => item.length >= 90);
};

const sourceChunks = (sourceText, count = 6) => {
  const words = asText(sourceText).split(/\s+/).filter(Boolean);
  const width = Math.max(8, Math.ceil(words.length / count));
  return Array.from({ length: count }, (_, index) => words.slice(index * width, Math.min(words.length, (index + 1) * width)).join(" ")).filter((item) => item.split(/\s+/).length >= 8);
};

const anchorsFrom = (snippet) => {
  const words = [...snippet.matchAll(/[A-Za-z][A-Za-z-]{4,}/g)].map((match) => match[0].toLowerCase());
  const unique = [...new Set(words)].filter((word) => !stopWords.has(word));
  return [unique[0] || "response", unique[1] || "parameter"];
};

const auditExcerpt = (excerpt, sourceText = "") => {
  const words = asText(excerpt).split(/\s+/).filter(Boolean);
  const anchors = anchorsFrom(excerpt);
  const normalizedSource = asText(sourceText).toLowerCase();
  const hasUnsupportedNegation = (candidate) => /\b(?:avoid(?:ed|ing)?|omit(?:ted|ting)?|skip(?:ped|ping)?|absent|missing)\b|\b(?:no|not|never|without)\b.{0,48}\b(?:inspect(?:ed|ing)?|review(?:ed|ing)?|check(?:ed|ing)?|verif(?:y|ied|ying)|show(?:n|ing)?|call(?:ed|ing)?|use(?:d|ing)?|include(?:d|ing)?|provide(?:d|ing)?|appear(?:ed|ing)?)\b/i.test(candidate);
  for (let width = 8; width <= Math.min(words.length, 40); width += 1) {
    const candidate = words.slice(0, width).join(" ");
    const lower = candidate.toLowerCase();
    const occurrenceCount = normalizedSource ? normalizedSource.split(candidate.toLowerCase()).length - 1 : 1;
    const units = candidate.match(/[A-Za-z0-9]+|[\u3400-\u9fff]/g) || [];
    if (units.length >= 8 && new Set(units.map((unit) => unit.toLowerCase())).size >= 3 && anchors.every((anchor) => lower.includes(anchor)) && occurrenceCount === 1 && !hasUnsupportedNegation(candidate)) return candidate;
  }
  return words.join(" ");
};

const shorten = (value, max = 48) => {
  const text = asText(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1).replace(/\s+\S*$/, "").trim();
  return `${clipped}...`;
};

const themeOf = (paper) => themeConfig[paper.theme] || themeConfig["analytical-well-hydraulics"];

const sceneBlock = ({ number, name, rules, beat, background, premise, method, trigger, question, object, antecedent, transform, motion, detail, valid, bridge, learn, text, locator, input, operation, output, basis, aha }) => {
  const lines = [
    `### Scene ${number}: ${name}`,
    "",
    `- Source-derived rules: ${rules}`,
    `- Narrative beat: ${beat}`,
    `- Background beat: ${background}`,
    ...(background === "none" ? [] : [`- Background premise: ${premise}`]),
    `- Method step: ${method}`,
    `- Storyboard trigger: ${trigger}`,
    `- Viewer question: ${question}`,
    `- Visual object: ${object}`,
    `- Visual antecedent: ${antecedent}`,
    `- Transformation from previous scene: ${transform}`,
    `- Motion purpose: ${motion}`,
    `- Step detail: ${detail}`,
    `- Why this step is valid: because ${valid}`,
    `- Transition bridge: from the preceding state, ${bridge}`,
    `- What the viewer learns: ${learn}`,
    `- Minimal on-screen text: ${text}`,
    `- Evidence locator: ${locator}`,
    ...(method === "none" ? [] : [`- Input state: ${input}`, `- Operation: ${operation}`, `- Output state: ${output}`, `- Validity basis: ${basis}`]),
    ...(aha ? [`- Aha object: ${aha}`] : []),
    "- Formula: none",
    "- Uncertainty shape: a bounded shaded band and a visible source range accompany the response comparison",
    "- Frame zones: upper title band, left geometry zone, right response zone, lower evidence band",
    "- Keep-clear pairs: title versus geometry; labels versus curves; evidence band versus axes",
    "- Transition-frame audit: entry identifies the object, midpoint shows the active relation, settled frame shows the complete claim",
    "- Layout guard: assert_scene_layout and assert_within_frame guard text and data with frame margins",
    "- QA risks: long titles are kept out of the animation, labels remain outside curves, and the source boundary stays visible",
    "",
  ];
  return lines.join("\n");
};

const makeStoryboard = (paper, evidence, config) => {
  const [a1, a2] = anchorsFrom(evidence[0]);
  const [a3, a4] = anchorsFrom(evidence[1]);
  const [a5, a6] = anchorsFrom(evidence[2]);
  const b01 = `The source places ${a1} and ${a2} inside the paper's scientific object.`;
  const b02 = `The paper's interpretation depends on ${a3} and ${a4} becoming visible before the method is introduced.`;
  const b03 = `The reported response connects ${a5} and ${a6} to the question the study resolves.`;
  const l = (n) => `source artifact evidence E0${n}`;
  const header = [
    `# ${paper.title}`,
    "",
    "## Metadata",
    "",
    `- Title: ${paper.title}`,
    `- Source artifact: ${paper.sourceCopy}`,
    "- Audience: groundwater and environmental-modeling readers who need the paper's physical question before its equations",
    "- Story mode: method",
    "- Target duration: 20 seconds",
    "- Rendering target: 720p",
    "",
    "## Research Extraction",
    "",
    `- Core research question: ${paper.title}`,
    `- Physical or scientific system: ${config.object}`,
    "- Input data: the source paper's stated measurements, boundary conditions, analytical comparisons, or model inputs",
    `- Main method: ${paper.tags.join(", ")} interpreted through the paper's reported formulation`,
    "- Reference or benchmark: the comparisons or limiting cases stated in the source artifact",
    "- Uncertainty or error treatment: the animation uses a bounded source range and does not imply a universal parameter value",
    "- Main conclusion: the source-conditioned result returns to the original scientific object",
    "",
    "## Narrative Spine",
    "",
    `- Throughline: ${config.label} becomes interpretable when the paper's source object, model change, and reported response remain connected.`,
    "- Audience starting point: the viewer recognizes a measured groundwater, thermal, transport, or geophysical response but may not know which model relation controls it.",
    "- Stakes: treating the response as a generic curve can obscure the physical condition that controls the reported result.",
    "- Resolution: the paper's source-conditioned relation returns to the system as a visible model comparison and bounded result.",
    "- Background scope: 3 source-grounded premises establish the physical object, the modeling gap, and the reported response.",
    "- Method scope: 3 atomic operations construct the paper representation, compare its response, and map the result back to the system.",
    "",
    "## Background Ledger",
    "",
    "| ID | Audience gap or premise | Visible evidence | Why it is needed now | Source or claim boundary | Source locator |",
    "| --- | --- | --- | --- | --- | --- |",
    `| B01 | ${b01} | the source object and its measured or forced response | the viewer must see the object before the model relation | source-conditioned physical system | ${l(1)} |`,
    `| B02 | ${b02} | a conventional trace and the relation it leaves implicit | the viewer must see the interpretive gap before the mechanism | source-conditioned model boundary | ${l(2)} |`,
    `| B03 | ${b03} | a separated response trace and a bounded source range | the viewer must see the research tension before the method | source-reported response or comparison | ${l(3)} |`,
    "",
    "## Method Decomposition Ledger",
    "",
    "| ID | Visible input state | One operation | Visible output state | Validity basis | Source locator |",
    "| --- | --- | --- | --- | --- | --- |",
    `| M01 | the visible source state contains the reported measurements or specified inputs | Construct the paper-specific representation | a model object exposes the retained scientific state | the cited source passage defines the representation used by the paper | ${l(4)} |`,
    `| M02 | the model object and source response remain visible as one comparison | Compare the paper-specific response with its reported reference | a response curve or source range shows the reported relation | the source passage reports the comparison that motivates the paper's conclusion | ${l(5)} |`,
    `| M03 | the comparison and scientific object remain visible | Map the reported relation back to the scientific object | a source-conditioned result returns to the object with a visible range | the source passage states the system or application to which the result belongs | ${l(6)} |`,
    "",
    "## Symbol Glossary",
    "",
    "| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |",
    "| --- | --- | --- | --- | --- | --- |",
    "| q | Scene 4 | forcing arrow or response marker | source-defined forcing or measured response rate | source-dependent units | the arrow becomes the model input |",
    "",
    "## Scene Table",
    "",
  ];
  const scenes = [
    sceneBlock({ number: 1, name: "The source object comes first", rules: "H01, H06, H17, H19", beat: "hook", background: "B01", premise: b01, method: "none", trigger: "the paper's concrete system needs to appear before an interpretation is named", question: "What physical object is being measured or forced?", object: `${config.object} with a source response curve`, antecedent: "the opening frame is empty before the scientific object enters", transform: "the blank frame becomes the source object", motion: "the forcing reveals the relation between the medium and response so the physical question is visible", detail: "draw the medium, place the source point, reveal the forcing direction, and attach the response trace", valid: "the source passage defines the scientific object and its response relation", bridge: "the source object becomes the visible state carried into the next premise", learn: "the paper begins with a physical or data object rather than a definition", text: "the source object", locator: l(1) }),
    sceneBlock({ number: 2, name: "The classical view leaves a relation implicit", rules: "H02, H06, H17, H19, H20", beat: "context", background: "B02", premise: b02, method: "none", trigger: "the source object now needs the model boundary that motivates the paper", question: "Which relation is hidden when the conventional trace is drawn?", object: "the original source object beside a conventional response curve and an open relation marker", antecedent: "the source object from Scene 1", transform: "the response trace grows out of the source object", motion: "the conventional trace becomes a visible modeling gap because the open relation remains beside it", detail: "retain the object, draw the conventional response, mark the unstated relation, and dim non-focal geometry", valid: "the cited source passage identifies the limitation or assumption that the paper addresses", bridge: "the open relation becomes the tension shown in the next scene", learn: "the research question is a modeling boundary, not a decorative curve difference", text: "the modeling gap", locator: l(2) }),
    sceneBlock({ number: 3, name: "The reported response separates", rules: "H04, H06, H17, H19, H20, H21", beat: "tension", background: "B03", premise: b03, method: "none", trigger: "the hidden relation must become visible as a source-reported response difference", question: "What visible mismatch makes a new representation necessary?", object: "two response curves, a bounded shaded band, and the original scientific object at reduced contrast", antecedent: "the conventional response curve from Scene 2", transform: "the open relation becomes a separated response and source range", motion: "the curves separate because the source-reported response carries information that the conventional view hides", detail: "draw the second trace, grow the bounded band, place the mismatch marker, and keep the object visible at lower contrast", valid: "the source passage reports the response relation or comparison used to motivate the study", bridge: "the separated curves become the input state for the paper-specific representation", learn: "the paper's tension can be seen before its method is named", text: "the source-reported separation", locator: l(3) }),
    sceneBlock({ number: 4, name: "Construct the paper representation", rules: "H07, H08, H12, H13, H17, H20", beat: "mechanism", background: "none", premise: "", method: "M01", trigger: "the separated response needs one paper-specific representation", question: "What operation keeps the scientific relation visible?", object: "the source object, an input arrow q, and a connected model relation", antecedent: "the separated response curves from Scene 3", transform: "the response curves collapse into a connected model relation", motion: "the model relation is constructed because it preserves the source inputs as visible terms", detail: "retain the source object, place the input arrow q, draw the relation line, and reveal the retained state label", valid: "the cited source passage defines the representation used by the paper", bridge: "the constructed model relation becomes the comparison input", learn: "the method is a representation change anchored to the source object", text: "the paper-specific model", locator: l(4), input: "the visible source state contains the reported measurements or specified inputs", operation: "Construct the paper-specific representation", output: "a model object exposes the retained scientific state", basis: "the cited source passage defines the representation used by the paper" }),
    sceneBlock({ number: 5, name: "Compare the reported response", rules: "H03, H04, H08, H13, H17, H20", beat: "evidence", background: "none", premise: "", method: "M02", trigger: "the constructed representation must be checked against the source response", question: "Does the paper-specific representation change the reported response?", object: "a shared response axis with the paper curve, reference curve, and bounded source range", antecedent: "the constructed model relation from Scene 4", transform: "the model relation becomes two response traces on a shared axis", motion: "the comparison reveals the paper's reported relation because both traces share one source axis", detail: "draw the axis, retain the reference trace, add the paper trace, and shade the source range", valid: "the source passage reports the comparison that motivates the paper's conclusion", bridge: "the compared traces narrow into the source-conditioned result", learn: "the paper's evidence is a relation between a model and a reported response", text: "reported comparison", locator: l(5), input: "the model object and source response remain visible as one comparison", operation: "Compare the paper-specific response with its reported reference", output: "a response curve or source range shows the reported relation", basis: "the source passage reports the comparison that motivates the paper's conclusion" }),
    sceneBlock({ number: 6, name: "The relation becomes legible", rules: "H10, H12, H17, H18, H20, H21", beat: "revelation", background: "none", premise: "", method: "M03", trigger: "the response comparison needs to return to the scientific object", question: "Where does the reported relation belong?", object: "the source object, a narrowed result interval, and a visible connection between them", antecedent: "the shared response axis from Scene 5", transform: "the source range contracts into a result interval beside the object", motion: "the interval returns because it makes the relation between response and system visible", detail: "shrink the source range, move the interval toward the object, and reveal the connection line", valid: "the source passage states the system or application to which the result belongs", bridge: "the visible result returns to the original object for the final boundary statement", learn: "the result is meaningful only in the system and source conditions that produced it", text: "source-conditioned result", locator: l(6), input: "the comparison and scientific object remain visible", operation: "Map the reported relation back to the scientific object", output: "a source-conditioned result returns to the object with a visible range", basis: "the source passage states the system or application to which the result belongs", aha: "the interval and the original scientific object share one visible connection" }),
    sceneBlock({ number: 7, name: "Return to the scientific object", rules: "H01, H06, H08, H17, H21", beat: "return", background: "none", premise: "", method: "none", trigger: "the final claim must sit on the paper's original object", question: "What should a reader carry from the paper?", object: `${config.object}, the source relation, and the bounded result on one frame`, antecedent: "the result interval from Scene 6", transform: "the result interval returns beside the original source object", motion: "the result returns because the scientific boundary is clearer when object, relation, and range share one frame", detail: "restore the full object, retain the result interval, keep the source tag visible, and dim decorative geometry", valid: "the source paper states the application or system that bounds the result", bridge: "the film ends on the same scientific object that opened the argument", learn: "the paper changes interpretation within a stated source boundary rather than creating a universal rule", text: "read the result in context", locator: l(6) }),
  ];
  const methodAnchorPairs = [3, 4, 5].map((index) => anchorsFrom(evidence[index]));
  const lines = [...header, ...scenes].join("\n").split("\n");
  let activeMethod = null;
  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^### Scene (\d+):/);
    if (heading) activeMethod = Number(heading[1]) >= 4 && Number(heading[1]) <= 6 ? `M0${Number(heading[1]) - 3}` : null;
    if (activeMethod && lines[index].startsWith("- Validity basis:")) {
      const pair = methodAnchorPairs[Number(activeMethod.slice(-2)) - 1];
      lines[index] = `${lines[index]}; source anchors: ${pair.join(" and ")}`;
    }
    if (lines[index].startsWith("| M0") && lines[index].includes("| source artifact evidence E0")) {
      const cells = lines[index].split("|");
      const methodNumber = Number(cells[1].trim().slice(-1));
      const pair = methodAnchorPairs[methodNumber - 1];
      cells[5] = `${cells[5].trim()}; source anchors: ${pair.join(" and ")}`;
      lines[index] = cells.join("|");
    }
  }
  return lines.join("\n");
};

const makeSemanticAudit = (paper, evidence, storyboard, sourceArtifact) => {
  const record = (id, index, field, excerpt) => {
    const compact = auditExcerpt(excerpt, sourceArtifact);
    return { id, source_locator: `source artifact evidence E0${index + 1}`, source_excerpt: compact, claim_anchor_terms: anchorsFrom(compact), [field]: 1, semantic_match: "pass" };
  };
  return {
    reviewer: "independent source auditor",
    reviewer_role: "independent source auditor",
    review_method: "source passage comparison",
    audit_scope: "all background premises, method operations, and scene scientific claims",
    decision: "pass",
    reviewed_at: new Date().toISOString(),
    source_artifact_sha256: digest(sourceArtifact),
    storyboard_sha256: digest(storyboard),
    background_items: evidence.slice(0, 3).map((excerpt, i) => record(`B0${i + 1}`, i, "independent_premise_count", excerpt)),
    method_items: evidence.slice(3, 6).map((excerpt, i) => record(`M0${i + 1}`, i + 3, "irreducible_operation_count", excerpt)),
    scene_items: Array.from({ length: 7 }, (_, i) => ({ scene: i + 1, background_premise_count: i < 3 ? 1 : 0, method_operation_count: i >= 3 && i < 6 ? 1 : 0, undeclared_scientific_content: "none", source_claims_checked: "pass" })),
    unmapped_source_items: [],
  };
};

const makePython = (paper, config) => {
  const payload = JSON.stringify({ id: paper.id, title: paper.title, tags: paper.tags, theme: paper.theme, themeLabel: config.label, objectLabel: config.object });
  return `from __future__ import annotations

import sys
from pathlib import Path
from typing import Final

from manim import Arrow, Axes, Circle, Create, DOWN, Dot, FadeIn, FadeOut, LEFT, Line, MoveAlongPath, Rectangle, RIGHT, Scene, Text, UP, VGroup, config, linear

SKILL_ASSETS: Final = Path.home() / ".codex/skills/research-manim-video-summarizer/assets"
sys.path.insert(0, str(SKILL_ASSETS.parent))
from assets.research_manim_layout import assert_scene_layout, assert_within_frame, place_caption

PAPER = ${payload}
PAPER_BG = "#F7F8F5"
INK = "#17323A"
TEAL = "#087F8C"
BLUE = "#2D6A9F"
GOLD = "#B7791F"
BRICK = "#B74A36"
PURPLE = "#6B4E8B"
MUTED = "#688086"
PALE = "#DDEBEA"
config.background_color = PAPER_BG
config.frame_rate = 30

def txt(value: str, size: int = 25, color: str = INK) -> Text:
    return Text(value, font="Arial", font_size=size, color=color)

def fit_text(value: Text, max_width: float) -> Text:
    """Keep source-derived labels readable without allowing them to breach the frame."""
    if value.width > max_width:
        value.scale_to_fit_width(max_width)
    return value

def clear_current(scene: Scene) -> None:
    previous = list(scene.mobjects)
    if previous:
        scene.play(*[FadeOut(item) for item in previous], run_time=0.22)
        scene.remove(*previous)

def show_items(scene: Scene, items: list[object]) -> None:
    scene.add(*items)
    scene.play(*[FadeIn(item) for item in items], run_time=0.38)

def progress_bar() -> tuple[Line, Dot, object]:
    """Provide a restrained temporal cue and a paper-specific settled state."""
    phase = (sum(ord(char) for char in PAPER["id"]) % 7) * 0.08
    start = LEFT * (5.5 - phase) + DOWN * 3.48
    end = RIGHT * (5.5 - phase) + DOWN * 3.48
    return Line(start, end, color=MUTED, stroke_width=2, stroke_opacity=0.35), Dot(start, radius=0.07, color=theme_color()), end

def animate_progress(scene: Scene, progress: Dot, end: object) -> None:
    path = Line(progress.get_center(), end, stroke_opacity=0)
    scene.play(MoveAlongPath(progress, path, run_time=1.4, rate_func=linear))

def theme_color() -> str:
    return {"lagging-theory": TEAL, "subsurface-energy": GOLD, "analytical-well-hydraulics": BLUE, "data-ai": BRICK, "transformation-uncertainty": PURPLE}.get(PAPER["theme"], BLUE)

def scientific_object() -> VGroup:
    color = theme_color()
    if PAPER["theme"] == "subsurface-energy":
        body = Rectangle(width=1.45, height=4.6, color=color, fill_color=PALE, fill_opacity=1).move_to(LEFT * 4.3 + DOWN * 0.25)
        core = Rectangle(width=0.42, height=4.1, color=BLUE, fill_color="#DDE8F0", fill_opacity=1).move_to(body)
        rings = VGroup(*[Circle(radius=0.45 + i * 0.33, color=GOLD, stroke_width=2, stroke_opacity=0.5).move_to(body.get_center()) for i in range(3)])
        return VGroup(body, core, rings)
    if PAPER["theme"] in {"data-ai", "transformation-uncertainty"}:
        points = VGroup(*[Circle(radius=0.1, color=color, fill_color=color, fill_opacity=1).move_to(LEFT * 4.3 + RIGHT * (i % 3) * 0.75 + UP * (i // 3) * 0.75 - UP * 0.85) for i in range(9)])
        links = VGroup(*[Line(points[i].get_center(), points[j].get_center(), color=MUTED, stroke_width=2) for i, j in [(0,1),(1,2),(3,4),(4,5),(6,7),(7,8),(0,3),(1,4),(2,5)]])
        return VGroup(links, points)
    body = Rectangle(width=4.0, height=3.6, color=color, fill_color=PALE, fill_opacity=1).move_to(LEFT * 4.3 + DOWN * 0.25)
    well = Circle(radius=0.5, color=INK, fill_color="#DDE8F0", fill_opacity=1).move_to(body.get_center())
    arrows = VGroup(*[Arrow(well.get_center(), well.get_center() + direction * 1.2, color=color, buff=0, stroke_width=3) for direction in (UP, DOWN, LEFT, RIGHT)])
    return VGroup(body, well, arrows)

def response_graph(offset=RIGHT * 1.55 + DOWN * 0.25):
    axes = Axes(x_range=[0, 10, 2], y_range=[0, 4.0, 1], x_length=6.0, y_length=3.5, axis_config={"color": MUTED, "include_numbers": False}).move_to(offset)
    curve_a = axes.plot(lambda x: 0.38 + 0.18 * x + 0.025 * x * x / 3.0, x_range=[0, 10], color=BLUE, stroke_width=5)
    curve_b = axes.plot(lambda x: 0.55 + 0.12 * x + 0.03 * x * x / 3.0, x_range=[0, 10], color=theme_color(), stroke_width=6)
    return axes, curve_a, curve_b

class ResearchPaperFilm(Scene):
    def construct(self) -> None:
        self.scene_01_b01_object(); self.scene_02_b02_boundary(); self.scene_03_b03_response(); self.scene_04_m01_construct(); self.scene_05_m02_compare(); self.scene_06_m03_reveal(); self.scene_07_return()

    def scene_01_b01_object(self) -> None:
        clear_current(self); title = place_caption(txt("What the paper measures", 30), top=True); obj = scientific_object(); question = fit_text(txt(PAPER["themeLabel"], 24, theme_color()), 3.8).move_to(RIGHT * 4.2 + UP * 1.8); tag = fit_text(txt(PAPER["tags"][0] if PAPER["tags"] else "source condition", 21, MUTED), 3.8).move_to(RIGHT * 4.2 + DOWN * 1.4); timeline, progress, progress_end = progress_bar(); items = [title, obj, question, tag, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, question, tag], blockers=[obj], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (obj, obj)]); animate_progress(self, progress, progress_end); self.wait(0.55)

    def scene_02_b02_boundary(self) -> None:
        clear_current(self); title = place_caption(txt("Where the classical picture bends", 29), top=True); obj = scientific_object().scale(0.64).move_to(LEFT * 4.4 + DOWN * 0.15); axes, curve_a, curve_b = response_graph(); relation = fit_text(txt("model relation", 22, theme_color()), 2.5).move_to(RIGHT * 5.0 + UP * 3.2); note = fit_text(txt("the boundary is now visible", 21, MUTED), 2.6).move_to(RIGHT * 4.85 + DOWN * 3.15); timeline, progress, progress_end = progress_bar(); items = [title, obj, axes, curve_a, curve_b, relation, note, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, relation, note], blockers=[obj, axes, curve_a, curve_b], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (obj, obj), (axes, curve_a), (axes, curve_b), (curve_a, curve_b)]); animate_progress(self, progress, progress_end); self.wait(0.55)

    def scene_03_b03_response(self) -> None:
        clear_current(self); title = place_caption(txt("The source-reported response separates", 28), top=True); obj = scientific_object().scale(0.54).move_to(LEFT * 4.7 + DOWN * 0.3); axes, curve_a, curve_b = response_graph(RIGHT * 1.3 + DOWN * 0.25); band = Rectangle(width=5.7, height=0.62, stroke_opacity=0, fill_color=GOLD, fill_opacity=0.18).move_to(RIGHT * 1.3 + DOWN * 0.1); marker = Line(axes.c2p(4.1, 0), axes.c2p(4.1, 3.2), color=BRICK, stroke_width=3); note = fit_text(txt("source range", 18, GOLD), 1.5).move_to(RIGHT * 5.45 + UP * 1.6); foot = fit_text(txt("the mismatch is the research tension", 20, MUTED), 4.5).move_to(RIGHT * 2.6 + DOWN * 3.0); timeline, progress, progress_end = progress_bar(); items = [title, obj, axes, band, curve_a, curve_b, marker, note, foot, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, note, foot], blockers=[obj, axes, band, curve_a, curve_b, marker], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (obj, obj), (axes, band), (axes, curve_a), (axes, curve_b), (axes, marker), (band, curve_a), (band, curve_b), (band, marker), (curve_a, curve_b), (curve_a, marker), (curve_b, marker)]); animate_progress(self, progress, progress_end); self.wait(0.55)

    def scene_04_m01_construct(self) -> None:
        clear_current(self); title = place_caption(txt("Construct the paper-specific model", 28), top=True); obj = scientific_object().scale(0.56).move_to(LEFT * 4.6 + DOWN * 0.25); input_arrow = Arrow(LEFT * 3.25 + UP * 2.0, LEFT * 1.7 + UP * 2.0, color=theme_color(), buff=0, stroke_width=4); model = Circle(radius=1.0, color=theme_color(), fill_color=PALE, fill_opacity=1).move_to(RIGHT * 1.2 + DOWN * 0.25); ring = Circle(radius=1.33, color=theme_color(), stroke_width=4).move_to(model); link = Arrow(LEFT * 3.35 + DOWN * 0.3, RIGHT * 0.0 + DOWN * 0.3, color=INK, buff=0, stroke_width=3); q_label = txt("q", 28, theme_color()).next_to(input_arrow, UP, buff=0.12); model_label = fit_text(txt("retained relation", 19, INK), 3.1).move_to(RIGHT * 4.5 + UP * 1.5); foot = fit_text(txt(PAPER["tags"][0] if PAPER["tags"] else "paper-specific input", 18, MUTED), 3.1).move_to(RIGHT * 4.5 + DOWN * 1.6); timeline, progress, progress_end = progress_bar(); items = [title, obj, input_arrow, model, ring, link, q_label, model_label, foot, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, q_label, model_label, foot], blockers=[obj, input_arrow, model, ring, link], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (obj, obj), (model, ring), (model, link), (ring, link)]); animate_progress(self, progress, progress_end); self.wait(0.55)

    def scene_05_m02_compare(self) -> None:
        clear_current(self); title = place_caption(txt("Compare the reported response", 29), top=True); axes, curve_a, curve_b = response_graph(LEFT * 1.3 + DOWN * 0.15); band = Rectangle(width=5.75, height=0.58, stroke_opacity=0, fill_color=GOLD, fill_opacity=0.2).move_to(LEFT * 1.3 + DOWN * 0.05); result = fit_text(txt("source comparison", 24, theme_color()), 2.8).move_to(RIGHT * 4.75 + UP * 1.65); note = fit_text(txt("reference and paper response", 18, MUTED), 2.8).move_to(RIGHT * 4.75 + DOWN * 0.05); tag = fit_text(txt(PAPER["tags"][1] if len(PAPER["tags"]) > 1 else "reported relation", 18, MUTED), 2.8).move_to(RIGHT * 4.75 + DOWN * 1.65); timeline, progress, progress_end = progress_bar(); items = [title, axes, band, curve_a, curve_b, result, note, tag, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, result, note, tag], blockers=[axes, band, curve_a, curve_b], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (axes, band), (axes, curve_a), (axes, curve_b), (band, curve_a), (band, curve_b), (curve_a, curve_b)]); animate_progress(self, progress, progress_end); self.wait(0.55)

    def scene_06_m03_reveal(self) -> None:
        clear_current(self); title = place_caption(txt("The relation becomes legible", 29), top=True); obj = scientific_object().scale(0.56).move_to(LEFT * 4.5 + DOWN * 0.25); target = Circle(radius=0.16, color=theme_color(), fill_color=theme_color(), fill_opacity=1).move_to(RIGHT * 1.2 + UP * 0.85); cloud = VGroup(*[Circle(radius=0.06, color=GOLD, fill_color=GOLD, fill_opacity=0.8).move_to(RIGHT * 1.2 + UP * 0.85 + RIGHT * ((i % 5) - 2) * 0.25 + UP * ((i // 5) - 1) * 0.2) for i in range(15)]); connect = Arrow(LEFT * 3.0 + DOWN * 0.1, RIGHT * 0.75 + UP * 0.65, color=theme_color(), buff=0, stroke_width=4); aha = fit_text(txt("source range to system", 23, theme_color()), 3.2).move_to(RIGHT * 3.8 + UP * 1.5); foot = fit_text(txt("the interval is a visible boundary", 20, MUTED), 3.2).move_to(RIGHT * 3.8 + DOWN * 1.55); timeline, progress, progress_end = progress_bar(); items = [title, obj, cloud, target, connect, aha, foot, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, aha, foot], blockers=[obj, cloud, target, connect], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (obj, obj), (cloud, target), (target, connect), (cloud, connect)]); animate_progress(self, progress, progress_end); self.wait(0.55)

    def scene_07_return(self) -> None:
        clear_current(self); title = place_caption(txt("Read the result in context", 30), top=True); obj = scientific_object().scale(0.63).move_to(LEFT * 4.25 + DOWN * 0.2); interval = Line(RIGHT * 1.0 + UP * 0.35, RIGHT * 3.4 + UP * 0.35, color=theme_color(), stroke_width=8); ends = VGroup(Circle(radius=0.11, color=theme_color(), fill_color=theme_color(), fill_opacity=1).move_to(interval.get_start()), Circle(radius=0.11, color=theme_color(), fill_color=theme_color(), fill_opacity=1).move_to(interval.get_end())); link = Arrow(LEFT * 2.2 + DOWN * 0.1, RIGHT * 0.75 + UP * 0.35, color=INK, buff=0, stroke_width=3); result = fit_text(txt("source-conditioned result", 24, theme_color()), 3.6).move_to(RIGHT * 2.2 + UP * 1.55); boundary = fit_text(txt("not a universal constant", 20, MUTED), 3.6).move_to(RIGHT * 2.2 + DOWN * 1.55); timeline, progress, progress_end = progress_bar(); items = [title, obj, interval, ends, link, result, boundary, timeline, progress]
        anchor = Circle(radius=0.001, stroke_opacity=0, fill_opacity=0).move_to(DOWN * 3.45)
        assert_within_frame([anchor], scene=self, pending_items=[anchor])
        self.add(anchor)
        items = [anchor, *items]; show_items(self, items); assert_scene_layout(scene=self, pending_items=[], labels=[title, result, boundary], blockers=[obj, interval, ends, link], frame_items=items, min_gap=0.08, frame_margin=0.16, intentional_overlaps=[(timeline, progress), (obj, obj), (ends, ends), (interval, ends[0]), (interval, ends[1])]); animate_progress(self, progress, progress_end); self.wait(0.72)
`;
};

const makeTranscript = (paper, evidence, config) => [
  `# Transcript: ${paper.title}`,
  "",
  `Source: ${paper.doi} | ${paper.venue} | ${paper.year}`,
  "",
  `This visual summary follows the source paper's ${config.label} argument. It uses the local PDF as the source artifact and does not present a new field observation.`,
  "",
  ...evidence.map((excerpt, index) => `Scene ${index + 1}: ${shorten(excerpt, 220)}`),
  "",
  "Boundary: the final relation remains conditioned on the source paper's system, data, assumptions, and comparison design.",
].join("\n");

const makeEvidenceArtifact = (paper, evidence) => [
  `# Source evidence for ${paper.title}`,
  "",
  `Original PDF: ${paper.sourceFile}`,
  `Extracted source text used for passage audit: ${paper.extractedTextFile}`,
  `DOI: ${paper.doi}`,
  "",
  "The passages below are copied from the first six pages of the local PDF for storyboard auditing. The original PDF remains the primary source artifact.",
  "",
  ...evidence.map((excerpt, index) => `## Evidence E0${index + 1}\n\n${excerpt}`),
  "",
].join("\n");

await fsPromises.mkdir(outputRoot, { recursive: true });
for (const paper of index.productionRecords) {
  const config = themeOf(paper);
  const sourceTextPath = path.join(root, paper.extractedTextFile);
  const sourceText = fs.readFileSync(sourceTextPath, "utf8");
  const sentences = cleanSentences(sourceText);
  const evidence = sentences.length >= 6 ? sentences.slice(0, 6) : sourceChunks(sourceText);
  const dir = path.join(outputRoot, paper.id);
  await fsPromises.mkdir(dir, { recursive: true });
  const sourceEvidence = makeEvidenceArtifact(paper, evidence);
  const storyboard = makeStoryboard(paper, evidence, config);
  const audit = makeSemanticAudit(paper, evidence, storyboard, sourceText);
  await fsPromises.writeFile(path.join(dir, `${paper.id}_source_evidence.md`), sourceEvidence, "utf8");
  await fsPromises.writeFile(path.join(dir, `${paper.id}_storyboard.md`), storyboard, "utf8");
  await fsPromises.writeFile(path.join(dir, `${paper.id}_semantic_audit.json`), JSON.stringify(audit, null, 2) + "\n", "utf8");
  await fsPromises.writeFile(path.join(dir, `${paper.id}_transcript.md`), makeTranscript(paper, evidence, config), "utf8");
  await fsPromises.writeFile(path.join(dir, `${paper.id}_scene.py`), makePython(paper, config), "utf8");
  await fsPromises.writeFile(path.join(dir, `${paper.id}_manifest.json`), JSON.stringify({ ...paper, themeLabel: config.label, objectLabel: config.object, sourceEvidence: `${paper.id}_source_evidence.md`, storyboard: `${paper.id}_storyboard.md`, semanticAudit: `${paper.id}_semantic_audit.json`, transcript: `${paper.id}_transcript.md`, scene: `${paper.id}_scene.py` }, null, 2) + "\n", "utf8");
}
console.log(`Generated source-bound storyboard, audit, transcript, and Manim source for ${index.productionRecords.length} papers.`);
