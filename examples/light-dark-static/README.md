# Static Light/Dark Mode (Vanilla JS)

The simplest approach to light/dark mode with Livery using vanilla JavaScript.

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

**Flash prevention**: Uses `toCssStringAll()` to bundle all theme CSS upfront, then switches via `data-theme` attribute.

## What This Demonstrates

- **`toCssStringAll()`** - Generate CSS for all themes upfront
- **Zero runtime overhead** - No CSS regeneration when switching
- **`data-theme` attribute** - Switch themes by changing one attribute
- **System preference detection** - Respects `prefers-color-scheme`
- **Persistence** - Saves preference to localStorage

## When to Use This Approach

This is the recommended approach when:

- You have a **fixed set of themes** (light/dark)
- Themes are **known at build time**
- You want **zero runtime overhead**
- You **don't need** per-user or per-tenant themes

For dynamic themes (multi-tenant, user customization), see examples that use `createResolver()`.

## How It Works

### 1. Define Your Schema

```typescript
import { createSchema, t, type InferTheme } from '@livery/core';

const schema = createSchema({
  definition: {
    colors: {
      primary: t.color(),
      background: t.color(),
      foreground: t.color(),
    },
  },
});

type Theme = InferTheme<typeof schema.definition>;
```

### 2. Create Theme Objects

```typescript
const light: Theme = {
  colors: {
    primary: '#14B8A6',
    background: '#FFFFFF',
    foreground: '#0F172A',
  },
};

const dark: Theme = {
  colors: {
    primary: '#2DD4BF',
    background: '#0F172A',
    foreground: '#F8FAFC',
  },
};
```

### 3. Generate CSS for All Themes

```typescript
import { toCssStringAll } from '@livery/core';

const css = toCssStringAll({
  schema,
  themes: { light, dark },
  defaultTheme: 'light',
});

// Output:
// :root, [data-theme="light"] { --colors-primary: #14B8A6; ... }
// [data-theme="dark"] { --colors-primary: #2DD4BF; ... }
```

### 4. Inject CSS Once

```typescript
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

### 5. Switch Themes

```typescript
// That's it! Just change the attribute
document.documentElement.dataset.theme = 'dark';
```

## Running the Example

```bash
# From repo root
pnpm install

# Run the example
cd examples/light-dark-static
pnpm dev
```

Open http://localhost:3010

## Key Files

| File | Description |
|------|-------------|
| `src/schema.ts` | Theme schema definition |
| `src/themes.ts` | Light and dark theme objects + CSS generation |
| `src/main.ts` | App entry point with theme switching logic |
| `src/style.css` | Styles using CSS variables |

## Comparison with Other Examples

| Example | Use Case | CSS Generation |
|---------|----------|----------------|
| **light-dark-static** | Fixed light/dark | Once at build time |
| dark-mode | Per-tenant light/dark | On each switch |
| async-themes | Themes from API | On each fetch |
| bundled-themes | Multiple tenants | On each switch |
