import type { LibraryStatus } from "@/types/library";

const labels: Record<LibraryStatus, string> = {
  reference: "Referenz",
  "needs-code": "Code fehlt",
  "needs-review": "Prüfung erforderlich",
  "needs-implementation": "Umsetzung erforderlich",
  implemented: "Implementiert",
  deleted: "Gelöscht",
  deprecated: "Veraltet"
};

export function getStatusLabel(status: LibraryStatus) {
  return labels[status];
}

