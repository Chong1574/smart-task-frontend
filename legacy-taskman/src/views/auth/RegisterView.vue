<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black p-4">
    <div class="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">Crea tu cuenta</h1>
        <p class="text-blue-200">Únete a Smart Task y organiza tu vida</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
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

        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">Confirmar Contraseña</label>
          <input 
            v-model="confirmPassword"
            type="password" 
            required
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="••••••••"
          >
        </div>

        <div v-if="authStore.error || confirmError" class="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
          {{ authStore.error || confirmError }}
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading"
          class="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
        >
          <span v-if="authStore.loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          <span>{{ authStore.loading ? 'Creando cuenta...' : 'Registrarse' }}</span>
        </button>
      </form>

      <p class="text-center mt-10 text-gray-400 text-sm">
        ¿Ya tienes cuenta? 
        <router-link to="/login" class="text-blue-400 font-bold hover:text-blue-300 transition-colors">Inicia Sesión</router-link>
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
const confirmPassword = ref('');
const confirmError = ref('');

const handleRegister = async () => {
    confirmError.value = '';
    if (password.value !== confirmPassword.value) {
        confirmError.value = 'Las contraseñas no coinciden';
        return;
    }

    const success = await authStore.register(email.value, password.value);
    if (success) {
        router.push('/');
    }
};
</script>
