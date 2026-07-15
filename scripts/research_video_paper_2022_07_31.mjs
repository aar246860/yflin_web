const MARKER = "[paper:2022-07-31]";
const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const p = (x, y) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${p(...a)}, ${p(...b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${p(...a)}, ${p(...b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (xy, color, radius = 0.08) => `Dot(${p(...xy)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, xy, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${p(...xy)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0.2) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${p(...xy)})`;
const polygon = (points, stroke, fill, opacity = 0.2) => `Polygon(${points.map(([x, y]) => p(x, y)).join(", ")}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (latex, xy, color, size = 23) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${p(...xy)})`;
const label = (value, xy, color, size = 17) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${p(...xy)})`;
const axes = (xy, color, width = 5.2, height = 3.0, xRange = "[0, 5, 1]", yRange = "[0, 5, 1]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${p(...xy)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((point, index) => line(point, points[index + 1], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const phaseOf = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const colorsOf = (palette) => {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return [source[0] ?? DEFAULT_PALETTE[0], source[1] ?? DEFAULT_PALETTE[1], source[2] ?? DEFAULT_PALETTE[2]].map(String);
};
const descriptionText = (description) => {
  if (typeof description !== "object" || description === null) return String(description ?? "");
  return [description.marker, description.description, description.visualObject, description.stepDetail, description.visibleEvidence, description.motionPurpose, description.minimalText, description.premise, description.operation, description.output, description.claim]
    .filter((value) => typeof value === "string").join(" ");
};
const normalizedText = (value) => value.normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();

function rainfallFlux(phase, [accent, measured, pale]) {
  const hydrograph = [[0.35, -1.0], [0.8, 0.45], [1.25, -0.45], [1.75, 0.92], [2.25, -0.2], [2.75, 0.48]];
  const lengths = [[0.35, 0.55, 0.3], [0.72, 0.45, 0.8], [0.45, 0.9, 0.58]][phase];
  const items = [rect(2.7, 3.65, [-1.65, -0.05], measured, pale, 0.32), line([-3.0, 1.77], [-0.3, 1.77], measured, 4)];
  items.push(...[-2.45, -1.65, -0.85].map((x, index) => arrow([x, 2.3], [x, 2.3 - lengths[index]], accent, 4)));
  items.push(...[-2.55, -1.75, -0.95].slice(0, phase + 1).map((x, index) => arrow([x, 1.35], [x, 0.55 - 0.38 * index], accent, 4 + index)));
  items.push(axes([1.55, -0.15], measured, 2.85, 2.5, "[0, 5, 1]", "[0, 1, 0.25]"), ...trace(hydrograph.slice(0, 3 + phase * 2), accent, 4), math(String.raw`q_a(t)`, [2.45, 1.28], accent, 24));
  return field(items);
}

function thermometerProfiles(phase, [accent, measured, pale]) {
  const profiles = [
    [[-0.45, 1.55], [0.05, 0.8], [0.22, 0.05], [0.05, -0.72], [-0.4, -1.48]],
    [[-0.18, 1.55], [0.38, 0.8], [0.52, 0.05], [0.28, -0.72], [-0.18, -1.48]],
    [[0.12, 1.55], [0.65, 0.8], [0.74, 0.05], [0.48, -0.72], [0.08, -1.48]],
  ];
  const items = [rect(2.25, 4.0, [-1.75, 0], measured, pale, 0.3), line([-1.75, 1.72], [-1.75, -1.72], measured, 5)];
  items.push(...[1.3, 0.55, -0.2, -0.95].map((y) => circle(0.11, [-1.75, y], accent, 3, pale, 0.55)));
  profiles.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points, index === phase ? accent : measured, index === phase ? 5 : 2)));
  items.push(arrow([-0.85, 1.55], [-0.85, 0.8 - phase * 0.55], accent, 4), math(String.raw`T(z,t)`, [1.72, 1.52], accent, 25), math(String.raw`z\downarrow`, [-2.45, -1.6], measured, 21));
  return field(items);
}

function averageFlux(phase, [accent, measured, pale]) {
  const curve = [[-2.7, -1.0], [-2.2, -0.2], [-1.65, 0.95], [-1.05, 0.25], [-0.45, 1.1], [0.15, -0.05], [0.75, 0.65], [1.35, -0.5], [2.05, 0.25], [2.7, -0.65]];
  const items = [axes([0, -0.1], measured, 5.6, 3.0, "[0, 8, 2]", "[0, 1, 0.25]"), ...trace(curve, accent, 4)];
  if (phase >= 1) items.push(polygon([[-2.7, -1.0], ...curve, [2.7, -1.0]], accent, pale, 0.45), math(String.raw`\int_0^t q_a(\tau)\,d\tau`, [0, 1.62], accent, 22));
  if (phase === 2) items.push(rect(5.35, 1.02, [0, -0.49], measured, pale, 0.42), line([-2.68, 0.02], [2.68, 0.02], measured, 5), math(String.raw`q=\frac{1}{t}\int_0^t q_a(\tau)\,d\tau`, [0, -1.62], accent, 23));
  return field(items);
}

function cubicInitialProfile(phase, [accent, measured, pale]) {
  const measuredPoints = [[-1.72, 1.5], [-1.35, 0.96], [-0.82, 0.38], [-0.2, -0.16], [0.55, -0.72], [1.45, -1.45]];
  const cubic = [[-1.72, 1.5], [-1.52, 1.2], [-1.22, 0.82], [-0.82, 0.38], [-0.35, -0.05], [0.18, -0.5], [0.78, -0.98], [1.45, -1.45]];
  const items = [axes([-0.15, 0], measured, 4.8, 3.35, "[0, 5, 1]", "[0, 1.2, 0.2]"), ...measuredPoints.map((xy) => dot(xy, measured, 0.1)), math(String.raw`T\ ({}^\circ\mathrm{C})`, [-2.35, 1.62], measured, 18), math(String.raw`z\ (\mathrm{m})`, [2.5, -1.48], measured, 18)];
  if (phase >= 1) items.push(...trace(cubic.slice(0, phase === 1 ? 5 : cubic.length), accent, 5));
  if (phase === 2) items.push(math(String.raw`T(z,0)=T_0+a_1z+a_2z^2+a_3z^3`, [0.2, 1.55], accent, 22), circle(0.19, measuredPoints[3], accent, 4, pale, 0.12));
  return field(items);
}

function surfaceBoundary(phase, [accent, measured, pale]) {
  const samples = [[-2.7, 0.15], [-2.25, 0.82], [-1.78, 0.52], [-1.3, -0.35], [-0.82, -0.68], [-0.35, 0.05], [0.15, 0.85], [0.68, 0.42], [1.2, -0.52], [1.75, -0.25], [2.25, 0.72], [2.7, 0.28]];
  const harmonicA = samples.map(([x]) => [x, 0.62 * Math.sin((x + 2.7) * 2.0)]);
  const harmonicB = samples.map(([x]) => [x, 0.3 * Math.cos((x + 2.7) * 3.35)]);
  const fit = harmonicA.map(([x, y], index) => [x, y + harmonicB[index][1]]);
  const items = [axes([0, -0.12], measured, 5.55, 3.0, "[0, 48, 12]", "[-2, 2, 1]"), ...samples.map((xy) => dot(xy, measured, 0.075))];
  if (phase >= 1) items.push(...trace(harmonicA, pale, 3), ...trace(harmonicB, measured, 2), math(String.raw`A_i\cos(2\pi t/P_i-\phi_i)`, [0, 1.55], measured, 20));
  if (phase === 2) items.push(...trace(fit, accent, 5), math(String.raw`T(0,t)=T_1+\sum_i A_i\cos(2\pi t/P_i-\phi_i)`, [0, -1.62], accent, 20));
  return field(items);
}

function analyticalHeat(phase, [accent, measured, pale]) {
  const profiles = [
    [[0.45, 1.45], [0.92, 0.72], [1.05, -0.05], [0.72, -0.78], [0.28, -1.45]],
    [[0.75, 1.45], [1.25, 0.72], [1.34, -0.05], [1.0, -0.78], [0.55, -1.45]],
    [[1.02, 1.45], [1.53, 0.72], [1.58, -0.05], [1.22, -0.78], [0.82, -1.45]],
  ];
  const items = [rect(2.6, 4.05, [-1.55, 0], measured, pale, 0.3), ...trace(profiles[0].map(([x, y]) => [x - 2.2, y]), measured, 4), math(String.raw`T(z,0)`, [-2.25, -1.72], measured, 20)];
  if (phase >= 1) items.push(line([-2.85, 1.78], [-0.25, 1.78], accent, 5), math(String.raw`T(0,t)`, [-1.55, 2.08], accent, 20), ...[-2.45, -1.75, -1.05].map((x) => arrow([x, 1.45], [x, 0.78], pale, 3)));
  if (phase === 2) items.push(...profiles.flatMap((points, index) => trace(points, index === 2 ? accent : measured, index === 2 ? 5 : 2)), arrow([-0.75, 1.18], [-0.75, -0.78], accent, 5), math(String.raw`U=C_wq/C_s`, [1.45, 1.65], accent, 22), math(String.raw`T(z,t;q)`, [1.55, -1.72], accent, 23));
  return field(items);
}

function fitAverageFlux(phase, [accent, measured, pale]) {
  const observed = [[-2.55, 1.25], [-2.05, 0.78], [-1.45, 0.3], [-0.72, -0.18], [0.1, -0.62], [1.05, -1.02], [2.15, -1.32]];
  const trial = observed.map(([x, y], index) => [x, y + [0.35, -0.22, 0.28, -0.3, 0.2, -0.16, 0.12][index] * (2 - phase) / 2]);
  const items = [axes([-0.1, 0], measured, 5.3, 3.2, "[0, 5, 1]", "[0, 1.2, 0.2]"), ...observed.map((xy) => dot(xy, measured, 0.095)), ...trace(trial, accent, 4)];
  if (phase >= 1) items.push(...observed.map((xy, index) => line(xy, trial[index], pale, 2)), math(String.raw`\sum_j[T_j-T(z_j,t;q)]^2`, [0.3, 1.55], measured, 20));
  if (phase === 2) items.push(math(String.raw`q_i^*=\operatorname*{arg\,min}_q\sum_j r_j^2`, [0, -1.62], accent, 22), circle(0.2, observed[3], accent, 4, pale, 0.12));
  return field(items);
}

function splineFlux(phase, [accent, measured, pale]) {
  const samples = [[-2.65, -0.92], [-1.9, -0.15], [-1.18, 0.55], [-0.42, 0.28], [0.38, 1.0], [1.18, 0.58], [2.0, 1.22], [2.65, 0.72]];
  const items = [axes([0, -0.05], measured, 5.5, 3.0, "[0, 7, 1]", "[0, 1, 0.25]"), ...samples.map((xy) => dot(xy, measured, 0.1)), math(String.raw`q_i`, [-2.65, 1.5], measured, 22)];
  if (phase >= 1) items.push(...trace(samples.slice(0, phase === 1 ? 5 : samples.length), accent, 5));
  if (phase === 2) items.push(math(String.raw`q(t)\in C^2`, [1.9, -1.4], accent, 25), ...samples.slice(1, -1).map((xy) => circle(0.15, xy, pale, 2)));
  return field(items);
}

function cumulativeTangent(phase, [accent, measured, pale]) {
  const average = [[-2.7, -1.0], [-2.1, -0.45], [-1.45, 0.05], [-0.75, 0.48], [0.0, 0.72], [0.8, 0.5], [1.65, 0.02], [2.55, -0.38]];
  const cumulative = [[-2.7, -1.2], [-2.1, -1.08], [-1.45, -0.75], [-0.75, -0.22], [0.0, 0.42], [0.8, 0.92], [1.65, 1.22], [2.55, 1.38]];
  const tangentIndex = [2, 4, 6][phase];
  const [tx, ty] = cumulative[tangentIndex];
  const items = [axes([0, -0.08], measured, 5.55, 3.05, "[0, 7, 1]", "[0, 5, 1]"), ...trace(phase === 0 ? average : cumulative, phase === 0 ? measured : accent, 4)];
  if (phase >= 1) items.push(math(String.raw`Q(t)=q(t)t`, [-1.72, 1.48], accent, 24), dot([tx, ty], accent, 0.11), line([tx - 0.72, ty - 0.42], [tx + 0.72, ty + 0.42], measured, 5));
  if (phase === 2) items.push(arrow([tx + 0.2, ty + 0.82], [tx + 0.05, ty + 0.25], accent, 4), math(String.raw`q_a(t)=\frac{d(qt)}{dt}`, [0.45, -1.55], accent, 29));
  return field(items);
}

function normalizedSensitivity(phase, [accent, measured, pale]) {
  const baseline = [[-2.55, -0.72], [-1.85, 0.2], [-1.15, 0.85], [-0.4, 0.42], [0.35, -0.18], [1.15, -0.52], [2.1, -0.68]];
  const perturbed = baseline.map(([x, y], index) => [x, y + 0.18 * Math.sin(index + 0.4)]);
  const response = baseline.map(([x], index) => [x, (perturbed[index][1] - baseline[index][1]) * 4.2]);
  const items = [axes([0, -0.05], measured, 5.25, 3.05, "[0, 6, 1]", "[-1, 1, 0.5]"), ...trace(baseline, measured, 4), math(String.raw`T(P_m)`, [-1.9, 1.45], measured, 21)];
  if (phase >= 1) items.push(...trace(perturbed, pale, 4), math(String.raw`\Delta P_m=10^{-3}P_m`, [1.55, 1.45], accent, 21), line(perturbed[3], baseline[3], accent, 5));
  if (phase === 2) items.push(...trace(response, accent, 5), math(String.raw`X_m\approx P_m\frac{T(P_m+\Delta P_m)-T(P_m)}{\Delta P_m}`, [0, -1.55], accent, 19));
  return field(items);
}

function differentialImportance(phase, [accent, measured, pale]) {
  const curves = [
    [[-2.65, -0.75], [-1.8, 0.15], [-0.9, 0.92], [0, 0.38], [0.9, -0.12], [1.8, -0.48], [2.65, -0.58]],
    [[-2.65, -0.42], [-1.8, -0.1], [-0.9, 0.25], [0, 0.52], [0.9, 0.35], [1.8, 0.12], [2.65, 0.02]],
    [[-2.65, -0.2], [-1.8, -0.3], [-0.9, -0.38], [0, -0.2], [0.9, 0.02], [1.8, 0.12], [2.65, 0.18]],
  ];
  const items = [axes([0, -0.05], measured, 5.5, 3.0, "[0, 6, 1]", "[0, 1, 0.25]")];
  curves.slice(0, phase + 1).forEach((points, index) => items.push(...trace(points.map(([x, y]) => [x, phase === 0 ? y : Math.abs(y)]), index === 0 ? accent : index === 1 ? measured : pale, index === 0 ? 5 : 3)));
  if (phase >= 1) items.push(math(String.raw`|X_m|`, [-2.35, 1.45], measured, 22), math(String.raw`\sum_j|X_j|`, [2.15, 1.45], measured, 22));
  if (phase === 2) items.push(math(String.raw`DIM_m=\frac{|X_m|}{\sum_j|X_j|}`, [0, -1.55], accent, 27), ...[[-0.9, 0.92], [0, 0.52], [2.65, 0.18]].map((xy) => dot(xy, accent, 0.09)));
  return field(items);
}

function femProfiles(phase, [accent, measured, pale]) {
  const meshY = [1.62, 1.42, 1.2, 0.92, 0.58, 0.18, -0.3, -0.86, -1.5];
  const profiles = [0, 1, 2, 3, 4].map((timeIndex) => meshY.map((y, depthIndex) => [-0.15 + timeIndex * 0.42 + 0.28 * Math.sin(depthIndex * 0.8 + timeIndex * 0.55), y]));
  const times = [12, 24, 36, 48, 60];
  const visibleProfiles = phase === 0 ? 0 : phase === 1 ? 3 : 5;
  const items = [rect(2.25, 3.5, [-2.0, 0.05], measured, pale, 0.25), line([-2.82, 1.72], [-1.18, 1.72], accent, 4), ...meshY.map((y, index) => line([-2.82, y], [-1.18, y], index < 4 ? accent : measured, index < 4 ? 3 : 2)), line([-2.82, -1.58], [-2.82, 1.72], measured, 3), line([-1.18, -1.58], [-1.18, 1.72], measured, 3), label("fine mesh", [-2.0, 2.02], accent, 16)];
  profiles.slice(0, visibleProfiles).forEach((points, index) => items.push(...trace(points, index === visibleProfiles - 1 ? accent : measured, index === visibleProfiles - 1 ? 4 : 2), math(`${times[index]}\\,\\mathrm{h}`, points.at(-1).map((value, axis) => axis === 0 ? value + 0.12 : value - 0.28), index === visibleProfiles - 1 ? accent : measured, 15)));
  if (phase === 0) items.push(math(String.raw`N=500`, [1.22, 1.5], accent, 23), math(String.raw`\Delta z=0.01\text{--}1.2\,\mathrm{m}`, [1.28, 1.05], measured, 19));
  if (phase === 2) items.push(math(String.raw`t=12,24,36,48,60\,\mathrm{h}`, [0.95, -1.78], accent, 20));
  return field(items);
}

function forwardVerification(phase, [accent, measured, pale]) {
  const profiles = [0, 1, 2, 3, 4].map((timeIndex) => [[-2.55 + timeIndex * 0.38, 1.25], [-2.35 + timeIndex * 0.38, 0.62], [-2.15 + timeIndex * 0.38, 0.02], [-2.0 + timeIndex * 0.38, -0.6], [-1.85 + timeIndex * 0.38, -1.22]]);
  const items = [axes([0, -0.05], measured, 5.4, 3.1, "[10, 18, 2]", "[0, 1.2, 0.2]")];
  profiles.forEach((points, index) => items.push(...trace(points, index === 4 ? accent : measured, index === 4 ? 4 : 2)));
  if (phase >= 1) profiles.forEach((points) => items.push(...points.map(([x, y], index) => dot([x + (index % 2 ? 0.018 : -0.015), y], pale, 0.06))));
  if (phase >= 1) items.push(label("analytical", [1.95, 1.48], accent, 16), label("FEM", [2.55, 1.48], measured, 16));
  if (phase === 2) items.push(line([-2.35, 0.62], [-2.332, 0.62], accent, 7), math(String.raw`\max|T_a-T_{FEM}|<0.1\,{}^\circ\mathrm{C}`, [0.35, -1.58], accent, 21));
  return field(items);
}

function seeComparison(phase, [accent, measured, pale]) {
  const truth = [[-2.7, -1.05], [-2.1, 0.42], [-1.45, 1.05], [-0.75, 0.55], [0.05, 0.18], [0.9, -0.08], [1.75, -0.28], [2.65, -0.42]];
  const present = truth.map(([x, y], index) => [x, y + 0.08 * Math.sin(index)]);
  const constantQ = truth.map(([x, y], index) => [x, y - (0.32 + 0.08 * index)]);
  const items = [axes([0, -0.08], measured, 5.55, 3.0, "[0, 48, 12]", "[0, 20, 5]"), ...trace(truth, measured, 4), label("true", [2.55, -0.05], measured, 16)];
  if (phase >= 1) items.push(...trace(present, accent, 5), math(String.raw`SEE_p=0.40\,\mathrm{mm\,h^{-1}}`, [-0.95, 1.5], accent, 19));
  if (phase === 2) items.push(...trace(constantQ, pale, 4), math(String.raw`SEE_c=1.97\,\mathrm{mm\,h^{-1}}`, [1.45, 1.5], measured, 19), label("constant-q", [2.2, -1.38], measured, 16));
  return field(items);
}

function saturatedDays(phase, [accent, measured, pale]) {
  const centers = [-2.45, -1.25, -0.05, 1.15, 2.35];
  const items = [line([-2.85, -0.85], [2.75, -0.85], measured, 4)];
  centers.forEach((x, index) => {
    const retained = index >= 1 && phase === 2;
    items.push(rect(0.82, 1.35, [x, 0.15], retained ? accent : measured, retained ? pale : "#FFFFFF", retained ? 0.42 : 0.05), label(`day ${index + 1}`, [x, -1.18], retained ? accent : measured, 15));
    if (phase >= 1) items.push(...[0.58, 0.18, -0.22].map((y, sensor) => dot([x + 0.12 * Math.sin(sensor + index), y], retained ? accent : measured, 0.055)));
  });
  if (phase >= 1) items.push(arrow([-2.45, 1.45], [-1.55, 1.45], accent, 4), label("water passes sensors", [-1.0, 1.45], accent, 16));
  if (phase === 2) items.push(math(String.raw`\mathrm{days}\ 2\text{--}5`, [0.55, 1.82], accent, 24), line([-1.66, -1.55], [2.76, -1.55], accent, 5));
  return field(items);
}

function crossCorrelationLag(phase, [accent, measured, pale]) {
  const measuredCurve = [[-2.8, -1.0], [-2.4, 0.2], [-2.0, 0.82], [-1.55, 0.35], [-1.1, -0.15], [-0.65, 0.62], [-0.2, 0.08]];
  const estimatedCurve = measuredCurve.map(([x, y]) => [x + 0.48, y - 0.05]);
  const correlation = [[0.5, -0.92], [0.9, -0.55], [1.3, 0.02], [1.72, 0.82], [2.1, 0.28], [2.5, -0.35], [2.85, -0.72]];
  const items = [axes([-1.52, -0.1], measured, 2.9, 2.75, "[0, 5, 1]", "[0, 1, 0.25]"), ...trace(measuredCurve, measured, 4), ...trace(estimatedCurve, accent, 4), label("measured", [-2.15, 1.42], measured, 15), label("estimated", [-0.85, 1.42], accent, 15)];
  if (phase >= 1) items.push(axes([1.72, -0.1], measured, 2.8, 2.75, "[0, 2, 0.5]", "[0, 1, 0.25]"), ...trace(correlation, accent, 4), math(String.raw`R(\tau)`, [2.55, 1.35], accent, 20));
  if (phase === 2) items.push(dot([1.72, 0.82], accent, 0.13), line([1.72, -1.02], [1.72, 0.82], pale, 3), math(String.raw`\tau_{\max}=1.08\,\mathrm{d}`, [1.65, -1.48], accent, 24));
  return field(items);
}

function horizontalShift(phase, [accent, measured, pale]) {
  const measuredCurve = [[-2.7, -1.0], [-2.2, 0.28], [-1.65, 0.9], [-1.05, 0.22], [-0.4, -0.18], [0.25, 0.68], [0.95, 0.02]];
  const shift = phase === 0 ? 0 : phase === 1 ? 0.34 : 0.62;
  const shiftedMeasured = measuredCurve.map(([x, y]) => [x + shift, y]);
  const estimated = measuredCurve.map(([x, y], index) => [x + 0.62, y + 0.06 * Math.sin(index)]);
  const items = [axes([0, -0.08], measured, 5.55, 3.0, "[0, 5, 1]", "[0, 8, 2]"), ...trace(estimated, accent, 5), ...trace(shiftedMeasured, measured, 4), label("estimated fixed", [1.9, 1.42], accent, 16)];
  if (phase >= 1) items.push(arrow([-1.7, -1.42], [-1.7 + shift, -1.42], measured, 4), math(String.raw`\Delta t=1.08\,\mathrm{d}`, [-0.55, -1.45], measured, 22));
  if (phase === 2) items.push(...shiftedMeasured.filter((_, index) => index % 2 === 0).map((xy) => dot(xy, measured, 0.08)), circle(0.18, shiftedMeasured[3], accent, 4, pale, 0.15));
  return field(items);
}

function alignedAgreement(phase, [accent, measured, pale]) {
  const estimated = [[-2.65, -0.95], [-2.1, 0.18], [-1.55, 0.85], [-0.95, 0.32], [-0.32, -0.05], [0.35, 0.72], [1.05, 0.05], [1.78, 0.52], [2.55, -0.25]];
  const measuredCurve = estimated.map(([x, y], index) => [x, y + 0.07 * Math.sin(index * 1.4)]);
  const items = [axes([0, -0.08], measured, 5.55, 3.0, "[0, 5, 1]", "[0, 8, 2]"), ...trace(estimated, accent, 5), label("estimated", [2.18, 1.4], accent, 16)];
  if (phase >= 1) items.push(...trace(measuredCurve, measured, 3), ...measuredCurve.filter((_, index) => index % 2 === 0).map((xy) => dot(xy, measured, 0.07)), label("measured", [2.2, 1.08], measured, 16));
  if (phase === 2) items.push(rect(3.2, 0.9, [0, -1.52], measured, pale, 0.35), math(String.raw`\bar q_m=4.67\,\mathrm{mm\,h^{-1}}`, [-0.78, -1.38], measured, 17), math(String.raw`\bar q_e=4.60\,\mathrm{mm\,h^{-1}}`, [0.82, -1.38], accent, 17), math(String.raw`\Delta\bar q=0.07\,\mathrm{mm\,h^{-1}}`, [0, -1.72], accent, 17));
  return field(items);
}

function lysimeterReturn(phase, [accent, measured, pale]) {
  const hydrograph = [[0.45, -1.0], [0.88, 0.18], [1.35, 0.82], [1.85, 0.25], [2.35, -0.08], [2.85, 0.58]];
  const estimated = hydrograph.map(([x, y], index) => [x, y + 0.06 * Math.sin(index)]);
  const items = [rect(2.45, 3.8, [-1.8, 0], measured, pale, 0.32), line([-3.0, 1.72], [-0.6, 1.72], accent, 5), ...[-2.55, -1.8, -1.05].map((x) => arrow([x, 2.18], [x, 1.68], accent, 4)), line([-1.8, 1.42], [-1.8, -1.45], measured, 5), ...[1.0, 0.2, -0.6, -1.25].map((y) => circle(0.1, [-1.8, y], accent, 3, pale, 0.55))];
  if (phase >= 1) items.push(arrow([-1.25, 1.18], [-1.25, -1.25], accent, 5), math(String.raw`T(z,t)\rightarrow q(t)`, [-1.8, -1.82], accent, 22), axes([1.7, -0.12], measured, 2.8, 2.55, "[0, 5, 1]", "[0, 8, 2]"), ...trace(hydrograph, measured, 3));
  if (phase === 2) items.push(...trace(estimated, accent, 5), math(String.raw`q_a(t)=\frac{d(qt)}{dt}`, [1.68, 1.5], accent, 23), math(String.raw`\Delta t=1.08\,\mathrm{d}`, [1.7, -1.52], measured, 20));
  return field(items);
}

const SCENES = [
  [/original lysimeter soil column|aligned measured-estimated flux hydrographs|analytical-profile inversion followed/, lysimeterReturn],
  [/shifted measured and estimated curves|post-shift agreement|average-flux readouts|4\.67.*4\.60/, alignedAgreement],
  [/measured hydrograph translated horizontally|shift measured curve|displaced by 1\.08/, horizontalShift],
  [/paired hydrographs feeding a cross-correlation|cross-correlation lag|estimate 1\.08-day lag/, crossCorrelationLag],
  [/five-day profile timeline|days two through five|second through fifth|saturated-stage profiles/, saturatedDays],
  [/true,? present-approach,? and constant-q|see comparison|scalar see readouts/, seeComparison],
  [/analytical and finite-element temperature-depth curves overlaid|verification of the analytical forward model|mark the maximum departure/, forwardVerification],
  [/finite-element soil column generating|finite-element temperature-depth profiles at the reported comparison times|solve the nodal temperatures/, femProfiles],
  [/normalized sensitivity curves converted|differential importance|fractional importance curves/, differentialImportance],
  [/one perturbed parameter feeding|normalized temperature sensitivity|perturb one parameter/, normalizedSensitivity],
  [/tangent slope moving along|instantaneous actual vertical groundwater flux|d\(qt\)\/dt|plot its slope as qa/, cumulativeTangent],
  [/discrete average-flux points joined|differentiable q time trajectory|smooth spline/, splineFlux],
  [/predicted profile aligning with measured|one fitted q value|minimize residuals/, fitAverageFlux],
  [/boundary and initial curves propagating|analytical temperature-depth solution|solve transient heat transport/, analyticalHeat],
  [/irregular surface-temperature trace|time-dependent top boundary|harmonic components/, surfaceBoundary],
  [/measured initial temperatures aligned|cubic-polynomial initial condition|cubic depth curve|fit cubic initial profile/, cubicInitialProfile],
  [/transient flux curve paired with equal-area|measurement-interval average|q is an average/, averageFlux],
  [/vertical thermometer string|family of temperature-depth curves|heat traces water|fixed sensor depths/, thermometerProfiles],
  [/rainfall-driven transient downward|rainfall pulses drive a changing|flux changes|pulse the downward flux/, rainfallFlux],
];

export function renderPaperVisual2022_07_31(description, phase = 0, palette = DEFAULT_PALETTE) {
  const rawText = descriptionText(description);
  if (!rawText.includes(MARKER)) return null;
  const text = normalizedText(rawText);
  const match = SCENES.find(([pattern]) => pattern.test(text));
  return match ? match[1](phaseOf(phase), colorsOf(palette)) : null;
}
