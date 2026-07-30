import { theisDrawdown, toAquiferProperties } from "./physics.mjs";

const DEFAULT_BOUNDS = {
  transmissivity: { minimum: 1, maximum: 10000 },
  storativity: { minimum: 1e-7, maximum: 0.1 },
};

const requirePositive = (value, field) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${field} must be finite`);
  }
  if (value <= 0) {
    throw new RangeError(`${field} must be positive`);
  }
};

const validateBounds = (bounds, field) => {
  if (bounds === null || typeof bounds !== "object") {
    throw new TypeError(`${field} bounds must be an object`);
  }
  requirePositive(bounds.minimum, `${field} minimum`);
  requirePositive(bounds.maximum, `${field} maximum`);
  if (bounds.minimum >= bounds.maximum) {
    throw new RangeError(`${field} bounds must increase`);
  }
};

export const validateObservations = (observations) => {
  if (!Array.isArray(observations)) {
    throw new TypeError("observations must be an array");
  }
  if (observations.length === 0) {
    throw new RangeError("observations must not be empty");
  }
  return observations.map((observation, index) => {
    if (observation === null || typeof observation !== "object") {
      throw new TypeError(`observation ${index} must be an object`);
    }
    requirePositive(observation.time, `observation ${index} time`);
    if (!Number.isFinite(observation.drawdown)) {
      throw new TypeError(`observation ${index} drawdown must be finite`);
    }
    if (observation.drawdown < 0) {
      throw new RangeError(`observation ${index} drawdown must be non-negative`);
    }
    return { time: observation.time, drawdown: observation.drawdown };
  });
};

export const calculateResiduals = (observations, predicted) => {
  const checked = validateObservations(observations);
  if (!Array.isArray(predicted) || predicted.length !== checked.length) {
    throw new RangeError("predicted values must match observations");
  }
  return checked.map((observation, index) => {
    const prediction = predicted[index];
    if (!Number.isFinite(prediction)) {
      throw new TypeError(`predicted value ${index} must be finite`);
    }
    return {
      time: observation.time,
      observed: observation.drawdown,
      predicted: prediction,
      residual: observation.drawdown - prediction,
    };
  });
};

const squaredError = (observations, pumpingRate, radius, transmissivity, storativity) => {
  let total = 0;
  for (const observation of observations) {
    const prediction = theisDrawdown({
      pumpingRate,
      transmissivity,
      storativity,
      radius,
      time: observation.time,
    }).drawdown;
    const residual = observation.drawdown - prediction;
    total += residual * residual;
  }
  return total;
};

export const fitTheis = ({
  observations,
  pumpingRate,
  radius,
  thickness,
  bounds = DEFAULT_BOUNDS,
  gridSize = 25,
  refinements = 6,
}) => {
  const checked = validateObservations(observations);
  requirePositive(pumpingRate, "pumpingRate");
  requirePositive(radius, "radius");
  requirePositive(thickness, "thickness");
  if (!Number.isInteger(gridSize) || gridSize < 3) {
    throw new RangeError("gridSize must be an integer of at least three");
  }
  if (!Number.isInteger(refinements) || refinements < 1) {
    throw new RangeError("refinements must be a positive integer");
  }
  validateBounds(bounds.transmissivity, "transmissivity");
  validateBounds(bounds.storativity, "storativity");

  let minimumLogT = Math.log10(bounds.transmissivity.minimum);
  let maximumLogT = Math.log10(bounds.transmissivity.maximum);
  let minimumLogS = Math.log10(bounds.storativity.minimum);
  let maximumLogS = Math.log10(bounds.storativity.maximum);
  let bestLogT = minimumLogT;
  let bestLogS = minimumLogS;
  let bestError = Number.POSITIVE_INFINITY;

  for (let refinement = 0; refinement < refinements; refinement += 1) {
    const stepT = (maximumLogT - minimumLogT) / (gridSize - 1);
    const stepS = (maximumLogS - minimumLogS) / (gridSize - 1);
    bestError = Number.POSITIVE_INFINITY;
    for (let tIndex = 0; tIndex < gridSize; tIndex += 1) {
      const logT = minimumLogT + tIndex * stepT;
      const transmissivity = 10 ** logT;
      for (let sIndex = 0; sIndex < gridSize; sIndex += 1) {
        const logS = minimumLogS + sIndex * stepS;
        const storativity = 10 ** logS;
        const error = squaredError(
          checked,
          pumpingRate,
          radius,
          transmissivity,
          storativity,
        );
        if (error < bestError) {
          bestError = error;
          bestLogT = logT;
          bestLogS = logS;
        }
      }
    }
    minimumLogT = bestLogT - 2 * stepT;
    maximumLogT = bestLogT + 2 * stepT;
    minimumLogS = bestLogS - 2 * stepS;
    maximumLogS = bestLogS + 2 * stepS;
  }

  const transmissivity = 10 ** bestLogT;
  const storativity = 10 ** bestLogS;
  const predicted = checked.map((observation) =>
    theisDrawdown({
      pumpingRate,
      transmissivity,
      storativity,
      radius,
      time: observation.time,
    }).drawdown,
  );
  const residuals = calculateResiduals(checked, predicted);
  return {
    transmissivity,
    storativity,
    ...toAquiferProperties({ transmissivity, storativity, thickness }),
    rmse: Math.sqrt(bestError / checked.length),
    residuals,
  };
};

export const fitCooperJacob = ({
  observations,
  pumpingRate,
  radius,
  thickness,
  window,
}) => {
  const checked = validateObservations(observations);
  requirePositive(pumpingRate, "pumpingRate");
  requirePositive(radius, "radius");
  requirePositive(thickness, "thickness");
  if (window === null || typeof window !== "object") {
    throw new TypeError("window must be an object");
  }
  requirePositive(window.startTime, "window startTime");
  requirePositive(window.endTime, "window endTime");
  if (window.startTime >= window.endTime) {
    throw new RangeError("Cooper-Jacob window must increase");
  }

  const selected = checked.filter(
    ({ time }) => time >= window.startTime && time <= window.endTime,
  );
  if (selected.length < 3) {
    throw new RangeError("Cooper-Jacob window must contain at least three observations");
  }
  const xValues = selected.map(({ time }) => Math.log10(time));
  const meanX = xValues.reduce((sum, value) => sum + value, 0) / selected.length;
  const meanY =
    selected.reduce((sum, observation) => sum + observation.drawdown, 0) /
    selected.length;
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < selected.length; index += 1) {
    const centeredX = xValues[index] - meanX;
    numerator += centeredX * (selected[index].drawdown - meanY);
    denominator += centeredX * centeredX;
  }
  if (denominator === 0) {
    throw new RangeError("Cooper-Jacob window must span distinct times");
  }
  const slope = numerator / denominator;
  if (!Number.isFinite(slope) || slope <= 0) {
    throw new RangeError("Cooper-Jacob window must have positive drawdown slope");
  }
  const intercept = meanY - slope * meanX;
  const transmissivity = (2.3 * pumpingRate) / (4 * Math.PI * slope);
  const zeroDrawdownTime = 10 ** (-intercept / slope);
  const storativity =
    (2.25 * transmissivity * zeroDrawdownTime) / (radius * radius);
  requirePositive(storativity, "fitted storativity");
  const predicted = xValues.map((value) => intercept + slope * value);
  const residuals = calculateResiduals(selected, predicted);
  const sumSquared = residuals.reduce(
    (sum, residual) => sum + residual.residual * residual.residual,
    0,
  );

  return {
    transmissivity,
    storativity,
    ...toAquiferProperties({ transmissivity, storativity, thickness }),
    slope,
    intercept,
    zeroDrawdownTime,
    rmse: Math.sqrt(sumSquared / selected.length),
    residuals,
  };
};
