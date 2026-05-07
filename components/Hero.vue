<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Printer, Sparkles, ArrowRight, Layers } from 'lucide-vue-next'
</script>

<template>
  <section class="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
    <!-- Background Accents -->
    <div class="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-32" aria-hidden="true">
      <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-40"></div>
    </div>

    <div class="container relative z-10">
      <div class="mx-auto max-w-4xl text-center">
        <Badge variant="secondary" class="mb-6 px-4 py-1.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-1000">
          <Sparkles class="mr-2 h-3.5 w-3.5 text-primary" />
          El "Kinko's" Digital de la Impresión 3D
        </Badge>
        
        <h1 class="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Manufactura 3D de alta precisión <span class="text-primary">bajo demanda</span>
        </h1>
        
        <p class="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          De la idea a tus manos en tiempo récord. Utilizamos tecnología Bambu Lab P1S para piezas funcionales y prototipos en PLA y ABS.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" class="h-12 px-8 text-md gap-2 shadow-lg shadow-primary/20">
            Comenzar Cotización
            <ArrowRight class="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" class="h-12 px-8 text-md gap-2">
            Ver Muro de Inspiración
            <Layers class="h-5 w-5" />
          </Button>
        </div>

        <!-- Social Proof / Features -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">0.1mm</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Precisión</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">24h</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Prototipado</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">PLA/ABS</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Materiales</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">Bambu Lab</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Tecnología</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
