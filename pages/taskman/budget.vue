<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Proyecciones y planeación a futuro.</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <FinanceNavigation />

      <!-- Banner pagos urgentes (≤ 3 días) -->
      <div v-if="urgentPayments.length > 0" class="bg-destructive/10 border border-destructive/30 text-destructive-foreground rounded-2xl p-4">
        <div class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="flex-1">
            <p class="font-bold text-foreground">{{ urgentPayments.length }} pago{{ urgentPayments.length > 1 ? 's' : '' }} próximamente</p>
            <ul class="text-sm text-muted-foreground mt-1 space-y-0.5">
              <li v-for="p in urgentPayments" :key="`${p.sourceType}-${p.sourceId}`">
                <span class="font-medium text-foreground">{{ p.name }}</span> — {{ formatCurrency(p.amount) }}
                <span class="text-destructive">({{ p.daysRemaining === 0 ? 'hoy' : p.daysRemaining === 1 ? 'mañana' : `en ${p.daysRemaining} días` }})</span>
              </li>
            </ul>
          </div>
        </div>
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
                <span>{{ inc.name }} ({{ inc.frequency === 'MONTHLY' ? 'Mensual' : (inc.frequency === 'BIWEEKLY' || inc.frequency === 'SEMIMONTHLY') ? 'Quincenal' : inc.frequency === 'WEEKLY' ? 'Semanal' : inc.frequency === 'BIMONTHLY' ? 'Bimestral' : inc.frequency === 'QUARTERLY' ? 'Trimestral' : inc.frequency === 'SEMIANNUAL' ? 'Semestral' : 'Anual' }})</span>
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
              <p class="text-xs text-muted-foreground mt-1">Lo mínimo que gastas en suscripciones y deudas al mes.</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 relative z-10">
             <div class="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                <span>Total Membresías/Servicios</span>
                <span class="font-mono text-red-400">{{ formatCurrency(financeStore.totalFixedSubscriptionExpenses) }}</span>
             </div>
             <div class="flex justify-between items-center text-sm">
                <span>Pagos de Préstamos/Tarjetas</span>
                <span class="font-mono text-red-400">{{ formatCurrency(financeStore.totalFixedDebtPayments) }}</span>
             </div>
          </div>
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
        </div>
      </div>

      <!-- Algoritmo 5: Simulación de Flujo de Efectivo por Eventos Exactos (Día a Día) -->
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 mt-8">
          <div>
            <h2 class="text-2xl font-serif font-bold">Flujo de Liquidez por Eventos Exactos (30 Días)</h2>
            <p class="text-muted-foreground text-sm">Simulación día por día restando cada suscripción y deuda en su fecha exacta de cobro y sumando tus ingresos en su día real de depósito.</p>
          </div>
          <span 
            class="text-xs px-3 py-1 rounded-full font-bold border shrink-0 w-fit"
            :class="exactCashFlow.hasLiquidityValley ? 'bg-rose-500/15 text-rose-500 border-rose-500/30 animate-pulse' : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'"
          >
            {{ exactCashFlow.hasLiquidityValley ? `⚠️ Valle de liquidez: ${exactCashFlow.lowestDayLabel} (${formatCurrency(exactCashFlow.lowestBalance)})` : '✅ Sin baches de liquidez en 30 días' }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div :class="['p-6 rounded-3xl shadow-sm text-center border border-border/40 transition-colors', exactCashFlow.d7 < 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-card']">
            <h4 class="text-sm font-medium text-muted-foreground mb-1">Liquidez Exacta a 7 Días</h4>
            <p class="text-3xl sm:text-4xl font-bold font-mono" :class="exactCashFlow.d7 >= 0 ? 'text-green-600' : 'text-red-500'">{{ formatCurrency(exactCashFlow.d7) }}</p>
            <p class="text-[11px] text-muted-foreground mt-1">Promedio lineal: {{ formatCurrency(projections.d7) }}</p>
          </div>
          <div :class="['p-6 rounded-3xl shadow-sm text-center border border-border/40 transition-colors', exactCashFlow.d15 < 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-card']">
            <h4 class="text-sm font-medium text-muted-foreground mb-1">Liquidez Quincena (15 Días)</h4>
            <p class="text-3xl sm:text-4xl font-bold font-mono" :class="exactCashFlow.d15 >= 0 ? 'text-green-600' : 'text-red-500'">{{ formatCurrency(exactCashFlow.d15) }}</p>
            <p class="text-[11px] text-muted-foreground mt-1">Promedio lineal: {{ formatCurrency(projections.d15) }}</p>
          </div>
          <div :class="['p-6 rounded-3xl shadow-sm text-center border border-border/40 transition-colors', exactCashFlow.d30 < 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-gradient-to-br from-primary/5 to-transparent']">
            <h4 class="text-sm font-medium text-primary mb-1">Liquidez a 30 Días</h4>
            <p class="text-3xl sm:text-4xl font-bold font-mono" :class="exactCashFlow.d30 >= 0 ? 'text-green-600' : 'text-red-500'">{{ formatCurrency(exactCashFlow.d30) }}</p>
            <p class="text-[11px] text-muted-foreground mt-1">Promedio lineal: {{ formatCurrency(projections.d30) }}</p>
          </div>
        </div>

        <!-- Gráfica Escalonada (Step-Line Chart) de Liquidez Día por Día -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 class="font-bold text-base">Curva Escalonada de Liquidez (Próximos 30 Días)</h3>
              <p class="text-xs text-muted-foreground">Los puntos rojos indican días donde tu efectivo/débito cae por debajo de $0 antes de recibir tu siguiente ingreso.</p>
            </div>
            <div class="text-xs font-mono text-muted-foreground">
              Punto mínimo: <strong :class="exactCashFlow.lowestBalance < 0 ? 'text-rose-500' : 'text-emerald-500'">{{ formatCurrency(exactCashFlow.lowestBalance) }}</strong> ({{ exactCashFlow.lowestDayLabel }})
            </div>
          </div>
          <div class="h-64 relative">
            <ClientOnly fallback="Cargando simulación...">
              <LineChart :data="stepCashFlowChartData" :options="stepChartOptions" />
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Algoritmo 3: Simulador de Amortización Real en Deudas (Avalancha vs. Bola de Nieve) -->
      <div v-if="sortedDebts.length > 0" class="mt-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 class="text-2xl font-serif font-bold mb-1">Simulador & Estrategia de Eliminación de Deudas</h2>
            <p class="text-muted-foreground">Simulación matemática con interés compuesto mensual y efecto cascada.</p>
          </div>
          <div class="flex bg-secondary/30 p-1 rounded-xl">
            <button @click="debtStrategy = 'avalanche'" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', debtStrategy === 'avalanche' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground']">
              🏔️ Avalancha
            </button>
            <button @click="debtStrategy = 'snowball'" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', debtStrategy === 'snowball' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground']">
              ☃️ Bola de Nieve
            </button>
          </div>
        </div>

        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm space-y-6">
          <!-- Panel Interactivo de Abono Extra Mensual -->
          <div class="p-5 rounded-2xl bg-secondary/30 border border-border/40 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label class="font-bold text-sm text-foreground flex items-center gap-2">
                  🚀 Abono Extra Mensual a Deudas
                </label>
                <p class="text-xs text-muted-foreground">¿Cuánto dinero adicional a tus pagos mínimos puedes destinar cada mes?</p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-mono font-bold text-primary">+{{ formatCurrency(extraDebtPayment) }}</span>
                <span class="text-xs text-muted-foreground"> / mes</span>
              </div>
            </div>

            <input 
              v-model.number="extraDebtPayment" 
              type="range" 
              min="0" 
              max="15000" 
              step="250" 
              class="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
            />
            <div class="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>$0 (Solo mínimos)</span>
              <span>+$2,500</span>
              <span>+$5,000</span>
              <span>+$10,000</span>
              <span>+$15,000</span>
            </div>

            <!-- Resultados de la Simulación -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/30">
              <div class="bg-background/60 p-3.5 rounded-xl border border-border/30">
                <p class="text-[11px] text-muted-foreground">Fecha de Libertad Financiera</p>
                <p class="text-lg font-bold font-mono text-foreground mt-0.5">{{ debtSimulationSummary.active.freedomDateLabel }}</p>
                <p class="text-[11px] text-emerald-500 font-medium">
                  En {{ debtSimulationSummary.active.months }} meses
                  <span v-if="debtSimulationSummary.monthsSaved > 0">({{ debtSimulationSummary.monthsSaved }} meses antes vs solo mínimos)</span>
                </p>
              </div>
              <div class="bg-background/60 p-3.5 rounded-xl border border-border/30">
                <p class="text-[11px] text-muted-foreground">Intereses Totales Estimados</p>
                <p class="text-lg font-bold font-mono text-amber-500 mt-0.5">{{ formatCurrency(debtSimulationSummary.active.totalInterest) }}</p>
                <p class="text-[11px] text-muted-foreground">
                  Pago mensual total: {{ formatCurrency(debtSimulationSummary.totalMonthlyBudget) }}
                </p>
              </div>
              <div class="bg-background/60 p-3.5 rounded-xl border border-border/30">
                <p class="text-[11px] text-muted-foreground">Ahorro en Intereses</p>
                <p class="text-lg font-bold font-mono text-emerald-500 mt-0.5">{{ formatCurrency(debtSimulationSummary.interestSavedVsMinimum) }}</p>
                <p class="text-[11px] text-muted-foreground">
                  Avalancha ahorra {{ formatCurrency(Math.max(0, debtSimulationSummary.snowball.totalInterest - debtSimulationSummary.avalanche.totalInterest)) }} vs Bola de Nieve
                </p>
              </div>
            </div>
          </div>

          <div>
            <p v-if="debtStrategy === 'avalanche'" class="text-sm text-blue-600 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              🏔️ <strong>Método Avalancha:</strong> Ataca primero la deuda con mayor tasa de interés ({{ sortedDebts[0]?.name }} al {{ sortedDebts[0]?.interestRate }}%). Al liquidarla, todo su pago se suma en cascada a la siguiente.
            </p>
            <p v-else class="text-sm text-emerald-600 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              ☃️ <strong>Método Bola de Nieve:</strong> Ataca primero la deuda más pequeña ({{ sortedDebts[0]?.name }} de {{ formatCurrency(sortedDebts[0]?.absBalance || 0) }}) para lograr victorias rápidas y liberar flujo pronto.
            </p>
          </div>

          <div class="space-y-4">
            <div v-for="(debt, index) in sortedDebts" :key="debt.id" class="flex flex-col md:flex-row justify-between md:items-center p-4 rounded-2xl border border-border/40 relative overflow-hidden group">
              <div v-if="index === 0" class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
              <div class="flex-1 pl-2">
                <div class="flex items-center flex-wrap gap-2">
                  <span v-if="index === 0" class="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-md">🎯 Prioridad #1</span>
                  <span v-else class="bg-secondary text-muted-foreground text-xs font-mono px-2 py-0.5 rounded-md">Paso #{{ index + 1 }}</span>
                  <h4 class="font-bold text-lg">{{ debt.name }}</h4>
                  <span v-if="debtSimulationSummary.active.payoffMonthById[debt.id]" class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                    Se liquida en ~{{ debtSimulationSummary.active.payoffMonthById[debt.id] }} meses
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mt-1">
                  Tasa Anual: <strong>{{ debt.interestRate }}%</strong> · Pago Mínimo: <strong>{{ formatCurrency(debt.minPayment) }}</strong>
                  <span v-if="index === 0 && extraDebtPayment > 0" class="text-primary font-semibold ml-1">
                    (+{{ formatCurrency(extraDebtPayment) }} extra = {{ formatCurrency(debt.minPayment + extraDebtPayment) }}/mes)
                  </span>
                </p>
              </div>
              <div class="text-left md:text-right mt-3 md:mt-0">
                <p class="text-2xl font-mono font-bold text-red-500">{{ formatCurrency(debt.absBalance) }}</p>
                <p class="text-xs text-muted-foreground">Saldo Restante</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Nuevo Ingreso -->
      <div v-if="showIncomeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
                  <option value="BIWEEKLY">Quincenal</option>
                  <option value="SEMIMONTHLY">Quincena Fija (ej. 10 y 25)</option>
                  <option value="MONTHLY">Mensual</option>
                  <option value="BIMONTHLY">Bimestral</option>
                  <option value="QUARTERLY">Trimestral</option>
                  <option value="SEMIANNUAL">Semestral</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Monto por periodo</label>
                <input v-model.number="incomeForm.amount" required type="number" step="0.01" min="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <p v-if="incomeForm.amount > 0" class="text-xs text-green-600 mt-2 font-medium bg-green-500/10 p-2 rounded-lg">
                  💡 En tus proyecciones esto equivale a sumar {{ formatCurrency(incomeForm.frequency === 'WEEKLY' ? incomeForm.amount / 7 : (incomeForm.frequency === 'BIWEEKLY' || incomeForm.frequency === 'SEMIMONTHLY') ? incomeForm.amount / 15 : incomeForm.frequency === 'MONTHLY' ? incomeForm.amount / 30 : incomeForm.frequency === 'BIMONTHLY' ? incomeForm.amount / 60 : incomeForm.frequency === 'QUARTERLY' ? incomeForm.amount / 90 : incomeForm.frequency === 'SEMIANNUAL' ? incomeForm.amount / 180 : incomeForm.amount / 365) }} diarios.
                </p>
              </div>
            </div>
            <div v-if="['WEEKLY', 'MONTHLY', 'SEMIMONTHLY'].includes(incomeForm.frequency)">
              <div v-if="incomeForm.frequency === 'SEMIMONTHLY'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Día de Pago 1</label>
                  <input v-model.number="incomeForm.paymentDay" required type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Día de Pago 2</label>
                  <input v-model.number="incomeForm.paymentDay2" required type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                </div>
              </div>
              <div v-else>
                <label class="block text-sm font-medium mb-1">
                  Día de Pago {{ incomeForm.frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="incomeForm.paymentDay" required type="number" min="1" :max="incomeForm.frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
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
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler)

const financeStore = useFinanceStore()

onMounted(() => {
  financeStore.initialize()
})

const incomes = computed(() => financeStore.subscriptions.filter(s => s.type === 'INCOME'))
const urgentPayments = computed(() => financeStore.upcomingPayments.filter(p => p.daysRemaining <= 3))
const projections = computed(() => financeStore.cashFlowProjections)
const exactCashFlow = computed(() => financeStore.exact30DayCashFlow)

const stepCashFlowChartData = computed(() => {
  const days = exactCashFlow.value.days
  return {
    labels: days.map(d => d.label),
    datasets: [
      {
        label: 'Liquidez Proyectada',
        data: days.map(d => Math.round(d.balance)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        stepped: true,
        fill: true,
        pointRadius: days.map(d => (d.balance < 0 || d.events.length > 0 ? 4 : 1.5)),
        pointBackgroundColor: days.map(d => (d.balance < 0 ? '#ef4444' : d.inflows > 0 ? '#10b981' : d.outflows > 0 ? '#f59e0b' : '#10b981')),
        pointBorderColor: days.map(d => (d.balance < 0 ? '#ef4444' : '#10b981'))
      }
    ]
  }
})

const stepChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        afterLabel: (ctx: any) => {
          const day = exactCashFlow.value.days[ctx.dataIndex]
          if (!day || day.events.length === 0) return ''
          return day.events.map(e => `${e.isIncome ? '+' : '-'}${formatCurrency(e.amount)} (${e.name})`)
        }
      }
    }
  }
}))

const debtStrategy = ref<'avalanche' | 'snowball'>('avalanche')
const extraDebtPayment = ref<number>(1000)

const sortedDebts = computed(() => {
  const debts = financeStore.accounts.filter(acc => 
    (acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit')) && 
    Number(acc.balance) < 0
  ).map(acc => {
    const absBalance = Math.abs(Number(acc.balance))
    const minPct = Number(acc.minimum_payment_percentage || 5) / 100
    const minPayment = Number(acc.monthly_payment) > 0 
      ? Number(acc.monthly_payment) 
      : Math.max(200, absBalance * minPct)
    return {
      ...acc,
      absBalance,
      interestRate: Number(acc.interest_rate || 0),
      minPayment
    }
  });
  
  if (debtStrategy.value === 'avalanche') {
    return debts.sort((a, b) => b.interestRate - a.interestRate)
  } else {
    return debts.sort((a, b) => a.absBalance - b.absBalance)
  }
})

function simulateDebtPayoff(strategy: 'avalanche' | 'snowball', extraMonthly: number) {
  const rawDebts = financeStore.accounts.filter(acc => 
    (acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit')) && 
    Number(acc.balance) < 0
  ).map(acc => {
    const bal = Math.abs(Number(acc.balance))
    const minPct = Number(acc.minimum_payment_percentage || 5) / 100
    const minPay = Number(acc.monthly_payment) > 0 ? Number(acc.monthly_payment) : Math.max(200, bal * minPct)
    return {
      id: acc.id,
      balance: bal,
      rate: Number(acc.interest_rate || 0) / 100 / 12,
      minPay
    }
  })

  if (rawDebts.length === 0) {
    return { months: 0, totalInterest: 0, freedomDateLabel: 'Sin deudas', payoffMonthById: {} as Record<number, number> }
  }

  if (strategy === 'avalanche') {
    rawDebts.sort((a, b) => b.rate - a.rate)
  } else {
    rawDebts.sort((a, b) => a.balance - b.balance)
  }

  const baseMinPool = rawDebts.reduce((s, d) => s + d.minPay, 0)
  const totalMonthlyBudget = baseMinPool + extraMonthly

  let months = 0
  let totalInterest = 0
  const payoffMonthById: Record<number, number> = {}

  while (rawDebts.some(d => d.balance > 0.5) && months < 360) {
    months++
    let availableBudget = totalMonthlyBudget

    // 1. Capitalizar interés mensual y pagar mínimos primero
    for (const d of rawDebts) {
      if (d.balance <= 0.5) continue
      const interest = d.balance * d.rate
      totalInterest += interest
      d.balance += interest

      const pay = Math.min(d.balance, d.minPay, availableBudget)
      d.balance -= pay
      availableBudget -= pay
      if (d.balance <= 0.5 && !payoffMonthById[d.id]) {
        payoffMonthById[d.id] = months
      }
    }

    // 2. Efecto cascada (Avalancha/Bola de Nieve): destinar todo el excedente a la deuda prioritaria activa
    for (const d of rawDebts) {
      if (d.balance <= 0.5 || availableBudget <= 0) continue
      const extraPay = Math.min(d.balance, availableBudget)
      d.balance -= extraPay
      availableBudget -= extraPay
      if (d.balance <= 0.5 && !payoffMonthById[d.id]) {
        payoffMonthById[d.id] = months
      }
    }
  }

  const now = new Date()
  const freedomDate = new Date(now.getFullYear(), now.getMonth() + months, 1)
  const freedomDateLabel = freedomDate.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })

  return {
    months,
    totalInterest,
    freedomDateLabel: freedomDateLabel.charAt(0).toUpperCase() + freedomDateLabel.slice(1),
    payoffMonthById
  }
}

const debtSimulationSummary = computed(() => {
  const avalanche = simulateDebtPayoff('avalanche', extraDebtPayment.value)
  const snowball = simulateDebtPayoff('snowball', extraDebtPayment.value)
  const baselineMinOnly = simulateDebtPayoff(debtStrategy.value, 0)

  const active = debtStrategy.value === 'avalanche' ? avalanche : snowball
  const baseMinPool = sortedDebts.value.reduce((s, d) => s + d.minPayment, 0)

  return {
    avalanche,
    snowball,
    active,
    totalMonthlyBudget: baseMinPool + extraDebtPayment.value,
    monthsSaved: Math.max(0, baselineMinOnly.months - active.months),
    interestSavedVsMinimum: Math.max(0, baselineMinOnly.totalInterest - active.totalInterest)
  }
})

const showIncomeModal = ref(false)
const incomeForm = reactive({
  id: null as number | null,
  name: 'Nómina',
  frequency: 'BIWEEKLY',
  amount: 0,
  currency: 'MXN',
  paymentDay: 1 as number | null,
  paymentDay2: 15 as number | null
})

const openIncomeModal = () => {
  incomeForm.id = null
  incomeForm.name = 'Nómina'
  incomeForm.frequency = 'BIWEEKLY'
  incomeForm.amount = 0
  incomeForm.paymentDay = 1
  incomeForm.paymentDay2 = 15
  showIncomeModal.value = true
}

const openEditIncome = (inc: any) => {
  incomeForm.id = inc.id
  incomeForm.name = inc.name
  incomeForm.frequency = inc.frequency
  incomeForm.amount = inc.amount
  incomeForm.currency = inc.currency || 'MXN'
  if (inc.frequency === 'SEMIMONTHLY' && inc.paymentDay > 100) {
    incomeForm.paymentDay = Math.floor(inc.paymentDay / 100)
    incomeForm.paymentDay2 = inc.paymentDay % 100
  } else {
    incomeForm.paymentDay = inc.paymentDay || 1
    incomeForm.paymentDay2 = 15
  }
  showIncomeModal.value = true
}

const deleteIncomeWithConfirm = async (id: number) => {
  const confirmStore = useConfirmStore()
  if (await confirmStore.ask({
    title: 'Eliminar ingreso',
    message: '¿Estás seguro de que deseas eliminar este ingreso fijo?',
    confirmLabel: 'Eliminar',
    destructive: true
  })) {
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
    paymentDay: incomeForm.frequency === 'SEMIMONTHLY' 
      ? ((incomeForm.paymentDay || 1) * 100 + (incomeForm.paymentDay2 || 15)) 
      : incomeForm.paymentDay
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
