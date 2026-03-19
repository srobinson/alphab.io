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
          DEFAULT: "#ffffff",
          raised: "#f8f8fa",
          muted: "#f0eef5",
        },
        text: {
          DEFAULT: "#1a1a2e",
          secondary: "#555566",
          tertiary: "#888899",
        },
        accent: {
          DEFAULT: "#7c5cbf",
          light: "#e8e0f3",
        },
        border: {
          subtle: "rgba(0, 0, 0, 0.06)",
          DEFAULT: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
