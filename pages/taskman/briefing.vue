<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col items-center justify-center animate-in fade-in duration-1000 p-4 md:p-8 relative">
    
    <!-- Volver -->
    <NuxtLink to="/taskman" class="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      <span class="font-medium hidden md:inline">Volver a Taskman</span>
    </NuxtLink>

    <!-- Header / Reloj y Saludo -->
    <div class="text-center mb-12 mt-8 md:mt-0">
      <h1 class="text-7xl md:text-[10rem] leading-none font-serif font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-orange-400 tracking-tighter mb-6">
        {{ currentTime }}
      </h1>
      <h2 class="text-3xl md:text-5xl font-medium text-foreground tracking-tight mb-2">
        {{ greeting }}<span v-if="firstName">, {{ firstName }}</span>
      </h2>
      <p class="text-xl md:text-2xl text-muted-foreground font-serif">
        {{ currentDate }}
      </p>
    </div>

    <!-- Contenido Principal -->
    <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
      
      <!-- Columna 1: Pendientes de Hoy (Calendario) -->
      <div class="bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Agenda del Día
        </h3>
        
        <div v-if="taskStore.loading || calendarLoading" class="space-y-4">
           <div v-for="i in 3" :key="i" class="h-14 bg-muted/50 rounded-2xl animate-pulse"></div>
        </div>
        <div v-else-if="agendaItems.length === 0" class="text-center py-8 text-muted-foreground">
          <p>No tienes tareas ni eventos agendados para hoy.</p>
        </div>
        <ul v-else class="space-y-3">
          <NuxtLink v-for="item in agendaItems.slice(0, 6)" :key="item.key" :to="item.href" class="block p-4 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-medium leading-tight" :class="item.kind === 'event' ? 'text-blue-500' : 'text-primary'">
                <span v-if="item.kind === 'event'" class="text-[10px] uppercase tracking-wider text-blue-500/70 mr-1">GCal</span>
                {{ item.title }}
              </h4>
              <span v-if="item.time" class="text-xs text-muted-foreground whitespace-nowrap">{{ item.time }}</span>
            </div>
            <div v-if="item.kind === 'task'" class="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span v-if="item.durationMin">{{ item.durationMin }} min</span>
              <span v-if="item.priority" :class="{'text-destructive': item.priority === 'high', 'text-orange-500': item.priority === 'medium', 'text-green-500': item.priority === 'low'}" class="capitalize">
                {{ item.priority }}
              </span>
            </div>
          </NuxtLink>
          <NuxtLink v-if="agendaItems.length > 6" to="/taskman/activities" class="block text-center text-muted-foreground pt-2 text-sm font-medium hover:text-primary transition-colors">
            + {{ agendaItems.length - 6 }} más...
          </NuxtLink>
        </ul>
      </div>

      <!-- Columna 2: Foco General y Hábitos -->
      <div class="space-y-8 md:space-y-12">
        <div class="bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-2xl">
          <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Foco (Prioridades)
          </h3>
          
          <ul class="space-y-3">
            <NuxtLink v-for="task in priorityTasks.slice(0, 7)" :key="task.id" to="/taskman/activities" class="block p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
              <h4 class="font-medium text-sm leading-tight">{{ task.title }}</h4>
            </NuxtLink>
          </ul>
          <div v-if="priorityTasks.length === 0" class="text-muted-foreground text-sm text-center py-4">Todo limpio.</div>
        </div>

        <div class="bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-2xl">
          <h3 class="text-2xl font-bold mb-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Hábitos
          </h3>
          <div v-if="activeHabits.length === 0" class="text-sm text-muted-foreground py-2">
             Sin hábitos activos.
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <NuxtLink v-for="habit in activeHabits" :key="habit.id" to="/taskman/habits" class="px-4 py-2 rounded-full border border-border/50 bg-background/50 font-medium text-xs hover:border-primary/50 transition-colors">
              {{ habit.name }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Columna 3: Pagos Próximos y Motivación -->
      <div class="space-y-8 md:space-y-12">
        <div class="bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-2xl">
          <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            Próximos Pagos
          </h3>
          <ul class="space-y-3">
            <NuxtLink v-for="payment in upcomingPayments" :key="payment.id" to="/taskman/wallet" class="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
              <div>
                <h4 class="font-medium text-sm">{{ payment.name }}</h4>
                <p class="text-xs text-muted-foreground">Día {{ payment.paymentDay }}</p>
              </div>
              <span class="font-bold text-sm text-destructive">${{ payment.amount.toFixed(2) }}</span>
            </NuxtLink>
          </ul>
          <div v-if="upcomingPayments.length === 0" class="text-muted-foreground text-sm text-center py-4">No hay pagos cercanos.</div>
        </div>

        <div class="bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-2xl">
          <h3 class="text-2xl font-bold mb-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Proyectos Activos
          </h3>
          <ul class="space-y-3">
            <NuxtLink v-for="project in activeProjects.slice(0, 3)" :key="project.id" to="/taskman/projects" class="block p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
              <h4 class="font-medium text-sm leading-tight">{{ project.name }}</h4>
            </NuxtLink>
          </ul>
          <div v-if="activeProjects.length === 0" class="text-muted-foreground text-sm text-center py-4">Sin proyectos activos.</div>
        </div>

        <div class="bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20 rounded-3xl p-6 text-center shadow-lg">
          <p class="text-lg md:text-xl font-serif font-medium text-foreground italic">
            "{{ dailyQuote }}"
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '~/stores/tasks'
import { useAuthStore } from '~/stores/auth'
import { useFinanceStore } from '~/stores/finance'
import api from '~/utils/api'

// Desactivar el layout por defecto para hacer un verdadero Wallpaper
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

// Solo primer nombre; ya no fallback al prefijo del email.
const firstName = computed(() => {
  const raw = (authStore.user?.name || '').trim()
  return raw ? raw.split(/\s+/)[0] : ''
})

// Tareas del día actual
const todayTasks = computed(() => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  return taskStore.tasks
    .filter(t => {
      if (t.status !== 'pending' && t.status !== 'in_progress') return false;
      if (!t.deadline) return false;
      
      const d = new Date(t.deadline);
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return localDateStr === todayStr;
    })
    .sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return 0;
    })
})

// Eventos de Google Calendar para hoy — mismo endpoint que /activities.
const calendarEvents = ref<any[]>([])
const calendarLoading = ref(false)

async function fetchTodayEvents() {
  if (!authStore.hasCalendarConnected) return
  calendarLoading.value = true
  try {
    const res = await api.get('/oauth/google/events')
    calendarEvents.value = res.data?.data || []
  } catch {
    // ponytail: calendario opcional; si falla, la agenda solo muestra tareas.
    calendarEvents.value = []
  } finally {
    calendarLoading.value = false
  }
}

// Agenda unificada: eventos GCal de hoy + tareas con deadline hoy, ordenados por hora.
interface AgendaItem {
  key: string;
  kind: 'event' | 'task';
  title: string;
  time: string;
  sortTs: number;
  href: string;
  durationMin?: number;
  priority?: string;
}

const agendaItems = computed<AgendaItem[]>(() => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = start + 24 * 3600 * 1000;
  const items: AgendaItem[] = [];

  for (const t of todayTasks.value) {
    const ts = t.deadline ? new Date(t.deadline).getTime() : start;
    items.push({
      key: `t-${t.id}`,
      kind: 'task',
      title: t.title,
      time: t.deadline ? new Date(t.deadline).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '',
      sortTs: ts,
      href: '/taskman/activities',
      durationMin: (t as any).duration_minutes,
      priority: t.priority,
    });
  }

  for (const ev of calendarEvents.value) {
    const startRaw = ev.start?.dateTime || ev.start?.date;
    if (!startRaw) continue;
    const startDate = new Date(startRaw);
    const ts = startDate.getTime();
    if (ts < start || ts >= end) continue; // solo hoy
    const isAllDay = !ev.start?.dateTime;
    items.push({
      key: `e-${ev.id}`,
      kind: 'event',
      title: ev.summary || '(sin título)',
      time: isAllDay ? 'Todo el día' : startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      sortTs: ts,
      href: '/taskman/activities',
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
        kind: 'task', // display like a task
        title: `Comprar: ${w.name}`,
        time: 'Hoy',
        sortTs: start, // put at the top or bottom of the day
        href: '/taskman/wishlist',
        priority: w.priority === 'urgent' ? 'high' : w.priority === 'not_important' ? 'low' : 'medium',
      });
    }
  }

  return items.sort((a, b) => a.sortTs - b.sortTs);
})

// Tareas prioritarias o atrasadas generales
const priorityTasks = computed(() => {
  return taskStore.tasks
    .filter(t => (t.status === 'pending' || t.status === 'in_progress') && t.priority === 'high')
    .sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return 0;
    })
})

const activeHabits = computed(() => {
  // Use all habits, filtering out archived ones if they exist, but generally show what the store provides
  return taskStore.habits.filter(h => h.status !== 'archived')
})

const activeProjects = computed(() => {
  return taskStore.projects.filter(p => p.status === 'active')
})

const upcomingPayments = computed(() => {
  const todayDay = new Date().getDate();
  return financeStore.subscriptions
    // Nómina/ingresos NO son pagos por hacer — ver [[project_finance_income_subs]].
    .filter(s => s.type !== 'INCOME' && s.paymentDay !== undefined && s.paymentDay !== null)
    .sort((a, b) => {
      // Ordenar por cercanía al día de hoy
      let diffA = a.paymentDay! - todayDay;
      let diffB = b.paymentDay! - todayDay;
      if (diffA < 0) diffA += 30; // Ya pasó este mes, cuenta para el próximo
      if (diffB < 0) diffB += 30;
      return diffA - diffB;
    })
    .slice(0, 5) // Mostrar los 5 más próximos
})

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  
  // Asegurar que toda la información esté cargada
  if (taskStore.tasks.length === 0) taskStore.fetchTasks()
  if (taskStore.habits.length === 0) taskStore.fetchHabits()
  if (taskStore.projects.length === 0) taskStore.fetchProjects()
  if (financeStore.subscriptions.length === 0) financeStore.fetchSubscriptions()
  if (financeStore.wishlistItems.length === 0) financeStore.fetchWishlistItems()
  fetchTodayEvents()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
