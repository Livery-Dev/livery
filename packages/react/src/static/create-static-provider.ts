/**
 * Factory function to create a typed StaticThemeProvider and hooks.
 *
 * For zero-flash theming:
 * 1. Use toCssStringAll() to generate CSS, include in <head>
 * 2. Use getThemeInitScript() to generate init script, include in <head>
 * 3. Use createStaticThemeProvider() for React integration
 */

import { createContext, useContext } from 'react';
import type {
  CreateStaticThemeProviderOptions,
  StaticThemeProviderExports,
  StaticThemeContextValue,
} from './types.js';
import { createStaticThemeProviderComponent } from './static-provider.js';

/**
 * Creates a typed StaticThemeProvider and useTheme hook for static themes.
 *
 * Use this for bundled themes (light/dark mode) where all theme CSS is
 * generated upfront with `toCssStringAll()`. Theme switching is instant
 * since it just changes the `data-theme` attribute.
 *
 * For dynamic themes fetched from an API or database, use `createDynamicThemeProvider` instead.
 *
 * @example
 * ```tsx
 * import { toCssStringAll } from '@livery/core';
 * import { createStaticThemeProvider, getThemeInitScript } from '@livery/react';
 *
 * // 1. Generate CSS (include in <head>)
 * export const css = toCssStringAll({ schema, themes, defaultTheme: 'light' });
 *
 * // 2. Generate init script (include in <head>)
 * export const initScript = getThemeInitScript({
 *   themes: ['light', 'dark'],
 *   defaultTheme: 'light',
 * });
 *
 * // 3. Create provider and hook
 * export const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
 *   themes: ['light', 'dark'] as const,
 *   defaultTheme: 'light',
 * });
 *
 * // In your layout:
 * // <head>
 * //   <style dangerouslySetInnerHTML={{ __html: css }} />
 * //   <script dangerouslySetInnerHTML={{ __html: initScript }} />
 * // </head>
 * // <body>
 * //   <StaticThemeProvider>{children}</StaticThemeProvider>
 * // </body>
 * ```
 */
export function createStaticThemeProvider<const TThemes extends readonly string[]>(
  options: CreateStaticThemeProviderOptions<TThemes>
): StaticThemeProviderExports<TThemes> {
  const { themes, defaultTheme } = options;

  // Validate options
  if (!themes || themes.length === 0) {
    throw new Error('[Livery] themes array is required and must not be empty');
  }
  if (!themes.includes(defaultTheme)) {
    throw new Error(
      `[Livery] defaultTheme "${defaultTheme}" is not in themes: ${themes.join(', ')}`
    );
  }

  // Create context
  const ThemeContext = createContext<StaticThemeContextValue<TThemes> | null>(null);
  ThemeContext.displayName = 'StaticThemeContext';

  // Create provider component
  const StaticThemeProvider = createStaticThemeProviderComponent<TThemes>(
    themes,
    defaultTheme,
    ThemeContext
  );

  // Create hook
  function useTheme(): StaticThemeContextValue<TThemes> {
    const context = useContext(ThemeContext);
    if (context === null) {
      throw new Error('[Livery] useTheme must be used within a StaticThemeProvider');
    }
    return context;
  }

  return {
    StaticThemeProvider,
    useTheme,
    ThemeContext,
  };
}
