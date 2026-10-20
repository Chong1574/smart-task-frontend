<template>
  <div class="container max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-serif font-bold mb-8">Finalizar Pedido</h1>

    <!-- Estado de Verificación PayPal -->
    <div v-if="isVerifyingPayPal" class="max-w-md mx-auto my-16 bg-card border border-border p-8 rounded-3xl text-center space-y-4 shadow-sm">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <h3 class="text-xl font-bold font-serif">Confirmando tu pago con PayPal...</h3>
      <p class="text-sm text-muted-foreground">Estamos validando tu orden con PayPal. Por favor no cierres ni actualices esta ventana.</p>
    </div>

    <!-- Error de validación PayPal -->
    <div v-else-if="paypalError" class="max-w-md mx-auto my-16 bg-card border border-destructive/30 p-8 rounded-3xl text-center space-y-4 shadow-sm">
      <div class="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold font-serif text-destructive">No se pudo verificar el pago</h3>
      <p class="text-sm text-muted-foreground">{{ paypalError }}</p>
      <div class="pt-2 flex justify-center gap-3">
        <button @click="paypalError = ''; step = 3;" class="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Intentar de nuevo
        </button>
        <NuxtLink to="/bazar" class="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
          Volver al Bazar
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="!orderSuccess" class="grid md:grid-cols-3 gap-8">
      <!-- Columna Izquierda: Pasos de Checkout -->
      <div class="md:col-span-2 space-y-8">

        <!-- Alerta de Producción bajo demanda -->
        <div class="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 p-4 rounded-2xl flex gap-4 items-start shadow-sm">
          <div class="p-2 bg-blue-500/20 rounded-full flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div>
            <h4 class="font-bold text-sm mb-1">Producción Bajo Demanda 🖨️</h4>
            <p class="text-xs opacity-90 leading-relaxed">
              Algunas piezas de tu pedido podrían fabricarse en 3D especialmente para ti. 
              <strong>El tiempo máximo estimado ya está incluido</strong> en las opciones de envío, aunque es muy probable que tu pedido esté listo mucho antes.
            </p>
          </div>
        </div>
        
        <!-- Paso 1: InformaciÃ³n de Envío -->
        <section class="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
            <h2 class="text-xl font-semibold">Datos de Envío</h2>
          </div>
          
          <div v-if="step >= 1" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Nombre Completo</label>
                <input v-model="form.name" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Juan LÃ³pez">
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
              <input v-else v-model="form.neighborhood" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Centro HistÃ³rico">
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Referencias (Opcional)</label>
              <input v-model="form.reference" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Entre calle X y calle Y, casa color azul">
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Empresa (Opcional)</label>
              <input v-model="form.company" type="text" class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Mi Negocio S.A.">
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

            <!-- Leyenda especial para Punto de Encuentro -->
            <div v-if="selectedShipping?.id === 'punto_medio'" class="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 rounded-xl text-xs flex items-center gap-2.5">
              <span class="text-base">📍</span>
              <p>Punto medio dentro de Querétaro: nosotros nos pondremos en contacto contigo para acordar la zona de entrega.</p>
            </div>

            <button v-if="step === 2 && selectedShipping" @click="proceedToPayment" class="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
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
            <label v-for="method in paymentMethods" :key="method.id" class="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors hover:border-primary" 
              :class="selectedPayment === method.id ? 'border-primary bg-primary/5' : 'border-border'">
              <div class="flex items-center gap-3">
                <input type="radio" :value="method.id" v-model="selectedPayment" class="accent-primary" />
                <div class="flex flex-col">
                  <span class="font-medium text-foreground">{{ method.name }}</span>
                  <span v-if="method.sub" class="text-xs text-muted-foreground">{{ method.sub }}</span>
                </div>
              </div>
            </label>

            <p class="text-xs text-muted-foreground mb-4 text-center mt-6">
              Al hacer clic en el botón, aceptas nuestros Términos de Servicio y confirmas la obligación de pago. Tienes derecho de desistimiento de 14 días conforme a nuestra política.
            </p>
            <button @click="confirmOrder" :disabled="isSubmitting" class="w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
              {{ isSubmitting ? 'Procesando...' : 'Pedido con obligación de pago' }}
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
                <p v-if="item.variantName" class="text-xs text-muted-foreground">{{ item.variantName }}</p>
                <p v-if="item.customText" class="text-xs text-emerald-600 dark:text-emerald-400 italic">"{{ item.customText }}"</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ item.quantity }}x {{ formatPrice(item.price) }}</p>
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
            <p v-if="selectedShipping?.id === 'punto_medio'" class="text-[11px] text-amber-600 dark:text-amber-400 italic">
              * Punto medio dentro de Querétaro: nos pondremos en contacto contigo para acordar zona de entrega
            </p>
            <div class="border-t border-border pt-2 flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(cart.totalPrice + (selectedShipping?.price || 0)) }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    <!-- Pantalla de éxito -->
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

      <div v-if="createdOrderId" class="bg-secondary/30 p-6 rounded-2xl border border-border mt-6 text-left max-w-md mx-auto space-y-3 text-sm font-sans">
        <div class="flex justify-between border-b border-border pb-2">
          <span class="text-muted-foreground">Número de Pedido:</span>
          <span class="font-bold text-primary">#{{ createdOrderId }}</span>
        </div>
        <div class="flex justify-between border-b border-border pb-2">
          <span class="text-muted-foreground">Método de Pago:</span>
          <span class="font-semibold">{{ selectedPayment === 'paypal' ? 'PayPal' : (selectedPayment === 'transfer' ? 'Transferencia SPEI' : 'Mercado Pago') }}</span>
        </div>
        <div class="flex justify-between pt-1">
          <span class="text-muted-foreground">Total:</span>
          <span class="font-bold text-lg text-green-600 dark:text-green-400">
            {{ formatPrice(finalTotal) }}
          </span>
        </div>
      </div>

      <div v-if="selectedShipping?.id === 'punto_medio'" class="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 p-4 rounded-2xl text-xs max-w-md mx-auto text-left flex items-start gap-2.5 mt-4">
        <span class="text-base shrink-0">📍</span>
        <div>
          <p class="font-semibold text-sm">Punto de Encuentro (Querétaro)</p>
          <p class="mt-0.5">Punto medio dentro de Querétaro: nosotros nos pondremos en contacto contigo para acordar la zona de entrega.</p>
        </div>
      </div>

      <p class="text-xs text-muted-foreground mt-4">
        ¿Tienes alguna duda sobre tu compra? 
        <a :href="waSupportUrl" target="_blank" @click="trackProjectLead('whatsapp_support', 'checkout_success')" class="text-green-600 dark:text-green-400 font-semibold hover:underline">
          Contáctanos por WhatsApp (442 175 2026)
        </a>
      </p>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink :to="{ path: '/rastreo', query: createdOrderId ? { id: String(createdOrderId), email: form.email || undefined } : {} }" class="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors">
          Rastrear mi pedido
        </NuxtLink>
        <NuxtLink to="/bazar" class="text-primary font-medium hover:underline px-4 py-2">
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
import { trackEvent, trackProjectLead } from '~/utils/analytics';

const cart = useCartStore();
const router = useRouter();
const route = useRoute();
const statusQuery = route.query.status;
const orderSuccess = ref(statusQuery === 'success' || (Array.isArray(statusQuery) && statusQuery.includes('success')) || statusQuery === 'approved' || (Array.isArray(statusQuery) && statusQuery.includes('approved')));

const isPayPalSuccess = computed(() => {
  const s = route.query.status;
  return s === 'paypal_success' || (Array.isArray(s) && s.includes('paypal_success'));
});
const isPayPalCancel = computed(() => {
  const s = route.query.status;
  return s === 'paypal_cancel' || (Array.isArray(s) && s.includes('paypal_cancel'));
});
const isVerifyingPayPal = ref(false);
const paypalError = ref('');

function getCurrentOrSavedItems() {
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('last_order_items');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse errors
    }
  }
  return cart.items.map(i => ({
    item_id: i.id,
    item_name: i.title,
    price: i.price,
    quantity: i.quantity,
    item_variant: i.variantName
  }));
}

function recordPurchase(transactionId: string, explicitTotal?: number) {
  const txId = String(transactionId);
  if (typeof window !== 'undefined') {
    const dedupKey = `tracked_purchase_${txId}`;
    if (sessionStorage.getItem(dedupKey)) return;
    sessionStorage.setItem(dedupKey, '1');
  }

  const savedShipping = typeof window !== 'undefined'
    ? Number(sessionStorage.getItem('last_order_shipping') || 0)
    : (selectedShipping.value?.price || 0);

  const resolvedValue =
    (typeof explicitTotal === 'number' && explicitTotal > 0 ? explicitTotal : 0) ||
    finalTotal.value ||
    (typeof window !== 'undefined' ? Number(sessionStorage.getItem('last_order_total') || 0) : 0) ||
    cart.totalPrice;

  const items = getCurrentOrSavedItems();

  trackEvent(
    'purchase',
    {
      transaction_id: txId,
      value: resolvedValue,
      shipping: savedShipping,
      currency: 'MXN',
      items
    },
    {
      transaction_id: txId,
      purchase_value: resolvedValue,
      payment_method: selectedPayment.value
    }
  );
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const savedTotal = sessionStorage.getItem('last_order_total');
    if (savedTotal) finalTotal.value = Number(savedTotal);
    const savedMethod = sessionStorage.getItem('last_payment_method');
    if (savedMethod) selectedPayment.value = savedMethod;
    const savedOrderId = sessionStorage.getItem('last_order_id');
    if (savedOrderId && !createdOrderId.value) createdOrderId.value = savedOrderId;
  }

  // Manejo de retorno de PayPal
  if (isPayPalSuccess.value) {
    const orderId = route.query.orderId;
    const token = route.query.token;

    if (!token || !orderId) {
      paypalError.value = 'Falta información de la transacción de PayPal para validar tu pago.';
      toast.error(paypalError.value);
      return;
    }

    isVerifyingPayPal.value = true;
    try {
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

      const captureRes = await fetch(`${apiUrl}/payment/paypal/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token })
      });
      const captureData = await captureRes.json();

      if (captureRes.ok && captureData.success) {
        orderSuccess.value = true;
        createdOrderId.value = orderId as string;
        selectedPayment.value = 'paypal';
        if (captureData.total) {
          finalTotal.value = Number(captureData.total);
        }
        recordPurchase(`ORD_PP_${orderId}`, finalTotal.value);
        cart.clearCart();
        toast.success('¡Pago con PayPal verificado y completado!');
      } else {
        paypalError.value = captureData.error || 'No se pudo confirmar el cobro en PayPal.';
        toast.error(paypalError.value);
      }
    } catch (err) {
      console.error('Error al capturar orden PayPal:', err);
      paypalError.value = 'Ocurrió un error de conexión al verificar tu pago con PayPal.';
      toast.error(paypalError.value);
    } finally {
      isVerifyingPayPal.value = false;
    }
    return;
  }

  if (isPayPalCancel.value) {
    toast.error('Cancelaste el pago en PayPal. Tu pedido no ha sido cobrado.');
  }

  // Manejo de orden aprobada previa o retorno de Mercado Pago
  if (orderSuccess.value) {
    const mpTxId = (route.query.external_reference || route.query.payment_id || createdOrderId.value || route.query.preference_id || `ORD_MP_${Date.now()}`) as string;
    recordPurchase(String(mpTxId).startsWith('ORD_') ? String(mpTxId) : `ORD_MP_${mpTxId}`, finalTotal.value);
    cart.clearCart();
  } else if (!isPayPalSuccess.value && cart.items.length === 0) {
    // Si el carrito está vacío y no estamos validando un pago, volver al bazar
    router.push('/bazar');
  } else if (!orderSuccess.value) {
    trackEvent(
      'begin_checkout',
      {
        currency: 'MXN',
        value: cart.totalPrice,
        items: cart.items.map(i => ({
          item_id: i.id,
          item_name: i.title,
          price: i.price,
          quantity: i.quantity,
          item_variant: i.variantName
        }))
      },
      { checkout_value: cart.totalPrice }
    );
  }

  if (statusQuery === 'failure' || (Array.isArray(statusQuery) && statusQuery.includes('failure')) || route.query.status === 'rejected') {
    toast.error('Tu pago fue rechazado o no se pudo completar. Por favor intenta de nuevo con otro método de pago.');
  } else if (statusQuery === 'pending' || (Array.isArray(statusQuery) && statusQuery.includes('pending'))) {
    toast.info('Tu pago está pendiente. Te avisaremos en cuanto se acredite.');
  }
});

const step = ref(1);
const debugInfo = ref('');

const form = useLocalStorage('checkout-form', {
  name: '',
  phone: '',
  email: '',
  street: '',
  number: '',
  neighborhood: '',
  zip: '',
  city: '',
  state: '',
  reference: '',
  company: ''
});

const neighborhoodOptions = ref<string[]>([]);

const stateMap: Record<string, string> = {
  // Querétaro
  "queretaro de arteaga": "Querétaro",
  "queretaro": "Querétaro",
  "querétaro": "Querétaro",
  "qro": "Querétaro",
  "que": "Querétaro",
  // CDMX
  "cdmx": "Ciudad de México",
  "df": "Ciudad de México",
  "distrito federal": "Ciudad de México",
  "ciudad de mexico": "Ciudad de México",
  "ciudad de méxico": "Ciudad de México",
  // Estado de México
  "edomex": "Estado de México",
  "edo mex": "Estado de México",
  "edo. mex": "Estado de México",
  "estado de mexico": "Estado de México",
  "estado de méxico": "Estado de México",
  "mex": "Estado de México",
  // Jalisco
  "jal": "Jalisco",
  "jalisco": "Jalisco",
  // Nuevo León
  "nl": "Nuevo León",
  "nuevo leon": "Nuevo León",
  "nuevo león": "Nuevo León",
  // Puebla
  "pue": "Puebla",
  "puebla": "Puebla",
  // Guanajuato
  "gto": "Guanajuato",
  "guanajuato": "Guanajuato",
  // Michoacán
  "mich": "Michoacán",
  "michoacan": "Michoacán",
  "michoacan de ocampo": "Michoacán",
  // Veracruz
  "ver": "Veracruz",
  "veracruz": "Veracruz",
  "veracruz-llave": "Veracruz",
  // Coahuila
  "coah": "Coahuila",
  "coahuila": "Coahuila",
  "coahuila de zaragoza": "Coahuila",
  // San Luis Potosí
  "slp": "San Luis Potosí",
  "san luis potosi": "San Luis Potosí",
  "san luis potosí": "San Luis Potosí",
  // Yucatán
  "yuc": "Yucatán",
  "yucatan": "Yucatán",
  "yucatán": "Yucatán",
  // Chihuahua
  "chih": "Chihuahua",
  "chihuahua": "Chihuahua",
  // Sonora
  "son": "Sonora",
  "sonora": "Sonora",
  // Sinaloa
  "sin": "Sinaloa",
  "sinaloa": "Sinaloa",
  // Tamaulipas
  "tamps": "Tamaulipas",
  "tamaulipas": "Tamaulipas",
  // Quintana Roo
  "qr": "Quintana Roo",
  "q.roo": "Quintana Roo",
  "q roo": "Quintana Roo",
  "quintana roo": "Quintana Roo",
  // Baja California
  "bc": "Baja California",
  "baja california": "Baja California",
  "bcs": "Baja California Sur",
  "baja california sur": "Baja California Sur",
  // Aguascalientes
  "ags": "Aguascalientes",
  "aguascalientes": "Aguascalientes",
  "camp": "Campeche",
  "campeche": "Campeche",
  "chis": "Chiapas",
  "chiapas": "Chiapas",
  "col": "Colima",
  "colima": "Colima",
  "dgo": "Durango",
  "durango": "Durango",
  "gro": "Guerrero",
  "guerrero": "Guerrero",
  "hgo": "Hidalgo",
  "hidalgo": "Hidalgo",
  "mor": "Morelos",
  "morelos": "Morelos",
  "nay": "Nayarit",
  "nayarit": "Nayarit",
  "oax": "Oaxaca",
  "oaxaca": "Oaxaca",
  "tab": "Tabasco",
  "tabasco": "Tabasco",
  "tlax": "Tlaxcala",
  "tlaxcala": "Tlaxcala",
  "zac": "Zacatecas",
  "zacatecas": "Zacatecas"
};

function normalizeState(val: string): string {
  if (!val) return '';
  const clean = val.trim();
  const lower = clean.toLowerCase().replace(/\.$/, '');
  return stateMap[lower] || stateMap[clean] || clean;
}

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
        if (addrData.state) form.value.state = normalizeState(addrData.state);
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
            form.value.state = normalizeState(rawState);
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
  { 
    id: 'mp', 
    name: 'Mercado Pago', 
    sub: '(Tarjetas, Efectivo y SPEI)'
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    sub: '(Tarjetas de crédito/débito y saldo PayPal)'
  }
];

watch(form, () => {
  if (step.value > 1) {
    step.value = 1;
    selectedShipping.value = null;
    shippingOptions.value = [];
  }
}, { deep: true });

const selectedPayment = ref('mp');

function formatPrice(amount: number) {
  if (amount === 0) return 'Gratis';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);
}

const isCalculating = ref(false);

async function calculateShipping() {
  if (!form.value.name || !form.value.phone || !form.value.email || !form.value.street || !form.value.number || !form.value.neighborhood || !form.value.zip || !form.value.state || !form.value.city) {
    toast.error('Por favor completa todos los Datos de Envío');
    return;
  }

  // Normalizar estado Querétaro o abreviaturas comunes de cualquier estado de México
  const trimmedZip = (form.value.zip || '').trim();
  if (/^76\d{3}$/.test(trimmedZip)) {
    form.value.state = 'Querétaro';
  } else {
    form.value.state = normalizeState(form.value.state);
  }

  isCalculating.value = true;
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

  try {
    const response = await fetch(`${apiUrl}/shipping/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form.value,
        subtotal: cart.totalPrice,
        items: cart.items
      })
    });

    if (!response.ok) {
      throw new Error('Error al cotizar envío');
    }

    const data = await response.json();
    let options = data.options || [];
    if (!options || options.length === 0) {
      options = [
        {
          id: 'nacional_estandar',
          name: 'Envío Nacional Estándar',
          description: '3-5 días hábiles',
          price: 150
        },
        {
          id: 'nacional_express',
          name: 'Envío Express',
          description: '1-2 días hábiles',
          price: 250
        }
      ];
    }
    shippingOptions.value = options;
    selectedShipping.value = options[0];
    step.value = 2;
  } catch (error) {
    console.warn('Cotización automática no disponible, aplicando opciones estándar de envío:', error);
    const fallbackOptions = [
      {
        id: 'nacional_estandar',
        name: 'Envío Nacional Estándar',
        description: '3-5 días hábiles',
        price: 150
      },
      {
        id: 'nacional_express',
        name: 'Envío Express',
        description: '1-2 días hábiles',
        price: 250
      }
    ];
    shippingOptions.value = fallbackOptions;
    selectedShipping.value = fallbackOptions[0];
    step.value = 2;
  } finally {
    isCalculating.value = false;
  }
}

const isSubmitting = ref(false);
const createdOrderId = ref<string | number>('');
const finalTotal = ref(0);

function proceedToPayment() {
  step.value = 3;
  if (selectedShipping.value) {
    trackEvent(
      'add_shipping_info',
      {
        currency: 'MXN',
        value: cart.totalPrice + selectedShipping.value.price,
        shipping_tier: selectedShipping.value.name,
        items: cart.items.map(i => ({
          item_id: i.id,
          item_name: i.title,
          price: i.price,
          quantity: i.quantity,
          item_variant: i.variantName
        }))
      },
      { shipping_tier: selectedShipping.value.name }
    );
  }
}

const waSupportUrl = computed(() => {
  const orderRef = createdOrderId.value ? ` #${createdOrderId.value}` : '';
  const msg = `Hola, tengo una pregunta sobre mi pedido${orderRef}.`;
  return `https://wa.me/524421752026?text=${encodeURIComponent(msg)}`;
});

async function confirmOrder() {
  isSubmitting.value = true;
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase || 'https://taskapi.shongyi.com/api';

  try {
    const shippingCost = selectedShipping.value?.price || 0;
    const orderValue = cart.totalPrice + shippingCost;
    finalTotal.value = orderValue;
    const orderItems = cart.items.map(i => ({
      item_id: i.id,
      item_name: i.title,
      price: i.price,
      quantity: i.quantity,
      item_variant: i.variantName
    }));

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_order_total', orderValue.toString());
      sessionStorage.setItem('last_order_shipping', shippingCost.toString());
      sessionStorage.setItem('last_order_items', JSON.stringify(orderItems));
      sessionStorage.setItem('last_payment_method', selectedPayment.value);
    }

    const response = await fetch(`${apiUrl}/checkout/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form.value,
        shipping: selectedShipping.value,
        paymentMethod: selectedPayment.value,
        items: cart.items,
        total: orderValue
      })
    }).catch(() => null); // Catch network errors

    if (!response || !response.ok) {
      throw new Error('No se pudo conectar con el servidor.');
    }

    const data = await response.json();
    if (data.orderId) {
      createdOrderId.value = data.orderId;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('last_order_id', String(data.orderId));
      }
    }

    const paymentLabel = selectedPayment.value === 'paypal'
      ? 'PayPal'
      : (selectedPayment.value === 'transfer' ? 'Transferencia SPEI' : 'Mercado Pago');

    // Evento de selección/confirmación de método de pago antes de redirigir a la pasarela
    trackEvent(
      'add_payment_info',
      {
        currency: 'MXN',
        value: orderValue,
        payment_type: paymentLabel,
        items: orderItems
      },
      { payment_method: paymentLabel }
    );

    if (selectedPayment.value === 'mp' && data.orderId) {
      toast.info('Generando link de Mercado Pago...', { duration: 2000 });
      // Llamar al endpoint de MP
      const mpResponse = await fetch(`${apiUrl}/payment/mp/preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId })
      });
      const mpData = await mpResponse.json();
      if (mpData.success && mpData.init_point) {
        // NO vaciar carrito aquí — se vacía y registra purchase al regresar con ?status=success
        window.location.href = mpData.init_point;
        return;
      } else {
        toast.error('Error al conectar con Mercado Pago');
      }
    } else if (selectedPayment.value === 'paypal' && data.orderId) {
      toast.info('Generando link de PayPal...', { duration: 2000 });
      const ppResponse = await fetch(`${apiUrl}/payment/paypal/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId })
      });
      const ppData = await ppResponse.json();
      if (ppData.success && ppData.approve_url) {
        // Redirigir a PayPal Checkout (se registra purchase al capturar el pago en el retorno)
        window.location.href = ppData.approve_url;
        return;
      } else {
        toast.error(ppData.error || 'Error al conectar con PayPal');
      }
    } else {
      recordPurchase(String(data.orderId || `ORD_${Date.now()}`), orderValue);
      cart.clearCart();
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

