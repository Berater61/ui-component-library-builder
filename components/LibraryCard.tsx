import Link from "next/link";
import type { LibraryItem } from "@/types/library";
import { getCategoryName } from "@/lib/categories";
import { getStatusLabel } from "@/lib/status";
import { PreviewSwatch } from "./PreviewSwatch";

export function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <article className="surface flex h-full flex-col gap-3 rounded-lg p-3">
      <PreviewSwatch item={item} />
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <span className="rounded-md px-2 py-1 text-xs font-semibold" style={statusStyle(item.status)}>
              {getStatusLabel(item.status)}
            </span>
          </div>
          <p className="mt-2 line-clamp-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {item.description}
          </p>
        </div>
        <dl className="grid gap-1 text-sm">
          <div>
            <dt className="inline font-semibold">Kategorie: </dt>
            <dd className="inline">{getCategoryName(item.category)}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Unterkategorie: </dt>
            <dd className="inline">{item.subcategory}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 5).map((tag) => (
            <span className="rounded border px-2 py-1 text-xs" style={{ borderColor: "var(--border)" }} key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {item.sourceName || "Keine Quelle"}
          </span>
          <div className="flex flex-wrap gap-2">
            <Link className="focus-ring rounded-md px-3 py-2 text-sm font-semibold" style={{ background: "var(--surface-muted)" }} href="/builder">
              Auswählen
            </Link>
            <Link className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} href={`/library/${item.slug}`}>
              Detail öffnen
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function statusStyle(status: LibraryItem["status"]) {
  if (status === "implemented") {
    return { background: "#dcefe4", color: "#214936" };
  }
  if (status === "needs-review") {
    return { background: "#fff0cf", color: "#6f4100" };
  }
  if (status === "needs-implementation") {
    return { background: "#f6dfd8", color: "#7b2d1f" };
  }
  return { background: "var(--surface-muted)", color: "var(--foreground)" };
}
