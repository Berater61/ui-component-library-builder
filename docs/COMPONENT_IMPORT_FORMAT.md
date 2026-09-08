# Component Import Format

Der spaetere Import unterstuetzt einzelne `.component.json`-Dateien und Komponenten-ZIP-Pakete.

## Einzeldatei

```json
{
  "schemaVersion": 1,
  "name": "Animierter Theme Toggle",
  "category": "inputs-and-selection",
  "subcategory": "theme-toggle",
  "renderMode": "html",
  "description": "Animierter Umschalter zwischen hellem und dunklem Modus.",
  "tags": ["toggle", "theme"],
  "contexts": ["application"],
  "styles": ["modern"],
  "source": {
    "name": "Eigene Sammlung",
    "url": "",
    "author": "",
    "license": "Eigene Komponente",
    "isExternalReference": false
  },
  "code": {
    "html": "<button>Toggle</button>",
    "css": "button { min-height: 44px; }",
    "javascript": "",
    "tsx": ""
  }
}
```

## Regeln

- Kategorien werden gegen `config/category-taxonomy.json` validiert.
- Unterkategorien werden gegen die jeweilige Hauptkategorie in `config/category-taxonomy.json` validiert.
- `renderMode: "html"` benoetigt HTML oder einen Validierungsfehler.
- Externer Code muss Quelle und Lizenz behalten.
- Unbekannte Kategorien werden nicht still verworfen.
- Unbekannte Styles werden als Tags erhalten, damit Designstile keine parallele Komponentenstruktur erzeugen.

## Importskript

Komponentenimporte koennen lokal mit dem Skript aktualisiert werden:

```bash
node scripts/import-component-json.mjs imports/components/<paket-ordner>
```

Das Skript erkennt vorhandene Eintraege anhand von ID, Slug oder identischer Source-URL und aktualisiert diese, statt Duplikate anzulegen.
