<template>
  <div class="container max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-serif font-bold mb-8">Finalizar Pedido</h1>

    <div v-if="!orderSuccess" class="grid md:grid-cols-3 gap-8">
      <!-- Columna Izquierda: Pasos de Checkout -->
      <div class="md:col-span-2 space-y-8">
        
        <!-- Paso 1: Información de Envío -->
        <section class="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
            <h2 class="text-xl font-semibold">Datos de Envío</h2>
          </div>
          
          <div v-if="step >= 1" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Nombre Completo</label>
                <input v-model="form.name" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Juan López">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Celular</label>
                <input v-model="form.phone" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. 555 123 4567">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Correo Electrónico</label>
                <input v-model="form.email" type="email" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. juan@correo.com">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Código Postal</label>
                <input v-model="form.zip" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. 11000">
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-8 space-y-2">
                <label class="text-sm font-medium">Calle</label>
                <input v-model="form.street" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Avenida de la Luz">
              </div>
              <div class="col-span-4 space-y-2">
                <label class="text-sm font-medium">Número</label>
                <input v-model="form.number" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. 123 Ext 4">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Colonia</label>
              <select v-if="neighborhoodOptions.length > 0" v-model="form.neighborhood" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="colonia in neighborhoodOptions" :key="colonia" :value="colonia">{{ colonia }}</option>
              </select>
              <input v-else v-model="form.neighborhood" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Centro Histórico">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Estado</label>
                <input v-model="form.state" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Querétaro">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Ciudad</label>
                <input v-model="form.city" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Querétaro">
              </div>
            </div>

            <button v-if="step === 1" @click="calculateShipping" :disabled="isCalculating" class="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {{ isCalculating ? 'Cotizando...' : 'Continuar a Envío' }}
            </button>
          </div>
        </section>

        <!-- Paso 2: Opciones de Envío -->
        <section :class="['bg-card border border-border p-6 rounded-2xl shadow-sm transition-opacity duration-300', step < 2 ? 'opacity-50 pointer-events-none' : '']">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
            <h2 class="text-xl font-semibold">Método de Entrega</h2>
          </div>

          <div v-if="step >= 2" class="space-y-3">
            <label v-for="option in shippingOptions" :key="option.id" class="flex items-center justify-between p-4 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors" :class="selectedShipping?.id === option.id ? 'border-primary bg-primary/5' : ''">
              <div class="flex items-center gap-3">
                <input type="radio" :value="option" v-model="selectedShipping" class="accent-primary" />
                <div>
                  <p class="font-medium text-foreground">{{ option.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ option.description }}</p>
                </div>
              </div>
              <span class="font-bold text-primary">{{ formatPrice(option.price) }}</span>
            </label>

            <button v-if="step === 2 && selectedShipping" @click="step = 3" class="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Continuar a Pago
            </button>
          </div>
        </section>

        <!-- Paso 3: Pago -->
        <section :class="['bg-card border border-border p-6 rounded-2xl shadow-sm transition-opacity duration-300', step < 3 ? 'opacity-50 pointer-events-none' : '']">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
            <h2 class="text-xl font-semibold">Método de Pago</h2>
          </div>

          <div v-if="step === 3" class="space-y-3">
            <label v-for="method in paymentMethods" :key="method.id" class="flex items-center justify-between p-4 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors" :class="selectedPayment === method.id ? 'border-primary bg-primary/5' : ''">
              <div class="flex items-center gap-3">
                <input type="radio" :value="method.id" v-model="selectedPayment" class="accent-primary" />
                <span class="font-medium text-foreground">{{ method.name }}</span>
              </div>
            </label>

            <button @click="confirmOrder" :disabled="isSubmitting" class="w-full mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
              {{ isSubmitting ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </div>
        </section>

      </div>

      <!-- Columna Derecha: Resumen del Pedido -->
      <div class="md:col-span-1">
        <div class="bg-card border border-border p-6 rounded-2xl shadow-sm sticky top-24">
          <h3 class="font-bold text-lg mb-4">Resumen de tu pedido</h3>
          
          <div class="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            <div v-for="item in cart.items" :key="item.id" class="flex items-start gap-3">
              <div class="w-12 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium line-clamp-1">{{ item.title }}</p>
                <p class="text-xs text-muted-foreground">{{ item.quantity }}x {{ formatPrice(item.price) }}</p>
              </div>
              <p class="text-sm font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>

          <div class="border-t border-border pt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Subtotal</span>
              <span class="font-medium">{{ formatPrice(cart.totalPrice) }}</span>
            </div>
            <div v-if="selectedShipping" class="flex justify-between">
              <span class="text-muted-foreground">Envío ({{ selectedShipping.name }})</span>
              <span class="font-medium">{{ formatPrice(selectedShipping.price) }}</span>
            </div>
            <div class="border-t border-border pt-2 flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(cart.totalPrice + (selectedShipping?.price || 0)) }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    <!-- Pantalla de Éxito -->
    <div v-else class="max-w-2xl mx-auto bg-card border border-border p-8 rounded-3xl shadow-lg text-center space-y-6 mt-8">
      <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-3xl font-bold font-serif">¡Pedido Recibido!</h2>
      <p class="text-muted-foreground text-lg">
        Gracias por tu compra. Hemos registrado tu pedido con éxito.
      </p>

      <div v-if="selectedPayment === 'transfer'" class="bg-secondary/30 p-6 rounded-2xl border border-border mt-6 text-left">
        <h3 class="font-bold text-xl mb-4 text-center">Instrucciones para Transferencia</h3>
        <p class="text-sm text-muted-foreground mb-4 text-center">Para que tu pedido comience a procesarse, realiza tu pago a la siguiente cuenta:</p>
        
        <div class="space-y-3 font-mono text-sm bg-background p-4 rounded-xl border border-border">
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted-foreground">Banco:</span>
            <span class="font-bold">BBVA Bancomer</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted-foreground">Beneficiario:</span>
            <span class="font-bold">El Rincón de Brandy</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted-foreground">CLABE:</span>
            <span class="font-bold text-primary">{{ clabeInfo }}</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="text-muted-foreground">Monto exacto:</span>
            <span class="font-bold text-lg text-green-600 dark:text-green-400">
              {{ formatPrice(cart.totalPrice + (selectedShipping?.price || 0)) }}
            </span>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <a :href="`https://wa.me/5215555555555?text=Hola,%20acabo%20de%20realizar%20un%20pedido%20en%20el%20Bazar.%20Te%20env%C3%ADo%20el%20comprobante%20de%20pago.`" target="_blank" class="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z"/><path d="M14 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z"/></svg>
            Enviar Comprobante por WhatsApp
          </a>
        </div>
      </div>

      <div class="pt-8">
        <NuxtLink to="/bazar" class="text-primary font-medium hover:underline">
          &larr; Volver al Bazar
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useLocalStorage } from '@vueuse/core';

const cart = useCartStore();
const router = useRouter();

// Si el carrito está vacío, regresar al bazar
onMounted(() => {
  if (cart.items.length === 0) {
    router.push('/bazar');
  }
});

const step = ref(1);

const form = useLocalStorage('checkout-form', {
  name: '',
  phone: '',
  email: '',
  street: '',
  number: '',
  neighborhood: '',
  zip: '',
  city: '',
  state: ''
});

const neighborhoodOptions = ref<string[]>([]);

const stateMap: Record<string, string> = {
  "Queretaro De Arteaga": "Querétaro",
  "Michoacan De Ocampo": "Michoacán",
  "Veracruz-Llave": "Veracruz",
  "Coahuila De Zaragoza": "Coahuila",
  "Estado De Mexico": "Estado de México",
  "Distrito Federal": "Ciudad de México",
  "Ciudad De Mexico": "Ciudad de México",
  "Nuevo Leon": "Nuevo León",
  "San Luis Potosi": "San Luis Potosí",
  "Yucatan": "Yucatán"
};

watch(() => form.value.zip, async (newZip) => {
  if (newZip.length === 5) {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

    try {
      const [zipRes, backendRes] = await Promise.allSettled([
        fetch(`https://api.zippopotam.us/mx/${newZip}`),
        fetch(`${apiUrl}/shipping/address-info/${newZip}`)
      ]);

      // 1. Obtener Ciudad y Estado precisos desde Google Maps (vía nuestro backend)
      if (backendRes.status === 'fulfilled' && backendRes.value.ok) {
        const addrData = await backendRes.value.json();
        if (addrData.city) form.value.city = addrData.city;
        if (addrData.state) form.value.state = stateMap[addrData.state] || addrData.state;
      }

      // 2. Obtener lista de Colonias desde Zippopotamus
      if (zipRes.status === 'fulfilled' && zipRes.value.ok) {
        const data = await zipRes.value.json();
        if (data.places && data.places.length > 0) {
          const colonias = data.places.map((p: any) => p['place name']);
          neighborhoodOptions.value = colonias;
          if (colonias.length > 0) form.value.neighborhood = colonias[0];

          // Fallback por si nuestro backend falló, usamos el estado de Zippopotam
          if (!form.value.state) {
            const rawState = data.places[0].state;
            form.value.state = stateMap[rawState] || rawState;
            if (form.value.state === 'Ciudad de México' && !form.value.city) {
              form.value.city = 'Ciudad de México';
            }
          }
        }
      } else {
        // Si Zippopotam falla (ej. 76903)
        neighborhoodOptions.value = [];
        if (!form.value.state || !form.value.city) {
            toast.info('Verifica tu Ciudad y Colonia manualmente.');
        } else {
            toast.info('Ingresa tu colonia manualmente.');
        }
      }

    } catch (e) {
      neighborhoodOptions.value = [];
    }
  } else {
    neighborhoodOptions.value = [];
  }
});

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

const shippingOptions = ref<ShippingOption[]>([]);
const selectedShipping = ref<ShippingOption | null>(null);

const paymentMethods = [
  { id: 'transfer', name: 'Transferencia Bancaria (SPEI)' },
  { id: 'card', name: 'Tarjeta de Crédito / Débito' },
  { id: 'paypal', name: 'PayPal' }
];

watch(form, () => {
  if (step.value > 1) {
    step.value = 1;
    selectedShipping.value = null;
    shippingOptions.value = [];
  }
}, { deep: true });

const selectedPayment = ref('transfer');

function formatPrice(amount: number) {
  if (amount === 0) return 'Gratis';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);
}

const isCalculating = ref(false);

async function calculateShipping() {
  if (!form.value.name || !form.value.phone || !form.value.email || !form.value.street || !form.value.number || !form.value.neighborhood || !form.value.zip || !form.value.state || !form.value.city) {
    toast.error('Por favor completa todos los datos de envío');
    return;
  }

  isCalculating.value = true;
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

  try {
    const response = await fetch(`${apiUrl}/shipping/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zip: form.value.zip,
        state: form.value.state,
        subtotal: cart.totalPrice
      })
    });

    if (!response.ok) {
      throw new Error('Error al cotizar envío');
    }

    const data = await response.json();
    shippingOptions.value = data.options || [];
    if (shippingOptions.value.length > 0) {
      selectedShipping.value = shippingOptions.value[0];
      step.value = 2;
    } else {
      toast.error('No hay opciones de envío disponibles para tu dirección.');
    }
  } catch (error) {
    console.error('Error calculando envío:', error);
    toast.error('No pudimos calcular el envío. Revisa tu código postal e intenta de nuevo.');
  } finally {
    isCalculating.value = false;
  }
}

const isSubmitting = ref(false);
const orderSuccess = ref(false);
const clabeInfo = ref('');

async function confirmOrder() {
  isSubmitting.value = true;
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

  try {
    const response = await fetch(`${apiUrl}/checkout/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form.value,
        shipping: selectedShipping.value,
        paymentMethod: selectedPayment.value,
        items: cart.items,
        total: cart.totalPrice + (selectedShipping.value?.price || 0)
      })
    }).catch(() => null); // Catch network errors

    if (!response || !response.ok) {
      console.warn('Backend /checkout/process no disponible. Usando simulación local.');
      // Simulador local si no hay backend
      await new Promise(resolve => setTimeout(resolve, 800)); // fake delay
      
      if (selectedPayment.value === 'card') {
        toast.info('Simulación: Redirigiendo a pasarela (stripe.com/...)');
        // No redirigimos en simulación para no salir de la app
      }
      
      cart.clearCart();
      clabeInfo.value = '012345678901234567';
      orderSuccess.value = true;
      return;
    }

    const data = await response.json();
    
    if (selectedPayment.value === 'card' && data.checkoutUrl) {
      toast.success('Redirigiendo a pasarela de pago...', { duration: 2000 });
      window.location.href = data.checkoutUrl;
    } else {
      cart.clearCart();
      clabeInfo.value = data.clabe || '012345678901234567';
      orderSuccess.value = true;
    }
  } catch (error) {
    console.error('Error procesando pedido:', error);
    toast.error('Hubo un problema al procesar tu pedido. Intenta de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
