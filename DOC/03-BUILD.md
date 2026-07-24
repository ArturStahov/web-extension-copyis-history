# Build & Development

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev mode (Chrome) — build + watch
npm run dev-firefox  # Dev mode (Firefox) — build + watch
npm run build        # Production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript check (tsc --noEmit)
```

## Build Order

`npm run build` executes steps sequentially (`run-s`):

1. `clear` — removes `extension/dist`, `extension/manifest.json`, `extension.*`
2. `build:web` — Vite build for popup + options pages
3. `build:prepare` — generates `manifest.json` and HTML stubs
4. `build:background` — builds service worker
5. `build:js` — builds content script

Order matters: `prepare` depends on `web`, and `background`/`js` can run in parallel but must come after `prepare`.

## Dev Mode

`npm run dev` runs steps in parallel (`run-p`):

1. `dev:clear` → `dev:prepare` → `dev:background` → `dev:web` → `dev:js`

Vite dev server runs on port **3303** (configurable via `PORT`).

## Three Vite Configs

| Config | Entry | Output | Format |
|--------|-------|--------|--------|
| `vite.config.ts` | `src/popup/index.html`, `src/options/index.html` | `extension/dist/` | SPA |
| `vite.config.background.ts` | `src/background/main.ts` | `extension/dist/background/index.mjs` | IIFE |
| `vite.config.content.ts` | `src/contentScripts/index.ts` | `extension/dist/contentScripts/index.global.js` | IIFE |

## Auto-Imports

Vue APIs (`ref`, `computed`, `watch`, etc.) and `webextension-polyfill` (`browser`) are automatically imported via `unplugin-auto-import`. Generated files `src/auto-imports.d.ts` and `src/components.d.ts` should not be edited manually.

## Components

Vue components in `src/components/` are auto-registered via `unplugin-vue-components`. In templates, use names without the `Component` suffix:

```vue
<!-- File name: ButtonComponent.vue -->
<ButtonComponent />

<!-- File name: PopupContentListItem.vue -->
<PopupContentListItem />
```

## Icons

Icons are used via `unplugin-icons` with `@iconify/json`. In templates:

```vue
<span class="i-mdi-check" />
```

Or as inline SVG (most components use inline SVG).

## UnoCSS

- **presetAttributify** — utilities as attributes: `<div p="x-2 y-2" m="y-auto r-2">`
- **presetUno** — standard classes: `flex`, `rounded-full`, `shadow`
- **presetIcons** — icons as classes: `<span class="i-mdi-check" />`
- **transformerDirectives** — `@apply` in `<style>`

## Path Alias

`~/` → `src/` (configured in `tsconfig.json` and `vite.config.ts`).

## Firefox

For Firefox mode, set `EXTENSION=firefox`. In this mode:
- Background script uses `scripts` instead of `service_worker`
- Different Content Script HMR behavior

## Launching the Extension

```bash
npm run start:chromium  # Launch via web-ext (Chrome)
npm run start:firefox   # Launch via web-ext (Firefox)
```
