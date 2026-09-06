<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Wallet & Finanzas</h1>
          <p class="text-muted-foreground">Gestiona tus compras futuras, caprichos y gastos inteligentes.</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="openModal()" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Nuevo Deseo
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-1 border-b border-border/40 pb-px overflow-x-auto">
        <NuxtLink to="/taskman/wallet" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Billetera
        </NuxtLink>
        <NuxtLink to="/taskman/budget" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Presupuesto & Proyecciones
        </NuxtLink>
        <NuxtLink to="/taskman/wishlist" class="px-4 py-2 border-b-2 border-primary text-primary font-medium transition-colors whitespace-nowrap">
          Wishlist
        </NuxtLink>
        <NuxtLink to="/taskman/dashboard" class="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Dashboard y Salud
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Urgentes -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm flex flex-col">
          <div class="p-6 border-b border-border/40 bg-red-500/10 rounded-t-3xl">
            <h3 class="font-bold text-lg text-red-600 dark:text-red-400">Cosas Urgentes</h3>
            <p class="text-sm text-red-600/80 dark:text-red-400/80">Compras necesarias o de alta prioridad</p>
          </div>
          <div class="flex-1 p-4 space-y-3 overflow-y-auto min-h-[300px]">
            <div v-for="item in urgentItems" :key="item.id" class="p-4 bg-secondary/30 rounded-2xl border border-border/20 relative group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold">{{ item.name }}</h4>
                <p class="font-mono font-bold">{{ formatCurrency(item.price) }}</p>
              </div>
              <p v-if="item.description" class="text-sm text-muted-foreground mb-3">{{ item.description }}</p>
              
              <div v-if="item.accountName" class="text-xs flex items-center gap-1 mb-2 bg-background p-2 rounded-lg">
                <span>💳 {{ item.accountName }}</span>
                <span :class="isAccountEnough(item) ? 'text-green-500' : 'text-red-500'">({{ formatCurrency(item.accountBalance) }})</span>
              </div>
              <div v-if="item.rule" class="text-xs bg-primary/10 text-primary p-2 rounded-lg italic">
                Regla: {{ item.rule }}
              </div>
              <div v-if="item.targetDate" class="text-xs text-muted-foreground mt-2">
                📅 Fecha: {{ new Date(item.targetDate).toLocaleDateString() }}
              </div>

              <div class="absolute top-2 right-2 flex gap-1 md:opacity-0 opacity-100 md:group-hover:opacity-100 transition-opacity">
                <button @click.stop="openEdit(item)" class="text-muted-foreground hover:text-primary p-1 bg-background rounded-md">
                  ✏️
                </button>
                <button @click.stop="deleteItem(item.id)" class="text-muted-foreground hover:text-destructive p-1 bg-background rounded-md">
                  🗑️
                </button>
              </div>
            </div>
            <div v-if="urgentItems.length === 0" class="text-center text-muted-foreground text-sm py-4">No hay ítems urgentes.</div>
          </div>
        </div>

        <!-- Gustitos -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm flex flex-col">
          <div class="p-6 border-b border-border/40 bg-purple-500/10 rounded-t-3xl">
            <h3 class="font-bold text-lg text-purple-600 dark:text-purple-400">Gustitos</h3>
            <p class="text-sm text-purple-600/80 dark:text-purple-400/80">Recompensas y cosas que quieres</p>
          </div>
          <div class="flex-1 p-4 space-y-3 overflow-y-auto min-h-[300px]">
            <div v-for="item in treatItems" :key="item.id" class="p-4 bg-secondary/30 rounded-2xl border border-border/20 relative group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold">{{ item.name }}</h4>
                <p class="font-mono font-bold">{{ formatCurrency(item.price) }}</p>
              </div>
              <p v-if="item.description" class="text-sm text-muted-foreground mb-3">{{ item.description }}</p>
              
              <div v-if="item.accountName" class="text-xs flex items-center gap-1 mb-2 bg-background p-2 rounded-lg">
                <span>💳 {{ item.accountName }}</span>
                <span :class="isAccountEnough(item) ? 'text-green-500' : 'text-red-500'">({{ formatCurrency(item.accountBalance) }})</span>
              </div>
              <div v-if="item.rule" class="text-xs bg-primary/10 text-primary p-2 rounded-lg italic">
                Regla: {{ item.rule }}
              </div>
              <div v-if="item.targetDate" class="text-xs text-muted-foreground mt-2">
                📅 Fecha: {{ new Date(item.targetDate).toLocaleDateString() }}
              </div>

              <div class="absolute top-2 right-2 flex gap-1 md:opacity-0 opacity-100 md:group-hover:opacity-100 transition-opacity">
                <button @click.stop="openEdit(item)" class="text-muted-foreground hover:text-primary p-1 bg-background rounded-md">
                  ✏️
                </button>
                <button @click.stop="deleteItem(item.id)" class="text-muted-foreground hover:text-destructive p-1 bg-background rounded-md">
                  🗑️
                </button>
              </div>
            </div>
            <div v-if="treatItems.length === 0" class="text-center text-muted-foreground text-sm py-4">No hay gustitos.</div>
          </div>
        </div>

        <!-- No Importantes -->
        <div class="bg-card border border-border/40 rounded-3xl shadow-sm flex flex-col">
          <div class="p-6 border-b border-border/40 bg-gray-500/10 rounded-t-3xl">
            <h3 class="font-bold text-lg text-gray-600 dark:text-gray-400">No Importantes</h3>
            <p class="text-sm text-gray-600/80 dark:text-gray-400/80">Quizás en un futuro, baja prioridad</p>
          </div>
          <div class="flex-1 p-4 space-y-3 overflow-y-auto min-h-[300px]">
            <div v-for="item in notImportantItems" :key="item.id" class="p-4 bg-secondary/30 rounded-2xl border border-border/20 relative group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold">{{ item.name }}</h4>
                <p class="font-mono font-bold">{{ formatCurrency(item.price) }}</p>
              </div>
              <p v-if="item.description" class="text-sm text-muted-foreground mb-3">{{ item.description }}</p>
              
              <div v-if="item.accountName" class="text-xs flex items-center gap-1 mb-2 bg-background p-2 rounded-lg">
                <span>💳 {{ item.accountName }}</span>
                <span :class="isAccountEnough(item) ? 'text-green-500' : 'text-red-500'">({{ formatCurrency(item.accountBalance) }})</span>
              </div>
              <div v-if="item.rule" class="text-xs bg-primary/10 text-primary p-2 rounded-lg italic">
                Regla: {{ item.rule }}
              </div>
              <div v-if="item.targetDate" class="text-xs text-muted-foreground mt-2">
                📅 Fecha: {{ new Date(item.targetDate).toLocaleDateString() }}
              </div>

              <div class="absolute top-2 right-2 flex gap-1 md:opacity-0 opacity-100 md:group-hover:opacity-100 transition-opacity">
                <button @click.stop="openEdit(item)" class="text-muted-foreground hover:text-primary p-1 bg-background rounded-md">
                  ✏️
                </button>
                <button @click.stop="deleteItem(item.id)" class="text-muted-foreground hover:text-destructive p-1 bg-background rounded-md">
                  🗑️
                </button>
              </div>
            </div>
            <div v-if="notImportantItems.length === 0" class="text-center text-muted-foreground text-sm py-4">No hay ítems de baja prioridad.</div>
          </div>
        </div>

      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showModal = false">
        <div class="bg-card border border-primary/20 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-6">{{ isEditing ? 'Editar Deseo' : 'Nuevo Deseo' }}</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Qué quieres comprar</label>
              <input v-model="form.name" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Precio</label>
                <input v-model.number="form.price" required type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Prioridad</label>
                <select v-model="form.priority" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="urgent">Urgente</option>
                  <option value="treat">Gustito</option>
                  <option value="not_important">No Importante</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Cuenta/Tarjeta asociada (Opcional)</label>
              <select v-model="form.accountId" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
                <option :value="null">Ninguna</option>
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">{{ acc.name }} — {{ formatCurrency(acc.balance) }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Regla Financiera (Opcional)</label>
              <input v-model="form.rule" type="text" placeholder="Ej. Comprar solo si hay $500 extras" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Fecha límite/objetivo (Opcional)</label>
              <input v-model="form.targetDate" type="date" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Descripción (Opcional)</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </form>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'taskman' })

import { ref, computed, onMounted, reactive } from 'vue'
import { useFinanceStore } from '~/stores/finance'
import { useConfirmStore } from '~/stores/confirm'

const financeStore = useFinanceStore()
const confirmStore = useConfirmStore()

onMounted(() => {
  financeStore.initialize()
})

const urgentItems = computed(() => financeStore.wishlistItems?.filter(i => i.priority === 'urgent' && i.status !== 'purchased') || [])
const treatItems = computed(() => financeStore.wishlistItems?.filter(i => i.priority === 'treat' && i.status !== 'purchased') || [])
const notImportantItems = computed(() => financeStore.wishlistItems?.filter(i => i.priority === 'not_important' && i.status !== 'purchased') || [])

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}

const isAccountEnough = (item: any) => {
  if (!item.accountBalance) return false
  return Number(item.accountBalance) >= Number(item.price)
}

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  name: '',
  price: 0,
  priority: 'not_important',
  accountId: null as number | null,
  rule: '',
  targetDate: '',
  description: ''
})

const openModal = () => {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.price = 0
  form.priority = 'not_important'
  form.accountId = null
  form.rule = ''
  form.targetDate = ''
  form.description = ''
  showModal.value = true
}

const openEdit = (item: any) => {
  isEditing.value = true
  editingId.value = item.id
  form.name = item.name
  form.price = item.price
  form.priority = item.priority
  form.accountId = item.accountId
  form.rule = item.rule || ''
  form.targetDate = item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : ''
  form.description = item.description || ''
  showModal.value = true
}

const submitForm = async () => {
  const payload = {
    ...form,
    targetDate: form.targetDate ? new Date(form.targetDate).toISOString() : null,
    accountId: form.accountId || null
  }
  
  if (isEditing.value && editingId.value) {
    await financeStore.updateWishlistItem(editingId.value, payload)
  } else {
    await financeStore.addWishlistItem(payload)
  }
  showModal.value = false
}

const deleteItem = async (id: number) => {
  if (await confirmStore.ask({
    title: 'Eliminar Deseo',
    message: '¿Estás seguro de que deseas eliminar este ítem de tu wishlist?',
    confirmLabel: 'Eliminar',
    destructive: true
  })) {
    await financeStore.deleteWishlistItem(id)
  }
}
</script>
