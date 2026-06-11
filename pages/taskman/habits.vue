<template>
  <div>
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Mis Hábitos Diarios</h1>
          <p class="text-muted-foreground">Construye la mejor versión de ti, un día a la vez.</p>
        </div>
        <button @click="showHabitModal = true" class="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Añadir Hábito
        </button>
      </div>

      <!-- Tracker de Hoy -->
      <div class="bg-card border border-border/40 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 class="text-xl font-bold mb-8 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.28 0-3-2.12-3-4a1 1 0 0 1 .5-1.1c1-.6 2.3-1.6 3.5-3.9 1 2 2.5 3.3 4 3.9a1 1 0 0 1 .5 1.1c0 1.9-.72 4-3 4a2.5 2.5 0 0 0 2.5 2.5c2 0 3-1.5 3-3a1 1 0 0 1 2 0c0 3.3-2.7 6-6 6a6 6 0 0 1-6-6c0-1.5 1-3 3-3Z"/></svg>
          Completar Hoy
        </h2>
        
        <div v-if="taskStore.habits.length === 0" class="text-center text-muted-foreground py-12">
          <div class="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🌱</div>
          <h3 class="font-bold text-lg text-foreground mb-1">Aún no tienes hábitos</h3>
          <p>Empieza plantando la primera semilla de tu rutina.</p>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div v-for="habit in taskStore.habits" :key="habit.id" 
               :class="['relative overflow-hidden group p-5 rounded-3xl border transition-all duration-500', 
                        isHabitCompletedToday(habit) ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/30 shadow-emerald-500/10' : 'bg-card border-border/40 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1']">
            
            <div class="flex items-center gap-4 relative z-10">
              <!-- Ícono Izquierdo con Ring de progreso visual -->
              <div class="relative flex-shrink-0">
                <div :class="['absolute inset-0 rounded-full transition-all duration-700', isHabitCompletedToday(habit) ? 'border-4 border-emerald-500 scale-100 opacity-100' : 'border-2 border-dashed border-muted-foreground/30 scale-90 opacity-50']"></div>
                <div :class="['w-14 h-14 rounded-full flex items-center justify-center text-2xl z-10 relative transition-transform duration-500', 
                              isHabitCompletedToday(habit) ? 'bg-emerald-500 text-white scale-90 shadow-lg shadow-emerald-500/40' : 'bg-secondary text-foreground group-hover:scale-105']">
                  {{ isHabitCompletedToday(habit) ? '🌟' : '⏳' }}
                </div>
              </div>

              <!-- Contenido Central -->
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-1">
                  <h3 :class="['font-bold text-lg transition-colors', isHabitCompletedToday(habit) ? 'text-emerald-600 line-through decoration-emerald-500/30' : 'group-hover:text-primary']">
                    {{ habit.name }}
                  </h3>
                  <!-- Racha (Streak) Badge -->
                  <span v-if="getStreak(habit) > 0" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                    🔥 {{ getStreak(habit) }} {{ getStreak(habit) === 1 ? 'día' : 'días' }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground max-w-lg">
                  {{ isHabitCompletedToday(habit) ? '¡Excelente trabajo hoy! Mantén el ritmo.' : habit.description || 'Da el primer paso hoy.' }}
                </p>
              </div>

              <!-- Botón de Completar (Derecha) -->
              <div class="flex items-center gap-2">
                <!-- Acciones Rápidas (Editar/Eliminar) - Visibles al hover -->
                <div class="hidden md:flex items-center gap-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button @click.stop="openEditHabit(habit)" class="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button @click.stop="taskStore.deleteHabit(habit.id!)" class="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-destructive hover:text-white transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>

                <!-- En mobile, siempre visibles los botones si el usuario quiere editar, pero como pedimos modernidad, mejor lo dejamos limpio. Usamos d-flex en mobile si hace falta. Para no romper en movil, los dejamos ocultos y usamos un menu, pero por ahora asi esta bien. -->
                <div class="flex items-center gap-2 md:hidden mr-2">
                   <button @click.stop="openEditHabit(habit)" class="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                </div>

                <div v-if="isHabitCompletedToday(habit)" class="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 animate-in zoom-in duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <button v-else @click="handleComplete(habit, $event)" class="w-14 h-14 flex-shrink-0 rounded-full border-4 border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300 text-transparent hover:text-primary relative group/btn">
                  <div class="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover/btn:scale-100 transition-transform duration-300"></div>
                  <svg class="relative z-10" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
            
            <!-- Patrón de fondo si está completado -->
            <div v-if="isHabitCompletedToday(habit)" class="absolute -right-6 -bottom-6 opacity-10 pointer-events-none transform rotate-12">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Añadir Hábito -->
    <div v-if="showHabitModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-primary/10">
        <button @click="showHabitModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
          {{ isEditingHabit ? 'Editar Hábito' : 'Nuevo Hábito' }}
        </h2>
        
        <form @submit.prevent="submitHabit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del Hábito</label>
            <input v-model="newHabit.name" required type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Ej: Leer 30 minutos..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea v-model="newHabit.description" rows="3" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="¿Por qué es importante para ti?"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Frecuencia</label>
            <select v-model="newHabit.frequency" required class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
              <option value="daily">Todos los días</option>
              <option value="weekly">Semanal</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>

          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 duration-200">
            {{ isEditingHabit ? 'Guardar Cambios' : 'Crear Hábito' }}
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted } from 'vue'
import { useTaskStore, type Habit } from '~/stores/tasks'
import confetti from 'canvas-confetti'

const taskStore = useTaskStore()

const showHabitModal = ref(false)
const isEditingHabit = ref(false)
const editingHabitId = ref<number | null>(null)

const newHabit = ref({
  name: '',
  description: '',
  frequency: 'daily' as 'daily' | 'weekly' | 'custom',
  status: 'active' as 'active' | 'archived'
})

const openEditHabit = (habit: Habit) => {
  isEditingHabit.value = true
  editingHabitId.value = habit.id!
  newHabit.value = {
    name: habit.name,
    description: habit.description || '',
    frequency: habit.frequency as 'daily' | 'weekly' | 'custom',
    status: habit.status
  }
  showHabitModal.value = true
}

const submitHabit = async () => {
  if (isEditingHabit.value && editingHabitId.value) {
    await taskStore.updateHabit(editingHabitId.value, { ...newHabit.value })
  } else {
    await taskStore.addHabit({ ...newHabit.value })
  }
  showHabitModal.value = false
  isEditingHabit.value = false
  editingHabitId.value = null
  newHabit.value = { name: '', description: '', frequency: 'daily', status: 'active' }
}

onMounted(() => {
  taskStore.fetchHabits()
})

const isHabitCompletedToday = (habit: Habit) => {
  if (!habit.logs || habit.logs.length === 0) return false;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return habit.logs.some(log => log.completedAt.startsWith(today));
}

const getStreak = (habit: Habit) => {
  if (!habit.logs || habit.logs.length === 0) return 0;
  
  const dates = habit.logs.map(log => log.completedAt.split('T')[0]).sort((a, b) => b.localeCompare(a));
  const uniqueDates = [...new Set(dates)];
  
  let streak = 0;
  const today = new Date();
  today.setHours(0,0,0,0);
  
  let currentDate = new Date(today);
  
  if (uniqueDates[0] === today.toISOString().split('T')[0]) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
    uniqueDates.shift();
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (uniqueDates[0] === yesterday.toISOString().split('T')[0]) {
      // alive
    } else {
      return 0;
    }
  }

  for (const d of uniqueDates) {
    const logDate = new Date(d);
    logDate.setHours(0,0,0,0);
    
    if (logDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

const handleComplete = async (habit: Habit, event: MouseEvent) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  const success = await taskStore.logHabit(habit.id!)
  
  if (success) {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { x, y },
      colors: ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#f87171'],
      ticks: 200,
      gravity: 1.2,
      scalar: 1.2
    });
  }
}
</script>
