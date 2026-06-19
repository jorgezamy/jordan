import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#003241",
          dark: "#004d63",
        },
        danger: {
          DEFAULT: "#ef4444",
          hover: "#dc2626",
          subtle: "#fef2f2",
          border: "#fee2e2",
          text: "#dc2626",
        },
        success: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
          subtle: "#dcfce7",
          border: "#4ade80",
          text: "#15803d",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
