# Proposal: Frequency-response diagnostics for a minimal aquifer-response model

## Publicly inferred direction

The public research programme emphasizes flux-gradient asynchrony, model
interpretation, transformation uncertainty, and the need to check
identifiability rather than reward fit alone. This proposal extends that
publicly visible direction into a bounded diagnostic experiment. It does not
claim to represent Ying-Fan Lin's private plans.

## Research question

Can the frequency response of a pumping or periodic-head experiment distinguish
classical instantaneous diffusion from a single-memory lagging response before
additional mechanisms are added?

## Competing explanations

- M0: classical diffusion with one effective hydraulic diffusivity.
- M1: a single-memory lagging response with separate flux and head response
  times.
- M2: multiple-memory extension, reserved as a future comparator rather than
  assumed to be necessary.

## Minimum experiment

Generate known-truth responses over a controlled range of forcing periods,
sampling windows, noise levels, and observation distances. Fit M0 and M1,
then compare held-out response prediction, parameter correlation, interval
coverage, and the change in a decision-relevant response quantity.

## Expected contribution

The intended contribution is a falsifiable diagnostic workflow for deciding
when a second response time is identifiable and useful. It is not a claim that
one lagging model is universally correct or that a better fit proves a field
mechanism.

## Kill criterion

Park the bet if M0 and M1 cannot be distinguished under identifiable forcing,
if M1 only reduces calibration error without improving held-out prediction or
decision interpretation, or if the distinction disappears under reasonable
noise and sampling changes.
