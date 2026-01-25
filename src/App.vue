<script setup lang="ts">
import { ref } from 'vue';
import { Home, BarChart2, CreditCard } from 'lucide-vue-next'; // Iconos nuevos

// Vistas
import HomeView from './components/dashboard/HomeView.vue';
import FinanceView from './components/finance/FinanceView.vue';
import FinanceDashboard from './components/finance/FinanceDashboard.vue';
// Aquí pondremos el Dashboard unificado más adelante
// import AnalyticsView from './components/dashboard/AnalyticsView.vue'; 

type ViewState = 'home' | 'analytics' | 'wallet';
const currentView = ref<ViewState>('home');
const analyticsMode = ref<'tasks' | 'money'>('tasks'); // Estado interno del dashboard

const sidebarItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'analytics', label: 'Dashboard', icon: BarChart2 },
  { id: 'wallet', label: 'Wallet', icon: CreditCard },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-inter">
    
    <nav class="bg-white border-t md:border-r border-gray-200 w-full md:w-64 p-2 md:p-4 flex md:flex-col justify-around md:justify-start gap-1 fixed bottom-0 md:relative z-50 shadow-lg md:shadow-none pb-safe">
      <div class="hidden md:flex items-center gap-2 mb-8 px-2">
        <span class="text-xl font-bold text-slate-800">TaskMan</span>
      </div>
      
      <button 
        v-for="item in sidebarItems" 
        :key="item.id"
        @click="currentView = item.id as ViewState"
        :class="['flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl w-full transition-all', currentView === item.id ? 'text-blue-600 font-bold' : 'text-slate-400 font-medium']"
      >
        <component :is="item.icon" :size="24" :stroke-width="currentView === item.id ? 2.5 : 2" />
        <span class="text-[10px] md:text-sm">{{ item.label }}</span>
      </button>
    </nav>

    <main class="flex-1 p-4 md:p-8 mb-20 md:mb-0 overflow-y-auto">
      
      <HomeView v-if="currentView === 'home'" />

      <div v-else-if="currentView === 'analytics'" class="animate-fade-in space-y-6">
        
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-slate-800">Métricas</h2>
          <div class="bg-white border border-slate-200 rounded-lg p-1 flex">
             <button @click="analyticsMode = 'tasks'" :class="['px-3 py-1 rounded-md text-xs font-bold transition-all', analyticsMode === 'tasks' ? 'bg-slate-100 text-slate-900' : 'text-slate-400']">Tareas</button>
             <button @click="analyticsMode = 'money'" :class="['px-3 py-1 rounded-md text-xs font-bold transition-all', analyticsMode === 'money' ? 'bg-slate-100 text-slate-900' : 'text-slate-400']">Finanzas</button>
          </div>
        </div>

        <div v-if="analyticsMode === 'tasks'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center">
             <p class="text-slate-400 italic">Gráfica de Productividad</p>
           </div>
           <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center">
             <p class="text-slate-400 italic">Tendencia de Retrasos</p>
           </div>
        </div>

        <FinanceDashboard v-else-if="analyticsMode === 'money'" />
      </div>

      <FinanceView v-else-if="currentView === 'wallet'" />

    </main>
  </div>
</template>

<style>
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>