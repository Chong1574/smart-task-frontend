<template>
  <div
    class="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="container max-w-4xl mx-auto py-8 px-4">
      <button
        type="button"
        class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        @click="$emit('close')"
      >
        ← Volver
      </button>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Galería -->
        <div>
          <div class="aspect-square bg-secondary/50 rounded-2xl overflow-hidden mb-3">
            <img
              v-if="currentImage"
              :src="currentImage"
              :alt="product.title"
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
              <img :src="img" class="w-full h-full object-cover" />
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
                    <p class="text-xs text-muted-foreground">
                      {{ v.grams }} g · {{ v.hours }} h
                    </p>
                  </div>
                </div>
                <span class="font-medium">{{ fmt(v.price) }}</span>
              </label>
            </div>
          </div>

          <p v-if="descriptionSafe" class="text-sm text-muted-foreground mb-6 whitespace-pre-line">{{ descriptionSafe }}</p>

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
interface Variant { name: string; grams: number; hours: number; price: number }
interface Product {
  title: string;
  description?: string | null;
  descriptionHtml?: string | null;
  imageUrl?: string | null;
  price?: number | string | null;
  priceFrom?: number | null;
  variants?: Variant[] | null;
  images?: string[] | null;
  sourceUrl?: string | null;
  licenseAttribution?: string | null;
}

const props = defineProps<{ product: Product }>();
defineEmits<{ (e: 'close'): void }>();

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
  const raw = props.product.descriptionHtml || props.product.description || '';
  return raw.replace(/<[^>]+>/g, '').trim();
});
</script>
