import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/' assumes the repo is NajibF24/najibf24.github.io (user site).
// For a project site (e.g. NajibF24/portfolio) set base: '/portfolio/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
