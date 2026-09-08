import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const libraryPath = path.join(root, "data", "library-items.json");
const taxonomyPath = path.join(root, "config", "category-taxonomy.json");
const importRoots = process.argv.slice(2);

if (importRoots.length === 0) {
  console.error("Usage: node scripts/import-component-json.mjs <file-or-directory> [...]");
  process.exit(1);
}

const taxonomy = JSON.parse(readFileSync(taxonomyPath, "utf8"));
const validCategories = new Set(taxonomy.categories.map((category) => category.id));
const subcategoriesByCategory = new Map(
  taxonomy.categories.map((category) => [category.id, new Set(category.subcategories)])
);
const validContexts = new Set(taxonomy.contexts);
const validStyles = new Set(taxonomy.styles);
const items = JSON.parse(readFileSync(libraryPath, "utf8"));
const now = new Date().toISOString();
const results = [];

for (const importRoot of importRoots) {
  for (const filePath of collectComponentJsonFiles(path.resolve(root, importRoot))) {
    const component = JSON.parse(readFileSync(filePath, "utf8"));
    const normalized = normalizeComponent(component, filePath);
    const existingIndex = findExistingItemIndex(items, normalized);

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...normalized,
        createdAt: items[existingIndex].createdAt || normalized.createdAt,
        updatedAt: now
      };
      results.push({ action: "updated", id: normalized.id, file: path.relative(root, filePath) });
    } else {
      items.push(normalized);
      results.push({ action: "created", id: normalized.id, file: path.relative(root, filePath) });
    }
  }
}

writeFileSync(libraryPath, `${JSON.stringify(items, null, 2)}\n`);
console.table(results);

function collectComponentJsonFiles(targetPath) {
  const stats = statSync(targetPath);
  if (stats.isFile()) {
    return targetPath.endsWith(".component.json") ? [targetPath] : [];
  }

  return readdirSync(targetPath)
    .flatMap((entry) => collectComponentJsonFiles(path.join(targetPath, entry)))
    .filter((entry) => entry.endsWith(".component.json"));
}

function findExistingItemIndex(existingItems, candidate) {
  return existingItems.findIndex((item) => {
    const sameId = item.id === candidate.id;
    const sameSlug = item.slug === candidate.slug;
    const sameUrl = item.sourceUrl && candidate.sourceUrl && item.sourceUrl === candidate.sourceUrl;
    return sameId || sameSlug || sameUrl;
  });
}

function normalizeComponent(component, filePath) {
  const id = component.id || slugify(component.name);
  const slug = component.slug || slugify(component.name);
  const source = component.source || {};
  const code = component.code || {};
  const category = validCategories.has(component.category) ? component.category : "unsorted";
  const subcategory = component.subcategory || "unknown";
  const validSubcategories = subcategoriesByCategory.get(category) || new Set(["unknown"]);
  const contexts = (component.contexts || []).filter((context) => validContexts.has(context));
  const validComponentStyles = [];
  const styleTags = [];

  for (const style of component.styles || []) {
    if (validStyles.has(style)) {
      validComponentStyles.push(style);
    } else {
      styleTags.push(style);
    }
  }

  const reviewReasons = [];
  if (category === "unsorted" && component.category !== "unsorted") {
    reviewReasons.push(`Unknown category from import: ${component.category}`);
  }
  if (component.renderMode === "html" && !code.html) {
    reviewReasons.push("renderMode html is missing HTML code");
  }
  if (!validSubcategories.has(subcategory)) {
    reviewReasons.push(`Unknown subcategory for ${category}: ${subcategory}`);
  }
  if (styleTags.length > 0) {
    reviewReasons.push(`Unknown styles moved to tags: ${styleTags.join(", ")}`);
  }

  const renderMode = component.renderMode || inferRenderMode(component);
  const blockingReview =
    category === "unsorted" ||
    !validSubcategories.has(subcategory) ||
    (component.renderMode === "html" && !code.html);
  const status = blockingReview ? "needs-review" : component.status || "implemented";
  const tags = unique([...(component.tags || []), ...styleTags, "component-import"]);

  return {
    id,
    name: component.name,
    slug,
    itemType: component.itemType || "component",
    category,
    subcategory,
    contexts,
    styles: validComponentStyles,
    tags,
    status,
    previewType: toPreviewType(renderMode),
    renderMode,
    description: component.description || "",
    sourceUrl: source.url || "",
    sourceName: [source.name, source.author].filter(Boolean).join(" / ") || "Komponentenimport",
    license: source.license || "Nicht angegeben",
    responsive: true,
    dependencies: [],
    notes: component.notes || "",
    htmlCode: code.html || "",
    cssCode: code.css || "",
    javascriptCode: code.javascript || "",
    tsxCode: code.tsx || "",
    editableProps: component.editableProps || [],
    reviewReasons: reviewReasons.length > 0 ? reviewReasons : undefined,
    originalText: `Imported from ${path.relative(root, filePath)}`,
    createdAt: now,
    updatedAt: now
  };
}

function toPreviewType(renderMode) {
  if (renderMode === "external") {
    return "external-link";
  }
  if (["html", "react", "image", "placeholder"].includes(renderMode)) {
    return renderMode;
  }
  return "placeholder";
}

function inferRenderMode(component) {
  if (component.code?.html) {
    return "html";
  }
  if (component.source?.url) {
    return "external";
  }
  return "placeholder";
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}
