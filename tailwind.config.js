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
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {},
  },
  plugins: [],
};
