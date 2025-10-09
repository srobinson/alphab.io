"use client";

import { motion } from "framer-motion";
import { BarChart3, Mail, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { StatusPill } from "@/components/ui/status-pill";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

// News item interface
interface NewsItem {
  id: string;
  text: string;
  link?: string;
  category: "breaking" | "trending" | "update" | "insight";
  time: string;
  timestamp: string;
  source: string;
  isRSS?: boolean;
  image?: string;
  description?: string;
}

interface QuickUpdatesSidebarProps {
  newsItems: NewsItem[];
  isLoading: boolean;
}

const NewsItemCard = ({ item }: { item: NewsItem }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breaking":
        return "red";
      case "trending":
        return "green";
      case "update":
        return "blue";
      case "insight":
        return "purple";
      default:
        return "blue";
    }
  };

  const cardContent = (
    <motion.div
      className="cyber-card p-4 hover:border-neon-blue/50 transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusPill variant={getCategoryColor(item.category)}>
              {item.category.toUpperCase()}
            </StatusPill>
          </div>
          <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2 leading-tight">
            {item.text}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.source}</span>
            <span className="font-mono">{item.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:ring-offset-2 focus:ring-offset-black rounded-lg"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export function QuickUpdatesSidebar({ newsItems, isLoading }: QuickUpdatesSidebarProps) {
  const { openContactDrawer } = useContactDrawer();
  const [stats, setStats] = useState({
    liveUpdates: 0,
    articlesToday: 0,
    sources: 0,
  });

  // Calculate stats from news items
  useEffect(() => {
    if (newsItems.length > 0) {
      const uniqueSources = new Set(newsItems.map((item) => item.source)).size;
      const today = new Date().toDateString();
      const todayItems = newsItems.filter(
        (item) => new Date(item.timestamp).toDateString() === today
      ).length;

      setStats({
        liveUpdates: newsItems.length,
        articlesToday: todayItems,
        sources: uniqueSources,
      });
    }
  }, [newsItems]);

  return (
    <div className="space-y-6">
      {/* Quick Updates Section */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-bold text-neon-blue">QUICK HITS</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : newsItems.length > 0 ? (
          <div className="space-y-3">
            {newsItems.slice(0, 8).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NewsItemCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No updates available</p>
          </div>
        )}
      </div>

      {/* Live Stats Section */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-neon-purple" />
          <h2 className="text-lg font-bold text-neon-purple">LIVE STATS</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="text-center p-3 bg-gray-900/50 rounded-lg border border-cyber-border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-bold text-neon-green mb-1">{stats.liveUpdates}</div>
            <div className="text-xs text-muted-foreground">Live Updates</div>
          </motion.div>

          <motion.div
            className="text-center p-3 bg-gray-900/50 rounded-lg border border-cyber-border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-neon-blue mb-1">{stats.articlesToday}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </motion.div>

          <motion.div
            className="text-center p-3 bg-gray-900/50 rounded-lg border border-cyber-border col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xl font-bold text-neon-purple mb-1">{stats.sources}</div>
            <div className="text-xs text-muted-foreground">Active Sources</div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cyber-card p-6 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 border-neon-blue/20">
        <div className="text-center">
          <Mail className="w-8 h-8 text-neon-blue mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">STAY UPDATED</h3>
          <p className="text-sm text-muted-foreground mb-4">Get AI insights delivered daily</p>
          <GradientButton
            variant="blue"
            size="lg"
            className="w-full"
            onClick={() => openContactDrawer({ mode: "newsletter", source: "news_feed_sidebar" })}
          >
            Subscribe Now
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
