import { ofetch, type FetchOptions } from 'ofetch';
import { toast } from 'vue-sonner';
import { Preferences } from '@capacitor/preferences';
import { API_URL } from './apiUrl';

export interface ApiRequestConfig {
    params?: Record<string, any>;
    query?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    signal?: AbortSignal;
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
    data?: any;
    url?: string;
    method?: string;
}

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    headers: Headers;
}

const fetcher = ofetch.create({
    baseURL: API_URL,
});

let memoryToken: string | null = null;

export const setMemoryToken = (token: string | null) => {
    if (typeof window === 'undefined') return;
    memoryToken = token;
};

export const getMemoryToken = () => (typeof window === 'undefined' ? null : memoryToken);

const readTokenAsync = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    if (memoryToken) return memoryToken;

    try {
        const { value } = await Preferences.get({ key: 'token' });
        if (value) {
            memoryToken = value;
            return value;
        }
    } catch {}

    const ls = localStorage.getItem('token');
    if (ls) {
        memoryToken = ls;
        return ls;
    }

    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
        if (match) {
            const val = decodeURIComponent(match[1]);
            memoryToken = val;
            return val;
        }
    }
    return null;
};

const clearAuthArtifactsAsync = async () => {
    if (typeof window === 'undefined') return;
    memoryToken = null;
    try {
        await Preferences.remove({ key: 'token' });
        await Preferences.remove({ key: 'user' });
    } catch {}

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('oauth_login');
    localStorage.removeItem('google_sync_enabled');
    document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax; Secure';
};

async function execute<T = any>(
    method: string,
    url: string,
    body?: any,
    config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
    const token = await readTokenAsync();
    const headers: Record<string, string> = { ...(config.headers || {}) };
    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions: FetchOptions = {
        method,
        headers,
        query: config.query || config.params,
        timeout: config.timeout,
        signal: config.signal,
    };

    if (body !== undefined) {
        fetchOptions.body = body;
    }
    if (config.responseType === 'blob') {
        fetchOptions.responseType = 'blob';
    } else if (config.responseType === 'arrayBuffer') {
        fetchOptions.responseType = 'arrayBuffer';
    } else if (config.responseType === 'text') {
        fetchOptions.responseType = 'text';
    } else if (config.responseType === 'stream') {
        fetchOptions.responseType = 'stream';
    }

    try {
        const response = await fetcher.raw<T>(url, fetchOptions as any);
        return {
            data: response._data as T,
            status: response.status,
            headers: response.headers,
        };
    } catch (err: any) {
        const status: number | undefined = err?.response?.status ?? err?.statusCode ?? err?.status;
        const data: any = err?.data ?? err?.response?._data;

        if (status === 401) {
            const isOAuthEndpoint = url.includes('/oauth/');
            const hasToken = Boolean(headers.Authorization);
            const msg = String(data?.message || '');

            console.error(`[API 401] URL: "${url}" | isOAuth: ${isOAuthEndpoint} | hasToken: ${hasToken}`);

            const code = String(data?.code || '');
            const msgLower = msg.toLowerCase();
            const isTokenRejected =
                code === 'TOKEN_INVALID' ||
                msgLower.includes('invalid') ||
                msgLower.includes('expired') ||
                msgLower.includes('no token');
            const isCalendarScope = code === 'CALENDAR_NOT_CONNECTED';

            if (hasToken && !isOAuthEndpoint && isTokenRejected && !isCalendarScope) {
                console.warn('[API] Token rechazado por el backend, cerrando sesión...');
                clearAuthArtifactsAsync();
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:logout'));
                }
            }
        }

        if (status === 403 && data?.code === 'PLAN_LIMIT_REACHED' && typeof window !== 'undefined') {
            toast.error(data.message || `Límite del plan free alcanzado (${data.resource})`, {
                description: `Máx ${data.limit} ${data.resource}. Cambia a premium para más.`,
                duration: 6000,
            });
        }

        const normalized: any = err instanceof Error ? err : new Error(String(err));
        normalized.response = status !== undefined || data !== undefined ? { status, data } : undefined;
        normalized.config = { url, headers };
        throw normalized;
    }
}

const api = {
    defaults: {
        baseURL: API_URL,
    },
    get<T = any>(url: string, config?: ApiRequestConfig) {
        return execute<T>('GET', url, undefined, config);
    },
    delete<T = any>(url: string, config?: ApiRequestConfig) {
        return execute<T>('DELETE', url, config?.data, config);
    },
    post<T = any>(url: string, data?: any, config?: ApiRequestConfig) {
        return execute<T>('POST', url, data, config);
    },
    put<T = any>(url: string, data?: any, config?: ApiRequestConfig) {
        return execute<T>('PUT', url, data, config);
    },
    patch<T = any>(url: string, data?: any, config?: ApiRequestConfig) {
        return execute<T>('PATCH', url, data, config);
    },
    request<T = any>(config: ApiRequestConfig & { url: string }) {
        return execute<T>(config.method || 'GET', config.url, config.data, config);
    },
};

export default api;
