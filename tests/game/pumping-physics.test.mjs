import assert from "node:assert/strict";
import test from "node:test";

import {
  cooperJacobDrawdown,
  exponentialIntegralE1,
  imageWellDrawdown,
  theisDrawdown,
  toAquiferProperties,
} from "../../public/games/wbwwb/play/js/pumping/physics.mjs";
import {
  calculateResiduals,
  fitCooperJacob,
  fitTheis,
  validateObservations,
} from "../../public/games/wbwwb/play/js/pumping/analysis.mjs";
import {
  applyOutliers,
  createSeededPrng,
  generateBaseline,
  generateObservations,
  normalNoise,
} from "../../public/games/wbwwb/play/js/pumping/random.mjs";

const relativeError = (actual, expected) => Math.abs(actual - expected) / Math.abs(expected);

test("E1 matches independent reference values across its numerical regions", () => {
  // Given
  const fixtures = [
    [0.01, 4.037929576538114],
    [0.1, 1.822923958419391],
    [1, 0.2193839343955203],
    [10, 4.156968929685324e-6],
  ];

  // When
  const results = fixtures.map(([u, expected]) => [exponentialIntegralE1(u), expected]);

  // Then
  for (const [actual, expected] of results) {
    assert.ok(relativeError(actual, expected) <= 1e-6, `${actual} differs from ${expected}`);
  }
});

test("Theis and Cooper-Jacob match the benchmark fixture", () => {
  // Given
  const aquifer = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    radius: 50,
    time: 1,
  };

  // When
  const theis = theisDrawdown(aquifer);
  const cooperJacob = cooperJacobDrawdown(aquifer);

  // Then
  assert.equal(theis.u, 0.000625);
  assert.ok(Math.abs(theis.drawdown - 2.706098822961732) <= 1e-12);
  assert.ok(Math.abs(cooperJacob.drawdown - 2.703548216199474) <= 1e-12);
});

test("Cooper-Jacob differs from Theis by less than 0.1 percent at late time", () => {
  // Given
  const aquifer = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    radius: 50,
    time: 0.625,
  };

  // When
  const theis = theisDrawdown(aquifer);
  const cooperJacob = cooperJacobDrawdown(aquifer);

  // Then
  assert.equal(theis.u, 0.001);
  assert.ok(relativeError(cooperJacob.drawdown, theis.drawdown) < 0.001);
});

test("transmissivity and storativity convert to K and Ss", () => {
  // Given
  const parameters = { transmissivity: 200, storativity: 0.0002, thickness: 20 };

  // When
  const converted = toAquiferProperties(parameters);

  // Then
  assert.deepEqual(converted, { hydraulicConductivity: 10, specificStorage: 1e-5 });
});

test("a constant-head river image produces zero drawdown on its boundary", () => {
  // Given
  const setup = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    time: 1,
    well: { x: 40, y: 10 },
    observation: { x: 0, y: 35 },
    boundary: "river",
  };

  // When
  const result = imageWellDrawdown(setup);

  // Then
  assert.ok(Math.abs(result.drawdown) <= 1e-14);
});

test("a no-flow barrier image produces zero normal gradient", () => {
  // Given
  const setup = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    time: 1,
    well: { x: 40, y: 10 },
    boundary: "barrier",
  };
  const epsilon = 1e-4;

  // When
  const positive = imageWellDrawdown({ ...setup, observation: { x: epsilon, y: 35 } });
  const negative = imageWellDrawdown({ ...setup, observation: { x: -epsilon, y: 35 } });
  const centeredGradient = (positive.drawdown - negative.drawdown) / (2 * epsilon);

  // Then
  assert.ok(Math.abs(centeredGradient) <= 1e-10);
});

test("guided full-curve fitting recovers K and Ss within one percent", () => {
  // Given
  const truth = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    radius: 50,
    thickness: 20,
  };
  const times = Array.from({ length: 24 }, (_, index) => 10 ** (-1.2 + index * 0.12));
  const observations = times.map((time) => ({
    time,
    drawdown: theisDrawdown({ ...truth, time }).drawdown,
  }));

  // When
  const fitted = fitTheis({
    observations,
    pumpingRate: truth.pumpingRate,
    radius: truth.radius,
    thickness: truth.thickness,
  });

  // Then
  assert.ok(relativeError(fitted.hydraulicConductivity, 10) < 0.01);
  assert.ok(relativeError(fitted.specificStorage, 1e-5) < 0.01);
});

test("Cooper-Jacob OLS recovers a synthetic straight-line record", () => {
  // Given
  const truth = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    radius: 50,
    thickness: 20,
  };
  const times = [0.1, 0.2, 0.5, 1, 2, 5, 10];
  const observations = times.map((time) => ({
    time,
    drawdown: cooperJacobDrawdown({ ...truth, time }).drawdown,
  }));

  // When
  const fitted = fitCooperJacob({
    observations,
    pumpingRate: truth.pumpingRate,
    radius: truth.radius,
    thickness: truth.thickness,
    window: { startTime: 0.1, endTime: 10 },
  });

  // Then
  assert.ok(relativeError(fitted.transmissivity, truth.transmissivity) < 1e-10);
  assert.ok(relativeError(fitted.storativity, truth.storativity) < 1e-10);
});

test("residuals retain labelled observed and predicted values", () => {
  // Given
  const observations = [
    { time: 1, drawdown: 2.1 },
    { time: 2, drawdown: 2.8 },
  ];
  const predicted = [2, 3];

  // When
  const residuals = calculateResiduals(observations, predicted);

  // Then
  assert.deepEqual(residuals, [
    { time: 1, observed: 2.1, predicted: 2, residual: 0.10000000000000009 },
    { time: 2, observed: 2.8, predicted: 3, residual: -0.20000000000000018 },
  ]);
});

test("seeded noise, baseline, and outliers are deterministic", () => {
  // Given
  const times = [0.1, 0.2, 0.5, 1, 2];
  const idealDrawdown = [0.4, 0.7, 1.1, 1.5, 1.9];
  const options = {
    seed: "expert-river:17",
    times,
    idealDrawdown,
    noiseStandardDeviation: 0.01,
    baselineIntercept: 0.03,
    baselineSlope: 0.002,
    outlierProbability: 0.4,
    outlierMagnitude: 0.25,
  };

  // When
  const first = generateObservations(options);
  const repeated = generateObservations(options);
  const changed = generateObservations({ ...options, seed: "expert-river:18" });

  // Then
  assert.equal(JSON.stringify(first), JSON.stringify(repeated));
  assert.notEqual(JSON.stringify(first), JSON.stringify(changed));
  assert.ok(first.every((row) => row.synthetic === true && Number.isFinite(row.drawdown)));
});

test("seeded random building blocks avoid hidden global state", () => {
  // Given
  const firstPrng = createSeededPrng("building-blocks");
  const secondPrng = createSeededPrng("building-blocks");
  const times = [0, 1, 2];

  // When
  const firstNoise = [normalNoise(firstPrng, 0.1), normalNoise(firstPrng, 0.1)];
  const secondNoise = [normalNoise(secondPrng, 0.1), normalNoise(secondPrng, 0.1)];
  const baseline = generateBaseline(times, { intercept: 1, slope: 0.5 });
  const outliers = applyOutliers([1, 1, 1], createSeededPrng(7), {
    probability: 1,
    magnitude: 0.25,
  });

  // Then
  assert.deepEqual(firstNoise, secondNoise);
  assert.deepEqual(baseline, [1, 1.5, 2]);
  assert.ok(outliers.every((value) => value !== 1 && Number.isFinite(value)));
});

test("non-positive physical inputs reject clearly", () => {
  // Given
  const valid = {
    pumpingRate: 1000,
    transmissivity: 200,
    storativity: 0.0002,
    radius: 50,
    time: 1,
  };

  // When / Then
  for (const [field, value] of Object.entries(valid)) {
    assert.throws(
      () => theisDrawdown({ ...valid, [field]: 0 }),
      { name: "RangeError", message: new RegExp(field, "i") },
      `${field} should reject ${value} -> 0`,
    );
  }
  assert.throws(() => exponentialIntegralE1(0), { name: "RangeError" });
  assert.throws(
    () => toAquiferProperties({ transmissivity: 200, storativity: 0.0002, thickness: 0 }),
    { name: "RangeError", message: /thickness/i },
  );
});

test("invalid Cooper-Jacob windows and malformed observations reject", () => {
  // Given
  const observations = [
    { time: 1, drawdown: 1 },
    { time: 2, drawdown: 2 },
    { time: 3, drawdown: 3 },
  ];
  const base = {
    observations,
    pumpingRate: 1000,
    radius: 50,
    thickness: 20,
  };

  // When / Then
  assert.throws(
    () => fitCooperJacob({ ...base, window: { startTime: 2, endTime: 1 } }),
    { name: "RangeError", message: /window/i },
  );
  assert.throws(
    () => fitCooperJacob({ ...base, window: { startTime: 2.5, endTime: 3 } }),
    { name: "RangeError", message: /three/i },
  );
  assert.throws(() => validateObservations([{ time: 0, drawdown: 1 }]), {
    name: "RangeError",
    message: /time/i,
  });
  assert.throws(() => validateObservations([{ time: 1, drawdown: Number.NaN }]), {
    name: "TypeError",
    message: /drawdown/i,
  });
});
