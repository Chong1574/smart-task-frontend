<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C232B] via-[#2A313C] to-[#1A1F26] p-4 font-sans">
    <div class="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2 font-serif">Bienvenido de nuevo</h1>
        <p class="text-gray-400">Ingresa a tu ecosistema de Taskman</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input 
            v-model="email"
            type="email" 
            required
            class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="tu@email.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
          <input 
            v-model="password"
            type="password" 
            autocomplete="current-password"
            required
            class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="••••••••"
          >
        </div>

        <div v-if="authStore.error" class="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
          {{ authStore.error }}
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading"
          class="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ authStore.loading ? 'Entrando...' : 'Iniciar Sesión' }}</span>
        </button>
      </form>

      <div class="mt-8">
        <div class="relative flex items-center justify-center mb-6">
          <div class="border-t border-white/10 w-full"></div>
          <span class="bg-[#2A313C] px-4 text-xs text-gray-400 font-medium uppercase tracking-wider absolute">O continúa con</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="loginWithGoogle"
            class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-white transition-all hover:-translate-y-1"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google">
            <span>Google</span>
          </button>
          <button 
            @click="loginWithMicrosoft"
            class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-white transition-all hover:-translate-y-1"
          >
            <img src="https://www.svgrepo.com/show/475662/microsoft-color.svg" class="w-5 h-5" alt="Microsoft">
            <span>Microsoft</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: false // Do not use the taskman sidebar layout for login
})

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    const success = await authStore.login(email.value, password.value);
    if (success) {
        router.push('/taskman');
    }
};

const baseEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_URL = baseEnvUrl
    ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
    : 'http://localhost:3000/api';

const loginWithGoogle = () => {
    // In legacy, the backend expects a query param or origin logic to redirect back, but if we don't have it, it defaults
    window.location.href = `${API_URL}/auth/google`;
};

const loginWithMicrosoft = () => {
    window.location.href = `${API_URL}/auth/microsoft`;
};
</script>
