import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { 'process.env': {} },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor dependencies into separate chunks
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0]; // Creates a chunk for each module
          }
        },
      },
    },
    minify: 'terser', // You can specify 'esbuild' or 'terser'
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
      mangle: true, // Enable variable name mangling
    },
  },
});
