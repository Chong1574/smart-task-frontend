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

<script setup>
import { ref, onMounted } from 'vue'
const hasConsented = ref(true) // assume true to prevent flash, then check in mount

const { grantConsent } = useGtag()

const enableClarity = () => {
  if (typeof window !== 'undefined') {
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ysm453nrza");
  }
}

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (consent === 'accepted') {
    hasConsented.value = true
    grantConsent()
    enableClarity()
  } else if (consent === 'rejected') {
    hasConsented.value = true
  } else {
    hasConsented.value = false
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'accepted')
  hasConsented.value = true
  grantConsent()
  enableClarity()
}

const rejectCookies = () => {
  localStorage.setItem('cookie-consent', 'rejected')
  hasConsented.value = true
}
</script>
