<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import InspirationWall from '@/components/InspirationWall.vue'

useHead({
  title: 'Muro de Inspiración | El Rincón de Brandy',
  meta: [
    { name: 'description', content: 'Explora modelos 3D increíbles de MakerWorld, Printables y más.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <main class="container py-12">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold tracking-tight mb-4">Muro de Inspiración</h1>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Descubre diseños asombrosos curados de las mejores comunidades de impresión 3D. 
          Si te gusta algo, podemos imprimirlo para ti.
        </p>
      </div>
      <InspirationWall />
    </main>
  </div>
</template>
