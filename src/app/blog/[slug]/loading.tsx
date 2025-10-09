import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <article className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Navigation */}
      <nav className="relative container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-24" />
        </div>
      </nav>

      {/* Article Container */}
      <div className="relative container mx-auto px-6 pb-12 max-w-5xl">
        <div className="relative bg-whitedark:bg-black/50 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xs overflow-hidden">
          {/* Header Section */}
          <header className="relative bg-linear-to-br from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent p-8 md:p-12">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              <Skeleton className="h-16 md:h-20 lg:h-24 w-full mb-6" />

              <Skeleton className="h-8 md:h-10 w-full max-w-3xl mb-8" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-300/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <main className="relative p-8 md:p-12 lg:px-16 lg:py-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-6" />

              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-4 w-4/6 mb-6" />

              <Skeleton className="h-8 w-1/3 mb-4" />

              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-2/3 mb-6" />

              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-6" />

              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-4 w-4/6 mb-3" />
              <Skeleton className="h-4 w-3/4 mb-6" />
            </div>

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-2.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-16" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Related Posts CTA */}
      <section className="relative container mx-auto px-6 py-16 max-w-4xl">
        <div className="relative bg-linear-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-600 dark:to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/25 dark:shadow-blue-950/50 overflow-hidden">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </section>
    </article>
  );
}
