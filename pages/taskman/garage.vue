<template>
  <div>
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Garage</h1>
          <p class="text-muted-foreground">Control de combustible y mantenimiento de tus vehículos.</p>
        </div>
        <div class="flex gap-2">
          <button @click="openNewVehicle" class="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
            Nuevo Vehículo
          </button>
          <button @click="showLogModal = true" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Registrar Carga
          </button>
        </div>
      </div>

      <div v-if="financeStore.vehicles.length === 0" class="p-8 text-center text-muted-foreground">
        No tienes vehículos registrados.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="vehicle in financeStore.vehicles" :key="vehicle.id" class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-xl">{{ vehicle.name }}</h3>
              <p class="text-muted-foreground text-sm">{{ vehicle.plate || 'Sin placa' }} - {{ vehicle.model || '' }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <button @click="openEditVehicle(vehicle)" class="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <div class="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="bg-secondary/40 p-3 rounded-xl flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Último Odom.</span>
              <span class="font-mono font-bold">{{ getLastOdometer(vehicle) }} km</span>
            </div>
            <div class="bg-secondary/40 p-3 rounded-xl flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Rendimiento (km/L)</span>
              <span class="font-mono font-bold text-green-500">{{ calculateEfficiency(vehicle) }}</span>
            </div>
            <div v-if="vehicle.tankCapacity" class="bg-secondary/40 p-3 rounded-xl flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Capacidad Tanque</span>
              <span class="font-mono font-bold">{{ vehicle.tankCapacity }} L</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Vehículo -->
    <div v-if="showVehicleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-blue-500/10">
        <button @click="showVehicleModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">{{ isEditingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h2>
        <form @submit.prevent="submitVehicle" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre (ej. Mi Coche)</label>
            <input v-model="newVehicle.name" required type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Nombre identificador" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Marca</label>
              <input v-model="newVehicle.make" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Toyota, Ford..." />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Modelo</label>
              <input v-model="newVehicle.model" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Corolla..." />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Año</label>
              <input v-model="newVehicle.year" type="number" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="2020" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Placas</label>
              <input v-model="newVehicle.plate" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="ABC-123" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Capacidad de Tanque (L) (Opcional)</label>
            <input v-model="newVehicle.tankCapacity" type="number" step="0.1" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="45.0" />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white rounded-xl py-3 font-bold mt-6 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            {{ isEditingVehicle ? 'Guardar Cambios' : 'Guardar Vehículo' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Carga Combustible -->
    <div v-if="showLogModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-primary/10">
        <button @click="showLogModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">Registrar Carga</h2>
        
        <div v-if="financeStore.vehicles.length === 0" class="text-center text-muted-foreground mb-4">
          Primero debes registrar un vehículo.
        </div>
        
        <form v-else @submit.prevent="submitFuelLog" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Vehículo</label>
            <select v-model="newLog.vehicleId" required class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="" disabled>Selecciona un vehículo</option>
              <option v-for="v in financeStore.vehicles" :key="v.id" :value="v.id">{{ v.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Fecha</label>
            <input v-model="newLog.date" required type="date" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Odómetro actual (km)</label>
            <input v-model="newLog.odometer" required type="number" step="0.1" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Litros</label>
              <input v-model="newLog.liters" @input="updateTotal" required type="number" step="0.01" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Precio x L</label>
              <input v-model="newLog.pricePerLiter" @input="updateTotal" required type="number" step="0.01" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Costo Total ($)</label>
            <input v-model="newLog.totalCost" required type="number" step="0.01" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descontar de Cuenta (Opcional)</label>
            <select v-model="newLog.accountId" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="">No registrar gasto</option>
              <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">{{ acc.name }} (${{ acc.balance }})</option>
            </select>
          </div>
          <label class="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-secondary/20 transition-colors mt-2">
            <input v-model="newLog.isFullTank" type="checkbox" class="w-5 h-5 rounded text-primary focus:ring-primary" />
            <span class="font-medium text-sm">Tanque lleno</span>
          </label>

          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Guardar Registro
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFinanceStore } from '~/stores/finance'

const financeStore = useFinanceStore()

const showVehicleModal = ref(false)
const showLogModal = ref(false)
const isEditingVehicle = ref(false)
const editingVehicleId = ref<number | null>(null)

const newVehicle = ref({
  name: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  tankCapacity: null as number | null
})

const openNewVehicle = () => {
  isEditingVehicle.value = false
  editingVehicleId.value = null
  newVehicle.value = { name: '', make: '', model: '', year: new Date().getFullYear(), plate: '', tankCapacity: null }
  showVehicleModal.value = true
}

const openEditVehicle = (vehicle: any) => {
  isEditingVehicle.value = true
  editingVehicleId.value = vehicle.id
  newVehicle.value = {
    name: vehicle.name,
    make: vehicle.make || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    plate: vehicle.plate || '',
    tankCapacity: vehicle.tankCapacity || null
  }
  showVehicleModal.value = true
}

const newLog = ref({
  vehicleId: '',
  accountId: '',
  date: new Date().toISOString().split('T')[0],
  odometer: 0,
  liters: 0,
  pricePerLiter: 0,
  totalCost: 0,
  isFullTank: true
})

const submitVehicle = async () => {
  if (isEditingVehicle.value && editingVehicleId.value) {
    await financeStore.updateVehicle(editingVehicleId.value, { ...newVehicle.value })
  } else {
    await financeStore.addVehicle({ ...newVehicle.value })
  }
  showVehicleModal.value = false
  newVehicle.value = { name: '', make: '', model: '', year: new Date().getFullYear(), plate: '', tankCapacity: null }
}

const updateTotal = () => {
  if (newLog.value.liters && newLog.value.pricePerLiter) {
    newLog.value.totalCost = parseFloat((newLog.value.liters * newLog.value.pricePerLiter).toFixed(2))
  }
}

const submitFuelLog = async () => {
  const selectedVehicle = financeStore.vehicles.find(v => v.id === newLog.value.vehicleId)
  if (selectedVehicle && selectedVehicle.tankCapacity && newLog.value.liters > selectedVehicle.tankCapacity) {
    const confirmStore = useConfirmStore()
    const ok = await confirmStore.ask({
      title: 'Capacidad excedida',
      message: `Has registrado ${newLog.value.liters}L, pero la capacidad del tanque es de solo ${selectedVehicle.tankCapacity}L. ¿Deseas continuar?`,
      confirmLabel: 'Continuar',
      destructive: true
    })
    if (!ok) {
      return
    }
  }

  const success = await financeStore.addFuelLog({ ...newLog.value })
  if (success) {
    showLogModal.value = false
    newLog.value = {
      vehicleId: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      odometer: 0,
      liters: 0,
      pricePerLiter: 0,
      totalCost: 0,
      isFullTank: true
    }
  }
}

const route = useRoute()

onMounted(async () => {
  await financeStore.initialize()
  if (route.query.action === 'new_fuel') {
    showLogModal.value = true
  }
})

const getLastOdometer = (vehicle: any) => {
  if (!vehicle.fuelLogs || vehicle.fuelLogs.length === 0) return 0
  const sortedLogs = [...vehicle.fuelLogs].sort((a, b) => b.odometer - a.odometer)
  return sortedLogs[0].odometer
}

const calculateEfficiency = (vehicle: any) => {
  if (!vehicle.fuelLogs || vehicle.fuelLogs.length < 2) return 'N/A'
  
  const sortedLogs = [...vehicle.fuelLogs].sort((a, b) => a.odometer - b.odometer)
  const lastLog = sortedLogs[sortedLogs.length - 1]
  const prevLog = sortedLogs[sortedLogs.length - 2]
  
  const distance = lastLog.odometer - prevLog.odometer
  const liters = lastLog.liters
  
  if (liters === 0) return 'N/A'
  return (distance / liters).toFixed(2)
}
</script>

