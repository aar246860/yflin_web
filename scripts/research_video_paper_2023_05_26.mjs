const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const p3 = (point) => point.length === 3 ? point : [...point, 0];
const line = (a, b, color, width = 3) => `Line(${q(p3(a))}, ${q(p3(b))}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${q(p3(a))}, ${q(p3(b))}, color=${q(color)}, stroke_width=${width}, buff=0.05)`;
const dot = (point, color, radius = 0.08) => `Dot(${q(p3(point))}, radius=${radius}, color=${q(color)})`;
const ring = (radius, point, color, width = 3) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=0).shift(${q(p3(point))})`;
const rect = (width, height, point, stroke, fill, opacity = 0.28, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(p3(point))})`;
const poly = (points, stroke, fill, opacity = 0.35) => `Polygon(${points.map((point) => q(p3(point))).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (value, point, color, size = 24) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(p3(point))})`;
const label = (value, point, color, size = 19) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(p3(point))})`;
const axes = (point, color, width = 5.8, height = 2.6, xRange = "[0, 8, 2]", yRange = "[-1, 1, 0.5]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${q(p3(point))})`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((point, index) => line(point, points[index + 1], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const wave = (base, amplitude, frequency, count = 10, x0 = -2.8, dx = 0.62, shift = 0) => Array.from(
  { length: count },
  (_, index) => [x0 + index * dx, base + amplitude * Math.sin(index * frequency + shift)],
);

function grid({ x, y, rows, columns, cellWidth, cellHeight, stroke, fills, phase = 0, opacity = 0.5 }) {
  return Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    return rect(
      cellWidth,
      cellHeight,
      [x + column * (cellWidth + 0.035), y - row * (cellHeight + 0.035)],
      stroke,
      fills[(row + column + phase) % fills.length],
      opacity,
      1.5,
    );
  });
}

function colorsOf(palette) {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [source[0] ?? DEFAULT_PALETTE[0], source[1] ?? DEFAULT_PALETTE[1], source[2] ?? DEFAULT_PALETTE[2]].map(String);
}

function phaseOf(phase) {
  const value = Number(phase);
  return Math.max(0, Math.min(2, Number.isFinite(value) ? Math.trunc(value) : 0));
}

function textOf(description) {
  const values = typeof description === "object" && description !== null ? Object.values(description) : [description];
  return values.filter((value) => typeof value === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

const wellPoints = [[-1.95, 0.85], [-1.75, -0.78], [0.05, 0.15], [1.65, -0.42]];
const observationPoints = [[-2.55, 1.1], [-2.15, 0.2], [-2.48, -0.82], [-1.25, 1.22], [-0.82, 0.52], [-1.05, -1.02], [-0.12, 1.05], [0.55, 0.82], [0.9, -0.92], [1.55, 0.62], [2.18, 0.05], [2.48, -0.85]];

function aquiferBase([accent, measured, pale], phase, revealWells = true) {
  const items = [rect(5.75, 3.0, [0, 0], measured, pale, 0.22), ...observationPoints.slice(0, 6 + phase * 3).map((point) => dot(point, measured, 0.055))];
  if (revealWells && phase > 0) wellPoints.forEach((point, index) => items.push(ring(0.18 + phase * 0.12, point, accent, 4), phase === 1 ? dot(point, accent, 0.08) : ring(0.52 + index * 0.035, point, measured, 2)));
  return items;
}

function scene01(phase, colors) {
  const [accent, measured] = colors;
  const items = aquiferBase(colors, phase, true);
  if (phase === 2) items.push(...wellPoints.map((point) => ring(0.72, point, accent, 2)), ...wellPoints.map((point) => arrow([point[0], point[1] + 0.72], [point[0], point[1] + 0.28], measured, 2)));
  return field(items);
}

function scene02(phase, [accent, measured, pale]) {
  const rows = Array.from({ length: 5 }, (_, index) => -0.72 + index * 0.36);
  const items = [rect(2.35, 2.75, [-1.75, 0], measured, pale, 0.24), line([-2.85, 0.92], [-0.65, 0.92], measured, 3), line([-2.05, 1.27], [-2.05, -1.3], measured, 2), ...rows.map((y) => line([-2.75, y], [-0.75, y], measured, 2))];
  const sensors = [[0.35, 1.0], [0.85, 0.25], [1.35, -0.55], [2.05, 0.72], [2.5, -0.2]];
  items.push(...sensors.map((point) => dot(point, accent, 0.09)), ...plot(wave(-1.15, 0.18, 1.7, 7, 0.25, 0.4), measured, 3));
  if (phase > 0) items.push(...rows.slice(0, phase + 1).map((y) => rect(0.65, 0.22, [-1.35, y + 0.18], pale, pale, 0.9, 1)), ...sensors.map((point) => ring(0.17, point, measured, 2)));
  if (phase === 2) items.push(arrow([0.2, -0.45], [-0.62, -0.45], accent, 4), math(String.raw`?`, [-1.35, -0.36], accent, 30));
  return field(items);
}

function scene03(phase, [accent, measured, pale]) {
  const sources = [[-2.6, 1.15], [-0.9, 1.15], [0.85, 1.15], [2.5, 1.15]];
  const items = [axes([0, -0.72], measured, 5.7, 1.65), ...sources.map((point, index) => ring(0.24, point, index % 2 ? measured : accent, 3)), ...["P", "R", "T", "ET"].map((value, index) => math(value, sources[index], index % 2 ? measured : accent, 19))];
  if (phase > 0) items.push(...sources.map((point, index) => arrow([point[0], 0.83], [-1.7 + index * 1.15, 0.05], index % 2 ? measured : accent, 2)));
  if (phase === 2) items.push(...plot(wave(-0.62, 0.42, 1.9), accent, 5), ...plot(wave(-0.62, 0.16, 0.7, 10, -2.8, 0.62, 0.6), measured, 2));
  return field(items);
}

function scene04(phase, [accent, measured, pale]) {
  const items = grid({ x: -2.7, y: 1.18, rows: 7, columns: 9, cellWidth: 0.56, cellHeight: 0.34, stroke: measured, fills: [pale, measured], phase, opacity: 0.3 });
  items.push(line([-2.98, -1.3], [-2.98, 1.4], accent, 5), line([2.35, -1.3], [2.35, 1.4], accent, 5), line([-2.98, 1.4], [2.35, 1.4], measured, 2), line([-2.98, -1.3], [2.35, -1.3], measured, 2));
  if (phase > 0) items.push(...wellPoints.map((point) => dot(point, accent, 0.1)), ...[-2.7, -1.6, -0.5, 0.6, 1.7].map((x) => arrow([x, 1.78], [x, 1.43], measured, 2)));
  if (phase === 2) items.push(math(String.raw`20\,\mathrm{km}\times20\,\mathrm{km}`, [0, -1.68], accent, 20), ...wellPoints.map((point) => ring(0.23, point, accent, 3)));
  return field(items);
}

function scene05(phase, [accent, measured, pale]) {
  const reference = [[-2.65, 1.05], [-2.1, 0.52], [-1.45, 0.1], [-0.65, -0.22], [0.2, -0.48], [1.15, -0.68], [2.25, -0.82]];
  const numerical = reference.map(([x, y], index) => [x, y + (index % 2 ? 0.035 : -0.028)]);
  const items = [axes([0, 0], measured, 5.8, 2.75), ...plot(reference, measured, 4), math(String.raw`\mathrm{Theis+Jacob}`, [1.7, 1.35], measured, 19)];
  if (phase > 0) items.push(...plot(numerical, accent, 3), ...numerical.map((point) => dot(point, accent, 0.07)));
  if (phase === 2) items.push(...reference.map((point, index) => line(point, numerical[index], pale, 2)), ring(0.18, numerical[4], accent, 4));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const irregular = [[-2.7, 0.9], [-2.2, -0.45], [-1.65, 0.25], [-0.85, 1.05], [-0.3, -0.8], [0.45, 0.42], [1.45, -0.35], [2.35, 0.8]];
  const items = [rect(5.7, 2.8, [0, 0], measured, pale, 0.12), ...irregular.map((point) => dot(point, accent, 0.1))];
  if (phase > 0) items.push(...grid({ x: -2.7, y: 1.1, rows: 5, columns: 9, cellWidth: 0.56, cellHeight: 0.48, stroke: measured, fills: [pale], opacity: 0.16 }));
  if (phase === 2) items.push(...grid({ x: -2.7, y: 1.1, rows: 5, columns: 9, cellWidth: 0.56, cellHeight: 0.48, stroke: measured, fills: [pale, measured, accent], phase: 1, opacity: 0.5 }), ...irregular.map((point) => ring(0.15, point, accent, 2)));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const head = [[-2.8, 0.72], [-2.15, 0.6], [-1.5, 0.52], [-0.85, 0.2], [-0.2, 0.35], [0.45, 0.02], [1.1, 0.18], [1.75, -0.16], [2.4, -0.08]];
  const changes = head.slice(1).map(([x, y], index) => [x, -0.88 + (y - head[index][1]) * 1.55]);
  const items = [line([-2.9, 0.05], [2.75, 0.05], pale, 2), ...plot(head, measured, 4), ...head.map((point) => dot(point, measured, 0.055))];
  if (phase > 0) items.push(...head.slice(0, 5).map((point, index) => index < 4 ? arrow(point, head[index + 1], accent, 2) : null), line([-2.8, -0.88], [2.65, -0.88], measured, 2));
  if (phase === 2) items.push(...plot(changes, accent, 4), ...changes.map((point) => line([point[0], -0.88], point, accent, 3)), math(String.raw`\Delta_t h`, [2.5, -1.38], accent, 21));
  return field(items);
}

function scene08(phase, [accent, measured, pale]) {
  const items = grid({ x: -2.85, y: 1.0, rows: 5, columns: 5, cellWidth: 0.43, cellHeight: 0.38, stroke: measured, fills: [pale, measured, accent], phase, opacity: 0.55 });
  if (phase > 0) items.push(arrow([-0.55, 0.05], [0.05, 0.05], accent, 4), ...grid({ x: 0.35, y: 0.95, rows: 3, columns: 3, cellWidth: 0.38, cellHeight: 0.38, stroke: measured, fills: [pale, accent], phase, opacity: 0.55 }), ...plot(wave(-0.45, 0.26, 1.7, 7, 1.55, 0.22), accent, 3));
  if (phase === 2) items.push(math(String.raw`EOF_i`, [0.78, -1.0], measured, 20), math(String.raw`EC_i(t)`, [2.25, -1.0], accent, 20));
  return field(items);
}

function scene09(phase, [accent, measured, pale]) {
  const heights = [0.45, 1.1, 0.72, 1.35, 0.58, 0.92];
  const scaled = heights.map((height) => 0.45 + height * 0.72);
  const active = phase === 0 ? heights : scaled;
  const items = [line([-2.8, -1.15], [2.65, -1.15], measured, 2), ...active.map((height, index) => rect(0.48, height, [-2.35 + index * 0.88, -1.15 + height / 2], index % 2 ? measured : accent, pale, 0.5))];
  if (phase > 0) items.push(...heights.map((height, index) => arrow([-2.35 + index * 0.88, -1.15 + height], [-2.35 + index * 0.88, -1.15 + scaled[index]], accent, 2)));
  if (phase === 2) items.push(label("source-stated rescaling", [0, 1.55], accent, 18));
  return field(items);
}

function scene10(phase, [accent, measured, pale]) {
  const diffuse = [[-2.5, 0.8], [-2.1, 0.15], [-1.65, -0.45], [-1.2, 0.58], [-0.65, -0.75], [0.1, 0.42], [0.65, -0.2], [1.25, 0.72], [1.8, -0.55], [2.4, 0.18]];
  const compact = diffuse.map((_, index) => index < 5 ? [-1.45 + 0.16 * (index % 3), 0.25 + 0.18 * (index % 2)] : [1.4 + 0.16 * (index % 3), -0.25 + 0.18 * (index % 2)]);
  const points = phase === 2 ? compact : diffuse;
  const items = [line([-2.9, 0], [2.8, 0], measured, 2), line([0, -1.3], [0, 1.35], measured, 2), ...points.map((point, index) => dot(point, index < 5 ? accent : measured, 0.09))];
  if (phase > 0) items.push(line([-2.25, -1.0], [-0.35, 1.1], accent, 3), line([-0.55, -1.05], [-2.35, 0.95], measured, 3), math(String.raw`R_{\mathrm{Varimax}}`, [2.05, 1.35], accent, 19));
  if (phase === 2) items.push(ring(0.58, [-1.3, 0.34], accent, 3), ring(0.58, [1.55, -0.16], measured, 3));
  return field(items);
}

function scene11(phase, [accent, measured, pale]) {
  const compact = [[0.15, 0.92], [0.95, 0.82], [1.75, 0.94], [2.45, 0.62], [0.35, -0.42], [1.15, -0.65], [1.9, -0.48], [2.55, -0.72]];
  const items = [ring(1.28, [-1.75, 0], measured, 3), ring(0.82, [-1.75, 0], pale, 4), dot([-1.75, 0], measured, 0.1)];
  if (phase > 0) items.push(...compact.slice(0, phase === 1 ? 4 : 8).flatMap((point) => [ring(0.24, point, accent, 3), dot(point, accent, 0.07)]));
  if (phase === 2) items.push(line([-0.25, 1.35], [2.85, 1.35], accent, 3), math(String.raw`EOF_2\ldots EOF_9`, [1.3, 1.62], accent, 19));
  return field(items);
}

function scene12(phase, [accent, measured, pale]) {
  const ec = wave(1.1, 0.38, 1.45);
  const items = [...plot(ec, measured, 4), ...ec.filter((_, index) => index % 2 === 0).map((point) => dot(point, measured, 0.06))];
  if (phase > 0) {
    const upper = ec.map(([x, y], index) => [x, y + 0.2 + 0.04 * (index % 2)]);
    const lower = ec.map(([x, y], index) => [x, y - 0.2 - 0.04 * (index % 2)]);
    items.push(...plot(upper, accent, 2), ...plot(lower, accent, 2), ...plot(wave(0.15, 0.16, 2.4), accent, 3));
  }
  if (phase === 2) {
    [0.25, -0.38, -0.95].forEach((base, index) => items.push(...plot(wave(base, 0.13 - index * 0.02, 2.2 + index * 0.8), index === 2 ? measured : accent, index === 0 ? 4 : 2)));
    items.push(...plot([[-2.8, -1.42], [-1.4, -1.36], [0, -1.28], [1.4, -1.18], [2.75, -1.05]], measured, 3), math(String.raw`IMF_1+IMF_2+IMF_3+r`, [0, 1.65], accent, 18));
  }
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const imf = wave(0.65, 0.34, 1.7);
  const hilbert = wave(-0.55, 0.34, 1.7, 10, -2.8, 0.62, 1.55);
  const items = [...plot(imf, measured, 4), math(String.raw`s_j(t)`, [2.55, 1.2], measured, 20)];
  if (phase > 0) items.push(...plot(hilbert, accent, 4), math(String.raw`\mathcal H\{s_j\}`, [2.35, -1.05], accent, 19), arrow([0.15, 0.15], [0.15, -0.15], pale, 3));
  if (phase === 2) items.push(ring(0.58, [-2.0, -0.05], accent, 3), arrow([-2.0, -0.05], [-1.55, 0.3], measured, 3), math(String.raw`s_j^c=s_j+i\mathcal H\{s_j\}`, [0.5, 1.62], accent, 20));
  return field(items);
}

function scene14(phase, [accent, measured, pale]) {
  const imf = wave(-0.5, 0.36, 1.8);
  const amplitude = imf.map(([x], index) => [x, 0.55 + 0.12 * Math.sin(index * 0.65) + 0.05 * index]);
  const items = [axes([0, -0.2], measured, 5.8, 2.8), ...plot(imf, measured, 3)];
  if (phase > 0) items.push(...amplitude.map((point, index) => line([point[0], imf[index][1]], point, pale, 2)), ...plot(amplitude, accent, 4));
  if (phase === 2) items.push(...amplitude.map((point) => dot(point, accent, 0.055)), math(String.raw`a_j(t)=|s_j^c(t)|`, [0.8, 1.45], accent, 20));
  return field(items);
}

function scene15(phase, [accent, measured, pale]) {
  const frequency = [[-2.75, -0.72], [-2.15, -0.5], [-1.55, -0.18], [-0.95, -0.44], [-0.35, 0.08], [0.25, 0.45], [0.85, 0.2], [1.45, 0.7], [2.1, 0.52], [2.7, 0.82]];
  const items = [axes([0, -0.15], measured, 5.8, 2.75), ...plot(wave(0.82, 0.25, 1.7), measured, 3)];
  if (phase > 0) items.push(...frequency.slice(0, phase === 1 ? 6 : 10).map((point) => dot(point, accent, 0.07)), ...plot(frequency.slice(0, phase === 1 ? 6 : 10), accent, 3));
  if (phase === 2) items.push(arrow([1.25, 1.25], [1.55, 0.75], accent, 3), math(String.raw`\omega_j(t)`, [2.15, 1.35], accent, 21));
  return field(items);
}

function scene16(phase, [accent, measured, pale]) {
  const amplitude = wave(0.78, 0.2, 0.7);
  const frequency = wave(0.05, 0.24, 1.6, 10, -2.8, 0.62, 0.4);
  const product = amplitude.map(([x, a], index) => [x, -0.95 + (a - 0.55) * (frequency[index][1] + 0.4) * 2.2]);
  const items = [...plot(amplitude, measured, 3), ...plot(frequency, accent, 3)];
  if (phase > 0) items.push(...amplitude.slice(0, phase === 1 ? 5 : 10).map((point, index) => arrow([point[0], point[1] - 0.05], [point[0], product[index][1] + 0.08], pale, 2)), ...plot(product.slice(0, phase === 1 ? 5 : 10), accent, 4));
  if (phase === 2) items.push(math(String.raw`a_j(t)\,\omega_j(t)`, [1.75, -1.35], accent, 21));
  return field(items);
}

function scene17(phase, [accent, measured, pale]) {
  const frequency = [[-2.7, 0.72], [-2.1, 0.58], [-1.5, 1.18], [-0.9, 0.62], [-0.3, 0.55], [0.3, 1.32], [0.9, 0.6], [1.5, 0.68], [2.1, 1.15], [2.7, 0.64]];
  const product = frequency.map(([x, y], index) => [x, y - 1.65 + (index % 3 === 0 ? -0.12 : 0.04)]);
  const outliers = [2, 5, 8];
  const items = [...plot(frequency, measured, 3), ...plot(product, measured, 3), line([-2.8, 0.92], [2.8, 0.92], pale, 3), line([-2.8, -0.78], [2.8, -0.78], pale, 3)];
  if (phase > 0) outliers.slice(0, phase === 1 ? 2 : 3).forEach((index) => items.push(dot(frequency[index], accent, 0.11), dot(product[index], accent, 0.11), line(frequency[index], product[index], accent, 2)));
  if (phase === 2) items.push(math(String.raw`|\omega_j-\bar\omega_j|>\alpha\sigma_{\omega_j}`, [-1.35, 1.55], accent, 16), math(String.raw`|a_j\omega_j-\overline{a_j\omega_j}|>\beta\sigma_{a_j\omega_j}`, [1.25, -1.48], accent, 15));
  return field(items);
}

const ecTrace = [[-2.75, 0.0], [-2.2, 0.42], [-1.65, 0.15], [-1.1, 0.85], [-0.55, 0.25], [0, -0.15], [0.55, 0.72], [1.1, 0.18], [1.65, -0.35], [2.2, 0.35], [2.75, 0.05]];
const contaminated = [3, 6];

function gappedEc(colors, phase, interpolate = false) {
  const [accent, measured, pale] = colors;
  const items = [line([-2.9, 0], [2.9, 0], pale, 2)];
  ecTrace.slice(0, -1).forEach((point, index) => {
    const touchesGap = contaminated.includes(index) || contaminated.includes(index + 1);
    if (!touchesGap) items.push(line(point, ecTrace[index + 1], measured, 3));
    else if (interpolate && phase > 0) items.push(line(point, ecTrace[index + 1], phase === 2 ? accent : pale, phase === 2 ? 4 : 2));
  });
  if (!interpolate) contaminated.slice(0, phase === 0 ? 0 : phase === 1 ? 1 : 2).forEach((index) => items.push(dot(ecTrace[index], accent, 0.11), arrow(ecTrace[index], [ecTrace[index][0], 1.35], accent, 3)));
  return items;
}

function scene18(phase, colors) {
  const [accent, measured] = colors;
  const items = phase === 0 ? [...plot(ecTrace, measured, 4), ...contaminated.map((index) => dot(ecTrace[index], accent, 0.1))] : gappedEc(colors, phase, false);
  if (phase === 2) items.push(...contaminated.map((index) => ring(0.17, ecTrace[index], accent, 3)));
  return field(items);
}

function scene19(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = gappedEc(colors, phase, true);
  if (phase > 0) items.push(...contaminated.map((index) => dot(ecTrace[index], phase === 2 ? accent : pale, 0.075)));
  if (phase === 2) items.push(...plot([[-2.95, 0.28], [-2.75, 0], [-2.55, 0.28]], measured, 2), ...plot([[2.55, 0.28], [2.75, 0.05], [2.95, 0.28]], measured, 2), math(String.raw`\mathrm{mirror}`, [0, -1.15], accent, 18));
  return field(items);
}

function scene20(phase, [accent, measured, pale]) {
  const original = ecTrace.map(([x, y], index) => [x, y + (contaminated.includes(index) ? 0.45 : 0.08 * Math.sin(index))]);
  const cleaned = ecTrace.map(([x, y]) => [x, y - 0.18]);
  const items = [...plot(original, measured, 2)];
  if (phase > 0) items.push(...plot(cleaned.slice(0, phase === 1 ? 7 : 11), accent, 4), rect(1.1, 0.52, [-1.55, 1.28], measured, pale, 0.3), math(String.raw`\omega_j`, [-1.55, 1.28], measured, 19));
  if (phase === 2) items.push(rect(1.1, 0.52, [0, 1.28], accent, pale, 0.3), math(String.raw`a_j\omega_j`, [0, 1.28], accent, 18), ring(0.17, [1.15, 1.28], accent, 4), dot([1.15, 1.28], accent, 0.07));
  return field(items);
}

function scene21(phase, [accent, measured, pale]) {
  const signal = [[-2.75, -0.55], [-2.2, -0.15], [-1.65, 0.75], [-1.1, 0.25], [-0.55, -0.62], [0, -0.2], [0.55, 0.85], [1.1, 0.35], [1.65, -0.68], [2.25, -0.18], [2.75, 0.55]];
  const extrema = [[2, "on"], [4, "off"], [6, "on"], [8, "off"]];
  const items = [line([-2.85, 0], [2.85, 0], pale, 2), ...plot(signal, measured, 4)];
  if (phase > 0) extrema.slice(0, phase === 1 ? 2 : 4).forEach(([index, value]) => items.push(ring(0.16, signal[index], accent, 4), arrow([signal[index][0], value === "on" ? 1.35 : -1.35], signal[index], accent, 3)));
  if (phase === 2) items.push(label("ON", [-1.65, 1.5], accent, 16), label("OFF", [-0.55, -1.5], accent, 16), label("ON", [0.55, 1.5], accent, 16), label("OFF", [1.65, -1.5], accent, 16));
  return field(items);
}

function scene22(phase, [accent, measured, pale]) {
  const increments = [-0.08, -0.18, -0.12, -0.22, 0.02, 0.12, 0.18, 0.15];
  const restored = increments.reduce((points, value, index) => [...points, [-2.45 + index * 0.62, (points.at(-1)?.[1] ?? 0.7) + value]], []);
  const count = phase === 0 ? 3 : phase === 1 ? 6 : 8;
  const items = [line([-2.75, 0.72], [2.65, 0.72], measured, 2), ...increments.slice(0, count).map((value, index) => line([-2.45 + index * 0.62, 0.72], [-2.45 + index * 0.62, 0.72 + value * 2.2], measured, 4))];
  if (phase > 0) items.push(arrow([0, 0.42], [0, -0.12], accent, 4), ...plot(restored.slice(0, count).map(([x, y]) => [x, y - 1.25]), accent, 4));
  if (phase === 2) items.push(math(String.raw`\mathrm{back\!\!-transform}`, [1.55, -1.35], accent, 18), line([-1.65, -0.35], [0.55, -0.35], pale, 5));
  return field(items);
}

function scene23(phase, [accent, measured, pale]) {
  const left = grid({ x: -2.75, y: 0.95, rows: 4, columns: 4, cellWidth: 0.43, cellHeight: 0.38, stroke: measured, fills: [pale, measured, accent], phase, opacity: 0.52 });
  const right = grid({ x: 0.75, y: 0.95, rows: 4, columns: 4, cellWidth: 0.43, cellHeight: 0.38, stroke: accent, fills: [pale, accent, measured], phase: phase + 1, opacity: 0.58 });
  const items = [...left];
  if (phase > 0) items.push(arrow([-0.55, 0.18], [0.45, 0.18], accent, 4), math(String.raw`S(s)u_k(s)`, [-0.05, 0.68], accent, 19), ...right);
  if (phase === 2) items.push(math(String.raw`Q_k(s,t)=S(s)u_k(s)\frac{\check c_k(t_u)-\check c_k(t_l)}{t_l-t_u},\quad t_u\le t\le t_l`, [0, -1.48], accent, 17));
  return field(items);
}

function scene24(phase, [accent, measured, pale]) {
  const centers = [[-2.45, 0.85], [-1.45, 0.25], [-2.25, -0.75], [-1.15, -0.85]];
  const items = centers.slice(0, phase + 2).flatMap((point, index) => [ring(0.35, point, index % 2 ? measured : accent, 3), dot(point, index % 2 ? measured : accent, 0.08), arrow([point[0] + 0.38, point[1]], [0.45, 0.05], pale, 2)]);
  if (phase > 0) items.push(rect(2.3, 2.55, [1.65, 0], measured, pale, 0.18), ...wellPoints.map(([x, y]) => [1.65 + x * 0.35, y * 0.65]).flatMap((point) => [ring(0.3 + phase * 0.08, point, accent, 3), dot(point, accent, 0.06)]));
  if (phase === 2) items.push(math(String.raw`Q(s,t)=\sum_{k=1}^{m}Q_k(s,t)`, [0, 1.55], accent, 20));
  return field(items);
}

function scene25(phase, [accent, measured, pale]) {
  const exact = [0.66, 0.88, 1.02, 0.92];
  const estimated = [0.86, 0.92, 0.89, 1.05];
  const items = [line([-2.75, -1.15], [2.75, -1.15], measured, 2)];
  for (let index = 0; index < 4; index += 1) {
    const x = -2.15 + index * 1.35;
    items.push(rect(0.34, exact[index] * 1.7, [x - 0.2, -1.15 + exact[index] * 0.85], measured, pale, 0.45), math(String.raw`W_${index + 1}`, [x, -1.48], measured, 17));
    if (phase > 0) items.push(rect(0.34, estimated[index] * 1.7, [x + 0.22, -1.15 + estimated[index] * 0.85], accent, pale, 0.55));
    if (phase === 2) items.push(line([x - 0.2, -1.15 + exact[index] * 1.7], [x + 0.22, -1.15 + estimated[index] * 1.7], accent, 2));
  }
  if (phase === 2) items.push(math(String.raw`99{,}970\quad 107{,}010\ \mathrm{m^3}`, [0.55, 1.45], accent, 18));
  return field(items);
}

function scene26(phase, [accent, measured, pale]) {
  const percentages = [23.8, 4.6, 14.8, 12.2, 6.6];
  const absolute = [5936, 1208, 3774, 3670, 7040];
  const count = phase === 0 ? 2 : phase === 1 ? 4 : 5;
  const items = [line([-2.8, 1.25], [2.75, 1.25], measured, 3), math(String.raw`AE`, [0.25, 1.55], measured, 18), math(String.raw`RE`, [2.05, 1.55], accent, 18)];
  for (let index = 0; index < count; index += 1) {
    const y = 0.85 - index * 0.52;
    const isTotal = index === 4;
    items.push(math(isTotal ? String.raw`\Sigma` : String.raw`W_${index + 1}`, [-2.55, y], isTotal ? accent : measured, 17), line([-2.1, y], [-2.1 + absolute[index] / 3400, y], isTotal ? accent : measured, isTotal ? 5 : 3), math(`${percentages[index]}\\%`, [2.15, y], isTotal ? accent : measured, isTotal ? 22 : 17));
  }
  if (phase === 2) items.push(rect(5.45, 0.46, [0, -1.23], accent, pale, 0.22), math(String.raw`\mathrm{total\ RE}=6.6\%`, [0.4, -1.23], accent, 21));
  return field(items);
}

function scene27(phase, [accent, measured, pale]) {
  const mapItems = [rect(3.0, 2.8, [-1.65, 0], measured, pale, 0.18), ...observationPoints.slice(0, 7).map(([x, y]) => dot([-1.65 + x * 0.42, y * 0.72], measured, 0.045))];
  if (phase > 0) mapItems.push(...wellPoints.flatMap(([x, y]) => {
    const point = [-1.65 + x * 0.42, y * 0.72];
    return [ring(0.22 + phase * 0.09, point, accent, 3), dot(point, accent, 0.055)];
  }));
  const items = [...mapItems];
  if (phase === 2) {
    for (let index = 0; index < 4; index += 1) {
      const base = 1.05 - index * 0.65;
      items.push(...plot(wave(base, 0.12, 1.6, 6, 0.2, 0.48, index * 0.4), measured, 2), ...plot(wave(base - 0.05, 0.11, 1.6, 6, 0.2, 0.48, index * 0.4 + 0.2), accent, 3));
    }
    items.push(math(String.raw`6.6\%`, [1.75, -1.52], accent, 28));
  }
  return field(items);
}

const SCENES = [
  [/aquifer map with observation wells and hidden pumping cones|where and when pumping/, scene01],
  [/incomplete withdrawal ledger|pumping ledger develops blank/, scene02],
  [/mixed head trace linked to four source|pumping, precipitation, tidal/, scene03],
  [/modflow aquifer grid|synthetic aquifer with.*four designed/, scene04],
  [/modflow and theis-jacob|theis solution with jacob/, scene05],
  [/irregular observation dots filling|regular spatiotemporal head field/, scene06],
  [/sloping head traces converting|first-differenced stationary/, scene07],
  [/space-time matrix separating into eof|orthogonal spatial patterns with temporal/, scene08],
  [/eof loading maps retained|source-stated rescaled/, scene09],
  [/diffuse eof loading clouds rotating|varimax-rotated localized/, scene10],
  [/broad recharge eof separated|pumping-like eof modes/, scene11],
  [/one ec trace peeling into stacked|intrinsic mode functions and a residual/, scene12],
  [/real imf paired with its hilbert|complex analytic signal/, scene13],
  [/analytic-signal magnitude traced|time-varying imf amplitude/, scene14],
  [/analytic-signal phase rate traced|time-varying imf frequency/, scene15],
  [/amplitude and frequency traces multiplying|frequency-amplitude product/, scene16],
  [/red outlier marks on the frequency|outlier times associated/, scene17],
  [/outlier-aligned ec samples lifting|bounded gaps in the pumping-like ec/, scene18],
  [/interpolated segments reconnecting|reconstructed pumping-like ec/, scene19],
  [/two criterion indicators settling|denoised ec when both criteria/, scene20],
  [/ec extrema snapping to on-off|pumping-on and pumping-off/, scene21],
  [/first-differenced ec increments accumulating|actual pumping-associated head variation/, scene22],
  [/restored head-change slab becoming|mode-specific space-time pumping-rate/, scene23],
  [/localized rate patches and time series merging|total spatiotemporal pumping-rate/, scene24],
  [/four designed and estimated pumping time-series pairs|per-well and total designed/, scene25],
  [/ae and re markers attached|table 1 absolute and relative errors/, scene26],
  [/synthetic aquifer map with four designed wells.*estimated-rate patches|eof-hht framework can recover/, scene27],
];

export function renderPaperVisual2023_05_26(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description);
  if (!text.includes("[paper:2023-05-26]")) return null;
  const match = SCENES.find(([pattern]) => pattern.test(text));
  return match ? match[1](phaseOf(phase), colorsOf(palette)) : null;
}
