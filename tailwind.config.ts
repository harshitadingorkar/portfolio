import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-subtle": "var(--bg-subtle)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        accent: "var(--accent)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
