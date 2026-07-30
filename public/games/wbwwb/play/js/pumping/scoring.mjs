export const SCORE_WEIGHTS = Object.freeze({
  K: 30,
  Ss: 30,
  modelJudgment: 15,
  dataSufficiency: 15,
  budget: 10,
});

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function rounded(value) {
  return Math.round(value * 100) / 100;
}

function parameterPart(estimate, truth, weight) {
  const logError = Math.abs(Math.log10(estimate / truth));
  return rounded(weight * clamp(1 - logError / 2, 0, 1));
}

function modelJudgment(input, scenario) {
  const selection = input.model;
  const conceptualModel = typeof selection === "string"
    ? selection
    : selection?.conceptualModel;
  const method = typeof selection === "string"
    ? input.method
    : selection?.method;

  if (conceptualModel !== scenario.expectedModel) {
    return Object.freeze({
      compatibility: "model-mismatch",
      score: 3,
      explanation: "conceptual-boundary-mismatch",
    });
  }
  if (method === "cooper-jacob" && scenario.expectedModel !== "theis") {
    return Object.freeze({
      compatibility: "boundary-recognized-cj-approximation",
      score: 8,
      explanation: "cooper-jacob-omits-boundary-image-physics",
    });
  }
  return Object.freeze({
    compatibility: "fully-compatible",
    score: SCORE_WEIGHTS.modelJudgment,
    explanation: "method-fits-selected-conceptual-model",
  });
}

export function scoreRound(input) {
  const { scenario, estimate } = input;
  if (
    !scenario
    || !estimate
    || !Number.isFinite(estimate.K)
    || estimate.K <= 0
    || !Number.isFinite(estimate.Ss)
    || estimate.Ss <= 0
    || !Number.isFinite(input.duration)
    || input.duration < 0
    || !Number.isFinite(input.budgetRemaining)
    || input.budgetRemaining < 0
  ) {
    throw new TypeError("Scoring requires valid estimates, duration, and budget");
  }

  const sufficientRecord = clamp(
    input.duration / scenario.minimumUsableRecord,
    0,
    1,
  );
  const timelyLimit = scenario.minimumUsableRecord * 1.5;
  const stopJudgment = input.duration <= timelyLimit
    ? 1
    : clamp(
      1 - (
        0.5 * (input.duration - timelyLimit)
        / (scenario.duration.maximum - timelyLimit)
      ),
      0.5,
      1,
  );
  const retainedRecord = input.retainedSeriesCount >= 1 ? 1 : 0;
  const judgment = modelJudgment(input, scenario);
  const parts = Object.freeze({
    K: parameterPart(estimate.K, scenario.truth.K, SCORE_WEIGHTS.K),
    Ss: parameterPart(estimate.Ss, scenario.truth.Ss, SCORE_WEIGHTS.Ss),
    modelJudgment: judgment.score,
    dataSufficiency: rounded(
      SCORE_WEIGHTS.dataSufficiency
      * sufficientRecord
      * stopJudgment
      * retainedRecord,
    ),
    budget: rounded(
      SCORE_WEIGHTS.budget
      * clamp(input.budgetRemaining / scenario.economy.startBudget, 0, 1),
    ),
  });

  return Object.freeze({
    total: rounded(Object.values(parts).reduce((sum, part) => sum + part, 0)),
    parts,
    diagnostics: Object.freeze({
      rmse: Number.isFinite(input.rmse) ? input.rmse : null,
      modelJudgment: judgment,
    }),
  });
}
