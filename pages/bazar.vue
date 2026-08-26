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

      <!-- Buscador -->
      <div class="max-w-xl mx-auto mb-8">
        <input
          v-model="query"
          type="search"
          placeholder="Buscar en el bazar (ej. portapapel, dinosaurio)"
          class="w-full h-11 px-4 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div v-if="loading" class="text-center text-xs text-muted-foreground mt-2">Buscando…</div>
        <div v-else-if="searchedLive" class="text-center text-xs text-primary mt-2">
          Búsqueda extendida a MakerWorld — nuevos modelos añadidos al bazar.
        </div>
        <div v-else-if="rateLimited" class="text-center text-xs text-amber-600 mt-2">
          Muchas búsquedas recientes. Mostrando sólo el catálogo local.
        </div>
      </div>

      <!-- Navegación Interna de Categorías -->
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button v-for="cat in categorias" :key="cat" class="px-6 py-2 rounded-full border border-border bg-card text-sm font-medium transition-colors hover:border-primary hover:text-primary">
          {{ cat }}
        </button>
      </div>

      <!-- Galería de Productos -->
      <div v-if="error" class="text-center text-destructive py-8">{{ error }}</div>
      <div v-else-if="products.length === 0 && !loading" class="text-center text-muted-foreground py-8">
        No hay productos disponibles todavía.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        <div
          v-for="product in products"
          :key="product.id"
          class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
          @click="selected = product"
        >
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
            <div class="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full border border-border/50 text-foreground">
              {{ product.origin || 'Crafted' }}
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{{ product.title }}</h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="mt-auto space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-sans font-medium text-foreground">{{ priceLabel(product) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <a
                  v-if="product.fileUrl"
                  :href="`${apiBase}/products/${product.id}/download`"
                  class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  target="_blank"
                  @click.stop
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
                  @click.stop
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <BazarProductDetail v-if="selected" :product="selected" @close="selected = null" />

    </div>
  </div>
</template>

<script setup lang="ts">
import BazarProductDetail from '~/components/BazarProductDetail.vue';

interface Variant { name: string; grams: number; hours: number; price: number }
interface Product {
  id: number;
  title: string;
  description?: string | null;
  price?: number | string | null;
  priceFrom?: number | null;
  variants?: Variant[] | null;
  images?: string[] | null;
  origin?: string;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  source?: string;
  sourceUrl?: string | null;
  licenseType?: string;
  licenseAttribution?: string;
  imageUrl?: string;
  isPublic?: boolean;
  category?: string;
  descriptionHtml?: string | null;
}

import { API_URL as apiBase } from '~/utils/apiUrl';
const products = ref<Product[]>([]);
const error = ref<string | null>(null);
const query = ref('');
const loading = ref(false);
const searchedLive = ref(false);
const rateLimited = ref(false);
const selected = ref<Product | null>(null);

async function load(q: string) {
  loading.value = true;
  error.value = null;
  searchedLive.value = false;
  rateLimited.value = false;
  try {
    const url = q ? `${apiBase}/products?q=${encodeURIComponent(q)}` : `${apiBase}/products`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (Array.isArray(data)) {
      products.value = data;
    } else {
      products.value = data.items || [];
      searchedLive.value = !!data.searchedLive;
      rateLimited.value = !!data.rateLimited;
    }
  } catch (e: any) {
    error.value = 'No se pudieron cargar los productos. Intenta recargar la página.';
    console.error('Error fetching products:', e);
  } finally {
    loading.value = false;
  }
}

// Debounce 400ms
let debounceTimer: any = null;
watch(query, v => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => load(v.trim()), 400);
});

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function priceLabel(p: Product): string {
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 1;
  const rawPrice = hasVariants ? p.priceFrom : (p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0))));
  const n = typeof rawPrice === 'number' ? rawPrice : 0;
  if (!n || isNaN(n)) return 'Gratis';
  return hasVariants ? `desde ${fmt(n)}` : fmt(n);
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

onMounted(() => load(''));
</script>
