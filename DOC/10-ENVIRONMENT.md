# Environment & Configuration

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` or `production` | `development` |
| `EXTENSION` | `firefox` for Firefox mode | — |
| `PORT` | Dev server port | `3303` |

## Environment Detection

**File**: `src/background/main.ts` and `vite.config.ts`

```typescript
// scripts/utils.ts
export const isDev = process.env.NODE_ENV !== 'production'
export const isFirefox = process.env.EXTENSION === 'firefox'
export const port = parseInt(process.env.PORT || '') || 3303
```

Vite global defines:
- `__DEV__` — true in dev mode
- `__NAME__` — name from package.json ("copybook")

## Forbidden URLs

**File**: `src/env.ts`

Content script is NOT injected on:
- `chrome-extension://`
- `chrome-search://`
- `chrome://`
- `devtools://`
- `edge://`
- `https://chrome.google.com/webstore`

## TypeScript Types

### `src/global.d.ts`

```typescript
declare const __DEV__: boolean
declare const __NAME__: string
declare module '*.vue' {
  const component: any
  export default component
}
```

### `modules.d.ts`

Vue Runtime Core extension for global properties:

```typescript
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $app: { context: string }
  }
}
```

## tsconfig.json

Key settings:
- `strict: true` — strict type checking
- `noUnusedLocals: true` — disallow unused variables
- `paths: { "~/*": ["src/*"] }` — path alias
- `types: ["vite/client"]` — Vite types

## .npmrc

```ini
shamefully-hoist=true     # Enables hoisting for unplugin
auto-install-peers=true   # Auto-install peer dependencies
```

## ESLint

**File**: `.eslintrc` — minimal, extends an empty config. Effectively uses default TypeScript rules.

## Cache

- `.eslintcache` — ESLint cache (gitignored)
- `src/auto-imports.d.ts` — generated auto-import types (gitignored)
- `src/components.d.ts` — generated component types (gitignored)
- `extension/manifest.json` — generated manifest (gitignored)
