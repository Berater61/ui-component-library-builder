import type { LibraryCategory } from "./library";

export type ProjectBasics = {
  projectName: string;
  websiteGoal: string;
  audience: string;
  languages: string;
  preferredStack: string;
  designStyle: string;
  specialRequirements: string;
  interactions: string;
};

export type SelectedItem = {
  itemId: string;
  category: LibraryCategory;
  personalNotes: string;
  desiredAdjustments: string;
};

export type BuilderState = {
  basics: ProjectBasics;
  selectedItems: SelectedItem[];
  skippedCategories: LibraryCategory[];
  updatedAt: string;
};

export const emptyProjectBasics: ProjectBasics = {
  projectName: "",
  websiteGoal: "",
  audience: "",
  languages: "Deutsch",
  preferredStack: "Next.js, React, TypeScript, Tailwind CSS",
  designStyle: "",
  specialRequirements: "",
  interactions: ""
};

export const emptyBuilderState: BuilderState = {
  basics: emptyProjectBasics,
  selectedItems: [],
  skippedCategories: [],
  updatedAt: ""
};
