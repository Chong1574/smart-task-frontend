<script setup lang="ts">
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
  </div>
</template>

<style>
@import "~/assets/css/tailwind.css";
</style>
