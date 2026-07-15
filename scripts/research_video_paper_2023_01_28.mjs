const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const q = (value) => JSON.stringify(value);
const point = ([x, y]) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const dashed = (a, b, color, width = 2) => `DashedLine(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (at, color, radius = 0.08) => `Dot(${point(at)}, radius=${radius}, color=${q(color)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.25) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(at)})`;
const math = (latex, at, color, size = 24) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${point(at)})`;
const label = (value, at, color, size = 18) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(at)})`;
const axes = (at, color, width = 3, height = 2.5) => `Axes(x_range=[0, 4, 1], y_range=[0, 4, 1], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${point(at)})`;
const curve = (points, color, width = 3) => points.slice(0, -1).map((start, index) => line(start, points[index + 1], color, width));
const field = (items) => `VGroup(${items.flat().filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const phaseOf = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const textOf = (description) => typeof description === "object" && description !== null
  ? Object.values(description).filter((value) => typeof value === "string").join(" ")
  : String(description ?? "");
const colorsOf = (palette) => {
  const colors = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [colors[0] ?? DEFAULT_PALETTE[0], colors[1] ?? DEFAULT_PALETTE[1], colors[2] ?? DEFAULT_PALETTE[2]].map(String);
};

function soilColumn(x, colors, fillOpacity = 0.32) {
  const [accent, measured, pale] = colors;
  return [rect(1.45, 3.15, [x, -0.05], measured, pale, fillOpacity), line([x - 0.82, 1.53], [x + 0.82, 1.53], accent, 4)];
}

function scene01(phase, colors) {
  const [accent, measured, pale] = colors;
  const profile = [[-1.5, 1.28], [-1.28, 0.82], [-1.05, 0.3], [-0.78, -0.35], [-0.55, -1.3]];
  const items = [...soilColumn(-1.05, colors), ...curve(profile.slice(0, 3 + phase), accent, 5), line([-2.75, 1.53], [0.65, 1.53], pale, 5)];
  if (phase >= 1) items.push(...profile.slice(0, 3 + phase).map((at) => dot(at, accent, 0.065)), math("T(z,t)", [0.55, 0.9], accent, 25));
  if (phase === 2) items.push(arrow([-2.35, 1.15], [-2.35, -1.2], measured, 5), math("q", [-2.65, -0.05], measured, 27), label("heat tracer", [1.25, -0.75], accent, 19));
  return field(items);
}

function scene02(phase, colors) {
  const [accent, measured, pale] = colors;
  const common = [[-2.25, 1.2], [-2.1, 0.55], [-1.9, -0.05]];
  const finite = [...common, [-1.55, -0.65], [-1.1, -1.25]];
  const infinite = common.map(([x, y]) => [x + 3.25, y]).concat([[1.1, -0.65], [1.2, -1.25]]);
  const items = [...soilColumn(-1.85, colors, 0.26), ...soilColumn(1.4, colors, 0.12), ...curve(common, accent, 4), ...curve(infinite.slice(0, 3), accent, 4)];
  if (phase >= 1) items.push(line([-2.65, -1.62], [-1.05, -1.62], accent, 6), arrow([-2.35, -1.9], [-2.35, -1.58], accent, 4), dashed([0.55, -1.62], [2.25, -1.62], measured, 2));
  if (phase === 2) items.push(...curve(finite.slice(2), accent, 5), ...curve(infinite.slice(2), measured, 4), label("finite", [-1.85, 1.82], accent), label("semi-infinite", [1.4, 1.82], measured));
  return field(items);
}

function scene03(phase, colors) {
  const [accent, measured, pale] = colors;
  const sand = [[-2.25, 1.18], [-2.08, 0.35], [-1.72, -0.45], [-1.25, -1.2]];
  const clay = [[1.0, 1.18], [1.2, 0.35], [1.68, -0.45], [2.28, -1.2]];
  const items = [...soilColumn(-1.75, colors, 0.42), ...soilColumn(1.55, colors, 0.58), label("sand", [-1.75, 1.82], accent, 20), label("clay", [1.55, 1.82], measured, 20)];
  if (phase >= 1) items.push(math(String.raw`\lambda=2.20\ \mathrm{W\,m^{-1}\,{}^\circ C^{-1}}`, [-1.75, 0.7], accent, 17), math(String.raw`c\rho=2.96\!\times\!10^6\ \mathrm{J\,m^{-3}\,{}^\circ C^{-1}}`, [-1.75, 0.2], accent, 15), math(String.raw`\lambda=1.58\ \mathrm{W\,m^{-1}\,{}^\circ C^{-1}}`, [1.55, 0.7], measured, 17), math(String.raw`c\rho=3.10\!\times\!10^6\ \mathrm{J\,m^{-3}\,{}^\circ C^{-1}}`, [1.55, 0.2], measured, 15));
  if (phase === 2) items.push(...curve(sand, accent, 5), ...curve(clay, measured, 5), arrow([-0.15, -0.55], [0.35, -0.55], accent, 3));
  return field(items);
}

function scene04(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...soilColumn(-2.35, colors, 0.38), ...curve([[-2.75, 1.18], [-2.48, 0.65], [-2.65, 0.05], [-2.28, -0.55], [-2.05, -1.25]], accent, 5), label("conduction", [-0.65, 1.1], accent, 18)];
  if (phase >= 1) items.push(arrow([-1.65, 1.05], [-1.65, -1.05], measured, 5), math(String.raw`q\,c_w\rho_w\,\partial_zT`, [0.85, 0.3], measured, 22), math(String.raw`\lambda\,\partial_{zz}T`, [0.85, 1.05], accent, 23), math(String.raw`c\rho\,\partial_tT`, [0.85, -0.55], accent, 23), arrow([-1.1, 0.95], [0.05, 1.05], accent, 3), arrow([-1.1, 0.1], [0.05, 0.3], measured, 3));
  if (phase === 2) items.push(math(String.raw`\lambda\frac{\partial^2T}{\partial z^2}-q c_w\rho_w\frac{\partial T}{\partial z}=c\rho\frac{\partial T}{\partial t}`, [0.25, 1.72], accent, 22), math(String.raw`\lambda:\ \mathrm{W\,m^{-1}\,{}^\circ C^{-1}}`, [1.75, -0.95], measured, 17), math(String.raw`c\rho,\ c_w\rho_w:\ \mathrm{J\,m^{-3}\,{}^\circ C^{-1}}`, [1.35, -1.35], measured, 16), math(String.raw`q:\ \mathrm{m\,yr^{-1}}`, [-0.6, -1.65], measured, 17), rect(3.9, 0.75, [0.65, 1.72], pale, pale, 0.12));
  return field(items);
}

function modelCard(x, y, name, domain, boundary, active, colors) {
  const [accent, measured, pale] = colors;
  const color = active ? accent : measured;
  return [rect(1.75, 1.15, [x, y], color, pale, active ? 0.32 : 0.08), label(name, [x, y + 0.3], color, 19), label(domain, [x, y], measured, 14), label(boundary, [x, y - 0.32], color, 14)];
}

function scene05(phase, colors) {
  const cards = [[-2.1, 0.8, "BPS", "steady | finite", "lower temperature"], [0, 0.8, "HCS", "steady | finite", "lower heat flux"], [2.1, 0.8, "TAS", "transient | semi-inf", "top linear"], [-2.1, -0.75, "KMS", "transient | semi-inf", "top exponential"], [0, -0.75, "KIS", "transient | semi-inf", "top stepped"], [2.1, -0.75, "CTS", "transient | finite", "lower convective"]];
  const activeCount = [2, 5, 6][phase];
  const items = cards.flatMap((card, index) => modelCard(...card, index < activeCount, colors));
  if (phase === 2) items.push(math(String.raw`h_f`, [2.72, -1.35], colors[0], 24), line([1.35, -1.42], [2.85, -1.42], colors[0], 5));
  return field(items);
}

function scene06(phase, colors) {
  const [accent, measured, pale] = colors;
  const base = [[0.1, 1.05], [0.35, 0.55], [0.7, 0.05], [1.15, -0.55], [1.75, -1.15]];
  const items = [...soilColumn(-2.25, colors, 0.36), math(String.raw`\lambda,\ c\rho,\ q`, [-2.25, 0.25], accent, 25), axes([1.0, -0.1], measured, 3.4, 2.8), math("T", [2.75, -1.42], measured, 21), math("z", [-0.9, 1.25], measured, 21)];
  if (phase >= 1) items.push(arrow([-1.15, 0], [-0.7, 0], accent, 4), ...curve(base, accent, 5), arrow([-2.8, 1.1], [-2.8, -1.1], measured, 4));
  if (phase === 2) items.push(...[0.1, 0.2, -0.12, 0.32, -0.25].flatMap((offset, index) => curve(base.map(([x, y], pointIndex) => [x + offset * pointIndex / 4, y]), index % 2 ? measured : pale, 2)), label("BPS HCS TAS KMS KIS CTS", [0.95, 1.72], accent, 16));
  return field(items);
}

function scene07(phase, colors) {
  const [accent, measured, pale] = colors;
  const cts = [[-2.25, 1.2], [-1.95, 0.65], [-1.55, 0.05], [-1.05, -0.55], [-0.45, -1.2]];
  const offsets = phase === 2 ? [0.55, 0.85, 1.1] : [0.18, 0.3, 0.42];
  const items = [axes([0, 0], measured, 5.6, 3.1), ...curve(cts, accent, 5), label("CTS", [-0.2, -1.25], accent, 17), math(phase === 2 ? "t=75\ \\mathrm{yr}" : "t=25\ \\mathrm{yr}", [2.15, 1.35], measured, 21)];
  if (phase >= 1) offsets.forEach((offset, index) => items.push(...curve(cts.map(([x, y], pointIndex) => [x + offset * pointIndex / 4, y]), index === 1 ? measured : pale, index === 1 ? 4 : 3)));
  if (phase === 2) items.push(label("TAS  KMS  KIS", [1.9, -0.9], measured, 16), line([-2.75, 0.35], [2.75, 0.35], pale, 3), math("z>20\ \\mathrm{m}", [2.35, 0.05], accent, 20), arrow([0.1, -1.55], [1.15, -1.55], accent, 4));
  return field(items);
}

function scene08(phase, colors) {
  const [accent, measured, pale] = colors;
  const sand20 = [[-2.75, 0.95], [-2.48, 0.35], [-2.15, -0.3], [-1.72, -1.0]];
  const clay20 = sand20.map(([x, y], index) => [x + index * 0.035, y]);
  const sand80 = sand20.map(([x, y]) => [x + 3.65, y]);
  const clay80 = sand80.map(([x, y], index) => [x + index * 0.2, y]);
  const items = [axes([-2.15, -0.05], measured, 2.45, 2.65), math("t=20\ \\mathrm{yr}", [-2.15, 1.45], measured, 20), ...curve(sand20, accent, 4), ...curve(clay20, measured, 3)];
  if (phase >= 1) items.push(axes([1.5, -0.05], measured, 2.45, 2.65), math("t=80\ \\mathrm{yr}", [1.5, 1.45], accent, 20), ...curve(sand80, accent, 5), ...curve(clay80, measured, 5));
  if (phase === 2) items.push(label("sand", [-1.35, -1.42], accent, 16), label("clay", [2.55, -1.42], measured, 16), label("BPS HCS TAS KMS KIS CTS", [0, 1.82], accent, 15), math(String.raw`\lambda_s=2.20,\ \lambda_c=1.58\ \mathrm{W\,m^{-1}\,{}^\circ C^{-1}}`, [0, -1.78], measured, 16));
  return field(items);
}

function scene09(phase, colors) {
  const [accent, measured, pale] = colors;
  const surface = [[-2.8, 1.0], [-2.2, 0.82], [-1.6, 1.15], [-1.0, 0.95], [-0.4, 1.32], [0.2, 1.12], [0.8, 1.48], [1.4, 1.2], [2.0, 1.55], [2.7, 1.35]];
  const items = [...soilColumn(0, colors, 0.22), ...curve(surface, measured, 4), ...surface.filter((_, index) => index % 2 === 0).map((at) => dot(at, accent, 0.06)), arrow([0, 0.95], [0, 0.55], accent, 4)];
  if (phase >= 1) items.push(label("TAS linear", [-2.25, -1.05], measured, 15), label("KMS exponential", [-0.75, -1.45], measured, 15), label("KIS stepped", [0.85, -1.05], measured, 15), label("CTS arbitrary", [2.25, -1.45], accent, 15));
  if (phase === 2) items.push(label("Sendai surface record", [0, 1.82], accent, 18), math(String.raw`1947\text{--}2007\quad (60\ \mathrm{yr})`, [0, -1.82], measured, 20), ...surface.slice(-3).map((at) => dot(at, accent, 0.11)));
  return field(items);
}

function scene10(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...soilColumn(-1.45, colors, 0.3), line([-2.25, -1.62], [-0.65, -1.62], accent, 6), dashed([-2.7, 1.53], [-2.7, -1.62], measured, 2), math("L=54\ \\mathrm{m}", [-2.95, 0], measured, 20), dot([-1.45, -1.38], measured, 0.11)];
  if (phase >= 1) items.push(arrow([-0.35, -1.62], [0.35, -1.62], accent, 4), math(String.raw`T_L\approx14.3^\circ\mathrm C`, [1.45, -0.85], measured, 22), label("Well No. 4", [1.45, -1.35], measured, 17));
  if (phase === 2) items.push(rect(2.85, 0.85, [1.35, 0.65], accent, pale, 0.25), math(String.raw`h_f=8.26\ \mathrm{W\,m^{-2}\,{}^\circ C^{-1}}`, [1.35, 0.65], accent, 18), label("convective lower BC", [1.35, 1.35], accent, 18), ...[0.65, 1.05, 1.45].map((x) => arrow([x, -0.35], [x, -0.7], accent, 2)));
  return field(items);
}

function scene11(phase, colors) {
  const [accent, measured, pale] = colors;
  const models = [[-2.45, "TAS", "0.181"], [-0.82, "KMS", "0.28"], [0.82, "KIS", "0.24"], [2.45, "CTS", "0.33"]];
  const items = models.flatMap(([x, name]) => [rect(1.3, 2.65, [x, 0], measured, pale, 0.1), label(name, [x, 1.55], name === "CTS" ? accent : measured, 17), ...[-0.85, -0.25, 0.35, 0.92].map((y, index) => dot([x - 0.22 + index * 0.08, y], measured, 0.045))]);
  if (phase >= 1) models.forEach(([x], index) => items.push(...curve([[x - 0.32, 1.0], [x - 0.2, 0.35], [x, -0.25], [x + 0.28 + index * 0.025, -0.95]], index === 3 ? accent : measured, index === 3 ? 5 : 3), arrow([x + 0.45, 0.9], [x + 0.45, -0.75], index === 3 ? accent : measured, 3)));
  if (phase === 2) models.forEach(([x, , value], index) => items.push(math(`q=${value}`, [x, -1.55], index === 3 ? accent : measured, 18), math(String.raw`\mathrm{m\,yr^{-1}}`, [x, -1.82], measured, 13)));
  return field(items);
}

function scene12(phase, colors) {
  const [accent, measured, pale] = colors;
  const observed = [[-2.7, 1.0], [-2.45, 0.48], [-2.12, -0.05], [-1.72, -0.58], [-1.25, -1.05]];
  const fit = observed.map(([x, y], index) => [x + [0.18, -0.12, 0.16, -0.08, 0.12][index], y]);
  const values = [["TAS", 0.0786], ["KMS", 0.0442], ["KIS", 0.0194], ["CTS", 0.0131]];
  const items = [axes([-1.95, 0], measured, 2.7, 2.75), ...observed.map((at) => dot(at, measured, 0.07)), ...curve(fit, accent, 4)];
  if (phase >= 1) items.push(...observed.map((at, index) => line(at, fit[index], pale, 4)), arrow([-0.55, 0], [0.05, 0], accent, 4));
  if (phase === 2) values.forEach(([name, value], index) => {
    const height = value * 20;
    items.push(rect(0.48, height, [0.55 + index * 0.72, -1.0 + height / 2], index === 3 ? accent : measured, index === 3 ? accent : pale, 0.5), label(name, [0.55 + index * 0.72, -1.35], index === 3 ? accent : measured, 14), math(String(value), [0.55 + index * 0.72, 1.05], index === 3 ? accent : measured, 15));
  });
  return field(items);
}

function scene13(phase, colors) {
  const [accent, measured, pale] = colors;
  const observed = [[-2.6, 1.15], [-2.28, 0.62], [-1.92, 0.05], [-1.48, -0.5], [-0.95, -1.1]];
  const cts = observed.map(([x, y], index) => [x + [0.02, -0.02, 0.01, -0.015, 0.02][index], y]);
  const items = [axes([-1.75, 0], measured, 3.3, 3.0), ...observed.map((at) => dot(at, measured, 0.085)), label("Sendai Well No. 4", [-1.75, 1.65], measured, 17)];
  if (phase >= 1) [0.2, 0.34, 0.48].forEach((offset, index) => items.push(...curve(observed.map(([x, y], pointIndex) => [x + offset * pointIndex / 4, y]), index === 1 ? measured : pale, 3)));
  if (phase === 2) items.push(...curve(cts, accent, 6), rect(2.6, 1.55, [1.55, 0.05], accent, pale, 0.24), label("CTS", [1.55, 0.55], accent, 24), math(String.raw`\mathrm{RMSE}=0.0131^\circ\mathrm C`, [1.55, 0.05], accent, 19), math(String.raw`q=0.33\ \mathrm{m\,yr^{-1}}`, [1.55, -0.48], accent, 20));
  return field(items);
}

function scene14(phase, colors) {
  const [accent, measured, pale] = colors;
  const profile = [[-1.35, 1.18], [-1.18, 0.55], [-0.92, -0.05], [-0.55, -0.65], [-0.12, -1.25]];
  const surface = [[-2.1, 1.58], [-1.65, 1.72], [-1.2, 1.55], [-0.75, 1.75], [-0.3, 1.58]];
  const items = [...soilColumn(-0.75, colors, 0.4), ...profile.map((at) => dot(at, measured, 0.055)), label("Sendai alluvial soil", [1.65, 1.35], measured, 18)];
  if (phase >= 1) items.push(...curve(surface, measured, 3), ...curve(profile, accent, 6), line([-1.58, -1.62], [0.08, -1.62], accent, 6), ...[0.75, 1.15, 1.55].map((x) => arrow([x, -0.85], [x, -1.25], accent, 2)), label("surface history", [-2.2, 1.92], measured, 15), label("lower thermal BC", [1.3, -1.62], accent, 16));
  if (phase === 2) items.push(arrow([-2.25, 1.15], [-2.25, -1.15], accent, 5), math(String.raw`q=0.33\ \mathrm{m\,yr^{-1}}`, [1.7, 0.55], accent, 21), math(String.raw`\mathrm{RMSE}=0.0131^\circ\mathrm C`, [1.7, 0.05], measured, 19), rect(2.75, 1.35, [1.65, 0.3], pale, pale, 0.12));
  return field(items);
}

export function renderPaperVisual2023_01_28(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!text.includes("[paper:2023-01-28]")) return null;
  const step = phaseOf(phase);
  const colors = colorsOf(palette);
  if (/sendai borehole temperature-depth profile inside a finite|surface history lower thermal boundary and fitted vertical flux/.test(text)) return scene14(step, colors);
  if (/measured sendai profile with the four|cts agreement emphasized/.test(text)) return scene13(step, colors);
  if (/residual segments from measured temperature points|four rmse markers/.test(text)) return scene12(step, colors);
  if (/groundwater-flux arrow adjusted beside each model|infer q from td data/.test(text)) return scene11(step, colors);
  if (/measured deepest-borehole temperature|fit lower boundary parameters/.test(text)) return scene10(step, colors);
  if (/measured sendai surface-temperature history|fit top boundary parameters/.test(text)) return scene09(step, colors);
  if (/paired source-defined sand and clay profiles|soil type profiles/.test(text)) return scene08(step, colors);
  if (/source-defined transient profiles sharing|thermal boundary profiles/.test(text)) return scene07(step, colors);
  if (/one soil column generating source-defined|simulate synthetic temperature profiles/.test(text)) return scene06(step, colors);
  if (/six model frames sorted|classify analytical solutions/.test(text)) return scene05(step, colors);
  if (/bounded soil column whose conductive spread|form transient heat equation/.test(text)) return scene04(step, colors);
  if (/matched sand and clay columns|soil type may be an important factor/.test(text)) return scene03(step, colors);
  if (/paired finite and semi-infinite soil columns|lower thermal boundary can alter/.test(text)) return scene02(step, colors);
  if (/vertical porous column with a descending temperature signal|heat is treated as a groundwater tracer/.test(text)) return scene01(step, colors);
  return null;
}
