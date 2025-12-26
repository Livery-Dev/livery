'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto h-24 w-24 text-red-500 dark:text-red-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          An unexpected error occurred. Don&apos;t worry, our team has been notified.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left max-w-lg mx-auto">
            <summary className="text-sm text-slate-500 dark:text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
              Error details
            </summary>
            <pre className="mt-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-red-600 dark:text-red-400 overflow-auto">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
          If this keeps happening,{' '}
          <a
            href="https://github.com/Livery-Dev/livery/issues/new"
            className="text-teal-600 dark:text-teal-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            please report an issue
          </a>
        </p>
      </div>
    </div>
  );
}
