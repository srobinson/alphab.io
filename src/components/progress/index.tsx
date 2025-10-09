export function ProgressBar() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          Loading the latest insights
        </span>
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "0.6s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s", animationDuration: "0.6s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s", animationDuration: "0.6s" }}
          ></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-md mx-auto">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full animate-progress-fill"></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Fetching AI insights and analysis...
        </p>
      </div>

      {/* Animated icons */}
      <div className="flex justify-center gap-8">
        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-pulse-glow">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div
          className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center animate-bounce-gentle"
          style={{ animationDelay: "0.2s" }}
        >
          <svg
            className="w-6 h-6 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse-glow">
          <svg
            className="w-6 h-6 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      {/* Loading steps */}
      <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Analyzing AI trends</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.20" }}
          ></div>
          <span>Processing insights</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: ".30" }}
          ></div>
          <span>Preparing content</span>
        </div>
      </div>
    </div>
  );
}
