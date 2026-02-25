<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4 mx-auto"></div>
      <p class="text-white text-xl">Autenticando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
    const token = route.query.token as string;
    if (token) {
        authStore.handleAuthCallback(token);
        router.push('/');
    } else {
        router.push('/login');
    }
});
</script>
