"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

export function ConditionalHeader() {
    const pathname = usePathname();

    // Routes that should not show the header
    const noHeaderRoutes = ["/accelerator", "/landing"];

    // Also hide header for root path since it gets rewritten to /landing
    const shouldHideHeader = pathname === "/" ||
        noHeaderRoutes.some((route) => pathname.startsWith(route));

    if (shouldHideHeader) {
        return null;
    }

    return <Header />;
}
