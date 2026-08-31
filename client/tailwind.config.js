/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF6EC",
        blush: "#F3E1D0",
        maroon: {
          DEFAULT: "#7A1F2B",
          dark: "#54141D",
          light: "#9C3040",
        },
        gold: {
          DEFAULT: "#C89B3C",
          light: "#E8CE94",
          dark: "#9C7726",
        },
        forest: {
          DEFAULT: "#2F4B3C",
          light: "#3F6350",
        },
        charcoal: "#2B2320",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Mukta'", "sans-serif"],
      },
      backgroundImage: {
        "paisley-fade":
          "radial-gradient(circle at top right, rgba(200,155,60,0.12), transparent 55%), radial-gradient(circle at bottom left, rgba(122,31,43,0.10), transparent 55%)",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(84, 20, 29, 0.25)",
        "card-hover": "0 18px 40px -14px rgba(84, 20, 29, 0.35)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
