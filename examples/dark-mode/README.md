# Dark Mode Example (Vanilla JS)

Demonstrates **light and dark mode per tenant** with system preference detection using vanilla JavaScript.

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

**Flash prevention**: Themes are bundled at build time. CSS regenerated on theme/mode switch.

## Use Case

Best when:

- Each theme needs both light and dark variants
- You want to respect user's system preference (prefers-color-scheme)
- Users can manually override and persist their choice

## Features

- Light/dark mode toggle for each theme
- System preference detection (`prefers-color-scheme`)
- Manual override with localStorage persistence
- Smooth transitions between modes
- Each theme has unique colors for both modes

## Quick Start

```bash
pnpm install
cd examples/dark-mode
pnpm dev
```

Then open http://localhost:3002

## Project Structure

```
dark-mode/
├── src/
│   ├── main.ts
│   ├── schema.ts
│   ├── theme-manager.ts    # Handles tenant + color scheme
│   ├── style.css
│   └── themes/
│       ├── index.ts        # Theme registry
│       ├── acme/
│       │   ├── light.ts
│       │   └── dark.ts
│       ├── globex/
│       │   ├── light.ts
│       │   └── dark.ts
│       └── initech/
│           ├── light.ts
│           └── dark.ts
```

## Key Pattern

```typescript
type ColorScheme = 'light' | 'dark';

// Each theme has both variants
const themes: Record<ThemeId, Record<ColorScheme, AppTheme>> = {
  acme: {
    light: acmeLightTheme,
    dark: acmeDarkTheme,
  },
  // ...
};

// Get theme for current theme ID and scheme
const theme = themes[themeId][colorScheme];

// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
prefersDark.addEventListener('change', (e) => {
  if (useSystemPreference) {
    setColorScheme(e.matches ? 'dark' : 'light');
  }
});
```

## Learn More

- [Other Examples](../README.md)
- [@livery/core Documentation](../../packages/core/README.md)
