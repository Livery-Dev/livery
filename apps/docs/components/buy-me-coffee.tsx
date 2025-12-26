'use client';

import { useEffect } from 'react';

export function BuyMeCoffee() {
  useEffect(() => {
    // Check if widget already exists
    if (document.getElementById('bmc-wbtn')) return;

    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-id', 'claudianadalin');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute('data-message', '');
    script.setAttribute('data-color', '#5F7FFF');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';

    script.onload = () => {
      // The script listens for DOMContentLoaded, which has already fired
      // Re-dispatch it to trigger initialization
      window.dispatchEvent(new Event('DOMContentLoaded'));
    };

    document.head.appendChild(script);

    return () => {
      const widget = document.getElementById('bmc-wbtn');
      if (widget) widget.remove();
      const overlay = document.getElementById('bmc-');
      if (overlay) overlay.remove();
    };
  }, []);

  return null;
}
