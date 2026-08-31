<template>
  <div class="bg-card border border-border/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Inputs -->
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium mb-1.5 block">Impresora</label>
          <div class="flex gap-2">
            <input
              v-model="printerSearch"
              type="text"
              placeholder="Buscar (ej. Bambu A1, Ender 3)"
              class="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @focus="showList = true"
            />
            <button
              type="button"
              @click="showCustomForm = !showCustomForm"
              class="h-10 px-3 rounded-md border border-input text-sm hover:bg-secondary transition-colors whitespace-nowrap"
            >
              {{ showCustomForm ? 'Cancelar' : '+ Otra' }}
            </button>
          </div>

          <div v-if="showList && filteredPrinters.length" class="mt-2 border border-border rounded-md bg-popover max-h-56 overflow-y-auto">
            <button
              v-for="p in filteredPrinters"
              :key="p.id"
              type="button"
              class="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex justify-between items-center gap-2"
              :class="selectedPrinter?.id === p.id ? 'bg-primary/10 text-primary' : ''"
              @click="selectPrinter(p)"
            >
              <span><span class="font-medium">{{ p.brand }}</span> {{ p.model }}</span>
              <span class="text-xs text-muted-foreground">{{ p.watts }} W</span>
            </button>
          </div>

          <div v-if="showCustomForm" class="mt-3 p-3 border border-dashed border-border rounded-md space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <input v-model="customPrinter.brand" placeholder="Marca" class="h-9 rounded-md border border-input bg-background px-2 text-sm" />
              <input v-model="customPrinter.model" placeholder="Modelo" class="h-9 rounded-md border border-input bg-background px-2 text-sm" />
            </div>
            <input v-model.number="customPrinter.watts" type="number" min="1" placeholder="Consumo promedio (W)" class="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" />
            <button type="button" @click="saveCustomPrinter" class="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              Guardar impresora
            </button>
          </div>
        </div>

        <!-- Importar desde MakerWorld / n8n -->
        <div class="border border-border/60 rounded-xl p-4 bg-secondary/10 space-y-3">
          <label class="text-sm font-medium mb-1.5 block">Importar de MakerWorld (vía n8n)</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input v-model="n8nLink" type="url" placeholder="https://makerworld.com/..." class="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <button type="button" @click="fetchFromN8n" :disabled="isFetching" class="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
              {{ isFetching ? 'Cargando...' : 'Obtener' }}
            </button>
          </div>
          <p v-if="n8nError" class="text-xs text-red-500">{{ n8nError }}</p>
          <p v-if="n8nSuccess" class="text-xs text-green-500">¡Datos importados correctamente!</p>

          <!-- Picker de perfiles cuando MakerWorld devuelve varios -->
          <div v-if="profiles.length > 1" class="pt-1 space-y-1.5">
            <p class="text-xs font-medium text-muted-foreground">Este modelo tiene {{ profiles.length }} perfiles de impresión. Elige uno:</p>
            <div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              <label
                v-for="p in profiles"
                :key="p.id"
                class="flex items-start gap-2 p-2 rounded-md border border-border/60 hover:bg-secondary/40 cursor-pointer transition-colors"
                :class="selectedProfileId === p.id ? 'bg-primary/10 border-primary/50' : ''"
              >
                <input type="radio" :value="p.id" v-model="selectedProfileId" @change="applyProfile(p)" class="mt-1 accent-primary" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium truncate">
                    {{ p.title }}
                    <span v-if="p.isDefault" class="ml-1 text-[10px] text-primary">(default)</span>
                  </p>
                  <p v-if="p.name" class="text-[11px] text-muted-foreground truncate">{{ p.name }}</p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ p.grams }} g · {{ formatHours(p.hours) }}
                    <span v-if="p.needAms || p.colorCount > 1" class="ml-1 text-amber-600 dark:text-amber-500">· AMS ({{ p.colorCount }} colores)</span>
                    <span v-if="p.plateCount > 1"> · {{ p.plateCount }} placas</span>
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Gramos por impresión</label>
            <input v-model.number="form.grams" type="number" min="0" step="0.1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block">Horas por impresión</label>
            <input v-model.number="form.hours" type="number" min="0" step="0.1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block">Impresiones</label>
            <input v-model.number="form.quantity" type="number" min="1" step="1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <p class="text-xs text-muted-foreground -mt-2">
          MakerWorld reporta el peso y tiempo total del plato; si el plato trae varias piezas, ajusta manualmente los gramos/horas para calcular el precio por pieza.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Costo filamento (por kg)</label>
            <input v-model.number="form.filamentPricePerKg" type="number" min="0" step="0.01" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block">Desperdicio (%)</label>
            <input v-model.number="form.wastePct" type="number" min="0" step="1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Costo luz (por kWh)</label>
            <input v-model.number="form.kwhPrice" type="number" min="0" step="0.01" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block">Margen de ganancia (%)</label>
            <input v-model.number="form.marginPct" type="number" min="0" step="1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <!-- Mantenimiento -->
        <div class="border border-border/60 rounded-xl p-4 bg-secondary/10 space-y-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="form.includeMaintenance" class="rounded border-input text-primary focus:ring-primary w-4 h-4" />
            <span class="text-sm font-medium">Incluir desgaste/mantenimiento</span>
          </label>
          <div v-if="form.includeMaintenance" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label class="text-xs font-medium mb-1.5 block text-muted-foreground">Costo refacciones ($)</label>
              <input v-model.number="form.maintenanceCost" type="number" min="0" step="1" class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium mb-1.5 block text-muted-foreground">Ciclo (horas)</label>
              <input v-model.number="form.maintenanceHours" type="number" min="1" step="1" class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
            </div>
          </div>
        </div>

        <!-- Depreciación -->
        <div class="border border-border/60 rounded-xl p-4 bg-secondary/10 space-y-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="form.includeDepreciation" class="rounded border-input text-primary focus:ring-primary w-4 h-4" />
            <span class="text-sm font-medium">Incluir depreciación de la impresora</span>
          </label>
          <div v-if="form.includeDepreciation" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label class="text-xs font-medium mb-1.5 block text-muted-foreground">Costo impresora ($)</label>
              <input v-model.number="form.printerCost" type="number" min="0" step="1" class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
            </div>
            <div>
              <label class="text-xs font-medium mb-1.5 block text-muted-foreground">Vida útil (horas)</label>
              <input v-model.number="form.printerLifeHours" type="number" min="1" step="1" class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
            </div>
          </div>
        </div>

        <p class="text-xs text-muted-foreground">
          Impresora seleccionada:
          <span v-if="selectedPrinter" class="font-medium text-foreground">{{ selectedPrinter.brand }} {{ selectedPrinter.model }} — {{ selectedPrinter.watts }} W</span>
          <span v-else class="italic">ninguna</span>
        </p>
        <p v-if="!selectedPrinter" class="text-xs text-amber-600 dark:text-amber-500 font-medium">
          Selecciona una impresora para incluir el costo de electricidad.
        </p>
      </div>

      <!-- Resultado -->
      <div class="bg-secondary/30 rounded-2xl p-6 flex flex-col justify-center">
        <p class="text-xs uppercase tracking-wide text-muted-foreground mb-2">Costo total sugerido</p>
        <p class="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
          {{ fmt(result.total) }}
        </p>
        <div class="space-y-2 text-sm">
          <Row label="Filamento" :value="fmt(result.filament)" />
          <Row label="Electricidad" :value="fmt(result.electricity)" />
          <Row v-if="form.includeMaintenance" label="Mantenimiento" :value="fmt(result.maintenance)" />
          <Row v-if="form.includeDepreciation" label="Depreciación" :value="fmt(result.depreciation)" />
          <Row label="Subtotal" :value="fmt(result.subtotal)" />
          <div class="border-t border-border pt-2 mt-2">
            <Row label="Margen" :value="fmt(result.margin)" />
            <Row label="Costo Total" :value="fmt(result.total)" bold />
            <Row v-if="form.quantity > 1" label="Costo por impresión" :value="fmt(result.perPiece)" class="text-primary mt-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, h } from 'vue'
import defaultPrinters from '~/data/printers-3d.json'
import api from '~/utils/api'

interface Printer { id: string; brand: string; model: string; watts: number; maintenanceCost?: number; maintenanceHours?: number; custom?: boolean }
interface MakerworldProfile {
  id: string; title: string; name: string; grams: number; hours: number;
  plateCount: number; isDefault: boolean; needAms: boolean; colorCount: number; cover: string | null;
}

const STORAGE_KEY = 'printcost3d:v1'
const MAKERWORLD_URL_RE = /^https?:\/\/[^\s]*makerworld\.com\/[^\s]*\/models\/\d+/i

const printers = ref<Printer[]>([...defaultPrinters])
const printerSearch = ref('')
const selectedPrinter = ref<Printer | null>(null)
const showList = ref(false)
const showCustomForm = ref(false)
const customPrinter = reactive<Printer>({ id: '', brand: '', model: '', watts: 100, custom: true })

const n8nLink = ref('')
const isFetching = ref(false)
const n8nError = ref('')
const n8nSuccess = ref(false)
const profiles = ref<MakerworldProfile[]>([])
const selectedProfileId = ref<string>('')
let successTimer: ReturnType<typeof setTimeout> | null = null

const form = reactive({
  grams: 50,
  wastePct: 5,
  filamentPricePerKg: 400,
  hours: 3,
  quantity: 1,
  kwhPrice: 4.5,
  marginPct: 40,
  includeMaintenance: false,
  maintenanceCost: 500,
  maintenanceHours: 1000,
  includeDepreciation: false,
  printerCost: 8000,
  printerLifeHours: 5000,
})

const filteredPrinters = computed(() => {
  const q = printerSearch.value.trim().toLowerCase()
  if (!q) return printers.value.slice(0, 8)
  return printers.value.filter(p =>
    `${p.brand} ${p.model}`.toLowerCase().includes(q)
  ).slice(0, 12)
})

const result = computed(() => {
  const qty = Math.max(1, form.quantity || 1)
  const totalGrams = form.grams * qty
  const totalHours = form.hours * qty

  const watts = selectedPrinter.value?.watts ?? 0
  const effectiveGrams = totalGrams * (1 + (form.wastePct || 0) / 100)
  const filament = (effectiveGrams / 1000) * form.filamentPricePerKg
  const electricity = totalHours * (watts / 1000) * form.kwhPrice
  const maintenance = form.includeMaintenance && form.maintenanceHours > 0
    ? (totalHours / form.maintenanceHours) * form.maintenanceCost
    : 0
  const depreciation = form.includeDepreciation && form.printerLifeHours > 0
    ? (totalHours / form.printerLifeHours) * form.printerCost
    : 0
  const subtotal = filament + electricity + maintenance + depreciation
  const margin = subtotal * (form.marginPct / 100)
  const total = subtotal + margin
  return { filament, electricity, maintenance, depreciation, subtotal, margin, total, perPiece: total / qty }
})

async function fetchFromN8n() {
  const link = n8nLink.value.trim()
  if (!link) return
  if (!MAKERWORLD_URL_RE.test(link)) {
    n8nError.value = 'URL inválida. Debe ser https://makerworld.com/…/models/<id>'
    return
  }
  if (successTimer) { clearTimeout(successTimer); successTimer = null }
  isFetching.value = true
  n8nError.value = ''
  n8nSuccess.value = false
  profiles.value = []
  selectedProfileId.value = ''
  try {
    const { data } = await api.post<{ profiles: MakerworldProfile[] }>('/print-cost/makerworld', { url: link })
    const list = Array.isArray(data?.profiles) ? data.profiles : []
    if (!list.length) throw new Error('El modelo no publica gramos/horas.')
    profiles.value = list
    // Auto-selecciona el default (o el primero) y aplica sus valores.
    const pick = list.find(p => p.isDefault) || list[0]
    selectedProfileId.value = pick.id
    applyProfile(pick)
  } catch (err: any) {
    n8nError.value = err?.response?.data?.error || err?.message || 'Error desconocido'
  } finally {
    isFetching.value = false
  }
}

function applyProfile(p: MakerworldProfile) {
  form.grams = p.grams
  form.hours = p.hours
  n8nSuccess.value = true
  if (successTimer) clearTimeout(successTimer)
  successTimer = setTimeout(() => { n8nSuccess.value = false; successTimer = null }, 3000)
}

// "0.463" → "27 min 47 s" para que el label sea legible al lado del picker.
function formatHours(h: number): string {
  if (!Number.isFinite(h) || h <= 0) return '0 min'
  const totalMin = h * 60
  const min = Math.floor(totalMin)
  const sec = Math.round((totalMin - min) * 60)
  if (h >= 1) return `${h.toFixed(2)} h`
  return sec ? `${min} min ${sec} s` : `${min} min`
}

onBeforeUnmount(() => {
  if (successTimer) clearTimeout(successTimer)
})

function selectPrinter(p: Printer) {
  selectedPrinter.value = p
  printerSearch.value = `${p.brand} ${p.model}`
  if (p.maintenanceCost) form.maintenanceCost = p.maintenanceCost
  if (p.maintenanceHours) form.maintenanceHours = p.maintenanceHours
  showList.value = false
  persist()
}

function saveCustomPrinter() {
  if (!customPrinter.brand || !customPrinter.model || !customPrinter.watts) return
  const p: Printer = {
    id: `custom-${Date.now()}`,
    brand: customPrinter.brand,
    model: customPrinter.model,
    watts: customPrinter.watts,
    custom: true,
  }
  printers.value.unshift(p)
  selectPrinter(p)
  showCustomForm.value = false
  customPrinter.brand = ''
  customPrinter.model = ''
  customPrinter.watts = 100
  persist()
}

function fmt(v: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v || 0)
}

function persist() {
  if (typeof window === 'undefined') return
  const custom = printers.value.filter(p => p.custom)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    custom,
    selectedId: selectedPrinter.value?.id ?? null,
    form,
  }))
}

watch(form, persist, { deep: true })

onMounted(() => {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const data = JSON.parse(raw)
    if (Array.isArray(data.custom)) printers.value.unshift(...data.custom)
    if (data.selectedId) {
      const p = printers.value.find(x => x.id === data.selectedId)
      if (p) { selectedPrinter.value = p; printerSearch.value = `${p.brand} ${p.model}` }
    }
    if (data.form) Object.assign(form, data.form)
  } catch { /* ponytail: bad JSON = fresh start */ }
})

const Row = (props: { label: string; value: string; bold?: boolean }) =>
  h('div', { class: 'flex justify-between items-center' }, [
    h('span', { class: 'text-muted-foreground' }, props.label),
    h('span', { class: props.bold ? 'font-bold text-lg' : 'font-medium' }, props.value),
  ])
</script>
