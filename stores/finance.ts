import { defineStore } from 'pinia';
import api from '../utils/api';

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
    currency: string;
    color: string; // Front-end decoration
}

export interface Transaction {
    id: number;
    accountId: number;
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: string;
    subscriptionId?: number;
    account?: { name: string };
}

export interface Subscription {
    id: number;
    name: string;
    amount: number;
    currency: string;
    frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'BIMONTHLY' | 'YEARLY';
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
    fuelLogs: FuelLog[];
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
            const expenses = state.transactions.filter(t => 
                t.type === 'expense' || 
                t.type === 'loan_payment' || 
                t.type === 'credit_payment'
            ).reduce((sum, t) => sum + Number(t.amount), 0);
            return income - expenses;
        },

        totalFixedExpenses: (state) => {
            return state.subscriptions
                .filter(sub => sub.type !== 'INCOME')
                .reduce((sum, sub) => {
                    let val = Number(sub.amount);
                    if (sub.frequency === 'YEARLY') val = val / 12;
                    else if (sub.frequency === 'BIMONTHLY') val = val / 2;
                    else if (sub.frequency === 'BIWEEKLY') val = val * 2;
                    else if (sub.frequency === 'WEEKLY') val = val * 4.33; // aprox semanas por mes
                    return sum + val;
                }, 0);
        },

        totalFixedIncome: (state) => {
            return state.subscriptions
                .filter(sub => sub.type === 'INCOME')
                .reduce((sum, sub) => {
                    let val = Number(sub.amount);
                    if (sub.frequency === 'YEARLY') val = val / 12;
                    else if (sub.frequency === 'BIMONTHLY') val = val / 2;
                    else if (sub.frequency === 'BIWEEKLY') val = val * 2;
                    else if (sub.frequency === 'WEEKLY') val = val * 4.33;
                    return sum + val;
                }, 0);
        },

        // Devuelve el balance proyectado sumando ingresos y restando gastos fijos según su frecuencia.
        // Asume un modelo simplificado donde si es mensual, se resta una vez en 30 dias.
        // Si es quincenal (BIMONTHLY) se resta/suma 2 veces en 30 días.
        cashFlowProjections: (state): { d7: number; d15: number; d30: number } => {
            const currentBalance = state.accounts.reduce((sum, acc) => {
                const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
                const balanceVal = Number(acc.balance);
                return sum + (isDebt ? -Math.abs(balanceVal) : balanceVal);
            }, 0);
            
            // Calculamos el impacto diario de los ingresos y gastos fijos
            const dailyBurnRate = state.subscriptions.filter(s => s.type !== 'INCOME').reduce((sum, sub) => {
                let daily = Number(sub.amount);
                if (sub.frequency === 'MONTHLY') daily = daily / 30;
                else if (sub.frequency === 'BIMONTHLY') daily = daily / 60;
                else if (sub.frequency === 'BIWEEKLY') daily = daily / 15;
                else if (sub.frequency === 'WEEKLY') daily = daily / 7;
                else if (sub.frequency === 'YEARLY') daily = daily / 365;
                return sum + daily;
            }, 0);

            const dailyIncomeRate = state.subscriptions.filter(s => s.type === 'INCOME').reduce((sum, sub) => {
                let daily = Number(sub.amount);
                if (sub.frequency === 'MONTHLY') daily = daily / 30;
                else if (sub.frequency === 'BIMONTHLY') daily = daily / 60;
                else if (sub.frequency === 'BIWEEKLY') daily = daily / 15;
                else if (sub.frequency === 'WEEKLY') daily = daily / 7;
                else if (sub.frequency === 'YEARLY') daily = daily / 365;
                return sum + daily;
            }, 0);

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
                } else if (['expense', 'loan_payment', 'credit_payment'].includes(t.type)) {
                    result[monthKey].expense += Number(t.amount);
                }
            });

            // Convert to array and sort chronologically
            return Object.keys(result).sort().map(key => ({
                month: key,
                ...result[key]
            })).slice(-6); // last 6 available months
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
                        currency: acc.currency,
                        color: COLORS[index % COLORS.length]
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
                }
            } catch (err) { console.error(err); }
        },

        async addTransaction(tx: Omit<Transaction, 'id'>) {
            try {
                const res = await api.post('/finance/transactions', tx);
                if (res.data.success) {
                    await this.fetchTransactions();
                    await this.fetchAccounts(); // Update balances
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
                    paymentFrequency: account.payment_frequency
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
                const payload: any = { ...changes };
                if (changes.sub_type !== undefined) payload.subType = changes.sub_type;
                if (changes.credit_limit !== undefined) payload.creditLimit = changes.credit_limit;
                if (changes.cutoff_day !== undefined) payload.cutoffDay = changes.cutoff_day;
                if (changes.payment_day !== undefined) payload.paymentDay = changes.payment_day;
                if (changes.interest_rate !== undefined) payload.interestRate = changes.interest_rate;
                if (changes.monthly_payment !== undefined) payload.monthlyPayment = changes.monthly_payment;
                if (changes.payment_frequency !== undefined) payload.paymentFrequency = changes.payment_frequency;

                const res = await api.put(`/finance/accounts/${id}`, payload);
                if (res.data.success) {
                    await this.fetchAccounts();
                }
            } catch (err) {
                console.error("Error updating account:", err);
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

        async initialize() {
            await Promise.all([
                this.fetchAccounts(),
                this.fetchTransactions(),
                this.fetchSubscriptions(),
                this.fetchTasks(),
                this.fetchVehicles()
            ]);
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
        }
    }
});
