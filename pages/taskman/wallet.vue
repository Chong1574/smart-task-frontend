<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Mantén el control de tus ingresos, gastos y suscripciones.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva Transacción
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjeta Balance -->
        <div class="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-3xl text-white shadow-xl shadow-green-500/20 relative overflow-hidden md:col-span-1">
          <div class="relative z-10">
            <h3 class="font-medium opacity-90 mb-1">Balance Total</h3>
            <p class="text-4xl font-bold font-mono">$12,450.00</p>
          </div>
          <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <!-- Tarjeta Cuentas -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm md:col-span-2">
          <h3 class="font-bold text-lg mb-4">Mis Cuentas</h3>
          <div class="flex gap-4">
            <div class="bg-secondary/50 p-4 rounded-2xl flex-1 border border-border/30">
              <p class="text-muted-foreground text-sm">Débito Principal</p>
              <p class="text-xl font-bold font-mono">$8,000.00</p>
            </div>
            <div class="bg-secondary/50 p-4 rounded-2xl flex-1 border border-border/30">
              <p class="text-muted-foreground text-sm">Ahorros</p>
              <p class="text-xl font-bold font-mono">$4,450.00</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla Transacciones -->
      <div class="bg-card border border-border/40 rounded-3xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-border/40 flex justify-between items-center">
          <h3 class="font-bold text-lg">Transacciones Recientes</h3>
        </div>
        <div class="p-4 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground bg-secondary/20">
          <div class="col-span-3">Fecha</div>
          <div class="col-span-4">Descripción</div>
          <div class="col-span-3">Categoría</div>
          <div class="col-span-2 text-right">Monto</div>
        </div>
        <div class="p-4 grid grid-cols-12 gap-4 items-center border-b border-border/40 text-sm hover:bg-secondary/10 transition-colors">
          <div class="col-span-3 text-muted-foreground">09 Jun 2026</div>
          <div class="col-span-4 font-medium">Suscripción Netflix</div>
          <div class="col-span-3"><span class="bg-purple-500/10 text-purple-500 px-2 py-1 rounded text-xs font-bold">Entretenimiento</span></div>
          <div class="col-span-2 text-right font-mono font-bold text-red-500">-$299.00</div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>
