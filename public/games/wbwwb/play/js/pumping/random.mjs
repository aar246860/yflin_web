const requireFinite = (value, field) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${field} must be finite`);
  }
};

const requireNonNegative = (value, field) => {
  requireFinite(value, field);
  if (value < 0) {
    throw new RangeError(`${field} must be non-negative`);
  }
};

const requireProbability = (value, field) => {
  requireFinite(value, field);
  if (value < 0 || value > 1) {
    throw new RangeError(`${field} must be between zero and one`);
  }
};

export const createSeededPrng = (seed) => {
  const text = String(seed);
  if (text.length === 0) {
    throw new RangeError("seed must not be empty");
  }

  let hash = 1779033703 ^ text.length;
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
  hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
  let state = (hash ^ (hash >>> 16)) >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const normalNoise = (prng, standardDeviation) => {
  if (typeof prng !== "function") {
    throw new TypeError("prng must be a function");
  }
  requireNonNegative(standardDeviation, "standardDeviation");
  if (standardDeviation === 0) return 0;

  let first = prng();
  while (first <= Number.EPSILON) first = prng();
  const second = prng();
  return (
    Math.sqrt(-2 * Math.log(first)) *
    Math.cos(2 * Math.PI * second) *
    standardDeviation
  );
};

export const generateBaseline = (times, { intercept = 0, slope = 0 } = {}) => {
  if (!Array.isArray(times)) {
    throw new TypeError("times must be an array");
  }
  requireFinite(intercept, "intercept");
  requireFinite(slope, "slope");
  return times.map((time, index) => {
    requireFinite(time, `times[${index}]`);
    return intercept + slope * time;
  });
};

export const applyOutliers = (
  values,
  prng,
  { probability = 0, magnitude = 0 } = {},
) => {
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array");
  }
  if (typeof prng !== "function") {
    throw new TypeError("prng must be a function");
  }
  requireProbability(probability, "probability");
  requireNonNegative(magnitude, "magnitude");

  return values.map((value, index) => {
    requireFinite(value, `values[${index}]`);
    if (prng() >= probability) return value;
    const direction = prng() < 0.5 ? -1 : 1;
    return value + direction * magnitude * (0.5 + prng());
  });
};

export const generateObservations = ({
  seed,
  times,
  idealDrawdown,
  noiseStandardDeviation = 0,
  baselineIntercept = 0,
  baselineSlope = 0,
  outlierProbability = 0,
  outlierMagnitude = 0,
}) => {
  if (!Array.isArray(times) || !Array.isArray(idealDrawdown)) {
    throw new TypeError("times and idealDrawdown must be arrays");
  }
  if (times.length === 0 || times.length !== idealDrawdown.length) {
    throw new RangeError("times and idealDrawdown must have the same non-zero length");
  }
  requireNonNegative(noiseStandardDeviation, "noiseStandardDeviation");
  requireProbability(outlierProbability, "outlierProbability");
  requireNonNegative(outlierMagnitude, "outlierMagnitude");

  const prng = createSeededPrng(seed);
  const baseline = generateBaseline(times, {
    intercept: baselineIntercept,
    slope: baselineSlope,
  });
  return times.map((time, index) => {
    if (time <= 0) {
      throw new RangeError(`times[${index}] must be positive`);
    }
    const ideal = idealDrawdown[index];
    requireFinite(ideal, `idealDrawdown[${index}]`);
    const noise = normalNoise(prng, noiseStandardDeviation);
    const isOutlier = prng() < outlierProbability;
    const outlier = isOutlier
      ? (prng() < 0.5 ? -1 : 1) * outlierMagnitude * (0.5 + prng())
      : 0;
    return {
      time,
      drawdown: ideal + baseline[index] + noise + outlier,
      idealDrawdown: ideal,
      baseline: baseline[index],
      noise,
      outlier,
      synthetic: true,
    };
  });
};
