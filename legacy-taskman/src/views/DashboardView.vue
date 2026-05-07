<script setup lang="ts">
import { ref } from 'vue';
import FinanceDashboard from '../components/finance/FinanceDashboard.vue';

const analyticsMode = ref<'tasks' | 'money'>('tasks');
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
      <div class="bg-white border border-slate-200 rounded-lg p-1 flex">
        <button 
          @click="analyticsMode = 'tasks'" 
          :class="['px-3 py-1 rounded-md text-xs font-bold transition-all', analyticsMode === 'tasks' ? 'bg-slate-100 text-slate-900' : 'text-slate-400']"
        >
          Tareas
        </button>
        <button 
          @click="analyticsMode = 'money'" 
          :class="['px-3 py-1 rounded-md text-xs font-bold transition-all', analyticsMode === 'money' ? 'bg-slate-100 text-slate-900' : 'text-slate-400']"
        >
          Finanzas
        </button>
      </div>
    </div>

    <!-- Analytics Content -->
    <div v-if="analyticsMode === 'tasks'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
        </div>
        <h4 class="font-bold text-slate-800">Productividad</h4>
        <p class="text-slate-400 text-sm mt-1">Gráfica en desarrollo...</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h4 class="font-bold text-slate-800">Retrasos</h4>
        <p class="text-slate-400 text-sm mt-1">Métricas de tiempo próximas...</p>
      </div>
    </div>

    <FinanceDashboard v-else-if="analyticsMode === 'money'" />
  </div>
</template>
