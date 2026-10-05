<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="cart.isOpen"
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300"
      @click="cart.closeCart()"
    ></div>

    <!-- Drawer -->
    <div
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card shadow-2xl border-l border-border transform transition-transform duration-300 ease-in-out flex flex-col"
      :class="cart.isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-2xl font-serif font-bold text-foreground">Tu Carrito</h2>
        <button
          type="button"
          class="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          @click="cart.closeCart()"
          aria-label="Cerrar carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Items List -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div v-if="cart.items.length === 0" class="text-center text-muted-foreground mt-12 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-50"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>Tu carrito está vacío.</p>
        </div>
        
        <div
          v-else
          v-for="item in cart.items"
          :key="item.id"
          class="flex gap-4 p-4 rounded-xl border border-border/60 bg-background"
        >
          <div class="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">Sin img</div>
          </div>
          
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between items-start gap-2">
              <div>
                <h3 class="font-medium text-sm text-foreground line-clamp-2 leading-tight">{{ item.title }}</h3>
                <p v-if="item.variantName" class="text-xs text-muted-foreground mt-1">{{ item.variantName }}</p>
              </div>
              <button
                @click="cart.removeItem(item.id)"
                class="text-muted-foreground hover:text-destructive flex-shrink-0"
                aria-label="Eliminar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
            
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center border border-border rounded-lg bg-secondary/30">
                <button
                  class="px-2 py-1 text-muted-foreground hover:text-foreground"
                  @click="cart.updateQuantity(item.id, item.quantity - 1)"
                >
                  -
                </button>
                <span class="px-2 text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                <button
                  class="px-2 py-1 text-muted-foreground hover:text-foreground"
                  @click="cart.updateQuantity(item.id, item.quantity + 1)"
                >
                  +
                </button>
              </div>
              <div class="font-semibold text-primary">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Checkout -->
      <div v-if="cart.items.length > 0" class="border-t border-border p-6 bg-background/50 backdrop-blur-sm">
        
        <div class="mb-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p>Algunas piezas podrían imprimirse en 3D <strong>bajo demanda</strong>. El tiempo máximo de producción se calculará en el siguiente paso.</p>
        </div>

        <div class="flex justify-between items-center mb-6">
          <span class="text-muted-foreground font-medium">Subtotal</span>
          <span class="text-2xl font-bold">{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <button
          @click="checkout"
          class="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex justify-center items-center gap-2"
        >
          Proceder con el pedido
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
        <p class="text-xs text-center text-muted-foreground mt-4">
          El costo de envío será calculado automáticamente en el Checkout.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const router = useRouter();

function formatPrice(amount: number) {
  if (amount === 0) return 'Gratis';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(amount);
}

function checkout() {
  cart.closeCart();
  router.push('/checkout');
}
</script>
