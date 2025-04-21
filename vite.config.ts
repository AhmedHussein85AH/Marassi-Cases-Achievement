import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Ensure correct alias resolution
    },
  },
  base: '/Marassi-Cases-Achievement/', // Ensure this matches your GitHub Pages repository name
  build: {
    outDir: 'dist', // Ensure the output directory is set to "dist"
    rollupOptions: {
      // No need to externalize "sonner" unless explicitly required
    },
  },
});