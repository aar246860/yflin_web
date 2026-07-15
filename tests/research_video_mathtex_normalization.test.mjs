import assert from "node:assert/strict";
import test from "node:test";

import { normalizeMathTexCalls } from "../scripts/research_video_semantic_visuals.mjs";

const stringArguments = (call) => {
  const start = call.lastIndexOf("MathTex(") + "MathTex(".length;
  const end = call.indexOf(", color=", start);
  return JSON.parse(`[${call.slice(start, end)}]`);
};

const bracesAreBalanced = (value) => {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "\\") {
      index += 1;
    } else if (value[index] === "{") {
      depth += 1;
    } else if (value[index] === "}") {
      depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
};

const assertValidSplit = (source, expression) => {
  const normalized = normalizeMathTexCalls(source);
  const args = stringArguments(normalized);
  assert.equal(args.join("").replaceAll(String.raw`\mathrel{\char61}`, "="), expression);
  assert.ok(args.length > 1);
  for (const arg of args) {
    assert.ok(arg.length <= 96, `${arg.length}: ${arg}`);
    assert.ok(arg.split("=").length - 1 <= 1, arg);
    assert.ok(bracesAreBalanced(arg), arg);
  }
  assert.match(normalized, /arg_separator=""/);
  return normalized;
};

test("splits chained equalities into transformable terms", () => {
  const expression = "A=B=C";
  const normalized = assertValidSplit(
    'MathTex("A=B=C", color="#123456", font_size=31).move_to([1, 2, 0])',
    expression,
  );
  assert.equal(
    normalized,
    'MathTex("A=", "B=", "C", color="#123456", font_size=31, arg_separator="").move_to([1, 2, 0])',
  );
});

test("splits long integral and sum expressions at top-level operators", () => {
  const expression = String.raw`q(t)=\int_{0}^{t}\!K(t-\tau)f(\tau)\,d\tau\quad+\sum_{n=1}^{\infty}a_n\phi_n(r)\exp(-\lambda_n t)\qquad+\int_{r_w}^{R}g(\rho,t)\,d\rho`;
  assertValidSplit(`MathTex(${JSON.stringify(expression)}, color=INK, font_size=24)`, expression);
});

test("preserves escaped backslashes, quotes, and nested braces", () => {
  const expression = String.raw`F=\left\{\frac{\partial}{\partial r}\left(r\frac{\partial s}{\partial r}\right)\right\}\quad\mathrm{label\ \"quoted\"}=G`;
  assertValidSplit(`MathTex(${JSON.stringify(expression)}, color=INK, font_size=22)`, expression);
});

test("normalizes MathTex calls nested inside VGroup expressions", () => {
  const expression = "r=5,\\ z=12";
  const source = `VGroup(Text("MathTex(\\\"not a call\\\")"), MathTex(${JSON.stringify(expression)}, color=INK, font_size=20).move_to([0, 1, 0]), Circle())`;
  const normalized = normalizeMathTexCalls(source);
  assert.equal(stringArguments(normalized).join(""), expression);
  assert.match(normalized, /^VGroup\(Text\("MathTex\(/);
  assert.match(normalized, /MathTex\("r=", "5,\\\\ z=", "12", color=INK, font_size=20, arg_separator=""\)/);
});

test("leaves short formulas byte-for-byte unchanged", () => {
  const source = 'MathTex("h(r,t)=h_0-s(r,t)", color=INK, font_size=34).move_to([4.35, 1.65, 0])';
  assert.equal(normalizeMathTexCalls(source), source);
});
