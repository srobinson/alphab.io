import { BookOpen, Briefcase, FileQuestion, Home, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <FileQuestion className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Page Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            This page doesn't exist or has been moved. Let's get you back to exploring AlphaB's
            content.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">Home</span>
              </Button>
            </Link>

            <Link href="/blog">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-sm">Blog</span>
              </Button>
            </Link>

            <Link href="/services">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Briefcase className="w-5 h-5" />
                <span className="text-sm">Services</span>
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">Contact</span>
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Looking for something specific? Try our search or browse our latest content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
