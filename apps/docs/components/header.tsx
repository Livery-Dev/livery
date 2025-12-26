'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import { ThemeSwitcher } from './theme-switcher';
import { PageContent } from './PageContent';

/**
 * Header Component
 * Cal.com-inspired navbar that transforms on scroll
 * - At top: Blends into background
 * - Scrolled: Floating card with rounded corners and shadow
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Outer wrapper for padding when scrolled */}
      <div
        className={cn(
          'transition-all duration-300',
          isScrolled ? 'px-4 pt-3 sm:px-6' : 'px-0 pt-0'
        )}
      >
        {/* Inner nav container */}
        <nav>
          <PageContent className="border border-border border-b-0 border-t-0">
            <div
              className={cn(
                'flex h-14 items-center justify-between transition-all duration-300 py-4 px-4 sm:px-8',
                isScrolled
                  ? 'bg-background/95 backdrop-blur-md border border-border rounded-xl'
                  : 'bg-transparent border-transparent rounded-xl'
              )}
            >
              <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl transition-colors text-text font-display shrink-0">
                <Image src="/logo.svg" alt="Livery" width={24} height={24} />
                <span className="hidden min-[400px]:inline">Livery.Dev</span>
                <span className="min-[400px]:hidden">Livery</span>
              </Link>

              <div className="flex items-center gap-3 sm:gap-6">
                <Link
                  href="/docs"
                  className="transition-colors text-text-muted hover:text-text text-sm font-medium"
                >
                  Docs
                </Link>
                <a
                  href="https://github.com/Livery-Dev/livery"
                  className="transition-colors text-text-muted hover:text-text text-sm font-medium hidden sm:block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <ThemeSwitcher />
              </div>
            </div>
          </PageContent>
        </nav>
      </div>
    </header>
  );
}
