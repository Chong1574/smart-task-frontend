<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Encabezado con efecto WOW -->
      <div class="relative bg-gradient-to-r from-primary/20 via-orange-400/10 to-transparent p-8 rounded-3xl overflow-hidden border border-border/50">
        <div class="relative z-10">
          <h1 class="text-4xl font-serif font-bold mb-2">¡Hola, Creador! 👋</h1>
          <p class="text-muted-foreground text-lg max-w-xl">
            Tus proyectos y hábitos te están esperando. Tienes <span class="font-bold text-primary">{{ pendingTasksCount }} tareas prioritarias</span> para hoy y {{ activeHabitsCount }} hábitos por cumplir.
          </p>
        </div>
        <!-- Decoración de fondo abstracto -->
        <div class="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div class="absolute right-32 bottom-0 w-48 h-48 bg-orange-400/20 blur-[60px] rounded-full translate-x-1/2 translate-y-1/3"></div>
      </div>

      <!-- Métricas / Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Tarjeta de Metas -->
        <div class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Proyectos Activos</h3>
            <div class="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold">{{ activeProjectsCount }}</p>
          <div class="mt-2 text-sm text-green-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>Progreso estable</span>
          </div>
        </div>

        <!-- Tarjeta de Hábitos -->
        <div class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Racha de Hábitos</h3>
            <div class="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.28 0-3-2.12-3-4a1 1 0 0 1 .5-1.1c1-.6 2.3-1.6 3.5-3.9 1 2 2.5 3.3 4 3.9a1 1 0 0 1 .5 1.1c0 1.9-.72 4-3 4a2.5 2.5 0 0 0 2.5 2.5c2 0 3-1.5 3-3a1 1 0 0 1 2 0c0 3.3-2.7 6-6 6a6 6 0 0 1-6-6c0-1.5 1-3 3-3Z"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold">{{ activeHabitsCount }} <span class="text-lg text-muted-foreground font-normal">hábitos</span></p>
          <div class="mt-2 text-sm text-green-500 flex items-center gap-1">
            <span>¡Sigue así!</span>
          </div>
        </div>

        <!-- Tareas completadas -->
        <div class="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-muted-foreground">Tareas (Semana)</h3>
            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold">{{ pendingTasksCount }}</p>
          <div class="mt-2 text-sm text-green-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>+15% vs pasada</span>
          </div>
        </div>

        <!-- Acceso Rápido a Ruleta -->
        <div @click="$router.push('/taskman/activities')" class="bg-gradient-to-br from-primary to-orange-500 p-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group cursor-pointer text-white flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium">¿No sabes qué hacer?</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-180 transition-transform duration-500"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
          </div>
          <div>
            <p class="text-sm opacity-90 mb-2">Gira la ruleta y deja que el destino (y el algoritmo) decidan por ti.</p>
            <span class="font-bold underline underline-offset-2">Lanzar Ruleta &rarr;</span>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTaskStore } from '~/stores/tasks'
import { onMounted, computed } from 'vue'

const router = useRouter()
const taskStore = useTaskStore()

onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    taskStore.fetchProjects(),
    taskStore.fetchHabits()
  ])
})

const activeProjectsCount = computed(() => taskStore.projects.filter(p => p.status === 'active').length)
const pendingTasksCount = computed(() => taskStore.tasks.filter(t => t.status === 'pending').length)
// Assuming habits are fetched, we can show active habits length or hardcoded streak for now since streak logic is complex
const activeHabitsCount = computed(() => taskStore.habits.length)
</script>
