const q = (value) => JSON.stringify(value);
const DEFAULT_PALETTE = ["#137C8B", "#5DB7C4", "#D9F0F2"];

const normalizePhase = (phase) => Math.max(0, Math.min(2, Number.isFinite(Number(phase)) ? Math.trunc(Number(phase)) : 0));
const textOf = (description) => typeof description === "object" && description !== null ? [description.visualObject, description.stepDetail, description.claim, description.output].filter(Boolean).join(" ") : String(description ?? "");
const paletteOf = (palette) => { const values = Array.isArray(palette) ? palette : DEFAULT_PALETTE; return [values[0] ?? DEFAULT_PALETTE[0], values[1] ?? DEFAULT_PALETTE[1], values[2] ?? DEFAULT_PALETTE[2]]; };

const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const arrow = (a, b, color, width = 3) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (point, color, radius = 0.08) => `Dot(${q(point)}, radius=${radius}, color=${q(color)})`;
const disk = (radius, point, stroke, fill, opacity = 0.3, width = 3) => `Circle(radius=${radius}, color=${q(stroke)}, stroke_width=${width}).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const rect = (width, height, point, stroke, fill, opacity = 0.45) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=2).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const math = (latex, point, color, size = 28) => `MathTex(${q(latex)}, color=${q(color)}, font_size=${size}).move_to(${q(point)})`;
const field = (items) => `VGroup(${items.filter(Boolean).join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;
const plot = (points, color, width = 3) => points.slice(0, -1).map((point, index) => line([...point, 0], [...points[index + 1], 0], color, width));
const axes = (point, color, xRange = "[0, 4, 1]", yRange = "[0, 3, 1]", width = 3.2, height = 2.3) => `Axes(x_range=${xRange}, y_range=${yRange}, x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}}).shift(${q(point)})`;

function brace(x1, x2, y, color, label) {
  const middle = (x1 + x2) / 2;
  return [line([x1, y, 0], [x2, y, 0], color, 3), line([x1, y - 0.14, 0], [x1, y + 0.14, 0], color, 3), line([x2, y - 0.14, 0], [x2, y + 0.14, 0], color, 3), arrow([middle, y, 0], [x1 + 0.02, y, 0], color, 2), arrow([middle, y, 0], [x2 - 0.02, y, 0], color, 2), math(label, [middle, y + 0.28, 0], color, 23)];
}

function annulusItems([accent, measured, pale], phase, labels = false) {
  const center = [-2.55, 0, 0];
  const items = [
    disk(2.05, center, measured, pale, 0.2, 2), disk(0.98, center, accent, accent, phase === 2 ? 0.28 : 0.18, 4), disk(0.56, center, accent, "#FFFFFF", 1, 4),
    line([-2.55, -0.55, 0], [-2.55, 0.55, 0], accent, 4),
    ...brace(-3.53, -3.11, 1.32, accent, String.raw`r_s`),
  ];
  if (labels) items.push(
    math(String.raw`s_w`, [-2.8, -1.14, 0], accent, 23),
    math(String.raw`s_{\mathrm{skin}}`, [-1.62, -1.14, 0], measured, 21),
  );
  return items;
}

function headContrast([accent, measured, pale], phase) {
  const items = [
    ...annulusItems([accent, measured, pale], phase, false),
    line([-0.55, -1.4, 0], [-0.55, 1.4, 0], measured, 2),
    ...plot([[-0.35, 1.0], [0.1, 0.72], [0.1, 0.35], [1.35, -0.2], [2.65, -0.56]], measured, 4),
    ...plot([[-0.35, -0.02], [0.1, -0.2], [1.35, -0.56], [2.65, -0.82]], phase === 2 ? accent : measured, 4),
    math(String.raw`\mathrm{PSF}:\ \Delta h\ne0`, [0.7, 1.2, 0], measured, 22),
    math(String.raw`\mathrm{NSF}:\ h\ \mathrm{continuous}`, [0.95, -1.2, 0], accent, 21),
  ];
  if (phase >= 1) items.push(dot([0.1, -0.2, 0], accent, 0.13), arrow([0.22, -0.9, 0], [1.25, -0.9, 0], accent, 4));
  return field(items);
}

function labeledAnnulus([accent, measured, pale], phase) {
  return field([
    ...annulusItems([accent, measured, pale], phase, true),
    arrow([-1.95, -0.82, 0], [-1.45, -0.82, 0], accent, 3),
    math(String.raw`r=r_w`, [-2.0, -1.58, 0], measured, 21),
  ]);
}

function radialDerivative([accent, measured, pale], phase) {
  const samples = phase === 0 ? [dot([-2.15, 0.2, 0], accent), dot([-1.45, 0.2, 0], measured)] : [dot([-2.15, 0.2, 0], accent), dot([-1.45, 0.2, 0], accent), line([-2.15, 0.2, 0], [-1.45, 0.2, 0], accent, 4)];
  return field([
    ...annulusItems([accent, measured, pale], phase, false),
    ...samples,
    arrow([-1.8, 0.2, 0], [-1.1, 0.2, 0], measured, 3),
    math(String.raw`q_r(r_w+r_s)\approx q_r(r_w)+r_s\frac{\partial q_r}{\partial r}`, [0.9, 0.58, 0], accent, 24),
    math(String.raw`O(r_s^2)`, [1.2, -0.35, 0], phase === 2 ? pale : measured, 22),
  ]);
}

function conductivityGradients([accent, measured, pale], phase) {
  const active = phase === 1 ? measured : accent;
  return field([
    rect(1.1, 2.25, [-2.25, 0, 0], measured, pale, 0.35),
    arrow([-3.0, 0.82, 0], [-2.35, 0.82, 0], active, 4),
    arrow([-3.0, 0, 0], [-2.35, 0, 0], measured, 4),
    arrow([-3.0, -0.82, 0], [-2.35, -0.82, 0], phase === 2 ? accent : measured, 4),
    math(String.raw`q_{r,w}=-K_w\frac{\partial s_w}{\partial r}`, [0.5, 0.85, 0], active, 23),
    math(String.raw`q_r=-K_r\frac{\partial s}{\partial r}`, [0.25, 0, 0], measured, 23),
    math(String.raw`q_{z,\mathrm{skin}}=-K_{z,\mathrm{skin}}\frac{\partial s_{\mathrm{skin}}}{\partial z}`, [0.7, -0.85, 0], accent, 20),
    math(String.raw`\text{conductivity-weighted gradients}`, [0.35, -1.45, 0], pale, 18),
  ]);
}

function balance([accent, measured, pale], phase) {
  const storage = phase === 2 ? pale : accent;
  return field([
    math(String.raw`\mathrm{Eq.\,(7)}`, [-2.75, 1.28, 0], accent, 20), math(String.raw`K_w\partial_r s_w`, [-2.0, 1.28, 0], accent, 19),
    math(String.raw`=`, [-1.45, 1.28, 0], accent, 19), math(String.raw`K_r\partial_r s`, [-0.95, 1.28, 0], measured, 19),
    math(String.raw`+`, [-0.42, 1.28, 0], accent, 19), math(String.raw`r_sK_{z,\mathrm{skin}}\partial_{zz}s_{\mathrm{skin}}`, [0.55, 1.28, 0], accent, 17),
    math(String.raw`-`, [1.55, 1.28, 0], accent, 19), math(String.raw`r_sS_{s,\mathrm{skin}}\partial_t s_{\mathrm{skin}}`, [2.35, 1.28, 0], storage, 17),
    rect(1.2, 0.52, [-2.25, -0.2, 0], accent, pale, 0.35),
    rect(1.2, 0.52, [-0.82, -0.2, 0], measured, pale, 0.35),
    rect(1.5, 0.52, [0.72, -0.2, 0], accent, pale, 0.35),
    rect(1.42, 0.52, [2.25, -0.2, 0], storage, pale, 0.35),
    math(String.raw`K_w\partial_r s_w`, [-2.25, -0.2, 0], accent, 21),
    math(String.raw`K_r\partial_r s`, [-0.82, -0.2, 0], measured, 21),
    math(String.raw`r_sK_{z,\mathrm{skin}}\partial_{zz}s_{\mathrm{skin}}`, [0.72, -0.2, 0], accent, 18),
    math(String.raw`-r_sS_{s,\mathrm{skin}}\partial_t s_{\mathrm{skin}}`, [2.25, -0.2, 0], storage, 18),
  ]);
}

function storageRemoval([accent, measured, pale], phase) {
  return field([
    math(String.raw`(7)`, [-2.75, 0.86, 0], measured, 20), math(String.raw`K_w\partial_r s_w`, [-2.25, 0.86, 0], measured, 18),
    math(String.raw`=`, [-1.72, 0.86, 0], measured, 18), math(String.raw`K_r\partial_r s`, [-1.35, 0.86, 0], measured, 18),
    math(String.raw`+`, [-0.85, 0.86, 0], measured, 18), math(String.raw`r_sK_{z,\mathrm{skin}}\partial_{zz}s_{\mathrm{skin}}`, [-0.1, 0.86, 0], measured, 16),
    math(String.raw`-`, [0.85, 0.86, 0], measured, 18), math(String.raw`r_sS_{s,\mathrm{skin}}\partial_t s_{\mathrm{skin}}`, [1.75, 0.86, 0], measured, 16),
    math(String.raw`r_sS_{s,\mathrm{skin}}\partial_t s_{\mathrm{skin}}\to0`, [-0.25, -0.1, 0], phase === 2 ? pale : accent, 22),
    arrow([0.35, 0.35, 0], [1.05, 0.35, 0], accent, 4),
    math(String.raw`(8)`, [1.55, 0.18, 0], accent, 20), math(String.raw`K_r\partial_r s`, [1.55, 0.52, 0], accent, 18),
    math(String.raw`=`, [2.05, 0.52, 0], accent, 18), math(String.raw`-r_sK_{z,\mathrm{skin}}\partial_{zz}s_{\mathrm{skin}}`, [2.65, 0.52, 0], accent, 16),
    line([1.55, 0.2, 0], [2.5, 0.2, 0], accent, 3),
    math(String.raw`\text{storage removed; gradients retained}`, [0.75, -0.72, 0], measured, 18),
  ]);
}

function joinedItems([accent, measured, pale], phase) {
  return [
    ...annulusItems([accent, measured, pale], phase, true),
    line([0, -1.32, 0], [0, 1.3, 0], measured, 2),
    ...plot([[-0.9, 0.88], [-0.35, 0.48], [0, 0.18], [0.62, -0.1], [1.5, -0.42], [2.65, -0.7]], phase === 2 ? accent : measured, 5),
    dot([0, 0.18, 0], accent, 0.14),
    arrow([-1.7, -1.04, 0], [-0.18, -1.04, 0], accent, 4),
    arrow([0.18, -1.04, 0], [0.75, -1.04, 0], measured, 4),
    math(String.raw`s_{\mathrm{skin}}=s`, [0.55, 1.2, 0], accent, 22),
    math(String.raw`r=r_w`, [1.25, 0.88, 0], measured, 20),
    math(String.raw`q_{r,w}\ne q_r`, [1.55, -1.48, 0], measured, 22),
  ];
}

function joinedDrawdown([accent, measured, pale], phase) {
  return field(joinedItems([accent, measured, pale], phase));
}

function skinFactor([accent, measured, pale], phase) {
  return field([
    ...joinedItems([accent, measured, pale], phase),
    math(String.raw`r_sK_{z,\mathrm{skin}}`, [-0.1, 0.72, 0], measured, 22),
    arrow([0.65, 0.72, 0], [1.45, 0.72, 0], accent, 4),
    math(String.raw`S_f`, [1.8, 0.72, 0], accent, 32),
    math(String.raw`S_f=r_sK_{z,\mathrm{skin}}`, [1.15, 0.25, 0], accent, 21),
  ]);
}

function comparison([accent, measured, pale], phase) {
  const left = [-1.8, 0, 0];
  const right = [1.8, 0, 0];
  return field([
    rect(2.9, 3.05, left, accent, pale, 0.28), rect(2.9, 3.05, right, measured, "#FFFFFF", 0.18),
    math(String.raw`\mathrm{NSF}\ (9)`, [-1.8, 1.25, 0], accent, 24),
    math(String.raw`K_r\partial_r s=-S_f\partial_{zz}s_{\mathrm{skin}}`, [-1.8, 0.68, 0], accent, 19),
    math(String.raw`s_{\mathrm{skin}}=s`, [-1.8, 0.14, 0], accent, 23),
    math(String.raw`\text{continuous head; flux jump}`, [-1.8, -0.48, 0], measured, 17),
    arrow([-2.65, -1.0, 0], [-1.95, -1.0, 0], accent, 4),
    arrow([-1.65, -1.0, 0], [-1.38, -1.0, 0], measured, 4),
    math(String.raw`\mathrm{PSF}\ (10)`, [1.8, 1.25, 0], measured, 24),
    math(String.raw`s_w=s-r_w\alpha\partial_r s`, [1.8, 0.68, 0], measured, 20),
    math(String.raw`\Delta s\ne0`, [1.8, 0.14, 0], measured, 23),
    math(String.raw`\text{head jump}`, [1.8, -0.48, 0], measured, 18),
    ...plot([[0.55, -0.95], [1.3, -0.52], [1.3, -0.2], [2.55, 0.18]], measured, 4),
    math(String.raw`\alpha`, [2.75, -1.22, 0], measured, 22),
    math(String.raw`S_f\ (\mathrm{negative\ skin})`, [0, -1.65, 0], phase === 2 ? accent : measured, 20),
  ]);
}

function laplaceAxis([accent, measured, pale], phase) {
  const response = [[-2.65, 1.1], [-1.8, 0.86], [-0.95, 0.55], [-0.1, 0.28], [0.75, 0.08], [1.65, -0.08]];
  return field([
    axes([-0.4, -0.2, 0], measured, "[0, 5, 1]", "[-1, 2, 1]", 4.2, 2.65),
    ...plot(response, phase === 2 ? accent : measured, 5),
    arrow([-2.25, 1.35, 0], [-0.45, 1.35, 0], accent, 4),
    line([1.65, -1.35, 0], [1.65, 1.25, 0], accent, 3),
    math(String.raw`p`, [1.88, -1.38, 0], accent, 28),
    math(String.raw`\mathcal{L}\{s(r,z,t)\}=\bar{s}(r,z,p)`, [0, 1.58, 0], accent, 22),
    math(String.raw`t\longmapsto p`, [-1.05, -1.48, 0], measured, 22),
    math(String.raw`r,z\ \mathrm{fixed}`, [0.95, -0.9, 0], pale, 19),
  ]);
}

function fourierModes([accent, measured, pale], phase) {
  const modeCount = 2 + phase * 2;
  const modes = [];
  for (let mode = 1; mode <= modeCount; mode += 1) {
    const points = Array.from({ length: 7 }, (_, index) => [-2.75 + index * 0.9, 0.45 * Math.sin(mode * index * 0.78) + 0.1 * mode]);
    modes.push(...plot(points, mode === modeCount ? accent : measured, mode === modeCount ? 5 : 2));
  }
  return field([
    axes([0, -0.25, 0], measured, "[0, 6, 2]", "[-1.5, 1.8, 0.5]", 5.5, 2.5),
    ...modes,
    math(String.raw`\bar{s}(r,z,p)=\sum_nA_n(r,p)\cos(\xi_nz)`, [0, 1.52, 0], accent, 22),
    math(String.raw`n=1,2,\ldots,N`, [-1.95, -1.42, 0], measured, 20),
    math(String.raw`\xi_n`, [2.5, -1.42, 0], accent, 22),
    arrow([2.55, 0.55, 0], [2.8, 0.95, 0], phase === 2 ? accent : measured, 3),
  ]);
}

function drawdownField([accent, measured, pale], phase) {
  const items = [
    line([-3.0, -1.35, 0], [2.75, -1.35, 0], measured, 2),
    line([-3.0, -1.35, 0], [-3.0, 1.45, 0], measured, 2),
    line([2.75, -1.35, 0], [2.75, 0.1, 0], accent, 2),
  ];
  for (let row = 0; row < 4; row += 1) for (let column = 0; column < 7; column += 1) {
    const level = (row + column + phase) % 3;
    items.push(rect(0.68, 0.5, [-2.58 + column * 0.78, 0.98 - row * 0.58, 0], measured, [pale, measured, accent][level], 0.58));
  }
  items.push(
    ...plot([[-2.65, -0.9], [-1.7, -0.45], [-0.8, 0.02], [0.15, 0.62], [1.1, 0.4], [2.35, 0.88]], accent, 4),
    math(String.raw`s(r,z,t)`, [-1.75, 1.62, 0], accent, 27),
    math(String.raw`r`, [2.95, -1.38, 0], measured, 24),
    math(String.raw`z`, [-3.18, 1.45, 0], measured, 24),
    math(String.raw`t`, [2.95, 0.18, 0], accent, 24),
    arrow([1.8, -1.8, 0], [2.75, -1.8, 0], accent, 4),
    math(String.raw`\text{time-space drawdown field}`, [0.25, -1.72, 0], pale, 18),
  );
  return field(items);
}

function dimPanel([accent, measured, pale], phase) {
  const curveSets = [
    [[-2.7, -0.9], [-2.1, -0.35], [-1.4, 0.1], [-0.55, 0.42], [0.35, 0.72]],
    [[-2.7, -0.72], [-2.1, -0.48], [-1.4, -0.2], [-0.55, 0.08], [0.35, 0.22]],
    [[-2.7, -0.45], [-2.1, -0.2], [-1.4, 0.42], [-0.55, 0.2], [0.35, 0.48]],
    [[-2.7, -0.25], [-2.1, 0.02], [-1.4, 0.1], [-0.55, 0.55], [0.35, 0.85]],
  ];
  const rightSets = curveSets.map((points, index) => points.map(([x, y]) => [x + 3.55, y + (index === 3 ? -0.3 : 0.05)]));
  return field([
    axes([-1.45, -0.18, 0], measured, "[0, 5, 1]", "[-1, 1.5, 0.5]", 2.8, 2.35), axes([2.1, -0.18, 0], measured, "[0, 5, 1]", "[-1, 1.5, 0.5]", 2.8, 2.35),
    ...curveSets.flatMap((points, index) => plot(points, index === phase ? accent : measured, index === phase ? 4 : 2)),
    ...rightSets.flatMap((points, index) => plot(points, index === (phase + 1) % 4 ? accent : measured, index === (phase + 1) % 4 ? 4 : 2)),
    math(String.raw`\mathrm{PSF}`, [-1.45, 1.45, 0], accent, 23),
    math(String.raw`\mathrm{NSF}`, [2.1, 1.45, 0], accent, 23),
    math(String.raw`DIM_k`, [0.25, 1.62, 0], measured, 25),
    math(String.raw`C_D\quad\kappa\quad l_D\quad\alpha`, [-1.2, -1.58, 0], measured, 18),
    math(String.raw`C_D\quad\kappa\quad l_D\quad\beta`, [2.35, -1.58, 0], accent, 18),
    line([-2.55, 0.25, 0], [3.2, 0.25, 0], pale, 2),
    dot([-0.55, 0.42, 0], accent, 0.12),
    dot([2.55, 0.75, 0], accent, 0.12),
  ]);
}

function finalAnnulus([accent, measured, pale], phase) {
  return field([
    ...joinedItems([accent, measured, pale], phase),
    math(String.raw`\mathrm{NSF}:\ \text{continuous head}`, [-0.2, 1.62, 0], accent, 22),
    math(String.raw`q_{r,w}\ne q_r`, [1.5, -1.48, 0], accent, 23),
    math(String.raw`\text{corrected high-permeability condition}`, [0.2, -1.82, 0], measured, 18),
  ]);
}

export function paperVisualExpression(description, phase = 0, palette = DEFAULT_PALETTE) {
  const text = textOf(description).normalize("NFKC").toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ").trim();
  const normalizedPhase = normalizePhase(phase);
  const colors = paletteOf(palette);
  if (/fold back|original pumping well|corrected nsf|final annulus|return|conclusion|continuous-head with unequal/.test(text)) return finalAnnulus(colors, normalizedPhase);
  if (/dim|differential importance|sensitivity panel|parameter-specific|dim curve|c_d|kappa|l_d|alpha|beta/.test(text)) return dimPanel(colors, normalizedPhase);
  if (/r-z-t|r,?\s*z,?\s*t|time-space drawdown|drawdown field|finite inverse fourier|physical response/.test(text)) return drawdownField(colors, normalizedPhase);
  if (/fourier|mode|series|stehfest|joint-domain|equation \(11\)|equation 11/.test(text)) return fourierModes(colors, normalizedPhase);
  if (/laplace|p-axis|laplace-parameter|transform.*time/.test(text)) return laplaceAxis(colors, normalizedPhase);
  if (/equation \(9\)|equation 9|equation \(10\)|equation 10|eq\.?\s*9|eq\.?\s*10|nsf.*psf|psf.*nsf|positive-skin|positive skin|drawdown jump|comparison/.test(text)) return comparison(colors, normalizedPhase);
  if (/s f|negative skin factor|contracts into|contraction|coefficient.*factor|assign the negative/.test(text)) return skinFactor(colors, normalizedPhase);
  if (/joined drawdown|traces join|continuous drawdown|flux arrows remain unequal|unequal arrows|flux jump/.test(text)) return joinedDrawdown(colors, normalizedPhase);
  if (/three-term|three term|equation 7 balance|darcy-gradient terms settle|continuity balance|combine flux|skin control strip|radial flux.*vertical flux.*storage/.test(text)) return balance(colors, normalizedPhase);
  if (/negligible skin storage|storage removal|remove negligible|storage term fades|storage.*removed|equation 7 with.*storage|remove.*storage/.test(text)) return storageRemoval(colors, normalizedPhase);
  if (/conductivity-weighted|darcy flux|darcy gradient|equation \(6|equation 6|head-gradient flux/.test(text)) return conductivityGradients(colors, normalizedPhase);
  if (/r s derivative|first-order|taylor|flux samples|radial difference|derivative/.test(text)) return radialDerivative(colors, normalizedPhase);
  if (/s w|s skin|regional drawdowns|drawdown variables|wellbore and skin sides/.test(text)) return labeledAnnulus(colors, normalizedPhase);
  if (/head traces|head jump|continuous profile|high-permeability.*continuous/.test(text)) return headContrast(colors, normalizedPhase);
  if (/skin annulus|annular skin|pumping well|wellbore|skin zone|annulus/.test(text)) return field(annulusItems(colors, normalizedPhase, false));
  return null;
}
