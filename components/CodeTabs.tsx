"use client";

import { useMemo, useState } from "react";
import type { LibraryItem } from "@/types/library";

const tabs = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "javascript", label: "JavaScript" },
  { id: "tsx", label: "React/TSX" },
  { id: "metadata", label: "Metadaten" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CodeTabs({ item }: { item: LibraryItem }) {
  const [activeTab, setActiveTab] = useState<TabId>("html");
  const [copied, setCopied] = useState(false);
  const content = useMemo(() => getContent(item, activeTab), [activeTab, item]);

  async function copyContent() {
    if (!content) {
      return;
    }
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Codebereiche">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className="focus-ring rounded-md border px-3 py-2 text-sm font-semibold"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              style={{
                borderColor: "var(--border)",
                background: activeTab === tab.id ? "var(--primary)" : "var(--surface-muted)",
                color: activeTab === tab.id ? "var(--background)" : "var(--foreground)"
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          className="focus-ring rounded-md border px-3 py-2 text-sm font-semibold"
          disabled={!content}
          onClick={copyContent}
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
          type="button"
        >
          {copied ? "Kopiert" : "Kopieren"}
        </button>
      </div>

      {content ? (
        <pre className="mt-3 max-h-[420px] overflow-auto rounded-md p-3 text-sm" style={{ background: "var(--surface-muted)" }}>
          <code>{content}</code>
        </pre>
      ) : (
        <div className="mt-3 rounded-md border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          Für diesen Bereich ist noch kein Code gespeichert. Der Eintrag bleibt eine Referenz, bis HTML, CSS, JavaScript oder eine registrierte React-Komponente ergänzt wird.
        </div>
      )}
    </section>
  );
}

function getContent(item: LibraryItem, tab: TabId) {
  if (tab === "html") {
    return item.htmlCode ?? "";
  }
  if (tab === "css") {
    return item.cssCode ?? "";
  }
  if (tab === "javascript") {
    return item.javascriptCode ?? "";
  }
  if (tab === "tsx") {
    return item.tsxCode ?? "";
  }
  return JSON.stringify(
    {
      id: item.id,
      slug: item.slug,
      name: item.name,
      itemType: item.itemType,
      category: item.category,
      subcategory: item.subcategory,
      contexts: item.contexts,
      styles: item.styles,
      tags: item.tags,
      status: item.status,
      renderMode: item.renderMode ?? item.previewType,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      license: item.license,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    },
    null,
    2
  );
}
