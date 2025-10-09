"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface BlogPostCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    publishedAt?: string;
    category: string;
    readTime?: string;
    tags: string[];
  };
  index?: number;
  variant?: "featured" | "recent";
}

export function BlogPostCard({ post, index = 0, variant = "featured" }: BlogPostCardProps) {
  if (variant === "featured") {
    return (
      <motion.article
        key={post.slug}
        className="group bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-cyber-border transition-all duration-200 hover:shadow-xl dark:hover:shadow-neon-blue/20 hover:scale-[1.02]"
        initial="hidden"
        whileInView="visible"
        variants={cardVariants}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-sm font-semibold rounded-full">
            {post.category}
          </span>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.publishedAt || post.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime || "-"}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-neon-blue transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{post.description}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-neon-blue font-semibold hover:text-neon-cyan transition-colors"
        >
          Read More
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      key={post.slug}
      className="group bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-cyber-border transition-all duration-200 hover:shadow-lg dark:hover:shadow-neon-blue/10 hover:border-neon-blue/50"
      initial="hidden"
      whileInView="visible"
      variants={cardVariants}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="px-2 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-xs font-semibold rounded">
              {post.category}
            </span>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(post.publishedAt || post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {post.readTime || "-"}
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-neon-blue transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-muted-foreground">{post.description}</p>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-neon-blue font-semibold hover:text-neon-cyan transition-colors whitespace-nowrap"
        >
          Read More
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}
