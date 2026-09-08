import type { BuilderState } from "@/types/builder";
import type { LibraryItem } from "@/types/library";
import { getCategoryName } from "./categories";

export function createSelectionPayload(state: BuilderState, items: LibraryItem[]) {
  const selected = state.selectedItems
    .map((selection) => {
      const item = items.find((entry) => entry.id === selection.itemId);
      return item
        ? {
            selection,
            item
          }
        : undefined;
    })
    .filter(Boolean);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    basics: state.basics,
    skippedCategories: state.skippedCategories,
    selectedItems: selected
  };
}

export function generateSelectionJson(state: BuilderState, items: LibraryItem[]): string {
  return JSON.stringify(createSelectionPayload(state, items), null, 2);
}

export function generateWebsiteBrief(state: BuilderState, items: LibraryItem[]): string {
  const selected = state.selectedItems
    .map((selection) => {
      const item = items.find((entry) => entry.id === selection.itemId);
      return item ? { selection, item } : undefined;
    })
    .filter((entry): entry is { selection: (typeof state.selectedItems)[number]; item: LibraryItem } => Boolean(entry));

  const sections = selected.filter(({ item }) => item.category === "page-sections" || item.category === "marketing-and-communication");
  const buttonsAndInputs = selected.filter(
    ({ item }) => item.category === "buttons-and-actions" || item.category === "inputs-and-selection"
  );
  const backgrounds = selected.filter(({ item }) => item.category === "foundations-and-design");
  const navigation = selected.filter(({ item }) => item.category === "navigation");

  return `# WEBSITE-BRIEF: ${state.basics.projectName || "Neues Website-Projekt"}

## 1. Projektziel

${fallback(state.basics.websiteGoal, "Bitte eine Website auf Basis der folgenden Auswahl planen und umsetzen.")}

## 2. Zielgruppe

${fallback(state.basics.audience, "Die Zielgruppe wurde noch nicht genauer beschrieben. Bitte im neuen Codex-Task zuerst klaeren.")}

## 3. Sprachen

${fallback(state.basics.languages, "Deutsch")}

## 4. Technischer Stack

${fallback(state.basics.preferredStack, "Next.js, React, TypeScript, Tailwind CSS")}

## 5. Designrichtung

${fallback(state.basics.designStyle, "Ruhige, zugängliche und projektspezifische UI. Keine generische SaaS-Vorlage.")}

## 6. Ausgewaehlter Hintergrund

${formatSelectionGroup(backgrounds)}

## 7. Ausgewaehlte Navigation

${formatSelectionGroup(navigation)}

## 8. Ausgewaehlte Sections

${formatSelectionGroup(sections)}

## 9. Ausgewaehlte Buttons und Eingabeelemente

${formatSelectionGroup(buttonsAndInputs)}

## 10. Quellenlinks

${selected
  .map(({ item }) => `- ${item.name}: ${item.sourceUrl || "keine externe Quelle"}`)
  .join("\n") || "- Keine Quellen ausgewaehlt."}

## 11. Persoenliche Notizen zu jeder Auswahl

${selected.map(formatNotes).join("\n\n") || "Keine Auswahl vorhanden."}

## 12. Gewuenschte Interaktionen und Animationen

${fallback(state.basics.interactions, "Subtile Mikrointeraktionen, sichtbare Fokuszustaende, keine blockierenden Animationen.")}

## 13. Responsive-Anforderungen

Die Umsetzung muss fuer ca. 390 px, 768 px und 1440 px Breite funktionieren. Es darf keinen horizontalen Scroll auf Mobile geben. Touch-Ziele sollen mindestens 44 px hoch sein.

## 14. Accessibility-Anforderungen

Semantisches HTML, Tastaturbedienung, sichtbare Fokuszustaende, ausreichender Kontrast, sinnvolle Labels fuer Icon-Buttons und prefers-reduced-motion muessen beruecksichtigt werden.

## 15. Lizenz- und Urheberrechtshinweise

Referenzen sind Inspiration. Fremder Code darf nicht ungeprueft uebernommen werden. Bei jedem Eintrag ist der Status zu beachten: reference bedeutet, dass eine eigene Umsetzung erforderlich ist.

## 16. Klare Implementierungsreihenfolge

1. Projektanforderungen und Inhalte finalisieren.
2. Designsystem aus den ausgewaehlten Referenzen ableiten.
3. Layout, Navigation und responsive Grundstruktur umsetzen.
4. Ausgewaehlte Sections und Komponenten als eigene Implementierung bauen.
5. Interaktionen, Animationen und Accessibility pruefen.
6. Build ausfuehren und visuelle Pruefung in Mobile, Tablet und Desktop vornehmen.

## 17. Definition of Done

- Die Website startet lokal ohne Fehler.
- Alle ausgewaehlten Referenzen wurden entweder als eigene Komponente umgesetzt oder sichtbar als noch offene Referenz markiert.
- Quellen und Lizenzhinweise bleiben dokumentiert.
- Die Seite ist responsiv, tastaturbedienbar und kontraststark.
- Es gibt keine generischen Platzhaltertexte an sichtbaren Hauptstellen.

## Vollstaendige Auswahl

${selected.map(formatItem).join("\n\n") || "Noch keine Eintraege ausgewaehlt."}

## Uebersprungene Kategorien

${state.skippedCategories.map((category) => `- ${getCategoryName(category)}`).join("\n") || "- Keine Kategorien uebersprungen."}

## Besondere Anforderungen

${fallback(state.basics.specialRequirements, "Keine weiteren Anforderungen angegeben.")}
`;
}

function formatSelectionGroup(entries: Array<{ selection: { personalNotes: string; desiredAdjustments: string }; item: LibraryItem }>) {
  if (entries.length === 0) {
    return "Keine Auswahl getroffen.";
  }

  return entries.map(formatItem).join("\n\n");
}

function formatItem({ selection, item }: { selection: { personalNotes: string; desiredAdjustments: string }; item: LibraryItem }) {
  return `### ${item.name}

- Kategorie: ${getCategoryName(item.category)}
- Unterkategorie: ${item.subcategory}
- Quellen-URL: ${item.sourceUrl || "keine externe Quelle"}
- Beschreibung: ${item.description}
- Persoenliche Notizen: ${selection.personalNotes || item.notes || "Keine Notizen angegeben."}
- Relevante Tags: ${item.tags.join(", ") || "keine Tags"}
- Gewuenschte Anpassungen: ${selection.desiredAdjustments || "Im spaeteren Codex-Task passend zum Projekt ausarbeiten."}
- Status: ${item.status}
- Hinweis: ${item.itemType === "reference" || item.status === "reference" ? "Nur Referenz, eigene Implementierung erforderlich." : "Bereits als verwendbare Grundlage markiert."}`;
}

function formatNotes({ selection, item }: { selection: { personalNotes: string; desiredAdjustments: string }; item: LibraryItem }) {
  return `- ${item.name}: ${selection.personalNotes || item.notes || "Keine persoenlichen Notizen."}`;
}

function fallback(value: string, fallbackText: string) {
  return value.trim().length > 0 ? value : fallbackText;
}
