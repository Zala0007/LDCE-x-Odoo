import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17332d",
        forest: "#1e5948",
        moss: "#5e806c",
        sand: "#f5efe3",
        sun: "#f1b24a",
        coral: "#e6775c",
        cream: "#fffdf8",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 51, 45, 0.10)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
