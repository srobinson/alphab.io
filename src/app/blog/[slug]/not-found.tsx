"use client";

import { ArrowLeft, FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

export default function BlogPostNotFound() {
  const { openContactDrawer } = useContactDrawer();
  return (
    <article className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      <div className="relative container mx-auto px-6 py-16 max-w-4xl">
        <div className="relative bg-whitedark:bg-black/50 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xs overflow-hidden p-12 text-center">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-blue-500/20 dark:border-blue-400/20 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-purple-500/20 dark:border-purple-400/20 rounded-br-3xl" />

          <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            This blog post doesn't exist or has been removed. It might have been moved to a
            different URL or is no longer available.
          </p>

          <div className="space-y-3 max-w-md mx-auto">
            <Button
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
              asChild
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                openContactDrawer({ mode: "contact", source: "blog_not_found_button" })
              }
            >
              <Search className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Looking for something specific? Here are some popular options:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/blog"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >
                Latest Articles
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/services"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >
                Our Services
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <button
                type="button"
                onClick={() =>
                  openContactDrawer({ mode: "contact", source: "blog_not_found_link" })
                }
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
