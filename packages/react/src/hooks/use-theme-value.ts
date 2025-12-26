/**
 * useThemeValue hook - access individual theme tokens
 */

import { useContext, type Context } from 'react';
import type { SchemaDefinition, ThemePath, PathValue } from '@livery/core';
import type { DynamicThemeContextValue } from '../types/index.js';
import { getAtPath } from '../internal/utils.js';

/**
 * Creates the useThemeValue hook for a specific context and schema.
 * This is called by createDynamicThemeProvider to generate a typed hook.
 */
export function createUseThemeValueHook<T extends SchemaDefinition>(
  ThemeContext: Context<DynamicThemeContextValue<T> | null>
): <P extends ThemePath<T>>(path: P) => PathValue<T, P> {
  return function useThemeValue<P extends ThemePath<T>>(path: P): PathValue<T, P> {
    const context = useContext(ThemeContext);

    if (context === null) {
      throw new Error(
        'useThemeValue must be used within a DynamicThemeProvider. ' +
          'Make sure your component is wrapped with <DynamicThemeProvider>.'
      );
    }

    const { theme } = context;

    if (theme === null) {
      // Return undefined when theme is not loaded yet
      return undefined as PathValue<T, P>;
    }

    return getAtPath<PathValue<T, P>>(theme, path) as PathValue<T, P>;
  };
}
