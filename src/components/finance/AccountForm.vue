<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useFinanceStore, type AccountType, type AccountSubType, type Account } from '../../stores/financeStore';
import { CreditCard, Wallet, Banknote, Landmark, Save, DollarSign, TrendingUp } from 'lucide-vue-next';

const store = useFinanceStore();
const emit = defineEmits(['close']);

const props = defineProps<{
    initialData?: Account | null
}>();

const form = ref({
    name: '',
    type: 'card' as AccountType,
    subType: 'debit' as AccountSubType,
    balance: 0 as number | '',
    creditLimit: 0 as number | '',
    cutoffDay: '' as string | number, // Día de corte
    paymentDay: '' as string | number, // Día de pago
    interestRate: '' as number | '', // Tasa de interés
    monthlyPayment: '' as number | '', // Mensualidad fija
    paymentFrequency: 'MONTHLY' as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
    currency: 'MXN'
});

const accountTypes = [
    { id: 'card', label: 'Tarjeta', icon: CreditCard },
    { id: 'cash', label: 'Efectivo', icon: Banknote },
    { id: 'savings', label: 'Ahorro', icon: Landmark },
    { id: 'loan', label: 'Crédito/Préstamo', icon: Wallet },
    { id: 'investment', label: 'Inversión', icon: TrendingUp }
];

// Helper to determine sub-type options based on main type
const subTypeOptions = computed(() => {
    if (form.value.type === 'card') return [
        { id: 'debit', label: 'Débito' },
        { id: 'credit', label: 'Crédito' }
    ];
    return [{ id: 'n/a', label: 'N/A' }];
});

const isFixedCredit = ref(false);

// Watch for initialData changes to populate form
watchEffect(() => {
    if (props.initialData) {
        form.value = {
            name: props.initialData.name,
            type: props.initialData.type,
            subType: props.initialData.sub_type,
            balance: props.initialData.balance,
            creditLimit: props.initialData.credit_limit || 0,
            cutoffDay: props.initialData.cutoff_day || '',
            paymentDay: props.initialData.payment_day || '',
            interestRate: props.initialData.interest_rate || '',
            monthlyPayment: props.initialData.monthly_payment || '',
            paymentFrequency: props.initialData.payment_frequency || 'MONTHLY',
            currency: props.initialData.currency
        };
        // Check fixed credit logic
        if (props.initialData.type === 'loan' && props.initialData.interest_rate === 0) {
            isFixedCredit.value = true;
        }
    }
});

const submit = async () => {
    if (!form.value.name || form.value.balance === '') return;

    const payload = {
        name: form.value.name,
        type: form.value.type,
        sub_type: form.value.subType,
        balance: (form.value.type === 'loan' || (form.value.type === 'card' && form.value.subType === 'credit'))
                 ? -Math.abs(Number(form.value.balance)) // Ensure negative for debt if creating new? 
                 // Note: If editing, we might want to respect current sign or force logic? 
                 // For now, let's keep logic: if user enters positive in UI for debt, it saves as negative.
                 : Number(form.value.balance), 
        credit_limit: Number(form.value.creditLimit) || 0,
        cutoff_day: Number(form.value.cutoffDay) || 0,
        payment_day: Number(form.value.paymentDay) || 0,
        interest_rate: isFixedCredit.value ? 0 : (Number(form.value.interestRate) || 0),
        monthly_payment: Number(form.value.monthlyPayment) || 0,
        payment_frequency: form.value.paymentFrequency,
        currency: form.value.currency
    };

    if (props.initialData?.id) {
        await store.updateAccount(props.initialData.id, payload);
    } else {
        await store.addAccount(payload);
    }

    emit('close');
};
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-slate-800">{{ props.initialData ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h3>
                <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
                   ✕
                </button>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                
                <!-- Tipo de Cuenta -->
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-2">Tipo de Cuenta</label>
                    <div class="flex gap-2 flex-wrap">
                        <button 
                            v-for="t in accountTypes" 
                            :key="t.id"
                            type="button"
                            @click="form.type = t.id as AccountType; form.subType = (t.id === 'card' ? 'debit' : 'n/a')"
                            :class="['flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border', 
                            form.type === t.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200']"
                        >
                            <component :is="t.icon" :size="14" />
                            {{ t.label }}
                        </button>
                    </div>
                </div>

                <!-- Nombre -->
                <div>
                   <label class="text-[10px] font-bold text-slate-400 uppercase">Nombre de la cuenta</label>
                   <input v-model="form.name" type="text" class="w-full p-3 bg-slate-50 rounded-xl outline-none font-medium text-slate-700 placeholder-slate-300 border border-slate-100 focus:border-slate-300 transition-colors" placeholder="Ej: BBVA Nómina" />
                </div>

                <!-- Detalles Generales (Grid de 2) -->
                <div class="grid grid-cols-2 gap-4">
                    <!-- Balance -->
                    <div class="col-span-2 md:col-span-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">
                            {{ (form.type === 'loan' || (form.type === 'card' && form.subType === 'credit')) ? 'Deuda Actual' : 'Balance Inicial' }}
                        </label>
                        <div class="relative">
                            <DollarSign :size="18" class="absolute left-3 top-3.5 text-slate-400" />
                            <input v-model="form.balance" type="number" step="0.01" class="w-full pl-9 p-3 bg-slate-50 rounded-xl outline-none font-bold text-lg text-slate-700 placeholder-slate-300 border border-slate-100" placeholder="0.00" />
                        </div>
                    </div>

                    <!-- Moneda -->
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Moneda</label>
                        <select v-model="form.currency" class="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm font-medium text-slate-600 appearance-none border border-slate-100 h-[52px]">
                             <option value="MXN">MXN ($)</option>
                             <option value="USD">USD ($)</option>
                             <option value="EUR">EUR (€)</option>
                        </select>
                    </div>

                    <!-- SubTipo (Solo Carta) -->
                    <div v-if="form.type === 'card'">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Tipo</label>
                        <select v-model="form.subType" class="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm font-medium text-slate-600 appearance-none border border-slate-100 h-[52px]">
                             <option v-for="opt in subTypeOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
                        </select>
                    </div>
                </div>

                <!-- DETALLES TARJETA DE CRÉDITO -->
                <div v-if="form.type === 'card' && form.subType === 'credit'" class="space-y-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-fade-in">
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles de Tarjeta</h4>
                    
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Límite de Crédito</label>
                        <div class="relative">
                            <DollarSign :size="18" class="absolute left-3 top-3.5 text-slate-400" />
                            <input v-model="form.creditLimit" type="number" step="0.01" class="w-full pl-9 p-3 bg-white rounded-xl outline-none font-bold text-lg text-slate-700 placeholder-slate-300 border border-slate-200" placeholder="0.00" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Día Corte</label>
                            <input v-model="form.cutoffDay" type="number" min="1" max="31" class="w-full p-3 bg-white rounded-xl outline-none font-medium text-slate-600 text-center border border-slate-200" placeholder="DD" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Día Pago</label>
                            <input v-model="form.paymentDay" type="number" min="1" max="31" class="w-full p-3 bg-white rounded-xl outline-none font-medium text-slate-600 text-center border border-slate-200" placeholder="DD" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Frecuencia Pago</label>
                            <select v-model="form.paymentFrequency" class="w-full p-2.5 bg-white rounded-xl outline-none text-xs font-bold text-slate-600 appearance-none border border-slate-200 h-[46px]">
                                <option value="WEEKLY">Semanal</option>
                                <option value="BIWEEKLY">Quincenal</option>
                                <option value="MONTHLY">Mensual</option>
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Monto Pago</label>
                            <div class="relative">
                                <DollarSign :size="16" class="absolute left-3 top-3 text-slate-400" />
                                <input v-model="form.monthlyPayment" type="number" step="0.01" class="w-full pl-9 p-2.5 bg-white rounded-xl outline-none font-bold text-slate-700 border border-slate-200" placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DETALLES DE PRÉSTAMO / INVERSIÓN (INTERÉS) -->
                <div v-if="form.type === 'loan' || form.type === 'investment'" class="space-y-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-fade-in">
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {{ form.type === 'loan' ? 'Detalles del Préstamo' : 'Detalles de Inversión' }}
                    </h4>
                    
                    <!-- Checkbox de Crédito Fijo (Solo Préstamo) -->
                    <div v-if="form.type === 'loan'" class="flex items-center gap-2 mb-2">
                        <input type="checkbox" id="fixedCredit" v-model="isFixedCredit" class="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        <label for="fixedCredit" class="text-xs font-bold text-slate-600 select-none">Crédito Fijo (Sin Interés Variable)</label>
                    </div>

                    <div v-if="!isFixedCredit || form.type === 'investment'">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Tasa de Interés Anual (%)</label>
                        <div class="relative">
                            <TrendingUp :size="18" class="absolute left-3 top-3.5 text-slate-400" />
                            <input v-model="form.interestRate" type="number" step="0.01" class="w-full pl-9 p-3 bg-white rounded-xl outline-none font-bold text-lg text-slate-700 placeholder-slate-300 border border-slate-200" placeholder="Ej: 11.5" />
                        </div>
                        <p class="text-[10px] text-slate-400 mt-1">
                            {{ form.type === 'investment' ? 'Se usará para generar ganancias diarias automáticamente.' : 'Se usará para calcular la evolución de la deuda.' }}
                        </p>
                    </div>

                    <!-- Mensualidad para Préstamos -->
                    <div v-if="form.type === 'loan'" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Día de Pago</label>
                                <input v-model="form.paymentDay" type="number" min="1" max="31" class="w-full p-2.5 bg-white rounded-xl outline-none font-bold text-slate-600 text-center border border-slate-200" placeholder="DD" />
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Frecuencia</label>
                                <select v-model="form.paymentFrequency" class="w-full p-2.5 bg-white rounded-xl outline-none text-xs font-bold text-slate-600 appearance-none border border-slate-200 h-[46px]">
                                    <option value="WEEKLY">Semanal</option>
                                    <option value="BIWEEKLY">Quincenal</option>
                                    <option value="MONTHLY">Mensual</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Monto de Pago</label>
                            <div class="relative">
                                <DollarSign :size="16" class="absolute left-3 top-3 text-slate-400" />
                                <input v-model="form.monthlyPayment" type="number" step="0.01" class="w-full pl-9 p-2.5 bg-white rounded-xl outline-none font-bold text-slate-700 border border-slate-200" placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                </div>

                <button class="w-full py-4 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg flex justify-center gap-2">
                    <Save :size="20" />
                    <span>{{ props.initialData ? 'Actualizar Cuenta' : 'Guardar Cuenta' }}</span>
                </button>

            </form>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 0px; background: transparent; }
</style>
