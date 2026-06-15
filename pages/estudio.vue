<template>
  <div class="py-12 md:py-24">
    <div class="container max-w-5xl px-4">
      
      <!-- Cabecera -->
      <div class="mb-20">
        <h1 class="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-foreground">
          El Estudio
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Donde las ideas complejas toman forma. Arquitecturas digitales, ingeniería de control y diseño paramétrico convergen para crear soluciones robustas.
        </p>
      </div>

      <!-- Servicios -->
      <div class="space-y-24">
        
        <!-- Desarrollo Web -->
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="flex-1 space-y-6">
            <h2 class="text-3xl font-serif font-bold text-foreground">Desarrollo Web & Software</h2>
            <p class="text-muted-foreground leading-relaxed">
              Construimos plataformas escalables y aplicaciones a medida utilizando tecnologías modernas como Vue, Nuxt, React y Node.js. Desde landing pages ultra rápidas hasta sistemas de gestión complejos (SaaS).
            </p>
            <ul class="space-y-2 text-sm text-foreground/80 font-medium">
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-primary"></div> Arquitecturas Frontend (Nuxt/Vue)</li>
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-primary"></div> Backends API REST / GraphQL</li>
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-primary"></div> Bases de datos y despliegue Cloud</li>
            </ul>
          </div>
          <div class="flex-1 w-full aspect-video bg-secondary/30 rounded-3xl border border-border flex items-center justify-center text-muted-foreground/50 font-serif italic">
            [ Diagrama Arquitectura Cloud ]
          </div>
        </div>

        <!-- Automatización -->
        <div class="flex flex-col md:flex-row-reverse items-center gap-12">
          <div class="flex-1 space-y-6">
            <h2 class="text-3xl font-serif font-bold text-foreground">Automatización e Ingeniería de Control</h2>
            <p class="text-muted-foreground leading-relaxed">
              Optimizamos procesos físicos y digitales. Integramos microcontroladores (ESP32, Arduino), sensores industriales y flujos de trabajo automatizados (n8n) para crear sistemas que trabajan por ti.
            </p>
            <ul class="space-y-2 text-sm text-foreground/80 font-medium">
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#F2A65A]"></div> Internet of Things (IoT)</li>
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#F2A65A]"></div> Automatización de procesos de negocio</li>
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#F2A65A]"></div> Telemetría y monitoreo en tiempo real</li>
            </ul>
          </div>
          <div class="flex-1 w-full aspect-video bg-secondary/30 rounded-3xl border border-border flex items-center justify-center text-muted-foreground/50 font-serif italic">
            [ Esquema de Circuito / IoT ]
          </div>
        </div>

        <!-- Manufactura -->
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="flex-1 space-y-6">
            <h2 class="text-3xl font-serif font-bold text-foreground">Modelado y Manufactura bajo Demanda</h2>
            <p class="text-muted-foreground leading-relaxed">
              Transformamos bocetos en objetos tangibles. Diseño paramétrico en CAD, preparación para impresión 3D (slicing avanzado) y producción iterativa para prototipos funcionales de ingeniería.
            </p>
            <ul class="space-y-2 text-sm text-foreground/80 font-medium">
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-foreground"></div> Diseño CAD Paramétrico</li>
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-foreground"></div> Optimización Topológica</li>
              <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-foreground"></div> Consultoría de Materiales (PLA, ABS, TPU)</li>
            </ul>
          </div>
          <div class="flex-1 w-full aspect-video bg-secondary/30 rounded-3xl border border-border flex items-center justify-center text-muted-foreground/50 font-serif italic">
            [ Renderización CAD 3D ]
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'El Estudio — Desarrollo web, automatización e ingeniería de control',
  description: 'Desarrollo de software a medida con Nuxt, Vue y Node.js. Automatización industrial, ingeniería de control y diseño paramétrico CAD 3D.',
  ogTitle: 'El Estudio — Ingeniería de software y automatización',
  ogDescription: 'Plataformas SaaS, APIs, automatización industrial y diseño paramétrico.',
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
      description: 'Servicios de desarrollo de software, automatización industrial e ingeniería de control.',
      areaServed: 'MX',
      serviceType: [
        'Desarrollo web',
        'Aplicaciones SaaS',
        'APIs REST y GraphQL',
        'Automatización industrial',
        'Ingeniería de control',
        'Diseño paramétrico CAD 3D'
      ],
      parentOrganization: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
    })
  }]
})
</script>
