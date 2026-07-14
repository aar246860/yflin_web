export type ResearchNetworkNode = {
  readonly id: string;
  readonly groupName: string;
  readonly institution: string;
  readonly sharedTopics: readonly string[];
  readonly site: {
    readonly label: string;
    readonly href: string;
    readonly external: boolean;
  };
  readonly ownershipNote: string;
  readonly confirmation: "site owner" | "mutually confirmed";
};

export const researchNetwork: readonly ResearchNetworkNode[] = [
  {
    id: "lin-groundwater-hydraulics-group",
    groupName: "Lin Groundwater Hydraulics Group",
    institution: "Chung Yuan Christian University",
    sharedTopics: [
      "Aquifer-test interpretation",
      "Transformation uncertainty",
      "Groundwater-influenced subsurface energy",
    ],
    site: {
      label: "Current site",
      href: "/",
      external: false,
    },
    ownershipNote:
      "This node represents Ying-Fan Lin's own research website and the work presented here.",
    confirmation: "site owner",
  },
];

export const networkInvitation = {
  title: "External nodes are added by mutual confirmation.",
  body:
    "The registry does not infer a relationship from co-authorship, conference contact, institutional proximity, or a shared research topic. A group appears only after both sides have explicitly agreed to a public listing and confirmed the wording of the shared topic and ownership note.",
  contactLabel: "Discuss a confirmed connection",
  contactHref:
    "mailto:yflin1110@cycu.edu.tw?subject=Research%20Network%20confirmation",
} as const;
