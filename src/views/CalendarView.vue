<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-vue-next';
import { useFinanceStore } from '../stores/financeStore';

const currentDate = ref(new Date());
const viewMode = ref<'month' | 'week' | 'day'>('month');
const googleEvents = ref<any[]>([]);

const syncLoading = ref(false);
const syncStatus = ref(''); 
const isFirstSync = ref(true);

onMounted(async () => {
    // Intentar sync automático al entrar
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
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.message;
        
        syncStatus.value = 'error';
        if (status === 400 || status === 401) {
            if (confirm(`Problema de autenticación: ${msg}\n\n¿Deseas intentar vincular tu cuenta nuevamente?`)) {
                const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
                window.location.href = `${apiBase}/auth/google`;
            }
        } else {
            alert(`Error del Servidor: ${msg}\n\nPosible causa: ¿Está activa la API de Google Calendar en tu Google Console?`);
        }
    } finally {
        syncLoading.value = false;
    }
};

import api from '../api';

const monthName = computed(() => {
  if (viewMode.value === 'day') {
      return currentDate.value.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  }
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
        const d = date.getDate();
        days.push(createDayObject(new Date(date)));
        date.setDate(d + 1);
    }
  } else if (viewMode.value === 'week') {
    const date = new Date(currentDate.value);
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek); // Go to Sunday
    for (let i = 0; i < 7; i++) {
        days.push(createDayObject(new Date(date)));
        date.setDate(date.getDate() + 1);
    }
  } else {
    days.push(createDayObject(new Date(currentDate.value)));
  }
  
  return days;
});

const createDayObject = (date: Date) => {
    if (!date) return { day: null, current: false, items: [], fullDate: null };
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    const tasks = store.tasks || [];
    const dayTasks = tasks.filter((t: any) => {
        if (t.deadline) {
            const dt = new Date(t.deadline);
            if (dt.getDate() === d && dt.getMonth() === m && dt.getFullYear() === y) return true;
        }
        // Also check task blocks
        if (t.blocks) {
            return t.blocks.some((b: any) => {
                const db = new Date(b.start);
                return db.getDate() === d && db.getMonth() === m && db.getFullYear() === y;
            });
        }
        return false;
    });

    const items: any[] = [];
    dayTasks.forEach((t: any) => {
        if (t.blocks) {
            t.blocks.forEach((b: any) => {
                const db = new Date(b.start);
                if (db.getDate() === d && db.getMonth() === m && db.getFullYear() === y) {
                    items.push({ label: t.title, type: 'task_block', start: b.start });
                }
            });
        } else if (t.deadline) {
             const dt = new Date(t.deadline);
             if (dt.getDate() === d && dt.getMonth() === m && dt.getFullYear() === y) {
                 items.push({ label: t.title, type: 'task' });
             }
        }
    });

    const gEvents = Array.isArray(googleEvents.value) ? googleEvents.value : [];
    const dayGoogleEvents = gEvents.filter((ev: any) => {
        if (!ev.start) return false;
        const start = ev.start.dateTime || ev.start.date;
        if (!start) return false;
        const ds = new Date(start);
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

const store = useFinanceStore();

const prev = () => {
  const d = new Date(currentDate.value);
  if (viewMode.value === 'month') d.setMonth(d.getMonth() - 1);
  else if (viewMode.value === 'week') d.setDate(d.getDate() - 7);
  else d.setDate(d.getDate() - 1);
  currentDate.value = d;
};

const next = () => {
  const d = new Date(currentDate.value);
  if (viewMode.value === 'month') d.setMonth(d.getMonth() + 1);
  else if (viewMode.value === 'week') d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 1);
  currentDate.value = d;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in text-left">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Calendario Inteligente</h2>
        <p class="text-slate-500 text-sm">Organiza tus tareas en el tiempo</p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
        <Plus :size="18" />
        Agendar Tarea
      </button>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <!-- Calendar Header -->
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div class="flex items-center gap-4">
            <h3 class="text-lg font-bold text-slate-800 capitalize">{{ monthName }}</h3>
            <div class="flex p-1 bg-slate-100 rounded-lg">
                <button v-for="mode in ['month', 'week', 'day']" :key="mode" @click="viewMode = mode as any" 
                    :class="['px-3 py-1 text-[10px] font-bold rounded-md transition-all', viewMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
                    {{ mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Día' }}
                </button>
            </div>
        </div>

        <div class="flex gap-2">
          <button @click="prev" class="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
            <ChevronLeft :size="20" class="text-slate-600" />
          </button>
          <button @click="next" class="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
            <ChevronRight :size="20" class="text-slate-600" />
          </button>
        </div>
      </div>

      <!-- Days Header -->
      <div v-if="viewMode !== 'day'" class="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
        <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']" :key="day" class="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div :class="['grid', viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7']">
        <div 
          v-for="(date, index) in calendarDays" 
          :key="index"
          :class="['border-r border-b border-slate-50 p-2 transition-all hover:bg-blue-50/30 group relative', 
            viewMode === 'day' ? 'min-h-[300px]' : 'h-24 md:h-32',
            { 'bg-slate-50/20': !date.day }]"
        >
          <div class="flex justify-between items-start">
            <span v-if="date.day" :class="['text-sm font-bold', date.current ? 'bg-blue-600 text-white min-w-[28px] h-7 flex items-center justify-center rounded-full px-1.5' : 'text-slate-600']">
              {{ date.day }}
            </span>
            <span v-if="(viewMode === 'week' || viewMode === 'day') && date.fullDate" class="text-[10px] font-bold text-slate-400 uppercase">
                {{ date.fullDate.toLocaleDateString('es-MX', { weekday: 'short' }) }}
            </span>
          </div>

          <!-- Event Indicators -->
          <div v-if="date.day && date.items.length > 0" class="mt-2 space-y-1">
            <div v-for="(item, i) in date.items.slice(0, 2)" :key="i" 
                 :class="['text-[9px] font-bold p-1 rounded-md truncate border', 
                 item.type === 'google' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                 item.type === 'google_task' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                 'bg-blue-100 text-blue-600 border-blue-200']">
              {{ item.type === 'google' ? '📅' : item.type === 'google_task' ? '✅' : '📌' }} {{ item.label }}
            </div>
            <div v-if="date.items.length > 2" class="text-[8px] text-slate-400 font-bold px-1">+ {{ date.items.length - 2 }} más</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Side Panel -->
    <div v-if="isFirstSync" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm self-start">
        <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock :size="18" class="text-blue-500" />
          Próximos Eventos
        </h4>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center font-bold">
              <span class="text-xs">FEB</span>
              <span class="text-lg leading-none">{{ 24 + i }}</span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-slate-800 text-sm">Llamada de sincronización Google</p>
              <p class="text-[11px] text-slate-400">10:00 AM - 11:30 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <CalendarIcon :size="32" class="mb-4 opacity-50" />
        <h4 class="font-bold text-xl mb-2">Sincronización</h4>
        <p class="text-white/80 text-sm leading-relaxed mb-6">Conecta tus calendarios de Google o Outlook para agendar tareas automáticamente según tu disponibilidad real.</p>
        <button @click="handleSync" :disabled="syncLoading" class="w-full bg-white text-blue-700 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
          <span v-if="syncLoading">Sincronizando...</span>
          <span v-else>Configurar Sync</span>
        </button>
        <div class="mt-2 text-center">
            <p v-if="syncStatus === 'success'" class="text-[10px] text-emerald-200 font-bold animate-bounce">✓ ¡Calendario Actualizado!</p>
            <p v-if="syncStatus === 'error'" class="text-[10px] text-red-200 font-bold">✕ Sincronización Fallida</p>
        </div>
      </div>
    </div>
  </div>
</template>
