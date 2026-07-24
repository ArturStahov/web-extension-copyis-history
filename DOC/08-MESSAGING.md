# Messaging Protocol

## Mechanism

Uses `webext-bridge` — a typed library for communication between background, content script, and popup.

**Import by context**:
```typescript
// Background
import { onMessage, sendMessage } from 'webext-bridge/background'

// Content script
import { onMessage, sendMessage } from 'webext-bridge/content-script'

// Popup
import { sendMessage } from 'webext-bridge/popup'
```

## Protocol Typing

Protocols are declared in `shim.d.ts`:

```typescript
declare module 'webext-bridge' {
  export interface ProtocolMap {
    'tab-prev': { title: string | undefined },
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>,
    'activate-extension-event': { [key: string]: any },
  }
}
```

Most messages use `{ [key: string]: any }` — typing is incomplete.

## Message Map

### Content → Background

| Message | Payload | Response |
|---------|---------|----------|
| `get-init-copy-data` | `{ location: string }` | `{ data: IDataItem[], size: number }` |
| `get-copy-data` | `{ location: string }` | `{ data: IDataItem[], size: number }` |
| `save-copy-data` | `{ value, location, action: 'copy-text-item' }` | `{ data, size }` |
| `save-custom-item` | `{ value, title, action: 'custom-item' }` | `{ data, size }` |
| `save-parse-image` | `{ value, action: 'parse-image' }` | `{ data, size }` |
| `delete-item` | `{ id, key, value }` | `{ data, size }` |
| `favorite` | `{ action: 'add'|'remove', item }` | `{ data, size }` |
| `pin` | `{ action: 'add'|'remove', item }` | `{ data, size }` |
| `save-edit-item` | `{ id, key, value, ... }` | `{ data, size }` |
| `get-options` | `{}` | `options object` |
| `save-memory-options` | `{ [key]: value }` | `data` |
| `set-notification` | `{ title, message }` | — |
| `retry-init` | `{}` | — |

### Background → Content

| Message | Payload | Context |
|---------|---------|---------|
| `activated-new-tab` | `{ tab: tabId }` | content-script |
| `event-retry` | `{ tab: tabId }` | content-script |

### Popup → Content

| Message | Payload | Context |
|---------|---------|---------|
| `activate-extension-event` | `{ activate: true }` | content-script |

## Addressing

Messages are addressed by context:
```typescript
// Send to background
await sendMessage('save-copy-data', payload, "background")

// Send to content script on a specific tab
await sendMessage('activated-new-tab', { tab: tabId }, {
  context: 'content-script',
  tabId: activeTabId
})
```

## Activation Flow

1. User clicks the extension icon → popup opens
2. Popup (`src/popup/main.ts`) sends `activate-extension-event` to content script
3. Content script receives the message → mounts the popup window
4. If content script is not yet initialized (`init = false`) → sends `retry-init` to background
5. Background receives `retry-init` → sends `event-retry` to content script on the active tab
