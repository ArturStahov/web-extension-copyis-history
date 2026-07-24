# Extension Architecture

## Three Execution Contexts

The extension runs in three isolated browser contexts, each with its own JS bundle:

### 1. Background (Service Worker)

- **File**: `src/background/main.ts`
- **Output**: `extension/dist/background/index.mjs` (IIFE format)
- **Role**: Central brain. Stores data in `chrome.storage.local`, handles messages, manages tabs, shows notifications.
- **Manifest**: `service_worker` (Chrome) or `scripts` (Firefox)

### 2. Content Script

- **File**: `src/contentScripts/index.ts`
- **Output**: `extension/dist/contentScripts/index.global.js` (IIFE)
- **Role**: Injected into all pages (`<all_urls>`). Intercepts the `copy` event, mounts the popup window in Shadow DOM, manages the paste popup.
- **Feature**: Shadow DOM (open in dev, closed in prod) for style isolation.

### 3. Popup / Options

- **Popup**: `src/popup/main.ts` — minimal entry, only activates the content script
- **Options**: `src/options/main.ts` — Vue SPA for the settings page
- **Output**: separate HTML pages in `extension/dist/`

## Data Flow

```
[User copies text]
        |
        v
  Content Script (intercepts copy event)
        |
        v sendMessage('save-copy-data')
        |
  Background (saves to storage.local)
        |
        v returns { data, size }
        |
  Content Script (updates UI)
```

## Inter-Context Communication

Uses `webext-bridge` with typed protocols:

- **Content → Background**: `save-copy-data`, `delete-item`, `favorite`, `pin`, `save-edit-item`, `get-copy-data`, `get-init-copy-data`, `get-options`, `save-memory-options`, `set-notification`, `save-custom-item`, `save-parse-image`, `retry-init`
- **Background → Content**: `activated-new-tab`, `event-retry`
- **Popup → Content**: `activate-extension-event`

Messages are sent via `sendMessage(msg, data, context)`, where context is `background`, `content-script`, or a tab identifier.

## Manifest V3

The manifest is generated from TypeScript (`src/manifest.ts`) via the `scripts/manifest.ts` script. Do not edit `extension/manifest.json` directly — it is overwritten on every build.

Permissions:
- `storage` — data storage
- `activeTab` — access to the active tab
- `notifications` — system notifications
