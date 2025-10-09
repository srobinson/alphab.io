"use client";

import { AlertCircle, Radio, TrendingUp, Zap } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import type { NewsItem } from "@/lib/news-feeds";

const TickerItem = ({ item }: { item: NewsItem }) => {
  const handleClick = () => {
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "breaking":
        return <AlertCircle className="h-4 w-4 text-white" />;
      case "trending":
        return <TrendingUp className="h-4 w-4 text-white" />;
      case "update":
        return <Zap className="h-4 w-4 text-white" />;
      case "insight":
        return <Radio className="h-4 w-4 text-white" />;
      default:
        return <AlertCircle className="h-4 w-4 text-white" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "breaking":
        return "BREAKING";
      case "trending":
        return "TRENDING";
      case "update":
        return "UPDATE";
      case "insight":
        return "INSIGHT";
      default:
        return "NEWS";
    }
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case "breaking":
        return "bg-red-500 text-white";
      case "trending":
        return "bg-green-500 text-white";
      case "update":
        return "bg-amber-500 text-white";
      case "insight":
        return "bg-blue-500 text-white";
      default:
        return "bg-red-500 text-white";
    }
  };

  return (
    <span
      className={`flex items-center shrink-0 mx-4 text-sm md:text-base px-2 py-1 rounded-sm transition-all duration-200 ${
        item.link ? "cursor-pointer hover:text-yellow-600 dark:hover:text-yellow-400" : ""
      }`}
      onClick={handleClick}
    >
      <span
        className={`flex items-center ${getCategoryClass(
          item.category
        )} text-xs font-bold px-1.5 py-0.5 rounded mr-2 whitespace-nowrap`}
      >
        {getCategoryIcon(item.category)}
        <span className="ml-1 p-1">{getCategoryLabel(item.category)}</span>
      </span>
      <span className={`uppercase text-white-700 transition-all duration-150`}>{item.text}</span>
      <span className="ml-2 text-xs bg-red-500 text-white font-mono whitespace-nowrap rounded-sm">
        <span className="uppercase ml-1 p-1">{item.time}</span>
      </span>
    </span>
  );
};

// Error boundary component for the Marquee
const MarqueeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("querySelector") || event.message.includes("__hrp")) {
        console.warn("Marquee selector error caught:", event.message);
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center py-2">
        <span className="text-sm text-red-600 dark:text-red-400">
          News ticker temporarily unavailable
        </span>
      </div>
    );
  }

  try {
    return (
      <Marquee
        gradient={false}
        speed={112}
        pauseOnHover={true}
        autoFill={true}
        pauseOnClick={true}
        style={{ overflow: "hidden" }}
        className="marquee-container"
      >
        {children}
      </Marquee>
    );
  } catch (error) {
    console.warn("Marquee render error:", error);
    return (
      <div className="flex items-center justify-center py-2">
        <span className="text-sm text-red-600 dark:text-red-400">
          News ticker temporarily unavailable
        </span>
      </div>
    );
  }
};

interface NewsTickerProps {
  items?: NewsItem[];
}

export function NewsTicker({ items }: NewsTickerProps = {}) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(!items);
  // Update current time every second (for potential future use)
  useEffect(() => {
    const timer = setInterval(() => {
      // Timer for potential future functionality
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();

      setNewsItems(data.items || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If items are provided externally, use them directly
    if (items) {
      setNewsItems(items);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch news internally
    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [items]);

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        <div className="grow bg-red-200/95 dark:bg-red-800/45 backdrop-blur-xs overflow-hidden py-2 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <span className="text-sm text-red-600 dark:text-red-400">Loading latest news...</span>
            </div>
          ) : (
            <MarqueeWrapper>
              {newsItems.map((item) => (
                <TickerItem key={item.id} item={item} />
              ))}
            </MarqueeWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
