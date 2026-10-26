<template>
  <div class="h-full flex flex-col gap-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2 text-xs font-semibold">
          <span>🧵 Inventario & Costeo Inteligente</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-foreground">Inventario de Filamentos</h1>
        <p class="text-muted-foreground mt-0.5 text-sm">
          Administra el stock físico de tu taller, costos por rollo y tiempos de entrega de proveedores.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="showAddModal = true"
          class="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2.5 rounded-xl font-bold border border-border/70 transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm shadow-xs"
        >
          <Plus class="w-4 h-4 text-primary" />
          <span>+ Agregar Color</span>
        </button>
        <button
          @click="saveChanges"
          :disabled="saving"
          class="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
        >
          <Save class="w-4 h-4" />
          <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
        </button>
      </div>
    </header>

    <!-- Resumen de Costeo Blindado por Material -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="mat in ['PLA', 'PETG', 'ASA']"
        :key="mat"
        class="bg-card border border-border/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
      >
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">{{ mat }}</span>
            <h3 class="text-2xl font-serif font-black text-foreground mt-0.5">
              ${{ getMaxCost(mat) }} <span class="text-xs font-normal text-muted-foreground">/ kg</span>
            </h3>
          </div>
          <span
            class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1"
            :class="mat === 'ASA' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-primary/10 border-primary/30 text-primary'"
          >
            🛡️ Base Protectora
          </span>
        </div>

        <p class="text-xs text-muted-foreground mt-3">
          El precio al cliente se calcula con base en este costo máximo para proteger tu margen en cualquier color.
        </p>

        <div class="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-xs">
          <span class="text-muted-foreground">En taller físico:</span>
          <span class="font-bold text-foreground">
            {{ getStockStats(mat).inStock }} de {{ getStockStats(mat).total }} colores
          </span>
        </div>
      </div>
    </section>

    <!-- Filtros de Navegación por Material -->
    <div class="flex items-center gap-2 border-b border-border/60 pb-3">
      <button
        v-for="tab in materialTabs"
        :key="tab.id"
        type="button"
        @click="selectedTab = tab.id"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border"
        :class="selectedTab === tab.id
          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
          : 'bg-card text-muted-foreground border-border/70 hover:text-foreground'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Lista / Tabla de Filamentos -->
    <section class="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-4 border-b border-border/60 flex items-center justify-between flex-wrap gap-3">
        <h2 class="font-serif font-bold text-lg text-foreground flex items-center gap-2">
          <span>Paleta de Colores</span>
          <span class="text-xs font-sans text-muted-foreground font-normal">({{ filteredFilaments.length }} colores)</span>
        </h2>
        <span class="text-xs text-muted-foreground">
          💡 Marca con el interruptor los rollos que tengas físicamente en tu taller.
        </span>
      </div>

      <div class="divide-y divide-border/60">
        <div
          v-for="item in filteredFilaments"
          :key="item.id"
          class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
        >
          <!-- Info de Color -->
          <div class="flex items-center gap-3.5 min-w-0 sm:w-1/3">
            <div
              class="w-10 h-10 rounded-2xl border-2 border-black/15 dark:border-white/20 shadow-xs shrink-0"
              :style="{ backgroundColor: item.hex }"
            ></div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-sm text-foreground truncate">{{ item.label }}</h4>
                <span class="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-secondary text-muted-foreground border border-border/50">
                  {{ item.material || 'PLA' }}
                </span>
                <span
                  v-if="isMaxCostColor(item)"
                  class="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                  title="Este rollo fija el costo base protector para el cliente"
                >
                  Mayor costo
                </span>
              </div>
              <p class="text-xs text-muted-foreground truncate">{{ item.brand || 'Bambu / Sunlu' }}</p>
            </div>
          </div>

          <!-- Controles de Edición -->
          <div class="flex flex-wrap items-center gap-4 sm:justify-end flex-1">
            <!-- Toggle En Taller -->
            <label class="flex items-center gap-2 cursor-pointer bg-secondary/40 px-3 py-1.5 rounded-xl border border-border/60 select-none">
              <input
                type="checkbox"
                v-model="item.inStock"
                class="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer accent-primary"
              />
              <span class="text-xs font-semibold" :class="item.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'">
                {{ item.inStock ? '⚡ En Taller' : '🛒 Sobre Pedido' }}
              </span>
            </label>

            <!-- Costo por Rollo -->
            <div class="flex items-center gap-1.5 bg-background border border-border/80 rounded-xl px-2.5 py-1">
              <span class="text-xs text-muted-foreground font-semibold">$</span>
              <input
                type="number"
                v-model.number="item.costPerKg"
                min="50"
                step="10"
                class="w-16 bg-transparent text-xs font-bold text-foreground focus:outline-none text-right"
                placeholder="300"
              />
              <span class="text-[11px] text-muted-foreground">/kg</span>
            </div>

            <!-- Días de Entrega Proveedor -->
            <div class="flex items-center gap-1.5 bg-background border border-border/80 rounded-xl px-2.5 py-1" title="Días que tarda en llegar si se pide en Amazon / Mercado Libre">
              <span class="text-xs text-muted-foreground">⏱️</span>
              <input
                type="number"
                v-model.number="item.supplierDeliveryDays"
                min="1"
                max="30"
                class="w-10 bg-transparent text-xs font-bold text-foreground focus:outline-none text-center"
                placeholder="2"
              />
              <span class="text-[11px] text-muted-foreground">días</span>
            </div>

            <!-- Enlace Proveedor (Amazon / Mercado Libre) -->
            <div class="flex items-center gap-1 bg-background border border-border/80 rounded-xl px-2.5 py-1 min-w-[140px] max-w-[200px]">
              <span class="text-xs text-muted-foreground">🔗</span>
              <input
                type="url"
                v-model="item.supplierUrl"
                placeholder="Link compra ML/Amazon"
                class="w-full bg-transparent text-[11px] text-foreground focus:outline-none truncate"
              />
              <a
                v-if="item.supplierUrl"
                :href="item.supplierUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-primary transition-colors text-xs shrink-0"
                title="Abrir enlace de compra"
              >
                ↗
              </a>
            </div>

            <!-- Eliminar -->
            <button
              type="button"
              @click="confirmDelete(item)"
              class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
              title="Eliminar filamento"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Agregar Nuevo Filamento -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div class="bg-card border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
        <button @click="showAddModal = false" class="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer">
          <X class="w-5 h-5" />
        </button>
        <h2 class="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-foreground">
          <Plus class="w-5 h-5 text-primary" />
          <span>Registrar Nuevo Color o Rollo</span>
        </h2>

        <form @submit.prevent="submitNewFilament" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Nombre del Color *</label>
              <input v-model="newForm.colorName" required type="text" placeholder="Ej. Morado Galaxia, Madera..." class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Material *</label>
              <select v-model="newForm.material" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option value="PLA">PLA (Estándar/Seda)</option>
                <option value="PETG">PETG (Exterior/Humedad)</option>
                <option value="ASA">ASA (Automotriz/Calor)</option>
                <option value="ABS">ABS (Impacto)</option>
                <option value="TPU">TPU (Flexible)</option>
                <option value="PA-CF">PA-CF / Nylon (Ingeniería)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tono / Muestra Visual</label>
              <div class="flex items-center gap-2">
                <input type="color" v-model="newForm.hex" class="w-10 h-10 rounded-xl cursor-pointer border border-border p-0.5 bg-background" />
                <input type="text" v-model="newForm.hex" class="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="#HEX" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Marca</label>
              <input v-model="newForm.brand" type="text" placeholder="Ej. Bambu Lab, Sunlu, eSun..." class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Costo por Rollo ($ MXN) *</label>
              <input v-model.number="newForm.costPerKg" required type="number" min="50" step="10" placeholder="320" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Días entrega de proveedor</label>
              <input v-model.number="newForm.supplierDeliveryDays" type="number" min="1" max="30" placeholder="2" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Enlace de Compra (Amazon / Mercado Libre)</label>
            <input v-model="newForm.supplierUrl" type="url" placeholder="https://articulo.mercadolibre.com.mx/..." class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none" />
          </div>

          <div class="pt-2">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" v-model="newForm.inStock" class="rounded border-input text-primary focus:ring-primary w-4 h-4 accent-primary" />
              <span class="text-sm font-medium text-foreground">Tengo este rollo actualmente en mi taller (Stock disponible)</span>
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-border/50">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer">
              Registrar Rollo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFilamentsStore } from '~/stores/filaments';
import { useAuthStore } from '~/stores/auth';
import { Save, Plus, Trash2, X } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'taskman',
  middleware: [
    function (to, from) {
      const auth = useAuthStore();
      if (auth.user?.role !== 'admin') {
        return navigateTo('/taskman');
      }
    }
  ]
});

const filamentsStore = useFilamentsStore();
const saving = ref(false);
const selectedTab = ref('TODOS');
const showAddModal = ref(false);

const newForm = ref({
  colorName: '',
  material: 'PLA',
  hex: '#18181B',
  brand: 'Bambu / Sunlu',
  costPerKg: 320,
  inStock: true,
  supplierDeliveryDays: 2,
  supplierUrl: ''
});

async function submitNewFilament() {
  if (!newForm.value.colorName.trim()) {
    toast.error('Ingresa un nombre para el color');
    return;
  }

  const created = await filamentsStore.createFilament({
    label: newForm.value.colorName.trim(),
    colorName: newForm.value.colorName.trim(),
    material: newForm.value.material,
    hex: newForm.value.hex,
    brand: newForm.value.brand || 'Personalizado',
    costPerKg: Number(newForm.value.costPerKg),
    inStock: Boolean(newForm.value.inStock),
    supplierDeliveryDays: Number(newForm.value.supplierDeliveryDays || 2),
    supplierUrl: newForm.value.supplierUrl.trim() || undefined
  });

  if (created) {
    showAddModal.value = false;
    newForm.value = {
      colorName: '',
      material: 'PLA',
      hex: '#18181B',
      brand: 'Bambu / Sunlu',
      costPerKg: 320,
      inStock: true,
      supplierDeliveryDays: 2,
      supplierUrl: ''
    };
  }
}

async function confirmDelete(item: any) {
  if (confirm(`¿Eliminar filamento "${item.label}"?`)) {
    await filamentsStore.removeFilament(item.id);
  }
}

const materialTabs = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'PLA', label: 'PLA (Estándar & Seda)' },
  { id: 'PETG', label: 'PETG (Exterior)' },
  { id: 'ASA', label: 'ASA (Automotriz)' },
];

onMounted(() => {
  filamentsStore.fetchFilaments();
});

const filteredFilaments = computed(() => {
  if (selectedTab.value === 'TODOS') return filamentsStore.filaments;
  return filamentsStore.filaments.filter(f => (f.material || 'PLA').toUpperCase() === selectedTab.value);
});

function getMaxCost(material: string): number {
  return filamentsStore.getMaxCostByMaterial(material);
}

function getStockStats(material: string) {
  const list = filamentsStore.filaments.filter(f => (f.material || 'PLA').toUpperCase() === material);
  return {
    total: list.length,
    inStock: list.filter(f => f.inStock).length
  };
}

function isMaxCostColor(item: any): boolean {
  const mat = (item.material || 'PLA').toUpperCase();
  const max = getMaxCost(mat);
  return (item.costPerKg || 0) >= max && max > 0;
}

async function saveChanges() {
  saving.value = true;
  try {
    await filamentsStore.bulkSave(filamentsStore.filaments);
    toast.success('Inventario y costos actualizados correctamente');
  } catch (e: any) {
    toast.error('Error al guardar filamentos', { description: e.message });
  } finally {
    saving.value = false;
  }
}
</script>
