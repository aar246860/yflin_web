const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const p = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dot = (at, color, radius = 0.09) => `Dot(${q(at)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, at, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.5) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const polygon = (points, stroke, fill, opacity = 0.5) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const arrow = (a, b, color, width = 4) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const tex = (value, at, color, size = 24) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;
const profile = (points, color, width = 4) => points.slice(0, -1).map((at, index) => line(at, points[index + 1], color, width));
const headCurve = (depth = 0) => [p(-2.7, -0.05), p(-2.0, 0.38 - depth), p(-1.1, 0.82 - depth), p(0, 1.05 - depth), p(1.1, 0.82 - depth), p(2.0, 0.38 - depth), p(2.7, -0.05)];
const lensCurve = (rise = 0) => [p(-2.8, -0.2), p(-2.0, -0.75), p(-1.0, -1.15), p(0.45, -1.28 + rise), p(1.15, -0.78 + rise * 0.55), p(2.1, -0.62), p(2.8, -0.2)];

function phaseOf(value) {
  const phase = Number(value);
  return Math.max(0, Math.min(2, Number.isFinite(phase) ? Math.trunc(phase) : 0));
}

function colorsOf(value) {
  const source = Array.isArray(value) ? value : DEFAULT_PALETTE;
  return DEFAULT_PALETTE.map((fallback, index) => String(source[index] ?? fallback));
}

function textOf(description) {
  const parts = typeof description === "object" && description !== null
    ? [description.marker, description.visualObject, description.stepDetail, description.visibleEvidence, description.motionPurpose, description.output, description.claim]
    : [description];
  return parts.filter((value) => typeof value === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

function crossSection(scene, phase, [accent, measured, pale]) {
  if (scene === "m06") {
    const items = [line(p(-3.05, 0), p(3.05, 0), measured, 3), ...profile(headCurve(0), accent, 5)];
    if (phase >= 1) items.push(arrow(p(0, 0.94), p(0, -1.17), accent, 5));
    if (phase === 2) items.push(...profile(lensCurve(0), measured, 5), polygon([p(-2.8, -0.2), ...lensCurve(0).slice(1, -1), p(2.8, -0.2)], measured, pale, 0.45), tex(String.raw`z=\alpha h`, p(1.65, -1.48), accent, 27));
    return field(items);
  }
  const stressed = scene === "b01" || scene === "return";
  const interfaceRise = stressed && phase > 0 ? 0.52 + phase * 0.12 : 0;
  const items = [line(p(-3.05, 0), p(3.05, 0), measured, 3), ...profile(headCurve(stressed && phase === 2 ? 0.16 : 0), accent, 4), ...profile(lensCurve(interfaceRise), measured, 5), polygon([p(-2.8, -0.2), ...lensCurve(interfaceRise).slice(1, -1), p(2.8, -0.2)], measured, pale, 0.45)];
  if (phase >= 1) items.push(line(p(0.65, 1.42), p(0.65, 0.25), accent, 6), arrow(p(0.65, 1.55), p(0.65, 0.72), accent, 5));
  if (scene === "return" && phase >= 1) {
    items.push(line(p(-0.75, 1.35), p(-0.75, 0.25), measured, 5), arrow(p(-2.1, 2.0), p(-2.1, 1.35), measured, 3), arrow(p(-1.15, 2.25), p(-1.15, 1.35), accent, 3), arrow(p(1.7, 1.85), p(1.7, 1.25), measured, 3));
  }
  if (phase === 2) {
    items.push(tex(scene === "return" ? String.raw`h=+\sqrt{h^2},\quad z=\alpha h` : String.raw`z\uparrow`, p(-1.7, -1.55), accent, scene === "return" ? 21 : 25));
    if (scene === "return") items.push(circle(0.26, p(-1.7, 0.58), accent, 3), circle(0.31, p(0, 0.62), measured, 3), circle(0.36, p(1.72, 0.55), accent, 3), tex(String.raw`V_Q\quad V_W\quad V_a`, p(0, 1.65), measured, 21));
  }
  return field(items);
}

function islandPlan(scene, phase, [accent, measured, pale]) {
  const items = [circle(2.25, p(0, 0), measured, 4, pale, 0.16)];
  const rings = phase === 0 ? [1.65] : phase === 1 ? [1.65, 1.05] : [1.65, 1.05, 0.48];
  items.push(...rings.map((radius, index) => circle(radius, p(0, 0), index === rings.length - 1 ? accent : measured, 2 + index)));
  if (scene === "b02") {
    items.splice(0, items.length, circle(1.35, p(-1.65, 0), measured, 4, pale, 0.18), circle(1.35, p(1.55, 0), measured, 4, pale, 0.18), ...[0.42, 0.78, 1.08].slice(0, phase + 1).map((r) => circle(r, p(-1.65, 0), accent, 2)));
    if (phase >= 1) items.push(dot(p(1.15, 0.25), accent, 0.14), circle(0.38 + phase * 0.18, p(1.15, 0.25), measured, 3));
    if (phase === 2) items.push(tex(String.raw`h(a)=0`, p(0, 1.7), accent, 24), tex("?", p(1.75, -0.55), accent, 30));
  } else if (scene === "m01") {
    if (phase >= 1) for (const x of [-1.4, -0.45, 0.45, 1.4]) items.push(arrow(p(x, 2.85), p(x, 2.25), measured, 3));
    if (phase === 2) items.push(tex(String.raw`h^2=\frac{W(a^2-r^2)}{2K(1+\alpha)}`, p(0, -2.72), accent, 23));
  } else if (scene === "m02") {
    const well = p(0.85, 0.45);
    if (phase >= 1) items.push(dot(well, accent, 0.16), arrow(p(0.85, 1.35), well, accent, 5));
    if (phase === 2) items.push(tex(String.raw`\delta(r-R)\delta(\theta-\phi)`, p(0, -2.7), accent, 24));
  } else if (scene === "m03") {
    const real = p(0.82, 0.48); const image = p(2.9, 1.7);
    items.push(dot(real, accent, 0.15), line(p(0, 0), p(3.15, 1.84), measured, 2));
    if (phase >= 1) items.push(dot(image, measured, 0.15), circle(0.28, image, measured, 3), line(real, image, accent, 3));
    if (phase === 2) items.push(tex(String.raw`R'=a^2/R`, p(1.75, 2.15), accent, 22), tex(String.raw`h_p^2=-\frac{Q_p}{\pi(1+\alpha)K}\ln\frac{ar_1}{Rr_2}`, p(0, -2.55), accent, 17));
  } else if (scene === "m04") {
    const wells = [p(-0.85, 0.45), p(0.72, -0.5), p(0.25, 0.9)].slice(0, phase + 1);
    items.push(...wells.flatMap((well, index) => [dot(well, accent, 0.13), circle(0.32 + index * 0.1, well, index === wells.length - 1 ? accent : measured, 3)]));
    if (phase === 2) items.push(tex(String.raw`h^2=\frac{W(a^2-r^2)}{2K(1+\alpha)}-\sum_i\frac{Q_{p,i}}{\pi(1+\alpha)K}\ln\frac{ar_{1,i}}{R_i r_{2,i}}`, p(0, -2.65), accent, 16));
  }
  return field(items);
}

function positiveRoot(phase, [accent, measured, pale]) {
  const squared = headCurve(0.2).map(([x, y]) => p(x, Math.max(-0.1, y * y + 0.05)));
  const positive = headCurve(0.05);
  const items = [line(p(-3, -0.15), p(3, -0.15), measured, 2), ...profile(squared, phase === 0 ? accent : pale, phase === 0 ? 5 : 3), tex(String.raw`h^2\ge0`, p(-2.25, 1.45), measured, 22)];
  if (phase >= 1) items.push(arrow(p(0, 1.48), p(0, 1.08), accent, 4), ...profile(positive, accent, 5));
  if (phase === 2) items.push(tex(String.raw`h=+\sqrt{h^2}`, p(1.7, 1.5), accent, 30), line(p(-2.6, -0.45), p(2.6, -0.45), pale, 3));
  return field(items);
}

function vulnerability(scene, phase, [accent, measured, pale]) {
  const stress = scene.endsWith("q") ? "q" : scene.endsWith("w") ? "w" : "a";
  const normalized = scene.startsWith("n");
  const formula = stress === "q" ? String.raw`\frac{\partial z}{\partial Q_{p,j}}` : stress === "w" ? String.raw`\frac{\partial z}{\partial W}` : String.raw`\frac{\partial z}{\partial a}`;
  const multiplier = stress === "q" ? String.raw`Q_{p,j}` : stress === "w" ? "W" : "a";
  const center = stress === "q" ? p(0.8, 0.35) : p(0, 0);
  const items = [circle(1.75, p(0, 0), measured, 4, pale, 0.18), dot(p(0.8, 0.35), accent, 0.12)];
  if (stress === "q") items.push(...[0.35, 0.7, 1.05].slice(0, phase + 1).map((r) => circle(r, center, accent, 2 + phase)));
  if (stress === "w") items.push(...[1.35, 0.95, 0.52].slice(0, phase + 1).map((r) => circle(r, center, r < 0.7 ? accent : measured, 3)));
  if (stress === "a") items.push(circle(1.82 + phase * 0.08, center, accent, 3 + phase), arrow(p(0, 0), p(1.7 + phase * 0.1, 0), accent, 3));
  if (phase >= 1) items.push(arrow(p(-2.65, 0), p(-1.85, 0), accent, 4));
  if (phase === 2) items.push(tex(normalized ? `${multiplier}${formula}` : formula, p(0, -2.15), accent, normalized ? 25 : 27), ...(normalized && stress === "a" ? [tex(String.raw`h=+\sqrt{h^2}`, p(0, 2.12), measured, 20)] : []));
  return field(items);
}

function vulnerabilityMaps(phase, [accent, measured, pale]) {
  const centers = [-2.15, 0, 2.15];
  const items = centers.map((x) => circle(0.78, p(x, 0), measured, 3, pale, 0.22));
  if (phase >= 1) items.push(...[0.25, 0.48].flatMap((r) => [circle(r, p(-2.35, 0.15), accent, 3), circle(r, p(0, 0), measured, 3), circle(0.72 + r * 0.08, p(2.15, 0), accent, 3)]));
  if (phase === 2) items.push(tex(String.raw`V_Q`, p(-2.15, -1.15), accent), tex(String.raw`V_W`, p(0, -1.15), measured), tex(String.raw`V_a`, p(2.15, -1.15), accent));
  return field(items);
}

function rechargeIntegral(phase, [accent, measured, pale]) {
  const cells = [];
  for (let row = 0; row < 4; row += 1) for (let col = 0; col < 5; col += 1) {
    const at = p(-1.5 + col * 0.72, 1.05 - row * 0.65);
    if (at[0] ** 2 + at[1] ** 2 < 3.2) cells.push(rect(0.6, 0.52, at, measured, [pale, accent, measured][(row + col) % 3], 0.5));
  }
  const items = [circle(1.95, p(0, 0), measured, 4), ...cells.slice(0, phase === 0 ? 6 : phase === 1 ? 12 : cells.length)];
  if (phase >= 1) items.push(...[0.28, 0.52, 0.78].slice(0, phase + 1).map((r) => circle(r, p(-0.75, 0.4), accent, 2)));
  if (phase === 2) items.push(tex(String.raw`h^2=\int_0^{2\pi}\!\int_0^a GW\,r_0dr_0d\theta_0`, p(0, -2.42), accent, 21));
  return field(items);
}

function finiteElement(scene, phase, [accent, measured, pale]) {
  const items = [circle(2.0, p(0, 0), measured, 4, pale, scene === "m16" && phase === 2 ? 0.28 : 0.08)];
  const span = 1.8;
  for (let i = -3; i <= 3; i += 1) {
    const offset = i * 0.45;
    items.push(line(p(-span, offset), p(span, -offset), phase === 2 && i % 2 === 0 ? accent : measured, 1.5));
    if (phase >= 1) items.push(line(p(offset, -span), p(-offset, span), measured, 1.2));
  }
  items.push(dot(p(-0.5, 0), accent, 0.13), dot(p(0.65, 0), accent, 0.13));
  if (scene === "m15" && phase === 2) items.push(tex(String.raw`N_e=1295,\quad \epsilon=10\,\mathrm{m}`, p(0, -2.35), accent, 23));
  if (scene === "m16" && phase >= 1) items.push(...[0.42, 0.82, 1.22].slice(0, phase + 1).map((r) => circle(r, p(0, 0), r === 1.22 ? measured : accent, 3)));
  if (scene === "m16" && phase === 2) items.push(tex(String.raw`h_{\mathrm{FEM}}(x,y)`, p(0, -2.35), accent, 25));
  return field(items);
}

function comparison(scene, phase, [accent, measured, pale]) {
  const analytical = headCurve(0.08).map(([x, y]) => p(x, y - 0.25));
  const numerical = analytical.map(([x, y], index) => p(x, y + (index === 4 ? 0.09 : 0.02)));
  const items = [line(p(-3, -0.65), p(3, -0.65), measured, 2), line(p(-3, -0.65), p(-3, 1.35), measured, 2), ...profile(analytical, accent, 5)];
  if (phase >= 1) items.push(...numerical.map((at) => dot(at, measured, 0.065)), ...profile(numerical, measured, 2));
  if (phase === 2) items.push(tex(scene === "m17" ? String.raw`\max|h_A-h_{\mathrm{FEM}}|=0.049\,\mathrm{m}` : String.raw`h_{17}(r)=h_{\mathrm{Fetter}}(r)`, p(0, 1.65), accent, scene === "m17" ? 21 : 24), ...(scene === "m20" ? [tex(String.raw`h^2=\frac{W(a^2-r^2)}{2K(1+\alpha)}`, p(0, -1.35), measured, 20)] : []));
  return field(items);
}

function uniformLimit(scene, phase, [accent, measured, pale]) {
  const items = [circle(1.9, p(-0.75, 0), measured, 4)];
  const count = phase === 0 ? 6 : phase === 1 ? 12 : 18;
  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.4; const radius = 0.35 + (index % 4) * 0.38;
    items.push(dot(p(-0.75 + radius * Math.cos(angle), radius * Math.sin(angle)), phase === 0 ? [accent, measured, pale][index % 3] : measured, 0.07));
  }
  if (scene === "m18" && phase === 0) items.push(dot(p(-0.25, 0.4), accent, 0.13), dot(p(-1.2, -0.35), accent, 0.13));
  if (phase >= 1) items.push(arrow(p(1.25, 0), p(1.8, 0), accent, 4), ...profile(headCurve(0.18).map(([x, y]) => p(1.75 + x * 0.42, y * 0.65 - 0.25)), accent, 4));
  if (phase === 2) items.push(tex(scene === "m18" ? String.raw`W(r_0,\theta_0)=W_0,\quad Q_{p,i}=0` : String.raw`h_{17}(r)=+\sqrt{\int GW_0\,dA}`, p(0.5, -1.75), accent, scene === "m18" ? 20 : 21));
  return field(items);
}

const SCENES = [
  ["return", /verified circular island lens/], ["b01", /circular island and amplified freshwater lens cross-section/], ["b02", /recharge-only circular solution beside an unresolved pumped circle/],
  ["m01", /radial recharge paraboloid/], ["m02", /off-center point sink/], ["m03", /real well-image well pair/], ["m04", /layered concentric recharge contours/], ["m05", /squared-head surface resolving/], ["m06", /positive head profile stretching downward/],
  ["dq", /interface-depth field emitting a pumping-rate derivative/], ["dw", /interface-depth field emitting a recharge derivative/], ["da", /interface-depth field emitting an island-radius derivative/], ["nq", /pumping derivative rescaled/], ["nw", /recharge derivative rescaled/], ["na", /radius derivative rescaled/],
  ["m13", /three vulnerability heat maps/], ["m14", /recharge pixels emitting green's ripples/], ["m15", /circular finite-element mesh/], ["m16", /finite-element mesh filling/], ["m17", /overlaid analytical and finite-element head profiles/],
  ["m18", /variable recharge tiles equalizing/], ["m19", /uniform recharge impulses accumulating/], ["m20", /generalized uniform-recharge profile overlaid/],
];

export function renderPaperVisual2024_05_21(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description);
  if (!text.includes("[paper:2024-05-21]")) return null;
  const scene = SCENES.find(([, pattern]) => pattern.test(text))?.[0];
  if (!scene) return null;
  const step = phaseOf(phase); const colors = colorsOf(palette);
  if (scene === "b01" || scene === "m06" || scene === "return") return crossSection(scene, step, colors);
  if (/^m0[1-4]$|^b02$/.test(scene)) return islandPlan(scene, step, colors);
  if (scene === "m05") return positiveRoot(step, colors);
  if (/^(?:d|n)[qwa]$/.test(scene)) return vulnerability(scene, step, colors);
  if (scene === "m13") return vulnerabilityMaps(step, colors);
  if (scene === "m14") return rechargeIntegral(step, colors);
  if (scene === "m15" || scene === "m16") return finiteElement(scene, step, colors);
  if (scene === "m17" || scene === "m20") return comparison(scene, step, colors);
  return uniformLimit(scene, step, colors);
}
