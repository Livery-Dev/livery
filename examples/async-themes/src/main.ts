/**
 * Main entry point for the Livery vanilla JS example.
 *
 * This example demonstrates:
 * - Using @livery/core without any framework
 * - Runtime theme switching via button clicks
 * - CSS variables for all themeable values
 */

import { switchTheme, THEMES, type ThemeId } from './theme-manager';
import './style.css';

/**
 * Create the theme switcher UI component
 */
function createThemeSwitcher(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'theme-switcher';

  container.innerHTML = `
    <h3>Select Theme</h3>
    <div class="theme-buttons">
      ${THEMES.map(
        (theme) => `
        <button
          data-theme="${theme}"
          class="theme-btn"
        >
          ${theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      `
      ).join('')}
    </div>
    <p class="current-theme-info">
      Current theme: <strong id="current-theme">none</strong>
    </p>
  `;

  // Add click handlers
  container.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const target = e.target as HTMLButtonElement;
      const themeId = target.dataset.theme as ThemeId;

      // Switch theme
      await switchTheme(themeId);

      // Update button active states
      container.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
      target.classList.add('active');
    });
  });

  return container;
}

/**
 * Create the demo content showcasing theme capabilities
 */
function createDemoContent(): HTMLElement {
  const content = document.createElement('div');
  content.className = 'demo-content';

  content.innerHTML = `
    <div class="card hero-card">
      <h1>Welcome to <span id="brand-name" class="brand-name">Your App</span></h1>
      <p class="muted">
        This example demonstrates runtime theme switching with @livery/core.
        Click the theme buttons above to see the theme change instantly.
      </p>
      <div class="button-group">
        <button class="primary-btn">Primary Action</button>
        <button class="secondary-btn">Secondary Action</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h2>Color Palette</h2>
        <p class="muted">Brand colors and surfaces</p>
        <div class="color-swatches">
          <div class="swatch primary">
            <span>Primary</span>
          </div>
          <div class="swatch secondary">
            <span>Secondary</span>
          </div>
          <div class="swatch background">
            <span>Background</span>
          </div>
          <div class="swatch surface">
            <span>Surface</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Typography</h2>
        <p class="muted">Font family and sizing</p>
        <p class="typography-sample">
          The quick brown fox jumps over the lazy dog.
        </p>
        <p class="muted small">
          All text uses CSS variables for font-family, size, and line-height.
        </p>
      </div>

      <div class="card">
        <h2>Spacing & Borders</h2>
        <p class="muted">Consistent spacing scale</p>
        <div class="spacing-demo">
          <div class="spacing-box sm">sm</div>
          <div class="spacing-box md">md</div>
          <div class="spacing-box lg">lg</div>
        </div>
        <p class="muted small">
          Border radius is also controlled by the theme.
        </p>
      </div>
    </div>

    <div class="card">
      <h2>How It Works</h2>
      <p>
        Each theme has a JSON theme file in <code>/themes/</code>. When you click a theme button:
      </p>
      <ol>
        <li>The theme manager fetches the theme JSON</li>
        <li>@livery/core validates and merges with defaults</li>
        <li>CSS variables are generated and injected into the page</li>
        <li>All themed elements update instantly via CSS inheritance</li>
      </ol>
      <p class="muted">
        Check the browser DevTools to see the CSS variables on <code>:root</code>.
      </p>
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

  // Load the first theme by default
  const defaultTheme = THEMES[0];
  switchTheme(defaultTheme).then(() => {
    // Set the first button as active
    const firstBtn = document.querySelector(`[data-theme="${defaultTheme}"]`);
    firstBtn?.classList.add('active');
  });
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
