import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Montserrat, Libre_Baskerville } from 'next/font/google';
import { BuyMeCoffee } from '../components/buy-me-coffee';
import { Providers } from '../components/providers';
import { generateAllThemesCss } from '../lib/livery-server';
import './globals.css';
import { LiveryScript } from '@livery/react/server';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Spotify-like font for Forest theme
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Notion-like font for Sunset theme
const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-libre',
  display: 'swap',
});

// Generate CSS for all themes server-side
// This enables instant theme switching without runtime CSS regeneration
const allThemesCss = generateAllThemesCss();

export const metadata: Metadata = {
  title: {
    default: 'Livery - Type-safe theming for any use case',
    template: '%s | Livery',
  },
  description:
    'Type-safe design tokens with full TypeScript inference. From simple dark mode to multi-tenant SaaS, Livery handles theming at any scale with schema validation and CSS variable generation.',
  keywords: [
    'theming',
    'design-tokens',
    'css-variables',
    'typescript',
    'type-safe',
    'dark-mode',
    'light-dark',
    'multi-tenant',
    'white-label',
    'saas',
    'react',
    'nextjs',
    'tailwind',
    'shadcn',
  ],
  authors: [{ name: 'Livery Contributors' }],
  openGraph: {
    title: 'Livery - Type-safe theming for any use case',
    description:
      'Type-safe design tokens with full TypeScript inference. From simple dark mode to multi-tenant SaaS, Livery handles theming at any scale.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Livery',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Livery - One schema, unlimited themes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Livery - Type-safe theming for any use case',
    description:
      'Type-safe design tokens with full TypeScript inference. From simple dark mode to multi-tenant SaaS, Livery handles theming at any scale.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* All themes CSS injected server-side for instant theme switching */}
        <LiveryScript css={allThemesCss} />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${libreBaskerville.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <BuyMeCoffee />
      </body>
    </html>
  );
}
