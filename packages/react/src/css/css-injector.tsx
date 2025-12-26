/**
 * CSS Injector component for style tag management.
 * Uses useInsertionEffect for synchronous CSS injection.
 */

import { useInsertionEffect } from 'react';
import type { CssInjectorProps } from '../types/index.js';

/**
 * Internal component that injects CSS variables into document.head.
 * Uses useInsertionEffect for synchronous injection before layout effects.
 */
export function CssInjector({ css, id, nonce }: CssInjectorProps): null {
  useInsertionEffect(() => {
    // Skip on server (no document)
    if (typeof document === 'undefined') {
      return;
    }

    // Find existing style element or create new one
    let style = document.getElementById(id) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement('style');
      style.id = id;
      // Set nonce for CSP compliance
      if (nonce) {
        style.nonce = nonce;
      }
      document.head.appendChild(style);
    }

    // Update content
    style.textContent = css;

    // Cleanup on unmount
    return () => {
      if (style?.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [css, id, nonce]);

  // This component renders nothing
  return null;
}
