/**
 * Express server for SSR example
 *
 * In development: Uses Vite's dev server middleware
 * In production: Serves pre-built static files
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3013;

async function createServer() {
  const app = express();

  let vite;
  if (!isProduction) {
    // Development: use Vite dev server
    const { createServer } = await import('vite');
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static assets
    app.use(express.static(path.resolve(__dirname, 'dist/client')));
  }

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      // Get theme from query param (in real app: subdomain, cookie, etc.)
      const themeId = req.query.theme || 'acme';

      // 1. Load the HTML template
      let template;
      if (!isProduction) {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, 'dist/client/index.html'),
          'utf-8'
        );
      }

      // 2. Load the server entry and render
      let render;
      if (!isProduction) {
        const serverEntry = await vite.ssrLoadModule('/src/entry-server.tsx');
        render = serverEntry.render;
      } else {
        const serverEntry = await import('./dist/server/entry-server.js');
        render = serverEntry.render;
      }

      const { html: appHtml, liveryScript, dataScript } = await render(themeId);

      // 3. Inject the rendered HTML and Livery CSS
      const finalHtml = template
        .replace('<!--livery-css-->', liveryScript + dataScript)
        .replace('<!--ssr-outlet-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
      if (!isProduction) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
    console.log(`Try: http://localhost:${port}/?theme=acme`);
    console.log(`Try: http://localhost:${port}/?theme=globex`);
  });
}

createServer();
