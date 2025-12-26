/**
 * Theme validation
 */

import type {
  Schema,
  SchemaDefinition,
  InferTheme,
  ValidationResult,
  ValidationError,
  ValidationMode,
  TokenDefinition,
} from '../types/index.js';
import { isTokenDefinition, isSchemaDefinition, getSchemaDefinition } from '../schema/index.js';
import { validateValue, coerceValue } from './validators.js';

/**
 * Collects all validation errors for a theme against a schema
 *
 * @param definition - The schema definition to validate against
 * @param data - The data to validate
 * @param mode - The validation mode ('strict', 'partial', or 'coerce')
 * @param path - The current path in the schema (for error messages)
 * @returns Object containing validation errors and coerced data
 *
 * @remarks
 * Recursively validates nested groups and tokens, collecting all errors
 * and building a coerced data object with validated/default values.
 * - In strict mode: All required values must be present and valid
 * - In partial mode: Missing values are allowed
 * - In coerce mode: Values are converted to the correct type when possible
 *
 * @internal
 */
function collectErrors(
  definition: SchemaDefinition,
  data: unknown,
  mode: ValidationMode,
  path: string = ''
): { errors: ValidationError[]; coercedData: Record<string, unknown> } {
  const errors: ValidationError[] = [];
  const coercedData: Record<string, unknown> = {};

  for (const [key, schemaValue] of Object.entries(definition)) {
    const currentPath = path ? `${path}.${key}` : key;
    const dataValue =
      typeof data === 'object' && data !== null
        ? (data as Record<string, unknown>)[key]
        : undefined;

    if (isTokenDefinition(schemaValue)) {
      const token = schemaValue as TokenDefinition;

      // Handle missing values
      if (dataValue === undefined) {
        if (token.defaultValue !== undefined) {
          // Use default value
          coercedData[key] = token.defaultValue;
        } else if (mode === 'partial') {
          // Skip missing values in partial mode
          continue;
        } else {
          // Required value is missing
          errors.push({
            path: currentPath,
            message: 'required value is missing',
            expected: token.type,
            received: undefined,
          });
        }
        continue;
      }

      // Validate or coerce the value
      const result =
        mode === 'coerce'
          ? coerceValue(dataValue, token.type)
          : validateValue(dataValue, token.type);

      if (result.valid) {
        coercedData[key] = result.value;
      } else {
        errors.push({
          path: currentPath,
          message: result.message,
          expected: token.type,
          received: dataValue,
        });
      }
    } else if (isSchemaDefinition(schemaValue)) {
      // Handle nested groups
      if (dataValue === undefined) {
        if (mode === 'partial') {
          continue;
        }
        // Check if all nested tokens have defaults
        const nestedResult = collectErrors(schemaValue, {}, mode, currentPath);
        if (nestedResult.errors.length > 0) {
          errors.push(...nestedResult.errors);
        }
        coercedData[key] = nestedResult.coercedData;
      } else if (typeof dataValue !== 'object' || dataValue === null) {
        errors.push({
          path: currentPath,
          message: 'expected object for nested group',
          expected: 'object',
          received: dataValue,
        });
      } else {
        const nestedResult = collectErrors(schemaValue, dataValue, mode, currentPath);
        errors.push(...nestedResult.errors);
        coercedData[key] = nestedResult.coercedData;
      }
    }
  }

  return { errors, coercedData };
}

/**
 * Options for validate function
 *
 * @typeParam T - The type of the schema definition
 */
export interface ValidateOptions<T extends SchemaDefinition> {
  /** The schema to validate against */
  schema: Schema<T>;
  /** The data to validate */
  data: unknown;
}

/**
 * Internal function to validate with a specific mode
 *
 * @typeParam T - The type of the schema definition
 * @param options - Validation options containing schema and data
 * @param mode - The validation mode ('strict', 'partial', or 'coerce')
 * @returns Validation result with typed data or errors
 *
 * @remarks
 * This internal function is used by validate, validatePartial, and coerce
 * to share validation logic while applying different validation modes.
 *
 * @internal
 */
function validateWithMode<T extends SchemaDefinition>(
  options: ValidateOptions<T>,
  mode: ValidationMode
): ValidationResult<InferTheme<T>> {
  const { schema, data } = options;
  const definition = getSchemaDefinition(schema);
  const { errors, coercedData } = collectErrors(definition, data, mode);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: coercedData as InferTheme<T> };
}

/**
 * Validates theme data against a schema in strict mode
 *
 * All required values must be present and match their token types exactly.
 *
 * @param options - Validation options containing schema and data
 * @returns Validation result with typed data or errors
 *
 * @example
 * ```ts
 * const result = validate({ schema, data: themeData });
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 */
export function validate<T extends SchemaDefinition>(
  options: ValidateOptions<T>
): ValidationResult<InferTheme<T>> {
  return validateWithMode(options, 'strict');
}

/**
 * Validates theme data in partial mode
 *
 * Missing values are allowed and won't cause errors.
 * Useful for validating partial updates.
 *
 * @param options - Validation options containing schema and data
 * @returns Validation result with typed partial data or errors
 *
 * @example
 * ```ts
 * const result = validatePartial({ schema, data: partialTheme });
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 */
export function validatePartial<T extends SchemaDefinition>(
  options: ValidateOptions<T>
): ValidationResult<Partial<InferTheme<T>>> {
  return validateWithMode(options, 'partial') as ValidationResult<Partial<InferTheme<T>>>;
}

/**
 * Validates and coerces theme data
 *
 * Attempts to convert values to the correct type when possible.
 * For example, "123" -> 123 for number tokens.
 *
 * @param options - Validation options containing schema and data
 * @returns Validation result with coerced typed data or errors
 *
 * @example
 * ```ts
 * const result = coerce({ schema, data: rawThemeData });
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 */
export function coerce<T extends SchemaDefinition>(
  options: ValidateOptions<T>
): ValidationResult<InferTheme<T>> {
  return validateWithMode(options, 'coerce');
}

export { validateValue, coerceValue } from './validators.js';
export { escapeCssValue, needsCssEscaping } from './css-escape.js';
