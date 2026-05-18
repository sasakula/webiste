import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-tuned Vite config:
// - target browser modern supaya bundle tetap ringan
// - manual chunking memisahkan framer-motion + react-router supaya app shell
//   bisa paint duluan sebelum chunk berat selesai streaming
// - base '/' aman dengan BrowserRouter; SPA fallback diatur di vercel.json
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
