import { defineStore } from 'pinia';
import axios from 'axios';

const baseEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_URL = baseEnvUrl
    ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
    : 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        loading: false,
        error: null as string | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.post(`${API_URL}/auth/login`, { email, password });
                this.setSession(res.data.data.token, res.data.data.user);
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.post(`${API_URL}/auth/register`, { email, password });
                this.setSession(res.data.data.token, res.data.data.user);
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Registration failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        setSession(token: string, user: any) {
            this.token = token;
            this.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            // Login normal: aseguramos que NO quede el flag de OAuth ni el sync de Google
            localStorage.removeItem('oauth_login');
            localStorage.removeItem('google_sync_enabled');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('oauth_login');
            localStorage.removeItem('google_sync_enabled');
            delete axios.defaults.headers.common['Authorization'];
        },

        // Usado por OAuth callbacks (Google, Microsoft)
        handleAuthCallback(token: string) {
            this.token = token;
            localStorage.setItem('token', token);
            // Marcamos que este usuario entró por OAuth
            // Esto permite que CalendarView active la sincronización con Google
            localStorage.setItem('oauth_login', 'true');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
});
