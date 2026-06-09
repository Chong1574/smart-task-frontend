<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Taskman` : 'Taskman';
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo.png' }
  ]
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
