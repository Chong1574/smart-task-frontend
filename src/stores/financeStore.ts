import { defineStore } from 'pinia';

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
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
        }
    },

    actions: {
        async fetchAccounts() {
            this.loading = true;
            try {
                const res = await fetch(`${API_URL}/finance/accounts`);
                const json = await res.json();
                if (json.success) {
                    // Map Backend Data to Frontend Model (add formatting/colors)
                    this.accounts = json.data.map((acc: any, index: number) => ({
                        id: acc.id,
                        name: acc.name,
                        type: acc.type,
                        sub_type: acc.subType, // camelCase from DB
                        balance: Number(acc.balance),
                        credit_limit: Number(acc.creditLimit),
                        interest_rate: Number(acc.interestRate || 0),
                        cutoff_day: Number(acc.cutoffDay || 0),
                        payment_day: Number(acc.paymentDay || 0),
                        currency: acc.currency,
                        color: COLORS[index % COLORS.length] // Assign cyclic colors
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
                const res = await fetch(`${API_URL}/finance/transactions`);
                const json = await res.json();
                if (json.success) {
                    this.transactions = json.data.map((tx: any) => ({
                        ...tx,
                        amount: Number(tx.amount) // Ensure number type
                    }));
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
                this.error = "Error al cargar transacciones";
            } finally {
                this.loading = false;
            }
        },

        async addTransaction(tx: Omit<Transaction, 'id'>) {
            try {
                const res = await fetch(`${API_URL}/finance/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tx)
                });
                const json = await res.json();

                if (json.success) {
                    // Backend handles balance update, so we refresh everything to stay in sync
                    await this.fetchTransactions();
                    await this.fetchAccounts();
                } else {
                    console.error("Failed to add transaction:", json.message);
                }
            } catch (err) {
                console.error("Error submitting transaction:", err);
            }
        },

        async addAccount(account: Omit<Account, 'id' | 'color'>) {
            try {
                // Map snake_case (Frontend) to camelCase (Backend)
                const payload = {
                    ...account,
                    subType: account.sub_type,
                    creditLimit: account.credit_limit,
                    cutoffDay: account.cutoff_day,
                    paymentDay: account.payment_day,
                    interestRate: account.interest_rate
                };

                const res = await fetch(`${API_URL}/finance/accounts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();

                if (json.success) {
                    await this.fetchAccounts();
                }
            } catch (err) {
                console.error("Error creating account:", err);
            }
        },

        async updateAccount(id: number, changes: Partial<Account>) {
            try {
                // Map snake_case to camelCase for partial updates
                const payload: any = { ...changes };
                if (changes.sub_type !== undefined) payload.subType = changes.sub_type;
                if (changes.credit_limit !== undefined) payload.creditLimit = changes.credit_limit;
                if (changes.cutoff_day !== undefined) payload.cutoffDay = changes.cutoff_day;
                if (changes.payment_day !== undefined) payload.paymentDay = changes.payment_day;
                if (changes.interest_rate !== undefined) payload.interestRate = changes.interest_rate;

                const res = await fetch(`${API_URL}/finance/accounts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (json.success) {
                    await this.fetchAccounts();
                }
            } catch (err) {
                console.error("Error updating account:", err);
            }
        },

        async deleteAccount(id: number) {
            try {
                const res = await fetch(`${API_URL}/finance/accounts/${id}`, {
                    method: 'DELETE'
                });
                const json = await res.json();
                if (json.success) {
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
            await Promise.all([this.fetchAccounts(), this.fetchTransactions()]);
        }
    }
});