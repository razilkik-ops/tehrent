import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F2",
        ink: "#1E231C",
        night: "#171B16",
        accent: "#F0B429",
        moss: "#4D6B3C"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 27, 22, 0.10)",
        card: "0 12px 30px rgba(23, 27, 22, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.4rem"
      }
    }
  },
  plugins: []
};

export default config;
