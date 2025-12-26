# @livery/next

Next.js integration for [@livery/core](../core) - multi-tenant theming for B2B SaaS applications.

## Installation

```bash
npm install @livery/next @livery/react @livery/core
# or
pnpm add @livery/next @livery/react @livery/core
```

## Features

- **Middleware** - Theme detection from subdomain, path, header, or query
- **App Router** - Server-side theme resolution with cache headers
- **Type-safe** - Full TypeScript support with inferred types

## Quick Start

### 1. Define Your Schema

```typescript
// lib/theme.ts
import { createSchema, createResolver, t } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';

export const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
  },
});

export const resolver = createResolver({
  schema,
  fetcher: async ({ themeId }) => {
    // Fetch theme from your database
    return await db.themes.findByTheme(themeId);
  },
});

export const { DynamicThemeProvider, useTheme, useThemeValue } =
  createDynamicThemeProvider({ schema });
```

### 2. Add Middleware

```typescript
// middleware.ts
import { createLiveryMiddleware } from '@livery/next/middleware';

export const middleware = createLiveryMiddleware({
  strategy: 'subdomain',
  subdomain: {
    baseDomain: 'yourapp.com',
    ignore: ['www', 'app'],
  },
  fallback: '/select-workspace',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 3. Set Up App Router Layout

```tsx
// app/layout.tsx
import { headers } from 'next/headers';
import { getLiveryData, getThemeFromHeaders } from '@livery/next';
import { DynamicThemeProvider, schema, resolver } from '@/lib/theme';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const themeId = getThemeFromHeaders({ headers: headersList }) ?? 'default';

  const { theme, css } = await getLiveryData({
    themeId,
    schema,
    resolver,
  });

  return (
    <html lang="en">
      <head>
        <style id="livery-critical" dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <DynamicThemeProvider
          themeId={themeId}
          resolver={resolver}
          initialTheme={theme}
          injection="none"
        >
          {children}
        </DynamicThemeProvider>
      </body>
    </html>
  );
}
```

## Middleware Strategies

### Subdomain

Extract theme from subdomain (e.g., `acme.yourapp.com` -> `acme`).

```typescript
createLiveryMiddleware({
  strategy: 'subdomain',
  subdomain: {
    baseDomain: 'yourapp.com',
    ignore: ['www', 'app', 'api'],
  },
});
```

### Path

Extract theme from URL path (e.g., `/t/acme/dashboard` -> `acme`).

```typescript
createLiveryMiddleware({
  strategy: 'path',
  path: {
    prefix: '/t/',
    rewrite: true, // Rewrites /t/acme/dashboard -> /dashboard
  },
});
```

### Header

Extract theme from request header.

```typescript
createLiveryMiddleware({
  strategy: 'header',
  header: {
    name: 'X-Theme-ID',
  },
});
```

### Query

Extract theme from query parameter.

```typescript
createLiveryMiddleware({
  strategy: 'query',
  query: {
    name: 'theme',
  },
});
```

### Custom

Use a custom extraction function.

```typescript
createLiveryMiddleware({
  strategy: 'custom',
  getTheme: async ({ request }) => {
    const subdomain = request.headers.get('host')?.split('.')[0];
    return { themeId: subdomain ?? null };
  },
});
```

## Validation

Validate theme exists before allowing access.

```typescript
createLiveryMiddleware({
  strategy: 'subdomain',
  validate: async ({ themeId }) => {
    return await db.themes.exists(themeId);
  },
  fallback: '/404',
});
```

## Cache Headers

Set appropriate cache headers for theme responses.

```typescript
// app/api/theme/[themeId]/route.ts
import { getCacheHeaders } from '@livery/next';

export async function GET(request: Request) {
  const theme = await resolver.resolve({ themeId });

  return Response.json(theme, {
    headers: getCacheHeaders({
      maxAge: 300,
      staleWhileRevalidate: 3600,
    }),
  });
}
```

## API Reference

### `createLiveryMiddleware(options)`

Creates a Next.js middleware function for theme detection.

| Option        | Type                                              | Description                          |
| ------------- | ------------------------------------------------- | ------------------------------------ |
| `strategy`    | `'subdomain' \| 'path' \| 'header' \| 'query' \| 'custom'` | Theme extraction strategy  |
| `subdomain`   | `{ baseDomain, ignore? }`                         | Subdomain strategy options           |
| `path`        | `{ prefix, rewrite? }`                            | Path strategy options                |
| `header`      | `{ name }`                                        | Header strategy options              |
| `query`       | `{ name }`                                        | Query strategy options               |
| `getTheme`    | `({ request }) => { themeId, rewritePath? }`      | Custom extraction function           |
| `validate`    | `({ themeId }) => Promise<boolean>`               | Theme validation function            |
| `fallback`    | `string`                                          | Redirect path when theme not found   |
| `themeHeader` | `string`                                          | Header name for theme ID (default: 'x-livery-theme') |
| `skipPaths`   | `string[]`                                        | Paths to skip middleware processing  |

### `getLiveryData({ themeId, schema, resolver, cssOptions? })`

Resolves theme data on the server for App Router.

Returns: `{ theme, css, themeId }`

### `getThemeFromHeaders({ headers, headerName? })`

Get the theme ID from request headers set by middleware.

### `getCacheHeaders(options?)`

Generate cache headers for theme responses.

| Option                  | Type     | Default | Description                    |
| ----------------------- | -------- | ------- | ------------------------------ |
| `maxAge`                | `number` | 300     | Cache max-age in seconds       |
| `staleWhileRevalidate`  | `number` | 3600    | SWR duration in seconds        |
| `private`               | `boolean`| false   | Use private cache directive    |

## License

MIT
