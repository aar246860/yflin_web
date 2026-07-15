from __future__ import annotations

import pytest

from assets.research_manim_semantic import semantic_kind, semantic_terms


@pytest.mark.parametrize(
    ("description", "expected"),
    [
        ("Laminated fault with a COMSOL finite-element mesh", "fault"),
        ("Irregular Kinmen coastline, freshwater lens, and nine pumping columns", "island"),
        ("Finite-element plume beside breakthrough curves", "plume"),
        ("Six ensemble forests and their branch predictions", "forest"),
        ("Covariance heatmap for the retained parameters", "matrix"),
        ("Equation 7 with paired PSF and NSF sensitivity panels", "sensitivity"),
        ("tau_c-versus-Darcy scatter with a one-to-one line", "scatter"),
        ("Observed hydrograph, fitted curve, and residual stems", "residual"),
    ],
)
def test_semantic_kind_when_storyboard_names_scientific_object(
    description: str,
    expected: str,
) -> None:
    result = semantic_kind(description)
    assert result == expected


def test_semantic_terms_when_description_contains_domain_objects() -> None:
    description = "Irregular Kinmen coastline, freshwater lens, and nine pumping columns"
    result = semantic_terms(description)
    assert "Kinmen coastline" in result
    assert "freshwater lens" in result
    assert "nine pumping columns" in result
