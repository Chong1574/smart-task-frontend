// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/color-mode', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'Playfair+Display': [400, 500, 600, 700, 800],
      'Inter': [300, 400, 500, 600]
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  devServer: {
    port: 5173,
    host: '0.0.0.0'
  },
  nitro: {
    preset: 'cloudflare-pages'
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  routeRules: {
    '/taskman/**': { proxy: 'http://task_legacy_frontend:5173/taskman/**' }
  }
})