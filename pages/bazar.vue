<template>
  <div class="py-12 md:py-20">
    <div class="container max-w-6xl px-4">

      <!-- Cabecera -->
      <div class="mb-10 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4 text-xs font-semibold tracking-wide">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Manufactura 3D Bajo Demanda · Piezas Físicas Listas para Usar
        </div>
        <h1 class="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-foreground">
          El Bazar
        </h1>
        <p class="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Creaciones físicas fabricadas con precisión en nuestro estudio: desde organizadores e ingeniería práctica hasta decoración y regalos únicos.
        </p>
      </div>

      <!-- Buscador -->
      <div class="max-w-xl mx-auto mb-6">
        <div class="relative">
          <input
            v-model="query"
            type="search"
            placeholder="Buscar en el bazar (ej. portavasos, organizador, dinosaurio, soporte...)"
            class="w-full h-12 pl-11 pr-4 rounded-full border border-border bg-card text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <svg class="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <div v-if="loading" class="text-center text-xs text-muted-foreground mt-2">Buscando…</div>
        <div v-else-if="searchedLive" class="text-center text-xs text-primary mt-2">
          Búsqueda extendida a MakerWorld — nuevos modelos añadidos al bazar.
        </div>
        <div v-else-if="rateLimited" class="text-center text-xs text-amber-600 mt-2">
          Muchas búsquedas recientes. Mostrando sólo el catálogo local.
        </div>
      </div>

      <!-- Barra de Confianza (Resuelve dudas clave antes de explorar) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
        <div class="flex items-center gap-2.5 bg-card border border-border/60 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <span class="text-lg shrink-0">📦</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-foreground truncate">Pieza Física Lista</p>
            <p class="text-[11px] text-muted-foreground truncate">Impresa en 3D y revisada a mano</p>
          </div>
        </div>
        <div class="flex items-center gap-2.5 bg-card border border-border/60 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <span class="text-lg shrink-0">🎨</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-foreground truncate">Color Personalizable</p>
            <p class="text-[11px] text-muted-foreground truncate">Elige tono sin costo extra</p>
          </div>
        </div>
        <div class="flex items-center gap-2.5 bg-card border border-border/60 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <span class="text-lg shrink-0">🛡️</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-foreground truncate">Material Sólido PLA+</p>
            <p class="text-[11px] text-muted-foreground truncate">Alta densidad y durabilidad</p>
          </div>
        </div>
        <div class="flex items-center gap-2.5 bg-card border border-border/60 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <span class="text-lg shrink-0">🚚</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-foreground truncate">Envío a Todo México</p>
            <p class="text-[11px] text-muted-foreground truncate">Empaque protegido con rastreo</p>
          </div>
        </div>
      </div>

      <!-- Layout con Sidebar (estilo MercadoLibre/Amazon) -->
      <div class="flex flex-col md:flex-row gap-8 items-start">
        
        <!-- Sidebar de Filtros -->
        <aside class="w-full md:w-64 flex-shrink-0 bg-card border border-border/60 rounded-2xl p-5 shadow-sm md:sticky md:top-24 md:z-10 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold font-serif">Filtros</h2>
            <button 
              v-if="hasActiveFilters" 
              type="button"
              @click="resetFilters" 
              class="text-xs text-primary hover:underline font-medium"
            >
              Limpiar
            </button>
          </div>
          
          <!-- Categorías -->
          <div class="mb-5">
            <h3 class="font-semibold text-sm mb-2.5 text-foreground">Categorías</h3>
            <ul class="space-y-1">
              <li v-for="cat in categoriesWithCounts" :key="cat.id">
                <button 
                  type="button"
                  @click="selectedCategory = cat.id"
                  class="text-xs w-full text-left transition-colors flex items-center justify-between py-1 group"
                  :class="selectedCategory === cat.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'"
                >
                  <span class="truncate pr-2">{{ cat.label }}</span>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[11px] text-muted-foreground/70 font-normal">({{ cat.count }})</span>
                    <span v-if="selectedCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          <!-- Precio / Rango Dinámico -->
          <div class="mb-5 pt-4 border-t border-border/60">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm text-foreground">Precio</h3>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-medium text-primary">
                  {{ priceSummaryLabel }}
                </span>
                <button 
                  v-if="priceRange[0] > 0 || priceRange[1] < 1000" 
                  type="button"
                  @click="selectPricePreset(PRICE_PRESETS[0])" 
                  class="text-[11px] text-muted-foreground hover:text-primary transition-colors ml-0.5"
                  title="Restablecer precio"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Slider interactivo -->
            <div class="px-1 py-1.5">
              <Slider v-model="priceRange" :min="0" :max="1000" :step="10" class="w-full" />
            </div>

            <!-- Indicadores Mín y Máx del slider -->
            <div class="flex justify-between items-center text-[10px] text-muted-foreground/75 mb-2.5 px-0.5">
              <span>$0</span>
              <span>$1,000+</span>
            </div>

            <!-- Píldoras de selección rápida -->
            <div class="flex flex-wrap gap-1">
              <button
                v-for="preset in PRICE_PRESETS"
                :key="preset.id"
                type="button"
                @click="selectPricePreset(preset)"
                class="text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer"
                :class="selectedPricePreset === preset.id
                  ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs'
                  : 'bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary/70'"
              >
                {{ preset.shortLabel }}
              </button>
            </div>
          </div>

          <!-- Etiquetas Populares (Nube orgánica sin scroll anidado) -->
          <div v-if="popularTags.length > 0" class="mb-5 pt-4 border-t border-border/60">
            <div class="flex items-center justify-between mb-2.5">
              <div class="flex items-center gap-1.5">
                <h3 class="font-semibold text-sm text-foreground">Etiquetas</h3>
                <span 
                  v-if="selectedTag" 
                  class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                ></span>
              </div>
              <div class="flex items-center gap-1.5">
                <button 
                  type="button"
                  @click="toggleTagSearch"
                  class="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-secondary/50 cursor-pointer"
                  :title="showTagSearch ? 'Cerrar buscador' : 'Buscar etiqueta'"
                >
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
                <button 
                  v-if="selectedTag" 
                  type="button"
                  @click="selectedTag = null" 
                  class="text-[11px] text-primary hover:underline font-medium"
                >
                  Quitar
                </button>
              </div>
            </div>

            <!-- Mini buscador desplegable bajo demanda -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="showTagSearch" class="relative mb-2.5">
                <input
                  ref="tagSearchInputRef"
                  type="text"
                  v-model="tagSearchQuery"
                  placeholder="Filtrar etiquetas..."
                  class="w-full h-7 pl-7 pr-6 rounded-lg border border-border/80 bg-background text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <svg class="absolute left-2 top-2 text-muted-foreground/60 w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <button v-if="tagSearchQuery" @click="tagSearchQuery = ''" class="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>
            </transition>

            <!-- Nube de etiquetas estilizada y aireada -->
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in visibleTags"
                :key="tag.norm"
                type="button"
                @click="toggleTag(tag.display)"
                class="group text-xs px-2.5 py-1 rounded-full border transition-all inline-flex items-center gap-1.5 cursor-pointer"
                :class="isTagActive(tag.norm)
                  ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs'
                  : 'bg-secondary/35 text-foreground/80 hover:text-foreground border-border/60 hover:border-primary/40 hover:bg-secondary/70'"
              >
                <span>{{ formatTagDisplay(tag.display) }}</span>
                <span 
                  class="text-[10px] px-1.5 py-0.2 rounded-full font-normal transition-colors"
                  :class="isTagActive(tag.norm) 
                    ? 'bg-white/20 text-white' 
                    : 'bg-secondary text-muted-foreground group-hover:text-foreground'"
                >
                  {{ tag.count }}
                </span>
              </button>
            </div>

            <p v-if="filteredTags.length === 0" class="text-xs text-muted-foreground text-center py-3">
              No hay etiquetas con "{{ tagSearchQuery }}"
            </p>

            <!-- Botón Ver Más / Ver Menos -->
            <div v-if="!tagSearchQuery.trim() && filteredTags.length > 8" class="pt-2">
              <button
                type="button"
                @click="isTagsExpanded = !isTagsExpanded"
                class="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{{ isTagsExpanded ? '− Ver menos' : `+ Ver ${filteredTags.length - 8} etiquetas más` }}</span>
              </button>
            </div>
          </div>

          <!-- Tarjeta de Búsqueda Global (MakerWorld / Red) -->
          <div class="pt-4 border-t border-border/60">
            <div class="bg-secondary/25 border border-border/70 rounded-xl p-3.5 space-y-2">
              <div class="flex items-center gap-2">
                <span class="p-1 rounded-md bg-primary/10 text-primary shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </span>
                <h3 class="font-serif font-semibold text-xs text-foreground">Búsqueda Global 3D</h3>
              </div>
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                ¿Buscas un diseño específico? Explora millones de modelos en la web para fabricar a medida.
              </p>
              <button 
                @click="handleDeepSearchClick" 
                class="w-full text-xs font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                :class="query.trim() 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold' 
                  : 'bg-secondary/70 hover:bg-secondary text-foreground border border-border/70'"
                :disabled="loadingDeep"
              >
                <span v-if="loadingDeep" class="animate-pulse">{{ deepSearchPhrases[deepSearchStatusIndex] }}</span>
                <template v-else>
                  <span>{{ query.trim() ? 'Traer de toda la Web' : 'Explorar en la Web' }}</span>
                  <svg class="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </template>
              </button>
            </div>
          </div>
        </aside>

        <!-- Contenido Principal -->
        <main class="flex-1 w-full min-w-0">
          <!-- Barra de Filtros Activos -->
          <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-card border border-border/60 text-xs">
            <span class="text-muted-foreground font-medium mr-1">Filtros:</span>

            <!-- Categoría activa -->
            <span 
              v-if="selectedCategory !== 'todos'"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >
              Categoría: {{ currentCategoryLabel }}
              <button type="button" @click="selectedCategory = 'todos'" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Etiqueta activa -->
            <span 
              v-if="selectedTag"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >
              {{ formatTagDisplay(selectedTag) }}
              <button type="button" @click="selectedTag = null" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Precio -->
            <span 
              v-if="priceRange[0] > 0 || priceRange[1] < 1000"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium border border-border"
            >
              {{ fmt(priceRange[0]) }} - {{ priceRange[1] >= 1000 ? 'Sin límite' : fmt(priceRange[1]) }}
              <button type="button" @click="priceRange = [0, 1000]" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Búsqueda -->
            <span 
              v-if="query.trim()"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium border border-border"
            >
              "{{ query.trim() }}"
              <button type="button" @click="query = ''" class="hover:opacity-70 font-bold ml-0.5">✕</button>
            </span>

            <!-- Limpiar todo -->
            <button 
              type="button" 
              @click="resetFilters" 
              class="ml-auto text-primary hover:underline font-medium text-xs"
            >
              Limpiar todo
            </button>
          </div>

          <!-- Contador de resultados -->
          <div class="flex items-center justify-between mb-4 px-1">
            <p class="text-xs text-muted-foreground">
              Mostrando <span class="font-semibold text-foreground">{{ filteredProducts.length }}</span> productos
              <span v-if="products.length > 0 && filteredProducts.length !== products.length">
                (de {{ products.length }})
              </span>
            </p>
          </div>

          <div v-if="error" class="text-center text-destructive py-8">{{ error }}</div>
          <div v-else-if="filteredProducts.length === 0 && !loading && !isDeepSearching" class="text-center text-muted-foreground py-16 bg-card border border-border/60 rounded-2xl px-6">
            <p class="text-lg font-medium mb-2 text-foreground">No hay resultados con los filtros actuales.</p>
            <p class="text-sm mb-6 max-w-md mx-auto">Prueba quitando algún filtro o ajustando el rango de precio para ver más opciones.</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <button 
                type="button" 
                @click="resetFilters" 
                class="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium py-2 px-4 rounded-xl transition-all shadow-sm"
              >
                Limpiar filtros
              </button>
              <button 
                v-if="query.trim()"
                type="button"
                @click="triggerDeepSearch" 
                class="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium py-2 px-4 rounded-xl transition-all border border-border"
              >
                Traer de toda la Web
              </button>
            </div>
          </div>
          <template v-else>
            <div v-if="isDeepSearching" class="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-card border border-border/60 text-sm text-muted-foreground shadow-sm">
              <span class="relative flex h-2.5 w-2.5 shrink-0">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span class="font-medium animate-pulse">{{ deepSearchPhrases[deepSearchStatusIndex] }}</span>
              <span class="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/70">Procesando</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
          @mouseenter="hoveredProductId = product.id"
          @mouseleave="hoveredProductId = null"
          @click="openProductDetail(product)"
        >
          <!-- Cabecera Visual Limpia -->
          <div class="aspect-square bg-secondary/40 overflow-hidden relative">
            <img
              v-if="getCardCurrentImage(product)"
              :src="imgProxy(getCardCurrentImage(product), { width: 600 })"
              :srcset="imgProxySrcSet(getCardCurrentImage(product), 600)"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              :alt="product.title"
              loading="lazy"
              decoding="async"
              width="600"
              height="600"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif italic">
              [ Imagen del Producto ]
            </div>

            <!-- Único Badge Superior Izquierdo: Categoría o Personalizable -->
            <div
              v-if="isProductPersonalized(product) || product.source === 'CUSTOM' || product.isCustom || product.category"
              class="absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold rounded-full border shadow-xs flex items-center gap-1 max-w-[75%] truncate"
              :class="isProductPersonalized(product)
                ? 'bg-amber-500/95 text-white border-amber-400/50'
                : (product.source === 'CUSTOM' || product.isCustom)
                  ? 'bg-primary/95 text-primary-foreground border-primary/40'
                  : 'bg-background/90 text-foreground border-border/60'"
            >
              <span v-if="isProductPersonalized(product)">✨ Personalizable</span>
              <span v-else-if="product.source === 'CUSTOM' || product.isCustom">⭐ Diseño Exclusivo</span>
              <span v-else class="truncate">{{ product.category }}</span>
            </div>

            <!-- Flechas en hover para explorar fotos sin saturar la imagen -->
            <template v-if="getProductImages(product).length > 1">
              <button
                type="button"
                @click.stop="stepCardImage(product, -1)"
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/85 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                title="Foto anterior"
                aria-label="Foto anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                @click.stop="stepCardImage(product, 1)"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/85 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                title="Siguiente foto"
                aria-label="Siguiente foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- Contador discreto de fotos -->
              <button
                type="button"
                @click.stop="stepCardImage(product, 1)"
                class="absolute bottom-2.5 right-2.5 bg-background/85 hover:bg-background text-foreground backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium border border-border/50 shadow-xs cursor-pointer transition-colors"
                title="Ver siguiente foto"
              >
                {{ getCurrentImageDisplayIndex(product) }}/{{ getProductImages(product).length }}
              </button>
            </template>
          </div>

          <!-- Cuerpo de la Tarjeta (Limpio y enfocado a conversión) -->
          <div class="p-5 flex flex-col flex-grow">
            <h3 class="font-serif text-lg font-bold leading-snug mb-1.5 text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {{ product.title }}
            </h3>
            <p v-if="product.description" class="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Variantes interactivas SOLO cuando hay más de 1 opción (con gramos como referencia de tamaño) -->
            <div v-if="product.variants && product.variants.length > 1" class="mb-3">
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="(v, vIdx) in product.variants.slice(0, 3)"
                  :key="vIdx"
                  type="button"
                  @click.stop="selectCardVariant(product, Number(vIdx))"
                  class="text-[11px] px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1 cursor-pointer max-w-full"
                  :class="getActiveVariantIdx(product) === Number(vIdx)
                    ? 'bg-primary/15 border-primary text-primary font-semibold shadow-2xs'
                    : 'bg-secondary/35 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'"
                  :title="v.grams ? `${v.name} (~${v.grams}g) — ${fmt(v.price)}` : `${v.name} — ${fmt(v.price)}`"
                >
                  <span class="truncate max-w-[120px]">{{ v.name }}</span>
                  <span v-if="v.grams" class="opacity-70 text-[10px] shrink-0">~{{ v.grams }}g</span>
                </button>
                <button
                  v-if="product.variants.length > 3"
                  type="button"
                  @click.stop="openProductDetail(product)"
                  class="text-[10px] px-2 py-1 rounded-lg border border-border/60 bg-secondary/25 text-primary font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  +{{ product.variants.length - 3 }}
                </button>
              </div>
            </div>

            <!-- Etiquetas clicables -->
            <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-1 mb-4">
              <button
                v-for="tag in product.tags.slice(0, 3)"
                :key="tag"
                type="button"
                @click.stop="toggleTag(tag)"
                class="px-2 py-0.5 text-[10px] rounded-md transition-colors cursor-pointer"
                :class="isTagActive(tag)
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-secondary/45 text-muted-foreground hover:bg-primary/15 hover:text-primary'"
                title="Filtrar por esta etiqueta"
              >
                #{{ formatTagDisplay(tag) }}
              </button>
              <span v-if="product.tags.length > 3" class="text-[10px] text-muted-foreground self-center">
                +{{ product.tags.length - 3 }}
              </span>
            </div>

            <!-- Footer Directo: Precio + Botón de Compra Juntos (Cero fricción ni textos solapados) -->
            <div class="mt-auto pt-3 border-t border-border/50 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <span
                  v-if="product.variants && product.variants.length > 1"
                  class="block text-[10px] text-muted-foreground truncate"
                >
                  {{ getActiveVariant(product)?.name }}
                </span>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-extrabold text-foreground tracking-tight">
                    {{ getFormattedActivePrice(product) }}
                  </span>
                  <span v-if="getActivePrice(product) > 0" class="text-[10px] font-semibold text-muted-foreground">
                    MXN
                  </span>
                </div>
              </div>

              <!-- Botón Principal de Conversión -->
              <button
                type="button"
                @click.stop="handleCardQuickAction(product)"
                class="px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                :class="justAddedId === product.id
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]'"
                :aria-label="isActiveVariantPersonalized(product) ? 'Personalizar pieza' : 'Agregar al carrito'"
              >
                <template v-if="justAddedId === product.id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>¡Listo!</span>
                </template>
                <template v-else-if="isActiveVariantPersonalized(product)">
                  <span>✨ Personalizar</span>
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  <span>Agregar</span>
                </template>
              </button>
            </div>

            <!-- Enlace de descarga sólo si el producto tiene archivo adjunto -->
            <div v-if="product.fileUrl" class="mt-2 pt-2 border-t border-border/40">
              <a
                :href="`${apiBase}/products/${product.id}/download`"
                class="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                target="_blank"
                @click.stop
              >
                Descargar archivo
                <span v-if="product.fileSizeBytes" class="text-muted-foreground">
                  ({{ formatSize(product.fileSizeBytes) }})
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- Esqueletos mientras carga -->
        <div v-if="loading || isDeepSearching" v-for="i in (filteredProducts.length === 0 ? 6 : 2)" :key="'skel-'+i" class="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60">
          <div class="aspect-square bg-secondary/50 animate-pulse"></div>
          <div class="p-6 flex flex-col flex-grow">
            <div class="h-6 bg-secondary/60 rounded animate-pulse w-3/4 mb-3"></div>
            <div class="h-4 bg-secondary/40 rounded animate-pulse w-full mb-2"></div>
            <div class="h-4 bg-secondary/40 rounded animate-pulse w-5/6 mb-4"></div>
            <div class="mt-auto flex items-center justify-between">
              <div class="h-5 bg-secondary/50 rounded animate-pulse w-1/3"></div>
              <div class="h-8 w-8 bg-secondary/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      </template>

      <BazarProductDetail 
        v-if="selected" 
        :product="selected"
        :initial-variant-idx="selectedInitialVariantIdx"
        @close="selected = null" 
        @select-tag="handleSelectTagFromDetail" 
      />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BazarProductDetail from '~/components/BazarProductDetail.vue';
import CartDrawer from '~/components/CartDrawer.vue';
import { imgProxy, imgProxySrcSet } from '~/utils/imgProxy';
import { useCartStore } from '~/stores/cart';
import { toast } from 'vue-sonner';
import { trackEvent } from '~/utils/analytics';

const cart = useCartStore();

// Preconnect al proxy de imágenes — evita el hit de handshake TLS en el primer render.
useHead({
  link: [
    { rel: 'preconnect', href: 'https://wsrv.nl', crossorigin: '' },
    { rel: 'dns-prefetch', href: 'https://wsrv.nl' }
  ]
});

interface Variant { name: string; grams: number; hours: number; price: number; imageIndex?: number; imageUrl?: string; filament?: string }
interface Product {
  id: number;
  title: string;
  description?: string | null;
  price?: number | string | null;
  priceFrom?: number | null;
  variants?: Variant[] | null;
  images?: string[] | null;
  origin?: string;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  source?: string;
  sourceUrl?: string | null;
  licenseType?: string;
  licenseAttribution?: string;
  imageUrl?: string;
  isPublic?: boolean;
  category?: string;
  descriptionHtml?: string | null;
  tags?: string[] | null;
  trendScore?: number | null;
  isCustom?: boolean | null;
}

import { API_URL as apiBase } from '~/utils/apiUrl';
const products = ref<Product[]>([]);
const error = ref<string | null>(null);
const query = ref('');
const loading = ref(false);
const loadingDeep = ref(false);
const isDeepSearching = ref(false);
const deepSearchPhrases = ['Buscando en la web...', 'Filtrando opciones...', 'Escogiendo los mejores modelos para ti...', 'Traduciendo y optimizando detalles...', 'Casi listo...'];
const deepSearchStatusIndex = ref(0);
let deepSearchStatusInterval: any = null;
const searchedLive = ref(false);
const rateLimited = ref(false);
const selected = ref<Product | null>(null);
const selectedInitialVariantIdx = ref<number>(0);

// Estado interactivo por tarjeta para previsualizar variantes, fotos y feedback de compra
const selectedCardVariant = reactive<Record<number, number>>({});
const cardImageIdx = reactive<Record<number, number>>({});
const hoveredProductId = ref<number | null>(null);
const justAddedId = ref<number | null>(null);
let justAddedTimer: any = null;

function getProductImages(p: Product): string[] {
  const set = new Set<string>();
  if (p.imageUrl) set.add(p.imageUrl);
  if (Array.isArray(p.images)) {
    for (const img of p.images) {
      if (img) set.add(img);
    }
  }
  if (Array.isArray(p.variants)) {
    for (const v of p.variants) {
      if (v?.imageUrl) set.add(v.imageUrl);
    }
  }
  return Array.from(set);
}

function getActiveVariantIdx(p: Product): number {
  const idx = selectedCardVariant[p.id] ?? 0;
  if (!Array.isArray(p.variants) || idx >= p.variants.length) return 0;
  return idx;
}

function getActiveVariant(p: Product): Variant | null {
  if (!Array.isArray(p.variants) || p.variants.length === 0) return null;
  return p.variants[getActiveVariantIdx(p)] || p.variants[0] || null;
}

function selectCardVariant(p: Product, vIdx: number) {
  selectedCardVariant[p.id] = vIdx;
  const v = Array.isArray(p.variants) ? p.variants[vIdx] : null;
  if (v?.imageUrl) {
    const imgs = getProductImages(p);
    const foundIdx = imgs.indexOf(v.imageUrl);
    if (foundIdx !== -1) {
      cardImageIdx[p.id] = foundIdx;
    }
  }
}

function getCardCurrentImage(p: Product): string {
  const imgs = getProductImages(p);
  if (imgs.length === 0) return '';
  if (cardImageIdx[p.id] !== undefined) {
    return imgs[cardImageIdx[p.id]] || imgs[0];
  }
  if (hoveredProductId.value === p.id && imgs.length > 1) {
    return imgs[1];
  }
  return imgs[0];
}

function getCurrentImageDisplayIndex(p: Product): number {
  const imgs = getProductImages(p);
  if (imgs.length <= 1) return 1;
  if (cardImageIdx[p.id] !== undefined) {
    return (cardImageIdx[p.id] % imgs.length) + 1;
  }
  if (hoveredProductId.value === p.id) {
    return 2;
  }
  return 1;
}

function stepCardImage(p: Product, delta: number) {
  const imgs = getProductImages(p);
  if (imgs.length <= 1) return;
  const current = cardImageIdx[p.id] ?? (hoveredProductId.value === p.id ? 1 : 0);
  cardImageIdx[p.id] = (current + delta + imgs.length) % imgs.length;
}

function isProductPersonalized(p: Product): boolean {
  if (/personaliz|custom|nombre|qr/i.test(p.title || '')) return true;
  if (!Array.isArray(p.variants)) return false;
  return p.variants.some(v => v?.name && /personalizada|personalizado|custom|nombre/i.test(v.name));
}

function isActiveVariantPersonalized(p: Product): boolean {
  if (/personaliz|custom|nombre|qr/i.test(p.title || '')) return true;
  const v = getActiveVariant(p);
  return Boolean(v?.name && /personalizada|personalizado|custom|nombre/i.test(v.name));
}

function getActivePrice(p: Product): number {
  const v = getActiveVariant(p);
  if (v && typeof v.price === 'number') return v.price;
  const rawPrice = p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0)));
  return typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice : 0;
}

function getFormattedActivePrice(p: Product): string {
  const n = getActivePrice(p);
  if (!n || isNaN(n)) return 'Gratis';
  return fmt(n);
}

function openProductDetail(product: Product) {
  selectedInitialVariantIdx.value = getActiveVariantIdx(product);
  selected.value = product;
}

function handleCardQuickAction(product: Product) {
  if (isActiveVariantPersonalized(product)) {
    openProductDetail(product);
    toast.info('Personaliza tu pieza', {
      description: 'Escribe el nombre o detalle que deseas grabar antes de agregar al carrito.'
    });
    return;
  }
  const vIdx = getActiveVariantIdx(product);
  const v = getActiveVariant(product);
  cart.addItem(product, vIdx, 1);
  justAddedId.value = product.id;
  clearTimeout(justAddedTimer);
  justAddedTimer = setTimeout(() => {
    if (justAddedId.value === product.id) justAddedId.value = null;
  }, 1600);

  toast.success('Agregado al carrito', {
    description: v ? `1x ${product.title} (${v.name})` : `1x ${product.title}`,
    duration: 3500,
    action: {
      label: 'Ver carrito',
      onClick: () => cart.openCart()
    }
  });
}

function normalizeText(s: string | null | undefined): string {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

interface CategoryDef {
  id: string;
  label: string;
  match: (p: Product) => boolean;
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    id: 'todos',
    label: 'Todos',
    match: () => true
  },
  {
    id: 'decoracion',
    label: 'Decoración',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('decoraci') || cat.includes('adorno') ||
        tags.some(t => t.includes('decorac') || t.includes('adorno') || t.includes('figura') || t.includes('lampara') || t.includes('cuadro')) ||
        title.includes('decorat') || title.includes('adorno');
    }
  },
  {
    id: 'hogar_organizacion',
    label: 'Hogar y Organización',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('organiza') || cat.includes('hogar') || cat.includes('cocina') || cat.includes('bano') ||
        tags.some(t => t.includes('organiza') || t.includes('hogar') || t.includes('cocina') || t.includes('soporte') || t.includes('estante') || t.includes('orden')) ||
        title.includes('organiz') || title.includes('soporte') || title.includes('dispensador');
    }
  },
  {
    id: 'juguetes_figuras',
    label: 'Juguetes y Figuras',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('juguete') || cat.includes('juego') || cat.includes('figura') || cat.includes('coleccion') || cat.includes('fidget') ||
        tags.some(t => t.includes('juguete') || t.includes('fidget') || t.includes('figura') || t.includes('coleccion') || t.includes('pokemon') || t.includes('articulado') || t.includes('antistres') || t.includes('antiestres')) ||
        title.includes('articulad') || title.includes('toy') || title.includes('fidget');
    }
  },
  {
    id: 'temporada',
    label: 'Temporada y Fiestas',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('navid') || cat.includes('halloween') || cat.includes('otono') || cat.includes('muerto') ||
        tags.some(t => t.includes('navid') || t.includes('halloween') || t.includes('otono') || t.includes('calavera') || t.includes('fantasma') || t.includes('bruja') || t.includes('pumpkin') || t.includes('calabaza')) ||
        title.includes('halloween') || title.includes('navidad') || title.includes('naviden');
    }
  },
  {
    id: 'accesorios',
    label: 'Accesorios y Estilo',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('accesorio') || cat.includes('llavero') || cat.includes('cosplay') || cat.includes('joyer') ||
        tags.some(t => t.includes('accesorio') || t.includes('llavero') || t.includes('llaveros') || t.includes('anillo') || t.includes('pulsera') || t.includes('cosplay')) ||
        title.includes('llavero') || title.includes('collar') || title.includes('pulsera');
    }
  },
  {
    id: 'tecnologia_gadgets',
    label: 'Tecnología y Gadgets',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('electr') || cat.includes('gadget') || cat.includes('smart') || cat.includes('tech') || cat.includes('tecnolog') || cat.includes('robot') ||
        tags.some(t => t.includes('smart') || t.includes('echo') || t.includes('gadget') || t.includes('tech') || t.includes('alexa') || t.includes('usb') || t.includes('cable') || t.includes('apple') || t.includes('magsafe')) ||
        title.includes('echo') || title.includes('alexa') || title.includes('gadget') || title.includes('soporte para echo');
    }
  },
  {
    id: 'herramientas',
    label: 'Herramientas y DIY',
    match: (p: Product) => {
      const cat = normalizeText(p.category);
      const tags = (p.tags || []).map(normalizeText);
      const title = normalizeText(p.title);
      return cat.includes('herramienta') || cat.includes('taller') || cat.includes('diy') || cat.includes('impresion 3d') ||
        tags.some(t => t.includes('herramienta') || t.includes('bricolaje') || t.includes('ferreteria') || t.includes('calibrador') || t.includes('medidor') || t.includes('taller')) ||
        title.includes('tool') || title.includes('herramienta') || title.includes('gauge') || title.includes('calibrador');
    }
  }
];

interface PricePreset {
  id: string;
  label: string;
  shortLabel: string;
  min: number;
  max: number;
}

const PRICE_PRESETS: PricePreset[] = [
  { id: 'all', label: 'Cualquier precio', shortLabel: 'Todos', min: 0, max: 1000 },
  { id: 'under100', label: 'Hasta $100', shortLabel: '< $100', min: 0, max: 100 },
  { id: '100to250', label: '$100 a $250', shortLabel: '$100 - $250', min: 100, max: 250 },
  { id: '250to500', label: '$250 a $500', shortLabel: '$250 - $500', min: 250, max: 500 },
  { id: 'over500', label: 'Más de $500', shortLabel: '> $500', min: 500, max: 1000 }
];

const selectedCategory = ref('todos');
const selectedTag = ref<string | null>(null);
const selectedPricePreset = ref('all');
const priceRange = ref([0, 1000]);
const minPriceInput = ref<number | null>(null);
const maxPriceInput = ref<number | null>(null);
const tagSearchQuery = ref('');
const isTagsExpanded = ref(false);
const showTagSearch = ref(false);
const tagSearchInputRef = ref<HTMLInputElement | null>(null);

const priceSummaryLabel = computed(() => {
  if (priceRange.value[0] === 0 && priceRange.value[1] >= 1000) {
    return 'Cualquier precio';
  }
  if (priceRange.value[1] >= 1000) {
    return `Desde ${fmt(priceRange.value[0])}`;
  }
  return `${fmt(priceRange.value[0])} - ${fmt(priceRange.value[1])}`;
});

watch(priceRange, (newVal) => {
  if (!Array.isArray(newVal) || newVal.length < 2) return;
  const match = PRICE_PRESETS.find(p => p.min === newVal[0] && p.max === newVal[1]);
  selectedPricePreset.value = match ? match.id : 'custom';
  minPriceInput.value = newVal[0] === 0 ? null : newVal[0];
  maxPriceInput.value = newVal[1] >= 1000 ? null : newVal[1];
}, { deep: true });

function selectPricePreset(preset: PricePreset) {
  selectedPricePreset.value = preset.id;
  priceRange.value = [preset.min, preset.max];
  minPriceInput.value = preset.min === 0 ? null : preset.min;
  maxPriceInput.value = preset.max >= 1000 ? null : preset.max;
}

function applyCustomPrice() {
  selectedPricePreset.value = 'custom';
  const min = typeof minPriceInput.value === 'number' && minPriceInput.value >= 0 ? minPriceInput.value : 0;
  const max = typeof maxPriceInput.value === 'number' && maxPriceInput.value > 0 ? maxPriceInput.value : 1000;
  priceRange.value = [min, max];
}

function getPresetCount(preset: PricePreset): number {
  return products.value.filter(p => {
    const hasVariants = Array.isArray(p.variants) && p.variants.length > 1;
    const rawPrice = hasVariants ? p.priceFrom : (p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0))));
    const price = typeof rawPrice === 'number' ? rawPrice : 0;
    if (preset.id === 'all') return true;
    if (preset.id === 'under100') return price <= 100;
    if (preset.id === '100to250') return price > 100 && price <= 250;
    if (preset.id === '250to500') return price > 250 && price <= 500;
    if (preset.id === 'over500') return price > 500;
    return true;
  }).length;
}

const categoriesWithCounts = computed(() => {
  return CATEGORY_DEFS.map(catDef => {
    const count = products.value.filter(catDef.match).length;
    return {
      id: catDef.id,
      label: catDef.label,
      count
    };
  });
});

const currentCategoryLabel = computed(() => {
  const found = CATEGORY_DEFS.find(c => c.id === selectedCategory.value);
  return found ? found.label : 'Todos';
});

interface TagItem {
  norm: string;
  display: string;
  count: number;
}

function formatTagDisplay(raw: string | null | undefined): string {
  if (!raw) return '';
  let clean = raw.trim().replace(/^#+/, '');
  clean = clean.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  clean = clean.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
  return clean;
}

const popularTags = computed<TagItem[]>(() => {
  const map = new Map<string, { norm: string; display: string; count: number }>();
  for (const p of products.value) {
    if (!p.tags || !Array.isArray(p.tags)) continue;
    const seen = new Set<string>();
    for (const raw of p.tags) {
      if (!raw || typeof raw !== 'string') continue;
      const clean = raw.trim();
      const norm = normalizeText(clean);
      if (!norm || norm.length < 3 || seen.has(norm)) continue;
      seen.add(norm);
      if (!map.has(norm)) {
        map.set(norm, { norm, display: clean, count: 0 });
      }
      const item = map.get(norm)!;
      item.count++;
      if (clean[0] === clean[0].toUpperCase() && item.display[0] !== item.display[0].toUpperCase()) {
        item.display = clean;
      }
    }
  }
  return Array.from(map.values())
    .filter(t => t.count >= 3)
    .sort((a, b) => b.count - a.count);
});

const filteredTags = computed(() => {
  if (!tagSearchQuery.value.trim()) return popularTags.value;
  const q = normalizeText(tagSearchQuery.value.trim());
  return popularTags.value.filter(t => t.norm.includes(q) || normalizeText(t.display).includes(q));
});

const visibleTags = computed(() => {
  if (tagSearchQuery.value.trim() || isTagsExpanded.value) {
    return filteredTags.value;
  }
  const top = filteredTags.value.slice(0, 8);
  if (selectedTag.value) {
    const activeNorm = normalizeText(selectedTag.value);
    const inTop = top.some(t => t.norm === activeNorm);
    if (!inTop) {
      const activeItem = filteredTags.value.find(t => t.norm === activeNorm);
      if (activeItem) return [...top, activeItem];
    }
  }
  return top;
});

function toggleTagSearch() {
  showTagSearch.value = !showTagSearch.value;
  if (showTagSearch.value) {
    isTagsExpanded.value = true;
    nextTick(() => {
      tagSearchInputRef.value?.focus();
    });
  } else {
    tagSearchQuery.value = '';
  }
}

function toggleTag(tag: string) {
  const norm = normalizeText(tag);
  if (selectedTag.value && normalizeText(selectedTag.value) === norm) {
    selectedTag.value = null;
  } else {
    selectedTag.value = tag;
  }
}

function isTagActive(tag: string | null | undefined): boolean {
  if (!tag || !selectedTag.value) return false;
  return normalizeText(tag) === normalizeText(selectedTag.value);
}

function handleSelectTagFromDetail(tag: string) {
  selected.value = null;
  toggleTag(tag);
}

function handleDeepSearchClick() {
  if (!query.value.trim()) {
    const searchEl = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchEl) {
      searchEl.focus();
      searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    toast.info('Buscador', { description: 'Escribe primero en el buscador qué modelo deseas encontrar.' });
    return;
  }
  triggerDeepSearch();
}

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'todos' ||
    selectedTag.value !== null ||
    priceRange.value[0] > 0 ||
    priceRange.value[1] < 1000 ||
    query.value.trim().length > 0;
});

function resetFilters() {
  selectedCategory.value = 'todos';
  selectedTag.value = null;
  selectedPricePreset.value = 'all';
  priceRange.value = [0, 1000];
  minPriceInput.value = null;
  maxPriceInput.value = null;
  tagSearchQuery.value = '';
  showTagSearch.value = false;
  isTagsExpanded.value = false;
  query.value = '';
}

const ALLOWED_BAZAR_LICENSES = new Set(['CC-BY', 'CC-BY-SA', 'CC0', 'custom']);

const filteredProducts = computed(() => {
  const currentCatDef = CATEGORY_DEFS.find(c => c.id === selectedCategory.value) || CATEGORY_DEFS[0];
  const targetTagNorm = selectedTag.value ? normalizeText(selectedTag.value) : null;

  return products.value.filter(p => {
    // 0. Licencia comercial libre (sin requerir suscripción/permiso de creador)
    if (!p.isCustom && p.licenseType && !ALLOWED_BAZAR_LICENSES.has(p.licenseType)) {
      return false;
    }

    // 1. Categoría
    if (selectedCategory.value !== 'todos' && !currentCatDef.match(p)) {
      return false;
    }

    // 2. Tag
    if (targetTagNorm) {
      const pTags = (p.tags || []).map(normalizeText);
      if (!pTags.includes(targetTagNorm)) {
        return false;
      }
    }

    // 3. Precio
    const hasVariants = Array.isArray(p.variants) && p.variants.length > 1;
    const rawPrice = hasVariants ? p.priceFrom : (p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0))));
    const price = typeof rawPrice === 'number' ? rawPrice : 0;

    const maxLimit = priceRange.value[1] >= 1000 ? Infinity : priceRange.value[1];
    if (price < priceRange.value[0] || price > maxLimit) {
      return false;
    }

    return true;
  });
});

async function triggerDeepSearch() {
  if (!query.value.trim()) return;
  trackEvent('search', { search_term: query.value.trim(), search_type: 'deep_makerworld' }, { search_term: query.value.trim() });
  loadingDeep.value = true;
  isDeepSearching.value = true;
  error.value = null;
  deepSearchStatusIndex.value = 0;
  clearInterval(deepSearchStatusInterval);
  deepSearchStatusInterval = setInterval(() => {
    deepSearchStatusIndex.value = (deepSearchStatusIndex.value + 1) % deepSearchPhrases.length;
  }, 4500);
  try {
    const url = `${apiBase}/products?q=${encodeURIComponent(query.value.trim())}&deep=true`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data)) {
      products.value = data.items || [];
      searchedLive.value = !!data.searchedLive;
      rateLimited.value = !!data.rateLimited;
    }
    toast.success('Búsqueda profunda iniciada', { description: 'Llegaron los primeros resultados. El resto seguirá cargando en el fondo en los próximos minutos.' });
    
    // Auto refresh local db without deep trigger every 15s for 1 min
    let ticks = 0;
    const interval = setInterval(async () => {
      ticks++;
      if (ticks > 20) {
        clearInterval(interval);
        isDeepSearching.value = false;
        clearInterval(deepSearchStatusInterval);
        return;
      }
      try {
        const refreshUrl = `${apiBase}/products?q=${encodeURIComponent(query.value.trim())}`;
        const refreshR = await fetch(refreshUrl);
        if (refreshR.ok) {
           const refreshData = await refreshR.json();
           if (!Array.isArray(refreshData) && refreshData.items) {
             products.value = refreshData.items;
           }
        }
      } catch (e) {}
    }, 3000);

  } catch (e: any) {
    toast.error('Error', { description: 'El servidor tardó demasiado o no respondió.' });
  } finally {
    loadingDeep.value = false;
  }
}

async function load(q: string) {
  loading.value = true;
  error.value = null;
  searchedLive.value = false;
  rateLimited.value = false;
  if (q) {
    trackEvent('search', { search_term: q, search_type: 'catalog' }, { search_term: q });
  }
  try {
    const url = q ? `${apiBase}/products?q=${encodeURIComponent(q)}` : `${apiBase}/products`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (Array.isArray(data)) {
      products.value = data;
    } else {
      products.value = data.items || [];
      searchedLive.value = !!data.searchedLive;
      rateLimited.value = !!data.rateLimited;
    }
  } catch (e: any) {
    error.value = 'No se pudieron cargar los productos. Intenta recargar la página.';
    console.error('Error fetching products:', e);
  } finally {
    loading.value = false;
  }
}

// Debounce 400ms
let debounceTimer: any = null;
watch(query, v => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => load(v.trim()), 400);
});

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function priceLabel(p: Product): string {
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 1;
  const rawPrice = hasVariants ? p.priceFrom : (p.priceFrom ?? (typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0))));
  const n = typeof rawPrice === 'number' ? rawPrice : 0;
  if (!n || isNaN(n)) return 'Gratis';
  return hasVariants ? `desde ${fmt(n)}` : fmt(n);
}

const seoTitle = computed(() => selected.value ? `${selected.value.title} — El Bazar` : 'El Bazar — Productos en impresión 3D y accesorios');
const seoDesc = computed(() => selected.value ? (selected.value.description || 'Producto en el bazar') : 'Galería de creaciones físicas: piezas en impresión 3D, accesorios de estilo de vida y electrónica diseñada con detalle.');
const seoImage = computed(() => selected.value?.imageUrl ? imgProxy(selected.value.imageUrl, { width: 1200 }) : 'https://shongyi.com/logo.png');

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
  ogImage: seoImage,
  ogType: 'website',
  ogUrl: computed(() => selected.value ? `https://shongyi.com/bazar?p=${selected.value.id}` : 'https://shongyi.com/bazar'),
  twitterCard: 'summary_large_image'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'El Bazar — El Rincón de Brandy',
      url: 'https://shongyi.com/bazar',
      description: 'Tienda de productos físicos en impresión 3D, accesorios de estilo de vida y electrónica.',
      parentOrganization: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
    })
  }]
})

const route = useRoute();
const router = useRouter();

watch(selected, (newVal) => {
  if (newVal) {
    router.replace({ query: { ...route.query, p: newVal.id } });
  } else {
    const newQuery = { ...route.query };
    delete newQuery.p;
    router.replace({ query: newQuery });
  }
});

onMounted(async () => {
  await load('');
  if (route.query.cat && typeof route.query.cat === 'string') {
    const targetCat = route.query.cat.toLowerCase();
    const found = CATEGORY_DEFS.find(c => c.id === targetCat || normalizeText(c.label) === targetCat);
    if (found) selectedCategory.value = found.id;
  }
  if (route.query.tag && typeof route.query.tag === 'string') {
    selectedTag.value = route.query.tag;
  }
  if (route.query.p) {
    const id = Number(route.query.p);
    const found = products.value.find(p => p.id === id);
    if (found) {
      selected.value = found;
    } else {
      try {
        const res = await fetch(`${apiBase}/products/${id}`);
        if (res.ok) {
          const prodData = await res.json();
          if (prodData) {
            selected.value = prodData;
          }
        }
      } catch (e) {}
    }
  }
});
</script>

