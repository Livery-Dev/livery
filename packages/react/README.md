# @livery/react

React bindings for `@livery/core` - type-safe multi-tenant theming for B2B SaaS applications.

## Installation

```bash
npm install @livery/core @livery/react
# or
pnpm add @livery/core @livery/react
```

## Two Provider Types

- **`createDynamicThemeProvider`** - For runtime-fetched themes (multi-tenant, API-driven)
- **`createStaticThemeProvider`** - For bundled themes (light/dark mode) with instant switching

## Dynamic Themes (Multi-Tenant)

Use this for themes fetched at runtime from an API or database.

```tsx
// 1. Define your schema (schema.ts)
import { createSchema, t } from '@livery/core';

export const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    spacing: {
      md: t.dimension().default('16px'),
    },
  },
});

// 2. Create resolver and typed provider (theme.ts)
import { createResolver } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';
import { schema } from './schema';

export const resolver = createResolver({
  schema,
  fetcher: async ({ themeId }) => {
    const res = await fetch(`/api/themes/${themeId}`);
    return res.json();
  },
});

export const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady } =
  createDynamicThemeProvider({ schema });

// 3. Use in your app (App.tsx)
import { DynamicThemeProvider, useTheme, useThemeValue, resolver } from './theme';

function App() {
  return (
    <DynamicThemeProvider initialThemeId="acme" resolver={resolver} fallback={<Loading />}>
      <MyComponent />
    </DynamicThemeProvider>
  );
}

function MyComponent() {
  // Full type inference and autocomplete!
  const primary = useThemeValue('brand.primary');
  const { theme, isLoading, error, setThemeId } = useTheme();

  return <button style={{ backgroundColor: primary }}>Click me</button>;
}
```

## Static Themes (Light/Dark Mode)

Use this for bundled themes where all CSS is pre-generated.

```tsx
// 1. Generate CSS and init script (theme.ts)
import { createSchema, t, toCssStringAll } from '@livery/core';
import { createStaticThemeProvider, getThemeInitScript } from '@livery/react';

const schema = createSchema({
  definition: {
    colors: {
      background: t.color(),
      text: t.color(),
    },
  },
});

const themes = {
  light: { colors: { background: '#ffffff', text: '#000000' } },
  dark: { colors: { background: '#0f172a', text: '#f8fafc' } },
};

// CSS for all themes
export const css = toCssStringAll({
  schema,
  themes,
  defaultTheme: 'light',
});

// Init script (prevents flash)
export const initScript = getThemeInitScript({
  themes: ['light', 'dark'],
  defaultTheme: 'light',
});

// Provider and hook
export const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
  themes: ['light', 'dark'] as const,
  defaultTheme: 'light',
});

// 2. In your layout
function Layout({ children }) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <StaticThemeProvider>{children}</StaticThemeProvider>
      </body>
    </html>
  );
}

// 3. Use the theme
function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}
```

## API Reference

### `createDynamicThemeProvider({ schema })`

Creates typed provider and hooks for runtime-fetched themes.

**Returns:**

- `DynamicThemeProvider` - React context provider component
- `useTheme()` - Hook for full theme access
- `useThemeValue(path)` - Hook for individual token access
- `useThemeReady()` - Hook to check if theme is loaded
- `ThemeContext` - Underlying context (for advanced use)

### `DynamicThemeProvider`

| Prop           | Type                                | Required | Description                                     |
| -------------- | ----------------------------------- | -------- | ----------------------------------------------- |
| `themeId`      | `string`                            | Yes      | Theme identifier for resolution                 |
| `resolver`     | `ThemeResolver`                     | Yes      | Resolver from `@livery/core`                    |
| `initialTheme` | `InferTheme<T>`                     | No       | Pre-resolved theme for SSR                      |
| `fallback`     | `ReactNode`                         | No       | Loading fallback UI                             |
| `onError`      | `(error: Error) => void`            | No       | Error callback                                  |
| `injection`    | `'style-tag' \| 'inline' \| 'none'` | No       | CSS injection strategy (default: `'style-tag'`) |
| `cssOptions`   | `CssVariableOptions`                | No       | CSS variable prefix/separator options           |

### `useTheme()`

Hook to access full theme context.

```tsx
const {
  theme,        // Resolved theme (typed) | null
  themeId,      // Current theme ID
  setThemeId,   // Change theme ID (triggers fetch)
  state,        // Discriminated union state machine
  isIdle,       // state.status === 'idle'
  isLoading,    // state.status === 'loading'
  isReady,      // state.status === 'ready'
  isError,      // state.status === 'error'
  error,        // Error | null
  cssVariables, // CSS variables object
  refresh,      // Manual refresh function
} = useTheme();
```

### `useThemeValue(path)`

Hook to access individual theme tokens with full type inference.

```tsx
const primary = useThemeValue('brand.primary'); // string
const spacing = useThemeValue('spacing.md'); // string
```

### `createStaticThemeProvider({ themes, defaultTheme })`

Creates typed provider and hook for bundled static themes.

**Returns:**

- `StaticThemeProvider` - React context provider component
- `useTheme()` - Hook for theme access
- `ThemeContext` - Underlying context (for advanced use)

### `StaticThemeProvider`

| Prop           | Type                                      | Required | Description                              |
| -------------- | ----------------------------------------- | -------- | ---------------------------------------- |
| `children`     | `ReactNode`                               | Yes      | Child components                         |
| `initialTheme` | `TThemes[number]`                         | No       | Initial theme for SSR                    |
| `persist`      | `'localStorage' \| 'cookie' \| 'none'`    | No       | Persistence strategy (default: 'localStorage') |
| `storageKey`   | `string`                                  | No       | Storage key name (default: 'theme')      |
| `attribute`    | `string`                                  | No       | DOM attribute to sync (default: 'data-theme') |

### `getThemeInitScript({ themes, defaultTheme, storageKey?, attribute? })`

Generates a script to prevent flash of unstyled content.

## CSS Variables

The `DynamicThemeProvider` automatically injects CSS variables into the document:

```css
.button {
  background: var(--brand-primary);
  padding: var(--spacing-md);
}
```

### Injection Modes

- `'style-tag'` (default): Injects a `<style>` tag in document head
- `'inline'`: Applies as inline styles to a wrapper div
- `'none'`: No automatic injection - use `cssVariables` from `useTheme()`

## SSR Support

For server-side rendering, use the `/server` export:

```tsx
import { getLiveryServerProps, LiveryScript } from '@livery/react/server';

// In your server data fetching
export async function getServerSideProps() {
  const liveryProps = await getLiveryServerProps({
    schema,
    themeId: 'acme',
    resolver,
  });

  return { props: { liveryProps } };
}

// In your document/layout
function Document({ liveryProps }) {
  return (
    <html>
      <head>
        <LiveryScript css={liveryProps.css} />
      </head>
      <body>
        <DynamicThemeProvider
          themeId={liveryProps.themeId}
          resolver={resolver}
          initialTheme={liveryProps.initialTheme}
        >
          <App />
        </DynamicThemeProvider>
      </body>
    </html>
  );
}
```

## TypeScript

Full type inference is provided. Path autocomplete works in `useThemeValue`:

```tsx
const value = useThemeValue('brand.primary'); // TypeScript knows this is a string
const invalid = useThemeValue('invalid.path'); // TypeScript error!
```

## Requirements

- React 18+
- @livery/core

## License

MIT
