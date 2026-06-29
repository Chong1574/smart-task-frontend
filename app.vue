<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const route = useRoute()
useHead({
  titleTemplate: (titleChunk) => {
    if (route.path.startsWith('/taskman')) {
      return titleChunk ? `${titleChunk} - Taskman` : 'Taskman'
    }
    return titleChunk || 'El Rincón de Brandy'
  }
})
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" rich-colors close-button />
    <ConfirmDialog />
  </div>
</template>

<style>
@import "~/assets/css/tailwind.css";
</style>
