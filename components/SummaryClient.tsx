"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCategoryName } from "@/lib/categories";
import { getStatusLabel } from "@/lib/status";
import { loadBuilderState } from "@/lib/builder-storage";
import type { BuilderState } from "@/types/builder";
import { emptyBuilderState } from "@/types/builder";
import type { LibraryItem } from "@/types/library";

export function SummaryClient({ items }: { items: LibraryItem[] }) {
  const [state, setState] = useState<BuilderState>({
    ...emptyBuilderState,
    basics: { ...emptyBuilderState.basics }
  });

  useEffect(() => {
    setState(loadBuilderState());
  }, []);

  const selected = useMemo(
    () =>
      state.selectedItems
        .map((selection) => {
          const item = items.find((entry) => entry.id === selection.itemId);
          return item ? { selection, item } : undefined;
        })
        .filter((entry): entry is { selection: (typeof state.selectedItems)[number]; item: LibraryItem } => Boolean(entry)),
    [items, state.selectedItems]
  );

  return (
    <div className="grid gap-5">
      <section className="surface rounded-lg p-5">
        <h2 className="text-xl font-semibold">Projektgrundlagen</h2>
        <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <SummaryMeta label="Projektname" value={state.basics.projectName || "Nicht angegeben"} />
          <SummaryMeta label="Website-Ziel" value={state.basics.websiteGoal || "Nicht angegeben"} />
          <SummaryMeta label="Zielgruppe" value={state.basics.audience || "Nicht angegeben"} />
          <SummaryMeta label="Sprachen" value={state.basics.languages || "Nicht angegeben"} />
          <SummaryMeta label="Stack" value={state.basics.preferredStack || "Nicht angegeben"} />
          <SummaryMeta label="Designstil" value={state.basics.designStyle || "Nicht angegeben"} />
        </dl>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Ausgewählte Einträge</h2>
        {selected.length === 0 ? (
          <div className="surface rounded-lg p-5">Noch keine Einträge ausgewählt.</div>
        ) : (
          selected.map(({ selection, item }) => (
            <article className="surface rounded-lg p-4" key={item.id}>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {getCategoryName(item.category)} / {item.subcategory}
                  </p>
                </div>
                <span className="h-fit rounded-md px-2 py-1 text-xs font-semibold" style={{ background: "var(--surface-muted)" }}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              <p className="mt-2 text-sm">{item.description}</p>
              <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                <SummaryMeta label="Quelle" value={item.sourceUrl || item.sourceName || "Keine externe Quelle"} />
                <SummaryMeta label="Notizen" value={selection.personalNotes || item.notes || "Keine Notizen"} />
                <SummaryMeta label="Anpassungen" value={selection.desiredAdjustments || "Noch nicht angegeben"} />
              </dl>
            </article>
          ))
        )}
      </section>

      <section className="surface rounded-lg p-5">
        <h2 className="text-xl font-semibold">Übersprungene Kategorien</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
          {state.skippedCategories.length > 0
            ? state.skippedCategories.map((category) => getCategoryName(category)).join(", ")
            : "Keine Kategorien übersprungen."}
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link className="focus-ring surface rounded-md px-4 py-3 text-sm font-semibold" href="/builder">
          Auswahl ändern
        </Link>
        <Link className="focus-ring rounded-md px-4 py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} href="/builder/export">
          Export vorbereiten
        </Link>
      </div>
    </div>
  );
}

function SummaryMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd style={{ color: "var(--muted-foreground)" }}>{value}</dd>
    </div>
  );
}
