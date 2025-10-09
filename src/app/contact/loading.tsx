import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-2xl w-full space-y-10 p-8 md:p-12 rounded-xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <Skeleton className="w-12 h-12 mx-auto" />
          <Skeleton className="h-10 md:h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-full max-w-md mx-auto" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto" />
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Name Field */}
          <div className="relative">
            <Skeleton className="h-4 w-20 absolute -top-3 left-2.5" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Skeleton className="h-4 w-24 absolute -top-3 left-2.5" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Message Field */}
          <div className="relative">
            <Skeleton className="h-4 w-24 absolute -top-3 left-2.5" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Newsletter Checkbox */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-80" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
