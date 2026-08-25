<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-3xl font-serif font-bold">Chapa TTLock</h1>
      <p class="text-muted-foreground">Genera y administra códigos de acceso para la chapa de Tequis.</p>
    </div>

    <!-- Generar código -->
    <div class="rounded-lg border border-border/60 bg-card p-5 space-y-4">
      <h2 class="font-medium text-lg">Generar código nuevo</h2>
      <form @submit.prevent="generate" class="space-y-3">
        <div>
          <label class="text-sm text-muted-foreground">Nombre (huésped / referencia)</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ej: Juan Pérez - Agosto"
            class="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label class="text-sm text-muted-foreground">Tipo de código</label>
          <select v-model="form.type" class="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm">
            <option value="permanent">Permanente</option>
            <option value="timed">Temporal (con fechas)</option>
            <option value="one_time">Un solo uso</option>
          </select>
        </div>
        <div v-if="form.type === 'timed'" class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-muted-foreground">Desde</label>
            <input v-model="form.startDate" type="datetime-local" class="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm text-muted-foreground">Hasta</label>
            <input v-model="form.endDate" type="datetime-local" class="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <button
          type="submit"
          :disabled="generating"
          class="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {{ generating ? 'Generando...' : 'Generar código' }}
        </button>
      </form>

      <!-- Resultado -->
      <div v-if="generatedCode" class="mt-4 p-4 rounded-md bg-green-500/10 border border-green-500/30 space-y-2">
        <p class="text-sm text-muted-foreground">Código generado:</p>
        <p class="text-3xl font-mono font-bold tracking-widest text-green-600 dark:text-green-400">{{ generatedCode }}</p>
        <p class="text-xs text-muted-foreground">El huésped debe teclear este código + # en la chapa.</p>
      </div>

      <p v-if="errorMsg" class="text-destructive text-sm">{{ errorMsg }}</p>
    </div>

    <!-- Lista de códigos -->
    <div class="rounded-lg border border-border/60 bg-card p-5 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="font-medium text-lg">Códigos activos</h2>
        <button @click="fetchPasscodes" class="text-xs text-primary hover:underline">Actualizar</button>
      </div>

      <div v-if="loadingList" class="text-muted-foreground text-sm">Cargando...</div>
      <div v-else-if="passcodes.length === 0" class="text-muted-foreground text-sm">No hay códigos registrados.</div>

      <ul v-else class="space-y-2">
        <li
          v-for="p in passcodes"
          :key="p.id"
          class="flex items-center justify-between p-3 rounded-md border border-border/40 bg-background"
        >
          <div>
            <span class="font-mono font-medium">{{ p.passcode }}</span>
            <span class="text-xs text-muted-foreground ml-2">{{ p.name }}</span>
            <span
              class="text-xs ml-2 px-1.5 py-0.5 rounded-full"
              :class="{
                'bg-blue-500/10 text-blue-600': p.type === 'permanent',
                'bg-yellow-500/10 text-yellow-600': p.type === 'timed',
                'bg-purple-500/10 text-purple-600': p.type === 'one_time',
              }"
            >
              {{ p.type === 'permanent' ? 'Permanente' : p.type === 'timed' ? 'Temporal' : 'Un uso' }}
            </span>
          </div>
          <button
            @click="onDelete(p.id)"
            :disabled="deletingId === p.id"
            class="text-xs text-destructive hover:underline disabled:opacity-50"
          >
            {{ deletingId === p.id ? '...' : 'Eliminar' }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import api from '~/utils/api'

definePageMeta({ layout: 'taskman' })

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  type: 'permanent' as 'permanent' | 'timed' | 'one_time',
  startDate: '',
  endDate: '',
})

const generating = ref(false)
const generatedCode = ref('')
const errorMsg = ref('')
const passcodes = ref<any[]>([])
const loadingList = ref(false)
const deletingId = ref<number | null>(null)

onMounted(() => {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  fetchPasscodes()
})

async function generate() {
  generating.value = true
  generatedCode.value = ''
  errorMsg.value = ''
  try {
    const payload: any = {
      name: form.value.name || undefined,
      type: form.value.type,
    }
    if (form.value.type === 'timed') {
      if (form.value.startDate) payload.startDate = `${new Date(form.value.startDate).getTime()}`
      if (form.value.endDate) payload.endDate = `${new Date(form.value.endDate).getTime()}`
    }
    const res = await api.post('/ttlock/generate', payload)
    if (res.data.success) {
      generatedCode.value = res.data.data.passcode
      fetchPasscodes()
    } else {
      errorMsg.value = res.data.message || 'Error desconocido'
    }
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message
  } finally {
    generating.value = false
  }
}

async function fetchPasscodes() {
  loadingList.value = true
  try {
    const res = await api.get('/ttlock/passcodes')
    if (res.data.success) {
      passcodes.value = res.data.data
    }
  } catch (err) {
    // silencio
  } finally {
    loadingList.value = false
  }
}

async function onDelete(id: number) {
  deletingId.value = id
  try {
    await api.delete(`/ttlock/passcodes/${id}`)
    passcodes.value = passcodes.value.filter(p => p.id !== id)
  } catch (err) {
    // silencio
  } finally {
    deletingId.value = null
  }
}
</script>
