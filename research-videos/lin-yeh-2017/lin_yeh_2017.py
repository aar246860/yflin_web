# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
# ─── How to run ───
# uv run manim -qm lin_yeh_2017.py LinYeh2017VisualAbstract
from __future__ import annotations

import sys
from pathlib import Path
from typing import Final

from manim import (
    DOWN, LEFT, RIGHT, UP, AnimationGroup, Arrow, Axes, Circle, Create, Dot,
    FadeIn, FadeOut, GrowArrow, Line, MathTex, Rectangle, ReplacementTransform,
    Scene, Text, Transform, VGroup, VMobject, Write, config,
)

SKILL_ASSETS: Final = Path.home() / ".codex/skills/research-manim-video-summarizer/assets"
sys.path.insert(0, str(SKILL_ASSETS))
from research_manim_layout import assert_inside, assert_no_overlap, place_caption, place_formula_lane  # noqa: E402

INK: Final = "#16323A"
TEAL: Final = "#087F8C"
BLUE: Final = "#2D6A9F"
GOLD: Final = "#B7791F"
BRICK: Final = "#B74A36"
PAPER: Final = "#F7F8F5"
MUTED: Final = "#688086"

config.background_color = PAPER


def label(text: str, size: int = 28, color: str = INK) -> Text:
    return Text(text, font="Arial", font_size=size, color=color)


def aquifer_section() -> VGroup:
    aquitard = Rectangle(width=12.2, height=1.0, color=MUTED, fill_color="#D8E0DF", fill_opacity=1)
    aquifer = Rectangle(width=12.2, height=2.45, color=TEAL, fill_color="#D6ECEB", fill_opacity=1)
    aquitard.shift(UP * 1.4)
    aquifer.shift(DOWN * 0.35)
    well = Rectangle(width=0.26, height=3.5, color=INK, fill_color=INK, fill_opacity=1).shift(LEFT * 3.9 + UP * 0.25)
    obs = Rectangle(width=0.12, height=2.7, color=GOLD, fill_color=GOLD, fill_opacity=1).shift(RIGHT * 3.1)
    surface = Line(LEFT * 6.1 + UP * 2.35, RIGHT * 6.1 + UP * 2.35, color=INK)
    return VGroup(aquitard, aquifer, surface, well, obs)


def flow_arrows() -> VGroup:
    arrows = VGroup()
    for y in (-0.9, -0.2, 0.5):
        arrows.add(Arrow(LEFT * 1.8 + UP * y, LEFT * 3.55 + UP * y, buff=0, color=TEAL, stroke_width=5))
        arrows.add(Arrow(RIGHT * 0.2 + UP * y, LEFT * 3.55 + UP * y, buff=0, color=TEAL, stroke_width=5))
    for x in (-1.4, 0.6, 2.4):
        arrows.add(Arrow(RIGHT * x + UP * 1.55, RIGHT * x + UP * 0.75, buff=0, color=BLUE, stroke_width=4))
    return arrows


def drawdown_profile() -> VMobject:
    curve = VMobject(color=BRICK, stroke_width=6)
    curve.set_points_smoothly([LEFT * 5 + UP * 1.0, LEFT * 4.2 + UP * 0.55, LEFT * 3.9, LEFT * 3.3 + UP * 0.55, RIGHT * 4.8 + UP * 1.0])
    return curve


def clock(color: str, center: list[float], hand_angle: float) -> VGroup:
    rim = Circle(radius=0.48, color=color, stroke_width=5).move_to(center)
    hand = Line(rim.get_center(), rim.get_center() + RIGHT * 0.32, color=color, stroke_width=5)
    hand.rotate(hand_angle, about_point=rim.get_center())
    return VGroup(rim, hand)


class LinYeh2017VisualAbstract(Scene):
    def construct(self) -> None:
        frame = Rectangle(width=13.8, height=7.55, stroke_opacity=0)
        section = aquifer_section()
        title = place_caption(label("A pumping test with hydraulic memory", 38), top=True)
        assert_inside(frame, [section, title], min_gap=0.1)
        self.play(FadeIn(section), Write(title), run_time=1.6)
        flows = flow_arrows()
        profile = drawdown_profile()
        pumping = label("constant-rate pumping", 25).next_to(section[3], LEFT, buff=0.25).shift(UP * 1.0)
        observation = label("observation well", 23, GOLD).next_to(section[4], RIGHT, buff=0.2).shift(UP * 0.6)
        assert_no_overlap([pumping, observation], [section[3], section[4]], min_gap=0.04)
        self.play(AnimationGroup(*[GrowArrow(arrow) for arrow in flows], lag_ratio=0.08), Create(profile), FadeIn(pumping), FadeIn(observation), run_time=2.8)
        self.wait(0.8)

        self.play(FadeOut(title), FadeOut(pumping), FadeOut(observation), section.animate.scale(0.72).shift(DOWN * 1.0), flows.animate.scale(0.72).shift(DOWN * 1.0), profile.animate.scale(0.72).shift(DOWN * 1.0), run_time=1.2)
        flux_clock = clock(TEAL, [-3.3, 2.1, 0], 0.45)
        grad_clock = clock(BRICK, [3.3, 2.1, 0], 1.25)
        flux_text = label("radial flux", 26, TEAL).next_to(flux_clock, DOWN)
        grad_text = label("drawdown gradient", 26, BRICK).next_to(grad_clock, DOWN)
        clocks = VGroup(flux_clock, grad_clock, flux_text, grad_text)
        assert_inside(frame, [clocks], min_gap=0.1)
        self.play(FadeIn(flux_clock), FadeIn(grad_clock), Write(flux_text), Write(grad_text), run_time=1.5)
        self.play(flux_clock[1].animate.rotate(0.8, about_point=flux_clock[0].get_center()), grad_clock[1].animate.rotate(1.6, about_point=grad_clock[0].get_center()), run_time=1.5)
        self.wait(0.6)

        equation = VGroup(
            MathTex(r"q_r(r,t+\tau_q)", color=TEAL),
            MathTex(r"=", color=INK),
            MathTex(r"-K", color=BRICK),
            MathTex(r"\frac{\partial s}{\partial r}(r,t+\tau_s)", color=BRICK),
        ).arrange(RIGHT, buff=0.25)
        place_formula_lane(equation, top=True)
        self.play(ReplacementTransform(flux_text, equation[0]), ReplacementTransform(grad_text, equation[3]), Write(equation[1]), Write(equation[2]), FadeOut(flux_clock), FadeOut(grad_clock), run_time=2.2)
        relation_note = place_caption(label("Flux and gradient carry separate macroscopic response times", 27), top=False)
        self.play(Write(relation_note), run_time=1.0)
        self.wait(1.0)

        lag_equal = MathTex(r"\tau_q=\tau_s", color=GOLD).scale(1.3).move_to(UP * 1.25)
        lag_zero = VGroup(MathTex(r"\tau_q=\tau_s", color=INK), MathTex(r"=0", color=INK)).arrange(RIGHT, buff=0.12).scale(1.3).move_to(UP * 1.25)
        check_text = label("equal lags cancel", 28, GOLD).next_to(lag_equal, DOWN, buff=0.28)
        self.play(FadeOut(relation_note), FadeOut(equation), FadeOut(flows), FadeOut(profile), FadeOut(section), Write(lag_equal), Write(check_text), run_time=1.4)
        self.wait(0.7)
        classical_text = label("Classical Darcy limit", 30).next_to(lag_zero, DOWN, buff=0.28)
        self.play(Transform(lag_equal, lag_zero), Transform(check_text, classical_text), run_time=1.2)
        self.wait(0.8)

        axes = Axes(x_range=[-3, 3, 1], y_range=[0, 1.2, 0.2], x_length=9.4, y_length=4.0, axis_config={"color": MUTED, "include_ticks": False}).shift(DOWN * 0.35)
        classical = axes.plot(lambda x: 0.16 + 0.88 / (1 + 2.71828 ** (-1.75 * x)), x_range=[-3, 3], color=INK)
        lagging = axes.plot(lambda x: 0.14 + 0.9 / (1 + 2.71828 ** (-1.35 * (x - 0.45))), x_range=[-3, 3], color=TEAL)
        early_band = Rectangle(width=3.0, height=4.0, color=GOLD, fill_color=GOLD, fill_opacity=0.13, stroke_opacity=0).move_to(axes.c2p(-1.3, 0.6))
        curve_labels = VGroup(label("Classical Darcy", 22), label("lagging model", 22, TEAL)).arrange(DOWN, aligned_edge=LEFT).to_corner(UP + RIGHT).shift(DOWN * 0.9)
        early_text = label("early-time diagnostic window", 23, GOLD).next_to(early_band, DOWN, buff=0.12)
        self.play(FadeOut(lag_equal), FadeOut(check_text), Create(axes), FadeIn(early_band), Create(classical), Create(lagging), FadeIn(curve_labels), FadeIn(early_text), run_time=2.6)
        self.wait(1.2)

        network = VGroup()
        distances = [208, 518, 1204, 2713, 3566]
        names = ["LC", "SP-2", "BHPL", "CL-2", "CHLN-2"]
        baseline = Line(LEFT * 5.5, RIGHT * 5.5, color=MUTED).shift(DOWN * 1.0)
        pump = Dot(LEFT * 5.1 + DOWN * 1.0, radius=0.12, color=BRICK)
        for distance, name in zip(distances, names, strict=True):
            x = -4.7 + 9.4 * distance / 3566
            marker = Dot(RIGHT * x + DOWN * 1.0, radius=0.09, color=TEAL)
            marker_label = label(name, 18, TEAL).next_to(marker, UP, buff=0.12)
            network.add(marker, marker_label)
        network.add(baseline, pump, label("RC-5", 20, BRICK).next_to(pump, DOWN), label("208–3566 m", 23).move_to(DOWN * 2.0))
        field_title = label("Rapid City: five observation wells", 34).move_to(UP * 2.5)
        self.play(FadeOut(axes), FadeOut(early_band), FadeOut(classical), FadeOut(lagging), FadeOut(curve_labels), FadeOut(early_text), FadeIn(field_title), FadeIn(network), run_time=2.0)
        self.wait(1.2)

        lag_points = VGroup(*[Dot(LEFT * 2.6 + RIGHT * i * 1.3 + UP * (0.15 * ((i % 2) * 2 - 1)), radius=0.11, color=TEAL) for i in range(5)])
        bracket = Line(lag_points[0].get_center() + DOWN * 0.55, lag_points[-1].get_center() + DOWN * 0.55, color=GOLD, stroke_width=8)
        spread_text = label("fitted lag pairs vary across wells", 29).next_to(bracket, DOWN, buff=0.25)
        self.play(FadeOut(network), FadeOut(field_title), FadeIn(lag_points), Create(bracket), Write(spread_text), run_time=1.8)
        self.wait(1.0)

        final_section = aquifer_section().scale(0.78).shift(DOWN * 0.85)
        qualification = VGroup(label("Lagging Theory", 36, TEAL), label("diagnostic, not universal", 27, GOLD)).arrange(DOWN, aligned_edge=LEFT).move_to(UP * 2.25)
        interval = bracket.copy().scale(0.55).next_to(qualification, DOWN, buff=0.35)
        self.play(FadeOut(spread_text), FadeOut(bracket), run_time=0.45)
        self.play(ReplacementTransform(lag_points, interval), FadeIn(final_section), Write(qualification), run_time=1.8)
        self.wait(2.0)
