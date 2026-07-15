const PAPER_MARKER = "[paper:2019-08-37]";
const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const p = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dashed = (a, b, color, width = 3) => `DashedLine(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, dash_length=0.1)`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (center, color, radius = 0.08) => `Dot(${q(center)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, center, stroke, fill, opacity = 0, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const ellipse = (width, height, center, stroke, fill, opacity = 0.3, strokeWidth = 3) => `Ellipse(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const rect = (width, height, center, stroke, fill, opacity = 0.25, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const polygon = (points, stroke, fill, opacity = 0.25, width = 3) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const tex = (value, center, color, size = 24) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const label = (value, center, color, size = 19) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const axes = (xRange, yRange, center, color, width = 5.2, height = 2.8) => `Axes(x_range=${q(xRange)}, y_range=${q(yRange)}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": True, "font_size": 18}).move_to(${q(center)})`;
const trace = (points, color, width = 3, broken = false) => points.slice(0, -1).map((item, index) => (broken ? dashed : line)(p(item[0], item[1]), p(points[index + 1][0], points[index + 1][1]), color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.67).shift([-1.45, 0.12, 0])`;

const phaseOf = (value) => Math.max(0, Math.min(2, Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0));
const paletteOf = (value) => {
  const colors = Array.isArray(value) ? value : [];
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]];
};
const textOf = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return Object.values(value).filter((item) => typeof item === "string").join(" ");
  return String(value ?? "");
};
const normalizedText = (value) => textOf(value).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();

function unpackContext(context, phase, palette) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return { text: normalizedText(context), phase: phaseOf(phase), colors: paletteOf(palette), scene: null };
  }
  const description = context.description ?? context.text ?? context.semanticDescription ?? context;
  const markerText = normalizedText(context);
  const descriptionText = normalizedText(description);
  const scene = Number(context.scene ?? context.sceneNumber ?? context.index);
  return {
    text: `${markerText} ${descriptionText}`.trim(),
    phase: phaseOf(context.phase ?? phase),
    colors: paletteOf(context.palette ?? palette),
    scene: Number.isInteger(scene) && scene >= 1 && scene <= 16 ? scene : null,
  };
}

function layerStack(colors, phase, dimensions = false) {
  const [accent, measured, pale] = colors;
  const items = [
    rect(5.8, 0.78, p(0, 1.18), measured, "#E8EEF0", 0.66),
    rect(5.8, 1.18, p(0, 0.15), accent, pale, 0.54),
    rect(5.8, 0.78, p(0, -0.88), measured, "#C9D3D7", 0.7),
    label("caprock", p(2.35, 1.18), measured),
    label("aquifer", p(2.35, 0.15), accent),
    label("bedrock", p(2.35, -0.88), measured),
  ];
  if (phase >= 1) {
    items.push(
      rect(0.3, 2.9, p(-1.65, 0.2), accent, pale, 0.14, 4),
      arrow(p(-2.85, 0.15), p(-1.88, 0.15), accent, 5),
      ellipse(2.25 + 0.45 * phase, 0.72, p(-0.35, 0.15), accent, pale, 0.42),
      ...[-0.75, 0.8].flatMap((x) => [arrow(p(x, 0.52), p(x, 0.98), measured, 3), arrow(p(x, -0.22), p(x, -0.65), measured, 3)]),
    );
  }
  if (dimensions) {
    items.push(
      line(p(-2.7, 0.74), p(-2.7, 1.57), measured),
      line(p(-2.82, 0.74), p(-2.58, 0.74), measured),
      line(p(-2.82, 1.57), p(-2.58, 1.57), measured),
      tex(String.raw`b_2`, p(-3.0, 1.15), measured, 21),
      line(p(-2.7, -0.43), p(-2.7, 0.73), accent),
      line(p(-2.82, -0.43), p(-2.58, -0.43), accent),
      tex(String.raw`b`, p(-3.0, 0.15), accent, 21),
      line(p(-2.7, -1.3), p(-2.7, -0.45), measured),
      line(p(-2.82, -1.3), p(-2.58, -1.3), measured),
      tex(String.raw`b_1`, p(-3.0, -0.88), measured, 21),
    );
    if (phase >= 1) items.push(tex(String.raw`Q`, p(-2.4, 0.45), accent, 25), tex(String.raw`r_w`, p(-1.35, -1.45), accent, 21));
    if (phase === 2) items.push(tex(String.raw`T_a(r,t)`, p(0.25, 0.15), accent, 25), tex(String.raw`T_2(r,z,t)`, p(0.1, 1.18), measured, 21), tex(String.raw`T_1(r,z,t)`, p(0.1, -0.88), measured, 21));
  } else if (phase === 2) {
    items.push(tex(String.raw`T=T_0`, p(0, 1.68), measured, 21), tex(String.raw`T=T_0`, p(0, -1.38), measured, 21));
  }
  return field(items);
}

function scene01(phase, [accent, measured, pale]) {
  const radii = [0.34, 0.82, 1.34];
  const left = p(-1.75, 0);
  const right = p(1.35, 0);
  const items = [circle(0.2, left, accent, pale, 0.45, 4), ...radii.map((radius) => circle(radius, left, measured, pale, 0.06, 2)), tex(String.raw`\lambda_c`, p(-1.75, 1.75), measured, 23)];
  if (phase >= 1) items.push(circle(0.2, right, accent, pale, 0.45, 4), ...radii.map((radius, index) => ellipse(2 * radius + 0.45 * index, 2 * radius, right, accent, pale, 0.08, 2)), tex(String.raw`\lambda_d=\beta C_fv`, p(1.35, 1.75), accent, 22));
  if (phase === 2) items.push(arrow(p(-0.35, 0), p(0.15, 0), accent, 4), ellipse(5.6, 2.2, p(-0.1, 0), accent, pale, 0.14, 4), tex(String.raw`\lambda_a=\lambda_c+\lambda_d`, p(-0.1, -1.65), accent, 25));
  return field(items);
}

function scene02(phase, [accent, measured, pale]) {
  const items = [circle(0.62, p(-1.4, 0), measured, pale, 0.18, 4), rect(0.32, 2.8, p(-1.4, 0), accent, pale, 0.14, 4), tex(String.raw`T_a=T_{in}`, p(1.2, 1.25), measured, 23), line(p(0.25, 0.98), p(2.2, 0.98), measured, 5)];
  if (phase >= 1) items.push(arrow(p(-3.0, 0), p(-2.05, 0), accent, 5), arrow(p(-0.75, 0), p(0.35, 0), measured, 5), tex(String.raw`J_1`, p(-2.55, 0.45), accent, 24), tex(String.raw`J_2`, p(-0.05, 0.45), measured, 24), line(p(0.25, 0.78), p(2.2, 0.78), pale, 2));
  if (phase === 2) items.push(tex(String.raw`J_1=J_2`, p(1.25, 0), accent, 29), tex(String.raw`r=r_w`, p(-1.4, -1.15), accent, 22), line(p(0.2, 1.25), p(2.25, 0.55), accent, 3));
  return field(items);
}

function scene05(phase, [accent, measured, pale]) {
  const items = [circle(0.72, p(-1.8, 0), measured, pale, 0.16, 4), circle(0.2, p(-1.8, 0), accent, pale, 0.4, 4), arrow(p(-3.1, 0), p(-2.58, 0), accent, 5), tex(String.raw`J_1`, p(-2.85, 0.42), accent, 24)];
  if (phase >= 1) items.push(arrow(p(-1.05, 0), p(0.05, 0), measured, 5), tex(String.raw`J_2`, p(-0.55, 0.42), measured, 24), tex(String.raw`J_1=J_2\quad(r=r_w)`, p(1.35, 1.15), accent, 25));
  if (phase === 2) items.push(rect(3.45, 1.15, p(1.15, -0.45), accent, pale, 0.18), tex(String.raw`(r_w+\beta Pe)\,\partial_rT_a`, p(1.15, -0.22), accent, 22), tex(String.raw`=Pe\,(T_a-T_{in})`, p(1.15, -0.72), accent, 22));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const ys = [1.05, 0, -1.05];
  const symbols = [String.raw`T_2(r,z,t)`, String.raw`T_a(r,t)`, String.raw`T_1(r,z,t)`];
  const transformed = [String.raw`\Theta_2(r,z,p)`, String.raw`\Theta_a(r,p)`, String.raw`\Theta_1(r,z,p)`];
  const items = ys.map((y, index) => rect(2.15, 0.64, p(-1.95, y), index === 1 ? accent : measured, pale, 0.25)).concat(symbols.map((symbol, index) => tex(symbol, p(-1.95, ys[index]), index === 1 ? accent : measured, 20)));
  if (phase >= 1) items.push(arrow(p(-0.65, 0), p(0.1, 0), accent, 4), tex(String.raw`\mathcal{L}_{t\to p}`, p(-0.28, 0.48), accent, 24));
  if (phase === 2) items.push(...ys.map((y, index) => rect(2.15, 0.64, p(1.45, y), index === 1 ? accent : measured, pale, 0.25)), ...transformed.map((symbol, index) => tex(symbol, p(1.45, ys[index]), index === 1 ? accent : measured, 19)), ...[-0.52, 0.52].map((y) => line(p(0.38, y), p(2.52, y), accent, 2)));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const items = [line(p(-3.0, 0.7), p(-0.75, 0.7), measured, 3), ...[-2.7, -2.25, -1.8, -1.35, -0.9].map((x) => dot(p(x, 0.7), accent, 0.07)), tex(String.raw`\Theta_i(p_n)`, p(-1.85, 1.25), accent, 23)];
  if (phase >= 1) items.push(arrow(p(-0.45, 0.25), p(0.35, 0.25), accent, 4), tex(String.raw`\mathcal{L}^{-1}_{\mathrm{Crump}}`, p(-0.05, 0.72), accent, 22), tex(String.raw`\text{Fourier series}`, p(-1.85, -0.05), measured, 20));
  const curves = [
    [[0.65, 1.0], [1.05, 0.85], [1.5, 0.55], [2.05, 0.22], [2.7, 0.02]],
    [[0.65, 0.35], [1.05, 0.2], [1.5, -0.08], [2.05, -0.42], [2.7, -0.62]],
    [[0.65, -0.35], [1.05, -0.48], [1.5, -0.7], [2.05, -0.98], [2.7, -1.15]],
  ];
  if (phase === 2) items.push(...curves.flatMap((points, index) => trace(points, index === 0 ? accent : measured, index === 0 ? 4 : 3)), tex(String.raw`T_2,\ T_a,\ T_1`, p(1.7, 1.52), accent, 23), tex(String.raw`t`, p(2.9, -1.28), measured, 21));
  return field(items);
}

function conductivityReduction(phase, colors, dispersive) {
  const [accent, measured, pale] = colors;
  const selected = dispersive ? String.raw`\lambda_d` : String.raw`\lambda_c`;
  const inequality = dispersive ? String.raw`\lambda_d\gg\lambda_c` : String.raw`\lambda_d\ll\lambda_c`;
  const items = [rect(2.55, 0.9, p(-1.7, 0.55), measured, pale, 0.24), tex(String.raw`\lambda_a=\lambda_c+\lambda_d`, p(-1.7, 0.55), measured, 25)];
  if (phase >= 1) items.push(arrow(p(-0.25, 0.55), p(0.45, 0.55), accent, 4), tex(inequality, p(0.1, 1.12), accent, 22));
  if (phase === 2) items.push(rect(2.15, 0.9, p(1.65, 0.55), accent, pale, 0.34), tex(String.raw`\lambda_a\approx${selected}`, p(1.65, 0.55), accent, 27), ellipse(dispersive ? 4.8 : 3.1, dispersive ? 0.62 : 1.12, p(0, -0.85), accent, pale, 0.38), arrow(p(-2.65, -0.85), p(2.45, -0.85), measured, 3));
  return field(items);
}

function limitSolution(phase, colors, dispersive) {
  const [accent, measured, pale] = colors;
  const profile = dispersive
    ? [[-2.6, -1.05], [-2.05, -0.62], [-1.45, 0.15], [-0.75, 0.78], [0.05, 1.05], [1.0, 1.12], [2.25, 1.14]]
    : [[-2.6, -1.05], [-2.05, -0.72], [-1.45, -0.22], [-0.75, 0.34], [0.05, 0.76], [1.0, 1.0], [2.25, 1.12]];
  const operator = dispersive ? String.raw`\operatorname{Ai}(\xi)` : String.raw`K_{Pe/2}(r\sqrt{\Lambda})`;
  const condition = dispersive ? String.raw`\lambda_d\gg\lambda_c` : String.raw`\lambda_d\ll\lambda_c`;
  const items = [axes([0, 6, 2], [0, 1, 0.5], p(0, -0.2), measured, 5.4, 2.8), ...trace(profile.slice(0, 3 + phase * 2), accent, phase === 2 ? 5 : 3), tex(condition, p(-1.95, 1.55), measured, 21)];
  if (phase >= 1) items.push(...profile.slice(0, 3 + phase * 2).filter((_, index) => index % 2 === 0).map(([x, y]) => dot(p(x, y), accent, 0.07)));
  if (phase === 2) items.push(rect(2.9, 0.62, p(1.25, 1.5), accent, pale, 0.2), tex(String.raw`\Theta_a(r,p)\propto ${operator}`, p(1.25, 1.5), accent, 20), tex(String.raw`r`, p(2.85, -1.38), measured, 20), tex(String.raw`\Theta_a`, p(-2.85, 1.12), measured, 20));
  return field(items);
}

function scene12(phase, [accent, measured, pale]) {
  const present = [[-2.6, 1.15], [-2.05, 1.05], [-1.45, 0.84], [-0.8, 0.5], [-0.1, 0.02], [0.7, -0.45], [1.55, -0.78], [2.55, -0.94]];
  const finite = present.map(([x, y], index) => [x, y + [0.03, -0.02, 0.02, -0.03, 0.02, -0.02, 0.03, -0.01][index]]);
  const items = [axes([0, 60, 20], [0, 1, 0.5], p(0, -0.1), measured, 5.6, 2.9), ...trace(present.slice(0, 4 + phase * 2), accent, 4), tex(String.raw`r\;\mathrm{(m)}`, p(2.75, -1.45), measured, 19), tex(String.raw`T_a`, p(-2.9, 1.25), measured, 21)];
  if (phase >= 1) items.push(...finite.slice(0, 4 + phase * 2).map(([x, y]) => dot(p(x, y), measured, 0.065)));
  if (phase === 2) items.push(tex(String.raw`\text{present solution}`, p(1.65, 1.55), accent, 19), tex(String.raw`\text{finite difference}`, p(1.65, 1.2), measured, 19), line(p(0.45, 1.55), p(0.95, 1.55), accent, 4), dot(p(0.7, 1.2), measured, 0.07));
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const items = [
    axes([-1, 2.1, 1], [-2, 2.1, 1], p(0, 0), measured, 5.0, 3.35),
    polygon([p(-2.5, -1.7), p(-2.5, 0.8), p(0, -1.7)], measured, "#E8EEF0", 0.5, 0),
    polygon([p(-2.5, 0.8), p(0, 1.7), p(2.5, -0.8), p(0, -1.7)], accent, pale, 0.3, 0),
    polygon([p(0, 1.7), p(2.5, 1.7), p(2.5, -0.8)], accent, pale, 0.55, 0),
    line(p(-2.5, 0.8), p(0, -1.7), measured, 3),
    line(p(0, 1.7), p(2.5, -0.8), accent, 3),
    tex(String.raw`\log(Pe)`, p(2.8, -1.62), measured, 21),
    tex(String.raw`\log(\beta/L)`, p(-2.85, 1.62), measured, 21),
  ];
  const marker = [p(-1.75, -1.15), p(0, 0.15), p(1.65, 1.12)][phase];
  items.push(dot(marker, accent, 0.13), circle(0.23, marker, accent, pale, 0.08, 3));
  if (phase >= 1) items.push(tex(String.raw`\Delta=(\beta/L)Pe`, p(0, -1.38), accent, 22), tex(String.raw`10^{-2}\leq\Delta\leq10^2`, p(0, 0.5), measured, 18));
  if (phase === 2) items.push(tex(String.raw`\Delta<10^{-2}`, p(-1.75, -1.12), measured, 18), tex(String.raw`\Delta>10^2`, p(1.65, 1.38), accent, 18), label("conduction", p(-1.75, -0.68), measured, 16), label("coupled", p(0, 0.05), measured, 16), label("dispersion", p(1.55, 0.95), accent, 16));
  return field(items);
}

function scene14(phase, [accent, measured, pale]) {
  const parameters = [
    [String.raw`Q`, -1.65, 1.1, true], [String.raw`C_f`, -0.9, 0.82, true], [String.raw`C_a`, -0.25, 0.62, true], [String.raw`b`, 0.35, 0.48, true],
    [String.raw`\lambda_c`, -1.15, -0.15, false], [String.raw`C_{1,2}`, -0.25, -0.42, false], [String.raw`b_{1,2}`, 0.75, -0.65, false], [String.raw`\beta`, 1.6, -0.78, false], [String.raw`\lambda_{1,2}`, 1.15, -0.22, false],
  ];
  const count = [3, 6, 9][phase];
  const items = [axes([0, 1, 0.5], [0, 1, 0.5], p(0, -0.15), measured, 5.0, 2.9), tex(String.raw`\mu^*`, p(2.75, -1.42), measured, 22), tex(String.raw`\sigma`, p(-2.75, 1.22), measured, 22)];
  parameters.slice(0, count).forEach(([symbol, x, y, important]) => {
    items.push(dot(p(x, y), important ? accent : measured, important ? 0.11 : 0.075), tex(symbol, p(x + 0.18, y + 0.18), important ? accent : measured, important ? 20 : 17));
  });
  if (phase === 2) items.push(rect(2.65, 0.45, p(-0.65, 1.55), accent, pale, 0.18), tex(String.raw`Q,\ C_f,\ C_a,\ b`, p(-0.65, 1.55), accent, 21));
  return field(items);
}

function miniTrace(center, well, phase, colors, variant) {
  const [accent, measured] = colors;
  const [cx, cy] = center;
  const base = [[-0.82, -0.42], [-0.5, -0.08], [-0.18, 0.24], [0.15, 0.47], [0.48, 0.58], [0.82, 0.64]];
  const offsets = [0.02, 0.12, -0.04, 0.07];
  const observed = base.map(([x, y], index) => [cx + x, cy + y + offsets[variant] + 0.04 * Math.sin(index + variant)]);
  const modeled = base.map(([x, y], index) => [cx + x, cy + y + 0.02 * Math.cos(index + variant)]);
  const items = [rect(1.9, 1.32, p(cx, cy + 0.08), measured, "#FFFFFF", 0.02, 2), label(`well ${well}`, p(cx, cy + 0.86), measured, 15)];
  if (phase >= 1) items.push(...trace(observed, measured, 2, true), ...observed.filter((_, index) => index % 2 === 0).map(([x, y]) => dot(p(x, y), measured, 0.045)));
  if (phase === 2) items.push(...trace(modeled, accent, 3));
  return items;
}

function mobileField(phase, colors, integrated = false) {
  const [accent, measured, pale] = colors;
  const items = [circle(0.18, p(-2.35, 0.05), accent, pale, 0.5, 4), circle(0.92, p(-2.35, 0.05), measured, pale, 0.04, 2), ...[[0, 0.92], [0.92, 0], [0, -0.92], [-0.92, 0]].map(([dx, dy], index) => dot(p(-2.35 + dx, 0.05 + dy), index < phase + 2 ? accent : measured, 0.09)), tex(String.raw`r=15\,\mathrm{m}`, p(-2.35, -1.35), measured, 18)];
  if (integrated) {
    items.unshift(rect(2.15, 0.45, p(-2.35, 0.05), accent, pale, 0.36), rect(2.15, 0.38, p(-2.35, 0.7), measured, "#E8EEF0", 0.65), rect(2.15, 0.38, p(-2.35, -0.6), measured, "#C9D3D7", 0.7), ellipse(1.65 + 0.3 * phase, 0.36, p(-2.05, 0.05), accent, pale, 0.55));
    if (phase >= 1) items.push(arrow(p(-2.75, 0.22), p(-2.75, 0.55), measured, 2), arrow(p(-1.95, -0.12), p(-1.95, -0.45), measured, 2), tex(String.raw`J_1=J_2`, p(-2.35, 1.35), accent, 20));
  }
  const centers = [[-0.25, 0.82], [1.85, 0.82], [-0.25, -0.92], [1.85, -0.92]];
  [1, 4, 7, 10].forEach((well, index) => items.push(...miniTrace(centers[index], well, phase, colors, index)));
  if (!integrated && phase === 2) items.push(tex(String.raw`Q=147\,\mathrm{gpm}`, p(-2.35, 1.62), accent, 18), tex(String.raw`T_{in}=58.2^\circ\mathrm{C}`, p(-2.35, 1.3), accent, 18), tex(String.raw`\beta=1.23\,\mathrm{m}`, p(-2.35, -1.68), accent, 18));
  if (integrated && phase === 2) items.push(tex(String.raw`t\leq31\,\mathrm{d}`, p(-2.35, -1.6), measured, 18));
  return field(items);
}

function sceneFromText(text) {
  if (/coupled heat flow matches|complete aquifer-well cross section|robin well rim.*four observation/.test(text)) return 16;
  if (/mobile injection well|four observation-well|field-scale temperature|wells? 1,? 4,? 7,? (?:and )?10/.test(text)) return 15;
  if (/morris mean|sensitivity indices|parameter influence|compute morris/.test(text)) return 14;
  if (/log\(pe\)|log\(beta\/l\)|regime plane|process-regime|which process dominates/.test(text)) return 13;
  if (/finite-difference|finite difference|numerical agreement|overlaid semianalytical/.test(text)) return 12;
  if (/modified-bessel|modified bessel|derive conduction limit|equation \(25\)/.test(text)) return 11;
  if (/substitute lambda c|approximated by lambda c|conduction-dominant aquifer equation|equation \(24\)/.test(text)) return 10;
  if (/airy-function|airy function|derive dispersion limit|equation \(23\)/.test(text)) return 9;
  if (/substitute lambda d|approximated by lambda d|dispersion-dominant aquifer equation|equation \(22\)/.test(text)) return 8;
  if (/inverse transform|crump|unfolding onto the time axis|numerical inverse/.test(text)) return 7;
  if (/laplace domain|laplace-domain|mapped onto a laplace plane/.test(text)) return 6;
  if (/j1\s*=\s*j2|heat-flux balance|derive robin|inner boundary condition/.test(text)) return 5;
  if (/axisymmetric three-layer|three heat domains|construct three-domain|fully penetrating injection/.test(text)) return 4;
  if (/aquifer-bedrock-caprock|aquifer \+ rocks|bounding rocks|vertical thermal coupling/.test(text)) return 3;
  if (/flux continuity|injection-well rim|constant-temperature injection boundary|prescribed-temperature clamp/.test(text)) return 2;
  if (/conduction \+ dispersion|plume split|legacy plume|conduction-only|dispersion-only/.test(text)) return 1;
  return null;
}

export function renderPaperVisual2019_08_37(context, phase = 0, palette = DEFAULT_PALETTE) {
  const unpacked = unpackContext(context, phase, palette);
  if (!unpacked.text.includes(PAPER_MARKER)) return null;
  const scene = unpacked.scene ?? sceneFromText(unpacked.text);
  const step = unpacked.phase;
  const colors = unpacked.colors;
  switch (scene) {
    case 1: return scene01(step, colors);
    case 2: return scene02(step, colors);
    case 3: return layerStack(colors, step, false);
    case 4: return layerStack(colors, step, true);
    case 5: return scene05(step, colors);
    case 6: return scene06(step, colors);
    case 7: return scene07(step, colors);
    case 8: return conductivityReduction(step, colors, true);
    case 9: return limitSolution(step, colors, true);
    case 10: return conductivityReduction(step, colors, false);
    case 11: return limitSolution(step, colors, false);
    case 12: return scene12(step, colors);
    case 13: return scene13(step, colors);
    case 14: return scene14(step, colors);
    case 15: return mobileField(step, colors, false);
    case 16: return mobileField(step, colors, true);
    default: return null;
  }
}
