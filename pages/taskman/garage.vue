<template>
  <NuxtLayout name="taskman">
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold">Garage</h1>
          <p class="text-muted-foreground">Control de combustible y mantenimiento de tus vehículos.</p>
        </div>
        <div class="flex gap-2">
          <button class="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
            Nuevo Vehículo
          </button>
          <button class="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Registrar Carga
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Tarjeta Vehículo -->
        <div class="bg-card border border-border/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-xl">Mazda 3</h3>
              <p class="text-muted-foreground text-sm">XYZ-123</p>
            </div>
            <div class="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="bg-secondary/40 p-3 rounded-xl flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Último Odom.</span>
              <span class="font-mono font-bold">45,200 km</span>
            </div>
            <div class="bg-secondary/40 p-3 rounded-xl flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Rendimiento (L/100km)</span>
              <span class="font-mono font-bold text-green-500">8.5 L</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>
