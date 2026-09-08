# Architecture

## Purpose

The application is a local-first workbench for collecting, reviewing, and selecting reusable UI examples. It does not automatically generate a finished website. Its implemented output is a human-readable Markdown brief plus a structured JSON selection for a later implementation task.

The project is in active development: the catalog and builder form the working core, while more component categories and maintenance workflows are added over time.

## Current application flow

1. `data/library-items.json` provides the current component registry.
2. `config/category-taxonomy.json` defines category labels, ordering, selection modes, and optional steps.
3. `/library` offers search, filtering, live previews, and detail routes.
4. `/builder` captures project basics and component selections.
5. The browser stores the current builder draft in `localStorage`.
6. `/builder/summary` reviews the draft.
7. `/builder/export` generates Markdown and JSON downloads in the browser.

## Catalog model

Each `LibraryItem` is classified across multiple dimensions:

- `itemType`: foundation, pattern, component, section, page, or reference.
- `category` and `subcategory`: stable navigation and builder taxonomy.
- `contexts`: intended use such as application, marketing, or portfolio.
- `styles`: visual characteristics such as minimal, technical, or playful.
- `tags`: free-form searchable metadata.
- `status`: whether an entry is implemented, a reference, or needs review.
- `sourceName`, `sourceUrl`, and `license`: provenance and reuse information.

## Preview isolation

HTML examples render inside sandboxed iframes. The generated preview document applies a restrictive Content Security Policy: network connections, external assets, navigation, and forms are blocked. JavaScript permission is enabled only when an entry contains stored JavaScript.

This reduces risk but is not a substitute for reviewing imported code before it enters the registry. See `docs/PREVIEW_SECURITY.md`.

## Builder and persistence

Builder steps are derived from enabled taxonomy categories that currently contain items. Selection rules can be single- or multi-select. Drafts are local to the browser and are not synchronized to a backend.

Data access is centralized through the existing read helpers in `lib/library.ts` and category helpers in `lib/categories.ts`. Persistent create/update APIs are a future extension and are not claimed as current functionality.

## Import and duplicate utilities

`scripts/import-component-json.mjs` normalizes supported component JSON files into the registry. `lib/deduplication.ts` contains exact and probable duplicate checks. These are maintenance utilities; duplicate review is not yet an in-app workflow.

## Current boundaries

- JSON is the registry source of truth.
- `localStorage` is the only builder persistence layer.
- Live catalog entries are HTML/CSS-first.
- The taxonomy contains categories that do not yet have catalog entries.
- Source and license review remains a manual responsibility during import.

