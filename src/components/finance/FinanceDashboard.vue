<script setup lang="ts">
import { computed, onMounted } from 'vue';
import SubscriptionsSection from './SubscriptionsSection.vue';
import { useFinanceStore } from '../../stores/financeStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Title, Filler } from 'chart.js';
import { Doughnut, Line } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Title, Filler);

const store = useFinanceStore();

onMounted(() => {
    store.initialize();
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
    // Calculate last 6 months trend
    const months = [];
    const actuals = [];
    const budgets = [];
    
    // Fixed monthly budget (Subscriptions)
    const monthlyFixed = store.subscriptions.reduce((sum, sub) => {
        let val = Number(sub.amount);
        if (sub.frequency === 'YEARLY') val = val / 12;
        return sum + val;
    }, 0);

    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthLabel = d.toLocaleDateString('es-MX', { month: 'short' });
        months.push(monthLabel);

        // Actual Spending for this month
        const monthlyTotal = store.transactions
            .filter(t => {
                const td = new Date(t.date);
                return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && (t.type === 'expense' || t.type === 'loan_payment');
            })
            .reduce((sum, t) => sum + Number(t.amount), 0);
        
        actuals.push(monthlyTotal);
        budgets.push(monthlyFixed); 
    }

    return {
        labels: months,
        datasets: [
            {
                label: 'Presupuesto (Fijo)',
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                data: budgets,
                tension: 0.4,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            },
            {
                label: 'Gasto Real',
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                data: actuals,
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
        
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
</template>
