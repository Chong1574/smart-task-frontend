<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
    <div class="flex items-baseline justify-between">
      <div>
        <h1 class="text-3xl font-serif font-bold">Auditoría</h1>
        <p class="text-muted-foreground">Últimas acciones sensibles (login, register, password_reset, etc.)</p>
      </div>
      <button @click="load" :disabled="loading" class="text-sm text-primary hover:underline disabled:opacity-50">
        {{ loading ? 'Cargando...' : 'Recargar' }}
      </button>
    </div>

    <div v-if="error" class="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm">
      {{ error }}
    </div>

    <div class="bg-card rounded-2xl border border-border/40 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th class="px-4 py-3">Fecha</th>
            <th class="px-4 py-3">User ID</th>
            <th class="px-4 py-3">Acción</th>
            <th class="px-4 py-3">IP</th>
            <th class="px-4 py-3">User-Agent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && rows.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">Sin registros.</td>
          </tr>
          <tr v-for="r in rows" :key="r.id" class="border-t border-border/30 hover:bg-secondary/20">
            <td class="px-4 py-3 font-mono text-xs whitespace-nowrap">{{ formatDate(r.createdAt) }}</td>
            <td class="px-4 py-3 font-mono">{{ r.userId ?? '—' }}</td>
            <td class="px-4 py-3"><span class="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{{ r.action }}</span></td>
            <td class="px-4 py-3 font-mono text-xs">{{ r.ip || '—' }}</td>
            <td class="px-4 py-3 text-xs text-muted-foreground truncate max-w-xs" :title="r.userAgent">{{ r.userAgent || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <span>Mostrando {{ rows.length }} de {{ total }}</span>
      <div class="flex gap-2">
        <button @click="prev" :disabled="offset === 0 || loading" class="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary/40 disabled:opacity-50">Anterior</button>
        <button @click="next" :disabled="offset + limit >= total || loading" class="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary/40 disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '~/utils/api'

definePageMeta({ layout: 'taskman' })

interface AuditRow {
  id: number
  userId: number | null
  action: string
  ip: string | null
  userAgent: string | null
  metadata: string | null
  createdAt: string
}

const rows = ref<AuditRow[]>([])
const total = ref(0)
const limit = ref(50)
const offset = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })
  } catch {
    return iso
  }
}

const load = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get(`/admin/audit?limit=${limit.value}&offset=${offset.value}`)
    if (res.data?.success) {
      rows.value = res.data.data
      total.value = res.data.total
    } else {
      error.value = 'Respuesta inesperada del servidor'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Error cargando auditoría'
  } finally {
    loading.value = false
  }
}

const next = () => { offset.value += limit.value; load() }
const prev = () => { offset.value = Math.max(0, offset.value - limit.value); load() }

onMounted(load)
</script>
