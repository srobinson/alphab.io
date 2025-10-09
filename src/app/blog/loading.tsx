import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50dark:bg-black">
      {/* Hero Section Skeleton */}
      <section className="py-16 bg-linear-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <Skeleton className="h-16 md:h-20 lg:h-24 w-full max-w-4xl mx-auto mb-6" />
          <Skeleton className="h-6 md:h-8 w-full max-w-3xl mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </section>

      {/* Featured Posts Skeleton */}
      <section className="container mx-auto px-6 pb-16 pt-10 max-w-6xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-50dark:bg-black/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts Skeleton */}
      <section className="container mx-auto px-6 pb-16 max-w-6xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-50dark:bg-black/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA Skeleton */}
      <section className="container mx-auto px-6 py-16 text-center max-w-4xl">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl p-8">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-6" />
          <Skeleton className="h-12 w-40 mx-auto" />
        </div>
      </section>
    </div>
  );
}
