/**
 * Token builder API
 *
 * Fluent API for defining tokens in a schema, inspired by Zod.
 * Each builder creates a token definition with optional metadata.
 */

import type {
  ColorToken,
  DimensionToken,
  NumberToken,
  StringToken,
  BooleanToken,
  FontFamilyToken,
  FontWeightToken,
  ShadowToken,
  UrlToken,
} from '../types/index.js';

// =============================================================================
// Token Builder Types
// =============================================================================

/**
 * Builder for color tokens
 *
 * @public
 */
export interface ColorTokenBuilder {
  /** The token type */
  readonly type: 'color';
  /** The default value for this token */
  readonly defaultValue?: string;
  /** The description for this token */
  readonly description?: string;
  /** Set the default value */
  default(value: string): ColorTokenBuilder;
  /** Set the description */
  describe(text: string): ColorTokenBuilder;
}

/**
 * Builder for dimension tokens
 */
export interface DimensionTokenBuilder {
  readonly type: 'dimension';
  readonly defaultValue?: string;
  readonly description?: string;
  default(value: string): DimensionTokenBuilder;
  describe(text: string): DimensionTokenBuilder;
}

/**
 * Builder for number tokens
 */
export interface NumberTokenBuilder {
  readonly type: 'number';
  readonly defaultValue?: number;
  readonly description?: string;
  default(value: number): NumberTokenBuilder;
  describe(text: string): NumberTokenBuilder;
}

/**
 * Builder for string tokens
 */
export interface StringTokenBuilder {
  readonly type: 'string';
  readonly defaultValue?: string;
  readonly description?: string;
  default(value: string): StringTokenBuilder;
  describe(text: string): StringTokenBuilder;
}

/**
 * Builder for boolean tokens
 */
export interface BooleanTokenBuilder {
  readonly type: 'boolean';
  readonly defaultValue?: boolean;
  readonly description?: string;
  default(value: boolean): BooleanTokenBuilder;
  describe(text: string): BooleanTokenBuilder;
}

/**
 * Builder for font family tokens
 */
export interface FontFamilyTokenBuilder {
  readonly type: 'fontFamily';
  readonly defaultValue?: string;
  readonly description?: string;
  default(value: string): FontFamilyTokenBuilder;
  describe(text: string): FontFamilyTokenBuilder;
}

/**
 * Builder for font weight tokens
 */
export interface FontWeightTokenBuilder {
  readonly type: 'fontWeight';
  readonly defaultValue?: string | number;
  readonly description?: string;
  default(value: string | number): FontWeightTokenBuilder;
  describe(text: string): FontWeightTokenBuilder;
}

/**
 * Builder for shadow tokens
 */
export interface ShadowTokenBuilder {
  readonly type: 'shadow';
  readonly defaultValue?: string;
  readonly description?: string;
  default(value: string): ShadowTokenBuilder;
  describe(text: string): ShadowTokenBuilder;
}

/**
 * Builder for URL tokens
 */
export interface UrlTokenBuilder {
  readonly type: 'url';
  readonly defaultValue?: string;
  readonly description?: string;
  default(value: string): UrlTokenBuilder;
  describe(text: string): UrlTokenBuilder;
}

// =============================================================================
// Builder Implementation
// =============================================================================

/**
 * Token builder result type
 */
interface TokenBuilderResult<T extends string, V> {
  readonly type: T;
  readonly defaultValue: V | undefined;
  readonly description: string | undefined;
  default(value: V): TokenBuilderResult<T, V>;
  describe(text: string): TokenBuilderResult<T, V>;
}

/**
 * Creates a token builder with fluent API methods
 */
function createTokenBuilder<T extends string, V>(type: T) {
  return function createBuilder(defaultValue?: V, description?: string): TokenBuilderResult<T, V> {
    return {
      type,
      defaultValue,
      description,
      default(value: V) {
        return createBuilder(value, description);
      },
      describe(text: string) {
        return createBuilder(defaultValue, text);
      },
    };
  };
}

// =============================================================================
// Token Builder Factory
// =============================================================================

const colorBuilder = createTokenBuilder<'color', string>('color');
const dimensionBuilder = createTokenBuilder<'dimension', string>('dimension');
const numberBuilder = createTokenBuilder<'number', number>('number');
const stringBuilder = createTokenBuilder<'string', string>('string');
const booleanBuilder = createTokenBuilder<'boolean', boolean>('boolean');
const fontFamilyBuilder = createTokenBuilder<'fontFamily', string>('fontFamily');
const fontWeightBuilder = createTokenBuilder<'fontWeight', string | number>('fontWeight');
const shadowBuilder = createTokenBuilder<'shadow', string>('shadow');
const urlBuilder = createTokenBuilder<'url', string>('url');

/**
 * Token builders namespace
 *
 * @remarks
 * Provides a fluent API for defining tokens in a schema.
 * Inspired by Zod's builder pattern.
 *
 * @example
 * ```ts
 * const schema = createSchema({
 *   definition: {
 *     colors: {
 *       primary: t.color().default('#3b82f6'),
 *       background: t.color().describe('Page background color'),
 *     },
 *     spacing: {
 *       sm: t.dimension().default('4px'),
 *       md: t.dimension().default('8px'),
 *     },
 *   },
 * });
 * ```
 *
 * @public
 */
export const t = {
  /**
   * Creates a color token
   *
   * @returns A color token builder
   *
   * @remarks
   * Accepts hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba, and hsl/hsla values
   */
  color(): ColorTokenBuilder {
    return colorBuilder() as ColorTokenBuilder;
  },

  /**
   * Creates a dimension token
   * Accepts values with units: px, rem, em, %, vh, vw, etc.
   */
  dimension(): DimensionTokenBuilder {
    return dimensionBuilder() as DimensionTokenBuilder;
  },

  /**
   * Creates a number token
   * Accepts numeric values (integers or floats)
   */
  number(): NumberTokenBuilder {
    return numberBuilder() as NumberTokenBuilder;
  },

  /**
   * Creates a string token
   * Accepts arbitrary string values
   */
  string(): StringTokenBuilder {
    return stringBuilder() as StringTokenBuilder;
  },

  /**
   * Creates a boolean token
   */
  boolean(): BooleanTokenBuilder {
    return booleanBuilder() as BooleanTokenBuilder;
  },

  /**
   * Creates a font family token
   * Accepts font family stacks (e.g., "Inter, sans-serif")
   */
  fontFamily(): FontFamilyTokenBuilder {
    return fontFamilyBuilder() as FontFamilyTokenBuilder;
  },

  /**
   * Creates a font weight token
   * Accepts numeric weights (100-900) or keywords
   */
  fontWeight(): FontWeightTokenBuilder {
    return fontWeightBuilder() as FontWeightTokenBuilder;
  },

  /**
   * Creates a shadow token
   * Accepts CSS box-shadow or text-shadow values
   */
  shadow(): ShadowTokenBuilder {
    return shadowBuilder() as ShadowTokenBuilder;
  },

  /**
   * Creates a URL token
   * Accepts URL values (validated format)
   */
  url(): UrlTokenBuilder {
    return urlBuilder() as UrlTokenBuilder;
  },
} as const;

// Type exports for token definitions created by builders
export type {
  ColorToken,
  DimensionToken,
  NumberToken,
  StringToken,
  BooleanToken,
  FontFamilyToken,
  FontWeightToken,
  ShadowToken,
  UrlToken,
};
