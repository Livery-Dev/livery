/**
 * Static Light/Dark Mode Example
 *
 * This example demonstrates the simplest approach to light/dark mode:
 * - Generate CSS for ALL themes upfront with toCssStringAll()
 * - Switch themes by changing the data-theme attribute
 * - No runtime CSS generation, no resolver, no async
 *
 * This is the recommended approach when you have a fixed set of themes
 * known at build time (like light/dark mode).
 */

import { themesCss, type ThemeId } from './themes';
import './style.css';

// Storage key for persisting theme preference
const STORAGE_KEY = 'livery-theme';

/**
 * Inject the pre-generated theme CSS into the document.
 * This only needs to happen once on page load.
 */
function injectThemeCss(): void {
  const style = document.createElement('style');
  style.id = 'livery-themes';
  style.textContent = themesCss;
  document.head.appendChild(style);
}

/**
 * Get the current theme from the document.
 */
function getCurrentTheme(): ThemeId {
  return (document.documentElement.dataset.theme as ThemeId) || 'light';
}

/**
 * Set the active theme by updating the data-theme attribute.
 * That's it! The CSS variables automatically update.
 */
function setTheme(theme: ThemeId): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  updateUI();
}

/**
 * Toggle between light and dark themes.
 */
function toggleTheme(): void {
  const current = getCurrentTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
}

/**
 * Get the user's preferred theme (from storage or system preference).
 */
function getPreferredTheme(): ThemeId {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Update UI elements to reflect current theme.
 */
function updateUI(): void {
  const theme = getCurrentTheme();

  // Update toggle button text
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'light' ? 'Switch to Dark' : 'Switch to Light';
  }

  // Update indicator
  const indicator = document.getElementById('theme-indicator');
  if (indicator) {
    indicator.textContent = theme;
  }
}

/**
 * Create the demo UI.
 */
function createUI(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <header class="header">
        <h1>Static Light/Dark Mode</h1>
        <button id="theme-toggle" class="toggle-btn">
          Switch to Dark
        </button>
      </header>

      <main class="main">
        <div class="card hero-card">
          <div class="badge">Simplest Approach</div>
          <h2>No Runtime CSS Generation</h2>
          <p class="muted">
            This example uses <code>toCssStringAll()</code> to generate CSS for both
            light and dark themes upfront. Switching themes is just changing the
            <code>data-theme</code> attribute — no JavaScript CSS generation needed.
          </p>
        </div>

        <div class="card-grid">
          <div class="card">
            <h3>How It Works</h3>
            <ol class="steps">
              <li>Define your schema with <code>createSchema()</code></li>
              <li>Create light and dark theme objects</li>
              <li>Generate CSS with <code>toCssStringAll()</code></li>
              <li>Inject CSS once on page load</li>
              <li>Toggle via <code>data-theme</code> attribute</li>
            </ol>
          </div>

          <div class="card">
            <h3>Color Palette</h3>
            <div class="color-swatches">
              <div class="swatch" style="background: var(--colors-primary)">
                <span>Primary</span>
              </div>
              <div class="swatch" style="background: var(--colors-surface)">
                <span>Surface</span>
              </div>
              <div class="swatch" style="background: var(--colors-muted)">
                <span>Muted</span>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Current Theme</h3>
            <p>
              Active: <strong id="theme-indicator">light</strong>
            </p>
            <p class="muted small">
              Your preference is saved to localStorage and respects system preference on first visit.
            </p>
          </div>
        </div>

        <div class="card">
          <h3>The Code</h3>
          <pre class="code-block"><code>// 1. Generate CSS for all themes at build time
const css = toCssStringAll({
  schema,
  themes: { light, dark },
  defaultTheme: 'light',
});

// 2. Inject once on page load
document.head.innerHTML += \`&lt;style>\${css}&lt;/style>\`;

// 3. Switch themes — that's it!
document.documentElement.dataset.theme = 'dark';</code></pre>
        </div>

        <div class="card">
          <h3>When to Use This Approach</h3>
          <ul class="checklist">
            <li><span class="check">✓</span> You have a fixed set of themes (light/dark)</li>
            <li><span class="check">✓</span> Themes are known at build time</li>
            <li><span class="check">✓</span> You want zero runtime overhead</li>
            <li><span class="check">✓</span> You don't need per-user or per-tenant themes</li>
          </ul>
          <p class="muted small" style="margin-top: 1rem">
            For dynamic themes (multi-tenant, user customization), see the other examples
            that use <code>createResolver()</code>.
          </p>
        </div>
      </main>
    </div>
  `;

  // Add event listener for toggle button
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn?.addEventListener('click', toggleTheme);
}

/**
 * Initialize the app.
 */
function init(): void {
  // 1. Inject the pre-generated theme CSS
  injectThemeCss();

  // 2. Apply the user's preferred theme
  setTheme(getPreferredTheme());

  // 3. Create the UI
  createUI();

  // 4. Update UI to match current theme
  updateUI();

  // 5. Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't explicitly set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
