<template>
  <div
    class="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
   
  >
    <div class="container max-w-4xl mx-auto py-8 px-4 relative">
      <div class="sticky top-4 z-10 mb-6 bg-background/80 backdrop-blur-md p-2 -mx-2 rounded-lg inline-block">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium"
          @click="$emit('close')"
        >
          ← Volver
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Galería -->
        <div>
          <div class="aspect-square bg-secondary/50 rounded-2xl overflow-hidden mb-3">
            <img
              v-if="currentImage"
              :src="imgProxy(currentImage, { width: 900 })"
              :alt="product.title"
              decoding="async"
              width="900"
              height="900"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-if="images.length > 1" class="grid grid-cols-4 gap-2">
            <button
              v-for="(img, i) in images"
              :key="i"
              type="button"
              @click="imgIdx = i"
              class="aspect-square rounded-lg overflow-hidden border-2 transition-colors"
              :class="imgIdx === i ? 'border-primary' : 'border-transparent'"
            >
              <img :src="imgProxy(img, { width: 160 })" loading="lazy" decoding="async" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div>
          <h1 class="text-3xl font-serif font-bold mb-3">{{ product.title }}</h1>
          <p class="text-3xl font-bold text-primary mb-4">{{ priceLabel }}</p>

          <div v-if="variants.length > 1" class="mb-6">
            <p class="text-sm font-medium mb-2">Variantes disponibles:</p>
            <div class="space-y-2">
              <label
                v-for="(v, i) in variants"
                :key="i"
                class="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:border-primary transition-colors"
                :class="variantIdx === i ? 'border-primary bg-primary/5' : ''"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" :value="i" v-model="variantIdx" class="accent-primary" />
                  <div>
                    <p class="text-sm font-medium">{{ v.name }}</p>
                    
                  </div>
                </div>
                <span class="font-medium">{{ fmt(v.price) }}</span>
              </label>
            </div>
          </div>
          
          <button
            @click="addToCart"
            class="w-full md:w-auto mb-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex justify-center items-center gap-2"
          >
            Agregar al carrito
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>

          <p v-if="descriptionSafe" class="text-sm text-muted-foreground mb-6 whitespace-pre-line">{{ descriptionSafe }}</p>
          <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-2 mb-6">
            <span v-for="tag in product.tags" :key="tag" class="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
              {{ tag }}
            </span>
          </div>


          <div class="text-xs text-muted-foreground space-y-1">
            <p v-if="product.licenseAttribution">Atribución: {{ product.licenseAttribution }}</p>
            <a v-if="product.sourceUrl" :href="product.sourceUrl" target="_blank" rel="noopener" class="text-primary hover:underline inline-block">
              Ver original en MakerWorld →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { imgProxy } from '~/utils/imgProxy';
interface Variant { name: string; grams: number; hours: number; price: number }
interface Product {
  id?: number | string;
  title: string;
  description?: string | null;
  descriptionHtml?: string | null;
  imageUrl?: string | null;
  price?: number | string | null;
  priceFrom?: number | null;
  variants?: Variant[] | null;
  tags?: string[] | null;
  images?: string[] | null;
  sourceUrl?: string | null;
  licenseAttribution?: string | null;
}

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const images = computed(() => {
  const arr = Array.isArray(props.product.images) ? props.product.images : [];
  if (arr.length) return arr;
  return props.product.imageUrl ? [props.product.imageUrl] : [];
});
const imgIdx = ref(0);
const currentImage = computed(() => images.value[imgIdx.value] || '');

const variants = computed(() => Array.isArray(props.product.variants) ? props.product.variants : []);
const variantIdx = ref(0);
const currentPrice = computed(() => {
  if (variants.value.length) return variants.value[variantIdx.value]?.price ?? 0;
  return props.product.priceFrom ?? (typeof props.product.price === 'number' ? props.product.price : 0);
});
const priceLabel = computed(() => {
  const n = currentPrice.value ?? 0;
  if (!n) return 'Gratis';
  return fmt(n);
});

function fmt(n: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

// ponytail: strip HTML sin lib externa. Origen del texto es MakerWorld (controlado) — si algún día se acepta
// user-input HTML, cambiar a DOMPurify aquí.
const descriptionSafe = computed(() => {
  const raw = props.product.description || props.product.descriptionHtml || '';
  return raw.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').trim();
});

import { useCartStore } from '~/stores/cart';
const cart = useCartStore();

function addToCart() {
  cart.addItem(props.product, variantIdx.value);
  emit('close'); // Opcional: cerrar el modal al agregar
}
</script>
