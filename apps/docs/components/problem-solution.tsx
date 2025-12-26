'use client';

import { Card } from './card';

const superpowers = [
  {
    title: 'Full TypeScript Inference',
    description: 'Autocomplete and type checking everywhere',
  },
  {
    title: 'Schema Validation',
    description: 'Invalid themes get rejected at compile time',
  },
  {
    title: 'Scales to Any Use Case',
    description: 'From light/dark mode to multi-tenant SaaS',
  },
  {
    title: 'Works With Your Stack',
    description: 'Tailwind, shadcn, vanilla CSS — your choice',
  },
];

const integrations = [
  'Tailwind CSS',
  'shadcn/ui',
  'CSS Modules',
  'Vanilla CSS',
  'Styled Components',
];

/**
 * ProblemSolution Component
 * Cal.com-inspired clean FAQ section
 */
export function ProblemSolution() {
  return (
    <section className="py-24">
      {/* FAQ Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium text-text-muted mb-3">FAQ</p>
        <h2 className="text-3xl font-semibold text-text mb-4">
          &quot;Can&apos;t I already do this with design tokens?&quot;
        </h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Yes! Livery <span className="italic">is</span> design tokens—but with superpowers for
          runtime theming, type safety, and multi-tenant scenarios.
        </p>
      </div>

      {/* Superpowers Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-16">
        {superpowers.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary dark:bg-white flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="h-3.5 w-3.5 text-white dark:text-text"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-text">{item.title}</p>
            </div>

            <div className="mt-2 ml-8">
              <p className="text-sm text-text-muted">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Works WITH Your Tools */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-text mb-3">Works with your existing tools</h3>
        <p className="text-text-muted mb-6 max-w-xl mx-auto">
          Livery adds type-safe theme management on top of whatever you&apos;re already using.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map((name) => (
            <span
              key={name}
              className="px-4 py-2 text-sm font-medium text-text bg-surface rounded-full border border-border"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
