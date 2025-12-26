# React + Tailwind Example

Demonstrates **Livery integration with Tailwind CSS** using CSS variables.

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

**Note**: This quadrant has a loading state while themes load. For flash-free dynamic themes with Tailwind, use SSR.

## Features

- **Tailwind v4 integration**: Maps Livery CSS variables to Tailwind theme
- **Dynamic themes**: Switch between startup, enterprise, and creative themes
- **Semantic classes**: Use `bg-primary`, `text-primary`, etc.
- **Typography & spacing**: Full design token support

## Quick Start

```bash
# From the repository root
pnpm install

# Run this example
cd examples/react-tailwind
pnpm dev
```

Then open http://localhost:3000

## Key Files

| File | Description |
|------|-------------|
| `src/index.css` | Tailwind config with Livery CSS variables |
| `src/livery.ts` | Resolver and provider setup |
| `src/schema.ts` | Theme schema definition |
| `src/App.tsx` | Main app using Tailwind classes |

## How It Works

### 1. Define schema with design tokens

```typescript
const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    border: {
      radius: {
        sm: t.dimension().default('4px'),
        md: t.dimension().default('8px'),
        lg: t.dimension().default('16px'),
      },
    },
  },
});
```

### 2. Map to Tailwind in CSS

```css
@import 'tailwindcss';

@theme {
  --color-primary: var(--brand-primary);
  --color-secondary: var(--brand-secondary);
  --radius-sm: var(--border-radius-sm);
  --radius-md: var(--border-radius-md);
  --radius-lg: var(--border-radius-lg);
}
```

### 3. Use Tailwind classes

```tsx
<button className="bg-primary text-white rounded-md px-4 py-2">
  Click me
</button>
```

When the theme changes, CSS variables update and Tailwind classes automatically reflect the new values!

## Learn More

- [Other Examples](../README.md)
- [Tailwind Integration Guide](../../apps/docs/content/integrations/tailwind-v4.mdx)
