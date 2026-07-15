const q = (value) => JSON.stringify(value);
const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];

const phaseOf = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const textOf = (description) => typeof description === "object" && description !== null
  ? Object.values(description).filter((value) => typeof value === "string").join(" ")
  : String(description ?? "");
const colorsOf = (palette) => {
  const colors = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]];
};

const point = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (at, color, radius = 0.08) => `Dot(${q(at)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, at, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.35) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const polygon = (points, stroke, fill, opacity = 0.35) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (latex, at, color, size = 25) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const label = (value, at, color, size = 19) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const axes = (at, color, width = 3.1, height = 2.2, xRange = "[0, 4, 1]", yRange = "[0, 3, 1]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${q(at)})`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((start, index) => line([...start, 0], [...points[index + 1], 0], color, width));
const field = (items) => `VGroup(${items.flat().filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

function wave(y, amplitude, phase, start = -2.8, end = 2.75, samples = 13) {
  return Array.from({ length: samples }, (_, index) => {
    const x = start + (end - start) * index / (samples - 1);
    return [x, y + amplitude * Math.sin(index * 0.82 + phase * 0.72)];
  });
}

function decays(y, scale = 1, shift = 0) {
  return Array.from({ length: 8 }, (_, index) => [-2.7 + index * 0.75, y + scale * Math.exp(-index * 0.34) + shift]);
}

function blocks(colors, phase, y = 0.72) {
  const [accent, measured, pale] = colors;
  return [-1.9, -0.75, 0.4, 1.55].map((x, index) => {
    const fill = phase === 0 ? pale : index <= phase + 1 ? accent : measured;
    const opacity = phase === 0 ? 0.22 : 0.24 + 0.12 * ((index + phase) % 3);
    return rect(0.82, 0.82, point(x, y), measured, fill, opacity);
  });
}

function phasor(center, angle, radius, color, phase, symbol) {
  const [x, y] = center;
  const end = point(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  const items = [circle(0.78, point(x, y), color, 2), dot(point(x, y), color, 0.07)];
  if (phase >= 1) items.push(arrow(point(x, y), end, color, phase === 2 ? 5 : 3));
  if (phase === 2) items.push(math(symbol, point(x, y + 1.05), color, 24));
  return items;
}

function coastalTransect(phase, colors) {
  const [accent, measured, pale] = colors;
  const tide = wave(-0.72, 0.28, phase, -3.0, -1.65, 6);
  const fracture = wave(-0.72, 0.22 - phase * 0.025, phase, -1.6, 2.85, 12).map(([x, y], index) => [x, -0.72 + (y + 0.72) * Math.exp(-index * 0.12)]);
  const items = [polygon([point(-3.1, -1.45), point(-1.6, -1.45), point(-1.6, 1.45), point(-3.1, 1.45)], measured, pale, 0.62), line(point(-1.6, -1.45), point(-1.6, 1.45), accent, 4), ...plot(tide, accent, 4), ...plot(fracture, accent, 5), ...blocks(colors, phase, 0.58).slice(1)];
  if (phase >= 1) items.push(arrow(point(-1.45, -0.72), point(-0.85, -0.72), accent, 4), math("x=0", point(-1.6, -1.75), measured, 20));
  if (phase === 2) items.push(...[-1.9, -0.75, 0.4, 1.55].map((x) => arrow(point(x, -0.45), point(x, 0.1), measured, 2)), math(String.raw`h_f(x,t)`, point(1.95, -1.25), accent, 22));
  return field(items);
}

function matrixStorage(phase, colors) {
  const [accent, measured, pale] = colors;
  const levels = [0.12, 0.5, 0.3].map((value) => value + phase * 0.12);
  const items = [rect(5.8, 0.3, point(0, -1.18), accent, pale, 0.9), ...blocks(colors, phase, 0.25), ...plot(wave(-1.18, 0.13, phase), accent, 4)];
  [-1.9, -0.75, 0.4, 1.55].forEach((x, index) => {
    items.push(rect(0.66, levels[index % 3], point(x, -0.16 + levels[index % 3] / 2), accent, accent, 0.3 + phase * 0.18));
    if (phase >= 1) items.push(arrow(point(x, -0.95), point(x, -0.42), index % 2 === phase % 2 ? accent : measured, 2 + phase));
  });
  if (phase === 2) items.push(math(String.raw`h_m(t)`, point(2.45, 0.45), measured, 24), line(point(-2.35, 0.56), point(2.05, 0.56), measured, 2));
  return field(items);
}

function transferSlider(phase, colors) {
  const [accent, measured, pale] = colors;
  const linear = [[-2.75, -1.15], [-2.0, -0.72], [-1.25, -0.3], [-0.5, 0.12], [0.25, 0.55]];
  const quadratic = [[-2.75, -1.15], [-2.0, -1.02], [-1.25, -0.68], [-0.5, -0.08], [0.25, 0.85]];
  const blend = linear.map(([x, y], index) => [x, y * (1 - phase / 2) + quadratic[index][1] * phase / 2]);
  const knobX = -2.1 + phase * 2.0;
  const items = [axes(point(-1.25, 0), measured, 3.8, 2.7), ...plot(linear, measured, 2), ...plot(quadratic, pale, 3), ...plot(blend, accent, 5), line(point(-2.1, -1.62), point(1.9, -1.62), measured, 4), dot(point(knobX, -1.62), accent, 0.14), math("0", point(-2.1, -1.93), measured, 18), math("1", point(1.9, -1.93), measured, 18), math(String.raw`\lambda`, point(knobX, -1.27), accent, 24)];
  if (phase === 2) items.push(label("first order", point(1.7, 0.25), measured), label("second order", point(1.7, 1.02), accent));
  return field(items);
}

function fractureBalance(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(5.5, 0.42, point(-0.05, -0.35), accent, pale, 0.8), arrow(point(-3.05, -0.35), point(-2.4, -0.35), accent, 5), arrow(point(2.3, -0.35), point(2.95, -0.35), accent, 5), ...[-1.8, -0.55, 0.7, 1.95].map((x) => dot(point(x, -0.35), measured, 0.1))];
  if (phase >= 1) items.push(...blocks(colors, phase, 0.95), ...[-1.8, -0.55, 0.7, 1.95].map((x) => arrow(point(x, -0.08), point(x, 0.48), measured, 3)));
  if (phase === 2) items.push(arrow(point(-0.05, 1.65), point(-0.05, 1.23), accent, 4), math(String.raw`\Gamma`, point(2.55, 0.55), measured, 25), math(String.raw`T_f`, point(-2.5, -0.78), accent, 23), math(String.raw`S_f`, point(1.95, -0.78), measured, 23));
  return field(items);
}

function lumpedMatrix(phase, colors) {
  const [accent, measured, pale] = colors;
  const bands = phase === 0 ? [pale, measured, accent] : [accent, accent, accent];
  const items = [rect(3.25, 3.0, point(-0.75, 0), measured, pale, 0.28), ...bands.map((fill, index) => rect(2.75, 0.62, point(-0.75, 0.8 - index * 0.8), measured, fill, phase === 0 ? 0.18 + index * 0.15 : 0.32 + phase * 0.12)), arrow(point(-2.85, 0), point(-2.0, 0), accent, 4)];
  if (phase >= 1) items.push(line(point(-2.0, 0.8), point(0.5, 0.8), accent, 3), line(point(-2.0, 0), point(0.5, 0), accent, 3), line(point(-2.0, -0.8), point(0.5, -0.8), accent, 3));
  if (phase === 2) items.push(math(String.raw`h_m(t)`, point(1.55, 0.5), accent, 28), math(String.raw`S_m`, point(1.55, -0.35), measured, 25), label("uniform head", point(-0.75, 1.78), measured));
  return field(items);
}

function gttFlux(phase, colors) {
  const [accent, measured, pale] = colors;
  const lambda = ["0.1", "0.5", "1.0"][phase];
  const fluxWidth = [7, 4, 2][phase];
  const items = [rect(2.0, 2.75, point(-1.75, 0), measured, pale, 0.36), rect(0.55, 3.15, point(1.65, 0), accent, pale, 0.9), math(String.raw`h_m`, point(-1.75, 0), measured, 28), math(String.raw`h_f`, point(1.65, 0), accent, 28), arrow(point(-0.62, 0.35), point(1.28, 0.35), accent, fluxWidth), arrow(point(1.28, -0.35), point(-0.62, -0.35), measured, Math.max(2, fluxWidth - 1)), line(point(-2.65, -1.72), point(2.45, -1.72), measured, 3), dot(point(-2.35 + phase * 2.25, -1.72), accent, 0.14), math(String.raw`\lambda=${lambda}`, point(0, 1.68), accent, 25)];
  if (phase >= 1) items.push(...plot(wave(1.12, 0.13, phase, -0.58, 1.22, 8), phase === 2 ? measured : accent, 3));
  if (phase === 2) items.push(math(String.raw`\Gamma`, point(0.35, 0.78), accent, 26), label("smaller transfer", point(0, -1.23), measured, 17));
  return field(items);
}

function directFourier(phase, colors) {
  const [accent, measured] = colors;
  const fractureTrace = wave(0.95, 0.28, 0, -3.0, -0.15, 10);
  const matrixTrace = wave(-0.9, 0.2, 1, -3.0, -0.15, 10);
  const items = [...plot(fractureTrace, accent, 4), ...plot(matrixTrace, measured, 4), line(point(-3.0, 0.5), point(-0.15, 0.5), measured, 2), line(point(-3.0, -1.3), point(-0.15, -1.3), measured, 2)];
  if (phase >= 1) items.push(arrow(point(0.15, 0), point(0.72, 0), accent, 4), ...phasor([1.55, 0.78], 0.62 + phase * 0.25, 0.64, accent, phase, String.raw`H_f`), ...phasor([1.55, -0.9], 0.18 + phase * 0.22, 0.48, measured, phase, String.raw`H_m`));
  if (phase === 2) items.push(math(String.raw`h_{f,m}=A\Re\!\left(H_{f,m}e^{i(\omega t+c)}\right)`, point(-0.35, 1.72), accent, 20));
  return field(items);
}

function matrixAmplitude(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...phasor([-2.1, 0], 0.82, 0.86, accent, 2, String.raw`H_f`), rect(1.25, 0.82, point(0, 0), measured, pale, 0.42), label("Eq. 11", point(0, 0), measured, 19), arrow(point(-1.12, 0), point(-0.68, 0), accent, 4)];
  if (phase >= 1) items.push(arrow(point(0.68, 0), point(1.12, 0), measured, 4), ...phasor([2.05, 0], 0.32 + phase * 0.18, 0.62, measured, phase, String.raw`H_m`));
  if (phase === 2) items.push(line(point(-2.1, -1.15), point(2.05, -1.15), pale, 3), math(String.raw`H_f`, point(-2.1, -1.5), accent, 22), math(String.raw`H_m`, point(2.05, -1.5), measured, 22), label("complex response", point(0, 1.58), accent));
  return field(items);
}

function boundaryCoefficients(phase, colors) {
  const [accent, measured, pale] = colors;
  const decaying = [[-2.75, 1.05], [-2.05, 0.72], [-1.35, 0.43], [-0.65, 0.18], [0.05, -0.02], [0.75, -0.18], [1.45, -0.3], [2.25, -0.38]];
  const growing = [[-2.75, -0.75], [-2.05, -0.67], [-1.35, -0.5], [-0.65, -0.2], [0.05, 0.22], [0.75, 0.75], [1.45, 1.38]];
  const items = [axes(point(-0.2, 0), measured, 5.6, 2.8), ...plot(decaying, accent, 5), ...plot(growing, phase === 0 ? measured : pale, phase === 0 ? 4 : 2), math(String.raw`H_f(0)=1`, point(-2.18, 1.48), accent, 21)];
  if (phase >= 1) items.push(line(point(1.45, 1.17), point(1.8, 1.52), measured, 4), line(point(1.45, 1.52), point(1.8, 1.17), measured, 4), math(String.raw`C_1=0`, point(2.3, 1.35), measured, 21));
  if (phase === 2) items.push(math(String.raw`H_f=e^{-\sqrt{\xi_f}\,x}`, point(0.15, -1.58), accent, 24), math(String.raw`H_f\to0`, point(2.22, -0.78), measured, 20));
  return field(items);
}

function headAmplitudes(phase, colors) {
  const [accent, measured, pale] = colors;
  const fracture = decays(-1.15, 1.7);
  const matrix = decays(-1.15, 1.25, -0.12);
  const items = [...phasor([-2.15, 0.78], 0.78, 0.7, accent, Math.min(2, phase + 1), String.raw`H_f`), ...phasor([-2.15, -0.92], 0.38, 0.5, measured, Math.min(2, phase + 1), String.raw`H_m`)];
  if (phase >= 1) items.push(arrow(point(-1.15, 0), point(-0.5, 0), accent, 4), axes(point(1.2, -0.15), measured, 3.7, 2.8), ...plot(fracture.map(([x, y]) => [x + 3.6, y]), accent, 5), ...plot(matrix.map(([x, y]) => [x + 3.6, y]), measured, 4));
  if (phase === 2) items.push(math(String.raw`A_{h,j}=\sqrt{\Re(H_j)^2+\Im(H_j)^2}`, point(0.85, 1.62), accent, 21), line(point(-2.15, 0.78), point(-1.48, 0.78), pale, 4), line(point(-2.15, -0.92), point(-1.68, -0.92), pale, 4));
  return field(items);
}

function jacobLimit(phase, colors) {
  const [accent, measured, pale] = colors;
  const centers = [-2.1, 0, 2.1];
  const items = [math(String.raw`\alpha=0`, point(0, 1.65), accent, 25)];
  centers.forEach((center, panel) => {
    const base = wave(-0.35, 0.48 - panel * 0.1, panel, center - 0.75, center + 0.75, 8);
    const comparison = base.map(([x, y], index) => [x, y + (phase === 0 ? 0.13 : 0.045 / phase) * Math.sin(index * 1.4)]);
    items.push(line(point(center - 0.82, -1.05), point(center + 0.82, -1.05), measured, 2), ...plot(base, accent, 4));
    if (phase >= 1) items.push(...comparison.map(([x, y]) => dot(point(x, y), measured, 0.065)));
    if (phase === 2) items.push(label(["10 m", "100 m", "500 m"][panel], point(center, -1.42), panel === 0 ? accent : measured, 17));
  });
  if (phase === 2) items.push(label("present / Jacob", point(0, 1.18), measured, 17));
  return field(items);
}

function lambdaProfiles(phase, colors) {
  const [accent, measured, pale] = colors;
  const fractureBase = decays(-1.1, 1.65);
  const matrixBase = decays(-1.1, 1.22, -0.08);
  const items = [axes(point(-1.65, -0.15), measured, 2.75, 2.65), axes(point(1.65, -0.15), measured, 2.75, 2.65)];
  for (let index = 0; index <= phase; index += 1) {
    const fracture = fractureBase.map(([x, y], pointIndex) => [x * 0.5 - 1.65, y + index * 0.12 * Math.exp(-pointIndex * 0.22)]);
    const matrix = matrixBase.map(([x, y], pointIndex) => [x * 0.5 + 1.65, y - index * 0.1 * Math.exp(-pointIndex * 0.4) + index * 0.055 * pointIndex]);
    items.push(...plot(fracture, index === phase ? accent : pale, index === phase ? 5 : 2), ...plot(matrix, index === phase ? measured : pale, index === phase ? 5 : 2));
  }
  items.push(math(String.raw`A_{h,f}`, point(-1.65, 1.45), accent, 24), math(String.raw`A_{h,m}`, point(1.65, 1.45), measured, 24), math(String.raw`\lambda:0.1\to1`, point(0, -1.68), accent, 23));
  if (phase === 2) items.push(line(point(1.28, -1.35), point(1.28, 1.05), pale, 3), label("0.1 km", point(1.28, -1.58), measured, 15));
  return field(items);
}

function sensitivityProfiles(phase, colors) {
  const [accent, measured, pale] = colors;
  const fracture = [[-2.55, -0.75], [-2.05, 0.82], [-1.55, 0.38], [-1.05, 0.12], [-0.55, 0.02]];
  const matrix = [[0.55, -0.72], [1.05, 0.88], [1.55, 0.48], [2.05, 0.22], [2.55, 0.03]];
  const items = [axes(point(-1.55, -0.2), measured, 2.55, 2.45), axes(point(1.55, -0.2), measured, 2.55, 2.45), ...plot(fracture.slice(0, 3 + phase), accent, 5), ...plot(matrix.slice(0, 3 + phase), measured, 5)];
  if (phase >= 1) items.push(...fracture.slice(0, 3 + phase).map((p, index) => dot(point(...p), index === 1 ? accent : pale, 0.08)), ...matrix.slice(0, 3 + phase).map((p, index) => dot(point(...p), index === 1 ? measured : pale, 0.08)));
  if (phase === 2) items.push(math(String.raw`SA_j=\frac{P_j}{O_j}\frac{\partial O_j}{\partial P_j}`, point(0, 1.62), accent, 22), math(String.raw`\lambda`, point(-2.05, 1.02), accent, 22), math(String.raw`\lambda`, point(1.05, 1.08), measured, 22), label("fracture", point(-1.55, -1.58), accent, 16), label("matrix", point(1.55, -1.58), measured, 16));
  return field(items);
}

function intrusionThreshold(phase, colors) {
  const [accent, measured, pale] = colors;
  const crossing = [0.35, 1.05, 1.75][phase];
  const profile = [[-2.65, 1.18], [-2.0, 0.88], [-1.35, 0.55], [-0.7, 0.25], [0, 0.02], [0.7, -0.18], [1.4, -0.32], [2.2, -0.42]].map(([x, y]) => [x + phase * 0.2 * Math.exp(-(x + 2.65) * 0.2), y]);
  const items = [axes(point(-0.15, -0.15), measured, 5.5, 2.8), ...plot(profile, accent, 5), line(point(-2.7, -0.15), point(2.6, -0.15), pale, 4), math(String.raw`A_{h,f}=0.25\%A`, point(0.85, 1.52), accent, 22), dot(point(crossing, -0.15), accent, 0.12)];
  if (phase >= 1) items.push(line(point(crossing, -1.35), point(crossing, -0.15), measured, 4), arrow(point(-2.35, -1.58), point(crossing - 0.08, -1.58), accent, 4));
  if (phase === 2) items.push(math(String.raw`x_i`, point(crossing, -1.72), measured, 22), math(String.raw`\lambda\uparrow`, point(-2.25, 1.35), accent, 22));
  return field(items);
}

function finalRedistribution(phase, colors) {
  const [accent, measured, pale] = colors;
  const fracture = decays(-1.32, 1.62 + phase * 0.12);
  const matrix = decays(-1.2, 1.18 - phase * 0.08).map(([x, y], index) => [x, y + phase * index * 0.038]);
  const marker = 0.55 + phase * 0.55;
  const items = [polygon([point(-3.05, -1.55), point(-2.45, -1.55), point(-2.45, 1.5), point(-3.05, 1.5)], measured, pale, 0.62), line(point(-2.45, -1.5), point(-2.45, 1.5), accent, 4), ...blocks(colors, phase, 0.98), axes(point(0.1, -0.45), measured, 5.3, 2.25), ...plot(fracture, accent, 5), ...plot(matrix, measured, 4), line(point(marker, -1.4), point(marker, 0.05), accent, 4)];
  if (phase >= 1) items.push(arrow(point(-2.3, -0.72), point(-1.65, -0.72), accent, 4), math(String.raw`A_{h,f}`, point(1.9, 0.82), accent, 21), math(String.raw`A_{h,m}`, point(1.9, 0.38), measured, 21));
  if (phase === 2) items.push(math(String.raw`0.25\%A`, point(marker, -1.62), accent, 20), line(point(-1.25, -1.42), point(-1.25, 0.75), pale, 3), label("0.1 km", point(-1.25, -1.66), measured, 15), math(String.raw`\lambda\uparrow`, point(-2.0, 1.62), accent, 22));
  return field(items);
}

export function renderPaperVisual2023_09_24(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!text.includes("[paper:2023-09-24]")) return null;
  const step = phaseOf(phase);
  const colors = colorsOf(palette);
  if (/original fractured coastal-aquifer transect|transfer weight redistributes tide|paired fracture and matrix amplitude envelopes and the 0\.25/.test(text)) return finalRedistribution(step, colors);
  if (/threshold crossing|intrusion distance|0\.25 percent|0\.25% threshold/.test(text)) return intrusionThreshold(step, colors);
  if (/fracture and matrix sensitivity profiles|parameter-influence profiles|signed normalized sensitivity/.test(text)) return sensitivityProfiles(step, colors);
  if (/indexed by lambda|lambda from 0\.1 to 1|tested transfer weights redistribute|distance-dependent fracture and matrix amplitude/.test(text)) return lambdaProfiles(step, colors);
  if (/overlaid analytical amplitude curves|jacob head curves|zero-transfer jacob|three observation distances/.test(text)) return jacobLimit(step, colors);
  if (/paired amplitude envelopes|project each phasor radius|fracture and matrix tidal-amplitude profiles/.test(text)) return headAmplitudes(step, colors);
  if (/landward-decaying fracture phasor|remove the inland-growing|boundary coefficients|decaying landward fracture-head/.test(text)) return boundaryCoefficients(step, colors);
  if (/matrix amplitude relation|replace hm with its solved|solve hm|matrix phasor expressed/.test(text)) return matrixAmplitude(step, colors);
  if (/paired fracture-matrix phasors|fold one tidal period|direct fourier|complex fracture and matrix amplitude/.test(text)) return directFourier(step, colors);
  if (/bidirectional weighted transfer arrows|bind each fracture-matrix arrow|gtt flux|weighted nonlinear matrix-to-fracture/.test(text)) return gttFlux(step, colors);
  if (/uniform-head matrix block|flatten each matrix block|lumped matrix|lumped matrix-head/.test(text)) return lumpedMatrix(step, colors);
  if (/fracture mass-balance strip|longitudinal fracture flow|fracture balance|one-dimensional fracture-flow/.test(text)) return fractureBalance(step, colors);
  if (/generalized transfer-law slider|move lambda from zero to one|generalized transfer/.test(text)) return transferSlider(step, colors);
  if (/matrix storage blocks|fill matrix blocks|matrix storage/.test(text)) return matrixStorage(step, colors);
  if (/one-dimensional dual-porosity coastal transect|homogeneous 1d coast|tidal crest propagates landward/.test(text)) return coastalTransect(step, colors);
  return null;
}
