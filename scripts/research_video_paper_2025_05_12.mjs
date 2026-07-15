const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];

const q = (value) => JSON.stringify(value);
const point = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (at, color, radius = 0.08) => `Dot(${q(at)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, at, color, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const rect = (width, height, at, stroke, fill, opacity = 0.35) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(at)})`;
const polygon = (vertices, stroke, fill, opacity = 0.25) => `Polygon(${vertices.map(q).join(", ")}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity})`;
const math = (value, at, color, size = 22) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(at)})`;
const axes = (at, color, width = 5.4, height = 2.8) => `Axes(x_range=[0, 6, 1], y_range=[0, 2, 0.5], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}}).shift(${q(at)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((item, index) => line(point(item[0], item[1]), point(points[index + 1][0], points[index + 1][1]), color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const phaseOf = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const colorsOf = (palette) => {
  const values = Array.isArray(palette) ? palette : [];
  return [values[0] ?? DEFAULT_PALETTE[0], values[1] ?? DEFAULT_PALETTE[1], values[2] ?? DEFAULT_PALETTE[2]];
};

function coastalDomain(colors, phase, options = {}) {
  const [accent, measured, pale] = colors;
  const items = [
    rect(6.0, 3.4, point(0, 0), measured, "#FFFFFF", 0),
    polygon([point(-3, 1.7), point(-1.55, 1.7), point(-1.55, 0.55), point(-0.5, 0.55), point(-0.5, 1.7)], measured, pale, 0.55),
    polygon([point(0.45, 1.7), point(0.45, 0.15), point(1.55, 0.15), point(1.55, 1.7), point(3, 1.7)], measured, pale, 0.55),
    line(point(-3, -1.2), point(3, -1.2), measured, 2),
  ];
  if (phase >= 1 || options.interfaces) {
    items.push(line(point(-1.55, 1.7), point(-1.55, 0.55), accent, 5), line(point(0.45, 1.7), point(0.45, 0.15), accent, 5));
  }
  if (phase === 2 || options.regions) {
    items.push(math(String.raw`\Omega_1`, point(-2.15, -0.2), measured, 22), math(String.raw`\Omega_2`, point(-0.45, -0.55), accent, 22), math(String.raw`\Omega_3`, point(1.9, -0.2), measured, 22));
  }
  return items;
}

function phasor(colors, phase, mode = "both") {
  const [accent, measured, pale] = colors;
  const angle = [0.35, 0.78, 1.12][phase];
  const end = point(2.0 * Math.cos(angle), 2.0 * Math.sin(angle));
  const items = [circle(2.0, point(0, 0), measured, 2, pale, 0.1), line(point(-2.25, 0), point(2.25, 0), measured, 2), line(point(0, -1.65), point(0, 1.8), measured, 2), arrow(point(0, 0), end, accent, 5), dot(point(0, 0), accent, 0.09)];
  if (phase >= 1 && mode !== "amplitude") items.push(`Arc(radius=0.72, start_angle=0, angle=${angle}, color=${q(accent)}, stroke_width=4)`, math(String.raw`\phi`, point(0.78, 0.33), accent, 24));
  if (phase === 2 && mode !== "phase") items.push(math(String.raw`A_h=|\hat h|`, point(-1.35, 1.42), accent, 23));
  return field(items);
}

function scene01(phase, colors) { return field(coastalDomain(colors, phase)); }
function scene02(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = coastalDomain(colors, phase, { interfaces: true });
  if (phase >= 1) items.push(...[-0.8, 0, 0.8].map((y) => arrow(point(-2.15, y), point(-1.68, y), measured, 2)));
  if (phase === 2) items.push(
    rect(0.22, 2.15, point(-1.55, 0.62), accent, pale, 0.55),
    rect(0.22, 2.55, point(0.45, 0.42), accent, pale, 0.55),
    math(String.raw`K_i'/b_i`, point(-2.28, -1.45), accent, 21),
  );
  return field(items);
}
function scene03(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [line(point(-2.9, 0), point(2.9, 0), measured, 3), rect(0.22, 3.1, point(0, 0), accent, pale, 0.45), ...[-1.0, 0, 1.0].map((y) => arrow(point(-1.65, y), point(-0.22, y), measured, 3))];
  if (phase >= 1) items.push(...[-1.0, 0, 1.0].map((y) => arrow(point(0.22, y), point(1.35, y), accent, 3)), math(String.raw`K_i'\,\partial_n h=(K_i'/b_i)(h_o-h)`, point(0, 1.75), accent, 20));
  if (phase === 2) items.push(circle(0.42, point(2.15, -0.8), accent, 4, pale, 0.2), math(String.raw`K_i'/b_i`, point(2.15, -0.8), accent, 19));
  return field(items);
}
function scene04(phase, colors) { return field(coastalDomain(colors, phase, { interfaces: true, regions: true })); }
function scene05(phase, colors) {
  const [accent, measured, pale] = colors;
  const equations = [String.raw`T_xh_{1,xx}+T_yh_{1,yy}=Sh_{1,t}`, String.raw`T_xh_{2,xx}+T_yh_{2,yy}=Sh_{2,t}`, String.raw`T_xh_{3,xx}+T_yh_{3,yy}=Sh_{3,t}`];
  const items = [];
  equations.forEach((equation, index) => {
    const y = 1.05 - index * 1.02;
    items.push(rect(5.75, 0.72, point(0, y), index <= phase ? accent : measured, pale, index <= phase ? 0.42 : 0.18));
    if (index <= phase) items.push(math(equation, point(0, y), index === phase ? accent : measured, 18));
  });
  items.push(line(point(-2.72, -1.45), point(2.72, -1.45), measured, 2), math(String.raw`\Omega_1\quad\Omega_2\quad\Omega_3`, point(0, -1.7), measured, 18));
  return field(items);
}
function scene06(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = coastalDomain(colors, 2, { interfaces: true, regions: true });
  const interfaces = [-1.55, 0.45].slice(0, phase === 0 ? 1 : 2);
  interfaces.forEach((x) => items.push(dot(point(x - 0.18, 0.18), measured, 0.11), dot(point(x + 0.18, 0.18), accent, 0.11), arrow(point(x - 0.62, -0.45), point(x - 0.05, -0.45), measured, 3), arrow(point(x + 0.62, -0.45), point(x + 0.05, -0.45), accent, 3)));
  if (phase === 2) items.push(math(String.raw`h^-\!=h^+`, point(-1.55, 1.35), accent, 19), math(String.raw`q_n^-\!=q_n^+`, point(0.45, 1.35), accent, 19));
  return field(items);
}
function scene07(phase, colors) { return phasor(colors, phase, "both"); }
function scene08(phase, colors) {
  const [accent, measured] = colors;
  const curves = [0.55, 1.0, 1.55].slice(0, phase + 1).flatMap((frequency, index) => {
    const pts = Array.from({ length: 9 }, (_, i) => [-2.8 + i * 0.7, -0.75 + index * 0.7 + 0.25 * Math.sin(i * frequency)]);
    return trace(pts, index === phase ? accent : measured, index === phase ? 5 : 2);
  });
  return field([line(point(-3, -1.25), point(3, -1.25), measured, 2), ...curves, ...(phase === 2 ? [math(String.raw`\hat h(x,y;k)`, point(1.85, 1.5), accent, 22)] : [])]);
}
function scene09(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...[1.25, 0.5, -0.25].map((y, index) => arrow(point(-2.8, y), point(-1.45, 0.55 - index * 0.25), index <= phase ? accent : measured, 3)), circle(0.42, point(-1.05, 0.25), accent, 4, pale, 0.2)];
  if (phase >= 1) items.push(arrow(point(-0.55, 0.25), point(0.55, 0.25), accent, 4), ...coastalDomain(colors, phase, { interfaces: true }).map((item) => item));
  if (phase === 2) items.push(math(String.raw`h=\mathcal F^{-1}\{\hat h\}`, point(1.35, 1.52), accent, 21));
  return field(items);
}
function scene10(phase, colors) {
  const [accent, measured, pale] = colors;
  const integrand = [[-2.8,-0.8],[-2.2,0.65],[-1.7,-0.25],[-1.2,0.32],[-0.7,-0.08],[-0.2,0.06]];
  const items = [axes(point(-1.65, -0.1), measured, 2.8, 2.5), ...trace(integrand.slice(0, 4 + phase), accent, 4)];
  if (phase >= 1) items.push(arrow(point(-0.05, 0), point(0.75, 0), accent, 4), ...coastalDomain(colors, phase, { interfaces: true }).slice(0, 3));
  if (phase === 2) items.push(math(String.raw`\int_0^\infty \hat h(k)\,dk`, point(1.65, -1.45), accent, 20));
  return field(items);
}
function scene11(phase, colors) { return phasor(colors, phase, "amplitude"); }
function scene12(phase, colors) { return phasor(colors, phase, "phase"); }
function scene13(phase, colors) {
  const [accent, measured, pale] = colors;
  const base = [[-2.7,-0.9],[-2.1,-0.55],[-1.4,-0.05],[-0.6,0.42],[0.25,0.78],[1.2,0.96],[2.55,1.05]];
  const alternate = base.map(([x,y], index) => [x, y + (0.3 - phase * 0.14) * Math.sin(index * 1.15)]);
  const items = [axes(point(0, -0.18), measured), ...trace(base, measured, 3), ...trace(alternate, accent, 5)];
  if (phase >= 1) items.push(...base.filter((_, index) => index % 2 === 0).map(([x,y]) => dot(point(x,y), pale, 0.08)));
  if (phase === 2) items.push(math(String.raw`\text{shared limit}`, point(1.7, 1.45), accent, 20));
  return field(items);
}
function scene14(phase, colors) {
  const [accent, measured, pale] = colors;
  const strips = [1.1, 0.35, -0.4].map((y, index) => rect(5.1 * [0.42, 0.68, 0.9][Math.min(phase, 2)], 0.38, point(-0.35 + phase * 0.35, y), index === phase ? accent : measured, index === phase ? accent : pale, 0.42));
  const items = [...strips, math(String.raw`S_{T_x}`, point(-2.6, 1.1), measured, 18), math(String.raw`S_{T_y}`, point(-2.6, 0.35), measured, 18), math(String.raw`S_{K_i'/b_i}`, point(-2.6, -0.4), measured, 18)];
  if (phase === 2) items.push(line(point(0, -1.1), point(0, 1.55), accent, 3), math(String.raw`\partial A_h/\partial p`, point(1.45, -1.35), accent, 20));
  return field(items);
}
function scene15(phase, colors) {
  const [accent, measured, pale] = colors;
  const obs = [[-2.7,-0.8],[-2.1,-0.5],[-1.45,0.05],[-0.7,0.52],[0.15,0.72],[1.05,0.82],[2.4,0.9]];
  const fit = obs.map(([x,y], index) => [x, y + (0.22 - phase * 0.1) * Math.cos(index)]);
  const items = [axes(point(0, -0.2), measured), ...obs.map(([x,y]) => dot(point(x,y), accent, 0.1)), ...trace(fit, measured, 4)];
  if (phase >= 1) items.push(arrow(point(-2.1, 1.45), point(-1.2, 0.78), accent, 3), math(String.raw`D`, point(-2.35, 1.55), accent, 22));
  if (phase === 2) items.push(arrow(point(2.2, 1.45), point(1.2, 0.92), accent, 3), math(String.raw`\bar h_w`, point(2.45, 1.55), accent, 22));
  return field(items);
}
function scene16(phase, colors) {
  const [accent, measured] = colors;
  const items = coastalDomain(colors, 2, { interfaces: true, regions: true });
  const arrows = [point(-2.45,-0.75), point(-1.35,-0.45), point(-0.2,-0.65), point(0.9,-0.35), point(2.0,-0.7)].slice(0, 3 + phase);
  arrows.forEach((at, index) => items.push(arrow(at, point(at[0] + 0.65, at[1] + (index % 2 ? 0.18 : -0.08)), index === arrows.length - 1 ? accent : measured, 3)));
  return field(items);
}
function scene17(phase, colors) {
  const [accent, measured] = colors;
  const items = coastalDomain(colors, 2, { interfaces: true });
  const paths = [-0.85,-0.35,0.15].slice(0, phase + 1).flatMap((offset, index) => trace([[-2.7,offset],[-1.9,offset+0.2],[-0.8,offset+0.5],[0.25,offset+0.2],[1.35,offset+0.45],[2.65,offset+0.25]], index === phase ? accent : measured, index === phase ? 5 : 2));
  return field([...items, ...paths]);
}
function scene18(phase, colors) {
  const [accent, measured, pale] = colors;
  const markerX = -2.35 + phase * 1.45;
  const items = [line(point(-2.8, 0), point(2.8, 0), measured, 4), dot(point(markerX, 0), accent, 0.14), math(String.raw`n=0.0046`, point(markerX, 0.65), accent, 24)];
  if (phase >= 1) items.push(rect(2.25, 0.68, point(1.55, -0.85), accent, pale, 0.42), math(String.raw`\text{too low for site}`, point(1.55, -0.85), accent, 19));
  if (phase === 2) items.push(arrow(point(markerX + 0.15, 0.25), point(1.0, -0.55), accent, 4));
  return field(items);
}
function scene19(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = coastalDomain(colors, 2, { interfaces: true, regions: true });
  const wells = [point(-2.1,-0.65), point(-0.65,-0.8), point(0.8,-0.55), point(2.1,-0.75)].slice(0, 2 + phase);
  wells.forEach((at, index) => {
    items.push(circle(0.12, at, measured, 3, pale, 0.3), arrow(at, point(at[0] + 0.38, at[1] + 0.32 + index * 0.04), accent, 3));
  });
  if (phase >= 1) items.push(math(String.raw`\mathrm{Hong\ Kong}`, point(-2.15, 1.38), measured, 19), math(String.raw`\mathrm{ocean\ tide}`, point(2.05, 1.38), measured, 18));
  if (phase === 2) items.push(
    math(String.raw`A_h,\phi`, point(1.8, 0.95), accent, 22),
    rect(0.18, 2.15, point(-1.55, 0.62), accent, pale, 0.5),
    rect(0.18, 2.55, point(0.45, 0.42), accent, pale, 0.5),
  );
  return field(items);
}

const SCENES = new Map([
  [1, scene01], [2, scene02], [3, scene03], [4, scene04], [5, scene05], [6, scene06], [7, scene07], [8, scene08], [9, scene09], [10, scene10],
  [11, scene11], [12, scene12], [13, scene13], [14, scene14], [15, scene15], [16, scene16], [17, scene17], [18, scene18], [19, scene19],
]);

export function renderPaperVisual2025_05_12(description, phase = 0, palette = DEFAULT_PALETTE) {
  const context = typeof description === "object" && description !== null ? description : {};
  const text = JSON.stringify(context).normalize("NFKC").toLowerCase();
  if (!text.includes("[paper:2025-05-12]")) return null;
  const renderer = SCENES.get(Number(context.sceneNumber));
  return renderer ? renderer(phaseOf(phase), colorsOf(palette)) : null;
}
