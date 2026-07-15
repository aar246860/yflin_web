from __future__ import annotations

import re

from manim import DOWN, LEFT, RIGHT, UP, VGroup

from assets.research_manim_semantic_shapes import fit_text, make_geometry

_KINDS = (
    ("fault", r"fault|fracture|laminat"),
    ("island", r"island|coast|freshwater lens|saltwater|shore|kinmen"),
    ("plume", r"plume|breakthrough|btc"),
    ("forest", r"forest|tree|ensemble branch"),
    ("sensitivity", r"sensitivity|morris|psf|nsf"),
    ("scatter", r"scatter|one-to-one|1:1|versus"),
    ("residual", r"residual|error stem|difference stem"),
    ("pulse", r"pulse|lag bracket|time offset"),
    ("matrix", r"matrix|heatmap|mesh|grid|pixel|covariance"),
    ("distribution", r"distribution|density|posterior|credible|interval|bootstrap|sample cloud"),
    ("equation", r"equation|bessel|laplace|root|infinite series|analytical expression"),
    ("table", r"table|ranking|metric row|me/see|score row"),
    ("track", r"track|cyclone|storm|typhoon|trajectory"),
    ("map", r"map|contour|surface|spatial field|parameter field|station marker"),
    ("curve", r"curve|profile|hydrograph|time series|trace|drawdown|head response|temperature"),
    ("system", r"well|aquifer|soil|liner|stream|borehole|bhe|pile|cylinder|layer|recharge"),
)


def semantic_kind(description: str) -> str:
    lowered = description.lower().replace("_", " ")
    return next((kind for kind, pattern in _KINDS if re.search(pattern, lowered)), "workflow")


def semantic_terms(description: str) -> tuple[str, ...]:
    normalized = re.sub(r"\s+", " ", description.replace("_", " ")).strip(" .")
    normalized = re.sub(r"^Irregular\s+", "", normalized, flags=re.IGNORECASE)
    chunks = re.split(
        r"\s*(?:,|;|\band\b|\bwith\b|\bbeside\b|\bwhile\b|\bover\b|\binto\b)\s*",
        normalized,
        flags=re.IGNORECASE,
    )
    terms: list[str] = []
    for chunk in chunks:
        cleaned = re.sub(r"^(?:a|an|the)\s+", "", chunk.strip(" ."), flags=re.IGNORECASE)
        concise = " ".join(cleaned.split()[:6])
        if concise and concise not in terms:
            terms.append(concise)
    return tuple(terms[:4] or (normalized[:36],))


def build_semantic_visual(description: str, phase: int = 0) -> VGroup:
    geometry = make_geometry(description, semantic_kind(description), phase)
    geometry.scale_to_fit_width(6.6).shift(LEFT * 1.65 + DOWN * 0.1)
    terms = semantic_terms(description)
    labels = VGroup(*[fit_text(term, 17, 3.3) for term in terms])
    labels.arrange(DOWN, aligned_edge=LEFT, buff=0.28).move_to(RIGHT * 3.9)
    heading = fit_text(" | ".join(terms[:2]), 20, 8.8).move_to(UP * 2.15)
    panel = VGroup(geometry, labels, heading)
    if panel.height > 5.1:
        panel.scale_to_fit_height(5.1)
    if panel.width > 11.5:
        panel.scale_to_fit_width(11.5)
    return panel
