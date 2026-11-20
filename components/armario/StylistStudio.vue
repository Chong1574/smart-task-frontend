<template>
  <div class="space-y-6">
    <!-- Prompt Bar -->
    <div class="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex-1 space-y-1.5">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ocasión o contexto</label>
          <input
            v-model="occasionInput"
            type="text"
            placeholder="Ej. Cena casual con amigos, oficina, salida nocturna..."
            class="w-full h-10 rounded-xl border border-input bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            @keyup.enter="handleSuggest"
          />
        </div>
        <div class="w-full md:w-44 space-y-1.5">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clima</label>
          <select
            v-model="weatherInput"
            class="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="mild">Templado</option>
            <option value="hot">Calor</option>
            <option value="cold">Frío</option>
            <option value="rainy">Lluvia</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            type="button"
            :disabled="busyAi"
            @click="handleSuggest"
            class="w-full md:w-auto h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Sparkles class="w-4 h-4" />
            <span>{{ busyAi ? 'Generando...' : 'Generar outfit con Alena' }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="chip in quickOccasions"
            :key="chip"
            type="button"
            @click="occasionInput = chip"
            class="px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer"
            :class="occasionInput === chip ? 'bg-primary/15 border-primary/40 text-primary font-medium' : 'bg-secondary/50 border-border/60 text-muted-foreground hover:text-foreground'"
          >
            {{ chip }}
          </button>
        </div>
        <label class="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
          <input v-model="autoAiOnSuggest" type="checkbox" class="rounded border-input accent-primary" />
          <span>Generar imagen IA si no hay foto real</span>
        </label>
      </div>
    </div>

    <!-- Main Studio Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left: Visual Preview Stage -->
      <div class="lg:col-span-5 rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs">
        <div class="p-3.5 border-b border-border/50 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <button
              v-for="mode in availableViewModes"
              :key="mode.key"
              type="button"
              @click="viewMode = mode.key"
              class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              :class="activeViewMode === mode.key ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-muted-foreground hover:text-foreground'"
            >
              {{ mode.label }}
            </button>
          </div>
          <span
            v-if="activeOutfit"
            class="text-[11px] font-medium px-2 py-0.5 rounded-full"
            :class="activeViewMode === 'real' ? 'bg-emerald-500/15 text-emerald-500' : activeViewMode === 'ai' ? 'bg-violet-500/15 text-violet-400' : 'bg-amber-500/15 text-amber-500'"
          >
            {{ viewBadgeText }}
          </span>
        </div>

        <div class="relative bg-neutral-950/90 aspect-[3/4] flex items-center justify-center overflow-hidden">
          <img
            v-if="activeStageUrl"
            :src="activeStageUrl"
            alt="Vista previa del outfit"
            class="w-full h-full object-contain"
          />
          <div v-else class="text-center p-6 space-y-2 text-muted-foreground">
            <Shirt class="w-10 h-10 mx-auto opacity-40" />
            <p class="text-sm font-medium">Pide a Alena un outfit o arma una combinación</p>
            <p class="text-xs opacity-75">Si no tienes foto real de la combinación, generamos una vista previa con IA local.</p>
          </div>

          <div
            v-if="busyAi"
            class="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 text-center"
          >
            <Loader2 class="w-8 h-8 animate-spin text-primary" />
            <div>
              <p class="text-sm font-semibold">Procesando en GPU / Estilista...</p>
              <p class="text-xs text-muted-foreground mt-0.5">La vista previa IA toma ~8–15s en tu RTX 3060.</p>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-3 border-t border-border/50">
          <div v-if="activeOutfit">
            <h3 class="font-serif text-lg font-bold leading-snug">{{ activeOutfit.title }}</h3>
            <p v-if="activeOutfit.stylist_notes" class="text-xs text-muted-foreground mt-1 leading-relaxed">
              {{ activeOutfit.stylist_notes }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              :disabled="busyAi || currentComboIds.length === 0"
              @click="triggerPreview(true, Boolean(activeOutfit?.aiPreviewFile))"
              class="flex-1 h-9 px-3 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 disabled:opacity-40 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wand2 class="w-3.5 h-3.5" />
              <span>{{ activeOutfit?.aiPreviewFile ? 'Regenerar vista IA' : 'Generar vista IA' }}</span>
            </button>
            <button
              type="button"
              :disabled="busyAi || currentComboIds.length === 0"
              @click="emit('wear', { outfitId: activeOutfit?.id || 'custom', garmentIds: currentComboIds })"
              class="flex-1 h-9 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-40 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check class="w-3.5 h-3.5" />
              <span>Me puse este outfit</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Slot Swapper + Saved Outfits -->
      <div class="lg:col-span-7 space-y-5">
        <div class="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="font-semibold text-sm">Prendas de la combinación</h3>
              <p class="text-xs text-muted-foreground">Cambia jeans, tenis o playera para probar otro look al instante.</p>
            </div>
            <label class="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
              <input v-model="autoAiOnSwap" type="checkbox" class="rounded accent-primary" />
              <span>Auto-IA al cambiar prenda</span>
            </label>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="slot in coreSlots"
              :key="slot.category"
              class="rounded-xl border border-border/60 bg-background/60 p-3 space-y-2.5"
            >
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-lg bg-secondary overflow-hidden shrink-0 flex items-center justify-center border border-border/50">
                  <img
                    v-if="slotItem(slot.category) && getItemThumb(slotItem(slot.category)!)"
                    :src="getItemThumb(slotItem(slot.category)!)!"
                    class="w-full h-full object-cover"
                    alt=""
                  />
                  <Shirt v-else class="w-5 h-5 text-muted-foreground/50" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-primary">{{ slot.label }}</span>
                    <span
                      v-if="slotItem(slot.category)"
                      class="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                    >
                      {{ STATUS_LABELS[slotItem(slot.category)!.status] }}
                    </span>
                  </div>
                  <p v-if="slotItem(slot.category)" class="text-sm font-semibold truncate">
                    {{ slotItem(slot.category)!.nickname || slotItem(slot.category)!.name }}
                  </p>
                  <p v-else class="text-xs text-muted-foreground italic">Sin prenda seleccionada</p>
                  <p v-if="slotItem(slot.category)" class="text-[11px] text-muted-foreground truncate">
                    {{ [slotItem(slot.category)!.color, slotItem(slot.category)!.fit_or_cut, slotItem(slot.category)!.brand_style, slotItem(slot.category)!.distinguishing_details].filter(Boolean).join(' · ') }}
                  </p>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    @click="openSlotPicker = openSlotPicker === slot.category ? null : slot.category"
                    class="px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium cursor-pointer"
                  >
                    {{ openSlotPicker === slot.category ? 'Cerrar' : 'Cambiar' }}
                  </button>
                  <button
                    v-if="slot.optional && slotItem(slot.category)"
                    type="button"
                    @click="clearSlot(slot.category)"
                    class="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title="Quitar prenda"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Inline visual picker -->
              <div
                v-if="openSlotPicker === slot.category"
                class="pt-2 border-t border-border/50 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto"
              >
                <button
                  v-for="cand in candidatesForCategory(slot.category)"
                  :key="cand.id"
                  type="button"
                  @click="pickSlotItem(slot.category, cand.id)"
                  class="flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer"
                  :class="slotItem(slot.category)?.id === cand.id ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/40 bg-card'"
                >
                  <div class="w-10 h-10 rounded bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                    <img v-if="getItemThumb(cand)" :src="getItemThumb(cand)!" class="w-full h-full object-cover" alt="" />
                    <Shirt v-else class="w-4 h-4 text-muted-foreground/50" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold truncate">{{ cand.nickname || cand.name }}</p>
                    <p class="text-[10px] text-muted-foreground truncate">{{ [cand.color, cand.fit_or_cut].filter(Boolean).join(' · ') }}</p>
                  </div>
                </button>
                <p v-if="candidatesForCategory(slot.category).length === 0" class="col-span-full text-xs text-muted-foreground py-2">
                  No hay prendas registradas en esta categoría todavía.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent / Saved Outfits Strip -->
        <div class="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-xs">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-sm">Outfits sugeridos y combinaciones recientes</h3>
            <span class="text-xs text-muted-foreground">{{ outfits.length }} guardados</span>
          </div>

          <div v-if="outfits.length === 0" class="text-xs text-muted-foreground py-4 text-center">
            Aún no hay combinaciones guardadas. Genera una arriba o registra tu outfit desde la Pi 5.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto">
            <div
              v-for="o in outfits"
              :key="o.id"
              @click="emit('select-outfit', o)"
              class="flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer group"
              :class="activeOutfit?.id === o.id ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/40 bg-background/50'"
            >
              <div class="w-12 h-14 rounded-lg bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                <img v-if="getOutfitCardThumb(o)" :src="getOutfitCardThumb(o)!" class="w-full h-full object-cover" alt="" />
                <Sparkles v-else class="w-4 h-4 text-muted-foreground/50" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold truncate">{{ o.title }}</p>
                <p class="text-[11px] text-muted-foreground truncate">{{ o.occasion }}</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <span v-if="o.realPhotoFile" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-medium">Real</span>
                  <span v-else-if="o.aiPreviewFile" class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 font-medium">IA</span>
                  <span v-else class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-medium">Lookbook</span>
                  <span class="text-[10px] text-muted-foreground">{{ o.garment_ids.length }} prendas</span>
                </div>
              </div>
              <button
                type="button"
                @click.stop="emit('delete-outfit', o.id)"
                class="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity cursor-pointer"
                title="Eliminar combinación"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Collapsible Base Appearance Profile -->
        <details class="rounded-2xl border border-border/60 bg-card p-4 shadow-xs">
          <summary class="text-sm font-semibold cursor-pointer select-none flex items-center justify-between">
            <span>Foto base para vistas IA (opcional)</span>
            <span class="text-xs text-muted-foreground font-normal">
              {{ settings.appearance_profile ? 'Perfil configurado' : 'Sin configurar' }}
            </span>
          </summary>
          <div class="mt-3 pt-3 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-start">
            <div class="w-20 h-24 rounded-xl bg-secondary overflow-hidden shrink-0 flex items-center justify-center border border-border/60">
              <img
                v-if="settings.baseBodyPhotoFile && getPhotoUrl('base', settings.baseBodyPhotoFile)"
                :src="getPhotoUrl('base', settings.baseBodyPhotoFile)!"
                class="w-full h-full object-cover"
                alt="Foto base"
              />
              <User v-else class="w-6 h-6 text-muted-foreground/50" />
            </div>
            <div class="flex-1 space-y-2">
              <p class="text-xs text-muted-foreground">
                Sube una foto de cuerpo completo tuya. Alena extrae tu complexión, cabello y estilo visual para generar vistas previas IA más fieles a ti.
              </p>
              <p v-if="settings.appearance_profile" class="text-[11px] bg-secondary/70 rounded-lg p-2 text-foreground/85">
                <strong>Perfil detectado:</strong> {{ settings.appearance_profile }}
              </p>
              <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium cursor-pointer">
                <Upload class="w-3.5 h-3.5" />
                <span>Subir foto base</span>
                <input type="file" accept="image/*" class="hidden" @change="onBaseFileChange" />
              </label>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Check, Loader2, Shirt, Sparkles, Trash2, Upload, User, Wand2, X } from 'lucide-vue-next';
import { STATUS_LABELS, type WardrobeCategory, type WardrobeItem, type WardrobeOutfit, type WardrobeSettings } from '~/types/armario';

const props = defineProps<{
  items: WardrobeItem[];
  outfits: WardrobeOutfit[];
  activeOutfit: WardrobeOutfit | null;
  settings: WardrobeSettings;
  busyAi: boolean;
  getPhotoUrl: (kind: 'garment' | 'preview' | 'base', file?: string | null) => string | null;
  compressImage: (file: File) => Promise<string>;
}>();

const emit = defineEmits<{
  suggest: [payload: { occasion: string; weather: string; generateAiPreview: boolean }];
  preview: [payload: { garmentIds: string[]; occasion: string; weather: string; title: string; stylistNotes: string; generateAi: boolean; forceRegenerate?: boolean }];
  wear: [payload: { outfitId: string; garmentIds: string[] }];
  'select-outfit': [outfit: WardrobeOutfit];
  'delete-outfit': [outfitId: string];
  'upload-base-photo': [photoBase64: string];
}>();

const quickOccasions = ['Cena casual', 'Oficina / Junta', 'Salir / Cita', 'Sport / Gym', 'En casa'];
const occasionInput = ref('Cena casual');
const weatherInput = ref('mild');
const autoAiOnSuggest = ref(true);
const autoAiOnSwap = ref(false);
const openSlotPicker = ref<WardrobeCategory | null>(null);
const viewMode = ref<'auto' | 'real' | 'ai' | 'lookbook'>('auto');
const selectedBySlot = ref<Partial<Record<WardrobeCategory, string>>>({});

const coreSlots: Array<{ category: WardrobeCategory; label: string; optional?: boolean }> = [
  { category: 'top', label: 'Top / Playera' },
  { category: 'bottom', label: 'Jeans / Pantalón' },
  { category: 'shoes', label: 'Tenis / Calzado' },
  { category: 'jacket', label: 'Chamarra / Capa', optional: true },
  { category: 'pajama', label: 'Pijama / Casa', optional: true },
  { category: 'accessory', label: 'Accesorio', optional: true },
];

watch(
  () => props.activeOutfit,
  (outfit) => {
    const next: Partial<Record<WardrobeCategory, string>> = {};
    if (outfit) {
      for (const gid of outfit.garment_ids) {
        const item = props.items.find((i) => i.id === gid);
        if (item && !next[item.category]) {
          next[item.category] = item.id;
        }
      }
      if (outfit.occasion) occasionInput.value = outfit.occasion;
      if (outfit.weather) weatherInput.value = outfit.weather;
    }
    selectedBySlot.value = next;
    viewMode.value = 'auto';
  },
  { immediate: true }
);

const currentComboIds = computed(() => Object.values(selectedBySlot.value).filter((v): v is string => Boolean(v)));

const slotItem = (cat: WardrobeCategory): WardrobeItem | null => {
  const id = selectedBySlot.value[cat];
  return id ? props.items.find((i) => i.id === id) || null : null;
};

const candidatesForCategory = (cat: WardrobeCategory) =>
  props.items.filter((i) => i.category === cat);

const getItemThumb = (item: WardrobeItem) =>
  props.getPhotoUrl('garment', item.referencePhotoFile || item.photoFile);

const getOutfitCardThumb = (o: WardrobeOutfit) => {
  if (o.realPhotoFile) return props.getPhotoUrl('garment', o.realPhotoFile);
  if (o.aiPreviewFile) return props.getPhotoUrl('preview', o.aiPreviewFile);
  if (o.lookbookFile) return props.getPhotoUrl('preview', o.lookbookFile);
  return null;
};

const availableViewModes = computed(() => {
  const modes: Array<{ key: 'real' | 'ai' | 'lookbook'; label: string }> = [];
  if (props.activeOutfit?.realPhotoFile) modes.push({ key: 'real', label: 'Foto real' });
  if (props.activeOutfit?.aiPreviewFile) modes.push({ key: 'ai', label: 'Vista IA' });
  if (props.activeOutfit?.lookbookFile) modes.push({ key: 'lookbook', label: 'Lookbook' });
  if (modes.length === 0) modes.push({ key: 'lookbook', label: 'Vista previa' });
  return modes;
});

const activeViewMode = computed<'real' | 'ai' | 'lookbook'>(() => {
  if (viewMode.value !== 'auto') {
    if (viewMode.value === 'real' && props.activeOutfit?.realPhotoFile) return 'real';
    if (viewMode.value === 'ai' && props.activeOutfit?.aiPreviewFile) return 'ai';
    if (viewMode.value === 'lookbook' && props.activeOutfit?.lookbookFile) return 'lookbook';
  }
  if (props.activeOutfit?.realPhotoFile) return 'real';
  if (props.activeOutfit?.aiPreviewFile) return 'ai';
  return 'lookbook';
});

const activeStageUrl = computed(() => {
  const o = props.activeOutfit;
  if (!o) return null;
  if (activeViewMode.value === 'real' && o.realPhotoFile) {
    return props.getPhotoUrl('garment', o.realPhotoFile);
  }
  if (activeViewMode.value === 'ai' && o.aiPreviewFile) {
    return props.getPhotoUrl('preview', o.aiPreviewFile);
  }
  if (o.lookbookFile) {
    return props.getPhotoUrl('preview', o.lookbookFile);
  }
  return null;
});

const viewBadgeText = computed(() => {
  if (activeViewMode.value === 'real') return '📸 Foto real de esta combinación';
  if (activeViewMode.value === 'ai') return '✨ Vista previa generada por IA';
  return '🧩 Tablero de tus prendas';
});

function handleSuggest() {
  emit('suggest', {
    occasion: occasionInput.value || 'casual',
    weather: weatherInput.value,
    generateAiPreview: autoAiOnSuggest.value,
  });
}

function triggerPreview(generateAi: boolean, forceRegenerate = false) {
  if (currentComboIds.value.length === 0) return;
  emit('preview', {
    garmentIds: currentComboIds.value,
    occasion: occasionInput.value || 'casual',
    weather: weatherInput.value,
    title: props.activeOutfit?.title || `Look: ${occasionInput.value || 'Casual'}`,
    stylistNotes: props.activeOutfit?.stylist_notes || '',
    generateAi,
    forceRegenerate,
  });
}

function pickSlotItem(cat: WardrobeCategory, itemId: string) {
  selectedBySlot.value = { ...selectedBySlot.value, [cat]: itemId };
  openSlotPicker.value = null;
  triggerPreview(autoAiOnSwap.value, false);
}

function clearSlot(cat: WardrobeCategory) {
  const copy = { ...selectedBySlot.value };
  delete copy[cat];
  selectedBySlot.value = copy;
  triggerPreview(autoAiOnSwap.value, false);
}

async function onBaseFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const b64 = await props.compressImage(file);
  emit('upload-base-photo', b64);
  input.value = '';
}
</script>
