<script setup lang="ts">
import { ref } from 'vue';
import { 
  LayoutDashboard, 
  Wallet, 
  ListTodo, // Icono para "Task"
  Settings,
  Menu, // Para el botón de menú en móvil si lo necesitaras
  X
} from 'lucide-vue-next';

// Componentes actuales
import TaskForm from './components/dashboard/TaskForm.vue';
import TaskList from './components/dashboard/TaskList.vue'; // Asumo que ya creaste este archivo
// Componentes futuros (puedes descomentarlos cuando los creemos)
// Arriba en el <script setup>
import FinanceView from './components/finance/FinanceView.vue';
// import AnalyticsView from './components/dashboard/AnalyticsView.vue';

// Estado de la navegación
type ViewState = 'task' | 'dashboard' | 'finance';
const currentView = ref<ViewState>('task'); // 'task' es la vista inicial por defecto

const sidebarItems = [
  { id: 'task', label: 'Task', icon: ListTodo },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'finance', label: 'Finanzas', icon: Wallet },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-inter">
    
    <nav class="bg-white border-r border-gray-200 w-full md:w-64 p-4 flex md:flex-col justify-between md:justify-start gap-2 fixed bottom-0 md:relative z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none safe-area-bottom">
      
      <div class="hidden md:flex items-center gap-2 mb-8 px-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
          <span class="text-white font-bold tracking-tighter">TM</span>
        </div>
        <span class="text-xl font-bold text-slate-800 tracking-tight">TaskMan</span>
      </div>
      
      <button 
        v-for="item in sidebarItems" 
        :key="item.id"
        @click="currentView = item.id as ViewState"
        :class="[
          'flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl w-full transition-all duration-200',
          currentView === item.id 
            ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
        ]"
      >
        <component :is="item.icon" :size="20" :stroke-width="currentView === item.id ? 2.5 : 2" />
        <span class="text-[10px] md:text-sm">{{ item.label }}</span>
      </button>

      <div class="hidden md:block md:flex-1"></div>

      <button class="hidden md:flex flex-row items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 w-full mt-auto">
        <Settings :size="20" />
        <span class="text-sm font-medium">Configuración</span>
      </button>
    </nav>

    <main class="flex-1 p-4 md:p-8 mb-20 md:mb-0 overflow-y-auto h-screen">
      
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 capitalize">{{ currentView }}</h1>
          <p class="text-slate-500 text-sm">
            <span v-if="currentView === 'task'">Gestiona tu día y automatiza tu agenda.</span>
            <span v-else-if="currentView === 'dashboard'">Métricas y rendimiento en tiempo real.</span>
            <span v-else>Control total de tus cuentas y gastos.</span>
          </p>
        </div>
        
        <div class="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 min-w-[120px]">
            <p class="text-[10px] uppercase font-bold text-slate-400">Tareas Hoy</p>
            <p class="text-lg font-bold text-slate-800">5 <span class="text-slate-400 text-sm font-normal">/ 8</span></p>
          </div>
          <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 min-w-[120px]">
             <p class="text-[10px] uppercase font-bold text-slate-400">Disponible</p>
            <p class="text-lg font-bold text-green-600">$2,450</p>
          </div>
        </div>
      </header>

      <div v-if="currentView === 'task'" class="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
        <div class="xl:col-span-4 space-y-6">
          <TaskForm />
          <TaskList /> 
        </div>

        <div class="xl:col-span-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col relative overflow-hidden">
            <div class="flex justify-between items-center mb-6 z-10">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                Agenda Inteligente
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">Auto</span>
              </h3>
              <div class="flex bg-slate-100 p-1 rounded-lg">
                <button class="px-3 py-1 text-xs font-medium bg-white text-slate-800 shadow-sm rounded-md transition-all">Semana</button>
                <button class="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-all">Mes</button>
              </div>
            </div>
            
            <div class="flex-1 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
              <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-400">
                <ListTodo :size="32" />
              </div>
              <p class="text-slate-500 font-medium">Aquí visualizarás tus bloques de tiempo</p>
              <p class="text-slate-400 text-sm mt-2 max-w-xs">Cuando integremos Node.js, tus tareas se distribuirán automáticamente aquí.</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentView === 'dashboard'" class="animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center h-64">
             <p class="text-slate-400">Gráficas de Tendencias (Próximamente)</p>
           </div>
           <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center h-64">
             <p class="text-slate-400">Análisis de Retrasos (Próximamente)</p>
           </div>
        </div>
      </div>

      <div v-else-if="currentView === 'finance'" class="animate-fade-in">
          <FinanceView />
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Animación suave al cambiar de pestañas */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Ajuste para móviles: evitar que la navegación tape el contenido */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>