<script setup lang="ts">
import { ref } from 'vue';
import { useFinanceStore, type Subscription } from '../../stores/financeStore';
import { Trash2, Zap, Award, Pencil, Landmark, DollarSign, CheckCircle } from 'lucide-vue-next';

const store = useFinanceStore();
const isFormOpen = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
    name: '',
    amount: '' as number | '',
    frequency: 'MONTHLY' as 'MONTHLY' | 'YEARLY' | 'BIMONTHLY',
    type: 'SERVICE' as 'SERVICE' | 'MEMBERSHIP',
    isVariable: false,
    nextPaymentDate: '',
    accountId: '' as number | ''
});

const handleEdit = (sub: Subscription) => {
    editingId.value = sub.id;
    form.value = {
        name: sub.name,
        amount: sub.amount,
        frequency: sub.frequency,
        type: sub.type,
        isVariable: sub.isVariable,
        nextPaymentDate: sub.nextPaymentDate ? (sub.nextPaymentDate.split('T')[0] || '') : '',
        accountId: sub.accountId || ''
    };
    isFormOpen.value = true;
};

const cancel = () => {
    isFormOpen.value = false;
    editingId.value = null;
    form.value = { name: '', amount: '', frequency: 'MONTHLY', type: 'SERVICE', isVariable: false, nextPaymentDate: '', accountId: '' };
};

const paySubscription = async (sub: Subscription) => {
    const accountId = sub.accountId || null;
    if (!accountId) {
        alert("Esta suscripción no tiene una cuenta vinculada. Por favor, edítala para domiciliarla.");
        return;
    }

    if (!confirm(`¿Registrar pago de ${formatMoney(sub.amount)} para ${sub.name}?`)) return;

    await store.addTransaction({
        accountId,
        type: 'expense',
        amount: sub.amount,
        category: sub.type === 'MEMBERSHIP' ? 'Membresía' : 'Servicio',
        description: `Pago de ${sub.name}`,
        date: new Date().toISOString(),
        subscriptionId: sub.id
    });

    alert("¡Pago registrado!");
};

const submit = async () => {
    if (!form.value.name || form.value.amount === '') return;

    const subData = {
        name: form.value.name,
        amount: Number(form.value.amount),
        currency: 'MXN',
        frequency: form.value.frequency,
        type: form.value.type,
        isVariable: form.value.isVariable,
        nextPaymentDate: form.value.nextPaymentDate ? new Date(form.value.nextPaymentDate).toISOString() : new Date().toISOString(),
        accountId: form.value.accountId ? Number(form.value.accountId) : null
    };

    if (editingId.value) {
        await store.updateSubscription(editingId.value, subData);
    } else {
        await store.addSubscription(subData);
    }

    cancel();
};

const formatSubscriptionDate = (sub: Subscription) => {
    if (!sub.nextPaymentDate) return '';
    const date = new Date(sub.nextPaymentDate);
    if (sub.frequency === 'MONTHLY' || sub.frequency === 'BIMONTHLY') {
        const day = date.getUTCDate();
        return `Día ${day}`;
    } else {
        // Para Anual: Día y Mes (ej: 15 de Ene)
        return `Renueva ${date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}`;
    }
};

const isPaidThisPeriod = (sub: Subscription) => {
    if (!sub.lastPaymentDate) return false;
    const lastPaid = new Date(sub.lastPaymentDate);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - lastPaid.getFullYear()) * 12 + now.getMonth() - lastPaid.getMonth();
    
    if (sub.frequency === 'MONTHLY') {
        return monthsDiff === 0;
    } else if (sub.frequency === 'BIMONTHLY') {
        // Pagado si fue en este mes o el pasado
        return monthsDiff < 2;
    } else {
        return lastPaid.getFullYear() === now.getFullYear();
    }
};

const getLinkedAccountName = (id?: number | null) => {
    if (!id) return null;
    const acc = store.accounts.find(a => a.id === id);
    return acc ? acc.name : 'Cuenta Desconocida';
};

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};
</script>

<template>
    <div class="space-y-4">
        <div class="flex justify-between items-center px-1">
            <h3 class="font-bold text-slate-800 text-lg">Membresías y Servicios</h3>
            <button @click="isFormOpen ? cancel() : (isFormOpen = true)" class="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                {{ isFormOpen ? 'Cancelar' : '+ Agregar' }}
            </button>
        </div>

        <!-- Add/Edit Form -->
        <div v-if="isFormOpen" class="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 mb-4 animate-fade-in text-left">
             <h4 class="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">{{ editingId ? 'Editar' : 'Nueva' }} suscripción</h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre</label>
                    <input v-model="form.name" placeholder="ej. Netflix, Luz" class="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Monto Est.</label>
                    <input v-model="form.amount" type="number" placeholder="0.00" class="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Frecuencia</label>
                    <select v-model="form.frequency" class="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                        <option value="MONTHLY">Mensual</option>
                        <option value="BIMONTHLY">Bimestral (Luz, etc)</option>
                        <option value="YEARLY">Anual</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        {{ form.frequency === 'YEARLY' ? 'Fecha de Renovación' : 'Día de Pago' }}
                    </label>
                    <input v-model="form.nextPaymentDate" type="date" class="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Tipo</label>
                    <select v-model="form.type" class="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                        <option value="SERVICE">Servicio</option>
                        <option value="MEMBERSHIP">Membresía</option>
                    </select>
                </div>
                <!-- Cuenta Domiciliada -->
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Domiciliar a Cuenta</label>
                    <select v-model="form.accountId" class="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                        <option value="">Ninguna (Manual)</option>
                        <option v-for="acc in store.accounts" :key="acc.id" :value="acc.id">
                            {{ acc.name }} ({{ formatMoney(acc.balance) }})
                        </option>
                    </select>
                </div>
             </div>
             <div class="flex items-center gap-2 mb-6">
                 <input type="checkbox" v-model="form.isVariable" id="isVar" class="rounded text-slate-900 focus:ring-slate-900" />
                 <label for="isVar" class="text-xs text-slate-600 font-medium">Es costo variable (Estimado)</label>
             </div>
             <button @click="submit" class="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all">
                {{ editingId ? 'Actualizar suscripción' : 'Guardar suscripción' }}
             </button>
        </div>

        <!-- List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div v-for="sub in store.subscriptions" :key="sub.id" class="group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-all duration-300">
                <div class="flex items-center gap-4">
                    <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center transition-colors', sub.type === 'MEMBERSHIP' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600']">
                        <Award v-if="sub.type === 'MEMBERSHIP'" :size="24" />
                        <Zap v-else :size="24" />
                    </div>
                    <div class="space-y-0.5">
                        <p class="font-bold text-slate-800 text-sm leading-tight">{{ sub.name }}</p>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {{ sub.frequency === 'MONTHLY' ? 'MENSUAL' : sub.frequency === 'BIMONTHLY' ? 'BIMESTRAL' : 'ANUAL' }} • {{ sub.isVariable ? 'VAR.' : 'FIJO' }}
                        </p>
                        <div class="flex items-center gap-2 mt-0.5">
                            <p :class="['text-[10px] font-black uppercase tracking-tighter', isPaidThisPeriod(sub) ? 'text-emerald-500 flex items-center gap-1' : 'text-blue-500']">
                                <CheckCircle v-if="isPaidThisPeriod(sub)" :size="10" />
                                {{ isPaidThisPeriod(sub) ? 'PAGADO' : formatSubscriptionDate(sub) }}
                            </p>
                            <span v-if="sub.accountId" class="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Landmark :size="8" /> {{ getLinkedAccountName(sub.accountId) }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="font-black text-slate-800 text-sm">{{ formatMoney(sub.amount) }}</p>
                        <div class="flex gap-2 justify-end mt-2">
                            <button 
                                v-if="sub.accountId && !isPaidThisPeriod(sub)"
                                @click="paySubscription(sub)"
                                class="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                            >
                                <DollarSign :size="10" /> Pagar
                            </button>
                            <div class="flex gap-1 opacity-10 group-hover:opacity-100 transition-all duration-200">
                                <button @click="handleEdit(sub)" class="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Pencil :size="14" />
                                </button>
                                <button @click="store.deleteSubscription(sub.id)" class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 :size="14" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
