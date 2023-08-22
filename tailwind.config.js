/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      "text-web-unifi-text-3": "#808893",
      "neutral-web-unifi-color-neutral-02": "#F4F5F6",
      "primary-web-unifi-color-ublue-06": "#006FFF",
      "neutral-2": "#F6F6F8",
      "neutral-web-unifi-color-neutral-01": "#F9FAFA",
      "text-text-3": "rgba(0, 0, 0, 0.45)",
      "gray-4": "#BDBDBD",
      "neutral-neutral-03-light": "#EDEDF0",
      "text-text-2-light": "rgba(0, 0, 0, 0.65)",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {},
  },
  plugins: [],
};
