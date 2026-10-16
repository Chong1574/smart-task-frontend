<template>
  <div class="relative overflow-hidden">
    <!-- Decoración de fondo -->
    <div class="absolute inset-0 z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

    <div class="container max-w-6xl px-4 py-12 md:py-20 relative z-10">
      
      <!-- Cabecera -->
      <div class="text-center max-w-3xl mx-auto mb-20 md:mb-24">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 text-secondary-foreground mb-6 text-sm font-medium">
          La Ventanilla al Taller
        </div>
        <h1 class="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-foreground">
          El Estudio
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed">
          Bienvenido a nuestro centro de operaciones. Da un recorrido por nuestras estaciones de trabajo y descubre cómo convergen el código, la electrónica y la manufactura física.
        </p>
      </div>

      <!-- Recorrido por el Taller -->
      <section class="mb-32">
        <h2 class="text-sm font-bold tracking-widest text-primary uppercase mb-12 text-center">Nuestras Áreas de Ingeniería</h2>
        
        <div class="space-y-16 md:space-y-24">
          <!-- Estación 1: Software -->
          <div id="software" class="scroll-mt-28 flex flex-col lg:flex-row items-center gap-8 md:gap-12 bg-secondary/20 p-6 md:p-12 rounded-[2rem] border border-border/50 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>
                Estación 01
              </div>
              <h3 class="text-3xl md:text-4xl font-serif font-bold text-foreground">La Incubadora de Software</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Aquí construimos plataformas digitales robustas. Como muestra está <strong class="text-foreground">Taskman</strong>, nuestro propio SAAS desarrollado <i>in-house</i> que sincroniza calendarios, finanzas y hábitos gamificados en un ecosistema web ultra rápido.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Vue / Nuxt</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">TypeScript</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Node.js</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Arquitectura Web</span>
              </div>
              <div class="flex flex-wrap gap-3 pt-2">
                <NuxtLink to="/taskman" class="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Explorar Taskman
                </NuxtLink>
                <NuxtLink to="/#contacto" @click="trackProjectContactIntent('estudio_software')" class="inline-flex px-6 py-3 border border-border bg-card rounded-full font-bold text-sm hover:bg-secondary transition-all">
                  Cotizar mi software
                </NuxtLink>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Mockup del dashboard de Taskman -->
              <div class="relative w-full aspect-[16/10] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  <span class="ml-3 text-xs text-muted-foreground">taskman — Dashboard</span>
                </div>
                <div class="p-4 grid grid-cols-3 gap-3 text-xs">
                  <div class="col-span-1 space-y-2">
                    <div class="px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold">Tareas</div>
                    <div class="px-3 py-2 rounded-lg bg-secondary/60">Finanzas</div>
                    <div class="px-3 py-2 rounded-lg bg-secondary/60">Hábitos</div>
                    <div class="px-3 py-2 rounded-lg bg-secondary/60">Proyectos</div>
                  </div>
                  <div class="col-span-2 space-y-2">
                    <div class="flex items-center gap-2 p-2.5 rounded-lg border border-border">
                      <span class="w-4 h-4 rounded border-2 border-primary bg-primary/20"></span>
                      <span class="line-through text-muted-foreground">Sincronizar con Google Calendar</span>
                    </div>
                    <div class="flex items-center gap-2 p-2.5 rounded-lg border border-border">
                      <span class="w-4 h-4 rounded border-2 border-border"></span>
                      <span>Revisar presupuesto del mes</span>
                    </div>
                    <div class="flex items-center gap-2 p-2.5 rounded-lg border border-border">
                      <span class="w-4 h-4 rounded border-2 border-border"></span>
                      <span>Racha de hábitos: 12 días 🔥</span>
                    </div>
                    <div class="h-14 rounded-lg bg-gradient-to-r from-primary/20 via-[#F2A65A]/20 to-primary/5 flex items-end gap-1 p-2">
                      <span class="flex-1 bg-primary/60 rounded-sm h-[40%]"></span>
                      <span class="flex-1 bg-primary/60 rounded-sm h-[70%]"></span>
                      <span class="flex-1 bg-primary/60 rounded-sm h-[55%]"></span>
                      <span class="flex-1 bg-primary/60 rounded-sm h-[90%]"></span>
                      <span class="flex-1 bg-primary/60 rounded-sm h-[65%]"></span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-center text-muted-foreground mt-4 italic">Vista ilustrativa del panel de Taskman.</p>
            </div>
          </div>

          <!-- Estación 2: Control -->
          <div id="control" class="scroll-mt-28 flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-12 p-2 md:p-12">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 text-foreground text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                Estación 02
              </div>
              <h3 class="text-3xl font-serif font-bold text-foreground">El Laboratorio de Control</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                El puente entre el software y el mundo físico. En esta estación escribimos el código profundo que automatiza procesos, lee telemetría de sensores IoT y controla hardware industrial o domótico en tiempo real.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">Python</span>
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">C / C++</span>
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">IoT / Microcontroladores</span>
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">Telemetría</span>
              </div>
              <div class="pt-2">
                <NuxtLink to="/#contacto" @click="trackProjectContactIntent('estudio_control')" class="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Automatizar mi negocio
                </NuxtLink>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Terminal con casos reales -->
              <div class="relative w-full bg-[#0d1117] rounded-2xl overflow-hidden border border-[#30363d] shadow-xl font-mono text-sm text-[#c9d1d9] flex flex-col">
                <div class="flex items-center gap-2 px-5 pt-4 border-b border-[#30363d]">
                  <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500/80 mr-3"></div>
                  <div class="flex gap-1 overflow-x-auto" role="tablist">
                    <button
                      v-for="c in controlCases"
                      :key="c.id"
                      type="button"
                      role="tab"
                      :aria-selected="activeCase === c.id"
                      @click="activeCase = c.id"
                      class="px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors"
                      :class="activeCase === c.id ? 'border-primary text-white' : 'border-transparent text-[#8b949e] hover:text-white'"
                    >{{ c.tab }}</button>
                  </div>
                </div>
                <div class="p-5 min-h-[15rem] select-none whitespace-pre font-light tracking-wide text-xs md:text-sm overflow-x-auto">
                  <div
                    v-for="(line, i) in currentCase.lines"
                    :key="activeCase + i"
                    :class="lineClass(line.t)"
                  >{{ line.s }}</div>
                </div>
              </div>
              <p class="text-xs text-center text-muted-foreground mt-4 italic">{{ currentCase.caption }}</p>
            </div>
          </div>

          <!-- Estación 3: Manufactura -->
          <div id="manufactura" class="scroll-mt-28 flex flex-col lg:flex-row items-center gap-8 md:gap-12 bg-secondary/20 p-6 md:p-12 rounded-[2rem] border border-border/50 transition-all hover:border-border hover:shadow-xl">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 text-foreground text-sm font-bold border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                Estación 03
              </div>
              <h3 class="text-3xl font-serif font-bold text-foreground">El Taller de Manufactura</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Nuestra área de maquinaria. Aquí es donde los bits se convierten en átomos. Operamos software de diseño paramétrico e impresoras de alta resolución para materializar prototipos funcionales y piezas mecánicas finales.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">CAD Paramétrico</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Resina HD</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Impresión FDM (PLA/ABS)</span>
              </div>
              <div class="flex flex-wrap gap-3 pt-2">
                <NuxtLink to="/#contacto" @click="trackProjectContactIntent('estudio_manufactura')" class="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Cotizar pieza a medida
                </NuxtLink>
                <NuxtLink to="/bazar" class="inline-flex px-6 py-3 border border-border bg-card rounded-full font-bold text-sm hover:bg-secondary transition-all">
                  Ver el Bazar
                </NuxtLink>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Comparativa FDM vs Resina -->
              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-2xl bg-card border border-border p-5 space-y-3">
                  <h4 class="font-serif font-bold text-lg">FDM</h4>
                  <p class="text-xs text-muted-foreground">Filamento (PLA / ABS / PETG)</p>
                  <ul class="text-sm space-y-2">
                    <li>✅ Piezas funcionales y resistentes</li>
                    <li>✅ Mayor volumen, menor costo</li>
                    <li>✅ Ideal para refacciones y prototipos</li>
                    <li class="text-muted-foreground">➖ Se notan las capas</li>
                  </ul>
                </div>
                <div class="rounded-2xl bg-card border border-border p-5 space-y-3">
                  <h4 class="font-serif font-bold text-lg">Resina HD</h4>
                  <p class="text-xs text-muted-foreground">Fotopolímero (SLA / MSLA)</p>
                  <ul class="text-sm space-y-2">
                    <li>✅ Detalle y acabado superficial finos</li>
                    <li>✅ Miniaturas, joyería y maquetas</li>
                    <li>✅ Tolerancias precisas</li>
                    <li class="text-muted-foreground">➖ Más frágil y de menor tamaño</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs text-center text-muted-foreground mt-4 italic">¿No sabes cuál elegir? Cuéntanos tu pieza y te recomendamos.</p>
            </div>
          </div>
          
        </div>
      </section>

      <!-- CTA -->
      <div class="text-center pb-12">
        <h3 class="text-3xl font-serif font-bold mb-6">¿Quieres construir algo en nuestro estudio?</h3>
        <p class="text-muted-foreground mb-8 max-w-lg mx-auto">Ya sea desarrollo de software, integración IoT o prototipado físico, nuestras estaciones están listas.</p>
        <NuxtLink to="/#contacto" @click="trackProjectContactIntent('estudio_cta')" class="inline-flex px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Cotizar un Proyecto
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { trackProjectContactIntent } from '~/utils/analytics'

const controlCases = [
  {
    id: 'cerraduras',
    tab: 'cerraduras.py',
    caption: 'Ejemplo ilustrativo: control de cerraduras inteligentes TTLock.',
    lines: [
      { t: 'k', s: 'from ttlock import Lock, Gateway' },
      { t: 'p', s: '' },
      { t: 'k', s: 'def open_for_guest(guest, hours=24):' },
      { t: 'p', s: '    lock = Lock.get("entrada-principal")' },
      { t: 'p', s: '    code = lock.create_passcode(guest, hours)' },
      { t: 'p', s: '    notify(guest, code)' },
      { t: 'p', s: '' },
      { t: 'c', s: '# Terminal' },
      { t: 'o', s: '>> Código temporal generado... OK [200]' }
    ]
  },
  {
    id: 'n8n',
    tab: 'flujo_n8n.py',
    caption: 'Ejemplo ilustrativo: automatización de pedidos y notificaciones con n8n.',
    lines: [
      { t: 'k', s: 'from n8n import Webhook, Flow' },
      { t: 'p', s: '' },
      { t: 'k', s: '@Webhook("/pago-confirmado")' },
      { t: 'k', s: 'def on_payment(order):' },
      { t: 'p', s: '    Flow.update_status(order.id, "PRINTING")' },
      { t: 'p', s: '    Flow.send_whatsapp(order.phone, "Pedido en producción")' },
      { t: 'p', s: '' },
      { t: 'c', s: '# Terminal' },
      { t: 'o', s: '>> Pedido #128 → PRINTING... OK [200]' }
    ]
  },
  {
    id: 'sensores',
    tab: 'telemetria.py',
    caption: 'Ejemplo ilustrativo: telemetría de sensores en una Raspberry Pi.',
    lines: [
      { t: 'k', s: 'import automation_engine as ae' },
      { t: 'k', s: 'from sensors import Telemetry' },
      { t: 'p', s: '' },
      { t: 'k', s: 'def monitor_system():' },
      { t: 'p', s: '    engine = ae.Controller(port=8080)' },
      { t: 'p', s: '    while True:' },
      { t: 'p', s: '        if Telemetry.read().threshold_exceeded():' },
      { t: 'p', s: '            engine.trigger_alert()' },
      { t: 'c', s: '# Terminal' },
      { t: 'o', s: '>> Conectando a sensores... OK [200]' }
    ]
  }
]

const activeCase = ref('cerraduras')
const currentCase = computed(() => controlCases.find(c => c.id === activeCase.value) || controlCases[0])

function lineClass(t) {
  if (t === 'k') return 'text-[#ff7b72]'
  if (t === 'c') return 'text-[#8b949e] mt-2'
  if (t === 'o') return 'text-[#7ee787] animate-pulse'
  return ''
}

useSeoMeta({
  title: 'El Estudio — Taller de Software, Automatización y Manufactura 3D',
  description: 'Da un recorrido por nuestras estaciones de trabajo: incubadora de software (Taskman), laboratorio de control con Python/C++, y taller de manufactura 3D.',
  ogTitle: 'El Estudio — Taller de Innovación Tecnológica',
  ogDescription: 'Conoce nuestras áreas de ingeniería: desarrollo de SaaS, domótica e IoT, y diseño paramétrico 3D.',
  ogType: 'website',
  ogUrl: 'https://shongyi.com/estudio',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'El Estudio — El Rincón de Brandy',
      url: 'https://shongyi.com/estudio',
      description: 'Taller de innovación y desarrollo de software, automatización industrial, control e ingeniería 3D.',
      areaServed: 'MX',
      serviceType: [
        'Desarrollo web',
        'Aplicaciones SaaS',
        'Automatización con Python',
        'Sistemas IoT y C++',
        'Ingeniería de control',
        'Manufactura 3D'
      ],
      parentOrganization: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
    })
  }]
})
</script>
