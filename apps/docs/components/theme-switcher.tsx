'use client';

import { useState, useRef, useEffect } from 'react';
import { useThemeSwitcher } from './providers';
import { themes, type ThemeName } from '../lib/livery';

const themeList = Object.entries(themes) as [ThemeName, (typeof themes)[ThemeName]][];

export function ThemeSwitcher() {
  const { currentTheme, setTheme } = useThemeSwitcher();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeData = themes[currentTheme];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className="h-3 w-3 rounded-full border border-border"
          style={{ backgroundColor: currentThemeData.theme.colors.primary }}
        />
        <span>{currentThemeData.name}</span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {themeList.map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => {
                setTheme(key);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                currentTheme === key
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              role="option"
              aria-selected={currentTheme === key}
            >
              <span
                className="h-4 w-4 rounded-full border border-slate-200 border-border"
                style={{ backgroundColor: themeData.theme.colors.primary }}
              />
              <div className="flex-1">
                <div className="font-medium">{themeData.name}</div>
                <div className="text-xs text-slate-500">{themeData.description}</div>
              </div>
              {currentTheme === key && (
                <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
