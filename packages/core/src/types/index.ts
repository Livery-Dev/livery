/**
 * Core type definitions for @livery/core
 */

// =============================================================================
// Token Types
// =============================================================================

/**
 * Supported token types in the theming system
 */
export type TokenType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'string'
  | 'boolean'
  | 'fontFamily'
  | 'fontWeight'
  | 'shadow'
  | 'url';

/**
 * Base token definition with metadata
 */
export interface TokenDefinitionBase<T extends TokenType, V> {
  readonly type: T;
  readonly defaultValue?: V;
  readonly description?: string;
}

/**
 * Color token definition
 * Accepts hex, rgb, rgba, hsl, hsla values
 */
export interface ColorToken extends TokenDefinitionBase<'color', string> {
  readonly type: 'color';
}

/**
 * Dimension token definition
 * Accepts values with units: px, rem, em, %, vh, vw, etc.
 */
export interface DimensionToken extends TokenDefinitionBase<'dimension', string> {
  readonly type: 'dimension';
}

/**
 * Number token definition
 * Accepts numeric values (integers or floats)
 */
export interface NumberToken extends TokenDefinitionBase<'number', number> {
  readonly type: 'number';
}

/**
 * String token definition
 * Accepts arbitrary string values
 */
export interface StringToken extends TokenDefinitionBase<'string', string> {
  readonly type: 'string';
}

/**
 * Boolean token definition
 */
export interface BooleanToken extends TokenDefinitionBase<'boolean', boolean> {
  readonly type: 'boolean';
}

/**
 * Font family token definition
 * Accepts font family stacks (e.g., "Inter, sans-serif")
 */
export interface FontFamilyToken extends TokenDefinitionBase<'fontFamily', string> {
  readonly type: 'fontFamily';
}

/**
 * Font weight token definition
 * Accepts numeric weights (100-900) or keywords
 */
export interface FontWeightToken extends TokenDefinitionBase<'fontWeight', string | number> {
  readonly type: 'fontWeight';
}

/**
 * Shadow token definition
 * Accepts CSS box-shadow or text-shadow values
 */
export interface ShadowToken extends TokenDefinitionBase<'shadow', string> {
  readonly type: 'shadow';
}

/**
 * URL token definition
 * Accepts URL values (validated format)
 */
export interface UrlToken extends TokenDefinitionBase<'url', string> {
  readonly type: 'url';
}

/**
 * Union of all token definition types
 */
export type TokenDefinition =
  | ColorToken
  | DimensionToken
  | NumberToken
  | StringToken
  | BooleanToken
  | FontFamilyToken
  | FontWeightToken
  | ShadowToken
  | UrlToken;

// =============================================================================
// Schema Types
// =============================================================================

/**
 * A schema definition can contain tokens or nested groups
 */
export type SchemaDefinition = {
  readonly [key: string]: TokenDefinition | SchemaDefinition;
};

/**
 * Internal brand for schema type safety
 */
declare const SCHEMA_BRAND: unique symbol;

/**
 * A validated schema created by createSchema()
 */
export interface Schema<T extends SchemaDefinition = SchemaDefinition> {
  readonly [SCHEMA_BRAND]: true;
  readonly definition: T;
}

// =============================================================================
// Type Inference
// =============================================================================

/**
 * Maps token types to their runtime value types
 */
export type TokenTypeToValue<T extends TokenDefinition> = T extends ColorToken
  ? string
  : T extends DimensionToken
    ? string
    : T extends NumberToken
      ? number
      : T extends StringToken
        ? string
        : T extends BooleanToken
          ? boolean
          : T extends FontFamilyToken
            ? string
            : T extends FontWeightToken
              ? string | number
              : T extends ShadowToken
                ? string
                : T extends UrlToken
                  ? string
                  : never;

/**
 * Infers the theme type from a schema definition
 * Recursively processes nested groups
 */
export type InferTheme<T extends SchemaDefinition> = {
  [K in keyof T]: T[K] extends TokenDefinition
    ? TokenTypeToValue<T[K]>
    : T[K] extends SchemaDefinition
      ? InferTheme<T[K]>
      : never;
};

/**
 * Helper to extract all valid paths from a schema
 * Returns dot-notation paths like "colors.primary" or "spacing.md"
 */
export type ThemePath<T extends SchemaDefinition, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends TokenDefinition
    ? Prefix extends ''
      ? K
      : `${Prefix}.${K}`
    : T[K] extends SchemaDefinition
      ? ThemePath<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
      : never;
}[keyof T & string];

/**
 * Gets the value type at a specific path in the theme
 */
export type PathValue<
  T extends SchemaDefinition,
  P extends string,
> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? T[Head] extends SchemaDefinition
      ? PathValue<T[Head], Tail>
      : never
    : never
  : P extends keyof T
    ? T[P] extends TokenDefinition
      ? TokenTypeToValue<T[P]>
      : T[P] extends SchemaDefinition
        ? InferTheme<T[P]>
        : never
    : never;

// =============================================================================
// Validation Types
// =============================================================================

/**
 * Validation mode for theme data
 */
export type ValidationMode = 'strict' | 'coerce' | 'partial';

/**
 * A single validation error
 */
export interface ValidationError {
  readonly path: string;
  readonly message: string;
  readonly expected: TokenType | 'object';
  readonly received: unknown;
}

/**
 * Result of validation - either success with data or failure with errors
 */
export type ValidationResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly errors: readonly ValidationError[] };

// =============================================================================
// Resolver Types
// =============================================================================

/**
 * Cache configuration for theme resolver
 */
export interface CacheConfig {
  /** Time-to-live in milliseconds */
  readonly ttl?: number;
  /** Whether to serve stale data while revalidating */
  readonly staleWhileRevalidate?: boolean;
  /** Maximum number of cached entries */
  readonly maxSize?: number;
}

/**
 * Options for creating a theme resolver
 */
export interface ResolverOptions<T extends SchemaDefinition> {
  /** Async function to fetch theme data for a theme ID */
  readonly fetcher: (params: { themeId: string }) => Promise<Partial<InferTheme<T>>>;
  /** Cache configuration */
  readonly cache?: CacheConfig;
  /** Validation mode for fetched data */
  readonly validationMode?: ValidationMode;
}

/**
 * A theme resolver instance
 */
export interface ThemeResolver<T extends SchemaDefinition> {
  /** Resolve theme for a theme ID, using cache if available */
  resolve(params: { themeId: string }): Promise<InferTheme<T>>;
  /** Invalidate cached theme for a theme ID */
  invalidate(params: { themeId: string }): void;
  /** Clear all cached themes */
  clearCache(): void;
  /** Get a value at a specific path */
  get<P extends ThemePath<T>>(params: { themeId: string; path: P }): Promise<PathValue<T, P>>;
}

// =============================================================================
// CSS Types
// =============================================================================

/**
 * Options for CSS variable generation
 */
export interface CssVariableOptions {
  /** Prefix for CSS variable names (default: none) */
  readonly prefix?: string;
  /** Separator between path segments (default: '-') */
  readonly separator?: string;
  /** Transform function for variable names */
  readonly transformName?: (path: string) => string;
}
