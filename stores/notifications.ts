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

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const authStore = useAuthStore()

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  async function fetchNotifications() {
    if (!authStore.isAuthenticated) return
    loading.value = true
    try {
      const response = await api.get('/api/notifications')
      if (response.data?.success) {
        notifications.value = response.data.data
      }
    } catch (e: any) {
      console.error('Error fetching notifications:', e)
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id: number) {
    try {
      const response = await api.put(`/api/notifications/${id}/mark-read`)
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
      const response = await api.put('/api/notifications/mark-all-read')
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
    markAsRead,
    markAllAsRead
  }
})
