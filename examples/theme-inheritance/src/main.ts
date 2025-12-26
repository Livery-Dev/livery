/**
 * Main entry point for the theme inheritance example.
 *
 * Demonstrates how tenants can override only what they need,
 * inheriting everything else from a base theme.
 */

import {
  switchTheme,
  getCurrentOverrides,
  getThemeIds,
  initializeTheme,
  type ThemeId,
} from './theme-manager';
import './style.css';

function formatName(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Create controls panel.
 */
function createControls(): HTMLElement {
  const themeIds = getThemeIds();

  const container = document.createElement('div');
  container.className = 'controls';

  container.innerHTML = `
    <div class="control-header">
      <h3>Select Theme</h3>
      <p class="muted">See how each theme overrides the base theme</p>
    </div>
    <div class="theme-buttons">
      ${themeIds
        .map(
          (id) => `
        <button class="theme-btn" data-theme="${id}">
          ${formatName(id)}
        </button>
      `
        )
        .join('')}
    </div>
  `;

  container.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const themeId = target.dataset.theme as ThemeId;
      switchTheme(themeId);
      updateActiveButton(themeId);
    });
  });

  return container;
}

function updateActiveButton(themeId: ThemeId): void {
  document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.classList.remove('active');
    if ((btn as HTMLButtonElement).dataset.theme === themeId) {
      btn.classList.add('active');
    }
  });
}

/**
 * Format overrides for display.
 */
function formatOverrides(overrides: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let result = '';

  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value === 'object' && value !== null) {
      result += `${spaces}<span class="key">${key}</span>: {\n`;
      result += formatOverrides(value as Record<string, unknown>, indent + 1);
      result += `${spaces}}\n`;
    } else {
      const valueStr =
        typeof value === 'string' && value.startsWith('#')
          ? `<span class="color-value" style="--preview-color: ${value}">"${value}"</span>`
          : `<span class="value">"${value}"</span>`;
      result += `${spaces}<span class="key">${key}</span>: ${valueStr}\n`;
    }
  }

  return result;
}

/**
 * Create the overrides display panel.
 */
function createOverridesPanel(): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'card overrides-panel';
  panel.innerHTML = `
    <h2>Theme Overrides</h2>
    <p class="muted">Only these values are defined by the theme. Everything else is inherited from the base theme.</p>
    <pre id="overrides-display" class="code-block"><code></code></pre>
  `;
  return panel;
}

function updateOverridesDisplay(): void {
  const overrides = getCurrentOverrides();
  const display = document.querySelector('#overrides-display code');
  if (display) {
    display.innerHTML = formatOverrides(overrides);
  }
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
        This example shows theme inheritance. Themes only define what they want to change -
        everything else comes from the base theme.
      </p>
      <div class="button-group">
        <button class="primary-btn">Primary Action</button>
        <button class="secondary-btn">Secondary Action</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h2>Benefits</h2>
        <ul class="benefits-list">
          <li><strong>Less duplication</strong> - Themes only specify differences</li>
          <li><strong>Easy updates</strong> - Change base theme, all themes update</li>
          <li><strong>Flexible</strong> - Override as much or as little as needed</li>
          <li><strong>Consistent</strong> - Shared defaults ensure consistency</li>
        </ul>
      </div>

      <div class="card">
        <h2>Color Palette</h2>
        <div class="color-swatches">
          <div class="swatch primary"><span>Primary</span></div>
          <div class="swatch secondary"><span>Secondary</span></div>
          <div class="swatch background"><span>Background</span></div>
          <div class="swatch surface"><span>Surface</span></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>How It Works</h2>
      <pre class="code-block"><code>// Base theme has all values
const baseTheme: AppTheme = {
  brand: { primary: '#3b82f6', ... },
  colors: { background: '#ffffff', ... },
  spacing: { sm: '8px', md: '16px', lg: '24px' },
  // ... complete theme
};

// Theme only overrides what it needs
const acmeOverrides: ThemeOverrides = {
  brand: {
    name: 'Acme Corp',
    primary: '#ef4444',
  },
  // Inherits ALL other values from base!
};

// Merge to get final theme
const theme = deepMerge(baseTheme, acmeOverrides);</code></pre>
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

  const mainContent = document.createElement('div');
  mainContent.className = 'main-grid';

  const leftCol = document.createElement('div');
  leftCol.appendChild(createDemoContent());

  const rightCol = document.createElement('div');
  rightCol.appendChild(createOverridesPanel());

  mainContent.appendChild(leftCol);
  mainContent.appendChild(rightCol);
  app.appendChild(mainContent);

  // Initialize theme
  initializeTheme();
  updateActiveButton(getThemeIds()[0]);
  updateOverridesDisplay();

  // Listen for theme changes
  window.addEventListener('livery:theme-changed', ((event: CustomEvent) => {
    updateOverridesDisplay();
    const brandEl = document.getElementById('brand-name');
    if (brandEl && event.detail.theme) {
      brandEl.textContent = event.detail.theme.brand.name;
    }
  }) as EventListener);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
