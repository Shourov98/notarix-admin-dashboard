/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 14px 34px rgba(15, 23, 42, 0.08)",
        modal: "0 28px 90px rgba(15, 23, 42, 0.22)",
      },
    },
  },
  plugins: [],
};
