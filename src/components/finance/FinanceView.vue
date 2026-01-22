<script setup lang="ts">
import { computed } from 'vue';
import { useFinanceStore } from '../../stores/financeStore';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-vue-next';

const store = useFinanceStore();

// Formateador de moneda
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Formateador de fecha
const formatDate = (isoStr: string) => {
  return new Date(isoStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};
</script>

<template>
  <div class="space-y-6 pb-20">
    
    <div class="flex justify-between items-end px-2">
      <div>
        <p class="text-sm text-slate-400 font-medium uppercase tracking-wider">Balance Total</p>
        <h2 class="text-3xl font-bold text-slate-800">{{ formatMoney(store.totalBalance) }}</h2>
      </div>
      <button class="bg-slate-900 text-white p-3 rounded-full shadow-lg shadow-slate-300 active:scale-95 transition-all">
        <Plus :size="24" />
      </button>
    </div>

    <div class="overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar flex gap-4 snap-x">
      <div v-for="acc in store.accounts" :key="acc.id" 
           :class="['flex-shrink-0 w-72 h-44 rounded-2xl p-6 flex flex-col justify-between text-white shadow-lg snap-center bg-gradient-to-br', acc.color]">
        
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-medium opacity-80 uppercase">{{ acc.type }}</p>
            <p class="font-bold text-lg tracking-wide">{{ acc.name }}</p>
          </div>
          <CreditCard :size="24" class="opacity-60" />
        </div>

        <div>
          <p class="text-xs opacity-70 mb-1">Saldo Disponible</p>
          <p class="text-2xl font-mono font-bold">{{ formatMoney(acc.balance) }}</p>
        </div>
      </div>
      
      <div class="flex-shrink-0 w-16 h-44 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 snap-center">
        <Plus :size="24" />
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 class="font-bold text-slate-800 mb-4 text-lg">Últimos Movimientos</h3>
      
      <div class="space-y-4">
        <div v-for="tx in store.transactions" :key="tx.id" class="flex items-center justify-between group">
          
          <div class="flex items-center gap-4">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center', 
              tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'
            ]">
              <TrendingUp v-if="tx.type === 'income'" :size="18" />
              <TrendingDown v-else :size="18" />
            </div>
            
            <div>
              <p class="font-bold text-slate-800 text-sm">{{ tx.category }}</p>
              <p class="text-xs text-slate-400">{{ tx.description }} • {{ formatDate(tx.date) }}</p>
            </div>
          </div>

          <p :class="['font-bold text-sm', tx.type === 'income' ? 'text-green-600' : 'text-slate-800']">
            {{ tx.type === 'income' ? '+' : '-' }} {{ formatMoney(tx.amount) }}
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ocultar scrollbar en navegadores Webkit (Chrome/Safari) para look nativo */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>