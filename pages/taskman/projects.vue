<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Proyectos & Metas</h1>
          <p class="text-muted-foreground">Agrupa tus tareas y visualiza tu progreso general.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo Proyecto
        </button>
      </div>

      <div v-if="taskStore.projects.length === 0" class="p-8 text-center text-muted-foreground">
        No tienes proyectos creados aún. ¡Empieza uno nuevo!
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(project, index) in taskStore.projects" :key="project.id" class="bg-card border border-border/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div :class="['absolute top-0 left-0 w-full h-2', getProjectColor(index)]"></div>
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-bold text-xl">{{ project.name }}</h3>
            <span :class="['px-2 py-1 text-xs font-bold rounded-full', project.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500']">
              {{ project.status === 'active' ? 'Activo' : project.status === 'completed' ? 'Completado' : 'Archivado' }}
            </span>
          </div>
          <p class="text-muted-foreground text-sm mb-6 line-clamp-2">{{ project.description || 'Sin descripción' }}</p>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm font-medium">
              <span>Progreso</span>
              <span>{{ getProgress(project.id!) }}%</span>
            </div>
            <div class="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div :class="['h-full rounded-full', getProjectColor(index)]" :style="{ width: getProgress(project.id!) + '%' }"></div>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-sm text-muted-foreground">
            <span>{{ getTotalTasks(project.id!) }} Tareas Totales</span>
            <span class="flex -space-x-2">
              <div class="w-6 h-6 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[10px] text-primary">T</div>
            </span>
          </div>
        </div>

      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore } from '~/stores/tasks'

const taskStore = useTaskStore()

onMounted(() => {
  taskStore.fetchProjects()
  taskStore.fetchTasks() // Para calcular el progreso
})

const getProjectColor = (index: number) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500'
  ]
  return colors[index % colors.length]
}

const getTotalTasks = (projectId: number) => {
  return taskStore.tasks.filter(t => t.projectId === projectId).length
}

const getProgress = (projectId: number) => {
  const tasks = taskStore.tasks.filter(t => t.projectId === projectId)
  if (tasks.length === 0) return 0
  const completed = tasks.filter(t => t.status === 'completed').length
  return Math.round((completed / tasks.length) * 100)
}
</script>
