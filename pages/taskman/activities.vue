<template>
  <div>
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Actividades</h1>
          <p class="text-muted-foreground">Gestiona tus tareas o deja que la Ruleta decida por ti.</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button v-if="!authStore.hasCalendarConnected" @click="connectGoogleCalendar" class="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            Conectar Calendario
          </button>
          <button @click="showRoulette = true" class="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Jugar Ruleta
          </button>
          <button @click="openNewTask" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Añadir Tarea
          </button>
        </div>
      </div>

      <!-- Ruleta Modal -->
      <div v-if="showRoulette" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div class="bg-card w-full max-w-lg rounded-3xl p-8 border border-border/50 shadow-2xl relative overflow-hidden">
          <button @click="showRoulette = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div class="text-center mb-6">
            <h2 class="text-2xl font-serif font-bold">Ruleta del Destino</h2>
            <p class="text-muted-foreground text-sm">Selecciona los proyectos en los que te gustaría trabajar ahora mismo.</p>
          </div>

          <!-- Selección de Proyectos -->
          <div class="space-y-3 mb-8 max-h-48 overflow-y-auto pr-2">
            <label v-for="project in activeProjects" :key="project.id" class="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors">
              <input type="checkbox" :value="project.id" v-model="selectedProjectIds" class="w-5 h-5 rounded text-primary focus:ring-primary/50">
              <span class="font-medium">{{ project.name }}</span>
            </label>
            <div v-if="activeProjects.length === 0" class="text-center text-muted-foreground py-4">
               No tienes proyectos activos.
            </div>
          </div>

          <!-- Animación Ruleta y Botón -->
          <div class="flex flex-col items-center gap-6">
            <div :class="['w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all', taskStore.loading ? 'border-orange-500 border-dashed animate-spin' : 'border-primary shadow-[0_0_30px_rgba(224,122,95,0.3)]']">
              <svg v-if="!taskStore.loading && !selectedTask" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              <div v-else-if="selectedTask" class="text-4xl">🎉</div>
            </div>

            <button v-if="!selectedTask" @click="spin" :disabled="taskStore.loading" class="bg-gradient-to-r from-primary to-orange-500 text-white w-full py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {{ taskStore.loading ? 'Girando...' : '¡Girar la Ruleta!' }}
            </button>

            <div v-if="selectedTask && !taskStore.loading" class="w-full text-center animate-in fade-in slide-in-from-bottom-2">
              <p class="text-muted-foreground text-sm mb-1">¡El destino ha hablado!</p>
              <h3 class="text-xl font-bold text-primary">{{ selectedTask.title }}</h3>
              <p class="text-sm mt-2 text-muted-foreground">{{ selectedTask.category || 'Sin categoría' }}</p>
              
              <button @click="showRoulette = false; selectedTask = null" class="mt-6 bg-secondary text-secondary-foreground px-6 py-2 rounded-full text-sm hover:bg-secondary/80">
                Aceptar mi destino
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Tareas Normal -->
      <div class="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 px-6 pt-4 gap-4 pb-2">
          <div class="flex gap-4 overflow-x-auto">
            <button @click="activeTab = 'programadas'" :class="['pb-3 px-2 font-bold border-b-2 transition-colors text-sm whitespace-nowrap', activeTab === 'programadas' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']">Programadas</button>
            <button @click="activeTab = 'pendientes'" :class="['pb-3 px-2 font-bold border-b-2 transition-colors text-sm whitespace-nowrap', activeTab === 'pendientes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']">Pendientes Rápidas</button>
            <button @click="activeTab = 'terminadas'" :class="['pb-3 px-2 font-bold border-b-2 transition-colors text-sm whitespace-nowrap', activeTab === 'terminadas' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']">Terminadas</button>
          </div>
          <div class="flex items-center gap-2 mb-2 sm:mb-0">
            <label class="text-sm font-medium text-muted-foreground">Proyecto:</label>
            <select v-model="filterProjectId" class="text-sm rounded-xl border border-border/50 bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow shadow-sm max-w-[180px]">
              <option :value="null">Todos</option>
              <option v-for="p in activeProjects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
        </div>

        <div class="p-4 bg-secondary/30 border-b border-border/40 font-medium grid grid-cols-12 gap-4 text-sm text-muted-foreground">
          <div class="col-span-1 text-center">Auto</div>
          <div class="col-span-5">Tarea</div>
          <div class="col-span-3">Proyecto / Cat</div>
          <div class="col-span-2">Prioridad</div>
          <div class="col-span-1 text-right">Acciones</div>
        </div>

        <div v-if="taskStore.loading && taskStore.tasks.length === 0" class="p-4 space-y-3">
          <Skeleton v-for="i in 4" :key="i" class="h-12 w-full" />
        </div>

        <div v-else-if="displayedTasks.length === 0" class="p-8 text-center text-muted-foreground">
          No hay tareas en esta categoría. ¡Disfruta tu tiempo libre o agrega una nueva!
        </div>

        <!-- Tareas dinámicas -->
        <div v-for="task in displayedTasks" :key="task.id" class="p-4 border-b border-border/40 grid grid-cols-12 gap-4 items-center hover:bg-secondary/10 transition-colors group">
          <div class="col-span-1 flex justify-center">
             <div v-if="task.auto_distribute" class="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center cursor-help" title="Smart Scheduled">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
             </div>
             <div v-else class="w-6 h-6 rounded bg-muted/20 text-muted-foreground flex items-center justify-center cursor-help" title="Pendiente Rápida">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
          </div>
          <div class="col-span-5 font-medium">{{ task.title }}</div>
          <div class="col-span-3 text-sm text-muted-foreground">{{ getProjectName(task.projectId) || task.category || '-' }}</div>
          <div class="col-span-2">
            <span :class="['px-2 py-1 rounded-full text-xs font-bold', getPriorityClass(task.priority)]">
              {{ task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja' }}
            </span>
          </div>
          <div class="col-span-1 text-right flex justify-end gap-1 items-center">
            <button v-if="task.status === 'pending'" @click="markComplete(task)" class="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-full transition-colors flex-shrink-0" title="Completar Tarea">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button @click="openEditTask(task)" class="text-muted-foreground hover:text-primary p-2" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
              <button @click="taskStore.deleteTask(task.id!)" class="text-muted-foreground hover:text-destructive p-2" title="Eliminar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Modal Añadir Tarea -->
    <div v-if="showTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-lg rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-primary/10">
        <button @click="showTaskModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">{{ isEditingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
        
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
              <label class="block text-sm font-medium mb-1">Proyecto</label>
              <select v-model="newTask.projectId" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
                <option :value="null">Sin proyecto</option>
                <option v-for="p in activeProjects" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <input v-model="newTask.category" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Trabajo, Hogar..." />
            </div>
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
            <div v-if="newTask.auto_distribute">
              <label class="block text-sm font-medium mb-1">Fecha Límite (Opcional)</label>
              <input v-model="newTask.deadline" type="date" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4" v-if="newTask.auto_distribute">
            <div>
              <label class="block text-sm font-medium mb-1">Duración (Horas)</label>
              <input v-model="taskHours" type="number" min="0" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Duración (Minutos)</label>
              <select v-model="taskMinutes" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
                <option :value="0">0 min</option>
                <option :value="15">15 min</option>
                <option :value="30">30 min</option>
                <option :value="45">45 min</option>
              </select>
            </div>
          </div>

          <label class="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-secondary/20 transition-colors mt-2">
            <input v-model="newTask.auto_distribute" type="checkbox" class="w-5 h-5 rounded text-primary focus:ring-primary" />
            <div class="flex flex-col">
              <span class="font-medium text-sm">Distribución Inteligente en Calendario</span>
              <span class="text-xs text-muted-foreground">Si desactivas esto, la tarea irá a Pendientes Rápidas sin bloque de tiempo.</span>
            </div>
          </label>

          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            {{ isEditingTask ? 'Guardar Cambios' : 'Añadir Tarea' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useTaskStore, type Task } from '~/stores/tasks'
import { useAuthStore } from '~/stores/auth'
import api from '~/utils/api'

const taskStore = useTaskStore()
const authStore = useAuthStore()

onMounted(() => {
  taskStore.fetchTasks()
  taskStore.fetchProjects()

  // Manejar resultado del callback de calendario (#calendar=connected|failed)
  if (typeof window !== 'undefined') {
    const hash = window.location.hash
    if (hash.includes('calendar=connected')) {
      toast.success('Google Calendar conectado correctamente')
      authStore.user = { ...authStore.user, hasCalendarConnected: true }
      if (authStore.user) localStorage.setItem('user', JSON.stringify(authStore.user))
      window.location.hash = ''
    } else if (hash.includes('calendar=failed')) {
      toast.error('No se pudo conectar Google Calendar. Intenta de nuevo.')
      window.location.hash = ''
    }
  }
})

const activeTab = ref('programadas')

const programmedTasks = computed(() => taskStore.tasks.filter(t => t.status === 'pending' && (t.auto_distribute || t.deadline)))
const pendingQuickTasks = computed(() => taskStore.tasks.filter(t => t.status === 'pending' && !t.auto_distribute && !t.deadline))
const completedTasks = computed(() => taskStore.tasks.filter(t => t.status === 'completed'))

const filterProjectId = ref<number | null>(null)

const displayedTasks = computed(() => {
  let list = [];
  if (activeTab.value === 'programadas') list = programmedTasks.value;
  else if (activeTab.value === 'terminadas') list = completedTasks.value;
  else list = pendingQuickTasks.value;
  
  if (filterProjectId.value) {
    list = list.filter(t => t.projectId === filterProjectId.value)
  }
  
  return list;
})

const activeProjects = computed(() => taskStore.projects.filter(p => p.status === 'active'))

const showRoulette = ref(false)
const selectedTask = ref<Task | null>(null)
const selectedProjectIds = ref<number[]>([])

// Preseleccionar todos los proyectos
onMounted(() => {
  if (activeProjects.value.length > 0) {
    selectedProjectIds.value = activeProjects.value.map(p => p.id!)
  }
})

const showTaskModal = ref(false)
const isEditingTask = ref(false)
const editingTaskId = ref<number | null>(null)

const newTask = ref<Partial<Task>>({
  title: '',
  description: '',
  deadline: '',
  category: '',
  duration_minutes: 30,
  priority: 'medium',
  auto_distribute: true,
  status: 'pending'
})

const taskHours = ref(0)
const taskMinutes = ref(30)

const openNewTask = () => {
  isEditingTask.value = false
  editingTaskId.value = null
  newTask.value = {
    title: '',
    description: '',
    deadline: '',
    category: '',
    duration_minutes: 30,
    priority: 'medium',
    auto_distribute: true,
    status: 'pending'
  }
  taskHours.value = 0
  taskMinutes.value = 30
  showTaskModal.value = true
}

const openEditTask = (task: Task) => {
  isEditingTask.value = true
  editingTaskId.value = task.id!
  newTask.value = {
    title: task.title,
    description: task.description || '',
    deadline: task.deadline || '',
    category: task.category || '',
    duration_minutes: task.duration_minutes || 30,
    priority: task.priority || 'medium',
    projectId: task.projectId,
    auto_distribute: task.auto_distribute ?? true,
    status: task.status
  }
  taskHours.value = Math.floor((newTask.value.duration_minutes || 0) / 60)
  taskMinutes.value = (newTask.value.duration_minutes || 0) % 60
  showTaskModal.value = true
}

const submitTask = async () => {
  newTask.value.duration_minutes = (taskHours.value * 60) + taskMinutes.value;
  if (newTask.value.duration_minutes === 0) newTask.value.duration_minutes = 15;

  const payload = { ...newTask.value } as any;
  // Normalizar deadline: '' → null, 'YYYY-MM-DD' → ISO 8601 fin-de-día local
  if (!payload.deadline) {
    payload.deadline = null;
    payload.auto_distribute = false;
  } else if (!payload.deadline.includes('T')) {
    payload.deadline = new Date(`${payload.deadline}T23:59:59`).toISOString();
  }

  let ok: boolean;
  if (isEditingTask.value && editingTaskId.value) {
    const { title, status, category, priority, description, deadline, budget, projectId, goalId } = payload;
    ok = await taskStore.updateTask(editingTaskId.value, { title, status, category, priority, description, deadline, budget, projectId, goalId });
  } else {
    ok = await taskStore.addTask(payload as Task);
  }
  if (!ok) { toast.error('No se pudo guardar la tarea'); return; }

  showTaskModal.value = false
  newTask.value = {
    title: '',
    description: '',
    deadline: '',
    category: '',
    duration_minutes: 30,
    priority: 'medium',
    auto_distribute: true,
    status: 'pending'
  }
}

const spin = async () => {
  selectedTask.value = null
  const result = await taskStore.spinRoulette(selectedProjectIds.value.length ? selectedProjectIds.value : undefined)
  if (result) {
    selectedTask.value = result
  } else {
    // Si la ruleta no devolvió nada (ej. no hay tareas para esos proyectos)
    alert('No se encontró ninguna tarea pendiente para los proyectos seleccionados.')
  }
}

const getProjectName = (id?: number) => {
  if (!id) return ''
  return taskStore.projects.find(p => p.id === id)?.name || ''
}

const getPriorityClass = (priority?: string) => {
  if (priority === 'high') return 'bg-red-500/10 text-red-500'
  if (priority === 'medium') return 'bg-orange-500/10 text-orange-500'
  return 'bg-blue-500/10 text-blue-500'
}

const connectGoogleCalendar = async () => {
  try {
    const res = await api.post('/auth/google/calendar-ticket')
    if (res.data?.success && res.data.ticket) {
      const baseUrl = api.defaults.baseURL?.replace('/api', '') || ''
      window.location.href = `${baseUrl}/api/auth/google/calendar?ticket=${res.data.ticket}`
    }
  } catch (err) {
    toast.error('No se pudo iniciar la conexión con Google Calendar')
  }
}

const markComplete = async (task: Task) => {
  if(task.id) await taskStore.updateTask(task.id, { status: 'completed' })
}
</script>

