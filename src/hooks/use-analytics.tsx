"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackPageView } from "@/components/analytics/google-analytics";

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url, document.title);
    }
  }, [pathname, searchParams]);
}
