<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Proyectos & Metas</h1>
          <p class="text-muted-foreground">Agrupa tus tareas y visualiza tu progreso general.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo Proyecto
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card Proyecto Mock -->
        <div class="bg-card border border-border/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-bold text-xl">Renovación del Jardín</h3>
            <span class="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">Activo</span>
          </div>
          <p class="text-muted-foreground text-sm mb-6 line-clamp-2">Plantar nuevos árboles, arreglar el césped y construir el sistema de riego automático.</p>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm font-medium">
              <span>Progreso</span>
              <span>45%</span>
            </div>
            <div class="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" style="width: 45%"></div>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-sm text-muted-foreground">
            <span>12 Tareas Totales</span>
            <span class="flex -space-x-2">
              <!-- Avatares o iconos de tareas (mocks) -->
              <div class="w-6 h-6 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[10px] text-primary">T</div>
              <div class="w-6 h-6 rounded-full border-2 border-card bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-500">T</div>
            </span>
          </div>
        </div>

      </div>

    </div>
  </NuxtLayout>
</template>

<script setup>
</script>
