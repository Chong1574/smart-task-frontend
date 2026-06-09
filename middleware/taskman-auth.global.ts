export default defineNuxtRouteMiddleware((to, from) => {
    // Solo proteger rutas que empiecen con /taskman y que NO sean /login o auth-callback
    if (to.path.startsWith('/taskman') && !to.path.includes('/login') && !to.path.includes('/auth-callback')) {
        let isAuthenticated = false;
        if (typeof window !== 'undefined') {
            isAuthenticated = !!localStorage.getItem('token');
        }
        
        if (!isAuthenticated) {
            return navigateTo('/login');
        }
    }
});
