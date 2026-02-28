import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [vue(), cloudflare()],
  server: {
    host: true, // Esto le permite escuchar fuera del contenedor
    port: 5173,
    allowedHosts: [
      'alot-menus-november-invention.trycloudflare.com' // <-- ¡Aquí está el Pase VIP!
    ]
  }
})