<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFinanceStore, type Account } from '../../stores/financeStore';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Plus, Trash2, Pencil, Zap, CreditCard as CardIcon, List, Calendar } from 'lucide-vue-next';
import TransactionForm from './TransactionForm.vue';
import AccountForm from './AccountForm.vue';
import SubscriptionsSection from './SubscriptionsSection.vue';

const store = useFinanceStore();
const activeTab = ref('memberships'); // 'memberships', 'accounts', 'transactions'
const isFormOpen = ref(false); // For transactions
const isAccountFormOpen = ref(false); // For accounts
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
    editingAccount.value = null; 
};

const handleDeleteAccount = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cuenta? Se eliminarán todas sus transacciones.')) {
        await store.deleteAccount(id);
    }
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

const formatDate = (isoStr: string) => {
  return new Date(isoStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};

// --- Helpers for Account Grouping ---
const groupedAccounts = computed(() => {
    const groups: Record<string, { accounts: Account[], total: number }> = {};
    const sorted = [...store.accounts].sort((a, b) => b.balance - a.balance);
    
    sorted.forEach(acc => {
        let key = acc.type as string;
        if (acc.type === 'card') {
            key = acc.sub_type === 'credit' ? 'card_credit' : 'card_debit';
        }
        
        if (!groups[key]) {
            groups[key] = { accounts: [], total: 0 };
        }
        groups[key]!.accounts.push(acc);
        groups[key]!.total += Number(acc.balance);
    });
    return groups;
});

const getTypeName = (type: string) => {
    const names: Record<string, string> = {
        'card_credit': 'Tarjetas de Crédito',
        'card_debit': 'Tarjetas de Débito',
        'loan': 'Préstamos y Deudas',
        'investment': 'Inversiones',
        'cash': 'Efectivo',
        'savings': 'Ahorros'
    };
    return names[type] || type;
};

const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
        'card_credit': 'bg-pink-500',
        'card_debit': 'bg-blue-400',
        'loan': 'bg-red-500',
        'investment': 'bg-emerald-500',
        'cash': 'bg-orange-500',
        'savings': 'bg-blue-600'
    };
    return colors[type] || 'bg-slate-500';
};

const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
        'WEEKLY': 'Semanal',
        'BIWEEKLY': 'Quincenal',
        'MONTHLY': 'Mensual'
    };
    return labels[freq] || 'Fijo';
};
</script>

<template>
  <div class="space-y-6 pb-20">
    
    <!-- Header Global: Balance -->
    <div class="flex justify-between items-end px-2">
      <div>
        <p class="text-sm text-slate-400 font-medium uppercase tracking-wider">Balance Total</p>
        <h2 class="text-3xl font-bold text-slate-800">{{ formatMoney(store.totalBalance) }}</h2>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
        <button 
            @click="activeTab = 'memberships'"
            :class="['flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all', activeTab === 'memberships' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
            <Zap :size="16" />
            Membresías
        </button>
        <button 
            @click="activeTab = 'accounts'"
            :class="['flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all', activeTab === 'accounts' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
            <CardIcon :size="16" />
            Cuentas
        </button>
        <button 
            @click="activeTab = 'transactions'"
            :class="['flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all', activeTab === 'transactions' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
            <List :size="16" />
            Movimientos
        </button>
    </div>

    <!-- TAB: MEMBRESIAS -->
    <div v-if="activeTab === 'memberships'" class="animate-fade-in">
        <SubscriptionsSection />
    </div>

    <!-- TAB: CUENTAS -->
    <div v-if="activeTab === 'accounts'" class="animate-fade-in space-y-8">
        <!-- Header with Add Button -->
        <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mx-2">
            <div>
                <h3 class="font-bold text-slate-800 text-lg">Mis Finanzas</h3>
                <p class="text-xs text-slate-400">Administra tus tarjetas, cuentas y deudas</p>
            </div>
            <button @click="isAccountFormOpen = true" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95">
                <Plus :size="18" />
                Nueva Cuenta
            </button>
        </div>

        <!-- Grouped Accounts -->
        <div v-for="(group, type) in groupedAccounts" :key="type" class="space-y-4">
            <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-2">
                    <div class="h-1 w-8 rounded-full" :class="getTypeColor(type)"></div>
                    <h4 class="font-bold text-slate-600 text-xs uppercase tracking-widest">{{ getTypeName(type) }}</h4>
                    <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{{ group.accounts.length }}</span>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-slate-400 font-bold uppercase mr-2">Subtotal:</span>
                    <span class="text-sm font-black text-slate-700">{{ formatMoney(group.total) }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2">
                <div v-for="acc in group.accounts" :key="acc.id" 
                     :class="['group relative h-44 rounded-2xl p-6 flex flex-col justify-between text-white shadow-lg bg-gradient-to-br transition-all hover:translate-y-[-4px] hover:shadow-xl', acc.color]">
                    
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
                            <div class="flex items-center gap-1.5 opacity-80 mb-0.5">
                                <p class="text-[10px] font-bold uppercase tracking-tighter">{{ acc.sub_type !== 'n/a' ? acc.sub_type : acc.type }}</p>
                                <span v-if="acc.interest_rate > 0" class="text-[8px] bg-white/20 px-1 rounded">
                                    {{ acc.interest_rate }}% {{ acc.type === 'investment' ? 'GAT' : '' }}
                                </span>
                            </div>
                            <p class="font-bold text-lg leading-tight">{{ acc.name }}</p>
                        </div>
                        <CreditCard v-if="acc.type === 'card'" :size="24" class="opacity-60" />
                        <Wallet v-else-if="acc.type === 'cash' || acc.type === 'savings'" :size="24" class="opacity-60" />
                        <TrendingDown v-else-if="acc.type === 'loan'" :size="24" class="opacity-60" />
                        <TrendingUp v-else :size="24" class="opacity-60" />
                    </div>

                    <div>
                        <p class="text-[10px] opacity-70 mb-0.5 uppercase font-medium">
                            {{ acc.type === 'card' && acc.sub_type === 'credit' ? 'Crédito Disponible' : 'Saldo Disponible' }}
                        </p>
                        <div class="flex items-baseline gap-1">
                            <p class="text-2xl font-mono font-black tracking-tighter">
                                {{ 
                                    acc.type === 'card' && acc.sub_type === 'credit' 
                                    ? formatMoney(Number(acc.credit_limit) + Number(acc.balance)).split('.')[0]
                                    : formatMoney(acc.balance).split('.')[0] 
                                }}
                            </p>
                            <p class="text-sm font-mono opacity-80">
                                {{ 
                                    acc.type === 'card' && acc.sub_type === 'credit'
                                    ? (formatMoney(Number(acc.credit_limit) + Number(acc.balance)).split('.')[1] ? '.' + formatMoney(Number(acc.credit_limit) + Number(acc.balance)).split('.')[1] : '')
                                    : (formatMoney(acc.balance).split('.')[1] ? '.' + formatMoney(acc.balance).split('.')[1] : '')
                                }}
                            </p>
                        </div>
                        <!-- Extra info for credit cards -->
                        <div v-if="acc.type === 'card' && acc.sub_type === 'credit'" class="mt-1 space-y-1">
                            <div class="flex justify-between items-center opacity-60 text-[9px] font-bold uppercase">
                                <span>Deuda: {{ formatMoney(acc.balance) }}</span>
                                <span>Límite: {{ formatMoney(acc.credit_limit) }}</span>
                            </div>
                            <div v-if="acc.monthly_payment > 0 || acc.payment_day > 0" class="flex justify-between items-center opacity-90 text-[10px] bg-white/10 px-2 py-1 rounded-lg font-black uppercase">
                                <span class="flex items-center gap-1"><Calendar :size="10" /> {{ acc.payment_day ? 'Día ' + acc.payment_day : 'S/F' }}</span>
                                <span>{{ acc.monthly_payment > 0 ? formatMoney(acc.monthly_payment) + ' (' + getFrequencyLabel(acc.payment_frequency) + ')' : 'Pago Var.' }}</span>
                            </div>
                        </div>

                        <!-- Extra info for loans -->
                        <div v-if="acc.type === 'loan'" class="mt-1 space-y-1">
                            <div v-if="acc.monthly_payment > 0 || acc.payment_day > 0" class="flex justify-between items-center opacity-90 text-[10px] bg-white/10 px-2 py-1 rounded-lg font-black uppercase">
                                <span class="flex items-center gap-1"><Calendar :size="10" /> {{ acc.payment_day ? 'Día ' + acc.payment_day : 'S/F' }}</span>
                                <span>{{ formatMoney(acc.monthly_payment) }} ({{ getFrequencyLabel(acc.payment_frequency) }})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="store.accounts.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
            <Wallet :size="48" class="mb-4 opacity-20" />
            <p class="font-medium">No tienes cuentas registradas</p>
            <button @click="isAccountFormOpen = true" class="mt-4 text-blue-600 font-bold text-sm hover:underline">
                Comienza agregando tu primera cuenta
            </button>
        </div>
    </div>

    <!-- TAB: TRANSACTION LIST -->
    <div v-if="activeTab === 'transactions'" class="animate-fade-in space-y-6">
        <!-- Add Button -->
         <button @click="isFormOpen = !isFormOpen" class="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg active:scale-95 transition-all">
            {{ isFormOpen ? 'Cancelar Registro' : '+ Registrar Nuevo Movimiento' }}
         </button>

         <div v-show="isFormOpen" class="transition-all duration-300 ease-in-out origin-top text-left">
            <TransactionForm />
         </div>

        <!-- List -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-left">
          <h3 class="font-bold text-slate-800 text-lg mb-4">Historial de Movimientos</h3>
          
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
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-slate-800 text-sm">{{ tx.category }}</p>
                    <span v-if="tx.account" class="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{{ tx.account.name }}</span>
                  </div>
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

    <!-- Modals (Always available) -->
    <AccountForm v-if="isAccountFormOpen" :initialData="editingAccount" @close="handleCloseForm" />

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>