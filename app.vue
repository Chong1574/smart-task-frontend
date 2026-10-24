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

useSeoMeta({
  title: 'Ingeniería, Automatización y Manufactura 3D | El Rincón de Brandy',
  description: 'Estudio de diseño, manufactura física en impresión 3D, ingeniería de software y automatización.',
  ogTitle: 'Ingeniería, Automatización y Manufactura 3D | El Rincón de Brandy',
  ogDescription: 'Transformamos ideas abstractas en realidades tangibles. Prototipado 3D de alta precisión y desarrollo tecnológico.',
  ogImage: 'https://shongyi.com/og-cover.jpg',
  ogImageSecureUrl: 'https://shongyi.com/og-cover.jpg',
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 805,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Ingeniería, Automatización y Manufactura 3D | El Rincón de Brandy',
  twitterDescription: 'Transformamos ideas abstractas en realidades tangibles.',
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
