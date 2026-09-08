# Design System: UI Component Library Builder

## Product type

Local-first web application for a personal, continuously growing UI component library and a guided website-selection workflow.

## Target audience

Design-conscious developers and semi-technical users who want to catalog, compare, and select UI examples before starting a website implementation.

## Design direction

The interface is a precise, calm workbench: more library and tool than marketing website. Stable preview areas and concise metadata take priority over decoration. References, review states, and implemented components must remain visibly distinct.

## Layout principle

- Compact application shell with horizontal navigation on small screens and a left sidebar on desktop.
- Dense, scannable catalog cards with stable preview areas.
- Detail pages combine a large preview, source metadata, and code tabs.
- The builder is a linear workflow with progress, back navigation, review, and export.

## Grid

- Mobile: target width 390 px, 16 px page gutters, one column.
- Tablet: 768 px, 24 px gutters, two catalog columns.
- Desktop: 1440 px, 252 px sidebar, three catalog columns, maximum content width 1280 px.

## Typography

- Use a clear system sans-serif for body copy and controls.
- Use medium and semibold weights to establish hierarchy.
- Use tabular numerals for progress and metadata where appropriate.
- Body text remains at least 16 px where mobile input zoom would otherwise be triggered.

## Color palette

| Role | Light | Dark |
|---|---|---|
| Background | `#F6F7F2` | `#181B17` |
| Surface | `#FFFFFF` | `#20241F` |
| Muted surface | `#ECEEE6` | `#2A3029` |
| Foreground | `#20231F` | `#F3F5EE` |
| Muted foreground | `#62685E` | `#BAC1B4` |
| Primary / focus | `#315C48` | `#8CC5A8` |
| Accent | `#C44E32` | `#EF8B6F` |
| Border | `#D7DACE` | `#3F473D` |

## Spacing

Use a 4/8 px rhythm. Primary values: 4, 8, 12, 16, 24, 32, and 48 px.

## Radii

- Small controls: 6 px.
- Cards and panels: 8 px.
- Modals: 10 px.
- Avoid strongly pill-shaped containers except where the component itself requires one.

## Shadows

Use shadows sparingly. Prefer borders and surface contrast.

- Small: `0 1px 2px rgb(32 35 31 / 0.08)`.
- Overlay: `0 8px 20px rgb(32 35 31 / 0.10)`.

## Component style

- Catalog cards show preview, name, state, source, tags, and category without decorative clutter.
- Filters use semantic form controls with visible labels.
- Status is communicated with text as well as color.
- Interactive targets are at least 44 px high for primary actions.
- Icon-only actions require accessible names.

## Image language

Real component screenshots and rendered previews are the primary visuals. Missing visuals must be labeled as placeholders; generic stock photography is not used.

## Icons

Use one consistent SVG icon family with a common stroke weight. Do not use emoji as structural icons.

## Interactions

- Provide visible hover, pressed, selected, disabled, and keyboard-focus states.
- Keep micro-interactions between 150 and 220 ms.
- Search, filters, tabs, previews, and builder steps must remain keyboard operable.
- Copy and export actions provide clear status feedback.

## Animations

Animation explains state changes only. Prefer opacity and transform, avoid layout-shifting motion, and respect `prefers-reduced-motion`.

## Avoid

- Generic SaaS landing-page composition.
- Blue-purple marketing gradients and decorative glassmorphism.
- Floating cards nested inside floating cards.
- Low-contrast metadata.
- Hover-only functionality.
- Presenting roadmap categories as implemented catalog content.

## Taxonomy principle

Classification is multidimensional. Each item combines `itemType`, `category`, `subcategory`, `contexts`, `styles`, and searchable `tags`; visual style never replaces functional category.

