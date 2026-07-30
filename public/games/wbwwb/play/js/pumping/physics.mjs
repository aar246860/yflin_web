const EULER_MASCHERONI = 0.5772156649015329;
const NUMERICAL_TOLERANCE = 1e-15;
const MAXIMUM_ITERATIONS = 200;

const requirePositive = (value, field) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${field} must be finite`);
  }
  if (value <= 0) {
    throw new RangeError(`${field} must be positive`);
  }
};

const requirePoint = (point, field) => {
  if (
    point === null ||
    typeof point !== "object" ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new TypeError(`${field} must contain finite x and y coordinates`);
  }
};

const validatePumpingParameters = ({
  pumpingRate,
  transmissivity,
  storativity,
  radius,
  time,
}) => {
  requirePositive(pumpingRate, "pumpingRate");
  requirePositive(transmissivity, "transmissivity");
  requirePositive(storativity, "storativity");
  requirePositive(radius, "radius");
  requirePositive(time, "time");
};

export const exponentialIntegralE1 = (value) => {
  requirePositive(value, "value");

  if (value <= 1) {
    let sum = 0;
    let term = 1;
    for (let index = 1; index <= MAXIMUM_ITERATIONS; index += 1) {
      term *= -value / index;
      const increment = term / index;
      sum += increment;
      if (Math.abs(increment) <= Math.abs(sum) * NUMERICAL_TOLERANCE) {
        break;
      }
    }
    return -EULER_MASCHERONI - Math.log(value) - sum;
  }

  const minimum = Number.MIN_VALUE / NUMERICAL_TOLERANCE;
  let b = value + 1;
  let c = 1 / minimum;
  let d = 1 / b;
  let fraction = d;
  for (let index = 1; index <= MAXIMUM_ITERATIONS; index += 1) {
    const a = -(index * index);
    b += 2;
    d = a * d + b;
    if (Math.abs(d) < minimum) d = minimum;
    c = b + a / c;
    if (Math.abs(c) < minimum) c = minimum;
    d = 1 / d;
    const delta = c * d;
    fraction *= delta;
    if (Math.abs(delta - 1) <= NUMERICAL_TOLERANCE) {
      break;
    }
  }
  return fraction * Math.exp(-value);
};

export const theisDrawdown = (parameters) => {
  validatePumpingParameters(parameters);
  const { pumpingRate, transmissivity, storativity, radius, time } = parameters;
  const u = (radius * radius * storativity) / (4 * transmissivity * time);
  return {
    u,
    drawdown: (pumpingRate * exponentialIntegralE1(u)) / (4 * Math.PI * transmissivity),
  };
};

export const cooperJacobDrawdown = (parameters) => {
  validatePumpingParameters(parameters);
  const { pumpingRate, transmissivity, storativity, radius, time } = parameters;
  const u = (radius * radius * storativity) / (4 * transmissivity * time);
  return {
    u,
    drawdown:
      (2.3 * pumpingRate) /
      (4 * Math.PI * transmissivity) *
      Math.log10((2.25 * transmissivity * time) / (radius * radius * storativity)),
  };
};

export const imageWellDrawdown = (parameters) => {
  const {
    pumpingRate,
    transmissivity,
    storativity,
    time,
    well,
    observation,
    boundary,
  } = parameters;
  requirePositive(pumpingRate, "pumpingRate");
  requirePositive(transmissivity, "transmissivity");
  requirePositive(storativity, "storativity");
  requirePositive(time, "time");
  requirePoint(well, "well");
  requirePoint(observation, "observation");
  if (boundary !== "river" && boundary !== "barrier") {
    throw new RangeError("boundary must be river or barrier");
  }

  const realRadius = Math.hypot(observation.x - well.x, observation.y - well.y);
  const imageRadius = Math.hypot(observation.x + well.x, observation.y - well.y);
  requirePositive(realRadius, "distance from pumping well");
  requirePositive(imageRadius, "distance from image well");
  const real = theisDrawdown({
    pumpingRate,
    transmissivity,
    storativity,
    radius: realRadius,
    time,
  }).drawdown;
  const image = theisDrawdown({
    pumpingRate,
    transmissivity,
    storativity,
    radius: imageRadius,
    time,
  }).drawdown;
  return {
    drawdown: boundary === "river" ? real - image : real + image,
    real,
    image,
  };
};

export const toAquiferProperties = ({ transmissivity, storativity, thickness }) => {
  requirePositive(transmissivity, "transmissivity");
  requirePositive(storativity, "storativity");
  requirePositive(thickness, "thickness");
  return {
    hydraulicConductivity: transmissivity / thickness,
    specificStorage: storativity / thickness,
  };
};

export const toPumpingProperties = ({ hydraulicConductivity, specificStorage, thickness }) => {
  requirePositive(hydraulicConductivity, "hydraulicConductivity");
  requirePositive(specificStorage, "specificStorage");
  requirePositive(thickness, "thickness");
  return {
    transmissivity: hydraulicConductivity * thickness,
    storativity: specificStorage * thickness,
  };
};
