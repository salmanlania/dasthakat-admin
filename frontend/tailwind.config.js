/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Poppins", sans-serif'],
    },
    extend: {
      colors: {
        primary: "#065098",
        success: "#52c41a",
        warning: "#faad14",
        error: "#ff4d4f",
      },
    },
  },
  plugins: [],
};
