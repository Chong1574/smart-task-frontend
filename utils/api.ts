import axios from 'axios';
import { toast } from 'vue-sonner';
import { API_URL } from './apiUrl';

const api = axios.create({
    baseURL: API_URL,
});

const readToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const ls = localStorage.getItem('token');
        if (ls) return ls;
    }
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
        if (match) return decodeURIComponent(match[1]);
    }
    return null;
};

const clearAuthArtifacts = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('oauth_login');
    localStorage.removeItem('google_sync_enabled');
    document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax';
};

api.interceptors.request.use((config) => {
    const token = readToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
        const url = error.config?.url || '';
        const isOAuthEndpoint = url.includes('/oauth/');
        const hasToken = !!readToken();
        const msg = data?.message || '';

        console.error(`[API 401] URL: "${url}" | isOAuth: ${isOAuthEndpoint} | hasToken: ${hasToken}`);

        // Solo limpiar sesión si el backend confirma que el token de SESIÓN es inválido.
        // No destruir la sesión por errores transitorios, endpoints OAuth, o missing calendar scope.
        const code = data?.code || '';
        const msgLower = msg.toLowerCase();
        const isTokenRejected = code === 'TOKEN_INVALID'
            || msgLower.includes('invalid') || msgLower.includes('expired') || msgLower.includes('no token');
        const isCalendarScope = code === 'CALENDAR_NOT_CONNECTED';
        if (hasToken && !isOAuthEndpoint && isTokenRejected && !isCalendarScope) {
            console.warn('[API] Token rechazado por el backend, cerrando sesión...');
            clearAuthArtifacts();
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
    }

    // Plan-limit del backend (planlimits.middleware): 403 con code=PLAN_LIMIT_REACHED.
    // Mostrar toast explicando qué recurso y cuál es el tope, para que el usuario no
    // vea un fail silencioso del formulario.
    if (status === 403 && data?.code === 'PLAN_LIMIT_REACHED') {
        toast.error(data.message || `Límite del plan free alcanzado (${data.resource})`, {
            description: `Máx ${data.limit} ${data.resource}. Cambia a premium para más.`,
            duration: 6000
        });
    }

    return Promise.reject(error);
});

export default api;
