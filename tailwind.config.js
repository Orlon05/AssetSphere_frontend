/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        as: {
          bg: "#F6F7FB",
          panel: "#FFFFFF",
          border: "#E5E7EB",
          text: "#0B1220",
          muted: "#5B6475",
          brand: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#1E3A8A",
          },
        },
      },
      boxShadow: {
        as: "0 10px 25px -15px rgba(15, 23, 42, 0.35)",
        "as-md": "0 12px 30px -18px rgba(15, 23, 42, 0.45)",
      },
    },
  },
  plugins: [],
};
