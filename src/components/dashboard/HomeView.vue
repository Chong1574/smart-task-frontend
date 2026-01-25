<script setup lang="ts">
import { ref } from 'vue';
import TaskForm from './TaskForm.vue';
import TransactionForm from '../finance/TransactionForm.vue'; // Asegúrate de la ruta
import { ListTodo, Wallet } from 'lucide-vue-next';

const activeTab = ref<'task' | 'finance'>('task');
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Hola, TaskMan</h2>
        <p class="text-slate-500 text-sm">¿Qué vamos a registrar hoy?</p>
      </div>
      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
        TM
      </div>
    </div>

    <div class="flex p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
      <button 
        @click="activeTab = 'task'"
        :class="['flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm', activeTab === 'task' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50']"
      >
        <ListTodo :size="18" />
        Tarea
      </button>
      <button 
        @click="activeTab = 'finance'"
        :class="['flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm', activeTab === 'finance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50']"
      >
        <Wallet :size="18" />
        Transacción
      </button>
    </div>

    <div class="min-h-[400px]">
      <Transition name="fade" mode="out-in">
        <TaskForm v-if="activeTab === 'task'" />
        <TransactionForm v-else />
      </Transition>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>