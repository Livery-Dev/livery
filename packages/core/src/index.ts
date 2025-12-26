/**
 * @livery/core
 *
 * Type-safe, multi-tenant theming library for B2B SaaS applications.
 * Zero runtime dependencies. Full TypeScript inference.
 */

// Types
export type {
  // Token types
  TokenType,
  TokenDefinition,
  ColorToken,
  DimensionToken,
  NumberToken,
  StringToken,
  BooleanToken,
  FontFamilyToken,
  FontWeightToken,
  ShadowToken,
  UrlToken,
  // Schema types
  SchemaDefinition,
  Schema,
  // Inference types
  InferTheme,
  ThemePath,
  PathValue,
  // Validation types
  ValidationResult,
  ValidationError,
  ValidationMode,
  // Resolver types
  ThemeResolver,
  CacheConfig,
  // CSS types
  CssVariableOptions,
} from './types/index.js';

// Schema
export { createSchema, type CreateSchemaOptions } from './schema/index.js';

// Token builders
export { t } from './schema/tokens.js';

// Resolver
export { createResolver, type CreateResolverOptions } from './resolver/index.js';

// Validation
export { validate, validatePartial, coerce, type ValidateOptions } from './validation/index.js';

// CSS escaping (security)
export { escapeCssValue, needsCssEscaping } from './validation/css-escape.js';

// CSS utilities
export {
  toCssVariables,
  toCssString,
  toCssStringAll,
  cssVar,
  createCssVarHelper,
  type ToCssVariablesOptions,
  type ToCssStringOptions,
  type ToCssStringAllOptions,
  type CssVarOptions,
  type CreateCssVarHelperOptions,
} from './css/index.js';

// Utility exports
export {
  getTokenPaths,
  getTokenAtPath,
  isTokenDefinition,
  isSchemaDefinition,
  isSchema,
  type GetTokenPathsOptions,
  type GetTokenAtPathOptions,
} from './schema/index.js';
