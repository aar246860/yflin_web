from __future__ import annotations

import re
from math import exp, sin

from manim import Arc, Arrow, Axes, Circle, Dot, DOWN, Ellipse, LEFT, Line, MathTex
from manim import Polygon, Rectangle, RIGHT, Square, Text, UP, VGroup

INK = "#102A35"
MUTED = "#6E7F86"
MEASURED = "#007A78"
MODEL = "#2E6F9E"
ACCENT = "#C45A2A"
PALE = "#DCE8E8"
COUNT_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9,
}


def count_objects(description: str, default: int = 4) -> int:
    lowered = description.lower()
    digit = re.search(r"\b([1-9])\b", lowered)
    if digit:
        return int(digit.group(1))
    return next((value for word, value in COUNT_WORDS.items() if re.search(rf"\b{word}\b", lowered)), default)


def fit_text(value: str, size: int, width: float) -> Text:
    label = Text(value, font_size=size, color=INK)
    if label.width > width:
        label.scale_to_fit_width(width)
    return label


def axes(width: float = 5.5, height: float = 3.1) -> Axes:
    return Axes(
        x_range=[0, 6, 1],
        y_range=[0, 4, 1],
        x_length=width,
        y_length=height,
        axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False},
        tips=False,
    )


def curve(description: str, color: str, mode: str, phase: float) -> VGroup:
    plot_axes = axes()
    group = VGroup(plot_axes)
    count = min(6, max(2, count_objects(description, 3)))
    if mode == "scatter":
        group.add(Line(plot_axes.c2p(0.5, 0.5), plot_axes.c2p(5.5, 3.6), color=MODEL))
        for index in range(9):
            x = 0.65 + index * 0.58
            y = 0.45 + index * 0.36 + 0.22 * sin(index * 1.4 + phase)
            group.add(Dot(plot_axes.c2p(x, y), radius=0.07, color=color))
    elif mode == "residual":
        group.add(Line(plot_axes.c2p(0, 2), plot_axes.c2p(6, 2), color=MODEL))
        for index in range(10):
            x = 0.45 + index * 0.55
            y = 2 + 0.85 * sin(index * 1.25 + phase)
            group.add(
                Line(plot_axes.c2p(x, 2), plot_axes.c2p(x, y), color=color),
                Dot(plot_axes.c2p(x, y), radius=0.055, color=color),
            )
    else:
        for index in range(count):
            center = 1.15 + index * 0.62 + phase * 0.2
            if mode == "pulse":
                function = lambda x, center=center: 0.35 + 3.0 * exp(-((x - center) ** 2) / 0.42)
            else:
                function = lambda x, index=index: 0.45 + (index + 1) * 0.38 + (2.2 - index * 0.12) * (1 - exp(-x / (1.1 + index * 0.2)))
            group.add(plot_axes.plot(function, x_range=[0.15, 5.8], color=(color if index == count - 1 else MODEL), stroke_width=3))
        if re.search(r"observ|measured|data point", description, re.IGNORECASE):
            for index in range(8):
                group.add(Dot(plot_axes.c2p(0.6 + index * 0.68, 0.9 + index * 0.29), radius=0.055, color=MEASURED))
    return group


def matrix(description: str, color: str) -> VGroup:
    cells = VGroup()
    mesh = bool(re.search(r"mesh|grid", description, re.IGNORECASE))
    palette = (PALE, "#A9CDCB", "#73AAA9", "#4A858B", "#2E6F9E")
    for row in range(4):
        for column in range(7):
            cell = Square(side_length=0.48, color=(MUTED if mesh else color), stroke_width=1.4)
            if not mesh:
                cell.set_fill(palette[(row + 2 * column) % len(palette)], opacity=0.8)
            cell.move_to(RIGHT * (column - 3) * 0.49 + DOWN * (row - 1.5) * 0.49)
            cells.add(cell)
    if mesh:
        cells.add(*[Dot(cell.get_center(), radius=0.025, color=color) for cell in cells[:28:3]])
    return cells


def island(description: str, color: str) -> VGroup:
    coast = Polygon(
        [-3.0, 0.4, 0], [-2.1, 1.5, 0], [-0.8, 1.1, 0], [0.2, 1.65, 0],
        [1.5, 1.0, 0], [2.9, 0.25, 0], [1.7, -0.2, 0], [0.4, -0.05, 0],
        [-1.0, -0.35, 0], [-2.5, -0.15, 0], color=MEASURED,
    )
    lens = Arc(radius=2.25, start_angle=3.35, angle=2.72, color=color, stroke_width=4).shift(DOWN * 0.2)
    wells = VGroup()
    count = min(9, max(2, count_objects(description, 5)))
    for index in range(count):
        x = -2.2 + index * (4.4 / max(1, count - 1))
        wells.add(Line([x, 0.6, 0], [x, -1.25, 0], color=MODEL, stroke_width=3), Dot([x, 0.6, 0], radius=0.055, color=color))
    return VGroup(coast, lens, wells)


def fault(color: str) -> VGroup:
    layers = VGroup()
    for index in range(5):
        y = 1.3 - index * 0.62
        layers.add(Line([-3.0, y, 0], [-0.35, y, 0], color=MODEL), Line([0.35, y - 0.42, 0], [3.0, y - 0.42, 0], color=MODEL))
    fault_line = Line([-0.7, -1.75, 0], [0.8, 1.75, 0], color=color, stroke_width=5)
    mesh = VGroup(*[Line([-2.8 + i * 0.55, -1.55, 0], [-2.8 + i * 0.55, 1.45, 0], color=MUTED, stroke_width=0.8) for i in range(11)])
    return VGroup(layers, mesh, fault_line)


def plume(color: str) -> VGroup:
    plume_body = VGroup(*[
        Ellipse(
            width=3.6 - index * 0.55,
            height=1.8 - index * 0.22,
            color=color,
            fill_color=color,
            fill_opacity=0.08 + index * 0.05,
        ).shift(LEFT * 1.7)
        for index in range(4)
    ])
    plot_axes = axes(3.4, 2.5).scale(0.72).shift(RIGHT * 2.4)
    btc = plot_axes.plot(lambda x: 0.25 + 3.2 / (1 + exp(-(x - 3.0))), x_range=[0.15, 5.8], color=MODEL, stroke_width=4)
    return VGroup(plume_body, plot_axes, btc)


def forest(description: str, color: str) -> VGroup:
    collection = VGroup()
    count = min(6, max(2, count_objects(description, 4)))
    for index in range(count):
        x = -2.8 + index * (5.6 / max(1, count - 1))
        collection.add(VGroup(
            Line([x, -1.3, 0], [x, 1.1, 0], color=MUTED),
            Line([x, 0.5, 0], [x - 0.34, 1.15, 0], color=color),
            Line([x, 0.1, 0], [x + 0.38, 0.78, 0], color=MODEL),
            Dot([x - 0.34, 1.15, 0], radius=0.055, color=color),
            Dot([x + 0.38, 0.78, 0], radius=0.055, color=MODEL),
        ))
    return collection


def map_field(color: str) -> VGroup:
    boundary = Rectangle(width=6.0, height=3.2, color=MUTED)
    contours = VGroup(*[
        Ellipse(width=5.1 - index * 0.7, height=2.55 - index * 0.36, color=(color if index == 2 else MODEL)).shift(RIGHT * 0.2)
        for index in range(4)
    ])
    markers = VGroup(*[Dot([-2.1 + (index % 4) * 1.35, -0.9 + (index // 4) * 1.35, 0], radius=0.07, color=color) for index in range(8)])
    return VGroup(boundary, contours, markers)


def distribution(description: str, color: str) -> VGroup:
    plot_axes = axes()
    group = VGroup(plot_axes)
    count = min(6, max(2, count_objects(description, 3)))
    for index in range(count):
        center = 1.4 + index * 0.68
        density = plot_axes.plot(
            lambda x, center=center, index=index: 0.25 + 3.2 * exp(-((x - center) ** 2) / (0.72 + index * 0.08)),
            x_range=[0.15, 5.8],
            color=(color if index == count - 1 else MODEL),
            stroke_width=2.7,
        )
        median = Line(plot_axes.c2p(center, 0.1), plot_axes.c2p(center, 2.3), color=(color if index == count - 1 else MUTED), stroke_width=1.4)
        group.add(density, median)
    return group


def equation(description: str, color: str) -> VGroup:
    lowered = description.lower()
    if "bessel" in lowered:
        formula = r"J_0(\lambda r)\;\leftrightarrow\;Y_0(\lambda r)"
    elif "laplace" in lowered:
        formula = r"\mathcal{L}\{s(t)\}=\bar{s}(p)"
    elif "root" in lowered or "series" in lowered:
        formula = r"\sum_{n=1}^{\infty} a_n\,\phi_n(r)"
    else:
        formula = r"\mathrm{input}\;\longrightarrow\;\mathrm{relation}\;\longrightarrow\;\mathrm{output}"
    expression = MathTex(formula, color=color, font_size=44)
    number = re.search(r"equation\s*(\d+)", lowered)
    if number:
        expression.add(fit_text(f"Equation {number.group(1)}", 20, 2.0).next_to(expression, UP, buff=0.35))
    return VGroup(expression)


def system(description: str, color: str) -> VGroup:
    layers = VGroup(*[
        Rectangle(
            width=6.2,
            height=0.62,
            color=MUTED,
            fill_color=("#E8F1F0" if index % 2 == 0 else "#D7E7E6"),
            fill_opacity=0.6,
        ).shift(DOWN * (index - 1.5) * 0.63)
        for index in range(4)
    ])
    well = VGroup(Rectangle(width=0.34, height=3.2, color=MODEL, fill_opacity=0.05), Line([0, 1.55, 0], [0, -1.55, 0], color=color, stroke_width=4))
    response: VGroup | Arc = Arc(radius=1.45, start_angle=3.45, angle=2.45, color=color, stroke_width=4).shift(DOWN * 0.15)
    if re.search(r"stream|recharge|rain", description, re.IGNORECASE):
        response = VGroup(response, Arrow(LEFT * 2.4 + UP * 1.8, LEFT * 2.4 + UP * 0.95, color=MEASURED, buff=0.05))
    return VGroup(layers, well, response)


def workflow(color: str) -> VGroup:
    nodes = VGroup(*[Circle(radius=0.48, color=(color if index == 2 else MODEL)).shift(RIGHT * (index - 2) * 1.45) for index in range(5)])
    arrows = VGroup(*[Arrow(nodes[index].get_right(), nodes[index + 1].get_left(), color=MUTED, buff=0.08) for index in range(4)])
    return VGroup(nodes, arrows)


def make_geometry(description: str, kind: str, phase: int) -> VGroup:
    color = (MUTED, MEASURED, ACCENT)[max(0, min(2, phase))]
    if kind in {"curve", "scatter", "residual", "pulse"}:
        return curve(description, color, kind, phase * 0.17)
    if kind == "matrix":
        return matrix(description, color)
    if kind == "island":
        return island(description, color)
    if kind == "fault":
        return fault(color)
    if kind == "plume":
        return plume(color)
    if kind == "forest":
        return forest(description, color)
    if kind == "map":
        return map_field(color)
    if kind == "distribution":
        return distribution(description, color)
    if kind == "equation":
        return equation(description, color)
    if kind == "sensitivity":
        visual = curve(description, color, "curve", phase * 0.17)
        visual.add(fit_text("PSF", 18, 0.8).shift(LEFT * 2.1 + UP * 1.25), fit_text("NSF", 18, 0.8).shift(RIGHT * 2.1 + UP * 1.25))
        return visual
    if kind == "table":
        return matrix(description, color)
    if kind == "track":
        return VGroup(Arc(radius=2.3, start_angle=3.55, angle=2.35, color=color, stroke_width=4), *[Dot([-2.0 + i, -0.9 + i * 0.42, 0], radius=0.07, color=MODEL) for i in range(5)])
    if kind == "system":
        return system(description, color)
    return workflow(color)
