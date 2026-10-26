<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold">Backoffice del Bazar</h1>
        <p class="text-muted-foreground">
          Gestiona tus diseños custom o importa lotes de productos desde MakerWorld (con filtro de licencia comercial, enriquecimiento Gemini y publicación en Mercado Libre).
        </p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/taskman/admin/bazar/upload"
          class="whitespace-nowrap rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          + Subir custom
        </NuxtLink>
      </div>
    </div>

    <!-- Pestañas -->
    <div class="flex border-b border-border/60 gap-2 overflow-x-auto">
      <button
        type="button"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
        :class="activeTab === 'direct' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'direct'"
      >
        Importar por ID / Link MakerWorld
      </button>
      <button
        type="button"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
        :class="activeTab === 'batch' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'batch'"
      >
        Lotes por Conceptos JSON
      </button>
      <button
        type="button"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
        :class="activeTab === 'custom' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'custom'"
      >
        Diseños Custom ({{ products.length }})
      </button>
    </div>

    <!-- TAB 0: IMPORTADOR DIRECTO POR ID / LINK -->
    <div v-if="activeTab === 'direct'" class="space-y-6">
      <div class="rounded-xl border border-border/60 bg-card p-5 space-y-4">
        <div>
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <span>Importar Modelos Seleccionados de MakerWorld</span>
          </h2>
          <p class="text-xs text-muted-foreground mt-1">
            Pega los IDs o enlaces de los modelos que elegiste en MakerWorld (ej. <code>95181</code> o <code>https://makerworld.com/es/models/3448045</code>). Se extraerán los datos técnicos, se calculará el precio con tus filamentos, se enriquecerá con IA y quedará publicado en el Bazar y Mercado Libre.
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              IDs o Enlaces de MakerWorld (uno por línea o separados por coma)
            </label>
            <textarea
              v-model="singleInputText"
              rows="4"
              class="w-full rounded-lg border border-border bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="95181&#10;https://makerworld.com/es/models/3448045"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Categoría en el Bazar
              </label>
              <select v-model="singleCategory" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="Gadgets & Utilidades">Gadgets & Utilidades</option>
                <option value="Hogar & Deco">Hogar & Deco</option>
                <option value="Organización & Setup">Organización & Setup</option>
                <option value="Coleccionables & Figuras">Coleccionables & Figuras</option>
                <option value="Juegos & Diversión">Juegos & Diversión</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                type="button"
                :disabled="singleRunning || !singleInputText.trim()"
                class="w-full rounded-lg bg-primary text-primary-foreground py-2 px-5 text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                @click="runSingleImport"
              >
                <span v-if="singleRunning" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                <span>{{ singleRunning ? 'Importando y Publicando…' : 'Importar y Publicar en Bazar' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Alertas de estado -->
        <div v-if="singleRunning" class="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary animate-pulse font-medium">
          ⏳ Procesando en n8n: extrayendo detalles técnicos de MakerWorld, calculando costos de filamento, enriqueciendo con Gemini y publicando...
        </div>

        <div v-if="singleSuccess" class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 font-semibold flex items-center gap-2">
          <span>✅ {{ singleSuccess }}</span>
        </div>

        <div v-if="singleError" class="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          ❌ {{ singleError }}
        </div>
      </div>
    </div>

    <!-- TAB 1: IMPORTADOR BATCH MAKERWORLD -->
    <div v-if="activeTab === 'batch'" class="space-y-6">
      <!-- Estado de Mercado Libre -->
      <div class="rounded-xl border border-border/60 bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold">Conexión con Mercado Libre</span>
            <span
              v-if="meliStatus"
              class="text-xs px-2.5 py-0.5 rounded-full font-medium"
              :class="meliIsHealthy ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'"
            >
              {{ meliIsHealthy ? 'Conectado y Activo' : 'Token Expirado — Requiere Reconectar' }}
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            <template v-if="meliIsHealthy">
              Los productos importados se publicarán tanto en el Bazar de El Rincón de Brandy como en Mercado Libre automáticamente.
            </template>
            <template v-else>
              Si no reconectas Mercado Libre, los productos se guardarán en el Bazar pero se omitirá su publicación en MELI.
            </template>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <a
            v-if="meliAuthUrl"
            :href="meliAuthUrl"
            target="_blank"
            rel="noopener"
            class="whitespace-nowrap rounded-lg border border-primary/40 bg-primary/10 text-primary px-3.5 py-2 text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            {{ meliIsHealthy ? 'Renovar vínculo MELI' : 'Vincular Mercado Libre' }}
          </a>
          <button
            type="button"
            class="rounded-lg border border-border px-3 py-2 text-xs hover:bg-secondary transition-colors"
            @click="fetchMeliStatus"
          >
            Verificar estado
          </button>
        </div>
      </div>

      <!-- Panel de entrada JSON -->
      <div class="rounded-xl border border-border/60 bg-card p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-lg font-semibold">JSON de Búsquedas MakerWorld</h2>
            <p class="text-xs text-muted-foreground">
              Pega el objeto con <code>busquedas_makerworld</code>. Por cada concepto buscará el Top 3 con licencia comercial permitida (usando <code>query_alternativa_ingles</code> como respaldo), calculará costos por gramos/horas, enriquecerá con Gemini y publicará en Bazar y Mercado Libre.
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <label class="text-xs text-muted-foreground">Top por concepto:</label>
            <select v-model.number="limitPerConcept" class="rounded-md border bg-background px-2.5 py-1 text-xs font-medium">
              <option :value="1">1 producto</option>
              <option :value="2">2 productos</option>
              <option :value="3">3 productos (Recomendado)</option>
              <option :value="5">5 productos</option>
            </select>
            <button
              type="button"
              class="text-xs rounded-md border border-border px-2.5 py-1 hover:bg-secondary transition-colors"
              @click="resetPresetJson"
            >
              Cargar JSON base
            </button>
          </div>
        </div>

        <textarea
          v-model="batchJsonText"
          rows="14"
          spellcheck="false"
          class="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder='{ "busquedas_makerworld": [ ... ] }'
        />

        <!-- Vista previa de conceptos detectados -->
        <div v-if="parsedConceptsPreview.length > 0" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span>Conceptos detectados en el JSON: <strong>{{ parsedConceptsPreview.length }}</strong> (máx ~{{ parsedConceptsPreview.length * limitPerConcept }} productos a procesar)</span>
            <span v-if="jsonParseError" class="text-destructive font-medium">{{ jsonParseError }}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div
              v-for="c in parsedConceptsPreview"
              :key="c.id || c.nombre_concepto"
              class="rounded-lg border border-border/50 bg-secondary/20 px-3 py-2 text-xs flex flex-col gap-0.5"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-foreground truncate">#{{ c.id }} · {{ c.nombre_concepto }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0 truncate max-w-[160px]">{{ c.categoria }}</span>
              </div>
              <div class="text-muted-foreground truncate">
                <span class="font-mono text-[11px]">1ª: "{{ c.query_principal_ingles }}"</span>
                <span v-if="c.query_alternativa_ingles" class="font-mono text-[11px] ml-2">· 2ª: "{{ c.query_alternativa_ingles }}"</span>
              </div>
            </div>
          </div>
        </div>
        <p v-else-if="jsonParseError" class="text-xs text-destructive font-medium">
          {{ jsonParseError }}
        </p>

        <div v-if="batchError" class="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {{ batchError }}
        </div>

        <div class="flex items-center justify-between gap-4 pt-2">
          <p class="text-xs text-muted-foreground">
            <span v-if="batchRunning" class="text-primary font-medium animate-pulse">
              {{ batchProgress || 'Procesando en n8n (FlareSolverr + Gemini + Bazar + Mercado Libre + Drive)…' }}
            </span>
            <span v-else>
              Listo para ejecutar el pipeline completo en n8n.
            </span>
          </p>
          <button
            type="button"
            :disabled="batchRunning || parsedConceptsPreview.length === 0"
            class="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
            @click="runBatchImport"
          >
            {{ batchRunning ? 'Ejecutando proceso en n8n…' : 'Ejecutar Búsqueda y Publicación' }}
          </button>
        </div>
      </div>

      <!-- Resultados de la ejecución -->
      <div v-if="batchResult" class="rounded-xl border border-border/60 bg-card p-5 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div>
            <h3 class="text-lg font-semibold">Resultado de la Ejecución</h3>
            <p class="text-xs text-muted-foreground">Resumen del pipeline en n8n</p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="px-3 py-1 rounded-full bg-secondary font-medium">
              Conceptos: {{ batchResult.summary?.conceptsProcessed ?? 0 }}
            </span>
            <span class="px-3 py-1 rounded-full bg-primary/15 text-primary font-semibold">
              Enriquecidos con Gemini: {{ batchResult.summary?.enrichedCount ?? 0 }}
            </span>
            <span class="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-semibold">
              Bazar Nuevos: {{ batchResult.summary?.bazar?.created ?? 0 }} · Actualizados: {{ batchResult.summary?.bazar?.updated ?? 0 }}
            </span>
            <span class="px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 font-semibold">
              MELI Publicados: {{ batchResult.summary?.meliPublished ?? 0 }}
            </span>
            <a
              v-if="batchResult.summary?.driveUploadedCount !== undefined"
              :href="batchResult.summary?.driveFolderUrl || 'https://drive.google.com/drive/folders/1YQMXeP7h3s53_8RxPs4C7lAK4XxwU_Do'"
              target="_blank"
              rel="noopener"
              class="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 font-semibold hover:underline"
            >
              Drive (Posts + Imágenes): {{ batchResult.summary?.driveUploadedCount ?? 0 }} archivos ↗
            </a>
          </div>
        </div>

        <!-- Desglose por concepto -->
        <div v-if="batchResult.conceptReports?.length" class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reporte por Concepto y Licencias</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="rep in batchResult.conceptReports"
              :key="rep.id"
              class="rounded-lg border border-border/50 p-3 text-xs space-y-1"
            >
              <div class="font-semibold">{{ rep.nombre_concepto }}</div>
              <div class="text-muted-foreground flex flex-wrap gap-2">
                <span>Seleccionados: <strong>{{ rep.seleccionados }}</strong></span>
                <span>· Descartados por licencia NC/unknown: <strong>{{ rep.descartados_licencia }}</strong></span>
                <span v-if="rep.usada_alternativa" class="text-amber-600 font-medium">· Usó query alternativa</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos enriquecidos y publicados -->
        <div v-if="batchResult.products?.length" class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Productos Procesados ({{ batchResult.products.length }})</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="prod in batchResult.products"
              :key="prod.externalId"
              class="rounded-lg border border-border/60 p-3 flex gap-3 bg-background/50"
            >
              <img
                v-if="prod.imageUrl"
                :src="prod.imageUrl"
                :alt="prod.title"
                class="w-16 h-16 rounded-md object-cover shrink-0"
              />
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-start justify-between gap-2">
                  <h5 class="text-xs font-semibold truncate" :title="prod.title">{{ prod.title }}</h5>
                  <span class="text-xs font-bold text-primary shrink-0">{{ formatPrice(prod.price) }}</span>
                </div>
                <p class="text-[11px] text-muted-foreground line-clamp-2">{{ prod.description }}</p>
                <div class="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground pt-1">
                  <span class="px-1.5 py-0.5 rounded bg-secondary">{{ prod.licenseType }}</span>
                  <span>{{ prod.variantsCount }} variantes</span>
                  <a :href="`/bazar?p=${prod.externalId}`" target="_blank" rel="noopener" class="text-primary font-semibold hover:underline">Ver en Bazar ↗</a>
                  <a v-if="prod.sourceUrl" :href="prod.sourceUrl" target="_blank" rel="noopener" class="text-primary hover:underline">MakerWorld ↗</a>
                  <template v-if="getMeliStatusForProduct(prod.externalId)">
                    <a
                      v-if="getMeliStatusForProduct(prod.externalId)?.permalink"
                      :href="getMeliStatusForProduct(prod.externalId).permalink"
                      target="_blank"
                      rel="noopener"
                      class="text-emerald-600 font-semibold hover:underline"
                    >
                      Ver en MELI ↗
                    </a>
                    <span v-else class="text-amber-600 font-medium" :title="getMeliStatusForProduct(prod.externalId)?.error">
                      MELI: {{ getMeliStatusForProduct(prod.externalId)?.status }}
                    </span>
                    <span
                      v-if="getMeliStatusForProduct(prod.externalId)?.categoryName"
                      class="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                      :title="`Categoría MELI: ${getMeliStatusForProduct(prod.externalId)?.categoryId}`"
                    >
                      📁 {{ getMeliStatusForProduct(prod.externalId)?.categoryName }}
                    </span>
                  </template>
                </div>
                <p
                  v-if="getMeliStatusForProduct(prod.externalId)?.error"
                  class="text-[10px] text-amber-600/90 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 mt-1 break-words"
                >
                  Detalle MELI: {{ getMeliStatusForProduct(prod.externalId).error }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: DISEÑOS CUSTOM -->
    <div v-else class="space-y-4">
      <div v-if="loading" class="text-muted-foreground text-sm">Cargando…</div>
      <div v-else-if="fetchError" class="text-destructive text-sm">{{ fetchError }}</div>
      <div v-else-if="products.length === 0" class="text-muted-foreground text-sm">
        Todavía no has subido ningún diseño custom.
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="p in products"
          :key="p.id"
          class="rounded-lg border border-border/60 bg-card p-4"
        >
          <!-- Vista normal -->
          <div v-if="editingId !== p.id" class="flex gap-4">
            <img
              v-if="p.imageUrl"
              :src="p.imageUrl"
              :alt="p.title"
              class="w-20 h-20 rounded-md object-cover flex-shrink-0"
            />
            <div class="flex-grow min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-medium truncate">{{ p.title }}</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="p.isPublic ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'"
                >
                  {{ p.isPublic ? 'Público' : 'Privado' }}
                </span>
              </div>
              <p class="text-xs text-muted-foreground line-clamp-1">{{ p.description }}</p>
              <div class="text-xs text-muted-foreground mt-1 flex gap-3 flex-wrap">
                <span>{{ formatPrice(p.price) }}</span>
                <span v-if="p.category">· {{ p.category }}</span>
                <span v-if="p.fileSizeBytes">· {{ formatSize(p.fileSizeBytes) }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <button
                type="button"
                class="text-xs rounded-md border border-border px-3 py-1 hover:bg-accent"
                @click="startEdit(p)"
              >
                Editar
              </button>
              <button
                type="button"
                class="text-xs rounded-md border border-destructive/40 text-destructive px-3 py-1 hover:bg-destructive/10"
                :disabled="deletingId === p.id"
                @click="onDelete(p)"
              >
                {{ deletingId === p.id ? 'Borrando…' : 'Borrar' }}
              </button>
            </div>
          </div>

          <!-- Vista edición -->
          <form v-else class="space-y-3" @submit.prevent="saveEdit(p)">
            <input v-model="editBuffer.title" class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Título" required />
            <textarea v-model="editBuffer.description" rows="3" class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Descripción" required />
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="editBuffer.price" type="number" min="0" step="1" class="rounded-md border bg-background px-3 py-2 text-sm" placeholder="Precio MXN" />
              <select v-model="editBuffer.category" class="rounded-md border bg-background px-3 py-2 text-sm">
                <option value="Coleccionables & Figuras">Coleccionables & Figuras</option>
                <option value="Hogar & Deco">Hogar & Deco</option>
                <option value="Organización & Setup">Organización & Setup</option>
                <option value="Gadgets & Utilidades">Gadgets & Utilidades</option>
                <option value="Juegos & Diversión">Juegos & Diversión</option>
              </select>
            </div>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="editBuffer.isPublic" type="checkbox" />
              <span>Archivo público</span>
            </label>
            <p v-if="editError" class="text-xs text-destructive">{{ editError }}</p>
            <div class="flex gap-2">
              <button type="submit" :disabled="saving" class="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm disabled:opacity-50">
                {{ saving ? 'Guardando…' : 'Guardar' }}
              </button>
              <button type="button" class="rounded-md border border-border px-4 py-1.5 text-sm" @click="cancelEdit()">
                Cancelar
              </button>
            </div>
          </form>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import api from '~/utils/api';

definePageMeta({ layout: 'taskman' });

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileSizeBytes?: number;
  isPublic?: boolean;
  isCustom?: boolean;
  source?: string;
}

const DEFAULT_MAKERWORLD_JSON = {
  busquedas_makerworld: [
    {
      id: 1,
      categoria: 'Ingeniería / Fidget Mecánico o Gadget de Escritorio',
      nombre_concepto: 'Caja de Apertura Cinética con Iris Mecánico',
      query_principal_ingles: 'print in place mechanical iris box',
      query_alternativa_ingles: 'aperture storage container',
    },
    {
      id: 2,
      categoria: 'Ingeniería / Fidget Mecánico o Gadget de Escritorio',
      nombre_concepto: 'Interruptor Táctil Biestable de Mecanismo Flexible',
      query_principal_ingles: 'compliant mechanism fidget',
      query_alternativa_ingles: 'bistable switch print in place',
    },
    {
      id: 3,
      categoria: 'Supervivencia / EDC Táctico o Utilidad',
      nombre_concepto: 'Mosquetón Táctico Monolítico con Bloqueo por Torsión',
      query_principal_ingles: 'compliant carabiner locking',
      query_alternativa_ingles: 'tactical molle clip print in place',
    },
    {
      id: 4,
      categoria: 'Supervivencia / EDC Táctico o Utilidad',
      nombre_concepto: 'Estuche Modular de Precisión con Trinquete para Puntas Hexadecimales',
      query_principal_ingles: 'edc bit holder case print in place',
      query_alternativa_ingles: 'pocket ratchet bit driver',
    },
    {
      id: 5,
      categoria: 'Decoración Funcional / Iluminación y Arquitectura',
      nombre_concepto: 'Organizador Arquitectónico Brutalista en Voladizo',
      query_principal_ingles: 'brutalist desk organizer',
      query_alternativa_ingles: 'architectural modular desk tray',
    },
    {
      id: 6,
      categoria: 'Decoración Funcional / Iluminación y Arquitectura',
      nombre_concepto: 'Torre Lumínica de Persiana Direccional Cyberpunk',
      query_principal_ingles: 'louvered light diffuser lamp',
      query_alternativa_ingles: 'architectural shadow lamp led',
    },
  ],
};

const authStore = useAuthStore();
const router = useRouter();

const activeTab = ref<'direct' | 'batch' | 'custom'>('direct');

// Estado Importador Directo por ID/Link
const singleInputText = ref('');
const singleCategory = ref('Gadgets & Utilidades');
const singleRunning = ref(false);
const singleError = ref<string | null>(null);
const singleSuccess = ref<string | null>(null);

async function runSingleImport() {
  const raw = singleInputText.value.trim();
  if (!raw) return;

  const items = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  if (items.length === 0) return;

  singleRunning.value = true;
  singleError.value = null;
  singleSuccess.value = null;

  try {
    if (items.length === 1) {
      const item = items[0];
      const isUrl = item.startsWith('http');
      const payload: any = {
        categoria: singleCategory.value,
        forzarLicencia: true,
      };
      if (isUrl) payload.url = item;
      else payload.modelId = item;

      await api.post('/products/batch-import', payload, { timeout: 240_000 });
      singleSuccess.value = `¡Modelo ${item} procesado y publicado con éxito en el Bazar!`;
    } else {
      const modelIds = items.map(it => {
        const match = it.match(/models\/(\d+)/i);
        return match ? match[1] : it;
      });
      await api.post('/products/batch-import', {
        modelIds,
        categoria: singleCategory.value,
      }, { timeout: 360_000 });
      singleSuccess.value = `¡Se procesaron ${items.length} modelos y quedaron publicados en el Bazar!`;
    }
    singleInputText.value = '';
    await refresh();
  } catch (e: any) {
    singleError.value = e.response?.data?.error || e.message || 'Error al importar modelo de MakerWorld';
  } finally {
    singleRunning.value = false;
  }
}

// Estado Batch Importer
const batchJsonText = ref(JSON.stringify(DEFAULT_MAKERWORLD_JSON, null, 2));
const limitPerConcept = ref(3);
const batchRunning = ref(false);
const batchError = ref<string | null>(null);
const batchResult = ref<any | null>(null);

// Estado Mercado Libre
const meliStatus = ref<any | null>(null);
const meliAuthUrl = ref<string | null>(null);
const meliIsHealthy = computed(() => {
  if (!meliStatus.value?.linked) return false;
  return (meliStatus.value.expiresInSec && meliStatus.value.expiresInSec > 0) || Boolean(meliStatus.value.hasRefreshToken);
});

const jsonParseError = computed(() => {
  try {
    const parsed = JSON.parse(batchJsonText.value);
    const list = Array.isArray(parsed?.busquedas_makerworld) ? parsed.busquedas_makerworld : (Array.isArray(parsed) ? parsed : null);
    if (!list || list.length === 0) return 'El JSON debe contener un arreglo "busquedas_makerworld" con al menos 1 concepto.';
    return null;
  } catch (e: any) {
    return `JSON inválido: ${e.message}`;
  }
});

const parsedConceptsPreview = computed(() => {
  try {
    const parsed = JSON.parse(batchJsonText.value);
    const list = Array.isArray(parsed?.busquedas_makerworld) ? parsed.busquedas_makerworld : (Array.isArray(parsed) ? parsed : []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
});

function resetPresetJson() {
  batchJsonText.value = JSON.stringify(DEFAULT_MAKERWORLD_JSON, null, 2);
  batchError.value = null;
}

async function fetchMeliStatus() {
  try {
    const { data } = await api.get('/meli/admin-status');
    meliStatus.value = data.status;
    meliAuthUrl.value = data.url;
  } catch {
    // Ignorar silenciosamente si falla
  }
}

const batchProgress = ref('');

async function runBatchImport() {
  const concepts = parsedConceptsPreview.value;
  if (concepts.length === 0) return;
  batchRunning.value = true;
  batchError.value = null;
  batchProgress.value = '';

  const aggregated = {
    success: true,
    summary: {
      conceptsProcessed: 0,
      candidatesFound: 0,
      enrichedCount: 0,
      bazar: { created: 0, updated: 0, skipped: 0, errors: [] as any[] },
      meliConnected: false,
      meliPublished: 0,
      meliErrors: 0,
      driveUploadedCount: 0,
      driveFolderUrl: 'https://drive.google.com/drive/folders/1YQMXeP7h3s53_8RxPs4C7lAK4XxwU_Do',
    },
    conceptReports: [] as any[],
    meliResults: [] as any[],
    products: [] as any[],
    driveFiles: [] as any[],
  };
  batchResult.value = aggregated;

  try {
    for (let i = 0; i < concepts.length; i++) {
      const c = concepts[i];
      batchProgress.value = `Procesando concepto ${i + 1} de ${concepts.length}: "${c.nombre_concepto || c.query_principal_ingles}"…`;

      const { data } = await api.post(
        '/products/batch-import',
        {
          busquedas_makerworld: [c],
          limitPerConcept: limitPerConcept.value,
        },
        { timeout: 180_000 }
      );

      if (data?.summary) {
        aggregated.summary.conceptsProcessed += Number(data.summary.conceptsProcessed || 1);
        aggregated.summary.candidatesFound += Number(data.summary.candidatesFound || 0);
        aggregated.summary.enrichedCount += Number(data.summary.enrichedCount || 0);
        aggregated.summary.bazar.created += Number(data.summary.bazar?.created || 0);
        aggregated.summary.bazar.updated += Number(data.summary.bazar?.updated || 0);
        aggregated.summary.bazar.skipped += Number(data.summary.bazar?.skipped || 0);
        if (Array.isArray(data.summary.bazar?.errors)) {
          aggregated.summary.bazar.errors.push(...data.summary.bazar.errors);
        }
        if (data.summary.meliConnected) aggregated.summary.meliConnected = true;
        aggregated.summary.meliPublished += Number(data.summary.meliPublished || 0);
        aggregated.summary.meliErrors += Number(data.summary.meliErrors || 0);
        aggregated.summary.driveUploadedCount += Number(data.summary.driveUploadedCount || 0);
        if (data.summary.driveFolderUrl) aggregated.summary.driveFolderUrl = data.summary.driveFolderUrl;
      }
      if (Array.isArray(data?.conceptReports)) aggregated.conceptReports.push(...data.conceptReports);
      if (Array.isArray(data?.meliResults)) aggregated.meliResults.push(...data.meliResults);
      if (Array.isArray(data?.products)) aggregated.products.push(...data.products);
      if (Array.isArray(data?.driveFiles)) aggregated.driveFiles.push(...data.driveFiles);

      // Trigger reactivity update after each concept
      batchResult.value = { ...aggregated, summary: { ...aggregated.summary, bazar: { ...aggregated.summary.bazar } } };
    }
    await fetchMeliStatus();
  } catch (e: any) {
    batchError.value = e.response?.data?.error || e.message || 'Error al ejecutar el proceso en n8n';
  } finally {
    batchRunning.value = false;
    batchProgress.value = '';
  }
}

function getMeliStatusForProduct(externalId: string) {
  if (!batchResult.value?.meliResults) return null;
  return batchResult.value.meliResults.find((r: any) => String(r.externalId) === String(externalId)) || null;
}

// Estado Custom Products
const products = ref<Product[]>([]);
const loading = ref(true);
const fetchError = ref<string | null>(null);

const editingId = ref<number | null>(null);
const editBuffer = reactive({
  title: '',
  description: '',
  price: 0,
  category: '',
  isPublic: true,
});
const editError = ref<string | null>(null);
const saving = ref(false);
const deletingId = ref<number | null>(null);

onMounted(async () => {
  if (!authStore.user?.email) {
    router.replace('/login');
    return;
  }
  await Promise.all([refresh(), fetchMeliStatus()]);
});

async function refresh() {
  loading.value = true;
  fetchError.value = null;
  try {
    const { data } = await api.get('/products');
    products.value = (data as Product[]).filter(p => p.source === 'CUSTOM');
  } catch (e: any) {
    fetchError.value = e.response?.data?.error || 'Error al cargar productos';
  } finally {
    loading.value = false;
  }
}

function startEdit(p: Product) {
  editingId.value = p.id;
  editBuffer.title = p.title;
  editBuffer.description = p.description;
  editBuffer.price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0)) || 0;
  editBuffer.category = p.category || 'Gadgets & Utilidades';
  editBuffer.isPublic = p.isPublic !== false;
  editError.value = null;
}

function cancelEdit() {
  editingId.value = null;
  editError.value = null;
}

async function saveEdit(p: Product) {
  saving.value = true;
  editError.value = null;
  try {
    await api.put(`/products/${p.id}`, {
      title: editBuffer.title,
      description: editBuffer.description,
      price: editBuffer.price,
      category: editBuffer.category,
      isPublic: editBuffer.isPublic,
    });
    editingId.value = null;
    await refresh();
  } catch (e: any) {
    editError.value = e.response?.data?.error || 'Error al guardar';
  } finally {
    saving.value = false;
  }
}

async function onDelete(p: Product) {
  if (!confirm(`¿Borrar "${p.title}"? Los archivos en R2 quedan huérfanos.`)) return;
  deletingId.value = p.id;
  try {
    await api.delete(`/products/${p.id}`);
    await refresh();
  } catch (e: any) {
    alert(e.response?.data?.error || 'Error al borrar');
  } finally {
    deletingId.value = null;
  }
}

function formatPrice(price: number | string | null | undefined): string {
  const n = typeof price === 'number' ? price : parseFloat(String(price ?? 0));
  if (isNaN(n) || n === 0) return 'Gratis';
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
</script>
