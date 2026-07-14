# Lagging Pumping-Test Demo Design

## Purpose

Build a calculation-backed website module that shows why Lin and Yeh (2017) Lagging Darcy Law matters in constant-rate pumping interpretation. The module should help a visitor see when classical radial drawdown is adequate and when separated flux and gradient lags create early-time residuals that can affect parameter transfer.

## Scope

The first public version is a teaching and diagnostic module, not a full reproduction of the 2017 WRR solution. It uses a line-source leaky confined aquifer transfer function with the Lin-Yeh lag operator in the Laplace-domain diffusivity term, then performs client-side Gaver-Stehfest inversion. It explicitly omits wellbore storage and finite well radius.

## Interface

The module includes three presets:

- Darcy-like: equal flux and gradient response lags, so the lagging curve collapses to the classical curve.
- Early-time mismatch: separated lags produce visible early residuals while late-time behavior remains close.
- Decision-critical: separated lags and a larger observation scale produce residuals large enough to audit parameter transfer.

Controls expose flux response lag, gradient development lag, observation radius, and leakage length. The chart shows classical drawdown, lagging drawdown, and the residual curve. The decision panel reports early mismatch, early timing shift, and an interpretation status.

## Claim Boundary

Public wording must say this is a calculation-backed teaching model. It can say the module is based on the Lin and Yeh (2017) pumping-test framework and first-order lag operator. It must not claim to reproduce the complete 2017 wellbore-storage solution or provide site-specific design values.
