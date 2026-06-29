<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Dashboard analítico y educación financiera.</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-1 border-b border-border/40 pb-px overflow-x-auto">
        <NuxtLink to="/taskman/wallet" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Billetera
        </NuxtLink>
        <NuxtLink to="/taskman/budget" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Presupuesto & Proyecciones
        </NuxtLink>
        <NuxtLink to="/taskman/dashboard" class="px-4 py-2 border-b-2 border-primary text-primary font-medium transition-colors whitespace-nowrap">
          Dashboard y Salud
        </NuxtLink>
      </div>

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
          <h3 class="font-bold text-xl mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Salud y Educación Financiera
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Regla 50/30/20 -->
            <div :class="['p-4 rounded-2xl border', rule503020Status.class]">
              <h4 class="font-bold mb-2">Regla 50/30/20</h4>
              <p class="text-sm mb-2">Gastos Fijos: {{ formatCurrency(financeStore.totalFixedExpenses) }} / {{ formatCurrency(financeStore.totalFixedIncome || 1) }} ({{ rule503020Status.percentage }}%)</p>
              <p class="text-xs">{{ rule503020Status.message }}</p>
            </div>

            <!-- Endeudamiento -->
            <div :class="['p-4 rounded-2xl border', debtStatus.class]">
              <h4 class="font-bold mb-2">Nivel de Endeudamiento</h4>
              <p class="text-sm mb-2">Deuda Total: {{ formatCurrency(financeStore.totalDebt) }}</p>
              <p class="text-xs">{{ debtStatus.message }}</p>
            </div>

            <!-- Fondo de Emergencia -->
            <div :class="['p-4 rounded-2xl border', emergencyFundStatus.class]">
              <h4 class="font-bold mb-2">Fondo de Emergencia</h4>
              <p class="text-sm mb-2">Ahorro: {{ formatCurrency(financeStore.totalSavings) }}</p>
              <p class="text-xs">{{ emergencyFundStatus.message }}</p>
            </div>

          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p class="font-mono font-bold text-red-500">{{ formatCurrency(payment.amount) }}</p>
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
  return financeStore.upcomingPayments.reduce((sum, p) => sum + p.amount, 0)
})

// -- EDU/SALUD LOGIC --

const rule503020Status = computed(() => {
  const fixedIncome = financeStore.totalFixedIncome || 0;
  const fixedExpense = financeStore.totalFixedExpenses || 0;
  if (fixedIncome === 0) return { percentage: 0, message: 'Registra tus ingresos fijos para calcular esta regla.', class: 'bg-secondary/30 text-muted-foreground' };
  
  const pct = Math.round((fixedExpense / fixedIncome) * 100);
  if (pct <= 50) return { percentage: pct, message: '¡Excelente! Tus gastos fijos (necesidades) están por debajo del 50%.', class: 'bg-green-500/10 border-green-500/30 text-green-700' };
  if (pct <= 65) return { percentage: pct, message: 'Tus gastos fijos superan la regla ideal del 50%, ten cuidado con no comprometer tu capacidad de ahorro.', class: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700' };
  return { percentage: pct, message: '¡Peligro! Gastas más del 65% de lo que ganas en compromisos fijos.', class: 'bg-red-500/10 border-red-500/30 text-red-700' };
})

const debtStatus = computed(() => {
  const debt = financeStore.totalDebt || 0;
  const income = financeStore.totalFixedIncome || 1; // avoid /0
  
  if (debt === 0) return { message: '¡Felicidades! No tienes deuda registrada.', class: 'bg-green-500/10 border-green-500/30 text-green-700' };
  
  const monthsToPay = debt / income;
  if (monthsToPay < 1) return { message: 'Tu deuda es manejable (menos de 1 mes de sueldo).', class: 'bg-blue-500/10 border-blue-500/30 text-blue-700' };
  if (monthsToPay < 3) return { message: 'Tienes un nivel de deuda moderado, prioriza pagarla.', class: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700' };
  return { message: 'Alto nivel de endeudamiento, te tomaría más de 3 meses enteros de sueldo liquidarla.', class: 'bg-red-500/10 border-red-500/30 text-red-700' };
})

const emergencyFundStatus = computed(() => {
  const savings = financeStore.totalSavings || 0;
  const fixedExpense = financeStore.totalFixedExpenses || 1;
  
  if (savings === 0) return { message: '¡Atención! Es muy importante construir un fondo para emergencias.', class: 'bg-red-500/10 border-red-500/30 text-red-700' };
  
  const monthsCovered = savings / fixedExpense;
  if (monthsCovered >= 6) return { message: '¡Tienes un fondo robusto! (Más de 6 meses de cobertura)', class: 'bg-green-500/10 border-green-500/30 text-green-700' };
  if (monthsCovered >= 3) return { message: 'Buen fondo de emergencia (cubre al menos 3 meses).', class: 'bg-blue-500/10 border-blue-500/30 text-blue-700' };
  return { message: `Tu ahorro cubre ${monthsCovered.toFixed(1)} meses de gastos fijos. Apunta a llegar a 3 meses.`, class: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700' };
})


// -- CHART DATA & OPTIONS --

const hasCategoryData = computed(() => Object.keys(financeStore.expensesByCategoryThisMonth).length > 0)
const categoryChartData = computed(() => {
  const data = financeStore.expensesByCategoryThisMonth;
  const labels = Object.keys(data);
  const values = Object.values(data);
  return {
    labels,
    datasets: [
      {
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f43f5e'],
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
