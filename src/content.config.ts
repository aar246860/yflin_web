import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const evidenceLevel = z.enum(["conceptual", "diagnostic", "supported", "limited"]);

const sharedSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  lang: z.enum(["en", "zh-TW"]),
  translationKey: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date(),
  concept: z.string(),
  tags: z.array(z.string()),
  evidenceLevel,
  sourceProjects: z.array(z.string()),
  relatedPublications: z.array(z.string()),
  audience: z.array(z.string()),
  collaborationRelevance: z.string(),
  summaryZh: z.string(),
  metaDescription: z.string().optional(),
  draft: z.boolean().default(false),
});

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/concepts" }),
  schema: sharedSchema.extend({
    order: z.number(),
    researchQuestion: z.string(),
    decisionUse: z.string(),
  }),
});

const fieldNotes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/field-notes" }),
  schema: sharedSchema.extend({
    noteType: z.enum(["essay", "method-note", "collaboration-brief"]),
  }),
});

const xiaolinEntryBase = z.object({
  title: z.string(),
  subtitle: z.string(),
  lang: z.enum(["en", "zh-TW"]),
  date: z.coerce.date(),
  updated: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()),
  sourceProjects: z.array(z.string()),
  relatedPublications: z.array(z.string()),
  summaryZh: z.string(),
  metaDescription: z.string().optional(),
  public: z.boolean().default(false),
  autoPublish: z.boolean().default(false),
  draft: z.boolean().default(true),
  artwork: z.string().optional(),
  artworkAlt: z.string().optional(),
  disclosure: z.string().optional(),
  fictionalized: z.boolean().default(false),
  roomTurn: z.number().int().positive().optional(),
  storyBeat: z
    .enum([
      "routine",
      "glitch",
      "memory",
      "boundary",
      "organism-hypothesis",
      "choice",
    ])
    .optional(),
  gameStrategy: z.enum(["observe", "predict", "risk"]).optional(),
  gameScore: z.number().int().nonnegative().optional(),
});

const creativeModes = [
  "philosophical-note",
  "sequential-comic",
  "leisure-outing",
  "visual-study",
  "absurd-comedy",
] as const;
const rivalActions = [
  "counter-reading",
  "constraint-shift",
  "form-break",
  "scale-reversal",
  "premise-stress-test",
] as const;

const xiaolinResidentEntry = xiaolinEntryBase.extend({
  resident: z.literal("xiaolin").default("xiaolin"),
  generated: z.boolean().default(false),
  format: z.enum(["diary", "doodle", "field-report"]).optional(),
  creativeMode: z.enum(creativeModes),
});

// The stored resident key is retained for the first rival entry's stable URL
// and validator compatibility. Public pages render this resident as Daye / 大野.
const dayeResidentEntry = xiaolinEntryBase.extend({
  resident: z.literal("counterclaw"),
  generated: z.literal(true),
  format: z.literal("field-report"),
  rivalAction: z.enum(rivalActions),
  targetEntry: z.string().min(1),
  tension: z.string().min(24),
  targetDetail: z.string().min(6),
  competingClaim: z.string().min(20),
  consequence: z.string().min(20),
}).strict();

const xiaolin = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/xiaolin" }),
  schema: z.union([dayeResidentEntry, xiaolinResidentEntry]),
});

const residentJournal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resident-journal" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    lang: z.enum(["en", "zh-TW"]),
    date: z.coerce.date(),
    updated: z.coerce.date(),
    issue: z.string().regex(/^\d{3}$/),
    articleType: z.enum([
      "editorial",
      "research-note",
      "open-lab-notebook",
      "review",
      "proposal-brief",
      "audio-essay",
      "film",
    ]),
    status: z.enum(["proposal", "in-review", "published"]),
    authors: z.array(z.string()).min(1),
    summaryZh: z.string(),
    sourceProjects: z.array(z.string()),
    relatedPublications: z.array(z.string()),
    public: z.boolean().default(false),
    draft: z.boolean().default(true),
    sources: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        claim: z.string(),
      }),
    ),
    claimBoundary: z.array(z.string()).min(1),
    artifacts: z
      .array(
        z.object({
          kind: z.enum(["text", "figure", "video", "audio", "copy", "notebook"]),
          status: z.enum(["planned", "in-progress", "published"]),
          label: z.string(),
          href: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    stage: z.string(),
    targetJournal: z.string().optional(),
    updated: z.coerce.date(),
    sourceProjects: z.array(z.string()),
    concepts: z.array(z.string()),
    evidenceLevel,
    claimBoundary: z.array(z.string()),
    collaborationRelevance: z.string(),
  }),
});

export const collections = {
  concepts,
  "field-notes": fieldNotes,
  xiaolin,
  "resident-journal": residentJournal,
  projects,
};
