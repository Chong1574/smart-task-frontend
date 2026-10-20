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

          <button
            type="button"
            class="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Cerrar"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-6 md:p-8 grid md:grid-cols-12 gap-8">
          <!-- Columna Izquierda: Galería + ¿Qué incluye tu pedido? -->
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

              <!-- Único badge limpio sobre la imagen -->
              <div v-if="product.category" class="absolute top-3 left-3">
                <span class="bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border/60 shadow-sm">
                  {{ product.category }}
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
                  {{ imgIdx + 1 }} / {{ images.length }}
                </div>
              </template>
            </div>

            <!-- Miniaturas -->
            <div v-if="images.length > 1" class="grid grid-cols-5 sm:grid-cols-6 gap-2">
              <button
                v-for="(img, i) in images"
                :key="i"
                type="button"
                @click="selectImage(i)"
                class="aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer"
                :class="imgIdx === i ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-border/40 opacity-70 hover:opacity-100'"
              >
                <img :src="imgProxy(img, { width: 160 })" loading="lazy" decoding="async" class="w-full h-full object-cover" />
              </button>
            </div>

            <!-- ¿Qué incluye tu pedido? (Con filamento dinámico según el modelo/impresión) -->
            <div class="bg-secondary/25 border border-border/60 rounded-2xl p-4 space-y-3 text-xs">
              <h4 class="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                ¿Qué incluye tu pedido?
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-muted-foreground">
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">✨</span>
                  <div>
                    <p class="font-semibold text-foreground">Acabado Limpio y Detallado</p>
                    <p class="text-[11px] leading-snug">Pieza revisada, libre de soportes y lista para usar desde que abres tu caja.</p>
                  </div>
                </div>
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">🛡️</span>
                  <div>
                    <p class="font-semibold text-foreground">{{ recommendedFilamentInfo.title }}</p>
                    <p class="text-[11px] leading-snug">{{ recommendedFilamentInfo.description }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">🎨</span>
                  <div>
                    <p class="font-semibold text-foreground">Color a tu Elección</p>
                    <p class="text-[11px] leading-snug">En los tonos originales del modelo o en cualquiera de nuestros colores Sunlu / Bambu PLA.</p>
                  </div>
                </div>
                <div class="flex items-start gap-2 bg-card/70 p-2.5 rounded-xl border border-border/40">
                  <span class="text-base leading-none mt-0.5">🚚</span>
                  <div>
                    <p class="font-semibold text-foreground">Envío Protegido a todo MX</p>
                    <p class="text-[11px] leading-snug">Empaque seguro con garantía de reposición sin costo ante cualquier daño.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Flujo de Compra de Baja Fricción -->
          <div class="md:col-span-6 flex flex-col">
            <!-- 1. Título y Descripción -->
            <div class="mb-5">
              <h1 class="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight mb-2">
                {{ product.title }}
              </h1>
              <p v-if="product.description" class="text-sm text-muted-foreground leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- 2. Bloque Principal de Conversión: Precio y Botón de Compra JUNTOS (Cero fricción visual) -->
            <div class="bg-secondary/35 border border-primary/25 rounded-2xl p-4 mb-5 space-y-3 shadow-xs">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span class="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {{ activeVariant && variants.length > 1 ? `Precio · ${activeVariant.name}` : 'Precio final · IVA incluido' }}
                  </span>
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{{ priceLabel }}</span>
                    <span v-if="currentPrice > 0" class="text-xs font-semibold text-muted-foreground">MXN</span>
                  </div>
                </div>

                <!-- Cantidad + Comprar Ahora inmediatamente al lado del precio -->
                <div class="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                  <div class="flex items-center border border-border rounded-xl bg-card h-11 px-1 shrink-0">
                    <button
                      type="button"
                      class="w-7 h-9 text-muted-foreground hover:text-foreground disabled:opacity-40 font-bold text-sm cursor-pointer"
                      @click="quantity > 1 ? quantity-- : null"
                      :disabled="quantity <= 1"
                    >
                      −
                    </button>
                    <span class="px-1.5 text-sm font-bold w-6 text-center">{{ quantity }}</span>
                    <button
                      type="button"
                      class="w-7 h-9 text-muted-foreground hover:text-foreground font-bold text-sm cursor-pointer"
                      @click="quantity++"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    @click="buyNow"
                    class="flex-1 sm:flex-initial h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm px-5 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 flex justify-center items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Comprar ahora</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              <!-- Acciones secundarias integradas -->
              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                <button
                  type="button"
                  @click="addToCartOnly"
                  class="h-9 bg-card hover:bg-secondary text-foreground font-semibold text-xs px-3 rounded-xl transition-all flex justify-center items-center gap-1.5 border border-border/80 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Agregar al carrito
                </button>

                <a
                  :href="whatsappInquiryUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="h-9 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs px-3 rounded-xl transition-all flex justify-center items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  Resolver duda por WhatsApp
                </a>
              </div>
            </div>

            <!-- 3. Selector de Variantes (Solo gramos como referencia de proporción cuando hay >1 variante) -->
            <div v-if="variants.length > 1" class="mb-5">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Versión o tamaño ({{ variants.length }} opciones):
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  v-for="(v, i) in variants"
                  :key="i"
                  class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all"
                  :class="variantIdx === i ? 'border-primary bg-primary/10 shadow-2xs ring-1 ring-primary/30' : 'border-border/70 bg-card hover:border-primary/40'"
                >
                  <div class="flex items-center gap-2.5 min-w-0 pr-2">
                    <input type="radio" :value="i" v-model="variantIdx" class="accent-primary shrink-0" />
                    <img v-if="v.imageUrl" :src="imgProxy(v.imageUrl, { width: 64 })" loading="lazy" class="w-7 h-7 rounded-lg object-cover shrink-0 border border-border/60" />
                    <div class="min-w-0">
                      <p class="text-xs font-semibold text-foreground truncate">{{ v.name }}</p>
                      <p v-if="v.grams" class="text-[11px] text-muted-foreground">
                        Ref. ~{{ v.grams }}g
                      </p>
                    </div>
                  </div>
                  <span class="font-bold text-xs text-foreground shrink-0">{{ fmt(v.price) }}</span>
                </label>
              </div>
            </div>

            <!-- 4. Selector de Color Mejorado (Paleta Sunlu PLA & Bambu PLA Lite) -->
            <div class="mb-5 bg-card/60 border border-border/70 rounded-2xl p-3.5 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-foreground">Color del filamento:</span>
                <div class="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/70 border border-border/60">
                  <span
                    class="w-3 h-3 rounded-full border border-black/20 dark:border-white/20 shrink-0"
                    :style="{ background: currentColorSwatch }"
                  ></span>
                  <span class="text-foreground truncate max-w-[170px]">{{ selectedColorObj.label }}</span>
                </div>
              </div>

              <!-- Opción destacada: Tono original / Como en la foto -->
              <button
                type="button"
                @click="selectedColorId = 'original'"
                class="w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer"
                :class="selectedColorId === 'original'
                  ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30'
                  : 'border-border/60 bg-background/60 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-6 h-6 rounded-lg shadow-xs flex items-center justify-center shrink-0 border border-white/20" style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%);">
                    <span class="text-[11px]">✨</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-foreground truncate">Como en el modelo (Recomendado)</p>
                    <p class="text-[10px] text-muted-foreground truncate">Acabado y combinaciones fieles a la foto original</p>
                  </div>
                </div>
                <span v-if="selectedColorId === 'original'" class="text-primary font-bold text-xs shrink-0">✓ Activo</span>
              </button>

              <!-- Swatches de colores reales Sunlu / Bambu PLA -->
              <div>
                <div class="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span>O elige un color sólido (Paleta Sunlu / Bambu PLA):</span>
                  <span class="text-[10px] opacity-75">16 tonos</span>
                </div>
                <div class="grid grid-cols-8 gap-1.5 sm:gap-2">
                  <button
                    v-for="color in SUNLU_BAMBU_COLORS"
                    :key="color.id"
                    type="button"
                    @click="selectedColorId = color.id"
                    class="group relative aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                    :class="selectedColorId === color.id
                      ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-md z-10'
                      : 'hover:scale-105 hover:shadow-xs opacity-90 hover:opacity-100'"
                    :style="{ backgroundColor: color.hex }"
                    :title="`${color.label} — ${color.brand}`"
                    :aria-label="color.label"
                  >
                    <!-- Borde sutil para contraste -->
                    <div class="absolute inset-0 rounded-xl border border-black/15 dark:border-white/15 pointer-events-none"></div>

                    <!-- Checkmark cuando está seleccionado -->
                    <svg
                      v-if="selectedColorId === color.id"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      :style="{ color: color.textColor }"
                      class="drop-shadow-xs"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 5. Campo de Personalización (ÚNICAMENTE si el producto lleva nombre/QR personalizado) -->
            <div v-if="isPersonalized" class="mb-5 animate-in fade-in slide-in-from-top-2">
              <label class="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">
                Texto o enlace a personalizar <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="customText"
                placeholder="Ej. Nombre a grabar o enlace para código QR..."
                class="w-full h-10 px-3.5 rounded-xl border border-primary/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <!-- Etiquetas -->
            <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-1.5 mb-4">
              <button
                v-for="tag in product.tags.slice(0, 6)"
                :key="tag"
                type="button"
                @click="$emit('select-tag', tag)"
                class="px-2.5 py-1 bg-secondary/40 hover:bg-primary hover:text-primary-foreground text-foreground/80 text-[11px] rounded-full border border-border/60 transition-all cursor-pointer"
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

interface Variant {
  name: string;
  grams: number;
  hours: number;
  price: number;
  imageIndex?: number;
  imageUrl?: string;
  filament?: string;
}

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

interface FilamentColor {
  id: string;
  label: string;
  brand: string;
  hex: string;
  textColor: string;
}

const ORIGINAL_COLOR_OPTION = {
  id: 'original',
  label: 'Como en el modelo',
  brand: 'Referencia visual del modelo',
  swatch: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)',
};

const SUNLU_BAMBU_COLORS: FilamentColor[] = [
  // Neutros & Metálicos
  { id: 'white', label: 'Blanco Puro', brand: 'Bambu Jade / Sunlu White', hex: '#FFFFFF', textColor: '#18181B' },
  { id: 'black', label: 'Negro Mate', brand: 'Bambu Black / Sunlu Black', hex: '#18181B', textColor: '#FFFFFF' },
  { id: 'gray', label: 'Gris Ceniza', brand: 'Bambu Gray / Sunlu Grey', hex: '#71717A', textColor: '#FFFFFF' },
  { id: 'silver', label: 'Plata / Silver', brand: 'Sunlu Silk Silver', hex: '#9CA3AF', textColor: '#18181B' },
  { id: 'beige', label: 'Beige / Hueso', brand: 'Bambu Desert / Sunlu Bone', hex: '#E4D5B7', textColor: '#18181B' },
  { id: 'brown', label: 'Café / Marrón', brand: 'Bambu Brown / Sunlu Brown', hex: '#5C3A21', textColor: '#FFFFFF' },
  // Colores Vivos
  { id: 'red', label: 'Rojo Carmesí', brand: 'Bambu Red / Sunlu Red', hex: '#DC2626', textColor: '#FFFFFF' },
  { id: 'orange', label: 'Naranja', brand: 'Bambu Orange / Sunlu Orange', hex: '#EA580C', textColor: '#FFFFFF' },
  { id: 'yellow', label: 'Amarillo', brand: 'Bambu Yellow / Sunlu Yellow', hex: '#EAB308', textColor: '#18181B' },
  { id: 'bambu_green', label: 'Verde Bambú', brand: 'Bambu Green / Sunlu Grass', hex: '#16A34A', textColor: '#FFFFFF' },
  { id: 'forest_green', label: 'Verde Bosque', brand: 'Sunlu Dark Green', hex: '#14532D', textColor: '#FFFFFF' },
  { id: 'cyan', label: 'Azul Cielo / Cian', brand: 'Bambu Cyan / Sunlu Cyan', hex: '#06B6D4', textColor: '#FFFFFF' },
  { id: 'blue', label: 'Azul Rey', brand: 'Bambu Blue / Sunlu Royal', hex: '#2563EB', textColor: '#FFFFFF' },
  { id: 'navy', label: 'Azul Marino', brand: 'Sunlu Dark Blue', hex: '#1E3A8A', textColor: '#FFFFFF' },
  { id: 'purple', label: 'Púrpura / Morado', brand: 'Bambu Purple / Sunlu Purple', hex: '#7C3AED', textColor: '#FFFFFF' },
  { id: 'pink', label: 'Rosa Sakura', brand: 'Bambu Magenta / Sunlu Pink', hex: '#F472B6', textColor: '#18181B' },
];

const selectedColorId = ref<string>('original');

const selectedColorObj = computed(() => {
  if (selectedColorId.value === 'original') return ORIGINAL_COLOR_OPTION;
  return SUNLU_BAMBU_COLORS.find(c => c.id === selectedColorId.value) || ORIGINAL_COLOR_OPTION;
});

const currentColorSwatch = computed(() => {
  if (selectedColorId.value === 'original') return ORIGINAL_COLOR_OPTION.swatch;
  const found = SUNLU_BAMBU_COLORS.find(c => c.id === selectedColorId.value);
  return found ? found.hex : '#18181B';
});

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

// Detecta el filamento recomendado de la variante activa o de los metadatos del modelo
const recommendedFilamentInfo = computed(() => {
  const explicitFilament = activeVariant.value?.filament || '';
  const searchCorpus = `${explicitFilament} ${props.product.title || ''} ${props.product.description || ''} ${props.product.descriptionHtml || ''} ${(props.product.tags || []).join(' ')}`;

  if (/\bpetg\b/i.test(searchCorpus)) {
    return {
      code: 'PETG',
      title: 'Impreso en PETG Técnico',
      description: 'Polímero de alta resistencia mecánica, térmica y a la humedad para uso exigente.'
    };
  }
  if (/\btpu\b/i.test(searchCorpus)) {
    return {
      code: 'TPU',
      title: 'Impreso en TPU Flexible',
      description: 'Material elástico de alta absorción de impactos y gran durabilidad.'
    };
  }
  if (/\b(abs|asa)\b/i.test(searchCorpus)) {
    return {
      code: 'ABS/ASA',
      title: 'Impreso en ABS/ASA Estructural',
      description: 'Grado industrial con resistencia superior a temperatura e intemperie.'
    };
  }
  return {
    code: 'PLA+',
    title: 'Impreso en PLA+ de Alta Definición',
    description: 'Acabado rígido, superficie detallada y gran solidez estructural.'
  };
});

function syncVariantImage(idx: number) {
  const v = variants.value[idx];
  if (!v) return;
  if (v.imageIndex !== undefined && v.imageIndex >= 0 && v.imageIndex < images.value.length) {
    imgIdx.value = v.imageIndex;
    return;
  }
  if (v.imageUrl) {
    const cleanTarget = v.imageUrl.split('?')[0].toLowerCase();
    // 1. Direct match or clean URL match
    let existingIdx = images.value.findIndex(img => img === v.imageUrl || (img && img.split('?')[0].toLowerCase() === cleanTarget));
    
    // 2. Match by basename/filename if exists
    if (existingIdx === -1) {
      const targetName = cleanTarget.split('/').pop();
      if (targetName && targetName.length > 5) {
        existingIdx = images.value.findIndex(img => img && img.toLowerCase().includes(targetName));
      }
    }
    if (existingIdx !== -1) {
      imgIdx.value = existingIdx;
      return;
    }
  }
}

function selectImage(i: number) {
  imgIdx.value = i;
  const currentImg = images.value[i];
  if (currentImg && variants.value.length > 1) {
    const cleanCurrent = currentImg.split('?')[0].toLowerCase();
    const matchingVarIdx = variants.value.findIndex(v => {
      if (!v?.imageUrl) return false;
      const cleanV = v.imageUrl.split('?')[0].toLowerCase();
      if (cleanV === cleanCurrent) return true;
      const targetName = cleanV.split('/').pop();
      return Boolean(targetName && targetName.length > 5 && cleanCurrent.includes(targetName));
    });
    if (matchingVarIdx !== -1 && matchingVarIdx !== variantIdx.value) {
      variantIdx.value = matchingVarIdx;
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

function formatTag(raw: string | null | undefined): string {
  if (!raw) return '';
  let clean = raw.trim().replace(/^#+/, '');
  clean = clean.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  clean = clean.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
  return clean;
}

const whatsappInquiryUrl = computed(() => {
  const vName = activeVariant.value ? ` (${activeVariant.value.name})` : '';
  const colorNote = selectedColorId.value !== 'original' ? ` en color ${selectedColorObj.value.label}` : '';
  const msg = `Hola, vi el modelo "${props.product.title}"${vName}${colorNote} en El Bazar (${priceLabel.value}) y tengo una duda.`;
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

function resolveOrderNote(): string {
  const parts: string[] = [];
  if (selectedColorId.value !== 'original') {
    parts.push(`Color: ${selectedColorObj.value.label} (${selectedColorObj.value.brand})`);
  }
  if (customText.value.trim()) {
    parts.push(`Personalizado: ${customText.value.trim()}`);
  }
  return parts.join(' | ');
}

function buyNow() {
  if (isPersonalized.value && !customText.value.trim()) {
    toast.error('Atención', { description: 'Por favor, ingresa el texto a personalizar.' });
    return;
  }
  cart.addItem(props.product, variantIdx.value, quantity.value, resolveOrderNote());
  cart.openCart();
  emit('close');
}

function addToCartOnly() {
  if (isPersonalized.value && !customText.value.trim()) {
    toast.error('Atención', { description: 'Por favor, ingresa el texto a personalizar.' });
    return;
  }
  cart.addItem(props.product, variantIdx.value, quantity.value, resolveOrderNote());
  toast.success('Agregado al carrito', {
    description: `${quantity.value}x ${props.product.title}`,
    duration: 3000
  });
}
</script>
