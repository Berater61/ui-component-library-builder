"use client";

import { useState } from "react";
import type { LibraryItem } from "@/types/library";
import { HtmlComponentPreview } from "./preview/HtmlComponentPreview";

export function PreviewSwatch({ item, large = false }: { item: LibraryItem; large?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const minHeight = large ? "min-h-[260px]" : "min-h-[156px]";
  const renderMode = item.renderMode ?? mapPreviewType(item.previewType);
  const canRenderHtml = renderMode === "html" && Boolean(item.htmlCode);

  return (
    <div className="grid gap-2">
      {canRenderHtml ? (
        <HtmlComponentPreview
          title={item.name}
          html={item.htmlCode ?? ""}
          css={item.cssCode}
          javascript={item.javascriptCode}
          large={large}
        />
      ) : (
        <div className={`muted-surface grid w-full place-items-center rounded-md p-4 text-center ${minHeight}`}>
          <div>
            <div className="text-sm font-semibold">
              {renderMode === "external" ? "Externe Referenz" : renderMode === "image" ? "Screenshot fehlt" : "Platzhalter"}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              {item.status === "reference" ? "Nur Inspiration, keine Live-Komponente" : "Noch keine Vorschau vorhanden"}
            </div>
          </div>
        </div>
      )}

      {!large ? (
        <button
          className="focus-ring w-fit rounded border px-2 py-1 text-xs font-semibold"
          onClick={() => setDialogOpen(true)}
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
          type="button"
        >
          Groß ansehen
        </button>
      ) : null}

      {dialogOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onMouseDown={() => setDialogOpen(false)}
          role="dialog"
        >
          <div
            className="surface grid max-h-[90dvh] w-full max-w-5xl gap-3 overflow-auto rounded-lg p-4"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <button className="focus-ring rounded-md px-3 py-2 text-sm font-semibold" onClick={() => setDialogOpen(false)} type="button">
                Schließen
              </button>
            </div>
            <PreviewSwatch item={item} large />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapPreviewType(previewType: LibraryItem["previewType"]) {
  if (previewType === "external-link") {
    return "external";
  }
  return previewType;
}
