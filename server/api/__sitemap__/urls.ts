import { defineEventHandler } from 'h3';

interface ProductItem {
  id: number | string;
  title?: string;
  imageUrl?: string;
  updatedAt?: string;
}

export default defineEventHandler(async () => {
  try {
    // Fetch active products from backend API (with timeout fallback)
    const products = await $fetch<ProductItem[]>('https://taskapi.shongyi.com/api/products', {
      timeout: 8000
    });

    if (!Array.isArray(products)) {
      return [];
    }

    return products.map(p => ({
      loc: `/bazar?p=${p.id}`,
      lastmod: p.updatedAt || undefined,
      images: p.imageUrl ? [{ loc: p.imageUrl, title: p.title || 'Producto' }] : []
    }));
  } catch (err) {
    console.error('[sitemap] Failed to load products from taskapi:', err);
    return [];
  }
});
