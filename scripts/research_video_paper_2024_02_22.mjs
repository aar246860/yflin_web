const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const point = ([x, y]) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, buff=0.04, stroke_width=${width})`;
const dot = (xy, color, radius = 0.08) => `Dot(${point(xy)}, radius=${radius}, color=${q(color)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0.3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const ring = (radius, xy, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const arc = (radius, xy, start, angle, color, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${point(xy)})`;
const poly = (points, stroke, fill, opacity = 0.4) => `Polygon(${points.map(point).join(", ")}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (latex, xy, color, size = 22) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const axes = (xy, color, width = 5.5, height = 2.65, xRange = "[0, 10, 2]", yRange = "[-1, 1, 0.5]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${point(xy)})`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((xy, index) => line(xy, points[index + 1], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

function phaseOf(phase) {
  const value = Number(phase);
  return Math.max(0, Math.min(2, Number.isFinite(value) ? Math.trunc(value) : 0));
}

function colorsOf(palette) {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [source[0] ?? DEFAULT_PALETTE[0], source[1] ?? DEFAULT_PALETTE[1], source[2] ?? DEFAULT_PALETTE[2]].map(String);
}

function textOf(description) {
  const values = typeof description === "object" && description !== null
    ? [description.marker, description.visualObject, description.stepDetail, description.visibleEvidence, description.motionPurpose, description.minimalText, description.premise, description.operation, description.output, description.claim]
    : [description];
  return values.filter((value) => typeof value === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

const wave = (base = 0, amplitude = 0.55, cycles = 1.45, count = 11, x0 = -2.75, dx = 0.55, phase = 0) => Array.from({ length: count }, (_, index) => [x0 + index * dx, base + amplitude * Math.sin(index * cycles + phase)]);
const saw = (base = 0, amplitude = 0.8, count = 17, x0 = -2.75, dx = 0.34, shift = 0) => Array.from({ length: count }, (_, index) => {
  const cycle = (index + shift) % 4;
  const shape = cycle === 0 ? -0.35 : cycle === 1 ? 0.12 : cycle === 2 ? 1 : -0.55;
  return [x0 + index * dx, base + amplitude * shape];
});

function confinedWell(c, phase, options = {}) {
  const [accent, measured, pale] = c;
  const items = [
    rect(5.7, 0.42, [0, 1.22], measured, pale, 0.55),
    rect(5.7, 1.85, [0, 0.04], measured, "#FFFFFF", 0.08),
    rect(5.7, 0.42, [0, -1.15], measured, pale, 0.55),
    rect(0.46, 1.9, [-1.85, 0.02], accent, "#FFFFFF", 0.95),
    line([-2.08, 0.74], [-1.62, 0.74], accent, 4), line([-2.08, 0.38], [-1.62, 0.38], accent, 4),
    line([-2.08, 0.02], [-1.62, 0.02], accent, 4), line([-2.08, -0.34], [-1.62, -0.34], accent, 4), line([-2.08, -0.7], [-1.62, -0.7], accent, 4),
    math(String.raw`r_w`, [-1.85, -1.48], accent, 18),
  ];
  if (options.skin || phase > 0 && options.progressSkin) items.push(ring(0.54, [-1.85, 0.02], accent, 4, pale, phase === 2 ? 0.55 : 0.32), math(String.raw`S_f`, [-1.13, 0.82], accent, 22));
  if (options.radial) {
    const count = phase + 2;
    for (let index = 0; index < count; index += 1) items.push(arc(0.78 + index * 0.43, [-1.85, 0.02], -1.15, 2.3, index === count - 1 ? accent : measured, index === count - 1 ? 4 : 2));
    items.push(arrow([-1.25, 0.02], [0.35 + phase * 0.45, 0.02], accent, 4), math(String.raw`r`, [1.35, -0.28], measured, 21));
  }
  return items;
}

function bracket(x, y1, y2, color, label) {
  return [line([x, y1], [x, y2], color, 4), line([x - 0.16, y1], [x + 0.16, y1], color, 4), line([x - 0.16, y2], [x + 0.16, y2], color, 4), math(label, [x + 0.52, (y1 + y2) / 2], color, 20)];
}

function scene01(phase, c) {
  const [accent, measured] = c;
  const items = confinedWell(c, 0);
  items.push(...plot(wave(0.9, 0.25, 1.35, 9, -0.2, 0.38), measured, 3), line([-0.2, 0.9], [2.85, 0.9], measured, 1));
  const arrows = phase === 0
    ? [arrow([-1.85, 0.95], [-1.85, 1.72], accent, 5), arrow([-1.3, 0.15], [-0.55, 0.15], accent, 4)]
    : [arrow([-1.85, 1.72], [-1.85, 0.95], measured, 5), arrow([-0.55, -0.25], [-1.3, -0.25], measured, 4)];
  items.push(...arrows, math(phase === 0 ? String.raw`Q>0` : String.raw`Q<0`, [-2.55, 1.58], phase === 0 ? accent : measured, 22));
  if (phase === 2) items.push(ring(0.48, [2.15, -0.35], accent, 4), math(String.raw`\oint Q(t)\,dt=0`, [1.42, -1.0], accent, 22), line([2.15, -0.35], [2.15, 0.05], accent, 4));
  return field(items);
}

function scene02(phase, c) {
  const [accent, measured, pale] = c;
  const items = confinedWell(c, phase, { progressSkin: true });
  if (phase > 0) items.push(math(String.raw`K_{\rm skin}\ne K`, [0.55, 1.0], accent, 23));
  if (phase === 2) items.push(...plot([[-1.35, 0.6], [-0.8, 0.3], [-0.35, -0.25], [1.0, -0.62], [2.45, -0.78]], measured, 4), line([-0.35, -0.45], [-0.35, 0.55], accent, 3), ...bracket(-0.02, -0.2, 0.3, accent, String.raw`\Delta h_{S_f}`), rect(0.74, 1.58, [-1.85, 0.02], accent, pale, 0.08));
  return field(items);
}

function scene03(phase, c) {
  const [accent, measured] = c;
  const items = confinedWell(c, 0);
  const count = 2 + phase * 2;
  for (let index = 0; index < count; index += 1) {
    const y = 0.72 - index * (1.42 / Math.max(1, count - 1));
    items.push(arrow([-1.48, y], [-0.78 - phase * 0.15, y], index % 2 ? measured : accent, 3 + phase));
  }
  const span = 0.34 + phase * 0.34;
  items.push(...bracket(0.35, -span, span, accent, String.raw`D|Q(t)|`), math(String.raw`H-h`, [1.75, 0.98], measured, 22));
  if (phase === 2) items.push(arrow([2.45, 0.4], [1.55, 0.4], measured, 4), math(String.raw`Q\mapsto -Q`, [2.1, -0.9], accent, 20));
  return field(items);
}

function scene04(phase, c) {
  const [accent, measured, pale] = c;
  const items = [
    ring(0.52, [-2.4, 0.78], accent, 4, pale, 0.35), math(String.raw`S_f`, [-2.4, 0.78], accent, 25),
    ...bracket(-2.4, -1.02, -0.42, measured, String.raw`D|Q|`),
    rect(2.45, 2.5, [1.55, 0], measured, pale, 0.2),
    ...plot(wave(0, 0.45, 1.45, 8, 0.45, 0.34), measured, 3),
  ];
  items.push(arrow([-1.78, 0.78], [0.2, 0.58], accent, 4));
  if (phase > 0) items.push(line([-1.8, -0.72], [-0.72, -0.72], measured, 4), line([-0.35, -0.72], [0.2, -0.55], measured, 4), math(String.raw`?`, [-0.53, -0.7], accent, 28));
  if (phase === 2) items.push(ring(0.22, [-0.53, -0.7], accent, 4), math(String.raw`S_f+D|Q|`, [1.5, 1.28], accent, 20));
  return field(items);
}

function scene05(phase, c) {
  const [accent, measured] = c;
  const items = confinedWell(c, phase, { radial: true });
  if (phase > 0) items.push(math(String.raw`S\,\partial_t h`, [0.65, 0.98], measured, 22), math(String.raw`=`, [1.42, 0.98], accent, 22));
  if (phase === 2) items.push(math(String.raw`T(\partial_{rr}h+r^{-1}\partial_r h)`, [2.15, 0.98], accent, 20), math(String.raw`r_w\le r<\infty`, [1.35, -0.85], measured, 18));
  return field(items);
}

function scene06(phase, c) {
  const [accent, measured, pale] = c;
  const items = confinedWell(c, 0, { radial: true });
  items.push(rect(0.28, 1.2, [-1.85, 0.05 + phase * 0.12], accent, pale, 0.65), arrow([-2.55, 0.05], [-2.08, 0.05], measured, 5), math(String.raw`-Q(t)`, [-2.55, 0.52], measured, 19));
  if (phase > 0) items.push(arrow([-1.55, 0.15], [-0.65, 0.15], accent, 4), arrow([-1.85, -0.18], [-1.85, 0.48], accent, 4), math(String.raw`\pi r_w^2\partial_t H`, [-0.25, -0.55], accent, 19));
  if (phase === 2) items.push(math(String.raw`2\pi Tr_w\partial_r h=-Q+\pi r_w^2\partial_t H`, [0.45, 1.1], measured, 17));
  return field(items);
}

function scene07(phase, c) {
  const [accent, measured] = c;
  const items = confinedWell(c, 2, { progressSkin: true });
  items.push(...plot([[-1.32, 0.72], [-0.65, 0.3], [-0.65, -0.18], [1.0, -0.55], [2.45, -0.7]], measured, 4));
  if (phase > 0) items.push(...bracket(-0.35, -0.18, 0.3, accent, phase === 1 ? String.raw`r_wS_f\partial_r h` : String.raw`r_w(S_f+D|Q|)\partial_r h`));
  if (phase === 2) items.push(math(String.raw`H=h-r_w(S_f+D|Q|)\partial_r h`, [0.72, 1.13], accent, 18), math(String.raw`h\to0\quad(r\to\infty)`, [1.35, -1.05], measured, 18));
  return field(items);
}

function scene08(phase, c) {
  const [accent, measured, pale] = c;
  const trace = wave(0, 0.66, 1.35, 9, -2.85, 0.42);
  const items = [axes([-1.3, 0], measured, 3.3, 2.4, "[0, 8, 2]", "[-1, 1, 0.5]"), ...plot(trace, measured, 4), math(String.raw`h(r,t)`, [-1.3, 1.48], measured, 21)];
  if (phase > 0) items.push(ring(0.88, [1.75, 0], pale, 2), arrow([1.75, 0], [2.38, 0.52], accent, 4), math(String.raw`\Phi`, [2.58, 0.68], accent, 25), arrow([0.45, 0], [0.85, 0], accent, 4));
  if (phase === 2) items.push(arrow([1.75, 0], [1.2, -0.6], measured, 4), math(String.raw`\Phi^*`, [1.02, -0.82], measured, 23), math(String.raw`h=\operatorname{Im}[\Phi e^{i\omega t}]`, [0.1, 1.22], accent, 19), math(String.raw`i\omega S\Phi=T(\Phi_{rr}+r^{-1}\Phi_r)`, [0.4, -1.35], measured, 17));
  return field(items);
}

function scene09(phase, c) {
  const [accent, measured, pale] = c;
  const items = [
    rect(5.7, 0.72, [0, 0.82], measured, pale, 0.2), rect(5.7, 0.72, [0, -0.25], measured, "#FFFFFF", 0.08),
    math(String.raw`2\pi Tr_w\Phi_r=Q_{\rm peak}+\Omega_2\Phi^*`, [0, 0.82], measured, 18),
    math(String.raw`\Phi-r_w(S_f+D Q_{\rm peak}|\sin\omega t|)\Phi_r=\Phi^*`, [0, -0.25], measured, 16),
  ];
  if (phase > 0) items.push(line([2.1, 0.52], [2.75, -0.02], accent, 4), line([2.75, 0.52], [2.1, -0.02], accent, 4), math(String.raw`\Phi^*`, [2.45, 0.25], accent, 20));
  if (phase === 2) items.push(arrow([0, -0.75], [0, -1.05], accent, 4), math(String.raw`\Omega_1r_w\Phi_r-\Omega_2\Phi=Q_{\rm peak}`, [0, -1.35], accent, 19), math(String.raw`\Omega_2=\pi r_w^2i\omega`, [-1.8, 1.45], measured, 16));
  return field(items);
}

function scene10(phase, c) {
  const [accent, measured, pale] = c;
  const items = [ring(0.34, [-2.45, 0], accent, 4, pale, 0.35), math(String.raw`r_w`, [-2.45, -0.6], accent, 18)];
  const count = 2 + phase * 2;
  for (let index = 0; index < count; index += 1) items.push(arc(0.62 + index * 0.38, [-2.45, 0], -1.22, 2.44, index === count - 1 ? accent : measured, index === count - 1 ? 4 : 2));
  items.push(math(String.raw`K_0(\lambda r)`, [-0.55, 0.95], accent, 24));
  if (phase > 0) items.push(math(String.raw`K_1(\lambda r_w)`, [1.05, 0.95], measured, 24), math(String.raw`\lambda=\sqrt{i\omega/\kappa}`, [1.75, -0.95], measured, 18), math(String.raw`\kappa=T/S`, [1.75, -1.35], accent, 18));
  if (phase === 2) items.push(math(String.raw`\Phi=-\frac{Q_{\rm peak}K_0(\lambda r)}{\Omega_2K_0(\lambda r_w)+\lambda r_w\Omega_1K_1(\lambda r_w)}`, [0.55, 0.05], accent, 17), arrow([1.8, 0.55], [2.75, 0.55], measured, 3), math(String.raw`\Phi\to0`, [2.45, 0.9], measured, 17));
  return field(items);
}

function scene11(phase, c) {
  const [accent, measured, pale] = c;
  const items = [ring(0.82, [-2.2, 0], pale, 2), arrow([-2.2, 0], [-1.62, 0.54], accent, 4), math(String.raw`\Phi`, [-1.38, 0.72], accent, 23)];
  if (phase > 0) items.push(arrow([-1.05, 0], [-0.35, 0], accent, 4), axes([1.35, 0], measured, 3.3, 2.4, "[0, 8, 2]", "[-1, 1, 0.5]"), ...plot(wave(0, 0.62, 1.4, 9, 0, 0.38), accent, 4));
  if (phase === 2) items.push(math(String.raw`h(r,t)=\operatorname{Im}[\Phi(r,t)e^{i\omega t}]`, [0.1, 1.42], accent, 20), math(String.raw`K_0,K_1\ \text{retained}`, [1.4, -1.42], measured, 18));
  return field(items);
}

function scene12(phase, c) {
  const [accent, measured, pale] = c;
  const parameters = [String.raw`T`, String.raw`S`, String.raw`\omega`, String.raw`S_f`, String.raw`D`];
  const items = [axes([1.1, 0], measured, 3.8, 2.45, "[0, 8, 2]", "[-1, 1, 0.5]"), ...plot(wave(0, 0.42, 1.3, 9, -0.6, 0.45), measured, 3)];
  parameters.slice(0, 2 + phase * 2).forEach((label, index) => {
    const y = 1.1 - index * 0.52;
    items.push(line([-2.7, y], [-1.35, y], pale, 6), line([-2.7, y], [-2.7 + 0.25 * (index + 1), y], index === phase ? accent : measured, 6), dot([-2.7 + 0.25 * (index + 1), y], index === phase ? accent : measured, 0.1), math(label, [-3.02, y], measured, 18));
  });
  if (phase === 2) items.push(math(String.raw`X_k=P_k\frac{\partial\Phi}{\partial P_k}`, [0.9, 1.42], accent, 21), math(String.raw`X_k\gtrless0`, [-1.95, -1.42], measured, 18));
  return field(items);
}

function scene13(phase, c) {
  const [accent, measured, pale] = c;
  const labels = [String.raw`T`, String.raw`S`, String.raw`\omega`, String.raw`S_f`, String.raw`D`];
  const shares = [0.2, 0.13, 0.42, 0.08, 0.04];
  const items = [rect(5.45, 0.5, [0, -0.85], measured, "#FFFFFF", 0.04)];
  let cursor = -2.72;
  shares.slice(0, 2 + phase * 2).forEach((share, index) => {
    const width = share * 5.9;
    items.push(rect(width, 0.5, [cursor + width / 2, -0.85], index === 2 ? accent : measured, index === 2 ? accent : pale, index === 2 ? 0.6 : 0.35), math(labels[index], [cursor + width / 2, -0.85], index === 2 ? "#FFFFFF" : measured, 16));
    cursor += width;
  });
  const curves = labels.map((_, index) => wave(0.85 - index * 0.32, 0.08 + index * 0.025, 1.15 + index * 0.25, 9, -2.7, 0.68, index * 0.4));
  curves.slice(0, 2 + phase * 2).forEach((points, index) => items.push(...plot(points, index === 2 ? accent : measured, index === 2 ? 4 : 2)));
  if (phase === 2) items.push(math(String.raw`\mathrm{DIM}_k=\frac{|X_k|}{\sum_j|X_j|}`, [0, 1.48], accent, 20), math(String.raw`\omega>T>S>S_f>D`, [0, -1.45], measured, 20));
  return field(items);
}

function scene14(phase, c) {
  const [accent, measured, pale] = c;
  const labels = [String.raw`T`, String.raw`S`, String.raw`S_f`, String.raw`D`];
  const items = [];
  labels.forEach((label, index) => {
    const y = 1.05 - index * 0.7;
    items.push(line([-2.75, y], [-1.15, y], measured, 3), arrow([-1.0, y], [0.1, y], accent, 3), line([0.35, y], [2.75, y], measured, 3), math(label, [-2.98, y], measured, 19));
    if (phase > 0 || index < phase + 1) items.push(math(String.raw`\log ` + label, [1.52, y], index === phase ? accent : measured, 20));
    if (phase === 2) items.push(rect(2.35, 0.36, [1.52, y], accent, pale, 0.12));
  });
  if (phase === 2) items.push(math(String.raw`T,S,S_f,D>0`, [0, 1.55], accent, 21));
  return field(items);
}

function objectiveSurface(c) {
  const [accent, measured, pale] = c;
  return [
    poly([[-2.8, -1.15], [-1.8, 0.15], [-0.65, 0.85], [0.25, 0.35], [1.2, 1.0], [2.75, -0.75], [1.4, -1.25], [0.1, -0.55], [-1.2, -1.2]], measured, pale, 0.35),
    arc(0.42, [0.35, -0.2], 0, 6.1, measured, 2), arc(0.82, [0.35, -0.2], 0, 6.1, measured, 2), arc(1.25, [0.35, -0.2], 0, 6.1, pale, 2),
  ];
}

function scene15(phase, c) {
  const [accent, measured] = c;
  const candidates = [[-2.35, 0.75], [-1.75, -0.45], [-0.9, 0.45], [-0.35, -0.65], [0.75, 0.6], [1.45, -0.35], [2.2, 0.35]];
  const items = objectiveSurface(c);
  items.push(...candidates.slice(0, 3 + phase * 2).map((xy, index) => dot(xy, index === 2 + phase ? accent : measured, 0.11)));
  if (phase > 0) items.push(...candidates.slice(0, 3 + phase * 2).map((xy) => arrow(xy, [0.35, -0.2], accent, 2)));
  if (phase === 2) items.push(math(String.raw`\min_{T,S,S_f,D}\sum_{j=1}^{M}e_j^2`, [0, 1.48], accent, 20), math(String.raw`\mathrm{DE}`, [-2.45, -1.5], measured, 22));
  return field(items);
}

function scene16(phase, c) {
  const [accent, measured, pale] = c;
  const items = objectiveSurface(c);
  const positions = [[-1.9, 0.75], [-1.05, 0.38], [-0.35, 0.05], [0.1, -0.12], [0.35, -0.2]];
  items.push(...positions.slice(0, 2 + phase * 2).map((xy, index) => dot(xy, index === Math.min(positions.length - 1, 1 + phase * 2) ? accent : measured, 0.12)));
  if (phase > 0) positions.slice(0, 2 + phase * 2).forEach((xy, index) => { if (index) items.push(arrow(positions[index - 1], xy, accent, 2)); });
  if (phase === 2) items.push(ring(0.22, [0.35, -0.2], accent, 4, pale, 0.25), math(String.raw`\mathrm{DE}\longrightarrow\mathrm{LM}`, [0, 1.48], accent, 21), math(String.raw`\mathrm{Solution}\ 1,2,3`, [1.75, -1.42], measured, 18));
  return field(items);
}

function metricBars(values, phase, c, label) {
  const [accent, measured, pale] = c;
  const items = [line([-2.75, -1.12], [2.75, -1.12], measured, 2), math(label, [-2.45, 1.45], accent, 24)];
  values.slice(0, phase + 1).forEach((value, index) => {
    const height = value / Math.max(...values) * 2.05;
    const x = -1.65 + index * 1.65;
    items.push(rect(0.72, height, [x, -1.12 + height / 2], index === 0 ? accent : measured, index === 0 ? accent : pale, index === 0 ? 0.62 : 0.42), math(String.raw`S_${index + 1}`, [x, -1.48], measured, 18), math(`${value.toFixed(2)}\\times10^{-3}`, [x, -1.12 + height + 0.25], index === 0 ? accent : measured, 16));
  });
  return items;
}

function scene17(phase, c) {
  const [accent, measured] = c;
  const items = metricBars([5.51, 5.52, 9.67], phase, c, String.raw`\mathrm{SEE}`);
  if (phase > 0) items.push(...[-2.2, -1.55, -0.9, -0.25, 0.4].slice(0, 1 + phase * 2).map((x, index) => [line([x, 0.9], [x, 0.9 - 0.18 * (index + 1)], measured, 2), dot([x, 0.9 - 0.18 * (index + 1)], accent, 0.06)]).flat());
  if (phase === 2) items.push(math(String.raw`\mathrm{SEE}=\sqrt{\frac{1}{M-\nu}\sum_{j=1}^{M}e_j^2}`, [0.85, 1.45], accent, 18));
  return field(items);
}

function scene18(phase, c) {
  const [accent, measured] = c;
  const items = metricBars([1.22, 2.19, 3.95], phase, c, String.raw`\mathrm{ME}`);
  const balanceY = 0.9;
  items.push(line([-2.7, balanceY], [-0.55, balanceY], measured, 3), dot([-1.62, balanceY], accent, 0.11));
  if (phase > 0) items.push(arrow([-2.35, 1.25], [-2.35, balanceY], accent, 3), arrow([-0.9, 0.55], [-0.9, balanceY], measured, 3));
  if (phase === 2) items.push(math(String.raw`\mathrm{ME}=\frac{1}{M}\sum_{j=1}^{M}e_j`, [0.85, 1.45], accent, 19));
  return field(items);
}

function fieldTraces(phase, c) {
  const [accent, measured, pale] = c;
  const measuredTrace = saw(0, 0.9, 17);
  const solution1 = measuredTrace.map(([x, y], index) => [x, y + (index % 4 === 2 ? -0.08 : 0.05)]);
  const solution2 = wave(0, 0.52, 1.55, 17, -2.75, 0.34, -0.3);
  const solution3 = wave(0, 0.46, 1.55, 17, -2.75, 0.34, -0.15);
  const items = [axes([0, -0.05], measured, 5.65, 2.65, "[0, 300, 100]", "[-0.03, 0.03, 0.01]"), ...plot(measuredTrace, pale, 8)];
  if (phase >= 0) items.push(...plot(solution1, accent, 4));
  if (phase > 0) items.push(...plot(solution2, measured, 3));
  if (phase === 2) items.push(...plot(solution3, measured, 2));
  return items;
}

function scene19(phase, c) {
  const [accent, measured, pale] = c;
  const items = fieldTraces(phase, c);
  items.push(math(String.raw`\mathrm{measured}`, [-2.0, 1.48], pale, 17), math(String.raw`S_1`, [-0.85, 1.48], accent, 18));
  if (phase > 0) items.push(math(String.raw`S_2`, [0, 1.48], measured, 18));
  if (phase === 2) items.push(math(String.raw`S_3`, [0.75, 1.48], measured, 18), ring(0.34, [1.67, 0.7], accent, 4), math(String.raw`\mathrm{SEE}_1=5.51\times10^{-3}`, [-1.55, -1.48], accent, 15), math(String.raw`\mathrm{ME}_1=1.22\times10^{-3}`, [1.35, -1.48], accent, 15));
  return field(items);
}

function scene20(phase, c) {
  const [accent, measured, pale] = c;
  const items = confinedWell(c, 2, { progressSkin: true });
  if (phase > 0) {
    const measuredTrace = saw(0.35, 0.55, 9, -0.25, 0.36);
    const fullTrace = measuredTrace.map(([x, y], index) => [x, y + (index % 4 === 2 ? -0.06 : 0.04)]);
    items.push(...plot(measuredTrace, pale, 7), ...plot(fullTrace, accent, 4), arrow([-0.45, -0.65], [0.2, -0.35], accent, 4));
  }
  if (phase === 2) items.push(math(String.raw`S_f+D|Q|`, [-0.55, 1.02], accent, 22), math(String.raw`\mathrm{Solution}\ 1`, [1.55, 1.25], accent, 19), math(String.raw`\bar T,\bar S\ \text{within OPT influence}`, [1.1, -1.15], measured, 16), ring(0.3, [1.75, 0.9], accent, 4));
  return field(items);
}

const SCENES = [
  [/confined aquifer cross-section with an oscillating well flux and zero-net-volume gauge|alternates extraction and injection around a zero-net-volume/, scene01],
  [/pumping-well cross-section with a distinct skin annulus|thin annulus around the well contrasts/, scene02],
  [/well-screen velocity field with a pumping-rate-linked head-loss bracket|velocity arrows crowd through the screen/, scene03],
  [/oscillatory response model with separate wellbore-skin and rate-dependent-skin inputs|two separate loss objects sit beside an incomplete response model/, scene04],
  [/radial aquifer rings carrying an oscillatory head field|center the coordinate system on the well/, scene05],
  [/well column storage marker coupled to radial flux|split the imposed flux into aquifer and storage/, scene06],
  [/well boundary with a skin drop and a rate-linked screen-loss bracket|insert the missing rate-dependent loss directly at the inner boundary/, scene07],
  [/sinusoidal head traces collapsing into aquifer and well phasor arrows|time waves become phasors/, scene08],
  [/two boundary-equation lanes sharing a wellbore phasor term|eliminate the wellbore phasor/, scene09],
  [/boundary-constrained radial phasor field expressed by bessel response terms|solve the radial phasor/, scene10],
  [/solved radial phasor rotating into a sinusoidal hydraulic-head trace|project the imaginary phasor component/, scene11],
  [/parameter perturbation sliders linked to signed changes|response per parameter change/, scene12],
  [/sensitivity contributions partitioning a unit dim bar|relative parameter influence/, scene13],
  [/four positive parameter axes folding onto logarithmic coordinates|log-transform t s sf d/, scene14],
  [/differential-evolution candidates moving over the squared-error surface|differential evolution stage/, scene15],
  [/candidate marker settling onto the field-head squared-error minimum|levenberg marquardt stage/, scene16],
  [/squared field-head errors accumulating into an see gauge|standard error of estimation for each fitted solution/, scene17],
  [/signed field-head errors balancing on an me gauge|mean prediction error for each fitted solution/, scene18],
  [/three predicted head traces over the measured field peaks|which model reaches the peaks/, scene19],
  [/original oscillatory pumping-well cross-section beside measured field heads|screen losses reshape the inference/, scene20],
];

export function renderPaperVisual2024_02_22(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description);
  if (!text.includes("[paper:2024-02-22]")) return null;
  const match = SCENES.find(([pattern]) => pattern.test(text));
  return match ? match[1](phaseOf(phase), colorsOf(palette)) : null;
}
