import { SummaryClient } from "@/components/SummaryClient";
import { getLibraryItems } from "@/lib/library";

export default function BuilderSummaryPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
          Zusammenfassung
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Auswahl prüfen</h1>
        <p className="mt-2 max-w-3xl text-sm" style={{ color: "var(--muted-foreground)" }}>
          Kontrolliere Projektgrundlagen, Quellen, Notizen und übersprungene Kategorien vor dem Export.
        </p>
      </header>
      <SummaryClient items={getLibraryItems()} />
    </main>
  );
}
