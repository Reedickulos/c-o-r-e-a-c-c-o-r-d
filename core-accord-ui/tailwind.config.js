/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E40AF", // Blue-700
          light: "#3B82F6", // Blue-500
        },
        secondary: "#10B981", // Green-500
        background: {
          light: "#F9FAFB", // Gray-50
          dark: "#111827", // Gray-900
        },
        "surface-light": "#FFFFFF",
        "surface-dark": "#1F2937", // Gray-800
        "text-light": "#111827", // Gray-900
        "text-dark": "#F9FAFB", // Gray-50
        "text-muted-light": "#6B7280", // Gray-500
        "text-muted-dark": "#9CA3AF", // Gray-400
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}