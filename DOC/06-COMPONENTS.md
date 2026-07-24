# Vue Components

All components are in `src/components/` and are auto-registered. In templates, use names without the `Component` suffix.

## Component Structure

### PopupContent.vue

**Main popup window component**. Contains:
- **Tabs**: `copied`, `custom`, `favorite`, `memory`
- **Lists**: renders records based on the active tab
- **Editor**: `PopupContentEditor` for editing records
- **Create**: `PopupContentCustomCreateItem` for creating custom records
- **Help**: `HelpScreen`

#### Tabs

| Tab | Code | Description |
|-----|------|-------------|
| Copied | `main` | Copied texts, grouped by date |
| Custom | `custom-records` | Custom records (pinned on top) |
| Favorite | `favorite` | Records with `favorite: true` |
| Memory | `memory` | Memory settings |

#### Events (emits)

- `close` — close popup
- `hide-popup-to-button` — collapse to button
- `delete-item-action` — delete a record
- `save-edit` — save edit
- `add-to-favorite` / `remove-favorite` — manage favorites
- `add-pin` / `remove-pin` — manage pinning
- `save-parse-image` — save OCR result
- `save-custom-item` — create custom record
- `update-options` — update settings

### PopupContentHeader.vue

Popup header with buttons:
- **Create** (left side) — open the creation form
- **Back** (left side) — return from editor/creation
- **Help** (?) — open HelpScreen
- **Collapse** — hide popup to button
- **Close** (X) — fully close popup

### PopupContentListItem.vue

Individual record in a list. Contains:
- Record text (truncated on hover)
- Action buttons (appear on hover):
  - **Pin** (custom-records only)
  - **Favorite** (add/remove from favorites)
  - **Edit** — open editor
  - **Copy** — copy to clipboard
  - **Delete** — delete record
- Creation time

Features:
- Records with `favorite: true` have a red left border
- Records with `pin: true` have a gray background (custom-records only)
- Tooltip with full text appears on hover (> 46 characters)
- Links open in a new tab

### PopupContentEditor.vue

Record editor. Contains:
- Record details (URL, source type, date, time)
- Text editing field
- Title field (for custom-item)
- "SAVE" button

### PopupContentCustomCreateItem.vue

Custom record creation form:
- Title field
- Text field
- "SAVE" button

### PopupContentSettings.vue

Memory settings:
- Current usage / maximum limit
- Settings checkboxes

### PopupContentParseImage.vue

Image upload for OCR (currently Tesseract is commented out):
- "Upload Image" button
- Image preview
- Result text field
- "SAVE" button

### PastePopup.vue

Quick-paste popup:
- List of favorite records
- Record selection (click)
- "PASTE" button

### Utility Components

| Component | Description |
|-----------|-------------|
| `ButtonComponent` | Universal button (icon or text style) |
| `CheckboxComponent` | Checkbox with tooltip |
| `LoaderComponent` | Animated SVG loader |
| `HelpScreen` | Help page with YouTube video |

## Styles

Styles are defined in `<style>` of each component (without `scoped`). Main theme:
- **Background**: `#363636` (dark gray)
- **Text**: `#ffffff` (white)
- **Accent**: `#ffd060` (golden) and `#d3ac13`
- **Buttons/links**: `#0d9488` (teal)
- **Favorites**: `#d9223d` (red)
- **Font**: Roboto
