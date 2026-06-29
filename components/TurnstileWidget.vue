<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{ verified: [token: string] }>()
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const container = ref<HTMLDivElement | null>(null)
let widgetId: string | null = null

function render() {
  const ts = (window as any).turnstile
  if (!ts || !container.value || !siteKey) return
  widgetId = ts.render(container.value, {
    sitekey: siteKey,
    callback: (token: string) => emit('verified', token),
    'error-callback': () => emit('verified', ''),
    'expired-callback': () => emit('verified', '')
  })
}

onMounted(() => {
  if (!siteKey) return
  if ((window as any).turnstile) {
    render()
  } else {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true
    s.defer = true
    s.onload = render
    document.head.appendChild(s)
  }
})

onUnmounted(() => {
  const ts = (window as any).turnstile
  if (ts && widgetId) ts.remove(widgetId)
})
</script>

<template>
  <div v-if="siteKey" ref="container" class="my-2" />
</template>
