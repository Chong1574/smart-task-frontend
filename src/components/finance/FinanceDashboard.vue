<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useFinanceStore } from '../../stores/financeStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Title, Filler } from 'chart.js';
import { Doughnut, Line } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Title, Filler);

const store = useFinanceStore();

onMounted(() => {
    store.initialize();
});

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

const fixedCostPercentage = computed(() => {
    if (store.totalBalance === 0) return 0;
    const percentage = (store.totalFixedExpenses / store.totalBalance) * 100;
    return Math.abs(Math.round(percentage));
});

const impactText = computed(() => {
    const p = fixedCostPercentage.value;
    if (p < 15) return 'Bajo';
    if (p < 30) return 'Moderado';
    return 'Crítico';
});

const impactColor = computed(() => {
    const p = fixedCostPercentage.value;
    if (p < 15) return 'bg-emerald-100 text-emerald-600';
    if (p < 30) return 'bg-orange-100 text-orange-600';
    return 'bg-red-100 text-red-600';
});

const percentageColor = computed(() => {
    const p = fixedCostPercentage.value;
    if (p < 15) return 'bg-emerald-500';
    if (p < 30) return 'bg-orange-500';
    return 'bg-red-500';
});

const colors = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'
];

// Helper to group by category
const groupByCategory = (type: string) => {
    const grouped: Record<string, number> = {};
    store.transactions
        .filter(t => t.type === type)
        .forEach(t => {
            grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount);
        });
    return grouped;
};

const incomeData = computed(() => {
    const grouped = groupByCategory('income');
    return {
        labels: Object.keys(grouped),
        datasets: [{
            backgroundColor: colors,
            data: Object.values(grouped)
        }]
    };
});

const expenseData = computed(() => {
    const grouped = groupByCategory('expense');
    return {
        labels: Object.keys(grouped),
        datasets: [{
            backgroundColor: colors,
            data: Object.values(grouped)
        }]
    };
});

const budgetData = computed(() => {
    const months = [];
    const actualExpenses = [];
    const actualIncomes = [];
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthLabel = d.toLocaleDateString('es-MX', { month: 'short' });
        months.push(monthLabel);

        const monthlyExpenses = store.transactions
            .filter(t => {
                const td = new Date(t.date);
                return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && 
                       (t.type === 'expense' || t.type === 'loan_payment' || t.type === 'credit_payment');
            })
            .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const monthlyIncomes = store.transactions
            .filter(t => {
                const td = new Date(t.date);
                return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && t.type === 'income';
            })
            .reduce((sum, t) => sum + Number(t.amount), 0);
        
        actualExpenses.push(monthlyExpenses);
        actualIncomes.push(monthlyIncomes); 
    }

    return {
        labels: months,
        datasets: [
            {
                label: 'Ingresos del Mes',
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                data: actualIncomes,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981'
            },
            {
                label: 'Gastos Globales',
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                data: actualExpenses,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ef4444'
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const }
    }
};
</script>

<template>
    <div class="space-y-6 mb-8 animate-fade-in text-left">
        <!-- Relationship Summary Card -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div class="space-y-1">
                    <h3 class="text-slate-800 font-bold text-lg">Resumen de Salud Financiera</h3>
                    <p class="text-slate-400 text-sm">Relación entre tus gastos fijos y tu capital disponible.</p>
                </div>
                <div class="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <div class="text-right">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Costo Fijo Mensual</p>
                        <p class="text-lg font-black text-slate-800">{{ formatMoney(store.totalFixedExpenses) }}</p>
                    </div>
                </div>
            </div>

            <!-- Progress Bar / Relation -->
            <div class="mt-8 space-y-4">
                <div class="flex justify-between items-end">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-500 uppercase">Impacto en Balance Total</span>
                        <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', impactColor]">
                            {{ impactText }}
                        </span>
                    </div>
                    <p class="text-sm font-black text-slate-800">{{ fixedCostPercentage }}%</p>
                </div>
                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        class="h-full transition-all duration-1000 ease-out rounded-full"
                        :class="percentageColor"
                        :style="{ width: `${Math.min(fixedCostPercentage, 100)}%` }"
                    ></div>
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed italic">
                    *Tus compromisos mensuales (suscripciones y servicios) representan el <strong>{{ fixedCostPercentage }}%</strong> de tu balance total actual. 
                    {{ fixedCostPercentage > 30 ? 'Considera reducir gastos fijos para mejorar tu liquidez.' : 'Tienes una excelente relación de gastos fijos.' }}
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Income Chart -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 class="text-slate-500 font-bold uppercase text-xs mb-4">Distribución de Ingresos</h3>
                <div class="w-full h-48 relative">
                    <Doughnut :data="incomeData" :options="chartOptions" />
                </div>
            </div>

            <!-- Expense Chart -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 class="text-slate-500 font-bold uppercase text-xs mb-4">Distribución de Egresos</h3>
                <div class="w-full h-48 relative">
                    <Doughnut :data="expenseData" :options="chartOptions" />
                </div>
            </div>

            <!-- Budget vs Actual Trend -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center md:col-span-2 lg:col-span-1">
                <h3 class="text-slate-500 font-bold uppercase text-xs mb-4">Tendencia (Últimos 6 meses)</h3>
                <div class="w-full h-48 relative">
                    <Line :data="budgetData" :options="chartOptions" />
                </div>
            </div>
        </div>
    </div>
</template>
