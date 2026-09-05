import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';
import api from '../utils/api';
import { API_URL } from '../utils/apiUrl';

// ponytail: SameSite=Lax + Secure — evita que PWAs en iOS descarten cookie en inicio (navegación cross-site de home screen)
const TOKEN_COOKIE_OPTS = { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' as const, secure: true };

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
        hasCalendarConnected: (state) => !!state.user?.hasCalendarConnected,
    },

    actions: {
        async init() {
            if (!this.isInitialized) {
                let token: string | null = null;
                let userStr: string | null = null;

                try {
                    const resToken = await Preferences.get({ key: 'token' });
                    token = resToken.value;
                    const resUser = await Preferences.get({ key: 'user' });
                    userStr = resUser.value;
                } catch (e) {}

                // localStorage es la fuente de verdad fallback (confiable en SPA)
                if (!token && typeof window !== 'undefined') {
                    token = localStorage.getItem('token');
                    if (!userStr) userStr = localStorage.getItem('user');
                }

                if (userStr && userStr !== 'undefined') {
                    try {
                        this.user = JSON.parse(userStr);
                    } catch (e) {
                        this.user = null;
                    }
                }

                // Fallback a cookie si localStorage no tiene token
                if (!token) {
                    try { token = useCookie('token', TOKEN_COOKIE_OPTS).value || null; } catch {}
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

        async setSession(token: string, user: any) {
            this.token = token;
            this.user = user;
            const userStr = JSON.stringify(user);
            
            try {
                await Preferences.set({ key: 'token', value: token });
                await Preferences.set({ key: 'user', value: userStr });
            } catch (e) {}

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', userStr);
                localStorage.removeItem('oauth_login');
                localStorage.removeItem('google_sync_enabled');
                document.cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
            }
            try { useCookie('token', TOKEN_COOKIE_OPTS).value = token; } catch {}
        },

        async logout() {
            this.token = null;
            this.user = null;

            try {
                await Preferences.remove({ key: 'token' });
                await Preferences.remove({ key: 'user' });
            } catch (e) {}

            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('oauth_login');
                localStorage.removeItem('google_sync_enabled');
                document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax; Secure';
            }
            try { useCookie('token', TOKEN_COOKIE_OPTS).value = null; } catch {}
        },

        async updateProfile(patch: { name?: string | null }) {
            try {
                const res = await api.put('/auth/me', patch);
                if (res.data?.success) {
                    this.user = { ...this.user, ...res.data.data };
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(this.user));
                    }
                    return true;
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || 'No se pudo actualizar el perfil';
            }
            return false;
        },

        async handleAuthCallback(token: string) {
            this.token = token;

            try {
                await Preferences.set({ key: 'token', value: token });
            } catch (e) {}

            // localStorage primero (confiable), cookie como respaldo
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('oauth_login', 'true');
                document.cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
            }
            try { useCookie('token', TOKEN_COOKIE_OPTS).value = token; } catch {}

            // Bootstrap desde el JWT (id + email); role/plan se hidratan con /auth/me.
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.user = { id: payload.userId, email: payload.email, name: null };
            } catch (e) {
                console.error("Failed to decode token", e);
            }

            // Fetch role/plan reales. Si falla no rompe el login — el user queda sin admin gate.
            // Restaurar token si el interceptor 401 lo borró por un glitch transitorio.
            try {
                const res = await api.get('/auth/me');
                if (res.data?.success && res.data.data) {
                    this.user = { ...this.user, ...res.data.data };
                    const userStr = JSON.stringify(this.user);
                    try { await Preferences.set({ key: 'user', value: userStr }); } catch (e) {}
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', userStr);
                    }
                }
            } catch (err) {
                console.error('handleAuthCallback: /auth/me falló', err);
                // Re-guardar token — pudo haber sido borrado por el interceptor 401 durante este await
                if (typeof window !== 'undefined') {
                    if (!localStorage.getItem('token')) localStorage.setItem('token', token);
                    if (this.user) localStorage.setItem('user', JSON.stringify(this.user));
                }
                try {
                    await Preferences.set({ key: 'token', value: token });
                    if (this.user) await Preferences.set({ key: 'user', value: JSON.stringify(this.user) });
                } catch (e) {}
            }
        }
    }
});
