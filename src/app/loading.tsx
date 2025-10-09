import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full animate-pulse opacity-20"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
