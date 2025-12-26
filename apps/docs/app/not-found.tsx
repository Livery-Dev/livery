import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-teal-600 dark:text-teal-400">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Page not found
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
          moved or doesn&apos;t exist.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-lg transition-colors"
          >
            Read Docs
          </Link>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
          Need help?{' '}
          <a
            href="https://github.com/Livery-Dev/livery/issues"
            className="text-teal-600 dark:text-teal-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open an issue on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
