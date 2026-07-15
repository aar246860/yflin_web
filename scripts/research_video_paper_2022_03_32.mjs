const PAPER_MARKER = "[paper:2022-03-32]";
const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const p = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dashed = (a, b, color, width = 3) => `DashedLine(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, dash_length=0.1)`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (center, color, radius = 0.075) => `Dot(${q(center)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, center, stroke, fill, opacity = 0, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const rect = (width, height, center, stroke, fill, opacity = 0.2, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const arc = (radius, start, angle, center, color, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).move_to(${q(center)})`;
const math = (value, center, color, size = 22) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const label = (value, center, color, size = 17) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const axes = (xRange, yRange, center, color, width = 5.2, height = 2.8) => `Axes(x_range=${q(xRange)}, y_range=${q(yRange)}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": True, "font_size": 16}).move_to(${q(center)})`;
const trace = (points, color, width = 3, broken = false) => points.slice(0, -1).map((xy, index) => (broken ? dashed : line)(p(...xy), p(...points[index + 1]), color, width));
const field = (items) => `VGroup(${items.flat().filter(Boolean).join(", ")}).scale(0.67).shift([-1.45, 0.12, 0])`;
const phaseOf = (value) => Math.max(0, Math.min(2, Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0));
const paletteOf = (value) => {
  const colors = Array.isArray(value) ? value : [];
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]];
};
const normalized = (value) => value.normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();

function unpack(context, phase, palette) {
  const raw = typeof context === "string" ? context : JSON.stringify(context ?? "");
  if (!raw.includes(PAPER_MARKER)) return null;
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return { text: normalized(raw), scene: null, phase: phaseOf(phase), colors: paletteOf(palette) };
  }
  const scene = Number(context.scene ?? context.sceneNumber ?? context.index);
  return {
    text: normalized(raw),
    scene: Number.isInteger(scene) && scene >= 1 && scene <= 17 ? scene : null,
    phase: phaseOf(context.phase ?? phase),
    colors: paletteOf(context.palette ?? palette),
  };
}

const RECOVERY = [[-2.6, 1.15], [-2.15, 1.05], [-1.65, 0.83], [-1.1, 0.46], [-0.5, 0.02], [0.2, -0.43], [1.0, -0.78], [1.9, -1.0], [2.65, -1.08]];
const CASE_1 = RECOVERY.map(([x, y], index) => [x, y + [0.03, 0.05, 0.12, 0.2, 0.3, 0.36, 0.31, 0.2, 0.12][index]]);
const CASE_2 = RECOVERY.map(([x, y], index) => [x, y + [0.02, 0.04, 0.09, 0.16, 0.24, 0.3, 0.26, 0.16, 0.09][index]]);
const CASE_3 = RECOVERY.map(([x, y], index) => [x, y + [0.01, -0.01, 0.02, -0.02, 0.02, -0.01, 0.015, -0.01, 0][index]]);

function recoveryAxes(colors) {
  const [, measured] = colors;
  return [axes([-3, 3, 1], [0, 1, 0.25], p(0, -0.05), measured, 5.5, 3), math(String.raw`\log_{10}(t/\mathrm{s})`, p(2.2, -1.62), measured, 18), math(String.raw`H/H_0`, p(-2.95, 1.25), measured, 20)];
}

function scene01(phase, [accent, measured, pale]) {
  const level = [1.15, 0.72, 0.25][phase];
  const items = [rect(0.72, 3.1, p(-1.8, 0), measured, "#FFFFFF", 0.04), rect(5.2, 1.7, p(0.25, -0.35), measured, pale, 0.38), rect(0.5, level + 1.35, p(-1.8, -1.35 + (level + 1.35) / 2), accent, pale, 0.72), line(p(-2.1, level), p(-1.5, level), accent, 5), math(String.raw`H(t)`, p(-2.45, level), accent, 22)];
  if (phase >= 1) items.push(...[0.65, 1.25, 1.85].map((r) => arc(r, -1.05, 2.1, p(-1.8, -0.35), measured, 2)), ...[-1.15, -0.55, 0.05].map((x) => arrow(p(x, -0.35), p(x + 0.42, -0.35), accent, 3)));
  if (phase === 2) items.push(...recoveryAxes([accent, measured, pale]).map((item) => `${item}.scale(0.48).shift([2.0, 0.45, 0])`), ...trace(RECOVERY, accent, 4).map((item) => `${item}.scale(0.48).shift([2.0, 0.45, 0])`));
  return field(items);
}

function scene02(phase, [accent, measured, pale]) {
  const items = [rect(5.7, 2.2, p(0, 0), measured, pale, 0.38), circle(0.52, p(-1.25, 0), measured, "#FFFFFF", 1, 4), circle(0.72, p(-1.25, 0), accent, pale, phase ? 0.58 : 0.18, 4), math(String.raw`r_w`, p(-1.25, -0.95), measured, 20)];
  if (phase >= 1) items.push(...[-2.65, -2.25, -1.9].map((x) => arrow(p(x, 0), p(x + 0.38, 0), accent, 4)), line(p(0.15, 0.8), p(0.15, -0.6), measured, 3), line(p(0.55, 0.8), p(0.55, -0.2), accent, 5));
  if (phase === 2) items.push(math(String.raw`\Delta h_s\propto q`, p(1.65, 1.18), accent, 25), math(String.raw`S_f\;[-]`, p(-0.1, -1.25), accent, 22), arrow(p(0.15, -0.85), p(0.55, -0.85), accent, 4));
  return field(items);
}

function scene03(phase, [accent, measured, pale]) {
  const linear = [[-2.55, -1.05], [-1.7, -0.55], [-0.85, -0.05], [0, 0.45], [0.85, 0.95]];
  const nonlinear = [[-2.55, -1.05], [-1.7, -0.68], [-0.85, -0.18], [0, 0.55], [0.85, 1.55]];
  const items = [axes([0, 5, 1], [0, 5, 1], p(-0.75, 0.05), measured, 4.5, 3), ...trace(linear.slice(0, 3 + phase), measured, 3), math(String.raw`q`, p(1.7, -1.35), measured, 20), math(String.raw`\Delta h`, p(-3.0, 1.25), measured, 20)];
  if (phase >= 1) items.push(...trace(nonlinear.slice(0, 3 + phase), accent, 5), ...[-2.05, -1.3, -0.55].map((x) => arrow(p(x, -1.55), p(x, -1.1 + 0.3 * phase), accent, 3)));
  if (phase === 2) items.push(math(String.raw`\Delta h\propto q+\beta q^2`, p(1.65, 1.3), accent, 23), math(String.raw`\beta\;[\mathrm{T\,L^{-1}}]`, p(1.55, 0.78), accent, 19));
  return field(items);
}

function scene04(phase, [accent, measured, pale]) {
  const radii = [0.35, 0.72, 1.12, 1.58, 2.05].slice(0, 3 + phase);
  const items = [rect(5.8, 3.0, p(0, 0), measured, pale, 0.24), circle(0.24, p(-0.75, 0), accent, pale, 0.7, 4), ...radii.map((radius, index) => circle(radius, p(-0.75, 0), index === radii.length - 1 ? accent : measured, pale, 0.04, index === radii.length - 1 ? 4 : 2)), arrow(p(-0.5, 0), p(1.55 + 0.25 * phase, 0), accent, 4), math(String.raw`r`, p(1.2, 0.35), accent, 22)];
  if (phase >= 1) items.push(math(String.raw`h(r,t)\;[\mathrm L]`, p(1.55, 1.3), measured, 22), math(String.raw`T\;[\mathrm{L^2T^{-1}}]`, p(1.7, -0.7), accent, 19), math(String.raw`S\;[-]`, p(1.7, -1.15), measured, 19));
  if (phase === 2) items.push(math(String.raw`\frac1r\partial_r(rT\partial_rh)=S\partial_th`, p(0, 1.72), accent, 21));
  return field(items);
}

function scene05(phase, [accent, measured, pale]) {
  const head = [[-2.7, 1.1], [-1.65, 0.75], [-0.72, 0.32], [-0.52, -0.28], [0.45, -0.62], [1.6, -0.82], [2.65, -0.92]];
  const items = [line(p(-0.63, -1.25), p(-0.63, 1.35), pale, 8), line(p(-0.43, -1.25), p(-0.43, 1.35), accent, 4), ...trace(head.slice(0, 3 + phase * 2), measured, 4), math(String.raw`h(r_w,t)`, p(-1.45, 1.35), measured, 20)];
  if (phase >= 1) items.push(arrow(p(-0.72, 0.3), p(-0.52, -0.25), accent, 4), math(String.raw`\Delta h_s`, p(0.05, 0.25), accent, 22));
  if (phase === 2) items.push(math(String.raw`h-r_wS_f\partial_rh=H`, p(1.35, 1.2), accent, 24), math(String.raw`S_f\;[-]`, p(-0.52, -1.55), accent, 20));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const waterTop = [1.05, 0.58, 0.12][phase];
  const items = [rect(1.35, 3.0, p(0, 0), measured, "#FFFFFF", 0.03), rect(1.05, waterTop + 1.35, p(0, -1.35 + (waterTop + 1.35) / 2), accent, pale, 0.65), line(p(-0.52, waterTop), p(0.52, waterTop), accent, 5), math(String.raw`H(t)`, p(0.95, waterTop), accent, 21)];
  if (phase >= 1) items.push(...[-1.65, -1.15, 1.15, 1.65].map((x) => arrow(p(x, -0.4), p(0.63 * Math.sign(-x), -0.4), accent, 4)), math(String.raw`q\;[\mathrm{L\,T^{-1}}]`, p(-1.95, -0.85), measured, 18));
  if (phase === 2) items.push(math(String.raw`\pi r_w^2\dot H=-2\pi r_wbq`, p(0, 1.62), accent, 24), arrow(p(0.85, 0.95), p(0.85, 0.2), measured, 4));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const items = [arrow(p(-3.0, 0), p(-1.9, 0), measured, 5), rect(1.35, 0.72, p(-1.15, 0), measured, pale, 0.36), math(String.raw`q`, p(-1.15, 0), measured, 26)];
  if (phase >= 1) items.push(rect(1.45, 0.72, p(0.45, 0), accent, pale, 0.4), math(String.raw`\beta q^2`, p(0.45, 0), accent, 24), arrow(p(1.22, 0), p(2.2, 0), accent, 5));
  if (phase === 2) items.push(math(String.raw`q+\beta q^2=-\frac{T}{b}\partial_rh`, p(0, 1.28), accent, 25), math(String.raw`\beta\;[\mathrm{s\,m^{-1}}]`, p(0.45, -0.9), accent, 20), circle(0.32, p(2.45, 0), accent, pale, 0.35, 4));
  return field(items);
}

function scene08(phase, [accent, measured, pale]) {
  const items = [math(String.raw`h,H,H_0\;[\mathrm L]`, p(-2.05, 1.35), measured, 18), math(String.raw`r,r_w,b\;[\mathrm L]`, p(-2.05, 0.72), measured, 18), math(String.raw`t\;[\mathrm T]`, p(-2.05, 0.08), measured, 18), math(String.raw`T\;[\mathrm{L^2T^{-1}}],\ S\;[-]`, p(-2.05, -0.58), measured, 17), math(String.raw`\beta\;[\mathrm{L^{-1}T}]`, p(-2.05, -1.22), measured, 18), arrow(p(-0.75, 0), p(-0.05, 0), accent, 4)];
  if (phase >= 1) items.push(rect(2.65, 1.55, p(1.45, 0.75), accent, pale, 0.25), math(String.raw`h_D=h/H_0`, p(1.45, 1.15), accent, 21), math(String.raw`H_D=H/H_0`, p(1.45, 0.72), accent, 21), math(String.raw`r_D=r/r_w`, p(1.45, 0.29), accent, 21));
  if (phase === 2) items.push(rect(2.95, 1.55, p(1.45, -0.95), measured, pale, 0.22), math(String.raw`t_D=\frac{Tt}{Sr_w^2}`, p(1.45, -0.48), accent, 22), math(String.raw`C_D=\frac1{2S}`, p(0.75, -1.02), measured, 20), math(String.raw`\beta_D=\frac{H_0T\beta}{br_w}`, p(1.85, -1.42), accent, 19));
  return field(items);
}

function scene09(phase, [accent, measured, pale]) {
  const timeCurve = [[-2.75, -1.0], [-2.25, -0.7], [-1.8, -0.2], [-1.35, 0.4], [-0.9, 0.82], [-0.45, 1.0]];
  const items = [line(p(-2.85, -1.15), p(-0.35, -1.15), measured, 3), ...trace(timeCurve.slice(0, 3 + phase), measured, 4), math(String.raw`t_D`, p(-0.2, -1.15), measured, 20)];
  if (phase >= 1) items.push(arrow(p(0.05, 0), p(0.75, 0), accent, 4), math(String.raw`\mathcal L_{t_D\to s}`, p(0.4, 0.45), accent, 23), rect(1.9, 2.25, p(1.9, 0), accent, pale, 0.22), math(String.raw`\bar h_D(r_D,s)`, p(1.9, 0.55), accent, 21), math(String.raw`\bar H_D(s)`, p(1.9, 0), accent, 23));
  if (phase === 2) items.push(math(String.raw`H_D(0)=1`, p(-1.65, 1.45), measured, 20), math(String.raw`\mathcal L\{q_D^2\}`, p(1.9, -0.62), measured, 21));
  return field(items);
}

function scene10(phase, [accent, measured, pale]) {
  const items = [rect(1.65, 0.8, p(-2.15, 0.3), measured, pale, 0.28), math(String.raw`\mathcal L\{g\}`, p(-2.15, 0.3), measured, 26), math(String.raw`g=q_D^2`, p(-2.15, -0.55), accent, 22)];
  if (phase >= 1) items.push(arrow(p(-1.2, 0.3), p(-0.55, 0.3), accent, 4), math(String.raw`\frac{g(0)}s`, p(0.05, 0.8), accent, 25), math(String.raw`+\frac1s\int_0^\infty e^{-st_D}g'(t_D)\,dt_D`, p(1.2, 0.05), measured, 19));
  if (phase === 2) items.push(arrow(p(0.05, -0.2), p(0.05, -0.85), accent, 4), math(String.raw`\frac{g(0)}s+\frac{g'(0)}{s^2}`, p(-0.6, -1.2), accent, 22), math(String.raw`+\frac1{s^2}\int_0^\infty e^{-st_D}g''(t_D)\,dt_D`, p(1.65, -1.2), measured, 17));
  return field(items);
}

function scene11(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...recoveryAxes(colors), ...RECOVERY.filter((_, index) => index % 2 === 0).slice(0, 2 + phase).map((xy) => dot(p(...xy), measured, 0.08))];
  if (phase >= 1) items.push(math(String.raw`\mathcal L^{-1}_{\mathrm{Stehfest}}`, p(0.35, 1.48), accent, 20), ...trace(CASE_3.slice(0, 5 + phase * 2), accent, 4));
  if (phase === 2) items.push(math(String.raw`H_D=H/H_0`, p(-1.65, 1.48), accent, 20), ...RECOVERY.map((xy) => dot(p(...xy), measured, 0.065)), line(p(-2.7, -1.3), p(2.7, -1.3), pale, 2));
  return field(items);
}

function scene12(phase, colors) {
  const [accent, measured, pale] = colors;
  const cooper = CASE_3.map(([x, y], index) => [x, y + 0.01 * Math.sin(index)]);
  const items = [...recoveryAxes(colors), ...trace(CASE_3.slice(0, 5 + phase * 2), accent, 4), math(String.raw`\mathrm{present}`, p(1.95, 1.3), accent, 18)];
  if (phase >= 1) items.push(...trace(cooper.slice(0, 5 + phase * 2), measured, 3, true), math(String.raw`S_f=0,\ \beta_D=0`, p(-1.6, 1.48), measured, 20));
  if (phase === 2) items.push(math(String.raw`r_c=r_w`, p(-0.05, 1.48), measured, 20), math(String.raw`\mathrm{Cooper\ et\ al.\ (1967)}`, p(1.55, 0.88), measured, 17), ...cooper.map((xy) => dot(p(...xy), measured, 0.055)));
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const radii = [0.45, 0.85, 1.25, 1.65, 2.05];
  const items = [circle(0.23, p(-1.45, 0), accent, pale, 0.55, 4), ...radii.slice(0, 3 + phase).map((r) => circle(r, p(-1.45, 0), measured, pale, 0.03, 2)), ...[-1.1, -0.55, 0, 0.55, 1.1].slice(0, 3 + phase).map((angle) => line(p(-1.45, 0), p(-1.45 + 2.05 * Math.cos(angle), 2.05 * Math.sin(angle)), measured, 2))];
  if (phase >= 1) items.push(math(String.raw`\mathbf K(\mathbf u)\mathbf u=\mathbf f`, p(1.45, 1.05), accent, 22), arrow(p(0.35, 0), p(0.95, 0), accent, 4), ...[p(1.2, 0.45), p(1.55, 0.05), p(1.95, -0.4)].map((xy) => dot(xy, measured, 0.08)));
  if (phase === 2) items.push(...trace([[1.0, -1.0], [1.35, -0.65], [1.7, -0.2], [2.05, 0.28], [2.45, 0.62], [2.75, 0.78]], accent, 4), math(String.raw`H_D(t_D)`, p(2.0, -1.25), accent, 20), label("FEM", p(2.35, 1.25), measured, 18));
  return field(items);
}

function scene14(phase, colors) {
  const [accent, measured] = colors;
  const fem = CASE_3.map(([x, y], index) => [x, y + [0.01, -0.015, 0.012, -0.01, 0.015, -0.012, 0.01, -0.008, 0][index]]);
  const items = [...recoveryAxes(colors), ...trace(CASE_3.slice(0, 5 + phase * 2), accent, 4), math(String.raw`\mathrm{semi\!-\!analytical}`, p(1.65, 1.38), accent, 17)];
  if (phase >= 1) items.push(...fem.slice(0, 5 + phase * 2).map((xy) => dot(p(...xy), measured, 0.07)), math(String.raw`\mathrm{FEM}`, p(1.9, 1.0), measured, 18));
  if (phase === 2) items.push(...fem.slice(1, -1).map((xy) => circle(0.12, p(...xy), accent, "#FFFFFF", 0, 2)), math(String.raw`\Delta H_D\simeq0`, p(-1.6, 1.48), accent, 21));
  return field(items);
}

function scene15(phase, colors) {
  const [accent, measured, pale] = colors;
  const labels = [String.raw`T\ [\mathrm{m^2s^{-1}}]`, String.raw`S\ [-]`, String.raw`S_f\ [-]`, String.raw`\beta\ [\mathrm{s\,m^{-1}}]`];
  const items = [...recoveryAxes(colors).map((item) => `${item}.scale(0.72).shift([-0.95, 0.05, 0])`), ...RECOVERY.slice(0, 5 + phase * 2).map((xy) => dot(p(-1.05 + 0.72 * xy[0], 0.05 + 0.72 * xy[1]), measured, 0.065)), ...trace([CASE_1, CASE_2, CASE_3][phase], accent, 4).map((item) => `${item}.scale(0.72).shift([-0.95, 0.05, 0])`)];
  labels.forEach((text, index) => {
    const y = 1.1 - index * 0.72;
    items.push(math(text, p(2.0, y + 0.25), index <= phase ? accent : measured, 16), line(p(1.15, y), p(2.85, y), measured, 3), dot(p(1.45 + 0.55 * Math.min(phase, index + 1), y), index <= phase ? accent : pale, 0.09));
  });
  if (phase === 2) items.push(math(String.raw`\min\sum_i(H_{D,i}^{obs}-H_{D,i}^{mod})^2`, p(0.15, 1.72), accent, 18));
  return field(items);
}

const SITE_ROWS = [
  { name: "LA-87B", rows: [["C1", "2.97e-2", "5.47e-3"], ["C2", "2.92e-2", "5.51e-3"], ["C3", "2.11e-2", "6.08e-4"]], curves: [CASE_1, CASE_2, CASE_3] },
  { name: "LA-88B (12 psi)", rows: [["C1", "6.42e-2", "5.41e-3"], ["C2", "5.81e-2", "2.07e-3"], ["C3", "1.91e-2", "1.79e-4"]], curves: [CASE_1, CASE_2, CASE_3] },
  {
    name: "LA-88A",
    rows: [["C1", "1.69e-2", "2.00e-3"], ["C2", "1.59e-2", "-3.60e-4"], ["C3", "1.11e-2", "-1.34e-5"]],
    curves: [
      RECOVERY.map(([x, y], index) => [x, y + 0.035 * Math.sin(index * 0.8)]),
      RECOVERY.map(([x, y], index) => [x, y + 0.022 * Math.sin(index * 0.8 + 0.35)]),
      RECOVERY.map(([x, y], index) => [x, y + 0.012 * Math.sin(index * 0.8 + 0.7)]),
    ],
  },
];

function sitePanel(config, phase, colors) {
  const [accent, measured, pale] = colors;
  const curvePoint = ([x, y]) => p(config.x + 0.26 * x, 0.57 + 0.28 * y);
  const caseColors = [pale, measured, accent];
  const items = [
    rect(1.95, 3.25, p(config.x, 0), measured, pale, 0.12),
    label(config.name, p(config.x, 1.4), accent, config.name.length > 8 ? 14 : 17),
    line(p(config.x - 0.76, 0.18), p(config.x - 0.76, 0.92), measured, 2),
    line(p(config.x - 0.76, 0.18), p(config.x + 0.76, 0.18), measured, 2),
    ...RECOVERY.map((xy) => dot(curvePoint(xy), measured, 0.035)),
    ...config.curves.slice(0, phase + 1).flatMap((points, index) => trace(points.map(curvePoint), caseColors[index], index === 2 ? 4 : 2, index === 1)),
    math(String.raw`\mathrm{SEE}\;/\;\mathrm{ME}`, p(config.x + 0.22, -0.08), measured, 13),
  ];
  config.rows.slice(0, phase + 1).forEach(([caseName, see, me], index) => {
    const y = -0.47 - index * 0.43;
    if (phase === 2 && index === 2) items.push(rect(1.75, 0.36, p(config.x, y), accent, pale, 0.5));
    items.push(label(caseName, p(config.x - 0.65, y), index === 2 ? accent : measured, 14), math(`${see.replace("e", String.raw`\times10^{`)}${see.includes("e") ? "}" : ""}`, p(config.x - 0.05, y + 0.1), index === 2 ? accent : measured, 12), math(`${me.replace("e", String.raw`\times10^{`)}${me.includes("e") ? "}" : ""}`, p(config.x + 0.55, y - 0.12), index === 2 ? accent : measured, 12));
  });
  return items;
}

function scene16(phase, colors) {
  const xs = [-2.15, 0, 2.15];
  const items = SITE_ROWS.flatMap((site, index) => sitePanel({ ...site, x: xs[index] }, phase, colors));
  items.push(math(String.raw`\mathrm{C1}:S_f=0,\ \beta=0`, p(-2.05, -1.78), colors[2], 14));
  if (phase >= 1) items.push(math(String.raw`\mathrm{C2}:\beta=0`, p(0, -1.78), colors[1], 14));
  if (phase === 2) items.push(math(String.raw`\mathrm{C3}:S_f,\beta`, p(2.05, -1.78), colors[0], 15));
  return field(items);
}

function scene17(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...recoveryAxes(colors), ...RECOVERY.map((xy) => dot(p(...xy), measured, 0.07)), ...trace(CASE_1, pale, 3), math(String.raw`\mathrm{Case\ 1}`, p(1.95, 1.28), pale, 17), label("LA-87B measured", p(-1.45, 1.52), measured, 16)];
  if (phase >= 1) items.push(...trace(CASE_2, measured, 3, true), math(String.raw`\mathrm{Case\ 2}:S_f`, p(1.82, 0.93), measured, 17), circle(0.23, p(-2.55, -0.82), accent, pale, 0.45, 3));
  if (phase === 2) items.push(...trace(CASE_3, accent, 5), math(String.raw`\mathrm{Case\ 3}:S_f+\beta`, p(1.72, 0.55), accent, 18), math(String.raw`\mathrm{SEE}=2.11\times10^{-2}`, p(-1.45, -1.5), accent, 17), math(String.raw`\mathrm{ME}=6.08\times10^{-4}`, p(0.65, -1.5), accent, 17), arrow(p(-2.55, -0.48), p(-2.2, 0.05), accent, 3));
  return field(items);
}

const SCENE_PATTERNS = [
  /slug recovery|initially displaced water column|falling normalized well level/,
  /linear skin loss|low-permeability skin annulus|damaged annulus/,
  /non-darcy loss|curved head-loss-versus-flux|departs visibly from a straight darcy/,
  /radial aquifer flow|radial aquifer rings|radial diffusion/,
  /skin factor|head profile stepping|proportional discontinuity/,
  /screen flux = storage change|screen inflow arrows|casing-volume change/,
  /linear \+ quadratic loss|linear and quadratic resistance|forchheimer relation/,
  /dimensionless system|dimensional.*dimensionless|normalize model variables/,
  /laplace domain|time-domain recovery curve folding|transform nonlinear system/,
  /successive parts|successive integration|boundary and integral terms/,
  /stehfest inversion|normalized water level versus logarithmic time|time-domain slug-test response/,
  /cooper zero-loss limit|cooper et al.*1967|zero-loss curve/,
  /solve fem response|finite-element mesh|independent finite-element/,
  /fem agreement|semi-analytical and finite-element recovery curves|solution agreement/,
  /field fit|four parameter controls|fit aquifer parameters/,
  /rankings vary by well|three site-labeled|me and see readouts/,
  /site-specific near-well losses|minnelusa fractured-aquifer well|case 1, case 2, and case 3 predictions/,
];
const RENDERERS = [scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08, scene09, scene10, scene11, scene12, scene13, scene14, scene15, scene16, scene17];

export function renderPaperVisual2022_03_32(context, phase = 0, palette = DEFAULT_PALETTE) {
  const value = unpack(context, phase, palette);
  if (value === null) return null;
  const scene = value.scene ?? SCENE_PATTERNS.findIndex((pattern) => pattern.test(value.text)) + 1;
  if (scene < 1 || scene > RENDERERS.length) return null;
  return RENDERERS[scene - 1](value.phase, value.colors);
}
