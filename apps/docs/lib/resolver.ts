import { createResolver } from '@livery/core';
import { schema } from './schema';
import {
  defaultTheme,
  darkTheme,
  oceanTheme,
  forestTheme,
  sunsetTheme,
  type ThemeName,
} from './themes';

// Map of theme names to theme objects
const themeMap = {
  default: defaultTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
} as const;

/**
 * Theme resolver for the documentation site.
 * Returns pre-defined themes by name.
 */
export const resolver = createResolver({
  schema,
  fetcher: ({ themeId }) => {
    return themeMap[themeId as ThemeName] || defaultTheme;
  },
});

export type DocsResolver = typeof resolver;
