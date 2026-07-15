const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const point = (x, y, z = 0) => [x, y, z];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4, buff = 0.04) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=${buff})`;
const dot = (at, color, radius = 0.08) => `Dot(${q(at)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, at, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.3, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const polygon = (points, stroke, fill, opacity = 0.3, width = 3) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const arc = (radius, at, color, start = 0, angle = 3.14, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${q(at)})`;
const math = (value, at, color, size = 23) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const axes = (at, color, width = 3.0, height = 1.8, xRange = "[0, 4, 1]", yRange = "[0, 3, 1]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${q(at)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((value, index) => line(point(...value), point(...points[index + 1]), color, width));
const dashed = (points, color, width = 3) => points.slice(0, -1).flatMap(([x1, y1], index) => {
  const [x2, y2] = points[index + 1];
  return [0, 0.5].map((fraction) => line(
    point(x1 + (x2 - x1) * fraction, y1 + (y2 - y1) * fraction),
    point(x1 + (x2 - x1) * (fraction + 0.28), y1 + (y2 - y1) * (fraction + 0.28)),
    color,
    width,
  ));
});
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const normalizePalette = (palette) => Array.isArray(palette) && palette.length >= 3 && palette.slice(0, 3).every((color) => typeof color === "string")
  ? palette.slice(0, 3)
  : DEFAULT_PALETTE;
const descriptionText = (description) => {
  if (typeof description === "object" && description !== null) return Object.values(description).filter((value) => typeof value === "string").join(" ");
  return String(description ?? "");
};

function layers(colors, phase, options = {}) {
  const [accent, measured, pale] = colors;
  const showUpper = options.upper ?? phase >= 1;
  const showLower = options.lower ?? phase === 2;
  const items = [rect(5.4, 1.05, point(0, -0.05), measured, pale, 0.48), line(point(-2.7, 0.48), point(2.7, 0.48), measured, 3)];
  if (showUpper) items.push(rect(5.4, 0.88, point(0, 0.98), measured, "#FFFFFF", 0.22), line(point(-2.7, 0.54), point(2.7, 0.54), accent, 4));
  if (showLower) items.push(rect(5.4, 0.82, point(0, -1.0), measured, pale, 0.25), line(point(-2.7, -0.58), point(2.7, -0.58), measured, 4));
  if (options.well ?? true) {
    items.push(rect(0.28, 2.75, point(-1.75, 0.25), accent, "#FFFFFF", 0.92, 4));
    items.push(line(point(-1.95, -0.46), point(-1.95, 0.35), accent, 7), line(point(-1.55, -0.46), point(-1.55, 0.35), accent, 7));
    if (options.skin ?? phase === 2) items.push(rect(0.7, 0.95, point(-1.75, -0.05), measured, "#FFFFFF", 0, 4));
  }
  return items;
}

function fixedHeadFlow(phase, colors) {
  const [accent, measured, pale] = colors;
  const widths = [7, 5, 3];
  const lengths = [1.12, 0.9, 0.68];
  const items = layers(colors, 2, { upper: true, lower: true, skin: true });
  items.push(
    line(point(-2.13, 0.24), point(-1.37, 0.24), accent, 6),
    dot(point(-1.75, 0.24), pale, 0.1),
    arrow(point(-1.75, 1.55), point(-1.75, 1.55 + lengths[phase]), accent, widths[phase]),
    math(String.raw`s_w=\mathrm{constant}`, point(0.45, 1.28), accent, 23),
    math(String.raw`Q_w(t)`, point(-0.95, 1.75), accent, 24),
  );
  if (phase >= 1) items.push(...[0.85, 0.05, -0.98].map((y) => arrow(point(1.85, y), point(-1.35, y * 0.3), measured, 3)));
  if (phase === 2) items.push(math(String.raw`h_w=\mathrm{constant}`, point(0.55, 0.82), measured, 21), circle(0.17, point(-1.75, 0.24), accent, 5));
  return field(items);
}

function delayedDrainage(phase, colors) {
  const [accent, measured, pale] = colors;
  const curve = [[-2.55, 1.25], [-2.05, 0.7], [-1.45, 0.42], [-0.75, 0.34], [0.05, 0.3], [0.85, -0.05], [1.7, -0.55], [2.55, -0.82]];
  const counts = [3, 6, 8];
  const items = [axes(point(0, -0.05), measured, 5.4, 2.85, "[0, 8, 2]", "[0, 3, 1]"), ...trace(curve.slice(0, counts[phase]), accent, 5)];
  items.push(...[[-2.25, -1.15], [-1.8, -1.15], [-1.35, -1.15]].map((at) => dot(point(...at), phase === 0 ? accent : measured, 0.1)));
  if (phase >= 1) items.push(...[[-0.55, 1.55], [-0.05, 1.45], [0.45, 1.55]].flatMap(([x, y]) => [dot(point(x, y), accent, 0.1), arrow(point(x, y - 0.12), point(x, y - 0.5), accent, 3)]), math(String.raw`S_y`, point(0.95, 1.42), accent, 22));
  if (phase === 2) items.push(math(String.raw`S_s\ \longrightarrow\ S_y\ \longrightarrow\ \mathrm{late\ response}`, point(0.15, -1.55), measured, 19), line(point(-0.75, 0.34), point(0.05, 0.3), pale, 8));
  return field(items);
}

function threeLayerSystem(phase, colors) {
  const [accent, measured] = colors;
  const items = layers(colors, phase, { skin: phase === 2 });
  items.push(math(String.raw`b`, point(2.35, -0.05), measured, 22));
  if (phase >= 1) items.push(math(String.raw`b_u`, point(2.35, 0.98), accent, 22), ...[0.45, 1.15, 1.85].map((x) => arrow(point(x, 1.2), point(x, 0.58), accent, 3)));
  if (phase === 2) items.push(math(String.raw`b'`, point(2.35, -0.98), measured, 22), math(String.raw`z_1`, point(-1.25, -0.4), accent, 21), math(String.raw`Sk`, point(-1.1, 0.22), measured, 21), ...[0.35, 1.05, 1.75].map((x) => arrow(point(x, -1.05), point(x, -0.62), measured, 3)));
  return field(items);
}

function saturatedBalance(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = layers(colors, 2, { upper: false, lower: false, skin: true });
  items.push(...[-0.75, -0.15, 0.45, 1.05, 1.65].map((x) => arrow(point(x, 0.05), point(-1.35, 0.05), accent, 3)));
  if (phase >= 1) items.push(...[-0.95, -0.15, 0.65, 1.45].map((x) => arrow(point(x, 0.4), point(x, -0.35), measured, 3)), math(String.raw`K_r\partial_rs`, point(0.95, 0.92), accent, 22), math(String.raw`K_z\partial_zs`, point(0.95, -0.42), measured, 22));
  if (phase === 2) items.push(...[-0.65, 0.05, 0.75, 1.45].map((x) => dot(point(x, 0.12), pale, 0.1)), math(String.raw`S_s\partial_ts`, point(0.95, -0.95), measured, 22), math(String.raw`Sk=K_r r_s/(K_s r_w)`, point(-0.15, 1.5), accent, 20));
  return field(items);
}

function unsaturatedDrainage(phase, colors) {
  const [accent, measured, pale] = colors;
  const profile = [[0.4, -1.15], [0.62, -0.65], [0.95, -0.1], [1.45, 0.48], [2.2, 0.92]];
  const items = [rect(2.45, 3.2, point(-1.55, 0), measured, pale, 0.32), line(point(-2.78, -1.15), point(-0.32, -1.15), accent, 4), ...profile.slice(0, 3 + phase).map(([x, y]) => dot(point(x, y), phase === 2 ? accent : measured, 0.09)), ...trace(profile.slice(0, 3 + phase), accent, 4)];
  items.push(...[[-2.35, 1.15], [-1.75, 0.75], [-1.15, 0.25]].slice(0, phase + 1).flatMap(([x, y]) => [circle(0.1, point(x, y), accent, 3, pale, 0.7), arrow(point(x, y - 0.14), point(x, y - 0.52), accent, 3)]));
  if (phase >= 1) items.push(math(String.raw`\psi\longmapsto K(\psi),\ C(\psi)`, point(1.25, 1.42), measured, 21));
  if (phase === 2) items.push(math(String.raw`K(\psi)=K_s e^{\alpha(\psi-\psi_a)}`, point(1.25, -1.45), accent, 20), math(String.raw`\sigma(r,z,t)`, point(-1.55, 1.55), accent, 22));
  return field(items);
}

function linearization(phase, colors) {
  const [accent, measured, pale] = colors;
  const moving = [[-2.7, 0.3], [-1.7, 0.18], [-0.7, -0.12], [0.3, -0.32], [1.3, -0.12], [2.7, 0.22]];
  const items = [rect(5.5, 1.7, point(0, -0.62), measured, pale, 0.35), line(point(-2.75, 0.3), point(2.75, 0.3), measured, 3), ...trace(moving.map(([x, y]) => [x, y + phase * (0.3 - y) * 0.45]), accent, 5)];
  items.push(math(String.raw`z=b`, point(2.35, 0.62), measured, 21), math(String.raw`\epsilon s^{(1)}`, point(-1.85, 1.35), accent, 24));
  if (phase >= 1) items.push(math(String.raw`+\epsilon^2s^{(2)}+\cdots`, point(0.35, 1.35), measured, 22), arrow(point(0.3, 0.82), point(0.3, 0.34), accent, 3));
  if (phase === 2) items.push(rect(2.5, 0.48, point(0.75, 1.34), measured, "#FFFFFF", 0.88), math(String.raw`O(\epsilon^2)\to0`, point(0.75, 1.34), pale, 21), line(point(-2.75, 0.3), point(2.75, 0.3), accent, 6));
  return field(items);
}

function laplaceTransform(phase, colors) {
  const [accent, measured, pale] = colors;
  const ys = [1.0, 0, -1.0];
  const names = [String.raw`\sigma_u(r,z,t)`, String.raw`s(r,z,t)`, String.raw`s'(r,z,t)`];
  const items = ys.map((y, index) => rect(1.75, 0.55, point(-1.9, y), measured, pale, 0.38)).flat();
  items.push(...ys.map((y, index) => math(names[index], point(-1.9, y), index === phase ? accent : measured, 20)));
  if (phase >= 1) items.push(...ys.map((y) => arrow(point(-0.9, y), point(-0.15, y), accent, 3)), math(String.raw`\mathcal L_t`, point(-0.52, 1.5), accent, 28));
  if (phase === 2) items.push(...ys.map((y) => rect(1.75, 0.55, point(1.1, y), accent, "#FFFFFF", 0)), ...ys.map((y, index) => math([String.raw`\bar\sigma_u(r,z,p)`, String.raw`\bar s(r,z,p)`, String.raw`\bar s'(r,z,p)`][index], point(1.1, y), accent, 19)), line(point(2.25, -1.35), point(2.25, 1.35), measured, 3), math(String.raw`p`, point(2.5, 1.25), measured, 24));
  return field(items);
}

function weberProjection(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [line(point(-2.65, -1.25), point(-2.65, 1.25), accent, 6), math(String.raw`r_w`, point(-2.65, -1.52), accent, 20)];
  const profiles = [
    [[-2.6, 0.95], [-1.8, 0.7], [-1.0, 0.42], [-0.1, 0.18]],
    [[-2.6, 0.15], [-1.8, -0.05], [-1.0, -0.3], [-0.1, -0.52]],
    [[-2.6, -0.72], [-1.8, -0.85], [-1.0, -1.02], [-0.1, -1.15]],
  ];
  items.push(...profiles.slice(0, phase + 1).flatMap((points, index) => trace(points, index === phase ? accent : measured, index === phase ? 5 : 3)));
  if (phase >= 1) items.push(arrow(point(0.15, 0), point(0.85, 0), accent, 4), math(String.raw`\mathcal W_\lambda`, point(0.5, 0.38), accent, 23));
  if (phase === 2) items.push(...[0.45, 0.78, 1.1].map((radius, index) => arc(radius, point(1.85, 0), index === 2 ? accent : measured, -1.35, 2.7, index === 2 ? 5 : 2)), math(String.raw`\lambda:\ r_w\le r<\infty`, point(1.65, -1.5), measured, 19));
  return field(items);
}

function transformedLayers(phase, colors) {
  const [accent, measured, pale] = colors;
  const ys = [1.05, 0, -1.05];
  const labels = [String.raw`\bar\sigma_u`, String.raw`\bar s`, String.raw`\bar s'`];
  const items = [];
  for (let index = 0; index < 3; index += 1) {
    items.push(axes(point(0, ys[index]), measured, 4.7, 0.75, "[0, 4, 1]", "[0, 1, 0.5]"), math(labels[index], point(-2.65, ys[index] + 0.25), index <= phase ? accent : measured, 19));
    const curve = [[-2.25, ys[index] + 0.27], [-1.45, ys[index] + 0.08], [-0.55, ys[index] - 0.06], [0.45, ys[index] - 0.14], [1.45, ys[index] - 0.18], [2.25, ys[index] - 0.2]];
    items.push(...trace(curve, index <= phase ? accent : pale, index === phase ? 4 : 2));
  }
  if (phase === 2) items.push(...[0.52, -0.52].map((y) => arrow(point(2.55, y + 0.2), point(2.55, y - 0.2), accent, 3)), math(String.raw`\mathrm{continuity}`, point(2.05, 0), accent, 18));
  return field(items);
}

function wellFaceGradient(phase, colors) {
  const [accent, measured, pale] = colors;
  const curve = [[-2.35, 1.15], [-1.75, 0.82], [-1.15, 0.35], [-0.55, -0.08], [0.2, -0.45], [1.1, -0.72], [2.35, -0.88]];
  const items = [axes(point(0, -0.05), measured, 5.3, 2.8, "[0, 6, 1]", "[0, 2, 0.5]"), ...trace(curve, accent, 5), line(point(-2.55, -1.25), point(-2.55, 1.25), measured, 6), math(String.raw`r=r_w`, point(-2.45, -1.52), measured, 19)];
  if (phase >= 1) items.push(line(point(-2.38, 1.18), point(-1.48, 0.72), measured, 4), arrow(point(-1.35, 1.35), point(-1.8, 0.86), accent, 4));
  if (phase === 2) items.push(math(String.raw`\left.\partial_rs\right|_{r_w}`, point(0.75, 1.4), accent, 25), rect(0.28, 2.3, point(-2.48, 0), accent, pale, 0.25));
  return field(items);
}

function integrateScreen(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(0.28, 2.9, point(-2.1, 0), accent, "#FFFFFF", 0.92, 4), rect(0.74, 1.7, point(-2.1, -0.2), measured, "#FFFFFF", 0, 4), line(point(-2.55, 0.65), point(-2.55, -1.05), measured, 3), line(point(-2.68, 0.65), point(-2.42, 0.65), measured, 3), line(point(-2.68, -1.05), point(-2.42, -1.05), measured, 3), math(String.raw`z_1`, point(-2.85, -1.05), measured, 19), math(String.raw`b`, point(-2.82, 0.65), measured, 19)];
  const arrowYs = [0.48, 0.08, -0.32, -0.72];
  items.push(...arrowYs.slice(0, 2 + phase).map((y) => arrow(point(-0.55, y), point(-1.65, y), accent, 3)));
  if (phase >= 1) items.push(math(String.raw`\int_{z_1}^{b}K_r\,\partial_rs\,dz`, point(0.85, 0.6), accent, 23));
  if (phase === 2) items.push(arrow(point(0.75, 0.1), point(1.7, 0.1), accent, 4), math(String.raw`Q_w(t),\ Sk`, point(2.2, 0.1), measured, 23), math(String.raw`\mathrm{screen\ average}`, point(0.9, -0.75), measured, 18));
  return field(items);
}

function inverseLaplace(phase, colors) {
  const [accent, measured, pale] = colors;
  const poles = [-2.55, -2.05, -1.55, -1.05];
  const items = [line(point(-2.8, 0.65), point(-0.75, 0.65), measured, 3), ...poles.map((x, index) => dot(point(x, 0.65), index < phase + 2 ? accent : pale, 0.09)), math(String.raw`p_n`, point(-1.75, 1.05), accent, 22)];
  if (phase >= 1) items.push(arrow(point(-0.55, 0.1), point(0.2, 0.1), accent, 4), math(String.raw`\mathcal L^{-1}_{\mathrm{Crump}}`, point(-0.18, 0.55), accent, 20), axes(point(1.65, -0.15), measured, 2.7, 2.35, "[0, 4, 1]", "[0, 2, 0.5]"));
  if (phase === 1) items.push(...trace([[0.55, -0.95], [1.05, -0.45], [1.55, -0.05], [2.05, 0.2]], measured, 3));
  if (phase === 2) items.push(...trace([[0.55, -0.95], [1.05, -0.42], [1.55, -0.02], [2.05, 0.28], [2.75, 0.5]], accent, 5), math(String.raw`s(\lambda,z,t)`, point(1.75, 1.25), accent, 21));
  return field(items);
}

function inverseWeber(phase, colors) {
  const [accent, measured, pale] = colors;
  const modes = [
    [[-2.75, 0.85], [-2.1, 0.35], [-1.45, 0.65], [-0.8, 0.18]],
    [[-2.75, 0.15], [-2.1, -0.35], [-1.45, -0.05], [-0.8, -0.55]],
    [[-2.75, -0.62], [-2.1, -0.9], [-1.45, -0.5], [-0.8, -0.98]],
  ];
  const items = modes.slice(0, phase + 1).flatMap((points, index) => trace(points, index === phase ? accent : measured, index === phase ? 4 : 2));
  if (phase >= 1) items.push(arrow(point(-0.55, 0), point(0.15, 0), accent, 4), math(String.raw`\int_0^\infty(\cdot)\,d\lambda`, point(-0.15, 0.45), accent, 20), axes(point(1.65, -0.2), measured, 2.7, 2.3, "[0, 4, 1]", "[0, 2, 0.5]"));
  if (phase === 2) items.push(...trace([[0.55, 0.75], [1.05, 0.35], [1.6, 0.02], [2.2, -0.25], [2.75, -0.42]], accent, 5), math(String.raw`Q_D(\tau)`, point(1.85, 1.25), accent, 23), circle(0.17, point(0.55, 0.75), accent, 4));
  return field(items);
}

function limitingCase(phase, colors) {
  const [accent, measured, pale] = colors;
  const present = [[-2.65, -0.92], [-2.0, -0.45], [-1.3, 0.08], [-0.55, 0.52], [0.25, 0.82], [1.15, 1.02], [2.5, 1.12]];
  const tn = present.map(([x, y], index) => [x, y + (index < 3 ? 0.26 - index * 0.07 : 0.02)]);
  const items = [axes(point(0, -0.15), measured, 5.5, 2.8, "[0, 7, 1]", "[0, 2, 0.5]"), ...trace(present, accent, 5)];
  if (phase >= 1) items.push(...trace(tn, measured, 3), math(String.raw`\mathrm{Tartakovsky}\!-\!\mathrm{Neuman}`, point(0.9, -1.5), measured, 18));
  if (phase === 2) items.push(line(point(-0.55, -1.28), point(-0.55, 1.28), measured, 3), math(String.raw`t\geq 5S_s r^2/K_r`, point(0.2, 1.45), accent, 22), line(point(-0.55, 0.52), point(2.5, 1.12), pale, 8));
  return field(items);
}

function sensitivity(phase, colors) {
  const [accent, measured, pale] = colors;
  const families = [
    { name: String.raw`K_r,\ b`, y: 0.85, points: [[-2.4, 0.55], [-1.6, 1.1], [-0.75, 0.75], [0.15, 1.25], [1.1, 0.7], [2.35, 0.5]] },
    { name: String.raw`S_y,\alpha,\ b_u`, y: 0, points: [[-2.4, -0.28], [-1.6, 0.12], [-0.75, 0.4], [0.15, 0.05], [1.1, 0.25], [2.35, -0.15]] },
    { name: String.raw`K'_z,\ S'_s`, y: -0.85, points: [[-2.4, -1.12], [-1.6, -0.82], [-0.75, -0.52], [0.15, -0.72], [1.1, -0.48], [2.35, -0.95]] },
  ];
  const items = [line(point(-2.7, -1.35), point(2.7, -1.35), measured, 2)];
  families.slice(0, phase + 1).forEach((family, index) => items.push(...trace(family.points, index === 0 ? accent : measured, index === 0 ? 5 : 3), math(family.name, point(-2.25, family.y + 0.45), index === 0 ? accent : measured, 18)));
  if (phase >= 1) items.push(math(String.raw`X_{i,k}\approx\frac{P_k}{O_i}\frac{\Delta O_i}{10^{-3}P_k}`, point(0.45, 1.55), measured, 19));
  if (phase === 2) items.push(circle(0.2, point(0.15, 1.25), accent, 5), arrow(point(1.85, 1.45), point(0.35, 1.28), accent, 4));
  return field(items);
}

function parameterSweep(phase, colors, kind) {
  const [accent, measured, pale] = colors;
  const configs = {
    alpha: { values: ["1", "10", "100", "1000"], threshold: String.raw`\alpha_D=100`, markerX: 0.55 },
    thickness: { values: ["0", "0.1", "0.5", String.raw`\infty`], threshold: String.raw`\zeta_u\geq0.5`, markerX: 0.8 },
  };
  const config = configs[kind];
  const base = [[-2.55, 1.0], [-1.85, 0.62], [-1.05, 0.3], [-0.2, 0.05], [0.7, -0.15], [1.65, -0.32], [2.55, -0.4]];
  const items = [axes(point(0, -0.15), measured, 5.45, 2.8, "[0, 7, 1]", "[0, 2, 0.5]")];
  for (let index = 0; index < phase + 2; index += 1) {
    const offset = (3 - index) * 0.12;
    const curve = base.map(([x, y], pointIndex) => [x, y + offset * (1 - pointIndex / 7)]);
    items.push(...trace(curve, index === phase + 1 ? accent : measured, index === phase + 1 ? 4 : 2), math(config.values[index], point(-2.35 + index * 0.62, 1.45), index === phase + 1 ? accent : measured, 17));
  }
  if (phase === 2) items.push(line(point(config.markerX, -1.3), point(config.markerX, 1.25), accent, 3), math(config.threshold, point(1.35, 1.48), accent, 22), circle(0.16, point(config.markerX, -0.12), accent, 4));
  return field(items);
}

function leakageThreshold(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = layers(colors, 2, { upper: true, lower: true, skin: false });
  const flowColor = phase === 2 ? pale : accent;
  const flowWidth = [5, 3, 1][phase];
  items.push(...[0.1, 0.75, 1.4].map((x) => arrow(point(x, -1.12), point(x, -0.62), flowColor, flowWidth)), math(String.raw`\kappa_z=K'_z/K_z`, point(1.15, -1.45), measured, 20));
  if (phase >= 1) items.push(axes(point(1.05, 0.82), measured, 2.7, 1.1, "[0, 4, 1]", "[0, 1, 0.5]"), ...trace([[0, 0.62], [0.55, 0.45], [1.15, 0.35], [1.75, 0.3], [2.35, 0.28]], accent, 4));
  if (phase === 2) items.push(math(String.raw`\kappa_z<0.01`, point(-0.15, 1.48), accent, 23), line(point(-0.45, -0.58), point(1.8, -0.58), accent, 5));
  return field(items);
}

function femwaterComparison(phase, colors) {
  const [accent, measured, pale] = colors;
  const centers = [point(-1.55, 0.82), point(1.45, 0.82), point(-1.55, -0.82), point(1.45, -0.82)];
  const tags = [String.raw`r=5,\ z=5`, String.raw`r=10,\ z=5`, String.raw`r=5,\ z=12`, String.raw`r=10,\ z=12`];
  const items = [];
  centers.forEach(([cx, cy], panelIndex) => {
    items.push(axes(point(cx, cy), measured, 2.2, 1.15, "[0, 4, 1]", "[0, 1, 0.5]"), math(tags[panelIndex], point(cx, cy + 0.75), panelIndex < 2 ? measured : accent, 15));
    const model = [[cx - 0.9, cy - 0.35], [cx - 0.45, cy - 0.08], [cx, cy + 0.15], [cx + 0.45, cy + 0.28], [cx + 0.9, cy + 0.34]];
    if (phase >= 1) items.push(...trace(model, accent, 3));
    if (phase === 2) {
      const deviation = panelIndex >= 2 ? 0.12 : 0.02;
      items.push(...model.map(([x, y], index) => dot(point(x, y + deviation * Math.sin(index)), measured, 0.055)));
      if (panelIndex === 2) items.push(polygon([point(cx, cy + 0.02), point(cx + 0.45, cy + 0.18), point(cx + 0.45, cy + 0.31), point(cx, cy + 0.15)], measured, pale, 0.55, 1));
    }
  });
  if (phase === 0) items.push(math(String.raw`\alpha=0.2,\ 5\ \mathrm{m}^{-1}`, point(0, 1.63), accent, 20));
  if (phase === 2) items.push(math(String.raw`\Delta s_{u,\max}\approx0.05\,\mathrm{m}`, point(0, -1.63), accent, 19));
  return field(items);
}

function fieldFit(phase, colors) {
  const [accent, measured, pale] = colors;
  const centers = [point(-1.55, 0.82), point(1.45, 0.82), point(-1.55, -0.82), point(1.45, -0.82)];
  const items = [];
  centers.forEach(([cx, cy], panelIndex) => {
    items.push(axes(point(cx, cy), measured, 2.15, 1.1, "[0, 24, 6]", "[0, 2, 0.5]"), math(String.raw`\mathrm{well}\ ${panelIndex + 6}`, point(cx, cy + 0.72), measured, 16));
    const observed = [[cx - 0.88, cy - 0.34], [cx - 0.5, cy - 0.04], [cx - 0.08, cy + 0.16], [cx + 0.38, cy + 0.27], [cx + 0.86, cy + 0.34]];
    items.push(...observed.map(([x, y]) => dot(point(x, y), measured, 0.055)));
    if (phase >= 1) items.push(...trace(observed.map(([x, y], index) => [x, y + 0.025 * Math.sin(index + panelIndex)]), accent, 3));
    if (phase === 2) {
      const omitted = observed.map(([x, y], index) => [x, y + (index < 2 ? 0.14 : -0.12)]);
      items.push(...dashed(omitted, pale, 2));
    }
  });
  if (phase >= 1) items.push(math(String.raw`K_r,K_z,S_s,S_y,\alpha\ \xleftarrow{\mathrm{LM}}\ s_6\ldots s_9`, point(0, 1.62), accent, 18));
  if (phase === 2) items.push(math(String.raw`\mathrm{SEE},\ \mathrm{ME}`, point(0, -1.62), measured, 19), line(point(-0.55, -1.58), point(0.55, -1.58), accent, 4));
  return field(items);
}

function sourceSynthesis(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = layers(colors, 2, { upper: true, lower: true, skin: true });
  const upperWidth = [1, 5, 3][phase];
  const middleWidth = [3, 6, 4][phase];
  const lowerWidth = [1, 3, 2][phase];
  if (phase >= 1) items.push(
    arrow(point(0.25, 1.05), point(-1.35, 0.28), accent, upperWidth),
    arrow(point(0.25, 0), point(-1.35, 0), measured, middleWidth),
    arrow(point(0.25, -1.0), point(-1.35, -0.28), accent, lowerWidth),
    math(String.raw`S_y`, point(0.6, 1.25), accent, 18),
    math(String.raw`S_s`, point(0.6, 0.22), measured, 18),
    math(String.raw`K'_z`, point(0.6, -1.22), accent, 18),
  );
  items.push(line(point(-2.12, 0.24), point(-1.38, 0.24), accent, 6), arrow(point(-1.75, 1.55), point(-1.75, 2.15 - phase * 0.12), accent, 4));
  if (phase === 2) {
    const fit = [[1.15, -0.8], [1.45, -0.38], [1.78, -0.02], [2.15, 0.18], [2.55, 0.28]];
    items.push(axes(point(1.85, 0), measured, 2.0, 1.55, "[0, 24, 6]", "[0, 2, 0.5]"), ...trace(fit, accent, 4), ...fit.map(([x, y]) => dot(point(x, y + 0.03), measured, 0.055)), math(String.raw`s_{6\ldots9}(t)`, point(1.85, 1.08), accent, 18));
  }
  return field(items);
}

export function renderPaperVisual2017_06_40(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = descriptionText(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!text.includes("[paper:2017-06-40]")) return null;
  const step = normalizePhase(phase);
  const colors = normalizePalette(palette);
  if (/three sources one measured flow|source arrows scaled|field-fitted drawdown/.test(text)) return sourceSynthesis(step, colors);
  if (/four observed drawdown|four iowa observation|five-parameter estimates|field fit at four wells|wells 6.?9/.test(text)) return fieldFit(step, colors);
  if (/analytical and femwater|femwater scenarios|two radii and two elevations|bounded unsaturated-zone deviation/.test(text)) return femwaterComparison(step, colors);
  if (/lower-layer leakage arrows|kappa z threshold|negligible lower-layer leakage/.test(text)) return leakageThreshold(step, colors);
  if (/unsaturated-thickness curves|half-thickness marker|zeta u/.test(text)) return parameterSweep(step, colors, "thickness");
  if (/alphad sweep|alpha d sweep|linearized-water-table qd|alphad equal|alpha d equal/.test(text)) return parameterSweep(step, colors, "alpha");
  if (/sensitivity curves grouped|time-dependent influence|kr and b dominate|compute sensitivity/.test(text)) return sensitivity(step, colors);
  if (/tartakovsky.neuman|source limiting case|normalized-drawdown equivalence|time-criterion boundary/.test(text)) return limitingCase(step, colors);
  if (/weber modes integrated|physical drawdown fields|inverse weber response/.test(text)) return inverseWeber(step, colors);
  if (/laplace-domain layer amplitudes|crump inversion|inverse laplace response/.test(text)) return inverseLaplace(step, colors);
  if (/gradient arrows collected|integrate screen flux|screen-averaged well-face/.test(text)) return integrateScreen(step, colors);
  if (/radial drawdown slope|differentiate well-face|well-face gradient/.test(text)) return wellFaceGradient(step, colors);
  if (/three aligned transformed|three layer solutions|solve layered drawdown/.test(text)) return transformedLayers(step, colors);
  if (/radial layer profiles projected|weber kernel|project radial equations/.test(text)) return weberProjection(step, colors);
  if (/three time-dependent layer equations|laplace-domain plane|transform temporal/.test(text)) return laplaceTransform(step, colors);
  if (/moving water table settling|small drawdown linearization|perturbation linearization/.test(text)) return linearization(step, colors);
  if (/unsaturated moisture profile|gardner soil|construct unsaturated/.test(text)) return unsaturatedDrainage(step, colors);
  if (/radial and vertical flow arrows|saturated flow balance|skin-modified inner/.test(text)) return saturatedBalance(step, colors);
  if (/unsaturated-aquifer-lower-layer stack|three coupled layers|partially penetrating well/.test(text)) return threeLayerSystem(step, colors);
  if (/three-stage unconfined drawdown|delayed drainage|elastic storage/.test(text)) return delayedDrainage(step, colors);
  if (/pinned well head|fixed head changing flow|well water level remains pinned/.test(text)) return fixedHeadFlow(step, colors);
  return null;
}
