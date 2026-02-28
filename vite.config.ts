import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Esto le permite escuchar fuera del contenedor
    port: 5173,
    allowedHosts: [
      'alot-menus-november-invention.trycloudflare.com' // <-- ¡Aquí está el Pase VIP!
    ]
  }
})


