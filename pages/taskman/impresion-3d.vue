<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
    <div>
      <h1 class="text-3xl font-serif font-bold">Calculadora 3D</h1>
      <p class="text-muted-foreground">Cotiza tus impresiones considerando filamento, luz y margen.</p>
    </div>

    <PrintCost3DCalculator />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })
</script>
