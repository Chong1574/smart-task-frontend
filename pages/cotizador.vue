<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import QuoteTool from '@/components/QuoteTool.vue'

useHead({
  title: 'Cotizador 3D | El Rincón de Brandy',
  meta: [
    { name: 'description', content: 'Calcula el costo de tu impresión 3D al instante subiendo tu archivo STL.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <main class="container py-12">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold tracking-tight mb-4">Cotizador Digital</h1>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Sube tu modelo 3D y obtén un presupuesto inmediato. Nuestra Bambu Lab P1S se encargará del resto.
        </p>
      </div>
      <QuoteTool />
    </main>
  </div>
</template>
