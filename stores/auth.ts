import { defineStore } from 'pinia';
import api from '../utils/api';
import { API_URL } from '../utils/apiUrl';

const TOKEN_COOKIE_OPTS = { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' as const };

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
                const tokenCookie = useCookie('token', TOKEN_COOKIE_OPTS);
                let token = tokenCookie.value || null;

                if (typeof window !== 'undefined') {
                    if (!token) {
                        token = localStorage.getItem('token');
                        if (token) tokenCookie.value = token;
                    }
                    const userStr = localStorage.getItem('user');
                    if (userStr && userStr !== 'undefined') {
                        try {
                            this.user = JSON.parse(userStr);
                        } catch (e) {
                            this.user = null;
                        }
                    }
                }
                this.token = token;
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

        async register(email: string, password: string, turnstileToken?: string) {
            this.loading = true;
            this.error = null;
            try {
                await api.post(`${API_URL}/auth/register`, { email, password, turnstileToken });
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Registration failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async verifyEmail(token: string) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.post(`${API_URL}/auth/verify-email`, { token });
                this.setSession(res.data.data.token, res.data.data.user);
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Verification failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async forgotPassword(email: string) {
            this.loading = true;
            this.error = null;
            try {
                await api.post(`${API_URL}/auth/forgot-password`, { email });
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Request failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(token: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                await api.post(`${API_URL}/auth/reset-password`, { token, password });
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Reset failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        setSession(token: string, user: any) {
            this.token = token;
            this.user = user;
            const tokenCookie = useCookie('token', TOKEN_COOKIE_OPTS);
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
            const tokenCookie = useCookie('token', TOKEN_COOKIE_OPTS);
            tokenCookie.value = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('oauth_login');
                localStorage.removeItem('google_sync_enabled');
            }
        },

        async handleAuthCallback(token: string) {
            this.token = token;
            const tokenCookie = useCookie('token', TOKEN_COOKIE_OPTS);
            tokenCookie.value = token;

            // Bootstrap desde el JWT (id + email); role/plan se hidratan con /auth/me.
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.user = { id: payload.userId, email: payload.email, name: null };
            } catch (e) {
                console.error("Failed to decode token", e);
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('oauth_login', 'true');
            }

            // Fetch role/plan reales. Si falla no rompe el login — el user queda sin admin gate.
            try {
                const res = await api.get('/auth/me');
                if (res.data?.success && res.data.data) {
                    this.user = { ...this.user, ...res.data.data };
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(this.user));
                    }
                }
            } catch (err) {
                console.error('handleAuthCallback: /auth/me falló', err);
                if (typeof window !== 'undefined' && this.user) {
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            }
        }
    }
});
