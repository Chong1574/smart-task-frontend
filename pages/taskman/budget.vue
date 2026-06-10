<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Proyecciones y planeación a futuro.</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-1 border-b border-border/40 pb-px">
        <NuxtLink to="/taskman/wallet" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">
          Billetera
        </NuxtLink>
        <NuxtLink to="/taskman/budget" class="px-4 py-2 border-b-2 border-primary text-primary font-medium transition-colors">
          Presupuesto & Proyecciones
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Ingresos Fijos -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div class="flex justify-between items-start relative z-10">
            <div>
              <h3 class="font-bold text-lg mb-1">Ingresos Fijos (Nómina)</h3>
              <p class="text-3xl font-bold font-mono text-green-600">{{ formatCurrency(financeStore.totalFixedIncome) }} <span class="text-sm text-muted-foreground font-sans">/ mes</span></p>
            </div>
            <button @click="openIncomeModal" class="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" title="Añadir Ingreso Fijo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
          <div class="mt-4 space-y-2 relative z-10">
            <div v-for="inc in incomes" :key="inc.id" class="flex justify-between items-center text-sm border-t border-border/40 pt-2 mt-2 group/item relative">
              <div>
                <span>{{ inc.name }} ({{ inc.frequency === 'MONTHLY' ? 'Mensual' : inc.frequency === 'BIMONTHLY' ? 'Quincenal' : inc.frequency === 'WEEKLY' ? 'Semanal' : 'Anual' }})</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-mono text-green-600 group-hover/item:opacity-0 md:opacity-100 transition-opacity">{{ formatCurrency(inc.amount) }}</span>
                <div class="absolute right-0 flex gap-1 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                  <button @click="openEditIncome(inc)" class="text-primary hover:bg-primary/10 p-1 rounded-md" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <button @click="deleteIncomeWithConfirm(inc.id)" class="text-destructive hover:bg-destructive/10 p-1 rounded-md" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>
        </div>

        <!-- Burn Rate Fijo -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div class="flex justify-between items-start relative z-10">
            <div>
              <h3 class="font-bold text-lg mb-1">Burn Rate Fijo</h3>
              <p class="text-3xl font-bold font-mono text-red-500">{{ formatCurrency(financeStore.totalFixedExpenses) }} <span class="text-sm text-muted-foreground font-sans">/ mes</span></p>
              <p class="text-xs text-muted-foreground mt-1">Lo mínimo que gastas en suscripciones al mes.</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 relative z-10">
             <div class="flex justify-between items-center text-sm">
                <span>Total Membresías/Servicios</span>
                <span class="font-mono text-red-400">{{ formatCurrency(financeStore.totalFixedExpenses) }}</span>
             </div>
          </div>
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
        </div>
      </div>

      <!-- Proyecciones -->
      <div>
        <h2 class="text-2xl font-serif font-bold mb-4 mt-8">Flujo de Efectivo Proyectado</h2>
        <p class="text-muted-foreground mb-6">Basado en tu balance actual ({{ formatCurrency(financeStore.totalBalance) }}), sumando tus ingresos fijos y restando tus gastos fijos (burn rate) día a día.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div :class="['p-6 rounded-3xl shadow-sm text-center border border-border/40 transition-colors', projections.d7 < 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-card']">
            <h4 class="text-sm font-medium text-muted-foreground mb-2">Proyección a 7 Días</h4>
            <p class="text-4xl font-bold font-mono" :class="projections.d7 >= 0 ? 'text-green-600' : 'text-red-500'">{{ formatCurrency(projections.d7) }}</p>
          </div>
          <div :class="['p-6 rounded-3xl shadow-sm text-center border border-border/40 transition-colors', projections.d15 < 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-card']">
            <h4 class="text-sm font-medium text-muted-foreground mb-2">Proyección Quincena (15 Días)</h4>
            <p class="text-4xl font-bold font-mono" :class="projections.d15 >= 0 ? 'text-green-600' : 'text-red-500'">{{ formatCurrency(projections.d15) }}</p>
          </div>
          <div :class="['p-6 rounded-3xl shadow-sm text-center border border-border/40 transition-colors', projections.d30 < 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-gradient-to-br from-primary/5 to-transparent']">
            <h4 class="text-sm font-medium text-primary mb-2">Proyección a 30 Días</h4>
            <p class="text-4xl font-bold font-mono" :class="projections.d30 >= 0 ? 'text-green-600' : 'text-red-500'">{{ formatCurrency(projections.d30) }}</p>
          </div>
        </div>
      </div>

      <!-- Modal: Nuevo Ingreso -->
      <div v-if="showIncomeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showIncomeModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">Añadir Ingreso Fijo</h2>
          <form @submit.prevent="submitIncome" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre (Ej. Nómina, Rentas)</label>
              <input v-model="incomeForm.name" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Frecuencia</label>
                <select v-model="incomeForm.frequency" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="WEEKLY">Semanal</option>
                  <option value="MONTHLY">Mensual</option>
                  <option value="BIMONTHLY">Quincenal</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Monto por periodo</label>
                <input v-model.number="incomeForm.amount" required type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>
            <div v-if="incomeForm.frequency === 'WEEKLY' || incomeForm.frequency === 'MONTHLY'">
              <label class="block text-sm font-medium mb-1">
                Día de Pago {{ incomeForm.frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
              </label>
              <input v-model.number="incomeForm.paymentDay" type="number" min="1" :max="incomeForm.frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showIncomeModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </form>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, computed, onMounted, reactive } from 'vue'
import { useFinanceStore } from '~/stores/finance'

const financeStore = useFinanceStore()

onMounted(() => {
  financeStore.initialize()
})

const incomes = computed(() => financeStore.subscriptions.filter(s => s.type === 'INCOME'))
const projections = computed(() => financeStore.cashFlowProjections)

const showIncomeModal = ref(false)
const incomeForm = reactive({
  id: null as number | null,
  name: 'Nómina',
  frequency: 'BIMONTHLY',
  amount: 0,
  currency: 'MXN',
  paymentDay: 1 as number | null
})

const openIncomeModal = () => {
  incomeForm.id = null
  incomeForm.name = 'Nómina'
  incomeForm.frequency = 'BIMONTHLY'
  incomeForm.amount = 0
  incomeForm.paymentDay = 1
  showIncomeModal.value = true
}

const openEditIncome = (inc: any) => {
  incomeForm.id = inc.id
  incomeForm.name = inc.name
  incomeForm.frequency = inc.frequency
  incomeForm.amount = inc.amount
  incomeForm.currency = inc.currency || 'MXN'
  incomeForm.paymentDay = inc.paymentDay || 1
  showIncomeModal.value = true
}

const deleteIncomeWithConfirm = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este ingreso fijo?')) {
    await financeStore.deleteSubscription(id)
  }
}

const submitIncome = async () => {
  const data = {
    name: incomeForm.name,
    type: 'INCOME' as any,
    frequency: incomeForm.frequency as any,
    amount: incomeForm.amount,
    currency: incomeForm.currency,
    isVariable: false,
    accountId: null,
    paymentDay: incomeForm.paymentDay
  }
  
  if (incomeForm.id) {
    await financeStore.updateSubscription(incomeForm.id, data)
  } else {
    await financeStore.addSubscription(data)
  }
  
  showIncomeModal.value = false
  incomeForm.id = null
  incomeForm.name = 'Nómina'
  incomeForm.amount = 0
  incomeForm.paymentDay = 1
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}
</script>
