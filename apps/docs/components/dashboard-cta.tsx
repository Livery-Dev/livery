'use client';

import Link from 'next/link';
import { Card } from './card';

const WAITLIST_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScHDOmFvEiCV0CjxKttAePimx4Lf4gKdYQmYubmzkdMsuPbhw/viewform';

/**
 * DashboardCTA Component
 * Promotes the upcoming Livery Dashboard with waitlist signup
 */

const benefits = [
  {
    title: 'Visual Theme Editor',
    description: 'Design themes with a live preview interface',
  },
  {
    title: 'Tenant Management',
    description: 'Manage themes for multiple tenants in one place',
  },
  {
    title: 'Theme Analytics',
    description: 'Track which themes perform best',
  },
  {
    title: 'Team Collaboration',
    description: 'Invite designers and developers to collaborate',
  },
];

export function DashboardCTA() {
  return (
    <section className="py-8">
      <Card>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6 bg-surface text-text-muted border border-border">
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl text-text">Livery Dashboard</h2>
            <p className="mt-4 text-lg text-text-muted">
              A visual interface for managing your themes. Perfect for teams that want designers
              to create themes without touching code.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center bg-surface border border-border">
                    <svg className="h-3 w-3 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-text">{benefit.title}</div>
                    <div className="text-sm text-text-muted">{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90 bg-text text-text-inverse"
              >
                Join Waitlist
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <Link
                href="/docs/dashboard"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors bg-surface text-text border border-border hover:bg-surface-hover"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="relative">
            <DashboardPreview />
          </div>
        </div>
      </Card>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      {/* Mock dashboard */}
      <div className="relative rounded-xl shadow-lg overflow-hidden bg-background border border-border">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-text" />
            <span className="text-sm font-medium text-text">Livery Dashboard</span>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded bg-background-alt" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 grid gap-4 bg-background-alt">
          {/* Theme cards row - using Livery semantic colors */}
          <div className="grid grid-cols-3 gap-3">
            {['bg-primary', 'bg-accent', 'bg-success'].map((color, i) => (
              <div key={i} className="rounded-lg p-3 bg-background border border-border">
                <div className={`h-12 rounded mb-2 ${color}`} />
                <div className="h-2 w-16 rounded bg-border" />
              </div>
            ))}
          </div>

          {/* Token editor mock */}
          <div className="rounded-lg p-3 bg-background border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-3 w-20 rounded bg-border" />
              <div className="h-6 w-6 rounded bg-text" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-24 rounded bg-border" />
              <div className="h-6 w-6 rounded bg-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
