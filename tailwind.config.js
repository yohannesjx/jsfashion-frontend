import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "16px" },
    extend: {
      colors: {
        brand: {
          50: "#fff0f6",
          100: "#ffe0ee",
          200: "#ffb8d8",
          300: "#ff8fc1",
          400: "#ff66ab",
          500: "#ff2a8b",
          600: "#e01472",
          700: "#b80e5d",
          800: "#8f0b49",
          900: "#680835",
        },
      },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,0.08)" },
      animation: { "fade-in": "fade-in .4s ease both" },
      keyframes: { "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } } },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
}
export default config