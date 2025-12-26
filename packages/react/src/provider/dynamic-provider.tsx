/**
 * DynamicThemeProvider component - provides theme context for runtime-fetched themes
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { toCssVariables, toCssString } from '@livery/core';
import type { SchemaDefinition, Schema } from '@livery/core';
import type { DynamicThemeProviderProps, DynamicThemeContextValue, ThemeState, PersistMode, CookieOptions } from '../types/index.js';
import { CssInjector } from '../css/css-injector.js';

/**
 * Creates the internal provider component for a schema.
 * This is called by createDynamicThemeProvider to generate a typed provider.
 */
export function createDynamicThemeProviderComponent<T extends SchemaDefinition>(
  schema: Schema<T>,
  ThemeContext: React.Context<DynamicThemeContextValue<T> | null>
): React.FC<DynamicThemeProviderProps<T>> {
  return function DynamicThemeProvider({
    initialThemeId,
    resolver,
    initialTheme,
    fallback,
    onError,
    injection = 'style-tag',
    cssOptions,
    persist = 'none',
    storageKey = 'theme',
    cookieOptions,
    nonce,
    children,
  }: DynamicThemeProviderProps<T>) {
    // Track current themeId (can be changed via setThemeId hook)
    const [themeId, setThemeIdState] = useState(initialThemeId);

    // State machine - only valid states possible
    const [state, setState] = useState<ThemeState<T>>(() => {
      if (initialTheme) {
        return { status: 'ready', theme: initialTheme };
      }
      return { status: 'idle' };
    });

    // Ref to track current theme for request cancellation
    const currentThemeIdRef = useRef(themeId);
    const mountedRef = useRef(true);
    // Track if we should skip the initial fetch (when initialTheme is provided)
    const skipInitialFetchRef = useRef(!!initialTheme);

    // Derive theme from state (type-safe extraction)
    const theme = state.status === 'ready' ? state.theme : null;

    // Compute CSS variables from theme
    const cssVariables = useMemo<Record<string, string>>(() => {
      if (!theme) {
        return {};
      }

      if (cssOptions) {
        return toCssVariables({ schema, theme, options: cssOptions });
      }

      return toCssVariables({ schema, theme });
    }, [theme, cssOptions]);

    // Generate CSS string for style-tag injection
    const cssString = useMemo<string>(() => {
      if (!theme) {
        return '';
      }
      return cssOptions
        ? toCssString({ schema, theme, options: cssOptions })
        : toCssString({ schema, theme });
    }, [theme, cssOptions]);

    // Fetch theme helper
    const fetchTheme = useCallback(async (): Promise<void> => {
      // Transition to loading
      setState({ status: 'loading' });

      try {
        const resolved = await resolver.resolve({ themeId });
        if (mountedRef.current && currentThemeIdRef.current === themeId) {
          // Transition to ready
          setState({ status: 'ready', theme: resolved });
        }
      } catch (err) {
        if (mountedRef.current && currentThemeIdRef.current === themeId) {
          const resolveError = err instanceof Error ? err : new Error(String(err));
          // Transition to error
          setState({ status: 'error', error: resolveError });
          onError?.(resolveError);
        }
      }
    }, [themeId, resolver, onError]);

    // Refresh function (exposed to consumers)
    const refresh = useCallback(async (): Promise<void> => {
      await fetchTheme();
    }, [fetchTheme]);

    // setThemeId wrapper that also persists to storage
    const setThemeId = useCallback(
      (newThemeId: string) => {
        setThemeIdState(newThemeId);
        writeToStorage(persist, storageKey, newThemeId, cookieOptions);
      },
      [persist, storageKey, cookieOptions]
    );

    // Fetch theme on mount and theme change
    useEffect(() => {
      mountedRef.current = true;
      currentThemeIdRef.current = themeId;

      // Skip the very first fetch if initialTheme was provided
      if (skipInitialFetchRef.current) {
        skipInitialFetchRef.current = false;
        return;
      }

      void fetchTheme();

      return () => {
        mountedRef.current = false;
      };
    }, [themeId, fetchTheme]);

    // Context value with both state machine and convenience accessors
    const contextValue = useMemo<DynamicThemeContextValue<T>>(
      () => ({
        // Primary state machine
        state,
        themeId,
        setThemeId,
        cssVariables,
        refresh,
        // Convenience accessors (all derived from state)
        theme: state.status === 'ready' ? state.theme : null,
        isIdle: state.status === 'idle',
        isLoading: state.status === 'loading',
        isReady: state.status === 'ready',
        isError: state.status === 'error',
        error: state.status === 'error' ? state.error : null,
      }),
      [state, themeId, setThemeId, cssVariables, refresh]
    );

    // Render loading state
    if (state.status === 'loading' && fallback !== undefined) {
      return <ThemeContext.Provider value={contextValue}>{fallback}</ThemeContext.Provider>;
    }

    // Also show fallback for idle state (initial load without initialTheme)
    if (state.status === 'idle' && fallback !== undefined) {
      return <ThemeContext.Provider value={contextValue}>{fallback}</ThemeContext.Provider>;
    }

    // Render based on injection mode
    const renderChildren = (): React.ReactNode => {
      switch (injection) {
        case 'style-tag':
          return (
            <>
              {cssString && <CssInjector css={cssString} id={`livery-${themeId}`} nonce={nonce} />}
              {children}
            </>
          );

        case 'inline': {
          const style: CSSProperties = {};
          for (const [key, value] of Object.entries(cssVariables)) {
            // Convert CSS variable name to React style property
            // e.g., '--colors-primary' stays as is (React handles this)
            (style as Record<string, string>)[key] = value;
          }
          return <div style={style}>{children}</div>;
        }

        case 'none':
        default:
          return children;
      }
    };

    return <ThemeContext.Provider value={contextValue}>{renderChildren()}</ThemeContext.Provider>;
  };
}

// =============================================================================
// Storage Helpers
// =============================================================================

/** Default cookie options with secure defaults */
const DEFAULT_COOKIE_OPTIONS: Required<CookieOptions> = {
  sameSite: 'Lax',
  secure: false, // Will be auto-detected from protocol
  maxAge: 31536000, // 1 year
  path: '/',
};

function writeToStorage(
  persist: PersistMode,
  storageKey: string,
  value: string,
  cookieOptions?: CookieOptions
): void {
  if (typeof window === 'undefined') return;

  switch (persist) {
    case 'localStorage':
      try {
        localStorage.setItem(storageKey, value);
      } catch {
        // Ignore errors (e.g., storage full, private browsing)
      }
      break;

    case 'cookie':
      try {
        const opts = { ...DEFAULT_COOKIE_OPTIONS, ...cookieOptions };
        // Auto-detect Secure flag from protocol if not explicitly set
        const isSecure = cookieOptions?.secure ?? window.location.protocol === 'https:';

        let cookie = `${storageKey}=${encodeURIComponent(value)}`;
        cookie += `;path=${opts.path}`;
        cookie += `;max-age=${opts.maxAge}`;
        cookie += `;SameSite=${opts.sameSite}`;
        if (isSecure) cookie += ';Secure';

        document.cookie = cookie;
      } catch {
        // Ignore errors
      }
      break;

    case 'none':
    default:
      break;
  }
}
