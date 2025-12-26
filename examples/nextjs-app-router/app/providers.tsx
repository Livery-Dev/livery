'use client';

/**
 * Client-side providers for the application
 *
 * This file contains client components that wrap the children
 * with necessary context providers.
 */

import { DynamicThemeProvider, resolver, type Theme } from '@/lib/livery';

interface DynamicThemeClientProviderProps {
  themeId: string;
  initialTheme: Theme;
  children: React.ReactNode;
}

/**
 * Client-side wrapper for DynamicThemeProvider
 *
 * This component is marked as 'use client' to enable the use of
 * React context and hooks in the App Router.
 */
export function DynamicThemeClientProvider({
  themeId,
  initialTheme,
  children,
}: DynamicThemeClientProviderProps) {
  return (
    <DynamicThemeProvider
      initialThemeId={themeId}
      resolver={resolver}
      initialTheme={initialTheme}
      injection="none"
    >
      {children}
    </DynamicThemeProvider>
  );
}
