import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-tuned Vite config:
// - target modern browsers so Vercel ships smaller, faster bundles
// - manual chunking keeps framer-motion (the heaviest dep) in its own file
//   so the app shell can paint while it streams
// - relative base path means the build is host-agnostic (Vercel, Netlify,
//   GitHub Pages, plain static VPS — all just work)
export default defineConfig({
  base: './',
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
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
