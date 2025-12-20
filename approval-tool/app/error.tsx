"use client";

import { useEffect } from "react";

/**
 * Root Error Boundary
 *
 * Catches and displays errors in the application.
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            {error.message || "An unexpected error occurred"}
          </p>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try again
            </button>
            <a
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors text-center"
            >
              Go home
            </a>
          </div>

          {error.digest && (
            <p className="mt-6 text-xs text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
