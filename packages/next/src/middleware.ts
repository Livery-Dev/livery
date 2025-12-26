/**
 * @livery/next/middleware
 *
 * Middleware utilities for theme detection in Next.js.
 */

export {
  createLiveryMiddleware,
  extractFromSubdomain,
  extractFromPath,
  extractFromHeader,
  extractFromQuery,
  createThemeExtractor,
} from './middleware/index.js';

export type {
  ThemeStrategy,
  ThemeExtractionResult,
  ThemeExtractor,
  SubdomainOptions,
  PathOptions,
  HeaderOptions,
  QueryOptions,
  CreateLiveryMiddlewareOptions,
  LiveryMiddleware,
} from './types/index.js';
