# @livery/core

Type-safe, multi-tenant theming library for B2B SaaS applications.

## Features

- **Zero runtime dependencies** - Lightweight and fast
- **Full TypeScript inference** - Define once, get types everywhere
- **Framework agnostic** - Works with React, Vue, Svelte, or vanilla JS
- **CSS custom properties** - Standard, performant output
- **Validation built-in** - Strict, coerce, or partial modes
- **Caching** - Smart resolution caching with TTL and stale-while-revalidate
- **Security** - Built-in CSS injection prevention

## Installation

```bash
npm install @livery/core
# or
pnpm add @livery/core
```

## Quick Start

```typescript
import { createSchema, t, createResolver, toCssVariables, toCssString } from '@livery/core';

// 1. Define your schema
const schema = createSchema({
  definition: {
    colors: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
      background: t.color().default('#ffffff'),
    },
    spacing: {
      sm: t.dimension().default('4px'),
      md: t.dimension().default('8px'),
      lg: t.dimension().default('16px'),
    },
    typography: {
      fontFamily: t.fontFamily().default('Inter, sans-serif'),
    },
  },
});

// 2. Create a resolver
const resolver = createResolver({
  schema,
  fetcher: async ({ themeId }) => {
    // Fetch theme from your API/database
    const res = await fetch(`/api/themes/${themeId}`);
    return res.json();
  },
  cache: {
    ttl: 60000, // 1 minute
    staleWhileRevalidate: true,
  },
});

// 3. Resolve and use
const theme = await resolver.resolve({ themeId: 'acme' });

// Full type inference!
console.log(theme.colors.primary); // typed as string
console.log(theme.spacing.md); // typed as string

// 4. Generate CSS
const variables = toCssVariables({ schema, theme });
// { '--colors-primary': '#3b82f6', '--spacing-md': '8px', ... }

const css = toCssString({ schema, theme });
// :root { --colors-primary: #3b82f6; --spacing-md: 8px; ... }
```

## API Reference

### `createSchema({ definition })`

Creates a type-safe schema from a definition object.

### `t` (Token Builders)

- `t.color()` - Color values (hex, rgb, rgba, hsl, hsla, named colors)
- `t.dimension()` - Dimensions with units (px, rem, em, %, vh, vw)
- `t.number()` - Numeric values
- `t.string()` - String values
- `t.boolean()` - Boolean values
- `t.fontFamily()` - Font family stacks
- `t.fontWeight()` - Font weights (100-900 or keywords)
- `t.shadow()` - Box/text shadow values
- `t.url()` - URL values

Each builder supports:

- `.default(value)` - Set a default value
- `.describe(text)` - Add documentation

### `createResolver({ schema, fetcher, cache? })`

Creates a theme resolver with caching support.

```typescript
const resolver = createResolver({
  schema,
  fetcher: async ({ themeId }) => fetchTheme(themeId),
  cache: {
    ttl: 60000,
    staleWhileRevalidate: true,
    maxSize: 100,
  },
});

// Methods
await resolver.resolve({ themeId: 'acme' }); // Get full theme
await resolver.get({ themeId: 'acme', path: 'colors.primary' }); // Get specific value
resolver.invalidate({ themeId: 'acme' }); // Invalidate cache
resolver.clearCache(); // Clear all cache
```

### Validation Functions

```typescript
import { validate, validatePartial, coerce } from '@livery/core';

// Strict validation
const result = validate({ schema, data: themeData });

// Partial validation (missing values allowed)
const partial = validatePartial({ schema, data: partialData });

// Coerce values to correct types
const coerced = coerce({ schema, data: rawData });
```

### CSS Generation

```typescript
import { toCssVariables, toCssString, toCssStringAll, cssVar, createCssVarHelper } from '@livery/core';

// Generate CSS variables object
const variables = toCssVariables({ schema, theme });

// Generate CSS string
const css = toCssString({ schema, theme, selector: ':root' });

// Generate CSS for multiple themes (static theming)
const allCss = toCssStringAll({
  schema,
  themes: { light: lightTheme, dark: darkTheme },
  defaultTheme: 'light',
});

// Generate CSS var() references
const ref = cssVar({ path: 'colors.primary' }); // 'var(--colors-primary)'

// Type-safe CSS var helper
const themeVar = createCssVarHelper({ schema });
const primary = themeVar('colors.primary'); // Typed path autocomplete
```

### Security

```typescript
import { escapeCssValue, needsCssEscaping } from '@livery/core';

// Escape potentially dangerous CSS values
const safe = escapeCssValue(userInput);

// Check if escaping is needed
if (needsCssEscaping(value)) {
  // Handle accordingly
}
```

## License

MIT
