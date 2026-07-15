const q = (value) => JSON.stringify(value);
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.05)`;
const dot = (point, color, radius = 0.08) => `Dot(${q(point)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, point, color, width = 3) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=0).shift(${q(point)})`;
const rect = (width, height, point, stroke, fill, opacity = 0.35) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const polygon = (points, stroke, fill, opacity = 0.35) => `Polygon(${points.map(q).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const tex = (value, point, color, size = 28) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).shift(${q(point)})`;
const text = (value, point, color, size = 22) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).shift(${q(point)})`;
const axes = (point, color, width = 3.2, height = 2.2) => `Axes(x_range=[0, 4, 1], y_range=[0, 3, 1], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${q(point)})`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((point, index) => line([...point, 0], [...points[index + 1], 0], color, width));
const group = (items) => `VGroup(${items.join(", ")}).scale(0.7).shift([-1.45, 0.08, 0])`;

const DEFAULT_PALETTE = ["#137C8B", "#6B7C85", "#D9F0F2"];
const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const descriptionText = (description) => {
  if (typeof description === "object" && description !== null) return Object.values(description).filter((value) => typeof value === "string").join(" ");
  return String(description ?? "");
};
const normalizeText = (description) => descriptionText(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();

function dtsTraceItems(palette, phase) {
  const [accent, measured] = palette;
  const traceX = [-2.35, -1.8, -1.25, -0.7, -0.15, 0.4, 0.95, 1.5];
  const depths = [1.55, 0.78, 0.02, -0.74, -1.5];
  return traceX.flatMap((x, index) => {
    const active = index % 3 === phase ? accent : measured;
    const trace = line([x, -1.68, 0], [x, 1.68, 0], active, index % 3 === phase ? 4 : 2);
    const samples = depths.map((y, depthIndex) => dot([x + ((index + depthIndex) % 2 ? 0.04 : -0.04), y, 0], active, 0.075));
    return [trace, ...samples];
  });
}

function movingParcel(palette, phase) {
  const [accent, measured, pale] = palette;
  const parcelY = 1.3 - phase * 0.72;
  const thermal = [[0.35, 1.55], [0.72, 1.08], [1.0, 0.52], [0.78, -0.08], [0.48, -0.72], [0.32, -1.45]].map(([x, y]) => [x + phase * 0.12, y - phase * 0.1]);
  const items = [
    rect(2.25, 4.15, [-1.65, 0, 0], measured, pale, 0.42),
    ...[-2.15, -1.55, -0.95].map((x) => arrow([x, 2.35, 0], [x, 1.88, 0], measured, 3)),
    arrow([-1.65, 1.72, 0], [-1.65, parcelY + 0.24, 0], accent, 5),
    circle(0.24, [-1.65, parcelY, 0], accent, 5),
    line([0.08, 1.86, 0], [0.08, -1.86, 0], measured, 2),
    ...plot(thermal, accent, 4),
    ...thermal.filter((_, index) => index % 2 === 0).map(([x, y]) => dot([x, y, 0], accent, 0.1)),
    tex("T(z,t)", [1.45, 1.55, 0], accent, 27),
    tex("z", [-0.04, -2.15, 0], measured, 25),
    text("water parcel", [-1.65, parcelY - 0.5, 0], accent, 18),
  ];
  return group(items);
}

function dtsProfiles(palette, phase) {
  const [accent, measured, pale] = palette;
  const items = [
    rect(4.2, 4.15, [-0.42, 0, 0], measured, pale, 0.45),
    ...dtsTraceItems(palette, phase),
    ...[-2.05, -1.25, -0.45, 0.35, 1.15].map((x) => arrow([x, 2.25, 0], [x, 1.78, 0], accent, 3)),
    text("DTS × 8", [2.02, 1.64, 0], accent, 24),
    tex("T(z,t)", [2.05, 1.14, 0], measured, 25),
    text("0.1 °C · 60 s", [1.85, -1.75, 0], measured, 16),
  ];
  return group(items);
}

function preprocess(palette, phase) {
  const [accent, measured, pale] = palette;
  const noisy = [[-2.7, -0.75], [-2.25, -0.05], [-1.85, -0.4], [-1.4, 0.62], [-0.95, 0.15], [-0.48, 0.94], [-0.12, 0.45]];
  const surface = [[0.45, 0.7], [0.9, 1.35], [1.35, 0.92], [1.82, 1.7], [2.3, 1.14], [2.78, 1.58]];
  const filtered = [[-2.7, -0.55], [-2.25, -0.18], [-1.8, 0.08], [-1.35, 0.35], [-0.9, 0.52], [-0.45, 0.66], [-0.12, 0.78]];
  const smoothSurface = [[0.45, 0.82], [0.92, 1.05], [1.4, 1.28], [1.88, 1.43], [2.35, 1.53], [2.78, 1.6]];
  const items = [
    rect(2.85, 2.7, [-1.42, 0, 0], measured, pale, 0.2),
    rect(2.85, 2.7, [1.62, 0, 0], measured, pale, 0.2),
    axes([-1.42, 0, 0], measured, 2.75, 2.55),
    axes([1.62, 0, 0], measured, 2.75, 2.55),
    ...plot(noisy, measured, 2),
    ...noisy.map((point) => dot([...point, 0], measured, 0.085)),
    ...plot(surface, measured, 2),
    ...surface.map((point) => dot([...point, 0], measured, 0.085)),
    arrow([-0.22, 0, 0], [0.2, 0, 0], accent, 4),
    text("noisy DTS", [-1.42, 1.62, 0], measured, 20),
    text("surface T", [1.62, 1.62, 0], measured, 20),
  ];
  if (phase > 0) items.push(...plot(filtered, accent, 4), ...plot(smoothSurface, accent, 4));
  if (phase === 2) items.push(tex("filtered", [0, -1.67, 0], accent, 24));
  return group(items);
}

function analyticalProfile(palette, phase) {
  const [accent, measured, pale] = palette;
  const profile = [[-1.7, 1.35], [-1.38, 1.02], [-1.06, 0.62], [-0.7, 0.18], [-0.3, -0.23], [0.05, -0.62], [0.34, -1.22]].map(([x, y], index) => [x + phase * 0.1 + index * phase * 0.018, y - phase * 0.13]);
  const items = [
    rect(2.45, 4.05, [-1.35, 0, 0], measured, pale, 0.38),
    line([-1.92, 1.68, 0], [-1.92, -1.68, 0], measured, 2),
    ...plot(profile, accent, 5),
    ...profile.filter((_, index) => index % 2 === 0).map(([x, y]) => dot([x, y, 0], accent, 0.11)),
    arrow([0.9, 1.55, 0], [0.9, 0.5 - phase * 0.25, 0], accent, 4),
    tex("T(z,t;v)", [1.78, 1.36, 0], accent, 26),
    tex("v", [1.12, 0.82, 0], accent, 26),
    text("analytical", [-0.68, -1.92, 0], measured, 19),
  ];
  return group(items);
}

function validationProfiles(palette, phase) {
  const [accent, measured, pale] = palette;
  const analytical = [[-2.5, 1.18], [-1.95, 0.74], [-1.4, 0.28], [-0.8, -0.18], [-0.15, -0.55], [0.6, -0.82], [1.65, -1.02]];
  const numerical = analytical.map(([x, y], index) => [x, y + (index % 2 ? 0.035 : -0.025) * (2 - phase)]);
  const items = [
    axes([0, 0, 0], measured, 5.0, 3.25),
    ...plot(analytical, accent, 4),
    ...plot(numerical, measured, 3),
    ...numerical.map((point) => dot([...point, 0], measured, 0.08)),
    tex("T_a\\approx T_{CN}", [0, 1.62, 0], accent, 26),
    text("analytical", [2.55, 0.72, 0], accent, 18),
    text("Crank-Nicolson", [2.55, 0.28, 0], measured, 18),
  ];
  return group(items);
}

function fitVelocity(palette, phase) {
  const [accent, measured, pale] = palette;
  const observed = [[-2.55, 0.78], [-1.9, 0.42], [-1.25, 0.02], [-0.58, -0.34], [0.1, -0.12], [0.82, -0.58], [1.65, -0.82]];
  const predicted = observed.map(([x, y], index) => [x, y + (0.3 - phase * 0.095) * Math.sin(index * 1.6)]);
  const band = [...predicted, ...observed.slice().reverse()];
  const residuals = observed.map(([x, y], index) => line([x, y, 0], [predicted[index][0], predicted[index][1], 0], pale, 2));
  const items = [
    axes([0, 0, 0], measured, 5.0, 3.25),
    polygon(band.map(([x, y]) => [x, y, 0]), measured, pale, 0.52),
    ...residuals,
    ...plot(observed, measured, 4),
    ...observed.map((point) => dot([...point, 0], measured, 0.085)),
    ...plot(predicted, accent, 5),
    tex("v^*=\\operatorname{argmin}_v", [0.05, 1.52, 0], accent, 25),
    tex("\\min_v ||T_{DTS}-T(v)||^2", [0, -1.55, 0], measured, 25),
  ];
  return group(items);
}

function velocityToRate(palette, phase) {
  const [accent, measured, pale] = palette;
  const velocity = [[-2.75, -0.9], [-2.25, -0.5], [-1.7, 0.08], [-1.1, 0.42], [-0.5, 0.72]];
  const rate = velocity.map(([x, y], index) => [x + 3.65, y + 0.08 + phase * index * 0.035]);
  const items = [
    axes([-1.55, 0, 0], measured, 2.45, 2.65),
    axes([1.65, 0, 0], measured, 2.45, 2.65),
    ...plot(velocity, accent, 5),
    ...plot(rate, measured, 5),
    arrow([-0.25, 0, 0], [0.35, 0, 0], accent, 5),
    tex("q_I = n_e v", [0.05, 1.58, 0], accent, 31),
    text("seepage velocity", [-1.55, -1.68, 0], accent, 17),
    text("infiltration rate", [1.65, -1.68, 0], measured, 17),
    rect(0.78, 0.22, [0.05, -0.62, 0], accent, pale, 0.8),
  ];
  return group(items);
}

function rainfallComparison(palette, phase) {
  const [accent, measured, pale] = palette;
  const centers = [-2.25, 0, 2.25];
  const rainfall = [[0.6, 1.15, 0.82, 0.48], [0.42, 0.68, 0.95, 0.7], [0.32, 1.22, 0.5, 0.92]];
  const observed = [[-1.12, -0.92], [-0.62, -0.22], [-0.12, 0.38], [0.42, 0.7], [0.9, 0.78]];
  const inferred = [[-1.12, -0.92], [-0.62, -0.18], [-0.12, 0.34], [0.42, 0.63], [0.9, 0.72]];
  const items = [];
  centers.forEach((center, eventIndex) => {
    const observedPoints = observed.map(([x, y]) => [x + center, y + eventIndex * 0.08]);
    const inferredPoints = inferred.map(([x, y], pointIndex) => [x + center, y + eventIndex * 0.08 + (eventIndex === 2 && pointIndex > 2 ? phase * 0.09 : 0)]);
    items.push(
      ...rainfall[eventIndex].map((height, barIndex) => rect(0.28, height, [center - 0.84 + barIndex * 0.56, 1.15 + height / 2, 0], accent, pale, 0.78)),
      line([center - 1.12, -1.25, 0], [center + 0.92, -1.25, 0], measured, 2),
      line([center - 1.12, -1.25, 0], [center - 1.12, -0.18, 0], measured, 2),
      ...plot(observedPoints, measured, 4),
      ...plot(inferredPoints, accent, 4),
      ...inferredPoints.filter((_, index) => index % 2 === 0).map((point) => dot([...point, 0], accent, 0.08)),
      text(["strong", "weak", "nonuniform"][eventIndex], [center, 0.02, 0], measured, 16),
    );
  });
  items.push(text("flowmeter / inferred", [0, -1.72, 0], measured, 19));
  return group(items);
}

function finalProfile(palette, phase) {
  const [accent, measured, pale] = palette;
  const rateMeasured = [[1.45, -0.95], [1.82, -0.35], [2.18, 0.22], [2.58, 0.55], [3.0, 0.66]];
  const rateInferred = rateMeasured.map(([x, y], index) => [x, y + (0.2 - phase * 0.06) * Math.sin(index)]);
  const items = [
    rect(4.2, 4.1, [-0.42, 0, 0], measured, pale, 0.45),
    ...dtsTraceItems(palette, phase),
    ...[-1.85, -1.05, -0.25, 0.55, 1.35].map((x) => arrow([x, 2.25, 0], [x, 1.78, 0], accent, 3)),
    arrow([-0.42, 1.62, 0], [-0.42, -1.6, 0], accent, 5),
    tex("q_I=n_e v", [-0.42, -2.02, 0], accent, 25),
    axes([2.25, -0.25, 0], measured, 2.45, 2.35),
    ...plot(rateMeasured, measured, 4),
    ...plot(rateInferred, accent, 4),
    text("DTS profile", [-0.42, 1.64, 0], accent, 19),
    text("flowmeter", [2.28, 1.24, 0], measured, 17),
    text("inferred", [2.28, 0.92, 0], accent, 17),
    tex("T(z,t)\\to v\\to q_I", [2.22, -1.64, 0], accent, 22),
  ];
  return group(items);
}

export function paperVisualExpression(description, phase = 0, palette = DEFAULT_PALETTE) {
  const textValue = normalizeText(description);
  if (!textValue.includes("[paper:2022-12-29]")) return null;
  const normalizedPhase = normalizePhase(phase);
  const sourceColors = Array.isArray(palette) && palette.length >= 3 ? palette : DEFAULT_PALETTE;
  const colors = normalizedPhase === 0 ? ["#50656F", "#6F858F", "#E3EAED"] : sourceColors;
  if (/original rainfall|thermal inference tracks|inferred flux|final dts|source-defined relation/.test(textValue)) return finalProfile(colors, normalizedPhase);
  if (/moving water parcel|temperature-depth profile|heat traces water|water parcel|advection/.test(textValue)) return movingParcel(colors, normalizedPhase);
  if (/noisy dts|surface[- ]temperature|filter thermal|preprocessed|noise removal/.test(textValue)) return preprocess(colors, normalizedPhase);
  if (/eight dts|dts traces|extract dts|dts profiles|optical-fiber profiles/.test(textValue)) return dtsProfiles(colors, normalizedPhase);
  if (/crank[- ]nicolson|validate analytical|numerical model|matched analytical|independently discretized/.test(textValue)) return validationProfiles(colors, normalizedPhase);
  if (/analytical temperature curve|simulate subsurface|predicted temperature profile|heat-transfer model|boundary heating/.test(textValue)) return analyticalProfile(colors, normalizedPhase);
  if (/fit seepage|measured and predicted|residual band|least squares|levenberg|optimization|seepage-velocity estimate/.test(textValue)) return fitVelocity(colors, normalizedPhase);
  if (/velocity.*rate|rate.*velocity|darcy infiltration|q i|effective porosity|infiltration flux|convert velocity/.test(textValue)) return velocityToRate(colors, normalizedPhase);
  if (/rainfall hyetograph|three rainfall|paired estimated|flowmeter|compare infiltration|rainfall patterns/.test(textValue)) return rainfallComparison(colors, normalizedPhase);
  return finalProfile(colors, normalizedPhase);
}
