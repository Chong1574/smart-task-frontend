<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import InspirationWall from '@/components/InspirationWall.vue'
import QuoteTool from '@/components/QuoteTool.vue'
import { Button } from '@/components/ui/button'
import { Mail, Github, Instagram, Printer } from 'lucide-vue-next'

useHead({
  title: 'El Rincón de Brandy | Manufactura 3D Bajo Demanda',
  meta: [
    { name: 'description', content: 'Servicio de impresión 3D de alta precisión. De la idea a tus manos con Bambu Lab P1S.' }
  ]
})
</script>

<template>
  <div>
    <Navbar />
    
    <main>
      <Hero />
      <InspirationWall />
      <QuoteTool />

      <!-- Footer-like CTA / Process -->
      <section id="proceso" class="py-24 border-t">
        <div class="container text-center">
          <h2 class="text-3xl font-bold mb-12">Cómo funciona tu Digital Kinko's</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="flex flex-col items-center">
              <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span class="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 class="text-xl font-semibold mb-3">Busca o Sube</h3>
              <p class="text-muted-foreground text-sm">Elige un modelo de nuestro muro o pega un enlace de Thingiverse/MakerWorld.</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span class="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 class="text-xl font-semibold mb-3">Configura y Paga</h3>
              <p class="text-muted-foreground text-sm">Selecciona material y color. El sistema calcula el costo y pagas de forma segura.</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span class="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 class="text-xl font-semibold mb-3">Recibe en Casa</h3>
              <p class="text-muted-foreground text-sm">Tus piezas se encolan en nuestra Bambu Lab P1S y se envían por paquetería.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="py-12 border-t bg-muted/50">
      <div class="container flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2">
          <Printer class="h-5 w-5 text-primary" />
          <span class="font-bold">El Rincón de Brandy</span>
        </div>
        
        <div class="flex items-center gap-6">
          <a href="#" class="text-muted-foreground hover:text-foreground"><Instagram class="h-5 w-5" /></a>
          <a href="#" class="text-muted-foreground hover:text-foreground"><Github class="h-5 w-5" /></a>
          <a href="#" class="text-muted-foreground hover:text-foreground"><Mail class="h-5 w-5" /></a>
        </div>

        <p class="text-xs text-muted-foreground">
          © 2026 El Rincón de Brandy. Todos los derechos reservados.
          <br />
          Hecho con <span class="text-primary">Nuxt 3</span> y <span class="text-primary">shadcn-vue</span>.
        </p>
      </div>
    </footer>
  </div>
</template>
