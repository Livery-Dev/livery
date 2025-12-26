/**
 * LiveryScript component for SSR critical CSS injection
 */

import type { ReactElement } from 'react';
import type { LiveryScriptProps } from '../types/index.js';

/**
 * Injects critical CSS into the document for SSR.
 *
 * Place this in your document head to inject theme CSS variables
 * before the page renders, preventing flash of unstyled content.
 *
 * @param props - Props containing css string and optional id
 * @returns Style element with CSS content
 *
 * @example
 * ```tsx
 * // In Next.js _document.tsx
 * import { LiveryScript } from '@livery/react/server';
 *
 * export default function Document() {
 *   return (
 *     <Html>
 *       <Head>
 *         <LiveryScript css={pageProps.liveryProps.css} />
 *       </Head>
 *       <body>
 *         <Main />
 *         <NextScript />
 *       </body>
 *     </Html>
 *   );
 * }
 * ```
 */
export function LiveryScript({ css, id = 'livery-critical', nonce }: LiveryScriptProps): ReactElement {
  return (
    <style
      id={id}
      nonce={nonce}
      // Using dangerouslySetInnerHTML to inject CSS as raw text
      // This is safe because we generate the CSS ourselves from validated theme data
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
