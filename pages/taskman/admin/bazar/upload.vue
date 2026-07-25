<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-3xl font-serif font-bold">Subir modelo al Bazar</h1>
      <p class="text-muted-foreground">Diseños propios. Imagen + STL/3MF van directo al almacenamiento en la nube.</p>
    </div>

    <form @submit.prevent="submit" class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Título</label>
        <input v-model="title" required class="w-full rounded-md border bg-background px-3 py-2" />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Descripción</label>
        <textarea v-model="description" required rows="4" class="w-full rounded-md border bg-background px-3 py-2" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Precio MXN</label>
          <input v-model.number="price" type="number" min="0" step="1" class="w-full rounded-md border bg-background px-3 py-2" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Categoría</label>
          <select v-model="category" class="w-full rounded-md border bg-background px-3 py-2">
            <option value="Impresión 3D">Impresión 3D</option>
            <option value="Estilo de Vida y Equipamiento">Estilo de Vida y Equipamiento</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Imagen (jpg/png/webp)</label>
        <input type="file" accept="image/*" @change="onImageChange" required class="block w-full text-sm" />
        <div v-if="image.progress > 0" class="text-xs text-muted-foreground">
          Imagen: {{ image.progress }}%
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Archivo (STL/3MF)</label>
        <input type="file" accept=".stl,.3mf,.STL,.3MF" @change="onFileChange" required class="block w-full text-sm" />
        <div v-if="file.progress > 0" class="text-xs text-muted-foreground">
          Archivo: {{ file.progress }}%
        </div>
      </div>

      <label class="flex items-start gap-2 text-sm cursor-pointer select-none">
        <input v-model="isPublic" type="checkbox" class="mt-1" />
        <span>
          <span class="font-medium">Archivo público</span>
          <span class="block text-xs text-muted-foreground">
            Si está marcado, cualquiera con el link puede descargar el archivo. Desmárcalo si quieres que solo se genere un link firmado temporal al hacer click en Descargar.
          </span>
        </span>
      </label>

      <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>

      <button type="submit" :disabled="!canSubmit || submitting"
              class="w-full rounded-md bg-primary text-primary-foreground py-2 disabled:opacity-50">
        {{ submitting ? 'Publicando…' : 'Publicar en el Bazar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import api from '~/utils/api';
import { useR2Upload } from '~/composables/useR2Upload';

definePageMeta({ layout: 'taskman' });

const authStore = useAuthStore();
const router = useRouter();

// Guard client-side (defensa en profundidad; backend igual valida)
onMounted(() => {
  // ponytail: guard sólo por email; migrar a role cuando aparezca segundo admin.
  if (!authStore.user?.email) {
    router.replace('/login');
  }
});

const title = ref('');
const description = ref('');
const price = ref(0);
const category = ref('Impresión 3D');
const isPublic = ref(true);

const image = reactive({
  file: null as File | null,
  key: '' as string,
  token: '' as string,
  progress: 0,
});
const file = reactive({
  file: null as File | null,
  key: '' as string,
  token: '' as string,
  progress: 0,
});

const errorMsg = ref('');
const submitting = ref(false);

async function onImageChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  image.file = f;
  errorMsg.value = '';
  const uploader = useR2Upload();
  const stop = watch(() => uploader.progress.value, (v) => { image.progress = v; });
  try {
    const res = await uploader.upload(f, 'image');
    image.key = res.key;
    image.token = res.token;
    image.progress = 100;
  } catch (e: any) {
    errorMsg.value = `Imagen: ${e.message || e}`;
  } finally {
    stop();
  }
}

async function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  file.file = f;
  errorMsg.value = '';
  const uploader = useR2Upload();
  const stop = watch(() => uploader.progress.value, (v) => { file.progress = v; });
  try {
    const res = await uploader.upload(f, 'file');
    file.key = res.key;
    file.token = res.token;
    file.progress = 100;
  } catch (e: any) {
    errorMsg.value = `Archivo: ${e.message || e}`;
  } finally {
    stop();
  }
}

const canSubmit = computed(() =>
  title.value && description.value && image.key && file.key
);

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  errorMsg.value = '';
  try {
    const { data } = await api.post('/products/custom', {
      title: title.value,
      description: description.value,
      price: price.value,
      category: category.value,
      isPublic: isPublic.value,
      imageKey: image.key,
      imageToken: image.token,
      fileKey: file.key,
      fileToken: file.token,
    });
    router.push(`/bazar?highlight=${data.product.id}`);
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || e.message || 'Error al publicar';
  } finally {
    submitting.value = false;
  }
}
</script>
