const q = (value) => JSON.stringify(value);
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dot = (point, color, radius = 0.08) => `Dot(${q(point)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, point, color, width = 3) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=0).shift(${q(point)})`;
const rect = (width, height, point, stroke, fill, opacity = 0.6) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const arc = (radius, point, color, start = 0, angle = 3.05, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${q(point)})`;
const polygon = (points, stroke, fill, opacity = 0.55) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const axes = (point, measured, width = 3.1, height = 2.15) => `Axes(x_range=[0, 4, 1], y_range=[0, 3, 1], x_length=${width}, y_length=${height}, axis_config={"color": ${q(measured)}}).shift(${q(point)})`;
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((point, index) => line([...point, 0], [...points[index + 1], 0], color, width));

function annulusInterface(description, phase, [accent, measured, pale]) {
  const head = /head trace|drawdown trace|continuous drawdown|drawdown jump|flux jump/i.test(description);
  const brace = /brace|thickness|\br_s\b|well radius/i.test(description);
  const labels = /s_w|s_skin|wellbore and skin sides|drawdown value attached/i.test(description);
  const active = phase === 1 ? measured : accent;
  const items = [circle(0.42, [-2.35, 0, 0], accent, 5), circle(0.74 + phase * 0.02, [-2.35, 0, 0], phase === 1 ? accent : measured, 3 + phase), line([-2.35, -1.35, 0], [-2.35, 1.35, 0], measured, 3)];
  if (head) items.push(rect(0.32, 2.7, [0.25, 0, 0], measured, pale, 0.55), ...plot([[-0.9, 1.15], [0.08, 0.72], [0.08, 0.35]], phase === 0 ? accent : measured, 4), ...plot([[0.42, -0.05], [1.35, -0.42], [2.75, -0.72]], phase === 0 ? accent : measured, 4), line([0.08, 0.35, 0], [0.42, -0.05, 0], phase === 0 ? accent : measured, 2), ...plot([[-0.9, 0.05], [0.25, -0.42], [1.35, -0.82], [2.75, -1.08]], phase === 2 ? accent : measured, phase === 2 ? 5 : 3));
  if (brace) items.push(line([-2.77, 1.05, 0], [-2.35, 1.05, 0], active, 3), line([-2.77, 0.91, 0], [-2.77, 1.19, 0], active, 3), line([-2.35, 0.91, 0], [-2.35, 1.19, 0], active, 3), arrow([-2.56, 1.05, 0], [-2.76, 1.05, 0], active), arrow([-2.56, 1.05, 0], [-2.36, 1.05, 0], active), dot([-2.77, 1.05, 0], active, 0.08), dot([-2.35, 1.05, 0], active, 0.08));
  if (labels) items.push(dot([-2.35, 0, 0], accent, 0.13), circle(0.14, [-1.72, 0, 0], measured, 4), line([-2.62, -0.68, 0], [-2.08, -0.68, 0], accent, 4), line([-1.98, -0.68, 0], [-1.38, -0.68, 0], measured, 4), line([-1.88, -0.82, 0], [-1.88, -0.54, 0], measured, 3), line([-1.48, -0.82, 0], [-1.48, -0.54, 0], measured, 3));
  return field(items);
}

function controlStrip(description, phase, [accent, measured, pale]) {
  const colors = [accent, measured, "#D98255"];
  const items = [rect(3.8, 0.9, [-0.45, 0, 0], measured, pale, 0.72), line([-2.35, -0.45, 0], [1.45, -0.45, 0], measured, 3), line([-2.35, 0.45, 0], [1.45, 0.45, 0], measured, 3), arrow([-3.0, 0, 0], [-2.38, 0, 0], phase === 0 ? accent : measured, 5), arrow([1.48, 0, 0], [2.2, 0, 0], phase === 0 ? accent : measured, 5), arrow([-0.45, 1.35, 0], [-0.45, 0.48, 0], phase === 1 ? accent : measured, 5), arrow([0.25, -0.48, 0], [0.25, -1.35, 0], phase === 1 ? accent : measured, 5), ...[-1.35, -0.65, 0.05, 0.75].map((x) => rect(0.45, 0.36, [x, 0, 0], measured, phase === 2 ? colors[(x > 0 ? 2 : 1)] : pale, 0.8)), dot([-2.7, 0.42, 0], colors[0], 0.1), dot([0.75, 1.1, 0], colors[1], 0.1), dot([0.75, -1.05, 0], colors[2], 0.1)];
  if (/darcy|gradient/i.test(description)) items.push(...plot([[-2.8, -1.65], [-1.4, -1.25], [0, -1.55], [1.8, -1.05]], accent, 3));
  return field(items);
}

function radialBoundary(description, phase, [accent, measured, pale]) {
  const switchable = /three outer|robin.*dirichlet.*no-flow|swap only|three cases/i.test(description);
  const mode = switchable ? phase : /fixed.head|dirichlet|lock.*head/i.test(description) ? 1 : /no-flow|flux to zero|impermeable|closed to radial flux/i.test(description) ? 2 : 0;
  const items = [circle(0.34, [0, 0, 0], accent, 5), circle(0.76 + phase * 0.03, [0, 0, 0], measured, 3 + phase), circle(2.45, [0, 0, 0], mode === phase ? accent : measured, 4 + phase), rect(0.25, 3.1, [0, 0, 0], accent, "#FFFFFF", 0.9)];
  if (mode === 0) items.push(arrow([3.1, 0, 0], [2.48, 0, 0], accent, 4), arrow([-3.1, 0, 0], [-2.48, 0, 0], accent, 4), arc(2.68, [0, 0, 0], measured, 0.15, 2.82, 2));
  if (mode === 1) for (const [x, y] of [[0, 2.45], [2.45, 0], [0, -2.45], [-2.45, 0]]) items.push(dot([x, y, 0], accent, 0.13));
  if (mode === 2) for (const [x, y, dx, dy] of [[0, 2.45, 0.25, 0], [2.45, 0, 0, 0.25], [0, -2.45, 0.25, 0], [-2.45, 0, 0, 0.25]]) items.push(line([x - dx, y - dy, 0], [x + dx, y + dy, 0], accent, 6));
  return field(items);
}

function pairedPlumeBtc(description, phase, [accent, measured, pale]) {
  const items = [circle(0.22, [-2.45, 0.8, 0], accent, 4), circle(0.22, [-2.45, -0.85, 0], measured, 4), ...[0.48, 0.72 + phase * 0.09, 1.0 + phase * 0.12].map((r, i) => circle(r, [-2.45, 0.8, 0], i === phase ? accent : pale, i === phase ? 5 : 2)), ...[0.45, 0.68 + phase * 0.06, 0.9 + phase * 0.08].map((r, i) => circle(r, [-2.45, -0.85, 0], i === phase ? measured : pale, i === phase ? 5 : 2)), axes([1.45, 0, 0], measured, 3.3, 3.1), ...plot([[0.05, -1.25], [0.55, -1.05], [1.0, -0.35], [1.45, 0.72], [2.05, 1.1], [2.75, 1.2]], accent, 4), ...plot([[0.05, -1.25], [0.7, -1.08], [1.2, -0.62], [1.7, 0.15], [2.2, 0.62], [2.75, 0.84]], measured, 3)];
  return field(items);
}

function transportPanels(description, phase, [accent, measured, pale]) {
  const recovery = /injected and recovered|heat areas|recovery|eta against|extraction arrows/i.test(description);
  const ratio = /divided by|ratio by distance|nltd diffusivity divided/i.test(description);
  if (recovery) return field([axes([0, -0.25, 0], measured, 6.1, 3.2), polygon([[-2.75, -1.45, 0], [-2.15, -0.35, 0], [-1.4, 1.05, 0], [-0.55, -0.25, 0], [0, -1.45, 0]], accent, pale, 0.85), polygon([[0, -1.45, 0], [0.65, -0.3, 0], [1.35, 0.7 - phase * 0.1, 0], [2.25, -0.45, 0], [2.75, -1.45, 0]], measured, "#F8E3D8", 0.82), arrow([-1.5, 1.55, 0], [-0.65, 1.55, 0], accent), arrow([0.65, 1.55, 0], [1.5, 1.55, 0], measured), rect(0.6 + phase * 0.25, 0.16, [0, 1.65, 0], phase === 2 ? accent : measured, pale, 0.9)]);
  const left = [[-2.8, -1.1], [-2.15, -0.35], [-1.55, 0.62], [-0.9, 1.05], [-0.25, 1.2]];
  const right = [[0.35, -0.95], [0.95, -0.25], [1.55, 0.32], [2.15, 0.52], [2.75, 0.62]];
  const items = [line([-3.05, -1.35, 0], [-0.05, -1.35, 0], measured, 2), line([0.05, -1.35, 0], [3.05, -1.35, 0], measured, 2), ...plot(left, ratio ? measured : accent, 4), ...plot(right, ratio ? accent : measured, 4), ...left.map(([x, y], i) => dot([x, y - phase * 0.05, 0], i <= phase + 1 ? accent : measured)), ...right.map(([x, y], i) => dot([x, y + phase * 0.05, 0], i <= phase + 1 ? measured : accent))];
  if (ratio) items.push(rect(1.2 + phase * 0.25, 0.2, [0, 1.65, 0], accent, pale, 0.9), line([-0.75, 1.25, 0], [0.75, 1.25, 0], accent, 3));
  return field(items);
}

function responseSurface(description, phase, [accent, measured, pale]) {
  const items = [line([-3, -1.35, 0], [-0.2, -1.35, 0], measured, 2), line([-3, -1.35, 0], [-3, 1.35, 0], measured, 2)];
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 4; col += 1) items.push(polygon([[-2.9 + col * 0.68, -1.2 + row * 0.72, 0], [-2.3 + col * 0.68, -1.05 + row * 0.72, 0], [-2.15 + col * 0.68, -0.45 + row * 0.72, 0], [-2.75 + col * 0.68, -0.6 + row * 0.72, 0]], measured, [pale, measured, accent][(row + col + phase) % 3], 0.62));
  const ridge = [[0.25, -0.9], [0.8, -0.42], [1.35, 0.18], [1.9, 0.95], [2.45, 0.4], [2.9, -0.2]];
  items.push(line([0.15, -1.35, 0], [3.05, -1.35, 0], measured, 2), ...plot(ridge, accent, 5), dot([...ridge[Math.min(3, phase + 1)], 0], accent, 0.14), line([-2.65 + phase * 0.68, -1.42, 0], [-2.15 + phase * 0.68, 1.35, 0], accent, 4), line([2.68, 1.1, 0], [2.98, 1.4, 0], accent, 4), line([2.68, 1.4, 0], [2.98, 1.1, 0], accent, 4));
  return field(items);
}

function twoSiteBtc(description, phase, [accent, measured, pale]) {
  const items = [];
  for (const y of [0.85, -0.9]) {
    items.push(line([-3, y - 0.62, 0], [3, y - 0.62, 0], measured, 2), line([-3, y - 0.62, 0], [-3, y + 0.68, 0], measured, 2));
    const curves = [[[ -2.85, y - 0.5], [-2.1, y - 0.35], [-1.2, y + 0.35], [0, y + 0.58], [1.4, y + 0.42], [2.8, y + 0.2]], [[-2.85, y - 0.5], [-1.8, y - 0.28], [-0.8, y + 0.48], [0.5, y + 0.52], [1.8, y + 0.25], [2.8, y + 0.12]]];
    items.push(...plot(curves[0], accent, 3 + phase), ...plot(curves[1], measured, 5 - phase), ...curves[0].filter((_, i) => i % 2 === 0).map(([x, py]) => dot([x, py, 0], pale, 0.1)));
  }
  return field(items);
}

function pixelField(description, phase, [accent, measured, pale]) {
  const items = [];
  for (let row = 0; row < 4; row += 1) for (let col = 0; col < 7; col += 1) {
    const coherent = Math.min(2, Math.floor(col / 3));
    const fragmented = (row * 5 + col * 2 + phase) % 3;
    items.push(rect(0.72, 0.62, [-2.2 + col * 0.74, 0.95 - row * 0.64, 0], measured, [pale, measured, accent][phase === 0 ? coherent : fragmented], 0.78));
  }
  items.push(arrow([-3.1, -1.65, 0], [phase === 0 ? -2.1 : 2.9, -1.65, 0], accent, 4));
  return field(items);
}

function treeField(description, phase, [accent, measured, pale]) {
  const six = /six parallel|six ensemble|six model/i.test(description);
  const roots = six ? [-2.75, -1.65, -0.55, 0.55, 1.65, 2.75] : [-2, 0, 2];
  const items = [];
  for (const [index, x] of roots.entries()) {
    const y = six ? 1.25 : 1.15;
    items.push(line([x, y, 0], [x - 0.35, 0.25, 0], measured, 2), line([x, y, 0], [x + 0.35, 0.25, 0], measured, 2), line([x - 0.35, 0.25, 0], [x - 0.55, -0.8, 0], measured, 2), line([x + 0.35, 0.25, 0], [x + 0.55, -0.8, 0], measured, 2), circle(0.12, [x, y, 0], index === phase || (six && index % 3 === phase) ? accent : measured, 3), circle(0.1, [x - 0.35, 0.25, 0], measured, 2), circle(0.1, [x + 0.35, 0.25, 0], measured, 2), dot([x - 0.55, -0.8, 0], pale, 0.1), dot([x + 0.55, -0.8, 0], pale, 0.1));
  }
  items.push(rect(4.8 + phase * 0.35, 0.18, [0, -1.45, 0], accent, pale, 0.8));
  return field(items);
}

function geoGeometry(description, phase, [accent, measured, pale]) {
  const items = [arrow([-2.2, -0.9, 0], [-2.2, 1.2, 0], phase === 0 ? accent : measured, 4), arrow([-2.2, -0.9, 0], [-0.15, -0.9, 0], phase === 1 ? accent : measured, 4), circle(0.88 + phase * 0.08, [1.25, 0.1, 0], phase === 2 ? accent : measured, phase === 2 ? 6 : 3), line([-2.2, 1.25, 0], [0.62, 0.62, 0], measured, 2), line([-0.1, -0.9, 0], [0.62, -0.42, 0], measured, 2), dot([-2.2, 1.2, 0], accent, 0.11), dot([-0.15, -0.9, 0], measured, 0.11), dot([1.25, 0.1, 0], accent, 0.12)];
  if (/intersect|overlap|feature|pot|shear|brightness/i.test(description)) items.push(rect(2.1, 0.42 + phase * 0.12, [1.65, 0.1, 0], measured, pale, 0.45), dot([1.25, 0.1, 0], accent, 0.16));
  return field(items);
}

function directionalProbes(description, phase, [accent, measured, pale]) {
  const items = [circle(0.34, [0, 0, 0], accent, 5), rect(1.0, 0.42, [0, 0, 0], measured, pale, 0.75)];
  for (let index = 0; index < 16; index += 1) {
    const theta = index * Math.PI / 8;
    const inner = [0.38 * Math.cos(theta), 0.38 * Math.sin(theta), 0];
    const outer = [(1.45 + phase * 0.18) * Math.cos(theta), (1.45 + phase * 0.18) * Math.sin(theta), 0];
    items.push(arrow(inner, outer, index % 3 === phase ? accent : measured, 2), arrow([-inner[0], -inner[1], 0], [-outer[0], -outer[1], 0], index % 3 === phase ? accent : measured, 2));
  }
  return field(items);
}

function covariance(description, phase, [accent, measured, pale]) {
  const items = [];
  for (let row = 0; row < 6; row += 1) for (let col = 0; col < 6; col += 1) items.push(rect(0.45, 0.42, [-2.45 + col * 0.47, 1.12 - row * 0.44, 0], measured, [pale, measured, accent][(Math.abs(row - col) + phase) % 3], 0.78));
  const values = [0.45, 0.9, 1.4, 0.72, 1.1, 0.58];
  items.push(...values.map((width, index) => rect(width, 0.28, [0.55 + width / 2, 1.05 - index * 0.46, 0], measured, index === phase ? accent : pale, 0.82)), arrow([-0.05, 0.05, 0], [0.45, 0.05, 0], accent));
  return field(items);
}

function sixComparison(description, phase, [accent, measured, pale]) {
  const items = [];
  for (let index = 0; index < 6; index += 1) {
    const x = -2.75 + index * 1.1;
    items.push(rect(0.82, 1.55, [x, 0.25, 0], measured, index === phase || (phase === 2 && index === 0) ? accent : pale, 0.58), circle(0.22, [x, 0.55, 0], measured, 2), dot([x, -0.15 + (index % 3) * 0.18, 0], index === 0 ? accent : measured, 0.1), rect(0.54, 0.16 + (5 - index) * 0.08, [x, -1.05, 0], measured, index === phase ? accent : pale, 0.8));
  }
  return field(items);
}

function stormBins(description, phase, [accent, measured, pale]) {
  const track = [[-3, -0.8], [-2.2, -0.25], [-1.25, 0.05], [-0.2, 0.65], [0.85, 1.0], [1.8, 0.45], [2.8, -0.45]];
  const items = [...track.slice(0, -1).flatMap((point, index) => [line([...point, 0], [...track[index + 1], 0], index % 3 === phase ? accent : measured, 5), dot([...point, 0], index % 3 === phase ? accent : measured, 0.1)]), ...[0, 1, 2].map((index) => rect(1.65, 0.28 + index * 0.22, [-1.9 + index * 1.9, -1.45, 0], measured, index === phase ? accent : pale, 0.78))];
  return field(items);
}

function transformPanels(description, phase, [accent, measured, pale]) {
  const sensitivity = /sensitivity|\bpsf\b|\bnsf\b|dimensionless-time cursor/i.test(description);
  const items = [rect(2.75, 2.75, [-1.75, 0, 0], measured, pale, 0.45), rect(2.75, 2.75, [1.55, 0, 0], measured, "#F8E3D8", 0.45), line([-2.85, -0.95, 0], [-0.65, -0.95, 0], measured, 2), line([0.45, -0.95, 0], [2.65, -0.95, 0], measured, 2), ...plot([[-2.75, -0.75], [-2.2, 0.45], [-1.65, -0.25], [-1.1, 0.75], [-0.7, -0.15]], phase === 0 ? accent : measured, 4), ...plot([[0.55, -0.75], [1.05, 0.1], [1.55, 0.72], [2.05, 0.25], [2.55, 0.95]], phase === 2 ? accent : measured, 4), arrow([-0.25, 0, 0], [0.25, 0, 0], accent, 4)];
  if (sensitivity) items.push(line([-2.35 + phase * 0.55, -1.15, 0], [-2.35 + phase * 0.55, 1.15, 0], accent, 3), line([0.95 + phase * 0.55, -1.15, 0], [0.95 + phase * 0.55, 1.15, 0], accent, 3), dot([-1.75, 1.05, 0], accent, 0.11), circle(0.13, [1.55, 1.05, 0], measured, 3));
  else items.push(...[-2.55, -2.05, -1.55, -1.05].map((x, index) => line([x, 0.85 - index * 0.12, 0], [x + 0.3, 1.15 - index * 0.12, 0], accent, 3)), ...[0.65, 1.15, 1.65, 2.15].map((x, index) => circle(0.08 + index * 0.025, [x, 1.05, 0], measured, 2)));
  return field(items);
}

function radial(description, phase, [accent, measured, pale]) {
  const thermal = /thermal|temperature|ates|inject|extract/i.test(description);
  const direction = phase === 1 ? 0 : phase === 0 ? 1 : -1;
  const items = [...[0.55, 1.15, 1.8, 2.45].map((radius, index) => circle(radius, [0, 0, 0], index === phase + 1 ? accent : measured, index === phase + 1 ? 5 : 2)), rect(0.34, 3.4, [0, 0, 0], accent, "#FFFFFF", 0.9), line([0, 1.7, 0], [0, -1.7, 0], accent, 5)];
  if (direction === 0) items.push(circle(0.32, [0, 0, 0], accent, 5));
  else for (const y of [-0.75, 0, 0.75]) items.push(arrow([direction * 2.55, y, 0], [direction * 0.35, y, 0], accent));
  if (/skin|annul|ring/i.test(description)) items.push(circle(0.72, [0, 0, 0], accent, 6));
  if (thermal) items.push(circle(1.35 + phase * 0.22, [0, 0, 0], phase === 2 ? accent : "#D98255", 7));
  return field(items);
}

function column(description, phase, [accent, measured, pale]) {
  const items = [rect(3.2, 4.5, [-0.75, 0, 0], measured, pale, 0.75), ...[-1.2, -0.3, 0.6, 1.5].map((y, index) => line([-2.35, y, 0], [0.85, y, 0], index === phase ? accent : measured, index === phase ? 4 : 2)), ...Array.from({ length: 7 }, (_, index) => dot([-2.1 + (index % 3) * 1.05, -1.65 + Math.floor(index / 3) * 1.35, 0], index % 2 ? measured : accent, 0.09)), ...plot([[1.45, 1.7], [2.75, 1.25 - phase * 0.35], [3.1, 0.1 - phase * 0.25], [2.45, -1.55]], accent, 3)];
  if (/rain|recharge|infiltrat|lysimeter/i.test(description)) for (const x of [-1.9, -0.8, 0.3]) items.push(arrow([x, 2.9, 0], [x, 2.15, 0], measured));
  if (/landfill|geomembrane|liner|leachate/i.test(description)) items.push(rect(3.5, 0.22, [-0.75, 2.15, 0], accent, "#D98255", 0.85));
  return field(items);
}

function forecast(description, phase, [accent, measured, pale]) {
  const track = [[-2.8, -1.3], [-2.1, -0.7], [-1.15, -0.25], [-0.25, 0.2], [0.7, 0.8], [1.8, 1.2]];
  return field([polygon([[-3.2, 1.5, 0], [-1.4, 1.9, 0], [0.2, 1.45, 0], [2.8, 1.75, 0], [3.15, -1.25, 0], [0.7, -1.65, 0], [-1.8, -1.35, 0]], measured, pale, 0.55), ...plot(track, accent, 4), ...track.map(([x, y], index) => dot([x, y, 0], index <= phase + 2 ? accent : measured, 0.11)), arrow([1.8, -1.05, 0], [3.05, -1.05, 0], accent), ...[0.55, 0.9, 1.25].map((height, index) => rect(0.42, height + phase * 0.08, [1.9 + index * 0.55, -1.65 + height / 2, 0], measured, index === phase ? accent : pale, 0.8))]);
}

export function specializedVisualExpression(description, phase, palette) {
  const text = String(description ?? "");
  if (/control strip|flux samples|flux arrows|flux-divergence|storage term|darcy gradient/i.test(text)) return controlStrip(text, phase, palette);
  if (/head traces?.*jump|continuous.*annul|radial brace|annular skin thickness|s_w|s_skin|wellbore and skin sides|drawdown value attached/i.test(text)) return annulusInterface(text, phase, palette);
  if (/outer-boundary|outer boundary|remote robin|remote boundary ring|finite radial aquifer|finite two-zone aquifer|aquifer disk.*boundary/i.test(text)) return radialBoundary(text, phase, palette);
  if (/zhengzhou.*alabama|two-site btc|each site's observed breakthrough/i.test(text)) return twoSiteBtc(text, phase, palette);
  if (/beta-m|r-squared ridge|r2 ridge|vertical slice.*fit surface|conditional beta|site maximum/i.test(text)) return responseSurface(text, phase, palette);
  if (/paired radial temperature plumes|paired plume|plumes linked.*breakthrough|temperature distributions?.*btc/i.test(text)) return pairedPlumeBtc(text, phase, palette);
  if (/\bnltd\b|\bltd\b|injected and recovered heat|recovered heat areas|eta against|recovery area/i.test(text)) return transportPanels(text, phase, palette);
  if (/coherent.*fragmented|pixel-attribution|permute cells|fragmented pixel/i.test(text)) return pixelField(text, phase, palette);
  if (/coalition tree|ensemble forests?|six parallel ensemble|feature coalitions/i.test(text)) return treeField(text, phase, palette);
  if (/\blat\b.*\blon\b|geo magnitude|magnitude ring|geo.*feature.*sensitiv|overlap between geo/i.test(text)) return geoGeometry(text, phase, palette);
  if (/directional probes?|gaussian directions|direction arrows radiating|matrix of directional response/i.test(text)) return directionalProbes(text, phase, palette);
  if (/covariance heatmap|covariance matrix|gradient-covariance|matrix row.*attribution|attribution bar formed.*covariance/i.test(text)) return covariance(text, phase, palette);
  if (/six (?:geo maps|mae markers|test-error bars|model)|six model-specific|pattern-correlation marker/i.test(text)) return sixComparison(text, phase, palette);
  if (/storm lifecycle|storm track separating|intensity bins|jtwc category|track attribution|genesis.*mature.*decay/i.test(text)) return stormBins(text, phase, palette);
  if (/laplace|fourier|sensitivity panel|\bpsf\b|\bnsf\b|transform panel/i.test(text)) return transformPanels(text, phase, palette);
  if (/forecast|intensity-change|typhoon|storm track|cyclone|western north pacific/i.test(text)) return forecast(text, phase, palette);
  if (/soil column|porous column|lysimeter|infiltration tank|geomembrane|soil liner|thermometer string/i.test(text)) return column(text, phase, palette);
  if (/radial|concentric|annul|axisymmetric|aquifer disk|hollow cylinder|inject-rest-extract/i.test(text)) return radial(text, phase, palette);
  return null;
}
