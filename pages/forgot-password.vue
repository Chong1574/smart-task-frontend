<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif font-bold mb-2">Recuperar contraseña</h1>
        <p class="text-muted-foreground text-sm">Te enviaremos un enlace para restablecerla.</p>
      </div>

      <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">Correo electrónico</label>
          <input v-model="email" type="email" required autocomplete="email"
            class="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="tu@correo.com" />
        </div>

        <p v-if="authStore.error" class="text-sm text-destructive">{{ authStore.error }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60">
          {{ authStore.loading ? 'Enviando...' : 'Enviar enlace' }}
        </button>

        <p class="text-center text-sm">
          <NuxtLink to="/login" class="text-muted-foreground hover:text-primary">← Volver al login</NuxtLink>
        </p>
      </form>

      <div v-else class="text-center space-y-4">
        <div class="text-4xl">📬</div>
        <h2 class="font-serif text-xl font-bold">Revisa tu correo</h2>
        <p class="text-muted-foreground text-sm">
          Si la cuenta existe, te llegará un enlace para restablecer la contraseña.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const email = ref('')
const submitted = ref(false)

const handleSubmit = async () => {
  authStore.error = null
  const ok = await authStore.forgotPassword(email.value)
  if (ok) submitted.value = true
}
</script>
