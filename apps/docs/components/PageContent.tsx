import React from 'react';
import { cn } from '../utils/cn';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface PageContentProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
  breakpoint?: Breakpoint;
  isFullWidth?: boolean;
  className?: string;
  wrapperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

export function PageContent({
  children,
  className,
  breakpoint = 'xl',
  isFullWidth = false,
  wrapperProps,
}: PageContentProps) {
  return (
    <div {...wrapperProps}>
      <div
        className={cn(
          'mx-auto px-8',
          !isFullWidth && [
            {
              'max-w-screen-sm': breakpoint === 'sm',
              'max-w-3xl': breakpoint === 'md',
              'max-w-4xl': breakpoint === 'lg',
              'max-w-7xl': breakpoint === 'xl',
              'max-w-[1400px]': breakpoint === '2xl',
            },
          ],
          isFullWidth && 'w-full',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
