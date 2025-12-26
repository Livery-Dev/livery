/**
 * StaticThemeProvider component - provides theme context for static/bundled themes.
 *
 * For zero-flash theming, use with getThemeInitScript() in <head>.
 * The provider reads the current theme from the DOM (set by the init script)
 * and keeps React state in sync.
 */

import { useCallback, useMemo, useState } from 'react';
import type { StaticThemeProviderProps, StaticThemeContextValue, PersistMode, CookieOptions } from './types.js';

/**
 * Creates the internal provider component for static themes.
 * This is called by createStaticThemeProvider to generate a typed provider.
 */
export function createStaticThemeProviderComponent<TThemes extends readonly string[]>(
  themes: TThemes,
  defaultTheme: TThemes[number],
  ThemeContext: React.Context<StaticThemeContextValue<TThemes> | null>
): React.FC<StaticThemeProviderProps<TThemes>> {
  return function StaticThemeProvider({
    children,
    initialTheme,
    persist = 'localStorage',
    storageKey = 'theme',
    attribute = 'data-theme',
    cookieOptions,
    nonce: _nonce, // Reserved for future CSS injection; currently unused for static themes
  }: StaticThemeProviderProps<TThemes>) {
    // Determine initial theme by reading from DOM (set by init script) or fallback
    const getInitialTheme = (): TThemes[number] => {
      // SSR: use initialTheme prop if provided
      if (initialTheme) {
        return initialTheme;
      }

      // CSR: read from DOM attribute (set by getThemeInitScript)
      if (typeof document !== 'undefined') {
        const domTheme = document.documentElement.getAttribute(attribute);
        if (domTheme && themes.includes(domTheme)) {
          return domTheme as TThemes[number];
        }
      }

      return defaultTheme;
    };

    const [theme, setThemeState] = useState<TThemes[number]>(getInitialTheme);

    // setTheme: validates, updates React state, syncs DOM, and persists
    const setTheme = useCallback(
      (newTheme: string) => {
        if (!themes.includes(newTheme)) {
          if (typeof window !== 'undefined') {
            console.warn(
              `[Livery] Invalid theme "${newTheme}". Available themes: ${themes.join(', ')}`
            );
          }
          return;
        }

        const validTheme = newTheme as TThemes[number];
        setThemeState(validTheme);

        // Sync DOM attribute
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute(attribute, validTheme);
        }

        // Persist to storage
        writeToStorage(persist, storageKey, validTheme, cookieOptions);
      },
      [persist, storageKey, attribute, cookieOptions]
    );

    // Context value
    const contextValue = useMemo<StaticThemeContextValue<TThemes>>(
      () => ({
        theme,
        setTheme,
        themes,
      }),
      [theme, setTheme]
    );

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
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
