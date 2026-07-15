const PAPER_MARKER = "[paper:2021-07-33]";
const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];
const DPA_COLOR = "#B5523A";
const WHITE = "#FFFFFF";

const q = (value) => JSON.stringify(value);
const point = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (center, color, radius = 0.08) => `Dot(${q(center)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, center, stroke, fill = WHITE, opacity = 0, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const rect = (width, height, center, stroke, fill, opacity = 0.2, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).move_to(${q(center)})`;
const polygon = (points, stroke, fill, opacity = 0.2, width = 3) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity})`;
const tex = (value, center, color, size = 23) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const label = (value, center, color, size = 18) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(center)})`;
const axes = (center, color, width = 5.5, height = 2.8, xRange = [0, 6, 1], yRange = [0, 4, 1]) => `Axes(x_range=${q(xRange)}, y_range=${q(yRange)}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).move_to(${q(center)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((item, index) => line(point(item[0], item[1]), point(points[index + 1][0], points[index + 1][1]), color, width));
const field = (items) => `VGroup(${items.flat().filter(Boolean).join(", ")}).scale(0.67).shift([-1.45, 0.12, 0])`;

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

function unpackContext(context, phase, palette) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return { text: normalizeText(context), phase: phaseOf(phase), colors: paletteOf(palette), scene: null };
  }
  const sceneValue = Number(context.scene ?? context.sceneNumber ?? context.index);
  return {
    text: normalizeText(context),
    phase: phaseOf(context.phase ?? phase),
    colors: paletteOf(context.palette ?? palette),
    scene: Number.isInteger(sceneValue) && sceneValue >= 1 && sceneValue <= 22 ? sceneValue : null,
  };
}

function aquiferSection(colors, phase, includeAquitard = false) {
  const [accent, measured, pale] = colors;
  const items = [
    rect(5.7, 1.55, point(0, -0.55), measured, pale, 0.46, 2),
    rect(0.22, 2.65, point(0.75, 0), accent, WHITE, 0.05, 5),
    arrow(point(0.75, 1.55), point(0.75, 1.05), accent, 5),
    tex(String.raw`Q\ [L^3T^{-1}]`, point(1.35, 1.38), accent, 20),
    ...[-2.5, -1.65, -0.8, 1.55, 2.35].flatMap((x, index) => [
      line(point(x - 0.22, -0.95 + 0.14 * (index % 2)), point(x + 0.2, -0.45 + 0.08 * (index % 2)), measured, 2),
      line(point(x - 0.18, -0.2), point(x + 0.2, -0.2), measured, 2),
    ]),
    circle(0.55, point(-1.8, -0.45), measured, pale, 0.55, 3),
    circle(0.48, point(-0.55, -0.7), measured, pale, 0.55, 3),
  ];
  if (phase >= 1) {
    items.push(
      arrow(point(-1.45, -0.45), point(-0.95, -0.45), accent, 4),
      arrow(point(-0.22, -0.7), point(0.28, -0.7), accent, 4),
      tex(String.raw`\Gamma`, point(-0.95, -0.08), accent, 25),
    );
  }
  if (includeAquitard) {
    items.push(rect(5.7, 0.52, point(0, 0.53), measured, pale, 0.72, 2));
    if (phase >= 1) items.push(...[-1.2, 0, 1.8].map((x) => arrow(point(x, 0.82), point(x, 0.02), DPA_COLOR, 4)));
  }
  return items;
}

function timeBands(colors) {
  const [, measured, pale] = colors;
  return [
    rect(1.72, 2.65, point(-1.86, 0), measured, pale, 0.26, 1),
    rect(1.72, 2.65, point(0, 0), measured, pale, 0.42, 1),
    rect(1.72, 2.65, point(1.86, 0), measured, pale, 0.2, 1),
    label("early", point(-1.86, -1.62), measured, 16),
    label("intermediate", point(0, -1.62), measured, 16),
    label("late", point(1.86, -1.62), measured, 16),
  ];
}

function scene01(phase, colors) {
  const [accent, measured] = colors;
  const items = aquiferSection(colors, phase, false);
  if (phase >= 1) items.push(tex(String.raw`s_f\ [L]`, point(1.45, -0.25), accent, 23));
  if (phase === 2) items.push(tex(String.raw`s_m\ [L]`, point(-1.8, -1.18), measured, 23), label("fast fracture", point(1.95, -1.05), accent), label("slow matrix", point(-1.8, 0.22), measured));
  return field(items);
}

function scene02(phase, colors) {
  const [accent, measured] = colors;
  const fot = [[-2.65, -1.18], [-2.05, -0.92], [-1.4, -0.35], [-0.7, 0.45], [0, 1.05], [0.7, 1.18], [1.45, 1.28], [2.65, 1.78]];
  const sot = [[-2.65, -1.18], [-2.05, -1.02], [-1.4, -0.62], [-0.7, -0.08], [0, 0.42], [0.7, 0.92], [1.45, 1.32], [2.65, 1.78]];
  const dpa = [[-2.65, -1.18], [-2.05, -1.0], [-1.4, -0.55], [-0.7, -0.02], [0, 0.48], [0.7, 0.96], [1.45, 1.35], [2.65, 1.78]];
  const items = [axes(point(0, 0), measured, 5.7, 3.1), ...timeBands(colors), ...trace(fot.slice(0, 4 + phase * 2), accent, 5)];
  if (phase >= 1) items.push(...trace(sot.slice(0, 4 + phase * 2), measured, 4), ...trace(dpa.slice(0, 4 + phase * 2), DPA_COLOR, 3));
  if (phase === 2) items.push(label("FOT: S-curve", point(-0.55, 1.62), accent), label("SOT", point(2.42, 1.42), measured), label("distributed", point(2.3, 0.95), DPA_COLOR), tex(String.raw`t\ [\mathrm{s}]`, point(2.72, -1.38), measured, 19), tex(String.raw`s_f\ [\mathrm{m}]`, point(-2.82, 1.42), measured, 19));
  return field(items);
}

function scene03(phase, colors) {
  const [accent, measured] = colors;
  const items = aquiferSection(colors, phase, true);
  if (phase >= 1) items.push(label("aquitard leakage", point(1.85, 0.98), DPA_COLOR));
  if (phase === 2) items.push(tex(String.raw`\gamma=K'/(b'b)`, point(1.95, 0.48), DPA_COLOR, 23), tex(String.raw`\gamma\ [L^{-1}T^{-1}]`, point(2.05, -1.35), measured, 20), tex(String.raw`\Gamma\ [T^{-1}]`, point(-1.1, -1.35), accent, 20));
  return field(items);
}

function scene04(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = aquiferSection(colors, Math.max(1, phase), true);
  items.push(rect(2.05, 0.64, point(2.05, -0.05), accent, pale, 0.42), tex(String.raw`S_{sf}\,\partial_t s_f`, point(2.05, -0.05), accent, 22));
  if (phase >= 1) items.push(arrow(point(-0.8, -0.45), point(1.05, -0.25), accent, 4), tex(String.raw`-\Gamma`, point(1.2, -0.62), accent, 22), tex(String.raw`-\gamma s_f`, point(1.95, 0.5), DPA_COLOR, 22));
  if (phase === 2) items.push(rect(2.35, 0.68, point(-1.72, -1.38), measured, pale, 0.4), tex(String.raw`S_{sm}\,\partial_t s_m=\Gamma`, point(-1.72, -1.38), measured, 22), tex(String.raw`\Gamma\ [T^{-1}]`, point(1.95, -1.12), accent, 20));
  return field(items);
}

function scene05(phase, colors) {
  const [accent, measured, pale] = colors;
  const x = [-2.45, -0.6, 1.25][phase];
  const items = [
    line(point(-2.45, 0.25), point(2.45, 0.25), measured, 5),
    circle(0.17, point(-2.45, 0.25), accent, accent, 1, 3),
    circle(0.17, point(2.45, 0.25), DPA_COLOR, DPA_COLOR, 1, 3),
    label("FOT", point(-2.45, 0.72), accent, 19),
    label("SOT", point(2.45, 0.72), DPA_COLOR, 19),
    circle(0.23, point(x, 0.25), measured, pale, 0.85, 4),
    tex(String.raw`\omega`, point(x, -0.2), measured, 25),
    tex(String.raw`\Gamma=K_m\sigma(s_f-s_m)`, point(-1.62, 1.48), accent, 21),
  ];
  if (phase >= 1) items.push(tex(String.raw`0\le\omega\le1`, point(0, -0.75), measured, 28), arrow(point(-0.7, -1.25), point(0.55, -1.25), accent, 3));
  if (phase === 2) items.push(tex(String.raw`\Gamma=K_m\sigma(s_f^2-s_m^2)/s_m`, point(1.5, 1.48), DPA_COLOR, 20), rect(5.75, 0.75, point(0, -1.48), accent, pale, 0.24), tex(String.raw`\Gamma=K_m\sigma\left(\frac{s_f^2}{\omega s_m+(1-\omega)s_f}-s_m\right)`, point(0, -1.48), accent, 21), tex(String.raw`[\Gamma]=T^{-1}`, point(2.45, -0.78), measured, 18));
  return field(items);
}

function scene06(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [
    circle(0.24, point(-2.35, 0), accent, pale, 0.5, 4),
    ...[0.62, 1.08, 1.5].map((r) => circle(r, point(-2.35, 0), measured, WHITE, 0, 2)),
    tex(String.raw`r\ [L]`, point(-0.82, -1.05), measured, 20),
    tex(String.raw`t\ [T]`, point(-2.35, 1.72), measured, 20),
    tex(String.raw`s_f\ [L]`, point(-2.35, -1.72), accent, 20),
  ];
  if (phase >= 1) items.push(arrow(point(-0.42, 0), point(0.32, 0), accent, 4), label("dimensionless", point(0, 0.42), accent));
  if (phase === 2) items.push(rect(2.7, 2.8, point(1.75, 0), measured, pale, 0.22), tex(String.raw`s_{fD}=\frac{4\pi K_fb}{Q}s_f`, point(1.75, 0.92), accent, 22), tex(String.raw`r_D=r/r_w`, point(1.75, 0.25), measured, 23), tex(String.raw`t_D=\frac{K_ft}{S_{sf}r_w^2}`, point(1.75, -0.43), measured, 22), tex(String.raw`S_D,C_D,\gamma_D,\sigma_D,K_D\ [-]`, point(1.75, -1.12), accent, 18));
  return field(items);
}

function scene07(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(2.2, 0.75, point(-2.0, 0.9), measured, pale, 0.28), tex(String.raw`f^v`, point(-2.0, 0.9), measured, 30), arrow(point(-0.7, 0.9), point(0.15, 0.9), accent, 4), tex(String.raw`\mathcal L`, point(-0.28, 1.25), accent, 25)];
  if (phase >= 1) items.push(rect(3.0, 0.78, point(1.65, 0.9), accent, pale, 0.25), tex(String.raw`\mathcal L\{f^v\}=p^{v-1}\bar f^{\,v}`, point(1.65, 0.9), accent, 23));
  if (phase === 2) items.push(rect(5.4, 1.1, point(0, -0.75), measured, pale, 0.2), tex(String.raw`\mathcal L\left\{f^v,\frac{df}{dt}\right\}=p^v\bar f^{\,v}\mathcal L\left\{\frac{df}{dt}\right\}`, point(0, -0.75), measured, 22), label("successive integration by parts", point(0, -1.55), accent, 18));
  return field(items);
}

function scene08(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(2.4, 1.0, point(-2.0, 0.55), measured, pale, 0.35), tex(String.raw`\bar s_{mD}`, point(-2.0, 0.55), measured, 28), arrow(point(-0.55, 0.55), point(0.25, 0.55), accent, 4), tex(String.raw`\pm`, point(-0.15, 0.95), measured, 25)];
  if (phase >= 1) items.push(arrow(point(0.35, 0.78), point(1.15, 1.18), measured, 3), arrow(point(0.35, 0.32), point(1.15, -0.1), accent, 5), label("positive drawdown", point(1.92, -0.38), accent, 18), line(point(1.12, 1.02), point(2.48, 1.36), DPA_COLOR, 4), line(point(1.12, 1.36), point(2.48, 1.02), DPA_COLOR, 4));
  if (phase === 2) items.push(rect(3.0, 0.9, point(1.55, -0.98), accent, pale, 0.34), tex(String.raw`\bar s_{mD}=\psi\bar s_{fD}`, point(1.55, -0.98), accent, 27), tex(String.raw`\bar s_{fD},\bar s_{mD}>0`, point(-1.6, -1.15), measured, 21));
  return field(items);
}

function scene09(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(2.05, 0.85, point(-2.2, 0.85), measured, pale, 0.35), tex(String.raw`\bar s_{mD}`, point(-2.2, 0.85), measured, 26), rect(2.05, 0.85, point(-2.2, -0.55), accent, pale, 0.35), tex(String.raw`\bar s_{fD}`, point(-2.2, -0.55), accent, 26)];
  if (phase >= 1) items.push(arrow(point(-1.02, 0.85), point(0, -0.15), accent, 4), tex(String.raw`\bar s_{mD}\mapsto\psi\bar s_{fD}`, point(0.35, 1.15), accent, 23));
  if (phase === 2) items.push(rect(2.8, 1.75, point(1.65, -0.35), accent, pale, 0.25), tex(String.raw`\bar s_{fD}`, point(1.65, 0.2), accent, 30), tex(String.raw`r_D\in[1,\infty)`, point(1.65, -0.48), measured, 22), label("one radial unknown", point(1.65, -1.0), accent, 18), arrow(point(-0.98, -0.55), point(0.15, -0.45), accent, 4));
  return field(items);
}

function scene10(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(5.65, 0.82, point(0, 1.2), measured, pale, 0.25), tex(String.raw`\bar s_{fD}=a_1I_0(\Omega r_D)+a_2K_0(\Omega r_D)`, point(0, 1.2), measured, 24), axes(point(0, -0.38), measured, 5.3, 2.15)];
  const growing = [[-2.45, -1.12], [-1.75, -0.98], [-1.0, -0.62], [-0.25, -0.05], [0.55, 0.62], [1.35, 1.08]];
  const decaying = [[-2.45, 0.95], [-1.75, 0.6], [-1.0, 0.28], [-0.25, 0.02], [0.55, -0.22], [1.35, -0.42], [2.45, -0.58]];
  items.push(...trace(growing.slice(0, 3 + phase), DPA_COLOR, 3), ...trace(decaying.slice(0, 4 + phase), accent, 5));
  if (phase >= 1) items.push(tex(String.raw`\lim_{r_D\to\infty}\bar s_{fD}=0`, point(1.72, 0.55), accent, 20));
  if (phase === 2) items.push(line(point(-0.9, -0.12), point(1.48, 1.18), DPA_COLOR, 4), line(point(-0.9, 1.18), point(1.48, -0.12), DPA_COLOR, 4), tex(String.raw`a_1=0`, point(-1.6, 0.3), DPA_COLOR, 23), label("retain K0 branch", point(1.68, -1.28), accent, 18));
  return field(items);
}

function scene11(phase, colors) {
  const [accent, measured, pale] = colors;
  const sf = [[-2.55, -1.18], [-1.95, -1.02], [-1.35, -0.58], [-0.7, 0.1], [0, 0.75], [0.75, 1.02], [1.55, 1.13], [2.55, 1.7]];
  const sm = [[-2.55, -1.18], [-1.95, -1.16], [-1.35, -1.05], [-0.7, -0.75], [0, -0.28], [0.75, 0.38], [1.55, 0.95], [2.55, 1.68]];
  const items = [axes(point(0, 0), measured, 5.6, 3.05), tex(String.raw`\bar s_{fD},\bar s_{mD}`, point(-1.9, 1.62), measured, 20), arrow(point(-0.85, 1.55), point(0.15, 1.55), accent, 4), label("CME", point(-0.35, 1.83), accent, 18), ...trace(sf.slice(0, 4 + phase * 2), accent, 5)];
  if (phase >= 1) items.push(...trace(sm.slice(0, 4 + phase * 2), measured, 4));
  if (phase === 2) items.push(tex(String.raw`s_{fD}(t_D)`, point(2.2, 1.43), accent, 21), tex(String.raw`s_{mD}(t_D)`, point(2.18, 0.75), measured, 21), label("monotone S-curves", point(0.25, -1.5), accent, 18));
  return field(items);
}

function scene12(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [line(point(-2.75, 0), point(-0.3, 0), measured, 5), ...[-2.75, -2.15, -1.55, -0.95].map((x) => circle(0.07, point(x, 0), accent, accent, 1, 2)), tex(String.raw`1\le r_D<\infty`, point(-1.55, 0.55), measured, 24)];
  if (phase >= 1) items.push(arrow(point(-0.05, 0), point(0.75, 0), accent, 4), tex(String.raw`r'_D=1/r_D`, point(0.35, 0.48), accent, 24));
  if (phase === 2) items.push(rect(2.55, 0.72, point(2.0, 0), accent, pale, 0.35), line(point(0.9, 0), point(3.1, 0), accent, 5), ...[0.9, 1.45, 2.0, 2.55, 3.1].map((x) => dot(point(x, 0), measured, 0.08)), tex(String.raw`0\le r'_D\le1`, point(2.0, -0.62), accent, 24), label("Kelvin transform", point(0, -1.35), measured, 18));
  return field(items);
}

function scene13(phase, colors) {
  const [accent, measured, pale] = colors;
  const count = [7, 13, 25][phase];
  const items = [rect(5.6, 1.05, point(0, 0), measured, pale, 0.28), line(point(-2.65, 0), point(2.65, 0), accent, 5)];
  for (let index = 0; index < count; index += 1) {
    const x = -2.65 + (5.3 * index) / (count - 1);
    items.push(line(point(x, -0.48), point(x, 0.48), index % 2 ? measured : accent, index % 2 ? 2 : 3));
  }
  items.push(tex(String.raw`0\le r'_D\le1`, point(0, 1.05), measured, 23));
  if (phase >= 1) items.push(label("finite-element mesh", point(0, -0.92), accent, 19));
  if (phase === 2) items.push(tex(String.raw`\max(\Delta r'_D)=10^{-4}`, point(0, -1.48), accent, 25), tex(String.raw`r'_D\ [-]`, point(2.65, 0.78), measured, 18));
  return field(items);
}

function scene14(phase, colors) {
  const [accent, measured, pale] = colors;
  const radii = [0.48, 0.92, 1.38];
  const items = radii.map((radius, index) => circle(radius, point(-2.15, 0), index === phase ? accent : measured, WHITE, 0, index === phase ? 5 : 2));
  items.push(circle(0.18, point(-2.15, 0), accent, pale, 0.6, 4), tex(String.raw`Q`, point(-2.15, 0.4), accent, 22));
  if (phase >= 1) items.push(...[[-1.67, String.raw`1\,\mathrm m`, 0.28], [-1.23, String.raw`5\,\mathrm m`, -0.18], [-0.77, String.raw`10\,\mathrm m`, -0.62]].map(([x, value, y]) => tex(value, point(x, y), measured, 18)), arrow(point(-0.55, 0), point(0.15, 0), accent, 4));
  if (phase === 2) {
    const curves = [
      [[0.35, -0.9], [0.9, -0.55], [1.45, 0.05], [2.05, 0.72], [2.7, 1.25]],
      [[0.35, -1.15], [0.9, -1.02], [1.45, -0.72], [2.05, -0.2], [2.7, 0.5]],
      [[0.35, -1.25], [0.9, -1.2], [1.45, -1.08], [2.05, -0.78], [2.7, -0.15]],
    ];
    items.push(axes(point(1.55, 0), measured, 2.8, 2.65), ...curves.flatMap((curvePoints, index) => trace(curvePoints, index === 0 ? accent : measured, index === 0 ? 5 : 3)), tex(String.raw`1\,\mathrm s\le t\le1.16\,\mathrm{days}`, point(1.55, -1.55), measured, 18));
  }
  return field(items);
}

function scene15(phase, colors) {
  const [accent, measured] = colors;
  const curves = [
    [[-2.55, -1.05], [-1.75, -0.7], [-0.85, 0.05], [0.05, 0.72], [0.95, 1.3]],
    [[-2.55, -1.27], [-1.75, -1.14], [-0.85, -0.82], [0.05, -0.25], [0.95, 0.45]],
    [[-2.55, -1.35], [-1.75, -1.31], [-0.85, -1.16], [0.05, -0.83], [0.95, -0.28]],
  ];
  const items = [axes(point(-0.65, 0), measured, 4.3, 2.9), ...curves.slice(0, phase + 1).flatMap((points) => trace(points, accent, 4))];
  curves.slice(0, phase + 1).forEach((points) => points.forEach(([x, y]) => items.push(dot(point(x, y), measured, 0.065))));
  items.push(label("analytical", point(1.95, 1.15), accent), label("FEM samples", point(1.95, 0.65), measured));
  if (phase >= 1) items.push(tex(String.raw`r=1,5,10\ \mathrm m`, point(1.95, -0.05), accent, 22));
  if (phase === 2) items.push(rect(2.65, 0.82, point(1.85, -1.0), accent, colors[2], 0.3), tex(String.raw`1\,\mathrm s\to1.16\,\mathrm{days}`, point(1.85, -1.0), measured, 19), label("agreement", point(1.85, -1.55), accent, 20));
  return field(items);
}

function scene16(phase, colors) {
  const [accent, measured, pale] = colors;
  const fluxFamilies = [
    [[-2.45, 0.55], [-1.75, 0.62], [-1.05, 0.92], [-0.35, 1.3], [0.35, 1.08], [1.1, 0.72], [2.35, 0.58]],
    [[-2.45, 0.55], [-1.75, 0.66], [-1.05, 1.0], [-0.35, 1.42], [0.35, 1.12], [1.1, 0.73], [2.35, 0.58]],
    [[-2.45, 0.55], [-1.75, 0.7], [-1.05, 1.1], [-0.35, 1.55], [0.35, 1.16], [1.1, 0.74], [2.35, 0.58]],
    [[-2.45, 0.55], [-1.75, 0.76], [-1.05, 1.22], [-0.35, 1.68], [0.35, 1.2], [1.1, 0.75], [2.35, 0.58]],
    [[-2.45, 0.55], [-1.75, 0.82], [-1.05, 1.35], [-0.35, 1.8], [0.35, 1.24], [1.1, 0.76], [2.35, 0.58]],
  ];
  const fractureFamilies = fluxFamilies.map((_, index) => [[-2.45, -1.62], [-1.75, -1.48], [-1.05, -1.18 - index * 0.035], [-0.35, -0.83 - index * 0.06], [0.35, -0.55 - index * 0.045], [1.1, -0.28], [2.35, -0.08]]);
  const matrixFamilies = fluxFamilies.map((_, index) => [[-2.45, -1.72], [-1.75, -1.7], [-1.05, -1.6 + index * 0.025], [-0.35, -1.38 + index * 0.055], [0.35, -0.92 + index * 0.045], [1.1, -0.42], [2.35, -0.08]]);
  const count = [2, 4, 5][phase];
  const items = [
    axes(point(0, 1.12), measured, 5.35, 1.25),
    axes(point(0, -0.9), measured, 5.35, 1.25),
    ...fluxFamilies.slice(0, count).flatMap((points, index) => trace(points, index === count - 1 ? accent : measured, index === count - 1 ? 4 : 2)),
    tex(String.raw`\omega=0,0.25,0.5,0.75,1`, point(0, 1.92), accent, 20),
    tex(String.raw`\Gamma\ [10^{-12}\,\mathrm{s}^{-1}]`, point(-1.85, 1.62), measured, 17),
  ];
  if (phase >= 1) items.push(...fractureFamilies.slice(0, count).flatMap((points, index) => trace(points, index === count - 1 ? accent : measured, index === count - 1 ? 4 : 2)), label("larger omega: larger transfer flux", point(1.25, 1.58), accent, 15));
  if (phase === 2) items.push(...matrixFamilies.flatMap((points) => trace(points, DPA_COLOR, 2)), tex(String.raw`s_f,s_m\ [\mathrm m]`, point(-1.92, -0.28), measured, 17), tex(String.raw`t\approx10^5\ \mathrm s`, point(1.82, -1.65), measured, 17), rect(1.3, 0.42, point(2.0, -0.12), accent, pale, 0.3), label("late convergence", point(2.0, -0.12), accent, 14));
  return field(items);
}

function scene17(phase, colors) {
  const [accent, measured] = colors;
  const items = [axes(point(0, -0.12), measured, 5.65, 2.75, [0, 6, 1], [-4, 0, 1]), ...timeBands(colors), tex(String.raw`X_{i,k}=P_k\frac{\partial O_i}{\partial P_k}`, point(-1.45, 1.6), accent, 22)];
  const curves = [
    [[-2.5, -1.02], [-1.8, -0.95], [-1.1, -0.48], [-0.35, 0.5], [0.4, 0.98], [1.2, 1.38], [2.5, 1.72]],
    [[-2.5, -1.02], [-1.8, -0.72], [-1.1, 0.22], [-0.35, -0.12], [0.4, -0.72], [1.2, -0.98], [2.5, -1.02]],
    [[-2.5, -1.02], [-1.8, -1.02], [-1.1, -0.85], [-0.35, -0.1], [0.4, 0.25], [1.2, -0.52], [2.5, -0.98]],
    [[-2.5, -1.02], [-1.8, -1.02], [-1.1, -1.02], [-0.35, -0.95], [0.4, -0.42], [1.2, 0.28], [2.5, -0.18]],
    [[-2.5, -1.02], [-1.8, -1.02], [-1.1, -1.02], [-0.35, -1.02], [0.4, -0.98], [1.2, -0.82], [2.5, 0.4]],
  ];
  items.push(...trace(curves[0].slice(0, 4 + phase), accent, 5));
  if (phase >= 1) items.push(...curves.slice(1, 4).flatMap((points) => trace(points.slice(0, 4 + phase), measured, 3)), tex(String.raw`\Delta P_k=10^{-3}P_k`, point(1.55, 1.58), measured, 20));
  if (phase === 2) items.push(...trace(curves[4], DPA_COLOR, 3), tex(String.raw`K_f`, point(2.45, 1.48), accent, 20), tex(String.raw`S_{sf}`, point(-1.05, 0.62), measured, 20), tex(String.raw`\sigma K_m,\omega`, point(0.25, 0.55), measured, 18), tex(String.raw`S_{sm}`, point(1.25, 0.58), measured, 20), tex(String.raw`\gamma`, point(2.4, 0.62), DPA_COLOR, 20), tex(String.raw`X_{i,k}<0`, point(-2.35, -1.45), measured, 18));
  return field(items);
}

function fittedCurveScene(phase, colors, site) {
  const [accent, measured, pale] = colors;
  const whiteshell = site === "Whiteshell";
  const present = whiteshell
    ? [[-2.55, -1.2], [-1.9, -1.12], [-1.25, -0.94], [-0.55, -0.55], [0.15, 0.02], [0.9, 0.68], [1.7, 1.22], [2.55, 1.65]]
    : [[-2.55, -1.05], [-1.9, -0.2], [-1.25, 0.52], [-0.55, 0.92], [0.15, 1.08], [0.9, 1.22], [1.7, 1.48], [2.55, 1.73]];
  const fot = present.map(([x, y], index) => [x, y + (whiteshell ? 0.18 : 0.13) * Math.max(0, 4 - index) / 4]);
  const sot = present.map(([x, y], index) => [x, y - (whiteshell ? 0.13 : 0.1) * Math.max(0, 4 - index) / 4]);
  const items = [axes(point(0, 0), measured, 5.6, 3.0), ...trace(present.slice(0, 4 + phase * 2), accent, 5)];
  if (phase >= 1) items.push(...trace(fot.slice(0, 4 + phase * 2), measured, 3), ...trace(sot.slice(0, 4 + phase * 2), DPA_COLOR, 3));
  if (phase === 2) {
    present.forEach(([x, y], index) => items.push(circle(0.07, point(x, y + (index % 2 ? 0.04 : -0.03)), measured, WHITE, 1, 2)));
    items.push(rect(1.55, 0.58, point(1.95, -0.82), accent, pale, 0.38), tex(whiteshell ? String.raw`\omega=0.31` : String.raw`\omega=0.77`, point(1.95, -0.82), accent, 25), label("present", point(-1.85, 1.58), accent), label("FOT", point(-0.75, 1.58), measured), label("SOT", point(0.15, 1.58), DPA_COLOR), tex(whiteshell ? String.raw`r=71.63\ \mathrm m` : String.raw`r=0.0825\ \mathrm m`, point(1.85, 1.55), measured, 18), tex(String.raw`s_f\ [\mathrm m],\ t\ [\mathrm s]`, point(0, -1.55), measured, 18));
  }
  return field(items);
}

function scene18(phase, colors) {
  const expression = fittedCurveScene(phase, colors, "Whiteshell");
  if (phase < 2) return expression;
  return expression.replace(/\)\.scale\(0\.67\)/, `, ${tex(String.raw`\gamma>0`, point(2.65, -1.35), DPA_COLOR, 18)}).scale(0.67)`);
}

const METRICS = {
  Whiteshell: {
    omega: ["0.31", "0", "1"],
    rows: [
      ["SEE (m)", "2.49\\times10^{-2}", "3.05\\times10^{-2}", "2.57\\times10^{-2}"],
      ["ME (m)", "-2.22\\times10^{-4}", "-1.14\\times10^{-3}", "-1.66\\times10^{-3}"],
      ["AIC (-)", "-136.04", "-128.26", "-133.29"],
      ["BIC (-)", "-130.38", "-123.53", "-128.57"],
    ],
  },
  Maheshwaram: {
    omega: ["0.77", "0", "1"],
    rows: [
      ["SEE (m)", "4.44\\times10^{-2}", "5.23\\times10^{-2}", "6.82\\times10^{-2}"],
      ["ME (m)", "-1.03\\times10^{-3}", "-1.08\\times10^{-3}", "-1.89\\times10^{-3}"],
      ["AIC (-)", "-288.39", "-261.83", "-238.48"],
      ["BIC (-)", "-279.36", "-254.60", "-231.25"],
    ],
  },
};

function metricScene(phase, colors, site) {
  const [accent, measured, pale] = colors;
  const data = METRICS[site];
  const count = [1, 3, 4][phase];
  const xs = [-1.25, 0.25, 1.75];
  const items = [rect(1.35, 3.15, point(xs[0], -0.08), accent, pale, 0.36, 2), label("present", point(xs[0], 1.66), accent, 18), label("FOT", point(xs[1], 1.66), measured, 18), label("SOT", point(xs[2], 1.66), DPA_COLOR, 18), tex(String.raw`\omega`, point(-2.65, 1.2), measured, 20)];
  data.omega.forEach((value, index) => items.push(tex(value, point(xs[index], 1.2), index === 0 ? accent : measured, 19)));
  data.rows.slice(0, count).forEach((row, rowIndex) => {
    const y = 0.55 - rowIndex * 0.68;
    items.push(label(row[0], point(-2.62, y), measured, 16));
    row.slice(1).forEach((value, columnIndex) => items.push(tex(value, point(xs[columnIndex], y), columnIndex === 0 ? accent : measured, 17)));
  });
  if (phase >= 1) items.push(label("lower reported values", point(2.2, -1.55), accent, 16));
  if (phase === 2) items.push(line(point(-1.82, -1.38), point(-0.68, -1.38), accent, 5), label(site, point(-2.15, -1.62), measured, 16));
  return field(items);
}

function scene19(phase, colors) {
  return metricScene(phase, colors, "Whiteshell");
}

function scene20(phase, colors) {
  const expression = fittedCurveScene(phase, colors, "Maheshwaram");
  if (phase < 2) return expression;
  return expression.replace(/\)\.scale\(0\.67\)/, `, ${tex(String.raw`\gamma=0`, point(2.65, -1.35), DPA_COLOR, 18)}).scale(0.67)`);
}

function scene21(phase, colors) {
  return metricScene(phase, colors, "Maheshwaram");
}

function scene22(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = aquiferSection(colors, Math.max(1, phase), true);
  const slider = (y, value, title) => {
    const x0 = 1.25;
    const width = 2.65;
    const knob = x0 + width * value;
    return [line(point(x0, y), point(x0 + width, y), measured, 4), circle(0.16, point(knob, y), accent, pale, 0.9, 4), tex(String.raw`0`, point(x0, y - 0.35), measured, 17), tex(String.raw`1`, point(x0 + width, y - 0.35), measured, 17), label(title, point(2.58, y + 0.4), measured, 16), tex(String.raw`\omega=${value.toFixed(2)}`, point(2.58, y - 0.68), accent, 21)];
  };
  if (phase >= 1) items.push(...slider(0.82, 0.31, "Whiteshell W4"));
  if (phase === 2) items.push(...slider(-0.72, 0.77, "Maheshwaram IFP-16"), rect(2.85, 0.48, point(2.58, -1.62), measured, pale, 0.28), label("record-specific; no confidence intervals", point(2.58, -1.62), measured, 14));
  return field(items);
}

const SCENE_HINTS = [
  /fast fracture channel|fast fractures, slow matrix|rapid fracture drainage/,
  /three drawdown curves|neither endpoint|time-regime bands/,
  /overlying aquitard|aquitard leakage|vertical leakage/,
  /radial fracture pde coupled|one shared transfer flux|form coupled balances/,
  /weight slider morphing|interpolate the transfer law|0\s*<=?\s*omega/,
  /geometry collapsing onto dimensionless|scale the system|normalize coupled system/,
  /nonlinear power and derivative-product|transform nonlinear terms|successive integration by parts/,
  /matrix balance collapsing|matrix relation|derive matrix proportionality/,
  /matrix-response box collapsing|eliminate matrix unknown|replace matrix drawdown/,
  /growing and decaying bessel|solve radial spectra|solve bessel branch/,
  /bessel expression unfolding into s-shaped|back to pumping time|transform laplace curves/,
  /infinite radial axis folding|map infinite radius|kelvin-transformed fracture/,
  /finite radial interval filled|solve fem response|finite-element model/,
  /three radial observation markers|sample three radii|paired temporal drawdown/,
  /analytical and finite-element curves overlaid|analytical and fem agreement|compare solution agreement/,
  /omega-indexed transfer-flux|weight-response experiment|compare weight responses/,
  /sensitivity curves occupying|each parameter has a time window|compute sensitivity coefficients/,
  /whiteshell measured drawdown|whiteshell:\s*omega|fit whiteshell parameters/,
  /whiteshell scalar see|whiteshell model ranking|compare whiteshell criteria/,
  /maheshwaram measured drawdown|maheshwaram:\s*omega|fit maheshwaram parameters/,
  /maheshwaram scalar see|maheshwaram model ranking|compare maheshwaram criteria/,
  /pumped fracture network beside two|two records, two fitted weights|record-specific empirical estimates/,
];

function sceneFromText(text) {
  const index = SCENE_HINTS.findIndex((pattern) => pattern.test(text));
  return index < 0 ? null : index + 1;
}

const SCENE_RENDERERS = [
  scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08, scene09, scene10, scene11,
  scene12, scene13, scene14, scene15, scene16, scene17, scene18, scene19, scene20, scene21, scene22,
];

export function renderPaperVisual2021_07_33(context, phase = 0, palette = DEFAULT_PALETTE) {
  const unpacked = unpackContext(context, phase, palette);
  if (!unpacked.text.includes(PAPER_MARKER)) return null;
  const scene = unpacked.scene ?? sceneFromText(unpacked.text);
  return scene ? SCENE_RENDERERS[scene - 1](unpacked.phase, unpacked.colors) : null;
}

export function paperVisualExpression(description, phase = 0, palette = DEFAULT_PALETTE) {
  return renderPaperVisual2021_07_33(description, phase, palette);
}
