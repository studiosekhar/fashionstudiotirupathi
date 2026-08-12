import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      // Forward /api/* to the local Express dev server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('firebase')) {
              return 'firebase'
            }
            if (id.includes('ogl')) {
              return 'ogl'
            }
            // All other vendors
            return 'vendor'
          }
        }
      }
    },
    // Increase chunk size warning limit since we're splitting
    chunkSizeWarningLimit: 1000,
  }
})
