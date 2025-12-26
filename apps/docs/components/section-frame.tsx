'use client';

import { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { PageContent, type Breakpoint } from './PageContent';

interface SectionFrameProps {
  children: ReactNode;
  className?: string;
  last?: boolean;
  breakpoint?: Breakpoint;
}

/**
 * SectionFrame Component
 * Wraps content in a clean frame border
 * Frame aligns with PageContent breakpoints
 */
export function SectionFrame({
  children,
  className,
  last = false,
  breakpoint = 'xl',
}: SectionFrameProps) {
  return (
    <PageContent breakpoint={breakpoint} className={cn('relative', className)}>
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-surface-hover dark:bg-surface" />

      {/* Left vertical line */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-surface-hover dark:bg-surface" />

      {/* Right vertical line */}
      <div className="absolute top-0 bottom-0 right-0 w-px bg-surface-hover dark:bg-surface" />

      {/* Bottom border - only for last frame */}
      {last && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-surface-hover dark:bg-surface" />
      )}

      {/* Content */}
      {children}
    </PageContent>
  );
}
