<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Rocket, Box, Sparkles, LayoutDashboard } from 'lucide-vue-next'
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
    <div class="container flex h-16 items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Box class="h-5 w-5" />
        </div>
        <span class="text-xl font-bold tracking-tight">El Rincón de Brandy</span>
      </div>

      <nav class="hidden md:flex items-center gap-6">
        <a href="#muro" class="text-sm font-medium hover:text-primary transition-colors">Muro de Inspiración</a>
        <a href="#cotizador" class="text-sm font-medium hover:text-primary transition-colors">Cotizador</a>
        <a href="#proceso" class="text-sm font-medium hover:text-primary transition-colors">Cómo funciona</a>
      </nav>

      <div class="flex items-center gap-4">
        <!-- Legacy Link -->
        <Button variant="ghost" size="sm" as-child class="hidden sm:flex gap-2">
          <a href="/taskman/dashboard">
            <LayoutDashboard class="h-4 w-4" />
            <span>Task Manager</span>
          </a>
        </Button>
        <Button size="sm" class="gap-2">
          <Rocket class="h-4 w-4" />
          <span>Cotizar STL</span>
        </Button>
      </div>
    </div>
  </header>
</template>
