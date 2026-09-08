import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const items = JSON.parse(readFileSync(new URL("../data/library-items.json", import.meta.url), "utf8"));
const taxonomy = JSON.parse(readFileSync(new URL("../config/category-taxonomy.json", import.meta.url), "utf8"));
const libraryFiltersSource = readFileSync(new URL("../components/LibraryFilters.tsx", import.meta.url), "utf8");
const customSelectSource = readFileSync(new URL("../components/ui/CustomSelect.tsx", import.meta.url), "utf8");

function filterByCategory(category) {
  return items.filter((item) => item.category === category);
}

function searchLibrary(query, category = "all") {
  const normalized = query.trim().toLocaleLowerCase("de-DE");
  return items.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const haystack = [item.name, item.description, item.subcategory, item.tags.join(" ")]
      .join(" ")
      .toLocaleLowerCase("de-DE");
    return matchesCategory && (normalized.length === 0 || haystack.includes(normalized));
  });
}

function selectItem(state, item, categoryConfig) {
  const withoutCategory =
    categoryConfig.selectionMode === "single"
      ? state.selectedItems.filter((selection) => selection.category !== categoryConfig.id)
      : state.selectedItems;
  return {
    ...state,
    selectedItems: [
      ...withoutCategory.filter((selection) => selection.itemId !== item.id),
      {
        itemId: item.id,
        category: item.category,
        personalNotes: item.notes || "",
        desiredAdjustments: ""
      }
    ],
    skippedCategories: state.skippedCategories.filter((category) => category !== categoryConfig.id)
  };
}

function skipCategory(state, category) {
  return {
    ...state,
    selectedItems: state.selectedItems.filter((selection) => selection.category !== category),
    skippedCategories: state.skippedCategories.includes(category)
      ? state.skippedCategories
      : [...state.skippedCategories, category]
  };
}

function restoreState(raw) {
  const fallback = { basics: { projectName: "" }, selectedItems: [], skippedCategories: [] };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      selectedItems: Array.isArray(parsed.selectedItems) ? parsed.selectedItems : [],
      skippedCategories: Array.isArray(parsed.skippedCategories) ? parsed.skippedCategories : []
    };
  } catch {
    return fallback;
  }
}

function generateMarkdown(state) {
  const selected = state.selectedItems
    .map((selection) => items.find((item) => item.id === selection.itemId))
    .filter(Boolean);
  return `# WEBSITE-BRIEF: ${state.basics.projectName || "Neues Website-Projekt"}\n\n## Vollstaendige Auswahl\n\n${selected
    .map((item) => `### ${item.name}\n\n- Kategorie: ${item.category}\n- Unterkategorie: ${item.subcategory}\n- Quellen-URL: ${item.sourceUrl || "keine externe Quelle"}\n- Beschreibung: ${item.description}\n- Status: ${item.status}`)
    .join("\n\n")}`;
}

function generateJson(state) {
  return JSON.stringify(
    {
      version: 1,
      basics: state.basics,
      skippedCategories: state.skippedCategories,
      selectedItems: state.selectedItems.map((selection) => ({
        selection,
        item: items.find((item) => item.id === selection.itemId)
      }))
    },
    null,
    2
  );
}

test("loads library data", () => {
  assert.ok(items.length >= 7);
  assert.ok(items.every((item) => item.id && item.name && item.category));
});

test("keeps catalog identifiers unique and implemented previews complete", () => {
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  assert.equal(new Set(items.map((item) => item.slug)).size, items.length);
  assert.ok(items.every((item) => item.status !== "implemented" || (item.htmlCode && item.cssCode)));
});

test("retains source and MIT license metadata for Uiverse entries", () => {
  const importedItems = items.filter((item) => item.sourceName?.startsWith("Uiverse /"));
  assert.ok(importedItems.length > 0);
  assert.ok(importedItems.every((item) => item.sourceUrl?.startsWith("https://uiverse.io/")));
  assert.ok(importedItems.every((item) => item.license?.startsWith("MIT")));
});

test("filters by category", () => {
  const backgrounds = filterByCategory("foundations-and-design");
  assert.ok(backgrounds.length >= 2);
});

test("searches by tag and category", () => {
  const result = searchLibrary("toggle", "inputs-and-selection");
  assert.ok(result.length >= 2);
});

test("builder categories come from taxonomy", () => {
  const categoriesWithItems = taxonomy.categories.filter((category) =>
    items.some((item) => item.category === category.id)
  );
  assert.ok(categoriesWithItems.length >= 3);
  assert.ok(categoriesWithItems.some((category) => category.id === "navigation"));
});

test("single selection replaces previous item in same category", () => {
  const navigation = taxonomy.categories.find((category) => category.id === "navigation");
  const navItems = filterByCategory("navigation");
  let state = { basics: {}, selectedItems: [], skippedCategories: [] };
  state = selectItem(state, navItems[0], navigation);
  state = selectItem(state, navItems[1], navigation);
  assert.equal(state.selectedItems.filter((item) => item.category === "navigation").length, 1);
});

test("multi selection keeps multiple items in same category", () => {
  const foundations = taxonomy.categories.find((category) => category.id === "foundations-and-design");
  const foundationItems = filterByCategory("foundations-and-design");
  let state = { basics: {}, selectedItems: [], skippedCategories: [] };
  state = selectItem(state, foundationItems[0], foundations);
  state = selectItem(state, foundationItems[1], foundations);
  assert.equal(state.selectedItems.filter((item) => item.category === "foundations-and-design").length, 2);
});

test("skips optional step and removes selections from that category", () => {
  const state = {
    basics: {},
    selectedItems: [{ itemId: "solid-action-button", category: "buttons-and-actions" }],
    skippedCategories: []
  };
  const next = skipCategory(state, "buttons-and-actions");
  assert.equal(next.selectedItems.length, 0);
  assert.deepEqual(next.skippedCategories, ["buttons-and-actions"]);
});

test("restores state from localStorage payload", () => {
  const restored = restoreState(
    JSON.stringify({
      basics: { projectName: "Testprojekt" },
      selectedItems: [{ itemId: "solid-action-button", category: "buttons-and-actions" }],
      skippedCategories: ["navigation"]
    })
  );
  assert.equal(restored.basics.projectName, "Testprojekt");
  assert.equal(restored.selectedItems.length, 1);
});

test("generates markdown brief with natural content", () => {
  const markdown = generateMarkdown({
    basics: { projectName: "Berat Website" },
    selectedItems: [{ itemId: "solid-action-button", category: "buttons-and-actions" }],
    skippedCategories: []
  });
  assert.match(markdown, /WEBSITE-BRIEF/);
  assert.match(markdown, /Solider Aktionsbutton/);
  assert.match(markdown, /Beschreibung/);
});

test("generates structured json export", () => {
  const json = generateJson({
    basics: { projectName: "Berat Website" },
    selectedItems: [{ itemId: "solid-action-button", category: "buttons-and-actions" }],
    skippedCategories: []
  });
  const parsed = JSON.parse(json);
  assert.equal(parsed.version, 1);
  assert.equal(parsed.selectedItems[0].item.id, "solid-action-button");
});

test("uses custom category select instead of native select", () => {
  assert.match(libraryFiltersSource, /CustomSelect/);
  assert.doesNotMatch(libraryFiltersSource, /<select/);
  assert.match(customSelectSource, /role=\"listbox\"/);
  assert.match(customSelectSource, /Escape/);
  assert.match(customSelectSource, /ArrowDown/);
});
