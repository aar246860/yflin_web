const q = (value) => JSON.stringify(value);
const line = (a, b, color, width = 3) => `Line(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width})`;
const circle = (radius, point, color, width = 3) => `Circle(radius=${radius}, color=${q(color)}, stroke_width=${width}, fill_opacity=0).shift(${q(point)})`;
const rect = (width, height, point, stroke, fill, opacity = 0.16) => `Rectangle(width=${width}, height=${height}, color=${q(stroke)}, stroke_width=3).set_fill(${q(fill)}, opacity=${opacity}).shift(${q(point)})`;
const arrow = (a, b, color, width = 4) => `Arrow(${q(a)}, ${q(b)}, color=${q(color)}, stroke_width=${width}, buff=0.04)`;
const dot = (point, color, radius = 0.09) => `Dot(${q(point)}, radius=${radius}, color=${q(color)})`;
const tex = (value, point, color, size = 28) => `MathTex(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(point)})`;
const label = (value, point, color, size = 22) => `Text(${q(value)}, color=${q(color)}, font_size=${size}).move_to(${q(point)})`;
const axes = (point, color, width = 2.8, height = 1.35) => `Axes(x_range=[0, 6, 2], y_range=[0, 3, 1], x_length=${width}, y_length=${height}, axis_config={"color": ${q(color)}}).shift(${q(point)})`;
const curve = (points, color, width = 4) => points.slice(0, -1).map((point, index) => line([...point, 0], [...points[index + 1], 0], color, width));
const field = (items) => `VGroup(${items.join(", ")}).scale(0.68).shift([-1.45, 0.15, 0])`;

function radial(center, accent, measured, radius = 1.35) {
  const [x, y] = center;
  return [
    circle(0.22, [x, y, 0], accent, 5),
    circle(0.56, [x, y, 0], accent, 4),
    circle(radius, [x, y, 0], measured, 4),
    line([x, y - 0.82, 0], [x, y + 0.82, 0], accent, 4),
  ];
}

function badge(label, point, color, pale) {
  return [rect(1.28, 0.48, point, color, pale, 0.22), tex(label, point, color, 23)];
}

function brace(x0, x1, y, label, color) {
  return [line([x0, y, 0], [x1, y, 0], color, 3), line([x0, y - 0.12, 0], [x0, y + 0.12, 0], color, 3), line([x1, y - 0.12, 0], [x1, y + 0.12, 0], color, 3), tex(label, [(x0 + x1) / 2, y + 0.2, 0], color, 22)];
}

function scene01(phase, [accent, measured, pale]) {
  const items = [...radial([-1.65, 0, 0], accent, measured), arrow([-3.05, 0, 0], [-3.0, 0, 0], accent)];
  if (phase >= 1) items.push(...radial([1.45, 0, 0], measured, accent), tex(String.raw`\Longleftrightarrow`, [-0.1, 0, 0], accent, 34), tex(String.raw`\mathrm{aquifer}`, [-1.65, -1.75, 0], measured, 22), tex(String.raw`\mathrm{hollow\ cylinder}`, [1.45, -1.75, 0], measured, 22));
  if (phase === 2) items.push(arrow([-3.05, 0.65, 0], [-2.98, 0.65, 0], accent), arrow([2.85, 0.65, 0], [2.78, 0.65, 0], accent), tex(String.raw`k_s+k_f\partial_r`, [-1.65, 1.72, 0], accent, 22), tex(String.raw`hT+k\partial_rT`, [1.45, 1.72, 0], accent, 22), rect(2.9, 3.25, [1.45, 0, 0], measured, pale, 0.05));
  return field(items);
}

function scene02(phase, [accent, measured, pale]) {
  const items = [...radial([-1.9, 0, 0], accent, measured), line([-0.55, 0.75, 0], [0.55, 1.2, 0], measured, 2), rect(1.28, 0.48, [1.35, 1.2, 0], accent, pale, 0.22), label("Robin", [1.35, 1.2, 0], accent)];
  if (phase >= 1) items.push(line([-0.55, 0, 0], [0.55, 0, 0], measured, 2), rect(1.28, 0.48, [1.35, 0, 0], measured, pale, 0.22), label("Dirichlet", [1.35, 0, 0], measured));
  if (phase === 2) items.push(line([-0.55, -0.75, 0], [0.55, -1.2, 0], measured, 2), rect(1.28, 0.48, [1.35, -1.2, 0], accent, pale, 0.22), label("no flow", [1.35, -1.2, 0], accent), label("one boundary family", [0.15, 1.95, 0], accent));
  return field(items);
}

function scene03(phase, [accent, measured, pale]) {
  const items = [...radial([-1.65, 0, 0], accent, measured, 1.5), ...brace(-1.65, -1.43, -1.75, String.raw`r_w`, accent), ...brace(-1.65, -1.09, 1.05, String.raw`r_1`, measured), ...brace(-1.65, -0.15, 1.72, String.raw`R`, measured)];
  if (phase >= 1) items.push(arrow([0.15, 0.9, 0], [0.75, 0.9, 0], accent), tex(String.raw`q=r/r_w`, [1.65, 1.15, 0], accent), tex(String.raw`q_1=r_1/r_w`, [1.65, 0.45, 0], measured), tex(String.raw`q_R=R/r_w`, [1.65, -0.25, 0], measured));
  if (phase === 2) items.push(rect(2.4, 0.72, [1.45, -1.25, 0], accent, pale, 0.2), tex(String.raw`j=T_2/T_1\quad s_D\propto s`, [1.45, -1.25, 0], accent, 25), line([-1.09, 0.45, 0], [0.25, -1.0, 0], measured, 2));
  return field(items);
}

function scene04(phase, [accent, measured, pale]) {
  const items = [...radial([-2.35, 0, 0], accent, measured, 0.85), line([-1.78, 0.4, 0], [-0.95, 0.8, 0], measured, 2), line([-1.5, -0.35, 0], [-0.95, -0.55, 0], measured, 2), tex(String.raw`\nabla_r^2s_{1D}`, [-0.05, 0.85, 0], measured, 24), tex(String.raw`\sigma_1\partial_\tau s_{1D}`, [1.05, 0.85, 0], measured, 22), tex(String.raw`\nabla_r^2s_{2D}`, [-0.05, -0.55, 0], measured, 24), tex(String.raw`\sigma_2\partial_\tau s_{2D}`, [1.05, -0.55, 0], measured, 22)];
  if (phase >= 1) items.push(arrow([1.7, 0.2, 0], [2.2, 0.2, 0], accent), tex(String.raw`\mathcal L`, [1.95, 0.55, 0], accent, 26), tex(String.raw`\bar s_i''+q^{-1}\bar s_i'`, [0.7, 1.65, 0], accent, 22), tex(String.raw`-q_{iD}^2\bar s_i=0`, [2.0, 1.65, 0], accent, 22));
  if (phase === 2) items.push(rect(2.75, 0.68, [1.35, -1.45, 0], accent, pale, 0.18), tex(String.raw`[\bar s]_1^2=0`, [0.75, -1.45, 0], accent, 22), tex(String.raw`[T\partial_q\bar s]_1^2=0`, [1.95, -1.45, 0], accent, 21), tex(String.raw`p:\ \partial_\tau\mapsto p`, [-2.35, -1.35, 0], accent, 22));
  return field(items);
}

function scene05(phase, [accent, measured, pale]) {
  const items = [...radial([-2.45, 0, 0], accent, measured, 0.78), tex(String.raw`p`, [-2.45, 1.15, 0], accent, 24)];
  if (phase >= 1) items.push(line([-1.67, 0.35, 0], [-1.05, 0.78, 0], accent, 3), rect(3.25, 0.92, [0.65, 0.82, 0], accent, pale, 0.16), tex(String.raw`\bar s_{1D}=A_1I_0+B_1K_0`, [0.65, 0.82, 0], accent, 22), tex(String.raw`\mathrm{skin}`, [-0.72, 1.42, 0], accent, 21));
  if (phase === 2) items.push(line([-1.67, -0.35, 0], [-1.05, -0.68, 0], measured, 3), rect(3.25, 0.92, [0.65, -0.75, 0], measured, pale, 0.16), tex(String.raw`\bar s_{2D}=A_2I_0+B_2K_0`, [0.65, -0.75, 0], measured, 22), tex(String.raw`\mathrm{formation}`, [-0.45, -1.38, 0], measured, 21), tex(String.raw`(A_i,B_i)\leftarrow\mathrm{Robin+interface}`, [0.45, 1.82, 0], accent, 20));
  return field(items);
}

function scene06(phase, [accent, measured, pale]) {
  const items = [line([-2.9, 0, 0], [-0.7, 0, 0], measured, 3), ...[-2.55, -2.1, -1.55, -1.0].map((x) => dot([x, 0, 0], accent)), tex(String.raw`p_n`, [-1.8, 0.45, 0], accent, 24), tex(String.raw`\mathcal L^{-1}:\ \sum_n\operatorname{Res}(p_n)`, [-1.8, -0.65, 0], measured, 23)];
  if (phase >= 1) items.push(axes([1.35, 0.85, 0], measured, 3, 1.2), ...curve([[-0.05, 1.35], [0.45, 1.12], [1.05, 0.82], [1.75, 0.55], [2.7, 0.38]], accent), tex(String.raw`s_{1D}(\tau)`, [2.55, 1.55, 0], accent, 22));
  if (phase === 2) items.push(axes([1.35, -1.0, 0], measured, 3, 1.2), ...curve([[-0.05, -0.45], [0.45, -0.52], [1.05, -0.72], [1.75, -1.05], [2.7, -1.28]], measured), tex(String.raw`s_{2D}(\tau)`, [2.55, -0.45, 0], measured, 22));
  return field(items);
}

function scene07(phase, [accent, measured, pale]) {
  const skin = [[-2.9, 1.15], [-2.25, 0.78], [-1.55, 0.55], [-0.75, 0.48], [0.2, 0.47]];
  const formation = [[-2.9, -0.15], [-2.25, -0.45], [-1.55, -0.7], [-0.75, -0.82], [0.2, -0.84]];
  const items = [axes([-1.35, 0, 0], measured, 3.7, 2.6), ...curve(skin, accent), ...curve(formation, measured), tex(String.raw`\tau`, [0.35, -1.4, 0], measured, 21)];
  if (phase >= 1) items.push(line([-0.75, 0.47, 0], [0.35, 0.47, 0], accent, 5), line([-0.75, -0.84, 0], [0.35, -0.84, 0], measured, 5), tex(String.raw`\tau\to\infty`, [-0.2, 1.45, 0], accent, 22));
  if (phase === 2) items.push(rect(2.35, 0.72, [1.75, 0.55, 0], accent, pale, 0.18), tex(String.raw`s_{1D}^{ss}=\lim_{p\to0}p\bar s_{1D}`, [1.75, 0.55, 0], accent, 21), rect(2.35, 0.72, [1.75, -0.65, 0], measured, pale, 0.18), tex(String.raw`s_{2D}^{ss}=\lim_{p\to0}p\bar s_{2D}`, [1.75, -0.65, 0], measured, 21));
  return field(items);
}

function coefficientScene(phase, palette, test) {
  const [accent, measured, pale] = palette;
  const isCht = test === "CHT";
  const items = [...radial([-2.25, 0, 0], accent, measured, 0.9), rect(3.0, 1.15, [0.65, 0.45, 0], measured, pale, 0.2), tex(String.raw`k_1s_w+k_2\partial_qs_w=k_3`, [0.65, 0.45, 0], measured, 24), tex(String.raw`\mathrm{Robin\ inner\ boundary}`, [0.65, 1.25, 0], measured, 21)];
  if (phase >= 1) items.push(rect(1.35, 0.58, [0.15, -0.75, 0], accent, pale, 0.24), tex(isCht ? String.raw`k_2=0` : String.raw`k_1=0`, [0.15, -0.75, 0], accent, 27), arrow([-1.32, 0, 0], [-0.55, -0.55, 0], accent));
  if (phase === 2) items.push(tex(isCht ? String.raw`s_w=\mathrm{const}` : String.raw`Q_w=\mathrm{const}`, [1.7, -0.75, 0], accent, 27), tex(String.raw`\mathrm{${test}}`, [-2.25, -1.3, 0], accent, 25), isCht ? line([-2.48, 0.45, 0], [-2.02, 0.45, 0], accent, 6) : arrow([-1.2, 0, 0], [-1.38, 0, 0], accent, 5));
  return field(items);
}

function scene10(phase, [accent, measured, pale]) {
  const items = [...radial([-1.35, 0, 0], accent, measured, 1.5), arrow([0.8, 0.65, 0], [0.17, 0.45, 0], measured), arrow([0.8, -0.65, 0], [0.17, -0.45, 0], measured), label("mixed outer boundary", [1.55, 1.45, 0], measured, 22)];
  if (phase >= 1) items.push(...[[0.15, 0], [-1.35, 1.5], [-2.85, 0], [-1.35, -1.5]].map(([x, y]) => dot([x, y, 0], accent, 0.12)), rect(2.0, 0.62, [1.55, 0.15, 0], accent, pale, 0.22), label("k2 zero | k5 zero", [1.55, 0.15, 0], accent, 22));
  if (phase === 2) items.push(label("head held fixed", [1.55, -0.85, 0], accent, 23), circle(1.56, [-1.35, 0, 0], accent, 6));
  return field(items);
}

function scene11(phase, [accent, measured, pale]) {
  const items = [...radial([-1.2, 0, 0], accent, measured, 1.5), arrow([0.85, 0.65, 0], [0.25, 0.45, 0], measured), arrow([0.85, -0.65, 0], [0.25, -0.45, 0], measured), tex(String.raw`q_r\to0`, [1.45, 1.25, 0], measured, 25)];
  if (phase >= 1) items.push(...[[0.3, 0, 1], [-1.2, 1.5, 0], [-2.7, 0, 1], [-1.2, -1.5, 0]].map(([x, y, vertical]) => vertical ? line([x, y - 0.22, 0], [x, y + 0.22, 0], accent, 7) : line([x - 0.22, y, 0], [x + 0.22, y, 0], accent, 7)), tex(String.raw`\mathrm{impervious}`, [1.55, 0.25, 0], accent, 24));
  if (phase === 2) items.push(rect(2.55, 0.72, [1.55, -0.85, 0], accent, pale, 0.2), tex(String.raw`\left.\partial_qs_{2D}\right|_{q_R}=0`, [1.55, -0.85, 0], accent, 25), circle(1.56, [-1.2, 0, 0], accent, 6));
  return field(items);
}

function scene12(phase, [accent, measured, pale]) {
  const items = [...[0.38, 0.72, 1.05, 1.38].map((r, index) => circle(r, [-2.0, 0, 0], index === 0 ? accent : measured, index === 0 ? 5 : 2)), ...[-0.55, 0, 0.55].map((y) => arrow([-0.55, y, 0], [-1.62, y * 0.35, 0], measured)), tex(String.raw`s_D(q,\tau)`, [-2.0, 1.7, 0], measured, 23)];
  if (phase >= 1) items.push(circle(0.34, [-2.0, 0, 0], accent, 7), tex(String.raw`Q_D`, [-0.15, 1.35, 0], accent, 25), tex(String.raw`=`, [0.35, 1.35, 0], accent, 25), tex(String.raw`-q\,\partial_qs_D|_1`, [1.35, 1.35, 0], accent, 23), arrow([-1.55, -0.95, 0], [-0.85, -1.25, 0], accent));
  if (phase === 2) items.push(axes([1.35, -0.45, 0], measured, 3, 1.7), ...curve([[0, 0.35], [0.55, 0.05], [1.15, -0.18], [1.85, -0.32], [2.75, -0.4]], accent, 5), tex(String.raw`Q_D(\tau)`, [2.45, 0.25, 0], accent, 23), rect(0.2, 2.2, [-2.0, 0, 0], accent, pale, 0.22));
  return field(items);
}

function scene13(phase, [accent, measured, pale]) {
  const labels = [String.raw`j`, String.raw`j_0`, String.raw`r`, String.raw`q_1`, String.raw`q_R`];
  const top = [[-2.7, 1.05], [-2.0, 1.28], [-1.3, 0.75], [-0.6, 1.35], [0.15, 0.9]];
  const items = [tex(String.raw`X_{i,k}=\frac{P_k}{O_i}\frac{\Delta O_i}{10^{-3}P_k}`, [-1.55, 1.65, 0], measured, 23), axes([-1.35, 0.2, 0], measured, 3.7, 1.6), ...curve(top, accent, 4)];
  if (phase >= 1) items.push(...top.map(([x, y], index) => tex(labels[index], [x, y + 0.28, 0], index % 2 ? measured : accent, 19)), tex(String.raw`Q_D`, [0.35, 0.75, 0], accent, 23), tex(String.raw`\Delta P_k=10^{-3}P_k`, [1.75, 1.65, 0], accent, 21));
  if (phase === 2) items.push(axes([2.0, -0.75, 0], measured, 2.0, 1.45), ...curve([[1.0, -0.55], [1.35, -0.2], [1.75, -0.92], [2.15, -0.35], [2.85, -1.05]], measured, 4), ...curve([[1.0, -0.9], [1.4, -0.72], [1.8, -0.3], [2.2, -0.82], [2.85, -0.45]], accent, 3), tex(String.raw`s_D`, [2.75, -0.15, 0], accent, 23), rect(2.25, 1.85, [2.0, -0.75, 0], measured, pale, 0.04));
  return field(items);
}

function scene14(phase, [accent, measured, pale]) {
  const common = [[-0.2, 0.9], [0.35, 0.58], [0.9, 0.32], [1.4, 0.14]];
  const items = [...radial([-2.35, -0.25, 0], accent, measured, 0.95), axes([1.25, -0.25, 0], measured, 3.4, 2.1), ...curve(common, accent, 5), tex(String.raw`Q_D`, [-0.05, 1.55, 0], accent, 22)];
  if (phase >= 1) items.push(...curve([[1.4, 0.14], [1.85, 0.0], [2.35, -0.08], [2.9, -0.1]], accent, 5), ...curve([[1.4, 0.14], [1.85, -0.22], [2.35, -0.72], [2.9, -1.05]], measured, 5), line([1.4, -1.35, 0], [1.4, 1.25, 0], measured, 2), tex(String.raw`\tau\approx50`, [1.4, -1.6, 0], measured, 20));
  if (phase === 2) items.push(tex(String.raw`\mathrm{Robin}`, [2.65, 0.25, 0], accent, 21), tex(String.raw`\mathrm{no\ flow}`, [2.55, -1.2, 0], measured, 21), arrow([-1.25, -0.25, 0], [-0.45, -0.25, 0], accent), tex(String.raw`\mathrm{early:\ same\quad late:\ boundary}`, [0.25, 1.8, 0], accent, 22), circle(1.0, [-2.35, -0.25, 0], accent, 6));
  return field(items);
}

export function paperVisualExpression(description, phase, palette) {
  const text = (typeof description === "string" ? description : JSON.stringify(description ?? "")).normalize("NFKC").toLowerCase();
  const p = Math.max(0, Math.min(2, Math.trunc(Number(phase) || 0)));
  if (/early same|boundary-controlled|overlapping at early|separating once/.test(text)) return scene14(p, palette);
  if (/recovered boundary limits|three outer-boundary badges/.test(text)) return scene02(p, palette);
  if (/normalized sensitivity|sensitivity curves|perturb.*parameter/.test(text)) return scene13(p, palette);
  if (/extract q.?d|wellbore rim|darcy law/.test(text)) return scene12(p, palette);
  if (/no-flow boundary|closed to radial flux|impervious no-flow/.test(text)) return scene11(p, palette);
  if (/dirichlet|fixed-head (?:outer|boundary)|specialized to a fixed-head/.test(text)) return scene10(p, palette);
  if (/crt coefficients|constant-rate inner|specialized to crt|coefficient card.*crt/.test(text)) return coefficientScene(p, palette, "CRT");
  if (/cht coefficients|constant-head inner|specialized to cht|coefficient card.*cht/.test(text)) return coefficientScene(p, palette, "CHT");
  if (/large-time|steady-state|plateaus/.test(text)) return scene07(p, palette);
  if (/invert to time|unwrap into time curves|derive time-domain/.test(text)) return scene06(p, palette);
  if (/solve both zones|solution lanes|bessel-function pieces/.test(text)) return scene05(p, palette);
  if (/move to p-space|time axis folds|transform governing/.test(text)) return scene04(p, palette);
  if (/scale the aquifer|dimensional aquifer diagram|normalize dimensional/.test(text)) return scene03(p, palette);
  return scene01(p, palette);
}
