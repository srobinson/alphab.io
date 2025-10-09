"use client";

import { CheckCircle, Cpu, Mail, Zap } from "lucide-react";
import { useState } from "react";

export const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const resp = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          publication: "tech_accelerator",
          source: "tech_accelerator_page",
        }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubmitted(true);
      setEmail("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save email. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="border border-white/20 bg-black/50 backdrop-blur-xs p-6 sm:p-8 lg:p-12">
        <Cpu className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-yellow-400 mx-auto mb-6 sm:mb-8 animate-pulse" />
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter mb-4 sm:mb-6">
          <span className="text-white">LAUNCHING</span>{" "}
          <span className="bg-linear-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            SOON
          </span>
        </h3>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
          Revolutionary acceleration services are being engineered.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>Be the first to know when we launch.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-black/70 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-hidden focus:border-green-400 focus:ring-2 focus:ring-green-400/20 text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 sm:px-8 py-3 bg-linear-to-r from-green-500 to-yellow-500 text-black font-bold rounded-lg hover:from-green-400 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    JOINING...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    GET NOTIFIED
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>}
          </form>
        ) : (
          <div className="max-w-md mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-green-400 mb-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg font-bold">SUCCESS!</span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base">
              You'll be the first to know when Tech Accelerator launches.
            </p>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-green-400">
          <Zap className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-xs sm:text-sm lg:text-lg tracking-wider text-center">
            UNPRECEDENTED DEVELOPMENT VELOCITY
          </span>
          <Zap className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
        </div>
      </div>
    </div>
  );
};
