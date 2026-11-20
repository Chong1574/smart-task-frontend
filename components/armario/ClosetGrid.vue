<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-xs">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por apodo, nombre, color, marca o detalles..."
            class="w-full h-9 pl-9 pr-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          v-model="categoryFilter"
          class="h-9 px-3 rounded-xl border border-input bg-background text-sm sm:w-52"
        >
          <option value="all">Todas las categorías</option>
          <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <button
          type="button"
          @click="emit('update:statusFilter', 'all')"
          class="px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer"
          :class="statusFilter === 'all' ? 'bg-primary text-primary-foreground border-primary font-medium' : 'bg-secondary/50 border-border/60 text-muted-foreground hover:text-foreground'"
        >
          Todos ({{ items.length }})
        </button>
        <button
          v-for="(label, key) in STATUS_LABELS"
          :key="key"
          type="button"
          @click="emit('update:statusFilter', key)"
          class="px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer"
          :class="statusFilter === key ? 'bg-primary text-primary-foreground border-primary font-medium' : 'bg-secondary/50 border-border/60 text-muted-foreground hover:text-foreground'"
        >
          {{ label }} ({{ countByStatus(key) }})
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredItems.length === 0" class="rounded-2xl border border-dashed border-border p-10 text-center space-y-2 text-muted-foreground">
      <Shirt class="w-8 h-8 mx-auto opacity-40" />
      <p class="text-sm font-medium">No hay prendas con esos filtros.</p>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="rounded-2xl border border-border/60 bg-card overflow-hidden flex flex-col shadow-xs hover:border-primary/40 transition-colors"
      >
        <div class="relative h-48 bg-secondary/40 flex items-center justify-center overflow-hidden border-b border-border/40">
          <img
            v-if="itemPhoto(item)"
            :src="itemPhoto(item)!"
            :alt="item.nickname || item.name"
            class="w-full h-full object-contain"
          />
          <Shirt v-else class="w-10 h-10 text-muted-foreground/40" />

          <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-background/85 backdrop-blur-xs border border-border/60">
              {{ CATEGORY_LABELS[item.category] || item.category }}
            </span>
            <span
              v-if="item.category === 'pajama' || item.formality === 'home'"
              class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              🏠 Casa/Pijama
            </span>
          </div>

          <span
            v-if="item.referencePhotoFile"
            class="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          >
            Foto ref ✓
          </span>
        </div>

        <div class="p-3.5 flex-1 flex flex-col gap-2.5">
          <div>
            <h3 class="font-semibold text-sm leading-tight truncate">
              {{ item.nickname || item.name }}
            </h3>
            <p v-if="item.nickname" class="text-[11px] text-muted-foreground truncate">{{ item.name }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">
              Color: <span class="text-foreground/90 font-medium">{{ item.color }}</span> · {{ item.formality }}
            </p>
          </div>

          <div class="flex flex-wrap gap-1">
            <span v-if="item.fit_or_cut" class="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
              {{ item.fit_or_cut }}
            </span>
            <span v-if="item.brand_style" class="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
              {{ item.brand_style }}
            </span>
            <span v-if="item.distinguishing_details" class="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {{ item.distinguishing_details }}
            </span>
          </div>

          <!-- Wear bar -->
          <div class="space-y-1 mt-auto pt-1">
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Usos sin lavar: {{ item.wears_since_wash }}/{{ item.max_wears_before_wash }}</span>
              <span>Total: {{ item.total_wears }}</span>
            </div>
            <div class="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="item.wears_since_wash >= item.max_wears_before_wash ? 'bg-amber-500' : 'bg-primary'"
                :style="{ width: `${Math.min(100, Math.round((item.wears_since_wash / Math.max(1, item.max_wears_before_wash)) * 100))}%` }"
              />
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-1.5 pt-2 border-t border-border/40">
            <select
              :value="item.status"
              @change="onStatusSelect(item.id, $event)"
              class="flex-1 h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium"
            >
              <option v-for="(label, key) in STATUS_LABELS" :key="key" :value="key">{{ label }}</option>
            </select>
            <button
              type="button"
              @click="openEdit(item)"
              class="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer"
              title="Editar y subir foto de referencia"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              @click="openMerge(item)"
              class="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer"
              title="Fusionar duplicado con otra prenda"
            >
              <GitMerge class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              @click="confirmDelete(item)"
              class="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              title="Eliminar prenda"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit & Reference Photo Modal -->
    <div v-if="editingItem" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between">
          <h3 class="font-serif text-lg font-bold">Editar prenda & Foto de referencia</h3>
          <button type="button" @click="editingItem = null" class="p-1 rounded-lg hover:bg-secondary cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Reference photo uploader -->
        <div class="rounded-xl border border-border/60 bg-background/50 p-3 flex flex-col sm:flex-row items-center gap-3">
          <div class="w-20 h-20 rounded-lg bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
            <img v-if="itemPhoto(editingItem)" :src="itemPhoto(editingItem)!" class="w-full h-full object-cover" alt="" />
            <Camera v-else class="w-6 h-6 text-muted-foreground/50" />
          </div>
          <div class="flex-1 space-y-2 text-xs">
            <p class="text-muted-foreground">
              Sube una foto clara (ej. de tus tenis o jeans) para que el collage visual distinga tus ~5 pares sin confundirlos.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold cursor-pointer hover:opacity-90">
                <Upload class="w-3.5 h-3.5" />
                <span>Subir foto ref</span>
                <input type="file" accept="image/*" class="hidden" @change="onRefPhotoUpload" />
              </label>
              <label class="inline-flex items-center gap-1.5 text-muted-foreground cursor-pointer select-none">
                <input v-model="analyzeTraitsOnPhoto" type="checkbox" class="rounded accent-primary" />
                <span>Detectar rasgos con IA</span>
              </label>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitEdit" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <label class="text-xs font-medium text-muted-foreground">Apodo único (ej. Jeans Levi's rotos)</label>
            <input v-model="editForm.nickname" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Nombre descriptivo</label>
            <input v-model="editForm.name" required class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Categoría</label>
            <select v-model="editForm.category" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-2.5 text-sm">
              <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Color</label>
            <input v-model="editForm.color" required class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Marca / Silueta</label>
            <input v-model="editForm.brand_style" placeholder="Ej. Nike Air Force / Levi's 511" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Corte / Caña</label>
            <input v-model="editForm.fit_or_cut" placeholder="Ej. slim, baggy, low-top" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs font-medium text-muted-foreground">Detalles distintivos (clave para diferenciar pares)</label>
            <input v-model="editForm.distinguishing_details" placeholder="Ej. suela blanca gruesa y talón rojo, costura naranja..." class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Formalidad</label>
            <select v-model="editForm.formality" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-2.5 text-sm">
              <option value="casual">Casual</option>
              <option value="smart-casual">Smart-casual</option>
              <option value="formal">Formal</option>
              <option value="sport">Sport</option>
              <option value="home">Casa / Pijama</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Máx. usos antes de lavar</label>
            <input v-model.number="editForm.max_wears_before_wash" type="number" min="1" max="99" class="w-full mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div class="sm:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" @click="editingItem = null" class="px-4 py-2 rounded-xl bg-secondary text-xs font-semibold cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Merge Duplicate Modal -->
    <div v-if="mergingItem" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xl">
        <h3 class="font-serif text-lg font-bold">Fusionar duplicado</h3>
        <p class="text-xs text-muted-foreground">
          Se eliminará <strong>{{ mergingItem.nickname || mergingItem.name }}</strong> y sus usos se sumarán a la prenda destino que elijas:
        </p>
        <select v-model="mergeTargetId" class="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="" disabled>Selecciona prenda destino...</option>
          <option
            v-for="cand in items.filter(i => i.id !== mergingItem?.id)"
            :key="cand.id"
            :value="cand.id"
          >
            {{ cand.nickname || cand.name }} ({{ cand.color }})
          </option>
        </select>
        <div class="flex justify-end gap-2">
          <button type="button" @click="mergingItem = null" class="px-4 py-2 rounded-xl bg-secondary text-xs font-semibold cursor-pointer">
            Cancelar
          </button>
          <button
            type="button"
            :disabled="!mergeTargetId"
            @click="submitMerge"
            class="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            Fusionar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Camera, GitMerge, Pencil, Search, Shirt, Trash2, Upload, X } from 'lucide-vue-next';
import { CATEGORY_LABELS, STATUS_LABELS, type WardrobeItem, type WardrobeStatus } from '~/types/armario';

const props = defineProps<{
  items: WardrobeItem[];
  statusFilter: string;
  getPhotoUrl: (kind: 'garment' | 'preview' | 'base', file?: string | null) => string | null;
  compressImage: (file: File) => Promise<string>;
}>();

const emit = defineEmits<{
  'update:statusFilter': [value: string];
  'change-status': [payload: { id: string; status: WardrobeStatus }];
  'update-item': [payload: { id: string; patch: Partial<WardrobeItem> }];
  'upload-ref-photo': [payload: { id: string; photoBase64: string; analyzeTraits: boolean }];
  'delete-item': [id: string];
  'merge-items': [payload: { duplicateId: string; targetId: string }];
}>();

const searchQuery = ref('');
const categoryFilter = ref('all');
const editingItem = ref<WardrobeItem | null>(null);
const analyzeTraitsOnPhoto = ref(true);
const mergingItem = ref<WardrobeItem | null>(null);
const mergeTargetId = ref('');

const editForm = reactive({
  nickname: '',
  name: '',
  category: 'top',
  color: '',
  brand_style: '',
  fit_or_cut: '',
  distinguishing_details: '',
  formality: 'casual',
  max_wears_before_wash: 1,
});

watch(
  () => props.items,
  (list) => {
    if (editingItem.value) {
      const fresh = list.find((i) => i.id === editingItem.value!.id);
      if (fresh) editingItem.value = fresh;
    }
  }
);

const countByStatus = (st: string) => props.items.filter((i) => i.status === st).length;

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return props.items.filter((i) => {
    if (props.statusFilter !== 'all' && i.status !== props.statusFilter) return false;
    if (categoryFilter.value !== 'all' && i.category !== categoryFilter.value) return false;
    if (!q) return true;
    const hay = [i.nickname, i.name, i.color, i.brand_style, i.fit_or_cut, i.distinguishing_details, i.visual_features]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
});

const itemPhoto = (item: WardrobeItem) =>
  props.getPhotoUrl('garment', item.referencePhotoFile || item.photoFile);

function onStatusSelect(id: string, e: Event) {
  const status = (e.target as HTMLSelectElement).value as WardrobeStatus;
  emit('change-status', { id, status });
}

function openEdit(item: WardrobeItem) {
  editingItem.value = item;
  editForm.nickname = item.nickname || '';
  editForm.name = item.name;
  editForm.category = item.category;
  editForm.color = item.color;
  editForm.brand_style = item.brand_style || '';
  editForm.fit_or_cut = item.fit_or_cut || '';
  editForm.distinguishing_details = item.distinguishing_details || '';
  editForm.formality = item.formality;
  editForm.max_wears_before_wash = item.max_wears_before_wash;
}

function submitEdit() {
  if (!editingItem.value) return;
  emit('update-item', {
    id: editingItem.value.id,
    patch: {
      nickname: editForm.nickname.trim() || null,
      name: editForm.name.trim(),
      category: editForm.category as any,
      color: editForm.color.trim(),
      brand_style: editForm.brand_style.trim() || null,
      fit_or_cut: editForm.fit_or_cut.trim() || null,
      distinguishing_details: editForm.distinguishing_details.trim() || null,
      formality: editForm.formality as any,
      max_wears_before_wash: Number(editForm.max_wears_before_wash) || 1,
    },
  });
  editingItem.value = null;
}

async function onRefPhotoUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !editingItem.value) return;
  const b64 = await props.compressImage(file);
  emit('upload-ref-photo', {
    id: editingItem.value.id,
    photoBase64: b64,
    analyzeTraits: analyzeTraitsOnPhoto.value,
  });
  input.value = '';
}

function openMerge(item: WardrobeItem) {
  mergingItem.value = item;
  mergeTargetId.value = '';
}

function submitMerge() {
  if (!mergingItem.value || !mergeTargetId.value) return;
  emit('merge-items', { duplicateId: mergingItem.value.id, targetId: mergeTargetId.value });
  mergingItem.value = null;
}

function confirmDelete(item: WardrobeItem) {
  if (confirm(`¿Eliminar "${item.nickname || item.name}" de tu armario?`)) {
    emit('delete-item', item.id);
  }
}
</script>
