const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const point = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (center, color, radius = 0.08) => `Dot(${q(center)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, center, color, width = 3) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=0).shift(${q(center)})`;
const ellipse = (width, height, center, stroke, fill, opacity = 0.48) => `Circle(radius=1, color=${q(stroke)}, stroke_width=3, fill_opacity=0).scale([${width / 2}, ${height / 2}, 1]).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(center)})`;
const rect = (width, height, center, stroke, fill, opacity = 0.5) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(center)})`;
const polygon = (vertices, stroke, fill, opacity = 0) => `Polygon(${vertices.map(q).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const arc = (radius, center, color, start = 0, angle = 5.8, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${q(center)})`;
const math = (value, center, color, size = 28) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const axes = (xRange, yRange, center, color, width = 4.9, height = 2.8) => `Axes(x_range=${q(xRange)}, y_range=${q(yRange)}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}}).shift(${q(center)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((item, index) => line(point(item[0], item[1]), point(points[index + 1][0], points[index + 1][1]), color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const phaseOf = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const textOf = (description) => typeof description === "object" && description !== null
  ? Object.values(description).filter((value) => typeof value === "string").join(" ")
  : String(description ?? "");
const colorsOf = (palette) => {
  const values = Array.isArray(palette) ? palette : [];
  return [values[0] ?? DEFAULT_PALETTE[0], values[1] ?? DEFAULT_PALETTE[1], values[2] ?? DEFAULT_PALETTE[2]];
};

function radialRings(center, colors, phase, thermal = false) {
  const [accent, measured, pale] = colors;
  const radii = [0.38, 0.86, 1.38, 1.95];
  const arrowLengths = [0.92, 0.68, 0.48, 0.3];
  const items = [rect(0.3, 0.72, center, accent, pale, 0), ...radii.map((radius, index) => circle(radius, center, index === phase + 1 ? accent : measured, index === phase + 1 ? 5 : 2))];
  radii.forEach((radius, index) => {
    const start = point(center[0] + radius, center[1], 0);
    const end = point(center[0] + radius + arrowLengths[index], center[1], 0);
    items.push(arrow(start, end, index === 0 ? accent : measured, index === 0 ? 4 : 2));
  });
  if (thermal) items.push(ellipse(1.8 + phase * 0.3, 0.56 + phase * 0.08, point(center[0] + 0.9, center[1], 0), accent, pale, 0.38));
  return items;
}

function conductiveDispersive(text, phase, colors) {
  const [accent, measured, pale] = colors;
  if (/velocity.diffusivity|power-law|linear and power|d depends on v\^?m/i.test(text)) {
    const observations = [[-2.45, -0.75], [-1.8, -0.28], [-1.15, 0.18], [-0.45, 0.48], [0.35, 0.76], [1.25, 1.18], [2.2, 1.62]];
    const linear = [[-2.65, -0.9], [-1.65, -0.28], [-0.65, 0.34], [0.35, 0.96], [1.35, 1.58]];
    const power = [[-2.65, -0.88], [-1.9, -0.45], [-1.1, 0.02], [-0.25, 0.7], [0.65, 1.55], [1.45, 2.2]];
    const items = [axes([0, 5, 1], [0, 3, 1], [0, -0.25, 0], measured, 5.5, 3.0), ...observations.map(([x, y]) => dot(point(x, y - 0.1, 0), accent, 0.09)), ...trace(linear, measured, 3)];
    if (phase >= 1) items.push(...trace(power, accent, phase === 2 ? 5 : 3));
    if (phase === 2) items.push(math(String.raw`D=D_c+\beta_l v^m`, [0, 1.95, 0], accent, 26));
    return field(items);
  }
  const items = [ellipse(0.65, 0.65, point(-2.25, 0.55), measured, pale, 0.35), circle(0.2, point(-2.25, 0.55), accent, 4), arrow(point(-1.45, 0.55), point(-0.65, 0.55), measured, 3)];
  if (phase >= 1) items.push(ellipse(2.25, 0.7, point(0.15, -0.35), accent, pale, 0.52), arrow(point(-0.85, -0.35), point(1.15, -0.35), accent, 4));
  if (phase === 2) items.push(arrow(point(-1.7, 0.55), point(-0.95, 0.12), measured), arrow(point(0.65, -0.35), point(1.38, 0.1), accent), rect(1.7, 0.78, point(2.25, 0.05), accent, pale, 0.28), math(String.raw`D=\frac{k}{\rho c}+\beta_l v^m`, point(2.25, 0.05), accent, 24));
  return field(items);
}

function layeredBoundary(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(5.5, 0.58, point(0, 1.18), measured, pale, 0.64), rect(5.5, 1.18, point(0, 0.18), accent, pale, 0.38), rect(5.5, 0.58, point(0, -0.98), measured, pale, 0.64), rect(0.34, 3.35, point(-1.25, 0.08), accent, pale, 0), circle(0.22, point(-1.25, 0.08), accent, 4)];
  if (phase >= 1) items.push(...[-0.45, 0.1, 0.65].map((y) => arrow(point(-2.45, y, 0), point(-1.48, y, 0), accent, 3)), ...[-1.85, -0.85, 0.15, 1.15].map((x) => arrow(point(x, -1.55, 0), point(x, 1.55, 0), measured, 2)));
  if (phase === 2) items.push(arc(0.55, point(-1.25, 0.08), accent, -1.1, 2.2, 5), line(point(-0.75, 0.08), point(0.7, 0.08), accent, 3), math(String.raw`T=T_w\;\text{at mixed well}`, point(1.45, 1.45), accent, 23));
  return field(items);
}

function triangularMesh(phase, colors) {
  const [accent, measured, pale] = colors;
  const columns = [4, 6, 8][phase];
  const rows = [2, 3, 4][phase];
  const items = [];
  const dx = 4.9 / columns;
  const dy = 2.5 / rows;
  for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
    const x0 = -2.75 + column * dx;
    const x1 = x0 + dx;
    const y0 = -1.15 + row * dy;
    const y1 = y0 + dy;
    items.push(polygon([point(x0, y0), point(x1, y0), point(x1, y1)], measured, pale), polygon([point(x0, y0), point(x1, y1), point(x0, y1)], measured, pale));
  }
  items.push(ellipse(2.3 + phase * 0.3, 0.55 + phase * 0.08, point(-0.8 + phase * 0.8, 0.1, 0), accent, pale, 0.46), math(String.raw`\Delta t=60\;\mathrm{s}`, point(1.55, 1.35, 0), accent, 24));
  return field(items);
}

function benchmarkCurves(phase, colors) {
  const [accent, measured, pale] = colors;
  const observed = [[-2.7, -1.0], [-2.1, -0.72], [-1.45, -0.2], [-0.75, 0.48], [0.1, 0.96], [1.15, 1.12], [2.45, 1.18]];
  const numerical = observed.map(([x, y], index) => [x, y + [0.05, -0.04, 0.03, -0.04, 0.02, -0.02, 0.01][index]]);
  const items = [axes([0, 6, 1], [0, 1.4, 0.2], [0, -0.25, 0], measured, 5.4, 2.8), ...trace(observed, measured, 3), ...observed.map(([x, y]) => dot(point(x, y, 0), pale, 0.09))];
  if (phase >= 1) items.push(...trace(numerical, accent, 4));
  if (phase === 2) items.push(...observed.map(([x, y], index) => line(point(x, y, 0), point(numerical[index][0], numerical[index][1], 0), accent, 2)), math(String.raw`m=1\;\Rightarrow\;\mathrm{RMSE}\downarrow`, point(0.8, 1.65, 0), accent, 22));
  return field(items);
}

function morrisSensitivity(phase, colors) {
  const [accent, measured, pale] = colors;
  const curves = [
    [[-2.7, -0.9], [-1.8, -0.65], [-0.9, -0.5], [0, -0.42], [1.1, -0.33], [2.45, -0.28]],
    [[-2.7, -0.74], [-1.8, -0.45], [-0.9, -0.22], [0, -0.05], [1.1, 0.12], [2.45, 0.24]],
    [[-2.7, -0.62], [-1.8, -0.12], [-0.9, 0.42], [0, 0.7], [1.1, 0.92], [2.45, 1.14]],
    [[-2.7, -0.82], [-1.8, -0.28], [-0.9, 0.48], [0, 0.95], [1.1, 1.3], [2.45, 1.58]],
  ];
  const items = [axes([0, 6, 1], [0, 2, 0.5], [0, -0.2, 0], measured, 5.5, 3.0)];
  curves.slice(0, phase === 0 ? 2 : 4).forEach((points, index) => items.push(...trace(points, index === 3 ? accent : measured, index === 3 && phase === 2 ? 5 : 3)));
  if (phase >= 1) items.push(...curves[2].filter((_, index) => index % 2 === 0).map(([x, y]) => dot(point(x, y, 0), pale, 0.08)));
  if (phase === 2) items.push(math(String.raw`m:\;\mu^*\;\sigma`, point(1.55, 1.72, 0), accent, 24), arrow(point(1.38, 1.48, 0), point(1.08, 1.18, 0), accent));
  return field(items);
}

function ltdCalibration(phase, colors) {
  const [accent, measured, pale] = colors;
  const samples = [[-2.6, -0.92], [-2.05, -0.55], [-1.4, 0.02], [-0.75, 0.55], [0, 0.9], [0.85, 1.05], [1.75, 1.1], [2.55, 1.12]];
  const trial = [[-2.7, -0.96], [-1.9, -0.68], [-1.0, -0.08], [-0.1, 0.65], [0.85, 1.2], [2.5, 1.32]];
  const fit = [[-2.7, -0.96], [-1.9, -0.58], [-1.0, 0.02], [-0.1, 0.58], [0.85, 1.02], [2.5, 1.16]];
  const items = [axes([0, 6, 1], [0, 1.4, 0.2], [0, -0.25, 0], measured, 5.5, 2.9), ...samples.map(([x, y]) => dot(point(x, y, 0), accent, 0.1))];
  if (phase === 0) items.push(...trace(trial, measured, 3));
  if (phase === 1) items.push(...trace(trial, measured, 2), arrow(point(0.4, 0.9, 0), point(0.4, 0.58, 0), accent), ...trace(fit, accent, 4));
  if (phase === 2) items.push(...trace(fit, accent, 5), math(String.raw`\mathrm{LTD}(\beta_l^*)\approx\mathrm{NLTD}`, point(0.8, 1.62, 0), accent, 21));
  return field(items);
}

function radialVelocityNltd(phase, colors) {
  const [accent, measured, pale] = colors;
  const families = [
    [[-0.2, -0.95], [0.35, -0.2], [0.9, 0.45], [1.55, 0.86], [2.3, 1.05]],
    [[-0.2, -0.95], [0.4, -0.38], [1.0, 0.2], [1.65, 0.7], [2.3, 0.86]],
    [[-0.2, -0.95], [0.45, -0.52], [1.1, 0.02], [1.72, 0.46], [2.3, 0.66]],
  ];
  const items = [...radialRings(point(-2.2, 0, 0), colors, phase), axes([0, 5, 1], [0, 1.3, 0.25], [0.95, -0.25, 0], measured, 3.7, 2.8)];
  families.slice(0, phase + 1).forEach((curvePoints, index) => items.push(...trace(curvePoints, index === phase ? accent : measured, index === phase ? 4 : 2)));
  if (phase === 2) items.push(math(String.raw`D_{NLTD}(r)=D_c+\beta_l v(r)^m`, [0.75, 1.5, 0], accent, 21));
  return field(items);
}

function ltdField(phase, colors) {
  const [accent, measured, pale] = colors;
  const points = [[-0.2, -0.75], [0.35, -0.38], [0.95, 0.05], [1.55, 0.36], [2.2, 0.58], [2.7, 0.68]];
  const items = [axes([0, 5, 1], [0, 1, 0.2], [0, -0.25, 0], measured, 5.2, 2.8), ...points.slice(0, 4 + phase).map(([x, y], index) => dot(point(x, y, 0), index === phase + 2 ? accent : pale, 0.11))];
  if (phase >= 1) items.push(...trace(points, measured, 2));
  if (phase === 2) items.push(math(String.raw`D_{LTD}(r)=D_c+\beta_l^*v(r)`, [0.65, 1.25, 0], accent, 22));
  return field(items);
}

function ratioDistribution(phase, colors) {
  const [accent, measured, pale] = colors;
  const ratio = [[-2.7, 1.75], [-2.1, 1.48], [-1.45, 1.28], [-0.75, 1.12], [0, 1.02], [0.85, 0.94], [1.75, 0.88], [2.65, 0.84]];
  const items = [axes([0, 6, 1], [0, 2, 0.5], [0, -0.3, 0], measured, 5.6, 2.9), ...ratio.slice(0, 5 + phase).map(([x, y], index) => dot(point(x, y - 1.1, 0), index === 0 ? accent : pale, 0.1))];
  if (phase >= 1) items.push(...trace(ratio.map(([x, y]) => [x, y - 1.1]), measured, 3), line(point(-2.7, 0.48, 0), point(-2.7, 1.55, 0), accent, 5));
  if (phase === 2) items.push(math(String.raw`D_{NLTD}/D_{LTD}`, [0.9, 1.55, 0], accent, 25), arrow(point(-2.35, 1.05, 0), point(-2.65, 1.45, 0), accent));
  return field(items);
}

function etaVsLambda(phase, colors) {
  const [accent, measured, pale] = colors;
  const baseline = -0.92;
  const injected = [[-2.7, baseline],[-2.3,-0.12],[-1.85,0.88],[-1.35,1.22],[-0.8,0.42],[-0.25,-0.35],[0.2,baseline]];
  const recovered = [[0.55,baseline],[0.9,-0.48],[1.35,0.18],[1.85,0.72],[2.35,0.3],[2.75,-0.28],[3.0,baseline]];
  const injectedArea = [point(-2.7,baseline), ...injected.slice(1,-1).map(([x,y]) => point(x,y)), point(0.2,baseline)];
  const recoveredArea = [point(0.55,baseline), ...recovered.slice(1,-1).map(([x,y]) => point(x,y)), point(3.0,baseline)];
  const items = [
    axes([0, 8, 1], [0, 2, 0.5], [0.1, -0.18, 0], measured, 6.1, 3.0),
    line(point(-2.75, baseline), point(3.05, baseline), measured, 2),
    polygon(injectedArea, accent, pale, phase === 0 ? 0.34 : 0.55),
    ...trace(injected, accent, phase === 0 ? 4 : 5),
    math(String.raw`Q_{\mathrm{in}}`, point(-1.35, 0.38), accent, 24),
  ];
  if (phase >= 1) items.push(
    polygon(recoveredArea, measured, pale, phase === 1 ? 0.36 : 0.5),
    ...trace(recovered, measured, phase === 1 ? 4 : 5),
    math(String.raw`Q_{\mathrm{rec}}`, point(1.82, 0.12), measured, 24),
  );
  if (phase === 2) items.push(
    arrow(point(-0.15, 1.35), point(0.62, 1.35), accent, 3),
    math(String.raw`\eta=\frac{Q_{\mathrm{rec}}}{Q_{\mathrm{in}}}`, point(1.55, 1.52), accent, 25),
  );
  return field(items);
}

function betaMConditionalFit(phase, colors) {
  const [accent, measured, pale] = colors;
  const cells = [];
  for (let row = 0; row < 5; row += 1) for (let column = 0; column < 7; column += 1) {
    const distance = Math.abs(column - 3) + Math.abs(row - 2);
    const fill = distance <= 1 ? accent : distance <= 3 ? measured : pale;
    cells.push(rect(0.48, 0.38, point(-2.65 + column * 0.52, -0.82 + row * 0.43), measured, fill, distance <= 1 ? 0.72 : 0.42));
  }
  const residual = [[0.75, 0.82], [1.15, 0.25], [1.55, -0.35], [1.95, -0.68], [2.35, -0.28], [2.75, 0.55]];
  const items = [...cells, line(point(-1.09, -1.18), point(-1.09, 1.18), accent, phase === 2 ? 5 : 3)];
  if (phase >= 1) items.push(arrow(point(-0.75, 0), point(0.28, 0), accent, 3), axes([0, 5, 1], [0, 1, 0.2], point(1.75, -0.15), measured, 2.6, 2.35), ...trace(residual, accent, 4));
  if (phase === 2) items.push(dot(point(1.95, -0.68), accent, 0.13), math(String.raw`\beta_l^*(m)`, point(2.15, 1.28), accent, 25));
  return field(items);
}

function rSquaredRidge(phase, colors) {
  const [accent, measured, pale] = colors;
  const ridge = [[-2.65, -0.8], [-2.0, -0.42], [-1.3, 0.05], [-0.55, 0.62], [0.15, 1.05], [0.85, 0.72], [1.55, 0.2], [2.5, -0.45]];
  const conditional = ridge.map(([x, y], index) => [x, y - (index % 2 ? 0.13 : 0.22)]);
  const items = [axes([0, 8, 1], [0, 1, 0.2], point(0, -0.2), measured, 5.5, 2.8), ...trace(conditional, measured, 3)];
  if (phase >= 1) items.push(...trace(ridge, accent, 5), ...ridge.filter((_, index) => index % 2 === 0).map(([x, y]) => dot(point(x, y), pale, 0.08)));
  if (phase === 2) items.push(dot(point(0.15, 1.05), accent, 0.15), line(point(0.15, -1.1), point(0.15, 1.05), accent, 2), math(String.raw`(\beta_l,m)_{\max R^2}`, point(1.45, 1.45), accent, 23));
  return field(items);
}

function fieldBtcFits(phase, colors, includeWell = false) {
  const [accent, measured, pale] = colors;
  const obsA = [[-2.75,-0.8],[-2.35,-0.48],[-1.95,0.22],[-1.55,0.92],[-1.15,0.5],[-0.72,-0.28]];
  const nltdA = [[-2.8,-0.82],[-2.35,-0.42],[-1.95,0.26],[-1.55,0.88],[-1.15,0.46],[-0.68,-0.3]];
  const priorA = [[-2.8,-0.82],[-2.35,-0.6],[-1.95,-0.02],[-1.55,0.62],[-1.15,0.68],[-0.68,-0.24]];
  const obsB = [[0.35,-0.82],[0.78,-0.62],[1.22,-0.05],[1.65,0.68],[2.08,0.52],[2.55,-0.18]];
  const nltdB = [[0.3,-0.84],[0.78,-0.58],[1.22,-0.02],[1.65,0.64],[2.08,0.48],[2.58,-0.2]];
  const priorB = [[0.3,-0.84],[0.78,-0.72],[1.22,-0.25],[1.65,0.38],[2.08,0.62],[2.58,-0.12]];
  const items = [axes([0, 5, 1], [0, 1, 0.2], point(-1.72,-0.15), measured, 2.55, 2.45), axes([0, 5, 1], [0, 1, 0.2], point(1.48,-0.15), measured, 2.55, 2.45), ...obsA.map(([x,y])=>dot(point(x,y), accent, 0.09)), ...obsB.map(([x,y])=>dot(point(x,y), accent, 0.09))];
  if (phase >= 1) items.push(...trace(priorA, measured, 3), ...trace(priorB, measured, 3));
  if (phase === 2) items.push(...trace(nltdA, accent, 5), ...trace(nltdB, accent, 5), math(String.raw`\mathrm{Zhengzhou}`, point(-1.7,1.45), measured, 20), math(String.raw`\mathrm{Alabama}`, point(1.5,1.45), measured, 20));
  if (includeWell) items.push(rect(0.18, 2.7, point(-3.25,0), accent, pale, 0), ...radialRings(point(-3.25,0), colors, Math.min(phase,1), true).slice(1,3));
  return field(items);
}

function radialAtes(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = radialRings(point(-2.05, 0, 0), colors, phase, true);
  items.push(ellipse(1.35 + phase * 0.2, 2.1 + phase * 0.16, point(-2.05, 0, 0), accent, pale, 0.26), axes([0, 6, 1], [0, 1, 0.2], [1.15, -0.25, 0], measured, 3.7, 2.8));
  const zhengzhou = [[-0.15, -0.78], [0.35, -0.35], [0.85, 0.28], [1.45, 0.68], [2.1, 0.84], [2.75, 0.9]];
  const alabama = [[-0.15, -0.8], [0.4, -0.52], [0.95, -0.05], [1.55, 0.35], [2.15, 0.56], [2.75, 0.66]];
  items.push(...trace(zhengzhou, accent, 4), ...trace(alabama, measured, 3), math(String.raw`D_{NLTD}(r)`, point(0.65, 1.55, 0), accent, 24));
  if (phase === 2) items.push(arrow(point(-0.75, 1.25, 0), point(-1.35, 0.55, 0), accent), circle(0.15, point(-2.05, 0, 0), accent, 4));
  return field(items);
}

export function paperVisualExpression(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  const step = phaseOf(phase);
  const colors = colorsOf(palette);
  const sceneNumber = description && typeof description === "object" ? Number(description.sceneNumber) : NaN;
  const sceneRenderer = {
    10: ltdCalibration,
    11: radialVelocityNltd,
    12: ltdField,
    13: ratioDistribution,
    14: etaVsLambda,
    15: betaMConditionalFit,
    16: rSquaredRidge,
    17: (scenePhase, sceneColors) => fieldBtcFits(scenePhase, sceneColors, false),
    18: (scenePhase, sceneColors) => fieldBtcFits(scenePhase, sceneColors, true),
  }[sceneNumber];
  if (sceneRenderer) return sceneRenderer(step, colors);
  if (/conductive spread|dispersive spread|conduction plus|velocity.diffusivity|power-law|d depends on v\^?m/i.test(text)) return conductiveDispersive(text, step, colors);
  if (/layered|mixed well|mixed-well|conductive layers|well boundary|coupled radial heat model/i.test(text)) return layeredBoundary(step, colors);
  if (/triangular.*mesh|finite.element plume|mesh the radial|finite element/i.test(text)) return triangularMesh(step, colors);
  if (/morris|sensitivity curves|elementary effects|parameter sensitivity|m controls the btc/i.test(text)) return morrisSensitivity(step, colors);
  if (/nltd.*ltd.*ratio|ratio distribution|diffusivity ratio|pointwise.*divided|d nltd.*d ltd/i.test(text)) return ratioDistribution(step, colors);
  if (/ltd.*calibrat|calibrat.*ltd|synthetic nltd.*points|trial ltd|m = 1|semi-analytical|benchmark/i.test(text)) return ltdCalibration(step, colors);
  if (/eta.*lambda|lambda.*eta|recovery efficiency|injected and recovered heat/i.test(text)) return etaVsLambda(step, colors);
  if (/r-squared ridge|reported site maximum|beta-m pair|conditional r-squared|locate the maximum/i.test(text)) return rSquaredRidge(step, colors);
  if (/vertical slice|conditional.*beta|best-fit beta|candidate exponent|vary beta|minimize.*residual/i.test(text)) return betaMConditionalFit(step, colors);
  if (/paired zhengzhou and alabama|across the two field tests|paired.*breakthrough-fit/i.test(text)) return fieldBtcFits(step, colors, true);
  if (/zhengzhou and alabama|two in situ|observed breakthrough|field test.*prediction|paired.*field.*fit/i.test(text)) return fieldBtcFits(step, colors, false);
  if (/ltd diffusivity field|fitted linear dispersiv/i.test(text)) return ltdField(step, colors);
  if (/nltd diffusivity|radial velocity.*equation|separate nltd|nltd family|extraction.phase radial velocity/i.test(text)) return radialVelocityNltd(step, colors);
  if (/radial ates|ates well|nonlinear diffusivity field|radial inject.rest.extract|thermal plume|velocity falls with radius|concentric radial velocity/i.test(text)) return radialAtes(step, colors);
  return radialAtes(step, colors);
}
