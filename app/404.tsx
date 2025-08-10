import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | RADE",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-lg mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
