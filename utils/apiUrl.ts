// Resolución única del base URL del backend. Antes vivía duplicado en 4 sitios y
// silenciosamente divergían (typo en uno, olvido de `/api` en otro).
//
// Prioridad:
//   1) VITE_API_URL / VITE_API_BASE_URL — respeta si ya tiene sufijo `/api`, si no lo agrega.
//   2) Prod (hostname != localhost) → https://taskapi.shongyi.com/api.
//   3) Dev → http://localhost:3000/api.
export const API_URL: string = (() => {
    const env = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    if (env) return env.endsWith('/api') ? env : `${env}/api`;
    const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    return isProd ? 'https://taskapi.shongyi.com/api' : 'http://localhost:3000/api';
})();
