export const STAGE_IDS = Object.freeze([
  "site-survey",
  "construction",
  "pumping",
  "data-preparation",
  "analysis",
  "results",
]);

export const STAGE_COPY = Object.freeze({
  "site-survey": Object.freeze({
    step: "階段 1／6",
    title: "場址踏勘",
    instruction: "指派水文地質師，閱讀線索後選定一處試驗場址。",
  }),
  construction: Object.freeze({
    step: "階段 2／6",
    title: "試驗井建置",
    instruction: "先由鑽井技師設置抽水井，再由儀器技師安裝至少一口觀測井。",
  }),
  pumping: Object.freeze({
    step: "階段 3／6",
    title: "定流量抽水",
    instruction: "選定流量並指派抽水操作員；啟動後流量即鎖定。",
  }),
  "data-preparation": Object.freeze({
    step: "階段 4／6",
    title: "資料整理",
    instruction: "保留有效序列、修正基線，並設定分析時間窗。",
  }),
  analysis: Object.freeze({
    step: "階段 5／6",
    title: "水文參數分析",
    instruction: "選擇分析法與邊界假設，檢視殘差後提交估計值。",
  }),
  results: Object.freeze({
    step: "階段 6／6",
    title: "含水層判讀",
    instruction: "比較真值與估計值，閱讀評分與科學解釋。",
  }),
});

const CREW_IDS = Object.freeze([
  "hydrogeologist",
  "driller",
  "instrumentation-technician",
  "pump-operator-analyst",
]);

const FEEDBACK = Object.freeze({
  READY: "先選擇一位工作人員，再點選可執行的現地目標。",
  ROUND_CREATED: "新一輪抽水試驗已建立。",
  SITE_SELECTED: "試驗場址已選定。",
  WELL_INSTALLED: "試驗井與記錄器安裝完成，預算已更新。",
  CONSTRUCTION_COMPLETE: "井網建置完成，可以設定定流量抽水。",
  PUMP_STARTED: "抽水與觀測記錄器已啟動。",
  RECORD_EXTENDED: "模型產生的合成記錄已延長。",
  PUMP_STOPPED: "抽水已停止，合成記錄已封存。",
  SERIES_RETAINED: "觀測井序列已保留。",
  DATA_PREPARED: "資料整理完成，可以進行參數分析。",
  ANALYSIS_SUBMITTED: "K 與 Ss 結果已提交並完成評分。",
  RESULTS_REVIEWED: "已確認閱讀結果與科學解釋。",
  REPLAY_SAME_SEED: "已用相同種子建立可重現的新回合。",
  REPLAY_NEW_SEED: "已用新種子建立另一組合成記錄。",
  WRONG_ROLE: "這項工作需要不同專長；未支出任何預算。",
  INVALID_TARGET: "目前階段不能操作這個目標。",
  INVALID_SITE: "候選場址無效；狀態與預算未變更。",
  INVALID_SPACING: "井距不符合最低間距；未支出任何預算。",
  OUTSIDE_CONSTRUCTION_BOUNDS: "井位超出施工範圍；未支出任何預算。",
  OVER_BUDGET: "剩餘預算不足；操作未執行。",
  OBSERVATION_LIMIT: "觀測井已達本情境上限。",
  DUPLICATE_ACTION: "這項工作已完成，不會重複支出或執行。",
  DUPLICATE_SUBMIT: "結果已提交，不會重複評分。",
  STAGE_GATE: "目前階段尚未符合前進條件。",
  MISSING_REQUIRED_WELLS: "必須完成一口抽水井與至少一口觀測井。",
  RATE_REQUIRED: "請先選擇允許的定流量。",
  RATE_LOCKED: "抽水已啟動，流量不得再更改。",
  INVALID_RATE: "所選流量不在本情境允許範圍內。",
  PUMP_NOT_RUNNING: "抽水尚未啟動或已停止，無法延長記錄。",
  INVALID_DURATION: "記錄時間無效或超出情境上限。",
  MINIMUM_RECORD_REQUIRED: "記錄時間尚不足，停止按鈕會在資料可用後開放。",
  VALID_SERIES_REQUIRED: "至少保留一組觀測井序列。",
  INVALID_SERIES_WINDOW: "分析時間窗必須位於記錄範圍內，且終點晚於起點。",
  CJ_NOT_LATE: "Cooper–Jacob 只能使用晚期近直線資料；請把時間窗起點往後移。",
  BOUNDARY_MISMATCH: "此邊界假設與合成情境不符；仍可分析，但模型判斷分數會降低。",
  INVALID_PARAMETERS: "K 與 Ss 都必須是有限且大於零的數值。",
  ANALYSIS_REQUIRED: "請先執行分析並檢查殘差。",
  RESULTS_REVIEW_REQUIRED: "請先閱讀結果與科學解釋，再進行重玩。",
  MALFORMED_ACTION: "輸入格式無效，狀態未變更。",
});

const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

const response = (gameplay, changes, code, tone = "info", message = FEEDBACK[code]) =>
  deepFreeze({
    ...gameplay,
    ...changes,
    feedback: { code, tone, message: message ?? code },
  });

const rejected = (gameplay, code) => response(gameplay, {}, code, "error");

const emptyData = (duration = 0) => ({
  retainedWellIds: [],
  window: { start: duration > 1 ? 1 : 0, end: duration },
  baselineCorrected: false,
  outlierFlagged: false,
});

const emptyAnalysis = () => ({
  method: "theis",
  assumption: "plain",
  fit: null,
  estimate: null,
  warning: null,
  parameterError: false,
});

const fromRound = (round) => deepFreeze({
  round,
  selectedCrewId: null,
  completedAssignments: [],
  chosenRate: null,
  data: emptyData(),
  analysis: emptyAnalysis(),
  animation: null,
  feedback: { code: "READY", tone: "info", message: FEEDBACK.READY },
});

export function createGameplay(scenarioId = "guided", seed) {
  return fromRound(createRound(scenarioId, seed));
}

const selectedSite = (gameplay) => {
  const scenario = getScenario(gameplay.round.scenarioId);
  return scenario.candidateSites.find(
    (candidate) => candidate.id === gameplay.round.selectedSiteId,
  );
};

const wellDefinitions = (gameplay) => {
  const scenario = getScenario(gameplay.round.scenarioId);
  const site = selectedSite(gameplay);
  if (!site) return [];
  const area = site.wellArea;
  const spacing = scenario.construction.minimumSpacing + 8;
  const closeOffset = (scenario.construction.minimumSpacing - 2) / Math.SQRT2;
  const pump = {
    id: "PW-1",
    kind: "pump",
    x: area.xMin + 25,
    y: (area.yMin + area.yMax) / 2,
  };
  return [
    { targetId: "well:pump", role: "driller", well: pump, label: "抽水井 P-1" },
    {
      targetId: "well:observation-1",
      role: "instrumentation-technician",
      well: { id: "OW-1", kind: "observation", x: pump.x + spacing, y: pump.y },
      label: "觀測井 O-1／記錄器",
    },
    {
      targetId: "well:observation-near",
      role: "instrumentation-technician",
      well: {
        id: "OW-N",
        kind: "observation",
        x: pump.x - closeOffset,
        y: pump.y - closeOffset,
      },
      label: "近距觀測井候選點\n訊號可能較強",
    },
    {
      targetId: "well:observation-2",
      role: "instrumentation-technician",
      well: { id: "OW-2", kind: "observation", x: pump.x, y: pump.y + spacing },
      label: "觀測井 O-2／記錄器",
    },
    {
      targetId: "well:observation-3",
      role: "instrumentation-technician",
      well: { id: "OW-3", kind: "observation", x: pump.x + 2 * spacing, y: pump.y },
      label: "觀測井 O-3／記錄器",
    },
  ];
};

const displayPoint = (well, area) => ({
  x: 150 + 650 * (well.x - area.xMin) / (area.xMax - area.xMin),
  y: 120 + 260 * (well.y - area.yMin) / (area.yMax - area.yMin),
});

export function getStageTargets(gameplay) {
  if (!gameplay?.round) return [];
  const scenario = getScenario(gameplay.round.scenarioId);
  switch (gameplay.round.stage) {
    case "site-survey":
      return scenario.candidateSites.map((site, index) => ({
        id: `site:${site.id}`,
        role: "hydrogeologist",
        label: index === 0 ? "候選地 A" : "候選地 B",
        detail: site.recommended ? "地層線索完整、施工空間足夠" : "邊界訊號較強、解釋風險較高",
        recommended: site.recommended,
        siteId: site.id,
        x: index === 0 ? 310 : 650,
        y: index === 0 ? 240 : 270,
      }));
    case "construction": {
      const area = selectedSite(gameplay).wellArea;
      return wellDefinitions(gameplay).map((definition) => ({
        id: definition.targetId,
        role: definition.role,
        label: definition.label,
        well: definition.well,
        complete: gameplay.round.wells.some(
          (well) => well.id === definition.well.id,
        ),
        ...displayPoint(definition.well, area),
      }));
    }
    case "pumping":
      return [{
        id: "pump:control",
        role: "pump-operator-analyst",
        label: gameplay.round.pump.started ? "抽水控制台運轉中" : "啟動抽水與記錄器",
        complete: gameplay.round.pump.started,
        x: 735,
        y: 315,
      }];
    default:
      return [];
  }
}

const modelDrawdown = ({
  scenario,
  assumption,
  pumpingRate,
  transmissivity,
  storativity,
  time,
  pump,
  observation,
}) => {
  const timeInDays = time / 1440;
  if (assumption === "plain") {
    return theisDrawdown({
      pumpingRate,
      transmissivity,
      storativity,
      radius: Math.hypot(observation.x - pump.x, observation.y - pump.y),
      time: timeInDays,
    }).drawdown;
  }
  if (assumption === "river") {
    return imageWellDrawdown({
      pumpingRate,
      transmissivity,
      storativity,
      time: timeInDays,
      well: pump,
      observation,
      boundary: "river",
    }).drawdown;
  }
  const boundaryY = scenario.boundary.geometry.y;
  return imageWellDrawdown({
    pumpingRate,
    transmissivity,
    storativity,
    time: timeInDays,
    well: { x: boundaryY - pump.y, y: pump.x },
    observation: { x: boundaryY - observation.y, y: observation.x },
    boundary: "barrier",
  }).drawdown;
};

const scenarioAssumption = (scenario) => (
  scenario.boundary.type === "constant-head"
    ? "river"
    : scenario.boundary.type === "no-flow"
      ? "barrier"
      : "plain"
);

export function getLiveSeries(gameplay) {
  if (!gameplay?.round?.pump?.started || gameplay.round.pump.duration <= 0) {
    return [];
  }
  const scenario = getScenario(gameplay.round.scenarioId);
  const pump = gameplay.round.wells.find((well) => well.kind === "pump");
  const observations = gameplay.round.wells.filter(
    (well) => well.kind === "observation",
  );
  if (!pump || observations.length === 0) return [];
  const times = Array.from(
    { length: Math.floor(gameplay.round.pump.duration) },
    (_, index) => index + 1,
  );
  const expert = scenario.id !== "guided";
  return observations.map((well) => {
    const idealDrawdown = times.map((time) => modelDrawdown({
      scenario,
      assumption: scenarioAssumption(scenario),
      pumpingRate: gameplay.round.pump.rate,
      transmissivity: scenario.truth.T,
      storativity: scenario.truth.S,
      time,
      pump,
      observation: well,
    }));
    const generated = generateObservations({
      seed: `${gameplay.round.seed}:${well.id}:series`,
      times,
      idealDrawdown,
      noiseStandardDeviation: expert ? 0.008 : 0.003,
      baselineIntercept: expert ? 0.025 : 0,
      baselineSlope: expert ? 0.0004 : 0,
    });
    const prng = createSeededPrng(`${gameplay.round.seed}:${well.id}:outlier`);
    const outlierIndex = expert ? Math.floor(prng() * generated.length) : -1;
    const outlierDelta = expert ? (prng() < 0.5 ? -1 : 1) * (0.07 + 0.05 * prng()) : 0;
    return {
      wellId: well.id,
      radius: Math.hypot(well.x - pump.x, well.y - pump.y),
      points: generated.map((point, index) => ({
        ...point,
        drawdown: point.drawdown + (index === outlierIndex ? outlierDelta : 0),
        outlier: index === outlierIndex ? outlierDelta : 0,
        isOutlier: index === outlierIndex,
      })),
    };
  });
}

const stateFeedback = (gameplay, round) => {
  const code = round.lastAction.code;
  return round.lastAction.accepted
    ? response(gameplay, { round }, code, "success", FEEDBACK[code] ?? code)
    : rejected(gameplay, code);
};

const activateTarget = (gameplay, targetId) => {
  const target = getStageTargets(gameplay).find((candidate) => candidate.id === targetId);
  if (!target) return rejected(gameplay, "INVALID_TARGET");
  if (target.role !== gameplay.selectedCrewId) return rejected(gameplay, "WRONG_ROLE");
  let round = gameplay.round;
  if (gameplay.round.stage === "site-survey") {
    round = applyAction(round, { type: "select-site", siteId: target.siteId });
  } else if (gameplay.round.stage === "construction") {
    round = applyAction(round, { type: "install-well", well: target.well });
  } else if (gameplay.round.stage === "pumping") {
    if (gameplay.chosenRate === null) return rejected(gameplay, "RATE_REQUIRED");
    round = applyAction(round, { type: "start-pumping", rate: gameplay.chosenRate });
  }
  if (!round.lastAction.accepted) return stateFeedback(gameplay, round);
  return response(gameplay, {
    round,
    selectedCrewId: null,
    completedAssignments: [...gameplay.completedAssignments, targetId],
    animation: {
      crewId: target.role,
      targetId,
      x: target.x,
      y: target.y,
      sequence: gameplay.completedAssignments.length + 1,
    },
  }, "ASSIGNMENT_ACCEPTED", "success", `${target.label}：工作完成。`);
};

const preparedDatasets = (gameplay) => {
  const series = getLiveSeries(gameplay);
  const wells = new Map(gameplay.round.wells.map((well) => [well.id, well]));
  return series
    .filter((entry) => gameplay.data.retainedWellIds.includes(entry.wellId))
    .map((entry) => {
      const points = entry.points
        .filter(({ time }) =>
          time >= gameplay.data.window.start && time <= gameplay.data.window.end)
        .filter((point) => !(gameplay.data.outlierFlagged && point.isOutlier))
        .map((point) => ({
          time: point.time,
          drawdown: Math.max(
            0,
            point.drawdown - (gameplay.data.baselineCorrected ? point.baseline : 0),
          ),
        }));
      return { well: wells.get(entry.wellId), radius: entry.radius, observations: points };
    });
};

export function canTickPumping(gameplay) {
  if (!gameplay?.round || gameplay.round.stage !== "pumping") return false;
  const scenario = getScenario(gameplay.round.scenarioId);
  return gameplay.round.pump.started
    && !gameplay.round.pump.stopped
    && gameplay.round.pump.duration < scenario.duration.maximum;
}

export function isLateTimeWindow(gameplay) {
  if (!gameplay?.round?.pump?.rate || !(gameplay?.data?.window?.start > 0)) return false;
  const scenario = getScenario(gameplay.round.scenarioId);
  const pump = gameplay.round.wells.find((well) => well.kind === "pump");
  const observations = gameplay.round.wells.filter(
    (well) => gameplay.data.retainedWellIds.includes(well.id),
  );
  if (!pump || observations.length === 0) return false;
  return observations.every((well) => theisDrawdown({
    pumpingRate: gameplay.round.pump.rate,
    transmissivity: scenario.truth.T,
    storativity: scenario.truth.S,
    radius: Math.hypot(well.x - pump.x, well.y - pump.y),
    time: gameplay.data.window.start / 1440,
  }).u <= 0.1);
}

const fitBoundaryTheis = (gameplay, datasets) => {
  const scenario = getScenario(gameplay.round.scenarioId);
  const pump = gameplay.round.wells.find((well) => well.kind === "pump");
  let minT = Math.log10(10);
  let maxT = Math.log10(2000);
  let minS = Math.log10(1e-6);
  let maxS = Math.log10(0.02);
  let best = { logT: minT, logS: minS, error: Number.POSITIVE_INFINITY };
  const size = 19;
  for (let refinement = 0; refinement < 6; refinement += 1) {
    const stepT = (maxT - minT) / (size - 1);
    const stepS = (maxS - minS) / (size - 1);
    best = { ...best, error: Number.POSITIVE_INFINITY };
    for (let ti = 0; ti < size; ti += 1) {
      const logT = minT + ti * stepT;
      for (let si = 0; si < size; si += 1) {
        const logS = minS + si * stepS;
        let error = 0;
        for (const dataset of datasets) {
          for (const observation of dataset.observations) {
            const predicted = modelDrawdown({
              scenario,
              assumption: gameplay.analysis.assumption,
              pumpingRate: gameplay.round.pump.rate,
              transmissivity: 10 ** logT,
              storativity: 10 ** logS,
              time: observation.time,
              pump,
              observation: dataset.well,
            });
            error += (observation.drawdown - predicted) ** 2;
          }
        }
        if (error < best.error) best = { logT, logS, error };
      }
    }
    minT = best.logT - 2 * stepT;
    maxT = best.logT + 2 * stepT;
    minS = best.logS - 2 * stepS;
    maxS = best.logS + 2 * stepS;
  }
  const transmissivity = 10 ** best.logT;
  const storativity = 10 ** best.logS;
  const observed = [];
  const predicted = [];
  datasets.forEach((dataset) => dataset.observations.forEach((observation) => {
    observed.push(observation);
    predicted.push(modelDrawdown({
      scenario,
      assumption: gameplay.analysis.assumption,
      pumpingRate: gameplay.round.pump.rate,
      transmissivity,
      storativity,
      time: observation.time,
      pump,
      observation: dataset.well,
    }));
  }));
  return {
    transmissivity,
    storativity,
    ...toAquiferProperties({
      transmissivity,
      storativity,
      thickness: scenario.truth.b,
    }),
    rmse: Math.sqrt(best.error / observed.length),
    residuals: calculateResiduals(observed, predicted),
  };
};

const runFit = (gameplay) => {
  const datasets = preparedDatasets(gameplay);
  if (datasets.length === 0 || datasets.some((dataset) => dataset.observations.length < 3)) {
    throw new RangeError("INVALID_SERIES_WINDOW");
  }
  const scenario = getScenario(gameplay.round.scenarioId);
  const observationsInDays = datasets[0].observations.map((observation) => ({
    ...observation,
    time: observation.time / 1440,
  }));
  const restoreDisplayMinutes = (fit) => ({
    ...fit,
    residuals: fit.residuals.map((residual) => ({
      ...residual,
      time: residual.time * 1440,
    })),
  });
  if (gameplay.analysis.method === "cooper-jacob") {
    if (!isLateTimeWindow(gameplay)) throw new RangeError("CJ_NOT_LATE");
    return restoreDisplayMinutes(fitCooperJacob({
      observations: observationsInDays,
      pumpingRate: gameplay.round.pump.rate,
      radius: datasets[0].radius,
      thickness: scenario.truth.b,
      window: {
        startTime: gameplay.data.window.start / 1440,
        endTime: gameplay.data.window.end / 1440,
      },
    }));
  }
  if (datasets.length === 1 && gameplay.analysis.assumption === "plain") {
    return restoreDisplayMinutes(fitTheis({
      observations: observationsInDays,
      pumpingRate: gameplay.round.pump.rate,
      radius: datasets[0].radius,
      thickness: scenario.truth.b,
    }));
  }
  return fitBoundaryTheis(gameplay, datasets);
};

const expectedAssumption = (scenario) => (
  scenario.expectedModel === "river-image"
    ? "river"
    : scenario.expectedModel === "barrier-image"
      ? "barrier"
      : "plain"
);

const modelForAssumption = (assumption) => (
  assumption === "river"
    ? "river-image"
    : assumption === "barrier"
      ? "barrier-image"
      : "theis"
);

export function reduceGameplay(gameplay, action) {
  if (!gameplay?.round || !action || typeof action.type !== "string") {
    return gameplay?.round ? rejected(gameplay, "MALFORMED_ACTION") : gameplay;
  }
  const scenario = getScenario(gameplay.round.scenarioId);
  switch (action.type) {
    case "select-crew":
      return CREW_IDS.includes(action.crewId)
        ? response(gameplay, { selectedCrewId: action.crewId }, "CREW_SELECTED")
        : rejected(gameplay, "MALFORMED_ACTION");
    case "cancel-crew":
      return response(gameplay, { selectedCrewId: null }, "SELECTION_CANCELLED");
    case "activate-target":
      return activateTarget(gameplay, action.targetId);
    case "advance": {
      const round = applyAction(gameplay.round, { type: "advance" });
      return stateFeedback(gameplay, round);
    }
    case "set-rate":
      if (gameplay.round.stage !== "pumping" || gameplay.round.pump.started) {
        return rejected(gameplay, "RATE_LOCKED");
      }
      return scenario.allowedRates.includes(action.rate)
        ? response(gameplay, { chosenRate: action.rate }, "RATE_SELECTED")
        : rejected(gameplay, "INVALID_RATE");
    case "tick": {
      const round = applyAction(gameplay.round, {
        type: "record-pumping",
        duration: action.duration,
      });
      return stateFeedback(gameplay, round);
    }
    case "stop-pumping": {
      const round = applyAction(gameplay.round, { type: "stop-pumping" });
      if (!round.lastAction.accepted) return stateFeedback(gameplay, round);
      return response(gameplay, {
        round,
        data: emptyData(round.pump.duration),
      }, "PUMP_STOPPED", "success", "抽水停止；合成記錄已送入現地筆記本。");
    }
    case "toggle-series": {
      if (gameplay.round.stage !== "data-preparation") return rejected(gameplay, "STAGE_GATE");
      const exists = gameplay.round.wells.some(
        (well) => well.kind === "observation" && well.id === action.wellId,
      );
      if (!exists) return rejected(gameplay, "INVALID_SERIES_WINDOW");
      const retained = gameplay.data.retainedWellIds.includes(action.wellId)
        ? gameplay.data.retainedWellIds.filter((wellId) => wellId !== action.wellId)
        : [...gameplay.data.retainedWellIds, action.wellId];
      return response(gameplay, {
        data: { ...gameplay.data, retainedWellIds: retained },
      }, "SERIES_SELECTION_CHANGED");
    }
    case "set-window":
      return response(gameplay, {
        data: {
          ...gameplay.data,
          window: { start: Number(action.start), end: Number(action.end) },
        },
      }, "WINDOW_CHANGED");
    case "toggle-baseline":
      return response(gameplay, {
        data: {
          ...gameplay.data,
          baselineCorrected: !gameplay.data.baselineCorrected,
        },
      }, "BASELINE_CHANGED");
    case "flag-outlier":
      return response(gameplay, {
        data: { ...gameplay.data, outlierFlagged: !gameplay.data.outlierFlagged },
      }, "OUTLIER_FLAG_CHANGED");
    case "confirm-data": {
      if (gameplay.data.retainedWellIds.length === 0) {
        return rejected(gameplay, "VALID_SERIES_REQUIRED");
      }
      const { start, end } = gameplay.data.window;
      if (!(start > 0) || !(end > start) || end > gameplay.round.pump.duration) {
        return rejected(gameplay, "INVALID_SERIES_WINDOW");
      }
      let round = gameplay.round;
      for (const wellId of gameplay.data.retainedWellIds) {
        round = applyAction(round, {
          type: "retain-series",
          wellId,
          window: { start, end },
        });
        if (!round.lastAction.accepted) return stateFeedback(gameplay, round);
      }
      round = applyAction(round, { type: "advance" });
      const advanced = stateFeedback(gameplay, round);
      if (expectedAssumption(scenario) === "plain") return advanced;
      return response(advanced, {
        analysis: {
          ...advanced.analysis,
          warning: "BOUNDARY_MISMATCH",
        },
      }, "BOUNDARY_MISMATCH", "warning");
    }
    case "set-method":
      return action.method === "theis" || action.method === "cooper-jacob"
        ? response(gameplay, {
          analysis: { ...gameplay.analysis, method: action.method, fit: null, estimate: null },
        }, "METHOD_CHANGED")
        : rejected(gameplay, "MALFORMED_ACTION");
    case "set-assumption": {
      if (!["plain", "river", "barrier"].includes(action.assumption)) {
        return rejected(gameplay, "MALFORMED_ACTION");
      }
      const warning = action.assumption === expectedAssumption(scenario)
        ? null
        : "BOUNDARY_MISMATCH";
      return response(gameplay, {
        analysis: {
          ...gameplay.analysis,
          assumption: action.assumption,
          fit: null,
          estimate: null,
          warning,
        },
      }, warning ?? "ASSUMPTION_CHANGED", warning ? "warning" : "info",
      warning
        ? "此邊界假設與合成情境不符；仍可分析，但模型判斷分數會降低。"
        : "邊界假設已更新。");
    }
    case "run-analysis":
      try {
        const fit = runFit(gameplay);
        return response(gameplay, {
          analysis: {
            ...gameplay.analysis,
            fit,
            estimate: {
              K: fit.hydraulicConductivity,
              Ss: fit.specificStorage,
            },
            parameterError: false,
          },
        }, "ANALYSIS_COMPLETE", "success", "擬合完成；請檢查殘差與參數。");
      } catch (error) {
        const code = error instanceof RangeError && error.message === "CJ_NOT_LATE"
          ? "CJ_NOT_LATE"
          : "INVALID_SERIES_WINDOW";
        return rejected(gameplay, code);
      }
    case "adjust-estimate": {
      const estimate = action.estimate;
      if (
        !estimate
        || !Number.isFinite(estimate.K)
        || estimate.K <= 0
        || !Number.isFinite(estimate.Ss)
        || estimate.Ss <= 0
      ) {
        return response(gameplay, {
          analysis: { ...gameplay.analysis, parameterError: true },
        }, "INVALID_PARAMETERS", "error");
      }
      return response(gameplay, {
        analysis: {
          ...gameplay.analysis,
          estimate: { ...estimate },
          parameterError: false,
        },
      }, "ESTIMATE_ADJUSTED");
    }
    case "submit-analysis": {
      if (gameplay.analysis.parameterError) {
        return rejected(gameplay, "INVALID_PARAMETERS");
      }
      if (!gameplay.analysis.fit || !gameplay.analysis.estimate) {
        return rejected(gameplay, "ANALYSIS_REQUIRED");
      }
      const round = applyAction(gameplay.round, {
        type: "submit-analysis",
        estimate: gameplay.analysis.estimate,
        model: {
          conceptualModel: modelForAssumption(gameplay.analysis.assumption),
          method: gameplay.analysis.method,
        },
        rmse: gameplay.analysis.fit.rmse,
      });
      return stateFeedback(gameplay, round);
    }
    case "review-results":
      return stateFeedback(
        gameplay,
        applyAction(gameplay.round, { type: "review-results" }),
      );
    case "replay": {
      const round = applyAction(gameplay.round, {
        type: "replay",
        seedMode: action.seedMode,
      });
      return round.lastAction.accepted
        ? fromRound(round)
        : stateFeedback(gameplay, round);
    }
    default:
      return rejected(gameplay, "MALFORMED_ACTION");
  }
}
import {
  calculateResiduals,
  fitCooperJacob,
  fitTheis,
} from "./analysis.mjs";
import {
  imageWellDrawdown,
  theisDrawdown,
  toAquiferProperties,
} from "./physics.mjs";
import {
  createSeededPrng,
  generateObservations,
} from "./random.mjs";
import { getScenario } from "./scenarios.mjs";
import { applyAction, createRound } from "./state.mjs";
