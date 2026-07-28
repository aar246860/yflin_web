# Frequency-Response Diagnostics for a Minimal Aquifer-Response Model

Status: proposal scaffold; not submission-ready.

## Abstract

Aquifer-test interpretation commonly compresses transient observations into a
small set of hydraulic parameters. This proposal asks whether a controlled
frequency-response experiment can distinguish a classical instantaneous
diffusion model from a single-memory lagging response before additional
mechanisms are introduced. We will compare held-out prediction, amplitude and
phase diagnostics, identifiability, interval coverage, and a declared decision
quantity. The study will remain diagnostic: a distinguishable response would
support using a lagging formulation as a candidate interpretation, not prove a
unique field mechanism. DATA NEEDED; RESULT NOT RUN.

## Introduction

The public research materials identify a gap between measured hydraulic
responses and model-conditioned parameters. They also state that Lagging
Theory should be tested against residual structure, complexity, identifiability,
prediction, and decision relevance. This proposal turns that framing into a
minimum-model benchmark.

## Research questions

1. Under which forcing periods and sampling windows can M0 and M1 be
   distinguished?
2. When does a second response time remain identifiable under noise?
3. Does the distinction change a decision-relevant response quantity?

## Methods

Use the analysis plan in this run package. The primary comparison is M0 versus
M1; M2 remains a predeclared future comparator. Exact equations, parameter
ranges, random seeds, solver settings, and output hashes are DATA NEEDED and
must be added before any result claim.

## Expected diagnostics

The analysis will report predictive error, amplitude and phase error, parameter
correlation, interval coverage, complexity penalty, and decision sensitivity.
No expected direction is treated as an observed result.

## Limitations

The proposal begins with controlled synthetic data and cannot establish field
mechanism identity without independent observations. Boundary effects,
wellbore storage, leakage, and observation geometry may be confounded with
response memory and must be controlled or explicitly tested in later loops.

## References needed

- SOURCE NEEDED: frequency-domain aquifer-test interpretation;
- SOURCE NEEDED: identifiability and model-discrimination methods;
- PUBLIC SOURCE: `src/content/concepts/lagging-theory.md`;
- PUBLIC SOURCE: `src/content/projects/tu-lag.md`.
