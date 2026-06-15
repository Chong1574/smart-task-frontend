export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.startsWith('/taskman')) return;
    if (to.path.includes('/login') || to.path.includes('/auth-callback')) return;

    const tokenCookie = useCookie('token', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' });
    let token = tokenCookie.value || null;

    if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        if (token) tokenCookie.value = token;
    }

    if (!token) {
        return navigateTo('/login');
    }
});
