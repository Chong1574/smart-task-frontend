<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif font-bold mb-2">Crear cuenta</h1>
        <p class="text-muted-foreground text-sm">Te enviaremos un correo para verificar.</p>
      </div>

      <form v-if="!submitted" @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">Correo electrónico</label>
          <input v-model="email" type="email" required autocomplete="email"
            class="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="tu@correo.com" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Contraseña</label>
          <input v-model="password" type="password" required minlength="8" autocomplete="new-password"
            class="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Mínimo 8 caracteres" />
        </div>

        <TurnstileWidget @verified="onTurnstileVerified" />

        <p v-if="authStore.error" class="text-sm text-destructive">{{ authStore.error }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed">
          {{ authStore.loading ? 'Creando cuenta...' : 'Registrarme' }}
        </button>

        <p class="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="text-primary font-medium hover:underline">Inicia sesión</NuxtLink>
        </p>
      </form>

      <div v-else class="text-center space-y-4">
        <div class="text-4xl">📬</div>
        <h2 class="font-serif text-xl font-bold">Revisa tu correo</h2>
        <p class="text-muted-foreground text-sm">
          Te enviamos un enlace de verificación a <strong>{{ email }}</strong>.
          Haz clic en él para activar tu cuenta.
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
const password = ref('')
const turnstileToken = ref('')
const submitted = ref(false)

const onTurnstileVerified = (token: string) => {
  turnstileToken.value = token
}

const handleRegister = async () => {
  authStore.error = null
  const ok = await authStore.register(email.value, password.value, turnstileToken.value)
  if (ok) submitted.value = true
}
</script>
