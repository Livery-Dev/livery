/**
 * Type definitions for @livery/next
 */

import type { NextRequest, NextResponse } from 'next/server';
import type {
  Schema,
  SchemaDefinition,
  InferTheme,
  ThemeResolver,
  CssVariableOptions,
} from '@livery/core';

// =============================================================================
// Middleware Types
// =============================================================================

/**
 * Strategy for extracting theme ID from the request
 */
export type ThemeStrategy = 'subdomain' | 'path' | 'header' | 'query' | 'custom';

/**
 * Result from theme extraction
 */
export interface ThemeExtractionResult {
  /** The extracted theme ID, or null if not found */
  readonly themeId: string | null;
  /** Optional path rewrite (for path-based themes) */
  readonly rewritePath?: string;
}

/**
 * Custom theme extraction function
 */
export type ThemeExtractor = (
  params: { request: NextRequest }
) => ThemeExtractionResult | Promise<ThemeExtractionResult>;

/**
 * Options for subdomain-based theme extraction
 */
export interface SubdomainOptions {
  /** Base domain to extract subdomain from (e.g., 'yourapp.com') */
  readonly baseDomain?: string;
  /** Subdomains to ignore (e.g., ['www', 'app']) */
  readonly ignore?: readonly string[];
}

/**
 * Options for path-based theme extraction
 */
export interface PathOptions {
  /** Path prefix for theme (e.g., '/t/' means /t/acme/dashboard) */
  readonly prefix?: string;
  /** Whether to rewrite the path to remove the theme prefix */
  readonly rewrite?: boolean;
}

/**
 * Options for header-based theme extraction
 */
export interface HeaderOptions {
  /** Header name to extract theme from */
  readonly name: string;
}

/**
 * Options for query-based theme extraction
 */
export interface QueryOptions {
  /** Query parameter name to extract theme from */
  readonly name: string;
}

/**
 * Options for createLiveryMiddleware
 */
export interface CreateLiveryMiddlewareOptions {
  /**
   * Theme extraction strategy or custom function.
   *
   * Built-in strategies:
   * - 'subdomain': Extract from subdomain (acme.yourapp.com → 'acme')
   * - 'path': Extract from path (/t/acme/dashboard → 'acme')
   * - 'header': Extract from header (X-Theme-ID: acme)
   * - 'query': Extract from query param (?theme=acme)
   * - 'custom': Use getTheme function
   *
   * Or provide a custom extraction function.
   */
  readonly strategy?: ThemeStrategy | ThemeExtractor;

  /**
   * Custom function to extract theme from request.
   * Required when strategy is 'custom', optional otherwise.
   */
  readonly getTheme?: ThemeExtractor;

  /**
   * Options for subdomain strategy
   */
  readonly subdomain?: SubdomainOptions;

  /**
   * Options for path strategy
   */
  readonly path?: PathOptions;

  /**
   * Options for header strategy
   */
  readonly header?: HeaderOptions;

  /**
   * Options for query strategy
   */
  readonly query?: QueryOptions;

  /**
   * Fallback path to redirect to when no theme is found.
   * If not provided, the request continues without a theme.
   */
  readonly fallback?: string;

  /**
   * Optional validation function to check if theme exists.
   * Return true if valid, false to trigger fallback.
   */
  readonly validate?: (params: { themeId: string }) => boolean | Promise<boolean>;

  /**
   * Header name to set the theme ID on the request.
   * Defaults to 'x-livery-theme'.
   */
  readonly themeHeader?: string;

  /**
   * Paths to skip middleware processing for.
   * Defaults to common static paths.
   */
  readonly skipPaths?: readonly string[];
}

/**
 * Livery middleware function type
 */
export type LiveryMiddleware = (
  request: NextRequest
) => Promise<NextResponse | undefined> | NextResponse | undefined;

// =============================================================================
// App Router Types
// =============================================================================

/**
 * Options for getLiveryData (server-side theme resolution)
 */
export interface GetLiveryDataOptions<T extends SchemaDefinition> {
  /** The schema defining the theme structure */
  readonly schema: Schema<T>;
  /** Theme resolver from @livery/core */
  readonly resolver: ThemeResolver<T>;
  /** CSS variable options (prefix, separator, etc.) */
  readonly cssOptions?: CssVariableOptions;
}

/**
 * Return type of getLiveryData
 */
export interface LiveryData<T extends SchemaDefinition> {
  /** Pre-resolved theme */
  readonly theme: InferTheme<T>;
  /** CSS string for critical styles */
  readonly css: string;
  /** Theme ID */
  readonly themeId: string;
}

/**
 * Options for creating a cached resolver
 */
export interface CachedResolverOptions<T extends SchemaDefinition> {
  /** The underlying resolver */
  readonly resolver: ThemeResolver<T>;
  /** Cache duration in seconds */
  readonly revalidate?: number;
  /** Tags for cache invalidation */
  readonly tags?: readonly string[];
}

// =============================================================================
// Headers Types
// =============================================================================

/**
 * Options for cache headers
 */
export interface CacheHeaderOptions {
  /**
   * Cache-Control max-age in seconds.
   * Defaults to 60.
   */
  readonly maxAge?: number;

  /**
   * Stale-while-revalidate duration in seconds.
   * Defaults to 600.
   */
  readonly staleWhileRevalidate?: number;

  /**
   * Whether to set public or private cache.
   * Defaults to 'public'.
   */
  readonly scope?: 'public' | 'private';

  /**
   * Additional Vary headers.
   */
  readonly vary?: readonly string[];
}
