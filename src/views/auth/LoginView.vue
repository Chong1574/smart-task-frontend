<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black p-4">
    <div class="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
        <p class="text-blue-200">Ingresa a tu cuenta de Smart Task</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">Email</label>
          <input 
            v-model="email"
            type="email" 
            required
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="tu@email.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">Contraseña</label>
          <input 
            v-model="password"
            type="password" 
            required
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="••••••••"
          >
        </div>

        <div v-if="authStore.error" class="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
          {{ authStore.error }}
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <span v-if="authStore.loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          <span>{{ authStore.loading ? 'Entrando...' : 'Iniciar Sesión' }}</span>
        </button>
      </form>

      <div class="mt-8">
        <div class="relative flex items-center justify-center mb-6">
          <div class="border-t border-white/10 w-full"></div>
          <span class="bg-transparent px-4 text-xs text-gray-400 font-medium uppercase tracking-wider absolute">O continúa con</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="loginWithGoogle"
            class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-white transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google">
            <span>Google</span>
          </button>
          <button 
            @click="loginWithMicrosoft"
            class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-white transition-all"
          >
            <img src="https://www.svgrepo.com/show/475662/microsoft-color.svg" class="w-5 h-5" alt="Microsoft">
            <span>Microsoft</span>
          </button>
        </div>
      </div>

      <p class="text-center mt-10 text-gray-400 text-sm">
        ¿No tienes cuenta? 
        <router-link to="/register" class="text-blue-400 font-bold hover:text-blue-300 transition-colors">Regístrate gratis</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    const success = await authStore.login(email.value, password.value);
    if (success) {
        router.push('/');
    }
};

const baseEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_URL = baseEnvUrl
    ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
    : 'http://localhost:3000/api';

const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
};

const loginWithMicrosoft = () => {
    window.location.href = `${API_URL}/auth/microsoft`;
};
</script>
