# React SSR Example

Demonstrates **server-side rendering with dynamic themes** using React and Vite SSR.

## Usage Matrix

This example demonstrates: **Dynamic + SSR**

```
                    │ CSR             │ SSR
────────────────────┼─────────────────┼─────────────────
  Static Themes     │                 │
────────────────────┼─────────────────┼─────────────────
  Dynamic Themes    │                 │  ✅ THIS
────────────────────┴─────────────────┴─────────────────
```

**Flash prevention**: Theme is resolved on the server and CSS is rendered into the initial HTML. No flash!

## Features

- **Server-side theme resolution**: Theme fetched before rendering
- **Zero flash**: CSS injected into SSR response
- **Hydration**: Client picks up server-rendered state
- **Framework-agnostic**: Works with any SSR setup (not just Next.js)

## Quick Start

```bash
# From the repository root
pnpm install

# Run this example
cd examples/react-ssr
pnpm dev
```

Then open http://localhost:3000

## Key Files

| File | Description |
|------|-------------|
| `src/entry-server.tsx` | Server-side rendering entry |
| `src/entry-client.tsx` | Client-side hydration entry |
| `src/livery.ts` | Resolver and provider setup |
| `src/schema.ts` | Theme schema definition |
| `src/App.tsx` | Main React application |

## How It Works

### 1. Server resolves theme

```typescript
// entry-server.tsx
const theme = await resolver.resolve({ themeId });
const css = toCssString({ schema, theme });
```

### 2. Server renders with CSS

```typescript
const html = `
  <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      <div id="app">${appHtml}</div>
    </body>
  </html>
`;
```

### 3. Client hydrates with initial theme

```typescript
// entry-client.tsx
<DynamicThemeProvider initialThemeId={themeId} initialTheme={initialTheme} resolver={resolver}>
  <App />
</DynamicThemeProvider>
```

## Learn More

- [Other Examples](../README.md)
- [@livery/react Documentation](../../packages/react/README.md)
