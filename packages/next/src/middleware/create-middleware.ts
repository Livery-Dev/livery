/**
 * Create Livery middleware for Next.js
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type {
  CreateLiveryMiddlewareOptions,
  LiveryMiddleware,
  ThemeExtractor,
} from '../types/index.js';
import { createThemeExtractor } from './tenant-extraction.js';

/**
 * Default paths to skip middleware processing
 */
const DEFAULT_SKIP_PATHS = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

/**
 * Creates a Next.js middleware function for theme detection.
 *
 * The middleware extracts the theme ID from the request and sets it
 * on a header for downstream use. It supports multiple extraction strategies:
 * - subdomain: Extract from subdomain (acme.yourapp.com)
 * - path: Extract from URL path (/t/acme/dashboard)
 * - header: Extract from request header (X-Theme-ID)
 * - query: Extract from query parameter (?theme=acme)
 * - custom: Use a custom extraction function
 *
 * @param options - Configuration options
 * @returns Next.js middleware function
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { createLiveryMiddleware } from '@livery/next/middleware';
 *
 * export const middleware = createLiveryMiddleware({
 *   strategy: 'subdomain',
 *   subdomain: {
 *     baseDomain: 'yourapp.com',
 *     ignore: ['www', 'app'],
 *   },
 *   fallback: '/select-workspace',
 * });
 *
 * export const config = {
 *   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Path-based theme extraction
 * export const middleware = createLiveryMiddleware({
 *   strategy: 'path',
 *   path: {
 *     prefix: '/t/',
 *     rewrite: true,
 *   },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Custom extraction with validation
 * export const middleware = createLiveryMiddleware({
 *   strategy: 'custom',
 *   getTheme: ({ request }) => {
 *     const subdomain = request.headers.get('host')?.split('.')[0];
 *     return { themeId: subdomain ?? null };
 *   },
 *   validate: async ({ themeId }) => {
 *     return await db.themes.exists(themeId);
 *   },
 *   fallback: '/404',
 * });
 * ```
 */
export function createLiveryMiddleware(options: CreateLiveryMiddlewareOptions): LiveryMiddleware {
  const {
    strategy = 'subdomain',
    getTheme,
    subdomain,
    path,
    header,
    query,
    fallback,
    validate,
    themeHeader = 'x-livery-theme',
    skipPaths = DEFAULT_SKIP_PATHS,
  } = options;

  // Create the theme extractor
  let extractor: ThemeExtractor;

  if (typeof strategy === 'function') {
    extractor = strategy;
  } else {
    extractor = createThemeExtractor(strategy, {
      subdomain,
      path,
      header,
      query,
      getTheme,
    });
  }

  return async function liveryMiddleware(request: NextRequest): Promise<NextResponse | undefined> {
    const { pathname } = request.nextUrl;

    // Skip processing for configured paths
    if (skipPaths.some((p) => pathname.startsWith(p))) {
      return undefined;
    }

    // Extract theme from request
    const result = await extractor({ request });
    const { themeId, rewritePath } = result;

    // No theme found
    if (!themeId) {
      if (fallback) {
        // Redirect to fallback path
        const url = request.nextUrl.clone();
        url.pathname = fallback;
        return NextResponse.redirect(url);
      }
      // Continue without theme
      return undefined;
    }

    // Validate theme if validator provided
    if (validate) {
      const isValid = await validate({ themeId });
      if (!isValid) {
        if (fallback) {
          const url = request.nextUrl.clone();
          url.pathname = fallback;
          return NextResponse.redirect(url);
        }
        return undefined;
      }
    }

    // Create response with theme header
    let response: NextResponse;

    if (rewritePath) {
      // Rewrite the path (for path-based themes)
      const url = request.nextUrl.clone();
      url.pathname = rewritePath;
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }

    // Set theme header for downstream use
    response.headers.set(themeHeader, themeId);

    return response;
  };
}
