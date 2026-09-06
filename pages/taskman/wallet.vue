<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Mantén el control de tus ingresos, gastos y suscripciones.</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="showManageCategoriesModal = true" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl font-medium transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3H3v18h18V3zM9 13H5v-2h4v2zm4 0h-4v-2h4v2zm4 0h-4v-2h4v2z"/></svg>
            Categorías
          </button>
          <button @click="showTransactionModal = true" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Nueva Transacción
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-1 border-b border-border/40 pb-px overflow-x-auto">
        <NuxtLink to="/taskman/wallet" class="px-4 py-2 border-b-2 border-primary text-primary font-medium transition-colors whitespace-nowrap">
          Billetera
        </NuxtLink>
        <NuxtLink to="/taskman/budget" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Presupuesto & Proyecciones
        </NuxtLink>
        <NuxtLink to="/taskman/wishlist" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Wishlist
        </NuxtLink>
        <NuxtLink to="/taskman/dashboard" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Dashboard y Salud
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjeta Balance -->
        <div :class="['p-6 rounded-3xl text-white shadow-xl relative overflow-hidden md:col-span-1 transition-all', financeStore.totalBalance < 0 ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-red-500/20' : 'bg-gradient-to-br from-green-500 to-emerald-700 shadow-green-500/20']">
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
          <div v-if="financeStore.loading && financeStore.accounts.length === 0" class="flex gap-4 overflow-x-auto pb-2">
            <Skeleton v-for="i in 3" :key="i" class="h-20 min-w-[200px]" />
          </div>
          <div v-else-if="financeStore.accounts.length === 0" class="text-sm text-muted-foreground">
             No hay cuentas registradas.
          </div>
          <div v-else class="flex gap-4 overflow-x-auto pb-2">
            <div v-for="account in financeStore.accounts" :key="account.id" @click="openHistory(account)" class="bg-secondary/50 p-4 rounded-2xl min-w-[200px] border border-border/30 relative group flex flex-col justify-between cursor-pointer hover:bg-secondary/70 transition-colors">
              <div>
                <p class="text-muted-foreground text-sm">{{ account.name }}</p>
                <p class="text-xl font-bold font-mono">{{ formatCurrency(account.balance) }}</p>
                <p class="text-[10px] text-muted-foreground/70 mt-1 group-hover:text-primary transition-colors">Ver movimientos →</p>
              </div>
              <div class="absolute top-2 right-2 flex gap-1 md:opacity-0 opacity-100 md:group-hover:opacity-100 transition-opacity">
                <button @click.stop="openEditAccount(account)" class="text-muted-foreground hover:text-primary p-1 bg-background/50 rounded-md" title="Editar Cuenta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button @click.stop="deleteAccountWithConfirm(account.id)" class="text-muted-foreground hover:text-destructive p-1 bg-background/50 rounded-md" title="Eliminar Cuenta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
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
          <div class="hidden md:grid p-4 grid-cols-12 gap-4 text-sm font-medium text-muted-foreground bg-secondary/20">
            <div class="col-span-3">Fecha</div>
            <div class="col-span-6">Descripción</div>
            <div class="col-span-3 text-right">Monto</div>
          </div>
          
          <div v-if="financeStore.transactions.length === 0" class="p-6 text-center text-muted-foreground text-sm">
             No hay transacciones registradas.
          </div>

          <div v-for="tx in financeStore.transactions.slice(0, 8)" :key="tx.id" class="p-4 flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center border-b border-border/40 text-sm hover:bg-secondary/10 transition-colors group">
            <div class="md:col-span-3 text-muted-foreground flex justify-between w-full md:block">
              <span>{{ formatDate(tx.date) }}</span>
              <span class="md:hidden font-mono font-bold" :class="isNegative(tx) ? 'text-red-500' : 'text-green-500'">
                {{ isNegative(tx) ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
              </span>
            </div>
            <div class="md:col-span-6 font-medium truncate w-full" :title="tx.description">{{ tx.description }}</div>
            <div class="md:col-span-3 w-full text-right font-mono font-bold flex items-center justify-end gap-3 mt-2 md:mt-0">
              <span class="hidden md:inline" :class="isNegative(tx) ? 'text-red-500' : 'text-green-500'">
                {{ isNegative(tx) ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
              </span>
              <button v-if="tx.type === 'expense' || tx.type === 'income' || tx.type === 'investment'" @click="openEditTransaction(tx)" class="text-muted-foreground hover:text-primary md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 md:p-0 bg-secondary/50 md:bg-transparent rounded-md md:rounded-none" title="Editar transacción">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              <button @click="handleDeleteTransaction(tx)" class="text-muted-foreground hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 md:p-0 bg-secondary/50 md:bg-transparent rounded-md md:rounded-none" title="Eliminar transacción">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Suscripciones, Membresías e Ingresos recurrentes -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-border/40 flex justify-between items-center">
            <h3 class="font-bold text-lg">Ingresos y Servicios Recurrentes</h3>
            <button @click="showSubscriptionModal = true" class="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" title="Añadir">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
          <div class="flex-1 p-6 space-y-4 overflow-y-auto">
            <div v-if="financeStore.subscriptions.length === 0" class="text-center text-muted-foreground text-sm">
               No hay servicios ni ingresos registrados.
            </div>

            <div v-for="sub in financeStore.subscriptions" :key="sub.id" class="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl border border-border/20 relative group">
              <div>
                <p class="font-bold">{{ sub.name }}</p>
                <div class="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span
                    class="px-2 py-0.5 rounded"
                    :class="sub.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-primary/10 text-primary'"
                  >{{ sub.type === 'MEMBERSHIP' ? 'Membresía' : sub.type === 'INCOME' ? 'Ingreso' : 'Servicio' }}</span>
                  <span v-if="sub.accountId">{{ sub.type === 'INCOME' ? 'Depósito a cuenta' : 'Domiciliado' }}</span>
                </div>
              </div>
              <div class="text-right group-hover:opacity-0 md:opacity-100 transition-opacity">
                <p class="font-mono font-bold" :class="sub.type === 'INCOME' ? 'text-emerald-500' : 'text-red-400'">
                  {{ sub.type === 'INCOME' ? '+' : '' }}{{ formatCurrency(sub.amount) }}
                  <span class="text-xs text-muted-foreground font-sans">/ {{ sub.frequency === 'MONTHLY' ? 'mes' : sub.frequency === 'YEARLY' ? 'año' : sub.frequency === 'WEEKLY' ? 'sem' : 'bimestre' }}</span>
                </p>
              </div>
              <div class="absolute top-0 right-0 h-full flex items-center pr-4 gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button @click="openEditSubscription(sub)" class="bg-secondary text-primary p-2 rounded-full hover:bg-primary/20" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button @click="deleteSubscriptionWithConfirm(sub.id)" class="bg-secondary text-destructive p-2 rounded-full hover:bg-destructive/20" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos Pagos -->
      <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm mb-8 mt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            Próximos Pagos (30 Días)
          </h3>
        </div>
        
        <div v-if="financeStore.upcomingPayments.length === 0" class="text-sm text-muted-foreground">
          No hay pagos próximos registrados.
        </div>
        <div v-else class="space-y-4">
          <div class="flex flex-col md:flex-row justify-between text-sm mb-2 p-3 rounded-xl border border-border/40" :class="totalUpcoming > financeStore.totalBalance ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-green-500/10 text-green-700 border-green-500/20'">
            <span class="font-medium">Total a Pagar Próximamente: {{ formatCurrency(totalUpcoming) }}</span>
            <span class="font-medium" v-if="totalUpcoming > financeStore.totalBalance">⚠️ Liquidez Insuficiente en Balance Total</span>
            <span class="font-medium" v-else>✅ Presupuesto Suficiente en Balance Total</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(payment, idx) in financeStore.upcomingPayments" :key="idx" class="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl border border-border/20">
              <div>
                <p class="font-bold">{{ payment.name }}</p>
                <div class="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span class="bg-primary/10 text-primary px-2 py-0.5 rounded">{{ payment.type }}</span>
                  <span :class="payment.daysRemaining <= 3 ? 'text-red-500 font-bold' : ''">
                    {{ payment.daysRemaining === 0 ? 'Hoy' : payment.daysRemaining === 1 ? 'Mañana' : `En ${payment.daysRemaining} días` }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-mono font-bold text-red-500">{{ formatCurrency(payment.amount) }}</p>
                <p class="text-xs text-muted-foreground">{{ new Date(payment.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) }}</p>
                <button @click="markAsPaid(payment)" class="mt-2 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded font-medium transition-colors">Registrar Pago</button>
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
                <label class="block text-sm font-medium mb-1">
                  Día de Corte {{ accountForm.payment_frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="accountForm.cutoff_day" type="number" min="1" :max="accountForm.payment_frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">
                  Día de Pago {{ accountForm.payment_frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="accountForm.payment_day" type="number" min="1" :max="accountForm.payment_frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
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
                  <option value="ONCE">Un solo pago (Dinero rápido)</option>
                </select>
              </div>
              <div v-if="accountForm.payment_frequency !== 'ONCE'">
                <label class="block text-sm font-medium mb-1">
                  Día de Pago {{ accountForm.payment_frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="accountForm.payment_day" type="number" min="1" :max="accountForm.payment_frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showAccountModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Editar Cuenta -->
      <div v-if="showEditAccountModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showEditAccountModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">Editar Cuenta</h2>
          <form @submit.prevent="submitEditAccount" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre de la cuenta</label>
              <input v-model="editAccountForm.name" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Ej. Banamex Débito">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="editAccountForm.type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="card">Tarjeta</option>
                  <option value="cash">Efectivo</option>
                  <option value="savings">Ahorro</option>
                  <option value="loan">Préstamo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Balance</label>
                <input v-model.number="editAccountForm.balance" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <!-- Subtipo si es Tarjeta -->
            <div v-if="editAccountForm.type === 'card'" class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Subtipo</label>
                <select v-model="editAccountForm.sub_type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="debit">Débito</option>
                  <option value="credit">Crédito</option>
                  <option value="payroll">Nómina</option>
                </select>
              </div>
            </div>

            <!-- Campos para Tarjeta de Crédito -->
            <div v-if="editAccountForm.type === 'card' && editAccountForm.sub_type === 'credit'" class="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-xl border border-border/30">
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1">Límite de Crédito</label>
                <input v-model.number="editAccountForm.credit_limit" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">
                  Día de Corte {{ editAccountForm.payment_frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="editAccountForm.cutoff_day" type="number" min="1" :max="editAccountForm.payment_frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">
                  Día de Pago {{ editAccountForm.payment_frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="editAccountForm.payment_day" type="number" min="1" :max="editAccountForm.payment_frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <!-- Campos para Ahorro o Inversión -->
            <div v-if="editAccountForm.type === 'savings' || editAccountForm.type === 'investment'" class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tasa de Interés Anual (%)</label>
                <input v-model.number="editAccountForm.interest_rate" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <!-- Campos para Préstamo -->
            <div v-if="editAccountForm.type === 'loan'" class="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-xl border border-border/30">
              <div>
                <label class="block text-sm font-medium mb-1">Pago Fijo</label>
                <input v-model.number="editAccountForm.monthly_payment" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Tasa Interés (%)</label>
                <input v-model.number="editAccountForm.interest_rate" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Frecuencia</label>
                <select v-model="editAccountForm.payment_frequency" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="MONTHLY">Mensual</option>
                  <option value="BIWEEKLY">Quincenal</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="ONCE">Un solo pago (Dinero rápido)</option>
                </select>
              </div>
              <div v-if="editAccountForm.payment_frequency !== 'ONCE'">
                <label class="block text-sm font-medium mb-1">
                  Día de Pago {{ editAccountForm.payment_frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="editAccountForm.payment_day" type="number" min="1" :max="editAccountForm.payment_frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showEditAccountModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar Cambios</button>
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
                  <option value="INCOME">Ingreso / Nómina</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Frecuencia</label>
                <select v-model="subForm.frequency" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="WEEKLY">Semanal</option>
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
            <div v-if="subForm.frequency === 'WEEKLY' || subForm.frequency === 'MONTHLY'">
              <label class="block text-sm font-medium mb-1">
                Día de Pago {{ subForm.frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
              </label>
              <input v-model.number="subForm.paymentDay" type="number" min="1" :max="subForm.frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">{{ subForm.type === 'INCOME' ? 'Depósito a Cuenta (Opcional)' : 'Domiciliar a Cuenta (Opcional)' }}</label>
              <select v-model.number="subForm.accountId" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option :value="null">{{ subForm.type === 'INCOME' ? 'Ninguna (Registro Manual)' : 'Ninguna (Pago Manual)' }}</option>
                <option v-for="acc in financeStore.accounts.filter(a => a.type === 'cash' || a.type === 'card')" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
              </select>
              <p class="text-xs text-muted-foreground mt-1">
                {{ subForm.type === 'INCOME'
                  ? 'Cuenta donde recibes el depósito (p.ej. tarjeta de nómina). Aun así deberás registrar cada ingreso como Transacción.'
                  : 'Si domicilias, deberás registrar manualmente cuándo ocurre el cargo usando una Transacción con la categoría del servicio.' }}
              </p>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showSubscriptionModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Nueva / Editar Transacción -->
      <div v-if="showTransactionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="closeTransactionModal">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">{{ editingTransactionId ? 'Editar Transacción' : 'Registrar Transacción' }}</h2>
          <form @submit.prevent="submitTransaction" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="txForm.type" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                  <option value="transfer">Transferencia</option>
                  <option value="credit_payment">Pago de Tarjeta de Crédito</option>
                  <option value="loan_payment">Pago de Préstamo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Monto</label>
                <input v-model.number="txForm.amount" required type="number" step="0.01" min="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Cuenta {{ ['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type) ? 'Origen' : '' }}</label>
              <select v-model.number="txForm.accountId" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="acc in filteredSourceAccounts" :key="acc.id" :value="acc.id">{{ acc.name }} — {{ formatCurrency(Number(acc.balance)) }}</option>
              </select>
              <p v-if="selectedSourceAccount" class="text-xs mt-1 font-mono" :class="Number(selectedSourceAccount.balance) < 0 ? 'text-red-500' : 'text-muted-foreground'">
                Saldo disponible: <span class="font-bold">{{ formatCurrency(Number(selectedSourceAccount.balance)) }}</span>
                <span v-if="txForm.amount > 0 && !['credit_payment', 'loan_payment'].includes(txForm.type)"> → después: {{ formatCurrency(Number(selectedSourceAccount.balance) + (txForm.type === 'income' ? txForm.amount : -txForm.amount)) }}</span>
              </p>
            </div>
            <div v-if="['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type)">
              <label class="block text-sm font-medium mb-1">{{ txForm.type === 'transfer' ? 'Cuenta Destino' : 'Cuenta a Pagar' }}</label>
              <select v-model.number="txForm.destinationAccountId" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="acc in filteredDestinationAccounts" :key="acc.id" :value="acc.id">{{ acc.name }} — {{ formatCurrency(Number(acc.balance)) }}</option>
              </select>
            </div>
            <div v-if="!['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type)">
              <div class="flex justify-between items-center mb-1">
                <label class="text-sm font-medium">Categoría</label>
                <div class="flex gap-2">
                  <button type="button" @click="showAddCategory = !showAddCategory" class="text-xs text-primary hover:underline">
                    {{ showAddCategory ? 'Cancelar' : '+ Nueva' }}
                  </button>
                  <button type="button" @click="showManageCategoriesModal = true" class="text-xs text-muted-foreground hover:underline">
                    Gestionar
                  </button>
                </div>
              </div>
              
              <!-- Selector normal -->
              <select v-if="!showAddCategory" v-model="txForm.category" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="cat in financeStore.categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>

              <!-- Entrada para nueva categoría -->
              <div v-else class="flex gap-2">
                <input v-model="newCategory" type="text" placeholder="Ej. Regalos, Salud" class="flex-1 bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" @keyup.enter.prevent="addNewCategory">
                <button type="button" @click="addNewCategory" class="bg-primary text-primary-foreground px-4 rounded-xl font-medium hover:opacity-90 transition-opacity">
                  Agregar
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Descripción</label>
              <input v-model="txForm.description" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="closeTransactionModal" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" :disabled="isSubmittingTx" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmittingTx ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Historial completo por cuenta -->
      <div v-if="historyAccount" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="historyAccount = null">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold">{{ historyAccount.name }}</h2>
              <p class="text-sm text-muted-foreground">
                Saldo actual:
                <span class="font-mono font-bold" :class="Number(historyAccount.balance) < 0 ? 'text-red-500' : 'text-emerald-500'">{{ formatCurrency(Number(historyAccount.balance)) }}</span>
                · {{ accountHistory.length }} movimientos
              </p>
            </div>
            <button @click="historyAccount = null" class="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors" title="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div v-if="accountHistory.length === 0" class="flex-1 flex items-center justify-center text-muted-foreground py-8">
            No hay movimientos en esta cuenta.
          </div>
          <div v-else class="flex-1 overflow-y-auto -mx-6 px-6 space-y-2">
            <div v-for="tx in accountHistory" :key="tx.id" class="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ tx.description || tx.category || 'Sin descripción' }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(tx.date) }} · <span class="capitalize">{{ txTypeLabel(tx.type) }}</span>
                </p>
              </div>
              <span class="font-mono font-bold whitespace-nowrap" :class="isNegative(tx) ? 'text-red-500' : 'text-emerald-500'">
                {{ isNegative(tx) ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Gestionar Categorías -->
      <div v-if="showManageCategoriesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showManageCategoriesModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-4">Gestionar Categorías</h2>
          
          <div class="flex gap-2 mb-4">
            <input v-model="newCategoryName" type="text" placeholder="Nueva categoría..." class="flex-1 bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" @keyup.enter="handleAddCategoryBtn">
            <button @click="handleAddCategoryBtn" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
              Añadir
            </button>
          </div>

          <div class="space-y-2 max-h-64 overflow-y-auto pr-2">
            <div v-for="cat in financeStore.categories" :key="cat" class="flex justify-between items-center p-3 bg-secondary/30 rounded-xl border border-border/20">
              <input v-if="editingCategory === cat" v-model="editingCategoryValue" @keyup.enter="saveEditCategory(cat)" @blur="saveEditCategory(cat)" class="flex-1 bg-background border border-border rounded px-2 py-1 mr-2 focus:outline-none" autofocus />
              <span v-else class="font-medium flex-1 cursor-pointer" @click="startEditCategory(cat)">{{ cat }}</span>
              <div class="flex gap-1">
                <button v-if="editingCategory === cat" @click="saveEditCategory(cat)" class="text-green-500 hover:bg-green-500/10 p-1.5 rounded-md transition-colors" title="Guardar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </button>
                <button v-else @click="startEditCategory(cat)" class="text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors" title="Editar Categoría">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button @click="deleteCategoryWithConfirm(cat)" class="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors" title="Eliminar Categoría">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <div v-if="financeStore.categories.length === 0" class="text-sm text-muted-foreground text-center py-4">No hay categorías.</div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="showManageCategoriesModal = false" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Cerrar</button>
          </div>
        </div>
      </div>

    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFinanceStore } from '~/stores/finance'
import type { Account, AccountType, TransactionType } from '~/stores/finance'

const financeStore = useFinanceStore()

// Modal States
const showAccountModal = ref(false)
const showEditAccountModal = ref(false)
const showSubscriptionModal = ref(false)
const showTransactionModal = ref(false)
const editingTransactionId = ref<number | null>(null)
const showManageCategoriesModal = ref(false)

// Historial por cuenta — pide al backend todos los mov de esa cuenta (no solo los 50
// más recientes que trae el fetch global). Fallback al store si la llamada falla.
const historyAccount = ref<Account | null>(null)
const accountHistory = ref<any[]>([])
async function openHistory(acc: Account) {
  historyAccount.value = acc
  accountHistory.value = financeStore.transactions
    .filter(tx => tx.accountId === acc.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  try {
    const api = (await import('~/utils/api')).default
    const res = await api.get(`/finance/transactions?accountId=${acc.id}&t=${Date.now()}`)
    if (res.data?.success) {
      accountHistory.value = (res.data.data as any[])
        .map(tx => ({ ...tx, amount: Number(tx.amount) }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  } catch {
    // ponytail: si falla el fetch, deja el fallback del store visible.
  }
}

watch(() => financeStore.transactions, () => {
  if (historyAccount.value) {
    // Refresh local list silently
    openHistory(historyAccount.value)
  }
}, { deep: true })
function txTypeLabel(t: TransactionType): string {
  const map: Record<TransactionType, string> = {
    income: 'Ingreso', expense: 'Gasto', investment: 'Inversión',
    credit_payment: 'Pago Tarjeta', loan_payment: 'Pago Préstamo',
    transfer: 'Transferencia', withdrawal: 'Retiro',
  }
  return map[t] || t
}

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

const editingAccountId = ref<number | null>(null)
const editAccountForm = reactive({
  name: '',
  type: 'card' as AccountType,
  sub_type: 'debit',
  balance: 0,
  currency: 'MXN',
  credit_limit: 0,
  interest_rate: 0,
  monthly_payment: 0,
  payment_frequency: 'MONTHLY' as any,
  cutoff_day: 1,
  payment_day: 1
})

const subForm = reactive({
  id: null as number | null,
  name: '',
  type: 'MEMBERSHIP',
  frequency: 'MONTHLY',
  amount: 0,
  currency: 'MXN',
  isVariable: false,
  accountId: null as number | null,
  paymentDay: 1 as number | null
})

const txForm = reactive({
  type: 'expense' as TransactionType,
  amount: 0,
  accountId: null as number | null,
  destinationAccountId: null as number | null,
  category: 'Ocio',
  description: '',
  date: new Date().toISOString(),
  subscriptionId: null as number | null
})

const showAddCategory = ref(false)
const newCategory = ref('')

const newCategoryName = ref('')
const editingCategory = ref<string | null>(null)
const editingCategoryValue = ref('')

const handleAddCategoryBtn = () => {
  const cleanCat = newCategoryName.value.trim()
  if (cleanCat && !financeStore.categories.includes(cleanCat)) {
    financeStore.addCategory(cleanCat)
    newCategoryName.value = ''
  }
}

const startEditCategory = (cat: string) => {
  editingCategory.value = cat
  editingCategoryValue.value = cat
}

const route = useRoute()

const totalUpcoming = computed(() => {
  return financeStore.upcomingPayments.reduce((sum, p) => sum + p.amount, 0)
})

onMounted(async () => {
  await financeStore.initialize()
  if (route.query.action === 'new_transaction') {
    showTransactionModal.value = true
  }
  if (financeStore.accounts.length > 0) {
    txForm.accountId = financeStore.accounts[0].id
  }
})

const saveEditCategory = async (oldCat: string) => {
  const newCat = editingCategoryValue.value.trim()
  if (newCat && newCat !== oldCat && !financeStore.categories.includes(newCat)) {
    await financeStore.updateCategory(oldCat, newCat)
  }
  editingCategory.value = null
}

const addNewCategory = () => {
  const cleanCat = newCategory.value.trim()
  if (cleanCat) {
    financeStore.addCategory(cleanCat)
    txForm.category = cleanCat
    newCategory.value = ''
    showAddCategory.value = false
  }
}

const deleteCategoryWithConfirm = async (cat: string) => {
  const confirmStore = useConfirmStore()
  if (await confirmStore.ask({
    title: 'Eliminar categoría',
    message: `¿Estás seguro de eliminar la categoría "${cat}"?`,
    confirmLabel: 'Eliminar',
    destructive: true
  })) {
    await financeStore.removeCategory(cat)
  }
}


const submitAccount = async () => {
  let initialBalance = accountForm.balance;
  // Auto-convert positive balances to negative for debts
  if ((accountForm.type === 'loan' || (accountForm.type === 'card' && accountForm.sub_type === 'credit')) && initialBalance > 0) {
    initialBalance = -initialBalance;
  }

  await financeStore.addAccount({
    name: accountForm.name,
    type: accountForm.type,
    sub_type: accountForm.type === 'card' ? accountForm.sub_type as any : 'n/a',
    balance: initialBalance,
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

const openEditAccount = (account: any) => {
  editingAccountId.value = account.id
  editAccountForm.id = account.id
  editAccountForm.name = account.name
  editAccountForm.type = account.type
  editAccountForm.sub_type = account.sub_type
  editAccountForm.balance = account.balance
  editAccountForm.currency = account.currency || 'MXN'
  editAccountForm.credit_limit = account.credit_limit || 0
  editAccountForm.interest_rate = account.interest_rate || 0
  editAccountForm.monthly_payment = account.monthly_payment || 0
  editAccountForm.payment_frequency = account.payment_frequency || 'MONTHLY'
  editAccountForm.cutoff_day = account.cutoff_day || 1
  editAccountForm.payment_day = account.payment_day || 1
  showEditAccountModal.value = true
}

const submitEditAccount = async () => {
  if (editAccountForm.id === null) return

  // ponytail: sin auto-convert. En edit el signo es intencional (balance > 0 en tarjeta = saldo a favor).
  await financeStore.updateAccount(editAccountForm.id, {
    name: editAccountForm.name,
    type: editAccountForm.type,
    sub_type: editAccountForm.type === 'card' ? editAccountForm.sub_type as any : 'n/a',
    balance: editAccountForm.balance,
    credit_limit: editAccountForm.credit_limit,
    interest_rate: editAccountForm.interest_rate,
    monthly_payment: editAccountForm.monthly_payment,
    payment_frequency: editAccountForm.payment_frequency as any,
    cutoff_day: editAccountForm.cutoff_day,
    payment_day: editAccountForm.payment_day,
    currency: editAccountForm.currency
  })
  showEditAccountModal.value = false
  editingAccountId.value = null
}

const deleteAccountWithConfirm = async (id: number) => {
  const confirmStore = useConfirmStore()
  if (await confirmStore.ask({
    title: 'Eliminar cuenta',
    message: 'Se eliminarán también las transacciones asociadas.',
    confirmLabel: 'Eliminar',
    destructive: true
  })) {
    await financeStore.deleteAccount(id)
  }
}

const openEditSubscription = (sub: any) => {
  subForm.id = sub.id
  subForm.name = sub.name
  subForm.type = sub.type
  subForm.frequency = sub.frequency
  subForm.amount = sub.amount
  subForm.currency = sub.currency || 'MXN'
  subForm.isVariable = sub.isVariable
  subForm.accountId = sub.accountId
  subForm.paymentDay = sub.paymentDay || 1
  showSubscriptionModal.value = true
}

const deleteSubscriptionWithConfirm = async (id: number) => {
  const confirmStore = useConfirmStore()
  if (await confirmStore.ask({
    title: 'Eliminar suscripción',
    message: '¿Estás seguro de que deseas eliminar esta suscripción o membresía?',
    confirmLabel: 'Eliminar',
    destructive: true
  })) {
    await financeStore.deleteSubscription(id)
  }
}

const submitSubscription = async () => {
  const data = {
    name: subForm.name,
    type: subForm.type as any,
    frequency: subForm.frequency as any,
    amount: subForm.amount,
    currency: subForm.currency,
    isVariable: subForm.isVariable,
    accountId: subForm.accountId,
    paymentDay: subForm.paymentDay
  }
  if (subForm.id) {
    await financeStore.updateSubscription(subForm.id, data)
  } else {
    await financeStore.addSubscription(data)
  }
  showSubscriptionModal.value = false
  subForm.id = null
  subForm.name = ''
  subForm.amount = 0
  subForm.paymentDay = 1
}

const isSubmittingTx = ref(false)
const submitTransaction = async () => {
  if (!txForm.accountId || isSubmittingTx.value) return
  
  isSubmittingTx.value = true

  const isTransferOrPayment = ['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type);
  const category = txForm.type === 'transfer' ? 'Transferencia' : (txForm.type === 'credit_payment' ? 'Pago de Tarjeta' : (txForm.type === 'loan_payment' ? 'Pago de Préstamo' : txForm.category));

  try {
    if (editingTransactionId.value) {
      await financeStore.updateTransaction(editingTransactionId.value, {
        accountId: txForm.accountId,
        amount: txForm.amount,
        category: category,
        type: txForm.type,
        description: txForm.description,
        date: txForm.date || new Date().toISOString()
      } as any)
    } else {
      await financeStore.addTransaction({
        accountId: txForm.accountId,
        type: txForm.type,
        amount: txForm.amount,
        category: category,
        description: txForm.description,
        date: txForm.date || new Date().toISOString(),
        ...(isTransferOrPayment && txForm.destinationAccountId ? { destinationAccountId: txForm.destinationAccountId } : {} ),
        ...(txForm.subscriptionId ? { subscriptionId: txForm.subscriptionId } : {})
      } as any)
    }
  } finally {
    isSubmittingTx.value = false
    closeTransactionModal()
  }
}

const openEditTransaction = (tx: any) => {
  editingTransactionId.value = tx.id
  txForm.accountId = tx.accountId
  txForm.amount = tx.amount
  txForm.category = tx.category
  txForm.type = tx.type
  txForm.description = tx.description
  // ponytail: ISO completo, no YYYY-MM-DD; updateTransactionSchema.date rechazaba date-only
  txForm.date = tx.date ? new Date(tx.date).toISOString() : new Date().toISOString()
  showTransactionModal.value = true
}

const closeTransactionModal = () => {
  showTransactionModal.value = false
  editingTransactionId.value = null
  // ponytail: reset completo — dejar type/accountId/destinationAccountId/category del edit anterior filtraba a la próxima "Nueva Transacción"
  txForm.type = 'expense'
  txForm.amount = 0
  txForm.accountId = financeStore.accounts[0]?.id ?? null
  txForm.destinationAccountId = null
  txForm.category = 'Ocio'
  txForm.description = ''
  txForm.date = new Date().toISOString()
  txForm.subscriptionId = null
}

const markAsPaid = (payment: any) => {
  txForm.amount = payment.amount
  txForm.description = payment.name
  txForm.category = payment.category || 'Servicios'
  txForm.date = new Date().toISOString()
  
  if (payment.sourceType === 'account') {
    txForm.type = payment.type === 'Préstamo' ? 'loan_payment' : 'credit_payment'
    txForm.destinationAccountId = payment.accountId
    // ponytail: fuente debe ser cuenta con dinero real (débito, nómina, ahorro o cash). Sin fallback a accounts[0]
    const source = financeStore.accounts.find(a => a.type !== 'loan' && !(a.type === 'card' && a.sub_type === 'credit'))
    if (!source) {
      alert('Necesitas una cuenta de efectivo, débito, nómina o ahorro para registrar el pago.')
      return
    }
    txForm.accountId = source.id
  } else {
    txForm.type = 'expense'
    if (payment.accountId) {
      txForm.accountId = payment.accountId
    } else {
      txForm.accountId = financeStore.accounts[0]?.id
    }
    txForm.subscriptionId = payment.sourceId
  }
  
  showTransactionModal.value = true
}

const handleDeleteTransaction = async (tx: any) => {
  const confirmStore = useConfirmStore()
  if (await confirmStore.ask({
    title: 'Eliminar transacción',
    message: `Monto: ${formatCurrency(tx.amount)}. Si es transferencia, elimina también la transacción correspondiente en la otra cuenta.`,
    confirmLabel: 'Eliminar',
    destructive: true
  })) {
    await financeStore.deleteTransaction(tx.id)
  }
}

const filteredDestinationAccounts = computed(() => {
  return financeStore.accounts.filter(acc => {
    // No permitir transferencia a la misma cuenta de origen
    if (acc.id === txForm.accountId) return false;

    if (txForm.type === 'credit_payment') {
      return acc.type === 'card' && acc.sub_type === 'credit';
    }
    if (txForm.type === 'loan_payment') {
      return acc.type === 'loan';
    }
    // Para 'transfer', mostrar todas las demás
    return true;
  })
})

const selectedSourceAccount = computed(() =>
  financeStore.accounts.find(a => a.id === txForm.accountId) || null
)

// Fuente de fondos: en pagos de tarjeta/préstamo debe ser cuenta líquida (débito o efectivo),
// nunca otra tarjeta de crédito o el mismo préstamo.
const filteredSourceAccounts = computed(() => {
  if (['credit_payment', 'loan_payment'].includes(txForm.type)) {
    // Permitir cualquier cuenta (efectivo, débito, nómina, ahorro) excepto otra tarjeta de crédito o un préstamo
    return financeStore.accounts.filter(acc => acc.type !== 'loan' && !(acc.type === 'card' && acc.sub_type === 'credit'))
  }
  if (txForm.type === 'transfer') {
    return financeStore.accounts.filter(acc => acc.id !== txForm.destinationAccountId)
  }
  return financeStore.accounts
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}

const isNegative = (tx: any) => {
  if (['expense', 'investment'].includes(tx.type)) return true;
  if (['transfer', 'credit_payment', 'loan_payment'].includes(tx.type)) {
    // Si es un ingreso por transferencia/pago (generado por el backend con este texto exacto)
    if (tx.description && (tx.description.startsWith('Pago recibido') || tx.description.startsWith('Transferencia recibida'))) return false;
    // Cualquier otra transferencia, pago de tarjeta o retiro
    return true;
  }
  return false;
}
</script>
