export const LOGICAL_WIDTH = 960;
export const LOGICAL_HEIGHT = 540;

const CANVAS_COLOR_TOKENS = Object.freeze([
  "--canvas-background",
  "--paper",
  "--paper-bright",
  "--mineral",
  "--ink",
  "--ink-soft",
  "--teal",
  "--status-success",
  "--status-warning",
  "--status-error",
  "--focus-ring",
  "--line",
]);

const CANVAS_TYPE_TOKENS = Object.freeze([
  "--type-caption",
  "--type-label",
  "--type-body",
  "--type-title",
]);

const colorFromCssToken = (styles, token) => {
  const value = styles.getPropertyValue(token).trim();
  if (!/^#[\da-f]{6}$/iu.test(value)) {
    throw new TypeError(`Canvas token ${token} must be a six-digit CSS color`);
  }
  return Number.parseInt(value.slice(1), 16);
};

const typeFromCssToken = (root, token) => {
  const probe = root.ownerDocument.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;font-size:var(${token});`;
  root.ownerDocument.body.append(probe);
  const value = Number.parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  if (!(value > 0)) throw new TypeError(`Canvas token ${token} must resolve to a positive length`);
  return value;
};

export function readCanvasPalette(root = document.documentElement) {
  const styles = getComputedStyle(root);
  const colors = Object.fromEntries(
    CANVAS_COLOR_TOKENS.map((token) => [token.slice(2), colorFromCssToken(styles, token)]),
  );
  const type = Object.fromEntries(
    CANVAS_TYPE_TOKENS.map((token) => [token.slice(7), typeFromCssToken(root, token)]),
  );
  const fontFamily = styles.getPropertyValue("--font-sans").trim();
  if (!fontFamily) throw new TypeError("Canvas token --font-sans is required");
  return Object.freeze({
    background: colors["canvas-background"],
    paper: colors.paper,
    paperBright: colors["paper-bright"],
    mineral: colors.mineral,
    ink: colors.ink,
    inkSoft: colors["ink-soft"],
    teal: colors.teal,
    success: colors["status-success"],
    warning: colors["status-warning"],
    error: colors["status-error"],
    focusRing: colors["focus-ring"],
    line: colors.line,
    fontFamily,
    typeCaption: type.caption,
    typeLabel: type.label,
    typeBody: type.body,
    typeTitle: type.title,
  });
}

export function createDisposerBag() {
  const disposers = new Set();
  let disposed = false;

  return {
    add(disposer) {
      if (typeof disposer !== "function") {
        throw new TypeError("Disposer must be a function");
      }
      if (disposed) {
        disposer();
        return disposer;
      }
      disposers.add(disposer);
      return disposer;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const disposer of [...disposers].reverse()) {
        try {
          disposer();
        } finally {
          disposers.delete(disposer);
        }
      }
    },
    get size() {
      return disposers.size;
    },
  };
}

export function listen(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

export function createFixedStepAccumulator({
  stepMs = 1000 / 60,
  maximumSteps = 5,
  onStep,
}) {
  if (!(stepMs > 0) || !(maximumSteps > 0) || typeof onStep !== "function") {
    throw new TypeError("A positive step, maximum, and onStep callback are required");
  }
  let carry = 0;

  return {
    advance(deltaMs) {
      carry += Math.min(Math.max(deltaMs, 0), stepMs * maximumSteps);
      let steps = 0;
      while (carry >= stepMs && steps < maximumSteps) {
        onStep(stepMs / 1000);
        carry -= stepMs;
        steps += 1;
      }
      return steps;
    },
    reset() {
      carry = 0;
    },
  };
}

export function createFixedStepClock({
  onStep,
  onRender = () => {},
  stepMs = 1000 / 60,
  requestFrame = requestAnimationFrame,
  cancelFrame = cancelAnimationFrame,
  now = performance.now.bind(performance),
}) {
  const accumulator = createFixedStepAccumulator({ stepMs, onStep });
  let frameId = null;
  let previous = 0;

  const frame = (timestamp) => {
    if (frameId === null) return;
    accumulator.advance(timestamp - previous);
    previous = timestamp;
    onRender();
    frameId = requestFrame(frame);
  };

  return {
    start() {
      if (frameId !== null) return;
      previous = now();
      frameId = requestFrame(frame);
    },
    stop() {
      if (frameId === null) return;
      cancelFrame(frameId);
      frameId = null;
      accumulator.reset();
    },
    get running() {
      return frameId !== null;
    },
    dispose() {
      this.stop();
    },
  };
}

function withTimeout(promise, timeoutMs, label) {
  let timerId;
  const timeout = new Promise((_, reject) => {
    timerId = setTimeout(
      () => reject(new Error(`Asset timed out: ${label}`)),
      timeoutMs,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId));
}

export async function loadAssets(
  assets,
  { load, timeoutMs = 8000 } = {},
) {
  if (!Array.isArray(assets)) throw new TypeError("Assets must be an array");
  if (assets.length === 0) return { loaded: new Map(), failed: [] };
  if (typeof load !== "function") throw new TypeError("Asset loader is required");

  const settled = await Promise.allSettled(
    assets.map((asset) => withTimeout(
      Promise.resolve().then(() => load(asset)),
      timeoutMs,
      asset.id,
    )),
  );
  const loaded = new Map();
  const failed = [];

  settled.forEach((result, index) => {
    const asset = assets[index];
    if (result.status === "fulfilled") {
      loaded.set(asset.id, result.value);
    } else {
      failed.push({ asset, error: result.reason });
    }
  });
  return { loaded, failed };
}

export function loadImageAsset(asset) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${asset.url}`));
    image.src = asset.url;
  });
}

export async function warmPixiTextures(
  PIXI,
  loadedAssets,
  { timeoutMs = 4000 } = {},
) {
  if (!PIXI?.Texture?.fromImage || !(loadedAssets instanceof Map)) return [];
  const textures = [...loadedAssets.values()]
    .filter((image) => typeof image?.src === "string")
    .map((image) => PIXI.Texture.fromImage(image.src));
  await Promise.all(textures.map(async (texture, index) => {
    const baseTexture = texture?.baseTexture;
    if (!baseTexture || baseTexture.hasLoaded || baseTexture.valid) return;
    await withTimeout(new Promise((resolve) => {
      baseTexture.once("loaded", resolve);
      baseTexture.once("error", resolve);
    }), timeoutMs, `pixi-texture-${index}`).catch(() => {});
  }));
  return textures;
}

export function createPixiSurface({
  PIXI,
  mount,
  palette,
  forceCanvas = false,
  forceWebglError = false,
}) {
  if (!PIXI || !mount || !Number.isInteger(palette?.background)) {
    throw new Error("Pixi, a mount element, and a CSS-derived palette are required");
  }
  const attempts = forceCanvas ? [true] : [false, true];
  const errors = [];

  for (const canvasMode of attempts) {
    try {
      if (forceWebglError && !canvasMode) throw new Error("Forced WebGL failure");
      const Renderer = canvasMode ? PIXI.CanvasRenderer : PIXI.WebGLRenderer;
      const renderer = new Renderer(
        LOGICAL_WIDTH,
        LOGICAL_HEIGHT,
        { antialias: true, backgroundColor: palette.background, resolution: 1 },
      );
      const application = {
        renderer,
        stage: new PIXI.Container(),
        view: renderer.view,
        destroy(removeView) {
          this.stage.destroy({ children: true });
          this.renderer.destroy(removeView);
        },
      };
      application.view.setAttribute("role", "img");
      application.view.setAttribute(
        "aria-label",
        "抽水試驗現地作業與合成資料視覺場景",
      );
      mount.replaceChildren(application.view);
      return {
        application,
        renderer: canvasMode ? "canvas" : "webgl",
        errors,
        dispose() {
          application.destroy(true);
          mount.replaceChildren();
        },
      };
    } catch (error) {
      errors.push(error);
    }
  }
  throw new AggregateError(errors, "Pixi renderers were unavailable");
}
