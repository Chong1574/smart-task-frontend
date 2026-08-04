<template>
  <div class="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 p-4 md:p-8">
    
    <!-- Header / Reloj y Saludo -->
    <div class="text-center mb-12">
      <h1 class="text-7xl md:text-9xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-orange-400 tracking-tighter mb-4">
        {{ currentTime }}
      </h1>
      <h2 class="text-3xl md:text-5xl font-medium text-foreground tracking-tight mb-2">
        {{ greeting }}<span v-if="authStore.user?.name || authStore.user?.email">, {{ authStore.user?.name || authStore.user?.email.split('@')[0] }}</span>
      </h2>
      <p class="text-xl md:text-2xl text-muted-foreground font-serif">
        {{ currentDate }}
      </p>
    </div>

    <!-- Contenido Principal -->
    <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      
      <!-- Columna Izquierda: Pendientes -->
      <div class="bg-card/50 backdrop-blur-xl border border-border/40 rounded-3xl p-6 md:p-10 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        
        <h3 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          Foco del Día
        </h3>
        
        <div v-if="taskStore.loading" class="space-y-4">
           <div v-for="i in 3" :key="i" class="h-16 bg-muted/50 rounded-2xl animate-pulse"></div>
        </div>
        
        <div v-else-if="pendingTasks.length === 0" class="text-center py-12 text-muted-foreground">
          <p class="text-xl">¡Todo al día!</p>
          <p class="text-sm mt-2">Disfruta tu día o agrega nuevas misiones.</p>
        </div>

        <ul v-else class="space-y-4">
          <li v-for="task in pendingTasks.slice(0, 5)" :key="task.id" class="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors group">
            <div class="w-6 h-6 rounded-full border-2 border-primary/50 flex-shrink-0 mt-0.5 group-hover:border-primary transition-colors"></div>
            <div>
              <h4 class="text-lg font-medium leading-tight group-hover:text-primary transition-colors">{{ task.title }}</h4>
              <div class="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span v-if="task.duration_minutes" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ task.duration_minutes }} min
                </span>
                <span v-if="task.priority" :class="{'text-destructive': task.priority === 'high', 'text-orange-500': task.priority === 'medium', 'text-green-500': task.priority === 'low'}" class="capitalize">
                  {{ task.priority }}
                </span>
                <span v-if="task.category">{{ task.category }}</span>
              </div>
            </div>
          </li>
          <li v-if="pendingTasks.length > 5" class="text-center text-muted-foreground pt-2 text-sm font-medium">
            + {{ pendingTasks.length - 5 }} tareas más...
          </li>
        </ul>
      </div>

      <!-- Columna Derecha: Hábitos y Resumen -->
      <div class="space-y-8 md:space-y-12">
        <!-- Hábitos -->
        <div class="bg-card/50 backdrop-blur-xl border border-border/40 rounded-3xl p-6 md:p-10 shadow-2xl shadow-primary/5">
          <h3 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Hábitos Diarios
          </h3>
          
          <div v-if="taskStore.loading" class="flex flex-wrap gap-3">
             <div v-for="i in 4" :key="i" class="h-10 w-24 bg-muted/50 rounded-full animate-pulse"></div>
          </div>
          
          <div v-else-if="activeHabits.length === 0" class="text-center py-6 text-muted-foreground">
             <p>No tienes hábitos activos.</p>
          </div>
          
          <div v-else class="flex flex-wrap gap-3">
            <div v-for="habit in activeHabits" :key="habit.id" class="px-5 py-2.5 rounded-full border border-border/50 bg-background/50 font-medium text-sm hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary/50"></div>
              {{ habit.name }}
            </div>
          </div>
        </div>

        <!-- Info Extra / Frase Motivacional -->
        <div class="bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20 rounded-3xl p-6 md:p-10 text-center relative overflow-hidden">
          <p class="text-xl md:text-2xl font-serif font-medium text-foreground italic relative z-10">
            "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '~/stores/tasks'
import { useAuthStore } from '~/stores/auth'

const taskStore = useTaskStore()
const authStore = useAuthStore()

const currentTime = ref('')
const currentDate = ref('')
const greeting = ref('')
let timer: ReturnType<typeof setInterval>

const updateTime = () => {
  const now = new Date()
  
  // Update time (HH:MM)
  currentTime.value = now.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
  
  // Update date
  currentDate.value = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase())
  
  // Update greeting
  const hour = now.getHours()
  if (hour >= 5 && hour < 12) {
    greeting.value = 'Buenos días'
  } else if (hour >= 12 && hour < 20) {
    greeting.value = 'Buenas tardes'
  } else {
    greeting.value = 'Buenas noches'
  }
}

const pendingTasks = computed(() => {
  return taskStore.tasks
    .filter(t => t.status === 'pending' || t.status === 'in_progress')
    .sort((a, b) => {
      // Prioritize high priority, then deadline
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return 0;
    })
})

const activeHabits = computed(() => {
  return taskStore.habits.filter(h => h.status === 'active')
})

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000) // Update every second so colon blinks or just stays accurate
  
  if (taskStore.tasks.length === 0) {
    await taskStore.fetchTasks()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
