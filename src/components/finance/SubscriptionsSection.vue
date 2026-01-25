<script setup lang="ts">
import { ref } from 'vue';
import { useFinanceStore, type Subscription } from '../../stores/financeStore';
import { Plus, Trash2, Calendar, Zap, Award } from 'lucide-vue-next';

const store = useFinanceStore();
const isFormOpen = ref(false);

const form = ref({
    name: '',
    amount: '' as number | '',
    frequency: 'MONTHLY' as 'MONTHLY' | 'YEARLY',
    type: 'SERVICE' as 'SERVICE' | 'MEMBERSHIP',
    isVariable: false
});

const submit = async () => {
    if (!form.value.name || form.value.amount === '') return;

    await store.addSubscription({
        name: form.value.name,
        amount: Number(form.value.amount),
        currency: 'MXN',
        frequency: form.value.frequency,
        type: form.value.type,
        isVariable: form.value.isVariable,
        nextPaymentDate: new Date().toISOString() // Placeholder
    });

    // Reset
    form.value = { name: '', amount: '', frequency: 'MONTHLY', type: 'SERVICE', isVariable: false };
    isFormOpen.value = false;
};

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};
</script>

<template>
    <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h3 class="font-bold text-slate-800 text-lg">Membresías y Servicios</h3>
            <button @click="isFormOpen = !isFormOpen" class="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                {{ isFormOpen ? 'Cancelar' : '+ Agregar' }}
            </button>
        </div>

        <!-- Add Form -->
        <div v-if="isFormOpen" class="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 mb-4 animate-fade-in">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input v-model="form.name" placeholder="Nombre (ej. Netflix, Luz)" class="p-2 rounded-lg border border-slate-200" />
                <input v-model="form.amount" type="number" placeholder="Monto Est." class="p-2 rounded-lg border border-slate-200" />
                <select v-model="form.frequency" class="p-2 rounded-lg border border-slate-200">
                    <option value="MONTHLY">Mensual</option>
                    <option value="YEARLY">Anual</option>
                </select>
                <select v-model="form.type" class="p-2 rounded-lg border border-slate-200">
                    <option value="SERVICE">Servicio</option>
                    <option value="MEMBERSHIP">Membresía</option>
                </select>
             </div>
             <div class="flex items-center gap-2 mb-4">
                 <input type="checkbox" v-model="form.isVariable" id="isVar" />
                 <label for="isVar" class="text-sm text-slate-600">Es costo variable (Estimado)</label>
             </div>
             <button @click="submit" class="w-full bg-slate-900 text-white py-2 rounded-lg font-bold">Guardar</button>
        </div>

        <!-- List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="sub in store.subscriptions" :key="sub.id" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div :class="['w-10 h-10 rounded-full flex items-center justify-center', sub.type === 'MEMBERSHIP' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600']">
                        <Award v-if="sub.type === 'MEMBERSHIP'" :size="20" />
                        <Zap v-else :size="20" />
                    </div>
                    <div>
                        <p class="font-bold text-slate-800">{{ sub.name }}</p>
                        <p class="text-xs text-slate-400">
                            {{ sub.frequency === 'MONTHLY' ? 'Mensual' : 'Anual' }} • {{ sub.isVariable ? 'Var.' : 'Fijo' }}
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-slate-800">{{ formatMoney(sub.amount) }}</p>
                    <button @click="store.deleteSubscription(sub.id)" class="text-xs text-red-400 hover:text-red-600 mt-1">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>
