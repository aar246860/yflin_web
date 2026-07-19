# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
from __future__ import annotations

import sys
from pathlib import Path
from typing import Final

from manim import (
    DOWN, LEFT, RIGHT, UP, Arrow, Axes, Circle, Create, DashedLine, Dot, FadeIn,
    FadeOut, LaggedStart, Line, MathTex, Rectangle, Scene, Text, VGroup, VMobject,
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
PALE: Final = "#DDEAE8"
config.background_color = PAPER


class LinYeh2017V2(Scene):
    def construct(self) -> None:
        self.scene_01_b01_field_test()
        self.scene_02_b02_classical_clock()
        self.scene_03_b03_structural_interaction()
        self.scene_04_m01_two_response_times()
        self.scene_05_m02_conservation()
        self.scene_06_m03_laplace_solution()
        self.scene_07_m04_parameter_fit()
        self.scene_08_m05_see_comparison()
        self.scene_09_m06_distance_trends()
        self.scene_10_return_to_field()

    def scene_01_b01_field_test(self) -> None:
        title = Text("One pumping event. Five observed histories.", font="Arial", font_size=40, color=INK).to_edge(UP, buff=0.45)
        caption = Text("RC-5  |  7 days  |  observation wells: 208-3566 m", font="Arial", font_size=23, color=MUTED).to_edge(DOWN, buff=0.45)
        baseline = Line(LEFT * 5.55, RIGHT * 5.55, color=MUTED, stroke_width=2).shift(DOWN * 0.65)
        pump = VGroup(Rectangle(width=0.18, height=2.2, color=RED, fill_color=RED, fill_opacity=1), Arrow(UP * 0.45, DOWN * 0.45, color=RED, buff=0)).move_to(LEFT * 5.15 + DOWN * 0.1)
        distances = [208, 518, 1204, 2713, 3566]
        names = ["LC", "SP-2", "BHPL", "CL-2", "CHLN-2"]
        field = VGroup(baseline, pump)
        labels = VGroup(Text("RC-5", font="Arial", font_size=20, color=RED).next_to(pump, DOWN, buff=0.1))
        for index, (distance, name) in enumerate(zip(distances, names, strict=True)):
            x = -4.75 + 9.35 * distance / 3566
            marker = Dot([x, -0.65, 0], radius=0.075, color=TEAL)
            well_name = Text(name, font="Arial", font_size=17, color=INK).next_to(marker, DOWN, buff=0.13)
            trace = VMobject(color=TEAL if index != 2 else GOLD, stroke_width=3)
            points = [[x - 0.45, -0.1, 0], [x - 0.25, 0.2 + 0.08 * index, 0], [x, 0.8 + 0.14 * index, 0], [x + 0.28, 1.25 + 0.12 * index, 0]]
            trace.set_points_smoothly(points)
            field.add(marker, trace)
            labels.add(well_name)
        assert_scene_layout(scene=self, pending_items=[title, caption, field, labels], labels=[title, caption, labels], blockers=[field], frame_items=[title, caption, field, labels], intentional_overlaps=[(field, field)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(field), FadeIn(labels), lag_ratio=0.42), run_time=4.2)
        self.wait(1.4)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(labels), FadeOut(field), run_time=0.7)

    def scene_02_b02_classical_clock(self) -> None:
        title = Text("Classical radial Darcy behavior keeps one clock", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Flux and drawdown gradient are evaluated at the same radius and time.", font="Arial", font_size=23, color=MUTED).to_edge(DOWN, buff=0.45)
        well = Circle(radius=0.28, color=RED, fill_color=RED, fill_opacity=0.2).shift(LEFT * 4.5)
        radius = Line(well.get_center(), RIGHT * 2.0, color=MUTED, stroke_width=2)
        flux = Arrow(RIGHT * 0.9, LEFT * 0.4, color=TEAL, buff=0, stroke_width=6)
        profile = VMobject(color=INK, stroke_width=4)
        profile.set_points_smoothly([[0.6, -0.7, 0], [1.4, -0.2, 0], [2.1, 0.85, 0], [3.3, 1.2, 0]])
        tangent = Line([1.5, -0.35, 0], [2.45, 1.0, 0], color=RED, stroke_width=6)
        clock = VGroup(Circle(radius=0.62, color=GOLD, stroke_width=4), Line([0, 0, 0], [0.32, 0.28, 0], color=GOLD, stroke_width=4)).shift(UP * 1.75)
        formula = VGroup(MathTex(r"q_r(r,t)", color=TEAL), MathTex(r"=", color=INK), MathTex(r"-K\,\partial_r s(r,t)", color=RED)).arrange(RIGHT, buff=0.22).scale(0.86).shift(DOWN * 2.05)
        geometry = VGroup(well, radius, flux, profile, tangent, clock)
        assert_scene_layout(scene=self, pending_items=[title, caption, formula, geometry], labels=[title, caption, formula], blockers=[geometry], frame_items=[title, caption, formula, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(geometry), Write(formula), lag_ratio=0.48), run_time=4.3)
        self.wait(1.2)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(formula), FadeOut(geometry), run_time=0.7)

    def scene_03_b03_structural_interaction(self) -> None:
        title = Text("Aquifer structure can introduce another response time", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.45)
        caption = Text("A proposed macroscopic interpretation - not a uniquely proven mechanism", font="Arial", font_size=22, color=MUTED).to_edge(DOWN, buff=0.45)
        channel = Line(LEFT * 5.0, RIGHT * 4.8, color=TEAL, stroke_width=16)
        branch = VGroup(Line(RIGHT * 0.8, RIGHT * 0.8 + UP * 1.7, color=MUTED, stroke_width=12), Circle(radius=0.72, color=MUTED, stroke_width=8).move_to(RIGHT * 0.8 + UP * 2.0))
        halo = Circle(radius=0.48, color=GOLD, fill_color=GOLD, fill_opacity=0.2, stroke_width=5).move_to(RIGHT * 0.8 + UP * 2.0)
        marker = Dot(LEFT * 4.25, radius=0.13, color=PAPER).set_stroke(TEAL, width=3)
        labels = VGroup(Text("connected fracture", font="Arial", font_size=24, color=TEAL).move_to(LEFT * 3.35 + DOWN * 0.55), Text("slower pressure exchange", font="Arial", font_size=24, color=GOLD).move_to(RIGHT * 3.75 + UP * 2.0))
        structure = VGroup(channel, branch, halo, marker)
        assert_inside(branch[1], [halo], min_gap=0.12)
        assert_scene_layout(scene=self, pending_items=[title, caption, structure, labels], labels=[title, caption, labels], blockers=[structure], frame_items=[title, caption, structure, labels], intentional_overlaps=[(structure, structure)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(structure), FadeIn(labels), lag_ratio=0.45), run_time=4.0)
        self.wait(1.5)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(labels), FadeOut(structure), run_time=0.7)

    def scene_04_m01_two_response_times(self) -> None:
        title = Text("Give flux and gradient separate response times", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Keep the radial relation; generalize its macroscopic timing.", font="Arial", font_size=22, color=MUTED).to_edge(DOWN, buff=0.45)
        flux_clock = VGroup(Circle(radius=0.62, color=TEAL, stroke_width=5), Line([0, 0, 0], [0.34, 0.25, 0], color=TEAL, stroke_width=5)).shift(LEFT * 3.25 + UP * 1.35)
        grad_clock = VGroup(Circle(radius=0.62, color=RED, stroke_width=5), Line([0, 0, 0], [0.12, 0.42, 0], color=RED, stroke_width=5)).shift(RIGHT * 3.25 + UP * 1.35)
        clock_labels = VGroup(MathTex(r"\tau_q", color=TEAL).next_to(flux_clock, DOWN), MathTex(r"\tau_s", color=RED).next_to(grad_clock, DOWN))
        formula = VGroup(MathTex(r"q_r(r,t+\tau_q)", color=TEAL), MathTex(r"=", color=INK), MathTex(r"-K\,\partial_r s(r,t+\tau_s)", color=RED)).arrange(RIGHT, buff=0.22).scale(0.9).shift(DOWN * 0.75)
        clocks = VGroup(flux_clock, grad_clock)
        assert_scene_layout(scene=self, pending_items=[title, caption, clocks, clock_labels, formula], labels=[title, caption, clock_labels, formula], blockers=[clocks], frame_items=[title, caption, clocks, clock_labels, formula], intentional_overlaps=[(clocks, clocks)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(clocks), FadeIn(clock_labels), Write(formula), lag_ratio=0.36), run_time=4.0)
        self.wait(1.5)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(clock_labels), FadeOut(formula), FadeOut(clocks), run_time=0.7)

    def scene_05_m02_conservation(self) -> None:
        title = Text("The timing choice enters the governing equation", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Constitutive substitution + radial mass conservation", font="Arial", font_size=23, color=MUTED).to_edge(DOWN, buff=0.45)
        annulus = VGroup(Circle(radius=2.0, color=MUTED, stroke_width=3), Circle(radius=1.15, color=MUTED, stroke_width=3))
        inflow = Arrow(LEFT * 3.5, LEFT * 2.05, color=TEAL, buff=0, stroke_width=6)
        outflow = Arrow(RIGHT * 1.15, RIGHT * 3.1, color=TEAL, buff=0, stroke_width=6)
        storage = VGroup(Dot([-0.45, 0.12, 0], radius=0.08, color=GOLD), Dot([-0.30, -0.12, 0], radius=0.08, color=GOLD), Dot([-0.15, 0.12, 0], radius=0.08, color=GOLD), Dot([0, -0.12, 0], radius=0.08, color=GOLD), Dot([0.15, 0.12, 0], radius=0.08, color=GOLD), Dot([0.30, -0.12, 0], radius=0.08, color=GOLD), Dot([0.45, 0.12, 0], radius=0.08, color=GOLD))
        pulse = VGroup(Circle(radius=0.35, color=RED, stroke_opacity=0.75, stroke_width=3), Circle(radius=0.58, color=RED, stroke_opacity=0.65, stroke_width=3), Circle(radius=0.81, color=RED, stroke_opacity=0.55, stroke_width=3), Circle(radius=1.04, color=RED, stroke_opacity=0.45, stroke_width=3), Circle(radius=1.27, color=RED, stroke_opacity=0.35, stroke_width=3))
        labels = VGroup(Text("inflow", font="Arial", font_size=23, color=TEAL).move_to(LEFT * 4.25 + UP * 1.0), Text("outflow", font="Arial", font_size=23, color=TEAL).move_to(RIGHT * 4.15 + UP * 1.0), Text("storage", font="Arial", font_size=23, color=GOLD).move_to(DOWN * 2.55))
        system = VGroup(annulus, inflow, outflow, storage, pulse)
        assert_scene_layout(scene=self, pending_items=[title, caption, labels, system], labels=[title, caption, labels], blockers=[system], frame_items=[title, caption, labels, system], intentional_overlaps=[(system, system)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(system), FadeIn(labels), lag_ratio=0.44), run_time=4.2)
        self.wait(1.4)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(labels), FadeOut(system), run_time=0.7)

    def scene_06_m03_laplace_solution(self) -> None:
        title = Text("Transform the boundary-value problem", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Well and far-field conditions select the Laplace-domain radial solution.", font="Arial", font_size=22, color=MUTED).to_edge(DOWN, buff=0.45)
        boundary = VGroup(Line(LEFT * 5.3, RIGHT * 5.3, color=MUTED), Dot(LEFT * 5.0, radius=0.12, color=RED), DashedLine(RIGHT * 4.8 + DOWN * 1.5, RIGHT * 4.8 + UP * 1.5, color=MUTED))
        time_curve = VMobject(color=TEAL, stroke_width=5)
        time_curve.set_points_smoothly([[-4.6, -0.7, 0], [-3.2, 0.6, 0], [-2.0, 1.0, 0]])
        transform = MathTex(r"\mathcal{L}\{\,\cdot\,\}", color=GOLD).scale(1.25).move_to(LEFT * 3.0 + UP * 1.65)
        bessel = MathTex(r"\bar{s}_D=A I_0(k r_D)+B K_0(k r_D)", color=INK).scale(0.78).move_to(RIGHT * 1.6 + UP * 1.65)
        profile = VMobject(color=RED, stroke_width=5)
        profile.set_points_smoothly([[0.3, -1.25, 0], [1.0, -0.55, 0], [2.0, 0.15, 0], [3.4, 0.62, 0], [4.6, 0.75, 0]])
        labels = VGroup(Text("pumping-well boundary", font="Arial", font_size=20, color=RED).move_to(LEFT * 4.1 + DOWN * 1.9), Text("far field", font="Arial", font_size=20, color=MUTED).move_to(RIGHT * 4.8 + DOWN * 1.9))
        assert_scene_layout(scene=self, pending_items=[title, caption, transform, bessel, labels, boundary, time_curve, profile], labels=[title, caption, transform, bessel, labels], blockers=[boundary, time_curve, profile], frame_items=[title, caption, transform, bessel, labels, boundary, time_curve, profile], intentional_overlaps=[(boundary, boundary), (boundary, time_curve), (boundary, profile)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(boundary), Create(time_curve), Write(transform), Write(bessel), Create(profile), FadeIn(labels), lag_ratio=0.22), run_time=4.6)
        self.wait(1.3)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(transform), FadeOut(bessel), FadeOut(labels), FadeOut(boundary), FadeOut(time_curve), FadeOut(profile), run_time=0.7)

    def scene_07_m04_parameter_fit(self) -> None:
        title = Text("Fit the solution to five observation wells", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Schematic residuals; Levenberg-Marquardt estimates", font="Arial", font_size=22, color=MUTED).to_edge(DOWN, buff=0.45)
        names = ["LC", "SP-2", "BHPL", "CL-2", "CHLN-2"]
        axes_panels = VGroup()
        labels = VGroup()
        for index, name in enumerate(names):
            x = -5.25 + 2.62 * index
            axis = VGroup(Line([x - 0.85, -1.35, 0], [x - 0.85, 1.45, 0], color=MUTED), Line([x - 0.85, -1.35, 0], [x + 0.85, -1.35, 0], color=MUTED))
            fit = VMobject(color=TEAL, stroke_width=3).set_points_smoothly([[x - 0.75, -1.05, 0], [x - 0.25, -0.3 + 0.05 * index, 0], [x + 0.35, 0.55, 0], [x + 0.75, 0.95, 0]])
            points = VGroup(*[Dot([x - 0.65 + 0.28 * j, -0.95 + 0.38 * j + 0.08 * (-1) ** (j + index), 0], radius=0.045, color=INK) for j in range(6)])
            pulls = VGroup(*[Line(point.get_center(), [point.get_center()[0], fit.point_from_proportion(min(0.98, 0.12 + 0.15 * j))[1], 0], color=RED, stroke_width=1.5) for j, point in enumerate(points)])
            axes_panels.add(axis, fit, points, pulls)
            labels.add(Text(name, font="Arial", font_size=19, color=INK).move_to([x, 1.85, 0]))
        assert_scene_layout(scene=self, pending_items=[title, caption, labels, axes_panels], labels=[title, caption, labels], blockers=[axes_panels], frame_items=[title, caption, labels, axes_panels], intentional_overlaps=[(axes_panels, axes_panels)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(axes_panels), FadeIn(labels), lag_ratio=0.35), run_time=4.5)
        self.wait(1.3)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(labels), FadeOut(axes_panels), run_time=0.7)

    def scene_08_m05_see_comparison(self) -> None:
        title = Text("Reported fit error falls at four wells", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Table 2 standard error of estimate (m); CHLN-2 is equal after rounding", font="Arial", font_size=21, color=MUTED).to_edge(DOWN, buff=0.45)
        names = ["LC", "SP-2", "BHPL", "CL-2", "CHLN-2"]
        case1 = [0.299, 0.114, 0.041, 0.011, 0.009]
        case2 = [0.153, 0.103, 0.037, 0.008, 0.009]
        axis = Line(LEFT * 3.35 + DOWN * 2.05, RIGHT * 5.2 + DOWN * 2.05, color=MUTED)
        bars = VGroup()
        labels = VGroup(Text("Case 1", font="Arial", font_size=20, color=MUTED).move_to(RIGHT * 4.2 + UP * 2.05), Text("Case 2", font="Arial", font_size=20, color=TEAL).move_to(RIGHT * 5.35 + UP * 2.05))
        for index, (name, first, second) in enumerate(zip(names, case1, case2, strict=True)):
            y = 1.45 - 0.72 * index
            labels.add(Text(name, font="Arial", font_size=20, color=INK).move_to(LEFT * 4.55 + UP * y))
            bars.add(Rectangle(width=max(0.15, first * 18), height=0.20, stroke_opacity=0, fill_color=MUTED, fill_opacity=0.75).align_to(LEFT * 3.35, LEFT).move_to([-3.35 + max(0.15, first * 18) / 2, y + 0.15, 0]))
            bars.add(Rectangle(width=max(0.15, second * 18), height=0.20, stroke_opacity=0, fill_color=TEAL, fill_opacity=0.95).align_to(LEFT * 3.35, LEFT).move_to([-3.35 + max(0.15, second * 18) / 2, y - 0.15, 0]))
            labels.add(Text(f"{first:.3f} / {second:.3f}", font="Arial", font_size=17, color=INK).move_to(RIGHT * 4.78 + UP * y))
        chart = VGroup(axis, bars)
        assert_scene_layout(scene=self, pending_items=[title, caption, labels, chart], labels=[title, caption, labels], blockers=[chart], frame_items=[title, caption, labels, chart], intentional_overlaps=[(chart, chart)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(axis), FadeIn(bars), FadeIn(labels), lag_ratio=0.28), run_time=4.5)
        self.wait(1.5)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(labels), FadeOut(chart), run_time=0.7)

    def scene_09_m06_distance_trends(self) -> None:
        title = Text("The fitted clocks remain site conditioned", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        caption = Text("Figure 5: lag time (d) versus distance (m); BHPL excluded", font="Arial", font_size=21, color=MUTED).to_edge(DOWN, buff=0.45)
        axes = Axes(x_range=[0, 3800, 1000], y_range=[0, 10, 2], x_length=8.2, y_length=4.25, axis_config={"color": MUTED, "font_size": 20}).shift(LEFT * 0.7 + DOWN * 0.15)
        points = VGroup(Dot([-4.351, -2.239, 0], radius=0.075, color=TEAL), Dot([-3.682, -2.189, 0], radius=0.075, color=TEAL), Dot([1.054, -1.379, 0], radius=0.075, color=TEAL), Dot([2.895, 1.278, 0], radius=0.075, color=TEAL), Circle(radius=0.075, color=GOLD).move_to([-4.351, -2.190, 0]), Circle(radius=0.075, color=GOLD).move_to([-3.682, -2.112, 0]), Circle(radius=0.075, color=GOLD).move_to([1.054, -2.254, 0]), Circle(radius=0.075, color=GOLD).move_to([2.895, 0.763, 0]))
        trends = VGroup(Line([-3.822, -2.275, 0], [3.184, 0.584, 0], color=TEAL, stroke_width=4), DashedLine([-3.805, -2.275, 0], [3.184, -0.200, 0], color=GOLD, stroke_width=4))
        bhpl_point = Dot(RIGHT * 4.95 + UP * 0.25, radius=0.1, color=RED)
        bhpl_label = Text("BHPL excluded", font="Arial", font_size=20, color=RED).next_to(bhpl_point, DOWN, buff=0.2)
        labels = VGroup(Text("flux lag", font="Arial", font_size=20, color=TEAL).move_to(RIGHT * 4.8 + UP * 1.8), Text("gradient lag", font="Arial", font_size=20, color=GOLD).move_to(RIGHT * 4.8 + UP * 1.35), bhpl_label)
        chart = VGroup(axes, points, trends, bhpl_point)
        assert_scene_layout(scene=self, pending_items=[title, caption, labels, chart], labels=[title, caption, labels], blockers=[chart], frame_items=[title, caption, labels, chart], intentional_overlaps=[(chart, chart)])
        self.play(FadeIn(title), FadeIn(caption), LaggedStart(Create(axes), FadeIn(points), Create(trends), FadeIn(bhpl_point), FadeIn(labels), lag_ratio=0.24), run_time=4.4)
        self.wait(1.4)
        self.play(FadeOut(title), FadeOut(caption), FadeOut(labels), FadeOut(chart), run_time=0.7)

    def scene_10_return_to_field(self) -> None:
        title = Text("Return the two clocks to the pumping test", font="Arial", font_size=39, color=INK).to_edge(UP, buff=0.45)
        conclusion = Text("A testable diagnostic - not a universal lag constant", font="Arial", font_size=28, color=INK).to_edge(DOWN, buff=0.45)
        aquifer = Rectangle(width=11.8, height=2.65, color=TEAL, fill_color=PALE, fill_opacity=0.75).shift(DOWN * 0.25)
        pump = Rectangle(width=0.2, height=3.2, color=RED, fill_color=RED, fill_opacity=1).shift(LEFT * 4.6)
        wells = VGroup(Line([-3.2, -1.4, 0], [-3.2, 1.0, 0], color=MUTED, stroke_width=3), Line([-2.1, -1.4, 0], [-2.1, 1.0, 0], color=MUTED, stroke_width=3), Line([-0.4, -1.4, 0], [-0.4, 1.0, 0], color=MUTED, stroke_width=3), Line([1.9, -1.4, 0], [1.9, 1.0, 0], color=MUTED, stroke_width=3), Line([4.0, -1.4, 0], [4.0, 1.0, 0], color=MUTED, stroke_width=3))
        response = VMobject(color=TEAL, stroke_width=5)
        response.set_points_smoothly([[-3.8, 0.8, 0], [-3.0, 0.35, 0], [-2.2, -0.35, 0], [-0.6, 0.12, 0], [3.9, 0.72, 0]])
        band = Rectangle(width=1.35, height=2.5, stroke_color=GOLD, fill_color=GOLD, fill_opacity=0.18).shift(LEFT * 3.0 + DOWN * 0.22)
        clock_faces = VGroup(Circle(radius=0.48, color=TEAL, stroke_width=4).shift(LEFT * 3.4 + UP * 2.15), Circle(radius=0.48, color=RED, stroke_width=4).shift(RIGHT * 3.4 + UP * 2.15))
        clock_labels = VGroup(MathTex(r"\tau_q", color=TEAL).scale(0.65).shift(LEFT * 4.25 + UP * 2.15), MathTex(r"\tau_s", color=RED).scale(0.65).shift(RIGHT * 4.25 + UP * 2.15))
        labels = VGroup(Text("early-time evidence", font="Arial", font_size=22, color=GOLD).move_to(LEFT * 0.6 + UP * 1.45), clock_labels)
        field = VGroup(aquifer, pump, wells, response, band)
        assert_scene_layout(scene=self, pending_items=[title, conclusion, labels, clock_faces, field], labels=[title, conclusion, labels], blockers=[clock_faces, field], frame_items=[title, conclusion, labels, clock_faces, field], intentional_overlaps=[(field, field), (labels, labels)])
        self.play(FadeIn(title), FadeIn(conclusion), LaggedStart(FadeIn(aquifer), FadeIn(pump), Create(wells), Create(response), FadeIn(band), Create(clock_faces), FadeIn(labels), lag_ratio=0.16), run_time=4.5)
        self.wait(2.2)
