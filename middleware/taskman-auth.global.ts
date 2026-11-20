import { Preferences } from '@capacitor/preferences';
import { useAuthStore } from '~/stores/auth';
import { setMemoryToken } from '~/utils/api';
import { API_URL } from '~/utils/apiUrl';

export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.path.startsWith('/taskman')) return;
    if (
        to.path.includes('/login') ||
        to.path.includes('/auth-callback') ||
        to.path.includes('/verify-email') ||
        to.path.includes('/reset-password')
    ) return;

    let token: string | null = null;

    try {
        const { value } = await Preferences.get({ key: 'token' });
        token = value;
    } catch (e) {}

    if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    if (!token) {
        try { token = useCookie('token', { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' }).value || null; } catch {}
    }

    if (!token) {
        return navigateTo('/login');
    }

    setMemoryToken(token);

    const isAdminRoute =
        to.path === '/taskman/impresion-3d' ||
        to.path.startsWith('/taskman/impresion-3d/') ||
        to.path === '/taskman/admin' ||
        to.path.startsWith('/taskman/admin/');

    if (isAdminRoute) {
        const authStore = useAuthStore();
        await authStore.init();
        if (!authStore.token) {
            authStore.token = token;
        }

        if (!authStore.user?.role) {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.status === 401) {
                    setMemoryToken(null);
                    return navigateTo('/login');
                }
                if (res.ok) {
                    const json: any = await res.json();
                    if (json?.data) {
                        authStore.user = { ...(authStore.user || {}), ...json.data };
                        if (typeof window !== 'undefined') {
                            const userStr = JSON.stringify(authStore.user);
                            localStorage.setItem('user', userStr);
                            await Preferences.set({ key: 'user', value: userStr }).catch(() => {});
                        }
                    }
                }
            } catch {}
        }

        if (authStore.user?.role !== 'admin') {
            return navigateTo('/taskman');
        }
    }
});
