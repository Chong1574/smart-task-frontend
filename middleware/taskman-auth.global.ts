export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.startsWith('/taskman')) return;
    if (
        to.path.includes('/login') ||
        to.path.includes('/auth-callback') ||
        to.path.includes('/verify-email') ||
        to.path.includes('/reset-password')
    ) return;

    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    if (!token) {
        try { token = useCookie('token', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' }).value || null; } catch {}
    }

    if (!token) {
        return navigateTo('/login');
    }
});
