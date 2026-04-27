import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('router')) {
              return 'vendor-react';
            }
            if (id.includes('recharts') || id.includes('lucide-react')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
          if (id.includes('src/lib/data.js')) {
            return 'data-layer';
          }
        },
      },
    },
  },
})
