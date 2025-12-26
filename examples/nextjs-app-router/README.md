# Next.js App Router Example

Demonstrates **multi-tenant theming with Next.js App Router** using `@livery/next` middleware.

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

**Flash prevention**: Theme is resolved on the server and CSS is injected into the initial HTML. No flash!

## Features

- **Path-based tenant detection**: `/t/acme/dashboard` → tenant "acme"
- **Middleware integration**: Uses `@livery/next` for tenant extraction
- **Server-side theming**: Theme CSS injected before first paint
- **Zero flash**: SSR ensures correct theme is visible immediately

## Quick Start

```bash
# From the repository root
pnpm install

# Run this example
cd examples/nextjs-app-router
pnpm dev
```

Then open:
- http://localhost:3000/t/acme - Acme tenant
- http://localhost:3000/t/globex - Globex tenant

## Key Files

| File | Description |
|------|-------------|
| `middleware.ts` | Tenant detection using `@livery/next` |
| `lib/schema.ts` | Theme schema definition |
| `lib/livery.ts` | Resolver and provider setup |
| `app/layout.tsx` | Root layout with theme injection |

## How It Works

### 1. Middleware extracts tenant

```typescript
// middleware.ts
import { createLiveryMiddleware } from '@livery/next/middleware';

export const middleware = createLiveryMiddleware({
  strategy: 'path',
  path: { prefix: '/t/', rewrite: true },
});
```

### 2. Layout fetches theme on server

```typescript
// app/layout.tsx
import { getThemeFromHeaders, getLiveryData } from '@livery/next';

export default async function Layout({ children }) {
  const themeId = getThemeFromHeaders({ headers: await headers() });
  const { css, theme } = await getLiveryData({ themeId, schema, resolver });

  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <DynamicThemeProvider initialThemeId={themeId} initialTheme={theme} resolver={resolver}>
          {children}
        </DynamicThemeProvider>
      </body>
    </html>
  );
}
```

## Learn More

- [Other Examples](../README.md)
- [@livery/next Documentation](../../packages/next/README.md)
