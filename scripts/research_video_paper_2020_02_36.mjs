const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const point = ([x, y]) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (xy, color, radius = 0.08) => `Dot(${point(xy)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, xy, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0.2) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const arc = (radius, xy, color, width = 3) => `Arc(radius=${radius}, start_angle=0.2, angle=2.75, color=${q(color)}, stroke_width=${width}).shift(${point(xy)})`;
const math = (latex, xy, color, size = 24) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const label = (value, xy, color, size = 19) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const axes = (xy, color, width = 3, height = 2.4, xRange = "[0, 4, 1]", yRange = "[0, 1, 0.25]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${point(xy)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((xy, index) => line(xy, points[index + 1], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const normalizePalette = (palette) => {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [source[0] ?? DEFAULT_PALETTE[0], source[1] ?? DEFAULT_PALETTE[1], source[2] ?? DEFAULT_PALETTE[2]].map(String);
};
const descriptionText = (description) => {
  const values = typeof description === "object" && description !== null
    ? [description.marker, description.visualObject, description.stepDetail, description.visibleEvidence, description.motionPurpose, description.output, description.claim]
    : [description];
  return values.filter((value) => typeof value === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
};

function constantHead(phase, [accent, measured, pale]) {
  const rate = [0.92, 0.58, 0.28][phase];
  const needle = [[2.48, 0.88], [2.3, 0.65], [2.08, 0.5]][phase];
  const items = [
    rect(5.8, 2.85, [-0.25, -0.2], measured, pale, 0.32), rect(0.58, 3.25, [-1.55, -0.05], accent, "#FFFFFF", 0.92),
    line([-1.81, 0.72], [-1.29, 0.72], accent, 6), math(String.raw`s_w=\mathrm{constant}`, [-1.55, 1.35], accent, 23),
    ...[-2.85, -2.35, -0.9, -0.35].map((x) => arrow([x, -0.35], [x < -1.55 ? -1.88 : -1.22, -0.35], measured, 3)),
    line([-1.3, 0.72], [1.65, 0.72], measured, 3), arc(0.72, [2.05, 0.18], measured, 4), line([2.05, 0.18], needle, accent, 5),
    math(String.raw`q_D`, [2.05, -0.72], accent, 26), math(String.raw`r_w=0.05\,\mathrm{m}`, [-1.55, -1.78], measured, 19),
  ];
  if (phase >= 1) items.push(arrow([1.1, -1.25], [1.1 - rate, -1.25], accent, 5), math(String.raw`q_D(t)\downarrow`, [1.7, -1.25], accent, 23));
  if (phase === 2) items.push(circle(0.13, [-1.55, 0.72], accent, 4, pale, 0.55), label("flow meter", [2.05, 1.25], measured, 18));
  return field(items);
}

function rateDependentLoss(phase, [accent, measured, pale]) {
  const skin = [[-2.45, -1.0], [-1.55, -0.55], [-0.65, -0.1], [0.25, 0.35], [1.15, 0.8], [2.05, 1.25]];
  const total = [[-2.45, -1.0], [-1.55, -0.48], [-0.65, 0.08], [0.25, 0.68], [1.15, 1.28], [2.05, 1.62]];
  const items = [axes([-0.2, 0], measured, 5.4, 3.2, "[0, 5, 1]", "[0, 4, 1]"), ...trace(skin, measured, 3), math(String.raw`S_fq_D`, [1.95, 0.82], measured, 21)];
  if (phase >= 1) items.push(...trace(total, accent, 5), math(String.raw`S_fq_D+D^*q_D^2`, [0.55, 1.65], accent, 22));
  if (phase === 2) items.push(line([1.15, 0.8], [1.15, 1.28], accent, 6), math(String.raw`D\ [\mathrm{min\,m^{-3}}]`, [-1.8, 1.55], accent, 19), arrow([1.48, 1.04], [1.2, 1.1], accent, 3));
  return field(items);
}

function radialBalance(phase, [accent, measured, pale]) {
  const radii = [0.42, 0.82, 1.22, 1.62].slice(0, phase + 2);
  const items = [rect(3.75, 3.75, [-1.45, 0], measured, pale, 0.22), ...radii.map((radius, index) => circle(radius, [-1.45, 0], index === 0 ? accent : measured, index === 0 ? 5 : 2))];
  items.push(...[-1.05, -0.35, 0.35, 1.05].map((y) => arrow([-3.0, y], [-1.88, y * 0.35], accent, 3)));
  if (phase >= 1) items.push(math(String.raw`\frac{T}{r}\frac{\partial}{\partial r}\!\left(r\frac{\partial s}{\partial r}\right)=S\frac{\partial s}{\partial t}`, [1.35, 0.45], accent, 22), math(String.raw`s=s(r,t)`, [1.35, -0.35], measured, 23));
  if (phase === 2) items.push(math(String.raw`T\ [\mathrm{m^2\,min^{-1}}]\quad S\ [-]`, [1.35, -1.25], measured, 19), circle(0.16, [-1.45, 0], accent, 5, pale, 0.5));
  return field(items);
}

function screenBoundary(phase, [accent, measured, pale]) {
  const items = [rect(2.15, 3.25, [-2.0, 0], measured, pale, 0.3), rect(0.35, 3.45, [-0.7, 0], accent, "#FFFFFF", 0.9), ...[-0.8, 0, 0.8].map((y) => arrow([-2.55, y], [-0.95, y], measured, 3)), math(String.raw`r_D=1`, [-0.7, -1.75], measured, 21)];
  const blocks = [["s_D(1)", 1.08], [String.raw`S_f(-s_D')`, 0.22], [String.raw`D^*(s_D')^2`, -0.64]];
  blocks.slice(0, phase + 1).forEach(([value, y], index) => items.push(rect(2.2, 0.62, [1.55, y], index === phase ? accent : measured, pale, 0.35), math(value, [1.55, y], index === phase ? accent : measured, 21)));
  if (phase >= 1) items.push(line([0.45, -1.18], [2.65, -1.18], measured, 3));
  if (phase === 2) items.push(math(String.raw`s_D-S_fs_D'+D^*(s_D')^2=1`, [0.95, -1.58], accent, 20));
  return field(items);
}

function movingBoundary(phase, [accent, measured, pale]) {
  const radius = [0.95, 1.35, 1.72][phase];
  const profile = [[0.25, -1.0], [0.75, -0.62], [1.25, -0.3], [1.75, -0.04], [2.25, 0.18], [2.75, 0.35]].map(([x, y]) => [x, y - phase * 0.08]);
  const items = [circle(0.22, [-1.9, 0], accent, 5, pale, 0.45), circle(radius, [-1.9, 0], measured, 4), ...[0, 1.57, 3.14, 4.71].map((angle, index) => {
    const ends = [[-1.9 + radius, 0], [-1.9, radius], [-1.9 - radius, 0], [-1.9, -radius]];
    return arrow([-1.9, 0], ends[index], index === phase ? accent : measured, 3);
  }), axes([1.45, -0.25], measured, 2.9, 2.45), ...trace(profile, accent, 4), math(String.raw`s_D(R_D)=0`, [1.55, 1.2], measured, 21)];
  if (phase >= 1) items.push(math(String.raw`R_D(t_D)=1+\sqrt{\pi t_D}`, [0.6, 1.72], accent, 23));
  if (phase === 2) items.push(dot([2.75, 0.19], accent, 0.12), math(String.raw`\ln(R_D/r_D)`, [1.45, -1.55], measured, 20));
  return field(items);
}

function solveCoefficients(phase, [accent, measured, pale]) {
  const profile = [[-2.55, 1.15], [-1.95, 0.82], [-1.3, 0.45], [-0.6, 0.12], [0.1, -0.18]];
  const items = [axes([-1.25, -0.15], measured, 3.6, 2.7), ...trace(profile, accent, 4), dot([-2.55, 1.15], accent, 0.11), dot([0.1, -0.18], measured, 0.11), math(String.raw`r_D=1`, [-2.5, -1.45], measured, 19), math(String.raw`r_D=R_D`, [0.05, -1.45], measured, 19)];
  if (phase >= 1) items.push(rect(2.75, 0.68, [1.55, 0.85], measured, pale, 0.25), math(String.raw`s_D=A_1+A_2\ln r_D`, [1.55, 0.85], accent, 22), math(String.raw`A_1=-A_2\ln R_D`, [1.55, 0.05], measured, 21));
  if (phase === 2) items.push(rect(3.45, 0.88, [1.25, -0.95], accent, pale, 0.28), math(String.raw`A_2=\frac{L-\sqrt{L^2+4D^*}}{2D^*},\ L=\ln R_D+S_f`, [1.25, -0.95], accent, 19));
  return field(items);
}

function drawdownSolution(phase, [accent, measured, pale]) {
  const profiles = [
    [[-2.65, 1.22], [-1.9, 0.72], [-1.1, 0.28], [-0.25, -0.02], [0.75, -0.2]],
    [[-2.65, 1.22], [-1.8, 0.86], [-0.85, 0.5], [0.2, 0.18], [1.45, -0.08]],
    [[-2.65, 1.22], [-1.7, 0.98], [-0.55, 0.68], [0.75, 0.35], [2.45, -0.02]],
  ];
  const items = [axes([-0.25, -0.2], measured, 5.4, 2.85, "[1, 8, 1]", "[0, 1, 0.25]")];
  profiles.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === phase ? accent : measured, index === phase ? 5 : 2), dot(points.at(-1), index === phase ? accent : measured, 0.09)));
  items.push(math(String.raw`s_D=-A_2(t_D)\ln\!\left(R_D/r_D\right)`, [0.1, 1.48], accent, 22));
  if (phase >= 1) items.push(math(String.raw`t_{D,1}<t_{D,2}<t_{D,3}`, [1.8, -1.48], measured, 19));
  if (phase === 2) items.push(math(String.raw`s_D\ [-]\quad r_D\ [-]`, [-1.65, -1.5], measured, 18));
  return field(items);
}

function flowrateGauge(phase, [accent, measured, pale]) {
  const profile = [[-2.95, 1.15], [-2.45, 0.62], [-1.9, 0.18], [-1.2, -0.12], [-0.45, -0.32]];
  const needle = [[2.55, 0.92], [2.3, 0.65], [2.02, 0.52]][phase];
  const items = [axes([-1.7, -0.2], measured, 3.3, 2.65), ...trace(profile, accent, 4), line([-2.95, -1.3], [-2.95, 1.2], measured, 4), arrow([-2.72, 0.92], [-2.42, 0.62], accent, 4), math(String.raw`-s_D'(1)`, [-2.2, 1.45], accent, 21), arc(0.82, [2.0, 0.05], measured, 4), line([2.0, 0.05], needle, accent, 5), math(String.raw`q_D`, [2.0, -0.92], accent, 27)];
  if (phase >= 1) items.push(arrow([-0.25, 0.1], [0.8, 0.1], accent, 4), math(String.raw`q_D=-\left.\frac{\partial s_D}{\partial r_D}\right|_{1}`, [0.25, 0.72], measured, 20));
  if (phase === 2) items.push(math(String.raw`q_D=-\frac{L-\sqrt{L^2+4D^*}}{2D^*}`, [0.6, -1.42], accent, 20), label("declining rate", [2.0, 1.45], measured, 18));
  return field(items);
}

function numericalVerification(phase, [accent, measured, pale]) {
  const temporal = [[-2.85, -0.95], [-2.45, -0.2], [-2.0, 0.35], [-1.5, 0.72], [-0.85, 0.95]];
  const spatial = [[0.5, 1.0], [1.0, 0.72], [1.55, 0.42], [2.15, 0.12], [2.8, -0.08]];
  const offsets = [0.0, -0.28, -0.55];
  const items = [axes([-1.75, -0.1], measured, 2.8, 2.55), axes([1.75, -0.1], measured, 2.8, 2.55), math(String.raw`s_D(t_D),\ r_D=1`, [-1.75, 1.48], measured, 20), math(String.raw`s_D(r_D),\ t_D=100`, [1.75, 1.48], measured, 20)];
  offsets.slice(0, phase + 1).forEach((offset, index) => {
    const left = temporal.map(([x, y]) => [x, y + offset]);
    const right = spatial.map(([x, y]) => [x, y + offset]);
    items.push(...trace(left, index === phase ? accent : pale, index === phase ? 4 : 2), ...trace(right, index === phase ? accent : pale, index === phase ? 4 : 2), ...left.map(([x, y]) => dot([x, y + 0.025 * (index % 2 ? -1 : 1)], measured, 0.055)), ...right.map(([x, y]) => dot([x, y - 0.025], measured, 0.055)));
  });
  items.push(math(String.raw`D^*=0.1,\ 1,\ 10`, [0, -1.62], accent, 22));
  if (phase >= 1) items.push(line([-0.45, 1.08], [0.05, 1.08], accent, 4), label("analytical", [0.62, 1.08], accent, 16));
  if (phase === 2) items.push(dot([-0.2, 0.65], measured, 0.08), label("finite difference", [0.75, 0.65], measured, 16));
  return field(items);
}

function sensitivityPanels(phase, [accent, measured, pale]) {
  const sCurves = [
    [[-2.9, -0.75], [-2.4, 0.25], [-1.85, 0.92], [-1.25, 0.35], [-0.65, -0.15]],
    [[-2.9, -0.6], [-2.4, -0.25], [-1.85, 0.08], [-1.25, 0.25], [-0.65, 0.32]],
    [[-2.9, -0.5], [-2.4, -0.38], [-1.85, -0.2], [-1.25, -0.05], [-0.65, 0.02]],
  ];
  const qCurves = [
    [[0.55, -0.72], [1.05, 0.05], [1.6, 0.72], [2.2, 1.02], [2.85, 1.12]],
    [[0.55, -0.55], [1.05, -0.12], [1.6, 0.2], [2.2, 0.38], [2.85, 0.45]],
    [[0.55, -0.42], [1.05, -0.3], [1.6, -0.12], [2.2, 0.0], [2.85, 0.08]],
  ];
  const items = [axes([-1.75, -0.1], measured, 2.8, 2.55, "[0, 4, 1]", "[-1, 1, 0.5]"), axes([1.75, -0.1], measured, 2.8, 2.55, "[0, 4, 1]", "[-1, 1, 0.5]"), math(String.raw`X_k(s_D)`, [-1.75, 1.48], accent, 22), math(String.raw`X_k(q_D)`, [1.75, 1.48], accent, 22)];
  sCurves.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === 0 ? accent : measured, index === 0 ? 4 : 2)));
  qCurves.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === 0 ? accent : measured, index === 0 ? 4 : 2)));
  if (phase >= 1) items.push(math(String.raw`X_k=P_k\,\partial O/\partial P_k`, [0, -1.58], measured, 20));
  if (phase === 2) items.push(math(String.raw`S:\ s_D\ (t<30\,\mathrm{s})`, [-1.75, 1.08], accent, 17), math(String.raw`T:\ q_D`, [1.75, 1.08], accent, 19), math(String.raw`S_f,\ D`, [0, -1.15], measured, 18));
  return field(items);
}

function fieldFit(phase, [accent, measured, pale]) {
  const observedLeft = [[-2.9, -0.95], [-2.45, -0.52], [-2.0, -0.08], [-1.5, 0.35], [-0.9, 0.72], [-0.4, 0.92]];
  const observedRight = observedLeft.map(([x, y], index) => [x + 3.55, y - 0.12 + index * 0.025]);
  const candidates = [
    (points) => points.map(([x, y], index) => [x, y + 0.28 * Math.sin(index * 0.9)]),
    (points) => points.map(([x, y], index) => [x, y + 0.14 * Math.sin(index * 0.9)]),
    (points) => points.map(([x, y], index) => [x, y + 0.025 * Math.sin(index)]),
  ];
  const items = [axes([-1.75, -0.1], measured, 2.8, 2.55), axes([1.8, -0.1], measured, 2.8, 2.55), ...observedLeft.map((xy) => dot(xy, measured, 0.07)), ...observedRight.map((xy) => dot(xy, measured, 0.07)), math(String.raw`\mathrm{CHIT1}:\ 58\,\mathrm{h},\ s_w=10.1\,\mathrm{m}`, [-1.75, 1.48], measured, 17), math(String.raw`\mathrm{CHIT2}:\ 67\,\mathrm{h},\ s_w=13.48\,\mathrm{m}`, [1.8, 1.48], measured, 17)];
  for (let index = 0; index <= phase; index += 1) {
    const color = index === phase ? accent : index === 0 ? pale : measured;
    items.push(...trace(candidates[index](observedLeft), color, index === phase ? 4 : 2), ...trace(candidates[index](observedRight), color, index === phase ? 4 : 2));
  }
  items.push(math(String.raw`t\ [\mathrm{min}]`, [2.95, -1.42], measured, 17), math(String.raw`V_w\ [\mathrm{m^3}]`, [-3.12, 1.08], measured, 17));
  if (phase === 2) items.push(label("Present", [0, -1.58], accent, 18), label("observed", [0, -1.22], measured, 16));
  return field(items);
}

function rankingPanel(center, title, rows, visible, highlighted, [accent, measured, pale]) {
  const items = [rect(3.0, 3.25, [center, 0], measured, pale, 0.12), math(title, [center, 1.38], accent, 21), label("model", [center - 0.92, 0.94], measured, 15), label("SEE", [center + 0.1, 0.94], measured, 15), label("ME", [center + 0.92, 0.94], measured, 15), line([center - 1.4, 0.72], [center + 1.4, 0.72], measured, 2)];
  if (!visible) return items;
  rows.forEach(([name, see, me], index) => {
    const y = 0.4 - index * 0.62;
    if (highlighted && index === 2) items.push(rect(2.75, 0.5, [center, y], accent, pale, 0.5));
    items.push(label(name, [center - 0.92, y], index === 2 && highlighted ? accent : measured, 15), math(see, [center + 0.1, y], index === 2 && highlighted ? accent : measured, 16), math(me, [center + 0.92, y], index === 2 && highlighted ? accent : measured, 15));
  });
  return items;
}

function rankingTable(phase, colors) {
  const chit1 = [["J-L", "28.91", String.raw`9.40\!\times\!10^{-2}`], ["Hurst", "10.45", String.raw`4.33\!\times\!10^{-2}`], ["Present", "4.61", String.raw`3.16\!\times\!10^{-3}`]];
  const chit2 = [["J-L", "2.28", String.raw`1.25\!\times\!10^{-3}`], ["Hurst", "2.26", String.raw`-1.23\!\times\!10^{-3}`], ["Present", "1.25", String.raw`-1.01\!\times\!10^{-3}`]];
  return field([
    ...rankingPanel(-1.62, String.raw`\mathrm{CHIT1}`, chit1, true, phase === 2, colors),
    ...rankingPanel(1.62, String.raw`\mathrm{CHIT2}`, chit2, phase >= 1, phase === 2, colors),
    ...(phase === 2 ? [math(String.raw`\min\ SEE,\ \min\lvert ME\rvert`, [0, -1.82], colors[0], 19)] : []),
  ]);
}

function calculateC(phase, [accent, measured, pale]) {
  const items = [rect(5.8, 0.9, [0, 1.05], measured, pale, 0.18), math(String.raw`BQ+CQ^k=s_w,\qquad k=2`, [0, 1.05], accent, 27), arrow([-1.2, 0.4], [-1.2, -0.05], accent, 4), math(String.raw`C=\frac{s_w-BQ}{Q^2}`, [-1.2, -0.42], measured, 24)];
  if (phase >= 1) items.push(rect(2.45, 1.0, [1.3, 0.25], accent, pale, 0.35), math(String.raw`\mathrm{well\ 2}`, [1.3, 0.52], measured, 18), math(String.raw`C=1163.51\ \mathrm{min^2\,m^{-5}}`, [1.3, 0.08], accent, 19));
  if (phase === 2) items.push(rect(2.45, 1.0, [1.3, -1.0], accent, pale, 0.35), math(String.raw`\mathrm{well\ 5}`, [1.3, -0.73], measured, 18), math(String.raw`C=0.97\ \mathrm{min^2\,m^{-5}}`, [1.3, -1.17], accent, 19), math(String.raw`D\longrightarrow C`, [-1.2, -1.2], accent, 24));
  return field(items);
}

function classifyWells(phase, [accent, measured, pale]) {
  const items = [line([-2.75, -0.35], [2.75, -0.35], measured, 5), ...[-2.4, -1.2, 0, 1.2, 2.4].map((x) => line([x, -0.5], [x, -0.2], measured, 2)), line([-1.45, -1.05], [-1.45, 1.1], accent, 5), math(String.raw`0.5\ \mathrm{min^2\,m^{-5}}`, [-1.45, -1.35], accent, 18), math(String.raw`\log_{10} C`, [2.35, -0.88], measured, 18), label("deteriorating", [0.65, 1.42], measured, 18), arrow([-1.2, 1.2], [2.15, 1.2], accent, 4)];
  if (phase >= 1) items.push(dot([-0.95, -0.35], accent, 0.13), math(String.raw`\mathrm{well\ 5}:\ 0.97`, [-0.65, 0.18], accent, 19));
  if (phase === 2) items.push(dot([2.25, -0.35], accent, 0.13), math(String.raw`\mathrm{well\ 2}:\ 1163.51`, [1.75, 0.42], accent, 19), math(String.raw`C>0.5\ \Rightarrow\ \mathrm{not\ properly\ designed/developed}`, [0.45, -1.72], measured, 18));
  return field(items);
}

function finalWells(phase, [accent, measured, pale]) {
  const centers = [-1.75, 1.35];
  const items = centers.flatMap((x, index) => [rect(1.25, 3.05, [x, 0], measured, pale, 0.25), rect(0.32, 2.65, [x, -0.05], accent, "#FFFFFF", 0.9), line([x - 0.18, 0.75], [x + 0.18, 0.75], accent, 5), label(index === 0 ? "well 2" : "well 5", [x, 1.72], measured, 18)]);
  if (phase >= 1) items.push(math(String.raw`1163.51\ \mathrm{min^2\,m^{-5}}`, [-1.75, -1.78], accent, 18), math(String.raw`0.97\ \mathrm{min^2\,m^{-5}}`, [1.35, -1.78], accent, 18));
  if (phase === 2) items.push(line([-2.25, 0.35], [-1.25, -0.65], accent, 6), line([-2.25, -0.65], [-1.25, 0.35], accent, 6), line([0.85, 0.35], [1.85, -0.65], accent, 6), line([0.85, -0.65], [1.85, 0.35], accent, 6), rect(2.0, 0.75, [2.55, 0.85], accent, pale, 0.35), math(String.raw`C>0.5`, [2.55, 1.03], accent, 22), label("criterion failed", [2.55, 0.65], measured, 17));
  return field(items);
}

export function renderPaperVisual2020_02_36(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = descriptionText(description);
  if (!text.includes("[paper:2020-02-36]")) return null;
  const step = normalizePhase(phase);
  const colors = normalizePalette(palette);
  if (/wells 2 and 5 with their equation 30 c values|both wells fail|original scientific question/.test(text)) return finalWells(step, colors);
  if (/two calculated c values|classify test-well|classify well condition|deteriorating-condition threshold/.test(text)) return classifyWells(step, colors);
  if (/equation 30 converting|calculate well-loss coefficient|insert each test.*equation 30|calculate c/.test(text)) return calculateC(step, colors);
  if (/see and me ranking|goodness-of-fit rankings|compare error statistics|align model rows/.test(text)) return rankingTable(step, colors);
  if (/cumulative-volume|field responses|three candidate analytical|levenberg/.test(text)) return fieldFit(step, colors);
  if (/sensitivity panels|normalized parameter derivatives|parameter-influence|sensitivity coefficients/.test(text)) return sensitivityPanels(step, colors);
  if (/analytical and finite-difference|temporal and spatial solution|validate drawdown|numerical verification/.test(text)) return numericalVerification(step, colors);
  if (/screen-gradient flow meter|constant-head flowrate|calculate wellbore flowrate|connect the screen gradient/.test(text)) return flowrateGauge(step, colors);
  if (/analytical drawdown profile|dimensionless analytical drawdown|successive times|drawdown solution/.test(text)) return drawdownSolution(step, colors);
  if (/boundary-constrained logarithmic|solve integration coefficients|coefficients of the dimensionless|lock the logarithmic/.test(text)) return solveCoefficients(step, colors);
  if (/expanding radius-of-influence|moving zero-drawdown|steady radial equation|expand rd/.test(text)) return movingBoundary(step, colors);
  if (/nonlinear screen condition|inner well-screen|apply nonlinear boundary|stack aquifer drawdown/.test(text)) return screenBoundary(step, colors);
  if (/radial confined-aquifer|axisymmetric groundwater|form radial flow|nested control-volume rings/.test(text)) return radialBalance(step, colors);
  if (/rate-dependent screen|non-darcy head loss|fixed-slope skin|rate-dependent curved/.test(text)) return rateDependentLoss(step, colors);
  if (/constant-head well and flow meter|controller holds well drawdown|declining rate gauge|constant head/.test(text)) return constantHead(step, colors);
  return null;
}
