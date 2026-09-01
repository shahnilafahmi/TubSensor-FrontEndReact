import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET = 'https://iotsensor-production-9d9f.up.railway.app'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-only: forwards /api/* to the Railway backend server-side,
      // so the browser never sees a cross-origin request (avoids CORS).
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
