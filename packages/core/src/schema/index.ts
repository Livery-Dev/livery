/**
 * Schema creation and management
 */

import type { Schema, SchemaDefinition, TokenDefinition, TokenType } from '../types/index.js';

// =============================================================================
// Schema Brand Symbol
// =============================================================================

const SCHEMA_BRAND = Symbol('livery.schema');

/**
 * Valid token types (using Set for O(1) lookup)
 */
const VALID_TOKEN_TYPES = new Set<TokenType>([
  'color',
  'dimension',
  'number',
  'string',
  'boolean',
  'fontFamily',
  'fontWeight',
  'shadow',
  'url',
]);

/**
 * Type guard to check if a value is a valid token type
 */
function isValidTokenType(value: string): value is TokenType {
  return VALID_TOKEN_TYPES.has(value as TokenType);
}

/**
 * Type guard to check if a value is a token definition
 *
 * @param value - The value to check
 * @returns True if the value is a token definition with a valid type property
 *
 * @remarks
 * A token definition is an object with a 'type' property that matches one of the valid token types.
 *
 * @example
 * ```ts
 * isTokenDefinition({ type: 'color' }); // true
 * isTokenDefinition({ type: 'invalid' }); // false
 * isTokenDefinition('string'); // false
 * ```
 */
export function isTokenDefinition(value: unknown): value is TokenDefinition {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return typeof obj['type'] === 'string' && isValidTokenType(obj['type']);
}

/**
 * Type guard to check if a value is a schema definition (nested group)
 *
 * @param value - The value to check
 * @returns True if the value is a nested group (object that's not a token definition)
 *
 * @remarks
 * A schema definition is an object that contains other tokens or nested groups.
 * It's distinguished from a token definition by not having a 'type' property.
 *
 * @example
 * ```ts
 * isSchemaDefinition({ primary: { type: 'color' } }); // true (nested group)
 * isSchemaDefinition({ type: 'color' }); // false (token definition)
 * ```
 */
export function isSchemaDefinition(value: unknown): value is SchemaDefinition {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // If it has a 'type' property that matches token types, it's a token
  if (isTokenDefinition(value)) {
    return false;
  }

  // Otherwise, it should be a nested group
  return true;
}

/**
 * Type guard to check if a value is a Schema
 *
 * @typeParam T - The schema definition type
 * @param value - The value to check
 * @returns True if the value is a branded Schema object created by createSchema
 *
 * @remarks
 * Schemas are branded objects created by the createSchema function.
 * This type guard checks for the presence of the internal brand symbol.
 *
 * @example
 * ```ts
 * const schema = createSchema({ definition: { colors: { primary: t.color() } } });
 * isSchema(schema); // true
 * isSchema({ definition: {} }); // false
 * ```
 */
export function isSchema<T extends SchemaDefinition>(value: unknown): value is Schema<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (value as Record<symbol, unknown>)[SCHEMA_BRAND] === true;
}

/**
 * Recursively validates a schema definition structure with cycle detection
 *
 * @param definition - The schema definition to validate
 * @param path - The current path in the schema (for error messages)
 * @param visited - Set of visited objects to detect circular references
 * @throws {Error} If the definition is invalid or contains circular references
 *
 * @remarks
 * This function ensures that:
 * - All values are objects (tokens or nested groups)
 * - All token definitions have valid type properties
 * - No circular references exist in the schema structure
 *
 * @internal
 */
function validateSchemaDefinition(
  definition: unknown,
  path: string = '',
  visited: Set<unknown> = new Set()
): void {
  if (typeof definition !== 'object' || definition === null) {
    throw new Error(
      `Invalid schema definition at "${path || 'root'}": expected object, got ${typeof definition}`
    );
  }

  if (visited.has(definition)) {
    throw new Error(`Circular reference detected at "${path || 'root'}"`);
  }

  visited.add(definition);

  for (const [key, value] of Object.entries(definition)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value !== 'object' || value === null) {
      throw new Error(
        `Invalid schema definition at "${currentPath}": expected token or group, got ${typeof value}`
      );
    }

    if (isTokenDefinition(value)) {
      // Valid token definition
      continue;
    }

    // Must be a nested group - validate recursively
    validateSchemaDefinition(value, currentPath, visited);
  }

  visited.delete(definition);
}

/**
 * Options for createSchema function
 *
 * @typeParam T - The type of the schema definition
 */
export interface CreateSchemaOptions<T extends SchemaDefinition> {
  /** The schema definition containing tokens and nested groups */
  definition: T;
}

/**
 * Creates a validated schema from a definition object
 *
 * @param opts - Options containing the schema definition
 * @returns A validated Schema object
 *
 * @example
 * ```ts
 * const schema = createSchema({
 *   definition: {
 *     colors: {
 *       primary: t.color().default('#3b82f6'),
 *       secondary: t.color(),
 *     },
 *     spacing: {
 *       sm: t.dimension().default('4px'),
 *       md: t.dimension().default('8px'),
 *       lg: t.dimension().default('16px'),
 *     },
 *   },
 * });
 * ```
 */
export function createSchema<T extends SchemaDefinition>(opts: CreateSchemaOptions<T>): Schema<T> {
  const { definition } = opts;

  // Validate the schema structure
  validateSchemaDefinition(definition);

  // Create the schema object with brand
  const schema = {
    [SCHEMA_BRAND]: true as const,
    definition,
  };

  // Freeze to ensure immutability
  return Object.freeze(schema) as unknown as Schema<T>;
}

/**
 * Extracts the definition from a schema
 *
 * @typeParam T - The type of the schema definition
 * @param schema - The schema to extract the definition from
 * @returns The schema definition object
 *
 * @remarks
 * This is a helper function to extract the raw definition from a branded Schema object.
 *
 * @example
 * ```ts
 * const schema = createSchema({
 *   definition: { colors: { primary: t.color() } }
 * });
 * const definition = getSchemaDefinition(schema);
 * // { colors: { primary: { type: 'color', ... } } }
 * ```
 */
export function getSchemaDefinition<T extends SchemaDefinition>(schema: Schema<T>): T {
  return schema.definition;
}

/**
 * Options for getTokenPaths function
 */
export interface GetTokenPathsOptions {
  /** The schema definition to extract paths from */
  definition: SchemaDefinition;
  /** Optional prefix to prepend to all paths (used for recursion) */
  prefix?: string;
}

/**
 * Gets all token paths from a schema definition
 *
 * @param opts - Options containing the schema definition and optional prefix
 * @returns Array of dot-notation paths to all tokens in the schema
 *
 * @remarks
 * Recursively traverses the schema definition and collects the paths to all token definitions.
 * Nested groups are traversed but not included in the result.
 *
 * @example
 * ```ts
 * const definition = {
 *   colors: { primary: t.color(), secondary: t.color() },
 *   spacing: { sm: t.dimension() }
 * };
 * getTokenPaths({ definition });
 * // ['colors.primary', 'colors.secondary', 'spacing.sm']
 * ```
 */
export function getTokenPaths(opts: GetTokenPathsOptions): string[] {
  const { definition, prefix = '' } = opts;
  const paths: string[] = [];

  for (const [key, value] of Object.entries(definition)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (isTokenDefinition(value)) {
      paths.push(currentPath);
    } else if (isSchemaDefinition(value)) {
      paths.push(...getTokenPaths({ definition: value, prefix: currentPath }));
    }
  }

  return paths;
}

/**
 * Options for getTokenAtPath function
 */
export interface GetTokenAtPathOptions {
  /** The schema definition to search in */
  definition: SchemaDefinition;
  /** Dot-notation path to the token (e.g., "colors.primary") */
  path: string;
}

/**
 * Gets a token definition at a specific path
 *
 * @param opts - Options containing the schema definition and path
 * @returns The token definition if found, otherwise undefined
 *
 * @remarks
 * Navigates through nested groups using dot-notation path.
 * Returns undefined if the path doesn't exist or points to a nested group.
 *
 * @example
 * ```ts
 * const definition = {
 *   colors: { primary: t.color(), secondary: t.color() },
 *   spacing: { sm: t.dimension() }
 * };
 * getTokenAtPath({ definition, path: 'colors.primary' });
 * // { type: 'color', defaultValue: ... }
 *
 * getTokenAtPath({ definition, path: 'colors' });
 * // undefined (not a token, it's a group)
 * ```
 */
export function getTokenAtPath(opts: GetTokenAtPathOptions): TokenDefinition | undefined {
  const { definition, path } = opts;
  const parts = path.split('.');
  let current: unknown = definition;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (isTokenDefinition(current)) {
    return current;
  }

  return undefined;
}

export { t } from './tokens.js';
