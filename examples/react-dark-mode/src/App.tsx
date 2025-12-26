/**
 * Dark Mode example - demonstrates light/dark theme switching per tenant
 */

import { useEffect } from 'react';
import {
  DynamicThemeProvider,
  useTheme,
  useThemeValue,
  resolver,
  THEMES,
  createThemeId,
  parseThemeId,
  type ThemeId,
} from './livery';

/**
 * Header with theme and mode selectors - uses useTheme() to change themes
 */
function Header() {
  const brandName = useThemeValue('brand.name');
  const { themeId, setThemeId } = useTheme();
  const { theme, mode } = parseThemeId(themeId);

  const handleThemeChange = (newTheme: ThemeId) => {
    setThemeId(createThemeId(newTheme, mode));
  };

  const handleModeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setThemeId(createThemeId(theme, newMode));
  };

  return (
    <header className="header">
      <h1>{brandName}</h1>
      <div className="header-controls">
        <select
          className="theme-select"
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value as ThemeId)}
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button className="theme-toggle" onClick={handleModeToggle}>
          <span className="theme-toggle-icon">{mode === 'light' ? '🌙' : '☀️'}</span>
          {mode === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}

function ColorPalette() {
  const { cssVariables } = useTheme();
  const colors = [
    { name: 'background', var: '--colors-background' },
    { name: 'surface', var: '--colors-surface' },
    { name: 'surfaceHover', var: '--colors-surfaceHover' },
    { name: 'border', var: '--colors-border' },
    { name: 'text', var: '--colors-text' },
    { name: 'textMuted', var: '--colors-textMuted' },
    { name: 'primary', var: '--brand-primary' },
    { name: 'primaryHover', var: '--brand-primaryHover' },
  ];

  return (
    <div className="card">
      <h2>Color Palette</h2>
      <p>Current theme colors automatically update when switching modes.</p>
      <div className="color-grid">
        {colors.map(({ name, var: cssVar }) => {
          const value = cssVariables[cssVar.replace('--', '')] || '';
          return (
            <div key={name} className="color-item">
              <div className="color-swatch" style={{ backgroundColor: `var(${cssVar})` }} />
              <div className="color-label">{name}</div>
              <div className="color-value">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComponentShowcase() {
  return (
    <div className="card">
      <h2>Component Examples</h2>
      <p>These components automatically adapt to the current theme.</p>

      <div className="form-group">
        <label className="form-label">Text Input</label>
        <input type="text" className="input" placeholder="Type something..." />
      </div>

      <div className="button-group">
        <button className="button button-primary">Primary Button</button>
        <button className="button button-secondary">Secondary Button</button>
      </div>
    </div>
  );
}

function ThemeInfo() {
  const { themeId, cssVariables } = useTheme();

  return (
    <div className="card">
      <h2>Theme Information</h2>
      <p>
        Current theme: <span className="badge">{themeId}</span>
      </p>
      <details style={{ marginTop: 'var(--spacing-md)' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--colors-textMuted)' }}>
          View all CSS variables ({Object.keys(cssVariables).length} tokens)
        </summary>
        <pre
          style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            background: 'var(--colors-background)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.75rem',
            overflow: 'auto',
            maxHeight: '200px',
          }}
        >
          {JSON.stringify(cssVariables, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function MainContent() {
  return (
    <main className="main">
      <ColorPalette />
      <ComponentShowcase />
      <ThemeInfo />
    </main>
  );
}

function LoadingFallback() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading theme...</p>
    </div>
  );
}

/**
 * Detects system color scheme preference and updates theme accordingly
 */
function SystemPreferenceDetector() {
  const { themeId, setThemeId } = useTheme();
  const { theme } = parseThemeId(themeId);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial mode based on system preference
    const prefersDark = mediaQuery.matches;
    if (prefersDark) {
      setThemeId(createThemeId(theme, 'dark'));
    }

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeId(createThemeId(theme, e.matches ? 'dark' : 'light'));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function ThemedApp() {
  return (
    <div className="app">
      <SystemPreferenceDetector />
      <Header />
      <MainContent />
    </div>
  );
}

export default function App() {
  // Start with light mode, SystemPreferenceDetector will update if needed
  const initialThemeId = createThemeId('acme', 'light');

  return (
    <DynamicThemeProvider
      initialThemeId={initialThemeId}
      resolver={resolver}
      fallback={<LoadingFallback />}
      onError={(error: Error) => console.error('Theme error:', error)}
    >
      <ThemedApp />
    </DynamicThemeProvider>
  );
}
