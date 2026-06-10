import { defineStore } from 'pinia';
import api from '../utils/api';

const baseEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_URL = baseEnvUrl
    ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? 'https://taskapi.shongyi.com/api' : 'http://localhost:3000/api');

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
        user: null as any,
        loading: false,
        error: null as string | null,
        isInitialized: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        init() {
            if (!this.isInitialized) {
                const tokenCookie = useCookie('token');
                this.token = tokenCookie.value || null;
                
                if (typeof window !== 'undefined') {
                    const userStr = localStorage.getItem('user');
                    if (userStr && userStr !== 'undefined') {
                        try {
                            this.user = JSON.parse(userStr);
                        } catch (e) {
                            this.user = null;
                        }
                    }
                }
                this.isInitialized = true;
            }
        },

        async login(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.post(`${API_URL}/auth/login`, { email, password });
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
                const res = await api.post(`${API_URL}/auth/register`, { email, password });
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
            const tokenCookie = useCookie('token');
            tokenCookie.value = token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.removeItem('oauth_login');
                localStorage.removeItem('google_sync_enabled');
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            const tokenCookie = useCookie('token');
            tokenCookie.value = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('oauth_login');
                localStorage.removeItem('google_sync_enabled');
            }
        },

        handleAuthCallback(token: string) {
            this.token = token;
            const tokenCookie = useCookie('token');
            tokenCookie.value = token;
            
            // Extract user info from JWT payload
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.user = {
                    id: payload.userId,
                    email: payload.email,
                    name: payload.email.split('@')[0]
                };
            } catch (e) {
                console.error("Failed to decode token", e);
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                if (this.user) {
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
                localStorage.setItem('oauth_login', 'true');
            }
        }
    }
});
