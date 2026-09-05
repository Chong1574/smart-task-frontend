import { defineStore } from 'pinia';
import api from '../utils/api';

export interface Task {
    id?: number;
    title: string;
    category?: string;
    duration_minutes: number;
    deadline?: string;
    auto_distribute?: boolean;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    budget?: number;
    priority?: 'high' | 'medium' | 'low';
    projectId?: number;
    goalId?: number;
    blocks?: any[];
}

export interface Project {
    id?: number;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'archived';
    tasks?: Task[];
}

export interface Goal {
    id?: number;
    title: string;
    description?: string;
    targetDate?: string;
    status: 'active' | 'completed' | 'abandoned';
    projects?: Project[];
    tasks?: Task[];
}

export interface Habit {
    id?: number;
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'custom';
    status: 'active' | 'archived';
    logs?: HabitLog[];
}

export interface HabitLog {
    id?: number;
    habitId: number;
    completedAt: string;
}

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [] as Task[],
        projects: [] as Project[],
        goals: [] as Goal[],
        habits: [] as Habit[],
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchTasks() {
            this.loading = true;
            try {
                const res = await api.get('/tasks');
                if (res.data.success) {
                    // ponytail: backend usa camelCase (autoDistribute); alias para que la UI (snake_case) lea el valor real.
                    this.tasks = res.data.data.map((t: any) => ({ ...t, auto_distribute: t.autoDistribute ?? false }));
                }
            } catch (err) {
                console.error("Error fetching tasks:", err);
            } finally {
                this.loading = false;
            }
        },

        async addTask(newTask: Task) {
            // Optimistic update
            const tempId = Date.now();
            this.tasks.push({ ...newTask, id: tempId });
            
            try {
                const res = await api.post('/tasks', newTask);
                if (res.data.success) {
                    await this.fetchTasks();
                    return true;
                } else {
                    this.tasks = this.tasks.filter(t => t.id !== tempId);
                    return false;
                }
            } catch (err) {
                console.error("Error adding task:", err);
                this.tasks = this.tasks.filter(t => t.id !== tempId);
                return false;
            }
        },

        async updateTask(id: number, updates: Partial<Task>) {
            try {
                const res = await api.put(`/tasks/${id}`, updates);
                if (res.data.success) {
                    await this.fetchTasks();
                    return true;
                }
                return false;
            } catch (err) {
                console.error("Error updating task:", err);
                return false;
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

        // --- Projects ---
        async fetchProjects() {
            this.loading = true;
            try {
                const res = await api.get('/projects');
                if (res.data.success) {
                    this.projects = res.data.data;
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                this.loading = false;
            }
        },

        async addProject(newProject: Project) {
            // Optimistic update
            const tempId = Date.now();
            this.projects.push({ ...newProject, id: tempId, tasks: [] });

            try {
                const res = await api.post('/projects', newProject);
                if (res.data.success) {
                    await this.fetchProjects();
                    return true;
                } else {
                    this.projects = this.projects.filter(p => p.id !== tempId);
                    return false;
                }
            } catch (err) {
                console.error("Error adding project:", err);
                this.projects = this.projects.filter(p => p.id !== tempId);
                return false;
            }
        },

        async updateProject(id: number, updates: Partial<Project>) {
            try {
                const res = await api.put(`/projects/${id}`, updates);
                if (res.data.success) {
                    await this.fetchProjects();
                }
            } catch (err) {
                console.error("Error updating project:", err);
            }
        },

        async deleteProject(id: number) {
            try {
                const res = await api.delete(`/projects/${id}`);
                if (res.data.success) {
                    this.projects = this.projects.filter(p => p.id !== id);
                }
            } catch (err) {
                console.error("Error deleting project:", err);
            }
        },

        async reorderProjects(projectIds: number[]) {
            try {
                const res = await api.post('/projects/reorder', { projectIds });
                if (res.data.success) {
                    // Update successfully
                }
            } catch (err) {
                console.error("Error reordering projects:", err);
            }
        },

        // --- Habits ---
        async fetchHabits() {
            this.loading = true;
            try {
                const res = await api.get('/habits');
                if (res.data.success) {
                    this.habits = res.data.data;
                }
            } catch (err) {
                console.error("Error fetching habits:", err);
            } finally {
                this.loading = false;
            }
        },

        async addHabit(newHabit: Habit) {
            try {
                const res = await api.post('/habits', newHabit);
                if (res.data.success) {
                    await this.fetchHabits();
                    return true;
                }
                return false;
            } catch (err) {
                console.error("Error adding habit:", err);
                return false;
            }
        },

        async logHabit(habitId: number) {
            const today = new Date();
            const localDateStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

            // Optimistic update
            const habit = this.habits.find(h => h.id === habitId);
            let tempLog: HabitLog | null = null;
            if (habit) {
                if (!habit.logs) habit.logs = [];
                // Use localDateStr for optimistic update to match exactly what we expect from backend
                tempLog = { id: Date.now(), habitId, completedAt: localDateStr + 'T00:00:00.000Z' };
                habit.logs.push(tempLog);
            }
            try {
                const res = await api.post(`/habits/${habitId}/log`, {
                    date: localDateStr,
                    status: 'completed'
                });
                if (res.data.success) {
                    await this.fetchHabits();
                    return true;
                } else {
                    if (habit && tempLog) habit.logs = habit.logs.filter(l => l.id !== tempLog!.id);
                    return false;
                }
            } catch (err) {
                console.error("Error logging habit:", err);
                if (habit && tempLog) habit.logs = habit.logs.filter(l => l.id !== tempLog!.id);
                return false;
            }
        },

        async updateHabit(id: number, updates: Partial<Habit>) {
            try {
                const res = await api.put(`/habits/${id}`, updates);
                if (res.data.success) {
                    await this.fetchHabits();
                }
            } catch (err) {
                console.error("Error updating habit:", err);
            }
        },

        async deleteHabit(id: number) {
            try {
                const res = await api.delete(`/habits/${id}`);
                if (res.data.success) {
                    this.habits = this.habits.filter(h => h.id !== id);
                }
            } catch (err) {
                console.error("Error deleting habit:", err);
            }
        },

        // --- Roulette ---
        async spinRoulette(projectIds?: number[]) {
            this.loading = true;
            try {
                const res = await api.post('/roulette/spin', { projectIds });
                if (res.data.success && res.data.data) {
                    return res.data.data;
                }
                return null;
            } catch (err) {
                console.error("Error spinning roulette:", err);
                return null;
            } finally {
                this.loading = false;
            }
        }
    }
});
