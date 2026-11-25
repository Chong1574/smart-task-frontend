<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const route = useRoute()

useHead({
  titleTemplate: (titleChunk) => {
    if (!titleChunk || titleChunk === 'undefined' || titleChunk.startsWith('undefined')) {
      return 'El Rincón de Brandy'
    }
    if (route.path.startsWith('/taskman')) {
      return `${titleChunk} - Taskman`
    }
    return titleChunk
  }
})

const isTaskmanRoute = computed(() => route.path.startsWith('/taskman'))

useSeoMeta({
  title: () => isTaskmanRoute.value
    ? 'TaskMan | Productividad, Finanzas y Operaciones'
    : 'Ingeniería, Automatización y Manufactura 3D | El Rincón de Brandy',
  description: () => isTaskmanRoute.value
    ? 'Centro personal de productividad, finanzas, hábitos y operaciones de El Rincón de Brandy.'
    : 'Estudio de diseño, manufactura física en impresión 3D, ingeniería de software y automatización.',
  ogTitle: () => isTaskmanRoute.value
    ? 'TaskMan | El Rincón de Brandy'
    : 'Ingeniería, Automatización y Manufactura 3D | El Rincón de Brandy',
  ogDescription: () => isTaskmanRoute.value
    ? 'Productividad inteligente, agenda automática y control financiero.'
    : 'Transformamos ideas abstractas en realidades tangibles. Prototipado 3D de alta precisión y desarrollo tecnológico.',
  ogImage: 'https://shongyi.com/og-cover.jpg',
  ogImageSecureUrl: 'https://shongyi.com/og-cover.jpg',
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 805,
  twitterCard: 'summary_large_image',
  twitterTitle: () => isTaskmanRoute.value
    ? 'TaskMan | El Rincón de Brandy'
    : 'Ingeniería, Automatización y Manufactura 3D | El Rincón de Brandy',
  twitterDescription: () => isTaskmanRoute.value
    ? 'Productividad inteligente, agenda automática y control financiero.'
    : 'Transformamos ideas abstractas en realidades tangibles.',
  twitterImage: 'https://shongyi.com/og-cover.jpg'
})
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" rich-colors close-button />
    <ConfirmDialog />
    <CookieBanner />
  </div>
</template>

<style>
@import "~/assets/css/tailwind.css";
</style>
