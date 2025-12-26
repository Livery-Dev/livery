/**
 * Server-side utilities for SSR support
 */

import { toCssString } from '@livery/core';
import type { SchemaDefinition } from '@livery/core';
import type { GetLiveryServerPropsOptions, LiveryServerProps } from '../types/index.js';

/**
 * Resolves theme data on the server for SSR.
 *
 * Use this in your server-side data fetching (getServerSideProps, loader, etc.)
 * to pre-resolve the theme and avoid hydration mismatches.
 *
 * @param options - Options containing schema, themeId, resolver, and optional cssOptions
 * @returns Promise resolving to LiveryServerProps containing initialTheme, css, and themeId
 *
 * @example
 * ```tsx
 * // In Next.js getServerSideProps
 * export async function getServerSideProps(context) {
 *   const themeId = context.params.theme;
 *
 *   const liveryProps = await getLiveryServerProps({
 *     schema,
 *     themeId,
 *     resolver,
 *   });
 *
 *   return {
 *     props: { liveryProps },
 *   };
 * }
 *
 * // In your page component
 * function Page({ liveryProps }) {
 *   return (
 *     <>
 *       <LiveryScript css={liveryProps.css} />
 *       <LiveryProvider
 *         themeId={liveryProps.themeId}
 *         resolver={resolver}
 *         initialTheme={liveryProps.initialTheme}
 *       >
 *         <App />
 *       </LiveryProvider>
 *     </>
 *   );
 * }
 * ```
 */
export async function getLiveryServerProps<T extends SchemaDefinition>(
  options: GetLiveryServerPropsOptions<T>
): Promise<LiveryServerProps<T>> {
  const { schema, themeId, resolver, cssOptions } = options;

  // Resolve theme on server
  const theme = await resolver.resolve({ themeId });

  // Generate CSS string
  const css = cssOptions
    ? toCssString({ schema, theme, options: cssOptions })
    : toCssString({ schema, theme });

  return {
    initialTheme: theme,
    css,
    themeId,
  };
}
