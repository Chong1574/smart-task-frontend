import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '~/utils/api'
import { useAuthStore } from './auth'
import { toast } from 'vue-sonner'

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const POLL_INTERVAL_MS = 5 * 60 * 1000
const FETCH_COOLDOWN_MS = 15 * 1000

let inFlightPromise: Promise<void> | null = null
let lastFetchedAt = 0
let pollingSubscribers = 0
let pollingTimer: ReturnType<typeof setInterval> | null = null

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const authStore = useAuthStore()

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  async function fetchNotifications(force = false) {
    if (!authStore.isAuthenticated) return
    const now = Date.now()
    if (!force && lastFetchedAt && now - lastFetchedAt < FETCH_COOLDOWN_MS) {
      return
    }
    if (inFlightPromise) return inFlightPromise

    loading.value = true
    inFlightPromise = (async () => {
      try {
        const response = await api.get('/notifications')
        if (response.data?.success) {
          notifications.value = response.data.data
          lastFetchedAt = Date.now()
        }
      } catch (e: any) {
        console.error('Error fetching notifications:', e)
      } finally {
        loading.value = false
        inFlightPromise = null
      }
    })()

    return inFlightPromise
  }

  function startPolling() {
    pollingSubscribers++
    fetchNotifications()
    if (!pollingTimer && typeof window !== 'undefined') {
      pollingTimer = setInterval(() => {
        fetchNotifications(true)
      }, POLL_INTERVAL_MS)
    }
  }

  function stopPolling() {
    pollingSubscribers = Math.max(0, pollingSubscribers - 1)
    if (pollingSubscribers === 0 && pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  async function markAsRead(id: number) {
    try {
      const response = await api.put(`/notifications/${id}/mark-read`)
      if (response.data?.success) {
        const notif = notifications.value.find(n => n.id === id)
        if (notif) {
          notif.isRead = true
        }
      }
    } catch (e: any) {
      console.error('Error marking notification as read:', e)
    }
  }

  async function markAllAsRead() {
    try {
      const response = await api.put('/notifications/mark-all-read')
      if (response.data?.success) {
        notifications.value.forEach(n => n.isRead = true)
        toast.success('Todas las notificaciones marcadas como leídas')
      }
    } catch (e: any) {
      console.error('Error marking all notifications as read:', e)
      toast.error('No se pudieron actualizar las notificaciones')
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    startPolling,
    stopPolling,
    markAsRead,
    markAllAsRead
  }
})
