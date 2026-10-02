<template>
  <div class="container max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-serif font-bold mb-8">Finalizar Pedido</h1>

    <div class="grid md:grid-cols-3 gap-8">
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

            <button @click="confirmOrder" class="w-full mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Confirmar Pedido
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const cart = useCartStore();
const router = useRouter();

// Si el carrito está vacío, regresar al bazar
onMounted(() => {
  if (cart.items.length === 0) {
    router.push('/bazar');
  }
});

const step = ref(1);

const form = ref({
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
  { id: 'paypal', name: 'PayPal' },
  { id: 'crypto', name: 'Criptomonedas (USDC / BTC)' }
];
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

function confirmOrder() {
  toast.success('Redirigiendo a pasarela de pago...', { duration: 3000 });
  // Aquí se enviaría el pedido al backend y luego se redirigiría a Stripe/PayPal, o se mostraría la pantalla de éxito con CLABE.
}
</script>
