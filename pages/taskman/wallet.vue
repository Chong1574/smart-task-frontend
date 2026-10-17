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
      <FinanceNavigation />

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
          <div v-else class="flex gap-4 overflow-x-auto pb-3 pt-1">
            <div 
              v-for="account in financeStore.accounts" 
              :key="account.id" 
              @click="openHistory(account)" 
              class="bg-secondary/40 hover:bg-secondary/60 border border-border/40 hover:border-border/80 p-4 rounded-2xl min-w-[270px] sm:min-w-[290px] relative group flex flex-col justify-between cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <div>
                <!-- Header con Icono, Tipo y Acciones -->
                <div class="flex items-start justify-between gap-2 mb-2.5">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="p-2 rounded-xl bg-background/80 text-foreground shrink-0 border border-border/30">
                      <component :is="getAccountIcon(account)" class="w-4 h-4 text-primary" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-sm truncate" :title="account.name">{{ account.name }}</p>
                      <span class="inline-block text-[10px] px-2 py-0.5 border rounded-full font-medium mt-0.5" :class="getAccountBadge(account).class">
                        {{ getAccountBadge(account).label }}
                      </span>
                    </div>
                  </div>

                  <!-- Botones de Acción -->
                  <div class="flex items-center gap-1 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                    <button @click.stop="openEditAccount(account)" class="text-muted-foreground hover:text-primary p-1.5 bg-background/80 hover:bg-background rounded-lg transition-colors border border-border/30" title="Editar Cuenta">
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button @click.stop="deleteAccountWithConfirm(account.id)" class="text-muted-foreground hover:text-destructive p-1.5 bg-background/80 hover:bg-background rounded-lg transition-colors border border-border/30" title="Eliminar Cuenta">
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Balance -->
                <div class="mt-2">
                  <p class="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                    {{ account.type === 'card' && account.sub_type === 'credit' ? 'Deuda Actual' : 'Saldo Disponible' }}
                  </p>
                  <p class="text-xl font-bold font-mono text-foreground">
                    {{ formatCurrency(account.balance) }}
                  </p>
                </div>

                <!-- Barra de Utilización de Crédito para TDC -->
                <div v-if="account.type === 'card' && account.sub_type === 'credit' && getCreditUtilization(account)" class="mt-3 p-2.5 rounded-xl bg-background/60 border border-border/30 space-y-1.5">
                  <div class="flex justify-between items-center text-[11px]">
                    <span class="text-muted-foreground">Uso de línea</span>
                    <span class="font-mono font-medium" :class="getCreditUtilization(account)?.textClass">
                      {{ getCreditUtilization(account)?.percentage }}% ({{ getCreditUtilization(account)?.label }})
                    </span>
                  </div>
                  <!-- Progress bar -->
                  <div class="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500" 
                      :class="getCreditUtilization(account)?.bgClass"
                      :style="{ width: `${getCreditUtilization(account)?.percentage}%` }"
                    ></div>
                  </div>
                  <div class="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                    <span>Disp: {{ formatCurrency(getCreditUtilization(account)?.available || 0) }}</span>
                    <span>Lím: {{ formatCurrency(getCreditUtilization(account)?.limit || 0) }}</span>
                  </div>
                </div>

                <!-- Badges de Corte y Pago -->
                <div v-if="account.type === 'card' && account.sub_type === 'credit'" class="mt-2.5 flex flex-wrap gap-1.5">
                  <span v-if="getCutoffBadge(account)" class="text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1" :class="getCutoffBadge(account)?.class">
                    <Clock class="w-2.5 h-2.5" />
                    {{ getCutoffBadge(account)?.label }}
                  </span>
                  <span v-if="getPaymentDueBadge(account)" class="text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1" :class="getPaymentDueBadge(account)?.class">
                    <Calendar class="w-2.5 h-2.5" />
                    {{ getPaymentDueBadge(account)?.label }}
                  </span>
                </div>

                <!-- Estado de Cuenta / Pagos recomendados -->
                <div v-if="account.statement" class="mt-3 p-2.5 rounded-xl bg-background/50 border border-border/30 space-y-1 relative group/statement">
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] text-muted-foreground">No generar intereses:</p>
                    <span class="text-foreground font-mono text-[11px] font-bold">{{ formatCurrency(account.statement.noInterestPayment) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] text-muted-foreground">Pago mínimo:</p>
                    <span class="text-foreground font-mono text-[11px] font-medium">{{ formatCurrency(account.statement.minimumPayment) }}</span>
                  </div>
                  <button @click.stop="openCalibrateModal(account)" class="mt-1 w-full bg-secondary/80 text-primary hover:bg-primary/10 py-1 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-colors">
                    <Pencil class="w-2.5 h-2.5" />
                    Corregir Estado de Cuenta
                  </button>
                </div>
              </div>

              <!-- Footer link -->
              <div class="pt-3 mt-3 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                <span>Ver movimientos</span>
                <ChevronRight class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tabla Transacciones -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div class="p-5 border-b border-border/40 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-lg">Transacciones</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-secondary font-mono text-muted-foreground">
                  {{ filteredTransactions.length }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <select v-model="selectedMonth" class="bg-secondary text-xs sm:text-sm border border-border/40 rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-primary/50 cursor-pointer outline-none">
                  <option value="all">Todo el Historial</option>
                  <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                    {{ month.label.charAt(0).toUpperCase() + month.label.slice(1) }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Buscador rápido en tiempo real -->
            <div class="relative">
              <Search class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar por descripción, categoría o monto..." 
                class="w-full bg-secondary/40 border border-border/40 rounded-xl pl-9 pr-8 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div class="overflow-y-auto flex-1 divide-y divide-border/30">
            <div v-if="filteredTransactions.length === 0" class="p-8 text-center text-muted-foreground text-sm space-y-2">
              <p>No se encontraron transacciones con los filtros seleccionados.</p>
              <button v-if="searchQuery" @click="searchQuery = ''" class="text-primary text-xs hover:underline">
                Limpiar búsqueda
              </button>
            </div>

            <div 
              v-for="tx in filteredTransactions" 
              :key="tx.id" 
              class="p-4 flex items-center justify-between gap-3 text-sm hover:bg-secondary/20 transition-colors group"
            >
              <!-- Icono y Detalle -->
              <div class="flex items-center gap-3.5 min-w-0 flex-1">
                <div 
                  class="p-2.5 rounded-2xl shrink-0 flex items-center justify-center border border-border/20"
                  :class="getCategoryVisual(tx.category, tx.type).bg"
                >
                  <component :is="getCategoryVisual(tx.category, tx.type).icon" class="w-4 h-4 shrink-0" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-foreground truncate text-sm" :title="formatDescription(tx.description)">
                    {{ formatDescription(tx.description) }}
                  </p>
                  <div class="flex items-center flex-wrap gap-1.5 mt-1 text-[11px] text-muted-foreground">
                    <span>{{ formatDate(tx.date) }}</span>
                    <span>•</span>
                    <span 
                      class="px-1.5 py-0.2 rounded font-medium text-[10px]"
                      :class="isNegative(tx) ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'"
                    >
                      {{ isNegative(tx) ? 'Salida' : 'Entrada' }}
                    </span>
                    <span v-if="tx.category" class="bg-secondary px-1.5 py-0.2 rounded border border-border/40 text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {{ tx.category }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Monto y Acciones -->
              <div class="flex items-center gap-2 text-right shrink-0">
                <div class="font-mono font-bold text-sm sm:text-base" :class="isNegative(tx) ? 'text-red-500' : 'text-emerald-500'">
                  {{ isNegative(tx) ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
                </div>
                <div class="flex items-center gap-1 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-1">
                  <button @click="openEditTransaction(tx)" class="text-muted-foreground hover:text-primary p-1.5 bg-secondary/80 hover:bg-secondary rounded-lg transition-colors border border-border/30" title="Editar transacción">
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDeleteTransaction(tx)" class="text-muted-foreground hover:text-destructive p-1.5 bg-secondary/80 hover:bg-secondary rounded-lg transition-colors border border-border/30" title="Eliminar transacción">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
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
                  <span class="text-xs text-muted-foreground font-sans">/ {{ sub.frequency === 'MONTHLY' ? 'mes' : sub.frequency === 'YEARLY' ? 'año' : sub.frequency === 'QUARTERLY' ? 'trimestre' : sub.frequency === 'SEMIANNUAL' ? 'semestre' : sub.frequency === 'WEEKLY' ? 'sem' : (sub.frequency === 'BIWEEKLY' || sub.frequency === 'SEMIMONTHLY') ? 'quincena' : 'bimestre' }}</span>
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

      <!-- Próximos Pagos & Radar de Liquidez -->
      <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm mb-8 mt-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-lg flex items-center gap-2">
                Radar de Pagos & Liquidez
                <span class="text-xs px-2 py-0.5 rounded-full bg-secondary font-mono text-muted-foreground">
                  Próximos 15 días
                </span>
              </h3>
              <p class="text-xs text-muted-foreground">Monitoreo de compromisos y cobertura financiera inmediata.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-xs sm:text-sm">
            <div class="bg-secondary/60 px-3 py-1.5 rounded-xl border border-border/30">
              <span class="text-muted-foreground">Total a pagar:</span>
              <span class="font-bold font-mono ml-1 text-foreground">{{ formatCurrency(totalUpcoming) }}</span>
            </div>
            <div v-if="totalUpcomingIncome > 0" class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <span>Ingresos est.:</span>
              <span class="font-bold font-mono ml-1">+{{ formatCurrency(totalUpcomingIncome) }}</span>
            </div>
          </div>
        </div>

        <!-- Barra Comparativa de Liquidez Inmediata -->
        <div class="mb-6 p-4 rounded-2xl bg-secondary/30 border border-border/30 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-foreground">Cobertura de Liquidez (Efectivo & Débito):</span>
              <span class="font-medium" :class="liquidityCoverage.covered ? 'text-emerald-500' : 'text-rose-500'">
                {{ liquidityCoverage.statusText }}
              </span>
            </div>
            <div class="font-mono text-muted-foreground">
              Disponible: <strong class="text-foreground">{{ formatCurrency(liquidCashBalance) }}</strong> / Necesario: <strong class="text-foreground">{{ formatCurrency(totalUpcoming) }}</strong>
            </div>
          </div>

          <!-- Progress Bar de Liquidez -->
          <div class="h-2.5 w-full bg-secondary rounded-full overflow-hidden p-0.5 border border-border/20">
            <div 
              class="h-full rounded-full transition-all duration-700"
              :class="liquidityCoverage.barColor"
              :style="{ width: `${liquidityCoverage.ratio}%` }"
            ></div>
          </div>
        </div>
        
        <div v-if="financeStore.upcomingPayments.length === 0" class="text-sm text-muted-foreground text-center py-8">
          🎉 ¡Excelente! No tienes pagos ni vencimientos programados para los próximos 15 días.
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(payment, idx) in financeStore.upcomingPayments" 
            :key="idx" 
            class="p-4 bg-secondary/30 hover:bg-secondary/50 rounded-2xl border border-border/30 flex flex-col justify-between transition-all"
          >
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-sm truncate" :title="payment.name">{{ payment.name }}</p>
                  <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-medium border border-border/40 text-muted-foreground">
                      {{ payment.type }}
                    </span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1" :class="getPaymentUrgency(payment).class">
                      <Clock class="w-2.5 h-2.5" />
                      {{ getPaymentUrgency(payment).label }}
                    </span>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <p :class="['font-mono font-bold text-base', payment.type === 'Ingreso' ? 'text-emerald-500' : 'text-foreground']">
                    {{ payment.type === 'Ingreso' ? '+' : '' }}{{ formatCurrency(payment.amount) }}
                  </p>
                  <p class="text-[10px] text-muted-foreground">
                    {{ new Date(payment.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) }}
                  </p>
                </div>
              </div>

              <!-- Si es tarjeta de crédito con desglose de corte -->
              <div v-if="payment.statementMinimum !== undefined && payment.statementNoInterest !== undefined && payment.statementNoInterest > 0" class="mt-2.5 pt-2.5 border-t border-border/30 text-[11px] space-y-1">
                <div class="flex justify-between text-muted-foreground">
                  <span>Pago mín:</span>
                  <span class="font-mono font-medium text-foreground">{{ formatCurrency(payment.statementMinimum) }}</span>
                </div>
                <div class="flex justify-between text-muted-foreground">
                  <span>Sin intereses:</span>
                  <span class="font-mono font-bold text-foreground">{{ formatCurrency(payment.statementNoInterest) }}</span>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="mt-3 pt-2.5 border-t border-border/20 flex gap-2">
              <template v-if="payment.statementMinimum !== undefined && payment.statementNoInterest !== undefined && payment.statementNoInterest > 0">
                <button 
                  @click="markAsPaid(payment, payment.statementMinimum)" 
                  class="flex-1 text-[11px] bg-secondary hover:bg-secondary/80 py-1.5 rounded-xl border border-border/40 font-medium transition-colors"
                >
                  Pagar Mín
                </button>
                <button 
                  @click="markAsPaid(payment, payment.statementNoInterest)" 
                  class="flex-1 text-[11px] bg-primary text-primary-foreground hover:opacity-90 py-1.5 rounded-xl font-bold shadow-sm transition-opacity"
                >
                  Sin Intereses
                </button>
              </template>
              <template v-else>
                <button 
                  @click="markAsPaid(payment)" 
                  class="w-full text-xs py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5"
                  :class="payment.type === 'Ingreso' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25' : 'bg-primary/10 text-primary hover:bg-primary/20'"
                >
                  <component :is="payment.type === 'Ingreso' ? TrendingUp : ArrowUpRight" class="w-3.5 h-3.5" />
                  <span>{{ payment.type === 'Ingreso' ? 'Registrar Ingreso' : 'Registrar Pago' }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- MODALS -->

      <!-- Modal: Nueva Cuenta -->
      <div v-if="showAccountModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1">Pago Mínimo (%)</label>
                <input v-model.number="accountForm.minimum_payment_percentage" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
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
              <div v-if="accountForm.payment_frequency !== 'ONCE'">
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
              <div>
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
      <div v-if="showEditAccountModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1">Pago Mínimo (%)</label>
                <input v-model.number="editAccountForm.minimum_payment_percentage" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
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
              <div v-if="editAccountForm.payment_frequency !== 'ONCE'">
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
              <div>
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
      <div v-if="showSubscriptionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
                  <option value="BIWEEKLY">Quincenal (cada 14 días)</option>
                  <option value="SEMIMONTHLY">Quincena Fija (ej. 10 y 25)</option>
                  <option value="MONTHLY">Mensual</option>
                  <option value="BIMONTHLY">Bimestral</option>
                  <option value="QUARTERLY">Trimestral</option>
                  <option value="SEMIANNUAL">Semestral</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
            </div>
            
            <div v-if="['BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'YEARLY'].includes(subForm.frequency)" class="flex items-center gap-2 mt-2 bg-secondary/30 p-3 rounded-xl border border-border/40">
              <input type="checkbox" id="monthlyProvision" v-model="subForm.isVariable" class="w-4 h-4 text-primary rounded focus:ring-primary">
              <label for="monthlyProvision" class="text-sm">
                Guardado mensual (dividir pago para que se sienta menos)
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Monto Estimado</label>
              <input v-model.number="subForm.amount" required type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            <div v-if="['WEEKLY', 'MONTHLY', 'SEMIMONTHLY'].includes(subForm.frequency)">
              <div v-if="subForm.frequency === 'SEMIMONTHLY'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Día de Pago 1</label>
                  <input v-model.number="subForm.paymentDay" required type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Día de Pago 2</label>
                  <input v-model.number="subForm.paymentDay2" required type="number" min="1" max="31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                </div>
              </div>
              <div v-else>
                <label class="block text-sm font-medium mb-1">
                  Día de Pago {{ subForm.frequency === 'WEEKLY' ? '(1=Lun, 7=Dom)' : '' }}
                </label>
                <input v-model.number="subForm.paymentDay" required type="number" min="1" :max="subForm.frequency === 'WEEKLY' ? 7 : 31" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
            </div>
            <div v-else>
              <label class="block text-sm font-medium mb-1">
                {{ subForm.id ? 'Próximo Pago (Fecha)' : 'Fecha de Inicio o Próximo Pago' }}
              </label>
              <input v-model="subForm.nextPaymentDate" type="date" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              <div v-if="computedNextPaymentPreview" class="mt-2 text-xs flex items-center gap-1.5 p-2.5 rounded-xl border" :class="computedNextPaymentPreview.isPast ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/40 border-border/40 text-muted-foreground'">
                <Clock class="w-3.5 h-3.5 shrink-0" />
                <span>{{ computedNextPaymentPreview.text }}</span>
              </div>
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
      <div v-if="showTransactionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-6">{{ editingTransactionId ? 'Editar Transacción' : 'Registrar Transacción' }}</h2>
          <form @submit.prevent="submitTransaction" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="txForm.type" :disabled="!!editingTransactionId && ['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type)" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none disabled:opacity-50">
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
              <label class="block text-sm font-medium mb-1">Cuenta {{ ['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type) ? (editingTransactionId ? '' : 'Origen') : '' }}</label>
              <select v-model.number="txForm.accountId" required :disabled="!!editingTransactionId && ['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type)" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none disabled:opacity-50">
                <option v-for="acc in filteredSourceAccounts" :key="acc.id" :value="acc.id">{{ acc.name }} — {{ formatCurrency(Number(acc.balance)) }}</option>
              </select>
              <p v-if="selectedSourceAccount" class="text-xs mt-1 font-mono" :class="Number(selectedSourceAccount.balance) < 0 ? 'text-red-500' : 'text-muted-foreground'">
                Saldo disponible: <span class="font-bold">{{ formatCurrency(Number(selectedSourceAccount.balance)) }}</span>
                <span v-if="txForm.amount > 0 && !['credit_payment', 'loan_payment'].includes(txForm.type)"> → después: {{ formatCurrency(Number(selectedSourceAccount.balance) + (txForm.type === 'income' ? txForm.amount : -txForm.amount)) }}</span>
              </p>
            </div>
            <div v-if="['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type) && !editingTransactionId">
              <label class="block text-sm font-medium mb-1">{{ txForm.type === 'transfer' ? 'Cuenta Destino' : 'Cuenta a Pagar' }}</label>
              <select v-model.number="txForm.destinationAccountId" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option v-for="acc in filteredDestinationAccounts" :key="acc.id" :value="acc.id">{{ acc.name }} — {{ formatCurrency(Number(acc.balance)) }}</option>
              </select>
            </div>
            <div v-if="selectedSourceAccount?.type === 'card' && selectedSourceAccount?.sub_type === 'credit'">
              <label class="block text-sm font-medium mb-1">Meses sin Intereses (MSI)</label>
              <select v-model.number="txForm.installments" required class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option value="1">1 (Contado)</option>
                <option value="3">3 Meses</option>
                <option value="6">6 Meses</option>
                <option value="9">9 Meses</option>
                <option value="12">12 Meses</option>
                <option value="18">18 Meses</option>
                <option value="24">24 Meses</option>
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
                <option value="" disabled>Selecciona una categoría...</option>
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
      <div v-if="historyAccount" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
                <p class="font-medium truncate">{{ formatDescription(tx.description) || tx.category || 'Sin descripción' }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] px-2 py-0.5 rounded font-medium" 
                        :class="isNegative(tx) ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'">
                    {{ isNegative(tx) ? 'Pago' : 'Abono' }}
                  </span>
                  <span class="text-[10px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded">
                    {{ tx.category || txTypeLabel(tx.type) }}
                  </span>
                  <span class="text-xs text-muted-foreground ml-auto">{{ formatDate(tx.date) }}</span>
                </div>
              </div>
              <span class="font-mono font-bold whitespace-nowrap" :class="isNegative(tx) ? 'text-red-500' : 'text-emerald-500'">
                {{ isNegative(tx) ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Gestionar Categorías -->
      <div v-if="showManageCategoriesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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

      <!-- Modal: Calibrar Estado de Cuenta -->
      <div v-if="showCalibrateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-2xl font-bold mb-2">Corregir Estado de Cuenta</h2>
          <p class="text-sm text-muted-foreground mb-6">Si el banco reporta montos diferentes, ingresa los reales aquí. El sistema registrará los ajustes necesarios.</p>
          
          <form @submit.prevent="submitCalibration" class="space-y-4">
            <div v-if="calibrateForm.error" class="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl">
              {{ calibrateForm.error }}
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Pago para no generar intereses (Real)</label>
              <input v-model.number="calibrateForm.reportedNoInterest" required type="number" step="0.01" min="0" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              <p class="text-xs text-muted-foreground mt-1">Calculado por la app: {{ formatCurrency(calibrateAccount?.statement?.noInterestPayment || 0) }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Pago mínimo (Real)</label>
              <input v-model.number="calibrateForm.reportedMinimum" required type="number" step="0.01" min="0" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              <p class="text-xs text-muted-foreground mt-1">Calculado por la app: {{ formatCurrency(calibrateAccount?.statement?.minimumPayment || 0) }}</p>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showCalibrateModal = false" :disabled="isSubmittingCalibration" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors disabled:opacity-50">Cancelar</button>
              <button type="submit" :disabled="isSubmittingCalibration" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmittingCalibration ? 'Ajustando...' : 'Ajustar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  Coins,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  ChevronRight,
  Utensils,
  Car,
  ShoppingBag,
  Laptop,
  HeartPulse,
  Home,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Tag,
  Search,
  ArrowUpRight
} from 'lucide-vue-next'
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
const showCalibrateModal = ref(false)
const isSubmittingCalibration = ref(false)

const calibrateAccount = ref<Account | null>(null)
const calibrateForm = reactive({
  reportedNoInterest: 0,
  reportedMinimum: 0,
  error: ''
})

const selectedMonth = ref<string>('all')
const searchQuery = ref<string>('')

const availableMonths = computed(() => {
  const months = new Set<string>()
  financeStore.transactions.forEach(tx => {
    if (tx.date) {
      months.add(tx.date.substring(0, 7)) // 'YYYY-MM'
    }
  })
  return Array.from(months).sort().reverse().map(m => {
    const [year, month] = m.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return {
      value: m,
      label: date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
    }
  })
})

const filteredTransactions = computed(() => {
  let list = financeStore.transactions
  if (selectedMonth.value !== 'all') {
    list = list.filter(tx => tx.date && tx.date.startsWith(selectedMonth.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(tx => {
      const desc = (tx.description || '').toLowerCase()
      const cat = (tx.category || '').toLowerCase()
      const amt = String(tx.amount || '')
      return desc.includes(q) || cat.includes(q) || amt.includes(q)
    })
  }
  return list
})

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
  payment_day: 1,
  minimum_payment_percentage: 5.0
})

const editingAccountId = ref<number | null>(null)
const editAccountForm = reactive({
  id: null as number | null,
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
  payment_day: 1,
  minimum_payment_percentage: 5.0
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
  paymentDay: 1 as number | null,
  paymentDay2: 15 as number | null,
  nextPaymentDate: null as string | null
})

const computedNextPaymentPreview = computed(() => {
  if (!subForm.nextPaymentDate) return null
  if (['WEEKLY', 'MONTHLY', 'SEMIMONTHLY'].includes(subForm.frequency)) return null

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const parts = subForm.nextPaymentDate.split('-')
  if (parts.length !== 3) return null

  const inputDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  if (isNaN(inputDate.getTime())) return null

  const nextDate = computeUpcomingPaymentDate(subForm.nextPaymentDate, subForm.frequency, today)
  const isPast = inputDate < today
  const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

  const formattedDate = nextDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  const daysText = diffDays === 0 ? 'hoy' : diffDays === 1 ? 'mañana' : `en ${diffDays} días`

  return {
    isPast,
    date: nextDate,
    text: isPast
      ? `Fecha en el pasado. Próximo cobro calculado: ${formattedDate} (${daysText})`
      : `Próximo cobro: ${formattedDate} (${daysText})`
  }
})

const txForm = reactive({
  type: 'expense' as TransactionType,
  amount: 0,
  accountId: null as number | null,
  destinationAccountId: null as number | null,
  category: '',
  description: '',
  date: new Date().toISOString(),
  subscriptionId: null as number | null,
  installments: 1
})

const showAddCategory = ref(false)
const newCategory = ref('')

const newCategoryName = ref('')
const editingCategory = ref<string | null>(null)
const editingCategoryValue = ref('')

function openCalibrateModal(acc: Account) {
  calibrateAccount.value = acc
  calibrateForm.reportedNoInterest = acc.statement?.noInterestPayment || 0
  calibrateForm.reportedMinimum = acc.statement?.minimumPayment || 0
  calibrateForm.error = ''
  showCalibrateModal.value = true
}

async function submitCalibration() {
  if (!calibrateAccount.value || isSubmittingCalibration.value) return
  isSubmittingCalibration.value = true
  const acc = calibrateAccount.value
  calibrateForm.error = ''
  let hasChanges = false
  let minError = false

  try {
    if (calibrateForm.reportedNoInterest > (acc.credit_limit || 0)) {
      calibrateForm.error = `El monto no puede ser mayor al límite de crédito (${acc.credit_limit})`;
      return;
    }

    // 1. Ajustar Pago para no generar intereses (creando transacción de ajuste que NO afecta el balance)
    const baseValue = acc.statement?.rawNoInterestPayment !== undefined ? acc.statement.rawNoInterestPayment : (acc.statement?.noInterestPayment || 0)
    const diff = calibrateForm.reportedNoInterest - baseValue
    if (Math.abs(diff) > 0.01) {
      await financeStore.addTransaction({
        accountId: acc.id,
        type: diff > 0 ? 'expense' : 'credit_payment',
        amount: Math.abs(diff),
        category: 'Ajuste de Estado de Cuenta',
        description: 'Ajuste de Estado de Cuenta',
        // Usar periodStartDate asegura que SIEMPRE caiga dentro del ciclo actual y no sea ignorada por horas
        date: acc.statement?.periodStartDate || new Date().toISOString(),
        installments: 1
      })
      hasChanges = true
      await financeStore.fetchAccounts()
    }

    // Calibrar pago mínimo
    if (calibrateForm.reportedMinimum !== acc.statement?.minimumPayment || calibrateForm.reportedNoInterest !== acc.statement?.noInterestPayment) {
      const api = (await import('~/utils/api')).default
      const res = await api.post(`/finance/accounts/${acc.id}/calibrate-minimum`, {
        reportedMinimum: calibrateForm.reportedMinimum,
        reportedNoInterest: calibrateForm.reportedNoInterest
      })
      if (res.data.success) {
        hasChanges = true
      } else {
        calibrateForm.error = "Error al calibrar mínimo: " + res.data.message
        minError = true
      }
    }

    if (hasChanges && !minError) {
      await financeStore.fetchAccounts()
      showCalibrateModal.value = false
    }
  } catch (err: any) {
    console.error(err)
    calibrateForm.error = "Error de conexión: " + (err.response?.data?.message || err.message)
  } finally {
    isSubmittingCalibration.value = false
  }
}

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
  return financeStore.upcomingPayments
    .filter(p => p.type !== 'Ingreso')
    .reduce((sum, p) => sum + p.amount, 0)
})

const totalUpcomingIncome = computed(() => {
  return financeStore.upcomingPayments
    .filter(p => p.type === 'Ingreso')
    .reduce((sum, p) => sum + p.amount, 0)
})

const liquidCashBalance = computed(() => {
  return financeStore.accounts
    .filter(acc => acc.type === 'cash' || (acc.type === 'card' && acc.sub_type !== 'credit') || acc.type === 'savings')
    .reduce((sum, acc) => sum + Math.max(0, Number(acc.balance)), 0)
})

const liquidityCoverage = computed(() => {
  const liquid = liquidCashBalance.value
  const due = totalUpcoming.value
  if (due <= 0) {
    return {
      ratio: 100,
      covered: true,
      diff: liquid,
      statusText: 'Sin pagos pendientes en los próximos 15 días',
      barColor: 'bg-emerald-500'
    }
  }
  const ratio = Math.min(100, Math.round((liquid / due) * 100))
  const diff = liquid - due
  const covered = diff >= 0
  return {
    ratio,
    covered,
    diff,
    statusText: covered 
      ? `100% Cubierto (Margen favorable de ${formatCurrency(diff)})` 
      : `Déficit de ${formatCurrency(Math.abs(diff))} para cubrir los próximos 15 días`,
    barColor: covered ? 'bg-emerald-500' : ratio >= 50 ? 'bg-amber-500' : 'bg-rose-500'
  }
})

function getPaymentUrgency(p: any) {
  if (p.daysRemaining < 0) {
    return {
      label: `Vencido (${Math.abs(p.daysRemaining)}d)`,
      class: 'bg-rose-500/15 text-rose-500 border-rose-500/30 animate-pulse font-bold'
    }
  }
  if (p.daysRemaining === 0) {
    return {
      label: '¡Pagar Hoy!',
      class: 'bg-rose-500/15 text-rose-500 border-rose-500/30 font-bold'
    }
  }
  if (p.daysRemaining === 1) {
    return {
      label: 'Mañana',
      class: 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-semibold'
    }
  }
  if (p.daysRemaining <= 3) {
    return {
      label: `En ${p.daysRemaining} días`,
      class: 'bg-amber-500/10 text-amber-500 border-amber-500/20 font-medium'
    }
  }
  return {
    label: `En ${p.daysRemaining} días`,
    class: 'bg-secondary text-muted-foreground border-border/30'
  }
}

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
    credit_limit: accountForm.type === 'card' && accountForm.sub_type === 'credit' ? (accountForm.credit_limit || 0) : 0,
    interest_rate: accountForm.interest_rate || 0,
    monthly_payment: accountForm.monthly_payment || 0,
    payment_frequency: accountForm.payment_frequency as any,
    cutoff_day: (accountForm.type === 'card' && accountForm.sub_type === 'credit') ? (accountForm.cutoff_day || 1) : null as any,
    payment_day: accountForm.payment_day || 1,
    minimum_payment_percentage: accountForm.minimum_payment_percentage || 5.0,
    currency: accountForm.currency
  })
  showAccountModal.value = false
  // reset
  accountForm.name = ''
  accountForm.balance = 0
  accountForm.credit_limit = 0
  accountForm.interest_rate = 0
  accountForm.monthly_payment = 0
  accountForm.minimum_payment_percentage = 5.0
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
  editAccountForm.minimum_payment_percentage = account.minimum_payment_percentage || 5.0
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
    credit_limit: editAccountForm.type === 'card' && editAccountForm.sub_type === 'credit' ? (editAccountForm.credit_limit || 0) : 0,
    interest_rate: editAccountForm.interest_rate || 0,
    monthly_payment: editAccountForm.monthly_payment || 0,
    payment_frequency: editAccountForm.payment_frequency as any,
    cutoff_day: (editAccountForm.type === 'card' && editAccountForm.sub_type === 'credit') ? (editAccountForm.cutoff_day || 1) : null as any,
    payment_day: editAccountForm.payment_day || 1,
    minimum_payment_percentage: editAccountForm.minimum_payment_percentage || 5.0,
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
  if (sub.frequency === 'SEMIMONTHLY' && sub.paymentDay > 100) {
    subForm.paymentDay = Math.floor(sub.paymentDay / 100)
    subForm.paymentDay2 = sub.paymentDay % 100
  } else {
    subForm.paymentDay = sub.paymentDay || 1
    subForm.paymentDay2 = 15
  }
  subForm.nextPaymentDate = sub.nextPaymentDate ? sub.nextPaymentDate.split('T')[0] : null
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
  const data: any = {
    name: subForm.name,
    type: subForm.type as any,
    frequency: subForm.frequency as any,
    amount: subForm.amount,
    currency: subForm.currency,
    isVariable: subForm.isVariable,
    accountId: subForm.accountId,
    paymentDay: subForm.frequency === 'SEMIMONTHLY' 
      ? ((subForm.paymentDay || 1) * 100 + (subForm.paymentDay2 || 15)) 
      : subForm.paymentDay
  }

  if (['BIWEEKLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'YEARLY'].includes(subForm.frequency)) {
    if (subForm.nextPaymentDate) {
      const targetDate = computeUpcomingPaymentDate(subForm.nextPaymentDate, subForm.frequency)
      data.nextPaymentDate = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 12, 0, 0)).toISOString()
      data.paymentDay = targetDate.getDate()
    } else {
      data.nextPaymentDate = null
    }
  } else {
    data.nextPaymentDate = null
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
  subForm.nextPaymentDate = null
}

const isSubmittingTx = ref(false)
const submitTransaction = async () => {
  if (!txForm.accountId || isSubmittingTx.value) return
  
  isSubmittingTx.value = true

  const isTransferOrPayment = ['transfer', 'credit_payment', 'loan_payment'].includes(txForm.type);
  const category = txForm.type === 'transfer' ? 'Transferencia' : (txForm.type === 'credit_payment' ? 'Pago de Tarjeta' : (txForm.type === 'loan_payment' ? 'Pago de Préstamo' : txForm.category));

  const isCreditCard = financeStore.accounts.find(a => a.id === txForm.accountId)?.sub_type === 'credit';
  const installments = isCreditCard ? txForm.installments : 1;

  try {
    if (editingTransactionId.value) {
      await financeStore.updateTransaction(editingTransactionId.value, {
        accountId: txForm.accountId,
        amount: txForm.amount,
        category: category,
        type: txForm.type,
        description: txForm.description,
        date: txForm.date || new Date().toISOString(),
        installments: installments
      } as any)
    } else {
      await financeStore.addTransaction({
        accountId: txForm.accountId,
        type: txForm.type,
        amount: txForm.amount,
        category: category,
        description: txForm.description,
        date: txForm.date || new Date().toISOString(),
        installments: installments,
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
  txForm.installments = tx.installments || 1
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
  txForm.category = ''
  txForm.description = ''
  txForm.installments = 1
  txForm.date = new Date().toISOString()
  txForm.subscriptionId = null
}

const markAsPaid = (payment: any, amountOverride?: number) => {
  txForm.amount = amountOverride !== undefined ? amountOverride : payment.amount
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
    txForm.type = payment.isProvisionTransfer ? 'transfer' : (payment.type === 'Ingreso' ? 'income' : 'expense')
    if (payment.accountId) {
      txForm.accountId = payment.accountId
    } else {
      txForm.accountId = financeStore.accounts[0]?.id ?? null
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

const formatDescription = (desc: string) => {
  if (!desc) return '';
  return desc.replace(/cuenta #(\d+)/g, (match, p1) => {
    const acc = financeStore.accounts.find(a => a.id === Number(p1));
    return acc ? acc.name : match;
  });
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

function getAccountIcon(acc: Account) {
  if (acc.type === 'card') return CreditCard
  if (acc.type === 'savings' || acc.type === 'investment') return PiggyBank
  if (acc.type === 'loan') return Landmark
  if (acc.type === 'cash') return Coins
  return Wallet
}

function getAccountBadge(acc: Account) {
  if (acc.type === 'card') {
    if (acc.sub_type === 'credit') return { label: 'Crédito', class: 'bg-purple-500/10 text-purple-500 border-purple-500/20' }
    if (acc.sub_type === 'payroll') return { label: 'Nómina', class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
    return { label: 'Débito', class: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' }
  }
  if (acc.type === 'savings') return { label: 'Ahorro', class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
  if (acc.type === 'investment') return { label: 'Inversión', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
  if (acc.type === 'loan') return { label: 'Préstamo', class: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
  return { label: 'Efectivo', class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
}

function getCreditUtilization(acc: Account) {
  const limit = Number(acc.credit_limit) || 0
  if (limit <= 0) return null
  const used = Math.max(0, Math.abs(Number(acc.balance)))
  const percentage = Math.min(100, Math.round((used / limit) * 100))
  let bgClass = 'bg-emerald-500'
  let textClass = 'text-emerald-500'
  let label = 'Saludable'
  if (percentage >= 70) {
    bgClass = 'bg-rose-500'
    textClass = 'text-rose-500'
    label = 'Alto'
  } else if (percentage >= 30) {
    bgClass = 'bg-amber-500'
    textClass = 'text-amber-500'
    label = 'Moderado'
  }
  return {
    limit,
    used,
    percentage,
    available: Math.max(0, limit - used),
    bgClass,
    textClass,
    label
  }
}

function getDaysUntilDayOfMonth(day: number): number {
  if (!day || day < 1 || day > 31) return -1
  const today = new Date()
  const currentDay = today.getDate()
  if (day === currentDay) return 0
  if (day > currentDay) return day - currentDay
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, day)
  const diffTime = nextMonth.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getPaymentDueBadge(acc: Account): { label: string; class: string } | null {
  if (acc.statement?.paymentDueDate) {
    const due = new Date(acc.statement.paymentDueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { label: `Vencido (${Math.abs(diff)}d)`, class: 'bg-red-500/15 text-red-500 border-red-500/30 font-bold animate-pulse' }
    if (diff === 0) return { label: 'Pagar hoy', class: 'bg-red-500/15 text-red-500 border-red-500/30 font-bold' }
    if (diff === 1) return { label: 'Pagar mañana', class: 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-medium' }
    if (diff <= 3) return { label: `Pagar en ${diff}d`, class: 'bg-amber-500/15 text-amber-500 border-amber-500/30' }
    return { label: `Pagar en ${diff}d`, class: 'bg-secondary text-muted-foreground border-border/40' }
  }
  if (acc.payment_day) {
    const diff = getDaysUntilDayOfMonth(acc.payment_day)
    if (diff === 0) return { label: 'Pagar hoy', class: 'bg-red-500/15 text-red-500 border-red-500/30 font-bold' }
    if (diff === 1) return { label: 'Pagar mañana', class: 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-medium' }
    if (diff <= 5) return { label: `Pagar en ${diff}d`, class: 'bg-amber-500/15 text-amber-500 border-amber-500/30' }
    return { label: `Pagar en ${diff}d`, class: 'bg-secondary text-muted-foreground border-border/40' }
  }
  return null
}

function getCutoffBadge(acc: Account): { label: string; class: string } | null {
  if (!acc.cutoff_day) return null
  const diff = getDaysUntilDayOfMonth(acc.cutoff_day)
  if (diff === 0) return { label: 'Corte hoy', class: 'bg-blue-500/15 text-blue-500 border-blue-500/30 font-medium' }
  if (diff === 1) return { label: 'Corte mañana', class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
  return { label: `Corte en ${diff}d`, class: 'bg-secondary/80 text-muted-foreground border-border/30' }
}

function getCategoryVisual(cat: string, type: TransactionType) {
  const c = (cat || '').toLowerCase()
  if (type === 'income' || c.includes('salario') || c.includes('nómina') || c.includes('nomina') || c.includes('ingreso')) {
    return { icon: TrendingUp, bg: 'bg-emerald-500/15 text-emerald-500' }
  }
  if (c.includes('comida') || c.includes('alimento') || c.includes('restaurante') || c.includes('super') || c.includes('despensa')) {
    return { icon: Utensils, bg: 'bg-orange-500/15 text-orange-500' }
  }
  if (c.includes('transporte') || c.includes('gasolina') || c.includes('uber') || c.includes('auto') || c.includes('coche') || c.includes('peaje')) {
    return { icon: Car, bg: 'bg-blue-500/15 text-blue-500' }
  }
  if (c.includes('compra') || c.includes('ropa') || c.includes('tienda') || c.includes('amazon') || c.includes('mercado')) {
    return { icon: ShoppingBag, bg: 'bg-pink-500/15 text-pink-500' }
  }
  if (c.includes('tec') || c.includes('software') || c.includes('suscrip') || c.includes('internet') || c.includes('streaming')) {
    return { icon: Laptop, bg: 'bg-purple-500/15 text-purple-500' }
  }
  if (c.includes('salud') || c.includes('med') || c.includes('farmacia') || c.includes('doctor') || c.includes('hospital')) {
    return { icon: HeartPulse, bg: 'bg-rose-500/15 text-rose-500' }
  }
  if (c.includes('hogar') || c.includes('casa') || c.includes('renta') || c.includes('luz') || c.includes('agua') || c.includes('gas') || c.includes('servicio')) {
    return { icon: Home, bg: 'bg-teal-500/15 text-teal-500' }
  }
  if (c.includes('educa') || c.includes('curso') || c.includes('libro') || c.includes('escuela')) {
    return { icon: GraduationCap, bg: 'bg-indigo-500/15 text-indigo-500' }
  }
  if (c.includes('ocio') || c.includes('viaje') || c.includes('fiesta') || c.includes('cine') || c.includes('entretenimiento')) {
    return { icon: Sparkles, bg: 'bg-amber-500/15 text-amber-500' }
  }
  if (['transfer', 'credit_payment', 'loan_payment'].includes(type)) {
    return { icon: Landmark, bg: 'bg-violet-500/15 text-violet-500' }
  }
  return { icon: Tag, bg: 'bg-primary/10 text-primary' }
}
</script>
