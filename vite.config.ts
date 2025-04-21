import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Content-Type', 'application/javascript');
          next();
        });
      }
    }
  ],
  base: '/Marassi-Cases-Achievement/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    modulePreload: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      },
    },
  },
});