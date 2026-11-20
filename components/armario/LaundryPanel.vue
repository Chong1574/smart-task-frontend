<template>
  <div class="space-y-6">
    <!-- Dirty Basket -->
    <div class="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-serif text-lg font-bold">Cesto de ropa sucia ({{ dirtyItems.length }})</h3>
          <p class="text-xs text-muted-foreground">Selecciona prendas específicas o echa todo el cesto a lavar de una vez.</p>
        </div>
        <button
          type="button"
          @click="emit('transition', { action: 'end_day_undress' })"
          class="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold cursor-pointer self-start"
        >
          🌙 Cierre del día (quitar puestas)
        </button>
      </div>

      <div v-if="dirtyItems.length > 0" class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <label
            v-for="item in dirtyItems"
            :key="item.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors"
            :class="selectedDirtyIds.includes(item.id) ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border/60 bg-background/60'"
          >
            <input type="checkbox" :value="item.id" v-model="selectedDirtyIds" class="rounded accent-primary" />
            <span>{{ item.nickname || item.name }}</span>
          </label>
        </div>

        <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
          <input
            v-model="batchLabel"
            type="text"
            placeholder="Nombre de tanda (opcional, ej. Ropa oscura)"
            class="flex-1 h-9 rounded-xl border border-input bg-background px-3 text-sm"
          />
          <button
            type="button"
            @click="startWash"
            class="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
          >
            🧺 Echar a lavar {{ selectedDirtyIds.length ? `(${selectedDirtyIds.length})` : `(todas: ${dirtyItems.length})` }}
          </button>
        </div>
      </div>

      <p v-else class="text-xs text-muted-foreground py-2">
        No tienes ropa marcada como sucia en este momento.
      </p>
    </div>

    <!-- Active Laundry Batches -->
    <div class="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-xs">
      <h3 class="font-serif text-lg font-bold">Tandas activas ({{ activeBatches.length }})</h3>

      <div v-if="activeBatches.length === 0" class="text-xs text-muted-foreground py-3">
        No hay tandas lavándose, secándose ni pendientes de guardar.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="b in activeBatches"
          :key="b.id"
          class="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 class="font-semibold text-sm">{{ b.label }}</h4>
              <p class="text-xs text-muted-foreground">
                {{ b.itemCount }} prendas · Estado: <strong class="text-foreground">{{ STATUS_LABELS[b.status] }}</strong>
                <span v-if="b.dry_method"> · {{ b.dry_method }}</span>
                · hace {{ elapsedLabel(b.status_updated_at) }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="b.status === 'lavandose'"
                type="button"
                @click="emit('transition', { action: 'to_dry', batchId: b.id, dryMethod: 'tendedero' })"
                class="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 cursor-pointer"
              >
                ☀️ Tendedero
              </button>
              <button
                v-if="b.status === 'lavandose'"
                type="button"
                @click="emit('transition', { action: 'to_dry', batchId: b.id, dryMethod: 'secadora' })"
                class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
              >
                🌀 Secadora
              </button>
              <button
                v-if="b.status === 'secandose' || b.status === 'lavandose'"
                type="button"
                @click="emit('transition', { action: 'to_unfolded', batchId: b.id })"
                class="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500 cursor-pointer"
              >
                📥 Recoger sin doblar
              </button>
              <button
                type="button"
                @click="emit('transition', { action: 'to_closet', batchId: b.id })"
                class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 cursor-pointer"
              >
                ✅ Guardar en clóset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loose unfolded / washing items fallback if no batch record -->
      <div v-if="unfoldedCount > 0" class="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
        <p class="text-xs text-muted-foreground">
          Hay <strong>{{ unfoldedCount }}</strong> prendas limpias sin guardar.
        </p>
        <button
          type="button"
          @click="emit('transition', { action: 'to_closet' })"
          class="px-3 py-1.5 rounded-lg bg-emerald-600/15 text-emerald-500 hover:bg-emerald-600/25 text-xs font-semibold cursor-pointer"
        >
          Guardar todas en el clóset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { STATUS_LABELS, type WardrobeBatch, type WardrobeItem } from '~/types/armario';

const props = defineProps<{
  items: WardrobeItem[];
  activeBatches: WardrobeBatch[];
}>();

const emit = defineEmits<{
  transition: [payload: { action: string; label?: string; dryMethod?: string; batchId?: string; garmentIds?: string[] }];
}>();

const batchLabel = ref('');
const selectedDirtyIds = ref<string[]>([]);

const dirtyItems = computed(() => props.items.filter((i) => i.status === 'sucia'));
const unfoldedCount = computed(() => props.items.filter((i) => i.status === 'limpia_sin_guardar').length);

function startWash() {
  emit('transition', {
    action: 'start_wash',
    label: batchLabel.value.trim() || undefined,
    garmentIds: selectedDirtyIds.value.length > 0 ? selectedDirtyIds.value : undefined,
  });
  batchLabel.value = '';
  selectedDirtyIds.value = [];
}

function elapsedLabel(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min`;
  return `${Math.round((mins / 60) * 10) / 10} h`;
}
</script>
