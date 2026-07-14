import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "public", "animations");
const animationId = "decision-chain";
const zipMtime = new Date("2026-01-01T00:00:00Z");

const colors = {
  teal: [0.0, 0.47, 0.45, 1],
  field: [0.13, 0.31, 0.46, 1],
  brick: [0.71, 0.2, 0.14, 1],
  gold: [0.67, 0.42, 0.07, 1],
  ink: [0.08, 0.08, 0.07, 1],
};

function keyframes(values) {
  return values.map(([t, s], index) => ({
    t,
    s: Array.isArray(s) ? s : [s],
    e: Array.isArray(values[index + 1]?.[1]) ? values[index + 1]?.[1] : [values[index + 1]?.[1] ?? s],
    i: { x: [0.42], y: [1] },
    o: { x: [0.58], y: [0] },
  }));
}

function layerBase(name, index, transform = {}) {
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: transform.o ?? { a: 0, k: 100 },
      r: transform.r ?? { a: 0, k: 0 },
      p: transform.p ?? { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: transform.s ?? { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    ip: 0,
    op: 150,
    st: 0,
    bm: 0,
  };
}

function circleLayer({ name, index, x, y, color, pulseAt }) {
  return {
    ...layerBase(name, index, {
      p: { a: 0, k: [x, y, 0] },
      s: {
        a: 1,
        k: keyframes([
          [0, [92, 92, 100]],
          [pulseAt, [92, 92, 100]],
          [pulseAt + 12, [118, 118, 100]],
          [pulseAt + 30, [100, 100, 100]],
          [150, [92, 92, 100]],
        ]),
      },
    }),
    shapes: [
      {
        ty: "el",
        nm: `${name} node`,
        d: 1,
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [66, 66] },
      },
      {
        ty: "st",
        nm: `${name} stroke`,
        c: { a: 0, k: color },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 6 },
        lc: 2,
        lj: 2,
        ml: 4,
      },
      {
        ty: "fl",
        nm: `${name} fill`,
        c: { a: 0, k: color },
        o: { a: 0, k: 18 },
        r: 1,
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
        sk: { a: 0, k: 0 },
        sa: { a: 0, k: 0 },
      },
    ],
  };
}

function lineLayer({ name, index, x1, y1, x2, y2, color, revealAt }) {
  return {
    ...layerBase(name, index),
    shapes: [
      {
        ty: "sh",
        nm: `${name} path`,
        ks: {
          a: 0,
          k: {
            i: [
              [0, 0],
              [0, 0],
            ],
            o: [
              [0, 0],
              [0, 0],
            ],
            v: [
              [x1, y1],
              [x2, y2],
            ],
            c: false,
          },
        },
      },
      {
        ty: "tm",
        nm: `${name} trim`,
        s: { a: 0, k: 0 },
        e: {
          a: 1,
          k: keyframes([
            [0, 0],
            [revealAt, 0],
            [revealAt + 30, 100],
            [150, 100],
          ]),
        },
        o: { a: 0, k: 0 },
        m: 1,
      },
      {
        ty: "st",
        nm: `${name} stroke`,
        c: { a: 0, k: color },
        o: { a: 0, k: 84 },
        w: { a: 0, k: 5 },
        lc: 2,
        lj: 2,
        ml: 4,
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
        sk: { a: 0, k: 0 },
        sa: { a: 0, k: 0 },
      },
    ],
  };
}

function pulseLayer() {
  return {
    ...layerBase("decision transfer pulse", 7, {
      p: {
        a: 1,
        k: [
          { t: 0, s: [110, 110, 0], e: [250, 110, 0], i: { x: [0.45], y: [1] }, o: { x: [0.55], y: [0] } },
          { t: 42, s: [250, 110, 0], e: [390, 110, 0], i: { x: [0.45], y: [1] }, o: { x: [0.55], y: [0] } },
          { t: 88, s: [390, 110, 0], e: [110, 110, 0], i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } },
          { t: 150, s: [110, 110, 0] },
        ],
      },
      o: {
        a: 1,
        k: keyframes([
          [0, 0],
          [12, 100],
          [118, 100],
          [146, 0],
          [150, 0],
        ]),
      },
    }),
    shapes: [
      {
        ty: "el",
        nm: "pulse dot",
        d: 1,
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [18, 18] },
      },
      {
        ty: "fl",
        nm: "pulse fill",
        c: { a: 0, k: colors.ink },
        o: { a: 0, k: 92 },
        r: 1,
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
        sk: { a: 0, k: 0 },
        sa: { a: 0, k: 0 },
      },
    ],
  };
}

function buildAnimation() {
  return {
    v: "5.12.2",
    fr: 30,
    ip: 0,
    op: 150,
    w: 500,
    h: 220,
    nm: "Decision chain micro motion",
    ddd: 0,
    assets: [],
    markers: [
      { tm: 0, cm: "record", dr: 40 },
      { tm: 48, cm: "model", dr: 40 },
      { tm: 96, cm: "decision", dr: 40 },
    ],
    layers: [
      lineLayer({ name: "record to model", index: 1, x1: 143, y1: 110, x2: 217, y2: 110, color: colors.teal, revealAt: 24 }),
      lineLayer({ name: "model to decision", index: 2, x1: 283, y1: 110, x2: 357, y2: 110, color: colors.brick, revealAt: 72 }),
      circleLayer({ name: "measured response", index: 3, x: 110, y: 110, color: colors.teal, pulseAt: 10 }),
      circleLayer({ name: "interpretation model", index: 4, x: 250, y: 110, color: colors.field, pulseAt: 54 }),
      circleLayer({ name: "decision transfer", index: 5, x: 390, y: 110, color: colors.brick, pulseAt: 98 }),
      pulseLayer(),
    ],
  };
}

function buildManifest() {
  return {
    version: "1",
    generator: "yflin_web_astro scripts/generate_motion_assets.mjs",
    author: "Ying-Fan Lin",
    description: "Small UI motion for the aquifer-test interpretation decision chain.",
    keywords: "groundwater, aquifer-test, transformation uncertainty, decision chain",
    revision: 1,
    activeAnimationId: animationId,
    animations: [
      {
        id: animationId,
        autoplay: true,
        loop: true,
        speed: 1,
        direction: 1,
        playMode: "normal",
        themeColor: "#f7f2e8",
      },
    ],
    custom: {
      claimBoundary: "UI micro motion only; not a calibrated aquifer simulation.",
    },
  };
}

await mkdir(outDir, { recursive: true });

const animation = JSON.stringify(buildAnimation());
const manifest = JSON.stringify(buildManifest(), null, 2);
const files = {
  "manifest.json": [strToU8(manifest), { mtime: zipMtime, level: 9 }],
  [`animations/${animationId}.json`]: [strToU8(animation), { mtime: zipMtime, level: 9 }],
};
const archive = zipSync(files, { level: 9, mtime: zipMtime });

await writeFile(join(outDir, `${animationId}.json`), `${JSON.stringify(buildAnimation(), null, 2)}\n`);
await writeFile(join(outDir, `${animationId}.lottie`), archive);

console.log(`Generated animations/${animationId}.json and animations/${animationId}.lottie`);
