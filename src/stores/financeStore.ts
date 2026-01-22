import { defineStore } from 'pinia'

export interface Account {
    id: number;
    name: string;
    type: 'debit' | 'credit' | 'cash';
    balance: number;
    currency: string;
    color: string; // Para el gradiente de la tarjeta visual
}

export interface Transaction {
    id: number;
    accountId: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
}

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        accounts: [
            { id: 1, name: 'BBVA Nómina', type: 'debit', balance: 12500.50, currency: 'MXN', color: 'from-blue-600 to-blue-800' },
            { id: 2, name: 'Efectivo', type: 'cash', balance: 450.00, currency: 'MXN', color: 'from-emerald-500 to-emerald-700' },
            { id: 3, name: 'Nu Crédito', type: 'credit', balance: -2100.00, currency: 'MXN', color: 'from-purple-600 to-purple-800' }
        ] as Account[],
        transactions: [
            { id: 1, accountId: 1, type: 'expense', amount: 120, category: 'Comida', description: 'Tacos de pastor', date: new Date().toISOString() },
            { id: 2, accountId: 1, type: 'income', amount: 15000, category: 'Salario', description: 'Nómina Quincenal', date: new Date(Date.now() - 86400000).toISOString() },
        ] as Transaction[]
    }),

    getters: {
        totalBalance: (state) => {
            // Suma activos (débito + efectivo) y resta pasivos (crédito) si quisieras neto
            // Aquí sumamos liquidez real
            return state.accounts
                .filter(a => a.type !== 'credit')
                .reduce((sum, account) => sum + account.balance, 0);
        }
    },

    actions: {
        addTransaction(tx: Transaction) {
            this.transactions.unshift(tx); // Agregar al inicio

            // Actualizar saldo de la cuenta correspondiente
            const account = this.accounts.find(a => a.id === tx.accountId);
            if (account) {
                if (tx.type === 'income') account.balance += tx.amount;
                else account.balance -= tx.amount;
            }
        }
    }
})