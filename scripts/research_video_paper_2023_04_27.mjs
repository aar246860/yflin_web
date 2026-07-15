const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
// allow: SIZE_OK - one-file ownership keeps the complete 29-scene adapter self-contained.
const q = (value) => JSON.stringify(value);
const point = (x, y) => [x, y, 0];
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const dot = (xy, color, radius = 0.08) => `Dot(${q(xy)}, radius=${radius}, color=${q(color)})`;
const circle = (radius, xy, color, width = 3, opacity = 0) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=${opacity}).shift(${q(xy)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0.25) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(xy)})`;
const arrow = (a, b, color, width = 4) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, buff=0.04, stroke_width=${width})`;
const arc = (radius, xy, color, start = 0, angle = 3.05, width = 3) => `Arc(radius=${radius}, start_angle=${start}, angle=${angle}, color=${q(color)}, stroke_width=${width}).shift(${q(xy)})`;
const tex = (value, xy, color, size = 23) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(xy)})`;
const axes = (xy, color, width = 5.8, height = 2.8, yRange = "[0, 1.2, 0.2]") => `Axes(x_range=[0, 10, 2], y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": False}).shift(${q(xy)})`;
const trace = (points, color, width = 3, dashed = false) => points.slice(0, -1).flatMap((xy, index) => dashed && index % 2 ? [] : [line([...xy, 0], [...points[index + 1], 0], color, width)]);
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

function colorsOf(palette) {
  const source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  return DEFAULT_PALETTE.map((fallback, index) => String(source[index] ?? fallback));
}

function phaseOf(phase) {
  const value = Number(phase);
  return Math.max(0, Math.min(2, Number.isFinite(value) ? Math.trunc(value) : 0));
}

function column(colors, phase, x = -2.25) {
  const [accent, measured, pale] = colors;
  const particles = [[x - 0.45, 1.05], [x + 0.2, 0.72], [x - 0.25, 0.25], [x + 0.35, -0.12], [x - 0.35, -0.65], [x + 0.25, -1.02]];
  return [rect(1.35, 3.25, point(x, 0), measured, pale, 0.36), line(point(x - 0.67, -1.62), point(x + 0.67, -1.62), measured, 4), ...particles.slice(0, 2 + phase * 2).map((xy, index) => dot([...xy, 0], index % 2 ? measured : accent, 0.09))];
}

function clock(xy, symbol, color, phase) {
  const angle = [1.1, 2.7, 4.5][phase];
  return [circle(0.38, xy, color, 4), line(xy, [xy[0] + 0.28 * Math.cos(angle), xy[1] + 0.28 * Math.sin(angle), 0], color, 4), tex(symbol, [xy[0], xy[1] - 0.62, 0], color, 22)];
}

function scene01(phase, [accent, measured, pale]) {
  const observed = [[-2.8, -1.1], [-2.15, -0.78], [-1.55, 0.05], [-0.9, 1.05], [-0.2, 0.62], [0.65, 0.15], [1.6, -0.2], [2.7, -0.5]];
  const ade = [[-2.8, -1.1], [-2.1, -0.82], [-1.35, 0.18], [-0.6, 0.8], [0.1, 0.48], [0.9, -0.02], [1.8, -0.48], [2.7, -0.72]];
  const items = [axes(point(0, -0.25), measured, 5.8, 2.9), ...observed.slice(0, 5 + phase).map((xy) => dot([...xy, 0], accent, 0.09)), ...trace(observed, accent, 4)];
  if (phase > 0) items.push(...trace(ade, measured, 3, true));
  if (phase === 2) items.push(line(point(-0.9, 0.8), point(-0.9, 1.05), accent, 5), line(point(1.6, -0.48), point(1.6, -0.2), accent, 5), circle(0.2, point(1.6, -0.34), accent, 3), tex(String.raw`C(t)`, point(2.55, 0.95), pale, 20));
  return field(items);
}

function scene02(phase, [accent, measured, pale]) {
  const items = [rect(5.5, 0.72, point(-0.15, 0.65), measured, pale, 0.42), rect(1.3, 1.15, point(0.8, -0.45), measured, pale, 0.28), line(point(0.8, 0.28), point(0.8, 0.08), measured, 5)];
  const mobile = [[-2.55, 0.65], [-1.75, 0.65], [-0.95, 0.65], [-0.15, 0.65], [0.65, 0.65], [1.45, 0.65], [2.25, 0.65]];
  items.push(...mobile.slice(0, 3 + phase * 2).map((xy) => dot([...xy, 0], accent, 0.1)), arrow(point(-2.8, 0.65), point(2.65, 0.65), measured, 3));
  if (phase > 0) items.push(arrow(point(0.65, 0.4), point(0.75, -0.15), accent, 4), dot(point(0.8, -0.45), accent, 0.11));
  if (phase === 2) items.push(arrow(point(1.0, -0.2), point(1.15, 0.38), measured, 3), dot(point(1.1, -0.62), measured, 0.09), tex(String.raw`C_m`, point(-1.9, 1.15), accent), tex(String.raw`C_{im}`, point(0.8, -1.25), measured));
  return field(items);
}

function scene03(phase, [accent, measured, pale]) {
  const grains = [[-1.6, 0.65], [-0.55, 0.2], [0.55, 0.72], [1.55, -0.05], [-0.9, -0.85], [0.45, -0.75]];
  const items = [rect(6.0, 2.8, point(0, 0), measured, pale, 0.25), ...grains.map((xy) => circle(0.35, [...xy, 0], measured, 3, 0.15)), arrow(point(-2.8, 1.25), point(2.8, 1.25), accent, 3)];
  const liquid = [[-2.45, 1.0], [-1.95, 0.15], [-0.1, 1.05], [0.95, 0.1], [2.25, 0.8]];
  items.push(...liquid.map((xy) => dot([...xy, 0], accent, 0.09)));
  if (phase > 0) items.push(arrow(point(-1.95, 0.15), point(-1.7, 0.48), measured, 3), arrow(point(0.95, 0.1), point(1.3, -0.02), measured, 3));
  if (phase === 2) items.push(dot(point(-1.7, 0.48), measured, 0.12), dot(point(1.3, -0.02), measured, 0.12), arrow(point(0.25, -0.75), point(0.7, -0.4), accent, 3), tex(String.raw`C\rightleftarrows S`, point(2.0, -1.25), accent));
  return field(items);
}

function scene04(phase, colors) {
  const [accent, measured, pale] = colors;
  const packetX = -1.75 + phase * 0.8;
  const items = [rect(5.8, 1.2, point(-0.2, 0.25), measured, pale, 0.28), arrow(point(-2.8, 0.25), point(2.55, 0.25), measured, 3), ...[-0.24, 0, 0.24].map((dy) => dot(point(packetX, 0.25 + dy), accent, 0.11)), ...clock(point(2.25, 0.85), String.raw`\tau_J`, accent, phase)];
  if (phase > 0) items.push(line(point(packetX - 0.22, 0.02), point(packetX + 0.22, 0.48), accent, 4), line(point(packetX - 0.22, 0.48), point(packetX + 0.22, 0.02), accent, 4));
  if (phase === 2) items.push(arc(0.65, point(packetX, 0.25), accent, 0.2, 4.8, 4), tex(String.raw`J`, point(packetX, -0.7), accent, 25));
  return field(items);
}

function scene05(phase, colors) {
  const [accent, measured, pale] = colors;
  const grains = [[-1.6, 0.45], [-0.55, -0.35], [0.6, 0.35], [1.55, -0.25]];
  const items = [rect(5.8, 2.35, point(-0.15, 0), measured, pale, 0.24), ...grains.map((xy) => circle(0.38, [...xy, 0], measured, 3, 0.12)), ...clock(point(2.35, 0.9), String.raw`\tau_C`, accent, phase)];
  items.push(...grains.slice(0, 2 + phase).map(([x, y]) => dot(point(x - 0.25, y + 0.22), accent, 0.1)));
  if (phase > 0) items.push(arrow(point(-2.65, 0.8), point(-1.9, 0.55), accent, 3), arrow(point(0.15, 1.0), point(0.4, 0.55), accent, 3));
  if (phase === 2) items.push(dot(point(-1.85, 0.68), measured, 0.12), dot(point(0.35, 0.57), measured, 0.12), tex(String.raw`C\to S`, point(-2.25, -1.15), accent));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const ticks = Array.from({ length: 9 }, (_, index) => -2.8 + index * 0.7);
  const items = [line(point(-2.85, -0.75), point(2.85, -0.75), measured, 3), ...ticks.map((x) => line(point(x, -0.88), point(x, -0.62), measured, 2)), arrow(point(-2.55, 0.65), point(-0.8 + phase * 0.25, 0.65), accent, 5), ...clock(point(-1.75 + phase * 0.25, 1.15), String.raw`\tau_J`, accent, phase)];
  items.push(...trace([[-2.55, -0.1], [-1.8, 0.1], [-1.05, 0.48], [-0.3, 0.2]], measured, 4));
  if (phase > 0) items.push(arrow(point(-0.3, 0.2), point(0.65 + phase * 0.35, 0.2), measured, 4), ...clock(point(1.55 + phase * 0.2, 0.75), String.raw`\tau_C`, measured, phase));
  if (phase === 2) items.push(tex(String.raw`J(t+\tau_J)=-D C_x(t+\tau_C)+vC(t+\tau_C)`, point(0, -1.35), accent, 22));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const items = [tex(String.raw`J(t+\tau_J)`, point(-2.15, 1.15), accent, 24), arrow(point(-1.35, 1.15), point(-0.75, 1.15), accent, 3), tex(String.raw`J`, point(-0.4, 1.15), accent, 24), tex(String.raw`\tau_JJ_t`, point(0.55, 1.15), accent, 23), tex(String.raw`\frac{\tau_J^2}{2}J_{tt}`, point(1.8, 1.15), pale, 21)];
  items.push(tex(String.raw`C(t+\tau_C)`, point(-2.15, -0.25), measured, 24), arrow(point(-1.35, -0.25), point(-0.75, -0.25), measured, 3), tex(String.raw`C`, point(-0.4, -0.25), measured, 24));
  if (phase > 0) items.push(tex(String.raw`\tau_CC_t`, point(0.55, -0.25), measured, 23), tex(String.raw`\frac{\tau_C^2}{2}C_{tt}`, point(1.8, -0.25), pale, 21), tex("+", point(0.05, 1.15), accent), tex("+", point(1.15, 1.15), accent), tex("+", point(0.05, -0.25), measured), tex("+", point(1.15, -0.25), measured));
  if (phase === 2) items.push(tex(String.raw`+\cdots`, point(2.75, 1.15), accent, 22), tex(String.raw`+\cdots`, point(2.75, -0.25), measured, 22), rect(5.7, 0.48, point(0.55, -1.25), accent, pale, 0.18), tex(String.raw`\tau_J,\tau_C\ll t`, point(0.55, -1.25), accent, 22));
  return field(items);
}

function scene08(phase, [accent, measured, pale]) {
  const items = [tex(String.raw`J+\tau_JJ_t+\frac{\tau_J^2}{2}J_{tt}+\cdots`, point(0, 0.95), measured, 23), tex(String.raw`C+\tau_CC_t+\frac{\tau_C^2}{2}C_{tt}+\cdots`, point(0, -0.1), measured, 23)];
  if (phase > 0) items.push(line(point(0.75, 1.25), point(2.75, 0.7), accent, 5), line(point(0.75, 0.2), point(2.75, -0.35), accent, 5), rect(2.3, 0.55, point(-1.45, 1.55), accent, pale, 0.18), tex(String.raw`i\leq1`, point(-1.45, 1.55), accent, 23));
  if (phase === 2) items.push(tex(String.raw`(1+\tau_J\partial_t)J\simeq(1+\tau_C\partial_t)(-DC_x+vC)`, point(0, -1.2), accent, 21));
  return field(items);
}

function scene09(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...column(colors, phase, -2.45), arrow(point(-1.6, 0.65), point(-0.85, 0.65), measured, 4), arrow(point(-0.85, -0.65), point(-1.6, -0.65), measured, 4), tex(String.raw`-\partial_xJ`, point(-0.9, 1.05), measured, 22)];
  if (phase > 0) items.push(rect(3.3, 0.75, point(1.15, 0.7), accent, pale, 0.2), tex(String.raw`R(1+\tau_J\partial_t)C_t`, point(1.15, 0.7), accent, 22), rect(3.3, 0.75, point(1.15, -0.45), measured, pale, 0.2), tex(String.raw`(1+\tau_C\partial_t)L_xC`, point(1.15, -0.45), measured, 22));
  if (phase === 2) items.push(tex("=", point(1.15, 0.08), accent, 28), tex(String.raw`L_x=\frac{D}{R}\partial_{xx}-\frac{v}{R}\partial_x`, point(1.15, -1.35), accent, 21));
  return field(items);
}

function scene10(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [rect(1.6, 3.3, point(-1.5, 0), measured, pale, phase === 0 ? 0.3 : 0.08), line(point(-2.3, -1.65), point(-0.7, -1.65), measured, 4), tex(String.raw`t=0`, point(-1.5, 1.35), measured, 22)];
  if (phase > 0) items.push(tex(String.raw`C(x,0)=0`, point(1.0, 0.65), accent, 29), arrow(point(-0.55, 0.5), point(0.2, 0.6), accent, 4));
  if (phase === 2) items.push(tex(String.raw`C_t(x,0)=0`, point(1.0, -0.5), accent, 29), circle(0.18, point(-1.5, 0), accent, 4));
  return field(items);
}

function scene11(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [circle(0.78, point(-2.15, 0.55), measured, 4, 0.18), rect(3.0, 1.15, point(0.55, 0.2), measured, pale, 0.3), arrow(point(-1.35, 0.55), point(-0.95, 0.3), accent, 5), tex(String.raw`V`, point(-2.15, 0.55), measured, 24)];
  if (phase > 0) items.push(arrow(point(-2.15, 1.65), point(-2.15, 1.15), accent, 5), tex(String.raw`M\delta(t)`, point(-2.15, 1.85), accent, 21), arrow(point(2.15, 0.2), point(2.85, 0.2), measured, 4));
  if (phase === 2) items.push(tex(String.raw`C_{in}`, point(-2.15, -0.7), measured, 22), tex(String.raw`V C_t|_0=Aq(C_0-C|_0)`, point(0.1, -1.25), accent, 20), arc(0.95, point(-2.15, 0.55), accent, 0.2, 4.8, 4));
  return field(items);
}

function scene12(phase, [accent, measured, pale]) {
  const profile = [[-2.7, 1.05], [-1.9, 0.7], [-1.1, 0.32], [-0.2, 0.05], [0.8, -0.2], [1.8, -0.38], [2.75, -0.48]];
  const items = [line(point(-2.8, -0.75), point(2.85, -0.75), measured, 3), line(point(-2.8, -0.75), point(-2.8, 1.4), measured, 3), ...trace(profile.slice(0, 4 + phase), accent, 4), ...profile.slice(0, 4 + phase).map((xy) => dot([...xy, 0], pale, 0.07))];
  if (phase > 0) items.push(arrow(point(1.6, 0.1), point(2.6, -0.45), measured, 3));
  if (phase === 2) items.push(line(point(2.75, -0.9), point(2.75, 1.2), accent, 4), tex(String.raw`x\to\infty`, point(2.35, -1.25), measured, 21), tex(String.raw`C\to0`, point(2.25, 0.5), accent, 25));
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const items = [rect(2.45, 2.6, point(-1.85, 0), measured, pale, 0.24), tex(String.raw`C(x,t)`, point(-1.85, 0.8), measured, 27), tex(String.raw`C_t,C_{tt}`, point(-1.85, -0.15), measured, 23), arrow(point(-0.5, 0), point(0.35, 0), accent, 5), tex(String.raw`\mathcal L_t`, point(-0.05, 0.48), accent, 28)];
  if (phase > 0) items.push(rect(2.45, 2.6, point(1.75, 0), accent, pale, 0.24), tex(String.raw`\bar C(x,s)`, point(1.75, 0.8), accent, 27), tex(String.raw`s\bar C,s^2\bar C`, point(1.75, -0.15), accent, 22));
  if (phase === 2) items.push(tex(String.raw`R(1+s\tau_J)s\bar C=(1+s\tau_C)L_x\bar C`, point(0, -1.45), accent, 20));
  return field(items);
}

function scene14(phase, [accent, measured, pale]) {
  const decay = [[-2.7, 1.15], [-2.0, 0.72], [-1.2, 0.3], [-0.3, -0.05], [0.7, -0.35], [1.8, -0.55], [2.75, -0.65]];
  const grow = [[-2.7, -0.75], [-2.0, -0.68], [-1.2, -0.52], [-0.3, -0.18], [0.7, 0.25], [1.8, 0.78], [2.75, 1.25]];
  const items = [axes(point(0, -0.2), measured, 5.8, 2.8, "[-1, 2, 0.5]"), ...trace(decay.slice(0, 4 + phase), accent, 4), tex(String.raw`c_1e^{(1-\mu)Pe/2}`, point(-1.7, 1.55), accent, 20)];
  if (phase > 0) items.push(...trace(grow.slice(0, 4 + phase), measured, 4), tex(String.raw`c_2e^{(1+\mu)Pe/2}`, point(1.65, 1.55), measured, 20));
  if (phase === 2) items.push(tex(String.raw`\bar C=c_1e^{(1-\mu)Pe/2}+c_2e^{(1+\mu)Pe/2}`, point(0, -1.55), accent, 20));
  return field(items);
}

function scene15(phase, [accent, measured, pale]) {
  const decay = [[-2.7, 1.0], [-1.8, 0.62], [-0.8, 0.15], [0.3, -0.25], [1.5, -0.52], [2.7, -0.62]];
  const grow = [[-2.7, -0.7], [-1.8, -0.55], [-0.8, -0.2], [0.3, 0.25], [1.5, 0.78], [2.7, 1.25]];
  const items = [axes(point(0, -0.2), measured, 5.8, 2.7, "[-1, 2, 0.5]"), ...trace(decay, accent, 4), ...trace(grow, measured, 3), line(point(2.75, -1.2), point(2.75, 1.4), measured, 3)];
  if (phase > 0) items.push(line(point(1.45, 0.55), point(2.75, 1.35), accent, 6), line(point(1.45, 1.35), point(2.75, 0.55), accent, 6), tex(String.raw`c_2=0`, point(1.8, -1.35), accent, 28));
  if (phase === 2) items.push(circle(0.18, point(-2.7, 1.0), accent, 4), tex(String.raw`c_1=\frac{Aq\bar C_0(s)}{Aq+sV}`, point(-0.75, 1.55), accent, 21));
  return field(items);
}

function scene16(phase, [accent, measured, pale]) {
  const items = [rect(1.65, 0.82, point(-2.0, 0.55), measured, pale, 0.28), tex(String.raw`\frac{Aq\bar C_0}{Aq+sV}`, point(-2.0, 0.55), measured, 22), arrow(point(-1.05, 0.55), point(-0.35, 0.55), accent, 4), rect(1.75, 0.82, point(0.65, 0.55), accent, pale, 0.22), tex(String.raw`e^{(1-\mu)Pe/2}`, point(0.65, 0.55), accent, 22)];
  if (phase > 0) items.push(arrow(point(1.65, 0.55), point(2.25, 0.55), accent, 4), circle(0.28, point(2.55, 0.55), accent, 4));
  if (phase === 2) items.push(rect(5.5, 0.72, point(0, -0.75), accent, pale, 0.18), tex(String.raw`\bar C=\frac{Aq\bar C_0(s)}{Aq+sV}e^{(1-\mu)Pe/2}`, point(0, -0.75), accent, 21));
  return field(items);
}

function scene17(phase, [accent, measured, pale]) {
  const btc = [[0.2, -1.0], [0.65, -0.82], [1.05, -0.25], [1.4, 0.72], [1.85, 1.05], [2.35, 0.62], [2.8, -0.25]];
  const items = [line(point(-2.8, 0), point(-0.9, 0), measured, 3), ...[-2.55, -2.15, -1.75, -1.35].map((x) => circle(0.08, point(x, 0), accent, 3)), tex(String.raw`\bar C(s)`, point(-1.85, 0.65), measured, 23)];
  if (phase > 0) items.push(rect(1.1, 1.1, point(-0.15, 0), accent, pale, 0.24), ...[-0.45, -0.15, 0.15].flatMap((x) => [-0.3, 0, 0.3].map((y) => dot(point(x, y), measured, 0.04))), arrow(point(0.5, 0), point(0.9, 0), accent, 4));
  if (phase === 2) items.push(axes(point(1.85, -0.15), measured, 2.3, 2.4), ...trace(btc, accent, 5), tex(String.raw`C(t)`, point(2.4, 1.35), accent, 23), tex(String.raw`\mathrm{CMS\!\!-\!S}`, point(-0.15, -0.85), accent, 21));
  return field(items);
}

function scene18(phase, [accent, measured, pale]) {
  const items = [rect(5.4, 0.72, point(-0.2, 0.75), measured, pale, 0.3), rect(3.0, 0.72, point(-0.8, -0.65), measured, pale, 0.22), tex(String.raw`C_m`, point(-2.45, 0.75), accent, 22), tex(String.raw`C_{im}`, point(-1.95, -0.65), measured, 22), arrow(point(-0.55, 0.42), point(-0.75, -0.28), accent, 3), arrow(point(-1.1, -0.28), point(-0.9, 0.42), measured, 3)];
  if (phase > 0) items.push(tex(String.raw`C_{im,t}=\omega(C_m-C_{im})`, point(1.45, -0.65), measured, 20), arrow(point(0.8, 0.75), point(2.2, 0.75), accent, 4));
  if (phase === 2) items.push(rect(2.0, 1.1, point(2.0, 0.65), accent, pale, 0.2), tex(String.raw`C_m\ \mathrm{only}`, point(2.0, 0.65), accent, 22), line(point(-0.2, -1.25), point(2.85, -1.25), accent, 5));
  return field(items);
}

function scene19(phase, [accent, measured, pale]) {
  const items = [rect(5.4, 0.72, point(-0.2, 0.85), measured, pale, 0.3), ...[-1.8, -0.7, 0.4, 1.5].map((x) => circle(0.28, point(x, -0.65), measured, 3, 0.12)), tex(String.raw`C`, point(-2.45, 0.85), accent, 23), tex(String.raw`S`, point(-2.45, -0.65), measured, 23), arrow(point(-0.8, 0.45), point(-0.8, -0.25), accent, 3), arrow(point(0.1, -0.25), point(0.1, 0.45), measured, 3)];
  if (phase > 0) items.push(tex(String.raw`C_t+\frac{\rho_b}{n}S_t=L_xC`, point(1.25, 1.45), accent, 20), tex(String.raw`S_t=\omega^*(k_dC-S)`, point(1.2, -1.25), measured, 20));
  if (phase === 2) items.push(rect(5.8, 0.62, point(0, 0), accent, pale, 0.2), tex(String.raw`(1+\frac{\rho_bk_d}{n}+\frac{\partial_t}{\omega^*})C_t=(1+\frac{\partial_t}{\omega^*})L_xC`, point(0, 0), accent, 18));
  return field(items);
}

function scene20(phase, [accent, measured, pale]) {
  const labels = [String.raw`\mathrm{relaxed}`, String.raw`\mathrm{MIM}`, String.raw`\mathrm{RLS}`];
  const items = labels.map((label, index) => tex(label, point(-2.05 + index * 2.05, 1.4), index === 0 ? accent : measured, 20));
  const rows = [[String.raw`R`, 0.65], [String.raw`\tau_J`, -0.05], [String.raw`\tau_C`, -0.75]];
  for (const [label, y] of rows) {
    items.push(tex(label, point(-2.05, y), accent, 23), line(point(-1.65, y), point(2.55, y), measured, 3));
    if (phase > 0) items.push(circle(0.14, point(0, y), measured, 3));
    if (phase === 2) items.push(circle(0.14, point(2.05, y), accent, 4));
  }
  if (phase === 2) items.push(tex(String.raw`\tau_C^{RLS}=1/\omega^*`, point(1.85, -1.45), accent, 20), arrow(point(-1.45, -0.75), point(-0.25, -0.75), accent, 3), arrow(point(0.25, -0.75), point(1.75, -0.75), accent, 3));
  return field(items);
}

function scene21(phase, [accent, measured, pale]) {
  const values = [[-2.2, 0.8], [-1.0, 0.3], [0.2, -0.15]];
  const items = values.map(([x, y], index) => rect(0.95, 0.58, point(x, y), measured, pale, 0.25 + index * 0.06));
  items.push(...values.map(([x, y], index) => tex([String.raw`O(P_k)`, String.raw`O(P_k-\Delta P_k)`, String.raw`O(P_k-2\Delta P_k)`][index], point(x, y), index === 0 ? accent : measured, 17)));
  if (phase > 0) items.push(...values.map(([x, y]) => arrow(point(x + 0.55, y), point(1.2, 0.15), accent, 3)), circle(0.42, point(1.65, 0.15), accent, 4));
  if (phase === 2) items.push(tex(String.raw`X_k`, point(1.65, 0.15), accent, 26), tex(String.raw`\Delta P_k=10^{-3}P_k`, point(1.35, -1.2), measured, 21), arrow(point(2.1, 0.15), point(2.8, 0.15), accent, 3));
  return field(items);
}

function scene22(phase, [accent, measured, pale]) {
  const magnitudes = [2.35, 2.0, 1.7, 1.2, 0.55, 0.38];
  const labels = [String.raw`R`, String.raw`n`, String.raw`q`, String.raw`\alpha`, String.raw`\tau_J`, String.raw`\tau_C`];
  const count = 2 + phase * 2;
  const items = [];
  magnitudes.slice(0, count).forEach((width, index) => {
    const y = 1.25 - index * 0.5;
    items.push(tex(labels[index], point(-2.65, y), index >= 4 ? accent : measured, 20), rect(width, 0.26, point(-2.15 + width / 2, y), index >= 4 ? accent : measured, pale, 0.55));
  });
  if (phase === 2) items.push(rect(1.2, 1.0, point(1.95, -1.0), accent, pale, 0.14), tex(String.raw`|X_{\tau_J}|,|X_{\tau_C}|`, point(1.95, -1.0), accent, 18));
  return field(items);
}

function btcPanel(y, colors, phase, continuous = false) {
  const [accent, measured, pale] = colors;
  const observed = continuous
    ? [[-2.75, y - 0.52], [-2.2, y - 0.35], [-1.55, y + 0.05], [-0.85, y + 0.45], [0, y + 0.58], [0.9, y + 0.5], [1.8, y + 0.32], [2.7, y + 0.2]]
    : [[-2.75, y - 0.55], [-2.15, y - 0.42], [-1.55, y + 0.05], [-1.0, y + 0.62], [-0.45, y + 0.38], [0.25, y - 0.08], [1.2, y - 0.38], [2.7, y - 0.5]];
  const present = observed.map(([x, py], index) => [x, py + [0, 0.03, -0.02, 0.04, -0.03, 0.02, 0, -0.02][index]]);
  const benchmark = observed.map(([x, py], index) => [x, py + [0, -0.05, -0.12, -0.2, -0.14, -0.09, -0.04, 0][index]]);
  const items = [line(point(-2.85, y - 0.65), point(2.85, y - 0.65), measured, 2), line(point(-2.85, y - 0.65), point(-2.85, y + 0.75), measured, 2), ...observed.map((xy) => dot([...xy, 0], pale, 0.08)), ...trace(present, accent, 4)];
  if (phase > 0) items.push(...trace(benchmark, measured, 3, true));
  if (phase === 2) items.push(circle(0.17, [...observed[3], 0], accent, 4));
  return items;
}

function scene23(phase, colors) {
  const items = [...btcPanel(0.85, colors, phase), ...btcPanel(-0.9, colors, phase)];
  if (phase > 0) items.push(tex(String.raw`x=0.35\,\mathrm m`, point(2.1, 1.48), colors[0], 18), tex(String.raw`x=0.80\,\mathrm m`, point(2.1, -0.28), colors[1], 18));
  if (phase === 2) items.push(tex(String.raw`\mathrm{present}`, point(-1.5, -1.65), colors[0], 18), tex(String.raw`\mathrm{Sauty}`, point(1.4, -1.65), colors[1], 18));
  return field(items);
}

function comparisonRows(rows, footer, phase, [accent, measured, pale]) {
  const items = [];
  rows.slice(0, 1 + phase).forEach((row, index) => {
    const y = 1.05 - index * 1.1;
    items.push(tex(row.label, point(-2.4, y), index === 0 ? accent : measured, 20), rect(3.9, 0.62, point(0.55, y), measured, pale, 0.2), tex(row.values, point(0.55, y), accent, 19));
  });
  if (phase === 2) items.push(arrow(point(-0.3, -1.25), point(1.4, -1.25), accent, 4), tex(footer, point(0.55, -1.55), accent, 18));
  return field(items);
}

function scene24(phase, colors) {
  return comparisonRows([
    { label: String.raw`0.35\,\mathrm m`, values: String.raw`SEE:0.140<0.248\quad ME:0.048<0.112` },
    { label: String.raw`0.80\,\mathrm m`, values: String.raw`SEE:0.027<0.073\quad ME:0.030<0.058` },
  ], String.raw`\mathrm{present}<\mathrm{Sauty}`, phase, colors);
}

function ratioScene(phase, colors, values, labels, above) {
  const [accent, measured, pale] = colors;
  const scale = (value) => -2.6 + value * 3.1;
  const items = [line(point(-2.7, -0.35), point(2.75, -0.35), measured, 4), line(point(scale(1), -0.65), point(scale(1), 0.95), accent, 5), tex(String.raw`1`, point(scale(1), -0.85), accent, 22), tex(String.raw`\theta=\tau_C/\tau_J`, point(0, 1.45), accent, 24)];
  values.slice(0, phase + 1).forEach((value, index) => {
    const x = scale(value);
    const y = above ? 0.25 + index * 0.38 : 0.25 + index * 0.38;
    items.push(dot(point(x, y), index ? measured : accent, 0.13), line(point(x, -0.35), point(x, y), index ? measured : accent, 3), tex(labels[index], point(x, y + 0.42), index ? measured : accent, 18));
  });
  if (phase === 2) items.push(arrow(point(scale(1), -1.25), point(above ? 2.5 : -2.4, -1.25), accent, 4));
  return field(items);
}

function scene26(phase, colors) {
  const items = [...btcPanel(0.85, colors, phase, true), ...btcPanel(-0.9, colors, phase, true), tex(String.raw`Cs`, point(2.4, 1.48), colors[0], 20), tex(String.raw`HTO`, point(2.35, -0.28), colors[1], 20)];
  if (phase === 2) items.push(tex(String.raw`\mathrm{present}`, point(-1.5, -1.65), colors[0], 18), tex(String.raw`\mathrm{Ogata\!\!-\!Banks}`, point(1.4, -1.65), colors[1], 17));
  return field(items);
}

function scene27(phase, colors) {
  return comparisonRows([
    { label: String.raw`Cs`, values: String.raw`SEE:0.031/0.038\quad ME:-0.007/-0.006` },
    { label: String.raw`HTO`, values: String.raw`SEE:0.048/0.064\quad ME:-0.011/-0.012` },
  ], String.raw`\mathrm{Table\ 3\ reported\ pairs}`, phase, colors);
}

function scene29(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = [...column(colors, phase, -2.35), ...clock(point(-0.55, 1.05), String.raw`\tau_J`, accent, phase), ...clock(point(-0.55, -0.65), String.raw`\tau_C`, measured, phase)];
  const pulse = [[0.45, -0.95], [0.85, -0.7], [1.25, 0.15], [1.65, 0.85], [2.05, 0.2], [2.65, -0.7]];
  const continuous = [[0.45, -0.95], [0.9, -0.75], [1.35, -0.2], [1.8, 0.35], [2.25, 0.65], [2.7, 0.78]];
  if (phase > 0) items.push(...trace(pulse, accent, 4), ...pulse.filter((_, index) => index % 2 === 0).map((xy) => dot([...xy, 0], pale, 0.08)));
  if (phase === 2) items.push(...trace(continuous, measured, 4), tex(String.raw`\theta>1`, point(1.15, 1.35), accent, 20), tex(String.raw`\theta<1`, point(2.25, 1.35), measured, 20), line(point(0.35, -1.2), point(2.85, -1.2), measured, 2));
  return field(items);
}

const SCENE_PATTERNS = [
  /observed and conventional-ade breakthrough traces/,
  /mobile channel exchanging particles with an immobile pore/,
  /liquid-phase particles exchanging with a solid surface/,
  /flux-relaxation clock on a colliding particle packet/,
  /storage-relaxation clock on retained particles/,
  /flux arrow and concentration-slope marker sliding onto different time ticks/,
  /two shifted quantities unfolding into ordered taylor terms/,
  /higher taylor terms fading while zeroth and first derivatives remain/,
  /column mass balance receiving the two colored first-derivative terms/,
  /uncontaminated column with both initial concentration states at zero/,
  /finite mixing reservoir feeding the column inlet/,
  /concentration profile fading to zero at the distant column boundary/,
  /time-domain pde and conditions folding into laplace-domain expressions/,
  /two exponential branches extending along the transformed column/,
  /two coefficient markers with the far-field branch removed/,
  /surviving coefficient merging with the decaying exponential solution/,
  /laplace-domain concentration unfolding into a breakthrough curve/,
  /two mim concentration lanes collapsing into one mobile-concentration equation/,
  /liquid and solid rls lanes collapsing into one liquid-concentration equation/,
  /three equation lanes with like coefficients color-aligned/,
  /three neighboring model outputs forming one normalized sensitivity value/,
  /sensitivity curves ordered by absolute magnitude/,
  /pulse observations with relaxed and sauty fitted curves/,
  /see and me markers attached to each pulse fitted curve/,
  /two pulse ratio markers above one/,
  /continuous-injection observations with relaxed and ogata-banks fitted curves/,
  /table 3 see and me markers attached to each continuous fitted curve/,
  /cs and hto ratio markers below one/,
  /soil column with fitted pulse and continuous breakthrough curves/,
];

function renderScene(scene, phase, colors) {
  const renderers = [scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08, scene09, scene10, scene11, scene12, scene13, scene14, scene15, scene16, scene17, scene18, scene19, scene20, scene21, scene22, scene23, scene24];
  if (scene < renderers.length) return renderers[scene](phase, colors);
  if (scene === 24) return ratioScene(phase, colors, [1.5, 1.67], [String.raw`1.50`, String.raw`1.67`], true);
  if (scene === 25) return scene26(phase, colors);
  if (scene === 26) return scene27(phase, colors);
  if (scene === 27) return ratioScene(phase, colors, [0.2, 0.37], [String.raw`Cs:0.20`, String.raw`HTO:0.37`], false);
  return scene29(phase, colors);
}

export function renderPaperVisual2023_04_27(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = (typeof description === "string" ? description : JSON.stringify(description ?? "")).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  if (!text.includes("[paper:2023-04-27]")) return null;
  const scene = SCENE_PATTERNS.findIndex((pattern) => pattern.test(text));
  return scene < 0 ? null : renderScene(scene, phaseOf(phase), colorsOf(palette));
}
