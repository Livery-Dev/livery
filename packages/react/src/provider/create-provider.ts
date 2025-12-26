/**
 * createDynamicThemeProvider - Factory function for creating typed provider and hooks
 * for runtime-fetched themes (multi-tenant, API-driven)
 */

import { createContext } from 'react';
import type { SchemaDefinition } from '@livery/core';
import type {
  CreateDynamicThemeProviderOptions,
  DynamicThemeProviderExports,
  DynamicThemeContextValue,
} from '../types/index.js';
import { createDynamicThemeProviderComponent } from './dynamic-provider.js';
import { createUseThemeHook } from '../hooks/use-theme.js';
import { createUseThemeValueHook } from '../hooks/use-theme-value.js';
import { createUseThemeReadyHook } from '../hooks/use-theme-ready.js';

/**
 * Creates a fully-typed dynamic theme provider and hooks for a schema.
 *
 * Use this for themes fetched at runtime from an API or database (e.g., multi-tenant SaaS).
 * The provider handles async fetching, loading states, caching, and error handling.
 *
 * For static bundled themes (light/dark mode), use `createStaticThemeProvider` instead.
 *
 * @param options - Options containing the schema
 * @returns Object with DynamicThemeProvider, useTheme, useThemeValue, useThemeReady, and ThemeContext
 *
 * @example
 * ```tsx
 * import { createSchema, t, createResolver } from '@livery/core';
 * import { createDynamicThemeProvider } from '@livery/react';
 *
 * // Define your schema
 * const schema = createSchema({
 *   definition: {
 *     brand: {
 *       primary: t.color().default('#3b82f6'),
 *       secondary: t.color().default('#64748b'),
 *     },
 *     spacing: {
 *       md: t.dimension().default('16px'),
 *     },
 *   },
 * });
 *
 * // Create resolver to fetch themes
 * const resolver = createResolver({
 *   schema,
 *   fetcher: async (themeId) => {
 *     const res = await fetch(`/api/themes/${themeId}`);
 *     return res.json();
 *   },
 *   cache: { ttl: 60000 },
 * });
 *
 * // Create typed provider and hooks
 * const { DynamicThemeProvider, useTheme, useThemeValue } = createDynamicThemeProvider({ schema });
 *
 * // Use in your app
 * function App() {
 *   return (
 *     <DynamicThemeProvider initialThemeId="acme" resolver={resolver}>
 *       <MyComponent />
 *     </DynamicThemeProvider>
 *   );
 * }
 *
 * function MyComponent() {
 *   // Full type inference!
 *   const primary = useThemeValue('brand.primary'); // string
 *   const { theme, isLoading, setThemeId } = useTheme();
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return <div style={{ color: primary }}>Hello</div>;
 * }
 * ```
 */
export function createDynamicThemeProvider<T extends SchemaDefinition>(
  options: CreateDynamicThemeProviderOptions<T>
): DynamicThemeProviderExports<T> {
  const { schema } = options;

  // Create the context
  const ThemeContext = createContext<DynamicThemeContextValue<T> | null>(null);
  ThemeContext.displayName = 'DynamicThemeContext';

  // Create the provider component
  const DynamicThemeProvider = createDynamicThemeProviderComponent(schema, ThemeContext);

  // Create the hooks
  const useTheme = createUseThemeHook(ThemeContext);
  const useThemeValue = createUseThemeValueHook(ThemeContext);
  const useThemeReady = createUseThemeReadyHook(ThemeContext);

  return {
    DynamicThemeProvider,
    useTheme,
    useThemeValue,
    useThemeReady,
    ThemeContext,
  };
}
