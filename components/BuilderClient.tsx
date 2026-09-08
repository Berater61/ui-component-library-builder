"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadBuilderState, saveBuilderState } from "@/lib/builder-storage";
import type { BuilderState } from "@/types/builder";
import { emptyBuilderState } from "@/types/builder";
import type { CategoryConfig, LibraryCategory, LibraryItem } from "@/types/library";
import { PreviewSwatch } from "./PreviewSwatch";

export function BuilderClient({ categories, items }: { categories: CategoryConfig[]; items: LibraryItem[] }) {
  const [state, setState] = useState<BuilderState>({
    ...emptyBuilderState,
    basics: { ...emptyBuilderState.basics }
  });
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = categories.length + 1;
  const activeCategory = stepIndex > 0 ? categories[stepIndex - 1] : undefined;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  useEffect(() => {
    setState(loadBuilderState());
  }, []);

  useEffect(() => {
    saveBuilderState(state);
  }, [state]);

  const categoryItems = useMemo(
    () => (activeCategory ? items.filter((item) => item.category === activeCategory.id) : []),
    [activeCategory, items]
  );

  function updateState(updater: (current: BuilderState) => BuilderState) {
    setState((current) => updater(current));
  }

  function updateBasic(field: keyof BuilderState["basics"], value: string) {
    updateState((current) => ({
      ...current,
      basics: {
        ...current.basics,
        [field]: value
      }
    }));
  }

  function toggleSelection(item: LibraryItem) {
    if (!activeCategory) {
      return;
    }

    updateState((current) => {
      const existing = current.selectedItems.find((selection) => selection.itemId === item.id);
      const withoutCategory =
        activeCategory.selectionMode === "single"
          ? current.selectedItems.filter((selection) => selection.category !== activeCategory.id)
          : current.selectedItems;
      const withoutItem = withoutCategory.filter((selection) => selection.itemId !== item.id);

      if (existing && activeCategory.selectionMode === "multi") {
        return {
          ...current,
          selectedItems: withoutItem
        };
      }

      return {
        ...current,
        selectedItems: [
          ...withoutItem,
          {
            itemId: item.id,
            category: item.category,
            personalNotes: item.notes || "",
            desiredAdjustments: ""
          }
        ],
        skippedCategories: current.skippedCategories.filter((category) => category !== activeCategory.id)
      };
    });
  }

  function updateSelectionText(itemId: string, field: "personalNotes" | "desiredAdjustments", value: string) {
    updateState((current) => ({
      ...current,
      selectedItems: current.selectedItems.map((selection) =>
        selection.itemId === itemId
          ? {
              ...selection,
              [field]: value
            }
          : selection
      )
    }));
  }

  function skipCategory(category: LibraryCategory) {
    updateState((current) => ({
      ...current,
      selectedItems: current.selectedItems.filter((selection) => selection.category !== category),
      skippedCategories: current.skippedCategories.includes(category)
        ? current.skippedCategories
        : [...current.skippedCategories, category]
    }));
    setStepIndex((current) => Math.min(totalSteps - 1, current + 1));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="surface rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
              Schritt {stepIndex + 1} von {totalSteps}
            </p>
            <h1 className="text-2xl font-semibold">{activeCategory ? activeCategory.name : "Projektgrundlagen"}</h1>
          </div>
          <div className="min-w-40 text-sm font-semibold">{progress}%</div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full" style={{ background: "var(--surface-muted)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--primary)" }} />
        </div>
      </div>

      {stepIndex === 0 ? (
        <ProjectBasicsForm state={state} updateBasic={updateBasic} />
      ) : activeCategory ? (
        <CategoryStep
          category={activeCategory}
          items={categoryItems}
          state={state}
          toggleSelection={toggleSelection}
          updateSelectionText={updateSelectionText}
        />
      ) : null}

      <div className="flex flex-wrap justify-between gap-3">
        <button
          className="focus-ring surface rounded-md px-4 py-3 text-sm font-semibold"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          type="button"
        >
          Zurück
        </button>
        <div className="flex flex-wrap gap-3">
          {activeCategory && !activeCategory.required ? (
            <button className="focus-ring surface rounded-md px-4 py-3 text-sm font-semibold" onClick={() => skipCategory(activeCategory.id)} type="button">
              Schritt überspringen
            </button>
          ) : null}
          {stepIndex < totalSteps - 1 ? (
            <button className="focus-ring rounded-md px-4 py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} onClick={() => setStepIndex((current) => Math.min(totalSteps - 1, current + 1))} type="button">
              Weiter
            </button>
          ) : (
            <Link className="focus-ring rounded-md px-4 py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} href="/builder/summary">
              Zusammenfassung anzeigen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectBasicsForm({
  state,
  updateBasic
}: {
  state: BuilderState;
  updateBasic: (field: keyof BuilderState["basics"], value: string) => void;
}) {
  return (
    <section className="surface grid gap-4 rounded-lg p-4 md:grid-cols-2">
      <Field label="Projektname" value={state.basics.projectName} onChange={(value) => updateBasic("projectName", value)} />
      <Field label="Website-Ziel" value={state.basics.websiteGoal} onChange={(value) => updateBasic("websiteGoal", value)} />
      <Field label="Zielgruppe" value={state.basics.audience} onChange={(value) => updateBasic("audience", value)} />
      <Field label="Gewünschte Sprachen" value={state.basics.languages} onChange={(value) => updateBasic("languages", value)} />
      <Field label="Bevorzugter technischer Stack" value={state.basics.preferredStack} onChange={(value) => updateBasic("preferredStack", value)} />
      <Field label="Gewünschter Designstil" value={state.basics.designStyle} onChange={(value) => updateBasic("designStyle", value)} />
      <Field label="Besondere Anforderungen" textarea value={state.basics.specialRequirements} onChange={(value) => updateBasic("specialRequirements", value)} />
      <Field label="Interaktionen und Animationen" textarea value={state.basics.interactions} onChange={(value) => updateBasic("interactions", value)} />
    </section>
  );
}

function CategoryStep({
  category,
  items,
  state,
  toggleSelection,
  updateSelectionText
}: {
  category: CategoryConfig;
  items: LibraryItem[];
  state: BuilderState;
  toggleSelection: (item: LibraryItem) => void;
  updateSelectionText: (itemId: string, field: "personalNotes" | "desiredAdjustments", value: string) => void;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const selection = state.selectedItems.find((entry) => entry.itemId === item.id);
        const isSelected = Boolean(selection);
        return (
          <article className="surface flex flex-col gap-3 rounded-lg p-3" key={item.id}>
            <PreviewSwatch item={item} />
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                {item.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span className="rounded border px-2 py-1 text-xs" style={{ borderColor: "var(--border)" }} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              className="focus-ring rounded-md px-4 py-3 text-sm font-semibold"
              style={{
                background: isSelected ? "var(--primary)" : "var(--surface-muted)",
                color: isSelected ? "white" : "var(--foreground)"
              }}
              onClick={() => toggleSelection(item)}
              type="button"
            >
              {isSelected ? "Ausgewählt" : category.selectionMode === "single" ? "Variante auswählen" : "Zur Auswahl hinzufügen"}
            </button>
            {selection ? (
              <div className="grid gap-2">
                <Field
                  label="Persönliche Notizen"
                  textarea
                  value={selection.personalNotes}
                  onChange={(value) => updateSelectionText(item.id, "personalNotes", value)}
                />
                <Field
                  label="Gewünschte Anpassungen"
                  textarea
                  value={selection.desiredAdjustments}
                  onChange={(value) => updateSelectionText(item.id, "desiredAdjustments", value)}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {textarea ? (
        <textarea
          className="focus-ring min-h-24 rounded-md border bg-transparent px-3 py-3"
          style={{ borderColor: "var(--border)" }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="focus-ring rounded-md border bg-transparent px-3 py-3"
          style={{ borderColor: "var(--border)" }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
