/**
 * useThemeReady hook - check if theme is loaded
 */

import { useContext, type Context } from 'react';
import type { SchemaDefinition } from '@livery/core';
import type { DynamicThemeContextValue } from '../types/index.js';

/**
 * Creates the useThemeReady hook for a specific context.
 * This is called by createDynamicThemeProvider to generate a typed hook.
 */
export function createUseThemeReadyHook<T extends SchemaDefinition>(
  ThemeContext: Context<DynamicThemeContextValue<T> | null>
): () => boolean {
  return function useThemeReady(): boolean {
    const context = useContext(ThemeContext);

    if (context === null) {
      throw new Error(
        'useThemeReady must be used within a DynamicThemeProvider. ' +
          'Make sure your component is wrapped with <DynamicThemeProvider>.'
      );
    }

    // Theme is ready when state is 'ready' or 'error' (not idle or loading)
    return context.isReady || context.isError;
  };
}
