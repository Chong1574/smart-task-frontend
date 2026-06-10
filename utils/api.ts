import axios from 'axios';

// Since we are in Nuxt, we can use useRuntimeConfig or environment variables.
// The backend is on the same domain usually, or we can fallback to localhost for dev.
const baseEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_URL = baseEnvUrl
    ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? 'https://taskapi.shongyi.com/api' : 'http://localhost:3000/api');

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use((config) => {
    // Only access localStorage in client side
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores 401 (token expirado o inválido)
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        const url = error.config?.url || '';
        const isOAuthEndpoint = url.includes('/oauth/');
        let hasToken = false;
        
        if (typeof window !== 'undefined') {
            hasToken = !!localStorage.getItem('token');
        }

        console.error(`[API 401] URL: "${url}" | isOAuth: ${isOAuthEndpoint} | hasToken: ${hasToken}`);

        if (hasToken && !isOAuthEndpoint) {
            console.warn('[API] Sesión inválida, redirigiendo al login...');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Dispara el evento para que Nuxt haga la redirección (manejado en app.vue o layouts)
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
    }
    return Promise.reject(error);
});

export default api;
