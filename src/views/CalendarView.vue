<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  CheckCircle2, Trash2 
} from 'lucide-vue-next';
import { useTaskStore } from '../stores/taskStore';
import api from '../api';

const store = useTaskStore();
const currentDate = ref(new Date());
const viewMode = ref<'month' | 'week' | 'day'>('month');
const googleEvents = ref<any[]>([]);

const syncLoading = ref(false);
const syncStatus = ref(''); 
const isFirstSync = ref(true);

onMounted(async () => {
    store.fetchTasks();
    if (localStorage.getItem('google_sync_enabled')) {
        handleSync();
        isFirstSync.value = false;
    }
});

const handleSync = async () => {
    syncLoading.value = true;
    syncStatus.value = 'syncing';
    try {
        const [resEvents, resTasks] = await Promise.all([
            api.get('/oauth/google/events'),
            api.get('/oauth/google/tasks')
        ]);

        if (resEvents.data.success || resTasks.data.success) {
            let allItems: any[] = [];
            if (resEvents.data.success) allItems = [...allItems, ...resEvents.data.data];
            if (resTasks.data.success) allItems = [...allItems, ...resTasks.data.data.map((t: any) => ({ ...t, summary: t.title, type: 'google_task' }))];
            
            googleEvents.value = allItems;
            syncStatus.value = 'success';
            localStorage.setItem('google_sync_enabled', 'true');
            isFirstSync.value = false;
            setTimeout(() => syncStatus.value = '', 4000);
        }
    } catch (err: any) {
        console.error("Sync error:", err);
        syncStatus.value = 'error';
    } finally {
        syncLoading.value = false;
    }
};

const monthName = computed(() => {
  return currentDate.value.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const days = [];
  
  if (viewMode.value === 'month') {
    const date = new Date(year, month, 1);
    const startDay = date.getDay();
    for (let i = 0; i < startDay; i++) {
        days.push({ day: null, current: false, items: [], fullDate: null });
    }
    while (date.getMonth() === month) {
        days.push(createDayObject(new Date(date)));
        date.setDate(date.getDate() + 1);
    }
  } else {
    const date = new Date(currentDate.value);
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
        days.push(createDayObject(new Date(date)));
        date.setDate(date.getDate() + 1);
    }
  }
  return days;
});

const createDayObject = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    const tasks = store.tasks || [];
    const items: any[] = [];

    tasks.forEach((t: any) => {
        if (t.blocks && t.blocks.length > 0) {
            t.blocks.forEach((b: any) => {
                const db = new Date(b.start);
                if (db.getDate() === d && db.getMonth() === m && db.getFullYear() === y) {
                    items.push({ id: t.id, label: t.title, type: 'task_block', status: t.status });
                }
            });
        } else if (t.deadline) {
            const dt = new Date(t.deadline);
            if (dt.getDate() === d && dt.getMonth() === m && dt.getFullYear() === y) {
                items.push({ id: t.id, label: t.title, type: 'task', status: t.status });
            }
        }
    });

    const dayGoogleEvents = googleEvents.value.filter((ev: any) => {
        const start = ev.start?.dateTime || ev.start?.date;
        if (!start) return false;
        const ds = new Date(start);
        
        // Evitar duplicados: No mostrar eventos que nosotros mismos pusimos en GC (tienen 🚀)
        if (ev.summary?.startsWith('🚀')) return false;

        return ds.getDate() === d && ds.getMonth() === m && ds.getFullYear() === y;
    });

    return {
        day: d,
        current: d === new Date().getDate() && m === new Date().getMonth() && y === new Date().getFullYear(),
        items: [
            ...items,
            ...dayGoogleEvents.map(ev => ({ 
                label: ev.summary || ev.title, 
                type: ev.type === 'google_task' ? 'google_task' : 'google' 
            }))
        ],
        fullDate: new Date(date)
    };
};

const toggleDone = async (task: any) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await store.updateTask(task.id, { status: newStatus });
};

const deleteTask = async (id: number) => {
    if (confirm('¿Eliminar esta tarea y sus bloques de agenda?')) {
        await store.deleteTask(id);
    }
};

const prev = () => {
  const d = new Date(currentDate.value);
  if (viewMode.value === 'month') d.setMonth(d.getMonth() - 1);
  else d.setDate(d.getDate() - 7);
  currentDate.value = d;
};

const next = () => {
  const d = new Date(currentDate.value);
  if (viewMode.value === 'month') d.setMonth(d.getMonth() + 1);
  else d.setDate(d.getDate() + 7);
  currentDate.value = d;
};
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-fade-in text-left">
    
    <!-- Main Calendar Area -->
    <div class="xl:col-span-3 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-black text-slate-800 tracking-tight">Agenda <span class="text-blue-600">Pro</span></h2>
          <p class="text-slate-500 text-sm font-medium">Sincronización total con Google Workspace</p>
        </div>
        <div class="flex gap-2">
            <button @click="handleSync" :disabled="syncLoading" class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                <Clock :size="20" :class="{'animate-spin': syncLoading}" />
            </button>
            <div class="flex p-1 bg-slate-100 rounded-xl">
                <button v-for="mode in ['month', 'week']" :key="mode" @click="viewMode = mode as any" 
                    :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all', viewMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
                    {{ mode === 'month' ? 'Mes' : 'Semana' }}
                </button>
            </div>
        </div>
      </div>

      <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 class="text-xl font-bold text-slate-800 capitalize flex items-center gap-3">
              <CalendarIcon class="text-blue-500" />
              {{ monthName }}
          </h3>
          <div class="flex gap-2">
            <button @click="prev" class="p-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all shadow-sm">
              <ChevronLeft :size="20" class="text-slate-600" />
            </button>
            <button @click="next" class="p-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all shadow-sm">
              <ChevronRight :size="20" class="text-slate-600" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 uppercase tracking-[0.2em]">
          <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']" :key="day" class="py-4 text-center text-[10px] font-black text-slate-400">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7">
          <div 
            v-for="(date, index) in calendarDays" 
            :key="index"
            :class="['border-r border-b border-slate-50 p-3 min-h-[100px] md:min-h-[140px] transition-all hover:bg-blue-50/40 relative group', 
              { 'bg-slate-50/20': !date.day }]"
          >
            <div v-if="date.day" class="flex justify-between items-center mb-2">
              <span :class="['text-sm font-black', date.current ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-lg shadow-blue-200' : 'text-slate-400']">
                {{ date.day }}
              </span>
            </div>

            <div v-if="date.day" class="space-y-1.5">
              <div v-for="(item, i) in date.items.slice(0, 3)" :key="i" 
                   :class="['text-[10px] font-bold p-1.5 rounded-lg truncate border shadow-sm transition-transform hover:scale-[1.02]', 
                   item.type === 'google' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                   item.type === 'google_task' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                   item.status === 'completed' ? 'bg-slate-100 text-slate-400 border-slate-200 line-through' :
                   'bg-blue-50 text-blue-700 border-blue-100']">
                <span class="mr-1 opacity-70">{{ item.type === 'google' ? '📅' : item.type === 'google_task' ? '✅' : '📌' }}</span>
                {{ item.label }}
              </div>
              <div v-if="date.items.length > 3" class="text-[9px] text-slate-400 font-bold px-1">+ {{ date.items.length - 3 }} tareas</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar: Activity Multi-Manager -->
    <div class="xl:col-span-1 space-y-6">
      
      <!-- Sync Status Widget -->
      <div v-if="isFirstSync" class="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 border border-white/10">
        <CalendarIcon :size="32" class="mb-4 opacity-50" />
        <h4 class="font-bold text-xl mb-2">Google Sync</h4>
        <p class="text-white/80 text-sm leading-relaxed mb-6">Tus tareas locales y eventos de Google ahora viven en el mismo lugar.</p>
        <button @click="handleSync" :disabled="syncLoading" class="w-full bg-white text-blue-700 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2">
          <span>{{ syncLoading ? 'Vinculando...' : 'Activar Sincronización' }}</span>
        </button>
      </div>

      <!-- Live Task List -->
      <div class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div class="flex justify-between items-center mb-6">
          <h4 class="font-black text-slate-800 uppercase tracking-widest text-xs">Mis Actividades</h4>
          <span class="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black">{{ store.tasks.length }}</span>
        </div>

        <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="task in store.tasks" :key="task.id" 
            class="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg transition-all"
            :class="{'opacity-60': task.status === 'completed'}"
          >
            <div class="flex gap-3">
              <button @click="toggleDone(task)" 
                class="mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors"
                :class="task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-blue-500'"
              >
                <CheckCircle2 v-if="task.status === 'completed'" :size="12" />
              </button>
              
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h5 class="font-bold text-sm text-slate-800 leading-snug" :class="{'line-through text-slate-400': task.status === 'completed'}">
                    {{ task.title }}
                  </h5>
                  <div class="hidden group-hover:flex items-center gap-1">
                    <button @click="deleteTask(task.id!)" class="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
                
                <div class="flex items-center gap-2 mt-2">
                    <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md" 
                          :class="task.category === 'Trabajo' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'">
                        {{ task.category }}
                    </span>
                    <span v-if="task.auto_distribute" class="text-[10px] text-indigo-500 flex items-center gap-1 italic">
                        <Clock :size="10" /> Smart
                    </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="store.tasks.length === 0" class="text-center py-12">
              <Zap :size="32" class="mx-auto text-slate-200 mb-2" />
              <p class="text-xs text-slate-400 font-medium">No hay tareas pendientes</p>
          </div>
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
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
