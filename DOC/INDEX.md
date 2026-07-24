# Copybook Extension — Documentation

Chrome/Firefox browser extension for saving and managing copied text. Vue 3 + Vite + TypeScript.

## Table of Contents

| # | File | Description |
|---|------|-------------|
| 01 | [OVERVIEW](./01-OVERVIEW.md) | General overview, tech stack, features, project structure |
| 02 | [ARCHITECTURE](./02-ARCHITECTURE.md) | Three execution contexts, data flow, inter-context communication |
| 03 | [BUILD](./03-BUILD.md) | Commands, build process, Vite configs, auto-imports, components, icons, UnoCSS |
| 04 | [BACKGROUND](./04-BACKGROUND.md) | Service worker: message handlers, data structure, storage limit |
| 05 | [CONTENT-SCRIPT](./05-CONTENT-SCRIPT.md) | Content script: Shadow DOM, copy event, paste popup, Open button |
| 06 | [COMPONENTS](./06-COMPONENTS.md) | Vue components: PopupContent, ListItem, Editor, Settings, PastePopup |
| 07 | [STORAGE](./07-STORAGE.md) | useWebExtensionStorage, storage keys, list services |
| 08 | [MESSAGING](./08-MESSAGING.md) | webext-bridge protocol, message map, addressing |
| 09 | [SETTINGS](./09-SETTINGS.md) | Extension settings, record actions, hotkeys, record types |
| 10 | [ENVIRONMENT](./10-ENVIRONMENT.md) | Environment variables, forbidden URLs, TypeScript, tsconfig |

## Quick Start

- Dev mode: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- Type check: `npm run typecheck`
- Dev server port: 3303
