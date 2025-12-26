/**
 * Generates a blocking script that sets the theme before React renders.
 * Place this script in the <head> to prevent flash of unstyled content.
 */

export interface ThemeInitScriptOptions {
  /** Available theme names */
  readonly themes: readonly string[];
  /** Default theme if no preference is found */
  readonly defaultTheme: string;
  /** localStorage key for persisted preference (default: 'theme') */
  readonly storageKey?: string;
  /** Attribute to set on <html> element (default: 'data-theme') */
  readonly attribute?: string;
}

/**
 * Returns a minified script string that:
 * 1. Reads theme preference from localStorage
 * 2. Falls back to system preference (prefers-color-scheme)
 * 3. Falls back to defaultTheme
 * 4. Sets the attribute on document.documentElement
 *
 * Place this in a <script> tag in <head> before <body> content.
 *
 * @example
 * ```tsx
 * // Generate the script
 * const initScript = getThemeInitScript({
 *   themes: ['light', 'dark'],
 *   defaultTheme: 'light',
 * });
 *
 * // In your layout
 * <head>
 *   <style dangerouslySetInnerHTML={{ __html: css }} />
 *   <script dangerouslySetInnerHTML={{ __html: initScript }} />
 * </head>
 * ```
 */
export function getThemeInitScript(options: ThemeInitScriptOptions): string {
  const { themes, defaultTheme, storageKey = 'theme', attribute = 'data-theme' } = options;

  // Validate defaultTheme is in themes
  if (!themes.includes(defaultTheme)) {
    throw new Error(
      `[Livery] defaultTheme "${defaultTheme}" is not in themes: ${themes.join(', ')}`
    );
  }

  // Build the themes array as a string
  const themesArray = JSON.stringify(themes);

  // Generate minified script
  // The script is kept readable here but minified in output
  const script = `(function(){
var k="${storageKey}",a="${attribute}",d="${defaultTheme}",ts=${themesArray};
var t=null;
try{t=localStorage.getItem(k)}catch(e){}
if(!t||ts.indexOf(t)<0){
var m=window.matchMedia("(prefers-color-scheme:dark)");
if(m.matches&&ts.indexOf("dark")>=0)t="dark";
else if(!m.matches&&ts.indexOf("light")>=0)t="light";
else t=d;
}
document.documentElement.setAttribute(a,t);
})()`;

  // Return minified (remove newlines and extra spaces)
  return script.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
}
