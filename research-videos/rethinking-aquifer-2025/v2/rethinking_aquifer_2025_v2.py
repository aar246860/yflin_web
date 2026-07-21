# /// script
# requires-python = ">=3.11"
# dependencies = ["manim==0.20.1"]
# ///
# --- How to run ---
# uv run --with manim==0.20.1 manim -qh --fps 30 --media_dir media rethinking_aquifer_2025_v2.py RethinkingAquifer2025V2
# noqa: SIZE_OK
# One-file ownership keeps the exported twenty-scene film reproducible with one directly rendered helper per audited scene.
from __future__ import annotations

import math
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
    Create,
    DashedLine,
    Dot,
    FadeIn,
    FadeOut,
    LaggedStart,
    Line,
    MathTex,
    Polygon,
    Rectangle,
    Scene,
    Text,
    VGroup,
    VMobject,
    Write,
    config,
)

from assets.research_manim_layout import assert_inside, assert_scene_layout

PAPER: Final = "#F6F8F5"
INK: Final = "#112D32"
TEAL: Final = "#087F8C"
MUTED: Final = "#566D70"
BRICK: Final = "#B64A35"
OCHRE: Final = "#B77A1F"
PALE: Final = "#D7ECE8"
SAND: Final = "#F0E4CC"
config.background_color = PAPER
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30


class RethinkingAquifer2025V2(Scene):
    def construct(self) -> None:
        self.scene_01_b01_darcy_continuity()
        self.scene_02_b02_non_simultaneous()
        self.scene_03_b03_penalized_question()
        self.scene_04_b04_diagnostic_boundary()
        self.scene_05_m01_shifted_law()
        self.scene_06_m02_lag_regimes()
        self.scene_07_m03_theta_ratio()
        self.scene_08_m04_paper_association()
        self.scene_09_m05_characteristic_time()
        self.scene_10_m06_normalized_time()
        self.scene_11_m07_trf_fit()
        self.scene_12_m08_information_criteria()
        self.scene_13_m09_cross_site()
        self.scene_14_m10_copula_interpolation()
        self.scene_15_m11_percentile_width()
        self.scene_16_m12_theta_field()
        self.scene_17_m13_linear_time()
        self.scene_18_m14_log_time()
        self.scene_19_m15_conditional_implications()
        self.scene_20_return()

    def scene_01_b01_darcy_continuity(self) -> None:
        self.clear()
        heading = Text("What does a pumping test usually tell us?", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Darcy plus continuity separates transmission from stored-water release", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        aquifer = Rectangle(width=11.4, height=3.2, color=TEAL, fill_color=PALE, fill_opacity=0.72, stroke_width=3).shift(DOWN * 0.30)
        well = Rectangle(width=0.20, height=3.7, color=BRICK, fill_color=BRICK, fill_opacity=1, stroke_width=3).shift(UP * 0.25)
        cone = VMobject(color=TEAL, stroke_width=6)
        cone.set_points_smoothly([[-5.3, 0.45, 0], [-2.7, 0.35, 0], [0, -0.62, 0], [2.7, 0.35, 0], [5.3, 0.45, 0]])
        flow = VGroup(
            Arrow([-4.8, -0.35, 0], [-0.35, -0.35, 0], buff=0.05, color=TEAL, stroke_width=5),
            Arrow([4.8, -0.35, 0], [0.35, -0.35, 0], buff=0.05, color=TEAL, stroke_width=5),
            Arrow([-3.5, -1.15, 0], [-0.30, -0.55, 0], buff=0.05, color=TEAL, stroke_width=4),
            Arrow([3.5, -1.15, 0], [0.30, -0.55, 0], buff=0.05, color=TEAL, stroke_width=4),
        )
        labels = VGroup(
            Text("transmissivity", font="Arial", font_size=25, color=TEAL).move_to(LEFT * 4.15 + UP * 1.78),
            Text("storage", font="Arial", font_size=25, color=OCHRE).move_to(RIGHT * 4.35 + DOWN * 2.27),
        )
        geometry = VGroup(aquifer, cone, flow, well, labels)
        assert_scene_layout(
            scene=self,
            pending_items=[heading, caption, geometry],
            labels=[heading, caption, labels],
            blockers=[aquifer, cone, flow, well],
            frame_items=[heading, caption, geometry],
            intentional_overlaps=[
                (geometry, geometry),
                (aquifer, cone),
                (aquifer, flow),
                (aquifer, well),
                (cone, flow),
                (cone, well),
            ],
        )
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(FadeIn(aquifer), Create(cone), Create(flow), FadeIn(well), FadeIn(labels), lag_ratio=0.22), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_02_b02_non_simultaneous(self) -> None:
        self.clear()
        heading = Text("One disturbance can produce two response times", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The paper allows either response to lead in complex media", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        axes = Axes(x_range=[0, 10, 2], y_range=[0, 1.2, 0.2], x_length=10.0, y_length=3.7, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(DOWN * 0.15)
        flux = VMobject(color=TEAL, stroke_width=6)
        flux.set_points_smoothly([axes.c2p(x / 10, math.exp(-0.80 * (x / 10 - 3.6) ** 2)) for x in range(1, 96, 2)])
        gradient = VMobject(color=BRICK, stroke_width=6)
        gradient.set_points_smoothly([axes.c2p(x / 10, 0.92 * math.exp(-0.72 * (x / 10 - 6.1) ** 2)) for x in range(1, 96, 2)])
        origin = DashedLine(ORIGIN, RIGHT * 0.01, color=MUTED, stroke_width=2)
        origin.put_start_and_end_on(axes.c2p(1.0, 0), axes.c2p(1.0, 1.08))
        flux_marker = DashedLine(ORIGIN, RIGHT * 0.01, color=TEAL, stroke_width=2)
        flux_marker.put_start_and_end_on(axes.c2p(3.6, 0), axes.c2p(3.6, 1.02))
        gradient_marker = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        gradient_marker.put_start_and_end_on(axes.c2p(6.1, 0), axes.c2p(6.1, 0.96))
        markers = VGroup(flux_marker, gradient_marker)
        labels = VGroup(
            Text("flux response", font="Arial", font_size=23, color=TEAL).move_to(LEFT * 2.45 + UP * 2.22),
            Text("gradient response", font="Arial", font_size=23, color=BRICK).move_to(RIGHT * 2.55 + UP * 2.22),
            Text("no universal lead", font="Arial", font_size=22, color=OCHRE).move_to(DOWN * 2.58),
        )
        geometry = VGroup(axes, flux, gradient, origin, markers, labels)
        assert_scene_layout(
            scene=self,
            pending_items=[heading, caption, geometry],
            labels=[heading, caption, labels],
            blockers=[axes, flux, gradient, origin, markers],
            frame_items=[heading, caption, geometry],
            intentional_overlaps=[
                (geometry, geometry),
                (axes, flux),
                (axes, gradient),
                (axes, origin),
                (axes, markers),
                (flux, gradient),
                (flux, origin),
                (flux, markers),
                (gradient, origin),
                (gradient, markers),
            ],
        )
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axes), Create(origin), Create(flux), Create(gradient), Create(markers), FadeIn(labels), lag_ratio=0.20), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_03_b03_penalized_question(self) -> None:
        self.clear()
        heading = Text("Do two extra clocks earn their complexity?", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Better fit is tested against explicit AIC and BIC penalties", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.0, 0.2], x_length=6.7, y_length=3.4, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 2.2 + DOWN * 0.15)
        observation_1 = Dot(radius=0.065, color=INK)
        observation_1.move_to(axes.c2p(0.6, 0.16))
        observation_2 = Dot(radius=0.065, color=INK)
        observation_2.move_to(axes.c2p(1.4, 0.27))
        observation_3 = Dot(radius=0.065, color=INK)
        observation_3.move_to(axes.c2p(2.2, 0.43))
        observation_4 = Dot(radius=0.065, color=INK)
        observation_4.move_to(axes.c2p(3.1, 0.59))
        observation_5 = Dot(radius=0.065, color=INK)
        observation_5.move_to(axes.c2p(4.1, 0.72))
        observation_6 = Dot(radius=0.065, color=INK)
        observation_6.move_to(axes.c2p(5.2, 0.82))
        observations = VGroup(observation_1, observation_2, observation_3, observation_4, observation_5, observation_6)
        darcy_curve = VMobject(color=MUTED, stroke_width=3)
        darcy_curve.set_points_smoothly([axes.c2p(x / 10, 0.10 + 0.74 * (1 - math.exp(-0.48 * x / 10))) for x in range(2, 57, 2)])
        lag_curve = VMobject(color=TEAL, stroke_width=6)
        lag_curve.set_points_smoothly([axes.c2p(x / 10, 0.08 + 0.78 * (1 - math.exp(-0.55 * max(0.0, x / 10 - 0.18)))) for x in range(2, 57, 2)])
        beam = Line([2.1, 0.15, 0], [5.8, 0.15, 0], color=INK, stroke_width=4)
        pivot = Polygon([3.65, 0.15, 0], [3.25, -0.55, 0], [4.05, -0.55, 0], color=OCHRE, fill_color=SAND, fill_opacity=0.8)
        penalties = VGroup(Circle(radius=0.32, color=OCHRE, fill_color=OCHRE, fill_opacity=0.75).move_to([2.65, 0.55, 0]), Circle(radius=0.42, color=BRICK, fill_color=BRICK, fill_opacity=0.72).move_to([5.15, 0.62, 0]))
        labels = VGroup(
            Text("2 parameters", font="Arial", font_size=21, color=MUTED).move_to(LEFT * 4.35 + UP * 2.18),
            Text("4 parameters", font="Arial", font_size=21, color=TEAL).move_to(LEFT * 1.30 + UP * 2.18),
            Text("fit", font="Arial", font_size=22, color=TEAL).move_to([2.65, 1.20, 0]),
            Text("complexity", font="Arial", font_size=22, color=BRICK).move_to([5.15, 1.38, 0]),
        )
        geometry = VGroup(axes, observations, darcy_curve, lag_curve, beam, pivot, penalties, labels)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, labels], blockers=[axes, observations, darcy_curve, lag_curve, beam, pivot, penalties], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (axes, observations), (axes, darcy_curve), (axes, lag_curve), (observations, darcy_curve), (observations, lag_curve), (darcy_curve, lag_curve), (beam, pivot)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axes), FadeIn(observations), Create(darcy_curve), Create(lag_curve), Create(beam), FadeIn(pivot), FadeIn(penalties), FadeIn(labels), lag_ratio=0.17), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_04_b04_diagnostic_boundary(self) -> None:
        self.clear()
        heading = Text("Diagnostics organize evidence; they do not identify a mechanism", font="Arial", font_size=34, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Field characterization remains necessary", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        gauge_data = VGroup(Line([-5.3, 0.9, 0], [-1.3, 0.9, 0], color=INK, stroke_width=4), Dot([-3.25, 0.9, 0], radius=0.15, color=OCHRE))
        theta_label = MathTex(r"\theta", color=OCHRE).scale(1.2).move_to([-3.25, 1.55, 0])
        clock = VGroup(Circle(radius=0.85, color=TEAL, stroke_width=5), Line([0, 0, 0], [0.42, 0.34, 0], color=TEAL, stroke_width=5)).shift(LEFT * 3.25 + DOWN * 1.05)
        fracture = VGroup(
            Line([-0.7, -1.75, 0], [-0.05, 0.15, 0], color=MUTED, stroke_width=2),
            Line([0.2, -1.75, 0], [0.85, 0.15, 0], color=MUTED, stroke_width=2),
            Line([1.1, -1.75, 0], [1.75, 0.15, 0], color=MUTED, stroke_width=2),
        )
        pores = VGroup(
            Circle(radius=0.30, color=MUTED, stroke_width=2).move_to([2.4, 1.1, 0]),
            Circle(radius=0.22, color=MUTED, stroke_width=2).move_to([3.5, 1.45, 0]),
            Circle(radius=0.36, color=MUTED, stroke_width=2).move_to([4.5, 0.85, 0]),
            Circle(radius=0.25, color=MUTED, stroke_width=2).move_to([2.8, -0.1, 0]),
            Circle(radius=0.28, color=MUTED, stroke_width=2).move_to([4.1, -0.35, 0]),
            Circle(radius=0.18, color=MUTED, stroke_width=2).move_to([5.0, -0.5, 0]),
        )
        projections = VGroup(Arrow([-2.25, 0.65, 0], [0.2, 0.30, 0], buff=0.12, color=OCHRE, stroke_width=3), Arrow([-2.55, -0.85, 0], [2.25, -0.05, 0], buff=0.12, color=TEAL, stroke_width=3))
        field_paths = VGroup(DashedLine([0.0, -2.05, 0], [2.4, -1.45, 0], color=OCHRE, stroke_width=3), DashedLine([2.4, -1.45, 0], [5.1, -1.85, 0], color=TEAL, stroke_width=3))
        labels = VGroup(
            Text("diagnostic projection", font="Arial", font_size=22, color=OCHRE).move_to(LEFT * 3.25 + UP * 2.1),
            Text("several possible structures", font="Arial", font_size=22, color=MUTED).move_to(RIGHT * 3.15 + UP * 2.0),
            Text("geophysics", font="Arial", font_size=20, color=OCHRE).move_to([1.15, -2.50, 0]),
            Text("tracers", font="Arial", font_size=20, color=TEAL).move_to([4.2, -2.18, 0]),
        )
        geometry = VGroup(gauge_data, theta_label, clock, fracture, pores, projections, field_paths, labels)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, theta_label, labels], blockers=[gauge_data, clock, fracture, pores, projections, field_paths], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (clock, projections), (fracture, projections), (fracture, field_paths)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(gauge_data), FadeIn(theta_label), Create(clock), Create(projections), Create(fracture), Create(pores), Create(field_paths), FadeIn(labels), lag_ratio=0.18), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_05_m01_shifted_law(self) -> None:
        self.clear()
        heading = Text("Shift the flux and gradient on one time axis", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Equation 2 keeps the linear relation but evaluates two shifted responses", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        axis = Arrow([-5.6, 0.45, 0], [5.6, 0.45, 0], buff=0.05, color=INK, stroke_width=4)
        origin = Dot([-4.8, 0.45, 0], radius=0.11, color=INK)
        q_mark = DashedLine([-1.6, -0.10, 0], [-1.6, 1.35, 0], color=TEAL, stroke_width=3)
        q_label = MathTex(r"t+\tau_q", color=TEAL).scale(0.88).move_to([-1.6, 1.72, 0])
        s_mark = DashedLine([2.0, -0.10, 0], [2.0, 1.35, 0], color=BRICK, stroke_width=3)
        s_label = MathTex(r"t+\tau_s", color=BRICK).scale(0.88).move_to([2.0, 1.72, 0])
        brackets = VGroup(Arrow([-4.75, -0.42, 0], [-1.68, -0.42, 0], buff=0.02, color=TEAL, stroke_width=4), Arrow([-4.75, -1.05, 0], [1.92, -1.05, 0], buff=0.02, color=BRICK, stroke_width=4))
        formula = MathTex(r"\mathbf{q}(t+\tau_q)=\mathbf{K}\nabla s(t+\tau_s)", color=INK).scale(0.98).to_edge(DOWN, buff=0.86)
        geometry = VGroup(axis, origin, q_mark, q_label, s_mark, s_label, brackets, formula)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, q_label, s_label, formula], blockers=[axis, origin, q_mark, s_mark, brackets], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (axis, origin), (axis, q_mark), (axis, s_mark)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axis), FadeIn(origin), Create(q_mark), FadeIn(q_label), Create(s_mark), FadeIn(s_label), Create(brackets), Write(formula), lag_ratio=0.20), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_06_m02_lag_regimes(self) -> None:
        self.clear()
        heading = Text("The two lags have three exhaustive orderings", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Ordering is an interpreted association, not causal proof", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        rows = VGroup(
            Line([-5.2, 1.35, 0], [2.8, 1.35, 0], color=MUTED, stroke_width=2),
            Line([-5.2, 0.0, 0], [2.8, 0.0, 0], color=MUTED, stroke_width=2),
            Line([-5.2, -1.35, 0], [2.8, -1.35, 0], color=MUTED, stroke_width=2),
        )
        q_dots = VGroup(Dot([-1.0, 1.35, 0], radius=0.14, color=TEAL), Dot([-2.0, 0.0, 0], radius=0.14, color=TEAL), Dot([-3.0, -1.35, 0], radius=0.14, color=TEAL))
        s_dots = VGroup(Dot([-3.0, 1.35, 0], radius=0.14, color=BRICK), Dot([-2.0, 0.0, 0], radius=0.14, color=BRICK), Dot([-1.0, -1.35, 0], radius=0.14, color=BRICK))
        formulas = VGroup(
            MathTex(r"\tau_q>\tau_s", color=INK).move_to([4.25, 1.35, 0]),
            MathTex(r"\tau_q=\tau_s", color=INK).move_to([4.25, 0.0, 0]),
            MathTex(r"\tau_q<\tau_s", color=INK).move_to([4.25, -1.35, 0]),
        )
        labels = VGroup(MathTex(r"\tau_q", color=TEAL).scale(0.8).move_to([-5.45, 2.15, 0]), MathTex(r"\tau_s", color=BRICK).scale(0.8).move_to([-4.55, 2.15, 0]), Text("same two clocks", font="Arial", font_size=21, color=MUTED).move_to([-2.0, 2.15, 0]))
        geometry = VGroup(rows, q_dots, s_dots, formulas, labels)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, formulas, labels], blockers=[rows, q_dots, s_dots], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (rows, q_dots), (rows, s_dots), (q_dots, s_dots)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(rows), FadeIn(q_dots), FadeIn(s_dots), Write(formulas), FadeIn(labels), lag_ratio=0.24), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_07_m03_theta_ratio(self) -> None:
        self.clear()
        heading = Text("Collapse two clock distances into one diagnostic ratio", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Theta encodes relative lag order; it is not a new mechanism", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        q_bracket = Arrow([-5.2, 1.25, 0], [-1.5, 1.25, 0], buff=0.03, color=TEAL, stroke_width=6)
        s_bracket = Arrow([-5.2, 0.20, 0], [0.2, 0.20, 0], buff=0.03, color=BRICK, stroke_width=6)
        source_labels = VGroup(MathTex(r"\tau_q", color=TEAL).move_to([-3.35, 1.75, 0]), MathTex(r"\tau_s", color=BRICK).move_to([-2.50, -0.35, 0]))
        formula = MathTex(r"\theta=\frac{\tau_s}{\tau_q}", color=INK).scale(1.25).move_to([1.55, 0.75, 0])
        gauge_data = VGroup(Line([0.3, -1.25, 0], [5.3, -1.25, 0], color=INK, stroke_width=4), Line([2.8, -1.55, 0], [2.8, -0.95, 0], color=OCHRE, stroke_width=6), Dot([3.75, -1.25, 0], radius=0.16, color=OCHRE))
        one_label = MathTex(r"1", color=INK).scale(0.75).move_to([2.8, -1.82, 0])
        geometry = VGroup(q_bracket, s_bracket, source_labels, formula, gauge_data, one_label)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, source_labels, formula, one_label], blockers=[q_bracket, s_bracket, gauge_data], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(q_bracket), Create(s_bracket), FadeIn(source_labels), Write(formula), Create(gauge_data), FadeIn(one_label), lag_ratio=0.24), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_08_m04_paper_association(self) -> None:
        self.clear()
        heading = Text("The paper associates regimes around theta equals one", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Association is diagnostic language, not causal proof", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        baseline = Line([-5.4, 0.2, 0], [5.4, 0.2, 0], color=INK, stroke_width=5)
        left_zone = Line([-5.2, 0.2, 0], [-0.25, 0.2, 0], color=TEAL, stroke_width=14)
        right_zone = Line([0.25, 0.2, 0], [5.2, 0.2, 0], color=BRICK, stroke_width=14)
        threshold = Line([0, -0.55, 0], [0, 1.25, 0], color=OCHRE, stroke_width=6)
        threshold_label = MathTex(r"\theta=1", color=OCHRE).move_to([0, 1.72, 0])
        inertia = VGroup(Arrow([-4.4, -1.25, 0], [-2.2, -1.25, 0], buff=0.05, color=TEAL, stroke_width=6), Circle(radius=0.28, color=TEAL, fill_color=TEAL, fill_opacity=0.28).move_to([-4.65, -1.25, 0]))
        micro = VGroup(
            Circle(radius=0.23, color=BRICK, stroke_width=2).move_to([2.35, -1.10, 0]),
            Circle(radius=0.23, color=BRICK, stroke_width=2).move_to([3.15, -1.45, 0]),
            Circle(radius=0.23, color=BRICK, stroke_width=2).move_to([4.0, -1.05, 0]),
            Circle(radius=0.23, color=BRICK, stroke_width=2).move_to([4.75, -1.45, 0]),
        )
        formulas = VGroup(MathTex(r"\theta<1", color=TEAL).move_to([-3.25, 0.95, 0]), MathTex(r"\theta>1", color=BRICK).move_to([3.25, 0.95, 0]))
        labels = VGroup(Text("inertial association", font="Arial", font_size=23, color=TEAL).move_to([-3.30, -2.0, 0]), Text("microstructural association", font="Arial", font_size=23, color=BRICK).move_to([3.55, -2.0, 0]), Text("the paper associates", font="Arial", font_size=22, color=OCHRE).move_to([0, 2.25, 0]))
        geometry = VGroup(baseline, left_zone, right_zone, threshold, threshold_label, inertia, micro, formulas, labels)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, threshold_label, formulas, labels], blockers=[baseline, left_zone, right_zone, threshold, inertia, micro], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (baseline, left_zone), (baseline, right_zone), (baseline, threshold)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(baseline), Create(left_zone), Create(right_zone), Create(threshold), FadeIn(threshold_label), Create(inertia), Create(micro), Write(formulas), FadeIn(labels), lag_ratio=0.17), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_09_m05_characteristic_time(self) -> None:
        self.clear()
        heading = Text("Build characteristic time from aquifer geometry and lag order", font="Arial", font_size=35, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Equation 4 defines a time scale without a universal direction", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        aquifer = Rectangle(width=5.7, height=2.4, color=TEAL, fill_color=PALE, fill_opacity=0.72, stroke_width=3).shift(LEFT * 3.25 + UP * 0.65)
        well = Rectangle(width=0.18, height=2.7, color=BRICK, fill_color=BRICK, fill_opacity=1).shift(LEFT * 4.75 + UP * 0.75)
        radius = Arrow([-4.55, 0.65, 0], [-1.0, 0.65, 0], buff=0.05, color=OCHRE, stroke_width=5)
        storage = Polygon([-4.45, -0.25, 0], [-2.75, -0.25, 0], [-3.55, -1.0, 0], color=OCHRE, fill_color=SAND, fill_opacity=0.75)
        clock = VGroup(Circle(radius=1.25, color=TEAL, stroke_width=6), Line([0, 0, 0], [0.72, 0.44, 0], color=TEAL, stroke_width=5), Circle(radius=0.13, color=OCHRE, fill_color=OCHRE, fill_opacity=1)).shift(RIGHT * 3.35 + UP * 0.55)
        gears = VGroup(Circle(radius=0.38, color=TEAL, stroke_width=4).move_to([2.55, -1.15, 0]), Circle(radius=0.52, color=BRICK, stroke_width=4).move_to([3.35, -1.45, 0]))
        labels = VGroup(MathTex(r"r", color=OCHRE).move_to([-5.0, 2.35, 0]), MathTex(r"S", color=OCHRE).move_to([-3.55, 2.35, 0]), MathTex(r"T", color=TEAL).move_to([-1.60, 2.35, 0]), MathTex(r"t_c", color=TEAL).scale(1.1).move_to([3.35, 2.10, 0]))
        formulas = VGroup(MathTex(r"\left(\frac{t_c}{\tau_s}\right)r^2\sim\frac{t_c^2}{S\tau_q/T}", color=INK).scale(0.74), MathTex(r"t_c\approx\frac{Sr^2}{T}\frac{\tau_q}{\tau_s}", color=INK).scale(0.82)).arrange(DOWN, buff=0.16).to_edge(DOWN, buff=0.67)
        geometry = VGroup(aquifer, well, radius, storage, clock, gears, labels, formulas)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, labels, formulas], blockers=[aquifer, well, radius, storage, clock, gears], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (aquifer, well), (aquifer, radius), (aquifer, storage)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(FadeIn(aquifer), FadeIn(well), Create(radius), FadeIn(storage), Create(clock), Create(gears), FadeIn(labels), Write(formulas), lag_ratio=0.15), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_10_m06_normalized_time(self) -> None:
        self.clear()
        heading = Text("Normalize the lagging clock by the Darcy clock", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The equation gives one ratio; later prose points both ways", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        lag_clock = VGroup(Circle(radius=1.18, color=TEAL, stroke_width=6), Line([0, 0, 0], [0.68, 0.38, 0], color=TEAL, stroke_width=5)).shift(LEFT * 3.25 + UP * 0.55)
        darcy_clock = VGroup(Circle(radius=1.18, color=MUTED, stroke_width=4), Line([0, 0, 0], [0.40, 0.67, 0], color=MUTED, stroke_width=4)).shift(RIGHT * 3.25 + UP * 0.55)
        clock_labels = VGroup(MathTex(r"t_c", color=TEAL).move_to([-3.25, 2.17, 0]), MathTex(r"t_{c,\mathrm{Darcy}}", color=MUTED).scale(0.8).move_to([3.25, 2.17, 0]))
        shared = VGroup(MathTex(r"Sr^2/T", color=OCHRE).move_to([-3.25, -1.05, 0]), MathTex(r"Sr^2/T", color=OCHRE).move_to([3.25, -1.05, 0]))
        divider = Line([-0.55, -0.25, 0], [0.55, -0.25, 0], color=INK, stroke_width=5)
        formula = VGroup(
            MathTex(r"\frac{t_c}{t_{c,\mathrm{Darcy}}}=\frac{\tau_q}{\tau_s}", color=INK),
            MathTex(r"\frac{\tau_q}{\tau_s}=\frac{1}{\theta}", color=INK),
        ).arrange(RIGHT, buff=0.55).scale(0.86).move_to([0, -1.45, 0])
        direction = VGroup(Arrow([-1.95, -2.22, 0], [-3.9, -2.22, 0], buff=0.05, color=BRICK, stroke_width=3), Arrow([1.95, -2.22, 0], [3.9, -2.22, 0], buff=0.05, color=TEAL, stroke_width=3))
        direction_label = Text("mixed directional statements", font="Arial", font_size=19, color=OCHRE).move_to([0, -2.22, 0])
        geometry = VGroup(lag_clock, darcy_clock, clock_labels, shared, divider, formula, direction, direction_label)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, clock_labels, shared, formula, direction_label], blockers=[lag_clock, darcy_clock, divider, direction], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(lag_clock), Create(darcy_clock), FadeIn(clock_labels), Write(shared), Create(divider), Write(formula), Create(direction), FadeIn(direction_label), lag_ratio=0.18), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_11_m07_trf_fit(self) -> None:
        self.clear()
        heading = Text("Fit four handles by trust-region-reflective least squares", font="Arial", font_size=35, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Each well estimate averages its radius of influence", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.0, 0.2], x_length=6.8, y_length=3.5, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 2.25 + UP * 0.15)
        observation_1 = Dot(radius=0.07, color=INK)
        observation_1.move_to(axes.c2p(0.7, 0.16))
        observation_2 = Dot(radius=0.07, color=INK)
        observation_2.move_to(axes.c2p(1.4, 0.29))
        observation_3 = Dot(radius=0.07, color=INK)
        observation_3.move_to(axes.c2p(2.2, 0.46))
        observation_4 = Dot(radius=0.07, color=INK)
        observation_4.move_to(axes.c2p(3.0, 0.58))
        observation_5 = Dot(radius=0.07, color=INK)
        observation_5.move_to(axes.c2p(4.0, 0.72))
        observation_6 = Dot(radius=0.07, color=INK)
        observation_6.move_to(axes.c2p(5.1, 0.81))
        observations = VGroup(observation_1, observation_2, observation_3, observation_4, observation_5, observation_6)
        fit = VMobject(color=TEAL, stroke_width=6)
        fit.set_points_smoothly([axes.c2p(x / 10, 0.08 + 0.80 * (1 - math.exp(-0.43 * x / 10))) for x in range(2, 57, 2)])
        residual_1 = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        residual_1.put_start_and_end_on(axes.c2p(0.7, 0.16), axes.c2p(0.7, 0.08 + 0.80 * (1 - math.exp(-0.43 * 0.7))))
        residual_2 = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        residual_2.put_start_and_end_on(axes.c2p(1.4, 0.29), axes.c2p(1.4, 0.08 + 0.80 * (1 - math.exp(-0.43 * 1.4))))
        residual_3 = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        residual_3.put_start_and_end_on(axes.c2p(2.2, 0.46), axes.c2p(2.2, 0.08 + 0.80 * (1 - math.exp(-0.43 * 2.2))))
        residual_4 = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        residual_4.put_start_and_end_on(axes.c2p(3.0, 0.58), axes.c2p(3.0, 0.08 + 0.80 * (1 - math.exp(-0.43 * 3.0))))
        residual_5 = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        residual_5.put_start_and_end_on(axes.c2p(4.0, 0.72), axes.c2p(4.0, 0.08 + 0.80 * (1 - math.exp(-0.43 * 4.0))))
        residual_6 = DashedLine(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=2)
        residual_6.put_start_and_end_on(axes.c2p(5.1, 0.81), axes.c2p(5.1, 0.08 + 0.80 * (1 - math.exp(-0.43 * 5.1))))
        residuals = VGroup(residual_1, residual_2, residual_3, residual_4, residual_5, residual_6)
        handles = VGroup(
            Circle(radius=0.34, color=OCHRE, fill_color=OCHRE, fill_opacity=0.18).move_to([2.25, 1.55, 0]),
            Circle(radius=0.34, color=TEAL, fill_color=TEAL, fill_opacity=0.18).move_to([3.25, 1.55, 0]),
            Circle(radius=0.34, color=BRICK, fill_color=BRICK, fill_opacity=0.18).move_to([4.25, 1.55, 0]),
            Circle(radius=0.34, color=MUTED, fill_color=MUTED, fill_opacity=0.18).move_to([5.25, 1.55, 0]),
        )
        handle_labels = VGroup(MathTex(r"S", color=OCHRE).move_to([2.25, 2.18, 0]), MathTex(r"T", color=TEAL).move_to([3.25, 2.18, 0]), MathTex(r"\tau_q", color=BRICK).scale(0.72).move_to([4.25, 2.18, 0]), MathTex(r"\tau_s", color=MUTED).scale(0.72).move_to([5.25, 2.18, 0]))
        trust_boundary = DashedLine([1.8, 0.85, 0], [5.7, 0.85, 0], color=OCHRE, stroke_width=2)
        support_domain = Circle(radius=0.86, color=MUTED, stroke_width=2).move_to([4.75, -1.35, 0])
        support_ring = Circle(radius=0.52, color=OCHRE, stroke_width=3).move_to([4.75, -1.35, 0])
        support_label = Text("support-volume average", font="Arial", font_size=19, color=MUTED).move_to([4.15, -2.58, 0])
        formula = MathTex(r"\min_{\Theta}\sum_j\left[s_{obs}^{(j)}-s(\Theta,t_j)\right]^2", color=INK).scale(0.72).move_to([-1.8, -2.42, 0])
        geometry = VGroup(axes, observations, fit, residuals, handles, handle_labels, trust_boundary, support_domain, support_ring, support_label, formula)
        assert_inside(support_domain, [support_ring], min_gap=0.08)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, handle_labels, support_label, formula], blockers=[axes, observations, fit, residuals, handles, trust_boundary, support_domain, support_ring], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (axes, observations), (axes, fit), (axes, residuals), (observations, fit), (observations, residuals), (fit, residuals), (support_domain, support_ring)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axes), FadeIn(observations), Create(fit), Create(residuals), FadeIn(handles), FadeIn(handle_labels), Create(trust_boundary), Create(support_domain), Create(support_ring), FadeIn(support_label), Write(formula), lag_ratio=0.11), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_12_m08_information_criteria(self) -> None:
        self.clear()
        heading = Text("AIC and BIC charge the extra flexibility", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Lower is relative preference among models—not physical truth", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        aic_beam = Line([-5.0, 1.15, 0], [-0.4, 1.15, 0], color=INK, stroke_width=5)
        bic_beam = Line([0.4, 1.15, 0], [5.0, 1.15, 0], color=INK, stroke_width=5)
        pivots = VGroup(Polygon([-2.7, 1.15, 0], [-3.1, 0.30, 0], [-2.3, 0.30, 0], color=OCHRE, fill_color=SAND, fill_opacity=0.8), Polygon([2.7, 1.15, 0], [2.3, 0.30, 0], [3.1, 0.30, 0], color=OCHRE, fill_color=SAND, fill_opacity=0.8))
        weights = VGroup(Circle(radius=0.34, color=TEAL, fill_color=TEAL, fill_opacity=0.72).move_to([-4.3, 1.62, 0]), Circle(radius=0.34, color=BRICK, fill_color=BRICK, fill_opacity=0.72).move_to([-1.1, 1.62, 0]), Circle(radius=0.34, color=TEAL, fill_color=TEAL, fill_opacity=0.72).move_to([1.1, 1.62, 0]), Circle(radius=0.49, color=BRICK, fill_color=BRICK, fill_opacity=0.72).move_to([4.3, 1.76, 0]))
        labels = VGroup(Text("fit", font="Arial", font_size=21, color=TEAL).move_to([-4.3, 2.22, 0]), Text("penalty", font="Arial", font_size=21, color=BRICK).move_to([-1.1, 2.22, 0]), Text("fit", font="Arial", font_size=21, color=TEAL).move_to([1.1, 2.22, 0]), Text("stronger penalty", font="Arial", font_size=21, color=BRICK).move_to([4.3, 2.64, 0]), MathTex(r"\mathrm{AIC}", color=INK).move_to([-2.7, -0.05, 0]), MathTex(r"\mathrm{BIC}", color=INK).move_to([2.7, -0.05, 0]))
        formulas = VGroup(MathTex(r"\mathrm{AIC}=2k-2\ln L", color=INK), MathTex(r"\mathrm{BIC}=k\ln J-2\ln L", color=INK)).arrange(RIGHT, buff=0.85).scale(0.78).move_to([0, -1.25, 0])
        preference = Arrow([3.9, -2.05, 0], [1.0, -2.05, 0], buff=0.04, color=OCHRE, stroke_width=4)
        preference_label = Text("lower", font="Arial", font_size=21, color=OCHRE).move_to([4.45, -2.05, 0])
        geometry = VGroup(aic_beam, bic_beam, pivots, weights, labels, formulas, preference, preference_label)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, labels, formulas, preference_label], blockers=[aic_beam, bic_beam, pivots, weights, preference], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (aic_beam, pivots), (bic_beam, pivots)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(aic_beam), Create(bic_beam), FadeIn(pivots), FadeIn(weights), FadeIn(labels), Write(formulas), Create(preference), FadeIn(preference_label), lag_ratio=0.19), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_13_m09_cross_site(self) -> None:
        self.clear()
        heading = Text("Repeat the relative comparison across examined sites", font="Arial", font_size=37, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The lagging model has lower AIC/BIC in the examined cases", font="Arial", font_size=19, color=MUTED).to_edge(DOWN, buff=0.30)
        spine = Line([-4.6, 2.1, 0], [-4.6, -2.0, 0], color=INK, stroke_width=4)
        site_nodes = VGroup(Dot([-4.6, 1.65, 0], radius=0.14, color=OCHRE), Dot([-4.6, 0.35, 0], radius=0.14, color=OCHRE), Dot([-4.6, -0.95, 0], radius=0.14, color=OCHRE))
        site_labels = VGroup(Text("India", font="Arial", font_size=24, color=INK).move_to([-5.35, 1.65, 0]), Text("United States", font="Arial", font_size=22, color=INK).move_to([-5.72, 0.35, 0]), Text("Taiwan", font="Arial", font_size=24, color=INK).move_to([-5.45, -0.95, 0]))
        baselines = VGroup(Line([-3.45, 1.65, 0], [5.1, 1.65, 0], color=MUTED, stroke_width=2), Line([-3.45, 0.35, 0], [5.1, 0.35, 0], color=MUTED, stroke_width=2), Line([-3.45, -0.95, 0], [5.1, -0.95, 0], color=MUTED, stroke_width=2))
        darcy_marks = VGroup(Dot([2.8, 1.65, 0], radius=0.14, color=MUTED), Dot([3.6, 0.35, 0], radius=0.14, color=MUTED), Dot([2.4, -0.95, 0], radius=0.14, color=MUTED))
        lag_marks = VGroup(Dot([0.25, 1.65, 0], radius=0.18, color=TEAL), Dot([0.75, 0.35, 0], radius=0.18, color=TEAL), Dot([-0.15, -0.95, 0], radius=0.18, color=TEAL))
        arrows = VGroup(Arrow([2.6, 1.65, 0], [0.45, 1.65, 0], buff=0.03, color=OCHRE, stroke_width=3), Arrow([3.4, 0.35, 0], [0.95, 0.35, 0], buff=0.03, color=OCHRE, stroke_width=3), Arrow([2.2, -0.95, 0], [0.05, -0.95, 0], buff=0.03, color=OCHRE, stroke_width=3))
        key = VGroup(Dot([1.4, -2.0, 0], radius=0.12, color=TEAL), Text("lagging", font="Arial", font_size=20, color=TEAL).move_to([2.15, -2.0, 0]), Dot([3.55, -2.0, 0], radius=0.10, color=MUTED), Text("Darcy", font="Arial", font_size=20, color=MUTED).move_to([4.2, -2.0, 0]))
        qualifier = Text("relative preference only", font="Arial", font_size=22, color=OCHRE).move_to([1.0, 2.25, 0])
        geometry = VGroup(spine, site_nodes, site_labels, baselines, darcy_marks, lag_marks, arrows, key, qualifier)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, site_labels, key[1], key[3], qualifier], blockers=[spine, site_nodes, baselines, darcy_marks, lag_marks, arrows, key[0], key[2]], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (spine, site_nodes), (baselines, darcy_marks), (baselines, lag_marks), (baselines, arrows), (lag_marks, arrows)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(spine), FadeIn(site_nodes), FadeIn(site_labels), Create(baselines), FadeIn(darcy_marks), FadeIn(lag_marks), Create(arrows), FadeIn(key), FadeIn(qualifier), lag_ratio=0.15), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_14_m10_copula_interpolation(self) -> None:
        self.clear()
        heading = Text("Interpolate between irregular well support volumes", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Copula fields are conditional interpolations, not direct observations", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        domain = Rectangle(width=10.6, height=4.55, color=INK, fill_color=PALE, fill_opacity=0.38, stroke_width=3).shift(DOWN * 0.05)
        field_fill = VGroup(Polygon([-5.0, 2.0, 0], [-0.2, 2.0, 0], [-1.2, -2.0, 0], [-5.0, -2.0, 0], color=TEAL, fill_color=TEAL, fill_opacity=0.14, stroke_width=0), Polygon([-0.2, 2.0, 0], [5.0, 2.0, 0], [5.0, -2.0, 0], [-1.2, -2.0, 0], color=OCHRE, fill_color=OCHRE, fill_opacity=0.12, stroke_width=0))
        wells = VGroup(Dot([-3.8, 1.25, 0], radius=0.13, color=INK), Dot([-2.0, -0.95, 0], radius=0.13, color=INK), Dot([-0.4, 0.55, 0], radius=0.13, color=INK), Dot([1.4, -1.30, 0], radius=0.13, color=INK), Dot([3.45, 1.1, 0], radius=0.13, color=INK), Dot([4.2, -0.55, 0], radius=0.13, color=INK))
        support_rings = VGroup(Circle(radius=0.38, color=OCHRE, stroke_width=2).move_to([-3.8, 1.25, 0]), Circle(radius=0.38, color=OCHRE, stroke_width=2).move_to([-2.0, -0.95, 0]), Circle(radius=0.38, color=OCHRE, stroke_width=2).move_to([-0.4, 0.55, 0]), Circle(radius=0.38, color=OCHRE, stroke_width=2).move_to([1.4, -1.30, 0]), Circle(radius=0.38, color=OCHRE, stroke_width=2).move_to([3.45, 1.1, 0]), Circle(radius=0.38, color=OCHRE, stroke_width=2).move_to([4.2, -0.55, 0]))
        ribbons = VGroup(DashedLine([-3.8, 1.25, 0], [-2.0, -0.95, 0], color=TEAL, stroke_width=2), DashedLine([-2.0, -0.95, 0], [-0.4, 0.55, 0], color=TEAL, stroke_width=2), DashedLine([-0.4, 0.55, 0], [1.4, -1.30, 0], color=TEAL, stroke_width=2), DashedLine([1.4, -1.30, 0], [3.45, 1.1, 0], color=TEAL, stroke_width=2), DashedLine([3.45, 1.1, 0], [4.2, -0.55, 0], color=TEAL, stroke_width=2))
        labels = VGroup(Text("well support", font="Arial", font_size=21, color=INK).move_to([-4.15, 2.56, 0]), Text("copula dependence", font="Arial", font_size=21, color=TEAL).move_to([0.0, 2.56, 0]), Text("interpolated field", font="Arial", font_size=21, color=OCHRE).move_to([4.05, 2.56, 0]))
        geometry = VGroup(domain, field_fill, ribbons, support_rings, wells, labels)
        assert_inside(domain, [support_rings], min_gap=0.08)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, labels], blockers=[domain, field_fill, ribbons, support_rings, wells], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (domain, field_fill), (domain, ribbons), (domain, support_rings), (domain, wells), (field_fill, ribbons), (field_fill, support_rings), (field_fill, wells), (ribbons, support_rings), (ribbons, wells), (support_rings, wells)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(FadeIn(domain), FadeIn(field_fill), Create(ribbons), Create(support_rings), FadeIn(wells), FadeIn(labels), lag_ratio=0.22), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_15_m11_percentile_width(self) -> None:
        self.clear()
        heading = Text("Measure conditional width from the fifth to ninety-fifth percentile", font="Arial", font_size=32, color=INK).to_edge(UP, buff=0.38)
        caption = Text("These are copula conditional distributions, not posterior distributions", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        axes = Axes(x_range=[0, 10, 2], y_range=[0, 1.1, 0.2], x_length=9.4, y_length=3.8, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(UP * 0.20)
        cdf = VMobject(color=TEAL, stroke_width=6)
        cdf.set_points_smoothly([axes.c2p(x / 10, 1 / (1 + math.exp(-1.15 * (x / 10 - 5.0)))) for x in range(3, 98, 2)])
        q05_x, q95_x = 2.45, 7.55
        q05 = DashedLine(ORIGIN, RIGHT * 0.01, color=OCHRE, stroke_width=3)
        q05.put_start_and_end_on(axes.c2p(q05_x, 0), axes.c2p(q05_x, 0.95))
        q95 = DashedLine(ORIGIN, RIGHT * 0.01, color=OCHRE, stroke_width=3)
        q95.put_start_and_end_on(axes.c2p(q95_x, 0), axes.c2p(q95_x, 0.95))
        width_line = Line(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=7)
        width_line.put_start_and_end_on(axes.c2p(q05_x, 0.23), axes.c2p(q95_x, 0.23))
        width_left = Line(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=4)
        width_left.put_start_and_end_on(axes.c2p(q05_x, 0.14), axes.c2p(q05_x, 0.32))
        width_right = Line(ORIGIN, RIGHT * 0.01, color=BRICK, stroke_width=4)
        width_right.put_start_and_end_on(axes.c2p(q95_x, 0.14), axes.c2p(q95_x, 0.32))
        width_span = VGroup(width_line, width_left, width_right)
        q05_label = MathTex(r"Q_{0.05}", color=OCHRE).scale(0.78)
        q05_label.move_to(axes.c2p(q05_x, -0.16))
        q95_label = MathTex(r"Q_{0.95}", color=OCHRE).scale(0.78)
        q95_label.move_to(axes.c2p(q95_x, -0.16))
        width_label = MathTex(r"w_{90}=Q_{0.95}-Q_{0.05}", color=BRICK).scale(0.78).move_to([0, -2.72, 0])
        cdf_label = Text("conditional CDF", font="Arial", font_size=22, color=TEAL).move_to([3.65, 2.55, 0])
        labels = VGroup(q05_label, q95_label, width_label, cdf_label)
        geometry = VGroup(axes, cdf, q05, q95, width_span, labels)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, labels], blockers=[axes, cdf, q05, q95, width_span], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (axes, cdf), (axes, q05), (axes, q95), (axes, width_span), (cdf, q05), (cdf, q95), (cdf, width_span), (q05, width_span), (q95, width_span)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axes), Create(cdf), Create(q05), Create(q95), Create(width_span), FadeIn(labels), lag_ratio=0.22), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_16_m12_theta_field(self) -> None:
        self.clear()
        heading = Text("Divide interpolated lag fields into a theta field", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("The contour is interpolated; wells average support volumes", font="Arial", font_size=19, color=MUTED).to_edge(DOWN, buff=0.30)
        domain = Rectangle(width=10.5, height=3.8, color=INK, fill_color=PAPER, fill_opacity=1, stroke_width=3)
        below = Polygon([-5.0, 1.65, 0], [-1.25, 1.65, 0], [0.7, -1.65, 0], [-5.0, -1.65, 0], color=TEAL, fill_color=TEAL, fill_opacity=0.22, stroke_width=0)
        above = Polygon([-1.25, 1.65, 0], [5.0, 1.65, 0], [5.0, -1.65, 0], [0.7, -1.65, 0], color=BRICK, fill_color=BRICK, fill_opacity=0.16, stroke_width=0)
        contour = VMobject(color=OCHRE, stroke_width=7)
        contour.set_points_smoothly([[-1.25, 1.65, 0], [-0.7, 0.85, 0], [-0.15, 0.0, 0], [0.25, -0.80, 0], [0.7, -1.65, 0]])
        wells = VGroup(Dot([-3.7, 1.2, 0], radius=0.13, color=INK), Dot([-2.2, -0.9, 0], radius=0.13, color=INK), Dot([-0.35, 0.7, 0], radius=0.13, color=INK), Dot([1.5, -1.25, 0], radius=0.13, color=INK), Dot([3.3, 1.0, 0], radius=0.13, color=INK), Dot([4.1, -0.55, 0], radius=0.13, color=INK))
        support_rings = VGroup(Circle(radius=0.34, color=MUTED, stroke_width=2).move_to([-3.7, 1.2, 0]), Circle(radius=0.34, color=MUTED, stroke_width=2).move_to([-2.2, -0.9, 0]), Circle(radius=0.34, color=MUTED, stroke_width=2).move_to([-0.35, 0.7, 0]), Circle(radius=0.34, color=MUTED, stroke_width=2).move_to([1.5, -1.25, 0]), Circle(radius=0.34, color=MUTED, stroke_width=2).move_to([3.3, 1.0, 0]), Circle(radius=0.34, color=MUTED, stroke_width=2).move_to([4.1, -0.55, 0]))
        halos = VGroup(Circle(radius=0.52, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([-3.7, 1.2, 0]), Circle(radius=0.52, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([-2.2, -0.9, 0]), Circle(radius=0.52, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([-0.35, 0.7, 0]), Circle(radius=0.52, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([1.5, -1.25, 0]), Circle(radius=0.52, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([3.3, 1.0, 0]), Circle(radius=0.52, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([4.1, -0.55, 0]))
        formula = MathTex(r"\theta(x,y)=\frac{\tau_s(x,y)}{\tau_q(x,y)}", color=INK).scale(0.76).move_to([0, 2.48, 0])
        labels = VGroup(MathTex(r"\theta<1", color=TEAL).move_to([-4.15, 2.48, 0]), MathTex(r"\theta>1", color=BRICK).move_to([4.15, 2.48, 0]), MathTex(r"\theta=1", color=OCHRE).scale(0.78).move_to([0.0, -2.42, 0]), Text("interpolated", font="Arial", font_size=21, color=MUTED).move_to([4.05, -2.42, 0]))
        geometry = VGroup(domain, below, above, contour, support_rings, halos, wells, formula, labels)
        assert_inside(domain, [support_rings, halos], min_gap=0.08)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, formula, labels], blockers=[domain, below, above, contour, support_rings, halos, wells], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (domain, below), (domain, above), (domain, contour), (domain, support_rings), (domain, halos), (domain, wells), (below, above), (below, contour), (below, support_rings), (below, halos), (below, wells), (above, contour), (above, support_rings), (above, halos), (above, wells), (contour, support_rings), (contour, halos), (contour, wells), (support_rings, halos), (support_rings, wells), (halos, wells)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(FadeIn(domain), FadeIn(below), FadeIn(above), Create(contour), Create(support_rings), Create(halos), FadeIn(wells), Write(formula), FadeIn(labels), lag_ratio=0.14), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_17_m13_linear_time(self) -> None:
        self.clear()
        heading = Text("Compare characteristic times on linear axes", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Schematic point positions preserve only the paper-reported relation", font="Arial", font_size=20, color=MUTED).to_edge(DOWN, buff=0.30)
        axes = Axes(x_range=[0, 10, 2], y_range=[0, 10, 2], x_length=6.4, y_length=4.8, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 0.85)
        unity = DashedLine([-3.794, -2.208, 0], [2.03, 2.16, 0], color=MUTED, stroke_width=3)
        fitted = Line([-3.794, -1.92, 0], [1.71, 2.352, 0], color=TEAL, stroke_width=6)
        points = VGroup(Dot([-3.41, -1.584, 0], radius=0.075, color=INK), Dot([-2.642, -1.104, 0], radius=0.075, color=INK), Dot([-1.81, -0.336, 0], radius=0.075, color=INK), Dot([-0.978, 0.192, 0], radius=0.075, color=INK), Dot([-0.21, 0.912, 0], radius=0.075, color=INK), Dot([0.558, 1.344, 0], radius=0.075, color=INK), Dot([1.326, 2.064, 0], radius=0.075, color=INK))
        coordinate_labels = VGroup(MathTex(r"t_{c,\mathrm{Darcy}}", color=INK).scale(0.76).move_to([0.0, -3.02, 0]), MathTex(r"t_c", color=INK).scale(0.82).move_to([-4.90, 0.1, 0]))
        relation_labels = VGroup(Text("one to one", font="Arial", font_size=20, color=MUTED).move_to([4.20, 0.55, 0]), Text("reported fitted direction", font="Arial", font_size=20, color=TEAL).move_to([4.20, 1.65, 0]))
        statistic = MathTex(r"R^2=0.83", color=OCHRE).scale(1.05).move_to([4.25, -0.35, 0])
        qualifier = Text("schematic relation only", font="Arial", font_size=21, color=BRICK).move_to([4.15, -1.35, 0])
        geometry = VGroup(axes, unity, fitted, points, coordinate_labels, relation_labels, statistic, qualifier)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, coordinate_labels, relation_labels, statistic, qualifier], blockers=[axes, unity, fitted, points], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (axes, unity), (axes, fitted), (axes, points), (unity, fitted), (unity, points), (fitted, points)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axes), Create(unity), FadeIn(points), Create(fitted), FadeIn(coordinate_labels), FadeIn(relation_labels), Write(statistic), FadeIn(qualifier), lag_ratio=0.17), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_18_m14_log_time(self) -> None:
        self.clear()
        heading = Text("On log axes the same proportional relation tightens", font="Arial", font_size=37, color=INK).to_edge(UP, buff=0.38)
        caption = Text("A tighter relation does not resolve mixed directional statements", font="Arial", font_size=19, color=MUTED).to_edge(DOWN, buff=0.30)
        axes = Axes(x_range=[0, 5, 1], y_range=[0, 5, 1], x_length=6.4, y_length=4.8, axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False}).shift(LEFT * 0.85)
        unity = DashedLine([-3.666, -2.112, 0], [1.966, 2.112, 0], color=MUTED, stroke_width=3)
        fitted = Line([-3.666, -1.997, 0], [1.966, 2.227, 0], color=TEAL, stroke_width=6)
        points = VGroup(Dot([-3.154, -1.613, 0], radius=0.075, color=INK), Dot([-2.45, -1.123, 0], radius=0.075, color=INK), Dot([-1.746, -0.547, 0], radius=0.075, color=INK), Dot([-1.042, -0.067, 0], radius=0.075, color=INK), Dot([-0.21, 0.557, 0], radius=0.075, color=INK), Dot([0.558, 1.171, 0], radius=0.075, color=INK), Dot([1.39, 1.766, 0], radius=0.075, color=INK))
        coordinate_labels = VGroup(MathTex(r"\log t_{c,\mathrm{Darcy}}", color=INK).scale(0.70).move_to([0.0, -3.02, 0]), MathTex(r"\log t_c", color=INK).scale(0.76).move_to([-4.95, 0.1, 0]))
        statistic = MathTex(r"R^2=0.96", color=OCHRE).scale(1.05).move_to([4.2, 1.25, 0])
        direction = VGroup(Arrow([3.35, 0.05, 0], [5.1, 0.05, 0], buff=0.04, color=TEAL, stroke_width=4), Arrow([5.1, -0.85, 0], [3.35, -0.85, 0], buff=0.04, color=BRICK, stroke_width=4))
        direction_label = Text("both directions stated", font="Arial", font_size=21, color=OCHRE).move_to([4.2, -1.55, 0])
        qualifier = Text("no universal monotonic arrow", font="Arial", font_size=21, color=BRICK).move_to([4.65, -2.30, 0])
        geometry = VGroup(axes, unity, fitted, points, coordinate_labels, statistic, direction, direction_label, qualifier)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, coordinate_labels, statistic, direction_label, qualifier], blockers=[axes, unity, fitted, points, direction], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (axes, unity), (axes, fitted), (axes, points), (unity, fitted), (unity, points), (fitted, points)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(axes), Create(unity), FadeIn(points), Create(fitted), FadeIn(coordinate_labels), Write(statistic), Create(direction), FadeIn(direction_label), FadeIn(qualifier), lag_ratio=0.17), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_19_m15_conditional_implications(self) -> None:
        self.clear()
        heading = Text("Operational implications must pass through field evidence", font="Arial", font_size=36, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Management statements remain conditional extrapolations", font="Arial", font_size=19, color=MUTED).to_edge(DOWN, buff=0.30)
        branch = VGroup(Line([-5.0, 1.35, 0], [-1.1, 0.35, 0], color=TEAL, stroke_width=6), Line([-5.0, -1.35, 0], [-1.1, -0.35, 0], color=BRICK, stroke_width=6))
        branch_labels = VGroup(MathTex(r"\theta<1", color=TEAL).move_to([-4.25, 1.85, 0]), MathTex(r"\theta>1", color=BRICK).move_to([-4.25, -1.85, 0]))
        gate = Rectangle(width=1.6, height=2.35, color=OCHRE, fill_color=SAND, fill_opacity=0.75, stroke_width=5).move_to([0, 0, 0])
        gate_label = Text("field check", font="Arial", font_size=23, color=INK).move_to([0, 1.62, 0])
        timelines = VGroup(Line([1.0, 0.75, 0], [5.1, 0.75, 0], color=TEAL, stroke_width=5), Line([1.0, -0.75, 0], [5.1, -0.75, 0], color=BRICK, stroke_width=5))
        markers = VGroup(Dot([1.6, 0.75, 0], radius=0.10, color=TEAL), Dot([2.7, 0.75, 0], radius=0.10, color=TEAL), Dot([3.8, 0.75, 0], radius=0.10, color=TEAL), Dot([4.8, 0.75, 0], radius=0.10, color=TEAL), Dot([1.6, -0.75, 0], radius=0.10, color=BRICK), Dot([2.7, -0.75, 0], radius=0.10, color=BRICK), Dot([3.8, -0.75, 0], radius=0.10, color=BRICK), Dot([4.8, -0.75, 0], radius=0.10, color=BRICK))
        labels = VGroup(Text("pumping", font="Arial", font_size=20, color=TEAL).move_to([2.0, 1.30, 0]), Text("monitoring", font="Arial", font_size=20, color=OCHRE).move_to([3.3, 1.30, 0]), Text("recovery", font="Arial", font_size=20, color=BRICK).move_to([4.55, 1.30, 0]), Text("conditional choices", font="Arial", font_size=22, color=MUTED).move_to([3.2, -1.55, 0]))
        time_direction = VGroup(Arrow([1.65, -2.20, 0], [4.8, -2.20, 0], buff=0.05, color=TEAL, stroke_width=3), Arrow([4.8, -2.55, 0], [1.65, -2.55, 0], buff=0.05, color=BRICK, stroke_width=3))
        geometry = VGroup(branch, branch_labels, gate, gate_label, timelines, markers, labels, time_direction)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, branch_labels, gate_label, labels], blockers=[branch, gate, timelines, markers, time_direction], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (timelines, markers)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(Create(branch), FadeIn(branch_labels), FadeIn(gate), FadeIn(gate_label), Create(timelines), FadeIn(markers), FadeIn(labels), Create(time_direction), lag_ratio=0.20), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)

    def scene_20_return(self) -> None:
        self.clear()
        heading = Text("Return every diagnostic to the pumping field", font="Arial", font_size=38, color=INK).to_edge(UP, buff=0.38)
        caption = Text("Compare, diagnose, and verify in the field", font="Arial", font_size=22, color=INK).to_edge(DOWN, buff=0.30)
        aquifer = Rectangle(width=10.8, height=4.5, color=INK, fill_color=PALE, fill_opacity=0.50, stroke_width=3)
        pumping_well = Circle(radius=0.26, color=BRICK, fill_color=BRICK, fill_opacity=1).move_to([-1.0, 0.15, 0])
        observation_wells = VGroup(Dot([-4.0, 1.25, 0], radius=0.13, color=INK), Dot([-3.35, -1.25, 0], radius=0.13, color=INK), Dot([1.1, 1.35, 0], radius=0.13, color=INK), Dot([2.35, -1.45, 0], radius=0.13, color=INK), Dot([4.15, 0.55, 0], radius=0.13, color=INK))
        drawdown_paths = VGroup(Circle(radius=0.75, color=TEAL, stroke_width=2, stroke_opacity=0.68).move_to(pumping_well), Circle(radius=1.45, color=TEAL, stroke_width=2, stroke_opacity=0.68).move_to(pumping_well), Circle(radius=2.2, color=TEAL, stroke_width=2, stroke_opacity=0.68).move_to(pumping_well))
        theta_contour = VMobject(color=OCHRE, stroke_width=5)
        theta_contour.set_points_smoothly([[-4.9, -1.55, 0], [-2.0, -0.9, 0], [0.1, 0.3, 0], [2.2, 1.0, 0], [4.9, 1.65, 0]])
        halos = VGroup(Circle(radius=0.42, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([-4.0, 1.25, 0]), Circle(radius=0.42, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([-3.35, -1.25, 0]), Circle(radius=0.42, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([1.1, 1.35, 0]), Circle(radius=0.42, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([2.35, -1.45, 0]), Circle(radius=0.42, color=OCHRE, stroke_width=2, stroke_opacity=0.55).move_to([4.15, 0.55, 0]))
        criterion = VGroup(Line([-4.6, 2.15, 0], [-2.0, 2.15, 0], color=INK, stroke_width=3), Polygon([-3.3, 2.15, 0], [-3.6, 1.65, 0], [-3.0, 1.65, 0], color=MUTED, fill_color=PAPER, fill_opacity=1))
        criterion_label = Text("relative", font="Arial", font_size=19, color=MUTED).move_to([-3.3, 2.62, 0])
        time_arrows = VGroup(Arrow([2.5, 2.15, 0], [4.7, 2.15, 0], buff=0.05, color=TEAL, stroke_width=3), Arrow([4.7, 1.75, 0], [2.5, 1.75, 0], buff=0.05, color=BRICK, stroke_width=3))
        boundary_labels = VGroup(Text("interpolated field", font="Arial", font_size=19, color=OCHRE).move_to([3.85, 2.62, 0]), Text("conditional width", font="Arial", font_size=19, color=MUTED).move_to([-3.65, -2.68, 0]), Text("field work remains open", font="Arial", font_size=21, color=BRICK).move_to([0.55, 2.62, 0]))
        geometry = VGroup(aquifer, drawdown_paths, theta_contour, halos, observation_wells, pumping_well, criterion, criterion_label, time_arrows, boundary_labels)
        assert_inside(aquifer, [halos], min_gap=0.08)
        assert_scene_layout(scene=self, pending_items=[heading, caption, geometry], labels=[heading, caption, criterion_label, boundary_labels], blockers=[aquifer, drawdown_paths, theta_contour, halos, observation_wells, pumping_well, criterion, time_arrows], frame_items=[heading, caption, geometry], intentional_overlaps=[(geometry, geometry), (aquifer, drawdown_paths), (aquifer, theta_contour), (aquifer, halos), (aquifer, observation_wells), (aquifer, pumping_well), (aquifer, criterion), (aquifer, time_arrows), (drawdown_paths, theta_contour), (drawdown_paths, halos), (drawdown_paths, observation_wells), (drawdown_paths, pumping_well), (drawdown_paths, criterion), (theta_contour, halos), (theta_contour, observation_wells), (theta_contour, pumping_well), (theta_contour, criterion), (theta_contour, time_arrows), (halos, observation_wells), (halos, criterion)])
        self.play(FadeIn(heading), FadeIn(caption), LaggedStart(FadeIn(aquifer), Create(drawdown_paths), Create(theta_contour), Create(halos), FadeIn(observation_wells), FadeIn(pumping_well), Create(criterion), FadeIn(criterion_label), Create(time_arrows), FadeIn(boundary_labels), lag_ratio=0.14), run_time=4.3)
        self.wait(1.0)
        self.play(FadeOut(heading), FadeOut(caption), FadeOut(geometry), run_time=0.7)
