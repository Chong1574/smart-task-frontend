<template>
  <div class="py-12 md:py-20">
    <div class="container max-w-6xl px-4">
      
      <!-- Cabecera -->
      <div class="mb-16 text-center">
        <h1 class="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-foreground">
          El Bazar
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Una galería cuidadosamente seleccionada. Aquí encontrarás nuestras creaciones físicas, desde herramientas tecnológicas hasta accesorios que te acompañan.
        </p>
      </div>

      <!-- Navegación Interna de Categorías -->
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button v-for="cat in categorias" :key="cat" class="px-6 py-2 rounded-full border border-border bg-card text-sm font-medium transition-colors hover:border-primary hover:text-primary">
          {{ cat }}
        </button>
      </div>

      <!-- Galería de Productos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Producto Ejemplo 1 -->
        <div class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
          <div class="aspect-square bg-secondary/50 overflow-hidden relative">
            <div class="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif italic">
              [ Imagen del Producto ]
            </div>
            <!-- Etiqueta de Origen -->
            <div class="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full border border-border/50 text-foreground">
              Crafted in 3D
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Soporte Geométrico para Auriculares</h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-2">Un diseño minimalista y robusto para mantener tu espacio de trabajo ordenado.</p>
            <div class="mt-auto flex items-center justify-between">
              <span class="font-sans font-medium text-foreground">$450 MXN</span>
              <button class="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Producto Ejemplo 2 (Lifestyle/Cuero sugerido) -->
        <div class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
          <div class="aspect-square bg-secondary/50 overflow-hidden relative">
            <div class="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif italic">
              [ Imagen del Producto ]
            </div>
            <div class="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full border border-border/50 text-foreground">
              Handcrafted
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Billetera de Ruta</h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-2">Pieza rústica y pulida, diseñada para la durabilidad. Descubre el arte detrás de los detalles.</p>
            <div class="mt-auto flex items-center justify-between">
              <span class="font-sans font-medium text-foreground">$850 MXN</span>
              <button class="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Producto Ejemplo 3 -->
        <div class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
          <div class="aspect-square bg-secondary/50 overflow-hidden relative">
            <div class="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif italic">
              [ Imagen del Producto ]
            </div>
            <div class="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full border border-border/50 text-foreground">
              Tech
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Módulo de Control ESP32</h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-2">El cerebro perfecto para tu próximo proyecto de automatización en casa o en el taller.</p>
            <div class="mt-auto flex items-center justify-between">
              <span class="font-sans font-medium text-foreground">$220 MXN</span>
              <button class="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'El Bazar — Productos en impresión 3D y accesorios',
  description: 'Galería de creaciones físicas: piezas en impresión 3D, accesorios de estilo de vida y electrónica diseñada con detalle.',
  ogTitle: 'El Bazar — Crafted in 3D',
  ogDescription: 'Productos físicos diseñados y fabricados a medida.',
  ogType: 'website',
  ogUrl: 'https://shongyi.com/bazar',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'El Bazar — El Rincón de Brandy',
      url: 'https://shongyi.com/bazar',
      description: 'Tienda de productos físicos en impresión 3D, accesorios de estilo de vida y electrónica.',
      parentOrganization: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
    })
  }]
})

const categorias = [
  'Todos',
  'Impresión 3D',
  'Estilo de Vida y Equipamiento',
  'Electrónica'
];
</script>
