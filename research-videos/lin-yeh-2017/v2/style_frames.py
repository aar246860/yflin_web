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


def aquifer_stage() -> VGroup:
    aquitard = Rectangle(
        width=12.0,
        height=0.9,
        color=SECONDARY,
        fill_color=AQUITARD_FILL,
        fill_opacity=1,
        stroke_width=2,
    ).shift(UP * 1.15)
    aquifer = Rectangle(
        width=12.0,
        height=2.45,
        color=FOCAL,
        fill_color=WATER_FILL,
        fill_opacity=1,
        stroke_width=3,
    ).shift(DOWN * 0.55)
    pump = Rectangle(
        width=0.22,
        height=3.45,
        color=WARNING,
        fill_color=WARNING,
        fill_opacity=1,
        stroke_width=4,
    ).shift(LEFT * 4.2 + UP * 0.2)
    observation = Rectangle(
        width=0.11,
        height=2.55,
        color=UNCERTAINTY,
        fill_color=UNCERTAINTY,
        fill_opacity=1,
        stroke_width=3,
    ).shift(RIGHT * 2.75 + DOWN * 0.05)
    return VGroup(aquitard, aquifer, pump, observation)


class ContextFrame(Scene):
    def construct(self) -> None:
        stage = aquifer_stage()
        title = text_label("One pumping test, two response clocks", 44).to_edge(UP, buff=0.5)
        arrows = VGroup(
            *[
                Arrow(
                    start=RIGHT * x + UP * y,
                    end=LEFT * 4.0 + UP * y,
                    buff=0.05,
                    color=FOCAL,
                    stroke_width=5,
                    max_tip_length_to_length_ratio=0.12,
                )
                for x, y in ((2.4, -1.2), (1.0, -0.55), (-0.6, 0.05))
            ]
        )
        pump_label = text_label("RC-5", 28, WARNING).next_to(stage[2], LEFT, buff=0.22)
        observation_label = text_label("observation well", 24, UNCERTAINTY).next_to(
            stage[3], RIGHT, buff=0.22
        )
        self.add(stage, arrows, title, pump_label, observation_label)


class MethodFrame(Scene):
    def construct(self) -> None:
        flux = Arrow(LEFT * 5.0, LEFT * 1.15, buff=0, color=FOCAL, stroke_width=7)
        gradient = Line(RIGHT * 1.0 + DOWN * 0.8, RIGHT * 5.0 + UP * 0.8, color=WARNING, stroke_width=7)
        flux_clock = Circle(radius=0.48, color=FOCAL, stroke_width=6).move_to(LEFT * 3.05 + UP * 1.45)
        gradient_clock = Circle(radius=0.48, color=WARNING, stroke_width=6).move_to(RIGHT * 3.05 + UP * 1.45)
        flux_hand = Line(flux_clock.get_center(), flux_clock.get_center() + UP * 0.3, color=FOCAL, stroke_width=5)
        gradient_hand = Line(
            gradient_clock.get_center(),
            gradient_clock.get_center() + RIGHT * 0.28 + UP * 0.12,
            color=WARNING,
            stroke_width=5,
        )
        formula = VGroup(
            MathTex(r"q_r(r,t+\tau_q)", color=FOCAL),
            MathTex(r"=", color=FOREGROUND),
            MathTex(r"-K\,\frac{\partial s(r,t+\tau_s)}{\partial r}", color=WARNING),
        ).arrange(RIGHT, buff=0.24).scale(1.05).to_edge(DOWN, buff=0.65)
        flux_label = text_label("flux", 28, FOCAL).next_to(flux, DOWN, buff=0.3)
        gradient_label = text_label("drawdown gradient", 28, WARNING).next_to(gradient, DOWN, buff=0.3)
        self.add(
            flux,
            gradient,
            flux_clock,
            gradient_clock,
            flux_hand,
            gradient_hand,
            flux_label,
            gradient_label,
            formula,
        )


class ResultFrame(Scene):
    def construct(self) -> None:
        axes = Axes(
            x_range=[0, 5, 1],
            y_range=[0, 1.0, 0.2],
            x_length=9.8,
            y_length=4.2,
            axis_config={"color": SECONDARY, "stroke_width": 2, "include_ticks": False},
        ).shift(DOWN * 0.25)
        measured = VGroup(
            *[
                Dot(axes.c2p(x, 0.17 + 0.72 * (1 - 2.71828 ** (-0.8 * x))), radius=0.055, color=FOREGROUND)
                for x in (0.25, 0.5, 0.85, 1.25, 1.8, 2.5, 3.25, 4.1, 4.7)
            ]
        )
        classical = axes.plot(
            lambda x: 0.13 + 0.76 * (1 - 2.71828 ** (-0.53 * x)),
            x_range=[0.15, 5],
            color=SECONDARY,
            stroke_width=3,
        )
        lagging = axes.plot(
            lambda x: 0.17 + 0.72 * (1 - 2.71828 ** (-0.8 * x)),
            x_range=[0.15, 5],
            color=FOCAL,
            stroke_width=6,
        )
        early_band = Rectangle(
            width=2.45,
            height=4.15,
            fill_color=UNCERTAINTY,
            fill_opacity=0.12,
            stroke_opacity=0,
        ).move_to(axes.c2p(0.75, 0.5))
        title = text_label("The evidence sits in early pumping time", 42).to_edge(UP, buff=0.48)
        legend = VGroup(
            Line(ORIGIN, RIGHT * 0.6, color=FOCAL, stroke_width=6),
            text_label("lagging model", 24, FOCAL),
            Line(ORIGIN, RIGHT * 0.6, color=SECONDARY, stroke_width=3),
            text_label("classical model", 24, SECONDARY),
        ).arrange(RIGHT, buff=0.22).to_edge(DOWN, buff=0.35)
        self.add(axes, early_band, classical, lagging, measured, title, legend)
