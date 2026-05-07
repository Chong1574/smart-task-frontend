<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { LayoutDashboard, ArrowLeft, Construction } from 'lucide-vue-next'

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="container py-24 flex flex-col items-center text-center">
    <div class="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-8">
      <Construction class="h-10 w-10 text-primary" />
    </div>
    
    <h1 class="text-4xl font-bold mb-4">Task Manager en Transición</h1>
    <p class="text-xl text-muted-foreground max-w-2xl mb-12">
      Estamos integrando el Administrador de Tareas en esta nueva plataforma. Por ahora, esta sección está siendo reubicada para coexistir con "El Rincón de Brandy".
    </p>

    <div class="flex gap-4">
      <Button as-child variant="outline">
        <NuxtLink to="/">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Volver al Inicio
        </NuxtLink>
      </Button>
      <Button>
        <LayoutDashboard class="mr-2 h-4 w-4" />
        Acceder al Dashboard Legacy
      </Button>
    </div>

    <div class="mt-16 p-8 border rounded-xl bg-muted/30 max-w-md">
      <h3 class="font-semibold mb-2">Nota del Desarrollador</h3>
      <p class="text-sm text-muted-foreground">
        Tus datos y tareas siguen seguros en el backend. Estamos migrando los componentes de Vue 3 (Vite) a Nuxt 3 para una mejor experiencia integrada.
      </p>
    </div>
  </div>
</template>
