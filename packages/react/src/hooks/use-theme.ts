/**
 * useTheme hook - access full theme context for dynamic themes
 */

import { useContext, type Context } from 'react';
import type { SchemaDefinition } from '@livery/core';
import type { DynamicThemeContextValue } from '../types/index.js';

/**
 * Creates the useTheme hook for a specific context.
 * This is called by createDynamicThemeProvider to generate a typed hook.
 */
export function createUseThemeHook<T extends SchemaDefinition>(
  ThemeContext: Context<DynamicThemeContextValue<T> | null>
): () => DynamicThemeContextValue<T> {
  return function useTheme(): DynamicThemeContextValue<T> {
    const context = useContext(ThemeContext);

    if (context === null) {
      throw new Error(
        'useTheme must be used within a DynamicThemeProvider. ' +
          'Make sure your component is wrapped with <DynamicThemeProvider>.'
      );
    }

    return context;
  };
}
