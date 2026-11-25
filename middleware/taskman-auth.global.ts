import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.path.startsWith('/taskman')) return;
    if (
        to.path.includes('/login') ||
        to.path.includes('/auth-callback') ||
        to.path.includes('/verify-email') ||
        to.path.includes('/reset-password')
    ) return;

    if (import.meta.server) return;

    const authStore = useAuthStore();
    await authStore.init();

    if (!authStore.token) {
        return navigateTo('/login');
    }

    const isAdminRoute =
        to.path === '/taskman/impresion-3d' ||
        to.path.startsWith('/taskman/impresion-3d/') ||
        to.path === '/taskman/admin' ||
        to.path.startsWith('/taskman/admin/');

    if (isAdminRoute && authStore.user?.role !== 'admin') {
        return navigateTo('/taskman');
    }
});
