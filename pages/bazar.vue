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
      <div v-if="error" class="text-center text-destructive py-8">{{ error }}</div>
      <div v-else-if="products.length === 0" class="text-center text-muted-foreground py-8">
        No hay productos disponibles todavía.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        <div v-for="product in products" :key="product.id" class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
          <div class="aspect-square bg-secondary/50 overflow-hidden relative">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.title"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif italic">
              [ Imagen del Producto ]
            </div>
            <!-- Etiqueta de Origen -->
            <div class="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full border border-border/50 text-foreground">
              {{ product.origin || 'Crafted' }}
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{{ product.title }}</h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="mt-auto space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-sans font-medium text-foreground">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <a
                  v-if="product.fileUrl"
                  :href="`${apiBase}/products/${product.id}/download`"
                  class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  target="_blank"
                >
                  Descargar
                  <span v-if="product.fileSizeBytes" class="text-muted-foreground">
                    ({{ formatSize(product.fileSizeBytes) }})
                  </span>
                </a>
                <button
                  type="button"
                  class="rounded-md p-2 hover:bg-accent"
                  aria-label="Agregar al carrito"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number;
  title: string;
  description: string;
  price: number | string;
  origin?: string;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  source?: string;
  licenseType?: string;
  licenseAttribution?: string;
  imageUrl?: string;
  isPublic?: boolean;
  category?: string;
}

const apiBase = import.meta.env.VITE_API_URL || 'https://taskapi.shongyi.com/api';
const products = ref<Product[]>([]);
const error = ref<string | null>(null);

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatPrice(price: number | string | null | undefined): string {
  const n = typeof price === 'number' ? price : parseFloat(String(price ?? 0));
  if (isNaN(n) || n === 0) return 'Gratis';
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
}

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

// Fetch products from API
onMounted(async () => {
  try {
    const response = await fetch(`${apiBase}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    products.value = await response.json();
  } catch (e: any) {
    error.value = 'No se pudieron cargar los productos. Intenta recargar la página.';
    console.error('Error fetching products:', e);
  }
});
</script>
