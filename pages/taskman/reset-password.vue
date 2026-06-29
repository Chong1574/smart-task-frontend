<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif font-bold mb-2">Nueva contraseña</h1>
        <p class="text-muted-foreground text-sm">Define una nueva contraseña para tu cuenta.</p>
      </div>

      <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">Nueva contraseña</label>
          <input v-model="password" type="password" required minlength="8" autocomplete="new-password"
            class="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Mínimo 8 caracteres" />
        </div>

        <p v-if="authStore.error" class="text-sm text-destructive">{{ authStore.error }}</p>
        <p v-if="!token" class="text-sm text-destructive">Falta el token en la URL.</p>

        <button type="submit" :disabled="authStore.loading || !token"
          class="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60">
          {{ authStore.loading ? 'Guardando...' : 'Restablecer contraseña' }}
        </button>
      </form>

      <div v-else class="text-center space-y-4">
        <div class="text-4xl">✅</div>
        <h2 class="font-serif text-xl font-bold">Contraseña actualizada</h2>
        <NuxtLink to="/login" class="inline-block mt-2 text-primary font-medium hover:underline">Iniciar sesión</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const password = ref('')
const success = ref(false)
const token = (route.query.token as string) || ''

const handleSubmit = async () => {
  authStore.error = null
  const ok = await authStore.resetPassword(token, password.value)
  if (ok) success.value = true
}
</script>
