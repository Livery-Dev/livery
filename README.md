# Livery

Type-safe theming for TypeScript applications. From simple dark mode to multi-tenant SaaS.

[![CI](https://github.com/Livery-Dev/livery/actions/workflows/ci.yml/badge.svg)](https://github.com/Livery-Dev/livery/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@livery/core.svg)](https://www.npmjs.com/package/@livery/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Full TypeScript inference** - Autocomplete and type checking for all theme tokens
- **Schema validation** - Invalid themes get rejected at compile time
- **Zero runtime overhead** - CSS variables, no JavaScript at runtime
- **Framework agnostic** - Works with React, Next.js, Vue, or vanilla JS
- **Scales to any use case** - From light/dark mode to multi-tenant white-label apps

## Installation

```bash
# Core package (vanilla JS, any framework)
npm install @livery/core

# React bindings
npm install @livery/react

# Next.js integration
npm install @livery/next
```

## Quick Start

### 1. Define your schema

```typescript
import { createSchema, t, toCssStringAll, type InferTheme } from '@livery/core';

const schema = createSchema({
  definition: {
    colors: {
      primary: t.color(),
      background: t.color(),
      text: t.color(),
    },
  },
});

type Theme = InferTheme<typeof schema.definition>;
```

### 2. Create your themes

```typescript
const light: Theme = {
  colors: {
    primary: '#3B82F6',
    background: '#FFFFFF',
    text: '#0F172A',
  },
};

const dark: Theme = {
  colors: {
    primary: '#60A5FA',
    background: '#0F172A',
    text: '#F1F5F9',
  },
};
```

### 3. Generate CSS

```typescript
const css = toCssStringAll({
  schema,
  themes: { light, dark },
  defaultTheme: 'light',
});

// Output:
// :root, [data-theme="light"] { --colors-primary: #3B82F6; ... }
// [data-theme="dark"] { --colors-primary: #60A5FA; ... }
```

### 4. Use in your styles

```css
/* Tailwind v4 */
@theme {
  --color-primary: var(--colors-primary);
  --color-bg: var(--colors-background);
}

/* Or vanilla CSS */
.button {
  background: var(--colors-primary);
  color: white;
}
```

### 5. Switch themes

```typescript
// Just change the data attribute - no CSS regeneration needed!
document.documentElement.dataset.theme = 'dark';
```

## Packages

| Package | Description |
|---------|-------------|
| [`@livery/core`](./packages/core) | Schema definition, validation, and CSS utilities |
| [`@livery/react`](./packages/react) | React hooks and providers |
| [`@livery/next`](./packages/next) | Next.js App Router integration with SSR support |

## Documentation

Visit [livery.dev/docs](https://livery.dev/docs) for full documentation.

- [Quick Start](https://livery.dev/docs/quick-start)
- [Schema & Tokens](https://livery.dev/docs/core/schema)
- [React Integration](https://livery.dev/docs/react)
- [Next.js Integration](https://livery.dev/docs/next)
- [Tailwind CSS v4](https://livery.dev/docs/integrations/tailwind-v4)

## Examples

Check out the [`examples/`](./examples) directory for working examples:

- `light-dark-static` - Simple light/dark mode with vanilla JS
- `react-dark-mode` - React with theme toggle
- `react-tailwind` - React + Tailwind CSS v4
- `nextjs-app-router` - Next.js App Router with SSR
- `async-themes` - Dynamic themes from API

## Security

Livery is designed with security in mind for multi-tenant environments:

- **Input validation** - All theme values are validated (colors, URLs, dimensions)
- **URL sanitization** - Blocks `javascript:`, `vbscript:`, dangerous data URLs
- **CSS injection prevention** - Special characters are escaped in CSS output
- **CSP support** - Nonce-based style injection for strict Content Security Policies
- **Secure cookies** - Auto-enabled `Secure` flag, configurable `SameSite`

See [docs/SECURITY.md](./docs/SECURITY.md) for full security documentation.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](./LICENSE) for details.
