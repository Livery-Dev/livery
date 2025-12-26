/**
 * CSS generation utilities
 */

import type { Schema, SchemaDefinition, InferTheme, CssVariableOptions } from '../types/index.js';
import { getSchemaDefinition, isTokenDefinition, isSchemaDefinition } from '../schema/index.js';
import { pathToKebabCase } from '../internal/utils.js';
import { escapeCssValue } from '../validation/css-escape.js';

/**
 * Default CSS variable options
 */
const DEFAULT_OPTIONS: Required<CssVariableOptions> = {
  prefix: '',
  separator: '-',
  transformName: pathToKebabCase,
};

/**
 * Options for toCssVariables function
 *
 * @typeParam T - The type of the schema definition
 *
 * @public
 */
export interface ToCssVariablesOptions<T extends SchemaDefinition> {
  /** The schema to generate variables from */
  schema: Schema<T>;
  /** The resolved theme data */
  theme: InferTheme<T>;
  /** Optional CSS variable configuration */
  options?: CssVariableOptions;
}

/**
 * Options for toCssString function
 *
 * @typeParam T - The type of the schema definition
 *
 * @public
 */
export interface ToCssStringOptions<T extends SchemaDefinition> {
  /** The schema to generate variables from */
  schema: Schema<T>;
  /** The resolved theme data */
  theme: InferTheme<T>;
  /** Optional CSS variable configuration */
  options?: CssVariableOptions;
  /** CSS selector for the rule (defaults to ':root') */
  selector?: string;
}

/**
 * Options for cssVar function
 *
 * @public
 */
export interface CssVarOptions {
  /** Dot-notation path to the token (e.g., "colors.primary") */
  path: string;
  /** Optional CSS variable configuration */
  options?: CssVariableOptions;
}

/**
 * Options for createCssVarHelper function
 *
 * @typeParam T - The type of the schema definition
 *
 * @public
 */
export interface CreateCssVarHelperOptions<T extends SchemaDefinition> {
  /** The schema to generate variable references for */
  schema: Schema<T>;
  /** Optional CSS variable configuration */
  options?: CssVariableOptions;
}

/**
 * Formats CSS variable entries as declaration strings
 *
 * @param variables - Record of CSS variable names to values
 * @returns Formatted CSS declarations with indentation
 *
 * @remarks
 * Used internally by toCssString and toCssStringAll to format variables
 * for injection into CSS rules.
 *
 * @internal
 */
function formatCssDeclarations(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
}

/**
 * Recursively generates CSS variable entries from theme data
 *
 * @param definition - The schema definition
 * @param data - The theme data
 * @param options - CSS variable configuration
 * @param path - Current path in the schema (for recursion)
 * @returns Record of CSS variable names to values
 *
 * @remarks
 * Traverses the schema and data in parallel, generating CSS variable names
 * and values for all tokens. Nested groups are handled recursively.
 *
 * @internal
 */
function generateVariables(
  definition: SchemaDefinition,
  data: Record<string, unknown>,
  options: Required<CssVariableOptions>,
  path: string = ''
): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const [key, schemaValue] of Object.entries(definition)) {
    const currentPath = path ? `${path}.${key}` : key;
    const dataValue = data[key];

    if (isTokenDefinition(schemaValue)) {
      if (dataValue !== undefined && dataValue !== null) {
        const varName = options.transformName(currentPath);
        const fullName = options.prefix
          ? `--${options.prefix}${options.separator}${varName}`
          : `--${varName}`;
        // Escape the value to prevent CSS injection attacks
        variables[fullName] = escapeCssValue(String(dataValue));
      }
    } else if (
      isSchemaDefinition(schemaValue) &&
      typeof dataValue === 'object' &&
      dataValue !== null
    ) {
      const nested = generateVariables(
        schemaValue,
        dataValue as Record<string, unknown>,
        options,
        currentPath
      );
      Object.assign(variables, nested);
    }
  }

  return variables;
}

/**
 * Converts a resolved theme to CSS custom properties (variables)
 *
 * Returns an object mapping variable names to values.
 *
 * @param opts - Options containing schema, theme, and optional CSS variable configuration
 * @returns Object mapping CSS variable names to values
 *
 * @example
 * ```ts
 * const variables = toCssVariables({ schema, theme });
 * // { '--colors-primary': '#3b82f6', '--spacing-md': '16px', ... }
 *
 * // With prefix
 * const prefixed = toCssVariables({ schema, theme, options: { prefix: 'theme' } });
 * // { '--theme-colors-primary': '#3b82f6', '--theme-spacing-md': '16px', ... }
 * ```
 */
export function toCssVariables<T extends SchemaDefinition>(
  opts: ToCssVariablesOptions<T>
): Record<string, string> {
  const { schema, theme, options } = opts;
  const definition = getSchemaDefinition(schema);
  const mergedOptions: Required<CssVariableOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return generateVariables(definition, theme as Record<string, unknown>, mergedOptions);
}

/**
 * Converts a resolved theme to a CSS string for injection
 *
 * Generates a complete CSS rule with custom properties.
 *
 * @param opts - Options containing schema, theme, selector, and optional CSS variable configuration
 * @returns CSS string ready for injection
 *
 * @example
 * ```ts
 * const css = toCssString({ schema, theme });
 * // :root {
 * //   --colors-primary: #3b82f6;
 * //   --spacing-md: 16px;
 * // }
 *
 * // With custom selector
 * const scopedCss = toCssString({ schema, theme, selector: '.theme-container' });
 * // .theme-container {
 * //   --colors-primary: #3b82f6;
 * //   --spacing-md: 16px;
 * // }
 * ```
 */
export function toCssString<T extends SchemaDefinition>(opts: ToCssStringOptions<T>): string {
  const { schema, theme, options, selector = ':root' } = opts;
  const variables = toCssVariables({ schema, theme, ...(options && { options }) });

  if (Object.keys(variables).length === 0) {
    return '';
  }

  const declarations = formatCssDeclarations(variables);
  return `${selector} {\n${declarations}\n}`;
}

/**
 * Generates CSS variable reference (var()) for a token path
 *
 * @param opts - Options containing path and optional CSS variable configuration
 * @returns CSS var() function call
 *
 * @example
 * ```ts
 * const ref = cssVar({ path: 'colors.primary' });
 * // 'var(--colors-primary)'
 *
 * const withPrefix = cssVar({ path: 'colors.primary', options: { prefix: 'theme' } });
 * // 'var(--theme-colors-primary)'
 * ```
 */
export function cssVar(opts: CssVarOptions): string {
  const { path, options } = opts;
  const mergedOptions: Required<CssVariableOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const varName = mergedOptions.transformName(path);
  const fullName = mergedOptions.prefix
    ? `--${mergedOptions.prefix}${mergedOptions.separator}${varName}`
    : `--${varName}`;

  return `var(${fullName})`;
}

/**
 * Creates a typed helper for generating CSS variable references
 *
 * @param opts - Options containing schema and optional CSS variable configuration
 * @returns A function that takes a path and returns the CSS var() reference
 *
 * @example
 * ```ts
 * const themeVar = createCssVarHelper({ schema });
 *
 * // Fully typed - only valid paths are allowed
 * const primary = themeVar('colors.primary');
 * // 'var(--colors-primary)'
 * ```
 */
export function createCssVarHelper<T extends SchemaDefinition>(
  opts: CreateCssVarHelperOptions<T>
): <P extends string>(path: P) => string {
  const { options } = opts;
  return (path) => cssVar({ path, ...(options && { options }) });
}

/**
 * Options for toCssStringAll function
 *
 * @typeParam T - The type of the schema definition
 * @typeParam K - The union type of theme keys
 *
 * @public
 */
export interface ToCssStringAllOptions<T extends SchemaDefinition, K extends string> {
  /** The schema to generate variables from */
  schema: Schema<T>;
  /** Record of theme names to resolved theme data */
  themes: Record<K, InferTheme<T>>;
  /** The default theme key (will be applied to :root) */
  defaultTheme?: K;
  /** Optional CSS variable configuration */
  options?: CssVariableOptions;
  /** Attribute name for theme selector (default: 'data-theme') */
  attribute?: string;
}

/**
 * Generates CSS for multiple themes with selectors
 *
 * Creates CSS rules with `[data-theme="<key>"]` selectors for each theme.
 * The default theme is also applied to `:root` for initial load.
 *
 * @param opts - Options containing schema, themes, defaultTheme, and optional CSS variable configuration
 * @returns CSS string with all themes
 *
 * @example
 * ```ts
 * const css = toCssStringAll({
 *   schema,
 *   themes: { light: lightTheme, dark: darkTheme },
 *   defaultTheme: 'light',
 * });
 * // :root, [data-theme="light"] {
 * //   --colors-primary: #14b8a6;
 * //   --colors-background: #ffffff;
 * // }
 * // [data-theme="dark"] {
 * //   --colors-primary: #2dd4bf;
 * //   --colors-background: #0f172a;
 * // }
 * ```
 */
export function toCssStringAll<T extends SchemaDefinition, K extends string>(
  opts: ToCssStringAllOptions<T, K>
): string {
  const { schema, themes, defaultTheme, options, attribute = 'data-theme' } = opts;
  const themeKeys = Object.keys(themes) as K[];
  const cssBlocks: string[] = [];

  for (const key of themeKeys) {
    const theme = themes[key];
    const variables = toCssVariables({ schema, theme, ...(options && { options }) });

    if (Object.keys(variables).length === 0) continue;

    const declarations = formatCssDeclarations(variables);

    // Build selector
    const attrSelector = `[${attribute}="${key}"]`;
    const selector = key === defaultTheme ? `:root, ${attrSelector}` : attrSelector;

    cssBlocks.push(`${selector} {\n${declarations}\n}`);
  }

  return cssBlocks.join('\n\n');
}
