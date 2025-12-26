/**
 * Theme extraction strategies for Next.js middleware
 */

import type { NextRequest } from 'next/server';
import type {
  ThemeExtractor,
  ThemeExtractionResult,
  SubdomainOptions,
  PathOptions,
  HeaderOptions,
  QueryOptions,
} from '../types/index.js';

/**
 * Extract theme from subdomain
 *
 * @example
 * // acme.yourapp.com → 'acme'
 * // www.yourapp.com → null (ignored)
 */
export function extractFromSubdomain(
  request: NextRequest,
  options: SubdomainOptions = {}
): ThemeExtractionResult {
  const { ignore = ['www', 'app', 'api'] } = options;
  const host = request.headers.get('host') ?? '';

  // Extract subdomain
  const parts = host.split('.');

  // Need at least 3 parts for a subdomain (subdomain.domain.tld)
  if (parts.length < 3) {
    return { themeId: null };
  }

  // Check if using base domain
  if (options.baseDomain) {
    const baseParts = options.baseDomain.split('.');
    // Remove base domain parts from the end
    const subdomainParts = parts.slice(0, parts.length - baseParts.length);

    if (subdomainParts.length === 0) {
      return { themeId: null };
    }

    const subdomain = subdomainParts[0];
    if (subdomain && !ignore.includes(subdomain)) {
      return { themeId: subdomain };
    }
  } else {
    // Use first part as subdomain
    const subdomain = parts[0];
    if (subdomain && !ignore.includes(subdomain)) {
      return { themeId: subdomain };
    }
  }

  return { themeId: null };
}

/**
 * Extract theme from path
 *
 * @example
 * // /t/acme/dashboard → 'acme' (with prefix '/t/')
 * // /acme/dashboard → 'acme' (without prefix)
 */
export function extractFromPath(
  request: NextRequest,
  options: PathOptions = {}
): ThemeExtractionResult {
  const { prefix = '/t/', rewrite = true } = options;
  const pathname = request.nextUrl.pathname;

  // Check if path starts with prefix
  if (prefix && pathname.startsWith(prefix)) {
    const afterPrefix = pathname.slice(prefix.length);
    const parts = afterPrefix.split('/');
    const themeId = parts[0];

    if (themeId) {
      // Calculate rewrite path (remove prefix and theme)
      const rewritePath = rewrite ? '/' + parts.slice(1).join('/') : undefined;
      return { themeId, rewritePath };
    }
  }

  return { themeId: null };
}

/**
 * Extract theme from header
 *
 * @example
 * // X-Theme-ID: acme → 'acme'
 */
export function extractFromHeader(
  request: NextRequest,
  options: HeaderOptions
): ThemeExtractionResult {
  const themeId = request.headers.get(options.name);
  return { themeId: themeId ?? null };
}

/**
 * Extract theme from query parameter
 *
 * @example
 * // ?theme=acme → 'acme'
 */
export function extractFromQuery(
  request: NextRequest,
  options: QueryOptions
): ThemeExtractionResult {
  const themeId = request.nextUrl.searchParams.get(options.name);
  return { themeId: themeId ?? null };
}

/**
 * Create a theme extractor based on strategy and options
 */
export function createThemeExtractor(
  strategy: 'subdomain' | 'path' | 'header' | 'query' | 'custom',
  options: {
    subdomain?: SubdomainOptions;
    path?: PathOptions;
    header?: HeaderOptions;
    query?: QueryOptions;
    getTheme?: ThemeExtractor;
  }
): ThemeExtractor {
  switch (strategy) {
    case 'subdomain':
      return ({ request }) => extractFromSubdomain(request, options.subdomain);

    case 'path':
      return ({ request }) => extractFromPath(request, options.path);

    case 'header':
      if (!options.header) {
        throw new Error('Header options required for header strategy');
      }
      return ({ request }) => extractFromHeader(request, options.header!);

    case 'query':
      if (!options.query) {
        throw new Error('Query options required for query strategy');
      }
      return ({ request }) => extractFromQuery(request, options.query!);

    case 'custom':
      if (!options.getTheme) {
        throw new Error('getTheme function required for custom strategy');
      }
      return options.getTheme;

    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
}
