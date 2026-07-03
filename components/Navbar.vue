<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Rocket, Box, Sparkles, LayoutDashboard } from 'lucide-vue-next'
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
    <div class="container flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 overflow-hidden">
          <img src="/logo.png" alt="Logo" class="h-8 w-8 object-contain" />
        </div>
        <span class="text-xl font-bold tracking-tighter text-primary">El Rincón de Brandy</span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink to="/tienda" class="text-sm font-medium hover:text-primary transition-colors">Tienda</NuxtLink>
        <NuxtLink to="/muro" class="text-sm font-medium hover:text-primary transition-colors">Impresión 3D</NuxtLink>
        <NuxtLink to="/calculadora-3d" class="text-sm font-medium hover:text-primary transition-colors">Calculadora 3D</NuxtLink>
        <NuxtLink to="https://arveck.com/" target="_blank" external class="text-sm font-medium hover:text-primary transition-colors">Seguros Arveck</NuxtLink>
        <NuxtLink to="/#servicios" class="text-sm font-medium hover:text-primary transition-colors">Servicios</NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <Button variant="ghost" size="sm" as-child class="flex gap-2">
          <NuxtLink to="/taskman/dashboard">
            <LayoutDashboard class="h-4 w-4" />
            <span class="hidden sm:inline">Task Manager</span>
          </NuxtLink>
        </Button>
        <Button size="sm" class="gap-2" as-child>
          <NuxtLink to="/tienda">
            <Sparkles class="h-4 w-4" />
            <span class="hidden sm:inline">Explorar Tienda</span>
          </NuxtLink>
        </Button>
      </div>
    </div>
  </header>
</template>
