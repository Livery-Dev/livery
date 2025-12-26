'use client';

import { Card } from './card';

const isItems = [
  'Type-safe theme management with full TypeScript inference',
  'Runtime theme resolution from any data source',
  'Design tokens with validation, caching, and multi-tenancy',
  'Multi-tenant theming infrastructure for SaaS apps',
];

const isNotItems = [
  'A UI component library (use shadcn, Radix, or MUI)',
  'A CSS framework (works alongside Tailwind)',
  'A design system replacement (manages the theme layer)',
  'A CSS-in-JS library (outputs standard CSS variables)',
];

/**
 * WhatIsLivery Component
 * Cal.com-inspired clean IS/IS NOT comparison
 */
export function WhatIsLivery() {
  return (
    <section className="py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-text mb-4">What is Livery?</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Understanding what Livery does (and doesn&apos;t do) will help you see where it fits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Livery IS */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-primary dark:bg-white flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-white dark:text-text"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text">Livery IS</h3>
            </div>
            <ul className="space-y-3">
              {isItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="text-text-muted mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Livery IS NOT */}
          <Card className="p-6 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-surface-hover dark:bg-surface flex items-center justify-center">
                <span className="text-text-muted dark:text-text-muted text-sm font-medium">
                  ✗
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text">Livery is NOT</h3>
            </div>
            <ul className="space-y-3">
              {isNotItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="text-text-muted mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
    </section>
  );
}
