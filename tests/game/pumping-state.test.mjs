import assert from "node:assert/strict";
import test from "node:test";

import {
  SCENARIOS,
  SCENARIO_IDS,
  getScenario,
} from "../../public/games/wbwwb/play/js/pumping/scenarios.mjs";
import {
  ROLES,
  STAGES,
  applyAction,
  createRound,
} from "../../public/games/wbwwb/play/js/pumping/state.mjs";
import {
  SCORE_WEIGHTS,
  scoreRound,
} from "../../public/games/wbwwb/play/js/pumping/scoring.mjs";

function accepted(state, action) {
  const next = applyAction(state, action);
  assert.equal(next.lastAction.accepted, true, next.lastAction.code);
  return next;
}

function reachAnalysis(scenarioId) {
  const scenario = getScenario(scenarioId);
  const site = scenario.candidateSites.find((candidate) => candidate.recommended);
  let state = createRound(scenarioId);
  state = accepted(state, { type: "select-site", siteId: site.id });
  state = accepted(state, { type: "install-well", well: { id: "PW-1", kind: "pump", x: site.wellArea.xMin + 10, y: site.wellArea.yMin + 10 } });
  state = accepted(state, { type: "install-well", well: { id: "OW-1", kind: "observation", x: site.wellArea.xMin + 10 + scenario.construction.minimumSpacing, y: site.wellArea.yMin + 10 } });
  state = accepted(state, { type: "advance" });
  state = accepted(state, { type: "start-pumping", rate: scenario.allowedRates[0] });
  state = accepted(state, { type: "record-pumping", duration: scenario.minimumUsableRecord });
  state = accepted(state, { type: "stop-pumping" });
  state = accepted(state, { type: "retain-series", wellId: "OW-1", window: { start: 1, end: scenario.minimumUsableRecord } });
  return accepted(state, { type: "advance" });
}

function completeRound(scenarioId) {
  const scenario = getScenario(scenarioId);
  let state = reachAnalysis(scenarioId);
  state = accepted(state, {
    type: "submit-analysis",
    estimate: { K: scenario.truth.K, Ss: scenario.truth.Ss },
    model: scenario.expectedModel,
  });
  state = accepted(state, { type: "review-results" });
  return state;
}

test("scenario tables are deeply immutable and derive T and S", () => {
  // Given a fixed scenario table
  const guided = SCENARIOS.guided;
  // When its nested data is inspected
  // Then truth is derived and every exposed level is frozen
  assert.equal(guided.truth.T, guided.truth.K * guided.truth.b);
  assert.equal(guided.truth.S, guided.truth.Ss * guided.truth.b);
  assert.equal(Object.isFrozen(SCENARIOS), true);
  assert.equal(Object.isFrozen(guided.candidateSites[0].wellArea), true);
  assert.throws(() => { guided.allowedRates.push(999); }, TypeError);
});

test("scenario contract contains all modes, roles, and fixed operating limits", () => {
  // Given the public scenario and state contracts
  // When their machine-readable values are counted
  // Then all required choices and limits are present
  assert.deepEqual(SCENARIO_IDS, ["guided", "expert-river", "expert-barrier"]);
  assert.deepEqual(ROLES, ["hydrogeologist", "driller", "instrumentation technician", "pump operator/analyst"]);
  for (const scenario of Object.values(SCENARIOS)) {
    assert.match(scenario.seed, /^pumping-game:[a-z-]+:v1$/);
    assert.ok(scenario.candidateSites.length >= 2);
    assert.ok(scenario.allowedRates.length >= 2);
    assert.ok(scenario.duration.maximum > scenario.minimumUsableRecord);
    assert.ok(scenario.economy.startBudget > 0);
  }
});

for (const scenarioId of SCENARIO_IDS) {
  test(`completes a feasible six-stage path for ${scenarioId}`, () => {
    // Given a fresh scenario
    // When a complete legal round is played
    const state = completeRound(scenarioId);
    // Then it reaches reviewed results without debt
    assert.deepEqual(STAGES, ["site-survey", "construction", "pumping", "data-preparation", "analysis", "results"]);
    assert.equal(state.stage, "results");
    assert.equal(state.resultsReviewed, true);
    assert.ok(state.budgetRemaining >= 0);
    assert.ok(state.score.total >= 0 && state.score.total <= 100);
  });
}

test("invalid minimum spacing cannot spend or advance", () => {
  // Given one installed pumping well
  const scenario = getScenario("guided");
  const site = scenario.candidateSites[0];
  let state = accepted(createRound("guided"), { type: "select-site", siteId: site.id });
  state = accepted(state, { type: "install-well", well: { id: "PW-1", kind: "pump", x: site.wellArea.xMin + 10, y: site.wellArea.yMin + 10 } });
  const budgetBefore = state.budgetRemaining;
  // When an observation well is too close
  const rejected = applyAction(state, { type: "install-well", well: { id: "OW-1", kind: "observation", x: site.wellArea.xMin + 11, y: site.wellArea.yMin + 10 } });
  // Then the action is rejected without spending or stage movement
  assert.equal(rejected.lastAction.code, "INVALID_SPACING");
  assert.equal(rejected.budgetRemaining, budgetBefore);
  assert.equal(rejected.stage, "construction");
});

test("over-budget operation is blocked and budget never becomes negative", () => {
  // Given a valid expert field with three observation wells and a running pump
  const scenario = getScenario("expert-river");
  const site = scenario.candidateSites[0];
  let state = accepted(createRound(scenario.id), { type: "select-site", siteId: site.id });
  for (const [index, kind] of ["pump", "observation", "observation", "observation"].entries()) {
    state = accepted(state, { type: "install-well", well: { id: `W-${index}`, kind, x: site.wellArea.xMin + 10 + index * scenario.construction.minimumSpacing, y: site.wellArea.yMin + 10 } });
  }
  state = accepted(state, { type: "advance" });
  state = accepted(state, { type: "start-pumping", rate: scenario.allowedRates[0] });
  const budgetBefore = state.budgetRemaining;
  // When a maximum-duration record costs more than remains
  const rejected = applyAction(state, { type: "record-pumping", duration: scenario.duration.maximum });
  // Then no debt or time advance is created
  assert.equal(rejected.lastAction.code, "OVER_BUDGET");
  assert.equal(rejected.budgetRemaining, budgetBefore);
  assert.equal(rejected.pump.duration, 0);
  assert.ok(rejected.budgetRemaining >= 0);
});

test("duplicate construction cannot spend twice", () => {
  // Given one installed pumping well
  const scenario = getScenario("guided");
  const site = scenario.candidateSites[0];
  let state = accepted(createRound("guided"), { type: "select-site", siteId: site.id });
  state = accepted(state, { type: "install-well", well: { id: "PW-1", kind: "pump", x: site.wellArea.xMin + 10, y: site.wellArea.yMin + 10 } });
  // When the same well is submitted again
  const rejected = applyAction(state, { type: "install-well", well: state.wells[0] });
  // Then it is rejected without spending
  assert.equal(rejected.lastAction.code, "DUPLICATE_ACTION");
  assert.equal(rejected.budgetRemaining, state.budgetRemaining);
});

test("startup rate is restricted and locked without repeat spending", () => {
  // Given a pumping-ready guided round
  const scenario = getScenario("guided");
  let state = reachAnalysis("guided");
  state = Object.freeze({ ...state, stage: "pumping", pump: Object.freeze({ ...state.pump, stopped: false }) });
  const budgetBefore = state.budgetRemaining;
  // When another startup rate is requested after startup
  const rejected = applyAction(state, { type: "start-pumping", rate: scenario.allowedRates[1] });
  // Then the original rate and budget stay locked
  assert.equal(rejected.lastAction.code, "RATE_LOCKED");
  assert.equal(rejected.pump.rate, scenario.allowedRates[0]);
  assert.equal(rejected.budgetRemaining, budgetBefore);
});

test("premature transitions are rejected at every gate", () => {
  // Given representative states before each gate is satisfied
  const initial = createRound("guided");
  const site = getScenario("guided").candidateSites[0];
  const construction = accepted(initial, { type: "select-site", siteId: site.id });
  // When advance or stop is requested too early
  const blockedConstruction = applyAction(construction, { type: "advance" });
  const blockedPumping = applyAction(Object.freeze({ ...construction, stage: "pumping" }), { type: "stop-pumping" });
  const blockedPreparation = applyAction(Object.freeze({ ...construction, stage: "data-preparation" }), { type: "advance" });
  // Then each state remains at its current stage
  assert.equal(blockedConstruction.lastAction.code, "MISSING_REQUIRED_WELLS");
  assert.equal(blockedPumping.lastAction.code, "MINIMUM_RECORD_REQUIRED");
  assert.equal(blockedPreparation.lastAction.code, "VALID_SERIES_REQUIRED");
});

test("invalid K or Ss cannot reach results", () => {
  // Given a round ready for analysis
  const state = reachAnalysis("guided");
  // When non-finite or non-positive parameters are submitted
  const zeroK = applyAction(state, { type: "submit-analysis", estimate: { K: 0, Ss: 0.00001 }, model: "theis" });
  const infiniteSs = applyAction(state, { type: "submit-analysis", estimate: { K: 10, Ss: Infinity }, model: "theis" });
  // Then both submissions are blocked
  assert.equal(zeroK.lastAction.code, "INVALID_PARAMETERS");
  assert.equal(infiniteSs.lastAction.code, "INVALID_PARAMETERS");
  assert.equal(zeroK.stage, "analysis");
});

test("duplicate analysis submission cannot replace the score", () => {
  // Given a scored round
  const scenario = getScenario("guided");
  let state = reachAnalysis("guided");
  state = accepted(state, { type: "submit-analysis", estimate: { K: scenario.truth.K, Ss: scenario.truth.Ss }, model: "theis" });
  const originalScore = state.score;
  // When analysis is submitted again
  const rejected = applyAction(state, { type: "submit-analysis", estimate: { K: 1, Ss: 1 }, model: "theis" });
  // Then the first score remains authoritative
  assert.equal(rejected.lastAction.code, "DUPLICATE_SUBMIT");
  assert.deepEqual(rejected.score, originalScore);
});

test("five-part score is deterministic, totals 100 weight, and keeps RMSE diagnostic", () => {
  // Given identical score inputs
  const scenario = getScenario("guided");
  const input = { scenario, estimate: scenario.truth, model: "theis", duration: scenario.minimumUsableRecord, retainedSeriesCount: 1, budgetRemaining: 50000, rmse: 999 };
  // When scoring is repeated
  const first = scoreRound(input);
  const second = scoreRound(input);
  // Then output is identical and RMSE is not a weighted category
  assert.deepEqual(first, second);
  assert.equal(Object.values(SCORE_WEIGHTS).reduce((sum, value) => sum + value, 0), 100);
  assert.deepEqual(Object.keys(first.parts), ["K", "Ss", "modelJudgment", "dataSufficiency", "budget"]);
  assert.equal(first.diagnostics.rmse, 999);
});

test("data sufficiency rewards an adequate and timely stop", () => {
  // Given equal estimates, retained data, and budgets
  const scenario = getScenario("guided");
  const base = { scenario, estimate: scenario.truth, model: "theis", retainedSeriesCount: 1, budgetRemaining: 50000, rmse: 0 };
  // When minimum, premature, and maximum stop times are scored
  const timely = scoreRound({ ...base, duration: scenario.minimumUsableRecord });
  const premature = scoreRound({ ...base, duration: scenario.minimumUsableRecord / 2 });
  const excessive = scoreRound({ ...base, duration: scenario.duration.maximum });
  // Then sufficient timely data earns more than either poor stop decision
  assert.ok(timely.parts.dataSufficiency > premature.parts.dataSufficiency);
  assert.ok(timely.parts.dataSufficiency > excessive.parts.dataSufficiency);
});

for (const scenarioId of ["expert-river", "expert-barrier"]) {
  test(`correct boundary judgment beats forced Theis for ${scenarioId}`, () => {
    // Given identical expert estimates and records
    const scenario = getScenario(scenarioId);
    const base = { scenario, estimate: scenario.truth, duration: scenario.minimumUsableRecord, retainedSeriesCount: 1, budgetRemaining: 40000, rmse: 0 };
    // When the correct model and plain Theis are scored
    const correct = scoreRound({ ...base, model: scenario.expectedModel });
    const forced = scoreRound({ ...base, model: "theis" });
    // Then the scientifically correct choice scores higher
    assert.ok(correct.parts.modelJudgment > forced.parts.modelJudgment);
    assert.ok(correct.total > forced.total);
  });
}

for (const scenarioId of ["expert-river", "expert-barrier"]) {
  test(`Cooper-Jacob keeps the correct boundary but earns partial model credit for ${scenarioId}`, () => {
    // Given an expert boundary case and a valid late-time Cooper-Jacob estimate
    const scenario = getScenario(scenarioId);
    const input = {
      scenario,
      estimate: scenario.truth,
      model: scenario.expectedModel,
      method: "cooper-jacob",
      duration: scenario.minimumUsableRecord,
      retainedSeriesCount: 1,
      budgetRemaining: 40000,
      rmse: 0,
    };

    // When the conceptual boundary is scored with a non-boundary-aware fit
    const score = scoreRound(input);

    // Then the boundary recognition is retained but image-boundary physics is not over-credited
    assert.equal(score.parts.modelJudgment, 8);
    assert.equal(
      score.diagnostics.modelJudgment.compatibility,
      "boundary-recognized-cj-approximation",
    );
  });
}

test("late-time Cooper-Jacob remains fully compatible for the ideal infinite aquifer", () => {
  // Given the guided infinite-aquifer case and a valid late-time Cooper-Jacob estimate
  const scenario = getScenario("guided");
  const input = {
    scenario,
    estimate: scenario.truth,
    model: scenario.expectedModel,
    method: "cooper-jacob",
    duration: scenario.minimumUsableRecord,
    retainedSeriesCount: 1,
    budgetRemaining: 50000,
    rmse: 0,
  };

  // When the compatible late-time approximation is scored
  const score = scoreRound(input);

  // Then it retains full model credit
  assert.equal(score.parts.modelJudgment, SCORE_WEIGHTS.modelJudgment);
  assert.equal(score.diagnostics.modelJudgment.compatibility, "fully-compatible");
});

test("same-seed and new-seed replay reset only after review", () => {
  // Given an unfinished and a reviewed round
  const unfinished = createRound("guided");
  const reviewed = completeRound("guided");
  // When replay is requested
  const blocked = applyAction(unfinished, { type: "replay", seedMode: "same" });
  const same = applyAction(reviewed, { type: "replay", seedMode: "same" });
  const fresh = applyAction(reviewed, { type: "replay", seedMode: "new" });
  // Then review gates replay and reset seeds behave as requested
  assert.equal(blocked.lastAction.code, "RESULTS_REVIEW_REQUIRED");
  assert.equal(same.seed, reviewed.seed);
  assert.notEqual(fresh.seed, reviewed.seed);
  assert.equal(same.stage, "site-survey");
  assert.equal(same.budgetRemaining, getScenario("guided").economy.startBudget);
});

test("malformed actions and stale state usage are harmless", () => {
  // Given a fresh state and an independently advanced descendant
  const original = createRound("guided");
  const site = getScenario("guided").candidateSites[0];
  const advanced = accepted(original, { type: "select-site", siteId: site.id });
  // When malformed input and a stale-state action are applied
  const malformed = applyAction(original, null);
  const stale = applyAction(original, { type: "advance" });
  // Then neither corrupts the original or descendant
  assert.equal(malformed.lastAction.code, "MALFORMED_ACTION");
  assert.equal(stale.stage, "site-survey");
  assert.equal(original.stage, "site-survey");
  assert.equal(advanced.stage, "construction");
});
