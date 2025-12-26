# Async Themes Example (Vanilla JS)

Demonstrates **async theme loading** from external sources (JSON files, API, database) using vanilla JavaScript (no framework).

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

**Note**: This quadrant has a flash/loading state while themes load. For flash-free dynamic themes, use SSR (see `nextjs-app-router` example).

## Vanilla JS vs React

This example uses **vanilla JavaScript** with `@livery/core` only. You'll see some manual DOM work:

- Creating/managing a `<style>` element for CSS injection
- Manually calling `toCssString()` and injecting into DOM
- Tracking current theme state

If you're using **React**, the `@livery/react` package handles all of this automatically via `DynamicThemeProvider`. See the `react-basic` example instead.

## Use Case

Best for applications where:

- Themes are stored in a database or API
- Themes can change without redeploying
- You have many themes (don't want to bundle all of them)

## Features

- Runtime theme switching with button clicks
- Theme data loaded from JSON files (simulating database/API)
- Async resolver with built-in caching
- CSS variables for instant style updates

## Quick Start

```bash
# From the repository root
pnpm install

# Run this example
cd examples/async-themes
pnpm dev
```

Then open http://localhost:3000

## Project Structure

```
async-themes/
├── src/
│   ├── main.ts          # Application entry point
│   ├── schema.ts        # Theme schema definition
│   ├── theme-manager.ts # Async theme loading with caching
│   └── style.css        # Styles using CSS variables
├── public/
│   └── themes/          # Theme JSON files (simulates API)
│       ├── acme.json
│       ├── globex.json
│       └── initech.json
├── index.html
└── package.json
```

## Key Pattern

```typescript
// Create a resolver with async fetching and caching
const resolver = createResolver(schema, {
  fetcher: async ({ themeId }) => {
    // In production: fetch from your API
    const response = await fetch(`/themes/${themeId}.json`);
    return response.json();
  },
  cache: { ttl: 60000 }, // 1 minute cache
});

// Switch themes (async)
async function switchTheme(themeId: string) {
  const theme = await resolver.resolve({ themeId });
  const css = toCssString(schema, theme);
  injectStyles(css);
}
```

## Learn More

- [Other Examples](../README.md)
- [@livery/core Documentation](../../packages/core/README.md)
