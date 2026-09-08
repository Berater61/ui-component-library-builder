import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeTabs } from "@/components/CodeTabs";
import { PreviewSwatch } from "@/components/PreviewSwatch";
import { getCategoryName } from "@/lib/categories";
import { getLibraryItemBySlug, getLibraryItems } from "@/lib/library";
import { getStatusLabel } from "@/lib/status";

export function generateStaticParams() {
  return getLibraryItems().map((item) => ({
    slug: item.slug
  }));
}

export default async function LibraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLibraryItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <Link className="focus-ring w-fit rounded-md px-3 py-2 text-sm font-semibold" href="/library">
        Zurück zur Bibliothek
      </Link>
      <section className="surface rounded-lg p-4">
        <PreviewSwatch item={item} large />
      </section>
      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <article className="surface rounded-lg p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
                {getCategoryName(item.category)} / {item.subcategory}
              </p>
              <h1 className="mt-1 text-3xl font-semibold">{item.name}</h1>
            </div>
            <Link className="focus-ring rounded-md px-4 py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} href="/builder">
              Für Projekt auswählen
            </Link>
          </div>
          <p className="mt-4" style={{ color: "var(--muted-foreground)" }}>
            {item.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span className="rounded border px-2 py-1 text-xs" style={{ borderColor: "var(--border)" }} key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <CodeTabs item={item} />
        </article>
        <aside className="surface h-fit rounded-lg p-5">
          <h2 className="text-lg font-semibold">Metadaten</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <Meta label="Status" value={getStatusLabel(item.status)} />
            <Meta label="Typ" value={item.itemType} />
            <Meta label="Quelle" value={item.sourceName || "Keine Quelle"} />
            <Meta label="Lizenz" value={item.license || "Nicht angegeben"} />
            <Meta label="Aufgenommen" value={new Date(item.createdAt).toLocaleDateString("de-DE")} />
            <Meta label="Geändert" value={new Date(item.updatedAt).toLocaleDateString("de-DE")} />
          </dl>
          {item.sourceUrl ? (
            <a className="focus-ring mt-4 inline-flex rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} href={item.sourceUrl} target="_blank" rel="noreferrer">
              Quelle öffnen
            </a>
          ) : null}
          <h2 className="mt-6 text-lg font-semibold">Notizen</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {item.notes || "Keine Notizen vorhanden."}
          </p>
        </aside>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd style={{ color: "var(--muted-foreground)" }}>{value}</dd>
    </div>
  );
}
