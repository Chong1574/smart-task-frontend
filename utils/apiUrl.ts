// Resolución única del base URL del backend.
//
// Prioridad:
//   1) NUXT_PUBLIC_API_BASE (runtimeConfig.public.apiBase) / VITE_API_URL / VITE_API_BASE_URL
//   2) Prod (hostname != localhost o SSR en prod) → https://taskapi.shongyi.com/api.
//   3) Dev → http://localhost:3000/api.
const getRuntimeApiBase = (): string | undefined => {
    try {
        const cfg = useRuntimeConfig();
        if (cfg?.public?.apiBase) return String(cfg.public.apiBase);
    } catch {}
    if (typeof window !== 'undefined' && (window as any).__NUXT__?.config?.public?.apiBase) {
        return String((window as any).__NUXT__.config.public.apiBase);
    }
    if (typeof process !== 'undefined' && process.env?.NUXT_PUBLIC_API_BASE) {
        return process.env.NUXT_PUBLIC_API_BASE;
    }
    return undefined;
};

export const API_URL: string = (() => {
    const env = getRuntimeApiBase()
        || import.meta.env.NUXT_PUBLIC_API_BASE
        || import.meta.env.VITE_API_URL
        || import.meta.env.VITE_API_BASE_URL;
    if (env) return env.endsWith('/api') ? env : `${env}/api`;
    const isClient = typeof window !== 'undefined';
    const isProd = isClient
        ? window.location.hostname !== 'localhost'
        : (import.meta.env.PROD || process.env.NODE_ENV === 'production');
    return isProd ? 'https://taskapi.shongyi.com/api' : 'http://localhost:3000/api';
})();
