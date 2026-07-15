import { advancedSemanticVisualExpression } from "./research_video_advanced_semantic_visuals.mjs";
import { specializedVisualExpression } from "./research_video_specialized_visuals.mjs";
import { paperVisualExpression as paper20160741Visual } from "./research_video_paper_2016_07_41.mjs";
import { paperVisualExpression as paper20221229Visual } from "./research_video_paper_2022_12_29.mjs";
import { paperVisualExpression as paper20240223Visual } from "./research_video_paper_2024_02_23.mjs";
import { paperVisualExpression as paper20240916Visual } from "./research_video_paper_2024_09_16.mjs";
import { paperVisualExpression as paper2025079Visual } from "./research_video_paper_2025_07_9.mjs";
import { renderPaperVisual2017_06_40 } from "./research_video_paper_2017_06_40.mjs";
import { renderPaperVisual2019_04_38 } from "./research_video_paper_2019_04_38.mjs";
import { renderPaperVisual2019_08_37 } from "./research_video_paper_2019_08_37.mjs";
import { renderPaperVisual2020_02_36 } from "./research_video_paper_2020_02_36.mjs";
import { renderPaperVisual2020_03_35 } from "./research_video_paper_2020_03_35.mjs";
import { renderPaperVisual2020_07_34 } from "./research_video_paper_2020_07_34.mjs";
import { renderPaperVisual2021_07_33 } from "./research_video_paper_2021_07_33.mjs";
import { renderPaperVisual2022_03_32 } from "./research_video_paper_2022_03_32.mjs";
import { renderPaperVisual2022_07_31 } from "./research_video_paper_2022_07_31.mjs";
import { renderPaperVisual2022_12_30 } from "./research_video_paper_2022_12_30.mjs";
import { renderPaperVisual2023_01_28 } from "./research_video_paper_2023_01_28.mjs";
import { renderPaperVisual2023_04_27 } from "./research_video_paper_2023_04_27.mjs";
import { renderPaperVisual2023_05_26 } from "./research_video_paper_2023_05_26.mjs";
import { renderPaperVisual2023_07_25 } from "./research_video_paper_2023_07_25.mjs";
import { renderPaperVisual2023_09_24 } from "./research_video_paper_2023_09_24.mjs";
import { renderPaperVisual2024_02_22 } from "./research_video_paper_2024_02_22.mjs";
import { renderPaperVisual2024_05_21 } from "./research_video_paper_2024_05_21.mjs";
import { renderPaperVisual2024_06_19 } from "./research_video_paper_2024_06_19.mjs";
import { renderPaperVisual2024_06_20 } from "./research_video_paper_2024_06_20.mjs";
import { renderPaperVisual2025_05_12 } from "./research_video_paper_2025_05_12.mjs";
import { renderPaperVisual2026_01_3 } from "./research_video_paper_2026_01_3.mjs";

const PAPER_VISUALS = [
  ["2016-07-41", paper20160741Visual],
  ["2017-06-40", renderPaperVisual2017_06_40],
  ["2019-04-38", renderPaperVisual2019_04_38],
  ["2019-08-37", renderPaperVisual2019_08_37],
  ["2020-02-36", renderPaperVisual2020_02_36],
  ["2020-03-35", renderPaperVisual2020_03_35],
  ["2020-07-34", renderPaperVisual2020_07_34],
  ["2021-07-33", renderPaperVisual2021_07_33],
  ["2022-03-32", renderPaperVisual2022_03_32],
  ["2022-07-31", renderPaperVisual2022_07_31],
  ["2022-12-29", paper20221229Visual],
  ["2022-12-30", renderPaperVisual2022_12_30],
  ["2023-01-28", renderPaperVisual2023_01_28],
  ["2023-04-27", renderPaperVisual2023_04_27],
  ["2023-05-26", renderPaperVisual2023_05_26],
  ["2023-07-25", renderPaperVisual2023_07_25],
  ["2023-09-24", renderPaperVisual2023_09_24],
  ["2024-02-22", renderPaperVisual2024_02_22],
  ["2024-02-23", paper20240223Visual],
  ["2024-05-21", renderPaperVisual2024_05_21],
  ["2024-06-19", renderPaperVisual2024_06_19],
  ["2024-06-20", renderPaperVisual2024_06_20],
  ["2024-09-16", paper20240916Visual],
  ["2025-05-12", renderPaperVisual2025_05_12],
  ["2025-07-9", paper2025079Visual],
  ["2026-01-3", renderPaperVisual2026_01_3],
];

const KINDS = [
  ["fault", /fault|fracture|laminat|discontinu|shear zone|interface diagram|interface line/],
  ["island", /island|coast|freshwater lens|saltwater|seawater|shore|kinmen/],
  ["forest", /forest|decision tree|ensemble branch|branch prediction/],
  ["sensitivity", /sensitivity|morris|sobol|\bpsf\b|\bnsf\b|parameter importance|elementary effect|attribution bar|feature importance|perturb.*normalize/],
  ["residual", /residual|error stem|difference stem|misfit|fit error|\bsee\b|\bmse\b|\bmae\b|\brmse\b|discrepancy/],
  ["scatter", /scatter|one[- ]to[- ]one|1\s*:\s*1|versus|correlation plot|accuracy points/],
  ["pulse", /pulse|lag bracket|time offset|impulse|delay clock|shift.*time tick/],
  ["distribution", /distribution|density|posterior|credible|interval|bootstrap|sample cloud|histogram|uncertainty/],
  ["matrix", /matrix|heatmap|mesh|pixel|covariance|correlation matrix|nodal mesh/],
  ["map", /map|contour|spatial field|parameter field|station marker|well field|shoreline|coastline|boundary node|image well|coordinate grid|geophysical patch|basin-wide|geospatial|geo field/],
  ["equation", /equation|bessel|laplace|root|infinite series|analytical expression|governing equation|transform panel|transform plane|p-plane|spectra|cosine modes|weber kernel|taylor terms|coefficient markers|derivative terms|solve the .*problem|inverse .*formula/],
  ["plume", /plume|breakthrough|\bbtc\b|contaminant|solute transport/],
  ["curve", /curve|profile|hydrograph|time series|trace|drawdown|head response|temperature|breakpoint|observation|fitted|fit score|variogram/],
  ["system", /well|aquifer|soil|liner|stream|borehole|\bbhe\b|pile|cylinder|layer|recharge|groundwater|column|reservoir|channel|pore|control volume/],
];

const PALETTES = [
  ["#6B7C85", "#B9C5CA", "#E8EEF0"],
  ["#137C8B", "#5DB7C4", "#D9F0F2"],
  ["#B5523A", "#E49A73", "#F8E3D8"],
];

const EXACT_EQUATION_SPECIALIST = /control strip|flux samples|head traces?.*jump|annular|outer-boundary|outer boundary|remote robin|finite radial aquifer|finite two-zone aquifer|aquifer disk.*boundary|paired radial temperature plumes|soil column|porous column|lysimeter|infiltration tank|geomembrane|soil liner|thermometer string|axisymmetric|hollow cylinder|inject-rest-extract/;

const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));

function semanticText(description, stepDetail = "") {
  const parts = typeof description === "object" && description !== null
    ? [description.visualObject, description.stepDetail, stepDetail]
    : [description, stepDetail];
  return parts.filter(Boolean).join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

const MATH_TEX_ARGUMENT_LIMIT = 96;
const PYTHON_STRING_PREFIXES = new Set(["", "r", "u", "ru", "ur"]);
const MAJOR_LATEX_OPERATORS = new Set([
  "int", "iint", "iiint", "oint", "sum", "prod", "coprod", "lim", "min", "max", "inf", "sup",
]);
const LATEX_SEPARATORS = new Set([
  "quad", "qquad", "Rightarrow", "Longrightarrow", "rightarrow", "longrightarrow", "implies", "iff",
]);

function quotedStringEnd(source, quoteStart) {
  const quote = source[quoteStart];
  const triple = source.slice(quoteStart, quoteStart + 3) === quote.repeat(3);
  const delimiterLength = triple ? 3 : 1;
  for (let index = quoteStart + delimiterLength; index < source.length;) {
    if (source[index] === "\\") {
      index += 2;
    } else if (source.slice(index, index + delimiterLength) === quote.repeat(delimiterLength)) {
      return index + delimiterLength;
    } else {
      index += 1;
    }
  }
  throw new Error("Unterminated Python string in generated MathTex expression");
}

function pythonStringAt(source, start) {
  let quoteStart = start;
  while (/[A-Za-z]/.test(source[quoteStart] ?? "")) quoteStart += 1;
  const prefix = source.slice(start, quoteStart).toLowerCase();
  if (!PYTHON_STRING_PREFIXES.has(prefix) || !["\"", "'"].includes(source[quoteStart])) return null;
  const end = quotedStringEnd(source, quoteStart);
  const quoteLength = source.slice(quoteStart, quoteStart + 3) === source[quoteStart].repeat(3) ? 3 : 1;
  const encoded = source.slice(quoteStart + quoteLength, end - quoteLength);
  if (prefix.includes("r")) return { end, value: encoded };
  if (source[quoteStart] === "\"" && quoteLength === 1) {
    return { end, value: JSON.parse(source.slice(quoteStart, end)) };
  }
  const escapes = { a: "\x07", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\x0b", "\\": "\\", "\"": "\"", "'": "'" };
  let value = "";
  for (let index = 0; index < encoded.length; index += 1) {
    if (encoded[index] !== "\\" || index + 1 >= encoded.length) {
      value += encoded[index];
      continue;
    }
    const escaped = encoded[index + 1];
    if (Object.hasOwn(escapes, escaped)) {
      value += escapes[escaped];
      index += 1;
    } else {
      value += `\\${escaped}`;
      index += 1;
    }
  }
  return { end, value };
}

function callEnd(source, openParen) {
  const closing = { "(": ")", "[": "]", "{": "}" };
  const stack = [")"];
  for (let index = openParen + 1; index < source.length;) {
    const character = source[index];
    if (character === "\"" || character === "'") {
      index = quotedStringEnd(source, index);
    } else if (character === "#") {
      const newline = source.indexOf("\n", index);
      index = newline < 0 ? source.length : newline + 1;
    } else if (Object.hasOwn(closing, character)) {
      stack.push(closing[character]);
      index += 1;
    } else if (character === stack.at(-1)) {
      stack.pop();
      if (!stack.length) return index;
      index += 1;
    } else {
      index += 1;
    }
  }
  throw new Error("Unbalanced Python call in generated MathTex expression");
}

function hasTopLevelKeyword(source, start, end, keyword) {
  const closing = { "(": ")", "[": "]", "{": "}" };
  const stack = [];
  for (let index = start; index < end;) {
    const character = source[index];
    if (character === "\"" || character === "'") {
      index = quotedStringEnd(source, index);
    } else if (Object.hasOwn(closing, character)) {
      stack.push(closing[character]);
      index += 1;
    } else if (character === stack.at(-1)) {
      stack.pop();
      index += 1;
    } else if (!stack.length && /[A-Za-z_]/.test(character)) {
      let identifierEnd = index + 1;
      while (/\w/.test(source[identifierEnd] ?? "")) identifierEnd += 1;
      let equals = identifierEnd;
      while (/\s/.test(source[equals] ?? "")) equals += 1;
      if (source.slice(index, identifierEnd) === keyword && source[equals] === "=") return true;
      index = identifierEnd;
    } else {
      index += 1;
    }
  }
  return false;
}

function latexCandidates(expression, start, end) {
  const candidates = [];
  let depth = 0;
  const add = (position, rank) => {
    if (position > start && position < end) candidates.push({ position, rank });
  };
  for (let index = start; index < end;) {
    const character = expression[index];
    if (character === "\\") {
      let commandEnd = index + 1;
      if (/[A-Za-z]/.test(expression[commandEnd] ?? "")) {
        while (/[A-Za-z]/.test(expression[commandEnd] ?? "")) commandEnd += 1;
      } else {
        commandEnd += 1;
      }
      if (depth === 0) {
        const command = expression.slice(index + 1, commandEnd);
        add(index, MAJOR_LATEX_OPERATORS.has(command) ? 0 : 2);
        if (LATEX_SEPARATORS.has(command)) add(commandEnd, 0);
      }
      index = commandEnd;
    } else if (character === "{") {
      depth += 1;
      index += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth < 0) throw new Error(`Unbalanced LaTeX braces: ${expression}`);
      if (depth === 0) {
        let next = index + 1;
        while (/\s/.test(expression[next] ?? "")) next += 1;
        if (expression[next] !== "{") add(index + 1, 3);
      }
      index += 1;
    } else if (depth === 0 && /\s/.test(character)) {
      let whitespaceEnd = index + 1;
      while (/\s/.test(expression[whitespaceEnd] ?? "")) whitespaceEnd += 1;
      add(whitespaceEnd, 1);
      index = whitespaceEnd;
    } else if (depth === 0 && "=,;+-".includes(character)) {
      add(index + 1, 0);
      index += 1;
    } else if (depth === 0 && /[A-Za-z0-9_.]/.test(character)) {
      let tokenEnd = index + 1;
      while (/[A-Za-z0-9_.]/.test(expression[tokenEnd] ?? "")) tokenEnd += 1;
      add(tokenEnd, 3);
      index = tokenEnd;
    } else {
      if (depth === 0) add(index + 1, 3);
      index += 1;
    }
  }
  if (depth !== 0) throw new Error(`Unbalanced LaTeX braces: ${expression}`);
  return candidates;
}

function splitLongLatex(expression, start, end) {
  const parts = [];
  let partStart = start;
  while (end - partStart > MATH_TEX_ARGUMENT_LIMIT) {
    const limit = partStart + MATH_TEX_ARGUMENT_LIMIT;
    const available = latexCandidates(expression, partStart, end)
      .filter(({ position }) => position <= limit && expression.slice(partStart, position).split("=").length - 1 <= 1);
    if (!available.length) {
      throw new Error(`Cannot split a balanced LaTeX term within ${MATH_TEX_ARGUMENT_LIMIT} characters: ${expression.slice(partStart, end)}`);
    }
    const bestRank = Math.min(...available.map(({ rank }) => rank));
    const splitAt = Math.max(...available.filter(({ rank }) => rank === bestRank).map(({ position }) => position));
    parts.push(expression.slice(partStart, splitAt));
    partStart = splitAt;
  }
  parts.push(expression.slice(partStart, end));
  return parts;
}

function splitLatexExpression(expression) {
  const candidates = latexCandidates(expression, 0, expression.length);
  const equalityEnds = [...new Set(candidates.filter(({ position }) => expression[position - 1] === "=").map(({ position }) => position))];
  const equalityCount = expression.split("=").length - 1;
  const mandatoryEnds = equalityCount > 1 ? [...equalityEnds, expression.length] : [expression.length];
  const parts = [];
  let start = 0;
  for (const end of mandatoryEnds) {
    parts.push(...splitLongLatex(expression, start, end));
    start = end;
  }
  const nonempty = parts.filter((part) => part.length > 0);
  if (nonempty.some((part) => part.length > MATH_TEX_ARGUMENT_LIMIT || part.split("=").length - 1 > 1)) {
    throw new Error(`Cannot isolate nested LaTeX equalities without changing grouping: ${expression}`);
  }
  return nonempty;
}

function preserveNestedEqualityGlyphs(expression) {
  let depth = 0;
  let result = "";
  for (const character of expression) {
    if (character === "{") depth += 1;
    if (character === "}") depth = Math.max(0, depth - 1);
    result += character === "=" && depth > 0 ? String.raw`\mathrel{\char61}` : character;
  }
  return result;
}

export function normalizeMathTexCalls(source) {
  const replacements = [];
  for (let index = 0; index < source.length;) {
    const character = source[index];
    if (character === "\"" || character === "'") {
      index = quotedStringEnd(source, index);
      continue;
    }
    if (!/[A-Za-z_]/.test(character)) {
      index += 1;
      continue;
    }
    let identifierEnd = index + 1;
    while (/\w/.test(source[identifierEnd] ?? "")) identifierEnd += 1;
    if (source.slice(index, identifierEnd) !== "MathTex") {
      index = identifierEnd;
      continue;
    }
    let openParen = identifierEnd;
    while (/\s/.test(source[openParen] ?? "")) openParen += 1;
    if (source[openParen] !== "(") {
      index = identifierEnd;
      continue;
    }
    const closeParen = callEnd(source, openParen);
    let firstStart = openParen + 1;
    while (/\s/.test(source[firstStart] ?? "")) firstStart += 1;
    const first = pythonStringAt(source, firstStart);
    if (first && (first.value.length > MATH_TEX_ARGUMENT_LIMIT || first.value.split("=").length - 1 > 1)) {
      const displayEquivalent = preserveNestedEqualityGlyphs(first.value);
      const parts = splitLatexExpression(displayEquivalent);
      replacements.push({ start: firstStart, end: first.end, value: parts.map((part) => JSON.stringify(part)).join(", ") });
      if (!hasTopLevelKeyword(source, openParen + 1, closeParen, "arg_separator")) {
        const trailingComma = source.slice(openParen + 1, closeParen).trimEnd().endsWith(",");
        replacements.push({ start: closeParen, end: closeParen, value: trailingComma ? ' arg_separator=""' : ', arg_separator=""' });
      }
    }
    index = identifierEnd;
  }
  return replacements.sort((left, right) => right.start - left.start).reduce(
    (result, replacement) => `${result.slice(0, replacement.start)}${replacement.value}${result.slice(replacement.end)}`,
    source,
  );
}

export function semanticVisualKind(description, stepDetail = "") {
  const visualObject = typeof description === "object" && description !== null
    ? semanticText(description.visualObject)
    : semanticText(String(description ?? "").split(/\.\s+/, 1)[0]);
  const primaryKind = KINDS.find(([, pattern]) => pattern.test(visualObject))?.[0];
  return primaryKind ?? KINDS.find(([, pattern]) => pattern.test(semanticText(description, stepDetail)))?.[0] ?? "workflow";
}

export function semanticVisualExpression(description, phase = 0, stepDetail = "") {
  const normalizedPhase = normalizePhase(phase);
  const palette = PALETTES[normalizedPhase];
  const text = semanticText(description, stepDetail);
  const kind = semanticVisualKind(description, stepDetail);
  const paperRenderer = PAPER_VISUALS.find(([id]) => text.includes(`[paper:${id}]`))?.[1];
  const paperContext = typeof description === "object" && description !== null
    ? { ...description, description: text, text, phase: normalizedPhase, palette }
    : { description: text, text, phase: normalizedPhase, palette };
  const paperSpecific = paperRenderer?.(paperContext, normalizedPhase, palette) ?? null;
  if (paperSpecific) return normalizeMathTexCalls(paperSpecific);
  const specialized = kind === "equation" && !EXACT_EQUATION_SPECIALIST.test(text)
    ? null
    : specializedVisualExpression(text, normalizedPhase, palette);
  if (specialized) return specialized;
  return advancedSemanticVisualExpression({
    kind,
    palette,
    phase: normalizedPhase,
    text,
  });
}

export function semanticFormulaExpression(description, phase = 0, stepDetail = "") {
  const text = semanticText(description, stepDetail);
  if (PAPER_VISUALS.some(([id]) => text.includes(`[paper:${id}]`))) return null;
  if (semanticVisualKind(description, stepDetail) !== "equation") return null;
  const formulas = /bessel/.test(text)
    ? [String.raw`J_0(\lambda r)`, String.raw`Y_0(\lambda r)`, String.raw`\bar{s}(r,p)=A J_0+B Y_0`]
    : /laplace/.test(text)
      ? [String.raw`s(r,t)`, String.raw`\mathcal{L}\{s\}=\bar{s}(r,p)`, String.raw`\bar{s}\longrightarrow s(r,t)`]
      : /root|series/.test(text)
        ? [String.raw`f(\lambda_n)=0`, String.raw`\sum_{n=1}^{\infty}a_n\phi_n`, String.raw`s=\sum_n a_n\phi_n`]
        : [String.raw`\nabla\!\cdot(K\nabla h)=S_s\partial_t h`, String.raw`T\nabla^2s=S\partial_t s`, String.raw`h(\mathbf{x},t)=h_0-s(\mathbf{x},t)`];
  return `MathTex(${JSON.stringify(formulas[normalizePhase(phase)])}, color="#102A35", font_size=34).move_to([4.35, 1.65, 0])`;
}
