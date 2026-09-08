"use client";

import { useEffect, useState } from "react";
import { generateSelectionJson, generateWebsiteBrief } from "@/lib/export";
import { loadBuilderState } from "@/lib/builder-storage";
import type { BuilderState } from "@/types/builder";
import { emptyBuilderState } from "@/types/builder";
import type { LibraryItem } from "@/types/library";

export function ExportClient({ items }: { items: LibraryItem[] }) {
  const [state, setState] = useState<BuilderState>({
    ...emptyBuilderState,
    basics: { ...emptyBuilderState.basics }
  });

  useEffect(() => {
    setState(loadBuilderState());
  }, []);

  const markdown = generateWebsiteBrief(state, items);
  const json = generateSelectionJson(state, items);

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <section className="surface rounded-lg p-5">
        <h2 className="text-xl font-semibold">Downloads</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Die Dateien werden im Browser aus deinem aktuellen localStorage-Zustand erzeugt.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="focus-ring rounded-md px-4 py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} onClick={() => download("WEBSITE-BRIEF.md", markdown, "text/markdown;charset=utf-8")} type="button">
            WEBSITE-BRIEF.md herunterladen
          </button>
          <button className="focus-ring surface rounded-md px-4 py-3 text-sm font-semibold" onClick={() => download("website-selection.json", json, "application/json;charset=utf-8")} type="button">
            website-selection.json herunterladen
          </button>
        </div>
      </section>

      <section className="surface rounded-lg p-5">
        <h2 className="text-xl font-semibold">Vorschau: WEBSITE-BRIEF.md</h2>
        <pre className="mt-3 max-h-[560px] overflow-auto whitespace-pre-wrap rounded-md p-4 text-sm" style={{ background: "var(--surface-muted)" }}>
          {markdown}
        </pre>
      </section>
    </div>
  );
}
