<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-card p-8 rounded-3xl border border-border/50 shadow-xl text-center space-y-4">
      <div v-if="status === 'loading'">
        <div class="text-4xl">⏳</div>
        <p class="text-muted-foreground">Verificando tu cuenta...</p>
      </div>
      <div v-else-if="status === 'ok'">
        <div class="text-4xl">✅</div>
        <h2 class="font-serif text-xl font-bold">Cuenta verificada</h2>
        <p class="text-muted-foreground text-sm">Redirigiéndote al dashboard...</p>
      </div>
      <div v-else>
        <div class="text-4xl">❌</div>
        <h2 class="font-serif text-xl font-bold">No se pudo verificar</h2>
        <p class="text-destructive text-sm">{{ authStore.error || 'Token inválido o expirado' }}</p>
        <NuxtLink to="/login" class="inline-block mt-4 text-primary font-medium hover:underline">Volver al login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const status = ref<'loading' | 'ok' | 'error'>('loading')

onMounted(async () => {
  const token = (route.query.token as string) || ''
  if (!token) {
    status.value = 'error'
    return
  }
  const ok = await authStore.verifyEmail(token)
  status.value = ok ? 'ok' : 'error'
  if (ok) {
    setTimeout(() => router.replace('/taskman'), 1500)
  }
})
</script>
