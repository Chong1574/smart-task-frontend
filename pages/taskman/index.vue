<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Encabezado con efecto WOW -->
      <div class="relative bg-gradient-to-r from-primary/20 via-orange-400/10 to-transparent p-8 rounded-3xl overflow-hidden border border-border/50 shadow-sm">
        <div class="relative z-10">
          <h1 class="text-4xl font-serif font-bold mb-2">¡Hola, {{ userName }}! 👋</h1>
          <p class="text-muted-foreground text-lg max-w-xl">
            Tus proyectos y hábitos te están esperando. Tienes <span class="font-bold text-primary">{{ pendingTasksCount }} tareas pendientes</span> y {{ habitsRemaining }} hábitos por cumplir hoy.
          </p>
        </div>
        <div class="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div class="absolute right-32 bottom-0 w-48 h-48 bg-orange-400/20 blur-[60px] rounded-full translate-x-1/2 translate-y-1/3"></div>
      </div>

      <!-- Métricas / Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Tarjeta de Metas -->
        <div @click="$router.push('/taskman/projects')" class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Proyectos</h3>
            <div class="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold">{{ activeProjectsCount }}</p>
          <div class="mt-2 text-sm text-green-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>{{ completedProjectsCount }} completados</span>
          </div>
        </div>

        <!-- Tarjeta de Hábitos -->
        <div @click="$router.push('/taskman/habits')" class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Hábitos (Hoy)</h3>
            <div class="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.28 0-3-2.12-3-4a1 1 0 0 1 .5-1.1c1-.6 2.3-1.6 3.5-3.9 1 2 2.5 3.3 4 3.9a1 1 0 0 1 .5 1.1c0 1.9-.72 4-3 4a2.5 2.5 0 0 0 2.5 2.5c2 0 3-1.5 3-3a1 1 0 0 1 2 0c0 3.3-2.7 6-6 6a6 6 0 0 1-6-6c0-1.5 1-3 3-3Z"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold">{{ habitsCompletedToday }} / {{ activeHabitsCount }}</p>
          <div class="mt-2 text-sm text-green-500 flex items-center gap-1">
            <span>{{ habitsRemaining === 0 && activeHabitsCount > 0 ? '¡Día perfecto!' : '¡Aún puedes lograrlo!' }}</span>
          </div>
        </div>

        <!-- Tareas completadas -->
        <div @click="$router.push('/taskman/activities')" class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Tareas</h3>
            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold">{{ pendingTasksCount }}</p>
          <div class="mt-2 text-sm text-green-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>{{ completedTasksCount }} completadas</span>
          </div>
        </div>

        <!-- Finanzas -->
        <div @click="$router.push('/taskman/finance')" class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Patrimonio Neto</h3>
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold font-mono" :class="financeStore.totalBalance >= 0 ? 'text-emerald-500' : 'text-red-500'">{{ formatCurrency(financeStore.totalBalance) }}</p>
          <div class="mt-2 text-sm text-muted-foreground flex items-center gap-1">
            <span>{{ financeStore.accounts.length }} cuentas activas</span>
          </div>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Próximas a vencer -->
          <div class="bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
            <h2 class="text-xl font-serif font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Próximas Tareas a Vencer
            </h2>
            <div v-if="upcomingTasks.length === 0" class="text-muted-foreground text-sm py-4">
              No tienes tareas próximas a vencer. ¡Disfruta tu día!
            </div>
            <div v-else class="space-y-3">
              <div v-for="task in upcomingTasks" :key="task.id" class="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer" @click="$router.push('/taskman/activities')">
                <div>
                  <h4 class="font-medium">{{ task.title }}</h4>
                  <p class="text-xs text-muted-foreground">{{ getProjectName(task.projectId) || task.category || 'Sin categoría' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium" :class="isOverdue(task.deadline) ? 'text-red-500' : 'text-primary'">
                    {{ formatDate(task.deadline) }}
                  </p>
                  <p v-if="isOverdue(task.deadline)" class="text-[10px] text-red-500/80">Vencida</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Vehículos -->
          <div class="bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
            <h2 class="text-xl font-serif font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              Garage (Últimos Registros)
            </h2>
            <div v-if="financeStore.vehicles.length === 0" class="text-muted-foreground text-sm py-4">
              No hay vehículos registrados en tu Garage.
            </div>
            <div v-else class="space-y-4">
              <div v-for="v in financeStore.vehicles" :key="v.id" class="flex items-center justify-between p-4 rounded-xl border border-border/50 cursor-pointer hover:bg-secondary/20 transition-colors" @click="$router.push('/taskman/garage')">
                <div>
                  <h4 class="font-bold">{{ v.name }}</h4>
                  <p class="text-xs text-muted-foreground">{{ v.plate || 'Sin placas' }}</p>
                </div>
                <div class="text-right">
                  <p class="font-mono text-sm font-medium">{{ getLastOdometer(v) }} km</p>
                  <p class="text-xs text-muted-foreground">Último odom.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          
          <!-- Ruleta CTA -->
          <div @click="$router.push('/taskman/activities')" class="bg-gradient-to-br from-primary to-orange-500 p-8 rounded-3xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group cursor-pointer text-white flex flex-col justify-between h-56 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-serif font-bold">¿No sabes qué hacer?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-180 transition-transform duration-500"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              </div>
              <p class="text-sm opacity-90 mb-6">Gira la ruleta y deja que el algoritmo decida tu próxima tarea.</p>
              <span class="font-bold underline underline-offset-2">Lanzar Ruleta &rarr;</span>
            </div>
            <!-- Decoración -->
            <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <!-- Resumen Cuentas -->
          <div class="bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
            <h2 class="text-xl font-serif font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Cuentas Principales
            </h2>
            <div v-if="financeStore.accounts.length === 0" class="text-muted-foreground text-sm py-4">
              No tienes cuentas financieras registradas.
            </div>
            <div v-else class="space-y-3 max-h-64 overflow-y-auto pr-2">
              <div v-for="acc in financeStore.accounts" :key="acc.id" class="flex justify-between items-center p-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer" @click="$router.push('/taskman/finance')">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br flex-shrink-0" :class="acc.color"></div>
                  <div>
                    <h4 class="font-medium text-sm">{{ acc.name }}</h4>
                    <p class="text-[10px] text-muted-foreground uppercase">{{ acc.type }}</p>
                  </div>
                </div>
                <span class="font-mono text-sm font-bold" :class="getAccountBalanceColor(acc)">
                  {{ formatCurrency(acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit') ? -Math.abs(acc.balance) : acc.balance) }}
                </span>
              </div>
            </div>
            <button @click="$router.push('/taskman/finance')" class="w-full mt-4 py-2 text-sm text-primary font-medium hover:underline">
              Ver todas las finanzas &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { useRouter } from 'vue-router'
import { useTaskStore } from '~/stores/tasks'
import { useAuthStore } from '~/stores/auth'
import { useFinanceStore } from '~/stores/finance'
import { onMounted, computed } from 'vue'

const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const financeStore = useFinanceStore()

const userName = computed(() => {
  const name = authStore.user?.name || authStore.user?.email?.split('@')[0] || 'Creador'
  return name.charAt(0).toUpperCase() + name.slice(1)
})

onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    taskStore.fetchProjects(),
    taskStore.fetchHabits(),
    financeStore.initialize()
  ])
})

// Proyectos
const activeProjectsCount = computed(() => taskStore.projects.filter(p => p.status === 'active').length)
const completedProjectsCount = computed(() => taskStore.projects.filter(p => p.status === 'completed').length)

// Tareas
const pendingTasksCount = computed(() => taskStore.tasks.filter(t => t.status === 'pending').length)
const completedTasksCount = computed(() => taskStore.tasks.filter(t => t.status === 'completed').length)

const upcomingTasks = computed(() => {
  const now = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(now.getDate() + 7)
  
  return taskStore.tasks
    .filter(t => t.status === 'pending' && t.deadline)
    .filter(t => new Date(t.deadline!) <= nextWeek)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5) // Tomar solo las próximas 5
})

const isOverdue = (dateString?: string) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-MX', { month: 'short', day: 'numeric' }).format(date)
}

const getProjectName = (id?: number | null) => {
  if (!id) return ''
  return taskStore.projects.find(p => p.id === id)?.name || ''
}

// Hábitos
const activeHabitsCount = computed(() => taskStore.habits.length)
const habitsCompletedToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return taskStore.habits.filter(h => 
    h.logs?.some((log: any) => log.date.startsWith(today) && log.status === 'completed')
  ).length
})
const habitsRemaining = computed(() => Math.max(0, activeHabitsCount.value - habitsCompletedToday.value))

// Finanzas y Garage
const formatCurrency = (val: number) => {
  const absVal = Math.abs(val)
  const formatted = absVal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return val < 0 ? `-$${formatted}` : `$${formatted}`
}

const getAccountBalanceColor = (acc: any) => {
  if (acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit')) {
    return 'text-red-500'
  }
  return 'text-foreground'
}

const getLastOdometer = (vehicle: any) => {
  if (!vehicle.fuelLogs || vehicle.fuelLogs.length === 0) return 0
  const sortedLogs = [...vehicle.fuelLogs].sort((a: any, b: any) => b.odometer - a.odometer)
  return sortedLogs[0].odometer
}
</script>
