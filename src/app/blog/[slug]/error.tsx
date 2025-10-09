"use client";

import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BlogPostErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogPostError({ error, reset }: BlogPostErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <article className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      <div className="relative container mx-auto px-6 py-16 max-w-4xl">
        <div className="relative bg-white dark:bg-gray-900/50 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm overflow-hidden p-12 text-center">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-red-500/20 dark:border-red-400/20 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-red-500/20 dark:border-red-400/20 rounded-br-3xl" />

          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Failed to Load Blog Post
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            This blog post couldn't be loaded. It may have been moved, deleted, or there might be a
            temporary issue with our content system.
          </p>

          <div className="space-y-3 max-w-md mx-auto">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/blog";
              }}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-8 text-left">
              <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </article>
  );
}
