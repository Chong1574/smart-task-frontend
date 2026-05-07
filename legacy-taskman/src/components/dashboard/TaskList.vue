<script setup lang="ts">
import { useTaskStore } from '../../stores/taskStore';
import { CheckCircle2, Clock, Trash2, Calendar, GitFork } from 'lucide-vue-next';

const store = useTaskStore();

const getStatusColor = (category: string) => {
  const colors: Record<string, string> = {
    'Personal': 'bg-indigo-100 text-indigo-700',
    'Trabajo': 'bg-blue-100 text-blue-700',
    'Escolar': 'bg-amber-100 text-amber-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

// Formatear fecha para mostrar
const formatDate = (isoStr: string) => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  return date.toLocaleDateString('es-MX', { weekday: 'short', hour: '2-digit', minute:'2-digit' });
};
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-bold text-slate-800">Próximas Actividades</h3>
      <span class="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-500">
        {{ store.tasks.length }} pendientes
      </span>
    </div>

    <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      <div v-if="store.tasks.length === 0" class="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
        <p class="text-slate-400 text-sm">Sin tareas pendientes</p>
      </div>

      <div v-for="task in store.tasks" :key="task.id" 
           class="group flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
        
        <div class="flex items-start gap-3 overflow-hidden">
          <button class="mt-1 text-slate-300 hover:text-green-500 transition-colors flex-shrink-0">
            <CheckCircle2 :size="22" />
          </button>
          
          <div class="min-w-0">
            <h4 class="font-semibold text-slate-800 text-sm truncate">{{ task.title }}</h4>
            
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <span :class="['text-[10px] px-2 py-0.5 rounded-md font-bold', getStatusColor(task.category)]">
                {{ task.category }}
              </span>
              
              <span class="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Clock :size="10" /> {{ task.duration_minutes }}m
              </span>

              <span v-if="task.auto_distribute" class="flex items-center gap-1 text-[10px] text-blue-500 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                <GitFork :size="10" class="rotate-90" /> Auto
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 pl-2">
           <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
             <Calendar :size="10" /> {{ formatDate(task.deadline) }}
           </span>
           <button class="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>