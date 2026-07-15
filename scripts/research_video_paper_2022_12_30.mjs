const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const point = ([x, y, z = 0]) => q([x, y, z]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const dashed = (a, b, color, width = 2) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width}, stroke_opacity=0.5)`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (at, color, radius = 0.08) => `Dot(${point(at)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, at, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(at)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.25) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(at)})`;
const polygon = (points, stroke, fill, opacity = 0.25, width = 3) => `Polygon(${points.map(point).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const arc = (radius, at, color, start = 0, angle = 1, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${point(at)})`;
const math = (latex, at, color, size = 22) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${point(at)})`;
const label = (value, at, color, size = 17) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(at)})`;
const axes = (at, color, width = 3.2, height = 2.4, xRange = "[0, 4, 1]", yRange = "[0, 2, 0.5]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${point(at)})`;
const trace = (points, color, width = 3, dashedTrace = false) => points.slice(0, -1).map((start, index) => (dashedTrace ? dashed : line)(start, points[index + 1], color, width));
const field = (items) => `VGroup(${items.flat().filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const descriptionText = (description) => typeof description === "object" && description !== null
  ? JSON.stringify(description)
  : String(description ?? "");
const normalizePalette = (palette) => {
  const colors = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]].map(String);
};

function clock(at, symbol, color, pale, hand = 0) {
  const [x, y] = at;
  const angle = [1.55, 0.65, -0.35][hand];
  return [
    circle(0.42, at, color, 4, pale, 0.18),
    line(at, [x + 0.28 * Math.cos(angle), y + 0.28 * Math.sin(angle)], color, 4),
    dot(at, color, 0.055),
    math(symbol, [x, y - 0.67], color, 20),
  ];
}

function wedge(colors, phase, { boundary = "stream", well = true, contours = false, compact = false } = {}) {
  const [accent, measured, pale] = colors;
  const scale = compact ? 0.62 : 1;
  const sx = compact ? -1.7 : -2.65;
  const sy = compact ? -0.85 : -1.45;
  const lower = compact ? [0.95, -0.85] : [2.65, -1.45];
  const upper = compact ? [0.1, 1.25] : [0.2, 2.05];
  const rim = compact
    ? [[0.95, -0.85], [0.82, -0.25], [0.55, 0.35], [0.1, 1.25]]
    : [[2.65, -1.45], [2.52, -0.62], [2.18, 0.2], [1.55, 1.02], [0.2, 2.05]];
  const boundaryColor = boundary === "stream" ? accent : measured;
  const boundaryWidth = boundary === "stream" ? 6 : 5;
  const items = [
    polygon([[sx, sy], ...rim], measured, pale, 0.3, 2),
    boundary === "stream" ? line([sx, sy], lower, boundaryColor, boundaryWidth) : dashed([sx, sy], lower, boundaryColor, boundaryWidth),
    boundary === "stream" ? line([sx, sy], upper, boundaryColor, boundaryWidth) : dashed([sx, sy], upper, boundaryColor, boundaryWidth),
    arc(0.62 * scale, [sx, sy], measured, 0.02, 0.88, 3),
  ];
  const wellAt = compact ? [-0.75, 0.05] : [-0.55, 0.05];
  if (phase >= 1) items.push(math(String.raw`\theta_w`, compact ? [-1.2, -0.45] : [-1.86, -0.86], measured, compact ? 15 : 19));
  if (well) items.push(circle(compact ? 0.13 : 0.18, wellAt, accent, 5, pale, 0.42), arrow([wellAt[0], wellAt[1] + 0.7], [wellAt[0], wellAt[1] + 0.22], accent, 4), math(String.raw`Q_0`, [wellAt[0] + 0.42, wellAt[1] + 0.55], accent, compact ? 15 : 19));
  if (contours) {
    const contourCount = phase + 1;
    for (let index = 0; index < contourCount; index += 1) items.push(arc(0.38 + index * 0.3, wellAt, index === contourCount - 1 ? accent : measured, 2.5, 3.7, index === contourCount - 1 ? 5 : 2));
  }
  return items;
}

function scene01(phase, colors) {
  const [accent, measured] = colors;
  const items = wedge(colors, phase, { well: phase >= 1, contours: phase === 2 });
  if (phase === 2) items.push(arrow([1.95, -1.1], [0.05, -0.2], accent, 4), arrow([-0.05, 1.55], [-0.38, 0.42], accent, 4));
  else items.push(label(phase === 0 ? "radial streams" : "point well", [2.05, 1.55], phase === 0 ? measured : accent, 17));
  return field(items);
}

function scene02(phase, colors) {
  const [accent, measured, pale] = colors;
  const gradientX = -1.75;
  const fluxX = [-1.45, -0.35, 0.55][phase];
  const items = [
    axes([0, -0.3], measured, 5.6, 2.2, "[0, 6, 1]", "[0, 2, 1]"),
    rect(0.45, 1.35, [gradientX, -0.15], accent, pale, 0.72),
    arrow([gradientX, 0.95], [gradientX, 0.1], accent, 5),
    math(String.raw`\nabla h`, [gradientX, 1.4], accent, 22),
  ];
  if (phase >= 1) items.push(rect(0.45, 0.95, [fluxX, -0.35], measured, pale, 0.48), arrow([fluxX, 0.65], [fluxX, -0.05], measured, 5), math(String.raw`q`, [fluxX, 1.18], measured, 24));
  if (phase === 2) items.push(line([gradientX, -1.5], [fluxX, -1.5], accent, 4), line([gradientX, -1.7], [gradientX, -1.28], accent, 3), line([fluxX, -1.7], [fluxX, -1.28], accent, 3), math(String.raw`\tau_q`, [(gradientX + fluxX) / 2, -1.85], accent, 21));
  return field(items);
}

function scene03(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [
    rect(5.7, 0.72, [0, 0], measured, pale, 0.32),
    ...[-2.4, -1.4, -0.4, 0.6, 1.6].map((x) => arrow([x, 0], [x + 0.65, 0], accent, 3)),
    rect(1.1, 0.75, [1.65, -1.05], measured, pale, 0.5),
    line([1.65, -0.36], [1.65, -0.67], measured, 4),
  ];
  items.push(...clock([-1.5, 1.25], String.raw`\tau_q`, accent, pale, phase));
  if (phase >= 1) items.push(...clock([1.65, -1.05], String.raw`\tau_h`, measured, pale, phase - 1), arrow([1.25, -0.72], [0.9, -0.22], measured, 3));
  if (phase === 2) items.push(math(String.raw`\tau_q:\ \mathrm{inertia}`, [-1.15, -1.5], accent, 19), math(String.raw`\tau_h:\ \mathrm{dead\!\!-\!end\ pores}`, [1.65, -2.25], measured, 18));
  return field(items);
}

function scene04(phase, colors) {
  const [accent, measured, pale] = colors;
  const qClock = [-1.8, -0.55, 0.3][phase];
  const hClock = [-1.8, 0.2, 1.25][phase];
  const items = [
    axes([0, -0.65], measured, 5.8, 1.5, "[0, 6, 1]", "[0, 1, 1]"),
    ...clock([qClock, 0.7], String.raw`t+\tau_q`, accent, pale, phase),
    ...clock([hClock, -0.55], String.raw`t+\tau_h`, measured, pale, phase),
  ];
  if (phase >= 1) items.push(arrow([qClock + 0.5, 0.7], [hClock - 0.5, -0.55], accent, 4));
  if (phase === 2) items.push(rect(5.45, 0.72, [0, 1.65], accent, pale, 0.2), math(String.raw`q(t+\tau_q)=-T\nabla h(t+\tau_h)`, [0, 1.65], accent, 25));
  return field(items);
}

function scene05(phase, colors) {
  const [accent, measured, pale] = colors;
  const formulas = [
    String.raw`q(t+\tau_q)=-T\nabla h(t+\tau_h)`,
    String.raw`q+\tau_q\partial_tq=-T\nabla(h+\tau_h\partial_th)`,
    String.raw`(1+\tau_q\partial_t)q=-T(1+\tau_h\partial_t)\nabla h`,
  ];
  const items = [rect(6.1, 0.82, [0, 0.95], measured, pale, 0.22), math(formulas[phase], [0, 0.95], phase === 2 ? accent : measured, phase === 0 ? 23 : 21)];
  if (phase >= 1) items.push(arrow([-2.35, 0.25], [-0.8, -0.55], accent, 4), math(String.raw`O(\tau^2)\ \mathrm{discarded}`, [-1.55, -0.95], measured, 18));
  if (phase === 2) items.push(rect(2.8, 0.72, [1.55, -0.75], accent, pale, 0.35), math(String.raw`\tau_q\partial_tq\quad\tau_h\partial_t\nabla h`, [1.55, -0.75], accent, 19));
  return field(items);
}

function scene06(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = wedge(colors, 1, { contours: true });
  const wellAt = [-0.55, 0.05];
  items.push(line([-2.65, -1.45], wellAt, measured, 2), arc(0.9, [-2.65, -1.45], measured, 0, 0.68, 2), math(String.raw`r_0`, [-1.55, -0.92], measured, 18), math(String.raw`\theta_0`, [-2.02, -1.12], measured, 18));
  for (let index = 0; index <= phase; index += 1) items.push(circle(0.28 + index * 0.17, wellAt, index === phase ? accent : pale, index === phase ? 5 : 2));
  if (phase === 2) items.push(rect(3.15, 0.6, [1.15, 1.62], accent, pale, 0.2), math(String.raw`Q_0\delta(r-r_0)\delta(\theta-\theta_0)`, [1.15, 1.62], accent, 18));
  return field(items);
}

function scene07(phase, colors) {
  const [accent, measured, pale] = colors;
  const transient = [[-2.7, -0.95], [-2.2, -0.45], [-1.7, 0.15], [-1.2, 0.62], [-0.65, 0.86]];
  const items = [axes([-1.65, -0.15], measured, 2.7, 2.55), ...trace(transient.slice(0, 3 + phase), accent, 4), math(String.raw`s(r,\theta,t)`, [-1.65, 1.45], accent, 20)];
  if (phase >= 1) items.push(arrow([-0.15, 0], [0.55, 0], accent, 4), math(String.raw`\mathcal L_{t\to p}`, [0.2, 0.48], accent, 21), rect(2.25, 2.45, [1.75, -0.1], measured, pale, 0.22));
  if (phase === 2) items.push(math(String.raw`\bar s(r,\theta,p)=\mathcal L\{s\}`, [1.75, 0.48], accent, 19), math(String.raw`1+p\tau_q`, [1.75, -0.35], measured, 22), math(String.raw`1+p\tau_h`, [1.75, -0.92], measured, 22));
  return field(items);
}

function scene08(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = wedge(colors, 0, { well: false });
  const modeCount = phase + 1;
  for (let mode = 1; mode <= modeCount; mode += 1) {
    const points = Array.from({ length: 7 }, (_, index) => {
      const theta = 0.08 + index * 0.125;
      const radius = 2.0 + 0.22 * Math.sin(mode * Math.PI * index / 6);
      return [-2.65 + radius * Math.cos(theta), -1.45 + radius * Math.sin(theta)];
    });
    items.push(...trace(points, mode === modeCount ? accent : measured, mode === modeCount ? 5 : 2));
  }
  items.push(math(String.raw`\xi_k=k\pi/\phi`, [1.65, 1.72], measured, 19), math(String.raw`\sin(\xi_k\theta)`, [1.78, 1.25], accent, 22));
  if (phase === 2) items.push(dot([-2.65, -1.45], pale, 0.11), label("zero at both streams", [0.95, -1.75], measured, 16));
  return field(items);
}

function scene09(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [dot([-1.75, 0], accent, 0.12), math(String.raw`r`, [-1.75, -1.65], measured, 19)];
  for (let index = 0; index < phase + 2; index += 1) items.push(circle(0.38 + index * 0.34, [-1.75, 0], index === phase + 1 ? accent : measured, index === phase + 1 ? 5 : 2));
  items.push(arrow([-0.3, 0], [0.35, 0], accent, 4), math(String.raw`\mathcal H_{\xi_k}`, [0.02, 0.48], accent, 21), axes([1.75, -0.15], measured, 2.7, 2.35, "[0, 4, 1]", "[0, 2, 0.5]"));
  const heights = [0.65, 1.35, 0.9, 0.45];
  heights.slice(0, phase + 2).forEach((height, index) => items.push(rect(0.35, height, [0.85 + index * 0.58, -1.15 + height / 2], measured, index === phase + 1 ? accent : pale, 0.72)));
  items.push(math(String.raw`J_{\xi_k}(ar)`, [1.75, 1.45], accent, 22));
  return field(items);
}

function scene10(phase, colors) {
  const [accent, measured, pale] = colors;
  const modes = [-1.8, -0.6, 0.6].slice(0, phase + 1);
  const items = [math(String.raw`\tilde{\hat{\bar s}}(a,\xi_k,p)`, [-1.9, 1.45], measured, 20), arrow([-0.55, 0.8], [0.25, 0.8], accent, 4), math(String.raw`\mathcal L^{-1}`, [-0.15, 1.25], accent, 21)];
  modes.forEach((y, index) => {
    const points = [[0.55, y], [1.05, y + 0.45], [1.55, y + 0.15], [2.1, y + 0.55], [2.65, y + 0.32]];
    items.push(rect(2.5, 0.62, [1.62, y + 0.2], measured, pale, 0.1), ...trace(points, index === phase ? accent : measured, index === phase ? 4 : 2), math(`k=${index + 1}`, [2.85, y + 0.25], measured, 15));
  });
  if (phase === 2) items.push(math(String.raw`\tilde{\hat s}(a,\xi_k,t)`, [-1.9, -0.2], accent, 22), math(String.raw`\Omega/\Gamma`, [-1.9, -0.85], measured, 22));
  return field(items);
}

function scene11(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [axes([-1.85, -0.1], measured, 2.7, 2.45), math(String.raw`a`, [-0.55, -1.48], measured, 18)];
  const spectrum = [[-3.0, -1.1], [-2.55, -0.4], [-2.1, 0.65], [-1.65, 0.25], [-1.2, -0.55], [-0.7, -0.92]];
  items.push(...trace(spectrum.slice(0, 4 + phase), accent, 4), arrow([-0.25, 0], [0.45, 0], accent, 4));
  for (let index = 0; index < phase + 1; index += 1) items.push(arc(0.48 + index * 0.38, [1.55, 0], index === phase ? accent : measured, -1.3, 2.6, index === phase ? 5 : 2));
  items.push(math(String.raw`\tilde s=\int_0^\infty J_{\xi_k}(ar)\tilde{\hat s}\,a\,da`, [1.35, 1.55], phase === 2 ? accent : measured, 18), math(String.raw`r`, [1.55, -1.55], measured, 18));
  if (phase === 2) items.push(rect(2.35, 0.45, [1.55, -0.92], accent, pale, 0.28));
  return field(items);
}

function scene12(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = wedge(colors, 1, { contours: true });
  for (let index = 0; index < phase + 1; index += 1) {
    const theta = 0.16 + index * 0.24;
    items.push(line([-2.65, -1.45], [-2.65 + 4.35 * Math.cos(theta), -1.45 + 4.35 * Math.sin(theta)], index === phase ? accent : measured, index === phase ? 4 : 2));
  }
  items.push(math(String.raw`s=\frac{2}{\phi}\sum_{k=1}^{\infty}\sin(\xi_k\theta)\tilde s_k`, [0.65, 1.72], phase === 2 ? accent : measured, 18));
  if (phase === 2) items.push(polygon([[-1.25, -0.45], [-0.55, -0.2], [0.05, -0.45], [-0.55, -0.7]], accent, pale, 0.5, 3), math(String.raw`s(r,\theta,t)`, [1.65, -0.75], accent, 22));
  return field(items);
}

function scene13(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = wedge(colors, phase, { boundary: "barrier", contours: phase === 2 });
  const modeCount = phase + 1;
  for (let mode = 0; mode < modeCount; mode += 1) {
    const points = Array.from({ length: 7 }, (_, index) => [-0.2 + index * 0.45, 1.45 - mode * 0.55 + 0.22 * Math.cos(mode * Math.PI * index / 3)]);
    items.push(...trace(points, mode === modeCount - 1 ? accent : measured, mode === modeCount - 1 ? 4 : 2));
  }
  items.push(math(String.raw`r^{-1}\partial_\theta s=0`, [1.75, -1.0], measured, 19), math(String.raw`\cos(\xi_k\theta)`, [1.75, 1.7], accent, 21));
  if (phase === 2) items.push(label("no normal flux", [1.85, -1.55], measured, 16));
  return field(items);
}

function scene14(phase, colors) {
  const [accent, measured] = colors;
  const right = [[-2.65, -1.2], [-2.15, -0.55], [-1.55, 0.05], [-0.85, 0.48], [-0.1, 0.7]];
  const left = [[0.55, -1.2], [1.05, -0.78], [1.6, -0.22], [2.2, 0.35], [2.75, 0.58]];
  const items = [axes([-1.45, -0.15], measured, 2.65, 2.45), axes([1.75, -0.15], measured, 2.65, 2.45)];
  items.push(...trace(right.slice(0, 3 + phase), accent, 4), ...trace(left.slice(0, 3 + phase), measured, 4));
  items.push(math(String.raw`q_R(t)`, [-1.45, 1.45], accent, 21), math(String.raw`q_L(t)`, [1.75, 1.45], measured, 21));
  if (phase >= 1) items.push(arrow([-2.65, 0.9], [-2.15, 0.45], accent, 3), arrow([2.8, 0.95], [2.3, 0.45], measured, 3));
  if (phase === 2) items.push(math(String.raw`\int_0^\infty (T/r)\,\partial_\theta s\,dr`, [0.15, -1.65], accent, 17));
  return field(items);
}

function gauge(center, radius, value, color, pale, symbol) {
  const angle = Math.PI * (1 - value);
  return [
    arc(radius, center, color, 0, Math.PI, 5),
    line(center, [center[0] + radius * 0.82 * Math.cos(angle), center[1] + radius * 0.82 * Math.sin(angle)], color, 4),
    dot(center, color, 0.06),
    math(symbol, [center[0], center[1] - 0.45], color, 18),
    circle(0.07, center, pale, 2, pale, 0.5),
  ];
}

function scene15(phase, colors) {
  const [accent, measured, pale] = colors;
  const values = [[0.25, 0.18, 0.43], [0.42, 0.31, 0.73], [0.55, 0.45, 1.0]][phase];
  const items = [
    ...gauge([-1.9, 0.45], 0.78, values[0], accent, pale, String.raw`q_R/Q_0`),
    ...gauge([0, 0.45], 0.78, values[1], measured, pale, String.raw`q_L/Q_0`),
    ...gauge([2.0, 0.45], 0.92, Math.min(values[2], 0.99), accent, pale, String.raw`SDR`),
    arrow([-1.12, 0.2], [1.0, 0.2], accent, 3),
    arrow([0.78, 0.2], [1.0, 0.2], measured, 3),
  ];
  if (phase >= 1) items.push(math(String.raw`SDR_R=q_R/Q_0`, [-1.3, -1.18], accent, 18), math(String.raw`SDR_L=q_L/Q_0`, [1.3, -1.18], measured, 18));
  if (phase === 2) items.push(math(String.raw`SDR=SDR_R+SDR_L`, [0, -1.7], accent, 21));
  return field(items);
}

function scene16(phase, colors) {
  const [accent, measured, pale] = colors;
  const darcy = [[-2.7, -1.1], [-2.1, -0.55], [-1.45, -0.05], [-0.75, 0.38], [0.1, 0.72], [1.0, 0.92], [2.35, 1.02]];
  const lagged = darcy.map(([x, y], index) => [x, y + (0.36 - phase * 0.17) * Math.sin(index * 1.35)]);
  const items = [axes([0, -0.15], measured, 5.5, 2.65), ...trace(lagged, accent, 4), ...trace(darcy, measured, phase === 2 ? 5 : 2)];
  if (phase >= 1) items.push(...lagged.filter((_, index) => index % 2 === 0).map((at) => dot(at, pale, 0.07)), math(String.raw`\tau_q,\tau_h\to0`, [-1.65, 1.48], accent, 21));
  if (phase === 2) items.push(math(String.raw`s=s_{\mathrm{Chan\ et\ al.}\ (1978)}`, [0.8, -1.52], accent, 20), line([1.35, 0.98], [2.35, 1.02], accent, 5));
  return field(items);
}

function scene17(phase, colors) {
  const [accent, measured, pale] = colors;
  const curves = [
    [[-2.7, -0.95], [-2.15, 0.2], [-1.5, 0.85], [-0.75, 0.25], [0.1, -0.2], [1.0, -0.45], [2.45, -0.55]],
    [[-2.7, -0.6], [-2.15, -0.2], [-1.5, 0.05], [-0.75, 0.22], [0.1, 0.34], [1.0, 0.42], [2.45, 0.48]],
    [[-2.7, 0.45], [-2.15, 0.2], [-1.5, -0.05], [-0.75, -0.2], [0.1, -0.28], [1.0, -0.32], [2.45, -0.34]],
  ];
  const items = [axes([0, -0.15], measured, 5.5, 2.7, "[0, 6, 1]", "[-1, 1, 0.5]")];
  curves.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === phase ? accent : measured, index === phase ? 4 : 2), math([String.raw`T`, String.raw`S`, String.raw`\tau_q`][index], [2.75, points.at(-1)[1]], index === phase ? accent : measured, 17)));
  if (phase >= 1) items.push(math(String.raw`X_k=P_k\,\partial O/\partial P_k`, [0, 1.55], accent, 20));
  if (phase === 2) items.push(line([-1.5, -1.35], [-1.5, 1.15], pale, 3), dot([-1.5, 0.85], accent, 0.11));
  return field(items);
}

function scene18(phase, colors) {
  const [accent, measured, pale] = colors;
  const shares = [[0.62, 0.24, 0.14], [0.35, 0.43, 0.22], [0.72, 0.18, 0.1]];
  const items = [axes([0, -0.2], measured, 5.5, 2.65, "[0, 4, 1]", "[0, 1, 0.25]")];
  for (let time = 0; time < phase + 1; time += 1) {
    let base = -1.45;
    shares[time].forEach((share, index) => {
      const height = share * 2.5;
      items.push(rect(0.72, height, [-1.7 + time * 1.7, base + height / 2], measured, [accent, measured, pale][index], index === 2 ? 0.65 : 0.82));
      base += height;
    });
  }
  items.push(math(String.raw`\eta_k=\frac{(\partial O/\partial P_k)^2\operatorname{Var}[P_k]}{\operatorname{Var}[O]}`, [0.45, 1.52], phase === 2 ? accent : measured, 17));
  if (phase === 2) items.push(math(String.raw`\sum_k\eta_k=1`, [2.05, -1.55], accent, 20));
  return field(items);
}

function scene19(phase, colors) {
  const [accent, measured, pale] = colors;
  const leftColors = [accent, measured, pale];
  const rightColors = [measured, accent, pale];
  const left = wedge(leftColors, Math.min(phase, 1), { boundary: "stream", contours: phase >= 1, compact: true });
  const right = wedge(rightColors, Math.min(phase, 1), { boundary: "barrier", contours: phase >= 1, compact: true }).map((expression) => `${expression}.shift([3.45, 0, 0])`);
  const items = [...left, ...right, math(String.raw`s=0`, [-0.25, 1.55], accent, 19), math(String.raw`\partial_\theta s=0`, [2.9, 1.55], measured, 18)];
  if (phase >= 1) items.push(arrow([-0.2, 0.2], [0.45, 0.2], accent, 3), arrow([3.25, 0.2], [2.6, 0.2], measured, 3));
  if (phase === 2) items.push(math(String.raw`\mathrm{stream\ recharge}`, [-0.2, -1.62], accent, 16), math(String.raw`\mathrm{storage\ only}`, [2.95, -1.62], measured, 16));
  return field(items);
}

function scene20(phase, colors) {
  const [accent, measured, pale] = colors;
  const early = [[-2.7, -1.15], [-2.15, -0.7], [-1.65, -0.15]];
  const middle = [[-1.65, -0.15], [-1.1, 0.05], [-0.55, 0.12], [0.05, 0.18]];
  const late = [[0.05, 0.18], [0.65, 0.48], [1.25, 0.9], [2.35, 1.18]];
  const items = [axes([0, -0.1], measured, 5.5, 2.7), ...trace(early, accent, 4)];
  if (phase >= 1) items.push(...trace(middle, measured, 5), rect(1.7, 0.35, [-0.75, 0.08], measured, pale, 0.45));
  if (phase === 2) items.push(...trace(late, accent, 4), math(String.raw`\tau_h>\tau_q`, [-1.85, 1.48], accent, 22), math(String.raw`\mathrm{dual\!\!-\!porosity\ like}`, [1.4, -1.42], measured, 18));
  else items.push(math(phase === 0 ? String.raw`\mathrm{early}` : String.raw`\mathrm{delayed\ storage}`, [1.5, 1.35], phase === 0 ? accent : measured, 18));
  return field(items);
}

function scene21(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = wedge(colors, 1, { boundary: "stream", contours: true });
  const wellAt = [-0.55, 0.05];
  const cone = [[-1.35, -0.15], [-0.95, -0.55], [wellAt[0], -1.2], [-0.15, -0.55], [0.25, -0.15]];
  items.push(...trace(cone.slice(0, 3 + phase), accent, 5));
  if (phase >= 1) items.push(...clock([1.55, 1.45], String.raw`\tau_q`, accent, pale, phase), ...clock([2.55, 0.62], String.raw`\tau_h`, measured, pale, phase - 1));
  if (phase === 2) {
    const wave = [[-2.35, -1.82], [-1.75, -1.5], [-1.2, -1.88], [-0.65, -1.48], [-0.1, -1.84], [0.45, -1.55], [1.0, -1.75]];
    items.push(...trace(wave, accent, 4), ...gauge([2.05, -0.72], 0.78, 1.14, accent, pale, String.raw`SDR>1`), math(String.raw`\tau_q>\tau_h`, [0.75, 1.75], accent, 20));
  } else items.push(arrow([1.95, -1.1], [0.05, -0.2], phase === 0 ? measured : accent, 4));
  return field(items);
}

const SCENES = [
  [/scene\s*1\b|stream-bounded aquifer wedge|open two radial boundaries/, scene01],
  [/scene\s*2\b|lagged gradient and flux arrows|advance the gradient arrow/, scene02],
  [/scene\s*3\b|flux-lag and storage-lag clocks|attach tau q to the main flow path/, scene03],
  [/scene\s*4\b|two-clock darcy relation|place q at one delayed time/, scene04],
  [/scene\s*5\b|first-order temporal expansion|collapse each delayed symbol/, scene05],
  [/scene\s*6\b|point-pumping well singularity|pulsing extraction marker/, scene06],
  [/scene\s*7\b|time axis folding into laplace parameter p|fold the transient drawdown timeline/, scene07],
  [/scene\s*8\b|angular wedge eigenmodes|decompose the angular drawdown shape/, scene08],
  [/scene\s*9\b|radial bessel modes|bessel-weighted spectrum/, scene09],
  [/scene\s*10\b|laplace parameter unfolding into a time-indexed sine-hankel spectrum|source inverse-laplace relation/, scene10],
  [/scene\s*11\b|hankel spectrum expanding into radial bessel profiles|integrate each hankel spectrum/, scene11],
  [/scene\s*12\b|radial sine modes assembling into a full wedge drawdown surface|sum the radial mode profiles/, scene12],
  [/scene\s*13\b|no-flow wedge sides generating cosine angular modes|replace the sine basis/, scene13],
  [/scene\s*14\b|boundary-normal arrows integrating into one meter per stream|keep the two volumetric histories separate/, scene14],
  [/scene\s*15\b|two stream-flow meters feeding individual and total sdr gauges|add the two source-defined sdr curves/, scene15],
  [/scene\s*16\b|zero-lag response settling onto the classical darcian drawdown curve|overlay equation 29/, scene16],
  [/scene\s*17\b|one normalized sensitivity curve per aquifer parameter|preserve its sign over time/, scene17],
  [/scene\s*18\b|time-varying percentage shares of drawdown variance|percentage of total output variance/, scene18],
  [/scene\s*19\b|matched stream and barrier wedges around the same pumping well|hold the wedge and pumping settings fixed/, scene19],
  [/scene\s*20\b|storage-lag-dominant drawdown trace settling into an s-shaped curve|dual-porosity-like s-shape/, scene20],
  [/scene\s*21\b|original stream-bounded aquifer wedge with pumping cone|wave-like drawdown trace|sdr gauge crossing one/, scene21],
];

export function renderPaperVisual2022_12_30(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = descriptionText(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!text.includes("[paper:2022-12-30]")) return null;
  const sceneNumber = typeof description === "object" && description !== null ? Number(description.sceneNumber) : NaN;
  const renderer = Number.isInteger(sceneNumber) && sceneNumber >= 1 && sceneNumber <= SCENES.length
    ? SCENES[sceneNumber - 1][1]
    : SCENES.find(([pattern]) => pattern.test(text))?.[1];
  return renderer ? renderer(normalizePhase(phase), normalizePalette(palette)) : null;
}
