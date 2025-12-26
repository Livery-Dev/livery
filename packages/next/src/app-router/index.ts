/**
 * App Router utilities for @livery/next
 */

import { toCssString } from '@livery/core';
import type { SchemaDefinition } from '@livery/core';
import type { GetLiveryDataOptions, LiveryData, CacheHeaderOptions } from '../types/index.js';

/**
 * Default cache header options
 */
const DEFAULT_CACHE_OPTIONS: Required<CacheHeaderOptions> = {
  maxAge: 60,
  staleWhileRevalidate: 600,
  scope: 'public',
  vary: ['x-livery-theme'],
};

/**
 * Resolves theme data on the server for App Router.
 *
 * Use this in Server Components or Route Handlers to pre-resolve
 * the theme and generate critical CSS.
 *
 * @param options - Configuration options including themeId
 * @returns Promise resolving to LiveryData containing theme, css, and themeId
 *
 * @example
 * ```tsx
 * // app/[themeId]/layout.tsx
 * import { getLiveryData } from '@livery/next';
 * import { schema, resolver } from '@/lib/livery';
 *
 * export default async function Layout({
 *   children,
 *   params,
 * }: {
 *   children: React.ReactNode;
 *   params: Promise<{ themeId: string }>;
 * }) {
 *   const { themeId } = await params;
 *   const { theme, css } = await getLiveryData({
 *     themeId,
 *     schema,
 *     resolver,
 *   });
 *
 *   return (
 *     <html>
 *       <head>
 *         <style id="livery-critical" dangerouslySetInnerHTML={{ __html: css }} />
 *       </head>
 *       <body>
 *         <LiveryProvider
 *           themeId={themeId}
 *           resolver={resolver}
 *           initialTheme={theme}
 *         >
 *           {children}
 *         </LiveryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export async function getLiveryData<T extends SchemaDefinition>(
  options: GetLiveryDataOptions<T> & { themeId: string }
): Promise<LiveryData<T>> {
  const { themeId, schema, resolver, cssOptions } = options;

  // Resolve theme on server
  const theme = await resolver.resolve({ themeId });

  // Generate CSS string
  const css = cssOptions
    ? toCssString({ schema, theme, options: cssOptions })
    : toCssString({ schema, theme });

  return {
    theme,
    css,
    themeId,
  };
}

/**
 * Generate cache headers for theme responses.
 *
 * Use this in Route Handlers to set appropriate caching headers
 * for theme data responses.
 *
 * @param options - Cache header options
 * @returns Headers object
 *
 * @example
 * ```typescript
 * // app/api/theme/[themeId]/route.ts
 * import { getCacheHeaders } from '@livery/next';
 * import { resolver } from '@/lib/livery';
 *
 * export async function GET(
 *   request: Request,
 *   { params }: { params: Promise<{ themeId: string }> }
 * ) {
 *   const { themeId } = await params;
 *   const theme = await resolver.resolve({ themeId });
 *
 *   return Response.json(theme, {
 *     headers: getCacheHeaders({ maxAge: 300 }),
 *   });
 * }
 * ```
 */
export function getCacheHeaders(options: CacheHeaderOptions = {}): Headers {
  const merged = { ...DEFAULT_CACHE_OPTIONS, ...options };
  const headers = new Headers();

  // Set Cache-Control
  const directives = [
    merged.scope,
    `max-age=${merged.maxAge}`,
    `stale-while-revalidate=${merged.staleWhileRevalidate}`,
  ];
  headers.set('Cache-Control', directives.join(', '));

  // Set Vary header
  if (merged.vary.length > 0) {
    headers.set('Vary', merged.vary.join(', '));
  }

  return headers;
}

/**
 * Get the theme ID from request headers.
 *
 * Use this in Server Components or Route Handlers to retrieve
 * the theme ID set by the middleware.
 *
 * @param options - Options containing headers and optional headerName
 * @returns The theme ID or null
 *
 * @example
 * ```typescript
 * // app/dashboard/page.tsx
 * import { headers } from 'next/headers';
 * import { redirect } from 'next/navigation';
 * import { getThemeFromHeaders } from '@livery/next';
 *
 * export default async function DashboardPage() {
 *   const headersList = await headers();
 *   const themeId = getThemeFromHeaders({ headers: headersList });
 *
 *   if (!themeId) {
 *     redirect('/select-workspace');
 *   }
 *
 *   // Use themeId...
 * }
 * ```
 */
export function getThemeFromHeaders(
  options: { headers: Headers; headerName?: string }
): string | null {
  const { headers, headerName = 'x-livery-theme' } = options;
  return headers.get(headerName);
}

/**
 * Get the CSP nonce from request headers.
 *
 * Use this in Server Components to retrieve the CSP nonce for
 * style injection with strict Content Security Policies.
 *
 * @param options - Options containing headers and optional headerName
 * @returns The nonce string or undefined
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { headers } from 'next/headers';
 * import { getNonce, getLiveryData } from '@livery/next';
 * import { LiveryScript } from '@livery/react/server';
 *
 * export default async function Layout({ children }) {
 *   const headersList = await headers();
 *   const nonce = getNonce({ headers: headersList });
 *   const { css, theme } = await getLiveryData({ ... });
 *
 *   return (
 *     <html>
 *       <head>
 *         <LiveryScript css={css} nonce={nonce} />
 *       </head>
 *       <body>
 *         <DynamicThemeProvider nonce={nonce} ...>
 *           {children}
 *         </DynamicThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function getNonce(
  options: { headers: Headers; headerName?: string }
): string | undefined {
  const { headers, headerName = 'x-nonce' } = options;
  return headers.get(headerName) ?? undefined;
}
