# Livery Examples

Example applications demonstrating Livery usage patterns.

## Usage Matrix

Livery supports four quadrants based on two axes: **Static/Dynamic** themes and **CSR/SSR** rendering.

```
                    │ CSR             │ SSR
────────────────────┼─────────────────┼─────────────────
  Static Themes     │ ✅ No flash     │ ✅ No flash
  (bundled)         │ (init script)   │ (CSS in HTML)
────────────────────┼─────────────────┼─────────────────
  Dynamic Themes    │ ⚠️ Has flash    │ ✅ No flash
  (fetched)         │ (loading state) │ (SSR + initial)
────────────────────┴─────────────────┴─────────────────
```

## Available Examples

| Example | Framework | Quadrant | Description |
|---------|-----------|----------|-------------|
| [light-dark-static](./light-dark-static) | Vanilla JS | Static + CSR | **Simplest** - Light/dark mode |
| [bundled-themes](./bundled-themes) | Vanilla JS | Static + CSR | TypeScript modules bundled at build |
| [dark-mode](./dark-mode) | Vanilla JS | Static + CSR | Light/dark mode **per tenant** |
| [theme-inheritance](./theme-inheritance) | Vanilla JS | Static + CSR | Base themes with tenant overrides |
| [async-themes](./async-themes) | Vanilla JS | Dynamic + CSR | Async loading from JSON/API |
| [react-basic](./react-basic) | React | Dynamic + CSR | Multi-tenant with `@livery/react` |
| [react-dark-mode](./react-dark-mode) | React | Dynamic + CSR | Per-tenant light/dark mode |
| [react-tailwind](./react-tailwind) | React | Dynamic + CSR | Tailwind CSS integration |
| [react-ssr](./react-ssr) | React | Dynamic + SSR | SSR with Vite (no flash) |
| [nextjs-app-router](./nextjs-app-router) | Next.js | Dynamic + SSR | App Router + `@livery/next` |

## Which Example Should I Start With?

**Using React?** Start with `react-basic` or `react-tailwind`.
**Using Next.js?** Start with `nextjs-app-router`.
**No framework?** Start with `light-dark-static` for the simplest approach.

| Your Use Case | Framework | Quadrant | Example |
|---------------|-----------|----------|---------|
| Simple light/dark mode | Vanilla JS | Static + CSR | [light-dark-static](./light-dark-static) |
| Multiple bundled themes | Vanilla JS | Static + CSR | [bundled-themes](./bundled-themes) |
| Themes from API (vanilla) | Vanilla JS | Dynamic + CSR | [async-themes](./async-themes) |
| React multi-tenant | React | Dynamic + CSR | [react-basic](./react-basic) |
| React + Tailwind | React | Dynamic + CSR | [react-tailwind](./react-tailwind) |
| React SSR (no flash) | React | Dynamic + SSR | [react-ssr](./react-ssr) |
| Next.js multi-tenant | Next.js | Dynamic + SSR | [nextjs-app-router](./nextjs-app-router) |

## Running Examples

```bash
# Install dependencies (from repo root)
pnpm install

# Run any example
cd examples/light-dark-static && pnpm dev   # http://localhost:3010
cd examples/async-themes && pnpm dev        # http://localhost:3000
cd examples/bundled-themes && pnpm dev      # http://localhost:3001
cd examples/dark-mode && pnpm dev           # http://localhost:3002
cd examples/theme-inheritance && pnpm dev   # http://localhost:3003
```

## Example Patterns

### 1. Static Light/Dark (Simplest)

Generate CSS for all themes upfront. No runtime CSS generation.

```typescript
import { toCssStringAll } from '@livery/core';

// Generate CSS for both themes at once
const css = toCssStringAll({
  schema,
  themes: { light, dark },
  defaultTheme: 'light',
});

// Inject once, then switch by changing data-theme attribute
document.documentElement.dataset.theme = 'dark';
```

### 2. Async Themes (Database/API)

Load themes at runtime from external sources.

```typescript
const resolver = createResolver(schema, {
  fetcher: async ({ themeId }) => fetch(`/api/themes/${themeId}`).then((r) => r.json()),
});
const theme = await resolver.resolve({ themeId: 'acme' });
```

### 3. Bundled Themes (TypeScript)

Themes compiled into the app for maximum type safety.

```typescript
const themes: Record<ThemeId, AppTheme> = { acme: acmeTheme, ... };
const theme = themes[themeId]; // Sync, no fetch
```

### 4. Dark Mode per Theme

Each theme has light + dark variants with system preference detection.

```typescript
const themes: Record<ThemeId, Record<ColorScheme, AppTheme>> = {
  acme: { light: acmeLightTheme, dark: acmeDarkTheme },
};
const theme = themes[themeId][colorScheme];

// Auto-detect system preference
window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### 5. Theme Inheritance

Base theme with theme-specific overrides to reduce duplication.

```typescript
const baseTheme: AppTheme = {
  /* complete theme */
};
const acmeOverrides: ThemeOverrides = { brand: { primary: '#ef4444' } };
const theme = deepMerge(baseTheme, acmeOverrides);
```

## Learn More

- [@livery/core Documentation](../packages/core/README.md)
