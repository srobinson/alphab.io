"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
    measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
            </Script>
        </>
    );
}

// Helper function to track events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number,
) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Helper function to track page views
export const trackPageView = (url: string, title?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
            page_title: title,
            page_location: url,
        });
    }
};

// Extend the Window interface to include gtag and dataLayer
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}
