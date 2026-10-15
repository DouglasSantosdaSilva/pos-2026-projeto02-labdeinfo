import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://agendamentos.spaincentra1.cloudapp.azure.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})