import { BuilderClient } from "@/components/BuilderClient";
import { getBuilderCategories, getLibraryItems } from "@/lib/library";

export default function BuilderPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
          Auswahlassistent
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Website-Auswahl zusammenstellen</h1>
        <p className="mt-2 max-w-3xl text-sm" style={{ color: "var(--muted-foreground)" }}>
          Erst Projektgrundlagen erfassen, dann die aktivierten Kategorien aus der Taxonomie durchlaufen.
        </p>
      </header>
      <BuilderClient categories={getBuilderCategories()} items={getLibraryItems()} />
    </main>
  );
}
