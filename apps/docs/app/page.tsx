'use client';

import { Header } from '../components/header';
import { Hero } from '../components/hero';
import { BeforeAfterComparison } from '../components/before-after-comparison';
import { RealisticExamples } from '../components/realistic-examples';
import { ThemeShowcase } from '../components/theme-showcase';
import { DecisionTree } from '../components/decision-tree';
import { BeyondLightDark } from '../components/beyond-light-dark';
import { DashboardCTA } from '../components/dashboard-cta';
import { Footer } from '../components/footer';
import { PageContent } from '../components/PageContent';

/**
 * Landing Page - Tighter 7-section structure
 *
 * 1. Hero - Hook with pain + promise depth
 * 2. Problem/Solution - Before/after comparison
 * 3. How it works - 4-step workflow
 * 4. Live demo - Proof it works (moved up for impact)
 * 5. Which package? - Decision tree for self-selection
 * 6. Advanced use cases - Multi-tenant, white-label, etc.
 * 7. CTA - Dashboard waitlist
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background-alt">
      <Header />
      <main>
        {/* 1. Hero - Hook + promise */}
        <PageContent className="border border-border border-b-0 border-t-0">
          <Hero />
        </PageContent>

        {/* 2. Problem/Solution - The dark: pain vs semantic tokens */}
        <PageContent className="border border-border border-b-0">
          <BeforeAfterComparison />
        </PageContent>

        {/* 3. How it works - 4-step workflow */}
        <PageContent className="border border-border border-b-0">
          <RealisticExamples />
        </PageContent>

        {/* 4. Live demo - Proof it works */}
        <PageContent className="border border-border border-b-0">
          <ThemeShowcase />
        </PageContent>

        {/* 5. Which package? - Self-selection */}
        <PageContent className="border border-border border-b-0">
          <DecisionTree />
        </PageContent>

        {/* 6. Advanced use cases - For those who need more */}
        <PageContent className="border border-border border-b-0">
          <BeyondLightDark />
        </PageContent>

        {/* 7. CTA - Dashboard waitlist */}
        <PageContent className="border border-border border-b-0">
          <DashboardCTA />
        </PageContent>
      </main>
      <Footer />
    </div>
  );
}
