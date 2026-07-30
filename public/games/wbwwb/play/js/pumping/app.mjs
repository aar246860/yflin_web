import { formatScientific } from "./charts.mjs";
import {
  STAGE_COPY,
  canTickPumping,
  createGameplay,
  getLiveSeries,
  getStageTargets,
  isLateTimeWindow,
  reduceGameplay,
} from "./gameplay.mjs";
import { getScenario } from "./scenarios.mjs";
import {
  createDisposerBag,
  createFixedStepClock,
  createPixiSurface,
  listen,
  loadAssets,
  loadImageAsset,
  readCanvasPalette,
  warmPixiTextures,
} from "./runtime.mjs";
import {
  CREW,
  drawGameplayScene,
  toPublicCaseLabel,
  toPublicStatusMessage,
} from "./ui.mjs";

const elements = {
  startPanel: document.querySelector("#start-panel"),
  gamePanel: document.querySelector("#game-panel"),
  start: document.querySelector("#start-game"),
  reset: document.querySelector("#reset-game"),
  briefingCase: document.querySelector("#briefing-case"),
  stage: document.querySelector("#pixi-stage"),
  fallback: document.querySelector("#canvas-fallback"),
  crew: document.querySelector("#crew-controls"),
  targets: document.querySelector("#target-controls"),
  tools: document.querySelector("#stage-controls"),
  summary: document.querySelector("#data-summary"),
  status: document.querySelector("#status-region"),
  note: document.querySelector("#field-note-copy"),
  stageStep: document.querySelector("#stage-step"),
  heading: document.querySelector("#game-heading"),
  instruction: document.querySelector("#stage-instruction"),
  hudMode: document.querySelector("#hud-mode"),
  hudStage: document.querySelector("#hud-stage"),
  hudBudget: document.querySelector("#hud-budget"),
  hudClock: document.querySelector("#hud-clock"),
  hudCase: document.querySelector("#hud-case"),
};

const MODE_LABELS = Object.freeze({
  guided: "引導模式",
  "expert-river": "專家模式 · 河流",
  "expert-barrier": "專家模式 · 阻水層",
});

const ASSETS = Object.freeze([
  { id: "stage:site-survey", url: "assets/pumping/stages/site-survey.png" },
  { id: "stage:construction", url: "assets/pumping/stages/drilling-setup.png" },
  { id: "stage:pumping", url: "assets/pumping/stages/pumping-setup.png" },
  {
    id: "stage:data-preparation",
    url: "assets/pumping/stages/drawdown-monitoring.png",
  },
  { id: "stage:analysis", url: "assets/pumping/stages/interpretation.png" },
  { id: "stage:results", url: "assets/pumping/stages/aquifer-reveal.png" },
  { id: "prop:site-survey", url: "assets/pumping/props/survey.png" },
  { id: "prop:construction", url: "assets/pumping/props/drilling-wells.png" },
  { id: "prop:pumping", url: "assets/pumping/props/pump-logger-generator.png" },
  {
    id: "prop:data-preparation",
    url: "assets/pumping/props/notebook-data-window.png",
  },
  {
    id: "prop:analysis",
    url: "assets/pumping/props/fitting-assumption-controls.png",
  },
  {
    id: "prop:results",
    url: "assets/pumping/props/aquifer-reveal-results.png",
  },
  ...CREW.map((crew) => ({
    id: `crew:${crew.id}`,
    url: `assets/pumping/crew/${crew.id}.png`,
  })),
]);

let activeRun = null;
let startCount = 0;
let responseCount = 0;

const selectedMode = () =>
  document.querySelector('input[name="mode"]:checked')?.value ?? "guided";

const create = (tag, options = {}) => {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.id) node.id = options.id;
  return node;
};

const CJK = /[\u3400-\u9fff]/u;

const createTextFragments = (className, fragments, keepTextPartsTogether = false) => {
  const node = create("span", { className });
  fragments.forEach((fragment) => {
    node.append(create("span", {
      className: CJK.test(fragment)
        ? "cjk-token"
        : keepTextPartsTogether ? "nonbreaking-token" : "text-token",
      text: fragment,
    }));
  });
  return node;
};

const createCjkTerm = (text) => create("span", { className: "cjk-term", text });

const makeButton = (label, action, options = {}) => {
  const button = create("button", {
    className: options.className ?? "control-button",
    text: label,
  });
  button.type = "button";
  button.disabled = Boolean(options.disabled);
  if (options.pressed !== undefined) {
    button.setAttribute("aria-pressed", String(options.pressed));
  }
  if (options.id) button.id = options.id;
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      button.dataset[key] = String(value);
    });
  }
  button.addEventListener("click", action);
  return button;
};

const announce = (message, tone = "info") => {
  responseCount += 1;
  elements.status.textContent = message;
  elements.status.dataset.tone = tone;
};

const CREW_VISUAL_LABELS = Object.freeze({
  idle: "待命",
  walking: "行進中",
  task: "作業中",
  complete: "已完成",
  error: "未完成",
});

const TARGET_LABEL_PARTS = Object.freeze({
  "抽水井 P-1": ["抽水井", " P-1"],
  "觀測井 O-1／記錄器": ["觀測井", " O-1／", "記錄器"],
  "觀測井 O-2／記錄器": ["觀測井", " O-2／", "記錄器"],
  "觀測井 O-3／記錄器": ["觀測井", " O-3／", "記錄器"],
  "近距觀測井候選點\n訊號可能較強": ["近距觀測井", "候選點", "訊號可能較強"],
});

const optionFieldset = ({
  legend,
  legendIsTerm = false,
  name,
  options,
  selected,
  disabled,
  onChange,
}) => {
  const fieldset = create("fieldset", { className: "choice-group" });
  const legendNode = create("legend");
  legendNode.append(legendIsTerm ? createCjkTerm(legend) : document.createTextNode(legend));
  fieldset.append(legendNode);
  options.forEach((option) => {
    const label = create("label", { className: "compact-choice" });
    const input = create("input");
    input.type = "radio";
    input.name = name;
    input.value = option.value;
    input.checked = option.value === selected;
    input.disabled = Boolean(disabled);
    input.addEventListener("change", () => onChange(option.value));
    label.append(input, createTextFragments(
      "compact-choice-copy",
      option.labelParts ?? [option.label],
      Boolean(option.keepTextPartsTogether),
    ));
    fieldset.append(label);
  });
  return fieldset;
};

const resultTable = (gameplay, scenario) => {
  const table = create("table", { className: "result-table" });
  const caption = create("caption", {
    text: "模型產生的參數真值與玩家估計值",
  });
  const head = create("thead");
  const headRow = create("tr");
  ["參數", "合成真值", "估計值", "單位"].forEach((label) =>
    headRow.append(create("th", { text: label })));
  head.append(headRow);
  const body = create("tbody");
  [
    ["導水係數 K", scenario.truth.K, gameplay.round.estimate.K, "m／day"],
    ["比儲水係數 Ss", scenario.truth.Ss, gameplay.round.estimate.Ss, "1／m"],
  ].forEach(([label, truth, estimate, unit]) => {
    const row = create("tr");
    [label, formatScientific(truth), formatScientific(estimate), unit].forEach((value) =>
      row.append(create("td", { text: value })));
    body.append(row);
  });
  table.append(caption, head, body);
  return table;
};

const scoreList = (gameplay) => {
  const score = gameplay.round.score;
  const list = create("ul", { className: "score-list" });
  [
    ["導水係數 K", "K", 30],
    ["比儲水係數 Ss", "Ss", 30],
    ["模型判斷", "modelJudgment", 15],
    ["資料充分性", "dataSufficiency", 15],
    ["預算管理", "budget", 10],
  ].forEach(([label, key, maximum]) => {
    const item = create("li");
    item.append(
      create("span", { text: label }),
      create("strong", { text: `${score.parts[key]}／${maximum}` }),
    );
    list.append(item);
  });
  return list;
};

const modelJudgmentExplanation = (gameplay) => (
  gameplay.round.score.diagnostics.modelJudgment.compatibility
    === "boundary-recognized-cj-approximation"
    ? "Cooper–Jacob 可估計晚期的有效參數，但未擬合河流／阻水邊界的鏡像井效應；因此模型判斷僅給部分分數。"
    : null
);

const scientificExplanation = (scenario) => {
  if (scenario.id === "expert-river") {
    return "河流可視為定水頭邊界。鏡像補注井會抵消河岸附近的降深；若忽略此訊號，模型判斷分數會下降。";
  }
  if (scenario.id === "expert-barrier") {
    return "阻水層是無流量邊界。鏡像抽水井會加強邊界一側的降深；正確邊界假設可避免把邊界效應誤判為低導水性。";
  }
  return "Theis 全曲線利用降深隨時間的擴散形狀估計導水係數與儲水係數；再以含水層厚度 b 換算 K＝T／b 與 Ss＝S／b。";
};

async function beginRun(mode) {
  activeRun?.dispose();
  const bag = createDisposerBag();
  const query = new URLSearchParams(location.search);
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const forcedReducedMotion = query.get("reducedMotion") === "1";
  let reducedMotion = forcedReducedMotion || media.matches;
  let gameplay = createGameplay(mode);
  let board = null;
  let surface = null;
  let clock = null;
  let simulationCarry = 0;
  let activeWellId = "OW-1";
  let renderedAnimationSequence = null;
  let crewVisual = { crewId: null, state: "idle" };
  let crewVisualTimer = null;
  let assetResult = { loaded: new Map(), failed: [] };
  let dispatch = () => {};
  const palette = readCanvasPalette();

  const run = {
    dispose() {
      board?.dispose();
      board = null;
      if (crewVisualTimer !== null) clearTimeout(crewVisualTimer);
      bag.dispose();
    },
    snapshot: () => ({
      gameplay,
      renderer: surface?.renderer ?? "dom",
      reducedMotion,
      visualAudit: board?.visualAudit ?? null,
      visualPalette: palette,
    }),
    dispatch(action) {
      dispatch(action);
    },
  };
  activeRun = run;
  startCount += 1;
  elements.startPanel.hidden = true;
  elements.gamePanel.hidden = false;
  elements.fallback.hidden = true;

  const runAssets = query.get("missingAsset") === "1"
    ? [...ASSETS, { id: "missing", url: "assets/pumping/missing.png" }]
    : ASSETS;
  assetResult = await loadAssets(runAssets, {
    load: loadImageAsset,
    timeoutMs: 4000,
  });
  if (activeRun !== run) return;
  await warmPixiTextures(window.PIXI, assetResult.loaded);
  if (activeRun !== run) return;

  try {
    surface = createPixiSurface({
      PIXI: window.PIXI,
      mount: elements.stage,
      palette,
      forceCanvas: query.get("renderer") === "canvas",
      forceWebglError: query.get("forceWebglError") === "1",
    });
    bag.add(() => surface.dispose());
    elements.stage.dataset.renderer = surface.renderer;
  } catch {
    elements.fallback.hidden = false;
    elements.stage.replaceChildren();
  }

  const setCrewVisual = (crewId, state) => {
    crewVisual = { crewId, state };
    render();
  };

  const startCrewVisualSequence = (crewId, accepted) => {
    if (crewVisualTimer !== null) clearTimeout(crewVisualTimer);
    const states = accepted
      ? [
        ...(reducedMotion ? [] : [{ state: "walking", duration: 650 }]),
        { state: "task", duration: 750 },
        { state: "complete", duration: 850 },
        { state: "idle", duration: 0 },
      ]
      : [
        { state: "error", duration: 900 },
        { state: "idle", duration: 0 },
      ];
    let index = 0;
    const advance = () => {
      const current = states[index];
      if (!current) return;
      setCrewVisual(crewId, current.state);
      index += 1;
      if (current.duration > 0) {
        crewVisualTimer = window.setTimeout(advance, current.duration);
      } else {
        crewVisualTimer = null;
      }
    };
    advance();
  };

  dispatch = (action, { quiet = false } = {}) => {
    const previous = gameplay;
    const actingCrewId = action.type === "activate-target"
      ? previous.selectedCrewId
      : null;
    gameplay = reduceGameplay(gameplay, action);
    if (!quiet || gameplay.feedback.tone !== "info") {
      announce(toPublicStatusMessage(gameplay.feedback), gameplay.feedback.tone);
    }
    if (action.type === "select-crew" && gameplay.feedback.code === "CREW_SELECTED") {
      if (crewVisualTimer !== null) clearTimeout(crewVisualTimer);
      crewVisualTimer = null;
      crewVisual = { crewId: gameplay.selectedCrewId, state: "idle" };
    }
    if (action.type === "activate-target" && actingCrewId) {
      startCrewVisualSequence(
        actingCrewId,
        gameplay.feedback.code === "ASSIGNMENT_ACCEPTED",
      );
      return;
    }
    if (
      action.type === "tick"
      && quiet
      && refreshPumpingReadout(getScenario(gameplay.round.scenarioId))
    ) {
      return;
    }
    if (gameplay !== previous) render();
  };

  const renderTargets = () => {
    elements.targets.replaceChildren();
    const targets = getStageTargets(gameplay);
    if (targets.length === 0) {
      elements.targets.append(create("p", {
        className: "muted-copy",
        text: "此階段使用左側科學工具；現地目標暫停操作。",
      }));
      return;
    }
    targets.forEach((target) => {
      const valid = gameplay.selectedCrewId === target.role;
      const crew = CREW.find((candidate) => candidate.id === target.role);
      const state = target.complete ? "｜已完成" : valid ? "｜可執行" : "";
      const button = makeButton(
        "",
        () => dispatch({ type: "activate-target", targetId: target.id }),
        {
          className: "target-button",
          disabled: target.complete,
          dataset: { valid, complete: target.complete },
        },
      );
      button.append(createTextFragments(
        "target-copy",
        [
          ...(TARGET_LABEL_PARTS[target.label] ?? [target.label]),
          "｜需要：",
          ...(crew?.labelParts ?? [crew?.label ?? ""]),
          state,
        ],
      ));
      elements.targets.append(button);
    });
  };

  const renderCrew = () => {
    elements.crew.replaceChildren();
    const hasTargets = getStageTargets(gameplay).length > 0;
    const activeCrew = CREW.find((crew) => crew.id === crewVisual.crewId);
    const liveLabel = crewVisual.state === "idle"
      ? activeCrew
        ? `${activeCrew.label}已回到待命狀態。`
        : "全體現地團隊待命。"
      : `${activeCrew?.label ?? "現地人員"}：${CREW_VISUAL_LABELS[crewVisual.state]}。`;
    const live = create("p", {
      className: "crew-state-live",
      text: liveLabel,
    });
    live.dataset.visualState = crewVisual.state;
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    elements.crew.append(live);
    CREW.forEach((crew) => {
      const selected = gameplay.selectedCrewId === crew.id;
      const visualState = crewVisual.crewId === crew.id ? crewVisual.state : "idle";
      const stateLabel = visualState === "idle"
        ? selected ? "已選取" : hasTargets ? "待命" : "檢視中"
        : CREW_VISUAL_LABELS[visualState];
      const button = makeButton(
        "",
        () => dispatch({ type: "select-crew", crewId: crew.id }),
        {
          className: "crew-button",
          pressed: selected,
          disabled: !hasTargets,
          dataset: { crewId: crew.id, visualState },
        },
      );
      button.append(
        createTextFragments("crew-name", crew.labelParts),
        createTextFragments("crew-state-label", ["狀態：", stateLabel]),
      );
      elements.crew.append(button);
    });
  };

  const renderSurveyTools = () => {
    const note = create("div", { className: "notebook-card" });
    note.append(
      create("strong", { text: "踏勘線索" }),
      create("p", {
        text: gameplay.round.scenarioId === "guided"
          ? "地形平緩、施工面完整；比較兩處候選地的空間與背景訊號。"
          : "邊界可能改變降深形狀；場址選擇會影響後續模型判讀。",
      }),
    );
    elements.tools.append(note);
  };

  const renderConstructionTools = (scenario) => {
    const counts = gameplay.round.wells.reduce(
      (result, well) => ({
        pumps: result.pumps + Number(well.kind === "pump"),
        observations: result.observations + Number(well.kind === "observation"),
      }),
      { pumps: 0, observations: 0 },
    );
    elements.tools.append(create("p", {
      text: `抽水井 ${counts.pumps}／1；觀測井 ${counts.observations}／3。井距至少 ${scenario.construction.minimumSpacing} m。`,
    }));
    elements.tools.append(create("p", {
      className: "cost-line",
      text: `抽水井 ${scenario.economy.pumpingWell.toLocaleString("zh-TW")} 點；每口觀測井 ${scenario.economy.observationWell.toLocaleString("zh-TW")} 點。`,
    }));
    elements.tools.append(makeButton(
      "完成建置，前往抽水",
      () => dispatch({ type: "advance" }),
      { id: "advance-construction", className: "primary-action" },
    ));
  };

  const renderPumpingTools = (scenario) => {
    elements.tools.append(optionFieldset({
      legend: "定流量 Q（m³／day）",
      name: "pumping-rate",
      options: scenario.allowedRates.map((rate) => ({
        value: String(rate),
        label: `${rate.toLocaleString("zh-TW")} m³／day`,
      })),
      selected: gameplay.chosenRate === null ? null : String(gameplay.chosenRate),
      disabled: gameplay.round.pump.started,
      onChange: (value) => dispatch({ type: "set-rate", rate: Number(value) }),
    }));
    const progress = create("div", { className: "record-progress" });
    const required = scenario.minimumUsableRecord;
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", String(required));
    progress.setAttribute(
      "aria-valuenow",
      String(Math.min(required, gameplay.round.pump.duration)),
    );
    progress.append(create("span", {
      text: gameplay.round.pump.started
        ? `記錄 ${gameplay.round.pump.duration} 分／最低 ${required} 分`
        : "選流量後，指派抽水操作員至控制台。",
    }));
    elements.tools.append(progress);
    elements.tools.append(makeButton(
      "停止抽水並保留記錄",
      () => dispatch({ type: "stop-pumping" }),
      {
        id: "stop-pumping",
        className: "primary-action",
        disabled:
          !gameplay.round.pump.started
          || gameplay.round.pump.duration < scenario.minimumUsableRecord,
      },
    ));
  };

  const refreshPumpingReadout = (scenario) => {
    if (gameplay.round.stage !== "pumping") return false;
    const required = scenario.minimumUsableRecord;
    elements.hudClock.textContent = `${gameplay.round.pump.duration} 分`;
    const progress = elements.tools.querySelector(".record-progress");
    if (progress) {
      progress.setAttribute(
        "aria-valuenow",
        String(Math.min(required, gameplay.round.pump.duration)),
      );
      const message = progress.querySelector("span");
      if (message) {
        message.textContent = `記錄 ${gameplay.round.pump.duration} 分／最低 ${required} 分`;
      }
    }
    const stop = elements.tools.querySelector("#stop-pumping");
    if (stop) {
      stop.disabled = gameplay.round.pump.duration < required;
    }
    return Boolean(progress && stop);
  };

  const renderDataTools = (scenario) => {
    const series = getLiveSeries(gameplay);
    const tabs = create("div", { className: "well-tabs" });
    tabs.setAttribute("role", "tablist");
    series.forEach((entry) => {
      const tab = makeButton(
        entry.wellId,
        () => {
          activeWellId = entry.wellId;
          render();
        },
        {
          className: "tab-button",
          pressed: activeWellId === entry.wellId,
          dataset: { wellId: entry.wellId },
        },
      );
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(activeWellId === entry.wellId));
      tabs.append(tab);
    });
    elements.tools.append(tabs);
    const active = series.find((entry) => entry.wellId === activeWellId) ?? series[0];
    if (active) {
      const panel = create("div", { className: "notebook-card" });
      panel.setAttribute("role", "tabpanel");
      const label = create("label", { className: "check-row" });
      const checkbox = create("input");
      checkbox.type = "checkbox";
      checkbox.checked = gameplay.data.retainedWellIds.includes(active.wellId);
      checkbox.addEventListener("change", () =>
        dispatch({ type: "toggle-series", wellId: active.wellId }));
      label.append(
        checkbox,
        create("span", {
          text: `保留 ${active.wellId}（${active.points.length} 點，降深單位 m）`,
        }),
      );
      panel.append(label);
      elements.tools.append(panel);
    }
    if (scenario.id !== "guided") {
      [
        ["套用基線修正", gameplay.data.baselineCorrected, "toggle-baseline"],
        ["標記並排除合成離群值", gameplay.data.outlierFlagged, "flag-outlier"],
      ].forEach(([labelText, checked, actionType]) => {
        const label = create("label", { className: "check-row" });
        const checkbox = create("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        checkbox.addEventListener("change", () => dispatch({ type: actionType }));
        label.append(
          checkbox,
          labelText === "套用基線修正" ? createCjkTerm(labelText) : create("span", { text: labelText }),
        );
        elements.tools.append(label);
      });
    } else {
      elements.tools.append(create("p", {
        className: "clean-data",
        text: "引導模式資料已清理：無基線漂移、無離群值。",
      }));
    }
    const rangeGrid = create("div", { className: "range-grid" });
    [
      ["分析窗起點（分）", "window-start", gameplay.data.window.start, 1,
        Math.max(1, gameplay.round.pump.duration - 1)],
      ["分析窗終點（分）", "window-end", gameplay.data.window.end, 2,
        gameplay.round.pump.duration],
    ].forEach(([labelText, id, value, min, max]) => {
      const label = create("label");
      label.append(create("span", { text: labelText }));
      const input = create("input", { id });
      input.type = "range";
      input.min = String(min);
      input.max = String(max);
      input.step = "1";
      input.value = String(value);
      input.addEventListener("change", () => {
        const start = id === "window-start"
          ? Number(input.value)
          : gameplay.data.window.start;
        const end = id === "window-end"
          ? Number(input.value)
          : gameplay.data.window.end;
        dispatch({ type: "set-window", start, end });
      });
      label.append(input, create("output", { text: String(value) }));
      rangeGrid.append(label);
    });
    elements.tools.append(rangeGrid);
    elements.tools.append(makeButton(
      "確認資料並進入分析",
      () => dispatch({ type: "confirm-data" }),
      { id: "confirm-data", className: "primary-action" },
    ));
  };

  const renderAnalysisTools = (scenario) => {
    elements.tools.append(optionFieldset({
      legend: "分析方法",
      name: "analysis-method",
      options: [
        {
          value: "theis",
          label: "Theis 全曲線擬合",
          labelParts: ["Theis ", "全曲線擬合"],
          keepTextPartsTogether: true,
        },
        {
          value: "cooper-jacob",
          label: "Cooper–Jacob 晚期直線",
          labelParts: ["Cooper–Jacob ", "晚期直線"],
          keepTextPartsTogether: true,
        },
      ],
      selected: gameplay.analysis.method,
      onChange: (method) => dispatch({ type: "set-method", method }),
    }));
    elements.tools.append(optionFieldset({
      legend: "含水層邊界假設",
      legendIsTerm: true,
      name: "boundary-assumption",
      options: [
        {
          value: "plain",
          label: "一般／無限含水層",
          labelParts: ["一般／", "無限含水層"],
        },
        {
          value: "river",
          label: "河流定水頭邊界",
          labelParts: ["河流", "定水頭邊界"],
        },
        {
          value: "barrier",
          label: "阻水無流量邊界",
          labelParts: ["阻水", "無流量邊界"],
        },
      ],
      selected: gameplay.analysis.assumption,
      onChange: (assumption) =>
        dispatch({ type: "set-assumption", assumption }),
    }));
    if (gameplay.analysis.method === "cooper-jacob") {
      const late = isLateTimeWindow(gameplay);
      const notice = create("p", {
        className: late ? "science-ok" : "science-warning",
        text: late
          ? "目前時間窗已達晚期近直線條件。"
          : "目前時間窗仍含早期資料，Cooper–Jacob 會拒絕擬合。",
      });
      elements.tools.append(notice);
      const adjust = makeButton(
        "把起點後移 1 分",
        () => dispatch({
          type: "set-window",
          start: Math.min(
            gameplay.data.window.end - 3,
            gameplay.data.window.start + 1,
          ),
          end: gameplay.data.window.end,
        }),
        { className: "quiet-action" },
      );
      elements.tools.append(adjust);
    }
    if (gameplay.analysis.warning) {
      elements.tools.append(create("p", {
        className: "science-warning",
        text: "邊界假設警示：仍可產生結果，但模型判斷分數會降低。",
      }));
    }
    elements.tools.append(makeButton(
      "執行確定性擬合",
      () => dispatch({ type: "run-analysis" }),
      { id: "run-analysis", className: "primary-action" },
    ));
    const fit = gameplay.analysis.fit;
    if (!fit) return;
    const metrics = create("dl", { className: "fit-metrics" });
    [
      ["T", `${formatScientific(fit.transmissivity)} m²／day`],
      ["S", formatScientific(fit.storativity)],
      ["RMSE", `${formatScientific(fit.rmse)} m`],
      ["殘差點數", String(fit.residuals.length)],
    ].forEach(([term, value]) => {
      const item = create("div");
      item.append(create("dt", { text: term }), create("dd", { text: value }));
      metrics.append(item);
    });
    elements.tools.append(metrics);
    const inputs = create("div", { className: "parameter-grid" });
    [
      ["導水係數 K（m／day）", "estimate-k", gameplay.analysis.estimate.K],
      ["比儲水係數 Ss（1／m）", "estimate-ss", gameplay.analysis.estimate.Ss],
    ].forEach(([labelText, id, value]) => {
      const label = create("label");
      label.append(create("span", { text: labelText }));
      const input = create("input", { id });
      input.type = "number";
      input.step = "any";
      input.min = "0";
      input.value = String(value);
      label.append(input);
      inputs.append(label);
    });
    elements.tools.append(inputs);
    elements.tools.append(makeButton(
      "確認參數調整",
      () => dispatch({
        type: "adjust-estimate",
        estimate: {
          K: Number(document.querySelector("#estimate-k")?.value),
          Ss: Number(document.querySelector("#estimate-ss")?.value),
        },
      }),
      { id: "confirm-estimate", className: "quiet-action" },
    ));
    elements.tools.append(makeButton(
      "提交 K／Ss 結果",
      () => dispatch({ type: "submit-analysis" }),
      { id: "submit-analysis", className: "primary-action" },
    ));
  };

  const renderResultsTools = (scenario) => {
    const compatibilityExplanation = modelJudgmentExplanation(gameplay);
    const headline = create("div", { className: "result-headline" });
    headline.append(
      create("strong", { text: `${gameplay.round.score.total}／100` }),
      create("span", { text: "本輪科學判讀總分" }),
    );
    elements.tools.append(
      headline,
      resultTable(gameplay, scenario),
      scoreList(gameplay),
      create("p", {
        className: "result-budget",
        text: `剩餘預算 ${gameplay.round.budgetRemaining.toLocaleString("zh-TW")} 點；抽水時間 ${gameplay.round.pump.duration} 分。`,
      }),
      create("p", {
        className: "scientific-explanation",
        text: scientificExplanation(scenario),
      }),
      ...(compatibilityExplanation ? [create("p", {
        className: "model-compatibility",
        text: compatibilityExplanation,
      })] : []),
      create("p", {
        className: "crew-reaction",
        text: gameplay.round.score.total >= 80
          ? "團隊反應：四位成員確認資料、模型與預算彼此一致。"
          : "團隊反應：四位成員指出邊界假設、資料窗或預算仍有改善空間。",
      }),
    );
    elements.tools.append(makeButton(
      gameplay.round.resultsReviewed ? "結果已閱讀" : "我已閱讀結果與科學解釋",
      () => dispatch({ type: "review-results" }),
      {
        id: "review-results",
        className: "quiet-action",
        disabled: gameplay.round.resultsReviewed,
      },
    ));
    const replay = create("div", { className: "replay-actions" });
    replay.append(
      makeButton(
        "重玩相同案例",
        () => dispatch({ type: "replay", seedMode: "same" }),
        {
          id: "replay-same",
          className: "primary-action",
          disabled: !gameplay.round.resultsReviewed,
        },
      ),
      makeButton(
        "重玩新案例",
        () => dispatch({ type: "replay", seedMode: "new" }),
        {
          id: "replay-new",
          className: "primary-action",
          disabled: !gameplay.round.resultsReviewed,
        },
      ),
    );
    elements.tools.append(replay);
  };

  const renderTools = () => {
    elements.tools.replaceChildren();
    elements.summary.replaceChildren();
    const scenario = getScenario(gameplay.round.scenarioId);
    switch (gameplay.round.stage) {
      case "site-survey": renderSurveyTools(); break;
      case "construction": renderConstructionTools(scenario); break;
      case "pumping": renderPumpingTools(scenario); break;
      case "data-preparation": renderDataTools(scenario); break;
      case "analysis": renderAnalysisTools(scenario); break;
      case "results": renderResultsTools(scenario); break;
      default: break;
    }
    if (["pumping", "data-preparation", "analysis"].includes(gameplay.round.stage)) {
      elements.summary.append(create("p", {
        text: `合成序列 ${getLiveSeries(gameplay).length} 組；時間單位：分；降深與殘差單位：m。`,
      }));
    }
  };

  const renderScene = () => {
    board?.dispose();
    if (!surface) return;
    const sequence = gameplay.animation?.sequence ?? null;
    const animateAssignment =
      sequence !== null
      && sequence !== renderedAnimationSequence
      && !reducedMotion
      && crewVisual.state === "walking";
    if (sequence !== null && sequence !== renderedAnimationSequence && reducedMotion) {
      renderedAnimationSequence = sequence;
    }
    board = drawGameplayScene({
      PIXI: window.PIXI,
      application: surface.application,
      loadedAssets: assetResult.loaded,
      gameplay,
      onCrew: (crewId) => dispatch({ type: "select-crew", crewId }),
      onTarget: (targetId) => dispatch({ type: "activate-target", targetId }),
      onProp: () => {
        elements.tools.tabIndex = -1;
        elements.tools.focus({ preventScroll: true });
        announce("已開啟目前階段的科學工具。");
      },
      reducedMotion,
      animateAssignment,
      crewVisual,
      palette,
    });
    if (animateAssignment) renderedAnimationSequence = sequence;
  };

  const render = () => {
    const copy = STAGE_COPY[gameplay.round.stage];
    elements.stageStep.textContent = copy.step;
    elements.heading.textContent = copy.title;
    elements.instruction.textContent = copy.instruction;
    elements.hudMode.textContent = MODE_LABELS[gameplay.round.scenarioId];
    elements.hudStage.textContent = copy.title;
    elements.hudBudget.textContent =
      `${gameplay.round.budgetRemaining.toLocaleString("zh-TW")} 點`;
    elements.hudClock.textContent = `${gameplay.round.pump.duration} 分`;
    elements.hudCase.textContent = toPublicCaseLabel(gameplay.round.scenarioId);
    elements.note.textContent = gameplay.analysis.warning
      ? "模型警示以文字與顏色共同標示；錯誤邊界不會阻止結果，但會降低模型判斷分數。"
      : "所有圖表皆為模型產生的合成資料；Q 為 m³／day，T 為 m²／day，K 為 m／day。";
    elements.gamePanel.dataset.stage = gameplay.round.stage;
    elements.gamePanel.dataset.reducedMotion = String(reducedMotion);
    renderCrew();
    renderTargets();
    renderTools();
    renderScene();
  };

  clock = createFixedStepClock({
    onStep: (seconds) => {
      board?.step(seconds);
      if (!canTickPumping(gameplay)) return;
      simulationCarry += seconds * 6;
      while (simulationCarry >= 1 && canTickPumping(gameplay)) {
        simulationCarry -= 1;
        dispatch({ type: "tick", duration: 1 }, { quiet: true });
      }
      if (!canTickPumping(gameplay)) simulationCarry = 0;
    },
    onRender: () => board?.render(),
  });
  bag.add(() => clock.dispose());
  clock.start();

  bag.add(listen(window, "keydown", (event) => {
    if (event.key !== "Escape") return;
    dispatch({ type: "cancel-crew" });
  }));
  bag.add(listen(media, "change", (event) => {
    if (forcedReducedMotion) return;
    reducedMotion = event.matches;
    render();
  }));

  render();
  if (assetResult.failed.length > 0) {
    announce(
      `${assetResult.failed.length} 個視覺素材無法載入；完整 DOM 控制仍可操作。`,
      "error",
    );
  } else {
    announce("現地場景已載入。請先選水文地質師，再選候選地。");
  }
}

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener("change", () => {
    elements.briefingCase.textContent = toPublicCaseLabel(selectedMode());
  });
});

elements.start.addEventListener("click", () => {
  beginRun(selectedMode()).catch((error) => {
    announce(`無法開始現地任務：${error.message}`, "error");
    elements.gamePanel.hidden = false;
    elements.fallback.hidden = false;
  });
});

elements.reset.addEventListener("click", () => {
  activeRun?.dispose();
  activeRun = null;
  elements.gamePanel.hidden = true;
  elements.startPanel.hidden = false;
  announce("任務已重設，請重新選擇模式。");
  elements.start.focus();
});

window.addEventListener("beforeunload", () => activeRun?.dispose(), { once: true });
window.__pumpingTest = {
  get startCount() { return startCount; },
  get responseCount() { return responseCount; },
  get snapshot() { return activeRun?.snapshot() ?? null; },
  get statusText() { return elements.status.textContent; },
  dispatch(action) { activeRun?.dispatch(action); },
  announceFeedback(feedback) {
    const tone = ["error", "warning", "success"].includes(feedback?.tone)
      ? feedback.tone
      : "info";
    announce(toPublicStatusMessage(feedback), tone);
  },
};
