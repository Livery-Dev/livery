# React Dark Mode Example

Demonstrates **per-tenant light/dark mode** with `@livery/react`.

## Usage Matrix

This example demonstrates: **Dynamic + CSR**

```
                    │ CSR             │ SSR
────────────────────┼─────────────────┼─────────────────
  Static Themes     │                 │
────────────────────┼─────────────────┼─────────────────
  Dynamic Themes    │  ✅ THIS        │
────────────────────┴─────────────────┴─────────────────
```

**Note**: This quadrant has a loading state while themes load. Each tenant has unique light and dark variants.

## Features

- **Per-tenant dark mode**: Each tenant has custom light AND dark themes
- **Color mode toggle**: Switch between light/dark within a tenant
- **Dynamic loading**: Uses `createDynamicThemeProvider` with resolver
- **Compound theme IDs**: `acme:light`, `acme:dark`, etc.

## Quick Start

```bash
# From the repository root
pnpm install

# Run this example
cd examples/react-dark-mode
pnpm dev
```

Then open http://localhost:3000

## Key Files

| File | Description |
|------|-------------|
| `src/livery.ts` | Resolver with light/dark theme variants |
| `src/schema.ts` | Theme schema definition |
| `src/App.tsx` | Main app with tenant + mode selectors |

## How It Works

### 1. Compound theme IDs

```typescript
// Combine tenant + color mode into a single theme ID
function createThemeId(tenant: string, mode: 'light' | 'dark'): string {
  return `${tenant}:${mode}`;
}

// Parse it back
function parseThemeId(themeId: string) {
  const [tenant, mode] = themeId.split(':');
  return { tenant, mode };
}
```

### 2. Fetcher returns correct variant

```typescript
async function fetchTheme({ themeId }) {
  const { tenant, mode } = parseThemeId(themeId);
  return mode === 'dark' ? darkThemes[tenant] : lightThemes[tenant];
}
```

### 3. Switch modes by changing theme ID

```typescript
// Switch from acme light to acme dark
setThemeId(createThemeId('acme', 'dark'));
```

## Learn More

- [Other Examples](../README.md)
- [@livery/react Documentation](../../packages/react/README.md)
