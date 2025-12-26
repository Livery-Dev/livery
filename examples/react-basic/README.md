# React Basic Example

This example demonstrates basic usage of `@livery/react` for multi-tenant theming in React applications.

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

**Note**: This quadrant has a loading state while themes load. For flash-free dynamic themes, use SSR (see `react-ssr` or `nextjs-app-router` examples).

## Features

- **Typed Provider & Hooks**: Uses `createDynamicThemeProvider()` to generate fully typed components
- **Theme Switching**: Switch between themes using `useTheme().setThemeId()`
- **CSS Variable Injection**: Automatic CSS variable injection via style tags
- **Loading States**: Built-in loading fallback support
- **Error Handling**: Error callback for resolution failures

## Quick Start

```bash
# From the monorepo root
pnpm install
pnpm dev --filter @livery/example-react-basic

# Or from this directory
pnpm install
pnpm dev
```

Then open http://localhost:3010

## Key Files

- `src/schema.ts` - Theme schema definition using `@livery/core`
- `src/livery.ts` - Livery setup: resolver and typed provider/hooks
- `src/App.tsx` - Main React application using Livery hooks
- `src/style.css` - Styles using CSS variables
- `public/themes/*.json` - Tenant theme configurations

## Usage Pattern

```tsx
// 1. Define your schema (src/schema.ts)
import { createSchema, t } from '@livery/core';

export const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
    },
  },
});

// 2. Create typed provider and hooks (src/livery.ts)
import { createResolver } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';
import { schema } from './schema';

export const resolver = createResolver({
  schema,
  fetcher: async ({ themeId }) => fetch(`/themes/${themeId}.json`).then((r) => r.json()),
});

export const { DynamicThemeProvider, useTheme, useThemeValue } = createDynamicThemeProvider({ schema });

// 3. Use in your app (src/App.tsx)
function App() {
  return (
    <DynamicThemeProvider initialThemeId="acme" resolver={resolver}>
      <MyComponent />
    </DynamicThemeProvider>
  );
}

function MyComponent() {
  // Full type inference!
  const primary = useThemeValue('brand.primary');
  const { theme, isLoading } = useTheme();

  return <div style={{ color: primary }}>Hello</div>;
}
```

## CSS Variables

The `DynamicThemeProvider` automatically injects CSS variables. Use them in your styles:

```css
.button {
  background: var(--brand-primary);
  border-radius: var(--borders-radius);
  padding: var(--spacing-sm) var(--spacing-md);
}
```

## Theme Files

Each theme is a JSON file in `public/themes/`:

```json
// public/themes/acme.json
{
  "brand": {
    "name": "Acme Corp",
    "primary": "#dc2626"
  }
}
```

Themes only need to specify values they want to override - defaults come from the schema.
