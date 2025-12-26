/**
 * Type definitions for @livery/react
 */

import type { Context, ReactNode } from 'react';
import type {
  Schema,
  SchemaDefinition,
  InferTheme,
  ThemePath,
  PathValue,
  ThemeResolver,
  CssVariableOptions,
} from '@livery/core';

// =============================================================================
// Dynamic Theme Provider Types
// =============================================================================

/**
 * CSS injection strategy for the DynamicThemeProvider
 */
export type InjectionMode = 'style-tag' | 'inline' | 'none';

/**
 * Options for createDynamicThemeProvider factory function
 */
export interface CreateDynamicThemeProviderOptions<T extends SchemaDefinition> {
  /** The schema defining the theme structure */
  readonly schema: Schema<T>;
}

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
 * Props for the DynamicThemeProvider component
 */
export interface DynamicThemeProviderProps<T extends SchemaDefinition> {
  /** Initial theme identifier - use setThemeId from useTheme() to change */
  readonly initialThemeId: string;
  /** Theme resolver from @livery/core */
  readonly resolver: ThemeResolver<T>;
  /** Pre-resolved theme for SSR (avoids hydration mismatch) */
  readonly initialTheme?: InferTheme<T>;
  /** Fallback UI while loading */
  readonly fallback?: ReactNode;
  /** Error callback */
  readonly onError?: (error: Error) => void;
  /** CSS injection strategy (default: 'style-tag') */
  readonly injection?: InjectionMode;
  /** CSS variable options (prefix, separator, etc.) */
  readonly cssOptions?: CssVariableOptions;
  /** Where to persist theme preference on change (default: 'none') */
  readonly persist?: PersistMode;
  /** Storage key name (default: 'theme') */
  readonly storageKey?: string;
  /** Cookie security options (only used when persist='cookie') */
  readonly cookieOptions?: CookieOptions;
  /** CSP nonce for style injection (for strict Content Security Policies) */
  readonly nonce?: string;
  /** Children */
  readonly children: ReactNode;
}

// =============================================================================
// State Machine Types
// =============================================================================

/**
 * Theme state machine - discriminated union ensuring only valid states exist.
 *
 * Valid states:
 * - idle: No theme loaded yet, no fetch in progress
 * - loading: Theme fetch in progress
 * - ready: Theme successfully loaded
 * - error: Theme fetch failed
 */
export type ThemeState<T extends SchemaDefinition> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly theme: InferTheme<T> }
  | { readonly status: 'error'; readonly error: Error };

/**
 * Context value provided by DynamicThemeProvider
 */
export interface DynamicThemeContextValue<T extends SchemaDefinition> {
  /** Current theme state (discriminated union) */
  readonly state: ThemeState<T>;
  /** Current theme identifier */
  readonly themeId: string;
  /** Function to change theme ID (triggers fetch) */
  readonly setThemeId: (themeId: string) => void;
  /** CSS variables as key-value object (empty if not ready) */
  readonly cssVariables: Record<string, string>;
  /** Function to manually refresh the theme */
  readonly refresh: () => Promise<void>;

  // Convenience accessors (all derived from state)
  /** The resolved theme (null if not ready) */
  readonly theme: InferTheme<T> | null;
  /** state.status === 'idle' */
  readonly isIdle: boolean;
  /** state.status === 'loading' */
  readonly isLoading: boolean;
  /** state.status === 'ready' */
  readonly isReady: boolean;
  /** state.status === 'error' */
  readonly isError: boolean;
  /** The error if state.status === 'error', otherwise null */
  readonly error: Error | null;
}

/**
 * Return type of createDynamicThemeProvider factory
 */
export interface DynamicThemeProviderExports<T extends SchemaDefinition> {
  /** React context provider component */
  readonly DynamicThemeProvider: React.FC<DynamicThemeProviderProps<T>>;
  /** Hook to access full theme and metadata */
  readonly useTheme: () => DynamicThemeContextValue<T>;
  /** Hook to access a single theme value by path */
  readonly useThemeValue: <P extends ThemePath<T>>(path: P) => PathValue<T, P>;
  /** Hook to check if theme is ready */
  readonly useThemeReady: () => boolean;
  /** The underlying React context (for advanced use) */
  readonly ThemeContext: Context<DynamicThemeContextValue<T> | null>;
}

// =============================================================================
// Store Types
// =============================================================================

/**
 * Internal state shape for the theme store.
 * Uses ThemeState discriminated union for type-safe state management.
 */
export interface ThemeStoreState<T extends SchemaDefinition> {
  readonly state: ThemeState<T>;
  readonly themeId: string | null;
  readonly cssVariables: Record<string, string>;
}

/**
 * Theme store interface for useSyncExternalStore
 */
export interface ThemeStore<T extends SchemaDefinition> {
  /** Get current snapshot */
  getSnapshot: () => ThemeStoreState<T>;
  /** Get server snapshot (for SSR) */
  getServerSnapshot: () => ThemeStoreState<T>;
  /** Subscribe to changes */
  subscribe: (callback: () => void) => () => void;
  /** Transition to ready state with theme */
  setReady: (theme: InferTheme<T>, cssVariables: Record<string, string>) => void;
  /** Transition to loading state */
  setLoading: () => void;
  /** Transition to error state */
  setError: (error: Error) => void;
  /** Set theme ID */
  setThemeId: (themeId: string) => void;
  /** Reset to idle state */
  reset: () => void;
}

// =============================================================================
// Server Types
// =============================================================================

/**
 * Options for getLiveryServerProps
 */
export interface GetLiveryServerPropsOptions<T extends SchemaDefinition> {
  /** The schema defining the theme structure */
  readonly schema: Schema<T>;
  /** The theme identifier */
  readonly themeId: string;
  /** Theme resolver from @livery/core */
  readonly resolver: ThemeResolver<T>;
  /** CSS variable options (prefix, separator, etc.) */
  readonly cssOptions?: CssVariableOptions;
}

/**
 * Return type of getLiveryServerProps
 */
export interface LiveryServerProps<T extends SchemaDefinition> {
  /** Pre-resolved theme for hydration */
  readonly initialTheme: InferTheme<T>;
  /** CSS string for critical styles */
  readonly css: string;
  /** Theme ID */
  readonly themeId: string;
}

/**
 * Props for LiveryScript component
 */
export interface LiveryScriptProps {
  /** CSS string to inject */
  readonly css: string;
  /** ID for the style element (default: 'livery-critical') */
  readonly id?: string;
  /** CSP nonce for style injection */
  readonly nonce?: string;
}

// =============================================================================
// Internal Types
// =============================================================================

/**
 * Internal props for CssInjector component
 */
export interface CssInjectorProps {
  /** CSS string to inject */
  readonly css: string;
  /** Unique ID for style element */
  readonly id: string;
  /** CSP nonce for style injection */
  readonly nonce?: string | undefined;
}
