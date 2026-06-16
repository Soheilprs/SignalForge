/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          ink: "#111317",
          panel: "#171b22",
          gold: "#f3ba2f",
          mint: "#42d392",
          coral: "#f9735b",
          line: "#2a303a"
        }
      },
      boxShadow: {
        glow: "0 20px 70px rgba(243, 186, 47, 0.15)"
      }
    }
  },
  plugins: []
};
