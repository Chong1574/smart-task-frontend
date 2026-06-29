// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_URL = 'https://shongyi.com'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@sentry/nuxt/module'
  ],
  sentry: {
    sourceMapsUploadOptions: {
      enabled: false
    }
  },
  site: {
    url: SITE_URL,
    name: 'El Rincón de Brandy'
  },
  sitemap: {
    exclude: ['/taskman/**', '/login', '/register', '/forgot-password', '/auth-callback']
  },
  robots: {
    disallow: ['/taskman', '/login', '/register', '/forgot-password', '/auth-callback']
  },
  googleFonts: {
    families: {
      'Playfair+Display': [400, 500, 600, 700, 800],
      'Inter': [300, 400, 500, 600]
    }
  },
  colorMode: {
    classSuffix: ''
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
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/', '/bazar', '/estudio', '/proteccion', '/privacidad', '/terminos'],
      crawlLinks: false
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'canonical', href: SITE_URL }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

})