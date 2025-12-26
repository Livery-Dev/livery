/**
 * Type definitions for createStaticThemeProvider
 */

import type { Context, ReactNode } from 'react';

// =============================================================================
// Factory Types
// =============================================================================

/**
 * Options for createStaticThemeProvider factory function
 */
export interface CreateStaticThemeProviderOptions<
  TThemes extends readonly string[],
> {
  /** Array of available theme names (use `as const` for type inference) */
  readonly themes: TThemes;
  /** Default theme to use as fallback */
  readonly defaultTheme: TThemes[number];
}

/**
 * Return type of createStaticThemeProvider factory
 */
export interface StaticThemeProviderExports<
  TThemes extends readonly string[],
> {
  /** React context provider component */
  readonly StaticThemeProvider: React.FC<StaticThemeProviderProps<TThemes>>;
  /** Hook to access theme and setTheme */
  readonly useTheme: () => StaticThemeContextValue<TThemes>;
  /** The underlying React context (for advanced use) */
  readonly ThemeContext: Context<StaticThemeContextValue<TThemes> | null>;
}

// =============================================================================
// Provider Types
// =============================================================================

/**
 * Persistence strategy for theme preference
 */
export type PersistMode = 'localStorage' | 'cookie' | 'none';

/**
 * Cookie security options for theme persistence
 */
export interface CookieOptions {
  /** SameSite attribute for CSRF protection. Default: 'Lax' */
  readonly sameSite?: 'Strict' | 'Lax' | 'None';
  /** Force Secure flag. Default: auto-detect from protocol (true on HTTPS) */
  readonly secure?: boolean;
  /** Max age in seconds. Default: 31536000 (1 year) */
  readonly maxAge?: number;
  /** Cookie path. Default: '/' */
  readonly path?: string;
}

/**
 * Props for the StaticThemeProvider component
 */
export interface StaticThemeProviderProps<TThemes extends readonly string[]> {
  /** Children */
  readonly children: ReactNode;
  /** Initial theme for SSR (skips DOM detection) */
  readonly initialTheme?: TThemes[number];
  /** Where to persist theme preference on change (default: 'localStorage') */
  readonly persist?: PersistMode;
  /** Storage key name (default: 'theme') */
  readonly storageKey?: string;
  /** DOM attribute to sync (default: 'data-theme') */
  readonly attribute?: string;
  /** Cookie security options (only used when persist='cookie') */
  readonly cookieOptions?: CookieOptions;
  /** CSP nonce for style injection (for strict Content Security Policies) */
  readonly nonce?: string;
}

// =============================================================================
// Context Types
// =============================================================================

/**
 * Context value provided by StaticThemeProvider
 */
export interface StaticThemeContextValue<TThemes extends readonly string[]> {
  /** Current theme name */
  readonly theme: TThemes[number];
  /** Function to change theme */
  readonly setTheme: (theme: TThemes[number]) => void;
  /** Array of available theme names */
  readonly themes: TThemes;
}
