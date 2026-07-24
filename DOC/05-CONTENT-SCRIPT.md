# Content Script

**Files**:
- `src/contentScripts/index.ts` — entry point
- `src/contentScripts/views/App.vue` — main component

## Role

The content script is injected into **all pages** (`<all_urls>`) and is responsible for:
1. Intercepting the text copy event
2. Mounting the popup window on the page
3. Managing the paste popup (paste from favorites)
4. Displaying the "Open" button on the page

## Initialization

On content script load:
1. Listens for `activated-new-tab` message from background
2. Listens for `activate-extension-event` from popup
3. On receipt — mounts the popup window in Shadow DOM
4. After mounting, sets `init = true` (one-time mount)

## Shadow DOM

The popup window is mounted in Shadow DOM for style isolation:

```typescript
const shadowDOM = container.attachShadow?.({
  mode: __DEV__ ? 'open' : 'closed'
}) || container
```

- **Dev**: open (for debugging)
- **Prod**: closed (isolation)

CSS is loaded via `<link rel="stylesheet" href="...style.css">`.

## Copy Event

When text is copied on the page:
1. `document.addEventListener("copy", handlerCopyText)` catches the event
2. `getSelectionText()` retrieves the selected text
3. Sends `save-copy-data` to background with `{ value, location, action: 'copy-text-item' }`
4. Updates the popup UI

## Paste Popup

The paste popup is a small window for quickly pasting records from favorites.

### Activation

1. User presses **Shift** (keydown)
2. Clicks on an input field (`<input>` or `<textarea>`)
3. Paste popup opens with a list of favorite records

### Positioning

Position is determined by `getPastePopupPosition` from `src/services/pastePopup.ts`:
- Takes click coordinates and element dimensions
- Adjusts position so the window stays within viewport bounds

### Pasting

On clicking "PASTE":
1. Finds the input element (`elementToPasteValue`)
2. Adds a `paste` event handler to the element
3. Sets `nodeElement.value = payload.value`
4. Dispatches an `input` event to update form state

## "Open" Button

If the `visible-open-button` option is enabled, a button is displayed in the bottom-right corner of the page:
- Clicking it loads data from background and shows the popup
- The button is semi-transparent, becomes brighter on hover

## Page Interaction

The content script adds event handlers to prevent event propagation to the page:
- `wheel` — scrolling
- `click` — clicks
- `keydown` — key presses

This prevents conflicts with the host page's event handlers.
