// Proxy de imágenes remotas — MakerWorld CDN es lento desde MX y sirve archivos grandes
// sin resize. Este helper redirige el request por un edge más cercano y aplica width+webp.
//
// Backend por VITE_IMG_PROXY:
//   'cf'   → Cloudflare Image Resizing en `shongyi.com/cdn-cgi/image/...` (requiere feature habilitada en CF Pages).
//   'wsrv' → wsrv.nl (proxy gratuito con TLS + resize on-the-fly; default hasta que activemos CF).
//   'none' → devuelve la URL tal cual (dev/localhost).
//
// Uso:
//   <img :src="imgProxy(product.imageUrl, { width: 600, quality: 75 })">
//
// ponytail: default 'wsrv' evita depender de un feature paga de CF. Cambiar a 'cf' en el .env
// de Pages una vez habilitado Image Resizing en el dashboard.

const PROXY_BACKEND = (import.meta.env.VITE_IMG_PROXY as string | undefined) || 'wsrv';
const CF_HOST = (import.meta.env.VITE_IMG_CF_HOST as string | undefined) || '';

export interface ImgProxyOpts {
    width?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpeg';
}

export function imgProxy(url: string | null | undefined, opts: ImgProxyOpts = {}): string {
    if (!url) return '';
    // URLs locales (R2 propio, dev) — no proxear.
    if (url.startsWith('/') || url.includes('cdn.shongyi.com') || url.includes('localhost')) return url;

    const { width = 600, quality = 75, format = 'auto' } = opts;

    if (PROXY_BACKEND === 'none') return url;

    if (PROXY_BACKEND === 'cf') {
        // Sirve por el mismo dominio → mejor cache + TLS de shongyi.com.
        const host = CF_HOST || (typeof window !== 'undefined' ? window.location.origin : '');
        return `${host}/cdn-cgi/image/width=${width},quality=${quality},format=${format}/${url}`;
    }

    // wsrv.nl — free, resize + webp, CDN global.
    const params = new URLSearchParams({
        url,
        w: String(width),
        q: String(quality),
        output: format === 'auto' ? 'webp' : format
    });
    return `https://wsrv.nl/?${params.toString()}`;
}

// Sugerencia de `srcset` responsive: 1x/2x para retinas.
export function imgProxySrcSet(url: string | null | undefined, baseWidth: number, quality = 75): string {
    if (!url) return '';
    const w1 = imgProxy(url, { width: baseWidth, quality });
    const w2 = imgProxy(url, { width: baseWidth * 2, quality });
    return `${w1} 1x, ${w2} 2x`;
}
