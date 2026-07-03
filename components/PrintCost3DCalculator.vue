<template>
  <div class="bg-card border border-border/40 rounded-3xl p-6 md:p-8 shadow-sm">
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

        <div>
          <label class="text-sm font-medium mb-1.5 block">Gramos usados</label>
          <input v-model.number="form.grams" type="number" min="0" step="0.1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Costo filamento (por kg)</label>
            <input v-model.number="form.filamentPricePerKg" type="number" min="0" step="0.01" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block">Duración (horas)</label>
            <input v-model.number="form.hours" type="number" min="0" step="0.1" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
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
          <div v-if="form.includeMaintenance" class="grid grid-cols-2 gap-3 pt-2">
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

        <p class="text-xs text-muted-foreground">
          Impresora seleccionada:
          <span v-if="selectedPrinter" class="font-medium text-foreground">{{ selectedPrinter.brand }} {{ selectedPrinter.model }} — {{ selectedPrinter.watts }} W</span>
          <span v-else class="italic">ninguna</span>
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
          <Row label="Subtotal" :value="fmt(result.subtotal)" />
          <div class="border-t border-border pt-2 mt-2">
            <Row label="Margen" :value="fmt(result.margin)" />
            <Row label="Precio final" :value="fmt(result.total)" bold />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, h } from 'vue'
import defaultPrinters from '~/data/printers-3d.json'

interface Printer { id: string; brand: string; model: string; watts: number; maintenanceCost?: number; maintenanceHours?: number; custom?: boolean }

const STORAGE_KEY = 'printcost3d:v1'

const printers = ref<Printer[]>([...defaultPrinters])
const printerSearch = ref('')
const selectedPrinter = ref<Printer | null>(null)
const showList = ref(false)
const showCustomForm = ref(false)
const customPrinter = reactive<Printer>({ id: '', brand: '', model: '', watts: 100, custom: true })

const form = reactive({
  grams: 50,
  filamentPricePerKg: 400,
  hours: 3,
  kwhPrice: 4.5,
  marginPct: 40,
  includeMaintenance: false,
  maintenanceCost: 500,
  maintenanceHours: 1000,
})

const filteredPrinters = computed(() => {
  const q = printerSearch.value.trim().toLowerCase()
  if (!q) return printers.value.slice(0, 8)
  return printers.value.filter(p =>
    `${p.brand} ${p.model}`.toLowerCase().includes(q)
  ).slice(0, 12)
})

const result = computed(() => {
  const watts = selectedPrinter.value?.watts ?? 0
  const filament = (form.grams / 1000) * form.filamentPricePerKg
  const electricity = form.hours * (watts / 1000) * form.kwhPrice
  const maintenance = form.includeMaintenance ? (form.hours / form.maintenanceHours) * form.maintenanceCost : 0
  const subtotal = filament + electricity + maintenance
  const margin = subtotal * (form.marginPct / 100)
  return { filament, electricity, maintenance, subtotal, margin, total: subtotal + margin }
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
