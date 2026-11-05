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
                <button @click.stop="pedidosStore.validatePayment(pedido.id!)" class="w-full text-xs bg-amber-500 hover:bg-amber-600 text-white py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1">
                   <CheckCircle2 class="w-3.5 h-3.5" /> Validar Pago SPEI
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
      <div class="bg-card border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
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
        </div>
        
        <div class="mt-6 space-y-4">
          <!-- Modelo Linkeado si existe -->
          <div v-if="selectedPedido.items && selectedPedido.items.length > 0 && selectedPedido.items[0]?.productId" class="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Package class="w-4 h-4 text-primary" />
              <span>Modelo del Bazar Vinculado</span>
            </h4>
            <div class="flex items-start gap-3">
              <img
                v-if="selectedPedido.items[0].imageUrl"
                :src="imgProxy(selectedPedido.items[0].imageUrl, { width: 140 })"
                class="w-16 h-16 rounded-xl object-cover border border-border/80 shrink-0"
              />
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-foreground">{{ selectedPedido.items[0].title }}</p>
                <p v-if="selectedPedido.items[0].variantName" class="text-xs text-muted-foreground mt-0.5">{{ selectedPedido.items[0].variantName }}</p>
                
                <div class="flex flex-wrap items-center gap-3 mt-2 text-xs">
                  <a
                    :href="`/bazar?p=${selectedPedido.items[0].productId}`"
                    target="_blank"
                    class="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Ver en Bazar</span>
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>
                  <a
                    v-if="selectedPedido.items[0].externalId"
                    :href="`https://makerworld.com/en/models/${selectedPedido.items[0].externalId}`"
                    target="_blank"
                    class="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
                  >
                    <span>MakerWorld (#{{ selectedPedido.items[0].externalId }})</span>
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Color Badge -->
          <div v-if="selectedPedido.color">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Color de Impresión</h4>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary text-foreground border border-border/60 shadow-2xs font-semibold text-sm">
              <span class="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0" :style="{ backgroundColor: getColorHex(selectedPedido.color) }"></span>
              <span>{{ selectedPedido.color }}</span>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción / Notas</h4>
            <p class="text-foreground mt-1 text-sm whitespace-pre-wrap bg-secondary/15 p-3 rounded-xl border border-border/40">{{ selectedPedido.descripcion }}</p>
          </div>

          <div v-if="selectedPedido.piezas">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Piezas / Cantidad</h4>
            <p class="text-foreground mt-1 text-sm font-medium">{{ selectedPedido.piezas }}</p>
          </div>

          <div v-if="selectedPedido.direccion">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dirección de Envío</h4>
            <p class="text-foreground mt-1 text-sm">{{ selectedPedido.direccion }}</p>
          </div>

          <div v-if="selectedPedido.precio">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio y Pago</h4>
            <p class="text-foreground mt-1 font-bold text-lg">
              ${{ selectedPedido.precio }} - 
              <span :class="selectedPedido.paymentStatus === 'PAID' ? 'text-blue-500' : 'text-amber-500'">
                {{ selectedPedido.paymentStatus === 'PAID' ? 'Pagado' : 'Por Pagar' }}
              </span>
            </p>
          </div>

          <!-- Bloque de Notificación para WhatsApp y Enlace de Rastreo -->
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

            <!-- Teléfono destino -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                v-model="quickPhone"
                type="tel"
                placeholder="Teléfono/WhatsApp del cliente (ej. 4421234567)"
                class="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                @click="sendWhatsApp(selectedPedido, quickPhone)"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Enviar a WhatsApp</span>
              </button>
            </div>

            <!-- Acciones secundarias: Copiar y Probar enlace -->
            <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-500/20">
              <button
                type="button"
                @click="copyWhatsApp(selectedPedido)"
                class="bg-background hover:bg-secondary text-foreground border border-border/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy class="w-3.5 h-3.5 text-muted-foreground" />
                <span>Copiar mensaje</span>
              </button>

              <a
                :href="getTrackingLink(selectedPedido)"
                target="_blank"
                class="text-xs text-primary hover:underline font-semibold flex items-center gap-1 ml-auto"
              >
                <span>Ver página de rastreo (#{{ selectedPedido.id }})</span>
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
          <button @click="showDetailsModal = false" class="bg-secondary text-foreground px-6 py-2 rounded-xl font-bold hover:bg-secondary/80 transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePedidosStore, type PedidoImpresion } from '~/stores/pedidos';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import api from '~/utils/api';
import { imgProxy } from '~/utils/imgProxy';
import { SUNLU_BAMBU_COLORS, type FilamentColor } from '~/data/filament-colors';
import { useFilamentsStore } from '~/stores/filaments';
import { toast } from 'vue-sonner';
import {
  Plus, X, ArrowRight, ArrowLeft, Clock, Printer, CheckCircle2,
  Truck, PackageCheck, Trash2, WifiOff, Package, Palette, Search, ExternalLink,
  MessageCircle, Copy
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
const authStore = useAuthStore();
const router = useRouter();

function getColorStock(colorName?: string) {
  return filamentsStore.getColorStatus(colorName || '');
}

const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedPedido = ref<PedidoImpresion | null>(null);

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
  showDetailsModal.value = true;
};

function getTrackingLink(pedido?: PedidoImpresion | null): string {
  if (!pedido || !pedido.id) return 'https://shongyi.com/rastreo';
  const emailParam = pedido.email && !pedido.email.includes('@rincondebrandy.com')
    ? `&email=${encodeURIComponent(pedido.email)}`
    : '';
  return `https://shongyi.com/rastreo?id=${pedido.id}${emailParam}`;
}

function formatWhatsAppMessage(pedido?: PedidoImpresion | null): string {
  if (!pedido) return '';
  const numPedido = pedido.id || '';
  const cliente = pedido.cliente || 'Estimado/a cliente';

  const statusLabels: Record<string, string> = {
    'pendiente': '⏳ Recibido (Pendiente de pago / preparación)',
    'imprimiendo': '🖨️ En Producción (Imprimiéndose en 3D)',
    'terminados': '📦 Producción Terminada (En empaque)',
    'enviados': '🚚 Enviado (En camino a tu destino)',
    'entregados': '✅ Entregado'
  };
  const statusText = statusLabels[pedido.estado] || pedido.estado;

  let itemsText = '';
  if (pedido.items && pedido.items.length > 0) {
    itemsText = pedido.items.map(i => {
      const v = i.variantName ? ` (${i.variantName})` : '';
      return `• ${i.title}${v} ×${i.quantity || 1}`;
    }).join('\n');
  } else if (pedido.descripcion) {
    itemsText = `• ${pedido.descripcion}`;
  }

  const colorText = pedido.color ? `\n🎨 *Color:* ${pedido.color}` : '';
  const piezasText = pedido.piezas && !pedido.items?.length ? `\n🔢 *Piezas:* ${pedido.piezas}` : '';
  const pagoText = pedido.paymentStatus === 'PAID' ? '✅ Pagado' : '⏳ Pendiente de pago';
  const precioText = pedido.precio ? `\n💰 *Total:* $${pedido.precio} MXN (${pagoText})` : '';
  const dirText = pedido.direccion ? `\n📍 *Entrega:* ${pedido.direccion}` : '';

  const trackingUrl = getTrackingLink(pedido);

  return `¡Hola ${cliente}! 👋 Te compartimos los detalles de tu pedido en *El Rincón de Brandy* (shongyi.com):

📦 *Pedido #${numPedido}*
🏷️ *Estatus:* ${statusText}
${itemsText ? `\n🛍️ *Piezas:* \n${itemsText}` : ''}${colorText}${piezasText}${precioText}${dirText}

🔎 *Rastreo en vivo:*
Puedes consultar el avance y estatus de tu pieza aquí:
${trackingUrl}

¡Muchas gracias por tu confianza! Si tienes cualquier duda nos puedes escribir por aquí con gusto. ✨`;
}

function sendWhatsApp(pedido: PedidoImpresion, phoneInput?: string) {
  const msg = formatWhatsAppMessage(pedido);
  const rawPhone = (phoneInput || pedido.phone || '').trim().replace(/[^0-9]/g, '');

  let target = '';
  if (rawPhone) {
    if (rawPhone.length === 10) {
      target = `52${rawPhone}`;
    } else {
      target = rawPhone;
    }
  }

  const url = target
    ? `https://wa.me/${target}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

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
