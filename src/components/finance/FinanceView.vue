<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFinanceStore, type Account } from '../../stores/financeStore';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Plus, ArrowUpRight, ArrowDownLeft, X, Trash2, Pencil } from 'lucide-vue-next';
import TransactionForm from './TransactionForm.vue';
import AccountForm from './AccountForm.vue';

const store = useFinanceStore();
const isFormOpen = ref(false);
const isAccountFormOpen = ref(false);
const editingAccount = ref<Account | null>(null);

onMounted(() => {
  store.initialize();
});

const handleEditAccount = (acc: Account) => {
    editingAccount.value = acc;
    isAccountFormOpen.value = true;
};

const handleCloseForm = () => {
    isAccountFormOpen.value = false;
    editingAccount.value = null; // Clear edit state
};

const handleDeleteAccount = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cuenta? Se eliminarán todas sus transacciones.')) {
        await store.deleteAccount(id);
    }
};

// ...

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
    </div>

    <!-- Form Container with Transition -->
    <div v-show="isFormOpen" class="transition-all duration-300 ease-in-out origin-top">
        <TransactionForm />
    </div>

    <!-- Account Form Modal -->
    <AccountForm v-if="isAccountFormOpen" :initialData="editingAccount" @close="handleCloseForm" />

    <div class="overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar flex gap-4 snap-x">
      <div v-for="acc in store.accounts" :key="acc.id" 
           :class="['group relative flex-shrink-0 w-72 h-44 rounded-2xl p-6 flex flex-col justify-between text-white shadow-lg snap-center bg-gradient-to-br transition-transform hover:scale-[1.02]', acc.color]">
        
        <!-- Actions Overlay -->
        <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="handleEditAccount(acc)" class="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 backdrop-blur-sm" title="Editar">
                <Pencil :size="14" class="text-white" />
            </button>
            <button @click="handleDeleteAccount(acc.id)" class="p-1.5 bg-white/20 rounded-lg hover:bg-red-500/80 backdrop-blur-sm transition-colors" title="Eliminar">
                <Trash2 :size="14" class="text-white" />
            </button>
        </div>

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
      
      <button @click="isAccountFormOpen = true" class="cursor-pointer flex-shrink-0 w-16 h-44 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-400 snap-center hover:bg-slate-50 hover:text-slate-600 hover:border-slate-400 transition-all">
        <Plus :size="24" />
        <span class="text-[10px] font-bold uppercase">Add</span>
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-slate-800 text-lg">Últimos Movimientos</h3>
        <button @click="isFormOpen = !isFormOpen" class="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
          {{ isFormOpen ? 'Cerrar' : '+ Registrar' }}
        </button>
      </div>
      
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