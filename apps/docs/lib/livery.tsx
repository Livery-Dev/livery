'use client';

import { createDynamicThemeProvider } from '@livery/react';
import { schema } from './schema';
import { resolver } from './resolver';

/**
 * Create the Livery provider and hooks for the documentation site.
 * The schema type is captured at creation time, providing full TypeScript inference.
 */
export const {
  DynamicThemeProvider,
  useTheme,
  useThemeValue,
  useThemeReady,
  ThemeContext,
} = createDynamicThemeProvider({ schema });

// Re-export the resolver for use in provider props
export { resolver };

// Re-export theme types and data for components
export { themes, type ThemeName } from './themes';
