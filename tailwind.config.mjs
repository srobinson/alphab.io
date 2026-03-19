/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0a0a0a",
          raised: "#141414",
          overlay: "#1a1a1a",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          DEFAULT: "rgba(255, 255, 255, 0.1)",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgba(255, 255, 255, 0.7)",
            "--tw-prose-headings": "rgba(255, 255, 255, 0.9)",
            "--tw-prose-links": "rgba(255, 255, 255, 0.9)",
            "--tw-prose-bold": "rgba(255, 255, 255, 0.9)",
            "--tw-prose-code": "rgba(255, 255, 255, 0.8)",
            "--tw-prose-pre-bg": "#141414",
            "--tw-prose-pre-code": "rgba(255, 255, 255, 0.8)",
            "--tw-prose-quotes": "rgba(255, 255, 255, 0.6)",
            "--tw-prose-quote-borders": "rgba(255, 255, 255, 0.1)",
            "--tw-prose-counters": "rgba(255, 255, 255, 0.4)",
            "--tw-prose-bullets": "rgba(255, 255, 255, 0.3)",
            "--tw-prose-hr": "rgba(255, 255, 255, 0.06)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
