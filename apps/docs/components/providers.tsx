'use client';

import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { ThemeName } from '../lib/themes';

/**
 * Theme switcher context for the docs site.
 * Allows components to read and change the current theme.
 *
 * Since all theme CSS is pre-generated and injected server-side via toCssStringAll,
 * theme switching only requires changing the data-theme attribute on <html>.
 * No runtime CSS regeneration, no loading states, no jitter.
 */
interface ThemeSwitcherContextValue {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeSwitcherContext = createContext<ThemeSwitcherContextValue | null>(null);

export function useThemeSwitcher() {
  const context = useContext(ThemeSwitcherContext);
  if (!context) {
    throw new Error('useThemeSwitcher must be used within Providers');
  }
  return context;
}

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root providers for the docs site.
 *
 * Theme switching is handled via data-theme attribute on the document root.
 * All theme CSS is pre-generated server-side using toCssStringAll, so switching
 * themes is instant with no CSS regeneration or loading states.
 */
export function Providers({ children }: ProvidersProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');

  const setTheme = useCallback((theme: ThemeName) => {
    setCurrentTheme(theme);
    // Update the data-theme attribute on the document root
    // This instantly switches to the new theme since all CSS is pre-generated
    document.documentElement.dataset.theme = theme;
  }, []);

  return (
    <ThemeSwitcherContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeSwitcherContext.Provider>
  );
}
