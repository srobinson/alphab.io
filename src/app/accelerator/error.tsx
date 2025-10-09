"use client";

import { AlertCircle, Home, Mail, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AcceleratorErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AcceleratorError({ error, reset }: AcceleratorErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Accelerator page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,255,150,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,0,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 text-center max-w-md">
        <div className="border border-white/10 bg-black/50 backdrop-blur-sm p-8 rounded-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">SYSTEM ERROR</h1>

          <p className="text-gray-300 mb-8">
            ACCELERATOR MODULE FAILURE. UNABLE TO LOAD TECH INTERFACE.
          </p>

          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              RETRY CONNECTION
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Home className="mr-2 h-4 w-4" />
              RETURN HOME
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/contact";
              }}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Mail className="mr-2 h-4 w-4" />
              CONTACT SUPPORT
            </Button>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-red-500/20"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-red-500/20"></div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-400 cursor-pointer">
                ERROR LOG (DEVELOPMENT)
              </summary>
              <pre className="mt-2 text-xs bg-gray-900 p-3 rounded-lg overflow-auto text-gray-300">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
