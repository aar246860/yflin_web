// allow: SIZE_OK - 38 source-audited scenes belong to this single paper adapter.
const PAPER_MARKER = "[paper:2024-06-19]";
const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const p = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (at, color, radius = 0.08) => `Dot(${q(at)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, at, stroke, fill, opacity = 0, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(at)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.2, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(at)})`;
const polygon = (points, stroke, fill, opacity = 0.25, width = 3) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (value, at, color, size = 23) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const label = (value, at, color, size = 17) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const axes = (at, color, width = 5.2, height = 2.7) => `Axes(x_range=[0, 6, 1], y_range=[0, 2, 0.5], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).move_to(${q(at)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((at, index) => line(p(...at), p(...points[index + 1]), color, width));
const dashedTrace = (points, color, width = 3) => points.slice(0, -1).filter((_, index) => index % 2 === 0).map((at, index) => line(p(...at), p(...points[index * 2 + 1]), color, width));
const field = (items) => `VGroup(${items.filter(Boolean).flat().join(", ")}).scale(0.66).shift([-1.45, 0.1, 0])`;

const phaseOf = (value) => Math.max(0, Math.min(2, Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0));
const colorsOf = (value) => {
  const colors = Array.isArray(value) ? value : [];
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]];
};
const textOf = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return Object.values(value).filter((item) => typeof item === "string").join(" ");
  return String(value ?? "");
};
const normalizedText = (value) => textOf(value).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();

function sceneNumberOf(value) {
  if (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 38) return Number(value);
  const match = String(value ?? "").toUpperCase().match(/^(B|M)(\d{2})$/);
  if (!match) return null;
  const ordinal = Number(match[2]);
  return match[1] === "B" && ordinal <= 3 ? ordinal : match[1] === "M" && ordinal <= 34 ? ordinal + 3 : null;
}

function unpackContext(context) {
  const objectContext = context && typeof context === "object" && !Array.isArray(context) ? context : {};
  const description = objectContext.description ?? objectContext.text ?? objectContext.semanticDescription ?? context;
  const contextText = normalizedText(context);
  const descriptionText = normalizedText(description);
  const text = contextText.includes(descriptionText) ? contextText : `${contextText} ${descriptionText}`.trim();
  return {
    text,
    phase: phaseOf(objectContext.phase),
    colors: colorsOf(objectContext.palette),
    scene: sceneNumberOf(objectContext.scene ?? objectContext.sceneNumber ?? objectContext.sceneId ?? objectContext.id ?? objectContext.index),
  };
}

const drawdown = (xOffset = 0, yOffset = 0) => [[-2.7, -0.95], [-2.15, -0.9], [-1.6, -0.72], [-1.0, -0.34], [-0.35, 0.08], [0.4, 0.52], [1.2, 0.82], [2.1, 1.02], [2.7, 1.12]].map(([x, y]) => [x + xOffset, y + yOffset]);
const sCurve = (xOffset = 0, yOffset = 0) => [[-2.7, -0.96], [-2.15, -0.95], [-1.6, -0.9], [-1.0, -0.62], [-0.35, 0.08], [0.4, 0.48], [1.2, 0.62], [2.1, 0.96], [2.7, 1.14]].map(([x, y]) => [x + xOffset, y + yOffset]);
const impulse = (xOffset = 0, yOffset = 0) => [[-2.7, -0.92], [-2.1, -0.8], [-1.5, 0.92], [-0.9, 0.42], [-0.2, -0.18], [0.65, -0.62], [1.6, -0.84], [2.7, -0.92]].map(([x, y]) => [x + xOffset, y + yOffset]);

function unknownPumping(phase, [accent, measured, pale]) {
  const wells = [[-2.45, 0.95], [-1.72, 0.35], [-0.95, 1.05], [-0.2, 0.48], [0.7, 1.0], [1.5, 0.38], [2.32, 0.88]];
  const items = [axes(p(0, -0.35), measured), ...trace(drawdown(0, -0.05), accent, 5), rect(0.24, 2.6, p(0, -0.05), accent, "#FFFFFF", 0.9, 4)];
  wells.forEach((at, index) => {
    const visible = phase === 0 || index % 2 === 0;
    items.push(dot(p(...at), visible ? measured : pale, 0.075), arrow(p(at[0], at[1] - 0.08), p(at[0], at[1] - 0.48), visible ? measured : pale, 2));
    if (phase === 0) items.push(math(`Q_${index + 1}`, p(at[0], at[1] + 0.28), measured, 15));
  });
  if (phase >= 1) items.push(...wells.slice(0, phase === 1 ? 3 : 7).map((at) => circle(0.18, p(...at), pale, "#FFFFFF", 0, 2)));
  if (phase === 2) items.push(math(String.raw`h_{obs}(t)`, p(1.9, 1.48), accent, 24));
  return field(items);
}

function responseComparison(phase, [accent, measured, pale]) {
  const theis = drawdown(0, -0.02);
  const lagged = sCurve();
  const items = [axes(p(0, -0.2), measured), ...dashedTrace(theis, measured, 3)];
  if (phase >= 1) items.push(...trace(lagged, accent, 5));
  if (phase === 2) items.push(polygon([p(-1.45, -0.86), p(-0.9, -0.55), p(-0.35, 0.08), p(0.45, 0.49), p(1.1, 0.64), p(0.45, 0.77), p(-0.35, 0.31), p(-0.9, -0.18)], accent, pale, 0.48, 0), math(String.raw`S_y`, p(-1.0, -1.35), accent, 22), math(String.raw`t`, p(2.9, -1.42), measured, 20));
  return field(items);
}

function lagPaths(phase, [accent, measured, pale]) {
  const items = [line(p(-2.75, -1.05), p(2.75, -1.05), measured, 3), arrow(p(-2.5, 1.2), p(-2.5, 0.55), accent, 5), circle(0.28, p(-2.5, 0.32), accent, pale, 0.5, 3), math(String.raw`Q`, p(-2.5, 1.55), accent, 23)];
  if (phase >= 1) items.push(...trace([[-2.2, -0.55], [-1.6, -0.45], [-0.95, -0.05], [-0.25, 0.58], [0.55, 0.84]], accent, 4), line(p(-1.55, -1.22), p(-0.25, -1.22), accent, 4), math(String.raw`\tau_h`, p(-0.9, -1.48), accent, 25), label("capillary", p(-0.65, 1.25), accent, 17));
  if (phase === 2) items.push(...trace([[-2.2, -0.72], [-1.8, -0.18], [-1.2, 0.45], [-0.45, 0.8], [0.55, 0.9]], measured, 4), line(p(-2.2, -0.88), p(-1.2, -0.88), measured, 4), math(String.raw`\tau_q`, p(-1.7, -1.18), measured, 25), ...[1.2, 1.65, 2.1].map((x) => arrow(p(x, 0.92), p(x, 0.25), measured, 3)), label("inertia", p(1.7, 1.25), measured, 17));
  return field(items);
}

function signalComponents(phase, [accent, measured, pale]) {
  const raw = drawdown(0, 0.25).map(([x, y], index) => [x, y + 0.12 * Math.sin(index * 2.2)]);
  const items = [axes(p(0, -0.15), measured), ...trace(raw, measured, 5)];
  if (phase >= 1) items.push(line(p(-2.7, 0.18), p(2.7, 0.18), pale, 4), ...trace(raw.map(([x, y]) => [x, y - 0.45]), accent, 3), math(String.raw`d+\epsilon(t)`, p(-1.75, 1.38), measured, 20));
  if (phase === 2) items.push(...trace(drawdown(0, -0.45), accent, 5), math(String.raw`h(t)=d+\epsilon(t)+h^*(t)`, p(0.55, 1.52), accent, 24));
  return field(items);
}

function unconfinedSection(phase, [accent, measured, pale], linearized = false) {
  const surface = [[-2.8, 1.15], [-2.1, 1.08], [-1.35, 0.9], [-0.65, 0.52], [0, 0.18], [0.7, 0.58], [1.45, 0.92], [2.2, 1.08], [2.8, 1.15]];
  const items = [polygon([p(-2.8, -1.35), ...surface.map(([x, y]) => p(x, y)), p(2.8, -1.35)], measured, pale, 0.55, 2), ...trace(surface, accent, 5), line(p(-2.8, -1.35), p(2.8, -1.35), measured, 4), rect(0.28, 3.0, p(0, 0.05), measured, "#FFFFFF", 0.9, 4)];
  if (phase >= 1) items.push(...[-2.1, -1.4, 1.4, 2.1].map((x) => arrow(p(x, 0.15), p(x < 0 ? x + 0.55 : x - 0.55, 0.15), accent, 3)), math(String.raw`h_p`, p(0.4, 0.35), accent, 24), math(String.raw`r`, p(2.9, -1.48), measured, 20));
  if (linearized && phase >= 1) items.push(line(p(-2.6, 0.72), p(2.6, 0.72), measured, 3), math(String.raw`h_p\partial_rh_p\approx\bar h_p\partial_rh_p`, p(0, 1.55), accent, 21));
  if (phase === 2) items.push(linearized
    ? math(String.raw`T(1+\tau_h\partial_t)\,r^{-1}\partial_r(r\partial_rh_p)=S_y(1+\tau_q\partial_t)\partial_th_p`, p(0, -1.72), accent, 17)
    : math(String.raw`r^{-1}\partial_r(rKh_p\partial_rh_p)=S_y\partial_th_p`, p(0, -1.72), accent, 21));
  return field(items);
}

function laggedDarcy(phase, [accent, measured, pale]) {
  const gradient = [[-2.7, -0.65], [-2.1, -0.3], [-1.5, 0.15], [-0.9, 0.65], [-0.3, 0.82], [0.4, 0.55], [1.1, 0.08], [1.8, -0.38], [2.7, -0.58]];
  const flux = gradient.map(([x, y]) => [x + 0.65, y - 0.18]);
  const items = [axes(p(0, -0.2), measured), ...trace(gradient, accent, 4), math(String.raw`-K\nabla h_p`, p(-1.55, 1.42), accent, 22)];
  if (phase >= 1) items.push(...trace(flux, measured, 4), arrow(p(-0.3, 1.05), p(0.35, 1.05), measured, 3), math(String.raw`q`, p(0.65, 1.4), measured, 22));
  if (phase === 2) items.push(math(String.raw`q(t+\tau_q)=-K\nabla h_p(t+\tau_h)`, p(0, -1.55), accent, 25), line(p(-0.2, -1.18), p(0.45, -1.18), pale, 5));
  return field(items);
}

function laplaceDomain(phase, [accent, measured, pale]) {
  const items = [circle(1.15, p(-1.85, 0), measured, pale, 0.1, 3), ...[0.45, 0.8, 1.15].map((r) => circle(r, p(-1.85, 0), measured, pale, 0.03, 2)), math(String.raw`h_p(r,t)`, p(-1.85, 1.48), measured, 23)];
  if (phase >= 1) items.push(arrow(p(-0.45, 0), p(0.35, 0), accent, 4), math(String.raw`\mathcal L_{t\to s}`, p(-0.05, 0.48), accent, 24), rect(2.3, 1.0, p(1.65, 0.55), accent, pale, 0.2));
  if (phase === 2) items.push(math(String.raw`\widetilde h_p=\frac{QK_0(\lambda)}{2\pi sT}`, p(1.65, 0.72), accent, 23), math(String.raw`\lambda=r\sqrt{\frac{sS_y(s\tau_q+1)}{T(s\tau_h+1)}}`, p(1.65, -0.45), measured, 20));
  return field(items);
}

function inverseStep(phase, [accent, measured, pale]) {
  const samples = [-2.65, -2.15, -1.65, -1.15].map((x, index) => dot(p(x, 0.72 - index * 0.18), measured, 0.07));
  const items = [line(p(-2.85, -0.85), p(-0.75, -0.85), measured, 3), ...samples, math(String.raw`\widetilde h_p(s)`, p(-1.8, 1.35), measured, 22)];
  if (phase >= 1) items.push(arrow(p(-0.55, 0), p(0.25, 0), accent, 4), math(String.raw`\mathcal L^{-1}`, p(-0.15, 0.5), accent, 24), axes(p(1.65, -0.25), measured, 2.7, 2.3));
  if (phase === 2) items.push(...trace(sCurve(1.7, -0.15).map(([x, y]) => [(x + 2.7) * 0.48 + 0.3, y * 0.75]), accent, 5), math(String.raw`h_p=Q\Theta_p(t)`, p(1.65, 1.35), accent, 23));
  return field(items);
}

function kernelScene(phase, [accent, measured, pale], uniform = false) {
  const step = sCurve(-1.55, 0.25).map(([x, y]) => [x * 0.52 - 0.95, y * 0.78]);
  const pulse = impulse(1.55, -0.05).map(([x, y]) => [x * 0.52 + 0.95, y * 0.78]);
  const hat = uniform ? String.raw`\widehat{\theta}_p(t)=\frac{d\widehat{\Theta}_p(t)}{dt}` : String.raw`\theta_p(t)=\frac{d\Theta_p(t)}{dt}`;
  const items = [axes(p(-1.65, -0.25), measured, 2.6, 2.25), ...trace(step, measured, 4)];
  if (phase >= 1) items.push(arrow(p(-0.3, 0), p(0.3, 0), accent, 4), math(String.raw`\frac d{dt}`, p(0, 0.5), accent, 24), axes(p(1.65, -0.25), measured, 2.6, 2.25));
  if (phase === 2) items.push(...trace(pulse, accent, 5), math(hat, p(0, 1.5), accent, 24));
  return field(items);
}

function convolutionScene(phase, [accent, measured, pale], uniform = false) {
  const bars = [[-2.65, 0.42], [-2.05, 0.85], [-1.45, 0.55], [-0.85, 1.05]];
  const response = sCurve(1.45, -0.18).map(([x, y]) => [x * 0.48 + 1.0, y * 0.75]);
  const items = [line(p(-2.95, -1.05), p(-0.55, -1.05), measured, 3), ...bars.slice(0, phase + 2).map(([x, h]) => rect(0.34, h, p(x, -1.05 + h / 2), accent, pale, 0.65)), math(String.raw`Q(t)`, p(-1.75, 1.42), accent, 22)];
  if (phase >= 1) items.push(arrow(p(-0.4, 0), p(0.2, 0), accent, 4), ...trace(impulse(0.8, 0).map(([x, y]) => [x * 0.22 + 0.05, y * 0.55]), measured, 3));
  if (phase === 2) items.push(axes(p(1.75, -0.28), measured, 2.45, 2.15), ...trace(response, accent, 5), math(uniform ? String.raw`\widehat h_p=\int_0^tQ(\tau)\widehat\theta_p(t-\tau)d\tau` : String.raw`h_p=\int_0^tQ(\tau)\theta_p(t-\tau)d\tau`, p(0.7, 1.52), accent, 19));
  return field(items);
}

function uniformDisk(phase, [accent, measured, pale]) {
  const wells = [[-1.7, 0.65], [-1.15, -0.35], [-0.45, 0.85], [0.15, -0.55], [0.75, 0.35], [1.45, -0.2], [1.75, 0.8]];
  const items = [circle(0.18, p(0, 0), accent, pale, 0.55, 4), math(String.raw`h_{obs}`, p(0, -0.42), accent, 18), ...wells.slice(0, 3 + phase * 2).map((at) => dot(p(...at), measured, 0.08))];
  if (phase >= 1) items.push(...[0.65, 1.25, 1.9].slice(0, phase + 1).map((radius) => circle(radius, p(0, 0), measured, pale, 0.05, 2)));
  if (phase === 2) items.push(circle(2.35, p(0, 0), accent, pale, 0.28, 4), line(p(0, 0), p(2.35, 0), accent, 3), math(String.raw`L`, p(1.18, 0.25), accent, 24), math(String.raw`\widehat\Theta_p`, p(0, 1.55), accent, 24));
  return field(items);
}

function fitScene(phase, [accent, measured, pale], synthetic = false) {
  const observed = sCurve(-1.2, -0.05).map(([x, y], index) => [x * 0.58 - 0.65, y * 0.8 + 0.05 * Math.sin(index * 1.8)]);
  const fitted = observed.map(([x, y], index) => [x, y + (2 - phase) * 0.07 * Math.cos(index)]);
  const items = [axes(p(-1.35, -0.25), measured, 3.5, 2.45), ...observed.map((at) => dot(p(...at), measured, 0.055)), ...trace(fitted, accent, 4)];
  const symbols = [String.raw`S_y`, String.raw`T`, String.raw`\tau_h`, String.raw`\tau_q`];
  symbols.forEach((symbol, index) => items.push(line(p(0.85, 1.0 - index * 0.58), p(2.85, 1.0 - index * 0.58), measured, 3), dot(p(1.15 + phase * 0.55 + index * 0.12, 1.0 - index * 0.58), index > 1 ? accent : measured, 0.08), math(symbol, p(0.45, 1.0 - index * 0.58), index > 1 ? accent : measured, 20)));
  if (phase === 2) items.push(math(synthetic ? String.raw`(S_y,T,\tau_h,\tau_q)_{est}` : String.raw`F=J^{-1}\sum_j(h_{obs,j}-\widehat h_{p,j})^2+\gamma`, p(0, 1.55), accent, synthetic ? 22 : 19));
  return field(items);
}

function pumpingRate(phase, [accent, measured, pale]) {
  const items = [axes(p(-1.6, -0.25), measured, 3.2, 2.35), ...trace(sCurve(-1.25, -0.2).map(([x, y]) => [x * 0.6 - 0.85, y * 0.75]), measured, 4), line(p(-2.35, -0.65), p(-0.55, -0.65), accent, 4), line(p(-2.35, -0.82), p(-2.35, -0.48), accent, 3), line(p(-0.55, -0.82), p(-0.55, -0.48), accent, 3), math(String.raw`t_p`, p(-1.45, -1.0), accent, 22)];
  if (phase >= 1) items.push(arrow(p(0.05, 0), p(0.75, 0), accent, 4), rect(0.75, 1.1 + 0.25 * phase, p(1.55, -0.75 + (1.1 + 0.25 * phase) / 2), accent, pale, 0.65), math(String.raw`Q`, p(1.55, -1.05), accent, 22));
  if (phase === 2) items.push(math(String.raw`Q=\frac{h_{obs}(t+t_p)-h_{obs}(t)}{\widehat\Theta_p(t_p)}`, p(0.8, 1.38), accent, 20));
  return field(items);
}

function reconstruct(phase, [accent, measured, pale]) {
  const observed = sCurve(1.4, -0.15).map(([x, y]) => [x * 0.5 + 0.95, y * 0.72]);
  const modeled = observed.map(([x, y], index) => [x, y + 0.035 * Math.sin(index)]);
  const items = [rect(0.62, 1.15, p(-2.35, -0.42), accent, pale, 0.65), math(String.raw`Q`, p(-2.35, -1.18), accent, 22), ...trace(impulse(-0.7, 0).map(([x, y]) => [x * 0.3 - 0.55, y * 0.65]), measured, 3)];
  if (phase >= 1) items.push(arrow(p(-1.85, 0), p(-0.95, 0), accent, 4), axes(p(1.45, -0.25), measured, 3.0, 2.35), ...observed.map((at) => dot(p(...at), measured, 0.055)));
  if (phase === 2) items.push(...trace(modeled, accent, 5), math(String.raw`\widehat h_p`, p(2.15, 1.25), accent, 22));
  return field(items);
}

function bootstrapScene(scene, phase, [accent, measured, pale]) {
  const residuals = [[-2.5, 0.65], [-2.0, -0.35], [-1.48, 0.3], [-0.95, -0.62], [-0.42, 0.48]];
  if (scene === 18) {
    const items = residuals.map((at, index) => dot(p(...at), index <= phase + 1 ? accent : measured, 0.09));
    if (phase >= 1) items.push(circle(1.05, p(1.45, 0), accent, pale, 0.12, 4), ...residuals.slice(0, phase + 2).map((at, index) => arrow(p(...at), p(1.45 + 0.55 * Math.cos(index * 2.2), 0.55 * Math.sin(index * 2.2)), accent, 2)));
    if (phase === 2) items.push(math(String.raw`\epsilon^*`, p(1.45, 0), accent, 25), label("with replacement", p(1.45, -1.42), measured, 16));
    return field(items);
  }
  if (scene === 19) {
    const model = drawdown(0, -0.2);
    const items = [axes(p(0, -0.25), measured), ...trace(model, accent, 4)];
    if (phase >= 1) items.push(...model.slice(0, 3 + phase * 2).map(([x, y], index) => arrow(p(x, y), p(x, y + residuals[index % residuals.length][1] * 0.25), measured, 2)));
    if (phase === 2) items.push(...model.map(([x, y], index) => dot(p(x, y + residuals[index % residuals.length][1] * 0.25), measured, 0.06)));
    return field(items);
  }
  if (scene === 20) return fitScene(phase, [accent, measured, pale], true);
  const items = [];
  const centers = [-2.25, -0.75, 0.75, 2.25];
  centers.forEach((x, column) => {
    const count = 3 + phase * 3;
    const points = Array.from({ length: count }, (_, index) => [x + 0.34 * Math.sin(index * 1.7 + column), -1.05 + index * 0.28]);
    items.push(...points.map((at) => dot(p(...at), column > 1 ? accent : measured, 0.045)), math([String.raw`S_y`, String.raw`T`, String.raw`\tau_h`, String.raw`\tau_q`][column], p(x, -1.48), column > 1 ? accent : measured, 20));
    if (phase === 2) items.push(...trace([[x - 0.48, -0.95], [x - 0.3, -0.3], [x, 0.9], [x + 0.3, -0.3], [x + 0.48, -0.95]], column > 1 ? accent : measured, 3));
  });
  return field(items);
}

function morrisScene(scene, phase, [accent, measured, pale]) {
  if (scene === 22) {
    const items = [rect(5.7, 0.75, p(0, 0.25), measured, pale, 0.2)];
    [String.raw`S_y`, String.raw`T`, String.raw`\tau_h`, String.raw`\tau_q`].forEach((symbol, index) => items.push(circle(0.32, p(-2.1 + index * 1.4, 0.25), index === phase + 1 ? accent : measured, pale, index === phase + 1 ? 0.55 : 0.15, 3), math(symbol, p(-2.1 + index * 1.4, 0.25), index === phase + 1 ? accent : measured, 20)));
    if (phase >= 1) items.push(arrow(p(-0.7 + phase * 1.4, 1.3), p(-0.7 + phase * 1.4, 0.65), accent, 4), math(String.raw`+\Delta`, p(-0.7 + phase * 1.4, 1.58), accent, 22));
    return field(items);
  }
  if (scene === 23) {
    const base = drawdown(0, -0.15);
    const shifted = base.map(([x, y], index) => [x, y + 0.18 * Math.exp(-index * 0.12)]);
    const items = [axes(p(0, -0.25), measured), ...trace(base, measured, 4)];
    if (phase >= 1) items.push(...trace(shifted, accent, 4), ...base.slice(1, 2 + phase * 2).map((at, index) => line(p(...at), p(...shifted[index + 1]), pale, 4)));
    if (phase === 2) items.push(math(String.raw`EE_k(t)=\frac{\widehat h_p(t;P_k+\Delta)-\widehat h_p(t;P_k)}{\Delta}`, p(0, 1.5), accent, 19));
    return field(items);
  }
  const values = [-2.45, -1.95, -1.45, -0.95, -0.45].map((x, index) => [x, -0.75 + 0.38 * Math.sin(index * 1.5)]);
  const items = [...values.map((at) => dot(p(...at), scene === 24 ? accent : measured, 0.08)), arrow(p(-0.05, 0), p(0.65, 0), accent, 4)];
  if (scene === 24) {
    if (phase >= 1) items.push(...values.slice(0, 2 + phase).map(([x, y]) => line(p(x, 0), p(x, Math.abs(y)), pale, 3)));
    if (phase === 2) items.push(circle(0.55, p(1.65, 0), accent, pale, 0.35, 4), math(String.raw`\mu_k^*(t)=N^{-1}\sum_n|EE_k^{(n)}(t)|`, p(0.7, 1.25), accent, 21));
  } else {
    if (phase >= 1) items.push(line(p(-2.6, 0), p(-0.3, 0), accent, 3), ...values.map(([x, y]) => line(p(x, 0), p(x, y * (phase + 1) * 0.7), measured, 2)));
    if (phase === 2) items.push(circle(0.82, p(1.65, 0), measured, pale, 0.18, 4), math(String.raw`\sigma_k(t)`, p(1.65, 0), accent, 26), arrow(p(1.65, 0), p(2.45, 0.65), measured, 3));
  }
  return field(items);
}

function sensitivityThroughTime(phase, [accent, measured, pale]) {
  const items = [axes(p(0, -0.25), measured)];
  const curves = [
    [[-2.65, -0.7], [-1.8, 0.05], [-0.9, 0.62], [0, 0.45], [1.0, 0.18], [2.65, 0.05]],
    [[-2.65, -0.62], [-1.8, -0.3], [-0.9, 0.1], [0, 0.72], [1.0, 0.5], [2.65, 0.22]],
    [[-2.65, -0.82], [-1.8, -0.65], [-0.9, -0.3], [0, 0.0], [1.0, 0.62], [2.65, 0.85]],
    [[-2.65, -0.72], [-1.8, -0.2], [-0.9, 0.38], [0, 0.18], [1.0, 0.75], [2.65, 0.48]],
  ];
  curves.forEach((points, index) => items.push(...trace(points.slice(0, 3 + phase * 2), index > 1 ? accent : measured, index === phase ? 5 : 2)));
  const cursor = [-1.5, 0, 1.55][phase];
  items.push(line(p(cursor, -1.3), p(cursor, 1.2), accent, 3), math(String.raw`T\quad S_y\quad\tau_h\quad\tau_q`, p(0, 1.48), accent, 22));
  return field(items);
}

function syntheticScene(scene, phase, [accent, measured, pale]) {
  const bars = [[-2.65, 0.45], [-2.08, 0.9], [-1.52, 0.58], [-0.96, 1.12], [-0.4, 0.72]];
  const curve = sCurve(1.25, -0.12).map(([x, y]) => [x * 0.5 + 0.85, y * 0.72]);
  if (scene === 27) {
    const items = [line(p(-2.9, -1.05), p(-0.2, -1.05), measured, 3), ...bars.slice(0, 2 + phase).map(([x, h]) => rect(0.32, h, p(x, -1.05 + h / 2), accent, pale, 0.6))];
    if (phase >= 1) items.push(arrow(p(-0.1, 0), p(0.5, 0), accent, 4), axes(p(1.8, -0.25), measured, 2.4, 2.15));
    if (phase === 2) items.push(...trace(curve, accent, 5), math(String.raw`S_y,T,\tau_h,\tau_q`, p(1.65, 1.38), accent, 20));
    return field(items);
  }
  if (scene === 28) {
    const items = [axes(p(0, -0.25), measured), ...trace(sCurve(0, -0.12), accent, 4)];
    if (phase >= 1) items.push(...sCurve(0, -0.12).slice(0, 3 + phase * 3).map(([x, y], index) => dot(p(x, y + 0.1 * Math.sin(index * 2.4)), measured, 0.065)));
    if (phase === 2) items.push(math(String.raw`\widehat h_p+\epsilon R_N`, p(1.95, 1.38), accent, 22));
    return field(items);
  }
  if (scene === 29) return fitScene(phase, [accent, measured, pale], true);
  const symbols = [String.raw`S_y`, String.raw`T`, String.raw`\tau_h`, String.raw`\tau_q`];
  const items = [];
  symbols.forEach((symbol, index) => {
    const y = 1.1 - index * 0.72;
    items.push(line(p(-2.45, y), p(2.45, y), pale, 4), dot(p(-0.55, y), measured, 0.11), math(symbol, p(-2.85, y), measured, 20));
    if (phase >= 1) items.push(dot(p(-0.55 + (2 - phase) * 0.18 * (index % 2 ? -1 : 1), y), accent, 0.08));
    if (phase === 2) items.push(circle(0.22, p(-0.55, y), accent, pale, 0.05, 3));
  });
  items.push(label("target", p(-0.55, -1.58), measured, 16), label("recovered", p(1.2, -1.58), accent, 16));
  return field(items);
}

function fieldScreening(scene, phase, [accent, measured, pale]) {
  if (scene === 31) {
    const hydro = drawdown(0, -0.15);
    const items = [axes(p(0, -0.25), measured), ...trace(hydro, accent, 4)];
    const rain = [[-2.3, 0.65], [-0.65, 0.9], [1.35, 0.72]];
    if (phase >= 1) items.push(...rain.slice(0, phase + 1).map(([x, h]) => rect(0.5, 2.2, p(x, 0), measured, pale, 0.55, 0)), ...rain.slice(0, phase + 1).map(([x, h]) => arrow(p(x, 1.25), p(x, h), measured, 2)));
    if (phase === 2) items.push(line(p(-2.65, -1.35), p(-1.0, -1.35), accent, 5), line(p(-0.35, -1.35), p(1.0, -1.35), accent, 5), math(String.raw`P=0`, p(2.0, 1.35), accent, 22));
    return field(items);
  }
  if (scene === 32) {
    const widths = [0.9, 1.65, 2.5];
    const items = [line(p(-2.8, -0.45), p(2.8, -0.45), measured, 4), ...Array.from({ length: 7 }, (_, index) => line(p(-2.7 + index * 0.9, -0.62), p(-2.7 + index * 0.9, -0.28), measured, 2)), math(String.raw`6\ \mathrm{hr}`, p(0, -0.95), accent, 23)];
    widths.forEach((width, index) => items.push(rect(width, 0.42, p(-2.0 + index * 2.0, 0.55), index <= phase ? accent : measured, pale, 0.48), math(`${[3, 6, 9][index]}\\,\\mathrm{hr}`, p(-2.0 + index * 2.0, 1.05), index <= phase ? accent : measured, 18)));
    if (phase === 2) items.push(line(p(-2.45, 0.12), p(-1.55, 0.98), measured, 5), line(p(-2.45, 0.98), p(-1.55, 0.12), measured, 5), circle(0.28, p(0, 0.55), accent, pale, 0.06, 4), circle(0.28, p(2, 0.55), accent, pale, 0.06, 4));
    return field(items);
  }
  const stations = Array.from({ length: 21 }, (_, index) => [-2.55 + (index % 7) * 0.85, 1.05 - Math.floor(index / 7) * 0.9]);
  const removed = new Set([4, 12, 18]);
  const items = stations.map((at, index) => dot(p(...at), phase === 2 && removed.has(index) ? pale : measured, 0.09));
  if (phase >= 1) [...removed].slice(0, phase === 1 ? 2 : 3).forEach((index) => {
    const [x, y] = stations[index];
    items.push(line(p(x - 0.18, y - 0.18), p(x + 0.18, y + 0.18), accent, 4), line(p(x - 0.18, y + 0.18), p(x + 0.18, y - 0.18), accent, 4));
  });
  if (phase === 2) items.push(math(String.raw`21-3=18`, p(0, -1.55), accent, 26));
  return field(items);
}

function fieldResults(scene, phase, [accent, measured, pale]) {
  if (scene === 34) {
    const centers = [[-1.65, 0.75], [1.45, 0.75], [-1.65, -0.85], [1.45, -0.85]];
    const items = [];
    centers.forEach(([cx, cy], panel) => {
      const obs = [[cx - 0.9, cy - 0.35], [cx - 0.45, cy - 0.05], [cx, cy + 0.18], [cx + 0.45, cy + 0.3], [cx + 0.9, cy + 0.37]];
      items.push(rect(2.25, 1.25, p(cx, cy), measured, "#FFFFFF", 0.02, 2), ...obs.map((at) => dot(p(...at), measured, 0.05)));
      if (phase >= 1) items.push(...trace(obs.map(([x, y], index) => [x, y + (2 - phase) * 0.03 * Math.sin(index + panel)]), accent, 3));
    });
    if (phase === 2) items.push(math(String.raw`18\ \mathrm{stations}`, p(0, 1.65), accent, 22));
    return field(items);
  }
  const centers = [-2.25, -0.75, 0.75, 2.25];
  const symbols = [String.raw`S_y`, String.raw`T`, String.raw`\tau_h`, String.raw`\tau_q`];
  const items = [];
  centers.forEach((x, column) => {
    const samples = Array.from({ length: 6 + phase * 6 }, (_, index) => [x + 0.22 * Math.sin(index * 1.7 + column), -1.0 + (index % 9) * 0.24]);
    items.push(...samples.map((at) => dot(p(...at), column > 1 ? accent : measured, 0.04)), math(symbols[column], p(x, -1.48), column > 1 ? accent : measured, 20));
    if (scene >= 36 && phase >= 1) items.push(line(p(x - 0.42, 0.05 + column * 0.08), p(x + 0.42, 0.05 + column * 0.08), accent, 5), dot(p(x, 0.05 + column * 0.08), accent, 0.08));
    if (scene === 37 && phase === 2) items.push(line(p(x, -0.75 + column * 0.08), p(x, 0.85 - column * 0.05), measured, 4), line(p(x - 0.18, -0.75 + column * 0.08), p(x + 0.18, -0.75 + column * 0.08), measured, 3), line(p(x - 0.18, 0.85 - column * 0.05), p(x + 0.18, 0.85 - column * 0.05), measured, 3));
  });
  if (scene === 36 && phase === 2) items.push(math(String.raw`0.175\quad22.710\,\mathrm{m^2\,hr^{-1}}\quad9.930\,\mathrm{hr}\quad37.234\,\mathrm{hr}`, p(0, 1.55), accent, 16));
  if (scene === 37 && phase === 2) items.push(math(String.raw`95\%\ \mathrm{CI}`, p(0, 1.55), accent, 24));
  return field(items);
}

function finalField(phase, [accent, measured, pale]) {
  const basin = [p(-3.0, 1.25), p(-1.7, 1.55), p(-0.35, 1.25), p(0.35, 0.55), p(-0.05, -1.25), p(-1.65, -1.55), p(-2.85, -0.85)];
  const stations = Array.from({ length: 18 }, (_, index) => [-2.65 + (index % 6) * 0.48, 1.08 - Math.floor(index / 6) * 0.88]);
  const items = [polygon(basin, measured, pale, 0.5, 3), ...stations.slice(0, 6 + phase * 6).map((at, index) => dot(p(...at), index % 4 === 0 ? accent : measured, 0.055))];
  if (phase >= 1) items.push(...stations.filter((_, index) => index % 4 === 0).map((at) => circle(0.28 + phase * 0.1, p(...at), accent, pale, 0.08, 2)), axes(p(1.95, 0.35), measured, 2.2, 1.75), ...trace(sCurve(1.65, 0.15).map(([x, y]) => [x * 0.35 + 1.35, y * 0.5]), accent, 4));
  if (phase === 2) items.push(...sCurve(1.65, 0.15).filter((_, index) => index % 2 === 0).map(([x, y]) => dot(p(x * 0.35 + 1.35, y * 0.5 + 0.025), measured, 0.045)), ...[-0.65, 0.15, 0.95, 1.75].map((x, index) => line(p(x, -1.45), p(x, -0.65 + index * 0.08), index > 1 ? accent : measured, 4)), math(String.raw`S_y\quad T\quad\tau_h\quad\tau_q`, p(0.55, -1.72), accent, 20), math(String.raw`r\leq L`, p(-1.65, 1.72), accent, 20));
  return field(items);
}

const SCENE_PATTERNS = [
  /unknown pumping|unresolved pumping/, /unconfined response|s-shaped/, /two lags|capillary and inertial flow paths/,
  /isolate pumping response|separating into trend/, /dupuit radial flow|unconfined radial flow/, /lagging darcy relation|flux and head-gradient/,
  /linearized lagging equation|variable saturated profile/, /laplace domain|laplace-domain (?:hydraulic|head)/, /invert step response|time-domain pumping step/,
  /step response differentiating|compact impulse kernel|single-well impulse response function/, /convolve pumping|kernel sliding across pumping pulses|arbitrary pumping histories/, /single-well response rings merging|integrate circular responses|(?:^|\] )uniform step response$/,
  /uniform impulse|regional impulse kernel/, /uniform drawdown|uniform regional kernel accumulating|modeled observation-well/, /penalized fit|four parameter controls/,
  /estimate pumping rate|head change transforming/, /reconstruct drawdown|reproduce the drawdown/, /resample residuals|replacement-sampling/,
  /build bootstrap data|added pointwise/, /refit each replicate|synthetic hydrograph entering/, /bootstrap distributions|four empirical distributions/,
  /perturb one factor|one control displaced/, /\belementary effect\b(?!s)|two drawdown traces separated/, /absolute mean effect|mu-star/,
  /effect standard deviation|sigma coordinate/, /sensitivity through time|moving time cursor/, /generate known response|random pumping bars/,
  /add measurement error|measurement perturbations/, /recover parameters|disturbed observations entering/, /compare with truth|known target markers/,
  /rain-free periods|rainfall periods masked/, /at least 6 hours|six-hour duration/, /18 pumping-event stations|twenty-one station/,
  /fit field hydrographs|observed station hydrographs/, /collect station estimates|four parameter columns/, /field medians|four station-estimate columns each receiving a median marker(?:\.|$)/,
  /field 95% intervals|confidence brackets/, /parameters without pump logs|choshui observation wells/,
];

function sceneFromText(text) {
  const index = SCENE_PATTERNS.findIndex((pattern) => pattern.test(text));
  return index === -1 ? null : index + 1;
}

function renderScene(scene, phase, colors) {
  switch (scene) {
    case 1: return unknownPumping(phase, colors);
    case 2: return responseComparison(phase, colors);
    case 3: return lagPaths(phase, colors);
    case 4: return signalComponents(phase, colors);
    case 5: return unconfinedSection(phase, colors, false);
    case 6: return laggedDarcy(phase, colors);
    case 7: return unconfinedSection(phase, colors, true);
    case 8: return laplaceDomain(phase, colors);
    case 9: return inverseStep(phase, colors);
    case 10: return kernelScene(phase, colors, false);
    case 11: return convolutionScene(phase, colors, false);
    case 12: return uniformDisk(phase, colors);
    case 13: return kernelScene(phase, colors, true);
    case 14: return convolutionScene(phase, colors, true);
    case 15: return fitScene(phase, colors, false);
    case 16: return pumpingRate(phase, colors);
    case 17: return reconstruct(phase, colors);
    case 18: case 19: case 20: case 21: return bootstrapScene(scene, phase, colors);
    case 22: case 23: case 24: case 25: return morrisScene(scene, phase, colors);
    case 26: return sensitivityThroughTime(phase, colors);
    case 27: case 28: case 29: case 30: return syntheticScene(scene, phase, colors);
    case 31: case 32: case 33: return fieldScreening(scene, phase, colors);
    case 34: case 35: case 36: case 37: return fieldResults(scene, phase, colors);
    case 38: return finalField(phase, colors);
    default: return null;
  }
}

export function renderPaperVisual2024_06_19(context) {
  const unpacked = unpackContext(context);
  if (!unpacked.text.includes(PAPER_MARKER)) return null;
  return renderScene(unpacked.scene ?? sceneFromText(unpacked.text), unpacked.phase, unpacked.colors);
}
