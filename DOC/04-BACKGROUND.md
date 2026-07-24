# Background Script (Service Worker)

**File**: `src/background/main.ts`

## Role

The background script is the central process of the extension. It:
- Stores and reads data from `chrome.storage.local`
- Handles messages from the content script and popup
- Manages tabs (tracks the active tab)
- Shows system notifications
- Manages the storage memory limit

## Message Handlers

| Message | Description | Returns |
|---------|-------------|---------|
| `get-options` | Get extension settings | Options object |
| `save-memory-options` | Save settings | Options data |
| `get-init-copy-data` | Get data on initialization | `{ data, size }` |
| `get-copy-data` | Get data | `{ data, size }` |
| `save-copy-data` | Save copied text | `{ data, size }` |
| `save-custom-item` | Create a custom record | `{ data, size }` |
| `save-parse-image` | Save OCR result | `{ data, size }` |
| `delete-item` | Delete a record | `{ data, size }` |
| `favorite` | Add/remove from favorites | `{ data, size }` |
| `pin` | Pin/unpin a record | `{ data, size }` |
| `save-edit-item` | Save edited record | `{ data, size }` |
| `set-notification` | Show a notification | — |
| `retry-init` | Re-initialize content script | — |

## Data Structure

Data is stored as an `IDataItem[]` array under the key `copy-info`:

```typescript
interface ICopyItem {
  value: string;
  location?: string;      // Page URL
  time: string;           // "HH:MM"
  key: string;            // Date as group key
  id: string;             // uniqid()
  favorite?: boolean;
  pin?: boolean;
  action?: string;        // 'copy-text-item' | 'custom-item' | 'parse-image'
  title?: string;         // For custom-item
}

interface IDataItem {
  key: string;            // Date (e.g. "Monday, July 24, 2026")
  items: ICopyItem[];
  id: string;             // uniqid()-timestamp
}
```

Records are grouped by creation date. Each group has a `key` — a date in "en-US" format (e.g. "Monday, July 24, 2026").

## Storage Limit

- **LIMIT_STORAGE**: 10,100,700 bytes (~10 MB)
- Measured via `new Blob([JSON.stringify(data)]).size`
- If the limit is exceeded and `auto-clear-last` is enabled — old (non-favorite) records are removed
- If the limit is exceeded and auto-cleanup is disabled — an error notification is shown

## Auto-Cleanup

The `autoClearOldItems` function removes records from the end of the array:
1. Iterates through groups
2. From each group, keeps only records with `favorite: true`
3. If a group is empty after filtering — it is removed entirely
4. Stops when the size drops below the limit
5. If after cleaning all groups the limit is still exceeded — returns `needRemoveFavorite = true`

## Notifications

Uses `browser.notifications.create` with the icon `/assets/success_alert.png`. Shown on:
- Save (copy, custom, parse-image)
- Delete
- Add/remove from favorites
- Pin/unpin
- Storage limit error

## Tab Tracking

- `browser.tabs.onActivated` — on tab switch
- `browser.tabs.onUpdated` — on tab update

Sends `activated-new-tab` to the content script to update the UI.
