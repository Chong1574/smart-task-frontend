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
  // Extraer el token de la URL (el backend hace un redirect con el token JWT)
  const token = route.query.token as string;
  if (token) {
    authStore.handleAuthCallback(token);
    router.push('/taskman');
  } else {
    // Si no hay token en la URL, redirigir al login
    router.push('/taskman/login');
  }
});
</script>
