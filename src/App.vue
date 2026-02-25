<script setup lang="ts">
import { computed } from 'vue';
import { Home, BarChart2, CreditCard, Calendar, LogOut, Car } from 'lucide-vue-next';
import { useAuthStore } from './stores/authStore';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isAuthenticated = computed(() => !!authStore.token);

const sidebarItems = [
  { id: 'home', label: 'Inicio', icon: Home, path: '/' },
  { id: 'analytics', label: 'Dashboard', icon: BarChart2, path: '/dashboard' },
  { id: 'calendar', label: 'Calendario', icon: Calendar, path: '/calendar' },
  { id: 'wallet', label: 'Wallet', icon: CreditCard, path: '/wallet' },
  { id: 'garage', label: 'Garaje', icon: Car, path: '/garage' },
];

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-inter">
    
    <!-- Sidebar only if authenticated -->
    <nav v-if="isAuthenticated" class="bg-white border-t md:border-r border-gray-200 w-full md:w-64 p-2 md:p-4 flex md:flex-col justify-around md:justify-start gap-1 fixed bottom-0 md:relative z-50 shadow-lg md:shadow-none pb-safe">
      <div class="hidden md:flex items-center gap-2 mb-8 px-2">
        <span class="text-xl font-bold text-slate-800">TaskMan Pro</span>
      </div>
      
      <router-link 
        v-for="item in sidebarItems" 
        :key="item.id"
        :to="item.path"
        class="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl w-full transition-all"
        :class="[route.path === item.path ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-400 font-medium hover:bg-gray-50']"
      >
        <component :is="item.icon" :size="24" :stroke-width="route.path === item.path ? 2.5 : 2" />
        <span class="text-[10px] md:text-sm">{{ item.label }}</span>
      </router-link>

      <div class="mt-auto hidden md:block border-t border-gray-100 pt-4">
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 p-3 rounded-xl w-full transition-all text-red-400 hover:bg-red-50"
        >
          <LogOut :size="24" />
          <span class="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto" :class="[isAuthenticated ? 'p-4 md:p-8 mb-20 md:mb-0' : '']">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global Styles */
.font-inter { font-family: 'Inter', sans-serif; }
</style>