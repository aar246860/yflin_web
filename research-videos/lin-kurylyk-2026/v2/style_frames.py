# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
# --- How to run ---
# uv run manim -s -qh --media_dir style-media style_frames.py ContextFrame MethodFrame ResultFrame
from __future__ import annotations

import math
from typing import Final

from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Arrow,
    Axes,
    Circle,
    Dot,
    Line,
    MathTex,
    Rectangle,
    Scene,
    Text,
    VGroup,
    VMobject,
    config,
)

PAPER: Final = "#F6F8F5"
INK: Final = "#112D32"
TEAL: Final = "#087F8C"
MUTED: Final = "#566D70"
RED: Final = "#B64A35"
GOLD: Final = "#B77A1F"
WATER: Final = "#D7ECE8"

config.background_color = PAPER
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30


def label(value: str, size: int, color: str = INK) -> Text:
    return Text(value, font="Arial", font_size=size, color=color)


def sine_trace(*, x0: float, width: float, amplitude: float, phase: float, y0: float) -> VMobject:
    trace = VMobject(color=TEAL, stroke_width=5)
    points = []
    for index in range(81):
        fraction = index / 80
        x = x0 + width * fraction
        y = y0 + amplitude * math.sin(2 * math.pi * fraction + phase)
        points.append([x, y, 0])
    return trace.set_points_smoothly(points)


class ContextFrame(Scene):
    def construct(self) -> None:
        title = label("One boundary wave carries two hydraulic signatures", 38).to_edge(UP, buff=0.5)
        aquifer = Rectangle(width=11.7, height=2.8, color=TEAL, fill_color=WATER, fill_opacity=0.72, stroke_width=3).shift(DOWN * 0.55)
        boundary = Line(LEFT * 5.1 + DOWN * 1.85, LEFT * 5.1 + UP * 1.0, color=RED, stroke_width=6)
        waves = VGroup(
            sine_trace(x0=-5.0, width=2.0, amplitude=0.70, phase=0.0, y0=0.0),
            sine_trace(x0=-1.9, width=2.0, amplitude=0.45, phase=-0.55, y0=0.0),
            sine_trace(x0=1.4, width=2.0, amplitude=0.25, phase=-1.15, y0=0.0),
        )
        wells = VGroup(*[Line([x, -1.55, 0], [x, 0.95, 0], color=MUTED, stroke_width=3) for x in (-2.2, 1.1, 4.4)])
        captions = VGroup(
            label("amplitude decays", 25, GOLD).move_to(LEFT * 2.4 + DOWN * 2.45),
            label("phase accumulates", 25, RED).move_to(RIGHT * 2.4 + DOWN * 2.45),
        )
        self.add(title, aquifer, boundary, waves, wells, captions)


class MethodFrame(Scene):
    def construct(self) -> None:
        title = label("The present flux is assembled from gradient history", 38).to_edge(UP, buff=0.48)
        history = VGroup()
        for index in range(7):
            opacity = 0.20 + 0.11 * index
            x = -5.2 + 0.72 * index
            history.add(Arrow([x, -0.4, 0], [x, 0.75, 0], color=TEAL, stroke_opacity=opacity, buff=0))
        kernel = VMobject(color=GOLD, stroke_width=6).set_points_smoothly([
            [-5.3, -1.65, 0], [-3.6, -1.42, 0], [-2.2, -0.8, 0], [-0.6, 0.55, 0]
        ])
        flux = Arrow(LEFT * 0.2, RIGHT * 2.0, color=RED, stroke_width=8, buff=0).shift(UP * 0.25)
        clocks = VGroup(
            Circle(radius=0.48, color=TEAL, stroke_width=5).shift(RIGHT * 3.1 + UP * 1.15),
            Circle(radius=0.48, color=RED, stroke_width=5).shift(RIGHT * 4.75 + UP * 1.15),
        )
        formula = MathTex(
            r"q+\tau_q\partial_t q=-K(\nabla h+\tau_h\partial_t\nabla h)",
            color=INK,
        ).scale(0.92).to_edge(DOWN, buff=0.48)
        clock_labels = VGroup(
            MathTex(r"\tau_q", color=TEAL).next_to(clocks[0], DOWN, buff=0.16),
            MathTex(r"\tau_h", color=RED).next_to(clocks[1], DOWN, buff=0.16),
        )
        self.add(title, history, kernel, flux, clocks, clock_labels, formula)


class ResultFrame(Scene):
    def construct(self) -> None:
        title = label("Two field transects test the same amplitude-phase relation", 34).to_edge(UP, buff=0.48)
        panels = VGroup()
        settings = (("Tuolumne", 0.28, 0.80), ("Meghna", 0.10, 0.34))
        for name, damping, phase in settings:
            axes = Axes(
                x_range=[0, 1, 0.25],
                y_range=[0, 1.1, 0.25],
                x_length=4.5,
                y_length=3.4,
                axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False},
            )
            amplitude = axes.plot(lambda x, d=damping: 2.71828 ** (-d * 4.0 * x), x_range=[0, 1], color=TEAL, stroke_width=5)
            phase_line = axes.plot(lambda x, p=phase: p * x, x_range=[0, 1], color=RED, stroke_width=5)
            points = VGroup(*[Dot(amplitude.point_from_proportion(v), radius=0.05, color=INK) for v in (0.2, 0.5, 0.8)])
            panels.add(VGroup(axes, amplitude, phase_line, points, label(name, 24).next_to(axes, DOWN, buff=0.18)))
        panels.arrange(RIGHT, buff=1.0).shift(DOWN * 0.1)
        legend = VGroup(
            Line(LEFT * 0.3, RIGHT * 0.3, color=TEAL, stroke_width=5), label("amplitude", 22, TEAL),
            Line(LEFT * 0.3, RIGHT * 0.3, color=RED, stroke_width=5), label("phase", 22, RED),
        ).arrange(RIGHT, buff=0.18).to_edge(DOWN, buff=0.28)
        self.add(title, panels, legend)
