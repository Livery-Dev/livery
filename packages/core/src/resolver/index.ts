/**
 * Theme resolver with caching
 */

import type {
  Schema,
  SchemaDefinition,
  InferTheme,
  ThemePath,
  PathValue,
  ThemeResolver,
  CacheConfig,
  TokenDefinition,
} from '../types/index.js';
import { getSchemaDefinition, isTokenDefinition, isSchemaDefinition } from '../schema/index.js';
import { coerce } from '../validation/index.js';
import { deepMerge, getAtPath, createLRUCache } from '../internal/utils.js';

/**
 * Options for createResolver function
 *
 * @typeParam T - The type of the schema definition
 *
 * @public
 */
export interface CreateResolverOptions<T extends SchemaDefinition> {
  /** The schema to validate theme data against */
  schema: Schema<T>;
  /** Function that fetches theme data for a given theme ID */
  fetcher: (params: { themeId: string }) => Promise<Partial<InferTheme<T>>> | Partial<InferTheme<T>>;
  /** Optional cache configuration */
  cache?: CacheConfig;
}

/**
 * Cache entry with metadata
 *
 * @typeParam T - The type of the cached data
 *
 * @internal
 */
interface CacheEntry<T> {
  /** The cached theme data */
  data: T;
  /** Timestamp when the entry was cached (milliseconds since epoch) */
  timestamp: number;
  /** Flag indicating if background revalidation is in progress */
  isRevalidating?: boolean;
}

/**
 * Default cache configuration
 */
const DEFAULT_CACHE_CONFIG: Required<CacheConfig> = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  maxSize: 100,
};

/**
 * Builds default values from a schema definition
 *
 * @param definition - The schema definition to extract defaults from
 * @returns Object containing all default values from the schema
 *
 * @remarks
 * Recursively traverses the schema definition and collects all token default values.
 * Nested groups are preserved in the structure.
 *
 * @internal
 */
function buildDefaults(definition: SchemaDefinition): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(definition)) {
    if (isTokenDefinition(value)) {
      const token = value as TokenDefinition;
      if (token.defaultValue !== undefined) {
        defaults[key] = token.defaultValue;
      }
    } else if (isSchemaDefinition(value)) {
      const nestedDefaults = buildDefaults(value);
      if (Object.keys(nestedDefaults).length > 0) {
        defaults[key] = nestedDefaults;
      }
    }
  }

  return defaults;
}

/**
 * Creates a theme resolver with caching support
 *
 * @typeParam T - The type of the schema definition
 * @param opts - Options containing schema, fetcher, and optional cache configuration
 * @returns A ThemeResolver instance with resolve, invalidate, clearCache, and get methods
 *
 * @remarks
 * The resolver:
 * - Fetches theme data using the provided fetcher function
 * - Merges fetched data with schema defaults
 * - Validates and coerces the merged data
 * - Caches resolved themes with configurable TTL
 * - Supports stale-while-revalidate for better performance
 *
 * @example
 * ```ts
 * const resolver = createResolver({
 *   schema,
 *   fetcher: async ({ themeId }) => {
 *     return await db.themes.findByTheme(themeId);
 *   },
 *   cache: {
 *     ttl: 60000, // 1 minute
 *     staleWhileRevalidate: true,
 *   },
 * });
 *
 * // Resolve a complete theme
 * const theme = await resolver.resolve({ themeId: 'theme-123' });
 *
 * // Get a specific value
 * const primaryColor = await resolver.get({ themeId: 'theme-123', path: 'colors.primary' });
 *
 * // Invalidate cache for a theme
 * resolver.invalidate({ themeId: 'theme-123' });
 * ```
 *
 * @public
 */
export function createResolver<T extends SchemaDefinition>(
  opts: CreateResolverOptions<T>
): ThemeResolver<T> {
  const { schema, fetcher, cache: cacheOpts } = opts;
  const definition = getSchemaDefinition(schema);
  const defaults = buildDefaults(definition) as InferTheme<T>;

  const cacheConfig: Required<CacheConfig> = {
    ...DEFAULT_CACHE_CONFIG,
    ...cacheOpts,
  };

  const cacheStore = createLRUCache<string, CacheEntry<InferTheme<T>>>(cacheConfig.maxSize);

  /**
   * Checks if a cache entry is stale
   *
   * @param entry - The cache entry to check
   * @returns True if the entry has exceeded the configured TTL
   *
   * @internal
   */
  function isStale(entry: CacheEntry<InferTheme<T>>): boolean {
    return Date.now() - entry.timestamp > cacheConfig.ttl;
  }

  /**
   * Fetches and processes theme data
   *
   * @param themeId - The theme ID to fetch theme data for
   * @returns Promise resolving to validated and coerced theme data
   * @throws {Error} If the fetched data fails validation
   *
   * @remarks
   * This function:
   * 1. Calls the user-provided fetcher function
   * 2. Merges fetched data with schema defaults
   * 3. Validates and coerces the merged data
   * 4. Throws if validation fails
   *
   * @internal
   */
  async function fetchThemeData(themeId: string): Promise<InferTheme<T>> {
    const rawData = await fetcher({ themeId });

    // Merge with defaults
    const merged = deepMerge(
      defaults as Record<string, unknown>,
      rawData as Record<string, unknown>
    );

    // Validate and coerce
    const result = coerce({ schema, data: merged });

    if (!result.success) {
      throw new Error(
        `Invalid theme data for theme "${themeId}": ${result.errors
          .map((e) => `${e.path}: ${e.message}`)
          .join(', ')}`
      );
    }

    return result.data;
  }

  /**
   * Revalidates a cache entry in the background
   *
   * @param themeId - The theme ID to revalidate
   * @param entry - The stale cache entry
   *
   * @remarks
   * Fetches fresh theme data without blocking the current request.
   * Updates the cache on success, silently fails on error.
   * Prevents concurrent revalidations using the isRevalidating flag.
   *
   * @internal
   */
  function revalidateInBackground(themeId: string, entry: CacheEntry<InferTheme<T>>): void {
    if (entry.isRevalidating) {
      return;
    }

    entry.isRevalidating = true;

    fetchThemeData(themeId)
      .then((data) => {
        cacheStore.set(themeId, {
          data,
          timestamp: Date.now(),
        });
      })
      .catch(() => {
        // Silently fail background revalidation
        // The stale data will continue to be served
      })
      .finally(() => {
        entry.isRevalidating = false;
      });
  }

  return {
    async resolve({ themeId }: { themeId: string }): Promise<InferTheme<T>> {
      const cached = cacheStore.get(themeId);

      if (cached) {
        if (!isStale(cached)) {
          return cached.data;
        }

        // Return stale data while revalidating in background
        if (cacheConfig.staleWhileRevalidate) {
          revalidateInBackground(themeId, cached);
          return cached.data;
        }
      }

      // Fetch fresh data
      const data = await fetchThemeData(themeId);

      cacheStore.set(themeId, {
        data,
        timestamp: Date.now(),
      });

      return data;
    },

    invalidate({ themeId }: { themeId: string }): void {
      cacheStore.delete(themeId);
    },

    clearCache(): void {
      cacheStore.clear();
    },

    async get<P extends ThemePath<T>>({ themeId, path }: { themeId: string; path: P }): Promise<PathValue<T, P>> {
      const theme = await this.resolve({ themeId });
      return getAtPath<PathValue<T, P>>(theme, path) as PathValue<T, P>;
    },
  };
}
