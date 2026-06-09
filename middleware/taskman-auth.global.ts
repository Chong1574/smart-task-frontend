export default defineNuxtRouteMiddleware((to, from) => {
    // Solo proteger rutas que empiecen con /taskman y que NO sean /login o auth-callback
    if (to.path.startsWith('/taskman') && !to.path.includes('/login') && !to.path.includes('/auth-callback')) {
        const tokenCookie = useCookie('token');
        const isAuthenticated = !!tokenCookie.value;
        
        if (!isAuthenticated) {
            return navigateTo('/login');
        }
    }
});
