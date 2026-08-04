<template>
  <div class="min-h-screen bg-background text-foreground font-sans flex overflow-hidden selection:bg-primary/30 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
    <!-- Sidebar / Nav Lado izquierdo (Oculto en móvil, visible en md/lg) -->
    <aside class="hidden md:flex border-r border-border/40 bg-card/50 backdrop-blur-xl flex-col justify-between transition-all duration-300"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <div class="p-4 lg:p-6 flex flex-col gap-8">
        <!-- Logo y Toggle -->
        <div class="flex items-center justify-between">
          <NuxtLink to="/taskman" class="flex items-center gap-3 group">
            <div class="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <span v-show="isSidebarOpen" class="font-serif text-xl font-bold tracking-tight whitespace-nowrap transition-opacity">TaskMan</span>
          </NuxtLink>
          <button @click="isSidebarOpen = !isSidebarOpen" v-show="isSidebarOpen" class="text-muted-foreground hover:text-primary transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>

        <button @click="isSidebarOpen = !isSidebarOpen" v-show="!isSidebarOpen" class="mx-auto text-muted-foreground hover:text-primary transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <!-- Navegación Desktop -->
        <nav class="flex flex-col gap-2">
          <NuxtLink v-for="item in nav" :key="item.path" :to="item.path"
            class="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all relative group"
            :class="!isSidebarOpen ? 'justify-center' : ''"
            active-class="bg-primary/15 text-primary font-medium"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span v-show="isSidebarOpen" class="whitespace-nowrap">{{ item.name }}</span>
            <div v-if="!isSidebarOpen" class="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md border border-border">
              {{ item.name }}
            </div>
          </NuxtLink>
        </nav>
      </div>

      <!-- User / Actions -->
      <div class="p-4 lg:p-6 flex flex-col gap-2">
        <NuxtLink v-if="isAdmin" to="/taskman/admin/bazar" class="w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl text-primary hover:bg-primary/10 transition-all" :class="!isSidebarOpen ? 'md:justify-center' : ''">
          <ShieldAlert class="w-5 h-5 shrink-0" />
          <span v-show="isSidebarOpen" class="font-medium whitespace-nowrap">Admin</span>
        </NuxtLink>
        <button @click="toggleTheme" class="w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all" :class="!isSidebarOpen ? 'md:justify-center' : ''">
          <Moon v-if="colorMode.value === 'dark'" class="w-5 h-5 shrink-0" />
          <Sun v-else class="w-5 h-5 shrink-0" />
          <span v-show="isSidebarOpen" class="font-medium whitespace-nowrap">Tema</span>
        </button>
        <button @click="handleLogout" class="w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all" :class="!isSidebarOpen ? 'md:justify-center' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span v-show="isSidebarOpen" class="font-medium whitespace-nowrap">Salir</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative mb-16 md:mb-0">
      <!-- Topbar movil -->
      <header class="md:hidden h-14 border-b border-border/40 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md z-10 sticky top-0">
        <span class="font-serif text-lg font-bold flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          TaskMan
        </span>
        <div class="flex items-center gap-2">
          <NuxtLink v-if="isAdmin" to="/taskman/admin/bazar" class="text-primary hover:text-primary/80 p-2">
            <ShieldAlert class="w-5 h-5" />
          </NuxtLink>
          <button @click="handleLogout" class="text-muted-foreground hover:text-destructive p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 md:pb-8">
        <slot />
      </div>
    </main>

    <!-- Bottom Navigation Bar for Mobile -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-xl border-t border-border/40 flex items-center justify-around z-50 pb-[env(safe-area-inset-bottom)] px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <NuxtLink v-for="item in nav" :key="item.path" :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full text-muted-foreground transition-colors"
        active-class="text-primary font-medium"
      >
        <div class="p-1.5 rounded-full transition-all" :class="{'bg-primary/10 text-primary': $route.path === item.path || ($route.path.startsWith(item.path) && item.path !== '/taskman')}">
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-[10px] mt-1 truncate max-w-full px-1" :class="{'text-primary': $route.path === item.path || ($route.path.startsWith(item.path) && item.path !== '/taskman')}">{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Car,
  Target,
  Activity,
  Printer,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Sunrise,
  ShieldAlert
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const colorMode = useColorMode()

const isSidebarOpen = ref(true)

const isAdmin = computed(() => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'bernalchong@gmail.com'
  return authStore.user?.email === adminEmail
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const nav = [
  { name: 'Dashboard', path: '/taskman', icon: LayoutDashboard },
  { name: 'Briefing', path: '/taskman/briefing', icon: Sunrise },
  { name: 'Actividades', path: '/taskman/activities', icon: CheckSquare },
  { name: 'Proyectos', path: '/taskman/projects', icon: Target },
  { name: 'Hábitos', path: '/taskman/habits', icon: Activity },
  { name: 'Wallet', path: '/taskman/wallet', icon: TrendingUp },
  { name: 'Garage', path: '/taskman/garage', icon: Car },
  { name: '3D', path: '/taskman/impresion-3d', icon: Printer },
]

const handleLogoutEvent = () => {
  router.push('/login')
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:logout', handleLogoutEvent)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('auth:logout', handleLogoutEvent)
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
