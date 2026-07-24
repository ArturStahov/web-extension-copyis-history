# Copybook Extension — Overview

## What It Is

Copybook is a browser extension (Chrome/Firefox) for saving and managing copied text. It works as a clipboard manager with extra features: favorites, pinning, editing, and custom record creation.

## Tech Stack

- **Vue 3** — UI framework (Composition API, `<script setup>`)
- **Vite 4** — build tool (three separate configs for different parts of the extension)
- **TypeScript** — type safety
- **UnoCSS** — CSS utilities (presetUno + presetAttributify + presetIcons)
- **webextension-polyfill** — cross-browser WebExtension API
- **webext-bridge** — typed messaging between background/content/popup
- **VueUse** — reactive utilities
- **@iconify/json** — icon sets without manual imports

## Key Features

1. **Auto-save** copied text (intercepts the `copy` event)
2. **In-page popup** (content script) with a list of saved records
3. **Paste popup** — quick paste from favorites via Shift + click on an input field
4. **Favorites** — mark important records
5. **Pin** — prioritize display in custom records
6. **Edit** saved records
7. **Custom Records** — manually create new records
8. **Memory settings** — monitor storage usage + auto-cleanup
9. **Firefox support** — separate build mode

## Project Directory Structure

```
copybook-extension/
├── extension/            # Built extension (build output)
│   ├── assets/           # Icons and images
│   ├── dist/             # JS/CSS bundles
│   └── manifest.json     # Auto-generated manifest
├── src/
│   ├── background/       # Service worker (main logic process)
│   ├── contentScripts/   # Content script (injected into pages)
│   ├── popup/            # Popup window entry
│   ├── options/          # Options/settings page
│   ├── components/       # Vue components (auto-registered)
│   ├── composables/      # Vue composables (useWebExtensionStorage)
│   ├── services/         # Business logic (lists, positioning)
│   ├── logic/            # Data storage and shared setup
│   ├── styles/           # Global styles
│   └── assets/           # Icons and images
├── scripts/              # Build scripts (prepare, manifest)
└── vite.config.*.ts      # Three Vite configs
```

## Language

The primary codebase language is TypeScript. Vue templates use `<script setup lang="ts">`. Styles are plain CSS + UnoCSS attributes.
