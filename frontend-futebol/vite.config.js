import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Aqui está a mágica do v4
  ],
  resolve: {
    alias: {
      // Configuração robusta para Linux/Fedora
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
})