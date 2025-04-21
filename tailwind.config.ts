import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './index.html', // Include the main HTML file
    './src/**/*.{js,ts,jsx,tsx}', // Include all JS, TS, JSX, and TSX files in the src directory
    './public/**/*.html', // Include any additional HTML files in the public directory (if applicable)
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa', // Example custom color
        foreground: '#212529', // Example custom color
      },
    },
  },
  plugins: [],
});