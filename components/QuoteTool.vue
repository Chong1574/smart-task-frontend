<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, Upload, Link as LinkIcon, Info, CreditCard } from 'lucide-vue-next'

const modelSource = ref('link')
const sourceValue = ref('')
const material = ref('pla')
const color = ref('black')
const infill = ref('15')

const materials = [
  { id: 'pla', name: 'PLA (Estándar)', price: 0.1, description: 'Biodegradable, fácil de imprimir, ideal para decorativos.' },
  { id: 'abs', name: 'ABS (Técnico)', price: 0.15, description: 'Resistente al calor y impactos, ideal para piezas funcionales.' },
  { id: 'petg', name: 'PETG (Híbrido)', price: 0.12, description: 'Resistente y duradero, grado alimenticio.' }
]

const estimatedWeight = computed(() => {
  if (!sourceValue.value) return 0
  return Math.floor(Math.random() * (500 - 20 + 1)) + 20 // Mock weight
})

const totalPrice = computed(() => {
  const mat = materials.find(m => m.id === material.value)
  const basePrice = estimatedWeight.value * (mat?.price || 0.1)
  const serviceFee = 5.0 // Machine time base
  return (basePrice + serviceFee).toFixed(2)
})

const handleQuote = () => {
  // Logic to send to backend/n8n
  console.log('Generating quote...', { sourceValue: sourceValue.value, material: material.value, totalPrice: totalPrice.value })
}
</script>

<template>
  <section id="cotizador" class="py-24">
    <div class="container">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tight mb-4">Cotizador Dinámico</h2>
          <p class="text-muted-foreground">Obtén un presupuesto instantáneo basado en el material y peso estimado.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <!-- Quote Form -->
          <Card class="lg:col-span-3 border-none shadow-xl bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Configura tu pieza</CardTitle>
              <CardDescription>Indícanos qué quieres imprimir y cómo.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-8">
              <div class="space-y-4">
                <Label>Origen del modelo</Label>
                <div class="flex p-1 bg-muted rounded-lg w-fit">
                  <button 
                    @click="modelSource = 'link'"
                    :class="['px-4 py-1.5 text-sm rounded-md transition-all', modelSource === 'link' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground']"
                  >
                    Enlace (Repo)
                  </button>
                  <button 
                    @click="modelSource = 'upload'"
                    :class="['px-4 py-1.5 text-sm rounded-md transition-all', modelSource === 'upload' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground']"
                  >
                    Subir .STL
                  </button>
                </div>

                <div v-if="modelSource === 'link'" class="relative">
                  <LinkIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    v-model="sourceValue"
                    placeholder="https://makerworld.com/..." 
                    class="pl-10"
                  />
                  <p class="text-[10px] text-muted-foreground mt-2">Compatible con MakerWorld, Thingiverse, Printables y Thangs.</p>
                </div>

                <div v-else class="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer group">
                  <Upload class="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                  <p class="text-sm font-medium">Click para subir o arrastra tu archivo STL</p>
                  <p class="text-xs text-muted-foreground mt-1">Máximo 50MB</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <Label>Material</Label>
                  <Select v-model="material">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="mat in materials" :key="mat.id" :value="mat.id">
                        {{ mat.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Info class="h-3 w-3" />
                    {{ materials.find(m => m.id === material)?.description }}
                  </p>
                </div>

                <div class="space-y-3">
                  <Label>Color del filamento</Label>
                  <Select v-model="color">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">Negro Carbón</SelectItem>
                      <SelectItem value="white">Blanco Nieve</SelectItem>
                      <SelectItem value="gray">Gris Galaxia</SelectItem>
                      <SelectItem value="red">Rojo Fuego</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Summary & Checkout -->
          <div class="lg:col-span-2 space-y-6">
            <Card class="border-primary/20 bg-primary/5 shadow-none">
              <CardHeader>
                <CardTitle class="text-lg flex items-center gap-2">
                  <Calculator class="h-5 w-5 text-primary" />
                  Resumen Estimado
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Peso estimado:</span>
                  <span class="font-medium">{{ estimatedWeight }}g</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Costo material:</span>
                  <span class="font-medium">${{ (estimatedWeight * (materials.find(m => m.id === material)?.price || 0)).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Servicio Impresión:</span>
                  <span class="font-medium">$5.00</span>
                </div>
                <div class="border-t pt-4 flex justify-between items-center">
                  <span class="text-lg font-bold">Total:</span>
                  <span class="text-3xl font-extrabold text-primary">${{ totalPrice }}</span>
                </div>
              </CardContent>
            </Card>

            <div class="space-y-4">
              <Label class="text-center block mb-2 text-xs uppercase tracking-widest text-muted-foreground">Pagar con</Label>
              <div class="grid grid-cols-2 gap-3">
                <Button variant="outline" class="h-14 gap-2 bg-background hover:bg-muted border-2" @click="handleQuote">
                  <CreditCard class="h-5 w-5 text-blue-600" />
                  Mercado Pago
                </Button>
                <Button variant="outline" class="h-14 gap-2 bg-background hover:bg-muted border-2" @click="handleQuote">
                  <CreditCard class="h-5 w-5 text-blue-500" />
                  PayPal
                </Button>
              </div>
              <p class="text-[10px] text-center text-muted-foreground">
                Pago seguro garantizado. Al pagar, aceptas nuestros términos de servicio de manufactura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
