"use client";

import { AlertCircle, Home, Mail, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

interface ServicesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ServicesError({ error, reset }: ServicesErrorProps) {
  const { openContactDrawer } = useContactDrawer();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Services page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Failed to Load Services
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We couldn't load our services right now. This might be a temporary issue with our
            content system.
          </p>

          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
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

            <Button
              variant="outline"
              onClick={() => openContactDrawer({ mode: "contact", source: "services_error_page" })}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
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
    </div>
  );
}
