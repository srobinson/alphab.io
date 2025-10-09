"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const _pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null; // This component does not render anything
}
