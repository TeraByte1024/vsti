/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{vue,html,js,ts}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        accent: "#354649",
        primary: "#758295",
        secondary: "#E5EDEE",
        focus: "#D4DCDD",
        success: "#A3C6C4",
      },
    },
  },
  plugins: [],
};
