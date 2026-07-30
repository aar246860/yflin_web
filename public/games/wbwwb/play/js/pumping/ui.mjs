import { drawScientificChart } from "./charts.mjs";
import { getLiveSeries, getStageTargets } from "./gameplay.mjs";

export const PUBLIC_STATUS_MESSAGES = Object.freeze({
  READY: "先選擇一位工作人員，再點選可執行的現地目標。",
  ROUND_CREATED: "新一輪抽水試驗已建立。",
  SITE_SELECTED: "試驗場址已選定。",
  WELL_INSTALLED: "試驗井與記錄器安裝完成，預算已更新。",
  CONSTRUCTION_COMPLETE: "井網建置完成，可以設定定流量抽水。",
  PUMP_STARTED: "抽水與觀測記錄器已啟動。",
  RECORD_EXTENDED: "模型產生的合成記錄已延長。",
  PUMP_STOPPED: "抽水停止；合成記錄已送入現地筆記本。",
  SERIES_RETAINED: "觀測井序列已保留。",
  DATA_PREPARED: "資料整理完成，可以進行參數分析。",
  ANALYSIS_SUBMITTED: "K 與 Ss 結果已提交並完成評分。",
  RESULTS_REVIEWED: "已確認閱讀結果與科學解釋。",
  REPLAY_SAME_SEED: "已用相同案例建立可重現的新回合。",
  REPLAY_NEW_SEED: "已用新案例建立另一組合成記錄。",
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
  CREW_SELECTED: "已選取團隊成員。",
  SELECTION_CANCELLED: "已取消團隊成員選取。",
  ASSIGNMENT_ACCEPTED: "現地工作已完成。",
  RATE_SELECTED: "抽水流量已設定。",
  SERIES_SELECTION_CHANGED: "觀測井序列選擇已更新。",
  WINDOW_CHANGED: "分析時間窗已更新。",
  BASELINE_CHANGED: "基線修正設定已更新。",
  OUTLIER_FLAG_CHANGED: "離群值標記已更新。",
  METHOD_CHANGED: "分析方法已更新。",
  ASSUMPTION_CHANGED: "邊界假設已更新。",
  ANALYSIS_COMPLETE: "擬合完成；請檢查殘差與參數。",
  ESTIMATE_ADJUSTED: "參數估計值已更新。",
});

const PUBLIC_CASE_LABELS = Object.freeze({
  guided: "引導固定案例",
  "expert-river": "專家河流案例",
  "expert-barrier": "專家阻水案例",
});

export function toPublicCaseLabel(scenarioId) {
  return PUBLIC_CASE_LABELS[scenarioId] ?? "自訂合成案例";
}

export function toPublicStatusMessage(feedback) {
  const code = typeof feedback?.code === "string" ? feedback.code : "";
  return PUBLIC_STATUS_MESSAGES[code]
    ?? (feedback?.tone === "error"
      ? "操作未完成，請檢查目前設定。"
      : "操作狀態已更新。");
}

export const CREW = Object.freeze([
  {
    id: "hydrogeologist",
    label: "水文地質師",
    labelParts: ["水文地質師"],
    targetId: "survey",
  },
  {
    id: "driller",
    label: "鑽井技師",
    labelParts: ["鑽井技師"],
    targetId: "pump-pad",
  },
  {
    id: "instrumentation-technician",
    label: "儀器技師",
    labelParts: ["儀器技師"],
    targetId: "observation-array",
  },
  {
    id: "pump-operator-analyst",
    label: "抽水操作員／分析師",
    labelParts: ["抽水操作員", "／分析師"],
    targetId: "control-desk",
  },
]);

export const APPROACH_POINTS = Object.freeze([
  { id: "survey", label: "踏勘標樁", x: 250, y: 180 },
  { id: "pump-pad", label: "抽水井井位", x: 430, y: 300 },
  { id: "observation-array", label: "觀測井陣列", x: 650, y: 220 },
  { id: "control-desk", label: "抽水與記錄站", x: 760, y: 390 },
]);

export function createAssignmentState(budget) {
  return Object.freeze({
    selectedCrewId: null,
    completedTargetIds: Object.freeze([]),
    budget,
    lastResult: "READY",
  });
}

function updateAssignment(state, changes) {
  return Object.freeze({
    ...state,
    ...changes,
    completedTargetIds: Object.freeze(
      changes.completedTargetIds ?? state.completedTargetIds,
    ),
  });
}

export function selectCrew(state, crewId) {
  if (!CREW.some((crew) => crew.id === crewId)) return state;
  return updateAssignment(state, {
    selectedCrewId: crewId,
    lastResult: "CREW_SELECTED",
  });
}

export function cancelCrewSelection(state) {
  if (state.selectedCrewId === null) return state;
  return updateAssignment(state, {
    selectedCrewId: null,
    lastResult: "SELECTION_CANCELLED",
  });
}

export function applyCrewAssignment(state, targetId) {
  const crew = CREW.find((candidate) => candidate.id === state.selectedCrewId);
  const targetExists = APPROACH_POINTS.some((target) => target.id === targetId);
  if (
    !crew
    || !targetExists
    || crew.targetId !== targetId
    || state.completedTargetIds.includes(targetId)
  ) {
    return state;
  }
  return updateAssignment(state, {
    selectedCrewId: null,
    completedTargetIds: [...state.completedTargetIds, targetId],
    lastResult: "ASSIGNMENT_ACCEPTED",
  });
}

export function createControlAdapter({
  crewRoot,
  targetRoot,
  onCrew,
  onTarget,
}) {
  const crewButtons = new Map();
  const targetButtons = new Map();

  for (const crew of CREW) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "crew-button";
    button.dataset.crewId = crew.id;
    button.setAttribute("aria-pressed", "false");
    button.textContent = crew.label;
    button.addEventListener("click", () => onCrew(crew.id));
    crewRoot.append(button);
    crewButtons.set(crew.id, button);
  }

  for (const target of APPROACH_POINTS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "target-button";
    button.dataset.targetId = target.id;
    button.textContent = target.label;
    button.addEventListener("click", () => onTarget(target.id));
    targetRoot.append(button);
    targetButtons.set(target.id, button);
  }

  return {
    render(state) {
      crewButtons.forEach((button, id) => {
        button.setAttribute("aria-pressed", String(id === state.selectedCrewId));
      });
      targetButtons.forEach((button, id) => {
        const complete = state.completedTargetIds.includes(id);
        button.dataset.complete = String(complete);
        button.disabled = complete;
        if (complete) button.setAttribute("aria-label", `${button.textContent}, assigned`);
      });
    },
    focusCrew(crewId) {
      crewButtons.get(crewId)?.focus();
    },
    dispose() {
      crewRoot.replaceChildren();
      targetRoot.replaceChildren();
      crewButtons.clear();
      targetButtons.clear();
    },
  };
}

export function drawDeploymentBoard({
  PIXI,
  application,
  loadedAssets,
  assignmentState,
  onCrew,
  onTarget,
  reducedMotion,
  palette,
}) {
  const scene = new PIXI.Container();
  const backdropImage = loadedAssets.get("stage");
  if (backdropImage) {
    const backdrop = new PIXI.Sprite(PIXI.Texture.fromImage(backdropImage.src));
    backdrop.width = 960;
    backdrop.height = 540;
    backdrop.alpha = 0.42;
    scene.addChild(backdrop);
  }

  const wash = new PIXI.Graphics();
  wash.beginFill(palette.paper, backdropImage ? 0.48 : 0.84);
  wash.drawRect(0, 0, 960, 540);
  wash.endFill();
  scene.addChild(wash);

  const title = new PIXI.Text("固定現地作業點", {
    fontFamily: palette.fontFamily,
    fontSize: palette.typeTitle,
    fontWeight: "bold",
    fill: palette.ink,
  });
  title.position.set(32, 28);
  scene.addChild(title);

  const crewSprites = [];
  CREW.forEach((crew, index) => {
    const x = 45 + index * 115;
    const y = 410;
    const image = loadedAssets.get(`crew:${crew.id}`);
    const sprite = image
      ? new PIXI.Sprite(PIXI.Texture.fromImage(image.src))
      : new PIXI.Graphics();
    if (!image) {
      sprite.beginFill(palette.teal);
      sprite.drawCircle(36, 36, 34);
      sprite.endFill();
    }
    sprite.position.set(x, y);
    sprite.width = 72;
    sprite.height = 72;
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on("click", () => onCrew(crew.id));
    sprite.on("tap", () => onCrew(crew.id));
    sprite.alpha = assignmentState.selectedCrewId === crew.id ? 1 : 0.78;
    scene.addChild(sprite);
    crewSprites.push(sprite);
  });

  APPROACH_POINTS.forEach((target, index) => {
    const complete = assignmentState.completedTargetIds.includes(target.id);
    const marker = new PIXI.Graphics();
    marker.lineStyle(4, complete ? palette.teal : palette.ink, 1);
    marker.beginFill(complete ? palette.mineral : palette.paperBright, 0.96);
    marker.drawCircle(0, 0, complete ? 24 : 20);
    marker.endFill();
    marker.position.set(target.x, target.y);
    marker.interactive = !complete;
    marker.buttonMode = !complete;
    marker.on("click", () => onTarget(target.id));
    marker.on("tap", () => onTarget(target.id));
    scene.addChild(marker);

    const label = new PIXI.Text(`${index + 1}. ${target.label}`, {
      fontFamily: palette.fontFamily,
    fontSize: palette.typeLabel,
      fontWeight: "bold",
      fill: palette.ink,
      wordWrap: true,
      wordWrapWidth: 160,
      align: "center",
    });
    label.anchor.set(0.5, 0);
    label.position.set(target.x, target.y + 32);
    scene.addChild(label);
  });

  application.stage.addChild(scene);
  application.renderer.render(application.stage);
  let phase = 0;

  return {
    step(seconds) {
      if (reducedMotion) return;
      phase += seconds;
      crewSprites.forEach((sprite, index) => {
        sprite.y = 410 + Math.sin(phase * 1.4 + index) * 2;
      });
    },
    render() {
      application.renderer.render(application.stage);
    },
    dispose() {
      application.stage.removeChild(scene);
      scene.destroy({ children: true, texture: false, baseTexture: false });
    },
  };
}

export const STAGE_ASSETS = Object.freeze({
  "site-survey": Object.freeze(["stage:site-survey", "prop:site-survey"]),
  construction: Object.freeze(["stage:construction", "prop:construction"]),
  pumping: Object.freeze(["stage:pumping", "prop:pumping"]),
  "data-preparation": Object.freeze(["stage:data-preparation", "prop:data-preparation"]),
  analysis: Object.freeze(["stage:analysis", "prop:analysis"]),
  results: Object.freeze(["stage:results", "prop:results"]),
});

const crewTexture = (PIXI, image, frameIndex) => {
  const base = PIXI.Texture.fromImage(image.src);
  const frameSize = Math.floor(Math.min(image.naturalWidth, image.naturalHeight) / 2);
  return new PIXI.Texture(
    base.baseTexture,
    new PIXI.Rectangle(
      (frameIndex % 2) * frameSize,
      Math.floor(frameIndex / 2) * frameSize,
      frameSize,
      frameSize,
    ),
  );
};

const CREW_FRAME_BY_STATE = Object.freeze({
  idle: 0,
  walking: 1,
  task: 2,
  complete: 3,
  error: 3,
});

const CREW_CANVAS_LABELS = Object.freeze({
  walking: "行進中",
  task: "作業中",
  complete: "已完成",
  error: "未完成",
});

const addLabel = (PIXI, container, palette, value, x, y, options = {}) => {
  const label = new PIXI.Text(value, {
    fontFamily: palette.fontFamily,
    fontSize: options.size ?? palette.typeLabel,
    fontWeight: options.weight ?? "bold",
    fill: options.fill ?? palette.ink,
    align: options.align ?? "left",
    wordWrap: options.wordWrap ?? true,
    wordWrapWidth: options.width ?? 220,
  });
  label.anchor.set(options.anchor ?? 0, 0);
  label.position.set(x, y);
  container.addChild(label);
  return label;
};

export const RESULT_SCORE_LAYOUT = Object.freeze({
  panel: Object.freeze({ width: 520, height: 300 }),
  total: Object.freeze({ x: 20, y: 16, width: 350 }),
  parts: Object.freeze({ labelX: 20, firstY: 90, rowStep: 41 }),
  track: Object.freeze({ x: 235, width: 250, height: 15 }),
});

const drawResultBars = (PIXI, gameplay, palette) => {
  const panel = new PIXI.Container();
  const labels = {};
  const parts = [
    ["K", "導水係數 K", 30],
    ["Ss", "比儲水係數 Ss", 30],
    ["modelJudgment", "模型判斷", 15],
    ["dataSufficiency", "資料充分性", 15],
    ["budget", "預算管理", 10],
  ];
  const background = new PIXI.Graphics();
  background.beginFill(palette.paperBright, 0.94);
  background.lineStyle(2, palette.ink, 0.85);
  background.drawRoundedRect(0, 0, RESULT_SCORE_LAYOUT.panel.width, RESULT_SCORE_LAYOUT.panel.height, 8);
  background.endFill();
  panel.addChild(background);
  labels.total = addLabel(
    PIXI,
    panel,
    palette,
    `總分 ${gameplay.round.score.total}／100`,
    RESULT_SCORE_LAYOUT.total.x,
    RESULT_SCORE_LAYOUT.total.y,
    {
      size: palette.typeTitle,
      width: RESULT_SCORE_LAYOUT.total.width,
      wordWrap: false,
    },
  );
  parts.forEach(([key, label, maximum], index) => {
    const y = RESULT_SCORE_LAYOUT.parts.firstY + index * RESULT_SCORE_LAYOUT.parts.rowStep;
    const value = gameplay.round.score.parts[key];
    labels[key] = addLabel(
      PIXI,
      panel,
      palette,
      `${label}  ${value}／${maximum}`,
      RESULT_SCORE_LAYOUT.parts.labelX,
      y,
      { size: palette.typeCaption },
    );
    const track = new PIXI.Graphics();
    track.beginFill(palette.mineral, 1);
    track.drawRect(
      RESULT_SCORE_LAYOUT.track.x,
      y + 2,
      RESULT_SCORE_LAYOUT.track.width,
      RESULT_SCORE_LAYOUT.track.height,
    );
    track.endFill();
    track.beginFill(key === "modelJudgment" && value < maximum ? palette.warning : palette.success, 1);
    track.drawRect(
      RESULT_SCORE_LAYOUT.track.x,
      y + 2,
      RESULT_SCORE_LAYOUT.track.width * value / maximum,
      RESULT_SCORE_LAYOUT.track.height,
    );
    track.endFill();
    panel.addChild(track);
  });
  return { panel, labels };
};

export function drawGameplayScene({
  PIXI,
  application,
  loadedAssets,
  gameplay,
  onCrew,
  onTarget,
  onProp,
  reducedMotion,
  animateAssignment = false,
  crewVisual = { crewId: null, state: "idle" },
  palette,
}) {
  const scene = new PIXI.Container();
  let resultBars = null;
  const stage = gameplay.round.stage;
  const [stageAsset, propAsset] = STAGE_ASSETS[stage];
  const backdropImage = loadedAssets.get(stageAsset);
  if (backdropImage) {
    const backdrop = new PIXI.Sprite(PIXI.Texture.fromImage(backdropImage.src));
    backdrop.width = 960;
    backdrop.height = 540;
    scene.addChild(backdrop);
  }
  const wash = new PIXI.Graphics();
  wash.beginFill(
    stage === "results" ? palette.paper : palette.paperBright,
    stage === "results" ? 0.16 : 0.24,
  );
  wash.drawRect(0, 0, 960, 540);
  wash.endFill();
  scene.addChild(wash);

  const synthetic = new PIXI.Graphics();
  synthetic.beginFill(palette.ink, 0.88);
  synthetic.drawRoundedRect(20, 16, 352, 34, 6);
  synthetic.endFill();
  scene.addChild(synthetic);
  addLabel(
    PIXI,
    scene,
    palette,
    "模型產生的合成資料 · 非現地量測",
    34,
    24,
    { size: palette.typeCaption, fill: palette.paperBright },
  );

  const propImage = loadedAssets.get(propAsset);
  if (propImage) {
    const chartStage = ["pumping", "data-preparation", "analysis", "results"].includes(stage);
    const prop = new PIXI.Sprite(PIXI.Texture.fromImage(propImage.src));
    prop.position.set(chartStage ? 72 : 704, chartStage ? 132 : 52);
    prop.width = chartStage ? 180 : 220;
    prop.height = chartStage ? 180 : 220;
    prop.interactive = true;
    prop.buttonMode = true;
    prop.on("click", () => onProp(stage));
    prop.on("tap", () => onProp(stage));
    scene.addChild(prop);
    const propLabel = addLabel(PIXI, scene, palette, "點選工具可移至對應控制", 700, 266, {
      size: palette.typeCaption,
      width: 225,
      align: "center",
    });
    if (chartStage) propLabel.position.set(52, 318);
  }

  const series = getLiveSeries(gameplay);
  if (["pumping", "data-preparation"].includes(stage) && series.length > 0) {
    const chart = drawScientificChart({
      PIXI,
      series,
      title: stage === "pumping" ? "即時降深曲線（合成）" : "保留資料與分析窗（合成）",
      xLabel: "抽水時間（分）",
      yLabel: "降深（m）",
      width: 590,
      height: 300,
    });
    chart.position.set(335, 72);
    scene.addChild(chart);
  }
  if (stage === "analysis" && gameplay.analysis.fit) {
    const chart = drawScientificChart({
      PIXI,
      series: [{
        points: gameplay.analysis.fit.residuals.map((point) => ({
          time: point.time,
          residual: point.residual,
        })),
      }],
      title: "擬合殘差（合成資料）",
      xLabel: "抽水時間（分）",
      yLabel: "殘差（m）",
      yField: "residual",
      width: 590,
      height: 300,
      logX: gameplay.analysis.method === "cooper-jacob",
    });
    chart.position.set(335, 72);
    scene.addChild(chart);
  }
  if (stage === "results") {
    resultBars = drawResultBars(PIXI, gameplay, palette);
    resultBars.panel.position.set(395, 70);
    scene.addChild(resultBars.panel);
  }

  const targets = getStageTargets(gameplay);
  const visualAudit = {
    stage,
    labels: [],
    targets: [],
    activeCrew: [],
  };
  targets.forEach((target) => {
    const valid = gameplay.selectedCrewId === target.role;
    const marker = new PIXI.Graphics();
    const radius = valid ? 25 : 20;
    marker.lineStyle(
      valid ? 5 : 3,
      valid ? palette.focus : target.complete ? palette.teal : palette.ink,
      1,
    );
    marker.beginFill(target.complete ? palette.mineral : palette.paperBright, 0.94);
    marker.drawCircle(0, 0, radius);
    marker.endFill();
    if (target.complete) {
      marker.moveTo(-8, 0);
      marker.lineTo(-2, 7);
      marker.lineTo(10, -8);
    }
    marker.position.set(target.x, target.y);
    marker.interactive = !target.complete;
    marker.buttonMode = !target.complete;
    marker.on("click", () => onTarget(target.id));
    marker.on("tap", () => onTarget(target.id));
    scene.addChild(marker);
    visualAudit.targets.push({
      id: target.id,
      x: target.x - radius,
      y: target.y - radius,
      width: radius * 2,
      height: radius * 2,
    });
    if (stage !== "construction") {
      addLabel(PIXI, scene, palette, `${target.label}${valid ? " · 可執行" : ""}`, target.x, target.y + 30, {
        anchor: 0.5,
        align: "center",
        width: 180,
        size: 13,
      });
    }
  });
  if (stage === "construction") {
    const cardWidth = 160;
    const cardHeight = 54;
    const cardY = 66;
    [...targets]
      .sort((first, second) => first.x - second.x || first.y - second.y)
      .forEach((target, index) => {
        const cardX = 36 + index * 177;
        const connector = new PIXI.Graphics();
        connector.lineStyle(2, palette.line, 0.9);
        connector.moveTo(target.x, target.y - 20);
        connector.lineTo(cardX + cardWidth / 2, cardY + cardHeight);
        scene.addChild(connector);
        const card = new PIXI.Graphics();
        card.beginFill(palette.paperBright, 0.94);
        card.lineStyle(2, palette.ink, 0.9);
        card.drawRoundedRect(cardX, cardY, cardWidth, cardHeight, 6);
        card.endFill();
        scene.addChild(card);
        addLabel(PIXI, scene, palette, target.label, cardX + 8, cardY + 8, {
          align: "center",
          size: 12,
          width: cardWidth - 16,
        });
        visualAudit.labels.push({
          id: target.id,
          x: cardX,
          y: cardY,
          width: cardWidth,
          height: cardHeight,
        });
      });
  }

  const homePoints = [
    { x: 42, y: 415 },
    { x: 152, y: 415 },
    { x: 262, y: 415 },
    { x: 372, y: 415 },
  ];
  const crewSprites = [];
  CREW.forEach((crew, index) => {
    const image = loadedAssets.get(`crew:${crew.id}`);
    const selected = gameplay.selectedCrewId === crew.id;
    const visualState = crewVisual.crewId === crew.id ? crewVisual.state : "idle";
    const isReaction = stage === "results" && visualState === "idle";
    const frameIndex = isReaction ? 3 : CREW_FRAME_BY_STATE[visualState];
    const person = new PIXI.Container();
    const sprite = image
      ? new PIXI.Sprite(crewTexture(PIXI, image, frameIndex))
      : new PIXI.Graphics();
    if (!image) {
      sprite.beginFill(palette.teal);
      sprite.drawCircle(45, 45, 42);
      sprite.endFill();
    }
    sprite.width = 92;
    sprite.height = 92;
    person.addChild(sprite);
    const worksAtTarget = ["task", "complete"].includes(visualState)
      && gameplay.animation?.crewId === crew.id;
    person.position.set(
      worksAtTarget ? gameplay.animation.x - 46 : homePoints[index].x,
      worksAtTarget ? gameplay.animation.y - 46 : homePoints[index].y,
    );
    person.interactive = true;
    person.buttonMode = true;
    person.on("click", () => onCrew(crew.id));
    person.on("tap", () => onCrew(crew.id));
    person.alpha = selected || visualState !== "idle" ? 1 : 0.9;
    scene.addChild(person);
    if (selected || visualState !== "idle") {
      const ring = new PIXI.Graphics();
      const borderColor = visualState === "error"
        ? palette.error
        : visualState === "complete"
          ? palette.success
          : palette.focusRing;
      ring.lineStyle(5, borderColor, 1);
      ring.drawRoundedRect(-4, -4, 100, 100, 8);
      person.addChild(ring);
    }
    if (visualState !== "idle") {
      const badge = new PIXI.Graphics();
      const badgeColor = visualState === "error" ? palette.error : palette.success;
      badge.beginFill(badgeColor, 0.96);
      badge.drawRoundedRect(-2, -28, 96, 25, 5);
      badge.endFill();
      person.addChild(badge);
      addLabel(PIXI, person, palette, CREW_CANVAS_LABELS[visualState], 46, -24, {
        anchor: 0.5,
        align: "center",
        width: 90,
        size: palette.typeCaption,
        fill: palette.paperBright,
      });
    }
    if (visualState === "complete" || visualState === "error") {
      const mark = new PIXI.Graphics();
      mark.lineStyle(6, visualState === "complete" ? palette.success : palette.error, 1);
      if (visualState === "complete") {
        mark.moveTo(68, 12);
        mark.lineTo(75, 20);
        mark.lineTo(88, 5);
      } else {
        mark.moveTo(70, 6);
        mark.lineTo(88, 24);
        mark.moveTo(88, 6);
        mark.lineTo(70, 24);
      }
      person.addChild(mark);
    }
    if (visualState !== "idle") {
      visualAudit.activeCrew.push({
        id: crew.id,
        x: person.x,
        y: person.y - 28,
        width: 100,
        height: 120,
      });
    }
    addLabel(PIXI, scene, palette, crew.label, homePoints[index].x + 46, 506, {
      anchor: 0.5,
      align: "center",
      width: 108,
      size: palette.typeCaption,
    });
    crewSprites.push({ crew, sprite: person, home: homePoints[index] });
  });

  if (gameplay.feedback.tone === "error" || gameplay.feedback.tone === "warning") {
    const alert = new PIXI.Graphics();
    alert.beginFill(gameplay.feedback.tone === "error" ? palette.error : palette.warning, 0.94);
    alert.drawRoundedRect(24, 64, 300, 58, 6);
    alert.endFill();
    scene.addChild(alert);
    addLabel(
      PIXI,
      scene,
      palette,
      gameplay.feedback.tone === "error" ? "操作未完成" : "模型警示",
      42,
      76,
      { size: palette.typeLabel, fill: palette.paperBright },
    );
  }

  application.stage.addChild(scene);
  application.renderer.render(application.stage);
  if (resultBars) {
    const bounds = (label) => {
      const { x, y, width, height } = label.getBounds();
      return { x, y, width, height };
    };
    visualAudit.resultScore = {
      total: bounds(resultBars.labels.total),
      parts: Object.fromEntries(
        ["K", "Ss"].map((key) => [key, bounds(resultBars.labels[key])]),
      ),
    };
  }
  let walkProgress = reducedMotion ? 1 : 0;
  const walking = crewSprites.find(({ crew }) => crew.id === gameplay.animation?.crewId);

  return {
    visualAudit,
    step(seconds) {
      if (!animateAssignment || !walking || walkProgress >= 1) return;
      walkProgress = Math.min(1, walkProgress + seconds * 1.8);
      const target = gameplay.animation;
      const eased = 1 - (1 - walkProgress) ** 3;
      walking.sprite.x = walking.home.x + (target.x - walking.home.x - 46) * eased;
      walking.sprite.y = walking.home.y + (target.y - walking.home.y - 46) * eased;
    },
    render() {
      application.renderer.render(application.stage);
    },
    dispose() {
      application.stage.removeChild(scene);
      scene.destroy({ children: true, texture: false, baseTexture: false });
    },
  };
}
