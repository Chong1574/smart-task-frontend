<template>
  <div
    class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-card border border-border/70 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-5xl h-[94dvh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden"
    >
      <!-- 1. Barra superior fija (flex-none) -->
      <header class="flex-none flex items-center justify-between px-4 sm:px-6 py-3 bg-card/95 backdrop-blur-md border-b border-border/60 z-10">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Volver al catálogo
        </button>

        <button
          type="button"
          class="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Cerrar"
          @click="$emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </header>

      <!-- 2. Contenido Scrolleable (flex-1: NUNCA se sobrepone con el footer) -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div class="grid md:grid-cols-12 gap-5 md:gap-8">
          <!-- Columna Izquierda: Galería Visual -->
          <div class="md:col-span-6 space-y-3">
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
              <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground/40 font-serif italic text-xs">
                [ Imagen del Producto ]
              </div>

              <!-- Badge comercial limpio sobre la imagen -->
              <div v-if="product.category" class="absolute top-2.5 left-2.5">
                <span class="bg-background/90 backdrop-blur-md text-foreground text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-border/60 shadow-xs">
                  {{ product.category }}
                </span>
              </div>

              <!-- Controles de navegación de galería -->
              <template v-if="images.length > 1">
                <button
                  type="button"
                  @click="prevImage"
                  class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/85 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center transition-all opacity-90 hover:scale-105 cursor-pointer"
                  aria-label="Imagen anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button
                  type="button"
                  @click="nextImage"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/85 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center transition-all opacity-90 hover:scale-105 cursor-pointer"
                  aria-label="Siguiente imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <div class="absolute bottom-2.5 right-2.5 bg-background/85 backdrop-blur-md text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border/60 shadow-xs">
                  {{ imgIdx + 1 }} / {{ images.length }}
                </div>
              </template>
            </div>

            <!-- Miniaturas -->
            <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                v-for="(img, i) in images"
                :key="i"
                type="button"
                @click="selectImage(i)"
                class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer"
                :class="imgIdx === i ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-border/40 opacity-70 hover:opacity-100'"
              >
                <img :src="imgProxy(img, { width: 120 })" loading="lazy" decoding="async" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Columna Derecha: Información y Opciones de Compra -->
          <div class="md:col-span-6 flex flex-col justify-between space-y-4">
            <!-- 1. Título y Descripción -->
            <div>
              <h1 class="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-foreground leading-snug mb-1.5">
                {{ product.title }}
              </h1>
              <p v-if="product.description" class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- 2. Selector de Versiones (Limpieza total, sin gramos ni tecnicismos) -->
            <div v-if="variants.length > 1" class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Versión / Modelo:</span>
                <span class="text-foreground font-bold">{{ activeVariant?.name }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(v, i) in variants"
                  :key="i"
                  type="button"
                  @click="variantIdx = i"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  :class="variantIdx === i
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border/80 bg-card hover:bg-secondary text-foreground'"
                >
                  <img v-if="v.imageUrl" :src="imgProxy(v.imageUrl, { width: 48 })" class="w-4 h-4 rounded object-cover" />
                  <span>{{ v.name }}</span>
                  <span class="font-normal opacity-90">({{ fmt(v.price) }})</span>
                </button>
              </div>
            </div>

            <!-- 3. Selector de Color Simplificado (Colapsable) -->
            <div class="bg-card/70 border border-border/70 rounded-xl p-3 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Color de la pieza:</span>
                <span class="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span
                    class="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                    :style="{ background: currentColorSwatch }"
                  ></span>
                  {{ selectedColorObj.label }}
                </span>
              </div>

              <!-- Fila compacta -->
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  @click="selectedColorId = 'original'; showColorPicker = false"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-all"
                  :class="selectedColorId === 'original'
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-bold'
                    : 'border-border/60 bg-background/60 hover:bg-secondary text-muted-foreground'"
                >
                  <span>✨</span>
                  <span>Como en la foto (Recomendado)</span>
                </button>

                <button
                  type="button"
                  @click="showColorPicker = !showColorPicker"
                  class="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-dashed border-border/80 hover:border-primary text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>🎨</span>
                  <span>{{ showColorPicker ? 'Ocultar tonos' : (selectedColorId !== 'original' ? 'Cambiar tono' : 'Elegir otro tono') }}</span>
                </button>
              </div>

              <!-- Paleta desplegable -->
              <div v-if="showColorPicker" class="pt-2 border-t border-border/40 animate-in fade-in duration-150">
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
                    :title="color.label"
                    :aria-label="color.label"
                  >
                    <div class="absolute inset-0 rounded-xl border border-black/15 dark:border-white/15 pointer-events-none"></div>
                    <svg
                      v-if="selectedColorId === color.id"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
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

            <!-- 4. Campo de Personalización (si aplica) -->
            <div v-if="isPersonalized" class="animate-in fade-in slide-in-from-top-2">
              <label class="block text-xs font-semibold uppercase tracking-wider mb-1 text-foreground">
                Texto a personalizar <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="customText"
                placeholder="Ej. Nombre a grabar o dedicatoria..."
                class="w-full h-9 px-3 rounded-xl border border-primary/50 bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <!-- 5. En Desktop (md:): Bloque de Precio + Cantidad + Botones Integrados -->
            <div class="hidden md:block bg-secondary/25 border border-border/70 rounded-2xl p-4 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <span class="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {{ activeVariant && variants.length > 1 ? `Precio · ${activeVariant.name}` : 'Precio final · IVA incluido' }}
                  </span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-black text-primary tracking-tight">{{ priceLabel }}</span>
                    <span v-if="currentPrice > 0" class="text-xs font-bold text-muted-foreground">MXN</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <div class="flex items-center border border-border rounded-xl bg-card h-10 px-1 shrink-0">
                    <button
                      type="button"
                      class="w-7 h-8 text-muted-foreground hover:text-foreground disabled:opacity-40 font-bold text-sm cursor-pointer"
                      @click="quantity > 1 ? quantity-- : null"
                      :disabled="quantity <= 1"
                    >
                      −
                    </button>
                    <span class="px-1 text-sm font-bold w-6 text-center">{{ quantity }}</span>
                    <button
                      type="button"
                      class="w-7 h-8 text-muted-foreground hover:text-foreground font-bold text-sm cursor-pointer"
                      @click="quantity++"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    @click="buyNow"
                    class="h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm px-5 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 justify-center items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Comprar ahora</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-border/50">
                <button
                  type="button"
                  @click="addToCartOnly"
                  class="h-9 bg-card hover:bg-secondary text-foreground font-semibold text-xs px-2.5 rounded-xl transition-all flex justify-center items-center gap-1.5 border border-border/80 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  <span>Agregar al carrito</span>
                </button>

                <a
                  :href="whatsappInquiryUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="h-9 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs px-2.5 rounded-xl transition-all flex justify-center items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span>Dudas por WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- 6. Factores de Venta y Garantías (Trust Badges comerciales) -->
            <div class="grid grid-cols-2 gap-2.5 py-3 border-t border-b border-border/50 text-xs">
              <div class="flex items-center gap-2 bg-secondary/15 p-2 rounded-xl border border-border/40">
                <span class="text-base shrink-0">🚚</span>
                <div class="min-w-0">
                  <p class="font-bold text-foreground text-[11px] leading-tight">Envío seguro</p>
                  <p class="text-[10px] text-muted-foreground leading-tight truncate">A todo México con rastreo</p>
                </div>
              </div>

              <div class="flex items-center gap-2 bg-secondary/15 p-2 rounded-xl border border-border/40">
                <span class="text-base shrink-0">🛡️</span>
                <div class="min-w-0">
                  <p class="font-bold text-foreground text-[11px] leading-tight">Garantía total</p>
                  <p class="text-[10px] text-muted-foreground leading-tight truncate">Reposición si llega dañado</p>
                </div>
              </div>

              <div class="flex items-center gap-2 bg-secondary/15 p-2 rounded-xl border border-border/40">
                <span class="text-base shrink-0">✨</span>
                <div class="min-w-0">
                  <p class="font-bold text-foreground text-[11px] leading-tight">Listo para usar</p>
                  <p class="text-[10px] text-muted-foreground leading-tight truncate">Pieza física terminada</p>
                </div>
              </div>

              <div class="flex items-center gap-2 bg-secondary/15 p-2 rounded-xl border border-border/40">
                <span class="text-base shrink-0">💳</span>
                <div class="min-w-0">
                  <p class="font-bold text-foreground text-[11px] leading-tight">Pago protegido</p>
                  <p class="text-[10px] text-muted-foreground leading-tight truncate">Tarjeta o transferencia</p>
                </div>
              </div>
            </div>

            <!-- Enlace WhatsApp discreto en móvil -->
            <div class="md:hidden pt-1">
              <a
                :href="whatsappInquiryUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full h-9 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs px-3 rounded-xl transition-all flex justify-center items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span>¿Tienes dudas? Escríbenos por WhatsApp</span>
              </a>
            </div>

            <!-- Atribución legal discreta -->
            <div v-if="product.licenseAttribution" class="pt-1 text-[10px] text-muted-foreground/60 text-center">
              Diseño original bajo licencia de autor: {{ product.licenseAttribution }}
            </div>
          </div>
        </div>
      </main>

      <!-- 3. FOOTER MÓVIL (flex-none, anclado al fondo del modal, IMPOSIBLE que se sobreponga) -->
      <footer class="md:hidden flex-none p-3 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-between gap-3 shadow-2xl z-20">
        <!-- Precio y Cantidad -->
        <div class="flex items-center gap-2">
          <div class="min-w-0">
            <span class="block text-[9px] text-muted-foreground uppercase font-semibold leading-tight">Total</span>
            <div class="flex items-baseline gap-0.5">
              <span class="text-lg font-black text-primary leading-tight">{{ priceLabel }}</span>
              <span v-if="currentPrice > 0" class="text-[9px] font-bold text-muted-foreground">MXN</span>
            </div>
          </div>

          <!-- Selector de Cantidad compacto en el footer -->
          <div class="flex items-center border border-border rounded-lg bg-secondary/40 h-8 px-1 shrink-0">
            <button
              type="button"
              class="w-6 h-7 text-muted-foreground hover:text-foreground disabled:opacity-40 font-bold text-xs cursor-pointer"
              @click="quantity > 1 ? quantity-- : null"
              :disabled="quantity <= 1"
            >
              −
            </button>
            <span class="px-1 text-xs font-bold w-4 text-center">{{ quantity }}</span>
            <button
              type="button"
              class="w-6 h-7 text-muted-foreground hover:text-foreground font-bold text-xs cursor-pointer"
              @click="quantity++"
            >
              +
            </button>
          </div>
        </div>

        <!-- Botones de Acción Móvil -->
        <div class="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            @click="addToCartOnly"
            class="h-10 w-10 bg-secondary/80 hover:bg-secondary text-foreground rounded-xl border border-border flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
            title="Agregar al carrito"
            aria-label="Agregar al carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>

          <button
            type="button"
            @click="buyNow"
            class="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs sm:text-sm px-3 rounded-xl transition-all shadow-md shadow-primary/25 flex justify-center items-center gap-1.5 cursor-pointer active:scale-[0.98] whitespace-nowrap"
          >
            <span>Comprar ahora</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </footer>
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
  hex: string;
  textColor: string;
}

const ORIGINAL_COLOR_OPTION = {
  id: 'original',
  label: 'Como en la foto (Recomendado)',
  swatch: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)',
};

const SUNLU_BAMBU_COLORS: FilamentColor[] = [
  { id: 'white', label: 'Blanco Puro', hex: '#FFFFFF', textColor: '#18181B' },
  { id: 'black', label: 'Negro Mate', hex: '#18181B', textColor: '#FFFFFF' },
  { id: 'gray', label: 'Gris Ceniza', hex: '#71717A', textColor: '#FFFFFF' },
  { id: 'silver', label: 'Plata Metálico', hex: '#9CA3AF', textColor: '#18181B' },
  { id: 'beige', label: 'Beige Hueso', hex: '#E4D5B7', textColor: '#18181B' },
  { id: 'brown', label: 'Café Madera', hex: '#5C3A21', textColor: '#FFFFFF' },
  { id: 'red', label: 'Rojo Carmesí', hex: '#DC2626', textColor: '#FFFFFF' },
  { id: 'orange', label: 'Naranja', hex: '#EA580C', textColor: '#FFFFFF' },
  { id: 'yellow', label: 'Amarillo', hex: '#EAB308', textColor: '#18181B' },
  { id: 'bambu_green', label: 'Verde Claro', hex: '#16A34A', textColor: '#FFFFFF' },
  { id: 'forest_green', label: 'Verde Oscuro', hex: '#14532D', textColor: '#FFFFFF' },
  { id: 'cyan', label: 'Azul Cielo', hex: '#06B6D4', textColor: '#FFFFFF' },
  { id: 'blue', label: 'Azul Rey', hex: '#2563EB', textColor: '#FFFFFF' },
  { id: 'navy', label: 'Azul Marino', hex: '#1E3A8A', textColor: '#FFFFFF' },
  { id: 'purple', label: 'Púrpura', hex: '#7C3AED', textColor: '#FFFFFF' },
  { id: 'pink', label: 'Rosa Sakura', hex: '#F472B6', textColor: '#18181B' },
];

const selectedColorId = ref<string>('original');
const showColorPicker = ref<boolean>(false);

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

function syncVariantImage(idx: number) {
  const v = variants.value[idx];
  if (!v) return;
  if (v.imageIndex !== undefined && v.imageIndex >= 0 && v.imageIndex < images.value.length) {
    imgIdx.value = v.imageIndex;
    return;
  }
  if (v.imageUrl) {
    const cleanV = v.imageUrl.split('?')[0].toLowerCase();
    const foundIdx = images.value.findIndex(img => {
      const cleanImg = img.split('?')[0].toLowerCase();
      if (cleanImg === cleanV) return true;
      const targetName = cleanV.split('/').pop();
      return Boolean(targetName && targetName.length > 5 && cleanImg.includes(targetName));
    });
    if (foundIdx !== -1) {
      imgIdx.value = foundIdx;
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

const whatsappInquiryUrl = computed(() => {
  const vName = activeVariant.value ? ` (${activeVariant.value.name})` : '';
  const colorNote = selectedColorId.value !== 'original' ? ` en color ${selectedColorObj.value.label}` : '';
  const shareUrl = `https://shongyi.com/bazar?p=${props.product.id}`;
  const msg = `Hola, me interesa "${props.product.title}"${vName}${colorNote} en El Bazar (${priceLabel.value}):\n${shareUrl}\n\n¿Me podrías dar más información?`;
  return `https://wa.me/524421752026?text=${encodeURIComponent(msg)}`;
});

function resolveOrderNote(): string {
  const parts: string[] = [];
  if (selectedColorId.value !== 'original') {
    parts.push(`Color: ${selectedColorObj.value.label}`);
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
