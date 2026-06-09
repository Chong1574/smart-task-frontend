<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Mis Hábitos Diarios</h1>
          <p class="text-muted-foreground">Construye la mejor versión de ti, un día a la vez.</p>
        </div>
        <button class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Añadir Hábito
        </button>
      </div>

      <!-- Tracker de Hoy -->
      <div class="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Completar Hoy
        </h2>
        
        <div class="space-y-4">
          <!-- Hábito 1 Mock -->
          <div class="flex items-center justify-between p-4 rounded-2xl bg-background border border-border/30 hover:border-primary/30 transition-colors group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
                💧
              </div>
              <div>
                <h3 class="font-bold text-lg group-hover:text-primary transition-colors">Beber Agua</h3>
                <p class="text-sm text-muted-foreground">Meta: 2 Litros</p>
              </div>
            </div>
            <button class="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-colors text-transparent hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>

          <!-- Hábito 2 Mock (Completado) -->
          <div class="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/30 transition-colors group opacity-80">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
                📚
              </div>
              <div>
                <h3 class="font-bold text-lg text-primary line-through decoration-primary/50">Leer 30 min</h3>
                <p class="text-sm text-muted-foreground">Meta de hoy completada.</p>
              </div>
            </div>
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup>
</script>
