/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          from: "#0dcaf0", // cyan
          to: "#0aa5c2",   // deeper cyan/blue
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, #0dcaf0, #0aa5c2)",
      },
    },
  },
  plugins: [],
};
