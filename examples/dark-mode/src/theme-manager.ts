/**
 * Theme manager with dark mode support.
 *
 * Demonstrates:
 * - Light/dark mode per tenant
 * - System preference detection (prefers-color-scheme)
 * - Manual toggle override
 * - Persistence via localStorage
 */

import { toCssString } from '@livery/core';
import { schema, type AppTheme } from './schema';
import { themes, THEME_IDS, COLOR_SCHEMES, type ThemeId, type ColorScheme } from './themes';

const STORAGE_KEY = 'livery-color-scheme';

let currentThemeId: ThemeId = THEME_IDS[0];
let currentColorScheme: ColorScheme = 'light';
let useSystemPreference = true;

/**
 * Get the system's preferred color scheme.
 */
function getSystemColorScheme(): ColorScheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get the stored color scheme preference, if any.
 */
function getStoredColorScheme(): ColorScheme | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return null;
}

/**
 * Store the color scheme preference.
 */
function storeColorScheme(scheme: ColorScheme | null): void {
  if (typeof localStorage === 'undefined') return;
  if (scheme === null) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, scheme);
  }
}

/**
 * Inject theme CSS variables into the document.
 */
function injectThemeStyles(css: string): void {
  let styleEl = document.getElementById('livery-theme') as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'livery-theme';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
}

/**
 * Apply a theme to the document.
 */
function applyTheme(theme: AppTheme): void {
  const css = toCssString({ schema, theme });
  injectThemeStyles(css);
}

/**
 * Update the UI to reflect current state.
 */
function updateUI(): void {
  // Update brand name
  const brandNameEl = document.getElementById('brand-name');
  if (brandNameEl) {
    const theme = themes[currentThemeId][currentColorScheme];
    brandNameEl.textContent = theme.brand.name;
  }

  // Update color scheme indicator
  const schemeIndicator = document.getElementById('color-scheme-indicator');
  if (schemeIndicator) {
    schemeIndicator.textContent = currentColorScheme;
  }

  // Update body class for transitions
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(currentColorScheme);
}

/**
 * Apply the current theme (theme ID + color scheme).
 */
function applyCurrentTheme(): void {
  const theme = themes[currentThemeId][currentColorScheme];
  applyTheme(theme);
  updateUI();

  // Dispatch event for UI updates
  window.dispatchEvent(
    new CustomEvent('livery:theme-changed', {
      detail: { themeId: currentThemeId, colorScheme: currentColorScheme },
    })
  );
}

/**
 * Switch to a different theme.
 */
export function switchTheme(themeId: ThemeId): void {
  currentThemeId = themeId;
  console.log(`[Livery] Switched theme to: ${themeId}`);
  applyCurrentTheme();
}

/**
 * Switch to a specific color scheme (light/dark).
 * Disables system preference tracking.
 */
export function setColorScheme(scheme: ColorScheme): void {
  currentColorScheme = scheme;
  useSystemPreference = false;
  storeColorScheme(scheme);
  console.log(`[Livery] Set color scheme to: ${scheme}`);
  applyCurrentTheme();
}

/**
 * Toggle between light and dark mode.
 */
export function toggleColorScheme(): void {
  const newScheme = currentColorScheme === 'light' ? 'dark' : 'light';
  setColorScheme(newScheme);
}

/**
 * Reset to follow system preference.
 */
export function useSystemColorScheme(): void {
  useSystemPreference = true;
  storeColorScheme(null);
  currentColorScheme = getSystemColorScheme();
  console.log(`[Livery] Using system preference: ${currentColorScheme}`);
  applyCurrentTheme();
}

/**
 * Get current state.
 */
export function getCurrentThemeId(): ThemeId {
  return currentThemeId;
}

export function getCurrentColorScheme(): ColorScheme {
  return currentColorScheme;
}

export function isUsingSystemPreference(): boolean {
  return useSystemPreference;
}

export function getThemeIds(): readonly ThemeId[] {
  return THEME_IDS;
}

export function getColorSchemes(): readonly ColorScheme[] {
  return COLOR_SCHEMES;
}

/**
 * Initialize theme manager.
 * Sets up system preference listener and applies initial theme.
 */
export function initializeTheme(): void {
  // Check for stored preference
  const stored = getStoredColorScheme();
  if (stored) {
    currentColorScheme = stored;
    useSystemPreference = false;
  } else {
    currentColorScheme = getSystemColorScheme();
    useSystemPreference = true;
  }

  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (useSystemPreference) {
      currentColorScheme = e.matches ? 'dark' : 'light';
      console.log(`[Livery] System preference changed to: ${currentColorScheme}`);
      applyCurrentTheme();
    }
  });

  // Apply initial theme
  applyCurrentTheme();
}

export type { ThemeId, ColorScheme };
