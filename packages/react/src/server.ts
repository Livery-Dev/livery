/**
 * @livery/react/server
 *
 * Server-side utilities for SSR support.
 * Use these to pre-resolve themes on the server and avoid hydration mismatches.
 */

export type { GetLiveryServerPropsOptions, LiveryServerProps } from './types/index.js';

export { getLiveryServerProps } from './server/index.js';
export { LiveryScript } from './server/livery-script.js';
