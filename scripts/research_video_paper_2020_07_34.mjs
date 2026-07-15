const PAPER_MARKER = "[paper:2020-07-34]";
const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];
const VOC_COLORS = ["#E06C3B", "#3C9D72", "#3D78C5", "#4F5D68", "#C84B4B"];

const q = (value) => JSON.stringify(value);
const point = ([x, y]) => q([x, y, 0]);
const line = (a, b, color, width = 3) => `Line(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 4) => `Arrow(${point(a)}, ${point(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (xy, color, radius = 0.07) => `Dot(${point(xy)}, color=${q(color)}, radius=${radius})`;
const circle = (radius, xy, stroke, width = 3, fill = "#FFFFFF", opacity = 0) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const rect = (width, height, xy, stroke, fill, opacity = 0.2, strokeWidth = 3) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=${strokeWidth}).set_fill(${q(fill)}, opacity=${opacity}).shift(${point(xy)})`;
const math = (latex, xy, color, size = 22) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const label = (value, xy, color, size = 17) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${point(xy)})`;
const axes = (xy, color, width = 4.8, height = 2.8, xRange = "[0, 1, 0.25]", yRange = "[0, 1.5, 0.5]") => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}, "include_ticks": True, "font_size": 16, "stroke_width": 2}).shift(${point(xy)})`;
const trace = (points, color, width = 3) => points.slice(0, -1).map((xy, index) => line(xy, points[index + 1], color, width));
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

const phaseOf = (value) => Math.max(0, Math.min(2, Math.trunc(Number(value) || 0)));
const paletteOf = (value) => {
  const source = Array.isArray(value) ? value : DEFAULT_PALETTE;
  return DEFAULT_PALETTE.map((fallback, index) => String(source[index] ?? fallback));
};

function textOf(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return String(value ?? "");
  return [
    value.marker, value.owner, value.id, value.title, value.minimalText,
    value.visualObject, value.visibleEvidence, value.stepDetail,
    value.operation, value.output, value.claim, value.description,
  ].filter((part) => typeof part === "string").join(" ");
}

function unpackContext(context, phase, palette) {
  const structured = context && typeof context === "object" && !Array.isArray(context);
  const description = structured && context.description !== undefined ? context.description : context;
  const combined = structured ? `${textOf(context)} ${textOf(description)}` : textOf(description);
  const explicitScene = structured ? context.scene ?? context.sceneNumber : undefined;
  return {
    text: combined.normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim(),
    scene: Number.isInteger(Number(explicitScene)) ? Number(explicitScene) : null,
    owner: structured ? String(context.owner ?? context.id ?? "").toLowerCase() : "",
    phase: phaseOf(structured && context.phase !== undefined ? context.phase : phase),
    colors: paletteOf(structured && context.palette !== undefined ? context.palette : palette),
  };
}

function linerBase([accent, measured, pale], phase, unsaturated = false) {
  const items = [
    rect(5.5, 0.85, [0, 1.15], measured, pale, 0.46),
    rect(5.5, 0.2, [0, 0.58], accent, accent, 0.72, 2),
    rect(5.5, 2.15, [0, -0.62], measured, pale, unsaturated ? 0.16 : 0.28),
    label("leachate", [-2.15, 1.15], measured, 16),
    label("GM", [-2.45, 0.58], accent, 15),
    label(unsaturated ? "unsaturated soil" : "natural soil liner", [-1.75, -0.72], measured, 16),
  ];
  const particles = [[-1.75, 1.22], [-0.8, 1.06], [0.25, 1.25], [1.25, 1.05], [2.05, 1.24]];
  items.push(...particles.slice(0, 2 + phase).map((xy) => dot(xy, accent, 0.075)));
  if (phase >= 1) items.push(...particles.slice(0, 2 + phase).map(([x]) => arrow([x, 0.92], [x, 0.68 - 0.28 * phase], accent, 3)));
  if (phase === 2) items.push(...particles.slice(0, 4).map(([x], index) => dot([x, 0.18 - 0.32 * (index % 2)], accent, 0.07)), math(String.raw`z\downarrow`, [2.85, -0.72], measured, 20));
  return items;
}

// B01-B04: paper motivation and the two evaluation burdens in Appendix A.
function scene01(phase, colors) {
  const items = linerBase(colors, phase, false);
  if (phase === 2) items.push(math(String.raw`C_0\ [\mathrm{kg\,m^{-3}}]`, [1.85, 1.55], colors[0], 18));
  return field(items);
}

function scene02(phase, colors) {
  const [accent, measured, pale] = colors;
  const items = linerBase(colors, phase, true);
  const pores = [[-2.25, -0.25], [-1.35, -0.9], [-0.35, -0.35], [0.65, -1.0], [1.6, -0.45], [2.35, -1.08]];
  if (phase >= 1) items.push(...pores.slice(0, phase === 1 ? 3 : 6).map((xy) => circle(0.2, xy, measured, 2, "#FFFFFF", 0.92)));
  if (phase === 2) items.push(math(String.raw`0<\theta(z)<\theta_s`, [1.45, -1.48], accent, 21), rect(2.4, 0.44, [1.35, -1.48], accent, pale, 0.16, 2));
  return field(items);
}

function scene03(phase, [accent, measured, pale]) {
  const items = [rect(5.9, 2.9, [0, -0.05], measured, pale, 0.08)];
  if (phase === 0) items.push(math(String.raw`C_u=C_0\!\left(RA+\sum_{m=1}^{\infty}RB_m\right)`, [0, 0.75], accent, 26));
  if (phase >= 1) items.push(math(String.raw`C_u=C_0\!\left(RA+\sum_{m=1}^{\infty}RB_m+\sum_{n=1}^{\infty}RC_n\right)`, [0, 0.85], accent, 24), ...Array.from({ length: phase === 1 ? 6 : 10 }, (_, index) => line([-2.45 + index * 0.5, 0.15], [-2.22 + index * 0.5, 0.15], index % 2 ? measured : accent, 4)));
  if (phase === 2) items.push(math(String.raw`N=112\ (t=1\ \mathrm{day}),\quad N=11\ (t=1\ \mathrm{year})`, [0, -0.72], measured, 20), label("terms for six-decimal accuracy", [0, -1.22], measured, 15));
  return field(items);
}

function scene04(phase, [accent, measured, pale]) {
  const lobes = [
    [[-2.7, 0.85], [-2.35, 0.18], [-2.05, -0.35], [-1.78, -1.15]],
    [[-1.62, 1.25], [-1.3, 0.3], [-1.03, -0.2], [-0.78, -1.15]],
    [[-0.62, 1.25], [-0.3, 0.25], [0.0, -0.3], [0.25, -1.15]],
    [[0.42, 1.25], [0.72, 0.22], [1.0, -0.25], [1.26, -1.15]],
    [[1.42, 1.25], [1.75, 0.2], [2.05, -0.28], [2.35, -0.9]],
  ];
  const count = phase === 0 ? 2 : phase === 1 ? 4 : 5;
  const roots = [[-2.24, 0], [-1.2, 0], [-0.18, 0], [0.84, 0], [1.88, 0]];
  const items = [line([-2.9, 0], [2.85, 0], measured, 2), line([-2.8, -1.25], [-2.8, 1.35], measured, 2), ...lobes.slice(0, count).flatMap((points) => trace(points, accent, 3)), math(String.raw`f(\mu_m)=0`, [1.95, 1.48], accent, 23)];
  if (phase >= 1) items.push(...roots.slice(0, count).map((xy, index) => dot(xy, measured, 0.09)), ...roots.slice(0, count).map(([x], index) => math(String.raw`\mu_${index + 1}`, [x, -0.32], measured, 15)));
  if (phase === 2) items.push(math(String.raw`m=1,2,\ldots\quad \Delta\mu\approx2`, [0.65, -1.42], measured, 19), arrow([2.45, -0.55], [2.45, 0.78], accent, 3), math(String.raw`RB_m`, [2.55, 1.1], accent, 19));
  return field(items);
}

// M01-M05: exact transport, interface, moisture, sorption, and erfc relations.
function scene05(phase, [accent, measured, pale]) {
  const items = [rect(5.8, 0.62, [0, 0.98], accent, pale, 0.3), label("geomembrane", [-2.1, 0.98], measured, 15), math(String.raw`R_g\frac{\partial C_g}{\partial t}=D_g\frac{\partial^2C_g}{\partial z^2},\ -L_g<z<0`, [0.55, 0.98], accent, 20)];
  if (phase >= 1) items.push(rect(5.8, 1.45, [0, -0.35], measured, pale, 0.18), label("unsaturated soil", [-2.0, -0.72], measured, 15), math(String.raw`\frac{\partial(R_u\theta C_u)}{\partial t}=\frac{\partial}{\partial z}\!\left(D_u^*\frac{\partial C_u}{\partial z}\right)`, [0.65, -0.25], measured, 21), math(String.raw`D_u^*=D_u\theta,\quad0<z<L_u`, [0.55, -0.78], measured, 18));
  if (phase === 2) items.push(...[-1.6, -0.55, 0.55, 1.65].map((x) => arrow([x, 0.58], [x, 0.1], accent, 3)), math(String.raw`C\ [\mathrm{kg\,m^{-3}}],\quad D\ [\mathrm{m^2\,s^{-1}}]`, [0.3, -1.45], accent, 18));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const items = [rect(5.2, 0.72, [0, 0.88], accent, pale, 0.32), line([-2.6, 0.42], [2.6, 0.42], measured, 3), math(String.raw`C_0`, [-1.9, 1.3], accent, 22), math(String.raw`S_gC_u`, [1.65, 0.7], measured, 20)];
  if (phase === 0) items.push(math(String.raw`J=D_g\frac{\partial C_g}{\partial z}\quad[\mathrm{kg\,m^{-2}\,s^{-1}}]`, [0, -0.25], accent, 21));
  if (phase >= 1) items.push(arrow([0, 1.22], [0, 0.08], accent, 4), math(String.raw`D_g\frac{\partial C_g}{\partial z}\simeq D_g\frac{C_g(0)-C_g(-L_g)}{L_g}`, [0, -0.35], measured, 19));
  if (phase === 2) items.push(math(String.raw`D_u\theta\frac{\partial C_u}{\partial z}=D_g\frac{S_gC_u-S_gC_0}{L_g},\quad z=0`, [0, -1.15], accent, 20), ...[-1.4, 0, 1.4].map((x) => dot([x, 0.42], accent, 0.08)));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const levels = Array.from({ length: 8 }, (_, index) => ({ y: 1.1 - index * 0.31, width: 0.7 + index * 0.34 }));
  const count = phase === 0 ? 3 : phase === 1 ? 6 : 8;
  const items = [line([-2.25, 1.3], [-2.25, -1.25], measured, 2), line([-2.25, -1.25], [0.75, -1.25], measured, 2), ...levels.slice(0, count).map(({ y, width }) => rect(width, 0.22, [-2.25 + width / 2, y], measured, pale, 0.22 + 0.045 * count, 1)), math(String.raw`z\ [\mathrm{m}]`, [-2.65, 0], measured, 18), math(String.raw`\theta\ [-]`, [-0.62, -1.5], measured, 18)];
  if (phase >= 1) items.push(math(String.raw`\theta=\theta_r+(\theta_s-\theta_r)e^{\beta\psi}`, [1.55, 0.72], measured, 20), math(String.raw`\psi=z-L_u`, [1.55, 0.2], measured, 19));
  if (phase === 2) items.push(math(String.raw`\theta(z)=\theta_s e^{\beta(z-L_u)}`, [1.55, -0.42], accent, 23), math(String.raw`\beta\ [\mathrm{m^{-1}}]`, [1.55, -1.02], measured, 18));
  return field(items);
}

function scene08(phase, [accent, measured, pale]) {
  const grains = [[-2.35, 0.95], [-1.55, 0.45], [-2.15, -0.25], [-1.25, -0.8], [-0.35, 0.75], [0.15, -0.15]];
  const items = [rect(3.4, 2.9, [-1.2, 0], measured, pale, 0.16), ...grains.map((xy) => circle(0.24, xy, measured, 2, pale, 0.4)), ...grains.slice(0, 2 + phase).map(([x, y]) => dot([x + 0.17, y + 0.12], accent, 0.075))];
  if (phase >= 1) items.push(math(String.raw`R_u=1+\frac{\rho\kappa}{\theta}`, [1.55, 0.7], accent, 25), math(String.raw`\rho\ [\mathrm{kg\,m^{-3}}],\quad\kappa\ [\mathrm{m^3\,kg^{-1}}]`, [1.55, 0.12], measured, 17));
  if (phase === 2) items.push(math(String.raw`R_u\simeq1+\frac{\rho\kappa}{\theta_s}=1.285\quad[-]`, [1.45, -0.62], accent, 21), arrow([-0.55, 0.95], [0.75, 0.95], measured, 3), label("mobile fraction slows", [1.55, -1.2], measured, 15));
  return field(items);
}

function scene09(phase, [accent, measured, pale]) {
  const early = [[-2.35, 1.15], [-1.75, 0.9], [-2.02, 0.55], [-2.25, 0.05], [-2.42, -0.6], [-2.5, -1.15]];
  const middle = [[0.15, 1.15], [-0.15, 0.9], [-0.65, 0.48], [-1.22, -0.05], [-1.8, -0.62], [-2.28, -1.15]];
  const late = [[0.25, 1.15], [0.08, 0.88], [-0.22, 0.48], [-0.65, -0.05], [-1.2, -0.62], [-1.82, -1.15]];
  const items = [axes([-1.1, 0], measured, 3.25, 2.55), math(String.raw`C_u/C_0\ [-]`, [-1.1, 1.55], measured, 18), math(String.raw`z\ [\mathrm{m}]`, [-2.95, 0], measured, 18), ...trace(early, accent, 4)];
  if (phase >= 1) items.push(math(String.raw`\operatorname{erfc}(x)=\frac{2}{\sqrt{\pi}}\int_x^{\infty}e^{-u^2}\,du`, [1.75, 0.75], accent, 20), math(String.raw`\phi_a=\frac{z\sqrt{R_u}}{2\sqrt{D_ut}}`, [1.75, 0.15], measured, 21), ...trace(middle, measured, 3));
  if (phase === 2) items.push(...trace(late, accent, 5), label("1 y", [-2.38, -0.92], accent, 14), label("5 y", [-1.7, -0.9], measured, 14), label("10 y", [-1.08, -0.52], accent, 14), math(String.raw`t=1,5,10\ \mathrm{years}`, [1.75, -0.6], measured, 18));
  return field(items);
}

// M06-M10: transient finite differences and the three reported profile comparisons.
function scene10(phase, [accent, measured, pale]) {
  const nodes = Array.from({ length: 9 }, (_, index) => [-1.95, 1.15 - index * 0.3]);
  const items = [rect(1.35, 2.8, [-1.95, 0], measured, pale, 0.16), line(nodes[0], nodes.at(-1), measured, 3), ...nodes.slice(0, 4 + phase * 2).map((xy) => dot(xy, accent, 0.07)), math(String.raw`z_i=i\Delta z`, [-1.95, -1.55], measured, 17)];
  if (phase >= 1) items.push(...nodes.slice(0, 4 + phase * 2).map(([x, y], index) => arrow([x + 0.15, y], [x + 0.75, y + 0.08 * Math.sin(index)], measured, 2)), math(String.raw`\frac{\partial\theta}{\partial t}=\frac{\partial}{\partial z}\!\left(K_uk\frac{\partial h}{\partial z}\right)`, [1.35, 0.75], accent, 21), math(String.raw`k=e^{\beta(h+z-L_u)}`, [1.35, 0.16], measured, 20));
  if (phase === 2) items.push(math(String.raw`h=0\ (t=0),\qquad h=0\ (z=L_u)`, [1.35, -0.5], measured, 18), math(String.raw`K_u\ [\mathrm{m\,s^{-1}}]`, [1.35, -1.08], accent, 18));
  return field(items);
}

function scene11(phase, [accent, measured, pale]) {
  const nodes = Array.from({ length: 10 }, (_, index) => [-1.9, 1.2 - index * 0.27]);
  const concentrations = [0.92, 0.78, 0.62, 0.48, 0.36, 0.26, 0.18, 0.11, 0.06, 0.02];
  const count = 4 + phase * 3;
  const items = [line(nodes[0], nodes.at(-1), measured, 3), ...nodes.map((xy) => dot(xy, measured, 0.055)), ...nodes.slice(0, count).map(([x, y], index) => rect(0.2 + concentrations[index] * 1.2, 0.16, [x + 0.22 + concentrations[index] * 0.6, y], accent, pale, 0.26, 1)), math(String.raw`C^0_{u,i}=0`, [1.15, 0.82], measured, 22)];
  if (phase >= 1) items.push(arrow([-0.65, 0.05], [0.25, 0.05], accent, 4), math(String.raw`j\longrightarrow j+1`, [1.15, 0.05], accent, 23), math(String.raw`\Delta z=0.015\ \mathrm{m}`, [1.15, -0.52], measured, 19));
  if (phase === 2) items.push(math(String.raw`C^j_{u,N_z}=C^j_{u,N_z-1}`, [1.15, -1.05], measured, 20), label("explicit finite difference", [1.15, 1.35], accent, 16));
  return field(items);
}

function scene12(phase, [accent, measured, pale]) {
  const one = [[-2.45, 1.15], [-2.15, 0.75], [-2.35, 0.28], [-2.48, -0.28], [-2.52, -1.12]];
  const five = [[0.05, 1.15], [-0.32, 0.75], [-0.92, 0.28], [-1.5, -0.28], [-2.05, -1.12]];
  const ten = [[0.22, 1.15], [0.02, 0.75], [-0.35, 0.28], [-0.82, -0.28], [-1.42, -1.12]];
  const profiles = [one, five, ten];
  const items = [axes([-1.1, 0], measured, 3.2, 2.55), math(String.raw`C_u/C_{peak}`, [-1.1, 1.55], measured, 18), math(String.raw`z\ [\mathrm{m}]`, [-2.95, 0], measured, 18), ...trace(one, accent, 4)];
  if (phase >= 1) items.push(...trace(five, accent, 4), ...trace(ten, accent, 4), label("1 year", [-2.35, 0.62], accent, 14), label("5 years", [-1.35, 0.22], accent, 14), label("10 years", [-0.58, -0.3], accent, 14));
  if (phase === 2) {
    items.push(...profiles.flatMap((profile) => profile.map(([x, y], index) => dot([x + 0.025 * Math.sin(index), y], measured, 0.045))), axes([2.1, 0.05], measured, 1.25, 2.35, "[0, 10, 2]", "[0, 1.5, 0.5]"), math(String.raw`\Delta(C_u/C_{peak})\ (\times10^{-3})`, [2.05, 1.52], measured, 13), math(String.raw`|\Delta(C_u/C_{peak})|<0.008`, [1.85, -1.38], accent, 17));
  }
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const beta005 = [[0.2, 1.15], [0.02, 0.7], [-0.35, 0.15], [-0.88, -0.45], [-1.5, -1.15]];
  const beta1 = [[0.18, 1.15], [-0.08, 0.7], [-0.58, 0.15], [-1.2, -0.45], [-1.9, -1.15]];
  const beta5 = [[0.12, 1.15], [-0.35, 0.7], [-1.05, 0.15], [-1.75, -0.45], [-2.32, -1.15]];
  const families = [beta005, beta1, beta5];
  const items = [axes([-1.1, 0], measured, 3.3, 2.55, "[-7, 0, 1]", "[0, 1.5, 0.5]"), math(String.raw`C_u/C_{peak}\ [-]`, [-1.1, 1.55], measured, 17), math(String.raw`z\ [\mathrm{m}]`, [-2.95, 0], measured, 18), ...trace(beta005, accent, 4)];
  if (phase >= 1) items.push(...beta005.map(([x, y], index) => dot([x - 0.035 * (index / 4), y], measured, 0.055)), label("present", [1.35, 0.95], accent, 15), dot([1.0, 0.55], measured, 0.07), label("Chen et al. (2019)", [1.95, 0.55], measured, 14));
  if (phase === 2) items.push(...families.slice(1).flatMap((profile) => trace(profile, accent, 3)), ...families.slice(1).flatMap((profile) => profile.map(([x, y], index) => dot([x - 0.035 * (index / 4), y], measured, 0.05))), math(String.raw`\beta=0.05,\ 1,\ 5\ \mathrm{m^{-1}}`, [1.55, -0.18], accent, 19), math(String.raw`t=10\ \mathrm{years}`, [1.55, -0.72], measured, 18));
  return field(items);
}

function scene14(phase, [accent, measured, pale]) {
  const ruProfiles = [
    [[0.2, 1.15], [0.0, 0.7], [-0.35, 0.15], [-0.85, -0.45], [-1.45, -1.15]],
    [[0.15, 1.15], [-0.1, 0.7], [-0.55, 0.15], [-1.15, -0.45], [-1.82, -1.15]],
    [[0.1, 1.15], [-0.25, 0.7], [-0.78, 0.15], [-1.45, -0.45], [-2.05, -1.15]],
    [[0.05, 1.15], [-0.38, 0.7], [-0.98, 0.15], [-1.7, -0.45], [-2.25, -1.15]],
    [[0.0, 1.15], [-0.5, 0.7], [-1.16, 0.15], [-1.9, -0.45], [-2.42, -1.15]],
  ];
  const count = phase === 0 ? 1 : phase === 1 ? 3 : 5;
  const items = [axes([-1.1, 0], measured, 3.3, 2.55, "[-7, 0, 1]", "[0, 1.5, 0.5]"), math(String.raw`C_u/C_{peak}\ [-]`, [-1.1, 1.55], measured, 17), math(String.raw`z\ [\mathrm{m}]`, [-2.95, 0], measured, 18), ...ruProfiles.slice(0, count).flatMap((profile, index) => trace(profile, index === count - 1 ? accent : measured, index === count - 1 ? 5 : 2))];
  if (phase >= 1) items.push(math(String.raw`R_u=1,\ 1.25,\ 1.5`, [1.55, 0.65], measured, 19), arrow([1.0, 0.18], [2.35, 0.18], accent, 3), label("shorter migration", [1.65, -0.15], accent, 15));
  if (phase === 2) items.push(math(String.raw`R_u=1,\ 1.25,\ 1.5,\ 1.75,\ 2\quad[-]`, [1.35, 0.72], accent, 18), math(String.raw`t=10\ \mathrm{years}`, [1.55, -0.78], measured, 18));
  return field(items);
}

// M11-M12: Eqs. (29) and (30c), including the source's z and time markers.
function scene15(phase, [accent, measured, pale]) {
  const response = [[-2.45, -0.65], [-1.95, -0.25], [-1.4, 0.32], [-0.85, 0.74], [-0.3, 0.95]];
  const items = [rect(2.25, 0.62, [-1.6, 1.05], measured, pale, 0.24), math(String.raw`P_k`, [-1.95, 1.05], measured, 22), arrow([-1.25, 1.05], [-0.45, 1.05], accent, 3), math(String.raw`P_k+10^{-3}P_k`, [0.35, 1.05], accent, 20), ...trace(response.slice(0, 3 + phase), accent, 4)];
  if (phase >= 1) items.push(math(String.raw`X_k=P_k\frac{\partial C(P_k)}{\partial P_k}`, [1.25, 0.25], accent, 23), math(String.raw`\Delta P_k=10^{-3}P_k`, [1.25, -0.35], measured, 19));
  if (phase === 2) items.push(...trace(response.map(([x, y]) => [x, y - 0.42]), measured, 3), math(String.raw`X_k\ [\mathrm{kg\,m^{-3}}]`, [1.25, -0.92], measured, 18), math(String.raw`z=0.15\ \mathrm{m}`, [-1.65, -1.25], accent, 18));
  return field(items);
}

function scene16(phase, [accent, measured, pale]) {
  const names = ["S_g", "D_g", "L_g", "\\theta_s", "R_u", "D_u", "L_u", "\\beta"];
  const values = [0.92, 0.72, 0.62, 0.56, 0.42, 0.33, 0.18, 0.1];
  const count = phase === 0 ? 3 : phase === 1 ? 6 : 8;
  const items = [line([-2.8, -1.05], [2.75, -1.05], measured, 2)];
  names.slice(0, count).forEach((name, index) => {
    const x = -2.45 + index * 0.69;
    const height = values[index] * 2.0;
    items.push(rect(0.38, height, [x, -1.05 + height / 2], index === 0 ? accent : measured, pale, 0.3, 2), math(String.raw`${name}`, [x, -1.34], measured, 14));
  });
  if (phase >= 1) items.push(math(String.raw`DIM_k=\frac{|X_k|}{\sum_{j=1}^{N}|X_j|}`, [0.2, 1.5], accent, 23));
  if (phase === 2) items.push(line([-2.8, 1.12], [2.75, 1.12], pale, 2), math(String.raw`t=5.77\ \mathrm{days}`, [1.95, 0.86], accent, 17), math(String.raw`DIM_k\ [\%],\quad z=0.15\ \mathrm{m}`, [-1.1, 0.92], measured, 17));
  return field(items);
}

const VOC_NAMES = ["DCM", "MTBE", "TCE", "TOL", "CBZH"];
const VOC_POINTS = [
  [[-2.5, -1.0], [-1.8, -0.9], [-1.2, -0.5], [-0.55, 0.05], [0.15, 0.58], [0.85, 1.02]],
  [[-2.5, -1.0], [-1.8, -0.98], [-1.2, -0.83], [-0.55, -0.55], [0.15, -0.2], [0.85, 0.08]],
  [[-2.5, -1.0], [-1.8, -0.94], [-1.2, -0.38], [-0.55, 0.2], [0.15, 0.78], [0.85, 1.28]],
  [[-2.5, -1.0], [-1.8, -0.97], [-1.2, -0.62], [-0.55, -0.05], [0.15, 0.48], [0.85, 0.86]],
  [[-2.5, -1.0], [-1.8, -1.0], [-1.2, -0.78], [-0.55, -0.28], [0.15, 0.22], [0.85, 0.62]],
];

function vocAxes(measured) {
  return [axes([-0.85, 0.05], measured, 4.3, 2.65, "[0, 400, 100]", "[0, 0.025, 0.005]"), math(String.raw`t\ [\mathrm{day}]`, [-0.85, -1.55], measured, 17), math(String.raw`C\ [\mathrm{kg\,m^{-3}}]`, [-3.2, 0.05], measured, 16)];
}

function vocLegend(start, count, x = 2.05) {
  return VOC_NAMES.slice(start, start + count).flatMap((name, offset) => {
    const index = start + offset;
    const y = 1.15 - index * 0.48;
    return [line([x - 0.45, y], [x - 0.1, y], VOC_COLORS[index], 4), label(name, [x + 0.28, y], VOC_COLORS[index], 14)];
  });
}

// M13-M16 and return: the five selected 0.09 m VOC datasets, fits, and Table 1 errors.
function scene17(phase, [accent, measured, pale]) {
  const shallowA = [[-2.5, -0.9], [-1.6, -0.45], [-0.7, 0.3], [0.25, 0.78]];
  const shallowB = shallowA.map(([x, y], index) => [x, y + (index % 2 ? 0.35 : -0.25)]);
  const shallowC = shallowA.map(([x, y], index) => [x, y + (index % 2 ? -0.28 : 0.32)]);
  const items = [...vocAxes(measured), ...trace(shallowA, pale, 2), ...trace(shallowB, pale, 2), ...trace(shallowC, pale, 2), math(String.raw`z=0.06\ \mathrm{m}`, [1.9, 1.48], measured, 17)];
  if (phase >= 1) items.push(arrow([1.7, 0.9], [1.7, 0.28], accent, 3), math(String.raw`z=0.09\ \mathrm{m}`, [1.9, 0.05], accent, 19), label("Replicate 2", [1.9, -0.35], accent, 15));
  if (phase === 2) items.push(...VOC_POINTS.flatMap((points, index) => trace(points, VOC_COLORS[index], 3)), ...vocLegend(0, 5));
  return field(items);
}

function scene18(phase, [accent, measured, pale]) {
  const items = [rect(5.4, 2.85, [-0.25, 0], measured, pale, 0.08), ...vocAxes(measured)];
  const visible = phase === 0 ? 2 : phase === 1 ? 4 : 5;
  items.push(...VOC_POINTS.slice(0, visible).flatMap((points, index) => points.map((xy) => circle(0.09, xy, VOC_COLORS[index], 2, "#FFFFFF", 0.95))));
  if (phase >= 1) items.push(...VOC_POINTS.slice(0, visible).flatMap((points, index) => points.map((xy) => dot(xy, VOC_COLORS[index], 0.04))), label("WebPlotDigitizer", [1.75, -1.35], measured, 14));
  if (phase === 2) items.push(...vocLegend(0, 5), math(String.raw`C_0=0.1\ \mathrm{kg\,m^{-3}}`, [1.65, 1.5], accent, 16));
  return field(items);
}

function scene19(phase, [accent, measured, pale]) {
  const count = phase === 0 ? 2 : phase === 1 ? 3 : 5;
  const items = [...vocAxes(measured), ...VOC_POINTS.flatMap((points, index) => points.map((xy) => dot(xy, VOC_COLORS[index], 0.05)))];
  items.push(...VOC_POINTS.slice(0, count).flatMap((points, index) => trace(points.map(([x, y], pointIndex) => [x, y + 0.035 * Math.sin(pointIndex + index)]), VOC_COLORS[index], 4)));
  items.push(...vocLegend(0, count));
  if (phase >= 1) items.push(math(String.raw`R_u,\ S_g,\ D_u,\ D_g,\ \beta`, [1.8, -1.18], accent, 18));
  if (phase === 2) items.push(math(String.raw`D_u\ [10^{-10}\mathrm{m^2\,s^{-1}}],\ D_g\ [10^{-13}\mathrm{m^2\,s^{-1}}],\ \beta\ [\mathrm{m^{-1}}]`, [-0.45, 1.55], measured, 13), label("Levenberg-Marquardt fit", [1.55, -1.55], measured, 13));
  return field(items);
}

const ERROR_ROWS = [
  ["DCM", "8.89", "-0.26"],
  ["MTBE", "3.08", "4.76"],
  ["TCE", "9.79", "4.28"],
  ["TOL", "5.77", "6.18"],
  ["CBZH", "8.39", "0.02"],
];

function scene20(phase, [accent, measured, pale]) {
  const residuals = [
    [-0.04, 0.03, -0.06, 0.05, -0.02],
    [0.02, -0.03, 0.04, -0.02, 0.01],
    [-0.07, 0.06, -0.04, 0.08, -0.03],
    [0.04, -0.05, 0.03, -0.02, 0.06],
    [-0.03, 0.02, -0.04, 0.03, 0.0],
  ];
  const visible = phase === 0 ? 2 : phase === 1 ? 3 : 5;
  const items = [line([-2.85, -1.18], [0.25, -1.18], measured, 2), math(String.raw`t\ [\mathrm{day}]`, [-1.3, -1.48], measured, 15)];
  for (let row = 0; row < visible; row += 1) {
    const baseline = 0.95 - row * 0.43;
    items.push(line([-2.65, baseline], [0.15, baseline], pale, 2), label(VOC_NAMES[row], [-2.9, baseline], VOC_COLORS[row], 11));
    residuals[row].forEach((value, index) => {
      const x = -2.45 + index * 0.58;
      items.push(line([x, baseline], [x, baseline + value * 3.0], VOC_COLORS[row], 2), dot([x, baseline + value * 3.0], VOC_COLORS[row], 0.045));
    });
  }
  if (phase >= 1) {
    const rows = phase === 1 ? ERROR_ROWS.slice(0, 3) : ERROR_ROWS;
    items.push(rect(2.55, 2.85, [1.85, 0], measured, pale, 0.2), label("VOC", [1.1, 1.05], measured, 13), label("SEE", [1.85, 1.05], measured, 13), label("ME", [2.55, 1.05], measured, 13));
    rows.forEach(([name, see, me], index) => {
      const y = 0.68 - index * 0.42;
      items.push(label(name, [1.1, y], VOC_COLORS[index], 12), math(see, [1.85, y], measured, 14), math(me, [2.55, y], index === 0 ? accent : measured, 14));
    });
  }
  if (phase === 2) items.push(math(String.raw`SEE\ [10^{-4}\mathrm{kg\,m^{-3}}]`, [1.6, -1.38], measured, 13), math(String.raw`ME\ [10^{-5}\mathrm{kg\,m^{-3}}]`, [1.8, -1.68], accent, 13));
  return field(items);
}

function scene21(phase, colors) {
  const [accent, measured, pale] = colors;
  const plotted = VOC_POINTS.map((points) => points.map(([x, y]) => [x * 0.78 + 1.9, y * 0.75 - 0.1]));
  const items = [
    rect(1.75, 0.55, [-2.25, 1.0], measured, pale, 0.46),
    rect(1.75, 0.16, [-2.25, 0.62], accent, accent, 0.72, 2),
    rect(1.75, 2.25, [-2.25, -0.6], measured, pale, 0.16),
    label("leachate", [-2.25, 1.0], measured, 13),
    label("GM", [-2.25, 0.62], accent, 12),
    label("unsaturated soil", [-2.25, -1.35], measured, 12),
    ...[-2.65, -2.25, -1.85].map((x) => arrow([x, 0.88], [x, 0.28], accent, 2)),
    line([-3.0, -0.05], [-1.5, -0.05], accent, 2),
    math(String.raw`z=0.09\ \mathrm{m}`, [-2.25, -0.28], accent, 15),
  ];
  if (phase >= 1) items.push(axes([1.25, 0], measured, 3.3, 2.3, "[0, 400, 100]", "[0, 0.025, 0.005]"), math(String.raw`t\ [\mathrm{day}]`, [1.25, -1.42], measured, 15), math(String.raw`C\ [\mathrm{kg\,m^{-3}}]`, [-0.55, 0], measured, 14), ...plotted.flatMap((points, index) => points.map((xy) => dot(xy, VOC_COLORS[index], 0.04))));
  if (phase === 2) items.push(...plotted.flatMap((points, index) => trace(points, VOC_COLORS[index], 3)), ...plotted.map((points, index) => label(VOC_NAMES[index], [points.at(-1)[0] + 0.35, points.at(-1)[1]], VOC_COLORS[index], 11)), label("five fitted VOC profiles", [1.25, 1.52], measured, 13));
  return field(items);
}

const SCENES = [
  { owner: "b01", pattern: /landfill leachate above a geomembrane and soil liner|leachate crosses the liner|diffus.*through.*gm.*soil liner/, render: scene01 },
  { owner: "b02", pattern: /thin geomembrane above an unsaturated soil liner|soil is unsaturated|receiving liner/, render: scene02 },
  { owner: "b03", pattern: /two infinite concentration series|two infinite sums|series extend/, render: scene03 },
  { owner: "b04", pattern: /nonlinear function with zero-crossing root markers|root finding for every series|root-finding procedure/, render: scene04 },
  { owner: "m01", pattern: /two stacked one-dimensional diffusion domains|two diffusion domains|form transport equations|coupled concentration equations/, render: scene05 },
  { owner: "m02", pattern: /thin geomembrane collapsed into a flux-concentration interface|derive robin boundary|flux-concentration interface|\]\s*robin boundary\s*$/, render: scene06 },
  { owner: "m03", pattern: /exponential water-content shading with depth|hydrostatic moisture profile|depth-dependent water|apply hydrostatic profile/, render: scene07 },
  { owner: "m04", pattern: /contaminant particles delayed on soil solids|sorption retards migration|constant retardation|apply constant retardation/, render: scene08 },
  { owner: "m05", pattern: /closed concentration profile built from complementary error functions|direct concentration solution|erfc profile|derive concentration solution/, render: scene09 },
  { owner: "m06", pattern: /finite-difference hydraulic-head grid|transient water flow|form hydraulic equation/, render: scene10 },
  { owner: "m07", pattern: /finite-difference concentration cells beneath the robin boundary|numerical concentration grid|construct transport discretization|explicit finite-difference concentration/, render: scene11 },
  { owner: "m08", pattern: /overlaid analytical and finite-difference concentration profiles|finite-difference agreement|compare numerical agreement/, render: scene12 },
  { owner: "m09", pattern: /paired concentration profiles from the two analytical solutions|existing-solution agreement|chen et al.*solution|compare analytical agreement/, render: scene13 },
  { owner: "m10", pattern: /nested depth-concentration profiles indexed by ru|more sorption shorter migration|compare retardation profiles|increasing ru/, render: scene14 },
  { owner: "m11", pattern: /parameter perturbation linked to a normalized concentration response|normalized sensitivity|compute sensitivity coefficients/, render: scene15 },
  { owner: "m12", pattern: /sensitivity magnitudes normalized into parameter shares|differential importance|calculate differential importance|dimk/, render: scene16 },
  { owner: "m13", pattern: /replicate concentration traces at 0\.06 m and 0\.09 m|replicate 2 at 0\.09 m|select replicate 2 datasets|five voc concentration series/, render: scene17 },
  { owner: "m14", pattern: /published plot resolving into digitized concentration points|digitized observations|extract concentration data|webplotdigitizer/, render: scene18 },
  { owner: "m15", pattern: /analytical voc curves pulled toward measured concentration points|fit transport parameters|estimated ru sg du dg|levenberg-marquardt/, render: scene19 },
  { owner: "m16", pattern: /residual stems resolving into see and me labels|prediction errors|evaluate prediction errors|see and me values/, render: scene20 },
  { owner: "return", pattern: /original landfill geomembrane and unsaturated soil profile with five fitted voc concentration traces|fit the liner observations|five fitted voc.*0\.09 m|good fits/, render: scene21 },
];

function sceneFromOwner(owner) {
  const index = SCENES.findIndex((scene) => scene.owner === owner);
  return index === -1 ? null : index + 1;
}

export function renderPaperVisual2020_07_34(context, phase = 0, palette = DEFAULT_PALETTE) {
  const unpacked = unpackContext(context, phase, palette);
  if (!unpacked.text.includes(PAPER_MARKER)) return null;
  const explicitOwner = sceneFromOwner(unpacked.owner);
  const sceneNumber = explicitOwner ?? unpacked.scene;
  const renderer = sceneNumber && sceneNumber >= 1 && sceneNumber <= SCENES.length
    ? SCENES[sceneNumber - 1].render
    : SCENES.find(({ pattern }) => pattern.test(unpacked.text))?.render;
  return renderer ? renderer(unpacked.phase, unpacked.colors) : null;
}
