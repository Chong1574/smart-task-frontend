import axios from 'axios';

const baseEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_URL = baseEnvUrl
    ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? 'https://taskapi.shongyi.com/api' : 'http://localhost:3000/api');

const api = axios.create({
    baseURL: API_URL,
});

const readToken = (): string | null => {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
        if (match) return decodeURIComponent(match[1]);
    }
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
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
    if (error.response?.status === 401) {
        const url = error.config?.url || '';
        const isOAuthEndpoint = url.includes('/oauth/');
        const hasToken = !!readToken();

        console.error(`[API 401] URL: "${url}" | isOAuth: ${isOAuthEndpoint} | hasToken: ${hasToken}`);

        if (hasToken && !isOAuthEndpoint) {
            console.warn('[API] Sesión inválida, redirigiendo al login...');
            clearAuthArtifacts();
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
    }
    return Promise.reject(error);
});

export default api;
