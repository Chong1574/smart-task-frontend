<template>
  <div class="min-h-screen lg:h-screen lg:max-h-screen bg-background text-foreground flex flex-col items-center justify-between p-3 sm:p-4 lg:px-8 lg:py-4 relative selection:bg-primary/20 overflow-y-auto lg:overflow-hidden">
    
    <!-- Volver a Taskman -->
    <NuxtLink to="/taskman" class="absolute top-3 left-4 md:top-4 md:left-6 text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors z-20 text-xs md:text-sm font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      <span>Volver a Taskman</span>
    </NuxtLink>

    <ClientOnly>
      <div class="w-full max-w-7xl flex flex-col items-center justify-between flex-1 min-h-0 animate-in fade-in duration-500 pt-6 lg:pt-0">
        
        <!-- Header Ejecutivo: Reloj Compacto, Saludo y Pulso del Día -->
        <header class="text-center mb-2.5 lg:mb-3.5 w-full max-w-4xl shrink-0">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-orange-500 to-amber-500 tracking-tight leading-none mb-1">
            {{ currentTime || '--:--' }}
          </h1>
          <h2 class="text-xl md:text-2xl font-medium text-foreground tracking-tight">
            {{ greeting }}<span v-if="firstName">, {{ firstName }}</span>
          </h2>
          <p class="text-xs text-muted-foreground font-serif capitalize mb-2">
            {{ currentDate }}
          </p>

          <!-- Pulso Ejecutivo del Día (KPIs Rápidos) -->
          <div class="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 text-[11px] md:text-xs">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/60 border border-border/50 text-foreground font-medium shadow-xs backdrop-blur-md">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {{ agendaItems.length }} en agenda ({{ hoursInEvents }}h)
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/60 border border-border/50 text-foreground font-medium shadow-xs backdrop-blur-md">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ hoursFreeFocus }}h libres para foco
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/60 border border-border/50 text-foreground font-medium shadow-xs backdrop-blur-md">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {{ totalPriorityCount }} {{ totalPriorityCount === 1 ? 'prioridad' : 'prioridades' }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/60 border border-border/50 text-foreground font-medium shadow-xs backdrop-blur-md">
              <span class="w-1.5 h-1.5 rounded-full" :class="financialRadar.status === 'healthy' ? 'bg-emerald-500' : 'bg-destructive'"></span>
              ${{ Math.round(financialRadar.totalDue7Days).toLocaleString('es-MX') }} a pagar (7d)
            </span>
          </div>
        </header>

        <!-- Grid Principal (3 Columnas Ejecutivas Balanceadas) -->
        <main class="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 items-stretch flex-1 min-h-0">
          
          <!-- COLUMNA 1: Mi Jornada (Agenda Inteligente & Proyectos Activos) -->
          <section class="flex flex-col gap-3 md:gap-4 min-h-0">
            <!-- Agenda del Día -->
            <div class="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-4 md:p-5 shadow-xl relative overflow-hidden flex flex-col gap-2.5 flex-1 min-h-0">
              <div class="flex items-center justify-between shrink-0">
                <h3 class="text-base md:text-lg font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  Agenda del Día
                </h3>
                <span class="text-[11px] text-muted-foreground font-medium">
                  {{ agendaItems.length }} {{ agendaItems.length === 1 ? 'actividad' : 'actividades' }}
                </span>
              </div>

              <!-- Banner de Disponibilidad & Evento Actual/Siguiente -->
              <div class="p-2.5 rounded-xl border text-xs shrink-0" :class="immediateEventContext.themeClass">
                <div class="flex items-center gap-2 font-semibold">
                  <span class="relative flex h-2 w-2">
                    <span v-if="immediateEventContext.isActive" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2" :class="immediateEventContext.dotClass"></span>
                  </span>
                  <span>{{ immediateEventContext.label }}</span>
                </div>
                <p v-if="immediateEventContext.title" class="text-foreground/90 font-medium mt-0.5 truncate">
                  {{ immediateEventContext.title }}
                  <span v-if="immediateEventContext.time" class="text-muted-foreground font-normal ml-1">({{ immediateEventContext.time }})</span>
                </p>
                <p v-else class="text-muted-foreground mt-0.5 text-[11px]">
                  {{ immediateEventContext.subtext }}
                </p>
              </div>

              <!-- Medidor Visual de Disponibilidad -->
              <div class="bg-background/40 border border-border/40 rounded-xl p-2.5 text-xs space-y-1 shrink-0">
                <div class="flex justify-between text-muted-foreground font-medium text-[11px]">
                  <span>Carga del Día</span>
                  <span>{{ hoursInEvents }}h ocupadas / {{ hoursFreeFocus }}h libres</span>
                </div>
                <div class="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden flex">
                  <div 
                    class="bg-blue-500 transition-all duration-500 rounded-l-full" 
                    :style="{ width: `${dayLoadPercentage}%` }"
                    :title="`Eventos: ${hoursInEvents}h`"
                  ></div>
                  <div 
                    class="bg-emerald-500/80 transition-all duration-500 rounded-r-full" 
                    :style="{ width: `${100 - dayLoadPercentage}%` }"
                    :title="`Libre: ${hoursFreeFocus}h`"
                  ></div>
                </div>
              </div>

              <!-- Lista de la Agenda / Timeline -->
              <div v-if="taskStore.loading || calendarLoading" class="space-y-2 py-2 flex-1">
                <div v-for="i in 2" :key="i" class="h-10 bg-muted/40 rounded-xl animate-pulse"></div>
              </div>
              <div v-else-if="agendaItems.length === 0" class="text-center py-4 text-muted-foreground text-xs flex-1 flex flex-col justify-center">
                <p class="font-medium text-foreground/80">Sin eventos agendados para hoy</p>
                <p class="text-[11px] text-muted-foreground/70 mt-0.5">Día completamente libre para foco autónomo.</p>
              </div>
              <div v-else class="space-y-2 max-h-[140px] overflow-y-auto pr-1 flex-1">
                <NuxtLink 
                  v-for="item in agendaItems" 
                  :key="item.key" 
                  :to="item.href" 
                  class="block p-2 rounded-xl bg-background/50 border transition-all hover:border-primary/50 group"
                  :class="item.isCurrent ? 'border-primary ring-1 ring-primary/30 shadow-xs' : item.isPast ? 'border-border/30 opacity-60' : 'border-border/50'"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span v-if="item.kind === 'event'" class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          GCal
                        </span>
                        <span v-else-if="item.kind === 'wishlist'" class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                          Deseo
                        </span>
                        <span v-else class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                          Tarea
                        </span>
                        <span v-if="item.isCurrent" class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Ahora
                        </span>
                        <h4 class="font-medium text-xs leading-tight text-foreground truncate group-hover:text-primary transition-colors">
                          {{ item.title }}
                        </h4>
                      </div>
                    </div>
                    <span v-if="item.time" class="text-[10px] text-muted-foreground shrink-0 font-medium whitespace-nowrap">
                      {{ item.time }}
                    </span>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Proyectos Activos (Visibles en Columna 1) -->
            <div class="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-3.5 md:p-4 shadow-xl shrink-0">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs md:text-sm font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Proyectos Activos
                </h3>
                <NuxtLink to="/taskman/projects" class="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                  Ver todos &rarr;
                </NuxtLink>
              </div>
              <div v-if="activeProjects.length === 0" class="text-xs text-muted-foreground py-2 text-center">
                Sin proyectos activos actualmente.
              </div>
              <div v-else class="space-y-1.5">
                <NuxtLink 
                  v-for="project in activeProjects.slice(0, 3)" 
                  :key="project.id" 
                  to="/taskman/projects" 
                  class="flex items-center justify-between p-2 rounded-xl bg-background/50 border border-border/40 hover:border-primary/40 transition-colors group"
                >
                  <span class="text-xs font-medium text-foreground truncate pr-2 group-hover:text-primary transition-colors">{{ project.name }}</span>
                  <span class="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-md font-semibold shrink-0">Activo</span>
                </NuxtLink>
              </div>
            </div>
          </section>

          <!-- COLUMNA 2: Foco Ejecutivo (The One Thing & Hábitos Accionables) -->
          <section class="flex flex-col gap-3 md:gap-4 min-h-0">
            
            <!-- The One Thing: Prioridad Crítica del Día -->
            <div class="bg-gradient-to-br from-card/60 via-card/40 to-primary/5 backdrop-blur-xl border-2 border-primary/30 rounded-3xl p-4 md:p-5 shadow-xl relative overflow-hidden shrink-0">
              <div class="flex items-center justify-between mb-2">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  The One Thing
                </span>
                <span v-if="theOneThing?.priority" class="text-[10px] font-bold uppercase tracking-wider text-destructive">
                  Prioridad Alta
                </span>
              </div>

              <div v-if="theOneThing" class="space-y-2">
                <div class="flex items-start gap-2.5">
                  <button 
                    type="button" 
                    @click="handleToggleTask(theOneThing, $event)" 
                    class="mt-0.5 w-5 h-5 rounded-md border-2 border-primary/60 hover:bg-primary/20 flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Marcar como completada"
                  >
                    <svg v-if="theOneThing.status === 'completed'" class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm md:text-base font-semibold text-foreground leading-snug">
                      {{ theOneThing.title }}
                    </h4>
                    <p v-if="theOneThing.description" class="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {{ theOneThing.description }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
                  <span v-if="theOneThing.duration_minutes">⏱️ {{ theOneThing.duration_minutes }} min</span>
                  <span v-else>🎯 Foco principal</span>
                  <NuxtLink to="/taskman/activities" class="text-primary hover:underline font-medium">
                    Ver en Actividades &rarr;
                  </NuxtLink>
                </div>
              </div>

              <div v-else class="text-center py-4 text-muted-foreground">
                <p class="text-xs font-medium text-foreground/80">✨ ¡Foco despejado!</p>
                <p class="text-[11px] mt-0.5">No hay tareas de alta prioridad pendientes por hoy.</p>
              </div>
            </div>

            <!-- Otras Prioridades Activas -->
            <div v-if="secondaryPriorityTasks.length > 0" class="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-3 md:p-3.5 shadow-xl shrink-0">
              <h3 class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                <span>Otras Prioridades</span>
                <span class="text-[10px] font-normal">({{ secondaryPriorityTasks.length }})</span>
              </h3>
              <div class="space-y-1.5">
                <div 
                  v-for="task in secondaryPriorityTasks.slice(0, 3)" 
                  :key="task.id" 
                  class="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-background/50 border border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    <button 
                      type="button" 
                      @click="handleToggleTask(task, $event)" 
                      class="w-4 h-4 rounded border border-border hover:border-primary flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <svg v-if="task.status === 'completed'" class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                    <span class="text-xs font-medium text-foreground truncate" :class="{ 'line-through text-muted-foreground': task.status === 'completed' }">
                      {{ task.title }}
                    </span>
                  </div>
                  <span v-if="task.duration_minutes" class="text-[10px] text-muted-foreground shrink-0 font-medium">
                    {{ task.duration_minutes }}m
                  </span>
                </div>
              </div>
            </div>

            <!-- Hábitos del Día (Accionables con 1 Clic + Racha) -->
            <div class="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-3.5 md:p-4 shadow-xl flex-1 flex flex-col justify-between min-h-0">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xs md:text-sm font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Hábitos Diarios
                  </h3>
                  <span class="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {{ completedHabitsCount }} / {{ activeHabits.length }}
                  </span>
                </div>

                <!-- Mini barra de progreso de hábitos -->
                <div class="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden mb-2.5">
                  <div 
                    class="bg-primary h-full transition-all duration-300 rounded-full" 
                    :style="{ width: `${habitsProgressPercentage}%` }"
                  ></div>
                </div>
              </div>

              <div v-if="activeHabits.length === 0" class="text-xs text-muted-foreground py-2 text-center">
                Sin hábitos configurados.
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 overflow-y-auto max-h-[160px] pr-0.5">
                <button 
                  v-for="habit in activeHabits" 
                  :key="habit.id" 
                  type="button"
                  @click="handleToggleHabit(habit, $event)"
                  class="flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer group"
                  :class="isHabitDoneToday(habit) 
                    ? 'bg-primary/10 border-primary/30 text-foreground' 
                    : 'bg-background/50 border-border/40 hover:border-primary/40 text-muted-foreground hover:text-foreground'"
                >
                  <div class="flex items-center gap-1.5 min-w-0 pr-1">
                    <span 
                      class="w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0"
                      :class="isHabitDoneToday(habit) ? 'bg-primary border-primary text-primary-foreground' : 'border-border/60 group-hover:border-primary'"
                    >
                      <svg v-if="isHabitDoneToday(habit)" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span class="text-xs font-medium truncate" :class="{ 'line-through text-muted-foreground': isHabitDoneToday(habit) }">
                      {{ habit.name }}
                    </span>
                  </div>
                  <span v-if="getHabitStreak(habit) > 0" class="text-[10px] font-semibold text-amber-500 shrink-0 flex items-center gap-0.5" title="Racha consecutiva">
                    🔥{{ getHabitStreak(habit) }}
                  </span>
                </button>
              </div>
            </div>

          </section>

          <!-- COLUMNA 3: Radar Financiero (7 Días) & Frase del Día -->
          <section class="flex flex-col gap-3 md:gap-4 min-h-0">
            
            <!-- Radar Financiero: Próximos 7 Días vs Liquidez -->
            <div class="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-4 md:p-5 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-0">
              <div>
                <div class="flex items-center justify-between mb-2.5">
                  <h3 class="text-xs md:text-sm font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    Radar Financiero (7d)
                  </h3>
                  <span 
                    class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    :class="financialRadar.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'"
                  >
                    {{ financialRadar.status === 'healthy' ? '🛡️ Cubierto' : '⚠️ Atención' }}
                  </span>
                </div>

                <!-- Comparativa Visual: Requerido vs Saldo Disponible -->
                <div class="grid grid-cols-2 gap-2 mb-2.5">
                  <div class="p-2.5 rounded-xl bg-background/50 border border-border/40">
                    <span class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">A Pagar (7d)</span>
                    <span class="text-sm md:text-base font-bold text-destructive">
                      ${{ financialRadar.totalDue7Days.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </span>
                    <span class="text-[9px] text-muted-foreground block">
                      {{ financialRadar.items7Days.length }} {{ financialRadar.items7Days.length === 1 ? 'compromiso' : 'compromisos' }}
                    </span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-background/50 border border-border/40">
                    <span class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Disponible</span>
                    <span class="text-sm md:text-base font-bold text-foreground">
                      ${{ financialRadar.availableBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </span>
                    <span class="text-[9px] text-muted-foreground block">Cuentas líquidas</span>
                  </div>
                </div>

                <!-- Diagnóstico de Cobertura -->
                <div class="text-[11px] p-2 rounded-xl border mb-2 font-medium" :class="financialRadar.status === 'healthy' ? 'bg-emerald-500/5 text-emerald-500/90 border-emerald-500/20' : 'bg-destructive/5 text-destructive border-destructive/20'">
                  <p v-if="financialRadar.status === 'healthy'">
                    ✓ Cobertura del {{ financialRadar.coveragePct }}%. Margen libre: +${{ Math.round(financialRadar.buffer).toLocaleString('es-MX') }} MXN.
                  </p>
                  <p v-else>
                    Faltan ${{ Math.round(Math.abs(financialRadar.buffer)).toLocaleString('es-MX') }} MXN para cubrir compromisos de la semana.
                  </p>
                </div>

                <!-- Lista de Vencimientos Inmediatos -->
                <div class="space-y-1.5 max-h-[130px] overflow-y-auto pr-1">
                  <NuxtLink 
                    v-for="(p, idx) in financialRadar.displayItems.slice(0, 3)" 
                    :key="`${p.name}-${idx}`"
                    to="/taskman/wallet"
                    class="flex items-center justify-between p-2 rounded-xl bg-background/40 border border-border/40 hover:border-primary/40 transition-colors group"
                  >
                    <div class="min-w-0 pr-2">
                      <p class="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{{ p.name }}</p>
                      <span 
                        class="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5"
                        :class="p.daysRemaining === 0 ? 'bg-destructive/15 text-destructive' : p.daysRemaining === 1 ? 'bg-amber-500/15 text-amber-500' : 'text-muted-foreground'"
                      >
                        {{ p.urgencyLabel }}
                      </span>
                    </div>
                    <span class="text-xs font-bold shrink-0 text-destructive">
                      ${{ Number(p.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </span>
                  </NuxtLink>
                </div>
              </div>

              <div class="pt-2 border-t border-border/40 text-right shrink-0">
                <NuxtLink to="/taskman/wallet" class="text-xs text-primary hover:underline font-medium">
                  Ir a Billetera &rarr;
                </NuxtLink>
              </div>
            </div>

            <!-- La Frase del Día / Cita Inspiradora: PROMINENTE Y TOTALMENTE VISIBLE -->
            <div class="p-3.5 md:p-4 rounded-3xl bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent border border-primary/20 text-center shadow-lg relative overflow-hidden shrink-0 flex flex-col justify-center items-center">
              <div class="flex items-center gap-1.5 text-primary/70 text-[10px] font-bold uppercase tracking-widest mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z"/></svg>
                <span>Frase del Día</span>
              </div>
              <p class="text-xs md:text-sm font-serif italic text-foreground/90 leading-relaxed max-w-sm">
                "{{ dailyQuote }}"
              </p>
            </div>

          </section>

        </main>
      </div>

      <!-- Fallback de Carga Skeleton -->
      <template #fallback>
        <div class="w-full max-w-7xl flex flex-col items-center justify-center p-8 space-y-10">
          <div class="space-y-3 flex flex-col items-center">
            <div class="h-20 w-64 bg-muted/40 rounded-3xl animate-pulse"></div>
            <div class="h-6 w-48 bg-muted/30 rounded-xl animate-pulse"></div>
          </div>
          <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="h-96 bg-muted/20 border border-border/30 rounded-3xl animate-pulse"></div>
            <div class="h-96 bg-muted/20 border border-border/30 rounded-3xl animate-pulse"></div>
            <div class="h-96 bg-muted/20 border border-border/30 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </template>
    </ClientOnly>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore, type Habit, type Task } from '~/stores/tasks'
import { useAuthStore } from '~/stores/auth'
import { useFinanceStore } from '~/stores/finance'
import api from '~/utils/api'
import confetti from 'canvas-confetti'

definePageMeta({
  layout: false
})

const taskStore = useTaskStore()
const authStore = useAuthStore()
const financeStore = useFinanceStore()

const currentTime = ref('')
const currentDate = ref('')
const greeting = ref('')
let timer: ReturnType<typeof setInterval>

const quotes = [
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "La disciplina es el puente entre tus metas y tus logros.",
  "No cuentes los días, haz que los días cuenten.",
  "La mejor forma de predecir el futuro es creándolo.",
  "Lo que haces hoy puede mejorar todas tus mañanas.",
  "Si quieres resultados distintos, no hagas siempre lo mismo.",
  "El momento que da más miedo es siempre justo antes de empezar.",
  "El secreto de salir adelante es empezar.",
  "Un viaje de mil millas comienza con un solo paso.",
  "Las oportunidades no ocurren, las creas tú.",
  "No mires el reloj; haz lo que él hace. Sigue moviéndote.",
  "La única forma de hacer un gran trabajo es amar lo que haces.",
  "Sé tan bueno que no puedan ignorarte.",
  "Cree que puedes y ya estarás a medio camino.",
  "La motivación te hace empezar. El hábito te mantiene en marcha.",
  "Si te caes siete veces, levántate ocho.",
  "El futuro pertenece a aquellos que creen en la belleza de sus sueños.",
  "Todo lo que siempre has querido está al otro lado del miedo.",
  "No te detengas cuando estés cansado, detente cuando hayas terminado.",
  "La acción es la clave fundamental de todo éxito.",
  "Haz de cada día tu obra maestra.",
  "Incluso la noche más oscura terminará y saldrá el sol.",
  "Tu actitud, no tu aptitud, determinará tu altitud.",
  "Si puedes soñarlo, puedes hacerlo.",
  "No busques los errores, busca un remedio.",
  "Da siempre lo mejor que tienes. Lo que plantes ahora, lo cosecharás más tarde.",
  "La calidad no es un acto, es un hábito.",
  "Hazlo o no lo hagas, pero no lo intentes.",
  "La energía y la persistencia conquistan todas las cosas.",
  "El pesimista ve dificultad en toda oportunidad. El optimista ve oportunidad en toda dificultad."
]

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const dailyQuote = computed(() => {
  return quotes[getDayOfYear() % quotes.length]
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
  currentDate.value = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase())
  
  const hour = now.getHours()
  if (hour >= 5 && hour < 12) {
    greeting.value = 'Buenos días'
  } else if (hour >= 12 && hour < 20) {
    greeting.value = 'Buenas tardes'
  } else {
    greeting.value = 'Buenas noches'
  }
}

const firstName = computed(() => {
  const raw = (authStore.user?.name || '').trim()
  return raw ? raw.split(/\s+/)[0] : ''
})

// --- Google Calendar & Agenda ---
const calendarEvents = ref<any[]>([])
const calendarLoading = ref(false)

async function fetchTodayEvents() {
  if (!authStore.hasCalendarConnected) return
  calendarLoading.value = true
  try {
    const res = await api.get('/oauth/google/events')
    calendarEvents.value = res.data?.data || []
  } catch {
    calendarEvents.value = []
  } finally {
    calendarLoading.value = false
  }
}

interface AgendaItem {
  key: string;
  kind: 'event' | 'task' | 'wishlist';
  title: string;
  time: string;
  sortTs: number;
  endTs: number;
  href: string;
  isCurrent?: boolean;
  isPast?: boolean;
}

const todayTasks = computed(() => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  return taskStore.tasks.filter(t => {
    if (t.status !== 'pending' && t.status !== 'in_progress') return false;
    if (!t.deadline) return false;
    const d = new Date(t.deadline);
    const localDateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return localDateStr === todayStr;
  })
})

const agendaItems = computed<AgendaItem[]>(() => {
  const now = new Date();
  const nowTs = now.getTime();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = start + 24 * 3600 * 1000;
  const items: AgendaItem[] = [];

  for (const t of todayTasks.value) {
    const ts = t.deadline ? new Date(t.deadline).getTime() : start;
    const durationMin = t.duration_minutes || 30;
    const endTs = ts + durationMin * 60000;
    items.push({
      key: `t-${t.id}`,
      kind: 'task',
      title: t.title,
      time: t.deadline ? new Date(t.deadline).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '',
      sortTs: ts,
      endTs,
      href: '/taskman/activities',
      isCurrent: nowTs >= ts && nowTs <= endTs,
      isPast: nowTs > endTs,
    });
  }

  for (const ev of calendarEvents.value) {
    const startRaw = ev.start?.dateTime || ev.start?.date;
    const endRaw = ev.end?.dateTime || ev.end?.date;
    if (!startRaw) continue;
    const startDate = new Date(startRaw);
    const endDate = endRaw ? new Date(endRaw) : new Date(startDate.getTime() + 3600000);
    const ts = startDate.getTime();
    const endTs = endDate.getTime();
    if (ts < start || ts >= end) continue;
    const isAllDay = !ev.start?.dateTime;
    items.push({
      key: `e-${ev.id}`,
      kind: 'event',
      title: ev.summary || '(sin título)',
      time: isAllDay ? 'Todo el día' : startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      sortTs: ts,
      endTs,
      href: '/taskman/activities',
      isCurrent: !isAllDay && nowTs >= ts && nowTs <= endTs,
      isPast: !isAllDay && nowTs > endTs,
    });
  }

  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  for (const w of financeStore.wishlistItems) {
    if (!w.targetDate || w.status === 'purchased') continue;
    const d = new Date(w.targetDate);
    const wDateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (wDateStr === todayStr) {
      items.push({
        key: `w-${w.id}`,
        kind: 'wishlist',
        title: `Comprar: ${w.name}`,
        time: 'Hoy',
        sortTs: start,
        endTs: start + 3600000,
        href: '/taskman/wishlist',
      });
    }
  }

  return items.sort((a, b) => a.sortTs - b.sortTs);
})

// --- Horas de Disponibilidad y Carga del Día ---
const totalEventMinutes = computed(() => {
  let minutes = 0;
  for (const ev of calendarEvents.value) {
    if (!ev.start?.dateTime || !ev.end?.dateTime) continue;
    const s = new Date(ev.start.dateTime).getTime();
    const e = new Date(ev.end.dateTime).getTime();
    if (e > s) minutes += Math.round((e - s) / 60000);
  }
  for (const t of todayTasks.value) {
    minutes += (t.duration_minutes || 30);
  }
  return minutes;
})

const hoursInEvents = computed(() => {
  return (totalEventMinutes.value / 60).toFixed(1);
})

const hoursFreeFocus = computed(() => {
  // Jornada base estándar de 8 horas
  const freeMins = Math.max(0, 480 - totalEventMinutes.value);
  return (freeMins / 60).toFixed(1);
})

const dayLoadPercentage = computed(() => {
  return Math.min(100, Math.round((totalEventMinutes.value / 480) * 100));
})

// Evento en curso o próximo
const immediateEventContext = computed(() => {
  const now = Date.now();
  const current = agendaItems.value.find(i => i.isCurrent);
  if (current) {
    return {
      isActive: true,
      label: 'Evento en Curso',
      title: current.title,
      time: current.time,
      themeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
      dotClass: 'bg-emerald-500',
    };
  }
  const next = agendaItems.value.find(i => i.sortTs > now);
  if (next) {
    return {
      isActive: false,
      label: 'Próxima Actividad',
      title: next.title,
      time: next.time,
      themeClass: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
      dotClass: 'bg-blue-500',
    };
  }
  return {
    isActive: false,
    label: 'Jornada Libre',
    title: '',
    subtext: 'No tienes más actividades agendadas para hoy.',
    themeClass: 'bg-card/60 border-border/40 text-muted-foreground',
    dotClass: 'bg-muted-foreground',
  };
})

// --- The One Thing & Prioridades ---
const allPriorityTasks = computed(() => {
  return taskStore.tasks
    .filter(t => (t.status === 'pending' || t.status === 'in_progress') && t.priority === 'high')
    .sort((a, b) => {
      // Priorizar las que tienen deadline hoy
      const now = new Date().toISOString().split('T')[0];
      const aToday = a.deadline && a.deadline.startsWith(now) ? 1 : 0;
      const bToday = b.deadline && b.deadline.startsWith(now) ? 1 : 0;
      return bToday - aToday;
    })
})

const theOneThing = computed<Task | null>(() => {
  if (allPriorityTasks.value.length > 0) return allPriorityTasks.value[0];
  // Fallback a primera tarea de hoy
  return todayTasks.value[0] || null;
})

const secondaryPriorityTasks = computed<Task[]>(() => {
  if (!theOneThing.value) return [];
  return allPriorityTasks.value.filter(t => t.id !== theOneThing.value?.id);
})

const totalPriorityCount = computed(() => {
  return (theOneThing.value ? 1 : 0) + secondaryPriorityTasks.value.length;
})

async function handleToggleTask(task: Task, event: MouseEvent) {
  if (!task.id) return;
  const newStatus = task.status === 'completed' ? 'pending' : 'completed';
  if (newStatus === 'completed') {
    triggerConfetti(event);
  }
  await taskStore.updateTask(task.id, { status: newStatus });
}

// --- Hábitos Interactivos ---
const activeHabits = computed(() => {
  return taskStore.habits.filter(h => h.status !== 'archived');
})

const getLogDateStr = (log: any) => {
  if (log.completedAt) return log.completedAt.split('T')[0];
  if (log.date) return log.date.split('T')[0];
  return '';
}

const getLocalTodayStr = () => {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}

const isHabitDoneToday = (habit: Habit) => {
  if (!habit.logs || habit.logs.length === 0) return false;
  const todayStr = getLocalTodayStr();
  return habit.logs.some(log => getLogDateStr(log) === todayStr);
}

const completedHabitsCount = computed(() => {
  return activeHabits.value.filter(isHabitDoneToday).length;
})

const habitsProgressPercentage = computed(() => {
  if (activeHabits.value.length === 0) return 0;
  return Math.round((completedHabitsCount.value / activeHabits.value.length) * 100);
})

const getHabitStreak = (habit: Habit) => {
  if (!habit.logs || habit.logs.length === 0) return 0;
  const dates = habit.logs.map(log => getLogDateStr(log)).filter(Boolean).sort((a, b) => b.localeCompare(a));
  const uniqueDates = [...new Set(dates)];
  if (uniqueDates.length === 0) return 0;
  
  let streak = 0;
  const todayStr = getLocalTodayStr();
  let checkDate = new Date(todayStr + 'T00:00:00');
  
  if (uniqueDates[0] === todayStr) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
    uniqueDates.shift();
  }
  
  while (uniqueDates.length > 0) {
    const prevDateStr = new Date(checkDate.getTime() - checkDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    if (uniqueDates[0] === prevDateStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      uniqueDates.shift();
    } else {
      break;
    }
  }
  return streak;
}

async function handleToggleHabit(habit: Habit, event: MouseEvent) {
  if (!habit.id) return;
  if (isHabitDoneToday(habit)) {
    await taskStore.unlogHabit(habit.id);
  } else {
    triggerConfetti(event);
    await taskStore.logHabit(habit.id);
  }
}

function triggerConfetti(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { x, y },
    colors: ['#f97316', '#10b981', '#3b82f6', '#ec4899', '#eab308'],
    ticks: 160,
    gravity: 1.1,
    scalar: 1.0,
  });
}

// --- Radar Financiero (7 Días) ---
const financialRadar = computed(() => {
  // 1. Cuentas líquidas (débito, efectivo, nómina, ahorro)
  const liquidAccounts = financeStore.accounts.filter(acc => 
    acc.type !== 'loan' && !(acc.type === 'card' && acc.sub_type === 'credit')
  );
  const availableBalance = liquidAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

  // 2. Pagos de los próximos 7 días
  const items7Days = financeStore.upcomingPayments.filter(p => {
    if (p.type === 'Ingreso') return false;
    return p.daysRemaining >= 0 && p.daysRemaining <= 7;
  });

  const totalDue7Days = items7Days.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const buffer = availableBalance - totalDue7Days;
  const status = buffer >= 0 ? 'healthy' : 'warning';
  const coveragePct = totalDue7Days > 0 ? Math.min(999, Math.round((availableBalance / totalDue7Days) * 100)) : 100;

  // Formato para UI (mostrar los 4 pagos más cercanos)
  const displayItems = (items7Days.length > 0 ? items7Days : financeStore.upcomingPayments.slice(0, 4)).map(p => {
    let urgencyLabel = `En ${p.daysRemaining} días`;
    if (p.daysRemaining === 0) urgencyLabel = 'Hoy';
    else if (p.daysRemaining === 1) urgencyLabel = 'Mañana';
    return {
      ...p,
      urgencyLabel,
    };
  });

  return {
    availableBalance,
    totalDue7Days,
    buffer,
    status,
    coveragePct,
    items7Days,
    displayItems: displayItems.slice(0, 4),
  };
})

// --- Proyectos Activos ---
const activeProjects = computed(() => {
  return taskStore.projects.filter(p => p.status === 'active');
})

onMounted(async () => {
  await authStore.init()
  updateTime()
  timer = setInterval(updateTime, 1000)
  
  // Asegurar la carga de datos completa
  if (taskStore.tasks.length === 0) taskStore.fetchTasks()
  if (taskStore.habits.length === 0) taskStore.fetchHabits()
  if (taskStore.projects.length === 0) taskStore.fetchProjects()
  if (financeStore.accounts.length === 0) financeStore.fetchAccounts()
  if (financeStore.subscriptions.length === 0) financeStore.fetchSubscriptions()
  if (financeStore.wishlistItems.length === 0) financeStore.fetchWishlistItems()
  await fetchTodayEvents()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
