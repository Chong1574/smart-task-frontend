import { defineStore } from 'pinia';
import api from '../api';

// --- Tipos alineados con tu Lógica de Negocio ---
export type AccountType = 'card' | 'loan' | 'investment' | 'cash' | 'savings';
export type AccountSubType = 'debit' | 'credit' | 'payroll' | 'n/a';
export type TransactionType = 'income' | 'expense' | 'investment' | 'credit_payment' | 'loan_payment' | 'transfer';

export interface Account {
    id: number;
    name: string;
    type: AccountType;
    sub_type: AccountSubType;
    balance: number;
    credit_limit: number;
    interest_rate: number;
    monthly_payment: number;
    payment_frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
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
    frequency: 'MONTHLY' | 'YEARLY';
    type: 'MEMBERSHIP' | 'SERVICE';
    isVariable: boolean;
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
    state: () => ({
        categories: ['Comida', 'Transporte', 'Servicios', 'Ocio', 'Salario', 'Renta', 'Inversión'] as string[],
        accounts: [] as Account[],
        transactions: [] as Transaction[],
        subscriptions: [] as Subscription[],
        vehicles: [] as Vehicle[],
        tasks: [] as any[],
        loading: false,
        error: null as string | null
    }),

    getters: {
        totalIncome: (state) => state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpense: (state) => state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
        totalBalance: (state) => state.accounts.reduce((sum, acc) => sum + Number(acc.balance), 0),

        netBudget: (state) => {
            const income = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
            const expenses = state.transactions.filter(t => t.type === 'expense' || t.type === 'loan_payment').reduce((sum, t) => sum + Number(t.amount), 0);
            return income - expenses;
        },

        totalFixedExpenses: (state) => {
            return state.subscriptions.reduce((sum, sub) => {
                let val = Number(sub.amount);
                if (sub.frequency === 'YEARLY') val = val / 12;
                return sum + val;
            }, 0);
        }
    },

    actions: {
        async fetchAccounts() {
            this.loading = true;
            try {
                const res = await api.get('/finance/accounts');
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
                const res = await api.get('/finance/transactions');
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
                    await this.fetchAccounts();
                }
            } catch (err) {
                console.error("Error submitting transaction:", err);
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
                }
            } catch (err) {
                console.error("Error creating account:", err);
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
            if (!this.categories.includes(newCat)) {
                this.categories.push(newCat);
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
                }
            } catch (err) {
                console.error("Error creating subscription:", err);
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

        async addFuelLog(log: any) {
            try {
                const res = await api.post('/vehicles/logs', log);
                if (res.data.success) {
                    await this.fetchVehicles();
                    await this.fetchAccounts();
                    await this.fetchTransactions();
                }
            } catch (err) { console.error(err); }
        }
    }
});
