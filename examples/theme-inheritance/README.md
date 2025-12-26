# Theme Inheritance Example (Vanilla JS)

Demonstrates **base theme with tenant-specific overrides** to reduce duplication using vanilla JavaScript.

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

**Flash prevention**: Themes are bundled at build time with inheritance/merging.

## Use Case

Best when:

- Most themes share common styling (spacing, typography, etc.)
- Themes only need to customize brand colors and a few values
- You want to update base styles across all themes easily
- You want to minimize theme configuration per theme

## Features

- Base theme with all default values
- Themes only override what they need
- Deep merge combines base + overrides
- Visual display of what each theme overrides

## Quick Start

```bash
pnpm install
cd examples/theme-inheritance
pnpm dev
```

Then open http://localhost:3003

## Project Structure

```
theme-inheritance/
├── src/
│   ├── main.ts
│   ├── schema.ts
│   ├── theme-manager.ts
│   ├── style.css
│   └── themes/
│       ├── index.ts      # Theme registry + deepMerge
│       ├── base.ts       # Complete base theme
│       └── overrides.ts  # Theme-specific overrides
```

## Key Pattern

```typescript
// Base theme has ALL values
const baseTheme: AppTheme = {
  brand: { name: 'Base', primary: '#3b82f6', secondary: '#64748b' },
  colors: { background: '#ffffff', surface: '#f8fafc', ... },
  spacing: { sm: '8px', md: '16px', lg: '24px' },
  typography: { fontFamily: 'Inter', fontSize: '16px', lineHeight: 1.5 },
  borders: { radius: '8px' },
};

// Theme only specifies what's different
const acmeOverrides: ThemeOverrides = {
  brand: {
    name: 'Acme Corp',
    primary: '#ef4444',  // Custom brand color
  },
  // Everything else inherited from base!
};

// Merge to get final theme
function getTheme(themeId: ThemeId): AppTheme {
  const overrides = themeOverrides[themeId];
  return deepMerge(baseTheme, overrides);
}
```

## Benefits

1. **Less duplication** - Themes don't repeat shared values
2. **Easy updates** - Change base theme, all themes update
3. **Flexible** - Override as much or as little as needed
4. **Type-safe** - ThemeOverrides is a deep partial of AppTheme

## Learn More

- [Other Examples](../README.md)
- [@livery/core Documentation](../../packages/core/README.md)
