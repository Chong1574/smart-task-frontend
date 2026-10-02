import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export interface CartItem {
  id: string; // Unique ID for the cart item (e.g. productId + variantIdx)
  productId: number | string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variantName?: string;
}

export const useCartStore = defineStore('cart', () => {
  const items = useLocalStorage<CartItem[]>('bazar-cart-items', []);
  const isOpen = ref(false);

  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((acc, item) => acc + (item.price * item.quantity), 0));

  function toggleCart() {
    isOpen.value = !isOpen.value;
  }

  function openCart() {
    isOpen.value = true;
  }

  function closeCart() {
    isOpen.value = false;
  }

  function addItem(product: any, variantIdx: number = 0, quantity: number = 1) {
    const isVariant = Array.isArray(product.variants) && product.variants.length > 0;
    const variant = isVariant ? product.variants[variantIdx] : null;
    
    const price = variant 
      ? variant.price 
      : (product.priceFrom ?? (typeof product.price === 'number' ? product.price : parseFloat(String(product.price ?? 0))));

    const resolvedPrice = typeof price === 'number' ? price : 0;

    const image = (product.images && product.images.length > 0) 
      ? product.images[0] 
      : product.imageUrl;

    const cartItemId = variant ? `${product.id}-${variantIdx}` : `${product.id}-default`;

    const existingItem = items.value.find(item => item.id === cartItemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        id: cartItemId,
        productId: product.id,
        title: product.title,
        price: resolvedPrice,
        quantity,
        imageUrl: image,
        variantName: variant ? variant.name : undefined
      });
    }
  }

  function removeItem(cartItemId: string) {
    items.value = items.value.filter(item => item.id !== cartItemId);
  }

  function updateQuantity(cartItemId: string, quantity: number) {
    const item = items.value.find(i => i.id === cartItemId);
    if (item) {
      if (quantity <= 0) {
        removeItem(cartItemId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    toggleCart,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});
