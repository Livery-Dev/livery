'use client';

import { Card } from './card';

/**
 * Features Component
 * Refactored to use Tailwind CSS classes instead of inline styles
 */

const features = [
  {
    title: 'Type-Safe',
    description:
      'Full TypeScript inference from your schema. Catch errors at compile time, not runtime.',
    icon: TypeSafeIcon,
  },
  {
    title: 'Flexible',
    description:
      'Dark mode, user customization, multi-tenant branding, or any theming use case you can imagine.',
    icon: FlexibleIcon,
  },
  {
    title: 'Framework Agnostic',
    description: 'Core library works anywhere. First-class React and Next.js bindings included.',
    icon: FrameworkIcon,
  },
  {
    title: 'Async-Ready',
    description:
      'Built-in caching, stale-while-revalidate, and async theme resolution for any data source.',
    icon: AsyncIcon,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl text-text">Why Livery?</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-text-muted">
            Everything you need to build themable applications with confidence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType;
}

function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-surface-hover dark:bg-surface">
        <Icon />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{description}</p>
    </Card>
  );
}

// Icons - now use Tailwind classes for color
function TypeSafeIcon() {
  return (
    <svg
      className="h-6 w-6 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function FlexibleIcon() {
  return (
    <svg
      className="h-6 w-6 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  );
}

function FrameworkIcon() {
  return (
    <svg
      className="h-6 w-6 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  );
}

function AsyncIcon() {
  return (
    <svg
      className="h-6 w-6 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
