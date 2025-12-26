# Bundled Themes Example (Vanilla JS)

Demonstrates **bundled TypeScript themes** with compile-time type checking using vanilla JavaScript.

## Usage Matrix

This example demonstrates: **Static + CSR**

```
                    │ CSR             │ SSR
────────────────────┼─────────────────┼─────────────────
  Static Themes     │  ✅ THIS        │
────────────────────┼─────────────────┼─────────────────
  Dynamic Themes    │                 │
────────────────────┴─────────────────┴─────────────────
```

**Flash prevention**: Themes are bundled at build time. No network requests needed.

## Use Case

Best when:

- You have a fixed set of themes (light/dark, brand variants)
- Themes ship with your app (don't change at runtime)
- You want maximum type safety (errors at build time)
- Faster theme switching (no network requests)

## Features

- Type-safe themes as TypeScript modules
- Compile-time validation (no runtime errors!)
- Synchronous theme switching
- Dropdown-based theme selector

## Quick Start

```bash
# From the repository root
pnpm install

# Run this example
cd examples/bundled-themes
pnpm dev
```

Then open http://localhost:3001

## Project Structure

```
bundled-themes/
├── src/
│   ├── main.ts          # Application entry point
│   ├── schema.ts        # Theme schema + AppTheme type
│   ├── theme-manager.ts # Sync theme management
│   ├── style.css        # Styles using CSS variables
│   └── themes/          # TypeScript theme modules
│       ├── index.ts     # Theme registry
│       ├── acme.ts      # Type-checked theme
│       ├── globex.ts
│       └── initech.ts
├── index.html
└── package.json
```

## Key Pattern

```typescript
// themes/acme.ts - TypeScript validates at compile time
import type { AppTheme } from '../schema';

export const acmeTheme: AppTheme = {
  brand: {
    primary: '#ef4444',
    // secondary: 123,  // ← TypeScript error!
  },
  // ...
};

// Theme registry with type-safe lookup
const themes: Record<ThemeId, AppTheme> = {
  acme: acmeTheme,
  globex: globexTheme,
  initech: initechTheme,
};

// Switch themes (sync - no async needed!)
function switchTheme(themeId: ThemeId) {
  const theme = themes[themeId];
  const css = toCssString(schema, theme);
  injectStyles(css);
}
```

## Learn More

- [Other Examples](../README.md)
- [@livery/core Documentation](../../packages/core/README.md)
