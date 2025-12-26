import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getLiveryServerProps } from '@livery/react/server';
import { schema, resolver } from '@/lib/livery-config';
import { DynamicThemeClientProvider } from './providers';
import './globals.css';

/**
 * Get theme ID from request headers set by middleware
 */
function getThemeFromHeaders(headersList: Headers): string | null {
  return headersList.get('x-livery-theme');
}

export const metadata: Metadata = {
  title: 'Livery Next.js Example',
  description: 'Multi-tenant theming with Livery and Next.js App Router',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get theme ID from middleware header
  const headersList = await headers();
  const themeId = getThemeFromHeaders(headersList) ?? 'default';

  // Resolve theme on the server
  const { initialTheme: theme, css } = await getLiveryServerProps({
    schema,
    themeId,
    resolver,
  });

  return (
    <html lang="en">
      <head>
        {/* Inject critical CSS to prevent flash of unstyled content */}
        <style id="livery-critical" dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        {/* Provide theme context with pre-resolved theme */}
        <DynamicThemeClientProvider themeId={themeId} initialTheme={theme}>
          {children}
        </DynamicThemeClientProvider>
      </body>
    </html>
  );
}
