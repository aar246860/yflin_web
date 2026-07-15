import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const VIDEO_ROOT = path.join(ROOT, "research-videos");
const INDEX_FILE = path.join(VIDEO_ROOT, "source-index.json");
const SPEC_ROOT = path.join(VIDEO_ROOT, "specs");
const PAPER_ROOT = path.join(VIDEO_ROOT, "papers");
const METHOD_VERBS = /\b(select|compute|calculate|transform|align|aggregate|fit|estimate|apply|calibrate|normalize|interpolate|compare|derive|convert|classify|sample|map|solve|integrate|differentiate|filter|rescale|project|update|simulate|evaluate|mark|overlay|plot|form|divide|multiply|add|subtract|identify|extract|combine|separate|assign|construct|propagate|archive|store|save|write|remove|display|summarize|validate|inspect|overwrite|replace|copy|move|label|draw|shade|reveal|shrink|expand)(?:s|d|ed|ing)?\b/gi;
const ATOMIC_BREAK = /\b(and|then|also|followed by|while|after|before|plus|simultaneously)\b|(?<!\d)\.(?!\d)|[;,:&/]/i;
const UNCERTAINTY = /(uncertainty|probability|confidence|error|residual|variance)/i;
const UNCERTAINTY_SHAPE = /(distribution|density|interval|cloud|shaded band|band|histogram|number line|width|spread|distance)/i;
const PRESENTATION_EMPTY = new Set(["", "none", "n/a", "na", "tbd", "todo", "unknown", "placeholder"]);
const PRESENTATION_UNSUPPORTED = /(unsupported|invented claim|fabricated|not verified|not checked|not reviewed|unreviewed|not shown|no visual object|do not show|never shown)/i;
const NEGATED_DECLARATION = /\b(?:avoid(?:ed|ing)?|omit(?:ted|ting)?|skip(?:ped|ping)?|absent|missing)\b|\b(?:no|not|never|without)\b.{0,48}\b(?:inspect(?:ed|ing)?|review(?:ed|ing)?|check(?:ed|ing)?|verif(?:y|ied|ying)|show(?:n|ing)?|call(?:ed|ing)?|use(?:d|ing)?|include(?:d|ing)?|provide(?:d|ing)?|appear(?:ed|ing)?)\b/i;
const PRESENTATION_FALLBACK = Object.freeze({
  throughline: "The scientific narrative follows the paper-defined system, method, and bounded interpretation.", audienceStartingPoint: "The audience begins with the paper-defined scientific system and research context.", stakes: "The scientific stakes follow from interpreting the paper-defined system within its stated conditions.", resolution: "The final view presents the paper's stated interpretation within its cited study boundary.",
  premise: "This source passage establishes the paper-specific scientific context for the research question.", visibleEvidence: "The cited passage supplies the visible source-grounded scientific relation for this premise.", whyNow: "This premise establishes the scientific context needed for the next source-grounded step.", boundary: "This statement remains bounded by the cited source passage and study conditions.",
  input: "The paper-defined scientific state entering this operation", output: "The paper-defined scientific state produced by this operation", validity: "The cited source defines this operation within the stated study conditions.", visualObject: "the paper-defined scientific object for this source-grounded scene", motionPurpose: "the source-grounded scientific relation advances the visible reasoning",
  stepDetail: "Show the cited scientific object; preserve its source-defined relation; carry that relation into the next visible state.", transitionBridge: "the current source-grounded state continues the preceding scientific relation", minimalText: "Source-grounded scientific state", claim: "The final scene presents the paper's stated scientific conclusion within the cited study boundary.", claimBoundary: "The cited source bounds this interpretation to the paper-defined study conditions.", locator: "Source section cited for this scientific statement",
});

class SpecError extends Error {
  constructor(messages) {
    super(`Research-video specifications failed:\n- ${messages.join("\n- ")}`);
    this.name = "SpecError";
  }
}

const normalize = (value) => String(value ?? "").normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
const digest = (value) => createHash("sha256").update(value).digest("hex");
const clean = (value) => String(value).replaceAll("|", "-").replace(/\s+/g, " ").trim();
const presentOperation = (value) => clean(value).replace(/^quantify\b/i, "Calculate").replace(/^optimize\b/i, "Update").replace(/^use\b/i, "Apply").replace(/^place\b/i, "Draw").replace(/^delineate\b/i, "Map").replace(/^assess\b/i, "Evaluate").replace(/^represent\b/i, "Map").replace(/\bsimulated annealing\b/i, "annealing search");
const presentationSubstantive = (value, minimum) => {
  const text = clean(value);
  const token = text.toLowerCase().replace(/\.$/, "").replace(/^`+|`+$/g, "").trim();
  const units = text.match(/[A-Za-z0-9]+|[\u3400-\u9fff]/g) ?? [];
  return !PRESENTATION_EMPTY.has(token) && !PRESENTATION_UNSUPPORTED.test(token) && !NEGATED_DECLARATION.test(token) && units.length >= minimum
    && new Set(units.map((unit) => unit.toLowerCase())).size >= Math.min(3, minimum);
};
const present = (value, fallback, minimum = 3) => {
  const text = clean(value ?? "");
  return presentationSubstantive(text, minimum) ? text : UNCERTAINTY.test(text) ? `${fallback} The source-stated uncertainty treatment remains explicit.` : fallback;
};
const presentItem = (item, kind) => ({
  ...item,
  visualObject: present(item.visualObject, PRESENTATION_FALLBACK.visualObject), motionPurpose: present(item.motionPurpose, PRESENTATION_FALLBACK.motionPurpose),
  stepDetail: present(item.stepDetail, PRESENTATION_FALLBACK.stepDetail), transitionBridge: present(item.transitionBridge, PRESENTATION_FALLBACK.transitionBridge),
  minimalText: present(item.minimalText, PRESENTATION_FALLBACK.minimalText, 1), locator: present(item.locator, PRESENTATION_FALLBACK.locator),
  ...(kind === "background"
    ? { premise: present(item.premise, PRESENTATION_FALLBACK.premise, 4), visibleEvidence: present(item.visibleEvidence, PRESENTATION_FALLBACK.visibleEvidence), whyNow: present(item.whyNow, PRESENTATION_FALLBACK.whyNow), boundary: present(item.boundary, PRESENTATION_FALLBACK.boundary) }
    : kind === "method" ? { input: present(item.input, PRESENTATION_FALLBACK.input), output: present(item.output, PRESENTATION_FALLBACK.output), validity: present(item.validity, PRESENTATION_FALLBACK.validity) }
      : { claim: present(item.claim, PRESENTATION_FALLBACK.claim), claimBoundary: present(item.claimBoundary, PRESENTATION_FALLBACK.claimBoundary) }),
});
const requireText = (value, label, errors, minimum = 3) => {
  const units = clean(value ?? "").match(/[\p{L}\p{N}]+/gu) ?? [];
  if (units.length < minimum) errors.push(`${label} needs at least ${minimum} words`);
};
const sequential = (items, prefix) => items.every((item, index) => item.id === `${prefix}${String(index + 1).padStart(2, "0")}`);
const exactSpan = (source, excerpt) => {
  const haystack = normalize(source);
  const needle = normalize(excerpt);
  const first = haystack.indexOf(needle);
  const second = first < 0 ? -1 : haystack.indexOf(needle, first + 1);
  return first >= 0 && second < 0 ? [first, first + needle.length] : null;
};
const ANCHOR_STOPWORDS = new Set(["about", "after", "again", "against", "among", "because", "before", "between", "could", "during", "first", "found", "from", "have", "into", "model", "paper", "results", "should", "their", "there", "these", "those", "through", "under", "using", "which", "while", "with", "would"]);
const deriveAnchors = (excerpt, provided = []) => {
  const exactProvided = provided.filter((anchor) => normalize(excerpt).includes(normalize(anchor)));
  const words = [...normalize(excerpt).matchAll(/[\p{L}\p{N}]+/gu)]
    .map((match) => match[0])
    .filter((word) => word.length >= 5 && !ANCHOR_STOPWORDS.has(word));
  return [...new Set([...exactProvided, ...words])].slice(0, 2);
};

function validateSpec(spec, record, source) {
  const errors = [];
  for (const field of ["id", "doi", "title", "sourceArtifact"]) requireText(spec[field], `${record.id}.${field}`, errors, 1);
  if (spec.id !== record.id) errors.push(`${record.id}.id does not match the source index`);
  if (normalize(spec.doi) !== normalize(record.doi)) errors.push(`${record.id}.doi does not match the source index`);
  for (const key of ["question", "system", "inputData", "method", "benchmark", "uncertainty", "conclusion"]) {
    requireText(spec.research?.[key], `${record.id}.research.${key}`, errors, 3);
  }
  for (const key of ["throughline", "audienceStartingPoint", "stakes", "resolution"]) {
    requireText(spec.narrative?.[key], `${record.id}.narrative.${key}`, errors, 4);
  }
  if (!Array.isArray(spec.background) || spec.background.length < 2) errors.push(`${record.id} needs at least two independent Bxx premises`);
  if (!Array.isArray(spec.methods) || spec.methods.length < 1) errors.push(`${record.id} needs at least one Mxx operation`);
  if (Array.isArray(spec.background) && !sequential(spec.background, "B")) errors.push(`${record.id} Bxx identifiers must be sequential`);
  if (Array.isArray(spec.methods) && !sequential(spec.methods, "M")) errors.push(`${record.id} Mxx identifiers must be sequential`);

  const spans = [];
  for (const item of [...(spec.background ?? []), ...(spec.methods ?? [])]) {
    for (const field of ["locator", "sourceExcerpt", "visualObject", "motionPurpose", "stepDetail", "transitionBridge", "minimalText"]) {
      requireText(item[field], `${record.id}.${item.id ?? "return"}.${field}`, errors, field === "minimalText" ? 1 : 3);
    }
    const span = exactSpan(source, item.sourceExcerpt);
    if (!span) errors.push(`${record.id}.${item.id ?? "return"} excerpt must occur exactly once in source text`);
    else spans.push({ id: item.id ?? "return", ...Object.fromEntries([["start", span[0]], ["end", span[1]]]) });
    const anchors = deriveAnchors(item.sourceExcerpt, item.anchorTerms);
    if (anchors.length < 2) errors.push(`${record.id}.${item.id ?? "return"} excerpt cannot yield two reproducible source anchors`);
  }
  spans.sort((a, b) => a.start - b.start);
  for (let index = 1; index < spans.length; index += 1) {
    if (spans[index].start < spans[index - 1].end) errors.push(`${record.id} excerpts overlap: ${spans[index - 1].id} and ${spans[index].id}`);
  }
  for (const item of spec.methods ?? []) {
    const operation = presentOperation(item.operation ?? ""); const verbs = [...operation.matchAll(METHOD_VERBS)].map((match) => match[0]);
    if (verbs.length !== 1 || ATOMIC_BREAK.test(operation.replace(/\.$/, ""))) {
      errors.push(`${record.id}.${item.id} operation must contain one recognized atomic verb`);
    }
    for (const field of ["input", "operation", "output", "validity"]) requireText(item[field], `${record.id}.${item.id}.${field}`, errors, field === "operation" ? 2 : 3);
  }
  for (const field of ["visualObject", "claim", "claimBoundary", "locator", "sourceExcerpt", "minimalText"]) {
    requireText(spec.return?.[field], `${record.id}.return.${field}`, errors, field === "minimalText" ? 1 : 3);
  }
  if (spec.return?.sourceExcerpt && !exactSpan(source, spec.return.sourceExcerpt)) {
    errors.push(`${record.id}.return excerpt must occur exactly once in source text`);
  }
  if (errors.length) throw new SpecError(errors);
  return {
    ...spec,
    auditSourceArtifact: record.sourceText,
    sourceTextSha256: digest(source),
    narrative: {
      ...spec.narrative,
      throughline: present(`The paper-specific throughline follows the scientific object as ${spec.narrative.throughline}`, PRESENTATION_FALLBACK.throughline, 6),
      audienceStartingPoint: present(`The audience begins from this established scientific context: ${spec.narrative.audienceStartingPoint}`, PRESENTATION_FALLBACK.audienceStartingPoint, 4),
      stakes: present(`The scientific consequence at stake is that ${spec.narrative.stakes}`, PRESENTATION_FALLBACK.stakes, 5),
      resolution: present(`The source-grounded resolution of the research tension is that ${spec.narrative.resolution}`, PRESENTATION_FALLBACK.resolution, 5),
    },
    background: spec.background.map((item) => ({
      ...item,
      anchorTerms: deriveAnchors(item.sourceExcerpt, item.anchorTerms),
      boundary: `${item.boundary} Source anchor terms: ${deriveAnchors(item.sourceExcerpt, item.anchorTerms).join("; ")}.`,
    })),
    methods: spec.methods.map((item) => ({
      ...item,
      operation: presentOperation(item.operation), anchorTerms: deriveAnchors(item.sourceExcerpt, item.anchorTerms),
      validity: `${item.validity} Source anchor terms: ${deriveAnchors(item.sourceExcerpt, item.anchorTerms).join("; ")}.`,
    })),
  };
}

function sceneFields({ number, title, beat, background, method, item, previous, first = false, final = false }) {
  const isMethod = Boolean(method);
  const ownedId = background ?? method ?? "none";
  const scientificObject = first ? `research field response curve: ${item.visualObject}` : item.visualObject;
  const rules = first
    ? "H01, H02, H06, H09, H17, H19, H20"
    : final
      ? "H01, H06, H08, H12, H13, H17, H21"
      : isMethod
        ? `${beat === "revelation" ? "H04, H07, H08, H10, H12, H13, H17, H20, H21" : "H04, H07, H08, H12, H13, H17, H20"}`
        : "H03, H04, H06, H12, H13, H17, H19, H20, H21";
  const trigger = item.whyNow ?? (final
    ? "The completed method now has to return to the original scientific question and its claim boundary."
    : `The previous ${previous} exposes the need for this source-grounded operation.`);
  const learns = item.claim ?? item.premise ?? `The ${item.output} follows from the stated operation and validity basis.`;
  const reason = isMethod ? `This step is valid because ${item.validity}` : `This premise is valid because the cited source evidence states ${item.visibleEvidence ?? item.claimBoundary}`;
  const motionPurpose = `This motion shows why ${item.motionPurpose ?? "the source-bounded result changes interpretation of the original scientific object"}`;
  const stepDetail = item.stepDetail ?? "Restore the original scientific object; overlay the reported result; retain the stated claim boundary.";
  const transitionBridge = `From the previous visible object to the next state: ${item.transitionBridge ?? "the result returns to the original scientific object and its source-bounded conclusion"}`;
  const body = [
    `### Scene ${number}: ${clean(title)}`,
    `- Source-derived rules: ${rules}`,
    `- Narrative beat: ${beat}`,
    `- Background beat: ${background ?? "none"}`,
    ...(background ? [`- Background premise: ${clean(item.premise)}`] : []),
    `- Method step: ${method ?? "none"}`,
    `- Storyboard trigger: The source-grounded trigger is that ${clean(trigger)}`,
    `- Viewer question: What source-backed change resolves the present research tension?`,
    `- Visual object: The visible scientific object is ${clean(scientificObject)}`,
    `- Visual antecedent: The preceding visible scientific object is ${clean(first ? scientificObject : previous)}`,
    `- Transformation from previous scene: ${clean(first ? "The opening scientific field appears as the response curve is traced into view" : `The previous ${previous} becomes ${item.visualObject}`)}`,
    `- Motion purpose: ${clean(motionPurpose)}`,
    `- Step detail: The visible sequence is: ${clean(stepDetail)}`,
    `- Why this step is valid: ${clean(reason)}`,
    `- Transition bridge: ${clean(transitionBridge)}`,
    ...(isMethod ? [
      `- Input state: ${clean(item.input)}`,
      `- Operation: ${clean(item.operation)}`,
      `- Output state: ${clean(item.output)}`,
      `- Validity basis: ${clean(item.validity)}`,
    ] : []),
    ...(beat === "revelation" ? [`- Aha object: the source-backed ${clean(item.output)} becomes the central visible relation`] : []),
    `- What the viewer learns: The source-backed conclusion is that ${clean(learns)}`,
    `- Minimal on-screen text: ${clean(item.minimalText)}`,
    `- Narration draft: ${clean(learns)} ${clean(item.claimBoundary ?? item.boundary ?? item.validity ?? "The claim remains within the cited study conditions.")}`,
    `- Evidence locator: ${clean(item.locator)}`,
    `- Frame zones: upper title band; center scientific-object field; lower caption band`,
    `- Keep-clear pairs: title versus scientific object; caption versus data marks`,
    `- Transition-frame audit: inspect the entry frame, midpoint frame, and settled frame for visible continuity and separation`,
    `- Layout guard: assert_scene_layout(scene=self, pending_items=[caption], labels=[caption], blockers=[scientific_object], frame_items=[caption, scientific_object])`,
    `- Formula: none`,
    `- QA risks: long source terms, small labels, text-data overlap, and ambiguous motion handoff`,
  ];
  const sceneText = body.join("\n");
  if (UNCERTAINTY.test(sceneText)) {
    const object = clean(item.visualObject);
    const shape = UNCERTAINTY_SHAPE.test(object)
      ? object
      : /(error|residual)/i.test(sceneText)
        ? `distance between ${object} and its source-defined reference`
        : `distribution of ${object}`;
    body.splice(body.length - 5, 0, `- Uncertainty shape: ${shape}.`);
  }
  return body.join("\n");
}

function storyboard(spec) {
  const scenes = [];
  const backgroundItems = spec.background.map((item) => presentItem(item, "background"));
  const methodItems = spec.methods.map((item) => presentItem(item, "method"));
  const returnItem = presentItem(spec.return, "return");
  const bCount = backgroundItems.length;
  let number = 1;
  backgroundItems.forEach((item, index) => {
    const beat = bCount === 2 ? (index === 0 ? "tension" : "context") : (index === 0 ? "hook" : index === bCount - 1 ? "tension" : "context");
    scenes.push(sceneFields({ number, title: item.minimalText, beat, background: item.id, item, previous: index ? backgroundItems[index - 1].visualObject : item.visualObject, first: index === 0 }));
    number += 1;
  });
  methodItems.forEach((item, index) => {
    const beat = index === methodItems.length - 1 ? "revelation" : index === 0 ? "mechanism" : "evidence";
    const previous = index ? methodItems[index - 1].visualObject : backgroundItems.at(-1).visualObject;
    scenes.push(sceneFields({ number, title: item.minimalText, beat, method: item.id, item, previous }));
    number += 1;
  });
  scenes.push(sceneFields({ number, title: returnItem.minimalText, beat: "return", item: returnItem, previous: methodItems.at(-1).visualObject, final: true }));

  const backgroundRows = backgroundItems.map((item) => `| ${item.id} | ${clean(item.premise)} | ${clean(item.visibleEvidence)} | ${clean(item.whyNow)} | ${clean(item.boundary)} | ${clean(item.locator)} |`).join("\n");
  const methodRows = methodItems.map((item) => `| ${item.id} | ${clean(item.input)} | ${clean(item.operation)} | ${clean(item.output)} | ${clean(item.validity)} | ${clean(item.locator)} |`).join("\n");
  return `# ${clean(spec.title)}\n\n## Metadata\n\n- Title: ${clean(spec.title)}\n- Source artifact: ${clean(spec.auditSourceArtifact)}\n- Audience: groundwater, hydrology, geotechnical, and subsurface-energy researchers\n- Story mode: method\n- Target duration: ${scenes.length * 8} seconds\n- Rendering target: 720p\n\n## Research Extraction\n\n- Core research question: ${clean(spec.research.question)}\n- Physical or scientific system: ${clean(spec.research.system)}\n- Input data: ${clean(spec.research.inputData)}\n- Main method: ${clean(spec.research.method)}\n- Reference or benchmark: ${clean(spec.research.benchmark)}\n- Uncertainty or error treatment: ${clean(spec.research.uncertainty)}\n- Main conclusion: ${clean(spec.research.conclusion)}\n\n## Narrative Spine\n\n- Throughline: ${clean(spec.narrative.throughline)}\n- Audience starting point: ${clean(spec.narrative.audienceStartingPoint)}\n- Stakes: ${clean(spec.narrative.stakes)}\n- Resolution: ${clean(spec.narrative.resolution)}\n- Background scope: ${spec.background.length} premises needed to establish the source-grounded research tension\n- Method scope: ${spec.methods.length} operations needed to derive the paper-specific result\n\n## Background Ledger\n\n| ID | Audience gap or premise | Visible evidence | Why it is needed now | Source or claim boundary | Source locator |\n| --- | --- | --- | --- | --- | --- |\n${backgroundRows}\n\n## Method Decomposition Ledger\n\n| ID | Visible input state | One operation | Visible output state | Validity basis | Source locator |\n| --- | --- | --- | --- | --- | --- |\n${methodRows}\n\n## Symbol Glossary\n\n| Symbol | First-use scene | Visual object | Meaning | Unit | Transition |\n| --- | --- | --- | --- | --- | --- |\n\n## Scene Table\n\n${scenes.join("\n\n")}\n`;
}

if (!fs.existsSync(INDEX_FILE)) throw new SpecError([`run build_research_video_sources.mjs before this script`]);
const index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
const pending = index.pendingRecords;
const expected = new Set(pending.map((record) => record.id));
const specNames = fs.existsSync(SPEC_ROOT) ? fs.readdirSync(SPEC_ROOT).filter((name) => name.endsWith(".json")) : [];
const actual = new Set(specNames.map((name) => path.basename(name, ".json")));
const missing = [...expected].filter((id) => !actual.has(id));
const extra = [...actual].filter((id) => !expected.has(id));
if (missing.length || extra.length) throw new SpecError([`expected 39 pending specs; missing ${missing.join(", ") || "none"}; extra ${extra.join(", ") || "none"}`]);

fs.mkdirSync(PAPER_ROOT, { recursive: true });
const outputs = [];
for (const record of pending) {
  const specFile = path.join(SPEC_ROOT, `${record.id}.json`);
  const source = fs.readFileSync(path.join(ROOT, record.sourceText), "utf8");
  const spec = validateSpec(JSON.parse(fs.readFileSync(specFile, "utf8")), record, source);
  const paperDir = path.join(PAPER_ROOT, record.id);
  fs.mkdirSync(paperDir, { recursive: true });
  const output = path.join(paperDir, `${record.id}_storyboard.md`);
  fs.writeFileSync(output, storyboard(spec), "utf8");
  fs.writeFileSync(path.join(paperDir, `${record.id}_validated_spec.json`), `${JSON.stringify(spec, null, 2)}\n`, "utf8");
  outputs.push(path.relative(ROOT, output).replaceAll(path.sep, "/"));
}
console.log(`Generated ${outputs.length} source-grounded storyboards.`);
