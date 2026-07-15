const PAPER_MARKER = "[paper:2020-03-35]";
const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const xyz = ([x, y]) => [x, y, 0];
const point = (xy) => q(xyz(xy));
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (xy, color, radius = 0.08) => `Dot(${point(xy)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, xy, stroke, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const ellipse = (width, height, xy, stroke, fill, opacity = 0.25) => `Ellipse(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0.25, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const polygon = (points, stroke, fill, opacity = 0.25) => `Polygon(${points.map((xy) => point(xy)).join(", ")}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (latex, xy, color, size = 23) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const label = (value, xy, color, size = 18) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const axes = (xy, color, width = 4.8, height = 2.75, xRange = "[0, 4, 1]", yRange = "[0, 1, 0.25]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${point(xy)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((xy, index) => line(xy, points[index + 1], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const normalizePalette = (palette) => {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [source[0] ?? DEFAULT_PALETTE[0], source[1] ?? DEFAULT_PALETTE[1], source[2] ?? DEFAULT_PALETTE[2]].map(String);
};
const descriptionText = (description) => {
  const values = typeof description === "object" && description !== null
    ? [description.marker, description.visualObject, description.stepDetail, description.visibleEvidence, description.motionPurpose, description.minimalText, description.operation, description.output, description.claim]
    : [description];
  return values.filter((value) => typeof value === "string").join(" ").normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
};

function aquiferBase(colors, wellX = 1.75) {
  const [accent, measured, pale] = colors;
  return [
    rect(5.45, 2.55, [0.05, -0.28], measured, pale, 0.3),
    rect(0.34, 2.75, [-2.05, -0.18], accent, pale, 0.7),
    line([-2.55, 1.2], [-1.88, 1.2], measured, 7),
    line([wellX, 0.9], [wellX, -1.28], accent, 9),
    circle(0.16, [wellX, -0.12], accent, 4, pale, 0.5),
    math(String.raw`x=0`, [-2.05, -1.7], measured, 18),
    math(String.raw`x=d`, [wellX, -1.7], measured, 18),
  ];
}

function flowPartition(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = aquiferBase(colors);
  items.push(label("stream", [-2.3, 1.62], measured, 18), label("clogged bed", [-2.05, 0.65], accent, 16), math(String.raw`Q`, [1.75, 1.32], accent, 27));
  const storageArrows = [[2.85, -0.95], [2.8, -0.25], [0.15, -1.0]].map((start) => arrow(start, [1.98, -0.18], measured, 3));
  items.push(...storageArrows.slice(0, phase + 1), math(String.raw`q_a`, [2.75, -1.4], measured, 20));
  if (phase >= 1) items.push(...[0.78, 0.12, -0.55].map((y) => arrow([-1.82, y], [1.48, -0.08], accent, 3)), math(String.raw`q_s`, [-0.62, 0.72], accent, 23));
  if (phase === 2) items.push(rect(2.05, 0.72, [0.35, 1.45], accent, pale, 0.4), math(String.raw`\mathrm{SDR}=\frac{q_s}{Q}`, [0.35, 1.45], accent, 25), math(String.raw`Q=q_a+q_s`, [2.45, 1.48], measured, 20));
  return field(items);
}

function missingStorage(phase, colors) {
  const [accent, measured, pale] = colors;
  const stripWidth = [1.25, 0.68, 0.18][phase];
  const stripX = -1.65 + (1.25 - stripWidth) / 2;
  const items = [
    rect(5.25, 2.55, [0.15, -0.3], measured, pale, 0.25),
    rect(stripWidth, 2.65, [stripX, -0.2], accent, pale, phase === 2 ? 0.25 : 0.65),
    line([-2.35, 1.18], [-1.05, 1.18], measured, 7),
    math(String.raw`w`, [-1.65, -1.78], accent, 23),
  ];
  const storageDots = [[-1.92, 0.62], [-1.42, 0.55], [-1.78, 0.0], [-1.28, -0.12], [-1.82, -0.72], [-1.35, -0.82]];
  items.push(...storageDots.slice(0, Math.max(0, 6 - phase * 3)).map((xy) => dot(xy, accent, 0.11)));
  if (phase >= 1) items.push(arrow([-1.0, 0.45], [0.25, 0.45], measured, 3), math(String.raw`wS_s'`, [-0.3, 0.87], measured, 22));
  if (phase === 2) items.push(line([-1.12, -1.3], [-1.12, 1.05], accent, 6), math(String.raw`w\to0\quad\Rightarrow\quad wS_s'\to0`, [1.2, -1.42], accent, 22));
  return field(items);
}

function modelPair(phase, colors) {
  const [accent, measured, pale] = colors;
  const panel = (center, twoZone) => {
    const items = [rect(2.85, 2.75, [center, -0.15], measured, pale, 0.22), line([center - 1.32, 1.1], [center - 0.84, 1.1], measured, 6), line([center + 0.78, 0.72], [center + 0.78, -1.12], accent, 7)];
    if (twoZone) items.push(rect(0.6, 2.5, [center - 0.78, -0.2], accent, pale, 0.62), line([center - 0.48, -1.4], [center - 0.48, 1.0], accent, 4), math(String.raw`s'=0`, [center - 1.04, 1.45], accent, 18));
    else items.push(line([center - 0.94, -1.4], [center - 0.94, 1.0], accent, 5), math(String.raw`\tau`, [center - 0.68, 1.45], accent, 24));
    return items;
  };
  const items = [...panel(phase === 0 ? 0 : -1.65, false)];
  if (phase >= 1) items.push(...panel(1.65, true), arrow([-0.15, 0], [0.15, 0], accent, 3));
  if (phase === 2) items.push(label("single zone", [-1.65, -1.82], measured, 17), label("streambed + aquifer", [1.65, -1.82], measured, 17), math(String.raw`\tau=\frac{w^2S'}{2T'}`, [0, 1.75], accent, 24));
  return field(items);
}

function laggingRobin(phase, colors) {
  const [accent, measured, pale] = colors;
  const profile = [[-0.35, -1.1], [0.05, -0.7], [0.45, -0.15], [0.85, 0.42], [1.25, 0.85], [1.72, 1.04]];
  const items = [rect(1.05, 3.1, [-2.15, -0.05], accent, pale, 0.55), line([-1.62, -1.55], [-1.62, 1.45], accent, 5), ...[0.78, 0.05, -0.7].slice(0, phase + 1).map((y) => arrow([-1.48, y], [-0.42, y], accent, 4)), axes([1.2, -0.22], measured, 3.2, 2.6, "[0, 4, 1]", "[0, 3, 1]"), ...trace(profile, measured, 4), math(String.raw`s(0,t)`, [1.8, 1.42], measured, 20)];
  if (phase >= 1) items.push(line([0.45, -0.28], [1.05, 0.58], accent, 5), math(String.raw`\left.\frac{\partial s}{\partial t}\right|_{x=0}`, [0.05, 1.38], accent, 20), math(String.raw`\tau\frac{\partial s}{\partial t}`, [-0.55, -1.42], accent, 23));
  if (phase === 2) items.push(rect(4.9, 0.72, [0.3, -1.65], accent, pale, 0.3), math(String.raw`K\frac{\partial s}{\partial x}=\frac{K'}{w}\!\left(s+\tau\frac{\partial s}{\partial t}\right)\quad(x=0)`, [0.3, -1.65], accent, 22));
  return field(items);
}

function coupledZones(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(1.35, 2.85, [-1.85, -0.08], accent, pale, 0.58), rect(3.9, 2.85, [0.8, -0.08], measured, pale, 0.28), line([-2.52, -1.5], [-2.52, 1.35], accent, 6), line([-1.18, -1.5], [-1.18, 1.35], accent, 5), math(String.raw`x=-w`, [-2.52, -1.78], measured, 18), math(String.raw`x=0`, [-1.18, -1.78], measured, 18), math(String.raw`s'=0`, [-2.52, 1.62], accent, 21)];
  if (phase >= 1) items.push(math(String.raw`T'\nabla^2s'=S'\frac{\partial s'}{\partial t}`, [-1.85, 0.48], accent, 20), math(String.raw`T\nabla^2s=S\frac{\partial s}{\partial t}-Q\delta(x-d)\delta(y)`, [0.88, 0.48], measured, 20), line([1.75, 0.95], [1.75, -1.15], accent, 8), math(String.raw`Q`, [1.75, 1.32], accent, 24));
  if (phase === 2) items.push(...[0.82, 0.08, -0.68].map((y) => arrow([-1.72, y], [-0.76, y], accent, 3)), rect(4.45, 0.76, [0.35, -1.2], accent, pale, 0.34), math(String.raw`s=s',\qquad T\frac{\partial s}{\partial x}=T'\frac{\partial s'}{\partial x}\quad(x=0)`, [0.35, -1.2], accent, 21));
  return field(items);
}

function modeProfiles(twoZone, phase, colors) {
  const [accent, measured, pale] = colors;
  const centers = [-1.85, -0.65, 0.55, 1.75];
  const items = [rect(twoZone ? 1.0 : 0.2, 3.1, [-2.5, -0.05], accent, pale, twoZone ? 0.52 : 0.2), line([-2.0, -1.55], [-2.0, 1.42], accent, 4), math(String.raw`y_D`, [-2.42, 1.65], measured, 19)];
  centers.slice(0, phase + 2).forEach((center, index) => {
    const amp = 0.72 - index * 0.1;
    const wave = Array.from({ length: 9 }, (_, sample) => {
      const y = -1.1 + sample * 0.275;
      return [center + amp * Math.cos((index + 1) * Math.PI * (y + 1.1) / 2.2), y];
    });
    items.push(...trace(wave, index === phase + 1 ? accent : measured, index === phase + 1 ? 4 : 2));
  });
  if (phase >= 1) items.push(arrow([-1.25, 1.58], [1.0, 1.58], accent, 4), math(String.raw`\omega`, [1.35, 1.58], accent, 25));
  if (phase === 2) items.push(math(twoZone ? String.raw`\widetilde{s_D'}(x_D,\omega,t_D),\ \widetilde{s_D}(x_D,\omega,t_D)` : String.raw`\widetilde{s_D}(x_D,\omega,t_D)=\sqrt{\frac{2}{\pi}}\int_0^\infty s_D\cos(\omega y_D)\,dy_D`, [0.25, -1.72], accent, twoZone ? 20 : 18));
  return field(items);
}

function laplaceTransform(twoZone, phase, colors) {
  const [accent, measured, pale] = colors;
  const timeCurves = [
    [[-2.85, -0.9], [-2.45, -0.18], [-2.05, 0.34], [-1.55, 0.7], [-0.95, 0.9]],
    [[-2.85, -0.9], [-2.4, -0.4], [-1.9, 0.0], [-1.4, 0.3], [-0.95, 0.5]],
    [[-2.85, -0.9], [-2.35, -0.58], [-1.85, -0.3], [-1.35, -0.08], [-0.95, 0.08]],
  ];
  const items = [axes([-1.9, -0.15], measured, 2.75, 2.5), ...trace(timeCurves[phase], accent, 4), arrow([-0.25, 0.05], [0.5, 0.05], accent, 4), rect(2.6, 2.55, [1.85, -0.15], measured, pale, 0.22), math(String.raw`p`, [2.8, 0.92], accent, 27), math(String.raw`\omega`, [0.85, 0.92], measured, 23)];
  for (let index = 0; index <= phase; index += 1) items.push(circle(0.28 + index * 0.28, [1.85, -0.15], index === phase ? accent : measured, index === phase ? 4 : 2));
  if (phase >= 1) items.push(math(String.raw`\mathcal L\{\partial_{t_D}\widetilde s_D\}=p\,\overline s_D`, [0, 1.55], accent, 21), math(String.raw`s_D(x_D,y_D,0)=0`, [-1.9, -1.55], measured, 19));
  if (phase === 2) items.push(math(twoZone ? String.raw`\lambda'=\sqrt{\beta p/\kappa+\omega^2}` : String.raw`\lambda=\sqrt{p+\omega^2}`, [1.85, -1.58], accent, 22), math(twoZone ? String.raw`\overline{s_D'},\ \overline{s_D}` : String.raw`\partial_{x_D}\overline s_D=\alpha(1+\tau_Dp)\overline s_D`, [0, 1.92], measured, 19));
  return field(items);
}

function solvedSpectra(twoZone, phase, colors) {
  const [accent, measured, pale] = colors;
  const boundaries = twoZone ? [-2.35, -1.35, 0.75] : [-2.35, 0.3];
  const items = [rect(5.6, 2.65, [0, -0.18], measured, pale, 0.2), ...boundaries.map((x, index) => line([x, -1.5], [x, 1.18], index === 0 ? accent : measured, index === 0 ? 5 : 3))];
  if (twoZone) items.push(rect(1.0, 2.65, [-1.85, -0.18], accent, pale, 0.5));
  const profiles = twoZone
    ? [[[-2.35, 0.85], [-2.0, 0.5], [-1.65, 0.15], [-1.35, -0.05]], [[-1.35, -0.05], [-0.7, 0.22], [0.0, 0.55], [0.75, 0.9]], [[0.75, 0.9], [1.35, 0.48], [2.0, 0.15], [2.7, -0.05]]]
    : [[[-2.35, 0.12], [-1.65, 0.3], [-0.85, 0.58], [0.3, 0.94]], [[0.3, 0.94], [1.05, 0.52], [1.85, 0.2], [2.7, 0.02]]];
  profiles.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === phase ? accent : measured, index === phase ? 5 : 3)));
  items.push(math(String.raw`x_D=1`, [boundaries.at(-1), -1.78], measured, 18));
  if (phase >= 1) items.push(math(twoZone ? String.raw`\overline{s_D'}\ \big|\ \overline{s}_{D,1}\ \big|\ \overline{s}_{D,2}` : String.raw`\overline{s}_{D,1}\ \big|_{x_D=1}\ \overline{s}_{D,2}`, [0.25, 1.52], accent, 21));
  if (phase === 2) items.push(math(twoZone ? String.raw`\overline s_D=\overline{s_D'},\quad \partial_{x_D}\overline s_D=\kappa\partial_{x_D}\overline{s_D'}` : String.raw`\partial_{x_D}\overline s_D=\alpha(1+\tau_Dp)\overline s_D`, [0.15, -1.52], accent, 19));
  return field(items);
}

function inverseLaplace(twoZone, phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(2.55, 2.8, [-1.8, -0.08], measured, pale, 0.2), line([-2.9, -0.1], [-0.7, -0.1], measured, 2), line([-1.8, -1.25], [-1.8, 1.15], measured, 2), dot([-2.3, -0.1], accent, 0.12), line([-1.8, -0.1], [-0.85, -0.1], accent, 5), math(String.raw`p`, [-0.62, -0.35], measured, 21), arrow([-0.25, 0], [0.45, 0], accent, 4), axes([1.75, -0.18], measured, 2.7, 2.45)];
  const amplitudes = twoZone ? [[0.6, -0.92], [1.0, -0.35], [1.45, 0.18], [2.0, 0.52], [2.75, 0.7]] : [[0.6, -0.92], [1.05, -0.22], [1.55, 0.32], [2.1, 0.62], [2.75, 0.78]];
  items.push(...trace(amplitudes.slice(0, 3 + phase), accent, 4));
  if (phase >= 1) items.push(math(String.raw`\mathcal L^{-1}`, [0.1, 0.55], accent, 25), math(String.raw`\mathrm{branch\ cut}+\mathrm{residue}`, [-1.8, 1.52], measured, 18));
  if (phase === 2) items.push(math(twoZone ? String.raw`\widetilde{s_D'}(t_D),\ \widetilde{s}_{D,1}(t_D),\ \widetilde{s}_{D,2}(t_D)` : String.raw`\widetilde{s}_{D,1}(t_D),\ \widetilde{s}_{D,2}(t_D)`, [0.5, -1.6], accent, twoZone ? 18 : 21));
  return field(items);
}

function reconstructedField(twoZone, phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(5.5, 2.75, [0, -0.12], measured, pale, 0.24), line([-2.25, -1.5], [-2.25, 1.28], accent, 5), line([0.65, -1.5], [0.65, 1.28], measured, 3)];
  if (twoZone) items.push(rect(0.9, 2.75, [-1.8, -0.12], accent, pale, 0.52), line([-1.35, -1.5], [-1.35, 1.28], accent, 4));
  const contours = [
    ellipse(0.8, 0.55, [0.65, -0.05], accent, pale, 0.2),
    ellipse(1.65, 1.05, [0.65, -0.05], accent, pale, 0.16),
    ellipse(2.6, 1.62, [0.65, -0.05], measured, pale, 0.12),
  ];
  items.push(...contours.slice(0, phase + 1), circle(0.13, [0.65, -0.05], accent, 4, pale, 0.5));
  if (phase >= 1) items.push(math(String.raw`\int_0^\infty \widetilde s_D\cos(\omega y_D)\,d\omega`, [1.65, 1.58], accent, 19));
  if (phase === 2) items.push(math(twoZone ? String.raw`s_D',\ s_{D,1},\ s_{D,2}\quad\mathrm{(26a-c)}` : String.raw`s_{D,1},\ s_{D,2}\quad\mathrm{(22a-b)}`, [0.55, -1.72], accent, 21));
  return field(items);
}

function integrateSdr(phase, colors) {
  const [accent, measured, pale] = colors;
  const ys = [-1.15, -0.72, -0.28, 0.18, 0.65, 1.1];
  const items = [rect(0.55, 2.8, [-2.15, -0.08], accent, pale, 0.58), line([-1.86, -1.48], [-1.86, 1.32], accent, 5), line([1.45, 0.92], [1.45, -1.12], measured, 8), math(String.raw`Q`, [1.45, 1.32], measured, 24)];
  items.push(...ys.slice(0, 2 + phase * 2).map((y) => arrow([-1.75, y], [-0.65, y * 0.25], accent, 3)));
  if (phase >= 1) items.push(...ys.slice(0, 2 + phase * 2).map((y) => line([-2.45, y], [-2.25, y], measured, 2)), arrow([-0.35, 0], [0.55, 0], accent, 4));
  if (phase === 2) items.push(circle(0.76, [1.45, -0.1], accent, 4), math(String.raw`\mathrm{SDR}`, [1.45, -0.1], accent, 22), rect(4.2, 0.7, [0, -1.62], accent, pale, 0.3), math(String.raw`\mathrm{SDR}=\frac{q_s}{Q}=\frac{\alpha}{\pi}\int_{-\infty}^{\infty}s_D(0,y_D,t_D)\,dy_D`, [0, -1.62], accent, 20));
  return field(items);
}

function lagEquivalence(phase, colors) {
  const [accent, measured, pale] = colors;
  const leftLevel = [0.25, 0.72, 1.12][phase];
  const rightLevel = [0.18, 0.68, 1.12][phase];
  const reservoir = (x, level, color) => [rect(2.2, 2.25, [x, -0.2], measured, "#FFFFFF", 0), rect(1.9, level, [x, -1.22 + level / 2], color, pale, 0.68, 0)];
  const items = [...reservoir(-1.65, leftLevel, accent), ...reservoir(1.65, rightLevel, measured), math(String.raw`\int \tau\,\partial_t q_s\,dt`, [-1.65, 1.38], accent, 20), math(String.raw`\int_{-w}^{0}S'\,\partial_t s'\,dx\,dt`, [1.65, 1.38], measured, 18)];
  if (phase >= 1) items.push(line([-0.35, -0.2], [0.35, -0.2], accent, 5), math(String.raw`=`, [0, 0.18], accent, 30), math(String.raw`w`, [1.65, -1.72], measured, 21));
  if (phase === 2) items.push(rect(4.8, 0.78, [0, -1.72], accent, pale, 0.35), math(String.raw`\tau=\frac{w^2S'}{2T'}=\frac{w^2}{2D'}`, [0, -1.72], accent, 27));
  return field(items);
}

function sensitivityCurves(phase, colors) {
  const [accent, measured, pale] = colors;
  const curves = [
    [[-2.75, -0.45], [-2.2, 0.25], [-1.55, 0.92], [-0.85, 0.42], [-0.1, 0.05], [0.75, -0.08]],
    [[-2.75, -0.2], [-2.15, -0.48], [-1.45, -0.72], [-0.65, -0.48], [0.15, -0.22], [0.75, -0.12]],
    [[-2.75, -0.05], [-2.05, 0.18], [-1.35, 0.35], [-0.55, 0.28], [0.15, 0.14], [0.75, 0.04]],
  ];
  const items = [axes([-1.0, -0.15], measured, 4.0, 2.65, "[0, 5, 1]", "[-1, 1, 0.5]")];
  curves.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === phase ? accent : measured, index === phase ? 4 : 2)));
  const params = [String.raw`K'`, String.raw`w`, String.raw`\tau\ \mathrm{or}\ S_s'`];
  items.push(rect(1.8, 0.58, [2.0, 0.7 - phase * 0.55], accent, pale, 0.42), math(params[phase], [2.0, 0.7 - phase * 0.55], accent, 22));
  if (phase >= 1) items.push(math(String.raw`\Delta P_i=10^{-3}P_i`, [2.0, 1.45], measured, 20));
  if (phase === 2) items.push(rect(5.1, 0.72, [0, -1.62], accent, pale, 0.3), math(String.raw`S_i\approx P_i\frac{X(P_i+\Delta P_i)-X(P_i)}{\Delta P_i}`, [0, -1.62], accent, 22));
  return field(items);
}

function caseCurves(phase, colors) {
  const [accent, measured, pale] = colors;
  const cases = [
    [[-2.6, -1.0], [-1.8, -0.82], [-1.0, -0.42], [-0.15, 0.15], [0.75, 0.62], [1.65, 0.9], [2.55, 1.02]],
    [[-2.6, -1.0], [-1.8, -0.62], [-1.0, -0.1], [-0.15, 0.48], [0.75, 0.82], [1.65, 0.98], [2.55, 1.04]],
    [[-2.6, -1.0], [-1.8, -0.4], [-1.0, 0.18], [-0.15, 0.68], [0.75, 0.94], [1.65, 1.03], [2.55, 1.06]],
  ];
  const solution2 = cases[phase].map(([x, y], index) => [x, y - [0.0, 0.16, 0.2, 0.14, 0.08, 0.03, 0][index] * (2 - phase) / 2]);
  const items = [axes([0, -0.25], measured, 5.4, 2.8, "[0, 6, 1]", "[0, 1, 0.25]"), ...trace(cases[phase], accent, 4), ...trace(solution2, measured, 3), math([String.raw`w_D\beta=10`, String.raw`w_D\beta=1`, String.raw`w_D\beta=0.1`][phase], [-1.65, 1.42], accent, 24), math(String.raw`\mathrm{SDR}`, [-2.95, 1.15], measured, 20), math(String.raw`t_D`, [2.8, -1.48], measured, 20)];
  if (phase >= 1) items.push(math(phase === 1 ? String.raw`w/d=1` : String.raw`w/d=0.1`, [1.75, 1.42], measured, 21));
  if (phase === 2) items.push(line([-2.2, 0.65], [2.2, 0.65], pale, 2), math(String.raw`w_D\beta>0.1\;\Rightarrow\;\mathrm{storage\!\!-\!width\ effect}`, [0.4, -1.72], accent, 19));
  return field(items);
}

function fieldFit(phase, colors) {
  const [accent, measured, pale] = colors;
  const observations = [[-2.55, -0.82], [-2.05, -0.58], [-1.55, -0.22], [-1.05, 0.12], [-0.5, 0.38], [0.05, 0.58], [0.6, 0.75], [1.15, 0.87], [1.72, 0.95], [2.35, 1.0]];
  const fits = [
    observations.map(([x, y], index) => [x, y + 0.03 * Math.sin(index)]),
    observations.map(([x, y], index) => [x, y - 0.04 + 0.035 * Math.sin(index * 0.8)]),
    observations.map(([x, y], index) => [x, y + 0.07 * Math.sin(index * 0.75)]),
  ];
  const items = [axes([0, -0.22], measured, 5.25, 2.75, "[0, 10, 2]", "[0, 1, 0.25]"), ...observations.map((xy) => dot(xy, measured, 0.075)), math(String.raw`\mathrm{Doyleston\ Drain}`, [-1.25, 1.42], measured, 19)];
  fits.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === phase ? accent : pale, index === phase ? 4 : 2)));
  const sees = [String.raw`\mathrm{SEE}_1=3.51\times10^{-2}`, String.raw`\mathrm{SEE}_2=3.88\times10^{-2}`, String.raw`\mathrm{SEE}_{H}=4.16\times10^{-2}`];
  items.push(math(sees[phase], [1.62, 1.42 - phase * 0.34], phase === 2 ? measured : accent, 18));
  if (phase >= 1) items.push(math(String.raw`K'/w,\quad \tau\ \mathrm{or}\ wS_s'`, [0, -1.62], accent, 21));
  if (phase === 2) items.push(math(String.raw`n=10`, [2.65, 1.12], measured, 19));
  return field(items);
}

function meshBenchmarks(phase, colors) {
  const [accent, measured, pale] = colors;
  const mesh = (x0, x1, y0, y1, cols, rows, color) => {
    const items = [];
    const dx = (x1 - x0) / cols;
    const dy = (y1 - y0) / rows;
    for (let row = 0; row < rows; row += 1) for (let col = 0; col < cols; col += 1) {
      const x = x0 + col * dx;
      const y = y0 + row * dy;
      items.push(line([x, y], [x + dx, y], color, 1), line([x, y], [x, y + dy], color, 1), line([x, y], [x + dx, y + dy], color, 1));
    }
    items.push(line([x0, y1], [x1, y1], color, 1), line([x1, y0], [x1, y1], color, 1));
    return items;
  };
  const items = [rect(2.7, 2.8, [-1.65, -0.05], measured, pale, 0.14), ...mesh(-2.95, -0.35, -1.35, 1.25, 4 + phase, 4 + phase, measured), line([-2.95, -1.35], [-2.95, 1.25], accent, 5), label("single zone", [-1.65, 1.58], measured, 17)];
  if (phase >= 1) items.push(rect(2.7, 2.8, [1.65, -0.05], measured, pale, 0.14), rect(0.52, 2.6, [0.58, -0.05], accent, pale, 0.5), ...mesh(0.32, 2.95, -1.35, 1.25, phase === 1 ? 5 : 8, phase === 1 ? 4 : 7, measured), label("two zone", [1.65, 1.58], measured, 17));
  if (phase === 2) items.push(...[-1.05, -0.7, -0.35, 0, 0.35, 0.7, 1.05].map((y) => line([0.32, y], [0.84, y], accent, 2)), math(String.raw`-0.1\le x_D\le0`, [0.58, -1.68], accent, 17), math(String.raw`\mathrm{fine\ streambed\ mesh}`, [1.82, -1.68], measured, 17));
  return field(items);
}

function femEfficiency(phase, colors) {
  const [accent, measured, pale] = colors;
  const oneZone = [[-2.5, -0.72], [-1.8, 0.15], [-1.05, 0.68], [-0.25, 0.9]];
  const twoZone = [[0.35, -0.25], [0.9, 0.55], [1.55, 0.1], [2.05, 0.72], [2.65, 0.91]];
  const items = [axes([0, -0.22], measured, 5.5, 2.75, "[0, 15000, 5000]", "[0.8, 1.2, 0.1]"), ...oneZone.slice(0, 2 + phase).map((xy) => dot(xy, accent, 0.11)), ...trace(oneZone.slice(0, 2 + phase), accent, 3)];
  if (phase >= 1) items.push(...twoZone.slice(0, 2 + phase).map((xy) => dot(xy, measured, 0.1)), ...trace(twoZone.slice(0, 2 + phase), measured, 3), math(String.raw`\mathrm{NP}_1=2209`, [-1.75, 1.42], accent, 20));
  if (phase === 2) items.push(math(String.raw`\mathrm{NP}_2=14655`, [1.62, 1.42], measured, 20), line([-2.7, 0.9], [2.7, 0.9], pale, 3), math(String.raw`\mathrm{SDR}\approx0.99`, [-0.15, 1.08], accent, 20), rect(2.0, 0.68, [1.7, -1.55], accent, pale, 0.35), math(String.raw`\mathrm{TR}=\frac{CT_2}{CT_1}\approx10`, [1.7, -1.55], accent, 21));
  return field(items);
}

function conditionalReturn(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = aquiferBase(colors, 0.25);
  const solution1 = [[0.85, -1.0], [1.18, -0.52], [1.55, -0.03], [2.0, 0.4], [2.52, 0.68], [3.0, 0.8]];
  const solution2 = solution1.map(([x, y], index) => [x, y - [0, 0.14, 0.16, 0.1, 0.04, 0][index] * (2 - phase) / 2]);
  items.push(...[-0.2, -0.72].slice(0, phase + 1).map((y) => arrow([-1.82, y], [-0.02, -0.12], accent, 3)));
  if (phase >= 1) items.push(axes([2.0, -0.12], measured, 2.5, 2.25, "[0, 5, 1]", "[0, 1, 0.25]"), ...trace(solution1, accent, 4), ...trace(solution2, measured, 3));
  if (phase === 2) items.push(math(String.raw`\tau=\frac{w^2S'}{2T'}`, [-1.42, 1.62], accent, 22), math(String.raw`w_D\beta>0.1:\ \mathrm{responses\ separate}`, [1.85, 1.48], accent, 18), math(String.raw`20\,\mathrm{m}>3(2.5\,\mathrm{m})`, [-1.2, -1.85], measured, 18));
  return field(items);
}

export function renderPaperVisual2020_03_35(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = descriptionText(description);
  if (!text.includes(PAPER_MARKER)) return null;
  const step = normalizePhase(phase);
  const colors = normalizePalette(palette);

  if (/stream, clogged bed, pumping well|partitioned flow arrows|stream-derived water/.test(text)) return flowPartition(step, colors);
  if (/conventional boundary beside a finite-width storage layer|storage reservoir disappearing|width and storage are missing/.test(text)) return missingStorage(step, colors);
  if (/paired single-zone and two-zone|boundary model vs zone model|split one schematic/.test(text)) return modelPair(step, colors);
  if (/boundary flux arrow responding|lagging robin bc|tangent slope/.test(text)) return laggingRobin(step, colors);
  if (/finite streambed strip with matched head|form the two-zone model|join drawdown and flux/.test(text)) return coupledZones(step, colors);
  if (/single-zone streamwise drawdown profiles|single-zone fourier projection/.test(text)) return modeProfiles(false, step, colors);
  if (/single-zone cosine modes entering|single-zone laplace transform/.test(text)) return laplaceTransform(false, step, colors);
  if (/two single-zone transformed profiles|solve single-zone spectra/.test(text)) return solvedSpectra(false, step, colors);
  if (/single-zone laplace spectra unfolding|invert single-zone time/.test(text)) return inverseLaplace(false, step, colors);
  if (/single-zone cosine modes expanding|reconstruct single-zone drawdown/.test(text)) return reconstructedField(false, step, colors);
  if (/streamwise drawdown profiles collapsing|project streamwise drawdown|fourier projection/.test(text)) return modeProfiles(true, step, colors);
  if (/cosine modes entering a laplace p-plane|convert temporal modes|laplace transform/.test(text)) return laplaceTransform(true, step, colors);
  if (/three transformed xd profiles|solve transformed fields|three regions/.test(text)) return solvedSpectra(true, step, colors);
  if (/laplace spectra unfolding into time-dependent|return to time|equations 25a through 25c/.test(text)) return inverseLaplace(true, step, colors);
  if (/cosine modes expanding into the two-dimensional|reconstruct drawdown|equations 26a through 26c/.test(text)) return reconstructedField(true, step, colors);
  if (/distributed streambed flux arrows|integrate to sdr|normalize the sum by q/.test(text)) return integrateSdr(step, colors);
  if (/two equal water-volume reservoirs|derive lag time equivalence|fill both reservoirs/.test(text)) return lagEquivalence(step, colors);
  if (/one-at-a-time hydraulic perturbations|calculate sensitivity|normalized response sensitivity/.test(text)) return sensitivityCurves(step, colors);
  if (/case-labeled sdr curves|storage-width effect|w d beta cases/.test(text)) return caseCurves(step, colors);
  if (/field sdr points with three fitted curves|doyleston drain|fit streambed parameters/.test(text)) return fieldFit(step, colors);
  if (/coarse single-zone mesh|build fem benchmarks|simulate finite-element/.test(text)) return meshBenchmarks(step, colors);
  if (/steady-state sdr accuracy points|fem accuracy and cost|computing-time-ratio/.test(text)) return femEfficiency(step, colors);
  if (/original stream-aquifer cross-section with paired sdr curves|conditional sdr agreement|more efficient surrogate/.test(text)) return conditionalReturn(step, colors);
  return null;
}
