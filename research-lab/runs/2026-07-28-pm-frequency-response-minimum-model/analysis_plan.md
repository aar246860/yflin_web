# Analysis plan

## Model family

Use a classical diffusion baseline (M0) and a single-memory lagging response
(M1). Keep a multiple-memory model (M2) out of the primary comparison until
M1 fails a predeclared diagnostic. Do not add boundary or wellbore parameters
to the first benchmark; those effects are confounders for the minimum-model
question.

## Design factors

- forcing period relative to the diffusion time scale;
- observation distance relative to the diffusion length;
- record length and early-time sampling density;
- measurement noise level;
- flux-lag and head-lag ratio for known-truth M1 responses.

## Diagnostics

1. held-out time-series prediction error;
2. amplitude and phase error in the frequency response;
3. parameter correlation and profile-likelihood width;
4. interval coverage under repeated noise realizations;
5. complexity-penalized fit;
6. change in a declared decision quantity.

## Reproducibility requirements

Save the parameter manifest, random seeds, model equations, solver settings,
and output hashes. A result is not accepted into the manuscript until a
separate evidence gate can regenerate it.

## Stop rule

Do not advance to M2 or public interpretation when M1 is not identifiable or
when its improvement is calibration-only.
