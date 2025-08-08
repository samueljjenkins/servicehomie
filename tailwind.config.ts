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
    extend: {},
  },
  plugins: [whopFrostedPlugin(), frostedThemePlugin()],
};
