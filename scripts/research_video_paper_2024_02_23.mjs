const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const point = ([x, y]) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const dot = (xy, color, radius = 0.08) => `Dot(${point(xy)}, radius=${radius}, color=${q(color)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const poly = (points, stroke, fill, opacity = 0.5) => `Polygon(${points.map(point).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, buff=0.04, stroke_width=${width})`;
const ring = (radius, xy, color, width = 3) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=0).shift(${point(xy)})`;
const arc = (radius, xy, color, width = 3) => `Arc(radius=${radius}, start_angle=0.12, angle=5.9, color=${q(color)}, stroke_width=${width}).shift(${point(xy)})`;
const tex = (value, color, size, xy) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const axes = (color, yRange = "[-2, 2, 1]", xRange = "[0, 10, 2]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=6.3, y_length=3.25, axis_config={"color": ${q(color)}}).shift([0, -0.25, 0])`;
const axesAt = (xy, color, width = 2.7, height = 2.6) => `Axes(x_range=[0, 4, 1], y_range=[0, 3, 1], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${point(xy)})`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((xy, index) => line(xy, points[index + 1], color, width));
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;
const fan = (stroke, fill, offset = 0) => poly([[-3.2 + offset, 1.25], [-1.25 + offset, 1.55], [0.55 + offset, 1.1], [2.95 + offset, 1.35], [3.15 + offset, -0.75], [1.15 + offset, -1.45], [-1.55 + offset, -1.2], [-3.25 + offset, -0.4]], stroke, fill, 0.48);
const wave = (base, amplitude, cycles) => Array.from({ length: 8 }, (_, index) => [-2.8 + index * 0.8, base + amplitude * Math.sin(index * cycles)]);
const grid = ({ x = -2.6, y = 1.05, rows = 4, columns = 6, stroke, fills, phase = 0, width = 0.58, height = 0.42 }) => Array.from({ length: rows * columns }, (_, index) => {
  const row = Math.floor(index / columns);
  const column = index % columns;
  return rect(width, height, [x + column * (width + 0.08), y - row * (height + 0.08)], stroke, fills[(row + column + phase) % fills.length], 0.72);
});

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
    ? [description.marker, description.visualObject, description.stepDetail, description.visibleEvidence, description.minimalText, description.premise, description.operation, description.output, description.claim]
    : [description];
  return values.filter((value) => typeof value === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

function inventory(c, phase) {
  const [a, m, p] = c;
  const wells = [[-2.5, 0.75], [-1.7, 0.45], [-0.9, 0.85], [0.0, 0.25], [0.85, 0.7], [-2.1, -0.25], [-1.0, -0.6], [0.1, -0.3], [1.15, -0.75], [2.0, -0.2], [-2.7, -0.85], [-0.15, 1.05], [1.85, 0.8], [2.5, -0.65]];
  const ledger = [rect(2.2, 2.55, [2.0, 0, 0], m, p, 0.3), line([0.95, 0.86], [3.05, 0.86], m, 3), line([1.55, 0.86], [1.55, -1.05], m, 2), ...Array.from({ length: phase === 2 ? 3 : 5 }, (_, row) => line([1.05, 0.52 - row * 0.38], [2.92, 0.52 - row * 0.38], row < 2 ? a : m, 3))];
  return field([fan(m, p), ...wells.slice(0, 6 + phase * 4).map((xy, index) => dot(xy, index < 6 ? a : m, 0.075)), ...ledger, arrow([0.8, -1.35], [1.25, -1.05], a, 3)]);
}

function signalComponents(c, phase) {
  const [a, m, p] = c;
  const observed = wave(1.0, 0.32, 1.5);
  const components = [wave(0.35, 0.22, 0.8), wave(-0.1, 0.13, 2.6), wave(-0.52, 0.2, 3.4), wave(-0.92, 0.06, 0.5), wave(-1.22, 0.04, 6.2)];
  const items = [axes(m, "[-1.45, 1.5, 0.5]"), ...plot(observed, m, 4), ...observed.map((xy) => dot(xy, a, 0.06))];
  if (phase > 0) components.slice(0, phase === 1 ? 3 : 5).forEach((trace, index) => items.push(...plot(trace, [a, m, a, m, a][index], index === 2 ? 4 : 2), line([-2.9, trace[0][1], 0], [2.9, trace[0][1], 0], p, 1)));
  if (phase === 2) items.push(arrow([2.55, 1.0], [2.55, 0.42], a, 3));
  return field(items);
}

function monitoringNetwork(c, phase) {
  const [a, m, p] = c;
  const layers = Array.from({ length: 4 }, (_, index) => rect(5.7, 0.48, [-0.25, 0.95 - index * 0.58], m, index % 2 ? p : "#E8EEF0", 0.7));
  const count = phase === 0 ? 12 : phase === 1 ? 32 : 56;
  const stations = Array.from({ length: count }, (_, index) => dot([-2.7 + (index % 14) * 0.39, 0.95 - (index % 4) * 0.58], index % 4 === phase ? a : m, phase === 2 ? 0.052 : 0.065));
  const timeline = [line([-2.9, -1.45], [2.75, -1.45], m, 3), ...Array.from({ length: 12 }, (_, index) => line([-2.9 + index * 0.514, -1.56], [-2.9 + index * 0.514, -1.34], a, 2))];
  return field([...layers, ...stations, ...timeline, tex("197", a, 28, [2.55, 1.1]), tex("2008", m, 22, [-2.85, -1.8]), tex("2019", m, 22, [2.55, -1.8])]);
}

function imfBands(c, phase, residual = false) {
  const [a, m, p] = c;
  const count = phase === 0 ? 1 : phase === 1 ? 4 : 8;
  const items = [axes(m, "[-1.45, 1.35, 0.5]")];
  for (let index = 0; index < count; index += 1) items.push(...plot(wave(0.9 - index * 0.29, residual ? 0.15 : 0.21 - index * 0.012, 1.4 + index * 0.75), index === count - 1 ? m : index % 2 ? a : m, index === 0 ? 4 : 2));
  if (phase === 2) items.push(line([-2.8, -1.27], [2.8, -1.27], p, 4), dot([2.45, -1.27], a, 0.1));
  return field(items);
}

function instantaneousFrequency(c, phase) {
  const [a, m, p] = c;
  const frequency = [[-2.8, -0.85], [-2.0, -0.62], [-1.2, -0.3], [-0.4, -0.52], [0.4, -0.1], [1.2, 0.14], [2.0, 0.0], [2.75, 0.22]];
  const items = [axes(m, "[-1.2, 1.4, 0.5]"), ...plot(wave(0.85, 0.27, 1.6), a, 4)];
  if (phase > 0) items.push(...plot(frequency, m, 3), ...frequency.map((xy) => dot(xy, m, 0.06)));
  if (phase === 2) items.push(line([-2.75, 0.02], [2.75, 0.02], a, 5), ring(0.17, [1.65, 0.02], a, 4), arrow([1.65, 0.28], [1.65, 0.06], a, 3));
  return field(items);
}

function periodClusters(c, phase) {
  const [a, m, p] = c;
  const samples = [[-2.65, 0.75], [-2.25, 0.45], [-1.8, 0.62], [-0.9, -0.1], [-0.45, 0.08], [0.05, -0.22], [0.75, 0.65], [1.25, 0.48], [1.75, 0.72], [2.4, -0.18]];
  const centers = [[-2.0, 0.58], [-0.45, -0.08], [1.55, 0.62]];
  const items = [axes(m, "[-0.5, 1.1, 0.5]"), ...samples.map((xy, index) => dot(xy, index < 3 ? a : m, 0.09))];
  if (phase > 0) samples.forEach((xy, index) => items.push(arrow(xy, centers[index < 3 ? 0 : index < 6 ? 1 : 2], a, 2)));
  if (phase === 2) centers.forEach((xy) => items.push(ring(0.28, xy, a, 4), dot(xy, a, 0.11)));
  return field(items);
}

function svdSplit(c, phase) {
  const [a, m, p] = c;
  const items = [...grid({ x: -2.75, y: 1.0, rows: 4, columns: 4, stroke: m, fills: [p, m, a], phase }), ...grid({ x: 0.15, y: 1.0, rows: 3, columns: 3, stroke: m, fills: [p, a, m], phase })];
  if (phase > 0) items.push(arrow([-0.95, 0.1], [-0.25, 0.45], a, 4), ...plot(wave(0.05, 0.32, 1.8), a, 3));
  if (phase === 2) items.push(arrow([1.9, 0.1], [2.6, 0.1], a, 4), ring(0.3, [2.6, 0.1], a, 4));
  return field(items);
}

function rotatedEOF(c, phase) {
  const [a, m, p] = c;
  const axesLines = [line([-2.75, -1.0], [-0.95, -1.0], m, 2), line([-2.75, -1.0], [-2.75, 1.0], m, 2), line([-2.55, -0.75], [-1.15, 0.72], a, 4), line([-1.15, -0.75], [-2.55, 0.72], m, 3)];
  const maps = [...grid({ x: 0.05, y: 0.88, rows: 3, columns: 4, stroke: m, fills: [p, m, a], phase }), ...grid({ x: 0.05, y: -0.8, rows: 3, columns: 4, stroke: m, fills: [p, a, m], phase: phase + 1 })];
  const items = phase === 0 ? axesLines : [...axesLines, arrow([-0.6, 0], [0.0, 0], a, 4), ...maps];
  if (phase === 2) items.push(arc(0.45, [-1.85, 0], a, 4), line([0.05, -0.25], [2.7, -0.25], a, 3));
  return field(items);
}

function rechargeMode(c, phase) {
  const [a, m, p] = c;
  const rain = [line([-2.8, -1.25], [-0.25, -1.25], m, 2), ...[[-2.45, -0.7], [-1.75, -0.25], [-1.05, -0.55], [-0.35, 0.2], [0.35, 0.55]].flatMap((xy, index) => [dot(xy, a, 0.08), line([xy[0], -1.2], [xy[0], xy[1], 0], a, 3)])];
  const broad = [fan(m, p, 0.8), arc(0.5, [1.55, 0.05], a, 3), arc(0.75, [1.55, 0.05], m, 3), arc(1.0, [1.55, 0.05], a, 3)];
  if (phase === 0) return field([...rain, ...plot(wave(-0.1, 0.22, 1.3), a, 3)]);
  if (phase === 1) return field([...rain, ...broad.slice(0, 2), ...plot(wave(-0.1, 0.22, 1.3), a, 3), arrow([0.3, 0.0], [0.95, 0.1], a, 3)]);
  return field([...rain, ...broad, ...plot(wave(-0.1, 0.22, 1.3), a, 3), ring(0.2, [1.6, 0.1], a, 4)]);
}

function rechargeStack(c, phase) {
  const [a, m, p] = c;
  const layers = [fan(m, p, -0.35), fan(m, p, 0.15), fan(a, p, 0.65)];
  const items = phase === 0 ? [layers[0]] : phase === 1 ? [layers[0], layers[1], arrow([-0.45, 0.1], [0.45, 0.1], a, 4)] : [...layers, arrow([-0.8, 0.1], [0.15, 0.1], a, 4), arrow([0.25, 0.1], [1.05, 0.1], a, 4), ring(0.4, [1.75, 0.1], a, 4)];
  return field(items);
}

function subtraction(c, phase) {
  const [a, m, p] = c;
  const observed = wave(0.65, 0.24, 1.5);
  const recharge = wave(0.18, 0.18, 1.2);
  const residual = observed.map(([x, y], index) => [x, y - recharge[index][1] + 0.05]);
  const items = [axes(m), ...plot(observed, m, 4), ...plot(recharge, a, 3), tex("h-h_R", a, 34, [0, 1.35])];
  if (phase > 0) items.push(arrow([0.25, 0.45], [0.25, 0.08], a, 4), ...plot(residual, a, 4));
  if (phase === 2) items.push(line([-2.8, -0.8], [2.8, -0.8], p, 2), ring(0.2, [1.5, -0.42], a, 4));
  return field(items);
}

function pumpingModes(c, phase) {
  const [a, m, p] = c;
  const bands = Array.from({ length: 6 }, (_, index) => plot(wave(0.82 - index * 0.35, 0.16, 1.1 + index * 0.5), index >= 2 && index <= 4 ? a : m, index >= 2 && index <= 4 ? 4 : 2));
  const items = [axes(m, "[-1.45, 1.2, 0.5]"), ...bands.slice(0, phase === 0 ? 3 : 6).flat()];
  if (phase > 0) items.push(rect(5.45, 1.05, [0, -0.36], a, p, 0.18), line([-2.75, 0.16], [2.75, 0.16], a, 3), line([-2.75, -0.88], [2.75, -0.88], a, 3));
  if (phase === 2) items.push(tex(String.raw`1\text{--}7\text{ days}`, a, 30, [0, -1.35]), arrow([2.7, -0.35], [2.1, -0.35], a, 3));
  return field(items);
}

function sumPumping(c, phase) {
  const [a, m, p] = c;
  const selected = [wave(0.66, 0.16, 1.7), wave(0.18, 0.12, 2.6), wave(-0.28, 0.1, 3.5)];
  const total = wave(-0.85, 0.25, 1.5);
  const items = [axes(m, "[-1.25, 1.1, 0.5]"), ...selected.slice(0, phase + 1).flatMap((trace, index) => [...plot(trace, index === 1 ? m : a, 3), arrow([2.2, trace.at(-1)[1]], [2.65, -0.85], a, 2)])];
  if (phase === 2) items.push(...plot(total, a, 5), ring(0.2, [2.45, -0.78], a, 4));
  return field(items);
}

function headPulses(c, phase) {
  const [a, m, p] = c;
  const pulses = [[-2.0, 0.38], [-0.7, 0.6], [0.65, 0.34], [1.85, 0.52]];
  const items = [axes(m, "[-1.25, 1.15, 0.5]"), ...plot(wave(0.35, 0.25, 1.4), a, 4)];
  if (phase > 0) items.push(...pulses.slice(0, phase === 1 ? 2 : 4).map(([x, h]) => rect(0.52, h, [x, -0.92 + h / 2], a, p, 0.68)), ...pulses.slice(0, phase === 1 ? 2 : 4).map(([x, h]) => line([x, -0.92], [x, -0.92 + h], a, 3)));
  if (phase === 2) items.push(arrow([-2.0, 0.8], [-0.7, 0.8], a, 3), tex(String.raw`\Delta h_P/\Delta t`, a, 28, [0, 1.25]));
  return field(items);
}

function kriging(c, phase) {
  const [a, m, p] = c;
  const stations = [[-1.7, 0.48], [-0.95, -0.04], [0.0, 0.44], [0.85, -0.4], [1.6, 0.24]];
  const items = [fan(m, p), ...stations.map((xy, index) => dot(xy, index === phase ? a : m, 0.11))];
  if (phase > 0) items.push(...stations.flatMap((xy, index) => [ring(0.18 + phase * 0.05, xy, index === phase ? a : m, 2), arc(0.28 + phase * 0.05, xy, index === phase ? a : p, 2)]));
  if (phase === 2) items.push(...grid({ x: -2.6, y: 1.0, rows: 4, columns: 8, stroke: m, fills: [p, m, a], phase: 1, width: 0.54, height: 0.38 }), arrow([2.75, 1.2], [2.1, 0.7], a, 3));
  return field(items);
}

function storageConversion(c, phase) {
  const [a, m, p] = c;
  const left = grid({ x: -2.8, y: 1.0, rows: 4, columns: 4, stroke: m, fills: [p, m, a], phase });
  const right = grid({ x: 0.7, y: 1.0, rows: 4, columns: 4, stroke: a, fills: [p, a, m], phase: phase + 1 });
  const items = phase === 0 ? [...left] : [...left, arrow([-0.2, 0.1], [0.5, 0.1], a, 4), ...right];
  if (phase === 2) items.push(tex(String.raw`Q_P(x,t)`, a, 24, [-1.7, -1.45]), tex("=", a, 24, [-0.85, -1.45]), tex(String.raw`S(x)A(x)`, a, 24, [0.1, -1.45]), tex(String.raw`\Delta h_P/\Delta t`, a, 24, [1.65, -1.45]), ring(0.18, [2.55, -0.65], a, 4));
  return field(items);
}

function monthlyPumping(c, phase) {
  const [a, m, p] = c;
  const cells = grid({ x: -2.85, y: 0.95, rows: 4, columns: phase === 0 ? 3 : 5, stroke: m, fills: [p, m, a], phase, width: 0.45, height: 0.38 });
  const series = Array.from({ length: 8 }, (_, index) => [0.35 + index * 0.34, -0.75 + 0.42 * Math.sin(index)]);
  const items = [...cells, arrow([-0.3, 0.05], [0.2, 0.05], a, 4), axesAt([1.6, -0.2], m, 2.7, 2.5), ...plot(series, a, phase === 2 ? 5 : 3)];
  if (phase === 2) items.push(...series.map((xy) => dot(xy, m, 0.06)), line([-2.7, -0.05], [2.7, -0.05], p, 2));
  return field(items);
}

function annualUncertainty(c, phase) {
  const [a, m, p] = c;
  const heights = [0.62, 0.92, 1.18];
  const items = [axes(m, "[0, 1.5, 0.5]", "[0, 3, 1]"), ...heights.slice(0, phase + 1).map((height, index) => rect(0.62, height, [-1.7 + index * 1.25, -1.25 + height / 2], index === 2 ? a : m, index === 2 ? p : "#E8EEF0", 0.72))];
  if (phase > 0) items.push(rect(3.1, 0.68 + phase * 0.14, [0, 0.18], a, p, 0.28), line([-1.55, 0.18], [1.55, 0.18], a, 4));
  if (phase === 2) items.push(tex(String.raw`1.71\text{--}2.05`, a, 31, [0, 1.25]), line([-1.55, 0.52], [-1.55, -0.16], a, 4), line([1.55, 0.52], [1.55, -0.16], a, 4));
  return field(items);
}

function temporalDemand(c, phase) {
  const [a, m, p] = c;
  const pumping = wave(0.35, 0.43, 0.9);
  const demand = pumping.map(([x, y], index) => [x, y + [0.12, 0.05, -0.04, -0.1, -0.02, 0.05, 0.1, 0.04][index]]);
  const items = [axes(m, "[-0.4, 1.1, 0.5]", "[0, 12, 3]"), ...plot(pumping, a, 4), ...pumping.map((xy) => dot(xy, a, 0.06))];
  if (phase > 0) items.push(...plot(demand, m, 3), ...demand.map((xy) => dot(xy, m, 0.05)));
  if (phase === 2) items.push(line([-2.35, 0.9], [2.35, 0.9], p, 2), ring(0.2, [0.4, 0.54], a, 4));
  return field(items);
}

function pairedMaps(c, phase) {
  const [a, m, p] = c;
  const hotspots = [[-1.75, 0.35], [1.05, -0.25]];
  const items = [fan(m, p, -0.2), fan(a, p, 0.2)];
  if (phase > 0) items.push(...hotspots.flatMap((xy) => [ring(0.4 + phase * 0.12, xy, a, 3), dot(xy, a, 0.1)]));
  if (phase === 2) items.push(poly([[-1.35, 0.78], [-0.3, 0.72], [-0.05, -0.15], [-1.05, -0.55]], a, "#FFFFFF", 0), poly([[0.55, 0.4], [1.5, 0.35], [1.65, -0.42], [0.72, -0.75]], a, "#FFFFFF", 0), arrow([2.55, 1.05], [1.3, 0.1], a, 3));
  return field(items);
}

function finalField(c, phase) {
  const [a, m, p] = c;
  const items = [rect(1.65, 2.7, [-2.35, 0, 0], m, p, 0.22), tex(String.raw`1.71\text{--}2.05`, a, 25, [-2.35, 0.5]), tex(String.raw`10^9`, a, 23, [-2.35, -0.05]), tex(String.raw`\mathrm{m^3\,yr^{-1}}`, m, 20, [-2.35, -0.55])];
  if (phase > 0) {
    const pumping = [[-1.1,-0.75],[-0.75,-0.25],[-0.35,0.25],[0.05,0.05],[0.45,0.55],[0.85,0.22]];
    const demand = pumping.map(([x,y], index) => [x, y + (index % 2 ? 0.12 : -0.08)]);
    items.push(axesAt([-0.1, 0, 0], m, 2.2, 2.25), ...plot(pumping, a, 4), ...plot(demand, m, 3));
  }
  if (phase === 2) items.push(poly([[1.25,1.15],[2.0,1.3],[2.75,0.95],[2.55,0.05],[1.45,0.15]], m, p, 0.52), poly([[1.25,-0.2],[2.1,-0.05],[2.75,-0.42],[2.45,-1.25],[1.35,-1.15]], a, p, 0.42), ring(0.3, [2.05,0.65], a, 3), ring(0.34, [2.0,-0.72], a, 3), arrow([2.05,0.32],[2.05,-0.35],a,3));
  return field(items);
}

export function paperVisualExpression(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = descriptionText(description);
  if (!text.includes("[paper:2024-02-23]")) return null;
  const c = normalizePalette(palette);
  const p = normalizePhase(phase);
  if (/regional pumping from dense|bounded annual total|drawdown-subsidence map pair/.test(text)) return finalField(c, p);
  if (/subsidence|accumulated subsidence|drawdown map paired/.test(text)) return pairedMaps(c, p);
  if (/temporal demand|agricultural groundwater demand|demand pattern/.test(text)) return temporalDemand(c, p);
  if (/annual aquifer totals|1\.71|annual pumping interval|uncertainty band/.test(text)) return annualUncertainty(c, p);
  if (/monthly regional pumping|mapped pumping cells|aquifer-wide series/.test(text)) return monthlyPumping(c, p);
  if (/conditional storage|storage maps|storage-coefficient|q = s a/.test(text)) return storageConversion(c, p);
  if (/kriged|kriging|continuous fan map|station head-change rates/.test(text)) return kriging(c, p);
  if (/delta h\s*p|head change pulses|drawdown difference|time points/.test(text)) return headPulses(c, p);
  if (/sum pumping|selected pumping imfs accumulating|pumping-associated hydrograph/.test(text)) return sumPumping(c, p);
  if (/one-to-seven|1-7 day|pumping window/.test(text)) return pumpingModes(c, p);
  if (/second imf stack|recharge-removed hydrograph|decompose the residual/.test(text)) return imfBands(c, p, true);
  if (/h\s*-\s*h_r|total gwl field minus|subtract.*recharge/.test(text)) return subtraction(c, p);
  if (/recharge-frequency|cumulative recharge|reconstruct recharge/.test(text)) return rechargeStack(c, p);
  if (/broad eof|rainfall-related|recharge modes|rainfall/.test(text)) return rechargeMode(c, p);
  if (/rotated eof|orthogonal eof axes/.test(text)) return rotatedEOF(c, p);
  if (/svd|frequency-class matrix|orthogonal spatial maps/.test(text)) return svdSplit(c, p);
  if (/cluster by period|period markers|mean shift|density peaks/.test(text)) return periodClusters(c, p);
  if (/instantaneous-frequency|mean imf period|hilbert/.test(text)) return instantaneousFrequency(c, p);
  if (/eemd|ordered imf|intrinsic mode|imf bands/.test(text)) return imfBands(c, p);
  if (/four-aquifer|197 stations|twelve-year|monitoring network/.test(text)) return monitoringNetwork(c, p);
  if (/stacked signal|one head record|many drivers|hydrograph.*components/.test(text)) return signalComponents(c, p);
  if (/inventory|ledger|unregistered well|pumping records/.test(text)) return inventory(c, p);
  return null;
}
