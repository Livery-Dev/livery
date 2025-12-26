/**
 * @livery/react
 *
 * React bindings for @livery/core - theming for web applications.
 * Provides type-safe providers and hooks for React applications.
 *
 * Two providers are available:
 * - `createStaticThemeProvider` - For bundled themes (light/dark mode) with instant switching
 * - `createDynamicThemeProvider` - For runtime-fetched themes (multi-tenant, API-driven)
 */

// =============================================================================
// Static Theme Provider (for bundled themes)
// =============================================================================

export { createStaticThemeProvider } from './static/index.js';
export type {
  CreateStaticThemeProviderOptions,
  StaticThemeProviderExports,
  StaticThemeProviderProps,
  StaticThemeContextValue,
  PersistMode,
  CookieOptions,
} from './static/index.js';

// =============================================================================
// Dynamic Theme Provider (for runtime-fetched themes)
// =============================================================================

export { createDynamicThemeProvider } from './provider/index.js';
export type {
  // Provider types
  CreateDynamicThemeProviderOptions,
  DynamicThemeProviderExports,
  DynamicThemeProviderProps,
  DynamicThemeContextValue,
  // State machine types
  ThemeState,
  ThemeStoreState,
  // Injection types
  InjectionMode,
} from './types/index.js';

// =============================================================================
// Re-export core types for convenience
// =============================================================================

export type {
  Schema,
  SchemaDefinition,
  InferTheme,
  ThemePath,
  PathValue,
  ThemeResolver,
  CssVariableOptions,
} from '@livery/core';
