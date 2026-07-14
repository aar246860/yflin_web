import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const oldSite = process.env.YFLIN_OLD_SITE ?? path.resolve(root, "..", "yflin_web");
const sourcePath = path.join(oldSite, "js", "modules", "data.js");
const outDir = path.join(root, "src", "data");
const outPath = path.join(outDir, "publications.generated.json");
const memberPath = path.join(outDir, "members.generated.json");

function classifyPublication(pub) {
  const text = `${pub.title?.en ?? ""} ${pub.venue ?? ""}`.toLowerCase();
  const concepts = new Set();

  if (/lagging|delayed|temporally relaxed|dual-porosity|memory|response function/.test(text)) {
    concepts.add("transformation-uncertainty");
  }
  if (/thermal|heat|temperature|geothermal|borehole|trt|storage/.test(text)) {
    concepts.add("subsurface-energy");
  }
  if (/analytical|pumping|aquifer|slug|stream|boundary|wellbore|island|fault|skin|coastal/.test(text)) {
    concepts.add("well-hydraulics");
  }
  if (/black-box|forecast|signal|data-driven|inverse|neural|machine|spatiotemporal/.test(text)) {
    concepts.add("data-ai");
  }
  if (concepts.size === 0) {
    concepts.add("well-hydraulics");
  }
  return [...concepts];
}

function loadOldData() {
  const source = fs.readFileSync(sourcePath, "utf8")
    .replace("export const publicationsData =", "const publicationsData =")
    .replace("export const currentMembers =", "const currentMembers =")
    .replace("export const alumniMembers =", "const alumniMembers =");
  const sandbox = {};
  vm.runInNewContext(`${source}\nresult = { publicationsData, currentMembers, alumniMembers };`, sandbox);
  return sandbox.result;
}

function loadGeneratedData() {
  if (!fs.existsSync(outPath) || !fs.existsSync(memberPath)) {
    throw new Error(
      `Publication source missing. Expected old site data at ${sourcePath} or generated data at ${outPath} and ${memberPath}.`,
    );
  }

  const publicationsData = JSON.parse(fs.readFileSync(outPath, "utf8"));
  const members = JSON.parse(fs.readFileSync(memberPath, "utf8"));
  return {
    publicationsData,
    currentMembers: members.currentMembers ?? [],
    alumniMembers: members.alumniMembers ?? [],
  };
}

const sourceExists = fs.existsSync(sourcePath);
const data = sourceExists ? loadOldData() : loadGeneratedData();
const publications = data.publicationsData.map((pub, index) => ({
  ...pub,
  id: `${pub.year}-${String(pub.month ?? 1).padStart(2, "0")}-${index + 1}`,
  concepts: classifyPublication(pub),
}));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(publications, null, 2)}\n`, "utf8");
fs.writeFileSync(
  memberPath,
  `${JSON.stringify({ currentMembers: data.currentMembers, alumniMembers: data.alumniMembers }, null, 2)}\n`,
  "utf8",
);

console.log(`Imported ${publications.length} publications from ${sourceExists ? sourcePath : outPath}`);
