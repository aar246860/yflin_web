import { getScenario } from "./scenarios.mjs";
import { scoreRound } from "./scoring.mjs";

// allow: SIZE_OK — one auditable module owns the complete six-stage transition table.
export const STAGES = Object.freeze([
  "site-survey",
  "construction",
  "pumping",
  "data-preparation",
  "analysis",
  "results",
]);

export const ROLES = Object.freeze([
  "hydrogeologist",
  "driller",
  "instrumentation technician",
  "pump operator/analyst",
]);

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}

function accepted(state, changes, code) {
  return deepFreeze({
    ...state,
    ...changes,
    lastAction: { accepted: true, code },
  });
}

function rejected(state, code) {
  return deepFreeze({
    ...state,
    lastAction: { accepted: false, code },
  });
}

function freshRound(scenarioId, seed, replayIndex = 0) {
  const scenario = getScenario(scenarioId);
  return deepFreeze({
    scenarioId,
    seed: seed ?? scenario.seed,
    replayIndex,
    stage: STAGES[0],
    selectedSiteId: null,
    wells: [],
    budgetRemaining: scenario.economy.startBudget,
    pump: {
      started: false,
      stopped: false,
      rate: null,
      duration: 0,
    },
    retainedSeries: [],
    estimate: null,
    model: null,
    score: null,
    resultsReviewed: false,
    lastAction: { accepted: true, code: "ROUND_CREATED" },
  });
}

export function createRound(scenarioId, seed) {
  return freshRound(scenarioId, seed);
}

function selectSite(state, action, scenario) {
  if (state.stage !== "site-survey") return rejected(state, "STAGE_GATE");
  const site = scenario.candidateSites.find((candidate) => candidate.id === action.siteId);
  if (!site) return rejected(state, "INVALID_SITE");
  return accepted(
    state,
    { selectedSiteId: site.id, stage: "construction" },
    "SITE_SELECTED",
  );
}

function validWell(well) {
  return well
    && typeof well.id === "string"
    && well.id.length > 0
    && (well.kind === "pump" || well.kind === "observation")
    && Number.isFinite(well.x)
    && Number.isFinite(well.y);
}

function installWell(state, action, scenario) {
  if (state.stage !== "construction") return rejected(state, "STAGE_GATE");
  if (!validWell(action.well)) return rejected(state, "MALFORMED_ACTION");
  const well = action.well;
  if (state.wells.some((installed) => installed.id === well.id)) {
    return rejected(state, "DUPLICATE_ACTION");
  }
  if (well.kind === "pump" && state.wells.some((installed) => installed.kind === "pump")) {
    return rejected(state, "DUPLICATE_ACTION");
  }
  const observationCount = state.wells.filter((installed) => installed.kind === "observation").length;
  if (
    well.kind === "observation"
    && observationCount >= scenario.construction.maximumObservationWells
  ) {
    return rejected(state, "OBSERVATION_LIMIT");
  }

  const site = scenario.candidateSites.find(
    (candidate) => candidate.id === state.selectedSiteId,
  );
  const area = site.wellArea;
  if (
    well.x < area.xMin
    || well.x > area.xMax
    || well.y < area.yMin
    || well.y > area.yMax
  ) {
    return rejected(state, "OUTSIDE_CONSTRUCTION_BOUNDS");
  }
  const spacingIsValid = state.wells.every((installed) => (
    Math.hypot(well.x - installed.x, well.y - installed.y)
    >= scenario.construction.minimumSpacing
  ));
  if (!spacingIsValid) return rejected(state, "INVALID_SPACING");

  const cost = well.kind === "pump"
    ? scenario.economy.pumpingWell
    : scenario.economy.observationWell;
  if (cost > state.budgetRemaining) return rejected(state, "OVER_BUDGET");
  return accepted(
    state,
    {
      wells: [...state.wells, { ...well }],
      budgetRemaining: state.budgetRemaining - cost,
    },
    "WELL_INSTALLED",
  );
}

function advance(state) {
  if (state.stage === "construction") {
    const pumpCount = state.wells.filter((well) => well.kind === "pump").length;
    const observationCount = state.wells.filter((well) => well.kind === "observation").length;
    if (pumpCount !== 1 || observationCount < 1) {
      return rejected(state, "MISSING_REQUIRED_WELLS");
    }
    return accepted(state, { stage: "pumping" }, "CONSTRUCTION_COMPLETE");
  }
  if (state.stage === "data-preparation") {
    if (state.retainedSeries.length < 1) {
      return rejected(state, "VALID_SERIES_REQUIRED");
    }
    return accepted(state, { stage: "analysis" }, "DATA_PREPARED");
  }
  return rejected(state, "STAGE_GATE");
}

function startPumping(state, action, scenario) {
  if (state.stage !== "pumping") return rejected(state, "STAGE_GATE");
  if (state.pump.started) return rejected(state, "RATE_LOCKED");
  if (!scenario.allowedRates.includes(action.rate)) {
    return rejected(state, "INVALID_RATE");
  }
  if (scenario.economy.pumpStartup > state.budgetRemaining) {
    return rejected(state, "OVER_BUDGET");
  }
  return accepted(
    state,
    {
      budgetRemaining: state.budgetRemaining - scenario.economy.pumpStartup,
      pump: { started: true, stopped: false, rate: action.rate, duration: 0 },
    },
    "PUMP_STARTED",
  );
}

function recordPumping(state, action, scenario) {
  if (state.stage !== "pumping" || !state.pump.started || state.pump.stopped) {
    return rejected(state, "PUMP_NOT_RUNNING");
  }
  if (
    !Number.isFinite(action.duration)
    || action.duration <= 0
    || state.pump.duration + action.duration > scenario.duration.maximum
  ) {
    return rejected(state, "INVALID_DURATION");
  }
  const cost = action.duration * scenario.economy.operationPerMinute;
  if (cost > state.budgetRemaining) return rejected(state, "OVER_BUDGET");
  return accepted(
    state,
    {
      budgetRemaining: state.budgetRemaining - cost,
      pump: {
        ...state.pump,
        duration: state.pump.duration + action.duration,
      },
    },
    "RECORD_EXTENDED",
  );
}

function stopPumping(state, scenario) {
  if (
    state.stage !== "pumping"
    || !state.pump.started
    || state.pump.duration < scenario.minimumUsableRecord
  ) {
    return rejected(state, "MINIMUM_RECORD_REQUIRED");
  }
  return accepted(
    state,
    {
      stage: "data-preparation",
      pump: { ...state.pump, stopped: true },
    },
    "PUMP_STOPPED",
  );
}

function retainSeries(state, action) {
  if (state.stage !== "data-preparation") return rejected(state, "STAGE_GATE");
  const observationExists = state.wells.some(
    (well) => well.kind === "observation" && well.id === action.wellId,
  );
  const window = action.window;
  const validWindow = window
    && Number.isFinite(window.start)
    && Number.isFinite(window.end)
    && window.start >= 0
    && window.end > window.start
    && window.end <= state.pump.duration;
  if (!observationExists || !validWindow) {
    return rejected(state, "INVALID_SERIES_WINDOW");
  }
  if (state.retainedSeries.some((series) => series.wellId === action.wellId)) {
    return rejected(state, "DUPLICATE_ACTION");
  }
  return accepted(
    state,
    {
      retainedSeries: [
        ...state.retainedSeries,
        { wellId: action.wellId, window: { ...window } },
      ],
    },
    "SERIES_RETAINED",
  );
}

function submitAnalysis(state, action, scenario) {
  if (state.score) return rejected(state, "DUPLICATE_SUBMIT");
  if (state.stage !== "analysis") return rejected(state, "STAGE_GATE");
  if (
    !action.estimate
    || !Number.isFinite(action.estimate.K)
    || action.estimate.K <= 0
    || !Number.isFinite(action.estimate.Ss)
    || action.estimate.Ss <= 0
  ) {
    return rejected(state, "INVALID_PARAMETERS");
  }
  const score = scoreRound({
    scenario,
    estimate: action.estimate,
    model: action.model,
    duration: state.pump.duration,
    retainedSeriesCount: state.retainedSeries.length,
    budgetRemaining: state.budgetRemaining,
    rmse: action.rmse,
  });
  return accepted(
    state,
    {
      stage: "results",
      estimate: { ...action.estimate },
      model: action.model,
      score,
    },
    "ANALYSIS_SUBMITTED",
  );
}

function reviewResults(state) {
  if (state.stage !== "results" || !state.score) {
    return rejected(state, "STAGE_GATE");
  }
  if (state.resultsReviewed) return rejected(state, "DUPLICATE_ACTION");
  return accepted(state, { resultsReviewed: true }, "RESULTS_REVIEWED");
}

function replay(state, action) {
  if (!state.resultsReviewed) return rejected(state, "RESULTS_REVIEW_REQUIRED");
  if (action.seedMode !== "same" && action.seedMode !== "new") {
    return rejected(state, "MALFORMED_ACTION");
  }
  const replayIndex = state.replayIndex + 1;
  const seed = action.seedMode === "same"
    ? state.seed
    : `${getScenario(state.scenarioId).seed}:replay:${replayIndex}`;
  return accepted(
    freshRound(state.scenarioId, seed, replayIndex),
    {},
    action.seedMode === "same" ? "REPLAY_SAME_SEED" : "REPLAY_NEW_SEED",
  );
}

export function applyAction(state, action) {
  if (!state || !action || typeof action.type !== "string") {
    return state ? rejected(state, "MALFORMED_ACTION") : null;
  }
  const scenario = getScenario(state.scenarioId);
  switch (action.type) {
    case "select-site": return selectSite(state, action, scenario);
    case "install-well": return installWell(state, action, scenario);
    case "advance": return advance(state);
    case "start-pumping": return startPumping(state, action, scenario);
    case "record-pumping": return recordPumping(state, action, scenario);
    case "stop-pumping": return stopPumping(state, scenario);
    case "retain-series": return retainSeries(state, action);
    case "submit-analysis": return submitAnalysis(state, action, scenario);
    case "review-results": return reviewResults(state);
    case "replay": return replay(state, action);
    default: return rejected(state, "MALFORMED_ACTION");
  }
}
