function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}

function scenario(definition) {
  const { K, Ss, b } = definition.truth;
  return deepFreeze({
    ...definition,
    truth: { K, Ss, b, T: K * b, S: Ss * b },
  });
}

export const SCENARIO_IDS = Object.freeze([
  "guided",
  "expert-river",
  "expert-barrier",
]);

export const SCENARIOS = deepFreeze({
  guided: scenario({
    id: "guided",
    seed: "pumping-game:guided:v1",
    truth: { K: 10, Ss: 0.00001, b: 20 },
    boundary: {
      type: "infinite",
      geometry: { kind: "none" },
    },
    expectedModel: "theis",
    candidateSites: [
      {
        id: "terrace",
        recommended: true,
        wellArea: { xMin: 20, xMax: 180, yMin: 20, yMax: 140 },
      },
      {
        id: "orchard",
        recommended: false,
        wellArea: { xMin: 220, xMax: 380, yMin: 30, yMax: 150 },
      },
    ],
    construction: {
      minimumSpacing: 20,
      maximumObservationWells: 3,
    },
    economy: {
      startBudget: 100000,
      pumpingWell: 26000,
      observationWell: 16000,
      pumpStartup: 6000,
      operationPerMinute: 400,
    },
    allowedRates: [600, 900, 1200],
    duration: { maximum: 60 },
    minimumUsableRecord: 20,
  }),
  "expert-river": scenario({
    id: "expert-river",
    seed: "pumping-game:expert-river:v1",
    truth: { K: 7.5, Ss: 0.000018, b: 24 },
    boundary: {
      type: "constant-head",
      geometry: { kind: "vertical-line", x: 0 },
    },
    expectedModel: "river-image",
    candidateSites: [
      {
        id: "river-bench",
        recommended: true,
        wellArea: { xMin: 50, xMax: 230, yMin: 20, yMax: 160 },
      },
      {
        id: "near-bank",
        recommended: false,
        wellArea: { xMin: 15, xMax: 195, yMin: 20, yMax: 160 },
      },
    ],
    construction: {
      minimumSpacing: 25,
      maximumObservationWells: 3,
    },
    economy: {
      startBudget: 120000,
      pumpingWell: 32000,
      observationWell: 20000,
      pumpStartup: 8000,
      operationPerMinute: 450,
    },
    allowedRates: [700, 1000, 1300],
    duration: { maximum: 90 },
    minimumUsableRecord: 30,
  }),
  "expert-barrier": scenario({
    id: "expert-barrier",
    seed: "pumping-game:expert-barrier:v1",
    truth: { K: 14, Ss: 0.0000075, b: 18 },
    boundary: {
      type: "no-flow",
      geometry: { kind: "horizontal-line", y: 200 },
    },
    expectedModel: "barrier-image",
    candidateSites: [
      {
        id: "upland",
        recommended: true,
        wellArea: { xMin: 30, xMax: 220, yMin: 25, yMax: 155 },
      },
      {
        id: "fault-edge",
        recommended: false,
        wellArea: { xMin: 250, xMax: 440, yMin: 45, yMax: 175 },
      },
    ],
    construction: {
      minimumSpacing: 25,
      maximumObservationWells: 3,
    },
    economy: {
      startBudget: 120000,
      pumpingWell: 32000,
      observationWell: 20000,
      pumpStartup: 8000,
      operationPerMinute: 450,
    },
    allowedRates: [700, 1000, 1300],
    duration: { maximum: 90 },
    minimumUsableRecord: 30,
  }),
});

export function getScenario(id) {
  const value = SCENARIOS[id];
  if (!value) throw new RangeError(`Unknown pumping scenario: ${String(id)}`);
  return value;
}
