<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Mantén el control de tus ingresos, gastos y suscripciones.</p>
        </div>
        <button @click="showTransactionModal = true" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva Transacción
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjeta Balance -->
        <div class="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-3xl text-white shadow-xl shadow-green-500/20 relative overflow-hidden md:col-span-1">
          <div class="relative z-10">
            <h3 class="font-medium opacity-90 mb-1">Balance Total</h3>
            <p class="text-4xl font-bold font-mono">{{ formatCurrency(financeStore.totalBalance) }}</p>
          </div>
          <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <!-- Tarjeta Cuentas -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm md:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Mis Cuentas</h3>
            <button @click="showAccountModal = true" class="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" title="Añadir Cuenta">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
          <div v-if="financeStore.accounts.length === 0" class="text-sm text-muted-foreground">
             No hay cuentas registradas.
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2">
            <div v-for="account in financeStore.accounts" :key="account.id" class="bg-secondary/50 p-4 rounded-2xl min-w-[200px] border border-border/30 relative group">
              <p class="text-muted-foreground text-sm">{{ account.name }}</p>
              <p class="text-xl font-bold font-mono">{{ formatCurrency(account.balance) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tabla Transacciones -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-border/40 flex justify-between items-center">
            <h3 class="font-bold text-lg">Transacciones Recientes</h3>
          </div>
          <div class="p-4 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground bg-secondary/20">
            <div class="col-span-3">Fecha</div>
            <div class="col-span-6">Descripción</div>
            <div class="col-span-3 text-right">Monto</div>
          </div>
          
          <div v-if="financeStore.transactions.length === 0" class="p-6 text-center text-muted-foreground text-sm">
             No hay transacciones registradas.
          </div>

          <div v-for="tx in financeStore.transactions.slice(0, 8)" :key="tx.id" class="p-4 grid grid-cols-12 gap-4 items-center border-b border-border/40 text-sm hover:bg-secondary/10 transition-colors">
            <div class="col-span-3 text-muted-foreground">{{ formatDate(tx.date) }}</div>
            <div class="col-span-6 font-medium truncate" :title="tx.description">{{ tx.description }}</div>
            <div :class="['col-span-3 text-right font-mono font-bold', tx.type === 'expense' ? 'text-red-500' : 'text-green-500']">
              {{ tx.type === 'expense' ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
            </div>
          </div>
        </div>

        <!-- Suscripciones y Membresías -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-border/40 flex justify-between items-center">
            <h3 class="font-bold text-lg">Membresías y Servicios</h3>
            <button @click="showSubscriptionModal = true" class="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" title="Añadir Servicio">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
          <div class="flex-1 p-6 space-y-4 overflow-y-auto">
            <div v-if="financeStore.subscriptions.length === 0" class="text-center text-muted-foreground text-sm">
               No hay membresías registradas.
            </div>
            
            <div v-for="sub in financeStore.subscriptions" :key="sub.id" class="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl border border-border/20">
              <div>
                <p class="font-bold">{{ sub.name }}</p>
                <div class="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span class="bg-primary/10 text-primary px-2 py-0.5 rounded">{{ sub.type === 'MEMBERSHIP' ? 'Membresía' : 'Servicio' }}</span>
                  <span v-if="sub.accountId">Domiciliado</span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-mono font-bold text-red-400">{{ formatCurrency(sub.amount) }} <span class="text-xs text-muted-foreground font-sans">/ {{ sub.frequency === 'MONTHLY' ? 'mes' : sub.frequency === 'YEARLY' ? 'año' : 'bimestre' }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODALS -->

      <!-- Modal: Nueva Cuenta -->
      <div v-if="showAccountModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showAccountModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">Agregar Cuenta</h2>
          <form @submit.prevent="submitAccount" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre de la cuenta</label>
              <input v-model="accountForm.name" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Ej. Banamex Débito">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="accountForm.type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="card">Tarjeta</option>
                  <option value="cash">Efectivo</option>
                  <option value="savings">Ahorro</option>
                  <option value="loan">Préstamo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Balance Inicial</label>
                <input v-model.number="accountForm.balance" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <!-- Subtipo si es Tarjeta -->
            <div v-if="accountForm.type === 'card'" class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Subtipo</label>
                <select v-model="accountForm.sub_type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="debit">Débito</option>
                  <option value="credit">Crédito</option>
                  <option value="payroll">Nómina</option>
                </select>
              </div>
            </div>

            <!-- Campos para Tarjeta de Crédito -->
            <div v-if="accountForm.type === 'card' && accountForm.sub_type === 'credit'" class="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-xl border border-border/30">
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1">Límite de Crédito</label>
                <input v-model.number="accountForm.credit_limit" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Día de Corte</label>
                <input v-model.number="accountForm.cutoff_day" type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Día de Pago</label>
                <input v-model.number="accountForm.payment_day" type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <!-- Campos para Ahorro o Inversión -->
            <div v-if="accountForm.type === 'savings' || accountForm.type === 'investment'" class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tasa de Interés Anual (%)</label>
                <input v-model.number="accountForm.interest_rate" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <!-- Campos para Préstamo -->
            <div v-if="accountForm.type === 'loan'" class="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-xl border border-border/30">
              <div>
                <label class="block text-sm font-medium mb-1">Pago Fijo</label>
                <input v-model.number="accountForm.monthly_payment" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Tasa Interés (%)</label>
                <input v-model.number="accountForm.interest_rate" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Frecuencia</label>
                <select v-model="accountForm.payment_frequency" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="MONTHLY">Mensual</option>
                  <option value="BIWEEKLY">Quincenal</option>
                  <option value="WEEKLY">Semanal</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Día de Pago</label>
                <input v-model.number="accountForm.payment_day" type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showAccountModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Nueva Suscripción / Servicio -->
      <div v-if="showSubscriptionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showSubscriptionModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">Agregar Servicio o Membresía</h2>
          <form @submit.prevent="submitSubscription" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre</label>
              <input v-model="subForm.name" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Ej. Netflix, Luz, Gimnasio">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="subForm.type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="MEMBERSHIP">Membresía</option>
                  <option value="SERVICE">Servicio</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Frecuencia</label>
                <select v-model="subForm.frequency" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="MONTHLY">Mensual</option>
                  <option value="BIMONTHLY">Bimestral</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Monto Estimado</label>
              <input v-model.number="subForm.amount" required type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Domiciliar a Cuenta (Opcional)</label>
              <select v-model.number="subForm.accountId" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option :value="null">Ninguna (Pago Manual)</option>
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
              </select>
              <p class="text-xs text-muted-foreground mt-1">Si domicilias, deberás registrar manualmente cuándo ocurre el cargo usando una Transacción con la categoría del servicio, o bien lo automatizaremos más adelante.</p>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showSubscriptionModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Nueva Transacción -->
      <div v-if="showTransactionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showTransactionModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">Nueva Transacción</h2>
          <form @submit.prevent="submitTransaction" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="txForm.type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Monto</label>
                <input v-model.number="txForm.amount" required type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Cuenta {{ txForm.type === 'transfer' ? 'Origen' : '' }}</label>
              <select v-model.number="txForm.accountId" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
              </select>
            </div>
            <div v-if="txForm.type === 'transfer'">
              <label class="block text-sm font-medium mb-1">Cuenta Destino</label>
              <select v-model.number="txForm.destinationAccountId" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
              </select>
            </div>
            <div v-if="txForm.type !== 'transfer'">
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <select v-model="txForm.category" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="cat in financeStore.categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Descripción</label>
              <input v-model="txForm.description" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showTransactionModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Registrar</button>
            </div>
          </form>
        </div>
      </div>

    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted, reactive } from 'vue'
import { useFinanceStore } from '~/stores/finance'
import type { AccountType, TransactionType } from '~/stores/finance'

const financeStore = useFinanceStore()

// Modal States
const showAccountModal = ref(false)
const showSubscriptionModal = ref(false)
const showTransactionModal = ref(false)

// Forms
const accountForm = reactive({
  name: '',
  type: 'card' as AccountType,
  sub_type: 'debit',
  balance: 0,
  currency: 'MXN',
  credit_limit: 0,
  interest_rate: 0,
  monthly_payment: 0,
  payment_frequency: 'MONTHLY',
  cutoff_day: 1,
  payment_day: 1
})

const subForm = reactive({
  name: '',
  type: 'MEMBERSHIP',
  frequency: 'MONTHLY',
  amount: 0,
  currency: 'MXN',
  isVariable: false,
  accountId: null as number | null
})

const txForm = reactive({
  type: 'expense' as TransactionType,
  amount: 0,
  accountId: null as number | null,
  destinationAccountId: null as number | null,
  category: 'Ocio',
  description: '',
  date: new Date().toISOString()
})

onMounted(() => {
  financeStore.initialize().then(() => {
    if (financeStore.accounts.length > 0) {
      txForm.accountId = financeStore.accounts[0].id
    }
  })
})

const submitAccount = async () => {
  await financeStore.addAccount({
    name: accountForm.name,
    type: accountForm.type,
    sub_type: accountForm.type === 'card' ? accountForm.sub_type as any : 'n/a',
    balance: accountForm.balance,
    credit_limit: accountForm.credit_limit,
    interest_rate: accountForm.interest_rate,
    monthly_payment: accountForm.monthly_payment,
    payment_frequency: accountForm.payment_frequency as any,
    cutoff_day: accountForm.cutoff_day,
    payment_day: accountForm.payment_day,
    currency: accountForm.currency
  })
  showAccountModal.value = false
  // reset
  accountForm.name = ''
  accountForm.balance = 0
  accountForm.credit_limit = 0
  accountForm.interest_rate = 0
  accountForm.monthly_payment = 0
}

const submitSubscription = async () => {
  await financeStore.addSubscription({
    name: subForm.name,
    type: subForm.type as any,
    frequency: subForm.frequency as any,
    amount: subForm.amount,
    currency: subForm.currency,
    isVariable: subForm.isVariable,
    accountId: subForm.accountId
  })
  showSubscriptionModal.value = false
  subForm.name = ''
  subForm.amount = 0
}

const submitTransaction = async () => {
  if (!txForm.accountId) return

  await financeStore.addTransaction({
    accountId: txForm.accountId,
    type: txForm.type,
    amount: txForm.amount,
    category: txForm.type === 'transfer' ? 'Transferencia' : txForm.category,
    description: txForm.description,
    date: new Date().toISOString(),
    ...(txForm.type === 'transfer' && txForm.destinationAccountId ? { destinationAccountId: txForm.destinationAccountId } : {} )
  } as any)
  
  showTransactionModal.value = false
  txForm.amount = 0
  txForm.description = ''
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
