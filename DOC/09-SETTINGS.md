# Extension Settings

## Options Page

**File**: `src/options/Options.vue`

Currently minimal — displays an icon and "Powered by RokkArt" text. Most settings are in the popup window.

## Popup Settings

Available via the "memory" tab in PopupContent:

### Memory

- **Current usage**: displays data size in bytes
- **Maximum limit**: 10,100,700 bytes

### Settings

#### Auto-clear old saved copied entries (`auto-clear-last`)

- **Type**: checkbox
- **Default**: false
- **Description**: Automatically remove old records when the storage memory limit is reached
- **Behavior**: removes records from the end of the list (oldest), preserving favorites

#### Show open button on webpage (`visible-open-button`)

- **Type**: checkbox
- **Default**: true
- **Description**: Show the "Open" button on all pages
- **Behavior**: semi-transparent button in the bottom-right corner of the page for quick popup access

## Record Actions

Each record supports the following actions:

| Action | Description | Available Everywhere |
|--------|-------------|---------------------|
| Copy | Copies value to clipboard | Yes |
| Edit | Opens the editor | Yes |
| Delete | Deletes the record | Yes |
| Favorite | Add/remove from favorites | Yes |
| Pin | Pin/unpin record | Custom-records only |

## Hotkeys

| Combination | Action |
|-------------|--------|
| Shift + left click on input field | Open paste popup for quick paste |

## Record Types

| Type | `action` | Description |
|------|----------|-------------|
| Copied text | `copy-text-item` or undefined | Auto-saved on copy |
| Custom record | `custom-item` | Manually created via form |
| OCR result | `parse-image` | Image text recognition result (currently non-functional) |

## External Links

- Chrome Web Store: https://chromewebstore.google.com/detail/copybook/imjhfdoodnjclahddoggpbjghihgocmd
- YouTube video (help): https://www.youtube.com/watch?v=V1HcJ7BKCkc
- Contact: stakhov.artur@gmail.com
