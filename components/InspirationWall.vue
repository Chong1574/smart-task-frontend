<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, ShoppingCart, Search, Sparkles, ArrowRight } from 'lucide-vue-next'

const { data: models, pending } = await useFetch('/api/models')

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch (e) {
    return url
  }
}
</script>

<template>
  <section id="muro" class="py-24 bg-muted/30">
    <div class="container">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div class="max-w-2xl">
          <h2 class="text-3xl font-bold tracking-tight mb-4">Muro de Inspiración</h2>
          <p class="text-muted-foreground">
            Explora las capacidades de nuestra granja de impresión. Si encuentras algo que te guste, nosotros lo fabricamos para ti.
          </p>
        </div>
        <div class="relative w-full md:w-80">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar modelos..." 
            class="w-full bg-background border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card v-for="model in models" :key="model.id" class="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
          <div class="aspect-video relative overflow-hidden">
            <img 
              :src="model.image_url" 
              :alt="model.title" 
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-3 left-3" v-if="model.trend_score > 5">
              <Badge class="bg-orange-500 hover:bg-orange-600 text-white border-none gap-1">
                <Sparkles class="h-3 w-3" />
                Tendencia
              </Badge>
            </div>
            <div class="absolute top-3 right-3">
              <Badge variant="secondary" class="bg-background/90 backdrop-blur-sm shadow-sm">{{ getHostname(model.source_url) }}</Badge>
            </div>
          </div>

          <CardHeader>
            <div class="flex justify-between items-start">
              <Badge variant="outline" class="mb-2">{{ model.category }}</Badge>
            </div>
            <CardTitle class="text-xl">{{ model.title }}</CardTitle>
            <CardDescription class="line-clamp-2">{{ model.description }}</CardDescription>
          </CardHeader>
          <CardFooter class="flex gap-3">
            <Button class="flex-1 gap-2">
              <ShoppingCart class="h-4 w-4" />
              Cotizar
            </Button>
            <Button variant="outline" size="icon">
              <ExternalLink class="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div class="mt-12 text-center">
        <p class="text-sm text-muted-foreground mb-4">¿No encuentras lo que buscas?</p>
        <Button variant="link" class="text-primary font-semibold">
          Sube tu propio archivo STL o enlace de repositorio
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
