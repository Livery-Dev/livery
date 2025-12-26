'use client';

import { useTheme, useThemeValue } from '@/lib/livery';

/**
 * Example component showing different theme values
 */
function ThemePreview() {
  const { themeId, theme, isReady } = useTheme();
  const primary = useThemeValue('brand.primary');
  const secondary = useThemeValue('brand.secondary');
  const accent = useThemeValue('brand.accent');

  if (!isReady || !theme) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
        Theme Preview for <code>{themeId}</code>
      </h2>

      <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: primary,
          }}
          title="Primary"
        />
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: secondary,
          }}
          title="Secondary"
        />
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: accent,
          }}
          title="Accent"
        />
      </div>

      <div className="flex gap-sm">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
      </div>
    </div>
  );
}

/**
 * Navigation between different themes
 */
function ThemeNav() {
  const themes = ['acme', 'beta', 'gamma', 'default'];

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Try Different Themes</h2>
      <p className="text-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
        Click a theme to see the custom styling. The URL pattern is <code>/t/[theme]/</code>
      </p>
      <div className="flex gap-sm">
        {themes.map((theme) => (
          <a
            key={theme}
            href={`/t/${theme}/`}
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            {theme}
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Main page component
 */
export default function Home() {
  const { themeId } = useTheme();

  return (
    <main className="container">
      <header style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
          Livery Next.js Example
        </h1>
        <p className="text-secondary">Multi-tenant theming with @livery/next and App Router</p>
      </header>

      <ThemeNav />
      <ThemePreview />

      <section className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>How It Works</h2>
        <ol style={{ paddingLeft: 'var(--spacing-lg)' }}>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>
            <strong>Middleware:</strong> Extracts theme ID from URL path <code>/t/[theme]/</code>
          </li>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>
            <strong>Server Component:</strong> Resolves theme data in <code>layout.tsx</code> using{' '}
            <code>getLiveryData</code>
          </li>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>
            <strong>Critical CSS:</strong> Injects theme CSS variables in <code>&lt;head&gt;</code>{' '}
            to prevent flash
          </li>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>
            <strong>LiveryProvider:</strong> Provides theme context with <code>initialTheme</code>{' '}
            for instant hydration
          </li>
          <li>
            <strong>CSS Variables:</strong> Use <code>var(--brand-primary)</code> etc. throughout
            your styles
          </li>
        </ol>
      </section>

      <footer className="text-center text-muted" style={{ marginTop: 'var(--spacing-xl)' }}>
        <p>
          Current theme: <code>{themeId}</code>
        </p>
      </footer>
    </main>
  );
}
