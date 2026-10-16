<template>
  <div v-if="!hasConsented" class="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-safe">
    <div class="max-w-4xl mx-auto bg-card border border-border shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
      <div class="flex-1">
        <h3 class="font-bold text-lg mb-2 text-foreground">Tu privacidad es importante</h3>
        <p class="text-sm text-muted-foreground">
          Utilizamos cookies y tecnologías similares (como Google Analytics y Microsoft Clarity) para analizar el tráfico de nuestro sitio, 
          comprender cómo interactúas con él y mejorar tu experiencia. 
          Al hacer clic en "Aceptar", consientes el uso de estas tecnologías.
          Puedes revisar nuestra <NuxtLink to="/privacidad" class="underline hover:text-primary">Política de Privacidad</NuxtLink>.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 min-w-fit">
        <button @click="rejectCookies" class="px-5 py-2.5 text-sm font-medium rounded-xl border border-border hover:bg-secondary transition-colors whitespace-nowrap">
          Rechazar
        </button>
        <button @click="acceptCookies" class="px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ensureAnalyticsQueues, loadAnalyticsScripts, GA_MEASUREMENT_ID } from '~/utils/analytics'

const hasConsented = ref(true)
const router = useRouter()

if (typeof window !== 'undefined') {
  const consent = localStorage.getItem('cookie-consent')
  if (consent === 'accepted') {
    loadAnalyticsScripts()
  } else if (consent !== 'rejected') {
    ensureAnalyticsQueues()
  }
}

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (consent === 'accepted') {
    hasConsented.value = true
    loadAnalyticsScripts()
  } else if (consent === 'rejected') {
    hasConsented.value = true
  } else {
    hasConsented.value = false
    ensureAnalyticsQueues()
  }

  router.afterEach((to) => {
    if (localStorage.getItem('cookie-consent') !== 'rejected' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: to.fullPath,
        page_title: document.title
      })
    }
  })
})

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'accepted')
  hasConsented.value = true
  loadAnalyticsScripts()
}

const rejectCookies = () => {
  localStorage.setItem('cookie-consent', 'rejected')
  hasConsented.value = true
  if (typeof window !== 'undefined') {
    window.dataLayer = []
  }
}
</script>
