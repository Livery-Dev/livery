'use client';

import Link from 'next/link';
import { Card } from './card';
import { CodeBlock } from './code-block';

const heroCode = `import { createSchema, t, InferTheme } from '@livery/core'

const schema = createSchema({
  definition: {
    primary: t.color(),
    background: t.color(),
  }
})

const theme: InferTheme<typeof schema.definition> = {
  primary: '#171717',
  background: '#ffffff',
  accent: '#f97316', // ❌ Type error
}

// Works in every theme
<button className="bg-primary text-background">
  Click me
</button>`;

/**
 * Hero Component
 * Cal.com-inspired two-column layout with visual pipeline demo
 */
export function Hero() {
  return (
    <section className="py-8">
      <Card className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text Content */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-4xl text-text font-display">
            One schema, unlimited themes
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-muted">
            Stop writing <code className="px-1.5 py-0.5 rounded bg-surface-hover dark:bg-surface text-sm font-mono">dark:</code> variants
            everywhere. Define your theme shape once, get full TypeScript inference,
            and scale from light/dark to multi-tenant.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/docs/quick-start"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-text-inverse bg-text rounded-lg transition-opacity hover:opacity-90"
            >
              Get Started
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-text bg-transparent border border-border rounded-lg transition-colors hover:bg-surface-hover"
            >
              View Documentation
            </Link>
          </div>

          {/* Feature badges */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              'Full TypeScript inference',
              'From light/dark to multi-tenant',
              'Works with Tailwind & shadcn',
              'SSR or CSR, static or dynamic',
            ].map((feature) => (
              <div key={feature} className="inline-flex items-center gap-2 text-sm text-text-muted">
                <svg
                  className="h-4 w-4 text-text-muted shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Code Example */}
        <div className="rounded-xl overflow-hidden">
          <CodeBlock code={heroCode} language="typescript" />
        </div>
      </Card>
    </section>
  );
}
