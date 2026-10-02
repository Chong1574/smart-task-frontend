<template>
  <div class="h-full flex flex-col gap-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-serif font-bold text-foreground">Pedidos de Impresión</h1>
        <p class="text-muted-foreground mt-1">CRM de producción El Rincón de Brandy</p>
      </div>
      <button @click="showAddModal = true" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
        <Plus class="w-5 h-5" />
        <span class="hidden md:inline">Nuevo Pedido</span>
      </button>
    </header>

    <!-- Board -->
    <div class="flex-1 overflow-x-auto pb-4 snap-x">
      <div class="flex gap-4 h-full min-w-max">
        <div v-for="col in columns" :key="col.id" class="w-80 flex flex-col gap-3 bg-secondary/30 rounded-2xl p-4 snap-center border border-border/50">
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-bold text-foreground flex items-center gap-2">
              <component :is="col.icon" class="w-5 h-5" :class="col.color" />
              {{ col.title }}
            </h2>
            <span class="bg-background text-muted-foreground text-xs font-bold px-2 py-1 rounded-full border border-border">
              {{ pedidosByStatus(col.id).length }}
            </span>
          </div>

          <div class="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            <div v-if="pedidosByStatus(col.id).length === 0" class="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-xl">
              Sin pedidos
            </div>
            
            <div v-for="pedido in pedidosByStatus(col.id)" :key="pedido.id" class="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-foreground line-clamp-1" :title="pedido.cliente">{{ pedido.cliente }}</h3>
                <button @click="confirmDelete(pedido)" class="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-3">{{ pedido.descripcion }}</p>
              
              <div class="flex items-center justify-between text-xs text-muted-foreground mb-3" v-if="pedido.precio">
                <span class="bg-green-500/10 text-green-600 dark:text-green-400 font-bold px-2 py-1 rounded-md">
                  ${{ pedido.precio }}
                </span>
              </div>

              <!-- Acciones de estado -->
              <div class="flex gap-2 mt-auto pt-3 border-t border-border/40">
                <button v-if="col.prev" @click="pedidosStore.updatePedidoStatus(pedido.id!, col.prev)" class="flex-1 flex justify-center items-center py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Retroceder">
                  <ArrowLeft class="w-4 h-4" />
                </button>
                <button v-if="col.next" @click="pedidosStore.updatePedidoStatus(pedido.id!, col.next)" class="flex-1 flex justify-center items-center py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium text-sm gap-1">
                  Avanzar <ArrowRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div class="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <button @click="showAddModal = false" class="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
        <h2 class="text-2xl font-bold mb-6">Nuevo Pedido</h2>
        <form @submit.prevent="submitPedido" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Cliente</label>
            <input v-model="form.cliente" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Nombre del cliente" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción del Pedido</label>
            <textarea v-model="form.descripcion" required rows="3" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Detalles de impresión, color, material..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio ($)</label>
            <input v-model="form.precio" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Ej. 150.00" />
          </div>
          
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
            <button type="submit" :disabled="pedidosStore.loading" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2">
              <span v-if="pedidosStore.loading">Guardando...</span>
              <span v-else>Guardar Pedido</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePedidosStore, type PedidoImpresion } from '~/stores/pedidos';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { Plus, X, ArrowRight, ArrowLeft, Clock, Printer, CheckCircle2, Truck, PackageCheck, Trash2 } from 'lucide-vue-next';

definePageMeta({
  layout: 'taskman',
  middleware: [
    function (to, from) {
      const auth = useAuthStore()
      if (auth.user?.role !== 'admin') {
        return navigateTo('/taskman')
      }
    }
  ]
})

const pedidosStore = usePedidosStore();
const authStore = useAuthStore();
const router = useRouter();

const showAddModal = ref(false);
const form = ref({
  cliente: '',
  descripcion: '',
  precio: '' as number | ''
});

type PedidoStatus = PedidoImpresion['estado'];

interface ColumnDef {
  id: PedidoStatus;
  title: string;
  icon: any;
  color: string;
  next?: PedidoStatus;
  prev?: PedidoStatus;
}

const columns: ColumnDef[] = [
  { id: 'pendiente', title: 'Pendiente', icon: Clock, color: 'text-yellow-500', next: 'imprimiendo' },
  { id: 'imprimiendo', title: 'Imprimiendo', icon: Printer, color: 'text-blue-500', prev: 'pendiente', next: 'terminados' },
  { id: 'terminados', title: 'Terminados', icon: CheckCircle2, color: 'text-green-500', prev: 'imprimiendo', next: 'enviados' },
  { id: 'enviados', title: 'Enviados', icon: Truck, color: 'text-purple-500', prev: 'terminados', next: 'entregados' },
  { id: 'entregados', title: 'Entregados', icon: PackageCheck, color: 'text-gray-500', prev: 'enviados' },
];

onMounted(() => {
  pedidosStore.fetchPedidos();
});

const pedidosByStatus = (status: PedidoStatus) => {
  return pedidosStore.pedidos.filter(p => p.estado === status);
};

const submitPedido = async () => {
  const newPedido: PedidoImpresion = {
    cliente: form.value.cliente,
    descripcion: form.value.descripcion,
    precio: form.value.precio ? Number(form.value.precio) : undefined,
    estado: 'pendiente'
  };

  const ok = await pedidosStore.addPedido(newPedido);
  if (ok) {
    showAddModal.value = false;
    form.value = { cliente: '', descripcion: '', precio: '' };
  }
};

const confirmDelete = (pedido: PedidoImpresion) => {
  if (confirm(`¿Eliminar el pedido de ${pedido.cliente}?`)) {
    pedidosStore.deletePedido(pedido.id!);
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.border');
  border-radius: 20px;
}
</style>
