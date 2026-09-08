import { LibraryFilters } from "@/components/LibraryFilters";
import { getCategories } from "@/lib/categories";
import { getLibraryItems } from "@/lib/library";

export default function LibraryPage() {
  const items = getLibraryItems();
  const categories = getCategories().filter((category) => items.some((item) => item.category === category.id));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
          Bibliothek
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Referenzen und Komponenten</h1>
        <p className="mt-2 max-w-3xl text-sm" style={{ color: "var(--muted-foreground)" }}>
          Filtere deine Sammlung nach Kategorien und öffne Details, bevor du Varianten im Builder auswählst.
        </p>
      </header>
      <LibraryFilters items={items} categories={categories} />
    </main>
  );
}
