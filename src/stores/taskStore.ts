import { defineStore } from 'pinia'
import api from '../api'

// Interfaz alineada con tu SQL y el motor de Node.js
export interface Task {
    id?: number
    title: string
    category: string
    duration_minutes: number
    deadline: string // Formato ISO: YYYY-MM-DDTHH:mm
    auto_distribute: boolean // Gatillo para el script de sesiones
    description: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    budget: number
    priority?: 'high' | 'medium' | 'low'
    blocks?: any[]
}

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [] as Task[],
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchTasks() {
            this.loading = true;
            try {
                const res = await api.get('/tasks');
                if (res.data.success) {
                    this.tasks = res.data.data;
                }
            } catch (err) {
                console.error("Error fetching tasks:", err);
            } finally {
                this.loading = false;
            }
        },

        async addTask(newTask: Task) {
            this.loading = true;
            try {
                const res = await api.post('/tasks', newTask);
                if (res.data.success) {
                    await this.fetchTasks();
                    return true;
                }
                return false;
            } catch (err) {
                console.error("Error adding task:", err);
                return false;
            } finally {
                this.loading = false;
            }
        },

        async deleteTask(id: number) {
            try {
                const res = await api.delete(`/tasks/${id}`);
                if (res.data.success) {
                    this.tasks = this.tasks.filter(t => t.id !== id);
                }
            } catch (err) {
                console.error("Error deleting task:", err);
            }
        },

        async updateTask(id: number, updates: Partial<Task>) {
            try {
                const res = await api.put(`/tasks/${id}`, updates);
                if (res.data.success) {
                    await this.fetchTasks();
                }
            } catch (err) {
                console.error("Error updating task:", err);
            }
        }
    }
})