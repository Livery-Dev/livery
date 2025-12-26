/**
 * Client entry point - hydrates the server-rendered HTML
 */

import { hydrateRoot } from 'react-dom/client';
import { DynamicThemeProvider, resolver } from './livery';
import App from './App';

// Get the initial theme data from the server (embedded in window)
declare global {
  interface Window {
    __LIVERY_DATA__?: {
      themeId: string;
      initialTheme: unknown;
    };
  }
}

const liveryData = window.__LIVERY_DATA__;

if (!liveryData) {
  throw new Error('Missing __LIVERY_DATA__ - SSR data not found');
}

// Type assertion since we know the server serialized a valid theme
const initialTheme = liveryData.initialTheme as Parameters<
  typeof DynamicThemeProvider
>[0]['initialTheme'];

hydrateRoot(
  document.getElementById('root')!,
  <DynamicThemeProvider initialThemeId={liveryData.themeId} resolver={resolver} initialTheme={initialTheme}>
    <App />
  </DynamicThemeProvider>
);
