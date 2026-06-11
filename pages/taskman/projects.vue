<template>
  <div>
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Proyectos & Metas</h1>
          <p class="text-muted-foreground">Agrupa tus tareas y visualiza tu progreso general.</p>
        </div>
        <button @click="openNewProject" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
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
            <div class="flex items-center gap-2">
              <span :class="['px-2 py-1 text-xs font-bold rounded-full', project.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500']">
                {{ project.status === 'active' ? 'Activo' : project.status === 'completed' ? 'Completado' : 'Archivado' }}
              </span>
              <button @click="openEditProject(project)" class="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
            </div>
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
            <div class="flex gap-2 items-center">
              <span class="flex -space-x-2">
                <div class="w-6 h-6 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[10px] text-primary">T</div>
              </span>
              <button @click="openNewTaskForProject(project.id!)" class="bg-primary/10 text-primary hover:bg-primary hover:text-white px-2 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Tarea
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Modal Nuevo Proyecto -->
    <div v-if="showProjectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-primary/10">
        <button @click="showProjectModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">{{ isEditingProject ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h2>
        
        <form @submit.prevent="submitProject" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del Proyecto</label>
            <input v-model="newProject.name" required type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Lanzar aplicación..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea v-model="newProject.description" rows="3" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Objetivo principal del proyecto..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Estado</label>
            <select v-model="newProject.status" required class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
              <option value="active">Activo</option>
              <option value="completed">Completado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            {{ isEditingProject ? 'Guardar Cambios' : 'Crear Proyecto' }}
          </button>
        </form>
      </div>
    </div>    <!-- Modal Añadir Tarea Rápida -->
    <div v-if="showTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-lg rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-primary/10">
        <button @click="showTaskModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">Añadir Tarea al Proyecto</h2>
        
        <form @submit.prevent="submitTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Título de la Tarea</label>
            <input v-model="newTask.title" required type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Ej: Revisar reporte final..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea v-model="newTask.description" rows="2" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Detalles de la tarea..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Prioridad</label>
              <select v-model="newTask.priority" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Fecha Límite (Opcional)</label>
              <input v-model="newTask.deadline" type="date" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Duración (min)</label>
              <input v-model="newTask.duration_minutes" type="number" step="15" min="15" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
            </div>
          </div>
          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Guardar Tarea
          </button>
        </form>
      </div>
    </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted } from 'vue'
import { useTaskStore, type Task } from '~/stores/tasks'

const taskStore = useTaskStore()

const showProjectModal = ref(false)
const isEditingProject = ref(false)
const editingProjectId = ref<number | null>(null)

const newProject = ref({
  name: '',
  description: '',
  status: 'active' as 'active' | 'completed' | 'archived'
})

const openNewProject = () => {
  isEditingProject.value = false
  editingProjectId.value = null
  newProject.value = { name: '', description: '', status: 'active' }
  showProjectModal.value = true
}

const openEditProject = (project: any) => {
  isEditingProject.value = true
  editingProjectId.value = project.id
  newProject.value = {
    name: project.name,
    description: project.description || '',
    status: project.status
  }
  showProjectModal.value = true
}

const submitProject = async () => {
  if (isEditingProject.value && editingProjectId.value) {
    await taskStore.updateProject(editingProjectId.value, { ...newProject.value })
  } else {
    await taskStore.addProject({ ...newProject.value })
  }
  showProjectModal.value = false
  newProject.value = { name: '', description: '', status: 'active' }
}

const showTaskModal = ref(false)
const newTask = ref<Partial<Task>>({
  title: '',
  description: '',
  deadline: '',
  duration_minutes: 30,
  priority: 'medium',
  projectId: undefined,
  auto_distribute: true,
  status: 'pending'
})

const openNewTaskForProject = (projectId: number) => {
  newTask.value = {
    title: '',
    description: '',
    deadline: '',
    duration_minutes: 30,
    priority: 'medium',
    projectId: projectId,
    auto_distribute: true,
    status: 'pending'
  }
  showTaskModal.value = true
}

const submitTask = async () => {
  await taskStore.addTask({ ...newTask.value } as Task)
  showTaskModal.value = false
}

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

