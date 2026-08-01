import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    port: 3000, // Frontend port
    proxy: {
      '/send-bulk-email': {
        target: 'http://localhost:5000', // Local backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});