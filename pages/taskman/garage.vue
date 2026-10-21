<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold">Garage & Vehículos</h1>
        <p class="text-muted-foreground">Control de combustible, telemetría de odómetro y prospección de gastos a cubrir.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="openNewVehicle" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl font-medium transition-transform flex items-center gap-2">
          <Car class="w-4 h-4" />
          Nuevo Vehículo
        </button>
        <button @click="openNewLogModal()" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Registrar Carga
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <FinanceNavigation />

    <!-- Panel de Prospección de Uso & Gastos Calculados de Gasolina -->
    <div class="bg-card border border-border/40 p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden group">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 relative z-10">
        <div class="flex items-start gap-3">
          <div class="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <Fuel class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-xl md:text-2xl font-serif font-bold">Prospección de Uso & Gastos de Gasolina</h2>
              <span 
                class="text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border"
                :class="currentViewProj.isActiveInBudget ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'"
              >
                <CheckCircle2 v-if="currentViewProj.isActiveInBudget" class="w-3 h-3" />
                <AlertCircle v-else class="w-3 h-3" />
                {{ currentViewProj.isActiveInBudget ? 'Integrado a Gastos Fijos' : 'Excluido de Gastos Fijos (Inactivo)' }}
              </span>
            </div>
            <p class="text-xs md:text-sm text-muted-foreground mt-0.5">
              Cálculo estimado de consumo periódico basado en tu telemetría real de odómetro para entrar en los gastos que se deben cubrir.
            </p>
          </div>
        </div>

        <NuxtLink 
          to="/taskman/budget" 
          class="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 shrink-0 transition-colors"
        >
          <span>Ver impacto en Presupuesto & Flujo</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Selector por Carro (Separación de Vehículos) -->
      <div v-if="financeStore.vehicles.length > 1" class="flex items-center gap-2 overflow-x-auto pb-2 mb-4 pt-1 border-b border-border/30 relative z-10">
        <span class="text-xs text-muted-foreground font-medium shrink-0 mr-1">Ver prospección:</span>
        <button 
          @click="selectedFleetVehicleId = 'all'"
          class="text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0"
          :class="selectedFleetVehicleId === 'all' ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20' : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'"
        >
          <Car class="w-3.5 h-3.5" />
          <span>Toda la Flota ({{ projections.activeVehiclesCount }} activos)</span>
        </button>

        <button 
          v-for="v in financeStore.vehicles" 
          :key="v.id"
          @click="selectedFleetVehicleId = String(v.id)"
          class="text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0"
          :class="selectedFleetVehicleId === String(v.id) ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20' : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'"
        >
          <span class="w-2 h-2 rounded-full" :class="getVehicleProj(v).isActiveInBudget ? 'bg-emerald-400' : 'bg-rose-400'"></span>
          <span>{{ v.name }}</span>
          <span v-if="getVehicleProj(v).isStale" class="text-[10px] opacity-80 font-mono">(Pausado)</span>
        </button>
      </div>

      <!-- Alertas de Inactividad (Regla de 1 mes sin recarga) -->
      <div v-if="!currentViewProj.isAll && currentViewProj.isStale" class="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-start gap-2.5 relative z-10">
        <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong class="font-bold">Vehículo inactivo (+1 mes sin recargas):</strong>
          Lleva <strong>{{ currentViewProj.daysSinceLastRefill }} días</strong> sin registrar cargas de gasolina. Sus datos han sido pausados y <strong>no se suman</strong> a tu gasto recurrente ni a tus gastos calculados en el presupuesto.
        </div>
      </div>

      <div v-else-if="currentViewProj.isAll && currentViewProj.inactiveCount > 0" class="mb-5 p-3 rounded-2xl bg-secondary/40 border border-border/40 text-muted-foreground text-xs flex items-center justify-between relative z-10">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
          <span>{{ currentViewProj.inactiveCount }} vehículo(s) pausado(s) por llevar más de 30 días sin recargas (no suman al gasto fijo activo).</span>
        </div>
        <span class="text-[10px] font-mono text-emerald-500 font-semibold">{{ currentViewProj.activeCount }} activo(s)</span>
      </div>

      <!-- Cuadrícula de Prospección de Gasto por Periodo -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
        <!-- Gasto Diario -->
        <div class="p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:border-amber-500/30 transition-all">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-muted-foreground">Gasto Diario Aprox.</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground/80 font-mono">1 día</span>
          </div>
          <p class="text-2xl font-bold font-mono text-amber-500">{{ formatCurrency(currentViewProj.dailyExpense) }}</p>
          <p class="text-[11px] text-muted-foreground mt-1">
            ~{{ currentViewProj.dailyLiters }} L de combustible / día
          </p>
        </div>

        <!-- Gasto Semanal -->
        <div class="p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:border-amber-500/30 transition-all">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-muted-foreground">Gasto Semanal Aprox.</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground/80 font-mono">7 días</span>
          </div>
          <p class="text-2xl font-bold font-mono text-amber-500">{{ formatCurrency(currentViewProj.weeklyExpense) }}</p>
          <p class="text-[11px] text-muted-foreground mt-1">
            ~{{ Math.round(currentViewProj.dailyLiters * 7 * 10) / 10 }} L de combustible / sem
          </p>
        </div>

        <!-- Gasto Quincenal -->
        <div class="p-4 rounded-2xl bg-secondary/30 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent hover:border-amber-500/50 transition-all">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-amber-500 font-semibold">Gasto Quincenal</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-mono font-bold">15 días</span>
          </div>
          <p class="text-2xl font-bold font-mono text-amber-500">{{ formatCurrency(currentViewProj.biweeklyExpense) }}</p>
          <p class="text-[11px] text-muted-foreground mt-1">
            ~{{ Math.round(currentViewProj.dailyLiters * 15 * 10) / 10 }} L de combustible / quincena
          </p>
        </div>

        <!-- Gasto Mensual -->
        <div class="p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:border-amber-500/30 transition-all">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-muted-foreground">Gasto Mensual Fijo</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground/80 font-mono">30 días</span>
          </div>
          <p class="text-2xl font-bold font-mono text-red-500">{{ formatCurrency(currentViewProj.monthlyExpense) }}</p>
          <p class="text-[11px] text-muted-foreground mt-1">
            ~{{ Math.round(currentViewProj.dailyLiters * 30 * 10) / 10 }} L de combustible / mes
          </p>
        </div>
      </div>

      <!-- Métricas de Telemetría & Prospección de Uso -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border/30 relative z-10 text-xs">
        <div class="flex items-center gap-2.5">
          <Gauge class="w-4 h-4 text-primary shrink-0" />
          <div>
            <span class="text-muted-foreground block">Recorrido Promedio</span>
            <strong class="font-mono text-foreground">{{ currentViewProj.dailyKm }} km/día</strong>
            <span class="text-[10px] text-muted-foreground block">(~{{ currentViewProj.monthlyKm }} km/mes)</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <TrendingUp class="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span class="text-muted-foreground block">Rendimiento Promedio</span>
            <strong class="font-mono text-emerald-500">{{ currentViewProj.efficiency > 0 ? `${currentViewProj.efficiency} km/L` : 'Calculando...' }}</strong>
            <span class="text-[10px] text-muted-foreground block">{{ currentViewProj.isAll ? 'eficiencia global flota' : 'eficiencia del auto' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <DollarSign class="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <span class="text-muted-foreground block">Costo Operativo</span>
            <strong class="font-mono text-foreground">{{ currentViewProj.costPerKm > 0 ? `${formatCurrency(currentViewProj.costPerKm)} / km` : 'Calculando...' }}</strong>
            <span class="text-[10px] text-muted-foreground block">por cada km rodado</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <Calendar class="w-4 h-4 text-purple-500 shrink-0" />
          <div>
            <span class="text-muted-foreground block">Estado de Presupuesto</span>
            <strong :class="currentViewProj.isActiveInBudget ? 'text-emerald-500' : 'text-rose-500'">
              {{ currentViewProj.isActiveInBudget ? 'Compromiso Activo' : 'Excluido (Inactivo)' }}
            </strong>
            <span class="text-[10px] text-muted-foreground block">{{ currentViewProj.isActiveInBudget ? 'descontado en Safe-to-Spend' : '+30 días sin recargas' }}</span>
          </div>
        </div>
      </div>

      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
    </div>

    <!-- Empty State si no hay vehículos -->
    <div v-if="financeStore.vehicles.length === 0" class="bg-card border border-border/40 p-12 text-center rounded-3xl space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
        <Car class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-lg font-bold">No tienes vehículos registrados</h3>
        <p class="text-sm text-muted-foreground max-w-md mx-auto mt-1">
          Añade tu vehículo para llevar el control de combustible, telemetría y calcular automáticamente tu presupuesto de gasolina.
        </p>
      </div>
      <button @click="openNewVehicle" class="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity">
        Registrar Primer Vehículo
      </button>
    </div>

    <!-- Grid de Vehículos Separados -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-serif font-bold">Mis Vehículos ({{ financeStore.vehicles.length }})</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="vehicle in financeStore.vehicles" 
          :key="vehicle.id" 
          class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group"
        >
          <div>
            <!-- Header Tarjeta de Vehículo -->
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-xl">{{ vehicle.name }}</h3>
                <p class="text-muted-foreground text-sm">
                  {{ vehicle.make || '' }} {{ vehicle.model || '' }} {{ vehicle.year ? `(${vehicle.year})` : '' }}
                </p>
                <span v-if="vehicle.plate" class="inline-block mt-1 font-mono text-[11px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-semibold">
                  {{ vehicle.plate }}
                </span>
              </div>
              <div class="flex gap-1.5 items-center">
                <button 
                  @click="openEditVehicle(vehicle)" 
                  class="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  title="Editar vehículo"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <div class="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Car class="w-5 h-5" />
                </div>
              </div>
            </div>

            <!-- Badge de Estado en Presupuesto / Inactividad -->
            <div class="mb-3">
              <span 
                v-if="getVehicleProj(vehicle).isStale" 
                class="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1 w-fit"
              >
                ⏸️ Inactivo (+{{ getVehicleProj(vehicle).daysSinceLastRefill }}d sin cargar — No suma a gastos)
              </span>
              <span 
                v-else-if="getVehicleProj(vehicle).isPreliminary" 
                class="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-1 w-fit"
              >
                🟡 Preliminar (1 carga — ciclo 7d)
              </span>
              <span 
                v-else-if="getVehicleProj(vehicle).isActiveInBudget" 
                class="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit"
              >
                🟢 Activo en Presupuesto ({{ getVehicleProj(vehicle).logsCount }} cargas)
              </span>
              <span 
                v-else 
                class="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground w-fit"
              >
                ⚪ Sin cargas registradas
              </span>
            </div>

            <!-- Datos Básicos y Autonomía -->
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="bg-secondary/30 p-2.5 rounded-xl">
                <span class="text-[11px] text-muted-foreground block">Último Odom.</span>
                <span class="font-mono font-bold text-sm">{{ getLastOdometer(vehicle) }} km</span>
              </div>
              <div class="bg-secondary/30 p-2.5 rounded-xl">
                <span class="text-[11px] text-muted-foreground block">Rendimiento</span>
                <span class="font-mono font-bold text-sm text-emerald-500">{{ calculateEfficiency(vehicle) }} km/L</span>
              </div>
              <div v-if="vehicle.tankCapacity" class="bg-secondary/30 p-2.5 rounded-xl">
                <span class="text-[11px] text-muted-foreground block">Tanque</span>
                <span class="font-mono font-bold text-sm">{{ vehicle.tankCapacity }} L</span>
              </div>
              <div v-if="getVehicleAutonomy(vehicle)" class="bg-secondary/30 p-2.5 rounded-xl">
                <span class="text-[11px] text-muted-foreground block">Autonomía Tanque</span>
                <span class="font-mono font-bold text-sm text-blue-500">~{{ getVehicleAutonomy(vehicle) }} km</span>
              </div>
            </div>

            <!-- Prospección Particular del Vehículo Separada -->
            <div class="p-3.5 rounded-2xl bg-secondary/40 border border-border/40 space-y-2 mb-4">
              <div class="flex justify-between items-center text-xs">
                <span class="font-semibold text-foreground flex items-center gap-1">
                  <Fuel class="w-3.5 h-3.5 text-amber-500" />
                  Gasto Calculado del Auto
                </span>
                <span v-if="getVehicleProj(vehicle).daysSinceLastRefill !== null" class="text-[10px] text-muted-foreground font-mono">
                  Hace {{ getVehicleProj(vehicle).daysSinceLastRefill }}d
                </span>
              </div>

              <div class="grid grid-cols-3 gap-1.5 text-center pt-1 border-t border-border/30">
                <div class="bg-background/60 p-1.5 rounded-lg border border-border/30">
                  <span class="text-[10px] text-muted-foreground block">Diario</span>
                  <span class="font-mono text-xs font-bold">{{ formatCurrency(getVehicleProj(vehicle).dailyExpense) }}</span>
                </div>
                <div class="bg-background/60 p-1.5 rounded-lg border border-border/30">
                  <span class="text-[10px] text-amber-500 font-semibold block">Quincenal</span>
                  <span class="font-mono text-xs font-bold text-amber-500">{{ formatCurrency(getVehicleProj(vehicle).biweeklyExpense) }}</span>
                </div>
                <div class="bg-background/60 p-1.5 rounded-lg border border-border/30">
                  <span class="text-[10px] text-muted-foreground block">Mensual</span>
                  <span class="font-mono text-xs font-bold text-red-500">{{ formatCurrency(getVehicleProj(vehicle).monthlyExpense) }}</span>
                </div>
              </div>

              <div class="flex justify-between text-[11px] text-muted-foreground font-mono pt-1">
                <span>Uso: ~{{ getVehicleProj(vehicle).dailyKm }} km/d</span>
                <span>Costo: {{ getVehicleProj(vehicle).costPerKm > 0 ? `${formatCurrency(getVehicleProj(vehicle).costPerKm)}/km` : 'N/A' }}</span>
              </div>

              <p v-if="getVehicleProj(vehicle).isStale" class="text-[10px] text-rose-500 pt-1 italic border-t border-border/20">
                * Excluido del Burn Rate activo porque lleva más de 1 mes sin recargas.
              </p>
            </div>
          </div>

          <!-- Botón Registrar Carga Rápida -->
          <button 
            @click="openNewLogModal(vehicle.id)" 
            class="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-medium py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus class="w-3.5 h-3.5" />
            Registrar Carga para este auto
          </button>
        </div>
      </div>
    </div>

    <!-- Historial de Cargas de Combustible -->
    <div class="bg-card border border-border/40 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-serif font-bold">Historial de Cargas de Combustible</h2>
          <p class="text-xs text-muted-foreground">Registro de recargas con telemetría de odómetro y precio por litro.</p>
        </div>
        
        <div class="flex items-center gap-2">
          <select v-model="filterVehicleId" class="text-xs bg-secondary border border-border rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none">
            <option value="all">Todos los vehículos</option>
            <option v-for="v in financeStore.vehicles" :key="v.id" :value="String(v.id)">{{ v.name }}</option>
          </select>
        </div>
      </div>

      <div v-if="filteredFuelLogs.length === 0" class="text-center py-8 text-sm text-muted-foreground">
        No hay registros de combustible para mostrar.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs text-muted-foreground border-b border-border/40 uppercase">
            <tr>
              <th class="py-3 px-3">Fecha</th>
              <th class="py-3 px-3">Vehículo</th>
              <th class="py-3 px-3">Odómetro</th>
              <th class="py-3 px-3">Litros</th>
              <th class="py-3 px-3">Precio / L</th>
              <th class="py-3 px-3 text-right">Costo Total</th>
              <th class="py-3 px-3 text-center">Tanque</th>
              <th class="py-3 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/30">
            <tr v-for="log in filteredFuelLogs" :key="log.id" class="hover:bg-secondary/20 transition-colors">
              <td class="py-3 px-3 font-mono text-xs whitespace-nowrap">
                {{ formatDate(log.date) }}
              </td>
              <td class="py-3 px-3 font-medium">
                {{ log.vehicleName }}
              </td>
              <td class="py-3 px-3 font-mono">
                {{ Number(log.odometer).toLocaleString() }} km
              </td>
              <td class="py-3 px-3 font-mono">
                {{ Number(log.liters).toFixed(2) }} L
              </td>
              <td class="py-3 px-3 font-mono text-xs text-muted-foreground">
                ${{ Number(log.pricePerLiter).toFixed(2) }}
              </td>
              <td class="py-3 px-3 font-mono font-bold text-right text-amber-500 whitespace-nowrap">
                {{ formatCurrency(log.totalCost) }}
              </td>
              <td class="py-3 px-3 text-center">
                <span v-if="log.isFullTank" class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium whitespace-nowrap">
                  Lleno
                </span>
                <span v-else class="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  Parcial
                </span>
              </td>
              <td class="py-3 px-3 text-right">
                <button 
                  @click="deleteLogWithConfirm(log.id)" 
                  class="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors"
                  title="Eliminar registro"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Vehículo (Nuevo / Editar) -->
    <div v-if="showVehicleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-blue-500/10">
        <button @click="showVehicleModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">{{ isEditingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h2>
        <form @submit.prevent="submitVehicle" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre (ej. Mi Coche)</label>
            <input v-model="newVehicle.name" required type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Nombre identificador" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Marca</label>
              <input v-model="newVehicle.make" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Toyota, Ford..." />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Modelo</label>
              <input v-model="newVehicle.model" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Corolla..." />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Año</label>
              <input v-model="newVehicle.year" type="number" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="2020" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Placas</label>
              <input v-model="newVehicle.plate" type="text" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="ABC-123" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Capacidad de Tanque (L) (Opcional)</label>
            <input v-model="newVehicle.tankCapacity" type="number" step="0.1" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="45.0" />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white rounded-xl py-3 font-bold mt-6 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            {{ isEditingVehicle ? 'Guardar Cambios' : 'Guardar Vehículo' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Carga Combustible -->
    <div v-if="showLogModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl relative shadow-primary/10">
        <button @click="showLogModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-2xl font-serif font-bold mb-6">Registrar Carga de Combustible</h2>
        
        <div v-if="financeStore.vehicles.length === 0" class="text-center text-muted-foreground mb-4">
          Primero debes registrar un vehículo.
        </div>
        
        <form v-else @submit.prevent="submitFuelLog" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Vehículo</label>
            <select v-model="newLog.vehicleId" required class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="" disabled>Selecciona un vehículo</option>
              <option v-for="v in financeStore.vehicles" :key="v.id" :value="String(v.id)">{{ v.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Fecha</label>
            <input v-model="newLog.date" required type="date" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Odómetro actual (km)</label>
            <input v-model.number="newLog.odometer" required type="number" step="0.1" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Litros</label>
              <input v-model.number="newLog.liters" @input="updateTotal" required type="number" step="0.01" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Precio x L ($)</label>
              <input v-model.number="newLog.pricePerLiter" @input="updateTotal" required type="number" step="0.01" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Costo Total ($)</label>
            <input v-model.number="newLog.totalCost" required type="number" step="0.01" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descontar de Cuenta (Opcional)</label>
            <select v-model="newLog.accountId" class="w-full rounded-xl border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="">No registrar gasto en cuenta</option>
              <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">{{ acc.name }} (${{ acc.balance }})</option>
            </select>
          </div>
          <label class="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-secondary/20 transition-colors mt-2">
            <input v-model="newLog.isFullTank" type="checkbox" class="w-5 h-5 rounded text-primary focus:ring-primary" />
            <span class="font-medium text-sm">Tanque lleno</span>
          </label>

          <button type="submit" class="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold mt-6 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Guardar Carga
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFinanceStore, type Vehicle } from '~/stores/finance'
import { useConfirmStore } from '~/stores/confirm'
import { 
  Car, 
  Fuel, 
  Gauge, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight 
} from 'lucide-vue-next'

const financeStore = useFinanceStore()
const confirmStore = useConfirmStore()
const route = useRoute()

const showVehicleModal = ref(false)
const showLogModal = ref(false)
const isEditingVehicle = ref(false)
const editingVehicleId = ref<number | null>(null)
const filterVehicleId = ref<string>('all')
const selectedFleetVehicleId = ref<string>('all')

const newVehicle = ref({
  name: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  tankCapacity: null as number | null
})

const newLog = ref({
  vehicleId: '',
  accountId: '' as string | number,
  date: new Date().toISOString().split('T')[0],
  odometer: 0,
  liters: 0,
  pricePerLiter: 0,
  totalCost: 0,
  isFullTank: true
})

onMounted(async () => {
  await financeStore.initialize()
  if (route.query.action === 'new_fuel') {
    showLogModal.value = true
  }
})

const projections = computed(() => {
  return financeStore.gasolineProjections
})

const currentViewProj = computed(() => {
  if (selectedFleetVehicleId.value === 'all') {
    return {
      isAll: true,
      name: 'Toda la Flota (Autos Activos)',
      dailyExpense: projections.value.totalDaily,
      weeklyExpense: projections.value.totalWeekly,
      biweeklyExpense: projections.value.totalBiweekly,
      monthlyExpense: projections.value.totalMonthly,
      dailyLiters: projections.value.totalDailyLiters,
      dailyKm: projections.value.totalDailyKm,
      monthlyKm: projections.value.totalMonthlyKm,
      costPerKm: projections.value.avgCostPerKm,
      efficiency: projections.value.avgEfficiencyKmPerLiter,
      isStale: false,
      isActiveInBudget: projections.value.activeVehiclesCount > 0,
      activeCount: projections.value.activeVehiclesCount,
      inactiveCount: projections.value.inactiveVehiclesCount,
      daysSinceLastRefill: null
    }
  }

  const p = projections.value.vehicles.find(v => String(v.vehicleId) === selectedFleetVehicleId.value)
  if (!p) {
    return {
      isAll: false,
      name: '',
      dailyExpense: 0,
      weeklyExpense: 0,
      biweeklyExpense: 0,
      monthlyExpense: 0,
      dailyLiters: 0,
      dailyKm: 0,
      monthlyKm: 0,
      costPerKm: 0,
      efficiency: 0,
      isStale: false,
      isActiveInBudget: false,
      activeCount: 0,
      inactiveCount: 0,
      daysSinceLastRefill: null
    }
  }

  return {
    isAll: false,
    name: p.vehicleName,
    dailyExpense: p.dailyExpense,
    weeklyExpense: p.weeklyExpense,
    biweeklyExpense: p.biweeklyExpense,
    monthlyExpense: p.monthlyExpense,
    dailyLiters: p.dailyLiters,
    dailyKm: p.dailyKm,
    monthlyKm: p.monthlyKm,
    costPerKm: p.costPerKm,
    efficiency: p.kmPerLiter,
    isStale: p.isStale,
    isActiveInBudget: p.isActiveInBudget,
    activeCount: p.isActiveInBudget ? 1 : 0,
    inactiveCount: p.isStale ? 1 : 0,
    daysSinceLastRefill: p.daysSinceLastRefill
  }
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

const openNewVehicle = () => {
  isEditingVehicle.value = false
  editingVehicleId.value = null
  newVehicle.value = { name: '', make: '', model: '', year: new Date().getFullYear(), plate: '', tankCapacity: null }
  showVehicleModal.value = true
}

const openEditVehicle = (vehicle: Vehicle) => {
  isEditingVehicle.value = true
  editingVehicleId.value = vehicle.id
  newVehicle.value = {
    name: vehicle.name,
    make: vehicle.make || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    plate: vehicle.plate || '',
    tankCapacity: vehicle.tankCapacity ?? null
  }
  showVehicleModal.value = true
}

const openNewLogModal = (preselectedVehicleId?: number) => {
  newLog.value = {
    vehicleId: preselectedVehicleId ? String(preselectedVehicleId) : (financeStore.vehicles[0] ? String(financeStore.vehicles[0].id) : ''),
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    odometer: preselectedVehicleId ? getLastOdometerById(preselectedVehicleId) : 0,
    liters: 0,
    pricePerLiter: 0,
    totalCost: 0,
    isFullTank: true
  }
  showLogModal.value = true
}

const submitVehicle = async () => {
  if (isEditingVehicle.value && editingVehicleId.value) {
    await financeStore.updateVehicle(editingVehicleId.value, { ...newVehicle.value })
  } else {
    await financeStore.addVehicle({ ...newVehicle.value })
  }
  showVehicleModal.value = false
  newVehicle.value = { name: '', make: '', model: '', year: new Date().getFullYear(), plate: '', tankCapacity: null }
}

const updateTotal = () => {
  if (newLog.value.liters && newLog.value.pricePerLiter) {
    newLog.value.totalCost = parseFloat((newLog.value.liters * newLog.value.pricePerLiter).toFixed(2))
  }
}

const submitFuelLog = async () => {
  const selectedVehicle = financeStore.vehicles.find(v => v.id === Number(newLog.value.vehicleId))
  if (selectedVehicle && selectedVehicle.tankCapacity && newLog.value.liters > selectedVehicle.tankCapacity) {
    const ok = await confirmStore.ask({
      title: 'Capacidad excedida',
      message: `Has registrado ${newLog.value.liters}L, pero la capacidad del tanque es de solo ${selectedVehicle.tankCapacity}L. ¿Deseas continuar?`,
      confirmLabel: 'Continuar',
      destructive: true
    })
    if (!ok) return
  }

  const success = await financeStore.addFuelLog({
    vehicleId: Number(newLog.value.vehicleId),
    odometer: Number(newLog.value.odometer),
    liters: Number(newLog.value.liters),
    pricePerLiter: Number(newLog.value.pricePerLiter),
    totalCost: Number(newLog.value.totalCost),
    date: newLog.value.date,
    accountId: newLog.value.accountId ? Number(newLog.value.accountId) : null,
    isFullTank: Boolean(newLog.value.isFullTank)
  })

  if (success) {
    showLogModal.value = false
    newLog.value = {
      vehicleId: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      odometer: 0,
      liters: 0,
      pricePerLiter: 0,
      totalCost: 0,
      isFullTank: true
    }
  }
}

const deleteLogWithConfirm = async (logId: number) => {
  const ok = await confirmStore.ask({
    title: 'Eliminar Carga de Combustible',
    message: '¿Estás seguro de que deseas eliminar este registro de carga? Esta acción recalculará tu telemetría y proyecciones.',
    confirmLabel: 'Eliminar',
    destructive: true
  })
  if (!ok) return

  await financeStore.deleteFuelLog(logId)
}

const getLastOdometer = (vehicle: Vehicle) => {
  if (!vehicle.fuelLogs || vehicle.fuelLogs.length === 0) return 0
  const sortedLogs = [...vehicle.fuelLogs].sort((a, b) => b.odometer - a.odometer)
  return sortedLogs[0].odometer
}

const getLastOdometerById = (vehicleId: number) => {
  const v = financeStore.vehicles.find(item => item.id === vehicleId)
  return v ? getLastOdometer(v) : 0
}

const calculateEfficiency = (vehicle: Vehicle) => {
  if (!vehicle.fuelLogs || vehicle.fuelLogs.length < 2) return 'N/A'
  
  const sortedLogs = [...vehicle.fuelLogs].sort((a, b) => a.odometer - b.odometer)
  const lastLog = sortedLogs[sortedLogs.length - 1]
  const prevLog = sortedLogs[sortedLogs.length - 2]
  
  const distance = lastLog.odometer - prevLog.odometer
  const liters = lastLog.liters
  
  if (liters === 0 || distance <= 0) return 'N/A'
  return (distance / liters).toFixed(2)
}

const getVehicleProj = (vehicle: Vehicle) => {
  return projections.value.vehicles.find(p => p.vehicleId === vehicle.id) || {
    dailyExpense: 0,
    weeklyExpense: 0,
    biweeklyExpense: 0,
    monthlyExpense: 0,
    dailyLiters: 0,
    dailyKm: 0,
    costPerKm: 0,
    kmPerLiter: 0,
    logsCount: 0,
    isPreliminary: false,
    daysSinceLastRefill: null,
    lastRefillDate: null,
    isStale: false,
    isActiveInBudget: false
  }
}

const getVehicleLogsCount = (vehicle: Vehicle) => {
  return vehicle.fuelLogs ? vehicle.fuelLogs.length : 0
}

const getVehicleAutonomy = (vehicle: Vehicle) => {
  const proj = getVehicleProj(vehicle)
  if (vehicle.tankCapacity && proj.kmPerLiter > 0) {
    return Math.round(Number(vehicle.tankCapacity) * proj.kmPerLiter)
  }
  return null
}

const filteredFuelLogs = computed(() => {
  const logsList: Array<any> = []
  financeStore.vehicles.forEach(v => {
    if (v.fuelLogs) {
      v.fuelLogs.forEach(l => {
        logsList.push({
          ...l,
          vehicleName: v.name,
          vehiclePlate: v.plate
        })
      })
    }
  })

  let filtered = logsList
  if (filterVehicleId.value !== 'all') {
    filtered = filtered.filter(l => String(l.vehicleId) === filterVehicleId.value)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.odometer - a.odometer)
})
</script>
