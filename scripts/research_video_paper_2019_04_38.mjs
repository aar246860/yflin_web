const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const MODEL_COLORS = ["#6B7C85", "#5DB7C4", "#7A5C99", "#E49A73", "#137C8B"];
const MARKER = "[paper:2019-04-38]";

const q = (value) => JSON.stringify(value);
const point = ([x, y]) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const dot = (xy, color, radius = 0.07) => `Dot(${point(xy)}, radius=${radius}, color=${q(color)})`;
const rect = (width, height, xy, stroke, fill = "#FFFFFF", opacity = 0) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const circle = (radius, xy, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const arc = (radius, xy, start, angle, color, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${point(xy)})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, buff=0.04, stroke_width=${width})`;
const poly = (points, stroke, fill, opacity = 0.35) => `Polygon(${points.map(point).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const tex = (value, color, size, xy) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((xy, index) => line(xy, points[index + 1], color, width));
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

function normalizePalette(palette) {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [source[0] ?? DEFAULT_PALETTE[0], source[1] ?? DEFAULT_PALETTE[1], source[2] ?? DEFAULT_PALETTE[2]].map(String);
}

function normalizePhase(phase) {
  const value = Number(phase);
  return Math.max(0, Math.min(2, Number.isFinite(value) ? Math.trunc(value) : 0));
}

function descriptionText(description) {
  const values = typeof description === "object" && description !== null
    ? [description.marker, description.description, description.visualObject, description.stepDetail, description.visibleEvidence, description.motionPurpose, description.minimalText, description.premise, description.operation, description.output, description.claim]
    : [description];
  return values.map((value) => typeof value === "string" ? value : typeof value === "object" && value !== null ? descriptionText(value) : "").filter(Boolean).join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

function adapterContext(context, phase, palette) {
  if (typeof context !== "object" || context === null || Array.isArray(context) || !("description" in context)) {
    return { description: context, phase: normalizePhase(phase), palette: normalizePalette(palette) };
  }
  return {
    description: context,
    phase: normalizePhase(context.phase ?? phase),
    palette: normalizePalette(context.palette ?? palette),
  };
}

function aquiferSection(c, phase, includeEquation = false) {
  const [a, m, p] = c;
  const table = [[-3.0, 0.82], [-2.1, 0.78], [-1.2, 0.6], [-0.25, 0.28], [0.7, 0.04]];
  const items = [rect(5.8, 2.3, [-0.35, -0.2], m, p, 0.42), ...plot(table, a, 5), rect(0.3, 2.8, [-2.35, 0.05], a, "#FFFFFF", 0.9), line([-2.35, 1.45], [-2.35, -1.35], a, 5), line([-2.52, -0.05], [-2.18, -0.05], m, 7), line([-2.52, -0.78], [-2.18, -0.78], m, 7)];
  if (phase > 0) items.push(arrow([-2.1, -0.45], [-0.7, -0.45], a), arrow([-1.65, -0.95], [-0.45, -0.95], a), arrow([-2.82, -1.18], [-2.82, 1.12], m), tex("z", m, 25, [-2.9, 1.35]), arrow([-2.25, -1.25], [0.6, -1.25], m), tex("r", m, 25, [0.82, -1.24]));
  if (phase === 2) items.push(tex("K_r", a, 25, [-1.25, -0.2]), tex("K_z", m, 25, [-2.74, 0.25]), tex("r_w", a, 21, [-2.02, 1.12]), tex("b", m, 22, [0.55, 0.82]));
  if (includeEquation && phase === 2) items.push(tex(String.raw`K_r\!\left(\partial_{rr}s+r^{-1}\partial_rs\right)+K_z\partial_{zz}s=S_s\partial_ts`, "#102A35", 21, [0.15, 1.22]));
  return field(items);
}

function threeSegments(c, phase) {
  const [a, m, p] = c;
  const early = [[-2.8, 1.05], [-2.35, 0.62], [-1.9, 0.12]];
  const middle = [[-1.9, 0.12], [-1.35, -0.08], [-0.75, -0.17], [-0.15, -0.22]];
  const late = [[-0.15, -0.22], [0.45, -0.48], [1.05, -0.92]];
  const items = [line([-2.9, -1.2], [1.2, -1.2], m, 2), line([-2.9, -1.2], [-2.9, 1.25], m, 2), ...plot(early, a, 5), rect(0.22, 2.55, [2.25, 0], a, "#FFFFFF", 0.9), line([2.25, 1.28], [2.25, -1.28], a, 5), arrow([2.82, -0.35], [2.42, -0.35], m), arrow([2.82, 0.25], [2.42, 0.25], m)];
  if (phase > 0) items.push(...plot(middle, a, 5), poly([[1.55, 0.55], [3.0, 0.55], [3.0, -0.05], [1.55, 0.18]], m, p, 0.55), tex(String.raw`S_y`, a, 23, [2.82, 0.82]));
  if (phase === 2) items.push(...plot(late, a, 5), line([-1.9, -1.34], [-1.9, 1.12], p, 3), line([-0.15, -1.34], [-0.15, 0.85], p, 3), tex(String.raw`I`, m, 22, [-2.38, -1.48]), tex(String.raw`II`, a, 22, [-1.02, -1.48]), tex(String.raw`III`, m, 22, [0.48, -1.48]));
  return field(items);
}

function capillaryDrainage(c, phase) {
  const [a, m, p] = c;
  const oldY = 0.72;
  const newY = phase === 0 ? oldY : phase === 1 ? 0.15 : -0.35;
  const items = [rect(6.0, newY + 1.55, [0, (-1.55 + newY) / 2], m, p, 0.55), line([-3, oldY], [3, oldY], p, 3), line([-3, newY], [3, newY], a, 5), tex(String.raw`z=b-s`, a, 22, [2.35, newY - 0.23])];
  const pores = [[-2.35, 1.18, 0.34], [-1.45, 1.02, 0.2], [-0.55, 1.2, 0.31], [0.45, 1.0, 0.18], [1.35, 1.18, 0.3]];
  for (const [x, y, radius] of pores) {
    items.push(circle(radius, [x, y], m, 3));
    if (phase > 0) items.push(arc(radius * 0.72, [x, y - radius * 0.2], 0.12, 2.9, a, phase === 2 && radius > 0.25 ? 2 : 4));
  }
  if (phase > 0) items.push(poly([[-3, oldY], [3, oldY], [3, newY], [-3, newY]], a, p, 0.2), arrow([-2.75, oldY], [-2.75, newY], a));
  if (phase === 2) items.push(...[-2.35, -0.55, 1.35].flatMap((x) => [dot([x, 0.52], a, 0.1), arrow([x, 0.42], [x, -0.18], a, 3)]), tex(String.raw`\mathrm{retained\ capillary\ water}`, a, 20, [0.2, 0.42]));
  return field(items);
}

function competingDrainage(c, phase) {
  const [a, m, p] = c;
  const delayed = [[-2.75, 0.92], [-2.2, 0.38], [-1.55, 0.08], [-0.8, -0.02], [0.0, -0.12], [0.8, -0.55], [1.55, -0.92]];
  const instant = [[-2.75, 0.92], [-2.2, 0.34], [-1.55, -0.2], [-0.8, -0.55], [0.0, -0.72], [0.8, -0.82], [1.55, -0.92]];
  const items = [line([-2.9, -1.18], [1.75, -1.18], m, 2), line([-2.9, -1.18], [-2.9, 1.18], m, 2), ...plot(instant, m, 4)];
  if (phase > 0) items.push(...plot(delayed, a, 5), line([-1.45, -1.15], [-1.45, 0.95], p, 3), tex(String.raw`\tau_q`, a, 25, [-1.45, 1.18]));
  if (phase === 2) items.push(line([-0.15, -1.15], [-0.15, 0.72], p, 3), tex(String.raw`\tau_s`, a, 25, [-0.15, 0.95]), rect(0.42, 1.0, [2.25, -0.5], m, p, 0.45), rect(0.42, 1.45, [2.85, -0.275], a, p, 0.65), tex(String.raw`S_y`, a, 24, [2.55, 0.7]), arrow([2.2, -0.98], [2.2, -0.35], m, 3));
  return field(items);
}

function wellboreStorage(c, phase) {
  const [a, m, p] = c;
  const waterTop = phase === 0 ? 0.95 : phase === 1 ? 0.35 : -0.2;
  const items = [rect(5.8, 2.45, [0, -0.1], m, p, 0.35), rect(0.7, 2.9, [-1.75, 0.05], a, "#FFFFFF", 0.95), rect(0.48, waterTop + 1.25, [-1.75, (waterTop - 1.25) / 2], m, p, 0.72), line([-2.1, 1.5], [-2.1, -1.4], a, 5), line([-1.4, 1.5], [-1.4, -1.4], a, 5), line([-2.1, -0.25], [-1.4, -0.25], m, 7), line([-2.1, -1.02], [-1.4, -1.02], m, 7), tex("H(t)", a, 23, [-1.0, waterTop])];
  if (phase > 0) items.push(arrow([0.8, -0.55], [-1.3, -0.55], a), arrow([0.8, -0.95], [-1.3, -0.95], a), arrow([-1.75, 1.38], [-1.75, 0.92], m), tex("Q", m, 25, [-1.75, 1.55]));
  if (phase === 2) items.push(tex(String.raw`2\pi r_wK_r(l-d)\,\partial_rs\vert_{r_w}=-Q+\pi r_c^2\partial_tH`, "#102A35", 21, [0.55, 1.22]), tex("d", m, 20, [-2.35, -1.02]), tex("l", m, 20, [-2.35, -0.25]));
  return field(items);
}

function twoLags(c, phase) {
  const [a, m, p] = c;
  const items = [line([-2.85, -0.85], [2.85, -0.85], m, 3), ...Array.from({ length: 9 }, (_, i) => line([-2.6 + i * 0.65, -0.97], [-2.6 + i * 0.65, -0.73], m, 2)), ...plot([[-2.7, 0.72], [-1.9, 0.62], [-1.1, 0.35], [-0.3, 0.05], [0.5, -0.12], [1.3, -0.2], [2.15, -0.25]], m, 4), arrow([-1.65, 1.25], [-1.65, 0.55], a), tex("q_z", a, 23, [-1.95, 1.35])];
  if (phase > 0) items.push(line([-1.65, -1.1], [-1.65, -0.6], a, 5), line([-0.75, -1.1], [-0.75, -0.6], a, 5), arrow([-1.58, -1.35], [-0.82, -1.35], a, 3), tex(String.raw`\tau_q`, a, 24, [-1.2, -1.52]));
  if (phase === 2) items.push(line([0.05, -1.1], [0.05, -0.6], m, 5), line([1.55, -1.1], [1.55, -0.6], m, 5), arrow([0.12, -1.35], [1.48, -1.35], m, 3), tex(String.raw`\tau_s`, m, 24, [0.8, -1.52]), tex(String.raw`q_z(t+\tau_q)=-K_z\partial_zs(t+\tau_s)`, "#102A35", 24, [0.55, 1.18]));
  return field(items);
}

function lagExpansion(c, phase) {
  const [a, m, p] = c;
  const qTrace = [[-2.85, -0.2], [-2.25, 0.02], [-1.65, 0.48], [-1.05, 0.68], [-0.45, 0.62]];
  const sTrace = [[0.25, 0.7], [0.85, 0.48], [1.45, 0.05], [2.05, -0.28], [2.65, -0.4]];
  const items = [...plot(qTrace, a, 4), ...plot(sTrace, m, 4), line([-2.9, -0.85], [2.8, -0.85], p, 2), tex(String.raw`q_z(t+\tau_q)`, a, 22, [-1.65, 1.05]), tex(String.raw`s(t+\tau_s)`, m, 22, [1.45, 1.05])];
  if (phase > 0) items.push(line([-1.65, 0.48], [-0.65, 0.82], a, 3), line([1.45, 0.05], [2.45, -0.55], m, 3), dot([-1.65, 0.48], a, 0.1), dot([1.45, 0.05], m, 0.1));
  if (phase === 2) items.push(tex(String.raw`q_z+\tau_q\partial_tq_z=-K_z\!\left(\partial_zs+\tau_s\partial_{tz}s\right)`, "#102A35", 25, [0, -1.25]), arrow([-0.3, 0.1], [0.15, 0.1], a));
  return field(items);
}

function freeSurfaceEquation(c, phase) {
  const [a, m, p] = c;
  const items = [poly([[-2.9, 0.25], [-1.8, 0.2], [-0.7, -0.05], [0.4, -0.38], [1.5, -0.5], [2.9, -0.52], [2.9, -1.35], [-2.9, -1.35]], m, p, 0.5), ...plot([[-2.9, 0.25], [-1.8, 0.2], [-0.7, -0.05], [0.4, -0.38], [1.5, -0.5], [2.9, -0.52]], a, 5), tex(String.raw`K_z\partial_zs=-S_y\partial_ts`, m, 25, [0, 0.72])];
  if (phase > 0) items.push(tex(String.raw`K_z\!\left(\partial_zs+\tau_s\partial_{tz}s\right)`, a, 24, [-1.25, 1.22]), tex(String.raw`-S_y\!\left(\partial_ts+\tau_q\partial_{tt}s\right)`, m, 24, [1.25, 1.22]), tex("=", "#102A35", 28, [0, 1.22]));
  if (phase === 2) items.push(tex(String.raw`\tau_q=\tau_s=0\Rightarrow\mathrm{Neuman}`, m, 19, [-1.5, -1.55]), tex(String.raw`\tau_{qD}=0,\ \tau_{sD}=\alpha_{1D}^{-1}\Rightarrow\mathrm{Moench}`, a, 19, [1.35, -1.55]));
  return field(items);
}

function dimensionless(c, phase) {
  const [a, m, p] = c;
  const items = [rect(2.15, 2.25, [-1.95, 0], m, p, 0.35), line([-2.8, -0.82], [-1.05, -0.82], a, 4), rect(0.22, 1.65, [-2.45, -0.02], a, "#FFFFFF", 0.9), tex("r,z,t,s", m, 25, [-1.95, 1.28]), rect(0.55, 2.65, [0, 0], a, p, 0.42), arrow([-0.55, 0], [0.55, 0], a)];
  if (phase > 0) items.push(rect(2.15, 2.25, [1.95, 0], a, p, 0.3), tex(String.raw`r_D,z_D,t_D,s_D`, a, 25, [1.95, 1.28]), line([1.1, -0.82], [2.85, -0.82], a, 4), rect(0.22, 1.65, [1.55, -0.02], a, "#FFFFFF", 0.9));
  if (phase === 2) items.push(tex(String.raw`r_D={r\over b},\quad z_D={z\over b},\quad t_D={K_rt\over S_sb^2}`, "#102A35", 22, [0, 0.45]), tex(String.raw`\tau_{qD}={K_r\tau_q\over S_sb^2},\quad\tau_{sD}={K_r\tau_s\over S_sb^2}`, "#102A35", 22, [0, -0.35]));
  return field(items);
}

function laplaceTransform(c, phase) {
  const [a, m, p] = c;
  const trace = [[-2.85, 0.8], [-2.35, 0.45], [-1.85, 0.12], [-1.35, -0.05], [-0.85, -0.12]];
  const items = [line([-2.95, -0.75], [-0.65, -0.75], m, 2), line([-2.95, -0.75], [-2.95, 1.05], m, 2), ...plot(trace, a, 4), tex("t", m, 22, [-0.55, -0.75]), arrow([-0.35, 0], [0.35, 0], a)];
  if (phase > 0) items.push(line([0.65, -0.75], [2.95, -0.75], m, 2), line([0.65, -0.75], [0.65, 1.05], m, 2), ...plot([[0.75, 0.88], [1.15, 0.5], [1.65, 0.22], [2.2, 0.02], [2.8, -0.08]], m, 4), tex("p", a, 24, [2.95, -0.75]));
  if (phase === 2) items.push(tex(String.raw`\mathcal L\{\partial_tf\}=p\bar f(p)-f(0)`, "#102A35", 27, [0, 1.35]));
  return field(items);
}

function weberTransform(c, phase) {
  const [a, m, p] = c;
  const items = [circle(0.25, [-1.85, 0], a, 4), circle(0.7, [-1.85, 0], m, 3), circle(1.15, [-1.85, 0], m, 3), ...[-0.7, 0, 0.7].map((y) => arrow([-0.6, y], [-1.5, y], a, 3)), tex(String.raw`r_{wD}`, a, 20, [-1.85, -0.38]), arrow([-0.35, 0], [0.35, 0], a)];
  if (phase > 0) items.push(line([0.65, -1.05], [2.85, -1.05], m, 2), ...plot([[0.7, 0.85], [1.0, 0.2], [1.35, -0.3], [1.7, 0.22], [2.05, 0.48], [2.4, -0.1], [2.8, -0.45]], a, 3), tex("a", a, 23, [2.95, -1.05]));
  if (phase === 2) items.push(tex(String.raw`\widetilde f(a)=\int_{r_{wD}}^\infty f(r_D)r_D\Omega(a,r_D)\,dr_D`, "#102A35", 23, [0.65, 1.25]));
  return field(items);
}

function inverseWeber(c, phase) {
  const [a, m, p] = c;
  const spectrum = [[-2.85, -0.5], [-2.45, 0.65], [-2.05, -0.15], [-1.65, 0.38], [-1.25, -0.42], [-0.85, 0.12]];
  const items = [line([-2.95, -0.75], [-0.65, -0.75], m, 2), ...plot(spectrum, a, 3), arrow([-0.4, 0], [0.25, 0], a)];
  const ringCount = phase === 0 ? 1 : phase === 1 ? 3 : 5;
  for (let i = 0; i < ringCount; i += 1) items.push(circle(0.25 + i * 0.34, [1.75, 0], i === ringCount - 1 ? a : m, i === ringCount - 1 ? 4 : 2));
  if (phase === 2) items.push(tex(String.raw`\bar s_D(r_D,p)=\int_0^\infty\widetilde s_D(a,p)a\Omega(a,r_D)\,da`, "#102A35", 22, [0, 1.35]));
  return field(items);
}

function transientDrawdown(c, phase) {
  const [a, m, p] = c;
  const curves = [0, 0.28, 0.52].map((offset) => [[-2.75, 0.95 - offset], [-2.25, 0.5 - offset], [-1.65, 0.12 - offset], [-0.95, 0.02 - offset], [-0.2, -0.05 - offset], [0.55, -0.38 - offset], [1.35, -0.72 - offset]]);
  const items = [line([-2.9, -1.35], [1.55, -1.35], m, 2), line([-2.9, -1.35], [-2.9, 1.2], m, 2), ...plot(curves[0], a, 4), tex("t", m, 22, [1.65, -1.35])];
  if (phase > 0) items.push(...plot(curves[1], m, 3), tex(String.raw`\mathcal L^{-1}_{\mathrm{Crump}}`, a, 24, [2.35, 0.82]));
  if (phase === 2) items.push(...plot(curves[2], MODEL_COLORS[2], 3), ...[[-2.25, 0.5], [-0.2, -0.05], [1.35, -0.72]].map((xy) => dot(xy, "#102A35", 0.08)), tex(String.raw`r_1<r_2<r_3`, m, 22, [2.35, 0.25]));
  return field(items);
}

function sensitivity(c, phase) {
  const [a, m, p] = c;
  const qCurve = [[-2.8, 0], [-2.15, -0.12], [-1.5, -0.65], [-0.85, -0.18], [-0.2, -0.02], [0.5, 0]];
  const sCurve = [[-2.8, 0], [-2.15, 0.04], [-1.5, 0.18], [-0.85, 0.72], [-0.2, 0.26], [0.5, 0.02]];
  const items = [line([-2.9, 0], [0.65, 0], m, 2), line([-2.9, -1.05], [-2.9, 1.05], m, 2), ...plot(qCurve, a, 4), tex(String.raw`X_{\tau_q}`, a, 22, [-1.5, -0.9])];
  if (phase > 0) items.push(...plot(sCurve, MODEL_COLORS[2], 4), tex(String.raw`X_{\tau_s}`, MODEL_COLORS[2], 22, [-0.75, 0.98]), line([-1.5, -1.05], [-1.5, 0.95], p, 3), line([-0.85, -1.05], [-0.85, 1.0], p, 3));
  if (phase === 2) items.push(tex(String.raw`X_k=P_k\,{s(P_k+\Delta P_k)-s(P_k)\over\Delta P_k}`, "#102A35", 23, [1.85, 0.65]), tex(String.raw`\Delta P_k=10^{-3}P_k`, a, 22, [1.85, 0]), tex(String.raw`\tau_q`, a, 20, [-1.5, -1.3]), tex(String.raw`\tau_s`, MODEL_COLORS[2], 20, [-0.85, -1.3]), tex(String.raw`K_r>K_z>S_y>\tau_s>\tau_q>S_s`, m, 18, [1.85, -0.7]));
  return field(items);
}

function modelLegend(y = 1.48) {
  const labels = [String.raw`\mathrm{Neuman}`, String.raw`\mathrm{Moench}`, String.raw`\mathrm{T\!-\!N}`, String.raw`\mathrm{Malama}`, String.raw`\mathrm{Present}`];
  return labels.flatMap((label, index) => [line([-2.9 + index * 1.22, y], [-2.66 + index * 1.22, y], MODEL_COLORS[index], index === 4 ? 4 : 2), tex(label, MODEL_COLORS[index], 12, [-2.3 + index * 1.22, y])]);
}

function fitPanel(center, label, phase, variant = 0, width = 2.0) {
  const [cx, cy] = center;
  const left = cx - width / 2;
  const right = cx + width / 2;
  const bottom = cy - 0.43;
  const top = cy + 0.43;
  const base = [0.08, 0.25, 0.48, 0.57, 0.72, 0.88].map((value, index) => Math.min(0.96, value + variant * 0.018 * (index % 3)));
  const xs = Array.from({ length: base.length }, (_, index) => left + 0.18 + index * (width - 0.36) / (base.length - 1));
  const pointsFor = (values) => values.map((value, index) => [xs[index], bottom + 0.08 + value * (top - bottom - 0.14)]);
  const observed = pointsFor(base);
  const offsets = [
    [0, -0.03, -0.16, -0.15, -0.07, 0],
    [0, -0.02, -0.07, -0.06, -0.02, 0],
    [0, 0.03, 0.06, 0.04, 0.02, 0],
    [0, -0.04, -0.09, -0.06, -0.02, 0],
    [0, 0.01, -0.01, 0.01, 0, 0],
  ];
  if (variant === 4) offsets[4][1] = -0.11;
  const items = [rect(width, 0.94, center, "#B9C5CA"), line([left + 0.12, bottom + 0.08], [right - 0.08, bottom + 0.08], "#B9C5CA", 1.5), line([left + 0.12, bottom + 0.08], [left + 0.12, top - 0.06], "#B9C5CA", 1.5), tex(label, "#102A35", 15, [cx, top - 0.08]), ...observed.map((xy) => dot(xy, "#102A35", 0.035))];
  if (phase > 0) for (let model = 0; model < 4; model += 1) items.push(...plot(pointsFor(base.map((value, index) => value + offsets[model][index])), MODEL_COLORS[model], 1.5));
  if (phase === 2) items.push(...plot(pointsFor(base.map((value, index) => value + offsets[4][index])), MODEL_COLORS[4], 3));
  return items;
}

function errorComparison(c, phase) {
  const [a, m, p] = c;
  if (phase < 2) return [];
  return [tex(String.raw`\mathrm{SEE}`, "#102A35", 16, [2.55, 0.7]), rect(0.62, 0.12, [2.42, 0.4], m, p, 0.75), rect(0.28, 0.12, [2.25, 0.18], a, p, 0.85), tex(String.raw`\mathrm{refs}`, m, 12, [2.8, 0.4]), tex(String.raw`\mathrm{P}`, a, 13, [2.55, 0.18]), tex(String.raw`\mathrm{ME}`, "#102A35", 16, [2.55, -0.25]), rect(0.54, 0.12, [2.38, -0.55], m, p, 0.75), rect(0.24, 0.12, [2.23, -0.77], a, p, 0.85), tex(String.raw`\mathrm{refs}`, m, 12, [2.78, -0.55]), tex(String.raw`\mathrm{P}`, a, 13, [2.55, -0.77])];
}

function siteFits(c, phase, site) {
  const configs = {
    cape: { labels: [String.raw`\mathrm{F505-032}\ (7.28\,\mathrm{m})`, String.raw`\mathrm{F504-032}\ (14.2\,\mathrm{m})`, String.raw`\mathrm{F377-037}\ (25.9\,\mathrm{m})`, String.raw`\mathrm{F347-031}\ (68.8\,\mathrm{m})`], centers: [[-1.8, 0.66], [0.45, 0.66], [-1.8, -0.64], [0.45, -0.64]], variants: [0, 1, 2, 3] },
    borden: { labels: [String.raw`\mathrm{WD1A}\ (1.51\,\mathrm{m})`, String.raw`\mathrm{WD1B}\ (3.152\,\mathrm{m})`, String.raw`\mathrm{WD2A}\ (5.069\,\mathrm{m})`, String.raw`\mathrm{WD4A}\ (15.05\,\mathrm{m})`], centers: [[-1.8, 0.66], [0.45, 0.66], [-1.8, -0.64], [0.45, -0.64]], variants: [4, 1, 2, 3] },
    saint: { labels: [String.raw`r=10\,\mathrm{m}`, String.raw`r=30\,\mathrm{m}`], centers: [[-1.65, 0], [0.85, 0]], variants: [1, 3] },
  };
  const config = configs[site];
  const width = site === "saint" ? 2.2 : 1.95;
  const items = [...modelLegend(), ...config.labels.flatMap((label, index) => fitPanel(config.centers[index], label, phase, config.variants[index], width)), ...errorComparison(c, phase)];
  if (phase === 2 && site === "saint") items.push(tex(String.raw`S_y=0.25`, MODEL_COLORS[4], 18, [-1.65, -0.72]), tex(String.raw`S_y=0.29`, MODEL_COLORS[4], 18, [0.85, -0.72]), tex(String.raw`S_y^{TN}=0.49`, MODEL_COLORS[2], 16, [0.85, 0.72]));
  if (phase === 2 && site === "borden") items.push(tex(String.raw`\mathrm{WD1A:\ early\ limitation}`, MODEL_COLORS[4], 16, [-1.8, 1.18]));
  return field(items);
}

function finalSites(c, phase) {
  const [a, m, p] = c;
  const sites = [{ x: -2.1, label: "Cape\ Cod" }, { x: 0, label: "Borden" }, { x: 2.1, label: "Saint\ Pardon" }];
  const items = [];
  for (const [index, site] of sites.entries()) {
    items.push(rect(1.75, 2.35, [site.x, 0], m, p, 0.22), tex(String.raw`\mathrm{${site.label}}`, "#102A35", 18, [site.x, 0.94]));
    const observed = [[site.x - 0.65, 0.48], [site.x - 0.4, 0.25], [site.x - 0.1, -0.05], [site.x + 0.25, -0.18], [site.x + 0.62, -0.58 + index * 0.04]];
    items.push(...observed.map((xy) => dot(xy, "#102A35", 0.045)));
    if (phase > 0) items.push(...plot(observed.map(([x, y], i) => [x, y + (i % 2 ? 0.015 : -0.01)]), a, 3));
    if (phase === 2) items.push(tex(String.raw`S_y\in\mathrm{lab\ range}`, a, 15, [site.x, -0.94]));
  }
  if (phase === 2) items.push(line([-2.75, 1.38], [2.75, 1.38], a, 4), tex(String.raw`\mathrm{present:\ low\ SEE/ME}`, a, 18, [0, 1.55]));
  return field(items);
}

export function renderPaperVisual2019_04_38(context, phase = 0, palette = DEFAULT_PALETTE) {
  const normalized = adapterContext(context, phase, palette);
  const text = descriptionText(normalized.description);
  if (!text.includes(MARKER)) return null;
  const c = normalized.palette;
  const p = normalized.phase;

  if (/cape cod, borden, and saint pardon.*independently fitted|delayed drainage fits the field response/.test(text)) return finalSites(c, p);
  if (/saint pardon.*observation-well panels|saint pardon field test|10 m and 30 m/.test(text)) return siteFits(c, p, "saint");
  if (/borden piezometer panels|borden field test|wd1a.*wd1b.*wd2a.*wd4a/.test(text)) return siteFits(c, p, "borden");
  if (/cape cod observation-well panels|cape cod field test|four cape cod/.test(text)) return siteFits(c, p, "cape");
  if (/normalized sensitivity|parameter perturbation controls|10\^-3/.test(text)) return sensitivity(c, p);
  if (/laplace-domain response resolving|crump inversion|transient drawdown/.test(text)) return transientDrawdown(c, p);
  if (/weber spectrum integrating back|recover radial drawdown|inverse weber/.test(text)) return inverseWeber(c, p);
  if (/finite-radius radial profiles folding|weber a-domain|weber kernel/.test(text)) return weberTransform(c, p);
  if (/time-dependent equations folding|laplace p-domain|laplace parameter p/.test(text)) return laplaceTransform(c, p);
  if (/dimensionless symbols|dimensionless system|normalize model variables/.test(text)) return dimensionless(c, p);
  if (/water-table boundary equation|lag-aware free surface|linearized free-surface equation/.test(text)) return freeSurfaceEquation(c, p);
  if (/shifted time traces|first-order lag expansion|taylor representation/.test(text)) return lagExpansion(c, p);
  if (/free surface carrying separate flux|two lag times|flux and drawdown clock/.test(text)) return twoLags(c, p);
  if (/pumping-well cylinder|wellbore storage|inner flux condition/.test(text)) return wellboreStorage(c, p);
  if (/cylindrical aquifer domain|axisymmetric aquifer flow|radial-vertical groundwater-flow/.test(text)) return aquiferSection(c, p, true);
  if (/two competing free-surface|specific yield can be biased|instantaneous.*delayed drainage/.test(text)) return competingDrainage(c, p);
  if (/falling water table|pore-scale menisci|drainage is delayed|capillary water/.test(text)) return capillaryDrainage(c, p);
  if (/three-segment time-drawdown|three drawdown segments|s-shaped pumping response/.test(text)) return threeSegments(c, p);
  return null;
}
