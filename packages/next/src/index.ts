/**
 * @livery/next
 *
 * Next.js integration for @livery/core - theming for web applications.
 * Provides middleware for theme detection, App Router utilities, and cache headers.
 *
 * For the React provider and hooks, import from '@livery/react'.
 * For SSR utilities, import from '@livery/react/server'.
 */

// Main exports
export { getLiveryData, getCacheHeaders, getThemeFromHeaders } from './app-router/index.js';

// Middleware exports (also available via @livery/next/middleware)
export { createLiveryMiddleware } from './middleware/index.js';

// Types
export type {
  // Middleware types
  ThemeStrategy,
  ThemeExtractionResult,
  ThemeExtractor,
  SubdomainOptions,
  PathOptions,
  HeaderOptions,
  QueryOptions,
  CreateLiveryMiddlewareOptions,
  LiveryMiddleware,
  // App Router types
  GetLiveryDataOptions,
  LiveryData,
  CachedResolverOptions,
  CacheHeaderOptions,
} from './types/index.js';
