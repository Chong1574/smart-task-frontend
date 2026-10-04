<template>
  <div class="container max-w-2xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-serif font-bold mb-8 text-center">Rastrear Pedido</h1>

    <div v-if="!order" class="bg-card border border-border p-8 rounded-3xl shadow-sm">
      <p class="text-muted-foreground text-center mb-8">
        Ingresa tu número de pedido y el correo electrónico con el que realizaste la compra para ver el estado de tu pedido.
      </p>

      <form @submit.prevent="trackOrder" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Número de Pedido</label>
          <input v-model="form.id" type="number" required class="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. 123">
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Correo Electrónico</label>
          <input v-model="form.email" type="email" required class="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. tu@correo.com">
        </div>

        <button type="submit" :disabled="isLoading" class="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4">
          {{ isLoading ? 'Buscando...' : 'Rastrear' }}
        </button>
      </form>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-border pb-6">
          <div>
            <h2 class="text-2xl font-bold">Pedido #{{ order.id }}</h2>
            <p class="text-muted-foreground text-sm mt-1">{{ formatDate(order.createdAt) }}</p>
          </div>
          
          <div :class="statusConfig[order.status]?.bg || 'bg-gray-100 dark:bg-gray-800'" class="px-4 py-2 rounded-full flex items-center gap-2">
            <span :class="statusConfig[order.status]?.dot || 'bg-gray-500'" class="w-2.5 h-2.5 rounded-full"></span>
            <span :class="statusConfig[order.status]?.text || 'text-gray-700 dark:text-gray-300'" class="font-medium text-sm">
              {{ statusConfig[order.status]?.label || order.status }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="font-bold mb-4 uppercase text-xs tracking-wider text-muted-foreground">Artículos</h3>
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex gap-4">
                <div class="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                  <img v-if="item.productImage" :src="item.productImage" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-medium text-sm">{{ item.productName }}</p>
                  <p v-if="item.variantName" class="text-xs text-muted-foreground mt-0.5">Variante: {{ item.variantName }}</p>
                  <p class="text-sm font-medium mt-1">x{{ item.quantity }} &middot; {{ formatPrice(item.priceAtPurchase) }}</p>
                </div>
              </div>
            </div>
            
            <div class="mt-6 border-t border-border pt-4">
              <div class="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-bold mb-4 uppercase text-xs tracking-wider text-muted-foreground">Datos de Envío</h3>
            <div v-if="parsedAddress" class="text-sm space-y-1 bg-secondary/30 p-4 rounded-xl">
              <p class="font-bold">{{ parsedAddress.customer?.name }}</p>
              <p>{{ parsedAddress.customer?.street }} {{ parsedAddress.customer?.number }}</p>
              <p>Col. {{ parsedAddress.customer?.neighborhood }}, C.P. {{ parsedAddress.customer?.zip }}</p>
              <p>{{ parsedAddress.customer?.city }}, {{ parsedAddress.customer?.state }}</p>
              <p class="mt-2 text-muted-foreground">Método: {{ parsedAddress.shippingMethod?.name || 'Local' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button @click="order = null; form.id = '';" class="text-primary font-medium hover:underline">
          &larr; Rastrear otro pedido
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';

const route = useRoute();

const form = ref({
  id: '',
  email: ''
});

const isLoading = ref(false);
const order = ref<any>(null);

onMounted(() => {
  if (route.query.id) {
    form.value.id = route.query.id as string;
  }
});

const statusConfig: Record<string, any> = {
  'PENDING': { label: 'Recibido / Pendiente', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  'PRINTING': { label: 'En Producción', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  'READY_TO_SHIP': { label: 'Listo para Envío', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  'COMPLETED': { label: 'Enviado', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  'CANCELLED': { label: 'Cancelado', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' }
};

const parsedAddress = computed(() => {
  if (!order.value?.shippingAddress) return null;
  try {
    return JSON.parse(order.value.shippingAddress);
  } catch {
    return null;
  }
});

function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function formatDate(isoDate: string) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function trackOrder() {
  if (!form.value.id || !form.value.email) return;

  isLoading.value = true;
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

  try {
    const response = await fetch(`${apiUrl}/orders/track?id=${form.value.id}&email=${encodeURIComponent(form.value.email)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al rastrear pedido');
    }

    order.value = data.order;
    toast.success('Pedido encontrado');
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || 'No se encontró el pedido o el correo no coincide.');
  } finally {
    isLoading.value = false;
  }
}
</script>
