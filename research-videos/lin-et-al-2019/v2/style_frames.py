# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
# --- How to run ---
# uv run manim -s -qh --media_dir media style_frames.py ContextFrame MethodFrame ResultFrame
from __future__ import annotations

from typing import Final

from manim import (
    DOWN,
    LEFT,
    ORIGIN,
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

BACKGROUND: Final = "#F6F8F5"
FOREGROUND: Final = "#112D32"
FOCAL: Final = "#087F8C"
SECONDARY: Final = "#566D70"
WARNING: Final = "#B64A35"
UNCERTAINTY: Final = "#B77A1F"
WATER_FILL: Final = "#D7ECE8"
AQUITARD_FILL: Final = "#DDE2DF"

config.background_color = BACKGROUND
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30


def text_label(value: str, size: int, color: str = FOREGROUND) -> Text:
    return Text(value, font="Arial", font_size=size, color=color)


class ContextFrame(Scene):
    def construct(self) -> None:
        title = text_label("Why does drawdown flatten, then steepen again?", 44).to_edge(UP, buff=0.5)
        axes = Axes(
            x_range=[0, 6, 1], y_range=[0, 1.1, 0.2], x_length=10.5, y_length=4.4,
            axis_config={"color": SECONDARY, "stroke_width": 2, "include_ticks": False},
        ).shift(DOWN * 0.25)
        curve = axes.plot(
            lambda x: 0.08 + 0.34 * (1 - 2.71828 ** (-1.7 * x)) + 0.42 / (1 + 2.71828 ** (-2.1 * (x - 4.25))),
            x_range=[0.05, 5.8], color=FOCAL, stroke_width=7,
        )
        labels = VGroup(
            text_label("aquifer storage", 24, WARNING).move_to(axes.c2p(0.85, 0.82)),
            text_label("delayed drainage", 24, UNCERTAINTY).move_to(axes.c2p(3.0, 0.34)),
            text_label("combined release", 24, FOCAL).move_to(axes.c2p(5.0, 0.92)),
        )
        self.add(axes, curve, title, labels)


class MethodFrame(Scene):
    def construct(self) -> None:
        aquifer = Rectangle(width=11.4, height=2.4, color=FOCAL, fill_color=WATER_FILL, fill_opacity=0.8, stroke_width=3).shift(DOWN * 0.8)
        fringe = Rectangle(width=11.4, height=0.62, color=UNCERTAINTY, fill_color=UNCERTAINTY, fill_opacity=0.16, stroke_width=2).shift(UP * 0.72)
        water_table = VMobject(color=FOCAL, stroke_width=6).set_points_smoothly([
            [-5.7, 0.45, 0], [-2.3, 0.35, 0], [0.0, -0.1, 0], [2.3, 0.35, 0], [5.7, 0.45, 0]
        ])
        flux = Arrow(UP * 1.25, UP * 0.35, buff=0, color=FOCAL, stroke_width=7)
        flux_clock = Circle(radius=0.44, color=FOCAL, stroke_width=5).move_to(LEFT * 3.0 + UP * 1.8)
        gradient_clock = Circle(radius=0.44, color=WARNING, stroke_width=5).move_to(RIGHT * 3.0 + UP * 1.8)
        flux_hand = Line(flux_clock.get_center(), flux_clock.get_center() + RIGHT * 0.25 + UP * 0.14, color=FOCAL, stroke_width=4)
        gradient_hand = Line(gradient_clock.get_center(), gradient_clock.get_center() + UP * 0.29, color=WARNING, stroke_width=4)
        formula = VGroup(
            MathTex(r"q_z(t+\tau_q)", color=FOCAL),
            MathTex(r"=", color=FOREGROUND),
            MathTex(r"-K_z\,\partial_z s(t+\tau_s)", color=WARNING),
        ).arrange(RIGHT, buff=0.24).scale(1.0).to_edge(DOWN, buff=0.48)
        labels = VGroup(
            text_label("rapid release", 24, FOCAL).next_to(flux_clock, DOWN, buff=0.18),
            text_label("retained storage", 24, WARNING).next_to(gradient_clock, DOWN, buff=0.18),
        )
        self.add(aquifer, fringe, water_table, flux, flux_clock, gradient_clock, flux_hand, gradient_hand, labels, formula)


class ResultFrame(Scene):
    def construct(self) -> None:
        title = text_label("Three field tests, one bounded comparison", 42).to_edge(UP, buff=0.48)
        panels = VGroup()
        for idx, name in enumerate(("Cape Cod", "Borden", "Saint Pardon")):
            axes = Axes(
                x_range=[0, 4, 1], y_range=[0, 1, 0.25], x_length=3.3, y_length=3.4,
                axis_config={"color": SECONDARY, "stroke_width": 2, "include_ticks": False},
            )
            model = axes.plot(lambda x, j=idx: 0.1 + 0.18 * x + 0.18 / (1 + 2.71828 ** (-2 * (x - 2.4 + 0.15 * j))), x_range=[0.1, 3.8], color=FOCAL, stroke_width=5)
            points = VGroup(*[Dot(model.point_from_proportion(p), radius=0.045, color=FOREGROUND) for p in (0.08, 0.23, 0.42, 0.61, 0.79, 0.94)])
            label = text_label(name, 25, FOREGROUND).next_to(axes, DOWN, buff=0.18)
            panels.add(VGroup(axes, model, points, label))
        panels.arrange(RIGHT, buff=0.52).shift(DOWN * 0.15)
        caption = VGroup(MathTex(r"S_y", color=UNCERTAINTY), text_label("within cited laboratory-supported ranges", 24, SECONDARY)).arrange(RIGHT, buff=0.18).to_edge(DOWN, buff=0.28)
        self.add(title, panels, caption)
