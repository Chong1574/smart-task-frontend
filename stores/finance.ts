import { defineStore } from 'pinia';
import api from '../utils/api';
import { computeUpcomingPaymentDate } from '../utils/date';

// --- Tipos alineados con tu Lógica de Negocio ---
export type AccountType = 'card' | 'loan' | 'investment' | 'cash' | 'savings';
export type AccountSubType = 'debit' | 'credit' | 'payroll' | 'n/a';
export type TransactionType = 'income' | 'expense' | 'investment' | 'credit_payment' | 'loan_payment' | 'transfer' | 'withdrawal';

export interface Account {
    id: number;
    name: string;
    type: AccountType;
    sub_type: AccountSubType;
    balance: number;
    credit_limit: number;
    interest_rate: number;
    monthly_payment: number;
    payment_frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'ONCE';
    cutoff_day: number;
    payment_day: number;
    minimum_payment_percentage: number;
    currency: string;
    color: string; // Front-end decoration
    statement?: {
        periodStartDate: string;
        periodEndDate: string;
        paymentDueDate: string | null;
        noInterestPayment: number;
        rawNoInterestPayment?: number;
        minimumPayment: number;
    };
}

export interface Transaction {
    id: number;
    accountId: number;
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: string;
    installments?: number;
    subscriptionId?: number;
    account?: { name: string };
}

export interface Subscription {
    id: number;
    name: string;
    amount: number;
    currency: string;
    frequency: 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'YEARLY';
    type: 'MEMBERSHIP' | 'SERVICE' | 'INCOME';
    isVariable: boolean;
    paymentDay?: number | null;
    nextPaymentDate?: string;
    lastPaymentDate?: string;
    accountId?: number | null;
}

export interface FuelLog {
    id: number;
    vehicleId: number;
    date: string;
    odometer: number;
    liters: number;
    pricePerLiter: number;
    totalCost: number;
    tankLevelBefore?: number;
    tankLevelAfter?: number;
    isFullTank: boolean;
}

export interface Vehicle {
    id: number;
    name: string;
    plate?: string;
    make?: string;
    model?: string;
    year?: number;
    tankCapacity?: number | null;
    fuelLogs: FuelLog[];
}

export interface VehicleGasolineProjection {
    vehicleId: number;
    vehicleName: string;
    plate?: string;
    model?: string;
    dailyExpense: number;
    weeklyExpense: number;
    biweeklyExpense: number;
    monthlyExpense: number;
    dailyLiters: number;
    weeklyLiters: number;
    biweeklyLiters: number;
    monthlyLiters: number;
    dailyKm: number;
    monthlyKm: number;
    costPerKm: number;
    kmPerLiter: number;
    avgPricePerLiter: number;
    avgDaysBetweenRefills: number;
    estimatedFullTankAutonomyKm: number;
    logsCount: number;
    isPreliminary: boolean;
    daysSinceLastRefill: number | null;
    lastRefillDate: string | null;
    isStale: boolean;
    isActiveInBudget: boolean;
}

export interface GasolineFleetProjection {
    totalDaily: number;
    totalWeekly: number;
    totalBiweekly: number;
    totalMonthly: number;
    totalDailyLiters: number;
    totalMonthlyLiters: number;
    totalDailyKm: number;
    totalMonthlyKm: number;
    avgCostPerKm: number;
    avgEfficiencyKmPerLiter: number;
    hasData: boolean;
    activeVehiclesCount: number;
    inactiveVehiclesCount: number;
    vehicles: VehicleGasolineProjection[];
}

const COLORS = [
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800',
    'from-emerald-500 to-emerald-700',
    'from-orange-500 to-orange-700',
    'from-pink-500 to-pink-700',
    'from-cyan-500 to-cyan-700'
];

export const useFinanceStore = defineStore('finance', {
    state: () => {
        let savedCategories = ['Comida', 'Transporte', 'Servicios', 'Ocio', 'Salario', 'Renta', 'Inversión'];
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem('taskman_categories');
            if (stored) {
                try {
                    savedCategories = JSON.parse(stored);
                } catch (e) {
                    console.error("Error parsing stored categories", e);
                }
            }
        }
        return {
            categories: savedCategories as string[],
            accounts: [] as Account[],
            transactions: [] as Transaction[],
            subscriptions: [] as Subscription[],
            vehicles: [] as Vehicle[],
            tasks: [] as any[],
            wishlistItems: [] as any[],
            loading: false,
            error: null as string | null
        };
    },

    getters: {
        totalIncome: (state) => state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpense: (state) => state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
        totalBalance: (state) => state.accounts.reduce((sum, acc) => {
            const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
            const balanceVal = Number(acc.balance);
            return sum + (isDebt ? -Math.abs(balanceVal) : balanceVal);
        }, 0),

        netBudget: (state) => {
            const income = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
            const expenses = state.transactions.filter(t => {
                if (t.type === 'expense') return true;
                if (['loan_payment', 'credit_payment'].includes(t.type)) {
                    if (t.description && (t.description.startsWith('Pago recibido') || t.description.startsWith('Transferencia recibida'))) {
                        return false;
                    }
                    return true;
                }
                return false;
            }).reduce((sum, t) => sum + Number(t.amount), 0);
            return income - expenses;
        },

        totalFixedSubscriptionExpenses: (state) => {
            return state.subscriptions
                .filter(sub => sub.type !== 'INCOME')
                .reduce((sum, sub) => {
                    let val = Number(sub.amount);
                    if (sub.frequency === 'YEARLY') val = val / 12;
                    else if (sub.frequency === 'QUARTERLY') val = val / 3;
                    else if (sub.frequency === 'BIMONTHLY') val = val / 2;
                    else if (sub.frequency === 'BIWEEKLY') val = val * 2;
                    else if (sub.frequency === 'WEEKLY') val = val * 4.33; // aprox semanas por mes
                    return sum + val;
                }, 0);
        },

        totalFixedDebtPayments: (state) => {
            return state.accounts.reduce((sum, acc) => {
                const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
                if (!isDebt || Number(acc.balance) >= 0) return sum;
                if (acc.payment_frequency === 'ONCE') return sum;

                let amountToPay = Number(acc.monthly_payment);
                if (!amountToPay || amountToPay === 0) {
                    const balance = Math.abs(Number(acc.balance));
                    amountToPay = balance < 500 ? balance : balance * 0.05; 
                }

                let val = amountToPay;
                if (acc.payment_frequency === 'WEEKLY') val = val * 4.33;
                else if (acc.payment_frequency === 'BIWEEKLY') val = val * 2;
                // MONTHLY is the default
                
                return sum + val;
            }, 0);
        },

        gasolineProjections: (state): GasolineFleetProjection => {
            const now = new Date();
            const vehicleResults: VehicleGasolineProjection[] = [];

            state.vehicles.forEach(vehicle => {
                const logs = [...(vehicle.fuelLogs || [])]
                    .filter(l => Number(l.totalCost) > 0 && Number(l.liters) > 0)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || Number(a.odometer) - Number(b.odometer));

                if (logs.length === 0) {
                    vehicleResults.push({
                        vehicleId: vehicle.id,
                        vehicleName: vehicle.name,
                        plate: vehicle.plate,
                        model: vehicle.model,
                        dailyExpense: 0,
                        weeklyExpense: 0,
                        biweeklyExpense: 0,
                        monthlyExpense: 0,
                        dailyLiters: 0,
                        weeklyLiters: 0,
                        biweeklyLiters: 0,
                        monthlyLiters: 0,
                        dailyKm: 0,
                        monthlyKm: 0,
                        costPerKm: 0,
                        kmPerLiter: 0,
                        avgPricePerLiter: 0,
                        avgDaysBetweenRefills: 0,
                        estimatedFullTankAutonomyKm: 0,
                        logsCount: 0,
                        isPreliminary: false,
                        daysSinceLastRefill: null,
                        lastRefillDate: null,
                        isStale: false,
                        isActiveInBudget: false
                    });
                    return;
                }

                const lastLog = logs[logs.length - 1];
                const lastTime = new Date(lastLog.date).getTime();
                const daysSinceLastRefill = Math.max(0, Math.floor((now.getTime() - lastTime) / (1000 * 60 * 60 * 24)));
                // REGLA: Si lleva más de 30 días (1 mes) sin cargar gasolina, el auto se considera inactivo y NO se suma a los gastos calculados del presupuesto
                const isStale = daysSinceLastRefill > 30;
                const isActiveInBudget = !isStale;

                if (logs.length === 1) {
                    const single = logs[0];
                    const cost = Number(single.totalCost);
                    const liters = Number(single.liters);
                    const pricePerL = Number(single.pricePerLiter) || (liters > 0 ? cost / liters : 0);
                    // Con 1 sola carga no hay odómetro previo medido; estimación preliminar asumiendo ciclo típico de 7 días
                    const dailyCost = cost / 7;
                    const dailyL = liters / 7;

                    vehicleResults.push({
                        vehicleId: vehicle.id,
                        vehicleName: vehicle.name,
                        plate: vehicle.plate,
                        model: vehicle.model,
                        dailyExpense: Math.round(dailyCost * 100) / 100,
                        weeklyExpense: Math.round(dailyCost * 7 * 100) / 100,
                        biweeklyExpense: Math.round(dailyCost * 15 * 100) / 100,
                        monthlyExpense: Math.round(dailyCost * 30 * 100) / 100,
                        dailyLiters: Math.round(dailyL * 100) / 100,
                        weeklyLiters: Math.round(dailyL * 7 * 100) / 100,
                        biweeklyLiters: Math.round(dailyL * 15 * 100) / 100,
                        monthlyLiters: Math.round(dailyL * 30 * 100) / 100,
                        dailyKm: 0,
                        monthlyKm: 0,
                        costPerKm: 0,
                        kmPerLiter: 0,
                        avgPricePerLiter: Math.round(pricePerL * 100) / 100,
                        avgDaysBetweenRefills: 7,
                        estimatedFullTankAutonomyKm: 0,
                        logsCount: 1,
                        isPreliminary: true,
                        daysSinceLastRefill,
                        lastRefillDate: lastLog.date,
                        isStale,
                        isActiveInBudget
                    });
                    return;
                }

                // 2 o más cargas: telemetría exacta entre primera y última recarga
                const firstLog = logs[0];

                const firstTime = new Date(firstLog.date).getTime();
                const rawDays = (lastTime - firstTime) / (1000 * 60 * 60 * 24);
                const daysElapsed = rawDays >= 1 ? rawDays : Math.max(1, (logs.length - 1) * 7);

                const deltaKm = Math.max(0, Number(lastLog.odometer) - Number(firstLog.odometer));
                const subsequentLogs = logs.slice(1);
                const totalCostConsumed = subsequentLogs.reduce((sum, l) => sum + Number(l.totalCost), 0);
                const totalLitersConsumed = subsequentLogs.reduce((sum, l) => sum + Number(l.liters), 0);

                const effCost = totalCostConsumed > 0 ? totalCostConsumed : logs.reduce((sum, l) => sum + Number(l.totalCost), 0);
                const effLiters = totalLitersConsumed > 0 ? totalLitersConsumed : logs.reduce((sum, l) => sum + Number(l.liters), 0);

                const dailyCost = effCost / daysElapsed;
                const dailyLiters = effLiters / daysElapsed;
                const dailyKm = deltaKm / daysElapsed;

                const kmPerLiter = effLiters > 0 && deltaKm > 0 ? (deltaKm / effLiters) : 0;
                const costPerKm = deltaKm > 0 ? (effCost / deltaKm) : 0;
                const avgPricePerLiter = effLiters > 0 ? (effCost / effLiters) : 0;
                const avgDaysBetweenRefills = Math.max(1, Math.round((daysElapsed / (logs.length - 1)) * 10) / 10);
                const tankCap = Number(vehicle.tankCapacity) || 0;
                const estimatedFullTankAutonomyKm = tankCap > 0 && kmPerLiter > 0 ? Math.round(tankCap * kmPerLiter) : 0;

                vehicleResults.push({
                    vehicleId: vehicle.id,
                    vehicleName: vehicle.name,
                    plate: vehicle.plate,
                    model: vehicle.model,
                    dailyExpense: Math.round(dailyCost * 100) / 100,
                    weeklyExpense: Math.round(dailyCost * 7 * 100) / 100,
                    biweeklyExpense: Math.round(dailyCost * 15 * 100) / 100,
                    monthlyExpense: Math.round(dailyCost * 30 * 100) / 100,
                    dailyLiters: Math.round(dailyLiters * 100) / 100,
                    weeklyLiters: Math.round(dailyLiters * 7 * 100) / 100,
                    biweeklyLiters: Math.round(dailyLiters * 15 * 100) / 100,
                    monthlyLiters: Math.round(dailyLiters * 30 * 100) / 100,
                    dailyKm: Math.round(dailyKm * 10) / 10,
                    monthlyKm: Math.round(dailyKm * 30 * 10) / 10,
                    costPerKm: Math.round(costPerKm * 100) / 100,
                    kmPerLiter: Math.round(kmPerLiter * 100) / 100,
                    avgPricePerLiter: Math.round(avgPricePerLiter * 100) / 100,
                    avgDaysBetweenRefills,
                    estimatedFullTankAutonomyKm,
                    logsCount: logs.length,
                    isPreliminary: false,
                    daysSinceLastRefill,
                    lastRefillDate: lastLog.date,
                    isStale,
                    isActiveInBudget
                });
            });

            // FILTRO DE INACTIVIDAD: Solo sumar los autos activos que no lleven más de 1 mes sin cargar
            const activeVehicles = vehicleResults.filter(v => v.isActiveInBudget && v.monthlyExpense > 0);
            const inactiveVehicles = vehicleResults.filter(v => v.isStale);

            const totalDaily = activeVehicles.reduce((s, v) => s + v.dailyExpense, 0);
            const totalWeekly = activeVehicles.reduce((s, v) => s + v.weeklyExpense, 0);
            const totalBiweekly = activeVehicles.reduce((s, v) => s + v.biweeklyExpense, 0);
            const totalMonthly = activeVehicles.reduce((s, v) => s + v.monthlyExpense, 0);
            const totalDailyLiters = activeVehicles.reduce((s, v) => s + v.dailyLiters, 0);
            const totalMonthlyLiters = activeVehicles.reduce((s, v) => s + v.monthlyLiters, 0);
            const totalDailyKm = activeVehicles.reduce((s, v) => s + v.dailyKm, 0);
            const totalMonthlyKm = activeVehicles.reduce((s, v) => s + v.monthlyKm, 0);

            const avgCostPerKm = totalDailyKm > 0 ? (totalDaily / totalDailyKm) : 0;
            const avgEfficiencyKmPerLiter = totalDailyLiters > 0 ? (totalDailyKm / totalDailyLiters) : 0;

            return {
                totalDaily: Math.round(totalDaily * 100) / 100,
                totalWeekly: Math.round(totalWeekly * 100) / 100,
                totalBiweekly: Math.round(totalBiweekly * 100) / 100,
                totalMonthly: Math.round(totalMonthly * 100) / 100,
                totalDailyLiters: Math.round(totalDailyLiters * 100) / 100,
                totalMonthlyLiters: Math.round(totalMonthlyLiters * 100) / 100,
                totalDailyKm: Math.round(totalDailyKm * 10) / 10,
                totalMonthlyKm: Math.round(totalMonthlyKm * 10) / 10,
                avgCostPerKm: Math.round(avgCostPerKm * 100) / 100,
                avgEfficiencyKmPerLiter: Math.round(avgEfficiencyKmPerLiter * 100) / 100,
                hasData: activeVehicles.length > 0,
                activeVehiclesCount: activeVehicles.length,
                inactiveVehiclesCount: inactiveVehicles.length,
                vehicles: vehicleResults
            };
        },

        totalEstimatedGasolineMonthly(state): number {
            return ((this as any).gasolineProjections as GasolineFleetProjection)?.totalMonthly || 0;
        },

        totalEstimatedGasolineBiweekly(state): number {
            return ((this as any).gasolineProjections as GasolineFleetProjection)?.totalBiweekly || 0;
        },

        totalEstimatedGasolineWeekly(state): number {
            return ((this as any).gasolineProjections as GasolineFleetProjection)?.totalWeekly || 0;
        },

        totalEstimatedGasolineDaily(state): number {
            return ((this as any).gasolineProjections as GasolineFleetProjection)?.totalDaily || 0;
        },

        totalFixedExpenses(state): number {
            // workaround for pinia getter `this` access or direct call if available
            // Note: to access other getters we use `this`
            const subs = (this as any).totalFixedSubscriptionExpenses || 0;
            const debts = (this as any).totalFixedDebtPayments || 0;
            const gas = (this as any).totalEstimatedGasolineMonthly || 0;
            return subs + debts + gas;
        },

        totalFixedIncome: (state) => {
            return state.subscriptions
                .filter(sub => sub.type === 'INCOME')
                .reduce((sum, sub) => {
                    let val = Number(sub.amount);
                    if (sub.frequency === 'YEARLY') val = val / 12;
                    else if (sub.frequency === 'QUARTERLY') val = val / 3;
                    else if (sub.frequency === 'BIMONTHLY') val = val / 2;
                    else if (sub.frequency === 'BIWEEKLY') val = val * 2;
                    else if (sub.frequency === 'WEEKLY') val = val * 4.33;
                    return sum + val;
                }, 0);
        },

        // Devuelve el balance proyectado sumando ingresos y restando gastos fijos según su frecuencia.
        // Asume un modelo simplificado donde si es mensual, se resta una vez en 30 dias.
        // Si es quincenal (BIMONTHLY) se resta/suma 2 veces en 30 días.
        cashFlowProjections(state): { d7: number; d15: number; d30: number } {
            const currentBalance = state.accounts.reduce((sum, acc) => {
                const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
                const balanceVal = Number(acc.balance);
                return sum + (isDebt ? -Math.abs(balanceVal) : balanceVal);
            }, 0);
            
            // Calculamos el impacto diario de los ingresos y gastos fijos usando los getters globales
            const dailyBurnRate = ((this as any).totalFixedExpenses || 0) / 30;
            const dailyIncomeRate = ((this as any).totalFixedIncome || 0) / 30;

            const netDaily = dailyIncomeRate - dailyBurnRate;

            return {
                d7: currentBalance + (netDaily * 7),
                d15: currentBalance + (netDaily * 15),
                d30: currentBalance + (netDaily * 30)
            };
        },

        totalDebt: (state) => {
            return state.accounts.reduce((sum, acc) => {
                if (acc.type === 'loan') return sum + Math.abs(Number(acc.balance));
                if (acc.type === 'card' && acc.sub_type === 'credit' && Number(acc.balance) < 0) return sum + Math.abs(Number(acc.balance));
                return sum;
            }, 0);
        },

        totalSavings: (state) => {
            return state.accounts.reduce((sum, acc) => {
                if (['savings', 'investment'].includes(acc.type)) return sum + Math.max(0, Number(acc.balance));
                return sum;
            }, 0);
        },

        expensesByCategoryThisMonth: (state) => {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            const expenses = state.transactions.filter(t => {
                const d = new Date(t.date);
                return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });

            const byCategory: Record<string, number> = {};
            expenses.forEach(t => {
                const cat = t.category || 'Otros';
                if (!byCategory[cat]) byCategory[cat] = 0;
                byCategory[cat] += Number(t.amount);
            });

            // Incluir gastos de gasolina (fuel logs) del mes actual que no tengan transacción (ej. creados sin cuenta)
            state.vehicles.forEach(v => {
                if (v.fuelLogs) {
                    v.fuelLogs.forEach(log => {
                        const d = new Date(log.date);
                        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                            // Revisar si existe una transacción con exactamente el mismo monto y fecha cercana (dentro del mismo minuto) para no duplicar
                            const hasTransaction = expenses.some(t => 
                                t.category === 'Gasolina' && 
                                Number(t.amount) === Number(log.totalCost) && 
                                Math.abs(new Date(t.date).getTime() - d.getTime()) < 60000
                            );
                            if (!hasTransaction) {
                                if (!byCategory['Gasolina']) byCategory['Gasolina'] = 0;
                                byCategory['Gasolina'] += Number(log.totalCost);
                            }
                        }
                    });
                }
            });

            return byCategory;
        },

        recentIncomeVsExpense: (state) => {
            // Get last 6 months (based on available data in state.transactions)
            const result: Record<string, { income: number, expense: number }> = {};
            
            state.transactions.forEach(t => {
                const d = new Date(t.date);
                const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                
                if (!result[monthKey]) {
                    result[monthKey] = { income: 0, expense: 0 };
                }
                
                if (t.type === 'income') {
                    result[monthKey].income += Number(t.amount);
                } else if (t.type === 'expense') {
                    result[monthKey].expense += Number(t.amount);
                } else if (['loan_payment', 'credit_payment'].includes(t.type)) {
                    // Solo contar la parte "saliente" del pago, no el recibo en la otra cuenta
                    if (!t.description || !(t.description.startsWith('Pago recibido') || t.description.startsWith('Transferencia recibida'))) {
                        result[monthKey].expense += Number(t.amount);
                    }
                }
            });

            // Incluir gastos de gasolina (fuel logs) que no tengan transacción
            state.vehicles.forEach(v => {
                if (v.fuelLogs) {
                    v.fuelLogs.forEach(log => {
                        const d = new Date(log.date);
                        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        
                        if (result[monthKey]) {
                            // Revisar si existe una transacción con exactamente el mismo monto y fecha cercana
                            const hasTransaction = state.transactions.some(t => 
                                t.type === 'expense' &&
                                t.category === 'Gasolina' && 
                                Number(t.amount) === Number(log.totalCost) && 
                                Math.abs(new Date(t.date).getTime() - d.getTime()) < 60000
                            );
                            if (!hasTransaction) {
                                result[monthKey].expense += Number(log.totalCost);
                            }
                        }
                    });
                }
            });

            // Format to array and sort chronologically
            return Object.entries(result).sort().map(([month, data]) => ({
                month,
                ...data
            })).slice(-6); // last 6 available months
        },

        upcomingPayments: (state) => {
            const payments: Array<{name: string, amount: number, date: Date, type: string, daysRemaining: number, sourceType: 'subscription' | 'account', sourceId: number, accountId?: number | null, category?: string, isProvisionTransfer?: boolean, statementMinimum?: number, statementNoInterest?: number}> = [];
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // 1. Suscripciones y Servicios
            state.subscriptions.forEach(sub => {
                if (!sub.paymentDay && !sub.nextPaymentDate) return;

                // Preferir nextPaymentDate del backend (se actualiza al registrar pago). Fallback:
                // computar el próximo día del ciclo. Ambos caminos ocultan el sub del cycle actual
                // si ya se pagó — resolvimos "los pagos no se propaga si se pagaron".
                let nextDate: Date;
                let amountToPay = Number(sub.amount);
                const isProvision = sub.isVariable && ['YEARLY', 'SEMIANNUAL', 'QUARTERLY', 'BIMONTHLY'].includes(sub.frequency);
                let isProvisionTransfer = false;

                if (sub.nextPaymentDate) {
                    // Evitar desfase de zona horaria al parsear fechas UTC
                    const dateParts = sub.nextPaymentDate.split('T')[0].split('-');
                    let billDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

                    // Si la fecha configurada o de inicio quedó en el pasado, proyectar la recurrencia al ciclo actual/próximo
                    if (billDate < today) {
                        billDate = computeUpcomingPaymentDate(billDate, sub.frequency, today);
                    }
                    const billMonth = billDate.getMonth();
                    const billYear = billDate.getFullYear();
                    const paymentDay = billDate.getDate();

                    if (isProvision) {
                        // Dynamically calculate the provision date for the current month
                        let provDate = new Date(today.getFullYear(), today.getMonth(), paymentDay);

                        // If provDate is the bill month (or past it), show the FULL bill
                        if (provDate.getFullYear() > billYear || (provDate.getFullYear() === billYear && provDate.getMonth() >= billMonth)) {
                            nextDate = new Date(billDate.getFullYear(), billDate.getMonth(), billDate.getDate());
                            // Full amount is kept
                        } else {
                            // Check if the user just paid the full bill this very same month.
                            // If they did, they don't start saving for the next cycle until next month!
                            if (sub.lastPaymentDate) {
                                const lastDate = new Date(sub.lastPaymentDate);
                                if (provDate.getFullYear() === lastDate.getFullYear() && provDate.getMonth() === lastDate.getMonth()) {
                                    return; // Skip this provision
                                }
                            }

                            // It's a provision month
                            const monthStart = new Date(provDate.getFullYear(), provDate.getMonth(), 1);
                            const monthEnd = new Date(provDate.getFullYear(), provDate.getMonth() + 1, 0, 23, 59, 59);
                            const hasPaidProvision = state.transactions.some(t => 
                                t.subscriptionId === sub.id && 
                                new Date(t.date) >= monthStart && 
                                new Date(t.date) <= monthEnd
                            );

                            if (hasPaidProvision) {
                                provDate.setMonth(provDate.getMonth() + 1);
                                if (provDate.getFullYear() === billYear && provDate.getMonth() === billMonth) {
                                    // Advanced into the bill month!
                                    nextDate = new Date(billDate.getFullYear(), billDate.getMonth(), billDate.getDate());
                                    // Full amount is kept
                                } else {
                                    nextDate = provDate;
                                    isProvisionTransfer = true;
                                    if (sub.frequency === 'YEARLY') amountToPay = amountToPay / 12;
                                    else if (sub.frequency === 'SEMIANNUAL') amountToPay = amountToPay / 6;
                                    else if (sub.frequency === 'QUARTERLY') amountToPay = amountToPay / 3;
                                    else if (sub.frequency === 'BIMONTHLY') amountToPay = amountToPay / 2;
                                }
                            } else {
                                nextDate = provDate;
                                isProvisionTransfer = true;
                                if (sub.frequency === 'YEARLY') amountToPay = amountToPay / 12;
                                else if (sub.frequency === 'SEMIANNUAL') amountToPay = amountToPay / 6;
                                else if (sub.frequency === 'QUARTERLY') amountToPay = amountToPay / 3;
                                else if (sub.frequency === 'BIMONTHLY') amountToPay = amountToPay / 2;
                            }
                        }
                    } else {
                        nextDate = new Date(billDate.getFullYear(), billDate.getMonth(), billDate.getDate());
                    }
                } else {
                    if (sub.frequency === 'WEEKLY') {
                        // paymentDay is 1-7 (Mon-Sun)
                        const targetDow = sub.paymentDay === 7 ? 0 : sub.paymentDay;
                        const delta = (targetDow - today.getDay() + 7) % 7 || 7;
                        nextDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + delta);
                    } else if (sub.frequency === 'SEMIMONTHLY') {
                        const day1 = sub.paymentDay > 100 ? Math.floor(sub.paymentDay / 100) : sub.paymentDay;
                        const day2 = sub.paymentDay > 100 ? sub.paymentDay % 100 : (day1 + 15 > 31 ? 31 : day1 + 15);
                        
                        const date1 = new Date(today.getFullYear(), today.getMonth(), day1);
                        const date2 = new Date(today.getFullYear(), today.getMonth(), day2);
                        
                        if (today <= date1) {
                            nextDate = date1;
                        } else if (today <= date2) {
                            nextDate = date2;
                        } else {
                            nextDate = new Date(today.getFullYear(), today.getMonth() + 1, day1);
                        }
                    } else {
                        nextDate = new Date(today.getFullYear(), today.getMonth(), sub.paymentDay);
                        if (nextDate < today) nextDate.setMonth(nextDate.getMonth() + 1);
                    }
                }

                // daysRemaining can be negative if the user missed the payment date.
                // We shouldn't hide it so the user can clearly see it's overdue.
                const daysRemaining = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                // We only hide it if it's crazily overdue (e.g. > 365 days) to avoid complete ghosts if abandoned,
                // but for normal overdue we keep it.
                if (daysRemaining < -365) return; 

                payments.push({
                    name: isProvisionTransfer ? `${sub.name} (Guardado mensual)` : sub.name,
                    amount: amountToPay,
                    date: nextDate,
                    type: isProvisionTransfer ? 'Guardado' : (sub.type === 'INCOME' ? 'Ingreso' : (sub.type === 'MEMBERSHIP' ? 'Membresía' : 'Servicio')),
                    daysRemaining,
                    sourceType: 'subscription',
                    sourceId: sub.id,
                    accountId: sub.accountId,
                    category: isProvisionTransfer ? 'Ahorro' : (sub.type === 'INCOME' ? 'Nómina' : 'Servicios'),
                    isProvisionTransfer
                });
            });

            // 2. Deudas (Tarjetas de crédito y Préstamos)
            state.accounts.forEach(acc => {
                const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
                if (!isDebt || Number(acc.balance) >= 0 || !acc.payment_day) return;
                // ponytail: ONCE = pago único; no proyectar recurrencia
                // if (acc.payment_frequency === 'ONCE') return;

                let nextDate: Date;
                if (acc.payment_frequency === 'WEEKLY') {
                    // payment_day 1-7 (1=Lun … 7=Dom); mapear a getDay() (0=Dom…6=Sáb)
                    const targetDow = acc.payment_day === 7 ? 0 : acc.payment_day;
                    const delta = (targetDow - today.getDay() + 7) % 7 || 7;
                    nextDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + delta);
                } else if (acc.payment_frequency === 'BIWEEKLY') {
                    nextDate = new Date(today.getFullYear(), today.getMonth(), acc.payment_day);
                    while (nextDate < today) nextDate.setDate(nextDate.getDate() + 14);
                } else {
                    nextDate = new Date(today.getFullYear(), today.getMonth(), acc.payment_day);
                    if (nextDate < today) nextDate.setMonth(nextDate.getMonth() + 1);
                }

                const daysRemaining = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                
                // Determinar el monto a pagar (monthly_payment si lo hay, o un estimado del saldo)
                let amountToPay = Number(acc.monthly_payment);
                if (acc.payment_frequency === 'ONCE') {
                    amountToPay = Math.abs(Number(acc.balance));
                } else if (!amountToPay || amountToPay === 0) {
                    // Si no hay pago mensual definido, sugerir un 5% del saldo o el total si es menor a 500
                    const balance = Math.abs(Number(acc.balance));
                    amountToPay = balance < 500 ? balance : balance * 0.05; 
                }

                // Descontar los pagos ya realizados en el ciclo actual.
                // Usamos una ventana de 15 días (o la mitad del ciclo) para no tomar como "adelanto" un pago atrasado del mes anterior.
                let cycleWindow = 15;
                if (acc.payment_frequency === 'WEEKLY') cycleWindow = 3;
                else if (acc.payment_frequency === 'BIWEEKLY') cycleWindow = 7;

                const cycleStart = new Date(nextDate.getTime() - (cycleWindow * 24 * 3600 * 1000));
                const nextDateEnd = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate(), 23, 59, 59);

                const paymentsThisCycle = state.transactions.filter(t => 
                    t.accountId === acc.id &&
                    (t.type === 'credit_payment' || t.type === 'loan_payment') &&
                    new Date(t.date) >= cycleStart &&
                    new Date(t.date) <= nextDateEnd
                );

                const totalPaidThisCycle = paymentsThisCycle.reduce((sum, t) => sum + Number(t.amount), 0);
                if (acc.payment_frequency !== 'ONCE') {
                    amountToPay = Math.max(0, amountToPay - totalPaidThisCycle);
                }

                if (amountToPay <= 0) return; // Ya se pagó la cuota de este ciclo


                payments.push({
                    name: `Pago ${acc.name}`,
                    amount: amountToPay,
                    date: nextDate,
                    type: acc.type === 'loan' ? 'Préstamo' : 'Tarjeta de Crédito',
                    daysRemaining,
                    sourceType: 'account',
                    sourceId: acc.id,
                    accountId: acc.id,
                    category: acc.type === 'loan' ? 'Pago Préstamo' : 'Pago Tarjeta',
                    statementMinimum: acc.statement?.minimumPayment,
                    statementNoInterest: acc.statement?.noInterestPayment
                });
            });

            // Ordenar por días restantes y retornar solo próximos 15 días
            return payments.filter(p => p.daysRemaining <= 15).sort((a, b) => a.daysRemaining - b.daysRemaining);
        },

        // Simulación de Flujo de Caja por Eventos Exactos (Día a Día por 30 días)
        exact30DayCashFlow(state): {
            days: Array<{
                dayIndex: number;
                dateStr: string;
                label: string;
                balance: number;
                inflows: number;
                outflows: number;
                events: Array<{ name: string; amount: number; isIncome: boolean }>;
            }>;
            d7: number;
            d15: number;
            d30: number;
            lowestBalance: number;
            lowestDayLabel: string;
            hasLiquidityValley: boolean;
        } {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // Liquidez inicial real (efectivo, débito, nómina, ahorro)
            let runningLiquid = state.accounts
                .filter(acc => acc.type === 'cash' || (acc.type === 'card' && acc.sub_type !== 'credit') || acc.type === 'savings')
                .reduce((sum, acc) => sum + Math.max(0, Number(acc.balance)), 0);

            // Si no hay cuentas líquidas registradas aún, caer al totalBalance
            if (runningLiquid === 0 && state.accounts.length > 0) {
                runningLiquid = state.accounts.reduce((sum, acc) => {
                    const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
                    const balanceVal = Number(acc.balance);
                    return sum + (isDebt ? -Math.abs(balanceVal) : balanceVal);
                }, 0);
            }

            const daysMap: Map<string, { inflows: number; outflows: number; events: Array<{ name: string; amount: number; isIncome: boolean }> }> = new Map();

            for (let i = 0; i <= 30; i++) {
                const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                daysMap.set(key, { inflows: 0, outflows: 0, events: [] });
            }

            const addEvent = (date: Date, name: string, amount: number, isIncome: boolean) => {
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const bucket = daysMap.get(key);
                if (bucket && amount > 0) {
                    if (isIncome) bucket.inflows += amount;
                    else bucket.outflows += amount;
                    bucket.events.push({ name, amount, isIncome });
                }
            };

            const endWindow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

            // 1. Proyectar suscripciones e ingresos recurrentes en los próximos 30 días
            state.subscriptions.forEach(sub => {
                if (!sub.paymentDay && !sub.nextPaymentDate) return;
                const isIncome = sub.type === 'INCOME';
                const amount = Number(sub.amount);
                if (amount <= 0) return;

                if (sub.frequency === 'SEMIMONTHLY' && !sub.nextPaymentDate) {
                    const rawDay = sub.paymentDay || 1;
                    const day1 = rawDay > 100 ? Math.floor(rawDay / 100) : rawDay;
                    const day2 = rawDay > 100 ? rawDay % 100 : Math.min(31, day1 + 15);
                    for (let mOffset = 0; mOffset <= 1; mOffset++) {
                        const d1 = new Date(today.getFullYear(), today.getMonth() + mOffset, day1);
                        const d2 = new Date(today.getFullYear(), today.getMonth() + mOffset, day2);
                        if (d1 >= today && d1 <= endWindow) addEvent(d1, sub.name, amount, isIncome);
                        if (d2 >= today && d2 <= endWindow) addEvent(d2, sub.name, amount, isIncome);
                    }
                    return;
                }

                let cursor: Date;
                if (sub.nextPaymentDate) {
                    cursor = computeUpcomingPaymentDate(sub.nextPaymentDate, sub.frequency, today);
                } else if (sub.frequency === 'WEEKLY') {
                    const targetDow = sub.paymentDay === 7 ? 0 : (sub.paymentDay || 1);
                    const delta = (targetDow - today.getDay() + 7) % 7;
                    cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate() + delta);
                } else {
                    const maxD = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                    cursor = new Date(today.getFullYear(), today.getMonth(), Math.min(sub.paymentDay || 1, maxD));
                    if (cursor < today) {
                        const nextMaxD = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();
                        cursor = new Date(today.getFullYear(), today.getMonth() + 1, Math.min(sub.paymentDay || 1, nextMaxD));
                    }
                }

                let safety = 0;
                while (cursor <= endWindow && safety < 10) {
                    safety++;
                    if (cursor >= today) {
                        let eventAmt = amount;
                        if (sub.isVariable && ['YEARLY', 'SEMIANNUAL', 'QUARTERLY', 'BIMONTHLY'].includes(sub.frequency)) {
                            if (sub.frequency === 'YEARLY') eventAmt = amount / 12;
                            else if (sub.frequency === 'SEMIANNUAL') eventAmt = amount / 6;
                            else if (sub.frequency === 'QUARTERLY') eventAmt = amount / 3;
                            else if (sub.frequency === 'BIMONTHLY') eventAmt = amount / 2;
                        }
                        addEvent(cursor, sub.name, eventAmt, isIncome);
                    }
                    const nextRef = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
                    if (sub.frequency === 'WEEKLY') {
                        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
                    } else if (sub.frequency === 'BIWEEKLY') {
                        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 14);
                    } else {
                        cursor = computeUpcomingPaymentDate(cursor, sub.frequency, nextRef);
                    }
                }
            });

            // 2. Proyectar pagos de deudas (TDC y Préstamos) en los próximos 30 días
            state.accounts.forEach(acc => {
                const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
                if (!isDebt || Number(acc.balance) >= 0 || !acc.payment_day) return;

                let amountToPay = Number(acc.monthly_payment);
                if (acc.statement?.noInterestPayment && acc.statement.noInterestPayment > 0) {
                    amountToPay = acc.statement.noInterestPayment;
                } else if (acc.payment_frequency === 'ONCE') {
                    amountToPay = Math.abs(Number(acc.balance));
                } else if (!amountToPay || amountToPay === 0) {
                    const balance = Math.abs(Number(acc.balance));
                    amountToPay = balance < 500 ? balance : balance * (Number(acc.minimum_payment_percentage || 5) / 100);
                }

                if (amountToPay <= 0) return;

                if (acc.payment_frequency === 'WEEKLY') {
                    const targetDow = acc.payment_day === 7 ? 0 : acc.payment_day;
                    const delta = (targetDow - today.getDay() + 7) % 7;
                    let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate() + delta);
                    while (cursor <= endWindow) {
                        addEvent(cursor, `Pago ${acc.name}`, amountToPay, false);
                        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
                    }
                } else if (acc.payment_frequency === 'BIWEEKLY') {
                    let cursor = new Date(today.getFullYear(), today.getMonth(), Math.min(acc.payment_day, 28));
                    while (cursor < today) cursor.setDate(cursor.getDate() + 14);
                    while (cursor <= endWindow) {
                        addEvent(cursor, `Pago ${acc.name}`, amountToPay, false);
                        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 14);
                    }
                } else {
                    const maxD = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                    let cursor = new Date(today.getFullYear(), today.getMonth(), Math.min(acc.payment_day, maxD));
                    if (cursor < today) {
                        const nextMaxD = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();
                        cursor = new Date(today.getFullYear(), today.getMonth() + 1, Math.min(acc.payment_day, nextMaxD));
                    }
                    if (cursor >= today && cursor <= endWindow) {
                        addEvent(cursor, `Pago ${acc.name}`, amountToPay, false);
                    }
                }
            });

            // 3. Proyectar gastos fijos de combustible estimados (cadencia semanal)
            const gasFleet = (this as any).gasolineProjections as GasolineFleetProjection;
            if (gasFleet && gasFleet.totalDaily > 0) {
                const weeklyFuel = gasFleet.totalWeekly;
                for (let offset = 7; offset <= 30; offset += 7) {
                    const fuelDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
                    if (fuelDate <= endWindow) {
                        addEvent(fuelDate, 'Gasolina Proyectada (Consumo semanal)', weeklyFuel, false);
                    }
                }
            }

            const days: Array<{
                dayIndex: number;
                dateStr: string;
                label: string;
                balance: number;
                inflows: number;
                outflows: number;
                events: Array<{ name: string; amount: number; isIncome: boolean }>;
            }> = [];

            let currentBal = runningLiquid;
            let lowestBalance = runningLiquid;
            let lowestDayLabel = 'Hoy';

            let idx = 0;
            for (const [dateStr, info] of daysMap.entries()) {
                currentBal = currentBal + info.inflows - info.outflows;
                const parts = dateStr.split('-');
                const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                const label = idx === 0 ? 'Hoy' : dObj.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

                if (currentBal < lowestBalance) {
                    lowestBalance = currentBal;
                    lowestDayLabel = label;
                }

                days.push({
                    dayIndex: idx,
                    dateStr,
                    label,
                    balance: currentBal,
                    inflows: info.inflows,
                    outflows: info.outflows,
                    events: info.events
                });
                idx++;
            }

            return {
                days,
                d7: days[7]?.balance ?? currentBal,
                d15: days[15]?.balance ?? currentBal,
                d30: days[30]?.balance ?? currentBal,
                lowestBalance,
                lowestDayLabel,
                hasLiquidityValley: lowestBalance < 0
            };
        }
    },

    actions: {
        async fetchAccounts() {
            this.loading = true;
            try {
                const res = await api.get(`/finance/accounts?t=${new Date().getTime()}`);
                if (res.data.success) {
                    this.accounts = res.data.data.map((acc: any, index: number) => ({
                        id: acc.id,
                        name: acc.name,
                        type: acc.type,
                        sub_type: acc.subType,
                        balance: Number(acc.balance),
                        credit_limit: Number(acc.creditLimit),
                        interest_rate: Number(acc.interestRate || 0),
                        monthly_payment: Number(acc.monthlyPayment || 0),
                        payment_frequency: acc.paymentFrequency || 'MONTHLY',
                        cutoff_day: Number(acc.cutoffDay || 0),
                        payment_day: Number(acc.paymentDay || 0),
                        minimum_payment_percentage: Number(acc.minimumPaymentPercentage || 5.0),
                        currency: acc.currency,
                        color: COLORS[index % COLORS.length],
                        statement: acc.statement
                    }));
                }
            } catch (err) {
                console.error("Error fetching accounts:", err);
                this.error = "Error al cargar cuentas";
            } finally {
                this.loading = false;
            }
        },

        async fetchTransactions() {
            this.loading = true;
            try {
                const res = await api.get(`/finance/transactions?t=${new Date().getTime()}`);
                if (res.data.success) {
                    this.transactions = res.data.data.map((tx: any) => ({
                        ...tx,
                        amount: Number(tx.amount),
                        account: tx.account ? { name: tx.account.name } : undefined
                    }));
                    this.syncCategories();
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
                this.error = "Error al cargar transacciones";
            } finally {
                this.loading = false;
            }
        },

        async fetchTasks() {
            try {
                const res = await api.get('/tasks');
                if (res.data.success) {
                    this.tasks = res.data.data;
                    this.syncCategories();
                }
            } catch (err) { console.error(err); }
        },

        async addTransaction(tx: Omit<Transaction, 'id'>) {
            try {
                const res = await api.post('/finance/transactions', tx);
                if (res.data.success) {
                    // Backend refresca balance de cuenta y (si viene subscriptionId) lastPayment/nextPayment
                    // en un batch atómico. El store tiene que jalar los 3 para que "Próximos Pagos" refleje
                    // que ese sub ya se pagó este ciclo.
                    await Promise.all([
                        this.fetchTransactions(),
                        this.fetchAccounts(),
                        this.fetchSubscriptions(),
                    ]);
                } else {
                    alert("Error al registrar transacción: " + (res.data.message || "Error desconocido"));
                }
            } catch (err: any) {
                console.error("Error creating transaction:", err);
                alert("Error de conexión al registrar transacción: " + (err.response?.data?.message || err.message || "Error desconocido"));
            }
        },

        async deleteTransaction(id: number) {
            try {
                const res = await api.delete(`/finance/transactions/${id}`);
                if (res.data.success) {
                    await this.fetchTransactions();
                    await this.fetchAccounts();
                } else {
                    alert("Error al eliminar transacción: " + (res.data.message || "Error desconocido"));
                }
            } catch (err: any) {
                console.error("Error deleting transaction:", err);
                alert("Error de conexión al eliminar transacción: " + (err.response?.data?.message || err.message || "Error desconocido"));
            }
        },

        async updateTransaction(id: number, tx: Partial<Transaction>) {
            try {
                const res = await api.put(`/finance/transactions/${id}`, tx);
                if (res.data.success) {
                    await this.fetchTransactions();
                    await this.fetchAccounts();
                } else {
                    alert("Error al actualizar transacción: " + (res.data.message || "Error desconocido"));
                }
            } catch (err: any) {
                console.error("Error updating transaction:", err);
                alert("Error de conexión al actualizar transacción: " + (err.response?.data?.message || err.message || "Error desconocido"));
            }
        },

        async addAccount(account: Omit<Account, 'id' | 'color'>) {
            try {
                const payload = {
                    ...account,
                    subType: account.sub_type,
                    creditLimit: account.credit_limit,
                    cutoffDay: account.cutoff_day,
                    paymentDay: account.payment_day,
                    interestRate: account.interest_rate,
                    monthlyPayment: account.monthly_payment,
                    paymentFrequency: account.payment_frequency,
                    minimumPaymentPercentage: account.minimum_payment_percentage
                };
                const res = await api.post('/finance/accounts', payload);
                if (res.data.success) {
                    await this.fetchAccounts();
                } else {
                    alert("Error al agregar cuenta: " + (res.data.message || "Error desconocido"));
                }
            } catch (err: any) {
                console.error("Error creating account:", err);
                alert("Error de conexión al agregar cuenta: " + (err.response?.data?.message || err.message || "Error desconocido"));
            }
        },

        async updateAccount(id: number, changes: Partial<Account>) {
            try {
                // ponytail: mapeo explícito snake→camel; spread mezclaba ambos y el schema .strict() lo rechazaba
                const map: Record<string, string> = {
                    sub_type: 'subType',
                    credit_limit: 'creditLimit',
                    cutoff_day: 'cutoffDay',
                    payment_day: 'paymentDay',
                    interest_rate: 'interestRate',
                    monthly_payment: 'monthlyPayment',
                    payment_frequency: 'paymentFrequency',
                    minimum_payment_percentage: 'minimumPaymentPercentage'
                };
                const payload: any = {};
                for (const [k, v] of Object.entries(changes)) {
                    payload[map[k] ?? k] = v;
                }

                const res = await api.put(`/finance/accounts/${id}`, payload);
                if (res.data.success) {
                    await this.fetchAccounts();
                }
            } catch (err: any) {
                console.error("Error updating account:", err);
                alert("Error al actualizar cuenta: " + (err.response?.data?.message || err.message || "Error desconocido"));
            }
        },

        async deleteAccount(id: number) {
            try {
                const res = await api.delete(`/finance/accounts/${id}`);
                if (res.data.success) {
                    this.accounts = this.accounts.filter(a => a.id !== id);
                }
            } catch (err) {
                console.error("Error deleting account:", err);
            }
        },

        async addCategory(newCat: string) {
            if (newCat && !this.categories.includes(newCat)) {
                this.categories.push(newCat);
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('taskman_categories', JSON.stringify(this.categories));
                }
            }
        },

        async removeCategory(cat: string) {
            this.categories = this.categories.filter(c => c !== cat);
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('taskman_categories', JSON.stringify(this.categories));
            }
        },

        async updateCategory(oldCat: string, newCat: string) {
            if (newCat && !this.categories.includes(newCat)) {
                const index = this.categories.indexOf(oldCat);
                if (index !== -1) {
                    this.categories[index] = newCat;
                    if (typeof window !== 'undefined' && window.localStorage) {
                        window.localStorage.setItem('taskman_categories', JSON.stringify(this.categories));
                    }
                }
            }
        },

        syncCategories() {
            const allCats = new Set<string>(this.categories);
            let added = false;
            
            this.transactions.forEach(tx => {
                if (tx.category && typeof tx.category === 'string' && !allCats.has(tx.category)) {
                    allCats.add(tx.category);
                    added = true;
                }
            });
            
            this.tasks.forEach(t => {
                if (t.category && typeof t.category === 'string' && !allCats.has(t.category)) {
                    allCats.add(t.category);
                    added = true;
                }
            });
            
            if (added) {
                this.categories = Array.from(allCats);
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('taskman_categories', JSON.stringify(this.categories));
                }
            }
        },

        async initialize() {
            if (typeof window !== 'undefined' && window.localStorage) {
                const stored = window.localStorage.getItem('taskman_categories');
                if (stored) {
                    try {
                        this.categories = JSON.parse(stored);
                    } catch (e) {
                        console.error("Error parsing stored categories", e);
                    }
                }
            }
            await Promise.all([
                this.fetchAccounts(),
                this.fetchTransactions(),
                this.fetchSubscriptions(),
                this.fetchTasks(),
                this.fetchVehicles(),
                this.fetchWishlistItems()
            ]);

            this.syncCategories();
        },

        async fetchSubscriptions() {
            try {
                const res = await api.get('/finance/subscriptions');
                if (res.data.success) {
                    this.subscriptions = res.data.data.map((s: any) => ({
                        ...s,
                        amount: Number(s.amount),
                        lastPaymentDate: s.lastPaymentDate
                    }));
                }
            } catch (err) {
                console.error("Error fetching subscriptions:", err);
            }
        },

        async addSubscription(sub: Omit<Subscription, 'id'>) {
            try {
                const res = await api.post('/finance/subscriptions', sub);
                if (res.data.success) {
                    await this.fetchSubscriptions();
                } else {
                    alert("Error al agregar suscripción: " + (res.data.message || "Error desconocido"));
                }
            } catch (err: any) {
                console.error("Error adding subscription:", err);
                alert("Error de conexión al agregar suscripción: " + (err.response?.data?.message || err.message || "Error desconocido"));
            }
        },

        async deleteSubscription(id: number) {
            try {
                await api.delete(`/finance/subscriptions/${id}`);
                this.subscriptions = this.subscriptions.filter(s => s.id !== id);
            } catch (err) { console.error(err); }
        },

        async updateSubscription(id: number, sub: Partial<Subscription>) {
            try {
                const res = await api.put(`/finance/subscriptions/${id}`, sub);
                if (res.data.success) {
                    await this.fetchSubscriptions();
                }
            } catch (err) {
                console.error("Error updating subscription:", err);
            }
        },

        async fetchVehicles() {
            try {
                const res = await api.get('/vehicles');
                if (res.data.success) {
                    this.vehicles = res.data.data.map((v: any) => ({
                        ...v,
                        fuelLogs: v.fuelLogs?.map((log: any) => ({
                            ...log,
                            odometer: Number(log.odometer),
                            liters: Number(log.liters),
                            pricePerLiter: Number(log.pricePerLiter),
                            totalCost: Number(log.totalCost)
                        })) || []
                    }));
                }
            } catch (err) { console.error("Error fetching vehicles:", err); }
        },

        async addVehicle(vehicle: any) {
            try {
                const res = await api.post('/vehicles', vehicle);
                if (res.data.success) {
                    await this.fetchVehicles();
                }
            } catch (err) { console.error(err); }
        },

        async updateVehicle(id: number, changes: Partial<Vehicle>) {
            try {
                const res = await api.put(`/vehicles/${id}`, changes);
                if (res.data.success) {
                    await this.fetchVehicles();
                }
            } catch (err) {
                console.error("Error updating vehicle:", err);
            }
        },

        async deleteFuelLog(id: number) {
            try {
                const res = await api.delete(`/vehicles/logs/${id}`);
                if (res.data.success) {
                    await this.fetchVehicles();
                    await this.fetchAccounts();
                    await this.fetchTransactions();
                    return true;
                } else {
                    alert("Error al eliminar: " + (res.data.message || "Desconocido"));
                    return false;
                }
            } catch (err: any) {
                console.error(err);
                alert("Error de red o servidor: " + (err.response?.data?.message || err.message));
                return false;
            }
        },

        async addFuelLog(log: any) {
            try {
                const res = await api.post('/vehicles/logs', log);
                if (res.data.success) {
                    await this.fetchVehicles();
                    await this.fetchAccounts();
                    await this.fetchTransactions();
                    return true;
                } else {
                    alert("Error al guardar: " + (res.data.message || "Desconocido"));
                    return false;
                }
            } catch (err: any) { 
                console.error(err); 
                alert("Error de red o servidor: " + (err.response?.data?.message || err.message));
                return false;
            }
        },

        async fetchWishlistItems() {
            try {
                const res = await api.get('/finance/wishlist');
                if (res.data.success) {
                    this.wishlistItems = res.data.data;
                } else {
                    this.wishlistItems = res.data;
                }
            } catch (err) { console.error("Error fetching wishlist:", err); }
        },

        async addWishlistItem(item: any) {
            try {
                const res = await api.post('/finance/wishlist', item);
                await this.fetchWishlistItems();
            } catch (err) { console.error("Error adding wishlist item:", err); }
        },

        async updateWishlistItem(id: number, item: any) {
            try {
                const res = await api.put(`/finance/wishlist/${id}`, item);
                await this.fetchWishlistItems();
            } catch (err) { console.error("Error updating wishlist item:", err); }
        },

        async deleteWishlistItem(id: number) {
            try {
                await api.delete(`/finance/wishlist/${id}`);
                await this.fetchWishlistItems();
            } catch (err) { console.error("Error deleting wishlist item:", err); }
        }
    }
});
