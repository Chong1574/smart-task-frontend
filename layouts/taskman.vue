<template>
  <div class="min-h-screen bg-background text-foreground font-sans flex overflow-hidden selection:bg-primary/30">
    <!-- Sidebar / Nav Lado izquierdo -->
    <aside class="w-20 lg:w-64 border-r border-border/40 bg-card/50 backdrop-blur-xl flex flex-col justify-between transition-all duration-300">
      <div class="p-4 lg:p-6 flex flex-col gap-8">
        <!-- Logo -->
        <NuxtLink to="/taskman" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <span class="hidden lg:block font-serif text-xl font-bold tracking-tight">TaskMan</span>
        </NuxtLink>

        <!-- Navegación -->
        <nav class="flex flex-col gap-2">
          <NuxtLink v-for="item in nav" :key="item.path" :to="item.path"
            class="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all relative group"
            active-class="bg-primary/15 text-primary font-medium"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="hidden lg:block">{{ item.name }}</span>
            <!-- Tooltip para mobile -->
            <div class="lg:hidden absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {{ item.name }}
            </div>
          </NuxtLink>
        </nav>
      </div>

      <!-- User / Logout -->
      <div class="p-4 lg:p-6">
        <button @click="logout" class="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span class="hidden lg:block font-medium">Salir</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <!-- Topbar movil (Opcional) -->
      <header class="lg:hidden h-16 border-b border-border/40 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md z-10">
        <span class="font-serif text-lg font-bold">TaskMan</span>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Car,
  Target,
  Activity,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const isSidebarOpen = ref(true)

const nav = [
  { name: 'Dashboard', path: '/taskman', icon: LayoutDashboard },
  { name: 'Actividades', path: '/taskman/activities', icon: CheckSquare },
  { name: 'Proyectos', path: '/taskman/projects', icon: Target },
  { name: 'Hábitos', path: '/taskman/habits', icon: Activity },
  { name: 'Wallet', path: '/taskman/wallet', icon: TrendingUp },
  { name: 'Garage', path: '/taskman/garage', icon: Car },
]

const handleLogoutEvent = () => {
  router.push('/login')
}

onMounted(() => {
  authStore.init()
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
