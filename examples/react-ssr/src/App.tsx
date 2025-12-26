/**
 * SSR example - demonstrates server-side rendering with Livery
 */

import { useTheme, useThemeValue } from './livery';

function Header() {
  const brandName = useThemeValue('brand.name');
  const { themeId } = useTheme();

  return (
    <header
      style={{
        backgroundColor: 'var(--brand-primary)',
        color: 'white',
        padding: 'var(--spacing-md) var(--spacing-lg)',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{brandName}</h1>
        <span
          style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.875rem',
          }}
        >
          {themeId}
        </span>
      </div>
    </header>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--colors-surface)',
        border: '1px solid var(--colors-textMuted)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-md)',
      }}
    >
      <h2
        style={{
          margin: '0 0 var(--spacing-md)',
          color: 'var(--colors-text)',
          fontSize: '1.25rem',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function ThemeInfo() {
  const { cssVariables } = useTheme();
  const primary = useThemeValue('brand.primary');
  const secondary = useThemeValue('brand.secondary');

  return (
    <Card title="Theme Information">
      <p style={{ color: 'var(--colors-textMuted)', marginBottom: 'var(--spacing-md)' }}>
        This page was server-side rendered with the theme pre-loaded. No flash of unstyled content!
      </p>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: primary,
              borderRadius: 'var(--border-radius)',
              marginBottom: '8px',
            }}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--colors-textMuted)' }}>Primary</div>
          <code style={{ fontSize: '0.75rem' }}>{primary}</code>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: secondary,
              borderRadius: 'var(--border-radius)',
              marginBottom: '8px',
            }}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--colors-textMuted)' }}>Secondary</div>
          <code style={{ fontSize: '0.75rem' }}>{secondary}</code>
        </div>
      </div>
      <details>
        <summary style={{ cursor: 'pointer', color: 'var(--colors-textMuted)' }}>
          All CSS Variables ({Object.keys(cssVariables).length} tokens)
        </summary>
        <pre
          style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--colors-background)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.75rem',
            overflow: 'auto',
            maxHeight: '200px',
          }}
        >
          {JSON.stringify(cssVariables, null, 2)}
        </pre>
      </details>
    </Card>
  );
}

function SSRInfo() {
  return (
    <Card title="How SSR Works">
      <ol
        style={{
          color: 'var(--colors-text)',
          paddingLeft: 'var(--spacing-lg)',
          margin: 0,
          lineHeight: 1.8,
        }}
      >
        <li>Server receives request with tenant ID (from URL, cookie, etc.)</li>
        <li>
          <code>getLiveryServerProps()</code> fetches and resolves the theme
        </li>
        <li>
          <code>&lt;LiveryScript /&gt;</code> injects CSS variables into the HTML head
        </li>
        <li>
          <code>&lt;LiveryProvider initialTheme={'{...}'} /&gt;</code> hydrates with pre-loaded
          theme
        </li>
        <li>Client renders immediately with correct styles - no loading flash!</li>
      </ol>
    </Card>
  );
}

function ThemeSwitcher() {
  return (
    <Card title="Try Different Themes">
      <p style={{ color: 'var(--colors-textMuted)', marginBottom: 'var(--spacing-md)' }}>
        Each URL renders a different theme on the server:
      </p>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <a
          href="/?theme=acme"
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Acme Corp
        </a>
        <a
          href="/?theme=globex"
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--brand-secondary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Globex Inc
        </a>
      </div>
    </Card>
  );
}

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--colors-background)',
        color: 'var(--colors-text)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-lg)' }}>
        <ThemeInfo />
        <SSRInfo />
        <ThemeSwitcher />
      </main>
    </div>
  );
}
