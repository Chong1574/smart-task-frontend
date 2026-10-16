<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Dashboard analítico y educación financiera.</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <FinanceNavigation />

      <!-- Skeleton mientras carga -->
      <div v-if="financeStore.loading && !financeStore.accounts.length" class="space-y-6">
        <Skeleton class="h-40 w-full" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton class="h-64 w-full" />
          <Skeleton class="h-64 w-full" />
        </div>
        <Skeleton class="h-48 w-full" />
      </div>

      <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjetas de Salud Financiera -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm md:col-span-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 class="font-bold text-xl flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Activity class="w-5 h-5" />
                </div>
                Salud & Diagnóstico Financiero
              </h3>
              <p class="text-xs text-muted-foreground mt-0.5">Indicadores clave de estabilidad, endeudamiento y capacidad de respuesta.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <!-- Regla 50/30/20 -->
            <div class="p-5 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col justify-between space-y-4 hover:border-border transition-all">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <PieChart class="w-4 h-4 text-primary" />
                    <h4 class="font-bold text-sm">Regla 50/30/20</h4>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full border font-semibold" :class="rule503020Metrics.statusClass">
                    {{ rule503020Metrics.badge }}
                  </span>
                </div>

                <div class="mt-3">
                  <div class="flex justify-between items-baseline mb-1">
                    <span class="text-xs text-muted-foreground font-medium">Gastos Fijos / Ingresos</span>
                    <span class="text-lg font-bold font-mono">{{ rule503020Metrics.percentage }}%</span>
                  </div>
                  
                  <!-- Barra visual con marcador de meta ideal a 50% -->
                  <div class="relative pt-1 pb-1">
                    <div class="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/20">
                      <div 
                        class="h-full rounded-full transition-all duration-700"
                        :class="rule503020Metrics.barColor"
                        :style="{ width: `${rule503020Metrics.barWidth}%` }"
                      ></div>
                    </div>
                    <!-- Marcador 50% ideal -->
                    <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/40 pointer-events-none" title="Meta ideal: ≤ 50%"></div>
                  </div>

                  <div class="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                    <span>Fijo: {{ formatCurrency(rule503020Metrics.fixed) }}</span>
                    <span class="text-foreground/80 font-medium">Meta: ≤ 50%</span>
                    <span>Ingreso: {{ formatCurrency(rule503020Metrics.income) }}</span>
                  </div>
                </div>
              </div>

              <p class="text-xs text-muted-foreground bg-background/50 p-2.5 rounded-xl border border-border/30">
                {{ rule503020Metrics.message }}
              </p>
            </div>

            <!-- Nivel de Endeudamiento -->
            <div class="p-5 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col justify-between space-y-4 hover:border-border transition-all">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <CreditCard class="w-4 h-4 text-purple-500" />
                    <h4 class="font-bold text-sm">Nivel de Endeudamiento</h4>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full border font-semibold" :class="debtMetrics.statusClass">
                    {{ debtMetrics.badge }}
                  </span>
                </div>

                <div class="mt-3">
                  <div class="flex justify-between items-baseline mb-1">
                    <span class="text-xs text-muted-foreground font-medium">Deuda Total</span>
                    <span class="text-lg font-bold font-mono">{{ formatCurrency(debtMetrics.debt) }}</span>
                  </div>

                  <!-- Barra visual de endeudamiento -->
                  <div class="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/20">
                    <div 
                      class="h-full rounded-full transition-all duration-700"
                      :class="debtMetrics.barColor"
                      :style="{ width: `${debtMetrics.barWidth}%` }"
                    ></div>
                  </div>

                  <div class="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                    <span>0 meses</span>
                    <span class="text-foreground/80 font-medium">Carga: {{ debtMetrics.monthsToPay }} meses</span>
                    <span>≥ 3 meses</span>
                  </div>
                </div>
              </div>

              <p class="text-xs text-muted-foreground bg-background/50 p-2.5 rounded-xl border border-border/30">
                {{ debtMetrics.message }}
              </p>
            </div>

            <!-- Fondo de Emergencia -->
            <div class="p-5 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col justify-between space-y-4 hover:border-border transition-all">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <PiggyBank class="w-4 h-4 text-amber-500" />
                    <h4 class="font-bold text-sm">Fondo de Emergencia</h4>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full border font-semibold" :class="emergencyFundMetrics.statusClass">
                    {{ emergencyFundMetrics.badge }}
                  </span>
                </div>

                <div class="mt-3">
                  <div class="flex justify-between items-baseline mb-1">
                    <span class="text-xs text-muted-foreground font-medium">Ahorros Líquidos</span>
                    <span class="text-lg font-bold font-mono">{{ formatCurrency(emergencyFundMetrics.savings) }}</span>
                  </div>

                  <!-- Barra visual de fondo de emergencia hacia meta de 3 meses -->
                  <div class="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/20">
                    <div 
                      class="h-full rounded-full transition-all duration-700"
                      :class="emergencyFundMetrics.barColor"
                      :style="{ width: `${emergencyFundMetrics.targetProgress}%` }"
                    ></div>
                  </div>

                  <div class="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                    <span>Cobertura: {{ emergencyFundMetrics.monthsCovered }} meses</span>
                    <span>Meta 3m: {{ formatCurrency(emergencyFundMetrics.target3Months) }}</span>
                  </div>
                </div>
              </div>

              <p class="text-xs text-muted-foreground bg-background/50 p-2.5 rounded-xl border border-border/30">
                {{ emergencyFundMetrics.message }}
              </p>
            </div>

          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Gráfica de Donas: Gastos por Categoría -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm">
          <h3 class="font-bold text-lg mb-4">Gastos por Categoría (Este Mes)</h3>
          <div class="h-64 relative flex items-center justify-center">
            <ClientOnly fallback="Cargando gráfica...">
              <Doughnut v-if="hasCategoryData" :data="categoryChartData" :options="doughnutOptions" />
              <div v-else class="text-muted-foreground text-sm text-center">No hay suficientes gastos registrados este mes para graficar.</div>
            </ClientOnly>
          </div>
        </div>

        <!-- Gráfica de Barras: Ingresos vs Gastos -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm">
          <h3 class="font-bold text-lg mb-4">Tendencia: Ingresos vs Gastos</h3>
          <div class="h-64 relative flex items-center justify-center">
            <ClientOnly fallback="Cargando gráfica...">
              <Bar v-if="hasTrendData" :data="trendChartData" :options="barOptions" />
              <div v-else class="text-muted-foreground text-sm text-center">No hay transacciones suficientes para graficar tendencias.</div>
            </ClientOnly>
          </div>
        </div>
        
        <!-- Gráfica de Donas: Distribución de Patrimonio -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm">
          <h3 class="font-bold text-lg mb-4">Distribución de Patrimonio</h3>
          <div class="h-64 relative flex items-center justify-center">
            <ClientOnly fallback="Cargando gráfica...">
              <Doughnut v-if="hasNetWorthData" :data="netWorthChartData" :options="doughnutOptions" />
              <div v-else class="text-muted-foreground text-sm text-center">No hay cuentas registradas.</div>
            </ClientOnly>
          </div>
        </div>

        <!-- Gráfica de Barras: Gastos de Vehículos -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm">
          <h3 class="font-bold text-lg mb-4">Gasto Mensual Vehículos (Gasolina)</h3>
          <div class="h-64 relative flex items-center justify-center">
            <ClientOnly fallback="Cargando gráfica...">
              <Bar v-if="hasVehiclesData" :data="vehiclesChartData" :options="barOptions" />
              <div v-else class="text-muted-foreground text-sm text-center">No hay registros de combustible/vehículos.</div>
            </ClientOnly>
          </div>
        </div>

        <!-- Gráfica de Donas: Suscripciones vs Flexibles -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm">
          <h3 class="font-bold text-lg mb-4">Fijos/Deuda vs Variables (Este Mes)</h3>
          <div class="h-64 relative flex items-center justify-center">
            <ClientOnly fallback="Cargando gráfica...">
              <Doughnut v-if="hasCategoryData" :data="fixedVsVariableChartData" :options="doughnutOptions" />
              <div v-else class="text-muted-foreground text-sm text-center">No hay gastos registrados este mes.</div>
            </ClientOnly>
          </div>
        </div>
        
        <!-- Gráfica de Líneas: Gastos Acumulados del Mes -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm md:col-span-1 lg:col-span-1">
          <h3 class="font-bold text-lg mb-4">Flujo de Gastos (Mes Actual)</h3>
          <div class="h-64 relative flex items-center justify-center">
            <ClientOnly fallback="Cargando gráfica...">
              <LineChart v-if="hasMonthlyFlowData" :data="monthlyFlowChartData" :options="lineOptions" />
              <div v-else class="text-muted-foreground text-sm text-center">No hay gastos este mes.</div>
            </ClientOnly>
          </div>
        </div>
      </div>
      
      <!-- Próximos Pagos -->
      <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            Próximos Pagos (30 Días)
          </h3>
        </div>
        
        <div v-if="financeStore.upcomingPayments.length === 0" class="text-sm text-muted-foreground">
          No hay pagos próximos registrados.
        </div>
        <div v-else class="space-y-4">
          <div class="flex flex-col md:flex-row justify-between text-sm mb-2 p-3 rounded-xl border border-border/40" :class="totalUpcoming > financeStore.totalBalance ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-green-500/10 text-green-700 border-green-500/20'">
            <span class="font-medium">Total a Pagar Próximamente: {{ formatCurrency(totalUpcoming) }}</span>
            <span class="font-medium" v-if="totalUpcoming > financeStore.totalBalance">⚠️ Liquidez Insuficiente en Balance Total</span>
            <span class="font-medium" v-else>✅ Presupuesto Suficiente en Balance Total</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(payment, idx) in financeStore.upcomingPayments" :key="idx" class="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl border border-border/20">
              <div>
                <p class="font-bold">{{ payment.name }}</p>
                <div class="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span class="bg-primary/10 text-primary px-2 py-0.5 rounded">{{ payment.type }}</span>
                  <span :class="payment.daysRemaining <= 3 ? 'text-red-500 font-bold' : ''">
                    {{ payment.daysRemaining === 0 ? 'Hoy' : payment.daysRemaining === 1 ? 'Mañana' : `En ${payment.daysRemaining} días` }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-mono font-bold" :class="payment.type === 'Ingreso' ? 'text-green-500' : 'text-red-500'">{{ formatCurrency(payment.amount) }}</p>
                <p class="text-xs text-muted-foreground">{{ new Date(payment.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Proyección a 1 Año -->
      <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm mb-8">
        <h3 class="font-bold text-lg mb-1">Proyección de Patrimonio a 1 Año</h3>
        <p class="text-sm text-muted-foreground mb-4">Basado en tus ingresos y gastos fijos actuales, así se vería tu balance en los próximos 12 meses.</p>
        <div class="h-64 relative flex items-center justify-center">
          <ClientOnly fallback="Cargando gráfica...">
            <LineChart :data="projectionChartData" :options="lineOptions" />
          </ClientOnly>
        </div>
      </div>
      </template>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { computed, onMounted } from 'vue'
import { Activity, PieChart, CreditCard, PiggyBank } from 'lucide-vue-next'
import { useFinanceStore } from '~/stores/finance'
import { Doughnut, Bar, Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'

ChartJS.register(
  Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
)

const financeStore = useFinanceStore()

onMounted(() => {
  financeStore.initialize()
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}

const totalUpcoming = computed(() => {
  return financeStore.upcomingPayments
    .filter(p => p.type !== 'Ingreso')
    .reduce((sum, p) => sum + p.amount, 0)
})

// -- EDU/SALUD LOGIC --

const rule503020Metrics = computed(() => {
  const income = financeStore.totalFixedIncome || 0
  const fixed = financeStore.totalFixedExpenses || 0
  if (income <= 0) {
    return {
      percentage: 0,
      barWidth: 0,
      barColor: 'bg-muted-foreground/30',
      statusClass: 'text-muted-foreground bg-secondary/50 border-border/40',
      badge: 'Sin ingresos fijos',
      message: 'Registra tus ingresos fijos en Presupuesto para calcular esta métrica.',
      fixed,
      income
    }
  }
  const pct = Math.round((fixed / income) * 100)
  const barWidth = Math.min(100, pct)
  let barColor = 'bg-emerald-500'
  let statusClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  let badge = 'Ideal (≤ 50%)'
  let message = '¡Excelente! Tus gastos fijos están dentro del límite saludable del 50%.'

  if (pct > 65) {
    barColor = 'bg-rose-500'
    statusClass = 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    badge = 'Peligro (> 65%)'
    message = 'Gastas más del 65% de tus ingresos en compromisos fijos. Reduce costos para no asfixiar tu flujo.'
  } else if (pct > 50) {
    barColor = 'bg-amber-500'
    statusClass = 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    badge = 'Alerta (51-65%)'
    message = 'Tus compromisos fijos superan el 50% recomendado. Cuida tus gastos flexibles y margen de ahorro.'
  }

  return {
    percentage: pct,
    barWidth,
    barColor,
    statusClass,
    badge,
    message,
    fixed,
    income
  }
})

const debtMetrics = computed(() => {
  const debt = financeStore.totalDebt || 0
  const income = financeStore.totalFixedIncome || 1
  if (debt <= 0) {
    return {
      debt: 0,
      monthsToPay: 0,
      barWidth: 100,
      barColor: 'bg-emerald-500',
      statusClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      badge: 'Sin Deuda',
      message: '¡Felicidades! No tienes pasivos ni deudas activas registradas.'
    }
  }
  const monthsToPay = debt / income
  let barColor = 'bg-blue-500'
  let statusClass = 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  let badge = 'Manejable (< 1 mes)'
  let message = `Te tomaría aprox. ${monthsToPay.toFixed(1)} meses de sueldo íntegro liquidar tu deuda.`
  const barWidth = Math.min(100, Math.round((monthsToPay / 3) * 100))

  if (monthsToPay >= 3) {
    barColor = 'bg-rose-500'
    statusClass = 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    badge = 'Riesgo Alto (> 3 meses)'
    message = 'Alto nivel de deuda. Te tomaría más de 3 meses íntegros de ingresos liquidarla.'
  } else if (monthsToPay >= 1) {
    barColor = 'bg-amber-500'
    statusClass = 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    badge = 'Moderada (1-3 meses)'
    message = 'Nivel de deuda moderado. Prioriza amortizar capital para evitar costo financiero.'
  }

  return {
    debt,
    monthsToPay: Number(monthsToPay.toFixed(1)),
    barWidth,
    barColor,
    statusClass,
    badge,
    message
  }
})

const emergencyFundMetrics = computed(() => {
  const savings = financeStore.totalSavings || 0
  const fixedExpense = financeStore.totalFixedExpenses || 1
  const target3Months = fixedExpense * 3
  const target6Months = fixedExpense * 6
  const monthsCovered = savings / fixedExpense
  const targetProgress = Math.min(100, Math.round((savings / target3Months) * 100))

  if (savings <= 0) {
    return {
      savings: 0,
      monthsCovered: 0,
      targetProgress: 0,
      target3Months,
      target6Months,
      barColor: 'bg-rose-500',
      statusClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      badge: 'Sin Fondo',
      message: '¡Atención! Es primordial construir un fondo mínimo de 3 meses para emergencias.'
    }
  }

  let barColor = 'bg-amber-500'
  let statusClass = 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  let badge = 'En Construcción'
  let message = `Cubre ${monthsCovered.toFixed(1)} meses de gastos fijos. Tu meta inmediata es llegar a 3 meses (${formatCurrency(target3Months)}).`

  if (monthsCovered >= 6) {
    barColor = 'bg-emerald-500'
    statusClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    badge = 'Robusto (≥ 6 meses)'
    message = '¡Excelente blindaje financiero! Tu fondo cubre más de 6 meses de gastos fijos.'
  } else if (monthsCovered >= 3) {
    barColor = 'bg-blue-500'
    statusClass = 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    badge = 'Meta Cumplida (≥ 3 meses)'
    message = `¡Gran trabajo! Tienes ${monthsCovered.toFixed(1)} meses de cobertura. Puedes aspirar a los 6 meses.`
  }

  return {
    savings,
    monthsCovered: Number(monthsCovered.toFixed(1)),
    targetProgress,
    target3Months,
    target6Months,
    barColor,
    statusClass,
    badge,
    message
  }
})

// Compatibilidad
const rule503020Status = computed(() => ({
  percentage: rule503020Metrics.value.percentage,
  message: rule503020Metrics.value.message,
  class: rule503020Metrics.value.statusClass
}))
const debtStatus = computed(() => ({
  message: debtMetrics.value.message,
  class: debtMetrics.value.statusClass
}))
const emergencyFundStatus = computed(() => ({
  message: emergencyFundMetrics.value.message,
  class: emergencyFundMetrics.value.statusClass
}))


// -- CHART DATA & OPTIONS --

const hasCategoryData = computed(() => Object.keys(financeStore.expensesByCategoryThisMonth).length > 0)
const categoryChartData = computed(() => {
  const data = financeStore.expensesByCategoryThisMonth;
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const labels = sortedEntries.map(e => e[0]);
  const values = sortedEntries.map(e => e[1]);
  return {
    labels,
    datasets: [
      {
        backgroundColor: [
          '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', 
          '#06b6d4', '#f43f5e', '#a855f7', '#ec4899', '#6366f1',
          '#14b8a6', '#f97316', '#84cc16', '#eab308', '#d946ef'
        ],
        data: values
      }
    ]
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' as const }
  }
}

const hasTrendData = computed(() => financeStore.recentIncomeVsExpense.length > 0)
const trendChartData = computed(() => {
  const data = financeStore.recentIncomeVsExpense;
  return {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Ingresos',
        backgroundColor: '#10b981', // green
        data: data.map(d => d.income)
      },
      {
        label: 'Gastos',
        backgroundColor: '#ef4444', // red
        data: data.map(d => d.expense)
      }
    ]
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const hasNetWorthData = computed(() => financeStore.accounts.length > 0)
const netWorthChartData = computed(() => {
  let assets = 0;
  let debts = 0;
  financeStore.accounts.forEach(acc => {
    const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
    if (isDebt && Number(acc.balance) < 0) {
      debts += Math.abs(Number(acc.balance));
    } else {
      assets += Math.max(0, Number(acc.balance));
    }
  });
  return {
    labels: ['Activos a Favor', 'Deudas (Pasivos)'],
    datasets: [{
      backgroundColor: ['#10b981', '#ef4444'],
      data: [assets, debts]
    }]
  }
})

const hasVehiclesData = computed(() => financeStore.vehicles.some(v => v.fuelLogs && v.fuelLogs.length > 0))
const vehiclesChartData = computed(() => {
  const result: Record<string, number> = {};
  financeStore.vehicles.forEach(v => {
    if (v.fuelLogs) {
      v.fuelLogs.forEach(log => {
        const d = new Date(log.date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!result[monthKey]) result[monthKey] = 0;
        result[monthKey] += Number(log.totalCost);
      });
    }
  });
  const sorted = Object.entries(result).sort().slice(-6);
  return {
    labels: sorted.map(s => s[0]),
    datasets: [{
      label: 'Gasto en Combustible',
      backgroundColor: '#f59e0b',
      data: sorted.map(s => s[1])
    }]
  }
})

const fixedVsVariableChartData = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let fixed = 0;
  let variable = 0;
  financeStore.transactions.forEach(t => {
    const d = new Date(t.date);
    if (t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (t.subscriptionId || ['Servicios', 'Interés Automático', 'Suscripción', 'Deuda'].includes(t.category || '')) {
        fixed += Number(t.amount);
      } else {
        variable += Number(t.amount);
      }
    }
    if (['loan_payment', 'credit_payment'].includes(t.type) && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (!t.description || !(t.description.startsWith('Pago recibido') || t.description.startsWith('Transferencia recibida'))) {
          fixed += Number(t.amount);
      }
    }
  });
  return {
    labels: ['Compromisos Fijos/Deudas', 'Gastos Variables'],
    datasets: [{
      backgroundColor: ['#3b82f6', '#f43f5e'],
      data: [fixed, variable]
    }]
  }
})

const hasMonthlyFlowData = computed(() => {
  const now = new Date();
  return financeStore.transactions.some(t => {
    const d = new Date(t.date);
    return (t.type === 'expense' || ['loan_payment', 'credit_payment'].includes(t.type)) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
})
const monthlyFlowChartData = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyExpenses = new Array(daysInMonth).fill(0);
  
  financeStore.transactions.forEach(t => {
    const d = new Date(t.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (t.type === 'expense') {
        dailyExpenses[d.getDate() - 1] += Number(t.amount);
      } else if (['loan_payment', 'credit_payment'].includes(t.type)) {
        if (!t.description || !(t.description.startsWith('Pago recibido') || t.description.startsWith('Transferencia recibida'))) {
          dailyExpenses[d.getDate() - 1] += Number(t.amount);
        }
      }
    }
  });
  
  const cumulative = [];
  let sum = 0;
  for(let i = 0; i < now.getDate(); i++) {
    sum += dailyExpenses[i];
    cumulative.push(sum);
  }
  return {
    labels: Array.from({length: now.getDate()}, (_, i) => `${i + 1}`),
    datasets: [{
      label: 'Gastos Acumulados',
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      data: cumulative,
      fill: true,
      tension: 0.3
    }]
  }
})

const projectionChartData = computed(() => {
  const labels = [];
  const data = [];
  let currentBal = financeStore.totalBalance;
  
  const dailyBurnRate = financeStore.totalFixedExpenses / 30;
  const dailyIncomeRate = financeStore.totalFixedIncome / 30;
  const netMonthly = (dailyIncomeRate - dailyBurnRate) * 30;

  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    labels.push(d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }));
    currentBal += netMonthly;
    data.push(currentBal);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Patrimonio Proyectado',
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        data,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
}
</script>
