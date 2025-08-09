import { frostedThemePlugin as whopFrostedPlugin } from "@whop/react/tailwind";
import { frostedThemePlugin } from 'frosted-ui';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        whop: {
          blue: '#1754D8',
          pomegranate: '#FA4616',
          chartreuse: '#DBF505',
          cod: '#141212',
          fantasy: '#FCF6F5',
        },
      },
    },
  },
  plugins: [whopFrostedPlugin(), frostedThemePlugin()],
};
