const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (point, color, radius = 0.08) => `Dot(${q(point)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, point, stroke, fill, opacity = 0.12, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const ellipse = (width, height, point, stroke, fill, opacity = 0.12) => `Ellipse(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const rect = (width, height, point, stroke, fill, opacity = 0.18) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const math = (latex, point, color, size = 23) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${q(point)})`;
const axes = (point, color, width = 2.7, height = 1.8) => `Axes(x_range=[0, 6, 2], y_range=[0, 3, 1], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}}).shift(${q(point)})`;
const curve = (points, color, width = 4) => points.slice(0, -1).map((point, index) => line([...point, 0], [...points[index + 1], 0], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;
const well = ([x, y], color, pale) => [circle(0.17, [x, y, 0], color, pale, 0.35, 4), line([x, y - 0.24, 0], [x, y + 0.24, 0], color, 4)];
const bars = (heights, x0, y0, color, pale, width = 0.34) => heights.map((height, index) => rect(width, height, [x0 + index * (width + 0.14), y0 + height / 2, 0], color, pale, 0.55));
const hydrograph = (x0, y0, scale = 1) => [[x0, y0], [x0 + 0.45, y0 - 0.18 * scale], [x0 + 0.9, y0 - 0.62 * scale], [x0 + 1.35, y0 - 0.42 * scale], [x0 + 1.8, y0 - 1.0 * scale], [x0 + 2.25, y0 - 0.78 * scale], [x0 + 2.7, y0 - 1.18 * scale]];

function scene01(p, [a, m, pale]) {
  const sources = [[-2.65, 0.8], [-2.25, -0.55], [-1.35, 0.35]];
  const items = [...well([-0.65, 0.15], a, pale), ...sources.flatMap((xy) => well(xy, m, pale))];
  if (p < 2) items.push(...sources.flatMap((xy, i) => [line([xy[0], xy[1], 0], [-0.65, 0.15, 0], pale, 2), math(`Q_${i + 1},r_${i + 1}`, [xy[0], xy[1] + 0.38, 0], m, 18)]));
  if (p >= 1) items.push(axes([1.55, 0.15, 0], m, 3.0, 2.1), ...curve(hydrograph(0.15, 1.05), a, 4));
  if (p === 2) items.push(...sources.map((xy) => math("?", [xy[0], xy[1] + 0.38, 0], a, 25)), math(String.raw`s_{obs}(t)`, [2.45, -1.25, 0], a));
  return field(items);
}

function scene02(p, [a, m, pale]) {
  const radii = [0.65, 1.15, 1.65];
  const items = [...well([-2.1, 0, 0], a, pale), ...radii.slice(0, p + 1).map((r) => circle(r, [-2.1, 0, 0], m, pale, 0.04, 2))];
  const kernels = [[[0.2, 1.0], [0.7, 0.2], [1.25, -0.15], [2.7, -0.35]], [[0.2, 0.65], [0.7, 0.2], [1.25, -0.25], [2.7, -0.55]], [[0.2, 0.3], [0.7, 0.05], [1.25, -0.35], [2.7, -0.72]]];
  items.push(...well([-2.1 + radii[p], 0, 0], m, pale), arrow([-2.1, -1.8, 0], [-2.1 + radii[p], -1.8, 0], a), math(`r_${p + 1}`, [-2.1 + radii[p] / 2, -1.5, 0], a));
  if (p >= 1) items.push(axes([1.45, -0.05, 0], m, 3.2, 2.1), ...kernels.slice(0, p + 1).flatMap((points, i) => curve(points, i === p ? a : m, i === p ? 5 : 2)), math(String.raw`g(r,t)`, [2.45, 1.25, 0], a));
  return field(items);
}

function scene03(p, [a, m, pale]) {
  const points = [[-2.4, 0.9], [-1.7, 0.55], [-1.1, 1.0], [-2.55, -0.2], [-1.55, -0.45], [-0.8, 0.05], [-2.2, -1.0], [-0.95, -0.9], [-1.95, 0.05], [-1.25, 0.3], [-2.65, 0.35], [-1.0, -0.3], [-2.0, 1.2], [-1.55, -1.15], [-0.65, 0.7], [-2.75, -0.75], [-1.15, 0.75], [-2.3, -0.55]];
  const count = [6, 12, 18][p];
  return field([circle(1.65, [-1.7, 0, 0], m, pale, 0.16), ...well([-1.7, 0], a, pale), ...points.slice(0, count).map((xy) => dot([...xy, 0], m, 0.07)), rect(1.65, 1.65, [1.55, 0, 0], m, pale, 0.12), line([0.72, -0.65, 0], [0.72, -0.65 + 0.55 * (p + 1), 0], a, 12), math(String.raw`N/A`, [1.55, -1.15, 0], a), math(String.raw`R_e`, [-0.25, -1.1, 0], a)]);
}

function scene04(p, [a, m, pale]) {
  const items = [axes([-2.25, -0.3, 0], m, 2.15, 1.65), ...bars([0.55, 0.95, 0.35, 0.8], -3.15, -1.12, a, pale), math(String.raw`Q(t)`, [-2.25, 1.0, 0], a)];
  if (p >= 1) items.push(arrow([-1.1, 0, 0], [-0.42, 0, 0], a), ...curve([[-0.3, 0.95], [0.05, 0.15], [0.48, -0.2], [0.9, -0.34]], m, 4), math(String.raw`g(r,t)`, [0.3, 1.15, 0], m));
  if (p === 2) items.push(arrow([1.0, 0, 0], [1.45, 0, 0], a), axes([2.2, -0.3, 0], m, 2.0, 1.65), ...curve(hydrograph(1.25, 0.75, 0.75), a, 5), math(String.raw`s(t)`, [2.45, 1.0, 0], a));
  return field(items);
}

function scene05(p, [a, m, pale]) {
  const rings = [0.45, 0.85, 1.25, 1.65].slice(0, p + 2);
  const items = [circle(1.7, [-1.8, 0, 0], m, pale, 0.1), ...rings.map((r, i) => circle(r, [-1.8, 0, 0], i === rings.length - 1 ? a : m, pale, 0.02, 2)), ...well([-1.8, 0], a, pale)];
  if (p >= 1) items.push(...rings.map((r, i) => arrow([-1.8 + r, 0.25 * (i - 1), 0], [0.15, 0.15 * (i - 1), 0], i === rings.length - 1 ? a : m, 2)));
  if (p === 2) items.push(axes([1.7, -0.15, 0], m, 2.7, 1.9), ...curve([[0.4, 0.95], [0.75, 0.28], [1.2, -0.1], [1.75, -0.35], [2.75, -0.55]], a, 5), math(String.raw`g_e(t)`, [2.35, 1.15, 0], a), math(String.raw`R_e`, [-0.25, -1.1, 0], m));
  return field(items);
}

function scene06(p, [a, m, pale]) {
  const impulse = [[-2.8, -0.65], [-2.3, 1.05], [-1.9, 0.15], [-1.35, -0.35], [-0.65, -0.55]];
  const unit = [[0.35, -0.8], [0.8, -0.22], [1.35, 0.18], [1.95, 0.48], [2.65, 0.65]];
  const items = [axes([-1.7, -0.15, 0], m, 2.8, 2.0), ...curve(impulse.slice(0, 3 + p), a, 4), math(String.raw`g_e(t)`, [-1.35, 1.2, 0], a)];
  if (p >= 1) items.push(arrow([-0.3, 0, 0], [0.25, 0, 0], a), math(String.raw`\int dt`, [0, 0.4, 0], a, 21));
  if (p === 2) items.push(axes([1.7, -0.15, 0], m, 2.8, 2.0), ...curve(unit, a, 5), math(String.raw`u_e(t)`, [2.3, 1.2, 0], a));
  return field(items);
}

function scene07(p, [a, m, pale]) {
  const draw = [[-3.0, 0.95], [-2.35, 0.62], [-1.8, 0.05], [-1.15, -0.2], [-0.55, -0.82]];
  const items = [axes([-1.8, -0.2, 0], m, 3.0, 2.1), ...curve(draw, a, 5), ...draw.slice(1, p + 3).map((xy) => line([xy[0], xy[1], 0], [xy[0], -1.15, 0], m, 2)), math(String.raw`\Delta s`, [-2.55, 1.25, 0], a)];
  if (p >= 1) items.push(arrow([-0.2, 0, 0], [0.45, 0, 0], a), math(String.raw`u_e(t)`, [0.1, 0.42, 0], m, 20));
  if (p === 2) items.push(axes([1.85, -0.2, 0], m, 2.65, 2.1), ...bars([0.45, 0.95, 0.6, 0.3], 0.75, -1.15, a, pale, 0.4), math(String.raw`Q_e(t)`, [2.35, 1.25, 0], a));
  return field(items);
}

function scene08(p, [a, m, pale]) {
  const model = [[-2.8, 0.85], [-2.1, 0.55], [-1.4, 0.2], [-0.7, -0.1], [0.1, -0.42], [0.8, -0.62]];
  const observed = model.map(([x, y], i) => [x, y + [0.22, -0.18, 0.14, -0.24, 0.2, -0.12][i]]);
  const n = [2, 4, 6][p];
  const items = [axes([-1.1, -0.1, 0], m, 4.3, 2.2), ...curve(model, m, 4), ...observed.map((xy) => dot([...xy, 0], a, 0.09)), ...observed.slice(0, n).map((xy, i) => line([xy[0], xy[1], 0], [model[i][0], model[i][1], 0], a, 3))];
  if (p >= 1) items.push(...observed.slice(0, n).map((xy, i) => math(String.raw`e_${i + 1}^2`, [xy[0], 1.25 - 0.2 * (i % 2), 0], a, 16)));
  if (p === 2) items.push(rect(1.35, 0.72, [2.15, 0.1, 0], a, pale, 0.25), math(String.raw`\sum_i e_i^2`, [2.15, 0.1, 0], a, 26));
  return field(items);
}

function scene09(p, [a, m, pale]) {
  const labels = [String.raw`\log_{10}S`, String.raw`\log_{10}Q_e`, String.raw`\log_{10}R_e`];
  const items = [line([-2.6, -1.0, 0], [2.55, -1.0, 0], m, 3), ...labels.map((label, i) => math(label, [-1.75 + i * 1.75, -1.35, 0], i <= p ? a : m, 20))];
  labels.slice(0, p + 1).forEach((_, i) => items.push(line([-1.75 + i * 1.75, -1.0, 0], [-1.75 + i * 1.75, 0.95, 0], i === p ? a : m, 3), dot([-1.75 + i * 1.75, 0.2 + 0.28 * i, 0], a, 0.11), rect(1.15, 0.5, [-1.75 + i * 1.75, 1.22, 0], a, pale, 0.15)));
  return field(items);
}

function scene10(p, [a, m, pale]) {
  const items = [ellipse(4.8, 1.25, [-0.35, 0, 0], m, pale, 0.12), math(String.raw`T`, [-2.9, -1.15, 0], m), math(String.raw`S`, [2.55, -1.15, 0], m), ...[[-2.0, 0.4], [-1.1, 0.2], [-0.2, 0], [0.7, -0.2], [1.6, -0.4]].map((xy) => dot([...xy, 0], m, 0.07))];
  if (p >= 1) items.push(rect(0.75, 2.75, [-0.2, 0, 0], a, pale, 0.24), math(String.raw`T_{target}`, [-0.2, 1.55, 0], a, 20));
  if (p === 2) items.push(circle(0.25, [-0.2, 0, 0], a, pale, 0.28, 5), dot([-0.2, 0, 0], a, 0.12), math(String.raw`S^*`, [0.35, 0.45, 0], a));
  return field(items);
}

function scene11(p, [a, m, pale]) {
  const populations = [[[-2.4, 1.0], [-1.8, -0.7], [0.5, 1.1], [2.1, -0.6], [1.4, 0.55]], [[-1.3, 0.7], [-0.8, -0.35], [0.3, 0.5], [1.15, -0.25], [0.65, 0.1]], [[-0.55, 0.3], [-0.25, -0.2], [0.15, 0.18], [0.45, -0.12], [0.05, 0.02]]];
  return field([ellipse(5.2, 2.7, [0, 0, 0], m, pale, 0.08), ellipse(3.2, 1.7, [0, 0, 0], m, pale, 0.08), ellipse(1.35, 0.72, [0, 0, 0], a, pale, 0.16), ...populations[p].map((xy, i) => dot([...xy, 0], i === 4 ? a : m, 0.1)), ...populations[p].slice(0, p + 2).map((xy) => arrow([xy[0], xy[1], 0], [0, 0, 0], a, 2)), math(String.raw`\min\sum e_i^2`, [0, 1.65, 0], a, 24)]);
}

function scene12(p, [a, m, pale]) {
  const candidates = [[-1.8, 0.85], [-1.15, -0.55], [-0.35, 0.35], [0.55, -0.2], [1.35, 0.55]];
  const items = [ellipse(4.8, 2.35, [-0.5, 0, 0], m, pale, 0.08), ...candidates.map((xy) => dot([...xy, 0], m, 0.09))];
  if (p >= 1) items.push(circle(0.3, [-0.35, 0.35, 0], a, pale, 0.25, 5), arrow([1.4, 1.15, 0], [-0.1, 0.52, 0], a));
  if (p === 2) items.push(rect(1.45, 1.9, [2.15, 0, 0], a, pale, 0.2), math(String.raw`S^*`, [2.15, 0.55, 0], a), math(String.raw`Q_e^*`, [2.15, 0, 0], a), math(String.raw`R_e^*`, [2.15, -0.55, 0], a));
  return field(items);
}

function scene13(p, [a, m, pale]) {
  const items = [...well([-2.65, 0.85], m, pale), ...well([-2.65, 0], m, pale), ...well([-2.65, -0.85], m, pale), ...well([-1.65, 0], a, pale), math(String.raw`Q_1,Q_2,Q_3\;\mathrm{known}`, [-2.15, 1.55, 0], a, 19), ...bars([0.45, 0.75, 0.35, 0.65], -1.15, -1.32, a, pale, 0.3)];
  if (p >= 1) items.push(...[0.85, 0, -0.85].map((y) => arrow([-2.42, y, 0], [-1.85, 0.12 * y, 0], m, 2)), arrow([0.55, -0.1, 0], [1.05, -0.1, 0], a), math(String.raw`\mathrm{Theis\ superposition}`, [0.5, 0.45, 0], m, 18));
  if (p === 2) { const points = hydrograph(1.0, 0.95, 0.8); items.push(axes([2.0, -0.1, 0], m, 2.2, 2.0), ...points.map((xy) => dot([...xy, 0], a, 0.08)), math(String.raw`s_{exact}(t_i)`, [2.35, 1.35, 0], a, 20)); }
  return field(items);
}

function scene14(p, [a, m, pale]) {
  const points = hydrograph(-3.0, 0.85, 0.78);
  const items = [axes([-1.85, -0.1, 0], m, 2.7, 2.0), ...points.map((xy) => dot([...xy, 0], a, 0.075))];
  if (p >= 1) items.push(arrow([-0.3, 0, 0], [0.25, 0, 0], a), rect(1.25, 0.62, [0.9, 0.55, 0], m, pale, 0.2), math(String.raw`\mathrm{EURF}`, [0.9, 0.55, 0], m, 19), rect(1.25, 0.62, [0.9, -0.55, 0], a, pale, 0.2), math(String.raw`\mathrm{DE}`, [0.9, -0.55, 0], a, 20), arrow([0.9, 0.22, 0], [0.9, -0.22, 0], a));
  if (p === 2) items.push(...curve(points.map(([x, y]) => [x, y + 0.04]), m, 4), arrow([1.58, 0, 0], [1.95, 0, 0], a), rect(1.15, 1.85, [2.55, 0, 0], a, pale, 0.2), math(String.raw`S`, [2.55, 0.55, 0], a), math(String.raw`Q_e`, [2.55, 0, 0], a), math(String.raw`R_e`, [2.55, -0.55, 0], a));
  return field(items);
}

function scene15(p, [a, m, pale]) {
  const errors = [[-2.5, 0.55, -0.05], [-1.75, 0.1, -0.35], [-1.0, 0.4, 0.0], [-0.25, -0.1, -0.5]];
  const n = [2, 3, 4][p];
  const items = [line([-2.9, -0.25, 0], [0.15, -0.25, 0], m, 2), ...errors.slice(0, n).flatMap(([x, y1, y2], i) => [line([x, y1, 0], [x, y2, 0], a, 4), dot([x, y1, 0], a), math(String.raw`e_${i + 1}^2`, [x, 0.95, 0], a, 17)])];
  if (p >= 1) items.push(arrow([0.35, 0, 0], [0.95, 0, 0], a), rect(2.15, 1.65, [2.0, 0, 0], m, pale, 0.12), line([1.15, -0.65, 0], [1.15 + 0.6 * p, -0.65 + 0.95 * p, 0], a, 10), math(String.raw`SEE`, [2.0, 1.1, 0], a, 26));
  return field(items);
}

function scene16(p, [a, m, pale]) {
  const signed = [-0.62, 0.4, -0.28, 0.65, -0.18];
  const n = [2, 4, 5][p];
  const items = [line([-2.9, 0, 0], [0.1, 0, 0], m, 3), ...signed.slice(0, n).map((value, i) => line([-2.55 + i * 0.58, 0, 0], [-2.55 + i * 0.58, value, 0], value > 0 ? a : m, 5)), math(String.raw`+e_i`, [-2.55, 1.0, 0], a), math(String.raw`-e_i`, [-2.55, -1.0, 0], m)];
  if (p >= 1) items.push(arrow([0.3, 0, 0], [0.9, 0, 0], a), line([1.2, 0, 0], [2.9, 0, 0], m, 4), circle(0.65, [2.05, 0, 0], a, pale, 0.1, 3), line([2.05, 0, 0], [2.05 + 0.5 * (p - 1), 0.45 * (p - 1), 0], a, 5), math(String.raw`ME`, [2.05, 1.05, 0], a, 26));
  return field(items);
}

function scene17(p, [a, m, pale]) {
  const radii = [0.35, 0.65, 1.0, 1.35, 1.7];
  const labels = ["200", "500", "1000", "1500", "2000"];
  const n = [2, 4, 5][p];
  const items = [...well([-1.75, 0], a, pale), ...radii.slice(0, n).map((r, i) => circle(r, [-1.75, 0, 0], i === n - 1 ? a : m, pale, 0.02, 2)), ...well([-1.75 + radii[n - 1], 0], m, pale), ...labels.slice(0, n).map((label, i) => math(label, [-1.75 + radii[i], -1.25 - 0.12 * (i % 2), 0], i === n - 1 ? a : m, 14))];
  if (p === 2) items.push(rect(2.0, 2.5, [1.75, 0, 0], m, pale, 0.1), math(String.raw`S:\ \mathrm{stable}`, [1.75, 0.75, 0], a, 20), math(String.raw`Q_e:\ 100.66\to133.81`, [1.75, 0.05, 0], m, 17), math(String.raw`R_e\uparrow`, [1.75, -0.65, 0], m, 21), math(String.raw`\mathrm{m}`, [-0.05, -1.55, 0], m, 15));
  return field(items);
}

function scene18(p, [a, m, pale]) {
  const cases = [[[200, 500, 1000]], [[200, 500, 1000], [500, 1000, 1500]], [[200, 500, 1000], [500, 1000, 1500], [1000, 1500, 2000]]][p];
  const items = [];
  cases.forEach((distances, row) => { const y = 0.9 - row * 0.9; items.push(...well([-2.65, y], a, pale), ...distances.flatMap((distance, i) => [...well([-1.85 + i * 0.7, y], m, pale), math(String(distance), [-1.85 + i * 0.7, y + 0.34, 0], m, 13)]), math(String.raw`3\times100`, [0.4, y, 0], a, 18)); });
  items.push(arrow([0.85, 0, 0], [1.35, 0, 0], a), rect(1.65, 2.4, [2.2, 0, 0], m, pale, 0.1), math(String.raw`Q_{target}=300`, [2.2, 0.7, 0], a, 19), math(p === 2 ? String.raw`\mathrm{far\ case:}\ Q_e\uparrow` : String.raw`Q_e\approx Q_{target}`, [2.2, -0.15, 0], p === 2 ? m : a, 17), math(String.raw`\mathrm{m^3h^{-1}}`, [2.2, -0.8, 0], m, 15));
  return field(items);
}

function scene19(p, [a, m, pale]) {
  const ratios = [0.1, 0.5, 1, 5, 10];
  const n = [2, 4, 5][p];
  const items = ratios.slice(0, n).flatMap((ratio, i) => { const x = -2.7 + i * 1.25; const width = ratio < 1 ? 0.65 : ratio === 1 ? 0.9 : 1.15; const height = ratio < 1 ? 1.15 : ratio === 1 ? 0.9 : 0.65; return [ellipse(width, height, [x, 0.2, 0], i === n - 1 ? a : m, pale, 0.18), ...well([x, 0.2], a, pale), math(String(ratio), [x, -0.75, 0], i === n - 1 ? a : m, 16)]; });
  items.push(math(String.raw`T_x/T_y`, [-2.7, 1.2, 0], a, 19));
  if (p === 2) items.push(line([-2.7, -1.25, 0], [2.5, -1.25, 0], m, 2), arrow([0.6, -1.25, 0], [2.45, -1.25, 0], a), math(String.raw`Q_e\ \mathrm{bias}`, [1.55, -1.55, 0], a, 18));
  return field(items);
}

function scene20(p, [a, m, pale]) {
  const items = [];
  for (let i = -2; i <= 2; i += 1) { items.push(line([-2.2, i * 0.55, 0], [2.2, i * 0.55, 0], m, 2), line([i * 0.9, -1.1, 0], [i * 0.9, 1.1, 0], m, 2)); }
  const paths = [[[-1.8, -0.55], [-0.9, -0.55], [-0.9, 0]], [[-0.9, 0], [0, 0], [0, 0.55]], [[0, 0.55], [0.9, 0.55], [0.9, 1.1]]];
  items.push(...paths.slice(0, p + 1).flatMap((path, i) => [...curve(path, i === p ? a : m, 5), ...path.map((xy) => dot([...xy, 0], i === p ? a : m, 0.08))]), math(String.raw`P_k+\Delta_k`, [2.35, 1.45, 0], a, 20), math(String.raw`t=24\,h`, [-2.35, 1.45, 0], m, 18));
  return field(items);
}

function scene21(p, [a, m, pale]) {
  const cloud = [[-2.7, 0.8], [-2.3, 0.2], [-1.85, 0.6], [-1.45, -0.35], [-1.0, 0.05], [-0.55, -0.65]];
  const items = [axes([-1.6, -0.1, 0], m, 3.0, 2.15), ...cloud.slice(0, 6 - p).map((xy) => dot([...xy, 0], a, 0.08)), ...cloud.slice(0, 3 + p).map((xy) => line([xy[0], xy[1], 0], [-1.6, 0, 0], pale, 2))];
  if (p >= 1) {
    const labels = [String.raw`T`, String.raw`S`, String.raw`Q_e`, String.raw`R_e`];
    const magnitudes = [0.5, 1.0, 0.86, 0.62];
    const spreads = [0.22, 0.58, 0.72, 0.36];
    const count = p === 1 ? 2 : 4;
    items.push(arrow([0.05, 0, 0], [0.45, 0, 0], a), math(String.raw`\mu^*`, [1.2, 1.28, 0], a, 20), math(String.raw`\sigma`, [2.25, 1.28, 0], m, 20));
    labels.slice(0, count).forEach((label, i) => { const x = 0.75 + i * 0.65; items.push(rect(0.22, magnitudes[i], [x - 0.12, -0.9 + magnitudes[i] / 2, 0], a, pale, 0.5), rect(0.22, spreads[i], [x + 0.14, -0.9 + spreads[i] / 2, 0], m, pale, 0.5), math(label, [x, -1.2, 0], i === count - 1 ? a : m, 16)); });
  }
  return field(items);
}

function scene22(p, [a, m, pale]) {
  const long = [[-3.0, 0.8], [-2.4, 0.55], [-1.8, 0.75], [-1.2, 0.1], [-0.6, -0.25], [0, -0.05], [0.6, -0.8], [1.2, -0.55], [1.8, -1.0], [2.7, -0.75]];
  const items = [axes([0, -0.1, 0], m, 5.8, 2.2), ...curve(long, a, 4)];
  if (p === 0) items.push(...[-2.35, 1.55].map((x) => [line([x, 1.25, 0], [x, 0.85, 0], m, 2), math(String.raw`\mathrm{rain}`, [x, 1.48, 0], m, 15)]).flat(), math(String.raw`\mathrm{irrigation}`, [0.2, 1.48, 0], m, 15));
  if (p >= 1) items.push(rect(2.0, 2.25, [0.55, -0.05, 0], a, pale, 0.12), line([-0.45, -1.3, 0], [-0.45, 1.2, 0], a, 3), line([1.55, -1.3, 0], [1.55, 1.2, 0], a, 3), math(String.raw`\mathrm{few\ days}`, [0.55, 1.45, 0], a, 19));
  if (p === 2) items.push(...bars([0.35, 0.75, 0.48], -0.15, -1.2, a, pale, 0.32), math(String.raw`\mathrm{no\ rain\ or\ large\ irrigation}`, [0.55, -1.62, 0], a, 16));
  return field(items);
}

function scene23(p, [a, m, pale]) {
  const points = [[-2.2, 0.8], [-1.6, 0.55], [-1.05, 0.95], [-2.35, 0], [-1.5, -0.2], [-0.8, 0.1], [-2.1, -0.75], [-1.2, -0.85], [-1.8, 0.1], [-1.0, 0.45], [-2.55, 0.35], [-0.75, -0.45], [-1.9, 1.15], [-1.5, -1.1], [-0.55, 0.7], [-2.5, -0.65], [-0.9, -0.05], [-2.3, -0.25]];
  const n = [6, 12, 18][p];
  return field([circle(1.55, [-1.55, 0, 0], m, pale, 0.12), ...well([-1.55, 0], a, pale), ...points.slice(0, n).map((xy) => dot([...xy, 0], m, 0.065)), rect(1.8, 2.2, [1.75, 0, 0], m, pale, 0.1), line([0.95, -0.85, 0], [0.95 + 0.35 * (p + 1), -0.85 + 0.55 * (p + 1), 0], a, 9), math(String.raw`>210\ \mathrm{wells/km^2}`, [1.75, 1.25, 0], a, 18), math(String.raw`\mathrm{density}`, [1.75, -1.25, 0], m, 19)]);
}

function scene24(p, [a, m, pale]) {
  const groups = [[[-1.55, 0.35], [-1.35, -0.1], [-1.75, -0.3]], [[-2.25, 0.75], [-0.7, -0.65], [-2.0, -0.9]], [[-3.0, 0.9], [-0.05, -0.8], [-2.9, -1.0]]];
  const labels = [String.raw`\mathrm{too\ close}`, String.raw`\mathrm{representative}`, String.raw`\mathrm{too\ far}`];
  return field([ellipse(2.6 + p * 0.9, 2.4 - p * 0.25, [-1.55, 0, 0], p === 1 ? a : m, pale, 0.12), ...well([-1.55, 0], a, pale), ...groups[p].flatMap((xy) => well(xy, m, pale)), math(labels[p], [-1.55, 1.55, 0], p === 1 ? a : m, 20), arrow([0.7, 0, 0], [1.25, 0, 0], a), rect(1.8, 1.65, [2.15, 0, 0], m, pale, 0.1), math(p === 0 ? String.raw`S\downarrow` : p === 1 ? String.raw`S\ \mathrm{stable}` : String.raw`S\uparrow`, [2.15, 0.45, 0], p === 1 ? a : m, 21), math(String.raw`Q_e,R_e`, [2.15, -0.45, 0], a, 20)]);
}

function scene25(p, [a, m, pale]) {
  const ratios = [1, 5, 10];
  const dimensions = [[2.5, 2.5], [3.45, 1.8], [4.2, 1.35]][p];
  const items = [ellipse(dimensions[0], dimensions[1], [-1.4, 0, 0], p === 0 ? m : a, pale, 0.16), ...well([-1.4, 0], a, pale), ...[[-2.0, 0.45], [-0.75, -0.35], [-1.85, -0.65]].flatMap((xy) => well(xy, m, pale)), math(`T_x/T_y=${ratios[p]}`, [-1.4, 1.55, 0], p === 0 ? m : a, 20), math(String.raw`0.1\quad0.5\quad1\quad5\quad10`, [-1.4, -1.55, 0], m, 15)];
  if (p >= 1) items.push(arrow([0.75, 0, 0], [1.2, 0, 0], a), rect(1.85, 2.1, [2.15, 0, 0], m, pale, 0.1), line([1.45, -0.75, 0], [1.45 + 0.55 * (2 - p), -0.75 + 0.45 * (2 - p), 0], a, 9), math(String.raw`Q_e\ \mathrm{sensitivity}\downarrow`, [2.15, 0.85, 0], a, 17), math(String.raw`Q_e\ \mathrm{biased}`, [2.15, -1.05, 0], m, 18));
  return field(items);
}

function scene26(p, [a, m, pale]) {
  const items = [ellipse(4.6, 1.1, [-0.55, 0, 0], m, pale, 0.1), math(String.raw`T`, [-2.85, -1.05, 0], m), math(String.raw`S`, [1.85, -1.05, 0], m)];
  if (p >= 1) items.push(rect(0.65, 2.45, [-0.55, 0, 0], a, pale, 0.24), arrow([-0.55, 1.7, 0], [-0.55, 1.2, 0], a), math(String.raw`T_{known}`, [-0.55, 1.85, 0], a, 21));
  if (p === 2) items.push(circle(0.24, [-0.55, 0, 0], a, pale, 0.3, 5), arrow([0.05, 0, 0], [0.75, 0, 0], a), rect(1.4, 1.55, [1.75, 0, 0], a, pale, 0.16), math(String.raw`S^*`, [1.75, 0.45, 0], a), math(String.raw`Q_e^*,R_e^*`, [1.75, -0.35, 0], m, 18));
  return field(items);
}

function scene27(p, [a, m, pale]) {
  const pumps = [[-2.6, 0.75], [-2.2, -0.55], [-1.35, 0.85], [-0.85, -0.45], [-2.65, -0.2], [-1.35, -0.05]];
  const items = [circle(1.65, [-1.75, 0, 0], m, pale, 0.14), ...well([-1.75, 0], a, pale), ...pumps.slice(0, [2, 4, 6][p]).flatMap((xy) => well(xy, m, pale))];
  if (p >= 1) items.push(axes([1.65, 0.25, 0], m, 2.8, 1.7), ...curve(hydrograph(0.2, 0.95, 0.65), a, 5), math(String.raw`s_{obs}(t)`, [2.4, 1.3, 0], a, 19));
  if (p === 2) items.push(rect(1.35, 0.62, [1.15, -1.2, 0], a, pale, 0.24), math(String.raw`S\ \mathrm{stable}`, [1.15, -1.2, 0], a, 20), rect(1.55, 0.62, [2.65, -1.2, 0], m, pale, 0.2), math(String.raw`Q_e\ \mathrm{geometry\ sensitive}`, [2.65, -1.2, 0], m, 14), math(String.raw`R_e`, [-0.15, -1.2, 0], a));
  return field(items);
}

const SCENES = [
  [/scene\s*1\b|sources unknown|observation hydrograph with unknown pumping sources/, scene01],
  [/scene\s*2\b|distance shapes response|theis kernels indexed by radial distance/, scene02],
  [/scene\s*3\b|high pumping density|high-density pumping field/, scene03],
  [/scene\s*4\b|convolution response|pumping pulses sliding through/, scene04],
  [/scene\s*5\b|equivalent impulse response|concentric rings of theis kernels/, scene05],
  [/scene\s*6\b|equivalent unit response|impulse kernel accumulating/, scene06],
  [/scene\s*7\b|drawdown as pump proxy|drawdown steps transformed/, scene07],
  [/scene\s*8\b|squared drawdown residuals|points dropping vertical residuals/, scene08],
  [/scene\s*9\b|search in log space|logarithmic parameter coordinates/, scene09],
  [/scene\s*10\b|constrain t\b|t-s residual valley/, scene10],
  [/scene\s*11\b|global residual search|candidate population moving/, scene11],
  [/scene\s*12\b|select the minimum|lowest residual marker/, scene12],
  [/scene\s*13\b|generate synthetic drawdown|known pumping bars producing exact multiwell/, scene13],
  [/scene\s*14\b|fit each synthetic case|equivalent-response curve settling/, scene14],
  [/scene\s*15\b|\bsee\b|discrepancies feeding an see gauge/, scene15],
  [/scene\s*16\b|\bme\b|discrepancies balancing on an me gauge/, scene16],
  [/scene\s*17\b|sweep source distance|five radii around the observation/, scene17],
  [/scene\s*18\b|sweep well arrangement|three multiwell configurations/, scene18],
  [/scene\s*19\b|sweep anisotropy|five anisotropic drawdown maps/, scene19],
  [/scene\s*20\b|morris sampling|one-at-a-time paths/, scene20],
  [/scene\s*21\b|morris effects|elementary-effect clouds/, scene21],
  [/scene\s*22\b|isolate pumping|hydrograph clipped to a short pumping/, scene22],
  [/scene\s*23\b|check well density|well-count density gauge/, scene23],
  [/scene\s*24\b|check distance|near and far source clusters/, scene24],
  [/scene\s*25\b|check anisotropy|influence field stretching into directional ellipses/, scene25],
  [/scene\s*26\b|known t required|transmissivity value locking/, scene26],
  [/scene\s*27\b|stable storage, geometry-sensitive pumping|bounded dense-pumping circle|recovered s and uncertain q e/, scene27],
];

export function renderPaperVisual2023_07_25(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = (typeof description === "object" && description !== null ? JSON.stringify(description) : String(description ?? "")).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!text.includes("[paper:2023-07-25]")) return null;
  const normalizedPhase = Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
  const colors = Array.isArray(palette) ? [palette[0] ?? DEFAULT_PALETTE[0], palette[1] ?? DEFAULT_PALETTE[1], palette[2] ?? DEFAULT_PALETTE[2]] : DEFAULT_PALETTE;
  return SCENES.find(([pattern]) => pattern.test(text))?.[1](normalizedPhase, colors) ?? null;
}
