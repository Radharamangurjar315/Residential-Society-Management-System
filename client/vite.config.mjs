import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "https://residential-society-management-system.onrender.com",
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Now '@' refers to 'src/'
    },
  },
});
