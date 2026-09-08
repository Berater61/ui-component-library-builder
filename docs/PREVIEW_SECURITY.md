# Preview Security

HTML-Vorschauen laufen in `components/preview/HtmlComponentPreview.tsx` in einem isolierten `iframe`.

## Regeln

- `srcDoc` enthaelt HTML, CSS und optional JavaScript.
- Das `iframe` ist sandboxed.
- JavaScript bekommt nur `allow-scripts`, aber kein `allow-same-origin`, keine Popups, keine Top-Navigation und keine Form-Rechte.
- Die Content Security Policy im `srcDoc` blockiert externe Netzwerkaufrufe, fremde Frames und Formularziele.
- Ein Reset-Button laedt das `iframe` neu.

## Grenzen

Importierter TSX-Code wird nicht dynamisch kompiliert. TSX darf gespeichert und exportiert werden, wird aber erst interaktiv, wenn eine Komponente bewusst in eine kontrollierte React-Registry aufgenommen wurde.
