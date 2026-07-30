import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  STAGE_IDS,
  canTickPumping,
  createGameplay,
  getLiveSeries,
  getStageTargets,
  isLateTimeWindow,
  reduceGameplay,
} from "../../public/games/wbwwb/play/js/pumping/gameplay.mjs";
import { warmPixiTextures } from "../../public/games/wbwwb/play/js/pumping/runtime.mjs";
import { getScenario } from "../../public/games/wbwwb/play/js/pumping/scenarios.mjs";
import { STAGE_ASSETS } from "../../public/games/wbwwb/play/js/pumping/ui.mjs";

const gameplayPath = new URL(
  "../../public/games/wbwwb/play/js/pumping/gameplay.mjs",
  import.meta.url,
);

test("six-stage gameplay controller contract exists", () => {
  // Given the completed pumping-test shell
  const expectedStages = [
    "site-survey",
    "construction",
    "pumping",
    "data-preparation",
    "analysis",
    "results",
  ];

  // When the gameplay controller module is inspected
  const controllerExists = existsSync(gameplayPath);
  const source = controllerExists ? readFileSync(gameplayPath, "utf8") : "";

  // Then it exposes every machine-routed stage
  assert.equal(controllerExists, true, "gameplay controller module is missing");
  for (const stage of expectedStages) assert.match(source, new RegExp(stage));
});

test("gameplay module exposes the pure controller surface", async () => {
  // Given the six-stage gameplay module
  const gameplay = await import(gameplayPath);

  // When its public controller surface is inspected
  const controllerSurface = [
    gameplay.createGameplay,
    gameplay.reduceGameplay,
    gameplay.getStageTargets,
    gameplay.getLiveSeries,
    gameplay.isLateTimeWindow,
  ];

  // Then every controller bridge is callable
  assert.equal(
    controllerSurface.every((value) => typeof value === "function"),
    true,
  );
});

test("every gameplay stage has a distinct background and interactive prop family", () => {
  // Given the six-stage visual asset contract
  const mappings = STAGE_IDS.map((stage) => STAGE_ASSETS[stage]);

  // Then each stage declares both a background and a prop
  assert.equal(mappings.every((entry) => entry?.length === 2), true);
  assert.equal(new Set(mappings.map(([background]) => background)).size, 6);
  assert.equal(new Set(mappings.map(([, prop]) => prop)).size, 6);
});

function dispatch(game, action) {
  return reduceGameplay(game, action);
}

function assign(game, crewId, targetId) {
  const selected = dispatch(game, { type: "select-crew", crewId });
  return dispatch(selected, { type: "activate-target", targetId });
}

function reachPumping(scenarioId) {
  let game = createGameplay(scenarioId);
  const site = getStageTargets(game).find((target) => target.recommended);
  game = assign(game, "hydrogeologist", site.id);
  game = assign(game, "driller", "well:pump");
  game = assign(game, "instrumentation-technician", "well:observation-1");
  return dispatch(game, { type: "advance" });
}

function reachDataPreparation(scenarioId) {
  const scenario = getScenario(scenarioId);
  let game = reachPumping(scenarioId);
  game = dispatch(game, { type: "set-rate", rate: scenario.allowedRates[1] });
  game = assign(game, "pump-operator-analyst", "pump:control");
  game = dispatch(game, {
    type: "tick",
    duration: scenario.minimumUsableRecord,
  });
  return dispatch(game, { type: "stop-pumping" });
}

function reachAnalysis(scenarioId, windowStart = 1) {
  const scenario = getScenario(scenarioId);
  let game = reachDataPreparation(scenarioId);
  game = dispatch(game, {
    type: "toggle-series",
    wellId: "OW-1",
  });
  game = dispatch(game, {
    type: "set-window",
    start: windowStart,
    end: scenario.minimumUsableRecord,
  });
  if (scenarioId !== "guided") {
    game = dispatch(game, { type: "toggle-baseline" });
    game = dispatch(game, { type: "flag-outlier" });
  }
  return dispatch(game, { type: "confirm-data" });
}

test("site selection requires the hydrogeologist and preserves state on wrong role", () => {
  // Given a new guided field round
  const original = createGameplay("guided", "gate-seed");
  const site = getStageTargets(original).find((target) => target.recommended);

  // When the driller tries to select the site
  const rejected = assign(original, "driller", site.id);

  // Then the round does not spend or advance
  assert.equal(rejected.round.stage, "site-survey");
  assert.equal(rejected.round.budgetRemaining, original.round.budgetRemaining);
  assert.equal(rejected.feedback.code, "WRONG_ROLE");
});

test("malformed actions and stale replay requests preserve the active round", () => {
  // Given a newly opened round
  const game = createGameplay("guided", "adversarial-seed");

  // When malformed input and a replay from the wrong stage arrive
  const malformed = dispatch(game, { nope: true });
  const staleReplay = dispatch(game, { type: "replay", seedMode: "new" });

  // Then neither request can alter the round, seed, budget, or stage
  assert.equal(malformed.round, game.round);
  assert.equal(malformed.feedback.code, "MALFORMED_ACTION");
  assert.equal(staleReplay.round.stage, "site-survey");
  assert.equal(staleReplay.round.seed, "adversarial-seed");
  assert.equal(staleReplay.round.budgetRemaining, game.round.budgetRemaining);
  assert.equal(staleReplay.feedback.code, "RESULTS_REVIEW_REQUIRED");
});

test("construction requires one pump and one observation before advancing", () => {
  // Given a selected site with only a pumping well
  let game = createGameplay("guided");
  const site = getStageTargets(game).find((target) => target.recommended);
  game = assign(game, "hydrogeologist", site.id);
  game = assign(game, "driller", "well:pump");
  const beforeAdvance = game.round.budgetRemaining;

  // When construction is advanced too early
  const rejected = dispatch(game, { type: "advance" });

  // Then the immutable domain gate blocks progress and spending
  assert.equal(rejected.round.stage, "construction");
  assert.equal(rejected.round.budgetRemaining, beforeAdvance);
  assert.equal(rejected.feedback.code, "MISSING_REQUIRED_WELLS");
});

test("construction catalog exposes an in-bounds observation candidate below minimum spacing", () => {
  // Given a guided construction site with its pumping well installed
  const scenario = getScenario("guided");
  let game = createGameplay("guided");
  const siteTarget = getStageTargets(game).find((target) => target.recommended);
  game = assign(game, "hydrogeologist", siteTarget.id);
  game = assign(game, "driller", "well:pump");
  const site = scenario.candidateSites.find(
    (candidate) => candidate.id === game.round.selectedSiteId,
  );
  const pump = game.round.wells.find((well) => well.kind === "pump");

  // When the visitor-facing construction catalog is inspected
  const closeTarget = getStageTargets(game).find((target) =>
    target.well?.kind === "observation"
    && Math.hypot(target.well.x - pump.x, target.well.y - pump.y)
      < scenario.construction.minimumSpacing);

  // Then one normal selectable observation point covers the spacing boundary
  assert.ok(closeTarget, "construction catalog has no too-close observation candidate");
  assert.equal(closeTarget.well.x >= site.wellArea.xMin, true);
  assert.equal(closeTarget.well.x <= site.wellArea.xMax, true);
  assert.equal(closeTarget.well.y >= site.wellArea.yMin, true);
  assert.equal(closeTarget.well.y <= site.wellArea.yMax, true);
});

test("close observation candidate rejects through the normal action without spending", () => {
  // Given a guided construction site, installed pump, and selected technician
  const scenario = getScenario("guided");
  let game = createGameplay("guided");
  const siteTarget = getStageTargets(game).find((target) => target.recommended);
  game = assign(game, "hydrogeologist", siteTarget.id);
  game = assign(game, "driller", "well:pump");
  game = dispatch(game, {
    type: "select-crew",
    crewId: "instrumentation-technician",
  });
  const pump = game.round.wells.find((well) => well.kind === "pump");
  const closeTarget = getStageTargets(game).find((target) =>
    target.well?.kind === "observation"
    && Math.hypot(target.well.x - pump.x, target.well.y - pump.y)
      < scenario.construction.minimumSpacing);
  const beforeRound = game.round;

  // When the technician activates that ordinary field target
  const rejected = dispatch(game, {
    type: "activate-target",
    targetId: closeTarget.id,
  });

  // Then the spacing rule rejects visibly without changing the round
  assert.equal(rejected.round, beforeRound);
  assert.equal(rejected.round.stage, "construction");
  assert.equal(rejected.round.wells.length, 1);
  assert.equal(rejected.round.budgetRemaining, beforeRound.budgetRemaining);
  assert.equal(rejected.feedback.code, "INVALID_SPACING");
  assert.equal(rejected.feedback.tone, "error");
  assert.match(rejected.feedback.message, /最低間距/u);
  assert.equal(rejected.selectedCrewId, "instrumentation-technician");
});

test("valid observation remains installable after repeated close-target rejection", () => {
  // Given the same close target has been rejected twice without clearing the technician
  const scenario = getScenario("guided");
  let game = createGameplay("guided");
  const siteTarget = getStageTargets(game).find((target) => target.recommended);
  game = assign(game, "hydrogeologist", siteTarget.id);
  game = assign(game, "driller", "well:pump");
  game = dispatch(game, {
    type: "select-crew",
    crewId: "instrumentation-technician",
  });
  const pump = game.round.wells.find((well) => well.kind === "pump");
  const targets = getStageTargets(game);
  const closeTarget = targets.find((target) =>
    target.well?.kind === "observation"
    && Math.hypot(target.well.x - pump.x, target.well.y - pump.y)
      < scenario.construction.minimumSpacing);
  const validTarget = targets.find((target) =>
    target.well?.kind === "observation"
    && Math.hypot(target.well.x - pump.x, target.well.y - pump.y)
      >= scenario.construction.minimumSpacing);
  game = dispatch(game, { type: "activate-target", targetId: closeTarget.id });
  game = dispatch(game, { type: "activate-target", targetId: closeTarget.id });
  const beforeValid = game.round;

  // When the visitor activates a valid observation target next
  const installed = dispatch(game, {
    type: "activate-target",
    targetId: validTarget.id,
  });

  // Then construction continues normally with exactly one observation well
  assert.equal(installed.round.stage, "construction");
  assert.equal(installed.round.wells.length, 2);
  assert.equal(
    installed.round.budgetRemaining,
    beforeValid.budgetRemaining - scenario.economy.observationWell,
  );
  assert.equal(installed.feedback.tone, "success");
});

test("duplicate and wrong-role construction targets cannot spend twice", () => {
  // Given a selected guided site
  let game = createGameplay("guided");
  const site = getStageTargets(game).find((target) => target.recommended);
  game = assign(game, "hydrogeologist", site.id);
  game = assign(game, "driller", "well:pump");
  const afterPump = game.round.budgetRemaining;

  // When the pump target is repeated with the wrong field specialist
  const repeated = assign(
    game,
    "instrumentation-technician",
    "well:pump",
  );

  // Then neither the well list nor budget changes
  assert.equal(repeated.round.wells.length, 1);
  assert.equal(repeated.round.budgetRemaining, afterPump);
  assert.equal(repeated.feedback.code, "WRONG_ROLE");
});

test("pumping rate locks after startup and stop waits for a usable record", () => {
  // Given a constructed expert river test
  const scenario = getScenario("expert-river");
  let game = reachPumping("expert-river");
  game = dispatch(game, { type: "set-rate", rate: scenario.allowedRates[0] });
  game = assign(game, "pump-operator-analyst", "pump:control");

  // When rate and stop are requested after startup but before enough data
  const locked = dispatch(game, {
    type: "set-rate",
    rate: scenario.allowedRates[1],
  });
  const stopped = dispatch(locked, { type: "stop-pumping" });

  // Then the chosen rate remains fixed and pumping continues
  assert.equal(stopped.round.pump.rate, scenario.allowedRates[0]);
  assert.equal(stopped.round.stage, "pumping");
  assert.equal(stopped.feedback.code, "MINIMUM_RECORD_REQUIRED");
});

test("accelerated pumping clock stops cleanly at the scenario maximum", () => {
  // Given a running guided test at its allowed maximum duration
  const scenario = getScenario("guided");
  let game = reachPumping("guided");
  game = dispatch(game, { type: "set-rate", rate: scenario.allowedRates[0] });
  game = assign(game, "pump-operator-analyst", "pump:control");
  game = dispatch(game, { type: "tick", duration: scenario.duration.maximum });

  // Then the browser clock knows not to request an invalid extra minute
  assert.equal(game.round.pump.duration, scenario.duration.maximum);
  assert.equal(canTickPumping(game), false);
});

test("Pixi textures are ready before rapidly replaceable scenes are drawn", async () => {
  // Given a loaded image whose Pixi texture completes asynchronously
  const events = [];
  const baseTexture = {
    hasLoaded: false,
    once(type, handler) {
      events.push(type);
      if (type === "loaded") queueMicrotask(() => {
        this.hasLoaded = true;
        handler();
      });
    },
  };
  const texture = { baseTexture };
  const PIXI = { Texture: { fromImage: () => texture } };

  // When the shared scene textures are warmed
  const warmed = await warmPixiTextures(
    PIXI,
    new Map([["crew", { src: "crew.png" }]]),
  );

  // Then replaceable scenes cannot destroy a still-loading sprite
  assert.equal(baseTexture.hasLoaded, true);
  assert.deepEqual(warmed, [texture]);
  assert.deepEqual(events, ["loaded", "error"]);
});

test("live expert records use boundary physics and contain one seeded outlier", () => {
  // Given a running expert barrier test with a usable record
  const scenario = getScenario("expert-barrier");
  let game = reachPumping("expert-barrier");
  game = dispatch(game, { type: "set-rate", rate: scenario.allowedRates[1] });
  game = assign(game, "pump-operator-analyst", "pump:control");

  // When the accelerated clock records the minimum duration
  game = dispatch(game, {
    type: "tick",
    duration: scenario.minimumUsableRecord,
  });
  const series = getLiveSeries(game);

  // Then every plotted point is synthetic and exactly one point is seeded as an outlier
  assert.equal(series.length, 1);
  assert.equal(series[0].points.length, scenario.minimumUsableRecord);
  assert.equal(series[0].points.every((point) => point.synthetic), true);
  assert.equal(
    series[0].points.filter((point) => point.isOutlier).length,
    1,
  );
  assert.equal(
    series[0].points.every((point) => Number.isFinite(point.idealDrawdown)),
    true,
  );
});

test("data preparation rejects empty series and invalid windows", () => {
  // Given a stopped guided record
  const game = reachDataPreparation("guided");

  // When no series and then a reversed window are submitted
  const empty = dispatch(game, { type: "confirm-data" });
  let invalid = dispatch(game, {
    type: "toggle-series",
    wellId: "OW-1",
  });
  invalid = dispatch(invalid, { type: "set-window", start: 20, end: 2 });
  invalid = dispatch(invalid, { type: "confirm-data" });

  // Then both requests remain in data preparation with explicit gate codes
  assert.equal(empty.round.stage, "data-preparation");
  assert.equal(empty.feedback.code, "VALID_SERIES_REQUIRED");
  assert.equal(invalid.round.stage, "data-preparation");
  assert.equal(invalid.feedback.code, "INVALID_SERIES_WINDOW");
});

test("Cooper-Jacob rejects early windows before a deterministic late-time fit", () => {
  // Given an expert river record retained from the first minute
  let game = reachAnalysis("expert-river", 1);
  game = dispatch(game, { type: "set-method", method: "cooper-jacob" });
  game = dispatch(game, { type: "set-assumption", assumption: "river" });

  // When Cooper-Jacob is run on the early-time window
  const early = dispatch(game, { type: "run-analysis" });

  // Then the physics-based late-time gate rejects it clearly
  assert.equal(isLateTimeWindow(game), false);
  assert.equal(early.analysis.fit, null);
  assert.equal(early.feedback.code, "CJ_NOT_LATE");
});

for (const scenarioId of ["guided", "expert-river", "expert-barrier"]) {
  test(`full-curve analysis reaches finite scored results for ${scenarioId}`, () => {
    // Given a prepared synthetic record and the scenario-appropriate boundary
    const scenario = getScenario(scenarioId);
    const assumption = scenarioId === "guided"
      ? "plain"
      : scenarioId === "expert-river"
        ? "river"
        : "barrier";
    let game = reachAnalysis(scenarioId);
    game = dispatch(game, { type: "set-method", method: "theis" });
    game = dispatch(game, { type: "set-assumption", assumption });

    // When a full-curve fit is run and submitted
    game = dispatch(game, { type: "run-analysis" });
    const fitted = game.analysis.fit;
    game = dispatch(game, { type: "submit-analysis" });

    // Then real module outputs bridge T/S to finite K/Ss and the five-part score
    assert.equal(Number.isFinite(fitted.transmissivity), true);
    assert.equal(Number.isFinite(fitted.storativity), true);
    assert.equal(fitted.hydraulicConductivity > 0, true);
    assert.equal(fitted.specificStorage > 0, true);
    assert.equal(Number.isFinite(fitted.rmse), true);
    assert.equal(game.round.stage, "results");
    assert.deepEqual(
      Object.keys(game.round.score.parts).sort(),
      ["K", "Ss", "budget", "dataSufficiency", "modelJudgment"].sort(),
    );
  });
}

for (const [scenarioId, assumption] of [
  ["expert-river", "river"],
  ["expert-barrier", "barrier"],
]) {
  test(`submission carries Cooper-Jacob method through the ${scenarioId} boundary score`, () => {
    // Given a late-time expert record and its correct conceptual boundary
    let game = reachAnalysis(scenarioId, 20);
    game = dispatch(game, { type: "set-method", method: "cooper-jacob" });
    game = dispatch(game, { type: "set-assumption", assumption });

    // When the actual gameplay submission seam runs Cooper-Jacob
    game = dispatch(game, { type: "run-analysis" });
    game = dispatch(game, { type: "submit-analysis" });

    // Then the result keeps boundary recognition without claiming an image-well fit
    assert.equal(game.round.score.parts.modelJudgment, 8);
    assert.equal(
      game.round.score.diagnostics.modelJudgment.compatibility,
      "boundary-recognized-cj-approximation",
    );
  });
}

test("guided full-curve fit converts display minutes to model days", () => {
  // Given a guided record whose public time axis is expressed in minutes
  const scenario = getScenario("guided");
  let game = reachAnalysis("guided");

  // When the plain-aquifer Theis fit is run
  game = dispatch(game, { type: "run-analysis" });

  // Then the storage estimates remain on the scenario's physical scale
  assert.ok(
    Math.abs(Math.log10(game.analysis.fit.storativity / scenario.truth.S)) < 0.2,
    `expected S near ${scenario.truth.S}, received ${game.analysis.fit.storativity}`,
  );
  assert.ok(
    Math.abs(Math.log10(game.analysis.fit.specificStorage / scenario.truth.Ss)) < 0.2,
    `expected Ss near ${scenario.truth.Ss}, received ${game.analysis.fit.specificStorage}`,
  );
});

test("invalid adjusted parameters cannot be submitted", () => {
  // Given a completed guided fit
  let game = reachAnalysis("guided");
  game = dispatch(game, { type: "run-analysis" });
  const originalEstimate = game.analysis.estimate;

  // When a non-positive K adjustment is entered and submitted
  game = dispatch(game, {
    type: "adjust-estimate",
    estimate: { K: 0, Ss: originalEstimate.Ss },
  });
  game = dispatch(game, { type: "submit-analysis" });

  // Then the analysis gate remains closed
  assert.equal(game.round.stage, "analysis");
  assert.equal(game.feedback.code, "INVALID_PARAMETERS");
});

test("wrong expert boundary warns and lowers model judgment without blocking results", () => {
  // Given two identical expert-river records
  let correct = reachAnalysis("expert-river");
  let wrong = reachAnalysis("expert-river");

  // When one uses the river image and one uses a plain aquifer assumption
  correct = dispatch(correct, { type: "set-assumption", assumption: "river" });
  correct = dispatch(correct, { type: "run-analysis" });
  correct = dispatch(correct, { type: "submit-analysis" });
  wrong = dispatch(wrong, { type: "set-assumption", assumption: "plain" });
  assert.equal(wrong.analysis.warning, "BOUNDARY_MISMATCH");
  wrong = dispatch(wrong, { type: "run-analysis" });
  wrong = dispatch(wrong, { type: "submit-analysis" });

  // Then both show results while the model score records the scientific judgment
  assert.equal(correct.round.stage, "results");
  assert.equal(wrong.round.stage, "results");
  assert.equal(
    correct.round.score.parts.modelJudgment >
      wrong.round.score.parts.modelJudgment,
    true,
  );
});

test("expert analysis exposes its default boundary mismatch before fitting", () => {
  // Given expert records that have just entered the analysis stage
  const river = reachAnalysis("expert-river");
  const barrier = reachAnalysis("expert-barrier");

  // Then the initially selected plain model is visibly marked as mismatched
  assert.equal(river.analysis.assumption, "plain");
  assert.equal(river.analysis.warning, "BOUNDARY_MISMATCH");
  assert.equal(barrier.analysis.warning, "BOUNDARY_MISMATCH");

  // And selecting the scenario boundary clears the warning
  const corrected = dispatch(river, {
    type: "set-assumption",
    assumption: "river",
  });
  assert.equal(corrected.analysis.warning, null);
});

test("results review gates same-seed and new-seed replay", () => {
  // Given a completed guided result
  let game = reachAnalysis("guided");
  game = dispatch(game, { type: "run-analysis" });
  game = dispatch(game, { type: "submit-analysis" });
  const resultSeed = game.round.seed;

  // When replay is requested before and after review
  const blocked = dispatch(game, { type: "replay", seedMode: "same" });
  game = dispatch(game, { type: "review-results" });
  const same = dispatch(game, { type: "replay", seedMode: "same" });
  game = reachAnalysis("guided");
  game = dispatch(game, { type: "run-analysis" });
  game = dispatch(game, { type: "submit-analysis" });
  game = dispatch(game, { type: "review-results" });
  const fresh = dispatch(game, { type: "replay", seedMode: "new" });

  // Then review is required, same seed repeats, and new seed changes deterministically
  assert.equal(blocked.round.stage, "results");
  assert.equal(blocked.feedback.code, "RESULTS_REVIEW_REQUIRED");
  assert.equal(same.round.seed, resultSeed);
  assert.equal(same.round.stage, "site-survey");
  assert.notEqual(fresh.round.seed, resultSeed);
});

test("replay keeps deterministic seeds internal while the public case label stays current", async () => {
  // Given a guided result and the visitor-facing label boundary
  const { toPublicCaseLabel } = await import(
    "../../public/games/wbwwb/play/js/pumping/ui.mjs"
  );
  let game = reachAnalysis("guided");
  game = dispatch(game, { type: "run-analysis" });
  game = dispatch(game, { type: "submit-analysis" });
  game = dispatch(game, { type: "review-results" });
  const previousSeed = game.round.seed;

  // When a fresh deterministic round is requested
  const replayed = dispatch(game, { type: "replay", seedMode: "new" });
  const publicLabel = toPublicCaseLabel(replayed.round.scenarioId);

  // Then replay changes the internal seed without leaking or staling the visible case label
  assert.notEqual(replayed.round.seed, previousSeed);
  assert.equal(publicLabel, "引導固定案例");
  assert.doesNotMatch(publicLabel, /wbwwb:|seed|種子/iu);
});

test("public state feedback never exposes internal English action codes", () => {
  // Given a guided round at state-backed transitions
  const scenario = getScenario("guided");
  let game = reachPumping("guided");
  const constructionMessage = game.feedback.message;
  game = dispatch(game, { type: "set-rate", rate: scenario.allowedRates[0] });
  game = assign(game, "pump-operator-analyst", "pump:control");
  game = dispatch(game, { type: "tick", duration: scenario.minimumUsableRecord });
  const recordMessage = game.feedback.message;
  game = dispatch(game, { type: "stop-pumping" });
  const stopMessage = game.feedback.message;
  game = dispatch(game, { type: "toggle-series", wellId: "OW-1" });
  game = dispatch(game, {
    type: "set-window",
    start: 1,
    end: scenario.minimumUsableRecord,
  });
  game = dispatch(game, { type: "confirm-data" });
  game = dispatch(game, { type: "run-analysis" });
  game = dispatch(game, { type: "submit-analysis" });
  const resultMessage = game.feedback.message;

  // Then every public message is Traditional Chinese copy, not an internal code
  for (const message of [
    constructionMessage,
    recordMessage,
    stopMessage,
    resultMessage,
  ]) {
    assert.doesNotMatch(message, /^[A-Z][A-Z0-9_]+$/);
    assert.match(message, /[\u3400-\u9fff]/);
  }
});
