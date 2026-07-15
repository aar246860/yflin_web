const q = (value) => JSON.stringify(value);
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dot = (point, color, radius = 0.08) => `Dot(${q(point)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, point, color, width = 3, opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=${opacity}).shift(${q(point)})`;
const rect = (width, height, point, stroke, fill, opacity = 0) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const arrow = (a, b, color) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, buff=0.04)`;
const axes = (measured, yRange = "[-2, 2, 1]") => `Axes(x_range=[0, 10, 2], y_range=${yRange}, x_length=6.3, y_length=3.35, axis_config={"color": ${q(measured)}}).shift([0, -0.3, 0])`;
const group = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;
const trace = (points, color, width = 3) => points.slice(0, -1).map(([x, y], index) => line([x, y, 0], [...points[index + 1], 0], color, width));

function curve([accent, measured], phase) {
  const observed = [[-2.7, 1.05], [-2.05, 0.62], [-1.35, 0.22], [-0.55, -0.18], [0.3, -0.5], [1.25, -0.72], [2.55, -0.9]];
  const model = observed.map(([x, y], index) => [x, y + [0.18, 0.08, -0.05, -0.22, -0.12, 0.04, 0.1][index]]);
  const items = [axes(measured, "[-3, 1, 1]"), ...trace(observed, measured), ...observed.map(([x, y]) => dot([x, y, 0], accent))];
  if (phase >= 1) items.push(...trace(model, accent, 4));
  if (phase === 2) items.push(line([-0.55, -0.18, 0], [-0.55, -0.4, 0], accent, 6), circle(0.23, [-0.55, -0.29, 0], accent, 4), line([0.85, -1.45, 0], [0.85, 1.25, 0], measured, 3));
  return group(items);
}

function map([accent, measured, pale], phase) {
  const stations = [[-2.3, 0.75], [-1.1, -0.2], [0.2, 0.55], [1.25, -0.75], [2.25, 0.45]];
  const items = [
    `Polygon([-3.1, 1.35, 0], [-1.1, 1.55, 0], [0.4, 1.15, 0], [2.9, 1.4, 0], [3.15, -0.8, 0], [1.2, -1.45, 0], [-1.5, -1.2, 0], [-3.2, -0.45, 0], color=${q(measured)}).set_fill(${q(pale)}, opacity=0.48)`,
    ...stations.map(([x, y]) => dot([x, y, 0], accent, 0.11)),
  ];
  if (phase >= 1) items.push(...[0.65, 1.15, 1.65].map((radius, index) => `Arc(radius=${radius}, start_angle=${0.1 + index * 0.08}, angle=${5.8 - index * 0.2}, color=${q(index === 2 ? accent : measured)}, stroke_width=${index === 2 ? 4 : 2}).shift([0.15, -0.1, 0])`));
  if (phase === 2) items.push(`Polygon([-0.25, 1.05, 0], [1.7, 0.95, 0], [2.15, -0.45, 0], [0.65, -1.0, 0], color=${q(accent)}).set_fill(${q("#FFFFFF")}, opacity=0)`, arrow([2.65, 1.15, 0], [1.55, 0.35, 0], accent), circle(0.25, [1.55, 0.35, 0], accent, 4));
  return group(items);
}

function equation([accent, measured, pale], phase) {
  const blocks = [
    rect(1.45, 0.9, [-2.35, 0, 0], measured, pale, 0.72),
    rect(1.45, 0.9, [0, 0, 0], accent, "#FFFFFF", 0),
    rect(1.45, 0.9, [2.35, 0, 0], accent, pale, 0.88),
  ];
  const items = [blocks[0], ...[[-2.75, -2.35], [-2.35, -1.95]].map(([x1, x2]) => line([x1, 0, 0], [x2, 0, 0], measured, 3))];
  if (phase >= 1) items.push(arrow([-1.55, 0, 0], [-0.8, 0, 0], accent), blocks[1], circle(0.22, [0, 0, 0], accent, 4));
  if (phase === 2) items.push(arrow([0.8, 0, 0], [1.55, 0, 0], accent), blocks[2], line([1.95, -0.12, 0], [2.25, -0.38, 0], measured, 4), line([2.25, -0.38, 0], [2.8, 0.32, 0], accent, 4));
  return group(items);
}

function distribution([accent, measured, pale], phase) {
  const samples = [[-2.5, -1.1], [-1.9, -1.1], [-1.35, -1.1], [-0.85, -1.1], [-0.35, -1.1], [0.1, -1.1], [0.55, -1.1], [1.0, -1.1], [1.45, -1.1], [1.95, -1.1], [2.45, -1.1]];
  const items = [axes(measured, "[0, 1, 0.25]"), ...samples.slice(0, 5 + phase * 3).map((point, index) => dot([...point, 0], index % 2 ? measured : accent, 0.09))];
  if (phase >= 1) items.push(`Arc(radius=1.45, start_angle=0.08, angle=2.98, color=${q(accent)}, stroke_width=5).scale([1.35, 0.9, 1]).shift([-0.25, -0.8, 0])`);
  if (phase === 2) items.push(`Arc(radius=1.1, start_angle=0.08, angle=2.98, color=${q(measured)}, stroke_width=3).scale([1.25, 0.75, 1]).shift([0.65, -0.85, 0])`, line([-0.8, -1.42, 0], [1.25, -1.42, 0], accent, 7), dot([0.25, -1.42, 0], pale, 0.13));
  return group(items);
}

function matrix([accent, measured, pale], phase) {
  const [rows, columns] = phase === 0 ? [3, 3] : phase === 1 ? [4, 5] : [4, 6];
  const cells = [];
  for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) cells.push(rect(0.67, 0.55, [-1.7 + column * 0.7, 0.9 - row * 0.59, 0], measured, (row + column) % 3 === 0 ? accent : pale, 0.24 + ((row + column) % 3) * 0.22));
  if (phase === 2) cells.push(rect(1.42, 1.18, [0.75, 0.31, 0], accent, "#FFFFFF", 0), arrow([2.8, 1.15, 0], [1.38, 0.75, 0], accent));
  return group(cells);
}

function sensitivity([accent, measured, pale], phase) {
  const heights = [0.6, 1.28, 0.86, 1.72, 0.48];
  const count = phase === 0 ? 3 : 5;
  const items = [axes(measured, "[0, 2.2, 0.5]"), ...heights.slice(0, count).map((height, index) => rect(0.56, height, [-2.3 + index * 1.12, -1.38 + height / 2, 0], measured, index === 3 ? accent : pale, 0.82))];
  if (phase === 2) items.push(line([-2.75, 0.2, 0], [2.75, 0.2, 0], accent, 3), dot([1.06, 0.34, 0], accent, 0.13), arrow([2.6, 1.25, 0], [1.25, 0.45, 0], accent));
  return group(items);
}

function residual([accent, measured], phase) {
  const observed = [[-2.55, 0.7], [-1.75, 0.28], [-0.95, -0.08], [-0.15, -0.38], [0.65, -0.12], [1.45, -0.58], [2.25, -0.8]];
  const fit = observed.map(([x, y], index) => [x, y + [0.1, -0.14, 0.18, -0.3, 0.12, 0.2, -0.08][index]]);
  const items = [axes(measured), ...trace(observed, measured), ...observed.map(([x, y]) => dot([x, y, 0], accent))];
  if (phase >= 1) items.push(...trace(fit, accent, 3), ...observed.map(([x, y], index) => line([x, y, 0], [fit[index][0], fit[index][1], 0], measured, 2)));
  if (phase === 2) items.push(line([-2.75, 0.42, 0], [2.75, 0.42, 0], accent, 2), line([-2.75, -0.92, 0], [2.75, -0.92, 0], accent, 2), circle(0.26, [-0.15, -0.53, 0], accent, 4));
  return group(items);
}

function scatter([accent, measured], phase) {
  const points = [[-2.4, -1.05], [-1.7, -0.72], [-1.05, -0.3], [-0.35, -0.2], [0.35, 0.42], [1.05, 0.58], [1.75, 1.1], [2.45, 1.28]];
  const items = [axes(measured, "[0, 10, 2]"), ...points.slice(0, phase === 0 ? 5 : 8).map(([x, y]) => dot([x, y - 0.2, 0], accent, 0.1))];
  if (phase >= 1) items.push(line([-2.75, -1.55, 0], [2.75, 1.45, 0], measured, 2));
  if (phase === 2) items.push(line([-0.35, -0.4, 0], [-0.35, -0.1, 0], accent, 5), circle(0.24, [-0.35, -0.25, 0], accent, 4), arrow([2.65, 0.35, 0], [1.75, 0.9, 0], accent));
  return group(items);
}

function plume([accent, measured, pale], phase) {
  const reach = [0.2, 1.65, 2.55][phase];
  const items = [dot([-2.65, 0.05, 0], accent, 0.16), `Polygon([-2.5, 0.48, 0], [${reach}, 0.25, 0], [${reach + 0.35}, -0.2, 0], [${reach}, -0.68, 0], [-2.5, -0.35, 0], color=${q(accent)}).set_fill(${q(pale)}, opacity=${0.38 + phase * 0.16})`, line([-3.05, -1.25, 0], [3.05, -1.25, 0], measured, 2)];
  if (phase >= 1) items.push(...[-0.9, 0.2, 1.15].map((x) => circle(0.28, [x, -0.1, 0], measured, 2)));
  if (phase === 2) items.push(line([2.15, -1.05, 0], [2.15, 1.1, 0], accent, 4), circle(0.24, [2.15, -0.2, 0], accent, 4), arrow([2.85, 1.1, 0], [2.2, 0.2, 0], accent));
  return group(items);
}

function pulse([accent, measured, pale], phase) {
  const items = [axes(measured, "[0, 3, 1]"), rect(0.5, 1.65, [-1.9, -0.42, 0], accent, pale, 0.9)];
  if (phase >= 1) items.push(`Arc(radius=1.05, start_angle=0.05, angle=2.8, color=${q(accent)}, stroke_width=4).scale([1.2, 0.9, 1]).shift([0.75, -0.3, 0])`, arrow([-1.55, -1.22, 0], [0.65, -1.22, 0], measured));
  if (phase === 2) items.push(line([-1.55, -1.48, 0], [-1.55, -0.98, 0], accent, 3), line([0.65, -1.48, 0], [0.65, -0.98, 0], accent, 3), dot([0.65, -1.22, 0], accent, 0.13));
  return group(items);
}

function forest([accent, measured, pale], phase) {
  const centers = phase === 0 ? [0] : [-2, 0, 2];
  const items = centers.flatMap((center) => [line([center, 0.75, 0], [center - 0.45, -0.15, 0], measured, 2), line([center, 0.75, 0], [center + 0.45, -0.15, 0], measured, 2), circle(0.18, [center, 0.8, 0], accent, 3, 0.15), circle(0.14, [center - 0.5, -0.2, 0], measured, 2), circle(0.14, [center + 0.5, -0.2, 0], measured, 2)]);
  if (phase >= 1) items.push(...centers.map((center) => line([center, -0.35, 0], [center, -0.85, 0], accent, 3)));
  if (phase === 2) items.push(...centers.map((center) => arrow([center, -0.9, 0], [0, -1.45, 0], accent)), circle(0.28, [0, -1.55, 0], accent, 5, 0.2));
  return group(items);
}

function system([accent, measured, pale], phase) {
  const items = [rect(6.4, 0.72, [0, 1.1, 0], measured, pale, 0.7), rect(6.4, 1.15, [0, 0.12, 0], accent, pale, 0.42), rect(6.4, 0.72, [0, -0.95, 0], measured, pale, 0.8), rect(0.36, 3.1, [-0.7, 0.05, 0], accent, "#FFFFFF", 0), line([-0.7, 1.55, 0], [-0.7, -1.25, 0], accent, 5)];
  if (phase >= 1) items.push(...[-0.45, 0.15, 0.75].map((y) => arrow([-2.7, y, 0], [-0.95, y, 0], accent)));
  if (phase === 2) items.push(`Arc(radius=1.25, start_angle=3.35, angle=2.55, color=${q(measured)}, stroke_width=4).shift([-0.7, -0.15, 0])`, line([2.25, -1.3, 0], [2.25, 1.45, 0], accent, 4), circle(0.24, [2.25, 0.15, 0], accent, 4));
  return group(items);
}

function workflow([accent, measured, pale], phase) {
  const count = 2 + phase;
  const nodes = [-2.7, -0.9, 0.9, 2.7].slice(0, count);
  const items = [...nodes.map((x, index) => circle(0.4, [x, 0, 0], index === count - 1 ? accent : measured, 3, index === count - 1 ? 0.25 : 0.08)), ...nodes.slice(0, -1).map((x, index) => arrow([x + 0.45, 0, 0], [nodes[index + 1] - 0.45, 0, 0], accent))];
  if (phase === 2) items.push(line([2.7, -0.45, 0], [2.7, -1.15, 0], accent, 3), circle(0.23, [2.7, -1.4, 0], accent, 4, 0.2));
  return group(items);
}

function fault([accent, measured, pale], phase) {
  const items = [`Polygon([-3.1, 1.2, 0], [3.1, 1.2, 0], [3.1, 0.15, 0], [-3.1, 0.65, 0], color=${q(measured)}).set_fill(${q(pale)}, opacity=0.65)`, `Polygon([-3.1, 0.35, 0], [3.1, -0.1, 0], [3.1, -1.15, 0], [-3.1, -0.55, 0], color=${q(measured)}).set_fill(${q(pale)}, opacity=0.4)`, line([-0.15, 1.55, 0], [-1.25, -1.5, 0], accent, 6)];
  if (phase >= 1) items.push(arrow([-2.65, -1.35, 0], [1.7, -1.35, 0], accent));
  if (phase === 2) items.push(line([-0.1, 0.85, 0], [0.42, 0.38, 0], measured, 5), circle(0.22, [0.16, 0.62, 0], accent, 4));
  return group(items);
}

function island([accent, measured, pale], phase) {
  const items = [`Polygon([-3.35, 1.35, 0], [-2.2, 1.65, 0], [-0.8, 1.25, 0], [0.45, 1.55, 0], [2.15, 1.1, 0], [3.25, 0.3, 0], [2.35, -1.35, 0], [-2.7, -1.35, 0], color=${q(measured)}).set_fill(${q(pale)}, opacity=0.72)`];
  if (phase >= 1) items.push(`Arc(radius=2.45, start_angle=3.36, angle=2.7, color=${q(accent)}, stroke_width=6).shift([-0.15, -0.62, 0])`, ...[-1.8, 0, 1.75].flatMap((x) => [line([x, 1.15, 0], [x, -0.9, 0], measured, 4), dot([x, -0.9, 0], accent)]));
  if (phase === 2) items.push(line([0.75, -1.1, 0], [0.75, 1.25, 0], accent, 4), arrow([2.75, -0.9, 0], [0.82, -0.2, 0], accent));
  return group(items);
}

const VISUALS = { curve, distribution, equation, fault, forest, island, map, matrix, plume, pulse, residual, scatter, sensitivity, system, workflow };

export function advancedSemanticVisualExpression({ kind, palette, phase }) {
  return VISUALS[kind](palette, phase);
}
