/**
 * Base theme - the foundation for all tenant themes.
 *
 * Tenants inherit ALL values from this base theme and only
 * override what they need to customize.
 */

import type { AppTheme } from '../schema';

export const baseTheme: AppTheme = {
  brand: {
    name: 'Base Theme',
    primary: '#3b82f6',
    secondary: '#64748b',
  },

  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
  },

  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
  },

  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },

  borders: {
    radius: '8px',
  },
};
