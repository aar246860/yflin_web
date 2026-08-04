import {
  existsSync,
  readFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stageOrder = [
  "proposal",
  "coalition",
  "evidence",
  "method",
  "review",
  "production",
  "publication",
];
const actionKinds = new Set([
  "project-proposed",
  "team-formed",
  "evidence-collected",
  "method-designed",
  "draft-authored",
  "peer-review-opened",
  "revision-made",
  "artifact-produced",
  "issue-published",
  "campaign-designed",
  "institution-mutated",
]);
const projectStatuses = new Set([
  "proposal",
  "active",
  "in-review",
  "production",
  "published",
  "archived",
]);
const memberStatuses = new Set(["invited", "active", "declined", "completed"]);
const stageStatuses = new Set(["pending", "next", "active", "completed", "blocked"]);
const deliverableStatuses = new Set(["planned", "in-progress", "review", "published"]);
const safeHref = (value) =>
  typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"));
const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isText = (value, length = 1) =>
  typeof value === "string" && value.trim().length >= length;

export function validateCollectiveState(state, { root = defaultRoot, arenaState } = {}) {
  const errors = [];
  const arena = arenaState ?? JSON.parse(
    readFileSync(resolve(root, "src", "data", "arenaState.json"), "utf8"),
  );
  const activeIds = new Set(
    arena.roster
      .filter((resident) => resident.status === "active")
      .map((resident) => resident.id),
  );

  if (state?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (state?.journal?.access !== "open") errors.push("journal.access must be open");
  if (!safeHref(state?.journal?.path)) errors.push("journal.path must be a safe internal path");
  if (!isText(state?.journal?.editorialPrinciple, 12)) {
    errors.push("journal.editorialPrinciple is missing or too short");
  }

  const entryIds = state?.journal?.publishedEntryIds ?? [];
  if (!Array.isArray(entryIds) || new Set(entryIds).size !== entryIds.length) {
    errors.push("journal.publishedEntryIds must be a unique array");
  } else {
    for (const entryId of entryIds) {
      const entryPath = resolve(root, "src", "content", "resident-journal", `${entryId}.md`);
      if (!existsSync(entryPath)) {
        errors.push(`published journal entry is missing: ${entryId}`);
      }
    }
  }

  const projects = Array.isArray(state?.projects) ? state.projects : [];
  const actions = Array.isArray(state?.actions) ? state.actions : [];
  const projectIds = new Set(projects.map((project) => project.id));
  if (projectIds.size !== projects.length) errors.push("project ids must be unique");

  for (const project of projects) {
    if (!isText(project.id, 4)) errors.push("project.id is missing");
    if (!/^\d{3}$/.test(project.issue ?? "")) {
      errors.push(`${project.id}.issue must use three digits`);
    }
    if (!projectStatuses.has(project.status)) {
      errors.push(`${project.id}.status is invalid`);
    }
    if (!isDate(project.createdOn)) errors.push(`${project.id}.createdOn must be YYYY-MM-DD`);
    if (!isText(project.question, 24)) errors.push(`${project.id}.question is missing or too short`);

    const initiators = Array.isArray(project.initiatorIds) ? project.initiatorIds : [];
    for (const id of initiators) {
      if (!activeIds.has(id)) errors.push(`${project.id}.initiatorIds contains inactive or unknown character ${id}`);
    }

    const members = Array.isArray(project.members) ? project.members : [];
    const memberIds = members.map((member) => member.characterId);
    if (new Set(memberIds).size !== memberIds.length) {
      errors.push(`${project.id}.members must contain unique characters`);
    }
    for (const member of members) {
      if (!activeIds.has(member.characterId)) {
        errors.push(`${project.id}.members contains inactive or unknown character ${member.characterId}`);
      }
      if (!memberStatuses.has(member.status)) {
        errors.push(`${project.id}.${member.characterId}.status is invalid`);
      }
      if (!isText(member.role, 4)) {
        errors.push(`${project.id}.${member.characterId}.role is missing`);
      }
    }

    const stages = Array.isArray(project.stages) ? project.stages : [];
    if (stages.length !== stageOrder.length || stages.some((stage, index) => stage.id !== stageOrder[index])) {
      errors.push(`${project.id}.stages must preserve the seven-stage editorial order`);
    }
    if (stages.some((stage) => !stageStatuses.has(stage.status))) {
      errors.push(`${project.id}.stages contains an invalid status`);
    }
    const nextStages = stages.filter((stage) => stage.status === "next");
    if (project.status !== "published" && nextStages.length !== 1) {
      errors.push(`${project.id}.stages must identify exactly one next stage before publication`);
    }
    const firstIncomplete = stages.findIndex((stage) => stage.status !== "completed");
    if (
      firstIncomplete >= 0 &&
      stages.slice(firstIncomplete + 1).some((stage) => stage.status === "completed")
    ) {
      errors.push(`${project.id}.stages cannot complete a later stage before an earlier stage`);
    }

    const deliverables = Array.isArray(project.deliverables) ? project.deliverables : [];
    const deliverableTypes = new Set(deliverables.map((deliverable) => deliverable.type));
    for (const required of ["research-note", "video", "audio", "copy", "review"]) {
      if (!deliverableTypes.has(required)) {
        errors.push(`${project.id}.deliverables is missing ${required}`);
      }
    }
    for (const deliverable of deliverables) {
      if (!deliverableStatuses.has(deliverable.status)) {
        errors.push(`${project.id}.${deliverable.type}.status is invalid`);
      }
      if (deliverable.status === "published" && !safeHref(deliverable.href)) {
        errors.push(`${project.id}.${deliverable.type} needs a safe href when published`);
      }
    }

    const ledger = Array.isArray(project.evidenceLedger) ? project.evidenceLedger : [];
    const ledgerIds = ledger.map((entry) => entry.id);
    if (ledger.length === 0 || new Set(ledgerIds).size !== ledgerIds.length) {
      errors.push(`${project.id}.evidenceLedger must contain unique source records`);
    }
    for (const source of ledger) {
      if (!safeHref(source.href)) errors.push(`${project.id}.${source.id}.href must be safe`);
      if (!isText(source.claim, 24)) errors.push(`${project.id}.${source.id}.claim is too short`);
      if (source.kind !== "public-fact") {
        errors.push(`${project.id}.${source.id}.kind must be public-fact`);
      }
    }

    if (!Array.isArray(project.claimBoundary) || project.claimBoundary.length < 3) {
      errors.push(`${project.id}.claimBoundary must contain at least three boundaries`);
    }
    for (const ownerId of project?.nextAction?.ownerIds ?? []) {
      if (!activeIds.has(ownerId)) {
        errors.push(`${project.id}.nextAction contains inactive or unknown owner ${ownerId}`);
      }
    }
  }

  const actionIds = actions.map((action) => action.id);
  const actionDates = actions.map((action) => action.date);
  if (new Set(actionIds).size !== actionIds.length) errors.push("collective action ids must be unique");
  if (new Set(actionDates).size !== actionDates.length) errors.push("collective actions must use unique Taipei dates");
  actions.forEach((action, index) => {
    const sequence = index + 1;
    if (action.id !== `collective-action-${String(sequence).padStart(3, "0")}`) {
      errors.push(`collective action ${sequence} has a noncanonical id`);
    }
    if (action.sequence !== sequence) errors.push(`collective action ${action.id} has a noncontiguous sequence`);
    if (!isDate(action.date)) errors.push(`collective action ${action.id} has an invalid date`);
    if (action.type !== "collective-action") errors.push(`${action.id}.type must be collective-action`);
    if (!actionKinds.has(action.actionKind)) errors.push(`${action.id}.actionKind is invalid`);
    if (!projectIds.has(action.projectId)) errors.push(`${action.id}.projectId is unknown`);
    if (!Array.isArray(action.characterIds) || action.characterIds.length === 0) {
      errors.push(`${action.id}.characterIds must not be empty`);
    }
    for (const id of action.characterIds ?? []) {
      if (!activeIds.has(id)) errors.push(`${action.id}.characterIds contains inactive or unknown character ${id}`);
    }
    if (!isText(action.line, 24)) errors.push(`${action.id}.line is missing or too short`);
  });

  const clock = state?.creativeClock ?? {};
  const latest = actions.at(-1);
  if (clock.turn !== actions.length) errors.push("creativeClock.turn must match collective action count");
  if (!Array.isArray(clock.completedDates) || new Set(clock.completedDates).size !== clock.completedDates.length) {
    errors.push("creativeClock.completedDates must contain unique dates");
  }
  if ((clock.completedDates ?? []).length !== actions.length) {
    errors.push("creativeClock.completedDates must match collective action count");
  }
  if (latest) {
    if (clock.lastActionId !== latest.id) errors.push("creativeClock.lastActionId must match latest action");
    if (clock.lastActionOn !== latest.date) errors.push("creativeClock.lastActionOn must match latest action");
    if (JSON.stringify(clock.lastActorIds) !== JSON.stringify(latest.characterIds)) {
      errors.push("creativeClock.lastActorIds must match latest action");
    }
  }

  return errors;
}

export function runCollectivePublisher(root = defaultRoot) {
  const statePath = resolve(root, "src", "data", "collectiveState.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  const errors = validateCollectiveState(state, { root });
  if (errors.length > 0) {
    const error = new Error(`Collective state validation failed:\n- ${errors.join("\n- ")}`);
    error.errors = errors;
    throw error;
  }
  return {
    status: "passed",
    actions: state.actions.length,
    projects: state.projects.length,
    publishedEntries: state.journal.publishedEntryIds.length,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(JSON.stringify(runCollectivePublisher(), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
