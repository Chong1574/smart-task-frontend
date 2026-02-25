<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import { Car, Plus, Fuel, Gauge, TrendingUp, History, Info, AlertCircle } from 'lucide-vue-next';

const store = useFinanceStore();
const selectedVehicleId = ref<number | null>(null);

onMounted(() => {
    store.initialize();
});

const vehicles = computed(() => store.vehicles);
const selectedVehicle = computed(() => 
    vehicles.value.find(v => v.id === selectedVehicleId.value) || null
);

// Formulario para Nuevo Vehículo
const showAddVehicle = ref(false);
const vehicleForm = ref({
    name: '',
    plate: '',
    make: '',
    model: '',
    year: new Date().getFullYear()
});

const saveVehicle = async () => {
    if (!vehicleForm.value.name) return;
    await store.addVehicle(vehicleForm.value);
    showAddVehicle.value = false;
    vehicleForm.value = { name: '', plate: '', make: '', model: '', year: new Date().getFullYear() };
};

// Formulario para Cargar Gasolina
const showFuelForm = ref(false);
const fuelForm = ref({
    odometer: '' as number | '',
    liters: '' as number | '',
    totalCost: '' as number | '',
    accountId: store.accounts[0]?.id || 0,
    isFullTank: true,
    tankLevelBefore: 0,
    tankLevelAfter: 100
});

const saveFuelLog = async () => {
    if (!selectedVehicleId.value || !fuelForm.value.odometer || !fuelForm.value.liters || !fuelForm.value.totalCost) return;
    
    await store.addFuelLog({
        vehicleId: selectedVehicleId.value,
        ...fuelForm.value,
        category: 'Transporte / Gasolina'
    });
    
    showFuelForm.value = false;
    fuelForm.value = {
        odometer: '',
        liters: '',
        totalCost: '',
        accountId: store.accounts[0]?.id || 0,
        isFullTank: true,
        tankLevelBefore: 0,
        tankLevelAfter: 100
    };
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Cálculos de Eficiencia
const calculateEfficiency = (vehicle: any) => {
    const logs = [...vehicle.fuelLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (logs.length < 2) return null;

    const lastLog = logs[logs.length - 1];
    const prevLog = logs[logs.length - 2];

    const distance = Number(lastLog.odometer) - Number(prevLog.odometer);
    const efficiency = distance / Number(lastLog.liters);

    return efficiency.toFixed(2);
};

const getRecentLogs = computed(() => {
    if (!selectedVehicle.value) return [];
    return [...selectedVehicle.value.fuelLogs].slice(0, 5);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in text-left">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Mi Garaje</h2>
        <p class="text-slate-500 text-sm">Control de combustible y eficiencia de tus vehículos</p>
      </div>
      <button 
        @click="showAddVehicle = true" 
        class="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
      >
        <Plus :size="18" />
        Agregar Vehículo
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="vehicles.length === 0" class="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
      <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
        <Car :size="32" />
      </div>
      <div>
        <h3 class="font-bold text-slate-800">No tienes vehículos registrados</h3>
        <p class="text-slate-500 text-sm">Registra tu primer auto para empezar a trackear su eficiencia.</p>
      </div>
      <button @click="showAddVehicle = true" class="text-blue-600 font-bold text-sm">Registrar Vehículo ahora</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Vehicle List Sidebar -->
      <div class="lg:col-span-1 space-y-3">
        <button 
          v-for="v in vehicles" :key="v.id"
          @click="selectedVehicleId = v.id"
          class="w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group"
          :class="[selectedVehicleId === v.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700']"
        >
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', selectedVehicleId === v.id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50']">
            <Car :size="20" />
          </div>
          <div class="flex-1">
            <p class="font-bold text-sm leading-tight">{{ v.name }}</p>
            <p :class="['text-[10px] font-medium uppercase tracking-wider', selectedVehicleId === v.id ? 'text-white/60' : 'text-slate-400']">
              {{ v.plate || 'Sin Placa' }}
            </p>
          </div>
        </button>
      </div>

      <!-- Main Dashboard -->
      <div v-if="selectedVehicle" class="lg:col-span-3 space-y-6">
        <!-- Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp :size="24" />
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Eficiencia (Km/L)</p>
              <h4 class="text-2xl font-black text-slate-800">
                {{ calculateEfficiency(selectedVehicle) || '---' }}
              </h4>
            </div>
          </div>

          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Gauge :size="24" />
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Último Odométro</p>
              <h4 class="text-2xl font-black text-slate-800">
                {{ selectedVehicle.fuelLogs[0]?.odometer ? Number(selectedVehicle.fuelLogs[0].odometer).toLocaleString() : '0' }} <span class="text-sm font-bold text-slate-300">KM</span>
              </h4>
            </div>
          </div>

          <div class="bg-white p-3 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
             <button @click="showFuelForm = true" class="w-full h-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                <Fuel :size="18" />
                Nueva Carga
             </button>
          </div>
        </div>

        <!-- Charts & Logs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Recent Activity -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-slate-800 flex items-center gap-2">
                    <History :size="18" class="text-slate-400" />
                    Últimas Cargas
                </h3>
            </div>
            <div class="space-y-4">
                <div v-if="getRecentLogs.length === 0" class="text-center py-8">
                    <p class="text-slate-400 text-xs italic font-medium">No hay registros aún.</p>
                </div>
                <div v-for="log in getRecentLogs" :key="log.id" class="flex items-center gap-4 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all">
                    <div class="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center font-bold text-xs">
                        {{ new Date(log.date).getDate() }}
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                            <p class="font-bold text-slate-800 text-sm">{{ log.liters }} Litros</p>
                            <p class="font-black text-slate-800 text-sm">{{ formatMoney(log.totalCost) }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ Number(log.odometer).toLocaleString() }} KM</span>
                             <span v-if="log.isFullTank" class="text-[8px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded font-black uppercase">Tanque Lleno</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <!-- Quick Information -->
          <div class="space-y-4">
             <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
                <Info :size="24" class="mb-4 text-slate-400" />
                <h4 class="font-bold text-xl mb-1">Tips de Eficiencia</h4>
                <p class="text-slate-400 text-sm leading-relaxed mb-6">Procura cargar tanque lleno cada vez que puedas para obtener cálculos de rendimiento mucho más precisos.</p>
                <div class="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-300">Promedio Gasolina p/L</span>
                    <span class="font-bold text-sm">$24.50</span>
                </div>
             </div>

             <!-- Vehicle Details -->
             <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detalles Técnicos</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-500">Marca/Modelo</span>
                        <span class="font-bold text-slate-800">{{ selectedVehicle.make || '---' }} {{ selectedVehicle.model || '---' }}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-500">Año</span>
                        <span class="font-bold text-slate-800">{{ selectedVehicle.year || '---' }}</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- No Selection -->
      <div v-else class="lg:col-span-3 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
            <Car :size="32" />
        </div>
        <h4 class="font-bold text-slate-400">Selecciona un vehículo o agrega uno nuevo</h4>
      </div>
    </div>

    <!-- Modals -->
    <!-- Add Vehicle Modal -->
    <div v-if="showAddVehicle" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-lg text-slate-800">Registrar Vehículo</h3>
                <button @click="showAddVehicle = false" class="text-slate-400 hover:text-slate-600"><Plus class="rotate-45" /></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">Nombre (ej. Mi Camioneta)</label>
                    <input v-model="vehicleForm.name" type="text" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Marca</label>
                        <input v-model="vehicleForm.make" type="text" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1" />
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Modelo</label>
                        <input v-model="vehicleForm.model" type="text" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Placa</label>
                        <input v-model="vehicleForm.plate" type="text" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1" />
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Año</label>
                        <input v-model="vehicleForm.year" type="number" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1" />
                    </div>
                </div>
            </div>
            <div class="p-6 bg-slate-50 flex gap-2">
                <button @click="showAddVehicle = false" class="flex-1 py-3 text-slate-500 font-bold text-sm">Cancelar</button>
                <button @click="saveVehicle" class="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">Guardar Vehículo</button>
            </div>
        </div>
    </div>

    <!-- Fuel Loading Modal -->
    <div v-if="showFuelForm" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Fuel />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-800">Cargar Gasolina</h3>
                        <p class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ selectedVehicle?.name }}</p>
                    </div>
                </div>
                <button @click="showFuelForm = false" class="text-slate-400 hover:text-slate-600"><Plus class="rotate-45" /></button>
            </div>
            <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Odometer (KM)</label>
                        <input v-model="fuelForm.odometer" type="number" placeholder="0" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1 font-bold text-lg" />
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Litros Cargados</label>
                        <input v-model="fuelForm.liters" type="number" step="0.001" placeholder="0.000" class="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 mt-1 font-bold text-lg" />
                    </div>
                </div>
                
                <div class="p-4 bg-slate-50 rounded-2xl space-y-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Costo Total ($)</label>
                        <input v-model="fuelForm.totalCost" type="number" placeholder="0.00" class="w-full p-2 bg-white rounded-lg border border-slate-100 mt-1 font-black text-xl text-emerald-600" />
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Cuenta (Pagar desde)</label>
                        <select v-model="fuelForm.accountId" class="w-full p-2 bg-white rounded-lg border border-slate-100 mt-1 text-sm">
                            <option v-for="acc in store.accounts" :key="acc.id" :value="acc.id">{{ acc.name }} ({{ formatMoney(acc.balance) }})</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center gap-3 bg-blue-50/50 p-3 rounded-2xl">
                    <input type="checkbox" v-model="fuelForm.isFullTank" id="isFull" class="w-4 h-4 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500" />
                    <label for="isFull" class="text-xs font-bold text-blue-800">¿Tanque Lleno?</label>
                    <AlertCircle :size="14" class="text-blue-400 ml-auto cursor-help" title="Ayuda a cálculos de eficiencia más precisos" />
                </div>
            </div>
            <div class="p-6 bg-slate-50 flex gap-2">
                <button @click="showFuelForm = false" class="flex-1 py-3 text-slate-500 font-bold text-sm">Cancelar</button>
                <button @click="saveFuelLog" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all">Registrar Carga</button>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes zoom-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-zoom-in {
  animation: zoom-in 0.2s ease-out forwards;
}
</style>
