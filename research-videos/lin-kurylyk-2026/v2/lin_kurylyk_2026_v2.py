# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
# --- How to run ---
# uv run --with manim==0.20.1 manim -qh --fps 30 --media_dir media lin_kurylyk_2026_v2.py LinKurylyk2026V2
# noqa: SIZE_OK
from __future__ import annotations

import cmath
import math
import sys
from pathlib import Path
from typing import Final

import numpy as np
from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Arrow,
    Axes,
    Circle,
    Create,
    DashedLine,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    MathTex,
    ParametricFunction,
    Rectangle,
    ReplacementTransform,
    Scene,
    Square,
    Text,
    Transform,
    VGroup,
    VMobject,
    ValueTracker,
    Write,
    always_redraw,
    color_gradient,
    config,
)

SKILL_ROOT: Final = Path.home() / ".codex/skills/research-manim-video-summarizer"
sys.path.insert(0, str(SKILL_ROOT))
from assets.research_manim_layout import assert_scene_layout  # noqa: E402

PAPER: Final = "#F6F8F5"
INK: Final = "#112D32"
TEAL: Final = "#087F8C"
MUTED: Final = "#566D70"
RED: Final = "#B64A35"
GOLD: Final = "#B77A1F"
PALE: Final = "#D7ECE8"
config.background_color = PAPER
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30


def text(value: str, size: int = 28, color: str = INK) -> Text:
    return Text(value, font="Arial", font_size=size, color=color)


def wavenumber(*, omega: float, diffusivity: float, tau_q: float, tau_h: float) -> tuple[float, float]:
    squared = 1j * omega * (1 + 1j * omega * tau_q) / (diffusivity * (1 + 1j * omega * tau_h))
    root = cmath.sqrt(squared)
    return abs(root.real), abs(root.imag)


def normalized_ab(*, omega_d: float, theta: float) -> tuple[float, float]:
    return wavenumber(omega=omega_d, diffusivity=1.0, tau_q=1.0, tau_h=theta)


def wave_curve(
    *,
    x0: float,
    width: float,
    center_y: float,
    amplitude: float,
    phase: float,
    cycles: float = 1.0,
    color: str = TEAL,
    stroke_width: float = 5.0,
) -> VMobject:
    curve = VMobject(color=color, stroke_width=stroke_width)
    points = []
    for index in range(121):
        fraction = index / 120
        x = x0 + width * fraction
        y = center_y + amplitude * math.sin(2 * math.pi * cycles * fraction + phase)
        points.append([x, y, 0])
    return curve.set_points_smoothly(points)


def response_curves(
    axes: Axes,
    *,
    diffusivity: float,
    tau_q: float,
    tau_h: float,
    period_days: float,
    x_max: float,
) -> tuple[VMobject, VMobject]:
    omega = 2 * math.pi / period_days
    alpha, beta = wavenumber(omega=omega, diffusivity=diffusivity, tau_q=tau_q, tau_h=tau_h)
    amplitude = axes.plot(
        lambda x: math.exp(-alpha * x),
        x_range=[0, x_max],
        color=TEAL,
        stroke_width=5,
    )
    phase = axes.plot(
        lambda x: min(beta * x, 2.4),
        x_range=[0, x_max],
        color=RED,
        stroke_width=5,
    )
    return amplitude, phase


def compact_formula(*parts: tuple[str, str], scale: float = 0.84) -> VGroup:
    formula = VGroup(*[MathTex(value, color=color) for value, color in parts])
    formula.arrange(RIGHT, buff=0.13).scale(scale)
    return formula


class LinKurylyk2026V2(Scene):
    def construct(self) -> None:
        self.scene_01_b01_boundary_wave()
        self.scene_02_b02_two_diffusivities()
        self.scene_03_b03_causal_memory()
        self.scene_04_m01_memory_integral()
        self.scene_05_m02_two_clock_law()
        self.scene_06_m03_conservation()
        self.scene_07_m04_harmonic_wave()
        self.scene_08_m05_mismatch_map()
        self.scene_09_m06_transfer_function()
        self.scene_10_m07_field_fit()
        self.scene_11_m08_aic()
        self.scene_12_m09_sample_data()
        self.scene_13_m10_refit()
        self.scene_14_m11_filter()
        self.scene_15_m12_intervals()
        self.scene_16_m13_numerical_check()
        self.scene_17_m14_sensitivity()
        self.scene_18_return()

    def _hold(self, duration: float = 1.1) -> None:
        self.wait(duration)

    def scene_01_b01_boundary_wave(self) -> None:
        aquifer = Rectangle(
            width=11.6,
            height=3.0,
            color=TEAL,
            fill_color=PALE,
            fill_opacity=0.72,
            stroke_width=3,
        ).shift(DOWN * 0.18)
        well_left = Line([-2.3, -1.55, 0], [-2.3, 1.15, 0], color=MUTED, stroke_width=3)
        well_middle = Line([1.0, -1.55, 0], [1.0, 1.15, 0], color=MUTED, stroke_width=3)
        well_right = Line([4.25, -1.55, 0], [4.25, 1.15, 0], color=MUTED, stroke_width=3)
        wells = VGroup(well_left, well_middle, well_right)
        boundary = Line([-5.35, -1.55, 0], [-5.35, 1.2, 0], color=RED, stroke_width=6)
        moving_curve = VGroup()
        moving_target_curve = VGroup()
        envelope_top_curve = VGroup()
        envelope_bottom_curve = VGroup()
        for index in range(40):
            x0 = -5.2 + 9.8 * index / 40
            x1 = -5.2 + 9.8 * (index + 1) / 40
            y0 = -0.15 + 0.82 * math.sin(2 * math.pi * 1.35 * index / 40)
            y1 = -0.15 + 0.82 * math.sin(2 * math.pi * 1.35 * (index + 1) / 40)
            yt0 = -0.15 + 0.82 * math.sin(math.pi + 2 * math.pi * 1.35 * index / 40)
            yt1 = -0.15 + 0.82 * math.sin(math.pi + 2 * math.pi * 1.35 * (index + 1) / 40)
            top0 = 0.72 - 0.07 * (x0 + 5.2)
            top1 = 0.72 - 0.07 * (x1 + 5.2)
            moving_curve.add(Line([x0, y0, 0], [x1, y1, 0], color=TEAL, stroke_width=6))
            moving_target_curve.add(Line([x0, yt0, 0], [x1, yt1, 0], color=TEAL, stroke_width=6))
            envelope_top_curve.add(Line([x0, top0, 0], [x1, top1, 0], color=GOLD, stroke_width=3))
            envelope_bottom_curve.add(Line([x0, -top0 - 0.3, 0], [x1, -top1 - 0.3, 0], color=GOLD, stroke_width=3))
        content = VGroup(aquifer, boundary, wells, moving_curve, envelope_top_curve, envelope_bottom_curve)
        heading = Text("One boundary wave carries two hydraulic signatures", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Amplitude attenuates; phase accumulates", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(
            scene=self,
            pending_items=frame_items,
            labels=[heading, caption],
            blockers=[content],
            frame_items=frame_items,
            intentional_overlaps=[(content, content)],
        )
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        target_frame = [heading, caption, content, moving_target_curve]
        assert_scene_layout(
            scene=self,
            pending_items=[moving_target_curve],
            labels=[heading, caption],
            blockers=[content, moving_target_curve],
            frame_items=target_frame,
            intentional_overlaps=[(content, content), (content, moving_target_curve)],
        )
        self.play(Transform(moving_curve, moving_target_curve), run_time=4.2, rate_func=lambda x: x)
        self._hold(0.8)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption], blockers=[content], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_02_b02_two_diffusivities(self) -> None:
        left = Circle(radius=1.3, color=TEAL, stroke_width=5).shift(LEFT * 2.7)
        right = Circle(radius=1.3, color=RED, stroke_width=5).shift(RIGHT * 2.7)
        needle_a = Line(LEFT * 2.7, LEFT * 2.05 + UP * 0.7, color=TEAL, stroke_width=6)
        needle_p = Line(RIGHT * 2.7, RIGHT * 3.55 + UP * 0.45, color=RED, stroke_width=6)
        labels = VGroup(
            MathTex(r"D_A", color=TEAL).scale(1.2).move_to(LEFT * 2.7 + DOWN * 1.75),
            MathTex(r"D_\phi", color=RED).scale(1.2).move_to(RIGHT * 2.7 + DOWN * 1.75),
            Text("attenuation", font="Arial", font_size=21, color=TEAL).move_to(LEFT * 2.7 + UP * 1.75),
            Text("phase", font="Arial", font_size=21, color=RED).move_to(RIGHT * 2.7 + UP * 1.75),
        )
        split = VGroup(Arrow(LEFT * 0.45, LEFT * 1.2, color=TEAL), Arrow(RIGHT * 0.45, RIGHT * 1.2, color=RED))
        content = VGroup(left, right, needle_a, needle_p, labels, split)
        heading = Text("Classical diffusion asks both signatures for one D", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The two inversions can disagree", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, labels], blockers=[left, right, needle_a, needle_p, split], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        needle_a_target = needle_a.copy().rotate(-0.35)
        needle_p_target = needle_p.copy().rotate(0.38)
        target_frame = [heading, caption, content, needle_a_target, needle_p_target]
        assert_scene_layout(scene=self, pending_items=[needle_a_target, needle_p_target], labels=[heading, caption, labels], blockers=[left, right, needle_a, needle_p, split, needle_a_target, needle_p_target], frame_items=target_frame, intentional_overlaps=[(content, content), (content, needle_a_target), (content, needle_p_target)])
        self.play(Transform(needle_a, needle_a_target), Transform(needle_p, needle_p_target), run_time=2.2)
        self._hold()
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels], blockers=[left, right, needle_a, needle_p, split], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_03_b03_causal_memory(self) -> None:
        history = VGroup()
        for index in range(9):
            opacity = 0.14 + index * 0.095
            x = -5.0 + index * 0.72
            history.add(Arrow([x, -0.7, 0], [x, 0.75, 0], color=TEAL, stroke_opacity=opacity, buff=0))
        kernel = ParametricFunction(
            lambda u: [-5.15 + 5.05 * u, -1.7 + 2.42 * u * u, 0],
            t_range=[0, 1],
            color=GOLD,
            stroke_width=6,
        )
        present = Arrow([0.45, 0, 0], [3.5, 0, 0], color=RED, stroke_width=8, buff=0)
        clocks = VGroup(
            Circle(radius=0.5, color=TEAL, stroke_width=5).shift(RIGHT * 4.25 + UP * 0.85),
            Circle(radius=0.5, color=RED, stroke_width=5).shift(RIGHT * 4.25 + DOWN * 0.9),
        )
        clock_labels = VGroup(
            MathTex(r"\tau_q", color=TEAL).next_to(clocks[0], RIGHT),
            MathTex(r"\tau_h", color=RED).next_to(clocks[1], RIGHT),
        )
        content = VGroup(history, kernel, present, clocks, clock_labels)
        heading = Text("Lagging is causal memory, not a shifted hydrograph", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Past gradients contribute with decaying weight", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        opening_items = [heading, caption, history, clocks, clock_labels]
        assert_scene_layout(scene=self, pending_items=opening_items, labels=[heading, caption, clock_labels], blockers=[history, clocks], frame_items=opening_items, intentional_overlaps=[(history, history), (clocks, clocks)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(history), FadeIn(clocks), FadeIn(clock_labels), run_time=0.7)
        frame_items = [heading, caption, history, kernel, present, clocks, clock_labels]
        causal_overlaps = [
            (history, history),
            (history, kernel),
            (history, present),
            (kernel, present),
            (clocks, clocks),
        ]
        assert_scene_layout(scene=self, pending_items=[kernel, present], labels=[heading, caption, clock_labels], blockers=[history, kernel, present, clocks], frame_items=frame_items, intentional_overlaps=causal_overlaps)
        self.play(Create(kernel), Create(present), run_time=2.6)
        self._hold()
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, clock_labels], blockers=[history, kernel, present, clocks], frame_items=frame_items, intentional_overlaps=causal_overlaps)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_04_m01_memory_integral(self) -> None:
        history_lines = VGroup()
        for index in range(8):
            x = -4.8 + 0.7 * index
            history_lines.add(Arrow([x, -0.4, 0], [x, 0.65, 0], color=TEAL, stroke_opacity=0.18 + index * 0.1, buff=0))
        flux = Arrow([1.0, 0.1, 0], [4.5, 0.1, 0], color=RED, stroke_width=8, buff=0)
        content = VGroup(history_lines, flux)
        heading = Text("The present flux is assembled from gradient history", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The kernel is causal and integrates to K", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption], blockers=[content], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        formula_lhs = MathTex(r"q(t)", color=RED)
        formula_equals = MathTex(r"=", color=INK)
        formula_rhs = MathTex(r"-\int_0^\infty \kappa(t')\nabla h(t-t')\,dt'", color=TEAL)
        formula = VGroup(formula_lhs, formula_equals, formula_rhs).arrange(RIGHT, buff=0.12).scale(0.88).to_edge(DOWN, buff=0.82)
        formula_frame = [heading, caption, content, formula]
        assert_scene_layout(scene=self, pending_items=[formula], labels=[heading, caption, formula], blockers=[content], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(Write(formula), run_time=2.3)
        self._hold()
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, formula], blockers=[content], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), FadeOut(formula), run_time=0.5)

    def scene_05_m02_two_clock_law(self) -> None:
        classical = VGroup(
            Arrow([-4.8, 0.15, 0], [-2.1, 0.15, 0], color=RED, stroke_width=7, buff=0),
            Arrow([2.1, 0.15, 0], [4.8, 0.15, 0], color=TEAL, stroke_width=7, buff=0),
        )
        clocks = VGroup(
            Circle(radius=0.58, color=TEAL, stroke_width=5).shift(LEFT * 0.85 + UP * 1.1),
            Circle(radius=0.58, color=RED, stroke_width=5).shift(RIGHT * 0.85 + UP * 1.1),
        )
        labels = VGroup(
            MathTex(r"\tau_q", color=TEAL).next_to(clocks[0], DOWN),
            MathTex(r"\tau_h", color=RED).next_to(clocks[1], DOWN),
        )
        content = VGroup(classical, clocks, labels)
        heading = Text("Two clocks compress the memory kernel", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Flux adjustment and head equilibration remain distinct", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, labels], blockers=[classical, clocks], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        clock_q_target = clocks[0].copy().rotate(math.pi)
        clock_h_target = clocks[1].copy().rotate(math.pi * 1.5)
        target_frame = [heading, caption, content, clock_q_target, clock_h_target]
        assert_scene_layout(scene=self, pending_items=[clock_q_target, clock_h_target], labels=[heading, caption, labels], blockers=[classical, clocks, clock_q_target, clock_h_target], frame_items=target_frame, intentional_overlaps=[(content, content), (content, clock_q_target), (content, clock_h_target)])
        self.play(Transform(clocks[0], clock_q_target), Transform(clocks[1], clock_h_target), run_time=1.8)
        formula = MathTex(
            r"q+\tau_q\partial_tq=-K\left(\nabla h+\tau_h\partial_t\nabla h\right)",
            color=INK,
        ).scale(0.9).to_edge(DOWN, buff=0.8)
        formula_frame = [heading, caption, content, formula]
        assert_scene_layout(scene=self, pending_items=[formula], labels=[heading, caption, labels, formula], blockers=[classical, clocks], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(Write(formula), run_time=2.0)
        self._hold(0.8)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels, formula], blockers=[classical, clocks], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), FadeOut(formula), run_time=0.5)

    def scene_06_m03_conservation(self) -> None:
        control = Rectangle(width=5.3, height=2.8, color=TEAL, fill_color=PALE, fill_opacity=0.45, stroke_width=4)
        inflow = Arrow(LEFT * 5.3, LEFT * 2.7, color=TEAL, stroke_width=6)
        outflow = Arrow(RIGHT * 2.7, RIGHT * 5.3, color=TEAL, stroke_width=6)
        storage_field = VGroup()
        for index in range(5):
            storage_field.add(Circle(radius=0.12 + 0.08 * index, color=GOLD, stroke_width=2))
        content = VGroup(control, inflow, outflow, storage_field)
        heading = Text("Mass conservation closes the lagging head equation", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Continuity stays at the present time", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption], blockers=[content], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption], blockers=[content], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(Create(inflow), Create(outflow), Create(storage_field), run_time=2.0)
        formula = MathTex(
            r"\left(1+\tau_q\partial_t\right)\partial_t h"
            r"=D\left(1+\tau_h\partial_t\right)\nabla^2h",
            color=INK,
        ).scale(0.85).to_edge(DOWN, buff=0.75)
        formula_frame = [heading, caption, content, formula]
        assert_scene_layout(scene=self, pending_items=[formula], labels=[heading, caption, formula], blockers=[content], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(Write(formula), run_time=2.0)
        self._hold(0.8)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, formula], blockers=[content], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), FadeOut(formula), run_time=0.5)

    def scene_07_m04_harmonic_wave(self) -> None:
        aquifer = Rectangle(width=11.4, height=3.0, color=TEAL, fill_color=PALE, fill_opacity=0.62, stroke_width=3)
        alpha, beta = normalized_ab(omega_d=1.0, theta=8.0)
        wave_curve_lines = VGroup()
        wave_target_curve = VGroup()
        envelope_curve = VGroup()
        for index in range(80):
            x0 = -5.4 + 10.8 * index / 80
            x1 = -5.4 + 10.8 * (index + 1) / 80
            xd0 = 6.0 * index / 80
            xd1 = 6.0 * (index + 1) / 80
            y0 = 0.78 * math.exp(-alpha * xd0) * math.cos(-beta * xd0)
            y1 = 0.78 * math.exp(-alpha * xd1) * math.cos(-beta * xd1)
            yt0 = 0.78 * math.exp(-alpha * xd0) * math.cos(math.pi - beta * xd0)
            yt1 = 0.78 * math.exp(-alpha * xd1) * math.cos(math.pi - beta * xd1)
            e0 = 0.78 * math.exp(-alpha * xd0)
            e1 = 0.78 * math.exp(-alpha * xd1)
            wave_curve_lines.add(Line([x0, y0, 0], [x1, y1, 0], color=TEAL, stroke_width=6))
            wave_target_curve.add(Line([x0, yt0, 0], [x1, yt1, 0], color=TEAL, stroke_width=6))
            envelope_curve.add(Line([x0, e0, 0], [x1, e1, 0], color=GOLD, stroke_width=3))
        labels = VGroup(
            MathTex(r"\alpha", color=GOLD).move_to(LEFT * 2.6 + UP * 1.95),
            MathTex(r"\beta", color=RED).move_to(RIGHT * 2.4 + DOWN * 1.95),
        )
        content = VGroup(aquifer, wave_curve_lines, envelope_curve, labels)
        heading = Text("A complex wavenumber separates attenuation and phase", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Decay and phase advance are independently visible", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, labels], blockers=[aquifer, wave_curve_lines, envelope_curve], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        target_frame = [heading, caption, content, wave_target_curve]
        assert_scene_layout(scene=self, pending_items=[wave_target_curve], labels=[heading, caption, labels], blockers=[aquifer, wave_curve_lines, envelope_curve, wave_target_curve], frame_items=target_frame, intentional_overlaps=[(content, content), (content, wave_target_curve)])
        self.play(Transform(wave_curve_lines, wave_target_curve), run_time=3.6, rate_func=lambda x: x)
        formula = MathTex(r"h_D=e^{-\alpha x_D}\cos(\omega_Dt_D-\beta x_D)", color=INK).scale(0.9).to_edge(DOWN, buff=0.72)
        formula_frame = [heading, caption, content, formula]
        assert_scene_layout(scene=self, pending_items=[formula], labels=[heading, caption, labels, formula], blockers=[aquifer, wave_curve_lines, envelope_curve], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(Write(formula), run_time=1.6)
        self._hold(0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels, formula], blockers=[aquifer, wave_curve_lines, envelope_curve], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), FadeOut(formula), run_time=0.5)

    def scene_08_m05_mismatch_map(self) -> None:
        grid = VGroup()
        colors = color_gradient([TEAL, PALE, GOLD, RED], 25)
        n = 18
        values = []
        for row in range(n):
            theta = 10 ** (-2 + 4 * row / (n - 1))
            for col in range(n):
                omega_d = 10 ** (-2 + 4 * col / (n - 1))
                alpha, beta = normalized_ab(omega_d=omega_d, theta=theta)
                values.append(math.log10(max(alpha * alpha / (beta * beta), 1e-5)))
        low, high = min(values), max(values)
        index = 0
        for row in range(n):
            for col in range(n):
                normalized = (values[index] - low) / max(high - low, 1e-9)
                color = colors[min(24, int(normalized * 24))]
                square = Square(side_length=0.27, stroke_width=0, fill_color=color, fill_opacity=0.95)
                square.move_to([-2.25 + col * 0.27, -2.1 + row * 0.27, 0])
                grid.add(square)
                index += 1
        unity = DashedLine([-2.2, -1.25, 0], [2.25, 1.0, 0], color=INK, stroke_width=4)
        labels = VGroup(
            MathTex(r"\eta<1", color=TEAL).move_to(LEFT * 4.7 + DOWN * 1.0),
            MathTex(r"\eta=1", color=INK).move_to(RIGHT * 4.2),
            MathTex(r"\eta>1", color=RED).move_to(RIGHT * 4.7 + UP * 1.0),
        )
        ratio = VGroup(
            MathTex(r"\eta=\frac{D_\phi}{D_A}", color=INK),
            MathTex(r"=\frac{\alpha^2}{\beta^2}", color=INK),
        ).arrange(RIGHT, buff=0.12).scale(0.82).to_edge(DOWN, buff=0.68)
        content = VGroup(grid, unity, labels, ratio)
        heading = Text("The mismatch becomes a regime map", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Unity marks classical amplitude-phase agreement", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, labels, ratio], blockers=[grid, unity], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels, ratio], blockers=[grid, unity], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(Create(unity), FadeIn(labels), run_time=2.3)
        self._hold(1.2)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels, ratio], blockers=[grid, unity], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_09_m06_transfer_function(self) -> None:
        time_axes = Axes(
            x_range=[0, 2, 0.5],
            y_range=[-1.1, 1.1, 0.5],
            x_length=5.0,
            y_length=2.5,
            axis_config={"color": MUTED, "include_ticks": False},
        ).shift(LEFT * 3.4 + UP * 0.35)
        boundary_curve = VGroup()
        well_curve = VGroup()
        for index in range(60):
            x0 = 2 * index / 60
            x1 = 2 * (index + 1) / 60
            boundary_curve.add(Line(time_axes.c2p(x0, math.sin(2 * math.pi * x0)), time_axes.c2p(x1, math.sin(2 * math.pi * x1)), color=RED, stroke_width=5))
            well_curve.add(Line(time_axes.c2p(x0, 0.55 * math.sin(2 * math.pi * x0 - 0.75)), time_axes.c2p(x1, 0.55 * math.sin(2 * math.pi * x1 - 0.75)), color=TEAL, stroke_width=5))
        vector = Arrow(RIGHT * 2.0 + DOWN * 0.2, RIGHT * 4.4 + UP * 1.25, color=TEAL, stroke_width=7, buff=0)
        angle = MathTex(r"\phi", color=RED).move_to(RIGHT * 1.35 + UP * 0.25)
        magnitude = MathTex(r"A_h", color=TEAL).next_to(vector, RIGHT)
        content = VGroup(time_axes, boundary_curve, well_curve, vector, angle, magnitude)
        heading = Text("Field records provide one complex transfer function", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Magnitude gives attenuation; argument gives phase", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, angle, magnitude], blockers=[time_axes, boundary_curve, well_curve, vector], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, angle, magnitude], blockers=[time_axes, boundary_curve, well_curve, vector], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(Create(boundary_curve), Create(well_curve), Create(vector), run_time=2.8)
        formula = MathTex(r"H_j(\omega)=\frac{S_{j0}(\omega)}{S_{00}(\omega)}", color=INK).scale(0.95).to_edge(DOWN, buff=0.65)
        formula_frame = [heading, caption, content, formula]
        assert_scene_layout(scene=self, pending_items=[formula], labels=[heading, caption, angle, magnitude, formula], blockers=[time_axes, boundary_curve, well_curve, vector], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(Write(formula), run_time=1.5)
        self._hold(0.8)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, angle, magnitude, formula], blockers=[time_axes, boundary_curve, well_curve, vector], frame_items=formula_frame, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), FadeOut(formula), run_time=0.5)

    def scene_10_m07_field_fit(self) -> None:
        panels = VGroup()
        sites = (
            ("Tuolumne", 2.2e4, 2.28, 0.12, 1.0, 100.0),
            ("Meghna", 8.7e3, 2.07, 38.60, 12.42 / 24, 100.0),
        )
        for name, diffusivity, tau_q, tau_h, period, x_max in sites:
            diffusivity_tex = r"2.2\times10^4" if name == "Tuolumne" else r"8.7\times10^3"
            axes = Axes(
                x_range=[0, x_max, 25],
                y_range=[0, 2.4, 0.5],
                x_length=4.6,
                y_length=3.2,
                axis_config={"color": MUTED, "include_ticks": False, "stroke_width": 2},
            )
            amp, phi = response_curves(
                axes,
                diffusivity=diffusivity,
                tau_q=tau_q,
                tau_h=tau_h,
                period_days=period,
                x_max=x_max,
            )
            site_label = text(name, 24).next_to(axes, DOWN, buff=0.14)
            parameter_label = MathTex(
                rf"D={diffusivity_tex}\ \mathrm{{m^2/d}},\ \tau_q={tau_q:.2f}\,d,\ \tau_h={tau_h:.2f}\,d",
                color=INK,
            ).scale(0.46).next_to(axes, UP, buff=0.14)
            panels.add(VGroup(axes, amp, phi, site_label, parameter_label))
        panels.arrange(RIGHT, buff=1.0).shift(DOWN * 0.1)
        amplitude_key = Line([-2.2, -2.78, 0], [-1.5, -2.78, 0], color=TEAL, stroke_width=5)
        amplitude_key_label = Text("amplitude", font="Arial", font_size=20, color=TEAL).next_to(amplitude_key, RIGHT, buff=0.12)
        phase_key = Line([0.75, -2.78, 0], [1.45, -2.78, 0], color=RED, stroke_width=5)
        phase_key_label = Text("phase", font="Arial", font_size=20, color=RED).next_to(phase_key, RIGHT, buff=0.12)
        content = VGroup(panels, amplitude_key, amplitude_key_label, phase_key, phase_key_label)
        heading = Text("One parameter set fits both signatures at each site", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Analytical curves use the reported fitted parameters", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, amplitude_key_label, phase_key_label], blockers=[panels, amplitude_key, phase_key], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, amplitude_key_label, phase_key_label], blockers=[panels, amplitude_key, phase_key], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(Create(panels[0][1]), Create(panels[0][2]), Create(panels[1][1]), Create(panels[1][2]), run_time=3.0)
        self._hold(1.0)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, amplitude_key_label, phase_key_label], blockers=[panels, amplitude_key, phase_key], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_11_m08_aic(self) -> None:
        baseline = Line([-5.0, 0, 0], [5.0, 0, 0], color=MUTED, stroke_width=3)
        records = (
            ("Tuolumne", 2.28, -5.47, -1.8),
            ("Meghna", -29.90, -34.74, 1.25),
        )
        groups = VGroup()
        for name, classical, lagging, y in records:
            x_classic = -3.5 + 6.5 * (classical + 35) / 38
            x_lag = -3.5 + 6.5 * (lagging + 35) / 38
            row = VGroup(
                Text(name, font="Arial", font_size=22, color=INK).move_to([-5.0, y, 0]),
                Dot([x_classic, y, 0], radius=0.12, color=MUTED),
                Dot([x_lag, y, 0], radius=0.14, color=TEAL),
                DashedLine([x_classic, y, 0], [x_lag, y, 0], color=GOLD, stroke_width=3),
                MathTex(r"\Delta AIC", color=GOLD).scale(0.7).move_to([(x_classic + x_lag) / 2, y + 0.35, 0]),
            )
            groups.add(row)
        direction_arrow = Arrow(RIGHT * 3.9 + DOWN * 2.1, LEFT * 3.2 + DOWN * 2.1, color=TEAL)
        direction_label = Text("lower is preferred", font="Arial", font_size=20, color=TEAL).shift(DOWN * 2.55)
        classical_dot = Dot([-1.5, 2.15, 0], color=MUTED)
        classical_label = Text("classical", font="Arial", font_size=19, color=MUTED).next_to(classical_dot, RIGHT, buff=0.12)
        lagging_dot = Dot([1.1, 2.15, 0], color=TEAL)
        lagging_label = Text("lagging", font="Arial", font_size=19, color=TEAL).next_to(lagging_dot, RIGHT, buff=0.12)
        content = VGroup(baseline, groups, direction_arrow, direction_label, classical_dot, classical_label, lagging_dot, lagging_label)
        heading = Text("Two extra lags must earn their complexity", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("AIC balances residual reduction against parameter count", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, direction_label, classical_label, lagging_label], blockers=[baseline, groups, direction_arrow, classical_dot, lagging_dot], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, direction_label, classical_label, lagging_label], blockers=[baseline, groups, direction_arrow, classical_dot, lagging_dot], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(Create(groups), Create(direction_arrow), run_time=2.8)
        self._hold(1.1)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, direction_label, classical_label, lagging_label], blockers=[baseline, groups, direction_arrow, classical_dot, lagging_dot], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_12_m09_sample_data(self) -> None:
        rng = np.random.default_rng(2026)
        axes = Axes(
            x_range=[0, 1.0, 0.2],
            y_range=[0, 1.0, 0.2],
            x_length=6.0,
            y_length=4.2,
            axis_config={"color": MUTED, "include_ticks": False},
        )
        centers = [(0.28, 0.72), (0.52, 0.54), (0.75, 0.31)]
        samples = VGroup()
        for cx, cy in centers:
            for _ in range(32):
                x, y = rng.normal([cx, cy], [0.035, 0.055])
                samples.add(Dot(axes.c2p(float(x), float(y)), radius=0.035, color=GOLD, fill_opacity=0.45))
            samples.add(Dot(axes.c2p(cx, cy), radius=0.09, color=INK))
        labels = VGroup(
            Text("amplitude", font="Arial", font_size=20, color=TEAL).next_to(axes, RIGHT),
            Text("phase", font="Arial", font_size=20, color=RED).next_to(axes, UP),
            Text("5,000 Gaussian realizations", font="Arial", font_size=24, color=GOLD).to_edge(DOWN, buff=0.65),
        )
        content = VGroup(axes, samples, labels)
        heading = Text("Measurement errors generate plausible data sets", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The animation shows a representative subset of 5,000 draws", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, labels], blockers=[axes, samples], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels], blockers=[axes, samples], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(samples, lag_ratio=0.02), run_time=3.2)
        self._hold(0.9)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels], blockers=[axes, samples], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_13_m10_refit(self) -> None:
        rng = np.random.default_rng(2013)
        left_axes = Axes(
            x_range=[0, 1, 0.2],
            y_range=[0, 1, 0.2],
            x_length=4.0,
            y_length=3.3,
            axis_config={"color": MUTED, "include_ticks": False},
        ).shift(LEFT * 3.5)
        right_axes = Axes(
            x_range=[-1, 1, 0.5],
            y_range=[-1, 1, 0.5],
            x_length=4.0,
            y_length=3.3,
            axis_config={"color": MUTED, "include_ticks": False},
        ).shift(RIGHT * 3.5)
        data_points = VGroup()
        parameter_points = VGroup()
        for x, y in rng.normal([0.5, 0.5], [0.15, 0.13], size=(32, 2)):
            data_points.add(Dot(left_axes.c2p(float(x), float(y)), radius=0.05, color=GOLD))
        for x, y in rng.normal([0.0, 0.0], [0.32, 0.22], size=(32, 2)):
            parameter_points.add(Dot(right_axes.c2p(float(x), float(y)), radius=0.05, color=TEAL))
        bridge = Arrow(LEFT * 1.0, RIGHT * 1.0, color=RED, stroke_width=6)
        labels = VGroup(
            Text("amplitude-phase data", font="Arial", font_size=20, color=INK).next_to(left_axes, DOWN),
            Text("hydraulic parameters", font="Arial", font_size=20, color=INK).next_to(right_axes, DOWN),
        )
        opening_content = VGroup(left_axes, right_axes, data_points, labels)
        content = VGroup(left_axes, right_axes, data_points, parameter_points, bridge, labels)
        heading = Text("Every realization passes through the same inversion", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Repeated fits propagate data error into parameter space", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        opening_frame = [heading, caption, opening_content]
        assert_scene_layout(scene=self, pending_items=opening_frame, labels=[heading, caption, labels], blockers=[left_axes, right_axes, data_points], frame_items=opening_frame, intentional_overlaps=[(opening_content, opening_content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(opening_content), run_time=0.7)
        frame_items = [heading, caption, opening_content, content]
        assert_scene_layout(scene=self, pending_items=[bridge, parameter_points], labels=[heading, caption, labels], blockers=[left_axes, right_axes, data_points, bridge, parameter_points], frame_items=frame_items, intentional_overlaps=[(opening_content, opening_content), (content, content), (opening_content, content)])
        self.play(Create(bridge), ReplacementTransform(data_points.copy(), parameter_points), run_time=3.0)
        self._hold(1.0)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels], blockers=[left_axes, right_axes, data_points, bridge, parameter_points], frame_items=frame_items, intentional_overlaps=[(opening_content, opening_content), (content, content), (opening_content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_14_m11_filter(self) -> None:
        rng = np.random.default_rng(2014)
        core = rng.normal(0, 0.55, 72)
        outliers = np.array([-2.9, -2.4, 2.5, 3.0])
        values = np.concatenate([core, outliers])
        point_cloud = VGroup()
        for value in values:
            point_cloud.add(Dot([float(value), float(rng.uniform(-0.75, 0.75)), 0], radius=0.055, color=TEAL if abs(value) < 1.6 else RED))
        left_fence = DashedLine([-1.6, -1.35, 0], [-1.6, 1.35, 0], color=GOLD, stroke_width=4)
        right_fence = DashedLine([1.6, -1.35, 0], [1.6, 1.35, 0], color=GOLD, stroke_width=4)
        labels = VGroup(Text("interquartile filter", font="Arial", font_size=23, color=GOLD).shift(UP * 1.8), Text("aberrant refits", font="Arial", font_size=20, color=RED).shift(DOWN * 1.8))
        content = VGroup(point_cloud, left_fence, right_fence, labels)
        heading = Text("Aberrant refits are filtered before summary", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Accepted and excluded estimates remain visually distinct", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, labels], blockers=[point_cloud, left_fence, right_fence], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        faded_point_cloud = point_cloud.copy().set_opacity(0.78)
        target_frame = [heading, caption, content, faded_point_cloud]
        assert_scene_layout(scene=self, pending_items=[faded_point_cloud], labels=[heading, caption, labels], blockers=[point_cloud, left_fence, right_fence, faded_point_cloud], frame_items=target_frame, intentional_overlaps=[(content, content), (content, faded_point_cloud), (faded_point_cloud, faded_point_cloud)])
        self.play(Create(left_fence), Create(right_fence), Transform(point_cloud, faded_point_cloud), run_time=2.5)
        self._hold(1.1)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, labels], blockers=[point_cloud, left_fence, right_fence], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_15_m12_intervals(self) -> None:
        d_line = Line([-3.6, 0, 0], [-1.8, 0, 0], color=GOLD, stroke_width=8)
        d_mean = Dot([-2.7, 0, 0], radius=0.13, color=TEAL)
        d_label = MathTex("D", color=INK).scale(1.0).move_to([-2.7, -0.72, 0])
        d_interval = VGroup(d_line, d_mean, d_label)
        q_line = Line([-0.525, 0, 0], [0.525, 0, 0], color=GOLD, stroke_width=8)
        q_mean = Dot([0, 0, 0], radius=0.13, color=TEAL)
        q_label = MathTex(r"\tau_q", color=INK).scale(1.0).move_to([0, -0.72, 0])
        q_interval = VGroup(q_line, q_mean, q_label)
        h_line = Line([1.625, 0, 0], [3.775, 0, 0], color=GOLD, stroke_width=8)
        h_mean = Dot([2.7, 0, 0], radius=0.13, color=TEAL)
        h_label = MathTex(r"\tau_h", color=INK).scale(1.0).move_to([2.7, -0.72, 0])
        h_interval = VGroup(h_line, h_mean, h_label)
        rows = VGroup(d_interval, q_interval, h_interval)
        sigma = MathTex(r"\mu\pm1\sigma", color=INK).scale(1.2).shift(UP * 1.55)
        content = VGroup(rows, sigma)
        heading = Text("Accepted estimates become means and widths", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Reported intervals preserve measurement-driven uncertainty", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, d_label, q_label, h_label, sigma], blockers=[d_line, d_mean, q_line, q_mean, h_line, h_mean], frame_items=frame_items, intentional_overlaps=[(rows, rows)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, d_label, q_label, h_label, sigma], blockers=[d_line, d_mean, q_line, q_mean, h_line, h_mean], frame_items=frame_items, intentional_overlaps=[(rows, rows)])
        self.play(Create(rows), Write(sigma), run_time=2.5)
        self._hold(1.2)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, d_label, q_label, h_label, sigma], blockers=[d_line, d_mean, q_line, q_mean, h_line, h_mean], frame_items=frame_items, intentional_overlaps=[(rows, rows)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_16_m13_numerical_check(self) -> None:
        theta = 10.0
        omega_d = 1.0
        alpha, beta = normalized_ab(omega_d=omega_d, theta=theta)
        length = 8.0
        nodes = 180
        dx = length / (nodes - 1)
        lam = complex(-alpha, beta)
        matrix = np.zeros((nodes, nodes), dtype=np.complex128)
        rhs = np.zeros(nodes, dtype=np.complex128)
        matrix[0, 0] = 1
        rhs[0] = 1
        for index in range(1, nodes - 1):
            matrix[index, index - 1] = 1 / dx**2
            matrix[index, index] = -2 / dx**2 - lam**2
            matrix[index, index + 1] = 1 / dx**2
        matrix[-1, -2] = -1 / dx
        matrix[-1, -1] = 1 / dx - lam
        numerical = np.linalg.solve(matrix, rhs)
        xs = np.linspace(0, length, nodes)
        analytical = np.exp(lam * xs)
        axes = Axes(
            x_range=[0, length, 2],
            y_range=[0, 1.05, 0.25],
            x_length=8.2,
            y_length=3.5,
            axis_config={"color": MUTED, "include_ticks": False},
        )
        analytic_curve = VGroup()
        numeric_curve = VGroup()
        for index in range(nodes - 1):
            analytic_curve.add(Line(axes.c2p(float(xs[index]), float(abs(analytical[index]))), axes.c2p(float(xs[index + 1]), float(abs(analytical[index + 1]))), color=TEAL, stroke_width=6))
        sampled_indices = list(range(0, nodes, 8))
        for index in range(len(sampled_indices) - 1):
            left_index = sampled_indices[index]
            right_index = sampled_indices[index + 1]
            numeric_curve.add(Line(axes.c2p(float(xs[left_index]), float(abs(numerical[left_index]))), axes.c2p(float(xs[right_index]), float(abs(numerical[right_index]))), color=RED, stroke_width=2))
            numeric_curve.add(Dot(axes.c2p(float(xs[left_index]), float(abs(numerical[left_index]))), radius=0.055, color=RED))
        closed_form_key = Line([-2.7, -2.78, 0], [-2.1, -2.78, 0], color=TEAL, stroke_width=6)
        closed_form_label = Text("closed form", font="Arial", font_size=19, color=TEAL).next_to(closed_form_key, RIGHT, buff=0.12)
        finite_difference_key = DashedLine([0.5, -2.78, 0], [1.1, -2.78, 0], color=RED, stroke_width=3)
        finite_difference_label = Text("finite difference", font="Arial", font_size=19, color=RED).next_to(finite_difference_key, RIGHT, buff=0.12)
        content = VGroup(axes, analytic_curve, numeric_curve, closed_form_key, closed_form_label, finite_difference_key, finite_difference_label)
        heading = Text("The analytical response is checked numerically", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Second-order frequency-domain solution; Appendix A", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        frame_items = [heading, caption, content]
        assert_scene_layout(scene=self, pending_items=frame_items, labels=[heading, caption, closed_form_label, finite_difference_label], blockers=[axes, analytic_curve, numeric_curve, closed_form_key, finite_difference_key], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(content), run_time=0.7)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, closed_form_label, finite_difference_label], blockers=[axes, analytic_curve, numeric_curve, closed_form_key, finite_difference_key], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(Create(analytic_curve), Create(numeric_curve), run_time=3.2)
        self._hold(1.0)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, closed_form_label, finite_difference_label], blockers=[axes, analytic_curve, numeric_curve, closed_form_key, finite_difference_key], frame_items=frame_items, intentional_overlaps=[(content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_17_m14_sensitivity(self) -> None:
        amplitude_axes = Axes(
            x_range=[-2, 2, 1],
            y_range=[0, 1.0, 0.25],
            x_length=5.1,
            y_length=3.45,
            axis_config={"color": MUTED, "include_ticks": False},
        ).shift(LEFT * 3.0)
        phase_axes = Axes(
            x_range=[-2, 2, 1],
            y_range=[0, 5600, 1400],
            x_length=5.1,
            y_length=3.45,
            axis_config={"color": MUTED, "include_ticks": False},
        ).shift(RIGHT * 3.0)
        x_control = np.array([-2.0, -1.5, -1.0, -0.7, -0.3, 0.0, 0.3, 0.55, 0.8, 1.0, 1.4, 2.0])
        amplitude_theta = np.array([0.14, 0.38, 0.63, 0.70, 0.62, 0.45, 0.20, 0.06, 0.02, 0.02, 0.08, 0.00])
        amplitude_omega = np.array([0.14, 0.34, 0.50, 0.53, 0.56, 0.66, 0.77, 0.68, 0.44, 0.23, 0.05, 0.00])
        phase_theta = np.array([0, 1, 3, 5, 10, 18, 35, 65, 115, 210, 720, 5500])
        phase_omega = np.array([0, 1, 2, 4, 8, 14, 28, 50, 90, 165, 560, 3800])

        dense_x = np.linspace(float(x_control.min()), float(x_control.max()), 160)
        dense_amp_theta = np.interp(dense_x, x_control, amplitude_theta)
        dense_amp_omega = np.interp(dense_x, x_control, amplitude_omega)
        dense_phase_theta = np.interp(dense_x, x_control, phase_theta)
        dense_phase_omega = np.interp(dense_x, x_control, phase_omega)
        amp_theta_curve = VGroup()
        amp_omega_curve = VGroup()
        phase_theta_curve = VGroup()
        phase_omega_curve = VGroup()
        for index in range(len(dense_x) - 1):
            amp_theta_curve.add(Line(amplitude_axes.c2p(float(dense_x[index]), float(dense_amp_theta[index])), amplitude_axes.c2p(float(dense_x[index + 1]), float(dense_amp_theta[index + 1])), color=TEAL, stroke_width=5))
            amp_omega_curve.add(Line(amplitude_axes.c2p(float(dense_x[index]), float(dense_amp_omega[index])), amplitude_axes.c2p(float(dense_x[index + 1]), float(dense_amp_omega[index + 1])), color=RED, stroke_width=5))
            phase_theta_curve.add(Line(phase_axes.c2p(float(dense_x[index]), float(dense_phase_theta[index])), phase_axes.c2p(float(dense_x[index + 1]), float(dense_phase_theta[index + 1])), color=TEAL, stroke_width=5))
            phase_omega_curve.add(Line(phase_axes.c2p(float(dense_x[index]), float(dense_phase_omega[index])), phase_axes.c2p(float(dense_x[index + 1]), float(dense_phase_omega[index + 1])), color=RED, stroke_width=5))
        panel_titles = VGroup(
            Text("Amplitude sensitivity", font="Arial", font_size=22, color=INK).next_to(amplitude_axes, UP, buff=0.12),
            Text("Phase-shift sensitivity", font="Arial", font_size=22, color=INK).next_to(phase_axes, UP, buff=0.12),
        )
        distance_labels = VGroup(
            MathTex(r"10^{-2}", color=MUTED).scale(0.55).move_to([-5.55, -2.15, 0]),
            MathTex(r"10^{0}", color=MUTED).scale(0.55).move_to([-3.0, -2.15, 0]),
            MathTex(r"10^{2}", color=MUTED).scale(0.55).move_to([-0.45, -2.15, 0]),
            MathTex(r"10^{-2}", color=MUTED).scale(0.55).move_to([0.45, -2.15, 0]),
            MathTex(r"10^{0}", color=MUTED).scale(0.55).move_to([3.0, -2.15, 0]),
            MathTex(r"10^{2}", color=MUTED).scale(0.55).move_to([5.55, -2.15, 0]),
        )
        theta_key = Line([-2.7, -2.78, 0], [-2.1, -2.78, 0], color=TEAL, stroke_width=5)
        theta_key_label = MathTex(r"\theta=\tau_h/\tau_q", color=TEAL).scale(0.7).next_to(theta_key, RIGHT, buff=0.14)
        omega_key = Line([1.0, -2.78, 0], [1.6, -2.78, 0], color=RED, stroke_width=5)
        omega_key_label = MathTex(r"\omega_D", color=RED).scale(0.7).next_to(omega_key, RIGHT, buff=0.14)
        opening_content = VGroup(
            amplitude_axes,
            phase_axes,
            panel_titles,
            distance_labels,
            theta_key,
            theta_key_label,
            omega_key,
            omega_key_label,
        )
        content = VGroup(
            amplitude_axes,
            phase_axes,
            panel_titles,
            distance_labels,
            amp_theta_curve,
            amp_omega_curve,
            phase_theta_curve,
            phase_omega_curve,
            theta_key,
            theta_key_label,
            omega_key,
            omega_key_label,
        )
        heading = Text("Information changes with frequency and distance", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Morris sensitivity reconstructed from Figure 6", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        opening_frame = [heading, caption, opening_content]
        assert_scene_layout(scene=self, pending_items=opening_frame, labels=[heading, caption, panel_titles, distance_labels, theta_key_label, omega_key_label], blockers=[amplitude_axes, phase_axes, theta_key, omega_key], frame_items=opening_frame, intentional_overlaps=[(opening_content, opening_content)])
        self.play(FadeIn(heading), FadeIn(caption), FadeIn(opening_content), run_time=0.7)
        frame_items = [heading, caption, opening_content, content]
        assert_scene_layout(scene=self, pending_items=[amp_theta_curve, amp_omega_curve, phase_theta_curve, phase_omega_curve], labels=[heading, caption, panel_titles, distance_labels, theta_key_label, omega_key_label], blockers=[amplitude_axes, phase_axes, theta_key, omega_key, amp_theta_curve, amp_omega_curve, phase_theta_curve, phase_omega_curve], frame_items=frame_items, intentional_overlaps=[(opening_content, opening_content), (content, content), (opening_content, content)])
        self.play(
            Create(amp_theta_curve),
            Create(amp_omega_curve),
            Create(phase_theta_curve),
            Create(phase_omega_curve),
            run_time=3.0,
        )
        self._hold(1.0)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, panel_titles, distance_labels, theta_key_label, omega_key_label], blockers=[amplitude_axes, phase_axes, theta_key, omega_key, amp_theta_curve, amp_omega_curve, phase_theta_curve, phase_omega_curve], frame_items=frame_items, intentional_overlaps=[(opening_content, opening_content), (content, content), (opening_content, content)])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(content), run_time=0.5)

    def scene_18_return(self) -> None:
        left_anchor = LEFT * 3.0
        right_anchor = RIGHT * 3.0
        divider = Line([0, -1.75, 0], [0, 1.75, 0], color=MUTED, stroke_width=2)
        tuolumne = VGroup(
            Text("Tuolumne Meadows", font="Arial", font_size=24, color=TEAL),
            MathTex(r"D=2.2\times10^4\ \mathrm{m^2/d}", color=INK).scale(0.72),
            VGroup(
                MathTex(r"\tau_q=2.28\ d", color=TEAL),
                MathTex(r">\tau_h=0.12\ d", color=TEAL),
            ).arrange(RIGHT, buff=0.24).scale(0.68),
            MathTex(r"AIC:-5.47<2.28", color=GOLD).scale(0.72),
        ).arrange(DOWN, buff=0.25).move_to(left_anchor)
        meghna = VGroup(
            Text("Meghna River", font="Arial", font_size=24, color=RED),
            MathTex(r"D=8.7\times10^3\ \mathrm{m^2/d}", color=INK).scale(0.72),
            VGroup(
                MathTex(r"\tau_h=38.60\ d", color=RED),
                MathTex(r">\tau_q=2.07\ d", color=RED),
            ).arrange(RIGHT, buff=0.24).scale(0.68),
            MathTex(r"AIC:-34.74<-29.90", color=GOLD).scale(0.72),
        ).arrange(DOWN, buff=0.25).move_to(right_anchor)
        boundary_note_1 = Text("Field-scale effective parameters", font="Arial", font_size=21, color=MUTED)
        boundary_note_2 = Text("No unique microscopic mechanism is claimed", font="Arial", font_size=21, color=MUTED)
        boundary = VGroup(boundary_note_1, boundary_note_2).arrange(DOWN, buff=0.08).to_edge(DOWN, buff=0.78)
        content = VGroup(divider, tuolumne, meghna, boundary)
        heading = Text("The same law resolves two different lag regimes", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Use lagging when both signatures and model selection support it", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.28)
        opening_frame = [heading, caption, divider, boundary]
        assert_scene_layout(scene=self, pending_items=opening_frame, labels=[heading, caption, boundary], blockers=[divider], frame_items=opening_frame, intentional_overlaps=[])
        self.play(FadeIn(heading), FadeIn(caption), Create(divider), FadeIn(boundary), run_time=0.7)
        tuolumne.move_to(left_anchor)
        meghna.move_to(right_anchor)
        frame_items = [heading, caption, divider, boundary, tuolumne, meghna]
        assert_scene_layout(scene=self, pending_items=[tuolumne, meghna], labels=[heading, caption, boundary, tuolumne, meghna], blockers=[divider], frame_items=frame_items, intentional_overlaps=[])
        self.play(FadeIn(tuolumne), FadeIn(meghna), run_time=2.5)
        self._hold(2.2)
        assert_scene_layout(scene=self, pending_items=[], labels=[heading, caption, boundary, tuolumne, meghna], blockers=[divider], frame_items=frame_items, intentional_overlaps=[])
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(divider), FadeOut(boundary), FadeOut(tuolumne), FadeOut(meghna), run_time=0.5)
