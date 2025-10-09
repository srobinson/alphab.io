import { Skeleton } from "@/components/ui/skeleton";

export default function AcceleratorLoading() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background skeleton */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,255,150,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,0,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12">
        {/* Main header skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="relative mb-6 sm:mb-8">
            <Skeleton className="h-16 sm:h-20 md:h-32 lg:h-40 xl:h-48 w-full max-w-4xl mx-auto mb-4" />
          </div>

          <Skeleton className="h-6 sm:h-8 md:h-10 lg:h-12 w-full max-w-4xl mx-auto mb-6 sm:mb-8" />

          <Skeleton className="h-4 sm:h-5 md:h-6 lg:h-8 w-full max-w-3xl mx-auto" />
        </div>

        {/* Services grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="border border-white/10 bg-black/50 backdrop-blur-xs p-4 sm:p-6 lg:p-8"
            >
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-4 sm:mb-6" />
              <Skeleton className="h-6 sm:h-7 lg:h-8 w-3/4 mb-3 sm:mb-4" />
              <Skeleton className="h-3 sm:h-4 w-full mb-2" />
              <Skeleton className="h-3 sm:h-4 w-5/6" />
            </div>
          ))}
        </div>

        {/* Stats section skeleton */}
        <div className="border-t border-b border-white/10 py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16 lg:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-8 sm:h-10 md:h-12 lg:h-16 w-full mb-1 sm:mb-2" />
                <Skeleton className="h-2 sm:h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Email signup section skeleton */}
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-md mx-auto mb-6" />
          <Skeleton className="h-12 w-full max-w-lg mx-auto mb-4" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>

      {/* Corner decorations skeleton */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-500/20"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-green-500/20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-green-500/20"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-500/20"></div>
    </div>
  );
}
