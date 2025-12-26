import { cn } from '../utils/cn';

type Quadrant = 'ssr-static' | 'ssr-dynamic' | 'csr-static' | 'csr-dynamic';

interface UsageMatrixProps {
  highlight?: Quadrant | Quadrant[];
}

const quadrantDescriptions: Record<Quadrant, string> = {
  'ssr-static': 'Themes bundled, server sets data-theme',
  'ssr-dynamic': 'Server fetches theme from DB/API',
  'csr-static': 'Themes bundled, init script prevents flash',
  'csr-dynamic': 'Client fetches theme at runtime',
};

export function UsageMatrix({ highlight }: UsageMatrixProps) {
  const highlights = highlight ? (Array.isArray(highlight) ? highlight : [highlight]) : [];

  const Cell = ({ quadrant, label }: { quadrant: Quadrant; label: string }) => {
    const isHighlighted = highlights.includes(quadrant);

    return (
      <div
        className={cn(
          'p-3 text-center text-sm',
          isHighlighted ? 'bg-primary/10 text-primary font-medium' : 'text-muted'
        )}
      >
        <div>{label}</div>
        {isHighlighted && (
          <div className="text-xs mt-1 opacity-75">{quadrantDescriptions[quadrant]}</div>
        )}
      </div>
    );
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border text-sm">
      {/* Header row */}
      <div className="grid grid-cols-3 bg-muted/30">
        <div className="p-2" />
        <div className="p-2 text-center font-bold text-muted border-l border-border">
          Static themes
        </div>
        <div className="p-2 text-center font-bold text-muted border-l border-border">
          Dynamic themes
        </div>
      </div>

      {/* SSR row */}
      <div className="grid grid-cols-3 border-t border-border">
        <div className="p-3 font-bold text-muted bg-muted/30 flex items-center justify-center">
          SSR
        </div>
        <div className="border-l border-border">
          <Cell quadrant="ssr-static" label="SSR + Static" />
        </div>
        <div className="border-l border-border">
          <Cell quadrant="ssr-dynamic" label="SSR + Dynamic" />
        </div>
      </div>

      {/* CSR row */}
      <div className="grid grid-cols-3 border-t border-border">
        <div className="p-3 font-bold text-muted bg-muted/30 flex items-center justify-center">
          CSR
        </div>
        <div className="border-l border-border">
          <Cell quadrant="csr-static" label="CSR + Static" />
        </div>
        <div className="border-l border-border">
          <Cell quadrant="csr-dynamic" label="CSR + Dynamic" />
        </div>
      </div>
    </div>
  );
}
