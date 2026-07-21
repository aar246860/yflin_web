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
    Circle,
    DashedLine,
    Dot,
    Line,
    MathTex,
    NumberLine,
    Polygon,
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
BRICK: Final = "#B64A35"
OCHRE: Final = "#B77A1F"
WATER: Final = "#D7ECE8"

config.background_color = PAPER
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30


def text_label(value: str, size: int, color: str = INK) -> Text:
    return Text(value, font="Arial", font_size=size, color=color)


def pulse(color: str, phase: float, vertical_offset: float) -> VMobject:
    points = []
    for index in range(121):
        fraction = index / 120
        x = -5.0 + 4.2 * fraction
        envelope = math.exp(-((fraction - 0.52 - phase) / 0.18) ** 2)
        points.append([x, vertical_offset + 0.72 * envelope, 0])
    return VMobject(color=color, stroke_width=6).set_points_smoothly(points)


class ContextFrame(Scene):
    def construct(self) -> None:
        title = text_label("A pumping test can hide a timing mismatch", 44).to_edge(UP, buff=0.45)
        aquifer = Rectangle(
            width=12.2,
            height=2.45,
            color=TEAL,
            fill_color=WATER,
            fill_opacity=0.78,
            stroke_width=4,
        ).shift(DOWN * 1.15)
        well = VGroup(
            Line([0, 2.1, 0], [0, -2.25, 0], color=INK, stroke_width=7),
            Arrow([0, 1.55, 0], [0, 2.35, 0], color=BRICK, stroke_width=6, buff=0),
            Circle(radius=0.12, color=INK, fill_color=INK, fill_opacity=1).shift(DOWN * 2.0),
        )
        drawdown = VMobject(color=TEAL, stroke_width=6).set_points_smoothly(
            [[-5.6, -0.35, 0], [-2.8, -0.48, 0], [0, -1.35, 0], [2.8, -0.48, 0], [5.6, -0.35, 0]]
        )
        gradient = pulse(BRICK, -0.06, 1.02)
        flux = pulse(TEAL, 0.10, 0.12)
        trace_labels = VGroup(
            text_label("gradient", 24, BRICK).next_to(gradient, RIGHT, buff=0.18),
            text_label("flux", 24, TEAL).next_to(flux, RIGHT, buff=0.18),
        )
        mismatch = DashedLine([-2.72, 0.65, 0], [-2.05, 0.65, 0], color=OCHRE, stroke_width=5)
        caption = text_label("same pumping event  •  different response times", 28).to_edge(DOWN, buff=0.34)
        self.add(title, aquifer, drawdown, well, gradient, flux, trace_labels, mismatch, caption)


class MethodFrame(Scene):
    def construct(self) -> None:
        title = text_label("Lag order becomes a dimensionless diagnostic", 44).to_edge(UP, buff=0.45)
        time_axis = NumberLine(
            x_range=[0, 10, 1],
            length=10.6,
            include_numbers=False,
            color=MUTED,
            stroke_width=3,
        ).shift(UP * 1.0)
        origin = Dot(time_axis.n2p(1.2), color=INK, radius=0.08)
        q_marker = VGroup(
            Line(time_axis.n2p(4.0) + DOWN * 0.5, time_axis.n2p(4.0) + UP * 0.7, color=TEAL, stroke_width=6),
            MathTex(r"\tau_q", color=TEAL).next_to(time_axis.n2p(4.0) + DOWN * 0.48, DOWN, buff=0.10),
        )
        s_marker = VGroup(
            Line(time_axis.n2p(6.7) + DOWN * 0.5, time_axis.n2p(6.7) + UP * 0.7, color=BRICK, stroke_width=6),
            MathTex(r"\tau_s", color=BRICK).next_to(time_axis.n2p(6.7) + DOWN * 0.48, DOWN, buff=0.10),
        )
        lag_arrows = VGroup(
            Arrow(origin.get_center() + UP * 0.45, time_axis.n2p(4.0) + UP * 0.45, color=TEAL, buff=0.08, stroke_width=5),
            Arrow(origin.get_center() + UP * 0.85, time_axis.n2p(6.7) + UP * 0.85, color=BRICK, buff=0.08, stroke_width=5),
        )
        ratio = MathTex(r"\theta", r"=", r"\frac{\tau_s}{\tau_q}", color=INK).scale(1.25).shift(DOWN * 0.85)
        ratio[0].set_color(OCHRE)
        regimes = VGroup(
            text_label("< 1", 28, TEAL),
            text_label("= 1", 28, INK),
            text_label("> 1", 28, BRICK),
        ).arrange(RIGHT, buff=1.6).shift(DOWN * 2.1)
        boundary = Line([0, -2.55, 0], [0, -1.75, 0], color=OCHRE, stroke_width=5)
        qualifier = text_label("interpreted association  •  not causal proof", 24, MUTED).to_edge(DOWN, buff=0.28)
        self.add(title, time_axis, origin, q_marker, s_marker, lag_arrows, ratio, regimes, boundary, qualifier)


class ResultFrame(Scene):
    def construct(self) -> None:
        title = text_label("A well field becomes a bounded diagnostic map", 44).to_edge(UP, buff=0.45)
        field = Polygon(
            [-5.7, -2.5, 0],
            [-5.2, 2.0, 0],
            [-1.5, 2.45, 0],
            [2.3, 2.05, 0],
            [5.6, 0.65, 0],
            [4.9, -2.35, 0],
            color=MUTED,
            fill_color=WATER,
            fill_opacity=0.55,
            stroke_width=3,
        ).shift(DOWN * 0.25)
        threshold = VMobject(color=OCHRE, stroke_width=6).set_points_smoothly(
            [[-4.4, -0.8, 0], [-2.3, 0.3, 0], [-0.3, -0.1, 0], [1.4, 0.8, 0], [4.2, 0.15, 0]]
        )
        wells = VGroup()
        for point in ([-4.2, -1.5, 0], [-2.8, 1.1, 0], [-0.6, -1.25, 0], [1.3, 1.25, 0], [3.6, -0.8, 0]):
            support = Circle(radius=0.38, color=OCHRE, stroke_width=2, stroke_opacity=0.75).move_to(point)
            well = Dot(point, color=INK, radius=0.09)
            wells.add(support, well)
        labels = VGroup(
            MathTex(r"\theta<1", color=TEAL).move_to([-3.6, 1.55, 0]),
            MathTex(r"\theta>1", color=BRICK).move_to([3.4, 1.15, 0]),
            text_label("copula conditional width", 24, OCHRE).move_to([2.7, -2.15, 0]),
        )
        note = text_label("interpolated field  •  wells are support-volume averages", 25, MUTED).to_edge(DOWN, buff=0.28)
        self.add(title, field, threshold, wells, labels, note)
