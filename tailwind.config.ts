import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'whop-pomegranate': '#FF6B35',
        'whop-blue': '#1754d8',
        'whop-line-light': '#E1E1E1',
        'whop-line-dark': '#2A2A2A',
        'whop-bg-dark': '#111111',
        'whop-text-dark': '#B5B5B5',
        'whop-text-light': '#626262',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
