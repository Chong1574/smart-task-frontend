<template>
  <div
    class="fixed inset-0 z-50 bg-background/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    @click.self="$emit('close')"
  >
    <div class="container max-w-5xl mx-auto py-6 md:py-10 px-4 relative">
      <div class="bg-card border border-border/70 rounded-3xl shadow-2xl overflow-hidden">
        <!-- Barra superior fija dentro del modal -->
        <div class="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-card/90 backdrop-blur-md border-b border-border/60">
          <button
            type="button"
            class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver al catálogo
          </button>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Disponible para fabricar
            </span>
            <button
              type="button"
              class="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Cerrar"
              @click="$emit('close')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="p-6 md:p-8 grid md:grid-cols-12 gap-8">
          <!-- Columna Izquierda: Galería + Garantías rápidas -->
          <div class="md:col-span-6 space-y-4">
            <div class="aspect-square bg-secondary/40 rounded-2xl overflow-hidden relative group border border-border/50">
              <img
                v-if="currentImage"
                :src="imgProxy(currentImage, { width: 900 })"
                :alt="product.title"
                decoding="async"
                width="900"
                height="900"
                class="w-full h-full object-cover transition-all duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground/40 font-serif italic">
                [ Imagen del Producto ]
              </div>

              <!-- Badges sobre la imagen -->
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span v-if="product.category" class="bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border/60 shadow-sm">
                  {{ product.category }}
                </span>
                <span class="bg-foreground/85 text-background backdrop-blur-md text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm inline-flex items-center gap-1">
                  📦 Pieza Física 3D
                </span>
              </div>

              <!-- Controles de navegación de galería -->
              <template v-if="images.length > 1">
                <button
                  type="button"
                  @click="prevImage"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center transition-all opacity-90 hover:scale-105 cursor-pointer"
                  aria-label="Imagen anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button
                  type="button"
                  @click="nextImage"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center transition-all opacity-90 hover:scale-105 cursor-pointer"
                  aria-label="Siguiente imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <div class="absolute bottom-3 right-3 bg-background/85 backdrop-blur-md text-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border/60 shadow-sm">
                  📷 {{ imgIdx + 1 }} / {{ images.length }}
                </div>
              </template>
            </div>

            <!-- Miniaturas -->
            <div v-if="images.length > 1" class="grid grid-cols-5 sm:grid-cols-6 gap-2">
              <button
                v-for="(img, i) in images"
                :key="i"
                type="button"
                @click="imgIdx = i"
                class="aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer"
                :class="imgIdx === i ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-border/40 opacity-70 hover:opacity-100'"
              >
                <img :src="imgProxy(img, { width: 160 })" loading="lazy" decoding="async" class="w-full h-full object-cover" />
              </button>
            </div>

            <!-- Tarjeta de Respaldo y Garantías (Resuelve dudas de compra) -->
            <div class="bg-secondary/30 border border-border/60 rounded-2xl p-4 space-y-3 text-xs">
              <h4 class="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                Compra segura — ¿Qué incluye tu pedido?
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-muted-foreground">
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">📦</span>
                  <div>
                    <p class="font-semibold text-foreground">Pieza Física Lista</p>
                    <p class="text-[11px] leading-snug">No es solo un archivo: recibes el producto físico impreso en 3D y revisado a mano.</p>
                  </div>
                </div>
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">🎨</span>
                  <div>
                    <p class="font-semibold text-foreground">Color a tu Elección</p>
                    <p class="text-[11px] leading-snug">Se fabrica en el tono de la foto o puedes pedirnos otro color sin costo extra.</p>
                  </div>
                </div>
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">🛡️</span>
                  <div>
                    <p class="font-semibold text-foreground">Material de Ingeniería</p>
                    <p class="text-[11px] leading-snug">Impreso en PLA+ / PETG sólido de alta densidad, durable y con acabado limpio.</p>
                  </div>
                </div>
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">🚚</span>
                  <div>
                    <p class="font-semibold text-foreground">Garantía de Envío</p>
                    <p class="text-[11px] leading-snug">Envío con rastreo a todo México. Si llega dañado por paquetería, lo reponemos gratis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Info, Variantes, CTA y Especificaciones -->
          <div class="md:col-span-6 flex flex-col">
            <div class="mb-4">
              <h1 class="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight mb-2">
                {{ product.title }}
              </h1>
              <p v-if="product.description" class="text-sm text-muted-foreground leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Bloque de Precio y Especificación Rápida de la Variante Activa -->
            <div class="bg-secondary/35 border border-border/60 rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span class="block text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {{ activeVariant ? `Precio — ${activeVariant.name}` : 'Precio final' }}
                </span>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-3xl font-extrabold text-primary tracking-tight">{{ priceLabel }}</span>
                  <span v-if="currentPrice > 0" class="text-xs font-semibold text-muted-foreground">MXN · IVA incluido</span>
                </div>
              </div>

              <div v-if="activeVariant" class="flex items-center gap-3 text-xs">
                <div v-if="activeVariant.grams" class="bg-card px-3 py-1.5 rounded-xl border border-border/60 text-center">
                  <span class="block text-[10px] text-muted-foreground">Peso sólido</span>
                  <span class="font-bold text-foreground">⚖️ {{ activeVariant.grams }}g</span>
                </div>
                <div v-if="activeVariant.hours" class="bg-card px-3 py-1.5 rounded-xl border border-border/60 text-center">
                  <span class="block text-[10px] text-muted-foreground">Manufactura</span>
                  <span class="font-bold text-foreground">⏱️ {{ formatHours(activeVariant.hours) }}</span>
                </div>
              </div>
            </div>

            <!-- Selector de Variantes (con especificaciones claras para resolver dudas) -->
            <div v-if="variants.length > 1" class="mb-5">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Elige la versión o tamaño ({{ variants.length }} disponibles):
                </p>
              </div>
              <div class="space-y-2">
                <label
                  v-for="(v, i) in variants"
                  :key="i"
                  class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all"
                  :class="variantIdx === i ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30' : 'border-border/70 bg-card hover:border-primary/50'"
                >
                  <div class="flex items-center gap-3 min-w-0 pr-2">
                    <input type="radio" :value="i" v-model="variantIdx" class="accent-primary shrink-0" />
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-foreground truncate">{{ v.name }}</p>
                      <p class="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span v-if="v.grams">⚖️ {{ v.grams }}g de material</span>
                        <span v-if="v.grams && v.hours">·</span>
                        <span v-if="v.hours">🖨️ {{ formatHours(v.hours) }} de impresión</span>
                      </p>
                    </div>
                  </div>
                  <span class="font-bold text-sm text-foreground shrink-0">{{ fmt(v.price) }}</span>
                </label>
              </div>
            </div>
            <div v-else-if="variants.length === 1" class="mb-5">
              <div class="p-3 rounded-xl border border-border/70 bg-secondary/20 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong class="text-foreground">Versión incluida:</strong> {{ variants[0].name }}</span>
                </div>
                <span v-if="variants[0].grams" class="text-muted-foreground font-medium">{{ variants[0].grams }}g · {{ formatHours(variants[0].hours) }}</span>
              </div>
            </div>

            <!-- Campo de Personalización o Nota de Color -->
            <div v-if="isPersonalized" class="mb-5 animate-in fade-in slide-in-from-top-2">
              <label class="block text-sm font-semibold mb-1.5 text-foreground">
                Texto o detalle para personalizar <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="customText"
                placeholder="Ej. Nombre, color preferido, URL para código QR..."
                class="w-full h-11 px-4 rounded-xl border border-primary/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p class="text-[11px] text-muted-foreground mt-1">Fabricaremos tu pieza exactamente con esta indicación.</p>
            </div>
            <div v-else class="mb-5">
              <label class="block text-xs font-medium text-muted-foreground mb-1.5">
                ¿Prefieres algún color en especial? <span class="text-[11px] opacity-75">(Opcional)</span>
              </label>
              <input
                type="text"
                v-model="customText"
                placeholder="Ej. Color como en la foto, Negro mate, Blanco, Rojo..."
                class="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <!-- Cantidad + Botones de Conversión -->
            <div class="flex flex-col gap-3 mb-6">
              <div class="flex items-center gap-3">
                <!-- Selector de Cantidad -->
                <div class="flex items-center border border-border rounded-xl bg-secondary/30 h-12 px-1 shrink-0">
                  <button
                    type="button"
                    class="w-9 h-10 text-muted-foreground hover:text-foreground disabled:opacity-40 font-bold text-base cursor-pointer"
                    @click="quantity > 1 ? quantity-- : null"
                    :disabled="quantity <= 1"
                  >
                    −
                  </button>
                  <span class="px-2 text-sm font-bold w-8 text-center">{{ quantity }}</span>
                  <button
                    type="button"
                    class="w-9 h-10 text-muted-foreground hover:text-foreground font-bold text-base cursor-pointer"
                    @click="quantity++"
                  >
                    +
                  </button>
                </div>

                <!-- Comprar Ahora -->
                <button
                  type="button"
                  @click="buyNow"
                  class="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm px-6 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex justify-center items-center gap-2 cursor-pointer"
                >
                  <span>Comprar ahora</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  @click="addToCartOnly"
                  class="h-11 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs px-4 rounded-xl transition-all flex justify-center items-center gap-2 border border-border cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Agregar al carrito
                </button>

                <!-- Botón para resolver dudas por WhatsApp -->
                <a
                  :href="whatsappInquiryUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="h-11 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs px-4 rounded-xl transition-all flex justify-center items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  ¿Dudas de medidas o color?
                </a>
              </div>
            </div>

            <!-- Detalles adicionales del modelo (si existen en descriptionHtml) -->
            <div v-if="extraDetailsSafe" class="mb-5 p-4 rounded-2xl bg-secondary/20 border border-border/50">
              <h4 class="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                Detalles adicionales del diseño
              </h4>
              <p class="text-xs text-muted-foreground whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto pr-1">
                {{ extraDetailsSafe }}
              </p>
            </div>

            <!-- Etiquetas -->
            <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-1.5 mb-5">
              <button
                v-for="tag in product.tags"
                :key="tag"
                type="button"
                @click="$emit('select-tag', tag)"
                class="px-2.5 py-1 bg-secondary/40 hover:bg-primary hover:text-primary-foreground text-foreground/80 text-xs rounded-full border border-border/60 transition-all cursor-pointer flex items-center gap-1"
                title="Filtrar catálogo por esta etiqueta"
              >
                #{{ formatTag(tag) }}
              </button>
            </div>

            <!-- Atribución legal -->
            <div class="mt-auto pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
              <span v-if="product.licenseAttribution">Diseño: {{ product.licenseAttribution }}</span>
              <a
                v-if="product.sourceUrl || product.externalId"
                :href="product.externalId && product.source === 'MAKERWORLD' ? `https://makerworld.com/es/models/${product.externalId}` : (product.sourceUrl || `https://makerworld.com/es/models/${product.externalId}`)"
                target="_blank"
                rel="noopener"
                class="text-primary hover:underline inline-block"
              >
                Referencia del modelo 3D →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { imgProxy } from '~/utils/imgProxy';
import { useCartStore } from '~/stores/cart';
import { toast } from 'vue-sonner';
import { trackEvent } from '~/utils/analytics';

interface Variant { name: string; grams: number; hours: number; price: number; imageIndex?: number; imageUrl?: string }
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
  source?: string | null;
  sourceUrl?: string | null;
  externalId?: string | null;
  licenseAttribution?: string | null;
  category?: string | null;
}

const props = defineProps<{
  product: Product;
  initialVariantIdx?: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select-tag', tag: string): void;
}>();

const images = computed(() => {
  const set = new Set<string>();
  if (props.product.imageUrl) set.add(props.product.imageUrl);
  if (Array.isArray(props.product.images)) {
    for (const img of props.product.images) {
      if (img) set.add(img);
    }
  }
  if (Array.isArray(props.product.variants)) {
    for (const v of props.product.variants) {
      if (v?.imageUrl) set.add(v.imageUrl);
    }
  }
  return Array.from(set);
});

const imgIdx = ref(0);
const currentImage = computed(() => images.value[imgIdx.value] || '');

function prevImage() {
  if (images.value.length <= 1) return;
  imgIdx.value = (imgIdx.value - 1 + images.value.length) % images.value.length;
}

function nextImage() {
  if (images.value.length <= 1) return;
  imgIdx.value = (imgIdx.value + 1) % images.value.length;
}

const variants = computed(() => Array.isArray(props.product.variants) ? props.product.variants : []);
const variantIdx = ref(props.initialVariantIdx ?? 0);
const activeVariant = computed(() => variants.value[variantIdx.value] || null);

function syncVariantImage(idx: number) {
  const v = variants.value[idx];
  if (!v) return;
  if (v.imageIndex !== undefined && v.imageIndex >= 0 && v.imageIndex < images.value.length) {
    imgIdx.value = v.imageIndex;
  } else if (v.imageUrl) {
    const existingIdx = images.value.findIndex(img => img === v.imageUrl);
    if (existingIdx !== -1) {
      imgIdx.value = existingIdx;
    }
  }
}

watch(variantIdx, (newIdx) => {
  syncVariantImage(newIdx);
});

const isPersonalized = computed(() => {
  if (/personaliz|custom|nombre|qr/i.test(props.product.title || '')) return true;
  if (!variants.value.length) return false;
  const v = variants.value[variantIdx.value];
  return Boolean(v && v.name && /personalizada|personalizado|custom|nombre/i.test(v.name));
});
const customText = ref('');

const currentPrice = computed(() => {
  if (variants.value.length) return variants.value[variantIdx.value]?.price ?? 0;
  return props.product.priceFrom ?? (typeof props.product.price === 'number' ? props.product.price : parseFloat(String(props.product.price ?? 0)));
});

const priceLabel = computed(() => {
  const n = currentPrice.value ?? 0;
  if (!n) return 'Gratis';
  return fmt(n);
});

function fmt(n: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function formatHours(h?: number): string {
  if (!h) return 'Estándar';
  if (h < 1) return `${Math.max(15, Math.round(h * 60))} min`;
  return `~${h < 3 ? h.toFixed(1) : Math.round(h)} h`;
}

const extraDetailsSafe = computed(() => {
  let raw = props.product.descriptionHtml || '';
  if (!raw) return '';

  // Decodificar entidades HTML primero por si vienen escapadas (&lt;boostme&gt;)
  raw = raw
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  // Eliminar bloques <boostme>...</boostme> de MakerWorld
  raw = raw.replace(/<boostme[\s\S]*?<\/boostme>/gi, '');

  // Convertir tags de bloque a saltos de línea
  raw = raw.replace(/<br\s*\/?>/gi, '\n');
  raw = raw.replace(/<\/p>/gi, '\n\n');
  raw = raw.replace(/<\/h[1-6]>/gi, '\n');
  raw = raw.replace(/<\/li>/gi, '\n');
  raw = raw.replace(/<li>/gi, '• ');

  // Limpiar resto de HTML
  raw = raw.replace(/<[^>]+>/g, '');
  raw = raw.replace(/\n{3,}/g, '\n\n').trim();

  // Si es idéntico a description, no duplicar
  if (raw === (props.product.description || '').trim()) return '';
  return raw;
});

function formatTag(raw: string | null | undefined): string {
  if (!raw) return '';
  let clean = raw.trim().replace(/^#+/, '');
  clean = clean.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  clean = clean.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
  return clean;
}

const whatsappInquiryUrl = computed(() => {
  const vName = activeVariant.value ? ` (${activeVariant.value.name})` : '';
  const msg = `Hola, vi el modelo "${props.product.title}"${vName} en El Bazar (${priceLabel.value}) y me gustaría resolver una duda sobre medidas/colores.`;
  return `https://wa.me/524421752026?text=${encodeURIComponent(msg)}`;
});

onMounted(() => {
  if (props.initialVariantIdx !== undefined && props.initialVariantIdx >= 0) {
    variantIdx.value = props.initialVariantIdx;
    syncVariantImage(props.initialVariantIdx);
  }
  const itemPrice = currentPrice.value || (typeof props.product.price === 'number' ? props.product.price : (props.product.priceFrom || 0));
  trackEvent(
    'view_item',
    {
      currency: 'MXN',
      value: itemPrice,
      items: [
        {
          item_id: props.product.id,
          item_name: props.product.title,
          price: itemPrice
        }
      ]
    },
    { viewed_product: props.product.title }
  );
});

const cart = useCartStore();
const quantity = ref(1);

function buyNow() {
  if (isPersonalized.value && !customText.value.trim()) {
    toast.error('Atención', { description: 'Por favor, ingresa el texto a personalizar.' });
    return;
  }
  cart.addItem(props.product, variantIdx.value, quantity.value, customText.value.trim());
  cart.openCart();
  emit('close');
}

function addToCartOnly() {
  if (isPersonalized.value && !customText.value.trim()) {
    toast.error('Atención', { description: 'Por favor, ingresa el texto a personalizar.' });
    return;
  }
  cart.addItem(props.product, variantIdx.value, quantity.value, customText.value.trim());
  toast.success('Agregado al carrito', {
    description: `${quantity.value}x ${props.product.title}`,
    duration: 3000
  });
}
</script>
