# Rive Asset Brief: Flux-Gradient Asynchrony

This site is wired to load a real Rive asset at:

```text
public/animations/flux-gradient-asynchrony.riv
```

The runtime integration is already present in `src/components/research/FluxGradientAsynchronyRive.astro`.
If the file exists and loads, the page hides the SVG fallback and uses the Rive canvas.

## Required Rive Contract

- Artboard: default artboard is acceptable.
- State machine name: `FluxGradientAsynchrony`
- Numeric input name: `asynchronyLevel`
- Input range expected by the website: `0` to `46`
- Semantic states:
  - `near-synchronous response` for input below about `10`
  - `diagnostic asynchrony` for input about `10` to `32`
  - `decision-exposed asynchrony` for input above about `32`

## Visual Direction

Use the existing SVG fallback as the scientific storyboard, not as a literal style lock:

- Upper trace: hydraulic gradient.
- Lower trace: flux response.
- Residual band: diagnostic residual / model-assumption audit.
- The input should visibly increase phase offset and residual envelope.
- Avoid showing this as a calibrated field result.

## Claim Boundary

The Rive file is an explanatory state-machine animation. It should not imply:

- a calibrated aquifer mechanism diagnosis,
- a published field inversion result,
- a validated decision threshold,
- or a replacement for the analytical LDL calculation demos.

## Deployment Check

After exporting the `.riv` file:

1. Save it as `public/animations/flux-gradient-asynchrony.riv`.
2. Run `npm.cmd run build`.
3. Preview the homepage and confirm the status text says:

```text
Rive .riv asset loaded. State machine input: asynchronyLevel.
```

