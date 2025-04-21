import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/Marassi-Cases-Achievement/', // Ensure this matches your GitHub Pages repository name
  build: {
    outDir: 'dist', // Ensure the output directory is set to "dist"
    rollupOptions: {
      external: ['@radix-ui/react-tooltip'], // Add @radix-ui/react-tooltip here
    },
  },
});