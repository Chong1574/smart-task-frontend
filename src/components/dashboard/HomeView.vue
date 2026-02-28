<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TaskForm from './TaskForm.vue';
import TransactionForm from '../finance/TransactionForm.vue';
import { ListTodo, Wallet, Clock, TrendingUp } from 'lucide-vue-next';
import { useFinanceStore } from '../../stores/financeStore';

const store = useFinanceStore();
const activeTab = ref<'task' | 'finance'>('task');

const recentTransactions = computed(() => store.transactions.slice(0, 5));
const recentTasks = computed(() => store.tasks.slice(0, 5));

onMounted(() => {
    store.initialize();
});

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
    
    <!-- Main Form Section -->
    <div class="lg:col-span-2 space-y-6">
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

    <!-- Right Summary Panel (Desktop Only) -->
    <div class="hidden lg:flex flex-col gap-6">
      
      <!-- Recent Movements -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div class="flex justify-between items-center mb-4">
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingUp :size="16" class="text-emerald-500" />
                Últimos Movimientos
            </h4>
            <router-link to="/wallet" class="text-[10px] font-bold text-blue-600 hover:underline">Ver Todo</router-link>
        </div>

        <div class="space-y-3">
            <div v-for="tx in recentTransactions" :key="tx.id" class="flex items-center justify-between group">
                <div class="flex items-center gap-3">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-[10px]', tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500']">
                        {{ tx.type === 'income' ? '+' : '-' }}
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-700 truncate w-24">{{ tx.category }}</p>
                        <p class="text-[9px] text-slate-400">{{ tx.account?.name || 'Cuenta' }}</p>
                    </div>
                </div>
                <span :class="['text-xs font-black', tx.type === 'income' ? 'text-emerald-600' : 'text-slate-700']">
                    {{ formatMoney(tx.amount) }}
                </span>
            </div>
            <div v-if="recentTransactions.length === 0" class="text-center py-4 text-slate-300 text-xs italic">
                Sin movimientos recientes
            </div>
        </div>
      </div>

      <!-- Upcoming Tasks -->
      <div class="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
        
        <div class="flex justify-between items-center mb-4">
            <h4 class="font-bold text-sm flex items-center gap-2">
                <Clock :size="16" />
                Próximas Tareas
            </h4>
            <router-link to="/calendar" class="text-[10px] font-bold text-blue-100 hover:text-white transition-colors">Calendario</router-link>
        </div>

        <div class="space-y-4">
            <div v-for="task in recentTasks" :key="task.id" class="flex items-start gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div class="mt-1 w-2 h-2 rounded-full bg-blue-300"></div>
                <div>
                    <p class="text-xs font-bold leading-tight">{{ task.title }}</p>
                    <p class="text-[9px] text-blue-100 mt-1">{{ task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sin fecha' }}</p>
                </div>
            </div>
            <div v-if="recentTasks.length === 0" class="text-center py-4 text-white/40 text-xs italic">
                Agendate una tarea pronto
            </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>