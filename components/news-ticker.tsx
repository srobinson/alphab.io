"use client";

import type React from "react";

import type { NewsItem } from "@/lib/news-feeds";
import { AlertCircle, Clock, Radio, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const TickerItem = ({ item }: { item: NewsItem }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "breaking":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "trending":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "update":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "insight":
        return <Radio className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
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
        return "bg-gray-500 text-white";
    }
  };

  return (
    <span
      className={`flex items-center shrink-0 mx-4 text-sm md:text-base px-2 py-1 rounded-sm transition-all duration-200 ${
        item.link
          ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
          : ""
      }`}
      onClick={handleClick}
    >
      <span
        className={`flex items-center ${
          getCategoryClass(
            item.category,
          )
        } text-xs font-bold px-1.5 py-0.5 rounded mr-2 whitespace-nowrap`}
      >
        {getCategoryIcon(item.category)}
        <span className="ml-1">{getCategoryLabel(item.category)}</span>
      </span>
      <span
        className={`text-gray-700 dark:text-gray-200 transition-all duration-150`}
      >
        {item.text}
      </span>
      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">
        {item.time}
      </span>
      {item.isRSS && (
        <span className="ml-1 text-xs text-green-600 dark:text-green-400 font-bold">
          ●
        </span>
      )}
    </span>
  );
};

// Error boundary component for the Marquee
const MarqueeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("querySelector") ||
        event.message.includes("__hrp")
      ) {
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
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
        <span className="text-sm text-gray-600 dark:text-gray-400">
          News ticker temporarily unavailable
        </span>
      </div>
    );
  }
};

export function NewsTicker() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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
    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        <div className="bg-red-500 dark:bg-black text-white px-6 py-2 font-black text-sm md:text-base tracking-[0.1em] flex items-center shrink-0 w-full">
          <div className="w-2 h-2 bg-white dark:bg-white rounded-full mr-3 live-flash" />
          BREAKING NEWS
          <div className="ml-auto flex items-center">
            <Clock className="h-4 w-4 text-white mr-1" />
            <span className="text-xs font-mono">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="flex-grow bg-gray-200/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden py-2 w-full">
          {isLoading
            ? (
              <div className="flex items-center justify-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Loading latest news...
                </span>
              </div>
            )
            : (
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
