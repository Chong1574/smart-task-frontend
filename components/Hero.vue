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
          Un universo de posibilidades a partir de una semilla
        </Badge>
        
        <h1 class="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
          Tu idea es la semilla.<br/><span class="text-primary">Nosotros la hacemos crecer.</span>
        </h1>
        
        <p class="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          Bienvenido a El Rincón de Brandy. Una tienda integral donde encontrarás desde impresión 3D y artículos curiosos, hasta servicios de seguros y desarrollo web. Lo que necesites, aquí lo cultivamos.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
          <Button size="lg" class="h-12 px-8 text-md gap-2 shadow-lg shadow-primary/20" as-child>
            <a href="#servicios">
              Explorar Servicios
              <ArrowRight class="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="lg" class="h-12 px-8 text-md gap-2" as-child>
            <NuxtLink to="/tienda">
              Visitar Tienda
              <Layers class="h-5 w-5" />
            </NuxtLink>
          </Button>
        </div>

        <!-- Social Proof / Features -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">3D</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Manufactura</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">Web</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Desarrollo</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">Seguros</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Arveck</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl font-bold">Tienda</span>
            <span class="text-xs uppercase tracking-widest text-muted-foreground">Curiosidades</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Connection to the trunk -->
    <div class="absolute bottom-0 left-1/2 w-0.5 h-16 bg-gradient-to-b from-transparent to-border -translate-x-1/2">
      <div class="absolute top-0 w-0.5 bg-primary shadow-[0_0_15px_rgba(29,78,216,0.6)] animate-[pulse_2s_ease-in-out_infinite] h-full"></div>
    </div>
  </section>
</template>
