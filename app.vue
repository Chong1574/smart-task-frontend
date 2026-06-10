<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Taskman` : 'Taskman';
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' }
  ],
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
