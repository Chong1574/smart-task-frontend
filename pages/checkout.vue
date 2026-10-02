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
                <input v-model="form.name" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Juan Pérez">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">WhatsApp / Correo</label>
                <input v-model="form.contact" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="442 123 4567">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Calle y Número</label>
              <input v-model="form.street" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Av. Universidad 123">
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Código Postal</label>
                <input v-model="form.zip" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="76000">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Ciudad</label>
                <input v-model="form.city" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Santiago de Querétaro">
              </div>
              <div class="col-span-2 md:col-span-1 space-y-2">
                <label class="text-sm font-medium">Estado</label>
                <select v-model="form.state" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="Querétaro">Querétaro</option>
                  <option value="CDMX">Ciudad de México</option>
                  <option value="Jalisco">Jalisco</option>
                  <option value="Otro">Otro Estado</option>
                </select>
              </div>
            </div>

            <button v-if="step === 1" @click="calculateShipping" class="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Continuar a Envío
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
import { ref, computed } from 'vue';
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
  contact: '',
  street: '',
  zip: '',
  city: '',
  state: 'Querétaro'
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

function calculateShipping() {
  if (!form.value.name || !form.value.contact || !form.value.street || !form.value.zip) {
    toast.error('Por favor completa todos los datos de envío');
    return;
  }

  // Lógica temporal para mostrar cómo funcionaría
  const options: ShippingOption[] = [];
  
  if (form.value.state === 'Querétaro') {
    // Opción Punto Medio
    options.push({
      id: 'punto_medio',
      name: 'Punto de Encuentro',
      description: 'Entrega en punto céntrico a convenir',
      price: 0
    });

    // Lógica dinámica de distancia simulada
    // Asumimos un viaje de 15km a $5/km = $75. Viaje doble = $150
    const subtotal = cart.totalPrice;
    const realProfit = subtotal * 0.818; // 450% markup -> ganancia es ~81.8%
    const coverageFund = realProfit / 2;
    
    const simulatedTripCost = 150; // Esto luego vendrá de Google Maps
    const roundTrip = simulatedTripCost * 2;
    
    let finalDeliveryPrice = 0;
    
    if (coverageFund >= simulatedTripCost) {
      finalDeliveryPrice = 0;
    } else {
      finalDeliveryPrice = roundTrip - coverageFund;
      // Prevenir números negativos o absurdos
      if (finalDeliveryPrice < 0) finalDeliveryPrice = 0;
    }

    options.push({
      id: 'domicilio_qro',
      name: 'Entrega a Domicilio',
      description: 'Llevamos tu pedido directamente a tu puerta',
      price: Math.round(finalDeliveryPrice)
    });
  } else {
    // Fuera de Querétaro -> Skydropx
    options.push({
      id: 'nacional_estandar',
      name: 'Envío Nacional Estándar',
      description: '3 a 5 días hábiles vía FedEx/Redpack',
      price: 150
    });
    options.push({
      id: 'nacional_express',
      name: 'Envío Express',
      description: '1 a 2 días hábiles vía DHL/Estafeta',
      price: 250
    });
  }

  shippingOptions.value = options;
  selectedShipping.value = options[0];
  step.value = 2;
}

function confirmOrder() {
  toast.success('Redirigiendo a pasarela de pago...', { duration: 3000 });
  // Aquí se enviaría el pedido al backend y luego se redirigiría a Stripe/PayPal, o se mostraría la pantalla de éxito con CLABE.
}
</script>
