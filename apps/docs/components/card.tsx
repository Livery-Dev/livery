import * as React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-background border border-border rounded-xl p-6 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
