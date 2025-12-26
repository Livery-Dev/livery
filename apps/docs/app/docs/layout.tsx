import Image from 'next/image';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Banner } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import type { ReactNode } from 'react';
import 'nextra-theme-docs/style.css';

export const metadata = {
  metadataBase: new URL('https://livery.dev'),
  title: {
    default: 'Livery Documentation',
    template: '%s | Livery',
  },
  description: 'Type-safe theming library for any use case.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const banner = (
  <Banner dismissible storageKey="livery-banner-dismissed">
    Livery is in early development. Star us on GitHub!
  </Banner>
);

const navbar = (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Livery" width={24} height={24} />
        <span className="font-bold text-lg text-text dark:text-text">
          Livery
        </span>
      </div>
    }
    projectLink="https://github.com/Livery-Dev/livery"
  />
);

const footer = (
  <Footer>
    <div className="flex w-full flex-col items-center sm:items-start">
      <p className="text-sm text-text-muted">
        MIT License {new Date().getFullYear()} Livery Contributors
      </p>
    </div>
  </Footer>
);

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap('/docs');

  return (
    <Layout
      banner={banner}
      navbar={navbar}
      footer={footer}
      editLink="Edit this page on GitHub"
      docsRepositoryBase="https://github.com/Livery-Dev/livery/tree/main/apps/docs/content"
      sidebar={{
        defaultMenuCollapseLevel: 1,
        autoCollapse: true,
      }}
      toc={{ backToTop: true }}
      pageMap={pageMap}
      feedback={{ content: 'Questions? Open an issue', labels: 'documentation' }}
    >
      {children}
    </Layout>
  );
}
