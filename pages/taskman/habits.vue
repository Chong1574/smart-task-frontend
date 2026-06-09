<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Mis Hábitos Diarios</h1>
          <p class="text-muted-foreground">Construye la mejor versión de ti, un día a la vez.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Añadir Hábito
        </button>
      </div>

      <!-- Tracker de Hoy -->
      <div class="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
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

            <div v-if="isHabitCompletedToday(habit)" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <button v-else @click="logHabit(habit.id!)" class="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-colors text-transparent hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore, type Habit } from '~/stores/tasks'

const taskStore = useTaskStore()

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
