<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold">Backoffice del Bazar</h1>
        <p class="text-muted-foreground">Edita o elimina tus diseños custom. Para reemplazar imagen/archivo, borra y sube uno nuevo.</p>
      </div>
      <NuxtLink
        to="/taskman/admin/bazar/upload"
        class="whitespace-nowrap rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        + Subir nuevo
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-muted-foreground text-sm">Cargando…</div>
    <div v-else-if="fetchError" class="text-destructive text-sm">{{ fetchError }}</div>
    <div v-else-if="products.length === 0" class="text-muted-foreground text-sm">
      Todavía no has subido ningún diseño custom.
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="p in products"
        :key="p.id"
        class="rounded-lg border border-border/60 bg-card p-4"
      >
        <!-- Vista normal -->
        <div v-if="editingId !== p.id" class="flex gap-4">
          <img
            v-if="p.imageUrl"
            :src="p.imageUrl"
            :alt="p.title"
            class="w-20 h-20 rounded-md object-cover flex-shrink-0"
          />
          <div class="flex-grow min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-medium truncate">{{ p.title }}</h3>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="p.isPublic ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'"
              >
                {{ p.isPublic ? 'Público' : 'Privado' }}
              </span>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-1">{{ p.description }}</p>
            <div class="text-xs text-muted-foreground mt-1 flex gap-3 flex-wrap">
              <span>{{ formatPrice(p.price) }}</span>
              <span v-if="p.category">· {{ p.category }}</span>
              <span v-if="p.fileSizeBytes">· {{ formatSize(p.fileSizeBytes) }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <button
              type="button"
              class="text-xs rounded-md border border-border px-3 py-1 hover:bg-accent"
              @click="startEdit(p)"
            >
              Editar
            </button>
            <button
              type="button"
              class="text-xs rounded-md border border-destructive/40 text-destructive px-3 py-1 hover:bg-destructive/10"
              :disabled="deletingId === p.id"
              @click="onDelete(p)"
            >
              {{ deletingId === p.id ? 'Borrando…' : 'Borrar' }}
            </button>
          </div>
        </div>

        <!-- Vista edición -->
        <form v-else class="space-y-3" @submit.prevent="saveEdit(p)">
          <input v-model="editBuffer.title" class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Título" required />
          <textarea v-model="editBuffer.description" rows="3" class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Descripción" required />
          <div class="grid grid-cols-2 gap-3">
            <input v-model.number="editBuffer.price" type="number" min="0" step="1" class="rounded-md border bg-background px-3 py-2 text-sm" placeholder="Precio MXN" />
            <select v-model="editBuffer.category" class="rounded-md border bg-background px-3 py-2 text-sm">
              <option value="Impresión 3D">Impresión 3D</option>
              <option value="Estilo de Vida y Equipamiento">Estilo de Vida y Equipamiento</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="editBuffer.isPublic" type="checkbox" />
            <span>Archivo público</span>
          </label>
          <p v-if="editError" class="text-xs text-destructive">{{ editError }}</p>
          <div class="flex gap-2">
            <button type="submit" :disabled="saving" class="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm disabled:opacity-50">
              {{ saving ? 'Guardando…' : 'Guardar' }}
            </button>
            <button type="button" class="rounded-md border border-border px-4 py-1.5 text-sm" @click="cancelEdit()">
              Cancelar
            </button>
          </div>
        </form>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import api from '~/utils/api';

definePageMeta({ layout: 'taskman' });

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileSizeBytes?: number;
  isPublic?: boolean;
  isCustom?: boolean;
  source?: string;
}

const authStore = useAuthStore();
const router = useRouter();

const products = ref<Product[]>([]);
const loading = ref(true);
const fetchError = ref<string | null>(null);

const editingId = ref<number | null>(null);
const editBuffer = reactive({
  title: '',
  description: '',
  price: 0,
  category: '',
  isPublic: true,
});
const editError = ref<string | null>(null);
const saving = ref(false);
const deletingId = ref<number | null>(null);

// Guard client-side (backend también valida con requireAdmin)
onMounted(async () => {
  if (!authStore.user?.email) {
    router.replace('/login');
    return;
  }
  await refresh();
});

async function refresh() {
  loading.value = true;
  fetchError.value = null;
  try {
    const { data } = await api.get('/products');
    // ponytail: filtrar client-side; agregar ?source=CUSTOM al endpoint cuando el catálogo crezca.
    products.value = (data as Product[]).filter(p => p.source === 'CUSTOM');
  } catch (e: any) {
    fetchError.value = e.response?.data?.error || 'Error al cargar productos';
  } finally {
    loading.value = false;
  }
}

function startEdit(p: Product) {
  editingId.value = p.id;
  editBuffer.title = p.title;
  editBuffer.description = p.description;
  editBuffer.price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0)) || 0;
  editBuffer.category = p.category || 'Impresión 3D';
  editBuffer.isPublic = p.isPublic !== false;
  editError.value = null;
}

function cancelEdit() {
  editingId.value = null;
  editError.value = null;
}

async function saveEdit(p: Product) {
  saving.value = true;
  editError.value = null;
  try {
    await api.put(`/products/${p.id}`, {
      title: editBuffer.title,
      description: editBuffer.description,
      price: editBuffer.price,
      category: editBuffer.category,
      isPublic: editBuffer.isPublic,
    });
    editingId.value = null;
    await refresh();
  } catch (e: any) {
    editError.value = e.response?.data?.error || 'Error al guardar';
  } finally {
    saving.value = false;
  }
}

async function onDelete(p: Product) {
  if (!confirm(`¿Borrar "${p.title}"? Los archivos en R2 quedan huérfanos.`)) return;
  deletingId.value = p.id;
  try {
    await api.delete(`/products/${p.id}`);
    await refresh();
  } catch (e: any) {
    alert(e.response?.data?.error || 'Error al borrar');
  } finally {
    deletingId.value = null;
  }
}

function formatPrice(price: number | string | null | undefined): string {
  const n = typeof price === 'number' ? price : parseFloat(String(price ?? 0));
  if (isNaN(n) || n === 0) return 'Gratis';
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
</script>
