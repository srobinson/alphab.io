import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section Skeleton */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <Skeleton className="h-16 md:h-20 lg:h-24 w-full max-w-4xl mx-auto mb-6" />
          <Skeleton className="h-6 md:h-8 w-full max-w-3xl mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </section>

      {/* Services Grid Skeleton */}
      <section className="container mx-auto px-6 pt-6 pb-16 lg:pb-24 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-start mb-6">
                <Skeleton className="w-12 h-12 rounded-lg mr-4" />
                <Skeleton className="h-8 w-3/4" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-5/6 mb-6" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="container mx-auto px-6 pb-20 text-center max-w-6xl">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-3xl mx-auto mb-4" />
          <Skeleton className="h-6 md:h-8 w-full max-w-2xl mx-auto mb-10" />
          <Skeleton className="h-16 w-64 mx-auto" />
        </div>
      </section>
    </div>
  );
}
