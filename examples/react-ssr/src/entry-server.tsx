/**
 * Server entry point - renders the app to HTML string
 */

import { renderToString } from 'react-dom/server';
import { getLiveryServerProps, LiveryScript } from '@livery/react/server';
import { DynamicThemeProvider, resolver } from './livery';
import { schema } from './schema';
import App from './App';

export async function render(themeId: string) {
  // 1. Get server props (fetches and resolves theme)
  const liveryProps = await getLiveryServerProps({
    schema,
    themeId,
    resolver,
  });

  // 2. Render the app with pre-loaded theme
  const html = renderToString(
    <DynamicThemeProvider
      initialThemeId={liveryProps.themeId}
      resolver={resolver}
      initialTheme={liveryProps.initialTheme}
      injection="none" // CSS is injected via LiveryScript
    >
      <App />
    </DynamicThemeProvider>
  );

  // 3. Generate CSS and hydration script
  const liveryScript = renderToString(<LiveryScript css={liveryProps.css} />);

  // 4. Generate the data script for client hydration
  const dataScript = `<script>window.__LIVERY_DATA__ = ${JSON.stringify({
    themeId: liveryProps.themeId,
    initialTheme: liveryProps.initialTheme,
  })};</script>`;

  return { html, liveryScript, dataScript };
}
