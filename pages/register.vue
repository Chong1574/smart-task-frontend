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

        <div class="relative flex items-center py-2">
          <div class="flex-grow border-t border-border"></div>
          <span class="flex-shrink-0 mx-4 text-muted-foreground text-sm">o registrarte con</span>
          <div class="flex-grow border-t border-border"></div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full py-3.5 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-secondary/50 transition-colors flex justify-center items-center gap-3 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            @click="handleMicrosoftLogin"
            class="w-full py-3.5 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-secondary/50 transition-colors flex justify-center items-center gap-3 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475662/microsoft-color.svg" class="w-5 h-5" alt="Microsoft">
            Microsoft
          </button>
        </div>
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
import { API_URL } from '~/utils/apiUrl'

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

const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/auth/google`
}

const handleMicrosoftLogin = () => {
  window.location.href = `${API_URL}/auth/microsoft`
}
</script>
