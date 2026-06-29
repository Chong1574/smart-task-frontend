<script setup lang="ts">
import { useConfirmStore } from '~/stores/confirm'

const store = useConfirmStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="store.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="store.cancel()"
      >
        <div class="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg">
          <h2 class="mb-2 font-serif text-lg font-semibold text-foreground">
            {{ store.title }}
          </h2>
          <p v-if="store.message" class="mb-5 text-sm text-muted-foreground">
            {{ store.message }}
          </p>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              @click="store.cancel()"
            >
              {{ store.cancelLabel }}
            </button>
            <button
              type="button"
              :class="[
                'rounded-md px-3 py-2 text-sm font-medium text-white',
                store.destructive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
              ]"
              @click="store.confirm()"
            >
              {{ store.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
