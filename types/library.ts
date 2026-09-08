export const libraryItemTypes = [
  "foundation",
  "pattern",
  "component",
  "section",
  "page",
  "reference",
] as const;

export type LibraryItemType = (typeof libraryItemTypes)[number];

export const libraryCategories = [
  "foundations-and-design",
  "layout-and-structure",
  "navigation",
  "buttons-and-actions",
  "inputs-and-selection",
  "content-and-data-display",
  "feedback-and-status",
  "marketing-and-communication",
  "forms",
  "ecommerce",
  "page-sections",
  "complete-pages",
  "unsorted",
] as const;

export type LibraryCategory = (typeof libraryCategories)[number];

export const libraryContexts = [
  "application",
  "marketing",
  "ecommerce",
  "portfolio",
  "dashboard",
  "blog",
  "gaming",
  "artistic",
  "corporate",
] as const;

export type LibraryContext = (typeof libraryContexts)[number];

export const libraryStyles = [
  "minimal",
  "modern",
  "futuristic",
  "neobrutalism",
  "glassmorphism",
  "skeuomorphism",
  "retro",
  "playful",
  "corporate",
  "artistic",
  "technical",
  "mystical",
  "dark",
  "light",
] as const;

export type LibraryStyle = (typeof libraryStyles)[number];

export type LibraryStatus =
  | "reference"
  | "needs-code"
  | "needs-review"
  | "needs-implementation"
  | "implemented"
  | "deleted"
  | "deprecated";

export type PreviewType =
  | "image"
  | "html"
  | "react"
  | "external-link"
  | "placeholder";

export type RenderMode =
  | "image"
  | "html"
  | "react"
  | "external"
  | "placeholder";

export type DuplicateSignalType =
  | "source-url"
  | "name"
  | "html"
  | "screenshot-hash"
  | "description";

export type DuplicateSignal = {
  type: DuplicateSignalType;
  confidence: "exact" | "probable";
  matchedItemId: string;
  note?: string;
};

export type EditablePropType =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "color"
  | "number"
  | "boolean"
  | "select";

export type EditableProp = {
  name: string;
  label: string;
  type: EditablePropType;
  required?: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
};

export type LibraryItem = {
  id: string;
  name: string;
  slug: string;
  itemType: LibraryItemType;
  category: LibraryCategory;
  subcategory: string;
  contexts: LibraryContext[];
  styles: LibraryStyle[];
  tags: string[];
  status: LibraryStatus;
  previewType: PreviewType;
  renderMode?: RenderMode;
  description: string;
  sourceUrl?: string;
  sourceName?: string;
  license?: string;
  responsive?: boolean;
  dependencies: string[];
  notes?: string;
  htmlCode?: string;
  cssCode?: string;
  javascriptCode?: string;
  tsxCode?: string;
  originalText?: string;
  inferredCategory?: LibraryCategory;
  reviewReasons?: string[];
  duplicateOf?: string;
  duplicateSignals?: DuplicateSignal[];
  editableProps?: EditableProp[];
  createdAt: string;
  updatedAt: string;
};

export type CategorySelectionMode = "single" | "multi";

export type CategoryConfig = {
  id: LibraryCategory;
  name: string;
  enabled: boolean;
  order: number;
  selectionMode: CategorySelectionMode;
  required: boolean;
  subcategories: string[];
};
