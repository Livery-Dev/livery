/**
 * Main entry point for the Livery TypeScript example.
 *
 * This example demonstrates:
 * - Full type safety with bundled TypeScript themes
 * - Synchronous theme loading (no async/await needed)
 * - Dropdown-based theme selector
 */

import { switchTheme, getThemeIds, type ThemeId, initializeTheme } from './theme-manager';
import './style.css';

/**
 * Format theme ID for display
 */
function formatThemeName(themeId: string): string {
  return themeId.charAt(0).toUpperCase() + themeId.slice(1);
}

/**
 * Create the theme switcher with dropdown
 */
function createThemeSwitcher(): HTMLElement {
  const themeIds = getThemeIds();

  const container = document.createElement('div');
  container.className = 'theme-switcher';

  container.innerHTML = `
    <div class="switcher-header">
      <h3>Theme Switcher</h3>
      <p class="muted">Select a theme to change the appearance</p>
    </div>
    <div class="switcher-controls">
      <label for="theme-select">Theme:</label>
      <select id="theme-select" class="theme-select">
        ${themeIds
          .map(
            (id) => `
          <option value="${id}">${formatThemeName(id)}</option>
        `
          )
          .join('')}
      </select>
    </div>
  `;

  // Add change handler
  const select = container.querySelector('#theme-select') as HTMLSelectElement;
  select.addEventListener('change', () => {
    const themeId = select.value as ThemeId;
    switchTheme(themeId);
  });

  return container;
}

/**
 * Create the demo content
 */
function createDemoContent(): HTMLElement {
  const content = document.createElement('div');
  content.className = 'demo-content';

  content.innerHTML = `
    <div class="card hero-card">
      <div class="badge">TypeScript Example</div>
      <h1>Welcome to <span id="brand-name" class="brand-name">Your App</span></h1>
      <p class="muted">
        This example uses TypeScript modules for theme definitions.
        Themes are type-checked at build time - no runtime validation needed!
      </p>
      <div class="button-group">
        <button class="primary-btn">Primary Action</button>
        <button class="secondary-btn">Secondary Action</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h2>Type-Safe Themes</h2>
        <p class="muted">Each theme is a TypeScript file</p>
        <pre class="code-block"><code>// themes/acme.ts
export const acmeTheme: AppTheme = {
  brand: {
    name: 'Acme Corp',
    primary: '#ef4444', // ✓ valid
    // oops: 123  // ✗ type error!
  },
  // ...
};</code></pre>
      </div>

      <div class="card">
        <h2>Color Palette</h2>
        <p class="muted">Brand colors adapt per tenant</p>
        <div class="color-swatches">
          <div class="swatch primary"><span>Primary</span></div>
          <div class="swatch secondary"><span>Secondary</span></div>
          <div class="swatch background"><span>Background</span></div>
          <div class="swatch surface"><span>Surface</span></div>
        </div>
      </div>

      <div class="card">
        <h2>Typography</h2>
        <p class="muted">Font settings from theme</p>
        <p class="typography-sample">
          The quick brown fox jumps over the lazy dog.
        </p>
        <div class="font-info">
          <code>var(--typography-font-family)</code>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Define Schema</h4>
            <p>Create a schema with <code>createSchema()</code></p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Create Themes</h4>
            <p>Write TypeScript files that satisfy <code>AppTheme</code></p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Apply Theme</h4>
            <p>Use <code>toCssString()</code> to generate CSS variables</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>Use in CSS</h4>
            <p>Reference with <code>var(--brand-primary)</code></p>
          </div>
        </div>
      </div>
    </div>
  `;

  return content;
}

/**
 * Initialize the application
 */
function init(): void {
  const app = document.getElementById('app');

  if (!app) {
    console.error('App container not found');
    return;
  }

  // Build the UI
  app.appendChild(createThemeSwitcher());
  app.appendChild(createDemoContent());

  // Initialize with the first theme
  initializeTheme();

  // Listen for theme changes to update select state
  window.addEventListener('livery:theme-changed', ((event: CustomEvent) => {
    const select = document.getElementById('theme-select') as HTMLSelectElement;
    if (select && event.detail.themeId) {
      select.value = event.detail.themeId;
    }
  }) as EventListener);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
