# Copybook Extension

Chrome/Firefox browser extension for saving and managing copied text. Vue 3 + Vite + TypeScript.

## Commands

```bash
npm install          # install deps
npm run dev          # dev build + watch (Chrome)
npm run dev-firefox  # dev build + watch (Firefox)
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

Dev server runs on port 3303 (configurable via `PORT` env var).

## Architecture

Three Vite build pipelines, each with its own config:

- **`vite.config.ts`** — popup and options pages (Vue SPA, entry: `src/popup/index.html`, `src/options/index.html`)
- **`vite.config.background.ts`** — service worker (entry: `src/background/main.ts`)
- **`vite.config.content.ts`** — content script (entry: `src/contentScripts/index.ts`)

Build order matters: `build:web` → `build:prepare` → `build:background` → `build:js`. The prepare step generates `extension/manifest.json` from `src/manifest.ts` and stubs HTML files for dev mode.

Output goes to `extension/dist/`. The `extension/manifest.json` is generated, not committed.

## Key conventions

- **Path alias**: `~/` maps to `src/` (configured in both tsconfig and vite).
- **Auto-imports**: Vue APIs and `webextension-polyfill` are auto-imported (no explicit imports needed). Generated files `src/auto-imports.d.ts` and `src/components.d.ts` are gitignored.
- **Components**: PascalCase `.vue` files in `src/components/` are auto-registered. Component names in templates omit the `Component` suffix (e.g., `<Button />` for `ButtonComponent.vue`).
- **Icons**: Use `@iconify/json` icon names directly in templates (via `unplugin-icons`). No manual icon imports.
- **UnoCSS**: Utility classes via attributes (`un-`) or standard classes. Icons as classes (`<span class="i-mdi-check" />`).
- **Firefox support**: Set `EXTENSION=firefox` env var. Background script uses `scripts` instead of `service_worker` for Firefox.
- **Manifest V3**: The manifest is defined in TypeScript (`src/manifest.ts`) and generated at build time.

## Testing

Vitest with jsdom environment. Run via `npx vitest` or integrated in vite.

## Common pitfalls

- `extension/manifest.json` is auto-generated — edit `src/manifest.ts` instead.
- `src/auto-imports.d.ts` and `src/components.d.ts` are auto-generated — don't edit manually.
- The `clear` script removes `extension/dist`, `extension/manifest.json`, and `extension.*` — always runs before dev/build.
- Content script uses Shadow DOM for style isolation (open in dev, closed in prod).
- `webext-bridge` is used for messaging between background, content, and popup.
