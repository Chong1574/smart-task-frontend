<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, GitFork, Zap, Clock, DollarSign, Tag } from 'lucide-vue-next';
import { useTaskStore } from '../../stores/taskStore';

const store = useTaskStore();

// Función para obtener la fecha/hora local en formato correcto para el input
const getLocalISOString = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const task = ref({
  title: '',
  category: 'Personal',
  duration_minutes: 60,
  deadline: getLocalISOString(),
  auto_distribute: false,
  priority: 'medium' as 'high' | 'medium' | 'low',
  budget: 0,
  description: ''
});

const submitting = ref(false);

const submit = async () => {
  if (!task.value.title.trim()) return;
  submitting.value = true;
  try {
    const success = await store.addTask({ ...task.value, status: 'pending' });
    if (success) {
      task.value.title = ''; // Limpiar solo el título tras éxito
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
    <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
      <Zap :size="20" class="text-amber-500 fill-amber-500" />
      Nueva Tarea
    </h3>

    <form @submit.prevent="submit" class="space-y-5">
      
      <div>
        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">¿Qué hay que hacer?</label>
        <input 
          v-model="task.title" 
          type="text" 
          class="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-medium" 
          placeholder="Ej: Terminar Reporte Mensual" 
          required 
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        
        <div class="col-span-2 md:col-span-1">
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Categoría</label>
          <div class="relative">
            <Tag :size="16" class="absolute left-3 top-3.5 text-slate-400" />
            <select v-model="task.category" class="w-full pl-10 p-3 bg-slate-50 border-none rounded-xl outline-none appearance-none text-sm font-medium text-slate-600">
              <option>Personal</option>
              <option>Trabajo</option>
              <option>Escolar</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duración (min)</label>
          <div class="relative">
            <Clock :size="16" class="absolute left-3 top-3.5 text-slate-400" />
            <input 
              v-model.number="task.duration_minutes" 
              type="number" 
              step="15" 
              min="15"
              class="w-full pl-10 p-3 bg-slate-50 border-none rounded-xl outline-none text-sm font-medium" 
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Presupuesto</label>
          <div class="relative">
            <DollarSign :size="16" class="absolute left-3 top-3.5 text-slate-400" />
            <input 
              v-model.number="task.budget" 
              type="number" 
              placeholder="0.00"
              class="w-full pl-10 p-3 bg-slate-50 border-none rounded-xl outline-none text-sm font-medium" 
            />
          </div>
        </div>

         <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deadline</label>
          <div class="relative">
            <Calendar :size="16" class="absolute left-3 top-3.5 text-slate-400" />
            <input 
              v-model="task.deadline" 
              type="datetime-local" 
              class="w-full pl-10 p-3 bg-slate-50 border-none rounded-xl outline-none text-xs font-medium text-slate-600" 
            />
          </div>
        </div>

        <div class="col-span-2">
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prioridad (Impacto en Agenda)</label>
          <div class="flex gap-2">
            <button 
              v-for="p in ([{id:'high', label:'Alta', colorClass:'bg-red-50 border-red-500 text-red-700'}, {id:'medium', label:'Media', colorClass:'bg-amber-50 border-amber-500 text-amber-700'}, {id:'low', label:'Baja', colorClass:'bg-emerald-50 border-emerald-500 text-emerald-700'}] as const)" 
              :key="p.id"
              type="button"
              @click="task.priority = p.id"
              class="flex-1 p-2 rounded-xl text-xs font-bold transition-all border-2"
              :class="[task.priority === p.id ? p.colorClass : 'bg-slate-50 border-transparent text-slate-400']"
            >
              {{ p.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-all hover:border-blue-200 cursor-pointer" @click="task.auto_distribute = !task.auto_distribute">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
              <GitFork :size="20" class="rotate-90" />
            </div>
            <div>
              <p class="text-sm font-bold text-blue-900 leading-tight">Modo Inteligente</p>
              <p class="text-[10px] text-blue-600/80">
                {{ task.auto_distribute ? 'Dividir en sesiones óptimas' : 'Bloque único fijo' }}
              </p>
            </div>
          </div>
          
          <div class="relative inline-flex items-center">
            <input type="checkbox" v-model="task.auto_distribute" class="sr-only peer">
            <div class="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="submitting"
        class="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg flex justify-center items-center gap-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
      >
        <div v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span v-if="submitting">Organizando tu agenda...</span>
        <span v-else-if="task.auto_distribute">Procesar Auto-Scheduling</span>
        <span v-else>Agendar Tarea</span>
      </button>

    </form>
  </div>
</template>