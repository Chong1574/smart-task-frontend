<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C232B] via-[#2A313C] to-[#1A1F26]">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-white">Completando inicio de sesión...</h2>
      <p class="text-gray-400 mt-2">Por favor espera un momento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: false
})

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // Token viene en el fragment (#token=...) para que no quede en Referer ni access logs.
  // Fallback a query por si sobrevive algún redirect viejo cacheado en el navegador.
  let token = '';
  if (typeof window !== 'undefined' && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    token = hashParams.get('token') || '';
  }
  if (!token) token = (route.query.token as string) || '';

  if (token) {
    authStore.handleAuthCallback(token);
    // Limpia el fragment para que no se guarde en historial.
    if (typeof window !== 'undefined') history.replaceState(null, '', window.location.pathname);
    router.push('/taskman');
  } else {
    router.push('/login');
  }
});
</script>
