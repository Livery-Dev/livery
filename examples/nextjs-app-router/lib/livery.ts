'use client';

/**
 * Livery client-side exports
 *
 * This file provides the React provider and hooks for use in client components.
 * For server-side usage (schema, resolver), import from './livery-config'.
 */

import { createDynamicThemeProvider } from '@livery/react';
import { schema } from './livery-config';

// Re-export config for convenience in client components
export { schema, resolver, type Theme } from './livery-config';

/**
 * Typed provider and hooks
 *
 * These are created from the schema and provide full type safety
 * throughout your application.
 */
export const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady } = createDynamicThemeProvider({
  schema,
});
