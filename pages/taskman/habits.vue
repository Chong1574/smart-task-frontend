<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Mis Hábitos Diarios</h1>
          <p class="text-muted-foreground">Construye la mejor versión de ti, un día a la vez.</p>
        </div>
        <button @click="showHabitModal = true" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Añadir Hábito
        </button>
      </div>

      <!-- Tracker de Hoy -->
      <div class="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.28 0-3-2.12-3-4a1 1 0 0 1 .5-1.1c1-.6 2.3-1.6 3.5-3.9 1 2 2.5 3.3 4 3.9a1 1 0 0 1 .5 1.1c0 1.9-.72 4-3 4a2.5 2.5 0 0 0 2.5 2.5c2 0 3-1.5 3-3a1 1 0 0 1 2 0c0 3.3-2.7 6-6 6a6 6 0 0 1-6-6c0-1.5 1-3 3-3Z"/></svg>
          Completar Hoy
        </h2>
        
        <div v-if="taskStore.habits.length === 0" class="text-center text-muted-foreground py-8">
          Aún no tienes hábitos registrados. Empieza creando uno.
        </div>

        <div class="space-y-4">
          <div v-for="habit in taskStore.habits" :key="habit.id" 
               :class="['flex items-center justify-between p-4 rounded-2xl transition-colors group', 
                        isHabitCompletedToday(habit) ? 'bg-primary/5 border border-primary/30 opacity-80' : 'bg-background border border-border/30 hover:border-primary/30']">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', 
                            isHabitCompletedToday(habit) ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-blue-500/10 text-blue-500']">
                {{ isHabitCompletedToday(habit) ? '🔥' : '⏳' }}
              </div>
              <div>
                <h3 :class="['font-bold text-lg transition-colors', isHabitCompletedToday(habit) ? 'text-primary line-through decoration-primary/50' : 'group-hover:text-primary']">
                  {{ habit.name }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ isHabitCompletedToday(habit) ? 'Meta de hoy completada.' : habit.description || 'Sin descripción' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div v-if="isHabitCompletedToday(habit)" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/40 group-hover:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <button v-else @click="logHabit(habit.id!)" class="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-colors text-transparent hover:text-primary group-hover:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>

              <div class="hidden group-hover:flex items-center gap-2">
                <button @click="openEditHabit(habit)" class="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button @click="taskStore.deleteHabit(habit.id!)" class="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
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
        <h2 class="text-2xl font-serif font-bold mb-6">{{ isEditingHabit ? 'Editar Hábito' : 'Nuevo Hábito' }}</h2>
        
        <form @submit.prevent="submitHabit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del Hábito</label>
            <input v-model="newHabit.name" required type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Ej: Leer 30 minutos..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea v-model="newHabit.description" rows="3" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Pequeña motivación..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Frecuencia</label>
            <select v-model="newHabit.frequency" required class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
              <option value="daily">Diaria</option>
              <option value="weekly">Semanal</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>

          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            {{ isEditingHabit ? 'Guardar Cambios' : 'Crear Hábito' }}
          </button>
        </form>
      </div>
    </div>

</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted } from 'vue'
import { useTaskStore, type Habit } from '~/stores/tasks'

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

const logHabit = async (habitId: number) => {
  await taskStore.logHabit(habitId)
}
</script>

