# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
from __future__ import annotations

import sys
from pathlib import Path
from typing import Final

from manim import (
    DOWN, LEFT, ORIGIN, RIGHT, UP, Arrow, Axes, Circle, Create, CubicBezier, DashedLine,
    Dot, FadeIn, FadeOut, LaggedStart, Line, MathTex, Rectangle, Scene, Text,
    VGroup, VMobject,
    Write, config,
)

SKILL_ROOT: Final = Path.home() / ".codex/skills/research-manim-video-summarizer"
sys.path.insert(0, str(SKILL_ROOT))
from assets.research_manim_layout import assert_inside, assert_scene_layout  # noqa: E402

INK: Final = "#112D32"
TEAL: Final = "#087F8C"
MUTED: Final = "#566D70"
RED: Final = "#B64A35"
GOLD: Final = "#B77A1F"
PAPER: Final = "#F6F8F5"
PALE: Final = "#D7ECE8"
config.background_color = PAPER
class LinEtAl2019V2(Scene):
    def construct(self) -> None:
        self.scene_01_b01_s_curve()
        self.scene_02_b02_capillary_fringe()
        self.scene_03_b03_specific_yield()
        self.scene_04_m01_flow_equation()
        self.scene_05_m02_wellbore_storage()
        self.scene_06_m03_two_lag_boundary()
        self.scene_07_m04_taylor_expansion()
        self.scene_08_m05_free_surface_equation()
        self.scene_09_m06_dimensionless_system()
        self.scene_10_m07_laplace_transform()
        self.scene_11_m08_weber_transform()
        self.scene_12_m09_inverse_weber()
        self.scene_13_m10_inverse_laplace()
        self.scene_14_m11_sensitivity()
        self.scene_15_m12_cape_cod()
        self.scene_16_m13_borden()
        self.scene_17_m14_saint_pardon()
        self.scene_18_return_field_evidence()

    def scene_01_b01_s_curve(self) -> None:
        self.clear()
        heading = Text("One pumping test can reveal three storage regimes", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Unconfined-aquifer drawdown: early, intermediate, and late time", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.1, 0.2], x_length=7.6, y_length=3.8, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 1.15 + DOWN * 0.15)
        curve = axes.plot(
            lambda x: 0.08 + 0.34 * (1 - 2.71828 ** (-1.7 * x)) + 0.42 / (1 + 2.71828 ** (-2.1 * (x - 4.25))),
            x_range=[0.05, 5.8], color=TEAL, stroke_width=6,
        )
        labels = VGroup(
            Text("aquifer storage", font="Arial", font_size=20, color=RED).move_to(RIGHT * 4.65 + UP * 1.25),
            Text("gravity drainage", font="Arial", font_size=20, color=GOLD).move_to(RIGHT * 4.65),
            Text("combined release", font="Arial", font_size=20, color=TEAL).move_to(RIGHT * 4.65 + DOWN * 1.25),
        )
        geometry = VGroup(axes, curve, labels)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, labels], blockers=[axes, curve], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(axes), Create(curve), FadeIn(labels), lag_ratio=0.34), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_02_b02_capillary_fringe(self) -> None:
        self.clear()
        heading = Text("The water table falls before all pore water drains", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Capillary force retains water above the falling water table", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        aquifer = Rectangle(width=11.2, height=3.0, color=TEAL, fill_color=PALE, fill_opacity=0.85, stroke_width=3).shift(DOWN * 0.4)
        fringe = Rectangle(width=10.8, height=0.72, color=GOLD, fill_color=GOLD, fill_opacity=0.14, stroke_width=2).shift(UP * 0.66)
        water_table = VGroup(
            Line([-5.6, 0.35, 0], [-2.5, 0.25, 0], color=TEAL, stroke_width=6),
            Line([-2.5, 0.25, 0], [0, -0.28, 0], color=TEAL, stroke_width=6),
            Line([0, -0.28, 0], [2.5, 0.25, 0], color=TEAL, stroke_width=6),
            Line([2.5, 0.25, 0], [5.6, 0.35, 0], color=TEAL, stroke_width=6),
        )
        droplets = VGroup(
            Dot([-3.8, 0.68, 0], radius=0.07, color=GOLD), Dot([-2.5, 0.58, 0], radius=0.07, color=GOLD),
            Dot([-1.2, 0.45, 0], radius=0.07, color=GOLD), Dot([0, 0.32, 0], radius=0.07, color=GOLD),
            Dot([1.2, 0.45, 0], radius=0.07, color=GOLD), Dot([2.5, 0.58, 0], radius=0.07, color=GOLD),
            Dot([3.8, 0.68, 0], radius=0.07, color=GOLD),
        )
        arrows = VGroup(
            Arrow([-2.5, 0.95, 0], [-2.5, 0.25, 0], buff=0.02, color=GOLD, stroke_width=4),
            Arrow([0, 0.95, 0], [0, 0.25, 0], buff=0.02, color=GOLD, stroke_width=4),
            Arrow([2.5, 0.95, 0], [2.5, 0.25, 0], buff=0.02, color=GOLD, stroke_width=4),
        )
        geometry = VGroup(aquifer, fringe, water_table, droplets, arrows)
        assert_inside(aquifer, [fringe], min_gap=0.04)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note], blockers=[geometry], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(FadeIn(aquifer), FadeIn(fringe), Create(water_table), FadeIn(droplets), Create(arrows), lag_ratio=0.22), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_03_b03_specific_yield(self) -> None:
        self.clear()
        heading = Text("Instantaneous drainage can distort specific yield", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Delayed drainage changes the inferred drainable storage", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.1, 0.2], x_length=7.0, y_length=3.6, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 1.65 + DOWN * 0.1)
        delayed = axes.plot(lambda x: 0.08 + 0.32 * (1 - 2.71828 ** (-1.6 * x)) + 0.38 / (1 + 2.71828 ** (-2 * (x - 4.2))), x_range=[0.05, 5.8], color=TEAL, stroke_width=6)
        instant = axes.plot(lambda x: 0.08 + 0.73 * (1 - 2.71828 ** (-0.55 * x)), x_range=[0.05, 5.8], color=MUTED, stroke_width=3)
        sy = VGroup(MathTex(r"S_y", color=GOLD).scale(1.25), Text("must be interpreted", font="Arial", font_size=24, color=INK)).arrange(DOWN, buff=0.18).shift(RIGHT * 4.6 + UP * 1.55)
        swatches = VGroup(
            Line([3.35, 0.15, 0], [3.95, 0.15, 0], color=TEAL, stroke_width=6),
            Line([3.35, -0.85, 0], [3.95, -0.85, 0], color=MUTED, stroke_width=3),
        )
        legend_labels = VGroup(
            Text("delayed", font="Arial", font_size=20, color=TEAL).move_to([4.75, 0.15, 0]),
            Text("instantaneous", font="Arial", font_size=20, color=MUTED).move_to([5.05, -0.85, 0]),
        )
        geometry = VGroup(axes, delayed, instant, sy, swatches, legend_labels)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, sy, legend_labels], blockers=[axes, delayed, instant, swatches], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(axes), Create(instant), Create(delayed), FadeIn(sy), Create(swatches), FadeIn(legend_labels), lag_ratio=0.22), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_04_m01_flow_equation(self) -> None:
        self.clear()
        heading = Text("Begin with axisymmetric radial-vertical flow", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Homogeneous anisotropic aquifer; radial symmetry around the pumping well", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        domain = Rectangle(width=10.8, height=3.0, color=TEAL, fill_color=PALE, fill_opacity=0.75, stroke_width=3).shift(UP * 0.35)
        well = Rectangle(width=0.22, height=3.3, color=RED, fill_color=RED, fill_opacity=1, stroke_width=3).shift(LEFT * 4.2 + UP * 0.4)
        radial = Arrow(LEFT * 3.9, RIGHT * 2.8, buff=0.1, color=TEAL, stroke_width=5)
        vertical = Arrow(LEFT * 4.2 + DOWN * 1.0, LEFT * 4.2 + UP * 1.75, buff=0.1, color=GOLD, stroke_width=5)
        formula = MathTex(r"K_r(\partial_{rr}s+r^{-1}\partial_rs)+K_z\partial_{zz}s=S_s\partial_ts", color=INK).scale(0.82).to_edge(DOWN, buff=0.82)
        geometry = VGroup(domain, well, radial, vertical, formula)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, formula], blockers=[domain, well, radial, vertical], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(FadeIn(domain), FadeIn(well), Create(radial), Create(vertical), Write(formula), lag_ratio=0.24), run_time=4.6)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_05_m02_wellbore_storage(self) -> None:
        self.clear()
        heading = Text("Partition pumping between aquifer inflow and casing storage", font="Arial", font_size=34, color=INK).to_edge(UP, buff=0.42)
        note = Text("Finite well radius, partial penetration, and casing storage", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        well = Rectangle(width=1.15, height=4.1, color=RED, fill_color=PAPER, fill_opacity=1, stroke_width=5)
        water = Rectangle(width=0.9, height=2.25, color=TEAL, fill_color=PALE, fill_opacity=1, stroke_width=2).shift(DOWN * 0.72)
        inflow = VGroup(Arrow(LEFT * 4.8, LEFT * 0.65, buff=0.1, color=TEAL, stroke_width=6), Arrow(RIGHT * 4.8, RIGHT * 0.65, buff=0.1, color=TEAL, stroke_width=6))
        level_arrow = Arrow(UP * 1.45, DOWN * 0.15, buff=0.05, color=GOLD, stroke_width=5).shift(RIGHT * 1.2)
        formula = VGroup(MathTex(r"Q", color=RED), MathTex(r"=", color=INK), MathTex(r"Q_{aquifer}", color=TEAL), MathTex(r"+", color=INK), MathTex(r"\pi r_c^2\partial_t H", color=GOLD)).arrange(RIGHT, buff=0.18).scale(0.9).to_edge(DOWN, buff=1.05)
        geometry = VGroup(well, water, inflow, level_arrow, formula)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, formula], blockers=[well, water, inflow, level_arrow], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(well), FadeIn(water), Create(inflow), Create(level_arrow), Write(formula), lag_ratio=0.23), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_06_m03_two_lag_boundary(self) -> None:
        self.clear()
        heading = Text("Give vertical flux and drawdown separate response times", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Equation 7b applies Lagging Theory at the free surface", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        table = VGroup(
            Line([-5.2, 0.1, 0], [-2.4, 0.05, 0], color=TEAL, stroke_width=6),
            Line([-2.4, 0.05, 0], [0, -0.38, 0], color=TEAL, stroke_width=6),
            Line([0, -0.38, 0], [2.4, 0.05, 0], color=TEAL, stroke_width=6),
            Line([2.4, 0.05, 0], [5.2, 0.1, 0], color=TEAL, stroke_width=6),
        )
        flux_clock = VGroup(Circle(radius=0.48, color=TEAL, stroke_width=5), Line(ORIGIN, RIGHT * 0.26 + UP * 0.16, color=TEAL, stroke_width=4)).shift(LEFT * 3.0 + UP * 1.55)
        storage_clock = VGroup(Circle(radius=0.48, color=RED, stroke_width=5), Line(ORIGIN, UP * 0.31, color=RED, stroke_width=4)).shift(RIGHT * 3.0 + UP * 1.55)
        clock_labels = VGroup(MathTex(r"\tau_q", color=TEAL).next_to(flux_clock, DOWN), MathTex(r"\tau_s", color=RED).next_to(storage_clock, DOWN))
        formula = VGroup(MathTex(r"q_z(t+\tau_q)", color=TEAL), MathTex(r"=", color=INK), MathTex(r"-K_z\partial_zs(t+\tau_s)", color=RED)).arrange(RIGHT, buff=0.2).scale(0.92).to_edge(DOWN, buff=0.82)
        geometry = VGroup(table, flux_clock, storage_clock, clock_labels, formula)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, clock_labels, formula], blockers=[table, flux_clock, storage_clock], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(table), Create(flux_clock), Create(storage_clock), FadeIn(clock_labels), Write(formula), lag_ratio=0.22), run_time=4.6)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_07_m04_taylor_expansion(self) -> None:
        self.clear()
        heading = Text("Linearize the two time shifts", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("The paper retains the first-order Taylor representation", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        trace_axes = Axes(x_range=[0, 5, 1], y_range=[0, 1, 0.25], x_length=8.4, y_length=3.1, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(UP * 0.45)
        trace = trace_axes.plot(lambda x: 0.12 + 0.72 * (1 - 2.71828 ** (-0.8 * x)), x_range=[0.1, 4.8], color=TEAL, stroke_width=5)
        tangent = Line([-2.0, -0.2, 0], [0.5, 0.8, 0], color=RED, stroke_width=5)
        formula = MathTex(r"f(t+\tau)\approx f(t)+\tau\,\partial_tf(t)", color=INK).scale(0.98).to_edge(DOWN, buff=0.7)
        geometry = VGroup(trace_axes, trace, tangent, formula)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, formula], blockers=[trace_axes, trace, tangent], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(trace_axes), Create(trace), Create(tangent), Write(formula), lag_ratio=0.26), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_08_m05_free_surface_equation(self) -> None:
        self.clear()
        heading = Text("Insert the lag relation into free-surface mass balance", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Equation 9 reduces to Neuman when both lag times vanish", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        control = Circle(radius=1.5, color=TEAL, stroke_width=4)
        inflow = Arrow(LEFT * 4.7, LEFT * 1.55, buff=0.05, color=TEAL, stroke_width=5)
        storage = VGroup(
            Circle(radius=0.16, color=GOLD, stroke_width=2), Circle(radius=0.24, color=GOLD, stroke_width=2),
            Circle(radius=0.32, color=GOLD, stroke_width=2), Circle(radius=0.40, color=GOLD, stroke_width=2),
            Circle(radius=0.48, color=GOLD, stroke_width=2),
        )
        formula = VGroup(
            MathTex(r"K_z(\partial_zs+\tau_s\partial_{tz}s)", color=TEAL),
            MathTex(r"=", color=INK),
            MathTex(r"-S_y(\partial_ts+\tau_q\partial_{tt}s)", color=RED),
        ).arrange(RIGHT, buff=0.16).scale(0.68).to_edge(DOWN, buff=0.78)
        zero_flux_lag = MathTex(r"\tau_q", color=MUTED)
        first_equals = MathTex(r"=", color=INK)
        zero_storage_lag = MathTex(r"\tau_s", color=MUTED)
        second_equals = MathTex(r"=", color=INK)
        zero = MathTex(r"0", color=MUTED)
        no_lag = VGroup(zero_flux_lag, first_equals, zero_storage_lag, second_equals, zero).arrange(RIGHT, buff=0.16)
        implies = MathTex(r"\Rightarrow", color=INK)
        neuman = Text("Neuman", font="Arial", font_size=22, color=MUTED)
        reduction = VGroup(no_lag, implies, neuman).arrange(RIGHT, buff=0.14).shift(RIGHT * 3.75 + UP * 1.4)
        geometry = VGroup(control, inflow, storage, formula, reduction)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, formula, reduction], blockers=[control, inflow, storage], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(control), Create(inflow), Create(storage), Write(formula), FadeIn(reduction), lag_ratio=0.23), run_time=4.6)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_09_m06_dimensionless_system(self) -> None:
        self.clear()
        heading = Text("Scale geometry, time, and both lag parameters", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Dimensionless scales preserve anisotropy and well geometry", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        left_symbols = VGroup(MathTex(r"r,z,t", color=INK), MathTex(r"K_r,K_z,S_s,S_y", color=INK), MathTex(r"\tau_q,\tau_s", color=RED)).arrange(DOWN, buff=0.35).shift(LEFT * 3.8)
        scale_box = Rectangle(width=2.25, height=2.65, color=GOLD, fill_color=GOLD, fill_opacity=0.1, stroke_width=4)
        scale_label = Text("scales", font="Arial", font_size=24, color=GOLD).move_to(UP * 1.7)
        right_symbols = VGroup(
            MathTex(r"r_D,z_D,t_D", color=TEAL),
            VGroup(
                MathTex(r"\kappa=K_z/K_r", color=TEAL),
                MathTex(r"\eta=S_y/(S_s b)", color=TEAL),
            ).arrange(RIGHT, buff=0.22).scale(0.72),
            MathTex(r"\tau_{qD},\tau_{sD}", color=RED),
        ).arrange(DOWN, buff=0.35).shift(RIGHT * 4.25)
        arrows = VGroup(Arrow(LEFT * 2.3, LEFT * 1.3, color=MUTED), Arrow(RIGHT * 1.3, RIGHT * 2.3, color=MUTED))
        geometry = VGroup(left_symbols, scale_box, scale_label, right_symbols, arrows)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, left_symbols, scale_label, right_symbols], blockers=[scale_box, arrows], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(FadeIn(left_symbols), Create(arrows[0]), FadeIn(scale_box), FadeIn(scale_label), Create(arrows[1]), FadeIn(right_symbols), lag_ratio=0.20), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_10_m07_laplace_transform(self) -> None:
        self.clear()
        heading = Text("Move time dependence into the Laplace parameter", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Schematic transform geometry; initial conditions enter the p domain", font="Arial", font_size=18, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.1, 0.2], x_length=5.6, y_length=3.2, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 3.3 + UP * 0.25)
        trace = axes.plot(lambda x: 0.12 + 0.65 * (1 - 2.71828 ** (-0.8 * x)), x_range=[0.1, 5.8], color=TEAL, stroke_width=5)
        operator = MathTex(r"\mathcal{L}\{\cdot\}", color=GOLD).scale(1.25).shift(RIGHT * 1.25)
        p_axis = Line(RIGHT * 2.1 + DOWN * 0.4, RIGHT * 5.7 + DOWN * 0.4, color=MUTED, stroke_width=3)
        modes = VGroup(
            Dot([2.5, 0.05, 0], radius=0.07, color=RED), Dot([3.15, -0.11, 0], radius=0.07, color=RED),
            Dot([3.8, -0.22, 0], radius=0.07, color=RED), Dot([4.45, -0.28, 0], radius=0.07, color=RED),
            Dot([5.1, -0.33, 0], radius=0.07, color=RED), Dot([5.75, -0.35, 0], radius=0.07, color=RED),
        )
        geometry = VGroup(axes, trace, operator, p_axis, modes)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, operator], blockers=[axes, trace, p_axis, modes], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(axes), Create(trace), Write(operator), Create(p_axis), FadeIn(modes), lag_ratio=0.23), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_11_m08_weber_transform(self) -> None:
        self.clear()
        heading = Text("Resolve the finite-radius well with Weber modes", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("The radial transform resolves the finite-radius boundary", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        well = Circle(radius=0.52, color=RED, fill_color=RED, fill_opacity=0.22, stroke_width=5).shift(LEFT * 3.8)
        rings = VGroup(
            Circle(radius=0.94, color=TEAL, stroke_width=2).move_to(well),
            Circle(radius=1.36, color=MUTED, stroke_width=2).move_to(well),
            Circle(radius=1.78, color=TEAL, stroke_width=2).move_to(well),
            Circle(radius=2.20, color=MUTED, stroke_width=2).move_to(well),
            Circle(radius=2.62, color=TEAL, stroke_width=2).move_to(well),
            Circle(radius=3.04, color=MUTED, stroke_width=2).move_to(well),
        )
        operator = MathTex(r"\mathcal{W}\{\cdot\}", color=GOLD).scale(1.35).shift(RIGHT * 0.1)
        a_axis = Line(RIGHT * 1.8 + DOWN * 0.35, RIGHT * 5.7 + DOWN * 0.35, color=MUTED, stroke_width=3)
        spectrum = VGroup(
            Line([2.25, -0.35, 0], [2.25, 0.85, 0], color=TEAL, stroke_width=4),
            Line([2.80, -0.35, 0], [2.80, 0.50, 0], color=TEAL, stroke_width=4),
            Line([3.35, -0.35, 0], [3.35, 0.25, 0], color=TEAL, stroke_width=4),
            Line([3.90, -0.35, 0], [3.90, 0.07, 0], color=TEAL, stroke_width=4),
            Line([4.45, -0.35, 0], [4.45, -0.05, 0], color=TEAL, stroke_width=4),
            Line([5.00, -0.35, 0], [5.00, -0.14, 0], color=TEAL, stroke_width=4),
            Line([5.55, -0.35, 0], [5.55, -0.20, 0], color=TEAL, stroke_width=4),
        )
        geometry = VGroup(well, rings, operator, a_axis, spectrum)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, operator], blockers=[well, rings, a_axis, spectrum], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(FadeIn(well), Create(rings), Write(operator), Create(a_axis), Create(spectrum), lag_ratio=0.22), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_12_m09_inverse_weber(self) -> None:
        self.clear()
        heading = Text("Integrate Weber modes back into radial drawdown", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Equation 18 restores radial position in Laplace space", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        spectrum = VGroup(
            Line([-5.2, -1.4, 0], [-5.2, 0.10, 0], color=TEAL, stroke_width=4),
            Line([-4.6, -1.4, 0], [-4.6, -0.23, 0], color=TEAL, stroke_width=4),
            Line([-4.0, -1.4, 0], [-4.0, -0.49, 0], color=TEAL, stroke_width=4),
            Line([-3.4, -1.4, 0], [-3.4, -0.69, 0], color=TEAL, stroke_width=4),
            Line([-2.8, -1.4, 0], [-2.8, -0.85, 0], color=TEAL, stroke_width=4),
            Line([-2.2, -1.4, 0], [-2.2, -0.97, 0], color=TEAL, stroke_width=4),
            Line([-1.6, -1.4, 0], [-1.6, -1.07, 0], color=TEAL, stroke_width=4),
            Line([-1.0, -1.4, 0], [-1.0, -1.14, 0], color=TEAL, stroke_width=4),
        )
        integral = MathTex(r"\int_0^\infty (\cdot)\,d\alpha", color=GOLD).scale(0.82)
        well = Circle(radius=0.38, color=RED, fill_color=RED, fill_opacity=0.25, stroke_width=4).shift(RIGHT * 3.7)
        rings = VGroup(
            Circle(radius=0.75, color=TEAL, stroke_width=3.7).move_to(well),
            Circle(radius=1.12, color=TEAL, stroke_width=3.2).move_to(well),
            Circle(radius=1.49, color=TEAL, stroke_width=2.7).move_to(well),
            Circle(radius=1.86, color=TEAL, stroke_width=2.2).move_to(well),
            Circle(radius=2.23, color=TEAL, stroke_width=1.7).move_to(well),
            Circle(radius=2.60, color=TEAL, stroke_width=1.2).move_to(well),
        )
        geometry = VGroup(spectrum, integral, well, rings)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, integral], blockers=[spectrum, well, rings], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(spectrum), Write(integral), FadeIn(well), Create(rings), lag_ratio=0.24), run_time=4.6)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_13_m10_inverse_laplace(self) -> None:
        self.clear()
        heading = Text("Numerical inversion returns the transient hydrograph", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Schematic inversion geometry | Crump inversion returns physical time", font="Arial", font_size=18, color=MUTED).to_edge(DOWN, buff=0.34)
        p_axis = Line(LEFT * 5.4, LEFT * 1.5, color=MUTED, stroke_width=3)
        modes = VGroup(
            Dot([-5.0, 0.45, 0], radius=0.07, color=RED), Dot([-4.38, 0.30, 0], radius=0.07, color=RED),
            Dot([-3.76, 0.20, 0], radius=0.07, color=RED), Dot([-3.14, 0.14, 0], radius=0.07, color=RED),
            Dot([-2.52, 0.09, 0], radius=0.07, color=RED), Dot([-1.90, 0.06, 0], radius=0.07, color=RED),
        )
        operator = MathTex(r"\mathcal{L}^{-1}", color=GOLD).scale(1.3)
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.1, 0.2], x_length=5.4, y_length=3.4, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(RIGHT * 3.5)
        curve = axes.plot(lambda x: 0.08 + 0.34 * (1 - 2.71828 ** (-1.7 * x)) + 0.42 / (1 + 2.71828 ** (-2.1 * (x - 4.25))), x_range=[0.05, 5.8], color=TEAL, stroke_width=6)
        geometry = VGroup(p_axis, modes, operator, axes, curve)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, operator], blockers=[p_axis, modes, axes, curve], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(p_axis), FadeIn(modes), Write(operator), Create(axes), Create(curve), lag_ratio=0.23), run_time=4.6)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_14_m11_sensitivity(self) -> None:
        self.clear()
        heading = Text("The two lag times do not carry equal information", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Illustrative curve geometry; ranking and timing follow Figure 3", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = Axes(x_range=[0, 6, 1], y_range=[-0.5, 1.1, 0.5], x_length=7.6, y_length=3.8, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 1.1 + DOWN * 0.2)
        tau_q = axes.plot(lambda x: -0.30 * 2.71828 ** (-((x - 2.0) ** 2) / 0.45), x_range=[0.1, 5.8], color=TEAL, stroke_width=5)
        tau_s = axes.plot(lambda x: 0.72 * 2.71828 ** (-((x - 3.1) ** 2) / 0.7), x_range=[0.1, 5.8], color=RED, stroke_width=6)
        labels = VGroup(MathTex(r"\tau_q", color=TEAL).move_to(RIGHT * 4.5 + DOWN * 0.65), MathTex(r"\tau_s", color=RED).move_to(RIGHT * 4.5 + UP * 0.65))
        geometry = VGroup(axes, tau_q, tau_s, labels)
        assert_scene_layout(scene=self, pending_items=[heading, note, geometry], labels=[heading, note, labels], blockers=[axes, tau_q, tau_s], frame_items=[heading, note, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(note), LaggedStart(Create(axes), Create(tau_q), FadeIn(labels[0]), Create(tau_s), FadeIn(labels[1]), lag_ratio=0.24), run_time=4.6)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_15_m12_cape_cod(self) -> None:
        self.clear()
        heading = Text("Cape Cod: four independent observation-well fits", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Source-faithful schematic of Figure 4 topology; curves are not digitized", font="Arial", font_size=17, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = VGroup(
            Line([-5.65, -2.05, 0], [2.70, -2.05, 0], color=MUTED, stroke_width=2),
            Line([-5.65, -2.05, 0], [-5.65, 2.05, 0], color=MUTED, stroke_width=2),
            VGroup(*[Line([x, -2.12, 0], [x, -1.98, 0], color=MUTED, stroke_width=1.4) for x in (-4.10, -2.55, -1.00, 0.55, 2.10)]),
        )
        present = VMobject(color=INK, stroke_width=4.0)
        neuman = VMobject(color=RED, stroke_width=2.7)
        moench = VMobject(color=TEAL, stroke_width=2.2)
        tartakovsky = VMobject(color=GOLD, stroke_width=2.0)
        malama = VMobject(color=MUTED, stroke_width=1.4)
        for y0, divergence in ((1.05, 1.0), (0.28, 0.9), (-0.47, 0.45), (-1.30, 0.18)):
            present.start_new_path([-5.35, y0 - 0.30, 0]); present.add_cubic_bezier_curve_to([-4.55, y0 - 0.04, 0], [-4.15, y0 + 0.34, 0], [-3.20, y0 + 0.42, 0]); present.add_cubic_bezier_curve_to([-1.20, y0 + 0.48, 0], [0.15, y0 + 0.78, 0], [2.45, y0 + 0.96, 0])
            neuman.start_new_path([-5.15, y0 - 0.42 * divergence, 0]); neuman.add_cubic_bezier_curve_to([-4.35, y0 - 0.12 * divergence, 0], [-3.95, y0 + 0.18, 0], [-3.05, y0 + 0.34, 0]); neuman.add_cubic_bezier_curve_to([-1.05, y0 + 0.44, 0], [0.25, y0 + 0.77, 0], [2.45, y0 + 0.96, 0])
            moench.start_new_path([-5.28, y0 - 0.34, 0]); moench.add_cubic_bezier_curve_to([-4.50, y0 - 0.06, 0], [-4.05, y0 + 0.28, 0], [-3.16, y0 + 0.39, 0]); moench.add_cubic_bezier_curve_to([-1.15, y0 + 0.46, 0], [0.18, y0 + 0.78, 0], [2.45, y0 + 0.96, 0])
            tartakovsky.start_new_path([-5.42, y0 - 0.25, 0]); tartakovsky.add_cubic_bezier_curve_to([-4.60, y0 + 0.01, 0], [-4.18, y0 + 0.36, 0], [-3.24, y0 + 0.43, 0]); tartakovsky.add_cubic_bezier_curve_to([-1.22, y0 + 0.49, 0], [0.12, y0 + 0.79, 0], [2.45, y0 + 0.96, 0])
            malama.start_new_path([-5.22, y0 - 0.37, 0]); malama.add_cubic_bezier_curve_to([-4.42, y0 - 0.08, 0], [-4.00, y0 + 0.24, 0], [-3.10, y0 + 0.37, 0]); malama.add_cubic_bezier_curve_to([-1.10, y0 + 0.45, 0], [0.22, y0 + 0.77, 0], [2.45, y0 + 0.96, 0])
        field_curves = VGroup(neuman, moench, tartakovsky, malama, present)
        observed = VMobject(color=INK, stroke_width=2.0)
        for x, y in (
                (-5.00, 0.95), (-4.30, 1.34), (-3.15, 1.48), (-1.00, 1.57), (1.65, 1.90),
                (-5.00, 0.18), (-4.30, 0.57), (-3.15, 0.71), (-1.00, 0.80), (1.65, 1.13),
                (-5.00, -0.57), (-4.30, -0.18), (-3.15, -0.04), (-1.00, 0.05), (1.65, 0.38),
                (-5.00, -1.40), (-4.30, -1.01), (-3.15, -0.87), (-1.00, -0.78), (1.65, -0.45),
            ):
            observed.start_new_path([x - 0.045, y, 0]); observed.add_cubic_bezier_curve_to([x - 0.015, y, 0], [x + 0.015, y, 0], [x + 0.045, y, 0])
        well_values = VGroup(
            Text("F505-032   Sy 0.20", font="Arial", font_size=16, color=INK),
            Text("F504-032   Sy 0.16", font="Arial", font_size=16, color=INK),
            Text("F377-037   Sy 0.18", font="Arial", font_size=16, color=INK),
            Text("F347-031   Sy 0.18", font="Arial", font_size=16, color=INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.20).shift(RIGHT * 4.55 + DOWN * 0.85)
        legend = VGroup(
            Text("observed points", font="Arial", font_size=15, color=INK),
            Text("present — solid", font="Arial", font_size=15, color=INK),
            Text("Neuman — red thin", font="Arial", font_size=15, color=RED),
            Text("Moench / T&N / Malama", font="Arial", font_size=15, color=TEAL),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.16).shift(RIGHT * 4.55 + UP * 1.25)
        time_text = Text("time (log)", font="Arial", font_size=15, color=MUTED).move_to([-1.40, -2.30, 0])
        drawdown_text = Text("drawdown (log)", font="Arial", font_size=15, color=MUTED)
        drawdown_text.rotate(1.5708)
        drawdown_text.move_to([-5.95, 0, 0])
        geometry = VGroup(axes, field_curves, observed, well_values, legend, time_text, drawdown_text)
        assert_scene_layout(scene=self, pending_items=[heading, note, axes, field_curves, observed, well_values, legend, time_text, drawdown_text], labels=[heading, note, well_values, legend, time_text, drawdown_text], blockers=[axes, field_curves, observed], frame_items=[heading, note, axes, field_curves, observed, well_values, legend, time_text, drawdown_text], min_gap=0.02, intentional_overlaps=[(axes, axes), (axes, field_curves), (axes, observed), (field_curves, field_curves), (field_curves, observed)])
        self.play(FadeIn(heading), FadeIn(note), Create(axes), Create(field_curves), FadeIn(observed), FadeIn(well_values), FadeIn(legend), FadeIn(time_text), FadeIn(drawdown_text), run_time=5.1)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_16_m13_borden(self) -> None:
        self.clear()
        heading = Text("Borden: five solutions meet a second field test", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Source-faithful schematic of Figure 5 topology; curves are not digitized", font="Arial", font_size=17, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = VGroup(
            Line([-5.65, -2.05, 0], [2.70, -2.05, 0], color=MUTED, stroke_width=2),
            Line([-5.65, -2.05, 0], [-5.65, 2.05, 0], color=MUTED, stroke_width=2),
            VGroup(*[Line([x, -2.12, 0], [x, -1.98, 0], color=MUTED, stroke_width=1.4) for x in (-4.10, -2.55, -1.00, 0.55, 2.10)]),
        )
        present = VMobject(color=INK, stroke_width=4.0)
        neuman = VMobject(color=RED, stroke_width=2.7)
        moench = VMobject(color=TEAL, stroke_width=2.2)
        tartakovsky = VMobject(color=GOLD, stroke_width=2.0)
        malama = VMobject(color=MUTED, stroke_width=1.4)
        for y0, divergence in ((1.05, 1.0), (0.28, 0.72), (-0.47, 0.58), (-1.30, 0.05)):
            present.start_new_path([-5.35, y0 - 0.30, 0]); present.add_cubic_bezier_curve_to([-4.65, y0 - 0.02, 0], [-4.10, y0 + 0.36, 0], [-3.10, y0 + 0.43, 0]); present.add_cubic_bezier_curve_to([-1.45, y0 + 0.46, 0], [-0.15, y0 + 0.78, 0], [2.45, y0 + 0.98, 0])
            neuman.start_new_path([-5.12, y0 - 0.48 * divergence, 0]); neuman.add_cubic_bezier_curve_to([-4.32, y0 - 0.16 * divergence, 0], [-3.88, y0 + 0.16, 0], [-2.95, y0 + 0.34, 0]); neuman.add_cubic_bezier_curve_to([-1.32, y0 + 0.44, 0], [-0.05, y0 + 0.77, 0], [2.45, y0 + 0.98, 0])
            moench.start_new_path([-5.25, y0 - 0.38, 0]); moench.add_cubic_bezier_curve_to([-4.50, y0 - 0.08, 0], [-4.00, y0 + 0.27, 0], [-3.04, y0 + 0.39, 0]); moench.add_cubic_bezier_curve_to([-1.40, y0 + 0.45, 0], [-0.10, y0 + 0.78, 0], [2.45, y0 + 0.98, 0])
            tartakovsky.start_new_path([-5.40, y0 - 0.25, 0]); tartakovsky.add_cubic_bezier_curve_to([-4.64, y0 + 0.02, 0], [-4.12, y0 + 0.37, 0], [-3.12, y0 + 0.44, 0]); tartakovsky.add_cubic_bezier_curve_to([-1.48, y0 + 0.47, 0], [-0.18, y0 + 0.79, 0], [2.45, y0 + 0.98, 0])
            malama.start_new_path([-5.18, y0 - 0.42, 0]); malama.add_cubic_bezier_curve_to([-4.42, y0 - 0.12, 0], [-3.95, y0 + 0.22, 0], [-3.00, y0 + 0.37, 0]); malama.add_cubic_bezier_curve_to([-1.35, y0 + 0.44, 0], [-0.08, y0 + 0.77, 0], [2.45, y0 + 0.98, 0])
        field_curves = VGroup(neuman, moench, tartakovsky, malama, present)
        observed = VMobject(color=INK, stroke_width=2.0)
        for x, y in (
                (-5.00, 0.93), (-4.25, 1.33), (-3.00, 1.48), (-0.75, 1.62), (1.75, 1.94),
                (-5.00, 0.16), (-4.25, 0.56), (-3.00, 0.71), (-0.75, 0.85), (1.75, 1.17),
                (-5.00, -0.59), (-4.25, -0.19), (-3.00, -0.04), (-0.75, 0.10), (1.75, 0.42),
                (-5.00, -1.40), (-4.25, -1.00), (-3.00, -0.85), (-0.75, -0.71), (1.75, -0.39),
            ):
            observed.start_new_path([x - 0.045, y, 0]); observed.add_cubic_bezier_curve_to([x - 0.015, y, 0], [x + 0.015, y, 0], [x + 0.045, y, 0])
        well_values = VGroup(
            Text("WD1A   Sy 0.12", font="Arial", font_size=16, color=INK),
            Text("WD1B   Sy 0.20", font="Arial", font_size=16, color=INK),
            Text("WD2A   Sy 0.11", font="Arial", font_size=16, color=INK),
            Text("WD4A   Sy 0.17", font="Arial", font_size=16, color=INK),
            Text("laboratory Sy 0.30", font="Arial", font_size=16, color=GOLD),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.17).shift(RIGHT * 4.55 + DOWN * 0.95)
        legend = VGroup(
            Text("early divergence: WD1A", font="Arial", font_size=15, color=RED),
            Text("near coincidence: WD4A", font="Arial", font_size=15, color=TEAL),
            Text("observed + five solutions", font="Arial", font_size=15, color=INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.16).shift(RIGHT * 4.55 + UP * 1.25)
        time_text = Text("time (log)", font="Arial", font_size=15, color=MUTED).move_to([-1.40, -2.30, 0])
        drawdown_text = Text("drawdown (log)", font="Arial", font_size=15, color=MUTED)
        drawdown_text.rotate(1.5708)
        drawdown_text.move_to([-5.95, 0, 0])
        geometry = VGroup(axes, field_curves, observed, well_values, legend, time_text, drawdown_text)
        assert_scene_layout(scene=self, pending_items=[heading, note, axes, field_curves, observed, well_values, legend, time_text, drawdown_text], labels=[heading, note, well_values, legend, time_text, drawdown_text], blockers=[axes, field_curves, observed], frame_items=[heading, note, axes, field_curves, observed, well_values, legend, time_text, drawdown_text], min_gap=0.02, intentional_overlaps=[(axes, axes), (axes, field_curves), (axes, observed), (field_curves, field_curves), (field_curves, observed)])
        self.play(FadeIn(heading), FadeIn(note), Create(axes), Create(field_curves), FadeIn(observed), FadeIn(well_values), FadeIn(legend), FadeIn(time_text), FadeIn(drawdown_text), run_time=5.1)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_17_m14_saint_pardon(self) -> None:
        self.clear()
        heading = Text("Saint Pardon: distance changes the fitted lag pair", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.42)
        note = Text("Source-faithful schematic of Figure 6 topology; curves are not digitized", font="Arial", font_size=17, color=MUTED).to_edge(DOWN, buff=0.34)
        axes = VGroup(
            Line([-5.65, -2.05, 0], [2.70, -2.05, 0], color=MUTED, stroke_width=2),
            Line([-5.65, -2.05, 0], [-5.65, 2.05, 0], color=MUTED, stroke_width=2),
            VGroup(*[Line([x, -2.12, 0], [x, -1.98, 0], color=MUTED, stroke_width=1.4) for x in (-4.10, -2.55, -1.00, 0.55, 2.10)]),
        )
        present = VMobject(color=INK, stroke_width=4.0)
        neuman = VMobject(color=RED, stroke_width=2.7)
        moench = VMobject(color=TEAL, stroke_width=2.2)
        tartakovsky = VMobject(color=GOLD, stroke_width=2.0)
        malama = VMobject(color=MUTED, stroke_width=1.4)
        for y0, divergence in ((0.78, 0.08), (-0.92, 0.72)):
            present.start_new_path([-5.35, y0 - 0.30, 0]); present.add_cubic_bezier_curve_to([-4.55, y0 - 0.02, 0], [-4.10, y0 + 0.34, 0], [-3.12, y0 + 0.42, 0]); present.add_cubic_bezier_curve_to([-1.25, y0 + 0.47, 0], [0.15, y0 + 0.78, 0], [2.45, y0 + 0.98, 0])
            neuman.start_new_path([-5.10, y0 - 0.30 - 0.34 * divergence, 0]); neuman.add_cubic_bezier_curve_to([-4.25, y0 - 0.02 - 0.23 * divergence, 0], [-3.85, y0 + 0.28 - 0.12 * divergence, 0], [-2.92, y0 + 0.39, 0]); neuman.add_cubic_bezier_curve_to([-1.10, y0 + 0.46, 0], [0.22, y0 + 0.78, 0], [2.45, y0 + 0.98, 0])
            moench.start_new_path([-5.23, y0 - 0.33 - 0.14 * divergence, 0]); moench.add_cubic_bezier_curve_to([-4.42, y0 - 0.05 - 0.10 * divergence, 0], [-4.00, y0 + 0.31 - 0.06 * divergence, 0], [-3.04, y0 + 0.40, 0]); moench.add_cubic_bezier_curve_to([-1.18, y0 + 0.46, 0], [0.18, y0 + 0.78, 0], [2.45, y0 + 0.98, 0])
            tartakovsky.start_new_path([-5.40, y0 - 0.26 + 0.08 * divergence, 0]); tartakovsky.add_cubic_bezier_curve_to([-4.60, y0 + 0.01 + 0.05 * divergence, 0], [-4.18, y0 + 0.36, 0], [-3.18, y0 + 0.43, 0]); tartakovsky.add_cubic_bezier_curve_to([-1.28, y0 + 0.48, 0], [0.12, y0 + 0.79, 0], [2.45, y0 + 0.98, 0])
            malama.start_new_path([-5.18, y0 - 0.36 - 0.18 * divergence, 0]); malama.add_cubic_bezier_curve_to([-4.36, y0 - 0.08 - 0.12 * divergence, 0], [-3.95, y0 + 0.27 - 0.08 * divergence, 0], [-3.00, y0 + 0.39, 0]); malama.add_cubic_bezier_curve_to([-1.15, y0 + 0.46, 0], [0.20, y0 + 0.78, 0], [2.45, y0 + 0.98, 0])
        field_curves = VGroup(neuman, moench, tartakovsky, malama, present)
        observed = VMobject(color=INK, stroke_width=2.0)
        for x, y in (
                (-5.00, 0.66), (-4.28, 1.07), (-3.05, 1.21), (-0.75, 1.36), (1.70, 1.70),
                (-5.00, -1.04), (-4.28, -0.63), (-3.05, -0.49), (-0.75, -0.34), (1.70, 0.00),
            ):
            observed.start_new_path([x - 0.048, y, 0]); observed.add_cubic_bezier_curve_to([x - 0.016, y, 0], [x + 0.016, y, 0], [x + 0.048, y, 0])
        labels = VGroup(Text("10 m: five solutions nearly coincide", font="Arial", font_size=16, color=INK), Text("30 m: early-time separation", font="Arial", font_size=16, color=RED)).arrange(DOWN, aligned_edge=LEFT, buff=0.20).shift(RIGHT * 4.55 + UP * 1.45)
        values = VGroup(
            MathTex(r"10\,m:\;S_y=0.25", color=GOLD), MathTex(r"\tau_q=11662.02\,s", color=TEAL), MathTex(r"\tau_s=28164.24\,s", color=RED),
            MathTex(r"30\,m:\;S_y=0.29", color=GOLD), MathTex(r"\tau_q=8524.2\,s", color=TEAL), MathTex(r"\tau_s=26457.42\,s", color=RED),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15).scale(0.52).shift(RIGHT * 4.55 + DOWN * 0.85)
        time_text = Text("time (log)", font="Arial", font_size=15, color=MUTED).move_to([-1.40, -2.30, 0])
        drawdown_text = Text("drawdown (log)", font="Arial", font_size=15, color=MUTED)
        drawdown_text.rotate(1.5708)
        drawdown_text.move_to([-5.95, 0, 0])
        geometry = VGroup(axes, field_curves, observed, labels, values, time_text, drawdown_text)
        assert_scene_layout(scene=self, pending_items=[heading, note, axes, field_curves, observed, labels, values, time_text, drawdown_text], labels=[heading, note, labels, values, time_text, drawdown_text], blockers=[axes, field_curves, observed], frame_items=[heading, note, axes, field_curves, observed, labels, values, time_text, drawdown_text], min_gap=0.02, intentional_overlaps=[(axes, axes), (axes, field_curves), (axes, observed), (field_curves, field_curves), (field_curves, observed)])
        self.play(FadeIn(heading), FadeIn(note), Create(axes), Create(field_curves), FadeIn(observed), FadeIn(labels), FadeIn(values), FadeIn(time_text), FadeIn(drawdown_text), run_time=5.1)
        self.wait(1.1)
        self.play(FadeOut(heading), FadeOut(note), FadeOut(geometry), run_time=0.65)

    def scene_18_return_field_evidence(self) -> None:
        self.clear()
        heading = Text("Delayed drainage is a field-test diagnostic, not a universal constant", font="Arial", font_size=32, color=INK).to_edge(UP, buff=0.42)
        note = Text("Schematic field-fit summary | fitted parameters remain site-conditioned", font="Arial", font_size=18, color=MUTED).to_edge(DOWN, buff=0.34)
        box_1 = Rectangle(width=2.75, height=1.7, color=MUTED, stroke_width=1.2).move_to([-4.25, 0.45, 0])
        box_2 = Rectangle(width=2.75, height=1.7, color=MUTED, stroke_width=1.2).move_to([0, 0.45, 0])
        box_3 = Rectangle(width=2.75, height=1.7, color=MUTED, stroke_width=1.2).move_to([4.25, 0.45, 0])
        boxes = VGroup(box_1, box_2, box_3)
        curves = VMobject(color=TEAL, stroke_width=2.4)
        for x0 in (-5.45, -1.20, 3.05):
            for offset in (0.00, 0.08, 0.04):
                curves.start_new_path([x0, -0.12 + offset, 0])
                curves.add_cubic_bezier_curve_to([x0 + 0.60, -0.10 + offset, 0], [x0 + 1.50, 0.92 + offset, 0], [x0 + 2.40, 1.05 + offset, 0])
        observed = VMobject(color=INK, stroke_width=2.0)
        for x, y in [(-4.85, 0.06), (-4.20, 0.45), (-3.45, 0.98), (-0.60, 0.06), (0.05, 0.45), (0.80, 0.98), (3.65, 0.06), (4.30, 0.45), (5.05, 0.98)]:
            observed.start_new_path([x - 0.04, y, 0]); observed.add_cubic_bezier_curve_to([x - 0.01, y, 0], [x + 0.01, y, 0], [x + 0.04, y, 0])
        label_1 = Text("Cape Cod", font="Arial", font_size=18, color=INK).move_to([-4.25, 1.60, 0])
        label_2 = Text("Borden", font="Arial", font_size=18, color=INK).move_to([0, 1.60, 0])
        label_3 = Text("Saint Pardon", font="Arial", font_size=18, color=INK).move_to([4.25, 1.60, 0])
        panel_labels = VGroup(label_1, label_2, label_3)
        panels = VGroup(boxes, curves, observed, panel_labels)
        estimates = VGroup(
            MathTex(r"S_y=0.16{-}0.20", color=TEAL),
            MathTex(r"S_y=0.11{-}0.20", color=TEAL),
            MathTex(r"S_y=0.25{-}0.29", color=TEAL),
        ).arrange(RIGHT, buff=1.15).scale(0.58).shift(DOWN * 1.35)
        relation = VGroup(MathTex(r"\tau_q", color=TEAL), MathTex(r"\neq", color=INK), MathTex(r"\tau_s", color=RED)).arrange(RIGHT, buff=0.18).scale(0.88).shift(DOWN * 2.15)
        geometry = VGroup(panels, estimates, relation)
        assert_scene_layout(scene=self, pending_items=[heading, note, boxes, curves, observed, panel_labels, estimates, relation], labels=[heading, note, panel_labels, estimates, relation], blockers=[boxes, curves, observed], frame_items=[heading, note, boxes, curves, observed, panel_labels, estimates, relation], min_gap=0.02, intentional_overlaps=[(box_1, curves), (box_2, curves), (box_3, curves), (box_1, observed), (box_2, observed), (box_3, observed), (curves, observed)])
        self.play(FadeIn(heading), FadeIn(note), Create(boxes), Create(curves), FadeIn(observed), FadeIn(panel_labels), FadeIn(estimates), Write(relation), run_time=5.35)
        self.wait(1.4)
