# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
from __future__ import annotations

import sys
from pathlib import Path
from typing import Final

from manim import (
    DOWN, LEFT, RIGHT, UP, Arrow, Axes, Circle, Create, Dot, FadeIn, FadeOut,
    Line, MathTex, NumberPlane, Rectangle, Scene, Text, VGroup,
    VMobject, Write, config,
)

INK: Final = "#17323A"
TEAL: Final = "#087F8C"
BLUE: Final = "#2D6A9F"
GOLD: Final = "#B7791F"
BRICK: Final = "#B74A36"
PAPER: Final = "#F7F8F5"
MUTED: Final = "#6B7F82"
SAND: Final = "#E7DFC9"
config.background_color = PAPER
sys.path.insert(0, str(Path.home() / ".codex/skills/research-manim-video-summarizer/assets"))
from research_manim_layout import assert_inside, assert_no_overlap  # noqa: E402


def text(value: str, size: int = 30, color: str = INK) -> Text:
    return Text(value, font="Arial", font_size=size, color=color)


def title(value: str) -> Text:
    return text(value, 36).to_edge(UP, buff=0.35)


class IslandImageWell(Scene):
    def construct(self) -> None:
        frame = Rectangle(width=13.8, height=7.55, stroke_opacity=0)
        heading = title("An island boundary changes every pumping response")
        island = Circle(radius=2.55, color=TEAL, fill_color="#D9ECE8", fill_opacity=1)
        coast = island.copy().set_fill(opacity=0).set_stroke(width=7)
        well = Dot(LEFT * 0.85 + UP * 0.35, radius=0.13, color=BRICK)
        well_label = text("pumping well", 23, BRICK).next_to(well, UP, buff=0.15)
        assert_inside(frame, [heading, island, well_label], min_gap=0.08)
        assert_no_overlap([heading], [island], min_gap=0.08)
        self.play(Write(heading), Create(coast), FadeIn(island), FadeIn(well), FadeIn(well_label))
        rings = VGroup(*[Circle(radius=r, color=BRICK, stroke_opacity=0.55) for r in (0.4, 0.8, 1.2)]).move_to(well)
        self.play(*[Create(ring) for ring in rings], run_time=1.8)

        image = Dot(RIGHT * 4.4 + DOWN * 1.8, radius=0.13, color=GOLD)
        connector = Line(well, image, color=MUTED, stroke_width=2)
        image_label = text("image well", 23, GOLD).next_to(image, DOWN, buff=0.15)
        self.play(FadeOut(well_label), Create(connector), FadeIn(image), FadeIn(image_label))
        corrected = VGroup(*[
            Circle(radius=r, color=TEAL, stroke_opacity=0.75).move_to(image)
            for r in (1.2, 1.8, 2.4)
        ])
        self.play(*[Create(ring) for ring in corrected], run_time=1.8)
        self.play(FadeOut(connector), FadeOut(rings), FadeOut(corrected), FadeOut(image_label), FadeOut(heading))

        surface = NumberPlane(
            x_range=[-5, 5, 1], y_range=[-3, 3, 1], x_length=11, y_length=5.6,
            background_line_style={"stroke_color": MUTED, "stroke_opacity": 0.12},
            axis_config={"stroke_opacity": 0},
        )
        contours = VGroup(*[
            Circle(radius=r, color=BLUE, stroke_width=4).stretch(1.45, 0).shift(LEFT * 0.45)
            for r in (0.55, 1.05, 1.55, 2.05)
        ])
        safe = Circle(radius=0.82, color=GOLD, fill_color=GOLD, fill_opacity=0.12).move_to(well)
        result = title("Head and interface depth become fast constraints")
        note = text("pumping + recharge + coastline geometry", 26, MUTED).to_edge(DOWN, buff=0.35)
        self.play(FadeIn(surface), FadeIn(island), FadeIn(well), Create(contours), FadeIn(result), FadeIn(note))
        self.play(Create(safe), run_time=1.2)
        self.wait(2)


class TransientVerticalFlux(Scene):
    def construct(self) -> None:
        frame = Rectangle(width=13.8, height=7.55, stroke_opacity=0)
        heading = title("A temperature profile records changing groundwater flux")
        column = Rectangle(width=3.1, height=5.2, color=TEAL, fill_color="#D9ECE8", fill_opacity=1).shift(LEFT * 3.4 + DOWN * 0.25)
        depths = VGroup(*[
            Dot(LEFT * 3.4 + UP * (1.9 - i * 0.62), radius=0.07, color=BLUE)
            for i in range(7)
        ])
        arrows = VGroup(*[
            Arrow(LEFT * 4.45 + UP * y, LEFT * 4.45 + UP * (y - 0.55), color=TEAL, buff=0, stroke_width=4)
            for y in (1.5, 0.4, -0.7)
        ])
        assert_inside(frame, [heading, column, depths, arrows], min_gap=0.08)
        assert_no_overlap([heading], [column], min_gap=0.08)
        self.play(Write(heading), FadeIn(column), FadeIn(depths), *[Create(a) for a in arrows])

        axes = Axes(
            x_range=[8, 20, 2], y_range=[0, 6, 1], x_length=5.7, y_length=4.7,
            axis_config={"color": MUTED, "include_numbers": False},
        ).shift(RIGHT * 2.6 + DOWN * 0.25)
        profile = VMobject(color=GOLD, stroke_width=6)
        profile.set_points_smoothly([
            axes.c2p(18.0, 0.2), axes.c2p(16.4, 1.2), axes.c2p(14.7, 2.4),
            axes.c2p(13.7, 3.6), axes.c2p(13.2, 5.4),
        ])
        labels = VGroup(text("temperature", 22, GOLD).next_to(axes, UP), text("depth", 22, MUTED).next_to(axes, LEFT).rotate(1.5708))
        self.play(Create(axes), Create(profile), FadeIn(labels), FadeOut(heading))
        profiles = VGroup()
        for shift, color in ((0.25, TEAL), (0.55, BLUE)):
            p = profile.copy().set_color(color).shift(RIGHT * shift)
            profiles.add(p)
        self.play(*[Create(p) for p in profiles], run_time=1.5)

        self.play(FadeOut(column), FadeOut(depths), FadeOut(arrows), FadeOut(axes), FadeOut(profile), FadeOut(profiles), FadeOut(labels))
        time_axes = Axes(x_range=[0, 5, 1], y_range=[0, 1.2, 0.2], x_length=9.8, y_length=4.5, axis_config={"color": MUTED, "include_numbers": False})
        true_flux = time_axes.plot(lambda t: 0.34 + 0.12 * t + 0.24 * (2.71828 ** (-((t - 2.1) ** 2) / 0.42)), x_range=[0, 5], color=TEAL)
        constant = Line(time_axes.c2p(0, 0.46), time_axes.c2p(5, 0.46), color=INK, stroke_width=4)
        transient_label = text("transient flux", 23, TEAL).next_to(true_flux.get_end(), UP, buff=0.15)
        constant_label = text("constant-flux assumption", 23).next_to(constant.get_end(), DOWN, buff=0.15)
        result = title("The inverse model recovers flux as a time series")
        self.play(Create(time_axes), Create(constant), FadeIn(constant_label), FadeIn(result))
        self.play(Create(true_flux), FadeIn(transient_label), run_time=2)
        self.wait(2)


class WaterTableKinematic(Scene):
    def construct(self) -> None:
        frame = Rectangle(width=13.8, height=7.55, stroke_opacity=0)
        heading = title("Gravity drainage does not occur instantaneously")
        unsat = Rectangle(width=11.5, height=2.0, color=GOLD, fill_color=SAND, fill_opacity=0.8).shift(UP * 1.2)
        sat = Rectangle(width=11.5, height=2.8, color=TEAL, fill_color="#D9ECE8", fill_opacity=1).shift(DOWN * 1.2)
        table = Line(LEFT * 5.75 + UP * 0.2, RIGHT * 5.75 + UP * 0.2, color=BLUE, stroke_width=7)
        well = Rectangle(width=0.24, height=4.3, color=INK, fill_color=INK, fill_opacity=1).shift(LEFT * 3.8)
        droplets = VGroup(*[
            Arrow(RIGHT * x + UP * 1.75, RIGHT * x + UP * 0.55, color=BLUE, buff=0, stroke_width=4)
            for x in (-1.5, 0.2, 1.9, 3.6)
        ])
        assert_inside(frame, [heading, unsat, sat, table, well], min_gap=0.08)
        assert_no_overlap([heading], [unsat], min_gap=0.08)
        self.play(Write(heading), FadeIn(unsat), FadeIn(sat), Create(table), FadeIn(well))
        self.play(*[Create(a) for a in droplets], run_time=1.8)
        instant = text("instantaneous drainage?", 27, BRICK).to_edge(DOWN, buff=0.35)
        self.play(FadeIn(instant))

        curved = VMobject(color=BLUE, stroke_width=7)
        curved.set_points_smoothly([
            LEFT * 5.75 + UP * 0.2, LEFT * 4.5, LEFT * 3.8 + DOWN * 0.8,
            LEFT * 2.9, RIGHT * 5.75 + UP * 0.2,
        ])
        self.play(FadeOut(instant), table.animate.set_stroke(opacity=0.2), Create(curved), run_time=1.7)
        radial = VGroup(*[
            Arrow(RIGHT * x + UP * 1.3, LEFT * 3.45 + UP * 0.35, color=GOLD, buff=0.1, stroke_width=3)
            for x in (-1.2, 0.8, 2.8)
        ])
        self.play(*[Create(a) for a in radial], run_time=1.5)

        formula = MathTex(r"\text{drainage term}+\text{radial Laplacian}", color=INK).scale(0.82).to_edge(UP, buff=0.5)
        self.play(FadeOut(heading), Write(formula))
        self.wait(1)
        result = VGroup(
            text("Boise pumping tests", 27, MUTED),
            text("more reliable specific yield", 34, TEAL),
            text("without an extra empirical fitting parameter", 25, GOLD),
        ).arrange(DOWN, buff=0.22).to_edge(DOWN, buff=0.3)
        self.play(FadeOut(formula), FadeIn(result))
        self.wait(2)
