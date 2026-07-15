const PAPER_MARKER = "[paper:2024-06-20]";
const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const point = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (center, color, radius = 0.08) => `Dot(${q(center)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, center, stroke, fill, opacity = 0, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const rect = (width, height, center, stroke, fill, opacity = 0.25, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const polygon = (points, stroke, fill, opacity = 0.25, width = 3) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const tex = (value, center, color, size = 23) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const label = (value, center, color, size = 18) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const axes = (center, color, width = 5.2, height = 2.8, xRange = [0, 4, 1], yRange = [0, 3, 1]) => `Axes(x_range=${q(xRange)}, y_range=${q(yRange)}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).move_to(${q(center)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((item, index) => line(point(item[0], item[1]), point(points[index + 1][0], points[index + 1][1]), color, width));
const field = (items) => `VGroup(${items.flat().filter(Boolean).join(", ")}).scale(0.67).shift([-1.45, 0.12, 0])`;

const phaseOf = (value) => Math.max(0, Math.min(2, Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0));
const paletteOf = (value) => {
  const colors = Array.isArray(value) ? value : [];
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]];
};
const normalizedText = (value) => {
  if (typeof value === "string") return value.normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!value || typeof value !== "object" || Array.isArray(value)) return String(value ?? "").toLowerCase();
  return Object.values(value).filter((item) => typeof item === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
};

function unpackContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return { text: normalizedText(context), phase: 0, colors: paletteOf(), scene: null };
  }
  const description = context.description ?? context.text ?? context.semanticDescription ?? context;
  const sceneValue = Number(context.scene ?? context.sceneNumber ?? context.index);
  return {
    text: `${normalizedText(context)} ${normalizedText(description)}`.trim(),
    phase: phaseOf(context.phase),
    colors: paletteOf(context.palette),
    scene: Number.isInteger(sceneValue) && sceneValue >= 1 && sceneValue <= 20 ? sceneValue : null,
  };
}

function streamAquiferBase(colors, phase, finiteStage = false) {
  const [accent, measured, pale] = colors;
  const stageY = finiteStage ? 1.02 - 0.16 * phase : 1.02;
  const items = [
    rect(5.8, 1.65, point(0, -0.55), measured, pale, 0.52),
    polygon([point(-3, 0.82), point(-1.85, 0.82), point(-1.55, stageY), point(-0.3, stageY), point(0, 0.82), point(3, 0.82)], measured, "#FFFFFF", 1, 2),
    polygon([point(-1.55, 0.82), point(-1.4, stageY), point(-0.45, stageY), point(-0.3, 0.82)], accent, pale, 0.72, 2),
    rect(0.22, 2.4, point(1.65, 0), accent, "#FFFFFF", 0.08, 4),
    arrow(point(1.65, 1.35), point(1.65, 0.88), accent, 5),
    tex(String.raw`Q`, point(2.02, 1.22), accent, 24),
  ];
  if (phase >= 1) {
    items.push(
      polygon([point(0.2, 0.82), point(0.75, 0.54), point(1.65, -0.15 - 0.16 * phase), point(2.55, 0.54), point(3, 0.82)], accent, pale, 0.35 + phase * 0.1, 4),
      arrow(point(-0.92, 0.62), point(-0.25, 0.2), accent, 4),
    );
  }
  return items;
}

function scene01(phase, colors) {
  const [accent, measured] = colors;
  const items = streamAquiferBase(colors, phase, false);
  const dischargeWidth = [6, 4, 2][phase];
  items.push(arrow(point(-1.35, 1.45), point(-0.55, 1.45), measured, 4), arrow(point(-0.25, 1.45), point(0.95, 1.45), accent, dischargeWidth));
  if (phase === 2) items.push(tex(String.raw`Q_r\downarrow`, point(0.35, 1.78), accent, 24), tex(String.raw`s`, point(1.05, 0.1), accent, 25));
  return field(items);
}

function scene02(phase, colors) {
  const [accent, measured, pale] = colors;
  const fixed = [[-2.65, -1.05], [-2.1, -0.48], [-1.5, 0.0], [-0.8, 0.35], [0.0, 0.48], [0.85, 0.52], [1.7, 0.53], [2.55, 0.53]];
  const transient = [[-2.65, -1.05], [-2.1, -0.48], [-1.5, 0.0], [-0.8, 0.32], [0.0, 0.48], [0.85, 0.68], [1.7, 0.92], [2.55, 1.16]];
  const items = [axes(point(0, -0.2), measured, 5.6, 2.9), line(point(-2.75, 1.45), point(2.65, 1.45), pale, 3), tex(String.raw`s_r=0`, point(-2.15, 1.7), measured, 21), ...trace(fixed.slice(0, 4 + phase * 2), measured, 4)];
  if (phase >= 1) items.push(...trace(transient.slice(0, 4 + phase * 2), accent, 5));
  if (phase === 2) items.push(label("fixed stage", point(1.92, 0.35), measured), label("continued drawdown", point(1.55, 1.35), accent));
  return field(items);
}

function scene03(phase, colors) {
  const [accent, measured, pale] = colors;
  const aquifer = [[-2.7, 1.05], [-2.1, 0.82], [-1.5, 0.42], [-0.8, 0.05], [0, -0.3], [0.8, -0.55], [1.6, -0.75], [2.5, -0.92]];
  const stream = [[-2.7, 1.05], [-2.1, 1.05], [-1.5, 1.05], [-0.8, 0.98], [0, 0.78], [0.8, 0.52], [1.6, 0.28], [2.5, 0.08]];
  const items = [axes(point(0, -0.05), measured, 5.6, 3.0), line(point(-2.7, -1.38), point(-2.7, 1.42), accent, 3), tex(String.raw`t=0`, point(-2.7, -1.65), accent, 20), ...trace(aquifer.slice(0, 4 + phase * 2), accent, 5)];
  if (phase >= 1) items.push(...trace(stream.slice(0, 4 + phase * 2), measured, 4), line(point(-1.5, 1.35), point(-0.8, 1.35), pale, 5));
  if (phase === 2) items.push(arrow(point(-1.48, 1.55), point(-0.82, 1.55), accent, 3), label("onset lag", point(-1.15, 1.82), accent), label("aquifer", point(2.25, -1.1), accent), label("stream", point(2.25, 0.3), measured));
  return field(items);
}

function scene04(phase, colors) {
  const [accent, measured, pale] = colors;
  const center = point(1.15, 0);
  const contours = [
    [point(-0.1, -0.45), point(0.35, -0.92), point(1.15, -1.1), point(2.25, -0.72), point(2.55, 0), point(2.25, 0.72), point(1.15, 1.1), point(0.35, 0.92), point(-0.1, 0.45)],
    [point(0.45, -0.28), point(0.75, -0.58), point(1.15, -0.66), point(1.75, -0.48), point(1.95, 0), point(1.75, 0.48), point(1.15, 0.66), point(0.75, 0.58), point(0.45, 0.28)],
  ];
  const items = [line(point(-2.8, -1.25), point(-2.8, 1.35), measured, 5), tex(String.raw`y`, point(-2.55, 1.35), measured, 22), tex(String.raw`x`, point(2.75, -1.35), measured, 22), circle(0.18, center, accent, pale, 0.65, 4), tex(String.raw`Q`, point(1.15, 0.38), accent, 23)];
  contours.slice(0, phase + 1).forEach((shape, index) => items.push(polygon(shape, index === phase ? accent : measured, pale, 0.12, index === phase ? 4 : 2)));
  if (phase >= 1) items.push(arrow(point(-2.65, 0), point(-2.0, 0), measured, 4), label("stream sink/source", point(-1.78, 1.45), measured));
  if (phase === 2) items.push(tex(String.raw`K_x\ne K_y`, point(1.45, 1.55), accent, 23), tex(String.raw`s(x,y,t)`, point(1.65, -1.48), accent, 23));
  return field(items);
}

function scene05(phase, colors) {
  const [accent, measured, pale] = colors;
  const aquiferHead = 0.25 - 0.18 * phase;
  const items = [rect(5.6, 1.25, point(0, -0.78), measured, pale, 0.5), rect(3.0, 0.24, point(-0.65, -0.02), accent, pale, 0.88), polygon([point(-2.15, 0.1), point(-1.9, 1.18), point(0.6, 1.18), point(0.85, 0.1)], measured, pale, 0.5), line(point(-1.9, 0.9), point(0.6, 0.9), measured, 4), line(point(-2.0, aquiferHead), point(0.7, aquiferHead), accent, 4)];
  if (phase >= 1) items.push(...[-1.65, -0.9, -0.15, 0.5].map((x) => arrow(point(x, 0.72), point(x, 0.08), accent, 3 + phase)), tex(String.raw`s-s_r`, point(1.4, 0.48), accent, 25));
  if (phase === 2) items.push(tex(String.raw`\Psi=\gamma(s-s_r)`, point(1.65, -0.45), accent, 25), label("streambed conductance", point(-0.65, -0.35), measured));
  return field(items);
}

function scene06(phase, colors) {
  const [accent, measured, pale] = colors;
  const waterHeight = [1.65, 1.18, 0.72][phase];
  const stageY = -0.82 + waterHeight;
  const items = [rect(2.35, 2.6, point(-1.25, 0.25), measured, "#FFFFFF", 0.02), rect(2.1, waterHeight, point(-1.25, -0.82 + waterHeight / 2), accent, pale, 0.68), rect(2.35, 0.24, point(-1.25, -1.12), measured, pale, 0.85), line(point(-2.25, stageY), point(-0.25, stageY), accent, 4), tex(String.raw`C_r`, point(-1.25, 0.2), accent, 28)];
  if (phase >= 1) items.push(...[-1.85, -1.25, -0.65].map((x) => arrow(point(x, -0.88), point(x, -1.55), accent, 4)), arrow(point(0.45, 1.0), point(0.45, stageY), measured, 4), tex(String.raw`s_r`, point(0.75, 0.15), measured, 24));
  if (phase === 2) items.push(tex(String.raw`q_1+q_2=C_r\frac{\partial s_r}{\partial t}`, point(1.35, -0.55), accent, 23), label("finite channel water", point(-1.25, 1.72), measured));
  return field(items);
}

function scene07(phase, colors) {
  const [accent, measured, pale] = colors;
  const panels = [
    [point(-2.15, 0.72), String.raw`x_D=x/R`],
    [point(0, 0.72), String.raw`t_D=t/(R^2/\alpha_x)`],
    [point(2.15, 0.72), String.raw`s_D=s/H_c`],
    [point(-1.05, -0.72), String.raw`\gamma_D=\gamma R/K_x`],
    [point(1.05, -0.72), String.raw`C_{D,r}=b_D C_r/S`],
  ];
  const count = [2, 4, 5][phase];
  const items = [arrow(point(-3.0, 1.6), point(2.85, 1.6), measured, 3), tex(String.raw`R,\ R^2/\alpha_x,\ H_c`, point(0, 1.9), measured, 22)];
  panels.slice(0, count).forEach(([center, formula], index) => items.push(rect(index < 3 ? 1.85 : 2.35, 0.75, center, index === count - 1 ? accent : measured, pale, 0.3), tex(formula, center, index === count - 1 ? accent : measured, index === 1 ? 19 : 21)));
  return field(items);
}

function scene08(phase, colors) {
  const [accent, measured, pale] = colors;
  const histories = [-1.9, -0.75, 0.4].map((x, index) => [[x, -1.05], [x + 0.18, -0.55], [x + 0.36, 0.05], [x + 0.54, 0.62], [x + 0.72, 0.95 - index * 0.14]]);
  const items = [line(point(-2.85, -1.28), point(0.35, -1.28), measured, 3), tex(String.raw`t_D`, point(0.5, -1.28), measured, 22), ...histories.slice(0, phase + 1).flatMap((points) => trace(points, measured, 3))];
  if (phase >= 1) items.push(arrow(point(0.75, 0), point(1.4, 0), accent, 4), tex(String.raw`\mathcal{L}_{t_D\to p}`, point(1.05, 0.48), accent, 22));
  if (phase === 2) items.push(rect(1.35, 2.45, point(2.25, 0), accent, pale, 0.3), tex(String.raw`\bar{s}_D(x_D,y_D,p)`, point(2.25, 0.25), accent, 21), tex(String.raw`x_D,y_D\ \mathrm{fixed}`, point(2.25, -0.42), measured, 18));
  return field(items);
}

function scene09(phase, colors) {
  const [accent, measured, pale] = colors;
  const profile = [[-2.8, 0.75], [-2.25, 0.32], [-1.7, -0.18], [-1.15, -0.42], [-0.6, -0.1], [-0.05, 0.42]];
  const items = [line(point(-2.8, -1.15), point(0.1, -1.15), measured, 3), tex(String.raw`y_D`, point(0.25, -1.15), measured, 22), ...trace(profile, accent, 4), tex(String.raw`p=p^\ast`, point(-1.35, 1.45), accent, 23)];
  if (phase >= 1) items.push(arrow(point(0.55, 0), point(1.15, 0), accent, 4), tex(String.raw`\mathcal{F}_c`, point(0.85, 0.45), accent, 25));
  const bars = [[1.45, 0.95], [1.8, 0.58], [2.15, 0.32], [2.5, 0.16], [2.85, 0.08]];
  if (phase === 2) items.push(...bars.flatMap(([x, height]) => [line(point(x, -0.95), point(x, -0.95 + height), measured, 5), dot(point(x, -0.95 + height), accent, 0.07)]), tex(String.raw`\tilde{\bar{s}}_D(x_D,\xi,p^\ast)`, point(2.05, 1.45), accent, 19), tex(String.raw`\xi`, point(2.95, -1.2), measured, 22));
  return field(items);
}

function scene10(phase, colors) {
  const [accent, measured, pale] = colors;
  const bars = [[-2.7, 1.0], [-2.25, 0.66], [-1.8, 0.4], [-1.35, 0.22], [-0.9, 0.1]];
  const profile = [[0.7, 0.9], [1.05, 0.52], [1.45, 0.02], [1.85, -0.32], [2.25, -0.12], [2.7, 0.38]];
  const count = [2, 4, 5][phase];
  const items = [...bars.slice(0, count).flatMap(([x, height]) => [line(point(x, -0.95), point(x, -0.95 + height), measured, 5), dot(point(x, -0.95 + height), accent, 0.07)]), tex(String.raw`p=p^\ast`, point(-1.8, 1.45), accent, 23)];
  if (phase >= 1) items.push(arrow(point(-0.45, 0), point(0.25, 0), accent, 4), tex(String.raw`\mathcal{F}_c^{-1}`, point(-0.1, 0.48), accent, 24), label("quadrature", point(-0.1, -0.45), measured));
  if (phase === 2) items.push(line(point(0.65, -1.1), point(2.8, -1.1), measured, 3), ...trace(profile, accent, 5), tex(String.raw`\bar{s}_D(x_D,y_D,p^\ast)`, point(1.78, 1.42), accent, 19), tex(String.raw`y_D`, point(2.92, -1.1), measured, 21), line(point(-3, 1.75), point(2.95, 1.75), pale, 2));
  return field(items);
}

function scene11(phase, colors) {
  const [accent, measured, pale] = colors;
  const samples = [[-2.75, 1.0], [-2.25, 0.72], [-1.75, 0.5], [-1.25, 0.34], [-0.75, 0.22]];
  const aquifer = [[0.6, 1.0], [1.0, 0.6], [1.4, 0.16], [1.8, -0.2], [2.2, -0.5], [2.7, -0.72]];
  const stream = [[0.6, 1.0], [1.0, 1.0], [1.4, 0.92], [1.8, 0.7], [2.2, 0.42], [2.7, 0.18]];
  const items = [...samples.slice(0, 2 + phase).map(([x, y]) => dot(point(x, y), measured, 0.09)), tex(String.raw`\bar{s}_D(p_k)`, point(-1.75, 1.45), measured, 22)];
  if (phase >= 1) items.push(arrow(point(-0.35, 0.2), point(0.3, 0.2), accent, 4), tex(String.raw`\mathcal{L}^{-1}_{\mathrm{Stehfest}}`, point(-0.02, 0.72), accent, 20), tex(String.raw`x_D,y_D\ \mathrm{fixed}`, point(-1.75, -0.25), measured, 18));
  if (phase === 2) items.push(line(point(0.55, -1.05), point(2.8, -1.05), measured, 3), ...trace(aquifer, accent, 5), ...trace(stream, measured, 4), tex(String.raw`t_D`, point(2.92, -1.05), measured, 21), label("aquifer", point(2.38, -0.92), accent), label("stream", point(2.4, 0.42), measured), line(point(-3, -1.55), point(2.95, -1.55), pale, 2));
  return field(items);
}

function scene12(phase, colors) {
  const [accent, measured, pale] = colors;
  const barrier = [[-2.65, -1.0], [-2.1, -0.42], [-1.5, 0.02], [-0.8, 0.36], [0, 0.65], [0.85, 0.9], [1.7, 1.1], [2.55, 1.25]];
  const fixed = [[-2.65, -1.0], [-2.1, -0.5], [-1.5, -0.12], [-0.8, 0.12], [0, 0.24], [0.85, 0.3], [1.7, 0.32], [2.55, 0.33]];
  const finite = barrier.map(([x, y], index) => [x, 0.58 * y + 0.42 * fixed[index][1]]);
  const items = [axes(point(0, -0.15), measured, 5.6, 2.9), ...trace(barrier, measured, 3), ...trace(fixed, pale, 4)];
  if (phase >= 1) items.push(...trace(finite.slice(0, 4 + phase * 2), accent, 5));
  if (phase === 2) items.push(label("Theis / Ferris", point(1.75, 1.45), measured), label("finite storage", point(1.65, 0.78), accent), label("Fox / Hantush", point(1.6, 0.12), measured), tex(String.raw`0<C_{D,r}<\infty`, point(-1.55, 1.5), accent, 20));
  return field(items);
}

function scene13(phase, colors) {
  const [accent, measured, pale] = colors;
  const fluxXs = [-2.7, -2.0, -1.3, -0.6, 0.1];
  const count = [2, 4, 5][phase];
  const items = [rect(3.35, 0.3, point(-1.3, 0.55), measured, pale, 0.85), ...fluxXs.slice(0, count).map((x) => arrow(point(x, 0.35), point(x, -0.52), accent, 3 + phase))];
  if (phase >= 1) items.push(line(point(-2.9, -0.88), point(0.35, -0.88), measured, 4), arrow(point(0.35, -0.88), point(1.0, -0.35), accent, 4), tex(String.raw`\int q_r\,dy`, point(-1.3, -1.3), accent, 23));
  if (phase === 2) items.push(circle(0.82, point(2.0, 0), measured, pale, 0.22, 3), arrow(point(2.0, 0), point(2.48, 0.42), accent, 5), tex(String.raw`Q_{D,r}=Q_r/Q`, point(2.0, -1.2), accent, 23), label("depletion rate", point(2.0, 1.15), measured));
  return field(items);
}

function signal(y, amplitude, frequency, start = -2.8, end = 2.8, samples = 14) {
  return Array.from({ length: samples }, (_, index) => {
    const x = start + (end - start) * index / (samples - 1);
    return [x, y + amplitude * Math.sin(index * frequency)];
  });
}

function scene14(phase, colors) {
  const [accent, measured, pale] = colors;
  const raw = signal(0.9, 0.28, 2.35).map(([x, y], index) => [x, y - index * 0.045]);
  const retained = signal(-0.12, 0.18, 0.72).map(([x, y], index) => [x, y - index * 0.025]);
  const noise = signal(-0.88, 0.12, 2.7);
  const items = [line(point(-2.9, 0.55), point(2.9, 0.55), pale, 2), ...trace(raw, measured, 3)];
  if (phase >= 1) items.push(...trace(retained, accent, 4), ...trace(noise, measured, 2), arrow(point(2.55, 0.5), point(2.55, 0.05), accent, 3));
  if (phase === 2) items.push(rect(5.65, 0.7, point(0, -0.12), accent, pale, 0.12), label("retained SSA component", point(1.7, 0.15), accent), label("discarded noise", point(1.8, -0.95), measured));
  return field(items);
}

function scene15(phase, colors) {
  const [accent, measured, pale] = colors;
  const denoised = signal(0.85, 0.2, 0.78).map(([x, y], index) => [x, y - index * 0.045]);
  const trend = Array.from({ length: 8 }, (_, index) => [-2.8 + index * 0.8, 0.1 - index * 0.09]);
  const pumping = [[-2.8, -0.75], [-2.0, -0.72], [-1.2, -1.0], [-0.4, -0.6], [0.4, -0.96], [1.2, -0.62], [2.0, -0.9], [2.8, -0.66]];
  const items = [...trace(denoised, measured, 4)];
  if (phase >= 1) items.push(...trace(trend, pale, 5), arrow(point(2.5, 0.45), point(2.5, -0.05), accent, 3));
  if (phase === 2) items.push(...trace(pumping, accent, 5), label("trend removed", point(-1.75, 0.12), measured), label("pumping response", point(1.6, -1.15), accent));
  return field(items);
}

function scene16(phase, colors) {
  const [accent, measured, pale] = colors;
  const observations = [[-2.5, -0.9], [-1.85, -0.42], [-1.2, -0.02], [-0.55, 0.28], [0.1, 0.52], [0.75, 0.72], [1.4, 0.9], [2.05, 1.02]];
  const offsets = [0.38, 0.17, 0.04][phase];
  const model = observations.map(([x, y], index) => [x, y + offsets * Math.sin(index * 1.35 + 0.5)]);
  const items = [axes(point(-0.25, -0.15), measured, 4.9, 2.9), ...observations.map(([x, y]) => dot(point(x, y), measured, 0.075)), ...trace(model, accent, 5)];
  if (phase >= 1) items.push(...observations.slice(0, 3 + phase * 2).map(([x, y], index) => line(point(x, y), point(model[index][0], model[index][1]), pale, 3)));
  if (phase === 2) items.push(tex(String.raw`F(\mathbf{Y})=\sum_{n=1}^{N}[s_{\mathrm{obs}}(t_n)-s_{\mathrm{cal}}(t_n;\mathbf{Y})]^2`, point(0, 1.62), accent, 17), tex(String.raw`\mathbf{Y}=\{K_x,S_s,\eta,\gamma,C_r\}`, point(0.45, -1.62), measured, 19));
  return field(items);
}

function matrixCells(centerX, centerY, size, colors, phase, diagonalOnly = false) {
  const [accent, measured, pale] = colors;
  const items = [];
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const selected = diagonalOnly && row === column && row <= phase + 1;
      items.push(rect(0.42, 0.42, point(centerX + column * 0.48, centerY - row * 0.48), selected ? accent : measured, selected ? accent : pale, selected ? 0.62 : 0.22, selected ? 4 : 2));
    }
  }
  return items;
}

function scene17(phase, colors) {
  const [accent, measured, pale] = colors;
  const left = matrixCells(-2.65, 0.8, 4, colors, 0, false);
  const items = [...left, tex(String.raw`J`, point(-1.93, -1.35), measured, 28)];
  if (phase >= 1) items.push(arrow(point(-0.45, 0), point(0.3, 0), accent, 4), tex(String.raw`J^T J`, point(-0.08, 0.48), accent, 22));
  if (phase === 2) items.push(...matrixCells(0.7, 0.8, 4, colors, 0, false), tex(String.raw`V=(J^T J)^{-1}\sigma^2`, point(1.45, -1.35), accent, 23), rect(2.25, 2.25, point(1.42, 0.08), accent, pale, 0.1, 3));
  return field(items);
}

function scene18(phase, colors) {
  const [accent, measured] = colors;
  const items = [...matrixCells(-1.0, 0.78, 5, colors, phase, true), tex(String.raw`V`, point(-0.05, -1.58), measured, 26)];
  if (phase >= 1) items.push(arrow(point(1.55, 0.75), point(2.45, 0.75 - phase * 0.48), accent, 4));
  if (phase === 2) items.push(tex(String.raw`V_{11},V_{22},\ldots,V_{mm}`, point(1.72, -0.72), accent, 22), label("marginal variances", point(1.72, -1.25), measured));
  return field(items);
}

function scene19(phase, colors) {
  const [accent, measured, pale] = colors;
  const heights = [0.65, 1.05, 0.82, 1.3, 0.92];
  const count = [2, 4, 5][phase];
  const items = [line(point(-2.8, -1.15), point(2.8, -1.15), measured, 3)];
  heights.slice(0, count).forEach((height, index) => {
    const x = -2.2 + index * 1.1;
    items.push(rect(0.5, height, point(x, -1.15 + height / 2), measured, pale, 0.52));
    if (phase >= 1) items.push(line(point(x, -1.15 + height), point(x, -0.95 + height), accent, 4), line(point(x - 0.16, -0.95 + height), point(x + 0.16, -0.95 + height), accent, 4));
  });
  if (phase === 2) items.push(tex(String.raw`SE_j=\sqrt{V_{jj}}`, point(0, 1.55), accent, 27), tex(String.raw`K_x\quad S_s\quad\eta\quad\gamma\quad C_r`, point(0, -1.58), measured, 20));
  return field(items);
}

function scene20(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = streamAquiferBase(colors, Math.max(1, phase), true);
  if (phase >= 1) {
    const aquifer = [[-2.75, -1.12], [-2.25, -0.8], [-1.75, -0.42], [-1.25, -0.1], [-0.75, 0.12]];
    const stream = [[-2.75, -1.12], [-2.25, -1.12], [-1.75, -1.05], [-1.25, -0.88], [-0.75, -0.64]];
    items.push(...trace(aquifer, accent, 4), ...trace(stream, measured, 4));
  }
  if (phase === 2) {
    const depletion = [[0.45, -1.05], [0.85, -0.48], [1.25, -0.05], [1.65, 0.18], [2.05, 0.08], [2.45, -0.22], [2.8, -0.52]];
    items.push(...trace(depletion, accent, 5), tex(String.raw`Q_r/Q`, point(2.55, 0.2), accent, 20), tex(String.raw`s_r(t)\ \mathrm{delayed}`, point(-1.7, -1.5), measured, 20), label("finite stream supply", point(1.55, -1.42), accent), line(point(-3.0, 1.7), point(2.95, 1.7), pale, 2));
  }
  return field(items);
}

function sceneFromText(text) {
  if (/finite stream supply|stenner creek.*depletion hydrograph|limits the duration and magnitude/.test(text)) return 20;
  if (/conditional standard errors|standard-error whiskers|compute standard errors/.test(text)) return 19;
  if (/covariance diagonal|diagonal cells illuminated|extract diagonal variances/.test(text)) return 18;
  if (/parameter covariance|residual-sensitivity matrix becoming|form the parameter covariance/.test(text)) return 17;
  if (/parameter fit|nps curve bending|fit hydraulic parameters/.test(text)) return 16;
  if (/eemd detrending|trend and pumping-response|ensemble empirical/.test(text)) return 15;
  if (/ssa denoising|retained and discarded components|singular-spectrum/.test(text)) return 14;
  if (/stream depletion|depletion-rate gauge|integrate streambed flux/.test(text)) return 13;
  if (/storage limits|zero-storage and infinite-storage|compare limiting cases/.test(text)) return 12;
  if (/invert laplace time|stehfest|laplace-domain profiles returning|physical-time aquifer and stream/.test(text)) return 11;
  if (/invert cosine spectrum|fourier-cosine spectra resolving|evaluate fourier-cosine inversion/.test(text)) return 10;
  if (/cosine space transform|fourier-cosine bands|transform along-stream/.test(text)) return 9;
  if (/laplace time transform|collapsing along a laplace|transform time coordinate/.test(text)) return 8;
  if (/dimensionless groups|collapsing onto unit scales|normalize flow variables/.test(text)) return 7;
  if (/finite channel storage|stream-storage column shrinking|stream channel mass balance/.test(text)) return 6;
  if (/conductance.*head difference|vertical leakage arrows|streambed conductance relation/.test(text)) return 5;
  if (/aquifer drawdown|plan-view pumping sink|form aquifer flow equation/.test(text)) return 4;
  if (/stream response lags|visible onset lag|begins later than aquifer/.test(text)) return 3;
  if (/fixed stage fails|fixed-stage boundary|late-rising drawdown/.test(text)) return 2;
  if (/pumping captures streamflow|stream cross-section above a pumping cone|declining discharge/.test(text)) return 1;
  return null;
}

export function renderPaperVisual2024_06_20(context) {
  const unpacked = unpackContext(context);
  if (!unpacked.text.includes(PAPER_MARKER)) return null;
  const scene = unpacked.scene ?? sceneFromText(unpacked.text);
  switch (scene) {
    case 1: return scene01(unpacked.phase, unpacked.colors);
    case 2: return scene02(unpacked.phase, unpacked.colors);
    case 3: return scene03(unpacked.phase, unpacked.colors);
    case 4: return scene04(unpacked.phase, unpacked.colors);
    case 5: return scene05(unpacked.phase, unpacked.colors);
    case 6: return scene06(unpacked.phase, unpacked.colors);
    case 7: return scene07(unpacked.phase, unpacked.colors);
    case 8: return scene08(unpacked.phase, unpacked.colors);
    case 9: return scene09(unpacked.phase, unpacked.colors);
    case 10: return scene10(unpacked.phase, unpacked.colors);
    case 11: return scene11(unpacked.phase, unpacked.colors);
    case 12: return scene12(unpacked.phase, unpacked.colors);
    case 13: return scene13(unpacked.phase, unpacked.colors);
    case 14: return scene14(unpacked.phase, unpacked.colors);
    case 15: return scene15(unpacked.phase, unpacked.colors);
    case 16: return scene16(unpacked.phase, unpacked.colors);
    case 17: return scene17(unpacked.phase, unpacked.colors);
    case 18: return scene18(unpacked.phase, unpacked.colors);
    case 19: return scene19(unpacked.phase, unpacked.colors);
    case 20: return scene20(unpacked.phase, unpacked.colors);
    default: return null;
  }
}
