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
      "neutral-web-unifi-color-neutral-00": "#fff",
      "semantic-destructive-web-unifi-color-red-06": "#F03A3E",
      "neutral-6": "#B6B9C4",
      "u-blue-6-primary": "#006FFF",
      white: "#ffffff",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    boxShadow: {
      popover: "0px 16px 32px 0px rgba(28, 30, 45, 0.20)",
    },
    extend: {},
  },
  plugins: [],
};
