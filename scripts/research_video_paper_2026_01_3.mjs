const PAPER_MARKER = "[paper:2026-01-3]";
const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const p = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dashed = (a, b, color, width = 3) => `DashedLine(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, dash_length=0.1)`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (center, color, radius = 0.08) => `Dot(${q(center)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, center, stroke, fill, opacity = 0, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const rect = (width, height, center, stroke, fill, opacity = 0.25, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const polygon = (points, stroke, fill, opacity = 0.25, width = 3) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const arc = (radius, center, color, start = 0, angle = 1.6, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).move_arc_center_to(${q(center)})`;
const math = (value, center, color, size = 24) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const label = (value, center, color, size = 18) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const axes = (center, color, width = 5.5, height = 2.8, xRange = [0, 6, 1], yRange = [0, 2, 0.5]) => `Axes(x_range=${q(xRange)}, y_range=${q(yRange)}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": True, "font_size": 16}).move_to(${q(center)})`;
const trace = (points, color, width = 3, broken = false) => points.slice(0, -1).map((item, index) => (broken ? dashed : line)(p(item[0], item[1]), p(points[index + 1][0], points[index + 1][1]), color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.7).shift([-1.35, 0.06, 0])`;

const phaseOf = (value) => Math.max(0, Math.min(2, Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0));
const paletteOf = (value) => {
  const colors = Array.isArray(value) ? value : [];
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]];
};
const collectStrings = (value, seen = new Set()) => {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object" || seen.has(value)) return [];
  seen.add(value);
  return Object.values(value).flatMap((item) => collectStrings(item, seen));
};
const normalizeText = (value) => collectStrings(value).join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();

const SCENE_HINTS = [
  /smaller and later|boundary sinusoid propagating/,
  /one wave two diffusivities|two separated diffusivity gauges/,
  /memory not a time shift|decaying memory kernel/,
  /flux remembers gradients|past-gradient traces/,
  /two-lag diffusion|opposite sides of the diffusion balance/,
  /kappa\s*=\s*-alpha|complex wavenumber splitting/,
  /r\s*=\s*1 means agreement|mismatch map centered/,
  /morris effects|trajectory stepping once/,
  /absolute mean|folding into one absolute-mean bar/,
  /effect deviation|spreading around their mean/,
  /overall sensitivity|closing into one radial index/,
  /align cadence|irregular time stamps/,
  /remove means|recentring|recentering around a zero/,
  /remove trends|sloping baselines flattening/,
  /compute spectra|resolving into paired spectral lines/,
  /smooth spectra|daniell|jagged neighboring spectral bins/,
  /form transfer function|complex spectral ratio/,
  /select harmonics|coherence threshold|2 to 48 hour/,
  /amplitude ratios|phasor resolving into its length/,
  /phase lags|phasor resolving into its angle/,
  /jackknife errors|eight time blocks/,
  /fit d tau q tau h|converging on weighted amplitude-phase/,
  /compare aic|penalized axis/,
  /5000 error realizations|five thousand amplitude-phase points/,
  /refit every realization|repeated bounded parameter fits/,
  /filter aberrant refits|interquartile fence/,
  /posterior mean plus one sigma|posterior-mean markers/,
  /one frequency fixes one lag|locked lag clock/,
  /check against site ranges|lithology and storage range bars/,
  /bootstrap constituents|constituent tiles reappearing/,
  /refit both models|paired lagging and classical fit tracks/,
  /diffusivity densities|paired smooth density curves/,
  /solve numerical response|uniform spatial nodes/,
  /validate closed forms|numerical markers lying on analytical/,
  /two clocks reconcile one groundwater wave|tuolumne and meghna boundary-to-well/,
];

function unpackContext(context) {
  const text = normalizeText(context);
  const sceneValue = context && typeof context === "object"
    ? context.scene ?? context.sceneNumber ?? context.sceneIndex ?? context.index
    : null;
  const parsedScene = Number(sceneValue);
  const scene = Number.isInteger(parsedScene) && parsedScene >= 1 && parsedScene <= 35
    ? parsedScene
    : SCENE_HINTS.findIndex((pattern) => pattern.test(text)) + 1 || null;
  return {
    text,
    scene,
    phase: phaseOf(context && typeof context === "object" ? context.phase : 0),
    colors: paletteOf(context && typeof context === "object" ? context.palette : null),
  };
}

const headWave = (x0, x1, y0, amplitude, cycles, shift = 0, count = 18) => Array.from({ length: count }, (_, index) => {
  const x = x0 + (x1 - x0) * index / (count - 1);
  return [x, y0 + amplitude * Math.sin((index / (count - 1)) * cycles * Math.PI * 2 + shift)];
});
const decayCurve = (x0 = -2.65, x1 = 2.65, y0 = -1.05, height = 2.15, rate = 0.42, count = 12) => Array.from({ length: count }, (_, index) => {
  const u = index / (count - 1);
  return [x0 + (x1 - x0) * u, y0 + height * Math.exp(-rate * u * 5)];
});
const clock = (center, symbol, color, pale, phase) => {
  const [x, y] = center;
  const items = [circle(0.42, p(x, y), color, pale, 0.18, 3), math(symbol, p(x, y - 0.68), color, 21)];
  if (phase >= 1) items.push(line(p(x, y), p(x, y + 0.28), color, 3), line(p(x, y), p(x + 0.2, y - 0.1), color, 3));
  if (phase === 2) items.push(arc(0.52, p(x, y), color, -0.5, 2.1, 3));
  return items;
};
const phasor = (center, length, angle, color, pale, phase, symbol) => {
  const [x, y] = center;
  const end = p(x + length * Math.cos(angle), y + length * Math.sin(angle));
  const items = [circle(0.86, p(x, y), pale, pale, 0.03, 2), line(p(x - 0.95, y), p(x + 0.95, y), pale, 2), line(p(x, y - 0.95), p(x, y + 0.95), pale, 2)];
  if (phase >= 1) items.push(arrow(p(x, y), end, color, 4), dot(end, color, 0.09));
  if (phase === 2) items.push(arc(0.42, p(x, y), color, 0, angle, 3), math(symbol, p(x + 0.1, y + 1.2), color, 22));
  return items;
};

function scene01(phase, [accent, measured, pale]) {
  const wells = [-1.4, 0.15, 1.7];
  const items = [rect(6.1, 1.55, p(0, -0.55), measured, pale, 0.46), rect(0.52, 2.9, p(-2.75, 0.05), accent, pale, 0.24), label("boundary", p(-2.75, 1.65), accent)];
  const count = phase + 1;
  for (let index = 0; index < count; index += 1) {
    const x = index === 0 ? -2.75 : wells[index - 1];
    const amplitude = 0.72 - index * 0.16;
    const shift = index * 0.62;
    items.push(...trace(headWave(x - 0.48, x + 0.48, 0.3, amplitude, 1, shift), index === 0 ? accent : measured, index === count - 1 ? 5 : 3));
    if (index > 0) items.push(line(p(x, -1.25), p(x, 1.28), measured, 3), circle(0.1, p(x, 0.3), accent, pale, 0.35));
  }
  if (phase === 2) items.push(arrow(p(-1.42, 1.45), p(0.02, 1.45), accent, 3), label("smaller", p(-0.7, 1.68), accent), arrow(p(0.3, -1.55), p(1.6, -1.55), measured, 3), label("later", p(0.95, -1.78), measured));
  return field(items);
}

function scene02(phase, [accent, measured, pale]) {
  const wave = headWave(-3.0, -0.45, 0.45, 0.58, 2, 0.35);
  const items = [...trace(wave, accent, 5), line(p(-3.0, -0.45), p(-0.45, -0.45), measured, 2), arrow(p(-0.15, 0), p(0.45, 0), accent, 4)];
  const gauges = [[1.35, 0.8, String.raw`D_A`], [1.35, -0.8, String.raw`D_\phi`]];
  gauges.slice(0, phase + 1).forEach(([x, y, symbol], index) => {
    items.push(circle(0.62, p(x, y), index === 0 ? measured : accent, pale, 0.2, 4), arc(0.46, p(x, y), index === 0 ? measured : accent, -2.5, 2.1 + 0.6 * index, 4), math(symbol, p(x + 1.0, y), index === 0 ? measured : accent, 24));
  });
  if (phase >= 1) items.push(line(p(0.45, 0), p(0.75, 0.8), measured, 3), line(p(0.45, 0), p(0.75, -0.8), accent, 3));
  if (phase === 2) items.push(line(p(2.45, 0.8), p(2.45, -0.8), pale, 4), math(String.raw`D_A\ne D_\phi`, p(2.65, 0), accent, 25));
  return field(items);
}

function scene03(phase, [accent, measured, pale]) {
  const kernel = decayCurve(-2.85, 0.2, -1.0, 2.25, 0.65);
  const items = [axes(p(-1.35, -0.1), measured, 3.35, 2.65), ...trace(kernel, accent, 5), label("past gradients", p(-1.35, 1.48), measured, 17)];
  if (phase >= 1) items.push(...clock([1.15, 0.72], String.raw`\tau_q`, accent, pale, phase), ...clock([2.35, -0.72], String.raw`\tau_h`, measured, pale, phase));
  if (phase === 2) items.push(arrow(p(-0.2, 0.25), p(0.62, 0.52), accent, 4), arrow(p(-0.05, -0.35), p(1.72, -0.65), measured, 4), label("frequency-dependent response", p(0.9, 1.68), accent, 16));
  return field(items);
}

function scene04(phase, [accent, measured, pale]) {
  const snapshots = [-2.7, -1.9, -1.1, -0.3];
  const items = snapshots.slice(0, 2 + phase).flatMap((x, index) => {
    const opacityColor = index === 0 ? pale : measured;
    return [line(p(x, -0.9), p(x, 0.75 - index * 0.18), opacityColor, 3), arrow(p(x - 0.28, -0.55), p(x + 0.28, 0.4 - index * 0.15), opacityColor, 3)];
  });
  items.push(...trace(decayCurve(-2.9, -0.1, -1.32, 0.55, 0.55), accent, 3));
  if (phase >= 1) items.push(arrow(p(0.15, 0), p(1.05, 0), accent, 5), rect(1.35, 0.75, p(1.72, 0), accent, pale, 0.3), math(String.raw`q(t)`, p(1.72, 0), accent, 26));
  if (phase === 2) items.push(arrow(p(2.42, 0), p(3.0, 0), accent, 5), label("present flux", p(1.75, -0.75), measured));
  return field(items);
}

function scene05(phase, [accent, measured, pale]) {
  const items = [rect(2.0, 0.85, p(-1.65, 0), accent, pale, 0.24), math(String.raw`\tau_q`, p(-1.65, 0), accent, 27), arrow(p(-0.55, 0), p(0.45, 0), measured, 5), rect(2.0, 0.85, p(1.55, 0), measured, pale, 0.24), math(String.raw`\tau_h`, p(1.55, 0), measured, 27)];
  if (phase >= 1) items.push(math(String.raw`q`, p(-1.65, 1.05), accent, 24), math(String.raw`h`, p(1.55, 1.05), measured, 24), line(p(-2.65, -0.72), p(2.55, -0.72), pale, 4), label("mass conservation", p(0, -1.05), measured));
  if (phase === 2) items.push(math(String.raw`\tau_q=\tau_h=0\;\Rightarrow\;\mathrm{classical\ diffusion}`, p(0, 1.62), accent, 22));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const wave = headWave(-3.0, 0.1, 0, 0.78, 2.2, 0.2).map(([x, y], index) => [x, y * Math.exp(-index * 0.07)]);
  const envelope = decayCurve(-3.0, 0.1, 0, 0.88, 0.35);
  const items = [...trace(wave, accent, 5), ...trace(envelope, measured, 2, true), ...trace(envelope.map(([x, y]) => [x, -y]), measured, 2, true), arrow(p(0.35, 0), p(0.95, 0), accent, 4)];
  if (phase >= 1) items.push(math(String.raw`\kappa=-\alpha+i\beta`, p(1.95, 1.35), accent, 28), arrow(p(1.55, 1.0), p(1.25, 0.42), measured, 3), arrow(p(2.35, 1.0), p(2.65, 0.42), accent, 3), math(String.raw`\alpha`, p(1.15, 0.08), measured, 30), math(String.raw`\beta`, p(2.75, 0.08), accent, 30));
  if (phase === 2) items.push(math(String.raw`A_h=e^{-\alpha x_D}`, p(1.05, -0.85), measured, 22), math(String.raw`\phi=\beta x_D`, p(2.7, -0.85), accent, 22), math(String.raw`\Re(\kappa)<0`, p(1.95, -1.48), measured, 20));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const cells = [];
  for (let row = 0; row < 5; row += 1) for (let column = 0; column < 8; column += 1) {
    const value = column - row;
    cells.push(rect(0.58, 0.5, p(-2.15 + column * 0.6, 1.0 - row * 0.52), measured, value > 2 ? accent : value < -1 ? measured : pale, 0.22 + 0.06 * Math.abs(value), 1));
  }
  const items = cells.slice(0, phase === 0 ? 16 : phase === 1 ? 28 : cells.length);
  if (phase >= 1) items.push(line(p(-2.8, -0.05), p(2.7, -0.05), "#FFFFFF", 5), math(String.raw`R=1`, p(2.95, -0.05), measured, 22));
  if (phase === 2) items.push(math(String.raw`R=\frac{D_{\phi}}{D_A}=\frac{\alpha^2}{\beta^2}`, p(0, 1.72), accent, 25), label("phase", p(2.45, 1.32), accent), label("amplitude", p(-2.25, -1.48), measured));
  return field(items);
}

function scene08(phase, [accent, measured, pale]) {
  const path = [p(-2.5, -1.05), p(-2.5, 0.2), p(-0.9, 0.2), p(-0.9, 1.1), p(0.75, 1.1), p(0.75, -0.35), p(2.45, -0.35)];
  const segmentCount = [2, 4, 6][phase];
  const items = [axes(p(0, 0), measured, 5.4, 2.8), ...path.slice(0, segmentCount).map((start, index) => arrow(start, path[index + 1], index % 2 ? measured : accent, 4))];
  if (phase >= 1) items.push(...path.slice(0, segmentCount + 1).map((point, index) => dot(point, index === segmentCount ? accent : pale, 0.09)));
  if (phase === 2) items.push(label("one factor per step", p(0, -1.55), measured), math(String.raw`\tau_h/\tau_q`, p(2.75, -0.72), accent, 21), math(String.raw`\omega\tau_q`, p(-2.75, 1.42), measured, 21));
  return field(items);
}

function scene09(phase, [accent, measured, pale]) {
  const values = [-0.9, 0.55, -0.35, 1.05, -0.7, 0.82];
  const items = [line(p(-2.75, 0), p(0.1, 0), measured, 2), ...values.slice(0, 2 + phase * 2).map((value, index) => line(p(-2.5 + index * 0.5, 0), p(-2.5 + index * 0.5, value), value < 0 ? measured : accent, 4))];
  if (phase >= 1) items.push(arrow(p(0.35, 0), p(1.0, 0), accent, 4), rect(0.75, 1.5, p(1.55, -0.15), accent, pale, 0.38));
  if (phase === 2) items.push(math(String.raw`\mu^*`, p(1.55, 0.85), accent, 25), ...values.map((value, index) => dot(p(-2.5 + index * 0.5, Math.abs(value)), pale, 0.055)), label("absolute effects", p(-1.15, 1.5), measured));
  return field(items);
}

function scene10(phase, [accent, measured, pale]) {
  const mean = p(0, 0);
  const marks = [p(-2.25, -0.35), p(-1.45, 0.45), p(-0.6, -0.15), p(0.55, 0.72), p(1.45, -0.55), p(2.25, 0.2)];
  const items = [line(p(-2.7, 0), p(2.7, 0), measured, 2), dot(mean, accent, 0.12), math(String.raw`\bar{EE}`, p(0, -0.5), accent, 20), ...marks.slice(0, 2 + phase * 2).map((point) => dot(point, measured, 0.09))];
  if (phase >= 1) items.push(...marks.slice(0, 2 + phase * 2).map((point) => line(p(point[0], 0), point, pale, 2)));
  if (phase === 2) items.push(arrow(p(-2.25, 1.15), p(2.25, 1.15), accent, 3), math(String.raw`\sigma`, p(0, 1.48), accent, 26), label("interaction / nonlinearity", p(0, -1.25), measured));
  return field(items);
}

function scene11(phase, [accent, measured, pale]) {
  const items = [line(p(-2.3, -1.0), p(-2.3, 0.9), measured, 6), math(String.raw`\mu^*`, p(-2.3, 1.35), measured, 24)];
  if (phase >= 1) items.push(line(p(-1.55, -1.0), p(-1.55, 0.35), accent, 6), math(String.raw`\sigma`, p(-1.55, 1.35), accent, 24), arrow(p(-1.0, 0), p(-0.25, 0), accent, 4), circle(1.0, p(1.15, 0), measured, pale, 0.12, 3));
  if (phase === 2) items.push(arrow(p(1.15, 0), p(1.9, 0.62), accent, 5), arc(0.55, p(1.15, 0), measured, 0, 0.72, 3), math(String.raw`\delta`, p(2.25, 0.85), accent, 28), label("factor ranking", p(1.15, -1.35), measured));
  return field(items);
}

function scene12(phase, [accent, measured, pale]) {
  const raw = [-2.75, -2.05, -1.15, -0.6, 0.3, 1.2, 1.85, 2.65];
  const grid = [-2.7, -1.95, -1.2, -0.45, 0.3, 1.05, 1.8, 2.55];
  const items = [line(p(-3.0, -0.65), p(3.0, -0.65), measured, 3), ...raw.map((x, index) => dot(p(x, 0.65 + 0.2 * Math.sin(index)), index < 4 ? accent : measured, 0.08))];
  if (phase >= 1) items.push(...raw.map((x, index) => arrow(p(x, 0.5 + 0.2 * Math.sin(index)), p(grid[index], -0.5), pale, 2)), ...grid.map((x) => line(p(x, -0.82), p(x, -0.48), measured, 2)));
  if (phase === 2) items.push(...grid.map((x) => dot(p(x, -0.65), accent, 0.065)), math(String.raw`15\text{--}20\;\mathrm{min}`, p(0, -1.3), accent, 23));
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const raw = headWave(-2.9, 2.9, 0.65, 0.45, 2.3, 0.2);
  const centered = raw.map(([x, y]) => [x, y - 0.65]);
  const items = [axes(p(0, 0), measured, 5.7, 2.8), ...trace(raw, measured, 4), dashed(p(-2.9, 0.65), p(2.9, 0.65), pale, 2)];
  if (phase >= 1) items.push(arrow(p(2.45, 0.75), p(2.45, 0.15), accent, 4), ...trace(centered, accent, 4));
  if (phase === 2) items.push(line(p(-2.9, 0), p(2.9, 0), accent, 3), math(String.raw`\bar h=0`, p(2.45, -0.55), accent, 22));
  return field(items);
}

function scene14(phase, [accent, measured, pale]) {
  const drifted = headWave(-2.9, 2.9, 0, 0.28, 2.5).map(([x, y], index) => [x, y - 0.65 + index * 0.08]);
  const residual = headWave(-2.9, 2.9, 0, 0.28, 2.5);
  const items = [axes(p(0, 0), measured, 5.7, 2.8), ...trace(drifted, measured, 4), dashed(p(-2.9, -0.65), p(2.9, 0.71), pale, 3)];
  if (phase >= 1) items.push(arrow(p(0, 1.25), p(0, 0.55), accent, 4), ...trace(residual, accent, 4));
  if (phase === 2) items.push(line(p(-2.9, 0), p(2.9, 0), accent, 2), label("oscillation retained", p(0, -1.45), measured));
  return field(items);
}

function scene15(phase, [accent, measured, pale]) {
  const stage = headWave(-3.0, -0.35, 0.75, 0.35, 2.2);
  const well = headWave(-3.0, -0.35, -0.75, 0.22, 2.2, 0.6);
  const items = [...trace(stage, accent, 4), ...trace(well, measured, 4), arrow(p(0.05, 0), p(0.75, 0), accent, 4)];
  const peaks = [[1.1, -0.85], [1.55, 0.45], [2.0, -0.35], [2.45, 0.95], [2.9, -0.65]];
  if (phase >= 1) items.push(line(p(0.95, -1.05), p(3.05, -1.05), measured, 2), ...peaks.map(([x, y], index) => line(p(x, -1.05), p(x, y), index === 3 ? accent : measured, index === 3 ? 5 : 3)));
  if (phase === 2) items.push(math(String.raw`S_{00}`, p(1.45, 1.45), accent, 22), math(String.raw`S_{x0}`, p(2.65, 1.45), measured, 22));
  return field(items);
}

function scene16(phase, [accent, measured, pale]) {
  const jagged = [[-2.8,-0.9],[-2.25,0.15],[-1.7,-0.5],[-1.15,1.05],[-0.6,0.35],[-0.05,0.75],[0.5,-0.3],[1.05,0.55],[1.6,-0.45],[2.15,0.2],[2.7,-0.75]];
  const smooth = jagged.map(([x], index, values) => [x, values.slice(Math.max(0,index-1), Math.min(values.length,index+2)).reduce((sum,item)=>sum+item[1],0) / (index === 0 || index === values.length-1 ? 2 : 3)]);
  const items = [axes(p(0, 0), measured, 5.6, 2.8), ...trace(jagged, measured, 3), ...jagged.map((point) => dot(p(...point), measured, 0.055))];
  if (phase >= 1) items.push(rect(1.5, 2.4, p(-0.6 + phase * 0.6, 0), accent, pale, 0.12), ...trace(smooth, accent, 5));
  if (phase === 2) items.push(math(String.raw`3\text{-bin Daniell}`, p(0, 1.55), accent, 22));
  return field(items);
}

function scene17(phase, [accent, measured, pale]) {
  const items = [rect(1.5, 1.15, p(-2.0, 0.65), accent, pale, 0.3), math(String.raw`S_{x0}`, p(-2.0, 0.65), accent, 25), rect(1.5, 1.15, p(-2.0, -0.85), measured, pale, 0.3), math(String.raw`S_{00}`, p(-2.0, -0.85), measured, 25)];
  if (phase >= 1) items.push(arrow(p(-0.95, 0), p(-0.2, 0), accent, 4), math(String.raw`\widehat H_x=\frac{S_{x0}}{S_{00}}`, p(0.95, 0.9), accent, 25), ...phasor([1.35, -0.65], 0.72, 0.62, accent, pale, phase, String.raw`\widehat H_x`));
  if (phase === 2) items.push(label("complex transfer", p(1.35, -1.75), measured));
  return field(items);
}

function scene18(phase, [accent, measured, pale]) {
  const peaks = [[-2.55,-0.75],[-1.85,0.35],[-1.15,-0.45],[-0.45,1.1],[0.25,0.25],[0.95,0.85],[1.65,-0.1],[2.35,0.55]];
  const items = [line(p(-2.85, -1.0), p(2.85, -1.0), measured, 2), ...peaks.map(([x,y], index) => line(p(x,-1.0),p(x,y), index % 3 === 0 ? accent : measured, 3))];
  if (phase >= 1) items.push(rect(4.2, 2.55, p(0, 0.05), accent, pale, 0.08), math(String.raw`2\text{--}48\;\mathrm{h}`, p(0, 1.55), accent, 22));
  if (phase === 2) items.push(line(p(-2.8, 0.38), p(2.8, 0.38), accent, 3), math(String.raw`\gamma^2\ge0.8`, p(2.1, 0.78), accent, 22), ...[3,5,7].map((index)=>circle(0.16,p(...peaks[index]),accent,pale,0.08,3)));
  return field(items);
}

function scene19(phase, [accent, measured, pale]) {
  const items = phasor([-0.8, 0], 1.35, 0.65, accent, pale, Math.min(2, phase + 1), String.raw`\widehat H_x`);
  if (phase >= 1) items.push(dashed(p(-0.8, 0), p(0.277, 0.818), measured, 3), arrow(p(-0.8, -1.25), p(0.277, -1.25), accent, 4));
  if (phase === 2) items.push(math(String.raw`A_{\mathrm{obs}}=|\widehat H_x|`, p(1.6, 0.8), accent, 25), label("amplitude ratio", p(1.6, 0.2), measured));
  return field(items);
}

function scene20(phase, [accent, measured, pale]) {
  const items = phasor([-0.8, 0], 1.35, 0.82, measured, pale, Math.min(2, phase + 1), String.raw`\widehat H_x`);
  if (phase >= 1) items.push(arc(1.05, p(-0.8, 0), accent, 0, 0.82, 5), arrow(p(0.15, 0.35), p(0.45, 0.62), accent, 3));
  if (phase === 2) items.push(math(String.raw`\phi_{\mathrm{obs}}=\arg(\widehat H_x)`, p(1.6, 0.8), accent, 25), label("phase lag", p(1.6, 0.2), measured));
  return field(items);
}

function scene21(phase, [accent, measured, pale]) {
  const items = [];
  for (let index = 0; index < 8; index += 1) items.push(rect(0.62, 1.15, p(-2.55 + index * 0.73, 0.45), index === phase ? accent : measured, index === phase ? pale : "#E8EEF0", index === phase ? 0.55 : 0.34));
  if (phase >= 1) items.push(arrow(p(0, -0.35), p(0, -0.85), accent, 4), ...[p(-1.2,-1.25),p(-0.4,-1.0),p(0.4,-1.35),p(1.2,-1.1)].map((point)=>dot(point,measured,0.09)));
  if (phase === 2) items.push(line(p(-1.5,-1.15),p(1.5,-1.15),accent,3), math(String.raw`8\ \mathrm{blocks}`, p(0, 1.55), accent, 22), label("amplitude and phase errors", p(0, -1.7), measured));
  return field(items);
}

function scene22(phase, [accent, measured, pale]) {
  const amplitude = decayCurve(-2.75, 2.55, -0.95, 2.0, 0.44);
  const phaseLine = [[-2.75,-0.65],[-1.7,-0.3],[-0.65,0.05],[0.4,0.4],[1.45,0.75],[2.5,1.1]];
  const items = [axes(p(0, 0), measured, 5.5, 2.8), ...amplitude.filter((_,i)=>i%2===0).map(([x,y])=>dot(p(x,y),measured,0.08)), ...phaseLine.map(([x,y])=>dot(p(x,y),accent,0.075))];
  if (phase >= 1) items.push(...trace(amplitude, measured, 4), ...trace(phaseLine, accent, 4), arrow(p(-0.4,1.5),p(-0.4,1.05),accent,3));
  if (phase === 2) items.push(math(String.raw`D,\ \tau_q,\ \tau_h`, p(0.9, 1.52), accent, 25), label("weighted joint fit", p(0.9, -1.45), measured));
  return field(items);
}

function scene23(phase, [accent, measured, pale]) {
  const values = [[-1.55,1.05,"classical",measured],[0.85,-0.25,"lagging",accent]];
  const items = [line(p(-2.75,0),p(2.75,0),measured,3), math(String.raw`\mathrm{AIC}`,p(2.8,-0.45),measured,21)];
  values.slice(0,phase+1).forEach(([x,y,name,color])=>items.push(line(p(x,0),p(x,y),color,5),dot(p(x,y),color,0.11),label(name,p(x,y+0.38),color)));
  if (phase>=1) items.push(arrow(p(-1.3,0.65),p(0.55,0.05),accent,4));
  if (phase===2) items.push(label("lower after parameter penalty",p(0,-1.2),measured));
  return field(items);
}

function scene24(phase, [accent, measured, pale]) {
  const centers = [p(-1.65,0.35),p(0,-0.25),p(1.65,0.55)];
  const items = [axes(p(0,0),measured,5.5,2.8)];
  const count = [12,28,54][phase];
  for(let index=0;index<count;index+=1){const center=centers[index%3];const angle=index*2.37;const radius=0.06+0.42*((index*17)%23)/23;items.push(dot(p(center[0]+radius*Math.cos(angle),center[1]+0.65*radius*Math.sin(angle)),index%3===0?accent:measured,0.035));}
  if(phase>=1) items.push(...centers.map((center)=>circle(0.48,center,accent,pale,0.05,2)));
  if(phase===2) items.push(math(String.raw`5000`,p(0,1.55),accent,30),label("Gaussian amplitude-phase realizations",p(0,-1.45),measured,16));
  return field(items);
}

function scene25(phase, [accent, measured, pale]) {
  const starts=[p(-2.6,1.0),p(-2.6,0.35),p(-2.6,-0.3),p(-2.6,-0.95)];
  const target=p(1.65,0);
  const items=starts.slice(0,2+phase).flatMap((start,index)=>[dot(start,measured,0.08),arrow(start,p(target[0]-0.3,target[1]+0.18*(index-1.5)),index===phase?accent:measured,3)]);
  if(phase>=1)items.push(rect(1.4,1.55,target,accent,pale,0.25),math(String.raw`D,\tau_q,\tau_h`,target,accent,21));
  if(phase===2)items.push(circle(0.92,target,accent,pale,0.05,3),label("5000 candidate refits",p(0,-1.5),measured));
  return field(items);
}

function scene26(phase, [accent, measured, pale]) {
  const xs=[-2.7,-2.25,-1.75,-1.2,-0.7,-0.2,0.25,0.75,1.25,1.75,2.25,2.75];
  const ys=[1.2,-0.8,0.35,-0.2,0.5,0.1,-0.35,0.42,-0.12,0.25,0.75,-1.1];
  const items=[...xs.map((x,index)=>dot(p(x,ys[index]),index===0||index===11?measured:accent,0.075))];
  if(phase>=1)items.push(dashed(p(-2.05,-1.35),p(-2.05,1.35),measured,3),dashed(p(2.05,-1.35),p(2.05,1.35),measured,3));
  if(phase===2)items.push(rect(4.05,2.55,p(0,0),accent,pale,0.08),line(p(-2.7,1.2),p(-2.45,1.45),measured,3),line(p(2.75,-1.1),p(3.0,-1.35),measured,3),label("interquartile retained cloud",p(0,1.62),accent));
  return field(items);
}

function scene27(phase, [accent, measured, pale]) {
  const centers=[-1.85,0,1.85];
  const items=[];
  centers.slice(0,phase+1).forEach((x,index)=>{const curve=[[-0.7,-1.0],[-0.45,-0.55],[-0.2,0.45],[0,1.05],[0.2,0.45],[0.45,-0.55],[0.7,-1.0]].map(([dx,y])=>[x+dx,y]);items.push(...trace(curve,index===2?accent:measured,4),line(p(x-0.38,-1.15),p(x+0.38,-1.15),accent,4),dot(p(x,1.05),accent,0.09));});
  if(phase>=1)items.push(...centers.slice(0,phase+1).map((x)=>line(p(x,-1.25),p(x,1.1),pale,2)));
  if(phase===2)items.push(math(String.raw`\bar\theta\pm1\sigma`,p(0,1.55),accent,25),math(String.raw`D\quad\tau_q\quad\tau_h`,p(0,-1.65),measured,22));
  return field(items);
}

function scene28(phase, [accent, measured, pale]) {
  const items=[...phasor([-2.0,0],0.95,0.72,accent,pale,Math.min(2,phase+1),String.raw`A,\phi`)];
  if(phase>=1)items.push(...clock([0.15,0.65],String.raw`\tau_q`,measured,pale,2),line(p(-0.35,0.2),p(0.65,1.1),measured,4),label("fixed",p(0.15,1.48),measured),arrow(p(0.8,0),p(1.35,0),accent,4));
  if(phase===2)items.push(rect(1.55,1.25,p(2.05,0),accent,pale,0.3),math(String.raw`D,\ \tau_h`,p(2.05,0),accent,24),label("one frequency",p(-2.0,-1.45),measured));
  return field(items);
}

function scene29(phase, [accent, measured, pale]) {
  const items=[label("Tuolumne gravel",p(-1.65,1.35),measured),line(p(-2.8,0.75),p(-0.5,0.75),measured,10),label("Meghna deltaic sand",p(1.45,-0.2),measured),line(p(0.3,-0.8),p(2.7,-0.8),measured,10)];
  if(phase>=1)items.push(dot(p(-1.35,0.75),accent,0.14),line(p(-1.35,0.75),p(-1.35,1.1),accent,3),math(String.raw`K`,p(-1.35,0.25),accent,22));
  if(phase===2)items.push(dot(p(1.65,-0.8),accent,0.14),line(p(1.65,-0.8),p(1.65,-0.45),accent,3),math(String.raw`S`,p(1.65,-1.3),accent,22),label("within independent site ranges",p(0,1.75),accent));
  return field(items);
}

function scene30(phase, [accent, measured, pale]) {
  const source=["M2","S2","N2","K1","O1"];
  const items=source.map((name,index)=>[rect(0.72,0.58,p(-2.45+index*1.05,0.95),measured,pale,0.32),label(name,p(-2.45+index*1.05,0.95),measured,15)]).flat();
  if(phase>=1){const picks=phase===1?[0,2,2,4,1]:[3,0,3,1,4];picks.forEach((pick,index)=>items.push(arrow(p(-2.45+pick*1.05,0.62),p(-2.45+index*1.05,-0.55),pick===3?accent:measured,2),rect(0.72,0.58,p(-2.45+index*1.05,-0.9),pick===3?accent:measured,pale,0.32),label(source[pick],p(-2.45+index*1.05,-0.9),pick===3?accent:measured,15)));}
  if(phase===2)items.push(label("sample constituents with replacement",p(0,-1.55),accent,17));
  return field(items);
}

function scene31(phase, [accent, measured, pale]) {
  const rows=[0.95,0.25,-0.45,-1.15];
  const items=rows.slice(0,2+phase).flatMap((y,index)=>[rect(1.3,0.46,p(-1.65,y),accent,pale,0.24),label("lagging",p(-1.65,y),accent,15),rect(1.3,0.46,p(0.25,y),measured,pale,0.24),label("classical",p(0.25,y),measured,15),arrow(p(1.0,y),p(1.8,y),index===phase?accent:measured,3),math(String.raw`D`,p(2.15,y),index===phase?accent:measured,20)]);
  if(phase===2)items.push(label("identical fitting settings",p(0,1.55),measured));
  return field(items);
}

function scene32(phase, [accent, measured, pale]) {
  const ticks=[-2.35,-2.0,-1.82,-1.45,-1.2,-0.95,-0.52,-0.3,0.1,0.35,0.8,1.15,1.55,1.95,2.35];
  const lagging=[[-2.65,-1.0],[-2.2,-0.88],[-1.75,-0.3],[-1.3,0.62],[-0.85,1.05],[-0.35,0.55],[0.2,-0.25],[0.8,-0.82],[1.6,-0.98],[2.6,-1.0]];
  const classical=[[-2.65,-1.0],[-1.9,-0.9],[-1.35,-0.55],[-0.65,0.1],[0.1,0.78],[0.75,0.95],[1.35,0.35],[1.95,-0.5],[2.6,-0.95]];
  const items=[line(p(-2.75,-1.05),p(2.75,-1.05),measured,2),...ticks.slice(0,5+phase*5).map((x)=>line(p(x,-1.15),p(x,-0.9),pale,2))];
  if(phase>=1)items.push(...trace(lagging,accent,5));
  if(phase===2)items.push(...trace(classical,measured,4),math(String.raw`D`,p(2.9,-1.35),measured,22),label("lagging",p(-1.55,1.35),accent),label("classical",p(1.45,1.35),measured));
  return field(items);
}

function scene33(phase, [accent, measured, pale]) {
  const nodes=Array.from({length:11},(_,index)=>p(-2.75+index*0.55,-0.95));
  const response=nodes.map((node,index)=>p(node[0],-0.1+0.95*Math.exp(-index*0.18)*Math.sin(index*0.9)));
  const items=[line(nodes[0],nodes.at(-1),measured,3),...nodes.map((node)=>dot(node,measured,0.065))];
  if(phase>=1)items.push(...nodes.slice(0,6+phase*2).map((node,index)=>line(node,response[index],pale,2)),...trace(response.slice(0,6+phase*2).map(([x,y])=>[x,y]),accent,4));
  if(phase===2)items.push(label("second-order tridiagonal grid",p(0,1.55),measured,17),arrow(p(2.15,-0.15),p(2.7,-0.15),accent,3),label("radiation boundary",p(2.0,-1.55),accent,15));
  return field(items);
}

function scene34(phase, [accent, measured, pale]) {
  const amplitude=decayCurve(-2.7,2.6,-1.05,2.15,0.45);
  const phaseLine=[[-2.7,-0.9],[-1.65,-0.52],[-0.6,-0.14],[0.45,0.24],[1.5,0.62],[2.55,1.0]];
  const items=[axes(p(0,0),measured,5.5,2.8),...trace(amplitude,accent,4)];
  if(phase>=1)items.push(...amplitude.filter((_,i)=>i%2===0).map(([x,y])=>dot(p(x,y),measured,0.06)),...trace(phaseLine,measured,4),...phaseLine.map(([x,y])=>dot(p(x,y),accent,0.06)));
  if(phase===2)items.push(math(String.raw`\mathrm{RMSE}_{h,A}\le3\times10^{-5}`,p(-1.15,1.5),accent,18),math(String.raw`\mathrm{RMSE}_{\phi}\le1.3\times10^{-4}`,p(1.65,1.5),measured,18));
  return field(items);
}

function scene35(phase, [accent, measured, pale]) {
  const items=[rect(2.65,1.15,p(-1.8,0.45),measured,pale,0.38),label("Tuolumne",p(-1.8,0.45),measured),rect(2.65,1.15,p(1.45,0.45),accent,pale,0.3),label("Meghna",p(1.45,0.45),accent)];
  if(phase>=1){items.push(...trace(decayCurve(-2.9,-0.7,-1.25,0.85,0.45),measured,4),...trace(decayCurve(0.3,2.55,-1.25,0.85,0.62),accent,4),...clock([-0.45,0.55],String.raw`\tau_q`,accent,pale,phase),...clock([2.75,0.55],String.raw`\tau_h`,measured,pale,phase));}
  if(phase===2)items.push(math(String.raw`D,\ \tau_q,\ \tau_h`,p(0,-1.62),accent,24),label("joint amplitude + phase",p(0,1.65),measured,17));
  return field(items);
}

const SCENES = [
  scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08, scene09,
  scene10, scene11, scene12, scene13, scene14, scene15, scene16, scene17, scene18,
  scene19, scene20, scene21, scene22, scene23, scene24, scene25, scene26, scene27,
  scene28, scene29, scene30, scene31, scene32, scene33, scene34, scene35,
];

export function renderPaperVisual2026_01_3(context) {
  const unpacked = unpackContext(context);
  if (!unpacked.text.includes(PAPER_MARKER)) return null;
  const renderer = unpacked.scene ? SCENES[unpacked.scene - 1] : null;
  return renderer ? renderer(unpacked.phase, unpacked.colors) : null;
}
