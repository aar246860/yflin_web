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

const xiaolin = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/xiaolin" }),
  schema: z.object({
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
    generated: z.boolean().default(false),
    format: z.enum(["diary", "doodle", "field-report"]).optional(),
    artwork: z.string().optional(),
    artworkAlt: z.string().optional(),
    disclosure: z.string().optional(),
    fictionalized: z.boolean().default(false),
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
  projects,
};
