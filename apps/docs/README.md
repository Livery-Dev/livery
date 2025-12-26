# Livery Documentation Site

The official documentation and landing page for [Livery](https://github.com/Livery-Dev/livery) - type-safe theming for any use case.

## Overview

This Next.js app serves two purposes:

1. **Landing Page** (`/`) - Showcases Livery's features with live theme switching demos
2. **Documentation** (`/docs`) - Comprehensive guides and API reference powered by Nextra

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Documentation**: Nextra v4
- **Styling**: Tailwind CSS v4 with Livery for theming
- **Fonts**: Inter, JetBrains Mono, Montserrat, Libre Baskerville

## Getting Started

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run development server
pnpm dev --filter=@livery/docs

# Build for production
pnpm build --filter=@livery/docs
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/docs](http://localhost:3000/docs) for documentation.

## Project Structure

```
apps/docs/
├── app/
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout with fonts & providers
│   ├── globals.css       # Tailwind + Livery CSS integration
│   ├── docs/             # Nextra documentation pages
│   └── api/waitlist/     # Waitlist signup API
├── components/           # React components
│   ├── hero.tsx          # Landing hero section
│   ├── theme-showcase.tsx # Live theme switching demo
│   ├── waitlist-modal.tsx # Dashboard waitlist signup
│   └── ...
├── content/              # MDX documentation content
├── lib/
│   ├── schema.ts         # Livery theme schema
│   ├── themes.ts         # Theme definitions
│   └── livery.ts         # Livery exports
└── data/                 # Waitlist data storage
```

## Livery + Tailwind Integration

This site demonstrates the recommended pattern for using Livery with Tailwind CSS v4:

```css
/* In globals.css */
@theme {
  --color-primary: var(--colors-primary);
  --color-background: var(--colors-background);
  /* Tailwind reads from @theme, Livery injects --colors-* at runtime */
}
```

Then use standard Tailwind classes that automatically update with theme changes:

```tsx
<button className="bg-primary text-white">Click me</button>
```

## Available Themes

The landing page includes 5 demo themes:

- **Default** - Clean teal and slate
- **Dark** - Dark mode variant
- **Ocean** - GitHub-inspired blues
- **Forest** - Spotify-inspired greens
- **Sunset** - Notion-inspired warm tones

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate-api` - Generate API documentation from TypeDoc
- `pnpm check-types` - TypeScript type checking

## License

MIT
