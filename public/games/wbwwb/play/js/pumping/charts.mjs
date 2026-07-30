import { readCanvasPalette } from "./runtime.mjs";

const chartToken = (palette, primary, fallback) => palette[primary] ?? palette[fallback];

const readChartTheme = () => {
  const palette = readCanvasPalette();
  return Object.freeze({
    background: chartToken(palette, "paperBright", "paper"),
    border: chartToken(palette, "ink", "inkSoft"),
    grid: chartToken(palette, "line", "inkSoft"),
    text: chartToken(palette, "inkSoft", "ink"),
    title: chartToken(palette, "ink", "inkSoft"),
    series: Object.freeze([
      chartToken(palette, "teal", "ink"),
      chartToken(palette, "error", "ink"),
      chartToken(palette, "warning", "teal"),
    ]),
    accent: chartToken(palette, "error", "focusRing"),
    fontFamily: palette.fontFamily,
    typeCaption: palette.typeCaption,
    typeLabel: palette.typeLabel,
  });
};

const finitePoints = (points, xField, yField) => points
  .filter((point) => Number.isFinite(point[xField]) && Number.isFinite(point[yField]));

export function chartGeometry(
  series,
  {
    width = 520,
    height = 250,
    padding = 38,
    xField = "time",
    yField = "drawdown",
    logX = false,
  } = {},
) {
  const prepared = series.map((entry) => ({
    ...entry,
    points: finitePoints(entry.points, xField, yField),
  }));
  const points = prepared.flatMap((entry) => entry.points);
  const xValues = points.map((point) =>
    logX ? Math.log10(Math.max(point[xField], Number.MIN_VALUE)) : point[xField]);
  const yValues = points.map((point) => point[yField]);
  const xMin = Math.min(...xValues, 0);
  const xMax = Math.max(...xValues, 1);
  const yMin = Math.min(...yValues, 0);
  const yMax = Math.max(...yValues, 1);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const project = (point) => ({
    x: padding + (
      ((logX ? Math.log10(Math.max(point[xField], Number.MIN_VALUE)) : point[xField]) - xMin)
      / xSpan
    ) * (width - 2 * padding),
    y: height - padding - ((point[yField] - yMin) / ySpan) * (height - 2 * padding),
  });
  return {
    bounds: { xMin, xMax, yMin, yMax },
    series: prepared.map((entry) => ({
      ...entry,
      projected: entry.points.map(project),
    })),
  };
}

const text = (PIXI, value, style, x, y, anchorX = 0) => {
  const label = new PIXI.Text(value, style);
  label.anchor.set(anchorX, 0);
  label.position.set(x, y);
  return label;
};

export function drawScientificChart({
  PIXI,
  series,
  title,
  xLabel,
  yLabel,
  width = 560,
  height = 270,
  logX = false,
  xField = "time",
  yField = "drawdown",
}) {
  const theme = readChartTheme();
  const container = new PIXI.Container();
  const panel = new PIXI.Graphics();
  panel.beginFill(theme.background, 0.96);
  panel.lineStyle(2, theme.border, 0.9);
  panel.drawRoundedRect(0, 0, width, height, 8);
  panel.endFill();
  container.addChild(panel);

  const geometry = chartGeometry(series, {
    width,
    height,
    padding: 42,
    xField,
    yField,
    logX,
  });
  const axes = new PIXI.Graphics();
  axes.lineStyle(2, theme.grid, 0.85);
  axes.moveTo(42, 28);
  axes.lineTo(42, height - 42);
  axes.lineTo(width - 24, height - 42);
  container.addChild(axes);

  geometry.series.forEach((entry, seriesIndex) => {
    const line = new PIXI.Graphics();
    line.lineStyle(3, theme.series[seriesIndex % theme.series.length], 1);
    entry.projected.forEach((point, index) => {
      if (index === 0) line.moveTo(point.x, point.y);
      else line.lineTo(point.x, point.y);
    });
    container.addChild(line);

    entry.points.forEach((point, index) => {
      if (!point.isOutlier) return;
      const at = entry.projected[index];
      const marker = new PIXI.Graphics();
      marker.lineStyle(3, theme.accent, 1);
      marker.drawCircle(at.x, at.y, 6);
      marker.moveTo(at.x - 4, at.y - 4);
      marker.lineTo(at.x + 4, at.y + 4);
      container.addChild(marker);
    });
  });

  const titleStyle = {
    fontFamily: theme.fontFamily,
    fontSize: theme.typeLabel,
    fontWeight: "bold",
    fill: theme.title,
  };
  const axisStyle = {
    fontFamily: theme.fontFamily,
    fontSize: theme.typeCaption,
    fill: theme.text,
  };
  container.addChild(text(PIXI, title, titleStyle, 14, 8));
  container.addChild(text(PIXI, xLabel, axisStyle, width / 2, height - 27, 0.5));
  container.addChild(text(PIXI, yLabel, axisStyle, 48, 31));
  return container;
}

export function formatScientific(value, digits = 3) {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  if (Math.abs(value) < 0.01 || Math.abs(value) >= 10000) {
    return value.toExponential(digits - 1);
  }
  return value.toPrecision(digits);
}
