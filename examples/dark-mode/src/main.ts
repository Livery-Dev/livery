/**
 * Main entry point for the dark mode example.
 *
 * Demonstrates:
 * - Light/dark mode toggle per tenant
 * - System preference detection
 * - Smooth transitions between modes
 */

import {
  switchTheme,
  setColorScheme,
  toggleColorScheme,
  useSystemColorScheme,
  getCurrentColorScheme,
  isUsingSystemPreference,
  getThemeIds,
  initializeTheme,
  type ThemeId,
  type ColorScheme,
} from './theme-manager';
import './style.css';

function formatName(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Create the theme controls panel.
 */
function createControls(): HTMLElement {
  const themeIds = getThemeIds();

  const container = document.createElement('div');
  container.className = 'controls';

  container.innerHTML = `
    <div class="control-group">
      <h3>Theme</h3>
      <select id="theme-select" class="select">
        ${themeIds.map((id) => `<option value="${id}">${formatName(id)}</option>`).join('')}
      </select>
    </div>

    <div class="control-group">
      <h3>Color Scheme</h3>
      <div class="scheme-controls">
        <button id="light-btn" class="scheme-btn" data-scheme="light">
          <span class="icon">☀️</span> Light
        </button>
        <button id="dark-btn" class="scheme-btn" data-scheme="dark">
          <span class="icon">🌙</span> Dark
        </button>
        <button id="system-btn" class="scheme-btn" data-scheme="system">
          <span class="icon">💻</span> System
        </button>
      </div>
    </div>

    <div class="control-group">
      <h3>Quick Toggle</h3>
      <button id="toggle-btn" class="toggle-btn">
        Toggle Dark Mode
      </button>
    </div>
  `;

  // Theme select handler
  const themeSelect = container.querySelector('#theme-select') as HTMLSelectElement;
  themeSelect.addEventListener('change', () => {
    switchTheme(themeSelect.value as ThemeId);
  });

  // Scheme button handlers
  container.querySelectorAll('.scheme-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const scheme = target.dataset.scheme;

      if (scheme === 'system') {
        useSystemColorScheme();
      } else {
        setColorScheme(scheme as ColorScheme);
      }

      updateSchemeButtons();
    });
  });

  // Toggle button handler
  const toggleBtn = container.querySelector('#toggle-btn') as HTMLButtonElement;
  toggleBtn.addEventListener('click', toggleColorScheme);

  return container;
}

/**
 * Update scheme button active states.
 */
function updateSchemeButtons(): void {
  const currentScheme = getCurrentColorScheme();
  const usingSystem = isUsingSystemPreference();

  document.querySelectorAll('.scheme-btn').forEach((btn) => {
    const scheme = (btn as HTMLButtonElement).dataset.scheme;
    btn.classList.remove('active');

    if (usingSystem && scheme === 'system') {
      btn.classList.add('active');
    } else if (!usingSystem && scheme === currentScheme) {
      btn.classList.add('active');
    }
  });
}

/**
 * Create demo content.
 */
function createDemoContent(): HTMLElement {
  const content = document.createElement('div');
  content.className = 'demo-content';

  content.innerHTML = `
    <div class="card hero-card">
      <h1>Welcome to <span id="brand-name" class="brand-name">Your App</span></h1>
      <p class="muted">
        This example shows light and dark mode support per theme.
        Each theme has unique color schemes for both modes.
      </p>
      <div class="button-group">
        <button class="primary-btn">Primary Action</button>
        <button class="secondary-btn">Secondary Action</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h2>Automatic Detection</h2>
        <p class="muted">Respects system preference</p>
        <p>
          When set to "System", the theme automatically switches based on your
          OS dark mode setting. Try changing your system preference!
        </p>
        <p class="small muted">
          Current: <strong id="color-scheme-indicator">light</strong>
        </p>
      </div>

      <div class="card">
        <h2>Color Palette</h2>
        <p class="muted">Adapts to light/dark mode</p>
        <div class="color-swatches">
          <div class="swatch primary"><span>Primary</span></div>
          <div class="swatch secondary"><span>Secondary</span></div>
          <div class="swatch background"><span>Background</span></div>
          <div class="swatch surface"><span>Surface</span></div>
        </div>
      </div>

      <div class="card">
        <h2>Persistence</h2>
        <p class="muted">Remembers your choice</p>
        <p>
          Your color scheme preference is saved to localStorage.
          Refresh the page - it will remember your choice!
        </p>
      </div>
    </div>

    <div class="card">
      <h2>How It Works</h2>
      <pre class="code-block"><code>// Each theme has light and dark variants
const themes: Record&lt;ThemeId, Record&lt;ColorScheme, AppTheme&gt;&gt; = {
  acme: {
    light: acmeLightTheme,
    dark: acmeDarkTheme,
  },
  // ...
};

// Get theme for current theme ID and scheme
const theme = themes[themeId][colorScheme];

// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
</code></pre>
    </div>
  `;

  return content;
}

/**
 * Initialize the application.
 */
function init(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.appendChild(createControls());
  app.appendChild(createDemoContent());

  // Initialize theme manager
  initializeTheme();

  // Update UI to match initial state
  updateSchemeButtons();

  // Listen for theme changes
  window.addEventListener('livery:theme-changed', () => {
    updateSchemeButtons();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
