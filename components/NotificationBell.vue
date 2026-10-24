<template>
  <div class="relative">
    <button @click="togglePopover" class="relative p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none">
      <Bell class="w-5 h-5" />
      <span v-if="notificationStore.unreadCount > 0" class="absolute top-1.5 right-1.5 flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
    </button>

    <!-- Popover -->
    <div v-if="isOpen" :class="['w-80 bg-card border border-border/40 rounded-2xl shadow-xl z-50 overflow-hidden', popoverClass]">
      <div class="p-4 border-b border-border/40 flex justify-between items-center bg-secondary/20">
        <h3 class="font-bold">Notificaciones</h3>
        <button v-if="notificationStore.unreadCount > 0" @click="markAllRead" class="text-xs text-primary hover:underline">
          Marcar todas como leídas
        </button>
      </div>

      <!-- Banner para activar Push si no está concedido en este navegador/celular -->
      <div v-if="pushStatus === 'default'" class="p-3 bg-primary/10 border-b border-primary/20 flex items-center justify-between gap-2">
        <span class="text-xs text-foreground">Activa alertas push en este dispositivo</span>
        <button @click="enablePush" class="text-xs font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-lg hover:opacity-90 whitespace-nowrap">
          Activar
        </button>
      </div>
      <div v-else-if="pushStatus === 'denied'" class="p-2.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400">
        Las notificaciones están bloqueadas en la configuración del navegador.
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div v-if="notificationStore.loading && notificationStore.notifications.length === 0" class="p-6 text-center text-muted-foreground">
          Cargando...
        </div>
        
        <div v-else-if="notificationStore.notifications.length === 0" class="p-6 text-center text-muted-foreground text-sm">
          No tienes notificaciones recientes.
        </div>

        <div v-else class="flex flex-col">
          <div 
            v-for="notif in notificationStore.notifications" 
            :key="notif.id"
            class="p-4 border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer flex flex-col gap-1"
            :class="{'opacity-60': notif.isRead, 'bg-primary/5': !notif.isRead}"
            @click="handleNotificationClick(notif)"
          >
            <div class="flex justify-between items-start gap-2">
              <h4 class="font-bold text-sm leading-tight" :class="{'text-foreground': !notif.isRead, 'text-muted-foreground': notif.isRead}">
                {{ notif.title }}
              </h4>
              <span class="text-[10px] text-muted-foreground whitespace-nowrap">
                {{ formatDate(notif.createdAt) }}
              </span>
            </div>
            <p class="text-xs text-muted-foreground mt-1">{{ notif.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop invisible para cerrar al clickear afuera -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell } from 'lucide-vue-next'
import { useNotificationStore, type Notification } from '~/stores/notifications'
import { requestWebPushPermission } from '~/utils/push'
import { toast } from 'vue-sonner'

const props = defineProps({
  popoverClass: {
    type: String,
    default: 'absolute right-0 mt-2'
  }
})

const notificationStore = useNotificationStore()
const router = useRouter()
const isOpen = ref(false)
const pushStatus = ref<string>('granted')

const checkPushPermission = () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    pushStatus.value = Notification.permission
  } else {
    pushStatus.value = 'unsupported'
  }
}

const enablePush = async () => {
  const res = await requestWebPushPermission()
  checkPushPermission()
  if (res === 'granted') {
    toast.success('Notificaciones push activadas en este dispositivo')
  } else if (res === 'denied') {
    toast.error('Permiso de notificaciones denegado por el navegador')
  }
}

const togglePopover = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    checkPushPermission()
    notificationStore.fetchNotifications()
  }
}

const markAllRead = async () => {
  await notificationStore.markAllAsRead()
}

const handleNotificationClick = async (notif: Notification) => {
  if (!notif.isRead) {
    await notificationStore.markAsRead(notif.id)
  }
  if ((notif as any).actionUrl) {
    isOpen.value = false
    router.push((notif as any).actionUrl)
  }
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
}

// Opcional: Fetch inicial si queremos el badge al cargar
onMounted(() => {
  checkPushPermission()
  notificationStore.fetchNotifications()
  
  // Refresh cada 5 minutos
  const interval = setInterval(() => {
    notificationStore.fetchNotifications()
  }, 5 * 60 * 1000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
/* Asegurar que el popover esté por encima del backdrop invisible */
.z-50 {
  z-index: 50;
}
.z-40 {
  z-index: 40;
}
</style>
