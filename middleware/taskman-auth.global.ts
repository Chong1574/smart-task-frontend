import { Preferences } from '@capacitor/preferences';

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
        try { token = useCookie('token', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' }).value || null; } catch {}
    }

    if (!token) {
        return navigateTo('/login');
    }
});
