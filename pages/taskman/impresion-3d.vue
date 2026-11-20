<template>
  <div v-if="isAdmin" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
    <div>
      <h1 class="text-3xl font-serif font-bold">Calculadora 3D</h1>
      <p class="text-muted-foreground">Cotiza tus impresiones considerando filamento, luz y margen.</p>
    </div>

    <PrintCost3DCalculator />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'taskman' })

const authStore = useAuthStore()
const router = useRouter()
const isAdmin = computed(() => authStore.user?.role === 'admin')

onMounted(() => {
  if (authStore.user?.role !== 'admin') {
    router.replace('/taskman')
  }
})
</script>
