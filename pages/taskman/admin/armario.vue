<template>
  <div v-if="isAdmin" class="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Header -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2 text-xs font-semibold">
          <Lock class="w-3.5 h-3.5" />
          <span>Solo Admin · Conectado a Alena + RTX 3060</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-foreground">Armario & Estilista Alena</h1>
        <p class="text-muted-foreground text-sm mt-0.5">
          Gestiona tus prendas en 6 estados, distingue tus pares de jeans y tenis, y visualiza outfits con IA.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          :disabled="capturingPi"
          @click="captureFromPi"
          class="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
        >
          <Camera class="w-4 h-4" />
          <span>{{ capturingPi ? 'Capturando Pi 5...' : 'Capturar outfit (Pi 5)' }}</span>
        </button>
        <button
          type="button"
          @click="showAddModal = true"
          class="h-10 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Nueva prenda</span>
        </button>
        <button
          type="button"
          :disabled="loading"
          @click="fetchOverview"
          class="h-10 w-10 rounded-xl border border-border bg-card hover:bg-secondary flex items-center justify-center cursor-pointer"
          title="Refrescar"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </header>

    <!-- 6-State Interactive KPI Bar -->
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
      <button
        v-for="(label, key) in STATUS_LABELS"
        :key="key"
        type="button"
        @click="jumpToStatusFilter(key)"
        class="rounded-xl border border-border/60 bg-card p-3 text-left hover:border-primary/50 transition-colors cursor-pointer"
      >
        <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">{{ label }}</p>
        <p class="text-2xl font-bold mt-0.5">{{ summary.counts[key] || 0 }}</p>
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-border/60 gap-2 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        @click="activeTab = tab.key"
        class="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
        :class="activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Panels -->
    <StylistStudio
      v-if="activeTab === 'stylist'"
      :items="items"
      :outfits="outfits"
      :active-outfit="activeOutfit"
      :settings="settings"
      :busy-ai="busyAi"
      :get-photo-url="getPhotoUrl"
      :compress-image="compressImage"
      @suggest="onSuggestOutfit"
      @preview="onPreviewOutfit"
      @wear="onWearOutfit"
      @select-outfit="activeOutfit = $event"
      @delete-outfit="onDeleteOutfit"
      @upload-base-photo="onUploadBasePhoto"
    />

    <ClosetGrid
      v-else-if="activeTab === 'closet'"
      v-model:status-filter="statusFilter"
      :items="items"
      :get-photo-url="getPhotoUrl"
      :compress-image="compressImage"
      @change-status="onChangeItemStatus"
      @update-item="onUpdateItem"
      @upload-ref-photo="onUploadRefPhoto"
      @delete-item="onDeleteItem"
      @merge-items="onMergeItems"
    />

    <LaundryPanel
      v-else-if="activeTab === 'laundry'"
      :items="items"
      :active-batches="summary.activeBatches"
      @transition="onLaundryTransition"
    />

    <!-- Add Garment Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between">
          <h3 class="font-serif text-lg font-bold">Registrar nueva prenda</h3>
          <button type="button" @click="showAddModal = false" class="p-1 rounded-lg hover:bg-secondary cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitNewItem" class="space-y-3 text-sm">
          <div class="rounded-xl border border-dashed border-border p-3 flex items-center gap-3">
            <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-semibold cursor-pointer">
              <Upload class="w-3.5 h-3.5" />
              <span>{{ addForm.photoBase64 ? 'Foto lista ✓' : 'Subir foto (recomendado)' }}</span>
              <input type="file" accept="image/*" class="hidden" @change="onNewItemFile" />
            </label>
            <label class="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <input v-model="addForm.autoClassify" type="checkbox" class="rounded accent-primary" />
              <span>Clasificar automáticamente con IA</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium text-muted-foreground">Apodo único</label>
              <input v-model="addForm.nickname" placeholder="Ej. Air Force blancos" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Nombre *</label>
              <input v-model="addForm.name" :required="!addForm.photoBase64" placeholder="Ej. Tenis Nike Air Force 1" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Categoría</label>
              <select v-model="addForm.category" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-2.5 text-sm">
                <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Color</label>
              <input v-model="addForm.color" placeholder="Ej. blanco" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Marca / Silueta</label>
              <input v-model="addForm.brand_style" placeholder="Ej. Levi's 511 / Vans" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Corte / Caña</label>
              <input v-model="addForm.fit_or_cut" placeholder="Ej. slim, low-top" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs font-medium text-muted-foreground">Detalles distintivos</label>
              <input v-model="addForm.distinguishing_details" placeholder="Ej. suela blanca gruesa, rasgadura rodilla derecha" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Estado inicial</label>
              <select v-model="addForm.status" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-2.5 text-sm">
                <option v-for="(label, key) in STATUS_LABELS" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Uso</label>
              <select v-model="addForm.formality" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-2.5 text-sm">
                <option value="casual">Casual</option>
                <option value="smart-casual">Smart-casual</option>
                <option value="formal">Formal</option>
                <option value="sport">Sport</option>
                <option value="home">Casa / Pijama</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 rounded-xl bg-secondary text-xs font-semibold cursor-pointer">
              Cancelar
            </button>
            <button type="submit" :disabled="savingNew" class="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50 cursor-pointer">
              {{ savingNew ? 'Guardando...' : 'Registrar prenda' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Camera, Lock, Plus, RefreshCw, Shirt, Sparkles, Upload, WashingMachine, X } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import api from '~/utils/api';
import { useAuthStore } from '~/stores/auth';
import StylistStudio from '~/components/armario/StylistStudio.vue';
import ClosetGrid from '~/components/armario/ClosetGrid.vue';
import LaundryPanel from '~/components/armario/LaundryPanel.vue';
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type WardrobeItem,
  type WardrobeOutfit,
  type WardrobeSettings,
  type WardrobeStatus,
  type WardrobeSummary,
} from '~/types/armario';

definePageMeta({ layout: 'taskman' });

const authStore = useAuthStore();
const router = useRouter();
const isAdmin = computed(() => authStore.user?.role === 'admin');

const tabs = [
  { key: 'stylist', label: 'Estilista & Probador IA', icon: Sparkles },
  { key: 'closet', label: 'Clóset & Prendas', icon: Shirt },
  { key: 'laundry', label: 'Lavandería & Tandas', icon: WashingMachine },
] as const;

const activeTab = ref<'stylist' | 'closet' | 'laundry'>('stylist');
const statusFilter = ref<string>('all');
const loading = ref(false);
const busyAi = ref(false);
const capturingPi = ref(false);
const savingNew = ref(false);
const showAddModal = ref(false);

const items = ref<WardrobeItem[]>([]);
const outfits = ref<WardrobeOutfit[]>([]);
const activeOutfit = ref<WardrobeOutfit | null>(null);
const settings = ref<WardrobeSettings>({ appearance_profile: null, baseBodyPhotoFile: null });
const summary = ref<WardrobeSummary>({
  total: 0,
  counts: {
    guardada: 0,
    puesta: 0,
    sucia: 0,
    lavandose: 0,
    secandose: 0,
    limpia_sin_guardar: 0,
  },
  cleanTops: 0,
  activeBatches: [],
});

const addForm = reactive({
  nickname: '',
  name: '',
  category: 'top',
  color: '',
  brand_style: '',
  fit_or_cut: '',
  distinguishing_details: '',
  status: 'guardada',
  formality: 'casual',
  photoBase64: '',
  autoClassify: true,
});

// Authenticated blob URL cache (never exposed publicly)
const photoUrls = reactive<Record<string, string>>({});
const loadingPhotoKeys = new Set<string>();

function getPhotoUrl(kind: 'garment' | 'preview' | 'base', file?: string | null): string | null {
  if (!file) return null;
  const key = `${kind}/${file}`;
  if (photoUrls[key]) return photoUrls[key];
  if (!loadingPhotoKeys.has(key)) {
    loadingPhotoKeys.add(key);
    api
      .get(`/admin/wardrobe/photo/${kind}/${encodeURIComponent(file)}`, { responseType: 'blob' })
      .then((res) => {
        photoUrls[key] = URL.createObjectURL(res.data);
      })
      .catch(() => {})
      .finally(() => {
        loadingPhotoKeys.delete(key);
      });
  }
  return null;
}

onUnmounted(() => {
  for (const url of Object.values(photoUrls)) {
    try {
      URL.revokeObjectURL(url);
    } catch {}
  }
});

function compressImage(file: File, maxDim = 1440, quality = 0.92): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fetchOverview() {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/wardrobe/overview');
    summary.value = data.summary || summary.value;
    items.value = data.items || [];
    outfits.value = data.outfits || [];
    settings.value = data.settings || { appearance_profile: null, baseBodyPhotoFile: null };
    if (!activeOutfit.value && outfits.value.length > 0) {
      activeOutfit.value = outfits.value[0];
    } else if (activeOutfit.value) {
      const refreshed = outfits.value.find((o) => o.id === activeOutfit.value!.id);
      if (refreshed) activeOutfit.value = refreshed;
    }
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'No se pudo cargar el armario');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!authStore.isInitialized) await authStore.init();
  if (!isAdmin.value) {
    router.replace('/taskman');
    return;
  }
  await fetchOverview();
});

function jumpToStatusFilter(status: string) {
  statusFilter.value = status;
  activeTab.value = 'closet';
}

async function captureFromPi() {
  capturingPi.value = true;
  try {
    const { data } = await api.post('/admin/wardrobe/capture-pi', {
      contextNote: 'Captura desde Armario TaskMan',
    });
    toast.success(data.spokenSummary || 'Outfit capturado desde la Pi 5');
    await fetchOverview();
    if (data.outfit) activeOutfit.value = data.outfit;
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'No se pudo capturar desde la cámara Pi 5');
  } finally {
    capturingPi.value = false;
  }
}

async function onSuggestOutfit(payload: { occasion: string; weather: string; generateAiPreview: boolean }) {
  busyAi.value = true;
  try {
    const { data } = await api.post('/admin/wardrobe/outfits/suggest', payload);
    activeOutfit.value = data.outfit;
    await fetchOverview();
    toast.success(`Outfit listo: ${data.outfit?.title || 'Sugerencia generada'}`);
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error generando outfit');
  } finally {
    busyAi.value = false;
  }
}

async function onPreviewOutfit(payload: {
  garmentIds: string[];
  occasion: string;
  weather: string;
  title: string;
  stylistNotes: string;
  generateAi: boolean;
  forceRegenerate?: boolean;
}) {
  busyAi.value = true;
  try {
    const { data } = await api.post('/admin/wardrobe/outfits/preview', payload);
    activeOutfit.value = data.outfit;
    await fetchOverview();
    if (payload.generateAi) toast.success('Vista previa IA generada');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error generando vista previa');
  } finally {
    busyAi.value = false;
  }
}

async function onWearOutfit(payload: { outfitId: string; garmentIds: string[] }) {
  try {
    await api.post(`/admin/wardrobe/outfits/${encodeURIComponent(payload.outfitId)}/wear`, {
      garmentIds: payload.garmentIds,
    });
    toast.success('¡Prendas marcadas como puestas!');
    await fetchOverview();
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'No se pudo registrar uso');
  }
}

async function onDeleteOutfit(outfitId: string) {
  try {
    await api.delete(`/admin/wardrobe/outfits/${encodeURIComponent(outfitId)}`);
    if (activeOutfit.value?.id === outfitId) activeOutfit.value = null;
    await fetchOverview();
    toast.success('Combinación eliminada');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error al eliminar');
  }
}

async function onUploadBasePhoto(photoBase64: string) {
  busyAi.value = true;
  try {
    const { data } = await api.post('/admin/wardrobe/settings/base-photo', { photoBase64 });
    settings.value = data.settings;
    toast.success('Foto base y perfil visual actualizados');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error subiendo foto base');
  } finally {
    busyAi.value = false;
  }
}

async function onChangeItemStatus(payload: { id: string; status: WardrobeStatus }) {
  try {
    await api.patch(`/admin/wardrobe/items/${encodeURIComponent(payload.id)}`, { status: payload.status });
    await fetchOverview();
    toast.success(`Estado actualizado a ${STATUS_LABELS[payload.status]}`);
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error cambiando estado');
  }
}

async function onUpdateItem(payload: { id: string; patch: Partial<WardrobeItem> }) {
  try {
    await api.patch(`/admin/wardrobe/items/${encodeURIComponent(payload.id)}`, payload.patch);
    await fetchOverview();
    toast.success('Prenda actualizada');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error actualizando prenda');
  }
}

async function onUploadRefPhoto(payload: { id: string; photoBase64: string; analyzeTraits: boolean }) {
  try {
    await api.post(`/admin/wardrobe/items/${encodeURIComponent(payload.id)}/photo`, {
      photoBase64: payload.photoBase64,
      analyzeTraits: payload.analyzeTraits,
    });
    await fetchOverview();
    toast.success('Foto de referencia guardada');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error subiendo foto de referencia');
  }
}

async function onDeleteItem(id: string) {
  try {
    await api.delete(`/admin/wardrobe/items/${encodeURIComponent(id)}`);
    await fetchOverview();
    toast.success('Prenda eliminada');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error eliminando prenda');
  }
}

async function onMergeItems(payload: { duplicateId: string; targetId: string }) {
  try {
    await api.post('/admin/wardrobe/items/merge', payload);
    await fetchOverview();
    toast.success('Prendas fusionadas');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error fusionando prendas');
  }
}

async function onLaundryTransition(payload: {
  action: string;
  label?: string;
  dryMethod?: string;
  batchId?: string;
  garmentIds?: string[];
}) {
  try {
    const { data } = await api.post('/admin/wardrobe/laundry/transition', payload);
    await fetchOverview();
    toast.success(data.message || 'Lavandería actualizada');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error en lavandería');
  }
}

async function onNewItemFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  addForm.photoBase64 = await compressImage(file);
  input.value = '';
}

async function submitNewItem() {
  savingNew.value = true;
  try {
    await api.post('/admin/wardrobe/items', { ...addForm });
    showAddModal.value = false;
    addForm.nickname = '';
    addForm.name = '';
    addForm.color = '';
    addForm.brand_style = '';
    addForm.fit_or_cut = '';
    addForm.distinguishing_details = '';
    addForm.photoBase64 = '';
    await fetchOverview();
    toast.success('Prenda agregada al armario');
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'No se pudo registrar la prenda');
  } finally {
    savingNew.value = false;
  }
}
</script>
