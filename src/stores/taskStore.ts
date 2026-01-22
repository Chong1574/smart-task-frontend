import { defineStore } from 'pinia'

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
}

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [] as Task[],
        loading: false
    }),
    actions: {
        addTask(newTask: Task) {
            // Creamos el objeto final con ID temporal y status default
            const taskToSave: Task = {
                ...newTask,
                id: Date.now(),
                status: 'pending'
            }

            this.tasks.push(taskToSave)

            // Simulación de logs para depuración del flujo
            if (newTask.auto_distribute) {
                console.log('⚡ [Auto-Scheduler] Activado para:', taskToSave.title)
                console.log(`   - Dividir ${taskToSave.duration_minutes} min en bloques`)
                console.log(`   - Fecha límite: ${taskToSave.deadline}`)
            } else {
                console.log('📅 [Standard] Tarea agendada como bloque fijo único')
            }
        }
    }
})