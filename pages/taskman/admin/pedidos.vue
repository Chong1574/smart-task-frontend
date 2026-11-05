<template>
  <div class="h-full flex flex-col gap-6">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-foreground">Pedidos de Impresión</h1>
        <p class="text-muted-foreground mt-1">CRM de producción El Rincón de Brandy</p>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="pedidosStore.useLocalFallback" class="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
          <WifiOff class="w-4 h-4" />
          <span>Modo offline (datos locales)</span>
        </div>
        <button @click="openAddModal" class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
          <Plus class="w-5 h-5" />
          <span class="hidden md:inline">Nuevo Pedido</span>
        </button>
      </div>
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
            
            <div
              v-for="pedido in pedidosByStatus(col.id)"
              :key="pedido.id"
              @click="openDetails(pedido)"
              class="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col gap-2.5"
            >
              <div class="flex justify-between items-start gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 mb-0.5">
                    <span class="text-[11px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-md shrink-0">
                      #{{ pedido.id }}
                    </span>
                    <h3 class="font-bold text-foreground line-clamp-1" :title="pedido.cliente">{{ pedido.cliente }}</h3>
                  </div>
                  <p v-if="pedido.items && pedido.items[0]?.title" class="text-xs font-semibold text-primary line-clamp-1 flex items-center gap-1 mt-0.5" :title="pedido.items[0].title">
                    <Package class="w-3.5 h-3.5 shrink-0" />
                    <span>{{ pedido.items[0].title }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    @click.stop="sendWhatsApp(pedido)"
                    class="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    title="Enviar o compartir por WhatsApp"
                  >
                    <MessageCircle class="w-4 h-4" />
                  </button>
                  <button @click.stop="confirmDelete(pedido)" class="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Miniatura del modelo linkeado si existe -->
              <div v-if="pedido.items && pedido.items[0]?.imageUrl" class="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/30 border border-border/40">
                <img :src="imgProxy(pedido.items[0].imageUrl, { width: 120 })" class="w-12 h-12 rounded-lg object-cover border border-border/60 shrink-0" />
                <div class="min-w-0 flex-1 text-xs">
                  <p class="font-semibold text-foreground truncate">{{ pedido.items[0].title }}</p>
                  <p v-if="pedido.items[0].variantName" class="text-[11px] text-muted-foreground truncate">{{ pedido.items[0].variantName }}</p>
                </div>
              </div>

              <p class="text-xs text-muted-foreground line-clamp-2">{{ pedido.descripcion }}</p>
              
              <!-- Badges de Color, Disponibilidad en Taller, Piezas y Pago -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span v-if="pedido.color" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary text-foreground border border-border/60 shadow-2xs">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0 border border-black/25" :style="{ backgroundColor: getColorHex(pedido.color) }"></span>
                  <span class="truncate max-w-[120px]">{{ pedido.color }}</span>
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0"
                    :class="getColorStock(pedido.color).inStock ? 'bg-emerald-500' : 'bg-amber-500'"
                    :title="getColorStock(pedido.color).label"
                  ></span>
                </span>
                <span
                  v-if="pedido.color && !getColorStock(pedido.color).inStock"
                  class="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md"
                  title="No está en taller: comprar en Amazon / Mercado Libre"
                >
                  🛒 Pedir rollo (+{{ getColorStock(pedido.color).deliveryDays }}d)
                </span>
                <span v-if="pedido.piezas" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/60 text-muted-foreground border border-border/40">
                  {{ pedido.piezas }}
                </span>
                <span v-if="pedido.precio" class="bg-green-500/10 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-md text-xs ml-auto">
                  ${{ pedido.precio }}
                </span>
              </div>

              <div v-if="pedido.paymentStatus === 'UNPAID'" class="mt-1">
                <button @click.stop="openPaymentModal(pedido)" class="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
                   <Wallet class="w-3.5 h-3.5" /> Marcar Pagado & Wallet
                </button>
              </div>

              <!-- Acciones de estado -->
              <div class="flex gap-2 mt-auto pt-2 border-t border-border/40">
                <button v-if="col.prev" @click.stop="pedidosStore.updatePedidoStatus(pedido.id!, col.prev)" class="flex-1 flex justify-center items-center py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Retroceder">
                  <ArrowLeft class="w-4 h-4" />
                </button>
                <button v-if="col.next" @click.stop="pedidosStore.updatePedidoStatus(pedido.id!, col.next)" class="flex-1 flex justify-center items-center py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium text-sm gap-1">
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
      <div class="bg-card border border-border rounded-3xl p-6 w-full max-w-xl shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        <button @click="showAddModal = false" class="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer">
          <X class="w-5 h-5" />
        </button>
        <h2 class="text-2xl font-bold mb-5 flex items-center gap-2">
          <Plus class="w-6 h-6 text-primary" />
          <span>Nuevo Pedido de Impresión</span>
        </h2>

        <form @submit.prevent="submitPedido" class="space-y-4">
          <!-- 1. Cliente, Teléfono/WhatsApp y Correo -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Cliente *</label>
              <input v-model="form.cliente" required type="text" class="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Nombre del cliente" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Teléfono / WhatsApp</label>
              <input v-model="form.telefono" type="tel" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Ej. 4421234567" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Correo (Opcional)</label>
              <input v-model="form.email" type="email" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="cliente@correo.com" />
            </div>
          </div>

          <!-- 2. Modelo del Bazar (Linkear) -->
          <div class="border border-border/60 rounded-2xl p-4 bg-secondary/15 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Package class="w-4 h-4 text-primary" />
                <span>Modelo del Bazar (Linkear)</span>
              </label>
              <button
                v-if="selectedProduct"
                type="button"
                @click="clearSelectedProduct"
                class="text-xs text-destructive hover:underline font-medium cursor-pointer"
              >
                Desvincular
              </button>
            </div>

            <!-- Modelo seleccionado -->
            <div v-if="selectedProduct" class="flex items-center gap-3 p-3 bg-card border border-primary/30 rounded-xl shadow-2xs">
              <img
                v-if="selectedProduct.imageUrl"
                :src="imgProxy(selectedProduct.imageUrl, { width: 140 })"
                class="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
              />
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-foreground line-clamp-1">{{ selectedProduct.title }}</p>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span v-if="selectedProduct.category" class="bg-secondary px-2 py-0.5 rounded-md font-medium text-[11px]">{{ selectedProduct.category }}</span>
                  <span class="text-primary font-semibold">Sugerido: ${{ selectedProduct.price || selectedProduct.priceFrom || 0 }}</span>
                </div>

                <!-- Selector de variante si tiene >1 -->
                <div v-if="selectedProduct.variants && selectedProduct.variants.length > 1" class="mt-2">
                  <select
                    v-model="selectedVariantName"
                    @change="onVariantChange"
                    class="text-xs bg-background border border-border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option v-for="(v, vi) in selectedProduct.variants" :key="vi" :value="v.name">
                      {{ v.name }} — ${{ v.price }} ({{ v.grams }}g)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Buscador de modelos del Bazar -->
            <div v-else class="space-y-2">
              <div class="relative">
                <Search class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="catalogSearch"
                  type="text"
                  placeholder="Buscar modelo en el catálogo (ej. portavasos, maceta, soporte...)"
                  class="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>

              <!-- Lista de sugerencias del catálogo -->
              <div v-if="catalogLoading" class="text-xs text-muted-foreground py-2 text-center">
                Cargando catálogo del bazar...
              </div>
              <div v-else-if="filteredCatalog.length > 0" class="max-h-44 overflow-y-auto custom-scrollbar border border-border/50 rounded-xl bg-card divide-y divide-border/40">
                <button
                  v-for="prod in filteredCatalog"
                  :key="prod.id"
                  type="button"
                  @click="selectProduct(prod)"
                  class="w-full p-2.5 flex items-center gap-3 text-left hover:bg-secondary/60 transition-colors cursor-pointer group"
                >
                  <img
                    v-if="prod.imageUrl"
                    :src="imgProxy(prod.imageUrl, { width: 80 })"
                    class="w-9 h-9 rounded-md object-cover border border-border shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">{{ prod.title }}</p>
                    <p class="text-[11px] text-muted-foreground">{{ prod.category || 'Bazar' }} · ${{ prod.price || prod.priceFrom || 0 }}</p>
                  </div>
                  <span class="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">+ Vincular</span>
                </button>
              </div>
              <p v-else class="text-xs text-muted-foreground italic py-1 text-center">
                No se encontraron modelos con "{{ catalogSearch }}". Puedes continuar sin vincular.
              </p>
            </div>
          </div>

          <!-- 3. Color del Filamento (Aparte de la descripción) -->
          <div class="border border-border/60 rounded-2xl p-4 bg-secondary/15 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette class="w-4 h-4 text-primary" />
                <span>Color del Filamento (Aparte)</span>
              </label>
              <span v-if="activeColorLabel" class="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full border border-black/30" :style="{ backgroundColor: getColorHex(activeColorLabel) }"></span>
                <span>{{ activeColorLabel }}</span>
              </span>
            </div>

            <!-- Swatches de colores rápidos -->
            <div class="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
              <button
                v-for="color in SUNLU_BAMBU_COLORS"
                :key="color.id"
                type="button"
                @click="selectColorPreset(color)"
                class="group relative aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                :class="selectedColorId === color.id
                  ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-sm'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'"
                :style="{ backgroundColor: color.hex }"
                :title="`${color.label} — ${color.brand}`"
              >
                <div class="absolute inset-0 rounded-xl border border-black/15 pointer-events-none"></div>
                <CheckCircle2
                  v-if="selectedColorId === color.id"
                  class="w-3.5 h-3.5 drop-shadow-sm"
                  :style="{ color: color.textColor }"
                />
              </button>
            </div>

            <!-- Input para color personalizado o detalles -->
            <div>
              <input
                v-model="customColorText"
                @input="selectedColorId = ''"
                type="text"
                class="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="O escribe un color específico (ej. Blanco y Negro bicolor, Oro Seda, Transparente...)"
              />
            </div>
          </div>

          <!-- 4. Descripción del Pedido -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descripción / Notas Técnicas *</label>
            <textarea
              v-model="form.descripcion"
              required
              rows="2"
              class="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
              placeholder="Detalles específicos de impresión, relleno, acabado o entrega..."
            ></textarea>
          </div>

          <!-- 5. Fila: Piezas, Dirección, Precio -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Piezas / Cantidad</label>
              <input v-model="form.piezas" type="text" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Ej. 1 pieza, 3 sets" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Precio Total ($)</label>
              <input v-model="form.precio" type="number" step="0.01" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none font-bold text-primary" placeholder="0.00" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Dirección / Entrega</label>
              <input v-model="form.direccion" type="text" class="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Taller o domicilio" />
            </div>
          </div>
          
          <div class="pt-4 flex justify-end gap-3 border-t border-border/50">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" :disabled="pedidosStore.loading" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2 cursor-pointer">
              <span v-if="pedidosStore.loading">Guardando...</span>
              <span v-else>Guardar Pedido</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal && selectedPedido" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div class="bg-card border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[92vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <button @click="showDetailsModal = false" class="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer">
          <X class="w-5 h-5" />
        </button>
        <div class="pr-8">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span class="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-lg">
              Pedido #{{ selectedPedido.id }}
            </span>
            <span class="text-xs text-primary font-bold uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              {{ selectedPedido.estado }}
            </span>
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full border"
              :class="selectedPedido.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'"
            >
              {{ selectedPedido.paymentStatus === 'PAID' ? '✓ Pagado' : '⏳ Por Pagar' }}
            </span>
          </div>
          <h2 class="text-2xl font-bold text-foreground">{{ selectedPedido.cliente }}</h2>
          <div v-if="selectedPedido.email || selectedPedido.phone" class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
            <span v-if="selectedPedido.email && !selectedPedido.email.includes('@rincondebrandy.com')" class="flex items-center gap-1">
              <span>✉️</span> {{ selectedPedido.email }}
            </span>
            <span v-if="selectedPedido.phone" class="flex items-center gap-1">
              <span>📱</span> {{ selectedPedido.phone }}
            </span>
          </div>
          <div v-else class="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-amber-700/80 dark:text-amber-400">
            <span>ℹ️ Pedido personal (el enlace de WhatsApp incluye acceso directo seguro).</span>
          </div>
        </div>
        
        <div class="mt-6 space-y-4">
          <!-- 1. Sección de Productos y Piezas (Modelos del Bazar con Cantidad) -->
          <div class="p-4 bg-secondary/20 border border-border/70 rounded-2xl space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Package class="w-4 h-4 text-primary" />
                <span>Productos del Pedido ({{ modalItems.length }})</span>
              </h4>
              <button
                type="button"
                @click="isAddingProduct = !isAddingProduct"
                class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>{{ isAddingProduct ? 'Cerrar buscador' : '+ Agregar Producto del Bazar' }}</span>
              </button>
            </div>

            <!-- Buscador inline de productos del catálogo -->
            <div v-if="isAddingProduct" class="p-3 bg-card border border-primary/40 rounded-xl space-y-2.5 animate-in fade-in duration-150">
              <div class="flex items-center gap-2">
                <Search class="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  v-model="modalCatalogSearch"
                  type="text"
                  placeholder="Buscar modelo en el Bazar por nombre o ID..."
                  class="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div class="max-h-44 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                <div
                  v-for="prod in filteredModalCatalog"
                  :key="prod.id"
                  class="flex items-center justify-between gap-2 p-2 rounded-xl bg-secondary/40 border border-border/60 hover:border-primary/50 transition-all text-xs"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <img
                      v-if="prod.imageUrl"
                      :src="imgProxy(prod.imageUrl, { width: 80 })"
                      class="w-9 h-9 rounded-lg object-cover shrink-0 border border-border"
                    />
                    <div class="min-w-0">
                      <p class="font-bold text-foreground truncate">{{ prod.title }}</p>
                      <p class="text-[11px] text-primary font-semibold">${{ prod.price || prod.priceFrom || 0 }} MXN</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addProductToOrder(prod)"
                    class="bg-primary text-primary-foreground px-2.5 py-1 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Plus class="w-3 h-3" />
                    <span>Agregar</span>
                  </button>
                </div>
                <p v-if="filteredModalCatalog.length === 0" class="text-xs text-muted-foreground text-center py-2">
                  No se encontraron productos.
                </p>
              </div>
            </div>

            <!-- Lista de productos añadidos con control de cantidad -->
            <div v-if="modalItems.length > 0" class="space-y-2">
              <div
                v-for="(item, idx) in modalItems"
                :key="idx"
                class="p-2.5 bg-card border border-border/80 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
              >
                <div class="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    v-if="item.imageUrl"
                    :src="imgProxy(item.imageUrl, { width: 100 })"
                    class="w-11 h-11 rounded-lg object-cover border border-border/80 shrink-0"
                  />
                  <div v-else class="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border text-muted-foreground">
                    <Package class="w-5 h-5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-bold text-xs text-foreground truncate">{{ item.title }}</p>
                    <div class="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                      <span>${{ item.price || 0 }} c/u</span>
                      <span>•</span>
                      <span class="font-bold text-foreground">Subtotal: ${{ ((item.price || 0) * (item.quantity || 1)).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>

                <!-- Stepper de Cantidad de Piezas -->
                <div class="flex items-center gap-1 shrink-0">
                  <div class="flex items-center bg-secondary/80 border border-border rounded-lg p-0.5 shadow-2xs">
                    <button
                      type="button"
                      @click="decrementItemQuantity(idx)"
                      class="w-6 h-6 rounded-md hover:bg-background flex items-center justify-center text-foreground font-bold text-xs transition-colors cursor-pointer"
                      title="Disminuir piezas"
                    >
                      <Minus class="w-3 h-3" />
                    </button>
                    <span class="w-6 text-center font-bold text-xs text-foreground select-none">
                      {{ item.quantity || 1 }}
                    </span>
                    <button
                      type="button"
                      @click="incrementItemQuantity(idx)"
                      class="w-6 h-6 rounded-md hover:bg-background flex items-center justify-center text-foreground font-bold text-xs transition-colors cursor-pointer"
                      title="Aumentar piezas"
                    >
                      <Plus class="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="removeItem(idx)"
                    class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="p-3 bg-secondary/10 border border-dashed border-border/80 rounded-xl text-xs text-muted-foreground text-center">
              Sin productos del catálogo vinculados. Puedes usar el botón <strong>+ Agregar Producto</strong> arriba.
            </div>
          </div>

          <!-- Color Badge si existe -->
          <div v-if="selectedPedido.color">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Color de Impresión</h4>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary text-foreground border border-border/60 shadow-2xs font-semibold text-sm">
              <span class="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0" :style="{ backgroundColor: getColorHex(selectedPedido.color) }"></span>
              <span>{{ selectedPedido.color }}</span>
            </div>
          </div>

          <!-- 2. Piezas manuales y notas / descripción -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Piezas / Cantidad Manual</h4>
              <input
                v-model="modalPiezas"
                type="text"
                placeholder="Ej. 1 juego, 2 piezas..."
                class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descripción / Notas</h4>
              <input
                v-model="modalDescripcion"
                type="text"
                placeholder="Notas del pedido..."
                class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <!-- 3. Dirección de Envío editable -->
          <div>
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              <h4>Dirección de Envío</h4>
              <span v-if="!modalDireccion.trim()" class="text-[10px] text-muted-foreground font-normal">Entrega en taller / Local</span>
            </div>
            <input
              v-model="modalDireccion"
              type="text"
              placeholder="Calle, número, colonia, C.P., ciudad..."
              class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <!-- 4. Precio Total y Pago -->
          <div class="p-4 bg-secondary/25 border border-border/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio Total</h4>
                <button
                  v-if="modalItems.length > 0"
                  type="button"
                  @click="recalculateModalTotal"
                  class="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                  title="Sumar total de piezas vinculadas"
                >
                  (Sumar piezas: ${{ modalItems.reduce((acc, it) => acc + (Number(it.price || 0) * (Math.max(1, parseInt(it.quantity) || 1))), 0) }})
                </button>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-muted-foreground">$</span>
                <input
                  v-model="modalPrecio"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  class="w-24 bg-background border border-border rounded-xl px-2.5 py-1 text-base font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span class="text-xs font-semibold text-muted-foreground">MXN</span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold border ml-1"
                  :class="selectedPedido.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'"
                >
                  {{ selectedPedido.paymentStatus === 'PAID' ? '✓ Pagado' : '⏳ Por Pagar' }}
                </span>
              </div>
            </div>

            <!-- Botón para marcar como pagado y registrar en Wallet -->
            <button
              v-if="selectedPedido.paymentStatus !== 'PAID'"
              type="button"
              @click="openPaymentModal(selectedPedido)"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Wallet class="w-4 h-4" />
              <span>Marcar Pagado & Wallet</span>
            </button>
            <div v-else class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 shrink-0">
              <CheckCircle2 class="w-4 h-4" />
              <span>Pago acreditado</span>
            </div>
          </div>

          <!-- Barra de aviso y guardado de cambios en piezas / precio -->
          <div v-if="isOrderModified" class="p-3 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <span class="text-xs text-primary font-bold">● Cambios pendientes en piezas o precio</span>
            <button
              type="button"
              @click="saveOrderDetails(selectedPedido)"
              :disabled="isSavingOrder"
              class="bg-primary text-primary-foreground px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Save class="w-3.5 h-3.5" />
              <span>{{ isSavingOrder ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>

          <!-- 5. Bloque de Notificación para WhatsApp y Enlace de Rastreo (Diseño responsivo sin scroll horizontal) -->
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl space-y-3">
            <div class="flex items-center gap-2.5">
              <span class="text-xl shrink-0">💬</span>
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                  Notificación para WhatsApp & Rastreo
                </h4>
                <p class="text-[11px] text-muted-foreground">
                  Envía al cliente su número de pedido y enlace para consultar su avance en vivo.
                </p>
              </div>
            </div>

            <!-- Teléfono destino y Guardado en BD (Grid 100% responsivo) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <label>Número de Celular / WhatsApp</label>
                <span v-if="quickPhone !== (selectedPedido.phone || '')" class="text-[11px] text-amber-600 dark:text-amber-400 font-bold animate-pulse">
                  ● Celular modificado
                </span>
                <span v-else-if="selectedPedido.phone" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Guardado en BD
                </span>
              </div>
              <input
                v-model="quickPhone"
                @keydown.enter.prevent="savePhone(selectedPedido)"
                type="tel"
                placeholder="Teléfono/WhatsApp del cliente (ej. 4421234567)"
                class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <div class="grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  @click="savePhone(selectedPedido)"
                  :disabled="isSavingPhone"
                  class="w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border active:scale-95"
                  :class="quickPhone !== (selectedPedido.phone || '')
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-xs'
                    : 'bg-secondary/80 hover:bg-secondary text-foreground border-border/80'"
                >
                  <Save class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ isSavingPhone ? 'Guardando...' : (quickPhone !== (selectedPedido.phone || '') ? 'Guardar Celular' : 'Guardado') }}</span>
                </button>
                <button
                  type="button"
                  @click="sendWhatsApp(selectedPedido, quickPhone)"
                  class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <MessageCircle class="w-4 h-4 shrink-0" />
                  <span class="truncate">Enviar a WhatsApp</span>
                </button>
              </div>
            </div>

            <!-- Acciones secundarias: Copiar y Probar enlace -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-500/20 text-xs">
              <button
                type="button"
                @click="copyWhatsApp(selectedPedido)"
                class="bg-background hover:bg-secondary text-foreground border border-border/80 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy class="w-3.5 h-3.5 text-muted-foreground" />
                <span>Copiar mensaje</span>
              </button>

              <a
                :href="getTrackingLink(selectedPedido)"
                target="_blank"
                class="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Rastreo (#{{ selectedPedido.id }})</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </div>

            <!-- Vista previa del mensaje (colapsable) -->
            <details class="text-[11px] text-muted-foreground pt-1">
              <summary class="cursor-pointer hover:text-foreground font-medium select-none">
                Ver texto que se enviará por WhatsApp
              </summary>
              <div class="mt-2 p-3 bg-background/90 rounded-xl border border-border/60 whitespace-pre-wrap font-sans text-xs text-foreground leading-relaxed shadow-2xs">
                {{ formatWhatsAppMessage(selectedPedido) }}
              </div>
            </details>
          </div>
        </div>
        
        <div class="mt-8 flex justify-between items-center gap-2">
          <a
            :href="getTrackingLink(selectedPedido)"
            target="_blank"
            class="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Rastreo público (#{{ selectedPedido.id }})</span>
          </a>
          <div class="flex items-center gap-2">
            <button
              v-if="isOrderModified"
              type="button"
              @click="saveOrderDetails(selectedPedido)"
              :disabled="isSavingOrder"
              class="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              {{ isSavingOrder ? 'Guardando...' : 'Guardar Todo' }}
            </button>
            <button @click="showDetailsModal = false" class="bg-secondary text-foreground px-6 py-2 rounded-xl font-bold hover:bg-secondary/80 transition-colors cursor-pointer text-xs">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Marcar como Pagado & Vincular a Wallet -->
    <div v-if="showPaymentModal && paymentTargetPedido" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div class="bg-card border border-border/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 border-b border-border/40 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                Pedido #{{ paymentTargetPedido.id }}
              </span>
              <span class="text-xs text-muted-foreground">{{ paymentTargetPedido.cliente }}</span>
            </div>
            <h3 class="text-xl font-bold text-foreground">Acreditar Pago en Wallet</h3>
          </div>
          <button @click="showPaymentModal = false" class="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Resumen del Monto -->
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-emerald-950 dark:text-emerald-200 uppercase font-semibold tracking-wider">Monto a Acreditar</p>
            <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">${{ paymentTargetPedido.precio || 0 }} <span class="text-xs font-semibold">MXN</span></p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Wallet class="w-6 h-6" />
          </div>
        </div>

        <!-- Selector de Modo de Pago / Wallet -->
        <div class="space-y-3">
          <label class="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            ¿Cómo deseas registrar este pago?
          </label>

          <!-- Opción 1: Crear nuevo ingreso en Wallet -->
          <label
            class="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="paymentMode === 'new_tx' ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary' : 'bg-secondary/20 border-border/60 hover:bg-secondary/40 text-muted-foreground'"
          >
            <input type="radio" v-model="paymentMode" value="new_tx" class="mt-1 text-primary focus:ring-primary" />
            <div class="min-w-0 flex-1 text-xs">
              <p class="font-bold text-sm text-foreground flex items-center gap-1.5">
                <span>Registrar nuevo ingreso en mi Wallet</span>
                <span class="text-[10px] font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-full">Recomendado</span>
              </p>
              <p class="text-muted-foreground mt-0.5">Suma el dinero al saldo de la cuenta que elijas (ej. BBVA, Mercado Pago, Efectivo).</p>
            </div>
          </label>

          <!-- Formulario de Opción 1 -->
          <div v-if="paymentMode === 'new_tx'" class="p-3.5 bg-secondary/30 rounded-2xl border border-border/50 space-y-3">
            <div>
              <label class="text-xs font-medium text-foreground block mb-1">Cuenta de destino</label>
              <select
                v-model="paymentAccountId"
                class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="" disabled>Selecciona una cuenta</option>
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.id">
                  {{ acc.name }} (${{ acc.balance.toLocaleString('es-MX') }} {{ acc.currency }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-medium text-foreground block mb-1">Categoría</label>
                <input
                  v-model="paymentCategory"
                  type="text"
                  placeholder="Ventas"
                  class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label class="text-xs font-medium text-foreground block mb-1">Fecha</label>
                <input
                  v-model="paymentDate"
                  type="date"
                  class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-medium text-foreground block mb-1">Descripción / Concepto</label>
              <input
                v-model="paymentDescription"
                type="text"
                placeholder="Ej. Venta 3D Pedido #12 - Jesus Chong"
                class="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <!-- Opción 2: Vincular a movimiento existente -->
          <label
            class="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="paymentMode === 'existing_tx' ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary' : 'bg-secondary/20 border-border/60 hover:bg-secondary/40 text-muted-foreground'"
          >
            <input type="radio" v-model="paymentMode" value="existing_tx" class="mt-1 text-primary focus:ring-primary" />
            <div class="min-w-0 flex-1 text-xs">
              <p class="font-bold text-sm text-foreground">Vincular a un movimiento ya registrado</p>
              <p class="text-muted-foreground mt-0.5">Si ya registraste la transferencia o depósito en Wallet previamente.</p>
            </div>
          </label>

          <!-- Lista de Opción 2 -->
          <div v-if="paymentMode === 'existing_tx'" class="p-3.5 bg-secondary/30 rounded-2xl border border-border/50 space-y-2">
            <p class="text-xs text-muted-foreground">Selecciona el movimiento de ingreso de Wallet:</p>
            <div v-if="matchingIncomeTransactions.length === 0" class="text-xs text-muted-foreground py-3 text-center italic">
              No hay movimientos de ingreso recientes registrados en tu Wallet.
            </div>
            <div v-else class="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              <button
                v-for="tx in matchingIncomeTransactions"
                :key="tx.id"
                type="button"
                @click="paymentSelectedExistingTxId = tx.id"
                class="w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer"
                :class="paymentSelectedExistingTxId === tx.id ? 'bg-primary/15 border-primary text-foreground' : 'bg-card border-border/60 hover:bg-secondary/50 text-muted-foreground'"
              >
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-xs text-foreground truncate">{{ tx.description || tx.category || 'Ingreso' }}</p>
                  <p class="text-[11px] text-muted-foreground">{{ tx.date?.slice(0, 10) }} · {{ tx.category }}</p>
                </div>
                <div class="text-right shrink-0">
                  <span class="font-bold text-xs" :class="tx.isExactMatch ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-foreground'">
                    ${{ tx.amount }}
                  </span>
                  <span v-if="tx.isExactMatch" class="block text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Coincide</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Opción 3: Solo marcar como pagado -->
          <label
            class="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="paymentMode === 'only_status' ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary' : 'bg-secondary/20 border-border/60 hover:bg-secondary/40 text-muted-foreground'"
          >
            <input type="radio" v-model="paymentMode" value="only_status" class="mt-1 text-primary focus:ring-primary" />
            <div class="min-w-0 flex-1 text-xs">
              <p class="font-bold text-sm text-foreground">Solo marcar como pagado</p>
              <p class="text-muted-foreground mt-0.5">Actualiza el pedido a Pagado sin registrar ni vincular ningún movimiento financiero.</p>
            </div>
          </label>
        </div>

        <!-- Footer Acciones -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
          <button
            type="button"
            @click="showPaymentModal = false"
            class="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="confirmPayment"
            :disabled="isProcessingPayment || (paymentMode === 'new_tx' && !paymentAccountId) || (paymentMode === 'existing_tx' && !paymentSelectedExistingTxId)"
            class="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>{{ isProcessingPayment ? 'Registrando...' : 'Confirmar y Guardar Pago' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePedidosStore, type PedidoImpresion } from '~/stores/pedidos';
import { useAuthStore } from '~/stores/auth';
import { useFinanceStore } from '~/stores/finance';
import { useRouter } from 'vue-router';
import api from '~/utils/api';
import { imgProxy } from '~/utils/imgProxy';
import { SUNLU_BAMBU_COLORS, type FilamentColor } from '~/data/filament-colors';
import { useFilamentsStore } from '~/stores/filaments';
import { toast } from 'vue-sonner';
import {
  Plus, Minus, X, ArrowRight, ArrowLeft, Clock, Printer, CheckCircle2,
  Truck, PackageCheck, Trash2, WifiOff, Package, Palette, Search, ExternalLink,
  MessageCircle, Copy, Wallet, Save
} from 'lucide-vue-next';

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

const pedidosStore = usePedidosStore();
const filamentsStore = useFilamentsStore();
const financeStore = useFinanceStore();
const authStore = useAuthStore();
const router = useRouter();

function getColorStock(colorName?: string) {
  return filamentsStore.getColorStatus(colorName || '');
}

const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedPedido = ref<PedidoImpresion | null>(null);

// Modal de Pago & Vinculación a Wallet
const showPaymentModal = ref(false);
const paymentTargetPedido = ref<PedidoImpresion | null>(null);
const paymentMode = ref<'new_tx' | 'existing_tx' | 'only_status'>('new_tx');
const paymentAccountId = ref<number | ''>('');
const paymentCategory = ref('Ventas');
const paymentDescription = ref('');
const paymentAmount = ref<number>(0);
const paymentDate = ref(new Date().toISOString().slice(0, 10));
const paymentSelectedExistingTxId = ref<number | null>(null);
const isProcessingPayment = ref(false);

const matchingIncomeTransactions = computed(() => {
  if (!paymentTargetPedido.value) return [];
  const targetAmount = Number(paymentTargetPedido.value.precio) || 0;
  return financeStore.transactions
    .filter(t => t.type === 'income')
    .slice(0, 20)
    .map(t => ({
      ...t,
      isExactMatch: Math.abs(Number(t.amount) - targetAmount) < 0.01
    }))
    .sort((a, b) => (b.isExactMatch ? 1 : 0) - (a.isExactMatch ? 1 : 0));
});

function openPaymentModal(pedido: PedidoImpresion) {
  paymentTargetPedido.value = pedido;
  paymentAmount.value = Number(pedido.precio) || 0;
  paymentDescription.value = `Venta 3D Pedido #${pedido.id} - ${pedido.cliente}${pedido.items?.[0]?.title ? ` (${pedido.items[0].title})` : ''}`;
  paymentCategory.value = 'Ventas';
  paymentDate.value = new Date().toISOString().slice(0, 10);
  paymentMode.value = 'new_tx';
  paymentSelectedExistingTxId.value = null;

  if (financeStore.accounts.length === 0) {
    financeStore.fetchAccounts();
  }
  const defaultAcc = financeStore.accounts.find(a => a.type !== 'loan' && a.sub_type !== 'credit') || financeStore.accounts[0];
  if (defaultAcc) {
    paymentAccountId.value = defaultAcc.id;
  }

  financeStore.fetchTransactions();
  showPaymentModal.value = true;
}

async function confirmPayment() {
  if (!paymentTargetPedido.value || !paymentTargetPedido.value.id) return;
  isProcessingPayment.value = true;

  try {
    // 1. Si eligió registrar nuevo ingreso en Wallet
    if (paymentMode.value === 'new_tx') {
      if (!paymentAccountId.value) {
        toast.error('Por favor selecciona una cuenta de tu Wallet para registrar el ingreso.');
        isProcessingPayment.value = false;
        return;
      }

      const txData: any = {
        accountId: Number(paymentAccountId.value),
        type: 'income',
        amount: Number(paymentAmount.value),
        category: paymentCategory.value || 'Ventas',
        description: paymentDescription.value || `Venta 3D Pedido #${paymentTargetPedido.value.id}`,
        date: new Date(paymentDate.value || Date.now()).toISOString()
      };

      const txResult = await financeStore.addTransaction(txData);
      if (!txResult) {
        toast.warning('No se pudo crear la transacción en Wallet, pero procederemos con el pago.');
      }
    }

    // 2. Si eligió vincular a un movimiento existente
    if (paymentMode.value === 'existing_tx') {
      if (!paymentSelectedExistingTxId.value) {
        toast.error('Por favor selecciona el movimiento existente al que deseas vincular.');
        isProcessingPayment.value = false;
        return;
      }
    }

    // 3. Marcar pedido como PAGADO en el backend
    const ok = await pedidosStore.validatePayment(paymentTargetPedido.value.id);
    if (ok) {
      paymentTargetPedido.value.paymentStatus = 'PAID';
      if (selectedPedido.value && selectedPedido.value.id === paymentTargetPedido.value.id) {
        selectedPedido.value.paymentStatus = 'PAID';
      }

      const accName = financeStore.accounts.find(a => a.id === paymentAccountId.value)?.name;
      toast.success(`¡Pedido #${paymentTargetPedido.value.id} marcado como PAGADO!`, {
        description: paymentMode.value === 'new_tx' && accName
          ? `Ingreso de $${paymentAmount.value} MXN registrado en ${accName}.`
          : 'Estado actualizado correctamente.'
      });

      showPaymentModal.value = false;
    }
  } catch (err: any) {
    console.error('Error al registrar pago:', err);
    toast.error(err.message || 'Error al procesar el pago.');
  } finally {
    isProcessingPayment.value = false;
  }
}

// Catálogo del Bazar para vincular
const catalogProducts = ref<any[]>([]);
const catalogLoading = ref(false);
const catalogSearch = ref('');
const selectedProduct = ref<any | null>(null);
const selectedVariantName = ref<string>('');

// Colores
const selectedColorId = ref<string>('');
const customColorText = ref<string>('');

const activeColorLabel = computed(() => {
  if (customColorText.value.trim()) return customColorText.value.trim();
  if (selectedColorId.value) {
    const found = SUNLU_BAMBU_COLORS.find(c => c.id === selectedColorId.value);
    return found ? found.label : selectedColorId.value;
  }
  return '';
});

const quickPhone = ref<string>('');
const isSavingPhone = ref(false);

async function savePhone(pedido?: PedidoImpresion | null) {
  if (!pedido || !pedido.id) return;
  const cleanPhone = quickPhone.value.trim();
  isSavingPhone.value = true;
  try {
    const ok = await pedidosStore.updatePedido(pedido.id, { phone: cleanPhone });
    if (ok) {
      pedido.phone = cleanPhone;
      if (selectedPedido.value && selectedPedido.value.id === pedido.id) {
        selectedPedido.value.phone = cleanPhone;
      }
      toast.success('¡Celular guardado en el pedido!', {
        description: cleanPhone ? `Número ${cleanPhone} registrado exitosamente.` : 'Teléfono eliminado del pedido.'
      });
    }
  } catch (err) {
    console.error('Error saving phone:', err);
    toast.error('Error al guardar el celular');
  } finally {
    isSavingPhone.value = false;
  }
}

// Edición de productos, piezas y detalles en el modal
const modalItems = ref<any[]>([]);
const modalPiezas = ref<string>('');
const modalPrecio = ref<number | ''>('');
const modalDireccion = ref<string>('');
const modalDescripcion = ref<string>('');
const isAddingProduct = ref(false);
const modalCatalogSearch = ref('');
const isSavingOrder = ref(false);

const filteredModalCatalog = computed(() => {
  const q = modalCatalogSearch.value.trim().toLowerCase();
  if (!q) return catalogProducts.value.slice(0, 8);
  return catalogProducts.value.filter(p =>
    (p.title && p.title.toLowerCase().includes(q)) ||
    (p.category && p.category.toLowerCase().includes(q)) ||
    (p.externalId && String(p.externalId).includes(q))
  ).slice(0, 10);
});

function incrementItemQuantity(index: number) {
  if (modalItems.value[index]) {
    modalItems.value[index].quantity = (Number(modalItems.value[index].quantity) || 1) + 1;
    recalculateModalTotal();
  }
}

function decrementItemQuantity(index: number) {
  if (modalItems.value[index]) {
    if (Number(modalItems.value[index].quantity) > 1) {
      modalItems.value[index].quantity = Number(modalItems.value[index].quantity) - 1;
      recalculateModalTotal();
    } else {
      removeItem(index);
    }
  }
}

function removeItem(index: number) {
  modalItems.value.splice(index, 1);
  recalculateModalTotal();
}

function addProductToOrder(prod: any) {
  const unitPrice = Number(prod.price || prod.priceFrom || 0);
  modalItems.value.push({
    productId: prod.id,
    externalId: prod.externalId,
    source: prod.source,
    imageUrl: prod.imageUrl,
    variantName: '',
    quantity: 1,
    title: prod.title,
    price: unitPrice
  });
  recalculateModalTotal();
  toast.success(`"${prod.title}" agregado al pedido`);
}

function recalculateModalTotal() {
  const itemsTotal = modalItems.value.reduce((acc, it) => {
    return acc + (Number(it.price || 0) * (Math.max(1, parseInt(it.quantity) || 1)));
  }, 0);
  if (itemsTotal > 0 || modalItems.value.length === 0) {
    modalPrecio.value = itemsTotal;
  }
}

const isOrderModified = computed(() => {
  if (!selectedPedido.value) return false;
  const currentItems = selectedPedido.value.items || [];
  if (currentItems.length !== modalItems.value.length) return true;
  for (let i = 0; i < currentItems.length; i++) {
    if (currentItems[i].productId !== modalItems.value[i].productId ||
        currentItems[i].quantity !== modalItems.value[i].quantity ||
        currentItems[i].price !== modalItems.value[i].price) {
      return true;
    }
  }
  if ((selectedPedido.value.piezas || '') !== modalPiezas.value) return true;
  if (Number(selectedPedido.value.precio || 0) !== Number(modalPrecio.value || 0)) return true;
  if ((selectedPedido.value.direccion || '') !== modalDireccion.value) return true;
  if ((selectedPedido.value.descripcion || '') !== modalDescripcion.value) return true;
  return false;
});

async function saveOrderDetails(pedido?: PedidoImpresion | null) {
  if (!pedido || !pedido.id) return;
  isSavingOrder.value = true;
  try {
    const payload = {
      items: modalItems.value,
      piezas: modalPiezas.value,
      precio: modalPrecio.value !== '' ? Number(modalPrecio.value) : undefined,
      direccion: modalDireccion.value,
      descripcion: modalDescripcion.value,
      phone: quickPhone.value.trim()
    };
    const ok = await pedidosStore.updatePedido(pedido.id, payload);
    if (ok) {
      pedido.items = JSON.parse(JSON.stringify(modalItems.value));
      pedido.piezas = modalPiezas.value;
      if (modalPrecio.value !== '') pedido.precio = Number(modalPrecio.value);
      pedido.direccion = modalDireccion.value;
      pedido.descripcion = modalDescripcion.value;
      pedido.phone = quickPhone.value.trim();

      if (selectedPedido.value && selectedPedido.value.id === pedido.id) {
        selectedPedido.value.items = pedido.items;
        selectedPedido.value.piezas = pedido.piezas;
        selectedPedido.value.precio = pedido.precio;
        selectedPedido.value.direccion = pedido.direccion;
        selectedPedido.value.descripcion = pedido.descripcion;
        selectedPedido.value.phone = pedido.phone;
      }
      isAddingProduct.value = false;
      toast.success('¡Pedido guardado!', {
        description: 'Cantidades, productos y precio actualizados en la base de datos.'
      });
    }
  } catch (err) {
    console.error('Error saving order details:', err);
    toast.error('Error al guardar los cambios del pedido');
  } finally {
    isSavingOrder.value = false;
  }
}

const form = ref({
  cliente: '',
  telefono: '',
  email: '',
  descripcion: '',
  piezas: '',
  direccion: '',
  precio: '' as number | ''
});

const fetchCatalog = async () => {
  if (catalogProducts.value.length > 0) return;
  catalogLoading.value = true;
  try {
    const res = await api.get('/products');
    if (Array.isArray(res.data)) {
      catalogProducts.value = res.data;
    }
  } catch (e) {
    console.error('Error fetching catalog products for pedidos:', e);
  } finally {
    catalogLoading.value = false;
  }
};

const filteredCatalog = computed(() => {
  const q = catalogSearch.value.trim().toLowerCase();
  if (!q) return catalogProducts.value.slice(0, 10);
  return catalogProducts.value.filter(p =>
    (p.title && p.title.toLowerCase().includes(q)) ||
    (p.category && p.category.toLowerCase().includes(q)) ||
    (p.externalId && String(p.externalId).includes(q))
  ).slice(0, 12);
});

function openAddModal() {
  showAddModal.value = true;
  fetchCatalog();
}

function selectProduct(p: any) {
  selectedProduct.value = p;
  catalogSearch.value = '';
  if (p.variants && p.variants.length > 0) {
    selectedVariantName.value = p.variants[0].name || '';
    if (!form.value.precio) {
      form.value.precio = p.variants[0].price || p.price || '';
    }
  } else {
    selectedVariantName.value = '';
    if (!form.value.precio) {
      form.value.precio = p.price || p.priceFrom || '';
    }
  }
  if (!form.value.descripcion) {
    form.value.descripcion = `Modelo Bazar: ${p.title}`;
  }
}

function onVariantChange() {
  if (!selectedProduct.value || !selectedVariantName.value) return;
  const v = (selectedProduct.value.variants || []).find((x: any) => x.name === selectedVariantName.value);
  if (v && v.price) {
    form.value.precio = v.price;
  }
}

function clearSelectedProduct() {
  selectedProduct.value = null;
  selectedVariantName.value = '';
}

function selectColorPreset(color: FilamentColor) {
  selectedColorId.value = color.id;
  customColorText.value = '';
}

function getColorHex(colorName?: string): string {
  if (!colorName) return '#9CA3AF';
  const found = SUNLU_BAMBU_COLORS.find(c =>
    c.label.toLowerCase() === colorName.toLowerCase() ||
    c.id.toLowerCase() === colorName.toLowerCase() ||
    colorName.toLowerCase().includes(c.label.toLowerCase())
  );
  if (found) return found.hex;
  const lower = colorName.toLowerCase();
  if (lower.includes('negro')) return '#18181B';
  if (lower.includes('blanco')) return '#FFFFFF';
  if (lower.includes('gris') || lower.includes('silver')) return '#71717A';
  if (lower.includes('rojo')) return '#DC2626';
  if (lower.includes('azul')) return '#2563EB';
  if (lower.includes('verde')) return '#16A34A';
  if (lower.includes('amarillo')) return '#EAB308';
  if (lower.includes('naranja')) return '#EA580C';
  if (lower.includes('morado') || lower.includes('purpura')) return '#7C3AED';
  if (lower.includes('rosa')) return '#F472B6';
  if (lower.includes('oro') || lower.includes('gold')) return '#D4AF37';
  if (lower.includes('cobre')) return '#B87333';
  return '#9CA3AF';
}

const openDetails = (pedido: PedidoImpresion) => {
  selectedPedido.value = pedido;
  quickPhone.value = pedido.phone || '';
  modalItems.value = pedido.items ? JSON.parse(JSON.stringify(pedido.items)) : [];
  modalPiezas.value = pedido.piezas || '';
  modalPrecio.value = pedido.precio !== undefined ? pedido.precio : '';
  const rawDir = pedido.direccion || '';
  const stripped = rawDir.replace(/[\s,.-]/g, '').replace(/CP/gi, '');
  modalDireccion.value = stripped.length > 3 ? rawDir.trim() : '';
  modalDescripcion.value = pedido.descripcion || '';
  isAddingProduct.value = false;
  modalCatalogSearch.value = '';
  showDetailsModal.value = true;
  fetchCatalog();
};

function getTrackingLink(pedido?: PedidoImpresion | null): string {
  if (!pedido || !pedido.id) return 'https://shongyi.com/rastreo';
  const params = new URLSearchParams();
  params.set('id', String(pedido.id));

  if (pedido.trackingToken) {
    params.set('t', pedido.trackingToken);
  }

  const validEmail = pedido.email && !pedido.email.includes('@rincondebrandy.com') ? pedido.email : '';
  const validPhone = pedido.phone ? pedido.phone.replace(/[^0-9]/g, '') : '';

  if (validPhone) {
    params.set('phone', validPhone);
  } else if (validEmail) {
    params.set('email', validEmail);
  }

  return `https://shongyi.com/rastreo?${params.toString()}`;
}

function formatWhatsAppMessage(pedido?: PedidoImpresion | null): string {
  if (!pedido) return '';
  const numPedido = pedido.id || '';
  const cliente = pedido.cliente || 'Estimado/a cliente';

  const statusLabels: Record<string, string> = {
    'pendiente': 'Pendiente de pago / preparación',
    'imprimiendo': 'En Producción 3D',
    'terminados': 'Terminado (En empaque)',
    'enviados': 'Enviado (En camino)',
    'entregados': 'Entregado'
  };
  const statusText = statusLabels[pedido.estado] || pedido.estado;

  let itemsText = '';
  const currentItems = (selectedPedido.value && selectedPedido.value.id === pedido.id && modalItems.value.length > 0)
    ? modalItems.value
    : (pedido.items || []);

  if (currentItems.length > 0) {
    itemsText = currentItems.map((i: any) => {
      const v = i.variantName ? ` (${i.variantName})` : '';
      return `• ${i.title}${v} ×${i.quantity || 1}`;
    }).join('\n');
  } else if (pedido.descripcion) {
    itemsText = `• ${pedido.descripcion}`;
  }

  const effectivePiezas = (selectedPedido.value && selectedPedido.value.id === pedido.id)
    ? modalPiezas.value
    : pedido.piezas;
  const colorText = pedido.color ? `\n🎨 *Color:* ${pedido.color}` : '';
  const piezasText = effectivePiezas && !currentItems.length ? `\n🔢 *Piezas:* ${effectivePiezas}` : '';
  const pagoText = pedido.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente de pago';

  const effectivePrecio = (selectedPedido.value && selectedPedido.value.id === pedido.id && modalPrecio.value !== '')
    ? modalPrecio.value
    : pedido.precio;
  const precioText = effectivePrecio ? `\n💰 *Total:* $${effectivePrecio} MXN (${pagoText})` : '';

  // Limpieza estricta de dirección para evitar ", C.P. ," o cadenas vacías
  const effectiveDir = (selectedPedido.value && selectedPedido.value.id === pedido.id)
    ? modalDireccion.value
    : pedido.direccion;
  let dirText = '';
  if (effectiveDir) {
    const rawDir = effectiveDir.replace(/[\s,.-]/g, '').replace(/CP/gi, '');
    if (rawDir.length > 3) {
      dirText = `\n📍 *Entrega:* ${effectiveDir.trim()}`;
    }
  }

  const trackingUrl = getTrackingLink(pedido);

  return `¡Hola ${cliente}! 👋 Te compartimos los detalles de tu compra en *El Rincón de Brandy* (shongyi.com):

📦 *Pedido #${numPedido}*
📋 *Estatus:* ${statusText}
${itemsText ? `\n🎁 *Piezas:* \n${itemsText}` : ''}${colorText}${piezasText}${precioText}${dirText}

🔍 *Rastreo en vivo:*
Puedes consultar el avance en tiempo real aquí:
${trackingUrl}

¡Muchas gracias por tu confianza! Si tienes cualquier duda nos puedes escribir con gusto. ✨`;
}

function sendWhatsApp(pedido: PedidoImpresion, phoneInput?: string) {
  if (phoneInput !== undefined && phoneInput.trim() !== (pedido.phone || '').trim() && pedido.id) {
    const clean = phoneInput.trim();
    pedido.phone = clean;
    if (selectedPedido.value && selectedPedido.value.id === pedido.id) {
      selectedPedido.value.phone = clean;
    }
    savePhone(pedido);
  }

  if (isOrderModified.value && pedido.id) {
    saveOrderDetails(pedido);
  }

  const msg = formatWhatsAppMessage(pedido);
  const rawPhone = (phoneInput !== undefined ? phoneInput : (pedido.phone || '')).trim().replace(/[^0-9]/g, '');

  let target = '';
  if (rawPhone) {
    if (rawPhone.length === 10) {
      target = `52${rawPhone}`;
    } else {
      target = rawPhone;
    }
  }

  const url = target
    ? `https://api.whatsapp.com/send?phone=${target}&text=${encodeURIComponent(msg)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank');
}

function copyWhatsApp(pedido: PedidoImpresion) {
  const msg = formatWhatsAppMessage(pedido);
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(msg).then(() => {
      toast.success('¡Mensaje de WhatsApp copiado!', {
        description: `Listo para pegar en el chat de ${pedido.cliente}.`
      });
    }).catch(() => {
      toast.info('Texto generado para WhatsApp', { description: msg });
    });
  } else {
    toast.info('Texto generado para WhatsApp', { description: msg });
  }
}

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
  filamentsStore.fetchFilaments();
  financeStore.fetchAccounts();
  financeStore.fetchTransactions();
});

const pedidosByStatus = (status: PedidoStatus) => {
  return pedidosStore.pedidos.filter(p => p.estado === status);
};

const submitPedido = async () => {
  const finalColor = activeColorLabel.value;
  const newPedido: any = {
    cliente: form.value.cliente,
    telefono: form.value.telefono || undefined,
    email: form.value.email || undefined,
    descripcion: form.value.descripcion,
    piezas: form.value.piezas || undefined,
    direccion: form.value.direccion || undefined,
    precio: form.value.precio ? Number(form.value.precio) : undefined,
    color: finalColor || undefined,
    productId: selectedProduct.value ? Number(selectedProduct.value.id) : undefined,
    variantName: selectedVariantName.value || undefined,
    estado: 'pendiente'
  };

  const ok = await pedidosStore.addPedido(newPedido);
  if (ok) {
    showAddModal.value = false;
    form.value = { cliente: '', telefono: '', email: '', descripcion: '', piezas: '', direccion: '', precio: '' };
    selectedProduct.value = null;
    selectedVariantName.value = '';
    selectedColorId.value = '';
    customColorText.value = '';
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
