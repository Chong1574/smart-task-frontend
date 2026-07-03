<template>
  <div class="py-12 md:py-24">
    <div class="container max-w-5xl px-4">
      <div class="mb-10">
        <h1 class="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4">
          Calculadora de Impresión 3D
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Calcula el costo real de tus impresiones considerando filamento, electricidad y margen de ganancia. Elige tu impresora y listo.
        </p>
      </div>

      <PrintCost3DCalculator />

      <p class="text-xs text-muted-foreground mt-6 max-w-2xl">
        El consumo en watts es un promedio de referencia. Puede variar por temperatura de cama, boquilla y tipo de material. Si tienes un wattímetro, agrega tu impresora con el valor medido para más precisión.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Calculadora de Impresión 3D — Filamento, luz y margen',
  description: 'Calcula el costo real de tus impresiones 3D. Incluye consumo eléctrico por impresora, precio de filamento por kg y margen de ganancia.',
})
</script>
