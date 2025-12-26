/**
 * Main App component demonstrating @livery/react usage.
 */

import {
  DynamicThemeProvider,
  useTheme,
  useThemeValue,
  resolver,
  THEMES,
} from './livery';

/**
 * Header component using theme values
 */
function Header() {
  const brandName = useThemeValue('brand.name');
  const { themeId } = useTheme();

  return (
    <header className="header">
      <h1>{brandName}</h1>
      <span className="theme-badge">Theme: {themeId}</span>
    </header>
  );
}

/**
 * Card component demonstrating theme usage
 */
function ThemeCard() {
  const primary = useThemeValue('brand.primary');
  const secondary = useThemeValue('brand.secondary');
  const { cssVariables } = useTheme();

  return (
    <div className="card">
      <h2>Current Theme</h2>
      <div className="color-swatch">
        <div className="swatch" style={{ backgroundColor: primary }}>
          <span>Primary</span>
          <code>{primary}</code>
        </div>
        <div className="swatch" style={{ backgroundColor: secondary }}>
          <span>Secondary</span>
          <code>{secondary}</code>
        </div>
      </div>
      <details>
        <summary>All CSS Variables</summary>
        <pre>{JSON.stringify(cssVariables, null, 2)}</pre>
      </details>
    </div>
  );
}

/**
 * Demo button using theme colors
 */
function DemoButton() {
  return <button className="demo-button">Themed Button</button>;
}

/**
 * Main content area
 */
function MainContent() {
  return (
    <main className="main">
      <ThemeCard />
      <div className="card">
        <h2>Interactive Demo</h2>
        <p>
          This example demonstrates how @livery/react provides theme values to your components
          through React context. All components below automatically update when you switch themes.
        </p>
        <DemoButton />
      </div>
    </main>
  );
}

/**
 * Theme selector - uses useTheme() hook to change themes
 */
function ThemeSelector() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="theme-selector">
      <label>Select Theme:</label>
      <div className="theme-buttons">
        {THEMES.map((theme) => (
          <button
            key={theme}
            className={`theme-button ${theme === themeId ? 'active' : ''}`}
            onClick={() => setThemeId(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading fallback
 */
function LoadingFallback() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Loading theme...</p>
    </div>
  );
}

/**
 * Main App with provider
 */
export default function App() {
  return (
    <DynamicThemeProvider
      initialThemeId="acme"
      resolver={resolver}
      fallback={<LoadingFallback />}
      onError={(error: Error) => console.error('Theme error:', error)}
    >
      <div className="app-wrapper">
        <ThemeSelector />
        <div className="app">
          <Header />
          <MainContent />
        </div>
      </div>
    </DynamicThemeProvider>
  );
}
