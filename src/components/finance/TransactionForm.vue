<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFinanceStore, type TransactionType } from '../../stores/financeStore';
import { DollarSign, Tag, FileText, CreditCard, PlusCircle, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, ArrowRight, TrendingUp } from 'lucide-vue-next';

const store = useFinanceStore();

// Estado del formulario
// Allow 'interest' as a temporary UI type
const form = ref({
  type: 'expense' as TransactionType | 'interest',
  amount: 0 as number | '',
  accountId: store.accounts[0]?.id || 0,
  destinationAccountId: 0,
  category: 'Comida',
  description: ''
});

// Lógica de Transferencia
const isTransferType = computed(() => {
  return ['credit_payment', 'loan_payment', 'transfer'].includes(form.value.type);
});

// Cuentas de Origen
const sourceAccounts = computed(() => {
  if (isTransferType.value) {
    return store.accounts.filter(a => ['card', 'cash', 'savings'].includes(a.type) && a.sub_type !== 'credit');
  }
  return store.accounts;
});

// Cuentas de Destino
const destinationAccounts = computed(() => {
  if (form.value.type === 'credit_payment') {
    return store.accounts.filter(a => a.type === 'card' && a.sub_type === 'credit');
  }
  if (form.value.type === 'loan_payment') {
    return store.accounts.filter(a => a.type === 'loan');
  }
  if (form.value.type === 'transfer') {
    return store.accounts.filter(a => a.id !== form.value.accountId);
  }
  return [];
});

// Lógica para Nueva Categoría
const isAddingCategory = ref(false);
const newCategoryTemp = ref('');

const handleCategoryChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  if (val === 'NEW_CAT_TRIGGER') {
    isAddingCategory.value = true;
    form.value.category = '';
  } else {
    isAddingCategory.value = false;
    form.value.category = val;
  }
};

const saveNewCategory = () => {
  if (newCategoryTemp.value.trim()) {
    store.addCategory(newCategoryTemp.value);
    form.value.category = newCategoryTemp.value;
    isAddingCategory.value = false;
    newCategoryTemp.value = '';
  }
};

// Tipos de transacción visuales
const transactionTypes = [
  { id: 'expense', label: 'Gasto / Compra', icon: ArrowDownLeft, color: 'text-red-500 bg-red-50' },
  { id: 'income', label: 'Ingreso', icon: ArrowUpRight, color: 'text-green-600 bg-green-50' },
  { id: 'transfer', label: 'Transferencia', icon: ArrowRight, color: 'text-slate-600 bg-slate-50' },
  { id: 'credit_payment', label: 'Pagar Tarjeta', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
  { id: 'loan_payment', label: 'Pagar Crédito', icon: RefreshCw, color: 'text-orange-600 bg-orange-50' },
  { id: 'interest', label: 'Cargar Interés', icon: TrendingUp, color: 'text-yellow-600 bg-yellow-50' },
];

const submit = () => {
  if (!form.value.amount || form.value.amount <= 0) return;
  
  let finalType = form.value.type;
  let finalCategory = form.value.category;

  // Map 'interest' to expense + category
  if (form.value.type === 'interest') {
      finalType = 'expense';
      finalCategory = 'Intereses';
  }

  // Payload
  const payload: any = {
    type: finalType,
    amount: Number(form.value.amount),
    accountId: form.value.accountId,
    category: finalCategory,
    description: form.value.description,
    date: new Date().toISOString()
  };

  // Adjuntar cuenta destino si es transferencia
  if (isTransferType.value && form.value.destinationAccountId) {
    payload.destinationAccountId = form.value.destinationAccountId;
  }
  
  store.addTransaction(payload);
  
  // Reset fields (but keep type/category potentially or reset? usually keep type)
  form.value.amount = '';
  form.value.description = '';
};
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in">
    
    <div class="flex gap-2 overflow-x-auto pb-4 mb-2 custom-scrollbar">
      <button 
        v-for="t in transactionTypes" 
        :key="t.id"
        @click="form.type = t.id as any"
        :class="['flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border', 
          form.type === t.id ? `${t.color} border-transparent shadow-sm ring-2 ring-offset-1 ring-slate-100` : 'bg-white text-slate-400 border-slate-100']"
      >
        <component :is="t.icon" :size="14" />
        {{ t.label }}
      </button>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="text-[10px] font-bold text-slate-400 uppercase">Monto</label>
        <div class="relative">
          <DollarSign :size="20" class="absolute left-3 top-3.5 text-slate-400" />
          <input v-model="form.amount" type="number" step="0.01" class="w-full pl-10 p-3 bg-slate-50 rounded-xl outline-none font-bold text-xl text-slate-700 placeholder-slate-300" placeholder="0.00" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- SELECCIÓN DE CUENTA (Inteligente) -->
        <div v-if="!isTransferType">
           <label class="text-[10px] font-bold text-slate-400 uppercase">Cuenta</label>
           <div class="relative">
             <CreditCard :size="16" class="absolute left-3 top-3.5 text-slate-400" />
             <select v-model="form.accountId" class="w-full pl-10 p-3 bg-slate-50 rounded-xl outline-none text-sm appearance-none font-medium text-slate-600">
               <option v-for="acc in store.accounts" :key="acc.id" :value="acc.id">{{ acc.name }} ({{ acc.type }})</option>
             </select>
           </div>
        </div>

        <div v-else class="md:col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
           <!-- FROM (Origen) -->
           <div>
             <label class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                De (Origen) <ArrowRight :size="12"/>
             </label>
             <select v-model="form.accountId" class="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-600 mt-1">
               <option v-for="acc in sourceAccounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
             </select>
           </div>

           <!-- TO (Destino) -->
           <div>
             <label class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                Para (Pagando a)
             </label>
             <select v-model="form.destinationAccountId" class="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-600 mt-1">
               <option v-for="acc in destinationAccounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
             </select>
           </div>
        </div>

        <div>
           <label class="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
             Categoría
             <span v-if="isAddingCategory" @click="isAddingCategory = false" class="text-red-400 cursor-pointer hover:underline">Cancelar</span>
           </label>
           
           <div v-if="isAddingCategory" class="flex gap-2">
             <input v-model="newCategoryTemp" ref="newCatInput" type="text" class="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-xl outline-none text-sm text-blue-900 placeholder-blue-300" placeholder="Nombre nueva categoría..." @keyup.enter="saveNewCategory" />
             <button type="button" @click="saveNewCategory" class="bg-blue-600 text-white p-3 rounded-xl shadow-md">
               <PlusCircle :size="20" />
             </button>
           </div>

           <div v-else class="relative">
             <Tag :size="16" class="absolute left-3 top-3.5 text-slate-400" />
             <select :value="form.category" @change="handleCategoryChange" class="w-full pl-10 p-3 bg-slate-50 rounded-xl outline-none text-sm appearance-none font-medium text-slate-600">
               <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
               <option value="NEW_CAT_TRIGGER" class="font-bold text-blue-600">+ Agregar Nueva...</option>
             </select>
           </div>
        </div>
      </div>

      <div>
        <label class="text-[10px] font-bold text-slate-400 uppercase">Descripción</label>
        <div class="relative">
          <FileText :size="16" class="absolute left-3 top-3.5 text-slate-400" />
          <input v-model="form.description" type="text" class="w-full pl-10 p-3 bg-slate-50 rounded-xl outline-none text-sm text-slate-600" placeholder="Ej: Cena aniversario" />
        </div>
      </div>

      <button class="w-full py-4 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg flex justify-center gap-2">
        <span>Registrar Operación</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 0px; background: transparent; }
</style>