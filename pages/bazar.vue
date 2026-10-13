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

      <!-- Layout con Sidebar (estilo MercadoLibre/Amazon) -->
      <div class="flex flex-col md:flex-row gap-8 items-start">
        
        <!-- Sidebar de Filtros -->
        <aside class="w-full md:w-64 flex-shrink-0 bg-card border border-border/60 rounded-2xl p-5 shadow-sm md:sticky md:top-24 md:z-10 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold font-serif">Filtros</h2>
            <button 
              v-if="hasActiveFilters" 
              type="button"
              @click="resetFilters" 
              class="text-xs text-primary hover:underline font-medium"
            >
              Limpiar
            </button>
          </div>
          
          <!-- Categorías -->
          <div class="mb-5">
            <h3 class="font-semibold text-sm mb-2.5 text-foreground">Categorías</h3>
            <ul class="space-y-1">
              <li v-for="cat in categoriesWithCounts" :key="cat.id">
                <button 
                  type="button"
                  @click="selectedCategory = cat.id"
                  class="text-xs w-full text-left transition-colors flex items-center justify-between py-1 group"
                  :class="selectedCategory === cat.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'"
                >
                  <span class="truncate pr-2">{{ cat.label }}</span>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[11px] text-muted-foreground/70 font-normal">({{ cat.count }})</span>
                    <span v-if="selectedCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          <!-- Precio / Costo (Colocado arriba de etiquetas para visibilidad inmediata) -->
          <div class="mb-5 pt-4 border-t border-border/60">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm text-foreground">Precio</h3>
              <button 
                v-if="priceRange[0] > 0 || priceRange[1] < 1000" 
                type="button"
                @click="selectPricePreset(PRICE_PRESETS[0])" 
                class="text-[11px] text-primary hover:underline font-medium"
              >
                Restablecer
              </button>
            </div>

            <!-- Rangos rápidos -->
            <ul class="space-y-1 mb-3">
              <li v-for="preset in PRICE_PRESETS" :key="preset.id">
                <button
                  type="button"
                  @click="selectPricePreset(preset)"
                  class="text-xs w-full text-left transition-colors flex items-center justify-between py-1 group"
                  :class="selectedPricePreset === preset.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'"
                >
                  <span>{{ preset.label }}</span>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[11px] text-muted-foreground/70 font-normal">({{ getPresetCount(preset) }})</span>
                    <span v-if="selectedPricePreset === preset.id" class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  </div>
                </button>
              </li>
            </ul>

            <!-- Inputs manuales Min y Max -->
            <div class="pt-2 border-t border-border/40">
              <div class="flex items-center gap-1.5 mb-2">
                <div class="relative flex-1">
                  <span class="absolute left-2 top-1.5 text-[11px] text-muted-foreground">$</span>
                  <input 
                    type="number" 
                    v-model.number="minPriceInput" 
                    placeholder="Mín" 
                    min="0"
                    class="w-full h-7 pl-5 pr-1.5 rounded-md border border-border bg-background text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    @keydown.enter="applyCustomPrice"
                  />
                </div>
                <span class="text-xs text-muted-foreground">-</span>
                <div class="relative flex-1">
                  <span class="absolute left-2 top-1.5 text-[11px] text-muted-foreground">$</span>
                  <input 
                    type="number" 
                    v-model.number="maxPriceInput" 
                    placeholder="Máx" 
                    min="0"
                    class="w-full h-7 pl-5 pr-1.5 rounded-md border border-border bg-background text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    @keydown.enter="applyCustomPrice"
                  />
                </div>
                <button 
                  type="button" 
                  @click="applyCustomPrice" 
                  class="h-7 px-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-md border border-border cursor-pointer transition-colors"
                >
                  Ir
                </button>
              </div>

              <!-- Slider visual -->
              <div class="flex justify-between items-center text-[10px] text-muted-foreground mb-1.5 px-0.5">
                <span>{{ fmt(priceRange[0]) }}</span>
                <span>{{ priceRange[1] >= 1000 ? 'Sin límite' : fmt(priceRange[1]) }}</span>
              </div>
              <Slider v-model="priceRange" :min="0" :max="1000" :step="10" class="w-full" />
            </div>
          </div>

          <!-- Etiquetas Populares (Con scroll propio y buscador) -->
          <div v-if="popularTags.length > 0" class="mb-5 pt-4 border-t border-border/60">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm text-foreground">Etiquetas</h3>
              <button 
                v-if="selectedTag" 
                type="button"
                @click="selectedTag = null" 
                class="text-[11px] text-primary hover:underline font-medium"
              >
                Quitar
              </button>
            </div>

            <!-- Mini buscador de etiquetas -->
            <div class="relative mb-2">
              <input
                type="text"
                v-model="tagSearchQuery"
                placeholder="Buscar etiqueta..."
                class="w-full h-7 pl-7 pr-6 rounded-md border border-border bg-background text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <svg class="absolute left-2 top-1.5 text-muted-foreground/60 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button v-if="tagSearchQuery" @click="tagSearchQuery = ''" class="absolute right-2 top-1 text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>

            <!-- Contenedor scrollable de etiquetas -->
            <div class="max-h-48 overflow-y-auto pr-1 space-y-1">
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="tag in filteredTags"
                  :key="tag.norm"
                  type="button"
                  @click="toggleTag(tag.display)"
                  class="text-xs px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer"
                  :class="isTagActive(tag.norm)
                    ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground border-border/50 hover:bg-secondary/70'"
                >
                  <span>#{{ tag.display }}</span>
                  <span class="text-[10px] opacity-70">({{ tag.count }})</span>
                </button>
              </div>
              <p v-if="filteredTags.length === 0" class="text-xs text-muted-foreground text-center py-3">
                No hay etiquetas con "{{ tagSearchQuery }}"
              </p>
            </div>
          </div>

          <!-- Botón de Búsqueda Profunda (MakerWorld) -->
          <div class="pt-4 border-t border-border/60">
            <h3 class="font-semibold text-sm mb-1.5 text-foreground">¿No encuentras lo que buscas?</h3>
            <p class="text-xs text-muted-foreground mb-3">Busca en toda la red y encuentra el modelo perfecto para hacerlo realidad.</p>
            <button 
              @click="triggerDeepSearch" 
              class="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium py-2 px-3 rounded-xl transition-all border border-border flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              :disabled="loadingDeep || !query.trim()"
            >
              <span v-if="loadingDeep" class="animate-pulse">{{ deepSearchPhrases[deepSearchStatusIndex] }}</span>
              <span v-else>Traer de toda la Web</span>
            </button>
            <p v-if="!query.trim()" class="text-[10px] text-muted-foreground mt-1.5 text-center">Escribe algo en el buscador primero.</p>
          </div>
        </aside>

        <!-- Contenido Principal -->
        <main class="flex-1 w-full min-w-0">
          <!-- Barra de Filtros Activos -->
          <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-card border border-border/60 text-xs">
            <span class="text-muted-foreground font-medium mr-1">Filtros:</span>

            <!-- Categoría activa -->
            <span 
              v-if="selectedCategory !== 'todos'"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >
              Categoría: {{ currentCategoryLabel }}
              <button type="button" @click="selectedCategory = 'todos'" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Etiqueta activa -->
            <span 
              v-if="selectedTag"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >
              #{{ selectedTag }}
              <button type="button" @click="selectedTag = null" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Precio -->
            <span 
              v-if="priceRange[0] > 0 || priceRange[1] < 1000"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium border border-border"
            >
              {{ fmt(priceRange[0]) }} - {{ priceRange[1] >= 1000 ? 'Sin límite' : fmt(priceRange[1]) }}
              <button type="button" @click="priceRange = [0, 1000]" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Búsqueda -->
            <span 
              v-if="query.trim()"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium border border-border"
            >
              "{{ query.trim() }}"
              <button type="button" @click="query = ''" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Limpiar todo -->
            <button 
              type="button" 
              @click="resetFilters" 
              class="ml-auto text-primary hover:underline font-medium text-xs"
            >
              Limpiar todo
            </button>
          </div>

          <!-- Contador de resultados -->
          <div class="flex items-center justify-between mb-4 px-1">
            <p class="text-xs text-muted-foreground">
              Mostrando <span class="font-semibold text-foreground">{{ filteredProducts.length }}</span> productos
              <span v-if="products.length > 0 && filteredProducts.length !== products.length">
                (de {{ products.length }})
              </span>
            </p>
          </div>

          <div v-if="error" class="text-center text-destructive py-8">{{ error }}</div>
          <div v-else-if="filteredProducts.length === 0 && !loading && !isDeepSearching" class="text-center text-muted-foreground py-16 bg-card border border-border/60 rounded-2xl px-6">
            <p class="text-lg font-medium mb-2 text-foreground">No hay resultados con los filtros actuales.</p>
            <p class="text-sm mb-6 max-w-md mx-auto">Prueba quitando algún filtro o ajustando el rango de precio para ver más opciones.</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <button 
                type="button" 
                @click="resetFilters" 
                class="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium py-2 px-4 rounded-xl transition-all shadow-sm"
              >
                Limpiar filtros
              </button>
              <button 
                v-if="query.trim()"
                type="button"
                @click="triggerDeepSearch" 
                class="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium py-2 px-4 rounded-xl transition-all border border-border"
              >
                Traer de toda la Web
              </button>
            </div>
          </div>
          <template v-else>
            <div v-if="isDeepSearching" class="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-card border border-border/60 text-sm text-muted-foreground shadow-sm">
              <span class="relative flex h-2.5 w-2.5 shrink-0">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span class="font-medium animate-pulse">{{ deepSearchPhrases[deepSearchStatusIndex] }}</span>
              <span class="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/70">Procesando</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
          @click="selected = product"
        >
          <div class="aspect-square bg-secondary/50 overflow-hidden relative">
            <img
              v-if="product.imageUrl"
              :src="imgProxy(product.imageUrl, { width: 600 })"
              :srcset="imgProxySrcSet(product.imageUrl, 600)"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              :alt="product.title"
              loading="lazy"
              decoding="async"
              width="600"
              height="600"
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
              <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-1 mb-4 mt-[-8px]">
                <button
                  v-for="tag in product.tags.slice(0, 3)"
                  :key="tag"
                  type="button"
                  @click.stop="toggleTag(tag)"
                  class="px-2 py-0.5 text-[10px] rounded uppercase tracking-wider transition-colors cursor-pointer"
                  :class="isTagActive(tag)
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-secondary/50 text-secondary-foreground hover:bg-primary/20 hover:text-primary'"
                  title="Filtrar por esta etiqueta"
                >
                  {{ tag }}
                </button>
                <span v-if="product.tags.length > 3" class="text-[10px] text-muted-foreground self-center">
                  +{{ product.tags.length - 3 }}
                </span>
              </div>

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
                  class="rounded-md p-2 hover:bg-accent hover:text-primary transition-colors"
                  aria-label="Agregar al carrito"
                  @click.stop="addToCartFromGrid(product)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Esqueletos mientras carga -->
        <div v-if="loading || isDeepSearching" v-for="i in (filteredProducts.length === 0 ? 6 : 2)" :key="'skel-'+i" class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60">
          <div class="aspect-square bg-secondary/50 animate-pulse"></div>
          <div class="p-6 flex flex-col flex-grow">
            <div class="h-6 bg-secondary/60 rounded animate-pulse w-3/4 mb-3"></div>
            <div class="h-4 bg-secondary/40 rounded animate-pulse w-full mb-2"></div>
            <div class="h-4 bg-secondary/40 rounded animate-pulse w-5/6 mb-4"></div>
            <div class="mt-auto flex items-center justify-between">
              <div class="h-5 bg-secondary/50 rounded animate-pulse w-1/3"></div>
              <div class="h-8 w-8 bg-secondary/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      </template>

      <BazarProductDetail 
        v-if="selected" 
        :product="selected" 
        @close="selected = null" 
        @select-tag="handleSelectTagFromDetail" 
      />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BazarProductDetail from '~/components/BazarProductDetail.vue';
import CartDrawer from '~/components/CartDrawer.vue';
import { imgProxy, imgProxySrcSet } from '~/utils/imgProxy';
import { useCartStore } from '~/stores/cart';
import { toast } from 'vue-sonner';

const cart = useCartStore();

function addToCartFromGrid(product: Product) {
  cart.addItem(product);
  toast.success('Agregado al carrito', {
    description: `1x ${product.title}`,
    duration: 3000
  });
}

// Preconnect al proxy de imágenes — evita el hit de handshake TLS en el primer render.
useHead({
  link: [
    { rel: 'preconnect', href: 'https://wsrv.nl', crossorigin: '' },
    { rel: 'dns-prefetch', href: 'https://wsrv.nl' }
  ]
});

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
  tags?: string[] | null;
}

import { API_URL as apiBase } from '~/utils/apiUrl';
const products = ref<Product[]>([]);
const error = ref<string | null>(null);
const query = ref('');
const loading = ref(false);
const loadingDeep = ref(false);
const isDeepSearching = ref(false);
const deepSearchPhrases = ['Buscando en la web...', 'Filtrando opciones...', 'Escogiendo los mejores modelos para ti...', 'Traduciendo y optimizando detalles...', 'Casi listo...'];
const deepSearchStatusIndex = ref(0);
let deepSearchStatusInterval = null;
const searchedLive = ref(false);
const rateLimited = ref(false);
const selected = ref<Product | null>(null);

function normalizeText(s: string | null | undefined): string {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

interface CategoryDef {
  id: string;
  label: string;
  match: (p: Product) => boolean;
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    id: 'todos',
    label: 'Todos',
    match: () => true
  },
  {
    id: 'decoracion',
    label: 'Decoración',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('decoraci') || cat.includes('adorno') ||
        tags.some(t => t.includes('decorac') || t.includes('adorno') || t.includes('figura') || t.includes('lampara') || t.includes('cuadro')) ||
        title.includes('decorat') || title.includes('adorno');
    }
  },
  {
    id: 'hogar_organizacion',
    label: 'Hogar y Organización',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('organiza') || cat.includes('hogar') || cat.includes('cocina') || cat.includes('bano') ||
        tags.some(t => t.includes('organiza') || t.includes('hogar') || t.includes('cocina') || t.includes('soporte') || t.includes('estante') || t.includes('orden')) ||
        title.includes('organiz') || title.includes('soporte') || title.includes('dispensador');
    }
  },
  {
    id: 'juguetes_figuras',
    label: 'Juguetes y Figuras',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('juguete') || cat.includes('juego') || cat.includes('figura') || cat.includes('coleccion') || cat.includes('fidget') ||
        tags.some(t => t.includes('juguete') || t.includes('fidget') || t.includes('figura') || t.includes('coleccion') || t.includes('pokemon') || t.includes('articulado') || t.includes('antistres') || t.includes('antiestres')) ||
        title.includes('articulad') || title.includes('toy') || title.includes('fidget');
    }
  },
  {
    id: 'temporada',
    label: 'Temporada y Fiestas',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('navid') || cat.includes('halloween') || cat.includes('otono') || cat.includes('muerto') ||
        tags.some(t => t.includes('navid') || t.includes('halloween') || t.includes('otono') || t.includes('calavera') || t.includes('fantasma') || t.includes('bruja') || t.includes('pumpkin') || t.includes('calabaza')) ||
        title.includes('halloween') || title.includes('navidad') || title.includes('naviden');
    }
  },
  {
    id: 'accesorios',
    label: 'Accesorios y Estilo',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('accesorio') || cat.includes('llavero') || cat.includes('cosplay') || cat.includes('joyer') ||
        tags.some(t => t.includes('accesorio') || t.includes('llavero') || t.includes('llaveros') || t.includes('anillo') || t.includes('pulsera') || t.includes('cosplay')) ||
        title.includes('llavero') || title.includes('collar') || title.includes('pulsera');
    }
  },
  {
    id: 'tecnologia_gadgets',
    label: 'Tecnología y Gadgets',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('electr') || cat.includes('gadget') || cat.includes('smart') || cat.includes('tech') || cat.includes('tecnolog') || cat.includes('robot') ||
        tags.some(t => t.includes('smart') || t.includes('echo') || t.includes('gadget') || t.includes('tech') || t.includes('alexa') || t.includes('usb') || t.includes('cable') || t.includes('apple') || t.includes('magsafe')) ||
        title.includes('echo') || title.includes('alexa') || title.includes('gadget') || title.includes('soporte para echo');
    }
  },
  {
    id: 'herramientas',
    label: 'Herramientas y DIY',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('herramienta') || cat.includes('taller') || cat.includes('diy') || cat.includes('impresion 3d') ||
        tags.some(t => t.includes('herramienta') || t.includes('bricolaje') || t.includes('ferreteria') || t.includes('calibrador') || t.includes('medidor') || t.includes('taller')) ||
        title.includes('tool') || title.includes('herramienta') || title.includes('gauge') || title.includes('calibrador');
    }
  }
];

interface PricePreset {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PRICE_PRESETS: PricePreset[] = [
  { id: 'all', label: 'Cualquier precio', min: 0, max: 1000 },
  { id: 'under100', label: 'Hasta $100', min: 0, max: 100 },
  { id: '100to250', label: '$100 a $250', min: 100, max: 250 },
  { id: '250to500', label: '$250 a $500', min: 250, max: 500 },
  { id: 'over500', label: 'Más de $500', min: 500, max: 1000 }
];

const selectedCategory = ref('todos');
const selectedTag = ref<string | null>(null);
const selectedPricePreset = ref('all');
const priceRange = ref([0, 1000]);
const minPriceInput = ref<number | null>(null);
const maxPriceInput = ref<number | null>(null);
const tagSearchQuery = ref('');

function selectPricePreset(preset: PricePreset) {
  selectedPricePreset.value = preset.id;
  priceRange.value = [preset.min, preset.max];
  minPriceInput.value = preset.min === 0 ? null : preset.min;
  maxPriceInput.value = preset.max >= 1000 ? null : preset.max;
}

function applyCustomPrice() {
  selectedPricePreset.value = 'custom';
  const min = typeof minPriceInput.value === 'number' && minPriceInput.value >= 0 ? minPriceInput.value : 0;
  const max = typeof maxPriceInput.value === 'number' && maxPriceInput.value > 0 ? maxPriceInput.value : 1000;
  priceRange.value = [min, max];
}

function getPresetCount(preset: PricePreset): number {
  return products.value.filter(p => {
    const hasVariants = Array.isArray(p.variants) && p.variants.length > 1;
    const rawPrice = hasVariants ? p.priceFrom : (p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0))));
    const price = typeof rawPrice === 'number' ? rawPrice : 0;
    if (preset.id === 'all') return true;
    if (preset.id === 'under100') return price <= 100;
    if (preset.id === '100to250') return price > 100 && price <= 250;
    if (preset.id === '250to500') return price > 250 && price <= 500;
    if (preset.id === 'over500') return price > 500;
    return true;
  }).length;
}

const categoriesWithCounts = computed(() => {
  return CATEGORY_DEFS.map(catDef => {
    const count = products.value.filter(catDef.match).length;
    return {
      id: catDef.id,
      label: catDef.label,
      count
    };
  });
});

const currentCategoryLabel = computed(() => {
  const found = CATEGORY_DEFS.find(c => c.id === selectedCategory.value);
  return found ? found.label : 'Todos';
});

interface TagItem {
  norm: string;
  display: string;
  count: number;
}

const popularTags = computed<TagItem[]>(() => {
  const map = new Map<string, { norm: string; display: string; count: number }>();
  for (const p of products.value) {
    if (!p.tags || !Array.isArray(p.tags)) continue;
    const seen = new Set<string>();
    for (const raw of p.tags) {
      if (!raw || typeof raw !== 'string') continue;
      const clean = raw.trim();
      const norm = normalizeText(clean);
      if (!norm || norm.length < 3 || seen.has(norm)) continue;
      seen.add(norm);
      if (!map.has(norm)) {
        map.set(norm, { norm, display: clean, count: 0 });
      }
      const item = map.get(norm)!;
      item.count++;
      if (clean[0] === clean[0].toUpperCase() && item.display[0] !== item.display[0].toUpperCase()) {
        item.display = clean;
      }
    }
  }
  return Array.from(map.values())
    .filter(t => t.count >= 3)
    .sort((a, b) => b.count - a.count);
});

const filteredTags = computed(() => {
  if (!tagSearchQuery.value.trim()) return popularTags.value;
  const q = normalizeText(tagSearchQuery.value.trim());
  return popularTags.value.filter(t => t.norm.includes(q) || normalizeText(t.display).includes(q));
});

function toggleTag(tag: string) {
  const norm = normalizeText(tag);
  if (selectedTag.value && normalizeText(selectedTag.value) === norm) {
    selectedTag.value = null;
  } else {
    selectedTag.value = tag;
  }
}

function isTagActive(tag: string | null | undefined): boolean {
  if (!tag || !selectedTag.value) return false;
  return normalizeText(tag) === normalizeText(selectedTag.value);
}

function handleSelectTagFromDetail(tag: string) {
  selected.value = null;
  toggleTag(tag);
}

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'todos' ||
    selectedTag.value !== null ||
    priceRange.value[0] > 0 ||
    priceRange.value[1] < 1000 ||
    query.value.trim().length > 0;
});

function resetFilters() {
  selectedCategory.value = 'todos';
  selectedTag.value = null;
  selectedPricePreset.value = 'all';
  priceRange.value = [0, 1000];
  minPriceInput.value = null;
  maxPriceInput.value = null;
  tagSearchQuery.value = '';
  query.value = '';
}

const filteredProducts = computed(() => {
  const currentCatDef = CATEGORY_DEFS.find(c => c.id === selectedCategory.value) || CATEGORY_DEFS[0];
  const targetTagNorm = selectedTag.value ? normalizeText(selectedTag.value) : null;

  return products.value.filter(p => {
    // 1. Categoría
    if (selectedCategory.value !== 'todos' && !currentCatDef.match(p)) {
      return false;
    }

    // 2. Tag
    if (targetTagNorm) {
      const pTags = (p.tags || []).map(normalizeText);
      if (!pTags.includes(targetTagNorm)) {
        return false;
      }
    }

    // 3. Precio
    const hasVariants = Array.isArray(p.variants) && p.variants.length > 1;
    const rawPrice = hasVariants ? p.priceFrom : (p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0))));
    const price = typeof rawPrice === 'number' ? rawPrice : 0;

    const maxLimit = priceRange.value[1] >= 1000 ? Infinity : priceRange.value[1];
    if (price < priceRange.value[0] || price > maxLimit) {
      return false;
    }

    return true;
  });
});

async function triggerDeepSearch() {
  if (!query.value.trim()) return;
  loadingDeep.value = true;
  isDeepSearching.value = true;
  error.value = null;
  deepSearchStatusIndex.value = 0;
  clearInterval(deepSearchStatusInterval);
  deepSearchStatusInterval = setInterval(() => {
    deepSearchStatusIndex.value = (deepSearchStatusIndex.value + 1) % deepSearchPhrases.length;
  }, 4500);
  try {
    const url = `${apiBase}/products?q=${encodeURIComponent(query.value.trim())}&deep=true`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data)) {
      products.value = data.items || [];
      searchedLive.value = !!data.searchedLive;
      rateLimited.value = !!data.rateLimited;
    }
    toast.success('Búsqueda profunda iniciada', { description: 'Llegaron los primeros resultados. El resto seguirá cargando en el fondo en los próximos minutos.' });
    
    // Auto refresh local db without deep trigger every 15s for 1 min
    let ticks = 0;
    const interval = setInterval(async () => {
      ticks++;
      if (ticks > 20) {
        clearInterval(interval);
        isDeepSearching.value = false;
        clearInterval(deepSearchStatusInterval);
        return;
      }
      try {
        const refreshUrl = `${apiBase}/products?q=${encodeURIComponent(query.value.trim())}`;
        const refreshR = await fetch(refreshUrl);
        if (refreshR.ok) {
           const refreshData = await refreshR.json();
           if (!Array.isArray(refreshData) && refreshData.items) {
             products.value = refreshData.items;
           }
        }
      } catch (e) {}
    }, 3000);

  } catch (e: any) {
    toast.error('Error', { description: 'El servidor tardó demasiado o no respondió.' });
  } finally {
    loadingDeep.value = false;
  }
}

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

const seoTitle = computed(() => selected.value ? `${selected.value.title} — El Bazar` : 'El Bazar — Productos en impresión 3D y accesorios');
const seoDesc = computed(() => selected.value ? (selected.value.description || 'Producto en el bazar') : 'Galería de creaciones físicas: piezas en impresión 3D, accesorios de estilo de vida y electrónica diseñada con detalle.');
const seoImage = computed(() => selected.value?.imageUrl ? imgProxy(selected.value.imageUrl, { width: 1200 }) : 'https://shongyi.com/logo.png');

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
  ogImage: seoImage,
  ogType: 'website',
  ogUrl: computed(() => selected.value ? `https://shongyi.com/bazar?p=${selected.value.id}` : 'https://shongyi.com/bazar'),
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

const route = useRoute();
const router = useRouter();

watch(selected, (newVal) => {
  if (newVal) {
    router.replace({ query: { ...route.query, p: newVal.id } });
  } else {
    const newQuery = { ...route.query };
    delete newQuery.p;
    router.replace({ query: newQuery });
  }
});

onMounted(async () => {
  await load('');
  if (route.query.cat && typeof route.query.cat === 'string') {
    const targetCat = route.query.cat.toLowerCase();
    const found = CATEGORY_DEFS.find(c => c.id === targetCat || normalizeText(c.label) === targetCat);
    if (found) selectedCategory.value = found.id;
  }
  if (route.query.tag && typeof route.query.tag === 'string') {
    selectedTag.value = route.query.tag;
  }
  if (route.query.p) {
    const id = Number(route.query.p);
    const found = products.value.find(p => p.id === id);
    if (found) {
      selected.value = found;
    } else {
      try {
        const res = await fetch(`${apiBase}/products/${id}`);
        if (res.ok) {
          const prodData = await res.json();
          if (prodData) {
            selected.value = prodData;
          }
        }
      } catch (e) {}
    }
  }
});
</script>

