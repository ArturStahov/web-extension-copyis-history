# Data Storage

## Mechanism

Data is stored in `chrome.storage.local` via a custom composable `useWebExtensionStorage`.

**File**: `src/composables/useWebExtensionStorage.ts`

This is an adaptation of VueUse's `useStorageAsync` for WebExtension Storage API. Features:
- Reactive (`ref`) — changes are automatically synced to storage
- Bidirectional sync: code changes → storage, storage changes → reactive state
- Serialization via VueUse's `StorageSerializers`
- Listens to `storage.onChanged` for cross-context synchronization

## Storage Keys

### `copy-info`

**Type**: `IDataItem[]` (array of groups)

Groups records by creation date:

```typescript
[
  {
    key: "Monday, July 24, 2026",
    id: "uniqid-timestamp",
    items: [
      {
        value: "copied text",
        location: "https://example.com",
        time: "14:30",
        key: "Monday, July 24, 2026",
        id: "uniqid",
        favorite: false,
        pin: false,
        action: "copy-text-item"
      }
    ]
  }
]
```

**Data operations**:
- `save-copy-data` — adds a record to the matching group (by date)
- `save-custom-item` — creates a record with `action: 'custom-item'`
- `save-parse-image` — creates a record with `action: 'parse-image'`
- `delete-item` — deletes a record; removes the group if empty
- `favorite` — toggles `favorite: boolean`
- `pin` — toggles `pin: boolean`
- `save-edit-item` — updates a record's value

### `options`

**Type**: `Record<string, boolean>`

```typescript
{
  'auto-clear-last': false,     // Auto-cleanup old records at limit
  'visible-open-button': true   // Show "Open" button on pages
}
```

## Data Size

Measured via `new Blob([JSON.stringify(data)]).size`. Maximum limit — **10,100,700 bytes** (~10 MB). This is the `chrome.storage.local` limit for extensions.

## Cross-Context Synchronization

`useWebExtensionStorage` uses:
1. `storage.local.get/set` for read/write
2. `storage.onChanged.addListener` to receive changes from other contexts
3. `watchWithFilter` to track reactive state changes

This means when the content script updates data, the background script sees the changes (and vice versa).

## List Processing Services

**File**: `src/services/list-service.ts`

| Function | Description |
|----------|-------------|
| `getRenderSortedList(list, params)` | Sort by field (descending) |
| `getFavoriteList(items)` | All records with `favorite: true` across all groups |
| `getCustomList(items)` | All records with `action: 'custom-item'`, pinned on top |
| `getCopiedList(items, isParent)` | Copied records (excluding custom/parse-image) |

Sorting is always descending (`localeCompare`), placing newest records at the top.
